#!/usr/bin/env node
// loop-health.mjs — ba dòng số của luật (c) và mốc cùng hạng, ĐẾM BẰNG MÁY.
//
// Vì sao: CLAUDE.md luật (c) đòi mỗi mốc phát hành đếm ba dòng số (làm-xong→quyết-được ·
// lượt gọi người/vòng · vòng bị hạ-tầng đốt) và so với mốc cùng hạng. Tới 08/09/2026 cả ba
// vẫn đếm tay ở mỗi mốc — kế hoạch `loop-health` (audit 28/07) chưa từng dựng. Số đắt thì
// người bỏ đếm, và luật hoá hình thức.
//
//   node scripts/loop-health.mjs --root <repo> [--at <sha>] [--since <ref>]
//                                [--all] [--dev-root <dir>] [--json]
//                                [--exclude-slug <s>]... [--check-hand <file.json>]
//
// --at <sha>   đọc hồ sơ qua `git show <sha>:<path>` — TẬP BẤT BIẾN. Không có nó thì số
//              trôi theo mỗi hồ sơ mới thêm vào cây, và mọi ngưỡng ghim lên cây sống sẽ đỏ
//              vì hạ tầng chứ không vì vật.
// --check-hand so số máy với số đếm tay đã ghi ({tiers:{T2:{...}}, tol:{...}}); lệch → exit 1
//              in số máy cạnh số tay + slug lệch nhiều nhất, để tìm cho ra bên nào sai.
//
// GIỚI HẠN ĐÃ KHAI: dòng «lượt gọi người» KHÔNG đếm được bằng máy — nó sống trong bản ghi
// phiên, ngoài repo, và không gán được cho slug. Script đọc `human_calls:` ở frontmatter hợp
// đồng nếu hồ sơ khai; không khai thì in «đếm tay». Khai giới hạn còn hơn bịa một con số.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const argv = process.argv.slice(2);
const flag = (name, def = null) => { const i = argv.indexOf('--' + name); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : def; };
const has = name => argv.includes('--' + name);
const many = name => argv.reduce((acc, a, i) => (a === '--' + name && argv[i + 1] ? [...acc, argv[i + 1]] : acc), []);
const die = (m, code = 2) => { process.stderr.write('loop-health: ' + m + '\n'); process.exit(code); };

const ROOT = path.resolve(flag('root', '.'));
const AT = flag('at');
const SINCE = flag('since');
const JSON_OUT = has('json');
const EXCLUDE = new Set(many('exclude-slug'));
const CHECK_HAND = flag('check-hand');
const DEV_ROOT = flag('dev-root', path.dirname(ROOT));

// `git show` cho file không có ở sha đó in ra stderr — ở đây là chuyện BÌNH THƯỜNG
// (hồ sơ không có usage-report/decisions), nên nuốt stderr thay vì rải fatal ra màn hình.
const git = (cwd, ...a) => { try { return execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch (_) { return ''; } };
const num = s => { const n = Number(String(s).replace(/[^0-9.]/g, '')); return Number.isFinite(n) ? n : 0; };
const fm = (t, k) => { const m = String(t || '').match(new RegExp('^' + k + ':\\s*(.*)$', 'm')); return m ? m[1].trim() : ''; };

// ── đọc hồ sơ: từ cây làm việc, hoặc từ một sha bất biến ────────────────────
function reader(root, at) {
  if (!at) return {
    slugs: () => { try { return fs.readdirSync(path.join(root, '_acceptance')).filter(s => fs.existsSync(path.join(root, '_acceptance', s, 'contract.md'))); } catch (_) { return []; } },
    read: (slug, f) => { try { return fs.readFileSync(path.join(root, '_acceptance', slug, f), 'utf8'); } catch (_) { return null; } },
  };
  const tree = git(root, 'ls-tree', '-r', '--name-only', at, '_acceptance/');
  if (!tree.trim()) die(`không đọc được cây tại ${at} (sha sai, hoặc repo không có _acceptance/)`);
  const slugs = [...new Set(tree.split('\n').filter(l => /^_acceptance\/[^/]+\/contract\.md$/.test(l)).map(l => l.split('/')[1]))];
  return {
    slugs: () => slugs,
    read: (slug, f) => { const o = git(root, 'show', `${at}:_acceptance/${slug}/${f}`); return o === '' ? null : o; },
  };
}

// ── số của MỘT hồ sơ ────────────────────────────────────────────────────────
function measureSlug(root, rd, slug) {
  const c = rd.read(slug, 'contract.md');
  if (!c) return null;
  const tier = (fm(c, 'risk_tier').split('#')[0].trim() || 'T?').toUpperCase();
  const ev = rd.read(slug, 'evidence-report.md') || '';
  const usage = rd.read(slug, 'usage-report.md') || '';
  const rl = rd.read(slug, 'run-log.jsonl') || '';
  const dj = rd.read(slug, 'decisions.jsonl') || '';

  // round theo hai nguồn ĐỘC LẬP: `## Iterations` của báo cáo và số section S4 của usage.
  const it = ev.split(/^##\s+Iterations/m)[1] || '';
  const roundNums = [...it.matchAll(/^\s*(?:[-*]\s*)?(?:\*\*)?Round\s+(\d+)/gim)].map(m => Number(m[1]));
  const roundsIter = roundNums.length ? Math.max(...roundNums) : 0;
  const s4Heads = [...usage.matchAll(/^###\s+S4\s+round\s+(\d+)/gim)].map(m => Number(m[1]));
  const roundsUsage = s4Heads.length ? new Set(s4Heads).size : 0;

  // token S4: nguồn ĐÚNG là dòng tổng per-model của mỗi section S4 —
  //   `- **<model>**: N agent · N calls · out X · in Y · cache_read Z · cache_create W`
  // vì BẢNG của wf-usage.mjs không có cột cache_create (mà nó là ~6% hoá đơn thật). Cộng
  // bảng thay dòng tổng là chỗ số máy lệch số tay 10% khi dựng script này (09/09).
  // Đường đọc-cũ: usage-report thế hệ trước không có dòng per-model → cộng bảng
  // (out+in+cache_read) và số sẽ THẤP hơn thật; hồ sơ nào đi đường đó thì biết vì thiếu dòng.
  let tokenS4 = 0;
  let inS4 = false;
  let sectionHadPerModel = false;
  let sectionTable = 0;
  const flushSection = () => { if (!sectionHadPerModel) tokenS4 += sectionTable; sectionTable = 0; sectionHadPerModel = false; };
  for (const l of usage.split('\n')) {
    if (/^###\s+/.test(l)) { flushSection(); inS4 = /^###\s+S4\s+round/i.test(l); continue; }
    if (!inS4) continue;
    const pm = l.match(/^-\s+\*\*[^*]+\*\*:\s*(.*)$/);
    if (pm) {
      const g = k => { const m = pm[1].match(new RegExp(k + '\\s+([0-9,\\.]+)')); return m ? num(m[1]) : 0; };
      tokenS4 += g('out') + g('in') + g('cache_read') + g('cache_create');
      sectionHadPerModel = true;
      continue;
    }
    if (!l.startsWith('|')) continue;
    const cells = l.split('|').map(s => s.trim());
    if (cells.length < 8 || /^-+$/.test(cells[1]) || cells[3] === 'calls') continue;
    sectionTable += num(cells[4]) + num(cells[5]) + num(cells[6]);
  }
  flushSection();

  const repin = (rl.match(/"kind":"repin"/g) || []).length;
  const fixS4 = dj.split('\n').filter(l => /"type":"fix"/.test(l) && /"stage":"S4-r\d+"/.test(l)).length;
  // vòng bị HẠ TẦNG đốt: round báo BLOCKED trong Iterations + mỗi làn ghim lại (mỗi làn là
  // một lượt chấm phải chạy lại mà không mang thông tin nào về vật).
  const blockedRounds = (it.match(/BLOCKED/g) || []).length;
  const infraBurned = blockedRounds + repin;

  // làm-xong → quyết-được: commit ĐẦU ghi `status: implemented` → commit ĐẦU ghi chữ ký.
  const cpath = `_acceptance/${slug}/contract.md`;
  const firstOf = needle => {
    const out = git(root, 'log', '--format=%cI', '--reverse', '-S', needle, '--', cpath).trim();
    return out ? out.split('\n')[0] : '';
  };
  const tImpl = firstOf('status: implemented');
  const tDone = firstOf('status: signed-off') || firstOf('status: machine-cleared');
  const minutes = tImpl && tDone ? Math.round((Date.parse(tDone) - Date.parse(tImpl)) / 60000) : null;

  const hc = fm(c, 'human_calls');
  return {
    slug, tier,
    minutes,
    human_calls: hc ? num(hc) : null,
    infra_burned: infraBurned,
    rounds_iter: roundsIter,
    rounds_usage: roundsUsage,
    token_s4: tokenS4,
    repin, fix_s4: fixS4,
  };
}

function measureRepo(root, at) {
  const rd = reader(root, at);
  const rows = [];
  for (const s of rd.slugs()) {
    if (EXCLUDE.has(s)) continue;
    const r = measureSlug(root, rd, s);
    if (r) rows.push(r);
  }
  const tiers = {};
  for (const t of ['T2', 'T3']) {
    const rs = rows.filter(r => r.tier === t);
    const avg = (sel, filter = x => x > 0) => { const v = rs.map(sel).filter(filter); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0; };
    tiers[t] = {
      n: rs.length,
      round_usage: +avg(r => r.rounds_usage).toFixed(2),
      round_iter: +avg(r => r.rounds_iter).toFixed(2),
      token_s4: Math.round(avg(r => r.token_s4)),
      repin: rs.reduce((a, r) => a + r.repin, 0),
      fix_s4: rs.reduce((a, r) => a + r.fix_s4, 0),
    };
  }
  return { root, at: at || null, rows, tiers };
}

// ── cửa sổ: hồ sơ có chữ ký sau <ref> (ba dòng số của luật (c)) ─────────────
function windowRows(root, res, since) {
  if (!since) return res.rows;
  const base = git(root, 'rev-parse', since).trim();
  if (!base) die(`--since ${since} không giải được`);
  const touched = new Set(git(root, 'diff', '--name-only', `${base}..HEAD`).split('\n')
    .filter(l => l.startsWith('_acceptance/')).map(l => l.split('/')[1]));
  return res.rows.filter(r => touched.has(r.slug));
}

const fmtTok = n => (n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n.toLocaleString('en-US'));

function printText(res, rows) {
  const out = [];
  out.push(`# loop-health — ${path.basename(res.root)}${res.at ? ` @ ${res.at}` : ''}`);
  out.push('');
  out.push('## Ba dòng số của luật (c)');
  const withMin = rows.filter(r => r.minutes != null);
  out.push(`- làm-xong → quyết-được: ${withMin.length ? `${withMin.map(r => `${r.slug} ${r.minutes}′`).join(' · ')}` : 'không hồ sơ nào có cả hai mốc trong lịch sử git'}`);
  const hc = rows.filter(r => r.human_calls != null);
  out.push(`- lượt gọi người/vòng: ${hc.length ? hc.map(r => `${r.slug} ${r.human_calls}`).join(' · ') : 'đếm tay (không hồ sơ nào khai human_calls:)'}`);
  out.push(`- vòng bị hạ-tầng đốt: ${rows.reduce((a, r) => a + r.infra_burned, 0)} (round BLOCKED + làn ghim lại)`);
  out.push('');
  out.push('## Mốc cùng hạng');
  out.push('| tier | hồ sơ | round (usage) | round (Iterations) | token S4 TB | ghim lại | fix S4 |');
  out.push('|---|--:|--:|--:|--:|--:|--:|');
  for (const t of ['T2', 'T3']) {
    const x = res.tiers[t];
    out.push(`| ${t} | ${x.n} | ${x.round_usage} | ${x.round_iter} | ${fmtTok(x.token_s4)} | ${x.repin} | ${x.fix_s4} |`);
  }
  return out.join('\n');
}

function checkHand(res, file) {
  let hand;
  try { hand = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { die(`không đọc được --check-hand ${file}: ${e.message}`); }
  const tol = hand.tol || {};
  const bad = [];
  for (const t of Object.keys(hand.tiers || {})) {
    for (const [k, want] of Object.entries(hand.tiers[t])) {
      const got = res.tiers[t] ? res.tiers[t][k] : undefined;
      const eps = k.startsWith('round') ? (tol.round ?? 0.05) : k === 'token_s4' ? (tol.token ?? 5e5) : (tol.round ?? 0.05);
      if (got === undefined || Math.abs(got - want) > eps) bad.push({ tier: t, key: k, want, got, eps });
    }
  }
  if (!bad.length) { console.log('PASS: LH-THAT'); return 0; }
  console.log('số MÁY lệch số TAY (một trong hai sai — tìm cho ra, đừng sửa thước theo vật):');
  for (const b of bad) console.log(`  ${b.tier}.${b.key}: máy ${b.got} · tay ${b.want} (dung sai ${b.eps})`);
  for (const b of bad.filter(x => x.key === 'token_s4' || x.key.startsWith('round'))) {
    const rs = res.rows.filter(r => r.tier === b.tier);
    const key = b.key === 'token_s4' ? 'token_s4' : b.key === 'round_usage' ? 'rounds_usage' : 'rounds_iter';
    const worst = rs.map(r => ({ slug: r.slug, v: r[key], d: Math.abs(r[key] - b.want) })).sort((x, y) => y.d - x.d)[0];
    if (worst) console.log(`    slug lệch nhiều nhất cho ${b.tier}.${b.key}: ${worst.slug} (${worst.v})`);
  }
  return 1;
}

// ── main ────────────────────────────────────────────────────────────────────
if (has('all')) {
  const byRemote = new Map();
  let dirs = [];
  try { dirs = fs.readdirSync(DEV_ROOT); } catch (e) { die(`--dev-root ${DEV_ROOT} không đọc được: ${e.message}`); }
  for (const d of dirs) {
    const r = path.join(DEV_ROOT, d);
    if (!fs.existsSync(path.join(r, '_acceptance'))) continue;
    const rem = (git(r, 'remote', 'get-url', 'origin').trim() || '?' + d).replace(/\.git$/, '');
    const res = measureRepo(r, null);
    const prev = byRemote.get(rem);
    if (!prev || prev.rows.length < res.rows.length) byRemote.set(rem, res);
  }
  if (!byRemote.size) { console.log(`không cây nào dưới ${DEV_ROOT} có _acceptance/`); process.exit(0); }
  const all = [...byRemote.values()];
  if (JSON_OUT) { console.log(JSON.stringify(all.map(r => ({ repo: path.basename(r.root), tiers: r.tiers, n: r.rows.length })), null, 2)); process.exit(0); }
  console.log('| repo | hồ sơ | T2 round/token | T3 round/token | ghim lại | fix S4 |');
  console.log('|---|--:|--:|--:|--:|--:|');
  for (const r of all.sort((a, b) => b.rows.length - a.rows.length)) {
    const t2 = r.tiers.T2; const t3 = r.tiers.T3;
    console.log(`| ${path.basename(r.root)} | ${r.rows.length} | ${t2.round_usage}/${fmtTok(t2.token_s4)} | ${t3.round_usage}/${fmtTok(t3.token_s4)} | ${t2.repin + t3.repin} | ${t2.fix_s4 + t3.fix_s4} |`);
  }
  process.exit(0);
}

const res = measureRepo(ROOT, AT);
const rows = windowRows(ROOT, res, SINCE);
if (CHECK_HAND) process.exit(checkHand(res, CHECK_HAND));
if (JSON_OUT) console.log(JSON.stringify({ at: res.at, tiers: res.tiers, rows }, null, 2));
else console.log(printText(res, rows));
