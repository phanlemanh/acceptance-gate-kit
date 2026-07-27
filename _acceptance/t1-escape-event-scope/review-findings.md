# Review Findings: t1-escape-event-scope (round 9)

Informational — outside the evidence-report.md hook contract. Findings below
have been adversarial-verified (refuter pass survived) unless listed under
"Chưa adversarial-verify (refuter chết)".

Review incomplete (finder chết — cảnh báo): none this round.

---

## 1. [medium] `--slug` với slug KHÔNG TỒN TẠI lọc sạch mọi thư mục và báo "clean" — cùng LỚP với `--base ""` round 8

- **file:** `scripts/pre-merge-check.sh:410`
- **source:** bugs

Diff round 8 (chip 33ca1add) đã bịt lỗ `--slug` với giá trị RỖNG: giá trị
rỗng nay exit 2 ("khai-loc-rong phai no to" — một filter đã khai mà không
khớp gì thì không được coi là sạch). Nhưng một `--slug` KHÔNG RỖNG bị gõ sai
(typo, hoặc feature đã đổi tên) mang đúng hình dạng lỗi này mà vẫn
fail-open: filter theo slug ở vòng lặp per-slug (dòng 410-413) bỏ qua MỌI
thư mục, không luật nào từng soi một feature nào, sổ ledger vẫn đánh dấu "đã
chạy per-slug" (`SLUG_SEEN==SLUG_EXPECTED_N` đếm số thư mục TRƯỚC khi bị
filter loại hết), và script in ra `pre-merge-check: clean` exit 0.

Đã verify bằng repro trực tiếp: một repo mà slug duy nhất của nó CHƯA có
Gate 1 ghi nhận thì exit 1 khi KHÔNG có filter; nhưng cùng repo đó exit 0
"clean" khi thêm `--slug feat-KHONG-TON-TAI`. Một slug gõ sai trong công
thức CI sẽ khiến gate xanh vĩnh viễn — đúng LỚP mà bản sửa giá trị-rỗng vừa
được biện minh để chặn (và đúng bài học "vá case có tên, không vá LỚP" mà
CLAUDE.md ghi lại). Hướng sửa rẻ: sau vòng lặp, báo lỗi (hoặc ít nhất
VIOLATION) khi một giá trị `--slug` không khớp thư mục nào. Cùng đoạn code
tồn tại y hệt ở bản mirror `plugins/acceptance-gate/scripts/pre-merge-check.sh`.

---

## 2. [low] `--base` đã khai trên root mà git không dùng được vẫn skip âm thầm, mâu thuẫn với claim README của chính diff

- **file:** `scripts/pre-merge-check.sh:342`
- **source:** bugs

Diff biến "base đã khai mà không resolve được" thành VIOLATION [scope] +
exit 2, và README được cập nhật ghi: "Từ acceptance-gate 1.22.0, base ĐÃ
KHAI mà không resolve được là VIOLATION [scope] + exit 2 ở MỌI repo", nhánh
skip chỉ còn giữ lại cho "không truyền base hoặc không có merge-base". Nhưng
khi `--base` ĐƯỢC khai và nhánh `elif` ở dòng 342 khớp (`$ROOT` không phải
git repo tại đây — root không phải git, hoặc `git rev-parse` lỗi, ví dụ
`safe.directory` từ chối quyền sở hữu trong container CI), lượt chạy vẫn
suy biến về `DIFF_SKIP_NOTE`: gap-probe lẫn T1-escape đều declared-off, repo
sạch exit 0 (đã verify: có dòng NOTE + declared-off, không có exit 2).
Nhánh này không thuộc một trong hai case skip còn lại đã được tài liệu hóa,
nên hoặc code nên coi declared-base + không-có-git là exit 2 giống nhánh
anh em (ref không resolve được), hoặc claim README/GUIDE "ở MỌI repo" là
sai. Hình dạng lỗi `safe.directory` khiến đây là một fail-open âm thầm có
thật trong CI, không chỉ là một nit về tài liệu.

---

## Chưa adversarial-verify (refuter chết)

Không có finding nào trong round này chưa được adversarial-verify.
