---
schema_version: 1
feature: Răng cho phép đo khối "👉 VIỆC CỦA ANH" — vá 3 lỗ của P188/P189 (cô-lập-lớp · sàn-đếm-nguồn · ranh-giới-câu)
slug: rang-phep-do-viec-cua-anh
owner: phanlemanh@gmail.com
risk_tier: T2      # đụng tests/plugins/run-tests.sh + manifest trong skills/acceptance/references/ — không khớp t1_skip_globs, không khớp t3_paths
surfaces: [cli]
status: draft
approved_by:
approved_at:
time_human_minutes: {gate1: 0, gate2: 0}
---

# Acceptance Contract: rang-phep-do-viec-cua-anh

## Context

Chip ②b của kit 2.1 — hồ sơ răng-cho-phép-đo mở ngay sau chip ② theo quyết
của owner ghi trong chính dòng chữ ký khoi-viec-cua-anh (11/08). Vòng chấm 3
của chip ② tìm ra 3 lỗ ở chính hai phép đo vừa sinh: P189 đo khuôn trên vùng
trùm cả GATE-INVITE-CLAUSE (clause chứa nguyên văn hai chuỗi neo của luật →
xoá gạch luật mà phép đo vẫn xanh — reviewer đã thực nghiệm); P188 chỉ so
"bản dựng ≥ nguồn" nên nguồn mất bản mà mirror mất theo (sau sync) vẫn xanh;
P188 mù với VỊ TRÍ thả clause — chèn giữa câu chủ vẫn xanh (đã xảy ra thật ở
overlay Codex, vật sửa ở 3caee05, phép đo thì chưa có răng). Hồ sơ này sửa
PHÉP ĐO thuần: renderer/template/clause và chỗ đặt clause trong các site
KHÔNG đổi một byte.

Source input: _acceptance/khoi-viec-cua-anh/review-findings.md (round 3, 3
finding gốc) + dòng chữ ký Cổng 2 chip ② («②b: mở ngay sau ②»).

## Criteria

- AC-1 (cô-lập-lớp — chiều luật): Given một bản đột biến của bản luật GIỮ
  nguyên khối `GATE-INVITE-CLAUSE` nhưng XOÁ khỏi phần "Luật đi kèm khuôn"
  gạch luật chỉ-báo («không cần làm gì») hoặc gạch luật cấm-câu-tu-từ, When
  chạy lại checker P189 thật trên bản đột biến, Then checker ĐỎ ghim đúng
  thông điệp thiếu-luật tương ứng, VÀ mỗi lượt đột biến in một dòng sanity
  QUAN HỆ chứng minh clause còn nguyên trong chính bản đột biến (rút được qua
  marker, anchor còn) — không có dòng sanity đó thì không phân biệt được với
  mutant replace-toàn-cục cũ vốn đã đỏ sẵn; hôm nay cả hai đột biến
  giữ-clause này XANH oan vì vùng đo trùm clause.
- AC-2 (cô-lập-lớp — chiều clause): Given một bản đột biến GIỮ đủ mọi gạch
  luật nhưng GỠ TRỌN khối `GATE-INVITE-CLAUSE`, When chạy lại checker P189,
  Then checker vẫn XANH và in xác nhận cô lập nêu rõ marker clause ĐÃ VẮNG
  trong bản đột biến — chứng minh vùng đo của P189 không còn ăn dữ liệu của
  lớp kia (canh clause là việc của P188, không phải của P189).
- AC-3 (sàn đếm nguồn): Given manifest `GATE-INVITE-SITES` khai kèm SỐ BẢN
  PHẢI CÓ cho từng site nguồn, và một bản sao dữ liệu trong đó một site nguồn
  bị gỡ 1 trong N bản clause ĐỒNG THỜI mọi bản dựng/overlay của nó mất theo
  (mô phỏng đúng cảnh gỡ-ở-nguồn-rồi-sync), When chạy P188, Then luật
  sàn-đếm-nguồn ĐỎ đích danh site nguồn đó — kèm sanity in ra: hai luật cũ
  (so-khớp-từng-lần + đếm bản-dựng-so-nguồn) đều IM trên chính đột biến này,
  chứng minh lỗ là thật chứ không phải luật cũ đã phủ.
- AC-4 (ranh-giới-câu): Given một bản sao trong đó clause bị chèn vào GIỮA
  một câu đang dở, When chạy P188, Then luật ranh-giới-câu ĐỎ đích danh
  file + vị trí. Luật ranh giới định nghĩa thao-tác-được: TRƯỚC mỗi lần xuất
  hiện, sau khi bỏ khoảng trắng cuối, ký tự chót phải thuộc bộ kết-câu
  `.:!?…` HOẶC vị trí là đầu-khối (đầu file / dòng liền trước là dòng TRẮNG)
  — clause nằm dòng riêng mà dòng trước là văn dở KHÔNG được tính đầu-khối;
  SAU mỗi lần xuất hiện, phần còn lại trên CÙNG dòng không được mở đầu bằng
  chữ thường. Chiều đỏ tái tạo ĐÍCH DANH layout pre-3caee05 (clause dòng
  riêng chen giữa hai nửa câu «…the verdict + hook» / «are unchanged.»);
  đối chứng dương: toàn bộ 10 lần xuất hiện thật ở 6 site nguồn + 5 bản suy
  ra hiện nay đều qua luật.
- AC-5 (đối chứng dương toàn cục + khai sinh phép đo): Given cây thật hiện
  tại, When chạy trọn suite plugins VÀ phép kiểm không-trôi-vật-thật so với
  BASE TƯỜNG MINH `origin/main` (diff name-only không chứa
  `scripts/gate-card.js`; khối `YOUR-MOVE-BLOCK-TEMPLATE` + câu clause rút
  qua marker từ bản origin/main phải byte-equal bản HEAD; chỗ đặt clause —
  số dòng từng lần xuất hiện trong 6 site nguồn — không đổi), Then suite
  exit 0, P188 + P189 XANH với dòng tổng kết mỗi case KÈM SỐ chiều đỏ đã
  chạy, mọi mutant in xác-nhận-đột-biến và đi qua chính checker thật
  (MEASURE-BIRTH: đối-chứng-dương + phá-vật-thật + thông-điệp-ghim, trên
  cùng fixture) — so với working tree trần (`git diff` không base) bị loại
  vì sau commit thi công nó luôn rỗng, chốt thành xanh chân không.
- AC-6 (mirror): Given manifest được thêm số đếm (chỉ trong khối HTML comment
  máy-đọc — không đổi byte nào của khuôn/clause/văn hiển thị), When chạy
  `sync-plugin-packages.sh --check` sau khi sync, Then mirror khớp nguồn
  (P30 xanh) và bản luật trong mirror mang cùng manifest.

## Coverage

Ma trận viết-trước 2 trục (lỗ-đã-khai × mục khai sinh phép đo). Trục lỗ: 3
finding round 3 — cô-lập-lớp (AC-1/AC-2, đủ CẢ HAI chiều tách lớp theo luật
mutant-phải-có-ca-cô-lập-lớp) · sàn-đếm-nguồn (AC-3) · ranh-giới-câu (AC-4).
Trục khai sinh: đối-chứng-dương (AC-2/AC-4/AC-5) · phá-vật-thật (AC-1/AC-3/
AC-4) · thông-điệp-ghim (AC-1/AC-3/AC-4 đều đòi ghim đích danh). Thước "đủ":
mỗi lỗ có ít nhất một chiều đỏ CHẠY THẬT + một đối chứng giữ-nguyên/chiều
ngược trên cùng fixture; không lỗ nào chỉ được che bằng lời khai tĩnh.

## Out of scope

- Finding thứ 4 của vòng chấm 3 (sáu khối bằng chứng E1–E6 của hồ sơ
  khoi-viec-cua-anh dán trùng một dòng PASS): hồ sơ đó đã ký và khép; không
  mở lại, không sửa evidence-report đã ký. (Nếp chung "chiều-đỏ-đã-chạy trong
  khuôn eval" đã nằm ở hàng đợi kit 2.1, không nhét vào chip này.)
- MỌI thay đổi vật thật: `scripts/gate-card.js`, nội dung khuôn
  `YOUR-MOVE-BLOCK-TEMPLATE`, nội dung câu `GATE-INVITE-CLAUSE`, chỗ đặt
  clause trong 6 site nguồn + bản dựng. Điều kiện đề bài: nếu sửa phép đo mà
  BUỘC phải đổi một trong các vật này → DỪNG, báo phiên B, không tự quyết.
- Không thêm phép đo mới ngoài 3 lỗ đã khai trong review-findings round 3
  (không quét thêm lớp, không mở case mới ngoài thân P188/P189).
- Không đổi 6 lệnh cổng người (ADR 0002).

## Notes

- Mobile backend target: n/a (kit CLI, không surface mobile).
- Quyết định thiết kế cần owner thấy ở Cổng 1: SỐ BẢN PHẢI CÓ của từng site
  nguồn sẽ khai NGAY TRONG manifest `GATE-INVITE-SITES` (mỗi dòng
  `<đường-dẫn> <số-bản>`), vì manifest là chỗ đã tuyên "phạm vi do người
  quyết, khai tay" — số bản là một phần của phạm vi đó. Phương án thay thế
  (ghim số trong run-tests.sh) bị loại vì tách đôi nguồn sự thật của cùng một
  phạm vi. Manifest nằm trong HTML comment nên KHÔNG đổi văn hiển thị của bản
  luật; P188 là reader duy nhất của marker này (đã grep toàn repo).
- PR này chạm `tests/plugins/run-tests.sh` + `skills/acceptance/references/`
  → stale-theo-diff (1.39.2) sẽ kéo hồ sơ cũ khai các path đó vào diện stale;
  đã tính sẵn giá một làn re-pin 1-làn-N-chữ-ký sau chữ ký (tiền lệ
  a4f4f89/99d1ea5).
