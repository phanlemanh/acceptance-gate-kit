# Lượt A1 — chỉ dẫn Claude CÓ mệnh đề

> Bài làm nguyên văn của agent context-sạch (đề bài: evidence/de-bai.md,
> chỉ dẫn: evidence/chi-dan-claude-co-mbc.md). Không sửa chữ nào.

```bash
# --- slug-check.js: cặp hai-chiều trên CÙNG một fixture ---
mkdir -p fixture

cat > fixture/slug-ok.contract.md <<'EOF'
---
slug: sample-feature-slug
status: draft
---

# Contract mẫu

Nội dung không liên quan tới frontmatter.
EOF

echo "SC1 đối chứng dương: contract lành có 'slug: <kebab-case>' → exit 0"
out="$(node scripts/slug-check.js fixture/slug-ok.contract.md 2>&1)"; check SC1 0 $?

echo "SC2a tiêm lỗi vào BẢN SAO: xoá dòng slug, xác nhận tiêm thành công (bản sao khác bản gốc, không còn dòng slug)"
grep -v '^slug:' fixture/slug-ok.contract.md > fixture/slug-missing.contract.md
! grep -q '^slug:' fixture/slug-missing.contract.md && ! cmp -s fixture/slug-ok.contract.md fixture/slug-missing.contract.md
check SC2a 0 $?

echo "SC2b bản sao bị phá → exit 1"
out="$(node scripts/slug-check.js fixture/slug-missing.contract.md 2>&1)"; check SC2b 1 $?

echo "SC2c thông điệp GHIM: output phải chứa đúng chuỗi 'missing slug' (không chỉ exit code)"
printf '%s\n' "$out" | grep -q 'missing slug'; check SC2c 0 $?
```
