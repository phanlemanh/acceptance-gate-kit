---
schema_version: 1
slug: mot-khuon-cho-ben-viet-va-ben-doc
feature: Một khuôn cho bên VIẾT và bên ĐỌC — bốn chỗ nối đang trôi khỏi nhau vì mỗi bên tự rút khuôn, và test tự dựng đồ giả đúng khuôn bên đọc
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

Bốn chỗ trong kit có hai đầu — một bên GHI ra, một bên ĐỌC vào — mà không bên nào rút khuôn
từ một nguồn chung. Chúng trôi khỏi nhau, và **đều hỏng LẶNG**: không cờ vàng, không mã thoát
khác 0, chỉ một giá trị trông như sự thật. Ô này gộp bốn ô mở riêng (16/09, rà 28 ô theo
North Star).

Đây là nguyên văn hình dạng (3) mà `CLAUDE.md` liệt kê: *«bên VIẾT và bên ĐỌC của một
artifact trôi khỏi nhau vì mọi test tự dựng fixture đúng khuôn bên đọc»* — và luật đó đã chỉ
sẵn dạng nghiệm: **một marker, hai bên cùng rút, ca round-trip**.

| Chỗ nối | Hỏng ra sao | Người trả giá | Ô gốc |
|---|---|---|---|
| Báo cáo token · bên ghi in tiêu đề tự do, bên đọc khớp cứng | đo 15/09 trên ba hồ sơ mới nhất: **2/3 trả 0**; con số trong bảng năm dòng của mốc 2.14.0 là số cộng TAY dưới nhãn «máy đo» | owner mỗi mốc; ai chạy `loop-health` | `mot-nguon-usage-report` |
| Liệt kê trong hợp đồng bị chép tay sang mảng test | hai bản trôi; một vòng rà soát đã vá **bốn lỗ cùng lớp** | tác giả hồ sơ | `liet-ke-may-doc` |
| Bộ đọc frontmatter cắt phần sau một ký hiệu | tên hồ sơ hiện CỤT trên bản đồ, thẻ khởi động và thẻ Cổng 2, mà phép kiểm vẫn xanh vì hai bên dùng chung bộ cắt | người ký, đọc một cái tên cụt đúng lúc ký | `frontmatter-thang-mot-ky-hieu` |
| Bộ giải trạng thái eval nuốt chú thích YAML | viết lý do cạnh một trạng thái hợp lệ → eval rơi sang nhóm khác, lời khai của tác giả bị bỏ lặng; tệp anh em CÙNG HỌ thì có bóc, và tự khai là «MỘT nguồn cho mọi bộ đọc dòng» | tác giả hồ sơ | `bo-giai-nuot-chu-thich-yaml` |

**Vì sao gộp chứ không làm bốn vòng:** một dạng nghiệm, bốn lần hỏi người. Và mỗi lần chữa lẻ
lại sinh một bộ đọc mới không dùng nguồn chung — chính là cách chỗ nối thứ tư ra đời.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Bốn chỗ nối dùng được cùng MỘT dạng nghiệm (marker một-nguồn + ca round-trip) | thành bốn việc riêng, gộp là sai — tách lại | phác marker cho từng chỗ, xem có chỗ nào cần khuôn thứ hai | Chưa thử |
| 2 | Ca round-trip sinh được đồ thử bằng chính bên GHI trong cùng lần chạy, không viết tay | vẫn là test tự dựng đúng khuôn bên đọc — chưa chữa gì | một chỗ nối, chạy bên ghi rồi đưa thẳng cho bên đọc | Chưa thử |
| 3 | Hồ sơ cũ khuôn lệch có đường đọc-cũ, không bắt chuyển hàng loạt | vỡ luật đổi-schema-phải-có-đường-đọc-cũ của `CLAUDE.md` | đếm hồ sơ hiện có mang khuôn cũ ở từng chỗ nối | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đổi khuôn ở MỘT bên của mỗi chỗ nối thì có ca nào đỏ không, và ca đó có sinh đồ thử bằng chính bên ghi không?
- Kết quả nào là SỐNG: [đề xuất] mỗi chỗ nối có một ca round-trip sinh đồ thử bằng bên GHI rồi đọc bằng bên ĐỌC, không viết tay; đổi khuôn một bên → ca ĐỎ ghim đúng thông điệp; chạm tệp không thuộc chỗ nối → ca IM; hồ sơ cũ khuôn lệch vẫn đọc được; 0 lượt gọi người thêm
- Kết quả nào là CHẾT: [đề xuất] phải viết khuôn thứ hai cho một chỗ nối nào đó; hoặc ca chỉ đỏ được bằng mã thoát mà không ghim thông điệp; hoặc phải bắt hồ sơ cũ chuyển hàng loạt
- Timebox: …

## Kết quả prototype

Chưa dựng. Mẫu có sẵn để chép dạng nghiệm: marker khuôn mục ngoài-hợp-đồng + ca round-trip đi kèm nó.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Dạng nghiệm cho chỗ nối máy-viết → máy-đọc | `CLAUDE.md`, luật «thước phải gắn vào vật được giao», hình dạng (3) | luật của chính kho | có | — |
| Bốn ô gốc (đã xếp lại 16/09) | `_acceptance/mot-nguon-usage-report` · `_acceptance/liet-ke-may-doc` · `_acceptance/frontmatter-thang-mot-ky-hieu` · `_acceptance/bo-giai-nuot-chu-thich-yaml` | đề bài + đo | có, trọn | — |

## Cổng 0

- **decision = …** Bốn vế đều là vật-hoá một-tầng, không CỘNG bộ phận mới.
- **disposition = …**
- **Ngưỡng UAT chốt cùng lúc ký:** chép từ bullet `[đề xuất]` sau khi người gỡ tiền tố.

## Out of scope từ khám phá

- Không mở vòng đo-thước-của-thước — mỗi chỗ nối kiểm MỘT tầng, theo luật chiều rộng (a).
- Không bắt hồ sơ cũ chuyển hàng loạt; đường đọc-cũ hoặc một lệnh chuyển đổi.
