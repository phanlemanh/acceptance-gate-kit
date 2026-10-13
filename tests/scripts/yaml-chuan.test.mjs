// yaml-chuan.test.mjs — hồ sơ bo-doc-ho-so-khoan-dung (gốc: crm-onehub#375). Bộ dò `evals.yaml` không phải YAML
// chuẩn (scripts/yaml-chuan.cjs): sáu lớp đo trên bảy kho, cờ vàng trên thẻ hai cổng, lệnh kiểm kho tự bật trong CI.
// Ca YC-1 (ma trận), YC-3 (thẻ), YC-4 (lệnh kiểm). Răng dữ liệu thật ở _acceptance/bo-doc-ho-so-khoan-dung/rang/
// bay-kho.mjs, ngoài suite.
//
// Fixture do mã sinh trong lượt; ma trận rút từ module dùng chung yaml-chuan-ma-tran.mjs. Chiều đỏ: bản lành xanh
// trước, rồi CHÍNH ca đo chạy trên bản sao bị tiêm (nhát tiêm khớp đúng một lần — kiểm trước khi tin) hoặc trên bản
// base `git archive 3c88d138`, ghim thông điệp.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { maTran } from './yaml-chuan-ma-tran.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const BASE_SHA = '3c88d138';
const TMP = mkdtempSync(path.join(tmpdir(), 'yaml-chuan-'));
const require = createRequire(import.meta.url);
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.YC_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + '-'));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const node = (args, o = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...o });

// Bản sao bộ dò bị tiêm: nhát tiêm phải khớp ĐÚNG một lần trong nguồn, không thì ca hỏng (không tin chiều đỏ).
function banSaoTiem(ten, tu, thanh) {
  const src = readFileSync(path.join(KIT, 'scripts', 'yaml-chuan.cjs'), 'utf8');
  const n = src.split(tu).length - 1;
  if (n !== 1) throw new Error(`nhát tiêm «${tu}» khớp ${n} lần (phải đúng 1)`);
  const d = path.join(TMP, `tiem-${ten}`); mkdirSync(d, { recursive: true });
  const p = path.join(d, 'yaml-chuan.cjs'); writeFileSync(p, src.replace(tu, thanh));
  return p;
}

// Ma trận: trả danh sách lệch (rỗng = khớp) và số ô so.
function soMaTran(dò) {
  const lech = []; let so = 0;
  for (const c of maTran()) {
    so += 1;
    const r = dò(c.text);
    if (c.mong == null) { if (r.length) lech.push(`${c.o}: mong 0 mục, được ${r.map(x => `${x.loai}@${x.dong}`).join(',')}`); continue; }
    if (r.length !== 1 || r[0].loai !== c.mong.loai || r[0].dong !== c.mong.dong) lech.push(`${c.o}: mong ${c.mong.loai}@${c.mong.dong}, được ${r.map(x => `${x.loai}@${x.dong}`).join(',') || '0 mục'}`);
  }
  return { lech, so };
}

const SO_O_MONG = 6 * 2 + 7;
const O = ten => maTran().find(c => c.o === ten);

if (want('YC-1')) {
  try {
    const { yamlKhongChuan, LOP_YAML } = require(path.join(KIT, 'scripts', 'yaml-chuan.cjs'));
    const lop = new Set(maTran().filter(c => c.mong).map(c => c.mong.loai));
    const { lech, so } = soMaTran(yamlKhongChuan);
    console.log(`  so o: ${so}`);
    if (so !== SO_O_MONG) bad('YC-1', `ma trận hụt: ${so} ô, mong ${SO_O_MONG}`);
    else if (lop.size !== 6 || Object.keys(LOP_YAML).length !== 6 || [...lop].some(l => !LOP_YAML[l])) bad('YC-1', `ma trận hụt: lớp trong ma trận ${[...lop].join(',')} ≠ LOP_YAML ${Object.keys(LOP_YAML).join(',')}`);
    else if (lech.length) bad('YC-1', lech.join(' · '));
    else ok('YC-1', `${so} ô khớp`);
  } catch (e) { bad('YC-1', loi(e)); }
}

if (want('YC-1-do')) {
  try {
    const p = banSaoTiem('bo-thoat', "if (!THOAT_HOP_LE.test(", "if (false && !THOAT_HOP_LE.test(");
    const { lech } = soMaTran(require(p).yamlKhongChuan);
    if (lech.length && lech.some(l => l.includes('thoat-sai-nhay-kep'))) ok('YC-1-do', `bản sao bỏ lớp → ${lech.join(' · ')}`);
    else bad('YC-1-do', `bản sao bỏ nhánh thoat-sai-nhay-kep mà ma trận không đỏ ở lớp ấy: ${lech.join(' · ') || 'xanh'}`);
  } catch (e) { bad('YC-1-do', loi(e)); }
}

// ── Cờ trên thẻ hai cổng (AC-3) ── hằng cờ rút từ nguồn gate-card.js ─────────────────────────────────────────
const GC = path.join(KIT, 'scripts', 'gate-card.js');
const GC_SRC = readFileSync(GC, 'utf8');
const CO = (GC_SRC.match(/const YAML_KHONG_CHUAN_FLAG = '([^']+)';/) || [])[1];
const CO_KK = (GC_SRC.match(/const YAML_KHONG_KIEM_FLAG = '([^']+)';/) || [])[1];
const unesc = s => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const coCua = html => [...html.matchAll(/class="flag f\w+[^"]*">([\s\S]*?)<\/div>/g)].map(m => unesc(m[1]));
const HD = status => `---\nschema_version: 1\nfeature: F\nslug: demo\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${status}\n${status === 'draft' ? '' : 'approved_by: A\napproved_at: 2026-10-10\n'}---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Out of scope\n\n- bỏ X.\n- bỏ Y.\n`;
const BC = '---\nschema_version: 2\nfeature_slug: demo\nverdict: PASS\nfailed_evals: []\nverified_commit: 0000000\n---\n\n# E\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| E1 | AC-1 | script | PASS |\n\n## Evidence\n\n- eval: E1\n  run_id: r1abc\n  exit_code: 0\n  verifier: config:executors.script.a\n  verified_at: 2026-10-10T00:00:00Z\n';
// Hai chỗ không chuẩn: dòng 1 dòng gốc không phải khoá, dòng 10 thoát sai — dựng từ ô của ma trận dùng chung.
// Không dùng lớp «ngoặc trong mục trần» ở đây: trên trường danh sách nó còn làm cờ «danh sách không đọc được» có
// sẵn bật cùng (đúng việc của cờ ấy), nên phép so «các cờ khác không đổi» sẽ lẫn hai cờ.
const HAI_LOI = '> Ghi chú đầu tệp viết như trích dẫn\n' + O('thoat-sai-nhay-kep/hong').text;
const HAI_LOI_SUA = '# Ghi chú đầu tệp viết như trích dẫn\n' + O('thoat-sai-nhay-kep/lanh').text;
let theN = 0;
function hoSoThe(evalsText, cong) {
  const d = path.join(TMP, `the-${++theN}`);
  mkdirSync(path.join(d, '_acceptance', 'demo'), { recursive: true });
  writeFileSync(path.join(d, '_acceptance', 'config.yaml'), 'schema_version: 1\nexecutors:\n  script:\n    a: "echo x"\n');
  writeFileSync(path.join(d, '_acceptance', 'demo', 'contract.md'), HD(cong === 1 ? 'draft' : 'verified'));
  writeFileSync(path.join(d, '_acceptance', 'demo', 'evals.yaml'), evalsText);
  if (cong === 2) writeFileSync(path.join(d, '_acceptance', 'demo', 'evidence-report.md'), BC);
  return d;
}
function the(d, gc = GC) {
  const r = node([gc, '--root', d, '--slug', 'demo']);
  if (r.status !== 0) throw new Error(`gate-card thoát ${r.status}: ${String(r.stderr).trim().split('\n').pop()}`);
  return r.stdout;
}
function cayBan(ten, sha) { // bản cây scripts+lib+skills: sha → git archive; null → chép cây đang kiểm
  const d = path.join(TMP, `cay-${ten}`); mkdirSync(d, { recursive: true });
  if (sha) execFileSync('bash', ['-c', `git -C "${KIT}" archive ${sha} scripts lib skills | tar -x -C "${d}"`]);
  else for (const x of ['scripts', 'lib', 'skills']) execFileSync('cp', ['-R', path.join(KIT, x), path.join(d, x)]);
  return d;
}

if (want('YC-3')) {
  try {
    if (!CO || !CO_KK) throw new Error('gate-card.js không khai hằng YAML_KHONG_CHUAN_FLAG / YAML_KHONG_KIEM_FLAG');
    const e = [];
    for (const cong of [1, 2]) {
      const c = coCua(the(hoSoThe(HAI_LOI, cong)));
      const yc = c.filter(x => x.startsWith(CO));
      if (yc.length !== 1) { e.push(`Cổng ${cong}: ${yc.length} cờ YAML (mong 1)`); continue; }
      const t = yc[0];
      for (const can of ['dòng 1 (dòng ở lề không phải khoá)', 'dòng 10 (thoát sai trong nháy kép)']) if (!t.includes(can)) e.push(`Cổng ${cong}: cờ thiếu «${can}»`);
      for (const ma of ['dong-goc-khong-phai-khoa', 'thoat-sai-nhay-kep']) if (t.includes(ma)) e.push(`Cổng ${cong}: cờ lộ mã lớp ${ma}`);
      const c2 = coCua(the(hoSoThe(HAI_LOI_SUA, cong)));
      if (c2.some(x => x.startsWith(CO))) e.push(`Cổng ${cong}: bản đã sửa vẫn có cờ`);
      const khac = c.filter(x => !x.startsWith(CO));
      if (JSON.stringify(khac) !== JSON.stringify(c2)) e.push(`Cổng ${cong}: các cờ khác đổi — hỏng ${JSON.stringify(khac)} / sửa ${JSON.stringify(c2)}`);
    }
    if (e.length) bad('YC-3', e.join(' · ')); else ok('YC-3', 'hai cổng: một cờ nêu dòng 1 + dòng 10 bằng chữ lớp; bản sửa không cờ, cờ khác giữ');
  } catch (e) { bad('YC-3', loi(e)); }
}

if (want('YC-3-do')) {
  try {
    const b = cayBan('base', BASE_SHA);
    const co = [1, 2].filter(cong => coCua(the(hoSoThe(HAI_LOI, cong), path.join(b, 'scripts', 'gate-card.js'))).some(x => x.startsWith(CO)));
    if (co.length) bad('YC-3-do', `base ${BASE_SHA} có cờ ở cổng ${co.join(',')} — phép đo không phân biệt được bản mới`);
    else ok('YC-3-do', `base không cờ (${BASE_SHA}) trên CÙNG hồ sơ hỏng`);
  } catch (e) { bad('YC-3-do', loi(e)); }
}

if (want('YC-3-vang')) {
  try {
    const b = cayBan('vang', null);
    const KIM = "path.join(__dirname, 'yaml-chuan.cjs')";
    const n = GC_SRC.split(KIM).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm khớp ${n} lần (phải 1)`);
    writeFileSync(path.join(b, 'scripts', 'gate-card.js'), GC_SRC.replace(KIM, "path.join(__dirname, 'khong-co-bo-do.cjs')"));
    const e = [];
    for (const cong of [1, 2]) {
      const c = coCua(the(hoSoThe(HAI_LOI, cong), path.join(b, 'scripts', 'gate-card.js')));
      if (!c.some(x => x.startsWith(CO_KK))) e.push(`Cổng ${cong}: thẻ không mang cờ «không kiểm được»`);
    }
    if (e.length) bad('YC-3-vang', e.join(' · ')); else ok('YC-3-vang', 'bộ dò vắng → thẻ vẫn dựng, cờ «không kiểm được YAML chuẩn»');
  } catch (e) { bad('YC-3-vang', loi(e)); }
}

// ── Lệnh kiểm kho (AC-4) ──────────────────────────────────────────────────────────────────────────────────────
const HONG = O('chu-sau-nhay-dong/hong'); const LANH = O('chu-sau-nhay-dong/lanh');
const DONG_A = `A/evals.yaml:${HONG.mong.dong} — chữ đứng sau nháy đóng`;
let khoN = 0;
function khoThu(hoSo) { // hoSo: { slug: text }
  const r = path.join(TMP, `kho-${++khoN}`); mkdirSync(r, { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', r]); git(r, 'config', 'user.email', 'x@y.z'); git(r, 'config', 'user.name', 'x');
  for (const [s, t] of Object.entries(hoSo)) { mkdirSync(path.join(r, '_acceptance', s), { recursive: true }); writeFileSync(path.join(r, '_acceptance', s, 'evals.yaml'), t); }
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'goc');
  return r;
}
const sua = (r, s, them, msg) => { writeFileSync(path.join(r, '_acceptance', s, 'evals.yaml'), readFileSync(path.join(r, '_acceptance', s, 'evals.yaml'), 'utf8') + them); git(r, 'commit', '-qam', msg); };
const lenh = (r, extra = [], cli = path.join(KIT, 'scripts', 'yaml-chuan.cjs')) => node([cli, '--root', r, ...extra]);

if (want('YC-4')) {
  try {
    const r = khoThu({ A: HONG.text, B: LANH.text });
    const goc = git(r, 'rev-parse', 'HEAD');
    const e = [];
    const a1 = lenh(r);
    if (a1.status !== 1 || a1.stdout !== DONG_A + '\n') e.push(`kho có A hỏng: thoát ${a1.status}, stdout ${JSON.stringify(a1.stdout)}`);
    const r2 = khoThu({ B: LANH.text });
    const a2 = lenh(r2);
    if (a2.status !== 0 || a2.stdout !== '') e.push(`kho chỉ B lành: thoát ${a2.status}, stdout ${JSON.stringify(a2.stdout)}`);
    sua(r, 'B', '# sửa B\n', 'sua B');
    const a3 = lenh(r, ['--base', goc]);
    if (a3.status !== 0 || a3.stdout !== '') e.push(`--base, diff chỉ chạm B: thoát ${a3.status}, stdout ${JSON.stringify(a3.stdout)}`);
    sua(r, 'A', '# chạm A\n', 'cham A');
    const a4 = lenh(r, ['--base', goc]);
    if (a4.status !== 1 || a4.stdout !== DONG_A + '\n') e.push(`--base, diff chạm A: thoát ${a4.status}, stdout ${JSON.stringify(a4.stdout)}`);
    if (e.length) bad('YC-4', e.join(' · ')); else ok('YC-4', 'A hỏng → 1 · chỉ B → 0 · --base chạm B → 0 · --base chạm A → 1');
  } catch (e) { bad('YC-4', loi(e)); }
}

if (want('YC-4-re')) {
  try {
    const r = khoThu({ A: HONG.text, B: LANH.text });
    git(r, 'branch', 'nhanh');
    sua(r, 'A', '# main chạm A\n', 'main cham A');
    git(r, 'checkout', '-q', 'nhanh');
    sua(r, 'B', '# nhánh chạm B\n', 'nhanh cham B');
    const lanh = lenh(r, ['--base', 'main']);
    if (lanh.status !== 0 || lanh.stdout !== '') { bad('YC-4-re', `so từ điểm rẽ mà vẫn chặn: thoát ${lanh.status}, stdout ${JSON.stringify(lanh.stdout)}`); }
    else {
      const p = banSaoTiem('hai-cham', "git('merge-base', base, 'HEAD').trim()", 'base');
      const d = lenh(r, ['--base', 'main'], p);
      if (d.status === 1 && d.stdout.includes(DONG_A)) ok('YC-4-re', 'merge-base → 0; bản sao hai chấm → 1 — hồ sơ ngoài nhánh chặn: A');
      else bad('YC-4-re', `bản sao so hai chấm không đỏ trên cùng kho: thoát ${d.status}, stdout ${JSON.stringify(d.stdout)}`);
    }
  } catch (e) { bad('YC-4-re', loi(e)); }
}

if (want('YC-4-2')) {
  try {
    const e = [];
    const tron = path.join(TMP, 'khong-git'); mkdirSync(tron, { recursive: true });
    const a = lenh(tron);
    if (a.status !== 2 || !a.stderr.includes('không phải kho git')) e.push(`không phải kho git: thoát ${a.status}, stderr ${JSON.stringify(a.stderr)}`);
    const r = khoThu({ B: LANH.text });
    const b = lenh(r, ['--base', 'khong-co-ref-nay']);
    if (b.status !== 2 || !b.stderr.includes('khong-co-ref-nay')) e.push(`ref vắng: thoát ${b.status}, stderr ${JSON.stringify(b.stderr)}`);
    if (e.length) bad('YC-4-2', e.join(' · ')); else ok('YC-4-2', 'không phải kho git → 2 · ref vắng → 2 nêu tên ref');
  } catch (e) { bad('YC-4-2', loi(e)); }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`YC Results: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
