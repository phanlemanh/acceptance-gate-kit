// finding-line-bo-doc.test.mjs — T5 (khoi-tim-loi-tra-phi-theo-vat, AC-6, vế hai):
// thêm một LOẠI DÒNG vào `run-log.jsonl` là đổi vật mà nhiều bên đang đọc. Vế này
// đo bằng CHÍNH các bộ đọc đang chạy, không bằng câu «đã kiểm bằng mắt» trong design:
//   · round-tally-read.mjs — lọc theo `kind`
//   · loop-health.mjs      — đếm dòng repin
//   · recheck-evidence.cjs — đối chiếu run_id trong bản chấm với sổ
// Luật: sổ CÓ dòng `kind: finding` phải cho KẾT QUẢ Y HỆT sổ không có nó, và không bộ
// đọc nào ném lỗi. Đối chứng dương đi kèm: cùng bộ đọc vẫn ĐỎ trên một sổ hỏng thật.
//
// Dòng finding do CODE SINH trong chính lần chạy — rút khuôn `FINDING-LINE` từ bên
// VIẾT (acceptance-verify.js) rồi dựng dòng bằng đúng danh sách khoá của nó; gõ tay
// một dòng mẫu ở đây là dựng fixture theo khuôn bên đọc, đúng lớp lỗi kit hay dẫm.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
let pass = 0, fail = 0;
const ok = m => { console.log(`  PASS: ${m}`); pass += 1; };
const bad = (m, d) => { console.log(`  FAIL: ${m}${d ? ` (${d})` : ''}`); fail += 1; };
const T = mkdtempSync(path.join(tmpdir(), 'finding-line-'));

// ── khuôn dòng finding RÚT TỪ BÊN VIẾT ──────────────────────────────────────
const WF = path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const wfSrc = readFileSync(WF, 'utf8');
const KHOI = (() => {
  const a = wfSrc.indexOf('<<<FINDING-LINE');
  const b = wfSrc.indexOf('FINDING-LINE>>>');
  if (a === -1 || b === -1 || b <= a) throw new Error('khong rut duoc khoi marker FINDING-LINE tu acceptance-verify.js');
  return wfSrc.slice(a, b);
})();
// Bên viết đặt nhiều khoá trên MỘT dòng, nên rút theo dấu hai chấm chứ không theo
// đầu dòng. `sha` là khoá điều kiện (chỉ có khi invokedSha khác rỗng) — vẫn nằm trong
// danh sách vì fixture dưới đây dựng đủ trường.
const KHOA = [...new Set([...KHOI.matchAll(/(?:^|[{,]\s*)([a-zA-Z][a-zA-Z0-9]*):/gm)].map(m => m[1]))];
if (!KHOA.includes('kind') || !KHOA.includes('khongBacBo')) {
  console.log('  FAIL: khuon FINDING-LINE khong con truong kind/khongBacBo — ben viet doi khuon');
  process.exit(1);
}
const giaTri = k =>
  k === 'kind' ? 'finding'
  : k === 'ts' ? '2026-09-14T00:00:00Z'
  : k === 'round' ? 1
  : k === 'file' ? 'src/a.js'
  : k === 'title' ? 'mot loi ngoai hop dong'
  : k === 'severity' ? 'high'
  : k === 'source' ? 'bugs'
  : k === 'khongBacBo' ? true
  : ['inContract', 'unverified', 'unclassified'].includes(k) ? false
  : '';
const dongFinding = (over = {}) =>
  JSON.stringify({ ...Object.fromEntries(KHOA.map(k => [k, giaTri(k)])), ...over });

const TALLY = JSON.stringify({ ts: '2026-09-14T00:00:00Z', round: 1, kind: 'round-tally', verdict: 'PASS', expected: 1, returned: 1, blocked: 0 });
const EVAL = JSON.stringify({ ts: '2026-09-14T00:00:00Z', round: 1, evalId: 'E1', run_id: 'demo-E1-r1', exit_code: 0, cmd: 'echo x', sha: 'a'.repeat(40) });

function so(khong, co, ten) {
  if (khong === co) ok(`${ten}: so CO dong finding cho ket qua Y HET so khong co`);
  else bad(`${ten}: dong finding LAM DOI ket qua bo doc`, `khong-co: ${String(khong).slice(0, 120)} · co: ${String(co).slice(0, 120)}`);
}

// ── 1. round-tally-read ─────────────────────────────────────────────────────
{
  const a = path.join(T, 'a.jsonl'), b = path.join(T, 'b.jsonl');
  writeFileSync(a, `${EVAL}\n${TALLY}\n`);
  writeFileSync(b, `${EVAL}\n${dongFinding()}\n${dongFinding({ title: 'loi thu hai', file: 'src/b.js' })}\n${TALLY}\n`);
  const chay = f => { try { return execFileSync(process.execPath, [path.join(ROOT, 'feature-loop', 'scripts', 'round-tally-read.mjs'), '--run-log', f], { encoding: 'utf8' }); } catch (e) { return `NEM LOI: ${String(e.stderr || e.message).slice(0, 100)}`; } };
  const ra = chay(a), rb = chay(b);
  so(ra.replace(/"[^"]*a\.jsonl"/g, '"F"'), rb.replace(/"[^"]*b\.jsonl"/g, '"F"'), 'round-tally-read');
  // Đối chứng dương: cùng bộ đọc PHẢI kêu khi sổ có dòng tally hỏng thật.
  const c = path.join(T, 'c.jsonl');
  writeFileSync(c, `${EVAL}\n${dongFinding()}\n{"kind":"round-tally","verdict":"PASS"}\n`);
  // Bộ đọc kêu bằng MÃ THOÁT + stderr (không phải stdout): `chay` gói cả hai vào chuỗi.
  const rc = chay(c);
  if (/NEM LOI|sai khuôn|malformed/i.test(rc) && !/"malformed": \[\]/.test(rc)) ok('round-tally-read doi chung duong: dong tally HONG van bi keu');
  else bad('round-tally-read doi chung duong: dong tally hong KHONG bi keu', rc.slice(0, 160));
}

// ── 2. loop-health ──────────────────────────────────────────────────────────
{
  const mk = (ten, themFinding) => {
    const root = path.join(T, ten);
    mkdirSync(path.join(root, '_acceptance', 'demo'), { recursive: true });
    writeFileSync(path.join(root, '_acceptance', 'demo', 'contract.md'), '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: verified\n---\n');
    writeFileSync(path.join(root, '_acceptance', 'demo', 'run-log.jsonl'),
      `${EVAL}\n${themFinding ? dongFinding() + '\n' : ''}${TALLY}\n`);
    return root;
  };
  const chay = r => { try { return execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'loop-health.mjs'), '--root', r], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { return `NEM LOI: ${String(e.stderr || e.message).slice(0, 140)}`; } };
  const ra = chay(mk('lh-khong', false)), rb = chay(mk('lh-co', true));
  const chuanHoa = s => String(s).replace(/lh-(khong|co)/g, 'R');
  so(chuanHoa(ra), chuanHoa(rb), 'loop-health');
}

// ── 3. recheck-evidence ─────────────────────────────────────────────────────
{
  const mk = (ten, themFinding) => {
    const root = path.join(T, ten);
    mkdirSync(path.join(root, '_acceptance', 'demo'), { recursive: true });
    writeFileSync(path.join(root, '_acceptance', 'demo', 'run-log.jsonl'),
      `${EVAL}\n${themFinding ? dongFinding() + '\n' : ''}${TALLY}\n`);
    const rp = path.join(root, '_acceptance', 'demo', 'evidence-report.md');
    writeFileSync(rp, ['---', 'schema_version: 1', 'feature_slug: demo', 'verdict: PASS',
      'enforcement_mode: strict', 'bypass_used: false', `verified_commit: ${'a'.repeat(40)}`, '---', '',
      '## Results', '', '- eval: E1', '  run_id: demo-E1-r1', '  exit_code: 0',
      '  verifier: config:executors.test.api', '  verified_at: 2026-09-14T00:00:00Z', ''].join('\n'));
    return rp;
  };
  const chay = rp => { try { return `exit0 ${execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), rp], { encoding: 'utf8' })}`; } catch (e) { return `exit${e.status} ${String(e.stdout || '') + String(e.stderr || '')}`; } };
  const ra = chay(mk('rc-khong', false)), rb = chay(mk('rc-co', true));
  const chuanHoa = s => String(s).replace(/rc-(khong|co)/g, 'R');
  so(chuanHoa(ra), chuanHoa(rb), 'recheck-evidence');
  // Đối chứng dương: run_id trong bản chấm KHÔNG có trong sổ → phải đỏ, kể cả khi sổ có dòng finding.
  const rpBia = mk('rc-bia', true);
  writeFileSync(rpBia, readFileSync(rpBia, 'utf8').replace('demo-E1-r1', 'demo-E1-BIA'));
  const rbia = chay(rpBia);
  if (!/^exit0/.test(rbia)) ok('recheck-evidence doi chung duong: run_id bia van bi chan du so co dong finding');
  else bad('recheck-evidence doi chung duong: run_id bia LOT', rbia.slice(0, 160));
}

console.log(`\nResults: ${pass} passed, ${fail} failed (finding-line-bo-doc)`);
process.exit(fail ? 1 : 0);
