// tests/plugins/plugin-declare.test.mjs — ca hồ sơ repo-khai-plugin (PD1–PD9 + PD1b/2b/7b/9b).
// Fixture CODE-SINH trong mkdtemp; đường dẫn suy từ vị trí file; mỗi ca có đối
// chứng dương + chiều đỏ trên bản sao, ghim thông điệp. Chạy một phần:
//   PD_CASES=PD1,PD6 node tests/plugins/plugin-declare.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, readdirSync } from 'node:fs';
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
// MỘT nguồn danh sách ca: file này. `--ids` in ra để run-tests.sh lặp theo, không chép tay.
const ALL_IDS = ['PD1','PD1b','PD1c','PD2','PD2b','PD2c','PD3','PD4','PD4b','PD5','PD6','PD7','PD7b','PD8','PD8b','PD9','PD9b','PD11'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.PD_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const ran = new Set();
const want = id => { const w = only.length === 0 || only.includes(id); if (w) ran.add(id); return w; };
// Ranh giới cứng quanh id: `PASS: [PD1]` KHÔNG là tiền tố của `PASS: [PD1b]`
// (lớp ranh-giới-câu — chốt eval từng khớp nhầm ca anh em).
const pass = (id, name) => console.log(`PASS: [${id}] ${name}`);
const fail = (id, msg) => { console.log(`FAIL: [${id}] ${msg}`); failures++; };
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
// NFC + hai chính tả «tuỳ/tùy chọn» — repo dùng cả hai; ghim một là phép đo mù với định dạng.
const nfc = t => t.normalize('NFC');
const TUY_CHON = /t[u\u00F9][\u1EF3y] ch\u1ECDn|optional|if installed|n\u1EBFu \u0111\u00E3 c\u00E0i/gi;
const CMD_PLUGIN = /claude (plugin )?(install|update|marketplace add)/g;
// Mọi tài liệu mặt người: gốc repo + commands/ + README của từng plugin.
// Vũ trụ quét = TƯỜNG MINH (hợp đồng khai đúng danh sách này), KHÔNG hứa «mọi tài liệu»:
// một allowlist đội lốt luật-lớp là fail-silent — lời hứa phải bằng đúng phép đo.
const humanDocs = () => {
  const out = [];
  for (const f of readdirSync(ROOT)) if (f.endsWith('.md')) out.push(path.join(ROOT, f));
  for (const d of ['commands', 'feature-loop', 'diagram-design']) {
    const dir = path.join(ROOT, d);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) if (f.endsWith('.md')) out.push(path.join(dir, f));
  }
  for (const f of ['docs/reference/DIAGRAM-RULE.md', 'docs/handoff/2026-08-10-onboarding-doi-gd3.md']) {
    const fp = path.join(ROOT, f); if (existsSync(fp)) out.push(fp);
  }
  return out;
};

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
    writeFileSync(f, JSON.stringify(mergeSettings(null, names).settings, null, 2) + '\n');
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
    if (count(nfc(sec), TUY_CHON) !== 0) errs.push("GUIDE 5.1 còn 'tuỳ chọn/optional' (mọi chính tả)");
    if (!/không pin phiên bản/.test(sec)) errs.push('GUIDE 5.1 thiếu câu không pin phiên bản');
    if (count(dau, /claude plugin marketplace add phanlemanh\/acceptance-gate-kit/g) !== 1 || count(dau, /claude plugin install acceptance-gate@acceptance-gate-kit/g) !== 1) errs.push('máy-đầu phải đúng 1 add + 1 install acceptance-gate');
    if (count(sau, /claude plugin marketplace add/g) !== 1 || count(sau, /claude plugin install/g) !== 0) errs.push('máy-sau có lệnh install hoặc thiếu add');
    return errs;
  };
  const e = judge(g);
  if (e.length) fail('PD7', e.join(' · '));
  else {
    const ANCHOR = 'Sau khi cài, **mở phiên Claude Code mới**';
    if (!g.includes(ANCHOR)) fail('PD7', 'neo đột biến không còn trong GUIDE — sửa ca trước khi tin');
    const redA = judge(g.replace(ANCHOR, 'claude plugin install diagram-design@acceptance-gate-kit    # (tùy chọn)\n\n' + ANCHOR));
    const redB = judge(g.replace('<!-- GUIDE-MAY-SAU>>> -->', 'claude plugin install feature-loop@acceptance-gate-kit\n<!-- GUIDE-MAY-SAU>>> -->'));
    if (!redA.some(x => x.includes("tuỳ chọn/optional"))) fail('PD7', `đột biến (a) không đỏ: ${redA}`);
    else if (!redB.some(x => x.includes('máy-sau có lệnh install'))) fail('PD7', `đột biến (b) không đỏ: ${redB}`);
    else pass('PD7', 'GUIDE 5.1: 0 tuỳ chọn (cả hai chính tả), không pin, máy-đầu 1+1, máy-sau 1+0; hai đột biến đỏ đúng');
  }
}

// ---------- PD7b: LỚP — không lệnh cài/cập nhật plugin nào ngoài khối GUIDE-PLUGIN-DECLARE; không «tuỳ/tùy chọn/optional» cạnh tên plugin ở bất kỳ tài liệu mặt người nào
if (want('PD7b')) {
  // judgeDocs nhận map {path: nội dung} để chiều đỏ chạy CÙNG hàm trên bản sao đã tiêm.
  const judgeDocs = docs => {
    const errs = [];
    for (const [fp, rawTxt] of Object.entries(docs)) {
      const txt = nfc(rawTxt);
      const isGuide = path.basename(fp) === 'GUIDE.md';
      const guideBlk = isGuide ? block(txt, 'GUIDE-PLUGIN-DECLARE') : null;
      // guideBlk rỗng/null → KHÔNG split('') (cắt thành từng ký tự, regex hết khớp = chiều đỏ chết)
      const outside = guideBlk ? txt.split(guideBlk).join('\n') : txt;
      if (isGuide && !guideBlk) errs.push('GUIDE.md: không tìm thấy khối GUIDE-PLUGIN-DECLARE');
      const n = count(outside, CMD_PLUGIN);
      if (n) errs.push(`${path.relative(ROOT, fp)}: ${n} lệnh plugin ngoài khối GUIDE-PLUGIN-DECLARE`);
      for (const line of txt.split('\n')) {
        if (!/acceptance-gate|feature-loop|diagram-design|superpowers/.test(line)) continue;
        if (line.match(TUY_CHON)) errs.push(`${path.relative(ROOT, fp)}: «${line.trim().slice(0, 60)}» — plugin bị gọi là tuỳ chọn`);
      }
    }
    return errs;
  };
  const docs = Object.fromEntries(humanDocs().map(f => [f, readFileSync(f, 'utf8')]));
  // Vũ trụ quét phải ĐỦ và được ASSERT — in số mà không so thì vũ trụ teo lại vẫn xanh.
  const MUST_SCAN = ['README.md', 'QUICKSTART.md', 'GUIDE.md', 'feature-loop/README.md',
                     'commands/acceptance-init.md', 'docs/reference/DIAGRAM-RULE.md'];
  const scanned = Object.keys(docs).map(f => path.relative(ROOT, f));
  const missing = MUST_SCAN.filter(f => !scanned.includes(f));
  const e = missing.length ? [`vũ trụ quét thiếu: ${missing.join(', ')}`] : judgeDocs(docs);
  if (e.length) fail('PD7b', e.join(' · '));
  else {
    // ba đột biến, mỗi cái một hình dạng đã dẫm thật ở S4-r1/r2
    const rd = path.join(ROOT, 'README.md'), qk = path.join(ROOT, 'QUICKSTART.md');
    const m1 = judgeDocs({ ...docs, [rd]: docs[rd] + '\nclaude plugin update diagram-design@acceptance-gate-kit   # if installed\n' });
    const m2 = judgeDocs({ ...docs, [qk]: docs[qk] + '\n# feature-loop (plugin thứ 2, tùy chọn)\n' });   // chính tả «ù»
    const m3 = judgeDocs({ ...docs, [path.join(ROOT, 'GUIDE.md')]: docs[path.join(ROOT, 'GUIDE.md')].replace('<!-- GUIDE-PLUGIN-DECLARE>>> -->', '') });
    if (!m1.some(x => x.startsWith('README.md:') && x.includes('lệnh plugin ngoài'))) fail('PD7b', `đột biến 1 (README có lệnh) không đỏ: ${m1}`);
    else if (!m2.some(x => x.startsWith('QUICKSTART.md:') && x.includes('tuỳ chọn'))) fail('PD7b', `đột biến 2 (chính tả «tùy») không đỏ: ${m2}`);
    else if (!m3.some(x => x.startsWith('GUIDE.md:'))) fail('PD7b', `đột biến 3 (mất marker → lệnh hoá ngoài khối) không đỏ: ${m3}`);
    else pass('PD7b', `${scanned.length} tài liệu khai trong hợp đồng đều sạch (đủ ${MUST_SCAN.length} file bắt buộc); ba đột biến (lệnh ở README · chính tả «tùy» · mất marker) đều đỏ đúng`);
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
    // exit 4 là mã CHUNG của ba lối (tham số lạ · marketplace vắng · --root lạ) → phải ghim thông điệp
    if (r2.status !== 4 || !/tham số lạ: --writ/.test(r2.stderr || '')) fail('PD8', `đột biến --writ không đỏ đúng lối: exit ${r2.status} err=${(r2.stderr || '').slice(0, 80)}`);
    else pass('PD8', 'lệnh trong init chạy được và ghi đúng tập --list; --writ → exit 4 (lệnh trong init không chạy được)');
  }
}

// ---------- PD8b: bước 5b của init RẼ NHÁNH theo mã thoát — không báo thành công vô điều kiện (AC-8b)
if (want('PD8b')) {
  const judge8b = txt => {
    const blk = block(txt, 'INIT-PLUGIN-DECLARE');
    if (!blk) return ['không tìm thấy khối INIT-PLUGIN-DECLARE'];
    const flat = nfc(blk).replace(/\s+/g, ' ');
    const errs = [];
    if (!/BRANCH ON THE EXIT CODE/.test(flat)) errs.push('5b không rẽ nhánh mã thoát');
    if (!/exit 0 →[^]*?commit file này/.test(flat)) errs.push('thiếu nhánh exit 0 kèm câu commit');
    if (!/exit 3 or 4 →/.test(flat)) errs.push('5b không rẽ nhánh mã thoát: thiếu nhánh exit 3/4');
    if (!/VERBATIM/.test(flat)) errs.push('nhánh lỗi không đòi in stderr nguyên văn');
    if (!/Do NOT tell anyone to commit/.test(flat)) errs.push('nhánh lỗi vẫn có thể bảo commit');
    return errs;
  };
  const md = readFileSync(INIT_MD, 'utf8');
  const e = judge8b(md);
  if (e.length) fail('PD8b', e.join(' · '));
  else {
    // gỡ ĐÚNG nhánh lỗi (neo chắc: cụm mở nhánh), giữ nguyên phần còn lại của khối
    const red = judge8b(md.replace('- exit 3 or 4 →', '- (nhánh lỗi đã bị gỡ)'));
    if (!red.some(x => x.includes('5b không rẽ nhánh mã thoát'))) fail('PD8b', `chiều đỏ không đỏ: ${red}`);
    else pass('PD8b', '5b rẽ nhánh: exit 0 → commit; exit 3/4 → stderr nguyên văn, cấm bảo commit; gỡ nhánh lỗi → đỏ');
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
  else {
    // đối chứng dương phải chạy CHÍNH bản chép, thêm ../.claude-plugin/marketplace.json cạnh nó
    mkdirSync(path.join(copy, '.claude-plugin')); cpSync(MARKET, wantPath);
    const root3 = tmp();
    const r3 = spawnSync(process.execPath, [path.join(copy, 'scripts', 'plugin-declare.mjs'), '--root', root3, '--write'], { encoding: 'utf8' });
    if (r3.status !== 0 || !existsSync(settingsOf(root3))) fail('PD9', `đối chứng dương trên bản chép: exit ${r3.status} err=${r3.stderr}`);
    else pass('PD9', 'marketplace vắng → exit 4 nêu đường dẫn, không ghi; thêm ../.claude-plugin/ cạnh bản chép → exit 0 + file có');
  }
}

// ---------- PD9b: --root không tồn tại → exit 4, không tạo cây; đối chứng: root có → ghi
if (want('PD9b')) {
  const ghost = path.join(tmp(), 'typo', 'repo');
  const r = run(['--root', ghost, '--write']);
  if (r.status !== 4 || !/--root trỏ đường dẫn không tồn tại/.test(r.stderr) || existsSync(ghost)) fail('PD9b', `exit ${r.status} err=${r.stderr} created=${existsSync(ghost)}`);
  else { const root = tmp(); const r2 = run(['--root', root, '--write']); if (r2.status !== 0 || !existsSync(settingsOf(root))) fail('PD9b', 'đối chứng dương'); else pass('PD9b', '--root lạ → exit 4 không mkdir; root thật → ghi'); }
}

// ---------- PD1c: marketplace.json thiếu khoá `name` → exit 4 nêu đường dẫn, KHÔNG rơi về hằng trong mã
if (want('PD1c')) {
  const m = JSON.parse(readFileSync(MARKET, 'utf8')); delete m.name;
  const mk = path.join(tmp(), 'marketplace.json'); writeFileSync(mk, JSON.stringify(m));
  const root = tmp(); const r = run(['--root', root, '--write', '--marketplace', mk]);
  if (r.status !== 4 || !/thiếu khoá name/.test(r.stderr) || !r.stderr.includes(mk) || existsSync(settingsOf(root))) fail('PD1c', `exit ${r.status} err=${r.stderr}`);
  else { const r2 = run(['--root', root, '--write']); if (r2.status !== 0) fail('PD1c', 'đối chứng dương'); else pass('PD1c', 'marketplace thiếu name → exit 4 nêu đường dẫn, không ghi (một nguồn tên, không fallback ẩn)'); }
}

// ---------- PD2c: giá trị đội đã đặt KHÔNG bị lật im lặng — false giữ false, source riêng giữ nguyên, có dòng «giữ nguyên»
if (want('PD2c')) {
  const root = tmp(); mkdirSync(path.join(root, '.claude')); const f = settingsOf(root);
  const before = { extraKnownMarketplaces: { 'acceptance-gate-kit': { source: { source: 'git', url: 'https://fork/x.git' } } },
                   enabledPlugins: { 'feature-loop@acceptance-gate-kit': false } };
  writeFileSync(f, JSON.stringify(before, null, 2) + '\n');
  const r = run(['--root', root, '--write']); const after = JSON.parse(readFileSync(f, 'utf8'));
  const errs = [];
  if (after.enabledPlugins['feature-loop@acceptance-gate-kit'] !== false) errs.push('false bị lật thành true');
  if (JSON.stringify(after.extraKnownMarketplaces['acceptance-gate-kit']) !== JSON.stringify(before.extraKnownMarketplaces['acceptance-gate-kit'])) errs.push('source riêng của đội bị thay');
  if (!/giữ nguyên \(đội đã đặt\)/.test(r.stdout)) errs.push('không in dòng «giữ nguyên»');
  if (after.enabledPlugins['diagram-design@acceptance-gate-kit'] !== true) errs.push('plugin chưa khai không được bật');
  if (r.status !== 0 || errs.length) fail('PD2c', `exit ${r.status} · ${errs.join(' · ')}`);
  else pass('PD2c', 'false giữ false, source riêng giữ nguyên, có dòng «giữ nguyên»; plugin chưa khai vẫn được bật');
}

// ---------- PD4b: lỗi hệ thống tệp (settings.json là thư mục · .claude là file) → exit 3 có lời, không stack trace
if (want('PD4b')) {
  const r1root = tmp(); mkdirSync(path.join(r1root, '.claude', 'settings.json'), { recursive: true });
  const r1 = run(['--root', r1root, '--write']);
  const r2root = tmp(); writeFileSync(path.join(r2root, '.claude'), 'x');
  const r2 = run(['--root', r2root, '--write']);
  if (r1.status !== 3 || !/không đọc được settings\.json \(EISDIR\)/.test(r1.stderr)) fail('PD4b', `settings là thư mục: exit ${r1.status} err=${(r1.stderr||'').slice(0,90)}`);
  else if (r2.status !== 3 || !/không ghi được settings\.json/.test(r2.stderr)) fail('PD4b', `.claude là file: exit ${r2.status} err=${(r2.stderr||'').slice(0,90)}`);
  else { const ok = tmp(); const r3 = run(['--root', ok, '--write']); if (r3.status !== 0) fail('PD4b', 'đối chứng dương'); else pass('PD4b', 'EISDIR/EEXIST → exit 3 có lời (đúng hợp đồng mã thoát), không stack trace'); }
}

// ---------- PD11: init có đường cho repo ĐÃ có config — bước 1 vẫn chạy 5b (AC-11)
if (want('PD11')) {
  const md = readFileSync(INIT_MD, 'utf8');
  // gộp khoảng trắng: câu trong md bị ngắt dòng + thụt lề — phép đo phải mù với cách wrap, không mù với nội dung
  const flat = t => nfc(t).replace(/\s+/g, ' ');
  const step1 = flat(md.slice(md.indexOf('1. If `_acceptance/config.yaml` already exists'), md.indexOf('2. PROBE the repo')));
  const errs = [];
  if (!/STILL RUN step 5b/.test(step1)) errs.push('bước 1 không nói vẫn chạy 5b');
  if (!/config đã có — bỏ qua khởi tạo, chỉ khai plugin/.test(step1)) errs.push('thiếu câu người-đọc');
  if (/already exists → show it and STOP/.test(step1)) errs.push('bước 1 vẫn STOP thẳng');
  if (errs.length) fail('PD11', errs.join(' · '));
  else {
    const red = (t => {
      const s1 = flat(t.slice(t.indexOf('1. If `_acceptance/config.yaml` already exists'), t.indexOf('2. PROBE the repo')));
      return !/STILL RUN step 5b/.test(s1);
    })(md.replace('STILL RUN step 5b', 'stop'));
    if (!red) fail('PD11', 'chiều đỏ không đỏ: gỡ «STILL RUN step 5b» mà phép đo vẫn xanh');
    else pass('PD11', 'init bước 1: repo đã có config vẫn chạy 5b + câu người-đọc; gỡ câu → đỏ');
  }
}

// PD_CASES nêu id không tồn tại → không được xanh im lặng (xanh-không-chạy)
const unknown = only.filter(id => !ran.has(id));
if (unknown.length) { console.log(`FAIL: [PD_CASES] không khớp ca nào: ${unknown.join(',')}`); failures++; }
if (failures) { console.log(`plugin-declare: ${failures} ca đỏ`); process.exit(1); }
