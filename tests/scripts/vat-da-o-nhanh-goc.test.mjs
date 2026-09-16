// Ca thường trực: hồ sơ treo ở `approved` mà vật đã nằm trong nhánh gốc.
//
// Ca thật (16/09, repo tiêu thụ crm-onehub): vòng `cua-vao-noi-tieng-viet` merge
// từ 04/09, chủ kho đặt `status` ngược về `approved` ngày 06/09 và đổi tên bằng
// chứng thành `evidence-report.xep-lai-2026-09-06.md`. Thẻ mở phiên đọc
// `approved` + có kế hoạch → in «viết code (S3)», owner chọn dòng đó, và một
// phiên 8 giờ 25 phút chấm lại thứ đã ở prod.
//
// Luật của kit mà tệp này giữ:
//  (a) fixture do CODE sinh trong chính lần chạy — kho git tạm, commit thật;
//  (b) mọi đường dẫn suy từ VỊ TRÍ tệp này, không hardcode gốc kho;
//  (c) dòng `verified_commit` rút từ KHUÔN BÊN VIẾT (evidence-report-template.md),
//      không gõ lại theo trí nhớ;
//  (d) HAI CHIỀU trên CÙNG một kho: độ nhạy (tổ tiên → nhóm mới; và phá vật trong
//      bản sao → nhóm mới biến mất) · độ đặc hiệu (không bằng chứng, nhánh không
//      merge, sha lạ, nhánh `implemented` → IM, giữ nhãn cũ);
//  (e) chiều đỏ ghim ĐÚNG câu chữ mặt người, không chỉ khoá.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const SCAN = path.join(ROOT, 'scripts', 'start-scan.mjs');

let assert = 0, fail = 0;
const ok = (ten, dieu, chiTiet = '') => {
  assert++;
  if (dieu) console.log(`  PASS: ${ten}`);
  else { console.log(`  FAIL: ${ten}${chiTiet ? ` — ${chiTiet}` : ''}`); fail++; }
};

// Câu chữ mặt người GÕ TAY ở đây, KHÔNG rút từ bảng chữ: rút từ bảng thì sửa bảng
// sai vẫn xanh — thông điệp là vật được đo.
const NHAN = 'vật đã nằm trong nhánh gốc — hồ sơ còn treo ở «đã duyệt»';
const VIEC_KE = 'người: chọn một lối — đóng theo quan sát (ghi quyết định, không chấm lại) hoặc chấm lại (đưa về «code xong», chạy nghiệm thu máy)';

// ── khuôn bên VIẾT ──────────────────────────────────────────────────────────
const dongVerifiedCommit = sha => {
  const tpl = readFileSync(path.join(ROOT, 'skills/acceptance/references/evidence-report-template.md'), 'utf8');
  const line = tpl.split('\n').find(l => l.startsWith('verified_commit:'));
  if (!line || !/\{\{[^}]*\}\}/.test(line)) throw new Error('khuôn bên viết không còn dòng verified_commit có ô giữ chỗ');
  return line.replace(/\{\{[^}]*\}\}/, sha);
};
const baoCao = (sha, verdict = 'PASS') =>
  `---\nschema_version: 2\nslug: x\nverdict: ${verdict}\n${dongVerifiedCommit(sha)}\nhuman_signoff:\n---\n# Evidence Report\n`;
const hopDong = (slug, status) =>
  `---\nschema_version: 1\nfeature: ${slug}\nslug: ${slug}\nrisk_tier: T2\nsurfaces: [api]\nstatus: ${status}\napproved_by: Manh Phan\napproved_at: 2026-09-01T00:00:00Z\n---\n# C\n`;

// ── kho git tạm ─────────────────────────────────────────────────────────────
const git = (kho, ...a) => execFileSync('git', ['-C', kho, ...a],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' } }).trim();
const W = (kho, rel, s) => { const p = path.join(kho, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); };

const kho = mkdtempSync(path.join(tmpdir(), 'vdong-'));
git(kho, 'init', '-q');
git(kho, 'checkout', '-q', '-b', 'goc');
W(kho, '_acceptance/config.yaml', 'schema_version: 1\n');
W(kho, 'src/app.js', 'v0\n');
git(kho, 'add', '-A'); git(kho, 'commit', '-q', '-m', 'nen');
// nhánh KHÔNG merge: một commit thật, rồi quay về nhánh gốc
git(kho, 'checkout', '-q', '-b', 'nhanh-khong-merge');
W(kho, 'src/app.js', 'nhanh le\n');
git(kho, 'add', '-A'); git(kho, 'commit', '-q', '-m', 'nhanh khong merge');
const SHA_LE = git(kho, 'rev-parse', 'HEAD');
git(kho, 'checkout', '-q', 'goc');
// vật đã vào nhánh gốc
W(kho, 'src/app.js', 'v1 da merge\n');
git(kho, 'add', '-A'); git(kho, 'commit', '-q', '-m', 'vat da merge');
const SHA_GOC = git(kho, 'rev-parse', 'HEAD');
// sha đúng khuôn nhưng không có trong kho đối tượng
const SHA_LA = 'f'.repeat(40);

const hoSo = (slug, status, { ke = true, bc = null } = {}) => {
  W(kho, `_acceptance/${slug}/contract.md`, hopDong(slug, status));
  if (ke) W(kho, `docs/superpowers/plans/2026-09-01-${slug}.md`, '# plan\n');
  for (const [ten, noiDung] of Object.entries(bc || {})) W(kho, `_acceptance/${slug}/${ten}`, noiDung);
};
hoSo('a-vat-da-vao', 'approved', { bc: { 'evidence-report.md': baoCao(SHA_GOC) } });
hoSo('b-khong-bang-chung', 'approved');
hoSo('c-nhanh-khong-merge', 'approved', { bc: { 'evidence-report.md': baoCao(SHA_LE) } });
hoSo('d-doi-ten-xep-lai', 'approved', { bc: { 'evidence-report.xep-lai-2026-09-06.md': baoCao(SHA_GOC) } });
hoSo('e-sha-la', 'approved', { bc: { 'evidence-report.md': baoCao(SHA_LA) } });
hoSo('f-chua-ke-hoach', 'approved', { ke: false, bc: { 'evidence-report.md': baoCao(SHA_GOC) } });
hoSo('g-da-code-xong', 'implemented', { bc: { 'evidence-report.md': baoCao(SHA_GOC) } });
git(kho, 'add', '-A'); git(kho, 'commit', '-q', '-m', 'ho so');

const quet = (script, root) => JSON.parse(execFileSync(process.execPath, [script, '--root', root], { encoding: 'utf8' }));
const tim = (j, slug) => (j.groups.inProgress || []).find(x => x.slug === slug);

const j = quet(SCAN, kho);
const moTa = it => JSON.stringify(it ? { stateKey: it.stateKey, nextStep: it.nextStep, label: it.label } : null);

// ── độ nhạy: tổ tiên của HEAD → nhóm mới, đúng câu chữ ────────────────────────
for (const [id, slug] of [['VDG1', 'a-vat-da-vao'], ['VDG4', 'd-doi-ten-xep-lai'], ['VDG6', 'f-chua-ke-hoach']]) {
  const it = tim(j, slug);
  ok(`${id} ${slug}: approved + bằng chứng có commit đã vào nhánh gốc → nhóm «vật đã ở nhánh gốc», đúng nhãn và việc kế`,
    it && it.stateKey === 'vat-da-o-nhanh-goc' && it.label === NHAN && it.viecKe === VIEC_KE
      && it.status === 'approved' && it.nextStep === null,
    moTa(it));
}

// ── độ đặc hiệu: không đủ căn cứ → IM, giữ nhãn cũ ───────────────────────────
for (const [id, slug, ly] of [
  ['VDG2', 'b-khong-bang-chung', 'không có bằng chứng'],
  ['VDG3', 'c-nhanh-khong-merge', 'commit của bằng chứng nằm trên nhánh KHÔNG merge'],
  ['VDG5', 'e-sha-la', 'commit không có trong kho đối tượng — chưa biết'],
]) {
  const it = tim(j, slug);
  ok(`${id} ${slug}: ${ly} → vẫn «đang viết code»`,
    it && it.stateKey === 'dang-viet-code' && it.nextStep === 'S3' && it.label === 'đang viết code', moTa(it));
}
{
  const it = tim(j, 'g-da-code-xong');
  ok('VDG7 nhánh «code xong» KHÔNG đổi dù commit của bằng chứng đã vào nhánh gốc',
    it && it.stateKey === 'cho-nghiem-thu-may' && it.nextStep === 'S4', moTa(it));
}
// không slug nào bị đẩy sang hỏng hay mất tích
ok('VDG8 bảy hồ sơ đều nằm trong nhóm đang dở, không hồ sơ nào hỏng',
  (j.groups.inProgress || []).length === 7 && (j.broken || []).length === 0,
  `inProgress=${(j.groups.inProgress || []).length} broken=${JSON.stringify(j.broken)}`);

// ── chiều đỏ: phá VẬT trong bản sao → VDG1 phải lật ──────────────────────────
// Chép TRỌN thư mục scripts/ và lib/ (không danh sách tệp tay — bài học P150),
// rồi thay đúng lời gọi phép hỏi tổ tiên bằng `false`. Đột biến gọi CHÍNH bộ quét
// mà đường xanh gọi, chỉ khác một biểu thức.
const banSao = mkdtempSync(path.join(tmpdir(), 'vdong-mut-'));
cpSync(path.join(ROOT, 'scripts'), path.join(banSao, 'scripts'), { recursive: true });
cpSync(path.join(ROOT, 'lib'), path.join(banSao, 'lib'), { recursive: true });
const scanMut = path.join(banSao, 'scripts', 'start-scan.mjs');
const src = readFileSync(scanMut, 'utf8');
const NEO = 'vatDaONhanhGoc(dir)';
const soNeo = src.split(NEO).length - 1;
ok('VDG9 neo đột biến có đúng một chỗ gọi trong bộ quét', soNeo === 1, `tìm thấy ${soNeo}`);
if (soNeo === 1) {
  // Đối chứng dương cho BẢN SAO: chưa phá thì phải ra nhóm mới như bản thật —
  // không thì một bản sao hỏng (thiếu tệp, sai đường) cũng cho «đang viết code».
  const lanh = tim(quet(scanMut, kho), 'a-vat-da-vao');
  ok('VDG10a bản sao CHƯA phá cho đúng nhóm mới (bản sao chạy được)',
    lanh && lanh.stateKey === 'vat-da-o-nhanh-goc', moTa(lanh));
  writeFileSync(scanMut, src.replace(NEO, 'false'));
  const it = tim(quet(scanMut, kho), 'a-vat-da-vao');
  ok('VDG10 chiều đỏ: gỡ phép hỏi tổ tiên → hồ sơ đã merge quay về «đang viết code» (thẻ lại mời viết code)',
    it && it.stateKey === 'dang-viet-code' && it.label === 'đang viết code', moTa(it));
}

if (assert === 0) { console.log('  FAIL: sàn đếm — 0 assertion'); process.exit(1); }
console.log(`Results: ${assert - fail} passed, ${fail} failed (vat-da-o-nhanh-goc)`);
process.exit(fail === 0 ? 0 : 1);
