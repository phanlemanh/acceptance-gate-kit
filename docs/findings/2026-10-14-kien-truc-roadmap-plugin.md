# Kiến trúc Roadmap — lộ trình hôm nay và plugin `roadmap` dự kiến: khung, so sánh, phương án — 14/10/2026

> Tài liệu đầu vào cho vòng plugin `roadmap` (ADR 0025 gọi tên trước cho cửa sổ kế; tên `roadmap` do chủ kho
> chọn 14/10 để đồng nhất tên plugin). Viết theo yêu cầu chủ kho 14/10: so hai kiến trúc, phân tích khác biệt,
> ưu điểm, giá phải trả; nhiều kho và nhiều giai đoạn; tác động lên mã; đề xuất phương án theo North Star.
>
> Nguồn số đo (đọc 14/10, kit `origin/main` @915c7fca, crm `origin/onehub` vừa fetch): lịch sử git của bốn tệp
> lộ trình · bản đồ mã lộ trình của kit · khảo sát 32 kho trên máy MacBook Pro. Lệnh đo nằm ở §9.

---

## 0. Một phút

**Khuyến nghị: phương án B-liên-bang** — plugin «mặt» `roadmap` giữ **VÒNG NGOÀI** (kết quả nào · chiến dịch
nào · còn đáng không), mã vẫn ở lõi, mỗi kho sở hữu lộ trình của mình, liên kho bằng con trỏ máy đọc, bản đồ gộp
là hình chiếu dẫn xuất. Làm theo **ba lát**, mỗi lát một vòng meta gắn vào một mốc được kho tiêu thụ nhận.
**Lát 1 = cửa ra trước cửa vào:** lệnh ghi chuẩn + phiếu rà soát ở ranh giới mốc + trần «Kế tiếp» + khởi tạo
kho. Tự nối hàng (nấc 3) để lát 2, vì tự nối mà chưa có rà soát là tăng tốc đúng bệnh đang có.

Ba con số làm nền:

1. **Lộ trình chỉ cộng, không ai gỡ.** OKR của crm: 125 hàng từng có, **1** hàng từng rời; **76/124** hàng không
   thuộc mốc nào.
2. **Lộ trình đang bị dùng làm bảng việc, không phải bảng kết quả.** Cùng tệp đó: `buoc_ke` có ở **105/124** hàng,
   `trang_thai` tự khai **74**, `pr` **76** — trong khi `bat_khi` (tín hiệu thành công) chỉ **35**, `vi_sao` **15**.
3. **Định nghĩa «xong» sống ở bốn chỗ.** Lõi kit · bản chép vào kho tiêu thụ (`lo-trinh.mjs` của crm giống từng
   byte, `cat-luot.mjs` đã lệch) · bản chép trong `dieu-phoi` · bản chép trong ứng dụng crm. Trên máy có **15**
   phiên bản kit cùng tồn tại.

---

## 1. Khung — đọc lại ý định của chủ kho

Chủ kho không xin «một tính năng lộ trình». Ý định đọc được qua bốn lượt hỏi 14/10:

- **Đích đến cho điều phối – thợ.** Thợ máy rẻ và song song; thứ thiếu là một đích đứng yên để điều phối tự
  quyết «mở hàng nào kế» mà không gọi người.
- **Người ở biên của vòng ngoài.** Người quyết ở khoảnh khắc rà soát, không sửa tay lộ trình mỗi ngày.
- **Không mất bản đồ.** Đổi máy, đổi tài khoản, mất phiên — «xong · đang dở · kế» vẫn đọc được.
- **Nhiều kho, nhiều giai đoạn.** Một chiến dịch có thể cần kit phát hành trước rồi crm mới giao được.

Đặt vào bốn plugin, mỗi cái một vai — đây là lý do đặt tên đồng nhất có nghĩa, không chỉ đẹp:

| Plugin | Vai | Câu nó trả lời |
|---|---|---|
| `acceptance-gate` | **Thước** | Kết quả này có thật như đã hứa không? |
| `feature-loop` | **Vòng trong** | Một hàng → một kết quả ship, với ba cổng người |
| `dieu-phoi` | **Song song** | Bao nhiêu vòng chạy cùng lúc, ai giữ khoá nào |
| `roadmap` | **Vòng ngoài** | Kết quả nào, thuộc chiến dịch nào, vì sao bây giờ, ship rồi có đáng không |

**Câu hỏi thiết kế:** vòng ngoài có cần nhà riêng không; nếu có thì nhà đó giữ gì, để gì ở lõi, và trả giá gì
trên ba thước của kit — lượt gọi người mỗi kết quả ship · thời gian làm-xong→quyết-được · chi phí máy.

**Trace hiến pháp.** Nguyên tố 1 (ý định chốt trước — mốc và `bat_khi` chốt trước khi làm) và nguyên tố 3
(khoảnh khắc quyết thật — rà soát ở ranh giới mốc thay cho sửa rải rác). Người hưởng: chủ kho crm (bản đồ, rà
soát một chạm) và phiên điều phối (đích đứng yên).

---

## 2. Kiến trúc lộ trình hôm nay

```
  NGƯỜI / phiên chạy skill cat-luot ──viết──▶ tệp JSON lộ trình (trong kho, đổi bằng PR)
                                                     │ đọc
            ┌────────────────────────────────────────┼─────────────────────────────┐
            ▼                                        ▼                             ▼
   lõi kit: lo-trinh.mjs (858 dòng)        dieu-phoi/nguon-hang.mjs        kho tiêu thụ: BẢN CHÉP
   suy trạng thái từ hồ sơ _acceptance/    (chép suySlug, docDuLieu,       scripts/lo-trinh.mjs …
            │                               định nghĩa «xong»)             + ứng dụng crm chép docDuLieu
            ├─▶ LO-TRINH.html + khối dữ liệu (vẽ lại khi đóng cổng; CI --check)
            ├─▶ /start: hàng kế, hàng trễ, cờ
            └─▶ feature-loop S0: --mo-o mở ô cơ hội từ hàng (ngưỡng điền từ bat_khi + ngày mốc)
```

**Nguyên tắc đang giữ:** tệp lộ trình là **Ý ĐỊNH**, người viết; kit **chỉ đọc**; trạng thái **suy từ hồ sơ**,
không ghi vào tệp. Không mã nào ghi tệp lộ trình — chỉ ghi `LO-TRINH.html` và `opportunity.md`.

**Những gì đo được là gãy:**

| # | Gãy | Số đo 14/10 |
|---|---|---|
| G1 | Rà soát không xảy ra | OKR crm: 125 hàng từng có, 1 rời. 76/124 ngoài mốc. Lộ trình việc dự án: 10 mã biến mất không vết |
| G2 | Xếp lại đắt và theo phản xạ | Lộ trình kit: 27/35 lần sửa có xếp lại (dời mốc, đổi phụ thuộc, bỏ hàng), dồn trong 6 ngày; 6 lần gộp tay (crm OKR: 3) |
| G3 | Tệp ý định thành bảng việc viết tay | crm OKR: `buoc_ke` 105, `trang_thai` 74, `pr` 76, `cho_ai` 17, `phien` 15 — **14 trường ngoài khuôn kit**. Ngược lại `bat_khi` 35, `vi_sao` 15 |
| G4 | Ưu tiên sống ở hai nơi | Đợt điều phối crm có `hang-viec.json` riêng với dãy P1–P4 và `uu_tien`, tách khỏi lộ trình |
| G5 | Bốn bản định nghĩa «xong» | Lõi · bản chép kho (crm `cat-luot.mjs` đã lệch bản gốc) · `dieu-phoi` (có ca round-trip DP2-08 canh) · ứng dụng crm |
| G6 | Lệch phiên bản | 15 phiên bản kit trên máy; crm cài plugin 2.26 nhưng mã chép từ 2.28 |
| G7 | Liên kho chỉ bằng văn bản tự do | 26/37 hàng kit nhắc kho khác trong `vi_sao`; mốc «crm nhận kit 2.28» và «Kit phát hành 2.28» chép tay ở hai phía, không nối máy |
| G8 | Giai đoạn không có khuôn | `loai` mốc không được kiểm: `han` (khuôn) vs `han-cung`, `su-kien`, để trống (crm). Trang crm làm mất `loai` |
| G9 | Bản đồ hiện trạng sống trong phiên | Đổi tài khoản 14/10: 3–4 lượt gọi người ngoài thiết kế (hạt giống hiện trạng) |

**Điều đáng chú ý nhất là G3:** khi lộ trình không có chỗ máy đọc cho «bước kế · chờ ai · phiên nào», kho tự
nhét chúng vào tệp ý định. Đó là nhu cầu thật (cùng nhu cầu hạt giống hiện trạng), nhưng đặt sai nhà — trạng thái
viết tay trong tệp ý định là đúng thứ glossary cấm, và nó trôi khỏi hồ sơ ngay khi không ai sửa.

---

## 3. Kiến trúc plugin `roadmap` dự kiến

Theo ADR 0025, cộng các bổ sung của lượt bàn 14/10:

```
  plugin roadmap (MẶT: lệnh + skill, tag bat-theo-lua-chon, cài --scope project)
    /roadmap:khoi-tao   nấc 2 — tạo sẵn tệp lộ trình cho kho
    /roadmap:ra-soat    phiếu rà soát ở ranh giới mốc → máy mở PR, người gộp = quyết
    /roadmap:xem        bản đồ xong · đang dở · kế (lát 3)
    skill cat-luot, gom-tin-hieu (giữ ở lõi lát 1, dời tên ở lát sau)
            │ resolve-plugin --require
            ▼
  lõi acceptance-gate: lo-trinh-doc (đọc + suy trạng thái)   ← chép sang kho cho CI
                       lo-trinh-ghi (ghi dạng chuẩn)          ← KHÔNG chép, chạy từ bản cài
                       lo-trinh-ra-soat (soạn phiếu)          ← KHÔNG chép
```

Bốn nấc của ADR 0025: nấc 1 (cờ vàng) đang chấm ở vòng MC1; nấc 3 (tự nối hàng) đã dời khỏi MC1 sang vòng plugin;
nấc 2 (khởi tạo) và nấc 4 (chặn, có ngưỡng) thuộc plugin.

Bổ sung 14/10: lệnh ghi chuẩn (mỗi hàng một dòng, thứ tự cố định → git tự gộp) · phiếu rà soát (giữ · dời mốc ·
xuống chân trời · đề xuất bác, kèm căn cứ) · trần tầng «Kế tiếp» · lịch sử dời rút từ git (dời ≥3 lần = cờ vàng)
· đóng băng xếp lại giữa hai mốc (chủ kho chưa trả lời) · nguồn vẫn là JSON trong git, SQLite chỉ là chỉ mục
dẫn xuất nếu đo được cần.

---

## 4. So sánh hai kiến trúc

| Chiều | Hôm nay | Plugin `roadmap` (B-liên-bang) |
|---|---|---|
| Nhà của ý định | Tệp JSON trong kho | **Không đổi** |
| Ai ghi tệp | Người / phiên skill, sửa tay | Máy ghi **dạng chuẩn** theo lệnh; mọi đổi đi qua PR người gộp |
| Trạng thái | Suy từ hồ sơ (kho tự khai thêm, G3) | Suy từ hồ sơ; trường tự khai ngoài khuôn được **cờ vàng**, không bị xoá |
| Rà soát | Không có nhịp (G1) | Phiếu ở ranh giới mốc, máy soạn, người gộp |
| Xếp lại | Rải rác, theo phản xạ (G2) | Dồn vào phiếu; giữa hai mốc chỉ khi bị chặn (nếu chủ kho chọn đóng băng) |
| Ưu tiên | Lộ trình + danh sách đợt (G4) | Lộ trình là nguồn; danh sách đợt là **hình chiếu** sinh từ lộ trình |
| Mã | Một tệp 858 dòng, chép sang kho | Tách đọc / ghi / rà soát; chỉ phần đọc được chép |
| «Xong» | Bốn bản (G5) | Một nguồn ở lõi; `dieu-phoi` nạp qua resolve-plugin thay vì chép |
| Liên kho | Văn bản tự do (G7) | Mốc ngoài trỏ máy đọc `<kho>:<mã mốc>`; bản đồ gộp dẫn xuất |
| Bật cho kho | Khai `lo_trinh.tep` | Khai khoá + cài plugin = cam kết; kho không cài **không đổi gì** |
| Phiên bản | Ba gói cùng số (P200) | Bốn gói cùng số; kiểm bản cài thêm mục `roadmap` |

**Ưu điểm của B:**
- Có **cửa ra** (rà soát, trần) — chữa G1, G2 ở gốc, không bằng lời dặn.
- **Một lượt quyết mỗi mốc** thay cho hàng chục lần sửa rải rác: giảm lượt gọi người và số phiên máy đốt vào sửa JSON.
- Opt-in theo kho: đúng thứ tự nghiệm của luật 26/09 (bật thêm theo lựa chọn, không đổi mặc định).
- Đặt đúng nhà cho nhu cầu G3/G9: trạng thái và bước kế vào **bản đồ dẫn xuất**, không vào tệp ý định.
- Tên và vai bốn plugin khớp nhau — phiên điều phối biết hỏi plugin nào cho câu nào.

**Giá phải trả:**
- **Thêm một gói** phải giữ cùng số phiên bản, thêm một mục kiểm bản cài, thêm một lần cài ở mỗi kho.
- **Phá một nguyên tắc có chủ đích:** «kit chỉ đọc tệp lộ trình» thành «kit ghi tệp lộ trình theo lệnh, người gộp».
  Phải sửa glossary và chứng ghi→đọc round-trip; ghi sai là sai ý định, đắt hơn vẽ sai trang.
- **Một chạm người mỗi mốc** (gộp PR phiếu rà soát). Với kit, phiếu đi chung hồ sơ mốc phát hành nên 0 lượt
  thêm; với crm, đó là một khoảnh khắc mới — đổi lấy các lượt sửa tay hiện nay, nhưng vẫn phải đếm.
- **Chi phí máy** cho phiếu: đọc mọi hàng + git log mỗi mốc — rẻ (đo tay hôm nay ~40 dòng mã, vài giây).
- **Đổi tên skill** (`acceptance-gate:cat-luot` → `roadmap:cat-luot`) làm gãy tham chiếu trong tài liệu, bộ nhớ,
  thói quen — nên hoãn tới khi có lý do.
- **Vòng meta:** theo luật chiều rộng (b), mỗi lát ăn một cửa sổ giữa hai mốc được kho nhận.

---

## 5. Nhiều kho

Ba lối:

| Lối | Mô tả | Đánh giá |
|---|---|---|
| Tập trung | Một lộ trình chung cho mọi kho (một tệp hoặc một dịch vụ) | Bác: sinh nguồn thứ hai, cần máy chủ dùng chung hoặc kho riêng; kho nhỏ phải phụ thuộc kho trung tâm; trái «kit là engine, không chứa ngữ cảnh sản phẩm» |
| Chép tay hai phía | Như hôm nay (G7) | Đang trôi: mốc chép hai nơi, không ai canh |
| **Liên bang** | Mỗi kho sở hữu lộ trình của mình; phụ thuộc liên kho là **mốc ngoài trỏ máy đọc** `<kho>:<mã mốc>`; bản đồ gộp là hình chiếu | **Chọn** |

Cách liên bang chạy:
- Mốc ngoài thêm một trường tuỳ chọn trỏ mốc của kho khác. Bộ đọc tìm kho đó trên đĩa (hoặc qua bản đã fetch);
  **không đọc được thì là nhãn «không đọc được ở đây», không phải lỗi** — đúng định vị bảng đồng hồ.
- Mốc phía bên kia đạt (ví dụ kit phát hành 2.28 có tag) → mốc ngoài phía này tự hiện «đã tới», bỏ việc chép tay.
- Bản đồ gộp chỉ gom các kho máy này đang làm; thanh bên là mỏ neo chú ý, không phải nguồn.
- Đổi khuôn thì có đường đọc-cũ: thiếu trường trỏ → vẫn là mốc ngoài viết tay như nay.

---

## 6. Nhiều giai đoạn của dự án

Không thêm trường «giai đoạn» — **giai đoạn của một hàng suy từ chỗ nó đứng**, như trạng thái:

| Giai đoạn | Vật đã có | Phần thiếu |
|---|---|---|
| Khám phá | Tín hiệu → bản gom → bản phạm vi → **chân trời** (có `mo_lai_khi`) | Không |
| Cắt | Skill cắt lượt → hàng, có `dung_tren`, `dot` | Không |
| Chiến dịch | Mốc phát hành / hạn / ngoài | **Từ vựng `loai` chưa kiểm** (G8) → bộ đọc khoan dung + cờ vàng cho giá trị lạ, chuẩn hoá đồng nghĩa (`han-cung` ≈ `han`) |
| Thi công | Vòng feature-loop từ hàng | Không |
| Giao | Mốc khép | **Phiếu rà soát** (lát 1) |
| Đo | `bat_khi`, Cổng Giá trị, reality | **Đọc `bat_khi` sau khi giao** (lát 3, bài R5 07/09); 89/124 hàng crm chưa có `bat_khi` |
| Quay lại | Tín hiệu mới | Không |

Vòng ngoài khép kín khi «Đo» nối được về «Khám phá». Hôm nay nó đứt ở hai chỗ: Giao (không rà soát) và Đo
(không ai đọc `bat_khi`). Hai chỗ đứt là cửa ra — đó là lý do lát 1 làm cửa ra trước.

---

## 7. Tác động lên mã

Theo lát của phương án B. Đếm hiện có: 19 tệp mã, 15 skill + lệnh, 28 tệp test chạm lộ trình;
`tests/scripts/lo-trinh.test.mjs` 3 516 dòng, khoảng 103 ca.

**Lát 1**
- **Gói mới** `roadmap/` (`.claude-plugin/plugin.json`, `commands/`, README) + một mục marketplace (tag
  `bat-theo-lua-chon`). Ca P200 mở rộng từ ba lên bốn gói cùng số; `kiem-ban-cai.mjs` thêm mục `roadmap`.
- **Tách `scripts/lo-trinh.mjs`**: phần đọc ở lại (vẫn nằm trong danh sách chép cho CI của kho); phần ghi và
  rà soát thành tệp riêng, **không vào danh sách chép** → mặt chép sang kho không phình. Danh sách chép của
  `acceptance-init` không đổi trong lát này.
- **Bộ ghi dạng chuẩn**: round-trip ghi → đọc (luật seam máy-viết → máy-đọc), giữ nguyên khoá lạ của kho (14
  trường của crm), chiều đỏ: bản ghi đảo thứ tự / làm rơi khoá lạ → ca đỏ nêu khoá.
- **Phiếu rà soát**: căn cứ mỗi đề xuất (tuổi hàng, không hồ sơ, số lần dời từ git, tín hiệu đè) phải là con
  trỏ máy đọc. Duyệt bằng **gộp PR** — không thêm lệnh cổng người, nên danh sách khoá của ADR 0002 / P32
  **không đổi**. (Nếu chọn duyệt bằng lệnh thì phải thêm thao tác thứ tám vào cả ADR 0002 lẫn danh sách khoá trong
  cùng một PR.)
- **Glossary** (`CONTEXT.md`): sửa mục Lộ trình — «kit đọc; kit chỉ ghi khi người ra lệnh và gộp PR; trạng thái
  vẫn không ghi vào tệp».
- **Khởi tạo** (nấc 2): một khuôn tệp rỗng hợp lệ + khoá cấu hình; kho đã có tệp thì không đụng.

**Lát 2**
- **Tự nối hàng** (nấc 3) dùng bộ ghi của lát 1.
- **Gộp bản chép của `dieu-phoi`** (`nguon-hang.mjs`: `suySlug`, `docDuLieu`, định nghĩa «xong») về nạp lõi qua
  resolve-plugin; ca DP2-08 chuyển từ «so hai bản chép» sang «một nguồn».
- **Mốc ngoài liên kho**: trường trỏ mới + đường đọc-cũ + cờ vàng; thêm `loai` vào khối dữ liệu (trang crm đang mất nó).
- **Danh sách đợt sinh từ lộ trình** thay `hang-viec.json` viết tay (G4) — chạm `dieu-phoi`, vùng của máy M5.

**Lát 3 (theo ngưỡng)**
- Bản đồ hiện trạng liên kho (ngưỡng của hạt giống hiện trạng) · nấc 4 chặn (ngưỡng ADR 0025) · đọc `bat_khi`
  sau giao · chỉ mục SQLite (chỉ khi một truy vấn đo được là chậm).

**Kho tiêu thụ.** crm nhận lát 1 bằng cách cài plugin, không phải chép thêm mã. Trường tự khai (G3) không bị xoá,
chỉ lên cờ vàng — sửa đúng tầng là việc của crm (chuyển «bước kế» sang bản đồ khi lát 3 tới). Kho không cài
plugin: **0 thay đổi**; ca đo bằng-byte như MC1 AC-2 phải giữ điều đó.

---

## 8. Bốn phương án và khuyến nghị

| | A · Giữ lõi + MC1 | **B · Plugin mặt, liên bang** | C · Plugin đầy đủ, tách mã | D · Trung tâm (CSDL / dịch vụ) |
|---|---|---|---|---|
| Chữa G1–G2 (rà soát, xếp lại) | Không | **Có** | Có | Có |
| Chữa G5–G6 (bản chép, phiên bản) | Không | Một phần (gộp `dieu-phoi`) | Làm tệ hơn: hai nhịp phát hành | Đổi bệnh: lệch lược đồ |
| Liên kho | Chép tay | Con trỏ + hình chiếu | Con trỏ | Sẵn có |
| Lượt gọi người / kết quả ship | = (sửa tay vẫn còn) | **↓** (một chạm mỗi mốc thay sửa rải rác) | ↓ | ↓ nhưng cần người vận hành |
| Chi phí dựng | 0 | 3 lát, mỗi lát 8–12 tiêu chí | Dời ~20 tệp, crm chép lại, hồ sơ đã ký hoá cũ | Dịch vụ mới, sao lưu, quyền |
| Khó-đảo | Không | Thấp (gỡ cài plugin) | Cao | Cao (dữ liệu rời git) |
| Theo North Star | Không tiến | **Tiến đúng thước** | Trả giá lớn cho lợi ích B đã có | Trái «một nguồn sự thật trong git» |

**Chọn B**, làm theo thứ tự **cửa ra trước cửa vào**:

1. **Lát 1** (vòng meta đã gọi tên, mở sau mốc kế được kho nhận): khung plugin + bộ ghi chuẩn + phiếu rà soát +
   trần «Kế tiếp» + khởi tạo kho (+ đóng băng giữa hai mốc nếu chủ kho chọn). Khoảng 10–12 tiêu chí.
2. **Lát 2** (cửa sổ kế): tự nối hàng + gộp bản chép `dieu-phoi` + mốc ngoài liên kho + danh sách đợt sinh từ lộ trình.
3. **Lát 3** (theo ngưỡng, không hẹn): bản đồ hiện trạng · chặn · đọc `bat_khi` · chỉ mục.

**Vì sao cửa ra trước:** mọi số đo 14/10 chỉ về cùng một hướng — lộ trình đã có quá nhiều cửa vào (cắt lượt, gom
tín hiệu, sửa tay) và không có cửa ra. Tự nối hàng (nấc 3) là thêm một cửa vào nữa; làm nó trước rà soát thì G1
nặng thêm.

**Bảng dự báo 5 dòng của luật (c), cho lát 1:**

| Dòng | Dự báo | Điều kiện tin cậy |
|---|---|---|
| Làm-xong → quyết-được | = trong vòng; ↓ ở mốc (quyết lộ trình gom vào một phiếu) | Đo ở hồ sơ mốc đầu tiên có phiếu |
| Lượt gọi người / vòng | = (0 lượt thêm trong vòng); ngoài vòng: ↓ lượt sửa tay lộ trình | Đếm commit sửa lộ trình giữa hai mốc trước và sau |
| Vòng bị hạ tầng đốt | = | — |
| Token máy / vòng | = | Đường verdict không đổi thành phần |
| Phút máy / lượt chấm | = | Như trên |

---

## 9. Giới hạn và cách đo lại

- **Đếm «xếp lại»** tính theo commit có ít nhất một thay đổi về mốc / phụ thuộc / bỏ hàng; số lần dời từng hàng
  bị đếm phồng khi mốc đổi tên, nên tài liệu này chỉ trích số commit.
- **10 mã biến mất** ở lộ trình việc dự án: chưa phân biệt đánh lại mã với bỏ thật.
- **Phiên bản cài** đọc từ sổ cài plugin của một máy (MacBook Pro); hai máy kia chưa đo.
- **Chưa đo** lượt gọi người do sửa lộ trình — dòng 2 của dự báo cần mốc nền đếm trước khi lát 1 mở.
- Lệnh đo: script so từng phiên bản tệp lộ trình theo `git log --reverse` (đếm hàng thêm / bớt / dời mốc / đổi
  `dung_tren`), đếm khoá trường trên `origin/onehub:docs/plan/lo-trinh-okr.json`, so `shasum` bản chép
  `scripts/lo-trinh.mjs` / `cat-luot.mjs` giữa kit và crm. Ba lệnh này nên thành ca đo của lát 1, không chạy tay
  lần nữa.

Liên quan: [ADR 0025](../adr/0025-lo-trinh-rang-buoc-theo-bac-thang.md) ·
[hạt giống hiện trạng](../plans/2026-10-14-hat-giong-hien-trang-sau-doi-tai-khoan.md) ·
[toàn trình playbook vs kit](2026-09-07-toan-trinh-playbook-vs-kit.md) (R4, R5).
