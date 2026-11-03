---
schema_version: 1
feature: Thẻ Cổng Phạm vi và Cổng Bằng chứng có khối «Khuôn» đọc từ vật S1 và lượt chấm ghi; S1 ghi đã chọn nhóm nào và đọc màn mẫu nào; màn mới chỉ thêm một câu hỏi ở cổng sẵn có
slug: khoi-khuon-tren-the-cong
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: approved
approved_by: Phan Le Manh
approved_at: 2026-11-03T14:49:55Z
design_doc: _acceptance/khoi-khuon-tren-the-cong/design.md
---

# Acceptance Contract: khoi-khuon-tren-the-cong

## Context

Hàng KH2 của lộ trình kit, mở từ mục chờ KH-C2. Chủ kho gõ «Mở KH-C2 ngay» ngày 03/11, gọi tên một vòng meta theo luật
chiều rộng (b). Gốc là hồ sơ `_acceptance/khuon-loi/` (KH1): đã ký, phát hành v2.37.0. Thiết kế nằm ở design doc trong
frontmatter.

Thuật ngữ:

- **kho mẫu**: kho git tạm do ca đo dựng trong lượt bằng `tests/scripts/khuon-loi-kho-mau.mjs`. Có ba nhóm (`bang-du-lieu`,
  `form-nhap`, `trang-thai`) và màn mẫu là tệp có thật trong kho.
- **bước nạp**: `node scripts/design-floor-khuon.mjs --nap --root <kho> --slug <s>`.
- **thẻ Cổng 1 / thẻ Cổng 2**: `node scripts/gate-card.js --root <kho> --slug <s> --gate 1|2`. Mỗi thẻ có hai dạng: HTML
  và `--extract`.

## Criteria

- AC-1: Ghi lựa chọn nhóm.
  - Given kho mẫu, When bước nạp chạy kèm `--nhom bang-du-lieu`, Then `khuon-nap.json` mang `chon` gồm `nhom`, `tep` của
    tệp bản đồ, `mau.tep` và `mau.bam`. `mau.bam` bằng `git hash-object` của màn mẫu.
  - Bước nạp không kèm cờ chọn ra tệp bằng từng byte bản KH1, không có `chon`.
  - `--nhom` mang tên nhóm không có → thoát 2, liệt tên các nhóm có, không ghi tệp.
  - Màn mẫu vắng trên đĩa → `mau.bam: null` và một dòng «màn mẫu không có trên đĩa».
  - `--nhom` cùng `--nhom-moi` → thoát 2.
  - Chiều đỏ: bản sao lệnh bỏ ghi `mau.bam` → hàm kiểm nêu «thiếu băm màn mẫu».
- AC-2: Màn mới thành đúng một câu hỏi.
  - Given kho mẫu, When bước nạp chạy kèm `--nhom-moi bao-cao-tuan --gan bang-du-lieu`, Then `chon` mang
    `moi: bao-cao-tuan` và `gan: bang-du-lieu`. Lệnh in một dòng giữa cho khối `DEC-ID-RECIPE`.
  - Nối dòng ấy vào sổ bằng đúng khối lệnh rút từ SKILL thì:
    - `can-cu-s1.cjs` đếm thêm đúng một câu hỏi;
    - `routing.hoi` của thẻ Cổng 1 thêm đúng một nhãn «Hỏi-n», và mục cùng nhãn trong `can_cu.cau_hoi` nhắc `bao-cao-tuan`;
    - `one_shot` không có nhãn nào mới so với hồ sơ trước khi nối.
  - Vắng `--gan` → dòng in ra có lối khác «để màn ngoài bản đồ», `can-cu-s1.cjs` vẫn đếm nó là câu hỏi có hai lối.
  - Tên nhóm mới sai khuôn → thoát 2.
  - Chiều đỏ: bản sao in `can_cu.nguon: muc-tieu` → hàm kiểm nêu «nhóm mới không thành câu hỏi»; bản sao bỏ lối khác
    khi vắng `--gan` → hàm kiểm nêu «câu hỏi một lối».
- AC-3: Khối «Khuôn» trên thẻ Cổng 1.
  - Given hồ sơ trong kho mẫu có `chon.nhom` và design doc có mục «Thẻ việc» năm hàng, When dựng thẻ Cổng 1, Then HTML và
    khoá `khuon_g1` của `--extract` có các dòng: nhóm · đối tượng · việc nhóm nhận (`nhan_viec`) · màn mẫu kèm «băm khớp» ·
    năm trường Thẻ việc.
  - Thẻ việc viết văn xuôi → dòng «Thẻ việc: chưa điền».
  - Chiều đỏ: bản sao bộ đọc bỏ dòng `nhan_viec` → hàm kiểm nêu «thiếu việc nhóm nhận».
- AC-4: Cờ trên thẻ Cổng 1, ma trận viết sẵn mười hàng.
  - Ba hàng mang cờ:
    - (a) hồ sơ `surfaces: [ui]`, không có `khuon-nap.json` → cờ «S1 chưa ghi đã chọn nhóm khuôn nào»;
    - (b) màn mẫu sửa sau khi nạp → cờ «màn mẫu đổi sau khi S1 đọc»;
    - (c) có `chon.moi` mà sổ không có dòng S1 chỉ-người nhắc tên ấy → cờ «nhóm mới bao-cao-tuan chưa thành câu hỏi ở
      cổng»;
    - (g) hồ sơ `surfaces: [ui]` có `khuon-nap.json` do bước nạp không cờ chọn sinh (thiếu `chon`) → cờ (a);
    - (h) như (a) với `surfaces: [web]`, (h2) với `surfaces: [web-ui]` → cờ (a);
    - (i) `chon.mau.bam: null` → khối in «màn mẫu không có trên đĩa» và KHÔNG in «băm khớp».
  - Ba hàng im:
    - (d) như (a) nhưng `surfaces: [cli]`;
    - (e) có `chon` khớp, màn mẫu không đổi;
    - (f) như (c) sau khi nối dòng câu hỏi.
  - Số assert bằng số hàng, in ra.
  - Chiều đỏ: bản sao so băm luôn bằng → hàng (b) đỏ «màn mẫu đổi mà không cờ»; bản sao chỉ kiểm tệp nạp tồn tại → hàng
    (g) đỏ «nạp không chọn mà không cờ».
- AC-5: Khối «Khuôn» trên thẻ Cổng 2.
  - Given hồ sơ có `khuon-cham.json` do `--kiem --write` sinh trên kho mẫu với hai lệch mới, When dựng thẻ Cổng 2, Then
    vẫn có dòng số đo của KH1 không đổi chữ, và có thêm hai dòng lệch.
  - Mỗi dòng lệch bằng đúng chuỗi hàm `dongLech` (một nguồn) in cho cùng mục.
  - Bảy lệch → năm dòng cộng «… và 2 lệch nữa».
  - `chon.nhom: form-nhap` mà vật chạm tệp nhóm `bang-du-lieu` → cờ «vòng chọn nhóm form-nhap mà vật chạm nhóm
    bang-du-lieu».
  - Chiều đỏ: bản sao bỏ kiểm nhóm khác → hàm kiểm nêu «chạm nhóm khác mà không cờ».
- AC-6: Kho không khai bản đồ.
  - Given kho mẫu không có `design/patterns/`, When chạy bước nạp kèm `--nhom` và kèm `--nhom-moi`, Then mọi lệnh thoát 0,
    không in gì, không ghi tệp nào.
  - Thẻ hai cổng (HTML và `--extract`) của một hồ sơ bằng từng byte bản dựng từ cây gốc. Cây gốc lấy bằng
    `git archive <merge-base> scripts lib` vào thư mục tạm.
  - Chiều đỏ: bản sao in khối khi vắng bản đồ → hàm kiểm nêu «thẻ đổi khi kho không khai bản đồ».
- AC-7: Lỗi không im lặng.
  - Given bộ đọc khuôn ném lỗi khi dựng khối (bản sao tiêm `throw`), When dựng thẻ Cổng 1 và thẻ Cổng 2, Then mỗi thẻ vẫn
    dựng xong (thoát 0) và có đúng một cờ «không dựng được khối Khuôn:» kèm thông điệp lỗi.
  - Chiều đỏ: bản sao thẻ giữ `catch → null` → hàm kiểm nêu «lỗi khối Khuôn bị nuốt».
- AC-8: Lệnh trong SKILL ghi đúng vật.
  - Given khối marker `KHUON-S1` trong `feature-loop/skills/feature-loop/SKILL.md`, When ca đo rút các dòng lệnh từ khối,
    thay ô và `AG`, chạy RIÊNG từng nhánh trên hai hồ sơ khác nhau của kho mẫu, Then:
    - nhánh `--nhom`: `khuon-nap.json` có `chon.nhom` và thẻ Cổng 1 in khối «Khuôn» với đúng nhóm ấy;
    - nhánh `--nhom-moi`: `khuon-nap.json` có `chon.moi` và stdout có dòng giữa cho `DEC-ID-RECIPE`.
  - `GUIDE.md` §5.2 nêu cờ `--nhom` và `--nhom-moi`.
  - Chiều đỏ: bản sao SKILL giữ lệnh KH1 (không `--nhom`) → hàm kiểm nêu «lệnh khối KHUON-S1 không ghi lựa chọn»; bản
    sao đổi `--gan` thành `--gần` ở nhánh nhóm mới → hàm kiểm nêu «nhánh nhóm mới của KHUON-S1 hỏng».

## Coverage

Quét hình thái (preset test-matrix) trên ba trục:

- **Trục A, kho:** không khai bản đồ · khai bản đồ. Thước CE: luật «kho không khai thì không đổi gì» của KH1 (AC-8 hồ
  sơ khuon-loi).
- **Trục B, hồ sơ ở S1:** không nạp · nạp không chọn · chọn nhóm · nhóm mới · màn mẫu đổi sau nạp · màn mẫu vắng. Thước
  CE: lược đồ `khuon-nap.json` §3.1 design.
- **Trục C, mặt đọc:** thẻ Cổng 1 · thẻ Cổng 2 · `--extract` · lệnh trong SKILL. Thước CE: bốn bên đọc có trong cây.

Ô Core và tiêu chí bảo đảm từng ô:

| Ô | Tiêu chí |
|---|---|
| A{khai}×B{chọn, nhóm mới, vắng mẫu}×C{lệnh} | AC-1, AC-2 |
| A{khai}×B{chọn}×C{thẻ 1} | AC-3 |
| A{khai}×B{không nạp, nạp không chọn, đổi mẫu, vắng mẫu, nhóm mới}×C{thẻ 1} | AC-4 |
| A{khai}×C{thẻ 2} | AC-5 |
| A{không khai}×mọi B×mọi C | AC-6 |
| lỗi bộ đọc×C{thẻ 1, 2} | AC-7 |
| C{SKILL}×B{chọn, nhóm mới} | AC-8 |

Later: ảnh màn mẫu (KH3) · trang ba lối (KH-C6) · so khớp chữ Thẻ việc với `nhan_viec`.

## Đường đo

- Thước trước phát hành = AC-1 đến AC-8, số từ `tests/scripts/khoi-khuon-tren-the-cong.test.mjs` in «PASS: [KK-…]».
- Sau phát hành, ở kho nhận, trong 21 ngày kể từ commit cài mốc mang KH2. `khuon-nap.json` là tệp hồ sơ, commit cùng gói
  S1 như mọi tệp `_acceptance/<slug>/`; kho không commit nó thì số là 0, và đó là kết quả CHẾT thật, không phải giả.
  - Số hồ sơ giao diện có lựa chọn: hồ sơ có `khuon-nap.json` mang `chon`, contract `surfaces` chứa `ui`, `web` hay
    `web-ui`, và commit đầu của `khuon-nap.json` nằm trong cửa sổ. Đếm bằng `git log --since <ngày cài> --diff-filter=A
    --name-only -- '_acceptance/*/khuon-nap.json'` rồi đọc `chon` và `surfaces`. AC-1 bảo đảm khoá có mặt.
  - Thẻ in khối «Khuôn»: với mỗi hồ sơ trên, `gate-card.js --gate 1 --extract` có `khuon_g1.dong` không rỗng. AC-3 bảo
    đảm.
  - Màn mới quyết ở cổng: số hồ sơ có `chon.moi`, đối chiếu số dòng S1 `chi-nguoi` nhắc đúng tên ấy (AC-2, AC-4c); cạnh
    đó là số «tệp giao diện ngoài bản đồ» trong `khuon-cham.json` của cùng hồ sơ.
  - Lượt gọi người: dòng 2 trong năm dòng số của hồ sơ mốc (luật c).
- Giới hạn đã khai: vế CHẾT «gọi người thêm một lượt VÌ khối» không có thước quy nguyên nhân; dòng 2 chỉ đếm tổng. Ngưỡng:
  một vòng có `chon` mà lượt gọi người vượt trần thiết kế thì đọc tay sổ quyết định của vòng ấy để quy kết.

## Out of scope

- Ảnh màn mẫu nhúng trên thẻ và chụp màn mới cạnh màn mẫu (KH3, mục chờ KH-C3).
- Trang ba lối chọn khối có phản biện đối kháng (KH-C6, đòn bẩy L4, L7).
- Máy tự xếp nhóm bằng so khớp chữ giữa Thẻ việc và `nhan_viec`.
- Đổi lệnh duyệt hay ngữ pháp câu gộp.

## Notes

- Vế «S1 đã đọc màn mẫu» là lời tự khai có băm. Băm chứng tệp có thật và không đổi kể từ lúc nạp, không chứng tác tử đã
  hiểu tệp (design §5).
