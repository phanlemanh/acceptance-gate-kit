#!/usr/bin/env bash
# Răng hồ sơ suite-run-log-provenance — bảy chân.
#
# Vì sao không tin mã thoát của trọn suite: suite XANH cả trên bản trước vá ở
# những ca khác, nên "exit 0" không phân biệt được "bắt đúng lỗi" với "chưa bao
# giờ chạy". Mỗi chân ghim ĐÚNG dòng ca trong stdout (bài học P194).
#
# Chiều đỏ dựng bằng bản sao TRỌN CÂY (git archive HEAD) do code sinh trong
# chính lần chạy — không chép danh sách file tay (P150), không neo mốc di động.
# Mọi đường dẫn suy từ vị trí script, không hardcode ROOT.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
CHAN="${2:-}"
[ "${1:-}" = "--chan" ] || { echo "dung: $0 --chan <ten>"; exit 2; }

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
loi=0
ghim() { # ghim <nhan> <0|1 ket qua> [chi tiet]
  if [ "$2" = "0" ]; then echo "PASS: $1"; else echo "DO: $1${3:+ — $3}"; loi=1; fi
}
# co_dong <file out> <chuoi ca> — dòng ca phải có mặt dưới dạng PASS
co_dong() { grep -qF "PASS: $2" "$1"; }

chay() { # chay <thu muc> <file out>
  ( cd "$1" && node tests/workflows/acceptance-verify.test.mjs ) > "$2" 2>&1
}

VAT_DO="feature-loop/workflows/acceptance-verify.js tests/workflows/acceptance-verify.test.mjs skills/acceptance/references/evidence-report-template.md"
ban_sao() { # ban_sao <dich> — trọn cây tại HEAD
  # Bản sao dựng từ HEAD, nên cây làm việc còn thay đổi CHƯA COMMIT ở vật được
  # đo thì phép đo đang chấm một bản KHÁC bản đang sửa — im lặng là false-green.
  # Kêu ngay, đừng để người đọc tưởng chiều đỏ đã chạy trên mã của họ.
  if ! ( cd "$ROOT" && git diff --quiet HEAD -- $VAT_DO ); then
    ghim "cay lam viec khop HEAD" 1 "con thay doi CHUA COMMIT o vat duoc do — ban sao (git archive HEAD) se cham ban khac; commit roi chay lai"
  fi
  mkdir -p "$1"
  ( cd "$ROOT" && git archive HEAD ) | tar -x -C "$1"
}

# Đối chứng dương dùng chung: cây hiện tại phải XANH trước đã.
doi_chung_duong() {
  chay "$ROOT" "$TMP/head.out"
  if grep -qE '^Results: [0-9]+ passed, 0 failed' "$TMP/head.out"; then
    ghim "doi chung duong: cay hien tai xanh" 0
  else
    ghim "doi chung duong: cay hien tai xanh" 1 "$(grep -E '^Results:' "$TMP/head.out" | tail -1)"
  fi
}

# ghim_cac_dong <file out> <nhan chan> <ca...>
ghim_cac_dong() {
  local out="$1" nhan="$2"; shift 2
  local ca
  for ca in "$@"; do
    if co_dong "$out" "$ca"; then ghim "$nhan: $ca" 0; else ghim "$nhan: $ca" 1 "thieu dong ca"; fi
  done
}

# tiem_roi_doi_do <thu muc> <sed expr> <ten ca phai do> <nhan ban tiem>
# Bản sao TRỌN CÂY + cmp chứng minh tiêm đổi được nội dung + đòi ĐÚNG ca đó đỏ.
tiem_roi_doi_do() {
  local dir="$1" expr="$2" ca="$3" nhan="$4"
  ban_sao "$dir"
  local f="$dir/feature-loop/workflows/acceptance-verify.js"
  cp "$f" "$f.truoc"
  sed -i.bak "$expr" "$f"
  if cmp -s "$f" "$f.truoc"; then
    ghim "tiem [$nhan] doi duoc noi dung" 1 "sed khong doi dong nao"
    return
  fi
  ghim "tiem [$nhan] doi duoc noi dung" 0
  chay "$dir" "$dir.out"
  if grep -qF "FAIL: $ca" "$dir.out"; then
    ghim "chieu do [$nhan]: $ca" 0
  else
    ghim "chieu do [$nhan]: $ca" 1 "tiem xong ma phep do van xanh — thuoc khong can"
  fi
}

case "$CHAN" in

  suite-case)
    doi_chung_duong
    ghim_cac_dong "$TMP/head.out" "suite-case" \
      "W03 runLog: 1 dong moi eval + 1 moi lenh suite" \
      "W03 lenh suite CO dong run-log" \
      "W03 suite: ten suy tu lenh, id duc deterministic" \
      "W03 suite: dong mang exit + cmd that" \
      "W03 synthesize cung nhan id cua lenh suite (log va report phai khop)"
    ;;

  hai-chieu)
    doi_chung_duong
    ban_sao "$TMP/base"
    ( cd "$ROOT" && git show e0222f7f53740b6bd603b218fe9da2b8f8e65e19:feature-loop/workflows/acceptance-verify.js ) \
      > "$TMP/base/feature-loop/workflows/acceptance-verify.js" || { ghim "rut moc BASE-SRLP" 1 "git show hong"; exit 1; }
    if cmp -s "$TMP/base/feature-loop/workflows/acceptance-verify.js" "$ROOT/feature-loop/workflows/acceptance-verify.js"; then
      ghim "tiem doi duoc noi dung" 1 "ban sao giong het ban hien tai"
    else
      ghim "tiem doi duoc noi dung" 0
    fi
    # bản nguyên vẹn của CHÍNH bản sao phải xanh trước — chứng bản sao đủ file
    ban_sao "$TMP/lanh"; chay "$TMP/lanh" "$TMP/lanh.out"
    if grep -qE '^Results: [0-9]+ passed, 0 failed' "$TMP/lanh.out"; then ghim "ban sao lanh -> exit 0" 0; else ghim "ban sao lanh -> exit 0" 1 "ban sao thieu file (ha tang), khong phai vat"; fi
    chay "$TMP/base" "$TMP/base.out"
    if grep -qF "FAIL: W03 lenh suite CO dong run-log" "$TMP/base.out"; then
      ghim "go va -> do dung ca" 0
    else
      ghim "go va -> do dung ca" 1 "$(grep -E '^Results:' "$TMP/base.out" | tail -1)"
    fi
    ;;

  va-cham-ten)
    doi_chung_duong
    ghim_cac_dong "$TMP/head.out" "va-cham" \
      "W28 [tien to thu muc] hai lenh -> hai ma" \
      "W28 [khac co] hai lenh -> hai ma" \
      "W28 [trung 40 ky tu dau] hai lenh -> hai ma" \
      "W28 doi chung: khong va cham -> ten khong doi" \
      "W35 hai lenh -> hai run_id KE CA khi verifier khai trung" \
      "W35 giu lai ma that cua verifier lam goc" \
      "W35 doi chung: ma verifier khac nhau -> giu nguyen van" \
      "W36 ten trung la khoa prototype van duoc hau to" \
      "W28 [tien to thu muc] hai lenh -> hai evalId" \
      "W28 [khac co] hai lenh -> hai evalId" \
      "W28 [trung 40 ky tu dau] hai lenh -> hai evalId"
    # CHIỀU ĐỎ — HAI lớp phòng thủ độc lập, mỗi lớp một bản tiêm riêng. Gỡ một
    # lớp mà phép đo vẫn xanh nhờ lớp kia thì chiều đỏ chết âm thầm, nên không
    # gộp hai lớp vào một bản tiêm.
    tiem_roi_doi_do "$TMP/vc-ten" \
      's/tenDuyNhat(m.cmd)/tenSuite(m.cmd)/g' \
      "W28 [tien to thu muc] hai lenh -> hai evalId" "go lop ten duy nhat"
    tiem_roi_doi_do "$TMP/vc-ma" \
      's/demRidSuite\[r0\] > 1/false/' \
      "W35 hai lenh -> hai run_id KE CA khi verifier khai trung" "go lop ma duy nhat"
    ;;

  ket-qua-rieng)
    doi_chung_duong
    ghim_cac_dong "$TMP/head.out" "ket-qua-rieng" \
      "W31 suite do -> exit that" \
      "W31 cannotRun -> exit_code null + co cannot_run" \
      "W04 dong suite giu exit RIENG cua no, khong an theo eval hong"
    ;;

  thu-tu)
    doi_chung_duong
    ghim_cac_dong "$TMP/head.out" "thu-tu" \
      "W29 doi round -> doi ma" \
      "W30 ten suy tu lenh: npm run build" \
      "W30 ten suy tu lenh: pnpm itest:ci" \
      "W30 ten suy tu lenh: bash tests/hooks/run-tests.sh" \
      "W30 ten suy tu lenh: cd apps/web && pnpm build" \
      "W30 ten suy tu lenh: pnpm build && pnpm typecheck" \
      "W30 so assert = so o trong ma tran truc A (5 o o day + 1 o gop lenh o W32)" \
      "W34 doi thu tu -> ma khong doi" \
      "W34 du ba lenh deu co ma"
    # CHIỀU ĐỎ — hai bản tiêm do code sinh trong chính lần chạy, mỗi bản phải
    # làm ĐỎ đúng ca của mệnh đề nó phá. Không có hai bản này thì «thứ tự» và
    # «vòng» chỉ có chiều dương: xanh không phân biệt được vật lành với thước
    # chưa bao giờ chạy.
    tiem_roi_doi_do "$TMP/tt-thutu" \
      's/SUITE-${tenDuyNhat(m.cmd)}-r${args.round}/SUITE-${machine.indexOf(m)}-r${args.round}/' \
      "W34 doi thu tu -> ma khong doi" "ma duc theo chi so mang"
    tiem_roi_doi_do "$TMP/tt-vong" \
      's/-SUITE-${tenDuyNhat(m.cmd)}-r${args.round}/-SUITE-${tenDuyNhat(m.cmd)}/' \
      "W29 doi round -> doi ma" "bo hau to vong"
    ;;

  day-khep)
    doi_chung_duong
    ghim_cac_dong "$TMP/head.out" "day-khep" \
      "W33 ma trong ban cham deu co trong so" \
      "W33 chieu do: thieu dong suite -> do, neu dich danh ma" \
      "W33 chieu do: ban cham ghi evalId thay vi run_id -> do" \
      "W33 de bai chua dung MOT khoi luat mint" \
      "W33 de bai mang ma suite that" \
      "W33 khuon suite trong ban mau CO dong run_id (round-trip writer<->reader)" \
      "W33 de bai tro dung khuon SUITE-BLOCK-TEMPLATE cua ban mau"
    ;;

  khong-hoi-quy)
    doi_chung_duong
    ghim_cac_dong "$TMP/head.out" "khong-hoi-quy" \
      "W32 trung lenh -> khong sinh dong SUITE" \
      "W32 so dong = so eval"
    # hình dạng dòng eval phải GIỮ NGUYÊN so với bản trước vá: so TẬP KHOÁ do
    # chính hai bản writer sinh ra trên cùng một fixture (writer↔writer, không
    # phải khuôn viết tay)
    ban_sao "$TMP/hd"
    ( cd "$ROOT" && git show e0222f7f53740b6bd603b218fe9da2b8f8e65e19:feature-loop/workflows/acceptance-verify.js ) \
      > "$TMP/hd/feature-loop/workflows/acceptance-verify.js"
    cat > "$TMP/khoa.mjs" <<'JS'
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runWorkflow } from './tests/workflows/harness.mjs';
const WF = path.join(process.cwd(), 'feature-loop', 'workflows', 'acceptance-verify.js');
const args = {
  slug: 'demo', round: 1, riskTier: 'T2',
  evals: [{ id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass' }],
  suiteCommands: [], diffBase: 'main', repoRoot: '/repo',
  personasPath: '/p.md', templatePath: '/t.md', invokedAt: '2026-07-02T10:00:00Z',
};
const responder = (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'ok', runId: '', cannotRun: false };
  if (l.startsWith('review:')) return { findings: [] };
  if (l.startsWith('baseline:')) return { results: [] };
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a'.repeat(40) };
  if (l === 'synthesize:report') return { report: 'r', findings: 'f' };
  return null;
};
const { result } = await runWorkflow(WF, args, responder);
const l = JSON.parse(result.runLog[0]);
console.log(Object.keys(l).sort().join(','));
JS
    # chạy CÙNG một script trong HAI bản sao trọn cây (writer↔writer): bản HEAD
    # và bản thay acceptance-verify.js bằng mốc trước vá. Script phải nằm ở gốc
    # cây vì nó import './tests/workflows/harness.mjs' theo vị trí FILE.
    ban_sao "$TMP/hd_head"
    cp "$TMP/khoa.mjs" "$TMP/hd/khoa.mjs"; cp "$TMP/khoa.mjs" "$TMP/hd_head/khoa.mjs"
    k_head="$( cd "$TMP/hd_head" && node khoa.mjs 2>/dev/null | tail -1 )"
    k_base="$( cd "$TMP/hd" && node khoa.mjs 2>/dev/null | tail -1 )"
    [ -n "$k_head" ] || ghim "ban HEAD sinh duoc dong eval" 1 "script khoa khong chay duoc — ha tang, khong phai vat"
    if [ -n "$k_head" ] && [ "$k_head" = "$k_base" ]; then
      ghim "dong eval khong doi hinh dang ($k_head)" 0
    else
      ghim "dong eval khong doi hinh dang" 1 "head=[$k_head] base=[$k_base]"
    fi
    ;;

  *) echo "chan khong biet: $CHAN"; exit 2 ;;
esac

[ "$loi" = "0" ] && echo "Results: chan $CHAN passed" || echo "Results: chan $CHAN FAILED"
exit "$loi"
