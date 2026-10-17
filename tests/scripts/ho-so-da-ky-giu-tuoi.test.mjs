// GT — hồ sơ ho-so-da-ky-giu-tuoi (hàng K-A): lệnh giữ tươi theo khoảng gộp, quy đỏ về PR gây ra, nhãn
// «đỏ sẵn trên nền». Ca GT<n> = AC-n của hợp đồng; GT0-* là ca đơn vị của luật nhãn dùng chung
// (lib/do-san-tren-nen.cjs). Kho thử git do code sinh trong lượt; «bản trước vòng» = `git archive 43ed9e2b`
// bung trong lượt. Mọi đường dẫn suy từ vị trí tệp này. Chọn ca: GT_CASES=GT0-bam,GT1 node <tệp>.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
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
export const BAN_TRUOC_VONG = '43ed9e2b3e6d77e02d702a3171069c0af8843179';

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
  const tr = DS.trichThongDiep(LOG_A, ['ca-do']);
  assert.ok(tr.split('\n').length <= 3 && tr.includes('ca-do'), `trích phải ≤ 3 dòng và có tên ca: ${tr}`);
  return '4 cặp so + trích';
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

// ── Task 2: lượt ghim lại ghim từng hồ sơ · thông điệp đỏ · nhãn (GT2, GT3, GT6) ─────────────────────────────
// Kho thử do tests/scripts/giu-tuoi-fixture.mjs sinh: pin đầu do CHÍNH làn ghi, gộp PR là commit gộp thật.
const FX = await import(path.join(HERE, 'giu-tuoi-fixture.mjs'));
const { rutTenCa } = await import(path.join(ROOT, 'feature-loop', 'scripts', 'lib', 'chay-lai.mjs'));
const repinCua = (k, slug) => k.docLog(slug).filter(l => l.kind === 'repin');
const chuKy = (k, slug) => (k.docReport(slug).match(/^human_(signoff|override)\s*:.*$/gm) || []).join('\n');
// Dòng repin-do so giữa hai bản làn: bỏ giờ, mã lượt, thời lượng, tải máy, phút.
const chuanDauDo = (o) => { const x = JSON.parse(JSON.stringify(o)); for (const kk of ['ts', 'lan_id', 'wall_s', 'tai']) delete x[kk]; if (x.tong_ket) x.tong_ket.phut = 0; return JSON.stringify(x).replace(/repin-\d{8}T\d{6}Z-\d{5}/g, 'RUN'); };

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
  return 'H2 ghim · H5 repin-do (E1, băm 64 hex, trích có ca) · không cờ = bản trước vòng · suite đỏ → 0 ghim · bản trước vòng: H2 không ghim';
});

await ca('GT6', () => {
  const k = FX.mkKhoGiuTuoi({ hoSo: [{ slug: 'H5', evals: [{ id: 'E1', ca: 'ca-do' }, { id: 'E2', ca: 'ca-e2' }] }], khoa: true });
  const g12 = k.gop(12, { 'vat/H5-E1.txt': FX.noiDungDo({ ca: 'ca-do' }) });
  // Nền: lượt ghim từng hồ sơ trên nhánh chính ghi repin-do; dòng nền chép lenh_do + dinh_nghia của nó (bản chép
  // bên viết của lệnh giữ tươi — Task 4 thay bằng giu-tuoi.mjs --write).
  const rg = k.lane(['H5'], ['--tung-ho-so', '--write']);
  assert.equal(rg.status, 0, rg.stderr);
  const RUN_NEN = 'giu-tuoi-gt6';
  const dongNen = k.dongNenTuDauDo('H5', { runId: RUN_NEN, tu: g12.sha_truoc, quyVe: [{ pr: 12, sha_truoc: g12.sha_truoc, sha_sau: g12.sha_sau }] });
  const bamNen = JSON.parse(dongNen).lenh_do[0].thong_diep_bam;
  assert.match(bamNen, /^[0-9a-f]{64}$/);
  k.noiDong('H5', dongNen); k.git('add', '-A'); k.git('commit', '-qm', 'giu tuoi: dong nen');
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
  odo('nen chi tren nhanh vong', o('chi-nhanh', { tu: g12.sha_sau, truoc: () => k.noiDong('H5', dongNen) }), 'khong-co-dong-nen');
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
  assert.ok(rc.stderr.includes(`— đỏ sẵn trên nền — E1 (nền ${RUN_NEN7}, PR #12)`), `kiểm lại phải in nhãn: ${rc.stderr}`);
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
      assert.equal(rT.status, 0, rT.stderr); assert.ok(rT.stderr.includes(`— đỏ sẵn trên nền — E1 (nền ${RUN_NEN7}, PR #12)`), rT.stderr);
    }
    hoan(k);
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
  assert.equal(soO, 4, `ca tự kiểm số ô: ${soO}`);
  return `${soO}/4 ô · mutant không-đạt: làn 1 · lưới VIOLATION [H5] · kiểm lại 1 · mutant đạt (ô băm khác): làn ghim · lưới NOTE · kiểm lại 0 · khoá tắt: thẻ/bản đồ = bản trước vòng`;
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
  // Xoá riêng dòng nen-do của H5 trên cây.
  const p = path.join(k.root, '_acceptance', 'H5', 'run-log.jsonl');
  const goc = readFileSync(p, 'utf8');
  const bo = goc.split('\n').filter(l => !l.includes('"kind":"nen-do"')).join('\n');
  assert.notEqual(bo, goc, 'phải có dòng nen-do để xoá');
  writeFileSync(p, bo);
  const khong = chay(ban);
  const moiKhong = MOI.pm(k.root).stdout;
  hoan(k);
  assert.equal(tom(khong), tom(co), 'bản trước vòng: đầu ra bốn công cụ khi có dòng nen-do phải BẰNG khi xoá nó');
  // Độ nhạy của phép so: bản mới đọc dòng nền nên đầu ra của nó PHẢI khác giữa hai trạng thái.
  assert.notEqual(moiKhong, moiCo, 'đối chứng: lưới bản mới phải đổi khi xoá dòng nen-do');
  return 'bản trước vòng: 4 công cụ mã ∈ {0,1}, không stack trace · lưới VIOLATION [H5] E1=1 · kiểm lại 1 · có/không nen-do bằng nhau (bản mới khác)';
});

FX.donDep();
for (const d of tmp) rmSync(d, { recursive: true, force: true });
console.log(`\nGT Results: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
