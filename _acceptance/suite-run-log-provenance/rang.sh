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

ban_sao() { # ban_sao <dich> — trọn cây tại HEAD
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
      "W28 doi chung: khong va cham -> ten khong doi"
    # chiều đỏ: gỡ ĐOẠN chống va chạm trong bản sao (không neo mốc git — mốc
    # bản-chưa-chống-va-chạm chỉ sống trên commit nhánh, amend là chết)
    ban_sao "$TMP/vc"
    f="$TMP/vc/feature-loop/workflows/acceptance-verify.js"
    cp "$f" "$f.truoc"
    sed -i.bak 's/const ten = tenDuyNhat(m.cmd)/const ten = tenSuite(m.cmd)/' "$f"
    if cmp -s "$f" "$f.truoc"; then ghim "tiem doi duoc noi dung" 1 "sed khong doi dong nao"; else ghim "tiem doi duoc noi dung" 0; fi
    chay "$TMP/vc" "$TMP/vc.out"
    for bt in "tien to thu muc" "khac co" "trung 40 ky tu dau"; do
      if grep -qF "FAIL: W28 [$bt] hai lenh -> hai ma" "$TMP/vc.out"; then
        ghim "chieu do [$bt]: hai lenh dung chung mot ma" 0
      else
        ghim "chieu do [$bt]: hai lenh dung chung mot ma" 1 "go chong va cham ma phep do van xanh — thuoc khong can"
      fi
    done
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
      "W30 so assert = so o trong ma tran truc A (5 o o day + 1 o gop lenh o W32)"
    ;;

  day-khep)
    doi_chung_duong
    ghim_cac_dong "$TMP/head.out" "day-khep" \
      "W33 ma trong ban cham deu co trong so" \
      "W33 chieu do: thieu dong suite -> do, neu dich danh ma" \
      "W33 chieu do: ban cham ghi evalId thay vi run_id -> do" \
      "W33 de bai chua dung MOT khoi luat mint" \
      "W33 de bai mang ma suite that"
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
