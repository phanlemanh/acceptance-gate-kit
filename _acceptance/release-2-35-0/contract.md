---
schema_version: 1
feature: Phát hành kit 2.35.0 — nền thiết kế design-floor-2710 (FL1–FL5), design-gate chế độ chặt tuỳ chọn, vùng giao việc đi từ cắt lượt, khung đợt định vị với bộ đếm «cần anh» đếm đủ; kho chờ nhận invest (thí điểm nền thiết kế, bậc M1) rồi crm
slug: release-2-35-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 5 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + lộ trình kit + bản đồ + ghi chú nhận + khoá executor — KHÔNG dính t3_paths
surfaces: [cli]
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-28T20:37:38Z
---

# Acceptance Contract: release-2-35-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `invest` (đang ở 2.34.0) nhận trước, làm thí điểm DO1 cho nền thiết kế ở bậc
M1; `crm` (đang ở 2.34.0) nhận sau — báo cáo 24 giờ của crm (28/10) cho thấy lịch biết tệp vẫn mù khi chưa có vùng giao
việc. Mốc lộ trình: «Phát hành 2.35.0» (trước đây «Phát hành 2.x kế tiếp — design-floor-2710 (số đặt lúc cắt)»).

**Quyết của chủ kho:** 28/10 «Chốt danh sách gom cho bản 2.35.0: FL1–FL5, vùng giao việc, vòng bộ đếm «cần anh» + khung
đợt định vị, và TC1 (#419) nếu kịp ký. Cắt bản khi vòng khung đợt gộp.»; 29/10 «Gộp và cắt bản». Vòng khung đợt (#440)
gộp `f5bbb13f` 28/10. TC1 chưa ký và đang xung đột với nhánh chính — không vào mốc, mốc không chờ.

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ:
`design-gate-che-do-chat` (#413 → `35f494cc`) · `design-floor-vendor-va-ban-va-a` (FL2, #427 → `16ffa462`) ·
`design-floor-ban-va-b-c-d` (FL3, #429 → `641c460b`) · `design-floor-moc-s0-s1` (FL4, #433 → `668f68d8`) ·
`design-gate-khong-do-duoc-ba-nguyen-nhan` (FL1, #434 → `2d4337fb`) · `design-floor-moc-s3-s4` (FL5, #438 → `6bab1d56`)
· `vung-giao-viec-tu-cat-luot` (#436 → `4918210d`) · `khung-dot-dinh-vi` (#440 → `f5bbb13f`). Ngoài vòng: #435 (ADR 0027
bốn chân của một quyết định — chỉ bước (a)–(b) đã dựng, ở `khung-dot-dinh-vi`) · #439 (báo cáo đóng đợt
`design-floor-2710`) · #421 (hợp đồng nhập của design-floor, bước 1) · #422, #424, #425, #426, #428, #431, #437 (kế hoạch,
cắt lượt và mốc của đợt) · #432 (đề bài vùng giao việc) · #416 (Cổng Đáng một ô) · #414, #420 (hạt giống, ghi chép) ·
#423 (bật tầng tri thức của chính kit) · #412 (dòng KC1 của 2.34.0).

Số là **2.35.0** (minor): bề mặt mới — lệnh `design-floor-*` và khoá `executors.design.floor`, khối cấu hình
`design_floor`, cờ `--require-measured` của design-gate, lệnh `hoi` / `hoi-xong` và `xem --khung` của gói `dieu-phoi`,
khoá `muc_tieu` của gói đợt, khoá vùng mã của hàng lộ trình. Không gãy đường đọc-cũ: kho M0 (không khai
`design.surface_globs`) không thấy gì đổi; vắng cờ thì design-gate không đổi mã thoát nào. Năm dòng số, dự báo, điều
kiện tin cậy, dòng hiệu chuẩn và ghi chú nhận cho crm nằm ở mục `2.35.0` của `CHANGELOG.md` — một nguồn, hồ sơ không chép
lại; ghi chú nhận cho invest kèm đường nền DO1 ở `docs/handoff/2026-10-29-nhan-2-35-0-invest-thi-diem-design-floor.md`.

Source input: `git log v2.34.0..HEAD --first-parent` · nếp phát hành `_acceptance/release-2-34-0/` · Notes và Known
limits của tám hồ sơ · GUIDE §5.2 (khối `executors.design` + `design_floor`) · `scripts/design-floor-bac.mjs`.

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (nơi ca vĩnh viễn P200 sống), Then lệnh thoát 0 — P200 đọc số từ sáu manifest và đòi `acceptance-gate`, `feature-loop`, `dieu-phoi`, `road-map`, `tri-thuc` mang CÙNG một số hợp semver, `diagram-design` hợp semver; P200 đỏ thì vùng 3 thoát khác 0.
- AC-2: Given cây đã sửa, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 dựng câu «Khớp phiên bản» của GUIDE từ các số đọc trong manifest rồi so (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows) VÀ trọn bộ ca điều phối (`tests/dieu-phoi/**`), Then mọi lệnh XANH và `product-map --check` khớp (PRODUCT-MAP.md và LO-TRINH.html vẽ lại sau khi sửa lộ trình kit).
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 0e095648 …`, mốc = commit gắn thẻ `v2.34.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `0e095648` (thẻ `v2.34.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 đòi mô tả `acceptance-gate` CÓ mục của đúng số đang phát hành và mục đó của `feature-loop` TỰ khai cặp `acceptance-gate >= <số>`.
- AC-7: Given mốc `0e095648`, When liệt tệp đổi dưới `road-map/` và `tri-thuc/` tới HEAD bằng git, Then tập tệp đổi BẰNG đúng hai manifest — hai gói chỉ đổi số, như CHANGELOG mục `2.35.0` kể.
- AC-8: Given khối INIT-CI-COPY-LIST của `acceptance-init`, gạch «Lớp chép CI» của mục `2.35.0` trong CHANGELOG và mốc `0e095648`, When rút danh sách chép, rút danh sách ghi chú kể, rồi so tệp nào đổi byte tới HEAD, Then tập tệp đổi BẰNG tập ghi chú kể (tệp lệnh của `release-2-29-0`, dùng lại).
- AC-9: Given mục `2.35.0` của `CHANGELOG.md` cùng nguồn nó chép, When đọc từng mục con, Then (o) mỗi câu mô tả vòng (câu giao, lý do, giới hạn trích) là chữ của hợp đồng hồ sơ ấy, không tóm tắt lại, và số giới hạn đã khai khớp Notes của hợp đồng; (i) lời về bậc M0–M3, lệnh và khoá của nền thiết kế khớp `scripts/design-floor-bac.mjs`, GUIDE §5.2 và các khối DESIGN-FLOOR-S0/S1/S3/S4 của SKILL feature-loop; (ii) lời về lệnh `hoi`, `xem --khung` và vùng giao việc khớp `dieu-phoi/README.md`; (iii) lời về lớp chép CI khớp nhãn trong `commands/acceptance-init.md`; (iv) đoạn «Vì sao 2.35.0» và «Ai bị ảnh hưởng» không giấu đổi hành vi chạm kho đang dùng (kho đã khai `design.surface_globs` thành M1 và thấy dòng bậc ở S0; «cần anh» lớn hơn ở kho có câu giám sát; `p0_count` của chế độ dom không còn đếm phát hiện không đo được).
- AC-10: Given số trong `.claude-plugin/plugin.json` ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc`, Then lệnh chạy TRỌN kiểm bản cài trên HEAD và thoát 0 với «TỔNG KẾT: ĐẠT 8/8 — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.
- AC-11: Given ghi chú nhận cho invest, When đọc cạnh `scripts/design-floor-bac.mjs`, GUIDE §5.2 và cấu hình hiện tại của kho nhận (kể trong ghi chú), Then (i) các bước khai đưa kho lên ĐÚNG bậc M1 — không hơn — theo luật của bộ đọc bậc, và nói máy không tự nâng bậc; (ii) lệnh `executors.design.floor` và khối `design_floor` theo đúng khuôn GUIDE §5.2; (iii) bảng đường nền DO1 có sha đỉnh đã đo, giờ lấy về, định nghĩa từng cột, và không chứa slug, tên tính năng hay nội dung sản phẩm của kho nhận (kho kit công khai).

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-34-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi | lớp chép CI | bản cài khớp thẻ) `[thước CE: ba mươi mốt mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; gói chỉ đổi số → AC-7 (nay hai gói); lớp chép CI khớp ghi chú → AC-8; ghi chú nhận chép đúng chữ nguồn → AC-9 (judgment); bản cài khớp thẻ → AC-10 (khoá KC1). Ô mới của mốc này: ghi chú nhận cho kho thí điểm có bậc đúng và đường nền ẩn danh → AC-11 (judgment) — lần đầu một mốc mang đường nền đo trước khi bật cho kho nhận.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội; ngưỡng của từng vòng sống ở hồ sơ của chúng. Đường nền DO1 của invest (mười vòng giao diện gần nhất) ghi ở ghi chú nhận để kho đọc lại trước/sau.

## Out of scope

- Đổi dòng mã cổng — mốc phát hành KHÔNG dựng răng mới (GUIDE §7.1).
- TC1 (#419) — chưa ký, xung đột với nhánh chính; chủ kho 28/10 không giữ bản vì TC1.
- Bước (c)–(f) của ADR 0027 — việc kit sửa nghi thức của kit, chịu luật chiều rộng (b), đi sau mốc kế tiếp được một kho tiêu thụ nhận.
- Sửa Known limits của tám hồ sơ — vòng sau.
- Cài 2.35.0 vào invest và crm, khai `design.surface_globs`, `executors.design.floor`, bật thí điểm DO1 — việc của kho nhận sau mốc.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths`.
- Cùng PR: lộ trình kit `docs/plans/lo-trinh-kit.json` — mốc «Phát hành 2.x kế tiếp — design-floor-2710» đổi tên thành
  «Phát hành 2.35.0», ngày về 29/10; vẽ lại `LO-TRINH.html` và `PRODUCT-MAP.md`.
- Hai bộ ca của nền thiết kế (`tests/design-floor`, `tests/design-eval`) cần cài phụ thuộc ghim và chạy ở job CI riêng
  (`design-floor`, `design-eval`) trên PR mốc — không vào `feature_loop.suite_keys`, nên không vào lượt chấm.
- Đường nền DO1 đo ở invest trên nhánh chính đã lấy về 29/10; ẩn danh trước commit (kho kit công khai).
- Lượt chấm 1 dừng giữa chừng, không có báo cáo: bản đồ sản phẩm chưa vẽ lại sau khi hồ sơ mốc sang `implemented` (lỗi
  của chính PR mốc); lượt 2 chấm trên đỉnh đã vẽ lại, không mang kết quả lượt 1 (sổ d-20261028T211500Z-10).
- Chỗ cắt cho cửa sổ kế (luật (c); chủ kho 29/10 «Chọn (c)», phiên điều phối chuyển): vòng meta duy nhất sau khi một kho
  tiêu thụ nhận 2.35.0 là ADR 0027 bước (c) — khối định vị trên mọi lời mời cổng. Hai hạt giống chạm ngưỡng chờ cửa sổ
  sau: sổ known-limits thiếu hàng (P179, lặp lần thứ ba qua hai cửa sổ) và thước ký → gộp mù khi có commit sau chữ ký
  (`docs/plans/2026-10-25-hat-giong-do-gop-mu-khi-co-commit-sau-ky.md`).
