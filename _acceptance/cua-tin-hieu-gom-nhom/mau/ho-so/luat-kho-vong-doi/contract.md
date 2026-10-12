---
schema_version: 1
feature: Luật thứ bảy «vong-doi» của scripts/luat-kho — máy bắt mô hình có hai cột cất, thủ tục list lẫn bản đã cất, và xoá vĩnh viễn không kiểm bản đã lưu trữ — và cả bộ luật kho chạy ở CI Acceptance
slug: luat-kho-vong-doi
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: []
status: signed-off
approved_by: Phan Le Manh
approved_at: 2026-10-09
design_doc: _acceptance/luat-kho-vong-doi/design.md
---

# Acceptance Contract: luat-kho-vong-doi

## Criteria

- AC-1: Given `packages/db/prisma/schema.prisma` có một mô hình mang cả hai cột `archivedAt` và `deletedAt`, When chạy
  thước, Then in `DO vong-doi: packages/db/prisma/schema.prisma:<dòng model> mo hinh <Tên> co hai cach cat` và thoát 1;
  mô hình chỉ có một trong hai cột thì không đỏ.
- AC-2: Given một phương thức của app Nest có tên bắt đầu bằng `list` gọi `.<mô hình>.findMany(` trên mô hình có
  `archivedAt` trong schema, When phương thức đó (hoặc một hàm `this.<tên>` cùng lớp mà nó gọi trực tiếp) không nhắc
  `archivedAt` hay `archivedFilter`, Then thước in `DO vong-doi: <tệp>:<dòng findMany> list lan ban da cat: <mô hình>` và
  thoát 1; có nhắc ở chính phương thức hoặc ở hàm `this.*` một bước (như `buildWhere` → `archivedFilter`) thì xanh.
- AC-3: Given `findMany` trên mô hình có `archivedAt` nằm trong phương thức KHÔNG tên `list*`, hoặc trên mô hình không có
  `archivedAt`, hoặc trong tệp kiểm (`test/`, `*.spec.ts`), hoặc ngoài app Nest, When chạy thước, Then không có dòng đỏ
  `vong-doi` cho lời gọi đó.
- AC-4: Given một phương thức của app Nest gọi `.<mô hình>.delete(` hay `.deleteMany(` trên mô hình có `archivedAt`, When
  phương thức đó và các hàm `this.*` cùng lớp nó gọi trực tiếp không nhắc `archivedAt`, Then thước in `DO vong-doi:
  <tệp>:<dòng> xoa vinh vien khong kiem da luu tru: <mô hình>` và thoát 1; kiểm ở chính phương thức hoặc qua một hàm phụ
  một bước (như `purgeDepartment` → `lyDoKhongXoa`) thì xanh.
- AC-5: Given cây onehub hiện tại, When chạy `node scripts/luat-kho/do-cay.mjs --du-luat`, Then dòng `vong-doi` báo XANH
  với nền đúng ba chỗ — hai của `AgentDefinition` (dòng model trong schema, lời `findMany` của `list` trong
  `agent-definitions.service.ts`) và lời `fieldDefinition.delete` của `FieldsService.delete` trong `fields.service.ts`
  (vi phạm thật thấy ở S3, ghi ở sổ quyết định) —, mỗi chỗ ghi trong `scripts/luat-kho/cau-hinh.mjs` theo tệp và chữ của dòng; dọn một
  chỗ khỏi mã thì thước in `NEN THUA vong-doi: …` cho chỗ đó.
- AC-6: Given thiếu `schema.prisma` hoặc không có app Nest, When chạy thước với `--du-luat`, Then in `KHONG DO DUOC: thieu
  luat: vong-doi` và thoát 2; không cờ thì in `KHONG AP DUNG: vong-doi — …` và sáu luật kia vẫn chạy.
- AC-7: Given mỗi lượt thước, When phần tự gài chạy trên bản gương tmpdir, Then có ca đỏ cho từng điều (AC-1, AC-2, AC-4)
  và ca đối chứng xanh cho từng lối thoát (một cột, `archivedFilter` qua hàm phụ, kiểm qua hàm phụ, phương thức không tên
  `list*`); một ca không bắt hoặc bắt nhầm thì thước thoát 2 «thuoc hong, khong tin duoc».
- AC-8: Given `.github/workflows/acceptance.yml`, When một PR vào `onehub` chạy CI, Then có một job cài phụ thuộc rồi chạy
  đúng lệnh `node scripts/luat-kho/do-cay.mjs --du-luat`; thước thoát khác 0 thì job đỏ.
- AC-9: Given cây onehub, When đo thời gian thước trước và sau khi thêm luật thứ bảy, Then lượt đầy đủ (gồm tự gài) dài
  thêm không quá 2 phút.
