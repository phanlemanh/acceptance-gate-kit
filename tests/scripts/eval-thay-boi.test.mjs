#!/usr/bin/env node
// Ca vĩnh viễn cho hồ sơ eval-thay-boi-co-chung (06/10/2026).
// Chạy trọn: node tests/scripts/eval-thay-boi.test.mjs
// Một nhóm:  ETB_CASES=T01 node tests/scripts/eval-thay-boi.test.mjs   (khớp 0 ca → thoát 1)
//
// Mọi kho do MÃ SINH dưới một thư mục tạm dọn khi thoát; mọi đường dẫn suy từ vị trí
// script. ETB_ROOT trỏ sang một bản sao bộ máy khi ca cần phá vật thật (mutant).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SELF_ROOT = path.resolve(HERE, '..', '..');
const ROOT = process.env.ETB_ROOT ? path.resolve(process.env.ETB_ROOT) : SELF_ROOT;
const SELF_FILE = fileURLToPath(import.meta.url);
const lane = (root) => path.join(root, 'feature-loop', 'scripts', 'repin-lane.mjs');
const recheck = (root) => path.join(root, 'scripts', 'recheck-evidence.cjs');
const premerge = (root) => path.join(root, 'scripts', 'pre-merge-check.sh');

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'etb-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });

const CASES = [];
const test = (id, name, fn) => CASES.push({ id, name, fn });
const fail = (msg) => { throw new Error(msg); };
// Thông điệp xung đột của luật hai vế TRƯỚC vòng này — ô không con trỏ phải giữ nó từng chữ.
const XUNG_DOT_CU = 'khai không-chạy trong evals.yaml nhưng báo cáo đã ký CÓ mã thoát cho chính nó';

// ── bộ dựng ────────────────────────────────────────────────────────────────────
// Hồ sơ cũ `ho-so-cu`: E1 sống (cmd true), E3 khai không-chạy (cmd false — chạy nhầm là đỏ)
// kèm con trỏ; báo cáo ĐÃ KÝ có khối `- eval:` mã 0 cho cả E1 và E3 (đúng hình dạng crm:
// eval đã ký nay mất vật). Hồ sơ thay `ho-so-thay`: signed-off, design doc nằm trong
// _acceptance/ho-so-thay/ (sửa sau ghim không làm bẩn cây ngoài _acceptance/), E7 phủ AC.
const MAC_DINH = {
  conTro: 'ho-so-thay#AC-2',      // null = không con trỏ; chuỗi thô ghi NGUYÊN VĂN sau «superseded_by: »
  kyE3: true,                     // báo cáo đã ký của hồ sơ cũ có khối cho E3
  statusThay: 'signed-off',
  nhanO: 'design',                // 'design' | 'contract' | false — nơi hồ sơ thay nêu thẻ
  theNhan: null,                  // null = 'ho-so-cu/E3'; chuỗi khác = thẻ dính chữ
  designDoc: '_acceptance/ho-so-thay/thiet-ke.md',
  designDocCo: true,
  acThay: ['AC-1', 'AC-2'],
  evalThay: { criterion: 'AC-2', khaiKhongChay: false, maThoatKy: 0, conTroNguoc: null },
  nghiThay: false,
};
const gop = (opts) => ({ ...MAC_DINH, ...(opts || {}), evalThay: { ...MAC_DINH.evalThay, ...((opts || {}).evalThay || {}) } });

const NGUOI_KY = 'Manh Phan 2026-10-06';
const VERIFIER = 'config:executors.script.noop';
const khoiEvidence = (ids) => ids.map(([id, ma]) =>
  `- eval: ${id}\n  run_id: seed-${id}\n  exit_code: ${ma}\n  verifier: ${VERIFIER}\n  verified_at: 2026-10-06\n\n`).join('');
const baoCao = (slug, ids) => `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: PASS\nverified_commit: PENDING\nhuman_signoff: ${NGUOI_KY}\n---\n\n## Evidence\n\n${khoiEvidence(ids)}## Iterations\n\nRound 1 — PASS.\n`;
const hopDong = (slug, acs, extra = '') => `---\nschema_version: 1\nfeature: ${slug}\nslug: ${slug}\nrisk_tier: T2\nsurfaces: [cli]\nstatus: signed-off\napproved_by: Manh Phan\napproved_at: 2026-10-01\n${extra}---\n\n# Acceptance Contract: ${slug}\n\n## Criteria\n\n${acs.map(a => `- ${a}: Given x, When y, Then z.`).join('\n')}\n\n## Out of scope\n\n- a\n- b\n`;

function ghiHoSoCu(dir, o) {
  const ws = path.join(dir, '_acceptance', 'ho-so-cu');
  fs.mkdirSync(ws, { recursive: true });
  const e3 = ['  - id: E3', '    criterion: AC-1', '    executor: script', '    cmd: "false"', '    status: not-run'];
  if (o.conTro !== null) e3.push(`    superseded_by: ${o.conTro}`);
  fs.writeFileSync(path.join(ws, 'evals.yaml'), `evals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: "true"\n${e3.join('\n')}\n`);
  return ws;
}
function ghiHoSoThay(dir, o) {
  const ws = path.join(dir, '_acceptance', 'ho-so-thay');
  fs.mkdirSync(ws, { recursive: true });
  const the = o.theNhan || 'ho-so-cu/E3';
  const dong = `| ${the} | đo thứ đã gỡ | AC-2 |`;
  let c = hopDong('ho-so-thay', o.acThay, `design_doc: ${o.designDoc}\n`).replace(/^status: .*$/m, `status: ${o.statusThay}`);
  if (o.nhanO === 'contract') c += `\n## Notes\n\n${dong}\n`;
  fs.writeFileSync(path.join(ws, 'contract.md'), c);
  const ddPath = path.resolve(dir, o.designDoc);
  if (o.designDocCo) { fs.mkdirSync(path.dirname(ddPath), { recursive: true }); fs.writeFileSync(ddPath, `# Thiết kế\n\n${o.nhanO === 'design' || o.nhanO === 'ngoai' ? dong : ''}\n`); }
  const et = o.evalThay;
  const e7 = ['  - id: E7', `    criterion: ${et.criterion}`, '    executor: script', '    cmd: "true"'];
  if (et.khaiKhongChay) e7.push('    status: not-run');
  if (et.conTroNguoc) e7.push(`    superseded_by: ${et.conTroNguoc}`);
  fs.writeFileSync(path.join(ws, 'evals.yaml'), `evals:\n${e7.join('\n')}\n`);
  const ky = et.maThoatKy === null ? [] : [['E7', et.maThoatKy]];
  fs.writeFileSync(path.join(ws, 'evidence-report.md'), baoCao('ho-so-thay', ky));
  fs.writeFileSync(path.join(ws, 'decisions.jsonl'), o.nghiThay
    ? JSON.stringify({ id: 'd-20261006T000000Z-1', type: 'nghi', stage: 'gate2', at: '2026-10-06T00:00:00Z', by: 'Manh Phan', decision: 'tính năng gỡ khỏi sản phẩm' }) + '\n'
    : '');
  return ws;
}
function dungKho(opts) {
  const o = gop(opts);
  const dir = fs.mkdtempSync(path.join(TMP, 'kho-'));
  const g = (...a) => execFileSync('git', ['-C', dir, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  fs.mkdirSync(path.join(dir, '_acceptance'), { recursive: true });
  fs.writeFileSync(path.join(dir, '_acceptance', 'config.yaml'),
    'schema_version: 1\nfeature_loop:\n  suite_keys:\n    - executors.script.noop\nexecutors:\n  script:\n    noop: "true"\n');
  const wsCu = ghiHoSoCu(dir, o);
  const wsThay = ghiHoSoThay(dir, o);
  const idsCu = [['E1', 0]].concat(o.kyE3 ? [['E3', 0]] : []);
  fs.writeFileSync(path.join(wsCu, 'evidence-report.md'), baoCao('ho-so-cu', idsCu));
  for (const ws of [wsCu, wsThay]) fs.writeFileSync(path.join(ws, 'run-log.jsonl'), '');
  g('init', '-q'); g('add', '-A'); g('commit', '-qm', 'impl');
  const sha = g('rev-parse', 'HEAD');
  const thayKy = o.evalThay.maThoatKy === null ? [] : ['E7'];
  for (const [ws, ids] of [[wsCu, idsCu.map(x => x[0])], [wsThay, thayKy]]) {
    const rp = path.join(ws, 'evidence-report.md');
    fs.writeFileSync(rp, fs.readFileSync(rp, 'utf8').replace('verified_commit: PENDING', `verified_commit: ${sha}`));
    fs.writeFileSync(path.join(ws, 'run-log.jsonl'), ids.map(id =>
      JSON.stringify({ ts: '2026-10-06T00:00:00Z', kind: 'eval', run_id: `seed-${id}`, sha, eval: id, exit_code: 0 }) + '\n').join(''));
  }
  g('add', '-A'); g('commit', '-qm', 'evidence');
  return { dir, g, sha, wsCu, wsThay, o };
}
function chay(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return { code: r.status === null ? 1 : r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
}
function chayLan(kho, extra = [], cwd, root = ROOT, slugs = ['ho-so-cu']) {
  return chay(process.execPath, [lane(root), '--root', kho.dir, ...slugs.flatMap(s => ['--slug', s]), '--ag-root', root, '--reason', 'ca kiểm', ...extra], cwd || kho.dir);
}
function chayRecheck(kho, slug = 'ho-so-cu', cwd, root = ROOT) {
  return chay(process.execPath, [recheck(root), path.join(kho.dir, '_acceptance', slug, 'evidence-report.md')], cwd || kho.dir);
}
function chayPreMerge(kho, cwd, root = ROOT) {
  return chay('bash', [premerge(root), kho.dir], cwd || kho.dir);
}
function bam(kho, slug = 'ho-so-cu') {
  const h = crypto.createHash('sha256');
  for (const f of ['run-log.jsonl', 'evidence-report.md']) h.update(fs.readFileSync(path.join(kho.dir, '_acceptance', slug, f)));
  h.update(fs.readdirSync(path.join(kho.dir, '_acceptance', slug)).sort().join('|'));
  return h.digest('hex');
}
// Dòng vi phạm làn-eval của hồ sơ cũ ở lưới trước-merge (lọc đúng luật, bỏ qua luật khác của fixture).
const viPhamLanCu = (pm) => pm.stdout.split('\n').filter(l => l.startsWith('VIOLATION [ho-so-cu]: re-pin lane'));

// ── T01 — nhận khi chứng đủ (AC-1) ─────────────────────────────────────────────
test('T01', 'nhan — con trỏ hợp lệ: làn --write 0, recheck 0, lưới trước-merge không vi phạm làn-eval cho ho-so-cu', () => {
  const k = dungKho();
  const r = chayLan(k, ['--write']);
  if (r.code !== 0) fail(`ô thay bởi hợp lệ vẫn bị chặn: exit ${r.code}\n${r.stderr.split('\n').slice(-6).join('\n')}`);
  const rc = chayRecheck(k);
  if (rc.code !== 0) fail(`recheck đỏ sau pin hợp lệ: ${rc.stderr}`);
  const pm = chayPreMerge(k);
  const vp = viPhamLanCu(pm);
  if (vp.length) fail(`lưới trước-merge vẫn ghi vi phạm làn-eval: ${vp.join(' | ')}`);
});
test('T01', 'nhan — đối chứng: gỡ con trỏ → làn exit 2 với thông điệp xung đột cũ NGUYÊN VĂN, không ghi byte', () => {
  const k = dungKho({ conTro: null });
  const truoc = bam(k);
  const r = chayLan(k, ['--write']);
  if (r.code !== 2 || !r.stderr.includes(XUNG_DOT_CU)) fail(`đối chứng hỏng: exit ${r.code}\n${r.stderr}`);
  if (bam(k) !== truoc) fail('làn ghi byte khi dừng ở xung đột');
});

// ── T02 — dạng con trỏ (Review Focus 1) ─────────────────────────────────────────
test('T02', 'dang — con trỏ bọc nháy kép + chú thích đuôi vẫn được nhận', () => {
  const r = chayLan(dungKho({ conTro: '"ho-so-thay#AC-2"   # thay theo bảng' }));
  if (r.code !== 0) fail(`con trỏ hợp lệ bọc nháy bị từ chối: exit ${r.code}\n${r.stderr}`);
});
test('T02', 'dang — con trỏ bọc nháy đơn vẫn được nhận', () => {
  const r = chayLan(dungKho({ conTro: "'ho-so-thay#AC-2'" }));
  if (r.code !== 0) fail(`con trỏ hợp lệ nháy đơn bị từ chối: exit ${r.code}\n${r.stderr}`);
});

// ── T03 — bên gọi cũ vẫn chặn (AC-3) ────────────────────────────────────────────
const docCu = (k) => [fs.readFileSync(path.join(k.wsCu, 'evals.yaml'), 'utf8'), fs.readFileSync(path.join(k.wsCu, 'evidence-report.md'), 'utf8')];
test('T03', 'ben-goi-cu — notRunConflicts hai đối số: ô vẫn xung đột, lý do khong-tra-duoc', () => {
  const k = dungKho();
  const core = require(path.join(ROOT, 'lib', 'evidence-core.cjs'));
  const r = core.notRunConflicts(...docCu(k));
  if (!r.xungDot.includes('E3')) fail(`bên gọi cũ bị nới lặng: ${JSON.stringify(r)}`);
  if (!(r.lyDo || []).some(l => l.startsWith('E3: khong-tra-duoc ('))) fail(`thiếu lý do khong-tra-duoc: ${JSON.stringify(r)}`);
});
test('T03', 'ben-goi-cu — checkRepinEvals bốn đối số: vẫn vi phạm, gọi tên khong-tra-duoc', () => {
  const k = dungKho();
  const core = require(path.join(ROOT, 'lib', 'evidence-core.cjs'));
  const [ev, rp] = docCu(k);
  const { errs } = core.checkRepinEvals({ run_id: 'x', sha: k.sha, ts: 't', evals_exit: { E1: 0 } }, ev, 'ho-so-cu', rp);
  if (!errs.some(e => e.includes('hai vế mâu thuẫn') && e.includes('khong-tra-duoc'))) fail(`bên đọc cũ bị nới lặng: ${errs.join(' | ')}`);
});
test('T03', 'ben-goi-cu — lib thiếu ac-line.cjs hoặc workspace-record.cjs: khong-tra-duoc, không ném; đủ tệp thì nhận', () => {
  const k = dungKho();
  const [ev, rp] = docCu(k);
  for (const thieu of ['ac-line.cjs', 'workspace-record.cjs']) {
    const lib = path.join(TMP, `lib-thieu-${thieu}`);
    fs.cpSync(path.join(ROOT, 'lib'), lib, { recursive: true });
    fs.rmSync(path.join(lib, thieu));
    if (fs.existsSync(path.join(lib, thieu))) fail('bước gỡ tệp chưa bao giờ chạy');
    const core = require(path.join(lib, 'evidence-core.cjs'));
    let r;
    try { r = core.notRunConflicts(ev, rp, { root: k.dir, slug: 'ho-so-cu' }); } catch (e) { fail(`thiếu ${thieu} thì ném: ${e.message}`); }
    if (!(r.lyDo || []).some(l => l.startsWith('E3: khong-tra-duoc ('))) fail(`thiếu ${thieu} mà không ra khong-tra-duoc: ${JSON.stringify(r)}`);
  }
  const core = require(path.join(ROOT, 'lib', 'evidence-core.cjs'));
  const r = core.notRunConflicts(ev, rp, { root: k.dir, slug: 'ho-so-cu' });
  if (r.xungDot.length || !(r.thayBoi || []).some(t => t.id === 'E3' && t.thay === 'ho-so-thay' && t.ac === 'AC-2')) fail(`đối chứng dương hỏng (đủ tệp + gốc cây phải nhận): ${JSON.stringify(r)}`);
});

// ── chạy ───────────────────────────────────────────────────────────────────────
const want = (process.env.ETB_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const chon = want.length ? CASES.filter(c => want.includes(c.id)) : CASES;
if (!chon.length) { console.error(`eval-thay-boi: ETB_CASES=${want.join(',')} khớp 0 ca`); process.exit(1); }
let bad = 0;
for (const c of chon) {
  try { c.fn(); console.log(`  PASS: ${c.id} ${c.name}`); }
  catch (e) { bad++; console.log(`  FAIL: ${c.id} ${c.name} — ${e.message}`); }
}
console.log(`\nResults: ${chon.length - bad} passed, ${bad} failed`);
process.exit(bad ? 1 : 0);
