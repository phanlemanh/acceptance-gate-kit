# Khoá model-invocation cho các thao tác cổng người; acceptance-card giữ mở

`approve`, `signoff`, `acceptance-init`, `acceptance-status`, `acceptance-report`
— và từ 1.30.0 thêm `start` (nghi thức vào phiên, thao tác thứ sáu) — chỉ được
con người gõ tên: Claude qua `disable-model-invocation: true` (commands/),
Codex qua `policy.allow_implicit_invocation: false` (agents/openai.yaml) —
biến ràng buộc prose "never approves on its own" thành ràng buộc cứng của
harness, nhất quán với triết lý không-tin-agent ở tầng evidence.
`acceptance-card` cố tình KHÔNG khoá: feature-loop (cả hai edition) và
approve/signoff model-invoke nó ở cả hai Gate — khoá là gãy loop. Test P31/P32
giữ cả hai chiều của quyết định này; danh sách LOCKED trong test là nguồn sự
thật máy-đọc, ADR này là căn cứ — hai bên phải cùng đổi trong một PR.

**Bổ sung 2026-10-15 (hồ sơ `ap-chinh-sach-lo-trinh`, CỘNG chủ kho duyệt đích danh ở Cổng Phạm vi):** gói `road-map` có ba
lệnh khoá model-invocation — `ghim`, `bo-ghim`, `tra-lai`. Đó là quyết của người lên lộ trình: miễn trừ một hàng khỏi tự áp,
hoặc phủ quyết một lần máy tự áp. Máy tự áp theo chính sách chủ kho đã chốt, nên lối đảo của nó phải là chữ của người, không
phải thứ máy tự gọi. `xem` giữ mở vì chỉ đọc. Danh sách `LOCKED_ROAD_MAP` của P32 giữ ba tên này; danh sách `LOCKED` bảy tên
của `acceptance-gate` không đổi (ca NO-AC11 của hồ sơ `nhan-trang-thai-va-reality` so nó với `CLAUDE.md`).
