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
the-nguong|the-nguong-do)
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
const KNOWN=['chan','blocked','slug','ran_at','lac','kho_chiu','vat','variant','chuyen_phien_nguoi','schema_version'];
function keysOfTemplate(tpl){const m=tpl.match(/<!-- <<<STRANGER-FRONTMATTER-TEMPLATE -->\n```yaml\n---\n([\s\S]*?)\n---\n```/);if(!m)return null;return new Set(m[1].split('\n').map(l=>l.match(/^([a-z_]+):/)).filter(Boolean).map(m=>m[1]));}
// ĐỌC = khoá backtick trong §0..§1 của SKILL (đoạn nói về nhật-ký-vấp), lọc theo tập tên khoá nhật-ký đã biết
function keysRead(sk){const seg=(sk.split(/^## 0\./m)[1]||'').split(/^## 2\./m)[0]||'';const set=new Set();for(const m of seg.matchAll(/`([a-z_]+)`/g)){if(KNOWN.includes(m[1]))set.add(m[1]);}return set;}
function check(tpl,sk,label){const K=keysOfTemplate(tpl);if(!K)return label+': khuon thieu khoi STRANGER-FRONTMATTER-TEMPLATE';const R=[...keysRead(sk)];for(const k of R)if(!K.has(k))return label+': §0 doc khoa ngoai khuon: '+k;for(const k of['chan','slug','ran_at'])if(!R.includes(k))return label+': §0 khong doc khoa bat buoc: '+k;if(!/stranger-drive\.md/.test(sk))return label+': §0 khong nhac stranger-drive.md';return null;}
if(!fs.existsSync(tplP))die('khuon thieu khoi STRANGER-FRONTMATTER-TEMPLATE (file chua co)');
const tpl=fs.readFileSync(tplP,'utf8'),sk=fs.readFileSync(skP,'utf8');
const e=check(tpl,sk,'that');if(e)die(e);
if(!fs.readFileSync(path.join(root,'docs/lai-thu-nguoi-la.md'),'utf8').includes('stranger-drive-template.md'))die('docs/lai-thu-nguoi-la.md khong tro toi khuon');
// chiều đỏ hai phía trên bản sao chuỗi
const eA=check(tpl.replace(/^chan:/m,'blocked:'),sk,'mutA');if(!eA||!/ngoai khuon: chan/.test(eA))die('MUTANT khuon (chan->blocked) KHONG bi bat: '+eA);
const eB=check(tpl,sk.replace(/`chan`/,'`blocked`'),'mutB');if(!eB||!/ngoai khuon: blocked/.test(eB))die('MUTANT SKILL (chan->blocked) KHONG bi bat: '+eB);
console.log('  MNVT XANH [khuon]: DOC ⊆ KHUON, DOC ⊇ {chan,slug,ran_at}; 2 mutant bi bat ('+eA+' | '+eB+')');
JS
  ;;
uat-needle)
  SK="$ROOT/skills/uat-session/SKILL.md"
  S0="$(awk '/^## 0\./{f=1} /^## 2\./{f=0} f' "$SK")"
  need() { printf '%s' "$S0" | grep -q -- "$1" || fail "thieu nhanh: $2"; }
  need 'chan' 'khoa chan'; need 'THOẢ BẰNG BẰNG CHỨNG' 'nhanh thoa bang bang chung'
  need 'cờ vàng' 'thieu nhanh co vang'; need 'lái-thử' 'thieu chi duong lai-thu lai'
  need 'verified_at' 'nhanh ran_at cu hon lan cham'; need 'Chuyển phiên người' 'chep Chuyen phien nguoi vao cham kin'
  M1="$(printf '%s' "$S0" | grep -v 'cờ vàng')"; printf '%s' "$M1" | grep -q 'cờ vàng' && fail "mutant xoa co vang khong ap duoc"
  M2="$(printf '%s' "$S0" | grep -v 'lái-thử')"; printf '%s' "$M2" | grep -q 'lái-thử' && fail "mutant xoa chi duong khong ap duoc"
  ok "6 nhanh co ten; 2 mutant (thieu nhanh co vang · thieu chi duong lai-thu lai) doi mau"
  ;;
s5-needle)
  SK="$ROOT/feature-loop/skills/feature-loop/SKILL.md"
  S5="$(awk '/^## S5/{f=1} /^## Quy tắc/{f=0} f' "$SK")"; S0="$(awk '/^## S0/{f=1} /^## S1/{f=0} f' "$SK")"
  printf '%s' "$S5" | grep -q 'opportunity.md' || fail "thieu dong ban giao S5 (khong nhac opportunity.md)"
  printf '%s' "$S5" | grep -q 'lái-thử' || fail "thieu dong ban giao S5 (khong nhac lai-thu)"
  printf '%s' "$S5" | grep -q 'uat-session <slug>' || fail "thieu dong ban giao S5 (khong co lenh uat-session <slug>)"
  printf '%s' "$S5" | grep -q 'ship thẳng' || fail "thieu nhanh khong-co-hoi ship thang"
  printf '%s' "$S0" | grep -q 'opportunity.md' || fail "S0 khong nhac opportunity.md lam input brainstorm"
  M="$(printf '%s' "$S5" | grep -v 'lái-thử')"; printf '%s' "$M" | grep -q 'lái-thử' && fail "mutant khong ap duoc"
  ok "S5 co dong ban giao (opportunity · lái-thử · uat-session <slug>) + nhanh ship thang; S0 doc opportunity; mutant xoa dong ban giao doi mau"
  ;;
spec)
  SP="$ROOT/docs/specs/workflow-v2-spec.md"; DB="$ROOT/docs/plans/2026-08-13-de-bai-lai-thu-nguoi-la.md"
  awk '/^### 2.3/{f=1} /^### 2.4/{f=0} f' "$SP" | grep -q 'thì ĐO' || fail "§2.3 khong goi lai-thu la thi DO"
  grep '^| \*\*A\*\*' "$SP" | grep -q 'lái-thử' || fail "hang A thieu lai-thu"
  awk '/^## CHƯƠNG 3/{f=1} /^## CHƯƠNG 4/{f=0} f' "$SP" | grep -q 'lái-thử không có hàng' || fail "Chuong 3 thieu dong lai-thu khong co hang"
  awk '/^## CHƯƠNG 4/{f=1} /^## CHƯƠNG 5/{f=0} f' "$SP" | grep -q 'nhật-ký-vấp' || fail "Chuong 4 khong nhac nhat-ky-vap"
  grep -q 'Cấm leo thang trước số liệu' "$DB" || fail "de bai §5 bi sua/gach"
  M="$(grep '^| \*\*A\*\*' "$SP" | sed 's/lái-thử//g')"; printf '%s' "$M" | grep -q 'lái-thử' && fail "mutant khong ap duoc"
  ok "§2.3 thi DO · hang A co lai-thu · Chuong 3 dong · Chuong 4 nhat-ky-vap · §5 de bai nguyen; mutant hang A doi mau"
  ;;
hinh)
  D="$ROOT/docs/diagrams"; IDX="$D/workflow-v2-bo-hinh.md"
  FILES="toan-tuyen chuoi-vat-chung vong-doi-mot-viec kien-truc-bo-may ban-mau-bon-truc lan-ui"
  for f in $FILES; do [ -f "$D/workflow-v2-$f.html" ] || fail "thieu file: workflow-v2-$f.html"; grep -q 'class="colophon"' "$D/workflow-v2-$f.html" || fail "thieu colophon: $f"; grep -q "workflow-v2-$f.html" "$IDX" || fail "muc luc thieu: $f"; done
  for f in chuoi-vat-chung vong-doi-mot-viec; do
    grep 'class="eyebrow"' "$D/workflow-v2-$f.html" | grep -q 'ĐỀ XUẤT' || fail "thieu dau DE XUAT: $f (eyebrow)"
    grep 'class="colophon"' "$D/workflow-v2-$f.html" | grep -q 'ĐỀ XUẤT' || fail "thieu dau DE XUAT: $f (colophon)"
    grep 'class="colophon"' "$D/workflow-v2-$f.html" | grep -q 'cho tới khi' || fail "colophon thieu dieu kien go dau: $f"
  done
  cp "$D/workflow-v2-chuoi-vat-chung.html" "$TMP/x.html"; sed -i.bak 's/ĐỀ XUẤT//g' "$TMP/x.html"; grep 'class="eyebrow"' "$TMP/x.html" | grep -q 'ĐỀ XUẤT' && fail "mutant khong ap duoc"
  ok "6 file · muc luc du · dau DE XUAT + dieu kien go tren 2 hinh; mutant go dau doi mau"
  ;;
*) fail "chan khong biet: $CHAN" ;;
esac
