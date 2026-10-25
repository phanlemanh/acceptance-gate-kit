---
schema_version: 1
feature: Phát hành kit 2.34.0 — tầng tri thức theo LLM Wiki (TT1–TT5), ký → gộp có chủ máy (lịch biết tệp, PR sẵn sàng lúc trình thẻ, gộp không chạy lại CI, đo ký → gộp), sức khoẻ máy đo chỗ trống và tốc độ (SK1), ảnh có thật trong hồ sơ; gói mới tri-thuc
slug: release-2-34-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 5 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + lộ trình kit + bản đồ + một hạt giống + ghi chú nhận + khoá executor — KHÔNG dính t3_paths
surfaces: [cli]
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-25T03:31:42Z
---

# Acceptance Contract: release-2-34-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm` (đang ở 2.33.1) và `invest` (đang ở 2.9.0). Mốc lộ trình: «Phát hành
2.34.0» (trước đây «Phát hành kế (số đặt lúc cắt) — tầng tri thức TT1–TT5 cùng #400, #401, #402»).

**Quyết của chủ kho:** 24/10 «Tầng tri thức được gom và Kit để cắt cùng phiên bản.»; 25/10 các kho tiêu thụ phải nhận
được bản này trong ngày 25/10 (giờ Việt Nam). Cắt khi TT5 (`vong-don-le-tra-tri-thuc`) vào nhánh chính.

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ:
`suc-khoe-cho-trong-va-toc-do` (SK1, #395 → `144cfd0f`) · `anh-co-that-trong-ho-so` (#399 → `31af70d9`) · `ky-den-gop`
(#402 → `a88bc773`) · `kho-tri-thuc-va-lint` (TT1, #406 → `6a51d4c2`) · `o-mo-viec-mang-nguon` (TT3, #407 → `378e262c`) ·
`ghi-tri-thuc` (TT2, #408 → `3065fa57`) · `thiet-ke-nap-tri-thuc` (TT4, #409 → `396c08f8`) · `vong-don-le-tra-tri-thuc` (TT5, #411 → `fe3a597c`). Ngoài vòng:
#400 (North Star gộp-được) · #401 (làn đối chứng trong worktree cô lập) · #404, #405 (cắt đợt `tri-thuc-2410`, năm ô qua
Cổng Đáng) · #393 (dòng KC1 của 2.33.1) · #394, #397 (hạt giống).

Số là **2.34.0** (minor): gói mới `tri-thuc`, khối cấu hình mới `tri_thuc`, lệnh `gop` và khoá `gop_khong_chay_lai_ci`
của gói `dieu-phoi` là bề mặt mới — nếp «minor cho bề mặt mới» (GUIDE «Bump version khi ship (minor cho luật gate mới)»,
tiền lệ đoạn «Vì sao 2.33.1»). Không gãy đường đọc-cũ. Năm dòng số, dự báo, điều kiện tin cậy, dòng hiệu chuẩn và ghi
chú nhận cho crm nằm ở mục `2.34.0` của `CHANGELOG.md` — một nguồn, hồ sơ không chép lại; ghi chú nhận cho invest (nhảy
2.9.0 → 2.34.0) ở `docs/handoff/2026-10-25-nhan-2-34-0-tu-2-9-0.md`.

Source input: `git log v2.33.1..HEAD` · nếp phát hành `_acceptance/release-2-33-1/`, `_acceptance/release-2-33-0/` · Notes
và Known limits của tám hồ sơ · `CLAUDE.md` luật (c) sau #400.

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (nơi ca vĩnh viễn P200 sống), Then lệnh thoát 0 — P200 đọc số từ sáu manifest và đòi `acceptance-gate`, `feature-loop`, `dieu-phoi`, `road-map`, `tri-thuc` mang CÙNG một số hợp semver, `diagram-design` hợp semver; P200 đỏ thì vùng 3 thoát khác 0.
- AC-2: Given cây đã sửa, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 dựng câu «Khớp phiên bản» của GUIDE từ các số đọc trong manifest rồi so (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows) VÀ trọn bộ ca điều phối (`tests/dieu-phoi/**`), Then mọi lệnh XANH và `product-map --check` khớp (PRODUCT-MAP.md và LO-TRINH.html vẽ lại sau khi sửa lộ trình kit).
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 279b1515 …`, mốc = commit gắn tag `v2.33.1`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `279b1515` (tag `v2.33.1`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 đòi mô tả `acceptance-gate` CÓ mục của đúng số đang phát hành và mục đó của `feature-loop` TỰ khai cặp `acceptance-gate >= <số>`.
- AC-7: Given mốc `279b1515`, When liệt tệp đổi dưới `road-map/` tới HEAD bằng git, Then tập tệp đổi BẰNG đúng manifest của nó — `road-map` chỉ đổi số, như CHANGELOG mục `2.34.0` kể.
- AC-8: Given khối INIT-CI-COPY-LIST của `acceptance-init`, gạch «Lớp chép CI» của mục `2.34.0` trong CHANGELOG và mốc `279b1515`, When rút danh sách chép, rút danh sách ghi chú kể, rồi so tệp nào đổi byte tới HEAD, Then tập tệp đổi BẰNG tập ghi chú kể (tệp lệnh của `release-2-29-0`, dùng lại).
- AC-9: Given mục `2.34.0` của `CHANGELOG.md` cùng nguồn nó chép, When đọc từng mục con, Then (o) mỗi câu mô tả vòng (câu giao, lý do, giới hạn trích) là chữ của hợp đồng hồ sơ ấy, không tóm tắt lại, và số giới hạn đã khai khớp Notes của hợp đồng; (i) lời về lệnh, khoá cấu hình và luật gộp của `ky-den-gop` khớp `dieu-phoi/README.md` và khối PR-SAN-SANG của SKILL feature-loop; (ii) hình dạng khối `tri_thuc` khớp khuôn `skills/acceptance/references/tri-thuc-template.md`; (iii) lời về lớp chép CI khớp nhãn trong `commands/acceptance-init.md`; (iv) đoạn «Vì sao 2.34.0» và «Ai bị ảnh hưởng» không giấu hai đổi hành vi chạm kho đang dùng (PR sẵn sàng lúc trình thẻ; ngưỡng swap/RSS hết tác dụng).
- AC-10: Given số trong `.claude-plugin/plugin.json` ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc`, Then lệnh chạy TRỌN kiểm bản cài trên HEAD và thoát 0 với «TỔNG KẾT: ĐẠT 8/8 — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-33-1, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi | lớp chép CI | bản cài khớp thẻ) `[thước CE: ba mươi mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; gói chỉ đổi số → AC-7; lớp chép CI khớp ghi chú → AC-8; ghi chú nhận chép đúng chữ nguồn → AC-9 (judgment, bài học E9 mốc 2.33.0); bản cài khớp thẻ → AC-10 (khoá KC1). Gói mới `tri-thuc` đi qua AC-1 (P200 có vế «tri-thuc cung so» và đột biến «tri-thuc lech so» từ TT1).

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội; ngưỡng của từng vòng sống ở hồ sơ của chúng và đọc ở PR nhận của crm, invest.

## Out of scope

- Đổi dòng mã cổng — mốc phát hành KHÔNG dựng răng mới (GUIDE §7.1).
- Sửa thước ký → gộp của `dieu-phoi/scripts/do-gop.mjs` (mù khi PR có commit sau chữ ký) — chỉ ghi hạt giống trong PR này.
- Sửa Known limits của SK1 (11), ảnh-có-thật (6), ky-den-gop (13), TT1 (20), TT3 (11), TT2 (7), TT4 (7), TT5 (6) — vòng sau.
- Cài 2.34.0 vào crm và invest, khai `tri_thuc`, bật `gop_khong_chay_lai_ci` — việc của kho nhận sau mốc.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths`.
- Cùng PR: lộ trình kit `docs/plans/lo-trinh-kit.json` — mốc «Phát hành kế» đổi tên thành «Phát hành 2.34.0», ngày về
  25/10, SK1 chuyển từ mốc «Phát hành sau mốc 22/10» sang mốc này (đã gộp 21/10); vẽ lại `LO-TRINH.html`.
- Hạt giống ghi ở PR mốc (ô này trích lại tên tệp, luật VC8): `docs/plans/2026-10-25-hat-giong-do-gop-mu-khi-co-commit-sau-ky.md`.
- Năm dòng số lần đầu đo dòng 1 tới GỘP (#400). Bốn vòng (SK1, ảnh-có-thật, TT2, TT4) đọc ký → gộp bằng tay vì
  `do-gop.mjs` trả rỗng — cùng định nghĩa của tệp, ghi ở «Đọc số» của CHANGELOG.
- `kho-tri-thuc-va-lint/usage-report.md` không ghi lượt chấm 1; token của TT1 là lượt 2–3.
- Sửa trong PR mốc, không qua vòng (crm #565, 25/10): lớp chép CI của tầng tri thức thêm khuôn `tri-thuc-template.md`
  (33 mục) và răng phủ `cat-luot.mjs --pham-vi` chỉ nạp bộ đọc khoá tri thức khi có tệp — ca CT0–CT4
  `tests/scripts/chep-tri-thuc-du.test.mjs` commit trước bản sửa; sổ d-20261025T041903Z-8, -9.
- Known limits — chọn ở Cổng Bằng chứng 2026-10-25:
  - Ngoài-2: Kho chỉ bật tầng tri thức mà không bật tầng tín hiệu không chạy được bước kiểm tra tri thức vì thiếu một tệp; hai kho đang chờ nhận khai cả hai.
  - Ngoài-3: Phép thử xác nhận kho nhận bản chép chạy được dùng thêm một tệp mà kho thật có thể không có, nên màu xanh của nó có thể đẹp hơn thực tế.
  - Ngoài-4: Ba ca thử xác nhận bản chép đủ đều xanh nhờ một tệp mà kho nhận không chắc có; lệnh cắt lượt chạy từ bản chép có thể vỡ mà phép thử không báo trước.
  - Ngoài-5: Phép thử của bước kiểm tra tri thức chỉ xác nhận không có lỗi thiếu tệp, chưa xác nhận bước đó chạy xong và báo kết quả đúng.
- Mở hợp đồng mới (Ngoài-1): hạt giống `docs/plans/2026-10-25-hat-giong-chep-thieu-khuon-o-co-hoi.md`.
