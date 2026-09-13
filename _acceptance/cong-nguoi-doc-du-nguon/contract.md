---
schema_version: 1
feature: Cổng người đọc đủ nguồn — thẻ đọc được tiêu chí khai bằng tiêu đề, ba bên gọi cùng một bộ bóc, mục Coverage viết bằng bảng thôi bị báo thiếu oan
slug: cong-nguoi-doc-du-nguon
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli, ci, docs]
status: verified
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

**PHẠM VI CẮT HAI LẦN.** Hồ sơ khởi đầu với 15 tiêu chí.

*Nhát một (owner quyết 13/09, sau lượt chấm 4)* cắt nửa CỔNG — điều kiện xanh-sạch
thứ bảy, AC-1…AC-6 với AC-11, AC-12. Căn cứ: bốn lượt chấm cho 12 · 13 · 16 · 14
phát hiện, không hội tụ; ba lượt sửa liên tiếp đều đóng đúng thứ bị bắt rồi mở ra
thứ MỚI CÙNG LỚP. Nửa cổng sinh fail-open ở mọi lượt vì nó thay chữ ký người nên
phải đúng tuyệt đối.

*Nhát hai (owner quyết 13/09, sau lượt chấm 5, lối 1 của DỪNG-VÁ)* cắt thêm ba
thứ, mỗi thứ có số đi kèm:

- **Nhánh quét-cả-tệp của bộ bóc tiêu chí.** Lượt 5 đo được: hợp đồng không có mục
  tiêu chí thì thẻ Cổng Phạm vi hiện tiêu chí lấy từ mục «Known limits», cờ điểm-mù
  hoá im, và dòng một-chạm mở sẵn chữ duyệt. Hồi quy mở-cổng so với cây gốc, cùng
  lớp với hồi quy của lượt 4. Bán kính giữ lại và bỏ đi ở mục Đường đo.
- **AC-10 (khối «Lỗi TRONG hợp đồng» trên thẻ Cổng Bằng chứng).** Bên viết đặt
  `plain` rỗng cho đúng loại mục này theo thiết kế, bên đọc chỉ in `plain`. Đo trên
  740 tệp rà soát thật: 35 hồ sơ mang 69 mục in-contract, chỉ 4 mục có chữ cho người
  đọc — 94% số hàng sẽ là chỗ giữ. Khối chưa nuôi được mình. Mã đã gỡ, ô mở ở dưới.
- **AC-14 (khuôn mục rút từ bên VIẾT).** Nó phục vụ AC-10; rút cùng.

## Criteria

- AC-7: Given một hợp đồng khai tiêu chí bằng tiêu đề (`### AC-n — nhãn`, thân ở các dòng sau) TRONG một mục tiêu chí, When gọi `parseACBlock` của `lib/ac-line.cjs`, Then nó trả đủ mọi id theo thứ tự xuất hiện, `gwt` của mỗi tiêu chí chứa chữ của nhãn VÀ của thân, và `judgment` / `crossLayer` tính theo đúng luật đang áp cho dòng gạch đầu dòng (nhãn đọc lỏng, thân chỉ nhận tag đúng chữ, tag trong code span không tính).
- AC-8: Given hợp đồng đặt tiêu chí dưới mục tên `Acceptance Criteria` hoặc `Acceptance criteria`, When bóc tiêu chí, Then kết quả bằng ĐÚNG kết quả khi mục tên `Criteria`; và khi KHÔNG mục nào trong các tên đó có mặt, bộ bóc trả RỖNG — quét cả tệp để bóc là đường sinh tiêu chí ma, chỉ bộ ĐẾM của `acBlindSpot` được quét cả tệp.
- AC-9: Given một hợp đồng khai tiêu chí bằng tiêu đề mà bộ bóc chỉ ra được ít hơn số dòng trông-như-khai-báo, When chạy bộ dò điểm mù `acBlindSpot`, Then nó KÊU (trả khác null) và văn bản nêu số dòng bỏ sót; trên hợp đồng LÀNH nó vẫn trả null kể cả khi hợp đồng có dòng tham chiếu chéo viết dạng TIÊU ĐỀ (`AC_XREF` phải nới cân với `AC_SUSPECT`); và khi hợp đồng không có mục tiêu chí, bộ bóc ra rỗng thì bộ dò phải kêu `blank`, không được im.
- AC-13 (mọi bên gọi, không chỉ thẻ): Given cùng một hợp đồng khai n tiêu chí bằng tiêu đề, When chạy BA bên gọi — `scripts/gate-card.js`, `scripts/evidence-page.js`, `scripts/eval-coverage-lint.js` — Then mỗi bên nhìn thấy ĐÚNG n tiêu chí, và cùng nội dung viết bằng gạch đầu dòng cũng cho n ở cả ba; và hoàn nguyên ĐÚNG MỘT bên gọi về khuôn cũ phải làm ĐÚNG bên đó lệch trong khi hai bên kia không đổi — ba mũi tiêm độc lập, mỗi mũi một bên.
- AC-15 (hình dạng thứ ba của cùng lớp): Given một hợp đồng có mục `## Coverage` viết bằng BẢNG hoặc văn xuôi thay vì gạch đầu dòng, When thẻ Cổng Phạm vi dựng khối «Độ phủ AC», Then khối hiện nội dung thật và thẻ KHÔNG nổi cờ «Contract chưa có section Coverage»; và khi mục Coverage VẮNG HẲN thì cờ đó vẫn nổi nguyên văn như hôm nay — đo bằng hai hợp đồng do code sinh trong chính lượt chạy, một có bảng một vắng mục, cùng một lệnh `gate-card.js --extract`.

## Coverage

Quét bằng `morphological-scan`, preset test-matrix. Ba trục, không gian Core = 24 ô.

| Trục | Giá trị |
|---|---|
| VẬT bị đọc | mục tiêu chí của `contract.md` · mục `Coverage` của `contract.md` |
| BÊN đọc | bộ bóc (`lib/ac-line.cjs`) · thẻ (`gate-card.js`) · lint (`eval-coverage-lint.js`) · trang bằng chứng (`evidence-page.js`) |
| CHIỀU | xanh (vật lành) · đỏ (mũi tiêm hoàn nguyên đúng một đường) · rỗng-đúng (không có mục tiêu chí → bóc rỗng, cờ kêu) |

Ô Core có AC phủ: hình dạng khai báo ở bộ bóc (AC-7) · tên mục (AC-8) · bộ dò điểm
mù cả hai chiều kêu và không-kêu-oan (AC-9) · quan hệ ba bên gọi (AC-13) · hình dạng
mục Coverage (AC-15).

Ô Later, có tên: nhánh node của răng cross-layer trong `scripts/pre-merge-check.sh`
là bên gọi THỨ TƯ, chưa chuyển sang bộ bóc chung — xem Out of scope.

Bán kính của AC-15 đo tại chỗ: **29 hợp đồng / 244 hợp đồng có mục Coverage** đang bị
thẻ báo «chưa có Coverage» OAN (kit 4 · artifact-platform và các nhánh của nó 21 ·
crm và khác 4).

Ô Never: `parseEvals` giữ nháy `id` (xem Out of scope).

[CE chưa kiểm chứng] — không có.

## Đường đo

Số đọc từ VẬT: 1 243 hợp đồng và 740 tệp rà soát thật trên 22 kho. Cột «lớp CŨ» là
cùng phép đo chạy với thư viện tại `git merge-base HEAD origin/main` — đó là chiều đỏ
của chính phép đo: số không đổi theo lớp nghĩa là đo VĂN, không đo VẬT.

| Trục | lớp CŨ | lớp MỚI | AC |
|---|---:|---:|---|
| Hợp đồng thẻ đọc THÊM được tiêu chí | 0 | 139 | AC-7, AC-8, AC-13 |
| Số tiêu chí đọc thêm | 0 | 1 110 | AC-7 |
| Hồi quy đọc thiếu | 0 | 0 | AC-13 |
| Hợp đồng sinh tiêu chí MA | 0 | 0 | AC-8 |
| Cờ điểm-mù bị làm im | 0 | 0 | AC-9 |
| Mục Coverage bị báo thiếu OAN | 29 | 0 | AC-15 |

Hai dòng cuối là răng của nhát cắt lượt 5. Trên cây TRƯỚC nhát cắt chúng đọc 1 và
81 — tức bản trước vừa thêm 380 tiêu chí vừa tắt cờ ở 81 hồ sơ. Phép đo tách hai
nhánh là `do-nhat-cat.cjs` trong hồ sơ này; chạy nó với `--ag-root` trỏ vào một cây
chưa cắt phải trả lại 81 và 81.

Nhát cắt bỏ đi 81 hồ sơ với 380 tiêu chí. Trong 81 hồ sơ đó, 78 vốn ĐÃ có cờ đỏ ở
cây gốc, nên nhát cắt không sinh tiếng ồn mới — nó chỉ thôi bịa. Hợp đồng muốn được
đọc thì khai một mục tiêu chí; cờ `blank` nói đúng câu đó.

## Out of scope

- **Điều kiện xanh-sạch THỨ BẢY (nửa cổng) — CẮT khỏi vòng, mở ô riêng.** Bốn lượt
  chấm không hội tụ; ba lượt sửa đều mở ra lỗi cùng lớp, hai lỗi nặng nhất của lượt 4
  là hồi quy của lượt 3. Đường đi đã biết, do lượt chấm 2 chỉ ra: Cổng Bằng chứng ghi
  quyết định NGƯỢC vào từng mục của `review-findings.md`, bộ đọc đếm mục chưa có dòng
  ấy. Không đếm, không trừ, không suy từ sổ.
- **Khối «Lỗi TRONG hợp đồng» trên thẻ Cổng Bằng chứng (AC-10 cũ) — CẮT sau lượt 5.**
  Mã đã gỡ khỏi `scripts/gate-card.js`. Ô mở phải đi kèm bản vá bên VIẾT, không phải
  bên đọc: `TRIAGE_SCHEMA` trong `feature-loop/workflows/acceptance-verify.js` khai
  `plain` là «CHI khi inContract=false», và bước gộp ép `plain: null` cho mọi mục
  in-contract. Chừng nào bên viết còn thế thì mọi khối bên đọc đều in chỗ giữ. Số đo:
  740 tệp rà soát, 35 hồ sơ, 69 mục, 4 mục có chữ.
- **Khuôn mục rút từ bên VIẾT (AC-14 cũ)** — phục vụ AC-10, rút cùng. Ca `P55` sẵn có
  vẫn canh round-trip của khuôn `OOC-ITEM-TEMPLATE` cho mục «Ngoài hợp đồng».
- **Bên gọi THỨ TƯ: nhánh node của răng cross-layer trong `scripts/pre-merge-check.sh`.**
  Đo được ở lượt 5: tệp đó vẫn dùng `parseAC` với vòng lặp `section(t,"Criteria")` và
  `AC_LINE` đòi gạch đầu dòng, nên với hợp đồng khai bằng tiêu đề nó ra 0 tiêu chí,
  `xl_acs` rỗng và răng cross-layer bỏ qua toàn bộ — một cổng chặn tắt lặng lẽ. Không
  gộp vào vòng này vì tệp đó nằm dưới DV5 chỉ-được-thêm và cần bản vá riêng có răng
  riêng. AC-13 đã thu về BA bên gọi để lời khai khớp vật.
- **Phép đo bao đóng BẮC CẦU của danh sách chép CI.** Đo được ở vòng này rằng lưới
  quan hệ sẵn có (`CE2`) XANH trên một lớp thiếu tệp thật khi tên tệp không nằm trong
  thông điệp nào. Thuộc nửa cổng, rút cùng.
- **Sửa hợp đồng của hồ sơ ĐÃ KÝ để nối danh sách trắng.** Vòng này đã chạm hai lần
  rồi hoàn nguyên. Bảng `KHAC-BIET-DOC-CU` nằm trong một hợp đồng đã ký là đúng lớp
  «bất biến không được nằm trong hồ sơ đã ký»; đưa nó ra ngoài là việc của vòng khác.
- **Bộ đọc THỨ NĂM: `feature-loop/scripts/carry-plan.mjs`.** Owner quyết 13/09 mở ô
  riêng, KHÔNG gộp vào vòng này. `crossLayerACs()` giữ khuôn đọc tiêu chí riêng
  (`/^\s*[-*]\s*(AC-\d+)\s*[:.]/`, chỉ gạch đầu dòng) trong khi chú thích ngay trên
  nó khai «cùng ngữ nghĩa với parser chuẩn» — lời khai ấy nay sai. Hệ quả: luật
  atomic-pair tắt lặng với hợp đồng khai bằng tiêu đề.
  *Bán kính đo tay:* **9 trên 1 243 hợp đồng** (ap-media-roadmap 1 · artifact-platform
  1 · crm 4 · và các hồ sơ khác) có tiêu chí xuyên lớp mà thư viện thấy còn nó không.
  *Vì sao hoãn:* hành vi của tệp này KHÔNG đổi vì vòng này — với 9 hồ sơ ấy răng ghép
  đôi vốn đã tắt từ trước, vòng này chỉ làm chỗ lệch hiện ra. Và chuyển thêm một bộ
  đọc là NỚI, đúng loại thay đổi đã đẻ ba hồi quy liên tiếp.
- **`parseEvals` giữ nháy trên `id`** — bán kính đo được 0 eval trên 8 kho.

## Known limits

- **Khối mã trong thân tiêu chí chứa một dòng tiêu đề cấp h2..h6 vẫn cắt thân.**
  Luật đóng khối nay là MỘT nguồn với `lib/md-section.cjs`: h2..h6 đóng, h1 là nội
  dung. Nhờ đó chú thích shell `# …` trong khối mã thôi cắt thân — đó là hình dạng
  thường gặp. Nhưng một khối mã trích markdown có dòng `## …` thì vẫn đóng khối sớm,
  vì không bên duyệt nào theo dõi hàng rào ```. Không vá ở vòng này: theo dõi khối
  mã là logic MỚI, mà logic mới đúng là loại đã đẻ ba hồi quy liên tiếp ở vòng này
  (lượt 3→4, 4→5, 6→7).
  *Bán kính đo tay, 1 243 hợp đồng / 22 kho:* **0** — trong 35 hồ sơ khai tiêu chí
  bằng tiêu đề, không hồ sơ nào có khối mã chứa dòng h2..h6 trong thân tiêu chí.
  *Ngưỡng đang đếm:* ≥1 hợp đồng rơi vào hình dạng đó thì mở ô vá.

## Notes

- Ràng buộc trình tự ĐÃ GIẢI: vòng `cua-veto-sau-chu-ky` gộp `main` ở `99137c06` (PR #172)
  trước vòng này; nhánh này đã gộp `main` tại `2b49621c`, xung đột duy nhất là khoá executor
  trong `config.yaml` (giữ cả hai khối).
- **Lớp vendored ĐỔI: chỉ `lib/ac-line.cjs` và `lib/md-section.cjs`.** Hai nhát cắt đã
  trả `scripts/pre-merge-check.sh`, `lib/evidence-core.cjs` và `lib/out-of-contract.js`
  về nguyên trạng, nên danh sách chép CI (`INIT-CI-COPY-LIST` trong
  `commands/acceptance-init.md`) KHÔNG có mục mới. Ghi chú phát hành 2.12.0 viết theo
  dòng này, đừng viết theo bản trước của nó.
- **Năm phép đo đều có chiều đỏ, dựng bằng `banTiem` dùng chung.** Lượt chấm 5 đo được
  rằng năm trong bảy ca khi đó chỉ có assert dương trong khi `evals.yaml` khai từng mũi
  tiêm kèm thông điệp ghim. Ngoài ra đối chứng nền A/B của lượt 5 là `MODULE_NOT_FOUND`
  (tệp ca là tệp MỚI nên cây gốc không có nó) mà được ghi thành «đỏ = có phân biệt» —
  với hồ sơ có tệp ca mới, trường `baseline:` phải đọc là `n-a`, và chiều đỏ thật phải
  nằm TRONG thân ca.
