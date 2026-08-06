---
schema_version: 2
feature: "Trả răng cho năm phép đo đã bị ghi là mất răng — chúng phải phân biệt được bản đúng với bản hỏng, và có một chốt canh để lần sau không lặp lại"
slug: measure-teeth-cleanup
risk_tier: T2
surfaces: [cli]
status: implemented
approved_by: Manh Phan
approved_at: 2026-08-06T10:15:31Z
owner: phanlemanh@gmail.com
source: docs/superpowers/specs/2026-08-06-measure-teeth-cleanup-design.md
time_human_minutes:
  gate1: 15
  gate2:
---

# Acceptance contract — measure-teeth-cleanup

Bối cảnh: 66 mục known-limits trên toàn kho; 43/109 khối kiểm không có lần
chạy nào trên vật hỏng. Vòng này lấy đúng **năm** phép đo đã được ghi là
*không thể đỏ* — nợ nguy hiểm hơn nợ tính năng vì lưới trông xanh mà không bắt
được gì. Việc 2 của lộ trình sau chương trình 80/20.

## Bảng phép đo phải có răng — nguồn sự thật của chốt

Nằm ở `scripts/measures-need-teeth.tsv`, cạnh cây kiểm. Mỗi dòng: tên khối ·
**lệnh dựng vật hỏng** · **chuỗi thông điệp phải xuất hiện khi đỏ**. Chốt
KHÔNG grep dấu hiệu trong thân khối (đó chính là đo-hình-dạng-chuỗi, lớp lỗi
vòng này đi chữa) — nó **THI HÀNH từng dòng**: dựng bản sao, chạy đúng khối đó
trên bản nguyên vẹn (phải XANH), rồi trên vật hỏng (phải ĐỎ **và** chứa nguyên
văn chuỗi ở cột ba).

**Cơ chế & ngân sách (quyết tại Cổng 1, không để S3 tự phát hiện):** bộ chạy
kiểm nhận một biến lọc chạy-đúng-một-khối (khối khác bỏ qua) — mỗi dòng bảng
chỉ tốn vài giây thay vì ~40 giây/lượt suite trọn; với ~6 dòng, chốt thêm
dưới một phút. Chốt **bỏ qua chính nó** trong mọi lượt con (biến lồng đã có
sẵn của suite) — không tự thi hành mình, không đệ quy.

## Criteria

- AC-1: Given chốt gói Codex, When chỉ dẫn viết công cụ theo dạng KHÔNG có
  tiền tố (`` `scripts/x.mjs` ``, `node scripts/x.mjs`) hoặc tên file có gạch
  dưới/chữ hoa/đuôi khác, Then chốt vẫn thấy và vẫn phân loại — đo bằng số
  tham chiếu rút được ở gói `design-loop-codex` phải **> 0** (hiện tại 0 dù
  chỉ dẫn gọi 4 công cụ); và xoá một công cụ khỏi bản sao gói đó → ĐỎ đích
  danh. **Dạng không-tiền-tố cần nhóm phân loại THỨ BA — CONSUMER:** đo được
  19 lượt `node scripts/codex-plugin-runner.mjs` trong chỉ dẫn trỏ vào
  `scripts/` của REPO TIÊU THỤ (acceptance-init tạo file ở đó từ bản mẫu
  trong gói), không phải của gói — thiếu nhóm này thì mở rộng chốt tạo ngay
  19 con-trỏ-chết oan. Tên khai CONSUMER trong bảng; tên không-tiền-tố ngoài
  danh sách đó phải có file trong `scripts/` của gói, không thì ĐỎ.
- AC-2: Given ba ca fail-loud của công cụ mang-kết-quả, When phép đo kết luận,
  Then mỗi ca phải ghim ĐÚNG THÔNG ĐIỆP mong đợi, không chỉ mã thoát — công cụ
  dùng một mã cho ít nhất năm nhánh nên mã thoát không phân biệt được
  bắt-đúng-lỗi với nổ-vì-lý-do-khác.
- AC-3: Given bộ đọc tham số của công cụ, When cờ viết sai có kèm giá trị
  (`--delta_files a.js`), Then thông điệp nêu ĐÚNG cái cờ sai chứ không nêu
  giá trị đi sau nó; ca cũ (cờ sai không giá trị) vẫn nguyên hành vi.
- AC-4: Given corpus dựng bằng chính đường sinh, có tiêm ĐÚNG MỘT cụm mồ côi,
  When chạy chân "bảng phủ corpus", Then ĐỎ và nêu đích danh cụm đó — n=1
  chứng minh không còn dung sai dưới BẤT KỲ hình dạng nào (tỉ lệ, danh sách
  bỏ qua, cắt bớt), không đo bằng cách đọc mã tìm hằng số. Kèm mẫu số bắt
  buộc: số cụm chốt thực sự phân loại phải > 0 và bằng số cụm corpus khai —
  lệch là ĐỎ; corpus nguyên vẹn phải XANH trước.
- AC-5: Given bộ đếm thẻ render, When chạy chốt thẻ, Then assert ĐỦ BA SỐ
  trong cùng một lần: số thẻ đã thử dựng phải bằng số việc trong kho kiểm và
  **> 0** (thiếu mẫu số thì "0 hỏng" luôn đúng một cách vô nghĩa), số hỏng ==
  0, và ĐỎ nêu số hỏng khi khác. Đối chứng dương: bản nguyên vẹn XANH trước;
  ca tiêm lỗi giết đúng thẻ của một việc → ĐỎ nêu đúng số thẻ hỏng và tên
  việc; bước tiêm thất bại có thông điệp ĐỎ riêng.
- AC-6: Given hồ sơ do CHÍNH ĐƯỜNG GHI sinh ra trong lần chạy (có khối phán
  nhưng chưa có dòng người quyết), When đọc bằng chốt sổ vàng, Then bộ đếm
  khối phán > 0 trong khi số điểm vàng = 0 — chứng minh hai bộ đếm độc lập,
  bằng round-trip writer→reader chứ không bằng văn bản viết tay đúng khuôn
  bên đọc. Trên corpus THẬT chỉ đòi BẤT ĐẲNG THỨC cấu trúc: số khối phán ≥
  số điểm vàng, và in cả hai số vào bằng chứng — KHÔNG dùng "hai số bằng
  nhau" làm cờ đỏ, vì trên kho đã ký trọn (mọi khối phán đều có người quyết)
  hai số bằng nhau là hợp lệ; phép phân biệt nằm ở fixture round-trip, không
  ở corpus.
- AC-7: Given mỗi dòng của bảng, When chạy chốt, Then chốt THI HÀNH dòng đó:
  chạy khối trên bản nguyên vẹn (phải XANH), dựng vật hỏng theo lệnh ở cột
  hai, chạy lại (phải ĐỎ **và** chứa nguyên văn chuỗi ở cột ba); dựng vật
  hỏng thất bại → ĐỎ với thông điệp riêng, không bỏ qua. Và tập khối khai
  phải BẰNG ĐÚNG tập rút từ một NGUỒN ĐỘC LẬP với bảng (quét cây kiểm tìm
  khối có dựng bản sao) — thừa đỏ, thiếu đỏ; so-với-chính-mình là đẳng thức
  hằng đúng, không tính.
- AC-8: Given bản sao cây kiểm có một khối trong bảng bị gỡ đối chứng, When
  chạy chốt của AC-7, Then ĐỎ đích danh khối đó; đối chứng dương: bản nguyên
  vẹn XANH trước khi tin kết quả đỏ.
- AC-9: Given mọi dòng assert của cây kiểm tại mốc ĐỌC TỪ SỔ bị SỬA hoặc XOÁ
  trong vòng này, When chạy chốt, Then mỗi dòng đó phải có một entry
  `decisions.jsonl` phân loại **SIẾT** hay **NỚI**, ghi TRƯỚC khi sửa; có bất
  kỳ NỚI nào, hoặc có dòng sửa chưa được phân loại → ĐỎ. Không đòi "nguyên
  văn" — chính vòng này phải xoá phép so với hằng số dung sai (AC-4) và viết
  lại chân sanity (AC-6), nên luật nguyên-văn sẽ buộc thợ hoặc giữ thước hỏng
  hoặc thêm danh sách miễn trừ, cả hai đều là hạ thước. Số lệnh kiểm đọc từ
  cấu hình, mốc đọc từ sổ — không viết thẳng vào phép đo.

## Coverage

Từ morphological-scan (3 trục — thước CE trong ngoặc):

- **A — kiểu mất răng** (CE: 5 kiểu đếm từ chính known-limits đã ký [SP]):
  mù-với-hình-dạng AC-1 · chỉ-ghim-mã-thoát AC-2 · ngưỡng-dung-sai AC-4 ·
  đếm-rồi-vứt AC-5 · hằng-đúng AC-6
- **B — chứng minh đã có răng** (CE: nghi thức "phá vật thật trong bản sao"
  của kit): mỗi AC-1..AC-6 kèm một vật hỏng cụ thể và thông điệp ghim; AC-8
  là đối chứng cho chính chốt mới
- **C — chống tái phát** (CE: 109 khối kiểm, 43 không có đối chứng — chốt chỉ
  bao phần khai trong bảng, phần còn lại là nợ có tên): AC-7 (bảng ⇔ cây
  kiểm), AC-8 (chốt tự chứng minh biết đỏ), AC-9 (không nới thước cũ)

## Out of scope

- 60 mục known-limits còn lại của kho.
- Viết lại các khối kiểm không nằm trong bảng ghim.
- Đổi hành vi sản phẩm nào ngoài một dòng thông điệp lỗi (AC-3).
- Phát hiện tautology tự động — bài toán mở, không đuổi bằng luật cú pháp.
