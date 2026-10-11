// dung-lai-model.mjs — làn ghim lại DÙNG LẠI kết quả eval model thật khi băm đầu vào không đổi (hồ sơ
// eval-goi-model-that-khong-chay, hàng G3). Hàm thuần + ba khối marker: bên viết (repin-lane.mjs) và ma
// trận ca (tests/scripts/repin-lane-dung-lai-model.test.mjs) rút từ CÙNG các khối này — thêm một lớp băm
// hay một lý do mà không thêm ca là ca «số ô lệch» đỏ.
//
// «Dùng lại» là carry theo nghĩa CONTEXT.md: phải minh bạch — làn nói ra từng lần dùng lại và nguồn của
// nó. Khoá `feature_loop.model_carry_cmd` vắng thì làn không gọi gì ở đây (hành vi trước vòng).
import { createHash } from 'node:crypto';
import path from 'node:path';
import { chayLenh } from './chay-lenh.mjs';

export const HAN_NGAY = 7;
export const HET_GIO_VAN_TAY_MS = 60000;

// <<<CARRY-INPUT-LAYERS
export const LOP_BAM = ['lệnh đã giải', 'tệp khớp paths', 'cây hồ sơ', 'tệp lệnh gọi tên', 'dấu vân tay môi trường'];
// CARRY-INPUT-LAYERS>>>

// Lý do của điều kiện đủ — eval model vẫn chạy thật dù có thể có nguồn.
// <<<CARRY-LY-DO-CHAY
export const LY_DO_CHAY = {
  vanTayThoat: 'lệnh dấu vân tay thoát khác 0',
  vanTayHetGio: 'lệnh dấu vân tay hết giờ',
  vanTayRong: 'lệnh dấu vân tay in rỗng',
  ep: 'ép bằng --chay-lai-model',
  allowDirty: 'làn chạy --allow-dirty',
  khongPaths: 'eval không khai paths',
  pathsKhongChung: 'paths có mục không chứng được',
  bienShell: 'lệnh có biến hoặc thay thế lệnh của shell',
  chuaCommit: 'cây hồ sơ hoặc tệp đầu vào chưa commit',
  lenhDaChay: 'lệnh đã chạy ở lượt này',
};
// CARRY-LY-DO-CHAY>>>

// Lý do của bước chọn nguồn.
// <<<CARRY-LY-DO-NGUON
export const LY_DO_NGUON = {
  bamDoi: 'băm đổi',
  chuaCo: 'chưa có nguồn cùng băm',
  quaHan: 'nguồn quá 7 ngày',
  lech: 'cùng băm từng cho kết quả khác',
};
// CARRY-LY-DO-NGUON>>>

// Hai tệp làn tự ghi vào hồ sơ ở mỗi lượt xanh — không phải đầu vào của phép đo.
export const TEP_LAN_GHI = ['run-log.jsonl', 'evidence-report.md'];

const sha256 = (s) => createHash('sha256').update(s).digest('hex');

// Lệnh dấu vân tay môi trường model: chạy MỘT lần mỗi lượt, đầu ra chỉ vào băm (không bao giờ trả về
// nguyên văn). Chạy bằng chayLenh của làn — hết giờ thì dừng cả cây tiến trình, không để lệnh dò treo làn.
export async function chayVanTay(cmd, { cwd, env, timeoutMs = HET_GIO_VAN_TAY_MS } = {}) {
  const h = chayLenh(cmd, { cwd, env });
  let hetGio = false;
  const hen = setTimeout(() => { hetGio = true; h.dung(); }, timeoutMs);
  const r = await h.done;
  clearTimeout(hen);
  if (hetGio) return { ok: false, lyDo: `${LY_DO_CHAY.vanTayHetGio} (${Math.round(timeoutMs / 100) / 10} giây)` };
  if (r.exit !== 0) return { ok: false, lyDo: `${LY_DO_CHAY.vanTayThoat} (mã ${r.exit})` };
  if (!r.out.trim()) return { ok: false, lyDo: LY_DO_CHAY.vanTayRong };
  return { ok: true, dau: sha256(r.out) };
}

const chuanTu = (s) => String(s).replace(/^["']+|["']+$/g, '').replace(/^(\.\/)+/, '').replace(/\/+$/, '');

// Tệp git-theo-dõi mà một từ của lệnh trỏ ĐÚNG tới — giải theo gốc kho và theo mỗi thư mục `cd` trong
// lệnh. Đối số của `cd` không phải từ trỏ tệp; tên thư mục không kéo cả thư mục (lệnh crm thật
// `cd apps/agent && bun test …` mà kéo trọn apps/agent thì gần mọi commit đổi băm). `--co=<tệp>` lấy phần
// sau `=`. Lệnh chạy cả một thư mục thì tệp phải nằm trong `paths` — giới hạn khai.
export function tepGoiTen(cmd, tep) {
  const tu = String(cmd).split(/[\s;|&()<>]+/).map(chuanTu).filter(Boolean);
  const cd = [];
  const laDoiCd = new Set();
  tu.forEach((t, i) => { if (t === 'cd' && i + 1 < tu.length) { cd.push(tu[i + 1]); laDoiCd.add(i + 1); } });
  const ra = new Set();
  tu.forEach((t, i) => {
    if (laDoiCd.has(i)) return;
    const x = chuanTu(t.includes('=') ? t.slice(t.lastIndexOf('=') + 1) : t);
    if (!x) return;
    for (const c of [x, ...cd.map(d => path.posix.normalize(`${d}/${x}`))]) if (tep.has(c)) ra.add(c);
  });
  return [...ra].sort();
}

// Biến hay thay thế lệnh của shell → lệnh có thể đọc tệp mà lớp «tệp lệnh gọi tên» không thấy.
// Gán biến đầu lệnh (`A=b cmd`) không có `$` nên không bị tính.
export const coBienShell = (cmd) => /[$`]/.test(String(cmd));

// Băm năm lớp, thứ tự cố định. Mỗi lớp MỘT dòng update — bản sao bỏ một dòng là phép phá của lớp ấy.
export function bamDauVao({ id, lenh, paths, hoSo, goiTen, vanTay, blob }) {
  const ds = (tep) => [...new Set(tep || [])].sort().map(f => `${f}\t${blob.get(f) || '-'}`).join('\n');
  const h = createHash('sha256').update(`g3-v1\n${id}\n`);
  h.update(`lop1\n${lenh}\n`);
  h.update(`lop2\n${ds(paths)}\n`);
  h.update(`lop3\n${ds(hoSo)}\n`);
  h.update(`lop4\n${ds(goiTen)}\n`);
  h.update(`lop5\n${vanTay}\n`);
  return h.digest('hex');
}

// Run-log: một dòng JSON mỗi bản ghi; dòng hỏng bỏ qua (cùng nếp bộ đọc sổ).
export function docRunLog(text) {
  const ra = [];
  for (const l of String(text || '').split('\n')) {
    if (!l.trim()) continue;
    try { const o = JSON.parse(l); if (o && typeof o === 'object') ra.push(o); } catch { /* dòng hỏng */ }
  }
  return ra;
}

const coBam = (o, id) => o && o.evals_hash && typeof o.evals_hash[id] === 'string';
const chayThat = (o, id) => o && o.kind === 'repin' && coBam(o, id) && !(o.evals_carry && Object.prototype.hasOwnProperty.call(o.evals_carry, id))
  && o.evals_exit && typeof o.evals_exit[id] === 'number';

// Nguồn = dòng `repin` MỚI NHẤT nơi eval THẬT SỰ chạy (chuỗi dàn phẳng), cùng băm, mã đạt kỳ vọng, `ts`
// không muộn hơn lượt này và không quá HAN_NGAY. Cùng băm từng lệch (carry_lech) thì không dùng lại.
export function chonNguon({ dong, id, bam, nowMs, laDat }) {
  if ((dong || []).some(o => o && (o.kind === 'repin' || o.kind === 'repin-do') && Array.isArray(o.carry_lech)
    && o.carry_lech.includes(id) && coBam(o, id) && o.evals_hash[id] === bam)) return { lyDo: LY_DO_NGUON.lech };
  const daChay = (dong || []).filter(o => chayThat(o, id));
  const ts = (o) => Date.parse(o.ts);
  // `ts` của làn chỉ đến giây — hai lượt cùng giây thì dòng đứng SAU trong sổ (ghi sau) thắng.
  const viTri = new Map((dong || []).map((o, i) => [o, i]));
  const hopLe = daChay.filter(o => o.evals_hash[id] === bam && laDat(o.evals_exit[id]) && Number.isFinite(ts(o)) && ts(o) <= nowMs)
    .sort((a, b) => (ts(b) - ts(a)) || (viTri.get(b) - viTri.get(a)));
  if (!hopLe.length) return { lyDo: daChay.some(o => o.evals_hash[id] !== bam) ? LY_DO_NGUON.bamDoi : LY_DO_NGUON.chuaCo };
  if (nowMs - ts(hopLe[0]) > HAN_NGAY * 86400000) return { lyDo: LY_DO_NGUON.quaHan };
  return { nguon: hopLe[0] };
}

// Eval chạy thật với băm từng có ở một lượt chạy thật trước đó mà mã thoát khác → cùng đầu vào, kết quả
// khác: `paths` thiếu đầu vào hoặc eval không tất định.
export function phatHienLech({ dong, id, bam, exit }) {
  return (dong || []).some(o => chayThat(o, id) && o.evals_hash[id] === bam && o.evals_exit[id] !== exit);
}
