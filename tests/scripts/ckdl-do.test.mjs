// ckdl-do.test.mjs — hồ sơ cham-khong-tu-dot-luot, làn C (đo chi phí). Tên ca = tên AC.
// Thư mục transcript do CODE sinh trong chính lần chạy; wf-usage thật đọc nó.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const TMP = mkdtempSync(path.join(tmpdir(), 'ckdl-do-'));
let pass = 0; let fail = 0;
const ok = (n, m = '') => { pass += 1; console.log(`PASS: ${n} ${m}`.trimEnd() + ' '); };
const bad = (n, m) => { fail += 1; console.log(`FAIL: ${n} — ${m}`); };
const CHON = [...process.argv.slice(2), ...(process.env.CKDL_CASES ? process.env.CKDL_CASES.split(',') : [])];
const want = n => !CHON.length || CHON.some(c => n === c || n.startsWith(c + '-'));
const ca = async (n, fn) => { if (!want(n)) return; try { ok(n, (await fn()) || ''); } catch (e) { bad(n, String(e && e.message || e).split('\n').slice(0, 6).join(' | ')); } };
const assert = (c, m) => { if (!c) throw new Error(m); };

// ── Task C1 (AC-8): nhãn chi phí từ meta.json ──
const WFU = path.join(KIT, 'feature-loop', 'scripts', 'wf-usage.mjs');
const HARNESS = '[Workflow harness — user request] The harness relayed this request verbatim';
function thuMuc({ meta = true, tagO2 = false } = {}) {
  const d = mkdtempSync(path.join(TMP, 'wf-'));
  ['machine:a', 'review:b', 'judge:c'].forEach((lab, i) => {
    const id = `agent-a${i}`;
    const tin = [{ type: 'user', message: { content: HARNESS } }];
    if (tagO2) tin.push({ type: 'user', message: { content: `[wf-label: x${i}] than prompt` } });
    tin.push({ type: 'assistant', message: { id: `m${i}`, model: 'claude-haiku-4-5', usage: { input_tokens: 10, output_tokens: 100 + i, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } } });
    writeFileSync(path.join(d, `${id}.jsonl`), tin.map(o => JSON.stringify(o)).join('\n') + '\n');
    if (meta) writeFileSync(path.join(d, `${id}.meta.json`), JSON.stringify({ agentType: 'workflow-subagent', description: lab, workflowPhase: 'Machine' }));
  });
  return d;
}
const chayWfu = d => spawnSync(process.execPath, [WFU, d, '--md', '--title', 't'], { encoding: 'utf8' }).stdout;
await ca('CK-AC8', async () => {
  const o = chayWfu(thuMuc());
  const nhan = ['machine:a', 'review:b', 'judge:c'].filter(l => o.includes(`| ${l} |`));
  assert(nhan.length === 3, `nhan trung: ${o.split('\n').filter(l => l.startsWith('| [')).join(' / ')}`);
  return '(3 nhan rieng)';
});
await ca('CK-AC8-doi-chung', async () => {
  const o1 = chayWfu(thuMuc({ meta: false, tagO2: true }));
  assert(['x0', 'x1', 'x2'].every(l => o1.includes(`| ${l} |`)), 'the o tin nguoi thu hai khong duoc doc');
  const o2 = chayWfu(thuMuc({ meta: false }));
  assert(o2.includes(`| ${HARNESS.slice(0, 48)} |`), '48 ky tu dau nhu truoc vong');
  return '(the tin 2 · 48 ky tu)';
});
await ca('CK-AC8-dot-bien', async () => {
  const src = readFileSync(WFU, 'utf8');
  const KIM = 'const meta = docMeta(file);';
  assert(src.split(KIM).length - 1 === 1, 'kim docMeta khong khop');
  // Đối chứng dương cùng đường chép: bản sao NGUYÊN VẸN đặt cùng chỗ phải tách ba nhãn (S4-r1).
  const lanhP = path.join(TMP, 'wfu-lanh.mjs'); writeFileSync(lanhP, src);
  const lanh = spawnSync(process.execPath, [lanhP, thuMuc(), '--md', '--title', 't'], { encoding: 'utf8' }).stdout;
  assert(['machine:a', 'review:b', 'judge:c'].every(l => lanh.includes(`| ${l} |`)), 'doi chung: ban sao nguyen ven khong tach ba nhan');
  const sao = path.join(TMP, 'wfu-sao.mjs'); writeFileSync(sao, src.replace(KIM, 'const meta = null;'));
  const r = spawnSync(process.execPath, [sao, thuMuc(), '--md', '--title', 't'], { encoding: 'utf8' });
  const o = r.stdout;
  assert(r.status === 0 && (o.match(/^\| [^|]+ \| claude-/gm) || []).length === 3, `ban sao dot bien khong in du 3 hang (status ${r.status})`);
  assert(!['machine:a', 'review:b', 'judge:c'].every(l => o.includes(`| ${l} |`)), 'nhan trung — ban sao bo meta ma van tach nhan');
  return '(nhan trung)';
});

rmSync(TMP, { recursive: true, force: true });
console.log(`ckdl-do: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
