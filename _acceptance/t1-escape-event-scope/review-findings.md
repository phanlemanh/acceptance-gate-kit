# Review Findings: t1-escape-event-scope (round 8)

Informational — outside the evidence-report.md hook contract. Findings below
have been adversarial-verified (refuter pass survived) unless listed under
"Chưa adversarial-verify (refuter chết)".

Review incomplete (finder chết — cảnh báo): none this round.

---

## 1. [medium] `--base` với giá trị RỖNG suy biến thành "không có base" thay vì fail-closed VIOLATION [scope]

- **file:** `scripts/pre-merge-check.sh:70`
- **source:** conventions

Diff này bịt lỗ `--base` thiếu giá trị theo hai hướng: chốt giá trị bắt đầu
bằng `-*` ở dòng 70 ("Chốt -* ở trên chỉ phủ positional, không phủ GIÁ
TRỊ"), và fail-closed exit 2 khi base đã khai mà không resolve được (dòng
318-323, "Base ĐƯỢC KHAI mà không resolve != không khai base"). Nhưng
`--base` với giá trị RỖNG được truyền tường minh — `--base ""`, hình dạng CI
kinh điển `--base "$SOME_VAR"` khi biến chưa set — đi qua lọt cả hai chốt
này rồi rơi vào `[ -z "$BASE" ]` ở dòng 311, route thẳng vào nhánh "no PR
base given" (skip): cả t1-escape lẫn gap-probe đều declared-off, repo sạch
exit 0.

Đã verify bằng repro trực tiếp: `pre-merge-check.sh . --base ""` in ra
"NOTE: T1-escape backstop skipped — no PR base given" + "declared-off
t1-escape" + "declared-off gap-probe", không có VIOLATION [scope]. Theo
đúng doctrine của chính diff này, operator ĐÃ khai một base ở đây — nên đây
cùng LỚP lỗi mà commit round-1/round-2 từng bị phê bình ("vá case có tên,
không vá LỚP"). Bị giảm nhẹ (không âm thầm): các dòng ledger + NOTE có
thông báo trạng thái off, và `gate.yml` của chính kit này grep "backstop
skipped" nên sẽ bắt được trong repo kit — nhưng repo tiêu thụ chỉ theo đúng
snippet trong GUIDE sẽ merge xanh. Lỗi giống hệt tồn tại ở bản mirror
`plugins/acceptance-gate/scripts/pre-merge-check.sh`. Hướng sửa: coi giá
trị `--base` rỗng (và `PRE_MERGE_BASE` rỗng khi được set tường minh) là
exit 2 giống case `-*`.

---

## 2. [low] RL5b kết luận từ exit 2 mà không ghim thông điệp mong đợi (cùng lớp CLAUDE.md invariant 4)

- **file:** `tests/scripts/run-tests.sh:2444`
- **source:** conventions

RL5b chạy `bash "$CHECK" "$TE_R" --tuy-chon-la`, assert exit 2 (check
RL5b1) cộng một assertion âm-tính-một-mình (nothas RL5b2
`'pre-merge-check: rules ran='`). Case này không bao giờ ghim thông điệp
mong đợi `unknown option --tuy-chon-la`, nên không phân biệt được "chốt
unknown-flag bắn đúng chỗ parse" với bất kỳ đường exit-2 nào khác (ví dụ
"root not a directory" nếu `$TE_R` — kế thừa từ case rl_repo rl7 trước đó
— từng sai). Đây đúng lớp assertion mà CLAUDE.md invariant 4 yêu cầu sửa
theo LỚP, và comment `TE18i2` trong cùng file ghi lại rằng một case anh em
thiếu chốt này đã bị bắt ở review round 7 — RL5b là case còn sót lại cuối
cùng của hình dạng này trong khối mới. Sửa chỉ một dòng: `hasout RL5bmsg
'unknown option --tuy-chon-la' "$RL5B"`. Lưu ý RL5b dùng script thật (không
phải bản fixture copy), nên rủi ro tồn dư nhỏ — vì vậy low, không phải
medium.

---

## Chưa adversarial-verify (refuter chết)

Không có finding nào trong round này chưa được adversarial-verify.
