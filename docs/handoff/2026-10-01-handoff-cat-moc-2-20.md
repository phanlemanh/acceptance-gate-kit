# Bàn giao — đổi máy để cắt mốc 2.20.0

**Ngày:** 2026-10-01 · **Từ:** phiên điều phối trên máy đang chạy các vòng crm (memory của phiên này KHÔNG theo sang máy khác — tệp này thay nó) · **Việc kế:** cắt mốc `2.20.0` ở máy khác, rồi đưa crm nhận.

> **Cập nhật 02/10:** mốc 2.20.0 đã cắt ở máy kia — #236 gộp (`1e764895`), tag `v2.20.0` → `1b98fdb1`, chiến dịch ghim lại #237 gộp (`1b598830`, sáu hồ sơ). Máy gốc đã kéo `main` và cài 2.20.0 ở phạm vi user và kho kit (kiểm bằng nội dung: bản cài khớp `main`). Mục 3 là sử liệu; việc còn mở là mục 4 — crm CHƯA nhận: lớp chép lệch đúng ba tệp đã nêu ở mục 2, bản ghi cài của crm còn 2.19.0, chờ vòng `soan-okr-cung-tro-ly` xong.

Owner gọi tên việc này ngày 01/10 («tạo chip cắt mốc phát hành», «tôi sẽ chạy ở máy khác»). Chạy ở máy khác là hợp lý: máy gốc đang dành cho vòng chấm cuối của crm `soan-okr-cung-tro-ly`, bộ kiểm của mốc là việc nặng.

## 1. Trạng thái lúc bàn giao

- `main` = `c5441314` (gộp PR #234). Tag gần nhất `v2.19.0` → `7f45f37d`.
- Phiên bản hiện tại: `acceptance-gate 2.19.0 · feature-loop 2.19.0 · diagram-design 2.7.0`.
- Cửa sổ `v2.19.0 → main` có ba hồ sơ và một PR tài liệu. Kiểm bằng máy, không kể tay (`scripts/rel-cua-so.sh`, `git log --merges v2.19.0..origin/main`):
  - `thuoc-biet-truoc-khong-phan-duoc` — T2, owner ký 01/10, PR #233 (`99c030da`).
  - `nghi-van-mang-co-qua-han` — T2, máy thông, cửa veto mở, PR #232 (`0926b5a4`).
  - `luot-cham-ghi-vao-cay` — T3, owner ký 01/10, PR #234 (`c5441314`).
  - PR #231 (`32a9774f`) — một dòng `CONTEXT.md`: `_Avoid_` của «đạt-có-giới-hạn» về đúng term.
- **Vì sao là 2.20.0, không 2.19.1:** cửa sổ thêm hành vi mới ở đường chấm — bước chuẩn bị tham số từ chối một loại eval, bộ chấm có một nhãn trạng thái mới, lưới trước-merge và bộ kiểm lại bằng chứng đọc nhãn đó.

## 2. Ba vòng đã giao gì

- **Giám khảo chỉ được hỏi điều nằm trong danh sách tệp.** `feature-loop/scripts/s4-args.mjs` thoát 2, gọi tên eval, khi một eval `judgment` hỏi diff của lượt hoặc bảo chạy lệnh (bộ dò một nguồn `feature-loop/scripts/lib/hoi-ngoai-inputs.mjs`). Luật chọn người chấm theo từng vế ở `eval-executors.md`, hai SKILL và `judge-personas.md`; gap-probe thêm một ý. Neo: `crm/_acceptance/va-tro-ly-okr-sau-thu`. Bản ghi: `docs/findings/2026-10-01-thuoc-biet-truoc-khong-phan-duoc.md`.
- **Hồ sơ đã nghỉ vẫn mang cờ quá hạn.** Ca RT13 đỏ theo NGÀY trên `main` từ 01/10 (timebox «muộn nhất 30/09» của một hồ sơ đã nghỉ) đã hết.
- **Phát hiện cây đổi trong lượt chấm.** Lượt mà tác tử chấm ghi vào cây (commit lạ hoặc tệp vật bị sửa) không dùng được; nhãn đi qua một nguồn `lib/nhan-canh-gay.cjs`, thẻ Cổng Bằng chứng, lưới trước-merge và `recheck-evidence.cjs` cùng đọc. Neo: `crm/_acceptance/hydrat-giai-doan-deals` (30/09, kit 2.19.0) và `claimdue-chi-thay-dong-cua-minh` (24/09).

**Lớp CI mà kho tiêu thụ chép về CÓ đổi lần này** (so khối `INIT-CI-COPY-LIST` / `GUIDE-CI-COPY-LIST`), ba tệp: `lib/nhan-canh-gay.cjs`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`. Triển khai sang kho tiêu thụ vì thế gồm CẢ chép lại ba tệp LẪN cài lại plugin.

## 3. Cắt mốc 2.20.0 — các bước (theo tiền lệ `release-2-19-0`, làn V)

0. **Máy mới:** `git fetch origin --tags`, kiểm `git log -1 origin/main` là `c5441314` hoặc mới hơn; `gh auth status`; plugin kit đang cài phải là 2.19.0 ở phạm vi user (kit tự chạy cổng của chính nó bằng plugin đã cài — bản cũ hơn sẽ chấm bằng luật cũ). Danh tính ký suy từ `git config user.name` của máy đó (máy này ký «Manh Phan», máy kia từng ký «Phan Le Manh») — để nguyên, đừng sửa cho khớp.
1. Nhánh `release/2-20-0` từ `origin/main`. Mở hồ sơ `_acceptance/release-2-20-0/` bằng `/feature-loop:feature-loop` (T2, làn V), chép khuôn sáu tiêu chí của `_acceptance/release-2-19-0/contract.md` và đổi số: hai manifest (`.claude-plugin/plugin.json`, `feature-loop/.claude-plugin/plugin.json`) cùng `2.20.0`, `diagram-design` giữ `2.7.0` · dòng «Khớp phiên bản» ở `GUIDE.md` dòng 5 · các lệnh suite của lượt chấm xanh + `product-map --check` khớp · `rel-cua-so.sh` với mốc `7f45f37d` và ba slug của cửa sổ thoát 0 · `git diff --stat v2.19.0 -- diagram-design/` rỗng · mô tả hai plugin có mục `v2.20.0`, `feature-loop` tự khai «pairs with acceptance-gate >= 2.20.0».
2. `CHANGELOG.md` mục 2.20.0 bằng tiếng sản phẩm: kho tiêu thụ được gì, phải làm gì khi nhận (chép ba tệp + cài lại plugin).
3. **Năm dòng số (luật chiều rộng c)** cho từng vòng của cửa sổ, đọc từ sổ và nhật ký thật (`decisions.jsonl`, `run-log.jsonl`, `usage-report.md` của từng hồ sơ). Dữ kiện để đối chiếu, không để chép: vòng `thuoc-biet-truoc…` có hai lượt chấm, lượt 1 REJECT chỉ vì suite đỏ sẵn RT13 ngoài vật — đó là một lượt bị hạ tầng kit đốt; vòng `luot-cham-ghi-vao-cay` lượt chấm 1 bị ngắt giữa chừng vì đóng máy rồi nối lại. Điều kiện tin cậy của dòng 4–5: vòng T3 đã đổi thành phần đường verdict, phải nêu răng hai chiều của nó.
4. **Dòng hiệu chuẩn** (ADR 0020) bằng `scripts/hieu-chuan-moc.mjs`; N không tăng thì nói vô hiệu.
5. **Notes của hồ sơ mốc** (không mở ô) — bốn mục có ca thật trong cửa sổ:
   - thuế tự-host: vòng ở kho kit đi tới «máy thông» phải khai một dòng vào khối `KHAC-BIET-DOC-CU` của `ra-co-ten-lam-va-trao` rồi ghim lại hồ sơ đó (`docs/plans/2026-10-01-hat-giong-thue-tu-host-rt13-may-thong.md`); PR #232 đỏ CI hai lần liên tiếp vì đúng việc này;
   - phép đo dài hơn trần 600 giây của làn máy — ca thật thứ hai: crm `soan-okr-cung-tro-ly` (01/10) có một phép đo chạy 35 phút, phải khai không-chạy và đo ngoài lượt chấm; cùng vòng đó hai phép đo dài tranh một khoá cộng lại vượt trần, phải đưa thêm một phép ra ngoài lượt;
   - tham số lượt chấm bằng đường tệp — hai lần trong ngày: 35 KB ở kit, 196 KB ở crm, cả hai phải sinh bản bộ chấm nhúng tham số khác bản gốc đúng một dòng;
   - ca thật đầu tiên cho hạt giống «bất biến sản phẩm»: ở crm, thước quyền xem OKR nằm trong `rang/` của một hồ sơ đã ký nên tắt im hai ngày — lưới stale chỉ soi hồ sơ có tệp trong diff PR, năm lời đọc lọt qua hai PR có cổng xanh, vòng chạm hồ sơ kế tiếp gánh nợ và không ghim lại được.
6. Chạy bộ phép đo của hồ sơ mốc và bộ test của kit; dán kết quả thật.
7. Đẩy, mở PR `release/2-20-0` → `main`. Trình owner thẻ Cổng Bằng chứng: một khuyến nghị, căn cứ đọc trong một phút, một chạm.
8. Sau khi owner ký và nói gộp: gộp, tag `v2.20.0` tại commit ký, đẩy tag. Chiến dịch ghim lại: lưới trước-merge với `--base v2.19.0`, một làn máy cho các hồ sơ bị chạm, PR `repin/2-20-0`.

## 4. Đưa crm nhận 2.20.0 — KHÔNG làm ngay

crm đang có vòng `soan-okr-cung-tro-ly` (T3) ở lượt chấm cuối trên máy gốc; không đổi engine dưới chân một vòng đang chạy. Dừng sau bước 8 và báo owner. Khi owner báo vòng đó đã ký và gộp:

- đo trước → sau bằng phép vi phân trên crm (bản chép cũ so bản mới), không đọc số tuyệt đối;
- một PR ở crm chép lại ba tệp ở mục 2;
- cài lại plugin mọi phạm vi trên MỖI máy có phiên crm (máy gốc có nhiều cây phụ — bản ghi cài của cây phụ quy về gốc, kiểm từng bản ghi thay vì tin câu «đã mới nhất»), rồi mở lại các phiên.

Các kho khác (radar, oneflow, media-library) theo nhịp owner gọi.

## 5. Bẫy đã gặp (máy mới không có memory của chúng)

- Đổi `status` của hồ sơ mốc — kể cả bằng amend — mà không chạy lại `scripts/product-map.mjs` thì lượt đo đỏ ở P122, P126 và `product_map`. Vẽ lại bản đồ mỗi lần đổi status, cùng commit.
- CI `gate` đỏ ở lượt đẩy TRƯỚC chữ ký là đúng thiết kế của làn V có Known limits.
- Owner có thể nói «đã gộp» khi PR còn mở — kiểm trạng thái PR trên GitHub trước bước 8.
- `pre-merge-check.sh` chạy thiếu `--base`, hoặc `--recheck-all` thiếu `--base`, báo mọi hồ sơ cũ là stale. Đó không phải thước của chiến dịch ghim lại.
- Kết quả CI của một PR hoá cũ khi nhánh gốc đi tiếp; lấy lại `main` rồi để CI chạy lại trước khi gộp nếu `main` đã đổi vùng liên quan.
- Hạt giống mới ở `docs/plans/` phải trỏ được về một ô (răng VC8 cũ trên `main`): để hợp đồng của hồ sơ mốc trích tên tệp.

## 6. Việc treo sau mốc (không mở việc trong mốc)

- crm: chip «đưa thước quyền xem OKR và danh sách miễn ra bộ kiểm chạy cho mọi PR» — đã đề xuất, owner chưa trả lời.
- crm: hai điều kiện trước khi BẬT Soạn OKR (đo lại độ trễ; sửa bên chấm rồi đọc lại vế gói thắng).
- Ngưỡng của hai răng mới sau khi crm cài: đếm bằng script quét ở `docs/findings/assets/2026-10-01-quet-judgment-hoi-ngoai-inputs.cjs` (số eval judgment hỏi ngoài inputs tới được lượt chấm phải về 0) và số lượt chấm mang nhãn «cây đổi».
