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
  // Hồ sơ cũ CÓ hợp đồng đã ký: thiếu nó thì lưới trước-merge dừng ở «no contract.md» và
  // không bao giờ chấm luật hai vế — ca xanh mà không đo gì (bắt được 06/10 khi dựng T04).
  fs.writeFileSync(path.join(ws, 'contract.md'), hopDong('ho-so-cu', ['AC-1']));
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
  if (o.designDocCo) { fs.mkdirSync(path.dirname(ddPath), { recursive: true }); fs.writeFileSync(ddPath, `# Thiết kế\n\n${o.nhanO === 'design' ? dong : ''}\n`); }
  else fs.rmSync(ddPath, { force: true });   // hàng «design doc vắng» đổi trên kho đã ghim: gỡ tệp của lượt lành
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
  // MỌI vi phạm của hồ sơ cũ, không riêng luật làn-eval: một lỗi khác (thiếu hợp đồng…) làm lưới
  // dừng sớm và không bao giờ chấm luật hai vế — ca xanh rỗng (bắt được 06/10).
  const vp = pm.stdout.split('\n').filter(l => l.startsWith('VIOLATION [ho-so-cu]'));
  if (vp.length) fail(`lưới trước-merge vẫn ghi vi phạm cho ho-so-cu: ${vp.join(' | ')}`);
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

// ── Ma trận từ chối — VIẾT TRƯỚC, mỗi hàng gãy ĐÚNG MỘT điều kiện từ ca lành ────────
const MA_TRAN = [
  { ten: 'con-tro-hong',          opts: { conTro: 'ho-so-thay-AC-2' },                                        lyDo: 'con-tro-hong' },
  { ten: 'slug-thoat-goc',        opts: { conTro: '../x#AC-2' },                                              lyDo: 'con-tro-hong' },
  { ten: 'tu-tro',                opts: { conTro: 'ho-so-cu#AC-2' },                                          lyDo: 'tu-tro' },
  { ten: 'ho-so-thay-vang',       opts: { conTro: 'khong-co#AC-2' },                                          lyDo: 'ho-so-thay-vang' },
  { ten: 'chua-ky-verified',      opts: { statusThay: 'verified' },                                           lyDo: 'ho-so-thay-chua-ky' },
  { ten: 'chi-may-thong',         opts: { statusThay: 'machine-cleared' },                                    lyDo: 'ho-so-thay-chua-ky' },
  { ten: 'da-khep-nghi',          opts: { nghiThay: true },                                                   lyDo: 'ho-so-thay-da-khep' },
  { ten: 'khong-nhan',            opts: { nhanO: false },                                                     lyDo: 'thay-khong-nhan' },
  { ten: 'the-dinh-chu-E30',      opts: { theNhan: 'ho-so-cu/E30' },                                          lyDo: 'thay-khong-nhan' },
  { ten: 'the-dinh-chu-slug',     opts: { theNhan: 'ho-so-cu-2/E3' },                                         lyDo: 'thay-khong-nhan' },
  { ten: 'design-doc-vang',       opts: { designDocCo: false },                                               lyDo: 'thay-khong-nhan' },
  { ten: 'design-doc-ngoai-goc',  opts: { designDoc: '../ngoai-goc.md' },                                     lyDo: 'thay-khong-nhan' },
  { ten: 'ac-thay-vang',          opts: { conTro: 'ho-so-thay#AC-9' },                                        lyDo: 'ac-thay-vang' },
  { ten: 'ac-chi-khong-chay',     opts: { evalThay: { khaiKhongChay: true } },                                lyDo: 'ac-thay-khong-con-eval' },
  { ten: 'eval-them-sau-ky',      opts: { evalThay: { maThoatKy: null } },                                    lyDo: 'ac-thay-khong-con-eval' },
  { ten: 'tien-to-AC-1-vs-AC-10', opts: { conTro: 'ho-so-thay#AC-1', acThay: ['AC-1', 'AC-2', 'AC-10'], evalThay: { criterion: 'AC-10' } }, lyDo: 'ac-thay-khong-con-eval' },
  { ten: 'vong-tron',             opts: { evalThay: { khaiKhongChay: true, conTroNguoc: 'ho-so-cu#AC-1' } }, lyDo: 'ac-thay-khong-con-eval' },
];
const NHAN_THEM = [
  { ten: 'nhan-o-hop-dong',     opts: { nhanO: 'contract' } },
  { ten: 'criterion-nhieu-AC',  opts: { conTro: 'ho-so-thay#AC-7', acThay: ['AC-3', 'AC-7'], evalThay: { criterion: '"AC-3, AC-7"' } } },
  { ten: 'criterion-mang',      opts: { conTro: 'ho-so-thay#AC-7', acThay: ['AC-3', 'AC-7'], evalThay: { criterion: '[AC-3, AC-7]' } } },
];
// Ghim pin bằng làn lành, rồi đổi hồ sơ theo hàng — để recheck và lưới trước-merge có pin
// mà chấm (cả hai chỉ xét luật hai vế trên làn đang chống lưng verified_commit).
function khoDaGhimRoiDoi(opts, base = {}) {
  const k = dungKho(base);
  const r = chayLan(k, ['--write']);
  if (r.code !== 0) fail(`ghim lành thất bại (exit ${r.code}) — không dựng được tiền đề: ${r.stderr.split('\n').slice(-4).join(' / ')}`);
  const o = gop({ ...base, ...opts });
  ghiHoSoCu(k.dir, o);
  const wsThay = ghiHoSoThay(k.dir, o);
  const rp = path.join(wsThay, 'evidence-report.md');
  fs.writeFileSync(rp, fs.readFileSync(rp, 'utf8').replace('verified_commit: PENDING', `verified_commit: ${k.sha}`));
  return k;
}
const LY_DO_RE = /(E\d+): ([a-z-]+) \(/g;
const phanQuyet = (txt) => [...new Set([...String(txt).matchAll(LY_DO_RE)].map(m => `${m[1]}:${m[2]}`))].sort().join(',');

// ── T02 — ma trận từ chối có tên (AC-2) ─────────────────────────────────────────
// Kiểm MỘT hàng trên một bộ máy (ROOT, hoặc bản sao bị phá). Trả số assert đã chạy.
function kiemHang(h, root = ROOT) {
  const k = dungKho(h.opts);
  const truoc = bam(k);
  const lan = chayLan(k, ['--write'], undefined, root);
  if (lan.code === 0) fail(`đường né đo mở: ${h.lyDo} (${h.ten}) — làn nhận một con trỏ phải bị từ chối`);
  if (lan.code !== 2 || !lan.stderr.includes(`E3: ${h.lyDo} (`)) fail(`${h.ten}: làn exit ${lan.code}, cần 2 + «E3: ${h.lyDo} (» — ${lan.stderr.split('\n').slice(-3).join(' / ')}`);
  if (bam(k) !== truoc) fail(`${h.ten}: làn ghi byte khi từ chối`);
  const k2 = khoDaGhimRoiDoi(h.opts);
  const rc = chayRecheck(k2, 'ho-so-cu', undefined, root);
  if (rc.code === 0) fail(`đường né đo mở: ${h.lyDo} (${h.ten}) — recheck xanh trên pin mà hồ sơ thay không chứng được`);
  if (!rc.stderr.includes(`E3: ${h.lyDo} (`)) fail(`${h.ten}: recheck đỏ nhưng không gọi tên «E3: ${h.lyDo} (»`);
  return 2;
}
test('T02', 'ma-tran — mỗi hàng: làn exit 2 không ghi byte, recheck đỏ; cả hai gọi đúng id + con trỏ + lý do', () => {
  let soAssert = 0;
  for (const h of MA_TRAN) soAssert += kiemHang(h);
  if (soAssert !== MA_TRAN.length * 2) fail(`số ca lệch: ${soAssert} ≠ ${MA_TRAN.length * 2}`);
  // đối chứng dương cùng bộ dựng: lượt lành phải ĐỔI băm (băm-giống-nhau mới có nghĩa «không ghi»)
  const lanh = dungKho(); const b0 = bam(lanh);
  if (chayLan(lanh, ['--write']).code !== 0 || bam(lanh) === b0) fail('đối chứng dương hỏng: lượt lành không ghi');
});
test('T02', 'ma-tran — hàng NHẬN: criterion nhiều AC, dạng mảng, thẻ nằm trong hợp đồng → làn 0', () => {
  for (const h of NHAN_THEM) {
    const r = chayLan(dungKho(h.opts));
    if (r.code !== 0) fail(`${h.ten}: con trỏ hợp lệ bị từ chối — ${r.stderr.split('\n').slice(-2).join(' / ')}`);
  }
});
// Bốn mutant trên BẢN SAO bộ máy: mỗi mutant gỡ một điều kiện; hàng ma trận của điều kiện đó
// phải LỌT (làn 0) dưới mutant — chứng hàng đó là thứ bắt điều kiện, không phải hàng khác.
const MUTANT = [
  { ten: 'bo-kiem-chu-ky', hang: 'chi-may-thong',
    tu: "if (String(frontmatterField(hopDong, 'status') || '').trim() !== 'signed-off')", thanh: 'if (false)' },
  { ten: 'bo-kiem-nhan-viec', hang: 'khong-nhan',
    tu: 'if (!(the.test(hopDong) ||', thanh: 'if (false && !(the.test(hopDong) ||' },
  { ten: 'bo-kiem-ma-thoat-da-ky', hang: 'eval-them-sau-ky',
    tu: 'daKy.has(e.id) && (daKy.get(e.id) === 0 || daKy.get(e.id) === (mong.get(e.id) || 0))', thanh: 'true' },
  { ten: 'so-AC-bang-chuoi-con', hang: 'tien-to-AC-1-vs-AC-10',
    tu: "(String(e.criterion || '').match(/AC-\\d+/g) || []).includes(acId)", thanh: "String(e.criterion || '').includes(acId)" },
];
function banSaoBoMay(tiem) {
  const goc = fs.mkdtempSync(path.join(TMP, 'bo-may-'));
  for (const d of ['lib', 'scripts', path.join('feature-loop', 'scripts')]) fs.cpSync(path.join(ROOT, d), path.join(goc, d), { recursive: true });
  for (const [rel, tu, thanh] of tiem) {
    const f = path.join(goc, rel); const t = fs.readFileSync(f, 'utf8');
    const n = t.split(tu).length - 1;
    if (n !== 1) fail(`mũi tiêm vào ${rel} khớp ${n} lần (cần đúng 1) — neo đã trôi khỏi vật, sửa mũi tiêm chứ đừng tin màu xanh`);
    fs.writeFileSync(f, t.replace(tu, thanh));
    if (fs.readFileSync(f, 'utf8') === t) fail('bước tiêm chưa bao giờ chạy');
  }
  return goc;
}
test('T02', 'mutant — gỡ từng điều kiện thì đúng hàng của nó lọt qua (đường né đo mở)', () => {
  for (const m of MUTANT) {
    const h = MA_TRAN.find(x => x.ten === m.hang) || fail(`không có hàng ${m.hang}`);
    const goc = banSaoBoMay([[path.join('lib', 'evidence-core.cjs'), m.tu, m.thanh]]);
    kiemHang(h);                                   // bộ máy thật: hàng xanh
    let loi = null;
    try { kiemHang(h, goc); } catch (e) { loi = e.message; }
    if (!loi || !loi.startsWith(`đường né đo mở: ${h.lyDo} (${h.ten})`)) fail(`${m.ten}: mutant không làm hàng ${h.ten} đỏ đúng thông điệp ghim — nhận «${loi}»`);
  }
});

// ── T06 — pin nói ra (AC-6) ─────────────────────────────────────────────────────
// Khoá của dòng pin rút từ khối REPIN-TEMPLATE của SKILL feature-loop (đường suy từ ROOT) —
// dòng JSON ĐẦU trong khối là dòng `kind: repin`.
function khoaKhuonRepin(root = ROOT) {
  const t = fs.readFileSync(path.join(root, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'), 'utf8');
  const khoi = (t.split('<!-- <<<REPIN-TEMPLATE -->')[1] || '').split('<!-- REPIN-TEMPLATE>>> -->')[0];
  const dong = khoi.split('\n').find(l => l.startsWith('{') && l.includes('"kind":"repin"'));
  if (!dong) fail('không rút được dòng repin của khối REPIN-TEMPLATE');
  return new Set(Object.keys(JSON.parse(dong)));
}
const dongPinCuoi = (k, slug = 'ho-so-cu') => fs.readFileSync(path.join(k.dir, '_acceptance', slug, 'run-log.jsonl'), 'utf8')
  .trim().split('\n').map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(e => e && e.kind === 'repin').pop();
const HAU_TO_RE = /^sha: .* · thay bởi hồ sơ đã ký: (.+?)(?: · |$)/m;
function kiemPinNoiRa(root = ROOT) {
  const k = dungKho();
  const r = chayLan(k, ['--write'], undefined, root);
  if (r.code !== 0) fail(`làn không xanh: ${r.stderr.split('\n').slice(-2).join(' / ')}`);
  const pin = dongPinCuoi(k) || fail('không có dòng pin');
  if (JSON.stringify(pin.evals_not_run) !== JSON.stringify(['E3'])) fail(`evals_not_run = ${JSON.stringify(pin.evals_not_run)}, cần ["E3"]`);
  const khuon = khoaKhuonRepin(root);
  const la = Object.keys(pin).filter(x => !khuon.has(x));
  if (la.length) fail(`dòng pin có khoá ngoài khuôn REPIN-TEMPLATE: ${la.join(', ')}`);
  // đối chứng: cùng bộ dựng, E3 không con trỏ và không có khối đã ký → không xung đột, không thay bởi
  const k0 = dungKho({ conTro: null, kyE3: false });
  if (chayLan(k0, ['--write'], undefined, root).code !== 0) fail('đối chứng không xanh');
  const pin0 = dongPinCuoi(k0);
  const a = Object.keys(pin).sort().join(','), b = Object.keys(pin0).sort().join(',');
  if (a !== b) fail(`ô thay bởi đổi tập khoá của dòng pin: ${a} ≠ ${b}`);
  const bc = fs.readFileSync(path.join(k.wsCu, 'evidence-report.md'), 'utf8');
  const m = HAU_TO_RE.exec(bc);
  if (!m) fail('pin im lặng về ô thay bởi — dòng sha: thiếu hậu tố «thay bởi hồ sơ đã ký»');
  if (m[1] !== 'E3→ho-so-thay#AC-2') fail(`hậu tố sai: «${m[1]}»`);
  if (HAU_TO_RE.test(fs.readFileSync(path.join(k0.wsCu, 'evidence-report.md'), 'utf8'))) fail('hồ sơ không ô thay bởi mà dòng sha: vẫn mang hậu tố');
  if (chayRecheck(k, 'ho-so-cu', undefined, root).code !== 0) fail('recheck không nhận dòng sha: mang hậu tố');
}
test('T06', 'pin-noi-ra — evals_not_run có E3, không khoá mới, dòng sha: nói «E3→ho-so-thay#AC-2»; vắng khi không có ô thay bởi', () => kiemPinNoiRa());
test('T06', 'pin-noi-ra — mutant bỏ nối hậu tố → ĐỎ «pin im lặng về ô thay bởi»', () => {
  const goc = banSaoBoMay([[path.join('feature-loop', 'scripts', 'repin-lane.mjs'), '${veBoQua}${veThayBoi}', '${veBoQua}']]);
  for (const d of [path.join('feature-loop', 'skills')]) fs.cpSync(path.join(ROOT, d), path.join(goc, d), { recursive: true });
  let loi = null;
  try { kiemPinNoiRa(goc); } catch (e) { loi = e.message; }
  if (!loi || !loi.startsWith('pin im lặng về ô thay bởi')) fail(`mutant không bị bắt đúng thông điệp: «${loi}»`);
});

// ── T07 — chứng sống sau khi ghim (AC-7) ────────────────────────────────────────
function kiemChungSong(root = ROOT) {
  const k = dungKho();
  if (chayLan(k, ['--write'], undefined, root).code !== 0) fail('ghim lành không xanh');
  if (chayRecheck(k, 'ho-so-cu', undefined, root).code !== 0) fail('đối chứng dương hỏng: không đổi gì mà recheck đỏ');
  // (a) hồ sơ thay nghỉ (dòng nghỉ đủ vế, hồ sơ đã ký)
  fs.appendFileSync(path.join(k.wsThay, 'decisions.jsonl'), JSON.stringify({ id: 'd-20261006T010000Z-1', type: 'nghi', stage: 'gate2', at: '2026-10-06T01:00:00Z', by: 'Manh Phan', decision: 'tính năng gỡ' }) + '\n');
  const a = chayRecheck(k, 'ho-so-cu', undefined, root);
  if (a.code === 0) fail('lời hứa thay đã hết mà pin vẫn xanh — hồ sơ thay nghỉ, recheck 0');
  if (!a.stderr.includes('E3: ho-so-thay-da-khep (')) fail(`nghỉ: recheck đỏ nhưng không gọi tên ho-so-thay-da-khep — ${a.stderr.slice(0, 300)}`);
  // (b) kho mới: trạng thái hồ sơ thay lùi về verified sau khi ghim
  const k2 = dungKho();
  if (chayLan(k2, ['--write'], undefined, root).code !== 0) fail('ghim lành (b) không xanh');
  const c = path.join(k2.wsThay, 'contract.md');
  fs.writeFileSync(c, fs.readFileSync(c, 'utf8').replace(/^status: .*$/m, 'status: verified'));
  const b = chayRecheck(k2, 'ho-so-cu', undefined, root);
  if (b.code === 0) fail('lời hứa thay đã hết mà pin vẫn xanh — hồ sơ thay lùi trạng thái, recheck 0');
  if (!b.stderr.includes('E3: ho-so-thay-chua-ky (')) fail(`lùi trạng thái: thiếu ho-so-thay-chua-ky — ${b.stderr.slice(0, 300)}`);
}
test('T07', 'chung-song — hồ sơ thay nghỉ hoặc lùi trạng thái sau ghim → recheck pin cũ đỏ, gọi đúng lý do', () => kiemChungSong());
test('T07', 'chung-song — mutant bên đọc tin hậu tố sha: → ĐỎ «lời hứa thay đã hết mà pin vẫn xanh»', () => {
  const goc = banSaoBoMay([[path.join('lib', 'evidence-core.cjs'),
    '    const r = chungThayBoi({ root: opts && opts.root, slug: opts && opts.slug, id, conTro: ct });',
    "    if (/thay bởi hồ sơ đã ký:/.test(reportText)) { out.thayBoi.push({ id, thay: '?', ac: '?' }); continue; }\n    const r = chungThayBoi({ root: opts && opts.root, slug: opts && opts.slug, id, conTro: ct });"]]);
  fs.cpSync(path.join(ROOT, 'feature-loop', 'skills'), path.join(goc, 'feature-loop', 'skills'), { recursive: true });
  let loi = null;
  try { kiemChungSong(goc); } catch (e) { loi = e.message; }
  if (!loi || !loi.startsWith('lời hứa thay đã hết mà pin vẫn xanh')) fail(`mutant không bị bắt đúng thông điệp: «${loi}»`);
});

// ── T08 — kho không dùng trường giữ từng byte (AC-8) ────────────────────────────
// Vi phân theo MỐC BẤT BIẾN: `main` ngay trước vòng này (điểm gộp 06/10). Không neo
// merge-base động — sau khi gộp, merge-base = HEAD và chân nhạy đỏ vĩnh viễn. Ca này
// đo bộ hồ sơ kit tại HEAD, nên nó gãy theo mọi vòng sau đổi lưới — vì thế nó KHÔNG
// vào lượt chạy trọn của suite, chỉ chạy khi gọi tên (ETB_CASES=T08; eval E8).
const MOC_TRUOC = '8215e63a86a6ead2aa95bc1780f9e6b935621605';
const CHI_GOI_TEN = new Set(['T08']);
function dungBase() {
  const dir = fs.mkdtempSync(path.join(TMP, 'base-'));
  try { execFileSync('git', ['-C', SELF_ROOT, 'cat-file', '-e', `${MOC_TRUOC}^{commit}`], { stdio: 'ignore' }); }
  catch { fail(`không có base: mốc ${MOC_TRUOC.slice(0, 8)} không có trong kho (clone nông?)`); }
  const r = spawnSync('bash', ['-o', 'pipefail', '-c', `git -C '${SELF_ROOT}' archive ${MOC_TRUOC} scripts lib feature-loop/scripts | tar -x -C '${dir}'`], { encoding: 'utf8' });
  if (r.status !== 0) fail(`bung base hỏng: ${r.stderr}`);
  for (const f of ['lib/evidence-core.cjs', 'scripts/pre-merge-check.sh', 'scripts/recheck-evidence.cjs']) if (!fs.existsSync(path.join(dir, f))) fail(`base thiếu ${f} sau khi bung`);
  return dir;
}
function dauRa(root, kho) {   // đầu ra lưới + recheck mọi báo cáo, một chuỗi để so từng byte
  const pm = chay('bash', [premerge(root), kho, ...(kho === SELF_ROOT ? ['--base', MOC_TRUOC] : [])], kho);
  const acc = path.join(kho, '_acceptance');
  const rc = fs.readdirSync(acc).sort().filter(s => fs.existsSync(path.join(acc, s, 'evidence-report.md'))).map(s => {
    const r = chay(process.execPath, [recheck(root), path.join(acc, s, 'evidence-report.md')], kho);
    return `## ${s} ${r.code}\n${r.stdout}${r.stderr}`;
  });
  return { txt: `${pm.code}\n${pm.stdout}${pm.stderr}\n${rc.join('\n')}`, soHoSo: rc.length };
}
function kiemViPhan(root = ROOT) {
  const base = dungBase();
  const a0 = dauRa(base, SELF_ROOT), a1 = dauRa(root, SELF_ROOT);
  if (a0.soHoSo === 0) fail('không hồ sơ nào được chấm — phép so rỗng');
  if (a0.txt !== a1.txt) fail('kho không dùng trường đổi đầu ra — bộ hồ sơ kit');
  const b = khoDaGhimRoiDoi({ conTro: null });               // ô không-chạy xung đột, KHÔNG con trỏ
  if (dauRa(base, b.dir).txt !== dauRa(root, b.dir).txt) fail('kho không dùng trường đổi đầu ra — fixture xung đột không con trỏ');
  const c = khoDaGhimRoiDoi({});                             // chân nhạy: con trỏ hợp lệ
  if (dauRa(base, c.dir).txt === dauRa(root, c.dir).txt) fail('chân nhạy hỏng: con trỏ hợp lệ mà hai bản cho cùng đầu ra — phép so không phân biệt được gì');
  return a0.soHoSo;
}
test('T08', 'vi-phan — lưới + recheck: bộ hồ sơ kit và fixture không con trỏ giống từng byte bản trước vòng; con trỏ hợp lệ thì khác', () => {
  const n = kiemViPhan();
  console.log(`    (đã so ${n} hồ sơ kit tại HEAD với mốc ${MOC_TRUOC.slice(0, 8)})`);
});
test('T08', 'vi-phan — mutant đổi một chữ thông điệp xung đột cũ → ĐỎ «kho không dùng trường đổi đầu ra»', () => {
  const goc = banSaoBoMay([[path.join('lib', 'evidence-core.cjs'), 'hai vế mâu thuẫn; sửa hồ sơ rồi chạy làn MỚI', 'hai vế mâu thuẫn; sửa hồ sơ rồi chạy làn mới!']]);
  let loi = null;
  try { kiemViPhan(goc); } catch (e) { loi = e.message; }
  if (!loi || !loi.startsWith('kho không dùng trường đổi đầu ra')) fail(`mutant không bị bắt đúng thông điệp: «${loi}»`);
});

// ── T09 — khuôn tài liệu đi qua bộ đọc thật (AC-9) ───────────────────────────────
function rutKhuon(root = ROOT) {
  const t = fs.readFileSync(path.join(root, 'GUIDE.md'), 'utf8');
  const khoi = t.split('<!-- <<<EVAL-THAY-BOI-TEMPLATE -->')[1];
  if (khoi === undefined || !khoi.includes('<!-- EVAL-THAY-BOI-TEMPLATE>>> -->')) fail('không có khuôn để rút — GUIDE.md thiếu khối EVAL-THAY-BOI-TEMPLATE');
  const m = /```yaml\n([\s\S]*?)```/.exec(khoi.split('<!-- EVAL-THAY-BOI-TEMPLATE>>> -->')[0]);
  if (!m) fail('khối EVAL-THAY-BOI-TEMPLATE không có khối mã yaml');
  return m[1];
}
function kiemKhuon(root = ROOT) {
  const k = dungKho({ conTro: null });                // ô E3 viết lại HOÀN TOÀN từ khuôn
  const o = rutKhuon(root).replace(/<id>/g, 'E3').replace(/<slug thay>/g, 'ho-so-thay').replace(/<AC-n>/g, 'AC-2')
    .replace(/<giữ nguyên>/g, '"false"');
  if (/<[^>\n]+>/.test(o)) fail(`khuôn còn chỗ trống chưa điền: ${o}`);
  fs.writeFileSync(path.join(k.wsCu, 'evals.yaml'), `evals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: "true"\n${o.replace(/\n?$/, '\n')}`);
  const r = chayLan(k, [], undefined, root);
  if (r.code !== 0) fail(`khuôn tài liệu không khớp bộ đọc — làn exit ${r.code}: ${r.stderr.split('\n').slice(-2).join(' / ')}`);
}
test('T09', 'khuon-tai-lieu — rút khối GUIDE §7.1, điền chỗ trống, chạy làn thật → xanh', () => kiemKhuon());
test('T09', 'khuon-tai-lieu — mutant đổi tên trường trong khuôn → ĐỎ «khuôn tài liệu không khớp bộ đọc»', () => {
  const goc = banSaoBoMay([]);
  fs.cpSync(path.join(ROOT, 'feature-loop', 'skills'), path.join(goc, 'feature-loop', 'skills'), { recursive: true });
  const g = fs.readFileSync(path.join(ROOT, 'GUIDE.md'), 'utf8');
  const tiem = g.replace('    superseded_by: <slug thay>#<AC-n>', '    supersede_by: <slug thay>#<AC-n>');
  if (tiem === g) fail('bước tiêm chưa bao giờ chạy — khuôn không có dòng trường con trỏ');
  fs.writeFileSync(path.join(goc, 'GUIDE.md'), tiem);
  let loi = null;
  try { kiemKhuon(goc); } catch (e) { loi = e.message; }
  if (!loi || !loi.startsWith('khuôn tài liệu không khớp bộ đọc')) fail(`mutant không bị bắt đúng thông điệp: «${loi}»`);
});

// ── T04 — một nguồn, ba bên gọi (AC-4) ──────────────────────────────────────────
test('T04', 'mot-nguon — làn, recheck, lưới trước-merge trả CÙNG lý do ở mọi hàng ma trận', () => {
  let soHang = 0;
  for (const h of MA_TRAN) {
    const k = khoDaGhimRoiDoi(h.opts);
    const a = phanQuyet(chayLan(k).stderr);
    const b = phanQuyet(chayRecheck(k).stderr);
    const c = phanQuyet(viPhamLanCu(chayPreMerge(k)).join('\n'));
    if (a !== `E3:${h.lyDo}`) fail(`${h.ten}: làn trả «${a}», cần E3:${h.lyDo}`);
    if (!(a === b && b === c)) fail(`ba bên trả phán quyết khác nhau ở ${h.ten}: làn=${a} recheck=${b} premerge=${c}`);
    soHang++;
  }
  if (soHang !== MA_TRAN.length) fail(`số ca lệch: ${soHang} ≠ ${MA_TRAN.length}`);
});
test('T04', 'mot-nguon — ca lành: ba bên đều không có lý do nào, và làn thoát 0', () => {
  const k = dungKho();
  const lan = chayLan(k, ['--write']);
  if (lan.code !== 0 || phanQuyet(lan.stderr)) fail(`làn: exit ${lan.code} ${phanQuyet(lan.stderr)}`);
  const b = phanQuyet(chayRecheck(k).stderr); const c = phanQuyet(viPhamLanCu(chayPreMerge(k)).join('\n'));
  if (b || c) fail(`ca lành mà còn lý do: recheck=${b} premerge=${c}`);
});

// ── T05 — cây đang kiểm, không cây tác giả (AC-5) ─────────────────────────────────
test('T05', 'cay-dang-kiem — K2 (hồ sơ thay chưa ký) chạy từ cwd K1 (đã ký): làn, recheck, lưới đều từ chối ho-so-thay-chua-ky', () => {
  const k1 = dungKho();
  const k2lan = dungKho({ statusThay: 'verified' });
  const truoc = bam(k2lan);
  const lan = chayLan(k2lan, ['--write'], k1.dir);
  if (lan.code !== 2 || phanQuyet(lan.stderr) !== 'E3:ho-so-thay-chua-ky') fail(`đọc nhầm cây (làn): exit ${lan.code} ${phanQuyet(lan.stderr)}`);
  if (bam(k2lan) !== truoc) fail('làn ghi byte khi từ chối');
  const k2 = khoDaGhimRoiDoi({ statusThay: 'verified' });
  const rc = chayRecheck(k2, 'ho-so-cu', k1.dir);
  if (rc.code === 0 || phanQuyet(rc.stderr) !== 'E3:ho-so-thay-chua-ky') fail(`đọc nhầm cây (recheck): ${rc.stderr}`);
  const pm = phanQuyet(viPhamLanCu(chayPreMerge(k2, k1.dir)).join('\n'));
  if (pm !== 'E3:ho-so-thay-chua-ky') fail(`đọc nhầm cây (pre-merge): «${pm}»`);
  // đối chứng dương: K1 lành, chạy từ cwd K2 → nhận
  const k1b = dungKho();
  if (chayLan(k1b, ['--write'], k2.dir).code !== 0) fail('đối chứng dương hỏng: K1 lành chạy từ cwd K2 bị từ chối');
  if (chayRecheck(k1b, 'ho-so-cu', k2.dir).code !== 0) fail('đối chứng dương hỏng: recheck K1 từ cwd K2 đỏ');
});

// ── chạy ───────────────────────────────────────────────────────────────────────
const want = (process.env.ETB_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const chon = want.length ? CASES.filter(c => want.includes(c.id)) : CASES.filter(c => !CHI_GOI_TEN.has(c.id));
if (!chon.length) { console.error(`eval-thay-boi: ETB_CASES=${want.join(',')} khớp 0 ca`); process.exit(1); }
if (!want.length) console.log(`  (bỏ qua có tên: ${[...CHI_GOI_TEN].join(', ')} — vi phân theo mốc, chỉ chạy khi gọi tên qua ETB_CASES)`);
let bad = 0;
for (const c of chon) {
  try { c.fn(); console.log(`  PASS: ${c.id} ${c.name}`); }
  catch (e) { bad++; console.log(`  FAIL: ${c.id} ${c.name} — ${e.message}`); }
}
console.log(`\nResults: ${chon.length - bad} passed, ${bad} failed`);
process.exit(bad ? 1 : 0);
