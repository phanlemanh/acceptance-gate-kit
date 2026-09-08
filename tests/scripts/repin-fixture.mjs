// repin-fixture.mjs — dựng workspace code-sinh cho các case re-pin (DV2/DV3/DV12/RE*).
// Đường dẫn suy từ vị trí file này (bất biến: không hardcode ROOT).
import { mkdtempSync, mkdirSync, writeFileSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

export const SHA_A = 'a'.repeat(40);
// Hai mốc ts chỉ để test khẳng định luật KHÔNG phụ thuộc ngày (owner bỏ mốc
// 08/09/2026): làn thiếu evals_exit đỏ dù ts cũ hay mới.
export const TS_OLD = '2026-08-05T01:00:00Z';
export const TS_NEW = '2026-09-09T00:00:00Z';

// Khuôn evals.yaml có MỘT eval máy (script) + một judgment — code sinh, không chép tay.
export function evalsYamlWith(machineIds = ['E1'], extra = '') {
  const blocks = machineIds.map((id, i) => `  - id: ${id}\n    criterion: AC-${i + 1}\n    executor: script\n    cmd: config:executors.script.rang_${id.toLowerCase()}\n    expected: >\n      Xanh: răng ${id} exit 0.\n`).join('\n');
  return `schema_version: 1\nslug: feat-repin\n\nevals:\n${blocks}\n${extra}`;
}

// opts: { slug, runId, sha, verifiedCommit, suitesExit, noSuites, noRepinLine,
//         noRunLog, oldStyleSection, sectionBody, secondEvent,
//         ts, noTs, evalsExit, noEvalsExit, evalsExitRaw, evalsYaml,
//         noEvalsYaml } — default hợp lệ = làn ĐỦ BỘ: evals.yaml có E1 (script)
//         và dòng repin ghi evals_exit {E1:0}. secondEvent: {runId, sha,
//         line:true|false, ts, evalsExit, noEvalsExit} — thêm SỰ KIỆN re-pin thứ
//         hai (section 2 + dòng 2 nếu line), verified_commit = sha2.
//   evalsExit: object thay mặc định; noEvalsExit: bỏ khoá (làn suite-only);
//   evalsExitRaw: chuỗi JSON thô thay cho object (ca malformed);
//   evalsYaml: nội dung evals.yaml thay mặc định; noEvalsYaml: KHÔNG ghi file.
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
  if (!opts.noEvalsYaml) writeFileSync(path.join(dir, 'evals.yaml'), opts.evalsYaml !== undefined ? opts.evalsYaml : evalsYamlWith(['E1']));
  const verifier = path.join(root, 'verify.sh');
  writeFileSync(verifier, '#!/bin/sh\nexit 0\n'); chmodSync(verifier, 0o755);
  const evalRunId = `${slug}-E1-001`;
  const lines = [
    JSON.stringify({ ts: '2026-08-05T00:00:00Z', round: 1, evalId: 'E1', run_id: evalRunId, exit_code: 0, cmd: 'pnpm test' }),
  ];
  const repinLine = (o) => {
    const rl = { ts: o.ts || TS_OLD, kind: 'repin', run_id: o.runId, sha: o.sha, suites_exit: suites };
    if (o.noTs) delete rl.ts;
    if (o.noSuites) delete rl.suites_exit;
    if (!o.noEvalsExit) rl.evals_exit = o.evalsExit !== undefined ? o.evalsExit : { E1: 0 };
    let s = JSON.stringify(rl);
    if (o.evalsExitRaw !== undefined) s = s.replace(/\}$/, `,"evals_exit":${o.evalsExitRaw}}`);
    return s;
  };
  if (!opts.noRepinLine) lines.push(repinLine({ ...opts, runId, sha }));
  if (opts.secondEvent && opts.secondEvent.line !== false) {
    lines.push(repinLine({ ts: opts.secondEvent.ts || '2026-08-06T01:00:00Z', runId: opts.secondEvent.runId, sha: opts.secondEvent.sha, evalsExit: opts.secondEvent.evalsExit, noEvalsExit: opts.secondEvent.noEvalsExit }));
  }
  if (!opts.noRunLog) writeFileSync(path.join(dir, 'run-log.jsonl'), lines.join('\n') + '\n');
  const section = opts.oldStyleSection
    ? `### Re-pin lần 1 — 2026-08-05, do engine đổi\n\n\`verified_commit\` lên \`${vc.slice(0, 7)}\`. Suite chạy lại xanh.\n`
    : (opts.sectionBody !== undefined
        ? `### Re-pin lần 1 — 2026-08-05, do engine đổi\n${opts.sectionBody}\n`
        : `### Re-pin lần 1 — 2026-08-05, do engine đổi\nrun_id: ${runId}\nsha: ${sha} · suites: ${suites.length} lệnh exit 0\n`);
  const vcFinal = opts.secondEvent ? opts.secondEvent.sha : vc;
  const section2 = opts.secondEvent
    ? `\n### Re-pin lần 2 — 2026-08-06, do sự kiện kế tiếp\nrun_id: ${opts.secondEvent.runId}\nsha: ${opts.secondEvent.sha} · suites: ${suites.length} lệnh exit 0\n`
    : '';
  writeFileSync(path.join(dir, 'evidence-report.md'),
    `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: PASS\nverified_commit: ${vcFinal}\nhuman_signoff: Manh 2026-08-05\n---\n\n## Evidence\n- eval: E1\n  run_id: ${evalRunId}\n  exit_code: 0\n  verifier: ${verifier}\n  verified_at: 2026-08-05\n\n## Iterations\n\n${section}${section2}`);
  return { root, dir, report: path.join(dir, 'evidence-report.md'), slug, runId, sha, verifiedCommit: vc };
}
