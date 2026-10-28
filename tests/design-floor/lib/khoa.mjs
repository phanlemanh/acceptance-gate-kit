// Phép đo ra TỆP KHOÁ trên một gốc có hình upstream (bản ghim, bản dựng lại trước-vá, hay bản vendored đã
// vá): đóng kín của năm lệnh + phần VỎ kéo thêm, băm và số dòng từng tệp. Một hàm cho ba bên gọi —
// rao-dong.mjs --write (ghi), FN-01 (so với tệp khoá) và FN-02…04 (đóng kín giao đi) — để bên viết và bên
// đọc của tệp khoá không thể trôi khỏi nhau.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { GOC_KIT } from './hop-dong.mjs';
import { bam, dongKin, dongKinVo, soDong } from './upstream.mjs';

export async function doKhoa(hd, goc, gocKit = GOC_KIT) {
  const lenh = {};
  const tep = new Map();
  const them = (f, ten) => {
    if (!tep.has(f)) tep.set(f, { path: f, sha256: bam(join(goc, f)), dong: soDong(join(goc, f)), lenh: [] });
    tep.get(f).lenh.push(ten);
    return tep.get(f).dong;
  };
  for (const [ten, l] of Object.entries(hd.lenh)) {
    const dk = await dongKin(goc, l.entry);
    let dong = 0;
    for (const f of dk.tep) dong += them(f, ten);
    lenh[ten] = { entry: l.entry, tep: dk.tep.length, dong, ngoai: dk.ngoai, dong_kin: dk.tep };
  }
  // Vỏ: chỉ những tệp mà năm lệnh KHÔNG kéo — phần danh sách chép tăng vì vỏ.
  const vo = await dongKinVo(goc, join(gocKit, hd.vendor.vo));
  const rieng = vo.tep.filter((f) => !tep.has(f));
  let dongVo = 0;
  for (const f of rieng) dongVo += them(f, 'vo');
  const ngoaiVo = [...new Set(rieng.flatMap((f) => vo.ngoaiTheoTep[f] || []))].sort();
  lenh.vo = { entry: hd.vendor.vo, tep: rieng.length, dong: dongVo, ngoai: ngoaiVo, dong_kin: rieng };
  const ds = [...tep.values()].sort((a, b) => a.path.localeCompare(b.path));
  const triThuc = khoiTriThuc(goc);
  return {
    khoa: {
      schema: 1,
      sinh_boi: 'node tests/design-floor/rao-dong.mjs --write',
      nguon: { repo: hd.nguon.repo, commit: hd.nguon.commit },
      lenh: Object.fromEntries(Object.entries(lenh).map(([k, v]) => [k, { entry: v.entry, tep: v.tep, dong: v.dong, ngoai: v.ngoai }])),
      hop: { tep: ds.length, dong: ds.reduce((n, t) => n + t.dong, 0) },
      tep: ds,
      ...(triThuc ? { tri_thuc: triThuc } : {}),
    },
    lenh,
  };
}

// Khối tri thức (FL4): chỉ mục `knowledge/index.json` của bản ghim và mọi tệp nó trỏ — băm + byte. Lệnh S1 của vòng
// (scripts/design-floor-s1.mjs) chỉ tin tệp tri thức khớp khối này. Gốc không có chỉ mục (bản vendored chỉ mang mã)
// → không có khối; soKhoa chỉ so khối khi cả hai bên có.
export function khoiTriThuc(goc) {
  const cm = join(goc, 'knowledge', 'index.json');
  if (!existsSync(cm)) return null;
  const idx = JSON.parse(readFileSync(cm, 'utf8'));
  const tep = (idx.entries || []).map((e) => {
    const p = join(goc, e.path);
    return { id: e.id, path: e.path, sha256: existsSync(p) ? bam(p) : null, byte: existsSync(p) ? statSync(p).size : null };
  }).sort((a, b) => a.path.localeCompare(b.path));
  return { chi_muc: { path: 'knowledge/index.json', sha256: bam(cm), byte: statSync(cm).size }, tep };
}

// So một tệp khoá đã ghi với một phép đo lại — danh sách lệch dạng «+tệp», «-tệp», «~tệp (băm|lệnh)».
export function soKhoa(cu, moi) {
  const lech = [];
  if (JSON.stringify(cu.nguon) !== JSON.stringify(moi.nguon)) lech.push(`nguồn ${cu.nguon?.commit} ≠ ${moi.nguon.commit}`);
  const cuTep = new Map((cu.tep || []).map((t) => [t.path, t]));
  for (const t of moi.tep) {
    const c = cuTep.get(t.path);
    if (!c) lech.push(`+${t.path}`);
    else if (c.sha256 !== t.sha256) lech.push(`~${t.path} (băm)`);
    else if (JSON.stringify(c.lenh) !== JSON.stringify(t.lenh)) lech.push(`~${t.path} (lệnh)`);
    cuTep.delete(t.path);
  }
  for (const p of cuTep.keys()) lech.push(`-${p}`);
  if (JSON.stringify(cu.lenh) !== JSON.stringify(moi.lenh) && !lech.length) lech.push('tóm tắt lệnh lệch');
  if (cu.tri_thuc && moi.tri_thuc && JSON.stringify(cu.tri_thuc) !== JSON.stringify(moi.tri_thuc)) lech.push('khối tri_thuc lệch');
  return lech;
}
