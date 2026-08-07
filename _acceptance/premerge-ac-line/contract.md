---
schema_version: 1
feature: Răng cross-layer chấm bằng nguồn dùng chung — Nhãn hết làm trượt, tham chiếu chéo hết bị chấm oan
slug: premerge-ac-line
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli]
status: draft
approved_by:
approved_at:
time_human_minutes:
  gate1: 0
  gate2: 0
---

# Acceptance Contract: premerge-ac-line

## Context

`scripts/pre-merge-check.sh` rút danh sách criterion mang Dấu `(cross-layer)` bằng
một khuôn `awk` viết riêng (dòng 548). Đó là bản sao **thứ tư** của câu hỏi "thế nào
là một dòng criterion" trong repo này — ba bản kia (`gate-card.js`,
`eval-coverage-lint.js`, `evidence-page.js`) nay đều đọc `lib/ac-line.js`.

Khác ba bản kia, khuôn awk **rộng hơn** nguồn dùng chung, nên nó **không rụng dòng
nào**: cổng CHẶN chưa bao giờ mù. Cái nó làm sai là chiều ngược lại — chấm **oan**.
Một dòng tham chiếu chéo trong văn xuôi như `- **AC-5, AC-9 chưa có gì** (cross-layer)`
bị nó rút ra thành `AC-5`, và cổng chặn merge vì AC-5 thiếu eval
`layer: backend-effect` — một criterion **không tồn tại**. `parseAC` loại đúng dạng
đó bằng `AC_XREF`. Khuôn awk cũng đóng section ở `h1`, trong khi `lib/md-section.js` coi `h1`
là nội dung.

**Hồ sơ này là contract HỒI TỐ.** Bản sửa đã tồn tại (nhánh `fix/pre-merge-ac-line`,
PR #35) trước khi hồ sơ được viết, vì cổng T3 của chính kit từ chối PR không kèm
`_acceptance/<slug>/`. Skill `acceptance` xếp "viết criterion sau khi code" vào
anti-pattern — criterion dễ uốn theo thứ đã dựng. Người duyệt Cổng 1 nên đọc mục
`## Criteria` với đúng nghi ngờ đó, và mục `## Coverage` ghi rõ trục nào đến từ phân
tích độc lập chứ không từ diff.

Source input: prompt (phiên 2026-08-07) + PR #35 + hồ sơ ngược `acceptance-gate-kit#32`.

## Criteria

- AC-1: Given một contract mà `## Criteria` chứa một dòng **tham chiếu chéo văn xuôi** mang tên Dấu cross-layer, và một criterion thật đã có cặp eval đầy đủ, When chạy `pre-merge-check.sh`, Then **không** in `VIOLATION` nào mang tên `AC-5` và exit 0. *Đây là lỗi được sửa: cổng chặn merge vì một criterion không tồn tại. Đối chứng dương bắt buộc — cùng fixture trên bản CHƯA sửa phải đỏ, nếu không thì phép đo không chứng minh gì.*
  Hình dạng dòng (dữ liệu fixture, không phải Dấu của chính criterion này):
  `- **AC-5, AC-9 chưa có gì** (cross-layer)`
- AC-2: Given một criterion mang **Nhãn** chen giữa id và dấu hai chấm mà evals của nó **thiếu** `layer: backend-effect`, When chạy `pre-merge-check.sh`, Then vẫn in `VIOLATION` nêu đích danh `AC-1` và chặn merge. *Răng chống hồi quy, KHÔNG phải lỗi được sửa: khuôn awk cũ đã bắt đúng dạng này. Đổi nguồn chấm mà làm mất nó là đánh đổi âm — phải có case ghim lại.*
  Hình dạng dòng (dữ liệu fixture):
  `- AC-1 **(cross-layer)**: Given …`
- AC-3: Given `scripts/pre-merge-check.sh` sau thay đổi, When so diff với base bằng phép đo DV5, Then **0 dòng luật cũ bị xoá hoặc sửa** — dòng `awk` giữ nguyên **từng byte** và vẫn chạy; phần thêm chỉ nằm ở các dòng mới. *Luật diff-chỉ-thêm của file này là ngưỡng chết O1. Bản nháp đầu của thay đổi đã bọc dòng awk vào một khối `if` và làm DV5 đỏ; hồ sơ này ghim rằng cách đi đúng là THÊM một lớp đè, không phải sửa dòng cũ.*
- AC-4: Given máy chạy **thiếu** `node` **hoặc** thiếu `lib/ac-line.js`, When chạy `pre-merge-check.sh` trên một contract có Dấu cross-layer mà evals thiếu cặp, Then răng **vẫn** in `VIOLATION` đúng tên criterion và exit khác 0 — không tắt, không bỏ qua im lặng. *Đây là điều kiện bắt buộc để giữ khuôn awk lại. Bỏ awk đi cho "một nguồn duy nhất" sẽ tắt răng chặn trên máy thiếu node — chiều hỏng tệ nhất cho một cổng CHẶN, và đúng thứ ADR fail-closed của kit cấm.*
- AC-5: Given một lần chạy phải dùng đường lùi awk (thiếu node/lib) trên repo có **nhiều** slug, When đọc stdout, Then có **đúng một** dòng `NOTE:` khai rằng răng chấm bằng khuôn awk — một dòng cho cả lần chạy, không phải mỗi slug một dòng. *Cùng khuôn `NARROW_NET_SEEN` đã có. Bài học của cả loạt sửa này là sự lệch ÂM THẦM; một đường lùi im lặng dựng lại đúng cái bẫy đó, còn một dòng mỗi slug thì thành nhiễu và người ta học cách bỏ qua.*
- AC-6: Given dòng `NOTE:` của đường lùi, When soi nội dung, Then nó **không** chứa chuỗi `VIOLATION`. *`GPM18b3` khẳng định nhánh advisory không được in token đó; bản nháp đầu viết "a VIOLATION reported here may be spurious" và làm case ấy đỏ. Token này là hợp đồng đầu ra của script, không phải chữ tự do.*
- AC-7: Given máy chạy **có** `node` và `lib/ac-line.js`, When rút danh sách criterion mang Dấu cross-layer, Then kết quả đến từ `parseAC` của `lib/ac-line.js` chứ không phải khuôn awk — và một mutation xoá khối đè phải làm suite ĐỎ đích danh. *Không có mutation thì "đã dùng nguồn chung" là lời khẳng định, không phải phép đo: khuôn awk rộng hơn nên phần lớn fixture cho cùng kết quả ở cả hai đường, và case sẽ xanh kể cả khi khối đè bị xoá.*
- AC-8: Given thay đổi này, When chạy `sync-plugin-packages.sh --check`, Then mirror `plugins/` khớp nguồn. *Ba PR trước của cùng loạt này đều quên mirror; gói THẬT ship ra là bản mirror, nên quên nó nghĩa là bản sửa không tới được người dùng.*
- AC-9: **(judgment)** Given lõi cưỡng chế nay có **hai** đường chấm (lib khi có node, awk khi không) thay vì một, When cân nhắc đánh đổi, Then giữ hai đường là lựa chọn đúng so với bắt buộc `node`. *Đây là rủi ro thiết kế chính và nó ngược với chính luận điểm "một nguồn duy nhất" mà loạt sửa này dựa vào: verdict của cổng có thể phụ thuộc vào việc máy có node hay không. Lập luận bảo vệ: awk rộng hơn nên không bao giờ bỏ sót, chênh lệch chỉ nằm ở chấm-oan, và AC-5 bắt chênh lệch đó phải có tiếng. T3 ⇒ người phải tự phán, verdict của judge chỉ tham khảo.*

## Coverage

Quét bằng skill `morphological-scan`, preset `test-matrix`. Trục dựng từ **hình dạng
đầu vào và trạng thái môi trường**, không từ diff — chủ ý, vì đây là contract hồi tố
(xem `## Context`) và trục lấy từ diff sẽ chỉ mô tả lại thứ đã dựng.

- **Trục A — hình dạng dòng trong `## Criteria`:** criterion chuẩn `- AC-1: (cross-layer) …` | criterion có Nhãn chen giữa `- AC-1 **(cross-layer)**: …` | tham chiếu chéo văn xuôi `- **AC-5, AC-9 …** (cross-layer)` | criterion **không** mang Dấu — *[CE: bảng ba biến thể nhà viết trong `lib/ac-line.js` (838/1156 dòng thật, đo trên 170 hồ sơ) + `AC_XREF`]*
- **Trục B — trạng thái môi trường:** có node + có lib | thiếu node | có node nhưng thiếu `lib/ac-line.js` | node lỗi lúc chạy — *[CE: khuôn fail-open có tiếng của `gap-probe` / `recheck-evidence` trong chính file này]*
- **Trục C — kết cục cổng:** clean exit 0 | VIOLATION đúng tên | VIOLATION oan (phải biến mất) | NOTE đường lùi — *[CE: `GPM18` + `PM01…PM12` đã có]*
- **Trục D — ràng buộc trên chính diff:** chỉ-thêm (DV5) | mirror khớp | không đổi thông điệp cũ — *[CE: `additive-only.test.mjs`, `P30`]*

Không gian ≈ 4×4×4×3; quét **pairwise**, không tích Descartes.

**Ô lộ ra khi quét mà diff KHÔNG gợi ý:** trục B ô "có node nhưng `lib/ac-line.js`
vắng" — khác ô "thiếu node", và là ô mà `GPM18` (bản sao script không có `lib/` bên
cạnh) đang đứng. Nó thành AC-4 và AC-6.

**Ô cố ý để ngoài Core:** node cài nhưng version quá cũ để chạy `lib/ac-line.js` —
cùng họ AC-4 (đường lùi nuốt mọi lỗi `node -e` qua `2>/dev/null`), nhưng dựng fixture
đa-version tốn hơn giá trị nó mua. Ghi ở `## Notes`.

**Không criterion nào mang Dấu cross-layer** — chủ ý: kit không có surface nào cho
người dùng cuối, nên không có đường surface→API→lớp dữ liệu để bắc cầu. Dấu ấy dành
cho hồ sơ của repo tiêu thụ.

## Out of scope

- **Không gỡ khuôn awk.** Nó ở lại làm đường lùi; xem AC-4 cho lý do fail-closed.
- **Không hợp nhất phép duyệt section của awk với `lib/md-section.js`.** Khuôn awk vẫn đóng section ở `h1` trên đường lùi. Chỉ phần rút Dấu `(cross-layer)` đổi nguồn.
- **Không đụng `eval-coverage-lint.js` / `evidence-page.js`.** Đã hợp nhất ở hai PR trước của cùng loạt (đã merge).
- **Không sửa `NEG_RE`.** Đã xong ở `eb81fd3`.
- **Không đổi một chữ nào trong thông điệp `VIOLATION` hiện có** — DV5 cấm, và thông điệp là hợp đồng đầu ra mà suite grep.
- **Không dựng lớp trừu tượng "AC parser cho shell"** cho các khối awk khác trong file. Một chỗ, một lý do.

> Out of scope = scope-truth (Cổng 1 duyệt mục này).

## Notes

- **Đường lùi nuốt lỗi.** Khối đè dùng `node -e … 2>/dev/null`; mọi thất bại (node quá cũ, lib hỏng, contract không đọc được) đều rơi về awk kèm NOTE. Cố ý: cổng CHẶN không được sập vì một lỗi công cụ. Giá phải trả là ta không phân biệt được "không có node" với "node có mà chạy hỏng" — cả hai ra cùng một dòng NOTE.
- **Ba PR trước cùng loạt:** `#33` (eval-coverage-lint + W7), `#34` (evidence-page), `eb81fd3` (NEG_RE). Hồ sơ ngược: `acceptance-gate-kit#32`.
- **Sóng ký lại.** Thay đổi chạm `scripts/pre-merge-check.sh` + `tests/scripts/run-tests.sh` làm evidence của ~29 hồ sơ đã ký thành stale (`verified_commit` cũ). Đó là chi phí đã biết của một thay đổi T3 ở lõi cưỡng chế, không phải lỗi của hồ sơ này — nhưng nó phải được báo giá tại Cổng 1, không phát hiện ở Cổng Bằng chứng.
