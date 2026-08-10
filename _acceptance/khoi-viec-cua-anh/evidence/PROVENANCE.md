# Provenance — 3 thẻ bằng chứng cho E7 (AC-7 judgment)

Cả ba file HTML dưới đây do CHÍNH `scripts/gate-card.js` của cây đang kiểm
render từ fixture code-sinh (cùng khuôn case P185/P186/P187 trong
tests/plugins/run-tests.sh), KHÔNG viết tay — luật thước-gắn-vào-vật-được-giao,
điểm B cài ở mốc 3.

- sinh tại sha: fc470f70856142bbf9cdb149f1766fe399cc30bd
- ngày: 2026-08-10T15:49:25Z
- lệnh: `node scripts/gate-card.js --root <fixture-ws> --slug fx` (fixture dựng bằng printf trong cùng lần chạy)
- p185-card-gate1.html — mode Cổng 1 (status draft)
- p186-card-gate2.html — mode Cổng 2 ký được (PENDING-JUDGMENT, đủ 4 loại việc-người)
- p187-card-gate2-reject.html — mode Cổng 2 không ký được (REJECT)
