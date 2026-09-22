---
schema_version: 1
slug: ho-so-khep-thoi-hoi
feature: Hồ sơ đã khép (chấm bởi thực tế · đã nghỉ) thôi bị đối xử như đang mở — bộ đếm cửa veto, thẻ, làn V đọc đủ nguồn — và lớp CI vendored chép đủ hai tệp bản đồ; để kho tiêu thụ cài 2.18.1 không phải tự vá một tệp nào
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build             # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Phan Le Manh
decided_at: 2026-09-21T23:31:29Z   # owner gõ «build» một chạm trong phiên 22/09, máy ghi hộ
prototype:
  base_commit:
  disposition: archive
---

## Vấn đề & ai gặp

Gốc: crm/_acceptance/nhan-ung-dung-noi-tieng-viet — sau `observed` (`d-20260921T142711Z-21`, bản dựng `ff3fb8bf`) lưới trước-merge vẫn in NOTE «cửa veto đang mở» tên hồ sơ này; kit tái lập 22/09 với `_acceptance/release-2-0-0` (`d-20260921T231943Z-1`): NOTE đếm 3 hồ sơ, trong đó hồ sơ vừa khép
Gốc: crm/_acceptance/khai-lang-gioi-thieu — báo cáo để trống «Ngoài hợp đồng» trong khi `review-findings.md` có 2 mục → `khong-can-nguoi.mjs` gọi xanh-sạch → thẻ in «veto hay để yên» trong khi owner đang KÝ (`d-20260921T225452Z-11`; owner tự nhận ra 22/09)
Gốc: crm/_acceptance/dieu-phoi-30-ngay-dau — CI crm run 35615711064 đỏ «bản đồ lệch» trên commit `observed` `77880bba` vì `scripts/product-map.mjs` + `scripts/trang-thai-ho-so.cjs` vendored là bản 2.17; hai tệp KHÔNG có trong lớp CI 10 tệp của GUIDE §5.3, crm-rollout tự vá `4289ae2b` (PR crm #70)

**Ai gặp:** owner ở Cổng Bằng chứng (thẻ mời «veto hay để yên» khi việc của họ là ký; thẻ
hồ sơ đã nghỉ vẫn có ô hỏi) · phiên Claude Code cài kit ở kho tiêu thụ (CI đỏ ngay ngày cài,
phải tự chép thêm tệp ngoài danh sách) · người đọc NOTE trước-merge (đếm cửa veto sai).

**Cơn đau, đo 22/09** (hạt giống `docs/plans/2026-09-22-hat-giong-bon-loi-nho-2-18-0-tu-crm.md`,
PR #197 + #198): bốn lỗ, cùng một mốc, cùng ngày cài, cùng kho tiêu thụ, cùng cỡ vá điểm:
1. `scripts/start-scan.mjs` / `scripts/gate-card.js` ~969: `scanState` `may-di-tiep-veto-mo`
   còn đúng sau `da-cham-boi-thuc-te` → NOTE veto đếm hồ sơ đã khép (crm 21/09; kit 22/09).
2. GUIDE §5.3 lớp CI vendored thiếu `scripts/product-map.mjs` và `scripts/trang-thai-ho-so.cjs`
   (`product-map.mjs:35` `require` tệp thứ hai; chép một mà thiếu hai là `MODULE_NOT_FOUND`).
3. `scripts/khong-can-nguoi.mjs:66` đọc «Ngoài hợp đồng» của BÁO CÁO, không đối chiếu
   `review-findings.md` → fail-open làn V, TÁI PHÁT (đã ghi 20/09 ở
   `vong-ghim-lai-noi-ra-o-khong-do`); mặt thấy được: `MAY_DI_TIEP` sai → `gate-card.js:999`
   in «veto hay để yên» thay «ký hay trả».
4. `gate-card.js:999` + `:1242`: nhãn hỏi chọn theo `MAY_DI_TIEP` (mà `!!NGHI` → true), nên
   15 hồ sơ `da-nghi` của chiến dịch ghim lại 2.18.0 vẫn mang ô hỏi «veto hay để yên» — một
   hồ sơ đã khép không có câu hỏi nào cho người (Kit-vòng ghi nhận 22/09).

**Lỗ 2 của hạt giống #197 («`observed` không vẽ lại bản đồ») ĐÃ RÚT** khi soạn ô: cả sáu
commit `observed` ở crm (`50c257d1`…`77880bba`) đều mang `PRODUCT-MAP.md`, và bước 4 của
`commands/observed.md` có từ `90d2fde0` (trong 2.18.0). CI đỏ là lỗ 2 ở trên đội lốt.

Hồ sơ này là **vòng meta duy nhất** của cửa sổ giữa mốc 2.18.0 (crm cài 22/09, PR crm #70)
và mốc kế crm sẽ cài — owner gọi tên 22/09 (luật chiều rộng (b)).

## Giả định chốt sinh tử

1. **Bốn lỗ đều là vá điểm, không đổi luật hay enum.** Sai nếu một AC đòi sửa
   `lib/workspace-record.cjs` enum, một ADR, hay khối luật trong `CLAUDE.md`.
2. **Đối chiếu `review-findings.md` không làm làn V đỏ oan trên hồ sơ đã ký.** Chiều im:
   chạy `khong-can-nguoi.mjs` mới trên 65 hồ sơ đã ghim lại 2.18.0 → 0 hồ sơ đổi làn. Sai nếu
   > 0 mà không có mục thật trong findings.
3. **Kho tiêu thụ cài 2.18.1 chỉ chép DIFF của lớp CI**, không chép lại toàn bộ; crm sau
   khi cài: `diff -rq` 12 tệp so kit `main` = 0 khác biệt, không commit vá tay nào.
4. **Hồ sơ đã khép rời mọi ô hỏi mà không rời sử liệu**: thẻ hồ sơ `da-nghi` /
   `da-cham-boi-thuc-te` in 0 ô hỏi nhưng bản ghi mốc định tuyến vẫn có dòng (hoi= rỗng).

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: Sau khi crm cài 2.18.1, hồ sơ đã khép có còn bị kit hỏi hay đếm như đang mở không, và kho có phải tự vá tệp nào không?
- Kết quả nào là SỐNG: NOTE cửa veto ở crm và kit không đếm hồ sơ `da-cham-boi-thuc-te`/`da-nghi`; thẻ của 15 hồ sơ nghỉ + 7 hồ sơ thực-tế in 0 ô hỏi; ca khai-lang tái lập (báo cáo rỗng mục, findings 2 mục) → làn V «không xanh-sạch», thẻ «ký hay trả»; crm cài bằng diff 2 tệp, CI xanh lượt đầu, 0 commit vá tay.
- Kết quả nào là CHẾT: một trong bốn vế trên đỏ sau khi cài; hoặc ≥ 1 hồ sơ đã ký đổi làn oan (giả định 2); hoặc vòng cần > 3 lượt gọi người.
- Timebox: 2026-09-29 — quá hạn mà crm chưa cài 2.18.1 thì chính việc ấy là tín hiệu.

| Số | Trước 22/09 | Ngưỡng UAT | Chết |
|---|---|---|---|
| hồ sơ đã khép trong NOTE cửa veto (kit + crm) | 1 + 1 | 0 | > 0 sau cài |
| ô hỏi trên thẻ hồ sơ đã khép (15 nghỉ + 7 thực-tế) | 22 | 0 | > 0 |
| ca khai-lang tái lập → làn V | xanh-sạch (sai) | «không xanh-sạch» | vẫn xanh-sạch |
| tệp crm phải tự vá khi cài | 2 | 0 | ≥ 1 |
| hồ sơ đã ký đổi làn oan | — | 0 | ≥ 1 |
| lượt gọi người của vòng (T2) | — | ≤ 3 | > 3 |

## Kết quả prototype

Không có bản mẫu — vòng đổi engine, mặt người chỉ đổi ở thẻ (bớt một ô hỏi) và một dòng NOTE.

## Nguồn ngoài & phạm vi kế thừa

- Luật: khối ĐỊNH VỊ + «7 thao tác cổng người» trong `CLAUDE.md` · ADR 0020 · ADR 0002 ·
  ADR 0018 (vòng này toàn TRỪ + vá điểm, không CỘNG).
- Dùng lại, không dựng mới: `checkThucTe` (`lib/workspace-record.cjs`) làm vị từ «đã khép» một
  nguồn · `NGHI` của gate-card · ca canh danh sách lớp CI (`guide-chep-ci-buoc-vao-writer`) ·
  ca fail-open làn V đã có ở `vong-ghim-lai-noi-ra-o-khong-do` (mở rộng, không viết ca mới cùng hình).
- Kế thừa từ `nhan-trang-thai-va-reality`: trạng thái thứ bảy và lưới đọc nó.

## Cổng 0

Ba lối để owner cân: (a) *build* — bốn vá điểm một vòng T2, neo là kho tiêu thụ trong ngày
cài, đúng vế 4 luật (b); (b) *park* — để crm tự vá như đã làm; giá: mỗi kho cài kế lại
đỏ CI ngày đầu và owner tiếp tục nhận thẻ hỏi sai; (c) *chỉ làm lỗ 3 (gốc)* — chữa fail-open
nhưng thẻ hồ sơ khép vẫn hỏi và lớp CI vẫn thiếu tệp. Khuyến nghị (a). Hạng **T2**: không đổi
enum, không đổi thao tác cổng người, không có gì khó-đảo.

## Thước đo thành công → ứng viên criterion

S1 rút thành AC Given/When/Then, mỗi AC một chiều đỏ:
1. Bộ đếm cửa veto (`start-scan` + NOTE trước-merge) coi `da-cham-boi-thuc-te` và `da-nghi`
   là đã đóng — chiều đỏ: hồ sơ thực-tế + `veto_state: mo` → NOTE KHÔNG có tên nó; hồ sơ
   sống cùng frontmatter → CÓ.
2. GUIDE §5.3 lớp CI 12 tệp, ca canh danh sách rút từ chính `require` của `product-map.mjs`
   — chiều đỏ: chép `product-map.mjs` mà gỡ `trang-thai-ho-so.cjs` → nạp đỏ có tên.
3. `khong-can-nguoi.mjs` đối chiếu `review-findings.md` — chiều đỏ: báo cáo rỗng mục + findings
   2 mục → «không xanh-sạch»; chiều im: 65 hồ sơ ghim lại → 0 đổi làn.
4. Thẻ hồ sơ đã khép in 0 ô hỏi, bản ghi mốc định tuyến sinh lại cho 22 hồ sơ — chiều đỏ:
   hồ sơ `da-nghi` → `--extract` không có nhãn hỏi; hồ sơ sống → như cũ.

## Out of scope từ khám phá

- Không dựng lại `MAY_DI_TIEP` thành máy trạng thái mới — chỉ thêm vị từ «đã khép» trước nó.
- Không đổi enum trạng thái, không thêm thao tác cổng người.
- Rollout 2.18.1 ra kho khác ngoài crm — chiến dịch ghim lại theo release, cửa sổ kế.
- Lỗ 2 của hạt giống (đã rút) — không tái mở nếu không có commit `observed` nào thiếu bản đồ.

## Kết quả đo sau ship (Cổng Giá trị 2026-09-22)

Verdict **iterate** — số cạnh ngưỡng ở `uat-session.md` cùng thư mục; bản tổng kết `docs/findings/2026-09-22-tong-ket-cach-moi-cua-so-2-18.md` §1.
