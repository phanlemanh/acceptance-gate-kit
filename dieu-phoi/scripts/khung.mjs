// Hàm vẽ THUẦN của khung trạng thái đợt (DP6b, hồ sơ trang-thai-dot-dieu-phoi-tho, thiết kế §2.2). Phần mod
// `hooks/mod/khung.ts` import tệp này, mà module mod chỉ nhận tệp tương đối và `claude-code` — nên tệp này KHÔNG
// import gì. Đầu vào là kết quả `dieu-phoi.mjs xem --json` (hoặc `{ loi }` khi lời gọi CLI hỏng).

export const CHU_KY_MS = { co_dot: 20000, khong_dot: 120000 };
export const DONG_LOI = 'khung: không đọc được đợt';

// Nhịp làm mới: kho không có đợt thì thưa (120″); có đợt — kể cả lần đọc lỗi — thì 20″.
export const chuKy = (kq) => (kq && kq.dot === null ? CHU_KY_MS.khong_dot : CHU_KY_MS.co_dot);

// HH:MM của một mốc ISO theo độ lệch phút mà CLI báo: giờ máy của môi trường mod không đáng tin.
export function gioPhut(iso, lechPhut) {
  const ms = Date.parse(iso ?? '');
  if (!Number.isFinite(ms)) return null;
  const d = new Date(ms + (Number(lechPhut) || 0) * 60000);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
}

// Dải một dòng trên ô nhập; `null` = không vẽ gì (kho không có đợt). `cot` cắt chuỗi, ký tự cuối là `…`.
export function veDai(kq, { cot } = {}) {
  if (!kq || kq.dot === null) return null;
  let s;
  if (kq.loi) s = DONG_LOI;
  else if (kq.chua_co_nhip) s = `Đợt ${kq.dot} · ${kq.pha} · chưa có nhịp`;
  else {
    const k = (kq.khoa ?? []).find((x) => x.tai_nguyen === 's4');
    const gio = k ? gioPhut(k.han, kq.mui_gio_phut) : null;
    const s4 = k ? `S4: ${k.phien}${gio ? ` → ${gio}` : ''}` : kq.cho_may ? 'S4: chờ khoá máy' : 'S4: trống';
    s = `Đợt ${kq.dot} · ${kq.pha} · ${s4} · chờ lượt ${(kq.hang_cho ?? []).length} · cần anh ${canAnh(kq).length}`;
    const d = kq.day_cua_cwd ? (kq.day ?? []).find((x) => x.id === kq.day_cua_cwd) : null;
    if (d) s += ` · Dãy ${d.id}: ${d.hang ?? '—'} · ${d.tien_do ?? '—'}`;
    if (kq.giam_tai) s = `GIẢM TẢI · ${s}`;
  }
  if (Number.isFinite(cot) && s.length > cot) s = cot >= 1 ? `${s.slice(0, cot - 1)}…` : '…';
  return s;
}

// ================= Khung định vị (hồ sơ khung-dot-dinh-vi, ADR 0027 bước a–b) =================
// Pane «Đợt» vẽ `chuKhung`, không vẽ chữ `xem`: chữ `xem` là cho máy đọc. Mọi khoá mới của `xem --json` (tên việc,
// mục tiêu, số hàng đã gộp, câu giám sát) có thể vắng — kho cũ, bản CLI trước — thì dòng của nó mang cờ ⚠, không ném.

const CO = '⚠';
export const LOAI_CHO = { idle_prompt: 'chờ anh trả lời', permission_prompt: 'xin quyền' };
export const TIEN_DO = { chua: 'chưa bắt đầu', dang: 'đang làm', ky: 'đã ký, chờ gộp', gop: 'đã gộp', xong: 'hết hàng' };
const hai = (n) => String(n).padStart(2, '0');

// Giờ địa phương theo độ lệch phút CLI báo: `{ ms, d }` với d là Date đã dời (đọc bằng getUTC*).
function diaPhuong(iso, lechPhut) {
  const ms = Date.parse(iso ?? '');
  return Number.isFinite(ms) ? { ms, d: new Date(ms + (Number(lechPhut) || 0) * 60000) } : null;
}
const ngayCua = (d) => `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;

// «vừa xong» · «n phút trước» · «n giờ trước» · «hôm qua HH:MM» · «DD/MM HH:MM»; mốc tương lai → «tới HH:MM».
// Không bao giờ in ISO, mili-giây hay «Z». Mốc không đọc được → null (bên gọi bỏ vế giờ).
export function tuongDoi(iso, { bayGio, lechPhut = 0 } = {}) {
  const m = diaPhuong(iso, lechPhut);
  if (!m || !Number.isFinite(bayGio)) return null;
  const hhmm = `${hai(m.d.getUTCHours())}:${hai(m.d.getUTCMinutes())}`;
  const tre = bayGio - m.ms;
  if (tre < 0) return `tới ${hhmm}`;
  if (tre < 60000) return 'vừa xong';
  if (tre < 3600000) return `${Math.floor(tre / 60000)} phút trước`;
  if (tre < 86400000) return `${Math.floor(tre / 3600000)} giờ trước`;
  const homQua = new Date(new Date(bayGio + (Number(lechPhut) || 0) * 60000).getTime() - 86400000);
  if (ngayCua(homQua) === ngayCua(m.d)) return `hôm qua ${hhmm}`;
  return `${hai(m.d.getUTCDate())}/${hai(m.d.getUTCMonth() + 1)} ${hhmm}`;
}

// Tên một việc: tên ngắn từ tệp lộ trình, mã đứng sau trong ngoặc. Không tra được tên → mã/slug kèm cờ — dòng
// «là gì» không bao giờ chỉ có mã trần.
export function tenViec(d) {
  if (!d || (!d.hang && !d.ma)) return '—';
  if (d.ten) return d.ma ? `${d.ten} (${d.ma})` : d.ten;
  return `${d.ma ?? d.hang} (chưa có tên trong lộ trình)`;
}

// MỌI việc đang chờ chủ kho, cũ nhất trước: tệp chờ người và yêu cầu `can-nguoi` của thợ, lời báo sức khoẻ máy, câu
// phiên giám sát hỏi trong chat. Dải và khung đếm bằng CÙNG hàm này, nên hai số không lệch.
export function canAnh(kq) {
  if (!kq) return [];
  const dayCua = new Map((kq.day ?? []).map((d) => [d.id, d]));
  const ra = [];
  for (const c of kq.cho_nguoi ?? []) {
    const viec = tenViec(dayCua.get(c.phien));
    const la = c.loai === 'can-nguoi' ? `${c.tin}${viec !== '—' ? ` — việc ${viec}` : ''}` : `${viec !== '—' ? viec : `dãy ${c.phien}`} — ${LOAI_CHO[c.loai] ?? 'chờ anh'}`;
    ra.push({ la_gi: la, o: `dãy ${c.phien}`, luc: c.luc ?? null });
  }
  if (kq.can_nguoi) ra.push({ la_gi: `máy cần anh xem: ${kq.can_nguoi}`, o: 'máy chạy đợt', luc: kq.nhip_cuoi ?? null });
  for (const h of kq.hoi_chu_kho ?? []) ra.push({ la_gi: h.cau, o: 'phiên giám sát', luc: h.luc ?? null });
  const ms = (x) => (Number.isFinite(Date.parse(x.luc ?? '')) ? Date.parse(x.luc) : Infinity);
  return ra.map((x, i) => ({ x, i })).sort((a, b) => ms(a.x) - ms(b.x) || a.i - b.i).map(({ x }) => x);
}

// Mỗi dãy không nghỉ vào ĐÚNG MỘT nhóm, theo thứ tự ưu tiên: đang chấm (giữ khoá s4) · chờ (chờ người, chờ lượt,
// đã ký chờ gộp, chờ phụ thuộc) · rảnh (không hàng) · đang làm.
export function nhomDay(d, kq) {
  if (d.nghi) return null;
  if ((kq.khoa ?? []).some((k) => k.tai_nguyen === 's4' && k.phien === d.id)) return 'đang chấm';
  const choNguoi = (kq.cho_nguoi ?? []).some((c) => c.phien === d.id);
  const choLuot = (kq.hang_cho ?? []).some((h) => h.phien === d.id);
  if (choNguoi || choLuot || d.tien_do === 'ky' || d.tien_do === 'cho') return 'chờ';
  if (!d.hang) return 'rảnh';
  return 'đang làm';
}

function trangThaiDay(d, kq, gio) {
  const k = (kq.khoa ?? []).find((x) => x.tai_nguyen === 's4' && x.phien === d.id);
  const phan = [];
  if (k) {
    const t = gio(k.han);
    phan.push(`đang chấm${t ? `, khoá ${t}` : ''}`);
  } else if (d.tien_do === 'cho') phan.push(`chờ việc ${d.cho ?? 'trước'} xong`);
  else phan.push(TIEN_DO[d.tien_do] ?? (d.hang ? 'đang làm' : 'rảnh'));
  for (const h of kq.hang_cho ?? []) if (h.phien === d.id) phan.push(`chờ lượt ${h.loai}`);
  if ((kq.cho_nguoi ?? []).some((c) => c.phien === d.id)) phan.push('chờ anh');
  return phan.join(' · ');
}

// Khung định vị cho người: mục tiêu đợt · tiến độ · CẦN ANH · việc từng dãy · lúc cập nhật. `bayGio` là ms.
export function chuKhung(kq, { bayGio = Date.now() } = {}) {
  if (!kq || kq.dot === null) return 'không có đợt nào đang chạy';
  if (kq.loi) return `${DONG_LOI}\n${kq.loi}`;
  const lech = kq.mui_gio_phut;
  const gio = (iso) => tuongDoi(iso, { bayGio, lechPhut: lech });
  const dong = [`Đợt ${kq.dot} — ${kq.muc_tieu ? kq.muc_tieu : `${CO} chưa khai mục tiêu đợt`}`];
  const ds = (kq.day ?? []).filter((d) => !d.nghi);
  if (kq.chua_co_nhip) dong.push('Tiến độ: chưa có nhịp nào — bộ phát lịch chưa chạy');
  else {
    const dem = { 'đang làm': 0, 'đang chấm': 0, chờ: 0, rảnh: 0 };
    for (const d of ds) dem[nhomDay(d, kq)] += 1;
    const xong = Number.isFinite(kq.da_gop) && Number.isFinite(kq.so_hang) ? `${kq.da_gop}/${kq.so_hang}` : `—/${Number.isFinite(kq.so_hang) ? kq.so_hang : '—'} ${CO}`;
    dong.push(`Tiến độ: xong ${xong} · ${Object.entries(dem).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
  }
  const can = canAnh(kq);
  dong.push(`CẦN ANH: ${can.length}`);
  for (const c of can) {
    const t = gio(c.luc);
    dong.push(`  · ${c.la_gi} — ở ${c.o}${t ? ` — ${t}` : ''}`);
  }
  if (kq.giam_tai) dong.push(`${CO} Máy đang giảm tải — không cấp lượt nặng mới${(kq.ly_do_giam_tai ?? []).length ? `: ${kq.ly_do_giam_tai.join(', ')}` : ''}`);
  if (!kq.chua_co_nhip) {
    dong.push('Việc:');
    for (const d of ds) dong.push(`  ${d.id} · ${tenViec(d)} · ${trangThaiDay(d, kq, gio)}`);
  }
  if (kq.canh_bao) dong.push(`${CO} ${kq.canh_bao}`);
  const t = gio(kq.nhip_cuoi);
  dong.push(`${t ? `Cập nhật ${t} · ` : ''}chi tiết máy: /dieu-phoi:xem`);
  return dong.join('\n');
}
