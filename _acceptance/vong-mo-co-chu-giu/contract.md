---
schema_version: 1
feature: Mỗi yêu cầu giữa các phiên — giám sát và thợ, máy và máy — có mã và hạn biên nhận, chỉ đóng khi có XONG kèm vật, TRẢ hay HUỶ; phiên không kết lượt khi còn tin gửi mình chưa nhận; lời giao việc thiếu kết quả hay ranh giới thì không mở chip
slug: vong-mo-co-chu-giu
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: draft
design_doc: docs/superpowers/specs/2026-10-17-vong-mo-co-chu-giu-design.md
approved_by:
approved_at:
---

# Acceptance Contract: vong-mo-co-chu-giu

## Context

Hàng GT1 của lộ trình kit. Chủ kho ký Cổng Đáng 17/10 với dòng «đáng: build · ngưỡng: nhận». Lý do làm: hôm nay chỉ
cạnh thợ → giám sát trong đợt có máy giữ vòng. Cạnh giám sát → thợ và cạnh máy ↔ máy đóng vòng bằng trí nhớ. Đo 17/10:
0/44 yêu cầu trên hai kênh liên máy có trả lời trỏ về được tin gốc.

Nguồn đầu vào:
- ô cơ hội: `_acceptance/vong-mo-co-chu-giu/opportunity.md`;
- hạt giống: `docs/plans/2026-10-17-hat-giong-luat-giao-tiep-giua-cac-phien.md`;
- thiết kế: `docs/superpowers/specs/2026-10-17-vong-mo-co-chu-giu-design.md`.

Thuật ngữ:
- **kho thử có đợt** = thư mục git tạm dựng bằng CLI thật của gói (`mo` rồi `pha dang-chay`). Hai dãy P1 và P2 có
  worktree liên kết thật (`git worktree add`). Giám sát có worktree riêng, ghi trong `vai.json`.
- **kênh giả** = một chương trình `gh` giả, trỏ bằng biến `DIEU_PHOI_GH`. Nó đọc và ghi bình luận vào một tệp ca dưới
  thư mục tạm, theo đúng hình JSON của `gh api repos/<chủ>/<kho>/issues/<số>/comments`. Nó đếm lời gọi vào một tệp
  nhật ký. Lệnh nạp `--loi` làm nó thoát 1, nêu «gh giả: lỗi tiêm».
- **bản lành / bản tiêm** = bản sao `dieu-phoi/` chưa đổi / bị tiêm một lỗi. Ca đỏ chạy CHÍNH hàm đo trên bản tiêm,
  SAU khi bản lành xanh trên cùng fixture. Ca kiểm riêng là bước tiêm đã áp, và ghim thông điệp của đúng lỗi được tiêm.
- **0 byte ghi** = băm cây thư mục đợt (hoặc thư mục kênh cục bộ, hoặc tệp ca của kênh giả) trước và sau lệnh bằng nhau.

## Criteria

- AC-1: Given kho thử có đợt và kênh giả, When chạy `tin gui` theo ma trận viết sẵn, Then mỗi hàng khớp đúng kỳ vọng
  của hàng, số hàng in ra.

  Ma trận:
  - (a) P1 gửi `HỎI` tới `G` với `--chan khong --khuyen …` → thoát 0, in mã `P1-<ddmm>-1`. Dòng đầu bằng
    `HỎI P1-<ddmm>-1 · P1 → G`.
  - (b) lặp (a) → mã `P1-<ddmm>-2`.
  - (c) `G` gửi `GIAO` tới P2, đủ ba trường → mã `G-<ddmm>-1`.
  - (d) máy `MBP` (đã `tin vai`) gửi `GIAO` lên kênh giả → một bình luận mới. Dòng đầu bằng `GIAO MBP-<ddmm>-1 · MBP → M5`.
  - (e) `GIAO` thiếu `--ket-qua` → thoát 1, stderr nêu `--ket-qua`, 0 byte ghi.
  - (f) `GIAO` thiếu `--ranh-gioi` → như (e), nêu `--ranh-gioi`.
  - (g) `GIAO` thiếu `--y-dinh` → như (e), nêu `--y-dinh`.
  - (h) `HỎI` thiếu `--chan` → như (e), nêu `--chan`.
  - (i) `HỎI` thiếu `--khuyen` → như (e), nêu `--khuyen`.
  - (j) khẩu lệnh `DUYỆT` → thoát 1, stderr nêu tám khẩu lệnh hợp lệ, 0 byte ghi.
  - (k) chạy từ một worktree không thuộc dãy nào và không phải giám sát → thoát 1, nêu «không thuộc đợt», 0 byte ghi.
  - (l) thư mục đợt đã có `yeu-cau/P1-7.json` → mã của (a) vẫn có ba khúc, không trùng `P1-7`.

  Chiều đỏ: bản tiêm bỏ kiểm `--ranh-gioi` → hàng (f) đỏ, nêu «(f)».
- AC-2: Given các vòng đã mở ở AC-1, When chạy `tin tra` theo ma trận viết sẵn, Then mỗi hàng khớp, số hàng in ra.

  Ma trận:
  - (a) P2 `NHẬN G-<ddmm>-1` đủ `--se-giao --giu-trong --dung-hoi` → thoát 0. Dòng đầu bằng
    `NHẬN G-<ddmm>-1 · P2 → G`.
  - (b) như (a) nhưng thiếu `--dung-hoi` → thoát 1, nêu `--dung-hoi`, 0 byte ghi.
  - (c) `G` `NHẬN P1-<ddmm>-1` thiếu `--tra-luc` → thoát 1, nêu `--tra-luc`.
  - (d) P2 `XONG G-<ddmm>-1` thiếu `--vat` → thoát 1, nêu `--vat`.
  - (e) `G` `XONG P1-<ddmm>-1` thiếu `--tra-loi` → thoát 1, nêu `--tra-loi`.
  - (f) P1 (không phải người nhận) `XONG G-<ddmm>-1` → thoát 1, nêu «không phải người nhận».
  - (g) P2 `HUỶ G-<ddmm>-1` (không phải người giao) → thoát 1, nêu «chỉ người giao».
  - (h) `NHẬN P9-0101-1` (mã không có) → thoát 1, nêu «không có vòng».
  - (i) P2 `XONG G-<ddmm>-1 --vat <sha>`, rồi `KẸT G-<ddmm>-1` → lần hai thoát 1, nêu «đã đóng bởi XONG».
  - (j) `TRẢ` thiếu `--chuyen` → thoát 1, nêu `--chuyen`.
  - (k) `KẸT` thiếu `--can` → thoát 1, nêu `--can`.

  Mọi hàng thoát 1 đều 0 byte ghi. Chiều đỏ: bản tiêm bỏ kiểm người nhận → hàng (f) đỏ.
- AC-3: Given kho thử với chuỗi tin dựng bằng CHÍNH lệnh `tin gui` và `tin tra` (không viết tay dòng nào), và đồng
  hồ giả qua `DIEU_PHOI_NOW_MS`, When chạy `tin so --json`, Then sổ khớp từng mục với bảng viết sẵn trong ca:
  - vòng chỉ có GIAO → `chua-nhan`;
  - NHẬN → `da-nhan`, KẸT → `ket`;
  - XONG, TRẢ, HUỶ → không còn trong sổ;
  - BÁO → không bao giờ vào sổ;
  - thứ tự theo tuổi, cũ trước;
  - mức quá hạn: 0 ở phút 29, 1 ở phút 31, 2 ở phút 61 khi hạn mặc định 30′; với GIAO khai `--han 10`: 1 ở phút 11,
    2 ở phút 21; vòng đã NHẬN luôn mức 0;
  - `yeu-cau/P1-7.json` không có `tra-loi` → mục `HỎI P1-7 · P1 → G`; thêm `tra-loi/P1-7.json` → mục biến mất. Tệp
    `yeu-cau/` và `tra-loi/` không đổi một byte (so băm).

  `tin nhac <mã>` ở mức 1: lần đầu thoát 0 và thêm một BÁO «nhắc <mã>»; lần hai thoát 1, nêu «đã nhắc». Ở phút 61,
  `xem --json` có mục mang đúng mã và mức 2 (so bằng nhau với mục của `tin so --json`), và `xem` dạng chữ chứa mã ấy.
  Chiều đỏ: bản tiêm cho KẸT đóng vòng → mục `ket` biến mất, ca nêu tên mục. Bản tiêm bỏ nhánh đọc tin trong `xem` →
  ca `xem` đỏ, nêu mã.
- AC-4: Given bộ đọc dòng đầu `docDongDau`, When đọc ma trận văn bản viết sẵn, Then mỗi hàng khớp, số hàng in ra.
  Ma trận gồm hai ca có thật ngày 16/10, chép nguyên văn dòng đầu và thân, và các ca biên:
  - (a) thân có «XONG MBP-1710-1» nhưng dòng đầu là BÁO → không đóng vòng `MBP-1710-1`;
  - (b) dòng đầu «#453 chưa gọi lượt» → không khẩu lệnh nào;
  - (c) `xong MBP-1710-1` viết thường → không khẩu lệnh nào;
  - (d) `NHẬN` dạng NFD → đọc như `NHẬN`;
  - (e) `HỦY` → đọc như `HUỶ`;
  - (f) dòng đầu khuôn cũ `[MacBook Pro · Điều phối → M5 · Điều phối] gọi lượt` → `cu: true`, không vòng;
  - (g) tin rỗng → bỏ qua, không ném lỗi.

  Trên kênh giả có lẫn tin khuôn cũ, `tin so` in nhóm «tin không mã — không theo dõi vòng: <k>» với k đúng bằng số tin
  khuôn cũ. Chiều đỏ: bản tiêm phân loại trên cả thân → hàng (a) đỏ.
- AC-5: Given kênh giả có 3 bình luận sẵn và một máy đã `tin vai`, When chạy round-trip, Then:
  - `tin gui --kenh` đăng đúng một bình luận;
  - `tin so --kenh` lần một đọc đủ 4 bình luận;
  - thêm 2 bình luận rồi chạy lại: chỉ đọc 2 bình luận mới (đếm trong nhật ký gh giả, so bằng nhau);
  - con trỏ trong trạng thái cục bộ bằng mã bình luận cuối;
  - vòng do `MBP` mở và `M5` XONG bằng `tin tra --kenh` (chạy dưới một trạng thái cục bộ thứ hai, tên `M5`) → biến
    khỏi sổ của cả hai bên;
  - phân trang: kênh giả trả tối đa 30 bình luận mỗi trang kèm header `Link`. Với 35 bình luận sẵn, lượt một đọc đủ 35
    (cộng tin mới gửi), lượt hai chỉ đọc đúng số bình luận mới;
  - cửa sổ: `tin so --kenh --tu <ngày> --json` đếm ba nhóm theo `created_at` — có mã · khuôn cũ (kèm số có đích) · bỏ
    qua (kèm danh sách mã bình luận). Ba số và danh sách bằng ma trận viết sẵn; bình luận ngoài cửa sổ không được đếm.

  Bộ phân loại của kênh và của thư mục đợt là CÙNG một hàm: cùng ma trận văn bản AC-4 qua hai nơi chứa cho cùng kết quả.
  Chiều đỏ: bản tiêm bỏ con trỏ → lượt hai đọc 6, ca nêu «6 ≠ 2».
- AC-6: Given kênh giả và trạng thái cục bộ đã có tin cuối, When chạy `tin canh` theo ma trận, Then:
  - (a) tin cuối còn nguyên → thoát 0, in «canh: bắt lại <mã bình luận>»;
  - (b) tin cuối bị xoá khỏi tệp ca → thoát 3, stderr bắt đầu `canh: không bắt lại được tin cuối`;
  - (c) dòng đầu của tin cuối bị sửa → như (b), nêu «dòng đầu khác»;
  - (d) gh giả `--loi` → thoát 3, nêu «gh giả: lỗi tiêm»;
  - (e) `--cho` với một tin gửi máy mình được thêm sau 2 nhịp → thoát 0, in dòng đầu của tin đó;
  - (f) `--cho` khi gh giả chuyển sang lỗi giữa chừng → thoát 3 trong một nhịp, không treo;
  - (g) gh giả `--treo` (ngủ 30 giây) → thoát 3 trong trần của lệnh, nêu «quá trần».

  Không hàng nào thoát 0 mà stdout rỗng. Chiều đỏ: bản tiêm nuốt lỗi gh (trả mảng rỗng) → hàng (d) đỏ, nêu «(d)».
- AC-7: Given kho thử có đợt và kênh giả, When chạy CHÍNH lệnh trong khối `Stop` của `dieu-phoi/hooks/hooks.json` với
  stdin dựng như Claude Code theo ma trận, Then mỗi hàng khớp, số hàng in ra:
  - (a) cwd P2, có `G-<ddmm>-1` chưa nhận → stdout là JSON `decision: "block"`, `reason` chứa mã, dòng đầu và lệnh
    NHẬN chép được nguyên văn;
  - (b) như (a) sau khi P2 đã NHẬN → thoát 0, stdout rỗng;
  - (c) cwd giám sát, có `HỎI P1-<ddmm>-1` chưa nhận → chặn;
  - (d) cwd P1 (không phải người nhận của vòng nào) → không chặn;
  - (e) cwd worktree giữ kênh `MBP`, kênh giả có GIAO gửi `MBP` chưa nhận → chặn;
  - (f) như (e) nhưng gh giả `--loi` → theo câu trả lời Hỏi-2. Khuyến nghị: chặn một lần, `reason` nêu «không đọc
    được kênh» và lệnh `tin canh`; lần dừng kế trong 30′ thì không chặn. Lối khác: thoát 0, không chặn, đúng một
    `systemMessage` nêu «không đọc được kênh»;
  - (g) như (e) nhưng gh giả `--treo` → hook xong trong ≤ 6 giây và đi đúng nhánh của (f);
  - (h) thư mục đợt có `yeu-cau/P1-7.json` chưa trả lời, không có tin nào → cwd giám sát không bị chặn.

  Chiều đỏ: bản tiêm so người nhận bằng người gửi → hàng (a) và (d) đỏ. Bản tiêm bỏ trần thời gian → hàng (g) đỏ.
- AC-8: Given như AC-7, When gọi hook lặp lại theo ma trận lối thoát và ma trận kho không dùng, Then:
  - (a) lần hai cùng tập mã chưa nhận → không chặn. Sổ (`tin so --json`) có `ket_luot_chua_nhan: true` ở mục ấy, và
    `xem --json` đếm nó;
  - (a′) như (a) nhưng ở cwd giữ kênh `MBP` → không chặn ở lần hai. `tin so --kenh --json` có
    `ket_luot_chua_nhan: true`, và nhật ký gh giả có 0 lời gọi ghi trong cả hai lần hook chạy;
  - (b) `stop_hook_active: true` → không chặn;
  - (c) có thêm một tin mới chưa nhận sau (a) → chặn lại, `reason` nêu mã mới;
  - (d) kho git không đợt, không kênh → thoát 0, stdout và stderr rỗng, băm cây kho và `.acceptance-runs/` trước và
    sau bằng nhau;
  - (e) `hooks.json` có đúng một khối `Stop` mới; năm khối cũ (PreToolUse, PostToolUse, Notification,
    UserPromptSubmit, StopFailure) bằng sâu bản ở `main` 43ed9e2b.

  Chiều đỏ: bản tiêm chặn mãi (bỏ dấu đã chặn) → hàng (a) đỏ, nêu «chặn lần hai». Bản tiêm bỏ dấu ở nhánh kênh → hàng
  (a′) đỏ, nêu «chặn lần hai kênh».
- AC-9: Given kho thử có đợt, When dựng lời giao bằng `tin gui GIAO` và bằng kế hoạch `tiep-tuc` cho một dãy
  `mo-chip`, Then:
  - cả hai chứa đủ sáu nhãn `Ý định:`, `Kết quả:`, `Ranh giới:`, `Quyền:`, `Điểm phải hỏi:`, `Báo về:`, theo thứ tự đó.
    Phần sáu dòng của cả hai do CÙNG hàm `loiGiaoViec` sinh: đầu vào giống nhau cho đầu ra bằng nhau từng byte;
  - ở chip, năm trường máy điền khớp nguồn: Ý định là dòng `Vì sao:` của ô cơ hội trong worktree · Kết quả nêu slug và
    `nhanh_chinh` · Ranh giới nêu kho, worktree và `hang.ranh_gioi` · Quyền theo `--tu-merge` · Báo về chứa mã phiên
    giám sát của `vai.json`;
  - hàng không có hồ sơ → hành động `khong-hang`, `ly_do` chứa «thiếu Kết quả», không có `ghi_danh`.

  Ca của hồ sơ đã ký đọc `ghi_danh` vẫn xanh trên bản này (chạy lại khoá suite cũ của gói): DP3, DP4-ghi-danh,
  ON-DINH-R2, SDT. Chiều đỏ: bản tiêm xoá dòng `Ranh giới:` khỏi `loiGiaoViec` → ca sáu nhãn đỏ, nêu «Ranh giới:».
- AC-10: Given gói sau vòng, When đọc `dieu-phoi/scripts/mau/LUAT.md` và `dieu-phoi/README.md`, Then:
  - khối `<<<LUAT-TIN … LUAT-TIN>>>` của `LUAT.md` liệt kê tám khẩu lệnh bằng đúng tập hằng `KHAU_LENH` của
    `tin.mjs` (rút cả hai bên, so bằng nhau);
  - khối nêu đủ năm luật vòng mở §4.2, khuôn đọc lại ba dòng §4.4, và danh sách phải hỏi / không được hỏi §4.5;
  - mọi dòng lệnh `tin.mjs` trong khối và trong README chạy được `--help` (thoát 0);
  - một người đọc mới, chỉ có khối này, biết khi nào phải phát NHẬN, khi nào được hỏi, và vòng đóng bằng gì (judgment).

  Chiều đỏ: bản tiêm thêm khẩu lệnh `DUYỆT` vào khối → ca so tập đỏ, nêu `DUYỆT`.

## Coverage

Quét bằng morphological-scan (preset entity-feature, thực thể = một vòng mở) ở S1. Chân sản phẩm từ repo: gói
`dieu-phoi/` [SUY-TỪ-REPO: dieu-phoi/README.md] và hạt giống [SUY-TỪ-REPO: docs/plans/2026-10-17-hat-giong-luat-giao-tiep-giua-cac-phien.md].
Chân ngành:
- giao tiếp vòng kín và khẩu lệnh vô tuyến [NGÀNH: ICAO Doc 9432 Manual of Radiotelephony — readback, ROGER/WILCO];
- vòng đời việc giữa tác tử [NGÀNH: A2A 1.0 task states SUBMITTED → WORKING → COMPLETED/FAILED/CANCELED/REJECTED];
- xác nhận nhận tin [NGÀNH: AMQP 0-9-1 basic.ack — tin chưa ack thì vẫn thuộc người nhận].

- Trục A · nơi chứa và cạnh: đợt thợ → giám sát (yêu cầu cũ) | đợt thợ → giám sát (`tin`) | đợt giám sát → thợ |
  kênh máy ↔ máy | không đợt, không kênh [thước CE: hạt giống §1.1 bảng ba cạnh — SUY-TỪ-REPO]
- Trục B · vòng đời: mở (GIAO, HỎI) | không mở (BÁO) | giữ mở (NHẬN, KẸT) | đóng (XONG, TRẢ, HUỶ) | quá hạn mức 1/2 |
  tin không mã [thước CE: hạt giống §4.1–4.2 + A2A 1.0]
- Trục C · chỗ máy giữ: lúc gửi | lúc đáp | lúc đọc | lúc kết lượt | lúc canh | lúc hiện [thước CE: hạt giống §5
  bảng răng, bảy dòng không còn là lời — SUY-TỪ-REPO]
- Trục D · đường lỗi: đầu vào thiếu trường | nền hỏng (gh lỗi, tin cuối mất) | vòng chặn lặp | kho không dùng gói
  [thước CE: sự cố 15/10 (bộ canh câm), 16/10 (đọc trên thân) — hạt giống §2.1]
- Core → AC: C(gửi)×B(mở) → AC-1 · C(đáp)×B → AC-2 · C(hiện)×B×A(đợt) → AC-3 · C(đọc)×D(16/10) → AC-4 · A(kênh) →
  AC-5 · C(canh)×D(15/10) → AC-6 · C(kết lượt)×A → AC-7 · C(kết lượt)×D(chặn lặp, không dùng) → AC-8 · lời giao
  (hạt giống §4.3) → AC-9 · lời (§4.4–4.5) → AC-10.
- Đi chéo mọi ô Core: không ghi byte nào khi từ chối; thân tin không bao giờ được phân loại; kho không dùng gói thì im.
- Later — phiên ngoài đợt trên cùng máy (chip của điều phối không mở đợt). Câu hỏi Hỏi-1 ở Cổng Phạm vi.
- Later — so khớp ba dòng đọc lại với lời giao. Vẫn là lời, ngưỡng ở hạt giống §5.
- Never — kho git làm hộp thư. Ngoài phạm vi theo hạt giống 13/10.
- Never — khẩu lệnh DUYỆT. Chữ ký cổng vẫn gõ trong phiên vòng (ADR 0002).

## Đường đo

- Thước: 14 ngày sau khi crm nhận bản có GT1, không lần nào chủ kho phải hỏi «phiên hay máy kia đã nhận chưa» · số
  từ: đếm tay tin chủ kho gửi phiên điều phối trong bản ghi phiên crm, cùng cách finding 2026-10-05 §4.4 đã đếm · bảo
  đảm bởi: đã có sẵn: bản ghi phiên của app. Reality đọc.
- Thước: mọi yêu cầu (GIAO, HỎI) trên kênh liên máy có trả lời trỏ về mã · số từ: `tin so --kenh <kênh> --tu <ngày
  crm nhận> --json` trên cửa sổ 14 ngày. Lệnh đếm ba nhóm: có mã (vòng còn mở quá hạn mức 2) · khuôn cũ có đích ·
  «bỏ qua». Nhóm «bỏ qua» đi kèm danh sách mã bình luận để người đếm tay xem bình luận nào là yêu cầu viết văn xuôi.
  SỐNG khi cả ba số bằng 0. Dòng đo vô hiệu khi tổng bình luận trong cửa sổ bằng 0 · bảo đảm bởi: AC-3, AC-4, AC-5.
- Thước: CHẾT — một phiên bị khoá vì hook chặn mãi · số từ: sổ `ket_luot_chua_nhan` cộng lời chủ kho · bảo đảm bởi:
  AC-8.
- Thước: CHẾT — bộ canh im khi kênh hỏng · số từ: mã thoát của `tin canh` · bảo đảm bởi: AC-6.

## Out of scope

- Kho git làm hộp thư (hạt giống 13/10, ngưỡng giữ nguyên).
- Danh tính máy có chữ ký; đánh thức phiên đã đóng.
- Phiên ngoài đợt trên cùng máy: chip `start_session` của điều phối không mở đợt. Vẫn ở Later cho tới khi Hỏi-1 được trả lời.
- So khớp ba dòng đọc lại với lời giao (còn là lời, hạt giống §5).
- Đổi `loai` hay `kiemYeuCau` của `yeu-cau`; đổi bộ phát lịch giao việc; đổi bảy hành động của `tiep-tuc`.
- Đường truyền `send_message` của app; `tin` chỉ là nơi chứa có mã, chữ nó in ra đi qua đường truyền nào cũng được.
- Engine nghiệm thu (`skills/`, `feature-loop/`, `scripts/` gốc); cắt số, gắn tag.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Known limits (nhãn trạng thái, không phải việc):
  - **Khớp đọc lại là phán xét của giám sát.** Ngưỡng: ≥ 1 ca thợ làm lệch phạm vi mà tin NHẬN đã khai đúng phạm vi.
  - **Danh tính máy trên issue tự khai** (giới hạn của tệp 13/10).
  - **Hook kênh chỉ thấy tin mới khi đồng bộ được.** Ngưỡng: ≥ 1 ca tin kênh bị sót > 30′ trong khi hook đã báo lỗi kênh.
  - **Hook chỉ chặn vòng mở bằng `tin`.** Yêu cầu cũ `yeu-cau/` hiện trên sổ nhưng không làm hook chặn, để nâng gói không
    đổi hành vi đợt đang chạy (luật 26/09).
- Thứ tự (điều phối 17/10): S3 chờ M5 trả lời MBP-1710-1 trên #308. S4 và PR đi sau VA2 (2.32.1) và RD1, không chen
  vào lô của M5.
- Khoá đo `executors.test.tin_*` phải thêm vào `_acceptance/config.yaml`. Đang hỏi điều phối (GT1-1710-1), vì tệp này
  nằm ngoài ranh giới đã giao.
