---
schema_version: 1
slug: vlm-assert-khai-nhan-nuoi
feature: Dòng bậc-3 của lái-thử khai `vlm-assert` là "đã ship" trong khi nó là bản tham chiếu phải nhận nuôi
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:     # ISO UTC
prototype:
  base_commit:      # không có prototype — đây là một phép TRỪ trên chữ
  disposition:
---

## Vấn đề & ai gặp

`docs/lai-thu-nguoi-la.md:76` khai `vlm-assert.mjs` là **"sẵn trong kit"** và **"đã ship,
không cài thêm"**. Cả hai sai: thứ có trong kit là một **bản tham chiếu**
(`skills/acceptance/references/vlm-assert.reference.mjs`), và muốn dùng phải qua **ba bước**
— chép sang `scripts/` của repo mình, cấp `GEMINI_API_KEY`, khai `executors.ui.vlm_assert`.

Docblock của chính file đó nói ngược lại (*"ships NO API dependency — YOUR repo, YOUR key"*),
và `eval-executors.md:231` cũng dạy đúng đường nhận-nuôi. **Bảng nói một đằng, hai nguồn
khác nói một nẻo.**

**Người gặp:** bất kỳ ai đọc bảng bậc-thang để quyết có dùng bậc 3 hay không — tức đúng
người đang chuẩn bị một ván lái-thử. Đề bài đầy đủ:
`docs/plans/2026-08-23-hat-giong-vlm-assert-phai-khai-la-nhan-nuoi.md`.

## Thiệt hại đã xảy ra, không phải giả định

Một agent đọc dòng này 23/08 và kết luận sai **theo hai chiều ngược nhau** về cùng một sự
thật: trước đó grep `scripts/` thấy không script nào gọi mạng ⇒ *"kit thuần tất định"*; sau
đó đọc dòng bảng ⇒ *"kit đã có VLM dùng ngay"*. Hệ quả: hồ sơ cơ hội
`con-mat-thu-hai-lai-thu` (PR #96) mở với tiền đề *"kit chưa có năng lực này"* — trong khi
kit **đã có khuôn**, và khuôn đó nói **không đưa mã có khoá vào kit**.

## Ngưỡng chết / ngưỡng UAT

- **Câu hỏi phép đo trả lời:** người đọc bảng bậc-thang có biết mình phải làm gì để dùng
  được bậc 3 không?
- **SỐNG:** dòng bảng nêu đủ **ba bước nhận nuôi**, và không còn chữ nào khai "đã ship /
  không cài thêm"; ba nguồn (bảng · docblock · `eval-executors.md`) khai **cùng một điều**.
- **CHẾT:** phải thêm mã, thêm cổng, hoặc thêm phụ thuộc để sửa — lúc đó nó không còn là
  phép TRỪ và phải quay lại Cổng Đáng với đề bài khác.
- **Timebox:** không cần — một dòng bảng.

## Vì sao đây là TRỪ chứ không CỘNG

Không thêm mã, không thêm cổng, không thêm skill, không đổi
`vlm-assert.reference.mjs` (nội dung nó đúng). Chỉ để **chữ khớp vật** — trace thẳng về
nguyên tố 2, *bằng chứng không tự dối*: hôm nay dòng đó làm người đọc tin nhầm về chính cái
kit đang có.
