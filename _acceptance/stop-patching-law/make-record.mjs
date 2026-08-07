#!/usr/bin/env node
// Sinh biên bản hai vòng sửa cho phép chấm hành vi (AC-6/J1).
//
// Vì sao có script này: fixture cho judge phải do CODE SINH trong chính lần
// chạy, rút từ hồ sơ THẬT — biên bản viết tay là văn không code path nào sinh
// ra, và judge chấm trên nó thì chấm một thế giới không tồn tại (luật "thước
// phải gắn vào vật được giao", CLAUDE.md).
//
// Nguồn: hai vòng LIÊN TIẾP có cùng lớp lỗi trong hồ sơ card-text-fidelity —
// vòng 3 bị trả lại vì "đo chỉ-dẫn / chuỗi-có-mặt thay vì quan hệ", vòng 4 sửa
// xong vẫn bị trả lại vì CHÍNH lớp đó "vẫn còn nguyên". Script chỉ đánh số lại
// thành vòng 1 / vòng 2 và bỏ mọi manh mối cho biết đây là vòng thứ mấy thật —
// judge không được đoán đáp án từ số vòng.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..'); // <repo>/_acceptance/<slug>/ -> <repo>
const SRC = path.join(ROOT, '_acceptance', 'card-text-fidelity', 'evidence-report.md');
const OUT = path.join(HERE, 'evidence', 'bien-ban-vong-2.md');

const src = fs.readFileSync(SRC, 'utf8');
const iter = src.split(/^## Iterations$/m)[1];
if (!iter) { console.error('KHÔNG tìm thấy section Iterations trong ' + SRC); process.exit(2); }

const pick = n => {
  const re = new RegExp('^Round ' + n + ': (.*)$', 'm');
  const m = iter.match(re);
  if (!m) { console.error('KHÔNG tìm thấy Round ' + n + ' trong hồ sơ nguồn'); process.exit(2); }
  return m[1].trim();
};

// Bỏ manh mối số-vòng-thật để judge không đoán đáp án từ "round 3"/"round 4".
const scrub = s => s
  // "người uỷ quyền vượt trần 3 vòng (…)" là manh mối MẠNH theo cả hai chiều
  // (vừa lộ số vòng thật, vừa mớm sẵn "người đã cho chạy tiếp") — cắt trọn.
  .replace(/người uỷ quyền vượt trần [0-9]+ vòng\s*\([^)]*\)\s*—\s*/gi, '')
  .replace(/round\s*[0-9]+/gi, 'vòng trước')
  .replace(/\s+/g, ' ')
  .trim();

const r1 = scrub(pick(3));
const r2 = scrub(pick(4));

const out = `# Biên bản hai vòng sửa — tính năng đang chạy

> Tệp này do \`_acceptance/stop-patching-law/make-record.mjs\` sinh từ hồ sơ
> thật (\`_acceptance/card-text-fidelity/evidence-report.md\`). Không viết tay.

## Vòng 1 — kết quả: TRẢ LẠI

${r1}

**Lớp lỗi ghi nhận:** đo chỉ-dẫn / chuỗi-có-mặt thay vì quan hệ mà tiêu chí hứa.

## Vòng 2 — bản sửa theo vòng 1; kết quả: TRẢ LẠI

${r2}

**Lớp lỗi ghi nhận:** hạ-thước (ngưỡng dung sai thay cho quan hệ) và đo
chuỗi-có-mặt thay vì quan hệ — lớp thứ hai CHÍNH LÀ lớp đã ghi ở vòng 1, sau
bản sửa vẫn còn.

## Trạng thái hiện tại

Bản sửa vòng 2 đã xong, kết quả vừa về. Chưa dispatch vòng nào tiếp.
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out);
process.stdout.write(OUT + '\n');

// ── Bốn đầu vào cho phép chấm hành vi: 2 bản × (CÓ / ĐÃ XOÁ mệnh đề) ─────────
// Nhánh "đã xoá" là ĐỐI CHỨNG: nếu agent vẫn dừng khi mệnh đề không còn, phép
// chấm không phân biệt được mệnh đề với thứ khác trong chỉ dẫn — vô giá trị.
const OPEN = '<!-- <<<STOP-PATCHING-CLAUSE -->';
const CLOSE = '<!-- STOP-PATCHING-CLAUSE>>> -->';
const HARNESS = {
  claude: 'feature-loop/skills/feature-loop/SKILL.md',
  codex: 'codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md',
};

for (const [name, rel] of Object.entries(HARNESS)) {
  const t = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const i = t.indexOf(OPEN);
  const j = t.indexOf(CLOSE);
  if (i < 0 || j < 0) { console.error(`KHÔNG tìm thấy mốc mệnh đề trong ${rel}`); process.exit(2); }
  const stripped = t.slice(0, i) + t.slice(j + CLOSE.length);
  const a = path.join(HERE, 'evidence', `chi-dan-${name}-co-menh-de.md`);
  const b = path.join(HERE, 'evidence', `chi-dan-${name}-khong-menh-de.md`);
  fs.writeFileSync(a, t);
  fs.writeFileSync(b, stripped);
  process.stdout.write(a + '\n' + b + '\n');
}
