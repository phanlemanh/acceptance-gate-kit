---
schema_version: 1
feature: Nhãn lối ra của hồ sơ máy-đi-trước theo hướng sản phẩm — «đi tiếp hay kéo lại», máy điền sẵn «đi tiếp» ở dòng báo, signoff vẫn nhận chữ cũ
slug: nhan-lan-v-theo-huong
owner: phanlemanh@gmail.com
risk_tier: T2      # scripts/gate-card.js, commands/signoff.md, skills/acceptance/references/human-facing-language.md, CONTEXT.md, tests — không khớp t3_paths
surfaces: [cli]
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-04T13:10:00Z
design_doc: docs/superpowers/specs/2026-10-04-nhan-lan-v-theo-huong-design.md
---

# Acceptance Contract: nhan-lan-v-theo-huong

Gốc: crm/_acceptance/soan-okr-khong-tru-luot

Source input: owner đọc thẻ Cổng Bằng chứng phiên crm P5 (04/10), nhầm nhiều lần ở ô «veto hay
để yên»; owner chọn mở vòng nhỏ sửa ngay và duyệt nhãn «đi tiếp / kéo lại» (04/10).

## Context

Ở làn V máy đã qua Cổng Bằng chứng không chữ ký; ô «veto hay để yên» gọi tên động tác của người
thay vì hướng của sản phẩm, và nằm ở nhóm HỎI dù câu trả lời mặc định là im lặng. Vòng này đổi
nhãn sang hướng sản phẩm và đưa ô về khuôn dòng-báo-điền-sẵn đã có (`Treo`, `cắt/hoãn`).

**TRỪ** — bớt một ô hỏi trên thẻ làn V; không thêm khối, mô-đun hay cổng nào. Trace: nguyên tố 3
(khoảnh khắc quyết thật — ô chỉ một lối sống là trạm thu phí). Người hưởng: người ký ở mọi kho
tiêu thụ khi đọc thẻ của hồ sơ máy-đi-trước (ca gần nhất: owner, crm 04/10).

## Criteria

- AC-1: Given hồ sơ máy-đi-trước ký được, không còn mục nào cho người (kịch bản `gate2-may-di-tiep`), When dựng thẻ Cổng Bằng chứng, Then `--extract` có `routing.hoi` rỗng, `routing.bao` chứa `đi tiếp hay kéo lại`, `one_shot` chứa `đi tiếp hay kéo lại: đi tiếp`; HTML: dòng «Trả lời mẫu» không chứa nhãn ấy, mục VIỆC CỦA ANH nói máy đã đi tiếp và chỉ dạng `kéo lại: <lý do>`, nút chân thẻ là «Kéo lại»; chuỗi `veto hay để yên` và nút «Veto» không còn trên HTML lẫn `--extract`.
- AC-2: Given hồ sơ máy-đi-trước còn hai mục Ngoài hợp đồng (kịch bản `gate2-may-di-tiep` cộng `review-findings.md` hai mục và dòng sổ gate2 đã định đoạt cả hai), When dựng thẻ, Then `routing.hoi` bằng đúng `["Ngoài-1","Ngoài-2"]`, `routing.bao` chứa `đi tiếp hay kéo lại`, `one_shot` kết bằng `đi tiếp hay kéo lại: đi tiếp`, và nhãn trên dòng «Trả lời mẫu» bằng đúng `routing.hoi`.
- AC-3: Given hai bản `scripts/ lib/ skills/` lấy bằng `git archive` — bản TRƯỚC ở cha của commit đầu tiên chạm `scripts/gate-card.js` mang dấu `(nhan-lan-v-theo-huong)` trong thông điệp, bản SAU ở commit cuối cùng như thế (sha là đầu ra lệnh) — When dựng thẻ Cổng Bằng chứng bằng hai bản trên (a) kịch bản `gate2-4loai` và (b) mọi hồ sơ thật trong `_acceptance/` của kho kit, Then mỗi thẻ thuộc đúng một vế: hoặc HTML và `--extract` bằng nhau từng byte; hoặc `routing.hoi` của thẻ cũ chứa `veto hay để yên` và `--extract` mới bằng `--extract` cũ đổi đúng ba chỗ (bỏ nhãn cũ khỏi `hoi` · thêm `đi tiếp hay kéo lại` vào cuối `bao` · trong `one_shot` thay `veto hay để yên: ___` bằng `đi tiếp hay kéo lại: đi tiếp`); kịch bản (a) thuộc vế một và vẫn mang `ký hay trả` trong `hoi`; tập hồ sơ thuộc vế hai được in (rỗng thì in «rỗng»); hồ sơ mà bản trước không dựng được thẻ được đếm và in tên, không bỏ qua im lặng; không tìm được commit (bản sao nông) → đỏ có tên.
- AC-4: Given ma trận viết trước ba hồ sơ dựng từ kịch bản `gate2-may-di-tiep` — (1) thêm dòng sổ `type: nghi` · (2) khép bằng thực tế (status `da-cham-boi-thuc-te` + dòng sổ quan sát đủ vế) · (3) `veto_state: da-veto` với dòng sổ `type: veto` — When dựng thẻ, Then cả ba có `routing.bao` không chứa `đi tiếp hay kéo lại` và HTML không chứa «máy đã đi tiếp — không cần trả lời»; hàng 1 và 2 có `routing.hoi` rỗng và `one_shot` null; hàng 3 (đã kéo lại, chờ người xử) có `routing.hoi` chứa `ký hay trả`; số assert bằng số hàng.
- AC-5: Given bản luật `skills/acceptance/references/human-facing-language.md` và thân lệnh `commands/signoff.md`, When đọc khối `GATE-ONESHOT-SLOTS` và khối mới `GATE-ONESHOT-LAN-V` (ma trận «dạng người gõ → hành vi», mỗi dòng `<dạng> → kéo-lại|đi-tiếp`), Then SLOTS có dòng `g2 đi tiếp hay kéo lại` và không còn `g2 veto hay để yên`; khối LAN-V có ít nhất sáu dòng gồm đúng hành vi cho `kéo lại: <lý do>` → kéo-lại · `đi tiếp hay kéo lại: kéo lại: <lý do>` → kéo-lại · `veto: <lý do>` → kéo-lại · `đi tiếp hay kéo lại: đi tiếp` → đi-tiếp · `đi tiếp` → đi-tiếp · `để yên` → đi-tiếp, và câu nêu hành vi mỗi lối (kéo-lại: ghi `veto_state: da-veto` + dòng sổ `type: veto` + commit `Veto:`, máy dừng · đi-tiếp: không ghi gì); thân lệnh signoff trỏ đúng tên khối `GATE-ONESHOT-LAN-V`; và round-trip thẻ↔SLOTS (P192) xanh với thẻ máy-đi-trước in nhãn mới.

## Coverage

Bỏ quét Zwicky (entry `descope` trong sổ); trục kê tay:

- **Trục A — trạng thái thẻ** [thước CE: SUY-TỪ-REPO `scripts/gate-card.js` các vế `approvable`, `MAY_DI_TIEP`, `DA_KHEP`]: máy-đi-trước sạch → AC-1 · máy-đi-trước còn mục người → AC-2 · ký thường → AC-3 · hồ sơ thật của kho → AC-3 · đã khép bằng nghỉ / bằng thực tế · đã kéo lại → AC-4 · không ký được (REJECT/BLOCKED) → lưới có sẵn LM18c (routing rỗng, không one_shot), không AC mới.
- **Trục B — mặt ra**: `routing` · `one_shot` · dòng «Trả lời mẫu» · mục VIỆC CỦA ANH · nút chân thẻ → AC-1, AC-2; ngữ pháp + thân lệnh → AC-5.
- **Trục C — chữ người gõ**: chữ mới · chữ cũ → AC-5.
- `[GIẢ ĐỊNH]` Thân lệnh signoff do phiên đọc và thi hành; AC-5 đo chữ dạy trong thân lệnh, không đo phiên thi hành (Notes).

## Out of scope

- Câu «người: veto lúc nào cũng được» của bảng trạng thái `scripts/trang-thai-ho-so.cjs` và bản đồ dùng nó.
- Câu báo một dòng làn V trong SKILL feature-loop.
- Đổi thuật ngữ nội bộ `veto_state`, `da-veto`, commit `Veto:`, mục «Cửa veto» của CONTEXT.md (chỉ thêm một câu chỉ nhãn trên thẻ).
- Tăng phiên bản gói — kit lên số theo mốc phát hành.

## Notes

- Hạng T2: không tệp nào khớp `t3_paths`.
- Dự báo năm dòng số (luật c): làm-xong→quyết-được ↓ (thẻ làn V không còn ô trống mời gõ) · lượt gọi người ngoài thiết kế ↓ · vòng bị hạ-tầng đốt lượt = · token máy/vòng = · phút máy/lượt chấm =. Điều kiện tin cậy: đường phán quyết không đổi thành phần — vòng này chỉ đổi chữ và định tuyến của thẻ.
- Cân trên mọi kho: kho không có hồ sơ máy-đi-trước nhận thẻ giống từng byte (AC-3); người quen gõ `veto:` / `để yên` vẫn được nhận (AC-5).
- Giới hạn đã khai: AC-5 đo chữ dạy trong thân lệnh, không có răng máy nào chứng phiên thi hành đúng — cùng giới hạn mọi thân lệnh cổng người hôm nay. Ngưỡng: ≥1 lần phiên ở kho tiêu thụ từ chối hoặc hiểu sai `kéo lại:` / `đi tiếp`.
- Sửa `scripts/gate-card.js` làm hồ sơ ghim `scripts/**` hoá cũ tới chiến dịch ghim lại kế (luật re-pin theo mốc).
