# Hạt giống — suite scripts của kit đã qua trần 600 s của công cụ chạy lệnh trong tác tử chấm

**Ngày:** 2026-09-22 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Việc ĐẦU TIÊN của cửa sổ kế** (owner gọi tên)
Gốc: _acceptance/release-2-18-1 — Known limit 4: suite scripts chạy **601 s** trên cây của chính mốc, qua trần 600 s.
Gốc: _acceptance/ho-so-khep-thoi-hoi — round 1 BLOCKED (`e325b918`): công cụ ngắt suite scripts ở 600 s; run-log `round-tally` ghi 1 lượt bị hạ tầng đốt.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Ca thật

| Cây | suite scripts |
|---|---|
| trước vòng `ho-so-khep-thoi-hoi` (`ba62e0bb^`) | 528 s |
| S3 xong (`3cc26b16`) | 581 s → round 1 BLOCKED (tám tác tử song song đẩy qua trần) |
| sau khi rút HK-AC5-note 50 → 25 s | 595 s (làn ghim lại 22/09 07:47) |
| cây mốc 2.18.1 (`5f289b05`) | **601 s** |

Trần 600 s là của công cụ chạy lệnh trong tác tử chấm (Bash tool), không phải của kit. Hệ quả: mọi
vòng kit kế tiếp thêm ca vào suite này gần như chắc chắn BLOCKED ở lượt chấm đầu, tức mỗi vòng
trả thêm ≈ 27 phút máy và một lượt chấm lại — dòng 3 và dòng 5 của luật (c) xấu đi vì hạ tầng,
không vì vật.

## Dạng nghiệm đúng tầng (biến bất biến từ lời sang vật máy giữ)

1. **Lệnh tự khai thời lượng, làn tự chọn cách chạy.** Eval/suite khai `timeout` hoặc làn đo được
   lần chạy trước > 80 % trần công cụ → làn S4 chạy lệnh ấy **nền có chờ** (không qua Bash tool
   trong tác tử), như Kit-vòng đã làm tay ở round 2. Không dặn lời; làn đọc số.
2. **Tách suite scripts thành mảnh** chạy song song ở các làn riêng, mỗi mảnh < 300 s — bộ chạy đã
   có nhóm (Kit-vòng đo 22/09 03:18 «xem bộ chạy có hỗ trợ chia nhóm không»).
3. **Cắt ca đắt:** ba ca lâu nhất (HK-AC5-note từng 50 s; LM20 ≈ 105 s) — đo bằng thời gian từng
   ca (bộ chạy in), không đoán.

Ngưỡng mở ô: **đã đủ** (1 lượt chấm bị đốt + số đo 601 s). Không phải CỘNG: 1–3 đều TRỪ hoặc đổi cách
chạy, không thêm luật. Chiều đỏ của phép đo mới: chạy suite trên cây có một ca giả ngủ 700 s → làn
KHÔNG BLOCKED; gỡ cơ chế → BLOCKED như hôm nay.
