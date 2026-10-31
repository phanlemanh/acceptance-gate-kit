# Thiết kế — quet-het-han-khong-moi-ky (issue #463)

Gốc: issue phanlemanh/acceptance-gate-kit#463 — ở crm (380 hồ sơ) bộ quét trạng thái mất 19–22 giây, chạm trần cứng 20
giây của thẻ cổng; 7/7 thẻ cửa veto của hồ sơ `machine-cleared` mang cờ «exit null» và kết bằng ô «ký hay trả».

## 1. Một kết quả

Thẻ Cổng Bằng chứng của một hồ sơ máy đã thông không bao giờ mời ký chỉ vì bộ quét không trả lời kịp: nó vẫn kết bằng
«đi tiếp hay kéo lại», nói thẳng vì sao chưa đọc được trạng thái, và chỉ cách chạy lại. Bộ quét ở kho lớn có hạn đủ dài
để thường chạy kịp.

## 2. Ba chỗ sửa

### 2.1 Lý do bằng chữ (`scripts/han-quet.cjs` · `lyDoQuet`)

Kết quả `spawnSync` có năm hình dạng hỏng. Một hàm thuần dịch mỗi hình dạng thành một câu, không câu nào chứa
«exit null»:

| Hình dạng | Câu |
|---|---|
| `error.code === 'ETIMEDOUT'` | «bộ quét hết hạn sau <s> giây» |
| `status === null`, có `signal` | «bộ quét bị ngắt (<signal>)» |
| `status === null`, không `signal` | «bộ quét dừng mà không có mã thoát» |
| `status ≠ 0`, `stderr` có chữ | 200 ký tự đầu của `stderr` |
| `status ≠ 0`, `stderr` rỗng | «bộ quét thoát mã <status>» |
| `error` khác (không chạy được) | «không chạy được bộ quét: <message>» |

`quetHoSo()` ghi thêm `q.hetHan` để thẻ biết ca hết hạn.

### 2.2 Hạn theo cỡ kho (`scripts/han-quet.cjs` · `hanQuet`)

`hạn = max(20 000 ms, 150 ms × số thư mục trong _acceptance/)`. Kho dưới 134 hồ sơ giữ đúng 20 giây như trước; crm 380
hồ sơ được 57 giây (đo 19–22 giây, tức ~55 ms/hồ sơ — hệ số gấp ~2,7). Biến môi trường `ACCEPTANCE_SCAN_TIMEOUT_MS`
(số nguyên dương) thắng phép tính — đường cho kho tự nới và là cửa để ca đo ép hết hạn; giá trị hỏng bị bỏ qua.

Loại: chỉ quét một hồ sơ (đổi bộ quét dùng chung với bản đồ và màn khởi động — rộng hơn một vòng vá); khoá
`config.yaml` cho hạn (một CỘNG cấu hình, không cần khi hạn đã theo cỡ); làm bộ quét nhanh hơn (manh mối
`workspace-reader-unification#3` ở sổ known-limits — để vòng riêng).

### 2.3 Hồ sơ máy-thông khi bộ quét lỗi (`scripts/gate-card.js` · `MAY_DI_TIEP`)

Thêm một vế: `MAY_THONG && scanState == null && scanErr` → đi làn V (ô cuối «đi tiếp hay kéo lại: đi tiếp», nút «Kéo
lại», không nút ký). Áp cho MỌI lỗi bộ quét (hết hạn, bị ngắt, thoát lỗi), không riêng hết hạn — lối chỉ-hết-hạn để ca
bộ quét sập vẫn mời ký hồ sơ máy-thông, đúng câu hỏi sai vòng này đóng. Hai gác giữ nguyên: luật sản phẩm chặn
(`luatG2.chan`) và hồ sơ hỏng (`scanBroken` — khi bộ quét lỗi thì không biết, nên vế này chỉ dựa lời khai của hợp đồng).

Ca bộ quét chạy được nhưng kho chưa dựng cổng (`config: false`, không `scanErr`) GIỮ lối cũ đã chốt ở S4-r12: mời ký +
cờ «chưa ai kiểm sáu điều kiện».

Cờ vàng khi `MAY_THONG` và bộ quét lỗi: «⚠ Chưa đọc được trạng thái làn V — <lý do>. Thẻ trình theo lời khai «máy đã
thông» của hợp đồng; chưa ai kiểm lại sáu điều kiện xanh-sạch ở lượt dựng thẻ này. Chạy lại với hạn dài hơn:
`ACCEPTANCE_SCAN_TIMEOUT_MS=<N> node '<gate-card.js>' --root '<kho>' --slug '<slug>'`», N = max(2 × hạn đã dùng,
120 000) — đủ dài để chạy lại thật xong, kể cả khi hạn vừa dùng bị ép nhỏ.

**Hỏi-1 (chỉ người có — khẩu vị rủi ro):** khi bộ quét lỗi, thẻ của hồ sơ máy-thông (A) đi lối «đi tiếp hay kéo lại»
theo lời khai của hợp đồng + cờ vàng — khuyến nghị; hay (B) không kết ô quyết nào, chỉ nêu «chưa trình được» và lệnh
chạy lại (hỏng to). B an toàn hơn với hồ sơ khai sai, nhưng ở kho lớn thẻ cửa veto thành vô dụng cho tới khi chạy lại
với hạn dài hơn. Hồ sơ không máy-thông giữ cờ
cũ (đã nói thẻ có thể đang mời ký nhầm), lý do nay bằng chữ.

## 3. Không làm

- Làm bộ quét nhanh hơn / chỉ quét một hồ sơ.
- Khoá `config.yaml` cho hạn quét.
- Đổi thẻ Cổng 1 (nó dùng cùng `quetHoSo()` nên tự nhận hạn mới và lý do bằng chữ, nhưng không đổi lối).

## 4. Độ phủ (quét hình thái, preset test-matrix)

Ba trục: **A** kết cục bộ quét {kịp, hết hạn, bị ngắt, thoát lỗi có/không stderr, không chạy được, `config:false`} ·
**B** trạng thái hồ sơ {`machine-cleared`, `verified`} · **C** cỡ kho {0, 10, 133, 134, 380} × biến môi trường {vắng,
hợp lệ, 0, âm, chữ, rỗng}.

- A{hết hạn} × B{machine-cleared} → AC-1, AC-2; A{kịp} × B{machine-cleared} → đối chứng của AC-1.
- A{mọi hình dạng hỏng} → AC-3 (hàm thuần, ma trận sáu hàng).
- C → AC-4 (ma trận mười một hàng).
- A{hết hạn} × B{verified} và A{config:false} × B{machine-cleared} → AC-5 (đường cũ).
- Bộ cũ → AC-6.
- Never: thẻ tự đọc sáu điều kiện xanh-sạch khi bộ quét lỗi (bản dựng thứ ba của luật — lớp lỗi lan-v-khong-phai-cho-ky).
