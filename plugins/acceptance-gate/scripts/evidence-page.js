#!/usr/bin/env node
'use strict';
/* evidence-page.js — render a full, human-inspectable EVIDENCE PAGE (Skill-Creator
 * style) from _acceptance/<slug>/evidence-report.md, so a human at Gate 2 can SEE
 * the artifacts (screenshots, real output) instead of trusting a verdict table.
 *
 * Self-contained static HTML (file:// openable, zero deps, no CDN, no server).
 * Per eval it shows: verifier + run_id + exit + verified_at, the real output
 * excerpt, the screenshot(s) — a CSS slideshow when an eval has multiple frames
 * (evidence/<evalId>-*.png), degrading to a single image / "no screenshot" — judge
 * rationale, and the human_override line. Plus the non-discriminating Analyst
 * note, Variance, Iterations, the Gate-2 checklist, and confirmed review findings.
 *
 * Presentation ONLY — decides nothing; evidence-report.md + the hook stay the
 * source of truth. Image src are RELATIVE (the page sits next to evidence/), so
 * the real PNGs render in a browser without base64 bloat.
 *
 * Usage: evidence-page.js --root <repo> --slug <slug>
 *   writes _acceptance/<slug>/evidence-page.html and prints its absolute path.
 */
const fs = require('fs');
const path = require('path');

const a = process.argv.slice(2);
const opt = n => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : null; };
const root = opt('--root') || '.';
const slug = opt('--slug');
if (!slug || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(slug)) {
  process.stderr.write('evidence-page: --slug <name> required (single path segment)\n');
  process.exit(2);
}
const dir = path.join(root, '_acceptance', slug);
const read = p => { try { return fs.readFileSync(p, 'utf8'); } catch (_) { return ''; } };
const report = read(path.join(dir, 'evidence-report.md'));
if (!report.trim()) { process.stderr.write('evidence-page: no evidence-report.md at ' + dir + '\n'); process.exit(2); }
const contract = read(path.join(dir, 'contract.md'));
const findings = read(path.join(dir, 'review-findings.md'));

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const clean = s => String(s == null ? '' : s).replace(/["']/g, '').replace(/\s*#.*$/, '').trim();

function frontmatter(t) { const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---/); const o = {}; if (m) for (const l of m[1].split('\n')) { const mm = l.match(/^(\w+)\s*:\s*(.*)$/); if (mm) o[mm[1]] = mm[2].trim(); } return o; }
// lines under `## <h>` until the next level-2+ heading
function section(t, h) { const out = []; let inS = false; const re = new RegExp('^#{2,6}\\s+' + h + '\\b', 'i'); for (const l of t.split('\n')) { if (/^#{2,6}\s/.test(l)) inS = re.test(l); else if (inS) out.push(l); } return out; }
const cleanLines = arr => arr.filter(l => l.trim() && !/^\s*#/.test(l));

const rfm = frontmatter(report), cfm = frontmatter(contract);
const feature = cfm.feature || rfm.feature_slug || slug;
const tier = clean(cfm.risk_tier);
const verdict = clean(rfm.verdict).toUpperCase();
const verifiedBy = (rfm.verified_by || '').trim();
const signoff = clean(rfm.human_signoff);
const enforcement = clean(rfm.enforcement_mode);
const bypass = clean(rfm.bypass_used).toLowerCase();
const reason = (rfm.reason || '').replace(/^["']|["']$/g, '').trim();

// criteria text from contract
const critText = {};
for (const l of section(contract, 'Criteria')) { const m = l.match(/^\s*-\s*(AC-\d+)\s*:\s*(.+)$/); if (m && !critText[m[1]]) critText[m[1]] = m[2].replace(/\(judgment\)/i, '').trim(); }

// per-eval summary table rows
const rows = [];
for (const l of report.split('\n')) { const m = l.match(/^\|\s*(E\w+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/); if (m && m[1] !== 'Eval' && !/^-+$/.test(m[2].trim())) rows.push({ id: m[1], crit: m[2].trim(), exec: m[3].trim().toLowerCase(), verdict: m[4].trim().toUpperCase() }); }

// per-eval evidence blocks (CAPTURE the output: | block content for display)
const SCALAR = ['run_id', 'exit_code', 'baseline', 'verifier', 'verified_at', 'screenshot', 'judged_by', 'verdict', 'rationale', 'human_override', 'runs', 'pass_rate', 'reason'];
const evid = {};
{
  let cur = null, capKey = null, capIndent = -1, cap = [];
  const flush = () => { if (cur && capKey) cur[capKey] = dedent(cap); capKey = null; capIndent = -1; cap = []; };
  for (const raw of section(report, 'Evidence')) {
    const em = raw.match(/^-\s+eval:\s*(\S+)/);
    if (em) { flush(); cur = {}; evid[em[1]] = cur; continue; }
    if (!cur) continue;
    if (capKey) {
      const ind = raw.match(/^(\s*)/)[1].length;
      if (raw.trim() === '' || ind > capIndent) { cap.push(raw); continue; }
      flush();
    }
    const fm = raw.match(/^(\s*)(\w+):\s*(.*)$/);
    if (!fm) continue;
    const indent = fm[1].length, key = fm[2], val = fm[3];
    if (/^[|>]/.test(val.trim())) { capKey = key; capIndent = indent; cap = []; continue; }
    if (SCALAR.indexOf(key) >= 0) cur[key] = val.trim();
  }
  flush();
}
function dedent(lines) { const nb = lines.filter(l => l.trim()); if (!nb.length) return ''; const min = Math.min.apply(null, nb.map(l => l.match(/^(\s*)/)[1].length)); return lines.map(l => l.slice(min)).join('\n').replace(/\s+$/, ''); }

// Allowlist a screenshot value to a bounded evidence/-relative image filename.
// Rejects http(s):// / file:// / absolute / .. traversal (a hand-edited report's
// `screenshot:` must not become a load-on-open beacon or a local-file probe), and
// normalizes the prefix so it dedups against the readdir glob.
function safeShot(s) {
  if (!s) return null;
  const b = String(s).replace(/^\.\//, '').replace(/^evidence\//, '');
  return /^[A-Za-z0-9._-]+\.(png|jpe?g|gif|webp)$/i.test(b) && b.indexOf('..') < 0 ? 'evidence/' + b : null;
}
// screenshot frames per eval: the screenshot: field + any evidence/<id>-*.png (sorted) → slideshow when >1
function framesFor(id, shot) {
  const set = [];
  const ss = safeShot(shot);
  if (ss) set.push(ss);
  try {
    fs.readdirSync(path.join(dir, 'evidence'))
      .filter(f => new RegExp('^' + id.replace(/[^\w]/g, '') + '[-_.].*\\.(png|jpe?g|gif|webp)$', 'i').test(f)).sort()
      .forEach(f => { const rel = 'evidence/' + f; if (set.indexOf(rel) < 0) set.push(rel); });
  } catch (_) {}
  return set;
}

const analyst = cleanLines(section(report, 'Analyst')).join('\n').trim();
const variance = cleanLines(section(report, 'Variance')).join('\n').trim();
const iterations = section(report, 'Iterations').map(l => l.replace(/^#.*$/, '').trim()).filter(Boolean);
const checklist = report.split('\n').filter(l => /^\s*-\s*\[[ xX]\]/.test(l)).map(l => ({ done: /\[[xX]\]/.test(l), text: l.replace(/^\s*-\s*\[[ xX]\]\s*/, '').trim() }));
const reviewFindings = [];
{ let f = null; for (const l of findings.split('\n')) { const t = l.match(/^\s*-?\s*(?:title|finding)\s*:\s*(.+)$/i); if (t) { if (f) reviewFindings.push(f); f = { title: t[1].trim() }; continue; } if (!f) continue; const m = l.match(/^\s*(severity|file|detail|source|line)\s*:\s*(.+)$/i); if (m) f[m[1].toLowerCase()] = m[2].trim(); } if (f) reviewFindings.push(f); }

const VCOLOR = { PASS: 'pass', 'PENDING-JUDGMENT': 'pend', REJECT: 'rej', BLOCKED: 'rej', UNCERTAIN: 'pend', FAIL: 'rej' };
const vc = v => VCOLOR[(v || '').toUpperCase()] || 'neutral';

// ---- HTML ----
const P = [];
P.push(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bằng chứng · ${esc(slug)}</title>
<style>
:root{--bg:#faf9f6;--card:#fff;--bd:#e6e4de;--ink:#1f1f1d;--mut:#6c6a64;--hint:#9a988f}
*{box-sizing:border-box}body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg);color:var(--ink);margin:0;line-height:1.5;font-size:15px}
.wrap{max-width:920px;margin:0 auto;padding:24px 20px 64px}
h1{font-size:20px;margin:0 0 2px}h2{font-size:15px;margin:30px 0 10px;letter-spacing:.02em}
.sub{font-size:13px;color:var(--mut)}
.badge{display:inline-block;font-size:12px;font-weight:600;padding:3px 11px;border-radius:999px;vertical-align:middle}
.pass{background:#E1F5EE;color:#085041}.pend{background:#FAEEDA;color:#633806}.rej{background:#FAECE7;color:#712B13}.neutral{background:#f1efe8;color:#444441}
.card{background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:14px 16px;margin-bottom:12px}
.meta{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:13px;color:var(--mut);margin-top:6px}
.meta b{color:var(--ink);font-weight:600}
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{text-align:left;padding:8px 9px;border-bottom:1px solid var(--bd)}th{color:var(--mut);font-weight:600;font-size:12px}
td a{color:#185FA5;text-decoration:none}.mono{font-family:ui-monospace,Menlo,monospace;font-size:12px}
.eval{scroll-margin-top:14px}.eval h3{font-size:14px;margin:0 0 4px}.eval .crit{font-size:13px;color:var(--mut);margin:0 0 8px}
pre.out{background:#1f1f1d;color:#e8e6df;border-radius:8px;padding:11px 13px;overflow:auto;max-height:280px;font-size:12px;margin:8px 0}
.kv{font-size:12px;color:var(--mut);display:flex;flex-wrap:wrap;gap:4px 16px;margin:6px 0}.kv b{color:var(--ink)}
.shot img{display:block;max-width:100%;border:1px solid var(--bd);border-radius:8px}
.slide{position:relative}.slide .frame{position:absolute;inset:0;opacity:0;transition:opacity .35s}.slide .frame:first-child{position:relative}.slide .frame.on{opacity:1}
.slidebar{display:flex;gap:8px;align-items:center;font-size:12px;color:var(--mut);margin-top:6px}
.btn{font-size:12px;padding:4px 11px;border:1px solid var(--bd);border-radius:7px;background:#fff;cursor:pointer}
.ov{background:#FAEEDA;color:#633806;border-radius:7px;padding:6px 10px;font-size:12px;display:inline-block}
.ovok{background:#E1F5EE;color:#085041}
.note{font-size:13px;color:var(--mut)}.flag{font-size:13px;border-radius:8px;padding:8px 11px;margin:6px 0}
.fred{background:#FAECE7;color:#712B13}.fok{background:#E1F5EE;color:#085041}
.foot{margin-top:30px;padding-top:14px;border-top:1px solid var(--bd);font-size:12px;color:var(--hint)}
ul.ck{list-style:none;padding:0;margin:0}ul.ck li{padding:5px 0;font-size:14px}ul.ck input{margin-right:8px}
.tl{border-left:2px solid var(--bd);padding-left:14px;margin:0}.tl li{font-size:13px;margin:0 0 6px;list-style:none}
</style></head><body><div class="wrap">`);

// header
P.push(`<h1>${esc(feature)}</h1><div class="sub">Trang bằng chứng · <span class="mono">${esc(slug)}</span>${tier ? ' · tier ' + esc(tier) : ''}</div>
<div class="card" style="margin-top:12px"><span class="badge ${vc(verdict)}">${esc(verdict || '—')}</span>
<div class="meta"><span>Verified by: <b>${esc(verifiedBy || '—')}</b></span><span>Human signoff: <b>${signoff ? esc(signoff) : 'CHƯA ký'}</b></span>${enforcement ? `<span>enforcement: <b>${esc(enforcement)}</b></span>` : ''}${bypass === 'true' ? '<span class="badge rej">bypass_used</span>' : ''}${reason ? `<span>reason: <b>${esc(reason)}</b></span>` : ''}</div></div>`);

// eval table
P.push(`<h2>Các eval</h2><div class="card" style="padding:4px 8px"><table><thead><tr><th>Eval</th><th>Tiêu chí</th><th>Loại</th><th>Verdict</th><th>run_id</th><th>verified_at</th></tr></thead><tbody>`);
for (const r of rows) { const e = evid[r.id] || {}; P.push(`<tr><td><a href="#${esc(r.id)}">${esc(r.id)}</a></td><td>${esc(r.crit)}</td><td>${esc(r.exec)}</td><td><span class="badge ${vc(r.verdict)}">${esc(r.verdict)}</span></td><td class="mono">${esc(e.run_id || '—')}</td><td class="mono">${esc(e.verified_at || '—')}</td></tr>`); }
P.push(`</tbody></table></div>`);

// per-eval detail
P.push(`<h2>Chi tiết từng eval</h2>`);
for (const r of rows) {
  const e = evid[r.id] || {};
  P.push(`<div class="card eval" id="${esc(r.id)}"><h3><span class="badge ${vc(r.verdict)}">${esc(r.verdict)}</span> &nbsp;${esc(r.id)} · ${esc(r.exec)}</h3>${critText[r.crit] ? `<p class="crit">${esc(r.crit)}: ${esc(critText[r.crit])}</p>` : `<p class="crit">${esc(r.crit)}</p>`}`);
  const kv = [];
  if (e.run_id) kv.push(`run_id <b>${esc(e.run_id)}</b>`);
  if (e.exit_code != null) kv.push(`exit_code <b>${esc(e.exit_code)}</b>`);
  if (e.verifier) kv.push(`verifier <b class="mono">${esc(e.verifier)}</b>`);
  if (e.verified_at) kv.push(`verified_at <b>${esc(e.verified_at)}</b>`);
  if (e.baseline) kv.push(`baseline <b>${esc(e.baseline)}</b>`);
  if (e.pass_rate) kv.push(`pass_rate <b>${esc(e.pass_rate)}</b>`);
  if (e.judged_by) kv.push(`judged_by <b>${esc(e.judged_by)}</b>`);
  if (kv.length) P.push(`<div class="kv">${kv.map(x => '<span>' + x + '</span>').join('')}</div>`);
  if (e.rationale) P.push(`<p class="note"><b>Phán đoán:</b> ${esc(e.rationale)}</p>`);
  // screenshots / slideshow
  const frames = r.exec === 'ui-check' ? framesFor(r.id, e.screenshot) : (e.screenshot ? framesFor(r.id, e.screenshot) : []);
  if (frames.length === 1) {
    P.push(`<div class="shot"><img src="${esc(frames[0])}" alt="screenshot ${esc(r.id)}" loading="lazy"></div><div class="kv"><span>${esc(frames[0])}</span></div>`);
  } else if (frames.length > 1) {
    P.push(`<div class="shot slide" data-n="${frames.length}">${frames.map((f, i) => `<div class="frame"><img src="${esc(f)}" alt="frame ${i + 1}" loading="lazy"></div>`).join('')}</div><div class="slidebar"><button class="btn" data-toggle>⏸ Tạm dừng</button><span>${frames.length} frame · chạy như GIF</span></div>`);
  } else if (r.exec === 'ui-check') {
    P.push(`<div class="flag fred">Không có screenshot — ui-check có thể đã downgrade sang judgment (không có browser).</div>`);
  }
  // output
  if (e.output) P.push(`<pre class="out">${esc(e.output)}</pre>`);
  // human_override
  if (r.exec === 'judgment' || e.judged_by) { const ov = e.human_override && e.human_override.trim(); P.push(`<div class="${ov ? 'ov ovok' : 'ov'}">human_override: ${ov ? esc(e.human_override) : 'CHƯA điền (việc của bạn ở Gate 2)'}</div>`); }
  P.push(`</div>`);
}

// analyst / variance
if (analyst && !/^none/i.test(analyst)) P.push(`<h2>Eval không phân biệt (Analyst)</h2><div class="flag fred">${esc(analyst)}</div>`);
if (variance && !/^none/i.test(variance)) P.push(`<h2>Variance (eval ngẫu nhiên)</h2><div class="flag fred">${esc(variance)}</div>`);

// review findings
if (reviewFindings.length) {
  P.push(`<h2>Review findings (đã adversarial-verify)</h2><div class="card" style="padding:4px 8px"><table><thead><tr><th>Severity</th><th>Finding</th><th>Vị trí</th></tr></thead><tbody>`);
  for (const f of reviewFindings) P.push(`<tr><td><span class="badge ${/high|blocker|crit/i.test(f.severity || '') ? 'rej' : 'pend'}">${esc(f.severity || '—')}</span></td><td>${esc(f.title)}${f.detail ? `<div class="note">${esc(f.detail)}</div>` : ''}</td><td class="mono">${esc(f.file || '')}</td></tr>`);
  P.push(`</tbody></table></div>`);
}

// iterations
if (iterations.length) P.push(`<h2>Vòng verify</h2><ul class="tl">${iterations.map(l => `<li>${esc(l)}</li>`).join('')}</ul>`);

// gate-2 checklist
if (checklist.length) P.push(`<h2>Checklist Cổng 2 (bạn)</h2><div class="card"><ul class="ck">${checklist.map((c, i) => `<li><input type="checkbox" id="ck${i}"${c.done ? ' checked' : ''}><label for="ck${i}">${esc(c.text)}</label></li>`).join('')}</ul><div class="note">Tick để theo dõi — chỉ lưu trong trình duyệt; quyết định THẬT vào human_signoff / human_override của report.</div></div>`);

P.push(`<div class="foot">Trang trình bày · KHÔNG quyết — <span class="mono">evidence-report.md</span> + hook là nguồn-sự-thật. Sinh từ run đã verify; ảnh/output gắn run_id.</div>
<script>
document.querySelectorAll('.slide').forEach(function(s){var fr=s.querySelectorAll('.frame');if(fr.length<2)return;var i=0;fr[0].classList.add('on');var adv=function(){fr[i].classList.remove('on');i=(i+1)%fr.length;fr[i].classList.add('on');};s._t=setInterval(adv,1600);var bar=s.nextElementSibling,b=bar?bar.querySelector('[data-toggle]'):null;if(b)b.addEventListener('click',function(){if(s._t){clearInterval(s._t);s._t=null;b.textContent='▶ Chạy';}else{s._t=setInterval(adv,1600);b.textContent='⏸ Tạm dừng';}});});
</script>
</div></body></html>`);

const outPath = path.join(dir, 'evidence-page.html');
fs.writeFileSync(outPath, P.join('\n'));
process.stdout.write(path.resolve(outPath) + '\n');
