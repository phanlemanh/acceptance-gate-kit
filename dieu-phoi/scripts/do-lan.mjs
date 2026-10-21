import fs from 'node:fs';
import path from 'node:path';
import { PHUT_MS } from './cau-hinh.mjs';
import { docJson, ghiJsonNguyenTu, ghiSuKien } from './dot.mjs';
import { thuMucMay } from './may.mjs';
import { dieuKienDuoiTai, nguongSucKhoe } from './suc-khoe.mjs';

export const LOAI_NANG = ['s4', 'ghim-lai', 'duong-nen'];
export const TAI_NGUYEN_NANG = ['s4', 'duong-nen'];
const MA_HA_TANG = [137, 143];
const TEN_NGUON = { so: 'sổ', 'cau-hinh': 'cấu hình', chua: 'chưa hiệu chuẩn' };

export const tepSoMay = () => path.join(thuMucMay(), 'do-lan.jsonl');
const tepLuot = (thuMuc, tn) => path.join(thuMuc, 'do-dang-chay', `${tn}.json`);
const tron = (x) => (Number.isFinite(x) ? Math.round(x * 100) / 100 : null);
const cungKho = (a, b) => (a ?? null) === (b ?? null);
const nho = (a, b) => (Number.isFinite(a) && Number.isFinite(b) ? Math.min(a, b) : Number.isFinite(a) ? a : b);
const lon = (a, b) => (Number.isFinite(a) && Number.isFinite(b) ? Math.max(a, b) : Number.isFinite(a) ? a : b);

export function docSoDo() {
  let text = '';
  try {
    text = fs.readFileSync(tepSoMay(), 'utf8');
  } catch {
    return [];
  }
  const ds = [];
  for (const dong of text.split('\n')) {
    if (!dong.trim()) continue;
    try {
      const r = JSON.parse(dong);
      if (r && typeof r === 'object' && !Array.isArray(r)) ds.push(r);
    } catch {
      continue;
    }
  }
  return ds;
}

function ghiDongSo(row) {
  fs.mkdirSync(thuMucMay(), { recursive: true });
  fs.appendFileSync(tepSoMay(), `${JSON.stringify(row)}\n`);
}

export function p95(ds) {
  const s = ds.filter(Number.isFinite).sort((a, b) => a - b);
  if (s.length === 0) return null;
  return s[Math.ceil(0.95 * s.length) - 1];
}

export const laSach = (r) => !r.duoi_tai && !r.ha_tang && !r.chong;

export function nhuCau({ kho, loai, cfg, so = docSoDo() }) {
  const n = nguongSucKhoe(cfg);
  const sach = so.filter((r) => cungKho(r.kho, kho) && r.loai === loai && laSach(r) && Number.isFinite(r.nhu_cau_gb)).map((r) => r.nhu_cau_gb);
  if (sach.length >= n.mau_hieu_chuan) return { gb: p95(sach), nguon: 'so' };
  const c = n.dinh_lan_gb?.[loai];
  if (Number.isFinite(c)) return { gb: c, nguon: 'cau-hinh' };
  return { gb: null, nguon: 'chua' };
}

export function batDauLuot(thuMuc, tn, chu, { sk, nguon, commit, nowMs }) {
  ghiJsonNguyenTu(tepLuot(thuMuc, tn), {
    phien: chu.phien,
    slug: chu.slug ?? null,
    loai: chu.loai,
    commit: commit ?? null,
    cap_luc: chu.cap_luc ?? new Date(nowMs).toISOString(),
    trong_luc_cap_gb: tron(sk.choTrongGb),
    ap_luc_luc_cap: sk.apLuc,
    nguon_nhu_cau: nguon,
    trong_min_gb: tron(sk.choTrongGb),
    ap_luc_max: sk.apLuc,
    swapin_mb_phut_max: tron(sk.tocDoSwapinMbPhut),
    chong: false,
    dong_ho_tu: null,
    duoi_tai: null,
    ket_thuc: null,
    ma: null,
    ha_tang_ly_do: null,
  });
}

export function capNhatLuot(thuMuc, tn, { sk, nowMs, cfg, chong }) {
  const p = tepLuot(thuMuc, tn);
  const d = docJson(p, null);
  if (!d) return;
  const n = nguongSucKhoe(cfg);
  d.trong_min_gb = tron(nho(d.trong_min_gb, sk.choTrongGb));
  d.ap_luc_max = lon(d.ap_luc_max, sk.apLuc);
  d.swapin_mb_phut_max = tron(lon(d.swapin_mb_phut_max, sk.tocDoSwapinMbPhut));
  if (chong) d.chong = true;
  const lyDo = dieuKienDuoiTai(sk, cfg);
  if (lyDo) d.dong_ho_tu ??= nowMs;
  else if (!d.duoi_tai) d.dong_ho_tu = null;
  if (!d.duoi_tai && lyDo && nowMs - d.dong_ho_tu >= n.duoi_tai_phut * PHUT_MS) d.duoi_tai = { tu: new Date(d.dong_ho_tu).toISOString(), ly_do: lyDo };
  ghiJsonNguyenTu(p, d);
}

export function ghiKetQuaNha(thuMuc, tn, { ma = null, haTang = null } = {}) {
  const p = tepLuot(thuMuc, tn);
  const d = docJson(p, null);
  if (!d) return;
  ghiJsonNguyenTu(p, { ...d, ma, ha_tang_ly_do: haTang });
}

export function danhDauThuHoi(thuMuc, tn) {
  const p = tepLuot(thuMuc, tn);
  const d = docJson(p, null);
  if (d) ghiJsonNguyenTu(p, { ...d, ket_thuc: 'thu-hoi' });
}

export function duocThuLai(row, so) {
  return !so.some((r) => r.duoi_tai && cungKho(r.kho, row.kho) && r.phien === row.phien && r.slug === row.slug && r.loai === row.loai && r.commit === row.commit);
}

export function khepLuot(thuMuc, tn, { kho, nowMs }) {
  const p = tepLuot(thuMuc, tn);
  const d = docJson(p, null);
  if (!d) return null;
  const so = docSoDo();
  const ketThuc = d.ket_thuc ?? 'nha';
  const row = {
    kho: kho ?? null,
    loai: d.loai,
    phien: d.phien,
    slug: d.slug,
    commit: d.commit,
    cap_luc: d.cap_luc,
    xong_luc: new Date(nowMs).toISOString(),
    trong_luc_cap_gb: d.trong_luc_cap_gb,
    ap_luc_luc_cap: d.ap_luc_luc_cap,
    nguon_nhu_cau: d.nguon_nhu_cau,
    nhu_cau_gb: Number.isFinite(d.trong_luc_cap_gb) && Number.isFinite(d.trong_min_gb) ? tron(Math.max(0, d.trong_luc_cap_gb - d.trong_min_gb)) : null,
    ap_luc_max: d.ap_luc_max,
    swapin_mb_phut_max: d.swapin_mb_phut_max,
    duoi_tai: d.duoi_tai,
    chong: d.chong === true,
    ket_thuc: ketThuc,
    ma: d.ma ?? null,
    ha_tang: ketThuc === 'thu-hoi' || MA_HA_TANG.includes(d.ma) || Boolean(d.ha_tang_ly_do),
    ...(d.ha_tang_ly_do ? { ha_tang_ly_do: d.ha_tang_ly_do } : {}),
  };
  ghiDongSo(row);
  fs.rmSync(p, { force: true });
  if (row.duoi_tai) ghiSuKien(thuMuc, { loai: 'luot-duoi-tai', phien: row.phien, slug: row.slug, tai_nguyen: tn, commit: row.commit, ly_do: row.duoi_tai.ly_do, duoc_thu_lai: duocThuLai(row, so) });
  return row;
}

export function dongLuotDaXong(thuMuc, dangGiu, { kho, nowMs }) {
  const d = path.join(thuMuc, 'do-dang-chay');
  if (!fs.existsSync(d)) return;
  for (const f of fs.readdirSync(d).filter((x) => x.endsWith('.json'))) {
    const tn = f.slice(0, -'.json'.length);
    const luot = docJson(path.join(d, f), null);
    const chu = dangGiu[tn];
    if (!luot || !chu || chu.phien !== luot.phien || chu.cap_luc !== luot.cap_luc) khepLuot(thuMuc, tn, { kho, nowMs });
  }
}

export function baoCaoHieuChuan({ kho, cfg, so = docSoDo() }) {
  const dong = [];
  for (const loai of LOAI_NANG) {
    const sach = so.filter((r) => cungKho(r.kho, kho) && r.loai === loai && laSach(r)).map((r) => r.nhu_cau_gb).filter(Number.isFinite);
    const n = nhuCau({ kho, loai, cfg, so });
    const p = p95(sach);
    dong.push(`${loai} · ${sach.length} lượt · p95 ${p === null ? '—' : `${p.toFixed(1)} GB`} · nguồn ${TEN_NGUON[n.nguon]}`);
  }
  for (const r of so.filter((x) => cungKho(x.kho, kho) && x.ha_tang)) {
    dong.push(`hạ tầng đốt: ${r.phien} ${r.slug} · trống ${Number.isFinite(r.trong_luc_cap_gb) ? r.trong_luc_cap_gb.toFixed(1) : '?'} GB · áp lực ${r.ap_luc_luc_cap ?? '?'}`);
  }
  return dong;
}
