// GL — làn ghim lại gặp lớp acceptance-gate cũ (hồ sơ ghim-lai-tren-lop-cu, 11/09/2026).
//
// Ca VĨNH VIỄN: suite scripts tự chạy mọi *.test.mjs qua glob, nên đây là lưới
// thường trực cho lớp «điểm chạm bộ máy của làn». Luật đo:
//  - Lớp cũ là lớp THẬT dựng trong chính lượt chạy bằng `git archive <mốc> lib
//    scripts` (trọn thư mục, không chép tệp tay). Mốc vắng (clone nông) → ca ĐỎ
//    có tên, không xanh lặng.
//  - Hàng bảng rút từ khối marker AG-ENGINE-TABLE của repin-lane.mjs — một nguồn.
//  - Mỗi ca là một phép phán chạy trên vật THẬT (phải không lỗi) rồi CÙNG phép
//    phán trên bản sao đã tiêm (phải ra đúng thông điệp ghim). Mũi tiêm khớp
//    đúng một lần, bản sao khác gốc và qua `node --check` — không thì ca đỏ.
//  - Mỗi ca in ĐÚNG MỘT dòng kết quả `PASS: GLxx …` / `FAIL: GLxx … (DO: …)`;
//    chi tiết in bằng tiền tố `    · `. Bộ chọn GLLC_CASES khớp 0 ca → exit 1.
//  - Mọi đường dẫn suy từ vị trí tệp này.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const SELF = fileURLToPath(import.meta.url);
const HERE = path.dirname(SELF);
const ROOT = path.resolve(HERE, '..', '..');
const LANE = path.join(ROOT, 'feature-loop', 'scripts', 'repin-lane.mjs');
const RECHECK = path.join(ROOT, 'scripts', 'recheck-evidence.cjs');
const LIBS = ['lib/eval-yaml.cjs', 'lib/evidence-core.cjs'];
const MOC_CU = '0b5c5b37';  // kit mang plugin.json 2.8.0 — lớp vendored đo được ở media-library 11/09
const MOC_LAI = '04069351'; // mốc 2.10.0 — evidence-core trước luật hai vế (readSignedReportFor)
const PIN = {
  laneStop: 'cây bẩn ngoài _acceptance/',
  reWrote: 'đã ghi nhưng recheck-evidence ĐỎ',
  rcGreen: 'recheck-evidence xanh',
};

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'gllc-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
let seq = 0;
const mk = (p) => { const d = path.join(TMP, `${p}${++seq}`); fs.mkdirSync(d, { recursive: true }); return d; };
const req = createRequire(import.meta.url);
const read = (f) => fs.readFileSync(f, 'utf8');

// ── lớp bộ máy ──────────────────────────────────────────────────────────
const layerCache = new Map();
function layerAt(sha) {
  if (layerCache.has(sha)) return layerCache.get(sha);
  const ok = spawnSync('git', ['-C', ROOT, 'cat-file', '-e', `${sha}^{commit}`], { encoding: 'utf8' });
  if (ok.status !== 0) throw new Error(`thieu moc ${sha} — can lich su git day du (fetch-depth: 0)`);
  const d = mk(`layer-${sha}-`);
  const tar = path.join(TMP, `layer-${sha}.tar`);
  execFileSync('git', ['-C', ROOT, 'archive', '-o', tar, sha, 'lib', 'scripts']);
  execFileSync('tar', ['-xf', tar, '-C', d]);
  for (const f of [...LIBS, 'scripts/recheck-evidence.cjs']) if (!fs.existsSync(path.join(d, f))) throw new Error(`lop ${sha} thieu ${f} sau git archive`);
  layerCache.set(sha, d);
  return d;
}
// Bản chép TRỌN lib/ + scripts/ của cây đang đo.
function copyTree() {
  const d = mk('tree-');
  fs.cpSync(path.join(ROOT, 'lib'), path.join(d, 'lib'), { recursive: true });
  fs.cpSync(path.join(ROOT, 'scripts'), path.join(d, 'scripts'), { recursive: true });
  return d;
}
function layerMixed() {
  const d = copyTree();
  const ok = spawnSync('git', ['-C', ROOT, 'cat-file', '-e', `${MOC_LAI}^{commit}`], { encoding: 'utf8' });
  if (ok.status !== 0) throw new Error(`thieu moc ${MOC_LAI} — can lich su git day du (fetch-depth: 0)`);
  const old = execFileSync('git', ['-C', ROOT, 'show', `${MOC_LAI}:lib/evidence-core.cjs`], { encoding: 'utf8' });
  const f = path.join(d, 'lib', 'evidence-core.cjs');
  if (old === read(f)) throw new Error('lop lai: evidence-core cua moc bang ban hien tai — fixture khong lai');
  fs.writeFileSync(f, old);
  return d;
}
function delExports(layer, rel, names) {
  const f = path.join(layer, rel);
  const before = read(f);
  fs.writeFileSync(f, before + '\n' + names.map(n => `delete module.exports[${JSON.stringify(n)}];`).join('\n') + '\n');
  if (read(f) === before) throw new Error(`xoa export ${names.join(',')} khong doi tep`);
  return layer;
}
function exportsOf(layer, rel) { return Object.keys(req(path.join(layer, rel))); }

// ── khối marker AG-ENGINE-TABLE (một nguồn) + phép quan hệ ─────────────
function tableRows(laneFile) {
  const m = read(laneFile).match(/\/\/ <<<AG-ENGINE-TABLE\n([\s\S]*?)\/\/ AG-ENGINE-TABLE>>>/);
  if (!m) throw new Error('khong thay khoi AG-ENGINE-TABLE trong ' + laneFile);
  const rows = [...m[1].matchAll(/\{ file: '([^']+)', name: '([^']+)', kind: '([^']+)', since: '([^']+)', why: '([^']+)' \}/g)]
    .map(x => ({ file: x[1], name: x[2], kind: x[3], since: x[4], why: x[5] }));
  const rowLines = m[1].split('\n').filter(l => /^\s*\{/.test(l)).length;
  if (!rows.length || rows.length !== rowLines) throw new Error(`hang bang khong doc duoc: ${rows.length}/${rowLines}`);
  return rows;
}
function usedNames(files) {
  const out = new Set();
  for (const f of files) {
    const s = read(f);
    for (const m of s.matchAll(/(?<![\w$-])core\.([A-Za-z_$][\w$]*)/g)) out.add(m[1]);
    const destr = /const\s*\{([^}]+)\}\s*=\s*(?:mods\[\s*'lib\/(?:eval-yaml|evidence-core)\.cjs'\s*\]|require_?\([^;]*lib[^;]*\))/g;
    for (const m of s.matchAll(destr)) for (const n of m[1].split(',')) { const k = n.split(':')[0].trim(); if (k) out.add(k); }
  }
  return out;
}
const lacksIn = (layer) => {
  const mods = Object.fromEntries(LIBS.map(r => [r, req(path.join(layer, r))]));
  return (r) => { const v = mods[r.file][r.name]; return r.kind === 'array' ? !Array.isArray(v) : typeof v !== 'function'; };
};

// ── kho git tạm: hai hồ sơ đã ghim (feat-z: eval exit 0 · feat-h: khai expected_exit 2) ──
function mkRepo() {
  const R = mk('repo-');
  const g = (...a) => execFileSync('git', ['-C', R, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  fs.mkdirSync(path.join(R, '_acceptance'), { recursive: true });
  fs.writeFileSync(path.join(R, '_acceptance', 'config.yaml'),
    'schema_version: 1\nenforcement: strict\nrecheck: strict\ngap_probe: off\nfeature_loop:\n  suite_keys:\n    - executors.test.suite\nexecutors:\n  test:\n    suite: "sh suite.sh"\n  script:\n    rang_z: "sh rang-z.sh"\n    rang_h: "sh rang-h.sh"\n');
  fs.writeFileSync(path.join(R, 'suite.sh'), '[ -n "$GLLC_MARKER" ] && : > "$GLLC_MARKER"\nexit 0\n');
  fs.writeFileSync(path.join(R, 'rang-z.sh'), 'exit 0\n');
  fs.writeFileSync(path.join(R, 'rang-h.sh'), 'exit 2\n');
  fs.writeFileSync(path.join(R, 'src.js'), 'v1\n');
  const dossiers = { 'feat-z': { key: 'rang_z', code: 0 }, 'feat-h': { key: 'rang_h', code: 2 } };
  for (const [slug, d] of Object.entries(dossiers)) {
    const ws = path.join(R, '_acceptance', slug);
    fs.mkdirSync(ws, { recursive: true });
    // status của contract không được làn lẫn recheck đọc; để `implemented` như
    // repin-fixture.mjs — tệp ca này không phải một bộ đọc trạng thái ký.
    fs.writeFileSync(path.join(ws, 'contract.md'), `---\nschema_version: 1\nfeature: ${slug}\nslug: ${slug}\nrisk_tier: T2\nsurfaces: [cli]\nstatus: implemented\napproved_by: Manh Phan\n---\n`);
    fs.writeFileSync(path.join(ws, 'evals.yaml'),
      `schema_version: 1\nslug: ${slug}\n\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.${d.key}\n${d.code ? `    expected_exit: ${d.code}\n` : ''}    expected: >\n      E1 thoát ${d.code}.\n`);
  }
  g('init', '-q'); g('add', '-A'); g('commit', '-qm', 'impl');
  const head = g('rev-parse', 'HEAD');
  for (const [slug, d] of Object.entries(dossiers)) {
    const ws = path.join(R, '_acceptance', slug);
    fs.writeFileSync(path.join(ws, 'run-log.jsonl'), JSON.stringify({ ts: '2026-09-10T00:00:00Z', kind: 'eval', run_id: `r1-${slug}-E1`, sha: head, eval: 'E1', exit_code: d.code }) + '\n');
    fs.writeFileSync(path.join(ws, 'evidence-report.md'),
      `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: PASS\nverified_commit: ${head}\nhuman_signoff: Manh 2026-09-10\n---\n\n## Evidence\n- eval: E1\n  run_id: r1-${slug}-E1\n  exit_code: ${d.code}\n  verifier: config:executors.script.${d.key}\n  verified_at: 2026-09-10\n\n## Iterations\n\nRound 1 — PASS.\n`);
  }
  g('add', '-A'); g('commit', '-qm', 'evidence');
  const files = (slug) => ['run-log.jsonl', 'evidence-report.md'].map(f => path.join(R, '_acceptance', slug, f));
  const snap = (slug) => files(slug).map(read);
  const saved = { 'feat-z': snap('feat-z'), 'feat-h': snap('feat-h') };
  const restore = (slug) => files(slug).forEach((f, i) => fs.writeFileSync(f, saved[slug][i]));
  const same = (slug) => snap(slug).every((t, i) => t === saved[slug][i]);
  return { R, g, files, snap, restore, same, report: (slug) => files(slug)[1] };
}
function runLane(lane, repo, args, env = {}) {
  const marker = path.join(TMP, `suite-${++seq}.ran`);
  const r = spawnSync(process.execPath, [lane, '--root', repo.R, '--reason', 'gllc', ...args], { encoding: 'utf8', env: { ...process.env, GLLC_MARKER: marker, ...env } });
  return { status: r.status, stdout: r.stdout || '', stderr: r.stderr || '', suiteRan: fs.existsSync(marker) };
}
const norm = (s) => s.replace(/repin-\d{8}T\d{6}Z-\d{5}/g, 'RUN').replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/g, 'TS').replace(/\d{4}-\d{2}-\d{2}/g, 'DATE');
const cut = (s, n = 240) => s.replace(/\s+/g, ' ').slice(0, n);

// ── bản sao bị tiêm ─────────────────────────────────────────────────────
// Bản sao TRỌN feature-loop/scripts (repin-lane suy RESOLVER từ vị trí nó).
function injectInto(file, before, after) {
  const s = read(file);
  const n = s.split(before).length - 1;
  if (n !== 1) throw new Error(`mui tiem khop ${n} lan (can dung 1): ${cut(before, 80)}`);
  fs.writeFileSync(file, s.replace(before, after));
  if (read(file) === s) throw new Error('ban sao bang ban goc sau khi tiem');
  const c = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (c.status !== 0) throw new Error(`ban sao loi cu phap: ${cut(c.stderr)}`);
}
function mutantLane(before, after) {
  const d = mk('fl-');
  fs.cpSync(path.join(ROOT, 'feature-loop', 'scripts'), path.join(d, 'scripts'), { recursive: true });
  const f = path.join(d, 'scripts', 'repin-lane.mjs');
  injectInto(f, before, after);
  return f;
}
function mutantFile(src, before, after) {
  const f = path.join(mk('mf-'), path.basename(src));
  fs.copyFileSync(src, f);
  injectInto(f, before, after);
  return f;
}

// ── các ca ──────────────────────────────────────────────────────────────
const CASES = [];
// judge(obj) → mảng lỗi. Vật thật → phải rỗng. Mỗi bản sao → phải chứa pin.
const ca = (id, title, real, mutants) => CASES.push({ id, title, real, mutants });

const needStop = (r, words) => {
  const p = [];
  if (r.status !== 2) p.push(`exit ${r.status} (can 2)`);
  if (/TypeError/.test(r.stderr)) p.push('TypeError tho');
  for (const w of words) if (!r.stderr.includes(w)) p.push(`stderr thieu "${w}"`);
  if (r.suiteRan) p.push('suite da chay truoc cong bo may');
  return p;
};

function judgeGL01(lane) {
  const p = [];
  const repo = mkRepo(); const old = layerAt(MOC_CU);
  const c = runLane(lane, repo, ['--ag-root', ROOT, '--slug', 'feat-z']);
  if (c.status !== 0) p.push(`doi chung duong exit ${c.status}: ${cut(c.stderr)}`);
  for (const mode of [[], ['--write']]) {
    repo.restore('feat-z');
    const r = runLane(lane, repo, ['--ag-root', old, '--slug', 'feat-z', ...mode]);
    p.push(...needStop(r, ['lib/eval-yaml.cjs', 'expectedExits', '≥ 2.11.0', '--ag-root', '--root vẫn là cây đang đo']).map(x => `[${mode.join('') || 'doc'}] ${x}`));
    if (!repo.same('feat-z')) p.push(`[${mode.join('') || 'doc'}] tep ho so bi ghi`);
  }
  fs.writeFileSync(path.join(repo.R, 'src.js'), 'v2-chua-commit\n');
  const d = runLane(lane, repo, ['--ag-root', old, '--slug', 'feat-z']);
  if (d.status !== 2 || !d.stderr.includes('expectedExits')) p.push(`[cay ban] khong ra thong diep thieu export (exit ${d.status})`);
  if (d.stderr.includes(PIN.laneStop)) p.push('[cay ban] cong bo may chay SAU kiem cay sach');
  const dc = runLane(lane, repo, ['--ag-root', ROOT, '--slug', 'feat-z']);
  if (dc.status !== 2 || !dc.stderr.includes(PIN.laneStop)) p.push(`[cay ban] doi chung duong khong ra thong diep cay ban hom nay (exit ${dc.status})`);
  repo.g('checkout', '--', 'src.js');
  return p;
}
ca('GL01', 'lớp cũ thật 0b5c5b37 → exit 2 có tên, trước kiểm cây sạch, không suite, không ghi', judgeGL01, [
  { pin: 'TypeError tho', make: () => mutantLane('if (missing.length) engineStop(', 'if (false) engineStop(') },
]);

const printedMissing = (stderr) => [...stderr.matchAll(/^ {2}- (lib\/\S+): (\S+) \(cần ≥ ([\d.]+)\)$/gm)].map(m => ({ key: `${m[1]}: ${m[2]}`, since: m[3] }));
function judgeGL02(lane) {
  const p = [];
  const rows = tableRows(lane);
  const repo = mkRepo();
  const c = runLane(lane, repo, ['--ag-root', ROOT, '--slug', 'feat-z']);
  if (c.status !== 0 || printedMissing(c.stderr).length) p.push(`doi chung duong khong xanh sach (exit ${c.status})`);
  const cmp = (tag, layer) => {
    const lacks = lacksIn(layer);
    const want = rows.filter(lacks);
    const r = runLane(lane, repo, ['--ag-root', layer, '--slug', 'feat-z']);
    const got = printedMissing(r.stderr);
    if (r.status !== 2) p.push(`[${tag}] exit ${r.status} (can 2)`);
    const wk = want.map(x => `${x.file}: ${x.name}`).sort(); const gk = got.map(x => x.key).sort();
    if (JSON.stringify(wk) !== JSON.stringify(gk)) {
      const sameFile = want.filter(x => !gk.includes(`${x.file}: ${x.name}`) && gk.some(k => k.startsWith(x.file + ':')));
      p.push(`[${tag}] tap in ra ${JSON.stringify(gk)} != ky vong ${JSON.stringify(wk)}${sameFile.length ? ' — thieu muc cung tep' : ''}`);
    }
    if (got.length !== want.length) p.push(`[${tag}] so dong ${got.length} != ${want.length}`);
    for (const x of got) { const row = rows.find(rw => `${rw.file}: ${rw.name}` === x.key); if (row && row.since !== x.since) p.push(`[${tag}] ${x.key} in ≥ ${x.since}, bang noi ≥ ${row.since}`); }
    return want.length;
  };
  if (cmp('lop 0b5c5b37', layerAt(MOC_CU)) < 2) p.push('tap ky vong cua lop cu co < 2 muc — lop khong cu nhu da do');
  const two = rows.filter(r => r.file === 'lib/evidence-core.cjs').slice(0, 2).map(r => r.name);
  cmp(`xoa ${two.join('+')}`, delExports(copyTree(), 'lib/evidence-core.cjs', two));
  return p;
}
ca('GL02', 'liệt kê TRỌN mục thiếu — đẳng thức tập tính lúc chạy, cả hai-thiếu-cùng-tệp', judgeGL02, [
  { pin: 'thieu muc cung tep', make: () => mutantLane('AG_ENGINE.filter(lacks)', 'AG_ENGINE.filter((r, i, a) => lacks(r) && !a.slice(0, i).some(q => q.file === r.file && lacks(q)))') },
]);

function matrixJudge(lane, only) {
  const p = [];
  const rows = tableRows(lane);
  const mustStop = new Set(usedNames([LANE, RECHECK]));
  const repo = mkRepo();
  const ctrl = {};
  const intact = copyTree();
  for (const slug of ['feat-z', 'feat-h']) {
    repo.restore(slug);
    const c = runLane(lane, repo, ['--ag-root', intact, '--slug', slug, '--write']);
    if (c.status !== 0 || !c.stderr.includes(PIN.rcGreen)) p.push(`doi chung ${slug} khong xanh (exit ${c.status}): ${cut(c.stderr)}`);
    ctrl[slug] = repo.snap(slug).map(norm);
  }
  let cells = 0; let total = 0; let nG = 0; let nN = 0;
  // QUAN HỆ: mỗi hàng bảng mà export có mặt ở cây đang đo phải ra (N) ở CẢ HAI hồ sơ.
  const rowsHere = rows.filter(rw => exportsOf(ROOT, rw.file).includes(rw.name));
  for (const rel of LIBS) {
    for (const name of exportsOf(ROOT, rel)) {
      total += 2;
      if (only && name !== only) continue;
      const layer = delExports(copyTree(), rel, [name]);
      for (const slug of ['feat-z', 'feat-h']) {
        cells++;
        repo.restore(slug);
        const r = runLane(lane, repo, ['--ag-root', layer, '--slug', slug, '--write']);
        const isG = r.status === 0 && r.stderr.includes(PIN.rcGreen) && repo.snap(slug).map(norm).every((t, i) => t === ctrl[slug][i]);
        const isN = r.status === 2 && r.stderr.includes(rel) && r.stderr.includes(`: ${name} (`) && repo.same(slug) && !r.suiteRan;
        const tag = `o ${rel}:${name}/${slug}`;
        if (isG) nG++; if (isN) nN++;
        const isRow = rowsHere.some(rw => rw.file === rel && rw.name === name);
        if (isRow && !isN && (isG || r.status === 0)) p.push(`${tag} la hang bang ma khong dung (N)`);
        if (!isG && !isN) {
          const why = r.stderr.includes(PIN.reWrote) ? 'ghi roi moi do' : (r.status === 0 ? 'ghi khac doi chung' : `exit ${r.status}`);
          p.push(`${tag} ra ${why}: ${cut(r.stderr, 160)}`);
        } else if (isG && mustStop.has(name) && rows.some(rw => rw.file === rel && rw.name === name)) {
          p.push(`${tag} phai dung (N) ma ra (G)`);
        }
      }
    }
  }
  if (!only && cells !== total) p.push(`so o lech: ${cells} != ${total}`);
  if (!only && nN !== rowsHere.length * 2) p.push(`so o (N) ${nN} != hang bang × 2 = ${rowsHere.length * 2}`);
  if (!only) process.stdout.write(`    · GL03: ${cells} o (${total / 2} export × 2 ho so) — G=${nG} N=${nN}\n`);
  return p;
}
function relationJudge(laneFile, recheckFile) {
  const rows = tableRows(laneFile);
  const names = new Set(rows.map(r => r.name));
  return [...usedNames([laneFile, recheckFile])].filter(n => !names.has(n)).map(n => `quan he: ${n} khong co hang trong AG-ENGINE-TABLE`);
}
ca('GL03', 'ma trận xoá-export × hai hồ sơ (G so byte · N có tên) + quan hệ tên dùng ⊆ bảng', () => [...relationJudge(LANE, RECHECK), ...matrixJudge(LANE)], [
  { pin: 'ghi roi moi do', make: () => mutantLane("  { file: 'lib/evidence-core.cjs', name: 'checkRepinEvals', kind: 'function', since: '2.9.0', why: 'recheck gọi' },\n", ''), judge: (m) => matrixJudge(m, 'checkRepinEvals') },
  { pin: 'fakeX', make: () => mutantFile(RECHECK, 'if (!core.determineEnforce(payload)) process.exit(0);', 'if (!core.determineEnforce(payload) && !core.fakeX) process.exit(0);'), judge: (m) => relationJudge(LANE, m) },
]);

function judgeGL04(lane) {
  const p = [];
  const repo = mkRepo();
  const c = runLane(lane, repo, ['--ag-root', ROOT, '--slug', 'feat-h', '--write']);
  const last = repo.snap('feat-h')[0].trim().split('\n').pop();
  if (c.status !== 0 || !c.stderr.includes(PIN.rcGreen)) p.push(`doi chung duong khong xanh (exit ${c.status}): ${cut(c.stderr)}`);
  else if (!/"evals_exit":\{"E1":2\}/.test(last)) p.push(`doi chung: evals_exit khong giu ma 2: ${cut(last)}`);
  repo.restore('feat-h');
  const r = runLane(lane, repo, ['--ag-root', layerMixed(), '--slug', 'feat-h', '--write']);
  if (r.stderr.includes(PIN.reWrote)) p.push('ghi roi moi do');
  p.push(...needStop(r, ['lib/evidence-core.cjs', 'readSignedReportFor', '2.11.0']));
  if (!repo.same('feat-h')) p.push('tep ho so bi ghi');
  return p;
}
ca('GL04', 'lớp LAI (evidence-core 04069351) → dừng TRƯỚC khi ghi, gọi tên readSignedReportFor', judgeGL04, [
  { pin: 'ghi roi moi do', make: () => mutantLane("  { file: 'lib/evidence-core.cjs', name: 'readSignedReportFor', kind: 'function', since: '2.11.0', why: 'sàn ngữ nghĩa bên đọc' },\n", '') },
]);

function judgeGL05(lane) {
  const p = [];
  const repo = mkRepo();
  const layer = copyTree();
  const c = runLane(lane, repo, ['--ag-root', layer, '--slug', 'feat-z']);
  if (c.status !== 0) p.push(`doi chung duong exit ${c.status}: ${cut(c.stderr)}`);
  const f = path.join(layer, 'lib', 'eval-yaml.cjs');
  fs.writeFileSync(f, read(f) + '\n)(;\n');
  if (spawnSync(process.execPath, ['--check', f]).status === 0) p.push('ban tiem khong that su hong');
  const r = runLane(lane, repo, ['--ag-root', layer, '--slug', 'feat-z']);
  if (r.status !== 2) p.push(`exit ${r.status} (can 2)`);
  if (!r.stderr.includes('không nạp được lib/eval-yaml.cjs')) p.push('stderr thieu "không nạp được lib/eval-yaml.cjs"');
  if (/\n\s+at /.test(r.stderr)) p.push('nap khong boc (stack tho)');
  if (!repo.same('feat-z')) p.push('tep ho so bi ghi');
  return p;
}
ca('GL05', 'tệp có mà nạp lỗi → exit 2 «không nạp được», không stack', judgeGL05, [
  { pin: 'nap khong boc', make: () => mutantLane('try { return require_(path.join(agRoot, rel)); } catch (e) {', 'return require_(path.join(agRoot, rel)); {') },
]);

function fakeHome(layer, version) {
  const h = mk('home-');
  fs.cpSync(layer, path.join(h, '.claude', 'plugins', 'cache', 'mkt', 'acceptance-gate', version), { recursive: true });
  return h;
}
function judgeGL06(lane) {
  const p = [];
  const repo = mkRepo();
  const c = runLane(lane, repo, ['--slug', 'feat-z'], { HOME: fakeHome(copyTree(), '9.9.9') });
  if (c.status !== 0) p.push(`doi chung duong exit ${c.status}: ${cut(c.stderr)}`);
  const r = runLane(lane, repo, ['--slug', 'feat-z'], { HOME: fakeHome(layerAt(MOC_CU), '2.8.0') });
  p.push(...needStop(r, ['lib/eval-yaml.cjs', 'expectedExits', '≥ 2.11.0', '--ag-root']));
  if (!r.stderr.includes('plugin cache') || !r.stderr.includes('cập nhật plugin')) p.push('khong noi nguon');
  return p;
}
ca('GL06', 'không --ag-root, plugin cache chỉ có lớp cũ → nói nguồn + cập nhật plugin', judgeGL06, [
  { pin: 'khong noi nguon', make: () => mutantLane("'nguồn bộ máy: plugin cache (resolve-plugin.mjs chọn, không có --ag-root) — cập nhật plugin: claude plugin update acceptance-gate@acceptance-gate-kit'", "'nguồn bộ máy: ?'") },
]);

function judgeGL07(lane) {
  const p = [];
  const repo = mkRepo(); const old = layerAt(MOC_CU);
  const r1 = runLane(lane, repo, ['--ag-root', old, '--slug', 'feat-z']);
  if (r1.status !== 2) p.push(`luot dung exit ${r1.status} (can 2)`);
  const line = r1.stderr.split('\n').find(l => l.startsWith('lệnh dò: '));
  if (!line) return [...p, 'khong co lenh do'];
  const home = fakeHome(copyTree(), '9.9.9');
  const r2 = spawnSync('bash', ['-c', line.slice('lệnh dò: '.length)], { cwd: repo.R, encoding: 'utf8', env: { ...process.env, HOME: home } });
  const found = (r2.stdout || '').trim().split('\n').pop();
  if (r2.status !== 0 || !found || !fs.existsSync(found)) return [...p, `lenh do khong chay duoc tu --root (exit ${r2.status}): ${cut(r2.stderr || '')}`];
  const r3 = runLane(lane, repo, ['--ag-root', found, '--slug', 'feat-z', '--write']);
  if (r3.status !== 0) p.push(`lan --write theo loi di tiep exit ${r3.status}: ${cut(r3.stderr, 160)}`);
  const r4 = spawnSync(process.execPath, [path.join(old, 'scripts', 'recheck-evidence.cjs'), repo.report('feat-z')], { encoding: 'utf8' });
  if (r4.status !== 0) p.push(`ben doc cu do (exit ${r4.status}): ${cut(r4.stderr, 400)}`);
  return p;
}
ca('GL07', 'lối đi tiếp rút từ stderr: lệnh dò chạy từ --root → --ag-root in ra → bên đọc cũ nhận', judgeGL07, [
  { pin: 'lenh do khong chay duoc tu --root', make: () => mutantLane('shq(RESOLVER)', "'feature-loop/scripts/resolve-plugin.mjs'") },
  { pin: 'recorded no evals_exit', make: () => mutantLane(', evals_exit: evalsExit })', ' })') },
]);

const RESULT_RE = /^\s*(PASS|FAIL): GL\d\d/;
function judgeGL08(testFile) {
  const p = [];
  const r = spawnSync(process.execPath, [testFile], { encoding: 'utf8', env: { ...process.env, GLLC_CASES: 'GL99' } });
  if (r.status === 0 || !(r.stdout || '').includes('GLLC_CASES khop 0 ca')) p.push(`bo loc rong ma xanh (exit ${r.status})`);
  if (testFile === SELF) {
    const c = spawnSync(process.execPath, [testFile], { encoding: 'utf8', env: { ...process.env, GLLC_CASES: 'GL01' } });
    const res = (c.stdout || '').split('\n').filter(l => RESULT_RE.test(l));
    if (c.status !== 0 || res.length !== 1 || !/GL01/.test(res[0])) p.push(`doi chung GL01: exit ${c.status}, ${res.length} dong ket qua`);
  }
  return p;
}
ca('GL08', 'bộ chọn ca sống: GL99 khớp 0 ca → exit khác 0; GL01 → đúng một dòng kết quả', judgeGL08, [
  { pin: 'bo loc rong ma xanh', make: () => mutantFile(SELF, 'if (!chosen' + '.length) {', 'if (false) {') },
]);

// ── chạy ────────────────────────────────────────────────────────────────
const want = (process.env.GLLC_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const chosen = want.length ? CASES.filter(c => want.includes(c.id)) : CASES;
if (!chosen.length) { console.log(`GLLC_CASES khop 0 ca: ${want.join(',')}`); process.exit(1); }
let passed = 0; let failed = 0;
for (const c of chosen) {
  const t0 = Date.now();
  let errs;
  try {
    const obj = c.id === 'GL08' ? SELF : LANE;
    errs = c.real(obj).map(e => `vat that: ${e}`);
    for (const m of c.mutants) {
      let got;
      try { const target = m.make(); got = (m.judge || c.real)(target); } catch (e) { got = null; errs.push(`chieu do "${m.pin}" khong dung duoc: ${e.message}`); }
      if (got === null) continue;
      if (got.some(e => e.includes(m.pin))) process.stdout.write(`    · ${c.id} chieu do: ban sao do, ghim "${m.pin}"\n`);
      else errs.push(`chieu do khong do — ban sao khong ra "${m.pin}" (ra: ${cut(got.join(' | ') || 'khong loi nao', 200)})`);
    }
  } catch (e) { errs = [`ha tang: ${e.message}`]; }
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  if (!errs.length) { passed++; console.log(`  PASS: ${c.id} ${c.title} (${dt}s)`); } else { failed++; console.log(`  FAIL: ${c.id} ${c.title} (DO: ${errs.join(' | ')})`); }
}
console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
