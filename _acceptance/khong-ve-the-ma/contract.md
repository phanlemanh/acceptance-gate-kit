---
schema_version: 1
feature: Hồ sơ không có thì không vẽ thẻ quyết định
slug: khong-ve-the-ma
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-08-29T03:36:31Z
---

# Acceptance Contract: khong-ve-the-ma

## Context

Người duyệt gõ nhầm một tên hồ sơ thì bộ dựng thẻ vẫn vẽ trọn một thẻ Cổng Phạm
vi — tiêu đề là chính cái tên vừa gõ nhầm, khối việc-của-người vẫn hỏi «duyệt
hay sửa». Người được mời ký trên hư không, và không có dấu hiệu nào cho biết
hồ sơ đằng sau thẻ không tồn tại. Đây là false-green ở tầng trình bày: thứ đáng
ra phải kêu to lại im lặng trả về màu xanh.

Đo ngày 2026-08-30 trên cây này: thư mục xưởng rỗng, gõ một tên hồ sơ không có
thật → mã thoát 0 và 4201 byte thẻ. Thư mục hồ sơ có thật nhưng rỗng → cùng kết
quả. Đường `--extract` cũng trả JSON đủ khuôn với tên hồ sơ ma làm tiêu đề.

Việc này đóng lỗ đó ở hai tầng: bộ dựng thẻ từ chối dựng (chốt duy nhất giữ được
cho mọi người gọi), và lệnh trình thẻ thuật lại cho người bằng tiếng sản phẩm
thay vì render.

Source input: prompt (owner duyệt chạy 2026-08-30)

## Criteria

- AC-1: Given xưởng đã mở và thư mục `_acceptance/<slug>/` KHÔNG tồn tại, When chạy bộ dựng thẻ với tên hồ sơ đó, Then bộ dựng thoát với mã khác 0 và KHÔNG in một byte thẻ nào ra đầu ra chuẩn.
- AC-2: Given cùng điều kiện AC-1, When bộ dựng từ chối, Then thông điệp lỗi nêu ĐÚNG tên hồ sơ vừa gõ và liệt kê các tên hồ sơ CÓ THẬT đang nằm trong xưởng.
- AC-3: Given thư mục `_acceptance/<slug>/` tồn tại nhưng KHÔNG có `contract.md` — kể cả khi thư mục đó ĐÃ có `evidence-report.md` hoặc `evals.yaml`, và kể cả khi gọi `--gate 2` tường minh, When chạy bộ dựng thẻ, Then bộ dựng thoát với mã khác 0 và thông điệp phân biệt được ca này với ca AC-1 (hồ sơ có mặt nhưng chưa có bản hợp đồng, việc kế khác nhau).
- AC-4: Given thư mục `_acceptance/` chưa có `config.yaml`, When chạy bộ dựng thẻ với bất kỳ tên hồ sơ nào, Then thông điệp nói xưởng chưa mở, phân biệt được với AC-1 và AC-3.
- AC-5: Given bất kỳ ca từ chối nào ở AC-1/AC-3/AC-4, When chạy bộ dựng ở chế độ `--extract`, Then bộ dựng cũng từ chối với cùng mã thoát và cùng thông điệp — chốt nằm trước cả hai đường ra, không chỉ đường render.
- AC-6: Given một hồ sơ ĐỦ (có `contract.md`), When chạy bộ dựng thẻ như trước nay, Then thẻ vẫn dựng nguyên vẹn với mã thoát 0 và vẫn chứa hai khối cam kết «Hệ thống SẼ làm» / «Sẽ KHÔNG làm» — chốt mới không cắt mất đường sống.
- AC-7: Given lệnh trình thẻ nhận một tên hồ sơ không tồn tại, When lệnh chạy bước tiền đề và bộ dựng từ chối, Then thân lệnh chỉ dẫn KHÔNG render thẻ, KHÔNG ghi `card.html`, và thuật lại cho người bằng tiếng sản phẩm — và bước tiền đề phải đứng TRƯỚC mọi bước render và mọi bước ghi `card.html` trong thân lệnh (quan hệ thứ tự, không chỉ sự có mặt của câu chữ).
- AC-8: Given thân lệnh dạy người đọc nhận ra ba ca từ chối, When so thân lệnh với mã nguồn bộ dựng, Then MỖI chuỗi hằng khai trong bộ dựng ghép CẶP một-đối-một với một lời thuật riêng trong thân lệnh, và số lời thuật bằng đúng số hằng — hai bên không trôi khỏi nhau, và ba ca không bị gộp thành một câu chung.

## Coverage

Quét theo hai trục rời rạc; tích hai trục là đủ vì chốt đặt trước mọi nhánh
đường ra, nên trạng thái hồ sơ và đường ra độc lập nhau.

- Trục trạng thái xưởng/hồ sơ: xưởng chưa mở (AC-4) | thư mục hồ sơ vắng (AC-1, AC-2) | thư mục có nhưng thiếu bản hợp đồng (AC-3) | thư mục CÓ bằng chứng nhưng vắng bản hợp đồng (AC-3 — ca này đi đường đoán-cổng khác hẳn ba ca kia) | hồ sơ đủ (AC-6) — năm giá trị vét cạn các nhánh mà bộ dựng phân biệt được bằng hệ thống tệp.
- Trục đường ra của bộ dựng: render mặc định tự đoán cổng (AC-1, AC-3, AC-4, AC-6) | `--gate 2` tường minh (AC-3) | `--extract` (AC-5) — hai đường ra duy nhất script khai; `--plain` là lớp phủ chạy SAU chốt nên không đẻ nhánh mới. [thước CE: danh sách cờ ở khối `Usage` đầu `scripts/gate-card.js`]
- Trục tầng chốt: bộ dựng (AC-1..AC-6) | thân lệnh trình thẻ (AC-7, AC-8) — hai tầng do người quyết ở thiết kế, không phải hai bản sao của một chốt.

## Out of scope

- KHÔNG đụng `scripts/evidence-page.js`: đã kiểm 30/08, nó đã fail-closed (thiếu bản báo cáo bằng chứng → mã thoát 2, không sinh trang). Sửa câu chữ của nó cho «đẹp hơn» là mở phạm vi không có lỗ đằng sau.
- KHÔNG gợi ý sửa-tên kiểu đoán gần đúng («ý anh là …?»). Liệt kê tên có thật là đủ để người tự nhận ra; đoán gần đúng đẻ ra một lớp lỗi mới (đoán sai làm người gõ theo).
- KHÔNG đụng `start-scan.mjs`, `trang-thai-ho-so.cjs`, `commands/approve.md`, `commands/signoff.md` — quét lớp 30/08 cho thấy ba chỗ này không có cùng lỗ (một bên liệt kê mọi hồ sơ nên không nhận tên đơn lẻ, một bên thuần dữ liệu, một bên đã có bước tiền đề).
- KHÔNG sửa ca đo `evals/thieu-ho-so-khong-ve-the-ma/` cho khớp hành vi mới. Ca đó ghim hành vi ĐÚNG và được viết trước bản vá; sửa nó là hạ thước cho vừa vật.
- KHÔNG chờ `claude plugin eval` được bật để nghiệm thu. Tầng ca đo skill hiện trơ (org chưa bật early access); vòng này nghiệm thu bằng bộ kiểm thường trực.

## Notes

- Hạng T2: `scripts/gate-card.js` và `commands/acceptance-card.md` đều ngoài `t1_skip_globs`, và không nằm trong `t3_paths` (lõi cưỡng chế là `hooks/**`, `lib/**`, `pre-merge-check.sh`, `recheck-evidence.cjs`).
- Câu chữ của thông điệp lỗi ở bộ dựng là MẶT MÁY theo chính bản luật ngôn ngữ mặt người (`skills/acceptance/references/human-facing-language.md` liệt «thông điệp lỗi của script» vào cột KHÔNG ÁP, nơi tên chính xác là bắt buộc). Tiếng sản phẩm sống ở tầng thân lệnh — AC-7.
- Giả định đã khai: hồ sơ thiếu `contract.md` thì từ chối kể cả khi có `evidence-report.md`. Bản hợp đồng là xương sống; thiếu nó thì tiêu đề thẻ chỉ là tên người vừa gõ. Quét 30/08: không người gọi thật nào trong cây trông chờ mã thoát 0 ở ca này.
- **Giới hạn đã khai của tầng thân lệnh (AC-7, AC-8):** hai tiêu chí này đo VĂN BẢN của thân lệnh — sự có mặt, quan hệ thứ tự, và phép ghép cặp — chứ KHÔNG đo một lượt chạy thật của lệnh. Tầng đo được đầu ra thật ở đây là ca đo skill (`evals/thieu-ho-so-khong-ve-the-ma/`, chấm `last_message`), và tầng đó đang TRƠ: `claude plugin eval` chưa được bật cho org. Đây là giới hạn ĐÃ KHAI, không phải bất định: cái không đo được đã gọi đúng tên và có sẵn đường đo khi harness mở.
