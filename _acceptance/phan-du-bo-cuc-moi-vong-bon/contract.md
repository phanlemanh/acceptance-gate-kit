---
schema_version: 1
feature: 57 khoá bộ kiểm còn thiếu ở cây đã dọn nhà (K4-MP 43 · K4-TB 6 · K4-DN 4 · CT-10-do/KM-1 4) đạt ở cả bố cục hôm nay lẫn plugins/<tên>/
slug: phan-du-bo-cuc-moi-vong-bon
owner: phanlemanh@gmail.com
risk_tier: T2               # chỉ tests/ và hồ sơ của chính vòng — không chạm t3_paths
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-11-17-phan-du-bo-cuc-moi-vong-bon-design.md
status: signed-off
approved_by: Phan Le Manh
approved_at: 2026-11-17T03:16:59Z
---

# Acceptance Contract: phan-du-bo-cuc-moi-vong-bon

## Context

Gốc: kit/_acceptance/phan-du-bo-cuc-moi-vong-ba/ — vòng ba để K4-DN ngoài vòng; lượt đo của B2 sau #506 còn thiếu khoá ở
K4-MP, K4-TB. Cổng Đáng 17/11: «Mở vòng bốn» (`opportunity.md`) cho 53 khoá; bốn khoá CT-10-do/KM-1 vào sau theo lời chủ
kho gõ ở phiên B2 (Hỏi-5).

Thuật ngữ:
- **bố cục cũ** = cây kho này như hôm nay. **kho mới** = kho dựng từ HEAD bằng `khoMoi` của thước vòng hai (bước 1–3 + luật
  đổi tên trên `tests/` + luật chung bước 6, bỏ qua tệp tự đúng đường của vòng hai và vòng ba), là commit CON của HEAD.
- **bản gốc merge-base** = commit mà `git merge-base HEAD origin/main` trả về trong bản sao. Thước đặt nó ở hai chỗ:
  **MOC_CU** = `909dffd8` (ảnh kit trước #503 — đúng chỗ bản sao đo của B2 đang trỏ) và **nguồn** = chính HEAD.
- **khoá đích** = dòng của `khoa-dich.tsv` của hồ sơ (57 dòng, chép từ lượt đo 17/11 của B2). **túi khoá** = đa tập tên ca
  một tệp kiểm in đạt.
- **luật B2** = `doiKhoa` + `tuiCu` + `soTui` (bản chép nguyên ở `_acceptance/phan-du-bo-cuc-moi/rang/tui-khoa.mjs`).
- **GOC_VONG** = `3341b8dc` (đỉnh nhánh chính lúc mở vòng). **thước** = `rang/giu-khoa-4.mjs` của hồ sơ.
- **qua lần dọn nhà** = bản gốc merge-base còn phẳng mà cây đang đứng đã ở bố cục mới.
- **tệp vòng khai** = danh sách đóng `TEP_VONG` trong thước: các tệp dưới `tests/` mà vòng sửa.

## Criteria

- AC-1: Given kho mới với bản gốc merge-base ở MOC_CU và ở nguồn, When chạy `khoi-khuon-tren-the-cong.test.mjs` và
  `khuon-loi.test.mjs`, Then sáu khoá đích K4-TB có mặt và xanh ở cả hai chỗ đặt bản gốc và luật B2 báo thiếu 0 trên hai
  tệp; bản GOC_VONG của mỗi tệp đặt vào cùng kho mới với bản gốc MOC_CU đỏ đúng câu «thẻ đổi khi kho không khai bản đồ»
  (KK-6) và «khác bản trước vòng» (KL-8).
- AC-2: Given kho mới (qua lần dọn nhà, cả dòng `road-map@` lẫn dòng chú thích đã đổi chữ), When chạy
  `additive-only.test.mjs`, Then hai khoá đích của DV5 có mặt và xanh, luật B2 báo thiếu 0; bản GOC_VONG của tệp ở cùng
  kho mới đỏ «additive-only: existing rule line removed/modified». Và ở MỌI bố cục năm ca canh danh sách miễn xanh: cờ
  «qua lần dọn nhà» do MỘT hàm tính từ bố cục của bản gốc và của cây, ma trận ba ô viết trước {gốc phẳng · cây phẳng →
  tắt; gốc phẳng · cây mới → bật; gốc mới · cây mới → tắt} trên hai cây do mã sinh (`DV5q-co`, ba khẳng định); với cờ
  TÍNH từ ô «phẳng · mới», đổi đúng các dòng của `DON_NHA_DOI` → phép đo rỗng (`DV5q-im`); với cờ TÍNH từ ô «phẳng ·
  phẳng», cùng văn bản → đỏ đích danh từng dòng (`DV5q-do`); qua lần dọn nhà một dòng luật ngoài danh sách vẫn đỏ đúng
  dòng ấy (`DV5q-ngoai`); mỗi mục khớp đúng một dòng của bản gốc phẳng (`DV5qu`).
- AC-3: Given kho mới, When chạy `can-cu-s1.ca.mjs`, Then hai khoá đích của «KK-6 so-that» có mặt và xanh, luật B2 báo
  thiếu 0; ở cây đã dọn nhà ca dựng thẻ bằng MÃ của cây đang kiểm với `--root` là bản bung của cây phẳng lịch sử
  (`chaDonNha`) và in dòng «gốc đọc sổ: cây phẳng lịch sử <sha>» với sha = cha commit dọn nhà; ở cây phẳng `--root` là
  chính cây đang đứng và dòng ấy ghi «cây đang đứng»; phá mã thẻ CỦA CÂY ĐANG KIỂM trong kho mới (bỏ một dòng máy đã
  quyết khỏi đầu ra) làm «KK-6 so-that» đỏ «thiếu dòng trên thẻ» — mã được đo là mã đang kiểm, không phải mã trong bản
  bung; bản GOC_VONG của tệp ở cùng kho mới đỏ «thiếu dòng trên thẻ».
- AC-4: Given túi khoá của `bo-cuc.test.mjs` đo trong cùng lần chạy ở bố cục cũ và ở kho mới, When so, Then hai túi thô
  bằng nhau từng tên và từng số lần; luật B2 hiện tại báo thiếu ĐÚNG tập khoá đích K4-MP (43, cùng tên, cùng số lần);
  luật đề nghị `rang/tui-cu-suc-chua.mjs` báo thiếu 0 trên cùng hai túi; đối chứng dương trên túi thật: xoá khỏi túi kho
  mới một ca tên dạng phẳng và một ca tên dạng `plugins/…` thì luật đề nghị báo thiếu đúng tên ấy (hai khẳng định); và
  trên túi thật của mọi tệp vòng khai, hai luật chỉ lệch nhau đúng 43 khoá K4-MP, với cả ba hình có mặt ít nhất một lần
  (khoá không đổi tên · khoá đổi tên thường · khoá đổi tên chỉ còn tên nguyên chữ ở kho mới).
- AC-5: Given bố cục cũ, When chạy mọi khoá `feature_loop.suite_keys` và `--cu` của thước, Then mọi suite thoát 0 và túi
  khoá của mỗi tệp vòng khai ở HEAD chứa trọn túi khoá ở GOC_VONG — không ca nào mất tên hay rời túi; tự phá CU-DO (xoá
  một ca trên bản sao HEAD) đi qua cùng hàm so và đỏ «mất khoá».
- AC-6: Given HEAD bất kỳ của vòng (kể cả sau commit chữ ký, sau khi gộp nhánh chính vào nhánh, và sau khi vòng đã gộp),
  When chạy `--tinh`, Then trong vài giây và trước mọi phép đo dài: mỗi tệp vòng khai nằm trong khối tự đúng đường của
  vòng hai ∪ vòng ba; khi HEAD còn là nhánh riêng (merge-base với `origin/main` khác HEAD) thì tập tệp dưới `tests/` mà
  CHÍNH nhánh đổi (`git diff <merge-base>..HEAD`, không tính thứ đến từ nhánh chính) bằng đúng tệp vòng khai — trong đó
  `tests/scripts/fixtures/routing-baseline.txt` chỉ được bỏ qua khi mọi dòng đổi là dòng THÊM mở đầu bằng slug của vòng;
  khi HEAD đã nằm trên nhánh chính thì phép so ấy in «TIN» và không chấm; mỗi khoá đích có tệp nguồn ở HEAD; `gui-b2.md`
  đủ bốn mục; bộ tự kiểm của thước xanh; lệch → «FAIL: TINH …», thoát 1, mọi chế độ khác dừng trước khi chạy tệp nào.
- AC-7: Given kho mới, When chạy `kho-moi-cai-goi-road-map.test.mjs` và `cua-tin-hieu-giua-chien-dich.test.mjs`, Then bốn
  khoá đích (KM-1, CT-10-do và hai khoá cấp tệp) có mặt và xanh, luật B2 báo thiếu 0 trên hai tệp; bản GOC_VONG của mỗi
  tệp ở cùng kho mới đỏ đúng câu («thiếu dòng «kho chưa cài road-map» ở KM-1; «Cannot find module» ở CT-10-do).

## Coverage

Quét ba trục (skill morphological-scan, preset test-matrix, làm tại chỗ):

- Trục nhóm khoá: K4-TB (KK-6 · KL-8) · DV5 · KK-6 so-that · K4-MP · CT-10-do/KM-1 [thước CE: `khoa-dich.tsv`,
  6 + 2 + 2 + 43 + 4 = 57 của B2].
- Trục bản gốc merge-base của kho mới: MOC_CU (trước #503) · nguồn (phẳng, sau #503) · chính cây mới (sau ngày cắt sang)
  [thước CE: bản sao `32a5506f` với `origin/main` = `909dffd8` rồi `3341b8dc` — design §2].
- Trục bố cục cây đang đứng: phẳng · đã dọn nhà [thước CE: lượt đo B2 17/11, hai cây].

Ô có nghĩa → tiêu chí: K4-TB × {MOC_CU, nguồn} × mới → AC-1 · DV5 × qua dọn nhà → AC-2 · DV5 × {gốc phẳng · cây phẳng,
gốc mới · cây mới} (danh sách miễn không áp) → AC-2 (`DV5q-co`, `DV5q-do`) · so-that × {phẳng, mới} → AC-3 · K4-MP ×
{phẳng, mới} → AC-4 · mọi nhóm × phẳng → AC-5 · ghép nối B2 + nghi thức ký → AC-6 · CT-10-do/KM-1 × mới → AC-7.

Ô không thành tiêu chí: K4-TB × «chính cây mới» và so-that × bản gốc (ca so cây với chính nó / không dùng bản gốc) —
không có gì để đo.

Later: bộ xếp căn cứ đọc được đường phẳng cũ ở kho mới (45 dòng sổ, design §2). Never: nhóm «Ngoài-11».

## Đường đo

- SỐNG — lượt giữ khoá kế của B2 thiếu 0 trong 57 khoá: số từ lượt đo của B2 (ngoài làn máy), từ `--moi` và `--mp` của
  thước (trong làn) · AC bảo đảm: AC-1…AC-4, AC-7.
- CHẾT — ở bố cục cũ một ca xanh hoá đỏ, đổi tên, rời túi khoá, hay chiều đỏ thôi đỏ: số từ `--cu`, suite và `DV5q-do`
  (danh sách miễn không áp ở cây phẳng) · AC bảo đảm: AC-5, AC-2.
- Timebox — gộp trước lượt đo lại kế của B2, chậm nhất 04/12/2026: số từ giờ gộp · AC bảo đảm: không AC — ràng buộc lịch.

## Out of scope

- Không sửa gì ở `~/dev/delivery-loop` — vòng chỉ ghi `gui-b2.md` (kể cả luật `tuiCu` đề nghị: B2 tự nhận).
- Không đổi byte nào của hồ sơ đã ký (kể cả thước vòng hai, vòng ba).
- Không sửa mã sản phẩm (`scripts/`, `lib/`, `skills/`, `feature-loop/`…): 45 dòng sổ trỏ đường phẳng ở 32 hồ sơ đã khép
  chỉ ghi vào `gui-b2.md`.
- Nhóm «Ngoài-11».
- Không cắt số, không gắn thẻ — đi theo mốc 3.0.
- Không đổi nhãn ca của `bo-cuc.test.mjs` (theo khuyến nghị Hỏi-1; chủ kho chọn lối khác thì AC-4 viết lại).

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Số khoá thiếu là số B2 đo (nhận lại); số đo ở kho này ghi ở design §2 và `duong-nen.md`.
- AC-7 vào hợp đồng SAU lượt phản biện context sạch (lời chủ kho đến qua phiên B2 lúc lượt ấy đang chạy) — chưa qua phản
  biện; hai dòng sửa đã chạy lại ở kho này trên cả hai cây (design §3.6).
- Giới hạn khai: kho mới của thước dựng bằng bản chép luật của vòng hai và vòng ba, không bằng kịch bản thật của B2. Số
  trên cây kịch bản thật là phép đo tay một lần trước Cổng Bằng chứng, ghi `gui-b2.md` kèm sha; ngưỡng mở lại: lượt đo kế
  của B2 còn thiếu ≥ 1 trong 14 khoá ngoài K4-MP.
- Giới hạn khai (kế thừa Hỏi-2 vòng ba): ở kho mới «KK-6 so-that» đọc sổ trong cây phẳng đóng băng ở ngày cắt sang.
- Giới hạn khai: `--cu` so bản GOC_VONG với HEAD sống; một vòng sau cố ý đổi tên ca trong các tệp vòng khai sẽ làm eval
  ấy đỏ ở lượt ghim lại — khi đó cho eval nghỉ theo nếp `superseded_by`, không sửa thước đã ký. Ngưỡng đếm: ≥ 1 lượt ghim
  lại đỏ vì lý do này.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-17:
  - Ngoài-1: sửa bộ dựng hai cây kiểm thử sau này thì bằng chứng của E2, E3, E5 vẫn bị coi là còn mới và có thể không được chạy lại.
  - Ngoài-3: kho nằm ở thư mục có dấu cách hay chữ có dấu thì bộ tự kiểm của thước vòng bốn báo đỏ oan.
  - Ngoài-4: phép kiểm «mỗi mục miễn khớp đúng một dòng» chỉ đếm ở tệp thứ nhất; một dòng trùng chữ ở tệp thứ hai có thể được tha lặng.
  - Ngoài-5: ma trận DV5q chỉ thử vế gốc đọc từ thư mục, không thử vế gốc đọc từ lịch sử kho; đọc nhầm bố cục ở vế ấy thì hai dòng luật có thể bị nới lặng mà ma trận vẫn xanh.
