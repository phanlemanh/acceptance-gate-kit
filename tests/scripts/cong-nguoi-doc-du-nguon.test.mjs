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
//    Luật này TỪNG chỉ là lời dặn: lượt chấm 5 đo được năm trong bảy ca không có
//    một dòng mũi tiêm nào, trong khi evals.yaml khai từng mũi kèm thông điệp ghim.
//    Nay cả năm ca đều gọi banTiem(); ai thêm ca mới mà bỏ chiều đỏ thì đang dựng
//    lại đúng lớp lỗi ấy. Bộ máy dùng chung ở banTiem/bocTu, không chép tay.
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

// ── mũi tiêm: bản sao cây, hoàn nguyên ĐÚNG MỘT đường ─────────────────────
// Vì sao mỗi ca phải có: một assert dương đứng một mình không phân biệt được
// «bắt đúng lỗi» với «chưa bao giờ chạy» — bản sao hỏng, cp lỗi, script vắng
// (exit 127) đều cho cùng màu xanh. Lượt chấm 5 đo được đúng bệnh đó ở ngay hồ
// sơ này: năm ca chỉ có assert dương, còn đối chứng nền của cả bảy phép đo là
// MODULE_NOT_FOUND (tệp ca là tệp MỚI nên cây gốc không có nó) được ghi vào báo
// cáo thành «đỏ = có phân biệt».
//
// banTiem chép TRỌN `lib` và `scripts` — không chép danh sách tệp tay, vì vật
// được đo gọi thêm một script mới là bản sao thiếu tệp, đỏ vì HẠ TẦNG chứ không
// vì vật. Mũi tiêm phải khớp ĐÚNG MỘT LẦN và bản sao phải qua `node --check`;
// thiếu một trong hai thì ca ĐỎ CÓ TÊN, không im.
const cp = req('node:child_process');
function banTiem(ten, sua) {
  const ban = mk(`tiem-${ten}-`);
  fs.cpSync(path.join(ROOT, 'lib'), path.join(ban, 'lib'), { recursive: true });
  fs.cpSync(path.join(ROOT, 'scripts'), path.join(ban, 'scripts'), { recursive: true });
  for (const [rel, moc, thay] of sua) {
    const f = path.join(ban, rel);
    const src = fs.readFileSync(f, 'utf8');
    const n = src.split(moc).length - 1;
    if (n !== 1) return { loi: `mui tiem "${ten}" khop ${n} lan trong ${rel}, phai dung 1` };
    fs.writeFileSync(f, src.replace(moc, thay));
    const kt = cp.spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' });
    if (kt.status !== 0) return { loi: `ban tiem "${ten}" khong qua node --check (${rel}): ${String(kt.stderr || '').trim().split('\n')[0].slice(0, 100)}` };
  }
  return { root: ban };
}
// Gọi bộ bóc của MỘT cây qua tiến trình con — createRequire cache theo đường dẫn
// nên bản tiêm ở đường dẫn khác không đụng cache, nhưng chạy con vẫn đúng hơn:
// nó nạp đúng cách ba script kia nạp.
function bocTu(agRoot, hopDongText) {
  const f = path.join(mk('hd-'), 'contract.md');
  fs.writeFileSync(f, hopDongText);
  const r = cp.spawnSync(process.execPath, ['-e',
    'const L=require(process.argv[1]);const fs=require("fs");const t=fs.readFileSync(process.argv[2],"utf8");' +
    'const ac=L.parseACBlock(t);process.stdout.write(JSON.stringify({ids:ac.map(a=>a.id),gwt:ac.map(a=>a.gwt),blind:L.acBlindSpot(t,ac.map(a=>a.id))}))',
    path.join(agRoot, 'lib', 'ac-line.cjs'), f], { encoding: 'utf8' });
  try { return JSON.parse(r.stdout); } catch (_) { return { ids: null, loi: String(r.stderr || '').trim().split('\n')[0].slice(0, 120) }; }
}

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

  // Ô cấp h2 KHÔNG có mục bao ngoài — hình dạng đời thật của 81 hợp đồng
  // (media-library/embed-on-approve và các hồ sơ khác). Sau nhát cắt lượt 5, bộ
  // bóc KHÔNG đọc chúng và ĐÓ LÀ ĐÚNG: quét cả tệp để bóc thì `- AC-4:` nằm
  // trong «Known limits» lên thẻ thành tiêu chí phải làm, còn cờ điểm-mù hoá im
  // vì hai bên cùng đếm một tập dòng. Đo được ở lượt 5 trên cây trước nhát cắt.
  // Hợp đồng muốn được đọc thì khai một mục tiêu chí; cờ `blank` nói đúng câu đó.
  const h2Doi = ['---', 'schema_version: 1', '---', '', '# Contract — x', '',
    '## AC-7 (nhãn bảy)', 'Given a, When b, Then c', '', '## Known limits', '',
    '- AC-4: giới hạn đã biết, KHÔNG phải tiêu chí.', ''].join('\n');
  const raH2 = lib.parseACBlock(h2Doi).map(a => a.id);
  chi.push(`không mục bao ngoài → bóc ra [${raH2.join(',')}] (phải rỗng)`);
  if (raH2.length) return say('CN07', false, `khong muc bao ngoai ma van boc: ${raH2.join(',')}`, chi);
  const bH2 = lib.acBlindSpot(h2Doi, raH2);
  chi.push(`  và cờ điểm-mù kêu: ${bH2 ? bH2.kind : 'IM'}`);
  if (!bH2 || bH2.kind !== 'blank') return say('CN07', false, 'khong doc duoc ma co diem-mu KHONG keu', chi);

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

  // CHIỀU ĐỎ — hoàn nguyên nhánh TIÊU ĐỀ của bộ bóc trên một bản sao. Cây lành
  // phải bóc được ba ca thật ở trên (đối chứng dương, vừa chạy xong); bản tiêm
  // phải ra RỖNG trên cùng fixture. Bằng nhau nghĩa là ca này không đo nhánh ấy.
  const t = banTiem('cn07-bo-nhanh-tieu-de', [['lib/ac-line.cjs',
    '    const h = l.match(AC_HEAD);', '    const h = null;']]);
  if (t.loi) return say('CN07', false, t.loi, chi);
  const hdTd = hopDong(THAT_CRM + '\nGiven commit đã đẩy, When chạy lệnh, Then số trả về là 0');
  const lanh = bocTu(ROOT, hdTd), tiem = bocTu(t.root, hdTd);
  chi.push(`chiều đỏ: cây lành [${(lanh.ids || []).join(',')}] · bản tiêm [${(tiem.ids || ['LỖI']).join(',')}]`);
  if (!lanh.ids || lanh.ids.length !== 1) return say('CN07', false, `doi chung duong qua tien trinh con hong: ${lanh.loi || JSON.stringify(lanh.ids)}`, chi);
  if (!tiem.ids) return say('CN07', false, `ban tiem chay khong duoc: ${tiem.loi}`, chi);
  if (tiem.ids.length !== 0) return say('CN07', false, `bo nhanh tieu de ma van boc ${tiem.ids.length} tieu chi — ca nay khong do nhanh do`, chi);

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
  // Ô thứ tư — RĂNG HỒI QUY của nhát cắt lượt 5: KHÔNG mục nào thì bộ bóc trả
  // RỖNG. Bản trước quét cả tệp và vì thế bịa tiêu chí từ mục «Known limits».
  const khongMuc = ['---', 'schema_version: 1', '---', '', than, ''].join('\n');
  const r4 = lib.parseACBlock(khongMuc).map(a => a.id);
  chi.push(`không mục nào → [${r4.join(',')}] (phải rỗng)`);
  if (r4.length) return say('CN08', false, `khong muc nao ma van boc "${r4.join(',')}"`, chi);

  // CHIỀU ĐỎ — bản sao thu danh sách tên mục về đúng `Criteria`. Cây lành đọc
  // được `## Acceptance Criteria`; bản tiêm phải KHÔNG. Bằng nhau thì ca này
  // không đo danh sách tên mục, nó chỉ đang đo rằng `Criteria` vẫn chạy.
  const t = banTiem('cn08-thu-ten-muc', [['lib/ac-line.cjs',
    "const CRITERIA_HEADINGS = ['Criteria', 'Acceptance Criteria'];",
    "const CRITERIA_HEADINGS = ['Criteria'];"]]);
  if (t.loi) return say('CN08', false, t.loi, chi);
  const hdAC = hopDong(than, 'Acceptance Criteria');
  const lanh = bocTu(ROOT, hdAC), tiem = bocTu(t.root, hdAC);
  chi.push(`chiều đỏ: cây lành [${(lanh.ids || []).join(',')}] · bản tiêm [${(tiem.ids || ['LỖI']).join(',')}]`);
  if (!lanh.ids || lanh.ids.length !== 2) return say('CN08', false, `doi chung duong qua tien trinh con hong: ${lanh.loi || JSON.stringify(lanh.ids)}`, chi);
  if (!tiem.ids) return say('CN08', false, `ban tiem chay khong duoc: ${tiem.loi}`, chi);
  if (tiem.ids.length !== 0) return say('CN08', false, `thu ten muc ma van doc duoc ${tiem.ids.length} — tieu de muc chua nhan het`, chi);

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

  // Ô ĐỐI XỨNG HAI KHUÔN (lượt chấm 5): AC_SUSPECT được nới sang tiêu đề, nên
  // AC_XREF sinh đôi cũng phải nới. Không thì một tham chiếu chéo viết dạng tiêu
  // đề vừa bị đếm là nghi ngờ vừa không bóc được → cờ SHORT nổ oan và khoá dòng
  // một-chạm trên một hợp đồng KHÔNG thiếu gì.
  const cheo = hopDong('### AC-1 — một\nGiven a, When b, Then c\n\n### AC-2 — hai\nGiven d, When e, Then f\n\n### AC-5, AC-9, AC-10 chưa có gì\nGhi chú.');
  const idsCheo = lib.parseACBlock(cheo).map(a => a.id);
  const bCheo = lib.acBlindSpot(cheo, idsCheo);
  chi.push(`tham chiếu chéo dạng TIÊU ĐỀ: bóc [${idsCheo.join(',')}] → ${bCheo ? 'KÊU OAN ' + bCheo.kind : 'IM (đúng)'}`);
  if (idsCheo.join(',') !== 'AC-1,AC-2') return say('CN09', false, `tham chieu cheo sinh id la: ${idsCheo.join(',')}`, chi);
  if (bCheo !== null) return say('CN09', false, 'AC_XREF khong noi theo AC_SUSPECT — keu oan tren hop dong lanh', chi);

  // CHIỀU ĐỎ (1) — hoàn nguyên AC_SUSPECT về khuôn chỉ-gạch-đầu-dòng. Với hợp
  // đồng khai bằng tiêu đề, khuôn cũ cho m = 0 nên nhánh `n===0 && m>0` không bao
  // giờ đúng: bộ dò IM ở đúng chỗ nó sinh ra để kêu (đo được: 34 trong 38 hồ sơ).
  const t1 = banTiem('cn09-suspect-cu', [['lib/ac-line.cjs',
    'const AC_SUSPECT = /^\\s*(?:#{2,6}\\s+)?(?:[-*]\\s+)?\\*{0,2}\\s*AC-\\d+\\b/;',
    'const AC_SUSPECT = /^\\s*(?:[-*]\\s+)?\\*{0,2}\\s*AC-\\d+\\b/;']]);
  if (t1.loi) return say('CN09', false, t1.loi, chi);
  const r1 = cp.spawnSync(process.execPath, ['-e',
    'const L=require(process.argv[1]);const fs=require("fs");process.stdout.write(JSON.stringify(L.acBlindSpot(fs.readFileSync(process.argv[2],"utf8"),[])))',
    path.join(t1.root, 'lib', 'ac-line.cjs'), (() => { const f = path.join(mk('cn09-hd-'), 'contract.md'); fs.writeFileSync(f, t); return f; })()], { encoding: 'utf8' });
  const bTiem = String(r1.stdout || '').trim();
  chi.push(`chiều đỏ 1: khuôn AC_SUSPECT cũ → bộ dò trả ${bTiem || 'LỖI: ' + String(r1.stderr || '').slice(0, 80)}`);
  if (bTiem !== 'null') return say('CN09', false, `khuon cu ma bo do VAN keu (${bTiem}) — ca nay khong do nhanh tieu de`, chi);

  // CHIỀU ĐỎ (2) — răng hồi quy của nhát cắt lượt 5. Cho bộ BÓC dùng lại phạm vi
  // quét-cả-tệp của bộ ĐẾM: tiêu chí MA từ «Known limits» phải quay lại VÀ cờ
  // phải hoá im, đúng cặp triệu chứng đo được ở lượt 5. Nếu bản tiêm vẫn sạch thì
  // hai đường đã đấu vào nhau ở đâu đó và ca này không còn canh gì.
  const t2 = banTiem('cn09-boc-quet-ca-tep', [['lib/ac-line.cjs',
    '  for (const { l } of criteriaLinesScoped(contractText)) {',
    '  for (const { l } of criteriaLines(contractText)) {']]);
  if (t2.loi) return say('CN09', false, t2.loi, chi);
  const hdMa = ['---', 'schema_version: 1', '---', '', '## AC-1 (nhãn một)', 'Given a, When b, Then c', '',
    '## Known limits', '', '- AC-4: giới hạn đã biết, KHÔNG phải tiêu chí.', '- AC-9: cũng vậy.', ''].join('\n');
  const sach = bocTu(ROOT, hdMa), ma = bocTu(t2.root, hdMa);
  chi.push(`chiều đỏ 2: cây lành [${(sach.ids || []).join(',')}] cờ=${sach.blind ? sach.blind.kind : 'IM'} · bản tiêm [${(ma.ids || ['LỖI']).join(',')}] cờ=${ma.blind ? ma.blind.kind : 'IM'}`);
  if (!sach.ids || sach.ids.length !== 0 || !sach.blind || sach.blind.kind !== 'blank') {
    return say('CN09', false, `doi chung duong hong: boc=${JSON.stringify(sach.ids)} co=${JSON.stringify(sach.blind)}`, chi);
  }
  if (!ma.ids) return say('CN09', false, `ban tiem chay khong duoc: ${ma.loi}`, chi);
  if (!ma.ids.includes('AC-4') || ma.blind !== null) {
    return say('CN09', false, `boc quet-ca-tep ma KHONG sinh tieu chi ma / co van keu — hai duong da dau vao nhau`, chi);
  }

  say('CN09', true, '', chi);
});

// ══ CN13 — BA bên gọi cùng thấy MỘT số ═════════════════════════════════════
// Đo QUAN HỆ, không đo một vị từ: ba bề mặt chấm cùng một hợp đồng phải ra cùng
// tập tiêu chí. Lớp lỗi nó canh là «sửa hai bên, quên bên thứ ba» — nên mũi tiêm
// phải hoàn nguyên ĐÚNG MỘT bên gọi, và đúng bên ấy phải lệch trong khi hai bên
// kia không đổi. MỘT mũi tiêm dùng chung (hạ chính lib xuống) KHÔNG phân biệt
// được «ba bên cùng nguồn» với «một bên gọi riêng bị bỏ quên»: mọi bên đều đổi.
//
// BA, không phải bốn. Bộ đọc thứ tư từng được kể tên là nhánh node của răng
// cross-layer trong scripts/pre-merge-check.sh; tệp đó CHƯA chuyển sang bộ bóc
// chung và nằm ngoài phạm vi vòng này (xem Out of scope của hợp đồng). Kể nó vào
// đây mà không chạy nó là đúng thứ lời-khai-không-có-vật mà vòng này đi đóng —
// và bản trước của ca này còn thay nó bằng chính lib/ac-line.cjs, tức bằng đúng
// tệp đang bị tiêm, nên số đó đổi theo mũi tiêm một cách tất yếu.
def('CN13', () => {
  const chi = [];
  const N = 5;
  const thanTieuDe = Array.from({ length: N }, (_, k) => `### AC-${k + 1} — nhãn ${k + 1}\nGiven a, When b, Then c`).join('\n\n');
  const thanGach = Array.from({ length: N }, (_, k) => `- AC-${k + 1}: nhãn ${k + 1} Given a, When b, Then c`).join('\n');
  const hopDongCua = (than) => ['---', 'schema_version: 1', 'feature: x', 'slug: x', 'risk_tier: T2', 'surfaces: [cli]',
    'status: draft', 'approved_by:', 'approved_at:', '---', '', '## Criteria', '', than, '',
    '## Coverage', '', '- trục: một', '', '## Out of scope', '', '- x', ''].join('\n');
  const ev = ['evals:', ...Array.from({ length: N }, (_, k) => k + 1).flatMap(k => [
    `  - id: E${k}`, `    criterion: AC-${k}`, '    executor: script',
    '    cmd: config:executors.script.x', '    expected: x'])].join('\n');

  const dungKho = (than) => {
    const R = mk('cn13-kho-');
    const d = path.join(R, '_acceptance', 'x');
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(R, '_acceptance', 'config.yaml'), 'schema_version: 1\n');
    fs.writeFileSync(path.join(d, 'contract.md'), hopDongCua(than));
    fs.writeFileSync(path.join(d, 'evals.yaml'), ev);
    // Báo cáo phải mang BẢNG per-eval: trang bằng chứng chỉ dùng chữ của tiêu chí
    // để chú cho từng dòng eval, nên không có bảng thì nó không đọc tiêu chí nào
    // và phép đo hoá hằng-đúng (đo được ở chính lượt dựng ca này).
    fs.writeFileSync(path.join(d, 'evidence-report.md'),
      ['---', 'schema_version: 1', 'feature_slug: x', 'verdict: PASS', 'human_signoff: Ng 2026-09-13', '---', '',
        '| Eval | Criterion | Executor | Verdict |', '|---|---|---|---|',
        ...Array.from({ length: N }, (_, k) => `| E${k + 1} | AC-${k + 1} | script | PASS |`), '',
        '## Evidence', '', '- E1 exit 0', '', '## Known limits', '', '## Ngoài hợp đồng', ''].join('\n'));
    return R;
  };

  // Ba bên gọi, mỗi bên trả một CON SỐ tiêu chí đọc được từ CÙNG một kho.
  const doBa = (agRoot, R) => {
    const the = cp.spawnSync(process.execPath, [path.join(agRoot, 'scripts', 'gate-card.js'), '--slug', 'x', '--root', R, '--extract'], { encoding: 'utf8' });
    let soThe = -1;
    try { const j = JSON.parse(the.stdout); soThe = (j.will_do || []).length + (j.wont_do || []).length + (j.judgment || []).length; } catch (_) { /* giữ -1 */ }
    const lint = cp.spawnSync(process.execPath, [path.join(agRoot, 'scripts', 'eval-coverage-lint.js'), '--files', path.join(R, '_acceptance', 'x', 'contract.md'), path.join(R, '_acceptance', 'x', 'evals.yaml')], { encoding: 'utf8' });
    // lint không in số tiêu chí; dùng W7 (bộ dò điểm mù) làm đại lượng. Khớp DÒNG
    // CẢNH BÁO `  [nhãn] W7 …`, KHÔNG khớp dòng chú giải cuối output — dòng đó
    // LUÔN in và giải thích cả W1..W8, nên `/W7 /` trần cho kết quả hằng-đúng.
    const lintThieu = /^\s*\[[^\]]*\]\s*W7 /m.test(lint.stdout || '');
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
    return { soThe, soTrang, lintThieu, theMa: the.status, trangMa: trang.status };
  };

  // ĐỐI CHỨNG DƯƠNG (a): CÙNG nội dung viết bằng GẠCH ĐẦU DÒNG — khuôn mà cả ba
  // bên vốn đã đọc được từ trước vòng này. Nó chứng minh bộ máy đo chạy thật,
  // độc lập với tính năng đang thêm; ba bên ra 5 ở đây mà ra 0 ở dạng tiêu đề thì
  // đó là lỗi tính năng, không phải lỗi hạ tầng ca.
  const Rg = dungKho(thanGach);
  const g = doBa(ROOT, Rg);
  chi.push(`đối chứng dương · gạch đầu dòng: thẻ=${g.soThe} trang=${g.soTrang} lint-thiếu=${g.lintThieu}`);
  if (g.soThe !== N || g.soTrang !== N || g.lintThieu) {
    return say('CN13', false, `doi chung duong dang gach hong: the=${g.soThe} trang=${g.soTrang} lint=${g.lintThieu}`, chi);
  }

  // ĐỐI CHỨNG DƯƠNG (b): dạng TIÊU ĐỀ trên cây đang đo — cả ba cũng phải ra 5.
  const Rt = dungKho(thanTieuDe);
  const duong = doBa(ROOT, Rt);
  chi.push(`đối chứng dương · tiêu đề: thẻ=${duong.soThe} trang=${duong.soTrang} lint-thiếu=${duong.lintThieu}`);
  if (duong.soThe !== N) return say('CN13', false, `the ra ${duong.soThe}, cho ${N} (ma thoat ${duong.theMa})`, chi);
  if (duong.soTrang !== N) return say('CN13', false, `trang bang chung ra ${duong.soTrang}, cho ${N} (ma thoat ${duong.trangMa})`, chi);
  if (duong.lintThieu) return say('CN13', false, 'lint bao doc thieu tren hop dong lanh', chi);

  // BA MŨI TIÊM ĐỘC LẬP — mỗi mũi hoàn nguyên ĐÚNG MỘT bên gọi về khuôn hẹp cũ
  // (`section(contract,'Criteria')` + parseAC, chỉ thấy gạch đầu dòng).
  const MUI = [
    ['thẻ', 'scripts/gate-card.js',
      "for (const ac of parseACBlock(contract)) { if (seen[ac.id])",
      "for (const ac of section(contract, 'Criteria').map(parseAC).filter(Boolean)) { if (seen[ac.id])"],
    ['trang bằng chứng', 'scripts/evidence-page.js',
      "const { parseACBlock } = require(path.join(__dirname, '..', 'lib', 'ac-line.cjs'));",
      "const { parseAC } = require(path.join(__dirname, '..', 'lib', 'ac-line.cjs'));\nconst parseACBlock = (t) => section(t, 'Criteria').map(parseAC).filter(Boolean);"],
    ['lint', 'scripts/eval-coverage-lint.js',
      "  if (acLine && typeof acLine.parseACBlock === 'function') {",
      "  if (false && acLine && typeof acLine.parseACBlock === 'function') {"],
  ];
  for (const [ten, tep, moc, thay] of MUI) {
    const t = banTiem(`cn13-${tep.replace(/[^a-z]+/gi, '-')}`, [[tep, moc, thay]]);
    if (t.loi) return say('CN13', false, t.loi, chi);
    const d = doBa(t.root, Rt);
    const doi = [];
    if (d.soThe !== duong.soThe) doi.push('thẻ');
    if (d.soTrang !== duong.soTrang) doi.push('trang bằng chứng');
    if (d.lintThieu !== duong.lintThieu) doi.push('lint');
    chi.push(`mũi tiêm «${ten}» → thẻ=${d.soThe} trang=${d.soTrang} lint-thiếu=${d.lintThieu} · bên đổi: [${doi.join(', ') || 'KHÔNG BÊN NÀO'}]`);
    if (!doi.includes(ten)) return say('CN13', false, `tiem ${ten} ma chinh ${ten} KHONG doi — ben goi ${ten} khong doi theo ban va`, chi);
    if (doi.length !== 1) return say('CN13', false, `tiem ${ten} ma ${doi.length} ben doi (${doi.join(', ')}) — mui tiem khong co lap`, chi);
  }
  chi.push('ba bên gọi độc lập, mỗi mũi tiêm chỉ làm lệch đúng bên của nó');
  say('CN13', true, '', chi);
});


// ── thẻ: dựng kho rồi rút HTML ────────────────────────────────────────────
// gate '1' = hồ sơ draft; khối Độ phủ AC và khoá coverage_missing CHỈ có ở thẻ
// Cổng Phạm vi, nên CN15 luôn dựng ở nấc đó. Tham số `trong`/`ngoai` đã gỡ cùng
// AC-10 — hồ sơ fixture nay không cần tệp rà soát nào.
function theCard({ coverage = 'bullet', gate = '1' } = {}) {
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
  fs.writeFileSync(path.join(d, 'evidence-report.md'), ['---', 'schema_version: 1', 'feature_slug: x',
    'verdict: PENDING-JUDGMENT', 'human_signoff:', 'findings_open: 0', '---', '',
    '## Evidence', '', '- E1 exit 0', '', '## Known limits', '', '## Ngoài hợp đồng', ''].join('\n'));
  const r = cp.spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'gate-card.js'), '--slug', 'x', '--root', R], { encoding: 'utf8' });
  const x = cp.spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'gate-card.js'), '--slug', 'x', '--root', R, '--extract'], { encoding: 'utf8' });
  let ex = {}; try { ex = JSON.parse(x.stdout); } catch (_) { /* giữ rỗng */ }
  return { html: r.stdout || '', ma: r.status, ex, root: R };
}

// ══ CN15 — thẻ đọc được Coverage dạng BẢNG và văn xuôi ════════════════════
def('CN15', () => {
  const chi = [];
  // Đối chứng dương TRƯỚC: Coverage dạng gạch đầu dòng.
  const g = theCard({ coverage: 'bullet', gate: '1' });
  chi.push(`gạch đầu dòng: coverage_missing=${g.ex.coverage_missing}`);
  if (g.ex.coverage_missing !== false) return say('CN15', false, 'doi chung duong: dang gach van bao thieu', chi);
  // Ô (1) BẢNG: phải KHÔNG báo thiếu, và khối phải mang chữ của một hàng bảng.
  const b = theCard({ coverage: 'bang', gate: '1' });
  chi.push(`bảng: coverage_missing=${b.ex.coverage_missing}`);
  if (b.ex.coverage_missing !== false) return say('CN15', false, 'coverage_missing=true tren muc BANG', chi);
  if (!/hình dạng/.test(JSON.stringify(b.ex.coverage || []))) return say('CN15', false, 'khoi khong mang chu cua hang bang', chi);
  if (/chưa có section Coverage/.test(b.html)) return say('CN15', false, 'van con co vang «chua co section Coverage» tren muc BANG', chi);
  // Ô (1b) văn xuôi — cùng lớp.
  const v = theCard({ coverage: 'vanxuoi', gate: '1' });
  chi.push(`văn xuôi: coverage_missing=${v.ex.coverage_missing}`);
  if (v.ex.coverage_missing !== false) return say('CN15', false, 'coverage_missing=true tren muc VAN XUOI', chi);
  // Ô (2) VẮNG HẲN: đường cũ KHÔNG được nới theo.
  const k = theCard({ coverage: 'khong', gate: '1' });
  chi.push(`vắng hẳn: coverage_missing=${k.ex.coverage_missing}, còn cờ vàng=${/chưa có section Coverage/.test(k.html)}`);
  if (k.ex.coverage_missing !== true) return say('CN15', false, 'vang han muc ma khong bao thieu — da noi ca duong cu', chi);
  if (!/chưa có section Coverage/.test(k.html)) return say('CN15', false, 'vang han muc ma co vang bien mat', chi);

  // CHIỀU ĐỎ — bản sao hoàn nguyên bộ đọc mục về CHỈ-GẠCH-ĐẦU-DÒNG. Mục Coverage
  // viết bằng BẢNG khi đó lại ra rỗng và thẻ nổi cờ «chưa có section Coverage»
  // trên một mục CÓ THẬT — đúng lớp đo được ở 29 trên 244 hợp đồng. Bản tiêm mà
  // vẫn đọc được bảng thì ca này không đo nhánh ấy.
  const t = banTiem('cn15-doc-chi-gach', [['lib/md-section.cjs',
    '  if (raws.some(l => /\\{\\{/.test(l))) return [];',
    '  if (raws.some(l => /\\{\\{/.test(l))) return [];\n  return [];']]);
  if (t.loi) return say('CN15', false, t.loi, chi);
  const R = theCard({ coverage: 'bang', gate: '1' }).root;
  const r = cp.spawnSync(process.execPath, [path.join(t.root, 'scripts', 'gate-card.js'),
    '--slug', 'x', '--root', R, '--extract'], { encoding: 'utf8' });
  let exTiem = {}; try { exTiem = JSON.parse(r.stdout); } catch (_) { /* giữ rỗng */ }
  chi.push(`chiều đỏ: bản tiêm trên CÙNG mục BẢNG → coverage_missing=${exTiem.coverage_missing} (mã thoát ${r.status})`);
  if (r.status !== 0) return say('CN15', false, `ban tiem chet, ma ${r.status}: ${String(r.stderr || '').trim().split('\n')[0].slice(0, 100)}`, chi);
  if (exTiem.coverage_missing !== true) return say('CN15', false, 'ban tiem chi-gach van doc duoc BANG — ca nay khong do nhanh do', chi);

  say('CN15', true, '', chi);
});



// ── chạy ──────────────────────────────────────────────────────────────────
const chon = (process.env.CNDN_CASES || '').split(/[,\s]+/).filter(Boolean);
const ids = Object.keys(CASES).filter(id => !chon.length || chon.includes(id));
if (!ids.length) { console.error('CNDN_CASES khop 0 ca'); process.exit(1); }
for (const id of ids) CASES[id]();
console.log(`\nResults: ${ids.length - fails.length} passed, ${fails.length} failed (cong-nguoi-doc-du-nguon)`);
process.exit(fails.length ? 1 : 0);
