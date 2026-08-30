#!/usr/bin/env bash
# rang-khuon.sh — KHUÔN RĂNG DÙNG CHUNG cho bộ răng của hồ sơ nghiệm thu.
# Vì sao tồn tại (hồ sơ khuon-rang-dung-chung, 30/08): 43 bộ răng tự chế phần
# móng, và 5 hình dạng «phép đo tự dối» tái phát hồ sơ này sang hồ sơ khác
# trong MỘT phiên — dặn-bằng-lời đã chứng minh vô hiệu, nên móng phải MÁY GIỮ.
#
# Cách dùng trong rang.sh của hồ sơ:
#   source "$KIT/scripts/rang-khuon.sh"
#   kr_init "$CHAN"
#   ... ok "..." / bad "..." ...; kr_git "$REPO" ...; kr_snapshot "$MUT" <vật>
#   kr_tiem_batdau F; <sửa F>; kr_tiem_xong F
#   kr_vi_phan <log-gốc> <log-tiêm>  # giống nhau ⇒ đỏ
#   done_chan
#
# BA CHỐT CỨNG (không có đường vòng):
#   1. Vi phân: bản tiêm phải KHÁC bản gốc trên cùng fixture — giống ⇒ đỏ.
#   2. Mọi đường hỏng hạ tầng gọi `bad` (tăng bộ đếm) — không in-chữ-trần.
#   3. Cửa đường rỗng: lệnh trên fixture từ chối chạy khi đường dẫn không
#      trỏ đúng một repo git (đường rỗng → git dùng CWD → đụng KHO THẬT).
#
# Danh sách hàm công khai — phép đo và bộ răng rút từ khối này, không gõ tay:
# <<<RANG-KHUON-API
#   kr_init ok bad done_chan kr_git kr_snapshot kr_tiem_batdau kr_tiem_xong kr_vi_phan
# RANG-KHUON-API>>>

KR_PASS=0; KR_FAIL=0; KR_CHAN=""; KR_TMP=""
# Gốc cây để chụp: mặc định suy từ vị trí file; KR_KIT_OVERRIDE cho phép bộ đo
# chạy BẢN SAO của khuôn (đặt ngoài kit) mà vẫn chụp đúng cây — không có nó,
# bản sao tự suy sai gốc và mọi ca trên bản sao đỏ vì HẠ TẦNG chứ không vì vật.
KR_KIT="${KR_KIT_OVERRIDE:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"

kr_init() {
  KR_CHAN="${1:?kr_init cần tên chân}"
  KR_PASS=0; KR_FAIL=0
  KR_TMP="$(mktemp -d)" || { echo "  DO: kr_init: không tạo được thư mục tạm"; exit 1; }
  trap 'rm -rf "$KR_TMP"' EXIT
}
ok()  { echo "  PASS: $1"; KR_PASS=$((KR_PASS+1)); }
bad() { echo "  DO: $1"; KR_FAIL=$((KR_FAIL+1)); }
done_chan() {
  echo "Results: chan ${KR_CHAN} $( [ "$KR_FAIL" -eq 0 ] && echo passed || echo FAILED ) (${KR_PASS} pass, ${KR_FAIL} fail)"
  [ "$KR_FAIL" -eq 0 ] || exit 1; exit 0
}

# Chốt 3 — cửa đường rỗng. `git -C ""` chạy trong CWD (kho thật): sự cố 29/08
# đã xoá mất remote origin của chính kit theo đúng đường này.
kr_git() {
  local repo="${1:-}"; shift 2>/dev/null || { bad "kr_git: thiếu tham số"; return 1; }
  [ -n "$repo" ] || { bad "kr_git: đường dẫn RỖNG — TỪ CHỐI chạy git (sẽ đụng kho thật)"; return 1; }
  [ -d "$repo/.git" ] || { bad "kr_git: không phải repo git: $repo"; return 1; }
  git -C "$repo" "$@"
}

# Chốt 2 — chụp cây làm việc để tiêm. Mọi đường hỏng ⇒ bad. Chép TRỌN cây
# (trừ rác nặng), không danh sách thư mục tay (lớp P150).
kr_snapshot() {
  local dest="${1:?kr_snapshot cần đích}" vat="${2:?kr_snapshot cần đường-vật-kiểm}"
  mkdir -p "$dest" || { bad "kr_snapshot: không tạo được đích $dest"; return 1; }
  ( cd "$KR_KIT" && tar -cf - --exclude=.git --exclude=node_modules --exclude=.claude . ) | ( cd "$dest" && tar -xf - ) \
    || { bad "kr_snapshot: chép cây thất bại"; return 1; }
  [ -e "$dest/$vat" ] || { bad "kr_snapshot: bản sao thiếu vật được đo: $vat"; return 1; }
}

# Chốt «tiêm phải tác dụng»: băm trước/sau — file không đổi ⇒ mutant không
# tác dụng ⇒ đỏ (bước tiêm nổ hoặc chuỗi thay không khớp đều lộ ở đây).
kr_tiem_batdau() {
  local f="${1:?kr_tiem_batdau cần file}"
  [ -f "$f" ] || { bad "kr_tiem_batdau: file không tồn tại: $f"; return 1; }
  KR_TIEM_HASH="$(shasum -a 256 "$f" | cut -d' ' -f1)"
}
kr_tiem_xong() {
  local f="${1:?kr_tiem_xong cần file}"
  [ -f "$f" ] || { bad "kr_tiem_xong: file biến mất sau tiêm: $f"; return 1; }
  [ -n "${KR_TIEM_HASH:-}" ] || { bad "kr_tiem_xong: chưa gọi kr_tiem_batdau"; return 1; }
  local sau; sau="$(shasum -a 256 "$f" | cut -d' ' -f1)"
  [ "$sau" != "$KR_TIEM_HASH" ] || { bad "kr_tiem_xong: mutant KHÔNG tác dụng — file không đổi: $f"; return 1; }
  KR_TIEM_HASH=""
}

# Chốt 1 — VI PHÂN: hai file log (mã thoát ghi ở dòng đầu dạng `exit:<n>`, phần
# còn lại là đuôi đầu ra) của CÙNG một lệnh chạy trên bản gốc và bản tiêm.
# GIỐNG NHAU ⇒ đỏ «ca không phân biệt được hai bản». Caller vẫn phải tự ghim
# nội dung bản tiêm — vi phân là SÀN, không thay thế ghim thông điệp.
kr_vi_phan() {
  local goc="${1:?kr_vi_phan cần log bản gốc}" tiem="${2:?kr_vi_phan cần log bản tiêm}"
  [ -f "$goc" ] || { bad "kr_vi_phan: thiếu log bản gốc: $goc"; return 1; }
  [ -f "$tiem" ] || { bad "kr_vi_phan: thiếu log bản tiêm: $tiem"; return 1; }
  if cmp -s "$goc" "$tiem"; then
    bad "kr_vi_phan: ca KHÔNG phân biệt được hai bản — bản tiêm cho kết quả y hệt bản gốc"; return 1
  fi
  return 0
}
