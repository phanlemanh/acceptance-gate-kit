#!/usr/bin/env node
// acceptance-gold.mjs — sổ vàng + đồng thuận giám khảo (judge-required-evidence,
// O4 của chương trình 80/20). THUẦN DẪN XUẤT, chỉ đọc:
//   - Sổ vàng: mỗi block judgment trong evidence-report.md có `human_override`
//     thật = 1 điểm (việc gì · máy đề xuất gì · người quyết gì + vì sao).
//   - Đồng thuận (G3): dòng {"kind":"panel"} trong run-log.jsonl → 3/3 · 2/1 ·
//     phân kỳ + per-lens hay-nói-chưa-chắc.
// Không ghi file nào. Run-log cũ không có dòng panel → slug ghi chú "chưa có
// dữ liệu panel", không vào mẫu số. Usage:
//   node acceptance-gold.mjs --root <repo-root> [--json]
import fs from 'node:fs';
import path from 'node:path';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function collectGold(root) {
  const acc = path.join(root, '_acceptance');
  const points = []; const noPanel = []; const panels = [];
  let judgedBlocks = 0;
  if (!fs.existsSync(acc)) return { points, panels, noPanel, judgedBlocks };
  for (const slug of fs.readdirSync(acc).sort()) {
    const dir = path.join(acc, slug);
    const rp = path.join(dir, 'evidence-report.md');
    if (!fs.existsSync(rp) || !fs.statSync(dir).isDirectory()) continue;
    // ── điểm vàng từ block judgment có human_override thật ──
    const report = fs.readFileSync(rp, 'utf8');
    let cur = null; let verdict = null; let judged = false;
    for (const raw of report.split('\n')) {
      const em = raw.match(/^-\s+eval:\s*(\S+)/);
      if (em) { cur = em[1]; verdict = null; judged = false; continue; }
      if (/^#{1,6}\s/.test(raw)) { cur = null; continue; }
      if (!cur) continue;
      if (/^\s+judged_by\s*:/.test(raw)) judged = true;
      const vm = raw.match(/^\s+(?:verdict|proposal)\s*:\s*(\S+)/); if (vm && !verdict) verdict = vm[1];
      const om = raw.match(/^\s+human_override\s*:\s*(.+\S)\s*$/);
      if (om && judged && !/^#|^<|^\{\{/.test(om[1])) {
        judgedBlocks++;
        points.push({ slug, evalId: cur, machine: verdict || '(không đọc được)', human: om[1] });
      }
    }
    // ── panel lines cho G3 ──
    const lp = path.join(dir, 'run-log.jsonl');
    let found = false;
    if (fs.existsSync(lp)) {
      for (const line of fs.readFileSync(lp, 'utf8').split('\n')) {
        if (!line.trim()) continue;
        try {
          const e = JSON.parse(line);
          if (e && e.kind === 'panel' && Array.isArray(e.votes) && e.votes.length) {
            found = true;
            panels.push({ slug, evalId: e.evalId, proposal: e.proposal, votes: e.votes, carried: ('carried_from_round' in e) });
          }
        } catch (_) { /* dòng hỏng bỏ qua */ }
      }
    }
    if (!found) noPanel.push(slug);
  }
  return { points, panels, noPanel, judgedBlocks };
}

export function agreement(panels) {
  // Chỉ tính panel CHẤM TƯƠI (carried là bản sao của lần chấm gốc — đếm nữa là
  // nhân đôi mẫu). Phân loại theo verdict các vote: 3/3 cùng ý · 2/1 · phân kỳ.
  const fresh = panels.filter(p => !p.carried && p.votes.length >= 2);
  const buckets = { unanimous: 0, majority: 0, split: 0 };
  const lensUncertain = {}; const lensTotal = {};
  for (const p of fresh) {
    const counts = {};
    for (const v of p.votes) {
      counts[v.verdict] = (counts[v.verdict] || 0) + 1;
      lensTotal[v.lens] = (lensTotal[v.lens] || 0) + 1;
      if (v.verdict !== 'PASS') lensUncertain[v.lens] = (lensUncertain[v.lens] || 0) + 1;
    }
    const top = Math.max(...Object.values(counts));
    if (top === p.votes.length) buckets.unanimous++;
    else if (top >= Math.ceil(p.votes.length / 2) + (p.votes.length % 2 === 0 ? 1 : 0)) buckets.majority++;
    else buckets.split++;
  }
  return { sample: fresh.length, buckets, lensUncertain, lensTotal };
}

// Tiếng người cho bảng (sửa theo required_evidence của panel J13, S4-r1):
// - "Việc" = câu mô tả sản phẩm rút từ frontmatter `feature:` của contract
//   (phần trước dấu gạch dài), slug máy lùi vào ngoặc (luật N1/N2).
// - "Hạng mục" = mã + 3-8 chữ chú giải rút từ câu hỏi/expected của eval (N3).
// - Lời người quyết trích gọn 1 câu — nguyên văn đầy đủ nằm trong evidence
//   report của việc đó, không viết lại lời người (N4).
function featureOf(root, slug) {
  try {
    const t = fs.readFileSync(path.join(root, '_acceptance', slug, 'contract.md'), 'utf8');
    const m = t.match(/^feature:\s*"?([^"\n]+)/m);
    if (m) {
      // mô tả contract mở đầu bằng chính slug — phần NGƯỜI đọc là sau gạch dài
      const parts = m[1].split(' — ');
      const desc = (parts.length > 1 ? parts.slice(1).join(' — ') : parts[0]).trim();
      return desc.length > 72 ? desc.slice(0, 72).replace(/\s+\S*$/, '') + '…' : desc;
    }
  } catch (_) {}
  return null;
}
function glossOf(root, slug, evalId) {
  try {
    const y = fs.readFileSync(path.join(root, '_acceptance', slug, 'evals.yaml'), 'utf8');
    const b = y.split(/\n(?=  - id: )/).find(x => x.trim().startsWith(`- id: ${evalId}`));
    if (b) {
      const q = b.match(/question: >\n\s+([^\n]+)/) || b.match(/expected: "([^"\n]{10,})/);
      if (q) return q[1].trim().slice(0, 60).replace(/\s+\S*$/, '') + '…';
    }
  } catch (_) {}
  return '';
}
const LENS_VI = {
  'domain-correctness': 'đúng nghiệp vụ (domain-correctness)',
  'operational-feasibility': 'vận hành được (operational-feasibility)',
  'spec-alignment': 'khớp đặc tả (spec-alignment)',
};
const firstSentence = (t) => {
  // giữ tên+ngày VÀ câu đầu của lý do (cắt kiểu cũ làm rụng mất "vì sao")
  const dash = t.indexOf(' — ');
  if (dash < 0) return t.length > 140 ? t.slice(0, 140).replace(/\s+\S*$/, '') + '…' : t;
  const name = t.slice(0, dash);
  const reason = t.slice(dash + 3);
  const sent = (reason.split(/(?<=\.)\s/)[0] || reason);
  const shown = `${name} — ${sent}`;
  return shown.length > 180 ? shown.slice(0, 180).replace(/\s+\S*$/, '') + '…' : shown;
};

export function render({ points, panels, noPanel, judgedBlocks, root }) {
  const out = [];
  out.push('## Sổ vàng — người đã quyết gì trên đề xuất của máy');
  out.push('');
  if (!points.length) out.push('Chưa có điểm nào — chưa lần nào người ký đè/chuẩn y một phán quyết máy tại Cổng 2.');
  else {
    out.push(`${points.length} lần người quyết trên đề xuất của máy (rút từ chữ ký Cổng 2 đã có, không bịa; nguyên văn đầy đủ nằm trong hồ sơ từng việc):`);
    out.push('');
    out.push('| Việc | Hạng mục được chấm | Máy đề xuất | Người quyết (trích 1 câu) |');
    out.push('|---|---|---|---|');
    for (const p of points) {
      const feat = featureOf(root, p.slug);
      const viec = feat ? `${feat} (${p.slug})` : p.slug;
      const gloss = glossOf(root, p.slug, p.evalId);
      const hm = gloss ? `${p.evalId} — ${gloss}` : p.evalId;
      out.push(`| ${viec.replace(/\|/g, '·')} | ${hm.replace(/\|/g, '·')} | ${p.machine} | ${firstSentence(p.human).replace(/\|/g, '·')} |`);
    }
  }
  out.push('');
  const g = agreement(panels);
  out.push('## Các giám khảo đồng thuận tới đâu');
  out.push('');
  if (!g.sample) out.push('Chưa có hội đồng chấm nào được ghi lại — các việc cũ chấm trước khi máy bắt đầu ghi biên bản hội đồng.');
  else {
    out.push(`${g.sample} lần hội đồng chấm tươi: ${g.buckets.unanimous} lần cả ba cùng ý · ${g.buckets.majority} lần 2-trên-1 · ${g.buckets.split} lần phân kỳ hẳn.`);
    const rates = Object.keys(g.lensTotal).map(l => `${LENS_VI[l] || l}: ${g.lensUncertain[l] || 0}/${g.lensTotal[l]} lần nói "chưa chắc/chưa đạt"`);
    if (rates.length) out.push(`Theo góc nhìn: ${rates.join(' · ')}.`);
  }
  if (noPanel.length) out.push(`(${noPanel.length} việc chưa có biên bản hội đồng — chấm trước khi máy bắt đầu ghi chép: ${noPanel.join(', ')})`);
  return out.join('\n');
}

const isMain = (() => {
  try { return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1] || ''); }
  catch (_) { return false; }
})();
if (isMain) {
  const ri = process.argv.indexOf('--root');
  const root = ri >= 0 ? path.resolve(process.argv[ri + 1] || '.') : process.cwd();
  const data = collectGold(root);
  if (process.argv.includes('--json')) process.stdout.write(JSON.stringify({ ...data, agreement: agreement(data.panels) }, null, 2) + '\n');
  else process.stdout.write(render({ ...data, root }) + '\n');
}
