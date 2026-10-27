## Luật riêng của kho kit (chép vào LUAT.md của đợt design-floor-2710)

Đợt `design-floor-2710` dựng plugin `design-floor` (bản lõi gọn của Design OS chấm giao diện trong vòng S0–S5 của kit).
Lộ trình: hàng FL1–FL5 và mục chờ FL-C1 của `docs/plans/lo-trinh-kit.json`. Kế hoạch:
`docs/plans/2026-10-26-ke-hoach-design-floor-tiep.md` · bản phạm vi: `docs/plans/pham-vi-design-floor-2710.md`.

Dãy và hàng.

1. **Hai dãy.** D1 chạy FL1. D2 chạy FL2 → FL3 → FL4 → FL5 theo thứ tự; mỗi hàng chỉ mở khi hàng nó dựng trên đã gộp
   (`sau` trong `hang-viec.json`). FL5 chờ cả FL4 và FL1.
2. **FL-C1 không vào đợt.** Chấm ui gate của Design OS ở S4 là mục chờ điều kiện; chỉ mở lại khi DF-07 xanh trên bản
   vendored VÀ một vòng thật ở kho tiêu thụ chứng không tệp nào đổi sau commit S4.

Giới hạn cố định của chủ kho (26/10).

3. **Không PR nào tới upstream Design OS.** Mọi sửa đổi A–D là bản vá cục bộ lúc vendor, mỗi bản một dòng ở sổ
   LOCAL-PATCHES. Không mở issue, PR hay bình luận nào ở kho upstream.
4. **Không nêu chủ đề giấy phép của upstream** ở bất kỳ đâu: hợp đồng, thẻ cổng, mô tả PR, tin giữa các phiên.
5. **Bốn phép thử trước mỗi quyết định** (North Star của kit): không ghi gì sau S4 (ADR 0007) · không thêm lượt gọi người
   ngoài cổng đã thiết kế, không câu mà câu trả lời hợp lý duy nhất là «ừ» · nêu chi phí máy (token · phút) của mỗi kết
   quả gộp · mỗi kiểm mới có chiều đỏ.

Kho kit.

6. **Kho kit công khai.** Không đưa dữ liệu của kho tiêu thụ (tên khách, số liệu, đường máy, nội dung hồ sơ sản phẩm)
   vào commit; ẩn danh trước commit và chạy DP1-07 trước khi đẩy.
7. **Gộp bằng merge commit, không squash** (squash giết chữ ký Cổng 2). Không bao giờ `gh pr merge --auto`. Chỉ
   `gh pr merge <n> --merge --match-head-commit <sha>`, và chỉ khi Nhật ký ghi chủ kho cho tự gộp; không có dòng ấy thì
   bấm gộp là của chủ kho.
8. **Tệp dùng chung** (`_acceptance/config.yaml`, `CONTEXT.md`, `docs/plans/lo-trinh-*.json`,
   `docs/research/known-limits-ledger.tsv`, `lib/p-tiers.json`, `.claude-plugin/marketplace.json`) chỉ thêm dòng, không
   sửa hay xoá dòng của người khác; xung đột thì giữ cả hai bên. Sửa dòng có sẵn thì gửi yêu cầu `cham-tep`.
   `lib/design-detect.mjs` là vùng của FL1; dãy khác chạm nó thì gửi `cham-tep`. `PRODUCT-MAP.md` và `LO-TRINH.html`
   không sửa tay — vẽ lại bằng máy sau khi gộp `origin/main`.
9. **Một lượt S4 trên toàn máy**, qua khoá `s4` của đợt (`xin s4`). Không tự tạo hay gỡ khoá của phiên khác.
10. **Không nâng plugin `acceptance-gate`/`feature-loop` giữa một lượt S4.**

Giao tiếp.

11. **Thợ đứng chờ người thì tự ghi yêu cầu `can-nguoi`** — kể cả chờ hộp quyền trong lượt chấm — không chỉ hỏi bằng chữ
    trong hội thoại (giới hạn «Mù» của gói: hộp quyền trong tác tử Workflow có thể không tới giám sát).
12. **Một cửa.** Chủ kho nói với phiên giám sát của đợt. Cổng Đáng của mọi hàng gom về thẻ khởi tạo của giám sát (một
    lần cho cả đợt); ô đã ký `build` ở phiên thợ trước khi đợt mở thì giữ nguyên. Cổng Phạm vi và Cổng Bằng chứng ký ở
    phiên thợ của hàng.
13. **Trả lời chủ kho bằng tiếng Việt, tiếng sản phẩm.** Mỗi tin tối đa một quyết định, trả lời một chạm.
14. **Tin giữa các phiên** mở đầu `[<nguồn> → <đích>] <loại>` — `yeu-cau` · `tra-loi` · `bao` · `hoi`.
