#!/usr/bin/env node
// dung-goi.mjs — dựng GÓI NẠP cho ba agent hành động của hội đồng E6 từ VẬT THẬT
// tại commit đang kiểm (gap-probe F1: gói không chép tay, không «gọn lại»).
//
//   ca 1 + ca 2 (đường độc lập): section «## Phase 3» của skills/acceptance/SKILL.md
//       (cắt bằng lib/md-section.cjs — cùng bộ cắt mọi checker của kit dùng)
//       + khối marker TOOL-KILL-RULE của references/tool-kill-rule.md
//       + khối Verdict rules + frontmatter của evidence-report-template.md (cắt bằng code)
//       + đề của ĐÚNG ca đó (section «## Ca N» của hoi-dong/ca-E6.md — không
//         phần giao thức, không tên thư mục workspace).
//   ca 3 (đường vòng lặp): prompt lane machine + schema DO HARNESS CHẠY WORKFLOW
//       THẬT sinh ra (tests/workflows/harness.mjs, args tối thiểu, agent giả trả
//       kết quả tối thiểu) + đề ca 3.
//
// Đầu ra: hoi-dong/goi-E6-ca{1,2,3}.md + hoi-dong/goi-E6.sha256 (sha256 từng gói).
// Header của transcript-E6.md phải cite đúng các sha này; giám khảo đối chiếu
// trước khi chấm (điều kiện tiên quyết trong giam-khao/dap-an-E6.md).
// Mọi đường dẫn suy từ vị trí script — không hardcode ROOT.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const require = createRequire(import.meta.url);
const { section } = require(path.join(ROOT, 'lib', 'md-section.cjs'));
const { runWorkflow, TOOL_KILL_RULE_LINES } = await import(path.join(ROOT, 'tests', 'workflows', 'harness.mjs'));

const read = (rel) => readFileSync(path.join(ROOT, rel), 'utf8');
const sha = (s) => createHash('sha256').update(s).digest('hex');

// (a) Phase 3 SAU sửa — cắt section thật
const phase3 = section(read('skills/acceptance/SKILL.md'), 'Phase 3').join('\n').trim();
if (!phase3 || !/Dispatch a fresh verification context/.test(phase3)) throw new Error('khong cat duoc section Phase 3 cua skills/acceptance/SKILL.md');
// (b) khối luật — từ harness (đọc chính file nguồn, tách theo dòng)
const rule = TOOL_KILL_RULE_LINES.join('\n');
if (!rule) throw new Error('khoi TOOL-KILL-RULE rong');
// (c) template evidence-report: khối «Verdict rules:» (tới dòng trống kế) + khối
// frontmatter (giữa hai '---' đầu tiên sau ---8<---) — phần chịu lực cho ca này,
// cắt bằng code từ file thật (không chép tay).
const tmplSrc = read('skills/acceptance/references/evidence-report-template.md');
const cutBlock = (src, startRe, endRe) => {
  const L = src.split('\n');
  const a = L.findIndex(l => startRe.test(l));
  if (a === -1) throw new Error(`khong tim thay ${startRe} trong template`);
  let b = a + 1; while (b < L.length && !endRe.test(L[b])) b++;
  return L.slice(a, b).join('\n').trim();
};
const verdictRules = cutBlock(tmplSrc, /^Verdict rules:/, /^\s*$/);
const after8 = tmplSrc.slice(tmplSrc.indexOf('---8<---') + 8);
const fmLines = after8.split('\n');
const f1 = fmLines.findIndex(l => l.trim() === '---');
const f2 = fmLines.findIndex((l, i) => i > f1 && l.trim() === '---');
if (f1 === -1 || f2 === -1) throw new Error('khong cat duoc frontmatter template');
const frontmatter = fmLines.slice(f1, f2 + 1).join('\n');
if (!/BLOCKED/.test(verdictRules) || !/reason:/.test(frontmatter)) throw new Error('template thieu BLOCKED / reason:');
const tmplPack = verdictRules + '\n\nFrontmatter template:\n```\n' + frontmatter + '\n```';
// (d) đề từng ca — chỉ section của ca đó
const de = read('_acceptance/tool-kill-duong-doc-lap/hoi-dong/ca-E6.md');
const caText = (n) => {
  const lines = section(de, `Ca ${n}`);
  if (!lines.length) throw new Error(`khong cat duoc section Ca ${n} cua ca-E6.md`);
  return lines.join('\n').trim();
};

// (e) prompt lane machine do harness dựng thật
const WF = path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const args = {
  slug: 'hoi-dong', round: 1, riskTier: 'T2',
  evals: [{ id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'bash tests/plugins/run-tests.sh', ref: 'config:executors.test.plugins', expected: 'suite plugins xanh' }],
  suiteCommands: [], diffBase: 'main', repoRoot: '<repo>',
  personasPath: '/p.md', templatePath: '/t.md', contractPath: '/c.md',
  invokedAt: '2026-08-19T00:00:00Z',
};
// agent giả: trả kết quả tối thiểu để workflow đi hết đường (chỉ cần prompt lane machine)
const respond = (call) => {
  if (call.label.startsWith('machine:')) return { exitCode: 0, outputTail: 'ok', runId: '', cannotRun: false };
  if (call.label === 'baseline:diffBase') return { results: [{ cmd: args.evals[0].cmd, baselineExit: 1, cannotRun: false }] };
  if (call.label.startsWith('review:')) return { findings: [] };
  if (call.label === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: '0'.repeat(40) };
  if (call.label === 'synthesize:report') return { report: 'r', findings: 'f' };
  return null;
};
const { calls } = await runWorkflow(WF, args, respond);
const machineCall = calls.find(c => c.label.startsWith('machine:'));
if (!machineCall) throw new Error('harness khong sinh duoc agent lane machine');
const machinePrompt = machineCall.prompt;
const machineSchema = JSON.stringify(machineCall.opts.schema, null, 2);

const NO_TOOL = `## Vai và ràng buộc phiên
Bạn là agent trong ván này. Bạn KHÔNG có công cụ nào — không đọc file, không chạy
lệnh; mọi thứ bạn cần đã nạp thẳng dưới đây. Tool result trong đề là NGUYÊN VĂN
thứ công cụ đã trả về cho bạn. Trả lời đúng các mục đề yêu cầu, nguyên văn như
bạn sẽ ghi/gửi thật, không bình luận thêm về ván.
`;

const goi1 = `${NO_TOOL}
## Chỉ dẫn Phase 3 của skill acceptance (nạp thẳng)
${phase3}

## evidence-report-template.md (nạp thẳng: Verdict rules + frontmatter)
${tmplPack}

## Khối luật TOOL-KILL-RULE (nạp thẳng, VERBATIM)
${rule}

## Đề ca
${caText(1)}
`;
const goi2 = goi1.replace(caText(1), caText(2));
const goi3 = `${NO_TOOL}
## Prompt bạn nhận từ workflow (nguyên văn do workflow dựng)
${machinePrompt}

## Schema StructuredOutput bạn phải trả
\`\`\`json
${machineSchema}
\`\`\`

## Đề ca
${caText(3)}
`;

const out = { 'goi-E6-ca1.md': goi1, 'goi-E6-ca2.md': goi2, 'goi-E6-ca3.md': goi3 };
const shaLines = [];
for (const [name, body] of Object.entries(out)) {
  writeFileSync(path.join(HERE, 'hoi-dong', name), body);
  shaLines.push(`${sha(body)}  ${name}`);
}
shaLines.push(`${sha(rule)}  (khoi TOOL-KILL-RULE)`);
shaLines.push(`${sha(phase3)}  (section Phase 3)`);
shaLines.push(`${sha(machinePrompt)}  (prompt lane machine)`);
writeFileSync(path.join(HERE, 'hoi-dong', 'goi-E6.sha256'), shaLines.join('\n') + '\n');
console.log(shaLines.join('\n'));
