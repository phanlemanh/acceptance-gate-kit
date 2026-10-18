// GT — hồ sơ ho-so-da-ky-giu-tuoi (hàng K-A): lệnh giữ tươi theo khoảng gộp, quy đỏ về PR gây ra, nhãn
// «đỏ sẵn trên nền». Ca GT<n> = AC-n của hợp đồng; GT0-* là ca đơn vị của luật nhãn dùng chung
// (lib/do-san-tren-nen.cjs). Kho thử git do code sinh trong lượt; «bản trước vòng» = `git archive 8fe79f1f (gốc so sau khi gộp #382, 18/10)`
// bung trong lượt. Mọi đường dẫn suy từ vị trí tệp này. Chọn ca: GT_CASES=GT0-bam,GT1 node <tệp>.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const require = createRequire(import.meta.url);
const DS = require(path.join(ROOT, 'lib', 'do-san-tren-nen.cjs'));
const NCG = require(path.join(ROOT, 'lib', 'nhan-canh-gay.cjs'));
export const BAN_TRUOC_VONG = '8fe79f1f41f5c060399f5b09ca2fd49137d9faef';

const chon = (process.env.GT_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
let passed = 0, failed = 0;
const tmp = [];
async function ca(ten, f) {
  if (chon.length && !chon.some(c => ten === c || ten.startsWith(`${c} `) || ten.startsWith(`${c}-`))) return;
  try { const kq = await f(); passed++; console.log(`PASS: ${ten}${kq ? ` — ${kq}` : ''}`); }
  catch (e) { failed++; console.log(`FAIL: ${ten}\n    ${String(e && e.stack || e).split('\n').slice(0, 6).join('\n    ')}`); }
}
const thuMuc = (tien) => { const d = mkdtempSync(path.join(tmpdir(), tien)); tmp.push(d); return d; };

// Kho git tối thiểu cho ca đơn vị: một hồ sơ, run-log tuỳ ý, config với khoá tuỳ ý.
function khoDonVi({ khoa, runLog = [], evalsYaml }) {
  const root = thuMuc('gt0-');
  const git = (...a) => execFileSync('git', ['-C', root, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const ws = path.join(root, '_acceptance', 'h5');
  mkdirSync(ws, { recursive: true });
  writeFileSync(path.join(root, '_acceptance', 'config.yaml'), `schema_version: 1\nfeature_loop:\n${khoa === undefined ? '' : `  do_san_tren_nen: ${khoa}\n`}  suite_keys: []\n`);
  writeFileSync(path.join(ws, 'evals.yaml'), evalsYaml || 'schema_version: 1\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.e1\n    expected: exit 0\n');
  git('init', '-q'); git('add', '-A'); git('commit', '-qm', 'goc');
  const sha = git('rev-parse', 'HEAD');
  writeFileSync(path.join(ws, 'run-log.jsonl'), runLog.map(l => (typeof l === 'string' ? l : JSON.stringify(l(sha)))).join('\n') + '\n');
  git('add', '-A'); git('commit', '-qm', 'nen');
  return { root, ws, git, sha };
}

const LOG_A = '(pass) ca-xanh [0.20ms]\nexpected 3 got 4\n    at /tmp/abc123/x.test.js:12:3\n(fail) ca-do [1.37ms]\nsau ca do\n';
const LOG_A_GIO = '(pass) ca-xanh [9.80ms]\nexpected 3 got 4\n    at /var/folders/zz/q1/x.test.js:12:9\n(fail) ca-do [12.04ms]\nsau ca do\n';
const LOG_B = '(pass) ca-xanh [0.20ms]\nTypeError: x is not a function\n    at /tmp/abc123/x.test.js:12:3\n(fail) ca-do [1.37ms]\nsau ca do\n';

await ca('GT0-bam — cùng ca khác lỗi khác băm · cùng lỗi khác giờ/đường dẫn bằng băm', () => {
  const a = DS.bamThongDiep(LOG_A, ['ca-do']);
  assert.match(a, /^[0-9a-f]{64}$/);
  assert.equal(DS.bamThongDiep(LOG_A_GIO, ['ca-do']), a, 'giờ chạy, đường tạm, số dòng-cột phải bị chuẩn hoá');
  assert.notEqual(DS.bamThongDiep(LOG_B, ['ca-do']), a, 'cùng ca mà đổi lỗi phải khác băm');
  assert.notEqual(DS.bamThongDiep(LOG_A, ['ca-khac']), a, 'khác ca phải khác băm');
  // Không rút được tên ca: 20 dòng cuối đã chuẩn hoá.
  const t1 = Array.from({ length: 30 }, (_, i) => `dong ${i} luc 2026-10-17T13:00:0${i % 10}Z mat 12ms`).join('\n');
  const t2 = t1.replace(/T13:00/g, 'T21:44').replace(/12ms/g, '9.5 ms');
  assert.equal(DS.bamThongDiep(t1, null), DS.bamThongDiep(t2, null));
  assert.notEqual(DS.bamThongDiep(t1, null), DS.bamThongDiep(t1.replace('dong 29', 'dong X'), null));
  // S4 lượt 1 (finding trong AC-6): ca đỏ MỚI ngoài trần 10 tên ca, và dòng FAIL mới khi không rút được tên ca, phải đổi băm.
  const bun = (n, them) => { const l = []; for (let i = 1; i <= n; i++) l.push(`expected ${i} got ${i + 1}`, `(fail) ca-${i} [1.00ms]`); if (them) l.push('TypeError: boom totally new', '(fail) ca-MOI [1.00ms]');
    l.push('', ...Array.from({ length: n }, (_, i) => `(fail) ca-${i + 1}`), ...(them ? ['(fail) ca-MOI'] : []), ` ${n + (them ? 1 : 0)} fail`); return l.join('\n'); };
  const tenCap10 = Array.from({ length: 10 }, (_, i) => `ca-${i + 1}`);   // đúng trần của bộ rút tên ca
  assert.equal(DS.bamThongDiep(bun(12, false), tenCap10), DS.bamThongDiep(bun(12, false).replace(/1\.00ms/g, '7.3ms'), tenCap10), 'đối chứng dương: cùng 12 ca đỏ, khác giờ → bằng băm');
  assert.notEqual(DS.bamThongDiep(bun(12, true), tenCap10), DS.bamThongDiep(bun(12, false), tenCap10), 'thêm ca đỏ thứ 13 ngoài trần 10 tên phải đổi băm');
  const kit = Array.from({ length: 30 }, (_, i) => `PASS: GT${i}`).join('\n');
  assert.notEqual(DS.bamThongDiep(`FAIL: GT9\n${kit}`, null), DS.bamThongDiep(kit.replace('PASS: GT0', 'FAIL: GT0'), null), 'dòng FAIL khác ở đầu nhật ký phải đổi băm');
  assert.notEqual(DS.bamThongDiep(`FAIL: GT9\n${kit}`, null), DS.bamThongDiep(kit, null), 'thêm một dòng FAIL ngoài 20 dòng cuối phải đổi băm');
  const tr = DS.trichThongDiep(LOG_A, ['ca-do']);
  assert.ok(tr.split('\n').length <= 3 && tr.includes('ca-do'), `trích phải ≤ 3 dòng và có tên ca: ${tr}`);
  return '8 cặp so + trích';
});

await ca('GT0-khoa — vắng/false tắt, true bật, giá trị sai ném gọi tên khoá', () => {
  assert.equal(DS.khoaTuText('schema_version: 1\nfeature_loop:\n  suite_keys: []\n'), false);
  assert.equal(DS.khoaTuText('feature_loop:\n  do_san_tren_nen: false\n'), false);
  assert.equal(DS.khoaTuText('feature_loop:\n  do_san_tren_nen: true\n'), true);
  assert.throws(() => DS.khoaTuText('feature_loop:\n  do_san_tren_nen: co\n'), (e) => /feature_loop\.do_san_tren_nen/.test(e.message) && /true \| false/.test(e.message));
  assert.equal(NCG.NHAN.DO_SAN, 'đỏ sẵn trên nền');
});

const dongNen = (sha, over = {}) => Object.assign({ ts: '2026-10-17T01:00:00Z', kind: 'nen-do', run_id: 'gt-nen-1', sha, tu: sha, ket_cuc: 'do-khoang',
  lenh_do: [{ eval: 'E1', cmd: 'sh e1.sh', exit: 1, thong_diep_bam: 'b'.repeat(64), trich: '(fail) ca-do', log: null }], quy_ve: [{ pr: 12, sha_truoc: sha, sha_sau: sha }] }, over);

await ca('GT0-dong-hong — run-log có dòng JSON hỏng xen giữa: bỏ dòng hỏng, không ném', () => {
  const k = khoDonVi({ khoa: true, runLog: ['{hong', (sha) => dongNen(sha), 'cung hong}'] });
  const ds = DS.docDongNen(k.root, 'h5', null);
  assert.equal(ds.length, 1);
  assert.equal(DS.docDongNen(k.root, 'h5', 'HEAD').length, 1, 'đọc qua git show cũng bỏ dòng hỏng');
  assert.deepEqual(DS.docDongNen(k.root, 'khong-co', 'HEAD'), []);
});

await ca('GT0-kiem — đạt ở ô khớp, mỗi vế hỏng một ô ghim veHong', () => {
  const evalsYaml = 'schema_version: 1\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.e1\n    expected: exit 0\n';
  const dn = DS.bamDinhNghia(evalsYaml, 'E1');
  assert.match(dn, /^[0-9a-f]{64}$/);
  const k = khoDonVi({ khoa: true, evalsYaml, runLog: [(sha) => dongNen(sha, { dinh_nghia: { E1: dn } })] });
  const co = { root: k.root, slug: 'h5', evalId: 'E1', bam: 'b'.repeat(64), dinhNghia: dn, headRef: 'HEAD', baseRef: null, khoa: true };
  const ok = DS.kiemDoSan(co);
  assert.equal(ok.dat, true, JSON.stringify(ok)); assert.equal(ok.runId, 'gt-nen-1'); assert.deepEqual(ok.pr, [12]);
  const o = (over, ve) => { const r = DS.kiemDoSan(Object.assign({}, co, over)); assert.equal(r.dat, false); assert.equal(r.veHong, ve, JSON.stringify(r)); };
  o({ khoa: false }, 'khoa-tat');
  o({ evalId: 'E2' }, 'khong-co-dong-nen');
  o({ runId: 'khong-ton-tai' }, 'khong-co-dong-nen');
  o({ bam: 'c'.repeat(64) }, 'khac-ca-hoac-thong-diep');
  o({ dinhNghia: 'd'.repeat(64) }, 'doi-dinh-nghia');
  // Nền không là tổ tiên của đỉnh: sha của dòng nền là commit trên nhánh khác.
  const nhanhGoc = k.git('symbolic-ref', '--short', 'HEAD');
  k.git('checkout', '-qb', 'nhanh-khac', k.sha); writeFileSync(path.join(k.root, 'x.txt'), 'x'); k.git('add', '-A'); k.git('commit', '-qm', 'khac');
  const lac = k.git('rev-parse', 'HEAD'); k.git('checkout', '-q', nhanhGoc);
  writeFileSync(path.join(k.ws, 'run-log.jsonl'), JSON.stringify(dongNen(lac, { dinh_nghia: { E1: dn } })) + '\n');
  o({}, 'nen-khong-tren-nhanh-chinh');
  assert.ok(DS.cauVeHong('khoa-tat').includes('feature_loop.do_san_tren_nen'));
  return '1 ô đạt + 5 vế hỏng';
});

await ca('GT0-diem-tach — bên đọc mặc định đọc ở điểm tách: có nhánh chính → đạt · không dò được nhánh chính → không gắn', () => {
  const evalsYaml = 'schema_version: 1\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.e1\n    expected: exit 0\n';
  const dn = DS.bamDinhNghia(evalsYaml, 'E1');
  const k = khoDonVi({ khoa: true, evalsYaml, runLog: [(sha) => dongNen(sha, { dinh_nghia: { E1: dn } })] });
  k.git('branch', '-M', 'main');
  const co = { root: k.root, slug: 'h5', evalId: 'E1', bam: 'b'.repeat(64), dinhNghia: dn, runId: 'gt-nen-1', khoa: true };
  // Đối chứng dương: HEAD trên nhánh chính → điểm tách = HEAD, dòng nền đọc được.
  assert.equal(DS.diemTachNhanhChinh(k.root).sha, k.git('rev-parse', 'HEAD'));
  assert.equal(DS.kiemDoSan(co).dat, true, JSON.stringify(DS.kiemDoSan(co)));
  // Nhánh mang tên lạ, không main/master/develop/trunk, không remote → không gắn nhãn, nêu lý do.
  k.git('branch', '-M', 'nhanh-la');
  const r = DS.kiemDoSan(co);
  assert.equal(r.dat, false); assert.equal(r.veHong, 'nen-khong-tren-nhanh-chinh');
  assert.match(r.lyDo, /không dò được nhánh chính/);
  return 'có main → đạt · không nhánh chính → nen-khong-tren-nhanh-chinh + lý do';
});

// ── Task 2: lượt ghim lại ghim từng hồ sơ · thông điệp đỏ · nhãn (GT2, GT3, GT6) ─────────────────────────────
// Kho thử do tests/scripts/giu-tuoi-fixture.mjs sinh: pin đầu do CHÍNH làn ghi, gộp PR là commit gộp thật.
const FX = await import(path.join(HERE, 'giu-tuoi-fixture.mjs'));
const { rutTenCa } = await import(path.join(ROOT, 'feature-loop', 'scripts', 'lib', 'chay-lai.mjs'));
const repinCua = (k, slug) => k.docLog(slug).filter(l => l.kind === 'repin');
const chuKy = (k, slug) => (k.docReport(slug).match(/^human_(signoff|override)\s*:.*$/gm) || []).join('\n');
// Dòng repin-do so giữa hai bản làn: bỏ giờ, mã lượt, thời lượng, tải máy, phút.
const chuanDauDo = (o) => { const x = JSON.parse(JSON.stringify(o)); for (const kk of ['ts', 'lan_id', 'wall_s', 'tai']) delete x[kk]; if (x.tong_ket) x.tong_ket.phut = 0; return JSON.stringify(x).replace(/repin-\d{8}T\d{6}Z-\d{5}/g, 'RUN'); };
// Lệnh giữ tươi (Task 4) — LỆNH THẬT `node <kit>/feature-loop/scripts/giu-tuoi.mjs` trên kho thử; `kit` = gốc bộ
// máy (cây này, bản sao bị tiêm, hay bản trước vòng). Bản không có tệp lệnh → ném «khong co lenh giu tuoi»: mã
// thoát của node khi thiếu tệp không bao giờ được đọc thành một kết quả.
function giuTuoi(k, args, { kit = ROOT, env } = {}) {
  const f = path.join(kit, 'feature-loop', 'scripts', 'giu-tuoi.mjs');
  const r = spawnSync(process.execPath, [f, '--root', k.root, '--ag-root', kit, ...args],
    { encoding: 'utf8', env: { ...process.env, GG_DAU: k.dau, ...(env || {}) }, timeout: 300000, killSignal: 'SIGKILL', maxBuffer: 256 * 1024 * 1024 });
  if (!existsSync(f) || /Cannot find module/.test(r.stderr || '')) throw new Error(`khong co lenh giu tuoi (${f}, mã ${r.status})`);
  return r;
}
const nenCua = (k, slug) => k.docLog(slug).filter(l => l.kind === 'nen-do');

await ca('GT2', () => {
  const k = FX.mkKhoGiuTuoi({ hoSo: ['H1', 'H2', 'H5'] });
  const truoc = Object.fromEntries(['H2', 'H5'].map(s => [s, { n: repinCua(k, s).length, ky: chuKy(k, s) }]));
  assert.ok(truoc.H2.ky.includes('human_signoff'), 'kho thử phải có chữ ký người để so');
  k.gop(12, { 'vat/H2-E1-phu.txt': 'cham H2\n', 'vat/H5-E1-phu.txt': 'cham H5\n' });
  const dinh = k.git('rev-parse', 'HEAD');
  k.xoaDau();
  const r = k.lane(['H2', 'H5'], ['--tung-ho-so', '--write', '--reason', 'giu tuoi']);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(k.dem('suite.txt'), 1, 'suite chung phải chạy đúng MỘT lần cho cả hai hồ sơ');
  const j = JSON.parse(r.stdout);
  assert.deepEqual([j.slugs.H2.ket_cuc, j.slugs.H5.ket_cuc], ['ghim', 'ghim']);
  const runIds = new Set();
  for (const s of ['H2', 'H5']) {
    const rp = repinCua(k, s);
    assert.equal(rp.length, truoc[s].n + 1, `${s}: đúng một dòng repin mới`);
    const cuoi = rp[rp.length - 1];
    runIds.add(cuoi.run_id);
    assert.equal(cuoi.sha, dinh); assert.equal(k.vc(s), dinh, `${s}: verified_commit = đỉnh`);
    assert.equal(cuoi.do_san, undefined, 'không nhãn thì khoá do_san vắng hẳn');
    assert.match(k.docReport(s), new RegExp(`\\n### Re-pin lần 2 — \\d{4}-\\d\\d-\\d\\d, do giu tuoi\\nrun_id: ${cuoi.run_id}\\nsha: ${dinh} · suites: 1 lệnh exit 0 · evals: 1/1 eval máy đạt kỳ vọng\\n$`));
    assert.equal(chuKy(k, s), truoc[s].ky, `${s}: chữ ký người không đổi byte`);
    const rc = k.recheck(s);
    assert.equal(rc.status, 0, `${s}: recheck phải xanh — ${rc.stderr}`);
  }
  assert.equal(runIds.size, 1, 'hai hồ sơ cùng run_id');
  // Đối chứng âm trên CÙNG kho: sửa tay sha của dòng repin cuối → bên đọc phải đỏ với thông điệp của nó.
  const p = path.join(k.root, '_acceptance', 'H5', 'run-log.jsonl');
  const ls = readFileSync(p, 'utf8').split('\n').filter(Boolean);
  const o = JSON.parse(ls[ls.length - 1]); o.sha = 'a'.repeat(40); ls[ls.length - 1] = JSON.stringify(o);
  writeFileSync(p, ls.join('\n') + '\n');
  const am = k.recheck('H5');
  assert.equal(am.status, 1, `đối chứng âm: recheck phải thoát 1 — ${am.stderr}`);
  assert.ok(am.stderr.includes(`none of the cited re-pin lane(s) matches verified_commit ${dinh}`), am.stderr);
  return '2 hồ sơ ghim cùng run_id · suite chạy 1 lần · chữ ký giữ byte · recheck xanh · đối chứng âm sửa sha → recheck 1';
});

await ca('GT3', () => {
  const k = FX.mkKhoGiuTuoi({ hoSo: ['H2', 'H5'] });
  const g = k.gop(12, { 'vat/H2-E1-phu.txt': 'cham H2\n', 'vat/H5-E1.txt': FX.noiDungDo({ ca: 'ca-h5-e1' }) });
  const dinh = g.sha_sau;
  const n0 = { H2: repinCua(k, 'H2').length, H5: repinCua(k, 'H5').length };
  const vc5 = k.vc('H5'); const rep5 = k.docReport('H5'); const log5 = k.docLog('H5').length;
  const lamSach = () => k.git('checkout', '-q', '--', '_acceptance');
  // Chiều đỏ — bản trước vòng: làn một-làn-N-hồ-sơ, H5 đỏ kéo H2 không được ghim.
  const ban = FX.banTruocVong();
  const cu = k.lane(['H2', 'H5'], ['--write'], { laneFile: ban.lane, agRoot: ban.agRoot });
  assert.equal(cu.status, 1, `bản trước vòng phải thoát 1: ${cu.stderr.slice(-400)}`);
  assert.equal(repinCua(k, 'H2').length, n0.H2, 'bản trước vòng: H2 KHÔNG được ghim (tái hiện lỗi)');
  const dauCu = k.docLog('H2').filter(l => l.kind === 'repin-do').pop();
  lamSach();
  // Không cờ, khoá vắng: bản mới cho cùng mã thoát và cùng dòng repin-do (bỏ giờ, mã lượt) như bản trước vòng.
  const moiKhongCo = k.lane(['H2', 'H5'], ['--write']);
  assert.equal(moiKhongCo.status, 1, moiKhongCo.stderr);
  assert.equal(repinCua(k, 'H2').length, n0.H2, 'không cờ: một đỏ là không ai ghim, như trước');
  assert.equal(chuanDauDo(k.docLog('H2').filter(l => l.kind === 'repin-do').pop()), chuanDauDo(dauCu), 'khoá vắng + không cờ: dòng repin-do y bản trước vòng');
  lamSach();
  // Có cờ: H2 ghim, H5 không, thoát 0.
  const r = k.lane(['H2', 'H5'], ['--tung-ho-so', '--write']);
  assert.equal(r.status, 0, r.stderr);
  assert.ok(r.stderr.includes('repin-lane: H5: không ghim — eval đỏ: E1=1'), r.stderr);
  const j = JSON.parse(r.stdout);
  assert.deepEqual([j.slugs.H2.ket_cuc, j.slugs.H5.ket_cuc], ['ghim', 'do']);
  assert.equal(repinCua(k, 'H2').length, n0.H2 + 1, 'H2 được ghim dù H5 đỏ'); assert.equal(k.vc('H2'), dinh);
  assert.equal(repinCua(k, 'H5').length, n0.H5, 'H5 không có dòng repin mới');
  assert.equal(k.vc('H5'), vc5); assert.equal(k.docReport('H5'), rep5, 'báo cáo H5 không đổi byte');
  const moi5 = k.docLog('H5').slice(log5);
  assert.equal(moi5.length, 1, 'H5 đúng một dòng mới'); const d = moi5[0];
  assert.equal(d.kind, 'repin-do'); assert.equal(d.sha, dinh);
  assert.equal(d.lenh_do.length, 1, JSON.stringify(d.lenh_do)); const m = d.lenh_do[0];
  assert.equal(m.eval, 'E1'); assert.notEqual(m.exit, 0); assert.match(m.thong_diep_bam, /^[0-9a-f]{64}$/);
  assert.ok(m.trich.includes('ca-h5-e1') && m.trich.includes('expected 3 got 4'), `trích phải có tên ca và lời lỗi: ${m.trich}`);
  assert.equal(d.dinh_nghia.E1, DS.bamDinhNghia(readFileSync(path.join(k.root, '_acceptance', 'H5', 'evals.yaml'), 'utf8'), 'E1'));
  // Round-trip: băm làn ghi = băm của lời lệnh khi chạy lại ở chỗ khác (`${out}\n${err}`) — bên viết dòng nền dùng được.
  const lai = spawnSync('sh', ['rang/H5-E1.sh'], { cwd: k.root, encoding: 'utf8' });
  const loi = `${lai.stdout}\n${lai.stderr}`;
  assert.equal(DS.bamThongDiep(loi, rutTenCa(loi)), m.thong_diep_bam, 'băm của làn phải bằng băm của lời lệnh chạy lại');
  assert.equal(k.docLog('H2').filter(l => l.kind === 'repin-do').length, 0, 'H2 không nhận dấu đỏ ở lượt có cờ (dấu của hai lượt không cờ đã trả về bản commit)');
  lamSach();
  // Chiều đỏ trong cùng ca: suite chung đỏ → 0 hồ sơ ghim, thoát 1, câu ghim.
  k.gop(13, { 'vat/suite-hong': 'x\n' });
  const n1 = { H2: repinCua(k, 'H2').length, H5: repinCua(k, 'H5').length };
  const sd = k.lane(['H2', 'H5'], ['--tung-ho-so', '--write']);
  assert.equal(sd.status, 1, sd.stderr);
  assert.ok(sd.stderr.includes('suite chung đỏ — không ghim hồ sơ nào'), sd.stderr);
  assert.deepEqual([repinCua(k, 'H2').length, repinCua(k, 'H5').length], [n1.H2, n1.H5], 'suite đỏ: không hồ sơ nào được ghim');
  const sj = JSON.parse(sd.stdout); assert.deepEqual([sj.slugs.H2.ket_cuc, sj.slugs.H5.ket_cuc], ['do', 'do']);
  const dsH2 = k.docLog('H2').pop();
  assert.equal(dsH2.kind, 'repin-do'); assert.equal(dsH2.lenh_do[0].suite, 0); assert.match(dsH2.lenh_do[0].thong_diep_bam, /^[0-9a-f]{64}$/);
  // Phần lệnh giữ tươi (AC-3): CHÍNH lệnh --write trên kho mới — H2 ghim, H5 không, H5 đúng một dòng nen-do.
  const kg = FX.mkKhoGiuTuoi({ hoSo: ['H2', 'H5'] });
  const tu = kg.git('rev-parse', 'HEAD');
  kg.gop(12, { 'vat/H2-E1-phu.txt': 'cham H2\n', 'vat/H5-E1.txt': FX.noiDungDo({ ca: 'ca-h5-e1' }) });
  const dinhG = kg.git('rev-parse', 'HEAD');
  const m0 = { H2: repinCua(kg, 'H2').length, H5: repinCua(kg, 'H5').length };
  const vcG5 = kg.vc('H5');
  const rg = giuTuoi(kg, ['--tu', tu, '--write']);
  assert.equal(rg.status, 0, rg.stderr.slice(-800));
  assert.equal(repinCua(kg, 'H2').length, m0.H2 + 1, 'lệnh: H2 được ghim dù H5 đỏ'); assert.equal(kg.vc('H2'), dinhG);
  assert.equal(repinCua(kg, 'H5').length, m0.H5, 'lệnh: H5 không có repin mới'); assert.equal(kg.vc('H5'), vcG5, 'lệnh: verified_commit H5 giữ');
  const nen = nenCua(kg, 'H5');
  assert.equal(nen.length, 1, 'H5 đúng một dòng nen-do'); assert.equal(nenCua(kg, 'H2').length, 0, 'H2 xanh: không dòng nền');
  const n = nen[0];
  assert.equal(n.run_id, repinCua(kg, 'H2').pop().run_id, 'run_id của dòng nền = run_id của lượt ghim');
  assert.equal(n.sha, dinhG); assert.equal(n.tu, tu); assert.equal(n.ket_cuc, 'do-khoang');
  assert.equal(n.lenh_do[0].eval, 'E1'); assert.notEqual(n.lenh_do[0].exit, 0);
  assert.match(n.lenh_do[0].thong_diep_bam, /^[0-9a-f]{64}$/); assert.ok(n.lenh_do[0].trich.includes('ca-h5-e1'), n.lenh_do[0].trich);
  const dnG = DS.bamDinhNghia(readFileSync(path.join(kg.root, '_acceptance', 'H5', 'evals.yaml'), 'utf8'), 'E1');
  assert.equal(n.evals_hash.E1, dnG); assert.equal(n.dinh_nghia.E1, dnG);
  // Chiều đỏ của lệnh: suite chung đỏ → thoát 1, câu ghim, không repin mới, không dòng nền mới.
  kg.git('add', '-A'); kg.git('commit', '-qm', 'giu tuoi: ghi so');
  const tu2 = kg.git('rev-parse', 'HEAD');
  kg.gop(13, { 'vat/suite-hong': 'x\n', 'vat/H2-E1-phu.txt': 'cham lai H2\n' });
  const m1 = { H2: repinCua(kg, 'H2').length, nen: nenCua(kg, 'H5').length };
  const sg = giuTuoi(kg, ['--tu', tu2, '--write']);
  assert.equal(sg.status, 1, sg.stderr.slice(-600));
  assert.ok(sg.stderr.includes('giu-tuoi: suite chung đỏ — không ghim hồ sơ nào'), sg.stderr.slice(-600));
  assert.deepEqual([repinCua(kg, 'H2').length, nenCua(kg, 'H5').length], [m1.H2, m1.nen], 'lệnh, suite đỏ: không ghim, không dòng nền');
  return 'H2 ghim · H5 repin-do (E1, băm 64 hex, trích có ca) · không cờ = bản trước vòng · suite đỏ → 0 ghim · bản trước vòng: H2 không ghim · lệnh --write: H5 một dòng nen-do (run_id, sha, tu, do-khoang, E1, evals_hash.E1), suite đỏ → thoát 1';
});

await ca('GT6', () => {
  const k = FX.mkKhoGiuTuoi({ hoSo: [{ slug: 'H5', evals: [{ id: 'E1', ca: 'ca-do' }, { id: 'E2', ca: 'ca-e2' }] }], khoa: true });
  const tu6 = k.git('rev-parse', 'HEAD');
  const g12 = k.gop(12, { 'vat/H5-E1.txt': FX.noiDungDo({ ca: 'ca-do' }) });
  // Nền: CHÍNH lệnh giữ tươi --write trên nhánh chính ghi dòng nền (round-trip bên viết → luật nhãn của làn
  // vòng khác). Thay hàm fixture dongNenTuDauDo của Task 2.
  const rg = giuTuoi(k, ['--tu', tu6, '--write']);
  assert.equal(rg.status, 0, rg.stderr.slice(-800));
  const nens = nenCua(k, 'H5');
  assert.equal(nens.length, 1, `lệnh giữ tươi phải ghi đúng một dòng nền: ${JSON.stringify(nens).slice(0, 300)}`);
  const RUN_NEN = nens[0].run_id;
  assert.deepEqual(nens[0].quy_ve, [{ pr: 12, sha_truoc: g12.sha_truoc, sha_sau: g12.sha_sau }]);
  const dongNen = JSON.stringify(nens[0]);
  const bamNen = nens[0].lenh_do[0].thong_diep_bam;
  assert.match(bamNen, /^[0-9a-f]{64}$/);
  k.git('add', '-A'); k.git('commit', '-qm', 'giu tuoi: dong nen');
  let soO = 0, i = 0;
  // Một ô: nhánh vòng tách từ `tu`, chạm paths của H5, sửa thêm theo ô, commit, chạy làn (không cờ, --write).
  const o = (ten, { tu = 'main', sua = {}, truoc } = {}) => {
    i += 1;
    k.git('checkout', '-qf', 'main');
    k.git('checkout', '-q', '-B', `vong-${i}`, tu);
    if (truoc) truoc();
    k.commit(Object.assign({ 'vat/H5-E1-phu.txt': `cham ${ten}\n` }, sua), `vong ${ten}`);
    const n = repinCua(k, 'H5').length; const nLog = k.docLog('H5').length;
    const r = k.lane(['H5'], ['--write', '--reason', 'vong khac']);
    return { r, n, nLog };
  };
  const odo = (ten, x, ve, ev = 'E1') => {
    assert.equal(x.r.status, 1, `${ten}: phải thoát 1 — ${x.r.stderr.slice(-500)}`);
    assert.equal(repinCua(k, 'H5').length, x.n, `${ten}: không repin mới`);
    const moi = k.docLog('H5').slice(x.nLog);
    assert.ok(moi.length === 1 && moi[0].kind === 'repin-do', `${ten}: phải có đúng một repin-do: ${JSON.stringify(moi).slice(0, 300)}`);
    const cau = `repin-lane: H5/${ev}: nhãn không gắn: ${DS.cauVeHong(ve)}`;
    assert.ok(x.r.stderr.includes(cau), `${ten}: stderr phải nêu vế «${ve}» — ${x.r.stderr.slice(-600)}`);
    soO += 1;
  };
  // Ô 1 — khớp: cùng ca, cùng thông điệp, định nghĩa giữ.
  const khop = o('khop');
  assert.equal(khop.r.status, 0, khop.r.stderr);
  const pin = repinCua(k, 'H5').pop();
  assert.equal(repinCua(k, 'H5').length, khop.n + 1);
  assert.equal(pin.do_san.E1.run_id, RUN_NEN); assert.equal(pin.do_san.E1.thong_diep_bam, bamNen);
  assert.notEqual(pin.evals_exit.E1, 0); assert.equal(pin.evals_exit.E2, 0);
  assert.deepEqual(Object.keys(pin.do_san), ['E1'], 'do_san chỉ mang eval đỏ');
  assert.ok(k.docReport('H5').includes(` · đỏ sẵn trên nền: E1←${RUN_NEN}\n`), k.docReport('H5').slice(-400));
  assert.equal(k.vc('H5'), k.git('rev-parse', 'HEAD'));
  assert.equal(k.recheck('H5').status, 0, 'bên đọc nhận dòng có nhãn');
  soO += 1;
  // Chiều đỏ: bản trước vòng ở ô khớp — thoát 1, không pin (tái hiện ca 15/10).
  k.git('checkout', '-q', '--', '_acceptance');
  const ban = FX.banTruocVong();
  const nCu = repinCua(k, 'H5').length;
  const cu = k.lane(['H5'], ['--write'], { laneFile: ban.lane, agRoot: ban.agRoot });
  assert.equal(cu.status, 1, `bản trước vòng ở ô khớp phải thoát 1: ${cu.stderr.slice(-300)}`);
  assert.equal(repinCua(k, 'H5').length, nCu, 'bản trước vòng: không pin');
  // Sáu ô đỏ.
  odo('them E2 do', o('them-e2', { sua: { 'vat/H5-E2.txt': FX.noiDungDo({ ca: 'ca-e2' }) } }), 'khong-co-dong-nen', 'E2');
  odo('ca khac', o('ca-khac', { sua: { 'vat/H5-E1.txt': FX.noiDungDo({ ca: 'ca-khac' }) } }), 'khac-ca-hoac-thong-diep');
  odo('cung ca khac thong diep', o('thong-diep', { sua: { 'vat/H5-E1.txt': FX.noiDungDo({ ca: 'ca-do', loi: 'TypeError: x is not a function' }) } }), 'khac-ca-hoac-thong-diep');
  odo('khoi E1 doi', o('dinh-nghia', { truoc: () => { const p = '_acceptance/H5/evals.yaml'; k.ghi(p, k.doc(p).replace('  - id: E1\n    criterion: AC-1\n', '  - id: E1\n    criterion: AC-2\n')); } }), 'doi-dinh-nghia');
  // Dòng nền có trong cây nhánh vòng mà không có ở điểm tách → vế «không nằm trên lịch sử nhánh chính» (từ 18/10,
  // luật phân biệt ca này với «không có dòng nền nào» — cùng một luật bên đọc dùng ở GT7 ô giả 4).
  odo('nen chi tren nhanh vong', o('chi-nhanh', { tu: g12.sha_sau, truoc: () => k.noiDong('H5', dongNen) }), 'nen-khong-tren-nhanh-chinh');
  odo('khoa vang', o('khoa-vang', { truoc: () => k.datKhoa(undefined) }), 'khoa-tat');
  assert.equal(soO, 7, `ca tự kiểm số ô: ${soO}`);
  // Ca phụ: khoá sai → thoát 2 gọi tên khoá, không ghi gì.
  k.git('checkout', '-qf', 'main'); k.git('checkout', '-q', '-B', 'vong-khoa-sai', 'main');
  k.datKhoa('co'); k.git('commit', '-qam', 'khoa sai');
  const nLog = k.docLog('H5').length;
  const ks = k.lane(['H5'], ['--write']);
  assert.equal(ks.status, 2, ks.stderr);
  assert.ok(ks.stderr.includes('feature_loop.do_san_tren_nen') && ks.stderr.includes('true | false'), ks.stderr);
  assert.equal(k.docLog('H5').length, nLog, 'khoá sai: không ghi dòng nào');
  return `${soO}/7 ô · ca phụ khoá "co" thoát 2 · bản trước vòng ở ô khớp thoát 1`;
});

// ── Task 3: bên đọc — lưới, kiểm lại, thẻ, bản đồ (GT7, GT9) ───────────────────────────────────────────────────
// Bốn công cụ chạy theo MỘT gốc bộ máy (cây này · bản sao bị tiêm · bản trước vòng) trên CÙNG kho thử.
const congCu = (kit) => ({
  pm: (root) => spawnSync('bash', [path.join(kit, 'scripts', 'pre-merge-check.sh'), root], { encoding: 'utf8', cwd: root, timeout: 300000, maxBuffer: 64 * 1024 * 1024 }),
  rc: (root, slug) => spawnSync(process.execPath, [path.join(kit, 'scripts', 'recheck-evidence.cjs'), path.join(root, '_acceptance', slug, 'evidence-report.md')], { encoding: 'utf8', cwd: root }),
  gc: (root, slug) => spawnSync(process.execPath, [path.join(kit, 'scripts', 'gate-card.js'), '--root', root, '--slug', slug], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }),
  // Bản đồ GHI PRODUCT-MAP.md vào gốc kho: đọc rồi xoá ngay, để cây không bẩn cho công cụ sau.
  mp: (root) => {
    const r = spawnSync(process.execPath, [path.join(kit, 'scripts', 'product-map.mjs'), '--root', root], { encoding: 'utf8' });
    const p = path.join(root, 'PRODUCT-MAP.md');
    const map = existsSync(p) ? readFileSync(p, 'utf8') : '';
    rmSync(p, { force: true });
    return Object.assign(r, { map });
  },
});
const MOI = congCu(ROOT);
const RUN_NEN7 = 'giu-tuoi-gt7';
const NOTE7 = `NOTE [H5]: đỏ sẵn trên nền — E1 (nền ${RUN_NEN7}, PR #12)`;
const dongH5 = (map) => map.split('\n').filter(l => l.includes('`H5`'));
const viH5 = (out) => out.split('\n').filter(l => l.startsWith('VIOLATION') && l.includes('[H5]'));
// Bản sao cây bộ máy (cp -RL) với kiemDoSan bị ép trả `kq` — ba bên viết/đọc của BẢN SAO cùng gọi nó.
function banSaoTiem(kq) {
  const d = thuMuc('gt7-tiem-');
  for (const x of ['feature-loop', 'lib', 'scripts', 'skills', 'commands', 'hooks']) execFileSync('cp', ['-RL', path.join(ROOT, x), path.join(d, x)]);
  const p = path.join(d, 'lib', 'do-san-tren-nen.cjs');
  const goc = readFileSync(p, 'utf8');
  const tiem = goc.replace('function kiemDoSan({', `function kiemDoSan() { return ${JSON.stringify(kq)}; }\nfunction kiemDoSanGoc({`);
  assert.notEqual(tiem, goc, 'nhát tiêm phải đổi tệp luật của bản sao');
  writeFileSync(p, tiem);
  assert.equal(require(p).kiemDoSan({}).dat, kq.dat, 'bản sao phải trả đúng kết quả bị ép');
  return { dir: d, lane: path.join(d, 'feature-loop', 'scripts', 'repin-lane.mjs'), cc: congCu(d) };
}
// Kho của ô hợp lệ: H5 đỏ E1 do PR #12 trên main, dòng nền ghi (writer: dòng repin-do của làn thật), nhánh
// vòng chạm paths H5. `truocGhim(k)` chạy trước lượt ghim thật (chỗ đo bên viết bị tiêm); sau đó làn thật ghi
// pin mang nhãn và commit.
function khoO7({ truocGhim } = {}) {
  const k = FX.mkKhoGiuTuoi({ hoSo: [{ slug: 'H5', evals: [{ id: 'E1', ca: 'ca-do' }] }], khoa: true });
  const g12 = k.gop(12, { 'vat/H5-E1.txt': FX.noiDungDo({ ca: 'ca-do' }) });
  const rg = k.lane(['H5'], ['--tung-ho-so', '--write']);
  assert.equal(rg.status, 0, rg.stderr);
  k.noiDong('H5', k.dongNenTuDauDo('H5', { runId: RUN_NEN7, tu: g12.sha_truoc, quyVe: [{ pr: 12, sha_truoc: g12.sha_truoc, sha_sau: g12.sha_sau }] }));
  k.git('add', '-A'); k.git('commit', '-qm', 'giu tuoi: dong nen');
  k.git('checkout', '-q', '-b', 'vong-1');
  k.commit({ 'vat/H5-E1-phu.txt': 'cham vong 1\n' }, 'vong 1');
  if (truocGhim) truocGhim(k);
  const r = k.lane(['H5'], ['--write', '--reason', 'vong khac']);
  assert.equal(r.status, 0, `làn thật ở ô hợp lệ phải xanh: ${r.stderr.slice(-500)}`);
  const pin = repinCua(k, 'H5').pop();
  assert.equal(pin.do_san.E1.run_id, RUN_NEN7, JSON.stringify(pin));
  k.git('add', '-A'); k.git('commit', '-qm', 'vong 1: repin');
  assert.equal(k.git('status', '--porcelain'), '', 'kho phải sạch sau khi dựng');
  return k;
}
// Sửa dòng repin cuối của H5 ngay trên cây (hoàn bằng git checkout).
const suaPinCuoi = (k, f) => {
  const p = path.join(k.root, '_acceptance', 'H5', 'run-log.jsonl');
  const ls = readFileSync(p, 'utf8').split('\n').filter(Boolean);
  const i = ls.map(l => JSON.parse(l).kind).lastIndexOf('repin');
  const o = JSON.parse(ls[i]); f(o); ls[i] = JSON.stringify(o);
  writeFileSync(p, ls.join('\n') + '\n');
};
const hoan = (k) => { k.git('checkout', '-q', '--', '_acceptance'); assert.equal(k.git('status', '--porcelain'), ''); };

await ca('GT7', () => {
  const F = banSaoTiem({ dat: false, veHong: 'khoa-tat' });
  const T = banSaoTiem({ dat: true, veHong: null, runId: RUN_NEN7, pr: [12] });
  const CAU_F = `nhãn đỏ sẵn trên nền không đạt: ${DS.cauVeHong('khoa-tat')}`;
  let soO = 0;
  // Bên viết bị ép «không đạt» → làn của bản sao đỏ đúng câu, không pin (đo trước lượt ghim thật).
  const k = khoO7({ truocGhim: (kk) => {
    const n = repinCua(kk, 'H5').length;
    const r = kk.lane(['H5'], ['--write', '--reason', 'vong khac'], { laneFile: F.lane, agRoot: F.dir });
    assert.equal(r.status, 1, `mutant không-đạt: làn phải thoát 1 — ${r.stderr.slice(-400)}`);
    assert.ok(r.stderr.includes(`repin-lane: H5/E1: nhãn không gắn: ${DS.cauVeHong('khoa-tat')}`), r.stderr.slice(-600));
    assert.equal(repinCua(kk, 'H5').length, n, 'mutant không-đạt: làn không được ghim');
    hoan(kk);
  } });
  // Ô hợp lệ.
  const pm = MOI.pm(k.root);
  assert.equal(pm.status, 0, pm.stdout + pm.stderr);
  assert.ok(pm.stdout.split('\n').includes(NOTE7), `lưới phải in đúng «${NOTE7}»:\n${pm.stdout}`);
  assert.deepEqual(viH5(pm.stdout), [], 'ô hợp lệ: không VIOLATION nào cho H5');
  const rc = MOI.rc(k.root, 'H5');
  assert.equal(rc.status, 0, rc.stderr);
  // Kiểm lại KHÔNG in nhãn (tệp giữ nguyên bản — lưới «chỉ thêm» DV5 và ca phá dây REm3 canh nó); nhãn đạt = thoát 0,
  // dòng NOTE do lưới trước-gộp in (ô dưới). Ô giả của nó vẫn phải thoát 1.
  const gc = MOI.gc(k.root, 'H5');
  assert.equal(gc.status, 0, gc.stderr);
  assert.ok(gc.stdout.includes(NCG.NHAN.DO_SAN), 'thẻ phải hiện nhãn'); assert.ok(!gc.stdout.includes('ĐẠT'), 'thẻ không được có chữ ĐẠT');
  const mp = MOI.mp(k.root);
  assert.equal(mp.status, 0, mp.stderr);
  assert.equal(dongH5(mp.map).length, 1, mp.map);
  assert.ok(dongH5(mp.map)[0].includes(NCG.NHAN.DO_SAN), `bản đồ phải hiện nhãn cho H5: ${dongH5(mp.map)}`);
  assert.ok(!mp.map.includes('ĐẠT'), 'bản đồ không được có chữ ĐẠT');
  soO += 1;
  // Bên đọc bị ép «không đạt» ở ô hợp lệ → lưới và kiểm lại cùng đỏ, mỗi phía đúng câu của nó.
  const pmF = F.cc.pm(k.root);
  assert.notEqual(pmF.status, 0);
  assert.ok(viH5(pmF.stdout).some(l => l.includes(CAU_F)), `mutant không-đạt: lưới phải VIOLATION [H5] «${CAU_F}»:\n${pmF.stdout}`);
  assert.ok(!pmF.stdout.includes(NOTE7));
  const rcF = F.cc.rc(k.root, 'H5');
  assert.equal(rcF.status, 1); assert.ok(rcF.stderr.includes(CAU_F), rcF.stderr);
  // Ba ô giả: sửa dòng pin (hay khoá) trên cây, đo, hoàn.
  const gia = [
    ['run_id không có dòng nền', 'khong-co-dong-nen', () => suaPinCuoi(k, o => { o.do_san.E1.run_id = 'giu-tuoi-khong-co'; })],
    ['băm khác', 'khac-ca-hoac-thong-diep', () => suaPinCuoi(k, o => { o.do_san.E1.thong_diep_bam = 'c'.repeat(64); })],
    ['khoá tắt lúc đọc', 'khoa-tat', () => { const p = '_acceptance/config.yaml'; const t = k.doc(p); assert.ok(t.includes('do_san_tren_nen: true')); k.ghi(p, t.replace('do_san_tren_nen: true', 'do_san_tren_nen: false')); }],
  ];
  const ban = congCu(FX.banTruocVong().dir);
  for (const [ten, ve, tiem] of gia) {
    tiem();
    const cau = DS.cauVeHong(ve);
    const p = MOI.pm(k.root);
    assert.notEqual(p.status, 0, `${ten}: lưới phải đỏ`);
    assert.ok(viH5(p.stdout).some(l => l.includes(`nhãn đỏ sẵn trên nền không đạt: ${cau}`)), `${ten}: VIOLATION [H5] phải nêu «${cau}»:\n${p.stdout}`);
    assert.ok(!p.stdout.includes('NOTE [H5]: đỏ sẵn'), `${ten}: không NOTE nhãn`);
    const r = MOI.rc(k.root, 'H5');
    assert.equal(r.status, 1, `${ten}: kiểm lại phải thoát 1`); assert.ok(r.stderr.includes(cau), `${ten}: ${r.stderr}`);
    // Chiều im của thẻ và bản đồ: nhãn không đạt → không chữ nhãn; khoá tắt → BẰNG bản trước vòng.
    const g = MOI.gc(k.root, 'H5'); const m = MOI.mp(k.root);
    assert.ok(!g.stdout.includes(NCG.NHAN.DO_SAN) && !m.map.includes(NCG.NHAN.DO_SAN), `${ten}: thẻ/bản đồ không được hiện nhãn`);
    if (ve === 'khoa-tat') {
      const gB = ban.gc(k.root, 'H5'); const mB = ban.mp(k.root);
      assert.equal(g.stdout, gB.stdout, 'khoá tắt: thẻ phải BẰNG bản trước vòng'); assert.equal(m.map, mB.map, 'khoá tắt: bản đồ phải BẰNG bản trước vòng');
    }
    // Bên đọc bị ép «đạt» ở ô băm khác → lưới và kiểm lại cùng nhận nhãn.
    if (ve === 'khac-ca-hoac-thong-diep') {
      const pT = T.cc.pm(k.root);
      assert.ok(pT.stdout.split('\n').includes(NOTE7), `mutant đạt: lưới phải nhận nhãn ở ô băm khác:\n${pT.stdout}`);
      assert.deepEqual(viH5(pT.stdout), []);
      const rT = T.cc.rc(k.root, 'H5');
      assert.equal(rT.status, 0, rT.stderr);
    }
    hoan(k);
    soO += 1;
  }
  // Ô giả 4 (chủ kho thêm 18/10): nhánh vòng TỰ thêm dòng nền (chép dòng nền hợp lệ, đổi mã lượt) — có trong cây đang
  // xét, KHÔNG có ở điểm tách với nhánh chính — và trỏ do_san vào nó; commit trên nhánh như một PR thật.
  {
    const VE = 'nen-khong-tren-nhanh-chinh';
    const cau = DS.cauVeHong(VE);
    assert.ok(cau.startsWith('dòng nền đỏ không nằm trên lịch sử'), cau);
    const nenHopLe = k.docLog('H5').filter(l => l.kind === 'nen-do' && l.run_id === RUN_NEN7);
    assert.equal(nenHopLe.length, 1, 'phải có dòng nền hợp lệ để chép');
    const RUN_TU_GHI = 'giu-tuoi-tu-ghi-tren-nhanh';
    k.noiDong('H5', JSON.stringify(Object.assign({}, nenHopLe[0], { run_id: RUN_TU_GHI })));
    suaPinCuoi(k, o => { o.do_san.E1.run_id = RUN_TU_GHI; });
    k.git('add', '-A'); k.git('commit', '-qm', 'vong 1: tu ghi dong nen');
    const diemTach = k.git('merge-base', 'main', 'HEAD');
    assert.equal(spawnSync('git', ['-C', k.root, 'show', `${diemTach}:_acceptance/H5/run-log.jsonl`], { encoding: 'utf8' }).stdout.includes(RUN_TU_GHI), false, 'dòng tự ghi không được có ở điểm tách');
    const p = MOI.pm(k.root);
    assert.notEqual(p.status, 0, 'nền tự ghi: lưới phải đỏ');
    assert.ok(viH5(p.stdout).some(l => l.includes(`nhãn đỏ sẵn trên nền không đạt: ${cau}`)), `nền tự ghi: VIOLATION [H5] phải nêu «${cau}»:\n${p.stdout}`);
    assert.ok(!p.stdout.includes('NOTE [H5]: đỏ sẵn'), 'nền tự ghi: không NOTE nhãn');
    const r = MOI.rc(k.root, 'H5');
    assert.equal(r.status, 1, 'nền tự ghi: kiểm lại phải thoát 1'); assert.ok(r.stderr.includes(cau), r.stderr);
    // Chiều đỏ: bên đọc bản lượt chấm 1 (đọc dòng nền trong cây đang xét) nhận nhãn ở chính ô này.
    const pL1 = congCu(FX.banLuot1().dir).pm(k.root);
    assert.ok(pL1.stdout.split('\n').includes(`NOTE [H5]: đỏ sẵn trên nền — E1 (nền ${RUN_TU_GHI}, PR #12)`), `chiều đỏ: lưới bản lượt 1 phải nhận nhãn ở ô nền tự ghi:\n${pL1.stdout}`);
    k.git('reset', '-q', '--hard', 'HEAD~1');
    assert.equal(k.git('status', '--porcelain'), '');
    soO += 1;
  }
  // Bên viết bị ép «đạt» ở ô băm khác: nhánh vòng mà E1 đỏ với lời lỗi khác dòng nền. Đối chứng: làn thật đỏ
  // đúng vế; làn của bản sao nhận nhãn và ghim.
  k.git('checkout', '-q', '-b', 'vong-2', 'main');
  k.commit({ 'vat/H5-E1-phu.txt': 'cham vong 2\n', 'vat/H5-E1.txt': FX.noiDungDo({ ca: 'ca-do', loi: 'TypeError: x is not a function' }) }, 'vong 2');
  const n2 = repinCua(k, 'H5').length;
  const lt = k.lane(['H5'], ['--write', '--reason', 'vong khac']);
  assert.equal(lt.status, 1, lt.stderr.slice(-400));
  assert.ok(lt.stderr.includes(`repin-lane: H5/E1: nhãn không gắn: ${DS.cauVeHong('khac-ca-hoac-thong-diep')}`), lt.stderr.slice(-600));
  hoan(k);
  const lT = k.lane(['H5'], ['--write', '--reason', 'vong khac'], { laneFile: T.lane, agRoot: T.dir });
  assert.equal(lT.status, 0, `mutant đạt: làn của bản sao phải ghim — ${lT.stderr.slice(-400)}`);
  assert.equal(repinCua(k, 'H5').length, n2 + 1);
  assert.equal(repinCua(k, 'H5').pop().do_san.E1.run_id, RUN_NEN7);
  // Sau khi nhánh vòng gộp vào nhánh chính (HEAD = nhánh chính): điểm tách = HEAD, lưới vẫn nhận nhãn hợp lệ.
  k.git('checkout', '-qf', 'main');
  k.git('-c', 'user.email=t@t', '-c', 'user.name=t', 'merge', '-q', '--no-ff', '-m', 'Merge pull request #20 from x/vong-1', 'vong-1');
  const pmGop = MOI.pm(k.root);
  assert.ok(pmGop.stdout.split('\n').includes(NOTE7), `sau gộp: lưới phải in «${NOTE7}»:\n${pmGop.stdout}`);
  assert.deepEqual(viH5(pmGop.stdout), [], 'sau gộp: không VIOLATION nào cho H5');
  assert.equal(MOI.rc(k.root, 'H5').status, 0, 'sau gộp: kiểm lại xanh');
  assert.equal(soO, 5, `ca tự kiểm số ô: ${soO}`);
  return `${soO}/5 ô · nền tự ghi trên nhánh: lưới VIOLATION, kiểm lại 1 (bản lượt 1: NOTE) · sau gộp vào nhánh chính: NOTE · mutant không-đạt: làn 1 · lưới VIOLATION [H5] · kiểm lại 1 · mutant đạt (ô băm khác): làn ghim · lưới NOTE · kiểm lại 0 · khoá tắt: thẻ/bản đồ = bản trước vòng`;
});

await ca('GT9', () => {
  const k = khoO7();
  const ban = congCu(FX.banTruocVong().dir);
  const STACK = /^\s*at .*\.(?:c|m)?js:/m;
  const chay = (cc) => {
    const pm = cc.pm(k.root); const rc = cc.rc(k.root, 'H5'); const gc = cc.gc(k.root, 'H5'); const mp = cc.mp(k.root);
    return { pm, rc, gc, mp };
  };
  const tom = (o) => JSON.stringify(Object.fromEntries(Object.entries(o).map(([t, r]) => [t, { status: r.status, stdout: r.stdout, stderr: r.stderr, map: r.map }])));
  const co = chay(ban);
  for (const [t, r] of Object.entries(co)) {
    assert.ok([0, 1].includes(r.status), `${t}: mã thoát ${r.status} ngoài {0,1}: ${r.stderr.slice(-300)}`);
    assert.ok(!STACK.test(r.stderr), `${t}: stack trace ở stderr: ${r.stderr.slice(-400)}`);
  }
  assert.notEqual(co.pm.status, 0, 'bản trước vòng: lưới phải đỏ');
  assert.ok(viH5(co.pm.stdout).some(l => l.includes('E1=1')), `bản trước vòng: VIOLATION [H5] mã eval ≠ 0:\n${co.pm.stdout}`);
  assert.equal(co.rc.status, 1, 'bản trước vòng: kiểm lại phải thoát 1');
  assert.ok(co.rc.stderr.includes('E1=1'), co.rc.stderr);
  const moiCo = MOI.pm(k.root).stdout;
  // Xoá riêng dòng nen-do của H5 trên cây. Từ 18/10 bản mới đọc dòng nền ở ĐIỂM TÁCH với nhánh chính, không trong
  // cây — nên trạng thái «không» cũng lùi `main` về commit ngay trước commit ghi dòng nền (điểm tách khi ấy không có
  // dòng nền). Bản trước vòng không đọc `main` lẫn dòng nền; phép so BẰNG của nó chạy trên CÙNG trạng thái này.
  const p = path.join(k.root, '_acceptance', 'H5', 'run-log.jsonl');
  const goc = readFileSync(p, 'utf8');
  const bo = goc.split('\n').filter(l => !l.includes('"kind":"nen-do"')).join('\n');
  assert.notEqual(bo, goc, 'phải có dòng nen-do để xoá');
  writeFileSync(p, bo);
  const mainCo = k.git('rev-parse', 'main');
  assert.ok(k.git('show', `${mainCo}:_acceptance/H5/run-log.jsonl`).includes('"kind":"nen-do"'), 'main phải mang dòng nền trước khi lùi');
  k.git('branch', '-f', 'main', `${mainCo}~1`);
  assert.ok(!k.git('show', 'main:_acceptance/H5/run-log.jsonl').includes('"kind":"nen-do"'), 'main lùi không được còn dòng nền');
  const khong = chay(ban);
  const moiKhong = MOI.pm(k.root).stdout;
  k.git('branch', '-f', 'main', mainCo);
  hoan(k);
  assert.equal(tom(khong), tom(co), 'bản trước vòng: đầu ra bốn công cụ khi có dòng nen-do phải BẰNG khi xoá nó');
  // Độ nhạy của phép so: bản mới đọc dòng nền nên đầu ra của nó PHẢI khác giữa hai trạng thái.
  assert.notEqual(moiKhong, moiCo, 'đối chứng: lưới bản mới phải đổi khi xoá dòng nen-do');
  return 'bản trước vòng: 4 công cụ mã ∈ {0,1}, không stack trace · lưới VIOLATION [H5] E1=1 · kiểm lại 1 · có/không nen-do bằng nhau (bản mới khác)';
});

// ── Task 4: lệnh giữ tươi (GT1, GT4, GT5, GT10, GT-rf1…rf4) ──────────────────────────────────────────────────
// Mọi ca chạy LỆNH THẬT (giuTuoi ở trên) trên kho thử do giu-tuoi-fixture.mjs sinh.
const PM = path.join(ROOT, 'scripts', 'pre-merge-check.sh');
const cuTay = (dir) => {
  const r = spawnSync('bash', [PM, dir], { encoding: 'utf8', cwd: dir, maxBuffer: 64 * 1024 * 1024 });
  assert.ok([0, 1].includes(r.status), `lưới chạy tay phải ra 0/1: ${r.status} ${r.stderr.slice(-300)}`);
  return new Set(r.stdout.split('\n').map(l => (l.match(/^VIOLATION \[([^\]]+)\]: evidence is stale/) || [])[1]).filter(Boolean));
};
// Băm mọi tệp dưới _acceptance/ (đường + nội dung) — «kho và sổ không đổi byte nào».
function bamSo(root) {
  const h = createHash('sha256');
  const di = (d) => { for (const t of readdirSync(d).sort()) { const p = path.join(d, t); if (statSync(p).isDirectory()) di(p); else h.update(`${path.relative(root, p)}\0`).update(readFileSync(p)).update('\0'); } };
  di(path.join(root, '_acceptance'));
  return h.digest('hex');
}
const jsonCua = (r) => { assert.equal(r.status, 0, r.stderr.slice(-800)); return JSON.parse(r.stdout); };
const ketCucCua = (j) => Object.fromEntries(j.ho_so.map(h => [h.slug, h.ket_cuc]));
const dongBang = (r, slug) => r.stdout.split('\n').filter(l => l.startsWith(`${slug} · `));
const soWorktree = (k) => k.git('worktree', 'list').split('\n').filter(Boolean).length;
// Thân eval «đỏ vì hạ tầng» và «chập chờn» — thay rang/<slug>-E1.sh trong một gộp.
const RANG_127 = 'lenh_khong_ton_tai_gt5\n';
const RANG_137 = "sh -c 'kill -9 $$'\nexit $?\n";
const rangChapChon = (slug) => `if [ ! -f "$GG_DAU/chap-${slug}" ]; then : > "$GG_DAU/chap-${slug}"; echo "(fail) ca-chap [1.00ms]"; exit 1; fi\necho "(pass) ca-chap [0.10ms]"\nexit 0\n`;

await ca('GT1', () => {
  const k = FX.mkKhoGiuTuoi({ hoSo: ['H1', 'H2', 'H3', 'H4'] });
  k.commit({ 'vat/H3-E1-phu.txt': 'cu truoc khoang\n', 'vat/H4-E1-phu.txt': 'cu truoc khoang\n' }, 'cham H3 H4 truoc khoang');
  const tu = k.git('rev-parse', 'HEAD');
  k.themHoSo(['H6'], { thongDiep: 'gop H6 trong khoang' });
  k.gop(12, { 'vat/H2-E1-phu.txt': 'cham H2\n', 'vat/H4-E1-phu.txt': 'cham H4\n' });
  k.gop(13, { 'vat/H6-E1-phu.txt': 'cham H6\n' });
  const dinh = k.git('rev-parse', 'HEAD');
  // Ca tự kiểm ma trận: đúng 5 hồ sơ, cả 5 đã ký ở đỉnh; H6 chưa có ở <từ>.
  const hs = readdirSync(path.join(k.root, '_acceptance')).filter(d => statSync(path.join(k.root, '_acceptance', d)).isDirectory()).sort();
  assert.deepEqual(hs, ['H1', 'H2', 'H3', 'H4', 'H6']);
  for (const s of hs) assert.match(k.docReport(s), /^human_signoff: \S/m, `${s} phải đã ký ở đỉnh`);
  assert.equal(spawnSync('git', ['-C', k.root, 'cat-file', '-e', `${tu}:_acceptance/H6/contract.md`]).status, 128, 'H6 không có ở <từ>');
  // Chiều đỏ: bản trước vòng không có lệnh → ca ghim câu của nó, không đọc mã thoát của node thành kết quả.
  assert.throws(() => giuTuoi(k, ['--tu', tu, '--json'], { kit: FX.banTruocVong().dir }), /khong co lenh giu tuoi/);
  const truoc = bamSo(k.root); const head0 = k.git('rev-parse', 'HEAD'); const wt0 = soWorktree(k);
  const j = jsonCua(giuTuoi(k, ['--tu', tu, '--json']));
  const bang = giuTuoi(k, ['--tu', tu]);
  assert.equal(bang.status, 0, bang.stderr.slice(-600));
  const chon = j.ho_so.map(h => h.slug);
  assert.deepEqual(chon, ['H2', 'H6'], `cũ vì khoảng: ${chon}`);
  assert.deepEqual(j.ton_dong, ['H3', 'H4']);
  assert.equal(j.tu, tu); assert.equal(j.den, dinh);
  assert.ok(!chon.includes('H1') && !j.ton_dong.includes('H1') && !bang.stdout.includes('H1'), 'H1 không xuất hiện');
  assert.ok(bang.stdout.includes('tồn đọng (cũ từ trước khoảng, không ghim): H3, H4'), bang.stdout);
  // Một nguồn với bên đọc: BẰNG hiệu hai lượt lưới chạy tay (đỉnh · cây tách ở <từ>), không --base.
  const wt = path.join(thuMuc('gt1-tay-'), 'tu');
  k.git('worktree', 'add', '--detach', '--quiet', wt, tu);
  const cuDinh = cuTay(k.root); const cuTu = cuTay(wt);
  k.git('worktree', 'remove', '--force', wt);
  assert.deepEqual([...cuDinh].filter(s => !cuTu.has(s)).sort(), chon, 'tập chọn phải BẰNG cũ-ở-đỉnh − cũ-ở-từ');
  assert.deepEqual([...cuDinh].filter(s => cuTu.has(s)).sort(), j.ton_dong, 'tồn đọng phải BẰNG cũ ở cả hai');
  // Không --write: sổ không đổi byte, HEAD giữ, cây tạm đã dọn, cây sạch.
  assert.equal(bamSo(k.root), truoc, 'không --write: mọi tệp dưới _acceptance/ phải giữ nguyên byte');
  assert.equal(k.git('rev-parse', 'HEAD'), head0); assert.equal(soWorktree(k), wt0, 'cây tạm phải được dọn');
  assert.equal(k.git('status', '--porcelain'), '');
  return 'cũ vì khoảng [H2,H6] · tồn đọng [H3,H4] = hiệu hai lượt lưới chạy tay · sổ giữ byte · bản trước vòng: khong co lenh giu tuoi';
});

await ca('GT4', () => {
  // Ba ô trên một kho: A đỏ vì đúng #12 · B hai gộp #13, #14 cùng chạm · C đỏ sẵn ở <từ> (paths hẹp, đỏ đến từ tệp
  // ngoài paths trước khoảng; #15 chỉ chạm thân lệnh bằng một dòng chú thích).
  const k = FX.mkKhoGiuTuoi({ hoSo: ['A', 'B', { slug: 'C', evals: [{ id: 'E1', ca: 'ca-c', paths: ['rang/C-E1.sh'] }] }] });
  k.commit({ 'vat/C-E1.txt': FX.noiDungDo({ ca: 'ca-c' }) }, 'C do ngoai paths truoc khoang');
  const tu = k.git('rev-parse', 'HEAD');
  const g12 = k.gop(12, { 'vat/A-E1.txt': FX.noiDungDo({ ca: 'ca-a-e1' }) });
  const g13 = k.gop(13, { 'vat/B-E1-phu.txt': 'cham B\n' });
  const g14 = k.gop(14, { 'vat/B-E1.txt': FX.noiDungDo({ ca: 'ca-b-e1' }) });
  k.gop(15, { 'rang/C-E1.sh': `# cham C\n${k.doc('rang/C-E1.sh')}` });
  let soO = 0;
  const bang = giuTuoi(k, ['--tu', tu]);
  assert.equal(bang.status, 0, bang.stderr.slice(-600));
  const j = jsonCua(giuTuoi(k, ['--tu', tu, '--json', '--write']));
  assert.deepEqual(ketCucCua(j), { A: 'do-khoang', B: 'nhieu-pr', C: 'do-san-truoc-khoang' });
  const nen = (s) => { const n = nenCua(k, s); assert.equal(n.length, 1, `${s}: đúng một dòng nền`); return n[0]; };
  // Ô chính.
  assert.equal(nen('A').ket_cuc, 'do-khoang');
  assert.deepEqual(nen('A').quy_ve, [{ pr: 12, sha_truoc: g12.sha_truoc, sha_sau: g12.sha_sau }]);
  assert.deepEqual(dongBang(bang, 'A').length, 1); assert.ok(dongBang(bang, 'A')[0].includes('đỏ do PR #12'), dongBang(bang, 'A'));
  soO += 1;
  // Hai gộp cùng chạm.
  assert.deepEqual(nen('B').quy_ve, [{ pr: 13, sha_truoc: g13.sha_truoc, sha_sau: g13.sha_sau }, { pr: 14, sha_truoc: g14.sha_truoc, sha_sau: g14.sha_sau }]);
  assert.ok(dongBang(bang, 'B')[0].includes('nhiều PR cùng chạm (#13, #14)'), dongBang(bang, 'B'));
  soO += 1;
  // Đỏ cùng băm ở <từ>.
  assert.equal(nen('C').ket_cuc, 'do-san-truoc-khoang'); assert.deepEqual(nen('C').quy_ve, []);
  assert.ok(dongBang(bang, 'C')[0].includes('đỏ sẵn trước khoảng') && !dongBang(bang, 'C')[0].includes('#15'), dongBang(bang, 'C'));
  soO += 1;
  // Eval không khai paths: kho riêng (không paths là cũ theo MỌI tệp mã — commit trước khoảng sẽ làm nó tồn đọng).
  const d = FX.mkKhoGiuTuoi({ hoSo: [{ slug: 'D', evals: [{ id: 'E1', ca: 'ca-d', paths: null }] }] });
  const tuD = d.git('rev-parse', 'HEAD');
  const d12 = d.gop(12, { 'vat/D-E1.txt': FX.noiDungDo({ ca: 'ca-d' }) });
  const d13 = d.gop(13, { 'src/khac.txt': 'ma khac\n' });
  const jd = jsonCua(giuTuoi(d, ['--tu', tuD, '--json', '--write']));
  assert.deepEqual(ketCucCua(jd), { D: 'nhieu-pr' });
  const nd = nenCua(d, 'D');
  assert.equal(nd.length, 1);
  assert.deepEqual(nd[0].quy_ve.map(q => [q.pr, q.sha_truoc, q.sha_sau]), [[12, d12.sha_truoc, d12.sha_sau], [13, d13.sha_truoc, d13.sha_sau]]);
  assert.ok(nd[0].quy_ve.every(q => q.ly_do === 'eval không khai paths'), JSON.stringify(nd[0].quy_ve));
  assert.ok(nd[0].ghi_chu.includes('eval không khai paths') && jd.ho_so[0].ghi_chu.includes('eval không khai paths'));
  soO += 1;
  // Ô 5 (chủ kho thêm 18/10): kho có thư viện cài sẵn mà git bỏ qua. N đọc `node_modules/mo-dun` (tên trong danh sách
  // phụ thuộc) và đỏ sẵn từ trước khoảng cùng thông điệp; M đọc `thu-vien-la/mo-dun` (thư mục git bỏ qua, tên lạ —
  // symlink không phủ: «Cannot find module» ở <từ>); L gọi một lệnh trong `cong-cu-la/` (mã 127 ở <từ>). Một gộp #12
  // chỉ chạm thân lệnh của cả ba bằng một dòng chú thích.
  const thanCan = (slug, ca, can) => `[ -n "$GG_DAU" ] && echo ran >> "$GG_DAU/${slug}-E1.txt"\n${can}\nf=vat/${slug}-E1.txt\nif [ "$(head -n 1 "$f")" = ok ]; then echo "(pass) ${ca} [0.10ms]"; exit 0; fi\ncat "$f"\nexit 1\n`;
  const CAN = {
    N: `node -e "require('mo-dun')" || exit $?`,
    M: `node -e "require('./thu-vien-la/mo-dun')" || exit $?`,
    L: './cong-cu-la/chay || exit $?',
  };
  const p5 = FX.mkKhoGiuTuoi({
    hoSo: ['N', 'M', 'L'].map(sl => ({ slug: sl, evals: [{ id: 'E1', ca: `ca-${sl.toLowerCase()}`, paths: [`rang/${sl}-E1.sh`], than: thanCan(sl, `ca-${sl.toLowerCase()}`, CAN[sl]) }] })),
    truocHoSo: (kk) => {
      kk.ghi('.gitignore', 'node_modules/\nthu-vien-la/\ncong-cu-la/\n');
      kk.ghi('node_modules/mo-dun/index.js', 'module.exports = 1;\n');
      kk.ghi('thu-vien-la/mo-dun/index.js', 'module.exports = 1;\n');
      kk.ghi('cong-cu-la/chay', '#!/bin/sh\nexit 0\n');
      execFileSync('chmod', ['+x', path.join(kk.root, 'cong-cu-la', 'chay')]);
      kk.git('add', '-A'); kk.git('commit', '-qm', 'gitignore');
    },
  });
  // Ca tự kiểm dựng: ba thư mục phụ thuộc có ở gốc, git bỏ qua; pin đầu xanh (phụ thuộc chạy được ở cây chính).
  for (const t of ['node_modules', 'thu-vien-la', 'cong-cu-la']) assert.equal(spawnSync('git', ['-C', p5.root, 'check-ignore', '-q', t]).status, 0, `${t} phải bị git bỏ qua`);
  p5.commit(Object.fromEntries(['N', 'M', 'L'].map(sl => [`vat/${sl}-E1.txt`, FX.noiDungDo({ ca: `ca-${sl.toLowerCase()}` })])), 'do ngoai paths truoc khoang');
  const tu5 = p5.git('rev-parse', 'HEAD');
  p5.gop(12, Object.fromEntries(['N', 'M', 'L'].map(sl => [`rang/${sl}-E1.sh`, `# cham ${sl}\n${p5.doc(`rang/${sl}-E1.sh`)}`])));
  const wt5 = soWorktree(p5);
  // Chiều đỏ: bản lượt chấm 1 (cây tạm không có phụ thuộc) gọi tên #12 cho N.
  const jL1 = jsonCua(giuTuoi(p5, ['--tu', tu5, '--json'], { kit: FX.banLuot1().dir }));
  const nL1 = jL1.ho_so.find(h => h.slug === 'N');
  assert.equal(nL1.ket_cuc, 'do-khoang', `chiều đỏ: bản lượt 1 phải quy N về PR: ${JSON.stringify(jL1.ho_so)}`);
  assert.deepEqual(nL1.quy_ve.map(q => q.pr), [12]);
  const b5 = giuTuoi(p5, ['--tu', tu5]);
  assert.equal(b5.status, 0, b5.stderr.slice(-600));
  const j5 = jsonCua(giuTuoi(p5, ['--tu', tu5, '--json', '--write']));
  assert.deepEqual(ketCucCua(j5), { L: 'ha-tang', M: 'ha-tang', N: 'do-san-truoc-khoang' }, JSON.stringify(j5.ho_so));
  const n5 = nenCua(p5, 'N');
  assert.equal(n5.length, 1); assert.equal(n5[0].ket_cuc, 'do-san-truoc-khoang'); assert.deepEqual(n5[0].quy_ve, []);
  assert.ok(dongBang(b5, 'N')[0].includes('đỏ sẵn trước khoảng') && !dongBang(b5, 'N')[0].includes('#12'), dongBang(b5, 'N'));
  for (const sl of ['M', 'L']) {
    const n = nenCua(p5, sl);
    assert.equal(n.length, 1, `${sl}: đúng một dòng nền`);
    assert.equal(n[0].ket_cuc, 'ha-tang'); assert.deepEqual(n[0].quy_ve, []);
    assert.equal(n[0].ghi_chu, 'không chạy lại được ở đầu khoảng', `${sl}: ${JSON.stringify(n[0])}`);
    assert.equal(j5.ho_so.find(h => h.slug === sl).ghi_chu, 'không chạy lại được ở đầu khoảng');
    const dong = dongBang(b5, sl);
    assert.equal(dong.length, 1);
    assert.ok(dong[0].includes('không quy được — hạ tầng') && dong[0].includes('không chạy lại được ở đầu khoảng'), dong[0]);
    assert.ok(!dong[0].includes('#12') && !JSON.stringify(n[0]).includes('#12'), `${sl}: không được gọi tên #12`);
  }
  assert.ok(!b5.stdout.includes('#12'), `bảng không được chứa #12:\n${b5.stdout}`);
  // Dọn không đụng thư mục thật: phụ thuộc của kho còn nguyên, cây tạm đã gỡ.
  assert.ok(existsSync(path.join(p5.root, 'node_modules', 'mo-dun', 'index.js')), 'node_modules của kho phải còn nguyên sau lệnh');
  assert.equal(soWorktree(p5), wt5, 'cây tạm phải được dọn');
  soO += 1;
  assert.equal(soO, 5, `ca tự kiểm số ô: ${soO}`);
  return `${soO}/5 ô · ô 5: N đỏ sẵn trước khoảng (bản lượt 1: do-khoang #12) · M, L hạ tầng «không chạy lại được ở đầu khoảng»`;
});

await ca('GT5', () => {
  // Một gộp #12 chạm paths của cả ba hồ sơ; P đỏ mã 127, Q mã 137, R đỏ lần đầu rồi xanh khi chạy lại.
  const k = FX.mkKhoGiuTuoi({ hoSo: ['P', 'Q', 'R'] });
  const tu = k.git('rev-parse', 'HEAD');
  k.gop(12, { 'rang/P-E1.sh': RANG_127, 'rang/Q-E1.sh': RANG_137, 'rang/R-E1.sh': rangChapChon('R') });
  const dinh = k.git('rev-parse', 'HEAD');
  k.xoaDau();
  const j = jsonCua(giuTuoi(k, ['--tu', tu, '--json', '--write']));
  k.xoaDau();
  k.git('checkout', '-q', '--', '_acceptance');
  const bang = giuTuoi(k, ['--tu', tu, '--write']);
  assert.equal(bang.status, 0, bang.stderr.slice(-600));
  // Không gọi tên PR vô tội: kiểm TRƯỚC kết cục, để mọi chỗ hỏng của nhánh hạ tầng đỏ đúng câu này.
  assert.ok(!bang.stdout.includes('#12'), `bảng không được chứa #12:\n${bang.stdout}`);
  let soO = 0;
  const maDo = { P: 127, Q: 137, R: 1 };
  for (const s of ['P', 'Q', 'R']) {
    assert.equal(ketCucCua(j)[s], 'ha-tang', `${s}: ${JSON.stringify(j.ho_so)}`);
    const n = nenCua(k, s);
    assert.equal(n.length, 1, `${s}: đúng một dòng nền`);
    assert.equal(n[0].ket_cuc, 'ha-tang'); assert.deepEqual(n[0].quy_ve, []);
    assert.equal(n[0].tu, tu); assert.equal(n[0].sha, dinh);
    assert.equal(n[0].lenh_do[0].exit, maDo[s], `${s}: mã đỏ của lượt ghim`);
    const dong = dongBang(bang, s);
    assert.equal(dong.length, 1);
    assert.ok(dong[0].includes(`không quy được — hạ tầng (${tu.slice(0, 7)}..${dinh.slice(0, 7)})`), dong[0]);
    assert.ok(!JSON.stringify(n[0]).includes('#12') && !dong[0].includes('#12') && !JSON.stringify(n[0].quy_ve).includes('12'), `${s}: không được gọi tên #12`);
    soO += 1;
  }
  // Đối chứng dương: cùng gộp #12, E1 đỏ THẬT vì nó → bảng gọi tên #12.
  const c = FX.mkKhoGiuTuoi({ hoSo: ['S'] });
  const tuC = c.git('rev-parse', 'HEAD');
  c.gop(12, { 'vat/S-E1.txt': FX.noiDungDo({ ca: 'ca-s' }) });
  const bc = giuTuoi(c, ['--tu', tuC]);
  assert.equal(bc.status, 0, bc.stderr.slice(-400));
  assert.ok(dongBang(bc, 'S')[0].includes('đỏ do PR #12'), bc.stdout);
  // Ô 4 (chủ kho thêm 18/10): dòng nền `ket_cuc: ha-tang` không bao giờ làm nền. Nhánh chính mang dòng nền hạ tầng
  // của H5 (khuôn chép từ dòng repin-do của CHÍNH làn), nhánh vòng chạm paths H5, E1 đỏ cùng ca cùng thông điệp.
  const CAU_HT = DS.cauVeHong('nen-la-ha-tang');
  assert.equal(CAU_HT, 'dòng nền là đỏ hạ tầng — không làm nền');
  const h = FX.mkKhoGiuTuoi({ hoSo: [{ slug: 'H5', evals: [{ id: 'E1', ca: 'ca-do' }] }], khoa: true });
  const g = h.gop(12, { 'vat/H5-E1.txt': FX.noiDungDo({ ca: 'ca-do' }) });
  const rg = h.lane(['H5'], ['--tung-ho-so', '--write']);
  assert.equal(rg.status, 0, rg.stderr.slice(-400));
  h.noiDong('H5', h.dongNenTuDauDo('H5', { runId: 'giu-tuoi-ha-tang', tu: g.sha_truoc, ketCuc: 'ha-tang' }));
  h.git('add', '-A'); h.git('commit', '-qm', 'giu tuoi: dong nen ha tang');
  h.git('checkout', '-q', '-b', 'vong-ht');
  h.commit({ 'vat/H5-E1-phu.txt': 'cham vong\n' }, 'vong');
  const nPin = repinCua(h, 'H5').length;
  const lt = h.lane(['H5'], ['--write', '--reason', 'vong khac']);
  assert.equal(lt.status, 1, `làn phải thoát 1: ${lt.stderr.slice(-400)}`);
  assert.ok(lt.stderr.includes(`repin-lane: H5/E1: nhãn không gắn: ${CAU_HT}`), lt.stderr.slice(-600));
  assert.equal(repinCua(h, 'H5').length, nPin, 'không ghim');
  h.git('checkout', '-q', '--', '_acceptance');
  // Chiều đỏ: làn của bản lượt chấm 1 gắn nhãn ở chính ô này — và CHÍNH dòng ghim nó ghi là dòng `repin` mang
  // `do_san` trỏ vào dòng nền hạ tầng (bên viết thật, không viết tay) cho bên đọc.
  const L1 = FX.banLuot1();
  const l1 = h.lane(['H5'], ['--write', '--reason', 'vong khac'], { laneFile: L1.lane, agRoot: L1.agRoot });
  assert.equal(l1.status, 0, `chiều đỏ: bản lượt 1 phải gắn nhãn và ghim: ${l1.stderr.slice(-400)}`);
  assert.equal(repinCua(h, 'H5').pop().do_san.E1.run_id, 'giu-tuoi-ha-tang');
  h.git('add', '-A'); h.git('commit', '-qm', 'vong: repin luot 1');
  const pm = spawnSync('bash', [PM, h.root], { encoding: 'utf8', cwd: h.root, maxBuffer: 64 * 1024 * 1024 });
  assert.notEqual(pm.status, 0, 'lưới phải đỏ');
  assert.ok(pm.stdout.split('\n').some(l => l.startsWith('VIOLATION [H5]') && l.includes(`nhãn đỏ sẵn trên nền không đạt: ${CAU_HT}`)), `lưới phải VIOLATION [H5] nêu «${CAU_HT}»:\n${pm.stdout}`);
  const rc = h.recheck('H5');
  assert.equal(rc.status, 1, rc.stderr); assert.ok(rc.stderr.includes(CAU_HT), rc.stderr);
  // Chiều đỏ của bên đọc: lưới bản lượt 1 nhận nhãn ở cùng dòng ghim.
  const pmL1 = spawnSync('bash', [path.join(L1.dir, 'scripts', 'pre-merge-check.sh'), h.root], { encoding: 'utf8', cwd: h.root, maxBuffer: 64 * 1024 * 1024 });
  assert.ok(pmL1.stdout.includes('NOTE [H5]: đỏ sẵn trên nền — E1 (nền giu-tuoi-ha-tang'), `chiều đỏ: lưới bản lượt 1 phải nhận nhãn:\n${pmL1.stdout}`);
  soO += 1;
  assert.equal(soO, 4);
  return `${soO}/4 ô · đối chứng dương: đỏ thật vì #12 → bảng gọi tên #12 · ô 4: nền hạ tầng → làn 1, lưới VIOLATION, kiểm lại 1 (bản lượt 1: làn ghim, lưới NOTE)`;
});

await ca('GT10', () => {
  const k = FX.mkKhoGiuTuoi({ hoSo: ['A', 'B', 'C', { slug: 'D', evals: [{ id: 'E1', ca: 'ca-d', paths: ['rang/D-E1.sh'] }] }, 'E', 'T'] });
  k.commit({ 'vat/D-E1.txt': FX.noiDungDo({ ca: 'ca-d' }), 'vat/T-E1-phu.txt': 'cu truoc khoang\n' }, 'truoc khoang');
  const tu = k.git('rev-parse', 'HEAD');
  k.gop(12, { 'vat/B-E1.txt': FX.noiDungDo({ ca: 'ca-b' }), 'vat/A-E1-phu.txt': 'cham A\n' });
  k.gop(13, { 'vat/C-E1-phu.txt': 'cham C\n' });
  k.gop(14, { 'vat/C-E1.txt': FX.noiDungDo({ ca: 'ca-c' }) });
  k.gop(15, { 'rang/E-E1.sh': RANG_127 });
  k.gop(16, { 'rang/D-E1.sh': `# cham D\n${k.doc('rang/D-E1.sh')}` });
  const head0 = k.git('rev-parse', 'HEAD'); const nhanh0 = k.git('symbolic-ref', '--short', 'HEAD'); const soCommit0 = k.git('rev-list', '--count', 'HEAD');
  const j = jsonCua(giuTuoi(k, ['--tu', tu, '--json']));
  const MONG = { A: 'tuoi-lai', B: 'do-khoang', C: 'nhieu-pr', D: 'do-san-truoc-khoang', E: 'ha-tang' };
  assert.deepEqual(ketCucCua(j), MONG); assert.deepEqual(j.ton_dong, ['T']);
  assert.ok(j.ho_so.every(h => typeof h.phut === 'number') && typeof j.gio_may === 'number');
  const bang = giuTuoi(k, ['--tu', tu, '--write']);
  assert.equal(bang.status, 0, bang.stderr.slice(-600));
  const CHU = { A: 'tươi lại', B: 'đỏ do PR #12', C: 'nhiều PR cùng chạm', D: 'đỏ sẵn trước khoảng', E: 'không quy được — hạ tầng' };
  const tuBang = {};
  for (const [s, chu] of Object.entries(CHU)) {
    const dong = dongBang(bang, s);
    assert.equal(dong.length, 1, `${s}: đúng một dòng: ${bang.stdout}`);
    assert.match(dong[0], new RegExp(`^${s} · ${chu}.* · \\d+,\\d\\d phút$`), dong[0]);
    // Kết cục đọc NGƯỢC từ chữ của bảng (chữ → mã), rồi so với --json.
    tuBang[s] = Object.keys(CHU).map(x => [CHU[x], MONG[x]]).find(([c]) => dong[0].startsWith(`${s} · ${c}`))[1];
  }
  assert.deepEqual(tuBang, ketCucCua(j), '--json cùng tập kết cục với bảng');
  assert.equal(dongBang(bang, 'T').length, 0, 'tồn đọng không có dòng kết cục');
  const cuoi = bang.stdout.trim().split('\n').pop();
  assert.match(cuoi, /^tồn đọng \d+ hồ sơ không ghim · tổng giờ máy /); assert.ok(cuoi.startsWith('tồn đọng 1 hồ sơ'), cuoi);
  assert.equal(k.git('rev-parse', 'HEAD'), head0, 'lệnh không tạo commit'); assert.equal(k.git('symbolic-ref', '--short', 'HEAD'), nhanh0, 'lệnh không đổi nhánh');
  assert.equal(k.git('rev-list', '--count', 'HEAD'), soCommit0);
  // Cây bẩn ngoài _acceptance/ → thoát 2, câu ghim.
  k.ghi('docs/README.md', 'sua chua commit\n');
  const ban = giuTuoi(k, ['--tu', tu]);
  assert.equal(ban.status, 2, ban.stderr); assert.ok(ban.stderr.includes('cây bẩn ngoài _acceptance/'), ban.stderr);
  return '5 kết cục ghim chữ · --json cùng tập · dòng cuối ghim · HEAD/nhánh giữ · cây bẩn → 2';
});

await ca('GT-rf1', () => {
  // Gộp kiểu nén: tiêu đề `feat: … (#12)` thay vì «Merge pull request #12».
  const k = FX.mkKhoGiuTuoi({ hoSo: ['H5'] });
  const tu = k.git('rev-parse', 'HEAD');
  const g = k.gop(12, { 'vat/H5-E1.txt': FX.noiDungDo({ ca: 'ca-h5' }) }, { kieu: 'nen', tieuDe: 'feat: sua vat H5 (#12)' });
  assert.equal(k.git('log', '-1', '--format=%s'), 'feat: sua vat H5 (#12)');
  const j = jsonCua(giuTuoi(k, ['--tu', tu, '--json']));
  assert.deepEqual(j.ho_so[0].quy_ve, [{ pr: 12, sha_truoc: g.sha_truoc, sha_sau: g.sha_sau }]);
  const b = giuTuoi(k, ['--tu', tu]);
  assert.ok(dongBang(b, 'H5')[0].includes('đỏ do PR #12'), b.stdout);
  return 'tiêu đề nén (#12) → PR 12';
});

await ca('GT-rf2', () => {
  // Hồ sơ có evals.yaml mà KHÔNG eval máy nào (chỉ judgment) bị cũ vì khoảng → ghim như hôm nay, không dòng nền rỗng.
  const k = FX.mkKhoGiuTuoi({ hoSo: ['H1'] });
  k.themHoSo(['H7'], { ghimDau: false, thongDiep: 'H7 judgment' });
  const p = '_acceptance/H7/evals.yaml';
  const goc = k.doc(p); const sua = goc.replace('    executor: script\n    cmd: config:executors.script.h7_e1\n', '    executor: judgment\n');
  assert.notEqual(sua, goc, 'phải đổi được E1 thành judgment');
  k.ghi(p, sua); k.git('add', '-A'); k.git('commit', '-qm', 'H7 chi judgment');
  const tu = k.git('rev-parse', 'HEAD');
  k.gop(12, { 'vat/H7-E1-phu.txt': 'cham H7\n' });
  const n0 = repinCua(k, 'H7').length;
  const j = jsonCua(giuTuoi(k, ['--tu', tu, '--json', '--write']));
  assert.deepEqual(ketCucCua(j), { H7: 'tuoi-lai' });
  assert.equal(repinCua(k, 'H7').length, n0 + 1, 'ghim như hôm nay');
  assert.deepEqual(repinCua(k, 'H7').pop().evals_exit, {});
  assert.equal(nenCua(k, 'H7').length, 0, 'không dòng nen-do rỗng');
  return 'H7 chỉ judgment → tươi lại, một repin, 0 dòng nền';
});

await ca('GT-rf3', () => {
  // Khoảng rỗng: <từ> = <đến> → «0 hồ sơ cũ vì khoảng», thoát 0, không chạy lượt ghim.
  const k = FX.mkKhoGiuTuoi({ hoSo: ['H1'] });
  k.commit({ 'vat/H1-E1-phu.txt': 'cu\n' }, 'H1 cu'); // có hồ sơ cũ: lệnh vẫn không được ghim gì
  k.xoaDau();
  const truoc = bamSo(k.root);
  const b = giuTuoi(k, ['--tu', 'HEAD']);
  assert.equal(b.status, 0, b.stderr);
  assert.ok(b.stdout.includes('0 hồ sơ cũ vì khoảng'), b.stdout);
  assert.ok(!b.stderr.includes('[lane]'), `không được chạy lượt ghim: ${b.stderr}`);
  const j = jsonCua(giuTuoi(k, ['--tu', 'HEAD', '--json', '--write']));
  assert.deepEqual([j.ho_so, j.ton_dong], [[], []]);
  assert.equal(k.dem('suite.txt'), 0, 'suite không chạy');
  assert.equal(bamSo(k.root), truoc);
  return '0 hồ sơ, thoát 0, suite 0 lần';
});

await ca('GT-rf4', () => {
  // Nhật ký đỏ có số ngẫu nhiên (cổng, pid, thời lượng ms). Phần giờ/đường dẫn/ms của băm đã đo ở GT0-bam (trỏ về
  // đó, không viết lại); ca này đo cổng + pid qua LỆNH THẬT: E1 đỏ sẵn ở <từ> với cùng lỗi nhưng số khác mỗi lần chạy
  // → «đỏ sẵn trước khoảng». Chiều đỏ: bản sao lib bỏ chuẩn hoá cổng/pid → cùng kho ra «do-khoang».
  const RANG = 'p=$$\necho "Error: listen EADDRINUSE: address already in use 127.0.0.1:$((p % 40000 + 20000)) (pid $p) after $((p % 900 + 10))ms"\necho "(fail) ca-cong [$((p % 90 + 1)).25ms]"\nexit 1\n';
  const k = FX.mkKhoGiuTuoi({ hoSo: [{ slug: 'H5', evals: [{ id: 'E1', ca: 'ca-cong', paths: ['vat/H5-E1*'] }] }] });
  k.commit({ 'rang/H5-E1.sh': RANG }, 'E1 do truoc khoang (ngoai paths)');
  const tu = k.git('rev-parse', 'HEAD');
  k.gop(12, { 'vat/H5-E1-phu.txt': 'cham H5\n' });
  const a = spawnSync('sh', ['rang/H5-E1.sh'], { cwd: k.root, encoding: 'utf8' });
  const b = spawnSync('sh', ['rang/H5-E1.sh'], { cwd: k.root, encoding: 'utf8' });
  assert.notEqual(a.stdout, b.stdout, 'hai lần chạy phải khác số');
  assert.equal(DS.bamThongDiep(a.stdout, rutTenCa(a.stdout)), DS.bamThongDiep(b.stdout, rutTenCa(b.stdout)));
  assert.deepEqual(ketCucCua(jsonCua(giuTuoi(k, ['--tu', tu, '--json']))), { H5: 'do-san-truoc-khoang' });
  // Chiều đỏ trên bản sao bộ máy: bỏ hai phép chuẩn hoá cổng + pid.
  const d = thuMuc('gt-rf4-');
  for (const x of ['feature-loop', 'lib', 'scripts', 'skills', 'commands', 'hooks']) execFileSync('cp', ['-RL', path.join(ROOT, x), path.join(d, x)]);
  const p = path.join(d, 'lib', 'do-san-tren-nen.cjs'); const goc = readFileSync(p, 'utf8');
  const tiem = goc.replace(".replace(/:\\d+(:\\d+)?\\b/g, ':<so>')", '').replace(".replace(/\\bpid\\s*\\d+/gi, 'pid <so>')", '');
  assert.notEqual(tiem, goc); assert.equal(tiem.length, goc.length - ".replace(/:\\d+(:\\d+)?\\b/g, ':<so>')".length - ".replace(/\\bpid\\s*\\d+/gi, 'pid <so>')".length, 'phải bỏ đúng hai phép');
  writeFileSync(p, tiem);
  assert.deepEqual(ketCucCua(jsonCua(giuTuoi(k, ['--tu', tu, '--json'], { kit: d }))), { H5: 'do-khoang' }, 'mutant phải đổ cho #12');
  return 'cổng/pid khác mỗi lần → đỏ sẵn trước khoảng (giờ/đường dẫn/ms: GT0-bam) · mutant bỏ chuẩn hoá → do-khoang';
});

FX.donDep();
for (const d of tmp) rmSync(d, { recursive: true, force: true });
console.log(`\nGT Results: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
