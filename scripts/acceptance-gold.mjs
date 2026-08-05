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
    // Guard block-scalar port từ gate-card.js (fix S4-r2, AC-8): dòng nằm trong
    // `output: |` / `rationale: |` là TRÍCH LOG, không phải field — parser ngây
    // thơ từng đúc "điểm người đã quyết" bịa từ excerpt. skip mọi dòng thụt sâu
    // hơn field mở block scalar.
    let cur = null; let verdict = null; let judged = false; let rationale = ''; let skip = -1;
    for (const raw of report.split('\n')) {
      const em = raw.match(/^-\s+eval:\s*(\S+)/);
      if (em) { cur = em[1]; verdict = null; judged = false; rationale = ''; skip = -1; continue; }
      if (/^#{1,6}\s/.test(raw)) { cur = null; skip = -1; continue; }
      if (!cur) continue;
      if (skip >= 0) { if (raw.trim() === '') continue; if ((raw.match(/^(\s*)/) || ['', ''])[1].length > skip) continue; skip = -1; }
      const fm = raw.match(/^(\s*)(\w+)\s*:\s*(.*)$/);
      if (fm && /^[|>]/.test(fm[3].trim())) { skip = fm[1].length; continue; }
      if (!fm) continue;
      const key = fm[2], val = fm[3].trim();
      if (key === 'judged_by') judged = true;
      else if ((key === 'verdict' || key === 'proposal') && !verdict) verdict = val.split(/\s/)[0];
      else if (key === 'rationale' && !rationale) rationale = val;
      else if (key === 'human_override' && val && judged && !/^#|^<|^\{\{/.test(val)) {
        judgedBlocks++;
        points.push({ slug, evalId: cur, machine: verdict || '(không đọc được)', human: val, rationale });
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
    // đọc TRỌN giá trị (kể cả quote lồng trong) rồi mới lột quote bao ngoài —
    // regex dừng-ở-quote-đầu từng cắt cụt mô tả có trích dẫn (fix r4)
    const m = t.match(/^feature:\s*(.+)$/m);
    if (m) {
      let v = m[1].trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      v = v.replace(/\\"/g, '"');
      // mệnh đề NGƯỜI đọc: contract kiểu "slug — mô tả" → lấy sau gạch;
      // kiểu "mô tả — phụ đề" → lấy TRƯỚC gạch (fix r4: đừng vứt vế chính)
      const parts = v.split(' — ');
      const desc = (parts.length > 1 && parts[0].trim() === slug ? parts.slice(1).join(' — ') : parts[0]).trim();
      return desc.length > 72 ? desc.slice(0, 72).replace(/\s+\S*$/, '') + '…' : desc;
    }
  } catch (_) {}
  return null;
}
function glossOf(root, slug, evalId, rationale) {
  try {
    const y = fs.readFileSync(path.join(root, '_acceptance', slug, 'evals.yaml'), 'utf8');
    // neo id HẾT CHUỖI (\n) — `- id: J1` không được khớp block của J10
    const b = y.split(/\n(?=  - id: )/).find(x => x.trim().startsWith(`- id: ${evalId}\n`) || x.trim() === `- id: ${evalId}`);
    if (b) {
      // đủ 3 kiểu YAML của question (fix r4): inline "..." · folded > · literal |
      const q = b.match(/question:\s*"([^"]{10,})/)
        || b.match(/question:\s*[>|]\n\s+([^\n]+)/)
        || b.match(/expected: "([^"\n]{10,})/);
      if (q) return q[1].trim().slice(0, 60).replace(/\s+\S*$/, '') + '…';
    }
  } catch (_) {}
  // feature cũ không tra được câu hỏi → dùng rationale của chính report (nội
  // dung judge đã chấm gì) — fix theo required_evidence J13-r2, không để mã trần
  if (rationale) return rationale.slice(0, 60).replace(/\s+\S*$/, '') + '…';
  return 'hạng mục người phán tại Cổng 2';
}
// Cột "Máy đề xuất" đọc bằng mắt người quyết kinh doanh: mã máy đi vào ngoặc
// (N3 — giải nghĩa lần đầu xuất hiện). Map đặt MỘT chỗ; giá trị lạ passthrough
// nguyên văn để đường đọc-cũ không bị nuốt.
const VERDICT_VI = {
  PASS: 'đạt',
  FAIL: 'chưa đạt',
  UNCERTAIN: 'chưa chắc',
};
const verdictVi = (v) => (VERDICT_VI[v] ? `${VERDICT_VI[v]} (${v})` : v);
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
  let sent = (reason.split(/(?<=\.)\s/)[0] || reason);
  // đuôi sau dấu ':' thứ hai thường là liệt kê kỹ thuật (run_id, sha, đếm dòng)
  // — cắt để giữ mệnh đề quyết định, nguyên văn đầy đủ vẫn nằm trong hồ sơ
  const parts = sent.split(': ');
  if (parts.length > 2) sent = parts.slice(0, 2).join(': ') + '…';
  const shown = `${name} — ${sent}`;
  return shown.length > 180 ? shown.slice(0, 180).replace(/\s+\S*$/, '') + '…' : shown;
};

// Từ điển biệt ngữ lời ký (gold-output-measure, AC-7/AC-8). Lời người ký là
// nguyên văn — N4 CẤM viết lại. Đường ra là CHÚ GIẢI: term nào xuất hiện trong
// thứ trình cho người thì kèm một dòng nghĩa ở cuối. Nguồn duy nhất là khối
// marker trong human-facing-language.md (ship cùng plugin, nên repo tiêu thụ
// cũng có); đường dẫn SUY TỪ VỊ TRÍ SCRIPT, không hardcode ROOT — bản mirror
// plugins/ và bản kit đều tra được. Không tra được → sổ vẫn in, kèm đúng 1
// dòng ghi chú (vắng nổ to, không im lặng).
const GLOSS_NOTE = 'từ điển biệt ngữ không nạp được';
export function loadGloss(scriptUrl) {
  const here = path.dirname(fileURLToPath(scriptUrl));
  const law = path.join(here, '..', 'skills', 'acceptance', 'references', 'human-facing-language.md');
  let text;
  try { text = fs.readFileSync(law, 'utf8'); }
  catch (_) { return { terms: new Map(), error: GLOSS_NOTE }; }
  const m = text.match(/<!-- <<<SIGNOFF-JARGON-GLOSS -->\n([\s\S]*?)<!-- SIGNOFF-JARGON-GLOSS>>> -->/);
  if (!m) return { terms: new Map(), error: GLOSS_NOTE };
  const terms = new Map();
  for (const raw of m[1].split('\n')) {
    const l = raw.trim();
    if (!l.startsWith('- ') || !l.includes(' — ')) continue;
    const i = l.indexOf(' — ');
    terms.set(l.slice(2, i).trim(), l.slice(i + 3).trim());
  }
  return { terms, error: null };
}

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
      const gloss = glossOf(root, p.slug, p.evalId, p.rationale);
      const hm = `${p.evalId} — ${gloss}`;
      out.push(`| ${viec.replace(/\|/g, '·')} | ${hm.replace(/\|/g, '·')} | ${verdictVi(p.machine)} | ${firstSentence(p.human).replace(/\|/g, '·')} |`);
    }
  }
  out.push('');
  const g = agreement(panels);
  out.push('## Các giám khảo đồng thuận tới đâu');
  out.push('');
  if (!g.sample) out.push('Chưa có hội đồng chấm nào được ghi lại — các việc cũ chấm trước khi máy bắt đầu ghi biên bản hội đồng.');
  else {
    out.push(`${g.sample} lần hội đồng chấm tươi: ${g.buckets.unanimous} lần cả ba cùng ý · ${g.buckets.majority} lần 2-trên-1 · ${g.buckets.split} lần phân kỳ hẳn.`);
    const lenses = Object.keys(g.lensTotal);
    if (lenses.length) {
      out.push('');
      out.push('Theo từng góc nhìn chấm:');
      for (const l of lenses) {
        out.push(`- ${LENS_VI[l] || l}: ${g.lensUncertain[l] || 0}/${g.lensTotal[l]} lần nói "chưa chắc" hoặc "chưa đạt"`);
      }
    }
  }
  if (noPanel.length) {
    out.push('');
    out.push(`${noPanel.length} việc chưa có biên bản hội đồng trong hồ sơ:`);
    for (const s of noPanel) {
      const f = featureOf(root, s);
      out.push(`- ${f ? `${f} (${s})` : s}`);
    }
  }

  // Khối Từ điển: CHỈ term thật sự xuất hiện trong thứ vừa in ra (quét trên
  // chính văn bản đã render — cả lời người lẫn hạng mục, không phải quét source).
  const { terms, error } = loadGloss(import.meta.url);
  const body = out.join('\n');
  const used = [...terms.keys()].filter(t => body.includes(t));
  if (error) { out.push(''); out.push(`(${error} — biệt ngữ trong lời ký chưa được chú giải)`); }
  else if (used.length) {
    out.push('');
    out.push('## Từ điển — biệt ngữ xuất hiện ở trên');
    out.push('');
    for (const t of used) out.push(`- ${t} — ${terms.get(t)}`);
  }
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
