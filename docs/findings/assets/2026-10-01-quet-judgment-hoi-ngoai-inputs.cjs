#!/usr/bin/env node
/*
 * Quét mọi evals.yaml của các kho tiêu thụ dưới <dev_root>: eval judgment nào HỎI
 * thứ hội đồng không đọc được (diff của lượt, chạy lệnh) mà danh sách inputs không
 * có — và hội đồng đã trả gì cho nó (run-log.jsonl kind:panel, hoặc verdict trong
 * evidence-report.md với hồ sơ cũ chưa có dòng panel).
 *
 * Dùng: node 2026-10-01-quet-judgment-hoi-ngoai-inputs.cjs <dev_root>
 * Bản ghi phát hiện: ../2026-10-01-thuoc-biet-truoc-khong-phan-duoc.md
 *
 * Gốc kit suy từ vị trí script (docs/findings/assets → ../../..), không hardcode.
 * Một hồ sơ có nhiều bản (worktree) → lấy bản mtime mới nhất theo kho/slug.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const KIT = path.resolve(__dirname, '..', '..', '..');
const ey = require(path.join(KIT, 'lib', 'eval-yaml.cjs'));
const DEV = process.argv[2];
if (!DEV) { console.error('thiếu <dev_root>'); process.exit(2); }

// Bộ dò HẸP (ứng viên cho chốt máy): hỏi diff của lượt / chạy lệnh. KHÔNG miễn khi
// inputs có một tệp tên «diff»: tệp diff làm tay là lịch sử đóng băng — mã đổi mà tệp
// không đổi thì bộ nhớ hội đồng (P3, băm inputs) mang phán quyết cũ sang mã mới
// (crm gioi-han-duyet-cay-okr E25: tệp 500 dòng chỉ có --stat, hai vòng UNCERTAIN).
const DIFF_REQ = /\bgit\s+(-C\s+\S+\s+)?diff\b|\bdiffBase\b|\.\.\.\s*HEAD\b|\bdiff\b[^.\n]{0,25}\b(lượt|luot|PR|round|nhánh|nhanh|branch|HEAD|commit)\b|\b(nhìn|nhin|đọc|doc|read|so)\s+(bản\s+)?diff\b/i;
const CMD_REQ = /(^|\s)(Run|Chạy|Chay)\s*:?\s*`|\bgrep\s+-|\bgit\s+-C\b/i;
// Bộ dò RỘNG (chỉ để đếm, KHÔNG làm chốt): đường dẫn mã trong câu hỏi mà inputs không phủ.
const CODEPATH = /(?:^|[\s`(«"'])((?:apps|packages|src|lib|scripts|server|app|components|supabase)\/[\w@.\/\[\]()-]+)/g;

function inputsOf(text, id) {
  const lines = text.split('\n');
  const i = lines.findIndex(l => new RegExp('^\\s*-\\s+id:\\s*' + id + '\\s*$').test(l));
  if (i < 0) return [];
  for (let j = i + 1; j < lines.length; j++) {
    if (/^\s*-\s+id:/.test(lines[j])) break;
    const m = lines[j].match(/^\s*inputs:\s*\[(.*)\]\s*$/);
    if (m) return m[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    if (/^\s*inputs:\s*$/.test(lines[j])) {
      const r = [];
      for (let k = j + 1; k < lines.length; k++) {
        const mm = lines[k].match(/^\s*-\s+(.+)$/);
        if (!mm || /^\s*-\s+\w+:/.test(lines[k])) break;
        r.push(mm[1].trim().replace(/^['"]|['"]$/g, ''));
      }
      return r;
    }
  }
  return [];
}

function lastPanel(dir, id) {
  try {
    const ps = fs.readFileSync(path.join(dir, 'run-log.jsonl'), 'utf8').split('\n').filter(Boolean)
      .map(l => { try { return JSON.parse(l); } catch { return null; } })
      .filter(x => x && x.kind === 'panel' && x.evalId === id);
    if (ps.length) return { rounds: ps.length, chain: ps.map(p => p.proposal).join('>'), last: ps[ps.length - 1].proposal };
  } catch {}
  try {
    const ev = fs.readFileSync(path.join(dir, 'evidence-report.md'), 'utf8');
    const at = ev.indexOf('eval: ' + id + '\n');
    if (at >= 0) {
      const v = ev.slice(at, at + 3000).split(/\n- eval: /)[0].match(/\bverdict:\s*(\w+)/);
      if (v) return { rounds: 1, chain: v[1], last: v[1] };
    }
  } catch {}
  return null;
}

const files = cp.execSync(
  `find ${JSON.stringify(DEV)} -path '*/node_modules' -prune -o -path '*/_archive' -prune -o -name evals.yaml -path '*_acceptance*' -print 2>/dev/null`,
  { maxBuffer: 1e8 }).toString().trim().split('\n').filter(Boolean);
const bySlug = new Map();
for (const f of files) {
  if (f.startsWith(KIT) || f.includes('/acceptance-gate-kit/') || /\/tests?\/|fixture/.test(f)) continue;
  const m = f.match(/\/([^/]+)\/(?:.*\/)?_acceptance\/([^/]+)\/evals\.yaml$/);
  const rel = path.relative(DEV, f).split(path.sep);
  if (!m || rel.length < 2) continue;
  const key = rel[0] + '/' + m[2];
  const mt = fs.statSync(f).mtimeMs;
  if (!bySlug.has(key) || bySlug.get(key).mt < mt) bySlug.set(key, { f, mt });
}

const t = { kho: new Set(), hoSo: 0, judgment: 0, rong: 0, hep: 0 };
const tally = { hep: {}, khac: {} };
const hits = [];
for (const [key, { f }] of bySlug) {
  const text = fs.readFileSync(f, 'utf8');
  t.hoSo++; t.kho.add(key.split('/')[0]);
  for (const e of ey.parseEvals(text, ['executor', 'question'], s => s.trim())) {
    if (e.executor !== 'judgment') continue;
    t.judgment++;
    const q = e.question || '';
    const inp = inputsOf(text, e.id);
    const paths = [...q.matchAll(CODEPATH)].map(m => m[1].replace(/[.,;:)»"'`]+$/, ''));
    const ngoai = paths.filter(p => !inp.some(i => i === p || i.startsWith(p) || p.startsWith(i)));
    const hep = DIFF_REQ.test(q) || CMD_REQ.test(q);
    if (hep || ngoai.length || DIFF_REQ.test(q)) t.rong++;
    const p = lastPanel(path.dirname(f), e.id);
    const bucket = hep ? tally.hep : tally.khac;
    if (p) bucket[p.last] = (bucket[p.last] || 0) + 1;
    if (hep) { t.hep++; hits.push({ key, id: e.id, p, m: (q.match(DIFF_REQ) || q.match(CMD_REQ) || [''])[0] }); }
  }
}
console.log(`kho: ${t.kho.size} · hồ sơ: ${t.hoSo} · eval judgment: ${t.judgment}`);
console.log(`bộ dò RỘNG (diff | lệnh | đường dẫn mã ngoài inputs): ${t.rong}`);
console.log(`bộ dò HẸP (hỏi diff của lượt | bảo chạy lệnh): ${t.hep}`);
console.log(`phán quyết cuối của hội đồng — HẸP: ${JSON.stringify(tally.hep)} · còn lại: ${JSON.stringify(tally.khac)}`);
for (const h of hits) console.log(`  ${h.key} ${h.id} «${h.m}» → ${h.p ? h.p.chain : 'chưa chấm'}`);
