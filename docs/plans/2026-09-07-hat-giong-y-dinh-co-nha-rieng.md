# Hạt giống — Ý định có nhà riêng: cửa vào và cửa ra không cần người ngồi phiên

**Ngày:** 2026-09-07 · **Trạng thái:** sống ở `_acceptance/y-dinh-co-nha-rieng/opportunity.md` · **Hạng dự
kiến:** T2 theo lát (ba lát, mỗi lát một vòng; lát nào cũng không thêm cổng người,
không lệnh thứ bảy — ADR 0002). **Mở dưới luật cộng 07/09.**

**Sinh từ:** đối chiếu «The AI-Native SDLC playbook» (07/09) đọc như một *chuỗi
bàn giao* — [toàn trình playbook vs kit](../findings/2026-09-07-toan-trinh-playbook-vs-kit.md)
§4 R1 · R2 · R5 — cộng ba chỗ đứt của chuỗi vật kit (ĐỨT 1 · 7 · 8 trong
[bản kỹ thuật](../findings/2026-09-07-doi-chieu-ai-native-sdlc-playbook.md)),
và một giới hạn kit chưa khai thành lời: *với repo tiêu thụ nhiều người, người
khởi xướng ≠ người quyết* (mục D1 bản kỹ thuật).

> Chữ trong file này là NGUỒN. Hai hình tầng 2 đi kèm là chiếu:
> `assets/2026-09-07-bai-hoc-playbook/04-toan-trinh-playbook.html` và
> `05-toan-trinh-kit.html` (ô đỏ nhạt ở hai đầu vòng là hai chỗ hạt giống này
> nhắm tới).

## 0. Tóm tắt một đoạn

Kit mạnh hơn playbook ở **giữa** vòng (thước có chiều đỏ, phản biện sạch, sổ
quyết định) và **hai đầu** vòng là chỗ khác biệt cấu trúc: ý định chỉ sinh ra
khi owner ngồi trong phiên (`opportunity.md` là vật của phiên, không phải vật ai
cũng để được vào kho); và giá trị đo **một lần** ở phiên nghiệm thu rồi thôi —
làn máy-đi-trước không bao giờ tới Cổng Giá trị, `iterate` mở vòng mới bằng tay.
Playbook làm khác ở đúng hai chỗ đó: `intent.md` có **nhà riêng**, ai cũng viết
được, chủ sản phẩm duyệt **bằng merge**; và bước vận hành **tự viết** `intent.md`
mới khi một băng tất định bị vượt. Hạt giống này đem hai cửa đó vào kit mà
**không thêm cổng người**: tách *viết* khỏi *ký* ở đầu vòng; biến ngưỡng đã khai
thành băng theo dõi ở cuối vòng; và lần đầu cho **nguyên tố 1** một thước.

## 1. Lỗ — bằng chứng trên nguồn (07/09, main `5c15e065`)

| Số đo | Giá trị |
|---|---|
| Hồ sơ cơ hội trong kho kit | 31 (`_acceptance/*/opportunity.md`) — 14 `discovery`, 13 `build`, 2 `park`, 1 `kill`, 1 `build` chưa có hợp đồng |
| Hồ sơ cơ hội ký Cổng Đáng **bằng lệnh** | **0** — `commands/approve.md` không có chữ «Cổng Đáng» / `opportunity` / `decision`; hồ sơ mới nhất (`vong-la-mot-ket-qua`, 04/09) ghi `decided_at` là *«mốc phát ngôn «ký cổng đáng» trong hội thoại, máy ghi hộ»* |
| Làn thẻ Cổng Đáng | dựng trọn vòng 01/09 rồi **thu phạm vi, trả về ô** (cây ghim `528caaa8`, 2 vòng S4 REJECT cùng lớp) — lỗ gốc chưa đóng |
| Hồ sơ từng tới Cổng Giá trị trong kho kit | **0/78** (`uat-session.md` 0 · `stranger-drive.md` 0) — ba bộ đọc đang canh một loại vật chưa có bản thật |
| `## Đường đo` chốt ở hợp đồng được phiên nghiệm thu đọc | **không** — `uat-session/SKILL.md:61` chép ngưỡng nguyên văn từ `opportunity.md`; «Đường đo» xuất hiện 0 lần trong skill/khuôn nghiệm thu |
| Số đo nào cho «ý định chốt trước khi làm» (nguyên tố 1) | **không có** — ba dòng số luật (c) không dòng nào |

## 2. Điều muốn có — ba lát

### Lát A · Nhà ý định (cửa vào)

- Một **khuôn ô cơ hội nháp** tối thiểu — ba ô: *vấn đề & ai gặp* · *kết quả
  muốn thấy* · *ràng buộc / câu hỏi mở* — `stage: discovery`, `decision` trống,
  tác giả = `git author`. Bất kỳ ai trong đội **commit được** mà không cần phiên
  máy; `/start` đã đọc `discovery` thành «đang cân nhắc» — thứ thiếu là khuôn
  nháp và luật *ý chưa có ngưỡng vẫn hiện*.
- **Cổng Đáng có lệnh ký thật** — mở rộng `/approve` (không lệnh thứ bảy): máy
  điền ngưỡng `[đề xuất]`, người gỡ tiền tố = chốt, một lượt, **một PR**. Phải
  vào bằng bài học của `cong-dang-co-cua` (ba lớp tái phát: cờ-người-dùng-
  xuyên-chốt · hai-nguồn-cho-một-luật · đối-chứng-chép-công-thức) và cây ghim
  `528caaa8` chỉ được lấy **theo hướng dẫn** ở `discovery/LAY-VE-LAN-THE.md`,
  không bê nguyên.

### Lát B · Thước cho nguyên tố 1

Ba số **máy rút từ git và sổ**, in cạnh ba dòng số hiện có ở hồ sơ phát hành:

1. thời gian từ ô nháp commit → Cổng Đáng ký;
2. tỉ lệ ô sống qua Cổng Đáng (build/iterate ÷ tổng quyết);
3. **số lần hợp đồng hoặc ô cơ hội bị sửa sau khi `plan.md` hoặc commit code
   đầu tiên đã có** — đây là số đo trực tiếp của «ý định chốt trước khi làm».

Không phải đo-thước-của-thước: chúng đo **vòng sản phẩm**. Không thêm dòng
đếm tay nào.

### Lát C · Băng theo dõi sau phát hành (cửa ra)

- Sau `release`, ngưỡng UAT đã khai trở thành **băng** trong một file version-
  control của **repo tiêu thụ** (kit giữ khuôn + bộ đọc; repo giữ số).
- Một script **tất định, có test riêng, không model** đọc số qua `## Đường đo`
  đã chốt ở hợp đồng (nối luôn ĐỨT 7). Ba nấc: ghi sổ · chẩn đoán đọc-only ·
  **viết ô cơ hội nháp** (đúng khuôn lát A) vào hàng đợi «đang cân nhắc».
- Bác kèm lý do → chỉnh băng. Không thêm cổng người: ô nháp chờ ở **cùng cửa**
  với ý của người.

### Ranh giới với hạt giống «Việc kế theo plan» (06/09, #148)

Hạt giống đó đọc **ý định phía plan của repo** (roadmap, hạt giống nấc 1 — «ý
chưa có file») ở chế độ **chỉ-đọc**: kit không giữ, không sửa; sự thật vẫn chỉ
ở `_acceptance/`. Nhà ý định ở đây nằm **phía sự thật của cổng**:
`opportunity.md` `stage: discovery` — 17 ô đang có đã là đúng vật đó. Lát A
**không** dựng kho ý định thứ hai; nó chỉ hạ ngưỡng *viết* (khuôn nháp ba ô,
không cần phiên) và cho Cổng Đáng một lệnh *ký*. Một ý ở nấc 1 được hạt giống
06/09 **đếm**; khi ai đó biến nó thành ô nháp thì nó sang lát A. Hai hạt giống
nối nhau, không chồng — và lát A mở sau, vì nó cần ô nháp là thứ thẻ start đã
biết đếm.

## 3. Ràng buộc

- **Không thêm lượt gọi người/vòng**; phép thử: người trả lời khác khuyến nghị
  thì dựa vào điều gì máy không có? — ở Cổng Đáng là *có đáng làm không* (đánh-
  đổi giá trị: câu hỏi thật); ở cửa ra là *bác hay làm* (câu hỏi thật). Mọi
  thứ khác máy tự đi.
- **Kit là engine:** băng, số, ID bề mặt sống ở repo tiêu thụ; kit chỉ giữ ổ
  cắm (mẫu `ds_skill`: khoá config trỏ file + luật vắng-thì-gì), khuôn và bộ đọc.
- **Phát hiện phải tất định** — playbook dòng 938: script phát hiện có version,
  có unit test, không model; model chỉ được gọi *sau* khi băng vượt.
- Đường đọc-cũ: ô cơ hội không có khuôn nháp / hợp đồng không có Đường đo → cờ
  vàng, không bắt migrate.

## 4. Vì sao chưa làm

- Meta-work đóng băng; giữa hai mốc tối đa một vòng, chỉ khi owner gọi tên.
- Lát A phần «lệnh ký» đã **nổ hai vòng** (01/09) — vào lại phải mang theo điều
  kiện ở §2, không mở như mới.
- Lát C cần một **ván thật ở repo tiêu thụ**: kho kit chưa từng có phiên nghiệm
  thu nào (0/78), nên chưa có Đường đo nào từng được đọc để làm đối chứng dương.

## 5. Điều kiện mở lại

- **Lát A** — ngưỡng đang đếm: ≥2 lần một người trong đội (không phải owner)
  phải nhắn owner để đưa một ý vào kit, **hoặc** ≥2 hồ sơ cơ hội ghi «ký trong
  hội thoại, máy ghi hộ» giữa hai mốc phát hành (lần 1: `vong-la-mot-ket-qua`,
  04/09).
- **Lát B** — không cần ngưỡng: ghi thử bằng tay ở mốc 2.9.0 (n = 1) rồi mới
  quyết có vào luật (c) hay không.
- **Lát C** — chỉ mở sau khi có ≥1 phiên nghiệm thu thật ở repo tiêu thụ (vật
  để đối chứng dương).

## 6. Ngưỡng (chép sang ô cơ hội khi mở)

- **SỐNG:** một ý từ người không phải owner thành ô nháp trong kho **không cần
  phiên máy**; owner ký Cổng Đáng **một chạm, một PR**; ba số lát B in được từ
  git/sổ, không dòng đếm tay; ở ván tiêu thụ, băng vượt → ô nháp xuất hiện trong
  `/start` **không ai gõ**; 0 lượt gọi người thêm so với hôm nay.
- **CHẾT:** thêm lệnh cổng người; máy ký thay người ở bất kỳ cổng nào; băng do
  model phát hiện thay vì script tất định; vòng sửa thứ hai sinh lỗi cùng lớp
  với `cong-dang-co-cua` (dừng-vá).
