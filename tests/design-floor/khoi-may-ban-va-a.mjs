#!/usr/bin/env node
// Quan hệ mà bản vá A hứa với khối máy của hợp đồng nhập (hồ sơ design-floor-vendor-va-ban-va-a, AC-5): giới
// hạn DF-07, DF-08 đã gỡ, và vi_pham của FN-02 BẰNG đúng tập cặp figma còn lại — tập mong đợi viết độc lập ở
// đây, không rút từ khối máy, để khối máy giữ sót một cặp memory thì phép so đỏ.
// Dùng: node tests/design-floor/khoi-may-ban-va-a.mjs [--hop-dong <md>]
import { docDoiSo, docHopDong } from './lib/hop-dong.mjs';

const MONG = ['gate src/core/figma-ds-tokens.ts', 'reuse-plan check src/core/figma-ds-tokens.ts', 'token-coverage src/core/figma-ds-tokens.ts'];
const hd = docHopDong(docDoiSo(process.argv.slice(2)).hopDong);
const loi = [];
const ids = (hd.gioi_han || []).map((g) => g.id);
for (const id of ['DF-07', 'DF-08']) if (ids.includes(id)) loi.push(`gioi_han còn ${id}`);
const vp = [...((hd.gioi_han || []).find((g) => g.id === 'FN-02')?.vi_pham || [])].sort();
const thua = vp.filter((x) => !MONG.includes(x));
const thieu = MONG.filter((x) => !vp.includes(x));
if (thua.length) loi.push(`FN-02 vi_pham thừa: ${thua.join(', ')}`);
if (thieu.length) loi.push(`FN-02 vi_pham thiếu: ${thieu.join(', ')}`);
if (vp.some((x) => x.includes('memory-'))) loi.push('FN-02 vi_pham còn cặp memory-');
if (loi.length) {
  console.log(`khoi-may: ĐỎ — ${loi.join(' · ')}`);
  process.exit(1);
}
console.log(`khoi-may: FN-02 vi_pham = ${vp.length} cặp figma, 0 memory; gioi_han không có DF-07, DF-08`);
