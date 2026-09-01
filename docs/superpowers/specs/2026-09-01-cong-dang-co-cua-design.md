# Cổng Đáng có cửa — làn thẻ thứ ba + chốt biết phân biệt

Ngày 2026-09-01 · slug `cong-dang-co-cua` · hạng T2
Ô cơ hội đã ký «làm» 01/09 (`eb4c8b20`). Nguồn đề bài:
[`_acceptance/cong-dang-co-cua/opportunity.md`](../../../_acceptance/cong-dang-co-cua/opportunity.md).

## 1. Đề bài

Bốn cổng người của kit, ba cổng có nghi thức đứng tên. Cổng Đáng — nơi quyết
«có làm việc này không», quyết định đắt nhất vì nó chốt ý định TRƯỚC khi làm —
chỉ có tám dòng chú thích trong khuôn ô.

Hệ quả đo được ngày 01/09 trên kho tiêu thụ `crm`, bản cài 2.5.0:

- Ô `mot-phien-mot-cay` đã điền ngưỡng. Bộ quét xếp `gate: "dang"`, nhãn «chờ
  chữ ký — Cổng Đáng». Nghi thức vào phiên bàn giao sang bộ dựng thẻ. Bộ dựng
  thẻ thoát mã 2.
- Lời từ chối nói SAI nguyên nhân («hồ sơ chưa có contract.md») và thân lệnh
  ghép ca đó với việc kế «chạy bước chuẩn hoá yêu cầu» — tức bảo người viết
  hợp đồng TRƯỚC Cổng Đáng, ngược đúng thứ tự mà chính nghi thức vào phiên
  viết ra (hợp đồng sinh ở S1, SAU Cổng Đáng).
- Cùng lớp đó chặn NĂM ô ở chính kho kit, kể cả ô xin phép dẹp nó.

**Người trả giá:** owner — mỗi lần đi qua Cổng Đáng phải phát minh lại nghi
thức, nên cùng một việc ba phiên làm ba kiểu và không đường nào để lại cùng
một loại vết.

## 2. Bất biến thật — hai bộ đọc phải đồng ý

Đây là điểm dễ hiểu sai nhất của vòng này, nên nói trước mọi thứ khác.

Con trỏ chết hôm nay KHÔNG phải «thiếu một nhánh `if`». Nó là chỗ **hai bộ đọc
bất đồng**:

| Bộ đọc | Vai | Hôm nay nói gì về ô chờ Cổng Đáng |
|---|---|---|
| `scripts/start-scan.mjs` | quyết định **gửi ai** tới thẻ | «chờ chữ ký — Cổng Đáng», bàn giao sang thẻ |
| `scripts/gate-card.js` | quyết định **vẽ được cho ai** | không vẽ được, thoát mã 2 |

Nên tiêu chí nghiệm thu phải đo **quan hệ giữa hai bộ đọc**, không đo sự có mặt
của một nhánh. Bất biến khai tường minh:

> **B1 (một chiều, bắt buộc):** mọi slug mà bộ quét xếp `gate: "dang"` thì bộ
> dựng thẻ PHẢI vẽ được thẻ Cổng Đáng. Không có ngoại lệ — mỗi ngoại lệ là một
> con trỏ chết.

Chiều ngược lại cố ý KHÔNG đối xứng, và phải khai ra chứ không im lặng:

> **B2:** bộ dựng thẻ CÒN vẽ cho ô «đang cân nhắc» (ngưỡng chưa chốt) — bộ quét
> không xếp nhóm đó vào cổng nên nghi thức vào phiên không gửi tới, nhưng người
> gõ thẳng tên ô thì phải thấy thẻ kèm cờ đỏ «ngưỡng chưa chốt», không phải một
> lời từ chối. Thẻ nói ra thứ còn thiếu rẻ hơn lời từ chối bắt người tự đoán.

Phép đo của B1 là một **đẳng thức chạy trên xưởng dựng bằng code trong chính
lần chạy**: sinh mỗi trạng thái một ô, chạy cả hai bộ đọc, so tập hợp. Không
grep, không đếm nhánh — hai thứ đó xanh được cả khi hai bên đã trôi khỏi nhau.

## 3. Không gian trạng thái (quét Zwicky)

**Chân sản phẩm:** enum điều hướng khai một chỗ ở
`lib/workspace-record.cjs` `NAV_RULES` [SUY-TỪ-REPO] · bảng phân ô ở
`scripts/start-scan.mjs` dòng ~400–432 [SUY-TỪ-REPO] · khuôn ô ở
`skills/acceptance/references/opportunity-template.md` [SUY-TỪ-REPO].

**Chân ngành:** lớp bài toán là *bộ điều phối trên một kiểu tổng phải TOÀN
PHẦN* — nhánh đáy `else` gán bừa một nhãn là lỗi kinh điển của lớp này. Chuẩn
đối chiếu có tên: kiểm tra vét cạn của `match` trong Rust, cảnh báo khớp thiếu
`partial-match` (warning 8) của OCaml [NGÀNH: Rust · OCaml]. Bài học chung: bộ
điều phối phải nêu tên MỌI trạng thái, và trạng thái không xử được phải báo
đúng tên nó — không rơi vào nhánh mặc định mang nhãn của trạng thái khác. Đó
đúng là lỗi hôm nay: ô chờ Cổng Đáng rơi vào nhánh đáy mang nhãn «chưa có hợp
đồng».

### Trục

- **Trục A — vật neo có trên đĩa** [thước CE: `ANCHOR_FILES` +
  `NO-DOSSIER-GUARD-BLOCK` hiện hành]:
  không xưởng | không thư mục hồ sơ | thư mục rỗng | chỉ ô cơ hội | chỉ hợp
  đồng | cả hai
- **Trục B — nấc của ô cơ hội** [thước CE: enum `NAV_RULES['opportunity.md']`]:
  `discovery`+decision rỗng | `decided`+`build|iterate` | `decided`+`park|kill`
  | `archived` | field hỏng/ngoài từ vựng
- **Trục C — nấc ngưỡng** [thước CE: `lib/nguong-o-co-hoi.cjs` `thresholdState`]:
  chưa chốt (`…`) | `[đề xuất]` | đã chốt | khai «Không đo được — »
- **Trục D — vật vòng làm** [thước CE: nhánh tự nhận cổng hiện hành]:
  không có `evidence-report.md` | có

Độc lập: đổi C không ép đổi B (ô `discovery` có thể ở bất kỳ nấc ngưỡng nào);
đổi D không ép đổi A (đã đo: ca GM04 trong lưới thường trực dựng đúng ô có
`evidence-report.md` mà không hợp đồng).

### Lát cắt theo trục A — mỗi ô đúng MỘT lối ra

| # | Trạng thái | Lối ra | Đổi so với hôm nay |
|---|---|---|---|
| 1 | không có `_acceptance/config.yaml` | từ chối «xưởng chưa mở» | giữ nguyên |
| 2 | không có thư mục hồ sơ | từ chối «không có hồ sơ» + liệt tên có thật | giữ nguyên |
| 3 | thư mục rỗng (không hợp đồng, không ô) | từ chối «hồ sơ chưa có contract.md» | giữ nguyên |
| 4 | có ô · `discovery`, decision rỗng · ngưỡng đã chốt / đề xuất | **thẻ Cổng Đáng** | MỚI — hôm nay rơi vào ca 3 |
| 5 | có ô · `discovery`, decision rỗng · ngưỡng chưa chốt | **thẻ Cổng Đáng + cờ đỏ ngưỡng** | MỚI — hôm nay rơi vào ca 3 |
| 6 | có ô · `decided` `build|iterate` · chưa có hợp đồng | từ chối ca 3 (việc kế «chuẩn hoá yêu cầu» = S1, ĐÚNG cho ô này) | giữ nguyên, có chủ đích |
| 7 | có ô · `decided` `park|kill`, hoặc `stage: archived` | **từ chối «ý đã đóng»** | MỚI — ca thứ tư |
| 8 | có ô · field điều hướng hỏng | từ chối «hồ sơ hỏng» nêu tên field | MỚI — hôm nay rơi vào ca 3 |
| 9 | có hợp đồng, chưa có `evidence-report.md` | thẻ Cổng Phạm vi | giữ nguyên |
| 10 | có hợp đồng + `evidence-report.md` | thẻ Cổng Bằng chứng | giữ nguyên |

**Bộ ca từ chối đi từ BA lên NĂM, không phải lên bốn.** Đề bài ban đầu đoán ca
mới là «ô đang chờ Cổng Đáng»; quét xong thì ô đó tan vào LÀN THẺ (ô 4–5) nên
không cần lời từ chối nào. Hai ca thật sự cần lời thuật riêng là:

- **ô 7 — ý đã đóng.** Hôm nay một ý đã `kill` mà bị gõ tên vẫn nhận câu «việc
  kế là chạy bước chuẩn hoá yêu cầu» — kit mời người hồi sinh một ý đã dừng.
- **ô 8 — hồ sơ hỏng.** Ô cơ hội có field điều hướng ngoài từ vựng hôm nay rơi
  vào cùng nhánh đáy. Bộ quét đã nêu tên những ô này ở `broken[]` kèm lý do;
  bộ dựng thẻ im lặng gọi chúng là «chưa có hợp đồng» chính là chỗ hai bộ đọc
  bất đồng lần thứ hai — cùng lớp với bất biến B1, nên sửa cùng vòng.

Ô 6 thì ngược lại: câu việc-kế hiện hành ĐÚNG (hợp đồng sinh ở S1), nên không
tách, và điều đó khai ở Out of scope chứ không im lặng bỏ.

Ô vô nghĩa đã gạch: (chỉ hợp đồng × nấc ô cơ hội) — không có ô thì trục B không
có giá trị nào; (không xưởng × mọi trục còn lại) — ca 1 cắt trước.

### Cắt

- **Core:** ô 4, 5, 7, 8 + bất biến B1/B2 + nghi thức ký.
- **Later:** làm dịu câu chữ ca 3 cho ô 6 (đúng việc-kế, chỉ hơi nhiễu vì liệt
  70 tên hồ sơ) — 1 dòng, chờ có người vấp thật.
- **Never:** lệnh thứ bảy cho Cổng Đáng — ô cơ hội đã loại từ 26/08, hiến pháp
  kit là «chỉ TRỪ, không CỘNG». Never: đổi khuôn ô cơ hội — khuôn đã có bốn lối
  ra và hai tiền tố máy đọc.

## 4. Lời giải — sáu mảnh

Cây ghim `de27babc` (24/08) chứa bản dựng đã qua đo của bốn mảnh đầu, bị CẮT vì
phạm vi (owner cắt đôi vòng `ra-co-ten-lam-va-trao` tại Cổng Bằng chứng: ba mặt
phẳng người trong một vòng là quá rộng để hội tụ). Vòng này lấy lại **bằng
CÂY**, không bằng bản vá — `phan-cong-dang.patch` đã mục 2/4 khối.

**Ràng buộc lắp ráp, phải khai trước:** cây ghim ra đời TRƯỚC chốt thẻ-ma
(`184a3646`, 29/08). Chốt đó nằm ở đầu `scripts/gate-card.js`, chạy TRƯỚC đoạn
tự nhận cổng. Bê nguyên cây ghim về thì chốt chặn trước, làn Cổng Đáng thành
mã chết mà mọi phép đo bề mặt vẫn xanh. Nên hai vết là MỘT vòng.

| Mảnh | Vật | Nội dung |
|---|---|---|
| M1 | `scripts/gate-card.js` | làn thẻ Cổng Đáng: đề bài · ba giả định đầu · ngưỡng (dấu «máy đề xuất» hiện rõ) · bốn lối ra sống · cờ đỏ ngưỡng-chưa-chốt và nguồn-ngoài-chưa-phân-loại |
| M2 | `scripts/gate-card.js` | chốt thẻ-ma học phân biệt: nhánh gate 0 đặt TRƯỚC chốt; chốt thêm ca «ý đã đóng» và ca «hồ sơ hỏng» |
| M3 | `commands/start.md` | bàn giao `dang` → thẻ rồi ký bằng `/acceptance-gate:approve <slug> <lối>` |
| M4 | `commands/approve.md` | chế độ Cổng Đáng: bốn lối ra → bốn giá trị máy, răng chiều đỏ chặn ký «làm» trên thước trang trí, ghi ô + sổ + bản đồ MỘT lượt |
| M5 | `skills/acceptance/references/human-facing-language.md` | ô `g0` trong ngữ pháp câu gộp + dòng chế độ Cổng Đáng |
| M6 | `_acceptance/cong-dang-co-cua/rang.sh` + lưới thường trực | bộ răng |

Máy KHÔNG điền `decision`: thẻ trình đề bài + ngưỡng + bốn lối ra sống, chọn là
phát ngôn của người (ADR 0002).

## 5. Nếp phép đo — chỗ vòng này dễ tự dối nhất

Ba cái bẫy đã có tên trong kho, áp thẳng vào đây:

1. **Đẳng thức phải neo vào BÊN VIẾT, không vào con số.** Bộ răng của hồ sơ
   `khong-ve-the-ma` ghim `SODONG = 3` bằng chữ số. Thêm một ca là nó đỏ —
   đúng lớp «thước ghim vào thứ SẼ ĐỔI». Bộ răng vòng này **rút số ca từ khối
   marker trong `gate-card.js`** rồi so với số lời thuật trong thân lệnh: đẳng
   thức giữa hai bên viết, không phải giữa một bên và một hằng số.
2. **Chiều đỏ phải GỌI thứ nó canh.** Mỗi chân dựng xưởng bằng code trong
   chính lần chạy, chạy CHÍNH `gate-card.js`/`start-scan.mjs` của cây đang
   kiểm, và có đối chứng dương: bản nguyên vẹn phải XANH trước khi tin bản bị
   tiêm là ĐỎ.
3. **Đường dẫn suy từ vị trí script**, không hardcode gốc kho — bài học P150.

Hồ sơ `khong-ve-the-ma` ĐÃ KÝ: vòng này KHÔNG sửa hợp đồng của nó. Bộ răng cũ
(`kvtm_*`) không nằm trong lưới thường trực (`feature_loop.suite_keys`) nên
không làm CI đỏ; ca đẳng-thức-3 của nó được thay bằng ca rút-từ-marker của vòng
này, ghi con trỏ «thay thế» trong Notes của hợp đồng mới.

Lưới thường trực hiện có (ca GM01–GM06 trong `tests/scripts/run-tests.sh`)
**không đỏ** vì thay đổi này: ca GM02 dựng thư mục RỖNG (không ô cơ hội) nên
vẫn rơi đúng ô 3. Đã kiểm bằng cách đọc fixture, không bằng suy đoán.

## 6. Ngoài phạm vi

- Lệnh thứ bảy cho Cổng Đáng.
- Đổi khuôn `opportunity.md`.
- Làm dịu câu chữ ca 3 cho ô 6 (ô đã ký, hợp đồng chưa sinh) — việc-kế hiện
  hành đã đúng; chỉ nhiễu, chưa lệch.
- Lớp dịch tiếng-sản-phẩm (`card-plain.json`) cho thẻ Cổng Đáng: nội dung ô cơ
  hội vốn đã là tiếng sản phẩm do người viết, thêm lớp phủ là dựng nguồn thứ
  hai cho cùng một câu.
- Sửa hợp đồng đã ký của hồ sơ `khong-ve-the-ma`.
