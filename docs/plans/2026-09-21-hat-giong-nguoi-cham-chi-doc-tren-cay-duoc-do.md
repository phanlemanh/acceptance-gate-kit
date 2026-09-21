# Hạt giống — Cưỡng chế người chấm CHỈ ĐỌC trên cây được đo: ghi ngoài `.acceptance-runs/` là lỗi làn, không phải phát hiện

**Ngày:** 2026-09-21 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T3
(chạm khuôn agent chấm của `acceptance-verify`).
Gốc: crm/_acceptance/ho-so-khai-dung-tieng — K4 + §4.5 của
`crm:docs/findings/2026-09-20-retro-hang-muc-khai-dung-tieng.md`.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Lỗ

Vòng 4: agent chấm `ui-check` của E9 **tự viết** `_e9-verify-capture.mjs` vào `rang/` của cây
đang được đo. E10 chạy song song, khẳng định «cây không đổi», thấy tệp lạ và báo:

```
phép phá rò rỉ ra khỏi bản sao
```

Thông điệp **sai hoàn toàn về nguyên nhân**. Thủ phạm không phải chân đo mà là **người chấm** —
cùng lớp với `[cay-bi-cham]` của E3 ở vòng trước, khác thủ phạm.

Kit CÓ luật «tạo phẩm phải ra `.acceptance-runs/`». Luật ấy sống bằng **lời dặn trong prompt**,
không được cưỡng chế lên agent — đúng thứ hiến pháp kit cấm: dặn-bằng-lời làm nghiệm.

## Việc

Biến bất biến từ đầu-người sang vật-máy-giữ. Hai lối, đúng tầng:

- agent chấm chạy trên bản sao **chỉ-đọc** (quyền tệp, hoặc worktree tách), mọi ghi rơi vào
  `.acceptance-runs/` theo cấu hình; hoặc
- chụp dấu cây trước/sau mỗi agent chấm; cây đổi ngoài `.acceptance-runs/` → verdict
  **`LANE-ERROR`** có tên riêng, KHÔNG trộn vào phát hiện về vật.

Vế thứ hai quan trọng hơn vế thứ nhất: một lỗi làn bị đọc thành phát hiện về sản phẩm sẽ ăn một
lượt chấm và dẫn người đi sai hướng.

## Ngưỡng mở ô

Đã có một ca thật ở kho tiêu thụ, nhưng chưa đo ở kit. Mở khi: ≥1 lượt chấm của kit bị hạ tầng
đốt vì agent chấm ghi vào cây (dòng 3 của luật (c) đã đếm số này sẵn) — hoặc owner gọi tên.
