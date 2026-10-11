---
schema_version: 1
feature: Sửa năm lỗi của gói dieu-phoi chặn đợt thử crm/OneFlow — chẩn đoán không mời mở chip lần hai (D4), lời ghi danh không trỏ hàng đã gộp hay dãy nghỉ (D1), bộ phát lịch chỉ giao hàng đã quyết build (B1), lịch 30′ của mo-dot đọc hạn mức (E2), thẻ thôi hỏi khẩu vị hạn mức (E1)
slug: dieu-phoi-sua-truoc-dot-thu
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli, config, docs]
status: signed-off
design_doc: docs/superpowers/specs/2026-10-11-dieu-phoi-sua-truoc-dot-thu-design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-11T09:33:53Z
---

# Acceptance Contract: dieu-phoi-sua-truoc-dot-thu

## Context

Gốc: ô dù `_acceptance/dieu-phoi-tho-trong-kit/` (Cổng Đáng build 09/10, timebox 07/11). Vòng chạy dưới Cổng
Đáng ấy như DP2, DP7, không có `opportunity.md` riêng. Lượt rà hạt giống trước đợt thử của phiên Điều phối M5
(11/10) gọi sáu lỗ là CHẶN-THỬ cho đợt thử crm ~26/10 và OneFlow ~27/10. Vòng này nhận năm lỗ. Cả năm là chỗ hồ
sơ đã ký hứa một điều mà vật làm khác — sai hợp đồng của DP2 `dieu-phoi-mo-dot-mot-lenh`, DP3
`dieu-phoi-tiep-tuc-mot-lenh`, DP4 `dieu-phoi-doi-tai-khoan` — nên máy sửa vật. Nguồn từng lỗ: hạt giống
`docs/plans/2026-10-11-hat-giong-tiep-tuc-dieu-phoi-sau-dp3.md` lỗ 1 (D1) và lỗ 4 (D4) · hạt giống
`docs/plans/2026-10-10-hat-giong-mo-dot-dieu-phoi-sau-dp2.md` lỗ 1 (B1) · DP4 Ngoài-1 (E1) và Ngoài-2 (E2).
Thiết kế thi công và năm chỗ chọn: design doc ở frontmatter.

Thứ tự thi công: AC-1 → AC-4 trên `main` ngay. AC-5, AC-6 sống trong mã của DP4 (đã ký, chưa gộp), nên làm sau
khi DP4 vào `main` (gộp `main` vào nhánh bằng merge). Một lượt S4 cho cả vòng.

Thuật ngữ:
- **dãy**, **mã phiên**, **nhịp sống**, **kho thử**: như hồ sơ DP3.
- **hành động của dãy** = giá trị `hanh_dong` mà `keHoachDay` (`tiep-tuc.mjs`) trả cho một dãy. `chan-doan` và
  `tiep-tuc` đọc cùng hàm.
- **quyết của hàng** = `da-quyet` · `cho` · `khong-build`, đọc bằng `quyetCua` (`the.mjs`, dời từ `tho.mjs` để
  thẻ, thợ và bộ phát lịch gọi cùng một hàm) → `trangThaiQuyet`. Hàng không mang `ma`, và hàng đã có
  `contract.md`, là `da-quyet`.
- **đợt mở từ gói** = đợt có `nguon_goi` trong `dieu-khien.json` (thẻ khởi tạo đã hỏi `build` cho từng hàng);
  **đợt dựng tay** và **đợt cũ** (khuôn 07/10) không có.
- **nhịp thật** = một lần `taoVong(...)()` của `phat-lich.mjs` trên thư mục đợt do `mo` thật dựng.

## Criteria

- AC-1: Given một đợt mở từ gói ở pha `dang-chay`, bộ phát lịch đang chạy, một nhịp thật đã ghi `tiep/`, phiên giám sát có nhịp sống (hook thật ghi), và hai dãy `P1`, `P2`, mỗi dãy một hàng đã quyết `build` và không phiên sống (đúng trạng thái sau bước 6 của `mo-dot`), When chạy `chan-doan --json` hai lần rồi `chan-doan --json --chi-tiet`, Then không mục nào `thieu`; `day:P1` và `day:P2` là `du`, `chi_tiet.hanh_dong` là `mo-chip`, `viec` nêu «chờ người bấm chip», `ghi_danh` mang `/feature-loop:feature-loop <slug của hàng>`; số mục mang `mo-chip` đúng bằng 2; hai lần chạy trơn cho đầu ra bằng nhau. Trạng thái của mọi mục `day:*` lấy từ MỘT bảng hành động → trạng thái trong `tiep-tuc.mjs`; tập khoá của bảng bằng tập giá trị của `HANH_DONG` (so tập), và bảng so sâu bằng bảng viết trước đủ bảy khoá: `khong`, `mo-chip`, `khong-hang` → `du`; `nhan-giang-lai`, `worktree-mat`, `cho-nguoi`, `chua-biet` → `thieu`. Chiều đỏ: bản sao bảng xếp `mo-chip` là `thieu` → ca nêu «day:P1 thieu — bước 7 mở chip lần hai»; bản sao xếp `nhan-giang-lai` là `du` → ca nêu «nhan-giang-lai».
- AC-2: Given `dieu-phoi/commands/mo-dot.md` và `tiep-tuc.md`, When đọc thân lệnh, Then bước 6 của `mo-dot` mở chip chỉ cho các dãy mà `chan-doan --json --chi-tiet` trả hành động `mo-chip`, với nguyên văn `ghi_danh`; bước 7 nói dãy `mo-chip` là chờ người bấm, không mở lại, và đếm k từ các mục ấy; bước 1 đưa đợt đã chạy về bước 6 CHỈ khi phiên này chưa làm bước 6 (câu điều kiện nằm ở bước 1); bước 5 của `tiep-tuc` đếm k cùng cách; trình tự của DP2-AC-1 giữ nguyên (ca `DP2-01 ba-lenh` xanh). Đối chứng: chạy cùng các điều kiện trên thân lệnh ở mốc so (bản trước vòng, rút bằng `git show`) — mỗi điều kiện mang thay đổi phải ĐỎ ở đó, điều kiện xanh sẵn ở bản cũ được in là «giữ nguyên». Chiều đỏ: bản sao `mo-dot.md` có bước 7 trở về nguyên văn bản trước vòng → ca nêu «mo-dot.md bước 7».
- AC-3: Given ma trận dãy viết sẵn — mỗi hàng một đợt mở từ gói, phiên giám sát có nhịp sống, dãy `P1` không phiên sống, một nhịp thật (trừ hai hàng chưa có nhịp) — (a) hàng duy nhất của `P1` đã ký trong worktree `P1` (hết hàng) · (b) `P1` nghỉ (`hang nghi P1`) · (c) hàng của `P1` chờ một hàng của `P2` chưa gộp · (d) hàng đầu của `P1` đã ký, hàng kế đã quyết `build` · (e) chưa nhịp nào, `P1` có hàng A · (f) chưa nhịp nào, `P1` nghỉ · (g) hàng duy nhất của `P1` mang mã, không có gì trong `_acceptance/` (nhịp ghi `tiep/P1.json` bằng đúng `{hang: null, cho: "cong-dang"}` — đối chứng đầu vào) — When chạy `chan-doan --json --chi-tiet` và `tiep-tuc --nhe --json`, Then hành động lần lượt `khong-hang` (lý do `xong`) · `khong-hang` (`nghi`) · `khong-hang` (`phu-thuoc`) · `mo-chip` với ghi danh `/feature-loop:feature-loop` hàng kế · `mo-chip` với ghi danh hàng A · `khong-hang` (`nghi`) · `khong-hang` (`cong-dang`); hai lệnh trả cùng hành động; không lời ghi danh nào nêu slug của hàng đã ký hay đã gộp; mục `day:*` mang `khong-hang` là `du`; `tiep-tuc.md` có dòng xử lý `khong-hang` (ca `DP3-01 trinh-tu` xanh). Chiều đỏ: bản sao bỏ nhánh «`tiep` hết hàng» (rơi về hàng ưu tiên đầu) → (a) ra `mo-chip`, ca nêu «(a) mời làm lại»; bản sao bỏ xét `nghi` → (f) ra `mo-chip`, ca nêu «(f)»; bản sao chỉ chép lý do khi `cho` là `phu-thuoc` (còn lại rơi về hàng ưu tiên đầu) → (g) ra `mo-chip`, ca nêu «(g)».
- AC-4: Given ma trận quyết viết sẵn — mỗi hàng một đợt MỞ TỪ GÓI ở `dang-chay`; dãy `P1` có hàng A (ưu tiên 1, mang mã) và hàng B (ưu tiên 2, mang mã, ô `decision: build`) — When chạy một nhịp thật rồi đọc `tiep/P1.json`, Then: A có ô `build` → A; ô của A sinh bằng bộ ghi thật (`lo-trinh.mjs --mo-o` từ khuôn ô của kit) rồi dòng `decision:` đổi thành `build` như bước 4 của `mo-dot` (giữ chú thích sau giá trị) → A; ô ấy giữ nguyên như bộ ghi sinh (`stage: discovery`) → B; ô `build` của A chỉ ở worktree `P1` → A; A có `contract.md`, không ô → A; A không mang mã → A; A không có gì trong `_acceptance/` → B; ô của A `stage: discovery` chưa có `decision` → B; ô của A `park`, `kill`, `iterate` (ba hàng) → B; đợt chỉ có A và A `park` → `xong: true`; đợt chỉ có A và A không có ô → `hang: null`, `cho: cong-dang`. Ca in số hàng == độ dài ma trận. Trên cùng đợt, mọi hàng `the khoi-tao --json` xếp vào `canh_bao` hay `cho_cong_dang` không bao giờ là `tiep.hang` (so thẻ ↔ `tiep/`), và ở các hàng A vắng, `discovery`, `park`, `kill`, `iterate` tập ấy khác rỗng (in ra) trước khi tin vào giao rỗng. Quyết đọc bằng `quyetCua` (một nguồn với thợ và thẻ). Đường đọc-cũ: đợt cũ crm (fixture `dot-crm-0910` của DP1 — đợt dựng tay, mọi hàng mang mã, không ô nào) qua một nhịp thật thì `tiep/` của MỌI dãy bằng đúng kết quả `chonHangKe` không bảng quyết trên cùng tiến độ (B1 không áp cho đợt không mở từ gói). Chiều đỏ: bản sao `phat-lich.mjs` gọi `chonHangKe` không kèm bảng quyết → hàng `park` ra `tiep`, ca nêu «park được giao»; bản sao `the.mjs` có `trangThaiQuyet` đọc `park` thành đã quyết → hàng `park` ra `tiep` VÀ thẻ thôi cảnh báo hàng ấy, ca nêu cả hai; bản sao `phat-lich.mjs` lọc mọi đợt → ca đợt cũ nêu «đợt cũ bị lọc» kèm dãy.
- AC-5: Given `mo-dot.md` và `tiep-tuc.md` sau khi gộp DP4, When đọc thân lệnh, Then việc mỗi lần lịch 30′ chạy (gọi `get_usage` → `han-muc --nguon get-usage` → `danh-thuc --json` → làm đúng `hanh_dong`) nằm trong khối marker `LICH-30` ở CẢ HAI lệnh, và hai khối byte-bằng nhau; bước 6 của `mo-dot` không còn câu dựng lịch «đọc `trang-thai.json` … in một dòng» — câu ấy phải CÓ MẶT ở `mo-dot.md` của mốc so (`main` đã gộp DP4) trước khi tin rằng nó vắng ở HEAD. Chiều đỏ: bản sao `mo-dot.md` có khối `LICH-30` thiếu `han-muc` → ca nêu «mo-dot.md: khối LICH-30 lệch tiep-tuc.md».
- AC-6: Given một đợt mở từ gói khai `han_muc`, When chạy `the khoi-tao --json` (sau khi gộp DP4), Then mọi phần tử của `hoi` là `quyen-tu-merge` hoặc `build:<slug>` — không có `khau-vi-han-muc`; trường `han_muc` vẫn mang đúng bốn số của đợt; bước 3 của `mo-dot.md` in ngưỡng thành một dòng thông tin, không phải câu hỏi, và nêu chỗ sửa (`dieu-phoi.config.json` của gói đợt). Chiều đỏ: bản sao `the.mjs` thêm lại `khau-vi-han-muc` → ca nêu «hoi khau-vi-han-muc không có lối ghi».
- AC-7: Given cây sau thay đổi, When chạy suite `tests/dieu-phoi/**`, bộ kiểm gói (`kiem-validate.mjs`) và ca LB1, LB2, Then mọi ca xanh. Mỗi ca của các tệp ca đã ký (`dong-goi`, `mo-dot`, `tiep-tuc`, `trong-dot`, `doi-tai-khoan`, `loi/`) bị đổi thân hay bị bỏ — có một dòng sổ `fix` của hồ sơ này nêu đúng tên ca. Mốc so: lịch sử HEAD có commit gộp mang tiêu đề «Merge pull request #<n> from <chủ>/vong/dieu-phoi-sua-truoc-dot-thu» → so từ điểm rẽ của hai cha tới cha-2 (khuôn DP7-10); không có → so từ `merge-base HEAD origin/main` tới HEAD. Commit gộp `main` VÀO nhánh không bao giờ được chọn làm mốc. Ca in mốc đã chọn và danh sách tên ca đổi thân. Bộ chọn mốc có ca riêng trên kho git tạm do code sinh: nhánh `vong/dieu-phoi-sua-truoc-dot-thu` đổi một ca, `main` đổi một ca khác, `git merge main` vào nhánh → danh sách bằng đúng {ca của nhánh}; gộp nhánh vào `main` bằng `--no-ff` với tiêu đề PR → danh sách y hệt. Chiều đỏ: sổ trên bản sao thiếu một tên → ca nêu tên ca chưa có dòng sổ; bộ chọn trên bản sao nhận mọi commit gộp mang tên nhánh → ca kho tạm nêu ca của `main` lọt vào danh sách.
- AC-8: Given README của gói và `CONTEXT.md`, When đọc, Then README nêu: bộ phát lịch chỉ giao hàng đã quyết `build`; giá trị chờ `cong-dang`; `bao-giam-sat` là lưới khi quyết đổi sau nhịp; chip chỉ mở cho dãy `mo-chip`, dãy `khong-hang` không có chip. Mục «Hàng kế của dãy» trong `CONTEXT.md` nêu «đã quyết build». Chiều đỏ: bản sao README bỏ `cong-dang` → ca nêu «README thiếu cong-dang».

## Coverage

Bỏ quét bằng skill `morphological-scan` — dòng sổ `descope` «bỏ coverage-scan — …». Phạm vi là danh sách năm
lỗi đã chốt từ lượt rà hạt giống của Điều phối, không phải một không gian cần liệt kê cho đủ. Không gian trạng
thái của từng lỗi nằm ở ma trận trong AC:

- Trục A · hành động của dãy (D4, D1): `khong` · `nhan-giang-lai` · `mo-chip` · `worktree-mat` · `cho-nguoi` ·
  `chua-biet` · `khong-hang` → AC-1 (bảng trạng thái so tập), AC-3. [thước CE: hằng `HANH_DONG`]
- Trục B · trạng thái `tiep/` của dãy (D1): có hàng · hết hàng · nghỉ · chờ phụ thuộc · chờ Cổng Đáng (`cong-dang`, giá trị B1 thêm) · vắng → AC-3.
  [thước CE: các nhánh trả của `chonHangKe`]
- Trục C · quyết của hàng × tiến độ (B1): ô `build` (kho chính · worktree · ô do bộ ghi thật sinh) · hợp đồng · không mã · vắng ·
  `discovery` · `park` · `kill` · `iterate` → AC-4. [thước CE: nhánh của `trangThaiQuyet` + ma trận DP7-AC-3]
- Trục D · lệnh người (D4, E2, E1): `mo-dot` bước 1, 3, 6, 7 · `tiep-tuc` bước 3, 5 → AC-2, AC-5, AC-6.

## Out of scope

- Lớp mod (DP6b), lõi DP6 (lỗ G0 của lượt rà), vai cấp máy.
- Các lỗ còn lại của hai hạt giống: DP3 Ngoài-2, Ngoài-6; DP2 Ngoài-3, -4, -16, -17, -19. Lỗ của DP4 ngoài E1,
  E2 (Ngoài-3, Ngoài-11).
- `slugKeCua` của `ghi.mjs` (gắn slug vào đơn xin của thợ): bản chép thứ ba của lối rơi, đã ghi Known limits ở
  DP3 (Ngoài-4). Nó chỉ xếp hạng đơn, không mời mở chip.
- Mời mở chip khi một dãy đang chờ có hàng: chỉ `tiep-tuc` dạng đủ mời. Trước vòng này cũng không có lời mời nào
  đúng cho ca ấy.
- Việc của app (chip, Monitor, lịch, tin liên phiên) chỉ có trong thân lệnh người; không phép đo máy nào chạy
  chúng.

## Notes

- Giới hạn đã khai (chỗ chọn 3, sửa ở S3 sau khi đo fixture crm): đợt dựng tay và đợt cũ không lọc theo quyết.
  Cổng Đáng của hàng vẫn ở S0 của thợ (khối TRONG-DOT gửi `hang-moi` cho giám sát), và hàng có ô park/kill
  trong đợt dựng tay vẫn được giao rồi dừng ở gác `bao-giam-sat` như trước vòng.
- Giới hạn đã khai (chỗ chọn 1): máy không phân biệt «chip chưa mở» với «chip đã mở, chưa bấm». Một phiên MỚI gọi
  lại `mo-dot` trên đợt đang chạy sẽ mở chip lại — đúng giới hạn `tiep-tuc` đã có từ DP3.
- Vế E1 (tiêu chí AC-6) đảo vế «`the khoi-tao --json` có `khau-vi-han-muc` trong `hoi`» của DP4-AC-4. Chủ kho đã định tuyến lỗ
  này «mở hợp đồng mới» ở Cổng Bằng chứng của DP4 (Ngoài-1). Hồ sơ DP4 đã ký nên không sửa; dòng sổ của hồ sơ
  này ghi việc đảo.
- **Known limits (Cổng Bằng chứng, ký 11/10, owner định tuyến «ghi Known limits»):** hàng phụ thuộc vào hàng đã
  quyết park/kill treo im ở `phu-thuoc` (Ngoài-2) · lối rơi khi `tiep/` vắng mời hàng ưu tiên đầu không xét quyết
  (Ngoài-4) · SDT-07 gán thay đổi phần dựng dùng chung cho một ca (Ngoài-5) · SDT-07 so commit HEAD nhưng đọc sổ từ
  cây làm việc (Ngoài-6). Sổ: `docs/research/known-limits-ledger.tsv`.
- **Mở hợp đồng mới (Cổng Bằng chứng, ký 11/10):** Ngoài-1, Ngoài-3 — ghi hạt giống
  `docs/plans/2026-10-11-hat-giong-dieu-phoi-sau-sua-truoc-dot-thu.md`, không tạo ô.
