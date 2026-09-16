---
schema_version: 1
feature: Phát hành kit 2.15.0 — mở hồ sơ mốc 16/09 cùng một nhát VÁ TRONG MỐC cho thẻ mở phiên (hồ sơ treo ở «đã duyệt» mà vật đã nằm trong nhánh gốc thôi bị in «viết code»)
slug: release-2-15-0
owner: phanlemanh@gmail.com
risk_tier: T2               # nhát vá chạm scripts/start-scan.mjs + scripts/trang-thai-ho-so.cjs + commands/start.md; KHÔNG chạm t3_paths (hooks, lib, pre-merge-check.sh, recheck-evidence.cjs)
surfaces: [cli]
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: release-2-15-0

## Context

Cửa sổ 2.14 → 2.15 mở sau khi 2.14.0 ký 15/09. **Owner chốt R ngày 16/09**
(`docs/findings/2026-09-15-dieu-chinh-sau-2-14-token-va-vong-meta.md` §3): cửa sổ này
**không mở vòng meta mới**; việc nhỏ của kit đi theo đường vá-trong-mốc (tiền lệ
`release-2-11-0`) và nằm trong hồ sơ này. Hồ sơ mở ngày 16/09 vì nhát vá dưới đây, là
việc đầu tiên của cửa sổ chạm engine.

**Nhát vá — thẻ mở phiên mời viết code cho một thứ đã ở prod.** Ca thật 16/09 ở repo
tiêu thụ crm-onehub (nhánh gốc `onehub`): vòng `cua-vao-noi-tieng-viet` merge từ 04/09
(commit `51a07b1`); ngày 06/09 chủ kho «xếp lại» — đặt `status` hợp đồng ngược về
`approved` và đổi tên bằng chứng thành `evidence-report.xep-lai-2026-09-06.md`
(`verified_commit` là tổ tiên của nhánh gốc). Bộ quét đọc `approved` + có kế hoạch →
thẻ in «viết code (S3)»; owner chọn dòng đó, và một phiên **8 giờ 25 phút** chấm lại thứ
đã ở prod. Ba hồ sơ khác cùng hình dạng ở cùng repo: `nhan-ung-dung-noi-tieng-viet` ·
`thuoc-cua-lat-3a-co-rang` · `tieng-viet-cho-crm`.

Nhát vá **CỘNG** một khoá trạng thái trên thẻ; **owner phê đích danh 16/09** theo
ADR 0018. Không cổng mới, không đổi nhánh `implemented`, không đổi bộ quét ở chỗ nào
khác nhánh `approved`.

Đo trên cây vá, chỉ-đọc, ngày 16/09: bộ quét chạy trên crm-onehub đưa **cả bốn** hồ sơ kể
trên vào nhóm mới; chạy trên chính kho kit không đổi một dòng nào của nhóm «Đang dở».

Nguồn chữ lời giao dẫn `docs/findings/2026-09-16-truy-nguyen-thuoc-khong-co-cua.md` —
tệp ấy **chưa có trong kho** ở mọi nhánh lúc mở hồ sơ; bối cảnh trên lấy từ lời giao đã
xác minh của owner, không từ tệp đó.

**Việc mốc mang theo, CHƯA có tiêu chí** (owner dịch sẵn 16/09, ghi vào đây khi mở hồ sơ):

- **R2** — vá-trong-mốc hai mục T1 của 2.14 §4: lệnh cổng in dòng trần (#3) · `wf-usage`
  kêu khi không chạy (#2). Là CỘNG nhỏ, còn chờ owner phê đích danh.
- **R3** — khai 70 hồ sơ tụt pin là sử liệu chấp nhận được giữa hai mốc; chiến dịch ghim
  lại không chạy dạng hiện tại.

Source input: prompt của owner 16/09 (phiên truy nguyên ở kho kit).

## Criteria

### AC-1 (vá-trong-mốc) — hồ sơ «đã duyệt» có vật đã ở nhánh gốc vào nhóm riêng

**Given** một hồ sơ `status: approved` mà trong thư mục của nó có ít nhất một tệp bằng
chứng — tên bắt đầu bằng `evidence-report`, đuôi `.md`, kể cả bản đổi tên có đoạn
`xep-lai` — mang
`verified_commit` là tổ tiên của HEAD
**When** chạy bộ quét mở phiên trên kho đó
**Then** hồ sơ nằm trong nhóm «Đang dở» với khoá `vat-da-o-nhanh-goc`, `nextStep` là
`null`, nhãn đúng nguyên văn «vật đã nằm trong nhánh gốc — hồ sơ còn treo ở «đã duyệt»»
và việc kế đúng nguyên văn «người: chọn một lối — đóng theo quan sát (ghi quyết định,
không chấm lại) hoặc chấm lại (đưa về «code xong», chạy nghiệm thu máy)». Đúng cho cả hồ
sơ có kế hoạch lẫn chưa có kế hoạch.

### AC-2 (độ đặc hiệu) — không đủ căn cứ thì IM, giữ nhãn cũ

**Given** CÙNG kho git của AC-1
**When** hồ sơ `approved` không có bằng chứng · có bằng chứng mà commit nằm trên nhánh
KHÔNG merge · có bằng chứng mà commit không có trong kho đối tượng; và khi hồ sơ ở
`implemented` với bằng chứng có commit đã vào nhánh gốc
**Then** ba ca đầu vẫn «đang viết code» (bước kế `S3`), ca cuối vẫn «code xong, chưa ai
chấm» (bước kế `S4`); không hồ sơ nào bị đẩy sang hỏng. «Chưa biết» không được in thành
«đã ở nhánh gốc».

### AC-3 (chiều đỏ) — gỡ phép hỏi tổ tiên trong bản sao thì kết luận LẬT

**Given** bản sao TRỌN thư mục `scripts/` và `lib/` của cây đang kiểm
**When** bản sao chưa phá chạy trên kho của AC-1 (đối chứng dương), rồi thay đúng một
chỗ gọi phép hỏi tổ tiên bằng `false`
**Then** bản chưa phá cho nhóm mới; bản đã phá đưa hồ sơ đã merge về lại «đang viết
code». Neo đột biến có đúng một chỗ gọi — neo mất thì ca đỏ, không im.

### AC-4 (judgment) — thẻ mở phiên không mời resume trơn cho dòng này

**Given** thân lệnh mở phiên và bảng chữ trạng thái
**When** hội đồng đọc khối `START-VAT-DA-O-NHANH-GOC` và điều khoản bàn giao ở bước 4
**Then** thẻ in nhãn thay cho bước máy, trình HAI lối trong CÙNG một câu hỏi chọn (không
thêm câu hỏi, không thêm cổng), máy không chọn hộ, và lối «chấm lại» bàn giao kèm câu dặn
đưa hồ sơ về `implemented` trước khi vào nghiệm thu máy — không bao giờ đưa lệnh resume
trơn vào một hồ sơ «đã duyệt» có vật đã merge. Câu chữ theo bản luật ngôn ngữ mặt người.

### AC-5 (hồi quy) — hai suite chạm vật và bản đồ sản phẩm

**Given** cây tại HEAD
**When** chạy suite `tests/scripts`, suite `tests/plugins` và `product-map --check`
**Then** cả ba exit 0. Hai ca đang ghim bộ quét (ma trận phân ô P105, bảng chữ BDK2) phải
xanh mà KHÔNG nới: bảng chữ tăng đúng một khoá và danh sách gõ tay của BDK2 tăng theo.

## Coverage

Nhát vá là bài liệt-kê-đủ trên ba trục của một hồ sơ «đã duyệt». Kho tạm là một kho git
thật do code sinh trong chính lần chạy (`tests/scripts/vat-da-o-nhanh-goc.test.mjs`).

- **Trục tệp bằng chứng** `[thước CE: ca thật crm-onehub 16/09]`: vắng · tên chuẩn · tên
  đổi `xep-lai`. → AC-1, AC-2.
- **Trục quan hệ commit** `[thước CE: ba lối thoát của merge-base --is-ancestor]`: tổ tiên
  · nhánh không merge · không có trong kho đối tượng. → AC-1, AC-2.
- **Trục trạng thái hồ sơ** `[thước CE: nhánh approved hai khoá + nhánh implemented]`:
  approved có kế hoạch · approved chưa kế hoạch · implemented. → AC-1, AC-2.
- Tổ hợp không đo, khai thẳng: tệp bằng chứng đọc không được (quyền, là thư mục) với hồ sơ
  `approved` — ma trận P105 đã ghim ô này ở kho KHÔNG phải git và nó giữ «lập kế hoạch»;
  hai tệp bằng chứng cùng lúc, một tổ tiên một không — vòng lặp dừng ở tệp tổ tiên đầu tiên.

## Out of scope

- **Trạng thái hồ sơ cho lối «đóng theo quan sát».** Kit chưa có trạng thái hợp đồng nào
  nghĩa là «đóng, không chấm lại». Người ghi quyết định vào sổ xong thì bộ quét VẪN đọc
  `approved` và dòng vẫn hiện ở nhóm này. Dựng trạng thái ấy là một CỘNG khác, chờ owner.
- **Vòng lặp tính năng tự nhận ra vật đã merge.** Chặn chỉ đặt ở thẻ mở phiên; ai gõ
  thẳng lệnh resume vào hồ sơ như vậy thì vòng lặp vẫn vào bước viết code.
- **Bản đồ sản phẩm.** Không đổi: khoá mới chiếu về cùng ô «đang dựng» với «đang viết
  code», nên hai bộ đọc không trôi khỏi nhau.
- **Cắt số, mục CHANGELOG, bốn khối Notes của mốc** — việc của lần đóng mốc, chưa làm.
- **R2, R3** — xem Context; tiêu chí viết khi owner phê.

## Notes

### Known limits

- Phép hỏi tổ tiên so với **HEAD của cây đang quét**, không với nhánh gốc có tên. Chạy
  thẻ trên một nhánh tính năng đã chứa commit ấy cũng cho nhóm này; lệnh mở phiên thường
  chạy trên nhánh gốc nên chữ «nhánh gốc» đúng ở ca phổ biến.
