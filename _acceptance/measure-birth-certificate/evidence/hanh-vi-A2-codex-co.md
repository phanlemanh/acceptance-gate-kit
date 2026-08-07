# Lượt A2 — chỉ dẫn Codex CÓ mệnh đề · hoàn thành: có

> Bài làm nguyên văn của agent context-sạch (đề bài: evidence/de-bai.md,
> chỉ dẫn: evidence/chi-dan-codex-co-mbc.md). Không sửa chữ nào.

```bash
# ---------------------------------------------------------------------------
# slug-check.js — two-direction pair on the SAME fixture
# SC1: intact contract  -> green (positive control)
# SC2: broken copy      -> red, exit 1
# SC3: red carries pinned message "missing slug" (not exit code alone)
# ---------------------------------------------------------------------------
sc_dir="$(mktemp -d)"
cat > "$sc_dir/contract.md" <<'EOF'
---
slug: sample-feature-slug
status: draft
---
# Sample contract

Body text irrelevant to the check.
EOF

echo "SC1 slug-check exits 0 on intact contract with kebab-case slug (positive control)"
out="$(node scripts/slug-check.js "$sc_dir/contract.md" 2>&1)"; check SC1 0 $?

# Break the real object in a copy: strip the slug line from the same fixture.
grep -v '^slug:' "$sc_dir/contract.md" > "$sc_dir/contract-broken.md"

echo "SC2a injection sanity: broken copy truly lost its slug line"
! grep -q '^slug:' "$sc_dir/contract-broken.md"; check SC2a 0 $?

echo "SC2 slug-check exits 1 on broken copy missing the slug line"
out="$(node scripts/slug-check.js "$sc_dir/contract-broken.md" 2>&1)"; check SC2 1 $?

echo "SC3 broken-copy failure pins the message 'missing slug'"
printf '%s' "$out" | grep -q 'missing slug'; check SC3 0 $?

rm -rf "$sc_dir"
```
