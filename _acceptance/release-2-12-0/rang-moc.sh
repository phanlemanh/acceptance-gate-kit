#!/usr/bin/env bash
# rang-moc.sh — răng của hồ sơ release-2-12-0, chân `diagram`.
#
# CHÉP từ release-2-11-0, rồi thân MỞ RỘNG trong hồ sơ này: thêm chân 4 (quan hệ
# với mốc phát hành trước) và cờ `--moc-truoc` để chạy chiều đỏ của chân đó — cộng
# 48 dòng so bản gốc. Ba chân đầu giữ nguyên văn. Lời khai này từng viết «NGUYÊN
# VẸN phần thân»; lượt chấm 4 bắt đúng nó, vì người soát lại dùng câu ấy để quyết
# «không cần đọc thân» trong khi thân là chỗ lượt 2 và 3 sửa nhiều nhất. Vì sao
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
#   8  không có NỀN để đo (ROOT không phải kho git · pathspec `diagram-design/`
#      không khớp tệp nào · không suy được mốc trước · không đọc được số của
#      acceptance-gate tại HEAD hoặc tại mốc trước) → chưa đo được
#   0  xanh
#
# Vì sao 7 và 8 tách (lượt chấm 4): gộp chúng làm «lời hứa đã sai» trông y như
# «chưa có nền để đo» — đúng cặp mà hiến pháp bắt phân biệt. 7 nói về VẬT, 8 nói
# về HẠ TẦNG của phép đo.
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
MOC_TRUOC=""
while [ $# -gt 0 ]; do
  case "$1" in
    --chan) [ $# -ge 2 ] || { echo "rang-moc: --chan thieu gia tri" >&2; exit 2; }
      CHAN="$2"; shift 2 ;;
    --moc-truoc) [ $# -ge 2 ] || { echo "rang-moc: --moc-truoc thieu gia tri" >&2; exit 2; }
      MOC_TRUOC="$2"; shift 2 ;;
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
# Mốc phát hành TRƯỚC suy TỪ KHO, không gõ vào config — chính header của tệp này
# tuyên như vậy, mà bản lượt 2 lại nhận sha qua cờ. Thuật toán giống hệt chân 1:
# đi ngược lịch sử manifest của acceptance-gate, dừng ở commit ĐẦU TIÊN mang số
# KHÁC số tại HEAD. Đó là commit cuối cùng của bản phát hành trước.
if [ -z "$MOC_TRUOC" ]; then
  SO_AG_HEAD="$(G show "HEAD:.claude-plugin/plugin.json" 2>/dev/null | sed -n 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)"
  # Chốt rỗng, ĐỐI XỨNG với chốt của SO_HEAD ở trên. Không có nó thì vòng dưới chỉ
  # còn điều kiện `[ -n "$v" ]`, nên nó nhận ngay commit MỚI NHẤT chạm manifest —
  # một commit NẰM TRONG chính cửa sổ đang đo — và phép so «quan hệ với mốc phát
  # hành TRƯỚC» thoái hoá thành so mốc VỚI CHÍNH NÓ, thoát 0 không một dòng cảnh
  # báo. Lượt chấm 4 chạy thật chiều đỏ đó: SO_AG_HEAD rỗng → mốc trước suy ra
  # 3f492e2e, tức commit của chính mốc đang chấm.
  if [ -z "$SO_AG_HEAD" ]; then
    echo "DO: khong doc duoc so acceptance-gate tai HEAD — khong co nen de suy moc phat hanh truoc" >&2
    exit 8
  fi
  for sha in $(G log --format=%H -- ".claude-plugin/plugin.json" 2>/dev/null); do
    v="$(G show "${sha}:.claude-plugin/plugin.json" 2>/dev/null | sed -n 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)"
    if [ -n "$v" ] && [ "$v" != "$SO_AG_HEAD" ]; then MOC_TRUOC="$sha"; break; fi
  done
fi
# FAIL-CLOSED. Bản lượt 2 bọc cả chân này trong `if [ -n "$MOC_TRUOC" ]`, nên cờ
# rơi khỏi config (hoặc bộ giải nuốt giá trị thành rỗng) là răng vẫn thoát 0 với
# một dòng PASS ngắn hơn — fail-open IM LẶNG, đúng lớp mà chân `--chan` ở trên bị
# cưỡng chế cứng để tránh.
if [ -z "$MOC_TRUOC" ]; then
  echo "DO: khong suy duoc moc phat hanh truoc tu kho — khong co nen de so quan he" >&2
  exit 8
fi
SO_TRUOC="$(ver_tai "$MOC_TRUOC")"
if [ -z "$SO_TRUOC" ]; then
  echo "DO: khong doc duoc so tai moc truoc (${MOC_TRUOC}) — khong co nen de so quan he" >&2
  exit 8
fi
if [ "$SO_HEAD" != "$SO_TRUOC" ]; then
  echo "DO: so tai HEAD (${SO_HEAD}) KHAC so tai moc phat hanh truoc ${MOC_TRUOC} (${SO_TRUOC})" >&2
  exit 7
fi

SO="$SO_HEAD"
# DẤU BẢN RĂNG, suy từ chính tệp đang chạy (không gõ tay, không trôi): lượt chấm 5
# bắt được rằng hai bản răng khác nhau in dòng PASS y hệt nhau, nên trường `output`
# đã ghim trong evidence-report KHÔNG phân biệt được bản nào đã chạy — bằng chứng
# không tự phân biệt là bằng chứng không đọc được lúc ghim lại.
DAU="$(G hash-object "$0" 2>/dev/null | cut -c1-8)"
echo "PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (${NEO}), giu ${SO} BANG so tai moc truoc ${MOC_TRUOC} (doi chung duong: cua so moc..HEAD KHONG rong; bo loc diagram-design/ con khop vat; rang ban ${DAU:-khong-doc-duoc})"
