// Chân E9 (tai-lieu) của hồ sơ loc-paths-dong-mac-dinh — round-trip: mã lý do RÚT từ khối marker
// PATHS-LY-DO của lib (bên viết), GUIDE §7.1 phải nêu đủ (bên đọc). Đường suy từ vị trí tệp.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { KIT, banSao } from './kho.mjs';

const chan = process.argv[2];
let loi = 0;
const ok = (c, m) => { if (!c) { loi++; console.log(`  FAIL: ${m}`); } else console.log(`  PASS: ${m}`); };
const ket = (ten) => { if (loi) { console.log(`${ten} ĐỎ: ${loi} ca`); process.exit(1); } console.log(`${ten} XANH`); };
const maCua = (libSrc) => {
  const m = libSrc.match(/<<<PATHS-LY-DO\n[^\n]*\[([^\]]*)\]/);
  if (!m) throw new Error('không rút được khối PATHS-LY-DO từ lib');
  return m[1].split(',').map(x => x.trim().replace(/^'|'$/g, '')).filter(Boolean);
};
const doanGuide = (g) => { const i = g.indexOf('`risk_tiers.stale_scope: paths`'); if (i < 0) return ''; const j = g.indexOf('\n\n', i); return g.slice(i, j < 0 ? undefined : j); };
const thieuTrong = (libSrc, guide) => maCua(libSrc).filter(ma => !doanGuide(guide).includes(`\`${ma}\``));

if (chan === 'tai-lieu') {
  const lib = readFileSync(path.join(KIT, 'lib', 'evidence-core.cjs'), 'utf8');
  const guide = readFileSync(path.join(KIT, 'GUIDE.md'), 'utf8');
  const cl = readFileSync(path.join(KIT, 'CHANGELOG.md'), 'utf8');
  const ma = maCua(lib);
  ok(ma.length >= 4, `rút được ${ma.length} mã lý do từ lib: ${ma.join(', ')}`);
  const doan = doanGuide(guide);
  ok(doan.length > 0, 'GUIDE có đoạn `risk_tiers.stale_scope: paths`');
  const thieu = thieuTrong(lib, guide);
  ok(thieu.length === 0, `mã thiếu trong GUIDE: ${thieu.join(', ') || 'không'}`);
  ok(!doan.includes('Chưa bật `stale_scope: paths` ở kho nào'), 'đoạn GUIDE không còn câu «Chưa bật … ở kho nào»');
  const iCph = cl.indexOf('## Chưa phát hành'), iMoc = cl.search(/^## \d+\.\d+\.\d+/m);
  ok(iCph >= 0 && iCph < iMoc && cl.slice(iCph, iMoc).includes('stale_scope'), 'CHANGELOG có «## Chưa phát hành» đứng trên mốc mới nhất và nêu stale_scope');
  // Chiều đỏ: bản sao lib thêm một mã vào khối → GUIDE thiếu đúng mã đó.
  const s = banSao([{ tep: 'lib/evidence-core.cjs', tu: "'thieu-cay'];", thanh: "'thieu-cay', 'ma-thu'];" }]);
  const thieuDo = thieuTrong(readFileSync(path.join(s, 'lib', 'evidence-core.cjs'), 'utf8'), guide);
  ok(thieuDo.length === 1 && thieuDo[0] === 'ma-thu', `chiều đỏ: bản sao lib thêm mã → «mã thiếu trong GUIDE: ${thieuDo.join(', ')}»`);
  ket('E9');
} else {
  console.log(`chan-tai-lieu: chân lạ ${chan}`); process.exit(3);
}
