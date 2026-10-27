# Hạt giống — lượt ghim còn lại: hết trần vẫn ghim hồ sơ đã xong · ký trên nền sẽ gộp

Gốc: `_acceptance/vung-giao-viec-tu-cat-luot/` — ô của vòng «vùng giao việc đi từ cắt lượt» (owner phê CỘNG 27/10), neo ngoài `crm/_acceptance/bo-okr-co-so`; đề bài phanlemanh/acceptance-gate-kit#430. Ô trích lại tên tệp này ở `## Notes`.

## Người dùng gặp gì

Hai lãng phí còn lại của làn ghim, đo ở crm 25–27/10:

- **Hết trần là mất trọn.** `repin-lane.mjs` dừng sớm (`ketThucSom`) không ghi pin nào, kể cả hồ sơ đã chạy xanh hết
  eval. Ba lượt hết trần (220′, 160′, 80′) đốt khoảng 7,7 trên 21,2 giờ ghim. Cờ `--tung-ho-so` chỉ tách hồ sơ đỏ khi
  làn chạy xong, không cứu lượt hết trần.
- **Ký trên nền cũ.** Mỗi hàng chấm trên nhánh chính lúc chấm, rồi gộp vào một nền đã có các hàng gộp trước — mỗi lần
  gộp làm hoá cũ các hàng còn chờ cùng vùng. Lối «ký trên nền sẽ gộp»: hàng sau chấm trên nền đã có các hàng xếp trước.

## Vì sao chưa làm

Vòng vùng giao việc xếp nối tiếp các hàng chồng vùng, nên lượt ghim chung nhiều hồ sơ ngắn lại (ít chạm trần) và hàng sau
vốn chấm trên nền đã có hàng trước. Ước phần lợi còn lại cho «ký trên nền sẽ gộp»: 0–2 giờ / 3 ngày.

## Ngưỡng mở ô

- Hết trần: ≥ 1 lượt ghim hết trần trong một đợt chạy trên bản có vòng vùng giao việc.
- Ký trên nền sẽ gộp: lần ghim / PR gộp > 0,5 ở một đợt có chồng vùng trên bản có vòng vùng giao việc.
