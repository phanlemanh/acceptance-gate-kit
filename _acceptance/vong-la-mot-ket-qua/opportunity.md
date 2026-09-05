---
schema_version: 1
slug: vong-la-mot-ket-qua
feature: Một vòng = một KẾT QUẢ người thấy được — S1 cắt vòng theo kết quả, AC ở tầng kết quả, cơ chế canh bằng bản phá
owner: phanlemanh@gmail.com
stage: decided
decision: build
decided_by: Manh Phan
decided_at: 2026-09-04T01:30:00Z   # ISO UTC — mốc phát ngôn «ký cổng đáng» trong hội thoại 04/09, máy ghi hộ
prototype:
  base_commit:
  disposition:
---
## Vấn đề & ai gặp

Người lập kế hoạch bằng kit (owner media-library, 04/09/2026) cắt một kế hoạch bàn giao thành
**13 hồ sơ theo GỐC KỸ THUẬT** — cụm chìa & người, cụm cây thực thể, cụm thước đo… — và chính owner
phải chỉ ra: *không hồ sơ nào tự giao được một cửa*, và 13 lần cổng là 13 lần trả phí cố định
(hợp đồng · eval · gap-probe · thẻ · hai cổng người · re-pin hồ sơ bị chạm · STATUS). Cắt lại theo
**kết quả người thấy được** còn 5 vòng; ước lượng ~25 lượt chấm thay 52.

Vì sao kit để lọt: S1 của `feature-loop` chỉ ràng **số** AC (5–15, «Core >15 → hợp nhất») và
`contract-template.md` chỉ đòi AC «independently checkable». Không chỗ nào hỏi *vòng này kết thúc
thì người thấy gì khác*, và không chỗ nào cấm AC đo **cơ chế** (RPC, lease, phash, chỉ mục) thay vì
**kết quả**. Hệ quả ở đầu kia: vòng lớn mà AC chấm cơ chế thì nổ vòng — `ban-dieu-khien-curator`
(media-library) tốn **13 lượt chấm**; `undo-hoan-tac-qua-tay` 6; `nut-hoan-tac-va-loi-co-ten` 4 với
34 finding, ba lớp cùng tên.

Bằng chứng thực địa: media-library `docs/plans/2026-09-04-ke-hoach-ban-giao.md` (bản 1 → bản 2 cùng
ngày) · `CLAUDE.md` media-library, bài học có răng ghi 04/09 · sử liệu vòng chấm ở
`_acceptance/{ban-dieu-khien-curator,undo-hoan-tac-qua-tay,nut-hoan-tac-va-loi-co-ten}/evidence-report.md`.

Đây là **meta-work** (kit sửa thước của kit) — theo bất biến maintainer, mặc định ĐÓNG BĂNG: ô này
vào sổ, vòng chỉ mở sau mốc phát hành gần nhất hoặc khi owner gọi tên. Repo tiêu thụ đã tự bảo vệ
bằng một dòng `CLAUDE.md`; kit chưa.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Cắt theo kết quả giảm số lượt chấm trên mỗi kết quả ship (phí cổng trả ít lần hơn) mà không làm mỗi vòng nổ | Vòng lớn tốn nhiều lượt chấm hơn tổng các vòng nhỏ — chỉ đổi chỗ chi phí | Đếm lượt chấm 5 vòng A–E của media-library khi chúng chạy, so với trung bình 4–6 của 13 hồ sơ gần đây | Chưa thử — đang là kế hoạch |
| 2 | Cái giữ vòng lớn không nổ là AC ở tầng kết quả (ngưỡng người thấy), KHÔNG phải số AC | Vòng lớn với AC kết quả vẫn 10+ lượt chấm | Đối chiếu sử liệu: `ban-dieu-khien-curator` 13 lượt có bao nhiêu AC đo cơ chế; `cua-nguon-thong-nhat` 7 vòng chấm | Chưa thử — sử liệu có sẵn, không cần dựng |
| 3 | Máy phân biệt được «AC đo cơ chế» với «AC đo kết quả» bằng heuristic rẻ (Then nhắc định danh mã — tên hàm/bảng/cột trong backtick — mà không nhắc thứ người/agent thấy) | Heuristic bắn giả nhiều ⇒ lint thành tiếng ồn, người tắt | Chạy heuristic lên 95 hồ sơ của kit + 22 của media-library, đếm tỉ lệ bắn giả bằng tay trên 30 mẫu | Chưa thử |
| 4 | «Nợ thước đo trả trong vòng chạm tới nó» thay được một hồ sơ riêng cho nợ đo lường | Nợ thước đo không bao giờ được trả vì không vòng nào «chạm tới» | Đếm sau 5 vòng A–E: bảy phép đo chuỗi-có-mặt còn bao nhiêu | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- **Câu hỏi phép đo trả lời:** một vòng do kit dẫn có kết thúc bằng một kết quả người thấy được không, và AC của nó có đo kết quả đó không?
- **SỐNG:** trong 5 vòng kế tiếp ở repo tiêu thụ, hợp đồng nào cũng có dòng «Kết quả người thấy» ở đầu và ≥80% AC là vế của ngưỡng đó; số lượt chấm trung bình ≤ trung bình 13 hồ sơ trước (4–6) dù vòng lớn gấp 2–3.
- **CHẾT:** một vòng «theo kết quả» tốn ≥8 lượt chấm với AC phần lớn đo cơ chế — tức luật có mà thước không cắn.
- **Timebox:** ≤2 ngày làm cho hạt giống (không tính đo — đo là việc của các vòng tiêu thụ).

## Hạt giống — cắm ở đâu trong kit

Bốn chỗ, từ rẻ tới có răng; ba chỗ đầu là chữ, chỗ thứ tư là thước:

1. **`skills/acceptance/references/contract-template.md`** — trên khối `## Criteria` (dòng «5-15
   criteria… independently checkable») thêm một dòng bắt buộc: `## Kết quả người thấy` — một câu,
   chủ ngữ là người dùng/agent/vận hành, là thứ vòng này giao. Mọi AC là một vế của câu đó.
2. **`feature-loop/skills/feature-loop/SKILL.md` S1 bước 3–4** — cạnh «Core >15 → hợp nhất, cap
   5-15» thêm: *một vòng = một kết quả; AC ≤12 ở tầng kết quả; cơ chế bên trong (RPC, lease, chỉ mục,
   khuôn kiểm) KHÔNG thành AC riêng — nó được canh bằng bản phá của AC kết quả (MEASURE-BIRTH)*.
   Và ở S0 intake: khi một mô tả feature chứa ≥2 kết quả người thấy khác nhau → đề nghị tách vòng
   TRƯỚC khi brainstorm, không sau.
3. **Gap-probe (S1 bước 7), mục cross-check (4)** — thêm một câu hỏi vào lớp đo-lường: *AC nào Then
   là một cơ chế (tên hàm/bảng/cột/khuôn) thay vì một thứ người hoặc agent thấy được?*
4. **`scripts/eval-coverage-lint.js` — W8 (có răng):** hợp đồng thiếu section «Kết quả người thấy»
   → warn; AC có Then chứa định danh mã trong backtick mà KHÔNG chứa động từ quan sát được (thấy ·
   nhận · trả về cho · mở được · không gõ lệnh…) → warn kèm số dòng. Ngưỡng bắn giả chấp nhận:
   ≤2/30 mẫu tay (giả định 3). `gate-card.js` Cổng 1 render cờ vàng từ W8 như đã làm với `[CE chưa
   kiểm chứng]`.

Không cắm: luật «khoá X% mới mở việc mới» — đó là trạng thái của một repo, sống ở STATUS của repo
đó, không phải luật kit.

## Nguồn ngoài & phạm vi kế thừa

- media-library `CLAUDE.md` bài học có răng 04/09 (bản chữ của cùng luật, đã áp cho một repo).
- media-library `docs/plans/2026-09-04-ke-hoach-ban-giao.md` §2 «Sáu luật cho vòng lớn».
- Bất biến maintainer của kit: *dạng nghiệm đúng tầng* — biến bất biến từ đầu-người sang vật-máy-giữ;
  chỗ không biến được thì khai giới hạn kèm MỘT ngưỡng đang đếm. Chỗ 1–3 là đầu-người; chỗ 4 là
  vật-máy-giữ; ngưỡng đang đếm là giả định 1.
