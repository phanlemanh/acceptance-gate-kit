#!/usr/bin/env node
// Sinh đầu vào cho phép chấm hành vi AC-5 (E5) — measure-birth-certificate.
//
// Vì sao có script này: fixture cho phép chấm phải do CODE SINH trong chính
// lần chạy, rút từ nguồn THẬT (luật "thước phải gắn vào vật được giao",
// CLAUDE.md). Bốn biến thể chỉ dẫn dưới đây bóc từ CHÍNH hai bản SKILL đang
// ship — không chép tay; SKILL đổi thì phải chạy lại script này và commit lại
// evidence, kẻo case round-trip trong suite đỏ (đúng như nghi thức của
// stop-patching-law).
//
// Nhánh "đã gỡ" là ĐỐI CHỨNG: nếu agent vẫn sinh cặp hai-chiều khi mệnh đề
// không còn, phép chấm không phân biệt được mệnh đề với thứ khác trong chỉ
// dẫn — vô giá trị.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const EV = path.join(HERE, 'evidence');
fs.mkdirSync(EV, { recursive: true });

const OPEN = '<!-- <<<MEASURE-BIRTH-CLAUSE -->';
const CLOSE = '<!-- MEASURE-BIRTH-CLAUSE>>> -->';
const HARNESS = {
  claude: 'feature-loop/skills/feature-loop/SKILL.md',
  codex: 'codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md',
};

// Bóc ĐÚNG section S3 (đoạn thợ đọc lúc viết phép đo) — cho agent đóng vai
// đọc phần chỉ dẫn liên quan, không cả tệp (nhiễu + lộ ngữ cảnh kit).
const s3Of = (t, name) => {
  const re = name === 'claude'
    ? /^## S3 — EXECUTE$([\s\S]*?)^## S4/m
    : /^## S3 - Execute$([\s\S]*?)^## S4/m;
  const m = t.match(re);
  if (!m) { console.error(`KHÔNG bóc được section S3 của ${name}`); process.exit(2); }
  return m[1].trim();
};

for (const [name, rel] of Object.entries(HARNESS)) {
  const t = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const i = t.indexOf(OPEN);
  const j = t.indexOf(CLOSE);
  if (i < 0 || j < 0) { console.error(`KHÔNG tìm thấy mốc mệnh đề trong ${rel}`); process.exit(2); }
  const stripped = t.slice(0, i) + t.slice(j + CLOSE.length);
  fs.writeFileSync(path.join(EV, `chi-dan-${name}-co-mbc.md`), s3Of(t, name) + '\n');
  fs.writeFileSync(path.join(EV, `chi-dan-${name}-khong-mbc.md`), s3Of(stripped, name) + '\n');
}

// Đề bài chung cho cả 4 lượt — một kịch bản viết-phép-đo đại diện (điểm-viết
// S3-case, xem entry descope trong decisions.jsonl). Cùng một đề cho cả 4:
// khác biệt duy nhất giữa các lượt là biến thể chỉ dẫn — đúng nghĩa cặp
// đối chứng cùng-fixture của chính khuôn.
const DE_BAI = `# Đề bài — viết phép đo cho script mới

Repo có suite bash với helper \`check <tên> <exit-mong-đợi> $?\` và các case
dạng:

    echo "X1 mô tả case"
    out="$(node scripts/slug-check.js fixture/contract.md 2>&1)"; check X1 0 $?

Script MỚI \`scripts/slug-check.js\` vừa được viết: đọc file contract.md
truyền vào, exit 0 khi frontmatter có dòng \`slug: <giá trị kebab-case>\`,
exit 1 kèm thông điệp \`missing slug\` khi thiếu dòng đó.

NHIỆM VỤ: viết (các) case suite kiểm phép đo này, kèm fixture cần thiết
(heredoc). Trả về ĐÚNG nội dung case bash, không giải thích ngoài lề.
`;
fs.writeFileSync(path.join(EV, 'de-bai.md'), DE_BAI);
process.stdout.write('sinh xong: 4 biến thể chỉ dẫn + de-bai.md\n');
