# Hạt giống — gỡ lớp CHỨNG-MINH-chữ-ký, provenance lấy từ forge

*Trạng thái: **HẠT GIỐNG, chờ Cổng 0**. Hạng T3 (đụng `scripts/pre-merge-check.sh`,
`hooks/`, branch protection, chính sách đội). Sinh 16/08 từ tra soát owner
yêu cầu ngay sau khi mở hồ sơ `cat-khoi-viec-cua-anh-tren-tin`: «chữ ký có
phải cùng loại bảo hiểm không đáng như khối 👉 không?» — trả lời: MỘT NỬA.*

## Chữ ký có hai lớp — chỉ gỡ lớp 2

| Lớp | Là gì | Trace | Số phận |
|---|---|---|---|
| 1 — khoảnh khắc ký | người nhận trách nhiệm cho thứ máy không thay được (đánh-đổi · khó-đảo) | nguyên tố 3 | **GIỮ** — đợt 2 đã thu về đúng chỗ (xanh-sạch thôi mời ký); đợt 3 đo M1 thật |
| 2 — bộ máy CHỨNG MINH chữ ký là của người | `signoff.require_human_commit` · `signoff.agent_authors` · commit-riêng-chỉ-trường-người · chuỗi «Ký: tên ngày» trong file · đường-rửa-chữ-ký (pre-merge ~854) · re-pin quanh hạt commit | bảo hiểm cho «máy giả chữ ký người» — **chưa từng xảy ra** | **GỠ** |

## Vì sao lớp 2 đi ngược North Star

- Nó xác thực **ai gõ**, không xác thực **quyết định có đúng không**. Owner:
  «tôi đã sai rất nhiều dù phải gõ vào»; phút điền đại (07/08). Cái làm người
  quyết đúng hơn là thẻ đọc-một-phút + bằng chứng có chiều đỏ, không phải chuỗi.
- Nó **chỉ chặn Claude**, không chặn người mệt bấm «ừ» — bảo vệ *quy trình khỏi
  máy*, không bảo vệ *sản phẩm khỏi lỗi*. Nguyên tắc 3 (owner 11/08): hệ an
  toàn bằng LƯỚI và ĐƯỜNG ĐẢO, không bằng câu hỏi.
- **Forge đã cấp miễn phí thứ nó tự dựng lại**: PR approval / người bấm merge có
  danh tính + ngày, không giả được, không sợ squash. Kit đang tái hiện
  provenance của GitHub/GitLab bên trong lịch sử git rồi trả giá để giữ nó khỏi
  vỡ.
- Phí đã trả: squash-merge giết hạt commit → chặn MỌI PR (sự cố thật) ·
  bản-đồ-sau-chữ-ký ×2 · ký ba lượt (chip ③) · ③b để máy tự suy tên/ngày ·
  sửa-trước-ký / vá-sau-ký · re-pin theo release · hồ sơ T3 đường-rửa-chữ-ký
  đang xếp hàng.

## Các đội hàng đầu dùng Claude giữ an toàn bằng gì (kiến thức tới đầu 2026)

Lưới máy chạy trước người (hook trước/sau thao tác, sandbox + allowlist, CI
test/typecheck/quét bảo mật, Claude tự review PR) · người xuất hiện ở đúng
chỗ forge có sẵn (PR nhỏ + branch protection + CODEOWNERS + approve/merge) ·
bậc thang tin cậy nới dần theo số đo. Không ai bắt người gõ chuỗi chữ ký vào
file rồi commit riêng.

## Giữ gì

- Nội dung chỉ người biết: `human_override` cho mục phán-xét, cắt gì, lý do
  trả — là THÔNG TIN, máy ghi hộ.
- Khoá ADR 0002 (máy không tự gọi lệnh cổng) — luật âm, không tốn chữ.
- `signed-off` vẫn là trạng thái; điều kiện của nó đổi từ «có chuỗi ký trong
  commit riêng» sang «quyết định người đã ghi + PR có approval của người
  (đọc từ forge) hoặc branch protection đang bật».

## Đường thi công gợi ý (T3, một hồ sơ)

1. Pre-merge: gỡ ba VIOLATION quanh commit chữ ký (không-trong-commit ·
   agent_authors · commit-lẫn-body); thay bằng NOTE. Đường đọc-cũ: config còn
   `require_human_commit: true` → cảnh báo «khoá đã hết hiệu lực» thay vì lỗi.
2. Hook: `human_signoff` không còn bắt buộc khác rỗng để `signed-off`; thay
   bằng cờ `signoff.provenance: forge|file` (mặc định `forge`).
3. GUIDE §6.1 bước 4–5 + README + `commands/signoff.md` viết lại: người trả
   lời quyết định, máy ghi, PR approve là chữ ký.
4. Rút `time_human_minutes` khỏi văn (đã làm) — không đụng.
5. Đo: fixture code-sinh qua CHÍNH pre-merge/hook (nếp `rang-veto.sh`), chiều
   đỏ: hồ sơ thiếu human_override cho mục phán-xét vẫn phải đỏ.

## Việc của owner tại Cổng 0

Gật/cắt ranh giới lớp 1 / lớp 2 ở bảng trên; nếu gật, hồ sơ mở ngay sau khi
`cat-khoi-viec-cua-anh-tren-tin` merge.

## Bổ sung 16/08 (từ Ngoài-1 của hồ sơ cat-khoi-viec-cua-anh-tren-tin) — gộp thành vòng «cổng chặn nhầm chỗ»

**Phát hiện thật trên vật thật:** làn V (máy đi trước, `veto_state: mo`,
`approved_by` rỗng) được HOOK cho qua (`lib/evidence-core.cjs`
`evaluateContractWrite`) nhưng **`scripts/pre-merge-check.sh` (~dòng 578–590,
luật Gate-1 approval) vẫn VIOLATION** khi `status ∈ {implemented, verified,
signed-off}` mà `approved_by` rỗng và không `gate1_skipped`. Nghĩa là mọi hồ
sơ T2 đi đúng đường đợt 2 đều bị chặn ở biên merge và phải xin owner «duyệt
tay» — chính là trạm thu phí mà đợt 2 dựng để gỡ. Hồ sơ cat-khoi đã qua bằng
đường xử «owner duyệt tay approved_by» (khai trong luật veto-trace).

**Việc của vòng gộp:** (1) pre-merge Gate-1 rule đọc `vetoGateState` như hook —
`mo` + vết parse được + T2 ⇒ NOTE, không VIOLATION; (2) gỡ lớp 2 chữ ký như
trên; (3) một cặp fixture code-sinh qua CHÍNH pre-merge cho cả hai (chiều đỏ:
T3 + `mo` vẫn phải VIOLATION; `da-veto` chưa xử vẫn VIOLATION). Đây là hồ sơ
T3 (đụng `scripts/pre-merge-check.sh` + `hooks/`), một vòng, đảo bằng git.
