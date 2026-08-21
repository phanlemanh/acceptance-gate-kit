---
schema_version: 1
feature: Máy quét vào phiên hỏi đúng câu lưới trước-merge hỏi — hồ sơ không còn cần người thì thôi hiện «chờ ký», hồ sơ chưa sạch thì luôn còn ở cổng
slug: lan-v-khong-phai-cho-ky
owner: phanlemanh@gmail.com
risk_tier: T2               # thu từ T3 theo kiến nghị North Star 21/08: một vật (máy quét), không đụng lib/, không đụng lưới merge
surfaces: [cli]
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-08-21T15:02:00Z
---

# Acceptance Contract: lan-v-khong-phai-cho-ky

## Context

**Vòng một bị trả lại tại Cổng Bằng chứng (21/08):** vị từ khoá vào `veto_state`
trong khi luật thật để «máy đi tiếp không cần ký» là **sáu điều kiện xanh-sạch**
của lưới trước-merge. Hồ sơ chưa sạch biến mất khỏi danh sách chờ ký — lệch
**ngược chiều an toàn**. **Vòng hai (T3) bị thu lại theo North Star:** bệnh nhỏ
hơn thuốc — phạm vi T3 đụng lưới merge, thân vòng lặp, bản đồ, tốn thêm hai lượt
gọi người cho một lỗi hôm nay chưa merge.

Vòng này làm đúng **một vật**: máy quét vào phiên (`scripts/start-scan.mjs`).
Câu nó hỏi một hồ sơ `verified` chưa ký phải là **đúng câu lưới trước-merge
hỏi**: *«hồ sơ này còn cần người không?»* — tức lưới có in `VIOLATION` cho nó
hay không. Vị từ viết bằng JS, sống cạnh máy quét (`scripts/`, không `lib/`);
«một nguồn» giữ bằng **phép đo vĩnh viễn**: cùng ma trận fixture code-sinh, máy
quét và **chính** `pre-merge-check.sh` phải cho cùng kết luận.

Bản đồ sản phẩm **không đụng**: ô của nó vẫn đổi ở chỗ người ký; hai dòng
«đang làm» cho hồ sơ làn V là cái giá chấp nhận được (không cổng nào gắn vào).

Nền giữ từ vòng một: hợp đồng fixture rút từ khuôn canonical (bằng chứng fixture
thì chưa — known-limits `#5`), răng khai `cmd:` bằng đường dẫn, đột biến có
marker, sàn đếm.

Source input: `docs/plans/2026-08-21-hat-giong-lan-v-khong-phai-cho-ky.md` (Cổng 0, #74)
· sổ quyết định `gate2` 21/08 (trả lại) · kiến nghị North Star 21/08 (thu về T2).

## Criteria

- AC-1: Given một hồ sơ `status: verified`, `human_signoff` rỗng, When máy quét vào phiên đọc nó, Then nó nằm trong `groups.done` (không trong `groups.gates`) **khi và chỉ khi** `pre-merge-check.sh` chạy trên cùng hồ sơ đó KHÔNG in dòng `VIOLATION [<slug>]` nào — quan hệ đo trên **chính** script lưới, trên ma trận fixture code-sinh phủ **sáu điều kiện xanh-sạch mỗi điều kiện một chiều trượt — kể cả hạng T3 và verdict khác PASS, mỗi cái ở cả hai nhánh Cổng 1** · mục VẮNG (vắng ≠ rỗng) · `enforcement_mode: off` (lưới chặn TRƯỚC nhánh xanh-sạch, cùng khối frontmatter) · `veto_state` vắng / `mo` có vết / `mo` không vết / `da-veto` · Cổng 1 ba đường: `approved_by` có tên / rỗng / `gate1_skipped: true`. Fixture chép đúng bộ `lib/` + `scripts/recheck-evidence.cjs` mà `/acceptance-init` chép sang repo tiêu thụ — thiếu `lib/md-section.cjs` thì lưới không bao giờ thấy hồ sơ sạch (fail-closed), và phép đo phải đỏ ở đối chứng dương chứ không «khớp vì cùng đỏ».
- AC-2: Given hồ sơ đủ sáu điều kiện xanh-sạch, chưa ký, When máy quét đọc, Then `state` là `lan-v-mo` nếu `veto_state: mo` có vết giờ parse được, còn nếu Cổng 1 do người đóng — `approved_by` có tên, hoặc người chủ động miễn bằng `gate1_skipped: true` (lưới chỉ NOTE) — thì `state` là `xanh-sach` — **bất kể** có khoá `veto_state: mo` hay không, có vết hay không (Cổng 1 đã qua bằng chữ duyệt, khoá veto không đổi kết luận; lưới cũng đọc vậy — ca `nguoi-vet-hong` trong đẳng thức). Cả hai đều «đã giao», chỉ khác ở chỗ cửa veto còn mở hay không.
- AC-3: Given hồ sơ có `veto_state: mo` + vết giờ + T2 + `verdict: PASS` nhưng **trượt** một trong bốn điều kiện còn lại (`bypass_used` · mục UNCERTAIN · «Known limits» có nội dung · «Ngoài hợp đồng» có nội dung) hoặc **vắng** một trong hai mục, When máy quét đọc, Then nó nằm ở `gates: bang-chung` — đây là ca đã làm vòng một trượt; vị từ quay lại khoá vào `veto_state` phải đỏ ở đây.
- AC-4: Given `veto_state: da-veto`, When máy quét đọc, Then hồ sơ KHÔNG nằm trong `groups.done` bất kể bằng chứng sạch tới đâu — veto là phát ngôn của người, phải còn hiện ở nơi người thấy. Thứ tự nhánh tường minh: (1) `da-veto` cắt trước → (2) có chữ ký ⇒ `signed-off` → (3) còn lại: vị từ không-cần-người quyết.
- AC-5: Given **bảng sự-thật viết trước** trên veto (4: vắng · mo có vết · mo không vết · da-veto) × verdict (5) × hạng (2) × chữ ký (2) × độ sạch (3: sạch · bypass · Known-limits-có-nội-dung) = 240 ô, fixture code-sinh, **trục G cố định theo nhánh veto**: `approved_by` có tên khi veto vắng hoặc `da-veto` (đời thật: hồ sơ người duyệt Cổng 1), rỗng khi `mo` (máy đóng Cổng 1), When hỏi máy quét từng ô, Then mỗi ô khớp hàm kỳ vọng viết tay (độc lập với vị từ đang kiểm); số ô đếm từ chính vòng lặp và in ra; **và mỗi đột biến của E7 phải làm bảng đỏ ≥1 ô** — nếu không, hàm kỳ vọng chỉ là bản chép của vị từ.
- AC-6: Given `tests/plugins/lan-v.test.mjs` nhận bộ lọc `LV_CASES`, When khai một tên không khớp ca nào, Then file exit khác 0 kèm thông điệp nêu tên đã khai — sàn đếm chống «xanh với 0 assertion», cùng khuôn `only_matched` cuối `tests/plugins/run-tests.sh`.
- AC-7: Given cây thật của kit, When chạy một lượt lưới (`pre-merge-check.sh . --base main`) và một lượt máy quét, Then với **mọi** hồ sơ `verified` chưa ký trên cây: máy quét ∈ `done` ⇔ lưới không in `VIOLATION [<slug>]`; sàn: ≥2 hồ sơ được so (không ghim tên hồ sơ nào — kỳ vọng không được viết theo kết quả; chính hồ sơ này khi đi làn V cũng chỉ là một ô của quan hệ).

## Coverage

Quét bằng morphological-scan (preset ma-trận-kiểm). Một bộ đọc (máy quét), năm trục:

- Trục B — trạng thái veto: vắng | mo + vết ok | mo + vết hỏng | da-veto `[SUY-TỪ-REPO: lib/evidence-core.cjs vetoGateState]`
- Trục C — verdict: PASS | PENDING-JUDGMENT | REJECT | BLOCKED | vắng file `[SUY-TỪ-REPO: start-scan VERDICT_MEANING]`
- Trục D — hạng: T2 | T3 `[SUY-TỪ-REPO: contract-template]`
- Trục E — chữ ký: có | không `[SUY-TỪ-REPO: start-scan nhánh ev.signoff]`
- Trục F — độ sạch: sạch | bypass_used | có mục UNCERTAIN | «Known limits» có nội dung | «Ngoài hợp đồng» có nội dung | mục VẮNG `[SUY-TỪ-REPO: scripts/pre-merge-check.sh:327-372, hàm kiểm xanh-sạch]` [thước CE: sáu nhánh `clean_why` của chính hàm đó]
- Trục G — Cổng 1: `approved_by` có tên | rỗng | `gate1_skipped: true` `[SUY-TỪ-REPO: pre-merge nhánh approved_by rỗng → đòi làn V hoặc gate1_skipped]`
- Trục F bổ sung (S4-r3): `enforcement_mode: off` — lưới chặn trước xanh-sạch `[SUY-TỪ-REPO: scripts/pre-merge-check.sh ~905]`

Bảng sự-thật (AC-5) lấy B×C×D×E×F-thu-gọn (3) = 240 ô trên máy quét; đẳng thức
với lưới (AC-1) lấy **mặt cắt** F đầy đủ × B × G tại verified/PASS/chưa ký — nơi
sáu điều kiện phân biệt được nhau. **Core:** không-cần-người ⇔ lưới không VIOLATION.
**Chiều rủi ro có tên:** AC-3 (V-mở nhưng chưa sạch — lỗ vòng một) · AC-4
(da-veto) · AC-2 (sạch mà không khoá veto). **Never:** thêm trạng thái «cửa veto
đã đóng».

## Out of scope

- Không đụng `scripts/pre-merge-check.sh` — nó là BÊN ĐÚNG, vị từ JS phải khớp nó; không đụng `lib/`.
- Không đụng bản đồ sản phẩm (`product-map.mjs`) — ô vẫn đổi ở chỗ người ký; bản vòng một ở bản đồ được gỡ, quay về `main`.
- Không đụng thân vòng lặp `feature-loop` — không có bước vẽ lại nào cần thêm khi bản đồ không đổi luật.
- Không thêm trạng thái «cửa veto đã đóng» hay thời hạn veto; không ký bù 2.0.0/2.1.0; không xoá hai hồ sơ đó.
- Không mở vòng nạp `tests/plugins/cases/` — thuộc hồ sơ B.
- Không đo hành vi render của thân lệnh `/start` bằng hội đồng phiên sạch.
- Không đưa fixture `evidence-report.md` về khuôn canonical (cần marker ở khuôn — hồ sơ khác; sổ known-limits `#5`).

## Notes

- **Vị từ nói «không cần người», không nói «sạch».** Lưới chặn hồ sơ chưa ký ở hai chỗ: Cổng 1 (`approved_by` rỗng ⇒ đòi làn V đúng vết) và Cổng 2 (⇒ đòi sáu điều kiện). Máy quét phải hỏi CẢ HAI, nếu không lại lệch. Đó là lý do AC-1 đo bằng «lưới có VIOLATION không» chứ không đo từng điều kiện.
- **Phép đo đẳng thức không hằng-đúng** vì hai bên là hai bản dựng độc lập (bash · JS); đột biến bất kỳ bên nào làm phép so đỏ. Đây là ngả (ii) — hai bản chép có răng canh, đúng mẫu P30 «mirror == nguồn».
- **Không đụng `lib/`** là chủ ý: giữ T2 để hồ sơ đi làn V — đây là hồ sơ sửa chính làn V, nên nó là phép đo M1 sống. Lớp «vị từ sống ngoài lib» ghi ở sổ known-limits (`#3`), đóng khi hồ sơ nào đó đưa cả bash lẫn JS về một nguồn có suy biến fail-closed — việc T3, để dành.
- **Bản đồ:** `release-2-0-0`/`2-1-0` hiện «Đang làm» là ghi nhận không chính xác nhưng không có cổng nào gắn vào; máy quét vào phiên (`/start`) — nơi người hành động — mới là vật sửa.
- **Known limit (khai trước):** vế `commands/start.md` nêu hai trạng thái mới đo CHỈ DẪN, không đo hành vi render.
- **Known limit (S4-r4, sổ `#7` · `#8`):** hai bản dựng của luật sáu-điều-kiện chỉ khớp tới đâu ma trận fixture chọn tay phủ tới đó; chân cây-thật so với toàn bộ VIOLATION của lưới nên có thể đỏ vì hồ sơ khác — cả hai chấp nhận trong hạng T2.
- **Known limit (S4-r3, sổ `#6`):** làn V đóng Cổng 1 bằng máy làm ô bản đồ đổi mà không lượt nào vẽ lại — sửa gốc ở thân vòng lặp (ngoài phạm vi); hồ sơ này vẽ tay cùng lượt.
