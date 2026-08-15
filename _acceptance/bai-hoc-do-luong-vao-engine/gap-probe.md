---
slug: bai-hoc-do-luong-vao-engine
at: 2026-08-14T05:05:00Z
verdict: findings
p0: 3
p1: 6
p2: 4
---

# Gap-probe: bai-hoc-do-luong-vao-engine

Critic context sạch (subagent tươi) chạy **SAU khi owner đã gạch Cổng 1** —
lệch nếp thường, và chính độ lệch ấy là bài học của lượt này: ba P0 dưới đây
đều là *«vật kiểm được ngay bây giờ, và nó không như hồ sơ khai»*, tức chúng
đã có thể chặn một chữ ký nếu probe chạy đúng chỗ. Probe đọc `contract.md` +
`evals.yaml` + sổ nguồn + `measure-birth.md` + `tests/plugins/run-tests.sh`, và
được yêu cầu **đo lại từng con số hồ sơ tự khai**, không chỉ soi lập luận.

Người thi công **kiểm lại từng P0 trên cây và không loại được cái nào**. Cả ba
được sửa vào hợp đồng **TRƯỚC khi viết dòng code đầu tiên**, kèm một entry
`descope` trong `decisions.jsonl` (`d-3`) và một bảng «Sửa sau Cổng 1» trong
`contract.md` — sửa công khai, không sửa lặng lúc thi công.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Xử lý |
|---|---|---|---|---|
| **P0** | contract AC-1 · evals E1 | Ba trong bốn mã finding hồ sơ ghim (`Hb`, `He`, `RB3-03`) **không tồn tại** trong `_acceptance/cat-hinh-thuc/review-findings.md`. Tệp chỉ mang `H1..H15`, `Ha/Hd/Hg/Hj`, `P0-1/P0-2`, `P1-3/P1-4`, `RA3-01/02/09`, `RB3-05`. Duy nhất `RA3-01` khớp | AC-1 tự khai đối chứng «mã finding nêu trong note phải tìm thấy được». Xây E1 đúng như viết thì nó ĐỎ lượt đầu **vì hợp đồng sai**, không vì sổ sai — và người thi công sẽ hoặc sửa hợp đồng sau khi đã duyệt, hoặc nới phép đo cho xanh | **fixed:** AC-1 đổi sang **neo truy được** (`[neo: <chuỗi>]`, chuỗi phải khớp NGUYÊN VĂN). Bốn neo đã tra thật, mỗi chuỗi **đúng 1 hit**: `E5 giữ-gân là HẰNG ĐÚNG` · `E9b «đối chứng dương tự sinh» là HẰNG ĐÚNG` · `chiều đỏ không qua chân canh` · `RA3-01`. Thêm ràng buộc bốn neo **đôi một khác nhau** |
| **P0** | contract AC-2 · evals E2 | Bảng và sổ **hiện tại đã lệch**, hồ sơ không khai: sổ có **10** lớp mang dòng `song`, bảng chỉ **8** hàng — thiếu `do-thuoc` (8 dòng song) và `khac` (41 dòng song) | Chiều (a) của bánh cóc ĐỎ ngay khi cắm vào, độc lập với bốn lớp mới — **phạm vi ẩn**. Tệ hơn: `khac` là ô rác bắt-hết, không có «ca đại diện» cũng không có «khuôn chặn bằng mục nào», nên người thi công bị dồn vào hoặc điền-cho-có, hoặc lặng lẽ thêm miễn trừ mà hợp đồng chưa khai | **fixed:** khai thẳng bảng phải thành 13 hàng (thêm `do-thuoc` + bốn lớp mới); `khac` vào **bản khai miễn trừ** đặt trong chính bảng; AC-2 mọc **chiều (c)** đo bản khai ấy (miễn trừ trỏ lớp không còn dòng sống → ĐỎ) để nó không thành cửa sau |
| **P0** | evals E3 · `pinned` | `pinned: "P177 DUONG-OK"` là chuỗi **đã in ra** trên cây hiện tại (dòng 339 của lượt chạy thật), khi chưa có mục thứ tư nào | E3 XANH trước khi viết một dòng nào; chân đo không phân biệt được «đã ghim đủ 4 mục» với «vẫn đang ghim 3 mục cũ» — đúng lớp «tiêu đề luôn in» | **fixed:** ghim marker MỚI do chính chân mới in: `P177 4MUC-OK` |
| P1 | contract Context | Chẩn đoán «capture đang chạy, vấn đề là bảng không có răng» **sai với chính ca đang xét**: `cat-hinh-thuc/review-findings.md` có **0** dòng `Đề xuất: known-limits` — kênh mà `P179` đếm chưa hề chạy | Bánh cóc bảng↔sổ không chạm kênh đã hỏng. Lần sau lớp mới sinh, findings vẫn không ghi `Đề xuất:`, sổ vẫn thiếu, bảng vẫn khớp sổ → **lưới xanh trên một cái hố** | **fixed (lời):** Context sửa lại — hai chỗ hở, không một. Kênh `findings → sổ` vào **Out of scope** kèm lý do (vá nó là sửa `review-findings.md` của hồ sơ ĐÃ KÝ) + ghi nợ trong hạt giống |
| P1 | evals E8 · AC-4 | Đẳng thức 146 chỉ sống trong văn `expected`; `pinned` là câu tổng kết, không chứng số ca. Ngoài ra probe đo được 144 PASS + 2 failed vì chạy bằng **root** (`P123`/`P129` dùng `chmod 000`) | AC-4 «Then xanh» đỏ ở mốc nền vì lý do hồ sơ không khai → phiên thi công nhìn đỏ sẽ đi tìm cách làm nó xanh, tức đường thẳng tới nới thước | **fixed:** AC-4 khai **tiền đề không-root** (chạy qua `su - tester` → 146/0, đã xác nhận); và hạ lời tuyên «bốn đẳng thức» xuống đúng cái ghim được. 146 khai thẳng là **số người-đối-chiếu kèm lệnh tái lập**, ghi known-limit vào sổ |
| P1 | evals E3 · chiều đỏ thứ hai | «giữ tên mục mà gỡ một neo nội dung → **cũng ĐỎ**» không ghim thông điệp nào — gỡ neo và xoá cả mục cho cùng một màu | Đúng bất biến «assertion âm-tính-một-mình» trong `CLAUDE.md`: chân không phân biệt được hai nguyên nhân | **fixed:** ba chiều đỏ, **ba thông điệp riêng**, và thân ca assert thẳng rằng chúng khác nhau |
| P1 | contract AC-2 | «chỉ dòng SỐNG — `status` chưa đóng» mơ hồ trước enum thật `song / chet / trung` | Màu của AC phụ thuộc một từ chưa định nghĩa; `trung` vào hay ra là do script quyết hộ người | **fixed:** AC-2 viết thẳng `status == 'song'` |
| P1 | contract AC-2 · evals E2 | Không khai **marker** cho mối nối bảng↔máy-đọc; ô lớp dính chú giải (`khong-the-do (hằng-đúng, …)`), `P177` chỉ dò chuỗi `'\| Lớp \|'` | Hình dạng 3 của bài học S4: bên VIẾT và bên ĐỌC trôi khỏi nhau. Đổi format bảng → rút 0 hàng | **fixed:** cặp mốc `MEASURE-BIRTH-CLASS-TABLE` + khuôn ô khai một chỗ (token đầu ô, cắt trước dấu cách/ngoặc) + chiều đỏ xoá mốc phải fail-loud |
| P1 | contract AC-4 | Tuyên «**bốn** đẳng thức số ca» nhưng chỉ `hooks` ghim một con số | Ba trong bốn «đẳng thức» không tồn tại như phép đo — suite có thể mất ca mà lưới vẫn xanh | **fixed:** `scripts` ghim luôn `686 passed, 0 failed` (suite CÓ in số); `plugins`/`workflows` khai thẳng là chỉ ghim câu tổng kết. Lỗ gốc — bản khai bốn số từng sống trong khối `SO-CA-KY-VONG`, tức **răng-hồ-sơ, đã chết khi merge** — ghi known-limit kèm lệnh tái lập, và là bằng chứng sống cho ADR 0011 |
| P2 | evals E1, E2 · `pinned` | Pin chỉ là tiền tố (`"LOP-MOI:"`, `"LOP-BANG:"`); `LOP-MOI: 0/0` vẫn thoả | `expected` khai fail-loud khi rút được 0, nhưng pin không giữ lời ấy | **fixed:** ghim cả mẫu số — `"LOP-MOI: 4/4"`, `"LOP-BANG: 13/13"`, khai TRƯỚC khi thi công và khớp đúng lúc đo |
| P2 | evals E1 · vị trí chân | Chân sổ↔findings đặt trong thân `P177` (chủ đề `measure-birth.md`) trong khi ca của sổ known-limits là `P179`; gốc `got` của `P177` là gốc plugin còn sổ ở gốc repo | `P177` thành ca hổ lốn; dễ nhầm gốc khi ghép đường dẫn sổ | **fixed:** chân AC-1 vào `P179`; `P177` giữ AC-2/AC-3 và đọc sổ bằng `root` (gốc REPO) tường minh. Số ca vẫn không đổi |
| P2 | contract Notes | Trace «nguyên tố 2, người hưởng là MÁY» đứng vững cho AC-2/AC-3, nhưng AC-1 một mình chỉ là *capture* | Trace chung chung nên không lộ ra rằng AC-1 chỉ có giá trị như vế nguồn của bánh cóc | **fixed:** thêm một mục Notes — «AC-1 không tự đứng; nó là vế NGUỒN để AC-2 có cái mà so» |
| P2 | contract AC-1 | Lưới thường trực từ nay phụ thuộc `_acceptance/cat-hinh-thuc/review-findings.md` còn nguyên chỗ | Lưu kho workspace hồ sơ đã ký → lưới đỏ vì lý do không liên quan | **accepted:** tiền lệ `P179` glob `_acceptance/*/review-findings.md`; ghi known-limit `bai-hoc-do-luong-vao-engine#2` kèm lệnh tái lập |

## Phần probe xác nhận SẠCH (đã kiểm trên cây, tin được)

- **Đẳng thức 146 khả thi.** `run()` in đúng **một** dòng `  PASS:` mỗi lượt gọi,
  không phụ thuộc thân ca dài bao nhiêu. Mở rộng thân `P177`/`P179` **không**
  đổi số dòng `PASS:` — chỉ đổi nếu ai đó viết chân mới thành `run`/`pass` riêng.
- **Marker mới in được ra stdout.** `run()` không nuốt stdout, nên
  `LOP-MOI:` / `LOP-BANG:` / `P177 4MUC-OK` là chuỗi ghim được thật.
- **`P182` không xung đột** — nó đòi thân mỗi ca `[MBC]` chứa `P<N> DUONG-OK` và
  `P<N> MUTANT-OK`; mở rộng thân giữ nguyên cả hai.
- **`P174`/`P175` không xung đột** — khối `MEASURE-BIRTH-CLAUSE` trong SKILL
  không đếm số mục.
- **`P179` không bị phá** — nó chỉ ghim `len(rows) >= corpus_count`; thêm dòng
  làm vế trái to hơn.
- **Out of scope không giấu việc** — cả bốn mục đều thật sự không cần để AC-1..4 đạt.
- **Lời khai «không răng-chết-theo-hồ-sơ» là thật** — `evals.yaml` không có khoá
  `executors.script.<slug>_rang` nào.
- **Câu hỏi Cổng 1 trong Coverage là khoảnh khắc quyết thật** — hai lối ra (a)/(b)
  đều sống, có đánh đổi thật. Đúng nguyên tố 3, không phải trạm thu phí.

## Bài học của chính lượt probe này

Probe chạy **sau** chữ ký Cổng 1 và vẫn tìm ra ba lời khai sai về vật — nghĩa là
chữ ký ấy đã được đặt trên ba con số chưa ai đo lại. Không cái nào cần đọc mã
nguồn để bác: `grep` một mã finding, `awk` một cột `status`, chạy suite một lượt.
Nếp rút ra cho vòng sau: **mọi con số hồ sơ tự khai phải được đo lại bởi một mắt
khác TRƯỚC cổng, không phải sau** — và thứ tự đúng là probe → Cổng 1 → thi công.
