#!/usr/bin/env node
// Lời hứa của bản vá A với khối máy của hợp đồng nhập (hồ sơ design-floor-vendor-va-ban-va-a, AC-5): giới hạn DF-07,
// DF-08 đã gỡ, và FN-02 không còn khai cặp `memory-*` nào. Từ bản vá D (hồ sơ design-floor-ban-va-b-c-d) FN-02 không
// còn giới hạn nào; nếu có lại, nó chỉ được là tập con của ba cặp figma viết độc lập dưới đây.
// Dùng: node tests/design-floor/khoi-may-ban-va-a.mjs [--hop-dong <md>]
import { docDoiSo, docHopDong } from './lib/hop-dong.mjs';

const FIGMA = ['gate src/core/figma-ds-tokens.ts', 'reuse-plan check src/core/figma-ds-tokens.ts', 'token-coverage src/core/figma-ds-tokens.ts'];
const hd = docHopDong(docDoiSo(process.argv.slice(2)).hopDong);
const loi = [];
const ids = (hd.gioi_han || []).map((g) => g.id);
for (const id of ['DF-07', 'DF-08']) if (ids.includes(id)) loi.push(`gioi_han còn ${id}`);
const vp = [...((hd.gioi_han || []).find((g) => g.id === 'FN-02')?.vi_pham || [])].sort();
const memory = vp.filter((x) => x.includes('memory-'));
if (memory.length) loi.push(`FN-02 vi_pham còn cặp memory-: ${memory.join(', ')}`);
const thua = vp.filter((x) => !FIGMA.includes(x) && !x.includes('memory-'));
if (thua.length) loi.push(`FN-02 vi_pham thừa: ${thua.join(', ')}`);
if (loi.length) {
  console.log(`khoi-may: ĐỎ — ${loi.join(' · ')}`);
  process.exit(1);
}
console.log(`khoi-may: FN-02 vi_pham = ${vp.length} cặp figma, 0 memory; gioi_han không có DF-07, DF-08`);
