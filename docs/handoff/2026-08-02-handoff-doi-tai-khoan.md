# Handoff 02/08/2026 — đổi tài khoản, tiếp tục chiến dịch chứng chỉ toàn tuyến

*Người bàn giao: phiên maintainer (Claude) · Người nhận: phiên mới sau khi
Manh đổi tài khoản. Máy không đổi nên repo, worktree, plugin cache và trí nhớ
dự án vẫn nguyên chỗ cũ.*

---

## 1. Đọc gì trước — 10 phút là đủ để bắt nhịp

| Thứ tự | File | Vì sao |
|---|---|---|
| 1 | `docs/specs/workflow-v2-spec.md` | **Nguồn sự thật DUY NHẤT của quy trình.** File nào có dấu `[SUPERSEDED]` thì bỏ qua |
| 2 | `docs/plans/2026-07-30-full-run-certification.md` | Chiến dịch đang chạy: các pha, vai, số đo |
| 3 | `docs/plans/2026-07-27-discovery-gate0-rollout.md` | Nhật ký chương trình + hàng đợi việc còn thiếu (F-series) |
| 4 | `~/dev/team-handbook/README.md` + `SO-TAY-DOC-LAI.md` | Lớp cho người: năm cổng, luật ngôn ngữ, lối đọc |

Trí nhớ dự án (`~/.claude/projects/-Users-manhphan-dev-acceptance-gate-kit/memory/`)
có `MEMORY.md` là mục lục — đọc lướt để biết các bài học đã đóng.

---

## 2. Vai của phiên maintainer (phiên này) — đừng làm sai vai

- **Quan sát, tổng hợp, ghi lỗ.** KHÔNG can thiệp nội dung của phiên đang
  chạy tính năng; không soạn hộ, không sửa hộ. Mỗi lần phải đỡ tay là một
  **lỗ của kit chưa đóng gói** — ghi lại, đừng vá bằng lời khuyên.
- Manh = chủ, quyết tại cổng + phản hồi. Manh KHÔNG đỡ nội dung.
- Phiên chạy tính năng = kit tự dẫn, **một worktree một phiên**.
- **Luật ngôn ngữ mặt người (spec §4.1) áp cho CẢ hội thoại này**: chủ ngữ là
  người dùng hoặc sản phẩm, tên kỹ thuật xuống ngoặc, mã số kèm nghĩa, một
  dòng một ý, hình trước chữ sau. Phép thử: xoá hết tên máy khỏi câu, còn
  nghĩa thì đạt.

---

## 3. Trạng thái — tính tới 02/08

### Đã ship trong kit (nhánh chính `040164d`)

| Việc | Kết quả |
|---|---|
| Phiên thiết kế in-harness | Bản 1.26.0 — nghi thức 5 giai đoạn, thang vật liệu 3 bậc |
| Gói năm lưới chặn | Bản 1.27.0 / vòng lặp tính năng 1.19.0 |
| Luật ngôn ngữ mặt người | Đã ký, nạp tự động bởi bộ dựng thẻ; kèm việc thứ hai vá luật hình ảnh |
| Quy trình hợp nhất | Một file duy nhất, các file cũ đã đóng dấu thay thế |
| Bổ sung 02/08 | Bốn câu hỏi thực tế · vòng thiết kế thật · nối bản duyệt với bản dựng · đường E làn hệ thiết kế |

Plugin cache đã cập nhật: cổng nghiệm thu 1.27.0, vòng lặp tính năng 1.19.0.

### Trang Tư Vấn — hai vòng đã đóng, KHÔNG vòng nào ký

| Vòng | Chết vì | Phát hiện lúc nào |
|---|---|---|
| Một | Khung thị giác vay từ gói ngoài, không theo khuôn sản phẩm | **Sau khi dựng xong**, tại cổng bằng chứng — 8 lần chấm |
| Hai | **Khung sai về người dùng, việc cốt lõi, và dữ liệu** | **Tại bản mẫu, trước cổng phạm vi** — vài phiên thiết kế |

Vòng hai đã đóng không ký (nhánh `claude/busy-edison-a68b69`, lần ghi
`e19fe1ba8`). Cả hai nhánh **giữ làm sử liệu, không xoá**.

---

## 4. Vì sao vòng ba phải làm lại từ đầu — năm điều chỉnh của Manh

Khung cũ sai ở bốn chỗ nền tảng. Đây là lời Manh, giữ nguyên ý:

1. **Người dùng lõi là môi giới** vận hành công cụ; khách là người thụ hưởng.
   Hai vòng trước bỏ qua hẳn bề mặt của môi giới, chỉ tối ưu màn hình khách.
2. **Việc cốt lõi là KHỚP**, không phải so sánh: khách gửi một yêu cầu có
   thông số cụ thể → tìm căn khớp trong dự án → cho thấy khớp ở mấy tiêu chí.
   Không phải "thang ưu tiên trừu tượng".
3. **Dự án chưa xây thì không có ảnh căn.** Chủ đầu tư và môi giới dùng mặt
   bằng và thông số làm đại diện. Phải tối ưu cho loại dữ liệu này.
4. **Xem ảo ba chiều là tính năng nâng cấp**, không phải nền.
5. **Tiến độ thanh toán và dòng tiền không tách rời giá** — là một khối.

Hệ quả: có **hai bề mặt** (môi giới vận hành · khách xem), và một loại dữ liệu
mới chưa hệ thống nào giữ: **bản yêu cầu của khách**.

---

## 5. Bốn luật cứng cho vòng ba

1. **Không tham chiếu hồ sơ vòng một/hai làm nguồn khung.** Chúng chỉ là
   danh mục ý tưởng giải pháp + kho kỹ thuật có bảng nợ. Ai dùng, việc gì,
   dữ liệu nào — dựng lại từ đầu.
2. **Buổi phỏng vấn moi ý định chạy TRƯỚC khi viết hồ sơ**, mở bằng bốn câu
   hỏi thực tế (người · việc · dữ liệu · vật liệu — spec §2.1).
3. **Kiểm kê kho kỹ thuật riêng, có bảng nợ, Manh ký** — không mặc định giữ.
4. **Câu hỏi phạm vi trả lời sớm: một lát hay hai?** Bề mặt môi giới và bề
   mặt khách là hai việc khác nhau.

---

## 6. Việc kế tiếp — theo thứ tự

1. **Soạn bộ câu hỏi cho buổi phỏng vấn vòng ba** — ba trục: bề mặt môi giới
   (một ngày làm việc, yêu cầu đến từ đâu, đang khớp căn bằng cách gì) · dữ
   liệu thật (dự án chưa xây có gì, chủ đầu tư đưa gì, ai nhập, đổi lúc nào)
   · ranh giới (cái gì thuộc công cụ này, cái gì không). **Manh đã gật ý
   tưởng, chưa soạn.**
2. **Chạy buổi phỏng vấn** — Manh ngồi cùng, không uỷ được.
3. Hồ sơ cơ hội vòng ba → phản biện → cổng quyết định làm.
4. **Lịch buổi nghiệm thu với môi giới** — đã nhắc bốn lần, vẫn chưa có ngày.
   Càng quan trọng vì khung mới đặt môi giới làm người dùng chính. Đồng hồ
   bảy ngày tính từ lúc đóng cổng bằng chứng.

---

## 7. Số đo của chiến dịch — giữ nguyên, không đổi giữa chừng

Ngưỡng đã khai trước: số lần phải đỡ tay ≤ 3 · lệch khỏi khuôn sản phẩm = 0 ·
số vòng chấm ≤ 3 · khoảng 10 phút mỗi cổng · buổi nghiệm thu diễn ra trong
bảy ngày sau cổng bằng chứng. Định nghĩa thất bại: đỡ tay quá 10 lần hoặc
lệch khuôn tái xuất → dừng dựng, quay lại vá kit.

Sổ theo dõi nằm trong workspace của từng vòng. **Mọi phản hồi của Manh ở bất
kỳ bước nào phải được ghi** kèm phân loại xử lý — không ghi là lỗ.

---

## 8. Hàng đợi việc còn thiếu — đọc trong nhật ký chương trình

Nhóm lớn: hướng dẫn khám phá (ruột là buổi phỏng vấn) · bản đồ sản phẩm +
thẻ cho hai cổng mới + công cụ điều phối buổi nghiệm thu · gói skill khám
phá · phần còn lại của làn thiết kế · siết thước đo tầng lõi.

Mới thêm 02/08, chưa làm: máy tự nhận đường đi (hiện là quy ước người khai) ·
script kiểm kê kho linh kiện · máy soi mật độ chữ kỹ thuật ở mặt người.

---

## 9. Cạm bẫy đã dẫm — đừng dẫm lại

- **Một worktree một phiên.** Có lần phiên maintainer chuyển nhánh ở cây
  chung làm workspace của phiên khác biến mất giữa chừng.
- **Phiên mở trước khi plugin cập nhật thì vẫn chạy bản cũ** — mở phiên mới
  sau khi cập nhật mới nhận được luật mới.
- **Đừng khuyến nghị các nghi thức đã khai tử**: vẽ mockup ngoài, panel so
  chồng ảnh, đẩy thiết kế ngược. Chúng chết vì đòi nuôi một thế giới song
  song.
- **Sửa tài liệu sống thì sửa cả chỗ tra cứu**, không chỉ chỗ mô tả — vừa
  mắc lỗi này hôm nay với bảng định tuyến.
