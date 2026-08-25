// tests/plugins/design-pass-nac.test.mjs — ca hồ sơ design-pass-nac-khong-dong-bo (DP1–DP13).
// Mọi fixture RÚT TỪ mốc neo của đầu VIẾT (skills/design-pass/SKILL.md); mọi mutant đi qua
// CHÍNH bộ kiểm mà chiều xanh dùng — cùng hàm, khác input. Đường dẫn suy từ vị trí file này.
// Ma trận mutant là HỢP ĐỒNG, khai ở đầu evals.yaml của hồ sơ; số mutant = số vế được khẳng định.
//   DP_CASES=DP1,DP3 node tests/plugins/design-pass-nac.test.mjs
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const SKILL = path.join(ROOT, 'skills', 'design-pass', 'SKILL.md');

let failures = 0;
// MỘT nguồn danh sách ca: file này. `--ids` in ra để run-tests.sh lặp theo, không chép tay.
const ALL_IDS = ['DP1', 'DP2', 'DP3'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.DP_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const ran = new Set();
const want = id => { const w = only.length === 0 || only.includes(id); if (w) ran.add(id); return w; };
// Ranh giới cứng quanh id: `PASS: [DP1]` không là tiền tố của ca anh em.
const pass = (id, name) => console.log(`PASS: [${id}] ${name}`);
const fail = (id, msg) => { console.log(`FAIL: [${id}] ${msg}`); failures++; };

const NAC = ['nac-0', 'nac-1', 'nac-2', 'nac-3'];
const block = (text, name) => {
  const m = text.match(new RegExp('<<<' + name + '\\n([\\s\\S]*?)\\n' + name + '>>>'));
  return m ? m[1] : null;
};
const frontmatter = text => {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : '';
};

// ---------------------------------------------------------------------------
// Bộ kiểm — DÙNG CHUNG cho chiều xanh và mọi mutant. Mỗi hàm trả mảng lỗi có
// TÊN VẾ trong thông điệp; ca nào chỉ so mã thoát là ca không phân biệt được
// «bắt đúng lỗi» với «chưa bao giờ chạy».
// ---------------------------------------------------------------------------

// DP1 · AC-1 — thang bốn nấc, một chỗ duy nhất khai danh sách
function checkLadder(skillText) {
  const errs = [];
  const b = block(skillText, 'REACTION-LADDER');
  if (b === null) return ['thieu moc neo REACTION-LADDER'];
  for (const id of NAC) {
    const row = b.split('\n').find(l => l.includes('| ' + id + ' |'));
    if (!row) { errs.push(`thang thieu nac: ${id}`); continue; }
    // mỗi nấc phải có TÊN tiếng người + ĐIỀU KIỆN dùng: 3 ô không rỗng
    const cells = row.split('|').map(s => s.trim()).filter(Boolean);
    if (cells.length < 3 || !cells[1] || !cells[2]) errs.push(`nac thieu ten hoac dieu kien: ${id}`);
  }
  // Danh sách nấc chỉ được KHAI một chỗ. Khuôn sổ phiên cố ý TRỎ VỀ mốc neo này
  // thay vì liệt lại bốn id — nếu nó liệt lại thì kit có hai bản danh sách để trôi.
  // Đo QUAN HỆ «có bản danh sách thứ hai», KHÔNG đo «dòng nào có ≥2 từ khoá»: một câu
  // văn xuôi so sánh nac-2 với nac-3 là hợp lệ và phải giữ được. Danh sách thứ hai có
  // đúng hai hình dạng: một HÀNG BẢNG khai nấc, hoặc một liệt kê từ ba id trở lên.
  const outside = skillText.replace(b, '');
  const dupLines = outside.split('\n').filter(l =>
    /\|\s*nac-[0-9a-z]+\s*\|/.test(l) || new Set(NAC.filter(id => l.includes(id))).size >= 3);
  if (dupLines.length) errs.push(`danh sach nac xuat hien 2 cho: "${dupLines[0].trim().slice(0, 60)}"`);
  return errs;
}

// DP2 · AC-2 — mặc định KHÔNG ĐỒNG BỘ ở cả mặt mô tả lẫn thân skill
function checkDefault(skillText) {
  const errs = [];
  const desc = frontmatter(skillText);
  // v1 — mặt mô tả (thứ harness đọc để quyết có nạp skill): phải khai mặc định
  // không đồng bộ VÀ khai ngồi-cùng là nấc có người gọi tên.
  if (!/mặc định không đồng bộ/i.test(desc))
    errs.push('description con khai mac dinh dong bo (thieu "mặc định không đồng bộ")');
  if (!/gọi tên/i.test(desc))
    errs.push('description khong khai ngoi-cung la nac phai co nguoi goi ten');
  // v2 — thân skill: câu chuẩn giữa mốc neo phải đặt nac-3 là CÓ ĐIỀU KIỆN
  const s = block(skillText, 'REACTION-DEFAULT-SENTENCE');
  if (s === null) return errs.concat(['thieu moc neo REACTION-DEFAULT-SENTENCE']);
  if (!/KHÔNG ĐỒNG BỘ/.test(s)) errs.push('than skill khai mac dinh sai nac: cau chuan khong noi KHONG DONG BO');
  if (!/nac-3/.test(s) || !/(chỉ mở khi|có người gọi tên)/.test(s))
    errs.push('than skill khai mac dinh sai nac: nac-3 khong duoc dat la co dieu kien');
  return errs;
}

// DP3 · AC-3 — luật leo thang đủ ba vế đo được
function checkEscalation(skillText) {
  const errs = [];
  const b = block(skillText, 'REACTION-LADDER');
  // luật vận hành nằm ngay sau bảng thang; lấy trọn mục để không phụ thuộc thứ tự dòng
  const after = b === null ? skillText : skillText.slice(skillText.indexOf('REACTION-LADDER>>>'));
  const seg = after.slice(0, after.indexOf('\n## ') >= 0 ? after.indexOf('\n## ') : after.length);
  if (!/hai vòng không-đồng-bộ liên tiếp/.test(seg))
    errs.push('thieu dieu kien dem duoc (hai vong khong-dong-bo lien tiep)');
  if (!/mời nac-3/.test(seg))
    errs.push('thieu hanh dong leo thang (moi nac-3)');
  if (!/GIỚI HẠN/.test(seg) || !/không phiên trọn gói/.test(seg))
    errs.push('thieu ve gioi han pham vi');
  return errs;
}

// ---------------------------------------------------------------------------
// Chạy ca: đối chứng dương TRƯỚC, rồi ma trận mutant.
// ---------------------------------------------------------------------------
const src = readFileSync(SKILL, 'utf8');

// runCase: check = hàm bộ kiểm; mutants = [[tên, biến-đổi-chuỗi, mảnh-thông-điệp-mong-đợi]]
function runCase(id, label, check, mutants) {
  if (!want(id)) return;
  const clean = check(src);
  if (clean.length) return fail(id, `doi chung duong DO — ban nguyen ven phai XANH: ${clean.join(' · ')}`);
  const bad = [];
  for (const [name, mutate, needle] of mutants) {
    const mutated = mutate(src);
    if (mutated === src) { bad.push(`${name}: lenh tiem KHONG doi duoc dong nao`); continue; }
    const errs = check(mutated);
    if (!errs.some(e => e.includes(needle))) {
      bad.push(`${name}: khong do dung ve "${needle}" (thu duoc: ${errs.join(' · ') || 'KHONG LOI NAO'})`);
    }
  }
  if (bad.length) fail(id, bad.join(' · '));
  else pass(id, `${label} — doi chung duong xanh + ${mutants.length} mutant do dung ve`);
}

runCase('DP1', 'thang bon nac, mot cho duy nhat khai danh sach', checkLadder, [
  ...NAC.map(id => [`m-${id}`, s => s.replace('| ' + id + ' |', '| nac-X |'), `thang thieu nac: ${id}`]),
  ['m-dup', s => s.replace('\n## ', '\n\nDanh sách nấc: nac-0, nac-1, nac-2, nac-3.\n\n## '),
    'danh sach nac xuat hien 2 cho'],
]);

runCase('DP2', 'mac dinh KHONG DONG BO o ca mat mo ta lan than skill', checkDefault, [
  ['m-desc', s => s.replace(/mặc định không đồng bộ/i, 'owner ngồi xem và phản ứng bằng lời từng vòng'),
    'description con khai mac dinh dong bo'],
  // Mutant bẻ ĐÚNG câu chuẩn trong mốc neo, không dùng regex toàn file: cụm «có người
  // gọi tên» cũng nằm trong description, regex toàn file sẽ bẻ nhầm vế v1 và ca thành
  // vô nghĩa (đo vế khác với vế nó tuyên).
  ['m-body', s => {
    const b = block(s, 'REACTION-DEFAULT-SENTENCE');
    return s.replace(b, b.replace(/nac-3 \(ngồi cùng\)[^.]*\./, 'nac-3 (ngồi cùng) là mặc định.'));
  }, 'than skill khai mac dinh sai nac'],
]);

runCase('DP3', 'luat leo thang du ba ve do duoc', checkEscalation, [
  ['m-dieu-kien', s => s.replace('hai vòng không-đồng-bộ liên tiếp', 'nhiều vòng'),
    'thieu dieu kien dem duoc'],
  ['m-hanh-dong', s => s.replace('mời nac-3', 'cân nhắc đổi kênh'),
    'thieu hanh dong leo thang'],
  ['m-gioi-han', s => s.replace('không phiên trọn gói', 'như thường lệ'),
    'thieu ve gioi han pham vi'],
]);

// DP_CASES nêu id không tồn tại → không được xanh im lặng (xanh-không-chạy)
const unknown = only.filter(id => !ran.has(id));
if (unknown.length) { console.log(`FAIL: [DP_CASES] không khớp ca nào: ${unknown.join(',')}`); failures++; }
if (failures) { console.log(`design-pass-nac: ${failures} ca đỏ`); process.exit(1); }
