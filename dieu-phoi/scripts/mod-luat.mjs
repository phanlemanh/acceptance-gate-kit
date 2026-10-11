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
  const cong = (SU_KIEN_MOD['./mod/doc-muc-dung.ts'] ?? []).filter((s) => SU_KIEN_CONG.includes(s));
  if (cong.length) loi.push(`phần đọc mức dùng không được nghe sự kiện cổng: ${cong.join(', ')}`);
  if (suKienValidate) {
    const a = [...hop].sort().join(', ');
    const b = [...suKienValidate].sort().join(', ');
    if (a !== b) loi.push(`sự kiện validate thấy [${b}] khác quét chữ [${a}]`);
  }
  return loi;
}
