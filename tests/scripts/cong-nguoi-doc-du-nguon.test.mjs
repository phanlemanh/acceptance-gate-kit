// CN — cổng người đọc đủ nguồn (hồ sơ cong-nguoi-doc-du-nguon, 13/09/2026).
//
// Ca VĨNH VIỄN: suite scripts tự chạy mọi *.test.mjs qua glob, nên đây là lưới
// thường trực cho lớp «bên đọc hẹp hơn vật», không phải răng hồ sơ chết theo merge.
//
// Luật đo (chép từ đầu evals.yaml của hồ sơ, nguồn là đó):
//  - Fixture do CODE SINH trong chính lượt chạy. Không đọc hợp đồng thật của kho
//    làm fixture — hồ sơ đã ký là sử liệu. Hình dạng lấy từ hồ sơ thật thì CHÉP
//    CHUỖI vào tệp này, và chuỗi đó phải ghi rõ nguồn.
//  - Mỗi ca chạy HAI CHIỀU trên CÙNG fixture: đối chứng dương TRƯỚC (vật lành →
//    xanh), rồi hoàn nguyên đúng một đường trên BẢN SAO → phải ĐỎ với thông điệp
//    ghim. Bản sao .cjs/.mjs/.js phải qua `node --check`; mũi tiêm khớp đúng một lần.
//  - Mọi đường dẫn suy từ vị trí tệp này.
//  - Mỗi ca in ĐÚNG MỘT dòng kết quả `PASS: CNxx …` / `FAIL: CNxx … (DO: …)`;
//    chi tiết in bằng tiền tố `    · `. Bộ chọn CNDN_CASES khớp 0 ca → exit 1.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const SELF = fileURLToPath(import.meta.url);
const HERE = path.dirname(SELF);
const ROOT = path.resolve(HERE, '..', '..');
const req = createRequire(import.meta.url);

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'cndn-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
let seq = 0;
const mk = (p) => { const d = path.join(TMP, `${p}${++seq}`); fs.mkdirSync(d, { recursive: true }); return d; };

const CASES = {};
const fails = [];
const def = (id, fn) => { CASES[id] = fn; };
const say = (id, ok, why, chi) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${id}${ok ? '' : ` (DO: ${why})`}`);
  for (const c of chi || []) console.log(`    · ${c}`);
  if (!ok) fails.push(id);
};

// ── khuôn mục, rút từ bên VIẾT ────────────────────────────────────────────
// acceptance-verify.js dạy bước soạn báo cáo viết mục theo khuôn này. Rút bằng
// marker chứ không chép tay: chép tay là dựng lại đúng lớp lỗi bên-đọc-trôi-khỏi-
// bên-viết mà vòng này đi đóng.
function rutKhuon() {
  const wf = fs.readFileSync(path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8');
  const m = wf.match(/<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)\\nOOC-ITEM-TEMPLATE>>>/);
  if (!m) return null;
  return m[1].replace(/\\n/g, '\n').replace(/\\`/g, '`');
}
const mucTu = (khuon, ten, i) => khuon
  .replace('{title}', `${ten}-${i}`)
  .replace('{plain}', `người dùng thấy ${ten}-${i}`)
  .replace('{file}', `src/${ten}${i}.ts`)
  .replace('{severity}', 'medium')
  .replace('{proposal}', 'known-limits');

// ══ CN14 — khuôn mục rút từ bên VIẾT, đọc bằng bên ĐỌC ═════════════════════
def('CN14', () => {
  const chi = [];
  const khuon = rutKhuon();
  if (!khuon) return say('CN14', false, 'KHONG rut duoc OOC-ITEM-TEMPLATE tu writer', chi);
  if (!/\{title\}/.test(khuon)) return say('CN14', false, 'khuon rut ra khong co {title} — marker da troi', chi);
  chi.push(`khuôn rút từ writer, dòng đầu: ${khuon.split('\n')[0]}`);

  const rf = [
    '## Trong hợp đồng', '',
    mucTu(khuon, 'trong', 1), mucTu(khuon, 'trong', 2), '',
    '## Ngoài hợp đồng — người quyết ở Gate 2', '',
    mucTu(khuon, 'ngoai', 1), mucTu(khuon, 'ngoai', 2), mucTu(khuon, 'ngoai', 3), '',
  ].join('\n');

  const ooc = req(path.join(ROOT, 'lib', 'out-of-contract.cjs'));
  const r = ooc.parse(rf);
  const soNgoai = (r.findings || []).length;
  const soTrong = (r.inContract || []).length;
  chi.push(`bên đọc thấy ngoài=${soNgoai} trong=${soTrong}`);
  if (soNgoai !== 3) return say('CN14', false, `ngoai=${soNgoai}, cho 3`, chi);
  if (soTrong !== 2) return say('CN14', false, `trong=${soTrong}, cho 2`, chi);

  // Hai mục phải bóc ra CÙNG hình dạng phần tử — chúng dùng chung một khuôn bên
  // viết, nên bên đọc mà trả hai hình dạng khác nhau là đã có bản bóc thứ hai.
  const truong = o => Object.keys(o).sort().join(',');
  const hdNgoai = truong(r.findings[0]);
  const hdTrong = truong(r.inContract[0]);
  chi.push(`hình dạng phần tử: ngoài=[${hdNgoai}] trong=[${hdTrong}]`);
  if (hdNgoai !== hdTrong) return say('CN14', false, 'hai muc boc ra HAI hinh dang — co ban boc thu hai', chi);
  if (r.inContract[0].title !== 'trong-1' || r.inContract[0].plain !== 'người dùng thấy trong-1') {
    return say('CN14', false, `noi dung muc Trong sai: ${JSON.stringify(r.inContract[0])}`, chi);
  }

  // CHIỀU ĐỎ: khuôn bên VIẾT đổi mà bên đọc vẫn ra số cũ nghĩa là nó không thật
  // sự theo bên viết — nó đang khớp một khuôn chép tay nằm đâu đó trong chính nó.
  const khuonKhac = khuon.replace('- **{title}**', '### {title}');
  if (khuonKhac === khuon) return say('CN14', false, 'khong tiem duoc khuon khac — dong dau khuon da doi', chi);
  const rfKhac = ['## Ngoài hợp đồng', '',
    mucTu(khuonKhac, 'ngoai', 1), mucTu(khuonKhac, 'ngoai', 2), mucTu(khuonKhac, 'ngoai', 3), ''].join('\n');
  const nKhac = (ooc.parse(rfKhac).findings || []).length;
  chi.push(`chiều đỏ: khuôn đổi → bên đọc ra ${nKhac} (phải khác 3)`);
  if (nKhac === 3) return say('CN14', false, 'ben doc khong theo ben viet — doi khuon van ra 3', chi);

  say('CN14', true, '', chi);
});

// ── dựng văn bản fixture, dùng lại ở nhiều ca ─────────────────────────────
// Khuôn mục lấy từ bên VIẾT ở CN14; ở đây dựng thẳng cho gọn vì các ca dưới đo
// VỊ TỪ chứ không đo quan hệ viết-đọc (quan hệ đó là việc của CN14).
const mucPhang = (n, i) => `- **${n}-${i}**\n  Người dùng thấy gì: ${n}-${i}\n  file: \`src/${n}${i}.ts\`\n  severity: medium\n  Đề xuất: known-limits`;
const rfText = (ngoai, trong) => {
  const out = [];
  if (trong > 0) { out.push('## Trong hợp đồng', ''); for (let i = 1; i <= trong; i++) out.push(mucPhang('trong', i)); out.push(''); }
  out.push('## Ngoài hợp đồng — người quyết ở Gate 2', '');
  for (let i = 1; i <= ngoai; i++) out.push(mucPhang('ngoai', i));
  return out.join('\n') + '\n';
};
// Dòng sổ ĐỊNH ĐOẠT phải NHẮC NHÃN «Ngoài-n»/«Trong-n» — thẻ đánh số mục bằng
// nhãn đó và người trả lời theo nhãn. Đếm mọi dòng `stage: gate2` là sai NGƯỢC
// chiều an toàn (lượt chấm 1): 621 dòng như thế trên 22 kho, 12 loại type, phần
// lớn không định đoạt mục nào — một hồ sơ 1 mục treo + 1 dòng veto sẽ ra n = 0.
const soText = (soGate2, soKhac = 0) => {
  const ln = [];
  for (let i = 0; i < soGate2; i++) ln.push(JSON.stringify({ id: `d-x-${i}`, type: 'descope', stage: 'gate2', at: '2026-09-13T00:00:00Z', decision: `Ngoài-${i + 1}: ghi Known limits`, impact: 'y' }));
  for (let i = 0; i < soKhac; i++) ln.push(JSON.stringify({ id: `d-y-${i}`, type: 'fix', stage: 'S4-r1', at: '2026-09-13T00:00:00Z', decision: 'x', impact: 'y' }));
  return ln.join('\n') + (ln.length ? '\n' : '');
};
const baoCao = (findingsOpen) => [
  '---', 'schema_version: 1', 'verdict: PASS',
  ...(findingsOpen == null ? [] : [`findings_open: ${findingsOpen}`]),
  '---', '', '## Known limits', '', '## Ngoài hợp đồng', '',
].join('\n');








// ── ba hình dạng NGUYÊN VĂN từ hợp đồng thật ──────────────────────────────
// Chép CHUỖI vào đây, KHÔNG đọc tệp thật lúc chạy: hồ sơ đã ký là sử liệu, và
// một ca đọc chúng sẽ đổi màu khi kho đổi, tức đo kho chứ không đo bộ bóc.
const THAT_CRM = '### AC-1 — Ở kho này, job không chạy — đo bằng số GitHub trả về';   // crm/auto-pr-thoi-do-o-ban-re
const THAT_AP  = '### AC-2 — Google Contacts một-cú-bấm';                             // artifact-platform/customer-segment-foundation
const THAT_KIT = '### AC-1 (bộ giải) — bóc nháy chỉ khi nháy CÂN và đúng một cặp vỏ'; // kit/release-2-11-0

const hopDong = (than, muc = 'Criteria') => ['---', 'schema_version: 1', 'slug: x', '---', '', `## ${muc}`, '', than, '', '## Out of scope', '', '- x', ''].join('\n');

// ══ CN07 — ma trận 12 hình dạng khai báo ══════════════════════════════════
def('CN07', () => {
  const chi = [];
  const lib = req(path.join(ROOT, 'lib', 'ac-line.cjs'));
  if (typeof lib.parseACBlock !== 'function') return say('CN07', false, 'lib.parseACBlock chua ton tai', chi);
  // [tên ô, thân, id mong đợi, chữ phải có trong gwt của id đó, judgment, crossLayer]
  const O = [
    ['tiêu đề · thân nhiều dòng', '### AC-1 — nhãn một\n\nGiven a\n\nWhen b\n\nThen c', 'AC-1', 'When b', false, false],
    ['tiêu đề · thân một dòng', '### AC-2 — nhãn hai\nGiven a, When b, Then c', 'AC-2', 'Then c', false, false],
    ['tiêu đề · (judgment) ở nhãn', '### AC-3 (judgment) — cần mắt người\nGiven a, When b, Then c', 'AC-3', 'cần mắt người', true, false],
    ['tiêu đề · (cross-layer) ở nhãn', '### AC-4 (cross-layer) — xuyên lớp\nGiven a, When b, Then c', 'AC-4', 'xuyên lớp', false, true],
    ['tiêu đề · tag ở THÂN', '### AC-5 — nhãn năm\nGiven a, When b, Then c (cross-layer)', 'AC-5', 'Then c', false, true],
    ['tiêu đề · tag trong code span KHÔNG tính', '### AC-6 — nhãn sáu\nGiven hồ sơ giải thích `(cross-layer)` cho người mới, When b, Then c', 'AC-6', 'người mới', false, false],
    ['tiêu đề có dấu đậm', '### **AC-8** — nhãn tám\nGiven a, When b, Then c', 'AC-8', 'nhãn tám', false, false],
    ['tiêu đề kế CẮT thân', '### AC-9 — nhãn chín\nGiven a\n### AC-10 — nhãn mười\nGiven b, When c, Then d', 'AC-9', 'nhãn chín', false, false],
    ['gạch đầu dòng LẪN tiêu đề', '- AC-11: Given a, When b, Then c\n\n### AC-12 — nhãn mười hai\nGiven d, When e, Then f', 'AC-11', 'When b', false, false],
    ['ca thật crm', THAT_CRM + '\nGiven commit đã đẩy, When chạy lệnh, Then số trả về là 0', 'AC-1', 'job không chạy', false, false],
    ['ca thật ap', THAT_AP + '\nGiven tenant đã nối, When bấm nhập, Then danh bạ kéo về', 'AC-2', 'một-cú-bấm', false, false],
  ];
  const boc = (than) => {
    const m = new Map();
    for (const a of lib.parseACBlock(hopDong(than))) if (!m.has(a.id)) m.set(a.id, a);
    return m;
  };
  const lech = [];
  for (const [ten, than, id, chu, jg, xl] of O) {
    const m = boc(than);
    const a = m.get(id);
    if (!a) { lech.push(`${ten}: KHÔNG ra ${id}`); continue; }
    if (!a.gwt.includes(chu)) lech.push(`${ten}: gwt thiếu "${chu}" (gwt="${a.gwt.slice(0, 60)}")`);
    if (a.judgment !== jg) lech.push(`${ten}: judgment=${a.judgment} cho ${jg}`);
    if (a.crossLayer !== xl) lech.push(`${ten}: crossLayer=${a.crossLayer} cho ${xl}`);
  }
  // Trộn hai cách khai theo CẢ HAI THỨ TỰ. Ô cũ chỉ có «gạch trước, tiêu đề sau»
  // nên lượt chấm 3 bắt được chiều ngược: gạch đầu dòng đứng SAU một tiêu đề bị
  // nuốt vào thân của tiêu chí phía trên, mất hẳn khỏi mọi bề mặt.
  for (const [ten, than, mong] of [
    ['tiêu đề → gạch → tiêu đề', '### AC-1 — một\nGiven a, When b, Then c\n\n- AC-2: Given d, When e, Then f\n\n### AC-3 — ba\nGiven g, When h, Then i', 'AC-1,AC-2,AC-3'],
    ['gạch → tiêu đề', '- AC-1: Given a, When b, Then c\n\n### AC-2 — hai\nGiven d, When e, Then f', 'AC-1,AC-2'],
  ]) {
    const ra = lib.parseACBlock(hopDong(than)).map(a => a.id).join(',');
    chi.push(`${ten} → ${ra}`);
    if (ra !== mong) return say('CN07', false, `tron khuon «${ten}» ra "${ra}", cho "${mong}"`, chi);
  }

  // Ô HỒI QUY (lượt chấm 4): mục Criteria viết bằng BẢNG phải KHÔNG kéo bộ bóc
  // sang nhánh quét-cả-tệp. Bản nới điều kiện lùi làm thẻ hiện AC-4/AC-9 lấy từ
  // mục «Known limits» — tiêu chí MA, và bộ dò im. Đây là bất biến của acBlindSpot
  // («whole-file only when section() came back empty»), nay có răng.
  const bangMa = ['---', 'x: 1', '---', '', '## Criteria', '', 'Các tiêu chí ở bảng dưới.', '',
    '| id | mô tả |', '|---|---|', '| AC-1 | x |', '', '## Known limits', '',
    '- AC-4: giới hạn đã biết, KHÔNG phải tiêu chí.', '- AC-9: cũng vậy.', ''].join('\n');
  const raMa = lib.parseACBlock(bangMa).map(a => a.id);
  chi.push(`mục Criteria dạng BẢNG → bóc ra [${raMa.join(',')}] (phải rỗng)`);
  if (raMa.length) return say('CN07', false, `tieu chi MA len the: ${raMa.join(',')}`, chi);

  // Ô cấp h2 — dựng ĐÚNG hình dạng đời thật: `## AC-n` là cấu trúc TOP-LEVEL,
  // KHÔNG có mục bao ngoài (media-library/embed-on-approve và 17 hồ sơ khác).
  const h2Doi = ['---', 'schema_version: 1', '---', '', '# Contract — x', '',
    '## AC-7 (nhãn bảy)', 'Given a, When b, Then c', '', '## Known limits', '', '- x', ''].join('\n');
  const mH2 = new Map(lib.parseACBlock(h2Doi).map(a => [a.id, a]));
  if (!mH2.has('AC-7') || !mH2.get('AC-7').gwt.includes('nhãn bảy')) {
    return say('CN07', false, `cap h2 doi that: ${[...mH2.keys()].join(',') || 'khong ra id nao'}`, chi);
  }
  // GỠ ô «mục Criteria có chữ dẫn mà tiêu chí nằm ngoài» (lượt chấm 4). Ô đó do
  // tôi tự nghĩ ra: đo trên 1243 hợp đồng thật, KHÔNG hồ sơ nào ở hình dạng ấy —
  // hợp đồng dạng h2 đều KHÔNG có mục bao ngoài. Để đỡ nó, tôi nới điều kiện lùi
  // và đẻ ra hồi quy «tiêu chí MA» mà ô ngay trên đang canh. Thước cho một hình
  // dạng không tồn tại là thước phải trả giá bằng một lỗ thật.

  // Hai ô còn lại của ma trận: tham chiếu chéo trong thân, và tiêu chí thân RỖNG.
  const mTc = boc('### AC-13 — nhãn\nGiven a, When b, Then c. Xem thêm **AC-5, AC-9** ở Notes.');
  if (mTc.size !== 1 || !mTc.has('AC-13')) lech.push(`tham chiếu chéo sinh id lạ: ${[...mTc.keys()].join(',')}`);
  const mRong = boc('### AC-14\n\n### AC-15 — có chữ\nGiven a, When b, Then c');
  if (mRong.has('AC-14')) lech.push('tiêu chí thân RỖNG vẫn được tính');
  if (!mRong.has('AC-15')) lech.push('tiêu chí sau tiêu chí rỗng bị mất');
  chi.push(`ma trận 14 ô: ${lech.length ? lech.length + ' lệch' : 'đủ'}`);
  for (const l of lech.slice(0, 4)) chi.push(`  ${l}`);
  if (lech.length) return say('CN07', false, `ma tran lech ${lech.length} o`, chi);
  // Ca thật thứ ba mang nhãn trong ngoặc — ghim riêng vì nó là hình dạng của kit.
  const mKit = boc(THAT_KIT + '\nGiven giá trị scalar, When giải khoá, Then bóc đúng một cặp vỏ');
  const aKit = mKit.get('AC-1');
  if (!aKit || !aKit.gwt.includes('bóc nháy chỉ khi')) return say('CN07', false, 'ca that kit: nhan trong ngoac roi mat chu', chi);
  chi.push('ba ca nguyên văn từ hợp đồng thật: đạt');
  say('CN07', true, '', chi);
});

// ══ CN08 — bốn cách đặt tên mục tiêu chí ══════════════════════════════════
def('CN08', () => {
  const chi = [];
  const lib = req(path.join(ROOT, 'lib', 'ac-line.cjs'));
  if (typeof lib.parseACBlock !== 'function') return say('CN08', false, 'lib.parseACBlock chua ton tai', chi);
  const than = '### AC-1 — nhãn một\nGiven a, When b, Then c\n\n### AC-2 — nhãn hai\nGiven d, When e, Then f';
  const dau = (ls) => ls.map(a => `${a.id}|${a.gwt}`).join('\n');
  // Đối chứng dương TRƯỚC: mục tên chuẩn.
  const chuan = dau(lib.parseACBlock(hopDong(than, 'Criteria')));
  chi.push(`## Criteria → ${chuan.split('\n').length} tiêu chí`);
  if (!/AC-1\|/.test(chuan) || !/AC-2\|/.test(chuan)) return say('CN08', false, 'doi chung duong: muc chuan khong ra du id', chi);
  for (const muc of ['Acceptance Criteria', 'Acceptance criteria']) {
    const r = dau(lib.parseACBlock(hopDong(than, muc)));
    chi.push(`## ${muc} → ${r === chuan ? 'BẰNG chuẩn' : 'LỆCH'}`);
    if (r !== chuan) return say('CN08', false, `tieu de muc chua nhan het: "${muc}"`, chi);
  }
  // Ô thứ tư: KHÔNG mục nào → quét cả tệp, vẫn ra đủ id.
  const khongMuc = ['---', 'schema_version: 1', '---', '', than, ''].join('\n');
  const r4 = lib.parseACBlock(khongMuc).map(a => a.id).join(',');
  chi.push(`không mục nào → ${r4}`);
  if (r4 !== 'AC-1,AC-2') return say('CN08', false, `khong muc nao ma ra "${r4}"`, chi);
  say('CN08', true, '', chi);
});

// ══ CN09 — bộ dò điểm mù KHÔNG im trước dạng tiêu đề ══════════════════════
def('CN09', () => {
  const chi = [];
  const lib = req(path.join(ROOT, 'lib', 'ac-line.cjs'));
  if (typeof lib.parseACBlock !== 'function') return say('CN09', false, 'lib.parseACBlock chua ton tai', chi);
  const than = [1, 2, 3, 4, 5, 6].map(i => `### AC-${i} — nhãn ${i}\nGiven a, When b, Then c`).join('\n\n');
  const t = hopDong(than);
  // Đối chứng dương TRƯỚC, và đây là vế chống kêu-oan: hợp đồng LÀNH → im.
  const ids = lib.parseACBlock(t).map(a => a.id);
  chi.push(`hợp đồng lành: bóc ${ids.length} tiêu chí`);
  if (ids.length !== 6) return say('CN09', false, `boc ${ids.length} thay vi 6`, chi);
  const lanh = lib.acBlindSpot(t, ids);
  chi.push(`hợp đồng lành → ${lanh === null ? 'IM (đúng)' : 'KÊU OAN: ' + JSON.stringify(lanh)}`);
  if (lanh !== null) return say('CN09', false, 'bo do keu oan tren hop dong lanh', chi);
  // Ô bỏ sót 2/6 → kind short, nêu số 2 và liệt dòng.
  const short = lib.acBlindSpot(t, ids.slice(0, 4));
  chi.push(`bỏ sót 2/6 → ${short ? short.kind : 'null'}`);
  if (!short || short.kind !== 'short') return say('CN09', false, 'bo do van im truoc dang tieu de (short)', chi);
  const vanShort = lib.blindSpotText(short);
  if (!/\b2\b/.test(vanShort) || !short.lines.length) return say('CN09', false, 'van ban khong neu so bo sot hoac khong liet dong', chi);
  // Ô bỏ sót 6/6 → kind blank.
  const blank = lib.acBlindSpot(t, []);
  chi.push(`bỏ sót 6/6 → ${blank ? blank.kind : 'null'}`);
  if (!blank || blank.kind !== 'blank') return say('CN09', false, 'bo do van im truoc dang tieu de (blank)', chi);
  say('CN09', true, '', chi);
});

// ══ CN13 — bốn bên đọc cùng thấy MỘT số ═══════════════════════════════════
// Đo QUAN HỆ: bốn bề mặt chấm cùng một hợp đồng phải ra cùng tập id. Mũi tiêm
// hoàn nguyên ĐÚNG MỘT bên về khuôn hẹp → đúng bên đó lệch, ba bên kia không.
def('CN13', () => {
  const chi = [];
  const cp = req('node:child_process');
  const than = [1, 2, 3, 4, 5].map(i => `### AC-${i} — nhãn ${i}\nGiven a, When b, Then c`).join('\n\n');
  const hd = ['---', 'schema_version: 1', 'feature: x', 'slug: x', 'risk_tier: T2', 'surfaces: [cli]',
    'status: draft', 'approved_by:', 'approved_at:', '---', '', '## Criteria', '', than, '',
    '## Coverage', '', '- trục: một', '', '## Out of scope', '', '- x', ''].join('\n');
  const ev = ['evals:', ...[1, 2, 3, 4, 5].flatMap(i => [
    `  - id: E${i}`, `    criterion: AC-${i}`, '    executor: script',
    '    cmd: config:executors.script.x', '    expected: x'])].join('\n');

  const dungKho = (root) => {
    const d = path.join(root, '_acceptance', 'x');
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(root, '_acceptance', 'config.yaml'), 'schema_version: 1\n');
    fs.writeFileSync(path.join(d, 'contract.md'), hd);
    fs.writeFileSync(path.join(d, 'evals.yaml'), ev);
    return d;
  };
  // Bốn bên đọc, mỗi bên trả một CON SỐ tiêu chí đọc được.
  const doBon = (agRoot) => {
    const R = mk('cn13-kho-');
    const d = dungKho(R);
    // Bên (1) — bộ bóc: nạp qua tiến trình CON, không require trong tiến trình này.
    // createRequire cache theo đường dẫn, mà bản tiêm nằm ở đường dẫn KHÁC nên
    // không đụng cache; nhưng chạy con vẫn đúng hơn vì nó đo đúng thứ ba bên kia
    // đang chạy — cùng một Node, cùng một lần nạp.
    const rLib = cp.spawnSync(process.execPath, ['-e',
      'const{parseACBlock}=require(process.argv[1]);const fs=require("fs");process.stdout.write(String(parseACBlock(fs.readFileSync(process.argv[2],"utf8")).length))',
      path.join(agRoot, 'lib', 'ac-line.cjs'), path.join(d, 'contract.md')], { encoding: 'utf8' });
    const soLib = /^\d+$/.test(String(rLib.stdout || '').trim()) ? Number(rLib.stdout) : -1;
    if (soLib < 0) chi.push(`  bộ bóc lỗi: ${String(rLib.stderr || '').trim().split('\n')[0].slice(0, 120)}`);
    const the = cp.spawnSync(process.execPath, [path.join(agRoot, 'scripts', 'gate-card.js'), '--slug', 'x', '--root', R, '--extract'], { encoding: 'utf8' });
    let soThe = -1;
    try { const j = JSON.parse(the.stdout); soThe = (j.will_do || []).length + (j.wont_do || []).length + (j.judgment || []).length; } catch (_) { /* giữ -1 */ }
    const lint = cp.spawnSync(process.execPath, [path.join(agRoot, 'scripts', 'eval-coverage-lint.js'), '--files', path.join(R, '_acceptance', 'x', 'contract.md'), path.join(R, '_acceptance', 'x', 'evals.yaml')], { encoding: 'utf8' });
    // lint không in số tiêu chí; dùng W7 (bộ dò điểm mù) làm đại lượng. Khớp DÒNG
    // CẢNH BÁO `  [nhãn] W7 …`, KHÔNG khớp dòng chú giải cuối output — dòng đó
    // LUÔN in và giải thích cả W1..W8, nên `/W7 /` trần cho kết quả hằng-đúng.
    const lintThieu = /^\s*\[[^\]]*\]\s*W7 /m.test(lint.stdout || '');
    // Báo cáo phải mang BẢNG per-eval: trang bằng chứng chỉ dùng chữ của tiêu chí
    // để chú cho từng dòng eval, nên không có bảng thì nó không đọc tiêu chí nào
    // và phép đo hoá hằng-đúng (đo được ở chính lượt dựng ca này).
    fs.writeFileSync(path.join(R, '_acceptance', 'x', 'evidence-report.md'),
      ['---', 'schema_version: 1', 'feature_slug: x', 'verdict: PASS', 'human_signoff: Ng 2026-09-13', '---', '',
        '| Eval | Criterion | Executor | Verdict |', '|---|---|---|---|',
        ...[1, 2, 3, 4, 5].map(i => `| E${i} | AC-${i} | script | PASS |`), '',
        '## Evidence', '', '- E1 exit 0', '', '## Known limits', '', '## Ngoài hợp đồng', ''].join('\n'));
    // evidence-page GHI RA TỆP rồi in đường dẫn — đọc TỆP, không đọc stdout.
    const trang = cp.spawnSync(process.execPath, [path.join(agRoot, 'scripts', 'evidence-page.js'), '--slug', 'x', '--root', R], { encoding: 'utf8' });
    let soTrang = -1;
    try {
      const html = fs.readFileSync(String(trang.stdout || '').trim(), 'utf8');
      // Đếm CHỮ của tiêu chí, không đếm MÃ: mã AC-n cũng nằm trong bảng per-eval
      // của chính báo cáo, nên đếm mã cho kết quả hằng-đúng dù trang không đọc
      // được hợp đồng (đo được ở chính lượt dựng ca này).
      soTrang = (html.match(/nhãn \d+/g) || []).filter((v, i, a) => a.indexOf(v) === i).length;
    } catch (_) { /* giữ -1 */ }
    return { soLib, soThe, lintThieu, soTrang, theMa: the.status, trangMa: trang.status };
  };

  // Đối chứng dương TRƯỚC: cây đang đo — cả bốn bên thấy 5.
  const duong = doBon(ROOT);
  chi.push(`cây đang đo: lib=${duong.soLib} thẻ=${duong.soThe} trang=${duong.soTrang} lint-thiếu=${duong.lintThieu}`);
  if (duong.soLib !== 5) return say('CN13', false, `bo boc ra ${duong.soLib}, cho 5`, chi);
  if (duong.soThe !== 5) return say('CN13', false, `the ra ${duong.soThe}, cho 5 (ma thoat ${duong.theMa})`, chi);
  if (duong.soTrang !== 5) return say('CN13', false, `trang bang chung ra ${duong.soTrang}, cho 5 (ma thoat ${duong.trangMa})`, chi);
  if (duong.lintThieu) return say('CN13', false, 'lint bao doc thieu tren hop dong lanh', chi);

  // CHIỀU ĐỎ: bản sao cây, hoàn nguyên parseACBlock về «chỉ gạch đầu dòng».
  const ban = mk('cn13-tiem-');
  fs.cpSync(path.join(ROOT, 'lib'), path.join(ban, 'lib'), { recursive: true });
  fs.cpSync(path.join(ROOT, 'scripts'), path.join(ban, 'scripts'), { recursive: true });
  const f = path.join(ban, 'lib', 'ac-line.cjs');
  const src = fs.readFileSync(f, 'utf8');
  const moc = '    const h = l.match(AC_HEAD);';
  if (src.split(moc).length !== 2) return say('CN13', false, 'mui tiem khong khop dung mot lan', chi);
  fs.writeFileSync(f, src.replace(moc, '    const h = null;'));
  const kt = cp.spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' });
  if (kt.status !== 0) return say('CN13', false, 'ban tiem khong qua node --check', chi);
  const do_ = doBon(ban);
  chi.push(`bản tiêm: lib=${do_.soLib} thẻ=${do_.soThe} trang=${do_.soTrang} lint-thiếu=${do_.lintThieu}`);
  const lech = [];
  if (do_.soLib === 5) lech.push('lib');
  if (do_.soThe === 5) lech.push('thẻ');
  if (do_.soTrang === 5) lech.push('trang bằng chứng');
  if (!do_.lintThieu) lech.push('lint (W7 không kêu)');
  if (lech.length) return say('CN13', false, `ben KHONG theo bo boc chung: ${lech.join(', ')}`, chi);
  chi.push('cả bốn bên đổi theo mũi tiêm — chúng cùng một nguồn');
  say('CN13', true, '', chi);
});


// ── thẻ: dựng kho rồi rút HTML ────────────────────────────────────────────
// gate: '2' (mặc định, hồ sơ verified) hoặc '1' (hồ sơ draft — khối Độ phủ AC và
// khoá coverage_missing CHỈ có ở thẻ Cổng Phạm vi).
function theCong2({ trong = 0, ngoai = 0, coverage = 'bullet', gate = '2' } = {}) {
  const cp = req('node:child_process');
  const R = mk('cn-the-');
  const d = path.join(R, '_acceptance', 'x');
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(R, '_acceptance', 'config.yaml'), 'schema_version: 1\n');
  const cov = coverage === 'khong' ? []
    : coverage === 'bang' ? ['## Coverage', '', '| Trục | Giá trị |', '|---|---|', '| hình dạng | gạch · bảng |', '| tên mục | Criteria |', '']
    : coverage === 'vanxuoi' ? ['## Coverage', '', 'Quét bằng khuôn ba trục, không gian Core 24 ô.', '']
    : ['## Coverage', '', '- trục hình dạng: gạch · bảng', ''];
  fs.writeFileSync(path.join(d, 'contract.md'), ['---', 'schema_version: 1', 'feature: x', 'slug: x',
    'risk_tier: T2', 'surfaces: [cli]',
    ...(gate === '1' ? ['status: draft', 'approved_by:', 'approved_at:'] : ['status: verified', 'approved_by: Ng', 'approved_at: 2026-09-13']),
    '---', '',
    '## Criteria', '', '- AC-1: Given a, When b, Then c', '', ...cov, '## Out of scope', '', '- x', ''].join('\n'));
  fs.writeFileSync(path.join(d, 'evals.yaml'), 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.x\n    expected: x\n');
  const muc = (n, i) => `- **${n}-${i}**\n  Người dùng thấy gì: người dùng thấy ${n}-${i}\n  file: \`src/${n}${i}.ts\`\n  severity: high\n  Đề xuất: known-limits`;
  fs.writeFileSync(path.join(d, 'review-findings.md'), [
    '## Trong hợp đồng', '', ...Array.from({ length: trong }, (_, i) => muc('trong', i + 1)), '',
    '## Ngoài hợp đồng — người quyết ở Gate 2', '', ...Array.from({ length: ngoai }, (_, i) => muc('ngoai', i + 1)), '',
  ].join('\n'));
  fs.writeFileSync(path.join(d, 'evidence-report.md'), ['---', 'schema_version: 1', 'feature_slug: x',
    'verdict: PENDING-JUDGMENT', 'human_signoff:', `findings_open: ${trong + ngoai}`, '---', '',
    '## Evidence', '', '- E1 exit 0', '', '## Known limits', '', '## Ngoài hợp đồng', ''].join('\n'));
  const r = cp.spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'gate-card.js'), '--slug', 'x', '--root', R], { encoding: 'utf8' });
  const x = cp.spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'gate-card.js'), '--slug', 'x', '--root', R, '--extract'], { encoding: 'utf8' });
  let ex = {}; try { ex = JSON.parse(x.stdout); } catch (_) { /* giữ rỗng */ }
  return { html: r.stdout || '', ma: r.status, ex, root: R };
}

// ══ CN10 — thẻ Cổng Bằng chứng hiện lỗi TRONG hợp đồng chưa sửa ═══════════
def('CN10', () => {
  const chi = [];
  // Đối chứng dương TRƯỚC: mục Trong hợp đồng RỖNG → không khối nào, và thẻ nói
  // bằng chứng đầy đủ như hành vi hiện có.
  const duong = theCong2({ trong: 0, ngoai: 1 });
  chi.push(`0 mục trong hợp đồng: mã=${duong.ma}, có khối=${/Lỗi TRONG hợp đồng/.test(duong.html)}`);
  if (duong.ma !== 0) return say('CN10', false, `the chet, ma ${duong.ma}`, chi);
  if (/Lỗi TRONG hợp đồng/.test(duong.html)) return say('CN10', false, 'muc rong ma van hien khoi', chi);
  const noiDu = /Bằng chứng đầy đủ/.test(duong.html);
  chi.push(`0 mục: thẻ nói «Bằng chứng đầy đủ» = ${noiDu}`);

  // Ô thật: 2 mục trong hợp đồng chưa sửa.
  const r = theCong2({ trong: 2, ngoai: 1 });
  chi.push(`2 mục: có khối=${/Lỗi TRONG hợp đồng/.test(r.html)}`);
  if (!/Lỗi TRONG hợp đồng/.test(r.html)) return say('CN10', false, 'the giau loi trong hop dong', chi);
  if (!/Lỗi TRONG hợp đồng[^<]*\(2\)/.test(r.html)) return say('CN10', false, 'khoi khong neu dung so 2', chi);
  // Khối Trong hợp đồng phải đứng TRƯỚC khối Ngoài hợp đồng: nó nặng hơn.
  const iTrong = r.html.indexOf('Lỗi TRONG hợp đồng');
  const iNgoai = r.html.indexOf('Ngoài hợp đồng — bạn quyết');
  chi.push(`vị trí: Trong=${iTrong} Ngoài=${iNgoai}`);
  if (iNgoai >= 0 && iTrong > iNgoai) return say('CN10', false, 'khoi Trong dung SAU khoi Ngoai', chi);
  // Và thẻ thôi khẳng định bằng chứng đầy đủ khi còn mục như vậy.
  if (noiDu && /Bằng chứng đầy đủ/.test(r.html)) return say('CN10', false, 'con loi trong hop dong ma the van noi «Bang chung day du»', chi);
  say('CN10', true, '', chi);
});

// ══ CN15 — thẻ đọc được Coverage dạng BẢNG và văn xuôi ════════════════════
def('CN15', () => {
  const chi = [];
  // Đối chứng dương TRƯỚC: Coverage dạng gạch đầu dòng.
  const g = theCong2({ coverage: 'bullet', gate: '1' });
  chi.push(`gạch đầu dòng: coverage_missing=${g.ex.coverage_missing}`);
  if (g.ex.coverage_missing !== false) return say('CN15', false, 'doi chung duong: dang gach van bao thieu', chi);
  // Ô (1) BẢNG: phải KHÔNG báo thiếu, và khối phải mang chữ của một hàng bảng.
  const b = theCong2({ coverage: 'bang', gate: '1' });
  chi.push(`bảng: coverage_missing=${b.ex.coverage_missing}`);
  if (b.ex.coverage_missing !== false) return say('CN15', false, 'coverage_missing=true tren muc BANG', chi);
  if (!/hình dạng/.test(JSON.stringify(b.ex.coverage || []))) return say('CN15', false, 'khoi khong mang chu cua hang bang', chi);
  if (/chưa có section Coverage/.test(b.html)) return say('CN15', false, 'van con co vang «chua co section Coverage» tren muc BANG', chi);
  // Ô (1b) văn xuôi — cùng lớp.
  const v = theCong2({ coverage: 'vanxuoi', gate: '1' });
  chi.push(`văn xuôi: coverage_missing=${v.ex.coverage_missing}`);
  if (v.ex.coverage_missing !== false) return say('CN15', false, 'coverage_missing=true tren muc VAN XUOI', chi);
  // Ô (2) VẮNG HẲN: đường cũ KHÔNG được nới theo.
  const k = theCong2({ coverage: 'khong', gate: '1' });
  chi.push(`vắng hẳn: coverage_missing=${k.ex.coverage_missing}, còn cờ vàng=${/chưa có section Coverage/.test(k.html)}`);
  if (k.ex.coverage_missing !== true) return say('CN15', false, 'vang han muc ma khong bao thieu — da noi ca duong cu', chi);
  if (!/chưa có section Coverage/.test(k.html)) return say('CN15', false, 'vang han muc ma co vang bien mat', chi);
  say('CN15', true, '', chi);
});



// ── chạy ──────────────────────────────────────────────────────────────────
const chon = (process.env.CNDN_CASES || '').split(/[,\s]+/).filter(Boolean);
const ids = Object.keys(CASES).filter(id => !chon.length || chon.includes(id));
if (!ids.length) { console.error('CNDN_CASES khop 0 ca'); process.exit(1); }
for (const id of ids) CASES[id]();
console.log(`\nResults: ${ids.length - fails.length} passed, ${fails.length} failed (cong-nguoi-doc-du-nguon)`);
process.exit(fails.length ? 1 : 0);
