#!/usr/bin/env node
// Rào đóng kín của design-floor — đo những module mà năm lệnh v1 kéo theo trong bản upstream
// đã ghim, rồi kiểm bốn luật của hợp đồng nhập (design-floor/HOP-DONG-NHAP.md):
//   FN-01 tệp khoá (design-floor/upstream.lock.json) khớp phép đo lại — băm từng tệp, đóng kín từng lệnh
//   FN-02 không module nào khớp danh sách cấm (memory-*, figma-*, adapters/, init)
//   FN-03 không import mạng, không token mạng trong mã đã bỏ chú thích
//   FN-04 hợp đóng kín của năm lệnh không vượt trần (tệp · dòng)
// Tệp khoá là DANH SÁCH CHÉP của bước 2: đúng các tệp này sẽ vào kit, mỗi tệp kèm băm.
//
// Dùng: node tests/design-floor/rao-dong.mjs [--write] [--hop-dong <md>] [--khoa <json>]
//   --write  ghi lại tệp khoá từ phép đo (chỉ khi đổi ghim, có chủ đích) rồi thoát 0
// Thoát 0 khi mọi luật PASS/XFAIL; 1 khi có FAIL/XPASS; 2 khi không đo được (lấy nguồn hỏng…).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { GOC_KIT, docDoiSo, docHopDong, inKetQua, phanXu } from './lib/hop-dong.mjs';
import { bam, boChuThich, chuanBiNguon, dongKin, soDong } from './lib/upstream.mjs';

const ds = docDoiSo(process.argv.slice(2));
const hd = docHopDong(ds.hopDong);

async function do_() {
  const goc = chuanBiNguon(hd);
  const lenh = {};
  const tep = new Map();
  for (const [ten, l] of Object.entries(hd.lenh)) {
    const dk = await dongKin(goc, l.entry);
    let dong = 0;
    for (const f of dk.tep) {
      if (!tep.has(f)) tep.set(f, { path: f, sha256: bam(join(goc, f)), dong: soDong(join(goc, f)), lenh: [] });
      tep.get(f).lenh.push(ten);
      dong += tep.get(f).dong;
    }
    lenh[ten] = { entry: l.entry, tep: dk.tep.length, dong, ngoai: dk.ngoai, dong_kin: dk.tep };
  }
  const ds_tep = [...tep.values()].sort((a, b) => a.path.localeCompare(b.path));
  return {
    goc,
    khoa: {
      schema: 1,
      sinh_boi: 'node tests/design-floor/rao-dong.mjs --write',
      nguon: { repo: hd.nguon.repo, commit: hd.nguon.commit },
      lenh: Object.fromEntries(Object.entries(lenh).map(([k, v]) => [k, { entry: v.entry, tep: v.tep, dong: v.dong, ngoai: v.ngoai }])),
      hop: { tep: ds_tep.length, dong: ds_tep.reduce((n, t) => n + t.dong, 0) },
      tep: ds_tep,
    },
    lenh,
  };
}

let ketQua;
try {
  ketQua = await do_();
} catch (e) {
  console.error(`rao-dong: KHÔNG đo được — ${e.message}`);
  process.exit(2);
}
const { goc, khoa, lenh } = ketQua;
const json = `${JSON.stringify(khoa, null, 2)}\n`;

if (ds.ghi) {
  writeFileSync(ds.khoa, json);
  console.log(`rao-dong: đã ghi ${relative(GOC_KIT, ds.khoa)} — ${khoa.hop.tep} tệp · ${khoa.hop.dong} dòng`);
  process.exit(0);
}

console.log(`rao-dong: ${hd.nguon.repo} @ ${hd.nguon.commit.slice(0, 7)} — hợp ${khoa.hop.tep} tệp · ${khoa.hop.dong} dòng`);
for (const [ten, l] of Object.entries(khoa.lenh)) console.log(`  · ${ten}: ${l.tep} tệp · ${l.dong} dòng`);
let ok = true;

// FN-01 — tệp khoá là lời tự xưng; nó chỉ đáng tin khi phép đo lại cho đúng từng byte.
{
  const kq = { do: false };
  if (!existsSync(ds.khoa)) Object.assign(kq, { do: true, chi_tiet: `thiếu ${relative(GOC_KIT, ds.khoa)} — chạy --write` });
  else {
    const cu = JSON.parse(readFileSync(ds.khoa, 'utf8'));
    const lech = [];
    if (JSON.stringify(cu.nguon) !== JSON.stringify(khoa.nguon)) lech.push(`nguồn ${cu.nguon?.commit} ≠ ${khoa.nguon.commit}`);
    const cuTep = new Map((cu.tep || []).map((t) => [t.path, t]));
    for (const t of khoa.tep) {
      const c = cuTep.get(t.path);
      if (!c) lech.push(`+${t.path}`);
      else if (c.sha256 !== t.sha256) lech.push(`~${t.path} (băm)`);
      else if (JSON.stringify(c.lenh) !== JSON.stringify(t.lenh)) lech.push(`~${t.path} (lệnh)`);
      cuTep.delete(t.path);
    }
    for (const p of cuTep.keys()) lech.push(`-${p}`);
    if (JSON.stringify(cu.lenh) !== JSON.stringify(khoa.lenh) && !lech.length) lech.push('tóm tắt lệnh lệch');
    if (lech.length) Object.assign(kq, { do: true, chi_tiet: `tệp khoá lệch phép đo: ${lech.slice(0, 8).join(', ')}${lech.length > 8 ? ` (+${lech.length - 8})` : ''}` });
  }
  ok = inKetQua('FN-01', 'tệp khoá khớp phép đo lại', phanXu(hd, 'FN-01', kq), kq.chi_tiet) && ok;
}

// FN-02 — danh sách cấm. Vi phạm ghi «<lệnh> <tệp>» để giới hạn đã khai so được bằng tập.
{
  const luat = hd.rao.cam.map((c) => ({ ...c, re: new RegExp(c.re) }));
  const vp = [];
  for (const [ten, l] of Object.entries(lenh)) for (const f of l.dong_kin) if (luat.some((c) => c.re.test(f))) vp.push(`${ten} ${f}`);
  const kq = vp.length ? { do: true, danh_sach: vp, chi_tiet: `${vp.length} module cấm: ${vp.join(', ')}` } : { do: false };
  ok = inKetQua('FN-02', `không module cấm (${hd.rao.cam.map((c) => c.ten).join(', ')})`, phanXu(hd, 'FN-02', kq), vp.length ? `${vp.length} cặp lệnh·module` : '') && ok;
}

// FN-03 — mạng: import ngoài khớp danh sách, hoặc token gọi mạng trong mã đã bỏ chú thích.
{
  const cam = new Set(hd.rao.cam_mang);
  const token = hd.rao.cam_token_mang.map((t) => new RegExp(t));
  const vp = [];
  for (const [ten, l] of Object.entries(khoa.lenh)) for (const n of l.ngoai) if (cam.has(n)) vp.push(`${ten} import ${n}`);
  for (const t of khoa.tep) {
    const ma = boChuThich(join(goc, t.path));
    for (const re of token) if (re.test(ma)) vp.push(`${t.path} /${re.source}/`);
  }
  const kq = vp.length ? { do: true, chi_tiet: vp.join(', ') } : { do: false };
  ok = inKetQua('FN-03', 'không đường mạng trong đóng kín', phanXu(hd, 'FN-03', kq)) && ok;
}

// FN-04 — trần. Đổi ghim làm đóng kín phình là một quyết định phải nhìn thấy: sửa trần trong hợp đồng.
{
  const { tep, dong } = hd.rao.tran;
  const kq = khoa.hop.tep > tep || khoa.hop.dong > dong
    ? { do: true, chi_tiet: `hợp ${khoa.hop.tep} tệp · ${khoa.hop.dong} dòng vượt trần ${tep} tệp · ${dong} dòng` }
    : { do: false };
  ok = inKetQua('FN-04', `đóng kín trong trần (${tep} tệp · ${dong} dòng)`, phanXu(hd, 'FN-04', kq)) && ok;
}

console.log(ok ? 'rao-dong: XANH (gồm giới hạn đã khai)' : 'rao-dong: ĐỎ');
process.exit(ok ? 0 : 1);
