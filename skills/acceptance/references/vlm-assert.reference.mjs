#!/usr/bin/env node
/* vlm-assert.reference.mjs — REFERENCE implementation of `executors.ui.vlm_assert`.
 *
 * A CROSS-FAMILY second opinion on a saved UI frame: a different model family
 * (default: Gemini) re-reads the screenshot and answers ONE closed YES/NO
 * question. This is an ASSERTION, not a judge — open quality questions
 * ("does it look good?") are judgment/design-loop territory (No blind VLM
 * judge). Same-family graders share "looks done" bias; a second family cuts
 * correlated error on exactly the evidence class where hallucinated
 * completion lives (screenshots).
 *
 * The Acceptance-Gate Kit ships NO API dependency — this is a starting point
 * you OWN; it lives in YOUR repo with YOUR key. Adopt:
 *   cp <plugin>/skills/acceptance/references/vlm-assert.reference.mjs scripts/vlm-assert.mjs
 *   export GEMINI_API_KEY=...           # your key, your env/secret manager
 *   _acceptance/config.yaml:
 *     executors:
 *       ui:
 *         vlm_assert: "node scripts/vlm-assert.mjs"
 * Evals point at a thin per-assertion wrapper (see eval-executors.md) because
 * a script eval's cmd carries no per-eval args.
 *
 * Usage: node scripts/vlm-assert.mjs <image> "<closed YES/NO question>"
 * Exit:  0 = YES · 1 = NO · 2 = cannot run (usage/image/key/API/non-YES-NO)
 *        — 2 maps to cannotRun/BLOCKED in the verify lane, never false-green.
 * Env:   GEMINI_API_KEY (required), VLM_MODEL (default gemini-3.5-flash —
 *        check Google's current model list; swap provider = 1 URL + 1 payload).
 * Node >= 18 (built-in fetch). Zero npm dependency.
 */
import { readFileSync } from 'node:fs';
import { extname } from 'node:path';

const [image, question] = process.argv.slice(2);
if (!image || !question) {
  console.error('usage: vlm-assert <image> "<closed YES/NO question>"');
  process.exit(2);
}

let b64;
try {
  b64 = readFileSync(image).toString('base64');
} catch (e) {
  console.error(`vlm-assert: cannot read image ${image}: ${e.message}`);
  process.exit(2);
}

const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.error('vlm-assert: GEMINI_API_KEY not set');
  process.exit(2);
}

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif' }[extname(image).toLowerCase()] || 'image/png';
const MODEL = process.env.VLM_MODEL || 'gemini-3.5-flash';

let res;
try {
  res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      contents: [{ parts: [
        { inline_data: { mime_type: MIME, data: b64 } },
        { text: `Answer with exactly one word, YES or NO. ${question}` },
      ] }],
      generationConfig: { temperature: 0 },
    }),
  });
} catch (e) {
  console.error(`vlm-assert: network error: ${e.message}`);
  process.exit(2);
}
// Body reads can also throw (truncated/garbage response) — that is still
// "cannot run" (exit 2), never a NO: an unhandled rejection would exit 1.
if (!res.ok) {
  let body = '';
  try { body = (await res.text()).slice(0, 300); } catch (_) { /* status alone */ }
  console.error(`vlm-assert: API ${res.status}: ${body}`);
  process.exit(2);
}
let data;
try {
  data = await res.json();
} catch (e) {
  console.error(`vlm-assert: unreadable API response: ${e.message}`);
  process.exit(2);
}
const text = String(
  data && data.candidates && data.candidates[0] && data.candidates[0].content
    && data.candidates[0].content.parts
    ? data.candidates[0].content.parts.map(p => p.text || '').join(' ')
    : ''
).trim().toUpperCase();
const word = (text.match(/\b(YES|NO)\b/) || [])[1];
if (!word) {
  console.error(`vlm-assert: non-YES/NO answer: "${text.slice(0, 120)}"`);
  process.exit(2);
}
console.log(`${word} — ${question}`);
process.exit(word === 'YES' ? 0 : 1);
