#!/usr/bin/env bash
# Răng đo SỰ VẮNG MẶT cho hồ sơ luu-kho-codex-va-nghi-le-design.
#
# Vật được giao ở hồ sơ này phần lớn là thứ KHÔNG còn nữa. Đó là hình dạng nguy
# hiểm nhất trong sổ vấp của kho: "assertion âm-tính-một-mình là assertion không
# sống" — grep hỏng, đường dẫn gõ sai, script chưa chạy đều cho cùng một màu
# xanh. Nên MỌI phép đo âm ở đây bị buộc ba điều:
#   (a) ĐỐI CHỨNG DƯƠNG neo vào mốc `truoc-luu-kho-2026-08` (bất biến; KHÔNG
#       dùng origin/main vì nó còn di chuyển). Mốc VẮNG → ĐỎ, không bỏ qua.
#   (b) GHIM ĐÚNG THÔNG ĐIỆP, không tin mã thoát.
#   (c) CHIỀU ĐỎ CHẠY THẬT: dựng bản sao có vật bị lưu kho chép ngược về, chạy
#       lại CHÍNH hàm kiểm đó, và đòi nó ĐỎ.
#
# Mọi đường dẫn SUY TỪ VỊ TRÍ SCRIPT — không hardcode ROOT (lớp lỗi đã ghi sổ:
# phép đo so với checkout của tác giả thay vì cây đang kiểm).
set -u

WS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$WS/../.." && pwd)"
TAG="truoc-luu-kho-2026-08"
fails=0
ok()   { echo "  OK   $*"; }
bad()  { echo "  ĐỎ   $*"; fails=$((fails + 1)); }
mut()  { echo "       [đột biến] $*"; }

g() { git -C "$ROOT" "$@"; }

CONTRACT="$WS/contract.md"

# ── MỘT NGUỒN: mọi DANH SÁCH mà hợp đồng hứa đều ĐỌC TỪ hợp đồng ─────────────
# Rà soát đối kháng vòng 2 (F1, F3) bắt đúng MỘT hình dạng, hai lần: hợp đồng
# khai BẢY đường dẫn thì mảng bash chép SÁU; hợp đồng khai BỐN needle
# `plugins/…` thì mảng chép MỘT. Không phải người làm ẩu — là cấu trúc: hợp
# đồng bị sửa hợp lệ nhiều lần sau Cổng 1, và mỗi lần sửa là một cơ hội cho bản
# chép tay bị bỏ quên. Đúng lớp «bên VIẾT và bên ĐỌC trôi khỏi nhau» (CLAUDE.md).
#
# Chữa bằng ĐỔI BẤT BIẾN, không nới phép khớp: bên viết và bên đọc dùng CHUNG
# một bản — đúng nếp `SO-CA-KY-VONG`, bản duy nhất mà cả ba phiên chấm vòng 2
# tấn công trực diện và KHÔNG thủng.
#
# `khoi_khai <tệp> <marker> <tên-cột>` → in từng mục, mỗi dòng một. Bảng
# markdown một cột; bỏ dòng tiêu đề và dòng gạch ngang. Khối vắng/rỗng thì bên
# GỌI phải fail-closed — KHÔNG mặc định về mảng nào: phép đo mất bản khai là
# phép đo không còn đo gì.
khoi_khai() {
  awk -v o="<!-- <<<$2 -->" -v c="<!-- $2>>> -->" -v hdr="$3" '
    index($0, o) { f = 1; next }
    index($0, c) { f = 0 }
    f && /^\|/ {
      line = $0
      sub(/^\|[ \t]*/, "", line)
      sub(/[ \t]*\|[ \t]*$/, "", line)
      if (line == hdr || line ~ /^-+$/ || line == "") next
      print line
    }
  ' "$1"
}
# Đọc một khối vào mảng, fail-closed nếu rỗng. Dùng cho CẢ đường chính lẫn
# đường chiều-đỏ (chiều đỏ trỏ vào bản sao hợp đồng đã bị tiêm).
doc_khoi() {   # $1 = tệp hợp đồng, $2 = marker, $3 = tên cột → in ra, rc≠0 nếu rỗng
  local out
  out="$(khoi_khai "$1" "$2" "$3")"
  [ -n "$out" ] || return 1
  printf '%s\n' "$out"
}

# ── Chân sống-còn: mốc phải tồn tại. Thiếu mốc thì MỌI đối chứng dương bên dưới
#    vô nghĩa, nên fail-closed ngay, không chạy tiếp cho có màu. ───────────────
check_tag_exists() {
  local tag="$1"
  g rev-parse -q --verify "refs/tags/$tag^{commit}" >/dev/null 2>&1
}
if ! check_tag_exists "$TAG"; then
  echo "LUU-KHO-TAG: thieu tag doi chung — khong the chay bat ky phep do am nao"
  exit 1
fi
TAG_SHA="$(g rev-parse "$TAG^{commit}")"

echo "== E1 · mốc đảo =="
echo "LUU-KHO-TAG: $TAG -> $TAG_SHA"
for p in codex design-loop plugins; do
  if g ls-tree -d --name-only "$TAG" -- "$p" | grep -q .; then
    ok "LUU-KHO-TAG: cây của mốc có $p/"
  else
    bad "LUU-KHO-TAG: cây của mốc THIẾU $p/ — mốc trỏ sai chỗ"
  fi
done
# Mốc phải là CHA TRỰC TIẾP của commit gỡ đầu tiên. Quan hệ tổ-tiên KHÔNG đủ:
# nó cho phép chèn commit khác vào giữa, tức cây của mốc không còn là "ngay
# trước khi gỡ".
FIRST_CUT="$(g log --format=%H --reverse "$TAG..HEAD" -- codex design-loop plugins | head -1)"
if [ -z "$FIRST_CUT" ]; then
  bad "LUU-KHO-TAG: khong tim thay commit go dau tien"
else
  PARENT="$(g rev-parse "$FIRST_CUT^")"
  if [ "$PARENT" = "$TAG_SHA" ]; then
    ok "LUU-KHO-TAG: la cha cua commit go dau tien OK"
  else
    bad "LUU-KHO-TAG: khong phai cha truc tiep cua commit go dau tien ($PARENT != $TAG_SHA)"
  fi
fi
# Chân này gọi MẠNG, nên nó có hai kiểu hỏng khác hẳn nhau và màu đỏ phải nói
# được là kiểu nào: "mốc chưa đẩy lên" (vật hỏng — chặn merge) khác hẳn "không
# hỏi được remote" (đường truyền hỏng — chạy lại là xong). Gộp hai thứ vào một
# thông điệp thì một lần mạng chập đọc y như một hồ sơ thiếu đường đảo, và
# người đọc sẽ học cách phớt lờ đúng cái chân sống-còn nhất. Thử 3 lượt để nuốt
# cú chập ngắn; hết 3 lượt vẫn không hỏi được thì vẫn ĐỎ (fail-closed: không
# chứng minh được là đã đẩy thì không được coi như đã đẩy).
#
# Phép so phải là QUAN HỆ (sha NÀY nằm dưới ĐÚNG ref này), không phải từ vựng
# (sha có xuất hiện đâu đó trong khối trả về). Bản trước `grep -q "$TAG_SHA"`
# trên cả khối: một mốc KHÁC trỏ cùng commit — chuyện thường khi ai đó gắn thêm
# nhãn phát hành — làm chân này xanh trong khi mốc NÀY chưa hề được đẩy, tức
# đường đảo mà hai ADR viện dẫn không tồn tại trên remote. Mốc chú giải in hai
# dòng (`refs/tags/X` mang sha của đối tượng tag, `refs/tags/X^{}` mang sha
# commit) nên nhận cả hai dạng, nhưng TÊN phải khớp tuyệt đối.
remote_has_tag() {   # $1 = đầu ra ls-remote, $2 = tên mốc, $3 = sha commit
  printf '%s\n' "$1" | awk -v s="$3" -v t="refs/tags/$2" \
    '$1 == s && ($2 == t || $2 == t "^{}") { f = 1 } END { exit !f }'
}
LS_OUT=""; LS_RC=1
for _try in 1 2 3; do
  LS_OUT="$(g ls-remote --tags origin 2>/dev/null)"; LS_RC=$?
  [ "$LS_RC" -eq 0 ] && [ -n "$LS_OUT" ] && break
  sleep 2
done
if [ "$LS_RC" -ne 0 ] || [ -z "$LS_OUT" ]; then
  bad "LUU-KHO-TAG: khong hoi duoc remote sau 3 luot — chua chung minh duoc moc da day (loi duong truyen, KHONG phai loi ho so)"
elif remote_has_tag "$LS_OUT" "$TAG" "$TAG_SHA"; then
  ok "LUU-KHO-TAG: co tren remote duoi dung refs/tags/$TAG OK"
else
  bad "LUU-KHO-TAG: chua day len remote (khong co dong refs/tags/$TAG tro $TAG_SHA)"
fi
# chiều đỏ 1: gọi lại chính hàm kiểm với tên mốc bịa
if check_tag_exists "truoc-luu-kho-KHONG-CO"; then
  bad "LUU-KHO-TAG: ham kiem mốc xanh voi tag bia — phep do khong song"
else
  mut "tên mốc bịa → hàm kiểm ĐỎ đúng như mong đợi"
fi
# chiều đỏ 2 (CHẠY THẬT trên chính hàm so): dựng một khối ls-remote trong đó
# ĐÚNG sha này nằm dưới một tên mốc KHÁC — đây là hình dạng làm bản trước xanh giả.
FAKE_LS="$(printf '%s\trefs/tags/mot-moc-khac\n%s\trefs/tags/mot-moc-khac^{}\n' "$TAG_SHA" "$TAG_SHA")"
if remote_has_tag "$FAKE_LS" "$TAG" "$TAG_SHA"; then
  bad "LUU-KHO-TAG: sha nam duoi ref KHAC ma ham so van xanh — do tu vung, khong do quan he"
elif remote_has_tag "$FAKE_LS" "mot-moc-khac" "$TAG_SHA"; then
  mut "cùng sha dưới refs/tags khác → hàm so ĐỎ cho mốc này, XANH cho mốc kia (đối chứng dương)"
else
  bad "LUU-KHO-TAG: ham so do ca voi ref dung — khoi dung thu khong hop le, chieu do khong chay"
fi

echo "== E2 · vật đã lưu kho (danh sách ĐỌC TỪ hợp đồng) =="
# Danh sách KHÔNG gõ ở đây. Bản duyệt gõ tay sáu mục trong khi AC-2 khai bảy, và
# vế thứ bảy (`.codex-plugin/`) — vế được THÊM sau Cổng 1 chính vì đợt gỡ 197
# tệp đã bỏ sót nó thật — là vế duy nhất không ai đo (F1, cả ba lăng kính vòng 2
# tìm ra độc lập). Nay mảng rút từ khối `VAT-LUU-KHO` trong `contract.md`.
if ! GONE_RAW="$(doc_khoi "$CONTRACT" VAT-LUU-KHO duong-dan)"; then
  bad "LUU-KHO-PATH: khoi VAT-LUU-KHO trong contract.md VANG hoac RONG — phep do khong co ban khai de doc"
  GONE=()
else
  mapfile -t GONE <<< "$GONE_RAW"
fi
path_check() {   # $1 = cây làm việc cần soi, $2 = (tuỳ chọn) mảng thay thế qua biến GONE_OVR
  local base="$1" n=0 bad_local=0 p
  local -a list=("${GONE[@]}")
  [ -n "${GONE_OVR:-}" ] && mapfile -t list <<< "$GONE_OVR"
  for p in "${list[@]}"; do
    local at_head=1 at_tag=0
    [ -e "$base/$p" ] || at_head=0
    g ls-tree --name-only "$TAG" -- "$p" | grep -q . && at_tag=1
    if [ "$at_head" -eq 1 ]; then
      echo "LUU-KHO-PATH: $p con tren HEAD"; bad_local=1
    elif [ "$at_tag" -eq 0 ]; then
      echo "LUU-KHO-PATH: $p khong co o tag — doi chung duong hong, assertion nay khong song"; bad_local=1
    else
      n=$((n + 1))
    fi
  done
  echo "LUU-KHO-PATH: $n/${#list[@]}"
  return $bad_local
}
if OUT="$(path_check "$ROOT")" && printf '%s' "$OUT" | grep -q "LUU-KHO-PATH: ${#GONE[@]}/${#GONE[@]}"; then
  ok "LUU-KHO-PATH: ${#GONE[@]}/${#GONE[@]} vang o HEAD, co o tag OK (danh sach doc tu khoi VAT-LUU-KHO)"
else
  printf '%s\n' "$OUT" | sed 's/^/       /'
  bad "LUU-KHO-PATH: có vật lệch (xem trên)"
fi
# ROUND-TRIP: chứng minh phép đo THẬT SỰ đọc khối, chứ không tình cờ trùng một
# mảng chép tay. Sửa khối trong BẢN SAO hợp đồng → phép đo phải ĐỔI THEO. Không
# có chân này thì "đọc từ hợp đồng" mới là một câu trong chú thích.
MUTCT="$(mktemp)"
sed 's|^<!-- VAT-LUU-KHO>>> -->$|\| vat-khong-he-ton-tai-round-trip \|\n<!-- VAT-LUU-KHO>>> -->|' \
  "$CONTRACT" > "$MUTCT"
if ! MUT_RAW="$(doc_khoi "$MUTCT" VAT-LUU-KHO duong-dan)"; then
  bad "LUU-KHO-PATH: ban sao hop dong doc ra RONG — buoc tiem hong, round-trip KHONG chay"
elif [ "$(printf '%s\n' "$MUT_RAW" | grep -c .)" -ne "$(( ${#GONE[@]} + 1 ))" ]; then
  bad "LUU-KHO-PATH: tiem 1 dong ma so muc khong tang dung 1 — round-trip KHONG chay"
else
  OUT_RT="$(GONE_OVR="$MUT_RAW" path_check "$ROOT")"; RT_RC=$?
  if [ "$RT_RC" -ne 0 ] && printf '%s' "$OUT_RT" | grep -q 'vat-khong-he-ton-tai-round-trip khong co o tag'; then
    mut "thêm 1 dòng vào khối VAT-LUU-KHO của bản sao hợp đồng → phép đo ĐỔI THEO và ĐỎ đích danh mục vừa thêm"
  else
    bad "LUU-KHO-PATH: sua khoi hop dong ma phep do KHONG doi (rc=$RT_RC) — mang van la ban chep tay"
  fi
fi
rm -f "$MUTCT"
# chiều đỏ: chép `codex/` từ mốc về một bản sao rồi chạy lại CHÍNH hàm trên.
# KHÔNG `mkdir -p "$MUTDIR/codex"` trước: một thư mục RỖNG tạo sẵn cũng thoả
# `[ -e ]`, nên bản trước cho chiều đỏ ĐỎ kể cả khi giải nén hỏng hoàn toàn —
# tức nó chứng minh `mkdir` chạy được, không chứng minh vật lấy lại được từ mốc.
# Hai lần `2>/dev/null` cũng bỏ: chúng nuốt đúng cái dấu vết cần đọc.
MUTDIR="$(mktemp -d)"
ARCH_ERR="$(g archive "$TAG" codex 2>&1 >"$MUTDIR/codex.tar")"; ARCH_RC=$?
if [ "$ARCH_RC" -ne 0 ]; then
  bad "LUU-KHO-PATH: khong lay duoc codex/ tu moc ($(printf '%s' "$ARCH_ERR" | head -c 120)) — doi chung duong hong, chieu do KHONG chay"
elif ! tar -x -C "$MUTDIR" -f "$MUTDIR/codex.tar"; then
  bad "LUU-KHO-PATH: giai nen ban chep tu moc HONG — chieu do KHONG chay"
elif [ ! -d "$MUTDIR/codex" ] || [ -z "$(ls -A "$MUTDIR/codex")" ]; then
  bad "LUU-KHO-PATH: ban chep tu moc RONG — chieu do KHONG chay"
elif OUT2="$(path_check "$MUTDIR")"; printf '%s' "$OUT2" | grep -q "LUU-KHO-PATH: codex con tren HEAD"; then
  mut "chép codex/ từ mốc về bản sao ($(find "$MUTDIR/codex" -type f | grep -c .) tệp) → ĐỎ đúng thông điệp"
else
  bad "LUU-KHO-PATH: chieu do khong chay — ban sao co codex/ ma van xanh"
fi
rm -rf "$MUTDIR"

echo "== E3 · marketplace =="
mkt_check() {
  node -e '
    const fs = require("fs");
    const d = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    const names = (d.plugins || []).map(p => p.name).sort();
    process.stdout.write(names.join(","));
  ' "$1"
}
NAMES="$(mkt_check "$ROOT/.claude-plugin/marketplace.json")"
if [ "$NAMES" = "acceptance-gate,feature-loop" ]; then
  ok "LUU-KHO-MKT: claude 2 plugin (acceptance-gate, feature-loop) OK"
else
  bad "LUU-KHO-MKT: tap plugin la [$NAMES], mong [acceptance-gate,feature-loop]"
fi
[ -e "$ROOT/.agents/plugins/marketplace.json" ] \
  && bad "LUU-KHO-MKT: .agents/plugins/marketplace.json van con" \
  || ok "LUU-KHO-MKT: .agents/plugins/marketplace.json vang OK"
TAGMKT="$(mktemp)"; g show "$TAG:.claude-plugin/marketplace.json" > "$TAGMKT" 2>/dev/null
TAGN="$(mkt_check "$TAGMKT")"
if [ "$(printf '%s' "$TAGN" | tr ',' '\n' | grep -c .)" -eq 3 ]; then
  ok "LUU-KHO-MKT: tag co 3 entry OK"
else
  bad "LUU-KHO-MKT: tag co [$TAGN] — doi chung duong hong"
fi
# chiều đỏ: thêm lại entry design-loop vào bản sao
MUTMKT="$(mktemp)"
node -e '
  const fs = require("fs");
  const d = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  d.plugins.push({ name: "design-loop", source: { source: "./design-loop" } });
  fs.writeFileSync(process.argv[2], JSON.stringify(d));
' "$ROOT/.claude-plugin/marketplace.json" "$MUTMKT"
if printf '%s' "$(mkt_check "$MUTMKT")" | grep -q "design-loop"; then
  mut "thêm lại entry design-loop vào bản sao → phép đọc thấy 'con entry design-loop'"
else
  bad "LUU-KHO-MKT: chieu do khong chay"
fi
rm -f "$TAGMKT" "$MUTMKT"

echo "== E4 · tham chiếu sống =="
# Phạm vi quét SỐNG. `docs/` và `_acceptance/` cố ý NGOÀI phạm vi (sử liệu).
# `tests/` KHÔNG nằm trong phép quét văn bản này, và đây là quyết định có lý do
# chứ không phải nới lỏng: trong `tests/`, "không còn con trỏ sống" được cưỡng
# chế bằng thứ MẠNH HƠN GREP — đẳng thức số ca của AC-11 cộng suite phải XANH.
# Một con trỏ sống sót trong test thì test ĐỎ, không cần grep mới biết. Cái mà
# grep còn bắt được trong `tests/` chỉ còn hai loại, và cả hai đều là sử liệu:
# chú thích ghi VÌ SAO một vật bị lưu kho, và chuỗi fixture cố ý mang tên đường
# dẫn đã chết để chứng minh luật không còn khớp nó nữa. Cấm hai loại đó là bắt
# cuốn sổ ghi-những-gì-đã-xoá không được nhắc tới thứ đã xoá.
SCOPE=(commands skills feature-loop scripts lib hooks GUIDE.md QUICKSTART.md
       README.md CONTEXT.md CLAUDE.md .github .claude-plugin)
# Needle `plugins/` neo vào GỐC KHO: chuỗi trần khớp luôn `tests/plugins/`, là
# bộ kiểm CÒN SỐNG (sửa-sau-Cổng-1 12/08).
# `mirror_sync` KHÔNG ở đây: khoá đó sống trong `_acceptance/config.yaml`, mà
# `_acceptance/` cố ý ngoài phạm vi quét — để nó lại thì needle cho tag=0 và
# chính lưới này tuyên "phép đo không sống". Nó được E10 đo bằng trình đọc khoá.
# `P30` phải ghim ĐÚNG TIÊU ĐỀ ca đã chết: `P30` trần khớp luôn ca
# "P30 Claude decision commands" đang SỐNG — needle bắt nhầm vật.
# `.agents` phải ở dạng ĐƯỜNG DẪN: chuỗi trần khớp luôn `t.agents` trong bộ
# đếm token của wf-usage.mjs — needle bắt nhầm vật, không phải cây bẩn.
# `/design-push` bỏ khỏi mảng: đo trên mốc cho 0 hit trong phạm vi sống, tức
# lệnh đó chưa bao giờ được nhắc ở đây — giữ lại thì chính lưới này tuyên
# "needle chua bao gio ton tai".
# Ca `P30 plugins/ mirror` sống trong `tests/` nên KHÔNG thuộc phép quét văn bản
# này — E10 đo nó trực tiếp bằng một chân riêng trên chính tệp bộ kiểm.
# [SỬA SAU CỔNG 1 — 13/08, vòng sửa 2 «một-nguồn»] Mảng needle KHÔNG gõ ở đây
# nữa. Rà soát vòng 2 (F3) bắt được nó tái phạm NGUYÊN VĂN finding C2 của vòng
# 1: hợp đồng khai bốn needle `plugins/…`, mảng chép đúng MỘT — và chân đối
# chứng dương mà chính script này đòi (tag>0) vốn sẵn có cho cả ba needle bị
# thiếu, nên không có lý do kỹ thuật nào để bỏ. Nay rút từ khối `NEEDLE-CHET`
# trong `contract.md`, cùng một nếp với `VAT-LUU-KHO` và `SO-CA-KY-VONG`.
if ! NEEDLE_RAW="$(doc_khoi "$CONTRACT" NEEDLE-CHET needle)"; then
  bad "LUU-KHO-REF: khoi NEEDLE-CHET trong contract.md VANG hoac RONG — phep quet khong co ban khai de doc"
  NEEDLES=()
else
  mapfile -t NEEDLES <<< "$NEEDLE_RAW"
fi
# Mồi cho chiều đỏ: chuỗi VĂN BẢN khớp needle tương ứng (needle là biểu thức,
# mồi phải là thứ gõ được vào tệp). Tra theo TÊN NEEDLE, không theo chỉ số —
# chỉ số là bản chép tay thứ hai của thứ tự khối, và nó lệch âm thầm ngay lần
# đầu ai đó chèn một dòng vào giữa khối. Needle không có mồi → ĐỎ, không bỏ qua:
# đó là needle không có chiều đỏ.
MOI_KHAI='codex|codex/feature-loop-codex/SKILL.md
In Codex|In Codex
\.agents/|.agents/plugins/marketplace.json
design-loop|design-loop
/design-init|/design-init
/design-mockup|/design-mockup
sync-plugin-packages|sync-plugin-packages.sh
plugins/acceptance-gate|plugins/acceptance-gate
plugins/feature-loop|plugins/feature-loop/skills/feature-loop/SKILL.md
plugins/design-loop|plugins/design-loop/commands/design-init.md
plugins/\*\*|plugins/**'
moi_of() {   # $1 = needle → in mồi; rc≠0 nếu chưa khai
  printf '%s\n' "$MOI_KHAI" | awk -v n="$1" \
    'index($0, n "|") == 1 { print substr($0, length(n) + 2); h = 1; exit } END { exit !h }'
}
# ── Miễn trừ là CẶP (tệp, từ khoá), không phải (tệp, *) ──────────────────────
# Bản trước neo theo TIỀN TỐ TỆP, nên bốn tệp được che TRỌN cho cả tám needle —
# và đã có vật lọt thật: đặt một con trỏ sống tới bất kỳ đồ đã lưu kho nào vào
# một trong bốn tệp ấy thì cả lưới im. Nay mỗi dòng khai đúng một cặp, kèm SỐ
# DÒNG mong đợi (allowlist phình ra là cách lưới fail-loud hoá fail-silent).
# Lý do từng miễn trừ:
#   · skills/ux-ui-craft/SKILL.md × design-loop — "a design-loop" là DANH TỪ
#     CHUNG ("một vòng lặp thiết kế"), không trỏ plugin.
#   · hai plugin.json × {design-loop, sync-plugin-packages} — trường
#     `description` là NHẬT KÝ PHIÊN BẢN (sử liệu). Viết lại changelog cho lint
#     xanh là xoá lịch sử để lấy màu. E4c giữ cho miễn trừ này chỉ che ĐÚNG
#     trường `description`, không che cả tệp.
#   · `.claude-plugin/plugin.json × sync-plugin-packages` khai RIÊNG một dòng:
#     bản trước gộp nó vào miễn trừ-theo-tệp nên không ai thấy nó tồn tại, mà
#     rà soát vòng 1 lôi ra đúng nó — needle `sync-plugin-packages` còn **1 hit
#     sống** ở tệp này, xanh CHỈ NHỜ miễn trừ. Nó thuộc cùng dải nhật ký phiên
#     bản (E4c chứng minh nó nằm trong `description`), nhưng phải khai ra chứ
#     không được nấp sau một tiền tố tệp.
#
# `tests/plugins/asserts-da-go.txt` KHÔNG còn trong bảng này: `tests/` vốn ngoài
# SCOPE nên dòng miễn trừ cho nó chưa bao giờ với tới cái gì — một mục allowlist
# trang trí. Tính toàn vẹn của sổ khai ấy do bánh cóc HAI CHIỀU của `P161`/E11
# canh (assert mất mà không khai → đỏ; khai mà assert vẫn còn → cũng đỏ), mạnh
# hơn hẳn một dòng grep.
MIENTRU_KHAI='skills/ux-ui-craft/SKILL.md|design-loop|1
.claude-plugin/plugin.json|design-loop|1
.claude-plugin/plugin.json|sync-plugin-packages|1
feature-loop/.claude-plugin/plugin.json|design-loop|1'
mien_tru() {   # $1 = đường dẫn tệp, $2 = needle → rc 0 nếu CẶP này được miễn trừ
  printf '%s\n' "$MIENTRU_KHAI" | awk -F'|' -v f="$1" -v n="$2" \
    '$1 == f && $2 == n { h = 1 } END { exit !h }'
}
ref_hits() {   # $1 = cây, $2 = needle → in các dòng khớp (đã trừ miễn trừ THEO CẶP)
  local base="$1" needle="$2" line f
  ( cd "$base" && grep -rIn -- "$needle" "${SCOPE[@]}" 2>/dev/null ) \
  | while IFS= read -r line; do
      f="${line%%:*}"
      mien_tru "$f" "$needle" || printf '%s\n' "$line"
    done
}
# Một mục phạm vi gõ sai cho grep im lặng và cả tám needle in "HEAD=0 ... OK" —
# phép quét không còn quét gì mà vẫn xanh. Kiểm sự tồn tại TRƯỚC khi tin số 0.
sc_missing=""
for sp in "${SCOPE[@]}"; do [ -e "$ROOT/$sp" ] || sc_missing="$sc_missing $sp"; done
if [ -n "$sc_missing" ]; then
  bad "LUU-KHO-REF: pham vi quet co muc KHONG TON TAI:$sc_missing — moi so 0 duoi day vo nghia"
else
  ok "LUU-KHO-REF: ${#SCOPE[@]}/${#SCOPE[@]} muc pham vi ton tai OK"
fi
n_ok=0
for nd in "${NEEDLES[@]}"; do
  head_n="$(ref_hits "$ROOT" "$nd" | grep -c . || true)"
  tag_n="$(g grep -I -c -e "$nd" "$TAG" -- commands skills feature-loop scripts lib hooks \
             GUIDE.md QUICKSTART.md README.md CONTEXT.md CLAUDE.md .github .claude-plugin 2>/dev/null \
           | awk -F: '{s+=$NF} END{print s+0}')"
  if [ "$tag_n" -eq 0 ]; then
    bad "LUU-KHO-REF: $nd tag=0 — needle nay chua bao gio ton tai, phep do khong song"
  elif [ "$head_n" -ne 0 ]; then
    bad "LUU-KHO-REF: $nd HEAD=$head_n"
    ref_hits "$ROOT" "$nd" | head -3 | sed 's/^/         /'
  else
    echo "  OK   LUU-KHO-REF: $nd HEAD=0 tag=$tag_n(>0) OK"
    n_ok=$((n_ok + 1))
  fi
done
echo "LUU-KHO-REF: $n_ok/${#NEEDLES[@]}"
[ "$n_ok" -eq "${#NEEDLES[@]}" ] || bad "LUU-KHO-REF: $n_ok/${#NEEDLES[@]} needle sạch"
# Miễn trừ phải ĐÚNG số dòng đã khai, TỪNG CẶP — allowlist phình ra là cách lưới
# fail-loud hoá fail-silent. Hai chiều: khai thiếu thì lưới đỏ vì vật, khai THỪA
# (dòng khai mà tệp không còn hit nào) thì cũng đỏ — chặn thói đổ sẵn danh sách
# dài cho khỏi phải nghĩ.
mt_ok=0; mt_n=0
while IFS='|' read -r mf mn mc; do
  [ -n "$mf" ] || continue
  mt_n=$((mt_n + 1))
  real="$( ( cd "$ROOT" && grep -cIn -- "$mn" "$mf" 2>/dev/null ) || true)"
  real="${real:-0}"
  if [ "$real" -eq "$mc" ]; then
    mt_ok=$((mt_ok + 1))
  else
    bad "LUU-KHO-REF: mien tru ($mf × $mn) co $real dong, khai $mc"
  fi
done <<EOF_MT
$MIENTRU_KHAI
EOF_MT
[ "$mt_ok" -eq "$mt_n" ] && ok "LUU-KHO-REF: mien tru $mt_ok/$mt_n cap dung so dong da khai OK"

echo "== E4b · ĐỎ-NGOÀI-DANH-SÁCH cho MỌI từ khoá =="
# Bản trước dựng một trình quét RIÊNG (`ux_scan`) chỉ cho MỘT needle, nên nó
# chứng minh được đúng một điều rất hẹp và không hề chạy qua `ref_hits`. Nay:
# dựng bản sao phạm vi bằng `git archive` (code sinh, không chép tay), rồi với
# TỪNG needle tiêm mồi vào một tệp mà cặp (tệp, needle) KHÔNG được miễn trừ —
# ưu tiên chọn một tệp ĐANG được miễn trừ cho needle KHÁC, vì đó chính là lỗ mà
# miễn trừ-theo-tệp để lại. Rồi chạy lại CHÍNH `ref_hits`.
REFDIR="$(mktemp -d)"
if ! g archive HEAD "${SCOPE[@]}" | tar -x -C "$REFDIR"; then
  bad "LUU-KHO-REF: khong dung duoc ban sao pham vi — chieu do KHONG chay"
else
  r4=0
  for i in "${!NEEDLES[@]}"; do
    nd="${NEEDLES[$i]}"
    # (0a) mồi phải ĐƯỢC KHAI cho needle này. Needle rút từ hợp đồng nên ai thêm
    #      một dòng vào khối mà quên khai mồi thì needle ấy sẽ không có chiều đỏ
    #      — im lặng ở đây là cách «một nguồn» tự đẻ ra lỗ mới.
    if ! moi="$(moi_of "$nd")"; then
      bad "LUU-KHO-REF: needle '$nd' co trong khoi NEEDLE-CHET nhung CHUA KHAI MOI — needle nay khong co chieu do"
      continue
    fi
    # (0b) mồi phải THẬT SỰ khớp needle, nếu không đây là đột biến chết
    if ! printf '%s\n' "$moi" | grep -q -- "$nd"; then
      bad "LUU-KHO-REF: moi '$moi' KHONG khop needle '$nd' — dot bien chet"
      continue
    fi
    # (1) chọn nạn nhân: tệp được miễn trừ cho needle KHÁC, nếu không có thì CONTEXT.md
    victim=""
    while IFS='|' read -r mf mn _; do
      [ -n "$mf" ] || continue
      [ -f "$REFDIR/$mf" ] || continue
      mien_tru "$mf" "$nd" && continue
      victim="$mf"; break
    done <<EOF_V
$MIENTRU_KHAI
EOF_V
    [ -n "$victim" ] || victim="CONTEXT.md"
    # (2) đối chứng dương: bản sao CHƯA tiêm phải SẠCH cho needle này
    if [ -n "$(ref_hits "$REFDIR" "$nd")" ]; then
      bad "LUU-KHO-REF: ban sao chua tiem da co hit cho $nd — doi chung duong hong"
      continue
    fi
    # (3) tiêm rồi chạy lại CHÍNH ref_hits, đòi nó ghim ĐÚNG tệp vừa tiêm
    cp "$REFDIR/$victim" "$REFDIR/$victim.goc"
    printf '\nCon tro song vua tiem: %s\n' "$moi" >> "$REFDIR/$victim"
    HIT="$(ref_hits "$REFDIR" "$nd")"
    if printf '%s\n' "$HIT" | grep -q "^$victim:"; then
      r4=$((r4 + 1))
    else
      bad "LUU-KHO-REF: tiem '$moi' vao $victim ma ref_hits IM — mien tru dang che ca tep (thay: ${HIT:-rong})"
    fi
    mv "$REFDIR/$victim.goc" "$REFDIR/$victim"
  done
  if [ "$r4" -eq "${#NEEDLES[@]}" ]; then
    mut "tiêm mồi cho ${#NEEDLES[@]}/${#NEEDLES[@]} từ khoá vào tệp ĐANG được miễn trừ cho từ khoá khác → ref_hits ĐỎ ghim đúng tệp"
  else
    bad "LUU-KHO-REF: chieu do ngoai-danh-sach chi phu $r4/${#NEEDLES[@]} tu khoa"
  fi
fi
rm -rf "$REFDIR"

echo "== E4c · ĐỎ-NGOÀI-DANH-SÁCH (miễn trừ nhật ký phiên bản) =="
# Miễn trừ chỉ che TRƯỜNG description của hai manifest đã khai. Tiêm vào một
# trường khác, hoặc vào manifest thứ ba, thì lưới PHẢI đỏ.
PJ="$(mktemp -d)"
node -e '
  const fs = require("fs");
  const d = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  d.interface = d.interface || {};
  d.interface.longDescription = "Wire design-loop before using this plugin.";
  fs.writeFileSync(process.argv[2] + "/plugin.json", JSON.stringify(d, null, 2));
' "$ROOT/.claude-plugin/plugin.json" "$PJ"
FIELD_HIT="$(node -e '
  const fs = require("fs");
  const d = JSON.parse(fs.readFileSync(process.argv[1] + "/plugin.json", "utf8"));
  const bad = Object.entries(d).filter(([k, v]) =>
    k !== "description" && JSON.stringify(v).includes("design-loop")).map(([k]) => k);
  process.stdout.write(bad.join(","));
' "$PJ")"
if [ "$FIELD_HIT" = "interface" ]; then
  mut "tiêm design-loop vào interface.longDescription → ĐỎ ghim đúng trường ngoài miễn trừ"
else
  bad "LUU-KHO-REF: mien tru nhat-ky-phien-ban che ca TEP thay vi mot truong (thay: [$FIELD_HIT])"
fi
# đối chứng dương: trên bản THẬT, ngoài `description` không trường nào dính
REAL_HIT="$(node -e '
  const fs = require("fs");
  for (const p of process.argv.slice(1)) {
    const d = JSON.parse(fs.readFileSync(p, "utf8"));
    for (const [k, v] of Object.entries(d))
      if (k !== "description" && JSON.stringify(v).includes("design-loop")) process.stdout.write(p + ":" + k + " ");
  }
' "$ROOT/.claude-plugin/plugin.json" "$ROOT/feature-loop/.claude-plugin/plugin.json")"
[ -z "$REAL_HIT" ] \
  && ok "LUU-KHO-REF: hai manifest chi dinh o truong description OK" \
  || bad "LUU-KHO-REF: manifest dinh design-loop NGOAI description: $REAL_HIT"
rm -rf "$PJ"

echo "== E5 · nhánh UI trỏ design-pass =="
lane_section() {   # rút ĐÚNG mục "Làn design", không quét cả file
  awk '/^## Làn design/{f=1;next} /^## /{f=0} f' "$1"
}
# Bộ kiểm gói trong MỘT hàm để chiều đỏ chạy lại ĐÚNG nó chứ không dựng bản
# kiểm thứ hai. In mã lỗi, rỗng = XANH.
lane_check() {   # $1 = tệp SKILL cần soi
  local sec; sec="$(lane_section "$1")"
  if [ -z "$sec" ]; then echo "rut-hong"; return 0; fi
  printf '%s' "$sec" | grep -q 'design-pass'     || echo "thieu-design-pass"
  printf '%s' "$sec" | grep -q 'design-gate'     || echo "thieu-eval-design-gate"
  printf '%s' "$sec" | grep -q 'ui-check'        || echo "thieu-eval-ui-check"
  printf '%s' "$sec" | grep -q 'cài design-loop' && echo "con-cum-cai-design-loop"
  printf '%s' "$sec" | grep -q '/design-mockup'  && echo "con-buoc-doi-design-mockup"
  return 0
}
FLS="$ROOT/feature-loop/skills/feature-loop/SKILL.md"
E5OUT="$(lane_check "$FLS")"
if [ -z "$E5OUT" ]; then
  ok "LUU-KHO-CT2: nhanh UI tro design-pass OK"
else
  bad "LUU-KHO-CT2: muc Lan design lech — $(printf '%s' "$E5OUT" | tr '\n' ' ')"
fi
grep -q 'Wire `executors.design`' "$ROOT/GUIDE.md" \
  && ok "LUU-KHO-CT2: GUIDE co muc wire executors.design OK" \
  || bad "LUU-KHO-CT2: GUIDE thieu muc wire executors.design"
# đối chứng dương + CHIỀU ĐỎ CHẠY THẬT trong cùng một bước: dựng bản sao SKILL
# rồi đè mục "Làn design" của MỐC lên nó, và chạy lại CHÍNH `lane_check`. Bản
# trước chỉ in một câu ở thì tương lai («lưới trên *sẽ* ĐỎ») — thì tương lai
# trong bằng chứng nghĩa là chưa ai chạy.
TAGSKILL="$(mktemp)"; g show "$TAG:feature-loop/skills/feature-loop/SKILL.md" > "$TAGSKILL" 2>/dev/null
TAGSEC="$(mktemp)"; lane_section "$TAGSKILL" > "$TAGSEC"
# `lane_section` đọc mục ĐẦU TIÊN, và mục rút ra không chứa dòng `## ` nào — nên
# đặt mục của mốc lên đầu bản sao là đủ để phép rút đọc trúng nó.
MUTSKILL="$(mktemp)"; { echo "## Làn design"; cat "$TAGSEC"; cat "$FLS"; } > "$MUTSKILL"
if [ ! -s "$TAGSEC" ]; then
  bad "LUU-KHO-CT2: khong rut duoc muc Lan design cua moc — doi chung duong hong, chieu do KHONG chay"
else
  MUTOUT="$(lane_check "$MUTSKILL")"
  if printf '%s\n' "$MUTOUT" | grep -q 'con-buoc-doi-design-mockup'; then
    ok "LUU-KHO-CT2: tag co cum am OK (doi chung duong)"
    mut "đè mục Làn design của mốc lên bản sao → lane_check ĐỎ: $(printf '%s' "$MUTOUT" | tr '\n' ' ')"
  else
    bad "LUU-KHO-CT2: de doan cua moc len ban sao ma lane_check VAN xanh — chieu do khong song (thay: ${MUTOUT:-rong})"
  fi
fi
rm -f "$TAGSKILL" "$TAGSEC" "$MUTSKILL"

echo "== E6 · đối chứng GIỮ-GÂN =="
KEEP=(scripts/design-gate.mjs scripts/design-scan.js scripts/build-design-scan.mjs
      lib/design-detect.mjs lib/p-tiers.json vendor/impeccable tests/design-eval
      tests/skills skills/design-pass)
hash_head() { ( cd "$ROOT" && git ls-files -s -- "$1" | awk '{print $2, $4}' | sort ) ; }
hash_tag()  { g ls-tree -r "$TAG" -- "$1" | awk '{print $3, $4}' | sort ; }
k=0
for kp in "${KEEP[@]}"; do
  if [ "$(hash_head "$kp")" = "$(hash_tag "$kp")" ] && [ -n "$(hash_head "$kp")" ]; then
    echo "  OK   LUU-KHO-GIU: $kp con nguyen (byte-equal moc) OK"
    k=$((k + 1))
  else
    bad "LUU-KHO-GIU: $kp LECH tag"
  fi
done
echo "LUU-KHO-GIU: $k/${#KEEP[@]}"
[ "$k" -eq "${#KEEP[@]}" ] || bad "LUU-KHO-GIU: $k/${#KEEP[@]} vật giữ nguyên"
# ux-ui-craft: NGOẠI LỆ khai trước — đúng MỘT file được đổi
UXDIFF="$(g diff --name-only "$TAG" -- skills/ux-ui-craft | sort)"
if [ "$UXDIFF" = "skills/ux-ui-craft/references/layout-craft.md" ]; then
  if grep -q 'design-gate' "$ROOT/skills/ux-ui-craft/references/layout-craft.md" \
     && ! grep -q 'design-static-check' "$ROOT/skills/ux-ui-craft/references/layout-craft.md"; then
    ok "LUU-KHO-GIU: ux-ui-craft 1 file doi co khai, con lai byte-equal OK"
  else
    bad "LUU-KHO-GIU: layout-craft.md chua tro design-gate hoac con tro design-static-check"
  fi
else
  bad "LUU-KHO-GIU: ux-ui-craft doi khac khai (thay: $(echo "$UXDIFF" | tr '\n' ' '))"
fi
# chiều đỏ: xoá một dòng trong bản sao lib/design-detect.mjs
MD="$(mktemp -d)"; mkdir -p "$MD/lib"
sed '2d' "$ROOT/lib/design-detect.mjs" > "$MD/lib/design-detect.mjs"
if [ "$(git hash-object "$MD/lib/design-detect.mjs")" != "$(hash_tag lib/design-detect.mjs | awk '{print $1}')" ]; then
  mut "xoá 1 dòng trong bản sao lib/design-detect.mjs → băm LỆCH mốc đúng như mong đợi"
else
  bad "LUU-KHO-GIU: chieu do khong chay — ban sao bi sua ma bam van khop"
fi
rm -rf "$MD"

echo "== E8/E9 · ADR =="
ADR_NEW=(docs/adr/0008-luu-kho-harness-codex.md docs/adr/0009-khai-tu-nghi-le-design-loop.md)
adr_check() {   # $1 = tệp ADR → in mã lỗi, rỗng = XANH
  [ -f "$1" ] || { echo "thieu-tep"; return 0; }
  grep -q "$TAG_SHA" "$1" || echo "sha-khong-khop-moc"
  grep -qi 'trigger mở lại\|Trigger mở lại\|TRIGGER' "$1" || echo "thieu-dong-trigger"
  return 0
}
a=0
for adr in "${ADR_NEW[@]}"; do
  AOUT="$(adr_check "$ROOT/$adr")"
  if [ -z "$AOUT" ]; then
    echo "  OK   LUU-KHO-ADR: $adr ghim sha $TAG_SHA = tag OK"
    a=$((a + 1))
  else
    bad "LUU-KHO-ADR: $adr — $(printf '%s' "$AOUT" | tr '\n' ' ')"
  fi
done
[ "$a" -eq 2 ] && ok "LUU-KHO-ADR: 2 ADR moi OK" || bad "LUU-KHO-ADR: chi $a/2 ADR dat"
# chiều đỏ CHẠY THẬT: đổi một ký tự của sha trong bản sao rồi chạy lại CHÍNH
# `adr_check` trên bản sao đó — không phải một câu grep viết lại lần thứ hai.
MA="$(mktemp)"; sed "s/$TAG_SHA/${TAG_SHA%?}0/" "$ROOT/${ADR_NEW[0]}" > "$MA"
MAOUT="$(adr_check "$MA")"
if printf '%s\n' "$MAOUT" | grep -q 'sha-khong-khop-moc'; then
  mut "đổi 1 ký tự sha trong bản sao ADR → adr_check ĐỎ đúng mã: sha-khong-khop-moc"
else
  bad "LUU-KHO-ADR: chieu do khong chay — sha bi doi ma adr_check van xanh (thay: ${MAOUT:-rong})"
fi
rm -f "$MA"
A1="$ROOT/docs/adr/0001-commit-plugins-mirror.md"
e9=0
[ -f "$A1" ]                        || { bad "LUU-KHO-ADR0001: bi xoa — su lieu phai giu"; e9=1; }
grep -qi 'superseded' "$A1"         || { bad "LUU-KHO-ADR0001: thieu dau superseded"; e9=1; }
grep -q '0008' "$A1"                || { bad "LUU-KHO-ADR0001: khong tro ADR luu-kho-Codex"; e9=1; }
[ "$e9" -eq 0 ] && ok "LUU-KHO-ADR0001: superseded + tro ADR moi OK"

echo "== E10 · bộ máy mirror =="
m=0
# Chân này phải đo HAI ĐẦU và NÓI ĐÚNG cả hai. Bản trước chỉ soi HEAD nhưng in
# «vắng ở HEAD, CÓ Ở TAG OK» — thông điệp xanh nói dối: đổi một needle sang chuỗi
# chưa từng tồn tại thì 5/5 vẫn xanh và người đọc log tin đối chứng dương đã
# chạy. Với phép đo ÂM, vế «có ở mốc» là chân DUY NHẤT phân biệt "đã gỡ" với
# "phép đo chưa bao giờ khớp gì".
TAGCFG="$(mktemp)"; g show "$TAG:_acceptance/config.yaml" > "$TAGCFG" 2>/dev/null
TAGSUITE="$(mktemp)"; g show "$TAG:tests/plugins/run-tests.sh" > "$TAGSUITE" 2>/dev/null
# Đọc KHOÁ THẬT, không grep chuỗi: config còn một chú thích giải thích vì sao
# khoá này chết, và grep chuỗi coi chú thích là khoá — đúng lớp "grep mù với
# comment" mà chính đề bài của eval này cảnh báo. Một hàm dùng cho CẢ HEAD, mốc,
# và bản sao bị tiêm — ba đầu không được đọc bằng ba câu khác nhau.
has_mirror_key() {   # $1 = tệp config → rc 0 nếu khoá mirror_sync SỐNG
  node -e '
    const fs = require("fs");
    const lines = fs.readFileSync(process.argv[1], "utf8").split("\n");
    const hit = lines.some(l => /^\s*mirror_sync\s*:/.test(l) && !l.trim().startsWith("#"));
    process.exit(hit ? 0 : 1);
  ' "$1"
}
mirror_gone() {   # $1 nhãn, $2 biểu thức kiểm HEAD (đúng = CÒN), $3 biểu thức kiểm MỐC (đúng = CÓ)
  if eval "$2"; then
    bad "LUU-KHO-MIRROR: $1 van con o HEAD"
  elif ! eval "$3"; then
    bad "LUU-KHO-MIRROR: $1 KHONG co o moc — doi chung duong hong, chan nay khong song"
  else
    echo "  OK   LUU-KHO-MIRROR: $1 vang o HEAD, co o tag OK"; m=$((m + 1))
  fi
}
mirror_gone "plugins/" \
  '[ -e "$ROOT/plugins" ]' \
  'g ls-tree -d --name-only "$TAG" -- plugins | grep -q .'
mirror_gone "scripts/sync-plugin-packages.sh" \
  '[ -e "$ROOT/scripts/sync-plugin-packages.sh" ]' \
  'g ls-tree --name-only "$TAG" -- scripts/sync-plugin-packages.sh | grep -q .'
mirror_gone "case P30" \
  'grep -q "P30 plugins/ mirror" "$ROOT/tests/plugins/run-tests.sh"' \
  'grep -q "P30 plugins/ mirror" "$TAGSUITE"'
mirror_gone "khoa executors.script.mirror_sync" \
  'has_mirror_key "$ROOT/_acceptance/config.yaml"' \
  'has_mirror_key "$TAGCFG"'
mirror_gone "muc plugins/** trong t1_skip_globs" \
  'grep -q "plugins/\*\*" "$ROOT/_acceptance/config.yaml"' \
  'grep -q "plugins/\*\*" "$TAGCFG"'
echo "LUU-KHO-MIRROR: $m/5"
[ "$m" -eq 5 ] || bad "LUU-KHO-MIRROR: $m/5 vật đã gỡ"
rm -f "$TAGCFG" "$TAGSUITE"
# Chân QUAN HỆ: không suite_key nào trỏ khoá đã chết (lớp gỡ-một-nửa)
DEAD="$(node -e '
  const fs = require("fs");
  const t = fs.readFileSync(process.argv[1], "utf8").split("\n");
  const keys = new Set(), refs = [];
  let inSuite = false, path = [];
  for (const raw of t) {
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    const ind = raw.length - raw.trimStart().length, line = raw.trim();
    if (line.startsWith("- executors.")) { if (inSuite) refs.push(line.slice(2)); continue; }
    if (line.startsWith("-")) continue;
    inSuite = line.startsWith("suite_keys:");
    const key = line.split(":")[0];
    path = path.slice(0, ind / 2); path[ind / 2] = key;
    keys.add(path.slice(0, ind / 2 + 1).join("."));
  }
  process.stdout.write(refs.filter(r => !keys.has(r)).join(","));
' "$ROOT/_acceptance/config.yaml")"
[ -z "$DEAD" ] \
  && ok "LUU-KHO-MIRROR: suite_keys khong tro khoa da chet OK" \
  || bad "LUU-KHO-MIRROR: suite_keys tro khoa da chet: $DEAD"
# CHIỀU ĐỎ CHẠY THẬT: cho bản sao đi qua CHÍNH `has_mirror_key`. Bản trước
# `grep -q mirror_sync` trên chuỗi vừa tự ghi ra — mà chuỗi ấy ĐÃ có sẵn trong
# một dòng chú thích của config, nên bỏ hẳn bước tiêm thì grep vẫn TRUE: chiều
# đỏ hằng-đúng, và trình đọc khoá thật chưa bao giờ chạy trên bản sao nào. Đối
# chứng dương đi kèm: bản sao CHƯA tiêm phải cho trình đọc trả ÂM.
MC="$(mktemp)"; cp "$ROOT/_acceptance/config.yaml" "$MC"
if has_mirror_key "$MC"; then
  bad "LUU-KHO-MIRROR: ban sao CHUA tiem da co khoa song — doi chung duong hong, chieu do vo nghia"
else
  printf '    mirror_sync: "bash scripts/sync-plugin-packages.sh --check"\n' >> "$MC"
  if has_mirror_key "$MC"; then
    mut "chép khoá mirror_sync vào bản sao config → CHÍNH trình đọc khoá thấy nó, chân trên ĐỎ"
  else
    bad "LUU-KHO-MIRROR: chieu do khong chay — ban sao co khoa ma trinh doc khong thay"
  fi
fi
rm -f "$MC"

echo "== E10b · CLAUDE.md =="
cm_hits() { grep -c 'sync-plugin-packages\|build mirror' "$1" || true; }
TAGCM="$(mktemp)"; g show "$TAG:CLAUDE.md" > "$TAGCM" 2>/dev/null
CM_HEAD="$(cm_hits "$ROOT/CLAUDE.md")"
CM_TAG="$(cm_hits "$TAGCM")"
if [ "$CM_HEAD" -eq 0 ] && [ "$CM_TAG" -gt 0 ]; then
  ok "LUU-KHO-MIRROR: CLAUDE.md khong con bat bien mirror OK (tag=$CM_TAG)"
else
  bad "LUU-KHO-MIRROR: CLAUDE.md HEAD=$CM_HEAD tag=$CM_TAG"
fi
# chiều đỏ CHẠY THẬT: chép ĐÚNG các dòng bất biến của mốc (không gõ tay câu mới)
# vào bản sao CLAUDE.md rồi chạy lại chính `cm_hits`.
MCM="$(mktemp)"; cp "$ROOT/CLAUDE.md" "$MCM"
if [ "$(cm_hits "$MCM")" -ne 0 ]; then
  bad "LUU-KHO-MIRROR: ban sao CLAUDE.md chua tiem da co hit — doi chung duong hong"
else
  grep 'sync-plugin-packages\|build mirror' "$TAGCM" >> "$MCM" || true
  if [ "$(cm_hits "$MCM")" -gt 0 ]; then
    mut "chép $CM_TAG dòng bất biến mirror của mốc vào bản sao CLAUDE.md → chân trên ĐỎ"
  else
    bad "LUU-KHO-MIRROR: chieu do khong chay — ban sao co dong bat bien ma phep dem van 0"
  fi
fi
rm -f "$TAGCM" "$MCM"

echo "== E11b · start-scan CHẠY THẬT =="
start_scan_check() {   # $1 = script cần chạy → rc 0 = XANH; in chẩn đoán khi ĐỎ
  local out rc
  out="$(cd "$ROOT" && node "$1" --root . 2>&1)"; rc=$?
  if [ "$rc" -eq 0 ] \
     && printf '%s' "$out" | grep -q '"schema_version"' \
     && ! printf '%s' "$out" | grep -q 'ENOENT'; then
    return 0
  fi
  printf 'rc=%s out=%s' "$rc" "$(printf '%s' "$out" | head -c 200)"
  return 1
}
if SSMSG="$(start_scan_check "$ROOT/scripts/start-scan.mjs")"; then
  ok "LUU-KHO-START-SCAN: chay sach OK"
else
  bad "LUU-KHO-START-SCAN: $SSMSG"
fi
# chiều đỏ CHẠY THẬT: dựng bản sao script có tiêm lại MỘT lượt đọc `.agents/`
# không bọc `existsSync` — đúng kịch bản «nhánh đọc Codex gỡ nửa chừng» mà E11b
# sinh ra để bắt — rồi chạy lại CHÍNH `start_scan_check` trên bản sao đó.
SSDIR="$(mktemp -d)"; mkdir -p "$SSDIR/scripts"
cp -R "$ROOT/lib" "$SSDIR/lib"
awk '{ print }
     /^const __dirname = /{ print "readFileSync(path.join(__dirname, \"..\", \".agents\", \"plugins\", \"marketplace.json\"), \"utf8\");" }' \
    "$ROOT/scripts/start-scan.mjs" > "$SSDIR/scripts/start-scan.mut.mjs"
if ! grep -q '\.agents' "$SSDIR/scripts/start-scan.mut.mjs"; then
  bad "LUU-KHO-START-SCAN: buoc tiem KHONG chen duoc dong doc .agents — chieu do khong chay"
elif start_scan_check "$SSDIR/scripts/start-scan.mut.mjs" >/dev/null; then
  bad "LUU-KHO-START-SCAN: ban sao co luot doc .agents/ ma van XANH — chan nay khong bat duoc go-nua-chung"
else
  mut "tiêm lại một lượt đọc .agents/plugins/marketplace.json vào bản sao → start_scan_check ĐỎ"
fi
rm -rf "$SSDIR"

echo "== E15 · bộ kiểm không có khối thoát-sớm giữa tệp =="
# Một bản sao của khối tổng kết đuôi nằm lạc ở giữa tệp từng nuốt 46 ca cuối mỗi
# khi có ca đỏ phía trước, mà dòng tổng kết in ra vẫn trông bình thường.
LAST_EXIT="$(grep -n '^  exit 1$' "$ROOT/tests/plugins/run-tests.sh" | tail -1 | cut -d: -f1)"
TOTAL_LINES="$(wc -l < "$ROOT/tests/plugins/run-tests.sh")"
N_EXIT="$(grep -c '^  exit 1$' "$ROOT/tests/plugins/run-tests.sh" || true)"
if [ "$N_EXIT" -eq 1 ] && [ "$((TOTAL_LINES - LAST_EXIT))" -lt 10 ]; then
  ok "LUU-KHO-SUITE: chi 1 khoi thoat, nam o duoi tep OK"
else
  bad "LUU-KHO-SUITE: co $N_EXIT khoi thoat, cai cuoi o dong $LAST_EXIT/$TOTAL_LINES — khoi giua tep nuot ca"
fi

echo "== E16 · bump phiên bản + đường phát hành =="
# Sổ nhớ của kho ghi đúng lớp lỗi này: LỆNH CẬP NHẬT BỎ QUA KHI SỐ TRÙNG MÀ NỘI
# DUNG ĐỔI. Hồ sơ này gỡ ~194 tệp và một gói biến khỏi marketplace; giữ nguyên
# số phiên bản là để đội cập nhật im lặng trượt qua đúng đợt đổi lớn nhất.
# So với MỐC (không ghim số cứng): số phải LỚN HƠN, và phải lớn hơn ở nấc minor
# trở lên — patch bump cho một đợt gỡ 194 tệp là nói dối bằng số.
ver_of()  { node -e 'process.stdout.write(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).version)' "$1"; }
ver_tag() { g show "$TAG:$1" | node -e '
  let s = ""; process.stdin.on("data", d => s += d).on("end", () => process.stdout.write(JSON.parse(s).version));'; }
# MỘT hàm so, dùng cho cả bản thật lẫn bản sao của chiều đỏ — hai bên so bằng
# hai câu khác nhau là cách chiều đỏ chứng minh một thứ mà lưới thật không làm.
bump_ok() {   # $1 = version HEAD, $2 = version mốc → in mã lỗi, rỗng = ĐẠT
  local h="$1" t="$2" mh mt
  { [ -n "$h" ] && [ -n "$t" ]; } || { echo "doc-khong-ra-version"; return 0; }
  mh="${h%.*}"; mt="${t%.*}"
  if [ "$mh" = "$mt" ]; then echo "chua-bump-minor"
  elif [ "$(printf '%s\n%s\n' "$mt" "$mh" | sort -V | tail -1)" != "$mh" ]; then echo "tut-so"
  fi
  return 0
}
b=0
for mf in .claude-plugin/plugin.json feature-loop/.claude-plugin/plugin.json; do
  VH="$(ver_of "$ROOT/$mf")"; VT="$(ver_tag "$mf")"
  BOUT="$(bump_ok "$VH" "$VT")"
  if [ -z "$BOUT" ]; then
    echo "  OK   LUU-KHO-BUMP: $mf $VT -> $VH (bump >= minor) OK"; b=$((b + 1))
  else
    bad "LUU-KHO-BUMP: $mf ($VT -> $VH) $BOUT — noi dung goi doi lon ma so khong doi thi lenh cap nhat BO QUA"
  fi
done
[ "$b" -eq 2 ] && ok "LUU-KHO-BUMP: 2/2 manifest da bump OK" || bad "LUU-KHO-BUMP: chi $b/2 manifest bump"
# Đường phát hành phải NÓI RA ở trang bằng chứng, không chỉ trong changelog:
# sau merge, `design-loop` biến khỏi marketplace nên bản đã cài trên máy đội
# treo lơ lửng và `claude plugin update` không gỡ hộ được.
if grep -q 'Đường phát hành' "$WS/evidence-report.md" \
   && grep -q 'design-loop' "$WS/evidence-report.md"; then
  ok "LUU-KHO-BUMP: trang bang chung co muc Duong phat hanh OK"
else
  bad "LUU-KHO-BUMP: trang bang chung THIEU muc Duong phat hanh (doi phai lam gi sau merge)"
fi
# chiều đỏ CHẠY THẬT: dựng bản sao manifest mang ĐÚNG số của mốc (tức "quên
# bump"), rồi cho nó đi qua CHÍNH `bump_ok`. Hai đột biến, hai mã lỗi khác nhau
# — gộp làm một thì "quên bump" và "tụt số" đọc y hệt nhau.
MB="$(mktemp)"; g show "$TAG:.claude-plugin/plugin.json" > "$MB"
VT0="$(ver_tag .claude-plugin/plugin.json)"
M1="$(bump_ok "$(ver_of "$MB")" "$VT0")"
M2="$(bump_ok "1.0.0" "$VT0")"
if [ "$M1" = "chua-bump-minor" ] && [ "$M2" = "tut-so" ]; then
  mut "bản sao mang đúng số của mốc → bump_ok ĐỎ 'chua-bump-minor'; bản hạ về 1.0.0 → ĐỎ 'tut-so'"
else
  bad "LUU-KHO-BUMP: chieu do khong chay — quen-bump cho '$M1' (mong chua-bump-minor), tut-so cho '$M2'"
fi
rm -f "$MB"

echo "== E12/E7/E13/E14 · đẳng thức số ca có chân MÁY (AC-11) =="
# Bốn eval của AC-11 hứa đỏ ghim "so ca lech ky vong: <truoc> -> <sau>". Rà soát
# vòng 1: chuỗi ấy không có trong bất kỳ mã nào — tức trụ cột chống gỡ-quá-tay
# của cả hồ sơ là phép đo DO NGƯỜI ĐẾM. `so-ca.sh` là chỗ lời hứa thành mã;
# chân dưới đây giữ cho nó (a) thật sự được WIRE vào làn, (b) còn SỐNG.
so_ca_run() { bash "$WS/so-ca.sh" "$@"; }
# (a) WIRE: bốn eval phải trỏ bốn khoá so-ca, và config phải định nghĩa chúng
#     TRỎ ĐÚNG BỘ ĐẾM. Script tồn tại mà không eval nào gọi thì nó là mã chết.
#     [SỬA SAU CỔNG 1 — 13/08, vòng sửa 2] Bản trước chỉ grep TÊN khoá, không
#     đọc GIÁ TRỊ (F5). Rà soát vòng 2 đổi giá trị khoá thành
#     `bash tests/plugins/run-tests.sh`: bộ đếm rời khỏi làn, đẳng thức số ca
#     biến mất — đúng kịch bản `so-ca.sh` sinh ra để chặn — mà chân này vẫn in
#     "4/4 dang thuc duoc wire OK". Nay nó đọc giá trị và đòi giá trị ấy vừa trỏ
#     `so-ca.sh` vừa mang đúng `--suite <s>`.
gia_tri_khoa() {   # $1 = tên khoá → in giá trị (đã bóc nháy), rỗng nếu không có
  awk -v k="$1:" '
    { line = $0; sub(/^[ \t]+/, "", line) }
    index(line, k) == 1 {
      v = substr(line, length(k) + 1)
      sub(/^[ \t]+/, "", v); sub(/[ \t]+$/, "", v)
      gsub(/^"|"$/, "", v); gsub(/^'"'"'|'"'"'$/, "", v)
      print v; exit
    }
  ' "$ROOT/_acceptance/config.yaml"
}
w=0
for s in plugins workflows scripts hooks; do
  kv="$(gia_tri_khoa "luu_kho_so_ca_$s")"
  if [ -z "$kv" ]; then
    bad "LUU-KHO-SUITE: dang thuc $s KHONG co khoa config luu_kho_so_ca_$s"
  elif ! printf '%s' "$kv" | grep -q 'so-ca\.sh'; then
    bad "LUU-KHO-SUITE: khoa luu_kho_so_ca_$s KHONG tro so-ca.sh (chay: $kv) — bo dem da roi khoi lan"
  elif ! printf '%s' "$kv" | grep -q -- "--suite $s"; then
    bad "LUU-KHO-SUITE: khoa luu_kho_so_ca_$s tro so-ca.sh nhung KHONG dung --suite $s (chay: $kv)"
  elif ! grep -q "config:executors.script.luu_kho_so_ca_$s" "$WS/evals.yaml"; then
    bad "LUU-KHO-SUITE: khoa luu_kho_so_ca_$s co dinh nghia nhung KHONG eval nao goi — ma chet"
  else
    w=$((w + 1))
  fi
done
[ "$w" -eq 4 ] && ok "LUU-KHO-SUITE: 4/4 dang thuc duoc wire vao lan OK (doc GIA TRI khoa, khong grep ten)"
# chiều đỏ CHẠY THẬT cho chính chân vừa siết: đổi giá trị khoá trong một bản sao
# config rồi cho đi qua CHÍNH `gia_tri_khoa` + cùng ba phép so.
MCFG="$(mktemp)"
sed 's|^\( *luu_kho_so_ca_plugins: \).*|\1"bash tests/plugins/run-tests.sh"|' \
  "$ROOT/_acceptance/config.yaml" > "$MCFG"
kv_mut="$(awk -v k="luu_kho_so_ca_plugins:" '
    { line = $0; sub(/^[ \t]+/, "", line) }
    index(line, k) == 1 { v = substr(line, length(k) + 1)
      sub(/^[ \t]+/, "", v); gsub(/^"|"$/, "", v); print v; exit }' "$MCFG")"
if [ -n "$kv_mut" ] && ! printf '%s' "$kv_mut" | grep -q 'so-ca\.sh'; then
  mut "đổi giá trị khoá luu_kho_so_ca_plugins sang chạy suite trần → phép so ĐỎ 'bo dem da roi khoi lan'"
else
  bad "LUU-KHO-SUITE: buoc tiem config KHONG doi duoc gia tri khoa (doc ra: ${kv_mut:-rong}) — chieu do khong chay"
fi
rm -f "$MCFG"
# (b) SỐNG: chạy thật hai suite RẺ qua chính bộ đếm, rồi lấy log CODE VỪA SINH
#     ra làm đầu vào cho chiều đỏ. Log do lần chạy này sinh, không phải fixture
#     viết tay đúng khuôn bên đọc.
SOCALOG="$(mktemp)"
# [SỬA SAU CỔNG 1 — 13/08, vòng sửa 2] Bản trước viết
# `if so_ca_run … | sed 's/^/  OK   /'; then` — trạng thái của một pipeline là
# trạng thái của lệnh CUỐI, tức của `sed`, tức LUÔN 0. Nhánh `bad` bên dưới là
# mã chết: rà soát vòng 2 (F2) tiêm `exit 7` vào `tests/hooks/run-tests.sh` và
# bộ răng in nguyên văn dòng chẩn đoán ĐỎ **dưới nhãn `OK`** rồi kết luận "tất
# cả phép đo xanh", RC=0. Đây CÙNG LỚP với `check "$(basename "$_f")" 0 $?` mà
# chính vòng sửa 1 vừa ghim thành AC-19 — lớp lỗi chữa ở một tệp rồi tái sinh ở
# tệp bên cạnh trong cùng một lượt.
# Luật: mã thoát mang phán quyết thì BẮT nó vào biến TRƯỚC, rồi mới trang trí.
SOCA_OUT="$(so_ca_run --suite hooks --keep-log "$SOCALOG" 2>&1)"; SOCA_RC=$?
printf '%s\n' "$SOCA_OUT" | sed "s/^/  $([ "$SOCA_RC" -eq 0 ] && echo 'OK  ' || echo 'ĐỎ  ') /"
if [ "$SOCA_RC" -eq 0 ]; then
  HOOK_LINES="$(grep -cE '^Results: [0-9]+ passed' "$SOCALOG" || true)"
  if [ "$HOOK_LINES" -eq 0 ]; then
    bad "LUU-KHO-SUITE: log vua sinh khong co dong Results — chieu do se do vao khoang khong"
  else
    MUTLOG="$(mktemp)"
    # Đột biến neo vào vật THẬT: hạ đúng con số trong dòng tổng kết vừa sinh.
    awk '/^Results: [0-9]+ passed/ { sub(/^Results: [0-9]+/, "Results: " ($2 - 1)) } { print }' \
      "$SOCALOG" > "$MUTLOG"
    if [ "$(grep -c . "$MUTLOG")" -ne "$(grep -c . "$SOCALOG")" ] \
       || ! grep -q '^Results: 53 passed' "$MUTLOG"; then
      bad "LUU-KHO-SUITE: buoc dot bien KHONG ha duoc so ca trong log — chieu do khong chay"
    else
      MUTOUT="$(so_ca_run --suite hooks --log "$MUTLOG" 2>&1)"; MUTRC=$?
      if [ "$MUTRC" -ne 0 ] && printf '%s' "$MUTOUT" | grep -q 'so ca lech ky vong: 54 -> 53'; then
        mut "hạ 1 ca trong log vừa sinh → bộ đếm ĐỎ ghim đúng thông điệp đã hứa"
      else
        bad "LUU-KHO-SUITE: ha 1 ca ma bo dem van XANH hoac khong ghim dung cau (rc=$MUTRC): $(printf '%s' "$MUTOUT" | head -c 160)"
      fi
    fi
    rm -f "$MUTLOG"
  fi
else
  bad "LUU-KHO-SUITE: so-ca.sh --suite hooks DO — xem dong tren"
fi
rm -f "$SOCALOG"
# chiều đỏ CHO CHÍNH CÁCH BẮT MÃ THOÁT (F2). Không đo bằng cách grep hình dạng
# câu lệnh — đó là đo CHỈ DẪN thay vì đo ĐẦU RA. Đo bằng cách cho `so-ca.sh`
# THẬT thoát khác 0 (suite không tồn tại → nó in "khong biet suite" và exit 1),
# rồi so hai cách đọc trên CÙNG một lượt chạy: cách cũ (qua pipeline) phải cho
# 0, cách mới phải cho đúng mã thật. Cách cũ còn cho 0 nghĩa là bug có thật;
# cách mới cho khác 0 nghĩa là bản vá thật sự bắt được nó.
BAD_OUT="$(so_ca_run --suite khong-he-ton-tai 2>&1)"; BAD_RC=$?
so_ca_run --suite khong-he-ton-tai 2>/dev/null | sed 's/^/x/' >/dev/null; OLD_RC=$?
if [ "$BAD_RC" -ne 0 ] && [ "$OLD_RC" -eq 0 ] \
   && printf '%s' "$BAD_OUT" | grep -q 'khong biet suite'; then
  mut "so-ca.sh thoát $BAD_RC → cách cũ (qua pipeline) đọc ra $OLD_RC tức NUỐT mã thoát; cách mới đọc đúng $BAD_RC"
elif [ "$BAD_RC" -eq 0 ]; then
  bad "LUU-KHO-SUITE: so-ca.sh voi suite khong ton tai van thoat 0 — khong dung duoc chieu do cho F2"
else
  bad "LUU-KHO-SUITE: chieu do F2 khong chay (moi=$BAD_RC cu=$OLD_RC)"
fi
# (c) Bản khai máy-đọc và câu chữ của AC-11 phải là MỘT. Số đọc TỪ khối (gõ lại
#     ở đây là dựng bản chép thứ ba, đúng lớp lỗi hai-bên-trôi-khỏi-nhau), rồi
#     đòi câu chữ của hợp đồng nêu đúng cặp đó.
KV="$(awk '
  index($0, "<!-- <<<SO-CA-KY-VONG -->") { f = 1; next }
  index($0, "<!-- SO-CA-KY-VONG>>> -->") { f = 0 }
  f && /^\|/ { gsub(/[ \t]/, "", $0); n = split($0, a, "|")
               if (n >= 4 && a[2] != "suite" && a[2] !~ /^-*$/) print a[2], a[3], a[4] }
' "$WS/contract.md")"
KVN="$(printf '%s' "$KV" | grep -c . || true)"
if [ "$KVN" -ne 4 ]; then
  bad "LUU-KHO-SUITE: khoi SO-CA-KY-VONG doc ra $KVN dong (mong 4) — ban khai hong"
else
  kv_ok=0
  while read -r s truoc sau; do
    if grep -qF "\`$s\` **$truoc → $sau**" "$WS/contract.md"; then
      kv_ok=$((kv_ok + 1))
    else
      bad "LUU-KHO-SUITE: khoi khai $s $truoc->$sau nhung cau chu AC-11 khong neu cap do"
    fi
  done <<EOF_KV
$KV
EOF_KV
  [ "$kv_ok" -eq 4 ] && ok "LUU-KHO-SUITE: 4/4 dong khai may-doc khop cau chu AC-11 OK"
fi

echo
if [ "$fails" -gt 0 ]; then
  echo "LUU-KHO-RANG: $fails phép đo ĐỎ"
  exit 1
fi
echo "LUU-KHO-RANG: tất cả phép đo xanh"
exit 0
