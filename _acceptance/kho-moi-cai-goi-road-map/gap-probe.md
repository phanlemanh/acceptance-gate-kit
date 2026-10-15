---
slug: kho-moi-cai-goi-road-map
at: 2026-10-15T08:20:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Sổ tính settings.local.json là phạm vi kho; câu trích ADR 0025 chỉ loại phạm vi người dùng, không quyết vế local — tệp riêng của một người, không commit; thiếu ca chồng settings.json true + local false | Một người cài road-map --scope local để thử, chạy acceptance-init, commit theo lời dặn — cả kho mang lộ trình đội chưa chọn, AC-1 ghim hành vi đó là đạt | Chỉ settings.json; thêm ca chồng vào AC-1 | fixed: dòng sổ mới thay d-…-2 (chỉ settings.json, local không tính, ca chồng vẫn bật); AC-1 bảy trạng thái + chiều đỏ «phạm vi local không được bật» |
| P1 | design, contract | Tệp lộ trình ghi trước khoá; đứt sau bước tệp thì mọi lần chạy lại gặp chính tệp mình ghi và thoát 2 mãi; AC-5 không phủ các điểm đứt | Ctrl-C sau bước tệp → chạy lại thoát 2 «tệp chiếm chỗ», chủ kho phải khai tay, --check đỏ | Ma trận điểm đứt k = 1..4, băm cây bằng lần chạy liền mạch; chiều đỏ thứ tự cũ | fixed: thứ tự khoá → miễn trừ → tệp → CI → trang, phép kiểm chiếm chỗ chạy một lần trước mọi lần ghi (dòng sổ thay d-…-5); AC-5 thêm KM-5-dut-1…4 + KM-5-do2 |
| P1 | contract, evals | Khoá bật viết tay road-map@acceptance-gate-kit trong ca, trong khi design rút tên từ marketplace.json — fixture theo khuôn bên đọc | Vật viết cứng tên; marketplace đổi name thì bước luôn in «chưa cài» mà E1/E9 vẫn xanh | Ca dựng khoá từ marketplace.json; mutant đổi name | fixed: AC-1/E1 rút tên từ .claude-plugin/marketplace.json; KM-1-do3 viết cứng tên trên bản sao marketplace đổi name phải FAIL |
| P1 | contract, evals | Lời hứa «bộ tự áp RM2 ghi được tệp» chỉ đo bằng dangChuan và tập khoá viết tay; hàng thêm ở KM-7 dựng tay | Bộ tự áp đòi một khoá gốc tệp khởi tạo thiếu → kho mới mất tự áp mà E2 vẫn xanh | Chạy chính --ap --write trên tệp khởi tạo; khoá rút từ khuôn | fixed: KM-7-tu-ap chạy lo-trinh.mjs --ap --write hai ngày trên tệp khởi tạo; E2 khoá gốc so với lo-trinh-template.json rút trong lượt; hàng KM-7 chép từ hang[0] của khuôn |
| P2 | design, contract | Ca không có khối risk_tiers: design không nói tạo khối; AC-3 đo chuỗi có mặt, không đo quan hệ tập đường được miễn trước/sau | t1_skip_globs mới đè tập cũ → PR tài liệu bị chặn ở kho không liên quan lộ trình, KM-3 vẫn xanh | Bộ đường mẫu viết sẵn, miễn(sau) = miễn(trước) ∪ {LO-TRINH.html} | fixed: design nói --append tạo khối khi vắng; AC-3/E3 đo quan hệ trên bộ đường mẫu ở cả ba kho, đối chứng tập trước khác rỗng |
