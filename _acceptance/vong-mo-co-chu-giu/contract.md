---
schema_version: 1
feature: Mỗi yêu cầu giữa các phiên — giám sát và thợ, máy và máy — có mã và hạn biên nhận, chỉ đóng khi có XONG kèm vật, TRẢ hay HUỶ; phiên không kết lượt khi còn tin gửi mình chưa nhận; lời giao việc thiếu kết quả hay ranh giới thì không mở chip
slug: vong-mo-co-chu-giu
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: verified
design_doc: docs/superpowers/specs/2026-10-17-vong-mo-co-chu-giu-design.md
approved_by: Manh Phan
approved_at: 2026-10-18
---

# Acceptance Contract: vong-mo-co-chu-giu

## Context

Hàng GT1 của lộ trình kit. Chủ kho ký Cổng Đáng 17/10 với dòng «đáng: build · ngưỡng: nhận». Lý do làm: hôm nay chỉ
cạnh thợ → giám sát trong đợt có máy giữ vòng. Cạnh giám sát → thợ và cạnh máy ↔ máy đóng vòng bằng trí nhớ. Đo 17/10:
0/44 yêu cầu trên hai kênh liên máy có trả lời trỏ về được tin gốc. Ràng buộc trải nghiệm, chủ kho đặt 18/10: nghi thức
do máy gánh. Chủ kho không gõ khẩu lệnh nào. Phiên chỉ nói điều chỉ nó biết: một câu ý định khi giao, một câu «sẽ giao»
khi nhận, một câu trả lời khi được hỏi. Cùng ngày chủ kho chọn thang giao tiếp chín nấc: đã nói · đã tới · đã nghe · đã
hiểu · đã đáp · đã hứa · đang làm · đã giao · người giao chấp nhận (thiết kế §2.1). GIAO leo đủ chín nấc; HỎI tới nấc
đáp rồi xong; BÁO dừng ở nấc đã nghe.

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
  - (g) `tin DUYỆT …` → thoát 1, nêu đủ chín khẩu lệnh hợp lệ, 0 byte ghi.
  - (h) cwd là worktree ngoài dãy, không phải giám sát → thoát 1, nêu «không thuộc đợt», 0 byte ghi.
  - (i) thư mục đợt đã có `yeu-cau/P1-7.json` → mã của (f) vẫn có ba khúc, không trùng `P1-7`.
  - (j) ma trận nguồn suy của Kết quả và Ranh giới, mỗi hàng so bằng nhau với giá trị viết trong ca: P2 đang giữa
    `hang-a` (hồ sơ `implemented` trong worktree) và còn `hang-b` phía sau → `hang-a` · P2 chưa vào hàng nào → `hang-b` ·
    P2 hết hàng → thoát 1 «không suy được Kết quả» · `--hang hang-b` khi đang giữa `hang-a` → `hang-b` · `--ket-qua "<câu>"`
    khi máy đã suy được → Kết quả là đúng câu đó.
  - (k) hạn xong, một khuôn: lời giao ghi `Hạn xong: <n> phút sau khi nhận`, lời nhận ghi `Hạn xong: <mốc ISO>` = lúc NHẬN
    + n phút. Ma trận, mỗi hàng so bằng nhau với giá trị tính trong ca:
    - lời giao trọn hàng (chip, hoặc `--hang hang-b`), hàng có giờ máy trong `du-bao.json` → n = cận trên giờ máy × 60;
    - lời giao trọn hàng, hàng không có giờ máy → `Hạn xong: chưa có hạn`;
    - việc lẻ (không `--hang`) → `chưa có hạn`;
    - việc lẻ kèm `--han-xong 90` → n = 90.

  Đếm chạm (a) = 1, (f) = 1, in ra. Chiều đỏ: bản tiêm luôn lấy hàng kế → hàng «đang giữa hang-a» của (j) đỏ. Chiều đỏ: bản tiêm bỏ dòng `Ranh giới:` khỏi `loiGiaoViec` → hàng (a) đỏ, nêu
  «Ranh giới:».
- AC-2: Given các vòng mở ở AC-1, When đáp bằng `tin NHẬN|XONG|KẸT|TRẢ|HUỶ|MỞ LẠI` theo ma trận viết sẵn, Then mỗi hàng khớp,
  số hàng in ra.
  - (a) P2 `tin NHẬN G-<ddmm>-1 "sẽ giao <một câu>"` (1 chạm) → thoát 0. Dòng đầu bằng `NHẬN G-<ddmm>-1 · P2 → G`. Thân có
    `Sẽ giao:` là đúng câu đó và `Hạn xong:` lấy từ lời giao. Sổ của G đặt câu ấy cạnh `Ý định:` của vòng.
  - (a′) câu «sẽ giao» phải là đúng MỘT câu, mở đầu «sẽ giao», sau đó có ít nhất ba từ nội dung. Bốn hàng thoát 1, nêu
    «sẽ giao», 0 byte ghi: không kèm câu · `"ok"` · chỉ `"sẽ giao"` · hai câu. NHẬN kèm `--xong-luc <mốc ISO>` → `Hạn xong:`
    là mốc ấy. NHẬN một HỎI không kèm gì → thoát 0.
  - (b) trên kênh: `MBP` giao `M5` với `--kho thu/kho-b`. `M5` NHẬN trong worktree `thu/kho-b` → thoát 0, Ranh giới ghi
    `thu/kho-b` (so bằng nhau). `M5` NHẬN trong `thu/kho-a` → thoát 1, nêu cả hai kho và lệnh `tin KẸT`, 0 byte ghi.
  - (c) P2 commit một thay đổi sau khi NHẬN, cây sạch, rồi `tin XONG G-<ddmm>-1` (0 chạm), kênh giả có PR cho nhánh → thân
    chứa sha HEAD, tên nhánh và đường PR, so bằng nhau với `git rev-parse HEAD`, `git branch --show-current` và PR của tệp ca.
    Sha ấy khác sha máy ghi lúc NHẬN.
  - (d) như (c), không có PR → thân có sha và nhánh, không có dòng PR, không lỗi.
  - (e) XONG mà thiếu một trong ba điều kiện → thoát 1, đòi `--vat`, nêu đúng điều thiếu, 0 byte ghi; thêm `--vat "<…>"`
    → thoát 0, thân là đúng câu đó. Ba hàng: HEAD bằng sha lúc NHẬN («chưa có commit mới») · cây bẩn («cây chưa sạch») ·
    trên kênh, `M5` gõ XONG từ worktree giữ kênh trong khi việc khai `--kho thu/kho-b` («kho lệch»).
  - (f) `G` `tin XONG P1-<ddmm>-1` không câu trả lời → thoát 1, nêu «câu trả lời»; có câu → thoát 0.
  - (g) P1 (không phải người nhận) `tin XONG G-<ddmm>-2` → thoát 1, nêu «không phải người nhận».
  - (h) P2 `tin HUỶ G-<ddmm>-2 "<lý do>"` → thoát 1, nêu «chỉ người giao».
  - (i) `tin NHẬN P9-0101-1` → thoát 1, nêu «không có vòng».
  - (j) đáp `KẸT` cho vòng đã XONG ở (c) → thoát 1, nêu «đã giao» và «MỞ LẠI là của người giao».
  - (k) `tin KẸT <mã>` không câu → thoát 1, nêu «cần gì».
  - (l) `tin TRẢ <mã> "<lý do>"` không `--chuyen` → thoát 1, nêu `--chuyen`.

  - (m) MỞ LẠI: sau khi XONG của (c) được chấp nhận (AC-7 (j)), `G` chạy `tin MỞ LẠI G-<ddmm>-1 "<vì sao>"` → thoát 0, vòng
    về `mo-lai`, cần một XONG mới. Không kèm câu → thoát 1, nêu «vì sao». P2 (không phải người giao) gõ → thoát 1, nêu
    «chỉ người giao». Quá 24 giờ sau lúc chấp nhận (đồng hồ giả) → thoát 1, nêu «quá 24 giờ». Sau MỞ LẠI, P2 gõ `tin XONG`
    mà HEAD vẫn là sha của lần XONG bị mở lại → thoát 1, nêu «chưa có commit mới», 0 byte ghi; commit mới rồi XONG → thoát 0.
    Vòng mở lại có `Hạn xong` mới = lúc MỞ LẠI + đúng khoảng hạn cũ (so bằng nhau).

  Mọi hàng thoát 1 đều 0 byte ghi. Đếm chạm (a) = 1, (c) = 0, in ra. Chiều đỏ, mỗi chiều sau khi bản lành xanh:
  - bản tiêm không đổi mốc so sau MỞ LẠI → hàng «XONG sau MỞ LẠI mà HEAD chưa đổi» của (m) đỏ;
  - bản tiêm chỉ kiểm câu «sẽ giao» có mặt → hàng `"ok"` của (a′) đỏ;
  - bản tiêm bỏ so kho → hàng (b) đỏ, nêu «(b)». Đối chứng: bản tiêm bỏ kiểm danh tính mà giữ so kho → hàng (b) vẫn xanh,
    tức (b) đo đúng bước so kho;
  - bản tiêm bỏ kiểm «HEAD có commit mới» → hàng «chưa có commit mới» của (e) đỏ;
  - bản tiêm bỏ kiểm người nhận → hàng (g) đỏ.
- AC-3: Given kho thử với chuỗi tin dựng bằng CHÍNH các lệnh `tin` (không viết tay dòng nào), và đồng hồ giả qua
  `DIEU_PHOI_NOW_MS`, When chạy `tin so --json` và `xem --json`, Then sổ khớp từng mục với bảng viết sẵn trong ca:
  - mỗi mục mang `nac` (0–8) và `trang_thai` theo bảng viết sẵn: `chua-den` (1) → `da-den` (2) → `da-nhan` (5, đã hiểu
    và đã hứa) | `ket` (6) → `cho-chap-nhan` (7, XONG chưa đến phiên người giao) → `da-chap-nhan` (8, đóng); `mo-lai` về 5;
  - TRẢ, HUỶ và `da-chap-nhan` → không còn trong sổ mở (còn trong `tin so --tat-ca`); BÁO không bao giờ vào sổ mở; thứ tự
    theo tuổi, cũ trước;
  - quá hạn xong: vòng `da-nhan` có `Hạn xong` qua hạn → `qua_han_xong` 1, qua hai lần hạn → 2; vòng không có hạn → 0;
    hồ sơ của hàng đang chờ cổng người (`draft` đã có thẻ, hoặc `verified` chưa ký) → đồng hồ hạn ngừng, `qua_han_xong` bằng
    giá trị tính trong ca; vòng `mo-lai` dùng hạn mới (AC-2 (m));
  - mức quá hạn: 0 ở phút 29, 1 ở phút 31, 2 ở phút 61 khi hạn mặc định 30′; GIAO khai `--han 10`: 1 ở phút 11, 2 ở phút
    21; vòng đã NHẬN luôn 0. Bảy hàng in ra;
  - ở phút 61, mục của `xem --json` mang mã và mức 2 bằng mục của `tin so --json`, và `xem` dạng chữ chứa mã ấy;
  - `yeu-cau/P1-7.json` không có `tra-loi` → mục `HỎI P1-7 · P1 → G`; thêm `tra-loi/P1-7.json` → mục biến mất. `yeu-cau/`
    và `tra-loi/` không đổi một byte (so băm).

  Chiều đỏ: bản tiêm cho KẸT đóng vòng → mục `ket` biến mất, ca nêu tên mục. Bản tiêm bỏ nhánh đọc tin trong `xem` → ca
  `xem` đỏ, nêu mã. Bản tiêm cho XONG đóng vòng ngay khi ghi → mục `cho-chap-nhan` biến mất, ca nêu «chấp nhận một phía».
- AC-4: Given bộ đọc dòng đầu `docDongDau`, When đọc ma trận văn bản viết sẵn, Then mỗi hàng khớp, số hàng in ra. Ma trận
  gồm hai ca thật ngày 16/10 (chép dòng đầu và thân, tên kho tiêu thụ thay bằng `kho-tieu-thu`) và các ca biên:
  - (a) thân có «XONG MBP-1710-1» mà dòng đầu là BÁO → không đóng vòng `MBP-1710-1`;
  - (b) dòng đầu «#453 chưa gọi lượt» → không khẩu lệnh nào;
  - (c) `xong MBP-1710-1` viết thường → không khẩu lệnh nào;
  - (d) `NHẬN` dạng NFD → đọc như `NHẬN`;
  - (e) `HỦY` → đọc như `HUỶ`;
  - (f) dòng đầu khuôn cũ `[MacBook Pro · Điều phối → M5 · Điều phối] gọi lượt` → `cu: true`, không vòng;
  - (g) tin rỗng → bỏ qua, không ném lỗi;
  - (h) `MỞ LẠI G-1810-1 · G → P2` dạng NFC và dạng NFD → khẩu lệnh `MỞ LẠI`; hai dấu cách giữa hai từ → `MỞ LẠI`; `MỞ`
    đứng một mình → không khẩu lệnh nào.

  Trên kênh giả có lẫn tin khuôn cũ, `tin so` in «tin không mã — không theo dõi vòng: <k>», với k đúng số tin khuôn cũ.
  Chiều đỏ: bản tiêm phân loại trên cả thân → hàng (a) đỏ. Bản tiêm chỉ lấy từ đầu của dòng → hàng (h) đỏ.
- AC-5: Given kênh giả và hai trạng thái cục bộ (máy `MBP`, máy `M5`), When chạy round-trip, Then:
  - `tin GIAO --kenh` đăng đúng một bình luận;
  - kênh có 35 bình luận sẵn: `tin so --kenh` lần một đọc 36, lần hai (sau khi thêm 2) xin từ mốc con trỏ: nhật ký gh
    giả ghi đúng 3 bình luận trả về (2 mới + 1 ở mốc), bản đồng bộ cục bộ nhận đúng 2 bình luận mới, không bình luận nào
    ghi hai lần. Con trỏ bằng mã bình luận cuối;
  - vòng do `MBP` mở, `M5` NHẬN rồi XONG bằng `tin … --kenh`: sổ của `M5` ghi nấc 7, không còn nghĩa vụ nào; sổ của `MBP` có
    mục `cho-chap-nhan` cho tới khi hook ở worktree giữ kênh của `MBP` đưa XONG vào phiên, rồi mục ấy thành `da-chap-nhan`;
    nhật ký gh giả có 0 lời gọi ghi trong lượt hook. `MBP` gõ `tin MỞ LẠI <mã> "<vì sao>" --kenh` → đúng một bình luận mới,
    sổ `M5` (sau đồng bộ) đưa vòng về `mo-lai`;
  - `tin so --kenh --tu <ngày> --json` trên ma trận cửa sổ viết sẵn — một vòng có XONG · một vòng có XONG rồi MỞ LẠI chưa
    có XONG mới · một vòng KẸT chưa quá hạn · một vòng mở quá hạn mức 2 · một vòng mở chưa quá hạn · một BÁO · một tin
    khuôn cũ có đích · một bình luận văn xuôi không phải yêu cầu · một bình luận trước `<ngày>` — cho `{vong_da_dong: 1,
    vong_mo_qua_han_2: 1, vong_mo_chua_qua_han: 3, khuon_cu_co_dich: 1, bo_qua: 1, bo_qua_ma: [<mã>]}` so bằng nhau (vòng
    mở lại và vòng kẹt đếm vào `vong_mo_chua_qua_han`, không vào `vong_da_dong`), và dòng phán quyết bằng chuỗi viết trong ca cho bốn ca: CHẾT · «cần đếm
    tay 1 bình luận» · SỐNG · VÔ HIỆU (cửa sổ rỗng);
  - ma trận văn bản AC-4 qua nơi chứa đợt và qua kênh giả cho kết quả bằng nhau (một hàm phân loại).

  Chiều đỏ: bản tiêm bỏ con trỏ → lượt hai đọc 38, ca nêu «38 ≠ 2». Bản tiêm đếm mọi bình luận có mã vào
  `vong_mo_qua_han_2` → ca cửa sổ đỏ, nêu «vòng đã đóng». Bản tiêm bỏ `--paginate` → lượt một đọc 30, ca nêu
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
- AC-7: Given kho thử có đợt và kênh giả, When chạy CHÍNH lệnh của khối `PostToolUse` và khối `UserPromptSubmit` của
  `dieu-phoi/hooks/hooks.json` (hai hook đã có, nay gọi thêm phần đưa tin), với stdin dựng như Claude Code theo ma trận,
  Then mỗi hàng khớp, số hàng in ra:
  - (a) cwd P2, có `G-<ddmm>-1` chưa đến → stdout JSON có `hookSpecificOutput.additionalContext`, chứa mã, dòng đầu, thân và
    lệnh `tin NHẬN G-<ddmm>-1`. Sổ ghi `da-den`;
  - (b) gọi lần hai cùng tin → không còn `additionalContext` cho tin ấy;
  - (c) cwd P1 (không phải người nhận) → stdout rỗng;
  - (d) cwd giữ kênh `MBP`, bản đã đồng bộ có tin gửi `MBP` → đưa vào ngữ cảnh. Nhật ký gh giả có 0 lời gọi trong lượt hook;
  - (e) vòng `G` gửi chạm mức 1, cwd giám sát → nơi chứa có đúng một BÁO «nhắc <mã>»; gọi lại → vẫn một;
  - (f) vòng `MBP` gửi trên kênh chạm mức 1 → ngữ cảnh chứa lệnh `tin nhac <mã>`, nhật ký gh giả có 0 lời gọi ghi;
  - (g) như (a) nhưng stdin mang danh tính tác tử con (khuôn Claude Code ghi trong ca) → stdout rỗng, sổ vẫn `chua-den`;
    lần gọi kế từ phiên chính mới đưa tin;
  - (h) nhanh khi không có tin, đo trên hai kho tạm do code sinh (có đợt không tin · không đợt), không dùng checkout kit:
    30 lần gọi trọn hook-nhip của bản này và 30 lần của bản `3745b3e9` (`git archive`), chạy XEN KẼ (cũ, mới, cũ, …), mỗi
    lần một tiến trình mới (tính cả chi phí nạp phần tin). Chênh trung vị ≤ 20 ms, in ra cả hai dãy số. Nếu chênh nằm trong
    20–30 ms thì đo lại một lượt nữa và lấy lượt thấp hơn; ngoài 30 ms thì đỏ;
  - (i) hỏng không lan, bốn hàng: `tin.jsonl` có một dòng hỏng · thư mục đợt không đọc được · bản sao gói có `tin.mjs` ném
    lỗi ngay lúc nạp · bản sao gói thiếu một tệp mà `tin.mjs` nhập. Ở mọi hàng, hook-nhip vẫn ghi nhịp và nhắc bàn giao đúng
    như bản `3745b3e9` (so bằng nhau), không có `additionalContext` tin, và qua ba lần gọi có đúng MỘT `systemMessage` nêu
    «không đọc được hộp tin». Sửa lại → lần gọi kế đưa tin bình thường;
  - (j) lời đáp cũng là tin: XONG của P2 gửi `G` → hook ở phiên `G` đưa XONG (kèm vật) vào ngữ cảnh đúng một lần; sổ đổi
    vòng từ `cho-chap-nhan` sang `da-chap-nhan` và ghi lúc chấp nhận; trước lần đưa ấy, vòng vẫn `cho-chap-nhan` dù XONG đã
    ghi. NHẬN của P2 cũng được đưa về phiên `G` kèm câu «sẽ giao»;
  - (k) MỞ LẠI của `G` được đưa vào phiên P2 đúng một lần, kèm câu vì sao và lệnh XONG chép được.

  Hệ quả nếu thiếu (h), (i): mỗi lời gọi công cụ của mọi phiên có gói trên ba máy crm chậm đi, và một tệp hỏng làm mọi phiên
  bị nhồi lỗi ở mỗi lời gọi.

  Chiều đỏ: bản tiêm nhập phần tin tĩnh thay vì nạp động trong khối bắt lỗi → hai hàng nạp lỗi của (i) đỏ, nêu «nhịp».
  Bản tiêm bỏ dấu «đã đưa» → hàng (b) đỏ, nêu «đưa lần hai». Bản tiêm chấp nhận khi XONG chưa đến phiên người
  giao → hàng (j) đỏ, nêu «chấp nhận trước khi nghe». Bản tiêm bỏ kiểm tác tử con → hàng (g) đỏ. Bản
  tiêm thêm 50 ms chờ vào `duaTin` → hàng (h) đỏ, nêu số đo. Bản tiêm bỏ dấu «lỗi đã báo» → hàng (i) đỏ, nêu «3 lần».
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
  - (k) mọi khối và mục hook có ở `hooks.json` của `main` 3745b3e9 vẫn có, bằng sâu; thứ mới duy nhất là khối `Stop` gọi
    `hook-tin.mjs`;
  - (l) công tắc: `tin tat` ở worktree P2 → với tin chờ ở (a), cả ba chỗ hook (sau lời gọi công cụ, lời nhắc, dừng) cho
    stdout rỗng; sổ vẫn ghi tin; `xem --json` liệt P2 đang tắt. `tin bat` → lần gọi kế đưa tin và chặn như thường. Hệ quả
    nếu thiếu: phiên đang gấp chỉ còn cách gỡ gói, tắt luôn mọi hook khác của gói.

  Chiều đỏ: bản tiêm bỏ dấu đã chặn → hàng (f) đỏ, nêu «chặn lần hai». Bản tiêm bỏ trần thời gian → hàng (e) đỏ. Bản tiêm
  bỏ kiểm dấu tắt ở khối Stop → hàng (l) đỏ.
- AC-9: Given kho thử có đợt, When dựng kế hoạch `tiep-tuc` cho một dãy `mo-chip`, Then:
  - `ghi_danh` chứa phần sáu dòng do `loiGiaoViec` sinh, bằng từng byte với lời giao của `tin GIAO` cùng đầu vào;
  - Ý định là dòng `Vì sao:` của ô cơ hội trong worktree;
  - hàng chưa có hồ sơ → chip vẫn mở, dòng Ý định là «đọc hồ sơ <slug>»; dãy không có hàng nào → `khong-hang`, không
    có `ghi_danh`.

  Ca của hồ sơ đã ký đọc `ghi_danh` vẫn xanh trên bản này (DP3, DP4, ON-DINH-R2, SDT). Chiều đỏ: bản tiêm cho chip mở khi
  thiếu Kết quả → ca nêu «thiếu Kết quả».
- AC-10: Given gói sau vòng, When đọc `dieu-phoi/scripts/mau/LUAT.md` và `dieu-phoi/README.md`, Then:
  - tập khẩu lệnh trong khối `<<<LUAT-TIN … LUAT-TIN>>>` bằng tập `KHAU_LENH` của `tin.mjs` (rút cả hai bên);
  - khối có bảng thang chín nấc (nấc · nghĩa · ai làm · máy giữ bằng gì) với đúng chín hàng rút được, bảng «làm gì — máy
    làm gì thay», luật vòng mở, và hai danh sách «Phải HỎI» / «Không hỏi»;
  - mọi dòng lệnh `tin …` trong khối và trong README chạy được `--help`, thoát 0;
  - một phiên thợ mới, chỉ đọc khối này, biết khi nào phải phát NHẬN và phải kèm gì, khi nào được hỏi, và vòng đóng bằng gì
    (judgment).

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
- Trục B · vòng đời (thang chín nấc): đã nói | đã tới | đã nghe | đã hiểu + đã đáp + đã hứa (NHẬN kèm câu, hạn) | đang
  làm / kẹt | đã giao | chấp nhận | mở lại | đóng khác (TRẢ, HUỶ) | quá hạn nhận / quá hạn xong | không mở (BÁO) |
  tin không mã [thước CE: hạt giống §4.1–4.2 + A2A 1.0]
- Trục C · chỗ máy giữ: lúc gửi (điền) | lúc đến (đưa vào phiên) | lúc đáp (so kho, đính vật) | lúc đọc | lúc kết lượt |
  lúc canh | lúc hiện [thước CE: hạt giống §5 bảng răng — SUY-TỪ-REPO]
- Trục D · đường lỗi: không suy được trường | kho lệch | nền hỏng (gh lỗi, gh treo, tin cuối mất) | chặn lặp | kho không
  dùng gói [thước CE: sự cố 15/10, 16/10, 17/10 — hạt giống §2.1]
- Trục E · chạm của người: chủ kho 0 | người giao 1 câu | người nhận 1 câu «sẽ giao» | người xong 0 (câu hỏi: 1 câu) |
  người giao chấp nhận 0, mở lại 1 câu [thước CE: chủ kho 18/10 «trải nghiệm người dùng đơn giản» và «thang chín nấc»]
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
  nhận> --json` trên cửa sổ 14 ngày; lệnh in thẳng phán quyết: CHẾT khi `vong_mo_qua_han_2 + khuon_cu_co_dich > 0` · «cần
  đếm tay <k> bình luận» khi `bo_qua > 0` (người đọc `bo_qua_ma`, đếm bình luận nào là yêu cầu viết văn xuôi; mỗi yêu cầu
  như vậy tính như một vòng không trỏ mã) · SỐNG khi các số kia bằng 0 và tổng > 0 · VÔ HIỆU khi cửa sổ rỗng · bảo đảm
  bởi: AC-3, AC-4, AC-5.
- Thước: CHẾT — một phiên bị khoá vì hook chặn mãi · số từ: sổ `ket_luot_chua_nhan` cộng lời chủ kho · bảo đảm bởi: AC-8.
- Thước: CHẾT — bộ canh im khi kênh hỏng · số từ: mã thoát của `tin canh` · bảo đảm bởi: AC-6.
- Thước: chạm mỗi vòng giao việc (một câu giao · một câu nhận · 0 xong · 0 chấp nhận) · số từ: ca đếm chạm của AC-1,
  AC-2 · bảo đảm bởi: AC-1, AC-2.

## Out of scope

- Kho git làm hộp thư (hạt giống 13/10, ngưỡng giữ nguyên).
- Danh tính máy có chữ ký; đánh thức phiên đã đóng.
- Phiên thợ mở bằng chip ngoài đợt (chip `start_session` của điều phối, không qua đợt). Vẫn ở Later cho tới khi chủ kho trả
  lời câu hỏi ở Cổng Phạm vi. Cạnh điều phối ↔ điều phối trên kênh #375/#308 KHÔNG thuộc mục này — nó được phủ ở AC-5…AC-8.
  Hệ quả: ngưỡng thứ hai đo trọn; ngưỡng thứ nhất chỉ được bảo đảm cho đợt và kênh, nên lần hỏi về chip ngoài đợt được đếm
  riêng.
- Máy tự phán câu «sẽ giao» có khớp ý định không — máy chỉ đặt hai câu cạnh nhau cho người giao thấy (hạt giống §5: so
  khớp đọc lại là phán xét).
- Đổi `loai` hay `kiemYeuCau` của `yeu-cau`; đổi bộ phát lịch; đổi bảy hành động của `tiep-tuc`.
- Đường truyền `send_message` của app; `tin` chỉ là nơi chứa có mã.
- Engine nghiệm thu (`skills/`, `feature-loop/`, `scripts/` gốc); cắt số, gắn tag.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Known limits (nhãn trạng thái, không phải việc):
  - **Khớp «sẽ giao» với ý định là phán xét của người giao**, máy không tự so. Ngưỡng: ≥ 1 ca thợ làm lệch ý định mà câu
    «sẽ giao» đã khai đúng.
  - **Chấp nhận bằng im lặng** đóng vòng khi người giao đã thấy XONG mà không đọc kỹ; cửa MỞ LẠI 24 giờ. Ngưỡng: ≥ 1 ca vòng
    đóng sai mà quá 24 giờ mới phát hiện.
  - **Tin tới phiên đang ngủ chỉ đến ở lượt kế của phiên đó.**
  - **Nhận biết tác tử con dựa vào khuôn stdin của Claude Code**, ca kiểm chạy trên khuôn ghi trong ca. Ngưỡng: ≥ 1 ca tin bị
    đưa vào tác tử con.
  - **So kho khi nhận việc chỉ bắt được nhầm kho trên kênh**, khi người giao khai đúng `--kho`.
  - **Danh tính máy trên issue tự khai** (giới hạn của tệp 13/10).
  - **Hook kênh chỉ thấy tin mới khi đồng bộ được.** Ngưỡng: ≥ 1 ca tin kênh bị sót > 30′ trong khi hook đã báo lỗi kênh.
  - **Hook chỉ xét vòng mở bằng `tin`.** Yêu cầu cũ `yeu-cau/` hiện trên sổ nhưng không làm hook làm gì (luật 26/09).
- Thứ tự (điều phối 17/10): S3 chờ M5 trả lời MBP-1710-1 trên #308. S4 và PR đi sau RD1, không chen vào lô của M5.
- Khoá đo phải thêm vào `_acceptance/config.yaml`. Điều phối cho phép 17/10 (XONG GT1-1710-1): chỉ THÊM khoá mới có tiền
  tố của vòng, kèm một dòng chú thích hồ sơ; không sửa khoá cũ, không đụng `feature_loop.suite_keys`.
- Ba phần CỘNG trình đích danh ở Cổng Phạm vi (ADR 0018): lệnh `tin.mjs` · hook tin (ba chỗ) · lời ghi danh sáu trường
  của chip. Chữ ký Cổng Đáng không phải phê duyệt CỘNG.
