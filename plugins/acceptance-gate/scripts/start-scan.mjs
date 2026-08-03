#!/usr/bin/env node
// start-scan.mjs — bộ quét vào phiên của /start: đọc _acceptance/*/ và xếp mỗi
// slug đúng MỘT ô theo bảng phân ô trong docs/specs/2026-08-03-start-command-design.md.
// CHỈ-ĐỌC tuyệt đối. Đầu ra: JSON một dòng (schema_version 1) — các key mà
// commands/start.md đọc được ghim trong khối START-SCAN-KEYS của chính file đó;
// case P99 round-trip giữ hai đầu khớp, P98 giữ bảng phân ô.
// Hai nguồn từng vắng (PRODUCT-MAP, phiên nghiệm thu) đã dựng ở F-B, nên
// mảng skipped[] không còn nguồn sinh nào và đã được gỡ: một khoá khai mà
// không thứ gì sinh ra được là hợp đồng chết — case round-trip P99 đòi mọi
// khoá khai phải soi được trong đầu ra THẬT. Cần bỏ-qua-có-tên trở lại thì
// nó quay lại CÙNG nguồn sinh của nó.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderProductMap } from './product-map.mjs';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { frontmatterField } = require(path.join(__dirname, '..', 'lib', 'evidence-core.js'));
// Cùng luật "hồ sơ có hỏng không" với bản đồ sản phẩm — hai bên đọc cùng bộ
// hồ sơ thì không được cho hai kết luận trái nhau (S4-r1, case P110).
const { recordProblem, navValues } =
  require(path.join(__dirname, '..', 'lib', 'workspace-record.js'));

const args = process.argv.slice(2);
const rootIx = args.indexOf('--root');
const root = path.resolve(rootIx >= 0 && args[rootIx + 1] ? args[rootIx + 1] : '.');
const out = obj => process.stdout.write(JSON.stringify(obj) + '\n');

const acc = path.join(root, '_acceptance');
if (!existsSync(path.join(acc, 'config.yaml'))) { out({ schema_version: 1, config: false }); process.exit(0); }

const read = p => { try { return readFileSync(p, 'utf8'); } catch { return null; } };
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
  const uPath = path.join(dir, 'uat-session.md');
  const cTxt = read(cPath), oTxt = read(oPath), uTxt = read(uPath);
  const texts = { 'contract.md': cTxt, 'opportunity.md': oTxt, 'uat-session.md': uTxt };

  // Luật chung TRƯỚC mọi phân ô: hồ sơ này đọc được không.
  const problem = recordProblem(texts);
  if (problem) { broken.push({ slug, file: problem.file, reason: problem.reason }); continue; }
  const nav = navValues(texts);

  // Hồ sơ phiên nghiệm thu là artifact MUỘN NHẤT — tra trước contract.
  // verdict RỖNG = phiên đã dựng nhưng CHƯA ký → vẫn là ô chờ-Cổng-Giá-trị,
  // rơi xuống nhánh contract bên dưới.
  if (nav.verdict) {
    const UAT_STATE = { release: 'released', iterate: 'uat-iterate', kill: 'uat-kill' };
    done.push({ slug, state: UAT_STATE[nav.verdict] });
    continue;
  }
  if (cTxt != null) {
    const status = nav.status;
    const tier = frontmatterField(cTxt, 'risk_tier') || null;
    const eTxt = read(path.join(dir, 'evidence-report.md'));
    if (eTxt != null && fmOrNull(eTxt, 'verdict') == null) { broken.push({ slug, file: 'evidence-report.md', reason: 'frontmatter không parse được hoặc thiếu verdict' }); continue; }
    const verdict = eTxt != null ? frontmatterField(eTxt, 'verdict').toUpperCase() : null;
    if (status === 'signed-off') {
      // Đường A (cơ hội đã quyết build/iterate) còn MỘT cổng người nữa: phiên
      // nghiệm thu. Đường B/C/E ship thẳng — không dựng phiên giả cho chúng.
      if (nav.decision === 'build' || nav.decision === 'iterate')
        gates.push({ slug, gate: 'gia-tri', since: since(cPath, fmOrNull(uTxt, 'decided_at')), tier });
      else done.push({ slug, state: 'signed-off' });
    }
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
    // status ngoài enum / rỗng đã bị luật chung bắt ở đầu vòng lặp
  } else if (oTxt != null) {
    const { stage, decision } = nav;
    if (stage !== 'decided' || !decision) gates.push({ slug, gate: 'dang', since: since(oPath, frontmatterField(oTxt, 'decided_at')), tier: null });
    else if (decision === 'build' || decision === 'iterate') inProgress.push({ slug, status: 'opportunity-decided', nextStep: 'S1', tier: null });
    else done.push({ slug, state: decision });   // park | kill — enum đã kiểm ở luật chung
  }
}
gates.sort((a, b) => String(a.since).localeCompare(String(b.since)));

const mapPath = path.join(root, 'PRODUCT-MAP.md');
const map = { present: existsSync(mapPath), fresh: null };
if (map.present) {
  // fresh = null khi KHÔNG kiểm được (không phải "khớp"): thẻ nói "chưa kiểm
  // được bản đồ", không nói xanh.
  try { map.fresh = readFileSync(mapPath, 'utf8') === renderProductMap(root); }
  catch { map.fresh = null; }
}

out({ schema_version: 1, config: true, git, groups: { gates, inProgress, done }, map, broken });
