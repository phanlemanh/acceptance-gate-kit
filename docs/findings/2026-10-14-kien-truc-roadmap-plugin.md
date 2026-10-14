# Kiến trúc Roadmap — lộ trình hôm nay và plugin `road-map`: khung, so sánh, phương án — 14/10/2026

> Tài liệu đầu vào cho vòng plugin lộ trình (ADR 0025 gọi tên trước cho cửa sổ kế; chủ kho đặt tên `road-map`
> 14/10, đồng dáng hai-từ-gạch-nối với `acceptance-gate`, `feature-loop`, `diagram-design`, `dieu-phoi`).
>
> **Bản 2 (sau đối kháng).** Bản 1 cùng ngày khuyên phương án «B-liên-bang» với lát 1 = cửa ra trước (bộ ghi
> chuẩn + phiếu rà soát duyệt bằng gộp PR + trần + đóng băng). Chủ kho xin rà soát một lượt trước khi quyết;
> ba tác tử đối kháng độc lập (luật kit · số liệu · kỹ thuật) cùng kết luận **B như đã viết đổ**, và bản 1 có
> số phóng đại. §7 ghi phán quyết và các đính chính; khuyến nghị đổi thành **B′** (§6).
>
> Nguồn: kit `origin/main` (@703f38d1; tệp lộ trình và `lo-trinh.mjs` giống @915c7fca), crm `origin/onehub`
> (fetch 14/10). Script đo của đối kháng: thư mục tạm của phiên (`scratchpad/verify/`, `scratchpad/mg/`).

---

## 0. Một phút

**Khuyến nghị: B′ — vòng ngoài sống TRONG LÕI trước, plugin `road-map` chỉ dựng khi nấc chặn tới.**

- **Rà soát không thành cổng mới.** Máy tính «đề xuất rà soát» và hiện thành cờ vàng trên thẻ `/start` và
  trang lộ trình — lên cổng ĐÃ CÓ, 0 lượt gọi thêm (K8).
- **Chính sách chốt một lần ở Cổng Đáng của chiến dịch** (ví dụ «hàng chưa mở quá N ngày sau mốc thì xuống chân
  trời»). Mục khớp chính sách đã khai → máy tự áp, ghi sổ, cửa veto. Không có chính sách → chỉ cờ vàng.
- **Bộ ghi tối thiểu nằm cùng tệp với bộ đọc** (cùng phiên bản), giữ nguyên định dạng, thứ tự và mọi khoá lạ;
  chỉ dời hàng, không định dạng lại.
- **Plugin `road-map`** giữ tên, dựng khi nấc 4 (chặn theo lựa chọn từng kho) đạt ngưỡng của ADR 0025 — đó là
  thứ duy nhất một plugin riêng mua được mà lõi không cho.
- **Thời điểm:** sau khi đọc số của MC1 (nấc 1, cờ vàng) ở kho nhận, và khi chủ kho gọi tên vòng (luật (b)).

**Vì sao không còn là B:** cổng rà soát mới thêm lượt gọi người ngoài thiết kế; «duyệt bằng gộp PR» không có
khoá và máy tự gộp được; plugin thứ năm tạo thêm cặp lệch phiên bản giữa bộ ghi và bộ đọc; «mỗi hàng một dòng
để git tự gộp» sai khi thử thật; con trỏ liên kho trong trang đã commit làm CI đỏ; và bằng chứng «lộ trình không
có cửa ra» mỏng hơn bản 1 nói.

**Hình** (chiếu của chữ ở §6–§8, mở bằng trình duyệt):
[luồng một đề xuất rà soát](assets/2026-10-14-kien-truc-roadmap/01-luong-de-xuat-ra-soat.html) ·
[lượt chạm người, B so với B′](assets/2026-10-14-kien-truc-roadmap/02-luot-cham-nguoi-b-va-b-phay.html) ·
[mã nằm đâu, ghi và đọc có cùng phiên bản không](assets/2026-10-14-kien-truc-roadmap/03-ma-nam-dau-phien-ban.html).

---

## 1. Khung — đọc lại ý định của chủ kho

Ý định đọc được qua các lượt hỏi 14/10: một **đích đứng yên** cho điều phối – thợ; **người ở biên** của vòng
ngoài (quyết lúc rà soát, không sửa tay mỗi ngày); **không mất bản đồ** khi đổi máy hay tài khoản; chạy trên
**nhiều kho, nhiều giai đoạn**.

Bốn vai, năm gói (gói thứ năm `diagram-design` là công cụ vẽ, ngoài vòng):

| Gói | Vai | Câu nó trả lời |
|---|---|---|
| `acceptance-gate` | **Thước** | Kết quả này có thật như đã hứa không? |
| `feature-loop` | **Vòng trong** | Một hàng → một kết quả ship, ba cổng người |
| `dieu-phoi` | **Song song** | Bao nhiêu vòng cùng lúc, ai giữ khoá nào |
| `road-map` (dự kiến) | **Vòng ngoài** | Kết quả nào, chiến dịch nào, vì sao bây giờ, còn đáng không |

Vai «vòng ngoài» là thật; câu hỏi của tài liệu này là vai đó **cần nhà riêng từ lúc nào**. Trả lời sau đối kháng:
chưa — cho tới khi có thứ chỉ nhà riêng làm được (bật/chặn theo từng kho).

Trace: nguyên tố 1 (mốc + `bat_khi` + chính sách chiến dịch chốt trước) và nguyên tố 3 (người quyết chính sách
một lần; máy áp với cửa veto). Người hưởng: chủ kho crm và phiên điều phối.

---

## 2. Kiến trúc lộ trình hôm nay

```
  NGƯỜI / phiên chạy skill cat-luot ──viết──▶ tệp JSON lộ trình (trong kho, đổi bằng PR, stringify 2 dấu cách)
                                                     │ đọc
            ┌────────────────────────────────────────┼─────────────────────────────┐
            ▼                                        ▼                             ▼
   lõi kit: lo-trinh.mjs (858 dòng)        dieu-phoi/nguon-hang.mjs        kho tiêu thụ: BẢN CHÉP bộ đọc
   suy trạng thái từ hồ sơ + lời tự khai    (chép suySlug, docDuLieu;       (crm: theo tag, chậm phiên bản)
   (trang_thai qua tu_vung)                 ca DP2-08 canh)                 + ứng dụng crm chép docDuLieu
            ├─▶ LO-TRINH.html + khối dữ liệu (vẽ lại khi đóng cổng; CI --check)
            ├─▶ /start: hàng kế = hàng đủ điều kiện ĐẦU TIÊN theo thứ tự tệp
            └─▶ feature-loop S0 / dieu-phoi mo-dot: --mo-o mở ô từ hàng
```

Một nơi định nghĩa «xong» (lõi); ba bản chép **bộ đọc**. Không mã nào ghi tệp lộ trình.

**Gãy đo được — đã đính chính sau đối kháng:**

| # | Gãy | Số đo |
|---|---|---|
| G1 | Hàng chưa giao không thuộc mốc | OKR crm: 76/124 hàng ngoài mốc, nhưng **42 đã giao** (sổ lịch sử, không phải nợ), 4 «chưa mở», 30 không tự khai trạng thái. Cửa ra `da_bac` **có** và đã dùng (crm 1, kit 4) |
| G2 | Xếp lại theo phản xạ, không theo nhịp | Kit: **18–19/35** lần sửa có dời mốc / đổi phụ thuộc / bỏ hàng thật (8 lần chỉ đổi tên mốc), trong 7 ngày. Xung đột gộp thật: kit 2, crm 0 |
| G3 | Lộ trình nặng việc, nhẹ kết quả | crm OKR: `buoc_ke` 105, `pr` 76, `cho_ai` 17, `phien` 15 — 12 khoá kho tự thêm ngoài khuôn (`trang_thai` là lời tự khai kit đọc được). `bat_khi` chỉ 35, `vi_sao` 15 |
| G4 | Ưu tiên sống hai nơi | Đợt crm: `hang-viec.json` với dãy P1–P4 (đợt r2: P1–P7), 24/24 hàng có `uu_tien` |
| G5 | Bản chép bộ đọc chậm phiên bản | crm cài plugin 2.26 nhưng chép mã từ thẻ 2.28; sổ cài có 15 mục (6 còn sống ngoài worktree tạm) |
| G6 | Liên kho chỉ bằng chữ tự do | 30/37 hàng kit nhắc kho khác trong `vi_sao`; mốc «crm nhận 2.28» / «Kit phát hành 2.28» viết tay hai phía |
| G7 | Loại mốc không kiểm | `han-cung`, `su-kien`, để trống; khối dữ liệu của **lõi** chỉ mang `ten/ngay/hang/con_viec`, nên trang crm mất `loai` |
| G8 | Bản đồ hiện trạng sống trong phiên | Đổi tài khoản 14/10: 3 lượt gọi người ngoài thiết kế |

Đọc lại G3: kho không có chỗ máy đọc cho «bước kế · chờ ai · phiên nào» nên tự thêm khoá vào tệp. Đó là nhu cầu
của hạt giống hiện trạng; nhà đúng là bản đồ dẫn xuất, không phải bộ ghi của kit.

---

## 3. Bản 1 đề xuất gì (B) — giữ để đối chiếu

Plugin «mặt» `road-map` ngay lát 1: lệnh khởi tạo, phiếu rà soát ở ranh giới mốc (máy mở PR, người gộp = quyết),
bộ ghi «mỗi hàng một dòng» tách khỏi bộ đọc và không chép sang kho, trần tầng «Kế tiếp», đóng băng xếp lại giữa
hai mốc; lát 2 tự nối hàng + gộp bản chép `dieu-phoi` + con trỏ liên kho trong trang; lát 3 bản đồ, chặn, đọc
`bat_khi`, chỉ mục.

---

## 4. Nhiều kho

| Lối | Đánh giá |
|---|---|
| Tập trung (một lộ trình / dịch vụ chung) | Bác: nguồn thứ hai ngoài git, cần máy chủ, kho nhỏ phụ thuộc kho trung tâm |
| Chép tay hai phía (hôm nay) | Trôi, nhưng chưa gây sự cố đo được |
| **Liên bang** — mỗi kho sở hữu lộ trình; phụ thuộc là con trỏ máy đọc | Giữ hướng, **nhưng trạng thái liên kho KHÔNG vào khối dữ liệu đã commit**: CI không có kho anh em nên `--check` sẽ lệch giữa máy và CI. Chỉ hiện ở `/start` hoặc bản đồ gộp không commit. Cách tìm kho anh em trên ba máy chưa có lời giải → **hạt giống, chờ ngưỡng** |

## 5. Nhiều giai đoạn

Không thêm trường «giai đoạn» — giai đoạn suy từ chỗ hàng đứng (chân trời → trong mốc → đang làm → đã giao →
đo `bat_khi`). Hai việc thật: (i) khuôn mốc của **lõi** mang thêm `loai` và bộ đọc khoan dung + cờ vàng cho giá
trị lạ (luật 26/09: sửa đúng tầng ở lõi, không đổi mặc định); (ii) đọc `bat_khi` sau khi giao (bài R5 07/09) —
89/124 hàng crm chưa có `bat_khi`, nên trước hết là cờ vàng «hàng không có tín hiệu thành công».

---

## 6. Phương án sau đối kháng: B′

| | A · Giữ lõi + MC1 | B · Bản 1 | **B′ · Vòng ngoài trong lõi** |
|---|---|---|---|
| Rà soát | Không | Cổng mới (+1 lượt/mốc) | **Cờ vàng trên cổng đã có** + chính sách tự áp có veto |
| Lượt gọi người ngoài thiết kế | = | **↑** | = (mục tiêu ↓ khi chính sách thay sửa tay) |
| Bộ ghi | Không | Tách tệp, chạy từ bản cài, lệch phiên bản với bộ đọc chép trong kho | Cùng tệp với bộ đọc; giữ định dạng, thứ tự, khoá lạ |
| Gói mới | Không | Gói thứ năm ngay lát 1 | Chỉ khi nấc 4 đạt ngưỡng |
| Đổi danh sách chép / ghim lại | Không | Tách tệp → thêm tệp vào danh sách chép, mọi kho chép lại; ~15 hồ sơ có eval gọi `lo-trinh` hoá cũ | Vẫn sửa `lo-trinh.mjs` → cùng ~15 hồ sơ hoá cũ, ghim lại theo mốc phát hành như thường lệ; danh sách chép không thêm tệp |
| Khoá cổng người (ADR 0002) | — | Lỗ: «gộp PR» máy tự làm được | Không có cổng mới; chính sách chốt ở Cổng Đáng (đã khoá) |

**Phạm vi đề xuất cho vòng kế (khi chủ kho gọi tên, sau số MC1):**
1. `lo-trinh.mjs --ra-soat`: tính đề xuất (giữ · dời mốc · xuống chân trời · bác) với căn cứ máy đọc; loại hàng
   đang có hồ sơ nhận (`lo_trinh_ma`); xuất thành cờ vàng ở thẻ `/start` và mục «Cần sửa trong kế hoạch» của trang.
2. Khuôn **chính sách chiến dịch** khai ở Cổng Đáng (ngưỡng tuổi hàng, trần «Kế tiếp», có đóng băng hay không) —
   máy áp các mục khớp chính sách, ghi sổ quyết định, cửa veto; không khai thì chỉ cờ vàng.
3. Bộ ghi tối thiểu: chỉ dời hàng giữa mốc / chân trời / đã bác; `JSON.stringify(…, null, 2)`, giữ thứ tự mảng
   (hàng kế = hàng đầu tiên theo thứ tự tệp), giữ mọi khoá; ca round-trip + chiều đỏ (đảo thứ tự, rơi khoá lạ).
4. `loai` vào khuôn mốc của khối dữ liệu.

Ngoài phạm vi, vào hạt giống: con trỏ liên kho · gộp bản chép `dieu-phoi` (chép bộ đọc, có DP2-08 canh — ưu tiên
thấp) · danh sách đợt sinh từ lộ trình (vùng M5) · plugin `road-map` + nấc 2 + nấc 4 (theo ngưỡng ADR 0025).

**Bảng dự báo 5 dòng của luật (c):**

| Dòng | Dự báo | Điều kiện tin cậy |
|---|---|---|
| Làm-xong → quyết-được | = | — |
| Lượt gọi người / vòng | = trong vòng; ngoài vòng: số lần sửa tay lộ trình ↓ khi có chính sách | Đo mốc nền **trước** khi mở vòng: đếm commit sửa lộ trình do người yêu cầu giữa hai mốc |
| Vòng bị hạ tầng đốt | = | — |
| Token máy / vòng | = | Đường verdict không đổi thành phần |
| Phút máy / lượt chấm | = | Như trên |

---

## 7. Phán quyết đối kháng (14/10) và đính chính bản 1

Ba tác tử độc lập, mỗi tác tử một góc, cố bác B. Cả ba: **B như đã viết đổ.**

| Góc | P0 | Điểm chính |
|---|---|---|
| Luật kit | 3 | Phiếu rà soát = lượt gọi ngoài thiết kế bị bảng dự báo giấu (K8: «lên thẻ ở cổng ĐÃ CÓ»); gộp PR là trạm thu phí, không khoá, máy tự gộp được; lát 1 nhét bốn phần CỘNG chưa được duyệt đích danh vào phê duyệt của ADR 0025, và đặt sẵn ba cửa sổ meta |
| Kỹ thuật | 3 | Bộ ghi (bản cài) lệch phiên bản với bộ đọc (bản chép trong kho) — resolve-plugin lấy bản mới nhất; con trỏ liên kho trong trang làm CI `--check` đỏ; «mỗi hàng một dòng → git tự gộp» **sai khi thử thật** (thêm hàng cuối mảng vẫn xung đột; tệp đã là stringify 2 dấu cách; định dạng lại phá `git blame`) |
| Số liệu | 3 lỗi đổi được khuyến nghị | 10 «mã biến mất» thật ra là **đánh lại mã** V→DA (câu giao trùng); 27/35 xếp lại thật là 18–19/35; «bốn bản định nghĩa xong» thật là một định nghĩa + ba bản chép bộ đọc |

Đính chính khác: kit có **năm** gói (không phải bốn), `road-map` là gói thứ năm · «14 khoá ngoài khuôn» → 12 ·
«26/37 hàng nhắc kho khác» → 30/37 · «6 lần gộp tay» → 6 commit gộp, 2 xung đột thật · lượt gọi người khi đổi tài
khoản: 3 · khối dữ liệu mất `loai` là lỗi của lõi, không của crm · `cat-luot.mjs` của crm là bản ghim theo thẻ, không
phải bản trôi · nấc 3 dời khỏi MC1 là quyết định trong hồ sơ MC1 (nhánh chưa gộp); ADR 0025 trên `main` chưa đổi.

**Phần B sống sót:** vai «vòng ngoài»; liên bang (mỗi kho sở hữu lộ trình); giai đoạn suy từ vị trí, không khai;
cờ vàng cho hàng không có `bat_khi`; tên `road-map`.

**Bài học cho máy:** bản 1 dựng khuyến nghị trên số chưa qua chiều đỏ — đếm «xếp lại» không loại đổi tên mốc,
đếm «biến mất» không dò đánh lại mã. Ba lỗi cùng một hướng (phóng đại vấn đề mà phương án định chữa). Đúng lớp
«máy diễn dịch dữ liệu thành kết luận».

## 8. Quét hình thái độ phủ của B′ (14/10, skill `morphological-scan`, preset entity-feature)

**Thực thể:** một hàng lộ trình lúc máy rà soát nó. **Chân sản phẩm:** `[SUY-TỪ-REPO: scripts/lo-trinh.mjs]`
(ba danh sách ô, `chan_troi`, `da_bac`), hợp đồng MC1 AC-1 (ma trận trạng thái), số crm §2. **Chân ngành** (kiểm
qua web 14/10): `[NGÀNH: GitHub actions/stale]` — đánh dấu cũ rồi mới đóng sau một khoảng chờ, nhãn miễn trừ, đụng
vào thì đặt lại đồng hồ, trần số thao tác mỗi lượt · `[NGÀNH: Linear — auto-close]` — không tự đóng khi chu kỳ/dự
án gắn với việc chưa xong, mở lại được · `[NGÀNH: Shape Up — không backlog]` — ý bị gác không giữ ưu tiên, muốn
làm phải đề xuất lại.

**Trục**
- A · Vị trí hàng: trong mốc đang chạy | trong mốc đã quá ngày | ngoài mốc («Kế tiếp») | chân trời | đã bác  [CE: khoá `moc[].hang`, `chan_troi`, `da_bac`]
- B · Trạng thái suy từ hồ sơ: chưa có hồ sơ | hồ sơ đang mở | đã giao | hồ sơ đóng khác (xếp lại · bác · hỏng) | không suy được  [CE: `DA_GIAO_O/DANG_LAM_O/CHUA_LAM_O`, MC1 AC-1]
- C · Căn cứ chính sách: khai và khớp | khai, không khớp | không khai | hai luật cùng khớp mà ngược nhau | hàng được miễn trừ  [CE: §6 + actions/stale]
- D · Kích hoạt: mốc khép | mốc quá ngày mà chưa khép | mở thẻ giữa mốc | tín hiệu mới | lệnh tay  [CE: §6 + Linear]

**Lát A × B** (25 ô, 14 có nghĩa): B′ phủ đường chính — trong/ngoài mốc × chưa có hồ sơ (dời · chân trời ·
bác), hồ sơ đang mở → bỏ qua, không khai chính sách → cờ vàng. **Sót 7 ca:**

| # | Ca sót | Hệ quả nếu để nguyên | Nguồn |
|---|---|---|---|
| S1 | Hàng có hồ sơ **đóng khác** (bác / xếp lại / hỏng) | Luật «loại hàng có hồ sơ nhận» chặn luôn nó → kẹt mãi, không ai đề xuất đưa vào `da_bac` / chân trời | `[SUY-TỪ-REPO: scripts/lo-trinh.mjs]` |
| S2 | Trần «Kế tiếp» và tuổi hàng **đếm cả hàng đã giao** | crm có 42 hàng đã giao ngoài mốc → trần vỡ ngay lượt đầu | số đo §2 G1 |
| S3 | **Tuổi hàng** chưa định nghĩa; đánh lại mã làm đồng hồ về 0 | V0–V8 → DA0–DA8 ở crm: mọi hàng «mới» lại | `[NGÀNH: actions/stale]` (đụng thì đặt lại) + số đo §7 |
| S4 | **«Mốc khép»** chưa định nghĩa máy đọc | Không biết khi nào rà soát; mốc ngoài / hạn của người có kích hoạt không | phản biện luật kit §7 |
| S5 | Tự áp **không báo trước, không miễn trừ, không trần thao tác** | Một lượt có thể dời hàng loạt hàng; không có cách giữ hàng ghim | `[NGÀNH: actions/stale]`, `[NGÀNH: Linear]` |
| S6 | **Chân trời không được rà soát** | Kit đã có 18 mục; phình y như «Kế tiếp» | `[NGÀNH: Shape Up]` |
| S7 | **Hai luật cùng khớp mà ngược nhau** (trần đòi đẩy ra, tuổi còn trẻ) | Không có luật ưu tiên → máy tự chọn | trục C |

| S8 | **Chính sách chiến dịch chốt ở đâu** — B′ ghi «Cổng Đáng», nhưng Cổng Đáng là của MỘT vòng, còn chiến dịch trải nhiều vòng | Vòng thứ hai của cùng mốc không biết chính sách nào đang áp | dò chu kỳ 14/10 |

Nghiệm cho S8 (lần chu kỳ 14/10): chốt ở **khoảnh khắc mở chiến dịch đã có** — thẻ khởi tạo đợt của `dieu-phoi`
(«phiên giám sát làm, sau khi owner duyệt thẻ khởi tạo», `dieu-phoi/README.md`); kho không chạy `dieu-phoi` thì ở
Cổng Đáng của vòng ĐẦU TIÊN thuộc mốc, ghi vào mốc để các vòng sau đọc. 0 lượt gọi thêm.

**Core — thêm vào phạm vi B′** (4 / 14 ô có nghĩa ≈ đúng trần ~20 % khi gộp):
1. **Phép đếm đúng (S2 + S3):** trần và tuổi chỉ tính hàng chưa giao, chưa có hồ sơ; tuổi = ngày từ lần cuối hàng
   được chạm (commit sửa hàng · hồ sơ mở · tín hiệu nối); so hàng qua các lần đánh mã bằng câu giao.
2. **«Mốc khép» máy đọc được (S4):** ngày mốc đã qua hoặc mọi hàng của mốc đã giao; chỉ mốc chiến dịch / phát hành —
   mốc ngoài và hạn của người không kích hoạt rà soát.
3. **Hàng có hồ sơ đóng khác (S1):** đề xuất theo hồ sơ — bác → `da_bac`, xếp lại → chân trời; vẫn cấm đụng hàng có
   hồ sơ đang mở.
4. **An toàn của tự áp (S5):** báo trước một nhịp (lượt rà soát này cắm cờ, lượt sau mới áp nếu không ai đụng) ·
   miễn trừ theo hàng (khoá ghim) · trần số thao tác mỗi lượt.

**Later:** rà soát chân trời theo `mo_lai_khi` (S6) · luật ưu tiên khi hai luật ngược nhau — mặc định chọn lối
nhẹ nhất: giữ < dời < chân trời < bác (S7) · trần theo từng lộ trình khi kho có nhiều lộ trình · máy nào được tự áp
khi ba máy cùng chạy (tạm: chỉ phiên đóng mốc) · cờ mâu thuẫn «hồ sơ đang mở trỏ hàng đã bác / chân trời»
`[GIẢ ĐỊNH: chưa kiểm cờ hiện có]` · tín hiệu mới làm căn cứ.

**Never:** tự áp trên hàng có hồ sơ đang mở — đụng việc đang làm · tự chấm điểm ưu tiên (RICE/WSJF) — glossary
_Avoid_ · xoá hẳn hàng khỏi tệp thay vì `da_bac` — lối ra phải để vết · rà soát mốc ngoài và hạn của người — máy
không chứng được việc của người.

**Cross-cutting cho mọi ô Core:** sổ quyết định cho mỗi lần tự áp · cửa veto và hoàn tác · kho chép bản cũ gặp
khoá chính sách lạ → bộ đọc khoan dung + cờ vàng · giữ thứ tự mảng (hàng kế = hàng đầu tiên) · ca đo hai chiều.

**Kết luận độ phủ:** B′ đúng ở đường chính nhưng **chưa đủ để tự áp an toàn** — bốn ô Core trên là điều kiện để
bật phần «máy tự áp»; thiếu chúng thì B′ chỉ nên chạy chế độ cờ vàng.

## 9. Tên «Chân trời» cho người đọc

«Chân trời» là ẩn dụ — người đọc phải dịch ngược ra «thứ chưa làm, đang chờ». Khuyến nghị **«Chờ điều kiện»**: nói
đúng điều làm nó khác hàng — mỗi mục có `mo_lai_khi`, mở lại khi điều kiện tới. Bốn chỗ đứng đọc liền một mạch:
**Trong mốc · Kế tiếp · Chờ điều kiện · Đã bác**. Đã cân: «Để sau» / «sau này» — glossary đang cấm vì nghe như
không lý do · «Tạm gác» — trùng nghĩa với quyết định xếp lại (`park`) · «Chưa tới lượt» — gợi có hàng đợi xếp
hạng, sai. Chỉ đổi chữ cho người: khoá `chan_troi` giữ nguyên (đổi khoá là đổi khuôn). Giá: ~10 thông báo ở
`cat-luot.mjs` / `lo-trinh.mjs`, skill cắt lượt (12 chỗ), khuôn, 13 dòng test, mục glossary; trang lộ trình và ứng
dụng crm không hiển thị chữ này.

## 10. Đề xuất giữa chiến dịch — thợ và điều phối nói gì thì đi đâu

**Hôm nay:** thợ gửi yêu cầu theo khuôn của gói `dieu-phoi` (`{phien, loai, hang, noi_dung, luc}`); hai loại
mang việc mới — `viec-phu` (việc phụ) và `hang-moi` (việc mới mở từ một cổng) — đều trả `can_phan`
(`dieu-phoi/scripts/yeu-cau.mjs`: «việc phụ mới», «loại … cần phán»). Tức là MỌI ý mới giữa chừng dừng lại chờ
giám sát phán, và có thể leo lên người. Cùng khuôn đó đã là khuôn **tín hiệu** của cửa tín hiệu (glossary
«Tín hiệu»: «phiên thợ phát sinh việc giữa lúc làm»), nên đường vào lộ trình đã có sẵn — chỉ thiếu luật phân loại.

**B′ — luật phân loại theo nguồn căn cứ, máy giữ:**

| Thợ / điều phối nói | Đi đâu | Ai xử | Lộ trình đổi lúc nào |
|---|---|---|---|
| Sai hợp đồng của chính vòng đang chạy | Sửa trong vòng | Thợ | Không đổi |
| Hệ thống chết | Thử lại một lần | Máy | Không đổi |
| Giới hạn đo / giới hạn hệ thống | Nhãn trên thẻ ở cổng đã có | Người, ở cổng đã có | Không đổi |
| **Chặn** việc đang chạy (thiếu phụ thuộc) | `can_phan` như nay | Giám sát; người chỉ khi khó-đảo | Ngay — ngoại lệ duy nhất của đóng băng, có sổ |
| Ý mới · việc phụ không chặn · hàng mới | **Cửa tín hiệu**, trả thợ «đã ghi, xử ở mốc khép» | Không ai giữa chừng | Ở mốc khép: gom → cắt lượt → «Kế tiếp» hoặc «Chờ điều kiện» |

Hệ quả: giữa chiến dịch, đề xuất **không vào thẳng lộ trình** và không đẻ lượt phán; lộ trình chỉ đổi ở ranh
giới mốc hoặc khi bị chặn. Đổi chạm `yeu-cau.mjs` của gói `dieu-phoi` — vùng máy M5. **Chưa đo** được tần suất
`viec-phu` / `hang-moi` trên máy này (nhật ký yêu cầu của đợt không nằm trong git crm) — mốc nền cần lấy từ máy
chạy đợt trước khi tuyên số lượt giảm.

**Cắt lượt dưới đóng băng.** Cắt lượt vẫn chạy bất cứ khi nào một bản phạm vi tới (skill `cat-luot` ở lõi,
người gộp PR là người chốt), nhưng giữa chiến dịch chỉ ghi vào «Kế tiếp», «Chờ điều kiện» và mốc ngoài — KHÔNG gắn
hàng vào mốc đang chạy (bước 3 luật 5 của skill hôm nay cho phép gắn mốc). Gắn vào mốc đang chạy chỉ khi mốc
khép (sang mốc kế) hoặc khi việc đang chạy bị chặn. Răng: cờ của `cat-luot.mjs --co` cho hàng mới trỏ mốc đang
chạy — dựng cùng vòng B′.

## 11. Bề mặt cho người — lệnh và hàm

Nguyên tắc: người **trả lời trên thẻ** ở các khoảnh khắc đã có; lệnh chỉ cho ba việc không gắn với thẻ nào —
nhìn, ghim, trả lại. Tên theo dáng của `dieu-phoi` (`mo-dot`, `xem`, `tiep-tuc`): tiếng Việt không dấu, gạch nối.

| Lệnh | Việc | Khoá model-invocation (ADR 0002) |
|---|---|---|
| `/road-map:xem` | Bản đồ xong · đang dở · kế, cờ vàng, các lần tự áp đang báo trước | Mở (chỉ đọc) |
| `/road-map:ghim <mã>` · `bo-ghim` | Miễn trừ một hàng khỏi tự áp | **Khoá** — quyết của người |
| `/road-map:tra-lai <mã>` | Veto một lần tự áp: hoàn tác + ghi sổ | **Khoá** |
| `/road-map:gui <nội dung>` | Người gửi một ý vào cửa tín hiệu, cùng khuôn với thợ | Mở |

Không phải lệnh — trả lời trên thẻ đã có: chính sách chiến dịch (thẻ mở đợt) · ba cổng mỗi vòng · Cổng Giá trị ·
`observed`. Lệnh giữ nguyên: `/acceptance-gate:start`, `/feature-loop:feature-loop <mã hàng>`, `/dieu-phoi:mo-dot`.

Hàm máy giữ (người không gọi): đã có — `phanTichKho`, `suyTrangThai`, `loTrinhThe`, `dungCoHoi`, `tenChienDich` (MC1);
B′ thêm — `raSoat` (đề xuất kèm căn cứ), `docChinhSach` (đọc chính sách từ mốc), `apChinhSach` (báo trước một
nhịp, áp trong trần, ghi sổ), `ghiLoTrinh` (dời hàng, giữ định dạng · thứ tự · khoá lạ); phía `dieu-phoi` —
`chuyenVaoCua` (yêu cầu không chặn → tệp tín hiệu).

**Hai ràng buộc khi dựng:** (i) lệnh gọi **bản chép trong kho** (`scripts/lo-trinh.mjs` của kho), không gọi
`resolve-plugin` — để bộ ghi luôn cùng phiên bản với bộ đọc CI (P0 kỹ thuật §7); (ii) thêm `ghim`, `bo-ghim`,
`tra-lai` vào danh sách khoá là CỘNG — sửa ADR 0002 và danh sách khoá của P32 trong cùng PR. **Đánh đổi mở:**
hai lệnh khoá là lý do đầu tiên để dựng vỏ gói `road-map` sớm hơn nấc 4 (chỉ lệnh, mã vẫn ở lõi) — đặt lệnh ở
lõi rồi dời sau là đổi tên một bề mặt người đã quen. Quyết ở Cổng Phạm vi của vòng.

Liên quan: [ADR 0025](../adr/0025-lo-trinh-rang-buoc-theo-bac-thang.md) ·
[hạt giống hiện trạng](../plans/2026-10-14-hat-giong-hien-trang-sau-doi-tai-khoan.md) ·
[toàn trình playbook vs kit](2026-09-07-toan-trinh-playbook-vs-kit.md) (R4, R5).
