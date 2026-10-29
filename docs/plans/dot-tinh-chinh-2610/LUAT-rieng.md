## Luật riêng của kho kit (chép vào LUAT.md của đợt tinh-chinh-2610)

Đợt `tinh-chinh-2610` sửa những gì hai đợt thử ở kho tiêu thụ vấp. Phạm vi là mốc «Tinh chỉnh sau hai đợt thử» (05/11) của
`docs/plans/lo-trinh-kit.json`: hàng TC1–TC5. Bản phạm vi: `docs/plans/pham-vi-tinh-chinh-cam-mau-2610.md`. Cổng Đáng của
cả năm hàng đã ký `build` ngày 25/10, nên thẻ khởi tạo không hỏi lại. Đủ năm hàng gộp thì giám sát cắt một bản vá; số phiên
bản đặt lúc cắt.

Dãy và hàng.

1. **Bốn dãy, một hàng mỗi dãy.** D1 chạy TC2, D2 chạy TC3, D3 chạy TC4, D4 chạy TC5. Vùng tệp của mỗi hàng nằm ở
   `ranh_gioi` trong `hang-viec.json`. TC2 và TC3 cùng khai `dieu-phoi/**`, nên lịch giữ TC3 tới khi TC2 xong; không ai
   xếp tay. Cả hai còn chờ PR TC1 (#419) gộp, vì PR ấy chạm `dieu-phoi/scripts/**`.
2. **Chạm ngoài vùng đã khai** thì khai thêm bằng `hang vung <slug> --vung <glob>` ở Cổng Phạm vi, trước khi sửa.
3. **TC1 không vào đợt.** Hàng này đã ký Cổng Bằng chứng ngày 26/10; phiên `tc1-go-ket` gộp main, ghim lại rồi gộp #419.
   Giám sát chỉ theo dõi nó.
4. **Mục chờ TC-C1 và TC-C2 không vào đợt.** TC-C1 (lệnh đặt `uu_tien` tuyệt đối) là CỘNG: chỉ mở khi chủ kho phê đích
   danh ở Cổng Phạm vi của TC2.
5. **Không đổi số phiên bản** (`plugin.json`, `marketplace.json`, đầu mục CHANGELOG). Số đặt lúc giám sát cắt bản vá.

Giới hạn cố định của kho kit.

6. **Bốn phép thử trước mỗi quyết định** (North Star của kit): không ghi gì sau S4 (ADR 0007) · không thêm lượt gọi người
   ngoài cổng đã thiết kế, không câu mà câu trả lời hợp lý duy nhất là «ừ» · nêu chi phí máy (token · phút) của mỗi kết
   quả gộp · mỗi kiểm mới có chiều đỏ.
7. **Sửa kit vì sự cố của MỘT kho phải cân trên MỌI kho** (luật 26/09). Thứ tự nghiệm: sửa đúng tầng → bộ đọc khoan dung
   kèm cờ vàng → bật theo lựa chọn → đổi mặc định. TC3 là bật theo lựa chọn; TC4 vẫn là lệnh chỉ đọc.

Kho kit.

8. **Kho kit công khai.** Không đưa dữ liệu của kho tiêu thụ (tên khách, số liệu, đường máy, nội dung hồ sơ sản phẩm)
   vào commit; ẩn danh trước commit và chạy DP1-07 trước khi đẩy.
9. **Gộp bằng merge commit, không squash** (squash giết chữ ký Cổng 2). Không bao giờ `gh pr merge --auto`. Chỉ
   `gh pr merge <n> --merge --match-head-commit <sha>`, và chỉ khi Nhật ký ghi chủ kho cho tự gộp; không có dòng ấy thì
   bấm gộp là của chủ kho.
10. **Tệp dùng chung** (`_acceptance/config.yaml`, `CONTEXT.md`, `docs/plans/lo-trinh-*.json`,
    `docs/research/known-limits-ledger.tsv`, `lib/p-tiers.json`, `.claude-plugin/marketplace.json`) chỉ thêm dòng, không
    sửa hay xoá dòng của người khác; xung đột thì giữ cả hai bên. Sửa dòng có sẵn thì gửi yêu cầu `cham-tep`.
    `PRODUCT-MAP.md` và `LO-TRINH.html` không sửa tay — vẽ lại bằng máy sau khi gộp `origin/main`.
11. **Một lượt S4 trên toàn máy**, qua khoá `s4` của đợt (`xin s4`). Không tự tạo hay gỡ khoá của phiên khác.
12. **Không nâng plugin `acceptance-gate`/`feature-loop` giữa một lượt S4.**

Giao tiếp.

13. **Thợ đứng chờ người thì tự ghi yêu cầu `can-nguoi`** — kể cả chờ hộp quyền trong lượt chấm — không chỉ hỏi bằng chữ
    trong hội thoại.
14. **Một cửa.** Chủ kho nói với phiên giám sát của đợt. Cổng Phạm vi và Cổng Bằng chứng ký ở phiên thợ của hàng; chữ
    quyết do chủ kho tự gõ, máy không điền sẵn.
15. **Trả lời chủ kho bằng tiếng Việt, tiếng sản phẩm.** Mỗi tin tối đa một quyết định, trả lời một chạm.
16. **Tin giữa các phiên** mở đầu `[<nguồn> → <đích>] <loại>` — `yeu-cau` · `tra-loi` · `bao` · `hoi`.
