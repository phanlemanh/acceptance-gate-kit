---
schema_version: 1
feature: Hồ sơ làn V không phải «chờ ký» — hai bộ đọc mặt người hỏi ĐÚNG sáu điều kiện xanh-sạch, cùng MỘT nguồn với lưới trước-merge
slug: lan-v-khong-phai-cho-ky
owner: phanlemanh@gmail.com
risk_tier: T3               # nâng từ T2 sau khi owner trả lại 21/08: nguồn luật chung sống ở lib/** (t3_paths)
surfaces: [cli]
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: lan-v-khong-phai-cho-ky

## Context

**Vòng một đã bị trả lại tại Cổng Bằng chứng (21/08).** Bản dựng đầu khoá vị từ vào
`veto_state`, trong khi luật thật quyết định «máy đi tiếp không cần ký» là
**sáu điều kiện xanh-sạch** ở `xanh_sach_check` (`scripts/pre-merge-check.sh:327-372`).
Hồ sơ này tự phơi ra hậu quả trên cây thật: lưới trước-merge in
`VIOLATION … làn V đòi xanh-sạch hoặc chữ ký (có mục UNCERTAIN)` và **chặn merge**,
trong khi thẻ vào phiên xếp nó vào `done: lan-v-mo` và bản đồ ghi «Đã giao — cửa
veto mở». Ba bộ đọc, hai kết luận trái nhau — và lệch **ngược chiều an toàn**:
cổng đang chặn thì biến mất khỏi chỗ người nhìn.

Vòng này sửa gốc: **một nguồn luật**, cả bash lẫn JS hỏi cùng một chỗ. Nguồn đó
sống ở `lib/` nên hồ sơ lên **T3** — Cổng Phạm vi là điểm dừng thật, làn V đóng.

Nền đã có (giữ lại, không viết lại): vị từ + 7 ca LV trên fixture code-sinh +
răng hồ sơ 4 chân, đều xanh ở vòng một.

Source input: `docs/plans/2026-08-21-hat-giong-lan-v-khong-phai-cho-ky.md` (Cổng 0 gật, #74)
· sổ quyết định `gate2` ngày 21/08 (trả lại).

## Criteria

- AC-1: Given `lib/` có hàm `xanhSach(contractTxt, evidenceTxt)` trả `{clean, why}` theo ĐÚNG sáu điều kiện (verdict PASS · `bypass_used` không true · hạng T2 · 0 mục UNCERTAIN · «Known limits» hiện-diện-và-rỗng · «Ngoài hợp đồng» hiện-diện-và-rỗng), When gọi nó trên một ma trận fixture code-sinh phủ mỗi điều kiện ở cả hai chiều, Then kết quả `clean` khớp bảng kỳ vọng viết trước, và `why` nêu ĐÚNG điều kiện đầu tiên trượt.
- AC-2: Given cùng ma trận fixture của AC-1, When chạy **chính** `scripts/pre-merge-check.sh` trên từng fixture, Then kết luận sạch/không-sạch của nó khớp **bảng kỳ vọng viết tay** (bảng của AC-7, độc lập với cả bash lẫn lib) ở MỌI ô — và một đột biến ở **mối nối** (lớp vỏ bash đọc/ánh xạ đầu ra `node -e`) phải làm phép đo ĐỎ. *Không* đo bash ↔ lib: dưới ngả (i) bash gọi lib nên phép so đó hằng-đúng.
- AC-3: Given một hồ sơ `status: verified`, `human_signoff` rỗng, `veto_state` KHÁC `da-veto`, When cả `start-scan.mjs` lẫn `renderProductMap` đọc nó, Then hồ sơ là «đã giao» ⇔ `xanhSach` trả `clean: true` — trong nhánh này việc có hay không có khoá `veto_state` KHÔNG đổi kết luận. Thứ tự nhánh tường minh, người thi công không được tự chọn: (1) `da-veto` cắt trước mọi thứ (AC-6) → (2) có chữ ký ⇒ đã giao, đã ký → (3) còn lại: `xanhSach` quyết.
- AC-4: Given hồ sơ đủ sáu điều kiện nhưng **thiếu** `veto_state` (người duyệt Cổng 1 bằng tay), When hai bộ đọc chạy, Then nó vẫn là «đã giao» và **không** mang chú thích «cửa veto mở» — chú thích chỉ đi kèm khi `veto_state: mo` có vết giờ parse được.
- AC-5: Given hồ sơ có `veto_state: mo` + vết giờ + T2 + verdict PASS nhưng **trượt** một trong bốn điều kiện còn lại (bypass · UNCERTAIN · Known limits có nội dung · Ngoài hợp đồng có nội dung), When hai bộ đọc chạy, Then nó nằm ở **cổng chờ chữ ký** (`gates: bang-chung` / «Đang làm»), KHÔNG phải «đã giao» — đây là ca đã làm vòng một trượt, phải đỏ nếu vị từ quay lại khoá vào `veto_state`.
- AC-6: Given `veto_state: da-veto`, When hai bộ đọc chạy, Then KHÔNG bộ đọc nào xếp «đã giao», bất kể bằng chứng sạch tới đâu — veto là phát ngôn của người, phải còn hiện ở nơi người thấy.
- AC-7: Given **bảng sự-thật viết trước** trên tích Descartes: trạng-thái-veto (5) × verdict (5) × hạng (2) × chữ ký (2) × **độ-sạch (3: sạch · bypass · Known-limits-có-nội-dung)** = 300 ô, fixture code-sinh, When hỏi cả hai bộ đọc từng ô, Then mỗi ô khớp hàm kỳ vọng viết tay; số ô «đã giao» đúng bằng số ô mà hàm kỳ vọng khai là sạch-và-chưa-ký.
- AC-8: Given ô của một hồ sơ trên bản đồ đổi khi làn V đóng cổng (`implemented`→`verified` + sạch), When một vòng làn V chạy hết, Then `PRODUCT-MAP.md` đã được vẽ lại **trong cùng vòng đó** và `product-map.mjs --root . --check` exit 0 — không để cửa chặn đỏ cho hồ sơ sau; và chú thích đầu `product-map.mjs` nói đúng luật mới («ô đổi ở mỗi lần ĐÓNG CỔNG, kể cả cổng máy đóng ở làn V»).
- AC-9: Given `tests/plugins/lan-v.test.mjs` nhận bộ lọc `LV_CASES`, When khai một tên không khớp ca nào, Then file exit khác 0 kèm thông điệp nêu tên đã khai — sàn đếm chống «xanh với 0 assertion», cùng khuôn `only_matched` sẵn có cuối `tests/plugins/run-tests.sh`.
- AC-10: Given chuỗi nhãn «cửa veto mở» và thông điệp của `xanhSach`, When so nguồn khai với `scripts/pre-merge-check.sh` và `commands/start.md`, Then mỗi chuỗi khai đúng MỘT nơi và hai nơi kia đọc lại nó; bản sao đổi một chữ ở bất kỳ bên nào làm răng đỏ ghim tên bên lệch.
- AC-11: Given cây thật của kit sau thay đổi, When vẽ lại bản đồ và chạy máy quét thật, Then `release-2-0-0`/`release-2-1-0` (sạch) nằm dưới «Đã giao» kèm chú thích, `release-2-2-0` (đã ký) giữ nguyên không chú thích, **hồ sơ NÀY** nằm ở **cổng chờ chữ ký** chứ không phải «đã giao», và `--check` exit 0. Khai thẳng: hồ sơ này trượt vì BA lý do độc lập (hạng T3 · `status: draft` · không có bằng chứng) nên nó KHÔNG chứng minh nhánh nào của AC-5 — chỉ là một ô âm chung. Nhánh «sạch hay chưa» của AC-5 chứng minh ở E5 trên fixture code-sinh.
- AC-12: Given máy chạy **thiếu `node`** hoặc thiếu `lib/evidence-core.cjs`, When chạy `scripts/pre-merge-check.sh` trên một hồ sơ đúng-ra-là-sạch, Then cổng KHÔNG coi nó là sạch: VIOLATION (hoặc exit 2) kèm thông điệp nêu đúng lý do không đọc được nguồn — suy biến rơi về phía ĐÒI NGƯỜI. Đối chứng dương cùng lượt: cùng hồ sơ ở môi trường đủ công cụ ⇒ sạch. *Trụ an toàn của ngả (i): thiếu nó thì lệch rơi vào chính lưới trước-merge — nặng hơn lỗi vòng một, vốn chỉ lệch ở bề mặt người nhìn.*

## Coverage

Quét bằng morphological-scan (preset ma-trận-kiểm). Trục A–E giữ nguyên từ vòng một;
vòng này **thêm trục F — độ sạch**, đúng chỗ vòng một mù.

- Trục A — bộ đọc: máy quét vào phiên | bản đồ | lưới trước-merge (nay là **bên tiêu thụ cùng nguồn**, không còn chỉ để tham chiếu) `[SUY-TỪ-REPO: scripts/start-scan.mjs, scripts/product-map.mjs, scripts/pre-merge-check.sh]`
- Trục B — trạng thái veto: vắng | mo + vết ok | mo + vết hỏng | da-veto | giá trị lạ `[SUY-TỪ-REPO: lib/evidence-core.cjs vetoGateState]`
- Trục C — verdict: PASS | PENDING-JUDGMENT | REJECT | BLOCKED | vắng file `[SUY-TỪ-REPO: start-scan VERDICT_MEANING]`
- Trục D — hạng: T2 | T3 `[SUY-TỪ-REPO: contract-template]`
- Trục E — chữ ký: có | không `[SUY-TỪ-REPO: start-scan nhánh ev.signoff]`
- **Trục F — độ sạch (MỚI): sạch | bypass_used true | có mục UNCERTAIN | «Known limits» có nội dung | «Ngoài hợp đồng» có nội dung | mục VẮNG (vắng ≠ rỗng) | **không đọc được nguồn luật (thiếu node / thiếu lib)**` `[SUY-TỪ-REPO: scripts/pre-merge-check.sh:327-372 xanh_sach_check]` [thước CE: sáu nhánh `clean_why` của chính hàm đó + nhánh công-cụ-vắng (AC-12)]

Không gian đo bằng **bảng sự-thật viết trước** (AC-7) trên B×C×D×E×F thu gọn còn
300 ô (F lấy 3 đại diện: sạch · bypass · Known-limits-có-nội-dung; ba nhánh F còn
lại đo riêng ở AC-1/AC-2 nơi chúng phân biệt được `why`). **Core:** ô sạch-và-chưa-ký
⇒ «đã giao». **Chiều rủi ro có tên:** AC-5 (V-mở nhưng chưa sạch — lỗ đã làm vòng
một trượt) · AC-4 (sạch mà không có veto keys) · AC-6 (da-veto) · AC-2 (đẳng thức
với bash). **Never:** thêm trạng thái «cửa veto đã đóng» (luật làn V: cửa không hạn).

## Out of scope

- Không thêm trạng thái «cửa veto đã đóng» hay thời hạn veto — bản sau chồng lên chỉ làm veto *không còn đáng*, người cân khi nhìn.
- Không ký bù 2.0.0/2.1.0, không xoá hai hồ sơ đó — sổ M1 sống trong chúng.
- Không đổi **ý nghĩa** sáu điều kiện xanh-sạch — vòng này chỉ gom chúng về một nguồn, không nới cũng không siết. Đã đối chiếu nguồn (`scripts/pre-merge-check.sh` nhánh `__VANG__`): bash HÔM NAY đã xếp «mục VẮNG» là **chưa sạch** (`clean_why="mục «…» VẮNG khỏi báo cáo (vắng ≠ rỗng)"`), nên AC-1 chép đúng ngữ nghĩa đang chạy — không siết. (Phản biện context sạch nêu đây là điểm bằng-chứng-thiếu vì nó bị cấm đọc mã; kiểm hộ và ghi lại ở đây.)
- Không mở vòng nạp `tests/plugins/cases/` — thuộc hồ sơ B (`hat-giong-ba-cho-tich-luy`).
- Không đo hành vi render của thân lệnh `/start` bằng hội đồng phiên sạch — lớp mã tiền định trước.
- Không sửa lớp «hồ sơ làn V đường A mất Cổng Giá trị» (finding Ngoài-7 vòng một) — đó là một câu hỏi về vòng TRAO, mở hồ sơ riêng.
- Không đưa fixture `evidence-report.md` về khuôn canonical — cần thêm marker vào `evidence-report-template.md`, việc của hồ sơ khác; ở lại sổ known-limits (`#5`).

## Notes

- **AC-2 đo bash với BẢNG KỲ VỌNG VIẾT TAY, không đo bash với lib.** Dưới ngả (i) bash *gọi* lib, nên đột biến lib làm hai vế cùng đổi và phép so hoá **hằng-đúng** (phản biện context sạch bắt, 21/08 — đúng lớp lỗi vòng một). Thước hợp lệ: (a) kết luận của bash trên từng fixture khớp **bảng kỳ vọng viết tay** của AC-7, bảng độc lập với cả hai bên; (b) một đột biến ở **mối nối** — lớp vỏ bash parse đầu ra `node -e` — phải làm răng đỏ, chứng minh phép so phân biệt được.
- **Hai ngả thi hành, máy khuyên ngả (i):** (i) `xanh_sach_check` của bash **gọi** nguồn ở `lib/` qua `node -e`, **fail-CLOSED** khi thiếu node/lib (không đọc được ⇒ coi như chưa sạch ⇒ vẫn đòi người) — một nguồn thật, và chiều suy biến rơi về phía an toàn; (ii) giữ hai bản dựng, ghim đẳng thức bằng răng. Ngả (i) đúng luật «một nguồn» của kit và chỉ an toàn được vì hướng suy biến là fail-closed; ngả (ii) rẻ hơn nhưng để lại đúng lớp lỗi hai-bản-chép mà kit đã dẫm. Thước của AC-2 **khác nhau theo ngả**: ngả (i) đo bash ↔ bảng kỳ vọng + đột biến mối nối; chỉ ngả (ii) — hai bản dựng độc lập — mới được đo bash ↔ lib.
- **Bất biến bản đồ được PHÁT BIỂU LẠI, không bị phá:** chú thích đầu `product-map.mjs` nói ô đổi ở *mỗi lần đóng cổng người*. Làn V **là** một lần đóng cổng — máy đóng, người giữ quyền veto. Nên luật mới: ô đổi ở mỗi lần đóng cổng, kể cả cổng máy đóng; đổi lại **làn V phải vẽ lại bản đồ trong cùng vòng** (AC-8), nếu không chính nó dựng cửa chặn đỏ ở CI.
- **Vòng một để lại gì:** vị từ `lanVMo` + hằng `VETO_OPEN_NOTE` (nay đổi chỗ về `lib/` và đổi tiêu chí), 7 ca LV, răng 4 chân, 3 đột biến có marker. Vòng này mở rộng chứ không viết lại.
- **Răng vẫn khai `cmd:` bằng đường dẫn**, không thêm khoá `config.yaml` (nếp hạt giống B) — đã chạy thật một vòng, không vấp.
- **T3 nên không có làn V:** Cổng Phạm vi và Cổng Bằng chứng đều là điểm dừng thật. Khoá `veto_state` đã gỡ khỏi frontmatter cùng lượt hạ về `draft`, có entry sổ quyết định.
- **Known limit (khai trước):** vế «thân lệnh `/start` nêu cách đếm» của AC-10 đo CHỈ DẪN (chuỗi trong `commands/start.md`), không đo hành vi render.
