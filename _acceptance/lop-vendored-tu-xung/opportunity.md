---
schema_version: 1
slug: lop-vendored-tu-xung
feature: Lớp vendored tự xưng — tệp khai phiên bản kit kèm băm từng tệp, danh sách chép rút từ một nguồn và gồm bộ đọc bản đồ, một lệnh kiểm chạy trong CI kho, một trang nghi thức nhận bản mới
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Mạnh
decided_at: 2026-09-19T09:29:17Z   # owner gật một chạm trong phiên 19/09 («duyệt mục tiêu 2.17.0 và gọi tên hai ô CỘNG»), máy ghi hộ
prototype:
  base_commit:
  disposition: archive
---

## Vấn đề & ai gặp

Gốc: acceptance-gate-kit/_acceptance/thuoc-co-cua — đường nền 2.16.0 đã băm đúng bộ tệp chép và báo `engine-lech`, nhưng chỉ chạy trong một vòng và so với cache plugin, không so với phiên bản kho đã khai

**Đo trên nhánh gốc của sáu kho, 19/09/2026:** 0/6 kho có vật khai phiên bản kit mình chạy
(chỉ chú thích lỗi thời: «1.31.0», «2.0.0 vendored»). OneFlow 9/9 tệp nhưng cổng là fork
535 dòng; media-library 8/9, các tệp không khớp mốc nào (vá riêng, gốc 2.8/2.9; PR #64
nâng cấp treo draft từ 11/09, bản vá `_vapp` mất hai lần khi chép đè); floorplanstudio 7/9
ở 2.4→2.9; map 1/9 ở 1.3x; crm và artifact-platform khớp byte 2.12→2.16 nhờ chép tay đúng.
Bộ đọc bản đồ (`product-map.mjs` + `trang-thai-ho-so.cjs` + đồ nó kéo theo) KHÔNG nằm trong
bộ chép, executor trỏ vào cache plugin mà CI kho không có → sáu kho bốn kiểu: OneFlow tự viết
bộ kiểm + răng, floorplanstudio một `.sh`, crm/artifact-platform/media-library chép tay không
khoá. Kit phải nói bằng văn xuôi trong CHANGELOG «bộ tệp không đổi, không phải chép lại» vì
không máy nào kiểm (CHANGELOG dòng 69, 143).

Hệ quả đo được ở kit: 18/09 — bảy lần cắt số trong mười ngày, 0 kho nhận; nhận là một lần
hợp nhất tay, không có gì chứng nó đúng.

**Ranh giới:** thứ gì kho thứ hai phải chép lại là của kit. Tệp khai, lệnh kiểm, bộ chép đủ,
nghi thức nhận: của kit. Khối cố định trên bản đồ, thứ tự bước job CI, cụm phạm vi hẹp trong
fork: của OneFlow cho tới khi kho thứ hai cần.

Ô đang xếp lại `danh-sach-chep-ci-thieu-product-map` (ca crm 04/09) gộp vào đây — bộ chép
thiếu bộ đọc bản đồ là một mặt của cùng lỗ. Ca này cũng là lần đầu ngưỡng «dạng neo hẹp»
(CLAUDE.md, 19/09) chạm: bằng chứng ở kho là mã CI và PR, không phải hồ sơ `_acceptance/`;
neo ghi ở đây là hồ sơ kit đã băm bộ tệp.

**Người trả giá:** người nâng kit ở mỗi kho — một lần hợp nhất tay mỗi mốc, và không biết mình
đang chạy bản nào; kit — giá trị không tới kho; người đọc bản đồ ở kho — bốn bộ đọc khác nhau
cho cùng một sự thật.

**Trace:** nguyên tố 2 — «dòng tự xưng của hạ tầng» (dạng nghiệm hiến pháp gọi tên), lời khai
văn xuôi thay bằng vật máy giữ.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Danh sách tệp chép đã có MỘT nguồn (khối chép trong `commands/acceptance-init.md`, đường nền rút từ đó) và chỉ cần nối thêm bộ đọc bản đồ | Có hai danh sách → tệp khai và bộ chép trôi nhau | Grep bên viết/bên đọc cùng marker; mutant thêm một tệp vào khối → tệp khai và đường nền cùng thấy | Chưa thử |
| 2 | Lệnh kiểm chạy được trong CI kho bằng node có sẵn, không cần cache plugin | Kho không kiểm được ở CI → lại văn xuôi | Fixture kho code-sinh: chép bộ tệp + tệp khai → `--check` xanh; đổi một byte một tệp → đỏ có tên tệp; tệp khai nói khớp mà byte lệch → đỏ (fail-open duy nhất) | Chưa thử |
| 3 | Kho chưa có tệp khai chỉ nhận NOTE, không đỏ (đường đọc-cũ) | Sáu kho đỏ ngay khi nhận | Chạy cổng mới trên bản sao crm | Chưa thử |
| 4 | Hợp nhất ba chiều (`--sync`) hoãn được sang cửa sổ kế mà 2.17.0 vẫn nhận được ở ba kho bằng tay + `--check` | Kho có fork (OneFlow) không nhận được | Ba PR nhận ở crm, media-library, OneFlow trong cửa sổ | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: mốc kế có được nhận rẻ và chứng được không?
- Kết quả nào là SỐNG: ba kho (crm · media-library · OneFlow) nhận 2.17.0 bằng PR có `--check`
  xanh trong CI kho; media-library đóng PR #64 bằng bản stock, 0 vá riêng; kit không còn dòng
  văn xuôi «bộ tệp không đổi» ở mốc kế vì tệp khai nói thay.
- Kết quả nào là CHẾT: một kho nhận mà `--check` xanh trong khi byte lệch; hoặc kho chưa nhận
  đỏ CI vì thiếu tệp khai.
- Timebox: ngân sách 3 lượt chấm S4; bảng ba kết cục viết trước lượt 1.

## Kết quả prototype

Không dựng; số đo hiện trạng ở trên, lệnh tái lập ở finding 19/09.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Báo cáo quét «hạng mục kit cần nâng» 19/09 (owner chuyển), mục 2 và 3 | phiên OneFlow | triết-lý/logic | có, sau khi đo lại: số phiên bản kho của báo cáo lấy từ checkout cũ, lớp lỗi giữ; mục 3 gộp vào đây, tiền đề «bỏ --write» sai | — |
| Tiền lệ ngành: `go mod vendor` + `modules.txt`, Nix `flake.lock` | ngoài | triết-lý/logic | có, ý «bản sao có khoá phiên bản CI kiểm được» | — |

## Cổng 0

- **decision = build** (Mạnh, 19/09, một chạm «Gật»; phê duyệt CỘNG đích danh theo ADR 0018).
- **disposition = archive**
- **Ngưỡng UAT chốt cùng lúc ký:** như mục Ngưỡng.

## Thước đo thành công → ứng viên criterion

- Tệp khai phiên bản + băm rút từ cùng khối chép với đường nền (AC một nguồn, có mutant).
- `--check` ba chiều trên fixture code-sinh: khớp → xanh · byte lệch → đỏ tên tệp · tệp khai
  nói khớp mà byte lệch → đỏ (AC hai chiều + fail-open duy nhất).
- Kho không có tệp khai → NOTE có tên, không đỏ (AC đọc-cũ).
- Bộ chép gồm bộ đọc bản đồ và đồ nó kéo theo; fixture kho chạy `product-map --check` bằng bản
  chép, không cần cache (AC đủ bộ).
- Một trang nghi thức nhận bản mới trong GUIDE, mỗi bước là lệnh bấm được (AC tài liệu).

## Hạt giống sinh từ khám phá — SỔ, chưa ô

- `docs/plans/2026-09-19-hat-giong-hop-nhat-ba-chieu-lop-vendored.md` — `--sync` hợp nhất
  ba chiều lấy tổ tiên từ phiên bản trong tệp khai; hoãn sang cửa sổ kế.

## Out of scope từ khám phá

- Không làm `--sync` hợp nhất ba chiều ở vòng này — hạt giống ở trên; 2.17.0 nhận bằng tay
  có `--check` chứng.
- Không nhận bộ kiểm bản đồ của OneFlow làm chuẩn; không thêm khối cố định/`--json` cho bản
  đồ khi chỉ một kho cần.
- Không port cụm phạm vi hẹp 535 dòng của OneFlow — chưa đo kho thứ hai có `paths:`.
- Không đổi thứ tự bước job CI của kho — lỗi cấu hình một kho; GUIDE thêm một câu là đủ.
