#!/usr/bin/env node
// start-scan.mjs — bộ quét vào phiên của /start: đọc _acceptance/*/ và xếp mỗi
// slug đúng MỘT ô theo bảng phân ô trong docs/specs/2026-08-03-start-command-design.md.
// CHỈ-ĐỌC tuyệt đối. Đầu ra: JSON một dòng (schema_version 1) — các key mà
// commands/start.md đọc được ghim trong khối START-SCAN-KEYS của chính file đó;
// case P99 round-trip giữ hai đầu khớp, P98 giữ bảng phân ô.
// Ô chưa có nguồn (PRODUCT-MAP, phiên nghiệm thu) emit skipped[] có tên —
// KHÔNG bịa dữ liệu thay thế (ledger d-descope 03/08 của start-command).
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { frontmatterField } = require(path.join(__dirname, '..', 'lib', 'evidence-core.js'));

const args = process.argv.slice(2);
const rootIx = args.indexOf('--root');
const root = path.resolve(rootIx >= 0 && args[rootIx + 1] ? args[rootIx + 1] : '.');
const out = obj => process.stdout.write(JSON.stringify(obj) + '\n');

const acc = path.join(root, '_acceptance');
if (!existsSync(path.join(acc, 'config.yaml'))) { out({ schema_version: 1, config: false }); process.exit(0); }

// ENOENT (file vắng) là tin bình thường; MỌI lỗi khác là sự thật phải nêu tên —
// nuốt chung một rọ biến "mất quyền đọc" thành "không có file", và slug bị phân
// ô theo artifact bên cạnh (Cổng 2 start-command, known-limit 1).
const read = p => {
  try { return { t: readFileSync(p, 'utf8'), err: null }; }
  catch (e) { return e.code === 'ENOENT' ? { t: null, err: null } : { t: null, err: e }; }
};
const ioReason = err => `không đọc được (${err.code})`;
// KHÔNG có parser fence thứ hai: tiêu chí "đọc được" là CHÍNH frontmatterField
// của evidence-core trả ra key bắt buộc (S4-r1: hasFm riêng đã chặt hơn reader
// chuẩn — CRLF/dòng trắng đầu file bị báo hỏng oan trong khi mọi cổng khác đọc được)
const fmOrNull = (t, key) => (t == null ? null : frontmatterField(t, key));
const git = (() => {
  try {
    const branch = execFileSync('git', ['-C', root, 'rev-parse', '--abbrev-ref', 'HEAD'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const dirty = execFileSync('git', ['-C', root, 'status', '--porcelain'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() !== '';
    return { branch, dirty };
  } catch { return { branch: null, dirty: null }; }
})();

const gates = [], inProgress = [], done = [], broken = [];
// Khớp CHẶT khuôn tên plan YYYY-MM-DD-<slug>.md — substring trần khiến slug là
// tiền tố của slug khác dính plan không phải của nó (S4-r1, nextStep S3 oan)
const planSlug = f => { const m = f.match(/^\d{4}-\d{2}-\d{2}-(.+)\.md$/); return m ? m[1] : null; };
const planExists = slug => [path.join(root, 'docs', 'superpowers', 'plans'), path.join(root, 'docs', 'plans')]
  .some(d => existsSync(d) && readdirSync(d).some(f => planSlug(f) === slug));
// since: timestamp frontmatter thắng mtime — cổng chờ lâu nhất không được trôi
// xuống cuối nhóm chỉ vì file bị format/sync chạm lại (AC-6, đối chứng P98)
const since = (file, fmTs) => fmTs || statSync(file).mtime.toISOString();

for (const entry of readdirSync(acc, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const slug = entry.name;
  const dir = path.join(acc, slug);
  const cPath = path.join(dir, 'contract.md'), oPath = path.join(dir, 'opportunity.md');
  const cRead = read(cPath), oRead = read(oPath);
  if (cRead.err) { broken.push({ slug, file: 'contract.md', reason: ioReason(cRead.err) }); continue; }
  if (oRead.err) { broken.push({ slug, file: 'opportunity.md', reason: ioReason(oRead.err) }); continue; }
  const cTxt = cRead.t, oTxt = oRead.t;
  if (cTxt != null) {
    const statusRaw = fmOrNull(cTxt, 'status');
    if (statusRaw == null) { broken.push({ slug, file: 'contract.md', reason: 'frontmatter không parse được hoặc thiếu status' }); continue; }
    const status = statusRaw.toLowerCase();
    const tier = frontmatterField(cTxt, 'risk_tier') || null;
    const eRead = read(path.join(dir, 'evidence-report.md'));
    if (eRead.err) { broken.push({ slug, file: 'evidence-report.md', reason: ioReason(eRead.err) }); continue; }
    const eTxt = eRead.t;
    if (eTxt != null && fmOrNull(eTxt, 'verdict') == null) { broken.push({ slug, file: 'evidence-report.md', reason: 'frontmatter không parse được hoặc thiếu verdict' }); continue; }
    const verdict = eTxt != null ? frontmatterField(eTxt, 'verdict').toUpperCase() : null;
    if (status === 'signed-off') done.push({ slug, state: 'signed-off' });
    else if (status === 'verified') {
      // Bảng phân ô spec: chờ-Cổng-Bằng-chứng = verdict PASS/PENDING-JUDGMENT
      // và CHƯA human_signoff — verified không kèm điều kiện là hiện "chờ ký" oan (S4-r1)
      const signoff = eTxt != null ? (frontmatterField(eTxt, 'human_signoff') || '') : '';
      if (verdict == null) broken.push({ slug, file: '(workspace)', reason: 'status verified nhưng thiếu evidence-report.md' });
      else if (signoff) done.push({ slug, state: 'signed-off' });
      else if (verdict === 'PASS' || verdict === 'PENDING-JUDGMENT') gates.push({ slug, gate: 'bang-chung', since: since(cPath, frontmatterField(cTxt, 'approved_at')), tier });
      else if (verdict === 'REJECT') inProgress.push({ slug, status, nextStep: 'S3-fix', tier });
      else broken.push({ slug, file: 'evidence-report.md', reason: `verdict không nhận diện được: ${verdict}` });
    }
    else if (status === 'implemented') inProgress.push({ slug, status, nextStep: verdict === 'REJECT' ? 'S3-fix' : 'S4', tier });
    else if (status === 'approved') inProgress.push({ slug, status, nextStep: planExists(slug) ? 'S3' : 'S2', tier });
    else if (status === 'draft') gates.push({ slug, gate: 'pham-vi', since: since(cPath, null), tier });
    else broken.push({ slug, file: 'contract.md', reason: `status không nhận diện được: ${status || '(rỗng)'}` });
  } else if (oTxt != null) {
    const stageRaw = fmOrNull(oTxt, 'stage');
    if (stageRaw == null) { broken.push({ slug, file: 'opportunity.md', reason: 'frontmatter không parse được hoặc thiếu stage' }); continue; }
    const stage = stageRaw.toLowerCase();
    const decision = (frontmatterField(oTxt, 'decision') || '').toLowerCase();
    if (stage !== 'decided' || !decision) gates.push({ slug, gate: 'dang', since: since(oPath, frontmatterField(oTxt, 'decided_at')), tier: null });
    else if (decision === 'build' || decision === 'iterate') inProgress.push({ slug, status: 'opportunity-decided', nextStep: 'S1', tier: null });
    else if (decision === 'park' || decision === 'kill') done.push({ slug, state: decision });
    else broken.push({ slug, file: 'opportunity.md', reason: `decision không nhận diện được: ${decision}` });
  } else {
    broken.push({ slug, file: '(workspace)', reason: 'không có contract.md lẫn opportunity.md' });
  }
}
gates.sort((a, b) => String(a.since).localeCompare(String(b.since)));

const skipped = [{ source: 'phiên-nghiệm-thu', reason: 'nguồn chưa dựng — F-B' }];
if (!existsSync(path.join(root, 'PRODUCT-MAP.md'))) skipped.unshift({ source: 'PRODUCT-MAP.md', reason: 'chưa có — F-B' });

out({ schema_version: 1, config: true, git, groups: { gates, inProgress, done }, skipped, broken });
