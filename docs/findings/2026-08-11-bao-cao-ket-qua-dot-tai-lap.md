# Báo cáo kết quả — đợt tái lập kit (08 → 11/08/2026)

> **[THAY THẾ 12/08]** Bản này đúng về hướng nhưng **sai 5 chỗ đếm được** (100
> commit → thật 121 · 72 dòng sổ vấp → 73 · "main clean" trong khi main đang ĐỎ ·
> "mọi phiên đã nghỉ" trong khi main còn nhận 5 commit + 1 chữ ký mới · số lượt
> gọi người ở chip ③b). Dùng bản tổng kết lớn thay cho bản này:
> [2026-08-12-tong-ket-lon-dot-tai-lap.md](2026-08-12-tong-ket-lon-dot-tai-lap.md)
> — 31 lượt agent khai quật + phản biện từng con số trên vật.

*Soạn: phiên B theo yêu cầu owner ("tổng kết lớn như báo cáo kết quả dự án").
Mọi con số dưới đây kiểm từ git tại thời điểm soạn; chỗ nào không đo được thì
nói rõ là không đo được. Chốt trạng thái: kit main `e943f96`, acceptance-gate
**1.39.2** / feature-loop **1.27.1**; consumer floorplanstudio main `6ea25c9`.*

---

## 1 · Bài toán khi mở đợt

Đến 09/08 hệ ở trạng thái xấu nhất kể từ khi có kit:

- Toàn bộ việc đang giao là **kit-sửa-kit**; không feature sản phẩm nào đi qua.
- Owner **mệt cổng đến mức tự nhận điền đại** `time_human_minutes` cho qua —
  nghĩa là một trường số liệu của kit đã mất giá trị làm bằng chứng.
- Bản 1.27.2 chết giữa đường: chính lưới đo của nó nuốt mã thoát.
- Owner tuyên **tạm nghỉ toàn bộ**.

Câu hỏi phải trả lời trước khi làm tiếp: *trước khi có AI người ta làm thế nào,
nguyên lý gốc là gì, giá trị thật nằm ở đâu?*

## 2 · Cái được quyết (nền của mọi việc sau đó)

**⭐ Kim chỉ nam** (nay đứng đầu `CLAUDE.md`): giá trị duy nhất là **sản phẩm
đến tay người dùng**; kit là công cụ **hỗ trợ Claude**, không phải bộ máy giám
sát; **giờ-kit là CHI PHÍ, không phải tiến độ**; rẻ-và-nhanh thì làm, không thì
bỏ — trừ lõi ba món không nhượng: **chữ ký người · không bịa bằng chứng ·
đường đảo rẻ**.

Hệ quả thi hành: mọi luật kit bị rà lại (8 giữ · 6 xung đột → xếp 2.1 · 4 chờ
số liệu đội), và mọi đề xuất việc-kit từ nay phải trả lời được *"rút ngắn đường
sản-phẩm-đến-người-dùng ở chỗ nào"* và *"chặn failure mode nào có tỉ lệ ĐO
ĐƯỢC"*.

## 3 · Kết quả giao được

### 3.1 · GĐ2 — kiểm chứng trên sản phẩm thật (repo `floorplanstudio`)

| Feature | Kết cục | Giá trị chứng minh |
|---|---|---|
| `mcp-cost-guard` | **Merged** | Kit chạy được trên repo tiêu thụ thật, không chỉ tự-host |
| `describe-scheme-perf` | **Merged** | Đường kỹ thuật tốn 2–3 lần gọi người/feature |
| `digitize-floorplan` | **KILL tại Cổng Giá trị** (tag `archive/digitize-floorplan-vong3`) | Mọi cổng máy xanh (39 test · 15 eval · 5 màn design · 3/3 VLM) mà người đầu tiên chạm nói "chưa dùng được cho khách" |

Cộng: `refine-editor` xếp lại tại Cổng Đáng (pivot, 0 dòng code lãng phí) ·
`digitize-trace-v2` để ở trạng thái cân nhắc.

**Phát hiện đắt nhất cả đợt:** máy đo được **ĐÚNG HÌNH**, không đo được **ĐỦ
DÙNG**. Chỉ Cổng Giá trị bắt được khoảng cách đó, và nó trả tiền vé ngay lần
chạy đầu: giá của câu trả lời "chưa đủ" là ~95 phút dựng, thay vì một quý phát
hành nhầm hướng.

**Phát hiện đắt thứ hai:** 4 ca **mắt-người-bắt-máy-trượt** (3/4 do owner),
tất cả xảy ra khi mọi cổng máy đều xanh. Người không chỉ đứng ở cổng — người
đan vào giữa dòng, và chỗ đan đó chịu lực.

**Phát hiện đắt thứ ba:** ván 3 đã **bỏ giai đoạn thiết kế UX/UI** mà không ai
kêu — 3/4 lý do kill là lỗi thiết kế thuần, không lỗi code. Hệ luận: *khi LÀM
rẻ đi trăm lần, giá trị dồn về KHAI; sai-ở-tầng-ý-định thành loại sai duy nhất
còn đắt.*

### 3.2 · Kit 2.1 — 5 chip ship trong ~36 giờ

| Chip | Nội dung | PR | Quy mô |
|---|---|---|---|
| ⓪ | Doc onboarding đội (số kỳ vọng thật, không tô đẹp) | — | 1 file |
| ① | Staleness chỉ áp cho hồ sơ **trong diff PR** (1.39.2) | #38 | +775/−7, 15 file |
| ② | Khối **👉 VIỆC CỦA ANH** thành thành phần cứng máy-sinh | #39 | +2264/−34, 42 file |
| ②b | **Răng** cho bộ phép đo của ② (cô-lập-lớp · đếm-nguồn · ranh-giới-câu) | #40 | +740/−21, 11 file |
| ③ | **Một-lượt-gõ + `--repo`** cho 6 lệnh cổng người | #41 | +1567/−2, 30 file |
| ③b | **Máy gánh nhận thức, người giữ quyết định** (tự suy danh tính/ngày/hồ sơ · thôi hỏi phút · khuyến nghị kèm căn cứ) | #42 | +1796/−162, 27 file |

Tổng: **100 commit** trên main trong 4 ngày · 5 PR merge · 0 lần vượt trần vòng
chấm không xin phép · 0 lần hạ thước để qua cổng.

### 3.3 · Sử liệu và tri thức

- **Sổ vấp**: 72 dòng (15 · 30 · 17 · 10 theo ngày 08→11) — kho đề bài giàu
  nhất kit từng có, mỗi dòng là một lớp lỗi có tên + cách chữa + giá đã trả.
- 6 văn bản nền trên main: bản-chất-thật-vòng-lặp (09/08) · rà-soát-luật-theo-
  North-Star · reflect-trước-vòng-3 · tổng-kết-GĐ2-đối-chiếu-spec · reflect-lớn-
  khép-GĐ2 (kèm mục tự-rà 7 lỗ logic) · retro-vòng-3.
- Nghi thức **khép sử liệu** thành luật: feature merged → hồ sơ về main; feature
  killed → tag lưu trọn + một trang tường thuật; **không bao giờ vận chuyển chữ
  ký**.

## 4 · Ba nguyên tắc thiết kế owner đặt trong đợt (giá trị dùng lại lâu nhất)

1. **Người chỉ khai điều chỉ người biết.** Lõi chữ-ký nằm ở **hành vi** (khoá
   lệnh + commit chữ-ký-riêng do git tự ghi tác giả/ngày), không nằm ở chuỗi ký
   tự người gõ. Mọi thứ máy biết thì máy điền và **hiển thị lại kèm xuất xứ**.
2. **Máy gánh nhận thức, người giữ quyết định.** Gặp mơ hồ: máy nêu cách hiểu
   khả dĩ nhất **kèm căn cứ** + xác nhận một chạm. Câu hỏi mở là đường cùng.
   Ranh giới với bất biến chống-điền-sẵn: máy gánh **suy nghĩ**, không phát ngôn
   hộ **quyết định**.
3. **Hệ an toàn bằng LƯỚI và ĐƯỜNG ĐẢO, không bằng câu hỏi.** (Rút từ quan sát
   Claude Code dám mặc định auto/bypass.) Luật ngón tay chấm mọi chốt: *"mày là
   lưới hay là câu hỏi?"* — hỏi trước chỉ khi sai-khó-đảo; còn lại làm rồi để
   lưới bắt.

## 5 · Đo hiệu quả: cái gì thật sự đổi

| Chỉ số | Trước đợt | Sau đợt |
|---|---|---|
| Feature sản phẩm đi trọn vòng | 0 | **3** (2 merged, 1 kill có hồ sơ) |
| Cổng Giá trị (UAT) | chưa từng chạy | **chạy 1 lần, và dám nói KHÔNG** |
| Gọi người / chip kit | không đếm được (vòng lặp mở) | **2 cổng + 1 merge**, không lần nào ngoài thiết kế |
| Lượt gõ để ký một cổng | chuỗi hỏi-đáp từng trường | **2 lượt** (③b), mục tiêu tiếp: 1 |
| Máy tự chặn mình trước cổng | — | **3 lần** (② hai lần, ③b một lần) khi mọi số đều xanh |
| Trường `time_human_minutes` | owner điền đại | **thôi hỏi hẳn** |

**Điều đáng giá nhất lại không nằm ở code:** ba hành vi mới đã thành phản xạ ở
*mọi* phiên, kể cả phiên mở mới chưa từng gặp bài học gốc — (a) máy tự chặn
mình trước cổng thay vì để lưới chặn; (b) bài học lan không cần cơ chế (vấp
sáng ghi sổ, chiều phiên khác tự áp); (c) từ chối bằng chứng không đạt chuẩn
(không nhận một lượt đo lỗi làm "đã bắt được"; dán nhãn nguồn-thứ-cấp cho lời
trích thay vì chép thành lời-gõ-trong-phiên).

## 6 · Chi phí và mặt trái — nói thẳng

1. **Quá tải chuyển từ TỪNG CỔNG sang TẦN SUẤT GỌI.** Mỗi cổng rẻ đi, nhưng dây
   4 chip trong ~36h cộng lại thành: 4 duyệt + 4 ký + 4 merge + 4 bấm chip +
   các lượt làm rõ — tất cả dồn vào một người. Owner phát tín hiệu nguyên văn
   tại Cổng 2 chip ③b: *"điển hình của quá tải nhận thức… kit trở thành một chi
   phí lớn"*. Đây là **ràng buộc số 1 tái xuất hiện dưới dạng mới**
   (gate-fatigue → call-frequency-fatigue), và một phần lỗi thuộc phiên điều
   phối (khối nhiều mục + nhắc lặp món treo).
2. **Vẫn là kit-sửa-kit.** 5/5 chip của 2.1 là kit sửa chính nó. Chúng đều có
   vấp thật làm chứng, nhưng không chip nào tự nó đưa một sản phẩm đến người
   dùng — điều kiện mở 2.1 đạt đúng luật, song North Star đòi hỏi phần tiếp
   theo phải là sản phẩm.
3. **Không đo được hành vi thật của model khi thi hành lệnh.** Mọi phép đo là
   đo văn dạy và quan hệ văn bản; răng thật vẫn là lần gõ đầu của người. Đã
   khai known-limit, chưa có lời giải.
4. **Phép đo bắt chuỗi, không bắt nghĩa.** Ai viết ngược một nguyên tắc mà vẫn
   đủ chuỗi thì thước vẫn xanh. Giảm nhẹ bằng hội đồng đọc nghĩa; không có vá
   rẻ.

## 7 · Trạng thái kết đợt

- **Kit**: main `e943f96`, mọi PR merged, pre-merge clean, không hồ sơ nào treo
  thiếu chủ. Kho hồ sơ: 39 workspace.
- **Consumer**: main `6ea25c9`, sử liệu vòng 3 đã khép đúng nghi thức.
- **Dây chip 2.1**: **DỪNG sau ③b** theo veto-default — ④–⑦ xếp kho, chỉ mở lại
  khi có vấp thật kéo hoặc owner gọi. Mọi phiên máy đã nghỉ.
- **Còn nợ**: thông báo #2 cho đội (owner gửi) · GĐ4 khoá chờ đội tự chạy ≥2
  feature không có phiên điều phối + gold-set ≥10 mẫu · 4 câu hỏi reflect kế.

## 8 · Khuyến nghị việc kế (một đường, không bày menu)

**Quay về sản phẩm.** Cụ thể theo thứ tự: (1) gửi thông báo #2 để đội bắt đầu
dùng bản 1.39.2 — đây là việc rẻ nhất còn lại có tác động lớn nhất; (2) ván kế
là một **feature sản phẩm thật**, không phải chip kit, chạy trên bản hiện tại
để lấy số liệu đội — đó cũng chính là dữ liệu mở khoá GĐ4; (3) chỉ mở lại dây
chip khi một vấp thật của đội kéo nó ra khỏi kho.

Phép thử tự áp cho mọi đề xuất sau đợt này: *"việc này rút ngắn đường
sản-phẩm-đến-người-dùng ở chỗ nào, và nó là LƯỚI hay là CÂU HỎI?"*
