---
schema_version: 1
feature: Vòng là một kết quả — răng cắt lượt nói ra hàng nào phải tách, gộp được, hay lệch dáng câu giao (cờ có tên, khoảng cỡ một nguồn trong SKILL), và đồng hồ chỉ đọc in lại bảng cỡ → lượt chấm → chạm trần từ hồ sơ đã giao để mỗi mốc đọc lại khoảng trên số thật
slug: vong-la-mot-ket-qua
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/cat-luot.mjs + skills/cat-luot/SKILL.md + khuôn lo-trinh-template.json + test — không chạm lib/**, hook, lưới trước-merge. Hàng S3 ghi T3: máy không tự sửa hàng, nêu ở Cổng Phạm vi.
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-11-vong-la-mot-ket-qua-design.md
status: implemented
approved_by: Manh Phan
approved_at: 2026-10-11T00:41:20Z
---

# Acceptance Contract: vong-la-mot-ket-qua

## Context

Hàng S3 của lộ trình kit (chính sách chủ kho chốt 10/10) mở lại ô Cổng Đáng đã ký build 04/09. Kết quả
của vòng — dáng việc nền: khi một phiên cắt một đợt phạm vi thành hàng, răng cắt lượt nói ra TRƯỚC khi
PR mở hàng nào dự kiến quá một vòng, hàng nào dưới mục tiêu và gộp được, hàng nào lệch dáng câu giao;
và một lệnh chỉ đọc in lại bảng cỡ → lượt chấm → chạm trần từ hồ sơ đã giao. Khoảng cỡ là chính sách
(một khối trong SKILL), dữ liệu là đồng hồ (đo lại 11/10: cỡ dự báo lượt chấm ở crm, gần như không ở
kit — design doc §3).

## Criteria

- AC-1: Given khối `CAT-LUOT-CO` của `skills/cat-luot/SKILL.md` (muc_tieu · cho_phep_den · tach_tu · tran_luot_cham · it_du_lieu_duoi), When `cat-luot.mjs` chạy ở bất kỳ chế độ nào, Then nó lấy khoảng cỡ từ chính khối ấy của SKILL nằm cạnh nó trong gói — bản sao gói sửa khối (`tach_tu: 13` → `11`, `cho_phep_den: 12` → `10`) thì cùng hàng 11 tiêu chí đổi từ `tren-muc-tieu` sang `can-tach`; và trên ma trận viết sẵn các khối hỏng {khối vắng · thiếu một khoá (mỗi khoá một ca) · số không nguyên dương (ở `muc_tieu`, ở `tran_luot_cham`, chữ ở `it_du_lieu_duoi`) · `muc_tieu` ngược · `cho_phep_den` nhỏ hơn cuối mục tiêu · khoảng hở (`tach_tu` > `cho_phep_den + 1`) · khoảng chồng (`tach_tu` ≤ `cho_phep_den`)} mỗi ca thoát 2 với thông điệp nêu đúng khoá hỏng, không in bảng phủ.
- AC-2: Given một đợt có hàng mang `tieu_chi` lần lượt 1…16 cùng các ca thiếu `tieu_chi` và `tieu_chi` sai kiểu (`"9"`, `9.5`, `0`, `-3`), When chạy răng, Then mỗi hàng nhận đúng cờ theo bảng viết sẵn từ khối khoảng — `duoi-muc-tieu` (1–7, cảnh báo) · không cờ cỡ (8–10) · `tren-muc-tieu` (11–12, cảnh báo) · `can-tach` (≥ 13, lỗi) · `chua-uoc-tieu-chi` (thiếu, cảnh báo) · `tieu-chi-sai-kieu` (sai kiểu, lỗi) — dòng ra nêu mã hàng, tên cờ trong ngoặc vuông và con số; mã thoát 1 khi và chỉ khi có lỗi; số ca đo bằng số phần tử ma trận (in ra).
- AC-3: Given hai hàng cùng đợt, cùng `nhom`, mỗi hàng dưới mục tiêu và tổng ≤ `cho_phep_den`, When chạy răng, Then dòng `duoi-muc-tieu` của mỗi hàng nêu «gộp được với <mã kia> (tổng N)»; ba ca đối chứng không có câu gộp: khác `nhom` · tổng > `cho_phep_den` · một trong hai hàng khác đợt.
- AC-4: Given hàng cùng đợt khai `vai`, When chạy răng, Then trên ma trận viết sẵn {vai mở câu · vai mở câu sau dấu «/“ và khác hoa thường · vai ghi dạng tổ hợp (NFD) còn câu ghi dạng dựng sẵn (NFC) · vai nằm giữa câu · vai không có trong câu · `vai: nen` có `bat_khi` · `vai: nen` thiếu `bat_khi` · `vai: nen` `bat_khi` toàn khoảng trắng · thiếu `vai`} mỗi ca ra đúng kỳ vọng: không cờ · không cờ · không cờ · `vai-khong-mo-cau` (lỗi) · `vai-khong-mo-cau` (lỗi) · không cờ · `nen-thieu-bat-khi` (lỗi) · `nen-thieu-bat-khi` (lỗi) · `chua-khai-dang-giao` (cảnh báo).
- AC-5: Given hàng NGOÀI đợt (đợt khác hoặc không `dot`) mang mọi cờ của AC-2 và AC-4, When chạy răng, Then mã thoát vẫn 0 và mỗi cờ có hàng ngoài đợt hiện đúng MỘT dòng `cảnh báo: [<cờ>] <k> hàng ngoài đợt …` liệt mã (tối đa 8 rồi «…»), không dòng theo từng hàng.
- AC-6: Given ba lộ trình đời trước không có `vai`/`tieu_chi` — khuôn `lo-trinh-template.json` ở commit gốc `68951cef`, lộ trình kit `docs/plans/lo-trinh-kit.json` cộng một đợt mới, bản chụp lộ trình OKR crm (`tests/scripts/fixtures/lo-trinh/crm-okr.json`) cộng một đợt mới — When chạy răng gốc (`git archive 68951cef scripts lib skills`) và răng mới trên cùng bản phạm vi, Then mã thoát bằng nhau và tập dòng không mở bằng `cảnh báo:` bằng nhau từng chữ; mọi dòng thêm ở răng mới mở bằng `cảnh báo:` và mang một tên cờ của danh sách cờ xuất khẩu; và trang lộ trình vẽ từ kho có hàng mang `vai`/`tieu_chi` giống từng byte trang vẽ khi bỏ hai trường ấy.
- AC-7: Given kho thử có hồ sơ dựng trong ca — hợp đồng khai tiêu chí bằng gạch đầu dòng lẫn bằng tiêu đề `### AC-n`, `usage-report.md` sinh bằng CHÍNH `wf-usage.mjs --md --title "S4 round N"` (bên ghi thật) từ transcript giả, đủ các trạng thái (draft · approved chưa giao · signed-off · machine-cleared · da-cham-boi-thuc-te · đã giao không lượt chấm · không đọc được tiêu chí) — When chạy `cat-luot.mjs --root . --co`, Then JSON có bốn nhóm theo khối khoảng với `n_chot` (mọi hồ sơ đã chốt phạm vi), `n`, `luot_tb`, `cham_tran_pt`, `it_du_lieu` (hồ sơ đã giao có lượt chấm) đúng bằng giá trị tính tay trong ca; `trong_khoang.pt_tong` tính trên hồ sơ đã chốt — hồ sơ approved chưa giao cỡ 15 kéo `pt_tong` xuống, không bị bỏ — còn `cham_tran_pt` chỉ trên hồ sơ đã giao; `bo_qua` đếm đúng từng lý do; nhóm n = 0 không mang số; kho không hồ sơ đã chốt nào → `chua_do_duoc: true`, không phần trăm; băm mọi tệp trong cây (số tệp băm > 0) trước = sau và `git status` rỗng — bản sao ghi một tệp trước khi in thì phép đo đỏ nêu tệp ấy; và trên chính hồ sơ thật của cây kit đang kiểm, `n_chot` tổng ≥ 50 và `bo_qua.khong_doc_tieu_chi` bằng đúng số hồ sơ không khai mã nào theo khuôn `AC-<số>` (đếm độc lập, in tên) — bộ đọc khớp khuôn bên ghi thật.
- AC-8: Given cùng kho thử với ngày chốt phạm vi (`approved_at`, vắng thì `veto_opened_at`) trải hai phía một mốc, và một tệp lộ trình có hàng khai `tieu_chi` + `slug` trỏ hồ sơ trong kho, When chạy `--co --tu <mốc> --lo-trinh <tệp>`, Then chỉ hồ sơ chốt từ mốc trở đi được đếm, hồ sơ không ngày chốt vào `bo_qua.khong_ngay_chot`, `trong_khoang.pt_tong` (kèm `n_chot`) và `cham_tran_pt` (kèm `n`) đúng giá trị tính tay; `du_kien.hang` liệt mỗi hàng có slug trỏ hồ sơ đã chốt với `du_kien` cạnh `that` (số tiêu chí thật), `vuot_cho_phep` đúng — hàng khai 9 mà hợp đồng thật 16 tiêu chí được đếm; hàng có slug không trỏ hồ sơ nào không vào danh sách; mốc sau mọi hồ sơ → `chua_do_duoc: true`; `--tu` sai khuôn ngày → thoát 2 nêu giá trị.
- AC-9: Given `skills/cat-luot/SKILL.md`, When chạy NGUYÊN VĂN khối lệnh đồng hồ (`CAT-LUOT-CO-LENH`) và khối lệnh răng (`CAT-LUOT-RANG`) của SKILL trên kho thử (gốc gói như harness thay), Then lệnh đồng hồ in JSON có `nhom`, lệnh răng ra đúng mã thoát ca xanh/đỏ; SKILL vẫn có sáu luật đánh số, luật 1 nêu hai dáng câu giao và luật 4 trỏ khối khoảng cỡ; bảng cờ của SKILL có đúng tập tên bằng danh sách cờ xuất khẩu của `cat-luot.mjs`; và khuôn `lo-trinh-template.json` có ≥ 1 hàng dáng có vai và ≥ 1 hàng `vai: nen`, mọi hàng của đợt mẫu có `tieu_chi`, răng chạy trên đợt mẫu ra 0 lỗi và 0 cảnh báo.
- AC-10: Given chỉ SKILL `cat-luot`, khuôn lộ trình và bản phạm vi mẫu chép trong hồ sơ (dựng từ ca thật media-library 04/09: 13 mã cắt theo gốc kỹ thuật), When một giám khảo làm theo SKILL tự cắt bản phạm vi ấy thành hàng (chỉ dùng ba tệp), Then các hàng nó cắt ra: mỗi hàng một kết quả (ít hàng hơn 13 hồ sơ gốc, không hàng nào gom theo gốc kỹ thuật), mỗi hàng có `tieu_chi` trong khoảng hoặc lý do tách/gộp theo khối khoảng, câu giao đúng một trong hai dáng (có vai cho việc người dùng thấy, hành vi đo được cho việc nền — không ép «Là kỹ sư…»), mọi mã ở đúng một hàng hoặc chân trời, và không hàng nào mang trường cho agent; giám khảo nêu bước nào của SKILL dẫn nó tới từng lựa chọn. (judgment)

## Coverage

Quét bằng `morphological-scan` (preset test-matrix; đối tượng = một hàng lộ trình × lượt răng, cộng
đồng hồ trên tập hồ sơ). Chân sản phẩm: chính sách 10/10 và số đo nền `[SUY-TỪ-REPO:
docs/plans/lo-trinh-kit.json]` (hàng S3) · răng hiện có `[SUY-TỪ-REPO: scripts/cat-luot.mjs]` · bộ đọc
tiêu chí `[SUY-TỪ-REPO: lib/ac-line.cjs]` · ca thật 13 hồ sơ `[SUY-TỪ-REPO:
_acceptance/vong-la-mot-ket-qua/opportunity.md]`. Chân ngành: `[NGÀNH: Shape Up — appetite cố định,
phạm vi co giãn]` (cỡ chốt trước khi làm) · `[NGÀNH: INVEST — Small]` (hạng mục vừa một chu kỳ) ·
`[NGÀNH: Connextra user story «As a <role> …»]` (dáng có vai — và giới hạn của nó: việc nền không có vai,
nên chính sách tách hai dáng).

- Trục A — cỡ dự kiến: thiếu | sai kiểu | dưới mục tiêu (có / không hàng gộp được) | mục tiêu | cho phép | phải tách  [thước CE: khối CAT-LUOT-CO = chính sách 10/10] → AC-2, AC-3
- Trục B — dáng câu giao: thiếu vai | vai mở câu | vai lệch | nền có ngưỡng | nền thiếu ngưỡng  [thước CE: chính sách 10/10 hai dáng] → AC-4
- Trục C — phạm vi hàng: trong đợt | ngoài đợt | lộ trình đời trước  [thước CE: luật trong/ngoài đợt của răng hiện có; luật 26/09] → AC-5, AC-6
- Trục D — nguồn khoảng: khối lành | khối sửa | khối hỏng  [thước CE: luật một nguồn] → AC-1
- Trục E — đồng hồ: hồ sơ đã giao có lượt | không lượt | không đọc được tiêu chí | chưa giao | lọc ngày | N = 0 | ít dữ liệu  [thước CE: số đo 10/10, phép đọc bat_khi] → AC-7, AC-8
- Trục F — người dùng răng: phiên cắt (skill, lệnh nguyên văn, khuôn)  [thước CE: ca 13 hồ sơ media-library] → AC-9, AC-10
- Later: khoá cấu hình khoảng theo kho · trang lộ trình hiện cỡ/vai · răng cỡ ở Feature Loop S1 · lint tiêu chí đo cơ chế (W8).
- Never: máy tự suy khoảng cỡ từ dữ liệu (số kit §3.2 của design) · trường cho agent trong lộ trình.

## Đường đo

Ngưỡng đọc ở phiên nghiệm thu là `bat_khi` của hàng S3 (chính sách 10/10), thay SỐNG/CHẾT của ô 04/09 —
dòng sổ `d-…-5`, cửa veto ở Cổng Phạm vi.

- ≥ 80 % vòng mới trong 8–12 tiêu chí, 30 ngày sau giao · số từ: `cat-luot.mjs --co --tu <ngày crm nhận mốc>` trên crm, `trong_khoang.pt_tong` kèm `n_chot` (mẫu số = mọi vòng đã chốt phạm vi, không chỉ vòng đã giao) · AC-7, AC-8.
- Chạm trần ≤ 24 % · số từ: cùng lệnh, `trong_khoang.cham_tran_pt` kèm `n`; nền cùng thước hôm nay 27 % (n = 49), in cạnh — ngưỡng giữ chữ chủ kho · AC-7, AC-8.
- Cỡ khai lúc cắt khớp vật · số từ: cùng lệnh thêm `--lo-trinh <tệp crm>`, `du_kien.vuot_cho_phep` = 0 trên các hàng của đợt cắt kế đã mở vòng, kèm `du_kien.n` · AC-8.
- Lượt cắt crm kế: không hàng nào mang `can-tach` hoặc `vai-khong-mo-cau` khi PR mở · số từ: đầu ra răng dán trong PR cắt crm · AC-2, AC-4.

## Out of scope

- Feature Loop S1 («cap 5-15») — máy M5 đang giữ Feature Loop của DP7; vòng mở ngoài lộ trình không có răng cỡ.
- Sửa `loop-health.mjs` đếm round khác nhau thay vì đếm thô — đổi số các mốc đã cắt.
- Lint tiêu chí đo cơ chế (W8), mục «Kết quả người thấy» trong khuôn hợp đồng.
- Trang lộ trình hiện `vai`/`tieu_chi`; khoá `cat_luot.co` theo kho; máy tự suy khoảng cỡ.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ca đo: `tests/scripts/lo-trinh.test.mjs` (LT-142…), chạy bằng `config:executors.test.lo_trinh` sẵn có —
  không thêm khoá executor (sửa `_acceptance/config.yaml` làm cũ hồ sơ khác).
- Bản phạm vi mẫu cho AC-10: `_acceptance/vong-la-mot-ket-qua/mau/pham-vi-curator.md`.
- Hai trường `vai`, `tieu_chi` là của LƯỢT CẮT (cùng loại `dot`, `phu`) — không bộ đọc nào ngoài răng đọc.
