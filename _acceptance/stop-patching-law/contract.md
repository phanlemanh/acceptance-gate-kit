---
schema_version: 2
feature: "Vòng lặp biết tự nhận ra khi cách sửa sai khuôn — vòng thứ hai còn sinh lỗi cùng loại thì dừng và hỏi người, thay vì chạy tiếp vòng ba rồi hỏng cùng kiểu"
slug: stop-patching-law
risk_tier: T2
surfaces: [cli]
status: signed-off
owner: phanlemanh@gmail.com
approved_by: Manh Phan
source: docs/superpowers/specs/2026-08-07-stop-patching-law-design.md
time_human_minutes:
  gate1: 15
  gate2: 15
---

# Acceptance contract — stop-patching-law

Bối cảnh: ba vòng liên tiếp (card-text-fidelity 4 vòng · codex-script-packaging
4 vòng · measure-teeth-cleanup 3 vòng) cùng một hình dạng — lỗi mỗi vòng phần
lớn là lỗi MỚI do bản sửa vòng trước sinh ra, và lời giải cuối luôn là đổi
khuôn hoặc thu phạm vi. Dấu hiệu đã rõ từ cuối vòng hai trong cả ba, nhưng
không mệnh đề nào bảo dừng. Trần 3 vòng là cơ chế cứng, không phải chẩn đoán.

## Khuôn mệnh đề — một chỗ, có mốc

Mệnh đề sống giữa cặp mốc `STOP-PATCHING-CLAUSE` trong CẢ HAI bản chỉ dẫn.
Mọi phép đo (nội dung, vị trí, đột biến) tham chiếu ĐÚNG khối giữa hai mốc đó
— không phép đo nào được quét toàn tệp, vì rải chữ khắp nơi vẫn làm mọi biểu
thức trúng trong khi không tồn tại một mệnh đề mạch lạc nào.

## Bảng đột biến — `ca | bản áp dụng | cụm thông điệp phải chứa`

Ba cột, phân tách bằng `|`. Cột 2 ∈ {`claude`, `codex`, `cả hai`}; `cả hai`
sinh 2 ca. Tổng số ca = 2 + 7×2 = **16**. Đây là nguồn duy nhất — phép đo đọc
bảng này, không tự chép danh sách.

<!-- <<<STOP-PATCH-MUTANTS -->
- xoá-trọn-khối | claude | mệnh đề dừng-vá
- xoá-trọn-khối | codex | mệnh đề dừng-vá
- xoá-ý-so-lớp | cả hai | ý so lớp lỗi hai vòng
- xoá-ý-kết-luận | cả hai | ý khuôn giải sai
- xoá-ý-dừng | cả hai | ý dừng không tự dispatch
- xoá-ý-ba-đường | cả hai | ý trình người ba đường
- xoá-vế-khẳng-định | cả hai | định nghĩa cùng lớp
- xoá-vế-phủ-định | cả hai | không phải cùng dòng mã
- xoá-trần-ba-vòng | cả hai | trần 3 vòng
<!-- STOP-PATCH-MUTANTS>>> -->

## Criteria

- AC-1: Given khối giữa cặp mốc `STOP-PATCHING-CLAUSE` trong CẢ HAI bản chỉ
  dẫn, When đọc nội dung khối đó (chỉ khối đó), Then có đủ BỐN ý: (a) so lớp
  lỗi vòng này với vòng trước; (b) vòng sửa thứ hai còn lỗi CÙNG LỚP ⇒ khuôn
  giải sai; (c) DỪNG, không tự dispatch vòng ba; (d) trình người ba đường —
  đổi khuôn · thu phạm vi · ship với giới hạn đã biết. Mốc phải xuất hiện
  ĐÚNG MỘT lần mỗi bản (0 hoặc ≥2 lần → ĐỎ).
- AC-2: Given khối đó, When đọc định nghĩa "cùng lớp", Then có CẢ HAI vế: vế
  khẳng định (cùng TÊN LỚP LỖI, kèm ví dụ tên lớp) và vế phủ định (KHÔNG phải
  cùng dòng mã hay cùng phép đo); thiếu vế nào cũng ĐỎ nêu đích danh vế thiếu.
- AC-3: Given hai mệnh đề dừng (dừng-vá và trần-3-vòng), When đo vị trí, Then
  chúng phải nằm trong CÙNG một nhánh — đo bằng quan hệ chứa: tiêu đề bao
  ngoài gần nhất phía trên của hai mệnh đề phải BẰNG NHAU — và mốc mở của
  dừng-vá đứng TRƯỚC trần-3-vòng. Chỉ số ký tự nhỏ hơn KHÔNG đủ: đặt mệnh đề
  ở phần tổng quan đầu tệp cũng cho chỉ số nhỏ hơn trong khi agent đọc nhánh
  bị-trả-lại không bao giờ gặp nó. Đối chứng: bản sao dời khối ra khỏi nhánh
  (giữ nguyên thứ tự tệp) → ĐỎ.
- AC-4: Given bảng `STOP-PATCH-MUTANTS`, When chạy từng ca, Then mỗi ca ĐỎ và
  thông điệp chứa NGUYÊN VĂN cụm khai ở cột ba (không chấp nhận "thông điệp
  khác nhau" — hai chốt gộp thành vòng lặp vẫn cho thông điệp khác nhau ở số
  dòng trong khi khả năng phân biệt đã mất). Ca xoá-một-ý xoá đúng một ý bên
  trong khối, không xoá trọn khối. Đối chứng dương: bản nguyên vẹn XANH trước
  mỗi ca.
- AC-5: Given toàn bộ lưới hiện hành, When chạy sau thay đổi, Then xanh; gương
  gói và bản đồ sản phẩm khớp nguồn.
- AC-6: (judgment) Given một agent context sạch được cấp bản chỉ dẫn + biên
  bản hai vòng sửa mà lỗi vòng hai CÙNG LỚP với vòng một (biên bản do chính
  lần chạy sinh, không viết tay), When hỏi "bước kế tiếp là gì", Then agent
  đọc bản CÓ mệnh đề phải trả lời DỪNG và nêu ba đường; agent đọc bản ĐÃ XOÁ
  mệnh đề dispatch vòng ba. Đây là phép đo duy nhất phân biệt "mực đã in" với
  "vòng lặp đổi hành vi" — thiếu nó thì dòng `feature:` hứa hành vi trong khi
  cả lưới chỉ đo chữ có mặt.

## Coverage

Từ morphological-scan (3 trục — thước CE trong ngoặc):

- **A — nội dung mệnh đề** (CE: 4 ý + 2 vế định nghĩa, rút từ chính ba vòng đã
  trả giá [SP]): AC-1 (bốn ý, đo trong khối có mốc), AC-2 (hai vế)
- **B — vị trí và quan hệ với luật sẵn có** (CE: nhánh xử-lý-khi-bị-trả-lại có
  sẵn mệnh đề trần-3-vòng): AC-3 (cùng nhánh + đúng thứ tự), AC-4 (đột biến
  phân biệt được từng ý và từng mệnh đề), AC-5 (không phá lưới)
- **C — hiệu lực HÀNH VI, không chỉ mực in** (CE: 2 bản × 2 nhánh có/không
  mệnh đề = 4 lượt agent context sạch): AC-6

## Out of scope

- Chốt máy phát hiện "cùng lớp" tự động — đây đúng thứ vòng dọn nợ vừa kết
  luận là sai khuôn (chốt cưỡng chế cần chốt cho chính nó).
- Đổi trần 3 vòng.
- Sửa bất kỳ phép đo nào đang có.
