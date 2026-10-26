# Hạt giống — chạy các lệnh suite của kho tại chỗ trước khi gửi lượt chấm

**Ngày:** 2026-10-26 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T2 (bước cuối S3 trong SKILL
feature-loop + một lệnh máy, không LLM).
Gốc: crm/_acceptance/trang-thai-tin-hieu-song — đường nền chạy 3 phút trước S4 trên cây của vòng đã báo suite app
đỏ, lượt chấm vẫn được gửi và REJECT vì đúng lệnh ấy.
Gốc: crm/_acceptance/khung-soan-chan-lien-ket — verify từng task chỉ chạy tệp đoán là liên quan; suite đỏ ở bài gác
quy ước của kho, lượt REJECT riêng vì nó.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/thuoc-giao-dien-chay-thu-truoc-cham/` (ô đã xếp lại 26/10) trích
lại tệp này.
Số đo: `docs/findings/2026-10-26-bo-cham-giao-dien-dem-lai.md` §6.

## Ca thật (đếm 26/10, crm `6adaf11e0`, 179 vòng giao diện, 04/09–22/10)

87 lượt chấm phụ có lệnh suite của kho đỏ; **35 lượt bị đốt RIÊNG vì suite** (bỏ lỗi suite đi thì lượt đã PASS),
và ≥ 8 lượt trong số đó kéo theo một lượt gọi chủ kho.

| Lớp | Lượt | Đốt riêng | Gỡ bằng |
|---|---|---|---|
| Vật của vòng làm suite đỏ — hành vi sai thật | 15 | 3 | chạy suite tại chỗ cuối S3 |
| Vật của vòng làm vỡ bài gác quy ước của kho | 13 | 9 | chạy suite tại chỗ cuối S3 |
| Lint / kiểu / định dạng / rác máy sinh | 25 | 9 | chạy suite tại chỗ cuối S3 |
| Test của chính vòng viết sai | 3 | 1 | chạy suite tại chỗ cuối S3 |
| Chập chờn / tải phía kho | 17 | 8 | chạy lại một mình một lần trong S4 (Đ4 của làn ghim lại, S4 chưa có) |
| Đỏ sẵn trên nền / do nhánh chính | 7 | 4 | suite đỏ → chạy cùng lệnh trên merge-base trong cùng lượt; S4 hiện bỏ baseline cho lệnh suite |
| Hạ tầng kit (tin người lọt vào tác tử, output bị cắt) | 2 | 1 | — |
| Không đủ chứng | 5 | 0 | — |

So với vòng bộ chấm giao diện vừa xếp lại (kit sửa được ≈ 5 lượt): riêng dòng «chạy suite tại chỗ cuối S3» là
**22 lượt đốt riêng** trong cùng cửa sổ.

## Lỗ

SKILL feature-loop S3 bước 3: «KHÔNG tự chạy evals trong main loop — dispatch Workflow S4 NGAY». Luật ấy nói về
eval (doer ≠ grader); nó không nhắc `suite_keys`, nhưng không có bước nào bảo chạy chúng. Lệnh suite là lệnh của
kho, không phải thước của vòng, nên chạy chúng trước S4 không phá doer ≠ grader. Đường nền (`duong-nen.mjs`) chạy
suite một lần ở S1 trên cây chưa đụng và chỉ lên thẻ Cổng Phạm vi; không có phép so lúc gửi S4.

## Hướng (chưa phải thiết kế)

1. Cuối S3, trước khi đặt `implemented`: chạy `feature_loop.suite_keys` tại chỗ (cùng lệnh S4 sẽ chạy); đỏ → về S3,
   không gửi S4. Không LLM, không ghi vào hồ sơ như bằng chứng.
2. Trong S4: lệnh suite đỏ → chạy lại một mình một lần (đúng luật Đ4 đã có ở `repin-lane.mjs`); đạt → ghi chập chờn.
3. Trong S4: lệnh suite vẫn đỏ → chạy cùng lệnh trên merge-base; đỏ cả hai phía → «đỏ sẵn», không REJECT vật.

Vế 1 là TRỪ chi phí (bỏ một lượt S4) nhưng là bước mới của nghi thức; vế 2–3 nối cơ chế đã có vào chỗ chưa có.
Cân trên mọi kho (luật 26/09): kho có suite dài hàng chục phút trả thêm phút máy ở cuối S3 — cần đo phút suite của
từng kho trước khi chốt vế 1 là mặc định hay bật theo lựa chọn.

## Ngưỡng mở ô

Chủ kho gọi tên (luật chiều rộng (b) — suất vòng meta của cửa sổ 2.34.0 → mốc kế đang do `design-gate-che-do-chat`
giữ), hoặc mốc kho nhận kế tiếp đã cắt mà đếm lại vẫn ≥ 10 lượt đốt riêng vì lớp «vật của vòng làm suite đỏ / lint»
trong 14 ngày ở bất kỳ kho nào.

Liên quan: `docs/plans/2026-10-03-hat-giong-suite-chap-chon-ho-so-khac-khoa-the.md` (vế 2, chập chờn ở hồ sơ khác).
