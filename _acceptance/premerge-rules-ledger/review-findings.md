# Review Findings: premerge-rules-ledger (round 8)

Informational — outside the hook-enforced evidence-report schema. Findings
below have all been adversarial-verified (reproduced or traced to exact
code/doc lines) prior to listing here.

---

## 1. [MEDIUM] RL15d2/RL15d3 kết luận từ mã thoát trần, không ghim thông điệp — vi phạm bất biến #4 CLAUDE.md

- **File:** `tests/scripts/run-tests.sh:2518`
- **Source:** conventions

CLAUDE.md yêu cầu mọi case âm tính phải (a) có đối chứng dương và (b) ghim
ĐÚNG thông điệp mong đợi, không chỉ mã thoát — và dặn sửa theo LỚP, quét cả
file. Trong nhóm RL15d (guard `--slug` chứa `/`, `.`, `..`), chỉ RL15D1
(`feat-rl/`) có pin thông điệp (RL15d1m "is not a plain slug name");
RL15D2 (`--slug .`) và RL15D3 (`--slug ..`) chỉ assert `check ... 2 $?` cộng
một `nothas` gộp ba output ở RL15d4. Exit 2 một mình không phân biệt được
"guard `.`/`..` bắt đúng" với các đường exit-2 khác của script (unknown
option, `--base` lỗi, `VIOLATION [scope]`...). Mọi case anh em trong cùng
đợt (RL14a/b/c/e, RL15a/b/c, RL5b, TE18i2...) đều đã được vá đúng khuôn kèm
pin — đây là hai case sót lại cùng hình dạng trong chính file đó. Sửa tối
thiểu: thêm `hasout` ghim "is not a plain slug name" trên $RL15D2 và
$RL15D3.

---

## Chưa adversarial-verify (refuter chết)

Không có — finding trên đã adversarial-verify (đọc trực tiếp
`tests/scripts/run-tests.sh` quanh dòng 2518, đối chiếu case anh em
RL15D1/RL15d4 và các case cùng đợt round-7 đã pin đúng khuôn).
