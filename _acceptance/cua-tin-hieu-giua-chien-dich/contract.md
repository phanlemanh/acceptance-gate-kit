---
schema_version: 1
feature: Ý mới thợ hay người nêu giữa chiến dịch đi vào cửa tín hiệu và được trả «đã ghi, xử ở mốc khép» — không đẻ lượt phán; người gửi bằng /road-map:gui
slug: cua-tin-hieu-giua-chien-dich
owner: phanlemanh@gmail.com
risk_tier: T2               # hàng RM3 khai T2: chạm dieu-phoi/scripts (vùng M5, khai trên #308), scripts/start-scan.mjs, gói road-map, khối TRONG-DOT của SKILL feature-loop — không chạm lib/**, hooks/**, lưới trước-merge
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-15-cua-tin-hieu-giua-chien-dich-design.md
status: verified
approved_by: Manh Phan
approved_at: 2026-10-15T21:28:06Z
---

# Acceptance Contract: cua-tin-hieu-giua-chien-dich

## Context

Hàng RM3 của gói `road-map` theo hướng B′ §10–§11 (`docs/findings/2026-10-14-kien-truc-roadmap-plugin.md`; ADR 0025
bổ sung 14/10). Hôm nay `dieu-phoi/scripts/yeu-cau.mjs` trả `can_phan` cho MỌI `viec-phu` / `hang-moi`, nên mọi ý mới
giữa đợt đánh thức giám sát. Vòng này: chỉ ý khai **chặn** mới phán giữa chừng; ý khác vào cửa tín hiệu của kho,
trả «đã ghi, xử ở mốc khép»; người gửi bằng `/road-map:gui`; thẻ khởi động nhắc số ý chờ gom. Chủ kho ký Cổng Đáng
15/10 (sổ dòng `gate0`).

Ca đo sống ở `tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs` (ca `CT-<n>` = AC-n). Kho thử, thư mục đợt và cấu hình
do code sinh trong lượt (thư mục tạm, `git init`, `_acceptance/config.yaml` viết bằng hàm ca). «Bộ máy gốc» =
`git archive <gốc so> scripts lib skills commands road-map dieu-phoi feature-loop` bung trong lượt; gốc so đọc từ
`_acceptance/cua-tin-hieu-giua-chien-dich/goc-so`. Mỗi ca đỏ chạy trên BẢN SAO của vật với nhát tiêm khớp ĐÚNG một lần
(ca tự kiểm số lần khớp), SAU khi bản lành xanh trên cùng fixture, và ghim thông điệp. Ca in đúng một dòng
`PASS: CT-…` hoặc `FAIL: CT-… — <vì sao>`. «Câu đã ghi» là hằng `CAU_DA_GHI` của `dieu-phoi/scripts/cua-tin-hieu.mjs`,
giá trị `đã ghi, xử ở mốc khép` — ca đọc hằng ấy bằng import, không chép chuỗi.

## Criteria

- AC-1: Given thư mục đợt có `goc_kho` trỏ kho thử khai `tin_hieu.nguon: [tin-hieu/kho]`, và hai yêu cầu không khai chặn
  — một `viec-phu`, một `hang-moi` — When chạy một nhịp xét (`phat-lich` một lần), Then mỗi yêu cầu có `tra-loi/<id>.json`
  với `ket_qua: "ghi"`, `boi: "may"`, `ly_do` mở đầu bằng câu đã ghi và nêu `--chan` (lối gửi lại khi thợ thật ra đang
  bị chặn); `su-kien.jsonl` có cho mỗi id đúng một dòng
  `{loai:"yeu-cau", kieu, chan:false, ket_qua:"ghi"}` và KHÔNG dòng nào mang `can_phan: true`; danh sách việc chờ của đợt
  (`viec-cho.mjs`) không nêu hai id ấy — vế âm này chạy SAU đối chứng dương của AC-2 trên cùng đợt.
  Câu jq của mục Đường đo, chạy NGUYÊN VĂN trên `su-kien.jsonl` của đợt này, đọc SỐNG với N = 2; trên đợt kho không cửa
  của AC-4, đọc CHẾT.
  Chiều đỏ: bản sao bộ xét trả `can_phan` cho `viec-phu` → FAIL ghim «ý không chặn đánh thức giám sát: <id>»; bản sao bỏ
  khoá `chan` khỏi sự kiện → FAIL ghim «sự kiện thiếu khoá chan: <id>».
- AC-2: Given cùng đợt và cặp yêu cầu giống hệt AC-1 nhưng mang `noi_dung.chan: true` (ghi bằng lệnh
  `dieu-phoi.mjs yeu-cau viec-phu --chan` thật), When một nhịp xét, Then không có `tra-loi/<id>.json`, sự kiện mang
  `can_phan: true`, `chan: true`, `ly_do` nêu «chặn việc đang chạy», KHÔNG có tệp nào trong `tin-hieu/kho/`, và
  `viec-cho.mjs` liệt ĐÚNG hai id ấy (đối chứng dương cho vế âm của AC-1). Đối chứng
  cặp: cùng nội dung bỏ `--chan` thì ra `ghi` (AC-1) — hai kết quả khác nhau chỉ vì cờ.
  Chiều đỏ: bản sao bỏ nhánh chặn → FAIL ghim «ý khai chặn không được phán: <id>»; bản sao lệnh `yeu-cau` bỏ đọc `--chan`
  → FAIL ghim «cờ --chan không vào noi_dung».
- AC-3: Given yêu cầu được `ghi` ở AC-1, Then có ĐÚNG một tệp `tin-hieu/kho/<đợt>-<id>.json` mỗi id (`<đợt>` = tên đợt
  trong `hang-viec.json`), thân bằng thân yêu cầu
  `{phien, loai, hang, noi_dung, luc}`; bộ đọc THẬT của kit (`scripts/tin-hieu.mjs --chua-gom`) liệt cả hai id với đúng
  tiêu đề và `--rang` không báo lỗi khuôn cho chúng. When chạy nhịp xét lần hai, Then vẫn đúng một tệp mỗi id, mtime không
  đổi. Given yêu cầu `viec-phu` thứ ba trùng tiêu đề yêu cầu thứ nhất trong 24 giờ, Then `ket_qua: "gop"` với `voi` = id
  thứ nhất và không có tệp thứ ba. Given `tin-hieu/kho/<đợt>-<id>.json` đã có với thân KHÁC (ý cũ chưa gom), Then tệp cũ
  còn nguyên từng byte, yêu cầu mới hạ về `can_phan` với `ly_do` mở đầu «id trùng một ý khác trong cửa —».
  Given cửa đã có tệp ý của một đợt TRƯỚC (tên đợt khác) mang cùng mã yêu cầu `P1-1`, When đợt mới xét `P1-1` không chặn,
  Then ý được ghi thành tệp riêng của đợt mới và trả «đã ghi» — không `can_phan`, tệp cũ còn nguyên (Ngoài-1, chủ kho nâng
  phạm vi ở Cổng Bằng chứng lượt 1).
  Given hai `hang-moi` khác nhau, đều không có `tieu_de` (chỉ `cau_giao`, như khuôn trong luật của thợ), trong 24 giờ,
  Then cả hai được ghi thành hai tệp, không gộp; hai ý chỉ gộp khi tiêu đề — rút lần lượt từ `tieu_de` → `viec` →
  `cau_giao`, như bộ đọc tín hiệu — sau chuẩn hoá KHÔNG rỗng và bằng nhau (Ngoài-3, cùng lần nâng phạm vi).
  Chiều đỏ: bản sao ghi đè tệp có sẵn → FAIL ghim «ý bị đè: <id>»; bản sao ghi tệp mang thêm khoá `_ten` → FAIL ghim «tệp tín hiệu khác thân yêu cầu: <id>»; bản sao bỏ kiểm
  tệp đã có → FAIL ghim «nhịp xét hai lần đẻ tệp mới: <id>»; bản sao đặt tên tệp bằng mã trần → FAIL ghim «đợt sau đánh
  thức giám sát: P1-1»; bản sao so tiêu đề chỉ bằng `tieu_de` → FAIL ghim «ý không tiêu đề bị gộp mất».
- AC-4: Given bốn đợt thử — kho KHÔNG khai `tin_hieu` · đợt không có `goc_kho` · kho khai cửa nhưng yêu cầu thuộc loại
  vận hành (`cham-tep`, `s4-gom`, `gia-han`, `can-nguoi`, `chuyen-hang`, `khac`, mỗi loại một yêu cầu) · kho không khai
  cửa với `viec-phu`/`hang-moi`, kèm một cặp `hang-moi` trùng tiêu đề trong 24 giờ — When một nhịp xét bằng bộ máy hiện tại và bằng bộ máy gốc trên cùng fixture, Then
  `tra-loi/` và `su-kien.jsonl` (bỏ khoá `luc` và khoá `chan` mới) giống TỪNG BYTE nhau, sau đối chứng dương (bộ máy gốc
  thoát 0 và sinh ≥ 1 dòng sự kiện mỗi đợt; thiếu → «đối chứng gốc không chạy: <đợt>»), và không tệp nào sinh trong kho
  thử.
  Chiều đỏ: bản sao coi kho không khai cửa là có cửa ở thư mục mặc định → FAIL ghim «kho không cửa bị đổi hành vi: <đợt>»;
  bản sao gộp `hang-moi` trùng TRƯỚC khi xét cửa → FAIL ghim «kho không cửa bị đổi hành vi: hang-moi trùng».
- AC-5: Given kho khai cửa nhưng thư mục nguồn không ghi được (là một TỆP trùng tên), When một nhịp xét với một
  `viec-phu` không chặn, Then không có `tra-loi/<id>.json`, sự kiện mang `can_phan: true` với `ly_do` mở đầu «không ghi
  được vào cửa tín hiệu —», và nhịp xét không sập (thoát 0, sự kiện `chay` kế tiếp vẫn ghi).
  Chiều đỏ: bản sao nuốt lỗi ghi rồi vẫn trả `ghi` → FAIL ghim «ý mất: trả đã ghi mà không có tệp: <id>».
- AC-6: Given ma trận cấu hình cửa — `nguon` chuỗi · dòng `[a, b]` · danh sách `- a` · có chú thích cuối dòng · có nháy ·
  khối `tin_hieu` vắng · khoá `nguon` vắng · `nguon: ~` — When đọc bằng bản chép trong gói điều phối và bằng
  `scripts/tin-hieu-khoa.cjs`, Then hai kết quả BẰNG nhau ở mọi ô (số ô so = số ô ma trận, ca in số ấy), và bản chép
  chọn đúng phần tử ĐẦU của `nguon` làm đích ghi.
  Chiều đỏ: bản sao bản chép bỏ cắt chú thích cuối dòng → FAIL ghim «bản chép lệch bộ đọc kit ở ô chú-thích».
- AC-7: Given kho thử khai cửa và `git config user.name` = «Chủ Kho Thử», When chạy
  `node scripts/gui-tin-hieu.mjs --root <kho> --noi-dung "Mở KR không thấy số tuần trước"` hai lần, Then mỗi lần thoát 0,
  stdout có câu đã ghi và đường tệp; có đúng hai tệp `tin-hieu/kho/nguoi-chu-kho-thu-<n>.json` với `n` = 1 rồi 2, `loai:
  "tin-hieu"`, `noi_dung.tieu_de` bằng câu; `tin-hieu.mjs --chua-gom` liệt cả hai. Given tệp `…-3.json` đã có sẵn (lần gửi
  đồng thời lấy cùng số), Then lần gửi kế ghi `…-4.json` và tệp `-3` còn nguyên từng byte. Given kho không khai cửa, Then thoát 1,
  đúng một dòng nêu `tin_hieu` trong `_acceptance/config.yaml`, không tệp nào sinh. Given `--noi-dung ""`, Then thoát 2.
  `road-map/commands/gui.md` gọi đúng dòng lệnh ấy (rút từ khối marker `RM-GUI-LENH` của chính tệp lệnh, chạy trong ca)
  và KHÔNG mang `disable-model-invocation`.
  Một bộ ghi: tệp do lệnh người ghi và tệp do bộ xét ghi (AC-3) có cùng định dạng byte (thụt lề, thứ tự khoá, dòng
  cuối) — ca dựng lại tệp người bằng `ghiVaoCua` từ thân đã đọc và so byte.
  Chiều đỏ: bản sao vỏ lệnh tự ghi bằng `JSON.stringify` không thụt thay vì gọi `ghiVaoCua` → FAIL ghim «hai khuôn tệp
  tín hiệu: <tệp>».
- AC-8: Given kho thử khai lộ trình và cửa, có 3 tín hiệu chưa ở bản gom nào, When chạy `scripts/start-scan.mjs` (đầu ra
  thẻ), Then thẻ có đúng một dòng `Cửa tín hiệu: 3 ý chờ gom ở mốc khép — gom bằng skill gom-tin-hieu`. Given 0 tín hiệu
  chưa gom, hay kho không khai cửa, Then đầu ra thẻ giống TỪNG BYTE bộ máy gốc trên cùng kho (sau đối chứng dương). Given
  một tệp tín hiệu sai khuôn, Then dòng thẻ mở đầu `!` nêu số tệp không đọc được, thẻ không sập.
  Chiều đỏ: bản sao đếm cả tín hiệu đã gom → FAIL ghim «thẻ đếm cả ý đã gom: 5 ≠ 3».
- AC-9: Given khối `TRONG-DOT` của `feature-loop/skills/feature-loop/SKILL.md` và `dieu-phoi/scripts/mau/LUAT.md`, When
  ca rút dòng yêu cầu `hang-moi` của gạch S0 «hàng chưa có ô» (khối marker `TRONG-DOT-HANG-MOI` trong SKILL) và chạy nó
  bằng lệnh `yeu-cau` thật rồi một nhịp xét, Then kết quả là `can_phan` với `chan: true` (thợ đang chờ được phán); và
  `LUAT.md` có khối marker `LUAT-CHAN` nêu cả «đã ghi» lẫn `--chan`, mà dòng lệnh trong khối chạy được qua lệnh `yeu-cau`
  thật.
  Chiều đỏ: bản sao SKILL bỏ `--chan` khỏi dòng S0 → FAIL ghim «thợ chờ ô bị trả đã ghi».
- AC-10: Given một đợt mở bằng `dieu-phoi.mjs mo` rồi `chay` (bản lõi chép phẳng vào `<thư mục đợt>/loi/`), When
  `phat-lich.mjs` CHẠY TỪ `loi/` xét một `viec-phu` không chặn của kho có cửa, Then tệp tín hiệu sinh trong kho và
  `tra-loi` mang `ghi` — tức gói điều phối vẫn tự đủ sau khi chép phẳng.
  Chiều đỏ: bản sao `cua-tin-hieu.mjs` import `../../scripts/tin-hieu-khoa.cjs` → FAIL ghim «bản lõi theo đợt thiếu
  module: tin-hieu-khoa».

## Coverage

Quét bằng `morphological-scan` (preset entity-feature; thực thể = một ý nêu giữa chiến dịch). Bản đầy đủ ở design doc §2.
- Chân sản phẩm: `[SUY-TỪ-REPO: docs/findings/2026-10-14-kien-truc-roadmap-plugin.md]` §10–§11,
  `[SUY-TỪ-REPO: dieu-phoi/scripts/yeu-cau.mjs]`, `[SUY-TỪ-REPO: skills/acceptance/references/tin-hieu-template.md]`.
- Chân ngành: `[NGÀNH: Linear Triage]` (việc từ ngoài vào hộp phân loại, không vào thẳng chu kỳ đang chạy),
  `[NGÀNH: Scrum Guide 2020]` (Sprint Goal cố định, việc mới vào Product Backlog).

- Trục A — người nêu: thợ trong đợt · người · thợ ngoài đợt  [thước CE: B′ §11 «cùng khuôn với thợ»] → AC-1, AC-7
- Trục B — loại ý: viec-phu · hang-moi · tin-hieu · loại vận hành khác  [thước CE: khối TIN-HIEU-LOAI + danh sách loại ở LUAT.md] → AC-1, AC-4, AC-7
- Trục C — chặn: chặn · không chặn  [thước CE: bảng B′ §10] → AC-2, AC-9
- Trục D — cửa: có cửa · không cửa / không gốc kho · ghi lỗi · trùng 24 giờ  [thước CE: `kiemCauHinh`, `xetViecPhu`] → AC-3, AC-4, AC-5
- Lớp xuyên: bộ đọc khoá chép (AC-6) · mốc khép đọc cửa trên thẻ (AC-8) · gói chép phẳng (AC-10)
- `[GIẢ ĐỊNH]` thợ ngoài đợt dùng chính `/road-map:gui` là đủ — không đo riêng.

## Đường đo

- «Trong một chiến dịch, mọi ý mới thợ hay người nêu đều có chỗ trong cửa tín hiệu và không đẻ lượt gọi người ngoài thiết
  kế». Số đọc ở đợt đầu tiên mở bằng gói điều phối, ở bất kỳ kho nào, sau khi cài bản chứa vòng này. M5 trả lời trên
  #308 (15/10): M5 không mở đợt bằng gói (điều phối thợ bằng tay), nên máy duy nhất từng chạy đợt là Mac Studio (đợt r2).
  Trong sổ sự kiện của đợt, N = số yêu cầu việc-phụ/việc-mới `chan != true` (mọi ý không chặn, dù kết quả là gì). SỐNG khi N ≥ 1, 0 dòng trong N mang `can_phan ==
  true`, và mỗi dòng `ket_qua == "ghi"` có tệp `<nguon>/<đợt>-<id>.json`. CHẾT khi ≥ 1 dòng trong N mang `can_phan == true`,
  hoặc một id `ghi` không có tệp. N = 0 → «chưa đọc được». Câu đọc:
  `jq -s '[.[]|select(.loai=="yeu-cau" and (.kieu=="viec-phu" or .kieu=="hang-moi") and .chan!=true)]|{n:length,can_phan:(map(select(.can_phan==true))|length),ghi:(map(select(.ket_qua=="ghi"))|map(.id))}' <thư mục đợt>/su-kien.jsonl`
  — AC-1 chạy nguyên văn câu này trên sổ sinh trong lượt. Bảo đảm bởi AC-1 (sự kiện mang `kieu`·`chan`·`ket_qua`), AC-3
  (một id một tệp, không đè).
- Vế «ý của người» không sinh sự kiện đợt nên không đọc bằng câu trên: đếm tệp `nguoi-*.json` trong nguồn của cửa, so
  với số lần chủ kho nhớ đã gửi — giới hạn đã khai, đọc tay.
- Mốc nền: M5 có 0 sự kiện `yeu-cau` (không có thư mục đợt nào). Số thật chỉ có ở máy Mac Studio (đợt r2) — chưa đo;
  ngưỡng vẫn đọc được từ sổ của đợt kế mà không cần nền. Không có đợt nào trước hạn 02/11 → «chưa đọc được».

## Out of scope

- Răng `cat-luot.mjs --co` cho hàng mới trỏ mốc đang chạy (B′ §10 «cắt lượt dưới đóng băng») — không thuộc câu giao RM3.
- Máy tự commit tệp tín hiệu: tệp nằm chưa theo dõi tới khi phiên gom commit cùng bản gom (giới hạn đã khai, Notes).
- Máy tự gom hay tự cắt lượt giữa chiến dịch — đóng băng B′ §10; gom vẫn là việc của phiên theo skill `gom-tin-hieu`.
- Ý của người vào thư mục yêu cầu của đợt — glossary «Tín hiệu» _Avoid_.
- Đổi danh sách bảy thao tác cổng người khoá model-invocation (P32, ADR 0002): `/road-map:gui` để mở.

## Notes

- Tệp tín hiệu sinh trên đĩa của máy chạy đợt, chưa theo dõi bởi git; lưới cây bẩn của làn ghim lại không tính tệp chưa
  theo dõi. Mất máy trước khi gom = mất ý — giới hạn đã khai.
- Ý của thợ NGOÀI đợt đi `/road-map:gui` như người.
- Known limits — chọn ở Cổng Bằng chứng lượt 1 (2026-10-15):
  - Ngoài-2: kho chỉ khai cửa mà không khai lộ trình thì thẻ khởi động không nhắc số ý chờ gom (dòng nhắc sống trong khối
    lộ trình của thẻ). Ý không mất; gom tay vẫn thấy.
  - Đợt dựng lại với CÙNG tên và cùng mã yêu cầu khi ý cũ chưa gom: tệp trùng tên khác thân → ý rơi về «cần phán» (không
    đè, không mất). Tên tệp mang tên đợt nên chỉ ca dùng lại tên đợt mới chạm.
  - Ngoài-4, Ngoài-5: hai ca đo nội bộ (CT-6-do nhận cờ lành cứng, CT-7-rong không ghim thông điệp) giữ như hiện tại.
- Thợ thật ra bị chặn mà quên `--chan` nhận «đã ghi» và phải tự gửi lại (câu trả chỉ lối) — ngưỡng không đếm được ca này,
  vì không sinh `can_phan`. Ngưỡng mở lại: ≥ 1 lần trong một đợt thợ gửi lại cùng ý kèm `--chan` sau một lần «đã ghi».
