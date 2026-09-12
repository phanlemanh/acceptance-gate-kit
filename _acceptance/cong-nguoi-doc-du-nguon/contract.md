---
schema_version: 1
feature: Cổng người đọc đủ nguồn — luật xanh-sạch đọc cả làn rà soát, thẻ đọc được tiêu chí khai bằng tiêu đề, thẻ Cổng 2 hiện lỗi trong hợp đồng chưa sửa
slug: cong-nguoi-doc-du-nguon
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli, ci, docs]
status: approved
approved_by: Phan Le Manh
approved_at: 2026-09-13
design_doc: docs/superpowers/specs/2026-09-12-cong-nguoi-doc-du-nguon-design.md
---

# Acceptance Contract: cong-nguoi-doc-du-nguon

## Context

Owner gọi tên 12/09/2026 sau bản truy nguyên
`docs/findings/2026-09-12-truy-nguyen-lop-loi-thang-9.md`. Ba lỗ, một hình dạng: **bên đọc
của cổng người hẹp hơn bên viết, và chỗ chênh lệch im lặng.**

Cả ba đều do kho tiêu thụ phát hiện, không phải kit tự soi: hai ô đã mở từ 05–08/09
(`xanh-sach-doc-nham-mat`, `the-cong-2-giau-loi-trong-hop-dong`), lỗ tiêu chí đo được ở
crm và bảy cây artifact-platform.

Vòng này đi TRƯỚC mốc phát hành 2.12.0; mốc là hồ sơ T2 thuần cắt số.

**Vị từ trung tâm, khai một lần ở đây rồi mọi AC dưới dùng lại — «mục CHỜ NGƯỜI»:**
số phần tử dưới `## Ngoài hợp đồng` cộng `## Trong hợp đồng` của `review-findings.md`,
TRỪ số dòng trong `decisions.jsonl` khai `stage: "gate2"`. Lớn hơn 0 là còn chờ người.
Vì sao trừ đi sổ chứ không đếm trần: một phát hiện ĐÃ được người định đoạt ở Cổng Bằng
chứng để lại đúng một dòng sổ, và nếu đếm trần thì mọi hồ sơ từng có phát hiện rồi đã xử
sẽ vĩnh viễn KHÔNG-sạch — đo thật trên corpus hôm nay: đếm trần cho 5 hồ sơ, vị từ này
cho **4** (`ghim-lai-tren-lop-cu` có 2 mục và 5 dòng định đoạt, nên nó SẠCH và đúng ra
phải sạch).

## Criteria

- AC-1: Given `review-findings.md` và `decisions.jsonl` của một hồ sơ cho vị từ «mục chờ người» bằng n, When chạy vị từ xanh-sạch ở CẢ HAI bản dựng (`xanh_sach_check` của `scripts/pre-merge-check.sh`, `xanhSach` của `scripts/khong-can-nguoi.mjs`), Then n > 0 cho KHÔNG-sạch với lý do chứa số n và tên mục; n = 0 giữ nguyên kết luận như trước bản vá; và trên cùng một hồ sơ hai bản dựng nêu CÙNG một lý do.
- AC-2: Given hai bản dựng của luật xanh-sạch, When đọc mã, Then cả hai rút điều kiện thứ bảy từ MỘT vị từ xuất khẩu bởi `lib/evidence-core.cjs`, vị từ đó rút danh sách mục từ MỘT bộ đọc `lib/out-of-contract.cjs`; không bản nào tự duyệt `review-findings.md` hay `decisions.jsonl` bằng khuôn riêng; và khối `EVIDENCE-XANH-SACH-BLOCK` khai đủ BẢY điều kiện đúng thứ tự hai bản dựng kiểm.
- AC-3: Given lưới chạy trong môi trường THIẾU (hai ca: `lib/out-of-contract.cjs` vắng cạnh `lib/evidence-core.cjs`; và `node` không có trên PATH nên lưới rơi về nhánh awk dự phòng), When hồ sơ còn mục chờ người, Then cả hai ca fail-CLOSED — kết luận KHÔNG-sạch với thông điệp nêu đích danh thứ đang thiếu (tên tệp kèm «INIT-CI-COPY-LIST», hoặc «thiếu node»), KHÔNG ném ngoại lệ trần ra ngoài và KHÔNG trả sạch.
- AC-4: Given báo cáo mang khoá `findings_open: <n>`, When đối chiếu với vị từ «mục chờ người» tính từ vật, Then khớp thì luật xử theo n; LỆCH thì cả hai bản dựng trả KHÔNG-sạch với lý do nêu CẢ HAI số (khai bao nhiêu, vật bao nhiêu).
- AC-5 (đường đọc-cũ): Given báo cáo VẮNG khoá `findings_open`, hoặc `review-findings.md` vắng hẳn, mà hồ sơ còn mục chờ người, When chạy lưới trước-merge, Then lưới in NOTE nêu số mục và đường xử, KHÔNG in VIOLATION và KHÔNG tăng bộ đếm vi phạm; và thẻ Cổng Bằng chứng của hồ sơ đó hiện cờ vàng nói rõ hồ sơ thuộc đời trước luật.
- AC-6: Given hồ sơ `verified` còn mục chờ người, When chạy `node scripts/khong-can-nguoi.mjs --write --root . --slug <slug>`, Then thoát 2, KHÔNG ghi đĩa, và lý do nêu số mục — bất kể báo cáo có hay vắng khoá `findings_open` (cửa GHI không đi qua lời khai).
- AC-7: Given một hợp đồng khai tiêu chí bằng tiêu đề (`### AC-n — nhãn`, thân ở các dòng sau), When gọi `parseACBlock` của `lib/ac-line.cjs`, Then nó trả đủ mọi id theo thứ tự xuất hiện, `gwt` của mỗi tiêu chí chứa chữ của nhãn VÀ của thân, và `judgment` / `crossLayer` tính theo đúng luật đang áp cho dòng gạch đầu dòng (nhãn đọc lỏng, thân chỉ nhận tag đúng chữ, tag trong code span không tính).
- AC-8: Given hợp đồng đặt tiêu chí dưới mục tên `Acceptance Criteria` hoặc `Acceptance criteria`, When bóc tiêu chí, Then kết quả bằng ĐÚNG kết quả khi mục tên `Criteria`; và khi không mục nào trong ba tên đó có mặt, bộ bóc quét cả tệp như hành vi hiện có.
- AC-9: Given một hợp đồng khai tiêu chí bằng tiêu đề mà bộ bóc chỉ ra được ít hơn số dòng trông-như-khai-báo, When chạy bộ dò điểm mù `acBlindSpot`, Then nó KÊU (trả khác null) và văn bản nêu số dòng bỏ sót; và trên hợp đồng LÀNH nó vẫn trả null (không kêu oan).
- AC-10: Given `review-findings.md` có mục `## Trong hợp đồng` với n > 0 phần tử, When render thẻ Cổng Bằng chứng, Then thẻ có khối riêng nêu đúng n mục ĐỨNG TRƯỚC khối «Ngoài hợp đồng», và thẻ KHÔNG phát ngôn nào khẳng định bằng chứng đã đầy đủ khi n > 0.
- AC-11 (răng xuyên lớp): Given một hợp đồng khai tiêu chí bằng tiêu đề, trong đó có tiêu chí mang tag `(cross-layer)` KHÔNG có eval nào khai `layer: backend-effect`, When chạy lưới trước-merge, Then lưới in VIOLATION cho đúng id đó ở CẢ HAI nhánh (nhánh node dùng `lib/ac-line.cjs`, nhánh awk dự phòng) — hai nhánh trả CÙNG tập id trên cùng hợp đồng.
- AC-12: Given cây sau bản vá, When chạy trọn bốn suite của `feature_loop.suite_keys`, Then tất cả thoát 0; và tập tệp `lib/**` mà ba tệp cưỡng chế thật sự nạp tới phải là TẬP CON của khối `INIT-CI-COPY-LIST` trong `commands/acceptance-init.md`, trong đó có `lib/out-of-contract.cjs`.
- AC-13 (mọi bên gọi, không chỉ thẻ): Given cùng một hợp đồng khai n tiêu chí bằng tiêu đề, When chạy BỐN bên đọc — `scripts/gate-card.js`, `scripts/evidence-page.js`, `scripts/eval-coverage-lint.js`, và nhánh node của răng cross-layer trong `scripts/pre-merge-check.sh` — Then mỗi bên nhìn thấy ĐÚNG n tiêu chí; và hoàn nguyên bất kỳ MỘT bên gọi nào về khuôn cũ làm đúng bên đó đếm sai.
- AC-14 (khuôn mục rút từ bên VIẾT): Given khuôn một mục của `review-findings.md` được rút trong chính lượt chạy từ chỗ có marker mà bên VIẾT dùng (prompt soạn của `feature-loop/workflows/acceptance-verify.js`), When sinh fixture từ khuôn đó rồi đếm bằng `lib/out-of-contract.cjs`, Then số đếm bằng đúng số mục đã sinh — cho CẢ HAI mục `Ngoài hợp đồng` và `Trong hợp đồng`; và đổi khuôn ở bên viết mà bên đọc vẫn ra số cũ là ĐỎ.
- AC-15 (hình dạng thứ ba của cùng lớp): Given một hợp đồng có mục `## Coverage` viết bằng BẢNG hoặc văn xuôi thay vì gạch đầu dòng, When thẻ Cổng Phạm vi dựng khối «Độ phủ AC», Then khối hiện nội dung thật và thẻ KHÔNG nổi cờ «Contract chưa có section Coverage»; và khi mục Coverage VẮNG HẲN thì cờ đó vẫn nổi nguyên văn như hôm nay — đo bằng hai hợp đồng do code sinh trong chính lượt chạy, một có bảng một vắng mục, cùng một lệnh `gate-card.js --extract`

## Coverage

Quét bằng `morphological-scan`, preset test-matrix. Ba trục, không gian Core = 24 ô.

| Trục | Giá trị |
|---|---|
| VẬT bị đọc | `review-findings.md` + `decisions.jsonl` · mục tiêu chí của `contract.md` |
| BÊN đọc | bash (`pre-merge-check.sh`, hai nhánh node/awk) · mjs (`khong-can-nguoi.mjs`) · thẻ (`gate-card.js`) · lint (`eval-coverage-lint.js`) · trang bằng chứng (`evidence-page.js`) |
| CHIỀU | xanh (vật lành) · đỏ (còn mục chờ người / tiêu chí dạng tiêu đề) · đọc-cũ (vắng khoá, vắng tệp) · fail-closed (vắng bộ đọc, vắng node) |

Ô Core có AC phủ: xanh+đỏ của vật thứ nhất ở bash+mjs (AC-1) · xanh+đỏ của vật thứ hai ở
cả bốn bên đọc (AC-7, AC-8, AC-13) · đọc-cũ (AC-5) · fail-closed cả hai hình dạng thiếu
(AC-3) · thẻ Cổng Bằng chứng (AC-10) · quan hệ hai bên viết-đọc (AC-14).

Ô Later, có tên: **hai nhánh của răng cross-layer** tách riêng thành AC-11 vì nhánh awk là
bản dựng thứ hai của cùng luật — đúng lớp lỗi vòng này đi đóng, nên không gộp.

Ô Core BỔ SUNG (nhập 13/09, sau khi một phiên khác đo được hình dạng thứ ba):
`## Coverage` viết bằng bảng/văn xuôi — cùng lớp «bên đọc của thẻ hẹp hơn vật»,
phủ bởi AC-15. Bán kính đo tại chỗ: **29 hợp đồng / 244 hợp đồng có mục Coverage**
đang bị thẻ báo «chưa có Coverage» OAN (kit 4 · artifact-platform và các nhánh của nó
21 · crm và khác 4).

Ô Never: `parseEvals` giữ nháy `id` (xem Out of scope).

[CE chưa kiểm chứng] — không có.

## Đường đo

Số dưới đây do `_acceptance/cong-nguoi-doc-du-nguon/do-ban-kinh.cjs` ĐỌC TỪ VẬT
(1243 hợp đồng và 740 tệp rà soát thật trên 22 kho của máy này), không phải hằng
gõ tay. Cột «lớp CŨ» là cùng script chạy với `--ag-root` trỏ bản dựng tại
`git merge-base HEAD origin/main` — đó là chiều đỏ của chính phép đo: số không
đổi theo lớp nghĩa là script đo VĂN chứ không đo VẬT.

| Trục | lớp CŨ | lớp MỚI | AC bảo đảm |
|---|---:|---:|---|
| Hợp đồng thẻ đọc THÊM được tiêu chí | 0 | **220** | AC-7, AC-8, AC-13 |
| Số tiêu chí đọc thêm | 0 | **1 490** | AC-7 |
| Hồi quy đọc thiếu | 0 | **0** | AC-13 |
| Mục Coverage bị báo thiếu OAN | 29 | **0** | AC-15 |
| Hồ sơ có lỗi TRONG hợp đồng mà thẻ GIẤU | 0 | **35** (69 mục) | AC-10 |
| Hồ sơ còn mục CHỜ NGƯỜI | 101 | 104 | AC-1, AC-4 |
| Hợp đồng SINH vi phạm xuyên lớp MỚI | 0 | **0** | AC-11 |
| Danh sách chép: mục khai / dùng bắc cầu | 13 / 9 | 14 / 10 | AC-12 |

Lệnh sinh bảng:

```
node _acceptance/cong-nguoi-doc-du-nguon/do-ban-kinh.cjs --truc tat-ca
node _acceptance/cong-nguoi-doc-du-nguon/do-ban-kinh.cjs --truc tat-ca --ag-root <cây tại merge-base>
```

Đọc hai con số quan trọng nhất:

- 220 / 1 490 là bán kính thật của bộ bóc tiêu chí, lớn hơn ước lượng 38 hồ sơ
  lúc trình Cổng Phạm vi: 38 là số hồ sơ thẻ hiện SỐ KHÔNG, còn 220 là số hồ sơ
  hiện THIẾU. Hồi quy 0 đo trên cùng tập.
- 35 hồ sơ (69 mục) mang lỗi TRONG hợp đồng mà thẻ chưa từng hiện, trong đó có
  hồ sơ mốc phát hành gần nhất của chính kit. Lúc trình cổng máy mới nêu được MỘT
  ca thật.

## Out of scope

- **`parseEvals` giữ nguyên dấu nháy trên `id`** (`lib/eval-yaml.cjs`). Vá đúng tầng đòi dời
  bộ tách token từ `evidence-core.cjs` xuống `eval-yaml.cjs` — hai tệp vendored, vừa sắp xếp
  lại ở 2.11.0. Bán kính đo được: **0 eval** trong 8 kho. Ngưỡng mở lại: ≥1 eval khai `id`
  bọc nháy ở bất kỳ kho nào.
- **Răng «đã nâng plugin mà chưa chép lớp CI»** — sống ở phía kho tiêu thụ, hợp đồng riêng.
- **Tool-kill đỏ giả** — cần tín hiệu cấu trúc từ harness, hợp đồng riêng; ba mốc liên tiếp
  đã ghi sổ.
- **Sửa 221 hợp đồng đã ký cho khớp khuôn mới** — KHÔNG làm và không được làm: hồ sơ đã ký
  là sử liệu. Bản vá làm bên ĐỌC rộng ra, không bắt bên viết đổi.
- **Đổi khuôn hợp đồng để cấm dạng tiêu đề** — ngược hướng: dạng tiêu đề là cách 214 hợp
  đồng đã ký đang viết, và nó dễ đọc hơn cho người.
- **Xử 4 hồ sơ còn mục chờ người mà bản vá phơi ra** — chúng cần chữ ký hoặc một dòng định
  đoạt của người, không phải một bản vá. Vòng này chỉ làm cho chúng hiện ra.

## Notes

- Ràng buộc trình tự ĐÃ GIẢI: vòng `cua-veto-sau-chu-ky` gộp `main` ở `99137c06` (PR #172)
  trước vòng này; nhánh này đã gộp `main` tại `2b49621c`, xung đột duy nhất là khoá executor
  trong `config.yaml` (giữ cả hai khối). Kiểm sau gộp: `xanh_sach_check` còn nguyên 55 dòng
  và ba chỗ gọi, nên điều kiện thứ bảy là dòng THÊM — DV5 chỉ-được-thêm không đòi mục
  `ALLOWED_REMOVALS` nào. Khối `CHU-KY-THAT` mới trong `lib/evidence-core.cjs` là TIỀN LỆ
  KHUÔN cho AC-2, không phải chỗ đụng.
- Lớp vendored ĐỔI: `lib/evidence-core.cjs`, `lib/ac-line.cjs`, `scripts/pre-merge-check.sh`,
  và một mục MỚI `lib/out-of-contract.cjs` (đổi tên từ `.js`). Ghi chú phát hành 2.12.0 phải
  mang cảnh báo này.
- Vị từ «mục chờ người» trừ đi số dòng `stage: "gate2"` là một phép ĐẾM, không phải phép
  ghép từng mục với từng định đoạt. Một dòng sổ gộp nhiều mục sẽ đếm thiếu. Chấp nhận vì
  lệch về phía MỜI KÝ, và vì ghép theo nhãn `Ngoài-<n>` là neo vào thứ tự render của thẻ —
  đúng lớp bất-biến-không-được-nằm-trong-hồ-sơ-đã-ký. Ngưỡng mở lại: ≥1 hồ sơ bị chặn oan.
