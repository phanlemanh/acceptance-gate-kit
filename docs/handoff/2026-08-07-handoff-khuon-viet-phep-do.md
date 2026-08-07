# Handoff 2026-08-07 — sang máy A: mở chương trình "khuôn viết phép đo"

> Người nhận: phiên Claude Code trên máy A (repo clone từ origin/main).
> Memory phiên là của-từng-máy, KHÔNG đi theo git — file này tự đủ.

## Trạng thái kho lúc bàn giao

- Nhánh chính đã đẩy tới `ef27d85` (kiểm bằng `git log --oneline -1` sau pull).
- **Xưởng sạch:** 29 việc signed-off, 0 cổng chờ, 0 vòng dở, 0 hồ sơ hỏng,
  bản đồ khớp, `pre-merge-check --base e32e3e6` clean, 6/6 lệnh kiểm xanh.
- Re-pin mới nhất: `repin-20260807-merge-wru-triage-lane1 @ 7d6f427` (#11).
- Bản: acceptance-gate **1.38.0** · feature-loop **1.26.0**.

## Hôm nay đã ký (07/08, mỗi việc 2 vòng máy)

1. **`stop-patching-law`** (feature-loop 1.26.0) — mệnh đề giữa cặp mốc
   `STOP-PATCHING-CLAUSE` trong CẢ HAI bản chỉ dẫn: vòng sửa thứ hai còn lỗi
   CÙNG LỚP ⇒ khuôn giải sai → DỪNG, trình người ba đường. Hành vi đã đo bằng
   4 lượt agent context sạch (bản có luật dừng + nêu ba đường; bản gỡ luật
   dispatch tiếp).
2. **`workspace-reader-unification`** (acceptance-gate 1.38.0) — bảng luật
   đọc hồ sơ phủ 4 file (`lib/workspace-record.js`), một bảng nhãn bản đồ +
   một hàm `mapTracked` cho mọi bên đọc, P123 lên 573 tổ hợp. Ký kèm 4
   known-limits (đáng nhớ: nhãn "đã xoá" nói sai với kho vừa bật bản đồ lần
   đầu — #107; thẻ hứa "chờ lâu nhất lên đầu" sai khi `since` rỗng — #106).

## Việc kế — ĐÃ PHÂN TÍCH, CHỜ MỞ: chương trình 2 bước

**Bước 1 (a) — khuôn viết phép đo** (slug gợi ý: `measure-birth-certificate`
hoặc tên tốt hơn từ brainstorm): mọi phép đo MỚI phải tự chứng minh nó biết
báo ĐỎ ngay lúc khai sinh — đối chứng dương xanh + ≥1 lượt phá-vật-thật
đổi-được-kết-luận + thông điệp ghim — trước khi được tính là xong.

Bằng chứng (ba nguồn độc lập, đều trong kho):

- Hiến chương 80/20 §7.3 (`docs/plans/2026-08-05-nang-cap-8020-graph-loop.md`):
  11 vòng máy tiêu vì thước sai; luật hiện đặt ở khâu *duyệt* kế hoạch đo,
  chỗ thủng ở khâu *viết*.
- Chính hôm nay: 4/6 lỗi-trong-hợp-đồng bị vòng soi trả lại là lỗi thước
  MỚI VIẾT (chưa-bao-giờ-chạy · hằng-đúng hai-vế-cùng-nguồn · mớm đáp án vào
  câu hỏi chấm · mutant chấm bằng bản chép riêng), dù mọi lớp đã có tên trong
  sổ bài học — "biết không đủ để tránh".
- Bản rà 108 known-limits (`docs/research/2026-08-07-known-limits-pattern-scan.md`):
  quá nửa sổ (~55–60 mục) là nợ-của-THƯỚC; nhịp sinh ≈ nhịp dọn nên tồn kho
  đứng yên là kịch bản tốt nhất — muốn giảm phải chặn TẠI NGUỒN.

**Ràng buộc thiết kế đã chốt qua bài học cũ (đừng lật lại nếu không có lý do
mới):** khuôn là THỦ TỤC LÚC VIẾT — mệnh đề có mốc trong SKILL (mẫu
`STOP-PATCHING-CLAUSE` vừa chứng minh đo được hành vi bằng lượt đóng vai) +
khuôn mẫu trong references — KHÔNG phải chốt máy tự cưỡng chế: hai chốt meta
kiểu đó đã bị GỠ ở `measure-teeth-cleanup` vì "mỗi chốt cưỡng chế lại cần một
chốt cho chính nó" (xem decisions + memory của vòng đó).

**Bước 2 (b) — dọn nợ bằng chính khuôn đó:** 13/50 khối trong
`tests/plugins/run-tests.sh` chưa có dấu hiệu đối chứng vật-hỏng (đếm thô
bằng grep mutant/đối-chứng theo khối — đếm lại chính xác khi làm); kèm lô
known-limits làm-phép-đo-mất-răng (bản rà 108 mục đã gom sẵn theo lớp — dùng
nó làm danh sách, đừng rà lại từ đầu). Cũng theo bản rà: **25–35% sổ là nợ đã
chết** — bước (b) nên gạch sổ các mục đã đóng trước khi dọn, kẻo dọn thừa.

KHÔNG mở hai bước song song: cả hai chạm engine + lưới kiểm → stale-cascade
lẫn nhau. Bước 1 xong, ký, re-pin, rồi mở bước 2.

## Cách mở trên máy A

```bash
git pull && bash scripts/pre-merge-check.sh --base origin/main~1 | tail -1
```

Rồi `/feature-loop khuôn viết phép đo — mọi phép đo mới phải tự chứng minh
biết báo đỏ trước khi tính là xong` (S0 sẽ chấm tier; dự kiến T2 vì chạm
SKILL feature-loop + references + suite).

## Cạm bẫy vận hành phải nhớ (trả giá rồi, đừng trả lại)

- **Sửa 2 file SKILL có mốc `STOP-PATCHING-CLAUSE`** (feature-loop + codex)
  → PHẢI chạy lại `node _acceptance/stop-patching-law/make-record.mjs` rồi
  commit 5 file evidence sinh lại, kẻo suite đỏ với thông điệp chẩn đoán sai
  (known-limit đã ký của stop-patching-law).
- **Dòng re-pin** phải JSON NÉN `separators=(",",":")` + section `### Re-pin
  lần N` + `verified_commit` trỏ sha làn — thiếu nửa nào pre-merge cũng đỏ.
- **P42/P45 là khối inline** — `ONLY_BLOCK` không lọc được chúng, mỗi lần chạy
  suite plugins trả thêm ~2 lượt suite lồng (~25ph tổng); chạy suite trọn ở
  nền, đừng chạy chẩn đoán lặt vặt bằng cả suite.
- Commit chữ ký cổng phải TÁCH riêng (repo bật `signoff.require_human_commit`);
  `git add` đích danh, không `-A`.
- Máy này còn 1 file local chưa commit: `docs/handoff/2026-08-04-buc-tranh-tong-the.html`
  (sửa từ trước phiên, không thuộc bàn giao này — để nguyên).
