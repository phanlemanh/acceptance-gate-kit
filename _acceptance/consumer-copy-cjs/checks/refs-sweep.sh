#!/usr/bin/env bash
# AC-6 — quét lớp: 0 tham chiếu còn mang đuôi .js cho 6 file đã đổi sang .cjs,
# và 0 require không-đuôi (đường dẫn không-đuôi giải được ở CJS nhưng là chỗ
# lệch tiềm tàng khi ai đó chép sang cây ESM).
#
# Sanity counter là BẮT BUỘC: một grep 0-hit thường là grep hỏng (từ khoá sai,
# đường dẫn sai, ugrep không word-split), không phải cây sạch. Nếu số tham chiếu
# .cjs tìm được bằng 0 thì phép đo tự-khớp và phải ĐỎ.
#
# Phạm vi loại trừ có lý do: plugins/ là mirror sinh máy (P30 canh riêng);
# _acceptance/ và docs/ là hồ sơ LỊCH SỬ — tên cũ ở đó là ghi chép đúng của
# thời điểm đó, sửa chúng mới là làm hỏng sổ.
set -u
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$ROOT" || exit 2

NAMES='recheck-evidence|evidence-core|gap-probe|workspace-record|ac-line|md-section'
EXCL="--exclude-dir=plugins --exclude-dir=.git --exclude-dir=_acceptance --exclude-dir=docs --exclude-dir=.out-of-scope --exclude-dir=node_modules"

# Loại trừ ĐÍCH DANH — mỗi file một lý do, và file phải TỒN TẠI (danh sách mục
# nát thì phải nổ, không được im):
#   - additive-only.test.mjs: ALLOWED_REMOVALS trích NGUYÊN VĂN các dòng CŨ bị
#     thay — bắt buộc mang tên .js, đó chính là bằng chứng của DV5.
#   - consumer-esm.test.mjs: ca chiều-ĐỎ (CE6/CE7) dựng layout trước-vá .js có
#     chủ đích; nội dung file này được đo bằng CHẠY nó, không bằng grep.
#   - 3 manifest plugin.json (nguồn): chuỗi "lib/md-section.js" nằm trong văn
#     LỊCH SỬ version-note v1.25 của description — ghi chép đúng thời điểm đó.
#   - PRODUCT-MAP.md: máy sinh từ hồ sơ đã ký; dòng claim lịch sử mang tên cũ.
EXCL_FILES="tests/scripts/additive-only.test.mjs tests/scripts/consumer-esm.test.mjs .claude-plugin/plugin.json .codex-plugin/plugin.json codex/acceptance-gate/.codex-plugin/plugin.json PRODUCT-MAP.md"
for f in $EXCL_FILES; do
  [ -f "$f" ] || { echo "SWEEP FAIL: file trong danh sách loại-trừ không còn tồn tại: $f — danh sách mục nát, cập nhật nó" >&2; exit 1; }
done
excl_grep() { # lọc bỏ hit thuộc EXCL_FILES (đường dẫn grep in dạng ./<path>:)
  grep -vE '^\./(tests/scripts/additive-only\.test\.mjs|tests/scripts/consumer-esm\.test\.mjs|\.claude-plugin/plugin\.json|\.codex-plugin/plugin\.json|codex/acceptance-gate/\.codex-plugin/plugin\.json|PRODUCT-MAP\.md):'
}

cjs_hits="$(grep -rnE "(${NAMES})\.cjs" . $EXCL 2>/dev/null | wc -l | tr -d ' ')"
js_hits="$(grep -rnE "(${NAMES})\.js\b" . $EXCL 2>/dev/null | excl_grep | wc -l | tr -d ' ')"
# require('...ac-line') không đuôi — chỉ bắt dạng require, không bắt văn xuôi.
bare="$(grep -rnE "require\([^)]*(${NAMES})['\"]\)" . $EXCL 2>/dev/null | excl_grep | wc -l | tr -d ' ')"

echo "sanity: ${cjs_hits} tham chiếu .cjs tìm thấy (phải > 0, nếu 0 thì grep hỏng)"
echo "đo:     ${js_hits} tham chiếu .js còn sót · ${bare} require không-đuôi"

rc=0
if [ "$cjs_hits" -eq 0 ]; then
  echo "SWEEP FAIL: sanity counter = 0 — phép quét không nhận diện được tham chiếu nào, kết luận 'sạch' vô nghĩa" >&2
  rc=1
fi
if [ "$js_hits" -ne 0 ]; then
  echo "SWEEP FAIL: còn ${js_hits} tham chiếu mang đuôi .js (ngoài danh sách loại-trừ có lý do):" >&2
  grep -rnE "(${NAMES})\.js\b" . $EXCL 2>/dev/null | excl_grep | head -10 >&2
  rc=1
fi
if [ "$bare" -ne 0 ]; then
  echo "SWEEP FAIL: còn ${bare} require không-đuôi (giải được ở CJS, vỡ khi chép sang cây khác):" >&2
  grep -rnE "require\([^)]*(${NAMES})['\"]\)" . $EXCL 2>/dev/null | excl_grep | head -10 >&2
  rc=1
fi

# Vật phải THẬT SỰ nạp được — tên đúng mà file hỏng thì grep vẫn xanh.
for f in lib/evidence-core.cjs lib/gap-probe.cjs lib/workspace-record.cjs lib/ac-line.cjs lib/md-section.cjs; do
  node -e "require('$ROOT/$f')" 2>/dev/null || { echo "SWEEP FAIL: $f không require được" >&2; rc=1; }
done

[ "$rc" -eq 0 ] && echo "SWEEP OK"
exit "$rc"
