---
schema_version: 1
feature: Phát hành kit 2.32.0 — đóng số cho cửa sổ 2.31.0 → 2.32.0 (gói road-map hoàn tất theo B′ · lượt chấm lại không tự dối), để crm nhận một lần sau 2.31; làn V, không dựng răng
slug: release-2-32-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 4 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + bản đồ + 4 khoá executor — KHÔNG dính t3_paths
surfaces: [cli]
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-17T00:47:01Z
---

# Acceptance Contract: release-2-32-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm`. Neo ở kho tiêu thụ: crm issue `phanlemanh/crm-onehub#375` — máy Mac
Studio nhận 2.31.0 ở đợt trước; 2.32.0 là đợt nhận kế. Điểm dừng do chủ kho chốt 17/10: «chọn điểm dừng để đóng mốc và
lộ trình, rồi dọn trước khi mở mốc mới» — phía kit là bản này. Mốc lộ trình tương ứng trong `docs/plans/lo-trinh-kit.json`:
«Gói road-map hoàn tất theo B′ …» (19/10, máy MacBook Pro) chở mười hàng RM2 · RM4 · RM5 · RM3 · RM6 · RM3b · RM6b ·
RM6c · VA1 (VA1 tự thêm vào mốc ở #370; chủ kho nới luật (b) cho cửa sổ này 16/10 — đi cùng bản phát hành gói
road-map, không phải tiền lệ). Gốc của gói: `crm/_acceptance/tin-hieu-tu-ve-kho/` + ADR 0025 (lộ trình thành ràng buộc
theo bậc thang), hướng B′ (`docs/findings/2026-10-14-kien-truc-roadmap-plugin.md`). Gốc VA1:
`crm-onehub/_acceptance/goi-y-mo-ke-hoach/` (DA3b lượt 3, crm-onehub#375 16/10).

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ (tám):

- Lộ trình — vòng ngoài: `ap-chinh-sach-lo-trinh` (RM2, #359) · `kho-cam-ket-co-lo-trinh` (RM5, #367).
- Lộ trình — kho mới: `kho-moi-cai-goi-road-map` (RM4, #362).
- Lộ trình — giờ máy và ngày dự kiến: `lo-trinh-gio-may` (RM6, #363) · `lo-trinh-du-lieu-ngay-du-kien` (RM6c, #368).
- Cửa tín hiệu: `cua-tin-hieu-giua-chien-dich` (RM3, #366) · `cua-tin-hieu-goc-moi-worktree` (RM3b, #371).
- Chấm lại: `cham-lai-khong-tu-doi` (VA1, #370).

Vòng **máy thông** trong cửa sổ, kể riêng vì `rel-cua-so.sh` chỉ rút hồ sơ `signed-off`:
`du-bao-dong-bang-theo-ma-moc` (RM6b, #364, `machine-cleared`, cửa veto mở).

Số là **2.32.0** (minor): mốc thêm bề mặt mới cho kho tiêu thụ — bốn lệnh mới của gói `road-map`, khoá cấu hình mới
`lo_trinh.chan` (luật chặn hồ sơ ngoài lộ trình ở lưới trước-gộp), bước 5d của `acceptance-init`, hai tệp mới trong lớp
chép CI (`scripts/gio-may.mjs`, `lib/chan-lo-trinh.cjs`), khối giờ máy và ngày dự kiến trên trang lộ trình. GUIDE:
«minor cho luật gate mới». Mốc đi **làn V**. Năm dòng số, bảng dự báo, điều kiện tin cậy, dòng hiệu chuẩn và ghi chú
nhận mốc cho crm nằm ở mục `2.32.0` của `CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

Source input: `git log v2.31.0..HEAD` · nếp phát hành `_acceptance/release-2-31-0/` · mục Notes và Known limits của chín
hồ sơ · crm#375 · kit #308.

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (nơi ca vĩnh viễn P200 sống), Then lệnh thoát 0 — P200 đọc số từ năm manifest và đòi `acceptance-gate`, `feature-loop`, `dieu-phoi`, `road-map` mang CÙNG một số hợp semver, `diagram-design` hợp semver; P200 đỏ thì vùng 3 thoát khác 0.
- AC-2: Given cây đã sửa, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 dựng câu «Khớp phiên bản» của GUIDE từ các số đọc trong manifest rồi so (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows), Then cả chín lệnh XANH và `product-map --check` khớp (cùng khoá `kiem_ban_cai_moc` của AC-10: mười một khoá của `feature_loop.suite_keys`).
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh f0634454 …`, mốc = commit gắn tag `v2.31.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `f0634454` (tag `v2.31.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 đòi mô tả `acceptance-gate` CÓ mục của đúng số đang phát hành và mục đó của `feature-loop` TỰ khai cặp `acceptance-gate >= <số>`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff.
- AC-7: Given mốc `f0634454`, When liệt tệp đổi dưới `dieu-phoi/` và `road-map/` tới HEAD bằng git, Then tập tệp đổi BẰNG đúng mười ba tệp CHANGELOG mục `2.32.0` kể cho hai gói (hai manifest + năm tệp `dieu-phoi/scripts/` + sáu tệp `road-map/`).
- AC-8: Given khối INIT-CI-COPY-LIST của `acceptance-init`, gạch «Lớp chép CI» của mục `2.32.0` trong CHANGELOG và mốc `f0634454`, When rút danh sách chép, rút danh sách ghi chú kể, rồi so tệp nào đổi byte tới HEAD, Then tập tệp đổi BẰNG tập ghi chú kể — danh sách mong đợi đọc TỪ ghi chú (tệp lệnh của `release-2-29-0`, dùng lại; tệp mới của danh sách chép tính là đổi).
- AC-9: Given mục `2.32.0` của `CHANGELOG.md` cùng vật nó mô tả, When đọc ghi chú nhận cho crm, Then (i) mục «crm, theo thứ tự» nói crm nhận SAU 2.31.0 và cài theo ĐÚNG thẻ `v2.32.0`; (ii) lời về lớp chép CI — hai tệp mới phải chép CÙNG LÚC với `scripts/lo-trinh.mjs` (nó nạp `scripts/gio-may.mjs` ngay lúc nạp) và `lib/chan-lo-trinh.cjs` chỉ cần khi kho bật `lo_trinh.chan` — khớp nhãn trong `commands/acceptance-init.md` và mã nạp của `scripts/lo-trinh.mjs`, `scripts/pre-merge-check.sh`; (iii) lời về bốn lệnh mới của gói `road-map` khớp `road-map/README.md` và `road-map/commands/*.md`; (iv) lời về khoá `lo_trinh.chan` và đường đọc-cũ (kho không khai khoá thì không đổi gì) khớp `lib/chan-lo-trinh.cjs` và hợp đồng `kho-cam-ket-co-lo-trinh`.
- AC-10: Given số trong `.claude-plugin/plugin.json` ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc` (cổng số phiên bản của `kiem-ban-cai-sau-phat-hanh`), Then lệnh chạy TRỌN kiểm bản cài trên HEAD và thoát 0 với «TỔNG KẾT: ĐẠT 8/8 — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-31-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi | lớp chép CI | bản cài khớp thẻ) `[thước CE: hai mươi sáu mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; hai gói `dieu-phoi` và `road-map` đổi vật → AC-7; lớp chép CI khớp ghi chú → AC-8; ghi chú nhận cho crm khớp vật → AC-9 (judgment); bản cài khớp thẻ → AC-10 (khoá KC1).

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc (cùng căn cứ với release-2-3-0 → 2-31-0). Ngưỡng của các vòng đọc ở vòng crm đầu tiên sau khi Mac Studio cài 2.32.0 (mục crm của CHANGELOG 2.32.0).

## Out of scope

- Đổi dòng mã cổng — mốc phát hành KHÔNG dựng răng mới (GUIDE §7.1).
- Đưa dòng P200 vào bằng chứng của lượt chấm — AC-1/AC-2/AC-6 chấm MÃ THOÁT của vùng 3, P200 tự mang chiều đỏ.
- Sửa lộ trình kit `docs/plans/lo-trinh-kit.json` sau mốc (đổi mốc «Gói road-map hoàn tất theo B′» sang dạng đã phát hành, ghi tag + PR) — PR riêng sau khi mốc gộp và có tag, kèm dòng kiểm bản cài sau thẻ.
- Cài 2.32.0 vào crm, vẽ lại `LO-TRINH.html` của crm, chạy `kiem-ban-cai --may` ở đó — việc của máy Mac Studio.
- Sửa Known limits của chín vòng.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths` (`hooks/**`, `lib/**`, `pre-merge-check.sh`, `recheck-evidence.cjs`) — `lib/chan-lo-trinh.cjs`, `hooks/acceptance-evidence-gate.js` và `scripts/pre-merge-check.sh` đổi trong cửa sổ đã qua cổng của chính vòng ấy.
- Ghim lại ở mốc: mười hồ sơ xanh ở `repin-20261017T024130Z-65967` (54 phút, 25 lệnh, 0 chập chờn); làn trước `repin-20261017T014450Z-66877` đỏ đúng một ca PD7b (ghi chú gọi `road-map` là gói «nếu đã cài»), đã sửa chữ. `release-2-31-0` để cũ hoá theo cấu tạo.
- Luật (b): mốc này là mốc KHO NHẬN kế tiếp — crm nhận sau 2.31.0. Cửa sổ chở nhiều vòng meta hơn trần «một vòng meta giữa hai mốc kho nhận»: gói road-map là một kết quả do chủ kho gọi tên làm luôn 15/10 (bảy hàng, một mốc), VA1 là nới luật (b) chủ kho quyết 16/10 «đi cùng bản phát hành gói road-map, không phải tiền lệ».
- Known limits — chọn ở Cổng Bằng chứng 2026-10-17:
  - Ngoài-1: Phép kiểm tệp đổi của hai gói (E7) so với danh sách gõ tay trong khoá cấu hình, không đọc lời kể của ghi chú phát hành — sửa một nơi mà quên nơi kia thì E7 vẫn báo xanh.
  - Ngoài-2: Phép kiểm tập hồ sơ được ký (E4) so với danh sách tên gõ tay trong khoá cấu hình, không đọc phần Context của hợp đồng — sửa một nơi mà quên nơi kia thì E4 vẫn báo xanh.
