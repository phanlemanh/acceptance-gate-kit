---
schema_version: 1
slug: khung-dot-dinh-vi
feature: Khung đợt mở bằng định vị và đếm đủ mọi câu đang chờ chủ kho — chủ kho ngủ dậy hay đổi máy đọc một khung là biết đợt đang ở đâu và đang chờ mình điều gì
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:
decided_by:
decided_at:
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Gốc: acceptance-gate-kit/_acceptance/trang-thai-dot-dieu-phoi-tho/ — hồ sơ đã dựng khung trạng thái đợt (dải trên ô
nhập + pane «Đợt», ký 12/10). Vật của nó là đúng chỗ hỏng: dải đếm «cần anh» chỉ bằng tệp chờ người của phiên thợ cộng
lời báo sức khoẻ máy, và pane in nguyên chữ của lệnh `xem` (dòng gỡ lỗi cho máy đọc). Bằng chứng: ADR 0027 (28/10),
đoạn «Vì sao», lỗ (iii).

Người đau là chủ kho, ở hai lúc:
- **Bộ đếm sai.** 28/10, phiên giám sát của một kho tiêu thụ chờ chủ kho xác nhận một chẩn đoán trong chat, mà dải vẫn
  báo «cần anh 0». Câu giám sát hỏi trong chat không vào sổ nào: hook chờ người chỉ ghi cho phiên thợ, nên phiên giám
  sát không bao giờ được đếm. Báo thiếu là lỗi đúng-sai, không phải lỗi trình bày.
- **Khung không định vị.** Ngủ dậy hay đổi máy, chủ kho mở pane «Đợt» và đọc thấy khe máy, chữ không dấu, giờ UTC có
  mili-giây, mã hàng trần. Không có mục tiêu đợt, không có tiến độ gộp, không nói việc đang chờ anh là gì và ở phiên
  nào. Cùng lỗ ở chỗ khác: 12/12 lời mời cổng của đợt design-floor 27/10 mở bằng mã trần (FL1–FL4). Phần lời mời cổng là
  bước (c) của ADR, không thuộc vòng này.

**Vì sao neo vào hồ sơ này, không vào hồ sơ đợt design-floor:** hồ sơ đợt design-floor (`design-floor-moc-s0-s1` …)
là bằng chứng cho bước (c) — lời mời cổng. Vòng này sửa bộ đếm và khung, và cả hai do hồ sơ
`trang-thai-dot-dieu-phoi-tho` dựng; giới hạn (1) của hồ sơ ấy («chưa ai nhìn thấy dải trên app desktop») chính là lý
do chữ của pane chưa bao giờ được đọc như chữ cho người.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Câu chờ chủ kho của giám sát ghi được vào sổ chung bằng một kiểu riêng mà Monitor của giám sát (lọc `"can_phan":true`) không thức | giám sát tự đánh thức bằng câu của chính nó, mỗi câu một lượt thừa | chạy đúng lệnh lọc của Monitor trên dòng sự kiện máy sinh; đếm dòng lọt | Chưa thử |
| 2 | Tên việc đọc được từ tệp lộ trình qua `tep` + `ma` của hàng thi công (khoá `ten_ngan`) cho phần lớn hàng của một đợt thật | khung vẫn in mã trần, cờ vàng khắp nơi | đếm trên fixture đợt crm và lộ trình kit: hàng có mã → có `ten_ngan` | Chưa thử |
| 3 | Kho không có giám sát đặt câu trong chat thì dải và dòng `xem` y như 2.34.0 | đổi mặc định — mọi kho trả giá (luật 26/09) | ca vi phân: cùng thư mục đợt không sự kiện mới, bản cũ vs bản mới cho cùng chữ | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: chủ kho mở khung đợt sau một đêm hay sau khi đổi máy có biết ngay đợt đang ở đâu và đang chờ mình điều gì ở phiên nào, mà không phải hỏi phiên giám sát không?
- Kết quả nào là SỐNG: [đề xuất] phát lại ca 28/10 bằng fixture: khung báo «CẦN ANH: 1» kèm câu của giám sát và tên phiên; mọi việc trên khung của fixture đợt crm mang tên từ lộ trình hoặc cờ vàng «chưa có tên», 0 dòng «là gì» chỉ có mã; ở đợt thật đầu tiên chạy bản mang vòng: 0 lần dải báo «cần anh 0» khi sổ còn câu treo, và 0 lần chủ kho hỏi giám sát «còn chờ anh gì»
- Kết quả nào là CHẾT: [đề xuất] Monitor của giám sát thức vì câu của chính nó; dòng `xem` đổi một byte ở kho không có câu treo; phải thêm một cổng người hay một lượt gọi người
- Timebox: [đề xuất] phần phát lại chốt ở Cổng Bằng chứng của vòng này; phần đợt thật — 14 ngày sau khi crm cài mốc mang vòng (mốc phát hành kế, dự kiến 31/10), quá hạn mà chưa có đợt nào thì đọc lại ô

## Kết quả prototype

Chưa dựng.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Khung trạng thái đợt (dải, pane, `xem --json`) | `dieu-phoi/scripts/khung.mjs`, `dieu-phoi/scripts/mo-hinh.mjs`, `dieu-phoi/hooks/mod/khung.ts` (hồ sơ `trang-thai-dot-dieu-phoi-tho`) | vật — sửa | có | — |
| Bốn chân của một quyết định, thứ tự dựng (a)–(b) | `docs/adr/0027-bon-chan-cua-mot-quyet-dinh-cua-nguoi.md` | căn cứ + phê CỘNG | có | Manh Phan (28/10) |
| Tên ngắn của hàng lộ trình (`ten_ngan`) | `scripts/lo-trinh.mjs` (`tenNganHang`) | nguồn tên | có | — |

## Cổng 0

- **decision = …** (chưa ký)
- **disposition = …** (chưa dựng prototype)

## Notes

**Phê duyệt CỘNG (ADR 0018):** chủ kho phê 28/10/2026 qua ADR 0027, nguyên văn: «Ghi ADR bốn chân; chân định vị dựng
trước trên khung đợt, kèm sửa bộ đếm «cần anh».» Đây là phê CỘNG, không phải chữ ký Cổng Đáng.

**Ranh giới:** chỉ bước (a) và (b) của ADR 0027. Không đụng lời mời cổng, thẻ Cổng Đáng, tác động mỗi lối, dự đoán kín,
ký theo chính sách — các bước (c)–(f) chịu luật chiều rộng (b), đi sau mốc kế tiếp được một kho tiêu thụ nhận. Dòng
`xem` giữ nguyên cho máy đọc.

**Dự báo năm dòng số (luật c):** thời gian làm-xong→gộp-được = (↓ nhẹ sau đêm: chủ kho thấy việc chờ mình sớm hơn) ·
lượt gọi người = · vòng bị hạ tầng đốt lượt chấm = · token máy/vòng ↑ nhẹ (giám sát ghi thêm một dòng mỗi câu) ·
phút máy/lượt chấm =. Điều kiện tin cậy: đường verdict không đổi thành phần.
