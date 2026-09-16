---
schema_version: 1
slug: phat-hien-den-duoc-nguoi-ky
feature: Phát hiện của làn rà soát đến được người ký — thẻ Cổng 2 và luật xanh-sạch đọc cùng một nguồn, và đọc được đúng chữ in trên nút
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

**Người trả giá: người ký Cổng Bằng chứng** — ở cả ba ngả, thứ họ đọc nói khác thứ làn rà
soát tìm ra. Ô này gộp ba ô mở riêng (16/09, rà 28 ô theo North Star) vì cả ba là MỘT lớp,
và hiến pháp kit đòi sửa lớp chứ không vá từng ca.

| Ngả | Đo được | Ô gốc |
|---|---|---|
| **Luật xanh-sạch đọc nhầm tệp** | kho `crm-onehub`, hồ sơ `nang-tran-trang-danh-ba`, 08/09: báo cáo bằng chứng khai «Ngoài hợp đồng» RỖNG trong khi làn rà soát cùng lượt có **13 mục**, gồm một mục khai sai phạm vi xử lý dữ liệu cá nhân. Lưới trước-merge in `clean`, thẻ in «máy đi tiếp» | `xanh-sach-doc-nham-mat` |
| **Thẻ không có làn cho lỗi TRONG hợp đồng chưa sửa** | thẻ im lặng về mục loại đó mà vẫn ghi «Bằng chứng đầy đủ» | `the-cong-2-giau-loi-trong-hop-dong` |
| **Thẻ in nút tiếng Việt, chỉ đọc từ khoá tiếng Anh** | người viết đúng chữ mình đọc trên nút → thẻ báo «đề xuất không đọc được», ô tương ứng trong dòng lệnh điền sẵn bỏ trống | `de-xuat-tieng-viet-khong-doc-duoc` |

Ba ngả cộng lại cho đúng một hệ quả: **người ký tin rằng đã nhìn hết, trong khi mục nặng
nhất là mục dễ rơi nhất.** Ngả 1 giấu cả gói; ngả 2 giấu một loại; ngả 3 giấu đúng mục được
viết bằng chữ đầy đủ nhất.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Luật xanh-sạch đọc được làn rà soát mà không đổi định nghĩa sáu điều kiện | đây là nới/siết cổng, không phải sửa bộ đọc — thành việc của người | đối chiếu sáu điều kiện đang chạy với nguồn mới, từng điều một | Chưa thử |
| 2 | Bộ từ khoá của đề xuất nhận được CẢ chữ trên nút lẫn mã tiếng Anh, một bảng một chỗ | hai bảng phải giữ đồng bộ — đúng lớp mà ô cụm kia đang chữa | bảng một nguồn, writer và reader cùng rút, ca round-trip | Chưa thử |
| 3 | Lỗi TRONG hợp đồng chưa sửa có chỗ đứng trên thẻ mà không đẻ thêm lượt hỏi | thẻ thành form, đúng bệnh hồ sơ `cat-khoi-viec-cua-anh-tren-tin` vừa cắt | dựng thẻ trên hồ sơ có mục loại đó, đếm số ô người phải điền | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] một hồ sơ có phát hiện chưa định đoạt có còn đi qua được cổng như «sạch» không, và người ký có đọc được mọi phát hiện ngay trên thẻ không?
- Kết quả nào là SỐNG: [đề xuất] dựng lại đúng ca `nang-tran-trang-danh-ba` 08/09 → lưới trước-merge ĐỎ, ghim tên tệp và số mục; thẻ hiện cả ba loại phát hiện; viết chữ in trên nút vào hồ sơ → thẻ điền sẵn được, không báo không đọc được; hồ sơ thật sự sạch → lưới IM và thẻ không đẻ ô mới; 0 lượt gọi người thêm
- Kết quả nào là CHẾT: [đề xuất] phải nới hoặc siết định nghĩa sáu điều kiện xanh-sạch mới đọc được làn rà soát; hoặc thẻ đẻ thêm ô người phải điền
- Timebox: …

## Kết quả prototype

Chưa dựng.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Ca thật 13 phát hiện | kho `crm-onehub`, hồ sơ `nang-tran-trang-danh-ba`, kit 2.8.0, 08/09 | bằng chứng thực địa | có | — |
| Ba ô gốc (đã xếp lại 16/09) | `_acceptance/xanh-sach-doc-nham-mat` · `_acceptance/the-cong-2-giau-loi-trong-hop-dong` · `_acceptance/de-xuat-tieng-viet-khong-doc-duoc` | đề bài + đo | có, trọn | — |

## Cổng 0

- **decision = …** Ba ngả đều là sửa bộ ĐỌC cho khớp thứ đã có, không CỘNG bộ phận mới.
- **disposition = …**
- **Ngưỡng UAT chốt cùng lúc ký:** chép từ bullet `[đề xuất]` sau khi người gỡ tiền tố.

## Out of scope từ khám phá

- Không đổi định nghĩa sáu điều kiện xanh-sạch — đó là quyết định người, ô khác.
- Không đổi khuôn của làn rà soát; ô này sửa bên ĐỌC.
