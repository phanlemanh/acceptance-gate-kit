---
schema_version: 1
slug: phan-du-bo-cuc-moi-vong-bon
feature: «53 khoá bộ kiểm còn thiếu ở cây đã dọn nhà (K4-MP 43 · K4-TB 6 · K4-DN 4) đạt ở cả bố cục hôm nay lẫn plugins/<tên>/»
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build               # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: manh
decided_at: 2026-11-17T00:45:00Z   # chủ kho gõ «Mở vòng bốn» sau khi đọc lượt đo B2 sáng 17/11; phiên giữ đợt chuyển lời, máy ghi hộ
prototype:
  base_commit:
  disposition:
---

> Mở 17/11/2026. Chủ kho gọi tên vòng ở phiên giữ đợt «chuyển nhà» bằng câu «Mở vòng bốn», sau khi đọc lượt đo B2 trên
> `3341b8dc`. Thay đổi đi theo mốc 3.0: **không cắt số, không gắn thẻ** ở vòng này.

## Vấn đề & ai gặp

Gốc: kit/_acceptance/phan-du-bo-cuc-moi-vong-ba/ — vòng ba; «Out of scope» của hợp đồng ấy để K4-DN ngoài vòng, và lượt
đo của B2 sau khi vòng ba gộp (#506) còn thiếu khoá ở hai cụm vòng ba đã nhận (K4-MP, K4-TB).

**Số NHẬN LẠI từ B2** (lượt đo 17/11, cây kịch bản `32a5506f` so cây cũ `3341b8dc`, `migration/viec-kho-cu-b2.md` §4.5 và
`ket-qua/phan-du-luot-8.tsv` ở nhánh B2 `0ab6f720`, chưa đẩy): cây mới thiếu **57 / 5 802** khoá.

| Cụm | Thiếu | Tệp | Vòng này |
|---|---|---|---|
| K4-MP | 43 | `tests/scripts/bo-cuc.test.mjs` | nhận |
| K4-TB | 6 | `khoi-khuon-tren-the-cong.test.mjs` (KK-6, KK-6-do + khoá tệp) · `khuon-loi.test.mjs` (KL-8, KL-8-do + khoá tệp) | nhận |
| K4-DN | 4 | `additive-only.test.mjs` (DV5 + khoá tệp) · `can-cu-s1.ca.mjs` (KK-6 so-that + khoá tệp) | nhận (chủ kho giao) |
| K4-LT + B2 | 4 | CT-10-do, KM-1 và hai khoá cấp tệp theo chúng | lúc mở: không — việc của kịch bản B2. Sau khi mở (17/11): phiên B2 chuyển lời chủ kho «Đưa hai dòng sửa vào vòng bốn ở kho cũ» — nhận, chờ chủ kho xác nhận ở Cổng Phạm vi (Hỏi-5) |

**Số ĐO ở kho này** (17/11, bản sao cây kịch bản `32a5506f` dựng ở thư mục tạm, chỉ đọc kho B2; chi tiết design §2): nguyên
nhân B2 ghi là ĐỌC từ nhật ký; chạy lại từng tệp cho ba chỗ khác với lời đọc ấy.

**Ai trả giá:**
- **Phiên B2 và Cổng Bằng chứng của B2** — 53 khoá là 93 % phần còn thiếu; không có vòng này B2 chỉ còn lối «bỏ khoá có lý do».
- **Ngày cắt sang (hạn đợt 04/12/2026)** — ba ca so với bản gốc merge-base sẽ đỏ trên chính PR đưa cây đã dọn nhà vào
  nhánh chính kho mới, nếu nhánh ấy còn là cây phẳng lúc đó.

**Cân trên mọi kho:** vòng chỉ đổi `tests/` và hồ sơ của chính nó — `tests/` không phát hành tới kho tiêu thụ nào. Kho
tiêu thụ: được không, mất không. Kho kit hôm nay: bộ kiểm xanh nguyên, cùng túi khoá.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | 43 khoá K4-MP thiếu vì nhãn ca in đường đã dịch (lời đọc của B2) | Sửa nhãn ở kho này không đưa khoá về | So hai túi khoá của B2 cho `approve.md` | **SAI — đã đo:** hai cây in cùng 174 tên; luật `tuiCu` của thước B2 gộp hai tên thành một |
| 2 | 6 khoá K4-TB đỏ vì thẻ khác do bố cục | Phải đổi cách so thẻ | Chạy lại với `origin/main` = nguồn | **SAI — đã đo:** đỏ vì bản gốc merge-base là `909dffd8` (trước #503) không đọc được thư mục skill đã đổi tên |
| 3 | DV5 đỏ vì một dòng chú thích bị luật đường đổi | Chỉ cần một dòng miễn | Đọc chi tiết đỏ ở bản sao | **Thiếu — đã đo:** hai dòng (chú thích + tên gói `road-map@`), đỏ với MỌI bản gốc còn phẳng |
| 4 | «KK-6 so-that» đỏ vì đọc sổ qua lịch sử | — | Chạy bộ xếp ở hai cây | **Khác — đã đo:** sổ thật trỏ `feature-loop/skills/…` (đường phẳng), tệp ấy không còn ở chỗ đó trên cây mới |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: sau vòng này, lượt đo giữ khoá kế của B2 còn thiếu bao nhiêu trong 53 khoá vòng nhận?
- Kết quả nào là SỐNG: lượt đo giữ khoá kế của B2 thiếu 0 trong 53 khoá (khoá nào chủ kho cho sửa ở thước B2 thì tính
  sau khi B2 nhận phần gửi); bộ kiểm xanh trên nhánh PR.
- Kết quả nào là CHẾT: ở bố cục hôm nay một ca từng xanh hoá đỏ, đổi tên, biến khỏi túi khoá, hoặc một chiều đỏ có sẵn
  thôi đỏ — gặp là gỡ bản sửa của tệp ấy.
- Timebox: gộp trước lượt đo lại kế của B2; hạn đợt 04/12/2026.
- Ghi thêm 17/11 sau khi mở: bốn khoá CT-10-do/KM-1 vào vòng theo lời chủ kho gõ ở phiên B2 (Hỏi-5) — khi chủ kho xác nhận ở Cổng Phạm vi, «53 khoá» ở ba dòng trên đọc là 57.

## Kết quả prototype

Không dựng prototype riêng. Nguyên mẫu sửa K4-TB (hai dòng) đã chạy xanh trên bản sao cây `32a5506f` với bản gốc `909dffd8`.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Danh sách khoá thiếu lượt 8 | nhánh B2: `migration/kich-ban/ket-qua/phan-du-luot-8.tsv`, `migration/viec-kho-cu-b2.md` §4.5 | khoá + cụm (đo trên `3341b8dc`) | có, chép 53 dòng vào `khoa-dich.tsv` của hồ sơ, ghi rõ nguồn | — |
| Luật so khoá của B2 (`doiKhoa`, `tuiCu`, `soTui`) | bản chép ở `_acceptance/phan-du-bo-cuc-moi/rang/tui-khoa.mjs` (đã so: khớp bản B2 `0ab6f720`) | vật của vòng trước | có, dùng nguyên — không sửa byte nào của hồ sơ đã ký | — |
| Bộ dịch, bộ dựng kho mới, thước vòng hai và vòng ba | `tests/bo-cuc.mjs`, `tests/hai-bo-cuc.mjs`, `_acceptance/phan-du-bo-cuc-moi/rang/`, `_acceptance/phan-du-bo-cuc-moi-vong-ba/rang/` | vật của vòng trước | có, dùng lại | — |

## Cổng 0

- **decision = build** Chủ kho gọi tên 17/11 bằng câu «Mở vòng bốn», sau khi đọc số đo B2; phiên giữ đợt chuyển lời.
- **disposition = …** Không áp dụng (không dựng prototype).
- **Ngưỡng UAT chốt cùng lúc ký:** ba dòng SỐNG, CHẾT, timebox ở mục Ngưỡng — chép từ lời giao của phiên giữ đợt.
- **Neo:** `_acceptance/phan-du-bo-cuc-moi-vong-ba/` — hồ sơ đã ký của kho này.

## Thước đo thành công → ứng viên criterion

- Bố cục hôm nay: bộ kiểm xanh trọn; túi khoá mỗi tệp đã chạm giữ trọn tên ca so với bản gốc ghim `3341b8dc`.
- Bố cục mới: kho dựng bằng mã từ HEAD, bản gốc merge-base đặt ở cả hai chỗ đã gặp (`909dffd8` như lượt đo của B2, và
  chính nguồn) — khoá đích K4-TB, K4-DN có mặt và xanh, so bằng NGUYÊN luật `tuiCu` + `soTui` của B2.
- Chiều đỏ: cùng kho mới, bản trước vòng của mỗi tệp đỏ đúng câu đã thấy ở nhật ký B2.
- `gui-b2.md` bốn mục như vòng ba.

## Out of scope từ khám phá

- Không sửa gì ở `~/dev/delivery-loop`.
- Nhóm «Ngoài-11». (CT-10-do, KM-1: lúc mở ở ngoài; vào vòng theo Hỏi-5.)
- Không cắt số, không gắn thẻ.
- Không sửa mã sản phẩm (`scripts/`, `lib/`, `skills/`…): 45 dòng sổ ở 32 hồ sơ đã khép trỏ đường phẳng sẽ hoá đỏ khi dựng
  lại thẻ ở cây mới — ghi vào `gui-b2.md`, không sửa ở vòng này.
