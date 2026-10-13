// design-gate-khong-do-duoc.test.mjs — design-gate trên đích KHÔNG phải HTML (hồ sơ
// nen-dieu-kien-va-static-khong-do-duoc AC-6…AC-8; crm-onehub#375: 262/265 lượt static trên .tsx
// PASS, 0 REJECT).
//
// Lời hứa đo bằng QUAN HỆ với bản gốc, không bằng chuỗi: mã thoát bản vòng == mã thoát bản gốc ở MỌI ô
// của ma trận đích (đây là «ghim lại không đổi màu»), và chỉ đích không phải HTML mang cờ vàng. Bản
// gốc = `git archive <BASE> scripts lib vendor` (trọn thư mục, không danh sách tay); sha không resolve
// được thì ca FAIL, không bỏ qua. Đích do ca SINH trong lượt (tsx/jsx/vue) hoặc chép từ
// tests/design-eval/fixtures (html). Mọi đường suy từ vị trí tệp này.
//
//   DG-KDD1  mã thoát hai bản bằng nhau ở mọi ô                       (AC-6)
//   DG-KDD2  cờ vàng: HTML im, không-HTML đúng một dòng + do_duoc     (AC-7)
//   DG-KDD3  ba đột biến trên bản sao → CHÍNH phép đo đỏ, ghim ô       (AC-8)
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const BASE = '0c1fd9ff80a2f97998152694d5ba98b65f349dce'; // origin/main lúc mở vòng (13/10)
const FIX = path.join(KIT, 'tests', 'design-eval', 'fixtures');

let pass = 0, fail = 0;
const ok = m => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };
const TAO = [];
const tam = (t) => { const d = mkdtempSync(path.join(tmpdir(), t)); TAO.push(d); return d; };
const xong = () => {
  for (const d of TAO) rmSync(d, { recursive: true, force: true });
  console.log(`\nResults: ${pass} passed, ${fail} failed (design-gate-khong-do-duoc)`);
  process.exit(fail ? 1 : 0);
};

// ── đích ──
const DICH = tam('dg-kdd-dich-');
const tsx = (than) => `export default function A() {\n  return (\n${than}\n  );\n}\n`;
writeFileSync(path.join(DICH, 'tsx-sach.tsx'), tsx('    <div style={{ background: "#fff" }}><p style={{ color: "#eee" }}>chữ gần như vô hình</p></div>'));
writeFileSync(path.join(DICH, 'tsx-anh-rong.tsx'), tsx('    <div><img src="" /></div>'));
writeFileSync(path.join(DICH, 'jsx-sach.jsx'), tsx('    <section className="text-gray-100 bg-white">chữ nhạt</section>'));
writeFileSync(path.join(DICH, 'vue-sach.vue'), '<template>\n  <p :style="{ color: \'#eee\' }">chữ nhạt</p>\n</template>\n');
cpSync(path.join(FIX, 'f09-clean-good.html'), path.join(DICH, 'html-sach.html'));
cpSync(path.join(FIX, 'f04-side-tab.html'), path.join(DICH, 'html-p1.html'));
cpSync(path.join(FIX, 'f09-clean-good.html'), path.join(DICH, 'HOA.HTML'));
cpSync(path.join(FIX, 'f09-clean-good.html'), path.join(DICH, 'khong-duoi'));
const O = [
  { ten: 'html-sach', tep: 'html-sach.html', html: true },
  { ten: 'html-p1', tep: 'html-p1.html', html: true, failOn: 'P0,P1' },
  { ten: 'html-hoa', tep: 'HOA.HTML', html: true },
  { ten: 'tsx-sach', tep: 'tsx-sach.tsx', html: false, duoi: '.tsx' },
  { ten: 'tsx-anh-rong', tep: 'tsx-anh-rong.tsx', html: false, duoi: '.tsx' },
  { ten: 'jsx-sach', tep: 'jsx-sach.jsx', html: false, duoi: '.jsx' },
  { ten: 'vue-sach', tep: 'vue-sach.vue', html: false, duoi: '.vue' },
  // Đích không đuôi tính là không phải HTML (luật đuôi, không đoán nội dung) — dù nội dung là HTML.
  { ten: 'khong-duoi', tep: 'khong-duoi', html: false, duoi: 'không đuôi' },
  // Tệp vắng: ô DUY NHẤT bản gốc chết mã 1 (3/265 lượt ở crm) — sau phải chết y vậy, không thành xanh.
  { ten: 'tsx-vang', tep: 'khong-co-tep-nay.tsx', vang: true },
  // Chế độ dom ngoài phạm vi: không jsdom thì BLOCKED mã 3 như gốc, không cờ.
  { ten: 'tsx-dom', tep: 'tsx-sach.tsx', html: true, mode: 'dom' },
];

// ── bản gốc ──
const GOC = tam('dg-kdd-goc-');
try {
  const tar = execFileSync('git', ['-C', KIT, 'archive', BASE, 'scripts', 'lib', 'vendor'], { maxBuffer: 256 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', GOC], { input: tar });
} catch (e) {
  bad('DG-KDD0 khong dung duoc ban goc bang git archive', `${BASE}: ${String(e.message || e).split('\n')[0]}`);
  xong();
}

const chay = (gate, o) => {
  const r = spawnSync(process.execPath, [gate, path.join(DICH, o.tep), '--mode', o.mode || 'static', ...(o.failOn ? ['--fail-on', o.failOn] : [])], { encoding: 'utf8' });
  let j = null; try { j = JSON.parse(r.stdout); } catch { j = null; }
  return { code: r.status, j, stderr: r.stderr || '' };
};

// doMaTran(gate) — CHÍNH phép đo của AC-6/AC-7; trả danh sách lỗi (rỗng = đạt) + bảng ô.
const gocKq = new Map(O.map(o => [o.ten, chay(path.join(GOC, 'scripts', 'design-gate.mjs'), o)]));
function doMaTran(gate) {
  const loi = [], bang = [];
  for (const o of O) {
    const g = gocKq.get(o.ten), s = chay(gate, o);
    bang.push(`${o.ten}: goc ${g.code}/${g.j?.verdict} · sau ${s.code}/${s.j?.verdict}`);
    if (s.code !== g.code) loi.push(`${o.ten}: mã thoát lệch gốc (gốc ${g.code}, sau ${s.code})`);
    if (o.vang) {
      if (g.code === 0 || g.j) loi.push(`${o.ten}: đối chứng hỏng — bản gốc không chết trên tệp vắng`);
      if (s.j) loi.push(`${o.ten}: tệp vắng mà bản vòng trả JSON (${s.j.verdict})`);
      continue;
    }
    if (!s.j) { loi.push(`${o.ten}: stdout không phải JSON`); continue; }
    const dong = s.stderr.split('\n').filter(l => l.includes('không đo được'));
    if (o.html) {
      if ('do_duoc' in s.j) loi.push(`${o.ten}: đích HTML mà JSON mang do_duoc`);
      if (dong.length) loi.push(`${o.ten}: đích HTML mà stderr có dòng «không đo được»`);
      if (s.j.verdict !== g.j?.verdict) loi.push(`${o.ten}: verdict đổi trên đích HTML (gốc ${g.j?.verdict}, sau ${s.j.verdict})`);
    } else {
      const can = `design-gate: static không đo được tệp này (${o.duoi})`;
      if (s.j.do_duoc !== false) loi.push(`${o.ten}: đích không phải HTML mà thiếu do_duoc: false`);
      if (dong.length !== 1 || !dong[0].startsWith(can)) loi.push(`${o.ten}: stderr phải có đúng một dòng «${can}…» (có ${dong.length})`);
      const mong = g.j?.verdict === 'PASS' ? 'KHONG-DO-DUOC' : g.j?.verdict;
      if (s.j.verdict !== mong) loi.push(`${o.ten}: verdict ${s.j.verdict}, mong ${mong} (gốc ${g.j?.verdict})`);
    }
  }
  return { loi, bang };
}

// Đối chứng: ma trận phải trải cả hai nhánh của bản gốc (có ô PASS, có ô REJECT ở mỗi phía HTML/không).
{
  const v = ten => gocKq.get(ten).j?.verdict;
  const thieu = [['tsx-sach', 'PASS'], ['tsx-anh-rong', 'REJECT'], ['html-sach', 'PASS'], ['html-p1', 'REJECT'], ['tsx-dom', 'BLOCKED']].filter(([t, x]) => v(t) !== x);
  if (thieu.length) { bad('DG-KDD0 ma tran khong trai du hai nhanh cua ban goc', JSON.stringify(thieu.map(([t]) => [t, v(t)]))); xong(); }
}

const VONG = path.join(KIT, 'scripts', 'design-gate.mjs');
const that = doMaTran(VONG);

// ── DG-KDD1 (AC-6) ──
{
  const lech = that.loi.filter(l => l.includes('mã thoát lệch gốc'));
  if (lech.length) bad('DG-KDD1 ma thoat ban vong lech ban goc', lech.join(' | '));
  else ok(`DG-KDD1 ma thoat bang ban goc o ca ${O.length} o — ${that.bang.join(' ; ')}`);
}

// ── DG-KDD2 (AC-7) ──
{
  const khac = that.loi.filter(l => !l.includes('mã thoát lệch gốc'));
  if (khac.length) bad('DG-KDD2 co vang sai', khac.join(' | '));
  else ok(`DG-KDD2 ${O.filter(o => o.html).length} o HTML/dom im; ${O.filter(o => !o.html && !o.vang).length} dich khong phai HTML mang do_duoc:false + dung mot dong «static không đo được tệp này»`);
}

// ── DG-KDD3 (AC-8) — đột biến trên bản sao; bản lành phải xanh TRƯỚC (đối chứng dương) ──
function banSao(thay, bang) {
  const d = tam('dg-kdd-dot-bien-');
  mkdirSync(path.join(d, 'scripts'));
  symlinkSync(path.join(KIT, 'lib'), path.join(d, 'lib'));
  symlinkSync(path.join(KIT, 'vendor'), path.join(d, 'vendor'));
  const s = readFileSync(VONG, 'utf8');
  if (s.split(thay).length !== 2) throw new Error(`cho tiem khop ${s.split(thay).length - 1} lan (can 1): ${thay}`);
  writeFileSync(path.join(d, 'scripts', 'design-gate.mjs'), s.replace(thay, bang));
  return path.join(d, 'scripts', 'design-gate.mjs');
}
try {
  if (that.loi.length) throw new Error(`doi chung duong: ban lanh chua xanh — ${that.loi.join(' | ')}`);
  const a = doMaTran(banSao("new Set(['.html', '.htm', '.xhtml'])", 'new Set([])')).loi;
  const b = doMaTran(banSao("if (verdict === 'PASS') verdict = 'KHONG-DO-DUOC';",
    "if (verdict === 'PASS') { verdict = 'KHONG-DO-DUOC'; result.exitCode = 3; }")).loi;
  // (c) phân loại đuôi TRƯỚC khi đọc tệp: trả sớm KHONG-DO-DUOC mã 0 — tệp vắng hoá xanh.
  const c = doMaTran(banSao('let result;\n', "if (args.mode === 'static' && !['.html', '.htm', '.xhtml'].includes(path.extname(args.target).toLowerCase())) emit({ ...base, mode: 'static', verdict: 'KHONG-DO-DUOC', exit_code: 0, do_duoc: false }, 0);\nlet result;\n")).loi;
  if (!c.some(l => l.startsWith('tsx-vang: tệp vắng mà bản vòng trả JSON'))) bad('DG-KDD3c dot bien «phan loai truoc khi doc tep» ma phep do khong neu o tsx-vang', c.join(' | ') || 'xanh');
  else if (!a.some(l => l.startsWith('html-sach: đích HTML mà JSON mang do_duoc'))) bad('DG-KDD3a dot bien «danh sach duoi HTML rong» ma phep do khong neu o html-sach', a.join(' | ') || 'xanh');
  else if (!b.some(l => l.startsWith('tsx-sach: mã thoát lệch gốc (gốc 0, sau 3)'))) bad('DG-KDD3b dot bien «KHONG-DO-DUOC thoat 3» ma phep do khong neu o tsx-sach', b.join(' | ') || 'xanh');
  else ok('DG-KDD3 ban lanh xanh; dot bien duoi-rong → «html-sach: đích HTML mà JSON mang do_duoc»; dot bien thoat-3 → «tsx-sach: mã thoát lệch gốc (gốc 0, sau 3)»; dot bien phan-loai-truoc → «tsx-vang: tệp vắng mà bản vòng trả JSON»');
} catch (e) { bad('DG-KDD3 khong dung duoc ban dot bien', String(e.message || e)); }

xong();
