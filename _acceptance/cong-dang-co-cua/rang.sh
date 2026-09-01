#!/usr/bin/env bash
# Răng hồ sơ cong-dang-co-cua — BA chân, cho phạm vi ĐÃ THU.
#
# Bản 13 chân của làn thẻ Cổng Đáng đã trả về ô cùng làn (điều khoản dừng-vá
# 01/09) — lấy lại ở cây ghim, xem discovery/LAY-VE-LAN-THE.md.
#
# Ba chân này ghim ĐÚNG DÒNG CA trong lưới thường trực, không tin mã thoát của
# trọn suite (bài học P194: suite xanh ở cả hai đầu thì exit không phân biệt
# được «bắt đúng lỗi» với «chưa bao giờ chạy»).
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
[ "${1:-}" = "--chan" ] || { echo "dung: $0 --chan <ten>"; exit 2; }
CHAN="${2:-}"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
loi=0
ghim() { if [ "$2" = "0" ]; then echo "PASS: $1"; else echo "DO: $1${3:+ — $3}"; loi=1; fi; }
GC="$ROOT/scripts/gate-card.js"

# Chạy lưới MỘT lần, dùng chung cho mọi chân cần nó.
suite() { [ -f "$TMP/suite.out" ] || ( cd "$ROOT" && bash tests/scripts/run-tests.sh ) > "$TMP/suite.out" 2>&1; }
co_ca() { grep -qF "PASS: $1" "$TMP/suite.out"; }

case "$CHAN" in

# ───────────────────────────────────────────────── loi-thuat (AC-A + AC-B)
loi-thuat)
  suite
  # Hằng RÚT TỪ NGUỒN — đổi chữ ở bên viết mà ca vẫn xanh là thước đã chết.
  D="$(sed -n "s/^const MSG_O_DA_DONG[[:space:]]*=[[:space:]]*'\(.*\)';.*/\1/p" "$GC" | head -1)"
  H="$(sed -n "s/^const MSG_HO_SO_HONG[[:space:]]*=[[:space:]]*'\(.*\)';.*/\1/p" "$GC" | head -1)"
  [ -n "$D" ] && [ -n "$H" ] || { ghim "rut hai hang moi tu nguon" 1 "khong rut duoc"; exit 1; }
  ghim "rut duoc hai hang moi tu khoi marker" 0
  for ca in GD01 GD01-msg GD01-phanbiet GD02 GD02-msg GD03 GD03-msg GD03-ten-field; do
    co_ca "$ca" && ghim "luoi thuong truc co dong ca «$ca»" 0 || ghim "dong ca «$ca»" 1 "khong thay trong dau ra luoi"
  done
  # ĐỐI CHỨNG DƯƠNG cho chính phép grep: một ca CHẮC CHẮN có phải tìm thấy,
  # một chuỗi CHẮC CHẮN không có phải KHÔNG tìm thấy. Không có cặp này thì tám
  # dòng trên xanh cả khi suite.out rỗng hoặc grep luôn đúng.
  co_ca "GM06" && ghim "doi chung duong: ca cu GM06 van tim thay" 0 || ghim "doi chung duong GM06" 1 "luoi khong chay?"
  co_ca "CA-KHONG-BAO-GIO-TON-TAI" && ghim "doi chung am" 1 "grep tim thay ca khong ton tai — phep do luon dung" || ghim "doi chung am: ca bia KHONG tim thay" 0
  ;;

# ────────────────────────────────────────────────── gioi-han (lỗ còn mở)
gioi-han)
  suite
  # Ghim GIỚI HẠN ĐÃ KHAI, không ghim hành vi mong muốn: ô đang chờ Cổng Đáng
  # VẪN nhận lời thuật thiếu-hợp-đồng. Ca này để lỗ không vô hình khi người đọc
  # hồ sơ tưởng vòng đã đóng nó.
  for ca in GD04 GD04-msg GD05 GD05-gioi-han-da-khai; do
    co_ca "$ca" && ghim "luoi ghim gioi han: «$ca»" 0 || ghim "dong ca «$ca»" 1 "khong thay"
  done
  # Chạy THẬT, không chỉ đọc lưới: ô chờ Cổng Đáng phải thoát 2 và stdout rỗng
  W="$TMP/w"; mkdir -p "$W/_acceptance/cho"; printf 'schema_version: 1\n' > "$W/_acceptance/config.yaml"
  printf -- '---\nslug: cho\nstage: discovery\ndecision:\n---\n\n## Vấn đề & ai gặp\n\nx\n' > "$W/_acceptance/cho/opportunity.md"
  O="$(node "$GC" --root "$W" --slug cho 2>/dev/null)"; rc=$?
  { [ "$rc" = "2" ] && [ -z "$O" ]; } && ghim "chay that: o cho Cong Dang thoat 2, stdout RONG (khong con the ma)" 0 \
    || ghim "chay that o cho Cong Dang" 1 "exit=$rc, ${#O} byte"
  # Cờ ép cũng không mở được làn nào (làn đã trả về ô)
  O="$(node "$GC" --root "$W" --slug cho --gate 0 2>/dev/null)"; rc=$?
  { [ "$rc" != "0" ] && [ -z "$O" ]; } && ghim "co ep --gate 0 khong ve duoc gi" 0 || ghim "co ep --gate 0" 1 "exit=$rc, ${#O} byte"
  ;;

# ─────────────────────────────────────────────── dang-thuc-lop (AC-C)
dang-thuc-lop)
  # Chân round-trip của hồ sơ khong-ve-the-ma phải RÚT số ca từ marker, không
  # ghim hằng số. Chạy nó thật rồi ghim mã thoát + dòng tổng kết.
  ( cd "$ROOT" && bash _acceptance/khong-ve-the-ma/rang.sh --chan round-trip ) > "$TMP/rt.out" 2>&1
  rc=$?
  [ "$rc" = "0" ] && ghim "chan round-trip cua ho so da ky: XANH tro lai" 0 || ghim "chan round-trip" 1 "exit=$rc — $(tail -1 "$TMP/rt.out")"
  grep -qE '^--- chan round-trip: [0-9]+ pass, 0 fail ---$' "$TMP/rt.out" \
    && ghim "dong tong ket: 0 fail" 0 || ghim "dong tong ket" 1 "$(tail -1 "$TMP/rt.out")"
  # CHIỀU ĐỎ: ghim lại hằng số 3 trên bản sao TRỌN CÂY → phải ĐỎ.
  M="$TMP/m"
  if ! ( cd "$ROOT" && git diff --quiet HEAD -- _acceptance/khong-ve-the-ma/rang.sh scripts/gate-card.js ); then
    ghim "cay lam viec khop HEAD" 1 "con thay doi CHUA COMMIT o vat duoc do — ban sao se cham ban khac"
  else
    mkdir -p "$M"; ( cd "$ROOT" && git archive HEAD ) | tar -x -C "$M"
    b=$(shasum -a 256 < "$M/_acceptance/khong-ve-the-ma/rang.sh" | cut -d' ' -f1)
    perl -0pi -e 's/SOHANG="\$\(printf .%s\\n. "\$HANG" \| grep -c \.\)"/SOHANG=3/' "$M/_acceptance/khong-ve-the-ma/rang.sh"
    a=$(shasum -a 256 < "$M/_acceptance/khong-ve-the-ma/rang.sh" | cut -d' ' -f1)
    if [ "$b" = "$a" ]; then ghim "lenh tiem doi duoc vat" 1 "noi dung KHONG doi — neo tiem khong ton tai, chieu do VO NGHIA"
    else
      ( cd "$M" && bash _acceptance/khong-ve-the-ma/rang.sh --chan round-trip ) > "$TMP/mut.out" 2>&1
      mrc=$?
      [ "$mrc" != "0" ] && ghim "chieu do: ghim lai hang so 3 -> chan DO (exit $mrc)" 0 \
        || ghim "chieu do" 1 "ghim lai hang so ma van XANH — phep do khong doc ben viet"
    fi
  fi
  ;;

*) echo "chan khong biet: '$CHAN'"; exit 2 ;;
esac

echo "--- chan $CHAN: $( [ "$loi" = "0" ] && echo 'xanh' || echo 'CO DO' ) ---"
exit "$loi"
