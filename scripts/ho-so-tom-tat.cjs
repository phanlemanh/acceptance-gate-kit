'use strict';
// ho-so-tom-tat.cjs — đọc MỘT hồ sơ `_acceptance/<slug>/` thành dải tóm tắt (hồ sơ trang-ho-so-mot-viec,
// hàng X2). Hai bộ vẽ gọi CÙNG hàm này: trang hồ sơ (`evidence-page.js`) và khối dữ liệu lộ trình bản 2
// (`lo-trinh.mjs`) — con số trên trang và trong khối không trôi được khỏi nhau vì không có bộ đọc thứ hai.
//
// Hàm THUẦN với cây tệp: chỉ đọc tệp của hồ sơ, không git, không mạng, không giờ chạy, không ngẫu nhiên
// — cùng vật ra cùng kết quả. Kit VẼ, không SOẠN: mọi giá trị là chữ/số rút từ một tệp có tên; tệp vắng
// thì giá trị `null` và tên tệp vào `thieu` để bên vẽ in «chưa có — <tệp>». Không có ô «số lần gọi
// người»: chưa có máy đếm, thêm ô là máy soạn số.
const fs = require('fs');
const path = require('path');
const LIB = path.join(__dirname, '..', 'lib');
const { section, contentLines } = require(path.join(LIB, 'md-section.cjs'));
const { parseACBlock } = require(path.join(LIB, 'ac-line.cjs'));
const { parseEvals } = require(path.join(LIB, 'eval-yaml.cjs'));
const { UAT_THRESHOLD_HEADING, bulletOf } = require(path.join(LIB, 'nguong-o-co-hoi.cjs'));

// Tiêu chí của hợp đồng — MỘT bộ đọc cho cả trang (bảng eval lẫn mục «Đã hứa») và dải: qua parseACBlock của
// lib/ac-line.cjs, như thẻ và lint (hồ sơ cong-nguoi-doc-du-nguon, ca CN13 tiêm đúng dòng require trên).
const tieuChiCua = contract => (contract == null ? [] : parseACBlock(contract)).map(a => ({ id: a.id, cau: a.gwt }));

// Khuôn dải — thứ tự là thứ tự trên trang. Khối dữ liệu lộ trình rút đúng hai danh sách này.
const O_MOI_NGUOI = ['da_giao', 'vi_sao', 'trang_thai', 'ngay', 'production', 'do_gi', 'ket_qua', 'chua_lam', 'ai_quyet'];
const O_CHU_KHO = ['tieu_chi', 'phep_do', 'luot_cham', 'token', 'quyet_dinh_may', 'quyet_dinh_nguoi', 'ma'];

// Bỏ ĐÚNG MỘT cặp «» khi cặp ấy bao trọn câu: ký tự đầu là «, ký tự cuối là », và dấu « đầu tiên đóng
// đúng ở ký tự cuối (đếm độ sâu). `«A» và «B»` bắt đầu và kết thúc bằng dấu nhưng không bọc — giữ nguyên.
function boNgoacNgoai(s) {
  const t = String(s == null ? '' : s);
  if (t.length < 2 || t[0] !== '«' || t[t.length - 1] !== '»') return t;
  let sau = 0;
  for (let i = 0; i < t.length; i++) {
    if (t[i] === '«') sau += 1;
    else if (t[i] === '»') { sau -= 1; if (sau === 0) return i === t.length - 1 ? t.slice(1, -1) : t; }
  }
  return t;
}

const doc = p => { try { return fs.readFileSync(p, 'utf8'); } catch (_) { return null; } };
const chu = v => (v == null ? '' : String(v)).trim();
// Frontmatter tối giản: `khoá: giá trị`, bỏ chú thích ` # …` cuối dòng và một cặp nháy bao ngoài.
function fm(t) {
  const m = String(t || '').match(/^---\r?\n([\s\S]*?)\r?\n---/); const o = {};
  if (!m) return o;
  for (const l of m[1].split('\n')) {
    const mm = l.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/); if (!mm) continue;
    let v = mm[2].replace(/\s+#\s.*$/, '').trim();
    if (/^(["']).*\1$/.test(v)) v = v.slice(1, -1);
    o[mm[1]] = v;
  }
  return o;
}
const ngayCua = s => { const m = chu(s).match(/(?<!\d)(\d{4}-\d{2}-\d{2})(?!\d)/); return m ? m[1] : null; };
// Chữ trơn cho dải: bỏ dấu nhấn markdown (`**`, backtick) — bản chiếu ngoài kho không vẽ markdown.
const tron = s => (s == null ? s : String(s).replace(/\*\*(.+?)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1'));

// Luật người/máy cho một dòng sổ — một hàm cho dải, dòng thời gian và khối. NGƯỜI khi dòng có
// `decided_by` hoặc `by` khác rỗng, hoặc `type` là `seal` (Cổng Phạm vi ký) hay `thuc-te` (người ghi
// quan sát production). Còn lại là MÁY.
const laNguoi = d => !!(chu(d.decided_by) || chu(d.by)) || d.type === 'seal' || d.type === 'thuc-te';

function docSo(text) {
  const dong = []; let hong = 0;
  String(text || '').split('\n').forEach((l, i) => {
    if (!l.trim()) return;
    try { const o = JSON.parse(l); if (o && typeof o === 'object' && !Array.isArray(o)) dong.push({ ...o, _dong: i + 1 }); else hong += 1; } catch (_) { hong += 1; }
  });
  return { dong, hong };
}

// usage-report.md: mỗi khối một tiêu đề `### <tên> — <mã lượt> (<n> agent, <số> out-tok)`. Lượt chấm =
// khối có tên bắt đầu bằng «S4». Tiêu đề không khớp khuôn bị đếm vào `khong_doc`, không đoán.
function docUsage(text) {
  const khoi = []; let khong_doc = 0;
  for (const l of String(text || '').split('\n')) {
    if (!/^###\s/.test(l)) continue;
    const m = l.match(/^###\s+(.+?)\s+—\s+\S+\s+\((\d+)\s+agent,\s+([\d,.]+)\s+out-tok\)\s*$/);
    if (!m) { khong_doc += 1; continue; }
    khoi.push({ ten: m[1], tac_tu: Number(m[2]), token: Number(m[3].replace(/[,.]/g, '')) });
  }
  return { khoi, khong_doc };
}

// «Vì sao»: đoạn lý do đầu tiên của mục «Vấn đề & ai gặp» ở ô cơ hội. Bỏ qua đoạn trích (`>`), đoạn
// «Mở từ hàng…», đoạn chỉ là câu giao, đoạn bắt đầu bằng dòng neo `Gốc:`; đoạn dạng `--mo-o`
// «Vì sao: Gốc: <con trỏ> — <lý do>» lấy phần sau « — » đầu tiên. Vắng → đoạn đầu `## Context` của hợp đồng.
function doanCua(lines) {
  const doan = []; let mo = false;
  for (const l of lines) {
    if (!l.trim() || /^\s*#{1,6}\s/.test(l)) { mo = false; continue; }
    if (mo) doan[doan.length - 1] += ' ' + l.trim(); else { doan.push(l.trim()); mo = true; }
  }
  return doan;
}
function viSaoTu(opp, cauGiao) {
  const cg = boNgoacNgoai(chu(cauGiao));
  for (const d of doanCua(section(opp, 'Vấn đề & ai gặp'))) {
    if (d.startsWith('>') || /^Mở từ hàng\b/.test(d) || d.startsWith('Gốc:')) continue;
    if (boNgoacNgoai(d) === cg) continue;
    const mo = d.match(/^Vì sao:\s*Gốc:\s*\S+(?:\s+[^—]*?)?\s+—\s+(.+)$/);
    if (mo) return mo[1].trim();
    if (/^Vì sao:\s*/.test(d) && !/Gốc:/.test(d)) return d.replace(/^Vì sao:\s*/, '');
    return d;
  }
  return null;
}

function ngaySo(o) { return Object.values(o).filter(Boolean).sort().pop() || null; }

// dir = thư mục hồ sơ. opts.trangThai = chữ trạng thái do bên gọi đưa (trang: ô của bản đồ sản phẩm;
// khối: chữ của hàng) — mô-đun không tự phân ô để khỏi thành bộ phân loại thứ hai.
function tomTatHoSo(dir, opts = {}) {
  const slug = path.basename(dir);
  const T = {
    contract: doc(path.join(dir, 'contract.md')), opp: doc(path.join(dir, 'opportunity.md')),
    so: doc(path.join(dir, 'decisions.jsonl')), usage: doc(path.join(dir, 'usage-report.md')),
    report: doc(path.join(dir, 'evidence-report.md')), uat: doc(path.join(dir, 'uat-session.md')),
    evals: doc(path.join(dir, 'evals.yaml')),
  };
  const cfm = fm(T.contract), ofm = fm(T.opp), rfm = fm(T.report), ufm = fm(T.uat);
  const thieu = []; const nguon = {};
  const can = (k, tep, co) => { nguon[k] = tep; if (!co && !thieu.includes(tep)) thieu.push(tep); return co; };

  const so = T.so != null ? docSo(T.so) : null;
  const usage = T.usage != null ? docUsage(T.usage) : null;
  const acs = tieuChiCua(T.contract);
  const oos = T.contract != null ? contentLines(section(T.contract, 'Out of scope')) : [];
  const knownRaw = T.report != null ? contentLines(section(T.report, 'Known limits')) : [];
  const known = knownRaw.filter(l => !/^(none|không có|không)\b\.?$/i.test(l.trim()));
  const thucTe = so ? so.dong.filter(d => d.type === 'thuc-te') : [];
  const tt = thucTe[thucTe.length - 1] || null;
  const designDoc = chu(cfm.design_doc);

  const moi = {};
  const cauGiao = chu(cfm.feature) || chu(ofm.feature);
  moi.da_giao = can('da_giao', T.contract != null ? 'contract.md' : 'opportunity.md', cauGiao) ? boNgoacNgoai(cauGiao) : null;
  let vs = T.opp != null ? viSaoTu(T.opp, cauGiao) : null;
  if (vs) nguon.vi_sao = 'opportunity.md';
  else {
    const ctx = T.contract != null ? doanCua(section(T.contract, 'Context'))[0] : null;
    vs = ctx || null; can('vi_sao', ctx ? 'contract.md' : 'opportunity.md', vs);
  }
  moi.vi_sao = vs;
  moi.trang_thai = can('trang_thai', 'contract.md', chu(opts.trangThai) || chu(cfm.status)) ? (chu(opts.trangThai) || chu(cfm.status)) : null;
  moi.ngay = ngaySo({ tt: tt && ngayCua(tt.at), ky: ngayCua(rfm.human_signoff), duyet: ngayCua(cfm.approved_at), dang: ngayCua(ofm.decided_at) });
  nguon.ngay = 'contract.md';
  if (so == null) { moi.production = null; can('production', 'decisions.jsonl', false); }
  else {
    nguon.production = 'decisions.jsonl';
    moi.production = tt ? `đã chạy ở production — bản dựng ${chu(tt.build_sha).slice(0, 7)}, quan sát ${ngayCua(tt.at) || chu(tt.at)}, ${chu(tt.by)}` : 'chưa ghi quan sát production';
  }
  if (T.opp == null) { moi.do_gi = null; can('do_gi', 'opportunity.md', false); }
  else {
    nguon.do_gi = 'opportunity.md';
    const b = {}; for (const l of section(T.opp, UAT_THRESHOLD_HEADING)) { const x = bulletOf(l); if (x) b[x.label] = x.value; }
    const hoi = chu(b['Câu hỏi phép đo trả lời']); const han = chu(b.Timebox);
    moi.do_gi = hoi ? `${hoi}${han ? ` — hạn ${han}` : ''}` : 'chưa khai ngưỡng';
  }
  nguon.ket_qua = 'uat-session.md';
  if (T.uat == null) moi.ket_qua = 'chưa đo';
  else {
    const hang = section(T.uat, 'Số đo thật đặt cạnh ngưỡng').filter(l => /^\s*\|/.test(l) && !/^[\s|:-]*$/.test(l)).slice(1);
    const song = hang.filter(l => /\|\s*SỐNG\s*\|?\s*$/.test(l)).length;
    moi.ket_qua = `${chu(ufm.verdict) || 'chưa quyết'}${ngayCua(ufm.decided_at) ? ` (${ngayCua(ufm.decided_at)})` : ''}${hang.length ? ` · ${song}/${hang.length} thước SỐNG` : ''}`;
  }
  can('chua_lam', 'contract.md', T.contract != null);
  moi.chua_lam = T.contract != null ? `${oos.length} mục ngoài hợp đồng · ${known.length} giới hạn đã biết` : null;
  const ai = [];
  if (chu(ofm.decided_by)) ai.push(`Cổng Đáng: ${chu(ofm.decided_by)}`);
  if (T.contract != null) ai.push(`Cổng Phạm vi: ${chu(cfm.approved_by) || (chu(cfm.veto_state) === 'mo' ? 'máy đi tiếp, cửa veto mở' : 'chưa duyệt')}`);
  if (T.report != null) {
    const ky = chu(rfm.human_signoff);
    ai.push(`Cổng Bằng chứng: ${ky ? ky.replace(/\s*\d{4}-\d{2}-\d{2}.*$/, '') : (chu(cfm.status) === 'machine-cleared' ? 'máy thông' : 'chưa ký')}`);
  }
  nguon.ai_quyet = 'contract.md';
  moi.ai_quyet = ai.length ? ai.join(' · ') : null;

  const ck = {};
  ck.tieu_chi = can('tieu_chi', 'contract.md', T.contract != null) ? acs.length : null;
  ck.phep_do = can('phep_do', 'evals.yaml', T.evals != null) ? parseEvals(T.evals, ['id']).length : null;
  ck.luot_cham = can('luot_cham', 'usage-report.md', usage != null) ? usage.khoi.filter(k => /^S4\b/.test(k.ten)).length : null;
  ck.token = can('token', 'usage-report.md', usage != null) ? usage.khoi.reduce((a, k) => a + k.token, 0) : null;
  ck.quyet_dinh_may = can('quyet_dinh_may', 'decisions.jsonl', so != null) ? so.dong.filter(d => !laNguoi(d)).length : null;
  ck.quyet_dinh_nguoi = can('quyet_dinh_nguoi', 'decisions.jsonl', so != null) ? so.dong.filter(laNguoi).length : null;
  ck.ma = can('ma', 'evidence-report.md', chu(rfm.verified_commit)) ? chu(rfm.verified_commit) : null;
  if (designDoc) can('design_doc', designDoc, fs.existsSync(path.resolve(dir, '..', '..', designDoc)));

  const chiTiet = {
    slug, cauGiao: moi.da_giao,
    acs,
    oos, known, designDoc: designDoc || null,
    quyetDinh: so ? so.dong.slice().sort((a, b) => (chu(a.at) < chu(b.at) ? -1 : chu(a.at) > chu(b.at) ? 1 : a._dong - b._dong))
      .map(d => ({ id: chu(d.id), at: chu(d.at), loai: chu(d.type), giai_doan: chu(d.stage || (d.gate ? `gate${d.gate}` : '')), nguoi: laNguoi(d), ai: chu(d.decided_by || d.by), cau: chu(d.decision), vi_sao: chu(d.why || d.impact), gia: chu(d.cost_if_wrong) })) : [],
    soHong: so ? so.hong : 0,
    usage: usage ? usage.khoi : [], usageKhongDoc: usage ? usage.khong_doc : 0,
    giao: { ma: ck.ma, ngayKy: ngayCua(rfm.human_signoff), nguoiKy: moi.ai_quyet },
    uatBang: T.uat != null ? section(T.uat, 'Số đo thật đặt cạnh ngưỡng').filter(l => /^\s*\|/.test(l) && !/^[\s|:-]*$/.test(l)) : null,
    nguong: T.opp != null ? section(T.opp, UAT_THRESHOLD_HEADING).map(bulletOf).filter(Boolean) : [],
  };
  for (const k of O_MOI_NGUOI) moi[k] = tron(moi[k]);
  return { dai: { moi_nguoi: moi, chu_kho: ck }, nguon, thieu, chiTiet };
}

module.exports = { O_MOI_NGUOI, O_CHU_KHO, boNgoacNgoai, laNguoi, docSo, docUsage, viSaoTu, tieuChiCua, tomTatHoSo };
