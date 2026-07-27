set -eu
ROOT="/Users/manh-macmini/dev/acceptance-gate-kit"
WS="$(mktemp -d)"
mkdir -p "$WS/_acceptance/demo"
cat > "$WS/_acceptance/demo/contract.md" <<'EOF'
---
schema_version: 1
feature: Cập nhật tiện ích an toàn
slug: demo
risk_tier: T2
status: verified
---

## Criteria

- AC-1: Given x, When y, Then z.

## Out of scope

- không làm gì thêm
EOF
cat > "$WS/_acceptance/demo/evidence-report.md" <<'EOF'
---
slug: demo
round: 1
verdict: PASS
enforcement_mode: strict
bypass_used: false
---

## Results

- eval: E1
  run_id: r1234
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-07-27T00:00:00Z
EOF
cat > "$WS/_acceptance/demo/review-findings.md" <<'EOF'
# Review Findings: demo (round 1)

## Ngoài hợp đồng — người quyết ở Gate 2

- **rmSync called before git.clone resolves — plugin dir removed on network failure**
  Người dùng thấy gì: Bấm "Cập nhật" có thể làm mất tiện ích đang cài, nếu mạng hỏng giữa chừng thì kết quả là "đã gỡ cài" chứ không phải bản mới.
  file: `src/install.ts:10`
  severity: high
  Đề xuất: known-limits

- **storedUrl !== gitUrl string compare flags every documented install as moved**
  Người dùng thấy gì: Tiện ích cài đúng theo hướng dẫn trong tài liệu vẫn bị nhận nhầm là đã dời chỗ, nên lần cập nhật sau có thể bị gỡ đi.
  file: `src/resolver.ts:44`
  severity: high
  Đề xuất: new-contract

---

⚠ Cụm ngoài vùng phủ: 2/3 lỗi rơi vào file không bộ đo nào phủ (src/install.ts, src/resolver.ts) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
EOF
node "$ROOT/scripts/gate-card.js" --root "$WS" --slug demo > "$WS/card.html"
node -e '
const fs=require("fs");
const h=fs.readFileSync(process.argv[1],"utf8");
const start=h.indexOf("Ngoài hợp đồng — bạn quyết");
const labStart=h.lastIndexOf("<div class=\"lab\">",start);
const end=h.indexOf("<div class=\"lab\">",start);
const frag=h.slice(labStart, end>0?end:h.length);
const txt=frag.replace(/<[^>]+>/g,"\n").replace(/&quot;/g,"\"").replace(/&amp;/g,"&").split("\n").map(s=>s.trim()).filter(Boolean).join("\n");
process.stdout.write(txt+"\n");
' "$WS/card.html"
rm -rf "$WS"
