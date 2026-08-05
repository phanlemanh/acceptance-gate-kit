#!/usr/bin/env node
// gen-red-probe.mjs — SINH fixture RED-probe cho eval M11 (matrix-measure-law)
// từ WRITER THẬT: hình dạng 4 trong const MEASUREMENT_SHAPES của
// feature-loop/workflows/acceptance-verify.js (round-trip rút-từ-writer-thật,
// fix finding hình-dạng-2 S4-r2: bản trước là văn viết tay không code path
// nào sinh ra). Deterministic — chạy lại phải ra đúng từng byte.
//
//   node gen-red-probe.mjs            # in nội dung ra stdout
//   node gen-red-probe.mjs --write    # ghi vào _acceptance/matrix-measure-law/evidence/red-probe-artifact.md
import { readFileSync, writeFileSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const WF = path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const OUT = path.join(ROOT, '_acceptance', 'matrix-measure-law', 'evidence', 'red-probe-artifact.md');

export function generate() {
  const src = readFileSync(WF, 'utf8');
  const m = src.match(/const MEASUREMENT_SHAPES = \[([\s\S]*?)\]/);
  if (!m) throw new Error('không thấy const MEASUREMENT_SHAPES trong acceptance-verify.js — writer thật vắng mặt');
  const shapes = [...m[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(x => x[1].replace(/\\'/g, "'"));
  if (shapes.length !== 6) throw new Error(`writer có ${shapes.length} hình dạng, cần 6`);
  const shape4 = shapes[3]; // 'Assertion âm-tính-một-mình: không đối chứng dương, không ghim thông điệp.'
  return `# RED-probe artifact — fixture cho eval M11 (matrix-measure-law)

*File này do \`tests/workflows/gen-red-probe.mjs\` SINH từ writer thật — hình
dạng thứ 4 trong \`MEASUREMENT_SHAPES\` của
\`feature-loop/workflows/acceptance-verify.js\` (round-trip rút-từ-writer-thật;
sửa tay file này sẽ làm case MM12 đỏ vì file phải bằng đúng đầu ra generator).
Hình dạng được gài vào khối A, nguyên văn từ writer:*

> ${shape4}

*Khối B là bản tương đương đã chữa đúng hình dạng đó — khác biệt giữa A và B
chỉ nằm ở đúng một hình dạng; critic bắt được A mà không báo oan B mới tính
là ý (4) đủ răng.*

## Khối A — bộ artifact S1 thu nhỏ (CÓ gài vi phạm theo hình dạng trên)

\`\`\`yaml
# evals.yaml (trích) — feature giả định: guard chặn config thiếu trường bắt buộc
evals:
  - id: X1
    criterion: AC-1
    executor: test
    expected: "dựng bản sao config thiếu trường \`owner\` rồi chạy validator — exit khác 0 là đạt"
    cmd: config:executors.test.scripts
\`\`\`

## Khối B — bản tương đương SẠCH (đã có đối chứng dương + ghim thông điệp)

\`\`\`yaml
# evals.yaml (trích) — cùng feature, cùng AC
evals:
  - id: X1
    criterion: AC-1
    executor: test
    expected: "hai nhánh cùng harness: (1) bản sao config NGUYÊN VẸN chạy validator → exit 0 (đối chứng dương — chứng minh validator có chạy thật); (2) bản sao thiếu trường \`owner\` → exit khác 0 VÀ stderr chứa đúng thông điệp 'missing required field: owner' (ghim thông điệp, không chỉ mã thoát)"
    cmd: config:executors.test.scripts
\`\`\`
`;
}

const isMain = (() => {
  try { return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1] || ''); }
  catch (_) { return false; }
})();
if (isMain) {
  const content = generate();
  if (process.argv.includes('--write')) { writeFileSync(OUT, content); console.log('wrote', OUT); }
  else process.stdout.write(content);
}
