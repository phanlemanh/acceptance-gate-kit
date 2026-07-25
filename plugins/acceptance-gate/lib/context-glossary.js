'use strict';
/**
 * context-glossary.js — the SINGLE SOURCE OF TRUTH for reading a repo's
 * CONTEXT.md ubiquitous-language glossary.
 *
 * Two callers share this so they cannot drift:
 *   - scripts/eval-coverage-lint.js — W6 advisory vocab warning at Gate 1.
 *   - scripts/gate-card.js          — the Gate-1 "Terms" block.
 *
 * The kit already paid for a copy-pasted parser once: 1.20.1 had to fix the SAME
 * section-scan bug in four separate files (lint, pre-merge, gate-card,
 * evidence-page). Do not hand-roll a fifth CONTEXT.md parser — import this.
 *
 * SCOPE — read this before wiring a new caller. This parses the CONSUMER repo's
 * `CONTEXT.md` (their product's domain language, the artifact `/acceptance`
 * Phase 1 grows one term at a time). The KIT's own CONTEXT.md is
 * authoring-time — it governs how kit source is written and is never loaded at
 * runtime. Same filename, different job.
 *
 * Glossary shape (one term per block; definition is free prose):
 *
 *     **Order**:
 *     A customer request to buy one or more items.
 *     _Avoid_: Purchase, transaction
 *     _Allow_: standing order
 *
 * `_Avoid_` lists the aliases this repo has ruled out — that list is what makes
 * the glossary machine-checkable rather than decorative. `_Allow_` carves out
 * multi-word phrases that legitimately CONTAIN an avoided alias (a named
 * feature, a quoted external term); it suppresses only the occurrences inside
 * the phrase, never the bare alias elsewhere — an allowlist must not turn a
 * fail-loud check into a fail-silent one.
 *
 * Pure: no stdout, no exit. Callers decide how to report.
 */

const fs = require('fs');
const path = require('path');

const MAX_BYTES = 1024 * 1024; // a glossary is small; cap like the other readers

// `**Term**:` optionally followed by an inline definition on the same line.
const TERM_RE = /^\s*\*\*(.+?)\*\*\s*:\s*(.*)$/;
const AVOID_RE = /^\s*_Avoid_\s*:\s*(.+)$/i;
const ALLOW_RE = /^\s*_Allow_\s*:\s*(.+)$/i;

// A parenthetical inside `_Avoid_` is an explanatory note, never an alias —
// "test (criterion là điều phải đúng, không phải cách chứng minh)" declares ONE
// alias, not three. Dropping the parenthetical first is what keeps a prose-heavy
// glossary from minting garbage aliases out of its own commentary.
const splitList = s =>
  String(s)
    .replace(/\([^)]*\)?/g, ' ')      // note — unclosed parens (line wrap) too
    .split(/[,;·]/)
    .map(x => x.replace(/[`*_]/g, '').replace(/[.。]+\s*$/, '').trim())
    .filter(Boolean);

/** Parse CONTEXT.md text → { terms, aliases, allow }. Never throws on odd input. */
function parseGlossary(text) {
  const terms = [];
  const allow = [];
  let cur = null;
  for (const raw of String(text || '').split('\n')) {
    const t = raw.match(TERM_RE);
    if (t) {
      cur = { term: t[1].replace(/[`*_]/g, '').trim(), definition: (t[2] || '').trim(), avoid: [] };
      if (cur.term) terms.push(cur); else cur = null;
      continue;
    }
    const av = raw.match(AVOID_RE);
    if (av && cur) { cur.avoid.push(...splitList(av[1])); continue; }
    const al = raw.match(ALLOW_RE);
    // _Allow_ is a global carve-out: a phrase legitimate anywhere in the repo,
    // not only under the term whose block happens to declare it.
    if (al) { allow.push(...splitList(al[1])); continue; }
    // A blank line ends a term block; prose lines are the definition (ignored).
    if (!raw.trim()) cur = cur; // keep — definitions may span a blank-free block
  }
  // Two guards against a glossary poisoning its own rule. Both were found by
  // running this parser over the kit's own CONTEXT.md:
  //   - SELF-REFERENCE: an `_Avoid_` entry equal to its own term makes every
  //     correct use of the canonical word warn — the exact inverse of the job.
  //   - PROSE: a long entry is a sentence the author slipped into the list
  //     ("đừng dùng X cho Y"), not an alias. Aliases are short by nature.
  const wordCount = s => s.split(/\s+/).filter(Boolean).length;
  const aliases = [];
  for (const t of terms) {
    const canon = t.term.toLowerCase();
    for (const a of t.avoid) {
      if (!a) continue;
      if (a.toLowerCase() === canon) continue;
      if (wordCount(a) > 4) continue;
      aliases.push({ alias: a, term: t.term });
    }
  }
  return { terms, aliases, allow };
}

/**
 * Map new-file line numbers (1-based, e.g. the added lines of a git diff) to the
 * glossary terms whose block contains them. A term's block runs from its
 * `**Term**:` line to the line before the next term — so an edited `_Avoid_`
 * line is attributed to the term it belongs to, not just to added headings.
 * Returns [{ term, added }] where `added` is true when the term heading itself
 * is new (a brand-new term) rather than an edit inside an existing block.
 */
function termsAtLines(text, lineNos) {
  const want = new Set((lineNos || []).map(Number));
  if (!want.size) return [];
  const lines = String(text || '').split('\n');
  const heads = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(TERM_RE);
    if (m && m[1].replace(/[`*_]/g, '').trim()) heads.push({ term: m[1].replace(/[`*_]/g, '').trim(), at: i + 1 });
  }
  const out = [];
  for (let k = 0; k < heads.length; k++) {
    const start = heads[k].at;
    const end = k + 1 < heads.length ? heads[k + 1].at - 1 : lines.length;
    let touched = false;
    for (let ln = start; ln <= end; ln++) if (want.has(ln)) { touched = true; break; }
    if (touched) out.push({ term: heads[k].term, added: want.has(start) });
  }
  return out;
}

/** Parse the added-line numbers out of `git diff -U0` output (new-file side). */
function addedLinesFromDiff(diffText) {
  const added = [];
  let cursor = null;
  for (const line of String(diffText || '').split('\n')) {
    const h = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/);
    if (h) { cursor = parseInt(h[1], 10); continue; }
    if (cursor === null) continue;
    if (line.startsWith('+++')) continue;
    if (line.startsWith('+')) { added.push(cursor); cursor++; }
  }
  return added;
}

/** Read <repoRoot>/CONTEXT.md → parsed glossary, or null when absent/unreadable. */
function readGlossary(repoRoot) {
  const p = path.join(repoRoot || '.', 'CONTEXT.md');
  try {
    if (fs.statSync(p).size > MAX_BYTES) return null;
    return parseGlossary(fs.readFileSync(p, 'utf8'));
  } catch (_) { return null; }
}

/**
 * Blank out everything that is not human prose, preserving offsets and line
 * breaks so reported line numbers stay true: frontmatter, fenced code blocks,
 * inline code spans, and markdown link targets. A term appearing in a SQL
 * snippet or an identifier is not the author speaking — it must not warn.
 */
function stripNonProse(text) {
  let s = String(text || '');
  const blank = m => m.replace(/[^\n]/g, ' ');
  s = s.replace(/^---\r?\n[\s\S]*?\r?\n---/, blank);   // frontmatter
  s = s.replace(/```[\s\S]*?```/g, blank);             // fenced code
  s = s.replace(/~~~[\s\S]*?~~~/g, blank);
  s = s.replace(/`[^`\n]*`/g, blank);                  // inline code span
  s = s.replace(/\]\([^)\n]*\)/g, blank);              // link/image target
  return s;
}

const escapeRe = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Unicode-aware word boundary — JS \b is ASCII-only and would mis-fire on
// Vietnamese terms ("đơn mua"). Whitespace inside a phrase matches flexibly.
const wordRe = phrase =>
  new RegExp('(?<![\\p{L}\\p{N}_])' + escapeRe(phrase).replace(/\s+/g, '\\s+') + '(?![\\p{L}\\p{N}_])', 'giu');

function spansOf(text, phrase) {
  const out = [];
  const re = wordRe(phrase);
  let m;
  while ((m = re.exec(text)) !== null) {
    out.push([m.index, m.index + m[0].length]);
    if (m.index === re.lastIndex) re.lastIndex++;
  }
  return out;
}

/**
 * Find avoided aliases used in a document's prose.
 * Returns [{ alias, term, line, lineNo }] — empty when the glossary declares no
 * `_Avoid_` entries (a glossary without them is documentation, not a rule).
 */
function findViolations(docText, glossary) {
  if (!glossary || !glossary.aliases.length) return [];
  const prose = stripNonProse(docText);
  const allowSpans = [];
  for (const phrase of glossary.allow) allowSpans.push(...spansOf(prose, phrase));
  // Every CANONICAL term is an implicit allow-span. One glossary's avoided
  // alias is routinely a word inside another glossary term ("tier" is ruled out
  // for Layer, yet "Risk tier" is itself canonical) — without this, using the
  // right word warns, and the author is pushed to hand-write `_Allow_` for a
  // collision the glossary already describes. Longest-first so a term nested in
  // a longer term still yields the widest cover.
  for (const t of [...glossary.terms].sort((a, b) => b.term.length - a.term.length)) {
    allowSpans.push(...spansOf(prose, t.term));
  }
  const covered = (a, b) => allowSpans.some(([s, e]) => a >= s && b <= e);

  // Line index for offset → line number, computed once.
  const lineStarts = [0];
  for (let i = 0; i < prose.length; i++) if (prose[i] === '\n') lineStarts.push(i + 1);
  const lineOf = off => { let lo = 0, hi = lineStarts.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (lineStarts[mid] <= off) lo = mid; else hi = mid - 1; } return lo; };
  const rawLines = String(docText || '').split('\n');

  const hits = [];
  const seen = new Set();
  for (const { alias, term } of glossary.aliases) {
    for (const [s, e] of spansOf(prose, alias)) {
      if (covered(s, e)) continue;
      const idx = lineOf(s);
      const key = alias.toLowerCase() + '@' + idx;
      if (seen.has(key)) continue;
      seen.add(key);
      hits.push({ alias, term, lineNo: idx + 1, line: (rawLines[idx] || '').trim() });
    }
  }
  return hits.sort((a, b) => a.lineNo - b.lineNo);
}

module.exports = { parseGlossary, readGlossary, stripNonProse, findViolations, termsAtLines, addedLinesFromDiff };
