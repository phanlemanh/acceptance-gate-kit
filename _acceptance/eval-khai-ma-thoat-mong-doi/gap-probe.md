---
slug: eval-khai-ma-thoat-mong-doi
at: 2026-09-09T15:02:54Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Phản biện context sạch — eval-khai-ma-thoat-mong-doi

Một phiên tươi, đọc đúng năm tệp (design · contract · evals · sổ quyết định ·
bài học xuyên feature từ `claim-scan`), không đọc mã nguồn, không thấy brainstorm.
Cả năm phát hiện được SỬA NGAY trong artifact — không mục nào đẩy sang Cổng 1.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals E8/E9 + contract AC-8/AC-9 | Hai ca đọc báo cáo tự dựng fixture theo khuôn BÊN ĐỌC; không ca nào round-trip lấy báo cáo do S4 thật sinh. Nặng gấp đôi vì AC-3 vừa thêm một dấu phân biệt mới vào đúng khối eval mà hai bộ đọc kia phải bóc. | S4 in khối eval kèm nhãn đạt-có-giới-hạn, lối-đi-khối bóc ra chuỗi rỗng. E8/E9 vẫn XANH vì fixture viết đúng khuôn regex bên đọc. Trên cây thật làn ghim lại ĐỎ «chưa khai» và L1 chặn chính báo cáo PASS S4 vừa sinh. | Đầu vào của E8/E9 phải là báo cáo THẬT do acceptance-verify.js sinh trong chính lượt chạy; cấm fixture viết tay. Chiều đỏ của lưới: đổi khuôn bên VIẾT mà bên đọc không đổi thì ĐỎ nêu «writer trôi khỏi reader». | fixed: AC-8 và AC-9 viết lại đòi round-trip rút-từ-writer-thật; E8/E9 đổi đầu vào và thêm chiều đỏ writer-trôi |
| P0 | design §5.2 + không AC nào | Design gọi tên vật «lời dặn trong prompt soạn báo cáo» phải nới, nhưng không AC và không eval nào chạm nó. | Cài xong hết, prompt vẫn giữ câu cấm; bên soạn tuân lời dặn, lại bỏ trường exit_code. Mười một chân XANH, hồ sơ được ký, vòng sau tái diễn đúng vết khong_do_duoc của crm — chính lý do hồ sơ này tồn tại. | AC mới đo HAI tầng: vật prompt đã nới đúng phạm vi, VÀ đầu ra thật của bên soạn mang dòng exit_code đúng tên trường. | fixed: thêm AC-12 và E12 với hai tầng đo, chiều đỏ «bịa tên trường» |
| P1 | evals E1 + contract AC-1 | Assert đo BẰNG GIÁ TRỊ trong khi lời hứa là QUAN HỆ «không bộ đọc nào tự đọc trường». Bản tiêm đọc thẳng trường vẫn cho đúng giá trị. | Bản tiêm đọc thẳng expected_exit trả 2, năm câu trả lời vẫn bằng nhau, chân E1 XANH ở chiều đỏ. Ca đối chứng âm không sống, nên lối đọc thứ sáu mọc tự do và bỏ qua ba luật fail-closed của AC-2. | Ma trận toàn phần 4 bộ đọc × 4 fixture, số assert bằng 16, ô «khai sai luật» đòi cả bốn cùng nổ; cộng ràng buộc tĩnh chỉ eval-yaml.cjs được khớp tên trường. | fixed: AC-1 viết lại thành ma trận cộng ràng buộc tĩnh; E1 đổi theo, chiều đỏ gọi tên tệp mọc lối đọc thứ sáu |
| P1 | contract Coverage trục B + evals | Ô «khai 0 TƯỜNG MINH» không có AC nào và không eval nào, dù trục B tuyên đủ 6 trên 6. Câu tổng kết còn đếm nhầm bốn hình dạng hỏng trong khi mục d là đối chứng dương. | Hồ sơ khai expected_exit 0 tường minh; bên cài phân biệt có-trường với vắng-trường nên tính là đã khai một giới hạn, sinh dòng Known limits, hồ sơ mất xanh-sạch và TĂNG lượt gọi người — đúng thứ Notes hứa là không tăng. | Fixture khai 0 tường minh phải cho kết quả bằng hệt fixture vắng trường ở cả bốn bộ đọc; chiều đỏ «khai 0 bị tính là giới hạn». Sửa câu Coverage thành ba hình dạng hỏng. | fixed: AC-1 mục c và AC-2 mục e phủ ô này; E1 và E2 thêm fixture; câu đếm ở Coverage sửa lại |
| P1 | evals E3/E5/E6/E10 | Bốn chân S4 đều bơm mã thoát vào sau khâu giải khoá; không chân nào để một lệnh thật thoát 2 đi trọn đường giải khoá rồi chạy rồi chuẩn hoá rồi so kỳ vọng. | Một khâu trên đường thật đổi mã trước phép so, hoặc khoá khai giải ra vỡ cú pháp và thoát 127 chứ không 2 — đã xảy ra thật ở vòng trước, cite d-20260909T111327Z-79726. Bốn chân vẫn XANH; người duyệt tin S4 đã chứng đầu-cuối. | Chân đầu-cuối riêng: khoá executor code-sinh trỏ lệnh thật exit 2, chạy không bơm sẵn, đòi đạt-có-giới-hạn cộng khối eval mang mã 2 cộng dòng Known limits; hai đối chứng exit 0 và exit 1. | fixed: thêm AC-13 và E13 chạy đường đầu-cuối thật, chiều đỏ «khoá khai giải ra không phải lệnh đã định» |

## Ghi chú

- Đầu vào thứ 5 (bài học xuyên feature) chạy được, exit 0, corpus có nội dung.
- Một phát hiện cite id nguyên văn của sổ quyết định vòng trước — đường đo việc
  dùng lại bài học đã sống.
- Không re-probe sau khi sửa (one-pass theo nghi thức); phần mã còn ba vòng S4.
