#!/usr/bin/env bash
# rang-moc.sh — răng của hồ sơ release-2-11-0, chân `diagram`.
#
# Lời hứa: `diagram-design/` KHÔNG đổi trong cửa sổ phát hành, nên nó GIỮ 2.7.0.
# Một phép đo dựa trên «đầu ra RỖNG» fail-open theo mặc định: git chết, clone
# nông, sai thư mục — cả ba cho stdout rỗng y hệt «không đổi». Nên ba chân tách
# nhau bằng BA mã thoát riêng, và có ĐỐI CHỨNG DƯƠNG cùng cửa sổ.
#
#   3  sha nền không giải được          → phép đo không có nền để so
#   4  đối chứng dương rỗng             → phép đo KHÔNG CHẠY (lib/ luôn đổi trong cửa sổ này)
#   5  diagram-design/ CÓ đổi           → vật đã đổi mà số chưa cắt
#   0  xanh
#
# Gốc kho suy TỪ VỊ TRÍ SCRIPT (bài học P150), không từ thư mục gọi.
set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CHAN=""; NEO=""
while [ $# -gt 0 ]; do
  case "$1" in
    --chan) CHAN="${2:-}"; shift 2 ;;
    --neo)  NEO="${2:-}";  shift 2 ;;
    *) echo "rang-moc: tham so la: $1" >&2; exit 2 ;;
  esac
done
[ "$CHAN" = "diagram" ] || { echo "rang-moc: --chan phai la 'diagram' (thay: '${CHAN}')" >&2; exit 2; }
[ -n "$NEO" ] || { echo "rang-moc: thieu --neo <sha nen>" >&2; exit 2; }

# Chân 1 — sha nền phải giải được. Bộ giải cấu hình TRƯỚC 2.11.0 trả `--neo`
# thành chuoi con dau cheo nguoc (\"04069351\"), nen chan nay do co ten: rang
# nay khong the xanh tren ban chua va.
if ! git -C "$ROOT" rev-parse --verify -q "${NEO}^{commit}" >/dev/null 2>&1; then
  echo "DO: khong giai duoc sha nen '${NEO}' — phep do khong co nen de so" >&2
  exit 3
fi

# Chân 2 — ĐỐI CHỨNG DƯƠNG cùng cửa sổ: `lib/` PHẢI có đổi. Rỗng ở đây nghĩa là
# lệnh diff không chạy thật (clone nông, sai cwd, git chết), không phải «yên ả».
if ! git -C "$ROOT" diff --name-only "${NEO}..HEAD" -- lib/ 2>/dev/null | grep -q .; then
  echo "DO: doi chung duong rong — 'git diff ${NEO}..HEAD -- lib/' khong ra tep nao; phep do KHONG CHAY" >&2
  exit 4
fi

# Chân 3 — vật được đo.
DOI="$(git -C "$ROOT" diff --name-only "${NEO}..HEAD" -- diagram-design/ 2>/dev/null)"
if [ -n "$DOI" ]; then
  echo "DO: diagram-design CO doi trong cua so ma so chua cat:" >&2
  printf '  %s\n' $DOI >&2
  exit 5
fi

echo "PASS: diagram-design KHONG doi trong cua so, giu 2.7.0 (doi chung duong: lib/ CO doi)"
