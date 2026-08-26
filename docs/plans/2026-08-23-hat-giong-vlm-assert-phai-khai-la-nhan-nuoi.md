# Hạt giống — chip: `vlm-assert` phải khai là BẢN NHẬN-NUÔI, không phải "đã ship"

**Ngày:** 2026-08-23 · **Trạng thái:** `_acceptance/vlm-assert-khai-nhan-nuoi/opportunity.md` ·
**Hạng dự kiến:** T1 (một dòng bảng trong `docs/lai-thu-nguoi-la.md`; không chạm `lib/**`, hook,
`scripts/**`, hay lưới trước-merge).
**Sinh từ:** một agent đọc kit 23/08 để quyết chỗ đứng cho một client VLM, đọc đúng dòng này, kết
luận sai, rồi mở một hồ sơ cơ hội dựa trên kết luận sai đó (`acceptance-gate-kit` PR #96).

> Chữ trong file này là NGUỒN. Không cần hình: một dòng bảng, một phép sửa.

## Lỗ

`docs/lai-thu-nguoi-la.md:76`, bảng «Công cụ kết hợp», dòng bậc 3:

| Công cụ | Vai trong nghi thức | Cài |
|---|---|---|
| `vlm-assert.mjs` (**sẵn trong kit**) | bậc 3: VLM khác họ trả lời câu ĐÓNG trên frame | **đã ship, không cài thêm** |

Hai lời khai, cả hai gây hiểu nhầm:

1. **"sẵn trong kit"** — thứ có trong kit là `skills/acceptance/references/vlm-assert.reference.mjs`,
   một **bản tham chiếu**. Không có `vlm-assert.mjs` nào ở `scripts/` của kit.
2. **"đã ship, không cài thêm"** — sai ở ba bước. Muốn dùng phải: (a) chép sang
   `scripts/vlm-assert.mjs` của repo mình, (b) cấp `GEMINI_API_KEY`, (c) khai
   `executors.ui.vlm_assert` trong `_acceptance/config.yaml`.

Docblock của **chính file đó** khai ngược lại, rất rõ:

> *"The Acceptance-Gate Kit ships **NO API dependency** — this is a starting point you **OWN**;
> it lives in **YOUR repo** with **YOUR key**."*

Và `skills/acceptance/references/eval-executors.md:231` cũng dạy đúng đường nhận-nuôi
(`/acceptance-init` bước 3c chép sang `scripts/vlm-assert.mjs`, repo-owned).

Tức **bảng nói một đằng, hai nguồn khác nói một nẻo** — cùng lớp «con trỏ chết» mà chip B và
chip D vừa xử, chỉ khác chỗ đứng.

## Bằng chứng (23/08)

| Đo | Số |
|---|---|
| Chỗ khai `vlm-assert` là "sẵn / đã ship / không cài thêm" | **1** (`docs/lai-thu-nguoi-la.md:76`) |
| File `scripts/vlm-assert.mjs` trong kit | **0** |
| File tham chiếu có thật | 1 (`skills/acceptance/references/vlm-assert.reference.mjs`, 100 dòng) |
| Nguồn khai đúng đường nhận-nuôi | 2 (docblock dòng 12–20 · `eval-executors.md:231`) |
| Bước phải làm trước khi dùng được | **3** (chép · khoá · khai executor) |

## Thiệt hại đo được — không phải giả định

Một agent đọc dòng này ngày 23/08, kết luận «kit **đã có** VLM assert dùng ngay được», và trước
đó còn kết luận ngược lại từ một phép đo hẹp («grep `scripts/` không script nào gọi mạng» ⇒ «kit
thuần tất định»). Hai kết luận sai theo hai chiều **về cùng một sự thật**, từ cùng một chỗ mập mờ.

Hệ quả: một hồ sơ cơ hội (`con-mat-thu-hai-lai-thu`, PR #96) được mở với tiền đề *"kit chưa có
năng lực này, thêm vào là bỏ tính chất tất định"* — trong khi kit **đã có khuôn**, và khuôn đó
nói **không đưa mã có khoá vào kit**. Hồ sơ ấy nay phải sửa lại đề bài.

Đây đúng lớp lỗi mà North Star gọi tên: **bằng chứng không tự dối**. Dòng bảng làm người đọc tin
nhầm về chính cái kit đang có.

## Phép sửa — TRỪ, không CỘNG

Đổi một dòng bảng cho khớp hai nguồn kia. Đề nghị:

| Công cụ | Vai trong nghi thức | Cài |
|---|---|---|
| `vlm-assert` (**bản tham chiếu**, `skills/acceptance/references/vlm-assert.reference.mjs`) | bậc 3: VLM khác họ trả lời câu ĐÓNG trên frame — khử thiên vị cùng-họ | **nhận nuôi**: chép sang `scripts/vlm-assert.mjs` của repo bạn · `GEMINI_API_KEY` của bạn · khai `executors.ui.vlm_assert`. Kit **không** ship phụ thuộc API |

Không thêm mã, không thêm cổng, không thêm skill. Chỉ để chữ khớp vật.

## Ngoài phạm vi chip này

- **Không** đưa mã gọi API vào kit — đó là quyết định đã có, chip này chỉ làm nó đọc được.
- **Không** đổi `vlm-assert.reference.mjs` (nội dung nó đúng và docblock nó rõ).
- **Không** đụng luật «No blind VLM judge» hay khuôn câu-đóng — cả hai đang đúng.
