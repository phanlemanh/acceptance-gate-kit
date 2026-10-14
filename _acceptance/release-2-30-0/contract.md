---
schema_version: 1
feature: Phát hành kit 2.30.0 — đóng số cho cửa sổ 2.29.0 → 2.30.0 (khoá do dãy giữ tính nhịp khoá · bộ đọc hồ sơ khoan dung · định tuyến mục Ngoài-n theo mã mục), để crm nhận thẳng từ bản đang cài; làn V, không dựng răng
slug: release-2-30-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 3 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + bản đồ + 3 khoá executor — KHÔNG dính t3_paths
surfaces: [cli]
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-14T00:01:21Z
---

# Acceptance Contract: release-2-30-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm`. Neo ở kho tiêu thụ: crm issue `phanlemanh/crm-onehub#375` — máy Mac
Studio chờ bản này (hạn mềm 12:00 giờ VN 14/10) và nhận THẲNG từ bản đang cài, bỏ qua 2.29.0. Ba vòng của cửa sổ đều
có gốc ở crm#375: DP10 (bộ phát lịch báo nhầm «khoa-khong-nhip» trong đợt `r2`, 13/10), #344 (năm hồ sơ crm có
`evals.yaml` không phải YAML chuẩn; chữ ký ngày/tháng/năm của `nen-chat-ai-elements`), DP11 (P5 đo ở crm
`them-buoc-bao-dung`: lượt chấm chèn mục mới lên đầu, tám dòng sổ ký theo số trỏ nhầm mục).

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ (bốn):

- Gói `dieu-phoi`: `dieu-phoi-khoa-day-giu-nhip` (DP10, T2, #342 — máy M5).
- Bộ đọc hồ sơ: `bo-doc-ho-so-khoan-dung` (R2, T2, #344 — máy MacBook Pro).
- Lõi định tuyến: `dinh-tuyen-theo-ma-muc` (DP11, T3, #345 — máy M5) · `tac-tu-cham-chi-cham-khong` (A1 của 2.27.0,
  máy-thông 10/10; chủ kho ký Cổng Bằng chứng trong PR #345 vì DP11 đổi định tuyến của nó — Hỏi-1 «chặt» ở Cổng
  Phạm vi DP11).

`#343` chỉ tài liệu (hạt giống kênh liên máy) — không vào ghi chú.

Số là **2.30.0, không 2.29.1** (lời đã báo crm là «2.29.1»; điều phối M5 đồng ý đổi 14/10 và báo lại crm#375): mốc
thêm bề mặt mới cho kho tiêu thụ — lệnh tuỳ chọn `scripts/yaml-chuan.cjs` và một loại cờ vàng mới trên thẻ hai cổng
(#344), khuôn dòng sổ người mới mang `tieu_de` + `tep` và một luật lưới chặt hơn — hồ sơ crm `zalo-qua-webhook` qua
lưới ở 2.29.0 sẽ bị chặn ở 2.30.0 (DP11). GUIDE: «minor cho luật gate mới»; tiền lệ 2.28.0 «dù chỉ sửa lỗi». Mốc đi
**làn V**. Năm dòng số, bảng dự báo, điều kiện tin cậy, dòng hiệu chuẩn và ghi chú nhận mốc cho crm nằm ở mục `2.30.0`
của `CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

Source input: `git log v2.29.0..HEAD` · nếp phát hành `_acceptance/release-2-29-0/` · mục Notes và Known limits của bốn
hồ sơ · crm#375 · kit #308.

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (nơi ca vĩnh viễn P200 sống), Then lệnh thoát 0 — P200 đọc số từ bốn manifest và đòi `acceptance-gate`, `feature-loop`, `dieu-phoi` mang CÙNG một số hợp semver, `diagram-design` hợp semver; P200 đỏ thì vùng 3 thoát khác 0.
- AC-2: Given cây đã sửa, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 dựng câu «Khớp phiên bản» của GUIDE từ bốn số đọc trong manifest rồi so (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows), Then cả chín lệnh XANH và `product-map --check` khớp (cùng khoá `kiem_ban_cai_moc` của AC-10: mười một khoá của `feature_loop.suite_keys`).
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 6a9c0f9a …`, mốc = commit gắn tag `v2.29.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `6a9c0f9a` (tag `v2.29.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 đòi mô tả `acceptance-gate` CÓ mục của đúng số đang phát hành và mục đó của `feature-loop` TỰ khai cặp `acceptance-gate >= <số>`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff.
- AC-7: Given cây đã sửa, When chạy suite của gói `dieu-phoi` (`tests/dieu-phoi/**/*.test.mjs`, cùng lệnh job CI của kit), Then lệnh thoát 0 — gói đổi vật trong mốc (DP10) và lên `2.30.0`.
- AC-8: Given khối INIT-CI-COPY-LIST của `acceptance-init`, gạch «Lớp chép CI» của mục `2.30.0` trong CHANGELOG và mốc `6a9c0f9a`, When rút danh sách chép, rút danh sách ghi chú kể, rồi so tệp nào đổi byte tới HEAD, Then tập tệp đổi BẰNG tập ghi chú kể — danh sách mong đợi đọc TỪ ghi chú (tệp lệnh của `release-2-29-0`, dùng lại).
- AC-9: Given mục `2.30.0` của `CHANGELOG.md` cùng vật nó mô tả, When đọc ghi chú nhận cho crm, Then (i) mục «crm, theo thứ tự» nói crm nhận THẲNG từ bản đang cài (bỏ qua 2.29.0) và giữ các bước 2.29.0 crm còn cần, cài theo ĐÚNG thẻ `v2.30.0`; (ii) lời «bốn tệp chép CÙNG LÚC» khớp mã — `khong-can-nguoi.mjs` nổ khi bên gọi thiếu `runLog`, lưới trước-gộp gọi `cumCu` của lib; (iii) lời về `zalo-qua-webhook` khớp bộ phân giải của `lib/out-of-contract.cjs` (dòng chỉ số ghi trước lượt chấm → chưa định tuyến) và khuôn dòng sổ `NGOAI-N-GATE2-LINE` của `commands/signoff.md`; (iv) cách dùng `scripts/yaml-chuan.cjs` (`--root`, `--base`, mã thoát) khớp đầu tệp.
- AC-10: Given số trong `.claude-plugin/plugin.json` ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc` (cổng số phiên bản của `kiem-ban-cai-sau-phat-hanh`), Then lệnh chạy TRỌN kiểm bản cài trên HEAD và thoát 0 với «TỔNG KẾT: ĐẠT 8/8 — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-29-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi | lớp chép CI | bản cài khớp thẻ) `[thước CE: hai mươi bốn mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; gói `dieu-phoi` đổi vật → AC-7; lớp chép CI khớp ghi chú → AC-8; ghi chú nhận cho crm khớp vật → AC-9 (judgment); bản cài khớp thẻ → AC-10 (khoá KC1).

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc (cùng căn cứ với release-2-3-0 → 2-29-0). Ngưỡng của các vòng đọc ở vòng crm đầu tiên sau khi Mac Studio cài 2.30.0 (mục crm của CHANGELOG 2.30.0).

## Out of scope

- Đổi dòng mã cổng — mốc phát hành KHÔNG dựng răng mới (GUIDE §7.1).
- Đưa dòng P200 vào bằng chứng của lượt chấm — AC-1/AC-2/AC-6 chấm MÃ THOÁT của vùng 3, P200 tự mang chiều đỏ.
- Sửa lộ trình kit `docs/plans/lo-trinh-kit.json` (thêm mốc «Phát hành 2.30.0» đã phát hành, sửa ghi chú còn nói «2.29.1») — PR riêng sau khi mốc gộp và có tag.
- Cài 2.30.0 vào crm, định tuyến lại `zalo-qua-webhook`, chạy `kiem-ban-cai --may` ở đó — việc của máy Mac Studio.
- Sửa Known limits của bốn vòng.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths` (`hooks/**`, `lib/**`, `pre-merge-check.sh`, `recheck-evidence.cjs`).
- Luật (b): mốc này là mốc KHO NHẬN kế tiếp — crm nhận thẳng; vòng meta của cửa sổ: không.
- Hạt giống đo ở PR mốc: `docs/plans/2026-10-14-hat-giong-ho-so-tom-tat-can-ca-khi-khai-tin-hieu.md` — thẻ chép của
  `ho-so-tom-tat.cjs` chỉ nói `lo_trinh` trong khi `tin-hieu.mjs`/`cat-luot.mjs` nạp nó; 0 kho trúng hôm nay.
