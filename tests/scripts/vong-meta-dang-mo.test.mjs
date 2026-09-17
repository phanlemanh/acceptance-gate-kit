// VM — dòng «vòng meta đang mở trong cửa sổ: N» của bộ quét mở phiên (hồ sơ mốc
// release-2-15-0, hạt giống owner phê 17/09).
//
// Luật (b) cho tối đa MỘT vòng meta giữa hai mốc; cửa sổ 2.13 → 2.14 có hai vòng
// chạy song song ở hai phiên và con số chỉ lộ khi mốc đếm. Khoá `metaOpen` của
// scripts/start-scan.mjs biến «tối đa một» thành số trên thẻ.
//
// Mọi ca chạy CHÍNH bộ quét thật trên kho git do code sinh trong lần chạy này;
// chiều đỏ chạy bản sao TRỌN `scripts/` + `lib/` của cây đang kiểm, bỏ đúng một
// chỗ đếm. Mọi đường dẫn suy từ vị trí tệp này.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const SCAN = path.join(ROOT, 'scripts', 'start-scan.mjs');
// Trạng thái «đã thông cổng» của hồ sơ nhiễu RÚT từ lib — một nguồn, không gõ tay
// (cùng khuôn tệp ca chup-ho-so-da-thong; RT13 soi mọi tệp gõ tay chuỗi trạng thái).
const { DA_THONG_CONG_2 } = createRequire(import.meta.url)(path.join(ROOT, 'lib', 'workspace-record.cjs'));
assert.ok(Array.isArray(DA_THONG_CONG_2) && DA_THONG_CONG_2.length > 0, 'lib không trả mảng trạng thái đã thông cổng');
const DA_THONG = DA_THONG_CONG_2[0];
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const tmps = [];
process.on('exit', () => { for (const d of tmps) { try { rmSync(d, { recursive: true, force: true }); } catch { /* dọn tạm */ } } });
const tmp = p => { const d = mkdtempSync(path.join(tmpdir(), p)); tmps.push(d); return d; };

const W = (r, rel, s) => { const p = path.join(r, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); };
const git = (r, ...a) => execFileSync('git', ['-C', r, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const hopDong = (slug, status) => `---\nschema_version: 1\nfeature: ${slug}\nslug: ${slug}\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${status}\napproved_by: Manh Phan\n---\n`;
const manifest = (name, version) => JSON.stringify({ name, version, description: 'fixture' }, null, 2) + '\n';

// Kho mẫu. Trước mốc: hồ sơ mở `mo-truoc-moc` (không được đếm — sinh trước mốc).
// Mốc: commit đổi dòng version. Sau mốc: `vong-a` mở · `release-9-9-0` draft (hồ sơ
// mốc, không phải vòng meta) · `vong-ky` đã ký (đã thông cổng). Thêm `hai` → `vong-b`
// mở. Commit cuối đổi mô tả manifest NHƯNG không đổi version — mốc không được trôi.
function khoMau({ ten = 'acceptance-gate', hai = false } = {}) {
  const r = tmp('vong-meta-');
  W(r, '_acceptance/config.yaml', 'schema_version: 1\n');
  W(r, '.claude-plugin/plugin.json', manifest(ten, '9.8.0'));
  W(r, '_acceptance/mo-truoc-moc/contract.md', hopDong('mo-truoc-moc', 'approved'));
  git(r, 'init', '-q'); git(r, 'add', '-A'); git(r, 'commit', '-qm', 'truoc moc');
  W(r, '.claude-plugin/plugin.json', manifest(ten, '9.9.0'));
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'cat so 9.9.0');
  const moc = git(r, 'rev-parse', 'HEAD');
  W(r, '_acceptance/vong-a/contract.md', hopDong('vong-a', 'implemented'));
  W(r, '_acceptance/release-9-9-0/contract.md', hopDong('release-9-9-0', 'draft'));
  W(r, '_acceptance/vong-ky/contract.md', hopDong('vong-ky', DA_THONG));
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'sau moc');
  if (hai) W(r, '_acceptance/vong-b/contract.md', hopDong('vong-b', 'draft'));   // chưa commit: vẫn là vòng đang mở
  W(r, '.claude-plugin/plugin.json', JSON.stringify({ name: ten, version: '9.9.0', description: 'mo ta doi, so khong doi' }, null, 2) + '\n');
  git(r, 'add', '.claude-plugin'); git(r, 'commit', '-qm', 'doi mo ta');
  return { r, moc };
}
const quet = (scan, r) => JSON.parse(execFileSync(process.execPath, [scan, '--root', r], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })).metaOpen;

// Phán cho ca hai vòng — dùng lại ở chiều đỏ: bản sao đã phá phải làm CHÍNH phán này đỏ.
const phanHaiVong = (m, moc) => {
  const loi = [];
  if (!m) return ['đầu ra không có khoá metaOpen'];
  if (m.applies !== true) loi.push(`applies=${m.applies}`);
  if (m.moc !== moc) loi.push(`moc=${m.moc} (mong ${moc})`);
  if (JSON.stringify(m.slugs) !== JSON.stringify(['vong-a', 'vong-b'])) loi.push(`slugs=${JSON.stringify(m.slugs)}`);
  if (m.n !== 2) loi.push(`n=${m.n}`);
  if (m.flag !== true) loi.push(`flag=${m.flag}`);
  return loi;
};

check('VM1 ĐỐI CHỨNG DƯƠNG kho kit, MỘT vòng mở sau mốc (nhiễu: mở trước mốc · hồ sơ mốc · đã ký) → n=1, KHÔNG cờ, mốc là commit đổi version', () => {
  const { r, moc } = khoMau();
  const m = quet(SCAN, r);
  assert.deepEqual(m, { applies: true, moc, slugs: ['vong-a'], n: 1, flag: false });
});

check('VM2 HAI vòng mở sau mốc (một chưa commit) → n=2, CỜ, đúng tên cả hai', () => {
  const { r, moc } = khoMau({ hai: true });
  assert.deepEqual(phanHaiVong(quet(SCAN, r), moc), []);
});

check('VM3 kho tiêu thụ (manifest tên khác), cùng hồ sơ → không áp: không đếm, không cờ', () => {
  const { r } = khoMau({ ten: 'san-pham-x', hai: true });
  assert.deepEqual(quet(SCAN, r), { applies: false, moc: null, slugs: [], n: null, flag: false });
});

check('VM4 kho kit KHÔNG phải git → «chưa biết»: moc và n là null, không cờ (không in 0)', () => {
  const { r } = khoMau({ hai: true });
  const khongGit = tmp('vong-meta-khong-git-');
  cpSync(r, khongGit, { recursive: true, filter: s => !s.split(path.sep).includes('.git') });
  assert.deepEqual(quet(SCAN, khongGit), { applies: true, moc: null, slugs: [], n: null, flag: false });
});

check('VM5 CHIỀU ĐỎ: bản sao trọn scripts/+lib/ chưa phá cho đúng kết quả VM2; gỡ đúng MỘT chỗ đếm → phán VM2 đỏ gọi tên n và cờ', () => {
  const { r, moc } = khoMau({ hai: true });
  const ban = tmp('vong-meta-ban-sao-');
  cpSync(path.join(ROOT, 'scripts'), path.join(ban, 'scripts'), { recursive: true });
  cpSync(path.join(ROOT, 'lib'), path.join(ban, 'lib'), { recursive: true });
  const scanBan = path.join(ban, 'scripts', 'start-scan.mjs');
  assert.deepEqual(phanHaiVong(quet(scanBan, r), moc), [], 'bản sao CHƯA phá phải xanh — không thì chiều đỏ không chứng gì');
  const src = readFileSync(scanBan, 'utf8');
  const NEO = '    kq.slugs.push(e.name);\n';
  assert.equal(src.split(NEO).length - 1, 1, 'neo đột biến phải xuất hiện đúng một lần');
  writeFileSync(scanBan, src.replace(NEO, ''));
  const loi = phanHaiVong(quet(scanBan, r), moc);
  assert.ok(loi.includes('n=0') && loi.includes('flag=false'), `bản đã phá phải làm phán đỏ ở n và cờ, được: ${JSON.stringify(loi)}`);
});

console.log(`\nvong-meta-dang-mo: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
