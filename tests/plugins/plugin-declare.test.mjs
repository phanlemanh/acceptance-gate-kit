// tests/plugins/plugin-declare.test.mjs — ca hồ sơ repo-khai-plugin (PD1–PD9 + PD1b/2b/7b/9b).
// Fixture CODE-SINH trong mkdtemp; đường dẫn suy từ vị trí file; mỗi ca có đối
// chứng dương + chiều đỏ trên bản sao, ghim thông điệp. Chạy một phần:
//   PD_CASES=PD1,PD6 node tests/plugins/plugin-declare.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const SCRIPT = path.join(ROOT, 'scripts', 'plugin-declare.mjs');
const MARKET = path.join(ROOT, '.claude-plugin', 'marketplace.json');
const INIT_MD = path.join(ROOT, 'commands', 'acceptance-init.md');
const GUIDE = path.join(ROOT, 'GUIDE.md');
const README = path.join(ROOT, 'README.md');
const QUICK = path.join(ROOT, 'QUICKSTART.md');

let failures = 0;
const only = (process.env.PD_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const ran = new Set();
const want = id => { const w = only.length === 0 || only.includes(id); if (w) ran.add(id); return w; };
const pass = (id, name) => console.log(`PASS: ${id} ${name}`);
const fail = (id, msg) => { console.log(`FAIL: ${id} ${msg}`); failures++; };
const tmp = () => mkdtempSync(path.join(tmpdir(), 'pd-'));
const run = (args, opts = {}) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', ...opts });
const settingsOf = root => path.join(root, '.claude', 'settings.json');
// Tập kỳ vọng đọc từ CHÍNH marketplace.json (bên viết), không ghim con số.
const expectedNames = (marketPath = MARKET) => {
  const m = JSON.parse(readFileSync(marketPath, 'utf8'));
  return [...m.plugins.map(p => `${p.name}@${m.name}`), 'superpowers@claude-plugins-official'];
};
const sameSet = (a, b) => a.length === b.length && [...a].sort().join('|') === [...b].sort().join('|');
// MỘT hàm rút-khối + MỘT regex rút-tên dùng chung cho init lẫn GUIDE (round-trip).
const block = (text, marker) => {
  const m = text.match(new RegExp(`<!-- <<<${marker} -->([\\s\\S]*?)<!-- ${marker}>>> -->`));
  return m ? m[1] : null;
};
const namesIn = blk => [...blk.matchAll(/^\s*-\s+`?([\w.-]+@[\w.-]+)`?\s*$/gm)].map(m => m[1]);
const count = (s, re) => (s.match(re) || []).length;

// ---------- PD1: repo trống + --write → file đúng; chiều đỏ: marketplace gỡ diagram-design
if (want('PD1')) {
  const root = tmp();
  const r = run(['--root', root, '--write']);
  const file = settingsOf(root);
  if (r.status !== 0 || !existsSync(file)) fail('PD1', `exit ${r.status}, file ${existsSync(file)}: ${r.stderr}`);
  else {
    const raw = readFileSync(file, 'utf8'); const j = JSON.parse(raw); const names = expectedNames();
    const keys = Object.keys(j.enabledPlugins || {});
    const ok = j.extraKnownMarketplaces?.['acceptance-gate-kit']?.source?.source === 'github'
      && j.extraKnownMarketplaces['acceptance-gate-kit'].source.repo === 'phanlemanh/acceptance-gate-kit'
      && sameSet(keys, names) && keys.length === names.length && keys.every(k => j.enabledPlugins[k] === true)
      && raw === JSON.stringify(j, null, 2) + '\n';
    if (!ok) fail('PD1', `nội dung sai: keys=${keys.join(',')} expected=${names.join(',')}`);
    else {
      // chiều đỏ: marketplace bản sao gỡ diagram-design → đầu ra thiếu đúng tên đó + số đếm lệch
      const m = JSON.parse(readFileSync(MARKET, 'utf8')); m.plugins = m.plugins.filter(p => p.name !== 'diagram-design');
      const mk = path.join(tmp(), 'marketplace.json'); writeFileSync(mk, JSON.stringify(m));
      const root2 = tmp(); const r2 = run(['--root', root2, '--write', '--marketplace', mk]);
      const j2 = JSON.parse(readFileSync(settingsOf(root2), 'utf8')); const k2 = Object.keys(j2.enabledPlugins);
      const redOk = r2.status === 0 && !k2.includes('diagram-design@acceptance-gate-kit') && k2.length === names.length - 1 && !sameSet(k2, names);
      if (!redOk) fail('PD1', `chiều đỏ không đỏ: keys=${k2.join(',')}`);
      else pass('PD1', 'repo trống → file đúng tập n+1; gỡ diagram-design → thiếu đúng tên + lệch số');
    }
  }
}

// ---------- PD1b: tên marketplace một nguồn — đổi `name` trong bản sao marketplace → cả hậu tố lẫn khoá extraKnownMarketplaces đều theo
if (want('PD1b')) {
  const m = JSON.parse(readFileSync(MARKET, 'utf8')); m.name = 'kit-khac';
  const mk = path.join(tmp(), 'marketplace.json'); writeFileSync(mk, JSON.stringify(m));
  const root = tmp(); const r = run(['--root', root, '--write', '--marketplace', mk]);
  const j = r.status === 0 ? JSON.parse(readFileSync(settingsOf(root), 'utf8')) : {};
  const keys = Object.keys(j.enabledPlugins || {});
  const ok = r.status === 0 && keys.filter(k => k.endsWith('@kit-khac')).length === m.plugins.length && !!j.extraKnownMarketplaces?.['kit-khac'] && !j.extraKnownMarketplaces?.['acceptance-gate-kit'];
  if (!ok) fail('PD1b', `exit ${r.status} keys=${keys.join(',')} ekm=${Object.keys(j.extraKnownMarketplaces || {}).join(',')}`);
  else pass('PD1b', 'đổi name marketplace → hậu tố và khoá extraKnownMarketplaces cùng theo (một nguồn)');
}

// ---------- PD2: settings đã có khoá khác → khoá kit thêm, khoá khác + thứ tự giữ; chiều đỏ: sản phẩm ghi-đè-cả-file đi qua CÙNG phép so
if (want('PD2')) {
  const root = tmp(); mkdirSync(path.join(root, '.claude')); const f = settingsOf(root);
  const before = { worktree: { bgIsolation: 'none' }, permissions: { allow: ['Bash(npm run test:*)'] }, enabledPlugins: { 'paper-desktop@paper': true } };
  writeFileSync(f, JSON.stringify(before, null, 4) + '\n');
  const names = expectedNames();
  const judge2 = after => {
    const errs = [];
    if (!names.every(n => after.enabledPlugins?.[n] === true)) errs.push('thiếu khoá kit');
    if (JSON.stringify(after.worktree) !== JSON.stringify(before.worktree) || JSON.stringify(after.permissions) !== JSON.stringify(before.permissions)) errs.push('mất khoá worktree/permissions');
    if (after.enabledPlugins?.['paper-desktop@paper'] !== true) errs.push('mất khoá paper-desktop@paper');
    if (Object.keys(after).slice(0, 3).join(',') !== 'worktree,permissions,enabledPlugins') errs.push(`thứ tự khoá đổi: ${Object.keys(after).join(',')}`);
    return errs;
  };
  const r = run(['--root', root, '--write']); const e = r.status === 0 ? judge2(JSON.parse(readFileSync(f, 'utf8'))) : [`exit ${r.status}`];
  if (e.length) fail('PD2', e.join(' · '));
  else {
    // chiều đỏ: sản phẩm của bản vá «ghi đè cả file» (khoá kit thuần) ghi vào fixture, chạy CÙNG judge2 → phải đỏ đúng tên khoá mất
    const { mergeSettings } = await import(SCRIPT);
    writeFileSync(f, JSON.stringify(mergeSettings(null, names), null, 2) + '\n');
    const red = judge2(JSON.parse(readFileSync(f, 'utf8')));
    if (!red.includes('mất khoá paper-desktop@paper') || !red.includes('mất khoá worktree/permissions')) fail('PD2', `chiều đỏ không đỏ đúng: ${red.join(' · ')}`);
    else pass('PD2', 'hợp nhất giữ permissions/worktree/paper-desktop + thứ tự; sản phẩm ghi-đè-cả-file qua cùng phép so → mất khoá paper-desktop@paper');
  }
}

// ---------- PD2b: JSON hợp lệ nhưng sai hình — gốc là mảng / enabledPlugins là mảng → exit 3, không chạm, mỗi lối một thông điệp
if (want('PD2b')) {
  const root = tmp(); mkdirSync(path.join(root, '.claude')); const f = settingsOf(root);
  writeFileSync(f, '["keep-me"]\n'); const b1 = readFileSync(f);
  const r1 = run(['--root', root, '--write']); const a1 = readFileSync(f);
  writeFileSync(f, JSON.stringify({ enabledPlugins: ['x@y'] }) + '\n'); const b2 = readFileSync(f);
  const r2 = run(['--root', root, '--write']); const a2 = readFileSync(f);
  if (r1.status !== 3 || !b1.equals(a1) || !/không phải object — không ghi đè/.test(r1.stderr)) fail('PD2b', `gốc mảng: exit ${r1.status} same=${b1.equals(a1)} err=${r1.stderr}`);
  else if (r2.status !== 3 || !b2.equals(a2) || !/khoá enabledPlugins không phải object/.test(r2.stderr)) fail('PD2b', `enabledPlugins mảng: exit ${r2.status} same=${b2.equals(a2)} err=${r2.stderr}`);
  else { writeFileSync(f, '{}\n'); const r3 = run(['--root', root, '--write']); if (r3.status !== 0) fail('PD2b', 'đối chứng dương'); else pass('PD2b', 'JSON sai hình → exit 3, không chạm, thông điệp nêu đúng lối; hợp lệ → ghi'); }
}

// ---------- PD3: lần hai không đổi byte + "đã khai, không đổi"; lần một KHÔNG có "không đổi"
if (want('PD3')) {
  const root = tmp();
  const r1 = run(['--root', root, '--write']); const b1 = readFileSync(settingsOf(root));
  const r2 = run(['--root', root, '--write']); const b2 = readFileSync(settingsOf(root));
  if (r1.status !== 0 || !/đã khai/.test(r1.stdout) || /không đổi/.test(r1.stdout)) fail('PD3', `lần một: ${r1.stdout}`);
  else if (r2.status !== 0 || !b1.equals(b2) || !/đã khai, không đổi/.test(r2.stdout)) fail('PD3', `lần hai: exit ${r2.status} equal=${b1.equals(b2)} out=${r2.stdout}`);
  else pass('PD3', 'idempotent: lần hai không đổi byte, in «đã khai, không đổi»');
}

// ---------- PD4: JSON hỏng → exit 3, không chạm; đối chứng: sửa hợp lệ → exit 0 và đổi
if (want('PD4')) {
  const root = tmp(); mkdirSync(path.join(root, '.claude')); const f = settingsOf(root);
  writeFileSync(f, '{ không hợp lệ'); const before = readFileSync(f);
  const r = run(['--root', root, '--write']); const after = readFileSync(f);
  if (r.status !== 3 || !before.equals(after) || !/settings\.json không đọc được — không ghi đè/.test(r.stderr)) fail('PD4', `exit ${r.status} equal=${before.equals(after)} err=${r.stderr}`);
  else {
    writeFileSync(f, '{}\n'); const r2 = run(['--root', root, '--write']);
    if (r2.status !== 0 || readFileSync(f, 'utf8') === '{}\n') fail('PD4', 'đối chứng dương: JSON hợp lệ phải ghi được');
    else pass('PD4', 'JSON hỏng → exit 3, không chạm; hợp lệ → ghi');
  }
}

// ---------- PD5: dry-run không tạo file, in đủ tên; đối chứng: --write tạo
if (want('PD5')) {
  const root = tmp(); const r = run(['--root', root]); const names = expectedNames();
  if (r.status !== 0 || existsSync(settingsOf(root)) || !/dry-run/.test(r.stdout) || !names.every(n => r.stdout.includes(n))) fail('PD5', `exit ${r.status} file=${existsSync(settingsOf(root))} out=${r.stdout}`);
  else { const r2 = run(['--root', root, '--write']); if (r2.status !== 0 || !existsSync(settingsOf(root))) fail('PD5', 'đối chứng: --write phải tạo file'); else pass('PD5', 'dry-run không ghi, in đủ tên; --write ghi'); }
}

// ---------- PD6: bốn nơi một chữ — marketplace ∪ superpowers == --list == init == GUIDE; đột biến (a) GUIDE gỡ feature-loop, (b) init đổi marker
if (want('PD6')) {
  const names = expectedNames();
  const list = run(['--list']).stdout.trim().split('\n');
  const initBlk = block(readFileSync(INIT_MD, 'utf8'), 'INIT-PLUGIN-DECLARE');
  const guideBlk = block(readFileSync(GUIDE, 'utf8'), 'GUIDE-PLUGIN-DECLARE');
  const check = (label, blk) => {
    if (!blk) return `không tìm thấy khối ở ${label}`;
    const got = namesIn(blk); const miss = names.filter(n => !got.includes(n)); const extra = got.filter(n => !names.includes(n));
    return miss.length || extra.length ? `${label} thiếu [${miss.join(',')}] thừa [${extra.join(',')}]` : null;
  };
  const e = [sameSet(list, names) ? null : `--list lệch: ${list.join(',')}`, check('init', initBlk), check('GUIDE', guideBlk)].filter(Boolean);
  if (e.length) fail('PD6', e.join(' · '));
  else {
    const redA = check('GUIDE', guideBlk.replace(/^.*feature-loop@acceptance-gate-kit.*$/m, ''));
    const redB = check('init', block(readFileSync(INIT_MD, 'utf8').replace(/INIT-PLUGIN-DECLARE/g, 'INIT-PLUGIN-DECLAR'), 'INIT-PLUGIN-DECLARE'));
    if (!redA || !redA.includes('feature-loop@acceptance-gate-kit') || !redA.includes('GUIDE')) fail('PD6', `đột biến (a) không đỏ đúng: ${redA}`);
    else if (!redB || !redB.includes('không tìm thấy khối')) fail('PD6', `đột biến (b) không đỏ đúng: ${redB}`);
    else pass('PD6', 'bốn nơi khớp; gỡ một tên ở GUIDE → nêu tên+nơi; đổi marker init → không tìm thấy khối');
  }
}

// ---------- PD7: GUIDE §5.1 — 0 «tuỳ chọn», có «không pin phiên bản», máy-đầu 1 add + 1 install, máy-sau 1 add + 0 install
if (want('PD7')) {
  const g = readFileSync(GUIDE, 'utf8');
  const judge = text => {
    const sec = text.split(/^### 5\.1/m)[1]?.split(/^### 5\.2/m)[0] || '';
    const dau = block(sec, 'GUIDE-MAY-DAU') || '', sau = block(sec, 'GUIDE-MAY-SAU') || '';
    const errs = [];
    if (count(sec, /tuỳ chọn, cài riêng được/g) !== 0) errs.push("GUIDE 5.1 còn 'tuỳ chọn'");
    if (!/không pin phiên bản/.test(sec)) errs.push('GUIDE 5.1 thiếu câu không pin phiên bản');
    if (count(dau, /claude plugin marketplace add phanlemanh\/acceptance-gate-kit/g) !== 1 || count(dau, /claude plugin install acceptance-gate@acceptance-gate-kit/g) !== 1) errs.push('máy-đầu phải đúng 1 add + 1 install acceptance-gate');
    if (count(sau, /claude plugin marketplace add/g) !== 1 || count(sau, /claude plugin install/g) !== 0) errs.push('máy-sau có lệnh install hoặc thiếu add');
    return errs;
  };
  const e = judge(g);
  if (e.length) fail('PD7', e.join(' · '));
  else {
    const redA = judge(g.replace('### 5.2', 'claude plugin install diagram-design@acceptance-gate-kit    # (tuỳ chọn, cài riêng được)\n### 5.2'));
    const redB = judge(g.replace('<!-- GUIDE-MAY-SAU>>> -->', 'claude plugin install feature-loop@acceptance-gate-kit\n<!-- GUIDE-MAY-SAU>>> -->'));
    if (!redA.some(x => x.includes("còn 'tuỳ chọn'"))) fail('PD7', `đột biến (a) không đỏ: ${redA}`);
    else if (!redB.some(x => x.includes('máy-sau có lệnh install'))) fail('PD7', `đột biến (b) không đỏ: ${redB}`);
    else pass('PD7', 'GUIDE 5.1: 0 tuỳ chọn, không pin, máy-đầu 1+1, máy-sau 1+0; hai đột biến đỏ đúng');
  }
}

// ---------- PD7b: README + QUICKSTART không còn bản sao thủ tục cài — 0 dòng install diagram-design, 0 «optional/tuỳ chọn» cạnh diagram-design, có con trỏ GUIDE §5.1
if (want('PD7b')) {
  const judge7b = (label, text) => {
    const errs = [];
    if (count(text, /claude plugin install diagram-design/g) !== 0) errs.push(`${label} còn dòng install diagram-design`);
    if (count(text, /diagram-design[^\n]*(optional|tuỳ chọn)|(optional|tuỳ chọn)[^\n]*diagram-design/g) !== 0) errs.push(`${label} còn 'optional/tuỳ chọn' cạnh diagram-design`);
    if (!/GUIDE\s*§\s*5\.1|GUIDE\.md#51/.test(text)) errs.push(`${label} thiếu con trỏ GUIDE §5.1`);
    return errs;
  };
  const rd = readFileSync(README, 'utf8'), qk = readFileSync(QUICK, 'utf8');
  const e = [...judge7b('README', rd), ...judge7b('QUICKSTART', qk)];
  if (e.length) fail('PD7b', e.join(' · '));
  else {
    const red = judge7b('README', rd + '\nclaude plugin install diagram-design@acceptance-gate-kit  # (optional, standalone)\n');
    if (!red.some(x => x.includes('còn dòng install diagram-design')) || !red.some(x => x.includes("còn 'optional/tuỳ chọn'"))) fail('PD7b', `đột biến không đỏ: ${red}`);
    else pass('PD7b', 'README/QUICKSTART trỏ GUIDE §5.1, không còn bản sao install; chèn lại dòng optional → đỏ');
  }
}

// ---------- PD8: round-trip — rút NGUYÊN VĂN dòng lệnh trong khối init, thế biến, THỰC THI; đột biến --write→--writ → exit 4
if (want('PD8')) {
  const md = readFileSync(INIT_MD, 'utf8');
  const blk = block(md, 'INIT-PLUGIN-DECLARE');
  const after = md.indexOf('INIT-CI-COPY-LIST>>>'), at = md.indexOf('<<<INIT-PLUGIN-DECLARE'), six = md.indexOf('6. Print:');
  const runLine = (b, root) => {
    const line = (b || '').split('\n').find(l => l.includes('plugin-declare.mjs'));
    if (!line) return { status: -1, stderr: 'không có dòng lệnh' };
    const argv = line.trim().replace('${CLAUDE_PLUGIN_ROOT}', ROOT).replace('<path>', root).match(/"[^"]*"|\S+/g).map(s => s.replace(/^"|"$/g, ''));
    if (argv[0] !== 'node') return { status: -1, stderr: `lệnh không bắt đầu bằng node: ${argv[0]}` };
    return spawnSync(process.execPath, argv.slice(1), { encoding: 'utf8' });
  };
  const root = tmp(); const r = runLine(blk, root);
  const ok = blk && after > -1 && at > after && six > at && /commit file này/.test(blk) && r.status === 0 && existsSync(settingsOf(root))
    && sameSet(Object.keys(JSON.parse(readFileSync(settingsOf(root), 'utf8')).enabledPlugins), run(['--list']).stdout.trim().split('\n'));
  if (!ok) fail('PD8', `vị trí/khối/thực thi: exit ${r.status} ${r.stderr}`);
  else {
    const r2 = runLine(blk.replace('--write', '--writ'), tmp());
    if (r2.status !== 4) fail('PD8', `đột biến --writ không đỏ: exit ${r2.status}`);
    else pass('PD8', 'lệnh trong init chạy được và ghi đúng tập --list; --writ → exit 4 (lệnh trong init không chạy được)');
  }
}

// ---------- PD9: marketplace vắng → exit 4 + đường dẫn + không tạo file (cờ sai đường · bản chép không có ../.claude-plugin/)
if (want('PD9')) {
  const root = tmp(); const bad = path.join(tmp(), 'khong-co.json');
  const r = run(['--root', root, '--write', '--marketplace', bad]);
  const copy = tmp(); mkdirSync(path.join(copy, 'scripts')); cpSync(SCRIPT, path.join(copy, 'scripts', 'plugin-declare.mjs'));
  const r2 = spawnSync(process.execPath, [path.join(copy, 'scripts', 'plugin-declare.mjs'), '--root', root, '--write'], { encoding: 'utf8' });
  const wantPath = path.join(copy, '.claude-plugin', 'marketplace.json');
  if (r.status !== 4 || !r.stderr.includes(bad) || existsSync(settingsOf(root))) fail('PD9', `cờ sai đường: exit ${r.status} err=${r.stderr}`);
  else if (r2.status !== 4 || !r2.stderr.includes(wantPath) || existsSync(settingsOf(root))) fail('PD9', `bản chép: exit ${r2.status} err=${r2.stderr}`);
  else { const r3 = run(['--root', root, '--write']); if (r3.status !== 0 || !existsSync(settingsOf(root))) fail('PD9', 'đối chứng dương'); else pass('PD9', 'marketplace vắng → exit 4 nêu đường dẫn, không ghi; có → ghi'); }
}

// ---------- PD9b: --root không tồn tại → exit 4, không tạo cây; đối chứng: root có → ghi
if (want('PD9b')) {
  const ghost = path.join(tmp(), 'typo', 'repo');
  const r = run(['--root', ghost, '--write']);
  if (r.status !== 4 || !/--root trỏ đường dẫn không tồn tại/.test(r.stderr) || existsSync(ghost)) fail('PD9b', `exit ${r.status} err=${r.stderr} created=${existsSync(ghost)}`);
  else { const root = tmp(); const r2 = run(['--root', root, '--write']); if (r2.status !== 0 || !existsSync(settingsOf(root))) fail('PD9b', 'đối chứng dương'); else pass('PD9b', '--root lạ → exit 4 không mkdir; root thật → ghi'); }
}

// PD_CASES nêu id không tồn tại → không được xanh im lặng (xanh-không-chạy)
const unknown = only.filter(id => !ran.has(id));
if (unknown.length) { console.log(`FAIL: PD_CASES không khớp ca nào: ${unknown.join(',')}`); failures++; }
if (failures) { console.log(`plugin-declare: ${failures} ca đỏ`); process.exit(1); }
