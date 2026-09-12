// Chân dang-thuc (AC-6) — hai bộ đọc nói CÙNG một vị từ, đo trên CÙNG một kho git.
// Ma trận khai TRƯỚC: 3 veto × 2 Cổng 1 × 13 ô chữ ký = 78 ô.
import * as F from './fixture.mjs';

const o = F.cells();
if (o.length !== 84) { console.error(`số ô lệch: ${o.length}, khai trước 84`); process.exit(1); }

const repo = F.mkRepo();
for (const c of o) F.writeDossier(repo, c.ten, { veto: c.veto, cong1: c.cong1, chuKy: c.chuKy });
F.gitAll(repo, '78 o');

const doc = () => {
  const { out } = F.runPremerge(repo);
  const j = F.runScan(repo);
  return {
    luoi: new Set(F.tenDongTong(out)),
    quet: new Set(j.vetoOpenUnsigned || []),
    tapVeto: new Set((j.vetoOpen || []).map(v => v.slug)),
    phanTu: new Map((j.vetoOpen || []).map(v => [v.slug, v])),
  };
};

const loi = [];
const d = doc();
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
    if (c.chuKy.ten === 'frontmatter-hong' && !v.signoffWarn)
      loi.push(`lệch ở máy quét: ô ${c.ten} nuốt im lỗi frontmatter (signoffWarn rỗng)`);
    if (c.chuKy.ten === 'thieu-fence-dong' && !v.signoffWarn)
      loi.push(`lệch ở máy quét: ô ${c.ten} nuốt im frontmatter THIẾU DẤU ĐÓNG (signoffWarn rỗng)`);
  }
}
// Đẳng thức cấp TẬP, không chỉ từng ô: hai bên phải bằng nhau đúng từng phần tử.
const chenh = [...new Set([...d.luoi, ...d.quet])].filter(s => d.luoi.has(s) !== d.quet.has(s));
if (chenh.length) loi.push(`lưới và máy quét chênh nhau ở: ${chenh.join(' ')}`);
if (loi.length) { console.error(loi.slice(0, 8).join(' | ')); process.exit(1); }

// ── phá thử: thêm một hồ sơ CHƯA ký → cả hai +1; thêm một hồ sơ ĐÃ ký → +0 ──
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

// ── ba chiều đỏ, ba thông điệp ─────────────────────────────────────────────
const dung = (nhan, rel, tim, thay, ktr) => {
  const k = F.mkRepo();
  for (const c of o) F.writeDossier(k, c.ten, { veto: c.veto, cong1: c.cong1, chuKy: c.chuKy });
  F.gitAll(k, 'ban sao');
  F.tiem(k, rel, tim, thay);
  const luoi = new Set(F.tenDongTong(F.runPremerge(k).out));
  const quet = new Set(F.runScan(k).vetoOpenUnsigned || []);
  const ch = [...new Set([...luoi, ...quet])].filter(s => luoi.has(s) !== quet.has(s));
  if (!ktr({ luoi, quet, ch })) { console.error(`chiều đỏ «${nhan}» KHÔNG chạy: đẳng thức vẫn đúng sau đột biến`); process.exit(1); }
  return ch;
};

const ch1 = dung('lệch ở lưới', 'scripts/pre-merge-check.sh',
  'if [ "$vstate" = "mo" ] && signoff_that "$dir"; then vstate="mo-da-ky"; fi', ':',
  ({ ch }) => ch.length > 0);
const ch2 = dung('lệch ở máy quét', 'scripts/start-scan.mjs',
  'humanSignoff: ss.signed', 'humanSignoff: false',
  ({ ch }) => ch.length > 0);
// Ô «thiếu dấu đóng» (S4-r1): gỡ nhánh soi-gương → máy quét lại đọc ra «chưa ký»
// trong khi lưới đọc tới hết tệp và thấy chữ ký. Đây là chiều đỏ của chính ô mới.
const ch4 = dung('máy quét bỏ nhánh soi-gương', 'scripts/start-scan.mjs',
  "  if (raw === null && !dong.slice(dau + 1).some(l => l.trim() === '---')) {",
  '  if (false) {',
  ({ ch }) => ch.some(s => s.endsWith('thieu-fence-dong')));

const ch3 = dung('máy quét đọc cả file', 'scripts/start-scan.mjs',
  "  let raw = frontmatterField(t, 'human_signoff');",
  '  let raw = (t.match(/human_signoff:[ \\t]*([^\\n#]+)/g) || []).map(x => x.split(":").slice(1).join(":").trim()).find(Boolean);',
  ({ ch }) => ch.some(s => s.endsWith('chi-o-than')));

console.log(`đẳng thức: ${o.length} ô khớp · lưới=${d.luoi.size} · máy quét=${d.quet.size} · +1 khi thêm hồ sơ chưa ký, +0 khi thêm hồ sơ đã ký`);
console.log(`       [chiều đỏ 1] gỡ dòng rẽ của lưới → lệch ở lưới tại ${ch1.length} ô`);
console.log(`       [chiều đỏ 2] ghim humanSignoff=false ở máy quét → lệch ở máy quét tại ${ch2.length} ô`);
console.log(`       [chiều đỏ 3] máy quét đọc human_signoff CẢ FILE → lệch ở máy quét tại ô ${ch3.filter(s => s.endsWith('chi-o-than')).join(' ')}`);
console.log(`       [chiều đỏ 4] máy quét bỏ nhánh soi-gương frontmatter thiếu dấu đóng → lệch ở máy quét tại ô ${ch4.filter(s => s.endsWith('thieu-fence-dong')).join(' ')}`);
