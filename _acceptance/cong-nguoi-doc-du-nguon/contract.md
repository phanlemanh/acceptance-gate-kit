---
schema_version: 1
feature: Cổng người đọc đủ nguồn — luật xanh-sạch đọc cả làn rà soát, thẻ đọc được tiêu chí khai bằng tiêu đề, thẻ Cổng 2 hiện lỗi trong hợp đồng chưa sửa
slug: cong-nguoi-doc-du-nguon
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli, ci, docs]
status: implemented
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
**PHẠM VI ĐÃ CẮT — owner quyết 13/09 sau lượt chấm 4.**

Hồ sơ này khởi đầu với 15 tiêu chí, gồm hai nửa. Nửa CỔNG (điều kiện xanh-sạch
thứ bảy: AC-1…AC-6, AC-11, AC-12) đã CẮT KHỎI VÒNG. Nửa TRÌNH BÀY (AC-7…AC-10,
AC-13…AC-15) ở lại và là phạm vi thật của hồ sơ.

Căn cứ cắt, đọc từ bốn lượt chấm: 12 · 13 · 16 · 14 phát hiện, không hội tụ. Ba
lượt sửa liên tiếp đều đóng đúng thứ bị bắt rồi mở ra thứ MỚI CÙNG LỚP, và hai
phát hiện nặng nhất của lượt 4 là HỒI QUY do chính bản vá lượt 3. Nửa cổng sinh
fail-open ở MỌI lượt vì nó thay chữ ký người nên phải đúng tuyệt đối; nửa trình
bày sai thì thẻ hiện thừa hoặc thiếu, người vẫn đọc được.

Nửa cổng đi tiếp bằng một ô riêng, theo đường mà lượt chấm 2 đã chỉ: quyết định
ghi NGƯỢC vào từng mục của tệp rà soát, không đếm, không suy. Xem Out of scope.
## Criteria

- AC-7: Given một hợp đồng khai tiêu chí bằng tiêu đề (`### AC-n — nhãn`, thân ở các dòng sau), When gọi `parseACBlock` của `lib/ac-line.cjs`, Then nó trả đủ mọi id theo thứ tự xuất hiện, `gwt` của mỗi tiêu chí chứa chữ của nhãn VÀ của thân, và `judgment` / `crossLayer` tính theo đúng luật đang áp cho dòng gạch đầu dòng (nhãn đọc lỏng, thân chỉ nhận tag đúng chữ, tag trong code span không tính).
- AC-8: Given hợp đồng đặt tiêu chí dưới mục tên `Acceptance Criteria` hoặc `Acceptance criteria`, When bóc tiêu chí, Then kết quả bằng ĐÚNG kết quả khi mục tên `Criteria`; và khi không mục nào trong ba tên đó có mặt, bộ bóc quét cả tệp như hành vi hiện có.
- AC-9: Given một hợp đồng khai tiêu chí bằng tiêu đề mà bộ bóc chỉ ra được ít hơn số dòng trông-như-khai-báo, When chạy bộ dò điểm mù `acBlindSpot`, Then nó KÊU (trả khác null) và văn bản nêu số dòng bỏ sót; và trên hợp đồng LÀNH nó vẫn trả null (không kêu oan).
- AC-10: Given `review-findings.md` có mục `## Trong hợp đồng` với n > 0 phần tử, When render thẻ Cổng Bằng chứng, Then thẻ có khối riêng nêu đúng n mục ĐỨNG TRƯỚC khối «Ngoài hợp đồng», và thẻ KHÔNG phát ngôn nào khẳng định bằng chứng đã đầy đủ khi n > 0.
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

Số đọc từ VẬT: 1243 hợp đồng và 740 tệp rà soát thật trên 22 kho. Cột «lớp CŨ»
là cùng phép đo chạy với thư viện tại `git merge-base HEAD origin/main` — đó là
chiều đỏ của chính phép đo: số không đổi theo lớp nghĩa là đo VĂN, không đo VẬT.

| Trục | lớp CŨ | lớp MỚI | AC |
|---|---:|---:|---|
| Hợp đồng thẻ đọc THÊM được tiêu chí | 0 | 220 | AC-7, AC-8, AC-13 |
| Số tiêu chí đọc thêm | 0 | 1 490 | AC-7 |
| Hồi quy đọc thiếu | 0 | 0 | AC-13 |
| Mục Coverage bị báo thiếu OAN | 29 | 0 | AC-15 |
| Hồ sơ có lỗi TRONG hợp đồng mà thẻ GIẤU | 0 | 35 (69 mục) | AC-10 |

Hai dòng của nửa cổng («hồ sơ còn mục chờ người», «danh sách chép bắc cầu») đã
rút cùng phạm vi. Phép đo `do-ban-kinh.cjs` giữ nguyên năm trục vì nó là công cụ
đọc, không phải cổng; trục `findings` nay chỉ đếm, không kết luận.

## Out of scope

- **Điều kiện xanh-sạch THỨ BẢY (nửa cổng) — CẮT khỏi vòng, mở ô riêng.** Bốn
  lượt chấm không hội tụ; ba lượt sửa đều mở ra lỗi cùng lớp, hai lỗi nặng nhất
  của lượt 4 là hồi quy của lượt 3. Đường đi đã biết, do lượt chấm 2 chỉ ra:
  Cổng Bằng chứng ghi quyết định NGƯỢC vào từng mục của `review-findings.md`,
  bộ đọc đếm mục chưa có dòng ấy. Không đếm, không trừ, không suy từ sổ.
- **Phép đo bao đóng BẮC CẦU của danh sách chép CI.** Đo được ở vòng này rằng
  lưới quan hệ sẵn có (`CE2`) XANH trên một lớp thiếu tệp thật khi tên tệp không
  nằm trong thông điệp nào. Thuộc nửa cổng, rút cùng.
- **Sửa hợp đồng của hồ sơ ĐÃ KÝ để nối danh sách trắng.** Vòng này đã chạm hai
  lần rồi hoàn nguyên. Bảng `KHAC-BIET-DOC-CU` nằm trong một hợp đồng đã ký là
  đúng lớp «bất biến không được nằm trong hồ sơ đã ký»; đưa nó ra ngoài là việc
  của một vòng khác.
- **`parseEvals` giữ nháy trên `id`** — bán kính đo được 0 eval trên 8 kho.

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
- Vị từ «mục chờ người» KHÔNG trừ gì; mọi mục còn trong tệp rà soát đều tính là chờ
  người. Hệ quả đã khai: một hồ sơ đã được người định đoạt ở Cổng Bằng chứng mà chưa
  ký vẫn hiện «còn mục chờ người». Chấp nhận vì
  lệch về phía MỜI KÝ, và vì ghép theo nhãn `Ngoài-<n>` là neo vào thứ tự render của thẻ —
  đúng lớp bất-biến-không-được-nằm-trong-hồ-sơ-đã-ký. Ngưỡng mở lại: ≥1 hồ sơ bị chặn oan.
