# Hạt giống — lệnh cập nhật plugin trong cây phụ nhắm bản ghi của gốc kho, báo «đã mới nhất» mà cây phụ vẫn cũ

**Ngày:** 2026-10-17 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** TRỪ (bớt bước chép tay sổ cài khi kho nhận kit).
Gốc: crm-onehub#413 (crm nhận 2.31.0; crm không có hồ sơ `_acceptance/` riêng cho lớp này — hạt giống mồ côi hợp lệ) · hồ sơ kit `_acceptance/kiem-ban-cai-sau-phat-hanh/` (lệnh kiểm bản cài).
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Số đo

KN31, 17/10, máy MacBook Pro, crm nhận 2.31.0 (crm-onehub#413):

- Trong một worktree phụ của crm, lệnh cập nhật plugin phạm vi dự án nhắm bản ghi của GỐC crm và báo «already at
  the latest version (2.31.0)». Bản ghi của chính cây phụ vẫn ở 2.26 / 2.30.
- 14 bản ghi cây phụ lệch im lặng. Phiên phải chép tay bốn trường (`installPath`, `version`, `gitCommitSha`,
  `lastUpdated`) vào sổ cài rồi mới xác nhận khớp bằng `kiem-ban-cai --may --ref v2.31.0`.
- Kết quả lần kiểm đó: ĐẠT 73; 188 dòng VÀNG ngoài crm, trong đó 61 bản ghi trỏ thư mục đã xoá.

## Gốc

Cùng lớp «"đã mới nhất" là nói dối»: bộ cài báo thành công trên một bản ghi KHÁC bản ghi người định nâng. Lệnh
kiểm bản cài (`scripts/kiem-ban-cai.mjs`, chế độ `--may`) đã thấy bản ghi cây phụ lệch — nhưng chỉ in `VÀNG may:`
«bản ghi còn số cũ (cây phụ chưa nâng)» (GUIDE §7.2), không chỉ lối sửa nào chạy được, và bản ghi trỏ thư mục đã
xoá lẫn vào cùng khối VÀNG. Người nhận kit đọc 188 dòng vàng mà không biết dòng nào cần làm gì.

## Đề xuất (chưa làm — meta đóng băng, mở ở mốc «Tinh chỉnh sau hai đợt thử» 05/11 khi owner gọi tên)

1. **Lối sửa đích danh:** với mỗi bản ghi cây phụ lệch số, `kiem-ban-cai --may` in lệnh sửa chạy được cho đúng
   bản ghi đó (đường dẫn cây phụ + bốn trường lấy từ bản ghi gốc đã khớp tag), thay câu chung «cây phụ chưa nâng».
2. **Tách bản ghi mồ côi:** bản ghi có `projectPath` không còn trên đĩa đi một khối riêng kèm bước dọn; không trộn
   với bản ghi lệch số.
3. **GUIDE nhận kit:** ghi rõ lệnh cập nhật plugin không phủ bản ghi của cây phụ; bước xác nhận sau cài là chạy
   `--may` và làm theo lối sửa nó in.
4. Chiều đỏ: sổ cài dựng bằng code có một bản ghi cây phụ lệch số và một bản ghi trỏ thư mục đã xoá → hai khối
   riêng, khối lệch có lệnh sửa; áp lệnh sửa rồi chạy lại → ĐẠT. Đối chứng dương: sổ khớp tag → không in khối nào.

**Người hưởng:** máy nhận kit (bỏ bước chép tay bốn trường cho từng cây phụ) và owner (dòng TỔNG KẾT đọc được
thay 188 dòng vàng).

**Kho không gặp sự cố này được gì, mất gì:** kho không dùng worktree phụ thì không có bản ghi cây phụ — đầu ra
không đổi. Mất: không có; lệnh vẫn chỉ đọc, lối sửa chỉ in ra.

## Ngưỡng mở thành ô

Owner gọi tên ở mốc 05/11, hoặc lần nhận kit kế tiếp ở bất kỳ kho nào lại phải chép tay sổ cài.

**Lần vấp thứ hai (25/10) — ngưỡng ĐỦ.** onehub-invest nhận 2.34.0: bản ghi theo worktree vẫn 2.33.1 sau khi nâng, và lời
khuyên «cài lại ở project <worktree>» mà `kiem-ban-cai` in ra không chạy được từ chính worktree. Xem `docs/plans/2026-10-26-hat-giong-muoi-loi-kit-tu-dot-cam-mau-onehub-invest.md` mục 8.
