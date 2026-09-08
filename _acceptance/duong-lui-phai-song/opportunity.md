---
schema_version: 1
slug: duong-lui-phai-song
feature: Đường lùi phải sống — làn máy-đi-trước có đường lùi thật ở cả hai cửa (người veto được bằng một chữ · máy không được coi «không đo được» là sạch)
owner: phanlemanh@gmail.com
stage: decided
decision: build
decided_by: Manh Phan
decided_at: 2026-09-07T21:40:00Z   # ISO UTC — mốc phát ngôn «Thực hiện hết» trong hội thoại 08/09 04:40 giờ VN, máy ghi hộ
prototype:
  base_commit:
  disposition:
---
## Vấn đề & ai gặp

Kit cho máy đi trước (làn V) dựa trên một lời hứa duy nhất của hiến pháp: *máy giữ được
đường đảo thì máy mới được đi trước* (CLAUDE.md, nguyên tố 3). Hôm nay lời hứa đó thủng
ở hai cửa, đo được trong chính cửa sổ 2.8→2.9 (mốc 2.9.0, 07–08/09/2026):

**Cửa của người — veto.** Thẻ Cổng Bằng chứng của hồ sơ máy-đi-trước in ô «veto hay để
yên» và dạy gõ «veto: lý do» (`scripts/gate-card.js:818,993`), nhưng ngữ pháp câu gộp
`GATE-ONESHOT-GRAMMAR` không có nhãn veto và không lệnh nào ghi được `veto_state: da-veto`
— đường duy nhất là sửa tay frontmatter. Ô kết «máy đã thông» (`machine-cleared`) có đủ
mọi bên đọc (lưới, hook, bộ quét, bản đồ, thẻ, hai lệnh báo cáo, từ vựng) nhưng KHÔNG bước
nào của vòng ghi nó: hôm nay 38 hồ sơ mở cửa veto đều nằm ở `verified`, 0 hồ sơ ở ô kết —
người mở bảng không phân biệt được «đang chờ tôi» với «xong rồi, tôi chỉ có quyền veto».
Vòng `lan-v-khong-phai-cho-ky` (24/08) dựng xong bộ đọc rồi thu phạm vi ở đường ghi vì
thẻ mời ký hồ sơ máy-thông có `opportunity.md` (bug `MAY_DI_TIEP` chỉ nhận 4 khoá).

**Cửa của máy — «không đo được» đọc như «sạch».** (c) Ở chốt trước-merge, recheck
KHÔNG CHẠY ĐƯỢC (script vắng, node vắng, lib hỏng, đọc file lỗi — 4 đường) in NOTE kể cả
`recheck: strict` (`scripts/pre-merge-check.sh:1225-1229`): cổng chết đọc y hệt cổng sạch.
(d) Nhánh xanh-sạch `continue` ở dòng 956, TRƯỚC khối kiểm bằng-chứng-cũ ở 1021 — mọi hồ
sơ làn V thoát phép kiểm đó; cùng họ: bash `xanh_sach_check` nhận heading h1 là «có mặt»
nhưng lấy thân bằng `section()` chỉ nhận h2–h6, nên h1 «Known limits» có nội dung thật
đọc thành rỗng (sổ `lan-v-khong-phai-cho-ky#9`, LV5 cố ý loại trừ ca này). (e) Lệnh ký
commit chữ ký ở bước 7 rồi mới re-check ở bước 8, không chạy suite, không ghim dòng định
tuyến — mỗi chữ ký kéo một CI đỏ rồi một lượt ghim lại: cửa sổ 2.8→2.9 đếm 3, mốc 2.9.0
thêm 2.

**Người trả giá:** người ký — có nút dừng in trên thẻ mà không bấm được, đọc tên hồ sơ ở
ô sai, và phải quay lại sửa hậu quả của chính chữ ký mình; và owner — lời hứa «máy đi
trước nhưng lưới vẫn canh» đúng cho hồ sơ có chữ ký, sai cho 38 hồ sơ làn V. Nếu đường lùi
không thật, chỉ còn hai lựa chọn xấu: ngừng tin làn V (tăng lượt gọi người) hoặc tin mà
không có nút dừng.

Gom vào ô này: hai ô discovery `lan-may-thong-duong-ghi` (27/08) và `lan-v-thoat-kiem-stale`
(27/08) — cả hai lưu kho với con trỏ về đây; Ngoài-2 và Ngoài-4 của
`thuoc-khai-mot-dang-do-mot-neo` (mục rỗng bỏ mời ký · `s4-args.json` lệch `evals.yaml`);
nợ Ngoài-4 của `vu-trang-goal-luc-goi-ten` và chỗ cắt gọi tên của hai mốc 2.8.0 + 2.9.0.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Năm mục sửa được mà KHÔNG thêm lệnh cổng người thứ bảy (ADR 0002) — veto đi qua lệnh ký hiện có, đường ghi ô kết là script máy gọi | phải mở lệnh mới → vi phạm danh sách đóng, ô này chết | đọc `commands/signoff.md` + ngữ pháp SLOTS: nhãn «veto hay để yên» đã có trên thẻ, chỉ thiếu bên đọc | Đã thử 08/09: đúng — nhãn có, reader thiếu |
| 2 | Đóng fail-open (c)(d) không làm hồ sơ sử liệu (đã merge) đỏ hàng loạt — vì stale-theo-diff-pr chỉ soi slug trong diff | 60+ hồ sơ cũ đỏ → chặn mọi PR | chạy `pre-merge-check.sh --recheck-all` trên bản vá, đếm VIOLATION mới | Chưa thử (làm ở S3) |
| 3 | Lệnh ký chạy suite + ghim định tuyến + làn ghim lại TRƯỚC khi push khép được vòng cho hồ sơ đang ký (không hứa khép toàn kho) | vẫn 1 CI đỏ/chữ ký → mục (e) không đạt ngưỡng | mốc 2.9.0 đã làm tay đúng chuỗi này: 0 CI đỏ do chữ ký (2 CI đỏ của mốc do nguyên nhân khác) | Đã thử tay 08/09 — sống |
| 4 | Vá (c)(d) tuân được răng additive-only (DV5): chỉ THÊM dòng, mọi dòng gỡ khai đích danh | DV5 đỏ, phải viết lại theo kiểu thêm-không-sửa | đọc `tests/scripts/additive-only.test.mjs` | Đã đọc: có cơ chế ALLOWED_REMOVALS |

## Ngưỡng chết / ngưỡng UAT

Không đo được — vòng nội bộ bộ công cụ, không có người dùng cuối; thước thành công là
chiều đỏ tự chứng của từng mục và hai số đếm ở mốc phát hành kế: **CI đỏ hậu-chữ-ký/mốc:
2 → 0** và **hồ sơ merge với mục báo cáo rỗng-vì-vắng-dữ-liệu: 1 → 0**. Kết quả CHẾT: phải
thêm lệnh cổng người thứ bảy, hoặc phải sửa hồ sơ đã ký để cổng xanh, hoặc chạm trần ba
vòng chấm ở lát 2 (khi đó đường cắt đã khai: bỏ lát 1 — (a)(b) — ship lát 2). Timebox:
≤ 2 ngày làm việc kể từ Cổng Phạm vi.

## Hạt giống — cắm ở đâu trong kit

- (e) `commands/signoff.md` bước 7: thêm bước máy TRƯỚC commit — script chạy `suite_keys`
  + ghim dòng định tuyến + tự kiểm; sau commit chữ ký chạy làn ghim lại (`repin-lane.mjs`)
  trong cùng lượt, TRƯỚC push.
- (c) `scripts/pre-merge-check.sh:1225-1229`: chế độ `strict` → «không chạy được» là
  VIOLATION có tên đường (script vắng · node vắng · exit 2), thêm-không-sửa (DV5).
- (d) `scripts/pre-merge-check.sh:956`: nhánh xanh-sạch kiểm `verified_commit` TRƯỚC khi
  `continue`; và `xanh_sach_check` ranh tiêu đề về `#{2,6}` cùng `section()`; LV5 gỡ loại
  trừ ca h1.
- (a) `GATE-ONESHOT-GRAMMAR` + SLOTS thêm `g2 veto hay để yên`; `commands/signoff.md` nhận
  «veto: <lý do>» trên hồ sơ máy-đi-trước → ghi `veto_state: da-veto` + entry sổ + commit.
- (b) `scripts/khong-can-nguoi.mjs --write`: sáu điều kiện + T2 → ghi `status:
  machine-cleared`; SKILL feature-loop gọi ở routing S4 PASS xanh-sạch; `gate-card.js`
  `MAY_DI_TIEP` nhận thêm hai khoá có `opportunity.md`.

## Nguồn ngoài & phạm vi kế thừa

- `docs/findings/2026-09-07-bai-hoc-playbook-ban-de-doc.md` §2 bài 3 + §4 (bốn việc sửa ngay).
- `docs/findings/2026-09-07-tong-hop-hat-giong-va-o.md` §2 lớp I.
- `docs/plans/2026-08-27-hat-giong-lan-v-thoat-kiem-stale.md` (đề bài đầy đủ của (d)).
- `_acceptance/lan-v-khong-phai-cho-ky/` (bộ đọc ô kết đã ship; Known limits #7, #9).
- `_acceptance/release-2-9-0/contract.md` §Chỗ cắt gọi tên; Known limits 5 và 8.
- Playbook AI-Native SDLC: «rollback là đường được tập nhiều nhất, chứng minh TRƯỚC khi cần»;
  «một lớp chỉ thành cổng khi hỏng thì không chạy».
