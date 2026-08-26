# Đề bài đợt 3 — nghiệm trên vật thật, đo M1/M2, rồi mới bàn chip mới

*Đề bài do máy soạn 16/08 theo lệnh owner «Mở đợt 3». Là bước cuối của bản neo
[2026-08-12-nguoi-ve-bien-may-di-truoc.md](2026-08-12-nguoi-ve-bien-may-di-truoc.md)
§3 «Đợt 3». Tổng kết điều kiện vào:
[findings 16/08](../findings/2026-08-16-tong-ket-ngay-cat-khuon-va-cong-chan-nham-cho.md).*

Hình đi kèm (chiếu của tài liệu này, không phải nguồn):
[`assets/2026-08-16-dot3-lo-trinh.html`](assets/2026-08-16-dot3-lo-trinh.html).

## 0. Đợt 3 đo cái gì — nói một câu

Ba đợt trước lắp cơ chế; đợt 3 **không lắp gì thêm** — chỉ chạy luật mới trên
việc thật ở repo tiêu thụ và trả lời hai câu bằng số:

- **M1** — một vòng T2 xanh-sạch gọi owner **mấy lần**? Đích: **1** (nói đề bài)
  và **0** chặn cuối. Trước đợt 2: 4–5. Chưa từng đo trên vòng T2 thật.
- **M2** — chữ ký **xuất hiện ở đâu**? Đích: chỉ nơi có đánh-đổi (UNCERTAIN ·
  known-limits · bypass · vượt trần) hoặc khó-đảo. Không còn ở vòng xanh-sạch.

Kèm một câu phụ, dùng dao trace: cổng nào đã mở mà câu trả lời hợp lý duy
nhất là «ừ» — đó là trạm thu phí, ghi sổ để cắt ở đợt sau.

## 1. Bước 0 — bắt buộc trước khi đo: phát hành 2.1.0

Repo tiêu thụ đang chạy plugin **2.0.0** — bản không có gì của 16/08 (tin mời
cổng không form · làn V qua biên merge · chữ ký không nghi lễ · luật hình).
Chạy hai feature thật trên bản đó là đo luật cũ.

**Hồ sơ `release-2-1-0`** theo đúng khuôn `release-2-0-0` (T2; manifest ×2 ·
dòng «Khớp phiên bản» GUIDE · bốn suite với số ca ĐỌC TỪ chính suite · diff
allowlist đóng · hành trình làn V trên vật thật). Điểm khác biệt duy nhất, và
cũng là **phép đo thật đầu tiên của đợt 3**:

> Hồ sơ release là T2 xanh-sạch không có gì để owner quyết. Sau #59, nó phải đi
> **trọn làn V qua biên merge với 0 lượt gọi owner** — hook cho qua, lưới
> NOTE, PR mở, owner chỉ bấm merge. Nếu nó cần bất kỳ lượt nào khác, đó là
> M1 = 2 và là lỗi phải sửa TRƯỚC khi đo tiếp trên repo tiêu thụ.

Sau merge: cập nhật plugin ở repo tiêu thụ bằng **uninstall + install** (quirk
«đã mới nhất là nói dối» — plugin update so số, không so nội dung), mở phiên
mới để hook 2.1.0 nạp, và **gỡ hai khoá chữ ký cũ** nếu config còn (lưới sẽ
nhắc một dòng; repo artifact-platform hiện không khai — kiểm 16/08).

## 2. Vật đo — hai vòng thật, ai chọn, đo bằng gì

**Ở đâu:** `artifact-platform` (repo tiêu thụ đang sống, đã có ~10 hồ sơ, có
UI thật, có owner làm việc hằng ngày). Không dựng repo nháp — đợt 3 đo *người
thật ở việc thật*, không đo kịch bản.

**Vòng nào:** hai feature **T2** kế tiếp mà owner vốn định làm — kit không chọn
đề bài; owner làm việc như bình thường. Điều kiện duy nhất: cả hai đi qua
`/feature-loop` từ S0 tới merge, không thao tác tay ngoài luồng.

**Đo bằng gì — không thêm cơ chế:**

| Số | Nguồn có sẵn | Cách đọc |
|---|---|---|
| M1 — lượt gọi owner | `decisions.jsonl` (entry `seal` · `descope`/`fix` do owner phát ngôn) + transcript phiên (mỗi lượt owner gõ giữa S0 và merge) | đếm lượt owner phải trả lời để vòng đi tiếp; «nói đề bài» tính là 1; merge PR **không tính** (là hành động, không phải câu hỏi) |
| M2 — chữ ký ở đâu | pre-merge log: NOTE «xanh-sạch — KHÔNG mời ký» vs NOTE «chữ ký mới trong diff» + lý do (UNCERTAIN / Known limits / Ngoài hợp đồng / khó-đảo) | chữ ký có → phải chỉ được một lý do đánh-đổi hoặc khó-đảo trong hồ sơ; không chỉ được → ghi sổ vàng «trạm thu phí» |
| Trạm thu phí | mọi câu hỏi máy đặt cho owner | với từng câu: «có ngả trả lời nào khác ‹ừ› mà hợp lý không?» — không có ⇒ ghi sổ |
| Vấp S4-sót | vòng verify | lỗi thật lọt qua S4 mà owner/UAT bắt được sau ⇒ ghi sổ theo lớp |

Sổ ghi ở `docs/research/so-vap-trien-khai.md` (sổ vấp sẵn có) — mỗi vòng một
mục, viết ngay khi vòng đóng, cùng lượt với retro.

## 3. Retro bằng dao trace — sau vòng thứ hai

Với TỪNG lượt owner bị gọi trong hai vòng: nó trace về nguyên tố nào (ý định ·
bằng chứng · khoảnh khắc quyết)? Không trace được ⇒ hình thức ⇒ ứng viên cắt.
Với TỪNG chữ ký: có đánh-đổi/khó-đảo thật không? Không ⇒ trạm thu phí.

Kết quả retro là **một bảng** (lượt · nguyên tố · giữ/cắt) + **một số** cho M1
và **một dòng** cho M2 — không phải một tài liệu dài. Kèm một hình tầng-2 nếu
bảng vượt ngưỡng N5.

## 4. Điều kiện ra — khi nào đợt 3 «xong»

- Hai vòng T2 thật đóng, cả hai qua biên merge.
- **M1 ≤ 1 + 0 chặn cuối** ở ít nhất một vòng, và vòng kia không quá 2 với lý
  do trace được. Không đạt ⇒ đợt 3 sinh đúng MỘT hồ sơ sửa cái chặn (không
  phải chip), rồi đo lại vòng thứ ba.
- **M2**: mọi chữ ký xuất hiện đều chỉ được lý do đánh-đổi/khó-đảo.
- 0 vấp S4-sót ở cả hai vòng (nếp pilot 13/08).
- Retro dao trace đã ghi; sổ vấp có hai mục mới.

Chỉ **sau** đó mới mở lại hàng đợi: hạt giống «ô nuốt luật» (U1+U3, PR #56 chờ
Cổng 0) · hàng đợi reflect + 2.1 · dây chip ④–⑦ (đang xếp kho theo veto-default).

## 5. KHÔNG làm trong đợt 3

- Không thêm cơ chế, không thêm luật, không thêm khoá config (M5 giữ = 1).
- Không dựng repo nháp để «đo cho nhanh» — vật đo là người thật.
- Không tự chỉnh branch protection của repo tiêu thụ.
- Không mở chip mới trước khi có số M1/M2.
- Không sửa engine giữa hai vòng đo (đổi engine dưới chân vòng đang chạy).

## 6. Việc của owner — đúng ba chỗ

1. **Gật đề bài này** (một chữ) — máy mở hồ sơ `release-2-1-0` ngay, đi làn V.
2. **Bấm merge PR release** khi CI xanh — hành động, không phải câu hỏi.
3. **Làm hai feature thật ở artifact-platform như bình thường** — không cần
   nhớ đợt 3 đang chạy; máy ghi sổ, máy đếm.

Ngoài ba chỗ đó, mọi lượt máy gọi anh trong đợt 3 đều là **dữ liệu M1** — và
đều đáng nghi.

## 7. Sổ quyết định của đề bài

| Quyết định | Căn cứ | Xét lại khi | Đường đảo |
|---|---|---|---|
| Release 2.1.0 đi TRƯỚC, đi làn V | chính sách 7.1 (engine gom về mốc release; không đổi engine dưới chân vòng đang chạy); release T2 xanh-sạch là vật đo M1 đầu tiên | release cần lượt owner ngoài merge | đó là bug M1, sửa trước khi đo tiếp |
| Đo ở artifact-platform, feature do owner chọn | đợt 3 đo người thật ở việc thật; repo nháp đo kịch bản | artifact-platform không có T2 nào trong 2 tuần | mở ở floorplanstudio (đã tắt squash) |
| Không thêm cơ chế đo | mọi số đọc được từ sổ quyết định + log lưới + transcript | thiếu số nào không đọc được | thêm một cột vào sổ vấp, không thêm cơ chế |
