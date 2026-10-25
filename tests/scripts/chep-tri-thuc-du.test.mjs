// CT — lớp chép CI của tầng tri thức đủ cho kho tiêu thụ (mốc 2.34.0; crm nhận kit 25/10, PR crm #565).
// Hai lỗ đo ở kho nhận: (1) danh sách chép thiếu khuôn `tri-thuc-template.md` mà `tri-thuc.mjs` đọc lúc chạy;
// (2) răng phủ `cat-luot.mjs --pham-vi` nạp `tri-thuc-khoa.cjs` VÔ ĐIỀU KIỆN, trong khi danh sách chép gắn nhãn
// `[only-if-declared: tri_thuc]` cho tệp ấy — kho không khai tri thức chép đúng nhãn thì răng phủ vỡ MODULE_NOT_FOUND.
// Đo 25/10: `--nhip` KHÔNG vỡ (thoát trước chỗ nạp) — lối vỡ là `--pham-vi`, nên ca đặt ở đó.
//
// Kho tiêu thụ dựng bằng code trong lần chạy: danh sách chép rút từ marker INIT-CI-COPY-LIST thật (không chép tay),
// lọc theo nhãn `[only-if-declared: …]` như kho nhận đọc; bản phạm vi và tệp lộ trình là tệp thật của kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };

const initMd = readFileSync(path.join(ROOT, 'commands', 'acceptance-init.md'), 'utf8');
const block = (initMd.split('<!-- <<<INIT-CI-COPY-LIST -->')[1] || '').split('<!-- INIT-CI-COPY-LIST>>> -->')[0];
const MUC = [];
for (const dong of block.split('\n')) {
  const m = dong.match(/\$\{CLAUDE_PLUGIN_ROOT\}\/([^`]+)`\s*→/);
  if (!m) continue;
  const nhan = dong.match(/\[only-if-declared: ([a-z_]+)\]/);
  MUC.push({ src: m[1], khi: nhan ? nhan[1] : null });
}
const PV = 'docs/plans/pham-vi-tri-thuc-2410.md';
const LT = 'docs/plans/lo-trinh-kit.json';
// SKILL cắt lượt: cat-luot.mjs đọc khối CAT-LUOT-CO lúc chạy CLI (lệnh chạy từ gốc gói); kho chạy bản chép cũng cần nó.
const SKILL_CL = 'skills/cat-luot/SKILL.md';

const tmps = [];
process.on('exit', () => { for (const d of tmps) { try { rmSync(d, { recursive: true, force: true }); } catch {} } });
// khai: khoá kho khai — mặc định lo_trinh + tin_hieu như crm (cat-luot.mjs chỉ vào bản chép khi khai tin_hieu);
// them/bo: chỉnh tay tập tệp chép (đối chứng dương, ca tiêm).
const NEN = ['lo_trinh', 'tin_hieu'];
function dungKho({ khai = NEN, them = [], bo = [], cfgThem = '' } = {}) {
  const d = mkdtempSync(path.join(tmpdir(), 'ct-')); tmps.push(d);
  const tep = MUC.filter(x => !x.khi || khai.includes(x.khi)).map(x => x.src).filter(s => !bo.includes(s));
  for (const rel of [...tep, ...them, SKILL_CL, PV, LT]) {
    mkdirSync(path.join(d, path.dirname(rel)), { recursive: true });
    copyFileSync(path.join(ROOT, rel), path.join(d, rel));
  }
  mkdirSync(path.join(d, '_acceptance'), { recursive: true });
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'), `schema_version: 1\n${cfgThem}`);
  const g = (...a) => execFileSync('git', ['-C', d, ...a], { stdio: 'ignore' });
  g('init', '-q'); g('add', '-A'); g('-c', 'user.email=ct@x', '-c', 'user.name=ct', 'commit', '-qm', 'init');
  return d;
}
const chay = (d, rel, ...a) => {
  const r = spawnSync('node', [path.join(d, rel), '--root', d, ...a], { encoding: 'utf8', env: { ...process.env, ACCEPTANCE_TODAY: '2026-10-25' } });
  return { code: r.status, out: `${r.stdout}\n${r.stderr}` };
};
const TRI_THUC = 'tri_thuc:\n  noi: docs/tri-thuc\n';

check('CT0 danh sách chép rút được từ marker, có nhãn tri_thuc, mọi src tồn tại', () => {
  assert.ok(MUC.length >= 20, `chỉ rút được ${MUC.length} mục`);
  assert.ok(MUC.some(x => x.khi === 'tri_thuc'), 'không mục nào mang nhãn [only-if-declared: tri_thuc]');
  for (const x of MUC) assert.ok(existsSync(path.join(ROOT, x.src)), `src không có: ${x.src}`);
});

check('CT1 kho KHÔNG khai tri_thuc, chép đúng nhãn: răng phủ --pham-vi chạy tới bảng phủ, không vỡ nạp mô-đun', () => {
  // Đối chứng dương: cùng kho cộng tệp khoá tri thức → răng phủ chạy (fixture đúng, đỏ dưới là do tệp vắng).
  const duong = chay(dungKho({ them: ['scripts/tri-thuc-khoa.cjs'] }), 'scripts/cat-luot.mjs', '--pham-vi', PV, '--lo-trinh', LT);
  assert.match(duong.out, /bảng phủ đợt tri-thuc-2410/, `đối chứng dương không ra bảng phủ:\n${duong.out.slice(0, 600)}`);
  const r = chay(dungKho(), 'scripts/cat-luot.mjs', '--pham-vi', PV, '--lo-trinh', LT);
  assert.doesNotMatch(r.out, /Cannot find module/, `răng phủ vỡ nạp mô-đun ở kho không khai tri_thuc:\n${r.out.slice(0, 600)}`);
  assert.match(r.out, /bảng phủ đợt tri-thuc-2410/, `không ra bảng phủ:\n${r.out.slice(0, 600)}`);
  assert.equal(r.code, duong.code, 'mã thoát khác đối chứng dương — kho không khai tri thức phải ra cùng phán quyết');
});

check('CT2 kho khai tri_thuc mà thiếu tệp khoá tri thức: răng phủ dừng to (thoát 2, nêu tệp thiếu), không im lặng bỏ răng nguồn', () => {
  const r = chay(dungKho({ cfgThem: TRI_THUC }), 'scripts/cat-luot.mjs', '--pham-vi', PV, '--lo-trinh', LT);
  assert.equal(r.code, 2, `mã thoát ${r.code}, mong 2:\n${r.out.slice(0, 600)}`);
  assert.match(r.out, /kho khai tri_thuc mà thiếu .*tri-thuc-khoa\.cjs/, `thông điệp không nêu tệp thiếu:\n${r.out.slice(0, 600)}`);
});

check('CT3 kho khai tri_thuc, chép trọn danh sách: lint tri thức chạy, không vỡ vì thiếu khuôn', () => {
  const r = chay(dungKho({ khai: [...NEN, 'tri_thuc'], cfgThem: TRI_THUC }), 'scripts/tri-thuc.mjs', '--kiem');
  assert.doesNotMatch(r.out, /ENOENT[^\n]*tri-thuc-template\.md/, `lint vỡ vì danh sách chép thiếu khuôn:\n${r.out.slice(0, 600)}`);
  assert.doesNotMatch(r.out, /Cannot find module|ENOENT/, `lint vỡ vì thiếu tệp:\n${r.out.slice(0, 600)}`);
  // Đối chứng chiều đỏ trong lần chạy: gỡ khuôn khỏi bản chép thì lint PHẢI vỡ đúng vì khuôn — ca này phân biệt được.
  const tiem = chay(dungKho({ khai: [...NEN, 'tri_thuc'], cfgThem: TRI_THUC, bo: ['skills/acceptance/references/tri-thuc-template.md'] }), 'scripts/tri-thuc.mjs', '--kiem');
  assert.match(tiem.out, /ENOENT[^\n]*tri-thuc-template\.md/, `bản tiêm thiếu khuôn không vỡ đúng chỗ:\n${tiem.out.slice(0, 600)}`);
});

check('CT4 --nhip ở kho không khai tri_thuc chạy được (không phải lối vỡ; ghim để lối này không hỏng theo)', () => {
  const r = chay(dungKho(), 'scripts/cat-luot.mjs', '--nhip');
  assert.equal(r.code, 0, r.out.slice(0, 600));
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
