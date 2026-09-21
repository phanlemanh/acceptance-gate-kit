# Hạt giống — Hồ sơ `draft` không được nhảy thẳng sang `da-cham-boi-thuc-te`: hook tự xưng chặn mà không có mã

**Ngày:** 2026-09-21 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T2
(một vị từ chuyển trạng thái trong `lib/workspace-record.cjs` + một ca hai chiều).
Gốc: acceptance-gate-kit/_acceptance/nhan-trang-thai-va-reality — mục Ngoài-6/Ngoài-7 của
Cổng Bằng chứng 21/09 (owner ký, ghi Known limits); bằng chứng: review lượt 1 và 2 cùng nêu.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Lỗ

Vòng `nhan-trang-thai-va-reality` thêm trạng thái thứ bảy `da-cham-boi-thuc-te` (ADR 0020):
người ghi `build_sha · by · at`, máy nhận là cuối. Bên đọc (`workspace-record.cjs`, lưới
pre-merge + recheck) kiểm đủ vế và `build_sha` có trong kho — nhưng **không kiểm trạng thái
xuất phát**: một hồ sơ còn `draft` (chưa qua Cổng Phạm vi, chưa có hợp đồng duyệt) vẫn nhảy
thẳng sang «đã chấm bởi thực tế» được. Hook in câu «không bao giờ từ draft» — **lời tự xưng là
răng, không có mã chặn** — đúng lớp hiến pháp cấm (dặn-bằng-lời làm nghiệm).

Vì sao đáng ghi dù ngoài hợp đồng: trạng thái này **khoá mọi việc thước** trên hồ sơ. Một ô
chưa từng có hợp đồng mà khoá được là một đường né Cổng Phạm vi bằng một dòng ghi tay.

## Việc

1. Vị từ chuyển trạng thái MỘT nguồn: `da-cham-boi-thuc-te` chỉ hợp lệ từ `approved` trở đi
   (`approved · implemented · verified · signed-off · machine-cleared`); bên ghi (`observed.md`)
   và bên đọc (lưới) cùng rút từ bảng ấy.
2. Ca hai chiều: hồ sơ `draft` + dòng `thuc-te` hợp lệ → lưới VIOLATION có tên «từ draft»; hồ sơ
   `approved` + cùng dòng → OK. Gỡ vị từ trong bản sao → ca đỏ.
3. Xoá câu «không bao giờ từ draft» khỏi hook nếu hook không phải nơi giữ răng.

Ngưỡng mở ô: sau khi `crm` cài 2.18.0 (luật (b)), gộp vào ô nhỏ cùng Ngoài-1/5 (nhánh
«không tìm thấy lần lưu» chưa có ca đỏ) và Ngoài-8 (bộ đếm thước bỏ qua lặng khi tệp args hỏng)
— ba mục cùng một hình: nhánh phòng vệ không có chiều đỏ.
