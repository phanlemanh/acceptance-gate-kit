// Khung lớp mod của gói (spec workflow §12.1, §16 T11; design DP4 «khung mod»). Claude Code nhận ĐÚNG MỘT module mod
// mỗi gói (`hooks.json` → `modules`), nên gói có một `hooks/mod/register.ts` chỉ gọi từng PHẦN `hooks/mod/<phần>.ts`.
// Mỗi phần khai ĐÚNG các sự kiện nó được nghe trong khối marker dưới — DP6 và các hàng sau thêm một dòng cho phần
// của mình. Răng: `kiemKhungMod` (ca node DP4-13) và `tests/dieu-phoi/kiem-mod.mjs` (đối chiếu thêm với
// `claude plugin validate`). Luật an toàn: mod của kit không bao giờ trả lời «cho phép» thay người.
import fs from 'node:fs';
import path from 'node:path';

export const SU_KIEN_CONG = ['tool.call', 'tool.check', 'classic.PreToolUse', 'classic.PermissionRequest'];
export const MODULE_MOD = './mod/register.ts';
// <<<MOD-SU-KIEN
export const SU_KIEN_MOD = {
  './mod/doc-muc-dung.ts': ['session.measure'],
  './mod/khung.ts': ['command.run', 'session.start', 'ui.render'],
};
// MOD-SU-KIEN>>>

// Bỏ chú thích nhưng giữ nguyên số dòng (chú thích khối thay bằng khoảng trắng).
export function boChuThich(nguon) {
  return nguon.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).split('\n').map((d) => d.replace(/\/\/.*$/, '')).join('\n');
}

// «Không bao giờ cho phép»: bốn đường cho một lời gọi chạy không qua hỏi quyền — `tool.check` {decision:'allow'},
// `classic.PreToolUse` {allow:true}, `classic.PermissionRequest` behavior 'allow', `tool.call` trả {result} thay công cụ.
// Quét CHỮ: `allow` dạng chuỗi hay khoá đối tượng, và khoá/viết tắt `result` trong đối tượng. Trả [{tep, dong, chu}].
const CHO_PHEP = /(['"`])allow\1|\ballow\s*:|\{\s*result\s*[,}]|[{,]\s*result\s*:/;
export function quetChoPhep(tep, nguon) {
  const goc = nguon.split('\n');
  return boChuThich(nguon).split('\n').flatMap((d, i) => (CHO_PHEP.test(d) ? [{ tep, dong: i + 1, chu: goc[i].trim() }] : []));
}

// Sự kiện một tệp tự đăng ký: mọi `on('<sự kiện>'` (chuỗi tĩnh) sau khi bỏ chú thích.
export function quetSuKien(nguon) {
  return [...new Set([...boChuThich(nguon).matchAll(/\bon\(\s*(['"`])([\w.]+)\1/g)].map((m) => m[2]))].sort();
}

// Tách dòng «<module> hooks: …» của `claude plugin validate` thành tập sự kiện: bỏ phần matcher `{…}`, và KHÔNG cắt ở
// dấu phẩy nằm trong `{…}` — matcher nhiều khoá (`ui.render{component=Pane, requestId=…}`) có phẩy bên trong (DP6b).
export function tachSuKienValidate(dong) {
  return new Set(String(dong ?? '').replace(/\{[^}]*\}/g, '').split(',').map((x) => x.trim()).filter(Boolean));
}

// Răng khung mod. `suKienValidate` (Set, tuỳ chọn) = sự kiện `claude plugin validate` thấy module nghe: hợp các sự kiện
// quét chữ phải BẰNG tập đó — phần đăng ký bằng tên động thì lệch. Trả danh sách lỗi (rỗng = sạch).
export function kiemKhungMod(gocGoi, { suKienValidate = null } = {}) {
  const loi = [];
  let hj = null;
  try {
    hj = JSON.parse(fs.readFileSync(path.join(gocGoi, 'hooks', 'hooks.json'), 'utf8'));
  } catch (e) {
    return [`hooks.json không đọc được: ${e.message}`];
  }
  if (JSON.stringify(hj.modules ?? null) !== JSON.stringify([MODULE_MOD])) loi.push(`modules phải là ["${MODULE_MOD}"], đang ${JSON.stringify(hj.modules ?? null)}`);
  const dMod = path.join(gocGoi, 'hooks', 'mod');
  const tep = fs.existsSync(dMod) ? fs.readdirSync(dMod).filter((f) => !f.endsWith('.test.ts')).sort() : [];
  const hop = new Set();
  for (const f of tep) {
    const rel = `./mod/${f}`;
    const nguon = fs.readFileSync(path.join(dMod, f), 'utf8');
    for (const x of quetChoPhep(`hooks/mod/${f}`, nguon)) loi.push(`${x.tep}:${x.dong} trả lời cho phép: ${x.chu}`);
    const su = quetSuKien(nguon);
    if (rel === MODULE_MOD) {
      if (su.length) loi.push(`${f}: register.ts không được tự gọi on(…) (${su.join(', ')}) — đăng ký trong một phần`);
      continue;
    }
    if (!SU_KIEN_MOD[rel]) {
      loi.push(`tệp phần ngoài bảng MOD-SU-KIEN: hooks/mod/${f}`);
      continue;
    }
    for (const s of su) {
      hop.add(s);
      if (!SU_KIEN_MOD[rel].includes(s)) loi.push(`${f}: nghe ${s} ngoài bảng MOD-SU-KIEN (${SU_KIEN_MOD[rel].join(', ')})`);
    }
  }
  for (const rel of Object.keys(SU_KIEN_MOD)) if (!tep.includes(rel.slice('./mod/'.length))) loi.push(`bảng MOD-SU-KIEN khai ${rel} mà không có tệp`);
  // Luật theo LỚP, không theo tên tệp (DP6b): không phần nào được nghe sự kiện cổng — bảng khai thì cũng đỏ.
  for (const [rel, suKien] of Object.entries(SU_KIEN_MOD)) {
    const cong = suKien.filter((s) => SU_KIEN_CONG.includes(s));
    if (cong.length) loi.push(`${rel.slice('./mod/'.length)}: không được nghe sự kiện cổng: ${cong.join(', ')}`);
  }
  if (suKienValidate) {
    const a = [...hop].sort().join(', ');
    const b = [...suKienValidate].sort().join(', ');
    if (a !== b) loi.push(`sự kiện validate thấy [${b}] khác quét chữ [${a}]`);
  }
  return loi;
}

// «Mod chỉ vẽ» (DP6b, hồ sơ trang-thai-dot-dieu-phoi-tho AC-9) — nửa CHỈ ĐỌC của chính sách, đọc từ báo cáo
// `claude plugin validate --strict --json`: không lời gọi ghi/gửi nào trên `$` (dòng «calls:» của module), đúng một
// hook cổng là lệnh xem của gói và hook đó KHÔNG có .catch (hook hỏng thì engine bỏ qua nó, lệnh markdown chạy như
// cũ), và mọi argv viết thẳng của `$.process.run` trong phần khung kết thúc bằng một dạng CHỈ ĐỌC của `xem`:
// `xem --json`, hay `xem --json --khung` (hồ sơ khung-dot-dinh-vi).
export const GOI_CAM = ['$.fs.write', '$.fs.remove', '$.store.set', '$.session.send', '$.session.append', '$.prompt.submit', '$.tool.', '$.command.run'];
export const CONG_DUOC_PHEP = ['command.run{command=dieu-phoi:xem}'];
export const TEP_KHUNG = 'khung.ts';
export const DUOI_DOC = ["'xem','--json'", "'xem','--json','--khung'"];
export function kiemChiVe(gocGoi, { notes = [], gatingHooks = [] } = {}) {
  const loi = [];
  const dong = notes.find((n) => n.startsWith(`${MODULE_MOD} calls:`));
  const goi = dong ? dong.slice(`${MODULE_MOD} calls:`.length).split(',').map((x) => x.trim().replace(/\s*\(via [^)]*\)$/, '')).filter(Boolean) : [];
  for (const c of goi) if (GOI_CAM.some((cam) => c.startsWith(cam))) loi.push(`gọi ${c} — mod chỉ vẽ`);
  const cong = gatingHooks.map((g) => g.hook).sort();
  if (JSON.stringify(cong) !== JSON.stringify([...CONG_DUOC_PHEP].sort())) loi.push(`gatingHooks lệch: [${cong.join(', ')}] — chỉ được [${CONG_DUOC_PHEP.join(', ')}]`);
  for (const g of gatingHooks) if (g.hasCatch) loi.push(`${g.hook} có .catch — hook hỏng phải để engine chạy lệnh markdown`);
  let nguon = '';
  try {
    nguon = boChuThich(fs.readFileSync(path.join(gocGoi, 'hooks', 'mod', TEP_KHUNG), 'utf8'));
  } catch {
    loi.push(`không đọc được hooks/mod/${TEP_KHUNG}`);
  }
  for (const m of nguon.matchAll(/\$\.process\.run\(\s*\[([^\]]*)\]/g)) {
    const argv = m[1].split(',').map((x) => x.trim()).filter(Boolean);
    if (!DUOI_DOC.some((d) => argv.slice(-d.split(',').length).join(',') === d)) loi.push(`${TEP_KHUNG}: argv process.run không kết thúc bằng dạng chỉ đọc của xem (${DUOI_DOC.join(' | ')}): [${argv.join(', ')}]`);
  }
  return loi;
}
