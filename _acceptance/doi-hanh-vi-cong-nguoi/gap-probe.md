---
slug: doi-hanh-vi-cong-nguoi
at: 2026-08-14T05:22:50Z
verdict: findings
p0: 1
p1: 3
p2: 2
---

# Gap-probe: doi-hanh-vi-cong-nguoi

Critic context sạch (subagent tươi) chạy TRƯỚC Cổng 1, đọc đúng năm input —
`contract.md` + `evals.yaml` + `hoi-dong/` + đề bài 1c + bài học tuần đo
lường — cấm đọc mã nguồn (code của hồ sơ chưa tồn tại). Soi theo bảy rủi ro
đặc thù của hồ sơ hành-vi: mớm đáp án, đáp án mơ hồ, ba lớp đo giả, needle
chết, lời hứa không thước, giữ-gân rỗng, rò rỉ đáp án sang agent hành động.

Toàn bộ 6 finding định đoạt **one-pass, TRƯỚC Cổng 1** (sửa THƯỚC, không hạ
đáp án). Không re-probe. Một finding bác bằng bằng chứng, năm finding sửa.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals E2/E4/E6/E8 + hoi-dong/ | Ngăn cách đáp án khỏi agent hành động chỉ là LỜI DẶN — đáp án cùng thư mục đề ca, `question` in thẳng đường dẫn đáp án | Agent hành động có tool đọc file → một lệnh là thấy đáp án → transcript nhiễm, 4/4 judgment PASS oan trên đúng bộ đo BẮT BUỘC của hồ sơ | Kiểm agent có KHẢ NĂNG đọc đáp án không, không phải có bị dặn không | **fixed (pre-Gate-1):** giao thức chống rò rỉ vào đầu evals.yaml — agent hành động là phiên KHÔNG TOOL nhận nội dung NẠP THẲNG, không đường dẫn workspace nào trong prompt; đáp án dời sang `giam-khao/` (thư mục riêng, chỉ giám khảo nạp); đường dẫn đáp án rút khỏi mọi `question` |
| P1 | dap-an-E4 ca 3 · dap-an-E6 ca 3 | Điều kiện chấm tham chiếu lượt hội thoại KHÔNG tồn tại («owner vẫn giữ ý thì làm theo») — đề chỉ xin MỘT phản hồi | Vế «không cãi sau khi owner quyết» bất khả kiểm → nửa sau của chống-a-dua tự động PASS với mọi giám khảo | Đối chiếu đề ca (1 lượt) với cột ĐẠT/TRƯỢT (2 lượt) | **fixed (pre-Gate-1):** ca 3 của E4/E6 nâng thành ca HAI NHỊP — đề cấp sẵn lượt owner thứ hai, agent viết cả hai phản hồi; đáp án chấm đúng hai lượt CÓ THẬT trong transcript |
| P1 | evals E1b + contract | Tập so sánh TỰ THAM CHIẾU: manifest đọc từ chính file đang bị sửa, không bản ghim kỳ vọng | Thi công xoá một dòng site khỏi manifest → site biến khỏi tập đếm → «từng site đủ bản chép» vẫn xanh — đúng hình dạng tập-so-sánh-tự-loại-câu-chịu-lực đã cấm | Phá thử: xoá 1 site khỏi manifest bản sao, chân E1b phải đỏ | **fixed (pre-Gate-1):** thêm khối ghim `MANIFEST-KY-VONG-1C` vào contract (9 site, đủ số bản chép); E1b so BA chiều: manifest-sống ↔ bản-ghim ↔ bản-chép-thật |
| P1 | contract Notes + evals | Lời hứa «mỗi chân mới phá thử một lần» không có chỗ ghi bằng chứng — không `evidence_required` nào chứa vết phá-thử | Thi công bỏ qua phá-thử, mọi chân vẫn xanh — lặp đúng vùng-trắng «răng chỉ bảo đảm bằng kỷ luật người viết» của bài học tuần | Soi evidence_required các eval máy | **fixed (pre-Gate-1):** chiều-đỏ nâng từ kỷ-luật thành CẤU TRÚC — mỗi chân rang-1c.sh chạy kèm chiều-đỏ thật trong CÙNG lượt (bản sao code-sinh bị tiêm, mutant phải chạy được), vết in trong output; khai ở header evals.yaml + expected từng eval máy |
| P2 | evals E9–E9d vs contract | Bốn con số suite chép HAI BẢN (khối máy-đọc + văn expected) | Sửa khối SO-CA hợp lệ sau này → expected lỗi thời lặng lẽ, hai bên cho hai kết luận ngược — lớp «hai-bản-chép-trong-cùng-hồ-sơ» | So hai chỗ khai số sau một lần sửa khối | **fixed (pre-Gate-1):** expected của E9–E9d rút hết số, chỉ trỏ «khớp SO-CA-KY-VONG-1C của contract»; số sống MỘT chỗ |
| P2 | contract VAT-1C + BASE-1C | Nghi `asserts-da-go.txt` vắng trên mốc base → «cùng lệnh» chạy trên hai tập file khác nhau | grep trên base gặp file vắng → đối chứng dương đỏ oan hoặc script quen tay bỏ file | `git cat-file -e d6efd36:tests/plugins/asserts-da-go.txt` | **bác một nửa bằng bằng chứng, siết nửa còn lại:** file TỒN TẠI trên `d6efd36` (170 dòng) — tiền đề sai (critic bị cấm đọc nguồn nên không kiểm được, hợp lệ). Ý gốc vẫn đáng siết: phạm vi quét needle khai lại = VAT-1C **trừ `tests/**`** — chuỗi luật cũ trong assert suite là việc của chân E9e, gộp vào needle thì đối chứng và vật đo lẫn nhau |

## Ghi chú của phiên thi hành

Finding nặng nhất (P0) đúng nghề của hồ sơ này: bộ đo hành-vi đầu tiên của
kit suýt ra đời với một đường rò rỉ đáp án mà mọi lời dặn đều không bịt được
— chỉ cấu trúc (phiên không tool, nạp thẳng nội dung, đáp án ở cây khác) mới
bịt. Bốn eval judgment là điều kiện BẮT BUỘC trước Cổng Bằng chứng theo quyết
định Cổng 0, nên độ kín của chúng là độ tin của cả hồ sơ.

Lint W6 còn đúng một cảnh báo cố ý giữ: dòng «trên thẻ cổng» (AC-1) khớp
chuỗi con «thẻ» trong danh sách tránh của term Contract — nhưng «thẻ cổng» là
cụm chuẩn của chính CONTEXT.md (mục Mặt người); đổi chữ sẽ làm tiêu chí mơ
hồ hơn. Người duyệt xử tại Cổng 1.
