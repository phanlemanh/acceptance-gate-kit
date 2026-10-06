# Đội phiên có điều phối — mô hình hoá ngày 04/10 ở crm

**Ngày:** 2026-10-05. **Câu hỏi của owner:** sau lộ trình CRM OneHub, owner mở sáu
phiên làm việc và một phiên điều phối. Lần đầu các phiên phối hợp nhịp nhàng và cho
hiệu quả cao. Cần nhận diện phương pháp đó, mô hình hoá nó, và tìm đường để nó thành
một cách làm việc của kit.

**Nguồn:**
- Bản ghi của chín phiên: phiên dựng lộ trình `c4b73747`, phiên điều phối `baa5d196`,
  P1–P6, cùng ba phiên phụ (gate-card, tat-preview, P7).
- `crm/.acceptance-runs/dieu-phoi-1410/LUAT.md`: phần luật và 165 dòng Nhật ký.
- `gh pr list` của `phanlemanh/crm-onehub`.
- Bộ nhớ crm về hai lần điều phối trước (24/09, 26/09).

Mọi giờ trong tệp này là **giờ Việt Nam** (UTC+7), trùng giờ Nhật ký. Bản ghi được rút
gọn bằng một script trong scratchpad của phiên; script không vào kho.

---

## 0. Đọc trong một phút

**Chuyện gì đã xảy ra:**
- **12:20 ngày 04/10:** bảy chip mở.
- **Sau 19 giờ, tới 07:20 ngày 05/10:**
  - **9 hàng lộ trình đã gộp:** R1a, R1b, R1c, R1d, R1h, #231, l4a, l4b, K1. Lộ trình ước
    các hàng này xong trong khoảng 07/10–13/10, nên làn đi trước kế hoạch 3–8 ngày.
  - **3 việc phát sinh đã gộp:** #248, Ngoài-3 của R1c, tat-preview.
  - **2 hàng đã ký, chờ CI:** R1f, `thu-lai`.
  - **Chủ kho không bấm merge nào trong 12 PR của làn.** Phiên điều phối gộp tất cả, mỗi
    lần bằng `--match-head-commit`, và không lần nào dùng `--auto`.
  - **Không có xung đột mã giữa các phiên.** Mọi lần va chạm chỉ là hai bên cùng thêm dòng
    vào `config.yaml` hoặc `PRODUCT-MAP.md`.

**Vì sao nó chạy được:** máy đã đọc «ý định» ở tầng lộ trình, chứ không đợi tới từng vòng.
- Phiên dựng lộ trình làm hai việc trước khi mở chip:
  - Chạy khảo sát (7 tác tử chỉ đọc).
  - Hỏi owner **một lượt** để chốt **thứ tự ưu tiên**, **làn veto**, **quyền tự merge**
    và **ranh giới tệp của từng phiên**.
- Sau đó máy tự áp các quyết định ấy suốt 19 giờ:
  - xếp 26 lượt khoá S4;
  - duyệt 6 lần nới ranh giới;
  - ban hành 14 luật mới.

  Không lần nào cần gọi owner. Đây là lần đầu khối ĐỊNH VỊ («trọng số và chính sách chốt
  MỘT lần, rồi máy áp cho mọi cạnh gãy») chạy ở thật, và nó chạy ở tầng **trên** vòng.

**Ba cái giá chưa trả hết:**
1. **Khoá S4 là cổ chai toàn máy.** Cộng thời gian chờ của sáu phiên ra khoảng **31
   phiên-giờ**, trong một cửa sổ 19 giờ.
2. **Mỗi lần merge làm phần lớn PR đang chờ bị hoá cũ.** Gần như PR nào cũng phải ghim
   lại thêm một lượt.
3. **Owner làm thay nhịp tim.** Trong 33 tin owner gửi phiên điều phối, 20 tin là «Kiểm
   tra các phiên và điều phối». Lý do: `/loop` không bắn từ 17:51 tới 00:40.

**Đề nghị:**
- **Giữ:** mô hình này là cách làm mặc định khi một kho tiêu thụ có ≥3 hàng việc độc lập
  cùng mốc.
- **Chưa dựng máy móc trong kit.** Năm đề xuất H1–H5 ở §8 chỉ là sổ.
  Đợt crm kế tiếp chạy lại mô hình, kèm năm dòng số; đó là phép thử.

---

## 1. Diễn biến

| Giờ | Việc | Ai |
|---|---|---|
| 03/10 17:39 → 04/10 09:28 | Vòng `soan-okr-song-lai`, gộp #240. Lúc 09:31 owner hỏi «tổng kết và cập nhật lộ trình» | phiên dựng |
| 10:12 | Owner: «gom lại thành các lộ trình cụ thể để dễ hành động» → máy đề xuất 6 làn kèm 4 câu hỏi | phiên dựng |
| 10:18 | Owner duyệt chạy workflow khảo sát: 6 tác tử đọc + 1 tác tử gộp, chỉ đọc, khoảng 20 phút | phiên dựng |
| 10:44 | Kết quả khảo sát đổi kế hoạch ở 5 chỗ (R1 không có lỗi chặn; rủi ro thật nằm ở tuần nhập người; …) | máy |
| 11:02 | Owner chốt 6 quyết định trong **một** tin: ưu tiên 14/10, tính năng trước chữ, làn veto, Kara chạy song song | **owner** |
| 11:37 | Owner sửa máy: «rất nhiều hạng mục đã lỗi thời», vì việc tay trên production không để lại dấu trong kho | **owner** |
| 11:48 | Owner: «CI xanh thì merge rồi mở sáu chip, và một phiên điều phối…» | **owner** |
| 11:50 | Máy viết `LUAT.md`, dùng lại luật điều phối Zalo 24/09 | phiên dựng |
| 11:53 | Owner: «Cho phép điều phối tự merge khi CI xanh» | **owner** |
| 12:19–12:21 | #245 (lộ trình mới) gộp; 7 chip mở, mỗi lời dặn đều trỏ về cùng tệp luật | phiên dựng |
| 12:38 04/10 → 08:59 05/10 | Sáu phiên làm việc và phiên điều phối chạy (§3) | máy, owner ở biên |

Từ lúc owner nói «gom lại» tới lúc bảy phiên chạy mất **2 giờ 9 phút**. Owner nhắn 7 tin
quyết định trong khoảng đó.

---

## 2. Mô hình

Hình chiếu: [`assets/2026-10-05-doi-phien-co-dieu-phoi.html`](assets/2026-10-05-doi-phien-co-dieu-phoi.html).
Hình chỉ chiếu lại mục này; nguồn sự thật là chữ ở đây.

### 2.1 Bốn vai

| Vai | Làm gì | Không làm gì | Trong ca 04/10 |
|---|---|---|---|
| **Phiên dựng lộ trình** (một lần, trước khi mở) | Khảo sát chỉ đọc. Chia hàng việc thành **dãy** theo ranh giới tệp. Hỏi owner **một lượt** để chốt ưu tiên, làn veto, quyền merge. Viết luật. Mở chip. | Không chạy vòng nào của dãy | `c4b73747`; 7 tác tử khảo sát; 6 quyết định gộp trong 1 tin |
| **Phiên thợ** (P1…Pn) | Chạy tuần tự các vòng `/feature-loop` của dãy mình, trên worktree riêng, cặp cổng riêng, tiền tố khoá `config.yaml` riêng. Ghi sổ trạng thái mỗi khi đổi bước. Xin khoá. Trình thẻ cổng cho owner. | Sửa ngoài ranh giới tệp khi chưa ghi xin phép. Tự lấy khoá đang có người giữ. Merge. | 6 phiên, mỗi phiên 1–5 hàng |
| **Phiên điều phối** | Mỗi nhịp đọc sổ, khoá, PR, `git diff` giữa các nhánh mở. Phát khoá. Giữ hàng merge. Phân xử ranh giới. Ban hành luật mới vào Nhật ký. Gỡ sự cố hạ tầng chung. Mở chip cho việc chặn. Đánh thức phiên bị lưu trữ. | **Không sửa mã sản phẩm. Không ký cổng.** Không merge PR chưa ký mà cũng không ở làn veto. | 12 merge, 26 lần phát khoá S4, 14 luật mới, 6 lần nới ranh giới, 6 lần đánh thức phiên |
| **Owner** | Ký cổng **trong phiên thợ**, trên thẻ. Trả lời việc chỉ người làm được (nạp tiền, `sudo`, đánh đổi giá trị). | Merge. Xếp hàng. Phân xử tranh chấp tệp. | 56 lượt ở phiên thợ; 33 tin ở điều phối (20 là hỏi trạng thái, xem §4.4) |

### 2.2 Năm vật dùng chung (ngoài git, cùng một thư mục)

| Vật | Hình dạng | Ai ghi | Vai trò |
|---|---|---|---|
| `LUAT.md`, phần trên | Bảng phiên (hàng việc · tiền tố · cổng dev), ranh giới tệp, luật «tệp chạm chung chỉ thêm», bảng khoá, thứ tự gộp, quy trình merge | Chỉ điều phối | Hợp đồng của đội phiên |
| `LUAT.md` → **Nhật ký** | Chỉ nối thêm, mỗi dòng có giờ: quyết định, giữ hộ khoá, merge, luật mới | Chỉ điều phối | Kênh chắc chắn. Tin nhắn có thể bị giữ, Nhật ký thì không |
| `khoa/<tên>/` | Thư mục khoá (`mkdir` nguyên tử) + tệp `chu` ghi phiên, hồ sơ, giờ | Phiên giữ khoá, hoặc điều phối giữ hộ | Biến «đừng chạy hai S4 cùng lúc» thành vật máy giữ |
| `trang-thai/Pn.md` | Một dòng mỗi lần đổi bước, mới nhất ở trên: `giờ · slug · bước · ghi chú` | Phiên thợ | Điều phối đọc trạng thái mà không phải hỏi |
| Tệp lộ trình trong kho (`docs/plan/*.json` trên nhánh chính) | Hàng việc + mã + hạn | Phiên dựng (qua PR) | Mỗi chip mở bằng `/feature-loop <tệp>:<mã>`, nên lời dặn không phải chép lại nội dung hàng |

### 2.3 Ba vòng lồng nhau

1. **Vòng thợ.** Một phiên thợ chạy liên tiếp nhiều vòng feature-loop:
   - Mỗi vòng đi S0 → … → S4 → Cổng 2.
   - Xong một vòng thì lấy khoá `merge`, gộp nhánh chính vào nhánh mình, vẽ lại bản đồ.
   - Nếu hồ sơ hoá cũ thì ghim lại, việc này cần khoá `s4`.
   - Đẩy lên, rồi báo «chờ merge».
   - Trong lúc chờ khoá, phiên mở S0–S3 của hàng kế (ví dụ P4 làm l4b trong lúc l4a chờ
     merge).
2. **Vòng điều phối.** Mỗi nhịp:
   - Đọc sổ, khoá, PR và `diff --name-only` giữa các nhánh.
   - Phát hiện tranh chấp: tệp chung, migration trùng mốc, khoá quá 90 phút, cổng dev
     cấm, phiên ngoài luật.
   - Quyết thứ tự, ghi Nhật ký, báo phiên liên quan.
   - Merge khi CI xanh trên đỉnh mới.
3. **Vòng luật.** Một sự cố hay một chỗ kẹt sinh ra **một dòng luật** trong Nhật ký,
   và luật có hiệu lực ngay ở nhịp kế. Trong 19 giờ có 14 luật như vậy (bảng ở §3.3).
   Không luật nào cần owner.

### 2.4 Bốn bất biến giữ cho mô hình đúng

1. **Tranh chấp được loại bằng thiết kế, không giải sau.**
   - Ranh giới tệp chia ngay từ khi dựng.
   - Tệp chung chỉ được **thêm**.
   - Chỉ hai phiên được thêm migration, và tên lấy giờ UTC thật.

   Kết quả: không có xung đột mã nào giữa các phiên.
2. **Mọi tài nguyên khan hiếm đều có tên và có khoá:**
   - lượt chấm S4;
   - hàng merge;
   - đường nền (cần cây yên);
   - cặp cổng dev;
   - CSDL dev.

   Mỗi tài nguyên trong số đó đã từng gây sự cố riêng trước 04/10 (§5).
3. **Merge chỉ qua một cửa, và quyền merge giao cho máy có ràng buộc.** Điều phối chỉ
   merge khi:
   - Cổng 2 đã ký, hoặc hồ sơ máy-thông đúng làn veto;
   - CI xanh trên đỉnh mới;
   - lệnh dùng `--match-head-commit`, không bao giờ `--auto`.
4. **Trạng thái đi bằng tệp, tin nhắn chỉ để đánh thức.** Bài học 24/09: ba tin liên phiên
   đều bị giữ chờ duyệt, phiên B đứng im 4 giờ. Lần này mọi quyết định đều có một dòng
   Nhật ký.

---

## 3. Số đo

### 3.1 Phiên thợ

| Phiên | Hàng đã gộp | Lượt S4 (+ ghim lại) | Lượt gọi owner (a·b·c) | Chờ khoá S4 | Nén ngữ cảnh |
|---|---|---|---|---|---|
| P1 | R1a, R1d | 5 (+3) | 10 (6·3·1) | ≈ 4,9 h | 2 |
| P2 | R1c, Ngoài-3 | 3 (+2) | 6 (4·1·1) | ≈ 2,4 h | 1 |
| P3 | R1b (T3); R1f đã ký | 5 (+2) | 10 (6·4·0) | ≈ 4,7 h | 1 |
| P4 | #231, l4a, l4b; R1e đang chạy | 4 (+2) | 13 (9·4·0) | ≈ 8,3 h | 1 |
| P5 | R1h; `thu-lai` đã ký | 5 (+1) | 13 (10·3·0) | ≈ 4,2 h | 1 |
| P6 | K1 | 2 (+1) | 4 (2·1·1) | ≈ 7,0 h | 0 |
| **Cộng** | **10 gộp + 2 đã ký** | 24 (+11) | **56** | **≈ 31 phiên-giờ** | 6 |

Cách phân loại lượt gọi: a = ký hoặc duyệt cổng; b = trả lời câu máy hỏi; c = owner tự
chỉ hướng. Không tính tin giao việc lúc mở chip.

### 3.2 Phiên điều phối

| Thước | Số |
|---|---|
| Thời gian chạy | 12:38 04/10 → 08:59 05/10, khoảng 20 giờ |
| Merge do điều phối / do owner | 12 / 2 (#255, #249; cả hai ngoài hàng, và #249 làm nhánh chính đỏ) |
| Phát khoá S4 (giữ hộ rồi trao) | 26 |
| Tin gửi (SendMessage / `send_message`) | 78 / 60 |
| Tin nhận | 56 |
| Lệnh canh nền (`until`/`while` canh khoá và CI) | 47, sinh 38 thông báo |
| `/loop` bắn thật | 15. Không bắn từ 17:51 tới 00:40 |
| Đánh thức phiên bị app tự lưu trữ | 6 |

### 3.3 Luật sinh ra trong ngày (vòng luật)

| Giờ | Luật | Do đâu |
|---|---|---|
| 13:20 | Migration không được trỏ tới bảng tạo ở migration xếp sau nó | Đổi tên migration của #231 |
| 13:40 | Làn R1 được ưu tiên khoá S4 | S4 thành cổ chai |
| 14:25 | Lượt ghim lại ngắn mà mở được một merge thì được chen hàng | #248 đang giữ `merge` |
| 14:35 → 14:42 | Giảm tải: tối đa 3 phiên, sau nới lên 5 | App sập hai lần, swap cạn |
| 14:45 | Cấm `pkill -P`, `pkill -f`, `killall` lên bun, node, next | P2 giết nhầm suite S4 của P1 |
| 15:14 | Hai phiên cùng thêm khoá vào một tệp: phiên nào sẵn trước thì gộp trước | `okr-soan.ts` |
| **17:53** | **Điều phối phát khoá S4; phiên thợ không tự `mkdir` nữa** | Các vòng tự nhường nhau kẹt chéo 18 phút |
| 20:15 | Không mở đường nền mới khi S4 đang đo màn | Load 21 làm thước lăn đỏ giả |
| 06:55 | `bun install` sau mỗi lần gộp nhánh chính | #259 thêm `minimatch` |
| 09:20 | Kiểm run «Acceptance» của nhánh chính sau mỗi lần merge một PR ghim lại | #249 làm nhánh chính đỏ |

Luật 17:53 là bước ngoặt. Trước đó mỗi phiên tự giành khoá và tự nhường theo thứ tự đọc
được, nên bốn phiên cùng nhường nhau và khoá bỏ trống 18 phút. Sau khi chuyển sang **một
bộ lập lịch trung tâm** (điều phối `mkdir` giữ hộ rồi gọi phiên kế), không còn lần kẹt
nào. Nói cách khác, đội phiên chỉ chạy trơn khi có **một người ghi** cho tài nguyên khan
hiếm nhất.

---

## 4. Cái giá và chỗ gãy

### 4.1 S4 một chỗ là cổ chai

- **Quy mô chờ:** khoảng 31 phiên-giờ chờ khoá trong 19 giờ.
  - P6 làm xong S3 lúc 15:02 nhưng 21:40 mới được chấm.
  - l4a của P4 chờ 3 giờ 23.
- **Vì sao không mở thêm chỗ:** cổ chai này là thật, không phải do luật đặt sai. Chạy
  song song từng làm đỏ giả, theo ba lần đo:
  - mutant ghi thẳng vào cây (17/09, 20/09);
  - tranh CPU, CSDL, cổng (20/09, 26/09);
  - tải 30+ tác tử làm `nguoi-huy` hết giờ (04/10).
- **Hệ quả:** số phiên thợ có ích bị chặn trên bởi **tốc độ của làn S4**, không phải bởi số
  việc. Với tốc độ chấm hiện nay, sáu phiên đã vượt mức đó; ba hay bốn phiên đủ giữ S4
  luôn bận.

### 4.2 Thuế ghim lại sau mỗi merge

- **Tần suất:** 10 trên 12 PR phải ghim lại vì PR trước vừa gộp. Hàng merge vì thế đi
  tuần tự, và mỗi lượt ghim lại lại xin thêm một chỗ S4.
- **Nguyên nhân:** hồ sơ đã ký đo trên mã mà PR khác vừa chạm.
- **Lối đã có trong kit:** bộ lọc `paths` theo hồ sơ (2.21, crm khai lô 1 và lô 2 ở #241,
  #255). Lối này **giảm** được thuế nhưng không xoá. Chưa đo được phần còn lại sau lô 2.

### 4.3 Máy chung

- **Sự cố:** máy treo hai lần (14:10, 14:29). Swap 22,3/23,5 GB, `fseventsd` phình 19 GB.
- **Owner phải tự gỡ:** chạy `sudo killall fseventsd` và `sudo kill -9`.
- **Hệ quả:** mọi phiên dừng, phải mở lại theo đợt.
- **Bài học:** số phiên chạy song song phải là một **ngưỡng đo được** (RAM, swap, load),
  không phải một con số chọn trước.

### 4.4 Owner làm nhịp tim

- **Hiện tượng:** 16 tin «Kiểm tra các phiên và điều phối.» giống hệt nhau, cộng 4 tin hỏi
  trạng thái, tức 20 trên 33 tin owner gửi điều phối.
- **Vì sao:** từ 17:51 tới 00:40, `ScheduleWakeup` không bắn. Phiên vẫn chạy nhờ 47 lệnh
  canh nền, nhưng owner không biết điều đó nên tự gõ để kiểm.
- **Hệ quả:** đây là lượt gọi người ngoài thiết kế, và nó sinh ra vì owner không thấy
  trạng thái. Trang lộ trình là ảnh chụp, không tự làm mới.

### 4.5 Lượt gọi owner mỗi hàng vượt trần

- **Số đo:** 56 lượt ở phiên thợ cho 12 hàng đã ký, tức khoảng **4,7 lượt mỗi hàng**,
  trong khi trần T2 là 3. Các lượt ngoài thiết kế đến từ:
  - **Cổng Đáng xử lý không đều:**
    - P1 với R1a, P2 và P6 tự ghi `build` theo quyết định đã chốt ở lộ trình.
    - P1 với R1d, P3, P4 và P5 thì hỏi lại.
    - Quyết định đã chốt ở tầng lộ trình mà vẫn hỏi lại thì tốn một lượt vô ích mỗi
      hàng (đề xuất H3).
  - **Mở lại phạm vi sau S2 hoặc S4:** R1d (Ngoài-6 là hồi quy do chính vòng gây), R1e
    (AC-9 mâu thuẫn hành vi đã ký), `thu-lai` (AC-6 đụng AC-1).
  - **Dừng-vá ở trần 3 round:** R1a, vì test cũ của hồ sơ đã ký đo nút soạn cũ.
  - **AskUserQuestion trước khi trình thẻ:** P2, P3, P4, P6.
  - **«Đồng ý» trong chat không ký được** (ADR 0002), owner phải gõ lại lệnh: P1, P5.
    Chỗ này cố ý như vậy; **không** đề nghị sửa.

### 4.6 Việc dồn khi owner vắng

- **Hiện tượng:** owner vắng từ 21:00 tới 03:40. Ba quyết định chờ 5–7 giờ: Cổng 2 của
  K1, câu hỏi của P5, Cổng 1 của gate-card.
- **Vì sao không phải lỗi:** máy vẫn chạy các phiên khác. Lúc 03:40 owner quay lại và gỡ
  khoảng 15 quyết định ở năm phiên trong 55 phút.
- **Hình dạng tự nhiên:** **owner gỡ cả loạt quyết định một lần**. Mô hình nên thiết kế
  cho việc này: một hàng quyết định chung, thay cho thẻ rải ở sáu phiên.

### 4.7 Hạ tầng của app và phiên ngoài luật

- **App tự lưu trữ phiên khi PR đóng:** xảy ra 6 lần. Theo sau là worktree rơi vào
  detached HEAD, và `cwd` của P1, P2 đổi về checkout chính của owner. Điều phối đề nghị
  tắt cài đặt này nhiều lần, chưa có trả lời.
- **Phiên mở trước điều phối (tat-preview) không ghi danh:**
  - chạy S4 mà không giữ khoá, chồng lên lượt ghim lại của P4;
  - sau đó giữ nhầm khoá 39 giây.

  Phiên chỉ theo luật sau khi owner bảo điều phối «điều phối luôn phiên này».

### 4.8 Mười một phiên dùng kit cùng lúc làm lộ lỗi kit

| Lỗi | Ai thấy | Ghi chú |
|---|---|---|
| `gate-card` cắt AC nhiều dòng ở dòng đầu | P1 | Phiên phụ đo được 27 % AC của 574 hợp đồng ở 11 kho bị đọc cụt |
| `gate-card` giấu mục Ngoài khi hậu tố «(r1)» nằm sau `**` | P6 | |
| `gate-card` ghép sai Ngoài-4, làm rơi mục của round 2 | P5 | |
| `s4-args` lấy `diffBase` cũ (`ae931fd1`), kéo 150–278 tệp vào vùng diff | P1, P2, P3 | |
| R1e báo PASS trong khi còn 5 `rejectFindings` | P4 | |
| Tác tử chết không để dòng kết quả mà lượt vẫn bị đếm vào trần 3 | gate-card | Đã ghi hạt giống |

Đây là mặt lợi ít ai tính tới: **đội phiên là dogfood ở quy mô**. Ba lỗi khác nhau của
cùng một bộ thẻ lộ ra trong một ngày.

---

## 5. Ba thế hệ: mô hình đã tiến hoá, không tự nhiên có

| | 24/09 · Zalo | 26/09 · Hàng merge | **04/10 · Lên trước 14/10** |
|---|---|---|---|
| Số phiên | 2 + điều phối | nhiều phiên đã chạy sẵn + điều phối | **6 + điều phối (+ 3 phụ)** |
| Luật | Ranh giới trong `zalo.service.ts`; S4 cấp theo lượt **qua tin nhắn** | Hàng merge; S4 một cái cho cả máy; không tự merge | Ranh giới tệp; **khoá bằng thư mục**; sổ trạng thái; Nhật ký; tự merge có ràng buộc |
| Kênh | SendMessage (bị giữ 3/3 tin) | `send_message`; đọc bản ghi `jsonl` | **Tệp là kênh chính**; tin chỉ để đánh thức |
| Kết cục | Phiên B đứng im 4 giờ chờ lượt S4 | 7 PR vào nhánh chính không đỏ; owner vẫn bấm merge | 12 merge không qua tay owner; 9 hàng lộ trình gộp trong 19 giờ |
| Bài học mang sang | «Tin liên phiên bị giữ → đọc trạng thái bằng vật» | «Check xanh nhưng cũ khi base dời → gộp lại rồi mới merge»; CSDL dev là tài nguyên chung | (mục 4) |

Lần 04/10 chạy được vì `LUAT.md` mang sẵn **mọi** bài học của hai lần trước, cùng các
bộ nhớ:
- `cong-3300-la-tai-nguyen-chung`;
- `lan-song-song-s4-dung-do-dot-bien`;
- `check-xanh-cu-khi-base-doi`;
- `tin-giua-phien-bi-giu-cho-duyet`;
- `hai-luong-cung-checkout`.

Nói cách khác, mô hình là **sổ bài học đã biến thành luật**. Nó không phải một ý tưởng
mới, và đó chính là lý do nó tin được.

---

## 6. Truy về ba nguyên tố

| Bộ phận | Nguyên tố | Người hưởng |
|---|---|---|
| Phiên dựng hỏi owner một lượt ưu tiên, làn veto, quyền merge, rồi máy áp suốt làn | 1 · Ý định chốt trước (khối ĐỊNH VỊ: «trọng số + chính sách chốt MỘT lần») | Owner: 6 quyết định thay cho khoảng 26 lần xếp khoá và 12 lần merge |
| Khoá thư mục, sổ trạng thái, Nhật ký | 2 · Bằng chứng không tự dối (khoá S4 chặn đỏ giả do chạy chồng) | Máy: phép đo không bị phiên khác phá |
| Ranh giới tệp phân trước; merge một cửa có `--match-head-commit` | 3 · Đảo rẻ (mỗi merge khớp đúng sha đã chạy CI) | Owner: ra khỏi merge mà không mất quyền chặn |
| Owner ký trên thẻ trong phiên thợ | 3 · Khoảnh khắc quyết thật | Owner: khi có mặt, quyết trong 1–18 phút |

Không bộ phận nào của mô hình đứng ngoài ba nguyên tố.

---

## 7. Đưa vào kit: chia theo tầng

Theo luật «sửa kit vì sự cố của một kho phải cân trên mọi kho»: sửa đúng tầng trước, rồi
mới tới bộ đọc khoan dung, bật theo lựa chọn, và cuối cùng là đổi mặc định.

| Tầng | Gì | Trạng thái đề nghị |
|---|---|---|
| **Kho tiêu thụ tự lo** | Ranh giới tệp cụ thể, cổng dev, tiền tố khoá, CSDL dev, máy chủ dev; tài khoản Vercel và Gateway | Giữ ở `.acceptance-runs/<đợt>/LUAT.md` của kho. Kit không chứa (luật «kit là engine») |
| **Nếp làm việc, chưa máy hoá** | Bốn vai, năm vật, ba vòng (§2) dưới dạng một khuôn `LUAT.md` trống và một mục trong GUIDE | H1 (§8). Mở khi đợt crm kế chạy lại mô hình và đếm năm dòng số |
| **Răng engine (CỘNG, cần owner phê)** | Khoá S4 liên phiên trong `s4-args`; sổ trạng thái do feature-loop tự ghi; Cổng Đáng tự ghi khi hàng đã chốt ở lộ trình; hàng quyết định chung | H2–H5 (§8) |
| **Không đổi** | Ký phải gõ lệnh (ADR 0002); S4 tuần tự | Ghi rõ để không ai «sửa» |

**Vì sao chưa mở vòng ngay:**
- **Neo ngoài:** mô hình mới có **một** lần chạy ở dạng đầy đủ. Răng dựng từ một ca dễ
  hoá thành thước đo-thước, đúng lớp mà luật chiều rộng (a) cấm.
- **Luật chiều rộng (b):** kit vừa có một vòng gộp sau mốc 2.22.0 (`nhan-lan-v-theo-huong`,
  #265). Một vòng meta nữa chỉ mở khi owner gọi tên, và nên buộc vào mốc mà crm sẽ cài.
- **Phép thử rẻ hơn:**
  - Đợt crm kế (sau 14/10: K2–K4, làn Deal) chạy lại mô hình bằng khuôn `LUAT.md` này,
    kèm năm dòng số.
  - Nếu chờ khoá S4 và lượt gọi owner mỗi hàng giảm so với §3, đó là neo để mở ô.
  - Nếu không giảm, mô hình chỉ là may mắn của một ngày.

---

## 8. Sổ đề xuất H1–H5 (chưa là hạt giống, chưa là ô)

**Vì sao chưa thành tệp hạt giống.**
- Răng VC8 đang chạy trên `main` đòi mỗi `docs/plans/*-hat-giong-*.md` phải có một ô trong
  kit trích lại tên tệp.
- Neo của các ý này nằm ở kho crm, và chưa ô kit nào trích chúng.
- Muốn có ô thì phải sửa một hồ sơ đã ký; cách đó vi phạm bất biến «không chạm hồ sơ đã ký».

Vì vậy năm ý sống tại đây. Khi một ô có `Gốc:` thật (ví dụ hồ sơ đợt crm kế tiếp), ý
tương ứng chuyển sang hạt giống.

Thứ tự dưới đây là thứ tự đề nghị. H1 là **TRỪ** chi phí chép, không thêm cổng. H2–H5 là
**CỘNG**, cần owner phê từng ca.

| # | Ý | Gánh nặng nó gỡ (§) | Hình dạng nghiệm đúng tầng | Ngưỡng mở |
|---|---|---|---|---|
| **H1** | **Khuôn đội phiên.** Một khuôn `LUAT.md` trống (bảng phiên · ranh giới · tệp chạm chung chỉ thêm · bảng khoá · thứ tự gộp · quy trình merge · sổ trạng thái · Nhật ký), cộng một mục GUIDE «khi nào chia đội phiên». Không có script. | Lần 04/10, `LUAT.md` được viết lại từ trí nhớ của lần 24/09 | Tài liệu cộng khuôn; kho tiêu thụ chép rồi điền | Đợt crm kế dùng khuôn mà không phải viết lại luật khoá và merge |
| **H2** | **Khoá S4 liên phiên là vật của engine.** `s4-args` lấy khoá toàn máy (`mkdir`, có chủ, có giờ) và thoát với thông điệp có tên khi khoá đang bị giữ. Kèm một chế độ «người phát khoá» cho phiên điều phối. | 4.1 · 4.7: phiên ngoài luật chạy S4 chồng, vì luật chỉ là lời | Biến «đừng chạy hai S4» từ đầu người thành vật máy giữ; cách này đúng dạng nghiệm của hiến pháp | ≥1 lần đỏ giả nữa do hai S4 chạy chồng, ở bất kỳ kho nào |
| **H3** | **Cổng Đáng tự ghi khi hàng lộ trình đã chốt.** Feature-loop mở bằng `<tệp lộ trình>:<mã>` mà hàng đó đã có quyết định `build` do owner chốt ở tầng lộ trình thì ghi `build` kèm con trỏ tới quyết định, không hỏi lại. | 4.5: bốn phiên hỏi lại một điều owner đã quyết | Áp «trọng số chốt MỘT lần» (khối ĐỊNH VỊ) xuống từng vòng | Đếm lượt Cổng Đáng hỏi lại ở đợt crm kế: ≥2 thì mở |
| **H4** | **Sổ trạng thái do feature-loop tự ghi.** Mỗi lần đổi chặng, máy nối một dòng `giờ · slug · chặng · ghi chú` vào một tệp kho khai (mặc định tắt). | 4.4: owner gõ «kiểm tra» 20 lần; phiên quên ghi sổ (điều phối nhắc P3, P6) | Bên viết và bên đọc rút từ một nguồn (marker), không dặn bằng lời | Đợt crm kế: owner hỏi trạng thái ≥5 lần mỗi ngày |
| **H5** | **Hàng quyết định chung cho owner.** Một trang (hoặc khối trên trang lộ trình) gom mọi thẻ đang chờ người của các phiên, sắp theo mốc. Owner gỡ cả loạt một lần. | 4.6: khoảng 15 quyết định gỡ trong 55 phút sau khi owner vắng 7 giờ, rải ở năm phiên | Kit render, không soạn: đọc `card.html` và trạng thái hồ sơ sẵn có | Owner tự xác nhận đã phải mở ≥3 phiên để tìm thẻ chờ |

**Không đề xuất:**
- **Nới S4 thành song song.** Đã ba lần đo ra đỏ giả.
- **Cho ký bằng chữ trong chat** (ADR 0002).
- **Tự động mở phiên thợ.** Mở chip là một khoảnh khắc owner nhìn thấy phạm vi của đội. Giữ nó thì tốn một lần bấm, bỏ nó thì mất quyền chặn.

**Không thuộc kit, nhưng owner gỡ được ngay:** tắt «tự lưu trữ phiên khi PR đóng» trong
app (§4.7). Đây là cài đặt của owner, không phải việc của kit.
