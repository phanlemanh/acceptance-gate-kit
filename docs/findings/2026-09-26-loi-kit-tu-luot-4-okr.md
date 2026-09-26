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
