// cay-doi-trong-luot.test.mjs — hồ sơ luot-cham-ghi-vao-cay (T3, 01/10).
// «Cây đổi trong lượt chấm»: s4-args chụp cây trước lượt (AC-1), thuoc-vat --write so sau lượt
// (AC-2 chiều đỏ · AC-3 chiều im), lib/nhan-canh-gay.cjs phân nhãn (AC-4), s4-args chấm lại cùng
// round chỉ sau khi hoàn lại (AC-5), thẻ Cổng Bằng chứng khoá (AC-6), lưới trước-merge + recheck
// chặn (AC-7). Tên nhóm LC<n> = AC-<n>.
//
// Fixture: kho git do CODE sinh (thuoc-vat-fixture.mjs); tệp args do s4-args THẬT sinh; dòng
// `cay-doi` do thuoc-vat --write THẬT ghi; dòng round-tally do bộ chấm THẬT dựng (harness vm của
// tests/workflows) — round-trip writer→reader, không dòng sổ viết tay. Mọi đường suy từ vị trí tệp
// này, nên răng hồ sơ chạy được cùng tệp trên BẢN SAO cây đã tiêm đột biến. Bản «trước vòng» lấy
// bằng `git archive` từ kho gốc (`LC_GOC`, mặc định chính cây này) — bản sao không có .git.
//
//   node tests/scripts/cay-doi-trong-luot.test.mjs [--only LC<n>]
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, appendFileSync, rmSync, existsSync, cpSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { runWorkflow } from '../workflows/harness.mjs';
import { dungKho, SLUG } from './thuoc-vat-fixture.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const GOC = process.env.LC_GOC ? path.resolve(process.env.LC_GOC) : KIT;
const require = createRequire(import.meta.url);
const S4ARGS = path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs');
const THUOC_VAT = path.join(KIT, 'feature-loop', 'scripts', 'thuoc-vat.mjs');
const CAY_DOI = path.join(KIT, 'feature-loop', 'scripts', 'lib', 'cay-doi.mjs');
const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const GC = path.join(KIT, 'scripts', 'gate-card.js');
const LIB = path.join(KIT, 'lib', 'nhan-canh-gay.cjs');
const TMP = mkdtempSync(path.join(tmpdir(), 'cay-doi-'));
const ONLY = (() => { const i = process.argv.indexOf('--only'); return i >= 0 ? process.argv[i + 1] : (process.env.LC_CASES || null); })();
const want = g => !ONLY || ONLY.split(',').includes(g);
let pass = 0; let fail = 0;
const ok = (name, msg = '') => { pass += 1; console.log(`PASS: ${name} ${msg}`.trimEnd() + ' '); };
const bad = (name, msg) => { fail += 1; console.log(`FAIL: ${name} — ${msg}`); };
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 3).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const WS = d => path.join(d, '_acceptance', SLUG);
const W = (d, rel, s) => { const f = path.join(d, rel); mkdirSync(path.dirname(f), { recursive: true }); writeFileSync(f, s); };
const A = (d, rel, s = '// doi\n') => appendFileSync(path.join(d, rel), s);
// Commit ĐÍCH DANH (không `add -A`): tác tử chấm commit vật của nó, không gom sổ của phiên chính.
const commit = (d, tep = ['-A'], msg = 'c') => { git(d, 'add', ...tep); git(d, 'commit', '-qm', msg); return git(d, 'rev-parse', 'HEAD'); };
const sortJ = a => JSON.stringify([...a].sort());

// ── kho fixture đủ mọi lớp đường (design doc §3, bảng lớp thật) ─────────────
function kho() {
  const { d } = dungKho(mkdtempSync(path.join(TMP, 'k-')), ['vat', 'implemented']);
  W(d, 'src/b.js', '// b\n');
  W(d, 'tests/k.test.mjs', '// test kho\n');
  W(d, '.acceptance-runs/demo/x.json', '{}\n');
  W(d, `_acceptance/${SLUG}/evidence/chup.mjs`, '// chup\n');
  W(d, '.claude/launch.json', '{}\n');
  W(d, '_acceptance/khac/evidence/ve-that.json', '{}\n');
  W(d, '_acceptance/khac/rang.sh', '# rang\n');
  W(d, 'docs/x.md', 'x\n');
  commit(d, ['-A'], 'kho day du');
  return d;
}
const ARGS = d => path.join(WS(d), 's4-args.json');
const sinhArgs = (d, extra = [], out = ARGS(d)) => spawnSync(process.execPath, [S4ARGS, '--slug', SLUG, '--root', d, '--ag-root', KIT, '--out', out, '--diff-base', 'main', '--no-carry', ...extra], { encoding: 'utf8' });
const docArgs = (d, f = ARGS(d)) => JSON.parse(readFileSync(f, 'utf8'));
const sauLuot = d => spawnSync(process.execPath, [THUOC_VAT, '--root', d, '--slug', SLUG, '--ag-root', KIT, '--write'], { encoding: 'utf8' });
const dongSo = (d, kind) => readFileSync(path.join(WS(d), 'run-log.jsonl'), 'utf8').split('\n').filter(Boolean)
  .map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(o => o && o.kind === kind);
const ngan = (d, a, b) => git(d, 'log', '--format=%h', `${a}..${b}`).split('\n').filter(Boolean);

// Khoá của dòng `cay-doi` RÚT từ khối marker của bên viết (cay-doi.mjs) — không gõ tay.
const khoaKhuon = () => {
  const m = readFileSync(CAY_DOI, 'utf8').match(/<<<CAY-DOI-LINE\n\/\/ (\{[^\n]+\})\n\/\/ CAY-DOI-LINE>>>/);
  if (!m) throw new Error('khong rut duoc khoi CAY-DOI-LINE tu cay-doi.mjs');
  return [...m[1].matchAll(/"([a-z_]+)":/g)].map(x => x[1]).sort();
};

// Lượt chấm thật (bộ chấm + tác tử giả) → các dòng sổ của nó, ts = invokedAt của args.
async function luotCham(d, a, { maThoat = 0 } = {}) {
  const ev = [{ id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'echo x', ref: 'config:executors.test.api', expected: 'x' }];
  const r = await runWorkflow(WF, { slug: SLUG, round: a.round, riskTier: 'T2', evals: ev, suiteCommands: [], diffBase: 'main', repoRoot: d, personasPath: '/p', templatePath: '/t', invokedAt: a.invokedAt, invokedSha: a.invokedSha }, c => {
    const l = c.label;
    if (l.startsWith('machine:')) return { exitCode: maThoat, outputTail: `x\n__EXIT=${maThoat}`, runId: 'rid-e1', cannotRun: false };
    if (l.startsWith('review:')) return { findings: [] };
    if (l.startsWith('refute:')) return { refuted: true, reason: 'x' };
    if (l.startsWith('baseline:')) return { results: [] };
    if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: a.invokedSha };
    if (l === 'synthesize:report') return { report: '# r', findings: '# f' };
    return null;
  });
  appendFileSync(path.join(WS(d), 'run-log.jsonl'), r.result.runLog.join('\n') + '\n');
  return r.result;
}

// Bản «trước vòng» — cha của commit đầu đưa nhánh `cay-doi` vào lib; chưa commit → HEAD.
const TRUOC = (() => {
  try {
    const shas = git(GOC, 'log', '--format=%H', '--reverse', '-S', "'cay-doi'", '--', 'lib/nhan-canh-gay.cjs').split('\n').filter(Boolean);
    const ref = shas.length ? `${shas[0]}^` : 'HEAD';
    const d = mkdtempSync(path.join(TMP, 'truoc-'));
    const tar = execFileSync('git', ['-C', GOC, 'archive', ref, 'scripts', 'lib', 'skills'], { maxBuffer: 512 * 1024 * 1024 });
    execFileSync('tar', ['-x', '-C', d], { input: tar });
    return { d, ref };
  } catch (e) { return { loi: loi(e) }; }
})();

// ── LC1 — ảnh chụp trước lượt ───────────────────────────────────────────────
if (want('LC1')) {
  try {
    const sai = [];
    const d = kho();
    // Bẩn trước khi sinh args: đủ bốn lớp + ba tiền tố trừ, cả theo dõi lẫn chưa theo dõi.
    A(d, 'src/a.js'); A(d, '_acceptance/khac/rang.sh', '# doi\n'); A(d, `_acceptance/${SLUG}/decisions.jsonl`, '{"id":"x"}\n');
    A(d, 'docs/x.md', 'y\n'); A(d, '.acceptance-runs/demo/x.json', ' '); A(d, `_acceptance/${SLUG}/evidence/chup.mjs`); A(d, '.claude/launch.json', ' ');
    W(d, 'src/new.js', 'n\n'); W(d, 'docs/new.md', 'n\n'); W(d, `_acceptance/${SLUG}/new.md`, 'n\n'); W(d, '.acceptance-runs/demo/y.json', '{}');
    W(d, 'tmp/out.txt', 'o\n'); W(d, '.claude/z.json', '{}');
    const r = sinhArgs(d);
    if (r.status !== 0) throw new Error(`s4-args thoat ${r.status}: ${String(r.stderr).split('\n').slice(-3).join(' | ')}`);
    const a = docArgs(d); const c = a.cayChup;
    const MONG = { ban: ['_acceptance/khac/rang.sh', 'src/a.js'], chuaTheoDoi: ['src/new.js', 'tmp/'] };
    let n = 0;
    n += 1; if (!c || c.sha !== a.invokedSha) sai.push(`sha ${c && c.sha} != invokedSha ${a.invokedSha}`);
    n += 1; if (!c || sortJ(Object.keys(c.ban || {})) !== JSON.stringify(MONG.ban)) sai.push(`ban ${JSON.stringify(c && Object.keys(c.ban || {}))} — lot vao anh: ${JSON.stringify(Object.keys((c && c.ban) || {}).filter(k => !MONG.ban.includes(k)))}`);
    n += 1; if (!c || !Object.values(c.ban || {}).every(h => /^[0-9a-f]{64}$/.test(h))) sai.push('bam khong phai sha256');
    n += 1; if (!c || sortJ(c.chuaTheoDoi || []) !== JSON.stringify(MONG.chuaTheoDoi)) sai.push(`chuaTheoDoi ${JSON.stringify(c && c.chuaTheoDoi)} — lot vao anh: ${JSON.stringify(((c && c.chuaTheoDoi) || []).filter(k => !MONG.chuaTheoDoi.includes(k)))}`);
    const d2 = kho(); const r2 = sinhArgs(d2);
    const c2 = r2.status === 0 ? docArgs(d2).cayChup : null;
    n += 1; if (!c2 || Object.keys(c2.ban || {}).length || (c2.chuaTheoDoi || []).length) sai.push(`cay sach ma anh khong rong: ${JSON.stringify(c2)}`);
    if (n !== 5) sai.push(`so khang dinh ${n} != 5`);
    if (sai.length) bad('LC1', sai.join(' ; ')); else ok('LC1', '— ảnh chụp liệt đúng 2 tệp theo dõi + 2 mục chưa theo dõi trong vùng xét; cây sạch → rỗng');
  } catch (e) { bad('LC1', loi(e)); }
}

// ── LC2 — chiều đỏ ──────────────────────────────────────────────────────────
const HANG_DO = [
  { n: 1, ten: 'commit sua vat', tiem: d => { A(d, 'src/a.js'); commit(d, ['src/a.js']); }, tep: [['src/a.js', 'commit']], soCommit: 1 },
  { n: 2, ten: 'sua tep theo doi khong commit', tiem: d => A(d, 'src/a.js'), tep: [['src/a.js', 'đổi nội dung']], soCommit: 0 },
  { n: 3, ten: 'xoa tep theo doi', tiem: d => rmSync(path.join(d, 'src/b.js')), tep: [['src/b.js', 'xoá']], soCommit: 0 },
  { n: 4, ten: 'commit roi hoan lai', tiem: d => { A(d, 'src/a.js'); commit(d, ['src/a.js']); git(d, 'revert', '--no-edit', 'HEAD'); }, tep: [['src/a.js', 'commit']], soCommit: 2 },
  { n: 5, ten: 'commit thuoc ho so khac', tiem: d => { A(d, '_acceptance/khac/rang.sh', '# doi\n'); commit(d, ['_acceptance/khac/rang.sh']); }, tep: [['_acceptance/khac/rang.sh', 'commit']], soCommit: 1 },
];
if (want('LC2')) {
  let K; try { K = khoaKhuon(); } catch (e) { bad('LC2', loi(e)); }
  let saiNhom = 0;
  for (const h of K ? HANG_DO : []) {
    const ten = `LC2 hang ${h.n}`;
    try {
      const d = kho(); const r0 = sinhArgs(d);
      if (r0.status !== 0) throw new Error(`s4-args thoat ${r0.status}`);
      const a = docArgs(d);
      h.tiem(d);
      const r = sauLuot(d); const L = dongSo(d, 'cay-doi');
      const tep = L[0] ? (L[0].tep || []).map(x => [x.tep, x.doi]) : null;
      const mongCommit = ngan(d, a.invokedSha, 'HEAD');
      const sai = [];
      if (L.length !== 1) sai.push(`${L.length} dong cay-doi, mong 1`);
      else {
        if (JSON.stringify(Object.keys(L[0]).sort()) !== JSON.stringify(K)) sai.push(`khoa dong ${JSON.stringify(Object.keys(L[0]).sort())} != khuon ${JSON.stringify(K)}`);
        if (JSON.stringify(tep) !== JSON.stringify(h.tep)) sai.push(`tep ${JSON.stringify(tep)} != ${JSON.stringify(h.tep)}`);
        if (sortJ(L[0].commit || []) !== sortJ(mongCommit) || mongCommit.length !== h.soCommit) sai.push(`commit ${JSON.stringify(L[0].commit)} != ${JSON.stringify(mongCommit)}`);
        if (L[0].luot_ts !== a.invokedAt) sai.push(`luot_ts ${L[0].luot_ts} != invokedAt ${a.invokedAt}`);
        if (L[0].sha !== a.invokedSha) sai.push('sha dong != invokedSha');
      }
      if (r.status !== 6) sai.push(`thoat ${r.status}, mong 6`);
      if (!String(r.stderr).includes('cay doi trong luot cham')) sai.push('thieu thong diep ghim «cay doi trong luot cham»');
      if (sai.length) { saiNhom += 1; bad(ten, `${h.ten}: ${sai.join(' ; ')}`); } else ok(ten, `— ${h.ten}: một dòng cây đổi đúng khuôn, thoát 6`);
    } catch (e) { saiNhom += 1; bad(ten, loi(e)); }
  }
  if (K) {
    try {
      const d = kho(); sinhArgs(d);
      A(d, 'tests/k.test.mjs');   // test kho: vật (vùng xét) VÀ nằm trong ảnh chụp thước
      const r = sauLuot(d);
      const sai = [];
      if (dongSo(d, 'thuoc-lech').length !== 1) sai.push('thieu dong thuoc-lech');
      if (dongSo(d, 'cay-doi').length !== 1) sai.push('thieu dong cay-doi');
      if (r.status !== 5) sai.push(`thoat ${r.status}, mong 5 (thuoc lech thang)`);
      if (sai.length) { saiNhom += 1; bad('LC2 hang lech', sai.join(' ; ')); } else ok('LC2 hang lech', '— thước lệch cùng lượt: hai dòng, thoát 5');
    } catch (e) { saiNhom += 1; bad('LC2 hang lech', loi(e)); }
    if (!saiNhom) ok('LC2', `— ${HANG_DO.length}/${HANG_DO.length} hàng đỏ + hàng thước lệch`);
  }
}

// ── LC3 — chiều im ──────────────────────────────────────────────────────────
const HANG_IM = [
  { n: 1, ten: 'khong doi gi', tiem: () => {} },
  { n: 2, ten: 'tep theo doi duoi .acceptance-runs', tiem: d => A(d, '.acceptance-runs/demo/x.json', ' ') },
  { n: 3, ten: 'evidence/chup.mjs cua chinh ho so', tiem: d => A(d, `_acceptance/${SLUG}/evidence/chup.mjs`) },
  { n: 4, ten: 'phien chinh commit so giua luot', tiem: d => { A(d, `_acceptance/${SLUG}/decisions.jsonl`, '{"id":"d-x"}\n'); A(d, `_acceptance/${SLUG}/run-log.jsonl`, '{"kind":"ghi"}\n'); commit(d, [`_acceptance/${SLUG}/decisions.jsonl`, `_acceptance/${SLUG}/run-log.jsonl`]); } },
  { n: 5, ten: 'commit tep t1', tiem: d => { A(d, 'docs/x.md', 'z\n'); commit(d, ['docs/x.md']); } },
  { n: 6, ten: 'cay ban san', truoc: d => A(d, 'src/a.js'), tiem: () => {} },
  { n: 7, ten: 'cham mtime cung byte', tiem: d => { const t = new Date(Date.now() + 5000); utimesSync(path.join(d, 'src/a.js'), t, t); } },
  { n: 8, ten: 'tep moi chua theo doi', tiem: d => W(d, 'tmp/out.txt', 'o\n'), stderr: ['tep moi chua theo doi', 'tmp/'] },
  { n: 9, ten: 'tao pham chua theo doi co san bi ghi lai', truoc: d => { W(d, '.s4-acceptance-verify.js', 'a\n'); W(d, '.wf/acceptance-verify-1.js', 'b\n'); }, tiem: d => { W(d, '.s4-acceptance-verify.js', 'khac\n'); W(d, '.wf/acceptance-verify-1.js', 'b\n'); } },
  { n: 10, ten: '.claude/launch.json', tiem: d => A(d, '.claude/launch.json', ' ') },
  { n: 11, ten: 'evidence cua ho so khac', tiem: d => A(d, '_acceptance/khac/evidence/ve-that.json', ' ') },
];
if (want('LC3')) {
  let saiNhom = 0;
  for (const h of HANG_IM) {
    const ten = `LC3 hang ${h.n}`;
    try {
      const d = kho();
      if (h.truoc) h.truoc(d);
      const r0 = sinhArgs(d); if (r0.status !== 0) throw new Error(`s4-args thoat ${r0.status}`);
      h.tiem(d);
      const r = sauLuot(d); const L = dongSo(d, 'cay-doi');
      const sai = [];
      if (L.length) sai.push(`co ${L.length} dong cay-doi: ${JSON.stringify(L[0].tep)}`);
      if (r.status !== 0) sai.push(`thoat ${r.status}, mong 0`);
      for (const s of h.stderr || []) if (!String(r.stderr).includes(s)) sai.push(`stderr thieu «${s}»`);
      if (sai.length) { saiNhom += 1; bad(ten, `${h.ten}: ${sai.join(' ; ')}`); } else ok(ten, `— ${h.ten}: im, thoát 0`);
    } catch (e) { saiNhom += 1; bad(ten, loi(e)); }
  }
  try {
    const d = kho(); sinhArgs(d);
    const a = docArgs(d); delete a.cayChup; writeFileSync(ARGS(d), JSON.stringify(a));
    A(d, 'src/a.js'); commit(d, ['src/a.js']);
    const r = sauLuot(d);
    const sai = [];
    if (dongSo(d, 'cay-doi').length) sai.push('args doi cu ma van co dong cay-doi');
    if (r.status !== 0) sai.push(`thoat ${r.status}`);
    if (!String(r.stderr).includes('khong co anh chup cay')) sai.push('stderr thieu «khong co anh chup cay»');
    if (sai.length) { saiNhom += 1; bad('LC3 doc cu', sai.join(' ; ')); } else ok('LC3 doc cu', '— args đời cũ: không so, không dòng, stderr nói rõ');
  } catch (e) { saiNhom += 1; bad('LC3 doc cu', loi(e)); }
  if (!saiNhom) ok('LC3', `— ${HANG_IM.length}/${HANG_IM.length} hàng im + đường đọc-cũ`);
}

// Hồ sơ đã chấm một lượt PASS rồi tác tử commit vật trong lượt → sổ có tally + cay-doi (round-trip).
async function hoSoCayDoi({ maThoat = 0, tiem = d => { A(d, 'src/a.js'); commit(d, ['src/a.js']); } } = {}) {
  const d = kho(); const r0 = sinhArgs(d);
  if (r0.status !== 0) throw new Error(`s4-args thoat ${r0.status}: ${String(r0.stderr).split('\n').slice(-2).join(' | ')}`);
  const a = docArgs(d);
  tiem(d);                                   // trong lượt: tác tử ghi vào cây
  const kq = await luotCham(d, a, { maThoat });   // xong lượt: phiên chính nối sổ của bộ chấm
  const r = sauLuot(d);                       // rồi bước sau-lượt
  return { d, a, kq, r };
}
const lib = () => { delete require.cache[require.resolve(LIB)]; return require(LIB); };

// ── LC4 — lib phân nhãn ─────────────────────────────────────────────────────
if (want('LC4')) {
  const sai = [];
  try {
    const L = lib();
    const doc = d => readFileSync(path.join(WS(d), 'run-log.jsonl'), 'utf8');
    const cg = (d, verdict) => L.canhGay({ runLogText: doc(d), verdict, nguon: L.NGUON });
    // (1) khớp + PASS
    const h1 = await hoSoCayDoi();
    const c1 = cg(h1.d, 'PASS');
    const mong = ngan(h1.d, h1.a.invokedSha, 'HEAD');
    if (c1.trangThai !== 'cay-doi') sai.push(`(1) PASS: trangThai ${c1.trangThai}, mong cay-doi`);
    else if (JSON.stringify((c1.cay && c1.cay.tep || []).map(x => x.tep)) !== '["src/a.js"]' || sortJ(c1.cay.commit || []) !== sortJ(mong)) sai.push(`(1) cay ${JSON.stringify(c1.cay)}`);
    // (2) khớp + REJECT
    const h2 = await hoSoCayDoi({ maThoat: 1 });
    if (h2.kq.verdict !== 'REJECT') sai.push(`(2) doi chung: bo cham tra ${h2.kq.verdict}`);
    if (cg(h2.d, 'REJECT').trangThai !== 'cay-doi') sai.push(`(2) REJECT: trangThai ${cg(h2.d, 'REJECT').trangThai}`);
    // (3) dòng của lần thử TRƯỚC: lượt mới (ts khác) chạy sau
    await luotCham(h1.d, { ...h1.a, invokedAt: '2099-01-01T00:00:00Z' });
    if (cg(h1.d, 'PASS').trangThai === 'cay-doi') sai.push('(3) dong cua lan thu truoc van ra cay-doi');
    // (4) dòng mồ côi: luot_ts không khớp tally nào
    const h4 = await hoSoCayDoi({ tiem: d => { A(d, 'src/a.js'); commit(d, ['src/a.js']); const a = docArgs(d); a.invokedAt = '2001-01-01T00:00:00Z'; writeFileSync(ARGS(d), JSON.stringify(a)); } });
    if (dongSo(h4.d, 'cay-doi').length !== 1) sai.push('(4) doi chung: khong sinh dong mo coi');
    if (cg(h4.d, 'PASS').trangThai === 'cay-doi') sai.push('(4) dong mo coi ra cay-doi tren the');
    // (5) kèm thước lệch → lech thắng
    const h5 = await hoSoCayDoi({ tiem: d => { A(d, 'tests/k.test.mjs'); A(d, 'src/a.js'); commit(d, ['src/a.js']); } });
    if (cg(h5.d, 'PASS').trangThai !== 'lech') sai.push(`(5) co ca thuoc-lech: trangThai ${cg(h5.d, 'PASS').trangThai}, mong lech`);
    // (6) không dòng cay-doi → deep-equal bản lib trước vòng
    if (TRUOC.loi) sai.push(`(6) khong dung duoc ban truoc vong: ${TRUOC.loi}`);
    else {
      const cu = require(path.join(TRUOC.d, 'lib', 'nhan-canh-gay.cjs'));
      const h6 = await hoSoCayDoi({ tiem: () => {} });
      if (dongSo(h6.d, 'cay-doi').length) sai.push('(6) doi chung: co dong cay-doi');
      for (const v of ['PASS', 'REJECT', 'BLOCKED']) {
        const moi = JSON.stringify(L.canhGay({ runLogText: doc(h6.d), verdict: v, nguon: L.NGUON }));
        const truoc = JSON.stringify(cu.canhGay({ runLogText: doc(h6.d), verdict: v, nguon: cu.NGUON }));
        if (moi !== truoc) sai.push(`(6) ${v}: ${moi} != ban truoc vong ${truoc}`);
      }
    }
    // (7) nhãn có trong CONTEXT.md, mục Nhãn trạng thái
    const ctx = readFileSync(path.join(KIT, 'CONTEXT.md'), 'utf8');
    const muc = ctx.slice(ctx.indexOf('**Nhãn trạng thái**:'), ctx.indexOf('**dogfood**:'));
    if (!L.NHAN.CAY || !muc.includes(L.NHAN.CAY)) sai.push(`(7) NHAN.CAY «${L.NHAN.CAY}» khong co trong muc Nhan trang thai cua CONTEXT.md`);
  } catch (e) { sai.push(loi(e)); }
  if (sai.length) bad('LC4', sai.join(' ; ')); else ok('LC4', '— khớp lượt → cây đổi (PASS, REJECT) · lần trước / mồ côi → không · thước lệch thắng · không dòng → bằng bản trước vòng · nhãn có trong từ điển');
}

// ── LC5 — s4-args: hoàn lại rồi mới chấm lại cùng round ─────────────────────
if (want('LC5')) {
  const saiR = []; const saiH = [];
  try {
    const h = await hoSoCayDoi();
    const tam = path.join(TMP, `a-${Date.now()}.json`);
    // (a) commit lạ còn trong HEAD → chặn có tên, không sinh tệp
    const ra = sinhArgs(h.d, [], tam);
    if (ra.status !== 2 || !String(ra.stderr).includes('cay doi chua hoan lai') || existsSync(tam)) saiH.push(`(a) chua hoan lai: thoat ${ra.status}, sinh tep ${existsSync(tam)}, stderr ${String(ra.stderr).split('\n').slice(-2).join(' | ')}`);
    // (b) lối có tên --nhan-cay-moi
    const tamB = path.join(TMP, `b-${Date.now()}.json`);
    const rb = sinhArgs(h.d, ['--nhan-cay-moi'], tamB);
    const mong = ngan(h.d, h.a.invokedSha, 'HEAD');
    if (rb.status !== 0 || !existsSync(tamB) || sortJ(docArgs(h.d, tamB).cayNhanMoi || []) !== sortJ(mong)) saiH.push(`(b) --nhan-cay-moi: thoat ${rb.status}, cayNhanMoi ${existsSync(tamB) ? JSON.stringify(docArgs(h.d, tamB).cayNhanMoi) : '-'}`);
    // (c) hoàn lại → CÙNG round
    git(h.d, 'reset', '-q', '--keep', h.a.invokedSha);
    const rc = sinhArgs(h.d);
    if (rc.status !== 0) saiR.push(`(c) da hoan lai ma thoat ${rc.status}: ${String(rc.stderr).split('\n').slice(-2).join(' | ')}`);
    else if (docArgs(h.d).round !== h.a.round || !String(rc.stderr).includes('cay doi trong luot cham — thu lai CUNG round')) saiR.push(`(c) round ${docArgs(h.d).round}, mong ${h.a.round} cung round`);
    // (d) lần thử lại thứ hai vẫn cây đổi → round + 1
    if (rc.status === 0) {
      const a2 = docArgs(h.d);
      A(h.d, 'src/a.js'); commit(h.d, ['src/a.js']);
      await luotCham(h.d, a2); sauLuot(h.d);
      git(h.d, 'reset', '-q', '--keep', a2.invokedSha);
      const rd = sinhArgs(h.d);
      if (rd.status !== 0 || docArgs(h.d).round !== h.a.round + 1 || !String(rd.stderr).includes('da thu lai mot lan van cay doi')) saiR.push(`(d) thu lai lan hai: thoat ${rd.status}, round ${rd.status === 0 ? docArgs(h.d).round : '-'}`);
    }
    // (e) đối chứng: lượt PASS không dòng cây đổi → round kế như trước vòng
    const e = await hoSoCayDoi({ tiem: () => {} });
    const re = sinhArgs(e.d);
    if (re.status !== 0 || docArgs(e.d).round !== e.a.round + 1) saiR.push(`(e) doi chung: thoat ${re.status}, round ${re.status === 0 ? docArgs(e.d).round : '-'}, mong ${e.a.round + 1}`);
  } catch (e) { saiR.push(loi(e)); }
  if (saiH.length) bad('LC5 hoan lai', saiH.join(' ; '));
  if (saiR.length) bad('LC5 round', saiR.join(' ; '));
  if (!saiH.length && !saiR.length) ok('LC5', '— chưa hoàn lại → chặn có tên · --nhan-cay-moi đi tiếp có ghi · đã hoàn lại → cùng round · lần hai → round kế · đối chứng không đổi');
}

// ── LC6 — thẻ Cổng Bằng chứng ───────────────────────────────────────────────
const baoCao = (d, verdict = 'PASS') => {
  const f = path.join(WS(d), 'contract.md');
  writeFileSync(f, readFileSync(f, 'utf8').replace(/status: \w+/, 'status: verified'));
  writeFileSync(path.join(WS(d), 'evidence-report.md'), `---\nschema_version: 2\nfeature_slug: ${SLUG}\nverdict: ${verdict}\nreason:\nverified_by: fresh-context verification subagent\nenforcement_mode: strict\nbypass_used: false\nverified_commit: ${'a'.repeat(40)}\nhuman_signoff:\n---\n\n# Evidence Report: ${SLUG}\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| E1 | AC-1 | test | PASS |\n\n## Evidence\n\n- eval: E1\n  run_id: rid-e1\n  exit_code: 0\n  verifier: config:executors.test.api\n  verified_at: 2026-10-01T00:00:00Z\n\n## Known limits\n\n## Ngoài hợp đồng\n\n## Iterations\n\nRound 1: xem so chay.\n`);
};
const the = (d, gc = GC) => {
  const h = spawnSync(process.execPath, [gc, '--root', d, '--slug', SLUG], { encoding: 'utf8' });
  const x = spawnSync(process.execPath, [gc, '--root', d, '--slug', SLUG, '--extract'], { encoding: 'utf8' });
  let j = null; try { j = JSON.parse(x.stdout); } catch { /* bản lỗi */ }
  return { html: h.stdout, st: h.status, j, err: `${h.stderr}${x.stderr}` };
};
if (want('LC6')) {
  const sai = [];
  try {
    const h = await hoSoCayDoi(); baoCao(h.d);
    const t = the(h.d); const NH = lib().NHAN;
    const sha = ngan(h.d, h.a.invokedSha, 'HEAD')[0];
    if (!t.j) sai.push(`extract khong doc duoc: ${t.err.slice(0, 200)}`);
    else {
      if (t.j.approvable !== false) sai.push(`approvable ${t.j.approvable}, mong false`);
      if (!t.j.canh_gay || t.j.canh_gay.trangThai !== 'cay-doi') sai.push(`canh_gay.trangThai ${t.j.canh_gay && t.j.canh_gay.trangThai}`);
      if (t.j.one_shot != null) sai.push('one_shot khong null — the van moi ky');
    }
    for (const s of [NH.CAY, 'src/a.js', sha, 'chấm lại cùng vòng — không đếm vào trần']) if (!t.html.includes(s)) sai.push(`HTML thieu «${s}»`);
    // Không dòng cây đổi → HTML bằng bản thẻ trước vòng từng byte.
    if (TRUOC.loi) sai.push(`khong dung duoc ban truoc vong: ${TRUOC.loi}`);
    else {
      const k = await hoSoCayDoi({ tiem: () => {} }); baoCao(k.d);
      const moi = the(k.d).html; const cu = the(k.d, path.join(TRUOC.d, 'scripts', 'gate-card.js')).html;
      if (!moi || moi !== cu) sai.push(`khong dong cay-doi ma HTML khac ban truoc vong (${TRUOC.ref})`);
    }
  } catch (e) { sai.push(loi(e)); }
  if (sai.length) bad('LC6', `approvable/nhan: ${sai.join(' ; ')}`); else ok('LC6', '— thẻ khoá, nhãn + tệp + commit + câu việc; không dòng → HTML bằng bản trước vòng từng byte');
}

// ── LC7 — lưới trước-merge + recheck ────────────────────────────────────────
// Hồ sơ ĐÃ KÝ PASS (khuôn kho của ntr-luoi.test.mjs); dòng cây đổi dựng bằng CHÍNH hàm viết
// `dongCayDoi` của cay-doi.mjs (round-trip đầy đủ qua thuoc-vat đã có ở LC4).
const DA_KY = require(path.join(KIT, 'lib', 'workspace-record.cjs')).DA_THONG_CONG_2.find(s => s !== 'machine-cleared');
async function khoKy({ cay }) {
  const { dongCayDoi } = await import(CAY_DOI);
  const r = mkdtempSync(path.join(TMP, 'ky-'));
  const g = (...a) => execFileSync('git', ['-C', r, ...a], { encoding: 'utf8' }).trim();
  g('init', '-q', '-b', 'main'); g('config', 'user.email', 'x@y.z'); g('config', 'user.name', 'x');
  const d = path.join(r, '_acceptance', 's'); mkdirSync(d, { recursive: true });
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), 'schema_version: 1\nexecutors:\n  script:\n    e1: "true"\n');
  writeFileSync(path.join(r, 'ma.js'), 'v1\n');
  writeFileSync(path.join(d, 'contract.md'), `---\nschema_version: 1\nslug: s\nfeature: f\nowner: x@y.z\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${DA_KY}\napproved_by: M\napproved_at: 2026-09-01T00:00:00Z\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Out of scope\n\n- x\n- y\n`);
  writeFileSync(path.join(d, 'evals.yaml'), 'schema_version: 1\nfeature_slug: s\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.e1\n    expected: x\n');
  g('add', '-A'); g('commit', '-qm', 'nen'); const sha = g('rev-parse', 'HEAD');
  const TS = '2026-09-21T10:00:00Z';
  const ev = [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: 'cmd-1', ref: 'config:executors.script.e1', expected: 'x' }];
  const res = (await runWorkflow(WF, { slug: 's', round: 1, riskTier: 'T2', evals: ev, suiteCommands: [], diffBase: 'main', repoRoot: r, personasPath: '/p', templatePath: '/t', invokedAt: TS, invokedSha: sha }, c => {
    const l = c.label;
    if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'ok\n__EXIT=0', runId: 'rid-cmd-1', cannotRun: false };
    if (l.startsWith('review:')) return { findings: [] };
    if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: sha };
    if (l === 'synthesize:report') return { report: '# r', findings: '# f' };
    return null;
  })).result;
  const dong = [...res.runLog];
  if (cay) dong.push(dongCayDoi({ round: 1, luotTs: TS, sha, tep: [{ tep: 'ma.js', doi: 'commit' }], commit: ['abc1234'], moi: [], ts: '2026-09-21T10:05:00Z' }));
  writeFileSync(path.join(d, 'run-log.jsonl'), dong.join('\n') + '\n');
  const rid = JSON.parse(res.runLog.find(x => x.includes('"evalId":"E1"'))).run_id;
  writeFileSync(path.join(d, 'evidence-report.md'), `---\nschema_version: 2\nfeature_slug: s\nverdict: ${res.verdict}\nreason: xem so chay\nverified_by: fresh-context verification subagent\nenforcement_mode: strict\nbypass_used: false\nverified_commit: ${sha}\nhuman_signoff: M 2026-09-21\n---\n\n# r\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| E1 | AC-1 | script | PASS |\n\n## Evidence\n\n- eval: E1\n  run_id: ${rid}\n  exit_code: 0\n  verifier: config:executors.script.e1\n  verified_at: ${TS}\n\n## Known limits\n\n## Ngoài hợp đồng\n`);
  g('add', '-A'); g('commit', '-qm', 'ho so');
  return { r, d, verdict: res.verdict };
}
const luoi = (r, kit = KIT) => { const p = spawnSync('bash', [path.join(kit, 'scripts', 'pre-merge-check.sh'), r, '--no-t1-escape'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); return { ma: p.status, out: `${p.stdout}${p.stderr}` }; };
const kiemLai = (d, kit = KIT) => { const p = spawnSync(process.execPath, [path.join(kit, 'scripts', 'recheck-evidence.cjs'), path.join(d, 'evidence-report.md')], { encoding: 'utf8' }); return { ma: p.status, out: `${p.stdout}${p.stderr}` }; };
const banSaoKit = () => { const s = mkdtempSync(path.join(TMP, 'sao-')); for (const x of ['scripts', 'lib', 'commands', 'skills', 'feature-loop']) cpSync(path.join(KIT, x), path.join(s, x), { recursive: true }); return s; };
if (want('LC7')) {
  const sai = []; const saiCu = [];
  const VIO = 'VIOLATION [s]: lượt chấm cuối không dùng được — cây đổi trong lượt chấm';
  try {
    const co = await khoKy({ cay: true }); const khong = await khoKy({ cay: false });
    if (co.verdict !== 'PASS') sai.push(`doi chung: bo cham tra ${co.verdict}`);
    const a1 = luoi(co.r); const b1 = kiemLai(co.d);
    if (a1.ma === 0 || !a1.out.includes(VIO)) sai.push(`co dong: pre-merge thoat ${a1.ma}, thieu «${VIO}»`);
    if (b1.ma !== 1 || !b1.out.includes('cây đổi trong lượt chấm')) sai.push(`co dong: recheck thoat ${b1.ma}: ${b1.out.slice(0, 200)}`);
    const a0 = luoi(khong.r); const b0 = kiemLai(khong.d);
    if (a0.ma !== 0) sai.push(`doi chung khong dong: pre-merge thoat ${a0.ma}: ${a0.out.split('\n').filter(l => /\[s\]/.test(l)).join(' | ')}`);
    if (b0.ma !== 0) sai.push(`doi chung khong dong: recheck thoat ${b0.ma}`);
    // lib vắng → luật cũ
    const s1 = banSaoKit(); rmSync(path.join(s1, 'lib', 'nhan-canh-gay.cjs'));
    const a2 = luoi(co.r, s1); const b2 = kiemLai(co.d, s1);
    if (a2.out.includes(VIO)) sai.push('lib vang ma van VIOLATION cay doi');
    if (b2.out.includes('cây đổi trong lượt chấm')) sai.push('lib vang ma recheck van chan cay doi');
    // lib đời cũ (bản trước vòng) + script mới
    if (TRUOC.loi) saiCu.push(`khong dung duoc ban truoc vong: ${TRUOC.loi}`);
    else {
      const s2 = banSaoKit(); cpSync(path.join(TRUOC.d, 'lib', 'nhan-canh-gay.cjs'), path.join(s2, 'lib', 'nhan-canh-gay.cjs'));
      const a3 = luoi(co.r, s2); const b3 = kiemLai(co.d, s2);
      if (a3.out.includes(VIO) || !a3.out.includes('lib chua biet nhan cay doi')) saiCu.push(`lib doi cu: pre-merge ${a3.ma}, NOTE ${a3.out.includes('lib chua biet nhan cay doi')}`);
      if (b3.ma !== 0 || /TypeError|\n\s+at /.test(b3.out)) saiCu.push(`lib doi cu: recheck thoat ${b3.ma}: ${b3.out.slice(0, 200)}`);
    }
  } catch (e) { sai.push(loi(e)); }
  if (saiCu.length) bad('LC7 lib doi cu', saiCu.join(' ; '));
  if (sai.length) bad('LC7', sai.join(' ; '));
  if (!sai.length && !saiCu.length) ok('LC7', '— có dòng: lưới VIOLATION + recheck 1 · không dòng: 0/0 · lib vắng: luật cũ · lib đời cũ: NOTE, recheck 0 không ném');
}

console.log(`\nResults: ${pass} passed, ${fail} failed (cay-doi-trong-luot)`);
rmSync(TMP, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
