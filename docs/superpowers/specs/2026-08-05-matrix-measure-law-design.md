# matrix-measure-law — thiết kế (vòng 2 chương trình 80/20)

*2026-08-05 · **T2** (chạm SKILL feature-loop + acceptance-verify.js + tests —
không file nào trong t3_paths) · Nguồn: [chương trình 80/20](../../plans/2026-08-05-nang-cap-8020-graph-loop.md)
mục O2. Bài toán: baseline B4 — ≥13 round S4 trong 5 tuần bị đốt bởi LỚP lỗi
đo-lường (điểm-case thay ma trận, đo từ-vựng, thước không gắn vật), lần nào
cũng do NGƯỜI/REVIEW phát hiện muộn ở S4 thay vì bị luật chặn từ S1.*

## Cơ chế — cùng một danh sách hình dạng, hai điểm cắm

**Sáu hình dạng lỗi đo-lường** (chưng cất từ B4 + 4 hình dạng CLAUDE.md
"thước gắn vào vật" + xương 6-vòng "đo từ vựng thay quan hệ"):

1. Đo CHỈ DẪN thay vì ĐẦU RA (grep file hướng dẫn trong khi renderer không đọc key).
2. Fixture VIẾT TAY đúng khuôn bên đọc — không round-trip rút-từ-writer-đọc-bằng-reader.
3. Assert "chuỗi có mặt" trong khi lời hứa là QUAN HỆ giữa các giá trị.
4. Assertion âm-tính-một-mình: không đối chứng dương, không ghim thông điệp.
5. Tuyên quét LỚP nhưng chỉ có điểm-case — thiếu ma trận toàn phần viết-trước
   (số assert = số phần tử, mẫu P105).
6. Đường dẫn hardcode ROOT — đo checkout của tác giả thay vì cây đang kiểm.

**Điểm cắm 1 — gap-probe S1#7 (phòng trước khi code):** mở rộng ý (4)
cross-check của prompt critic bằng 4 câu hỏi lớp-đo-lường (ma trận
viết-trước? âm tính có đối chứng? fixture code-sinh/round-trip? từ-vựng hay
quan hệ?). Giữ nguyên đếm "đủ 7 ý" — mở rộng TRONG ý (4), không thêm ý mới
(CS7b ghim con số 7). Đồng bộ cùng-lớp sang codex SKILL (bước gap-probe của
nó).

**Điểm cắm 2 — review lens `measurement` S4 (bắt sau khi code):** REVIEWERS
của acceptance-verify.js thêm finder thứ 3 `{ key: 'measurement' }` — prompt
scoped vào test/eval trong diff, săn đúng 6 hình dạng trên, high-confidence
only. Danh sách hình dạng đặt MỘT CHỖ (const `MEASUREMENT_SHAPES` trong
script, prompt build từ đó) — test ghim từng phần tử + mutation từng phần tử.
Findings đi qua CÙNG đường refute → scope-triage như 2 finder cũ: không
đường tắt, không auto-fix, finder chết → `reviewIncomplete` như thường.

**Không nới:** 2 finder cũ giữ nguyên từng chữ prompt; mọi thay đổi
acceptance-verify là THÊM.

**Loại (Never):** lint tĩnh đo-ngữ-nghĩa — luật cú pháp không phân biệt được
ngữ nghĩa (bài học luat-cu-phap-khong-phu-phan-biet-ngu-nghia: cùng hình
dạng, ngược kết luận); chỗ của phán đoán ngữ nghĩa là LLM lens + critic.

## Dogfood + kích hoạt carry thật (quyết định vận hành)

S4 của CHÍNH vòng này chạy **script workflow NGUỒN** của repo (self-host —
config ghi chú #1: cổng chấm bằng mã đang sửa, không bằng plugin cache):
(a) lens `measurement` chạy ngay trên diff của chính nó — label
`review:measurement` đếm được trong transcript/run-log; (b) script nguồn đã
có invokedSha (1.22) → run-log round này mang `sha` → nếu có round fix, dòng
`carried_from_round` THẬT đầu tiên xuất hiện — đóng nốt điều kiện GO(b) của
O1. Grader vẫn là agent tươi; script chỉ điều phối.

## Ngưỡng sống/chết (DP-1 — khai trước)

- **GO:** (1) S4 vòng này có label `review:measurement` chạy thật; (2) 6
  hình dạng + 4 câu cross-check đều có mutation coverage (xoá 1 → test đỏ
  đích danh); (3) 2 finder cũ nguyên vẹn từng chữ (test so sánh).
- **Đo chương trình (O2, sau ship — không thuộc S4 vòng này):** 3 feature
  T2/T3 kế tiếp: 0 round REJECT vì lớp đo-lường, HOẶC gap-probe bắt từ S1.
  Lọt 1 round → chỉnh prompt MỘT lần rồi đo tiếp 2 feature; lọt nữa → xem
  lại cách đặt luật (khai trước trong charter, không sửa sau khi thấy số).
- **NO-GO:** phải sửa/xoá bất kỳ chữ nào của 2 finder cũ hay đường
  refute/triage để lens chạy → dừng, thiết kế lại.

## Out of scope

- Lint tĩnh đo-ngữ-nghĩa (Never — xem trên).
- Gold-set + judge `required_evidence[]` (vòng 3 chương trình).
- Sửa các test CŨ đang vi phạm 6 hình dạng — luật chỉ đo diff mới; nợ cũ xử
  theo từng feature chạm nó.
- Ngưỡng đếm/blocking mới ở pre-merge/hook (không chạm đường bằng chứng).
