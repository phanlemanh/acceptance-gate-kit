---
schema_version: 1
feature: Phát hành kit 2.36.0 — tinh chỉnh sau hai đợt thử (đợt tinh-chinh-2610, TC1–TC6) — đánh thức đọc đúng mã phiên, lệnh của đợt ghi đúng hàng, gộp không dừng ở hai tệp sinh, kiểm bản cài có lối sửa chạy được, chân công cụ xét tệp có tồn tại, làn đối chứng chạy được; kho chờ nhận invest rồi crm
slug: release-2-36-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 5 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + lộ trình kit + bản đồ + hạt giống + khoá executor — KHÔNG dính t3_paths
surfaces: [cli]
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-30T08:05:01Z
---

# Acceptance Contract: release-2-36-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `invest` và `crm` — năm trong sáu hồ sơ của cửa sổ có gốc ở lần nhận 2.34.0
hay đợt Điều phối – Thợ của invest (23–26/10), TC1 còn vấp ở đợt crm (19–20/10); làn đối chứng không chạy được ở mọi
kho trên 2.35.0 (TC6). Mốc lộ trình: «Phát hành 2.36.0» (trước đây «Tinh chỉnh sau hai đợt thử (số đặt lúc cắt)»).

**Quyết của chủ kho:** giao từ đầu đợt `tinh-chinh-2610` (phiên điều phối chuyển): «đủ các hàng gộp thì cắt bản vá theo
nghi thức #410/#441». Sáu hàng TC1–TC6 gộp sáng 30/10 (`f64b5754`).

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ:
`danh-thuc-doc-nhip-dung-ma` (TC1, #419 → `12701df6`) · `cong-cu-xet-tep-ton-tai` (TC5, #447 → `3b7d3b09`) ·
`kiem-ban-cai-loi-sua-chay-duoc` (TC4, #448 → `be366213`) · `lenh-dot-ghi-dung-hang` (TC2, #449 → `c0cf637f`) ·
`doi-chung-chay-duoc` (TC6, #450 → `2258d144`) · `tep-sinh-khong-chan-gop` (TC3, #452 → `f64b5754`). Ngoài vòng: #443
(dòng KC1 của 2.35.0) · #444 (gói đợt `tinh-chinh-2610`). #446 (lộ trình DFK) chưa gộp — mốc không chờ.

Số là **2.36.0** (minor), không 2.35.1 dù chủ kho gọi «bản vá»: nếp «minor cho bề mặt mới» (đoạn «Vì sao 2.35.0» và
tiền lệ 2.33.1 — lần duy nhất số vá đi kèm bề mặt mới, khai thẳng là lệch nếp). Bề mặt mới: lệnh `hang chay-lai` và
`hang them <mã|slug>` của gói `dieu-phoi`, khối bật theo lựa chọn `GITATTR-TEP-SINH` (thuộc tính + driver gộp
`tep-sinh`), khoá `ma_app` / `phien_cli` của nhịp và vai giám sát. Không gãy đường đọc-cũ. Chủ kho veto số ở Cổng
Bằng chứng. Năm dòng số, dự báo, điều kiện tin cậy, dòng hiệu chuẩn và ghi chú nhận nằm ở mục `2.36.0` của
`CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

Source input: `git log v2.35.0..HEAD --first-parent` · nếp phát hành `_acceptance/release-2-35-0/` · Notes và Known
limits của sáu hồ sơ · GUIDE khối `GITATTR-TEP-SINH` · `dieu-phoi/README.md`.

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (nơi ca vĩnh viễn P200 sống), Then lệnh thoát 0 — P200 đọc số từ sáu manifest và đòi `acceptance-gate`, `feature-loop`, `dieu-phoi`, `road-map`, `tri-thuc` mang CÙNG một số hợp semver, `diagram-design` hợp semver; P200 đỏ thì vùng 3 thoát khác 0.
- AC-2: Given cây đã sửa, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 dựng câu «Khớp phiên bản» của GUIDE từ các số đọc trong manifest rồi so (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows) VÀ trọn bộ ca điều phối (`tests/dieu-phoi/**`), Then mọi lệnh XANH và `product-map --check` khớp (PRODUCT-MAP.md và LO-TRINH.html vẽ lại sau khi sửa lộ trình kit).
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 979620ae …`, mốc = commit gắn thẻ `v2.35.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `979620ae` (thẻ `v2.35.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 đòi mô tả `acceptance-gate` CÓ mục của đúng số đang phát hành và mục đó của `feature-loop` TỰ khai cặp `acceptance-gate >= <số>`.
- AC-7: Given mốc `979620ae`, When liệt tệp đổi dưới `road-map/` và `tri-thuc/` tới HEAD bằng git, Then tập tệp đổi BẰNG đúng hai manifest — hai gói chỉ đổi số, như CHANGELOG mục `2.36.0` kể.
- AC-8: Given khối INIT-CI-COPY-LIST của `acceptance-init`, gạch «Lớp chép CI» của mục `2.36.0` trong CHANGELOG và mốc `979620ae`, When rút danh sách chép, rút danh sách ghi chú kể, rồi so tệp nào đổi byte tới HEAD, Then tập tệp đổi BẰNG tập ghi chú kể (tệp lệnh của `release-2-29-0`, dùng lại).
- AC-9: Given mục `2.36.0` của `CHANGELOG.md` cùng nguồn nó chép, When đọc từng mục con, Then (o) mỗi câu mô tả vòng (câu giao, gốc, giới hạn trích) là chữ của hợp đồng hồ sơ ấy, không tóm tắt lại, và số giới hạn đã khai khớp Notes của hợp đồng; (i) lời về khối `GITATTR-TEP-SINH`, driver `tep-sinh` và thư mục rỗng khớp GUIDE và hợp đồng `tep-sinh-khong-chan-gop`; (ii) lời về `xin`, `hang them`, `hang chay-lai` và hồ sơ T1 khớp `dieu-phoi/README.md`; (iii) lời về lớp chép CI khớp nhãn trong `commands/acceptance-init.md`; (iv) đoạn «Vì sao 2.36.0» và «Ai bị ảnh hưởng» không giấu đổi hành vi chạm kho đang dùng (đơn `xin s4` không cờ đổi slug và có thể từ chối; hồ sơ T1 tính là đã gộp; thư mục hồ sơ rỗng biến khỏi bản vẽ; làn đối chứng chạy thật) và căn cứ chọn minor thay vì vá đúng với nếp đã khai.
- AC-10: Given số trong `.claude-plugin/plugin.json` ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc`, Then lệnh chạy TRỌN kiểm bản cài trên HEAD và thoát 0 với «TỔNG KẾT: ĐẠT 8/8 — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-35-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi | lớp chép CI | bản cài khớp thẻ) `[thước CE: ba mươi hai mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; gói chỉ đổi số → AC-7; lớp chép CI khớp ghi chú → AC-8; ghi chú nhận chép đúng chữ nguồn → AC-9 (judgment); bản cài khớp thẻ → AC-10 (khoá KC1). Mốc này không có ô mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội; ngưỡng của từng vòng sống ở hồ sơ của chúng.

## Out of scope

- Đổi dòng mã cổng — mốc phát hành KHÔNG dựng răng mới (GUIDE §7.1).
- #446 (lộ trình DFK, cắt lượt design-floor cho kho mới) — chưa gộp; mốc không chờ.
- Ghi chú nhận riêng cho invest và crm ngoài mục CHANGELOG — việc của phiên điều phối sau khi gắn thẻ.
- Sửa Known limits của sáu hồ sơ — vòng sau.
- Cài 2.36.0 vào invest và crm, bật khối `GITATTR-TEP-SINH` ở kho tiêu thụ — việc của kho nhận sau mốc.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths`.
- Phạm vi nới sau lượt chấm 1 chạy lại (phiên điều phối giao 30/10, máy tự quyết, cửa veto mở — sổ quyết định): lượt
  đỏ ở E3h vì ca `GM-6-that` đọc bản ghi phiên thật có lời nhắn model `<synthetic>` token 0 (thông báo hạn mức của tài
  khoản trước) — lỗi của `scripts/do-vong.mjs`, nhánh chính cũng đỏ trên máy này. Sửa trong mốc: bộ đo bỏ lời nhắn ấy khỏi
  token (giờ máy giữ mốc thời gian của nó) + ca hai chiều `GM-6-do5`; một dòng ở mục «Ngoài vòng» của CHANGELOG 2.36.0.
  `scripts/do-vong.mjs` không thuộc `t3_paths` và không thuộc lớp chép CI. Ca `XD-6` (`xuat-du-qua-pipe`, người đọc
  đóng sớm) đỏ một lần trong lượt chấm vì thời điểm EPIPE, chạy riêng xanh 3/3 — chập chờn, không sửa ở mốc này; vào
  sổ known-limits cùng lượt ký Cổng Bằng chứng.
- Cùng PR: lộ trình kit `docs/plans/lo-trinh-kit.json` — mốc «Tinh chỉnh sau hai đợt thử (số đặt lúc cắt)» đổi tên thành
  «Phát hành 2.36.0», ngày về 30/10; vẽ lại `LO-TRINH.html` và `PRODUCT-MAP.md`. Hạt giống
  `docs/plans/2026-10-30-hat-giong-tep-sinh-mot-hang-mot-dong.md` (lời hứa M5 ở kit #308, neo `_acceptance/tep-sinh-khong-chan-gop/`).
- Điều kiện tin cậy (i) của dòng 4–5 ĐỔI ở cửa sổ này: `feature-loop/workflows/acceptance-verify.js` đổi (làn đối
  chứng, `doi-chung-chay-duoc`) — đổi kèm ca hai chiều trong `tests/workflows/doi-chung-chay-duoc.test.mjs`; lượt chấm
  của chính mốc này là lượt đầu chạy làn đối chứng mới trên kho kit sau khi gộp.
- Chỗ cắt cho cửa sổ kế (luật (c)): P179 — sổ known-limits thiếu hàng cho đề xuất của lượt trước — đốt bốn trong 19
  lượt chấm của cửa sổ (dòng 3 của CHANGELOG mục `2.36.0`); hạt giống
  `docs/plans/2026-10-18-hat-giong-so-known-limits-thieu-hang-p179.md` đã chạm ngưỡng — vòng meta kế khi chủ kho gọi tên.
- Known limits — chọn ở Cổng Bằng chứng 2026-10-31:
  - Ngoài-1: bộ đo giờ máy bỏ đúng phần lượng dùng của lời nhắn tự sinh, nhưng chưa có ca kiểm giữ vế «mốc thời gian của lời nhắn ấy vẫn vào giờ máy» — sửa nhầm vế này sau này thì giờ máy lệch nhẹ mà bộ kiểm vẫn xanh.
  - Ngoài-2: danh sách sáu hồ sơ của mốc được kiểm theo một bản chép tay trong cấu hình, không theo hợp đồng — sửa lệch một bên thì phép kiểm vẫn xanh.
