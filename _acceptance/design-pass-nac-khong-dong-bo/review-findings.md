## Trong hợp đồng

- **Sổ phiên điền nửa vời bị báo nhầm là «hồ sơ đời trước»**
  file: `scripts/gate-card.js:283`
  severity: low
  AC: AC-10
  source: conventions

  Khuôn sổ phiên là `reaction: <id nấc lấy từ REACTION-LADDER> (<kênh đã
  dùng, vd ghim, thao-luan, sua-roi-luu>)` — hai chỗ trống trên MỘT dòng. Bộ
  đọc loại cả dòng khi thấy bất kỳ `<`/`>` nào, nên phiên điền đúng id nhưng
  quên phần kênh (`reaction: nac-1 (<kênh đã dùng…>)`) rơi vào nhánh
  `!dp.reaction` và thẻ in cho người: «Sổ phiên chưa khai nấc phản ứng (hồ sơ
  đời trước thang phản ứng)» — nói sai nguyên nhân, và giấu mất việc phiên MỚI
  vừa ghi hỏng. Cờ không chặn nên không phải lỗi cổng, nhưng vi phạm phép thử
  ngôn-ngữ-mặt-người: câu trình cho người duyệt phải đúng chuyện đang xảy ra.
  Nhánh «đời trước» thật (khoá vắng hẳn) phân biệt được bằng chính sự vắng mặt
  của dòng, không cần trộn với ca placeholder.

  Rationale: Đúng tình huống Given/Then của AC-10 phân biệt nhánh 'thiếu
  khoá' và nhánh 'giá trị lạ'; bộ dựng thẻ đang gộp nhầm một sổ phiên có giá
  trị (dù lỗi) vào nhánh thiếu khoá, trái với yêu cầu phân biệt và nêu tên
  của AC-10.

- **REACTION-DEFAULT-SITES là allowlist không có chiều đỏ ngoài danh sách — bản chép thứ ba lọt**
  file: `tests/plugins/design-pass-nac.test.mjs:488`
  severity: medium
  AC: AC-11
  source: bugs

  `checkDefaultSites()` chỉ lặp trên các dòng của bảng khai tay
  `REACTION-DEFAULT-SITES` (hiện 2 site) và so số bản chép ở TỪNG site đã
  liệt kê. Ba mutant m1/m2/m3 đều bẻ trong một site ĐÃ có tên, nên không
  mutant nào chứng minh phép đo biết đỏ với một site NGOÀI danh sách.

  AC-11 tuyên: «số site có mặt phải bằng đúng con số khai trong bảng
  (thêm/bớt một chỗ mà không sửa bảng cũng ĐỎ)». Vế «thêm một chỗ» không được
  giao. Đã chứng thực bằng cách nối nguyên văn câu chuẩn (rút từ mốc
  `REACTION-DEFAULT-SENTENCE`) vào skills/acceptance/SKILL.md rồi chạy:

      PASS: [DP11] moi site chua dung nguyen van cau chuan + 3 mutant do dung ve
      EXIT=0

  Tức là cây nguồn mọc thêm một bản chép thứ ba — đúng thứ AC-11 sinh ra để
  chặn («một cây nguồn cho câu nấc-mặc-định») — mà phép đo vẫn xanh. Đây là
  lớp «Allowlist phải có RED ngoài danh sách» đã ghi trong sổ lớp lỗi của
  kho.

  Lưu ý phân biệt: `rang-cau-chet.sh` quét TRỌN `skills/` + `feature-loop/`
  nên nó bắt được câu CHẾT mọc lại ở bất kỳ file nào; lỗ này chỉ nằm ở câu
  SỐNG (bản chép mới).

  Sửa: quét trọn `skills/**` + `feature-loop/**` (cùng glob thư mục mà
  `dem()` của răng câu-chết dùng) đếm tổng số bản chép, đối chiếu với tổng số
  khai trong bảng — file có bản chép mà không có tên trong bảng là ĐỎ; kèm
  một mutant tiêm bản chép vào file thứ ba.

  Rationale: Finding tự trích dẫn đúng vế của AC-11 ('số site có mặt phải
  bằng đúng con số khai trong bảng — thêm/bớt một chỗ mà không sửa bảng cũng
  ĐỎ') và chứng minh vế đó chưa được test giao.

- **Chân đối chứng dương của răng câu-chết tự tắt khi số khai không phải số nguyên sạch**
  file: `_acceptance/design-pass-nac-khong-dong-bo/rang-cau-chet.sh:55`
  severity: low
  AC: AC-12
  source: bugs

  Vòng lặp đọc từng kim bằng `while IFS='|' read -r kim so`, rồi:

      if [ "$b" -eq 0 ]; then ... elif [ "$b" -ne "$so" ]; then ... fi

  `set -e` KHÔNG áp cho lệnh nằm trong điều kiện của `if`/`elif`. Nên khi
  `$so` không phải số nguyên hợp lệ — dòng kim viết thiếu số (`<kim>|`),
  dính CR của file CRLF, hay lẫn ký tự — `[` thoát mã 2 kèm «integer
  expression expected» ra stderr, `elif` bị coi là SAI, `fails` không tăng,
  và script vẫn in `cau-chet OK ...` rồi exit 0. Đã chạy thử:

      bash: line 0: [: 1x: integer expression expected
      fails=0 (script survived)

  Vế «kim ở mốc đếm ĐÚNG số đã khai» — nửa đối chứng dương mà AC-12 dựng ra
  để chứng minh hàm đếm biết đếm — biến mất im lặng; chỉ còn vế `-eq 0`. Đúng
  hình dạng «đỏ hạ tầng đọc nhầm thành xanh vật» mà comment trong chính file
  này cảnh báo ở chỗ khác (`|| true` của `dem()`).

  Sửa: kiểm hình dạng trước khi so — ví dụ `case "$so" in ''|*[!0-9]*) echo
  "CHAN 1 DO: so khai khong phai so nguyen: \"$so\""; fails=$((fails+1));
  continue;; esac` (và trim CR khi đọc).

  Rationale: Đây chính là đối chứng dương mà AC-12 đòi hỏi ('kim nào ra 0 ở
  mốc là ĐỎ, không được lặng lẽ xanh'); phép đo bị tắt câm khi gặp input dị
  dạng, trái yêu cầu này.

- **Phép HOẶC làm chết vế «nac-3 phải có người gọi tên» ở thân skill (hình dạng 4)**
  file: `tests/plugins/design-pass-nac.test.mjs:89`
  severity: high
  AC: AC-2
  source: measurement

  `if (!/nac-3/.test(s) || !/(chỉ mở khi|có người gọi tên)/.test(s))` — hai
  lựa chọn của phép HOẶC đều CÒN TRONG VẬT (câu chuẩn viết «nac-3 (ngồi cùng)
  chỉ mở khi có người gọi tên nó.»), nên vế «có người gọi tên» không bao giờ
  có chiều đỏ: cụm «chỉ mở khi» một mình đã thoả. AC-2 hứa «sync là nấc phải
  có người gọi tên» và E2 khai riêng mutant m2/m4 cho thân skill, nhưng cả
  hai mutant đều xoá TRỌN mệnh đề nên không phân biệt được. Đã chứng: đổi câu
  chuẩn ở cả hai site thành «nac-3 (ngồi cùng) chỉ mở khi máy thấy cần.» —
  tức là xoá đúng điều khoản «phải có người gọi tên» khỏi thân skill — DP2
  vẫn PASS (DP11 cũng PASS vì nó rút `need` từ chính mốc neo đã bị đổi, nên
  hai bản chép vẫn khớp nhau). Vế duy nhất còn sống cho điều khoản này là
  `/gọi tên/i` trên frontmatter description, tức thân skill không được đo.

  Sửa: tách thành hai phép kiểm AND có thông điệp riêng (`chỉ mở khi` là
  điều kiện, `có người gọi tên` là chủ thể gọi), mỗi vế một mutant.

  Rationale: Finding tự trích dẫn 'AC-2 hứa sync là nấc phải có người gọi
  tên' và chứng minh cấu trúc HOẶC trong test khiến vế đó không có chiều đỏ
  độc lập.

- **Vế lõi AC-6 «không có đường bỏ im lặng» là blacklist hai cụm, chỉ bắt được chính mutant của nó (hình dạng 4)**
  file: `tests/plugins/design-pass-nac.test.mjs:163`
  severity: high
  AC: AC-6
  source: measurement

  `if (degradeRow && /không ghi gì|đi tiếp, không ghi/.test(degradeRow))
  errs.push('co nhanh bo im lang');` — hai cụm trong regex là ĐÚNG hai cụm mà
  mutant m-bo-im-lang (dòng 370–372) tiêm vào. Thước được viết vừa khít
  mutant, nên chiều đỏ là tautology: nó chứng minh nó bắt được câu do chính
  nó viết ra, không chứng minh nó bắt được «đường bỏ im lặng». Đã chứng: sửa
  hàng degrade thật ở skills/design-pass/SKILL.md dòng 316 thành «| Không mở
  bước phân kỳ | Ghi `divergence:` nếu tiện; bỏ qua cũng được, khỏi ghi. |» —
  một nhánh bỏ im lặng công khai, đúng thứ AC-6 cấm — DP6 vẫn PASS (khoá
  `divergence:` còn trong hàng nên hai vế kia cũng im). Đây chính là vế mà
  lượt đính chính vòng 1 tuyên đã cứu khỏi assert-chết (evals.yaml dòng
  119–124); nó vẫn chết, chỉ đổi hình dạng từ else-if sang blacklist.

  Sửa: đo QUAN HỆ dương — hàng phải khai từ vựng ĐÓNG (`skipped — <căn cứ>`)
  và không được có từ khoá tuỳ chọn (`nếu`, `cũng được`, `tuỳ`) — chứ không
  liệt kê cụm xấu.

  Rationale: Finding tự nêu tên AC-6 và chứng minh một vi phạm thật đúng thứ
  AC-6 cấm ('không có nhánh không ghi gì') vẫn PASS vì test chỉ khớp đúng hai
  cụm của chính mutant nó viết ra.

- **Vế «kit không phụ thuộc bộ dựng nào» chỉ quét MỘT mục trong khi lời hứa là cả skill (hình dạng 5)**
  file: `tests/plugins/design-pass-nac.test.mjs:183`
  severity: medium
  AC: AC-7
  source: measurement

  `const sec = section(skillText, DIVERGENCE) || skillText;` rồi
  `sec.match(/bắt buộc dùng\s+([^\s.,]+)/i)` — phạm vi quét bị thu về đúng
  mục «## 3b. Bước phân kỳ». E7 v2 (evals.yaml dòng 136) và AC-7 lại tuyên
  «skill KHÔNG nêu bộ dựng nào là bắt buộc» — phạm vi là cả file. Ca tiêm
  dương m-tiem-phu-thuoc (dòng 394) cũng tiêm vào bên trong chính mục 3b, nên
  nó chứng minh regex chạy, không chứng minh phạm vi quét đúng. Đã chứng:
  chèn câu «Bộ phương án: bắt buộc dùng canvas-preview cho mọi bề mặt.» vào
  mục «## 2. Nạp 2 nguồn luật» (dòng 76 của SKILL.md) — DP7 vẫn PASS. Nghĩa
  là một phụ thuộc bộ dựng đặt ở bất kỳ mục nào khác (Giai đoạn 0, mục 2, mục
  4, bảng Degrade) đều lọt.

  Sửa: quét toàn `skillText` (và cân nhắc cả feature-loop/ như răng câu-chết
  đang làm), giữ ca tiêm dương ở một mục KHÁC mục 3b để chân tiêm chứng được
  phạm vi.

  Rationale: Finding tự trích dẫn 'AC-7 lại tuyên skill KHÔNG nêu bộ dựng
  nào là bắt buộc' (phạm vi toàn file) và chứng minh phạm vi quét thực tế
  chỉ giới hạn một mục nhỏ, bỏ lọt phần lớn file.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người
quyết, máy không tự sửa.

<<<OOC-ITEM-TEMPLATE
- **Bảng ma trận mutant trong câu hỏi hội đồng E14 lệch với bảng hợp đồng ở đầu chính file**
  Người dùng thấy gì: Bảng số tham chiếu dùng để chấm điểm vòng đánh giá đang ghi số liệu cũ đã lỗi thời; nếu để nguyên, lần chấm kế tiếp có thể báo nhầm là có lỗi dù việc đã làm đúng, khiến người duyệt mất thời gian tra lại oan uổng.
  file: `_acceptance/design-pass-nac-khong-dong-bo/evals.yaml`
  severity: high
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Bằng chứng vòng 1 được commit CÙNG lượt với bản sửa chính vật nó đo**
  Người dùng thấy gì: Bản ghi kết quả kiểm tra của vòng trước đang mô tả một phiên bản công việc cũ hơn bản mới nhất đã sửa; nếu ai đó đọc và tin vào bản ghi đó để ra quyết định thì có thể đang dựa trên thông tin sai — cần chạy kiểm tra lại và ghi nhận đúng bản mới trước khi dùng để quyết định.
  file: `_acceptance/design-pass-nac-khong-dong-bo/evidence-report.md`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Từ vựng đóng mới (reaction/options/divergence + thang 4 nấc) không có mục nào trong CONTEXT.md**
  Người dùng thấy gì: Ba khái niệm mới mà tính năng này đưa vào chưa được thêm vào bảng thuật ngữ dùng chung của dự án; người viết tài liệu hoặc script ở các lần sau có thể không biết những từ này là chuẩn, hoặc vô tình dùng lại một từ đã bị loại bỏ.
  file: `CONTEXT.md`
  severity: medium
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Mệnh đề về khoá context: bị chèn lạc chỗ trong đoạn S1-D của feature-loop**
  Người dùng thấy gì: Một đoạn hướng dẫn quy trình bị đặt lộn chỗ, khiến hai điều kiện phát cảnh báo khác nhau bị mô tả dính vào nhau trong văn bản hướng dẫn; người đọc quy trình ở các lần sau dễ hiểu nhầm nguyên nhân thật của mỗi cảnh báo.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

<<<OOC-ITEM-TEMPLATE
- **Ma trận toàn phần ghim vào bảng số LỖI THỜI — thước E14 đo hợp đồng đã bị đính chính (hình dạng 5)**
  Người dùng thấy gì: Đây là cùng lỗi bảng số liệu lỗi thời: bảng dùng để chấm điểm chứa số cũ, có thể khiến việc đã làm đúng bị đánh giá nhầm là có lỗi trong lần chấm kế tiếp.
  file: `_acceptance/design-pass-nac-khong-dong-bo/evals.yaml`
  severity: high
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

⚠ Cụm ngoài vùng phủ: 4/11 lỗi rơi vào file không bộ đo nào phủ (_acceptance/design-pass-nac-khong-dong-bo/evals.yaml, _acceptance/design-pass-nac-khong-dong-bo/evidence-report.md, CONTEXT.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
