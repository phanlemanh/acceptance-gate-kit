// tests/plugins/design-pass-nac.test.mjs — ca hồ sơ design-pass-nac-khong-dong-bo (DP1–DP13).
// Mọi fixture RÚT TỪ mốc neo của đầu VIẾT (skills/design-pass/SKILL.md); mọi mutant đi qua
// CHÍNH bộ kiểm mà chiều xanh dùng — cùng hàm, khác input. Đường dẫn suy từ vị trí file này.
// Ma trận mutant là HỢP ĐỒNG, khai ở đầu evals.yaml của hồ sơ; số mutant = số vế được khẳng định.
//   DP_CASES=DP1,DP3 node tests/plugins/design-pass-nac.test.mjs
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, cpSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const SKILL = path.join(ROOT, 'skills', 'design-pass', 'SKILL.md');

let failures = 0;
// MỘT nguồn danh sách ca: file này. `--ids` in ra để run-tests.sh lặp theo, không chép tay.
const ALL_IDS = ['DP1', 'DP2', 'DP3', 'DP4', 'DP5', 'DP6', 'DP7', 'DP8', 'DP9', 'DP10', 'DP13'];
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
// Lấy trọn một mục theo tiêu đề, tới tiêu đề cùng bậc kế tiếp.
const section = (text, heading) => {
  const i = text.indexOf(heading);
  if (i < 0) return null;
  const rest = text.slice(i + heading.length);
  const j = rest.indexOf('\n## ');
  return heading + (j >= 0 ? rest.slice(0, j) : rest);
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

const DIVERGENCE = '## 3b. Bước phân kỳ';
// Mutant PHẢI bẻ trong đúng mục đang đo. `String.replace` đổi CHỖ ĐẦU trong toàn file,
// nên một cụm xuất hiện hai chỗ sẽ bị bẻ ở chỗ không ai đo — mutant thành vô hiệu mà
// nhìn thì vẫn như đã tiêm. Lớp lỗi này đã cắn một lần ở DP2 (m-body) và một lần ở DP6.
const mutIn = (s, heading, frag, repl) => {
  const sec = section(s, heading);
  return s.replace(sec, sec.replace(frag, repl));
};

// DP4 · AC-4 — thứ tự bắt buộc + nguồn bày hướng
function checkDivergenceOrder(skillText) {
  const errs = [];
  const sec = section(skillText, DIVERGENCE);
  if (sec === null) return [`thieu muc ${DIVERGENCE}`];
  // Đo THỨ TỰ bằng vị trí ký tự, không đo sự CÓ MẶT: một mutant hoán vị hai mệnh đề
  // mà không xoá chữ nào phải làm ca này đỏ, nếu không ca chỉ đang đếm từ.
  const low = sec.toLowerCase();
  const iReal = low.indexOf('mở bằng vật thật đang có'.toLowerCase());
  const iShow = low.indexOf('bày hướng');
  if (iReal < 0) errs.push('thieu ve: mo bang vat that dang co');
  if (iShow < 0) errs.push('thieu ve: bay huong');
  if (iReal >= 0 && iShow >= 0 && iReal > iShow) errs.push('vat that phai dung truoc bay huong');
  if (!sec.includes('## Đặc tả UX')) errs.push('thieu nguon bay huong: Dac ta UX');
  if (!/kho chưa có bản đặc tả/.test(sec)) errs.push('thieu nhanh lui khi kho chua co dac ta UX');
  return errs;
}

// DP5 · AC-5 — kỷ luật phương án, bốn vế
function checkOptionDiscipline(skillText) {
  const errs = [];
  const sec = section(skillText, DIVERGENCE);
  if (sec === null) return [`thieu muc ${DIVERGENCE}`];
  if (!/TRỤC có tên/.test(sec) || !/động cơ/.test(sec) || !/đánh đổi/.test(sec))
    errs.push('thieu ve truc-dong co-danh doi');
  if (!/KỂ CẢ hướng máy không khuyên/.test(sec))
    errs.push('thieu ve ke ca huong may khong khuyen');
  if (!/GHIM TRÊN VẬT/.test(sec))
    errs.push('thieu ve nga may khuyen ghim tren vat');
  if (!/tên hướng ổn định/i.test(sec) || !/không hỏi lại/.test(sec))
    errs.push('thieu ve ten huong on dinh');
  return errs;
}

// DP6 · AC-6 — không có đường bỏ im lặng + khoá vết đóng + luật độ nét
function checkTraceAndFidelity(skillText) {
  const errs = [];
  const sec = section(skillText, DIVERGENCE);
  if (sec === null) return [`thieu muc ${DIVERGENCE}`];
  const degradeRow = skillText.split('\n').find(l => l.includes('|') && /Không mở bước phân kỳ/.test(l));
  if (!degradeRow) errs.push('bang tra degrade thieu hang khong-mo-phan-ky');
  else if (!/divergence:/.test(degradeRow)) errs.push('vet khong co khoa dong, moi phien ghi mot cho');
  else if (/không ghi gì|đi tiếp, không/.test(degradeRow)) errs.push('co nhanh bo im lang');
  if (!/`divergence: opened`/.test(sec) || !/`divergence: skipped — /.test(sec))
    errs.push('thieu tu vung dong cua khoa vet');
  if (!/đủ cho quyết định đang mở/.test(sec) || !/NỘI DUNG của quyết định/.test(sec))
    errs.push('thieu luat do net');
  return errs;
}

// DP7 · AC-7 — thang vật dựng bốn nấc, không phụ thuộc bộ dựng nào
function checkBuilderLadder(skillText) {
  const errs = [];
  const b = block(skillText, 'BUILDER-LADDER');
  if (b === null) return ['thieu moc neo BUILDER-LADDER'];
  for (const n of ['1.', '2.', '3.', '4.']) {
    if (!b.split('\n').some(l => l.trim().startsWith(n))) errs.push(`thang vat dung thieu nac: ${n}`);
  }
  if (!/ĐI TIẾP/.test(b) || /DỪNG nghi thức/.test(b))
    errs.push('thieu canvas khong duoc lam dung vong');
  // Vế VẮNG-MẶT: không nấc nào được ép một bộ dựng cụ thể. Assert vắng-mặt trên không
  // gian mở không tự chứng minh được nó biết đỏ — DP7 m3 là ca tiêm dương cho vế này.
  const sec = section(skillText, DIVERGENCE) || skillText;
  const forced = sec.match(/bắt buộc dùng\s+([^\s.,]+)/i);
  if (forced) errs.push(`kit bi ep phu thuoc bo dung: ${forced[1]}`);
  return errs;
}

// DP8 · AC-8 — khuôn sổ phiên giữ ba khoá mới, một chỗ duy nhất
const NOTE_TPL = 'DESIGN-PASS-NOTE-TEMPLATE';
function checkNoteKeys(skillText) {
  const b = block(skillText, NOTE_TPL);
  if (b === null) return [`thieu moc neo ${NOTE_TPL}`];
  const fm = b.split('---')[1] || '';
  const errs = [];
  for (const k of ['reaction:', 'options:', 'divergence:']) {
    if (!fm.includes(k)) errs.push(`khuon so phien thieu khoa: ${k}`);
  }
  // `options:` phải TỰ KHAI là tham chiếu — nếu không, phiên sau sẽ chép bộ phương án
  // vào chuỗi bằng chứng, đúng thứ Out of scope cấm.
  const line = fm.split('\n').find(l => l.trim().startsWith('options:')) || '';
  if (line && !/THAM CHIẾU/i.test(line)) errs.push('khoa options khong tu khai la tham chieu');
  // Khuôn KHÔNG được liệt lại bốn id nấc — danh sách nấc sống ở REACTION-LADDER.
  if (new Set(NAC.filter(id => fm.includes(id))).size >= 3)
    errs.push('khuon liet lai danh sach nac thay vi tro ve moc neo');
  return errs;
}

// ---------------------------------------------------------------------------
// Khớp vòng writer → reader. Hồ sơ thử do CODE SINH, rút TỪ khuôn của đầu VIẾT;
// bộ đọc là CHÍNH scripts/gate-card.js, chạy thật. Nhãn tiếng người cũng rút từ
// cột «Tên» của REACTION-LADDER — nếu bộ dựng thẻ tự chế chuỗi khác, ca này đỏ.
// ---------------------------------------------------------------------------
const GATE_CARD = path.join(ROOT, 'scripts', 'gate-card.js');
const CONTRACT_FX = '---\nschema_version: 1\nfeature: fx\nslug: fx\nrisk_tier: T2\nstatus: draft\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n';

// Nhãn lấy TỪ bảng thang trong skill — một nguồn, không gõ tay lần hai.
function ladderLabels(skillText) {
  const b = block(skillText, 'REACTION-LADDER') || '';
  const out = {};
  for (const l of b.split('\n')) {
    const m = l.match(/^\|\s*(nac-[0-9a-z]+)\s*\|\s*([^|]+?)\s*\|/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

// Sổ phiên sinh TỪ khuôn thật: điền mọi chỗ trống, rồi khẳng định không còn chỗ
// trống nào sống trong frontmatter — chỗ trống lọt qua là false-green của mối nối.
function noteFromTemplate(skillText, { reaction = 'nac-1', options = '', divergence = 'opened', drop = null } = {}) {
  const b = block(skillText, NOTE_TPL);
  if (b === null) throw new Error('thieu khuon so phien');
  let fx = b
    .replace('<slug>', 'fx').replace('<ISO UTC>', '2026-08-25T00:00:00Z')
    .replace('<url đã mở>', 'http://localhost:3000/proto/fx')
    .replace('<real-components|scaffold|static>', 'scaffold')
    .replace('<standalone|static-frame|host-embedded>', 'static-frame')
    .replace('[<file cảnh trong evidence/design-pass/, trống nếu không standalone hoặc đã descope>]', '[]')
    .replace('<id nấc lấy từ REACTION-LADDER>', reaction)
    .replace('(<kênh đã dùng, vd ghim, thao-luan, sua-roi-luu>)', '(ghim)')
    .replace('<đường dẫn hoặc URL bộ phương án — THAM CHIẾU, không phải bằng chứng; trống nếu không mở bước phân kỳ>', options)
    .replace('<opened, hoặc: skipped — căn cứ 1 dòng>', divergence)
    .replace('<tên-skill-đã-nạp|repo-tokens|shadcn-default>', 'repo-tokens')
    .replace('[<danh sách state đã duyệt>]', '[default]')
    .replace(/<n>/g, '1').replace('<state>', 'default').replace('<breakpoint>', 'mobile-375')
    .replace('<theme>', 'light').replace('<file>', 'default--mobile-375')
    .replace(/^- <file cảnh — [^\n]*>$/m, '- (không có)')
    .replace('<finding — đã đổi gì, 1 dòng/finding>', 'x')
    .replace('<finding — thiếu/xấu gì ở tầng DS/component, đề xuất 1 dòng>', 'y');
  if (drop) fx = fx.split('\n').filter(l => !l.startsWith(drop)).join('\n');
  const fm = fx.split('---')[1] || '';
  if (fm.includes('<')) throw new Error(`frontmatter ho so thu con cho trong song: ${fm.match(/<[^>]*>/)}`);
  return fx;
}

function mkWs(note) {
  const d = mkdtempSync(path.join(tmpdir(), 'dp-'));
  const ws = path.join(d, '_acceptance', 'fx');
  mkdirSync(ws, { recursive: true });
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'), 'schema_version: 1\n');
  writeFileSync(path.join(ws, 'contract.md'), CONTRACT_FX);
  if (note !== null) writeFileSync(path.join(ws, 'design-pass.md'), note);
  return d;
}

// Chạy bộ đọc THẬT; mutateCard != null → dựng bản sao TRỌN scripts/ + lib/ rồi bẻ
// bản sao đó (chép danh sách file tay là bản base thiếu file — lớp lỗi P150).
function render(wsRoot, mutateCard = null) {
  let card = GATE_CARD;
  if (mutateCard) {
    const d = mkdtempSync(path.join(tmpdir(), 'dpc-'));
    cpSync(path.join(ROOT, 'scripts'), path.join(d, 'scripts'), { recursive: true });
    cpSync(path.join(ROOT, 'lib'), path.join(d, 'lib'), { recursive: true });
    card = path.join(d, 'scripts', 'gate-card.js');
    writeFileSync(card, mutateCard(readFileSync(card, 'utf8')));
  }
  const r = spawnSync(process.execPath, [card, '--root', wsRoot, '--slug', 'fx'], { encoding: 'utf8' });
  return { status: r.status, out: r.stdout || '', err: r.stderr || '' };
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

runCase('DP4', 'thu tu bat buoc: vat that truoc, roi bay huong', checkDivergenceOrder, [
  // Hoán vị, KHÔNG xoá chữ nào: ca chỉ đếm từ sẽ vẫn xanh và lộ ra là ca chết.
  ['m-hoan-vi', s => {
    const sec = section(s, DIVERGENCE);
    const lines = sec.split('\n');
    const a = lines.findIndex(l => l.toLowerCase().includes('mở bằng vật thật đang có'.toLowerCase()));
    const b2 = lines.findIndex(l => l.includes('bày hướng'));
    const c = [...lines]; [c[a], c[b2]] = [c[b2], c[a]];
    return s.replace(sec, c.join('\n'));
  }, 'vat that phai dung truoc bay huong'],
  ['m-nhanh-lui', s => mutIn(s, DIVERGENCE, 'kho chưa có bản đặc tả', 'kho nào cũng vậy'),
    'thieu nhanh lui khi kho chua co dac ta UX'],
]);

runCase('DP5', 'ky luat phuong an du bon ve', checkOptionDiscipline, [
  ['m-truc', s => mutIn(s, DIVERGENCE, 'TRỤC có tên', 'nhãn'), 'thieu ve truc-dong co-danh doi'],
  ['m-khong-khuyen', s => mutIn(s, DIVERGENCE, 'KỂ CẢ hướng máy không khuyên', 'cho hướng được chọn'),
    'thieu ve ke ca huong may khong khuyen'],
  // Vế này là vế mà ván thử 19/08 chết vì thiếu — mutant của nó bắt buộc đứng riêng.
  ['m-ghim-tren-vat', s => mutIn(s, DIVERGENCE, 'GHIM TRÊN VẬT', 'nêu trong tin nhắn'),
    'thieu ve nga may khuyen ghim tren vat'],
  ['m-ten-on-dinh', s => mutIn(s, DIVERGENCE, 'không hỏi lại', 'hỏi lại khi cần'),
    'thieu ve ten huong on dinh'],
]);

runCase('DP6', 'khong co duong bo im lang + khoa vet dong + luat do net', checkTraceAndFidelity, [
  ['m-bo-im-lang', s => s.replace(/\| Không mở bước phân kỳ \|[^\n]*\|/,
    '| Không mở bước phân kỳ | Đi tiếp, không ghi gì. |'), 'vet khong co khoa dong'],
  ['m-tu-vung', s => mutIn(s, DIVERGENCE, '`divergence: opened`', '`ghi chú tự do`'),
    'thieu tu vung dong cua khoa vet'],
  ['m-do-net', s => mutIn(s, DIVERGENCE, 'đủ cho quyết định đang mở', 'cao nhất có thể'),
    'thieu luat do net'],
]);

runCase('DP7', 'thang vat dung bon nac, khong phu thuoc bo dung nao', checkBuilderLadder, [
  ['m-nac-cuoi', s => {
    const b = block(s, 'BUILDER-LADDER');
    return s.replace(b, b.replace('ĐI TIẾP', 'DỪNG nghi thức'));
  }, 'thieu canvas khong duoc lam dung vong'],
  ['m-nac-giua', s => {
    const b = block(s, 'BUILDER-LADDER');
    return s.replace(b, b.split('\n').filter(l => !l.trim().startsWith('3.')).join('\n'));
  }, 'thang vat dung thieu nac: 3.'],
  // CA TIÊM DƯƠNG cho vế vắng-mặt: thiếu ca này thì vế «không ép bộ dựng nào» là vế chết.
  ['m-tiem-phu-thuoc', s => s.replace(DIVERGENCE, DIVERGENCE + '\n\nBắt buộc dùng canvas-preview cho mọi bề mặt.'),
    'kit bi ep phu thuoc bo dung: canvas-preview'],
]);

runCase('DP8', 'khuon so phien giu ba khoa moi, khong liet lai danh sach nac', checkNoteKeys, [
  ['m-reaction', s => { const b = block(s, NOTE_TPL);
    return s.replace(b, b.split('\n').filter(l => !l.startsWith('reaction:')).join('\n')); },
    'khuon so phien thieu khoa: reaction:'],
  ['m-options', s => { const b = block(s, NOTE_TPL);
    return s.replace(b, b.split('\n').filter(l => !l.startsWith('options:')).join('\n')); },
    'khuon so phien thieu khoa: options:'],
  ['m-divergence', s => { const b = block(s, NOTE_TPL);
    return s.replace(b, b.split('\n').filter(l => !l.startsWith('divergence:')).join('\n')); },
    'khuon so phien thieu khoa: divergence:'],
]);

// DP9 · AC-9 — khớp vòng: mỗi nấc trong thang → thẻ hiện đúng NHÃN của nấc đó
if (want('DP9')) {
  const errs = [];
  const labels = ladderLabels(src);
  if (Object.keys(labels).length !== 4) errs.push(`rut duoc ${Object.keys(labels).length} nhan tu thang, mong doi 4`);
  for (const [id, label] of Object.entries(labels)) {
    const r = render(mkWs(noteFromTemplate(src, { reaction: id })));
    if (r.status !== 0) { errs.push(`the khong dung duoc cho ${id}: exit ${r.status} — ${r.err.slice(0, 120)}`); continue; }
    if (!r.out.includes(label)) errs.push(`the khong render nhan "${label}" cho ${id}`);
  }
  // khoá options có giá trị → thẻ nói có bộ phương án; trống → không nói
  const withOpt = render(mkWs(noteFromTemplate(src, { options: 'docs/phuong-an/fx.html' })));
  if (!/bộ phương án/i.test(withOpt.out)) errs.push('the khong hien duong bo phuong an khi khoa options co gia tri');
  const noOpt = render(mkWs(noteFromTemplate(src, { options: '' })));
  if (/bộ phương án/i.test(noOpt.out)) errs.push('the hien bo phuong an trong khi khoa options de trong');
  // MA TRẬN 2 MUTANT — bẻ ở ĐẦU VIẾT (khuôn), đọc bằng ĐẦU ĐỌC thật
  const m1 = render(mkWs(noteFromTemplate(src, { reaction: 'nac-2', drop: 'reaction:' })));
  if (m1.out.includes(labels['nac-2'])) errs.push(`m1: bo khoa reaction khoi khuon ma the van khoe nhan "${labels['nac-2']}"`);
  const m2 = render(mkWs(noteFromTemplate(src, { options: 'docs/x.html', drop: 'options:' })));
  if (/bộ phương án/i.test(m2.out)) errs.push('m2: bo khoa options khoi khuon ma the van hien duong bo phuong an');
  if (errs.length) fail('DP9', errs.join(' · '));
  else pass('DP9', 'khop vong 4 nac khuon->the + 2 mutant do dung ve');
}

// DP10 · AC-10 — ba nhánh đọc-cũ, đối chứng dương chạy TRƯỚC
if (want('DP10')) {
  const errs = [];
  const CO_VANG_THIEU = 'chưa khai nấc phản ứng';
  const a = render(mkWs(noteFromTemplate(src, { reaction: 'nac-1' })));
  if (a.out.includes(CO_VANG_THIEU)) errs.push('(a) ho so du khoa van bi co vang nac — doi chung duong hong');
  const b2 = render(mkWs(noteFromTemplate(src, { drop: 'reaction:' })));
  if (!b2.out.includes(CO_VANG_THIEU)) errs.push(`(b) thieu khoa reaction ma khong co co vang "${CO_VANG_THIEU}"`);
  if (b2.status !== 0) errs.push('(b) duong doc-cu KHONG duoc chan: the phai dung duoc');
  const c = render(mkWs(noteFromTemplate(src, { reaction: 'nac-9' })));
  if (!c.out.includes('nac-9')) errs.push('(c) gia tri la ma co vang khong NEU TEN "nac-9"');
  if (c.status !== 0) errs.push('(c) gia tri la KHONG duoc chan the');
  if (errs.length) fail('DP10', errs.join(' · '));
  else pass('DP10', 'ba nhanh doc-cu: du khoa sach co · thieu khoa neu doi truoc · gia tri la neu ten');
}

// DP13 · AC-15 — hồ sơ KHÔNG có sổ phiên: thẻ vẫn phải dựng được
if (want('DP13')) {
  const errs = [];
  const KHOI = 'Bản mẫu';
  const none = render(mkWs(null));
  if (none.status !== 0) errs.push(`the phai dung duoc khi khong co so phien: exit ${none.status} — ${none.err.slice(0, 160)}`);
  if (none.out.includes(KHOI)) errs.push(`khoi "${KHOI}" hien tren ho so khong co so phien`);
  for (const bad of ['undefined', 'null', '(chưa khai)']) {
    if (none.out.includes(bad)) errs.push(`nhan la lot ra tren ho so khong co so phien: ${bad}`);
  }
  // đối chứng: CÓ sổ phiên thì khối phải hiện — chứng minh phép khẳng định trên biết phân biệt
  const withNote = render(mkWs(noteFromTemplate(src)));
  if (!withNote.out.includes(KHOI)) errs.push(`doi chung hong: co so phien ma khoi "${KHOI}" khong hien`);
  // MA TRẬN 2 MUTANT trên bản sao TRỌN scripts/+lib/
  const m1 = render(mkWs(null), s => s.replace('if (dp.present) P.push(', 'if (true) P.push('));
  if (!m1.out.includes(KHOI)) errs.push('m1: bo dieu kien co-so-phien ma the van khong in khoi — ca khong phan biet duoc');
  const m2 = render(mkWs(null), s => s.replace("const dpText = read(path.join(dir, 'design-pass.md'));", "const dpText = null.x;"));
  if (m2.status === 0) errs.push('m2: bo dung the nem loi ma van exit 0 — ca khong bat duoc the chet');
  if (errs.length) fail('DP13', errs.join(' · '));
  else pass('DP13', 'khong so phien: the dung duoc, khoi vang, khong nhan la + 2 mutant');
}

// DP_CASES nêu id không tồn tại → không được xanh im lặng (xanh-không-chạy)
const unknown = only.filter(id => !ran.has(id));
if (unknown.length) { console.log(`FAIL: [DP_CASES] không khớp ca nào: ${unknown.join(',')}`); failures++; }
if (failures) { console.log(`design-pass-nac: ${failures} ca đỏ`); process.exit(1); }
