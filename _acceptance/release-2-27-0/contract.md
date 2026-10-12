---
schema_version: 1
feature: Phát hành kit 2.27.0 — «đóng gói xong» Điều phối – Thợ, gộp một lần hai mốc lộ trình 18/10 (DP1, A1, R1) và 25/10 (DP2, DP3, DP4, DP7, lõi DP6, A3) cùng các hàng đã gộp sớm (G2, G3, X2, S3, L3, C1, S3b), để crm chuyển sang gói dieu-phoi ở đợt thử ~26/10 và OneFlow cài gói ở đợt thử ~27/10; gói dieu-phoi lần đầu có số mà thẻ chứa gói; làn V, không dựng răng
slug: release-2-27-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 3 manifest + mô tả marketplace + dòng khớp-phiên-bản của GUIDE + CHANGELOG + README gói dieu-phoi + workspace hồ sơ + bản đồ + 2 khoá executor — KHÔNG dính t3_paths, KHÔNG đổi một dòng mã cổng
surfaces: [cli]
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-12T04:35:29Z
---

# Acceptance Contract: release-2-27-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm` và `OneFlow`. Chủ kho mở chip cắt mốc 12/10 («đóng gói xong»
Điều phối – Thợ) theo làn V như tiền lệ 2.5.0 → 2.26.0. Neo ở kho tiêu thụ: mốc ngoài «crm: đợt thử thứ nhất —
chuyển sang gói dieu-phoi bản mốc 25/10 (gỡ scripts/dieu-phoi/, bốn khối hook, theo danh mục xem --kiem-chuyen)»
(26/10) và «OneFlow: đợt thử thứ hai trên gói bản mốc 25/10» (27/10) của `docs/plans/lo-trinh-kit.json`; gốc của
cả nhóm DP là `crm/_acceptance/dieu-phoi-hai-tang`.

**Vì sao cắt bây giờ:** `dieu-phoi/.claude-plugin/plugin.json` ghi `2.26.0` từ #295, mà thẻ `v2.26.0` (`200ce7bb`)
không chứa gói. Bộ đệm gói khoá theo SỐ phiên bản, nên kho cài gói từ `main` báo «already at latest» với mọi bản
cùng số — đợt thử không thể nhận bản sửa nào của gói tới khi có số mới.

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ (mười chín):

- Gói `dieu-phoi`: `dieu-phoi-dong-goi-loi` (DP1, #295) · `dieu-phoi-mo-dot-mot-lenh` (DP2, #298) ·
  `dieu-phoi-tiep-tuc-mot-lenh` (DP3, #303) · `dieu-phoi-doi-tai-khoan` (DP4, #312) · `dieu-phoi-lop-mod` (lõi DP6,
  #315) · `dieu-phoi-feature-loop-trong-dot` (DP7, #306) · `dieu-phoi-sua-truoc-dot-thu` (#317).
- Bớt gọi người và phút CI: `ngoai-n-tu-dinh-tuyen` (A3, #322) · `ci-cua-kho-bo-job-nang` (C1, T3, #323).
- Bộ đọc khoan dung: `evals-sat-le-doc-du` (R1, T3, #299) · `glob-thoat-ngoac` (T3, #292).
- Làn ghim lại: `eval-goi-model-that-khong-chay` (G3, #316) · `ten-ca-qua-tien-to-turbo` (G2, #313) ·
  `xa-stdout-truoc-khi-thoat` (#311) · `baseline-tran-bo-qua-don` (#280).
- Lộ trình và hồ sơ: `trang-ho-so-mot-viec` (X2, #307) · `vong-la-mot-ket-qua` (S3, #304) ·
  `lo-trinh-chi-viec-phat-trien` (S3b, #321) · `cua-tin-hieu-gom-nhom` (L3, #319).

Vòng **máy thông** trong cửa sổ, kể riêng vì `rel-cua-so.sh` chỉ rút hồ sơ `signed-off`:
`tac-tu-cham-chi-cham-khong` (A1, #294, `machine-cleared`, cửa veto mở).

Số là **2.27.0, không 2.26.1**: một gói có số riêng (`dieu-phoi`), ba loại tác tử chấm mới của `feature-loop`, một
khoá cấu hình mới (`feature_loop.model_carry_cmd`) và khối dữ liệu lộ trình bản 2 — năng lực mới cho kho tiêu thụ.
Mốc **không đổi một dòng mã cổng** — chỉ đóng số, nói người dùng nhận gì (mục `v2.27.0` trong mô tả hai gói,
mục `2.27.0` của `CHANGELOG.md`), khai giới hạn đã biết của gói và bước chuyển ở `dieu-phoi/README.md`, đi **làn
V**. Năm dòng số, bảng dự báo, điều kiện tin cậy, dòng hiệu chuẩn và ghi chú nhận mốc cho crm và OneFlow nằm ở
mục `2.27.0` của `CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

Source input: `git log v2.26.0..HEAD` · nếp phát hành `_acceptance/release-2-26-0/` · mục Notes và Known limits của
mười bảy hồ sơ · `docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md` (mù hộp quyền, «S4 tự xưng»).

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (nơi ca vĩnh viễn P200 sống), Then lệnh thoát 0 — P200 đọc số từ bốn manifest và đòi `acceptance-gate`, `feature-loop`, `dieu-phoi` mang CÙNG một số hợp semver, `diagram-design` hợp semver; P200 đỏ thì vùng 3 thoát khác 0.
- AC-2: Given cây đã sửa, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 dựng câu «Khớp phiên bản» của GUIDE từ bốn số đọc trong manifest rồi so (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, ba vùng plugins, hooks, workflows), Then cả chín lệnh XANH và `product-map --check` khớp (mười khoá của `feature_loop.suite_keys`).
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 200ce7bb …`, mốc = commit gắn tag `v2.26.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `200ce7bb` (tag `v2.26.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 đòi mô tả `acceptance-gate` CÓ mục của đúng số đang phát hành và mục đó của `feature-loop` TỰ khai cặp `acceptance-gate >= <số>`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff.
- AC-7: Given cây đã sửa, When chạy suite của gói `dieu-phoi` (`tests/dieu-phoi/**/*.test.mjs`, cùng lệnh job CI của kit), Then lệnh thoát 0 — gồm ca DP1-06 (README và `LUAT.md` mẫu của gói không trỏ bản lõi chép tay) và ca tài liệu SDT-08 trên README đã sửa.
- AC-8: Given README gói `dieu-phoi`, mục `2.27.0` của `CHANGELOG.md`, `dieu-phoi/hooks/hooks.json`, `kiemChuyen` trong `dieu-phoi/scripts/dieu-phoi.mjs`, khuôn `dieu-phoi/scripts/mau/LUAT.md` và `card-plain.json` của hồ sơ này, When đọc, Then (i) số khối hook README nêu bằng số khối trong `hooks.json` (năm, kèm một mod); (ii) README nêu luật «thợ chờ người thì ghi `can-nguoi`» theo NỘI DUNG và nơi khai (phần riêng của đợt), không bằng số luật của một kho — khuôn `LUAT.md` của gói không mang luật ấy; (iii) điểm dừng của bước chuyển ở README và ở ghi chú crm đạt được trên kho có lịch sử: không đòi `kiem-chuyen: sach`, tách dòng thuộc nhóm đang chạy (settings, hook git, `package.json`, eval hồ sơ đang mở, `LUAT.md` của đợt) khỏi bản ghi lịch sử phải để nguyên — khớp việc `kiemChuyen` quét mọi tệp git theo dõi; (iv) `card-plain.json` không hứa tác tử chấm không thể ghi vào cây — nói đúng: không cầm công cụ sửa tệp, ghi qua shell được máy ghi tên sau lượt. Bốn vế là Ngoài-1…4 của lượt chấm 1, nâng vào phạm vi theo quyết Điều phối M5 (làn V, cửa kéo lại mở).

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-26-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi) `[thước CE: hai mươi mốt mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; gói thứ tư mới có số riêng → AC-7 (suite của gói, lệnh đã có ở CI); lời của mốc khớp vật (bốn mục lượt 1 tìm ra) → AC-8 (judgment, đọc vật và chữ cạnh nhau); không răng mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc (cùng căn cứ với release-2-3-0 → 2-26-0). Ngưỡng của các vòng và hai ngưỡng của gói («S4 tự xưng», «mù hộp quyền») đọc ở sổ chạy của đợt thử crm và OneFlow sau khi hai kho nhận mốc.

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/ feature-loop/workflows/ dieu-phoi/scripts/ dieu-phoi/hooks/`) — mốc phát hành KHÔNG dựng răng (GUIDE §7.1).
- Đưa dòng P200 vào bằng chứng của lượt chấm — cùng căn cứ release-2-26-0: workflow lượt chấm cắt đầu ra lệnh xanh; AC-1/AC-2/AC-6 chấm MÃ THOÁT của vùng 3, P200 tự mang chiều đỏ (sáu đột biến + đối chứng dương).
- Sửa lộ trình kit `docs/plans/lo-trinh-kit.json` (hai mốc 18/10 và 25/10 gộp thành mốc 2.27.0 đã phát hành) — PR riêng sau khi mốc gộp và có tag.
- Đưa crm và OneFlow nhận 2.27.0 (cài gói, gỡ bản lõi chép tay, chép lớp CI, đo trước→sau) — việc của phiên ở từng kho trong đợt thử; phiên kit không cài vào kho tiêu thụ.
- Sửa Known limits của mười bảy vòng trong cửa sổ; đo «mù hộp quyền» và dựng «S4 tự xưng» — hai việc sống ở hạt giống `docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md`, mở khi chạm ngưỡng.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths` (vật T3 của cửa sổ — `lib/evidence-core.cjs` của `evals-sat-le-doc-du` và `glob-thoat-ngoac` — đã qua vòng T3 của chính nó, #299 và #292).
- Luật (b): mốc này là mốc KHO NHẬN kế tiếp — crm và OneFlow nhận ở hai đợt thử 26–27/10; vòng meta của cửa sổ: 0.
- Lộ trình: A3, C1 và L3 chưa có trên `main` lúc mở hồ sơ; Điều phối M5 giữ mốc chờ cả ba (12/10) để crm nhận một lần và chiến dịch ghim lại chạy một lần. Ba vòng gộp main (#319, #322, #323 — main `f59d9547`), hồ sơ gộp main một lần trước lượt chấm 1 và kể thêm ở Context, AC-4, CHANGELOG.
- Giới hạn đã khai của gói `dieu-phoi`, đo lại 12/10 trên bộ phân loại của cây này: `--help` trong chú thích `#`, here-string `<<<`, `env -S'…'` dính cờ, `bash -o pipefail -c` → lệnh S4 lọt (`null`); heredoc kèm chuyển hướng → bị chặn (`s4`) — dạng này đã đóng khi DP6 thu luật «thân là dữ liệu» (sổ `dieu-phoi-lop-mod` d-20261011T061923Z-20), README không khai nó là đang lọt.
- `rel-cua-so.sh` đếm thừa sau khi L3 gộp: pathspec `_acceptance/*/contract.md` để `*` của git vượt `/`, nên bốn hồ
  sơ MẪU lồng ở `_acceptance/cua-tin-hieu-gom-nhom/mau/ho-so/` (bộ vàng của L3, frontmatter `status: signed-off`) bị
  rút thành «được ký». Khoá `rel2270_cua_so` chạy script với `GIT_GLOB_PATHSPECS=1` (`*` dừng ở một tầng) — không
  sửa `scripts/` trong PR mốc. Đo 12/10: không biến → ĐỎ nêu đúng bốn tên mẫu; có biến → XANH, chiều đỏ với tập «x»
  vẫn gọi tên. Chỗ cắt cho cửa sổ kế (không mở ô): script tự dùng `:(glob)` thì mọi mốc sau khỏi nhớ biến này.
- Phạm vi nâng sau lượt chấm 1 (12/10): bốn mục ngoài hợp đồng là chữ sai trong chính diff mốc → AC-8. Điều phối M5
  quyết theo làn V (câu chỉ một lối ra sống: ship hướng dẫn đã biết làm crm kẹt ở đợt thử là trái mục tiêu mốc), cửa
  kéo lại mở; không thêm lượt gọi chủ kho. Lượt chấm 2 bị dừng giữa chừng để sửa — không phán quyết (dòng
  `luot-dung` trong run-log). Hai mục còn lại (E1/E6 không chứng số đã tăng; E4 so danh sách chép trong config) ghi
  Known limits ở chữ ký.
- Chiều đỏ của hai phép đo cửa sổ đo khi mở hồ sơ: `rel-cua-so.sh 200ce7bb x` thoát 1 gọi tên mọi hồ sơ thiếu và «x» thừa; lệnh giữ-số của `diagram-design` với mốc `1b98fdb1` thoát 1 (`2.7.0` ≠ `2.7.1`).
