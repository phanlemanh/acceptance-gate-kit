---
schema_version: 1
feature: Thẻ cửa veto của hồ sơ máy đã thông không mời ký khi bộ quét trạng thái không trả lời kịp — nói rõ hết hạn và cách chạy lại; bộ quét ở kho lớn có hạn theo cỡ kho
slug: quet-het-han-khong-moi-ky
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: verified
design_doc: _acceptance/quet-het-han-khong-moi-ky/design.md
approved_by: Manh Phan
approved_at: 2026-10-31T15:47:21Z
---

# Acceptance Contract: quet-het-han-khong-moi-ky

## Context

Gốc: issue phanlemanh/acceptance-gate-kit#463 — crm (380 hồ sơ) quét trạng thái mất 19–22 giây, chạm trần cứng 20 giây
của `quetHoSo()` trong `scripts/gate-card.js`; 7/7 thẻ cửa veto của hồ sơ `machine-cleared` mang cờ «exit null» và kết
bằng ô «ký hay trả». Vòng vá cho bản 2.36.2, chủ kho mở 31/10. Thiết kế: design doc ở frontmatter.

Thuật ngữ:
- **hồ sơ máy-thông xanh-sạch** = hồ sơ T2 `status: machine-cleared`, `veto_state: mo`, báo cáo PASS sáu điều kiện,
  do ca đo dựng từ khuôn hợp đồng và khuôn báo cáo của kit trong chính lượt chạy; bộ quét thật xếp nó vào khoá
  `da-giao-may-thong-veto-mo` (assert trong ca).
- **ép hết hạn** = chạy thẻ với `ACCEPTANCE_SCAN_TIMEOUT_MS=1`.
- **dòng lệnh** = khoá `one_shot` của `gate-card.js --extract`, cũng in trong thẻ HTML.

## Criteria

- AC-1: (Hỏi-1) Given một hồ sơ máy-thông xanh-sạch, When dựng thẻ khi bộ quét không trả lời được — (i) ép hết hạn,
  (ii) bản sao cây có bộ quét thoát mã 3 không stderr, (iii) bản sao cây có bộ quét tự ngắt bằng SIGKILL — Then ở cả ba
  dòng lệnh kết bằng «đi tiếp hay kéo lại: đi tiếp», thẻ HTML có nút «Kéo lại» và không chứa «ký hay trả» hay «Ký
  duyệt»; đối chứng cùng fixture với hạn mặc định: dòng lệnh cũng kết bằng «đi tiếp hay kéo lại: đi tiếp», thẻ CÓ câu
  «máy đã thông — hồ sơ này qua Cổng Bằng chứng» và không có chữ «hết hạn». Chiều đỏ: bản sao bộ dựng thẻ gỡ vế
  máy-thông-khi-bộ-quét-lỗi → hàm kiểm nêu «hết hạn mà thẻ mời ký»; bản sao chỉ nhận ca hết hạn → hàm kiểm nêu «bộ quét
  lỗi mà thẻ mời ký» ở (ii) và (iii), (i) im.
- AC-2: Given cùng hồ sơ, When ép hết hạn, Then thẻ HTML có cờ vàng chứa «bộ quét hết hạn sau» và «chưa ai kiểm lại sáu
  điều kiện», và một lệnh chạy lại rút được từ thẻ có dạng `ACCEPTANCE_SCAN_TIMEOUT_MS=<N> node <gate-card.js> --root
  <kho> --slug <slug>` với N = max(2 × hạn đã dùng, 120000), `--root` và `--slug` khớp fixture; chạy chính lệnh ấy → exit
  0 và thẻ không còn «hết hạn». Thẻ không chứa «exit null» và không chứa câu khẳng định «máy đã thông — hồ sơ này qua
  Cổng Bằng chứng» (vế dương của câu ở đối chứng AC-1). Chiều đỏ: bản sao trả lý do về `exit ${status}` → hàm kiểm nêu
  «thẻ in exit null»; bản sao in hạn đã dùng thay cho N → hàm kiểm nêu «lệnh chạy lại vẫn hết hạn».
- AC-3: Given ma trận sáu hình dạng kết quả tiến trình con viết sẵn (hết hạn · bị ngắt có tín hiệu · dừng không mã không
  tín hiệu · thoát lỗi có stderr · thoát lỗi stderr rỗng · không chạy được), When dịch bằng hàm lý do, Then mỗi hàng ra
  đúng câu viết sẵn và không hàng nào chứa «null»; ca in «số hàng: 6». Chiều đỏ: bản sao bỏ nhánh tín hiệu → hàm kiểm
  nêu đúng hàng «bị ngắt».
- AC-4: Given ma trận mười một hàng (cỡ kho 0 · 10 · 133 · 134 · 380 không biến môi trường; kho 380 với biến môi trường
  `45000` · `1` · `0` · `-5` · `abc` · rỗng), When tính hạn quét, Then lần lượt 20000 · 20000 · 20000 · 20100 · 57000 ·
  45000 · 1 · 57000 · 57000 · 57000 · 57000; cỡ kho đếm từ thư mục con thật của `_acceptance/` do ca dựng (tệp không
  tính); ca in «số hàng: 11». Chiều đỏ: bản sao bỏ vế cỡ kho → hàm kiểm nêu «380 hồ sơ: hạn 20000, cần 57000».
- AC-5: Given (a) hồ sơ `verified` PASS và (b) hồ sơ máy-thông ở kho chưa dựng cổng (không `config.yaml`), When dựng thẻ —
  (a) khi ép hết hạn, (b) với hạn mặc định — Then (a) dòng lệnh kết bằng «ký hay trả: ___» và thẻ có cờ «bộ quét hết hạn
  sau» kèm câu cũ «có thể đang mời ký»; (b) thẻ giữ «Ký duyệt» và cờ «chưa ai kiểm sáu điều kiện», không có chữ «hết
  hạn».
- AC-6: Given cây sau vòng, When chạy ca RT5 của `tests/plugins/ra-co-ten.test.mjs` (bộ quét mù giữ lối ký) và các suite
  của `feature_loop.suite_keys`, Then mọi ca xanh.

## Coverage

Quét hình thái preset test-matrix — bản đủ ở design doc §4. Ba trục: A kết cục bộ quét · B trạng thái hồ sơ · C cỡ kho ×
biến môi trường.

- A{hết hạn, thoát lỗi, bị ngắt} × B{machine-cleared} → AC-1; A{hết hạn} → AC-2; A{kịp} × B{machine-cleared} → đối
  chứng AC-1.
- A{mọi hình dạng hỏng} → AC-3. C → AC-4.
- A{hết hạn} × B{verified}, A{config:false} × B{machine-cleared} → AC-5. Bộ cũ → AC-6.
- [NGÀNH: hạn chờ tỉ lệ theo cỡ việc — timeout = sàn + hệ số × cỡ].
- Later: làm bộ quét nhanh hơn / chỉ quét một hồ sơ. Never: thẻ tự đọc sáu điều kiện khi bộ quét lỗi.

## Out of scope

- Làm bộ quét trạng thái nhanh hơn hoặc chỉ quét một hồ sơ (manh mối `workspace-reader-unification#3` ở sổ known-limits).
- Khoá `config.yaml` cho hạn quét — hạn theo cỡ kho cộng biến môi trường đã đủ.
- Đổi lối của thẻ Cổng 1 (nó dùng chung `quetHoSo()` nên tự nhận hạn mới và lý do bằng chữ).
- `CHANGELOG.md`, số phiên bản, cắt mốc — việc của chiến dịch phát hành 2.36.2.

## Notes

- Gác luật sản phẩm (`luatG2.chan`) không có ca riêng ở vòng này: nó tính từ tệp hồ sơ trước và độc lập với bộ quét,
  và vế mới nằm trong cùng biểu thức gác (gap-probe P1 deferred).
