#!/usr/bin/env bash
# rang-moc.sh — răng của hồ sơ release-2-12-0, chân `diagram`.
#
# CHÉP từ release-2-11-0 NGUYÊN VẸN phần thân, chỉ đổi dòng tên hồ sơ này. Vì sao
# chép chứ không trỏ sang tệp của hồ sơ kia: hồ sơ đã KÝ là sử liệu, và một eval của
# hồ sơ mới trỏ vào tệp của hồ sơ cũ biến hồ sơ cũ thành vật chịu lực vĩnh viễn —
# sửa nó là chạm sử liệu, xoá nó là gãy hồ sơ mới. Bất biến bên dưới KHÔNG ghim số
# của một mốc nào (mốc so suy TỪ KHO), nên bản chép chạy đúng ở mọi cửa sổ.
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
#   4  cửa sổ mốc..HEAD RỖNG (mốc trùng HEAD)        → kết luận là hằng đúng
#   5  diagram-design/ CÓ đổi sau lần cắt số gần nhất → số đang nói dối
#   6  không đọc được số tại HEAD (vật không còn)  → không có vật để đo
#   7  số tại HEAD KHÁC số tại mốc phát hành trước → lời hứa «giữ số» đã sai
#   0  xanh
#
# Gốc kho suy TỪ VỊ TRÍ SCRIPT (bài học P150), không từ thư mục gọi.
set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
G() { git -C "$ROOT" "$@"; }
CHAN=""
MOC_TRUOC=""
while [ $# -gt 0 ]; do
  case "$1" in
    --chan) CHAN="${2:-}"; shift 2 ;;
    --moc-truoc) MOC_TRUOC="${2:-}"; shift 2 ;;
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
# Chân 0 — VẬT phải còn tồn tại và số phải đọc được. Không có chân này thì xoá
# hẳn `diagram-design/` vẫn cho PASS: commit xoá cũng «đổi số» (2.7.0 → rỗng)
# nên nó thành mốc, và diff mốc..HEAD rỗng. Chiều đỏ bắt được ngay khi dựng.
SO_HEAD="$(ver_tai HEAD)"
if [ -z "$SO_HEAD" ]; then
  echo "DO: khong doc duoc so tai HEAD tu ${MANIFEST} — vat khong con hoac manifest hong" >&2
  exit 6
fi

NEO=""
for sha in $(G log --format=%H -- "$MANIFEST" 2>/dev/null); do
  cha="$(G rev-parse -q --verify "${sha}^" 2>/dev/null || true)"
  if [ -z "$cha" ] || [ "$(ver_tai "$sha")" != "$(ver_tai "$cha")" ]; then NEO="$sha"; break; fi
done
if [ -z "$NEO" ]; then
  echo "DO: khong tim duoc lan CAT SO nao cua ${MANIFEST} — khong co nen de so" >&2
  exit 3
fi

# Chân 2 — ĐỐI CHỨNG DƯƠNG, phải KHẲNG ĐỊNH ĐƯỢC SAI.
#
# Hai bản trước đều hỏng CÙNG một kiểu và lượt chấm 2 rồi lượt 3 lần lượt gọi
# tên: chân kiểm một điều ĐÚNG THEO CẤU TẠO nên không bao giờ nổ được.
#   bản 1: «mốc có chạm diagram-design/ không» — mốc vốn được CHỌN theo một
#          đường dẫn nằm trong diagram-design/.
#   bản 2: «số tại mốc khác số tại cha» — vòng lặp CHỌN mốc chính vì điều đó.
#
# Điều thật sự có thể sai, và làm kết luận ở chân 3 hoá vô nghĩa khi nó sai:
# **cửa sổ mốc..HEAD phải KHÔNG RỖNG**. Nếu mốc TRÙNG HEAD (vừa cắt số
# diagram-design xong, hoặc kho squash một commit) thì `diff` rỗng với MỌI
# đường dẫn — «diagram-design không đổi» lúc đó là hằng đúng, không phải một
# phép đo. Chân này nổ thật: nó đỏ ngay sau mỗi lần diagram-design lên số.
if ! G diff --name-only "${NEO}..HEAD" 2>/dev/null | grep -q .; then
  echo "DO: cua so ${NEO}..HEAD RONG (moc trung HEAD) — ket luan «khong doi» la hang dung, khong phai phep do" >&2
  exit 4
fi

# Chân 3 — vật được đo.
DOI="$(G diff --name-only "${NEO}..HEAD" -- diagram-design/ 2>/dev/null)"
if [ -n "$DOI" ]; then
  echo "DO: diagram-design CO doi sau lan cat so gan nhat (${NEO}) ma so chua tang:" >&2
  printf '  %s\n' $DOI >&2
  exit 5
fi

# Chân 4 — QUAN HỆ, không phải vị từ (thêm sau phản biện context sạch của hồ sơ
# release-2-12-0). Ba chân trên chỉ nói «không đổi kể từ lần cắt số của CHÍNH NÓ»
# rồi IN RA bất kỳ số nào đọc được. Lời hứa của hợp đồng mạnh hơn thế: số phải
# GIỮ NGUYÊN so với mốc phát hành TRƯỚC. Không có chân này, ở mốc sau nữa (khi
# diagram-design đã lên 2.8.0) răng vẫn PASS và in «giu 2.8.0» trong khi hợp đồng
# nói 2.7.0 — răng ghim lại được bằng cách rỗng nghĩa.
# Số so KHÔNG gõ vào đây: nó đọc từ manifest TẠI commit mốc trước, tức suy TỪ KHO.
if [ -n "$MOC_TRUOC" ]; then
  SO_TRUOC="$(ver_tai "$MOC_TRUOC")"
  if [ -z "$SO_TRUOC" ]; then
    echo "DO: khong doc duoc so tai moc truoc (${MOC_TRUOC}) — khong co nen de so quan he" >&2
    exit 7
  fi
  if [ "$SO_HEAD" != "$SO_TRUOC" ]; then
    echo "DO: so tai HEAD (${SO_HEAD}) KHAC so tai moc phat hanh truoc ${MOC_TRUOC} (${SO_TRUOC})" >&2
    exit 7
  fi
fi

SO="$SO_HEAD"
if [ -n "$MOC_TRUOC" ]; then
  echo "PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (${NEO}), giu ${SO} BANG so tai moc truoc ${MOC_TRUOC} (doi chung duong: cua so moc..HEAD KHONG rong)"
else
  echo "PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (${NEO}), giu ${SO} (doi chung duong: cua so moc..HEAD KHONG rong)"
fi
