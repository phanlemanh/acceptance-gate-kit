// Lưới vĩnh viễn cho thước nhãn-đè-khối (hồ sơ thuoc-nhan-de-khoi).
// Ba dòng ghim: figures thật sạch · sàn-phát-hiện (chặn «xanh vì thước mù
// toàn phần» khi skill đổi khuôn xuất — gap-probe F2) · mutant code-sinh đỏ
// đúng thông điệp (đối chứng cùng lượt, lệnh tiêm chứng minh đổi nội dung).
// Đường dẫn suy từ vị trí file này — không hardcode ROOT.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const CHECKER = path.join(ROOT, 'diagram-design', 'skills', 'diagram-design',
  'scripts', 'check_label_occlusion.py');
const FIGDIR = path.join(ROOT, 'docs', 'reference', 'figures');

// SÀN phát hiện, không phải hằng: đếm thật 2026-08-27 trên 8 svg + 8 html là
// 218 nhãn. Thêm hình thì sàn vẫn đúng; tụt DƯỚI sàn nghĩa là thước hết thấy
// nhãn (skill đổi khuôn xuất) hoặc kho hình bị cắt — cả hai đều đáng đỏ để
// người cập nhật sàn có chủ đích.
const LABEL_FLOOR = 218;

let passed = 0, failed = 0;
const check = (n, f) => {
  try { f(); passed++; console.log(`  PASS: ${n}`); }
  catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); }
};
const run = (args) => spawnSync('python3', [CHECKER, ...args], { encoding: 'utf8' });

const figures = readdirSync(FIGDIR)
  .filter((f) => f.endsWith('.svg') || f.endsWith('.html'))
  .map((f) => path.join(FIGDIR, f));

check('figures hien tai sach', () => {
  const r = run(figures);
  if (r.status !== 0) {
    throw new Error(`thuoc exit ${r.status} tren figures da ship:\n${r.stdout}`);
  }
});

check(`tong nhan phat hien >= ${LABEL_FLOOR}`, () => {
  const r = run(['--list', ...figures]);
  const n = r.stdout.split('\n').filter((l) => l.startsWith('LABEL ')).length;
  if (n < LABEL_FLOOR) {
    throw new Error(`thuoc chi thay ${n} nhan (< san ${LABEL_FLOOR}) — thuoc mu voi khuon xuat hien tai?`);
  }
});

check('mutant code-sinh -> do dung thong diep', () => {
  const srcPath = figures.find((f) => f.endsWith('kien-truc-ho-so-la-truc.svg'));
  if (!srcPath) throw new Error('khong tim thay svg nguon cho mutant');
  const src = readFileSync(srcPath, 'utf8');
  // tìm nhãn thật đầu tiên: mask nhỏ + <text> ngay sau (cùng khuôn thước đọc)
  const pair = /<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"[^>]*\/>\s*<text[^>]*>([^<]+)<\/text>/g;
  let m = null;
  for (const c of src.matchAll(pair)) {
    // đúng định nghĩa nhãn của thước: w<=220, h<=18
    if (Number(c[3]) <= 220 && Number(c[4]) <= 18) { m = c; break; }
  }
  if (!m) throw new Error('khong tim thay cap mask+text (w<=220,h<=18) trong svg nguon');
  const [, x, y, , , labelText] = m;
  const inject = `<rect x="${Number(x) - 4}" y="${Number(y) - 4}" width="120" height="40" fill="#ffffff"/></svg>`;
  const mutated = src.replace('</svg>', inject);
  if (mutated === src) throw new Error('tiem khong doi noi dung');
  const T = mkdtempSync(path.join(tmpdir(), 'label-occ-'));
  try {
    const mutPath = path.join(T, 'mutant.svg');
    writeFileSync(mutPath, mutated);
    const r = run([mutPath]);
    if (r.status !== 1) throw new Error(`mutant phai exit 1, duoc ${r.status}`);
    if (!r.stdout.includes(`nhan "${labelText.trim()}"`)) {
      throw new Error(`stdout khong neu ten nhan "${labelText.trim()}":\n${r.stdout}`);
    }
  } finally { rmSync(T, { recursive: true, force: true }); }
});

console.log(`label-occlusion: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
