#!/usr/bin/env node
/**
 * acceptance-evidence-gate.js — Acceptance-Gate Kit enforcement layer.
 *
 * Trigger: PreToolUse on Write | Edit targeting _acceptance/<slug>/evidence-report.md
 *
 * The OVERALL verdict is read from the report's leading frontmatter block.
 * Enforcement fires only when it is PASS-family (PASS/ACCEPTED/APPROVED/GO).
 * When no frontmatter verdict exists, any PASS-family claim anywhere in the
 * payload triggers enforcement (anti-evasion fallback).
 *
 * Blocks (exit 2) when enforcement fires and:
 *   L1 SHAPE      — evidence block incomplete (run_id / exit_code: 0 / verifier / verified_at)
 *   L2 SUBSTANCE  — any `verifier:` is manual/heuristic, or is neither an existing
 *                   script path nor a resolvable config:<dotted.key> in
 *                   _acceptance/config.yaml of the consumer repo
 *                   (`verified_by:` is attribution, NOT checked as a verifier)
 *   L3 JUDGMENT   — any per-eval `verdict: UNCERTAIN` without a real
 *                   (non-comment) `human_override:`; for T3 contracts EVERY
 *                   judgment item needs a human_override regardless of verdict
 *
 * PENDING-JUDGMENT / REJECT / BLOCKED verdicts always pass through — failing
 * honestly, or parking the report for Gate 2 judgment, is legal.
 */

const fs = require('fs');
const path = require('path');

// ─── Config lookup ─────────────────────────────────────────────────────────

function findAcceptanceConfig(fileDir) {
  // evidence-report.md lives at _acceptance/<slug>/ → config is ../config.yaml.
  // Walk up defensively in case of nesting.
  let cur = fileDir;
  for (let i = 0; i < 10 && cur && cur !== path.dirname(cur); i++) {
    const base = path.basename(cur) === '_acceptance'
      ? cur
      : path.join(cur, '_acceptance');
    const candidate = path.join(base, 'config.yaml');
    try {
      if (fs.existsSync(candidate)) return candidate;
    } catch (_) {}
    cur = path.dirname(cur);
  }
  return null;
}

function resolveConfigKey(configText, dottedKey) {
  // Indent-based walk for a 2-3 level dotted key (e.g. executors.test.api).
  // Returns the scalar value or null. No YAML lib — line-based on purpose.
  const parts = dottedKey.split('.');
  const lines = configText.split('\n');
  let depth = 0;
  let expectedIndent = 0;
  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const indent = line.length - line.trimStart().length;
    if (indent < expectedIndent) {
      // left the branch we were following — reset if we fell below current depth
      while (depth > 0 && indent < expectedIndent) {
        depth--;
        expectedIndent -= 2;
      }
    }
    if (indent !== expectedIndent) continue;
    const m = line.trim().match(/^([\w-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    if (m[1] === parts[depth]) {
      if (depth === parts.length - 1) {
        const val = m[2].trim().replace(/^["']|["']$/g, '');
        return val || null; // leaf must have a non-empty scalar
      }
      depth++;
      expectedIndent += 2;
    }
  }
  return null;
}

// ─── Verifier extraction & authenticity ────────────────────────────────────

function extractVerifierValues(payload) {
  // NOTE: `verified_by:` is deliberately NOT in this list — the report
  // template uses it for agent attribution, not as an evidence verifier.
  const values = [];
  const KEY_RE = /^\s*(?:-\s+)?(verifier|checked_by)\s*[:=]\s*(.+?)\s*$/i;
  for (const line of payload.split('\n')) {
    const m = line.match(KEY_RE);
    if (!m) continue;
    let val = m[2].replace(/\s+#.*$/, '').trim().replace(/^["']+|["']+$/g, '').trim();
    if (val) values.push(val);
  }
  return values;
}

function findGitRoot(startDir) {
  let cur = startDir;
  while (cur && cur !== path.dirname(cur)) {
    try {
      if (fs.existsSync(path.join(cur, '.git'))) return cur;
    } catch (_) {}
    cur = path.dirname(cur);
  }
  return null;
}

function isAuthenticVerifier(value, fileDir, configPath, configText) {
  const MANUAL_RE = /\b(manual|human|heuristic|cross-reference|eyeball|interpret(ation)?|persona\s+rubric|llm\s+rubric|llm[-\s]as[-\s]judge)\b/i;
  if (MANUAL_RE.test(value)) {
    return { ok: false, reason: `manual/heuristic verifier disallowed: "${value}"` };
  }

  const configRef = value.match(/^config:([\w.-]+)$/);
  if (configRef) {
    if (!configText) {
      return { ok: false, reason: `verifier "${value}" but no _acceptance/config.yaml found` };
    }
    const resolved = resolveConfigKey(configText, configRef[1]);
    if (resolved) return { ok: true, resolved: `${configPath} :: ${configRef[1]} = ${resolved}` };
    return { ok: false, reason: `config key not found or empty: "${configRef[1]}" in ${configPath} (note: the parser requires 2-space indentation in config.yaml)` };
  }

  const scriptMatch = value.match(/(\S+\.(py|js|sh))\b/);
  if (!scriptMatch) {
    return { ok: false, reason: `verifier is neither config:<key> nor a script path (.py/.sh/.js): "${value}"` };
  }
  const rawPath = scriptMatch[1].replace(/^["']+|["']+$/g, '');
  const candidates = [];
  if (path.isAbsolute(rawPath)) {
    candidates.push(rawPath);
  } else {
    if (fileDir) {
      candidates.push(path.resolve(fileDir, rawPath));
      const gitRoot = findGitRoot(fileDir);
      if (gitRoot) candidates.push(path.resolve(gitRoot, rawPath));
    }
    candidates.push(path.resolve(process.cwd(), rawPath));
  }
  for (const c of candidates) {
    try {
      if (fs.existsSync(c) && fs.statSync(c).isFile()) return { ok: true, resolved: c };
    } catch (_) {}
  }
  return {
    ok: false,
    reason: `verifier script not found. raw: ${rawPath}; tried:\n` +
      candidates.map(c => `      ${c}`).join('\n'),
  };
}

// ─── Main ──────────────────────────────────────────────────────────────────

let data = '';
process.stdin.on('data', chunk => (data += chunk));
process.stdin.on('end', () => {
  try {
    if (process.env.ACCEPTANCE_GATE_BYPASS === '1') {
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

    const payload = (ti.content || ti.new_string || '').toString();
    if (!payload) {
      process.stdout.write(data);
      process.exit(0);
    }

    // Determine the OVERALL verdict from the leading frontmatter block.
    // Per-eval lines also say `verdict: PASS`, so scanning the whole payload
    // would wrongly block honest REJECT / PENDING-JUDGMENT reports that
    // contain passing machine evals or passing judgment items.
    const PASS_FAMILY = /^(PASS|ACCEPTED|APPROVED|GO)$/i;
    let overall = null;
    const fmMatch = payload.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (fmMatch) {
      const vm = fmMatch[1].match(/^verdict\s*[:=]\s*([A-Za-z-]+)\s*$/m);
      if (vm) overall = vm[1].toUpperCase();
    }
    let enforce;
    if (overall) {
      enforce = PASS_FAMILY.test(overall);
    } else {
      // Anti-evasion fallback: no frontmatter verdict — any PASS-family
      // claim anywhere in the payload triggers enforcement.
      const CLAIM_RE = /(?:^|\n)\s*(?:-\s+)?verdict\s*[:=]\s*(PASS|ACCEPTED|APPROVED|GO)\b/i;
      const CHECKMARK_RE = /✅\s*(PASS|ACCEPTED|APPROVED|GO)/i;
      enforce = CLAIM_RE.test(payload) || CHECKMARK_RE.test(payload);
    }
    if (!enforce) {
      process.stdout.write(data);
      process.exit(0);
    }

    const fileDir = path.dirname(filePath);
    const configPath = findAcceptanceConfig(fileDir);
    let configText = null;
    let enforcement = 'strict';
    if (configPath) {
      try {
        configText = fs.readFileSync(configPath, 'utf8');
        const em = configText.match(/^enforcement\s*:\s*(strict|warn|off)\s*$/m);
        if (em) enforcement = em[1];
      } catch (_) {}
    }
    if (enforcement === 'off') {
      process.stdout.write(data);
      process.exit(0);
    }

    // L1 SHAPE
    const HAS_RUN_ID = /run_id\s*[:=]\s*\S{4,}/i.test(payload);
    const HAS_EXIT_ZERO = /(exit_code|verifier_exit_code|exit)\s*[:=]\s*0\b/i.test(payload);
    const HAS_VERIFIED_AT = /verified_at\s*[:=]\s*\d{4}-\d{2}-\d{2}/i.test(payload);
    const verifierValues = extractVerifierValues(payload);
    const HAS_VERIFIER = verifierValues.length > 0;

    const missing = [];
    if (!HAS_RUN_ID) missing.push('run_id: <id from verifier stdout>');
    if (!HAS_EXIT_ZERO) missing.push('exit_code: 0');
    if (!HAS_VERIFIER) missing.push('verifier: <script path or config:executors.<type>.<surface>>');
    if (!HAS_VERIFIED_AT) missing.push('verified_at: <ISO8601>');

    // L2 SUBSTANCE
    const authFailures = [];
    for (const v of verifierValues) {
      const r = isAuthenticVerifier(v, fileDir, configPath, configText);
      if (!r.ok) authFailures.push(r.reason);
    }

    // L3 JUDGMENT — UNCERTAIN must be human-resolved before overall PASS.
    // human_override must carry a real value ([^#\s]) — a comment-only
    // template placeholder does not count as a resolution.
    const uncertainCount = (payload.match(/verdict\s*[:=]\s*UNCERTAIN\b/gi) || []).length;
    const overrideCount = (payload.match(/human_override\s*[:=]\s*[^#\s]/gi) || []).length;
    let judgmentFailure = null;
    if (uncertainCount > overrideCount) {
      judgmentFailure = `${uncertainCount} UNCERTAIN judgment(s) but only ${overrideCount} human_override(s) — a human must resolve each UNCERTAIN before overall PASS`;
    }
    // T3 contracts: EVERY judgment item needs a direct human verdict,
    // regardless of what the judge said. Tier comes from the sibling contract.
    if (!judgmentFailure) {
      let tier = null;
      try {
        const contract = fs.readFileSync(path.join(fileDir, 'contract.md'), 'utf8');
        const tm = contract.match(/^risk_tier\s*[:=]\s*(T[123])\s*$/mi);
        if (tm) tier = tm[1].toUpperCase();
      } catch (_) {}
      if (tier === 'T3') {
        const judgedCount = (payload.match(/judged_by\s*[:=]\s*\S+/gi) || []).length;
        if (judgedCount > overrideCount) {
          judgmentFailure = `risk_tier T3: ${judgedCount} judgment item(s) but only ${overrideCount} human_override(s) — T3 requires a direct human verdict on every judgment eval`;
        }
      }
    }

    if (missing.length === 0 && authFailures.length === 0 && !judgmentFailure) {
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
    if (missing.length) {
      lines.push('L1 SHAPE — missing required evidence fields:');
      lines.push(...missing.map(m => `  x ${m}`));
      lines.push('');
    }
    if (authFailures.length) {
      lines.push('L2 SUBSTANCE — verifier authenticity failed:');
      lines.push(...authFailures.map(r => `  x ${r}`));
      lines.push('');
    }
    if (judgmentFailure) {
      lines.push('L3 JUDGMENT:');
      lines.push(`  x ${judgmentFailure}`);
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
