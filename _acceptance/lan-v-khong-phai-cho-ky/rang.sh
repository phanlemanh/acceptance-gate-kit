#!/usr/bin/env bash
# Răng hồ sơ lan-v-khong-phai-cho-ky (vòng ba, T2, một vật: máy quét vào phiên).
# Bốn chân, mỗi chân in CHIỀU ĐỎ trong cùng lượt, mỗi chiều đỏ MỘT câu riêng —
# không phép so hai-vế (vòng một có một vế đỏ là mã chết vì `A|B`).
#   · cases    — chạy thẳng file ca, ghim đúng dòng PASS của từng ca
#   · mutant   — ba đột biến có marker, đối chứng dương trên CÙNG cách chép
#   · san-dem  — bộ lọc LV_CASES có sàn đếm (chiều đỏ trên bản sao gỡ sàn)
#   · cay-that — QUAN HỆ trên cây thật: mọi hồ sơ verified chưa ký, máy quét ∈ done
#                ⇔ lưới không VIOLATION; sàn ≥2 hồ sơ được so (không ghim tên)
# `cmd:` khai bằng ĐƯỜNG DẪN — không thêm khoá vào _acceptance/config.yaml.
# ROOT suy từ VỊ TRÍ SCRIPT, không từ cwd.
set -u

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SELF="$ROOT/_acceptance/lan-v-khong-phai-cho-ky/rang.sh"
[ -f "$SELF" ] || { echo "RANG-LANV: ROOT suy sai — $SELF khong ton tai"; exit 1; }
CASES="$ROOT/tests/plugins/lan-v.test.mjs"
KCN="$ROOT/scripts/khong-can-nguoi.mjs"
SCAN="$ROOT/scripts/start-scan.mjs"

[ "${1:-}" = "--chan" ] || { echo "dung: $0 --chan cases|mutant|san-dem|cay-that"; exit 2; }
CHAN="${2:-}"

loi=0
bad() { echo "  ĐỎ   $1"; loi=$((loi + 1)); }
TMP=""
cleanup() { [ -n "$TMP" ] && rm -rf "$TMP"; }
trap cleanup EXIT

# Bản sao cây để đột biến. Chép TRỌN (trừ ba thư mục nặng) — liệt kê từng file
# là blacklist, và bản sao thiếu file thì «đỏ» chỉ nói lên việc thiếu file.
chep_cay() { rsync -a --exclude .git --exclude node_modules --exclude .claude "$ROOT/" "$1/" || { echo "RANG-LANV: rsync that bai"; exit 1; }; }

case "$CHAN" in

cases)
  out="$(node "$CASES" 2>&1)"; st=$?
  for id in LV1 LV2 LV3 LV4 LV5 LV6; do
    printf '%s\n' "$out" | grep -q "^PASS: $id " || bad "thieu dong 'PASS: $id ...' trong stdout cua lan-v.test.mjs"
  done
  printf '%s\n' "$out" | grep -q '^PASS: LV4 bang su-that 240 o' || bad "LV4 khong in so o = 240"
  printf '%s\n' "$out" | grep -qE '^PASS: LV5 dang thuc voi luoi: [0-9]+ fixture' || bad "LV5 khong in so fixture da so"
  [ "$st" -eq 0 ] || bad "lan-v.test.mjs exit $st"
  n_fail="$(printf '%s\n' "$out" | grep -c '^FAIL: ' || true)"
  [ "$n_fail" -eq 0 ] || bad "$n_fail dong FAIL: $(printf '%s\n' "$out" | grep '^FAIL: ' | head -2 | tr '\n' ' ')"
  if [ "$loi" -eq 0 ]; then echo "CASES OK: 6 ca LV xanh tren cay that"; exit 0; fi
  echo "CASES: $loi ĐỎ"; exit 1 ;;

mutant)
  TMP="$(mktemp -d)"
  chep_cay "$TMP/A"; chep_cay "$TMP/B"
  # Đối chứng dương: bản A không tiêm phải xanh ở đúng các ca mà đột biến sẽ giết.
  outA="$(LV_CASES=LV1,LV2,LV3,LV5 node "$TMP/A/tests/plugins/lan-v.test.mjs" 2>&1)"; stA=$?
  if [ "$stA" -ne 0 ] || ! printf '%s\n' "$outA" | grep -q '^PASS: LV1 '; then
    echo "MUTANT: ban A (khong tiem) khong xanh — doi chung duong hong, khong do tiep"; printf '%s\n' "$outA" | head -5; exit 1
  fi
  phuc_hoi() { cp "$ROOT/scripts/start-scan.mjs" "$TMP/B/scripts/start-scan.mjs"; cp "$KCN" "$TMP/B/scripts/khong-can-nguoi.mjs"; }

  # (1) KCN-NHANH — gỡ nhánh không-cần-người trong máy quét → LV1 đỏ 'sach ma van o gates'.
  phuc_hoi
  grep -q 'KCN-NHANH' "$TMP/B/scripts/start-scan.mjs" || bad "marker KCN-NHANH khong thay trong start-scan.mjs"
  perl -0pi -e 's/else if \(kcn\(cTxt, ev\.raw\)\) done\.push/else if (false \&\& kcn(cTxt, ev.raw)) done.push/' "$TMP/B/scripts/start-scan.mjs"
  grep -qF 'else if (false && kcn(cTxt, ev.raw)) done.push' "$TMP/B/scripts/start-scan.mjs" || bad "dot bien 1 khong doi duoc dong nao"
  o1="$(LV_CASES=LV1 node "$TMP/B/tests/plugins/lan-v.test.mjs" 2>&1)"
  printf '%s\n' "$o1" | grep -q '^FAIL: LV1 ' || bad "dot bien 1: LV1 khong do"
  printf '%s\n' "$o1" | grep -qF 'sach ma van o gates' || bad "dot bien 1: LV1 do nhung khong ghim 'sach ma van o gates' ($(printf '%s\n' "$o1" | head -1 | cut -c1-120))"

  # (2) KCN-SACH — vị từ bỏ hỏi độ sạch (trở về tiêu chí veto_state của vòng một)
  #     → LV2 đỏ ở cả sáu biến thể VÀ LV5 đỏ 'lech' (lưới vẫn chặn, máy quét đã cho qua).
  phuc_hoi
  grep -q 'KCN-SACH' "$KCN" || bad "marker KCN-SACH khong thay trong khong-can-nguoi.mjs"
  perl -0pi -e 's/if \(!xanhSach\(contractTxt, evidenceTxt\)\.clean\) return null;/if (false \&\& !xanhSach(contractTxt, evidenceTxt).clean) return null;/' "$TMP/B/scripts/khong-can-nguoi.mjs"
  grep -qF 'if (false && !xanhSach(' "$TMP/B/scripts/khong-can-nguoi.mjs" || bad "dot bien 2 khong doi duoc dong nao"
  o2="$(LV_CASES=LV2,LV5 node "$TMP/B/tests/plugins/lan-v.test.mjs" 2>&1)"
  printf '%s\n' "$o2" | grep -q '^FAIL: LV2 ' || bad "dot bien 2: LV2 khong do"
  n2="$(printf '%s\n' "$o2" | grep -o 'chua sach ma thanh done' | wc -l | tr -d ' ')"
  [ "$n2" -ge 6 ] || bad "dot bien 2: LV2 do nhung chi $n2/6 bien the ghim 'chua sach ma thanh done'"
  printf '%s\n' "$o2" | grep -q '^FAIL: LV5 ' || bad "dot bien 2: LV5 (dang thuc voi luoi) khong do — phep so khong phan biet duoc"
  printf '%s\n' "$o2" | grep -qF 'lech V-bypass' || bad "dot bien 2: LV5 do nhung khong ghim 'lech V-bypass'"

  # (3) KCN-VETO — vị từ bỏ nhánh da-veto → LV3 đỏ 'da-veto thanh done'.
  phuc_hoi
  grep -q 'KCN-VETO' "$KCN" || bad "marker KCN-VETO khong thay"
  perl -0pi -e "s/if \(veto\.present && veto\.state === 'da-veto'\) return null;/if (false) return null;/" "$TMP/B/scripts/khong-can-nguoi.mjs"
  grep -qF 'if (false) return null;' "$TMP/B/scripts/khong-can-nguoi.mjs" || bad "dot bien 3 khong doi duoc dong nao"
  o3="$(LV_CASES=LV3 node "$TMP/B/tests/plugins/lan-v.test.mjs" 2>&1)"
  printf '%s\n' "$o3" | grep -q '^FAIL: LV3 ' || bad "dot bien 3: LV3 khong do"
  printf '%s\n' "$o3" | grep -qF 'da-veto thanh done' || bad "dot bien 3: LV3 do nhung khong ghim 'da-veto thanh done'"

  # Bảng sự-thật phải đỏ ≥1 ô dưới MỖI đột biến (gap-probe F3: nếu không, hàm kỳ
  # vọng có thể chỉ là bản chép của vị từ). Chạy LV4 trên ba bản B lần lượt.
  for i in 1 2 3; do
    phuc_hoi
    case $i in
      1) perl -0pi -e 's/else if \(kcn\(cTxt, ev\.raw\)\) done\.push/else if (false \&\& kcn(cTxt, ev.raw)) done.push/' "$TMP/B/scripts/start-scan.mjs" ;;
      2) perl -0pi -e 's/if \(!xanhSach\(contractTxt, evidenceTxt\)\.clean\) return null;/if (false \&\& !xanhSach(contractTxt, evidenceTxt).clean) return null;/' "$TMP/B/scripts/khong-can-nguoi.mjs" ;;
      3) perl -0pi -e "s/if \(veto\.present && veto\.state === 'da-veto'\) return null;/if (false) return null;/" "$TMP/B/scripts/khong-can-nguoi.mjs" ;;
    esac
    o4="$(LV_CASES=LV4 node "$TMP/B/tests/plugins/lan-v.test.mjs" 2>&1)"
    printf '%s\n' "$o4" | grep -qE '^FAIL: LV4 [0-9]+ loi' || bad "dot bien $i: bang su-that LV4 KHONG do o nao — ham ky vong khong doc lap voi vi tu?"
  done

  if [ "$loi" -eq 0 ]; then echo "MUTANT OK: 3 dot bien chay that, moi cai ghim MOT cau rieng; bang su-that do duoi ca ba; doi chung duong ban A xanh"; exit 0; fi
  echo "MUTANT: $loi ĐỎ"; exit 1 ;;

san-dem)
  out="$(LV_CASES=LVX node "$CASES" 2>&1)"; st=$?
  [ "$st" -ne 0 ] || bad "LV_CASES=LVX van exit 0"
  printf '%s\n' "$out" | grep -qF 'LV_CASES=LVX khong khop ca nao' || bad "LVX: khong in dong neu ten da khai"
  outp="$(LV_CASES=LV1 node "$CASES" 2>&1)"; stp=$?
  [ "$stp" -eq 0 ] || bad "doi chung duong LV_CASES=LV1 exit $stp"
  [ "$(printf '%s\n' "$outp" | grep -c '^PASS: ')" -eq 1 ] || bad "doi chung duong: khong dung mot dong ca"
  # Chiều đỏ: bản sao gỡ sàn đếm → LVX exit 0 im lặng → răng phải kêu.
  TMP="$(mktemp -d)"; chep_cay "$TMP/B"
  perl -0pi -e 's/if \(only\.length && matched === 0\) \{/if (false) {/' "$TMP/B/tests/plugins/lan-v.test.mjs"
  grep -qF 'if (false) {' "$TMP/B/tests/plugins/lan-v.test.mjs" || bad "chieu do: sed khong doi duoc dong nao"
  LV_CASES=LVX node "$TMP/B/tests/plugins/lan-v.test.mjs" >/dev/null 2>&1 && stm=0 || stm=$?
  [ "$stm" -eq 0 ] || bad "chieu do: ban sao go san dem ma LVX van exit $stm (mutant khong chay duoc?)"
  # (exit 0 ở bản B là ĐÚNG chiều đỏ: chứng minh sàn đếm là thứ làm bản thật đỏ.)
  if [ "$loi" -eq 0 ]; then echo "SAN-DEM OK: ten sai -> exit 1 co thong diep; ten dung -> 1 dong ca; ban sao go san dem -> xanh gia (chieu do chay that)"; exit 0; fi
  echo "SAN-DEM: $loi ĐỎ"; exit 1 ;;

cay-that)
  # Một lượt lưới trên cây thật (--base main), một lượt máy quét; so QUAN HỆ cho
  # MỌI hồ sơ verified chưa ký. Không ghim tên hồ sơ nào (gap-probe F4).
  luoi="$(cd "$ROOT" && env -u PRE_MERGE_BASE bash scripts/pre-merge-check.sh . --base main 2>&1)"
  quet="$(node "$SCAN" --root "$ROOT")" || { echo "CAY-THAT: may quet khong chay duoc"; exit 1; }
  so=0
  for d in "$ROOT"/_acceptance/*/; do
    slug="$(basename "$d")"; c="$d/contract.md"; e="$d/evidence-report.md"
    [ -f "$c" ] && [ -f "$e" ] || continue
    st="$(sed -n '/^---[[:space:]]*$/,/^---[[:space:]]*$/p' "$c" | sed -n 's/^status[[:space:]]*:[[:space:]]*//p' | head -1 | sed 's/[[:space:]#].*$//')"
    [ "$st" = "verified" ] || continue
    sig="$(sed -n '/^---[[:space:]]*$/,/^---[[:space:]]*$/p' "$e" | sed -n 's/^human_signoff[[:space:]]*:[[:space:]]*//p' | head -1 | tr -d '[:space:]')"
    [ -z "$sig" ] || continue
    so=$((so + 1))
    if printf '%s\n' "$luoi" | grep -q "^VIOLATION \[$slug\]"; then chan=1; else chan=0; fi
    if printf '%s' "$quet" | python3 -c "import json,sys; j=json.load(sys.stdin); sys.exit(0 if any(d['slug']==sys.argv[1] for d in j['groups']['done']) else 1)" "$slug"; then done_=1; else done_=0; fi
    [ "$chan" -ne "$done_" ] || bad "lech $slug: luoi=$([ $chan = 1 ] && echo chan || echo qua) may-quet=$([ $done_ = 1 ] && echo done || echo gates)"
  done
  [ "$so" -ge 2 ] || bad "san: chi $so ho so verified-chua-ky duoc so (can >=2 de phep do co nghia)"
  grep -qF 'lan-v-mo' "$ROOT/commands/start.md" || bad "commands/start.md khong neu 'lan-v-mo'"
  grep -qF 'xanh-sach' "$ROOT/commands/start.md" || bad "commands/start.md khong neu 'xanh-sach'"
  # Chiều đỏ của vế chỉ dẫn: bản sao start.md gỡ 'xanh-sach' → phép grep trên phải đỏ.
  TMP="$(mktemp -d)"; sed 's/xanh-sach//g' "$ROOT/commands/start.md" > "$TMP/start.md"
  grep -qF 'xanh-sach' "$TMP/start.md" && bad "chieu do: sed khong go duoc 'xanh-sach' khoi ban sao"
  if [ "$loi" -eq 0 ]; then echo "CAY-THAT OK: $so ho so verified-chua-ky, may quet == luoi o ca $so; /start neu hai trang thai (chieu do chay that)"; exit 0; fi
  echo "CAY-THAT: $loi ĐỎ"; exit 1 ;;

*) echo "chan khong biet: $CHAN"; exit 2 ;;
esac
