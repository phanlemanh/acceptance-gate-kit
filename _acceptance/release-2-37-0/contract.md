---
schema_version: 1
feature: Phát hành kit 2.37.0 — Khuôn lõi (bộ đọc bản đồ khuôn dùng chung, bước chấm khuôn ở lượt chấm S4, bước chấm đọc đúng bản đồ thật) cùng sáu bản vá sau 2.36.0 (design-floor ở kho lớn, lưới trước gộp đọc thư viện theo chỗ cài và chỉ kéo hồ sơ khi chạm tệp vật, thẻ cửa veto khi bộ quét hết hạn, mã lượt chạy đúng hình dạng, một luật tên máy của gói dieu-phoi); kho chờ nhận crm trước, onehub-quy-hang sau
slug: release-2-37-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 5 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + lộ trình kit + bản đồ + khoá executor — KHÔNG dính t3_paths
surfaces: [cli]
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-11-03T03:15:00Z
---

# Acceptance Contract: release-2-37-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm` trước, `onehub-quy-hang` sau. Năm trong sáu bản vá có gốc ở issue
do crm mở (#460, #463, #464, #467, #468); Khuôn lõi (`khuon-loi`) có gốc ở hồ sơ đã ký của crm
(`khung-chung-ngan-ban-ghi`), và bản vá `khuon-doc-ban-do-that` đo số SAU trên bản sao crm (0 báo oan với glob hẹp).
Mốc lộ trình: «Phát hành 2.37.0».

**Quyết của chủ kho:** 01/11 «Giao Mac Studio» — một mốc cho sáu bản vá cùng Khuôn lõi, thay cho cắt 2.36.1 riêng;
02/11 «Vá trước» — mở `khuon-doc-ban-do-that` trước khi cắt; 03/11 «Cắt trước» — sau khảo sát kho thứ hai
(`docs/findings/2026-11-03-ban-do-khuon-quy-hang-va-ke-hoach-kit.md`, nhánh `claude/khao-sat-ban-do-khuon-quy-hang-f55a61`,
commit `e10ac284`), cắt 2.37.0 như đang có, bản vá V0 (bộ đọc hiểu `ngoai_le` không `khoi` là «tệp rời nhóm») đi ở
mốc kế; 03/11 «Chờ #478 gộp» — mốc chờ bản vá năm lỗi của issue #477 (Điều phối – Thợ, người chấm ui-check, lưới trước gộp; hồ sơ
`sua-loi-dau-chu-dong-vao`, kho chờ nhận onehub-quy-hang) vào nhánh chính rồi mới cắt. Số của khảo sát (finding §0, commit
`e10ac284`): trên bản sao onehub-quy-hang, `main` `428b2773` ra 10 lệch mới và 6 nợ cũ; bộ đo của kho ra 0.

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ:
`va-design-floor-kho-lon-nhanh-chinh` (#465) · `pre-merge-doc-lib-theo-kit` (#466) · `quet-het-han-khong-moi-ky` (#469) ·
`run-id-danh-sach-cho-phep` (#472) · `chi-tep-vat-keo-xet-lai` (#474) · `khuon-loi` (#475) · `khuon-doc-ban-do-that`
(#476) · `sua-loi-dau-chu-dong-vao` (#478). **Máy thông, không chữ ký người** (không vào tập của AC-4 vì `rel-cua-so.sh` chỉ đếm `signed-off`):
`ten-may-mot-luat` (#471). Ngoài vòng: #456 (báo cáo đợt `tinh-chinh-2610`) · #457 và #462 (ghi chú nhận 2.36.0) ·
#458 (bản phạm vi bản đồ khuôn 31/10).

Số là **2.37.0** (minor): bề mặt mới — bộ đọc `scripts/ban-do-khuon.cjs`, bước chấm `scripts/design-floor-khuon.mjs`
(lệnh `--kiem`, `--dem`, `--tao`, `--nap`, `--goi-y-eval`), tệp `khuon-cham.json`, dòng «Khuôn» trên thẻ Cổng Bằng
chứng, khối KHUON-S0/S1/SAU-S4 của feature-loop. Kho không khai `design/patterns/` không đi qua đường nào mới. Chủ kho
veto số ở Cổng Bằng chứng. Năm dòng số, dự báo, điều kiện tin cậy, dòng hiệu chuẩn và ghi chú nhận nằm ở mục `2.37.0`
của `CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

Source input: `git log v2.36.0..HEAD --first-parent` · nếp phát hành `_acceptance/release-2-36-0/` · Notes và Known
limits của chín hồ sơ · GUIDE §5.2 · `skills/acceptance/references/ban-do-khuon-template.md` · `dieu-phoi/README.md` ·
finding 03/11 §5.2 và §10.

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (nơi ca vĩnh viễn P200 sống), Then lệnh thoát 0 — P200 đọc số từ sáu manifest và đòi `acceptance-gate`, `feature-loop`, `dieu-phoi`, `road-map`, `tri-thuc` mang CÙNG một số hợp semver, `diagram-design` hợp semver; P200 đỏ thì vùng 3 thoát khác 0.
- AC-2: Given cây đã sửa, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 dựng câu «Khớp phiên bản» của GUIDE từ các số đọc trong manifest rồi so (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows) VÀ trọn bộ ca điều phối (`tests/dieu-phoi/**`), Then mọi lệnh XANH và `product-map --check` khớp (PRODUCT-MAP.md và LO-TRINH.html vẽ lại sau khi sửa lộ trình kit).
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 4f891b07 …`, mốc = commit gắn thẻ `v2.36.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `4f891b07` (thẻ `v2.36.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 đòi mô tả `acceptance-gate` CÓ mục của đúng số đang phát hành và mục đó của `feature-loop` TỰ khai cặp `acceptance-gate >= <số>`.
- AC-7: Given mốc `4f891b07`, When liệt tệp đổi dưới `road-map/` và `tri-thuc/` tới HEAD bằng git, Then tập tệp đổi BẰNG đúng hai manifest — hai gói chỉ đổi số, như CHANGELOG mục `2.37.0` kể.
- AC-8: Given khối INIT-CI-COPY-LIST của `acceptance-init`, gạch «Lớp chép CI» của mục `2.37.0` trong CHANGELOG và mốc `4f891b07`, When rút danh sách chép, rút danh sách ghi chú kể, rồi so tệp nào đổi byte tới HEAD, Then tập tệp đổi BẰNG tập ghi chú kể (tệp lệnh của `release-2-29-0`, dùng lại).
- AC-9: Given mục `2.37.0` của `CHANGELOG.md` cùng nguồn nó chép, When đọc từng mục con, Then (o) mỗi câu mô tả vòng (câu giao, gốc, giới hạn trích) là chữ của hợp đồng hồ sơ ấy, không tóm tắt lại, và số giới hạn đã khai khớp Notes của hợp đồng; (i) lời về bộ đọc bản đồ khuôn, bước chấm khuôn, `khuon-cham.json` và khuôn tệp bản đồ khớp GUIDE §5.2, khuôn tệp `ban-do-khuon-template.md` và hợp đồng `khuon-loi`, `khuon-doc-ban-do-that`; (ii) lời về luật tên máy khớp `dieu-phoi/README.md`; (iii) lời về lớp chép CI khớp nhãn trong `commands/acceptance-init.md`; (iv) đoạn «Vì sao 2.37.0» và «Ai bị ảnh hưởng» không giấu đổi hành vi chạm kho đang dùng (lượt chấm S4 dừng hồ sơ chạm vùng nhóm mà thiếu eval khuôn; lưới trước gộp không còn kéo hồ sơ vì sửa tệp chữ; mã lượt rác thành mã đúc) và nói thẳng giới hạn chủ kho chọn cắt trước: mục `ngoai_le` không `khoi` chưa được hiểu, kho viết như thế thấy báo oan tới mốc kế.
- AC-10: Given số trong `.claude-plugin/plugin.json` ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc`, Then lệnh chạy TRỌN kiểm bản cài trên HEAD và thoát 0 với «TỔNG KẾT: ĐẠT 8/8 — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-36-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi | lớp chép CI | bản cài khớp thẻ) `[thước CE: ba mươi ba mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; gói chỉ đổi số → AC-7; lớp chép CI khớp ghi chú → AC-8; ghi chú nhận chép đúng chữ nguồn và nói thẳng giới hạn đã chọn → AC-9 (judgment); bản cài khớp thẻ → AC-10 (khoá KC1). Mốc này không có ô mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội; ngưỡng của từng vòng sống ở hồ sơ của chúng.

## Out of scope

- Đổi dòng mã cổng — mốc phát hành KHÔNG dựng răng mới (GUIDE §7.1).
- Bản vá V0 (bộ đọc hiểu `ngoai_le` không `khoi` là «tệp rời nhóm») — chủ kho 03/11 «Cắt trước»; đi ở mốc kế.
- Gộp nhánh khảo sát `claude/khao-sat-ban-do-khuon-quy-hang-f55a61` (finding + hạt giống 03/11) — PR riêng, không đi trong PR mốc.
- Ghi chú nhận riêng cho crm và onehub-quy-hang ngoài mục CHANGELOG — việc của phiên điều phối sau khi gắn thẻ.
- Sửa Known limits của chín hồ sơ — vòng sau.
- Cài 2.37.0 vào crm và onehub-quy-hang, khai `executors.design.khuon` ở kho tiêu thụ — việc của kho nhận sau mốc.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths`.
- Cùng PR: lộ trình kit `docs/plans/lo-trinh-kit.json` — mốc «Phát hành 2.37.0» đổi tên (nêu #475, #476), ngày về 03/11
  kèm lý do «Cắt trước»; vẽ lại `LO-TRINH.html` và `PRODUCT-MAP.md`. Bốn khoá executor `rel2370_*` trong
  `_acceptance/config.yaml`.
- Điều kiện tin cậy (i) của dòng 4–5 ĐỔI ở cửa sổ này: `feature-loop/workflows/acceptance-verify.js` đổi (mã lượt theo
  khối RUN-ID-HINH, `run-id-danh-sach-cho-phep`; lời gọi người chấm ui-check mang `devServerUrl` và các người chấm ui-check
  chạy lần lượt, `sua-loi-dau-chu-dong-vao`) — mỗi đổi kèm ca cả hai chiều trong hồ sơ của nó; đường finder → refute →
  REJECT không đổi thành phần.
