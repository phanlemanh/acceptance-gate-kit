---
schema_version: 1
slug: luot-kiem-nhe
feature: Lượt kiểm tự động của kho kit nhẹ đi mà vẫn tin được — bộ kiểm chạy theo mảnh song song trên PR, vẫn giữ một lượt chạy trọn trên nhánh chính; bộ chạy kiểm tự xưng và tự so phiên bản Node; có số đo thời gian từng ca do máy sinh trong chính lượt chạy
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build             # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-11T07:35:11Z   # chủ kho gõ «Cổng Đáng luot-kiem-nhe: build» tại phiên này 11/11, máy ghi hộ tên và ngày
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Gốc: acceptance-gate-kit/_acceptance/ha-tang-khong-dot-luot — hồ sơ đã ký dựng cơ chế chia mảnh cho hai bộ chạy kiểm (AC-1…3, AC-8) để lượt chấm chạy dưới trần công cụ; AC-3 của nó ghi rõ lượt kiểm tự động «vẫn chạy trọn suite». Từ 24/09 lượt chấm chạy mảnh, lượt kiểm tự động thì chưa.
Gốc: acceptance-gate-kit/_acceptance/nen-chay-bang-moi-truong-nguoi-goi — hồ sơ đã ký ghi một lần đường nền đỏ giả vì tiến trình lấy Node 22 thay Node 24; cùng lớp lệch phiên bản Node mà vòng này muốn bộ chạy tự gọi tên.

**Vòng meta, chủ kho gọi tên (luật chiều rộng b).** Phiên điều phối hỏi «Mở vòng A1 (làm nhẹ lượt kiểm tự động, kho cũ)
trên máy nào?», chủ kho trả lời nguyên văn «MacBook Pro» (11/11/2026). Lời đó là căn cứ mở vòng và giao máy, KHÔNG phải
chữ ký Cổng Đáng — chữ ký là dòng chủ kho gõ tại phiên chạy vòng (mục «Cổng 0»). Vòng gắn mốc 2.39.

**Ai gặp:** người sửa kit — chủ kho và các phiên máy chạy vòng ở kho này. Mỗi lần đẩy lên một PR là một lượt kiểm tự
động; mỗi lần ghim lại hay gộp nhánh chính vào nhánh làm việc là thêm một lượt. Đoạn ký→gộp chờ đúng lượt ấy.

**Số đo nền (11/11/2026, kho này):**

- Lượt kiểm tự động trung vị 58 phút: bộ kiểm script 37 phút + bộ kiểm plugin 17 phút chạy nối đuôi trong một việc.
- 21/60 lượt gần nhất đỏ. Từ 01/10: 225 PR gộp · 141 commit ghim lại · 258 lần gộp nhánh chính vào nhánh làm việc.
- Lượt kiểm tự động chạy Node 22, máy làm việc chạy Node 24; chưa bộ chạy nào tự xưng hay tự so phiên bản.

**Đo thêm lúc mở vòng — thời gian từng ca trên chính máy của lượt kiểm tự động** (đọc dấu giờ từng dòng trong nhật ký
hai lượt xanh trên nhánh chính: lượt 42954542780 tại `9ff2e4f7` và lượt 42912994864 tại `be736814`):

| Chỗ tốn giờ | Lượt `9ff2e4f7` | Lượt `be736814` |
|---|---|---|
| Cả việc «tests» | 57 phút | 67 phút |
| Bộ kiểm script | 34,4 phút | 40,3 phút |
| ↳ ca LM13 + LM20 (tệp `gate-card-lmcms.test.mjs`) | 7,1 phút | 8,6 phút |
| ↳ 126 tệp `.test.mjs` cộng lại / phần ca bash | 31,6 / 2,7 phút | 37,0 / 3,3 phút |
| Bộ kiểm plugin | 16,1 phút | 19,3 phút |
| ↳ một ca P161 | **13,3 phút** | **15,9 phút** |
| ↳ mọi ca còn lại của bộ plugin | 2,8 phút | 3,4 phút |
| Bộ điều phối / bộ workflows | 4,8 / 1,5 phút | 5,6 / 1,5 phút |

Ba ca P161, LM13, LM20 chiếm 20–24 phút của mỗi lượt. Cả ba làm cùng một việc: dựng thẻ cho TỪNG hồ sơ thật của kit
(276 hồ sơ hôm nay), mỗi lần dựng là một tiến trình mới — nên chúng chậm thêm theo mỗi hồ sơ kit ký. Hạt giống
`docs/plans/2026-09-22-hat-giong-suite-scripts-qua-tran-cong-cu.md` mục 3 đã ghi LM20 ≈ 105 giây hồi 22/09; nay là
210–260 giây.

**Hệ quả cho cách làm (trình đủ ở Cổng Phạm vi):** chỉ chia mảnh bằng cơ chế sẵn có thì lượt kiểm của PR còn khoảng
19–23 phút — mảnh dài nhất là mảnh chứa tệp của LM13/LM20 (18,9–22,8 phút), kế đó là vùng chỉ có P161 (13–16 phút).
Muốn xuống dưới mức đó phải sửa cả ba ca chậm; và lượt chạy trọn trên nhánh chính chỉ nhẹ đi nếu sửa ca chậm.

**Trace:** North Star — thước «làm-xong → gộp-được», nửa ký→gộp, và phút máy trên mỗi kết quả gộp. Nguyên tố 2 (bằng
chứng không tự dối) cho phần Node: bộ chạy nói ra nó đang chạy trên phiên bản nào thay vì để một tệp ghim làm lời dặn.
Tác động lên số lượt gọi người: không đổi (vẫn ba cổng). Đây là việc của bộ công cụ, không chạm người dùng kho tiêu thụ;
nó tới kho tiêu thụ gián tiếp, qua mốc 2.39 và qua nhịp sửa kit nhanh hơn.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Các mảnh hợp lại bằng đúng lượt chạy trọn — không ca nào rơi giữa hai mảnh | Lượt PR xanh mà sót ca; lỗi chỉ lộ ở lượt trọn trên nhánh chính, sau khi đã gộp | So tập ca của các mảnh với lượt trọn (hồ sơ `ha-tang-khong-dot-luot` đã có phép so này cho lượt chấm) | Chưa thử trên lượt kiểm tự động |
| 2 | Ba ca chậm sửa được mà giữ nguyên điều chúng khẳng định | Phải chọn: để nguyên (lượt PR ~20 phút) hay đổi phép đo của hồ sơ đã ký | Chạy bản sửa và bản gốc trên cùng cây, so kết quả từng hồ sơ | Chưa thử |
| 3 | Máy của lượt kiểm tự động chạy được nhiều việc song song mà mỗi việc không chậm đi đáng kể | Số phút sau khi đổi cao hơn ước | Đo trên lượt thật của PR vòng này | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

Không đo được — việc nội bộ của bộ công cụ, không có người dùng cuối để mời phiên nghiệm thu; reality đọc bằng máy: số
phút lượt kiểm tự động thật của PR vòng này so với 58 phút, và ca lệch Node đỏ / khớp im nằm trong bộ kiểm.

## Kết quả prototype

Không dựng prototype. Số đo từng ca ở trên đọc từ nhật ký lượt kiểm tự động đã có, không chạy gì thêm.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| (không có vật liệu ngoài kho) | — | — | — | — |

## Cổng 0

- **decision = build** Căn cứ: chủ kho gõ «Cổng Đáng luot-kiem-nhe: build» (11/11/2026) sau khi đọc số đo từng ca ở mục «Vấn đề & ai gặp».
- **disposition = (không có prototype)** Căn cứ: không dựng prototype.
- **Ngưỡng UAT chốt cùng lúc ký:** dòng «Không đo được — …» ở mục Ngưỡng, giữ nguyên văn.

## Thước đo thành công → ứng viên criterion

- Số phút lượt kiểm tự động của PR vòng này, đo trên lượt thật, đặt cạnh 58 phút.
- Lượt chạy trọn không chia mảnh vẫn chạy trên nhánh chính.
- Ca lệch Node đỏ kèm đúng thông điệp; ca khớp Node im — cả hai nằm trong bộ kiểm.
- Bảng thời gian từng ca do máy sinh trong chính lượt chạy.

## Out of scope từ khám phá

- Cắt mốc 2.39 — làn V, làm sau vòng này, mang phần chỉ-bớt riêng.
- Đổi bố cục thư mục, đổi tên plugin hay lệnh.
- Tách các tệp kiểm lớn thành nhiều tệp, hay tách kiểm theo từng plugin.
- Mọi thứ đổi phán quyết của một hồ sơ đã ký.
- Giảm 21/60 lượt đỏ — vòng này làm mỗi lượt ngắn lại, không tìm vì sao lượt đỏ.
