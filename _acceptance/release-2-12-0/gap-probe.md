---
slug: release-2-12-0
at: 2026-09-13T16:09:19Z
verdict: findings
p0: 3
p1: 3
p2: 3
---

# Phản biện context sạch — release-2-12-0

**CHẠY BÙ, không chạy đúng nấc.** Bước này thuộc S1, TRƯỚC Cổng Phạm vi. Chủ vòng bỏ
sót nó và Cổng 1 đã ký (`079197f2`) trên bộ artifact chưa qua phản biện. Lượt chấm 1 bắt
được bằng `gap-probe classify` trả `missing`, đối chứng dương là cùng lệnh trên
`release-2-11-0` trả `ok`. Sổ quyết định ghi sai sót này thành một entry có tên.

Một lượt, context sạch, đầu vào đúng năm nguồn: hợp đồng · evals · sổ quyết định ·
gap-probe của mốc trước · `CLAUDE.md`. Critic KHÔNG đọc mã nguồn kho — nó phán KẾ HOẠCH
phép đo. Sáu lỗi mà lượt chấm 1 đã bắt được nêu sẵn cho critic để nó tìm thứ KHÁC.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Xử lý |
|---|---|---|---|---|
| P0 | contract AC-2 + evals E2 | AC-2 hứa một QUAN HỆ («giữ **2.7.0**» — bằng số của mốc trước) nhưng răng chỉ kiểm một VỊ TỪ («không đổi kể từ lần cắt số của CHÍNH NÓ») rồi in ra bất kỳ số nào đọc được | Ở mốc sau nữa, `diagram-design` đã lên 2.8.0 rồi có commit khác. Ba chân đều xanh → in «giu 2.8.0», E2 XANH trong khi hợp đồng nói 2.7.0. Răng ghim lại được bằng cách rỗng nghĩa | **fixed**: thêm chân 7 vào `rang-moc.sh` (`--moc-truoc`), số so đọc từ manifest TẠI commit mốc trước; `expected` của E2 ghim chuỗi `giu 2.7.0 BANG so tai moc truoc`. Chiều đỏ chạy thật: trỏ vào mốc mang 2.5.0 → thoát 7 |
| P0 | contract Notes §1 + evals E4 | AC-4 đòi «mỗi số nói được nguồn rút» nhưng E4 là judgment `inputs: [contract.md]` — nó chấm LỜI KHAI. Hai số thời gian đang SAI: `cong-nguoi-doc-du-nguon` khai 39h01 (thật 14h11, lệch đúng 24h), `cua-veto-sau-chu-ky` khai 9h03 (thật 10h02) | Hội đồng đọc contract, thấy đủ bốn tiêu đề và đoạn «nguồn rút» → PASS. Ba dòng số — thứ owner dùng để quyết thu hồi luật NỚI — vào sử liệu với một con số sai 24 giờ | **fixed**: dựng `do-ba-dong-so.cjs` tính từ vật; tách E4a (script `--doi-chieu`, lệch một ô → thoát 5) và E4b (judgment chỉ chấm sự có mặt + lời khai lý do ô trống). Chiều đỏ: cùng lệnh trên bản cũ trả 7 chỗ lệch |
| P0 | evals E3c + `phan-lop-ha-tang.cjs` | `expected` của E3c DẶN BẰNG LỜI «lệnh đỏ phải phân lớp bằng máy trước khi tin». Bộ phân lớp nằm sẵn trong hồ sơ nhưng KHÔNG eval nào, khoá nào, dòng hợp đồng nào gọi nó — `grep` chỉ trả về chính nó. Lớp đang SỐNG: lượt 1 ghi `E3c exit 1` | Lượt sau: E3c đỏ, tác tử đọc câu dặn rồi «phân lớp» bằng lý lẽ — hoặc nói một màu đỏ thật thành xanh, hoặc đẩy một màu đỏ hạ tầng lên bàn owner, đốt trần ≤1 lượt gọi người của mốc. Hiến pháp: «cấm dặn-bằng-lời làm nghiệm» | **fixed**: thêm lối vào `--quet` cho bộ phân lớp và eval E3f gọi nó; gỡ hẳn câu dặn khỏi `expected` của E3c. Hai chiều đỏ chạy thật (dòng chưa phân lớp · dòng phân lớp `vat`) |
| P1 | evals E1 | E1 chấm bằng MÃ THOÁT CỦA TRỌN suite plugins. `ONLY_BLOCK` chỉ lọc khối đi qua `run()`; ~46 khối viết thẳng bằng echo+if vẫn chạy và vẫn cộng `failures` | Một khối rời không liên quan đỏ → E1 đỏ → tác tử báo «AC-1 đỏ, số 2.12.0 không nhất quán», owner bị gọi về một lần cắt số hoàn toàn lành. Đúng lớp hạ-tầng-tự-sinh-tín-hiệu-đỏ, ba cửa sổ liên tiếp | **fixed**: `rang-p200.sh` rút phán quyết từ dòng `PASS: P200` của chính ca, đòi đúng một dòng; ba lối hỏng có mã thoát riêng |
| P1 | contract Context + Đường đo | Ba số mang toàn bộ lý do tồn tại của mốc (493/27/253) chỉ có một dòng chữ: không lệnh, không script, không sha. Cột «sau mốc» còn khẳng định «8 trên 8 kho chạy bộ bóc mới» — kết quả do rollout sinh ra, mà rollout ở Out of scope | Rollout dừng giữa chừng như 2.11.0 (3/6 gộp). Hồ sơ đã ký vĩnh viễn mang «253 cứu được, 8/8» — con số duy nhất nối mốc với north star không bao giờ bị bác được | **fixed**: dựng `do-gia-tri-tieu-thu.cjs` gom theo KHO GỐC kèm sha; thêm AC-5 + E5 ghim tổng. Số đổi: **182 trên 8 kho gốc**, vì 253 đếm `artifact-platform` hai lần. `Đường đo` tách hai cột, dòng «đã chép lớp mới» ghi 0/8 |
| P1 | contract Notes §1 (luật (c)) | Cửa sổ đóng 5 vòng nhưng nguồn rút DUY NHẤT cho cột «gọi người» là «đếm tay từ sổ tay phiên», thứ chỉ tồn tại cho 1 trong 5 vòng | Bổ sung đủ 5 dòng → 4 dòng dùng lại y nguyên mệnh đề «để trống có chủ ý». Luật (c) còn cái bảng, mất cái răng; owner đọc «hai mốc liên tiếp vượt trần» trên mẫu n=1 | **fixed**: thêm cột «gọi người (cận dưới)» đếm entry mang dấu người trong `decisions.jsonl` — vật đã có trong kho, không dựng phép đo mới. Khai MỘT lần rằng đó là cận dưới. Ô đếm-tay thật chỉ có ở vòng chạy trong phiên này (14 lượt) |
| P2 | contract Notes §2 + Context | «99 commit» ghim vào cặp neo sai; cặp đúng cho 130. Neo cuối `97e2d713` cũng không phải cây được phát hành | Sửa sha đầu rồi để nguyên 99 → hợp đồng nhất quán bề ngoài, sai bên trong | **fixed**: neo `45e5f1d8..HEAD`, 130 commit; E4a đối chiếu số commit với `rev-list --count` nên nó không thể trôi nữa |
| P2 | contract Notes §2 | «Danh sách chín mục KHÔNG có mục mới» là khẳng định về một danh sách MÁY GIỮ (marker `INIT-CI-COPY-LIST`) mà judge không được đọc | Cửa sổ sau thêm mục thứ mười; bảng vẫn 9 dòng, judge vẫn PASS, consumer chép thiếu → CI kho tiêu thụ đỏ. Đúng sự cố crm-onehub 05/09 | **ghi ô, không vá**: khai thẳng giới hạn này ở Notes §2 và đưa đường vá (eval round-trip marker↔bảng, nâng `consumer-esm.test.mjs` từ `>= 7` lên bằng số mục rút được) vào §4 làm nhát cắt cho cửa sổ kế |
| P2 | evals.yaml chú thích đầu tệp | Chú thích khai «`baseline` đọc là n-a cho E1 và E2» nhưng `baseline` là trường của evidence-report, không phải của evals.yaml; và sổ máy liệt E2 là CÓ phân biệt — lý do cơ học: răng của hồ sơ không tồn tại tại commit gốc | Người đọc sau tin E2 phân biệt được cây trước/sau mốc, trong khi nó chỉ phân biệt được sự tồn tại của chính tệp nó | **fixed**: viết lại chú thích cho đúng vật, nói rõ mọi khối eval của hồ sơ này phải đọc `baseline: n-a`, và bằng chứng phân biệt thật nằm ở chiều đỏ của từng răng |

**7/9 đã sửa artifact, 1 ghi ô có tên (P2 danh sách chín mục), 1 sửa lời khai.** Không
finding nào lật một quyết định đã ghi trong sổ. Ba finding P0 đều thuộc cùng một lớp:
**lời khai đứng thay cho phép đo** — hai lần ở hợp đồng, một lần ở `expected` của eval.
