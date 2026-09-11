# Cửa veto sau chữ ký — thiết kế (hồ sơ `cua-veto-sau-chu-ky`, T3)

Owner gọi tên 11/09/2026 («Chạy hai việc kit còn mở»). Đây là lỗ C3 của đợt rà
22/08, đo lại sống 11/09. Hạng T3 vì chạm `scripts/pre-merge-check.sh` (nằm trong
`risk_tiers.t3_paths`).

## 1. Bệnh

Lưới trước-merge báo một hồ sơ **đã được người ký ở Cổng Bằng chứng** là «cửa veto
mở», «owner chưa veto». Câu đó sai: người đã phát ngôn quyết định rồi. Cửa veto là
đường đảo cho việc **máy tự quyết mà người chưa nói gì**. Khi đã có chữ ký thì cửa
đó không còn là chốt đang giữ hồ sơ nữa.

### Số đo 11/09 (máy đo, không đoán)

| Kho | Hồ sơ `veto_state: mo` | Trong đó đã có `human_signoff` | Thật còn mở |
|---|---|---|---|
| kit (cây này, `f1892be7`) | 30 | **27** | 3: `co-qua-timebox-nhom-da-xong` (verified) · `ma-so-quyet-dinh-duy-nhat` (machine-cleared) · `release-2-0-0` (verified) |
| media-library | 3 | **3** | 0 |
| floorplanstudio (cây `kit-2-11-0`) | 1 | **1** | 0 |

Trong kit, dòng NOTE riêng từng hồ sơ «làn V … cửa veto mở» in cho 25 hồ sơ, nhưng
23 hồ sơ trong số đó đã ký. Dòng tổng liệt 30 tên, nhưng 27 tên đã ký. Tức gần chín
phần mười những gì lưới nói về cửa veto là sai. Nếu một dòng sai tới mức đó thì
người đọc học cách bỏ qua nó, và ba hồ sơ còn mở thật chìm theo.

### Gốc ở mã (dẫn dòng tại `f1892be7`)

1. **NOTE riêng từng hồ sơ, khối Cổng 1 làn V** — `scripts/pre-merge-check.sh:766–782`.
   Nhánh `elif [ -n "$_vsig" ] || xanh_sach_check "$_vrep"` (dòng 777) gộp HAI
   trường hợp rất khác nhau vào cùng câu NOTE ở dòng 778:
   - (a) bằng chứng xanh-sạch và chưa ai ký. Đây là cửa veto mở thật.
   - (b) đã có chữ ký người. Người đã quyết, nên câu «cửa veto mở» là sai.

   Vế `[ -n "$_vsig" ]` do hồ sơ `lan-v-khong-phai-cho-ky` thêm vào. Mục đích của nó
   là **đừng chặn** hồ sơ đã ký, và mục đích đó đúng. Chỗ sai là câu NOTE: hai trường
   hợp dùng chung một câu.
2. **Dòng tổng veto-trace** — `scripts/pre-merge-check.sh:1344–1386`. Nhánh `mo)` ở
   dòng 1353–1355 đếm MỌI hồ sơ `veto_state: mo`. Nhánh này không đọc
   `evidence-report.md` lần nào, nên hồ sơ có `approved_by` (bỏ qua khối Cổng 1 ở
   trên) cũng bị đếm, ví dụ `release-2-6-0`, `suite-run-log-provenance` và cả ba hồ
   sơ của media-library. Dòng 1385 in «… mà owner chưa veto: <tên>».
3. **Bộ đọc anh em** — `scripts/start-scan.mjs:122–128, 252–253`. `vetoOpen[]` được
   dựng để hỏi đúng câu lưới hỏi («mọi `veto_state: mo`, bất kể status» — hồ sơ
   `start-bang-dieu-khien` AC-5/AC-6). Thẻ `/start` và `acceptance-status` đọc nó rồi
   in «Còn veto được — <tên>». Hôm nay thẻ lặp lại đúng câu sai của lưới.

**Hệ quả cho repo tiêu thụ:** media-library từng vá tại chỗ (`_vapp`, commit
`15b5593`: chỉ đếm `mo` khi `approved_by` rỗng). Bản vá đó mất hai lần vì chép đè.
Owner đã quyết bản sửa phải nằm trong kit. Vá kiểu `_vapp` cũng chưa đủ: nó vẫn đếm
hồ sơ làn V đã ký, là loại chiếm đa số trong kit.

## 2. Luật

> **Chữ ký người ở Cổng Bằng chứng ĐÓNG cửa veto.** Cửa veto mở ⇔
> `veto_state: mo` **∧** `human_signoff` trong frontmatter dẫn đầu của
> `evidence-report.md` KHÔNG phải một chữ ký thật (rỗng, báo cáo vắng, hoặc khớp bảng
> giữ-chỗ `placeholder_signoff`).

Ba điểm của luật:

- **Căn cứ là QUAN HỆ, không phải nhãn** (cùng tinh thần chú thích ở dòng 764–765).
  `status: signed-off` mà không có chữ ký thì KHÔNG đóng cửa. Nhãn đó là một lời khai
  và các luật khác đã bắt nó.
- **Chữ ký giữ-chỗ không đóng cửa.** Lấy đúng hàm `placeholder_signoff` (dòng 413)
  mà luật chữ ký đã dùng, không dựng bảng thứ hai. Nếu `TBD` được tính là chữ ký thì
  cửa đóng oan, và đó là chiều hỏng nguy hiểm hơn.
- **Luật chỉ đổi LỜI, không đổi CHẶN.** Mọi VIOLATION đang có vẫn nguyên: `da-veto`
  chưa xử · chiều ghi-ngược · làn V hạng T3 · vết giờ hỏng · không sạch mà không ký.
  Mã thoát của lưới trên mọi fixture không đổi. Chỉ dòng NOTE và dòng tổng nói khác
  đi. `veto_state` vẫn là dấu vết lịch sử «máy đã đi trước ở Cổng 1», và khoá đó
  không bị gỡ (gỡ khoá là VIOLATION dòng 1376).

## 3. Lưới nói gì thay

| Trường hợp | Hôm nay | Sau hồ sơ |
|---|---|---|
| Làn V, chưa ký, xanh-sạch | `NOTE [s]: làn V — máy đi trước, Cổng 1 không có chữ duyệt; cửa veto mở` + có tên trong dòng tổng | **giữ nguyên** (trường hợp thật) |
| Làn V (`approved_by` rỗng), ĐÃ ký | cùng câu «cửa veto mở» + có tên trong dòng tổng | `NOTE [s]: làn V — Cổng 1 không có chữ duyệt; Cổng 2 đã có chữ ký người: cửa veto đã đóng bằng chữ ký` — **một dòng**, không vào dòng tổng |
| `approved_by` có tên + `mo` + ĐÃ ký | có tên trong dòng tổng | không có dòng nào (khối Cổng 1 vốn không in gì cho hồ sơ này) |
| `mo` + chữ ký giữ-chỗ | vẫn là cửa mở (và VIOLATION giữ-chỗ ở luật chữ ký) | vẫn là cửa mở, VIOLATION giữ-chỗ giữ nguyên |
| Mọi `mo` đều đã ký | dòng tổng liệt N tên | **không có dòng tổng** (VETO_OPEN_N = 0 → im, đúng như lưới im khi không có cửa nào) |

Không thêm dòng đếm «N hồ sơ đã ký». Chú thích dòng 1324–1326 của chính lưới đã nói:
một dòng hằng lặp lại là dòng người đọc học cách bỏ qua.

**Máy quét `/start`:** `vetoOpen[]` giữ nguyên tập phần tử («mọi `mo`, bất kể status»,
lời hứa đã ký của `start-bang-dieu-khien`). Mỗi phần tử thêm một trường
`humanSignoff: true|false`, đọc bằng cùng vị từ ở §2. Thân lệnh `/start` và
`acceptance-status` chỉ in «Còn veto được — <tên>» cho phần tử `humanSignoff: false`.
Quan hệ mới giữa hai bộ đọc: **tập tên dòng tổng của lưới = tập `vetoOpen` lọc
`humanSignoff: false`.**

## 4. Phương án đã cân

| # | Phương án | Được | Mất | Kết |
|---|---|---|---|---|
| P1 | Chỉ sửa dòng tổng (kiểu `_vapp`) | nhỏ nhất | NOTE riêng dòng 778 vẫn nói sai cho 23 hồ sơ; `_vapp` lọc theo `approved_by` nên vẫn đếm làn V đã ký, là loại chiếm đa số | loại |
| P2 | Lệnh `/signoff` ghi thêm một trạng thái đóng vào `veto_state` | trạng thái nằm ngay trong contract | cần giá trị enum mới trong `lib/evidence-core.cjs` `vetoGateState` (dòng 969 đang chặn giá trị lạ), tức sửa hook đã vendor sang mọi repo · 27 + 4 hồ sơ đã ký phải migrate hoặc cần đường đọc-cũ, mà đường đọc-cũ chính là P4 · đổi thân một lệnh cổng người bị khoá model-invocation (ADR 0002) · thêm một bước cho người ký nhớ, tức dặn-bằng-lời | loại |
| P3 | P2 + P4 | trạng thái có ở cả hai nơi | toàn bộ chi phí của P2, trong khi P4 đã đủ | loại |
| **P4** | **Sửa ở bộ đọc**: lưới hỏi chữ ký ở cả hai chỗ + máy quét thêm `humanSignoff` | chữa ngay mọi hồ sơ tồn kho ở mọi repo (không migrate); không chạm `lib/`, `hooks/`, lệnh cổng người; sự thật «đã ký» có sẵn ở `human_signoff`, không dựng khoá thứ hai | máy quét và lưới tiếp tục là hai bản dựng của một vị từ (nợ đã khai của `lan-v-khong-phai-cho-ky`), phải có đẳng thức canh | **chọn** |

**Vì sao P4 kéo thêm máy quét (đề bài nghiêng về chỉ-sửa-lưới).** Nếu chỉ sửa lưới:
lưới nói 3 cửa, thẻ `/start` vẫn in «Còn veto được» với 30 tên. Đó đúng là lớp «thẻ
đếm X, lưới đếm Y» mà `start-bang-dieu-khien` sinh ra để diệt. Tệ hơn, không răng nào
bắt được sự lệch này: fixture `dang-thuc` của `rang-bdk.sh` dựng hồ sơ `signed-off`
KHÔNG có `evidence-report.md`, nên hai bên vẫn khớp trên fixture trong khi lệch trên
cây thật. Phần kéo thêm chỉ là MỘT trường cộng thêm và hai câu dặn trong thân lệnh.

**Vì sao thêm trường, không lọc `vetoOpen`.** Lọc thì eval E5 (`bdk_rang_veto`) của hồ
sơ ĐÃ KÝ `start-bang-dieu-khien` đỏ vĩnh viễn: nó đòi tập `vetoOpen` = tập grep
`veto_state: mo` và chứa ≥1 hồ sơ `signed-off`. Khi đó làn ghim lại của hồ sơ đó ở
chiến dịch phát hành tới sẽ dừng. Thêm trường thì giữ nguyên lời hứa đã ký. Cái giá
là tên khoá `vetoOpen` nay chứa cả phần tử đã đóng (nợ tên, ghi sổ kèm điều kiện xem
lại).

## 5. Ràng buộc hình dạng bản sửa

- **DV5 — lưới chỉ được THÊM** (`tests/scripts/additive-only.test.mjs`). Bản sửa đi
  bằng dòng thêm:
  - chèn một nhánh `elif` «đã ký thật» TRƯỚC dòng 777. Vế `[ -n "$_vsig" ] ||` ở dòng
    777 thành mã không còn tới được nhưng giữ nguyên văn;
  - ở vòng veto-trace, thêm dòng đọc chữ ký rồi rẽ trước khi đếm, không sửa dòng
    `mo)` cũ.

  Nếu S2 thấy bắt buộc phải gỡ một dòng thì liệt ĐÍCH DANH dòng đó trong
  `ALLOWED_REMOVALS` kèm lý do «chỉ đổi NOTE, không nới luật» (tiền lệ
  `duong-lui-phai-song`). Mặc định là không cần.
- Đọc chữ ký bằng `front_field` (chỉ frontmatter dẫn đầu, như `_vsig` ở dòng 770), và
  kiểm giữ-chỗ bằng `placeholder_signoff` có sẵn. Cả hai hàm đều khai trước vòng lặp
  (SELF01 canh thứ tự khai-gọi).
- Không chạm `lib/`, `hooks/`, `commands/signoff.md`, `commands/approve.md`.
- Máy quét: đọc chữ ký ở chỗ cửa veto đang đọc (TRƯỚC chốt status hỏng, dòng
  248–253). Nó phải đọc `evidence-report.md` mà không đi qua `readEvidence()`, vì hàm
  đó `pushHong` và đổi ô của slug. Lỗi đọc báo cáo thì coi là CHƯA ký (fail về phía
  cửa còn mở, chiều an toàn), không nuốt im.

## 6. Phép đo (tóm tắt — chi tiết ở `evals.yaml`)

Fixture: kho git tạm do CODE sinh trong lượt chạy. Kho chép TRỌN thư mục `scripts` +
`lib` của cây đang kiểm, theo nếp `pm_fixture` của `rang-veto.sh`: suy từ vị trí
script, không hardcode ROOT. `evidence-report.md` của fixture được rút từ khuôn bên
VIẾT `skills/acceptance/references/evidence-report-template.md` qua
`tests/fixtures/from-template.mjs`, không gõ tay theo khuôn bên đọc.

Mọi chân chạy CHÍNH `scripts/pre-merge-check.sh` và CHÍNH `scripts/start-scan.mjs`.
Mỗi chân có đối chứng dương, rồi chiều đỏ tiêm vào BẢN SAO, kèm thông điệp ghim.
Riêng quan hệ «không nới luật» (mã thoát + tập VIOLATION không đổi) so với bản base
lấy bằng `git archive <sha> scripts lib`: trọn thư mục, không chép danh sách file tay
(bài học P150).

Một ca thường trực vào `tests/scripts/` để luật còn răng sau khi hồ sơ này khép. Răng
hồ sơ (`rang.sh`) chết theo hồ sơ, cùng nếp các bộ răng khác.

## 7. Ngoài phạm vi, hệ quả

- Repo tiêu thụ nhận bản sửa qua bản phát hành tới. `pre-merge-check.sh` nằm trong
  danh sách chép lớp CI, nên hồ sơ mốc phát hành phải ghi «chép lại» cho mục này.
  Vòng này không chạm kho tiêu thụ nào.
- Sau khi bản sửa lên nhánh chính, ba hồ sơ `_vapp`-kiểu ở media-library hết cần vá
  tại chỗ. Việc gỡ vá (nếu còn) là việc của kho đó.
- Không đổi nhãn `da-giao-may-thong-veto-mo` của bản đồ/máy quét: `machine-cleared`
  theo định nghĩa là chưa có chữ ký. Hồ sơ `machine-cleared` mang chữ ký là mâu thuẫn
  mà `machineClearedSignoffConflict` đã chặn.
