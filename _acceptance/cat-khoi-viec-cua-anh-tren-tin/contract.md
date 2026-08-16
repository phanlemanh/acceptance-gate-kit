---
schema_version: 1
feature: Cắt khối 👉 VIỆC CỦA ANH khỏi TIN mời cổng — thay khuôn N-mục-3-vế bằng một câu «mời cổng như đồng nghiệp hỏi»; thẻ HTML giữ nguyên; chỉ TRỪ
slug: cat-khoi-viec-cua-anh-tren-tin
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: approved
approved_by: ""
approved_at: ""
veto_state: mo
veto_opened_at: 2026-08-16T08:25:40Z
---

# Acceptance Contract: cat-khoi-viec-cua-anh-tren-tin

## Context

Từ chip ② (11/08) mọi tin mời cổng phải kết bằng khối 👉 VIỆC CỦA ANH theo
khuôn `YOUR-MOVE-BLOCK-TEMPLATE`: N mục × ba vế làm-gì/ở-đâu/trả-lời-dạng-gì +
«Trả lời mẫu (điền vào chỗ trống)». Owner 16/08: khối làm mất bốn thứ của
câu hỏi tự nhiên cũ — một câu đóng · ngả đầu là khuyến nghị · «ok» đủ · nói
việc kế — và ví dụ thật cho thấy 5 quyết định lồng nhau + hỏi phút dù ③b đã bỏ
phút. Chẩn đoán: khối là **bảo hiểm cho một tin viết dở** (sổ vấp #8, đảo-rẻ)
trả phí ở mọi tin; luật «cấm câu tu từ mang dấu hỏi» phạt đúng câu tốt; phép đo
P185–P190 chỉ giữ hình dạng. Sai gốc: tưởng tin mời cổng cần khuôn. Owner bác cả
đề xuất «khuôn tốt hơn» → **bỏ khuôn, không thay khuôn**.

Hồ sơ **chỉ TRỪ** trên TIN: gỡ template + luật hình dạng + luật cấm-dấu-hỏi,
đổi điều khoản mời-cổng (một cây nguồn, 5 bản chép) và điều khoản một-lượt-gõ
(6 bản chép) thành câu mô tả HÀNH VI; giữ hai luật âm không tốn chữ (máy không
viết sẵn câu trả lời của người — ADR 0002; máy không hỏi phút). Thẻ HTML cả hai
cổng KHÔNG đổi (xem Out of scope).

Source input: [design](../../docs/superpowers/specs/2026-08-16-cat-khoi-viec-cua-anh-tren-tin-design.md)
· memory `khoi-viec-cua-anh-thanh-form` (owner 16/08).

## Criteria

Quy ước cho tiêu chí «0 chỗ còn X»: phạm vi quét là khối máy-đọc dưới đây; bộ
răng SO phạm vi nó thực quét với khối này và in kết quả so (`CAT-SCOPE`). Mọi
tiêu chí âm tính kèm đối chứng dương: cùng needle trên worktree `origin/main`
phải >0 hit, script in cả hai số; needle 0-hit cả hai đầu = needle chưa bao
giờ tồn tại → ĐỎ. `tests/` ngoài phạm vi (fixture tiêm của lưới thường trực
chứa câu cũ — nếp cat-hinh-thuc); `docs/`, `_acceptance/`, `PRODUCT-MAP.md`
ngoài phạm vi (sử liệu / hồ sơ cũ / view máy sinh).

<!-- <<<PHAM-VI-RANG -->
| duong-dan |
|---|
| commands |
| skills |
| feature-loop |
| scripts |
| GUIDE.md |
| QUICKSTART.md |
| README.md |
| CONTEXT.md |
<!-- PHAM-VI-RANG>>> -->

- AC-1: Given cây đã sửa, When quét phạm vi trên tìm dấu vết KHUÔN của khối
  trên tin — SÁU needle: `YOUR-MOVE-BLOCK-TEMPLATE`, `mỗi mục đủ 3 vế`, `câu tu
  từ mang dấu hỏi`, `Trả lời mẫu (một dòng, điền vào chỗ trống)`, `khối 👉`,
  `kết bằng đúng MỘT khối` (hai needle cuối phủ câu bọc quanh bản chép + dòng
  bất biến dừng của feature-loop — gap-probe P1) — trong VĂN CHỈ DẪN, loại trừ
  KHAI-VÀ-IN-RA `scripts/gate-card.js` cho needle «Trả lời mẫu» và «khối 👉»
  (chuỗi render/comment của thẻ — thẻ giữ nguyên, Out of scope) — Then 0 hit
  cho từng needle, và cùng needle trên `origin/main` >0 hit; script in
  `CAT-KHUON: <needle> HEAD=0 base=<n>(>0) OK` và dòng đếm `CAT-KHUON: <k>/<k>`
  (k suy từ mảng).
- AC-2: Given bản luật ngôn ngữ mặt người sau sửa, When rút `GATE-INVITE-CLAUSE`
  qua marker (nối các dòng wrap thành một chuỗi TRƯỚC khi so — chuẩn hoá khai
  trong checker), Then điều khoản là ĐÚNG MỘT câu (một dấu chấm kết), chứa đủ
  bốn dấu hiệu hành vi «một câu hỏi đóng» · «ngả máy khuyên» · «một chữ» ·
  «làm gì tiếp», và KHÔNG chứa từ nào trong {khối, vế, chỗ trống, Trả lời mẫu,
  YOUR-MOVE} — bộ từ cấm suy từ chính câu điều khoản (câu chứa «không khuôn»
  nên «khuôn» KHÔNG là từ cấm; gap-probe P0); BA luật âm còn mặt trong cùng
  section: «không viết sẵn câu trả lời» · «không hỏi phút» · «tin chỉ-báo
  không hỏi» (luật thứ ba thay chỗ «tin chỉ-báo không đeo khối» đã gỡ —
  gap-probe P1). Đối chứng dương: checker chạy trên câu gốc XANH trước khi tiêm;
  mutant xoá một dấu hiệu / chèn từ «vế» / xoá một luật âm → đỏ ghim đích danh.
- AC-3: Given điều khoản mời-cổng mới, When so với 5 bản chép khai ở
  `GATE-INVITE-SITES`, Then khớp từng ký tự và đủ số bản mỗi site (lưới thường
  trực P188 chạy trên câu MỚI, không phải câu cũ); và các câu bọc quanh bản chép
  không còn nhắc «khối 👉» / «YOUR-MOVE» (needle AC-1 phủ).
- AC-4: Given `GATE-ONESHOT-CLAUSE` sau sửa, When rút qua marker và so với 6
  thân lệnh cổng người, Then vế «tin mời cổng kết bằng đúng MỘT khối 👉…» đã
  thay bằng «Đầu ra theo bản luật ngôn ngữ mặt người.», 6 bản chép khớp từng ký
  tự (P193 giữ, neo test đổi theo câu mới), và ngữ pháp `GATE-ONESHOT-GRAMMAR`
  + `GATE-ONESHOT-SLOTS` KHÔNG đổi một ký tự (đối chứng: diff hai khối đó với
  `origin/main` rỗng).
- AC-5 (judgment): Given một agent phiên sạch KHÔNG TOOL nạp inline bản luật
  ngôn ngữ mặt người SAU sửa + đề ca `hoi-dong/ca-E5.md` (4 ca: mời Cổng 1 ·
  mời Cổng 2 có một mục ngoài hợp đồng + ký · tin chỉ-báo giữa vòng · owner hỏi
  «sao không có khối như mọi khi»), When giám khảo độc lập chấm transcript theo
  bảng đáp án viết TRƯỚC `giam-khao/dap-an-E5.md` (chỉ giám khảo nạp), Then
  4/4 đạt theo HÀNH VI: tin mời cổng có đúng một câu hỏi đóng, nêu ngả máy
  khuyên kèm căn cứ, một chữ đồng ý là đủ, nói máy làm gì tiếp, không ô trống,
  không mã bắt buộc, không hỏi phút, không viết sẵn câu trả lời; tin chỉ-báo
  không hỏi; ca chống-a-dua giữ luật thay vì phục hồi khối. Ràng buộc chống
  rò rỉ qua tên ca (gap-probe P2): đề ca chỉ có tiêu đề trung tính «Ca 1–4»,
  không chứa từ a-dua/luật/khối ngoài lời thoại owner; đáp án mỗi ca là các ô
  nhị phân quan sát được, và giám khảo PHẢI trích nguyên văn câu hỏi của tin
  vào rationale — thiếu trích = UNCERTAIN.
- AC-6: Given suite `tests/plugins/run-tests.sh` sau sửa, When chạy trọn, Then
  exit 0 và số dòng ca (`  PASS:` + `  FAIL:`) bằng đúng cột `sau` của khối
  `SO-CA-KY-VONG` (đẳng thức, không sàn); mọi ca `giu` trong `SO-CA-PHAN-RA`
  có dòng `  PASS: <ca>` và mọi ca `go` có 0 dòng; đối chứng dương: cùng bộ đếm
  trên log của `origin/main` ra đúng cột `truoc` (146), in ra cùng lượt.
- AC-7: Given hồ sơ này và bản đồ sản phẩm, When chạy `node
  scripts/product-map.mjs --root . --check`, Then khớp — bản đồ vẽ lại CÙNG
  LƯỢT với thay đổi engine, không để sau chữ ký (bài học lặp ×2 đợt 2).

<!-- <<<SO-CA-KY-VONG -->
| suite | truoc | sau |
|---|---|---|
| plugins | 146 | 145 |
<!-- SO-CA-KY-VONG>>> -->

Phân rã máy-đọc (gap-probe P1 — số không sống một mình): mỗi ca của suite
plugins in ĐÚNG MỘT dòng `  PASS:`; ca gỡ và ca giữ khai đích danh kèm VẬT ĐO.

<!-- <<<SO-CA-PHAN-RA -->
| ca | viec | vat-do |
|---|---|---|
| P189 | go | ban luat (template 5 chuan + co-lap-clause, cung MOT dong PASS) |
| P185 | giu | gate-card.js render Cong 1 |
| P186 | giu | gate-card.js render Cong 2 |
| P187 | giu | gate-card.js render Cong 2 khong ky duoc |
| P188 | giu | round-trip GATE-INVITE-CLAUSE (cau MOI) |
| P190 | giu | 3 the bang chung render lai tu gate-card.js |
| P191 | giu | GATE-ONESHOT-GRAMMAR + SLOTS |
| P192 | giu | the -> SLOTS round-trip |
| P193 | giu | round-trip GATE-ONESHOT-CLAUSE (cau MOI, neo test doi) |
| P194 | giu | may-ganh-nguoi-quyet |
<!-- SO-CA-PHAN-RA>>> -->

## Coverage

Không gian là danh sách site MÁY-LIỆT (hai manifest `GATE-INVITE-SITES` /
`GATE-ONESHOT-SITES` + grep needle trên phạm vi khai), một chiều — bỏ quét hình
thái (entry `descope` trong sổ quyết định). Trục × việc:

| Trục | gỡ | giữ | ngoài |
|---|---|---|---|
| nguồn luật (`human-facing-language.md`) | template + luật hình dạng + cấm-dấu-hỏi | 2 luật âm · grammar · SLOTS | — |
| bản chép (5 invite + 6 oneshot) | vế nhắc khối | cơ chế round-trip | — |
| thẻ HTML (`gate-card.js`) | comment trỏ template | render cả hai cổng | «Trả lời mẫu» trên thẻ |
| tests/plugins | P189 | P185–188, P190–194 | — |
| hồ sơ cũ (drift scripts ②b/③/③b/1c) | — | — | chết theo thiết kế; re-pin 1 làn |

## Out of scope

- Thẻ HTML cả hai cổng (kể cả dòng «Trả lời mẫu» và mã Ngoài-/E-/Treo- trên
  thẻ Cổng 2): là danh sách máy-đếm + đường nhập của ngữ pháp câu gộp; đổi kéo
  P191/P192/P194 + SLOTS — quyết định riêng, `revisit` khi hồ sơ ngữ pháp.
- `GATE-ONESHOT-GRAMMAR` + `GATE-ONESHOT-SLOTS`: giữ nguyên làm đầu vào được
  chấp nhận; chỉ thôi dạy trong tin.
- Chữ ký lớp 2 (require_human_commit · agent_authors · hạt commit): hạt giống
  riêng `docs/plans/2026-08-16-hat-giong-go-lop-chung-minh-chu-ky.md` (T3).
- Script drift của hồ sơ cũ đọc marker template (`no-vat-that-drift.sh` ·
  `no-ben-viet-drift.sh` · `no-vat-cam-drift.sh` · `rang-1c.sh`): khai trước
  «không vào suite vĩnh viễn, chết theo merge»; hồ sơ 1c/③b có `paths` chạm bản
  luật → re-pin 1 làn trước merge theo nếp stale-theo-diff.
- Không thêm khuôn mới nào thay khối — lớp lỗi «trả lời vấn đề-về-khuôn bằng
  khuôn khác» (owner bác 16/08).

## Notes

- Đối chứng dương của bộ răng neo `origin/main` → răng KHÔNG vào suite vĩnh
  viễn (nếp cat-hinh-thuc).
