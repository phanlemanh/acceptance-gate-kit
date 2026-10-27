#!/usr/bin/env node
// Rào đóng kín của design-floor — chạy NGOẠI TUYẾN trên bản vendored trong kit và kiểm sáu luật:
//   VA-01 bản vendored = tệp khoá (băm upstream) + sổ LOCAL-PATCHES (băm sau vá); tệp lệch ngoài sổ → đỏ đúng tệp
//   FN-01 đảo mọi bản vá đã áp → đúng băm tệp khoá, và đóng kín đo lại (năm lệnh + vỏ) khớp tệp khoá
//   FN-02 đóng kín GIAO ĐI không có module cấm (memory-*, figma-*, adapters/, init)
//   FN-03 đóng kín giao đi không import mạng, không token mạng trong mã đã bỏ chú thích
//   FN-04 đóng kín giao đi không vượt trần (tệp · dòng)
//   BG-01 bản gói đã commit = bản dựng lại từ nguồn, từng byte — tại chỗ và từ một bản sao ở đường khác
// Tệp khoá là DANH SÁCH CHÉP: đúng các tệp này nằm trong design-floor/vendor/design-os, mỗi tệp kèm băm.
//
// Dùng: node tests/design-floor/rao-dong.mjs [--write] [--chi VA-01,BG-01] [--hop-dong <md>] [--khoa <json>] [--goc <gốc kit>]
//   --write  đo bản ghim upstream (qua mạng) và ghi lại tệp khoá — chỉ khi đổi ghim hay đổi vỏ, có chủ đích
// Thoát 0 khi mọi luật PASS/XFAIL; 1 khi có FAIL/XPASS; 2 khi không đo được (thiếu bản vendored…).
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { docDoiSo, docHopDong, inKetQua, phanXu, soVaTai } from './lib/hop-dong.mjs';
import { doKhoa, soKhoa } from './lib/khoa.mjs';
import { apVa, bam, bamBuf, boChuThich, chuanBiNguon, dungBanGoi, layUpstream, tepCuaVa } from './lib/upstream.mjs';

const ds = docDoiSo(process.argv.slice(2));
const hd = docHopDong(ds.hopDong);
const GOC = ds.goc;
const muon = (id) => !ds.chi || ds.chi.has(id);

if (ds.ghi) {
  try {
    const { khoa } = await doKhoa(hd, layUpstream(hd), GOC);
    writeFileSync(ds.khoa, `${JSON.stringify(khoa, null, 2)}\n`);
    console.log(`rao-dong: đã ghi ${relative(GOC, ds.khoa)} — ${khoa.hop.tep} tệp · ${khoa.hop.dong} dòng`);
    process.exit(0);
  } catch (e) {
    console.error(`rao-dong: KHÔNG đo được bản ghim — ${e.message}`);
    process.exit(2);
  }
}

let so, khoaCu, vendor;
try {
  so = soVaTai(hd, GOC);
  khoaCu = JSON.parse(readFileSync(ds.khoa, 'utf8'));
  vendor = chuanBiNguon(hd, GOC);
} catch (e) {
  console.error(`rao-dong: KHÔNG đo được — ${e.message}`);
  process.exit(2);
}
const daAp = so.ban_va.filter((d) => d.trang_thai === 'da-ap');
const TMP = mkdtempSync(join(tmpdir(), 'design-floor-rao-'));
let ok = true;

function liet(dir) {
  return readdirSync(dir, { recursive: true }).filter((f) => statSync(join(dir, f)).isFile()).map((f) => f.split('\\').join('/')).sort();
}

// VA-01 — bản vendored là lời tự xưng; nó chỉ đáng tin khi từng byte khớp tệp khoá cộng chuỗi bản vá đã áp của sổ.
// Sổ đọc theo CHUỖI từng tệp, theo thứ tự khối máy: truoc của bản vá đầu = băm tệp khoá (null khi bản vá tạo tệp),
// truoc của bản sau = sau của bản trước, sau cuối = băm tệp vendored (null khi bản vá xoá tệp).
if (muon('VA-01')) {
  const lech = [];
  const BAT_BUOC = ['id', 'trang_thai', 'ten', 'vi_sao', 'lam_xanh'];
  const chuoi = new Map();
  for (const d of so.ban_va) {
    const can = d.trang_thai === 'da-ap' ? [...BAT_BUOC, 'tep_va', 'tep'] : BAT_BUOC;
    for (const k of can) if (d[k] === undefined || d[k] === '' || (Array.isArray(d[k]) && !d[k].length)) lech.push(`dòng ${d.id ?? '?'} thiếu ${k}`);
    if (!['da-ap', 'cho-va'].includes(d.trang_thai)) lech.push(`dòng ${d.id}: trang_thai «${d.trang_thai}» ngoài {da-ap, cho-va}`);
    if (d.trang_thai !== 'da-ap' || !d.tep_va) continue;
    const tepVa = join(GOC, d.tep_va);
    if (!existsSync(tepVa)) { lech.push(`dòng ${d.id}: thiếu tệp diff ${d.tep_va}`); continue; }
    const chamDiff = tepCuaVa(tepVa);
    const chamSo = (d.tep || []).map((t) => t.path).sort();
    if (JSON.stringify(chamDiff) !== JSON.stringify(chamSo)) lech.push(`dòng ${d.id}: tệp trong sổ (${chamSo.join(', ')}) ≠ tệp diff chạm (${chamDiff.join(', ')})`);
    for (const t of d.tep || []) {
      if (!chuoi.has(t.path)) chuoi.set(t.path, []);
      chuoi.get(t.path).push({ d, t });
    }
  }
  const khoaTep = new Map(khoaCu.tep.map((t) => [t.path, t.sha256]));
  const thuc = liet(vendor);
  const thucSet = new Set(thuc);
  for (const f of thuc) if (!khoaTep.has(f) && !chuoi.has(f)) lech.push(`+${f} (tệp lạ, ngoài tệp khoá và sổ vá)`);
  for (const f of khoaTep.keys()) if (!thucSet.has(f) && !chuoi.has(f)) lech.push(`-${f} (thiếu, có trong tệp khoá)`);
  for (const f of new Set([...khoaTep.keys(), ...chuoi.keys()])) {
    const co = thucSet.has(f) ? bam(join(vendor, f)) : null;
    const cac = chuoi.get(f);
    if (!cac) {
      if (co !== null && co !== khoaTep.get(f)) lech.push(`~${f} (băm lệch tệp khoá, ngoài sổ vá)`);
      continue;
    }
    let hienTai = khoaTep.get(f) ?? null;
    let truocDo = khoaTep.has(f) ? 'băm tệp khoá' : 'null (tệp chưa có trong tệp khoá)';
    for (const { d, t } of cac) {
      if ((t.truoc ?? null) !== hienTai) lech.push(`~${f} (truoc của bản vá ${d.id} ≠ ${truocDo})`);
      hienTai = t.sau ?? null;
      truocDo = `sau của bản vá ${d.id}`;
    }
    if (co !== hienTai) lech.push(`~${f} (băm ≠ sau của bản vá ${cac[cac.length - 1].d.id})`);
  }
  const kq = lech.length ? { do: true, chi_tiet: `bản vendored lệch: ${lech.join(', ')}` } : { do: false };
  const nVa = new Set([...chuoi.keys()]).size;
  ok = inKetQua('VA-01', 'bản vendored khớp tệp khoá + sổ vá', phanXu(hd, 'VA-01', kq, so),
    kq.do ? '' : `${thuc.length} tệp = tệp khoá + chuỗi ${daAp.length} bản vá đã áp (${daAp.map((d) => d.id).join(', ')}) chạm ${nVa} tệp`) && ok;
}

// FN-01 — tệp khoá chỉ đáng tin khi đảo các bản vá ra đúng nó, và đo lại đóng kín cho đúng từng byte.
if (muon('FN-01')) {
  const truoc = join(TMP, 'truoc-va');
  cpSync(vendor, truoc, { recursive: true });
  const lech = [];
  for (const d of [...daAp].reverse()) {
    try { apVa(truoc, join(GOC, d.tep_va), { nguoc: true }); } catch (e) {
      lech.push(`bản vá ${d.id} không đảo được: ${String(e.stderr || e.message).split('\n')[0]}`);
    }
  }
  if (!lech.length) lech.push(...soKhoa(khoaCu, (await doKhoa(hd, truoc, GOC)).khoa));
  const kq = lech.length ? { do: true, chi_tiet: `tệp khoá lệch phép đo lại: ${lech.slice(0, 8).join(', ')}${lech.length > 8 ? ` (+${lech.length - 8})` : ''}` } : { do: false };
  ok = inKetQua('FN-01', 'đảo bản vá → đúng tệp khoá, đóng kín đo lại khớp', phanXu(hd, 'FN-01', kq, so),
    kq.do ? '' : `${khoaCu.hop.tep} tệp · ${khoaCu.hop.dong} dòng sau khi đảo ${daAp.length} bản vá`) && ok;
}

// FN-02…04 — trên đóng kín GIAO ĐI: thứ vỏ + năm lệnh thật sự kéo từ bản vendored đã vá.
if (muon('FN-02') || muon('FN-03') || muon('FN-04')) {
  const { khoa: giao, lenh } = await doKhoa(hd, vendor, GOC);
  console.log(`rao-dong: ${hd.vendor.goc} = ${hd.nguon.repo} @ ${hd.nguon.commit.slice(0, 7)} + bản vá ${daAp.map((d) => d.id).join(', ') || '(không)'} — đóng kín giao đi ${giao.hop.tep} tệp · ${giao.hop.dong} dòng`);
  for (const [ten, l] of Object.entries(giao.lenh)) console.log(`  · ${ten}: ${l.tep} tệp · ${l.dong} dòng`);

  // FN-02 — danh sách cấm. Vi phạm ghi «<lệnh> <tệp>» để giới hạn đã khai so được bằng tập.
  if (muon('FN-02')) {
    const luat = hd.rao.cam.map((c) => ({ ...c, re: new RegExp(c.re) }));
    const vp = [];
    for (const [ten, l] of Object.entries(lenh)) for (const f of l.dong_kin) if (luat.some((c) => c.re.test(f))) vp.push(`${ten} ${f}`);
    const kq = vp.length ? { do: true, danh_sach: vp, chi_tiet: `${vp.length} module cấm: ${vp.join(', ')}` } : { do: false };
    ok = inKetQua('FN-02', `không module cấm (${hd.rao.cam.map((c) => c.ten).join(', ')})`, phanXu(hd, 'FN-02', kq, so), `${vp.length} cặp lệnh·module cấm`) && ok;
  }

  // FN-03 — mạng: import ngoài khớp danh sách, hoặc token gọi mạng trong mã đã bỏ chú thích.
  if (muon('FN-03')) {
    const cam = new Set(hd.rao.cam_mang);
    const token = hd.rao.cam_token_mang.map((t) => new RegExp(t));
    const vp = [];
    for (const [ten, l] of Object.entries(giao.lenh)) for (const n of l.ngoai) if (cam.has(n)) vp.push(`${ten} import ${n}`);
    for (const t of giao.tep) {
      const ma = boChuThich(join(vendor, t.path));
      for (const re of token) if (re.test(ma)) vp.push(`${t.path} /${re.source}/`);
    }
    const kq = vp.length ? { do: true, chi_tiet: vp.join(', ') } : { do: false };
    ok = inKetQua('FN-03', 'không đường mạng trong đóng kín', phanXu(hd, 'FN-03', kq, so)) && ok;
  }

  // FN-04 — trần. Đóng kín giao đi phình là một quyết định phải nhìn thấy: sửa trần trong hợp đồng.
  if (muon('FN-04')) {
    const { tep, dong } = hd.rao.tran;
    const kq = giao.hop.tep > tep || giao.hop.dong > dong
      ? { do: true, chi_tiet: `hợp ${giao.hop.tep} tệp · ${giao.hop.dong} dòng vượt trần ${tep} tệp · ${dong} dòng` }
      : { do: false };
    ok = inKetQua('FN-04', `đóng kín trong trần (${tep} tệp · ${dong} dòng)`, phanXu(hd, 'FN-04', kq, so),
      kq.do ? '' : `${giao.hop.tep} tệp · ${giao.hop.dong} dòng`) && ok;
  }
}

// BG-01 — bản gói là vật giao đi; nó chỉ đáng tin khi dựng lại từ nguồn ra đúng nó, ở cả một chỗ checkout khác.
if (muon('BG-01')) {
  const duong = join(GOC, hd.vendor.ban_goi);
  let kq;
  if (!existsSync(duong)) kq = { do: true, chi_tiet: `bản gói lệch nguồn: thiếu ${hd.vendor.ban_goi} — chạy dong-bo.mjs --write` };
  else {
    const khac = join(TMP, 'goc-khac');
    for (const p of [dirname(hd.vendor.vo), hd.vendor.goc]) cpSync(join(GOC, p), join(khac, p), { recursive: true });
    mkdirSync(join(khac, 'tests', 'design-floor'), { recursive: true });
    symlinkSync(join(GOC, 'tests', 'design-floor', 'node_modules'), join(khac, 'tests', 'design-floor', 'node_modules'));
    const c = readFileSync(duong);
    const a = dungBanGoi(hd, GOC);
    const b = dungBanGoi(hd, khac);
    kq = a.equals(c) && b.equals(c)
      ? { do: false, chi_tiet: `2 lần dựng (tại chỗ · bản sao ở đường khác) = tệp commit · sha256 ${bamBuf(c).slice(0, 12)} · ${c.length} byte` }
      : { do: true, chi_tiet: `bản gói lệch nguồn: commit ${bamBuf(c).slice(0, 12)} · dựng tại chỗ ${bamBuf(a).slice(0, 12)} · dựng ở đường khác ${bamBuf(b).slice(0, 12)}` };
  }
  ok = inKetQua('BG-01', 'bản gói dựng lại đúng từng byte', phanXu(hd, 'BG-01', kq, so), kq.do ? '' : kq.chi_tiet) && ok;
}

rmSync(TMP, { recursive: true, force: true });
console.log(ok ? 'rao-dong: XANH (gồm giới hạn đã khai)' : 'rao-dong: ĐỎ');
process.exit(ok ? 0 : 1);
