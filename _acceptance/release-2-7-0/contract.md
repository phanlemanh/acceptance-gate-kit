---
schema_version: 1
feature: Phát hành kit 2.7.0 — đóng số cho vòng «lời mời cổng thành vật máy sinh» (#136), để repo tiêu thụ nhận thẻ điền sẵn + ba đường fail-quiet đã đóng theo mốc có chủ đích
slug: release-2-7-0
owner: manh.phan@onemount.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản GUIDE + workspace hồ sơ + bản đồ — không dính t3_paths, không đổi mã cổng
surfaces: [cli]
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-02T16:45:00Z
---

# Acceptance Contract: release-2-7-0

## Context

Kể từ mốc 2.6.0 (`93da8752`, 01/09) tới `eed998ab` (02/09), **đúng MỘT vòng đã
ký** — vòng meta duy nhất của cửa sổ, owner gọi tên 01/09:

- `loi-moi-cong-may-sinh` (#136, 02/09, T3) — ký với giới hạn ở trần ba vòng
  chấm, không vòng soi 4 (owner quyết 02/09). Bằng chứng ghim `873db3de`.

Diff của mốc, ngoài `_acceptance/` và `docs/`, là **mười hai file**:

- **Sáu file hành vi người dùng gặp:** `scripts/gate-card.js` (207 dòng) ·
  `lib/out-of-contract.js` · `commands/acceptance-card.md` ·
  `commands/approve.md` · `commands/signoff.md` ·
  `skills/acceptance/references/human-facing-language.md`.
- **Hai file chép luật một-nguồn:** `skills/acceptance/SKILL.md` ·
  `feature-loop/skills/feature-loop/SKILL.md` — mỗi file đổi đúng hai câu chép
  từ `GATE-INVITE-CLAUSE`; feature-loop KHÔNG đổi workflow hay script nào.
- **Ba file lưới trong nhà:** `tests/scripts/gate-card-lmcms.test.mjs` (mới, 33
  ca) · `tests/scripts/out-of-contract.test.mjs` (mới, 10 ca) ·
  `tests/plugins/run-tests.sh` — repo tiêu thụ không chạy suite của kit.
- **Một file máy sinh:** `PRODUCT-MAP.md`.

Không đổi schema, không cần migrate. `lib/out-of-contract.js` nằm trong
`t3_paths` nên vòng #136 đi T3 (Gate 1.5); mốc này không đụng thêm mã cổng nào.

Người dùng kit nhận gì (đọc trong diff manifest, mục v2.7.0):

1. Thẻ Cổng 1/2 in **một dòng lệnh đã điền sẵn** mọi ô có khuyến nghị máy;
   chỉ chừa ô chỉ-người-biết và chữ quyết. Điểm dữ liệu thật: Radar 2.6.0 ký
   Cổng 2 hôm 02/09 tốn 2 chạm (4 ô, 2 nghi thức) — dưới 2.7.0 còn 2 ô, cả
   hai là câu hỏi thật.
2. Khối **PHÁN QUYẾT ĐỐI KHÁNG** thay mắt người ở phần vượt nhận thức; luật rơi
   bậc: đối kháng không chạy được → thẻ khai thẳng, không điền sẵn.
3. Ba đường fail-quiet đóng: khối ngoài-hợp-đồng sai khuôn → cờ vàng thay vì
   biến mất trước lúc ký; token đề xuất lạ → cờ; cột SẼ/KHÔNG hết xếp nhầm vì
   chữ «không» giữa câu.
4. Hai nguồn danh tính khớp tuyệt đối → ghi thẳng, bỏ lượt Enter.

Source input: `git log 93da8752..eed998ab` · hồ sơ
`_acceptance/loi-moi-cong-may-sinh/` (evidence-report Known limits 1–9) · nếp
phát hành `_acceptance/release-2-6-0/` · owner phát ngôn «merge» 02/09 và lời
hứa «sau merge phát hành 2.7.0 theo làn V».

## Ba dòng số North Star của mốc (luật (c), lần đếm thứ ba)

Cửa sổ đếm: `93da8752` (2.6.0) → `eed998ab`. **Một vòng kit, meta.** Vòng sản
phẩm quan sát được ở kho tiêu thụ trong cùng cửa sổ: Radar
`dong-ho-chi-nhan-ngay-co-that` (ký 02/09, chạy dưới kit 2.6.0).

| Hồ sơ | Loại | Vòng chấm | Lượt gọi người | Hạ-tầng-kit đốt lượt | Làm-xong → quyết-được |
|---|---|---|---|---|---|
| `loi-moi-cong-may-sinh` (#136) | **meta**, T3 | 3 chấm + 1 đo lại (r1 REJECT · r2 REJECT dừng-vá · r3 REJECT dừng-vá · r4 PASS với giới hạn) | **trong thiết kế 4** (Cổng Đáng · Cổng Phạm vi · Gate 1.5 · Cổng Bằng chứng — đúng số cổng T3) · **ngoài thiết kế ≥7** (2 lần dừng-vá trình người · ≥4 lần phiên dừng phải nhắc «tiếp tục/resume» · 1 lần máy khai «đang chạy» sai) | 1 | 11:52 implemented → 23:16 ký = **11h24**; trên cây cuối 22:08 → 23:16 = **1h08** |
| Radar `dong-ho-chi-nhan-ngay-co-that` | sản phẩm, kho tiêu thụ | 8 (dừng-vá nổ ba lần, ship với giới hạn) | Cổng 2: **1 lượt, 2 chạm** (4 ô, 2 nghi thức — chính lớp mốc này cắt) | chưa đếm tay trọn vòng | chưa đếm |

- **Số lần gọi người / vòng kit: ≥11**, trong đó **4** đúng thiết kế T3 và
  **≥7** ngoài thiết kế. Mục tiêu luật (c) là ≤3 và **0 ngoài thiết kế** — mốc
  này TRƯỢT mục tiêu, và trượt ở **hạ tầng phiên**, không ở vật: hai lần dừng-vá
  là phanh có thiết kế nhưng vẫn là lượt gọi; năm lần còn lại là phiên tự dừng
  giữa S4 mà không dùng `/goal` (owner chẩn 02/09, sổ
  `docs/findings/2026-09-02-may-khai-dang-chay-va-bo-goal.md`).
- **Chạm / lượt: 1** ở cả bốn cổng thiết kế (Cổng 2: một câu gộp chép nguyên).
- **Vòng bị hạ-tầng-kit đốt lượt chấm: 1/1** — chính vòng này (phiên dừng ×4,
  lời khai «đang chạy» sai). Vòng Radar: dừng-vá nổ ba lần với các mục «đính
  chính ghi chép» — dấu hiệu đo-thước-của-thước trên vòng SẢN PHẨM, thuộc
  ngưỡng luật (a) «≥2 lượt chấm sai do phép-đo-tự-dối giữa hai release» —
  **chưa đếm tay, ghi để mốc kế đếm**, không kết luận ở đây.

### Chỗ cắt gọi tên cho cửa sổ kế (luật (c) bắt buộc)

**Lượt ngoài thiết kế do phiên dừng giữa S2→S4.** Số: ≥5/vòng ở mốc này, 0 là
mục tiêu. Cách cắt đã có tên trong kit: `/goal` + GOAL-TEMPLATE là cơ chế duy
nhất làm S2→S4 chạy không cần người; nó phải là bước **máy tự làm** khi vào S2,
không phải thứ người nhắc sau khi thấy phiên dừng. Đây không phải vòng meta mới:
là một dòng trong thân feature-loop, đo bằng đúng ba dòng số của mốc kế.

Giới hạn của số này, khai thẳng: bộ đếm «lần gọi người» vẫn là **đếm tay từ vết
hội thoại** — cùng giới hạn đã khai ở 2.5.0 và 2.6.0, chưa đóng; ô «bộ đếm chạm
bằng máy» còn ở Out of scope của #136.

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.7.0`), `diagram-design` hợp semver (giữ `2.7.0`, không đổi kể từ mốc trước — ba số trùng nhau là trùng hợp, không phải luật).
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy đủ bốn suite, Then cả bốn XANH và `product-map --check` khớp.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.7.0` và mục `v2.7.0` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.7.0` — đo trên đoạn cắt từ `v2.7.0`, sửa hay dời câu sang mục lịch sử KHÔNG được tính. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-6-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff) [thước CE: sáu mốc trước đã dùng thật] · Trục B · hành trình hồ sơ (bằng chứng | biên merge) [thước CE: `xanh_sach_check` + ADR 0012]. Ô Core → AC-1 · AC-2 · AC-3 · AC-6; không ô mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc, không có phiên đo (cùng căn cứ với release-2-3-0→2-6-0). Ngưỡng của #136 («≤3 lượt · 0 ngoài thiết kế · 1 chạm») đo ở vòng ĐẦU TIÊN chạy dưới thẻ mới ở kho tiêu thụ — tức mốc KẾ, không phải mốc này.

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/`) — mốc phát hành KHÔNG dựng răng (§7.1; bài học ba mốc 2.0.0/2.1.0/2.2.0).
- **Dựng răng riêng cho mốc.** Canh bằng ca VĨNH VIỄN P200 (mọi số đọc từ manifest, 5 đột biến + đối chứng dương) — cùng nếp 2.3.0→2.6.0.
- Nâng số `diagram-design` — không đổi kể từ mốc trước.
- **Chữ ký Cổng Phạm vi.** Mốc phát hành T2 đi làn V (tiền lệ 2.5.0; audit 01/09 gọi tên chữ ký 2.6.0 ở cổng này là thừa). Người xuất hiện MỘT lần, ở Cổng Bằng chứng.
- **Đếm tay trọn ba dòng số cho vòng Radar** — kho tiêu thụ, vết hội thoại không nằm trong repo này; ghi điểm dữ liệu quan sát được, để mốc kế đếm.
- Ghim lại các hồ sơ đã ký đang hoá cũ — §7.1: chiến dịch ghim lại là việc SAU khi mốc merge.
- Hai mục «mở hợp đồng mới» của #136 (Ngoài-1 · Ngoài-5) và hạt giống «Bất biến sản phẩm» — chờ owner gọi tên, luật Giới hạn CHIỀU RỘNG.
