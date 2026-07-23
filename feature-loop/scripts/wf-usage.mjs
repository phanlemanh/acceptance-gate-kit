#!/usr/bin/env node
// wf-usage.mjs — đo model + token THẬT per agent cho MỘT Workflow run của
// feature-loop (S1 fan-out / S3 execute-parallel / S4 acceptance-verify).
//
// Nguồn sự thật: transcript agent-*.jsonl trong thư mục run của Workflow
// (~/.claude/projects/<proj>/<session>/subagents/workflows/wf_*/). Mỗi dòng
// assistant mang message.model + message.usage — cái ĐÃ chạy, không phải cái
// config hứa. Đây là chỗ kiểm chứng feature_loop.models có hiệu lực thật.
//
// Hai điểm dễ sai mà script xử lý:
//   1) MỘT API call ghi NHIỀU dòng transcript (cùng message.id, usage là
//      snapshot lớn dần) → dedupe theo id, lấy MAX từng field; cộng ngây thơ
//      phồng 2-3× (đo thực trên run wf_b6c6e94b: 17 dòng / 7 id).
//   2) opts.label KHÔNG được harness ghi xuống file → map agent → task bằng
//      tag "[wf-label: ...]" ở dòng đầu prompt (2 workflow của kit nhúng sẵn
//      từ v1.15). Prompt không có tag → fallback 48 ký tự đầu prompt.
//
// Usage:
//   node wf-usage.mjs <wf-transcript-dir> [--md|--json] [--title <s>]
//   node wf-usage.mjs --latest [--md|--json] [--title <s>]   # run mới nhất của repo hiện tại (theo cwd)
// Exit: 0 ok · 2 usage sai / không tìm thấy run.
// ADVISORY: caller (feature-loop SKILL) KHÔNG được chặn vòng lặp vì script này lỗi.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const argv = process.argv.slice(2);
const die = (msg) => { process.stderr.write(`wf-usage: ${msg}\n`); process.exit(2); };

let dir = null, mode = 'text', title = '', latest = false;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--md') mode = 'md';
  else if (a === '--json') mode = 'json';
  else if (a === '--latest') latest = true;
  else if (a === '--title') title = argv[++i] || '';
  else if (a.startsWith('--')) die(`flag lạ: ${a}`);
  else if (!dir) dir = a;
  else die(`thừa arg: ${a}`);
}

// ── tìm run mới nhất của repo hiện tại: cwd → slug thư mục project của Claude Code ──
if (latest && !dir) {
  const slug = process.cwd().replace(/[^A-Za-z0-9]/g, '-');
  const projRoot = path.join(os.homedir(), '.claude', 'projects', slug);
  let best = null;
  for (const sess of safeList(projRoot)) {
    const wfRoot = path.join(projRoot, sess, 'subagents', 'workflows');
    for (const wf of safeList(wfRoot).filter(n => n.startsWith('wf_'))) {
      const d = path.join(wfRoot, wf);
      const probe = fs.existsSync(path.join(d, 'journal.jsonl')) ? path.join(d, 'journal.jsonl') : d;
      const mtime = fs.statSync(probe).mtimeMs;
      if (!best || mtime > best.mtime) best = { dir: d, mtime };
    }
  }
  if (!best) die(`--latest: không thấy run Workflow nào dưới ${projRoot}`);
  dir = best.dir;
}
if (!dir) die('usage: wf-usage.mjs <wf-transcript-dir>|--latest [--md|--json] [--title <s>]');
if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) die(`không phải thư mục: ${dir}`);

function safeList(p) {
  try { return fs.readdirSync(p); } catch { return []; }
}

// ── parse 1 transcript agent-*.jsonl → rows per (agent × model) ─────────────
const USAGE_FIELDS = ['input_tokens', 'output_tokens', 'cache_read_input_tokens', 'cache_creation_input_tokens'];

function textOf(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) return content.map(b => (b && b.text) || '').join(' ');
  return '';
}

function parseAgent(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map(l => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
  if (!lines.length) return null;

  const firstUser = lines.find(l => l.type === 'user' && l.message);
  const head = firstUser ? textOf(firstUser.message.content) : '';
  const tag = head.match(/\[wf-label:\s*([^\]\n]+)\]/);
  const label = tag ? tag[1].trim() : (head.replace(/\s+/g, ' ').trim().slice(0, 48) || '(prompt rỗng)');

  // dedupe theo message.id: usage là snapshot lớn dần trong cùng call → max từng field
  const byId = new Map();
  for (const l of lines) {
    if (l.type !== 'assistant' || !l.message || !l.message.usage || !l.message.id) continue;
    const cur = byId.get(l.message.id) || { model: l.message.model || '(?)' };
    for (const f of USAGE_FIELDS) cur[f] = Math.max(cur[f] || 0, l.message.usage[f] || 0);
    byId.set(l.message.id, cur);
  }

  const perModel = new Map();
  for (const call of byId.values()) {
    const acc = perModel.get(call.model) || { calls: 0, input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 };
    acc.calls++;
    for (const f of USAGE_FIELDS) acc[f] += call[f] || 0;
    perModel.set(call.model, acc);
  }

  const ts = lines.map(l => l.timestamp).filter(Boolean);
  const seconds = ts.length >= 2 ? Math.round((Date.parse(ts[ts.length - 1]) - Date.parse(ts[0])) / 1000) : 0;
  const agentId = path.basename(file).replace(/^agent-/, '').replace(/\.jsonl$/, '');

  return [...perModel.entries()].map(([model, u]) => ({
    agent: agentId.slice(0, 8), label, model, seconds,
    calls: u.calls, in: u.input_tokens, out: u.output_tokens,
    cacheRead: u.cache_read_input_tokens, cacheCreate: u.cache_creation_input_tokens,
  }));
}

const files = safeList(dir).filter(n => /^agent-.*\.jsonl$/.test(n)).sort();
const rows = files.flatMap(f => parseAgent(path.join(dir, f)) || []);
rows.sort((a, b) => b.out - a.out);

const byModel = new Map();
for (const r of rows) {
  const t = byModel.get(r.model) || { agents: 0, calls: 0, in: 0, out: 0, cacheRead: 0, cacheCreate: 0 };
  t.agents++; t.calls += r.calls; t.in += r.in; t.out += r.out; t.cacheRead += r.cacheRead; t.cacheCreate += r.cacheCreate;
  byModel.set(r.model, t);
}
const total = [...byModel.values()].reduce(
  (s, t) => ({ agents: s.agents + t.agents, calls: s.calls + t.calls, in: s.in + t.in, out: s.out + t.out, cacheRead: s.cacheRead + t.cacheRead, cacheCreate: s.cacheCreate + t.cacheCreate }),
  { agents: 0, calls: 0, in: 0, out: 0, cacheRead: 0, cacheCreate: 0 });

const runId = path.basename(dir);
const fmt = (n) => n.toLocaleString('en-US');

if (mode === 'json') {
  process.stdout.write(JSON.stringify({ runDir: dir, runId, title: title || undefined, agents: rows, totalsByModel: Object.fromEntries(byModel), total }, null, 2) + '\n');
} else if (mode === 'md') {
  const esc = (s) => s.replace(/\|/g, '\\|');
  const out = [];
  out.push(`### ${title ? `${title} — ` : ''}${runId} (${total.agents} agent, ${fmt(total.out)} out-tok)`);
  out.push('');
  out.push('| label | model | calls | out | in | cache_read | s |');
  out.push('|---|---|--:|--:|--:|--:|--:|');
  for (const r of rows) out.push(`| ${esc(r.label)} | ${r.model} | ${r.calls} | ${fmt(r.out)} | ${fmt(r.in)} | ${fmt(r.cacheRead)} | ${r.seconds} |`);
  out.push('');
  for (const [m, t] of byModel) out.push(`- **${m}**: ${t.agents} agent · ${t.calls} calls · out ${fmt(t.out)} · in ${fmt(t.in)} · cache_read ${fmt(t.cacheRead)} · cache_create ${fmt(t.cacheCreate)}`);
  out.push('');
  process.stdout.write(out.join('\n') + '\n');
} else {
  const W = { label: 44, model: 18, calls: 5, out: 9, in: 9, cacheRead: 11, s: 5 };
  const pad = (s, w, right) => right ? String(s).padStart(w) : String(s).padEnd(w);
  console.log(`${runId}${title ? ` — ${title}` : ''}: ${total.agents} agent`);
  console.log([pad('label', W.label), pad('model', W.model), pad('calls', W.calls, 1), pad('out', W.out, 1), pad('in', W.in, 1), pad('cache_read', W.cacheRead, 1), pad('s', W.s, 1)].join(' '));
  for (const r of rows) {
    console.log([pad(r.label.slice(0, W.label), W.label), pad(r.model.slice(0, W.model), W.model), pad(r.calls, W.calls, 1), pad(fmt(r.out), W.out, 1), pad(fmt(r.in), W.in, 1), pad(fmt(r.cacheRead), W.cacheRead, 1), pad(r.seconds, W.s, 1)].join(' '));
  }
  console.log('— tổng theo model —');
  for (const [m, t] of byModel) console.log(`  ${m}: ${t.agents} agent · ${t.calls} calls · out ${fmt(t.out)} · in ${fmt(t.in)} · cache_read ${fmt(t.cacheRead)} · cache_create ${fmt(t.cacheCreate)}`);
  console.log(`  TỔNG: ${total.agents} agent · ${total.calls} calls · out ${fmt(total.out)} · in ${fmt(total.in)} · cache_read ${fmt(total.cacheRead)}`);
}
