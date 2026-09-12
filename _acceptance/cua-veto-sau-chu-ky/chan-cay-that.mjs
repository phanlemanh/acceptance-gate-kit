// Chân cay-that (AC-10) — đo trên CÂY THẬT của kit.
// Tập kỳ vọng do một bộ đọc ĐỘC LẬP tính (đọc thẳng frontmatter, không gọi lưới
// cũng không gọi máy quét) — nếu gọi một trong hai thì phép so hằng-đúng.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import * as F from './fixture.mjs';
import { baseAnchor, mkBaseTree } from './base-anchor.mjs';

const ACC = path.join(F.ROOT, '_acceptance');
const MAU = F.placeholderPatterns();

// Bộ đọc độc lập: frontmatter DẪN ĐẦU, bóc nháy và chú thích, bảng giữ-chỗ rút
// từ lưới. Viết thẳng ở đây để không mượn mã của bên nào đang bị đo.
const truong = (txt, khoa) => {
  const d = txt.split('\n');
  const i = d.findIndex(l => l.trim() !== '');
  if (i < 0 || d[i].trim() !== '---') return null;             // frontmatter không dẫn đầu
  for (let k = i + 1; k < d.length; k++) {
    if (d[k].trim() === '---') break;
    const m = d[k].match(new RegExp(`^${khoa}\\s*:(.*)$`));
    if (m) return m[1].replace(/\s*#.*$/, '').replace(/^\s*["']|["']\s*$/g, '').trim();
  }
  return '';
};
const laGiuCho = s => MAU.some(p => {
  const a = s.toLowerCase(), b = p.mau.toLowerCase();
  return p.tienTo ? a.startsWith(b) : a === b;
});

const moKyVong = [], daKy = [];
for (const slug of readdirSync(ACC)) {
  const c = path.join(ACC, slug, 'contract.md');
  if (!existsSync(c)) continue;
  const cTxt = readFileSync(c, 'utf8');
  if ((truong(cTxt, 'veto_state') || '').toLowerCase() !== 'mo') continue;
  const r = path.join(ACC, slug, 'evidence-report.md');
  const s = existsSync(r) ? (truong(readFileSync(r, 'utf8'), 'human_signoff') || '') : '';
  if (s && !laGiuCho(s)) daKy.push(slug); else moKyVong.push(slug);
}
moKyVong.sort(); daKy.sort();

const loi = [];
if (moKyVong.length < 1) loi.push('sàn: cây thật không còn hồ sơ cửa veto mở nào — phép so mất tiền đề');
if (daKy.length < 1) loi.push('sàn: cây thật không có hồ sơ mo nào ĐÃ KÝ — phép so mất tiền đề');

// Trên cây thật lưới thoát KHÁC 0 (hồ sơ hoá cũ của các vòng khác) — đó là bình
// thường, chân này đọc DÒNG chứ không đọc mã thoát.
const chayLuoi = (kitRoot) => {
  try {
    return execFileSync('bash', ['-c',
      `cd "${F.ROOT}" && bash "${kitRoot}/scripts/pre-merge-check.sh" . --recheck-all 2>&1`],
      { encoding: 'utf8', maxBuffer: 1e8 });
  } catch (e) {
    if (typeof e.stdout === 'string' && e.stdout) return e.stdout;
    throw e;
  }
};

const out = chayLuoi(F.ROOT);
const tenLuoi = F.tenDongTong(out);
const quet = (JSON.parse(execFileSync('node', [path.join(F.ROOT, 'scripts/start-scan.mjs'), '--root', F.ROOT],
  { encoding: 'utf8', maxBuffer: 1e8 })).vetoOpenUnsigned || []).slice().sort();

if (JSON.stringify(tenLuoi) !== JSON.stringify(moKyVong))
  loi.push(`lưới lệch tập kỳ vọng — chỉ lưới: [${tenLuoi.filter(s => !moKyVong.includes(s)).join(' ')}] · chỉ kỳ vọng: [${moKyVong.filter(s => !tenLuoi.includes(s)).join(' ')}]`);
if (JSON.stringify(quet) !== JSON.stringify(moKyVong))
  loi.push(`máy quét lệch tập kỳ vọng — chỉ máy quét: [${quet.filter(s => !moKyVong.includes(s)).join(' ')}] · chỉ kỳ vọng: [${moKyVong.filter(s => !quet.includes(s)).join(' ')}]`);
const giao = tenLuoi.filter(s => daKy.includes(s));
if (giao.length) loi.push(`dòng tổng còn liệt hồ sơ ĐÃ KÝ: ${giao.join(' ')}`);
const noteMo = out.split('\n').filter(l => l.startsWith('NOTE [') && l.includes(F.CAU_MO))
  .map(l => l.slice(6, l.indexOf(']')))
  .filter(s => daKy.includes(s));
if (noteMo.length) loi.push(`NOTE «cửa veto mở» in cho hồ sơ ĐÃ KÝ: ${noteMo.join(' ')}`);
if (loi.length) { console.error(loi.join(' | ')); process.exit(1); }

// ── chiều đỏ: chạy CÙNG phép so bằng lưới BASE trên chính cây thật ──────────
const cayBase = mkBaseTree(baseAnchor());
const tenBase = F.tenDongTong(chayLuoi(cayBase));
const giaoBase = tenBase.filter(s => daKy.includes(s));
if (giaoBase.length === 0) {
  console.error('chiều đỏ KHÔNG chạy: lưới BASE cũng không liệt hồ sơ đã ký nào — phép so không phân biệt được hai bản');
  process.exit(1);
}
console.log(`cây thật: ${moKyVong.length} cửa mở, ${daKy.length} hồ sơ mo ĐÃ KÝ; lưới = máy quét = kỳ vọng, giao với tập đã-ký RỖNG`);
console.log(`       [chiều đỏ] bản cũ (base ${'' + baseAnchor().slice(0, 8)}) liệt ${giaoBase.length} hồ sơ đã ký: ${giaoBase.slice(0, 5).join(' ')}${giaoBase.length > 5 ? ' …' : ''}`);
