---
schema_version: 1
slug: phan-du-bo-cuc-moi
feature: «Bộ kiểm và phần sản phẩm còn bám bố cục phẳng chạy xanh ở cả bố cục hôm nay lẫn bố cục plugins/<tên>/ với tên plugin mới»
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build               # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: manh
decided_at: 2026-11-15T01:36:00Z   # chủ kho gõ «làm · K3 lối a · neo như ô · ngưỡng như ô» trong phiên vòng, máy ghi hộ
prototype:
  base_commit:
  disposition:
---

> Mở 15/11/2026. Chủ kho gọi tên vòng cùng ngày ở phiên giữ đợt «chuyển nhà»: «Mở sau khi gộp», rồi «Mở ngay» sau khi
> PR #503 (vòng gọi chéo) gộp `644e9b49`. Thay đổi đi theo mốc 3.0: **không cắt số, không gắn thẻ** ở vòng này.

## Vấn đề & ai gặp

Gốc: kit/_acceptance/goi-cheo-loi-dieu-phoi/ — vòng liền trước, cùng lớp «chỉ gãy khi đổi nhà»; hợp đồng của nó ghi ở
«Out of scope»: «Không đổi đường dẫn trong `tests/` cho bố cục mới». Phần để lại ấy là vòng này. Số đo: vòng B2 của kho
kế nhiệm (`~/dev/delivery-loop`, hồ sơ `bo-kiem-xanh-o-kho-moi`, `migration/viec-kho-cu-b2.md` §2 và §4).

Kịch bản chuyển nhà dời sáu plugin vào `plugins/<tên>/`, đổi tên cơ học, rồi đổi đường dẫn trong bộ kiểm bằng luật chung
cộng một bảng vá theo tệp. Sau năm lượt đổi cơ học (đo 15/11 trên `593e6837`), cây mới còn thiếu **598 / 5 552** khoá ca:

| Lớp | Khoá | Là gì | Ai gỡ |
|---|---|---|---|
| A | 185 | lõi gọi chéo sang điều phối, hằng tên plugin | vòng gọi chéo (#503, đã gộp — B2 đang đo lại) |
| K | 1 | lỗi của kịch bản | B2 (đã gỡ) |
| **K2** | 52 | mã và tài liệu sản phẩm còn ghi đường theo gốc kho phẳng | **vòng này** |
| **K3** | 20 | ca kiểm đọc hay chạy nội dung của hồ sơ `_acceptance/` ĐÃ KÝ mang đường cũ | **câu hỏi ở Cổng Đáng** |
| **K4** | 340 | ~55 tệp kiểm dùng MỘT hằng hay hàm đường cho cả cây hiện tại lẫn bản `git archive`/`git show` của commit lịch sử | **vòng này** |

412 khoá (K2 + K3 + K4) không gỡ được từ kho mới: luật đợt chỉ cho sửa sản phẩm — kể cả `tests/` — ở kho này.

**Quét lại 15/11 trên `644e9b49` (đã có #503), khác danh sách B2 ở ba chỗ:**
- K1 (ca RT13 đòi mọi chỗ lệch nằm trong danh sách đóng) **đã được #503 sửa** (AC-11: phép so chỉ xét hồ sơ có ở mốc).
  Bốn khoá «K1» còn lại trong bảng B2 (RT13, RT18) đỏ vì lý do của K3: ca đọc `evals.yaml` và hai khối khai trong hợp
  đồng đã ký `ra-co-ten-lam-va-trao`, các khối ấy ghi đường cũ.
- K2a (`carry-plan.mjs` đoán gốc lõi, 24 khoá + P164) **đã được #503 phủ** qua `gocLoiTuHost` (đọc mã; chờ số đo lại
  của B2 xác nhận). K2b có NĂM khối site, không phải bốn: thêm `GATE-END-TURN-SITES`, khối duy nhất mang đường tệp lệnh
  đã đổi tên.
- K4 rộng hơn danh sách: 116 tệp dưới `tests/` gọi `git archive`/`git show`. Bảng vá của B2 (316 mục, 96 tệp) đang
  gánh phần «đưa lại đường cũ» cho từng tệp; phần còn đỏ là chỗ một chuỗi phải đúng cho hai bố cục cùng lúc.
- Bốn khảo sát chỉ-đọc 15/11 thấy thêm **11 chỗ XANH GIẢ** sau luật chung — ca vẫn in PASS ở bố cục mới mà thôi đo điều
  nó hứa (JR11a, CC-02, KK-4, giu-tuoi, NT13, LT-12…); không đỏ nên không nằm trong 598 khoá. 7 trong số đó gốc ở luật
  đổi của kịch bản (đã chuyển B2), 4 gốc ở tệp kiểm kho này.

**Số khoá ở bảng trên là số đo của B2 trên `593e6837`.** Đo lại sau #503 (B2 lượt 6, cây cũ `644e9b49` 5 556 khoá,
cây kịch bản `8d797a91`; nhánh B2 `ee5dcff8`, `migration/viec-kho-cu-b2.md` §4.1, `ket-qua/phan-du-luot-6.tsv`):
**thiếu 468**. A 185 → 87 (B2 đang phân loại; phần là mã sản phẩm sẽ vào K2) · K2 52 → 27 (`moi-cong-khong-qua-nut` 17,
bộ plugins 7, JI12 3; `carry-plan` về đủ 24 — xác nhận bằng đo) · K3 + K1 20 → 20 · K4 340 → 334 · `LT-94`, `LT-94-do`
đỏ theo lịch ở cả hai cây, ngoài mọi lớp.

**Lượt đo cuối của B2** (nhánh `c87ff183`, cây kịch bản `ff5e5b5d` so `644e9b49`, `migration/viec-kho-cu-b2.md` §4.2,
`ket-qua/phan-du-cuoi.tsv`): **thiếu 415 / 5 556**. K4 324 (gồm NT13, đỏ thật sau khi B2 gỡ xanh giả loại (i)) + 32 ca
A đổi nghĩa (mảng thư mục dùng chung cho bản lịch sử và bản sao 18 · bản sao thiếu `.claude-plugin` của gói lõi 12 ·
CN-2 ×2) · K2 27 · K3 16 + K1 4 (RT13 đọc khối khai đường của hồ sơ đã ký — thực chất lớp K3) · **mã sản phẩm #503 chưa
phủ 4**: `lib/chan-lo-trinh.cjs` `khoaBat()` (CK-4-lib), nhánh dự phòng `scripts/lo-trinh-khoi-tao.mjs` viết cứng
`roadmap@delivery-loop` (KM-1-do3), `_acceptance/cua-tin-hieu-gom-nhom/rang/cham-bo-vang.mjs:42` (TH-10-ong, TH-10-do)
· 6 khoá cặp tệp tự về theo ca bên trong · 2 khoá cơ học của B2 (KM-1, CT-10-do), không thuộc vòng này. Hai mục đầu của
nhóm mã sản phẩm trùng vùng hai giới hạn đã biết của vòng gọi chéo — đề nghị gom ở Cổng Phạm vi. Mục vá nào của B2 mà
vòng này làm thừa phải gỡ khỏi bảng vá của B2 cùng bước, nếu không kịch bản dừng ở bước 6.

**Gốc rễ của K4 (và phần lớn K3):** một đường dẫn chỉ có nghĩa **tại một cây**. Bộ kiểm viết `'scripts/x.mjs'` rồi dùng
nó cho cây đang đứng, cho bản bung của commit lịch sử, cho bản sao theo bố cục gốc plugin, và cho đường ghi trong hồ sơ
đã ký. Hôm nay bốn thứ ấy trùng bố cục nên không ai thấy. Sau ngày cắt sang, commit lịch sử và hồ sơ đã ký mãi mãi ở bố
cục cũ — đây không phải nợ tạm của đợt chuyển nhà.

**Ai trả giá:**
- **Phiên B2 và chủ kho ở Cổng Bằng chứng của B2.** B2 đang CHỜ kho cũ; không có vòng này thì B2 chỉ còn lối «bỏ 412
  khoá có lý do» (7,4 % túi khoá), gồm trọn bộ ca lộ trình so với bản trước vòng.
- **Mọi lượt chấm ở kho mới.** Ca đỏ trong `suite_keys` làm mọi vòng ở kho mới REJECT từ lượt một.
- **Mốc 3.0 (hạn đợt 04/12/2026).** B3 cắt mốc sau B2.

**Cân trên mọi kho** (luật «sửa kit vì sự cố của một kho phải cân trên mọi kho»):

| Kho | Được gì | Mất gì | Hành vi cũ có ai dựa |
|---|---|---|---|
| Kho tiêu thụ (bố cục cũ hay mới) | — | Không gì: K2 đổi cách GHI danh sách chỗ trong tài liệu luật và bộ đọc của nó; K4 chỉ đổi `tests/` (không phát hành tới kho tiêu thụ) | Có, với lối (a) của K3: bộ giải `verifier:` của lưới trước gộp thêm một ứng viên — chỉ khớp ở kho có tệp khai chợ ở gốc (kho kit) |
| Kho kit hôm nay | Ca so-với-bản-trước-vòng thôi phụ thuộc bố cục | 55 tệp kiểm đổi cách ghi đường | Bộ kiểm phải xanh nguyên, cùng túi khoá |
| Kho kit sau cắt sang | Bộ kiểm xanh; hồ sơ và commit cũ vẫn đọc được | Bảng vá theo tệp của B2 phải bỏ các mục của những tệp vòng này chạm | — |

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Một bộ dịch đường trong `tests/` (nhận đường viết theo bố cục nào cũng được, trả đường đúng với cây được hỏi) gỡ được lớp K4 mà không phải sửa từng ca theo kiểu riêng | Phải sửa tay từng tệp theo hình dạng riêng — cỡ vòng tăng nhiều lần | Áp lên ba tệp lớn nhất (`lo-trinh`, `doc-jsx-va-ban-do-hong`, `khoi-khuon-tren-the-cong`) rồi chạy ở hai bố cục | Chưa thử |
| 2 | Luật chung bước 6 của kịch bản, chép vào răng của hồ sơ, đại diện được phép đổi thật | Thước ở kho này xanh mà cây thật vẫn đỏ | Đo chéo cuối vòng trên bản kéo TẠM của `delivery-loop` | Chưa thử |
| 3 | Tệp vòng này chạm tự đứng được ở bố cục mới chỉ với luật chung, không cần mục vá theo tệp | B2 phải soạn lại mục vá cho từng tệp đã chạm | Chạy tệp trong kho dựng bằng luật chung, không bảng vá | Chưa thử |
| 4 | Bộ kiểm hôm nay phủ đủ hành vi cũ của các tệp kiểm sẽ sửa | Sửa ca làm mất chiều đỏ của ca mà vẫn xanh | So túi khoá trước ↔ sau ở bố cục cũ + chiều đỏ trên bộ dịch | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: sau vòng này, cây dựng lại từ nhánh chính còn thiếu bao nhiêu khoá ca thuộc các lớp vòng nhận?
- Kết quả nào là SỐNG: lượt đo giữ-khoá của B2 trên cây dựng lại từ nhánh chính sau gộp thiếu 0 khoá ở các nhóm vòng này nhận (không tính khoá chủ kho cho rời vòng ở Cổng Phạm vi).
- Kết quả nào là CHẾT: ở bố cục hôm nay một ca từng xanh hoá đỏ, hoặc biến khỏi túi khoá, hoặc một chiều đỏ có sẵn thôi đỏ — gặp là gỡ bản sửa của tệp ấy.
- Timebox: gộp trước lượt đo lại của B2 cho Cổng Bằng chứng của nó; hạn đợt 04/12/2026.

## Kết quả prototype

Không dựng. Lớp lỗi đã đo bằng năm lượt của B2 (bảng trên) và quét mã 15/11 trên `644e9b49`.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Danh sách việc kho cũ của B2 | `~/dev/delivery-loop` nhánh B2: `migration/viec-kho-cu-b2.md`, `migration/kich-ban/ket-qua/phan-du-luot-5.tsv`, `ket-qua/va-luot-4/*.md` | danh sách khoá thiếu + căn cứ từng ca (đo trên `593e6837`) | có, làm đầu vào; quét lại theo lớp ở `644e9b49` | — |
| Kịch bản chuyển nhà | `migration/kich-ban/{don-nha.mjs,bang-xep.json}` | ràng-buộc nền (luật chung bước 6, bảng xếp) | có, chỉ đọc — không sửa kho mới; phần chép vào răng ghi rõ mã commit | — |
| Bộ dựng bố cục mới + bảng tên | `_acceptance/goi-cheo-loi-dieu-phoi/rang/`, `lib/ho-goi.cjs` | vật của vòng trước | có, dùng lại — không dựng bộ giải thứ hai | — |

## Cổng 0

- **decision = build** Chủ kho quyết 15/11 trong phiên vòng: «làm · K3 lối a · neo như ô · ngưỡng như ô».
- **disposition = …** Không áp dụng (không dựng prototype).
- **Ngưỡng UAT chốt cùng lúc ký:** «ngưỡng như ô» — ba dòng SỐNG, CHẾT, timebox ở mục Ngưỡng.
- **Neo (máy chọn, chủ kho giữ «như ô»):** `_acceptance/goi-cheo-loi-dieu-phoi/` — hồ sơ của kho này, đã ký, và chính «Out of scope» của nó
  để lại việc này. Lối khác: `_acceptance/mc11-ten-kho/` (cũng lớp «chỉ gãy khi đổi nhà», nhưng không nêu bộ kiểm).
- **Chính sách K3 — hồ sơ đã ký mang đường cũ — chủ kho chọn (a) 15/11:**

  | Lối | Làm gì | Được | Mất |
  |---|---|---|---|
  | **(a) bên ĐỌC dịch đường cũ** — máy khuyên; phiên giữ đợt cũng nghiêng về lối này | Không đổi byte nào của hồ sơ đã ký. (1) Ca kiểm tự dịch đường khi đọc phạm vi, khối khai và `paths` từ hồ sơ đã ký — P169, LM5, LM8b, RT13, RT18. (2) Bộ giải `verifier:` của bộ kiểm lại bằng chứng (`scripts/recheck-evidence.cjs`) thêm ứng viên «gốc gói lõi» khi đường không có ở gốc kho — cứu JR11b, DV4a, L05 (11 báo cáo đã ký trỏ `scripts/product-map.mjs` / `scripts/evidence-page.js`). (3) `cua-veto-sau-chu-ky/fixture.mjs` dùng hằng gốc kho bên trong nên truyền gốc lõi chỉ cứu 2/4 ca — ca thường trực dùng một bản đặt ở `tests/` (bản trong hồ sơ giữ nguyên làm sử liệu); `stop-patching-law/make-record.mjs` thì ca rút đích từ hằng của nó rồi dịch | 20 khoá về ngay ở vòng này. Hồ sơ cũ đọc được ở kho mới mà không ghim lại. Đúng «đường đọc-cũ» mà luật kit đòi khi đổi khuôn | Vòng lên hạng T3 (`scripts/recheck-evidence.cjs` là đường T3) → thêm một cổng duyệt kế hoạch. Một đường đọc-cũ phải nuôi. KHÔNG làm cho lệnh eval của hồ sơ cũ chạy lại được ở kho mới — ghim lại hồ sơ cũ ở kho mới vẫn là câu hỏi riêng của đợt |
  | (b) kịch bản viết lại hồ sơ rồi ghim lại | Việc của kho mới: kịch bản đổi đường trong hồ sơ đã ký, ghim lại một lượt | Hồ sơ cũ khớp bố cục mới, kể cả lệnh eval | K3 rời vòng này (báo lại phiên giữ đợt). Sửa lịch sử đã ký của ≥ 12 hồ sơ; một lượt ghim lại dài ở kho mới; mã răng cục bộ trong hồ sơ viết theo đường cũ khó đổi cơ học cho hết |
  | (c) bỏ 20 khoá, có lý do | Khai ở Cổng Bằng chứng của B2 | Rẻ nhất hôm nay | K3 rời vòng này. Chín ca ấy vẫn ĐỎ ở kho mới và làm mọi lượt chấm REJECT, nên vẫn phải tắt hay sửa ca — tức vẫn là một việc sửa `tests/`; mất ba ca canh kho hồ sơ thật (JR11b, DV4a, L05) |

## Thước đo thành công → ứng viên criterion

- Bố cục hôm nay: bộ kiểm của kho xanh trọn; túi khoá của mỗi tệp kiểm đã chạm không mất khoá nào.
- Bố cục mới: kho dựng bằng mã (bước 1–3 + luật chung bước 6 của kịch bản, không bảng vá) — mỗi tệp kiểm đã chạm chạy
  ở đó giữ đủ khoá; gỡ bộ dịch đường thì ca đỏ với thông điệp ghim.
- Sản phẩm (K2): danh sách chỗ trong tài liệu luật giải được ở cả hai bố cục; `permissions.allow` rút từ `suite_keys`.
- Đo chéo cuối vòng trên bản kéo tạm của `delivery-loop`, chạy tay, ghi vào hồ sơ.

## Out of scope từ khám phá

- Không sửa gì ở `~/dev/delivery-loop` (kịch bản, bảng vá, thước giữ-khoá — việc của B2).
- Không làm cho lệnh eval của hồ sơ đã ký chạy lại được ở kho mới (ghim lại hồ sơ cũ sau cắt sang — câu hỏi của đợt).
- Không cắt số, không gắn thẻ; không chép lại lớp CI ở kho tiêu thụ.
