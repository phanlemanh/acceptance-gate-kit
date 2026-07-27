# Review Findings: t1-escape-event-scope (round 7)

Informational — outside the evidence-report.md hook contract. Findings below
have been adversarial-verified (refuter pass survived) unless listed under
"Chưa adversarial-verify (refuter chết)".

Review incomplete (finder chết — cảnh báo): none this round.

---

## 1. [high] Parser của `enforcement` ở pre-merge KHÔNG nhận đúng tập mà regex của hook nhận (lệch ở space trước dấu hai chấm)

- **file:** `scripts/pre-merge-check.sh:168`
- **source:** conventions

Comment ở dòng 149-160 khẳng định dòng sed này "nhận ĐÚNG tập mà regex của
hook nhận" (`/^enforcement\s*:\s*(strict|warn|off)\s*(?:#.*)?$/m` trong
`hooks/acceptance-evidence-gate.js:56`), nhưng sed
`s/^enforcement:[[:space:]]*//p` KHÔNG cho phép khoảng trắng trước dấu `:`
trong khi regex hook có `\s*:` — đã verify trực tiếp: input
`enforcement : off` cho hook match `off`, còn sed không match gì. Kết quả:
hook tắt enforcement (off toàn cục, đúng tiền lệ ADR-doctrine "off là off")
nhưng sổ luật-đã-chạy ở pre-merge VẪN BẬT — đúng hình dạng "hai parser bất
đồng" mà chính feature này tồn tại để diệt, và vi phạm AC-11 (enforcement
off tắt sổ theo). Bảng parity RL11c (`tests/scripts/run-tests.sh`, các
`rl_enf_pair`) không có biến thể space-trước-colon nên không bắt được lỗi
này.

Đây là **round 3** của cùng lớp lỗi đã vá 2 round (hoa/thường rồi nhảy) —
CLAUDE.md yêu cầu sửa theo LỚP, quét mọi chiều lệch giữa hai parser (space
trước colon, và rà soát các chiều còn lại của `\s*`), không chỉ vá biến thể
bị nêu tên. Bản mirror `plugins/acceptance-gate/scripts/pre-merge-check.sh`
giống hệt — sửa ở nguồn rồi chạy `scripts/sync-plugin-packages.sh`.

---

## 2. [medium] `enforcement` key: hook và pre-merge parser lệch nhau ở khoảng trắng trước dấu hai chấm (bằng chứng thực nghiệm độc lập)

- **file:** `scripts/pre-merge-check.sh:168`
- **source:** bugs

The hook regex (`hooks/acceptance-evidence-gate.js:56`) is
`/^enforcement\s*:\s*(strict|warn|off)\s*(?:#.*)?$/m` — it accepts
whitespace BEFORE the colon (e.g. `enforcement : off`,
`enforcement\t: off`). The new pre-merge sed
`s/^enforcement:[[:space:]]*//p` requires the colon glued to the key.
Verified empirically: with `enforcement : off` in `_acceptance/config.yaml`
the hook resolves `off` (write-time gate fully disabled) while pre-merge
reads empty, keeps `LEDGER_ENABLED=1`, and prints `pre-merge-check: rules
ran=1 declared-off=2 expected=3` — violating AC-11 (enforcement off => ledger
off, no ledger lines). This directly contradicts the comment block above the
sed (lines 147-167) which claims the sed accepts EXACTLY the set the hook
regex accepts, and the RL11c parity table in `tests/scripts/run-tests.sh`
tests 7 variants but misses this one.

Impact is fail-CLOSED (ledger stays on when the hook is off), so no
false-green — hence medium, not high. Fix: either anchor the hook side too,
or extend the sed to `^enforcement[[:space:]]*:` and add the
space-before-colon variant to the `rl_enf_pair` table. Same bug is mirrored
in `plugins/acceptance-gate/scripts/pre-merge-check.sh` (byte-identical
mirror). Same underlying divergence as finding #1 — kept as a separate
entry here because it was independently verified from the empirical/repro
angle (source: bugs) rather than the doc-claim angle (source: conventions);
fix once, both entries close together.

---

## 3. [medium] TE18i là assertion âm-tính-một-mình: chỉ check exit 2, không ghim thông điệp — đúng lớp CLAUDE.md bất biến #4 cấm

- **file:** `tests/scripts/run-tests.sh:2325`
- **source:** conventions

`TE18I="$(bash "$CHECK" "$R" --slug --base 2>&1)"; check TE18i 2 $?` kết
luận chỉ từ mã thoát 2, không có `hasout` ghim thông điệp `--slug requires a
value (got option --base)`. Mọi case cùng khối đều ghim (TE18f2 "unexpected
argument", TE18g2 "root not a directory", TE18h2 "--base requires a value
(got option --no-t1-escape)", TE18j2 "VIOLATION [scope]") — TE18i là case
duy nhất bỏ. Vì script có nhiều đường exit 2 khác (unexpected argument,
root not a directory, parse lỗi khác), case này không phân biệt được "chốt
`-*` của `--slug` bắt đúng" với "exit 2 vì lý do khác".

CLAUDE.md ghi rõ lớp này đã tái xuất ít nhất 9 lượt và sửa phải theo LỚP —
diff này tự thêm một instance mới của chính lớp đó, ngay giữa các case vừa
được vá.

---

## 4. [low] ADR 0006 dùng "ledger" trần cho sổ quyết định trong doc nói về sổ luật-đã-chạy — vi phạm mục `_Avoid_` vừa thêm vào CONTEXT.md

- **file:** `docs/adr/0006-rules-ledger-fail-closed-at-output.md:54`
- **source:** conventions

Dòng 54: "revisit khi sổ chạy ổn, ledger `d-20260726T200100Z-302`" — "ledger"
trần ở đây trỏ SỔ QUYẾT ĐỊNH (`decisions.jsonl`), trong một ADR toàn nói về
SỔ LUẬT-ĐÃ-CHẠY. CONTEXT.md (sửa trong cùng diff này) thêm đúng quy tắc: hai
nghĩa của "ledger" cùng xuất hiện được trong output một lần chạy, văn bản
MỚI phải gọi tên đầy đủ ("sổ luật-đã-chạy" / "sổ quyết định"), `_Avoid_`:
"ledger" trần. ADR 0006 là văn bản mới của cùng đợt — nên viết "sổ quyết
định `d-20260726T200100Z-302`".

CLAUDE.md yêu cầu docs mới dùng đúng term chuẩn và tránh mọi từ trong
`_Avoid_`.
