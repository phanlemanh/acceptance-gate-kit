## Luật riêng của kho kit (chép vào LUAT.md của đợt nen-thiet-ke-0411)

Đợt `nen-thiet-ke-0411` giúp một kho mới bật nền thiết kế mà không vấp, và tự khám được xem đã bật đủ chưa. Phạm vi:
- mốc «Nền thiết kế cho kho mới» (12/11) của `docs/plans/lo-trinh-kit.json`: hàng DFK1–DFK3 (bản phạm vi
  `docs/plans/pham-vi-design-floor-kho-moi-2910.md`);
- ba hàng KM1–KM3 của lượt cắt `kham-kho-0411` (bản phạm vi `docs/plans/pham-vi-kham-kho-0411.md`, đề xuất của phiên crm
  04/11).

Chủ kho chọn ba dãy ngày 04/11. Cổng Đáng của sáu hàng gom về thẻ khởi tạo của giám sát.

Dãy và hàng.

1. **Ba dãy, hai hàng mỗi dãy, chạy theo `uu_tien`.**
   - D1: DFK1 → KM1. Một lệnh bật, một lệnh khám. Nếu Cổng Phạm vi của KM1 thấy kết quả chồng DFK1 thì gộp ở đó, không
     dựng hai bảng.
   - D2: KM2 → DFK2. DFK2 đứng trên KM2 (`sau`) vì cú pháp `!glob` chỉ có một bản, nằm ở bộ đọc glob dùng chung
     `lib/evidence-core.cjs`.
   - D3: DFK3 → KM3.
2. **DFK2 chạy tới chữ ký Cổng Bằng chứng rồi GIỮ PR, chưa gộp.** Chủ kho chốt 29/10: «Sau 10 vòng M1» của invest. Giám
   sát ghi DFK2 là «ký chưa gộp» kèm lý do. Nó vẫn là hàng tồn: lượt gọi người và giờ máy nó tốn vẫn cộng vào đợt
   (North Star 23/10). Khi chủ kho gõ lệnh gộp thì gộp.
3. **Chạm ngoài vùng đã khai** thì khai thêm bằng `hang vung <slug> --vung <glob>` ở Cổng Phạm vi, trước khi sửa.
   `lib/evidence-core.cjs` là vùng của KM2. Dãy khác cần chạm nó thì gửi `cham-tep`.
4. **Mục chờ KM-C1 không vào đợt** (mô hình sổ đăng ký của bản đồ khuôn). Nó chỉ mở lại theo điều kiện ghi ở mục
   `mo_lai_khi` của nó.
5. **Không đổi số phiên bản** (`plugin.json`, `marketplace.json`, đầu mục CHANGELOG). Số phiên bản đặt lúc giám sát cắt
   mốc.

Giới hạn cố định của chủ kho (26/10).

6. **Không PR nào tới upstream Design OS.** DFK3 mang hook trace của Design OS; mọi sửa đổi là bản vá cục bộ, mỗi bản một
   dòng ở sổ LOCAL-PATCHES. Không mở issue, PR hay bình luận nào ở kho upstream.
7. **Không nêu chủ đề giấy phép của upstream** ở bất kỳ đâu: hợp đồng, thẻ cổng, mô tả PR, tin giữa các phiên.
8. **Bốn phép thử trước mỗi quyết định** (North Star của kit):
   - không ghi gì sau S4 (ADR 0007);
   - không thêm lượt gọi người ngoài cổng đã thiết kế, không hỏi câu mà câu trả lời hợp lý duy nhất là «ừ»;
   - nêu chi phí máy (token · phút) của mỗi kết quả gộp;
   - mỗi phép kiểm mới có chiều đỏ.
9. **Sửa kit vì sự cố của MỘT kho phải cân trên MỌI kho** (luật 26/09). KM2 đổi bộ đọc glob dùng chung, nên đo trước→sau
   trên các kho tiêu thụ ở sha ghim. KM1 là lệnh chỉ đọc.

Kho kit.

10. **Kho kit công khai.** Không đưa dữ liệu của kho tiêu thụ (tên khách, số liệu, đường máy, tên tệp hay thành phần sản
    phẩm, nội dung hồ sơ sản phẩm) vào commit. Ẩn danh trước khi commit, và chạy DP1-07 trước khi đẩy.
11. **Gộp bằng merge commit, không squash** (squash giết chữ ký Cổng 2). Không bao giờ dùng `gh pr merge --auto`. Chỉ dùng
    `gh pr merge <n> --merge --match-head-commit <sha>`, và chỉ khi Nhật ký ghi chủ kho cho tự gộp. Không có dòng ấy thì
    bấm gộp là việc của chủ kho.
12. **Tệp dùng chung** (`_acceptance/config.yaml`, `CONTEXT.md`, `docs/plans/lo-trinh-*.json`,
    `docs/research/known-limits-ledger.tsv`, `lib/p-tiers.json`, `.claude-plugin/marketplace.json`) chỉ thêm dòng; không
    sửa hay xoá dòng của người khác. Xung đột thì giữ cả hai bên. Muốn sửa dòng có sẵn thì gửi yêu cầu `cham-tep`.
    `PRODUCT-MAP.md` và `LO-TRINH.html` không sửa tay; vẽ lại bằng máy sau khi gộp `origin/main`.
13. **Một lượt S4 trên toàn máy**, qua khoá `s4` của đợt (`xin s4`). Không tự tạo hay gỡ khoá của phiên khác.
14. **Không nâng plugin `acceptance-gate`/`feature-loop` giữa một lượt S4.**

Giao tiếp.

15. **Thợ đứng chờ người thì tự ghi yêu cầu `can-nguoi`**, kể cả khi chờ hộp quyền trong lượt chấm. Không chỉ hỏi bằng
    chữ trong hội thoại.
16. **Một cửa.** Chủ kho nói với phiên giám sát của đợt. Cổng Phạm vi và Cổng Bằng chứng ký ở phiên thợ của hàng; chữ
    quyết do chủ kho tự gõ, máy không điền sẵn.
17. **Trả lời chủ kho bằng tiếng Việt, tiếng sản phẩm.** Mỗi tin chỉ một quyết định, trả lời được trong một chạm.
18. **Tin giữa các phiên** mở đầu bằng `[<nguồn> → <đích>] <loại>`, với loại là `yeu-cau` · `tra-loi` · `bao` · `hoi`.
