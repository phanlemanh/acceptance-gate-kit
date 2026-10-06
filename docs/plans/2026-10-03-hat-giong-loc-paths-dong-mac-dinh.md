# Hạt giống — bộ lọc `stale_scope: paths` phải đóng mặc định với dạng khai lạ

**Ngày:** 2026-10-03 · **Trạng thái:** ô `_acceptance/loc-paths-dong-mac-dinh/opportunity.md`
(`stage: discovery`, mở 06/10 khi ngưỡng chạm: crm bật khoá, crm-onehub#279) · chờ Cổng Đáng.
Gốc: acceptance-gate-kit/_acceptance/lan-ghim-lai-theo-paths/ — Ngoài-4 của lượt chấm 4 (mức cao),
owner định tuyến «mở hợp đồng mới» ở Cổng Bằng chứng 03/10.

## Hình dạng

`staleByPaths` (`lib/evidence-core.cjs`) dịch mỗi mục `paths` thành glob rồi so khớp; mục là tên
thư mục trần, không dấu sao (`apps/api/src/saved-views`), chỉ khớp đúng chuỗi ấy, nên mọi tệp BÊN
TRONG thư mục bị xếp «bỏ qua» và hồ sơ không hoá cũ. Tái hiện 03/10 trên tệp thật của crm
(`_acceptance/go-khoa-goc-nhin/evals.yaml`): `{apply: true, kept: [], skipped: [cả hai tệp]}`.
crm có ≈ 10 mục khai kiểu này.

Đây là lỗ thứ tư liên tiếp cùng một lớp qua bốn lượt chấm: lỗi node xoá trắng danh sách · tên tệp
có dấu · chú thích cuối dòng và dòng trống · thư mục trần. Cả bốn đều là bộ đọc chấp nhận một dạng
khai mà nó không chứng được là hiểu đúng, và đoán về phía «bỏ qua».

## Hướng nghiệm (chưa chọn)

Đảo chiều mặc định: bộ lọc chỉ được BỚT tệp khi MỌI mục `paths` của hồ sơ thuộc một danh sách dạng
đã chứng (đường dẫn tệp đầy đủ · glob có `*`/`**` ở đuôi · …); có một mục ngoài danh sách → lý do
`dang-khai-la:<mục>`, giữ luật cũ, in NOTE. Thư mục trần có thể vào danh sách dạng đã chứng (coi là
`<thư mục>/**`) nhưng chỉ sau khi đọc được rằng nó là thư mục ở cây đang kiểm. Gộp luôn hai bộ đọc
`paths` đang lệch nhau trong làn (Ngoài-1 cùng lượt) về một nguồn.

## Ngưỡng mở ô

Một kho tiêu thụ muốn bật `stale_scope: paths` (crm là ứng viên — chính hồ sơ gốc mở vì làn ghim lại
của crm). Tới lúc đó khoá giữ tắt, GUIDE §7.1 và CHANGELOG khai «chưa
bật».
