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
0/44 yêu cầu trên hai kênh liên máy có trả lời trỏ về được tin gốc. Ràng buộc trải nghiệm, chủ kho đặt 18/10: nghi thức
do máy gánh. Chủ kho không gõ khẩu lệnh nào. Phiên chỉ nói điều chỉ nó biết (một câu ý định, một câu trả lời).

Nguồn đầu vào:
- ô cơ hội: `_acceptance/vong-mo-co-chu-giu/opportunity.md`;
- hạt giống: `docs/plans/2026-10-17-hat-giong-luat-giao-tiep-giua-cac-phien.md`;
- thiết kế: `docs/superpowers/specs/2026-10-17-vong-mo-co-chu-giu-design.md` (§2 là bảng trải nghiệm).

Thuật ngữ:
- **kho thử có đợt** = thư mục git tạm dựng bằng CLI thật của gói (`mo` rồi `pha dang-chay`), remote `origin` giả trỏ
  `https://github.com/thu/kho-a.git`. Hai dãy P1, P2 có worktree liên kết thật (`git worktree add`). Giám sát có worktree
  riêng, ghi trong `vai.json`. Hàng kế của P2 có hồ sơ `hang-b` (ô cơ hội có dòng `Vì sao:`) và `ranh_gioi`.
- **kho lạ** = một kho git tạm thứ hai, remote `origin` là `https://github.com/thu/kho-b.git`.
- **kênh giả** = một chương trình `gh` giả, trỏ bằng biến `DIEU_PHOI_GH`. Nó đọc và ghi bình luận vào một tệp ca dưới thư
  mục tạm, theo hình JSON của `gh api repos/<chủ>/<kho>/issues/<số>/comments`:
  - trả tối đa 30 bình luận mỗi trang, kèm header `Link`;
  - `gh pr view` trả một PR giả khi tệp ca có PR cho nhánh;
  - đếm mọi lời gọi vào một tệp nhật ký, tách đọc và ghi;
  - cờ `--loi` làm nó thoát 1, nêu «gh giả: lỗi tiêm»;
  - cờ `--treo` làm nó ngủ 30 giây.
- **bản lành / bản tiêm** = bản sao `dieu-phoi/` chưa đổi / bị tiêm một lỗi. Ca đỏ chạy CHÍNH lệnh đo trên bản tiêm, SAU khi
  bản lành xanh trên cùng fixture. Ca kiểm riêng bước tiêm đã áp, và ghim thông điệp của đúng lỗi được tiêm.
- **0 byte ghi** = băm cây nơi chứa (thư mục đợt, trạng thái kênh cục bộ, tệp ca của kênh giả) trước và sau lệnh bằng nhau.
- **chạm** = số đối số người gõ ngoài tên lệnh, khẩu lệnh và đích/mã.

## Criteria

- AC-1: Given kho thử có đợt và kênh giả, When gửi bằng `tin GIAO|HỎI|BÁO` theo ma trận viết sẵn, Then mỗi hàng khớp,
  số hàng in ra.
  - (a) `G` chạy `tin GIAO P2 "<một câu>"` (1 chạm) → thoát 0, mã `G-<ddmm>-1`. Dòng đầu bằng `GIAO G-<ddmm>-1 · G → P2`.
    Thân và stdout có đủ sáu nhãn, theo thứ tự:
    - `Ý định:` là câu đã gõ;
    - `Kết quả:` chứa `hang-b` và `nhanh_chinh`;
    - `Ranh giới:` chứa `thu/kho-a`, worktree của P2 và từng mục `ranh_gioi`;
    - `Quyền:` theo `--tu-merge`;
    - `Điểm phải hỏi:`;
    - `Báo về:` chứa mã phiên giám sát của `vai.json`.
  - (b) lặp (a) → mã `G-<ddmm>-2`.
  - (c) máy `MBP` (đã `tin vai`) chạy `tin GIAO M5 "<câu>" --hang GT1 --kenh …` → đúng một bình luận mới trên kênh giả.
    Dòng đầu là `GIAO MBP-<ddmm>-1 · MBP → M5`, và `Kết quả:` chứa slug của hàng GT1.
  - (d) như (c) nhưng không `--hang`, không `--ket-qua` → thoát 1, nêu «không suy được Kết quả», 0 byte ghi.
  - (e) `tin GIAO P2` không có câu → thoát 1, nêu «thiếu ý định», 0 byte ghi.
  - (f) P1 chạy `tin HỎI G "<câu>"` → mã `P1-<ddmm>-1`, vòng `chan: false`; thêm `--chan` → `chan: true`.
  - (g) `tin DUYỆT …` → thoát 1, nêu đủ tám khẩu lệnh hợp lệ, 0 byte ghi.
  - (h) cwd là worktree ngoài dãy, không phải giám sát → thoát 1, nêu «không thuộc đợt», 0 byte ghi.
  - (i) thư mục đợt đã có `yeu-cau/P1-7.json` → mã của (f) vẫn có ba khúc, không trùng `P1-7`.

  Đếm chạm (a) = 1, (f) = 1, in ra. Chiều đỏ: bản tiêm bỏ dòng `Ranh giới:` khỏi `loiGiaoViec` → hàng (a) đỏ, nêu
  «Ranh giới:».
- AC-2: Given các vòng mở ở AC-1, When đáp bằng `tin NHẬN|XONG|KẸT|TRẢ|HUỶ` theo ma trận viết sẵn, Then mỗi hàng khớp,
  số hàng in ra.
  - (a) P2 `tin NHẬN G-<ddmm>-1` (0 chạm) → thoát 0. Dòng đầu bằng `NHẬN G-<ddmm>-1 · P2 → G`.
  - (b) như (a), chạy trong kho lạ (đích đã khai kho `thu/kho-a`) → thoát 1, nêu cả `thu/kho-a` lẫn `thu/kho-b`, 0 byte ghi.
  - (c) P2 `tin XONG G-<ddmm>-1` (0 chạm), kênh giả có PR cho nhánh → thân chứa sha HEAD 40 ký tự, tên nhánh và đường PR,
    so bằng nhau với `git rev-parse HEAD`, `git branch --show-current` và PR của tệp ca.
  - (d) như (c), không có PR → thân có sha và nhánh, không có dòng PR, không lỗi.
  - (e) `XONG` chạy trong kho lạ → thoát 1, đòi `--vat`; thêm `--vat "<…>"` → thoát 0, thân là đúng câu đó.
  - (f) `G` `tin XONG P1-<ddmm>-1` không câu trả lời → thoát 1, nêu «câu trả lời»; có câu → thoát 0.
  - (g) P1 (không phải người nhận) `tin XONG G-<ddmm>-2` → thoát 1, nêu «không phải người nhận».
  - (h) P2 `tin HUỶ G-<ddmm>-2 "<lý do>"` → thoát 1, nêu «chỉ người giao».
  - (i) `tin NHẬN P9-0101-1` → thoát 1, nêu «không có vòng».
  - (j) đáp `KẸT` cho vòng đã XONG ở (c) → thoát 1, nêu «đã đóng bởi XONG».
  - (k) `tin KẸT <mã>` không câu → thoát 1, nêu «cần gì».
  - (l) `tin TRẢ <mã> "<lý do>"` không `--chuyen` → thoát 1, nêu `--chuyen`.

  Mọi hàng thoát 1 đều 0 byte ghi. Đếm chạm (a) = 0, (c) = 0, in ra. Chiều đỏ: bản tiêm bỏ so kho → hàng (b) đỏ, nêu «(b)».
  Bản tiêm bỏ kiểm người nhận → hàng (g) đỏ.
- AC-3: Given kho thử với chuỗi tin dựng bằng CHÍNH các lệnh `tin` (không viết tay dòng nào), và đồng hồ giả qua
  `DIEU_PHOI_NOW_MS`, When chạy `tin so --json` và `xem --json`, Then sổ khớp từng mục với bảng viết sẵn trong ca:
  - trạng thái `chua-den` → `da-den` (sau khi hook AC-7 đưa tin) → `da-nhan` | `ket`;
  - XONG, TRẢ, HUỶ → không còn trong sổ; BÁO không bao giờ vào sổ; thứ tự theo tuổi, cũ trước;
  - mức quá hạn: 0 ở phút 29, 1 ở phút 31, 2 ở phút 61 khi hạn mặc định 30′; GIAO khai `--han 10`: 1 ở phút 11, 2 ở phút
    21; vòng đã NHẬN luôn 0. Bảy hàng in ra;
  - ở phút 61, mục của `xem --json` mang mã và mức 2 bằng mục của `tin so --json`, và `xem` dạng chữ chứa mã ấy;
  - `yeu-cau/P1-7.json` không có `tra-loi` → mục `HỎI P1-7 · P1 → G`; thêm `tra-loi/P1-7.json` → mục biến mất. `yeu-cau/`
    và `tra-loi/` không đổi một byte (so băm).

  Chiều đỏ: bản tiêm cho KẸT đóng vòng → mục `ket` biến mất, ca nêu tên mục. Bản tiêm bỏ nhánh đọc tin trong `xem` → ca
  `xem` đỏ, nêu mã.
- AC-4: Given bộ đọc dòng đầu `docDongDau`, When đọc ma trận văn bản viết sẵn, Then mỗi hàng khớp, số hàng in ra. Ma trận
  gồm hai ca thật ngày 16/10 (chép nguyên văn dòng đầu và thân) và các ca biên:
  - (a) thân có «XONG MBP-1710-1» mà dòng đầu là BÁO → không đóng vòng `MBP-1710-1`;
  - (b) dòng đầu «#453 chưa gọi lượt» → không khẩu lệnh nào;
  - (c) `xong MBP-1710-1` viết thường → không khẩu lệnh nào;
  - (d) `NHẬN` dạng NFD → đọc như `NHẬN`;
  - (e) `HỦY` → đọc như `HUỶ`;
  - (f) dòng đầu khuôn cũ `[MacBook Pro · Điều phối → M5 · Điều phối] gọi lượt` → `cu: true`, không vòng;
  - (g) tin rỗng → bỏ qua, không ném lỗi.

  Trên kênh giả có lẫn tin khuôn cũ, `tin so` in «tin không mã — không theo dõi vòng: <k>», với k đúng số tin khuôn cũ.
  Chiều đỏ: bản tiêm phân loại trên cả thân → hàng (a) đỏ.
- AC-5: Given kênh giả và hai trạng thái cục bộ (máy `MBP`, máy `M5`), When chạy round-trip, Then:
  - `tin GIAO --kenh` đăng đúng một bình luận;
  - kênh có 35 bình luận sẵn: `tin so --kenh` lần một đọc 36, lần hai (sau khi thêm 2) đọc đúng 2, đếm bằng nhật ký gh
    giả. Con trỏ bằng mã bình luận cuối;
  - vòng do `MBP` mở, `M5` NHẬN rồi XONG bằng `tin … --kenh` → vắng khỏi sổ của cả hai bên;
  - `tin so --kenh --tu <ngày> --json` cho `{co_ma, khuon_cu, khuon_cu_co_dich, bo_qua, bo_qua_ma}` bằng ma trận viết sẵn;
    bình luận trước `<ngày>` không được đếm;
  - ma trận văn bản AC-4 qua nơi chứa đợt và qua kênh giả cho kết quả bằng nhau (một hàm phân loại).

  Chiều đỏ: bản tiêm bỏ con trỏ → lượt hai đọc 38, ca nêu «38 ≠ 2». Bản tiêm bỏ `--paginate` → lượt một đọc 30, ca nêu
  «30 ≠ 36».
- AC-6: Given kênh giả và trạng thái cục bộ đã có tin cuối, When chạy `tin canh` theo ma trận, Then:
  - (a) tin cuối còn nguyên → thoát 0, in «canh: bắt lại <mã bình luận>»;
  - (b) tin cuối bị xoá khỏi tệp ca → thoát 3, stderr bắt đầu `canh: không bắt lại được tin cuối`;
  - (c) dòng đầu của tin cuối bị sửa → như (b), nêu «dòng đầu khác»;
  - (d) gh giả `--loi` → thoát 3, nêu «gh giả: lỗi tiêm»;
  - (e) `--cho`, một tin gửi máy mình được thêm sau 2 nhịp → thoát 0, in dòng đầu của tin đó;
  - (f) `--cho`, gh giả chuyển sang lỗi giữa chừng → thoát 3 trong một nhịp, không treo;
  - (g) gh giả `--treo` → thoát 3, nêu «quá trần», thời gian tường dưới 30 giây.

  Không hàng nào thoát 0 mà stdout rỗng. Chiều đỏ: bản tiêm nuốt lỗi gh (trả mảng rỗng) → hàng (d) đỏ, nêu «(d)».
- AC-7: Given kho thử có đợt và kênh giả, When chạy CHÍNH lệnh của mục `hook-tin.mjs` trong khối `PostToolUse` và khối
  `UserPromptSubmit` của `dieu-phoi/hooks/hooks.json`, với stdin dựng như Claude Code theo ma trận, Then mỗi hàng khớp,
  số hàng in ra:
  - (a) cwd P2, có `G-<ddmm>-1` chưa đến → stdout JSON có `hookSpecificOutput.additionalContext`, chứa mã, dòng đầu, thân và
    lệnh `tin NHẬN G-<ddmm>-1`. Sổ ghi `da-den`;
  - (b) gọi lần hai cùng tin → không còn `additionalContext` cho tin ấy;
  - (c) cwd P1 (không phải người nhận) → stdout rỗng;
  - (d) cwd giữ kênh `MBP`, bản đã đồng bộ có tin gửi `MBP` → đưa vào ngữ cảnh. Nhật ký gh giả có 0 lời gọi trong lượt hook;
  - (e) vòng `G` gửi chạm mức 1, cwd giám sát → nơi chứa có đúng một BÁO «nhắc <mã>»; gọi lại → vẫn một;
  - (f) vòng `MBP` gửi trên kênh chạm mức 1 → ngữ cảnh chứa lệnh `tin nhac <mã>`, nhật ký gh giả có 0 lời gọi ghi.

  Chiều đỏ: bản tiêm bỏ dấu «đã đưa» → hàng (b) đỏ, nêu «đưa lần hai».
- AC-8: Given như AC-7, When chạy CHÍNH lệnh của khối `Stop` theo ma trận chặn, lối thoát và kho không dùng, Then:
  - (a) cwd P2, có GIAO chưa NHẬN → `decision: "block"`, `reason` chứa mã và lệnh NHẬN chép được;
  - (b) như (a) sau khi P2 đã NHẬN → stdout rỗng;
  - (c) cwd P1, chỉ có HỎI của P1 đang chờ → không chặn;
  - (d) cwd giữ kênh `MBP`, có GIAO gửi `MBP` chưa nhận → chặn;
  - (e) như (d) nhưng gh giả `--loi`, rồi `--treo` → đi đúng nhánh của câu trả lời Hỏi-1 (khuyến nghị: lần một chặn, reason
    nêu «không đọc được kênh» và `tin canh`; lần hai trong 30′ không chặn). `--treo` xong trong ≤ 6 giây;
  - (f) lần dừng hai cùng tập mã ở (a), và ở (d) → không chặn, sổ có `ket_luot_chua_nhan: true`, `xem --json` đếm nó, nhật
    ký gh giả có 0 lời gọi ghi;
  - (g) `stop_hook_active: true` → không chặn;
  - (h) có GIAO mới sau (f) → chặn lại, reason nêu mã mới;
  - (i) đợt có `yeu-cau/P1-7.json` chưa trả lời, không có tin → cwd giám sát không bị chặn;
  - (j) kho git không đợt, không kênh → cả ba khối hook tin thoát 0, stdout và stderr rỗng, băm cây kho và `.acceptance-runs/`
    trước và sau bằng nhau;
  - (k) mọi mục hook có ở `hooks.json` của `main` 3745b3e9 vẫn có, bằng sâu; mục mới duy nhất là ba mục `hook-tin.mjs`.

  Chiều đỏ: bản tiêm bỏ dấu đã chặn → hàng (f) đỏ, nêu «chặn lần hai». Bản tiêm bỏ trần thời gian → hàng (e) đỏ.
- AC-9: Given kho thử có đợt, When dựng kế hoạch `tiep-tuc` cho một dãy `mo-chip`, Then:
  - `ghi_danh` chứa phần sáu dòng do `loiGiaoViec` sinh, bằng từng byte với lời giao của `tin GIAO` cùng đầu vào;
  - Ý định là dòng `Vì sao:` của ô cơ hội trong worktree;
  - hàng không có hồ sơ → hành động `khong-hang`, `ly_do` chứa «thiếu Kết quả», không có `ghi_danh`.

  Ca của hồ sơ đã ký đọc `ghi_danh` vẫn xanh trên bản này (DP3, DP4, ON-DINH-R2, SDT). Chiều đỏ: bản tiêm cho chip mở khi
  thiếu Kết quả → ca nêu «thiếu Kết quả».
- AC-10: Given gói sau vòng, When đọc `dieu-phoi/scripts/mau/LUAT.md` và `dieu-phoi/README.md`, Then:
  - tập khẩu lệnh trong khối `<<<LUAT-TIN … LUAT-TIN>>>` bằng tập `KHAU_LENH` của `tin.mjs` (rút cả hai bên);
  - khối có bảng «làm gì — máy làm gì thay», luật vòng mở, và hai danh sách «Phải HỎI» / «Không hỏi»;
  - mọi dòng lệnh `tin …` trong khối và trong README chạy được `--help`, thoát 0;
  - một phiên thợ mới, chỉ đọc khối này, biết khi nào phải phát NHẬN, khi nào được hỏi, và vòng đóng bằng gì (judgment).

  Chiều đỏ: bản tiêm thêm `DUYỆT` vào khối → ca so tập đỏ, nêu `DUYỆT`.

## Coverage

Quét bằng morphological-scan (preset entity-feature, thực thể = một vòng mở) ở S1, quét lại 18/10 với trục chạm. Chân sản
phẩm từ repo [SUY-TỪ-REPO: dieu-phoi/README.md] và hạt giống [SUY-TỪ-REPO: docs/plans/2026-10-17-hat-giong-luat-giao-tiep-giua-cac-phien.md].
Chân ngành:
- giao tiếp vòng kín [NGÀNH: ICAO Doc 9432 Manual of Radiotelephony — readback, ROGER/WILCO];
- vòng đời việc giữa tác tử [NGÀNH: A2A 1.0 task states SUBMITTED → WORKING → COMPLETED/FAILED/CANCELED/REJECTED];
- xác nhận nhận tin [NGÀNH: AMQP 0-9-1 basic.ack — tin chưa ack thì vẫn thuộc người nhận].

- Trục A · nơi chứa và cạnh: đợt thợ → giám sát (yêu cầu cũ) | đợt thợ → giám sát (`tin`) | đợt giám sát → thợ |
  kênh máy ↔ máy | không đợt, không kênh [thước CE: hạt giống §1.1 bảng ba cạnh — SUY-TỪ-REPO]
- Trục B · vòng đời: chưa đến | đã đến | đã nhận | kẹt | đóng (XONG, TRẢ, HUỶ) | quá hạn mức 1/2 | không mở (BÁO) |
  tin không mã [thước CE: hạt giống §4.1–4.2 + A2A 1.0]
- Trục C · chỗ máy giữ: lúc gửi (điền) | lúc đến (đưa vào phiên) | lúc đáp (so kho, đính vật) | lúc đọc | lúc kết lượt |
  lúc canh | lúc hiện [thước CE: hạt giống §5 bảng răng — SUY-TỪ-REPO]
- Trục D · đường lỗi: không suy được trường | kho lệch | nền hỏng (gh lỗi, gh treo, tin cuối mất) | chặn lặp | kho không
  dùng gói [thước CE: sự cố 15/10, 16/10, 17/10 — hạt giống §2.1]
- Trục E · chạm của người: chủ kho 0 | người giao 1 câu | người nhận 0 | người xong 0 (câu hỏi: 1 câu) [thước CE: chủ kho
  18/10 «trải nghiệm người dùng đơn giản»]
- Core → AC: C(gửi)×E → AC-1 · C(đáp)×D(kho lệch)×E → AC-2 · C(hiện)×B → AC-3 · C(đọc)×D(16/10) → AC-4 · A(kênh) → AC-5 ·
  C(canh)×D(15/10) → AC-6 · C(đến)×B → AC-7 · C(kết lượt)×D(chặn lặp, không dùng) → AC-8 · lời giao ở chip → AC-9 · lời
  → AC-10.
- Đi chéo mọi ô Core: không ghi byte nào khi từ chối; thân tin không bao giờ được phân loại; kho không dùng thì im; hook
  không ghi lên issue.
- Later — phiên thợ mở bằng chip ngoài đợt (Hỏi ở Cổng Phạm vi).
- Later — kiểm hiểu đúng ý định (ngoài kho đúng). Ngưỡng ở Notes.
- Never — kho git làm hộp thư (hạt giống 13/10). Never — khẩu lệnh DUYỆT (ADR 0002).

## Đường đo

- Thước: 14 ngày sau khi crm nhận bản có GT1, không lần nào chủ kho phải hỏi «phiên hay máy kia đã nhận chưa» · số
  từ: đếm tay tin chủ kho gửi phiên điều phối trong bản ghi phiên crm, cùng cách finding 2026-10-05 §4.4 đã đếm · bảo
  đảm bởi: đã có sẵn: bản ghi phiên của app. Reality đọc.
- Thước: mọi yêu cầu (GIAO, HỎI) trên kênh liên máy có trả lời trỏ về mã · số từ: `tin so --kenh <kênh> --tu <ngày crm
  nhận> --json` trên cửa sổ 14 ngày. Lệnh đếm ba nhóm: có mã (vòng còn mở quá hạn mức 2) · khuôn cũ có đích · «bỏ qua»
  kèm danh sách mã bình luận để người đếm tay xem bình luận nào là yêu cầu viết văn xuôi. SỐNG khi cả ba số bằng 0. Dòng
  đo vô hiệu khi tổng bình luận trong cửa sổ bằng 0 · bảo đảm bởi: AC-3, AC-4, AC-5.
- Thước: CHẾT — một phiên bị khoá vì hook chặn mãi · số từ: sổ `ket_luot_chua_nhan` cộng lời chủ kho · bảo đảm bởi: AC-8.
- Thước: CHẾT — bộ canh im khi kênh hỏng · số từ: mã thoát của `tin canh` · bảo đảm bởi: AC-6.
- Thước: chạm mỗi vòng giao việc (một câu giao · 0 nhận · 0 xong) · số từ: ca đếm chạm của AC-1, AC-2 · bảo đảm bởi:
  AC-1, AC-2.

## Out of scope

- Kho git làm hộp thư (hạt giống 13/10, ngưỡng giữ nguyên).
- Danh tính máy có chữ ký; đánh thức phiên đã đóng.
- Phiên thợ mở bằng chip ngoài đợt (chip `start_session` của điều phối, không qua đợt). Vẫn ở Later cho tới khi chủ kho trả
  lời câu hỏi ở Cổng Phạm vi. Cạnh điều phối ↔ điều phối trên kênh #375/#308 KHÔNG thuộc mục này — nó được phủ ở AC-5…AC-8.
  Hệ quả: ngưỡng thứ hai đo trọn; ngưỡng thứ nhất chỉ được bảo đảm cho đợt và kênh, nên lần hỏi về chip ngoài đợt được đếm
  riêng.
- Kiểm thợ hiểu đúng ý định (đọc lại bằng lời của thợ, hạt giống §4.4) — thay bằng máy so kho; giới hạn ở Notes.
- Đổi `loai` hay `kiemYeuCau` của `yeu-cau`; đổi bộ phát lịch; đổi bảy hành động của `tiep-tuc`.
- Đường truyền `send_message` của app; `tin` chỉ là nơi chứa có mã.
- Engine nghiệm thu (`skills/`, `feature-loop/`, `scripts/` gốc); cắt số, gắn tag.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Known limits (nhãn trạng thái, không phải việc):
  - **Hiểu sai ý định lộ muộn hơn** khi bỏ đọc lại bằng lời (kho đúng, việc sai). Ngưỡng: ≥ 1 ca thợ làm lệch ý định mà kho
    khớp và lời giao đủ trường.
  - **Tin tới phiên đang ngủ chỉ đến ở lượt kế của phiên đó.**
  - **Danh tính máy trên issue tự khai** (giới hạn của tệp 13/10).
  - **Hook kênh chỉ thấy tin mới khi đồng bộ được.** Ngưỡng: ≥ 1 ca tin kênh bị sót > 30′ trong khi hook đã báo lỗi kênh.
  - **Hook chỉ xét vòng mở bằng `tin`.** Yêu cầu cũ `yeu-cau/` hiện trên sổ nhưng không làm hook làm gì (luật 26/09).
- Thứ tự (điều phối 17/10): S3 chờ M5 trả lời MBP-1710-1 trên #308. S4 và PR đi sau RD1, không chen vào lô của M5.
- Khoá đo phải thêm vào `_acceptance/config.yaml`. Điều phối cho phép 17/10 (XONG GT1-1710-1): chỉ THÊM khoá mới có tiền
  tố của vòng, kèm một dòng chú thích hồ sơ; không sửa khoá cũ, không đụng `feature_loop.suite_keys`.
- Ba phần CỘNG trình đích danh ở Cổng Phạm vi (ADR 0018): lệnh `tin.mjs` · hook tin (ba chỗ) · lời ghi danh sáu trường
  của chip. Chữ ký Cổng Đáng không phải phê duyệt CỘNG.
