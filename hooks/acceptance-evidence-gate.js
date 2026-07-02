#!/usr/bin/env node
/**
 * acceptance-evidence-gate.js — Acceptance-Gate Kit enforcement layer (WRITE time).
 *
 * Trigger: PreToolUse on Write | Edit targeting
 *   _acceptance/<slug>/evidence-report.md  (evidence bar)
 *   _acceptance/<slug>/contract.md         (Gate-1 transition guard)
 *
 * The validation itself lives in lib/evidence-core.js — the SINGLE
 * source of truth shared with scripts/recheck-evidence.js (the CI re-check), so
 * the two can never drift. This file is the thin PreToolUse wrapper: stdin/stdout
 * passthrough, bypass + enforcement-mode policy, and the block/warn output.
 *
 * Evidence report — enforcement fires only when the verdict is PASS-family
 * (core.determineEnforce). Blocks (exit 2) when the evidence fails:
 *   L1 SHAPE      — run_id / exit_code: 0 / verifier / verified_at missing;
 *                   verified_commit present but not a git SHA
 *   L1 CONSISTENCY — a PASS-family report contains exit_code != 0 or verdict: FAIL
 *   L2 SUBSTANCE  — a verifier is manual/heuristic, or not a resolvable
 *                   config:<dotted.key> / existing script path
 *   L3 JUDGMENT   — UNCERTAIN without human_override; T3 needs an override on
 *                   every judgment item
 * PENDING-JUDGMENT / REJECT / BLOCKED verdicts always pass through.
 *
 * Contract — core.evaluateContractWrite blocks status transitions that skip
 * Gate 1 (approved/signed-off, or draft -> implemented/verified, with an empty
 * approved_by and no gate1_skipped: true).
 *
 * Enforcement level from consumer config: strict (default) | warn | off.
 * Bypass: ACCEPTANCE_GATE_BYPASS=1. Fail-open on internal error — loudly
 * (stderr) when evidence-core cannot load and the write targets a gate file.
 */

const fs = require('fs');
const path = require('path');
// Load the shared validation core; if it is somehow unavailable, fail OPEN
// (never block unrelated work) rather than crash the PreToolUse hook — but
// NEVER silently when the write targets an evidence report (see below).
const CORE_PATH = path.join(__dirname, '..', 'lib', 'evidence-core.js');
let core = null;
try { core = require(CORE_PATH); } catch (_) {}

const TARGET_RE = /(^|[\\/])_acceptance[\\/][^\\/]+[\\/]evidence-report\.md$/i;
const CONTRACT_RE = /(^|[\\/])_acceptance[\\/][^\\/]+[\\/]contract\.md$/i;

// Consumer enforcement policy for a gate file: strict (default) | warn | off,
// read from the nearest _acceptance/config.yaml. Shared by both targets.
function readEnforcement(fileDir) {
  const configPath = core.findAcceptanceConfig(fileDir);
  let configText = null;
  let enforcement = 'strict';
  if (configPath) {
    try {
      configText = fs.readFileSync(configPath, 'utf8');
      const em = configText.match(/^enforcement\s*:\s*(strict|warn|off)\s*(?:#.*)?$/m);
      if (em) enforcement = em[1];
    } catch (_) {}
  }
  return { configPath, configText, enforcement };
}

let data = '';
process.stdin.on('data', chunk => (data += chunk));
process.stdin.on('end', () => {
  try {
    if (process.env.ACCEPTANCE_GATE_BYPASS === '1') {
      process.stdout.write(data);
      process.exit(0);
    }
    if (!core) {
      // Fail open, but a gate that is DOWN must be visible: if this write
      // targets an evidence report, say so on stderr before passing through —
      // otherwise a broken install silently disables enforcement while every
      // downstream signal (enforcement_mode stamp, pre-merge) still reads green.
      try {
        const fp = String(((JSON.parse(data || '{}') || {}).tool_input || {}).file_path || '');
        if (TARGET_RE.test(fp) || CONTRACT_RE.test(fp)) {
          process.stderr.write(
            'acceptance-evidence-gate: INACTIVE — evidence-core not loadable at ' +
            CORE_PATH + '; gate-file write passed through UNCHECKED\n'
          );
        }
      } catch (_) { /* unparseable stdin — still fail open, nothing to report */ }
      process.stdout.write(data);
      process.exit(0);
    }

    const input = JSON.parse(data || '{}');
    const toolName = input.tool_name || '';
    const ti = input.tool_input || {};
    const filePath = ti.file_path || '';

    if (toolName !== 'Write' && toolName !== 'Edit') {
      process.stdout.write(data);
      process.exit(0);
    }

    const isReport = TARGET_RE.test(filePath);
    const isContract = CONTRACT_RE.test(filePath);
    if (!isReport && !isContract) {
      process.stdout.write(data);
      process.exit(0);
    }

    // PRE-WRITE file (null when creating): the contract transition guard needs
    // the old status; Edit reconstruction below needs the current bytes.
    let existing = null;
    try { existing = fs.readFileSync(filePath, 'utf8'); } catch (_) {}

    let payload = (ti.content || ti.new_string || '').toString();
    if (toolName === 'Edit' && existing !== null) {
      // Judge the POST-EDIT file, not the fragment — surgical edits like the
      // Gate-2 verdict upgrade (PENDING-JUDGMENT -> PASS) would otherwise be
      // evaluated out of context and false-blocked.
      const oldStr = (ti.old_string || '').toString();
      if (oldStr && existing.includes(oldStr)) {
        const newStr = (ti.new_string || '').toString();
        // Function replacement keeps newStr LITERAL — String.replace would
        // otherwise expand $-patterns ($&, $`, $') and make the hook judge
        // different bytes than the Edit tool actually writes.
        payload = ti.replace_all
          ? existing.split(oldStr).join(newStr)
          : existing.replace(oldStr, () => newStr);
      }
      // file exists but old_string absent -> the Edit will fail anyway;
      // keep evaluating the fragment. File missing/unreadable (existing null)
      // -> evaluate the fragment (anti-evasion).
    }
    if (!payload) {
      process.stdout.write(data);
      process.exit(0);
    }

    const fileDir = path.dirname(filePath);

    if (isContract) {
      const cr = core.evaluateContractWrite(payload, existing);
      if (!cr.anyFailure) {
        process.stdout.write(data);
        process.exit(0);
      }
      const cfg = readEnforcement(fileDir);
      if (cfg.enforcement === 'off') {
        process.stdout.write(data);
        process.exit(0);
      }
      const clines = [
        '',
        'BLOCKED by acceptance-evidence-gate (Gate-1 contract guard)',
        `File: ${filePath}`,
        `Enforcement: ${cfg.enforcement}${cfg.configPath ? ` (from ${cfg.configPath})` : ' (default — no config.yaml found)'}`,
        '',
        'CONTRACT TRANSITION without Gate-1 approval:',
        ...cr.failures.map(x => `  x ${x}`),
        '',
        'Gate 1 (human) must be recorded before a contract advances:',
        '  status: approved / signed-off        -> requires approved_by: <name> (+ approved_at)',
        '  draft -> implemented / verified      -> requires the approved step (Gate 1) first',
        '  User explicitly skipped Gate 1       -> record gate1_skipped: true (audited; pre-merge NOTEs it)',
        'Legacy bypass: ACCEPTANCE_GATE_BYPASS=1',
        '',
      ];
      if (cfg.enforcement === 'warn') {
        process.stderr.write(clines.join('\n').replace('BLOCKED by', 'WARNING from') + '\n');
        process.stdout.write(data);
        process.exit(0);
      }
      process.stderr.write(clines.join('\n') + '\n');
      process.exit(2);
    }

    if (!core.determineEnforce(payload)) {
      process.stdout.write(data);
      process.exit(0);
    }

    const { configPath, configText, enforcement } = readEnforcement(fileDir);
    if (enforcement === 'off') {
      process.stdout.write(data);
      process.exit(0);
    }

    const r = core.evaluateEvidence(payload, { fileDir, configText, configPath });
    if (!r.anyFailure) {
      process.stdout.write(data);
      process.exit(0);
    }

    const lines = [
      '',
      'BLOCKED by acceptance-evidence-gate',
      `File: ${filePath}`,
      `Enforcement: ${enforcement}${configPath ? ` (from ${configPath})` : ' (default — no config.yaml found)'}`,
      '',
    ];
    if (r.missing.length) {
      lines.push('L1 SHAPE — missing required evidence fields:');
      lines.push(...r.missing.map(m => `  x ${m}`));
      lines.push('');
    }
    if (r.consistencyFailure) {
      lines.push('L1 CONSISTENCY:');
      lines.push(`  x ${r.consistencyFailure}`);
      lines.push('');
    }
    if (r.authFailures.length) {
      lines.push('L2 SUBSTANCE — verifier authenticity failed:');
      lines.push(...r.authFailures.map(x => `  x ${x}`));
      lines.push('');
    }
    if (r.judgmentFailure) {
      lines.push('L3 JUDGMENT:');
      lines.push(`  x ${r.judgmentFailure}`);
      lines.push('');
    }
    if (r.runLogFailure) {
      lines.push('L2 PROVENANCE — run_id not machine-logged:');
      lines.push(`  x ${r.runLogFailure}`);
      lines.push('');
    }
    lines.push(
      'A PASS verdict is only valid with machine evidence:',
      '  run_id: <from verifier stdout>   exit_code: 0',
      '  verifier: <existing script path OR config:executors.<type>.<surface>>',
      '  verified_at: <ISO8601>',
      '',
      'If the verifier cannot run      -> verdict: BLOCKED (+ reason). Do NOT fake PASS.',
      'If evals fail                   -> verdict: REJECT (+ failed_evals[]). Fully legal.',
      'If judgment items await a human -> verdict: PENDING-JUDGMENT (Gate 2 resolves).',
      'Legacy bypass: ACCEPTANCE_GATE_BYPASS=1',
      '',
    );

    if (enforcement === 'warn') {
      process.stderr.write(lines.join('\n').replace('BLOCKED by', 'WARNING from') + '\n');
      process.stdout.write(data);
      process.exit(0);
    }
    process.stderr.write(lines.join('\n') + '\n');
    process.exit(2);
  } catch (err) {
    process.stderr.write(`[acceptance-evidence-gate] hook error: ${err.message}\n`);
    process.stdout.write(data);
    process.exit(0);
  }
});
