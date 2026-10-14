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

Liên quan: [ADR 0025](../adr/0025-lo-trinh-rang-buoc-theo-bac-thang.md) ·
[hạt giống hiện trạng](../plans/2026-10-14-hat-giong-hien-trang-sau-doi-tai-khoan.md) ·
[toàn trình playbook vs kit](2026-09-07-toan-trinh-playbook-vs-kit.md) (R4, R5).
