// repin-fixture.mjs — dựng workspace code-sinh cho các case re-pin (DV2/DV3/DV12).
// Đường dẫn suy từ vị trí file này (bất biến: không hardcode ROOT).
import { mkdtempSync, mkdirSync, writeFileSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

export const SHA_A = 'a'.repeat(40);

// opts: { slug, runId, sha, verifiedCommit, suitesExit, noSuites, noRepinLine,
//         noRunLog, oldStyleSection, sectionBody }  — mọi field có default hợp lệ (clean).
export function mkRepinFixture(opts = {}) {
  const slug = opts.slug || 'feat-repin';
  const runId = opts.runId || 'repin-test-1';
  const sha = opts.sha || SHA_A;
  const vc = opts.verifiedCommit || sha;
  const suites = opts.suitesExit || [0, 0, 0, 0];
  const root = mkdtempSync(path.join(tmpdir(), 'repin-'));
  const dir = path.join(root, '_acceptance', slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'contract.md'),
    `---\nschema_version: 1\nfeature: ${slug}\nslug: ${slug}\nrisk_tier: T2\nsurfaces: [api]\nstatus: implemented\napproved_by: Manh Phan\n---\n`);
  const verifier = path.join(root, 'verify.sh');
  writeFileSync(verifier, '#!/bin/sh\nexit 0\n'); chmodSync(verifier, 0o755);
  const evalRunId = `${slug}-E1-001`;
  const lines = [
    JSON.stringify({ ts: '2026-08-05T00:00:00Z', round: 1, evalId: 'E1', run_id: evalRunId, exit_code: 0, cmd: 'pnpm test' }),
  ];
  if (!opts.noRepinLine) {
    const rl = { ts: '2026-08-05T01:00:00Z', kind: 'repin', run_id: runId, sha, suites_exit: suites };
    if (opts.noSuites) delete rl.suites_exit;
    lines.push(JSON.stringify(rl));
  }
  if (!opts.noRunLog) writeFileSync(path.join(dir, 'run-log.jsonl'), lines.join('\n') + '\n');
  const section = opts.oldStyleSection
    ? `### Re-pin lần 1 — 2026-08-05, do engine đổi\n\n\`verified_commit\` lên \`${vc.slice(0, 7)}\`. Suite chạy lại xanh.\n`
    : (opts.sectionBody !== undefined
        ? `### Re-pin lần 1 — 2026-08-05, do engine đổi\n${opts.sectionBody}\n`
        : `### Re-pin lần 1 — 2026-08-05, do engine đổi\nrun_id: ${runId}\nsha: ${sha} · suites: ${suites.length} lệnh exit 0\n`);
  writeFileSync(path.join(dir, 'evidence-report.md'),
    `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: PASS\nverified_commit: ${vc}\nhuman_signoff: Manh 2026-08-05\n---\n\n## Evidence\n- eval: E1\n  run_id: ${evalRunId}\n  exit_code: 0\n  verifier: ${verifier}\n  verified_at: 2026-08-05\n\n## Iterations\n\n${section}`);
  return { root, dir, report: path.join(dir, 'evidence-report.md'), slug, runId, sha, verifiedCommit: vc };
}
