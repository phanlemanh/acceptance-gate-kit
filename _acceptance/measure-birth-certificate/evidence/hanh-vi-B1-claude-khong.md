# Lượt B1 — chỉ dẫn Claude ĐÃ GỠ mệnh đề · hoàn thành: có

> Bài làm nguyên văn của agent context-sạch (đề bài: evidence/de-bai.md,
> chỉ dẫn: evidence/chi-dan-claude-khong-mbc.md). Không sửa chữ nào.
> Ghi chú chấm: đủ hai chiều + ghim thông điệp, NHƯNG hai fixture độc lập
> (co-slug.md / thieu-slug.md viết tay riêng) — không phá-bản-sao-cùng-fixture,
> không bước kiểm-tiêm.

```bash
# --- slug-check.js: phép đo slug trong frontmatter contract ---
# Fixture do code sinh ngay trong lần chạy (không dựa file có sẵn).
tmp_slug="$(mktemp -d)"

cat > "$tmp_slug/co-slug.md" <<'EOF'
---
slug: vi-du-kebab-case
title: fixture co slug
---
# Contract mau
EOF

cat > "$tmp_slug/thieu-slug.md" <<'EOF'
---
title: fixture thieu slug
---
# Contract mau
EOF

echo "SL1 contract có slug kebab-case → exit 0 (đối chứng dương — phải XANH trước khi tin case đỏ)"
out="$(node scripts/slug-check.js "$tmp_slug/co-slug.md" 2>&1)"; check SL1 0 $?

echo "SL2 contract thiếu dòng slug → exit 1 (không phải 127/2 — phân biệt 'bắt đúng lỗi' với 'script không chạy')"
out="$(node scripts/slug-check.js "$tmp_slug/thieu-slug.md" 2>&1)"; check SL2 1 $?

echo "SL3 ghim đúng thông điệp 'missing slug' khi thiếu (âm tính không sống một mình)"
printf '%s\n' "$out" | grep -q "missing slug"; check SL3 0 $?

rm -rf "$tmp_slug"
```

Ghi chú của agent: SL1 là đối chứng dương bắt buộc trước cặp âm tính SL2+SL3;
SL3 ghim thông điệp từ chính $out của lần chạy SL2, không chạy lại script.
