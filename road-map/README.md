# Gói `road-map` — vòng ngoài của lộ trình

Gói «mặt»: chỉ chứa lệnh cho người; mã sống ở lõi `acceptance-gate` (`scripts/lo-trinh.mjs`). Vòng 1 (hồ sơ
`ra-soat-lo-trinh`, hàng RM1) chỉ cắm cờ: máy đề xuất dời mốc · chờ điều kiện · bác kèm căn cứ, KHÔNG sửa tệp lộ trình.

## Cài cho một kho

```
claude plugin install road-map@acceptance-gate-kit --scope project
```

`acceptance-init` không tự bật gói này — kho chọn cài. Gói không có hook.

## Lệnh

- `/road-map:xem` — rà soát lộ trình của kho hiện tại (chỉ đọc). Cùng danh sách in trên thẻ `/acceptance-gate:start`.

## Chính sách rà soát (tuỳ chọn, khai ở đầu tệp lộ trình)

```json
"chinh_sach": { "tuoi_ngay": 30, "tran_ke_tiep": 10 }
```

Vắng → chỉ ba luật sự thật (xếp lại · đã bác · mốc phát hành qua ngày). Chỉ mốc `loai: phat-hanh` được rà soát.

Hướng thiết kế: `docs/findings/2026-10-14-kien-truc-roadmap-plugin.md` (B′) · ADR 0025.
