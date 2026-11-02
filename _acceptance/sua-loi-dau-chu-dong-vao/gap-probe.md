---
slug: sua-loi-dau-chu-dong-vao
at: 2026-11-02T22:31:24Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

# Gap probe: sua-loi-dau-chu-dong-vao

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | AC-4 và AC-5 không ghim quyền chủ khoá khi bộ giải mới làm `nha ghim-lai` với tới `khoa/s4` và `gop` tự nhả `khoa/merge`. | P2 chạy `nha ghim-lai` trong lúc P1 giữ `khoa/s4` → khoá của P1 bị xoá, hai lượt nặng chạy chồng; P1 gộp trong lúc `khoa/merge` đứng tên P2 → khoá của P2 bị nhả. | Ca đối chứng dãy khác trên cùng fixture, ghim mã thoát và thông điệp chủ khoá. | fixed: AC-4 thêm vế «khoá đứng tên dãy khác → thoát 1, nêu chủ, khoá còn» và SD-4 có ca ấy; vế gộp: `gop` vốn từ chối khi khoá merge không do dãy giữ (ca I-5 của gop.test.mjs) nên không thể gộp rồi nhả khoá người khác — bản vá chỉ nhả khi `chu.phien` là dãy gọi |
| P1 | design | Thu hồi theo «đã gộp» không phân biệt khoá cấp TRƯỚC lúc gộp (treo) với khoá cấp cố ý SAU lúc gộp (ghim lại hồ sơ đã gộp). | Hàng đã gộp, thợ `xin ghim-lai --slug` hồ sơ ấy; nhịp kế thu hồi giữa lượt, `can_phan` false nên không ai biết, đơn s4 kế chạy chồng. | Ca đối chứng: khoá cấp cho hồ sơ đã gộp từ nhịp trước → khoá còn. | fixed: chỉ thu hồi khi hồ sơ VỪA sang gộp ở nhịp này (chưa có trong sổ `gop_da_bao` của trang-thai.json) — tức khoá có trước lúc gộp; khoá cấp sau khi bộ phát lịch đã thấy gộp giữ nguyên. AC-6 và SD-6 thêm đối chứng ấy |
| P1 | evals | E3 đo chuỗi đường chờ trong stdout `xin`, không round-trip với thư mục mà bộ phát lịch thật tạo khi cấp đơn. | `xin` in `khoa/s4` nhưng bộ phát lịch cấp ở chỗ khác → thợ lại canh thư mục không bao giờ có, E3 vẫn xanh. | Cùng đợt thử: `xin ghim-lai`, chạy `motNhip`, đường rút từ stdout phải tồn tại và mang đúng phiên; trước nhịp thì vắng. | fixed: SD-3 thêm round-trip ấy làm chân chính; kiểm mẫu LUAT giữ làm phụ |
| P1 | evals | Vế «lượt đo không hỏng» của E6 là assertion âm tính một mình. | Fixture không dựng tệp lượt đo hoặc bản vá xoá tệp → «không mang thu-hoi» xanh rỗng. | Ghim giá trị `ket_thuc` mong đợi; đối chứng dương: khoá chưa gộp hết hạn + nhịp cũ → lượt đo MANG `thu-hoi`. | fixed: SD-6 ghim dòng sổ đo `ket_thuc: nha` và thêm đối chứng hết-hạn-thuê ghi `ket_thuc: thu-hoi` trên cùng fixture |
| P2 | evals | Hai seam viết → đọc đo bằng fixture viết tay: E8 tự đặt `devServerUrl`, E2 đọc bản tiep do ca dựng. | `s4-args` ghi trường khác tên chỗ workflow đọc; bên ghi tiep không chép `sau_khong_co` → hai ca vẫn xanh mà người chấm và thợ vẫn mù. | UT-2 lấy giá trị từ args.json do `s4-args` thật sinh trong lượt; SD-2 đi qua bên ghi `tiep/<dãy>.json` thật. | fixed: UT-2 sinh args bằng s4-args thật trên kho thử rồi đưa trường ấy vào harness; SD-2 chạy `motNhip` thật rồi đọc `tiep/P1.json` bằng `hangKeTuTiep` |
