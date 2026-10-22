---
schema_version: 1
feature: Răng T1-escape chỉ nhận hồ sơ cổng chấm được — tệp ở gốc `_acceptance/` (config.yaml, README.md), thư mục không có contract.md và hồ sơ nằm ngoài `_acceptance/` của cổng thôi được tính là «PR có kèm hồ sơ»
slug: t1-escape-chi-ho-so
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm scripts/pre-merge-check.sh — trong risk_tiers.t3_paths
surfaces: [cli]
status: draft
design_doc: docs/superpowers/specs/2026-10-22-t1-escape-chi-ho-so-design.md
approved_by:
approved_at:
---

# Acceptance Contract: t1-escape-chi-ho-so

## Context

Ca thật ở kho tiêu thụ onehub-invest (22/10/2026, bản chép CI 2.32.0): nhánh sửa `app/src/**` kèm một dòng
`_acceptance/config.yaml` → `pre-merge-check.sh . --base main` in «clean»; cùng nhánh trước commit sửa config → «1
violation — merge blocked». Chủ kit yêu cầu vá ở kit; phiên ở onehub-invest sẽ chép lại lớp CI sau khi kit ra bản vá.

Gốc lỗi: khối «Phân loại diff-chịu-cổng» của `scripts/pre-merge-check.sh` (dòng 813, `main` 2.33.1) bật
`DIFF_GATE_TOUCHED` cho MỌI tệp khớp `_acceptance/*|*/_acceptance/*`. Tái hiện trên 2.33.1 bằng kho mẫu: tệp T3 kèm
`config.yaml`, kèm `README.md` ở gốc, kèm thư mục slug không có `contract.md`, kèm hồ sơ chỉ có `opportunity.md`, và
monorepo `pkg/_acceptance/config.yaml` — đều «clean». Đối chứng: chỉ tệp T3 → VIOLATION [PR].

Nghiệm (design doc): «tệp hồ sơ» = tệp dưới `_acceptance/<slug>/` của CHÍNH cổng (`<ROOT>/_acceptance/`, tính từ gốc git — đúng thư mục vòng per-slug duyệt) mà `<slug>/contract.md` có ở HEAD.
`--hang-pr` giữ nguyên câu trả lời qua cờ riêng `DIFF_ACC_TOUCHED`, tính trong CÙNG vòng phân loại. Ba câu cho người ở
Cổng Phạm vi, hợp đồng soạn theo khuyến nghị: Hỏi-1 tệp gốc thôi tính là hồ sơ (yêu cầu của chủ kit — giá đo được ở
`do-anh-huong.md`: 22 commit nhánh chính ở 7 kho từ 01/06, lẫn PR bảo trì lớp kit và PR tính năng thật) · Hỏi-2 chỉ hồ sơ cổng chấm được
mới tính (9 commit: 3 thư mục không hợp đồng, 4 chỉ có `opportunity.md`, 2 hồ sơ fixture ngoài `_acceptance/` của cổng) · Hỏi-3 tệp gốc tự thân KHÔNG chịu cổng.

## Criteria

Ma trận dùng chung cho AC-1, AC-2, AC-4, AC-5, AC-6 — VIẾT TRƯỚC, hằng trong tệp ca. Kho git mẫu dựng trong lần chạy:
`t3_paths: src/billing/**`, `t1_skip_globs: docs/**`; hàng `long-*` đặt `_acceptance/` dưới `pkg/`, glob tính từ gốc git.
Mười ba hàng phía `_acceptance/`:

| # | Hàng | PR đổi gì dưới `_acceptance/` | Răng nổ? |
|---|---|---|---|
| 1 | khong | không gì | có |
| 2 | config | sửa `_acceptance/config.yaml` | có |
| 3 | readme | thêm `_acceptance/README.md` | có |
| 4 | slug-khong-hop-dong | thêm `_acceptance/rong/notes.md` | có |
| 5 | chi-co-hoi | thêm `_acceptance/co-hoi/opportunity.md` | có |
| 6 | ho-so-xoa | xoá `_acceptance/cu/` (có `contract.md` ở gốc nhánh) | có |
| 7 | long-config | sửa `pkg/_acceptance/config.yaml` | có |
| 8 | ho-so-that | thêm `_acceptance/f/contract.md` | không |
| 9 | long-ho-so | thêm `pkg/_acceptance/f/contract.md` | không |
| 10 | ho-so-co-san | sửa `_acceptance/f/evals.yaml` (`contract.md` có từ gốc nhánh, không trong diff) | không |
| 11 | long-ho-so-co-san | sửa `pkg/_acceptance/f/evals.yaml` (như hàng 10, lồng) | không |
| 12 | ho-so-va-config | thêm `_acceptance/f/contract.md` + sửa `_acceptance/config.yaml` | không |
| 13 | fixture-ho-so | thêm `tests/fx/_acceptance/f/contract.md` (hồ sơ nằm ngoài `_acceptance/` của cổng) | có |

Ba cột phía vật: t3 (`src/billing/c.js`) · ngoai-t1 (`src/app.js`) · t1 (`docs/x.md`). Cột t1: răng không nổ ở mọi hàng.
Hàng 4–6 và 13 theo khuyến nghị của Hỏi-2; người chọn khác thì các hàng ấy đổi kỳ vọng trước S3.

- AC-1: Given ma trận 13 hàng × 3 cột = 39 ô, When `pre-merge-check.sh <kho> --base <gốc nhánh>` chạy từng ô, Then ô
  «răng nổ» có đúng câu VIOLATION [PR] cũ của cột (cột t3: câu T3 · cột ngoai-t1: câu non-T1, nguyên văn) và mã thoát
  1; ô «không nổ» không có dòng `VIOLATION [PR]`. Số khẳng định = 39 (hằng khai trước).
- AC-2: Given 39 ô của AC-1 và tập tệp NOTE mong đợi khai trước cho từng ô, When đọc đầu ra, Then dòng `NOTE [PR]:`
  (câu đầu ghim nguyên văn) có mặt ĐÚNG ở 14 ô — hàng 2–7 và 13 × cột t3, ngoai-t1 — ngay sau danh sách tệp chịu cổng, và tập
  tệp liệt kê dưới nó BẰNG tập khai trước của ô (so tập, không includes; vd hàng 6 → `{_acceptance/cu/contract.md}`,
  hàng 7 → `{pkg/_acceptance/config.yaml}`, hàng 13 → `{tests/fx/_acceptance/f/contract.md}`); 25 ô còn lại không có dòng ấy — kể cả hàng 12 cột t3 (diff có tệp bị loại
  mà răng không nổ). Số khẳng định = 39.
- AC-3: Given kho mẫu, When chạy `pre-merge-check.sh --hang-pr` trên bốn PR {chỉ `_acceptance/config.yaml` (khoá ngoài
  danh sách hạng) + `docs/a.md` · chỉ `_acceptance/README.md` · chỉ `_acceptance/rong/notes.md` · `_acceptance/config.yaml`
  + tệp t3}, Then (`hang`, `cham_vat`) lần lượt là (`ho-so`, `false`) · (`ho-so`, `false`) · (`ho-so`, `false`) ·
  (`T3`, `true`) — câu trả lời của `--hang-pr` không đổi. And ca `AC-3-im` của `tests/scripts/hang-pr.test.mjs` PASS.
- AC-4: Given bản sao TRỌN `scripts/` + `lib/` của cây đang đo với dòng phân loại hoàn nguyên về khớp cũ (mọi tệp dưới
  `_acceptance/` bật `DIFF_GATE_TOUCHED`), When chạy ma trận AC-1 trên bản sao, Then tập ô sai kỳ vọng BẰNG đúng 14 ô
  viết trước — hàng 2–7 và 13 × {t3, ngoai-t1}. Đối chứng dương trước tiên: bản sao nguyên vẹn, cùng kho → 39/39 đúng. Kim
  khớp ≠ 1 lần → ca đỏ với thông điệp hạ tầng riêng.
- AC-5: Given bản sao như AC-4, When chạy ma trận trên ba đột biến — (a) gỡ vế «`contract.md` có ở HEAD», giữ vế thư
  mục slug; (b) chỉ tính tệp `<slug>/contract.md` CÓ TRONG DIFF và còn ở HEAD; (c) lấy tiền tố `_acceptance/` từ chính đường tệp thay
  vì từ ROOT của cổng — Then tập ô sai BẰNG đúng danh sách viết trước: (a) hàng 4–6 × {t3, ngoai-t1} = 6 ô; (b) hàng
  10–11 × {t3, ngoai-t1} = 4 ô; (c) hàng 13 × {t3, ngoai-t1} = 2 ô.
- AC-6: Given lịch sử nhánh, When tìm commit ĐẦU TIÊN mang `tests/scripts/t1-escape-ho-so.test.mjs` và commit đầu tiên
  của nhánh đổi `scripts/pre-merge-check.sh`, Then commit tệp ca là tổ tiên của commit vá; và chạy AC-1 của tệp ca ở sha
  đó trên `scripts/` + `lib/` của CHÍNH sha đó cho ra ĐỎ với tập ô sai bằng đúng 14 ô của AC-4, không ghim hạ tầng nào.
  Đối chứng dương: archive HEAD cùng ca → xanh.
- AC-7: Given cây sau sửa, When chạy mọi lệnh của `feature_loop.suite_keys` (bốn mảnh scripts, hooks, ba vùng plugins,
  workflows, product-map, kiem_ban_cai_moc), Then mọi lệnh thoát 0 — gồm B01–B06, ARM08/ARM08b (hai câu VIOLATION [PR]
  nguyên văn), TE17 (`t1escape-messages.txt` sinh lại khớp từng byte) và GPM13.
- AC-8 (judgment): Given mục `## Chưa phát hành` của `CHANGELOG.md`, design doc và `do-anh-huong.md`, When đọc mục con
  của hồ sơ này, Then nó nói được (i) đổi gì; (ii) năm lớp PR nay bị chặn mà trước qua — tệp gốc `_acceptance/` (kể cả
  lồng), thư mục không hợp đồng, hồ sơ chỉ có `opportunity.md`, PR xoá hồ sơ, hồ sơ nằm ngoài `_acceptance/` của cổng
  (fixture) — kèm số đo; (iii) PR chép lại lớp CI ở
  kho tiêu thụ từ nay cũng phải kèm hồ sơ, kể cả PR mang chính bản vá; (iv) kho làm gì khi nhận — chép lại
  `scripts/pre-merge-check.sh`; và (v) không hứa điều design doc không làm (tệp gốc không chịu cổng; hai lỗ của hạt
  giống vẫn mở).

## Coverage

| Trục | Giá trị | AC |
|---|---|---|
| A. Tệp phía `_acceptance/` trong diff | không có · tệp gốc (config, README) · tệp gốc lồng · thư mục không hợp đồng · chỉ ô cơ hội · hồ sơ bị xoá · hồ sơ thật thêm mới · lồng · hồ sơ có sẵn sửa tệp khác `contract.md` · lồng · hồ sơ thật kèm tệp gốc · hồ sơ fixture ngoài `_acceptance/` của cổng | AC-1, AC-2 |
| B. Tệp phía vật | T3 · ngoài T1 · T1 | AC-1 |
| C. Bên đọc phân loại | răng T1-escape · `--hang-pr` | AC-1, AC-3 |
| D. Đầu ra | câu VIOLATION cũ · dòng NOTE mới · nhãn `hang` | AC-1, AC-2, AC-3, AC-7 |
| E. Chiều đỏ | đột biến hoàn nguyên · gỡ vế hợp đồng · chỉ đếm hợp đồng trong diff · tiền tố lấy từ đường tệp · lịch sử TDD | AC-4, AC-5, AC-6 |
| F. Điều kiện git (trục «môi trường» của preset test-matrix) | có `--base` · không `--base`/không dựng được diff (B04, không đổi) · `--no-t1-escape` (TE, không đổi) | AC-1, AC-7 |

Quét bằng skill `morphological-scan`, preset test-matrix; trục preset (surface · role · dữ liệu · mạng) không khớp một
lệnh CLI nên dựng lại theo B1 — trục A×B là tích Descartes ĐẦY ĐỦ, không pairwise, vì đây là răng an toàn (luật
preset: full matrix cho luồng pháp lý). Core: trục A×B (AC-1, 39 ô) · đầu ra (AC-2, AC-3) · chiều đỏ (AC-4–AC-6). Later:
slug tên không ASCII (`core.quotePath` bọc nháy → không khớp, rơi về «không phải hồ sơ», tức CHẶT hơn — cùng dáng ca
`ten-co-khoang` của hang-pr) · đổi tên tệp giữa gốc và thư mục hồ sơ (`--name-only` chỉ in tên mới). Never: đường dẫn
kiểu Windows — cổng chạy bash trên đường git.

Thước CE: danh sách bên đọc rút bằng `grep` trên cây (`_acceptance/\*`, `t1_skip_globs`, `T1-escape`) [SUY-TỪ-REPO:
scripts/pre-merge-check.sh, lib/, feature-loop/scripts/]; bốn dáng lọt đo bằng kho mẫu trên 2.33.1 và ca thật
onehub-invest 22/10 [SUY-TỪ-REPO: onehub-invest b7c89f1]; lịch sử lỗi cùng lớp — ghi chú «glob chưa neo» của
`slug_in_diff`, ca `ten-co-khoang` [SUY-TỪ-REPO: scripts/pre-merge-check.sh, tests/scripts/hang-pr.test.mjs].

## Out of scope

- Coi tệp gốc `_acceptance/` (config.yaml, README.md) là tệp chịu cổng — Hỏi-3 ở Cổng Phạm vi; hợp đồng soạn theo khuyến
  nghị «giữ không chịu cổng».
- Lối riêng cho PR bảo trì lớp kit ở kho tiêu thụ (khởi tạo, chép lại lớp CI) — từ bản vá chúng cần hồ sơ như mọi PR
  chạm `scripts/`, `lib/`; nêu ở CHANGELOG (AC-8), không dựng lối miễn ở vòng này.
- Hồ sơ tự khai `risk_tier: T1` thoả răng cho code T3 — lớp tự-khai-hạng; hạt giống
  `docs/plans/2026-10-22-hat-giong-t1-escape-hang-tu-khai.md` mục 1.
- PR tự nới `t1_skip_globs` để tệp của chính nó thành T1 ở chế độ thường — cùng hạt giống, mục 2.
- `stale_files()` vẫn loại mọi tệp `_acceptance/` khỏi phép bằng-chứng-cũ — câu hỏi khác, không đổi.
- Cắt số phát hành (bump manifest) — đi hồ sơ mốc riêng theo nếp kit; hồ sơ này chỉ ghi `## Chưa phát hành`.
- Sửa lớp chép CI ở onehub-invest — việc của phiên bên đó sau khi kit phát hành.

## Notes

- Hạng T3: thêm Gate 1.5 duyệt kế hoạch.
- Hai câu VIOLATION [PR] giữ nguyên văn; dòng NOTE là dòng mới, chỉ thêm.
