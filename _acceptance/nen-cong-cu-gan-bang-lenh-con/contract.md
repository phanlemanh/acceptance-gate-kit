---
schema_version: 1
feature: Chân công cụ của đường nền đọc đúng lệnh chỉ-gán mang lệnh con — `B=$(git merge-base …) && …` tra `git`, không tra `merge-base`; lệnh con của một chương trình không bị coi là chương trình riêng; lệnh mở đầu bằng tên chương trình thật sự vắng vẫn đỏ gọi đúng tên
slug: nen-cong-cu-gan-bang-lenh-con
owner: phanlemanh@gmail.com
risk_tier: T2      # feature-loop/scripts + tests/scripts — không chạm hooks/ lib/ pre-merge/recheck
surfaces: [cli]
status: implemented       # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-24T08:48:11Z
design_doc: docs/superpowers/specs/2026-09-24-nen-cong-cu-gan-bang-lenh-con-design.md
---

# Acceptance Contract: nen-cong-cu-gan-bang-lenh-con

## Context

Chân `cong_cu` của đường nền (`feature-loop/scripts/duong-nen.mjs`) ghi
`nen cong-cu: THIEU merge-base (khoa executors.script.zqw_giu_nqz)` ở `~/dev/crm` nhánh
`onehub`, trong khi executor ấy chạy xanh thật ở hai lượt S4 (hồ sơ `zalo-qua-webhook`,
crm-onehub#105). Gốc: `tuDau()` tách từ chỉ theo khoảng trắng nên coi `B=$(git` là phép
gán rồi lấy từ kế `merge-base` làm tên chương trình. Tái hiện cô lập cho thấy đây là một
lớp: `B="$(git …)" && …` bị đọc thành `&&`, `` B=`git …` `` thành `rev-parse`. Người
hưởng: người ký Cổng Phạm vi ở crm và mọi kho tiêu thụ khai executor kiểu này — cờ «nền
đỏ» vì lý do sai là cờ người học cách bỏ qua. Trace nguyên tố 2 (bằng chứng không tự dối).

Source input: prompt (owner báo lỗi kèm tái hiện, 2026-09-24) · tái hiện lại trên chính hàm cùng ngày · neo triệu chứng: crm@onehub `64d7c593c53af1b352093343dfa82efc1364dc23` (config đổi lần cuối ở `82fde06b`), sha256 giá trị YAML thô của `zqw_giu_nqz` = `652e6eccb66fa661478ede817b496b72cae36638e024bff9da48fb6165d64379` — NEN-LC1 assert đúng băm này

## Criteria

- AC-1: Given kho fixture lành của NEN0 thêm MỘT khoá executor ngoài suite mang chuỗi lệnh NGUYÊN VĂN của `executors.script.zqw_giu_nqz` ở crm@onehub (dòng YAML nháy đơn chép nguyên), When đường nền chạy, Then mã 0, chân `cong_cu` XANH, không bullet `nen cong-cu:` nào và không dòng bỏ-tra nào trên stderr cho khoá đó — trong khi một khoá đối chứng chắc chắn bỏ-tra (`${X_KHONG_CO:-git} --version`) cùng lượt có ĐÚNG một dòng bỏ-tra nguyên văn (bộ dò được chứng là nhìn thấy).
- AC-2: Given cùng fixture, khoá ấy mang `khong-co-that --x`, When đường nền chạy, Then chân `cong_cu` ĐỎ, mã 1, và bullet ghim đúng `nen cong-cu: THIEU khong-co-that (khoa <khoá>)`.
- AC-3: Given lệnh đơn đầu là CHỈ phép gán và phép gán mang lệnh con viết theo một trong ba dạng `$(…)`, `"$(…)"`, `` `…` ``, When đường nền chạy, Then chương trình được tra là từ đầu của lệnh con: có trên máy → không bullet; không có → bullet ghim đúng tên chương trình trong lệnh con (không phải từ thứ hai của lệnh con, không phải `&&`).
- AC-4: Given lệnh đơn đầu là chỉ phép gán KHÔNG mang lệnh con (`A=1 && <lệnh>`), When đường nền chạy, Then chương trình được tra là từ đầu của lệnh đơn kế — có → im, không có → bullet ghim đúng tên ấy.
- AC-5: Given ma trận AC-3 × AC-4 (8 khoá) trong MỘT lượt, When đường nền chạy, Then tập bullet `nen cong-cu:` BẰNG ĐÚNG tập 4 dòng mong đợi (so bằng nhau) và không khoá nào trong 8 khoá có dòng bỏ-tra trên stderr.
- AC-6: Given các ca đã có của chân công cụ (NEN0, NEN1, NEN-TD1…NEN-TD6), When chạy sau bản vá, Then tất cả vẫn PASS — luật «từ đầu mang cú pháp shell thì bỏ tra và nói ra» không đổi.

## Coverage

- Trục A — hình dạng lệnh đơn đầu: tên trần | gán + tên | chỉ-gán mang `$(…)` | chỉ-gán mang `"$(…)"` | chỉ-gán mang `` `…` `` | chỉ-gán không lệnh con | từ đầu là thay thế (`${…}`, `$(…)`) | mở nhóm (`(`, `{`) [thước CE: POSIX.1-2017 XCU §2.9.1 Simple Commands + quét 5 113 khoá `executors.*` của mọi `~/dev/*/_acceptance/config.yaml` và crm@onehub, 24/09].
- Trục B — chương trình đích: có trên máy | không có [thước CE: `command -v`].
- Ô Core: A3×B-có (AC-1, chuỗi thật) · A1×B-không (AC-2) · A3/A4/A5 × B (AC-3) · A6 × B (AC-4) — gộp trong ma trận AC-5.
- Ô đã có ca, giữ (AC-6): A2×B-không (NEN1) · A7 (NEN-TD1, TD6) · A8 (NEN-TD3) · A1 + ống dẫn (NEN-TD2).
- Ô Never: từ đầu là `$(…)` trần không gán (`$(ls …) …`, 10/5 113 khoá) — chương trình chạy là ĐẦU RA của lệnh con, không phải lệnh con; luật bỏ-tra-và-nói-ra hiện có đã đúng.

## Out of scope

- Tra MỌI lệnh đơn trong chuỗi (`bun` sau `&&`): chân vẫn tra một chương trình mỗi khoá như hôm nay.
- Hiểu từ khoá điều khiển, heredoc, `$((…))` số học: `command -v if` đã trả 0; số học vào nhánh bỏ-tra-và-nói-ra.
- Sửa config của crm hay phát hành: crm nhận bản vá qua mốc phát hành kế, không vá tay cache.

## Notes

- Đo trên dữ liệu thật (24/09, máy tác giả — gap-probe F2: không là eval vì đọc `~/dev`, là vật người ký đọc): 5 113 khoá `executors.*` ở mọi `~/dev/*/_acceptance/config.yaml` + crm@onehub `64d7c593`. Trước vá (`a1ef0a3d`) và sau vá (`684445df`): cột TRA/BỎ-TRA đổi **0** khoá; tên được tra đổi **đúng 1** khoá — `crm@onehub executors.script.zqw_giu_nqz: merge-base → git`. Mười khoá `$(ls …)` vẫn bỏ-tra, chỉ dòng lý do in trọn từ thay vì mảnh cụt. Tái lập: `git show <sha>:feature-loop/scripts/duong-nen.mjs > /tmp/d.mjs && node _acceptance/nen-cong-cu-gan-bang-lenh-con/quet-kho.mjs /tmp/d.mjs <config…>` cho mỗi sha rồi `diff` hai đầu ra.
