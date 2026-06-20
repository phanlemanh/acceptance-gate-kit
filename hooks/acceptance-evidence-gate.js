#!/usr/bin/env node
/**
 * acceptance-evidence-gate.js — Acceptance-Gate Kit enforcement layer (WRITE time).
 *
 * Trigger: PreToolUse on Write | Edit targeting _acceptance/<slug>/evidence-report.md
 *
 * The evidence validation itself lives in lib/evidence-core.js — the SINGLE
 * source of truth shared with scripts/recheck-evidence.js (the CI re-check), so
 * the two can never drift. This file is the thin PreToolUse wrapper: stdin/stdout
 * passthrough, bypass + enforcement-mode policy, and the block/warn output.
 *
 * Enforcement fires only when the verdict is PASS-family (core.determineEnforce).
 * Blocks (exit 2) when enforcement fires and the evidence fails:
 *   L1 SHAPE      — run_id / exit_code: 0 / verifier / verified_at missing
 *   L1 CONSISTENCY — a PASS-family report contains exit_code != 0 or verdict: FAIL
 *   L2 SUBSTANCE  — a verifier is manual/heuristic, or not a resolvable
 *                   config:<dotted.key> / existing script path
 *   L3 JUDGMENT   — UNCERTAIN without human_override; T3 needs an override on
 *                   every judgment item
 *
 * PENDING-JUDGMENT / REJECT / BLOCKED verdicts always pass through.
 * Enforcement level from consumer config: strict (default) | warn | off.
 * Bypass: ACCEPTANCE_GATE_BYPASS=1. Fail-open on internal error.
 */

const fs = require('fs');
const path = require('path');
// Load the shared validation core; if it is somehow unavailable, fail OPEN
// (never block unrelated work) rather than crash the PreToolUse hook.
let core = null;
try { core = require(path.join(__dirname, '..', 'lib', 'evidence-core.js')); } catch (_) {}

let data = '';
process.stdin.on('data', chunk => (data += chunk));
process.stdin.on('end', () => {
  try {
    if (process.env.ACCEPTANCE_GATE_BYPASS === '1' || !core) {
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

    const TARGET_RE = /(^|[\\/])_acceptance[\\/][^\\/]+[\\/]evidence-report\.md$/i;
    if (!TARGET_RE.test(filePath)) {
      process.stdout.write(data);
      process.exit(0);
    }

    let payload = (ti.content || ti.new_string || '').toString();
    if (toolName === 'Edit') {
      // Judge the POST-EDIT file, not the fragment — surgical edits like the
      // Gate-2 verdict upgrade (PENDING-JUDGMENT -> PASS) would otherwise be
      // evaluated out of context and false-blocked.
      try {
        const existing = fs.readFileSync(filePath, 'utf8');
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
        // keep evaluating the fragment.
      } catch (_) {
        // file missing/unreadable -> evaluate the fragment (anti-evasion).
      }
    }
    if (!payload) {
      process.stdout.write(data);
      process.exit(0);
    }

    if (!core.determineEnforce(payload)) {
      process.stdout.write(data);
      process.exit(0);
    }

    const fileDir = path.dirname(filePath);
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
