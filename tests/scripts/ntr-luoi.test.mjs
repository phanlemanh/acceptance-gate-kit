// ntr-luoi.test.mjs — hồ sơ nhan-trang-thai-va-reality, hai bên đọc của lưới:
// `scripts/pre-merge-check.sh` và `scripts/recheck-evidence.cjs <báo cáo>`.
// AC-8 (E8): ký trên cạnh gãy có tên. AC-10 (E10): hồ sơ đã chấm bởi thực tế.
// Sổ chạy do bộ chấm THẬT sinh (harness tests/workflows với tác tử giả). Dòng sổ ký trên cạnh
// gãy do khuôn RÚT từ khối CANH-GAY-REVISIT-LINE của commands/signoff.md (bên viết) — không gõ
// tiền tố decision trong ca. Kho fixture là kho git do code sinh; đường suy từ vị trí tệp này.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { runWorkflow } from '../workflows/harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const TMP = mkdtempSync(path.join(tmpdir(), 'ntr-luoi-'));
const require = createRequire(import.meta.url);
let pass = 0; let fail = 0;
const ok = (name, msg = '') => { pass += 1; console.log(`PASS: ${name} ${msg}`.trimEnd() + ' '); };
const bad = (name, msg) => { fail += 1; console.log(`FAIL: ${name} — ${msg}`); };
const loi = e => String((e && (e.stderr || e.message)) || e).split('\n').slice(0, 3).join(' | ');
const want = name => !process.env.NTR_CASES || process.env.NTR_CASES.split(',').includes(name);

// ── khuôn bên viết (signoff.md) ─────────────────────────────────────────────
const khuonKy = (signoffText) => {
  const m = String(signoffText).match(/<!-- <<<CANH-GAY-REVISIT-LINE -->\n\s*([^\n]+)\n\s*<!-- CANH-GAY-REVISIT-LINE>>> -->/);
  if (!m) throw new Error('khong rut duoc khoi CANH-GAY-REVISIT-LINE tu commands/signoff.md');
  return m[1].trim();
};
const SIGNOFF = readFileSync(path.join(KIT, 'commands', 'signoff.md'), 'utf8');
let n = 0;
const dongKy = (khuon, { nhan, E, AC }) => `{"id":"d-20260921T100000Z-${++n}",` + khuon
  .replace('<ISO>', '2026-09-21T10:00:00Z').replace('<nhãn>', nhan).replace('<E>', E)
  .replace(/<AC>/g, AC).replace('<giá>', 'AC ấy ship không có bằng chứng máy') + '}';

// ── kho fixture: sổ chạy do bộ chấm thật sinh ───────────────────────────────
const EV = [
  { id: 'E1', criterion: 'AC-1', executor: 'script', cmd: 'cmd-1', ref: 'config:executors.script.e1', expected: 'x' },
  { id: 'E2', criterion: 'AC-2', executor: 'script', cmd: 'cmd-2', ref: 'config:executors.script.e2', expected: 'x' },
  { id: 'E3', criterion: 'AC-3', executor: 'script', cmd: 'cmd-3', ref: 'config:executors.script.e3', expected: 'x' },
];
const TRA = {
  lanh: { 'cmd-2': { exitCode: 127, outputTail: '', runId: '', cannotRun: false }, 'cmd-3': { exitCode: 1, outputTail: '', runId: '', cannotRun: false, killedByTool: true } },
  reject: { 'cmd-2': { exitCode: 1, outputTail: 'fail', runId: '', cannotRun: false } },
};
async function kho({ tra = TRA.lanh, soDong = [], status = 'signed-off', chuKy = 'M 2026-09-21' } = {}) {
  const r = mkdtempSync(path.join(TMP, 'k-'));
  const g = (...a) => execFileSync('git', ['-C', r, ...a], { encoding: 'utf8' }).trim();
  g('init', '-q', '-b', 'main'); g('config', 'user.email', 'x@y.z'); g('config', 'user.name', 'x');
  const d = path.join(r, '_acceptance', 's'); mkdirSync(d, { recursive: true });
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), 'schema_version: 1\nexecutors:\n  script:\n    e1: "true"\n    e2: "true"\n    e3: "true"\n');
  writeFileSync(path.join(r, 'ma.js'), 'v1\n');
  writeFileSync(path.join(d, 'contract.md'), `---\nschema_version: 1\nslug: s\nfeature: f\nowner: x@y.z\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${status}\napproved_by: M\napproved_at: 2026-09-01T00:00:00Z\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n- AC-2: Given a, When b, Then c.\n- AC-3: Given a, When b, Then c.\n\n## Out of scope\n\n- x\n- y\n`);
  writeFileSync(path.join(d, 'evals.yaml'), 'schema_version: 1\nfeature_slug: s\nevals:\n' + EV.map(e => `  - id: ${e.id}\n    criterion: ${e.criterion}\n    executor: script\n    cmd: ${e.ref}\n    expected: x\n`).join(''));
  g('add', '-A'); g('commit', '-qm', 'nen'); const sha = g('rev-parse', 'HEAD');
  const res = (await runWorkflow(WF, { slug: 's', round: 1, riskTier: 'T2', evals: EV, suiteCommands: [], diffBase: 'main', repoRoot: r, personasPath: '/p', templatePath: '/t', invokedAt: '2026-09-21T10:00:00Z', invokedSha: sha }, c => {
    const l = c.label;
    if (l.startsWith('machine:')) { const cmd = l.slice(8); return tra[cmd] || { exitCode: 0, outputTail: 'ok', runId: `rid-${cmd}`, cannotRun: false }; }
    if (l.startsWith('review:')) return { findings: [] };
    if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: sha };
    if (l === 'synthesize:report') return { report: '# r', findings: '# f' };
    return null;
  })).result;
  writeFileSync(path.join(d, 'run-log.jsonl'), res.runLog.join('\n') + '\n');
  const rid = JSON.parse(res.runLog.find(x => x.includes('"evalId":"E1"'))).run_id;
  writeFileSync(path.join(d, 'evidence-report.md'), `---\nschema_version: 2\nfeature_slug: s\nverdict: ${res.verdict}\nreason: xem so chay\nverified_by: fresh-context verification subagent\nenforcement_mode: strict\nbypass_used: false\nverified_commit: ${sha}\nhuman_signoff: ${chuKy}\n---\n\n# r\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| E1 | AC-1 | script | PASS |\n| E2 | AC-2 | script | ${res.verdict} |\n| E3 | AC-3 | script | ${res.verdict} |\n\n## Evidence\n\n- eval: E1\n  run_id: ${rid}\n  exit_code: 0\n  verifier: config:executors.script.e1\n  verified_at: 2026-09-21T10:00:00Z\n\n## Known limits\n\n## Ngoài hợp đồng\n`);
  if (soDong.length) writeFileSync(path.join(d, 'decisions.jsonl'), soDong.join('\n') + '\n');
  g('add', '-A'); g('commit', '-qm', 'ho so');
  return { r, d, sha, g, verdict: res.verdict };
}
const luoi = (r, kit = KIT) => { const p = spawnSync('bash', [path.join(kit, 'scripts', 'pre-merge-check.sh'), r, '--no-t1-escape'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); return { ma: p.status, out: `${p.stdout}${p.stderr}` }; };
const kiemLai = (d, kit = KIT) => { const p = spawnSync(process.execPath, [path.join(kit, 'scripts', 'recheck-evidence.cjs'), path.join(d, 'evidence-report.md')], { encoding: 'utf8' }); return { ma: p.status, out: `${p.stdout}${p.stderr}` }; };
const NHAN = require(path.join(KIT, 'lib', 'nhan-canh-gay.cjs')).NHAN;
const soLanh = khuon => [dongKy(khuon, { nhan: NHAN.MU, E: 'E2', AC: 'AC-2' }), dongKy(khuon, { nhan: NHAN.MU, E: 'E3', AC: 'AC-3' })];
const banSaoKit = () => { const s = mkdtempSync(path.join(TMP, 'sao-')); for (const x of ['scripts', 'lib', 'commands', 'skills', 'feature-loop']) cpSync(path.join(KIT, x), path.join(s, x), { recursive: true }); return s; };

// ── AC-8 ────────────────────────────────────────────────────────────────────
if (want('NL-AC8-lanh') || want('NL-AC8-thieu') || want('NL-AC8-reject') || want('NL-AC8-mot-nguon')) {
  let K; try { K = khuonKy(SIGNOFF); } catch (e) { for (const c of ['NL-AC8-lanh', 'NL-AC8-thieu', 'NL-AC8-reject', 'NL-AC8-mot-nguon']) if (want(c)) bad(c, loi(e)); }
  if (K) {
    if (want('NL-AC8-lanh')) {
      try {
        const k = await kho({ soDong: soLanh(K) });
        const a = luoi(k.r); const b = kiemLai(k.d);
        if (k.verdict !== 'BLOCKED') bad('NL-AC8-lanh', `bo cham tra ${k.verdict}`);
        else if (a.ma !== 0 || !/ký trên cạnh gãy có tên — E2 E3/.test(a.out)) bad('NL-AC8-lanh', `pre-merge thoat ${a.ma}: ${a.out.split('\n').filter(l => /\[s\]/.test(l)).join(' | ')}`);
        else if (b.ma !== 0 || !/ký trên cạnh gãy có tên: E2 E3/.test(b.out)) bad('NL-AC8-lanh', `recheck thoat ${b.ma}: ${b.out}`);
        else ok('NL-AC8-lanh', '— BLOCKED (exit 127 + tool-kill) + hai dòng sổ rút khuôn signoff.md: pre-merge 0 và recheck 0, cùng NOTE nêu E2 E3');
      } catch (e) { bad('NL-AC8-lanh', loi(e)); }
    }
    if (want('NL-AC8-thieu')) {
      try {
        const k = await kho({ soDong: soLanh(K).slice(0, 1) });
        const a = luoi(k.r); const b = kiemLai(k.d);
        const nêu = o => /E3/.test(o) && !/thiếu dòng sổ revisit cho E2/.test(o);
        if (a.ma === 0 || !/VIOLATION \[s\]: ký trên cạnh gãy thiếu dòng sổ revisit cho E3/.test(a.out)) bad('NL-AC8-thieu', `pre-merge thoat ${a.ma}`);
        else if (b.ma === 0 || !/thiếu dòng sổ revisit cho E3/.test(b.out)) bad('NL-AC8-thieu', `recheck thoat ${b.ma}: ${b.out}`);
        else if (!nêu(a.out) || !nêu(b.out)) bad('NL-AC8-thieu', 'thong diep neu sai eval');
        else ok('NL-AC8-thieu', '— thiếu dòng của E3: cả hai bên đọc đỏ, gọi E3, không gọi E2');
      } catch (e) { bad('NL-AC8-thieu', loi(e)); }
    }
    if (want('NL-AC8-reject')) {
      try {
        const k = await kho({ tra: TRA.reject, soDong: [dongKy(K, { nhan: NHAN.MU, E: 'E2', AC: 'AC-2' })] });
        const a = luoi(k.r);
        if (k.verdict !== 'REJECT') bad('NL-AC8-reject', `bo cham tra ${k.verdict}`);
        else if (a.ma === 0 || !/VIOLATION \[s\]: verdict=REJECT \(must be PASS to merge\)/.test(a.out)) bad('NL-AC8-reject', `pre-merge thoat ${a.ma}`);
        else ok('NL-AC8-reject', '— REJECT có chữ ký + dòng sổ giả: pre-merge vẫn VIOLATION verdict=REJECT như trước vòng');
      } catch (e) { bad('NL-AC8-reject', loi(e)); }
    }
    if (want('NL-AC8-mot-nguon')) {
      try {
        const sai = [];
        // (a) vị từ trong lib luôn khoá → cả hai bên đọc (của bản sao) đỏ ở ca lành.
        const s = banSaoKit(); const f = path.join(s, 'lib', 'nhan-canh-gay.cjs');
        const src = readFileSync(f, 'utf8'); const KIM = "  else out.trangThai = 'mo';\n";
        if (src.split(KIM).length !== 2) throw new Error('kim vi tu khong khop dung 1 lan');
        writeFileSync(f, src.replace(KIM, "  else out.trangThai = 'khoa';\n"));
        const k = await kho({ soDong: soLanh(K) });
        if (luoi(k.r, s).ma === 0) sai.push('(a) vi tu luon khoa ma pre-merge ban sao van 0');
        if (kiemLai(k.d, s).ma === 0) sai.push('(a) vi tu luon khoa ma recheck ban sao van 0');
        if (luoi(k.r).ma !== 0 || kiemLai(k.d).ma !== 0) sai.push('(a) doi chung: ban lanh tren cung kho khong xanh');
        // (b) bên viết đổi tiền tố → dòng sinh từ khuôn đã đổi → hai bên đọc (thật) đỏ nêu E2.
        const Kdoi = K.replace('<nhãn> — <E> (<AC>)', '<nhãn> - <E> (<AC>)');
        if (Kdoi === K) throw new Error('mutant ben viet khong doi byte');
        const k2 = await kho({ soDong: soLanh(Kdoi) });
        const a2 = luoi(k2.r); const b2 = kiemLai(k2.d);
        if (a2.ma === 0 || !/E2/.test(a2.out)) sai.push('(b) doi tien to ben viet ma pre-merge van 0');
        if (b2.ma === 0 || !/E2/.test(b2.out)) sai.push('(b) doi tien to ben viet ma recheck van 0');
        // (c) chuỗi máy-đọc trong lib khớp bộ chấm; mutant bộ chấm → lệch có tên.
        const lib = require(path.join(KIT, 'lib', 'nhan-canh-gay.cjs'));
        const av = readFileSync(WF, 'utf8');
        if (lib.soKhopEngine(av).length) sai.push(`(c) lib lech bo cham: ${lib.soKhopEngine(av).join('; ')}`);
        if (!lib.soKhopEngine(av.replace("127: 'lenh/script", "126: 'lenh/script")).some(x => x.includes('mã hạ tầng lệch'))) sai.push('(c) mutant ma 127→126 khong bi goi ten');
        if (sai.length) bad('NL-AC8-mot-nguon', sai.join(' ; '));
        else ok('NL-AC8-mot-nguon', '— vị từ một nguồn (mutant lib → hai bên cùng đỏ) · bên viết đổi tiền tố → hai bên đỏ nêu E2 · chuỗi lib khớp bộ chấm, mutant mã bị gọi tên');
      } catch (e) { bad('NL-AC8-mot-nguon', loi(e)); }
    }
  }
}

// ── AC-10 ───────────────────────────────────────────────────────────────────
// Dòng quan sát do khuôn RÚT từ khối THUC-TE-LINE của commands/observed.md (bên viết).
const OBSERVED = readFileSync(path.join(KIT, 'commands', 'observed.md'), 'utf8');
const khuonTT = (t) => {
  const m = String(t).match(/<!-- <<<THUC-TE-LINE -->\n\s*([^\n]+)\n\s*<!-- THUC-TE-LINE>>> -->/);
  if (!m) throw new Error('khong rut duoc khoi THUC-TE-LINE tu commands/observed.md');
  return m[1].trim();
};
const ID_TT = 'd-20260921T110000Z-7';
const dongTT = (khuon, sha) => `{"id":"${ID_TT}",` + khuon.replace('<ISO ngày quan sát>', '2026-09-21T09:00:00Z').replace('<tên>', 'Manh')
  .replace('<40-hex bản dựng đang phục vụ prod>', sha).replace('<một câu người nói>', 'production dựng từ bản này') + '}';
async function khoTT({ mau = (k, sha) => [dongTT(k, sha)], status = 'da-cham-boi-thuc-te', sau = null } = {}) {
  const K = khuonTT(OBSERVED);
  const k = await kho({ status, chuKy: '', soDong: [] });
  writeFileSync(path.join(k.d, 'decisions.jsonl'), mau(K, k.sha).join('\n') + '\n');
  k.g('add', '-A'); k.g('commit', '-qm', 'observed: s — Manh');
  if (sau) { sau(k); k.g('add', '-A'); k.g('commit', '-qm', 'sau quan sat'); }
  return k;
}
const MA_TT = [
  ['lanh', {}, { pm: [0, /NOTE \[s\]: đã chấm bởi thực tế — chạy trên prod từ bản dựng [0-9a-f]{7} \(quan sát 2026-09-21, Manh\)/], rc: [0, /đã chấm bởi thực tế: [0-9a-f]{7} 2026-09-21 Manh/] }],
  ['thieu', { mau: (k, sha) => [dongTT(k, sha).replace(/"build_sha":"[0-9a-f]{40}",/, '')] }, { pm: [1, /VIOLATION \[s\]: dòng quan sát thiếu vế build_sha/], rc: [1, /THIEU build_sha/] }],
  ['sha-la', { mau: k => [dongTT(k, 'e'.repeat(40))] }, { pm: [1, /VIOLATION \[s\]: bản dựng không có trong kho — e{40}/], rc: [1, /LA e{40}/] }],
  ['khoa', { sau: k => writeFileSync(path.join(k.d, 'evals.yaml'), readFileSync(path.join(k.d, 'evals.yaml'), 'utf8') + '# sua thuoc\n') }, { pm: [1, /VIOLATION \[s\]: khoá việc thước — .*evals\.yaml/], rc: [1, /KHOA .*evals\.yaml/] }],
  ['mo-lai', { mau: (k, sha) => [dongTT(k, sha), JSON.stringify({ id: 'd-20260921T120000Z-8', type: 'revisit', stage: 'gate2', at: '2026-09-21T12:00:00Z', decision: 'prod đỏ — mở lại', supersedes: ID_TT })] }, { pm: [1, /VIOLATION \[s\]: verdict=BLOCKED \(must be PASS to merge\)/], rc: [0, null] }],
];
for (const [ten, opt, mong] of MA_TT) {
  const tenCa = `NL-AC10-${ten}`;
  if (!want(tenCa)) continue;
  try {
    const k = await khoTT(opt);
    const a = luoi(k.r); const b = kiemLai(k.d);
    const sai = [];
    const hop = (x, [ma, re], ben) => { if ((ma === 0) !== (x.ma === 0)) sai.push(`${ben} thoat ${x.ma}, mong ${ma === 0 ? '0' : 'khac 0'}`); if (re && !re.test(x.out)) sai.push(`${ben} thieu thong diep ${re}`); };
    hop(a, mong.pm, 'pre-merge'); hop(b, mong.rc, 'recheck');
    if (ten === 'mo-lai' && /đã chấm bởi thực tế/.test(b.out)) sai.push('recheck van NOTE da cham sau khi mo lai');
    if (ten === 'lanh') {
      // Đối chứng dương: cùng kho khi status approved → luật chưa-arm như trước vòng.
      const dc = await khoTT({ status: 'approved' });
      const x = luoi(dc.r);
      if (x.ma === 0 || !/VIOLATION \[s\]: hồ sơ có bằng chứng nhưng status chưa arm cổng/.test(x.out)) sai.push('doi chung approved khong ra VIOLATION chua arm');
      // Một nguồn: bản sao làm thucTe luôn null → cả hai bên đọc mất NOTE ở ca lành.
      const sao = banSaoKit(); const f = path.join(sao, 'lib', 'workspace-record.cjs');
      const src = readFileSync(f, 'utf8'); const KIM = "  const tt = [...dong].reverse().find(e => e.type === 'thuc-te');\n";
      if (src.split(KIM).length !== 2) throw new Error('kim thucTe khong khop dung 1 lan');
      writeFileSync(f, src.replace(KIM, KIM + '  if (tt) return null;\n'));
      if (luoi(k.r, sao).ma === 0) sai.push('mot nguon: thucTe luon null ma pre-merge ban sao van 0');
      if (/đã chấm bởi thực tế/.test(kiemLai(k.d, sao).out)) sai.push('mot nguon: thucTe luon null ma recheck ban sao van NOTE');
    }
    if (sai.length) bad(tenCa, sai.join(' ; '));
    else ok(tenCa, `— pre-merge ${a.ma} · recheck ${b.ma}, đúng thông điệp ghim${ten === 'lanh' ? '; đối chứng approved chưa arm; một nguồn: thucTe hỏng thì cả hai bên đổi' : ''}`);
  } catch (e) { bad(tenCa, loi(e)); }
}


rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (ntr-luoi)`);
process.exit(fail ? 1 : 0);
