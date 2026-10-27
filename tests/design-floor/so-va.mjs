#!/usr/bin/env node
// Trạng thái khối máy + sổ LOCAL-PATCHES mà hồ sơ design-floor-ban-va-b-c-d (AC-7) hứa: khối máy hết giới hạn, sổ có
// đúng bốn bản vá A, B, C, D đã áp, không bản vá chờ, mỗi dòng đủ trường. Tập mong đợi viết độc lập ở đây.
// Dùng: node tests/design-floor/so-va.mjs [--hop-dong <md>] [--goc <gốc kit>]
import { docDoiSo, docHopDong, soVaTai } from './lib/hop-dong.mjs';

const MONG_AP = ['A', 'B', 'C', 'D'];
const TRUONG = ['ten', 'vi_sao', 'lam_xanh', 'tep_va', 'tep'];
const ds = docDoiSo(process.argv.slice(2));
const hd = docHopDong(ds.hopDong);
const so = soVaTai(hd, ds.goc);
const loi = [];
if ((hd.gioi_han || []).length) loi.push(`gioi_han còn ${hd.gioi_han.map((g) => g.id).join(', ')}`);
const daAp = so.ban_va.filter((d) => d.trang_thai === 'da-ap').map((d) => d.id);
const choVa = so.ban_va.filter((d) => d.trang_thai === 'cho-va').map((d) => d.id);
if (JSON.stringify(daAp) !== JSON.stringify(MONG_AP)) loi.push(`da-ap ${daAp.join(',')} ≠ ${MONG_AP.join(',')}`);
if (choVa.length) loi.push(`cho-va còn ${choVa.join(',')}`);
for (const d of so.ban_va) for (const k of TRUONG) if (d[k] === undefined || d[k] === '' || (Array.isArray(d[k]) && !d[k].length)) loi.push(`dòng ${d.id} thiếu ${k}`);
if (loi.length) {
  console.log(`so-va: ĐỎ — ${loi.join(' · ')}`);
  process.exit(1);
}
console.log(`so-va: gioi_han 0 · da-ap ${daAp.join(',')} · cho-va 0 · đủ trường`);
