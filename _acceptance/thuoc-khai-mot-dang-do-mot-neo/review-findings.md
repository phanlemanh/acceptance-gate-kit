# Review Findings: thuoc-khai-mot-dang-do-mot-neo (round 4)

## Trong hợp đồng

_Không có finding nào được máy phân loại vào mục này — bước triage phạm vi round này KHÔNG chạy được (xem mục "Chưa phân loại" bên dưới)._

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **evidence-report.md không được đánh số lại sau khi descope — bảng eval→criterion lệch một bậc, khai PASS cho tiêu chí đang BLOCKED**
  Người dùng thấy gì: The evidence report used to review this fix may show a check as passed when the underlying item is actually still blocked, which could lead someone to approve work that isn't really finished.
  file: `_acceptance/thuoc-khai-mot-dang-do-mot-neo/evidence-report.md`
  severity: high
  Đề xuất: new-contract

- **Dòng bổ chính tạo TRÙNG mã AC-6 trong contract của hồ sơ đã ký — thẻ Cổng 1 bật cờ vàng và văn bản tiêu chí AC-6 bị ghi đè**
  Người dùng thấy gì: A clarifying note added to a different, already-approved feature's requirements accidentally reused an existing requirement's label, which erased that requirement's original wording and now shows a warning on that feature's approval record.
  file: `_acceptance/inputs-tinh-tu-goc-kho/contract.md`
  severity: high
  Đề xuất: new-contract

- **Coverage và Notes của contract mới vẫn viện dẫn tiêu chí đã xoá và phép quét tĩnh đã gỡ**
  Người dùng thấy gì: The written explanation of what this fix's tests cover still mentions checks that were already removed, which could mislead someone reading it later about what is actually being verified.
  file: `_acceptance/thuoc-khai-mot-dang-do-mot-neo/contract.md`
  severity: medium
  Đề xuất: known-limits

- **Dòng bổ chính chèn vào evals.yaml của hồ sơ đã ký mô tả sai chính phương pháp hiện hành**
  Người dùng thấy gì: A clarifying note added to a different, already-approved feature's test file describes a testing method that isn't actually used anymore, which could confuse someone checking how that feature was verified.
  file: `_acceptance/inputs-tinh-tu-goc-kho/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Header và tham chiếu chéo trong evals.yaml của hồ sơ mới còn theo đánh số cũ**
  Người dùng thấy gì: The introductory notes in this fix's test file still describe an outdated count and grouping of checks, which could confuse anyone later trying to match checks to requirements.
  file: `_acceptance/thuoc-khai-mot-dang-do-mot-neo/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **AC-6 và expected của E8 tuyên «MỌI đột biến đi qua tiem()» nhưng nhánh them_cong dùng .replace() trần**
  Người dùng thấy gì: The requirement text claims every simulated mistake is checked the exact same rigorous way, but one particular case actually uses a looser check — the test still correctly flags problems when they happen, but the written promise is broader than what's really enforced.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Hai đột biến VI của P86 sinh THÔNG ĐIỆP GIỐNG HỆT nhau — không phân biệt được bản chép nào lệch**
  Người dùng thấy gì: When two different kinds of copy-paste mistakes happen in the Vietnamese documentation, the tool reports the exact same error message for both, so a reader can't tell which mistake actually occurred. This is a pre-existing gap, not something this fix touched on purpose.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: wont-fix

- **tkm_p86 selector khớp HAI khối — khối GATE-MODEL bị bỏ qua vẫn cho exit 0 (xanh im lặng)**
  Người dùng thấy gì: The safety net meant to catch budget and copy-paste mistakes in the docs could, if a test block's name changes later on, silently stop running its checks without any warning. Nothing is broken today, but the safety net has a hidden gap that a future edit could quietly open.
  file: `_acceptance/config.yaml`
  severity: high
  Đề xuất: new-contract

- **Khối Coverage của contract mới chỉ được đánh số lại một nửa — hai tham chiếu chết còn sống**
  Người dùng thấy gì: The written explanation of what this fix's tests cover still mentions checks and requirement numbers that no longer exist, which could mislead someone reading it later about what is actually being verified.
  file: `_acceptance/thuoc-khai-mot-dang-do-mot-neo/contract.md`
  severity: medium
  Đề xuất: known-limits

- **evidence-report.md của hồ sơ mới không được đánh số lại theo contract/evals — ghi bằng chứng của phép đo đã bị gỡ**
  Người dùng thấy gì: The evidence report used to review this fix still shows results from checks that were already removed, mapped against the wrong requirement numbers, which could mislead whoever reads it before approving.
  file: `_acceptance/thuoc-khai-mot-dang-do-mot-neo/evidence-report.md`
  severity: medium
  Đề xuất: new-contract

- **Chú thích đầu evals.yaml khai sai số tiêu chí và sai nhóm ô chạy P86**
  Người dùng thấy gì: The introductory notes in this fix's test file still state an outdated number of requirements and an incorrect grouping of checks, which could confuse anyone later trying to match checks to requirements.
  file: `_acceptance/thuoc-khai-mot-dang-do-mot-neo/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ: hai đột biến bản VI ghim CÙNG một chuỗi, không phân biệt được bản nào lệch**
  Người dùng thấy gì: When two different kinds of copy-paste mistakes happen in the Vietnamese documentation, the tool reports the exact same error message for both, so a reader can't tell which mistake actually occurred. This is a pre-existing gap, not something this fix touched on purpose.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: wont-fix

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ.

- **Nhánh đột biến `them_cong` không đi qua `tiem()` — hợp đồng và E8 khai «MỌI đột biến» là sai**
  file: `tests/plugins/run-tests.sh:11021`
  severity: medium
  source: bugs
  detail: `tiem()` (dòng 11059) là chân chứng minh mũi tiêm trúng: `assert text.count(a) == 1` rồi `assert ra != text`. 11/12 đột biến đi qua nó. Nhưng nhánh `them_cong=True` trong `kiem()` (dòng 11021–11026) tiêm ba dòng bảng bằng `.replace(..., 1)` TRẦN:

      vi_g = vi_g.replace("\n\n**Ngân sách", "\n" + dong + "\n\n**Ngân sách", 1)
      vi_q = vi_q.replace(…)
      en_r = en_r.replace("\n\n**Human-turn budget", …, 1)

    không đếm số lần khớp, không so trước/sau. Đây chính là đường đi của đột biến `"them cong nhung giu ngan sach"` (dòng 11084) — ca DUY NHẤT chứng minh phép so QUAN HỆ ở AC-7.

    Hai văn bản sống khai ngược lại: contract.md:42 (AC-6) «Và MỌI đột biến phải đi qua chân «mũi tiêm có trúng»: chuỗi đích xuất hiện đúng một lần và văn bản sau khác trước»; evals.yaml:107 (E8 expected) «và MỌI đột biến đi qua chân `tiem()` đếm chuỗi đích đúng một lần rồi so văn bản trước/sau». Hội đồng vòng 3 đã nêu (review-findings.md §5, severity low) nhưng commit thu phạm vi 271590d0 không sửa mã, không sửa lời khai, và cũng không ghi vào known-limits-ledger.tsv.

    failure_scenario: Ai đó đổi câu dẫn dòng ngân sách trong GUIDE/QUICKSTART/README (ví dụ bỏ dòng trống trước `**Ngân sách`). Ba `.replace` trượt, hàng bảng cổng-thứ-năm không được chèn. Ca vẫn FAIL nhưng vì lệch ghim ở nhánh khác, nên thông điệp đỏ chỉ sai chỗ; và lời khai «MỌI đột biến đi qua tiem()» trong contract/E8 vẫn là khẳng định không có thật, không phép đo nào của kho bắt được.

- **Hình dạng 5 — tuyên bất biến toàn lớp «MỌI đột biến đi qua chân tiem()» nhưng nhánh `them_cong` tiêm bằng `.replace` trần, không đếm mũi tiêm**
  file: `tests/plugins/run-tests.sh:11021`
  severity: low
  source: measurement
  detail: AC-6 của `_acceptance/thuoc-khai-mot-dang-do-mot-neo/contract.md` và `expected` của ô E8 trong `evals.yaml` cùng tuyên một bất biến toàn lớp: «MỌI đột biến phải đi qua chân «mũi tiêm có trúng»» / «MỌI đột biến đi qua chân `tiem()` đếm chuỗi đích đúng một lần rồi so văn bản trước/sau».

    Trong mã, `tiem()` (dòng 11059–11071: `assert text.count(a) == 1` rồi `assert ra != text`) phủ 10/11 mũi tiêm. Nhánh `them_cong=True` bên trong `kiem` (dòng 11021–11026) tiêm ba dòng bảng bằng `.replace(..., 1)` TRẦN, không đếm số lần khớp, không so văn bản trước/sau. Đột biến `"them cong nhung giu ngan sach"` (dòng 11084) — chính ca DUY NHẤT chứng minh phép so QUAN HỆ của AC-7 — chạy qua nhánh này. Lớp tuyên có 11 phần tử, chân kiểm chỉ phủ 10.

    Chiều KHÔNG đỏ (ghi để không thổi phồng): nếu ba `.replace` này trượt thì `nhan(vi_g)` lệch `vis` và `kiem` trả «lech cot `vi`», không chứa chuỗi ghim, nên `assert phai_neu in d` vẫn FAIL — đây là lời khai quá tay, chưa phải đường xanh-im-lặng.

## Chưa adversarial-verify (refuter chết)

_Không có finding nào bị đánh dấu unverified=true trong round này._

⚠ Cụm ngoài vùng phủ: 8/14 lỗi rơi vào file không bộ đo nào phủ (_acceptance/thuoc-khai-mot-dang-do-mot-neo/evidence-report.md, _acceptance/inputs-tinh-tu-goc-kho/contract.md, _acceptance/thuoc-khai-mot-dang-do-mot-neo/contract.md, _acceptance/inputs-tinh-tu-goc-kho/evals.yaml, _acceptance/thuoc-khai-mot-dang-do-mot-neo/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
