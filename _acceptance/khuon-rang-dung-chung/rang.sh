#!/usr/bin/env bash
# Răng hồ sơ khuon-rang-dung-chung — DÙNG CHÍNH KHUÔN nó giao (tự-host đúng nghĩa).
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT="$(cd "$HERE/../.." && pwd)"
source "$KIT/scripts/rang-khuon.sh"
NCKT="$KIT/_acceptance/nhanh-chinh-khong-ten-main/rang.sh"
BASE_KRDC="5cd3bc68"   # mốc bất biến — bản rang.sh TRƯỚC viết-lại (contract Notes)

CHAN="${2:-}"
[ "${1:-}" = "--chan" ] || { echo "usage: rang.sh --chan <tich-hop|carry-ma-thuc-thi>"; exit 2; }
kr_init "$CHAN"
TMP="$KR_TMP"

case "$CHAN" in

tich-hop)
  # AC-5: bộ răng thật đã viết lại theo khuôn — xanh VÀ chiều đỏ còn nguyên lực.
  # (1) tập ĐÓNG ca chiều-đỏ cũ rút từ mốc bất biến BASE-KRDC
  git -C "$KIT" show "$BASE_KRDC:_acceptance/nhanh-chinh-khong-ten-main/rang.sh" > "$TMP/rang-cu.sh" \
    || { bad "không rút được bản rang.sh tại mốc $BASE_KRDC"; done_chan; }
  CA_CU="$(grep -o 'ok "chiều đỏ[^"]*"' "$TMP/rang-cu.sh" | sort -u)"
  N_CU="$(printf '%s\n' "$CA_CU" | grep -c .)"
  # Sàn ≥3 chỉ chống rút-rỗng (grep hỏng); bất biến THẬT là phép tập-con ở (3).
  # Mốc BASE-KRDC có đúng 4 ca chiều-đỏ phân biệt — không ghim hằng 4 kẻo thước
  # chết khi mốc được thay ở vòng sau (lớp hằng-đếm-theo-mốc).
  [ "$N_CU" -ge 3 ] && ok "tập ca chiều-đỏ cũ rút từ mốc: $N_CU ca (đóng)" \
    || bad "rút tập ca cũ hụt bất thường: $N_CU (nghi grep hỏng)"
  # (2) chạy TRỌN các chân của bộ răng mới, gom đầu ra
  ALL="$TMP/all.log"; : > "$ALL"
  for c in master-khong-remote nhanh-la-cau-huong-dan remote-tra-loi doc-bat-buoc-van-dong ci-single-branch khong-doan-sang-ten-khac; do
    if bash "$NCKT" --chan "$c" >>"$ALL" 2>&1; then ok "chân $c passed trên khuôn"; else bad "chân $c FAILED: $(tail -2 "$ALL" | tr '\n' ' ')"; fi
  done
  # (3) MỌI ca chiều-đỏ cũ phải có dòng PASS tương ứng ở đầu ra bản mới (tập-con)
  MISS=0
  while IFS= read -r ca; do
    [ -n "$ca" ] || continue
    NEEDLE="${ca#ok \"}"; NEEDLE="${NEEDLE%\"}"
    grep -qF "PASS: $NEEDLE" "$ALL" || { bad "ca chiều-đỏ cũ MẤT sau viết-lại: $NEEDLE"; MISS=$((MISS+1)); }
  done <<< "$CA_CU"
  [ "$MISS" -eq 0 ] && ok "chiều đỏ còn nguyên lực: đủ $N_CU/$N_CU ca cũ PASS ở bản mới"
  # (4) đảo mặc định API: mọi lời gọi hàm móng kr_* trong rang.sh mới THUỘC danh sách marker
  API="$(sed -n '/<<<RANG-KHUON-API/,/RANG-KHUON-API>>>/p' "$KIT/scripts/rang-khuon.sh" | tr -d '#' | tr -s ' \n' ' ')"
  BAD_CALL=0
  for fn in $(grep -o 'kr_[a-z_]*' "$NCKT" | sort -u); do
    case " $API " in *" $fn "*) : ;; *) [ "$fn" = "kr_" ] || { bad "rang.sh gọi hàm móng ngoài danh sách API: $fn"; BAD_CALL=1; } ;; esac
  done
  [ "$BAD_CALL" -eq 0 ] && ok "mọi lời gọi kr_* thuộc danh sách RANG-KHUON-API"
  # (5) móng riêng đã vắng: không còn định nghĩa ok()/bad()/hàm đếm cục bộ
  grep -qE '^(ok|bad|done_chan)\(\)' "$NCKT" && bad "rang.sh mới còn định nghĩa móng riêng" \
    || ok "móng riêng đã vắng — nạp trọn từ khuôn"
  # chiều đỏ của (4): bản sao thêm hàm đếm lạ → phải bị bắt
  cp "$NCKT" "$TMP/nckt-mut.sh"
  kr_tiem_batdau "$TMP/nckt-mut.sh"
  printf '\nkr_dem_la() { echo x; }\nkr_dem_la >/dev/null\n' >> "$TMP/nckt-mut.sh"
  kr_tiem_xong "$TMP/nckt-mut.sh"
  MUT_BAD=0
  for fn in $(grep -o 'kr_[a-z_]*' "$TMP/nckt-mut.sh" | sort -u); do
    case " $API " in *" $fn "*) : ;; *) [ "$fn" = "kr_" ] || MUT_BAD=1 ;; esac
  done
  [ "$MUT_BAD" -eq 1 ] && ok "chiều đỏ: hàm móng lạ trong bản sao BỊ BẮT bởi phép đảo mặc định" \
    || bad "chiều đỏ hỏng: hàm lạ không bị bắt"
  done_chan ;;

carry-ma-thuc-thi)
  # AC-7 (đảo mặc định): trong thư mục hồ sơ chỉ LOẠI đuôi giấy; .sh/.cjs/đuôi lạ GIỮ.
  D="$TMP/repo"; mkdir -p "$D/_acceptance/demo"
  git -C "$D" init -q -b main; git -C "$D" config user.email t@t.t; git -C "$D" config user.name T
  printf 'schema_version: 1\nexecutors:\n  test:\n    api: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.test.api\n' > "$D/_acceptance/config.yaml"
  printf -- '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n' > "$D/_acceptance/demo/contract.md"
  printf 'schema_version: 1\nfeature_slug: demo\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.api\n    expected: x\n    paths: ["_acceptance/demo/rang.sh", "_acceptance/demo/helper.cjs"]\n' > "$D/_acceptance/demo/evals.yaml"
  echo '#!/bin/bash' > "$D/_acceptance/demo/rang.sh"; echo 'x' > "$D/_acceptance/demo/helper.cjs"
  # run-log round 1 với sha anchor + eval xanh (để carry có nguồn)
  git -C "$D" add -A; git -C "$D" commit -qm r1
  A="$(git -C "$D" rev-parse HEAD)"
  printf '{"ts":"2026-08-30T00:00:00Z","sha":"%s","round":1,"evalId":"E1","run_id":"minted-demo-E1-r1","exit_code":0,"cmd":"echo x"}\n' "$A" > "$D/_acceptance/demo/run-log.jsonl"
  printf -- '---\nschema_version: 2\nverdict: PASS\n---\n\n## Iterations\n\nRound 1: x\n' > "$D/_acceptance/demo/evidence-report.md"
  git -C "$D" add -A; git -C "$D" commit -qm log
  chay() { rm -f "$TMP/a.json"; node "$1" --slug demo --root "$D" --ag-root "$KIT" --carry-anchor "$A" --out "$TMP/a.json" >"$TMP/co.txt" 2>&1; }
  carried() { node -e "const a=require('$TMP/a.json'); process.stdout.write(String(((a.carriedEvals)||[]).length))"; }
  # (a) chạm rang.sh → KHÔNG carry
  echo 'doi1' >> "$D/_acceptance/demo/rang.sh"; git -C "$D" add -A; git -C "$D" commit -qm sh
  chay "$KIT/feature-loop/scripts/s4-args.mjs" && [ "$(carried)" = "0" ] && ok "(a) chạm rang.sh → KHÔNG carry" || bad "(a) carry oan hoặc lỗi: $(carried 2>/dev/null; tail -1 "$TMP/co.txt")"
  # (b) chạm helper.cjs (đuôi thứ ba) → KHÔNG carry
  echo 'doi2' >> "$D/_acceptance/demo/helper.cjs"; git -C "$D" add -A; git -C "$D" commit -qm cjs
  chay "$KIT/feature-loop/scripts/s4-args.mjs" && [ "$(carried)" = "0" ] && ok "(b) chạm helper.cjs → KHÔNG carry (đảo mặc định, không danh-sách-trắng)" || bad "(b) carry oan: $(carried 2>/dev/null)"
  # (c) chỉ chạm giấy → CARRY như cũ
  echo 'ghi chu' >> "$D/_acceptance/demo/contract.md"; git -C "$D" add -A; git -C "$D" commit -qm md
  A="$(git -C "$D" rev-parse HEAD~1)"  # anchor sau (b), delta = chỉ contract.md
  chay "$KIT/feature-loop/scripts/s4-args.mjs" && [ "$(carried)" = "1" ] && ok "(c) chỉ chạm giấy → carry như cũ" || bad "(c) không carry dù chỉ sửa giấy: $(carried 2>/dev/null; tail -1 "$TMP/co.txt")"
  # chiều đỏ: bản sao khôi phục phép loại trọn _acceptance/** → ô (a) carry oan
  MUT="$TMP/mut"; kr_snapshot "$MUT" "feature-loop/scripts/s4-args.mjs" || done_chan
  kr_tiem_batdau "$MUT/feature-loop/scripts/s4-args.mjs"
  python3 - "$MUT/feature-loop/scripts/s4-args.mjs" <<'PYX'
import sys,re
p=sys.argv[1]; s=open(p,encoding='utf-8').read()
m=re.sub(r"\.filter\(f => f && !\(f\.startsWith\('_acceptance/'\) && laGiay\(f\)\)\);",".filter(f => f && !f.startsWith('_acceptance/'));",s)
assert m!=s
open(p,'w',encoding='utf-8').write(m)
PYX
  kr_tiem_xong "$MUT/feature-loop/scripts/s4-args.mjs"
  A="$(git -C "$D" log --format='%H %s' | awk '$2=="log"{print $1}')"
  # Bản tiêm PHẢI CHẠY ĐƯỢC rồi mới được đọc kết quả — mutant nổ (a.json vắng,
  # carried in rỗng) mà vẫn kết luận «bắt được» là đúng lớp âm-tính-một-mình.
  if chay "$MUT/feature-loop/scripts/s4-args.mjs" && [ -f "$TMP/a.json" ]; then
    [ "$(carried)" != "0" ] && ok "chiều đỏ: bản khôi-phục-loại-trọn CARRY OAN eval dù bộ đo đã đổi (ca phân biệt được)" \
      || bad "chiều đỏ hỏng: bản tiêm cũng không carry — không phân biệt được hai bản"
  else
    bad "chiều đỏ hỏng: bản tiêm KHÔNG CHẠY ĐƯỢC (hạ tầng nổ ≠ bắt lỗi): $(tail -1 "$TMP/co.txt" 2>/dev/null)"
  fi
  done_chan ;;

*)
  echo "rang.sh --chan <tich-hop|carry-ma-thuc-thi>"; exit 2 ;;
esac
