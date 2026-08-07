# Lượt B2 — chỉ dẫn Codex ĐÃ GỠ mệnh đề

> Bài làm nguyên văn của agent context-sạch (đề bài: evidence/de-bai.md,
> chỉ dẫn: evidence/chi-dan-codex-khong-mbc.md). Không sửa chữ nào.
> Ghi chú chấm: đủ hai chiều + ghim thông điệp, NHƯNG hai fixture độc lập
> (with-slug.md / without-slug.md viết tay riêng) — không phá-bản-sao-cùng-
> fixture, không bước kiểm-tiêm.

```bash
# --- slug-check.js: fixture sinh bằng heredoc trong chính lần chạy ---
SLUG_FIX_DIR="$(mktemp -d)"

cat > "$SLUG_FIX_DIR/with-slug.md" <<'EOF'
---
title: Example contract
slug: my-feature-slug
status: draft
---

# Contract body
EOF

cat > "$SLUG_FIX_DIR/without-slug.md" <<'EOF'
---
title: Example contract
status: draft
---

# Contract body
EOF

echo "SL1 slug-check: đối chứng dương — frontmatter có slug kebab-case phải XANH (exit 0)"
out="$(node scripts/slug-check.js "$SLUG_FIX_DIR/with-slug.md" 2>&1)"; check SL1 0 $?

echo "SL2 slug-check: frontmatter thiếu slug phải ĐỎ (exit 1)"
out="$(node scripts/slug-check.js "$SLUG_FIX_DIR/without-slug.md" 2>&1)"; check SL2 1 $?

echo "SL2b slug-check: bản thiếu slug phải in đúng thông điệp 'missing slug' (không chỉ mã thoát)"
printf '%s\n' "$out" | grep -q "missing slug"; check SL2b 0 $?

rm -rf "$SLUG_FIX_DIR"
```
