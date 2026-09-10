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
#   3  không tìm được mốc cắt số của diagram-design  → không có nền để so
#   4  mốc cắt số KHÔNG chạm diagram-design/          → phép đo không có nghĩa
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

# Chân 1 — mốc so phải SUY ĐƯỢC TỪ KHO.
NEO="$(G log -n1 --format=%H -- "$MANIFEST" 2>/dev/null)"
if [ -z "$NEO" ]; then
  echo "DO: khong tim duoc commit nao cham ${MANIFEST} — khong co nen de so" >&2
  exit 3
fi

# Chân 2 — ĐỐI CHỨNG DƯƠNG: chính mốc đó PHẢI chạm diagram-design/. Rỗng ở đây
# nghĩa là phép đo không chạy thật (clone nông, sai cwd, git chết) chứ không
# phải "yên ả" — đúng lớp fail-open mà chân này sinh ra để chặn.
if ! G diff --name-only "${NEO}^..${NEO}" -- diagram-design/ 2>/dev/null | grep -q .; then
  echo "DO: moc cat so ${NEO} KHONG cham diagram-design/ — phep do khong chay that" >&2
  exit 4
fi

# Chân 3 — vật được đo.
DOI="$(G diff --name-only "${NEO}..HEAD" -- diagram-design/ 2>/dev/null)"
if [ -n "$DOI" ]; then
  echo "DO: diagram-design CO doi sau lan cat so gan nhat (${NEO}) ma so chua tang:" >&2
  printf '  %s\n' $DOI >&2
  exit 5
fi

SO="$(G show "HEAD:${MANIFEST}" | sed -n 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)"
echo "PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (${NEO}), giu ${SO} (doi chung duong: chinh moc do cham diagram-design/)"
