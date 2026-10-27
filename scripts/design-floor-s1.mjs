#!/usr/bin/env node
// design-floor-s1.mjs — bước 0d của S1 trong feature-loop: định tuyến tri thức thiết kế có trần, kiểm kế hoạch dùng lại,
// flow lint. Hồ sơ design-floor-moc-s0-s1 (FL4), thiết kế docs/superpowers/specs/2026-10-27-design-floor-moc-s0-s1-design.md.
//
// Kho M0 (scripts/design-floor-bac.mjs) → không in, không ghi. M1–M3 → ghi ĐÚNG hai thứ, cả hai trong hồ sơ:
// `_acceptance/<slug>/design-floor.json` (thẻ Cổng Phạm vi đọc nó) và một dòng nối vào `usage-report.md` (số token đã nạp).
// Không ghi gì khác — bộ đệm tri thức nằm ngoài cây kho.
//
// Tri thức: chỉ mục `knowledge/index.json` của bản ghim design-floor (Cổng Phạm vi FL4, Hỏi-2: tải lúc chạy, kit chỉ giữ
// băm). Tin tệp nào thì tệp đó phải khớp khối `tri_thuc` của design-floor/upstream.lock.json; lệch hay không tải được →
// «không đọc được ở đây», không tệp nào được trỏ, hai kiểm còn lại vẫn chạy. Chọn tối đa HAI mục theo số thẻ `when`
// (và `id`) khớp chữ của hồ sơ, điểm ≥ 1, hoà theo thứ tự chỉ mục.
//
// Hai lệnh `ui` gọi bản gói design-floor/dist/ui.mjs với argv rút từ khối máy của design-floor/HOP-DONG-NHAP.md — một
// nguồn với bộ đo của hợp đồng nhập.
//
//   node scripts/design-floor-s1.mjs --root . --slug <slug> [--json]   0 chạy xong (mọi bậc) · 2 gọi sai / không có hồ sơ
// Biến môi trường (bộ đo): DESIGN_FLOOR_TRI_THUC (thư mục có knowledge/ dùng thay bộ đệm), DESIGN_FLOOR_KHOA (tệp khoá),
// DESIGN_FLOOR_UI (bản gói), DESIGN_FLOOR_CACHE (bộ đệm của bộ đo bước 1), DESIGN_FLOOR_KHONG_MANG=1 (cấm tải).
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { docBac } from './design-floor-bac.mjs';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOP_DONG = path.join(KIT, 'design-floor', 'HOP-DONG-NHAP.md');
const TRAN_TEP = 2;

const bam = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');
const token = (byte) => Math.ceil(byte / 4);

function khoiMay(duong, ten) {
  const md = readFileSync(duong, 'utf8');
  const a = md.indexOf(`<!-- <<<${ten} -->`);
  const b = md.indexOf(`<!-- ${ten}>>> -->`);
  const m = a >= 0 && b > a ? /```json\n([\s\S]*?)\n```/.exec(md.slice(a, b)) : null;
  if (!m) throw new Error(`${duong}: thiếu khối máy ${ten}`);
  return JSON.parse(m[1]);
}

// Thư mục có knowledge/index.json: chỉ định sẵn → bộ đệm của bộ đo bước 1 → bộ đệm riêng (tải sparse /knowledge/).
function gocTriThuc(nguon) {
  if (process.env.DESIGN_FLOOR_TRI_THUC) return process.env.DESIGN_FLOOR_TRI_THUC;
  const coChiMuc = (d) => d && existsSync(path.join(d, 'knowledge', 'index.json'));
  const boDem1 = process.env.DESIGN_FLOOR_CACHE || path.join(tmpdir(), 'design-floor-upstream', nguon.commit);
  if (coChiMuc(boDem1)) return boDem1;
  const dir = path.join(tmpdir(), 'design-floor-tri-thuc', nguon.commit);
  if (coChiMuc(dir)) return dir;
  if (process.env.DESIGN_FLOOR_KHONG_MANG) throw new Error('không mạng (DESIGN_FLOOR_KHONG_MANG=1) và chưa có bộ đệm tri thức');
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const git = (...a) => execFileSync('git', a, { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
  try {
    git('init', '-q');
    git('remote', 'add', 'origin', `${nguon.repo}.git`);
    git('sparse-checkout', 'set', '--no-cone', '/knowledge/');
    git('fetch', '-q', '--depth', '1', '--filter=blob:none', 'origin', nguon.commit);
    git('checkout', '-q', 'FETCH_HEAD');
  } catch (e) {
    rmSync(dir, { recursive: true, force: true });
    throw new Error(`tải bản ghim ${nguon.commit.slice(0, 7)} không được: ${String(e.stderr || e.message).trim().split('\n')[0]}`);
  }
  return dir;
}

function chuHoa(s) {
  return ` ${s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `;
}

// Tri thức: { trang_thai: 'doc-duoc' | 'khong-doc', ly_do, goc, chi_muc, tep }.
function dinhTuyen(khoa, chu) {
  const ra = { trang_thai: 'khong-doc', ly_do: '', goc: null, chi_muc: null, tep: [] };
  const tt = khoa.tri_thuc;
  if (!tt) {
    ra.ly_do = 'tệp khoá không có khối tri_thuc';
    return ra;
  }
  let goc;
  try {
    goc = gocTriThuc(khoa.nguon);
  } catch (e) {
    ra.ly_do = e.message;
    return ra;
  }
  const cm = path.join(goc, tt.chi_muc.path);
  if (!existsSync(cm)) {
    ra.ly_do = `không có ${tt.chi_muc.path}`;
    return ra;
  }
  if (bam(cm) !== tt.chi_muc.sha256) {
    ra.ly_do = `lệch băm ${tt.chi_muc.path}`;
    return ra;
  }
  let idx;
  try {
    idx = JSON.parse(readFileSync(cm, 'utf8'));
  } catch {
    ra.ly_do = `${tt.chi_muc.path} không đọc được`;
    return ra;
  }
  const van = chuHoa(chu);
  const diem = (idx.entries || []).map((e, i) => {
    const the = [...new Set([e.id, ...(e.when || [])].filter(Boolean))];
    return { e, i, diem: the.filter((t) => van.includes(chuHoa(t))).length };
  });
  const chon = diem.filter((d) => d.diem >= 1).sort((a, b) => b.diem - a.diem || a.i - b.i).slice(0, TRAN_TEP);
  const theoDuong = new Map((tt.tep || []).map((t) => [t.path, t]));
  const tep = [];
  for (const d of chon) {
    const p = path.join(goc, d.e.path);
    const k = theoDuong.get(d.e.path);
    if (!k || !existsSync(p) || bam(p) !== k.sha256) {
      ra.ly_do = `lệch băm ${d.e.path}`;
      return ra;
    }
    const byte = statSync(p).size;
    tep.push({ id: d.e.id, path: d.e.path, diem: d.diem, byte, token: token(byte) });
  }
  const byteCm = statSync(cm).size;
  return { trang_thai: 'doc-duoc', ly_do: '', goc, chi_muc: { path: tt.chi_muc.path, byte: byteCm, token: token(byteCm) }, tep };
}

// Một lệnh `ui` theo argv mẫu của hợp đồng nhập → { ket, ma, n }.
function goiUi(hd, lenh, gia, root) {
  const argv = hd.lenh[lenh].argv.map((a) => a.replace(/^\{(\w+)\}$/, (_, k) => gia[k]));
  const ui = process.env.DESIGN_FLOOR_UI || path.join(KIT, 'design-floor', 'dist', 'ui.mjs');
  const r = spawnSync(process.execPath, [ui, ...argv], { cwd: root, encoding: 'utf8', env: { ...process.env, ...(hd.moi_truong || {}) } });
  let n = null;
  try {
    n = JSON.parse(r.stdout).data?.errorCount ?? null;
  } catch {
    n = null;
  }
  const ket = r.status === 0 ? 'dat' : r.status === 2 ? 'truot' : 'khong-do';
  return { ket, ma: r.status, n };
}

function chuKet(k, donVi) {
  if (k.ket === 'dat') return 'đạt';
  if (k.ket === 'truot') return `trượt (${k.n ?? '?'} ${donVi})`;
  if (k.ket === 'chua-nguon') return 'chưa khai nguồn — không kiểm';
  return `không đo được (mã ${k.ma})`;
}

export function chayS1(root, slug) {
  const hs = path.join(root, '_acceptance', slug);
  const bac = docBac(root);
  if (bac.bac === 'M0') return null;
  const khoa = JSON.parse(readFileSync(process.env.DESIGN_FLOOR_KHOA || path.join(KIT, 'design-floor', 'upstream.lock.json'), 'utf8'));
  const hd = khoiMay(HOP_DONG, 'DESIGN-FLOOR-HOP-DONG');

  const doc = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');
  const hopDong = doc(path.join(hs, 'contract.md'));
  const dd = /^design_doc:\s*(\S+)/m.exec(hopDong);
  const chu = [doc(path.join(hs, 'opportunity.md')), hopDong, dd ? doc(path.resolve(root, dd[1])) : ''].join('\n');
  const triThuc = dinhTuyen(khoa, chu);

  const ra = { schema: 1, bac: bac.bac, ly_do: bac.ly_do, tri_thuc: triThuc, reuse_plan: null, flow: null, dong: [] };
  const plan = path.join(hs, 'reuse-plan.md');
  if (existsSync(plan)) {
    ra.reuse_plan = bac.bac === 'M1'
      ? { ket: 'chua-nguon', ma: null, n: null }
      : goiUi(hd, 'reuse-plan check', { dich: plan, registry: path.resolve(root, bac.registry), tokens: path.resolve(root, bac.tokens) }, root);
  }
  const flow = path.join(hs, 'flow.json');
  if (existsSync(flow)) ra.flow = goiUi(hd, 'flow lint', { dich: flow }, root);

  ra.dong.push(`Bậc kho: ${bac.bac} — ${bac.ly_do}`);
  if (triThuc.trang_thai === 'doc-duoc') {
    const tep = triThuc.tep.map((t) => `${t.path} (${t.token} token)`);
    ra.dong.push(tep.length
      ? `Tri thức thiết kế: chỉ mục (${triThuc.chi_muc.token} token) + ${tep.join(', ')}`
      : `Tri thức thiết kế: chỉ chỉ mục (${triThuc.chi_muc.token} token) — không mục nào khớp chữ của hồ sơ`);
  } else ra.dong.push(`Tri thức thiết kế: không đọc được ở đây — ${triThuc.ly_do}`);
  if (ra.reuse_plan) ra.dong.push(`Kế hoạch dùng lại: ${chuKet(ra.reuse_plan, 'tên')}`);
  if (ra.flow) ra.dong.push(`Luồng: ${chuKet(ra.flow, 'lỗi')}`);

  writeFileSync(path.join(hs, 'design-floor.json'), `${JSON.stringify(ra, null, 2)}\n`);
  const tong = triThuc.trang_thai === 'doc-duoc' ? triThuc.chi_muc.token + triThuc.tep.reduce((n, t) => n + t.token, 0) : 0;
  const dongDung = triThuc.trang_thai === 'doc-duoc'
    ? `chỉ mục ${triThuc.chi_muc.token} token${triThuc.tep.map((t) => ` · ${t.id} ${t.token} token`).join('')} (tổng ${tong} token)`
    : `tri thức không đọc được ở đây — ${triThuc.ly_do}`;
  appendFileSync(path.join(hs, 'usage-report.md'), `\n- design-floor S1 ${new Date().toISOString()}: ${dongDung}\n`);
  return ra;
}

function main(argv) {
  let root = null;
  let slug = null;
  let json = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--root') root = argv[++i];
    else if (argv[i] === '--slug') slug = argv[++i];
    else if (argv[i] === '--json') json = true;
    else {
      process.stderr.write(`design-floor-s1: đối số lạ ${argv[i]} — dùng: --root <gốc kho> --slug <hồ sơ> [--json]\n`);
      return 2;
    }
  }
  if (!root || !slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    process.stderr.write('design-floor-s1: cần --root <gốc kho> --slug <hồ sơ>\n');
    return 2;
  }
  root = path.resolve(root);
  if (!existsSync(path.join(root, '_acceptance', slug))) {
    process.stderr.write(`design-floor-s1: không có hồ sơ _acceptance/${slug}\n`);
    return 2;
  }
  const ra = chayS1(root, slug);
  if (!ra) return 0;
  if (json) process.stdout.write(`${JSON.stringify(ra)}\n`);
  else for (const d of ra.dong) process.stdout.write(`design-floor: ${d}\n`);
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main(process.argv.slice(2));
