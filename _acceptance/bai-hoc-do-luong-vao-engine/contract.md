---
schema_version: 1
feature: Đưa bài học đo lường của tuần 08–14/08 vào engine — bốn lớp lỗi mới có ca đại diện, nguyên tắc lật-allow-list, và một bánh cóc hai chiều buộc bảng lớp lỗi trace về sổ nguồn
slug: bai-hoc-do-luong-vao-engine
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-08-14
---

# Acceptance Contract: bai-hoc-do-luong-vao-engine

## Context

Ba vòng rà soát đối kháng của hồ sơ `cat-hinh-thuc` (9 phiên, ~~41~~ **37** lượt
phá ghi lệnh) sinh ra bốn lớp lỗi chưa có tên trong kho, một nguyên tắc đo mới,
và một phát hiện cấu trúc về vùng phủ của `MEASURE-BIRTH-CLAUSE`. Tất cả hiện
chỉ nằm trong **sử liệu hồ sơ** (`review-findings.md`) và một hạt giống
(`docs/plans/2026-08-14-hat-giong-bai-hoc-tuan-do-luong.md`) — tức chúng chết
theo hồ sơ khi ai đó thôi đọc nó.

**Phát hiện đắt nhất, và là lý do hồ sơ này tồn tại:** hai lớp lỗi trung tâm của
cả ba vòng (`doc-drift` — đo chỉ dẫn thay vì đầu ra; `chuoi-thay-quan-he`) **đã
nằm sẵn trong bảng lớp lỗi của `measure-birth.md` trước khi 1a bắt đầu**, và bộ
răng của 1a vẫn dẫm lên cả hai, ba vòng liền. Vấn đề là **bảng ấy không có
răng**: `P177` kiểm bảng CÓ MẶT, không kiểm bảng có TRACE về sổ nguồn, và không
gì buộc một lớp mới trả giá phải lên bảng.

**[SỬA SAU CỔNG 1 — 14/08] Câu trên, bản gốc, còn kèm mệnh đề «capture đang
chạy».** Gap-probe context-sạch đo lại và mệnh đề ấy SAI với chính ca đang xét:
`_acceptance/cat-hinh-thuc/review-findings.md` có **0** dòng `Đề xuất:
known-limits` — kênh capture mà `P179` đếm chưa hề chạy cho hồ sơ 1a. Nên có
**hai** chỗ hở, không một: kênh `findings → sổ` (chưa chạy) và mối `sổ → bảng`
(không răng). Hồ sơ này đóng mối thứ hai; mối thứ nhất đi vào Out of scope kèm
lý do, chứ không im.

**[SỬA SAU CỔNG 2 — 14/08, đếm lại] «41 lượt phá» ở đoạn trên là số BỊA.**
Đếm lại từ chính `review-findings.md`: vòng 1 = **8** (dòng 182) · vòng 2 = **8**
(dòng 325) · vòng 3 = **21** (dòng 400) → **37**, không phải 41. Không nguồn nào
trong kho cho ra 41; người thi công viết nó một lần rồi không đo lại, và nó đi
qua Cổng 1, gap-probe, ba lăng kính lẫn Cổng 2 mà không ai chạm.
Giữ số sai gạch ngang thay vì ghi đè lặng, vì đây là **ca đại diện sống** của
đúng lớp mà hồ sơ này vừa đưa lên bảng — lời tuyên định lượng không có phép đo
nào canh. Nó cũng là bằng chứng cho giới hạn đã khai của `AC-1`: bốn lớp mới có
tên trên bảng **không** khiến một con số trong văn xuôi tự được đo.
Lệnh tái lập: `grep -nE 'lượt phá' _acceptance/cat-hinh-thuc/review-findings.md`.

Hồ sơ này làm đúng ba việc, không hơn: (1) ghi bốn lớp mới vào **sổ nguồn**
(`known-limits-ledger.tsv`), (2) đưa chúng lên **bảng dẫn** trong
`measure-birth.md`, (3) dựng **bánh cóc HAI CHIỀU** buộc hai bên khớp nhau —
để lần sau một lớp trả giá mà không lên bảng thì lưới kêu, chứ không phải một
phiên nào đó tình cờ nhớ ra.

Source input:
[docs/plans/2026-08-14-hat-giong-bai-hoc-tuan-do-luong.md](../../docs/plans/2026-08-14-hat-giong-bai-hoc-tuan-do-luong.md)
· sử liệu [`_acceptance/cat-hinh-thuc/review-findings.md`](../cat-hinh-thuc/review-findings.md)

## Criteria

- AC-1: Given bốn lớp lỗi mới (`tap-so-rong`, `doi-chung-tu-sinh`,
  `mut-khong-qua-chan-that`, `pinned-khong-dem-duoc`), When đọc
  `docs/research/known-limits-ledger.tsv`, Then mỗi lớp có **≥1 dòng** với
  `class` đúng tên ấy, `slug` = `cat-hinh-thuc`, và `note` mang một **neo truy
  được** dạng `[neo: <chuỗi>]` mà `<chuỗi>` tìm thấy được **nguyên văn** trong
  `_acceptance/cat-hinh-thuc/review-findings.md`. Bốn neo phải **đôi một khác
  nhau** — bốn dòng cùng trỏ một chỗ là một neo, không phải bốn.
- AC-2: Given bảng lớp lỗi trong `skills/acceptance/references/measure-birth.md`
  và cột `class` của sổ nguồn, When chạy lưới thường trực, Then **khớp HAI
  CHIỀU** trên tập lớp có `status == 'song'` (đúng chuỗi ấy, không phải
  «chưa đóng»): (a) mọi lớp SỐNG trong sổ hoặc có hàng trên bảng, hoặc nằm
  trong **bản khai miễn trừ** đặt ngay trong bảng; (b) mọi hàng trên bảng đều
  có lớp SỐNG trong sổ; (c) mọi dòng miễn trừ phải còn **hit thật** — lớp được
  miễn trừ mà không còn dòng SỐNG nào thì bản khai ấy ĐỎ. Lệch chiều nào cũng
  gọi đích danh lớp. Đây là chân chính của hồ sơ: bảng tuyên «Nguồn:
  known-limits-ledger.tsv» mà không phép đo nào giữ lời tuyên ấy.
- AC-3: Given `MEASURE-BIRTH-SECTIONS`, When đọc khuôn khai sinh phép đo, Then
  có **mục thứ tư — «Phủ-định-phổ-quát»** dạy: một lời hứa «không X nào, ở bất
  kỳ cách diễn đạt nào» KHÔNG chứng được bằng danh sách chuỗi-cấm; đường chứng
  được là **lật sang liệt cái ĐƯỢC PHÉP** (quét cả lớp + miễn trừ khai trước +
  bánh cóc hai chiều), và phần dư phải khai known-limit kèm **lệnh tái lập**.
  `P177` ghim mục này bằng một marker MỚI, và **buộc số**: số mục `### ` trong
  khối mốc phải khớp con số viết bằng chữ ở văn dẫn và ở tiêu đề `##` ngay trên
  khối — lệch là ĐỎ. Hai chiều đỏ ghim **hai thông điệp khác nhau**: xoá mục →
  đỏ tên mục; gỡ một neo nội dung → đỏ tên neo.
- AC-4: Given toàn bộ lưới hiện hành, When chạy sau thay đổi, Then bốn suite
  xanh với **các con số đang thật sự ghim được**: `hooks` = `54 passed,
  0 failed` và `scripts` = `686 passed, 0 failed` (hai đẳng thức thật);
  `plugins` và `workflows` không tự in số ca nên chỉ ghim câu tổng kết, và
  đẳng thức 146 của `plugins` khai là **số người-đối-chiếu kèm lệnh tái lập**,
  không phải răng máy.
  Răng mới đi vào THÂN ca sẵn có (TRIM/EXTEND), không mọc ca mới — cùng nếp hồ
  sơ 1a. **Tiền đề môi trường:** chạy dưới người dùng KHÔNG-root; dưới root,
  `P123`/`P129` (dùng `chmod 000`) đỏ giả vì root đọc xuyên quyền.

## Coverage

Quét trên trục **vật mang bài học × tầng cưỡng chế**.

- Trục **vật** (3 giá trị): sổ nguồn máy-đọc (`.tsv`) · bản chỉ dẫn được cưỡng
  chế (`measure-birth.md`) · ca thường trực (`P177`). [thước CE: cả ba đã tồn
  tại; hồ sơ này chỉ nối chúng, không sinh vật mới]
- Trục **tầng cưỡng chế** (2 giá trị): lưới thường trực (sống sau merge) ·
  răng-chết-theo-hồ-sơ. [thước CE: bài học 1a — mọi bảo đảm dài hạn phải vào
  lưới thường trực; hồ sơ này **không dựng răng-hồ-sơ nào**]

**[QUYẾT TẠI CỔNG 1 — 14/08, owner chọn (b)] Vùng trắng của
`MEASURE-BIRTH-CLAUSE` đóng bằng LỜI TUYÊN, không bằng cơ chế mới.**
Câu hỏi: clause ấy cưỡng chế phép đo mới trong *suite thường trực*, còn
răng-chết-theo-hồ-sơ nằm ngoài vành đai — đó là chỗ ba vòng chấm của 1a chảy
máu. Hai đường đã trình: (a) nâng bộ ghi sổ + luật khai-sinh thành `lib/` dùng
chung cho răng-hồ-sơ; **(b) tuyên thẳng răng-hồ-sơ là lớp RẺ, và mọi bảo đảm
DÀI HẠN phải vào lưới thường trực ngay từ đầu.**

Owner gạch **(b)**. Ba lý do ghi lại để lần sau khỏi bàn lại:
· **Rẻ hơn thật.** (a) là dựng một cơ chế dùng chung cho những script vốn sinh
  ra để CHẾT khi merge — trả tiền hạ tầng cho vòng đời vài ngày.
· **Thuận chiều sống/chết theo merge.** Răng-hồ-sơ neo vào `origin/main` hoặc
  một mốc tạm; sau merge nó tự vô nghĩa. Nâng nó thành `lib/` là kéo dài một
  thứ đáng chết.
· **1a đã làm đúng thế trên thực tế** ở vòng về đích: lint `LOP-PHUT`, hai chân
  không-hứa-phút, hai neo dương của `P194` đều vào **thân ca sẵn có** của
  `tests/plugins`, không vào bộ răng hồ sơ. Bảo đảm ấy sống sau merge; bộ răng
  1a thì không.

**Hệ quả cưỡng chế được, áp cho hồ sơ NÀY ngay:** không một eval nào ở đây được
trỏ vào một `executors.script.<slug>_rang`; mọi chân đi vào lưới thường trực.
Xem `evals.yaml` — bảng eval không có khoá răng-hồ-sơ nào, và AC-4 ghim đẳng
thức 146 để răng mới không mọc thành ca mới.
**Hệ quả cho lần sau, chưa cưỡng chế được ở hồ sơ này:** lời tuyên (b) nên vào
`measure-birth.md` như một câu của khuôn khai sinh — nhưng đó là phép CỘNG thứ
hai vào cùng một bản chỉ dẫn, và hồ sơ này đã có ba. Ghi vào hạt giống
`docs/plans/2026-08-14-hat-giong-bai-hoc-tuan-do-luong.md` để vòng promote sau
gánh, thay vì nong phạm vi một hồ sơ đang chờ về đích.

## Sửa sau Cổng 1 — ba P0 của gap-probe, khai TRƯỚC khi thi công

Owner gạch Cổng 1 trên bản hợp đồng có **ba lời khai sai về vật**. Gap-probe
context-sạch tìm ra; người thi công kiểm lại từng cái trên cây và **không loại
được cái nào**. Ba cái đều là «vật kiểm được ngay», không phải tranh luận thiết
kế. Sửa ở đây, không sửa lặng:

| # | Lời khai cũ | Sự thật đo được | Đã sửa thành |
|---|---|---|---|
| **P0-a** | AC-1 ghim bốn **mã finding** `Hb` · `He` · `RB3-03` · `RA3-01` | Ba mã đầu **không tồn tại** trong `review-findings.md`; tệp chỉ mang `H1..H15`, `Ha/Hd/Hg/Hj`, `P0-1/P0-2`, `P1-3/P1-4`, `RA3-01/02/09`, `RB3-05`. Xây E1 đúng như viết thì nó ĐỎ lượt đầu **vì hợp đồng sai**, không vì sổ sai | AC-1 đổi sang **neo truy được** (chuỗi nguyên văn), và bốn neo là chuỗi đã tra thật: `E5 giữ-gân là HẰNG ĐÚNG` · `E9b «đối chứng dương tự sinh» là HẰNG ĐÚNG` · `chiều đỏ không qua chân canh` · `RA3-01` — mỗi chuỗi **đúng 1 hit** |
| **P0-b** | AC-2 ngụ ý bảng và sổ hiện đã khớp, chỉ cần thêm bốn lớp mới | **Đã lệch sẵn**: sổ có **10** lớp mang dòng `song`, bảng chỉ **8** hàng. Thiếu `do-thuoc` (8 dòng song) và `khac` (41 dòng song). Chiều (a) ĐỎ ngay khi cắm vào, độc lập với bốn lớp mới — **phạm vi ẩn** | Khai thẳng: bảng phải thêm `do-thuoc` **và** bốn lớp mới (8 → 13 hàng). `khac` là ô rác bắt-hết, không có khuôn chặn nên **không** điền-cho-có được → nó vào **bản khai miễn trừ** đặt trong chính bảng, và AC-2 mọc **chiều (c)** đo bản khai ấy — miễn trừ chết phải ĐỎ |
| **P0-c** | E3 ghim `"P177 DUONG-OK"` | Chuỗi ấy **đã in ra** trên cây hiện tại (dòng 339 lượt chạy thật) khi chưa có mục thứ tư nào → E3 XANH trước khi viết một dòng nào. Đúng lớp «tiêu đề luôn in» | E3 ghim marker **MỚI** do chính chân mới in: `P177 4MUC-OK` |

Bốn sửa nhỏ hơn đi kèm, cùng nguồn: AC-2 viết thẳng `status == 'song'` thay vì
«chưa đóng» (enum thật là `song/chet/trung`, để mơ hồ là để script quyết hộ
người) · AC-3 thêm **buộc số** vì văn dẫn của `measure-birth.md` đang ghi «đủ
BA mục» và tiêu đề `## Ba mục bắt buộc`, thêm mục thứ tư mà không sửa là giao ra
một bản chỉ dẫn tự mâu thuẫn — đúng lớp `doc-drift` mà bảng ngay dưới đó đang
dạy · AC-3 tách **hai thông điệp** cho hai chiều đỏ (cùng một màu cho hai
nguyên nhân là assertion không phân biệt được) · AC-4 hạ lời tuyên «bốn đẳng
thức» xuống đúng cái ghim được, và khai tiền đề không-root.

**Phạm vi đổi bao nhiêu:** AC-1 đổi *loại neo*, không đổi việc. AC-2 **to thêm
thật**: +1 hàng `do-thuoc`, +1 bản khai miễn trừ, +1 chiều đỏ. AC-3 +1 buộc số,
+1 thông điệp. Không AC nào bị bỏ, không AC nào mới.

## Out of scope

- **Kênh `findings → sổ` (`Đề xuất: known-limits`) chưa chạy cho 1a** — đây là
  chỗ hở THẬT thứ hai, và bánh cóc của hồ sơ này KHÔNG chạm nó: lần sau ba vòng
  đối kháng lại sinh lớp mới, findings vẫn không ghi `Đề xuất:`, sổ vẫn thiếu,
  bảng vẫn khớp sổ → **lưới xanh**. Vá nó ở đây nghĩa là sửa `review-findings.md`
  của một hồ sơ **đã ký và đã merge** — viết lại sử liệu sau chữ ký, đúng thứ
  `signoff.require_human_commit` sinh ra để chặn. Nó thuộc một hồ sơ riêng, mở
  khi owner thấy đáng.
- **Khuôn ba-lăng-kính chấm đối kháng** — viết tay ba lần trong tuần, đáng thành
  reference, nhưng nó là *quy trình chấm* chứ không phải *luật đo*, và đưa vào
  đây là mở rộng phạm vi của một hồ sơ dọn dẹp. Đã ghi trong hạt giống; mở hồ sơ
  riêng nếu owner thấy đáng.
- **Nâng bộ ghi sổ thành `lib/` dùng chung** — owner đã gạch **(b)** ở Cổng 1,
  nên đường (a) khép lại; giữ dòng này làm vết để khỏi bàn lại.
- **Răng thường trực cho đẳng thức số ca bốn suite** — bản khai bốn con số từng
  sống trong khối `SO-CA-KY-VONG` của hồ sơ `luu-kho-codex-va-nghi-le-design`,
  tức **răng-hồ-sơ, và nó đã chết khi merge**. Hôm nay không phép đo thường trực
  nào giữ bốn con số ấy. Đó chính là hình dạng quyết định (b) vừa gọi tên, nhưng
  dựng lưới mới cho nó là một hồ sơ khác — ở đây chỉ **ghi vào sổ nguồn** như
  một known-limit kèm lệnh tái lập, và AC-4 hạ lời tuyên cho khớp vật.
- **Sửa lại các bộ răng hồ sơ đã merge** (`cat-hinh-thuc`, `luu-kho-…`) theo luật
  mới — chúng đã chết theo hồ sơ; sửa là đào mộ.
- **Dời mốc ghim của bánh cóc `P161`** — lỗ đã khai hai lần trong sổ
  `asserts-da-go.txt`; nó thuộc hồ sơ khác.

## Notes

- Hồ sơ này là **phép CỘNG vào engine**, nên nó phải trace về ba nguyên tố của
  bản neo. Trace: **nguyên tố 2 — bằng chứng không tự dối**. Người hưởng cụ thể
  là **MÁY**: bốn lớp mới đều là hình dạng «máy tin nhầm chính nó», và bánh cóc
  hai chiều là thứ giữ cho bảng dẫn không trôi khỏi sổ nguồn. Không có nó, lần
  sau một phiên lại trả giá cho một lớp đã có tên.
- **Không hồ sơ nào ở đây được dựng răng-chết-theo-hồ-sơ.** Đó vừa là tiêu chí
  (AC-2/AC-3 đều đo bằng lưới thường trực) vừa là bài học đang được ghi.
- **AC-1 không tự đứng.** Một danh sách bốn tên cứng, sau merge chỉ đỏ được nếu
  ai đó cố ý xoá dòng — tự nó là *capture*, đúng thứ hồ sơ này lập luận là không
  đủ. Giá trị của nó là làm **vế NGUỒN** để AC-2 có cái mà so; đọc rời AC-2 thì
  nó là răng trang trí ăn thời gian CI.
- **Known-limit đã nhận, ghi luôn vào sổ nguồn:** (i) lưới thường trực từ nay
  phụ thuộc `_acceptance/cat-hinh-thuc/review-findings.md` còn nguyên chỗ —
  lưu kho workspace ấy sẽ làm lưới đỏ vì lý do không liên quan (tiền lệ: `P179`
  đã glob `_acceptance/*/review-findings.md`); (ii) bốn đẳng thức số ca không
  còn phép đo thường trực nào giữ.
