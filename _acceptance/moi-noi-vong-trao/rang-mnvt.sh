#!/usr/bin/env bash
# rang-mnvt.sh — răng hồ sơ moi-noi-vong-trao. Mỗi chân: vật thật + chiều đỏ cùng lượt
# trên bản sao code-sinh; đường dẫn suy từ vị trí script. Không vào suite vĩnh viễn
# (nếp hồ sơ); riêng P197 (thẻ ngưỡng) sống trong tests/plugins vĩnh viễn — hai chân
# the-nguong* chỉ BỌC nó và ghim đúng dòng, không tin mã thoát trọn suite.
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; ROOT="$(cd "$HERE/../.." && pwd)"
CHAN="${2:-}"; [ "${1:-}" = "--chan" ] && [ -n "$CHAN" ] || { echo "dung: $0 --chan <ten>"; exit 2; }
fail() { echo "  MNVT ĐỎ [$CHAN]: $1"; exit 1; }
ok()   { echo "  MNVT XANH [$CHAN]: $1"; }
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
case "$CHAN" in
the-nguong)
  OUT="$(ONLY_BLOCK=P197 bash "$ROOT/tests/plugins/run-tests.sh" 2>&1)"
  printf '%s\n' "$OUT" | grep -q 'P197 OK (' || { printf '%s\n' "$OUT" | grep 'P197' | head -20; fail "khong thay dong P197 OK"; }
  printf '%s\n' "$OUT" | grep -q 'MUTANT m1-go-khoi bi bat' || fail "P197 khong bao mutant m1 bi bat"
  printf '%s\n' "$OUT" | grep -q 'MUTANT m2-khong-co-hoi-in-co-vang bi bat' || fail "P197 khong bao mutant m2 bi bat"
  printf '%s\n' "$OUT" | grep -q 'MUTANT m3-rong-van-in-khoi bi bat' || fail "P197 khong bao mutant m3 bi bat"
  ok "P197 OK + 3 mutant bi bat (ghim dong, khong tin ma thoat suite)"
  ;;
khuon)
  node - "$ROOT" <<'JS' || exit 1
const fs=require('fs'),path=require('path');const root=process.argv[2];
const die=m=>{console.log('  MNVT ĐỎ [khuon]: '+m);process.exit(1)};
const tplP=path.join(root,'skills/acceptance/references/stranger-drive-template.md');
const skP=path.join(root,'skills/uat-session/SKILL.md');
function keysOfTemplate(tpl){const m=tpl.match(/<!-- <<<STRANGER-FRONTMATTER-TEMPLATE -->\n```yaml\n---\n([\s\S]*?)\n---\n```/);if(!m)return null;return new Set(m[1].split('\n').map(l=>l.match(/^([a-z_]+):/)).filter(Boolean).map(m=>m[1]));}
// ĐỌC = khoá khai trong marker máy-đọc STRANGER-KEYS-READ của §0 (writer khai, reader đọc) — không allowlist viết tay.
function marker(sk){const m=sk.match(/<!-- STRANGER-KEYS-READ: ([a-z_ ]+) -->/);return m?m[1].trim().split(/\s+/):null;}
function check(tpl,sk,label){const K=keysOfTemplate(tpl);if(!K)return label+': khuon thieu khoi STRANGER-FRONTMATTER-TEMPLATE';
  const R=marker(sk);if(!R)return label+': §0 thieu marker STRANGER-KEYS-READ';
  const seg=(sk.split(/^## 0\./m)[1]||'').split(/^## 2\./m)[0]||'';
  for(const k of R){if(!K.has(k))return label+': §0 doc khoa ngoai khuon: '+k;if(!seg.includes('`'+k+'`'))return label+': marker khai khoa ma §0–§1 khong dung: '+k;}
  // chiều ngược: mọi khoá của KHUÔN xuất hiện dạng backtick trong §0–§1 đều phải nằm trong marker (không đọc lén)
  for(const k of K){if(seg.includes('`'+k+'`')&&!R.includes(k))return label+': §0 doc khoa khong khai trong marker: '+k;}
  for(const k of['chan','slug','ran_at'])if(!R.includes(k))return label+': §0 khong doc khoa bat buoc: '+k;
  if(!/stranger-drive\.md/.test(seg))return label+': §0 khong nhac stranger-drive.md';return null;}
if(!fs.existsSync(tplP))die('khuon thieu khoi STRANGER-FRONTMATTER-TEMPLATE (file chua co)');
const tpl=fs.readFileSync(tplP,'utf8'),sk=fs.readFileSync(skP,'utf8');
const e=check(tpl,sk,'that');if(e)die(e);
if(!fs.readFileSync(path.join(root,'docs/lai-thu-nguoi-la.md'),'utf8').includes('stranger-drive-template.md'))die('docs/lai-thu-nguoi-la.md khong tro toi khuon');
// chiều đỏ ba phía — mỗi mutant đi qua CHÍNH check() và phải trả đúng thông điệp ghim
const muts=[
 ['khuon chan->blocked', tpl.replace(/^chan:/m,'blocked:'), sk, /ngoai khuon: chan/],
 ['SKILL marker chan->blocked', tpl, sk.replace(/(STRANGER-KEYS-READ: [^>]*?)\bchan\b/,'$1blocked'), /ngoai khuon: blocked/],
 ['SKILL doc len khoa lac (khong khai marker)', tpl, sk.replace(/`chan`/,'`chan` `lac`'), /khong khai trong marker: lac/],
];
const seen=[];for(const [n,t,k,rx] of muts){const r=check(t,k,'mut');if(!r||!rx.test(r))die('MUTANT '+n+' KHONG bi bat: '+r);seen.push(r);}
console.log('  MNVT XANH [khuon]: DOC(marker) ⊆ KHUON, DOC ⊇ {chan,slug,ran_at}, hai chieu marker↔backtick; 3 mutant bi bat ('+seen.join(' | ')+')');
JS
  ;;
uat-needle)
  SK="$ROOT/skills/uat-session/SKILL.md"
  # checker nhận NỘI DUNG, trả thông điệp ghim hoặc rỗng — mutant đi qua chính hàm này
  chk_uat() { local T="$1"; local S0; S0="$(printf '%s' "$T" | awk '/^## 0\./{f=1} /^## 2\./{f=0} f')"
    [ -n "$S0" ] || { echo "khong rut duoc §0–§1"; return; }
    printf '%s' "$S0" | grep -q 'chan' || { echo "thieu nhanh: khoa chan"; return; }
    printf '%s' "$S0" | grep -q 'THOẢ BẰNG BẰNG CHỨNG' || { echo "thieu nhanh thoa bang bang chung"; return; }
    printf '%s' "$S0" | grep -q 'cờ vàng' || { echo "thieu nhanh co vang"; return; }
    printf '%s' "$S0" | grep -q 'lái-thử' || { echo "thieu chi duong lai-thu lai"; return; }
    printf '%s' "$S0" | grep -q 'verified_at' || { echo "thieu nhanh ran_at cu hon lan cham"; return; }
    printf '%s' "$S0" | grep -q 'Chuyển phiên người' || { echo "thieu chep Chuyen phien nguoi vao cham kin"; return; }
    echo ""; }
  R="$(chk_uat "$(cat "$SK")")"; [ -z "$R" ] || fail "$R"
  M1="$(chk_uat "$(sed 's/cờ vàng//g' "$SK")")"; [ "$M1" = "thieu nhanh co vang" ] || fail "MUTANT xoa co vang KHONG bi bat dung thong diep (thay: $M1)"
  M2="$(chk_uat "$(sed 's/lái-thử//g' "$SK")")"; [ "$M2" = "thieu chi duong lai-thu lai" ] || fail "MUTANT xoa chi duong KHONG bi bat dung thong diep (thay: $M2)"
  ok "6 nhanh co ten; 2 mutant qua chinh checker, ghim dung thong diep (thieu nhanh co vang · thieu chi duong lai-thu lai)"
  ;;
s5-needle)
  SK="$ROOT/feature-loop/skills/feature-loop/SKILL.md"
  chk_s5() { local T="$1"; local S5 S0; S5="$(printf '%s' "$T" | awk '/^## S5/{f=1} /^## Quy tắc/{f=0} f')"; S0="$(printf '%s' "$T" | awk '/^## S0/{f=1} /^## S1/{f=0} f')"
    [ -n "$S5" ] && [ -n "$S0" ] || { echo "khong rut duoc S0/S5"; return; }
    printf '%s' "$S5" | grep -q 'opportunity.md' || { echo "thieu dong ban giao S5"; return; }
    printf '%s' "$S5" | grep -q 'lái-thử' || { echo "thieu dong ban giao S5"; return; }
    printf '%s' "$S5" | grep -q 'uat-session <slug>' || { echo "thieu dong ban giao S5"; return; }
    printf '%s' "$S5" | grep -q 'ship thẳng' || { echo "thieu nhanh khong-co-hoi ship thang"; return; }
    printf '%s' "$S0" | grep -q 'opportunity.md' || { echo "S0 khong doc opportunity.md"; return; }
    echo ""; }
  R="$(chk_s5 "$(cat "$SK")")"; [ -z "$R" ] || fail "$R"
  M="$(chk_s5 "$(sed 's/lái-thử//g' "$SK")")"; [ "$M" = "thieu dong ban giao S5" ] || fail "MUTANT xoa dong ban giao KHONG bi bat dung thong diep (thay: $M)"
  M2="$(chk_s5 "$(sed 's/ship thẳng//g' "$SK")")"; [ "$M2" = "thieu nhanh khong-co-hoi ship thang" ] || fail "MUTANT xoa nhanh ship thang KHONG bi bat (thay: $M2)"
  ok "S5 dong ban giao + nhanh ship thang; S0 doc opportunity; 2 mutant qua chinh checker, ghim dung thong diep"
  ;;
spec)
  SP="$ROOT/docs/specs/workflow-v2-spec.md"; DB="$ROOT/docs/plans/2026-08-13-de-bai-lai-thu-nguoi-la.md"
  chk_spec() { local T="$1"
    printf '%s' "$T" | awk '/^### 2.3/{f=1} /^### 2.4/{f=0} f' | grep -q 'thì ĐO' || { echo "§2.3 khong goi lai-thu la thi DO"; return; }
    printf '%s' "$T" | grep '^| \*\*A\*\*' | grep -q 'lái-thử' || { echo "hang A thieu lai-thu"; return; }
    printf '%s' "$T" | awk '/^## CHƯƠNG 3/{f=1} /^## CHƯƠNG 4/{f=0} f' | grep -q 'lái-thử không có hàng' || { echo "Chuong 3 thieu dong lai-thu khong co hang"; return; }
    local C4; C4="$(printf '%s' "$T" | awk '/^## CHƯƠNG 4/{f=1} /^## CHƯƠNG 5/{f=0} f')"
    printf '%s' "$C4" | grep -q 'nhật-ký-vấp' || { echo "Chuong 4 khong nhac nhat-ky-vap"; return; }
    printf '%s' "$C4" | grep 'nhật-ký-vấp' | grep -q 'song diện' || { echo "Chuong 4 nhat-ky-vap khong noi song dien"; return; }
    echo ""; }
  R="$(chk_spec "$(cat "$SP")")"; [ -z "$R" ] || fail "$R"
  grep -q 'Cấm leo thang trước số liệu' "$DB" || fail "de bai §5 bi sua/gach"
  M="$(chk_spec "$(sed 's/^\(| \*\*A\*\*.*\)lái-thử/\1/' "$SP")")"; [ "$M" = "hang A thieu lai-thu" ] || fail "MUTANT hang A KHONG bi bat dung thong diep (thay: $M)"
  M2="$(chk_spec "$(sed 's/song diện//g' "$SP")")"; [ "$M2" = "Chuong 4 nhat-ky-vap khong noi song dien" ] || fail "MUTANT song dien KHONG bi bat (thay: $M2)"
  ok "§2.3 thi DO · hang A · Chuong 3 · Chuong 4 song dien · §5 nguyen; 2 mutant qua chinh checker, ghim dung thong diep"
  ;;
hinh)
  D="$ROOT/docs/diagrams"; IDX="$D/workflow-v2-bo-hinh.md"
  FILES="toan-tuyen chuoi-vat-chung vong-doi-mot-viec kien-truc-bo-may ban-mau-bon-truc lan-ui"
  # checker nhận THƯ MỤC, trả thông điệp ghim hoặc rỗng — mutant chạy trên bản sao thư mục
  chk_hinh() { local DD="$1"; local f
    for f in $FILES; do [ -f "$DD/workflow-v2-$f.html" ] || { echo "thieu file: workflow-v2-$f.html"; return; }
      grep -q 'class="colophon"' "$DD/workflow-v2-$f.html" || { echo "thieu colophon: $f"; return; }
      grep -q "workflow-v2-$f.html" "$DD/workflow-v2-bo-hinh.md" || { echo "muc luc thieu: $f"; return; }; done
    for f in chuoi-vat-chung vong-doi-mot-viec; do
      grep 'class="eyebrow"' "$DD/workflow-v2-$f.html" | grep -q 'ĐỀ XUẤT' || { echo "thieu dau DE XUAT: $f"; return; }
      grep 'class="colophon"' "$DD/workflow-v2-$f.html" | grep -q 'ĐỀ XUẤT' || { echo "thieu dau DE XUAT: $f"; return; }
      grep 'class="colophon"' "$DD/workflow-v2-$f.html" | grep -q 'cho tới khi' || { echo "colophon thieu dieu kien go dau: $f"; return; }; done
    echo ""; }
  R="$(chk_hinh "$D")"; [ -z "$R" ] || fail "$R"
  mkcopy() { rm -rf "$TMP/d"; mkdir -p "$TMP/d"; cp "$D"/workflow-v2-*.html "$D/workflow-v2-bo-hinh.md" "$TMP/d/"; }
  mkcopy; sed -i.bak 's/ĐỀ XUẤT//g' "$TMP/d/workflow-v2-chuoi-vat-chung.html"; M1="$(chk_hinh "$TMP/d")"; [ "$M1" = "thieu dau DE XUAT: chuoi-vat-chung" ] || fail "MUTANT go dau KHONG bi bat (thay: $M1)"
  mkcopy; sed -i.bak 's/cho tới khi//g' "$TMP/d/workflow-v2-vong-doi-mot-viec.html"; M2="$(chk_hinh "$TMP/d")"; [ "$M2" = "colophon thieu dieu kien go dau: vong-doi-mot-viec" ] || fail "MUTANT go dieu kien KHONG bi bat (thay: $M2)"
  mkcopy; rm "$TMP/d/workflow-v2-lan-ui.html"; M3="$(chk_hinh "$TMP/d")"; [ "$M3" = "thieu file: workflow-v2-lan-ui.html" ] || fail "MUTANT xoa file KHONG bi bat (thay: $M3)"
  ok "6 file · muc luc · dau DE XUAT + dieu kien go; 3 mutant qua chinh checker, ghim dung thong diep"
  ;;
*) fail "chan khong biet: $CHAN" ;;
esac
