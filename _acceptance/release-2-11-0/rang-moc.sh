#!/usr/bin/env bash
# rang-moc.sh — răng của hồ sơ release-2-11-0, chân `diagram`.
#
# Lời hứa: `diagram-design/` giữ số 2.7.0 một cách CÓ CĂN CỨ.
#
# Bản đầu ghim cứng cửa sổ phát hành (`--neo 04069351 .. HEAD`). Lượt chấm 1
# chỉ ra vì sao sai: chiến dịch GHIM LẠI theo mốc chạy lại MỌI eval máy của hồ
# sơ này trên cây tại một HEAD muộn hơn, nên ngày `diagram-design/` đổi lần
# sau, răng của một hồ sơ ĐÃ KÝ sẽ đỏ vĩnh viễn vì một sự thật không liên quan
# đến nó. Bất biến đúng và BỀN là:
#
#     `diagram-design/` không đổi KỂ TỪ lần cắt số gần nhất của CHÍNH NÓ
#
# Mốc so suy TỪ KHO (commit gần nhất chạm manifest của diagram-design), không
# gõ vào config. Bất biến này đúng ở mọi HEAD tương lai, nên hồ sơ đã ký còn
# ghim lại được.
#
#   3  không tìm được lần CẮT SỐ nào                 → không có nền để so
#   4  mốc chọn ra không phải một lần cắt số         → phép chọn mốc hỏng
#   5  diagram-design/ CÓ đổi sau lần cắt số gần nhất → số đang nói dối
#   0  xanh
#
# Gốc kho suy TỪ VỊ TRÍ SCRIPT (bài học P150), không từ thư mục gọi.
set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
G() { git -C "$ROOT" "$@"; }
CHAN=""
while [ $# -gt 0 ]; do
  case "$1" in
    --chan) CHAN="${2:-}"; shift 2 ;;
    *) echo "rang-moc: tham so la: $1" >&2; exit 2 ;;
  esac
done
# `--chan` CỐ Ý nhận giá trị bọc vỏ nháy trong config: bộ giải TRƯỚC 2.11.0 trả
# chuỗi còn dấu chéo ngược nên giá trị tới đây là `\"diagram\"` và răng thoát 2
# có tên — eval này không thể xanh trên bản chưa vá.
[ "$CHAN" = "diagram" ] || { echo "rang-moc: --chan phai la 'diagram' (thay: '${CHAN}')" >&2; exit 2; }

MANIFEST="diagram-design/.claude-plugin/plugin.json"
ver_tai() { G show "$1:$MANIFEST" 2>/dev/null | sed -n 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1; }

# Chân 1 — mốc so là lần CẮT SỐ gần nhất, KHÔNG phải lần CHẠM manifest gần nhất.
# Lượt chấm 2 bắt được sai lệch này: một commit vừa sửa nội dung diagram-design/
# vừa sửa mô tả trong manifest mà KHÔNG tăng `version` sẽ thành mốc mới, chân 3
# so NEO..HEAD thấy rỗng và răng báo PASS trong khi nội dung đã đổi còn số thì
# cũ — fail-open ĐÚNG chiều răng này canh.
NEO=""
for sha in $(G log --format=%H -- "$MANIFEST" 2>/dev/null); do
  cha="$(G rev-parse -q --verify "${sha}^" 2>/dev/null || true)"
  if [ -z "$cha" ] || [ "$(ver_tai "$sha")" != "$(ver_tai "$cha")" ]; then NEO="$sha"; break; fi
done
if [ -z "$NEO" ]; then
  echo "DO: khong tim duoc lan CAT SO nao cua ${MANIFEST} — khong co nen de so" >&2
  exit 3
fi

# Chân 2 — ĐỐI CHỨNG DƯƠNG phải KHẲNG ĐỊNH ĐƯỢC SAI. Bản trước kiểm «mốc có
# chạm diagram-design/ không», mà mốc vốn được CHỌN theo một đường dẫn nằm
# trong diagram-design/ nên nó đúng theo CẤU TẠO — không đối chứng gì cả (lượt
# chấm 2 gọi tên). Nay kiểm điều thật sự có thể sai: số tại mốc phải KHÁC số tại
# cha nó (hoặc mốc là commit gốc).
CHA="$(G rev-parse -q --verify "${NEO}^" 2>/dev/null || true)"
if [ -n "$CHA" ] && [ "$(ver_tai "$NEO")" = "$(ver_tai "$CHA")" ]; then
  echo "DO: moc ${NEO} KHONG phai mot lan cat so (so tai moc = so tai cha = $(ver_tai "$NEO")) — phep chon moc hong" >&2
  exit 4
fi

# Chân 3 — vật được đo.
DOI="$(G diff --name-only "${NEO}..HEAD" -- diagram-design/ 2>/dev/null)"
if [ -n "$DOI" ]; then
  echo "DO: diagram-design CO doi sau lan cat so gan nhat (${NEO}) ma so chua tang:" >&2
  printf '  %s\n' $DOI >&2
  exit 5
fi

SO="$(ver_tai HEAD)"
echo "PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (${NEO}), giu ${SO} (doi chung duong: so tai moc KHAC so tai cha)"
