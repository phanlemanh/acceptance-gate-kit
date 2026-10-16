# Gói `road-map` — vòng ngoài của lộ trình

Gói «mặt»: chỉ chứa lệnh cho người; mã sống ở lõi `acceptance-gate` (`scripts/lo-trinh.mjs`). Vòng 1 (hồ sơ
`ra-soat-lo-trinh`, hàng RM1) chỉ cắm cờ: máy đề xuất dời mốc · chờ điều kiện · bác kèm căn cứ, KHÔNG sửa tệp lộ trình.

## Cài cho một kho

```
claude plugin install road-map@acceptance-gate-kit --scope project
```

`acceptance-init` không tự bật gói này — kho chọn cài. Gói không có hook.

Cài xong (với `--scope project`, để lựa chọn nằm trong `.claude/settings.json` đội commit), chạy
`/acceptance-gate:acceptance-init` — chạy lại an toàn trên kho đã có cấu hình. Bước 5d của lệnh ấy tạo sẵn lộ trình
rỗng đúng khuôn ở `docs/plan/lo-trinh.json`, khai `lo_trinh.tep`, miễn trừ `LO-TRINH.html` và vẽ trang — bước kiểm CI
xanh ngay ở commit đó. Thêm việc bằng `/acceptance-gate:cat-luot`, mở vòng bằng `/feature-loop:feature-loop <mã>`.

## Lệnh

- `/road-map:xem` — bản đồ lộ trình của kho hiện tại: xong · đang dở · kế, rà soát, và các lần tự áp (chỉ đọc).
- `/road-map:ghim <mã>` · `/road-map:bo-ghim <mã>` — miễn trừ / bỏ miễn trừ một hàng khỏi tự áp (chỉ người gõ).
- `/road-map:tra-lai <mã>` — trả lại một lần máy tự áp: hàng về đúng chỗ cũ (chỉ người gõ).
- `/road-map:gui <câu>` — gửi một ý vào cửa tín hiệu của kho; được trả «đã ghi, xử ở mốc khép», không gọi ai giữa
  chừng. Kho phải khai `tin_hieu` trong `_acceptance/config.yaml`.

## Chính sách rà soát (tuỳ chọn, khai ở đầu tệp lộ trình)

```json
"chinh_sach": { "tuoi_ngay": 30, "tran_ke_tiep": 10 }
```

Vắng → chỉ ba luật sự thật (xếp lại · đã bác · mốc phát hành qua ngày). Chỉ mốc `loai: phat-hanh` được rà soát.

## Tự áp theo chính sách chiến dịch (hồ sơ `ap-chinh-sach-lo-trinh`, hàng RM2)

Chủ kho khai MỘT lần trên mốc chiến dịch (`loai: phat-hanh`) lúc cắt mốc:

```json
{ "ten": "…", "ngay": "2026-11-19", "loai": "phat-hanh", "hang": ["…"],
  "chinh_sach": { "tu_ap": true, "tuoi_ngay": 30, "tran_ke_tiep": 8, "nhip_ngay": 1, "tran_ap": 5 } }
```

Chiến dịch đang chạy = mốc phát hành gần nhất có ngày ≥ hôm nay. Chỉ khi nó khai `tu_ap: true` thì máy tự áp: báo trước
(ghi sổ, tệp không đổi) → sau `nhip_ngay` ngày, nếu đề xuất còn nguyên thì dời (tối đa `tran_ap` hàng mỗi ngày). Dời mốc →
cuối mốc đang chạy; chờ điều kiện → cuối `chan_troi`; bác → cuối `da_bac`. Mọi lần báo trước / áp / huỷ / trả lại / ghim ghi
vào `<tệp>.so.jsonl` cạnh tệp lộ trình. Máy chỉ ghi khi tệp lộ trình ở đúng dạng `JSON.stringify(…, null, 2)`; mỗi lần mở việc
từ một hàng (`/feature-loop:feature-loop <mã>`) máy tự áp trước, hàng đang mở không bị đụng.

## Chặn mở việc ngoài kế hoạch (hồ sơ `kho-cam-ket-co-lo-trinh`, hàng RM5)

Mặc định TẮT — kho tự chọn. Bật cần cả hai: gói này cài cho cả đội (`--scope project`, bật ở `.claude/settings.json`) và
một dòng `lo_trinh.chan` trong `_acceptance/config.yaml`:

```yaml
lo_trinh:
  tep: docs/plan/lo-trinh.json
  chan: true
```

Khi bật, hồ sơ mới không thuộc hàng nào bị chặn lúc ghi tệp mở hồ sơ và ở lưới trước-merge; mở vòng từ một câu mô tả thì
máy tự thêm hàng. Tắt: `chan: false` hoặc xoá dòng. Giới hạn: tệp ghi bằng dòng lệnh né được kiểm lúc ghi — lưới
trước-merge bắt lúc gộp.

Hướng thiết kế: `docs/findings/2026-10-14-kien-truc-roadmap-plugin.md` (B′) · ADR 0025.
