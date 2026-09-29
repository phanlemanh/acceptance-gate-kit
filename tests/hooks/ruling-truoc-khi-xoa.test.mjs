// ruling-truoc-khi-xoa.test.mjs — hồ sơ mot-so-ba-ve, làn hook (AC-6). Chạy CHÍNH lệnh ghi trong hooks.json
// (gồm bộ lọc shell) với CLAUDE_PLUGIN_ROOT = gốc kho, payload đúng hình PreToolUse. Tên ca = tên AC.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
let pass = 0, fail = 0;
const ca = (n, f) => { try { f(); pass++; console.log(`  PASS: ${n} `); } catch (e) { fail++; console.log(`  FAIL: ${n} — ${e.message}`); } };
const die = m => { throw new Error(m); };
const hooksJson = JSON.parse(readFileSync(path.join(ROOT, 'hooks', 'hooks.json'), 'utf8'));
const muc = hooksJson.hooks.PreToolUse.filter(x => x.matcher === 'Bash' && x.hooks.some(h => h.command.includes('ruling-truoc-khi-xoa.js')));
const PROGRESS = '# SDD ledger\n\nHợp đồng ràng buộc: _acceptance/ws-thu/contract.md\n\nRuling 1: chọn A — Vì sao: vì B. Sai thì tốn: C.\n\nTask 2: Ruling: chọn D — vì E — tốn F\n';
const kho = (slugDir = 'ws-thu') => {
  const r = mkdtempSync(path.join(tmpdir(), 'rt-'));
  mkdirSync(path.join(r, '_acceptance', slugDir), { recursive: true }); writeFileSync(path.join(r, '_acceptance', slugDir, 'decisions.jsonl'), '');
  for (const ws of ['2026-09-29-ws-thu', '2026-09-30-ws-thu']) { const w = path.join(r, '.superpowers', 'sdd', ws); mkdirSync(w, { recursive: true }); writeFileSync(path.join(w, 'progress.md'), PROGRESS); }
  mkdirSync(path.join(r, 'apps', 'con'), { recursive: true });
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), 'schema_version: 1\n');
  return r;
};
const so = r => { const p = path.join(r, '_acceptance', 'ws-thu', 'decisions.jsonl'); return existsSync(p) ? readFileSync(p, 'utf8') : ''; };
const dem = r => so(r).split('\n').filter(Boolean).length;
const hook = (r, command, cwd = r, pluginRoot = ROOT) => {
  const cmd = muc[0].hooks.find(h => h.command.includes('ruling-truoc-khi-xoa.js')).command;
  return spawnSync('sh', ['-c', cmd], { input: JSON.stringify({ tool_name: 'Bash', cwd, tool_input: { command } }), env: { ...process.env, CLAUDE_PLUGIN_ROOT: pluginRoot }, encoding: 'utf8' });
};

ca('RT-AC6-dang-ky', () => { if (muc.length !== 1) die(`hooks.json co ${muc.length} muc Bash tro ruling-truoc-khi-xoa.js`); });

const HANG = [
  ['finish-tuyet-doi', r => `rm -rf ${path.join(r, '.superpowers', 'sdd', '2026-09-29-ws-thu')}`, r => r, 2],
  ['cwd-con', r => `rm -rf ${path.join(r, '.superpowers', 'sdd', '2026-09-29-ws-thu')}`, r => path.join(r, 'apps', 'con'), 2],
  ['tuong-doi', () => 'rm -rf .superpowers/sdd/2026-09-29-ws-thu', r => r, 2],
  ['gach-cuoi', () => 'rm -rf .superpowers/sdd/2026-09-29-ws-thu/', r => r, 2],
  ['sau-cd', () => 'cd .superpowers/sdd && rm -rf 2026-09-29-ws-thu', r => r, 2],
  ['thu-muc-cha', () => 'rm -rf .superpowers/sdd', r => r, 4],
  ['rm-r', () => 'rm -r .superpowers/sdd/2026-09-29-ws-thu', r => r, 2],
  ['rm-fr', () => 'rm -fr .superpowers/sdd/2026-09-29-ws-thu', r => r, 2],
  ['rm-R', () => 'rm -R .superpowers/sdd/2026-09-29-ws-thu', r => r, 2],
  ['nhay-kep', () => 'rm -rf ".superpowers/sdd/2026-09-29-ws-thu"', r => r, 2],
];
ca('RT-AC6-gat', () => {
  for (const [ten, lenh, cwd, n] of HANG) {
    const r = kho(); const x = hook(r, lenh(r), cwd(r));
    if (x.status !== 0) die(`hang ${ten}: exit ${x.status} ${x.stderr}`);
    if (dem(r) !== n) die(`hang ${ten}: so co ${dem(r)} dong, ky vong ${n}`);
  }
});
ca('RT-AC6-im', () => {
  for (const lenh of ['cat .superpowers/sdd/2026-09-29-ws-thu/progress.md', 'grep -r Ruling .superpowers/sdd/2026-09-29-ws-thu', 'ls -R .superpowers/sdd', 'node x.mjs --workspace .superpowers/sdd/2026-09-29-ws-thu', 'rm -rf /tmp/x.superpowers-bak', 'rm .superpowers/sdd/2026-09-29-ws-thu/progress.md']) {
    const r = kho(); const truoc = createHash('sha256').update(so(r)).digest('hex'); const x = hook(r, lenh);
    if (x.status !== 0) die(`«${lenh}»: exit ${x.status}`);
    if (createHash('sha256').update(so(r)).digest('hex') !== truoc) die(`«${lenh}»: so doi`);
  }
});
ca('RT-AC6-bien', () => {
  const r = kho(); const x = hook(r, 'rm -rf "$WS"');
  if (x.status !== 0 || dem(r) !== 0) die(`exit ${x.status}, so ${dem(r)} dong`);
  const y = hook(r, 'WS=.superpowers/sdd/2026-09-29-ws-thu; rm -rf "$WS"');
  if (y.status !== 0 || !y.stderr.includes('không giải được đường')) die('khong khai «không giải được đường»: ' + y.stderr);
});
ca('RT-AC6-chan', () => {
  const r = kho('ho-so-khac'); const x = hook(r, 'rm -rf .superpowers/sdd/2026-09-29-ws-thu');
  if (x.status !== 2 || !x.stderr.includes('ruling chưa vào sổ') || !x.stderr.includes('cau-noi-ruling.mjs')) die(`exit ${x.status} ${x.stderr}`);
});
ca('RT-AC6-kho-ngoai', () => { // kho chưa dùng kit: không sổ để gặt → im, cho xoá; đối chứng: cùng kho có config → chặn
  const r = kho('ho-so-khac');
  const co = hook(r, 'rm -rf .superpowers/sdd/2026-09-29-ws-thu');
  if (co.status !== 2) die('doi chung duong hong: kho co config ma hook khong chan ca khong suy duoc ho so');
  spawnSync('rm', ['-f', path.join(r, '_acceptance', 'config.yaml')]);
  const x = hook(r, 'rm -rf .superpowers/sdd/2026-09-29-ws-thu');
  if (x.status !== 0 || x.stderr.includes('ruling chưa vào sổ')) die(`kho ngoai kit bi chan: exit ${x.status} ${x.stderr}`);
});
ca('RT-AC6-vang', () => { const r = kho(); const x = hook(r, 'rm -rf .superpowers/sdd/khong-ton-tai'); if (x.status !== 0 || dem(r) !== 0) die(`exit ${x.status}`); });

const banSao = mutate => { const d = mkdtempSync(path.join(tmpdir(), 'rt-m-')); for (const s of ['hooks', 'scripts', 'lib']) cpSync(path.join(ROOT, s), path.join(d, s), { recursive: true }); const p = path.join(d, 'hooks', 'ruling-truoc-khi-xoa.js'); const s = readFileSync(p, 'utf8'); const m = mutate(s); if (m === s) die('kim khong khop'); writeFileSync(p, m); return d; };
ca('RT-AC6-dot-bien-rm', () => {
  const d = banSao(s => s.replace("if (!laRm(w[0])) continue;", ''));
  const r = kho(); hook(r, 'grep -r Ruling .superpowers/sdd/2026-09-29-ws-thu', r, d);
  if (dem(r) === 0) die('dot bien bo neo rm khong co tac dung');
  console.log('    · chieu do: bo neo rm → «lệnh đọc kích gặt» (bat duoc)');
});
ca('RT-AC6-dot-bien-chan', () => {
  const d = banSao(s => s.replace('process.exitCode = 2;', ''));
  const r = kho('ho-so-khac'); const x = hook(r, 'rm -rf .superpowers/sdd/2026-09-29-ws-thu', r, d);
  if (x.status === 2) die('dot bien bo exit 2 khong co tac dung');
  console.log('    · chieu do: bo exit 2 → «hook cho xoá khi ruling chưa vào sổ» (bat duoc)');
});
console.log(`  Results: ${pass} passed, ${fail} failed (ruling-truoc-khi-xoa)`);
process.exit(fail ? 1 : 0);
