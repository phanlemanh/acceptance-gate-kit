// tests/scripts/danh-tinh.test.mjs — K2 của gom-duc-ket-2-10-0 (AC-4).
// Danh tính hết trạm thu phí: suy được nấc nào thì GHI THẲNG, người sửa bằng một câu;
// chỉ ca CẠN mới hỏi. Bỏ CẢNH BÁO «không có trong signoff.approvers». Nấc mới: tên ở
// cổng trước của CÙNG hồ sơ thắng git config khi tác giả commit là cùng người.
//   DT1 khối luật (3 bản byte-đúng) nói GHI THẲNG, không còn nhánh chờ
//   DT2 thân approve/signoff bỏ câu cảnh báo approvers, có câu «một câu»
//   DT3 signoff có nấc cổng trước (approved_by + tác giả commit)
//   DT4 mutant: tiêm lại nhánh chờ / câu cảnh báo vào BẢN SAO → chính bộ kiểm đỏ đích danh
//   DT5 neo P191/P194: «Enter xác nhận» chuyển từ neo DƯƠNG sang neo ÂM
//   DT_CASES=DT4 node tests/scripts/danh-tinh.test.mjs
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const LAW = path.join(ROOT, 'skills', 'acceptance', 'references', 'human-facing-language.md');
const SITES = ['commands/approve.md', 'commands/signoff.md'];
const SUITE = path.join(ROOT, 'tests', 'plugins', 'run-tests.sh');
const MARK = 'IDENTITY-ECHO-RULE';

const ALL_IDS = ['DT1', 'DT2', 'DT3', 'DT4', 'DT5'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.DT_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => only.length === 0 || only.includes(id);
let failures = 0;
const pass = (id, m) => console.log(`  PASS: ${id} — ${m}`);
const fail = (id, m) => { console.log(`  FAIL: ${id} — ${m}`); failures++; };

// BỘ KIỂM — một bản duy nhất, chạy trên bản lành VÀ trên mọi bản sao mutant (DT4).
// Trả danh sách lỗi có TÊN; rỗng = đạt.
const blockOf = txt => {
  const m = txt.match(new RegExp(`<!-- <<<${MARK} -->\\n([\\s\\S]*?)\\n<!-- ${MARK}>>> -->`));
  return m ? m[1].trim() : null;
};
function kiem(texts) {
  const errs = [];
  const law = blockOf(texts[LAW]);
  if (!law) { errs.push('khối luật thiếu marker'); return errs; }
  if (!/GHI THẲNG/.test(law)) errs.push('khối luật thiếu vế ghi-thẳng');
  if (/Enter xác nhận|chờ xác nhận/.test(law)) errs.push('nhánh chờ vẫn còn trong khối luật');
  if (!/\(từ <nguồn suy>\)/.test(law)) errs.push('khối luật thiếu khuôn nguồn-suy');
  if (!/CẠN/.test(law)) errs.push('khối luật không nêu ca CẠN là ca duy nhất được hỏi');
  for (const rel of SITES) {
    const t = texts[path.join(ROOT, rel)];
    const b = blockOf(t);
    if (b === null) { errs.push(`bản chép thiếu khối: ${rel}`); continue; }
    if (b !== law) errs.push(`bản chép TRÔI khỏi nguồn: ${rel}`);
    // QUAN HỆ, không phải chuỗi-có-mặt: câu mới VẪN nhắc `signoff.approvers` (nó là nấc
    // cuối) — điều phải đúng là MỌI lần chữ «CẢNH BÁO» xuất hiện đều nằm trong «KHÔNG
    // CẢNH BÁO». Bản đầu của chính ca này so chuỗi và đỏ oan trên câu đã sửa đúng.
    for (const m of t.matchAll(/\*\*(KHÔNG )?CẢNH BÁO\*\*/g)) if (!m[1]) errs.push(`còn lệnh CẢNH BÁO approvers: ${rel}`);
    if (!/một câu/.test(t)) errs.push(`thân không nói người sửa danh tính bằng một câu: ${rel}`);
  }
  const sg = texts[path.join(ROOT, 'commands/signoff.md')];
  if (!/cổng trước/.test(sg) || !/approved_by/.test(sg)) errs.push('signoff thiếu nấc cổng-trước (approved_by)');
  return errs;
}

const read = () => Object.fromEntries([LAW, ...SITES.map(r => path.join(ROOT, r))].map(p => [p, readFileSync(p, 'utf8')]));
const texts = read();

if (want('DT1')) {
  const id = 'DT1'; const before = failures;
  const law = blockOf(texts[LAW]);
  if (!law) fail(id, 'không rút được khối luật');
  else {
    if (!/GHI THẲNG/.test(law)) fail(id, 'khối luật không nói GHI THẲNG');
    if (/Enter xác nhận|chờ xác nhận/.test(law)) fail(id, `khối luật còn nhánh chờ: ${law.slice(0, 120)}`);
    for (const rel of SITES) {
      const b = blockOf(texts[path.join(ROOT, rel)]);
      if (b !== law) fail(id, `bản chép không byte-đúng: ${rel}`);
    }
  }
  if (failures === before) pass(id, 'khối luật: ghi thẳng ở mọi nấc có tên, không nhánh chờ; ba bản byte-đúng');
}

if (want('DT2')) {
  const id = 'DT2'; const before = failures;
  for (const rel of SITES) {
    const t = texts[path.join(ROOT, rel)];
    for (const m of t.matchAll(/\*\*(KHÔNG )?CẢNH BÁO\*\*/g)) if (!m[1]) fail(id, `còn lệnh CẢNH BÁO approvers: ${rel}`);
    if (!/\*\*KHÔNG CẢNH BÁO\*\*/.test(t)) fail(id, `thân không nói rõ KHÔNG cảnh báo (nấc approvers vẫn phải còn): ${rel}`);
    if (!/một câu/.test(t)) fail(id, `thiếu câu «sửa bằng một câu»: ${rel}`);
  }
  if (failures === before) pass(id, 'hai thân lệnh bỏ cảnh báo approvers, giữ đường sửa một câu');
}

if (want('DT3')) {
  const id = 'DT3'; const before = failures;
  const sg = texts[path.join(ROOT, 'commands/signoff.md')];
  const i = sg.indexOf('cổng trước');
  const seg = i < 0 ? '' : sg.slice(Math.max(0, i - 400), i + 600);
  if (!seg) fail(id, 'signoff không có nấc «cổng trước»');
  else {
    if (!/approved_by/.test(seg)) fail(id, 'nấc cổng trước không nêu approved_by');
    if (!/user\.name/.test(seg)) fail(id, 'nấc cổng trước không nêu điều kiện cùng người (git user.name)');
    if (!/tác giả commit|người ghi/.test(seg)) fail(id, 'nấc cổng trước không nêu tác giả commit');
  }
  if (failures === before) pass(id, 'signoff có nấc cổng-trước với điều kiện cùng-người');
}

if (want('DT4')) {
  const id = 'DT4'; const before = failures;
  if (kiem(texts).length) fail(id, `bản LÀNH đã đỏ (đối chứng dương hỏng): ${kiem(texts).join(' · ')}`);
  // mutant 1: tiêm lại nhánh chờ vào khối luật của BẢN SAO (cả ba bản, giữ byte-đúng)
  const m1 = { ...texts };
  for (const k of Object.keys(m1)) m1[k] = m1[k].replace(/(TRƯỚC khi ghi\.|Chỉ ca CẠN mới hỏi\.)/, '$1 Enter xác nhận.');
  const e1 = kiem(m1);
  if (!e1.some(e => /nhánh chờ/.test(e))) fail(id, `mutant tiêm nhánh chờ không bị bắt (lỗi báo: ${e1.join(' · ') || 'không lỗi nào'})`);
  // mutant 2: tiêm lại câu cảnh báo approvers vào một thân lệnh
  const m2 = { ...texts };
  const k2 = path.join(ROOT, 'commands/signoff.md');
  m2[k2] = m2[k2] + '\n**CẢNH BÁO** khi tên sắp ghi không có trong `signoff.approvers` — nêu cảnh báo nhẹ.\n';
  const e2 = kiem(m2);
  if (!e2.some(e => /CẢNH BÁO approvers/i.test(e))) fail(id, `mutant tiêm cảnh báo approvers không bị bắt (${e2.join(' · ') || 'không lỗi nào'})`);
  // mutant 3: một bản chép trôi khỏi nguồn
  const m3 = { ...texts };
  const k3 = path.join(ROOT, 'commands/approve.md');
  m3[k3] = m3[k3].replace('GHI THẲNG', 'ghi thang');
  if (!kiem(m3).some(e => /TRÔI khỏi nguồn/.test(e))) fail(id, 'mutant làm bản chép trôi không bị bắt');
  if (failures === before) pass(id, 'ba mutant (nhánh chờ · cảnh báo approvers · bản chép trôi) đều bị bắt đích danh');
}

if (want('DT5')) {
  const id = 'DT5'; const before = failures;
  const sh = readFileSync(SUITE, 'utf8');
  // Loại dòng CHÚ THÍCH: chữ trong comment không phải neo — bản đầu của ca này đỏ oan vì
  // chính câu giải thích «neo cũ» nằm ngay trên mảng.
  const noCmt = s => s.split('\n').filter(l => !/^\s*(\/\/|#)/.test(l)).join('\n');
  const anchors = noCmt((sh.match(/const anchors = \[([\s\S]*?)\];/) || [])[1] || '');
  const needles = noCmt((sh.match(/GATE_NEEDLES = \[([\s\S]*?)\]/) || [])[1] || '');
  const bodyAm = noCmt((sh.match(/BODY_AM = \[([\s\S]*?)\]/) || [])[1] || '');
  if (!anchors) fail(id, 'không rút được mảng anchors của P191');
  else {
    if (/Enter xác nhận/.test(anchors)) fail(id, 'P191 vẫn ghim «Enter xác nhận» làm neo DƯƠNG');
    if (!/GHI THẲNG/.test(anchors)) fail(id, 'P191 chưa có neo dương «GHI THẲNG»');
  }
  if (/Enter xác nhận/.test(needles)) fail(id, 'P194 GATE_NEEDLES vẫn đòi «Enter xác nhận» có mặt trong thân lệnh');
  if (!/Enter xác nhận/.test(bodyAm)) fail(id, 'P194 chưa chuyển «Enter xác nhận» thành neo ÂM (BODY_AM)');
  const cross = (sh.match(/CROSSCHECK = \{([\s\S]*?)\}/) || [])[1] || '';
  if (!/KHÔNG CẢNH BÁO/.test(cross)) fail(id, 'P194 CROSSCHECK vẫn ghim câu cảnh báo approvers đời cũ');
  if (failures === before) pass(id, 'neo P191/P194: GHI THẲNG là neo dương, Enter-xác-nhận là neo âm');
}

console.log(failures === 0 ? `danh-tinh: OK (${ALL_IDS.filter(want).join(', ')})` : `danh-tinh: ${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
