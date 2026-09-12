// Chân dang-thuc (AC-6) — MỘT NGUỒN cho vị từ «chữ ký thật» (đổi khuôn S4-r2).
//
// Hai bộ đọc nay khớp nhau THEO CẤU TRÚC (cùng gọi `chuKyThat` của
// lib/evidence-core.cjs), nên phép đo đổi việc: (0) chứng CHỈ CÓ một nguồn,
// (1) từng ô ngữ pháp cho đúng kết luận hợp đồng nói, (2) ba chiều đỏ.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import * as F from './fixture.mjs';

const o = F.cells();
if (o.length !== 108) { console.error(`số ô lệch: ${o.length}, khai trước 108`); process.exit(1); }

const loi = [];

// ── (0) MỘT NGUỒN, đo được ──────────────────────────────────────────────────
// Dấu hiệu của một BẢNG giữ-chỗ: ≥3 mẫu chữ của bảng cùng nằm trong một tệp.
// Quét mọi tệp thi hành dưới scripts/ (kể cả tệp mới mai này thêm vào).
const MAU_CHU = F.placeholderPatterns().filter(p => /^[a-z]/i.test(p.mau)).map(p => p.mau);
// Ranh giới SIẾT: `\b` khớp cả trong `PENDING-JUDGMENT` (gạch nối là ranh giới từ)
// nên gate-card.js bị chấm oan ở lượt chạy đầu. Mẫu phải đứng như một TOKEN.
// Ngưỡng 3 phân biệt sạch trên cây hôm nay: nguồn 7/7, mọi tệp scripts/ khác 2/7.
const demMau = txt => MAU_CHU.filter(m =>
  new RegExp(`(^|[^a-z0-9_-])${m.replace('/', '\\/')}([^a-z0-9_-]|$)`, 'i').test(txt)).length;
// BẢN LÙI có MỐC (S4-r3) được miễn: luật chặn không được mất răng khi vắng engine,
// nên bảng lùi ở lại — nhưng nó là BẢN CHIẾU, và chân `lui-khong-engine` chạy mọi
// mẫu của nguồn qua chính đường đó. Cắt khối theo mốc TRƯỚC khi đếm; nếu tệp có
// mốc mà cắt không ra nội dung thì báo ĐỎ (miễn trừ không được im lặng nuốt).
const catBanLui = (txt, tep) => {
  const m = txt.match(/# <<<BANG-LUI-GIU-CHO\n([\s\S]*?)\n# BANG-LUI-GIU-CHO>>>/);
  if (!txt.includes('BANG-LUI-GIU-CHO')) return txt;
  if (!m) { loi.push(`mốc BANG-LUI-GIU-CHO ở ${tep} hỏng — không cắt được khối bản lùi`); return txt; }
  if (demMau(m[1]) < 3) loi.push(`khối bản lùi ở ${tep} không còn giữ bảng (${demMau(m[1])} mẫu) — miễn trừ đang che một khối rỗng`);
  return txt.split(m[0]).join('');
};
const quetBang = (goc) => {
  const thuMuc = path.join(goc, 'scripts');
  return readdirSync(thuMuc)
    .filter(f => /\.(sh|mjs|cjs|js)$/.test(f))
    .map(f => ({ tep: `scripts/${f}`, n: demMau(catBanLui(readFileSync(path.join(thuMuc, f), 'utf8'), `scripts/${f}`)) }))
    .filter(x => x.n >= 3);
};
const mocBang = quetBang(F.ROOT);
for (const x of mocBang) loi.push(`bảng giữ-chỗ mọc bản thứ hai ở ${x.tep} (${x.n}/${MAU_CHU.length} mẫu)`);
// ĐỐI CHỨNG DƯƠNG của chính phép quét: nó PHẢI thấy bảng ở nơi bảng thật sự ở.
// Không có vế này thì «0 tệp mọc bảng» không phân biệt được với «phép quét mù».
const nguon = demMau(readFileSync(path.join(F.ROOT, 'lib/evidence-core.cjs'), 'utf8'));
if (nguon < 3) loi.push(`phép quét MÙ: không thấy bảng ở chính nguồn lib/evidence-core.cjs (${nguon}/${MAU_CHU.length} mẫu)`);
// Máy quét không được có biểu thức đọc `human_signoff` của riêng nó.
const scanSrc = readFileSync(path.join(F.ROOT, 'scripts/start-scan.mjs'), 'utf8');
if (/human_signoff[^\n]*(\/|match\(|RegExp)/.test(scanSrc))
  loi.push('máy quét mọc biểu thức đọc human_signoff riêng — vị từ phải hỏi lib');

// ── (1) từng ô ngữ pháp ─────────────────────────────────────────────────────
const repo = F.mkRepo();
for (const c of o) F.writeDossier(repo, c.ten, { veto: c.veto, cong1: c.cong1, chuKy: c.chuKy });
F.gitAll(repo, '108 o');

const doc = () => {
  const { out } = F.runPremerge(repo);
  const j = F.runScan(repo);
  return {
    out,
    luoi: new Set(F.tenDongTong(out)),
    quet: new Set(j.vetoOpenUnsigned || []),
    tapVeto: new Set((j.vetoOpen || []).map(v => v.slug)),
    phanTu: new Map((j.vetoOpen || []).map(v => [v.slug, v])),
  };
};
const d = doc();
const CAN_WARN = new Set(['frontmatter-hong', 'thieu-fence-dong', 'fence-thut-le']);
for (const c of o) {
  const mong = F.moThat(c);
  if ((c.veto.veto === 'mo') !== d.tapVeto.has(c.ten))
    loi.push(`tập vetoOpen đổi ở ô ${c.ten} — tập phần tử phải giữ nguyên`);
  if (d.luoi.has(c.ten) !== mong) loi.push(`lệch ở lưới: ô ${c.ten} (mong ${mong ? 'MỞ' : 'đóng'})`);
  if (d.quet.has(c.ten) !== mong) loi.push(`lệch ở máy quét: ô ${c.ten} (mong ${mong ? 'MỞ' : 'đóng'})`);
  const v = d.phanTu.get(c.ten);
  if (v) {
    if (typeof v.humanSignoff !== 'boolean') loi.push(`lệch ở máy quét: ô ${c.ten} thiếu humanSignoff kiểu boolean`);
    if (typeof v.signoffWarn !== 'string') loi.push(`lệch ở máy quét: ô ${c.ten} thiếu signoffWarn (phải LUÔN có mặt)`);
    if (CAN_WARN.has(c.chuKy.ten) && !v.signoffWarn)
      loi.push(`lệch ở máy quét: ô ${c.ten} nuốt im hình dạng frontmatter hỏng (signoffWarn rỗng)`);
  }
}
const chenh = [...new Set([...d.luoi, ...d.quet])].filter(s => d.luoi.has(s) !== d.quet.has(s));
if (chenh.length) loi.push(`lưới và máy quét chênh nhau ở: ${chenh.join(' ')}`);

// LƯỚI KHÔNG ĐƯỢC TỰ MÂU THUẪN (S4-r3, lỗ ngữ pháp cuối): một hồ sơ vừa được tuyên
// «đã đóng bằng chữ ký» vừa được tuyên «cửa veto vẫn mở» trong CÙNG một lượt nghĩa
// là hai chỗ đọc chữ ký của chính lưới đang dùng hai ngữ pháp (chỗ này thấy chữ ký,
// chỗ kia đọc ra rỗng). Đo trên MỌI ô, không riêng ô ngữ pháp lạ.
for (const c of o) {
  const dong = d.out.split('\n').filter(l => l.startsWith(`NOTE [${c.ten}]`));
  const daDong = dong.some(l => l.includes(F.CAU_GHIM));
  const vanMo = dong.some(l => l.includes('Cửa veto vẫn mở'));
  if (daDong && vanMo)
    loi.push(`lưới tự mâu thuẫn ở ô ${c.ten}: vừa nói «${F.CAU_GHIM}» vừa nói «Cửa veto vẫn mở» trong cùng lượt`);
}
if (loi.length) { console.error(loi.slice(0, 8).join(' | ')); process.exit(1); }

// phá thử: +1 khi thêm hồ sơ chưa ký, +0 khi thêm hồ sơ đã ký
const n0 = [d.luoi.size, d.quet.size];
F.writeDossier(repo, 'them-chua-ky', { veto: F.MO, cong1: F.RONG, chuKy: F.o('rong-khuon') });
F.gitAll(repo, 'them chua ky');
const d1 = doc();
if (d1.luoi.size !== n0[0] + 1 || d1.quet.size !== n0[1] + 1)
  loi.push(`không tăng đúng 1: lưới ${n0[0]}→${d1.luoi.size}, máy quét ${n0[1]}→${d1.quet.size}`);
F.writeDossier(repo, 'them-da-ky', { veto: F.MO, cong1: F.RONG, chuKy: F.o('that-tran') });
F.gitAll(repo, 'them da ky');
const d2 = doc();
if (d2.luoi.size !== d1.luoi.size || d2.quet.size !== d1.quet.size)
  loi.push(`hồ sơ ĐÃ ký vẫn làm tập tăng: lưới ${d1.luoi.size}→${d2.luoi.size}, máy quét ${d1.quet.size}→${d2.quet.size}`);
if (loi.length) { console.error(loi.join(' | ')); process.exit(1); }

// ── (2) ba chiều đỏ, ba thông điệp ─────────────────────────────────────────
const banSao = (rel, tim, thay) => {
  const k = F.mkRepo();
  for (const c of o) F.writeDossier(k, c.ten, { veto: c.veto, cong1: c.cong1, chuKy: c.chuKy });
  F.gitAll(k, 'ban sao');
  F.tiem(k, rel, tim, thay);
  const luoi = new Set(F.tenDongTong(F.runPremerge(k).out));
  const quet = new Set(F.runScan(k).vetoOpenUnsigned || []);
  return { goc: k, luoi, quet, ch: [...new Set([...luoi, ...quet])].filter(s => luoi.has(s) !== quet.has(s)) };
};

// (i) mọc bảng THỨ HAI trong lưới → phép quét một-nguồn phải bắt, gọi tên tệp
const k1 = F.mkRepo();
F.tiem(k1, 'scripts/pre-merge-check.sh', 'placeholder_signoff() {',
  'placeholder_signoff() {\n  case "$1" in pending*|tbd*|todo*) return 0 ;; esac');
const bat = quetBang(k1);
if (!bat.some(x => x.tep === 'scripts/pre-merge-check.sh')) {
  console.error('chiều đỏ (i) KHÔNG chạy: cấy bảng thứ hai vào lưới mà phép quét một-nguồn không thấy');
  process.exit(1);
}

// (ii) đột biến CHÍNH NGUỒN → CẢ HAI bộ đọc cùng đổi (chứng dùng chung một nguồn)
const k2 = banSao('lib/evidence-core.cjs',
  "  if (laGiuCho(s)) return ket({ value: s, placeholder: true, warn });",
  '  // đột biến: nguồn thôi nhận giữ-chỗ');
const doiLuoi = [...k2.luoi].length !== [...d.luoi].length;
const doiQuet = [...k2.quet].length !== [...d.quet].length;
if (!(doiLuoi && doiQuet) || k2.ch.length !== 0) {
  console.error(`chiều đỏ (ii) KHÔNG chạy: đột biến nguồn phải làm CẢ HAI bộ đọc đổi và vẫn khớp nhau — lưới đổi=${doiLuoi}, máy quét đổi=${doiQuet}, chênh=${k2.ch.length}`);
  process.exit(1);
}

// (iv) trả chỗ đọc chữ ký của luật Cổng 2 về front_field (ngữ pháp hẹp hơn nguồn)
// → lưới tự mâu thuẫn ở ô khoá-dấu-bằng: một chỗ thấy chữ ký, chỗ kia đọc ra rỗng.
const k4 = banSao('scripts/pre-merge-check.sh',
  '  signoff="$(chu_ky_gia_tri "$report")"',
  '  signoff="$(front_field "$report" human_signoff)"');
const mauThuan = (out) => o.filter(c => {
  const dong = out.split('\n').filter(l => l.startsWith(`NOTE [${c.ten}]`));
  return dong.some(l => l.includes(F.CAU_GHIM)) && dong.some(l => l.includes('Cửa veto vẫn mở'));
}).map(c => c.ten);
const mt4 = mauThuan(F.runPremerge(k4.goc).out);
if (!mt4.some(s => s.endsWith('khoa-dau-bang'))) {
  console.error(`chiều đỏ (iv) KHÔNG chạy: trả về front_field mà lưới không tự mâu thuẫn ở ô khoá-dấu-bằng (thấy: ${mt4.join(' ') || 'không ô nào'})`);
  process.exit(1);
}

// (iii) máy quét tự đọc cả file → ô chỉ-ở-thân vỡ
const k3 = banSao('scripts/start-scan.mjs', '  const r = chuKyThat(t);',
  '  const r = { signed: /human_signoff:[ \\t]*\\S/.test(t), warn: \'\' };');
if (!k3.ch.some(s => s.endsWith('chi-o-than'))) {
  console.error('chiều đỏ (iii) KHÔNG chạy: máy quét đọc cả file mà ô chỉ-ở-thân vẫn khớp');
  process.exit(1);
}

console.log(`một nguồn + ngữ pháp: ${o.length} ô khớp · lưới=${d.luoi.size} · máy quét=${d.quet.size} · 0 tệp scripts/ mọc bảng (phép quét THẤY bảng ở nguồn: ${nguon}/${MAU_CHU.length} mẫu)`);
console.log('       [chiều đỏ i] cấy bảng giữ-chỗ thứ hai vào lưới → bảng giữ-chỗ mọc bản thứ hai ở scripts/pre-merge-check.sh');
console.log(`       [chiều đỏ ii] đột biến CHÍNH nguồn → cả hai bộ đọc cùng đổi (lưới ${d.luoi.size}→${k2.luoi.size}, máy quét ${d.quet.size}→${k2.quet.size}), vẫn khớp nhau`);
console.log(`       [chiều đỏ iii] máy quét tự đọc cả file → lệch ở máy quét tại ô ${k3.ch.filter(s => s.endsWith('chi-o-than')).join(' ')}`);
console.log(`       [chiều đỏ iv] trả chỗ đọc chữ ký của Cổng 2 về front_field → lưới tự mâu thuẫn ở ô ${mt4.join(' ')}`);
