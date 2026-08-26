// tests/plugins/lan-may-classifier.test.mjs — ca hồ sơ lan-may-song-qua-bo-phan-loai.
// Đo LỜI KHAI trên bốn vật (luật cho-phép · khuôn khởi tạo · nghi thức · tài liệu).
// Không có ca LM7: E7/AC-7 là eval judgment (hội đồng chấm chất lượng bộ đo), không
// phải phép đo máy — số hiệu giữ khớp với eval để đọc chéo không phải dịch.
//
// Mọi đường dẫn suy từ vị trí file này. Ma trận mutant là HỢP ĐỒNG, khai giữa mốc neo
// MUTANT-MATRIX ở đầu evals.yaml của hồ sơ; số mutant = số vế được khẳng định.
//   LM_CASES=LM1,LM2 node tests/plugins/lan-may-classifier.test.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const require = createRequire(import.meta.url);
// Bộ đọc cấu hình DÙNG CHUNG của kit — CLAUDE.md cấm mọc parser thứ năm.
const { resolveConfigKey } = require(path.join(ROOT, 'lib', 'evidence-core.cjs'));
const { configList } = require(path.join(ROOT, 'lib', 'workspace-record.cjs'));

const SETTINGS = path.join(ROOT, '.claude', 'settings.json');
const CONFIG = path.join(ROOT, '_acceptance', 'config.yaml');

// Danh sách ca ĐÃ CÀI, mọc dần theo từng task của kế hoạch. Khai sẵn ca chưa viết
// làm bộ chạy đỏ oan ở mỗi commit trung gian; danh sách ĐỦ được evals.yaml canh
// (mỗi eval trỏ một ca), nên không có đường quên im lặng.
// LM3 ĐÃ RỜI file này sang răng hồ sơ `_acceptance/<slug>/rang-khong-nuot.sh`: nó so
// settings ở mốc git cố định với cây, nên nằm trong bộ kiểm THƯỜNG TRỰC thì mọi sửa
// hợp lệ về sau của enabledPlugins / extraKnownMarketplaces — do hồ sơ KHÁC làm — sẽ
// làm suite đỏ oan («thước ghim vào thứ SẼ ĐỔI»). Răng chết theo hồ sơ khi gộp.
const ALL_IDS = ['LM1', 'LM2', 'LM4', 'LM5', 'LM6', 'LM8', 'LM8b'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
let failures = 0;
const only = (process.env.LM_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const ran = new Set();
const want = id => { const w = only.length === 0 || only.includes(id); if (w) ran.add(id); return w; };
const pass = (id, name) => console.log(`PASS: [${id}] ${name}`);
const fail = (id, msg) => { console.log(`FAIL: [${id}] ${msg}`); failures++; };

const readJSON = p => JSON.parse(readFileSync(p, 'utf8'));
const reEsc = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const flat = t => String(t).replace(/\s+/g, ' ');

// <<<PERM-RULE-GRAMMAR
// Khuôn luật quyền của khung cấu hình harness: mỗi entry là `Bash(<lệnh>)` — bọc bắt
// buộc, tên công cụ đứng trước. Nguồn: khoá `permissions` (allow/deny/ask) của khung
// cấu hình, đọc nguyên văn 2026-08-25. Khuôn sống ĐÚNG một chỗ: bên viết (settings)
// và bên đọc (ca này) phải cùng khuôn, không mỗi bên tự chế.
const PERM_RULE = /^Bash\((.+)\)$/;
// GIỚI HẠN ĐÃ KHAI: hằng này là bản CHÉP TAY. Nguồn thật (khung cấu hình của
// harness) không phải file trong kho nên KHÔNG round-trip được bên-viết→bên-đọc như
// các mối nối khác của kit. Nó chết lặng nếu harness đổi văn phạm; đổi lại, nó vẫn
// bắt được bên viết settings tự chế khuôn khác — đó là lớp lỗi ô này nhắm.
// PERM-RULE-GRAMMAR>>>

// ---------------------------------------------------------------------------
// Bộ kiểm — DÙNG CHUNG cho chiều xanh và mọi mutant. Mỗi hàm trả mảng lỗi có TÊN
// vật/entry/lệnh trong thông điệp; ca chỉ so mã thoát không phân biệt được «bắt
// đúng lỗi» với «chưa bao giờ chạy».
// ---------------------------------------------------------------------------

const allowEntries = obj => ((obj.permissions || {}).allow || []);
// Các khoá mà một lệnh kiểm KHÔNG được nằm dưới — RÚT TỪ HỢP ĐỒNG, không gõ tay.
// Mutant sinh từ chính danh sách này nên mỗi phần tử luôn có chiều đỏ; nhưng nếu danh
// sách cũng do tôi gõ thì THU nó lại sẽ thu luôn mutant và thước tự nới ra trong im
// lặng. Neo vào AC-8 khép vòng: hợp đồng là bên VIẾT, bộ ca là bên ĐỌC.
const CONTRACT = path.join(ROOT, '_acceptance', 'lan-may-song-qua-bo-phan-loai', 'contract.md');
// MỘT bộ đọc hợp đồng cho MỌI AC. Đọc TRỌN bullet trên bản đã gộp khoảng trắng, không
// đọc một DÒNG VẬT LÝ: ngắt lại dòng trong hợp đồng là thao tác trình bày thuần, không
// đổi một chữ nào của lời hứa — mà bản trước thì ngắt dòng cho `deny` xuống dòng sau là
// thước thu từ 2 còn 1 trong im lặng (hội đồng S4-r7 phá thử được).
function bulletAC(id) {
  let src; try { src = readFileSync(CONTRACT, 'utf8'); } catch { return ''; }
  const m = flat(src).match(new RegExp(`- AC-${id}:([\\s\\S]*?)(?:- AC-\\d|## |$)`));
  return m ? m[1] : '';
}
const backtickWords = t => [...new Set([...t.matchAll(/`([a-z]+)`/g)].map(x => x[1]))];
// Phạm vi của lời hứa «MỘT chỗ» — rút từ chính bullet của AC đó. Vòng 7 chỉ neo phạm vi
// của AC-8 rồi để nguyên bản chép tay của AC-5: hai bên trôi khỏi nhau thì bên trôi
// trong im lặng là bên PHÉP ĐO. Nay MỘT hàm cho cả hai, không hằng chép tay nào. Khuôn
// `x/` có backtick ĐÓNG nên chỉ bắt tên thư mục đứng riêng, không bắt đoạn đầu của một
// đường dẫn nêu trong cùng bullet.
const phamViTuHopDong = id => [...new Set([...bulletAC(id).matchAll(/`([a-z][\w-]*)\/`/g)].map(x => x[1]))];
const CHO_SAI = backtickWords(bulletAC(8));

// Danh sách lệnh kiểm CỐ ĐỊNH — nguồn sự thật là config, KHÔNG phải hằng trong ca.
// Đọc danh sách bằng `configList` của kit (lib/workspace-record.cjs) và giải từng
// khoá bằng `resolveConfigKey` — KHÔNG tự cắt YAML. Bản trước của ca này tự viết bộ
// đọc list thứ hai kèm chú thích khai «bộ đọc chung chỉ giải scalar»; lời khai đó SAI
// và hai bộ đọc đã lệch nhau trên YAML hợp lệ (comment đuôi dòng khoá · item trong
// nháy) — đúng lớp CLAUDE.md cấm: không mọc parser thứ N.
function suiteCommands(configText) {
  const keys = configList(configText, 'suite_keys');
  if (!keys.length) return { keys: [], cmds: [], err: 'khong doc duoc feature_loop.suite_keys tu config' };
  const cmds = [], err = [];
  for (const k of keys) {
    const v = resolveConfigKey(configText, k);
    if (v === null) err.push(`khong giai duoc suite_key: ${k}`);
    else cmds.push(String(v).replace(/^"|"$/g, ''));
  }
  return { keys, cmds, err: err.join(' · ') };
}

// LM1 · AC-1 — QUAN HỆ SONG ÁNH giữa hai vật, không so với hằng gõ tay
function checkBijection(settingsObj, configText) {
  const { cmds, err } = suiteCommands(configText);
  if (err) return [err];
  const allow = allowEntries(settingsObj).map(e => (PERM_RULE.exec(e) || [null, e])[1]);
  const errs = [];
  for (const c of cmds) if (!allow.includes(c)) errs.push(`THIEU lenh trong permissions.allow: "${c}"`);
  for (const a of allow) if (!cmds.includes(a)) errs.push(`THUA lenh trong permissions.allow: "${a}" — khong co trong feature_loop.suite_keys`);
  // Bao hàm hai chiều mới là BẰNG NHAU TẬP HỢP, chưa phải SONG ÁNH như AC-1 hứa: hai
  // entry cùng trỏ một lệnh vẫn lọt cả hai vòng lặp trên. Đếm bội mới đóng được.
  if (allow.length !== cmds.length) {
    const trung = allow.filter((a, i) => allow.indexOf(a) !== i);
    errs.push(trung.length
      ? `entry TRUNG LAP trong permissions.allow: "${[...new Set(trung)].join('", "')}"`
      : `so entry cho-phep (${allow.length}) KHAC so lenh nguon (${cmds.length}) — lech so luong`);
  }
  return errs;
}

// LM2 · AC-2 — mệnh đề ĐÓNG: không entry nào chứa `*`
function checkNoStar(settingsObj) {
  const errs = [];
  const entries = allowEntries(settingsObj);
  // Danh sách RỖNG thoả «không entry nào chứa *» một cách HẰNG ĐÚNG — xanh rỗng.
  // Bộ đếm phải kêu, nếu không ca này xanh cả trên cây chưa hề có luật nào.
  if (!entries.length) errs.push('permissions.allow rong hoac vang — phep dem khong co gi de dem (hang dung)');
  for (const e of entries) if (e.includes('*')) errs.push(`entry cho-phep chua ky tu *: "${e}"`);
  return errs;
}

// LM8 · AC-8 — văn phạm luật quyền + entry nằm đúng chỗ
function checkGrammar(settingsObj, configText) {
  // KHÔNG nuốt lỗi đọc config: cmds rỗng thì vòng lặp ask/deny dưới đây không có gì
  // để so → vế «entry đặt NHẦM CHỖ» thành hằng đúng, và ca chỉ còn đỏ nhờ mutant
  // khác với thông điệp lạc hướng (vấp thật, hội đồng S4-r3 phá thử bằng cách đổi
  // tên khoá suite_keys: LM1 đỏ đúng chỗ, LM8 đối chứng dương VẪN xanh).
  const { cmds, err } = suiteCommands(configText);
  if (err) return [err];
  const p = settingsObj.permissions || {};
  const errs = [];
  for (const e of (p.allow || [])) if (!PERM_RULE.test(e)) errs.push(`entry KHONG dung van pham Bash(<lenh>): "${e}"`);
  for (const k of CHO_SAI) {
    for (const e of (p[k] || [])) {
      const cmd = (PERM_RULE.exec(e) || [null, e])[1];
      if (cmds.includes(cmd)) errs.push(`lenh kiem dat NHAM CHO: "${e}" nam duoi permissions.${k}, phai o allow`);
    }
  }
  if (!(p.allow || []).length) errs.push('permissions.allow rong hoac vang — khong co entry nao de kiem van pham');
  return errs;
}

// MỖI VẾ LÀ MỘT ĐIỀU KIỆN, khai dạng BẢNG — không phải phép AND/HOẶC viết tay.
// Gộp hai điều kiện vào một vế là chỗ trốn: chỉ cần một nhánh còn sống thì nhánh kia
// chết mà không mutant nào chứng được, và số mutant khai ra sẽ nhỏ hơn số điều kiện
// thật. Bảng ép «số vế = số điều kiện = số mutant» thành quan hệ nhìn thấy được.
// (Vấp thật S4-r1: checkAdvice và checkFallback dùng phép HOẶC ngay phía trên một
//  chú thích tự dặn là tránh phép HOẶC.)
// Bẻ vế bằng CHÍNH biểu thức của bộ kiểm, KHÔNG bằng một chuỗi mồi gõ tay. Mồi tay là
// bản chép thứ hai của điều kiện: bẻ «BỘ PHÂN LOẠI» trong khi bộ kiểm dò không phân
// biệt hoa-thường và cụm còn xuất hiện dạng thường ở câu khác trong CÙNG khối → vế vẫn
// xanh dù vật đã hỏng (vấp thật S4-r3). Bẻ bằng chính biểu thức thì sau khi bẻ, bộ
// kiểm KHÔNG THỂ còn khớp — quan hệ do cấu trúc giữ, không do tôi nhớ.
const breakClause = (text, c) =>
  String(text).replace(new RegExp(c.re.source, c.re.flags.includes('i') ? 'gi' : 'g'), '«da be»');

// Nhánh «mốc neo TRÙNG» là một nhánh CÓ THẬT của mọi bộ kiểm văn xuôi (nó tồn tại vì
// vòng 2 lọt một khối thứ hai mang luật NGƯỢC LẠI trong cùng file). Nhánh có thật thì
// phải có chiều đỏ — nếu không, nó không phân biệt được «canh đúng» với «chưa từng
// chạy». Sinh từ một chỗ, dùng cho cả ba bộ kiểm.
const blockBranchMutants = anchor => [
  ['m-moc-neo-trung-trong-cung-file',
    t => `${t}\n<!-- <<<${anchor} -->\nluat NGUOC LAI\n<!-- ${anchor}>>> -->\n`,
    'xuat hien 2 KHOI'],
  ['m-moc-neo-vang',
    t => String(t).replace('<<<' + anchor, '<<<KHONG-CON-' + anchor),
    'thieu moc neo'],
];

// LM8b · AC-8 — khuôn văn phạm phải sống ĐÚNG MỘT chỗ có mốc neo, kèm con trỏ nguồn.
// Vật đo ở đây là CHÍNH file này: hợp đồng hứa mốc neo, nên mốc neo phải đo được.
const SELF = fileURLToPath(import.meta.url);   // suy từ vị trí file, không ghép lại đường dẫn
const GRAMMAR_ANCHOR = 'PERM-RULE-GRAMMAR';
const GRAMMAR_CLAUSES = [
  { id: 'g1', re: new RegExp(reEsc(PERM_RULE.source)), msg: 'khuon van pham KHONG nam trong khoi moc neo — moi ben se tu che khuon rieng' },
  { id: 'g2', re: /khung cấu hình/, msg: 'khoi thieu con tro toi nguon khung cau hinh harness' },
];
function checkGrammarAnchor(selfText, listFiles, readAt) {
  const n = countBlocks(selfText, GRAMMAR_ANCHOR);
  if (n > 1) return [`moc neo ${GRAMMAR_ANCHOR} xuat hien ${n} KHOI trong CUNG file — phai dung 1 (noi dung khoi thu hai khong bo kiem nao doc toi)`];
  const b0 = block(selfText, GRAMMAR_ANCHOR);
  if (b0 === null) return [`thieu moc neo ${GRAMMAR_ANCHOR} — khuon van pham khong co cho song co dinh`];
  const errs = checkClauses(flat(b0), GRAMMAR_CLAUSES);
  // «MỘT chỗ» phải đếm trên TRỌN phạm vi hợp đồng khai, không chỉ trong file này: một
  // khối thứ hai mang khuôn KHÁC ở file bên cạnh là đúng hình dạng vòng 2 đã trả giá,
  // chỉ đổi chỗ. AC-5 đã đo lời hứa cùng loại theo cách này; nay áp cho cả AC-8.
  // KHÔNG có lối thoát câm kiểu `if (!listFiles) return errs`: một chỗ gọi tương lai
  // quên tham số thì trọn vế phạm vi biến mất trong IM LẶNG mà ca vẫn xanh — đúng hình
  // dạng «vế chết» hồ sơ này đang săn. Thiếu thì vỡ to, không vỡ êm.
  let total = 0; const where = [];
  for (const f of listFiles(PHAM_VI_VAN_PHAM)) {
    const n2 = countBlocks(readAt(f) || '', GRAMMAR_ANCHOR);
    if (n2) { total += n2; where.push(`${path.relative(ROOT, f)}×${n2}`); }
  }
  if (total !== 1) errs.push(`ve-pham-vi: moc neo ${GRAMMAR_ANCHOR} xuat hien ${total} KHOI tren pham vi hop dong khai (phai dung 1): ${where.join(', ')}`);
  return errs;
}

const checkClauses = (text, clauses) =>
  clauses.filter(c => !c.re.test(text)).map(c => `${c.id}: ${c.msg}`);

// LM5 · AC-5 — đường thoái hoá trong nghi thức.
// Ba vế đầu là phép đo CÓ-MẶT trên từ vựng ĐÓNG: chúng canh điều khoản không bị
// xoá hay rút ruột, KHÔNG chứng minh câu chữ nói đúng ý — nghĩa của văn xuôi là
// việc người duyệt, đúng bài học hồ sơ design-pass-nac. Vế thứ tư mới là quan hệ
// đếm được: mốc neo xuất hiện ĐÚNG MỘT lần trên trọn hai thư mục.
// Văn xuôi trong markdown bị ngắt dòng theo bề rộng cột; phép đo bám chuỗi mà
// không gộp khoảng trắng sẽ vỡ mỗi lần ai đó xuống dòng lại — hỏng vì TRÌNH BÀY
// chứ không vì NGHĨA. Mọi phép đo trên văn xuôi ở file này đi qua flat().
const FALLBACK_ANCHOR = 'CLASSIFIER-FALLBACK';
const SCAN_DIRS = phamViTuHopDong(5);
const PHAM_VI_VAN_PHAM = phamViTuHopDong(8);
function walkFiles(abs, acc = []) {
  for (const e of readdirSync(abs, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git') continue;   // rác dựng, không phải vật
    const q = path.join(abs, e.name);
    if (e.isDirectory()) walkFiles(q, acc); else acc.push(q);
  }
  return acc;
}
// block() kêu khi có NHIỀU HƠN một khối cùng mốc neo: `String.match` không cờ g chỉ
// trả khối ĐẦU, nên bản sao thứ hai trong CÙNG file vừa không được vế nội dung đọc
// tới vừa không bị vế đếm bắt (vấp thật S4-r2 — hội đồng nối một khối thứ hai mang
// luật NGƯỢC LẠI vào chính SKILL.md mà ca vẫn xanh).
const countBlocks = (text, name) => (String(text).match(new RegExp('<<<' + name + '(?![-\\w])', 'g')) || []).length;
const block = (text, name) => {
  if (countBlocks(text, name) > 1) return null;
  // `\s` chứ không phải `\n`: bộ trích phải đọc được CẢ bản thô lẫn bản đã gộp
  // khoảng trắng — buộc đúng một ký tự xuống dòng là tự trói phép đo vào cách trình
  // bày của vật, đúng lớp «thước ghim vào thứ sẽ đổi».
  // Không đòi đúng một kiểu dấu chú thích: mốc neo sống trong cả tệp tài liệu
  // (`<!-- … -->`) lẫn tệp mã (`// …`). Buộc một kiểu là bắt VẬT đổi theo THƯỚC.
  const m = text.match(new RegExp('<<<' + name + '(?![-\\w])\\s*(?:-->)?([\\s\\S]*?)' + name + '>>>'));
  return m ? m[1] : null;
};
// MỐI NỐI bên-VIẾT → bên-ĐỌC. Engine là bên PHÁT lời báo lỗi khi một lệnh không có
// kết quả; luật trong SKILL.md là bên ĐỌC nó. Cụm nhận dạng rút TỪ NGUỒN ENGINE lúc
// chạy, KHÔNG gõ tay — engine đổi câu mà luật không đổi theo thì ca ĐỎ. Đây là chiều
// đỏ mà vòng 3 chứng minh là thiếu: hình dạng hỏng NẶNG nhất (bầy agent bị giết) sinh
// đúng câu cố định này, và câu đó không chứa chữ classifier / rate-limit / safety nào.
const ENGINE = path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js');
function engineSkipPhrase() {
  let src; try { src = readFileSync(ENGINE, 'utf8'); } catch { return null; }
  const m = src.match(/blocked\.push\(\{\s*cmd,\s*reason:\s*'([^']+)'/);
  return m ? m[1].split('\u2014')[0].trim() : null;
}
const SKIP_PHRASE = engineSkipPhrase();

const FALLBACK_CLAUSES = [
  { id: 've1a', re: /bộ phân loại/i, msg: 'thieu dau hieu kich hoat: bo phan loai' },
  { id: 've1b', re: /nguyên nhân khác/i, msg: 'thieu ve phan biet voi BLOCKED nguyen nhan KHAC' },
  { id: 've2a', re: /lệnh chạy TUẦN TỰ/, msg: 'thieu hanh dong bat buoc: luot ke di TUAN TU (khoi con cau tien le nhac tuan tu — do tu don le la de cau do do ho)' },
  { id: 've2b', re: /KHÔNG dispatch lại fan-out/, msg: 'thieu cam KHONG dispatch lai fan-out' },
  { id: 've3a', re: /Phase 3/, msg: 'thieu con tro toi Phase 3' },
  { id: 've3b', re: /`acceptance`/, msg: 'thieu ten skill acceptance trong con tro' },
];
// Vế rút từ engine — đẩy vào CÙNG bảng nên runner tự sinh mutant như mọi vế khác.
if (SKIP_PHRASE) FALLBACK_CLAUSES.push({
  id: 've1c', re: new RegExp(reEsc(SKIP_PHRASE)),
  msg: `thieu hinh dang IM LANG: cau co dinh engine phat khi agent chet ("${SKIP_PHRASE}") — luat chi doi chu classifier thi khong bao gio no o ca nang nhat`,
});
function checkFallback(skillText, listFiles, readAt) {
  const n = countBlocks(skillText, FALLBACK_ANCHOR);
  if (n > 1) return [`moc neo ${FALLBACK_ANCHOR} xuat hien ${n} KHOI trong CUNG file — phai dung 1 (noi dung khoi thu hai khong bo kiem nao doc toi)`];
  const b0 = block(skillText, FALLBACK_ANCHOR);
  if (b0 === null) return [`thieu moc neo ${FALLBACK_ANCHOR} trong nghi thuc`];
  const errs = checkClauses(flat(b0), FALLBACK_CLAUSES);
  // vế thứ bảy — QUAN HỆ ĐẾM ĐƯỢC: mốc neo đúng MỘT chỗ trên trọn hai thư mục
  // ĐẾM SỐ KHỐI trên trọn tập file, KHÔNG đếm số FILE: AC-5 hứa «đúng MỘT khối»,
  // đếm file thì hai khối trong cùng một file vẫn ra 1 và lọt xanh.
  let total = 0; const where = [];
  for (const f of listFiles()) {
    const n = countBlocks(readAt(f) || '', FALLBACK_ANCHOR);
    if (n) { total += n; where.push(`${path.relative(ROOT, f)}×${n}`); }
  }
  if (total !== 1)
    errs.push(`ve4: moc neo xuat hien ${total} KHOI (phai dung 1): ${where.join(', ')}`);
  return errs;
}

// LM4 · AC-4 — khối khuyên kho tiêu thụ, BA VẾ RỜI (phép đo CÓ-MẶT trên từ vựng đóng).
const ADVICE_ANCHOR = 'CONSUMER-ALLOW-ADVICE';
const ADVICE_CLAUSES = [
  { id: 'a1', re: /KHỚP CHÍNH XÁC/, msg: 'thieu dang khai KHOP CHINH XAC' },
  { id: 'a2', re: /KHÔNG dùng `\*`/, msg: 'thieu cau cam dung `*` (danh sach cho-phep rong)' },
  { id: 'b', re: /nút cổ chai/i, msg: 'thieu ly do: bo phan loai la nut co chai cua lan may' },
  { id: 'c1', re: /KHÔNG tự ghi/, msg: 'thieu cau khai kit KHONG tu ghi luat vao kho ho' },
  { id: 'c2', re: /quyết định an ninh/i, msg: 'thieu cau cap quyen la QUYET DINH AN NINH cua doi' },
];
function checkAdvice(initText) {
  const n = countBlocks(initText, ADVICE_ANCHOR);
  if (n > 1) return [`moc neo ${ADVICE_ANCHOR} xuat hien ${n} KHOI trong CUNG file — phai dung 1 (noi dung khoi thu hai khong bo kiem nao doc toi)`];
  const b0 = block(initText, ADVICE_ANCHOR);
  if (b0 === null) return [`thieu moc neo ${ADVICE_ANCHOR} trong khuon khoi tao`];
  return checkClauses(flat(b0), ADVICE_CLAUSES);
}

// LM6 · AC-6 — tài liệu vận hành nêu CẢ HAI nửa.
const GUIDE_ANCHOR = 'GUIDE-CLASSIFIER-LANE';
const GUIDE_CLAUSES = [
  { id: 'muc1', re: /permissions\.allow/, msg: 'khong neu luat cho-phep cua kho' },
  { id: 'muc1b', re: /lệnh kiểm/i, msg: 'khong noi ro luat ay danh cho LENH KIEM co dinh' },
  { id: 'muc1c', re: /đánh đổi/i, msg: 'khong neu DANH DOI cua luat cho-phep — AC-6 hua ca hai nua "lam gi, danh doi gi"' },
  { id: 'muc2', re: new RegExp(FALLBACK_ANCHOR), msg: 'khong tro toi moc neo duong thoai hoa' },
  { id: 'muc2b', re: /tuần tự/i, msg: 'khong noi luot ke di TUAN TU' },
];
function checkGuide(guideText) {
  // Đo TRONG KHỐI có mốc neo, KHÔNG grep trọn tài liệu: GUIDE.md đã có sẵn cụm
  // «tuần tự» ở hai chỗ khác không liên quan, nên grep cả file làm vế muc2b thành
  // assertion CHẾT — xoá trọn mục mới mà vế đó vẫn xanh (vấp thật S4-r1).
  const n = countBlocks(guideText, GUIDE_ANCHOR);
  if (n > 1) return [`moc neo ${GUIDE_ANCHOR} xuat hien ${n} KHOI trong CUNG file — phai dung 1 (noi dung khoi thu hai khong bo kiem nao doc toi)`];
  const b0 = block(guideText, GUIDE_ANCHOR);
  if (b0 === null) return [`thieu moc neo ${GUIDE_ANCHOR} trong tai lieu van hanh`];
  return checkClauses(flat(b0), GUIDE_CLAUSES);
}

// ---------------------------------------------------------------------------
// Chạy ca: đối chứng dương TRƯỚC, rồi ma trận mutant. Mutant bẻ BẢN SAO của vật và
// đi qua CHÍNH bộ kiểm của chiều xanh — cùng hàm, khác input.
// needle nhận chuỗi hoặc mảng chuỗi (mảng = MỌI vế phải xuất hiện).
// ---------------------------------------------------------------------------
function runObj(id, label, check, mutants) {
  if (!want(id)) return;
  let settings, cfg;
  try { settings = readJSON(SETTINGS); cfg = readFileSync(CONFIG, 'utf8'); }
  catch (e) { return fail(id, `khong doc duoc vat: ${e.message}`); }
  const clean = check(settings, cfg);
  if (clean.length) return fail(id, `doi chung duong DO — ban nguyen ven phai XANH: ${clean.join(' · ')}`);
  const bad = [];
  for (const [name, mutate, needle] of mutants) {
    const [s2, c2] = mutate(JSON.parse(JSON.stringify(settings)), cfg);
    if (JSON.stringify(s2) === JSON.stringify(settings) && c2 === cfg) { bad.push(`${name}: lenh tiem KHONG doi duoc gi`); continue; }
    const errs = check(s2, c2);
    for (const nd of (Array.isArray(needle) ? needle : [needle])) {
      if (!errs.some(e => e.includes(nd))) bad.push(`${name}: khong do dung ve "${nd}" (thu duoc: ${errs.join(' · ') || 'KHONG LOI NAO'})`);
    }
  }
  if (bad.length) fail(id, bad.join(' · '));
  else pass(id, `${label} — doi chung duong xanh + ${mutants.length} mutant do dung ve`);
}

const CMDS = () => suiteCommands(readFileSync(CONFIG, 'utf8')).cmds;

// Nhánh lỗi dùng chung của các bộ kiểm đọc settings/config. Khai MỘT chỗ, ghép vào
// mọi ca có nhánh ấy. GIỚI HẠN ĐÃ KHAI: việc GHÉP ĐỦ là do người viết giữ, không có
// lưới nào canh. S4-r4 tôi từng dựng một lưới tự-khai-lời-báo để canh chỗ này; nó hứa
// «mọi lời báo lỗi» — một phủ định phổ quát trên văn xuôi mã nguồn, KHÔNG thuộc loại
// chứng được — và bản thân nó xanh mà chưa từng chạy. Owner cắt nó ở S4-r5: giữ phép
// thử ngược CỤ THỂ làm việc thật, bỏ lời hứa giữ không nổi.
const M_CONFIG_KHONG_DOC = ['m-branch-config-khong-doc-duoc',
  (s, c) => [s, c.replace(/^(\s*)suite_keys:/m, '$1suite_keysZZ:')],
  'khong doc duoc feature_loop.suite_keys'];
const M_KHOA_KHONG_GIAI = ['m-branch-khoa-khong-giai-duoc', (s, c) => {
  // Thụt lề là TRÌNH BÀY của YAML, không phải nghĩa; config.yaml là file SỐNG do hồ sơ
  // khác sửa, thụt lại danh sách là thao tác hợp lệ. Suy thụt lề từ chính dòng khớp.
  const lines = c.split('\n');
  let last = -1, ind = '    ';
  for (let i = 0; i < lines.length; i++) {
    const mm = lines[i].match(/^(\s*)- executors\./);
    if (mm) { last = i; ind = mm[1]; }
  }
  if (last < 0) return [s, c];
  lines.splice(last + 1, 0, `${ind}- executors.test.khoa-khong-ton-tai-zzz`);
  return [s, lines.join('\n')];
}, 'khong giai duoc suite_key'];
const M_ALLOW_RONG = ['m-branch-allow-rong',
  (s, c) => { s.permissions.allow = []; return [s, c]; },
  'rong hoac vang'];

runObj('LM1', 'song anh permissions.allow <-> feature_loop.suite_keys', checkBijection, [
  // Bỏ ĐÚNG entry ứng với lệnh đầu của config, không bỏ phần tử đầu của mảng: hai
  // thứ tự (mảng JSON và danh sách khoá trong YAML) độc lập nhau, giả định chúng
  // khớp là ghim thước vào thứ SẼ ĐỔI — sắp lại suite_keys là việc hợp lệ và sẽ
  // sinh ĐỎ GIẢ.
  ['m1-bo-mot-lenh', (s, c) => {
    const t = CMDS()[0];
    s.permissions.allow = s.permissions.allow.filter(e => (PERM_RULE.exec(e) || [])[1] !== t);
    return [s, c];
  }, `THIEU lenh trong permissions.allow: "${CMDS()[0]}"`],
  ['m2-them-lenh-la', (s, c) => { s.permissions.allow.push('Bash(echo khong-thuoc-suite)'); return [s, c]; },
    'THUA lenh trong permissions.allow: "echo khong-thuoc-suite"'],
  // m3 bẻ ĐẦU KIA (config) — chứng minh phép đo đọc CẢ HAI vật, không chỉ settings.
  // Khoá chèn và chuỗi kỳ vọng SUY TỪ CONFIG lúc chạy: ghim cứng tên khoá hay giá
  // trị của nó là ghim vào thứ SẼ ĐỔI — đổi lệnh coverage-lint (việc hợp lệ, không
  // đụng ô này) sẽ làm ca đỏ vì HẠ TẦNG chứ không vì vật (vấp thật S4-r1).
  ['m3-them-suite-key-o-config', (s2, c) => {
    const names = [...c.matchAll(/^\s*([a-z_0-9]+):\s*"?(node |bash )/gm)].map(m => m[1]);
    const inSuite = suiteCommands(c).keys;
    const spare = names.flatMap(n => ['executors.script.' + n, 'executors.test.' + n])
      .find(k => !inSuite.includes(k) && resolveConfigKey(c, k) !== null);
    if (!spare) return [s2, c];                      // không có khoá dư → mutant no-op, runner kêu
    const lines = c.split('\n');
    let last = -1;
    let ind = '    ';
    for (let i = 0; i < lines.length; i++) {
      const mm = lines[i].match(/^(\s*)- executors\./);
      if (mm) { last = i; ind = mm[1]; }
    }
    lines.splice(last + 1, 0, `${ind}- ` + spare);
    return [s2, lines.join('\n')];
  }, 'THIEU lenh trong permissions.allow'],
  ['m4-lech-mot-ky-tu', (s, c) => {
    const t = CMDS()[0];
    const i = s.permissions.allow.findIndex(e => (PERM_RULE.exec(e) || [])[1] === t);
    if (i >= 0) s.permissions.allow[i] = `Bash(${t}X)`;
    return [s, c];
  }, ['THIEU lenh', 'THUA lenh']],
  ['m5-nhan-doi-mot-entry', (s, c) => { s.permissions.allow.push(s.permissions.allow[0]); return [s, c]; },
    'TRUNG LAP'],
  M_CONFIG_KHONG_DOC, M_KHOA_KHONG_GIAI,
]);

runObj('LM2', 'khong entry cho-phep nao chua ky tu *', checkNoStar, [
  ['m1-them-glob-ho-lenh', (s, c) => { s.permissions.allow.push('Bash(bash *)'); return [s, c]; }, 'Bash(bash *)'],
  ['m2-doi-entry-thanh-glob', (s, c) => { s.permissions.allow[0] = s.permissions.allow[0].replace(')', ' *)'); return [s, c]; }, 'chua ky tu *'],
  ['m3-them-glob-tron', (s, c) => { s.permissions.allow.push('Bash(*)'); return [s, c]; }, 'Bash(*)'],
  M_ALLOW_RONG,
]);

// Ba mối nối hợp đồng→bộ ca, MỘT khuôn guard: đứt mối nào thì ca của mối đó đỏ có tên.
const MOI_NOI = [['LM8', () => CHO_SAI, 'danh sach cho-sai tu AC-8'],
                 ['LM5', () => SCAN_DIRS, 'pham vi "mot cho" tu AC-5'],
                 ['LM8b', () => PHAM_VI_VAN_PHAM, 'pham vi "mot cho" tu AC-8']];
for (const [id, val, ten] of MOI_NOI)
  if (want(id) && !val().length) fail(id, `khong rut duoc ${ten} trong ${path.relative(ROOT, CONTRACT)} — moi noi hop dong->bo ca dut`);
// Chiều đỏ cho chính ba guard trên, ĐI QUA cùng bộ rút mà chiều xanh dùng: bullet không
// tồn tại phải cho RỖNG. Nếu bộ rút trả bừa thì guard không đời nào bắn, và cả ba mối
// nối thành lời khai suông.
for (const [id] of MOI_NOI) {
  if (!want(id)) continue;
  const thua = [...phamViTuHopDong(99), ...backtickWords(bulletAC(99))];
  if (thua.length) fail(id, `bo rut hop dong tra BUA tren bullet khong ton tai (AC-99): ${thua.join(', ')} — guard moi noi khong the bao gio ban`);
}
runObj('LM8', 'van pham luat quyen + entry nam dung cho', checkGrammar, [
  ['m1-entry-tran-khong-boc', (s, c) => { s.permissions.allow[0] = CMDS()[0]; return [s, c]; },
    'KHONG dung van pham Bash(<lenh>)'],
  ...CHO_SAI.map(k => [`m2-dat-nham-duoi-${k}`, (s, c) => {
    const e = s.permissions.allow.shift();
    (s.permissions[k] ||= []).push(e);
    return [s, c];
  }, `nam duoi permissions.${k}`]),
  ['m3-doi-ten-boc', (s, c) => { s.permissions.allow[0] = s.permissions.allow[0].replace(/^Bash\(/, 'Shell('); return [s, c]; },
    'KHONG dung van pham Bash(<lenh>)'],
  M_ALLOW_RONG, M_CONFIG_KHONG_DOC, M_KHOA_KHONG_GIAI,
]);

if (want('LM5')) {
  const FL = path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
  const listFiles = () => SCAN_DIRS.flatMap(d => walkFiles(path.join(ROOT, d)));
  const readAt = f => { try { return readFileSync(f, 'utf8'); } catch { return null; } };
  const src = readAt(FL) || '';
  const chk = t => checkFallback(t, listFiles, readAt);
  const clean = chk(src);
  const base = flat(src);
  const cleanFlat = clean.length ? [] : chk(base);
  if (!SKIP_PHRASE) fail('LM5', `khong rut duoc cau bao loi co dinh tu NGUON ENGINE (${path.relative(ROOT, ENGINE)}) — moi noi VIET->DOC dut, luat khong con gi de doi chieu`);
  else if (clean.length) fail('LM5', `doi chung duong DO — ban nguyen ven phai XANH: ${clean.join(' · ')}`);
  else if (cleanFlat.length) fail('LM5', `doi chung duong DO tren BAN PHANG: ${cleanFlat.join(' · ')}`);
  else {
    const bad = [];
    // MỘT VẾ → MỘT MUTANT, duyệt bảng nên không thể quên vế nào
    for (const c of FALLBACK_CLAUSES) {
      const mutated = breakClause(base, c);
      if (mutated === base) { bad.push(`${c.id}: lenh tiem KHONG doi duoc dong nao — bieu thuc /${c.re.source}/ khong khop cho nao trong vat`); continue; }
      const errs = chk(mutated);
      if (!errs.some(e => e.startsWith(c.id + ':'))) bad.push(`${c.id}: be vat ma khong do dung ve (thu duoc: ${errs.join(' · ') || 'KHONG LOI NAO'})`);
    }
    // vế thứ bảy — CHIỀU ĐỎ NGOÀI file đã biết: mốc neo mọc ở file THỨ HAI
    const THIRD = path.join(ROOT, 'skills', 'acceptance', 'SKILL.md');
    const readPlus = f => (f === THIRD ? (readAt(f) || '') + '\n<<<' + FALLBACK_ANCHOR + '\n' : readAt(f));
    const branchMuts = blockBranchMutants(FALLBACK_ANCHOR);
    for (const [bName, bMut, bNeedle] of branchMuts) {
      const bMutated = bMut(base);
      if (bMutated === base) { bad.push(`${bName}: lenh tiem KHONG doi duoc dong nao`); continue; }
      const bErrs = chk(bMutated);
      if (!bErrs.some(e => e.includes(bNeedle))) bad.push(`${bName}: be nhanh ma khong do dung loi "${bNeedle}"`);
    }
    const e7 = checkFallback(src, listFiles, readPlus);
    if (!e7.some(x => x.startsWith('ve4:') && x.includes('skills/acceptance/SKILL.md')))
      bad.push('m-moc-neo-thu-hai: moc neo moc o file THU HAI ma khong do');
    if (bad.length) fail('LM5', bad.join(' · '));
    else pass('LM5', `duong thoai hoa: ${FALLBACK_CLAUSES.length} ve roi + 1 quan he dem duoc + ${FALLBACK_CLAUSES.length + 1 + branchMuts.length} mutant`);
  }
}

// Một VẾ → một MUTANT, ép bằng cấu trúc: runner tự duyệt bảng vế, nên không thể
// «quên» mutant cho một điều kiện, và số mutant luôn bằng số vế.
function runClauses(id, label, file, check, clauses, extra = [], probes = []) {
  if (!want(id)) return;
  let src;
  try { src = readFileSync(file, 'utf8'); } catch (e) { return fail(id, `khong doc duoc vat: ${e.message}`); }
  const clean = check(src);
  if (clean.length) return fail(id, `doi chung duong DO — ban nguyen ven phai XANH: ${clean.join(' · ')}`);
  // Bẻ trên BẢN PHẲNG. Vật là văn xuôi nên một cụm bị NGẮT DÒNG là chuyện thường, và
  // `split(bait)` trên bản thô sẽ không thấy nó → mutant thành vô hiệu chỉ vì chỗ
  // xuống dòng (vấp thật: sửa khối SKILL.md xong, vế «lệnh chạy TUẦN TỰ» rơi qua hai
  // dòng). Bộ kiểm vốn đã gộp khoảng trắng nên bản phẳng là input tương đương — kèm
  // ĐỐI CHỨNG DƯƠNG riêng cho nó, để mutant không bao giờ đỏ vì phép làm phẳng.
  const base = flat(src);
  const cleanFlat = check(base);
  if (cleanFlat.length) return fail(id, `doi chung duong DO tren BAN PHANG: ${cleanFlat.join(' · ')}`);
  const bad = [];
  for (const c of clauses) {
    const mutated = breakClause(base, c);
    if (mutated === base) { bad.push(`${c.id}: lenh tiem KHONG doi duoc dong nao — bieu thuc /${c.re.source}/ khong khop cho nao trong vat`); continue; }
    const errs = check(mutated);
    if (!errs.some(e => e.startsWith(c.id + ':'))) bad.push(`${c.id}: be vat ma khong do dung ve (thu duoc: ${errs.join(' · ') || 'KHONG LOI NAO'})`);
  }
  for (const [name, mutate, needle] of extra) {
    const mutated = mutate(base);
    if (mutated === base) { bad.push(`${name}: lenh tiem KHONG doi duoc dong nao`); continue; }
    const errs = check(mutated);
    if (!errs.some(e => e.includes(needle))) bad.push(`${name}: khong do dung ve "${needle}" (thu duoc: ${errs.join(' · ') || 'KHONG LOI NAO'})`);
  }
  // PHÉP DÒ: mutant không bẻ văn bản mà bẻ TẬP FILE (vd mốc neo mọc ở file KHÁC).
  for (const [name, run, needle] of probes) {
    const errs = run(base);
    if (!errs.some(e => e.includes(needle))) bad.push(`${name}: khong do dung ve "${needle}" (thu duoc: ${errs.join(' · ') || 'KHONG LOI NAO'})`);
  }
  if (bad.length) fail(id, bad.join(' · '));
  else pass(id, `${label} — doi chung duong xanh + ${clauses.length + extra.length + probes.length} mutant do dung ve`);
}


runClauses('LM4', 'khuon khoi tao khuyen kho tieu thu — moi ve mot dieu kien',
  path.join(ROOT, 'commands', 'acceptance-init.md'), checkAdvice, ADVICE_CLAUSES,
  blockBranchMutants(ADVICE_ANCHOR));

runClauses('LM6', 'tai lieu van hanh — do TRONG khoi co moc neo, moi ve mot dieu kien',
  path.join(ROOT, 'GUIDE.md'), checkGuide, GUIDE_CLAUSES, blockBranchMutants(GUIDE_ANCHOR));

const grammarFiles = dirs => dirs.flatMap(d => { try { return walkFiles(path.join(ROOT, d)); } catch { return []; } });
const readAtG = f => { try { return readFileSync(f, 'utf8'); } catch { return null; } };
const OTHER_FILE = grammarFiles(['lib'])[0];
runClauses('LM8b', 'khuon van pham song dung MOT cho tren TRON pham vi hop dong khai',
  SELF, t => checkGrammarAnchor(t, grammarFiles, readAtG),
  GRAMMAR_CLAUSES, blockBranchMutants(GRAMMAR_ANCHOR),
  [['m-moc-neo-moc-o-FILE-KHAC', base => checkGrammarAnchor(base, grammarFiles,
      f => f === OTHER_FILE
        ? `${readAtG(f) || ''}\n// <<<${GRAMMAR_ANCHOR}\n// khuon KHAC: /^(Bash|Shell)\\((.+)\\)$/\n// ${GRAMMAR_ANCHOR}>>>\n`
        : readAtG(f)),
    path.relative(ROOT, OTHER_FILE)]]);

// LM_CASES nêu id không tồn tại → không được xanh im lặng
const unknown = only.filter(id => !ran.has(id));
if (unknown.length) { console.log(`FAIL: [LM_CASES] khong khop ca nao: ${unknown.join(',')}`); failures++; }
if (failures) { console.log(`lan-may-classifier: ${failures} ca do`); process.exit(1); }
