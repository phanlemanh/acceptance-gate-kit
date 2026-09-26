# Lỗi kit gặp ở lộ trình OKR (kho crm, 23–26/09): bốn lỗi còn sống trên 2.18.4, ghim lại chiếm phần lớn giờ chờ

**Ngày:** 2026-09-26 · **Chủ:** owner gọi tên («điều tra các chip và nội dung liên quan đến lỗi
của kit từ các phiên "Phiên điều phối OKRs", "S4 lượt 4 OKR" … kiến nghị») · **Cách đo:** xuất bản
chép hai phiên, lọc mọi chip và đoạn nhắc tới kit, rồi đối chiếu từng lỗi với `main` 48945070 (2.18.4).
Lỗi nào còn sống thì tái hiện trên bản sao hồ sơ `crm/_acceptance/cap-nhat-tuan-okr/`. Không sửa mã,
không mở ô.

## 1. Số đo nền

| | Giá trị | Nguồn |
|---|---|---|
| Tin owner gõ tay ở phiên điều phối (23/09 10:19 → 26/09 01:30) | 48 | bản chép |
| … trong đó hỏi tiến độ / «tiếp tục» / «thử lại» | **23** | cùng |
| Lượt ghim lại khác nhau (run_id `repin-*`, phiên điều phối + tác nhân con) | **35** | bản chép + tác nhân con |
| Một lượt chấm S4 (lượt 4, vòng 1) | 40 tác nhân · 3,77 M token con · 29 phút | `wf_939c114e-5d9` |
| Phát hiện ngoài hợp đồng của lượt chấm đó | 15, cả 15 đề xuất `known-limits`/`wont-fix` | kết quả Workflow |
| Chip phiên điều phối mở về kho kit | 3 (gộp dần thành 2) | §4 |

REJECT của lượt chấm đến từ 4 eval đỏ, không từ phát hiện nào. Khớp số đo 14/09: khối tìm lỗi tốn
nhiều mà không chạm phán quyết. Lần này không cắt được tỉ lệ theo khối vì lỗi B3 dưới đây.

## 2. Đã sửa ở 2.18.4 — không cần làm gì

| Lỗi (chip) | Sửa ở | Ghi chú |
|---|---|---|
| Báo động giả «THIEU merge-base» khi lệnh mở đầu bằng `B=$(git merge-base …)` | #216 `nen-cong-cu-gan-bang-lenh-con` | — |
| Đường nền chạy lệnh qua shell đăng nhập, mất PATH Node 24, `build` luôn đỏ | #217 `nen-chay-bang-moi-truong-nguoi-goi` | — |
| Đường nền gọi nhầm tên tệp bẩn sẵn | #218 `nen-cay-ban-dong-dau` | **Chỉ sửa một nửa** chip gốc: ca «phiên ghi `_acceptance/<slug>/opportunity.md` TRONG lúc suite chạy» không có trong AC-1…5 của hồ sơ này, nên chưa có ca đỏ nào canh nó. |

## 3. Còn sống trên 2.18.4 — đã tái hiện

### B1. Thẻ Cổng Phạm vi làm rơi im lặng những điều «sẽ KHÔNG làm» khi có bản dịch

Hợp đồng `cap-nhat-tuan-okr` có 8 mục `## Out of scope`. Bản dịch `card-plain.json` ghi 5 mục ấy vào
`wont_do` với id `OOS-1…OOS-6`. Nhưng bộ dựng chỉ tra `wont_do` theo id của tiêu chí
(`scripts/gate-card.js:743`, `pmap(pl.wont_do, x.id)` với `x` rút từ Criteria), nên cả 5 dòng rơi mất
mà không để lại dấu. Tám mục thật chỉ còn MỘT câu tóm «Hoãn/cắt: …» (`scope_plain`, dòng 756). Câu tóm
ấy bỏ mất «tin thứ hai», «ghép vào hộp Chuyển việc 30 ngày» và «xếp hạng người».

Lớp: *tiếng người vào ô máy đọc → khối biến mất im lặng*. Đây là lần thứ tư lớp này xuất hiện. Hệ
quả: người ký Cổng Phạm vi, một khoảnh khắc quyết thật, không thấy trọn danh sách điều sẽ không làm.

```bash
node scripts/gate-card.js --root <bản-sao> --slug cap-nhat-tuan-okr --gate 1 --plain <bản-sao>/_acceptance/cap-nhat-tuan-okr/card-plain.json
```

Chạy lệnh trên rồi tìm «Zalo/Slack»: có ở thẻ không dịch, **mất** ở thẻ có dịch.

### B2. Thẻ chỉ đọc bảng phản biện ĐẦU TIÊN

`gap-probe.md` có hai bảng: lượt đầu (1 P0 · 3 P1 · 1 P2) và «Soát lại sau Cổng Phạm vi» (3 P1 · 2 P2).
Thẻ chỉ lên bảng đầu, không kèm cờ vàng nào, nên 5 phát hiện của lượt hai vắng mặt ở cổng. Tái hiện
bằng lệnh ở B1, không cần `--plain`: không có «E29 không có KR», cũng không có «Ma trận cờ lienQuanOkr».

### B3. Bảng chi phí S4 không tách được theo khối nữa

Harness Workflow nay chèn một tin «[Workflow harness — user request] …» ĐỨNG TRƯỚC prompt của mỗi
tác nhân. `feature-loop/scripts/wf-usage.mjs:82–85` chỉ tìm thẻ `[wf-label: …]` ở tin người dùng
ĐẦU TIÊN. Kết quả: 40/40 tác nhân mang cùng nhãn cắt cụt, và cột «vai tro» gộp làm một dòng. Cả 40
đều có thẻ ở tin thứ hai, và `.meta.json` của mỗi tác nhân cũng có sẵn `description` và
`workflowPhase`.

Hệ quả theo luật: dòng 4 của luật chiều rộng (c), tức tách chứng-minh-vật / tìm-lỗi / tổng hợp, **mù**
ở mọi lượt chấm chạy dưới harness hiện tại. Mốc phát hành kế sẽ không cắt được đủ 5 dòng. Chưa kiểm
lượt chấm của chính kho kit tuần này có bị cùng lỗi không.

### B4. Ảnh bằng chứng ui-check không neo vào hồ sơ

Prompt verifier UI (`acceptance-verify.js:836`) dặn lưu `evidence/${e.id}-step1.png`, một đường dẫn
TƯƠNG ĐỐI, không gắn `repoRoot/_acceptance/<slug>/`. Ở lượt 4, ảnh E16/E18 rơi vào thư mục tạm của
phiên chấm, các eval chụp còn ghi đè ảnh của nhau, và ảnh sẽ mất khi thư mục tạm bị dọn. Lớp: *bản
chụp làm chứng phải nằm trong hồ sơ* và *đường dẫn phải suy từ vị trí*. Chưa tách được phần nào do
lệnh `capture.ui` của crm gây ra.

### B5. run_id do tác nhân chấm tự khai không bị kiểm hình dạng

`ridTho` và nhánh eval nhận mọi chuỗi khác rỗng. Ở lượt 4, E16 mang mã có chú thích trong ngoặc, còn
E18 mang mã có dấu hai chấm. Sổ chạy vẫn khớp nên không đỏ, nhưng mã không còn là khoá sạch cho bộ
đối chiếu. Rủi ro thấp; ghi để khỏi quên.

## 4. Chi phí lớn nhất không phải lỗi mã — ghim lại dây chuyền trong kho tiêu thụ

- 35 lượt ghim lại trong khoảng 3 ngày. Mỗi lượt chạy trọn test · lint · build cộng các phép đo riêng,
  khoảng 10 phút một lượt.
- Lượt 3 ký lúc 16:46 nhưng hơn một giờ sau mới có PR, gần hết thời gian đó là ghim lại. Phép đo của
  một hồ sơ còn gọi phép phá thử của hồ sơ khác, và thay đổi phá thử hiện ra trong cây làm việc giữa
  chừng.
- Ca rõ nhất: gộp mã Zalo làm **8 hồ sơ phòng ban hoá cũ**, dù «không có gì của phòng ban đổi».
- Luật «ghim lại theo mốc phát hành» chỉ áp cho engine kit. Mỗi lần gộp mã sản phẩm, CI «acceptance
  gate» của kho tiêu thụ vẫn buộc ghim lại, nên nhịp gộp của kho chính là trần song song của lộ trình.

**Chưa biết, phải đo trước khi chữa:** tám hồ sơ ấy hoá cũ vì `paths` của eval khai quá rộng (lỗi hồ
sơ, sửa ở crm) hay vì phép tính stale theo diff đọc sai (lỗi kit)? Một phép đo đọc lại tám hồ sơ đó
trả lời được. Chưa có neo nào đủ để mở ô.

Ba ma sát cấu trúc khác, đã có quyết định hoặc thuộc chỗ khác:

- **Tác nhân con không có Workflow.** S4 phải tách sang phiên riêng (owner quyết 25/09). Mỗi lượt vì
  thế thêm một câu xác nhận uỷ quyền. Tin liên phiên còn bị giữ chờ duyệt vì hai phiên khác chế độ
  quyền: lượt 4 gửi thẻ về phiên điều phối thì bị giữ. Đây là giới hạn harness; kit chỉ nên khai nó
  trên thẻ.
- **Hồ sơ đã khép (`da-cham-boi-thuc-te`) khoá thước.** E10 của `dieu-phoi-30-ngay-dau` đỏ sẵn từ
  22/09, và vòng khác không được sửa. Việc này tốn một quyết định đổi chữ AC-8 và một chip riêng. Theo
  ADR 0020 Đ8, đây là thiết kế chứ không phải lỗi. Giá của nó thì nay đã đo được: 1 lượt gọi người.
- **Kho dev chung giữa các cây** làm thước đỏ vì dữ liệu lạ. Việc này thuộc crm, chip đã mở ở crm.

**23/48 tin owner là hỏi tiến độ.** Theo khối ĐỊNH VỊ, kit là bảng đồng hồ. Ở lộ trình nhiều lượt
song song, bảng đồng hồ ấy không tồn tại, và owner phải tự hỏi. Tin loại này không tính vào lượt gọi
người của luật (c), nhưng là chi phí người thật.

## 5. Kiến nghị

1. **Một vòng sửa lỗi kit → 2.18.5 → crm nhận** (cần Cổng Đáng). Gồm B1, B2, B3, B4 và nửa còn lại
   của lỗi đường nền (§2). Neo: `crm/_acceptance/cap-nhat-tuan-okr/` (hồ sơ tái hiện, đã có
   `card-plain.json` và `gap-probe.md` hai bảng). B1, B2 và B4 chạm trực tiếp điều người thấy khi ký.
   B3 là điều kiện để mốc kế cắt đủ 5 dòng. Đây không phải vòng meta, vì một kho tiêu thụ đang chờ
   (crm, lượt 5 và các lượt sau).
2. **B5 vào sổ**, gộp vào vòng trên nếu chạm cùng tệp. Không mở ô riêng.
3. **Ghim lại dây chuyền (§4): hạt giống, không phải ô.** Đo tám hồ sơ hoá cũ vì mã Zalo trước. Nếu
   kết quả là «`paths` quá rộng», việc sửa thuộc crm. Nếu là «stale theo diff đọc sai», lúc đó mới có
   neo để mở ô ở kit.
4. **Không làm:** bảng đồng hồ nhiều lượt cho lộ trình. Đó là CỘNG, cần owner phê riêng, và 23 tin
   hỏi tiến độ mới là một số đo, chưa phải hợp đồng.

## 6. Bổ sung cùng ngày — vòng chấm 2 và 3 của lượt 4 đốt hết trần mà không có lỗi sản phẩm nào

Phiên S4 chạy tiếp tới 05:44Z, sau lần đọc ở §1–§5. Nguồn: bản chép phiên, journal của ba lượt
Workflow, và hồ sơ commit `757a2ab8` (vòng 2), `4773a2f2` (vòng 3) trên nhánh `feat/cap-nhat-tuan-okr`
của crm.

| Vòng | Verdict | Tác nhân · token con · phút | Vì sao đỏ/chặn | Lỗi sản phẩm |
|---|---|---|---|---|
| 1 | REJECT | 40 · 3,77 M · 29 | E21 thiếu một hồ sơ trong danh sách; E16/E18/E29 lỗi cách chụp | 0 |
| 2 | BLOCKED | 28 · 2,73 M · 20 | 2 tác nhân màn tự dừng vì câu người gõ; E21 ghi nhầm mã 1 | 0 |
| 3 | BLOCKED | 14 · 1,19 M · 26 | 3 tác nhân dừng đi tìm tệp không với tới; E21 ghi nhầm mã 1; cây đổi giữa lượt | 0 |

Cộng lại: 82 tác nhân, 7,7 M token con, khoảng 75 phút chấm, 9 tin owner gõ trong phiên chấm và 3 tin
liên phiên bị giữ hoặc hết hạn. Hồ sơ hết trần 3 vòng và phải xin owner vượt trần.

### B6. Harness chuyển câu người gõ gần nhất vào MỌI tác nhân chấm, kèm luật «câu này thắng» — nguyên nhân chính

Harness Workflow nay mở đầu prompt của mỗi tác nhân bằng «[Workflow harness — user request]»: nguyên
văn tin người gần nhất, kèm câu «where the computed task conflicts with this request, this request
wins». Tin được chuyển ở ba lượt (đã đọc từ journal):

- Vòng 1: «Tôi uỷ quyền phiên này dùng công cụ Workflow chạy bước chấm S4 cho hồ sơ cap-nhat-tuan-okr…»
  → khớp việc chấm, không tác nhân nào dừng.
- Vòng 2: «tách, nhưng không chạy làn 56 hồ sơ: AC-11…» → E6, E18 khai `cannotRun` vì «xung đột với
  yêu cầu relay».
- Vòng 3: «Đọc và làm theo tệp luot4-cham-lai-round2.md, mục Bổ sung 3». Tệp nằm ở thư mục tạm của
  phiên khác, nên E6, E7, E19 và lệnh dựng dừng lại để đi tìm tệp.

Chung gốc với B3: cùng tin chèn ấy đẩy thẻ `[wf-label]` xuống tin thứ hai. Kit không ghi đè được luật
harness bằng lời trong prompt, và cũng không nên. Nghiệm đúng tầng là làm cho **câu người gần nhất khớp
với việc chấm**: lượt gọi Workflow S4 chỉ chạy ngay sau một câu uỷ quyền chấm theo khuôn máy soạn sẵn,
gọi tên hồ sơ và vòng. Vòng 1 cho thấy cách này chạy. Giá: mỗi vòng một chạm, câu có sẵn để dán. Hiện
phiên chấm riêng vốn đã tốn đúng một chạm ấy, nên mục tiêu ≤1 chạm/lượt không đổi.

### B7. Tác nhân suy mã thoát từ chữ in ra, và chính điều này biến vòng hạ tầng thành vòng bị đếm

Lệnh E21 in lại đầu ra của lệnh con kiểm trước gộp, trong đó có dòng «VIOLATION … verdict=REJECT»,
rồi kết thúc bằng «… 0 hong». Theo phiên chấm, kết quả công cụ không có mã lỗi. Ở cả hai vòng tác nhân
vẫn khai `exitCode: 1`. Chuỗi hệ quả trong `lib/nhan-canh-gay.cjs`: dòng eval có mã khác mã đạt mang
nhãn `vat`, và có một mục `vat` là trạng thái chuyển sang `khoa`. Vì thế vòng BLOCKED do hạ tầng (B6)
không được «cùng round, không đếm» như luật K8, mà bị đếm. **Hai vòng hạ tầng đốt 2/3 trần**, đúng
dòng 3 của luật (c) («số vòng bị hạ-tầng-kit đốt lượt chấm»). Nghiệm máy giữ: bọc lệnh
`; printf '\n__EXIT=%s\n' $?` rồi rút mã bằng JS, không để tác nhân đọc.

### B8. `verified_commit` do tác nhân khai, không đối chiếu `invokedSha`

Vòng 3 được gọi ở `0bcb769c`, HEAD sau lượt là `9f096153` vì một phiên khác đã commit vào cây giữa
lượt. Báo cáo lại ghi `verified_commit: ec2849e5`, tức diffBase của vòng 1, không trùng cả hai. Workflow
đã lọc hình dạng hex (`acceptance-verify.js:1550`) nhưng không so với `args.invokedSha`. Nghiệm: JS so
hai giá trị. Lệch nghĩa là cây đổi giữa lượt, và lúc đó trả BLOCKED có tên, nhãn hạ tầng. Việc này
đồng thời lấp lỗ «kit không có khoá cây» mà không phải dựng khoá.

### Hai đề xuất đã có chip từ phiên S4 (chưa chạy)

- **Lệnh bọc làn khai trong config** (`feature_loop.lane_wrapper`, ví dụ `bun run do:man --chay
  "{lenh}"`), để làn ghim lại và S4 tự chạy trong phiên đo của kho thay vì bọc tay. Đây là CỘNG, cần
  owner phê.
- **Workflow đọc tệp đối số theo đường dẫn**, hoặc `s4-args.mjs` sinh sẵn bản workflow đã nhúng kèm
  dòng kiểm băm. Hôm nay mỗi vòng phải nhúng tay 92–108 KB.

### Kiến nghị cập nhật (thay mục 1 ở §5)

Vòng sửa lỗi kit → 2.18.5 xếp lại theo thứ tự giá: **B6 + B7 + B8 trước** (đốt lượt chấm, số đo trực
tiếp: 2 vòng, 3,9 M token, 46 phút, 0 lỗi sản phẩm), rồi B1, B2 (thẻ cổng), rồi B3 (chung gốc B6, cùng
một lần sửa), rồi B4. Neo: `crm/_acceptance/cap-nhat-tuan-okr/` cùng ba commit vòng. Lệnh bọc làn và
đường tệp đối số đi cùng vòng nếu owner phê CỘNG; không thì ghi hạt giống.

Việc trước mắt ở crm, không phải kit: vòng 4 của lượt 4 cần owner cho vượt trần. Chạy với câu trần
«chấm vòng 4», và không phiên nào commit vào cây trong lúc chấm.

## 7. Sổ chip lỗi kit của phiên điều phối (đọc lại tới 07:58Z) và ba lỗi mới

### 7.1 Chip nào đã chạy, chip nào còn treo

| Mở lúc (Z) | Nơi mở | Chip | Trạng thái 26/09 | Trùng với |
|---|---|---|---|---|
| 24/09 16:25 | điều phối | Báo giả «THIEU merge-base» | **Xong** — #216, 2.18.4 | — |
| 25/09 14:34→15:20 | điều phối | 2 → 3 → 4 lỗi (PATH, tệp hồ sơ bị coi là rác, thẻ rơi Ngoài phạm vi, thẻ chỉ đọc bảng phản biện đầu) | **Một nửa** — phiên chip sửa PATH (#217); #218 sửa lỗi gọi nhầm tên tệp bẩn sẵn; hai lỗi thẻ không làm | §2, B1, B2 |
| 26/09 03:29 | phiên S4 | Lệnh bọc làn khai trong config + workflow đọc tệp đối số theo đường dẫn | **Chưa chạy** | §6 cuối |
| 26/09 03:31 | điều phối | Hai lỗi thẻ cổng (Ngoài phạm vi, bảng phản biện) | **Chưa chạy** | B1, B2 |
| 26/09 05:43 | phiên S4 | Chắn câu người lọt vào tác nhân · mã thoát suy đoán · verified_commit sai | **Chưa chạy** | B6, B7, B8 |

Ba chip treo cùng nhắm một bộ tệp (`gate-card.js`, `acceptance-verify.js`, `s4-args.mjs`) và đều viết
«làm theo quy trình vòng tính năng của kho kit». Chạy riêng từng chip là ba vòng, mỗi vòng ba cổng
người, tức tới 9 lượt gọi. Gom lại thành một vòng thì chỉ còn 3. Chip 03:31 còn tả sai gốc của B1: bộ dựng
CÓ đọc «Out of scope». Chỗ rơi là bản dịch ghi id `OOS-*` mà bộ dựng không tra (xem B1). Phiên nhận
chip đó cần đọc §3 trước.

### 7.2 Ba lỗi mới

**B9. Tác nhân ui-check chạy song song mà dùng chung một kho đo → đỏ giả.** Lượt 5 thấy trước khi
chấm: 9 tác nhân cùng gọi một phép đo màn trên một kho, nên từ tác nhân thứ hai trở đi thấy dữ liệu của
tác nhân trước. Lượt 5 tự bọc phép đo trong một khoá xếp hàng, khoảng một phút mỗi lượt. Phiên điều
phối ghi rằng đây «đúng là lỗi từng làm lượt 4 đỏ ở lượt chấm đầu». Kit chỉ xếp tuần tự các lệnh suite
(AC-9); eval màn luôn song song. Kho tiêu thụ không có cách khai «eval này không chạy song song được»,
nên mỗi kho tự vá một kiểu: hôm nay crm có hai kiểu, thư mục ảnh riêng từng lượt và khoá xếp hàng. Nghiệm
đúng tầng là một cờ khai trong `evals.yaml` hoặc config (ví dụ `serial: true` cho executor) để workflow
đưa eval đó vào nhánh tuần tự sẵn có. Chip 03:29 (lệnh bọc làn) chạm cùng chỗ.

**B10. Hai phiên cùng ghi một cây, và cách vòng qua giới hạn harness này đẻ ra lỗi harness kia.** Chuỗi
đo được 01:37–05:50Z:
1. Tin liên phiên giữa phiên điều phối và phiên chấm bị giữ chờ duyệt rồi hết hạn ít nhất 6 lần, mỗi
   lần tắc 30–60 phút.
2. Để vòng qua, phiên điều phối ghi đề bài vào tệp nháp và nhờ owner dán «Đọc và làm theo <tệp>».
3. Chính câu dán ấy là câu harness chuyển vào mọi tác nhân chấm (B6), và vòng 3 chết vì tác nhân đi tìm
   tệp.
4. Cũng để khỏi chờ, phiên điều phối tự gộp #152 vào cây lượt 4 đúng lúc vòng 3 khởi động, nên cây đổi
   giữa lượt (B8).

Kit không giữ bất biến «một cây, một người ghi trong lúc chấm». Phiên điều phối phải tự hứa «tôi không
đụng cây», nghĩa là bất biến này đang được giữ bằng lời. B8 (so HEAD với `invokedSha`) biến nó thành
vật-máy-giữ ở phía phát hiện.

**B11. Luật «chặn vì hạ tầng thì thử lại cùng vòng» đúng trên giấy nhưng máy không thi hành, nên kho
tiêu thụ tự chép luật.** Phiên điều phối viết đúng tinh thần K8: vòng 2–3 là lỗi bộ chấm, không được
đếm. Nhưng `s4-args` vẫn đánh số vòng 3 rồi vòng 4, và owner phải cho vượt trần thêm một lần. Gốc máy là
B7: một eval bị gắn nhãn `vat` do mã thoát đoán sai. Hệ quả thứ hai: đề bài chip S4 lượt 5 (07:15Z) chép
thành «ba luật bắt buộc», gồm «chạy lại cùng round» và «ui-check chạy tuần tự». Phiên chấm không làm được
hai điều ấy nếu không sửa workflow, mà luật kho cấm sửa. Luật sống ở lời của kho tiêu thụ trong khi máy
của kit làm khác, đúng lớp «dặn bằng lời làm nghiệm».

### 7.3 Một quan sát giảm lượt gọi người, không cần sửa mã

S4 phải tách sang phiên riêng chỉ vì **tác nhân con** không có Workflow. Lượt 5 chạy như một phiên chip
cấp cao nhất, và đã chấm S4 ngay trong phiên của nó (07:34Z): không phiên chấm riêng, không tin liên
phiên, không bước «Đọc và làm theo tệp». Mở mỗi lượt của lộ trình thành phiên cấp cao nhất thay vì tác
nhân con xoá được cả chuỗi B10 và câu uỷ quyền phụ. Đây là cách điều phối, thuộc GUIDE hoặc bộ nhớ,
không phải một ô.

### 7.4 Kiến nghị gộp (thay §5.1 và §6 cuối)

**Một vòng kit → 2.18.5**, rút chip 03:31 và chip 05:43 vào vòng đó thay vì chạy riêng:
1. B6, B7, B8, B11: đốt lượt chấm.
2. B9: cờ tuần tự cho eval.
3. B1, B2: thẻ cổng.
4. B3, B4: đo chi phí, neo ảnh.

Chip 03:29 (lệnh bọc làn, đường tệp đối số) là CỘNG, chỉ vào vòng nếu owner phê. Neo cho cả vòng:
`crm/_acceptance/cap-nhat-tuan-okr/` cùng các commit vòng `0a0f16f9`, `757a2ab8`, `4773a2f2`.

## 8. Chấm theo North Star, rồi đề xuất cập nhật kit

### 8.1 Ba thước trên lượt 4 (`cap-nhat-tuan-okr`, T3, ship qua crm#153)

| Thước | Số đo | Ghi chú |
|---|---|---|
| Làm-xong → quyết-được | **5 giờ 33 phút**: tệp đối số vòng 1 lúc 00:52Z → ký lúc 06:25Z | Bốn vòng chấm chỉ chiếm 93 phút. Phần còn lại là chờ tin liên phiên, ghim lại sau mỗi lần gộp (#149–#152 lên nhánh chính giữa chừng), và gỡ kẹt phiên. |
| Lượt gọi người | Thiết kế T3 là 4. Riêng phiên chấm có **≥11 tin owner gõ**, và chỉ dòng ký là trong thiết kế. Cộng thêm ≥6 lần duyệt tin bị giữ ở phiên kia. | Tức **≥10 lượt ngoài thiết kế** trên một kết quả ship, trong khi mục tiêu là 0. |
| Chi phí máy | 4 vòng S4: 100 tác nhân, 919 k token ra, 93 phút; token con khoảng 9 M (vòng 4 chưa tách được) | Cả 4 vòng: **0 lỗi sản phẩm trong hợp đồng**. Ba ô màn đỏ vòng 1 là lỗi thước; vòng 2–3 chết vì hạ tầng. Khối tìm lỗi ra 13 mục ngoài hợp đồng, owner đổi 5 mục sang hợp đồng mới. Khối này có giá trị thật với người, nhưng người phải gõ 13 định đoạt. |
| Tin được (ràng buộc) | Không màu xanh nào sai | Bằng chứng không tự dối vẫn giữ. Cái vỡ là **chi phí** để giữ nó. |

Đọc theo thứ tự luật đặt, dòng người trước dòng máy: kit giữ được niềm tin nhưng đã **đẩy người vào
giữa vòng**, đúng thứ North Star sinh ra để chặn. Số lượt ngoài thiết kế không đến từ răng. Nó đến từ
**chỗ nối giữa kit và harness**: câu người lọt vào tác nhân, tin bị giữ, tác nhân con không có Workflow,
mã thoát suy đoán.

### 8.2 Chấm từng hạng mục

Cột «Thước» ghi dòng mà hạng mục đang làm hỏng (N = lượt gọi người · T = làm-xong→quyết-được · M = máy ·
Tin = bằng chứng). Cột «Loại»: SỬA = vá cái đang có, không thêm bề mặt · TRỪ · CỘNG = cần owner phê.

| # | Hạng mục | Nguyên tố | Thước | Đo được trên lượt 4 | Loại | Hạng |
|---|---|---|---|---|---|---|
| B7 | Mã thoát do tác nhân đoán → vòng hạ tầng bị đếm | 2 | N · T · M | Trần vỡ, owner phải cho vòng 4 | SỬA | **1** |
| B6 | Câu người lọt vào mọi tác nhân chấm | 3 (câu người ≠ việc) | N · T · M | 2 vòng · 46 phút · 3,9 M token · ≥4 tin | SỬA | **1** |
| B8 | verified_commit không so invokedSha · cây đổi giữa lượt | 2 | Tin | Hồ sơ vòng 3 ghi sai commit | SỬA | **1** |
| B11 | Kho tiêu thụ chép luật K8 thành lời | — hệ quả B7 | N | Đề bài lượt 5 mang «ba luật» | tự hết khi B7 xong | — |
| — | Tác nhân con không có Workflow → phiên chấm riêng + tin liên phiên | 3 | N · T | Phần lớn trong ≥10 lượt ngoài thiết kế | **TRỪ** (cách chạy, không mã) | **1** |
| B9 | Eval màn song song trên một kho đo → đỏ giả | 2 | T · M | Góp vào REJECT vòng 1; lượt 5 tự khoá | SỬA (đảo mặc định) | 2 |
| B1 | Thẻ Cổng Phạm vi rơi «sẽ không làm» | 3 | Tin của chữ ký | 5/8 mục rơi im lặng | SỬA | 2 |
| B2 | Thẻ chỉ đọc bảng phản biện đầu | 3 | Tin của chữ ký | 5 phát hiện vắng | SỬA | 2 |
| B4 | Ảnh bằng chứng không neo hồ sơ | 2 | Tin | Ảnh ở thư mục tạm | SỬA | 3 |
| B3 | Bảng chi phí mù theo khối | — (đo kit) | đo M | Dòng 4 luật (c) không cắt được | SỬA, chung gốc B6 | 3 |
| B5 | run_id không kiểm hình dạng | 2 | — | 2 mã lệch, chưa đỏ | sổ | 4 |
| §4 | Ghim lại dây chuyền | — | **T** (lớn nhất) | 35 lượt / 3 ngày, 3 lượt riêng cho #151 | chưa biết — đo trước | hạt giống |
| — | Eval hứa việc vượt trần 600 giây (E21 «56 hồ sơ») lọt qua Cổng Phạm vi | 1 | N | 1 quyết định đổi AC sau cổng | CỘNG (kiểm ở Cổng Phạm vi) | hạt giống |
| chip 03:29 | Lệnh bọc làn · đọc tệp đối số theo đường dẫn | — | M | Nhúng tay có kiểm băm, đang chạy được | CỘNG | hoãn |

### 8.3 Đề xuất cập nhật kit

**A. Vòng 2.18.5 «chấm không tự đốt lượt, không kéo người vào giữa»**: chỉ SỬA, không thêm bề mặt.
1. **B7:** workflow bọc mọi lệnh máy bằng `; printf '\n__EXIT=%s\n' $?` rồi rút mã bằng JS. Tác nhân không
   còn khai mã thoát.
2. **B8:** JS so `verified_commit` với `args.invokedSha`. Lệch thì BLOCKED có tên «cây đổi giữa lượt»,
   mang nhãn hạ tầng (cùng vòng, không đếm).
3. **B6 (+B3):** máy soạn một câu uỷ quyền chấm cố định, gọi tên hồ sơ và vòng. SKILL chỉ cho gọi
   Workflow S4 ngay sau câu ấy; sau câu khác thì in câu ấy ra để dán. `wf-usage` đọc nhãn từ `.meta.json`
   (`description`/`workflowPhase`) thay vì tin đầu.
4. **B9, đảo chiều mặc định:** eval ui-check chạy tuần tự, vì vật đo là một trình duyệt và một kho. Giá:
   khoảng một phút mỗi eval màn. Không thêm khoá cấu hình nào.
5. **B1, B2:** thẻ tra `wont_do` theo cả id `OOS-*` và đọc mọi bảng phản biện. Dòng dịch nào không khớp
   ô thì bật **cờ vàng**, không rơi im lặng. Đây là nghiệm theo lớp «tiếng người vào ô máy đọc».
6. **B4:** đường ảnh tuyệt đối dưới hồ sơ của vòng.

Mỗi mục kèm ca đỏ trên chính hồ sơ `crm/_acceptance/cap-nhat-tuan-okr/` và commit vòng 2–3. Đây là
chiều đỏ có sẵn, không phải fixture viết tay.

**B. TRỪ, không cần mã (GUIDE §điều phối + SKILL S0):** mỗi lượt của một lộ trình chạy như **phiên cấp
cao nhất** (chip), không làm tác nhân con của phiên điều phối. Phiên đó chấm S4 tại chỗ, nên bỏ được
phiên chấm riêng, tin liên phiên và bước «đọc và làm theo tệp». Lượt 5 đã chạy đúng hình này
(07:34Z). Bỏ luôn nếp cũ «tác nhân con dừng trước S4», vì nó sinh ra chỉ để vá giới hạn Workflow.

**C. Hạt giống, không mở ô:** (1) đo tám hồ sơ hoá cũ vì mã Zalo để biết ghim lại dây chuyền là lỗi của
`paths` hay của kit; (2) Cổng Phạm vi có nên báo eval nào không thể chạy trong trần công cụ không.

**D. CỘNG hoãn:** lệnh bọc làn và đọc tệp đối số theo đường dẫn. Đường tay hiện chạy được và có kiểm
băm, nên nó không kéo người vào vòng. Mở lại khi có ≥1 vòng chấm hỏng vì nhúng sai.

### 8.4 Bảng dự báo 5 dòng cho vòng A + B (luật c)

| Dòng | Dự báo | Căn cứ |
|---|---|---|
| Làm-xong → quyết-được | ↓ | Không còn vòng chết vì hạ tầng hay tin bị giữ |
| Lượt gọi người/vòng (ngoài thiết kế) | ↓ mạnh | B6 + TRỪ phiên riêng xoá phần lớn ≥10 lượt đo được |
| Vòng bị hạ-tầng-kit đốt | ↓ | B7 + B8 cho vòng hạ tầng đúng nhãn, không đếm |
| Token máy/vòng | ↓ | Ít vòng hơn. Mỗi vòng thì như cũ; khối tìm lỗi không đổi |
| Phút máy/lượt chấm | ↑ nhẹ | Eval màn chạy tuần tự |

Điều kiện tin cậy: đường verdict không đổi thành phần. B7 và B8 chỉ đổi **nguồn** của hai trường, và
mỗi cái có ca đỏ lẫn ca im (vòng 1 thật phải vẫn REJECT; cây không đổi thì phải im).

**Luật chiều rộng (b):** đây là vòng meta duy nhất giữa hai mốc, và phải buộc vào việc crm nhận 2.18.5.
crm đang chờ thật cho lượt 5 trở đi, nên có neo ngoài.
