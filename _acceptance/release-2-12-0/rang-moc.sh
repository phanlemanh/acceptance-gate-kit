#!/usr/bin/env bash
# rang-moc.sh — răng của hồ sơ release-2-12-0, chân `diagram`.
#
# CHÉP từ release-2-11-0. Thân từng MỞ RỘNG thêm chân 4 (so số với mốc phát hành
# TRƯỚC) trong hồ sơ này, rồi **owner TRỪ chân 4 ở lượt chấm 5**: nó tương đối với
# HEAD, nên hồ sơ ĐÃ KÝ sẽ đỏ giả vĩnh viễn ở chiến dịch ghim lại kế — đúng lớp mà
# chính header này (dưới đây) nói là lý do bản đầu bị bác. Nay răng giữ ĐÚNG ba
# chân đầu của bản 2-11-0, cộng hai chốt hạ tầng thêm ở lượt 4–5 (ROOT phải là kho
# git · pathspec phải còn khớp vật) và một dấu bản răng. Vì sao
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
#   8  không có NỀN để đo (ROOT không phải kho git · pathspec `diagram-design/`
#      không khớp tệp nào) → chưa đo được
#   0  xanh
#
# Mã 7 ĐÃ BỎ cùng chân 4 (owner quyết lượt chấm 5). Số mã giữ chỗ trống chứ không
# dồn lại: một hồ sơ đã ký ở cửa sổ trước còn trỏ tới mã 7 theo nghĩa cũ, nên đánh
# số lại là làm sử liệu nói sai. Phân vai vẫn thế: mã nói về VẬT (5) tách khỏi mã
# nói về HẠ TẦNG của phép đo (2 · 8).
#
# Gốc kho suy TỪ VỊ TRÍ SCRIPT (bài học P150), không từ thư mục gọi.
set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
G() { git -C "$ROOT" "$@"; }
# Chốt HẠ TẦNG trước mọi phép đo: `ver_tai` dìm stderr của git, nên nếu ROOT không
# phải kho git (bản chép chạy ở thư mục khác, git vỡ, object store không đọc được)
# thì mọi vế đều trả rỗng và răng báo mã 6 «vật không còn» — tức khai một thất bại
# của THƯỚC thành một sự thật về VẬT. Răng bên cạnh (rang-p200.sh) phân đúng ca này
# là lối «chưa từng chạy»; đây là vế đối ứng.
if ! G rev-parse --git-dir >/dev/null 2>&1; then
  echo "DO: ROOT (${ROOT}) khong phai kho git — thuoc khong chay duoc, khong co nen de do" >&2
  exit 8
fi
CHAN=""
while [ $# -gt 0 ]; do
  case "$1" in
    --chan) [ $# -ge 2 ] || { echo "rang-moc: --chan thieu gia tri" >&2; exit 2; }
      CHAN="$2"; shift 2 ;;
    *) echo "rang-moc: tham so la: $1" >&2; exit 2 ;;
  esac
done
# `--chan` cưỡng chế cứng để một cờ rơi khỏi config KHÔNG âm thầm thành xanh.
# Lời khai cũ ở đây nói nó còn canh cả vỏ nháy của bộ giải TRƯỚC 2.11.0; lượt chấm
# 4 bắt: khoá `moc_diagram_2_12` truyền giá trị TRẦN (`--chan diagram`) nên không
# còn đường nào đưa vỏ nháy tới chốt này. Chốt vẫn sống (`--chan 'diagram"'` →
# thoát 2), nhưng nó KHÔNG còn phân biệt bản đã vá bộ giải với bản chưa vá.
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
#
# ĐỐI CHỨNG DƯƠNG CHO CHÍNH BỘ LỌC (thêm ở lượt chấm 5). `diff --name-only … --
# <pathspec>` rỗng có HAI nguyên nhân không phân biệt được: (a) `diagram-design/`
# thật sự không đổi, (b) pathspec không khớp gì — gõ sai một chữ
# (`diagram-desgin/`) cũng in rỗng và thoát 0, không một dòng lỗi. Đối chứng dương
# mà dòng PASS quảng cáo là của chân 2 (cửa sổ NEO..HEAD không rỗng); nó KHÔNG
# chứng minh bộ lọc còn sống. Chốt dưới đây chứng minh chính literal ấy còn khớp
# vật trong cây, nên «rỗng» chỉ còn một nghĩa.
if ! G ls-files -- diagram-design/ 2>/dev/null | grep -q .; then
  echo "DO: pathspec 'diagram-design/' KHONG khop tep nao trong cay — bo loc chet, «khong doi» la rong nghia" >&2
  exit 8
fi
DOI="$(G diff --name-only "${NEO}..HEAD" -- diagram-design/ 2>/dev/null)"
if [ -n "$DOI" ]; then
  echo "DO: diagram-design CO doi sau lan cat so gan nhat (${NEO}) ma so chua tang:" >&2
  printf '%s\n' "$DOI" | sed 's/^/  /' >&2
  exit 5
fi

SO="$SO_HEAD"
# DẤU BẢN RĂNG, suy từ chính tệp đang chạy (không gõ tay, không trôi): lượt chấm 5
# bắt được rằng hai bản răng khác nhau in dòng PASS y hệt nhau, nên trường `output`
# đã ghim trong evidence-report KHÔNG phân biệt được bản nào đã chạy — bằng chứng
# không tự phân biệt là bằng chứng không đọc được lúc ghim lại.
# Đường TUYỆT ĐỐI suy từ vị trí tệp (P150): `$0` tương đối với cwd người gọi, còn
# `git -C ROOT` giải nó tương đối với ROOT — gọi từ `docs/` là dấu rỗng. Và rỗng thì
# ĐỎ: một đối chứng dương không cưỡng chế là một đối chứng chỉ quảng cáo (lượt 6).
TEP="$(cd "$(dirname "$0")" && pwd)/$(basename "$0")"
DAU="$(G hash-object "$TEP" 2>/dev/null | cut -c1-8)"
if [ -z "$DAU" ]; then
  echo "DO: khong doc duoc dau ban rang cua ${TEP} — bang chung khong tu phan biet duoc ban" >&2
  exit 8
fi
echo "PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (${NEO}), so doc duoc tai HEAD la ${SO} (doi chung duong: cua so moc..HEAD KHONG rong; bo loc diagram-design/ con khop vat; rang ban ${DAU})"
