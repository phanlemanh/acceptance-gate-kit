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

// ── Record hành-vi: SINH từ chính artifact bài-làm trong lần chạy ────────────
// Đây là writer DUY NHẤT của mọi tín hiệu máy-đọc (S4-r1: header viết tay
// 'hoàn thành: có' là fixture-viết-tay-đúng-khuôn-bên-đọc — hình dạng 2).
// `completed` SUY từ khối bash khác rỗng; lượt vắng/rỗng làm script NỔ TO với
// tên lượt (fail-closed) chứ không được ghi thành "không sinh cặp". P178
// round-trip record này bằng cách chạy lại chính script — khuôn một chỗ.
const RUNS = [
  { id: 'A1', harness: 'claude', variant: 'co', artifact: 'hanh-vi-A1-claude-co.md' },
  { id: 'A2', harness: 'codex', variant: 'co', artifact: 'hanh-vi-A2-codex-co.md' },
  { id: 'B1', harness: 'claude', variant: 'khong', artifact: 'hanh-vi-B1-claude-khong.md' },
  { id: 'B2', harness: 'codex', variant: 'khong', artifact: 'hanh-vi-B2-codex-khong.md' },
];
const runs = RUNS.map(r => {
  const p = path.join(EV, r.artifact);
  if (!fs.existsSync(p)) { console.error(`lượt ${r.id}: artifact VẮNG (${r.artifact})`); process.exit(2); }
  const m = fs.readFileSync(p, 'utf8').match(/```bash\n([\s\S]*?)```/);
  const body = m ? m[1].trim() : '';
  if (!body) { console.error(`lượt ${r.id}: artifact RỖNG — khối bash không có nội dung`); process.exit(2); }
  const sameFixture = /(grep -v|sed )[^\n]*\.md["']?\s*>\s*["']?[^\n]*\.md/.test(body);
  return {
    ...r,
    completed: true, // suy từ khối bash khác rỗng — thiếu là đã exit 2 ở trên
    two_direction: /check \w+ 0 \$\?/.test(body) && /check \w+ 1 \$\?/.test(body),
    pinned_message: /grep -q .missing slug/.test(body),
    same_fixture_derivation: sameFixture,
    pair_per_mold: sameFixture,
  };
});
const tally = v => `${runs.filter(r => r.variant === v && r.pair_per_mold).length}/${runs.filter(r => r.variant === v).length}`;
const record = {
  note: 'Record 4 lượt đóng vai AC-5 — MÁY SINH bởi make-record.mjs từ chính artifact bài-làm (không viết tay). Tín hiệu: completed = khối bash khác rỗng (lượt rỗng làm script exit 2 ghim tên lượt); same_fixture_derivation = bản-hỏng SINH TỪ bản-lành trong cùng lượt (grep -v/sed) — đúng "phá vật thật trong BẢN SAO cùng fixture" của mệnh đề; two_direction = có cả check-0 lẫn check-1.',
  nuance: 'Cả 2 lượt bản-gỡ vẫn viết đủ hai chiều + ghim thông điệp (nền năng lực model tốt sẵn). Khác biệt ĐO ĐƯỢC của mệnh đề nằm ở HÌNH cặp: bản-có 2/2 phá-bản-sao-cùng-fixture kèm bước kiểm-tiêm; bản-gỡ 2/2 dựng hai fixture độc lập (hình "khai sinh giả" mà khuôn cấm). pair_per_mold chấm theo định nghĩa của mệnh đề, không theo có-đủ-hai-chiều.',
  runs,
  verdict: { co_pair_per_mold: tally('co'), khong_pair_per_mold: tally('khong'), completed: `${runs.length}/4` },
};
fs.writeFileSync(path.join(EV, 'hanh-vi-record.json'), JSON.stringify(record, null, 2) + '\n');
process.stdout.write('sinh xong: 4 biến thể chỉ dẫn + de-bai.md + hanh-vi-record.json (từ 4 artifact)\n');
