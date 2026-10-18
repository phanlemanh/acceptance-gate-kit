// Kênh liên máy cho lệnh `tin` (hồ sơ vong-mo-co-chu-giu, thiết kế §3.2): bình luận issue GitHub qua `gh`, trạng thái
// cục bộ ở `<gốc kho chính>/.acceptance-runs/tin/kenh-<chủ>-<kho>-<số>.json` (tên máy, worktree giữ kênh, con trỏ, tin
// cuối đã biết, bản đã đồng bộ, dấu máy). Tên máy KHÔNG vào cấu hình commit: mỗi máy một tên. Bộ canh có chiều đỏ:
// trước khi đọc tiếp phải bắt lại được tin cuối đã biết, không thì thoát 3 nêu lý do — không bao giờ im.
import fs from 'node:fs';
import path from 'node:path';
import { docJson, ghiJsonNguyenTu, gocKhoChinh } from './dot.mjs';
import { bayGio } from './song.mjs';
import { docDongDau, gapSo, truongThan } from './tin-doc.mjs';
import { goiGh, tranMacDinh } from './tin-gh.mjs';
import { khoCua, loiGiaoViec } from './tin-giao.mjs';

const PHUT = 60_000;
export class LoiKenh extends Error {
  name = 'LoiKenh';
}
const loi = (s) => {
  throw new LoiKenh(s);
};

export function tachKenh(kenh) {
  const m = /^([\w.-]+)\/([\w.-]+)#(\d+)$/u.exec(String(kenh ?? ''));
  if (!m) loi(`kênh phải có dạng <chủ>/<kho>#<số>, nhận «${kenh}»`);
  return { chu: m[1], kho: m[2], so: m[3], ten: `${m[1]}/${m[2]}#${m[3]}` };
}

export const thuMucTin = (cwd) => path.join(gocKhoChinh(cwd), '.acceptance-runs', 'tin');
export const tepKenh = (cwd, k) => path.join(thuMucTin(cwd), `kenh-${k.chu}-${k.kho}-${k.so}.json`);
const rong = () => ({ may: null, worktree: null, con_tro: null, tin_cuoi: null, dong: [], may_su: [], chan: null, kenh_loi_chan_luc: null });
export const docTrangThai = (p) => ({ ...rong(), ...(docJson(p, null) ?? {}) });

const DUONG_DS = (k) => `repos/${k.chu}/${k.kho}/issues/${k.so}/comments`;

// Đọc bình luận mới từ con trỏ. Trả {doc_moi} hoặc {loi}. Không ghi gì khi lỗi.
export function dongBo(p, k, { tranMs = tranMacDinh() } = {}) {
  const tt = docTrangThai(p);
  const tuCon = tt.con_tro != null ? tt.dong.find((d) => d.id === tt.con_tro) : null;
  const q = tuCon ? `?per_page=100&since=${encodeURIComponent(tuCon.luc)}` : '?per_page=100';
  const r = goiGh(['api', '--paginate', `${DUONG_DS(k)}${q}`, '--jq', '.[] | {id, created_at, body}'], { tranMs });
  if (r.ma !== 0) return { loi: r.err || `gh thoát ${r.ma}` };
  let moi = 0;
  const daCo = new Set(tt.dong.map((d) => d.id));
  for (const l of r.out.split('\n')) {
    if (!l.trim()) continue;
    let c;
    try {
      c = JSON.parse(l);
    } catch {
      return { loi: `gh trả dòng không phải JSON: ${l.slice(0, 80)}` };
    }
    if (daCo.has(c.id) || (tt.con_tro != null && c.id <= tt.con_tro)) continue;
    tt.dong.push({ id: c.id, text: c.body ?? '', luc: c.created_at });
    daCo.add(c.id);
    moi++;
  }
  tt.dong.sort((a, b) => a.id - b.id);
  const cuoi = tt.dong[tt.dong.length - 1];
  if (cuoi) Object.assign(tt, { con_tro: cuoi.id, tin_cuoi: { id: cuoi.id, dong_dau: cuoi.text.split('\n')[0] } });
  fs.mkdirSync(path.dirname(p), { recursive: true });
  ghiJsonNguyenTu(p, tt);
  return { doc_moi: moi };
}

// Hàng lộ trình theo mã hay slug (ổ cắm lo_trinh.tep của _acceptance/config.yaml) — cho Kết quả và hạn của GIAO kênh.
function hangLoTrinh(cwd, khoa) {
  let cfg = '';
  try {
    cfg = fs.readFileSync(path.join(cwd, '_acceptance', 'config.yaml'), 'utf8');
  } catch {
    return null;
  }
  const tep = /^lo_trinh:\s*\n\s+tep:\s*(\S+)/mu.exec(cfg)?.[1];
  if (!tep) return null;
  const goc = docJson(path.join(cwd, tep), null);
  let thay = null;
  const di = (o) => {
    if (thay || !o || typeof o !== 'object') return;
    if (!Array.isArray(o) && (o.ma === khoa || o.slug === khoa) && typeof o.slug === 'string') thay = o;
    for (const v of Object.values(o)) di(v);
  };
  di(goc);
  return thay;
}

export function noiChuaKenhCua(cwd, kenh) {
  const k = tachKenh(kenh);
  const p = tepKenh(cwd, k);
  const tt0 = docTrangThai(p);
  if (!tt0.may) loi(`máy này chưa nhận vai cho kênh ${k.ten} — chạy: tin vai --kenh ${k.ten} --may <tên máy>`);
  const db = dongBo(p, k);
  if (db.loi) loi(`không đọc được kênh ${k.ten}: ${db.loi}`);
  return {
    loai: 'kenh',
    minh: tt0.may,
    kenh: k,
    tep: p,
    nc: {
      loai: 'kenh',
      doc() {
        const tt = docTrangThai(p);
        return { dong: [...tt.dong, ...tt.may_su], hong: 0 };
      },
      them(o) {
        if (o.may) {
          const tt = docTrangThai(p);
          tt.may_su.push(o);
          ghiJsonNguyenTu(p, tt);
          return;
        }
        const r = goiGh(['api', '-X', 'POST', DUONG_DS(k), '-f', `body=${o.text}`]);
        if (r.ma !== 0) loi(`không đăng được lên kênh ${k.ten}: ${r.err}`);
        const db2 = dongBo(p, k);
        if (db2.loi) loi(`đã đăng nhưng không đọc lại được kênh ${k.ten}: ${db2.loi}`);
      },
    },
    async suyLoiGiao({ yDinh, hang, ketQua, ranhGioi, kho, hanXongPhut }) {
      const h = hang ? hangLoTrinh(cwd, hang) : null;
      if (hang && !h && !ketQua) return { loi: `không thấy hàng ${hang} trong lộ trình của kho — ghi --ket-qua "<câu>"` };
      const kq = ketQua ?? (h ? `hồ sơ ${h.slug} qua Cổng Bằng chứng · PR vào main` : null);
      if (!kq) return { loi: 'không suy được Kết quả — ghi --hang <mã> hoặc --ket-qua "<câu>"' };
      const khoDich = kho ?? khoCua(cwd);
      const rg = ranhGioi ?? (khoDich ? `kho ${khoDich}${h?.ranh_gioi?.length ? ` · vùng ${h.ranh_gioi.join(', ')}` : ''}` : null);
      if (!rg) return { loi: 'không suy được Ranh giới — ghi --kho <chủ/kho> hoặc --ranh-gioi "<câu>"' };
      const gm = Array.isArray(h?.gio_may) ? h.gio_may[1] : Number.isFinite(h?.gio_may) ? h.gio_may : null;
      return {
        slug: h?.slug ?? null,
        truong: { y_dinh: yDinh, ket_qua: kq, ranh_gioi: rg, quyen: 'không tự gộp; việc phụ ghi hạt giống', bao_ve: `${tt0.may} trên ${k.ten}`, han_xong_phut: hanXongPhut ?? (gm != null ? Math.round(gm * 60) : null) },
      };
    },
    // Cửa sổ đo ngưỡng 2 (hợp đồng, Đường đo): mỗi trường một nghĩa, phán quyết in thẳng.
    demCuaSo({ tu, nowMs, json }) {
      const tuMs = Date.parse(tu);
      if (Number.isNaN(tuMs)) loi(`--tu phải là ngày ISO, nhận «${tu}»`);
      const tt = docTrangThai(p);
      const trong = tt.dong.filter((d) => Date.parse(d.luc) >= tuMs);
      const muc = gapSo(trong, { nowMs }).filter((v) => !v.yeu_cau_cu);
      const kq = { vong_da_dong: 0, vong_mo_qua_han_2: 0, vong_mo_chua_qua_han: 0, khuon_cu_co_dich: 0, bo_qua: 0, bo_qua_ma: [] };
      for (const v of muc) {
        if (['cho-chap-nhan', 'da-chap-nhan', 'dong'].includes(v.trang_thai)) kq.vong_da_dong++;
        else if (v.qua_han_nhan === 2 || v.qua_han_xong === 2) kq.vong_mo_qua_han_2++;
        else kq.vong_mo_chua_qua_han++;
      }
      for (const d of trong) {
        const dd = docDongDau(d.text);
        if (dd?.cu) {
          if (/→/u.test(d.text.split('\n')[0])) kq.khuon_cu_co_dich++;
        } else if (!dd) {
          kq.bo_qua++;
          kq.bo_qua_ma.push(d.id);
        }
      }
      const tong = trong.length;
      kq.phan_quyet = tong === 0 ? 'VÔ HIỆU' : kq.vong_mo_qua_han_2 + kq.khuon_cu_co_dich > 0 ? 'CHẾT' : kq.bo_qua > 0 ? `cần đếm tay ${kq.bo_qua} bình luận` : 'SỐNG';
      return json ? JSON.stringify(kq) : `${kq.phan_quyet} · đã đóng ${kq.vong_da_dong} · mở quá hạn mức 2 ${kq.vong_mo_qua_han_2} · mở chưa quá hạn ${kq.vong_mo_chua_qua_han} · khuôn cũ có đích ${kq.khuon_cu_co_dich} · bỏ qua ${kq.bo_qua}${kq.bo_qua ? ` (${kq.bo_qua_ma.join(', ')})` : ''}`;
    },
  };
}

export function vai(cwd, co) {
  if (!co.kenh || !co.may) loi('dùng: tin vai --kenh <chủ/kho#số> --may <tên máy>');
  if (!/^[A-Za-z0-9]+$/u.test(co.may)) loi('tên máy chỉ gồm chữ và số (thành tiền tố mã tin)');
  const k = tachKenh(co.kenh);
  const p = tepKenh(cwd, k);
  const tt = docTrangThai(p);
  const wt = fs.realpathSync(cwd);
  Object.assign(tt, { may: co.may, worktree: wt });
  fs.mkdirSync(path.dirname(p), { recursive: true });
  ghiJsonNguyenTu(p, tt);
  return `vai: máy ${co.may} giữ kênh ${k.ten} ở ${wt}`;
}

// Bộ canh: bắt lại tin cuối đã biết rồi mới đọc tiếp. --cho: chờ tới khi có tin gửi máy mình. Lỗi → thoát 3.
export async function canh(cwd, co, { nhipMs = Number(process.env.DIEU_PHOI_TIN_NHIP_MS || 60_000), tranMs = tranMacDinh() } = {}) {
  const loiCanh = (s) => {
    const e = new LoiKenh(`canh: ${s}`);
    e.maThoat = 3;
    throw e;
  };
  if (!co.kenh) loi('dùng: tin canh --kenh <chủ/kho#số> [--cho]');
  const k = tachKenh(co.kenh);
  const p = tepKenh(cwd, k);
  const tt = docTrangThai(p);
  if (!tt.may) loi(`máy này chưa nhận vai cho kênh ${k.ten}`);
  const batLai = () => {
    const t = docTrangThai(p);
    if (!t.tin_cuoi) return null;
    const r = goiGh(['api', `repos/${k.chu}/${k.kho}/issues/comments/${t.tin_cuoi.id}`, '--jq', '{id, body}'], { tranMs });
    if (r.ma !== 0) loiCanh(`không bắt lại được tin cuối ${t.tin_cuoi.id} — ${/quá trần/u.test(r.err) ? `quá trần (${r.err})` : r.err}`);
    let c;
    try {
      c = JSON.parse(r.out.trim().split('\n')[0]);
    } catch {
      loiCanh(`không bắt lại được tin cuối ${t.tin_cuoi.id} — gh trả không phải JSON`);
    }
    if (String(c.body ?? '').split('\n')[0] !== t.tin_cuoi.dong_dau) loiCanh(`không bắt lại được tin cuối ${t.tin_cuoi.id} — dòng đầu khác`);
    return t.tin_cuoi.id;
  };
  const truoc = batLai();
  const db = dongBo(p, k, { tranMs });
  if (db.loi) loiCanh(`không đọc được kênh — ${/quá trần/u.test(db.loi) ? `quá trần (${db.loi})` : db.loi}`);
  if (!co.cho) return `canh: bắt lại ${truoc ?? '(chưa có tin cuối)'} · đọc mới ${db.doc_moi}`;
  const daThay = new Set(docTrangThai(p).dong.map((d) => d.id));
  for (;;) {
    await new Promise((ok) => setTimeout(ok, nhipMs));
    batLai();
    const d2 = dongBo(p, k, { tranMs });
    if (d2.loi) loiCanh(`không đọc được kênh — ${d2.loi}`);
    const moi = docTrangThai(p).dong.filter((d) => !daThay.has(d.id));
    for (const d of moi) {
      daThay.add(d.id);
      const dd = docDongDau(d.text);
      if (dd && !dd.cu && dd.den === tt.may) return d.text.split('\n')[0];
    }
  }
}

// Dùng cho hook (việc 4–5): đồng bộ có trần, không ném — trả {loi} khi không đọc được.
export function dongBoAnToan(cwd, k, tranMs) {
  try {
    return dongBo(tepKenh(cwd, k), k, { tranMs });
  } catch (e) {
    return { loi: e.message };
  }
}

export { truongThan, bayGio, PHUT };
