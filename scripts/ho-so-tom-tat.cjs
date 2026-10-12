'use strict';
// ho-so-tom-tat.cjs — đọc MỘT hồ sơ `_acceptance/<slug>/` thành dải tóm tắt (hồ sơ trang-ho-so-mot-viec,
// hàng X2). Hai bộ vẽ gọi CÙNG hàm này: trang hồ sơ (`evidence-page.js`) và khối dữ liệu lộ trình bản 2
// (`lo-trinh.mjs`) — con số trên trang và trong khối không trôi được khỏi nhau vì không có bộ đọc thứ hai.
//
// Hàm THUẦN với cây tệp: chỉ đọc tệp của hồ sơ, không git, không mạng, không giờ chạy, không ngẫu nhiên
// — cùng vật ra cùng kết quả. MỘT ngoại lệ, BẬT THEO LỰA CHỌN của kho: kho khai `production: nhanh:
// <tên>` trong `_acceptance/config.yaml` thì ô production đọc git (mã đã chấm có nằm trên nhánh đó
// chưa) — hồ sơ dai-tom-tat-doc-dung; kho không khai giữ nguyên hành vi và chữ cũ. Kit VẼ, không SOẠN: mọi giá trị là chữ/số rút từ một tệp có tên; tệp vắng
// thì giá trị `null` và tên tệp vào `thieu` để bên vẽ in «chưa có — <tệp>». Không có ô «số lần gọi
// người»: chưa có máy đếm, thêm ô là máy soạn số.
const fs = require('fs');
const { spawnSync } = require('child_process');
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
// Đoạn chọn được là CÂU DẪN («…:», xét sau khi bỏ dấu nhấn) mà ngay sau là danh sách → câu dẫn + các mục
// rút gọn nối « · »; mọi ô cắt theo TRAN_VI_SAO, giữ trọn câu/mục (hồ sơ dai-tom-tat-doc-dung).
// Khối của một mục: đoạn văn, hoặc một gạch danh sách (`-`, `*`, `1.`) — mỗi khối một chuỗi đã nối dòng bọc.
function khoiCua(lines) {
  const k = []; let mo = false;
  for (const l of lines) {
    if (!l.trim() || /^\s*#{1,6}\s/.test(l)) { mo = false; continue; }
    const g = l.match(/^\s*(?:[-*]|\d+[.)])\s+(.*)$/);
    if (g) { k.push({ chu: l.trim(), gach: true, noi: g[1].trim() }); mo = true; continue; }
    // Hàng bảng: mỗi hàng một khối, «mục» là ô đầu (dữ liệu thật: câu dẫn «Các ca đã gặp:» + bảng).
    if (/^\s*\|/.test(l)) { k.push({ chu: l.trim(), bang: true, noi: l.trim().replace(/^\|/, '').split('|')[0].trim() }); mo = false; continue; }
    if (mo) { const t = k[k.length - 1]; t.chu += ' ' + l.trim(); if (t.gach) t.noi += ' ' + l.trim(); }
    else { k.push({ chu: l.trim(), gach: false }); mo = true; }
  }
  return k;
}
const doanCua = lines => khoiCua(lines).map(k => k.chu);
// Trần ô «vì sao»: một khối đọc trong vài giây trên ngăn hẹp — số của phép đo LT1b (trung vị crm 364).
const TRAN_VI_SAO = 400;
const tachCau = s => String(s).split(/(?<=[.!?…])\s+/).filter(Boolean);
// Mục danh sách rút gọn: mở bằng cụm in đậm → cụm ấy (bỏ dấu câu cuối); không → câu đầu.
const rutMuc = s => { const m = String(s).match(/^\*\*(.+?)\*\*/); return (m ? tron(m[1]) : tachCau(tron(s))[0] || '').trim().replace(/[.:;]$/, ''); };
// Ghép đơn vị (câu hoặc mục) tới trần, giữ trọn đơn vị, kết «…»; đơn vị đầu đã quá trần → cắt ở khoảng trắng.
function catTran(donVi, noi) {
  const du = donVi.join(noi);
  if (du.length <= TRAN_VI_SAO) return du;
  let ra = '';
  for (const d of donVi) { const thu = ra ? ra + noi + d : d; if (thu.length + 1 > TRAN_VI_SAO) break; ra = thu; }
  if (!ra) { const dau = donVi[0].slice(0, TRAN_VI_SAO); const k = dau.lastIndexOf(' '); ra = (k > 0 ? dau.slice(0, k) : dau.slice(0, TRAN_VI_SAO - 1)).replace(/[\s,;:—-]+$/, ''); }
  return ra.replace(/[\s.,;:·]+$/, '') + '…';
}
const boNhanCuoi = s => String(tron(s)).replace(/[*_\s]+$/, '');
function viSaoCua(k, i) {
  const d = boNhanCuoi(k[i].chu);
  if (/:$/.test(d)) {
    const muc = [];
    if (k[i + 1] && k[i + 1].bang) {
      // Bảng: bỏ hàng tiêu đề (hàng đầu) và hàng phân cách.
      for (let j = i + 2; j < k.length && k[j].bang; j++) if (!/^[\s|:-]*$/.test(k[j].chu)) muc.push(rutMuc(k[j].noi));
    } else for (let j = i + 1; j < k.length && k[j].gach; j++) muc.push(rutMuc(k[j].noi));
    if (muc.length) return catTran([`${d} ${muc[0]}`, ...muc.slice(1)], ' · ');
  }
  return catTran(tachCau(tron(k[i].chu)), ' ');
}
function viSaoTu(opp, cauGiao) {
  const cg = boNgoacNgoai(chu(cauGiao));
  const k = khoiCua(section(opp, 'Vấn đề & ai gặp'));
  for (let i = 0; i < k.length; i++) {
    const d = k[i].chu;
    if (d.startsWith('>') || /^Mở từ hàng\b/.test(d) || d.startsWith('Gốc:')) continue;
    if (boNgoacNgoai(d) === cg) continue;
    const mo = d.match(/^Vì sao:\s*Gốc:\s*\S+(?:\s+[^—]*?)?\s+—\s+(.+)$/);
    if (mo) return catTran(tachCau(tron(mo[1].trim())), ' ');
    if (/^Vì sao:\s*/.test(d) && !/Gốc:/.test(d)) return catTran(tachCau(tron(d.replace(/^Vì sao:\s*/, ''))), ' ');
    return viSaoCua(k, i);
  }
  return null;
}

// Giới hạn đã biết người chọn ở Cổng Bằng chứng: lối «ghi Known limits» thêm gạch vào `## Notes` của hợp
// đồng (khối KNOWN-LIMITS-NOTE của commands/signoff.md). Bộ đọc KHOAN DUNG với mọi dạng gặp trên sáu kho
// (khảo sát 12/10): gạch CẤP NGOÀI CÙNG mở đầu (sau `**` tuỳ chọn) bằng Known limit(s) / known-limit(s) /
// Giới hạn đã biết / Hạn chế đã biết. Có gạch con → mỗi gạch con cấp kế là một giới hạn; không → chính gạch là một. Gạch
// (hay gạch con) chỉ mang «none»/«không có» không đếm.
const DAU_GIOI_HAN = /^(?:\*\*)?\s*(?:known[ -]limits?|giới hạn đã biết|hạn chế đã biết)(?![\w-])/i;
// Không dùng `\b`: ranh giới từ của JS chỉ hiểu chữ ASCII, nên «không có» (kết bằng «ó») không bao giờ khớp.
const RONG_GIOI_HAN = /^(?:none|không có|không)\.?$/i;
const sauDau = s => String(s).replace(/\*\*/g, '').replace(/^\s*(?:known[ -]limits?|giới hạn đã biết|hạn chế đã biết)[^:]*:\s*/i, '').trim();
// `lech` = số dòng của `## Notes` NHẮC tới giới hạn đã biết mà không nằm trong gạch nào bộ đọc nhận — bên
// vẽ không được in «0 giới hạn» khi có chỗ nhắc mà đọc không ra (ràng buộc điều phối 12/10: cờ vàng).
const NHAC_GIOI_HAN = /known[ -]limits?|giới hạn đã biết|hạn chế đã biết/i;
function docGioiHanNotes(contract) {
  const raw = section(contract, 'Notes'); const ra = []; const da = new Set();
  for (let i = 0; i < raw.length; i++) {
    // Dạng ĐẦU ĐOẠN (crm 94 hồ sơ, radar, oneflow): dòng không gạch — văn, `### …` hay `**…**` — mở đầu
    // bằng chữ giới hạn; các gạch cấp ngoài cùng ngay sau (cho phép dòng trắng chen) là các giới hạn.
    const p = /^\S/.test(raw[i]) && !/^[-*]\s|^\d+[.)]\s/.test(raw[i]) ? raw[i].replace(/^#{1,6}\s+/, '').trim() : null;
    if (p != null && DAU_GIOI_HAN.test(p)) {
      da.add(i); const con = [];
      for (let j = i + 1; j < raw.length; j++) {
        const l = raw[j]; if (!l.trim()) continue;
        const g = l.match(/^(?:[-*]|\d+[.)])\s+(.*)$/);
        if (g) { con.push(g[1].trim()); da.add(j); continue; }
        if (/^\s/.test(l) && con.length) { con[con.length - 1] += ' ' + l.trim(); da.add(j); continue; }
        break;
      }
      if (con.length) ra.push(...con.filter(c => !RONG_GIOI_HAN.test(c.replace(/\*\*/g, '').trim())));
      else if (!RONG_GIOI_HAN.test(sauDau(p))) ra.push(p);
      continue;
    }
    const m = raw[i].match(/^[-*]\s+(.*)$/);
    if (!m || !DAU_GIOI_HAN.test(m[1])) continue;
    da.add(i);
    let dau = m[1].trim(); const con = []; let cap = null;
    for (let j = i + 1; j < raw.length; j++) {
      const l = raw[j]; if (!l.trim()) continue;
      if (/^\S/.test(l)) break;
      da.add(j);
      const g = l.match(/^(\s+)(?:[-*]|\d+[.)])\s+(.*)$/);
      if (g && (cap == null || g[1].length <= cap)) { cap = g[1].length; con.push(g[2].trim()); }
      else if (con.length) con[con.length - 1] += ' ' + l.trim();
      else dau += ' ' + l.trim();
    }
    if (con.length) ra.push(...con.filter(c => !RONG_GIOI_HAN.test(c.replace(/\*\*/g, '').trim())));
    else if (!RONG_GIOI_HAN.test(sauDau(dau))) ra.push(dau);
  }
  return { ds: ra, lech: raw.filter((l, i) => !da.has(i) && NHAC_GIOI_HAN.test(l)).length };
}
const gioiHanTuNotes = contract => docGioiHanNotes(contract).ds;

// Nhánh production kho khai: khối `production:` cấp ngoài cùng của `_acceptance/config.yaml`, khoá con
// `nhanh:`. Vắng khối hay khoá → null (kho không bật — ô production giữ hành vi cũ).
function nhanhProduction(root) {
  const t = String(doc(path.join(root, '_acceptance', 'config.yaml')) || '');
  const m = t.match(/^production:[^\S\n]*(?:#[^\n]*)?\n((?:[ \t]+[^\n]*(?:\n|$)|[ \t]*(?:\n|$))*)/m);
  const n = m && m[1].match(/^[ \t]+nhanh:[ \t]*["']?([^\s"'#]+)/m);
  return n ? n[1] : null;
}
const gitRa = (root, args) => { const r = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); return r.status === 0 ? r.stdout.trim() : null; };
const duongNhanh = new Map();
const laToTien = (root, a, b) => spawnSync('git', ['-C', root, 'merge-base', '--is-ancestor', a, b], { stdio: 'ignore' }).status;
// Mã đã chấm có nằm trên nhánh production chưa, và ngày nó tới nhánh (commit cổng-đầu-tiên trên đường
// first-parent của nhánh chứa nó). Mọi chỗ không đọc được trả { loi } có tên — không đoán, không in «chưa».
function trienKhai(root, ma, nhanh) {
  if (!ma) return { loi: 'hồ sơ chưa có mã đã chấm' };
  if (gitRa(root, ['rev-parse', '--git-dir']) == null) return { loi: 'gốc không phải kho git' };
  const ref = [`refs/remotes/origin/${nhanh}`, `refs/heads/${nhanh}`].find(r => gitRa(root, ['rev-parse', '--verify', '-q', r]) != null);
  if (!ref) return { loi: `không thấy nhánh ${nhanh}` };
  if (gitRa(root, ['cat-file', '-e', `${ma}^{commit}`]) == null) return { loi: 'mã đã chấm không có trong kho' };
  const st = laToTien(root, ma, ref);
  if (st === 1) return { gop: false };
  if (st !== 0) return { loi: 'git không trả lời' };
  // Commit tới-nhánh = commit CŨ NHẤT trên đường first-parent của nhánh mà chứa mã (con cháu của mã, hoặc
  // chính mã). Không dùng `--first-parent --ancestry-path` chung một lệnh: git 2.37 trả rỗng.
  const k = `${root}\0${ref}`;
  if (!duongNhanh.has(k)) duongNhanh.set(k, String(gitRa(root, ['rev-list', '--first-parent', ref]) || '').split('\n').filter(Boolean));
  const chau = new Set(String(gitRa(root, ['rev-list', '--ancestry-path', `${ma}..${ref}`]) || '').split('\n').filter(Boolean));
  const maDu = gitRa(root, ['rev-parse', `${ma}^{commit}`]);
  let c = null;
  for (const x of duongNhanh.get(k)) { if (x === maDu) { c = x; break; } if (!chau.has(x)) break; c = x; }
  return { gop: true, ngay: ngayCua(gitRa(root, ['log', '-1', '--format=%cI', c || maDu])) || '?' };
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
  const knownBaoCao = knownRaw.filter(l => !RONG_GIOI_HAN.test(l.replace(/\*\*/g, '').trim()));
  // Hai nguồn cùng có → nguồn NHIỀU mục hơn (hoà → hợp đồng), không cộng: hồ sơ thật chép cùng giới hạn ở
  // hai nơi, cộng là đếm đôi; kit không so được hai câu có phải một giới hạn.
  const ghHD = T.contract != null ? docGioiHanNotes(T.contract) : { ds: [], lech: 0 };
  const knownHopDong = ghHD.ds;
  const known = knownBaoCao.length > knownHopDong.length ? knownBaoCao : knownHopDong;
  const thucTe = so ? so.dong.filter(d => d.type === 'thuc-te') : [];
  const tt = thucTe[thucTe.length - 1] || null;
  const designDoc = chu(cfm.design_doc);

  const moi = {};
  const cauGiao = chu(cfm.feature) || chu(ofm.feature);
  moi.da_giao = can('da_giao', T.contract != null ? 'contract.md' : 'opportunity.md', cauGiao) ? boNgoacNgoai(cauGiao) : null;
  let vs = T.opp != null ? viSaoTu(T.opp, cauGiao) : null;
  if (vs) nguon.vi_sao = 'opportunity.md';
  else {
    const kc = T.contract != null ? khoiCua(section(T.contract, 'Context')) : [];
    const ctx = kc.length ? viSaoCua(kc, 0) : null;
    vs = ctx || null; can('vi_sao', ctx ? 'contract.md' : 'opportunity.md', vs);
  }
  moi.vi_sao = vs;
  moi.trang_thai = can('trang_thai', 'contract.md', chu(opts.trangThai) || chu(cfm.status)) ? (chu(opts.trangThai) || chu(cfm.status)) : null;
  moi.ngay = ngaySo({ tt: tt && ngayCua(tt.at), ky: ngayCua(rfm.human_signoff), duyet: ngayCua(cfm.approved_at), dang: ngayCua(ofm.decided_at) });
  nguon.ngay = 'contract.md';
  // Hai câu tách bạch (ràng buộc điều phối 12/10): «đã thấy chạy» là REALITY người ghi (dòng `thuc-te`,
  // ADR 0020) — máy không suy thay; «đã triển khai» là máy suy từ git, CHỈ khi kho khai nhánh production.
  const nhanh = nhanhProduction(path.resolve(dir, '..', '..'));
  if (so == null && !nhanh) { moi.production = null; can('production', 'decisions.jsonl', false); }
  else if (tt) {
    nguon.production = 'decisions.jsonl';
    moi.production = `đã chạy ở production — bản dựng ${chu(tt.build_sha).slice(0, 7)}, quan sát ${ngayCua(tt.at) || chu(tt.at)}, ${chu(tt.by)}`;
  } else if (!nhanh) { nguon.production = 'decisions.jsonl'; moi.production = 'chưa ghi quan sát production'; }
  else {
    nguon.production = `git ${nhanh}`;
    const tk = trienKhai(path.resolve(dir, '..', '..'), chu(rfm.verified_commit), nhanh);
    moi.production = tk.loi ? `chưa đọc được triển khai ở đây — ${tk.loi}`
      : tk.gop ? `đã triển khai — gộp vào ${nhanh} ${tk.ngay}; chưa ai ghi đã thấy chạy ở production`
        : `chưa gộp vào ${nhanh} (nhánh production kho khai)`;
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
  moi.chua_lam = T.contract == null ? null : `${oos.length} mục để ngoài phạm vi · ${!ghHD.lech ? `${known.length} giới hạn đã biết`
    : known.length ? `${known.length} giới hạn đã biết (Notes còn chỗ nhắc giới hạn sai khuôn)` : 'giới hạn đã biết: chưa đọc được — Notes nhắc giới hạn sai khuôn'}`;
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

module.exports = { O_MOI_NGUOI, O_CHU_KHO, TRAN_VI_SAO, nhanhProduction, trienKhai, boNgoacNgoai, laNguoi, docSo, docUsage, viSaoTu, gioiHanTuNotes, docGioiHanNotes, tieuChiCua, tomTatHoSo };
