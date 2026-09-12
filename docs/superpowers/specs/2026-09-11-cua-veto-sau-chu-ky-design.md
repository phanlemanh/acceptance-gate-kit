# Cửa veto sau chữ ký — thiết kế (hồ sơ `cua-veto-sau-chu-ky`, T3)

Owner gọi tên việc này ngày 11/09/2026 («Chạy hai việc kit còn mở»). Đây là lỗ C3 của
đợt rà 22/08, đo lại sống 11/09. Hồ sơ hạng T3 vì chạm `scripts/pre-merge-check.sh`,
file nằm trong `risk_tiers.t3_paths`.

## 1. Bệnh

Lưới trước-merge báo một hồ sơ **đã được người ký ở Cổng Bằng chứng** là «cửa veto
mở», «owner chưa veto». Câu đó sai: người đã phát ngôn quyết định rồi. Cửa veto là
đường đảo cho việc **máy tự quyết mà người chưa nói gì**. Khi đã có chữ ký thì cửa
đó không còn là chốt giữ hồ sơ.

### Số đo 11/09 (máy đo, không đoán)

| Kho | Hồ sơ `veto_state: mo` | Trong đó đã có `human_signoff` | Thật còn mở |
|---|---|---|---|
| kit (cây này, `f1892be7`) | 30 | **27** | 3: `co-qua-timebox-nhom-da-xong` (verified) · `ma-so-quyet-dinh-duy-nhat` (machine-cleared) · `release-2-0-0` (verified) |
| media-library | 3 | **3** | 0 |
| floorplanstudio (cây `kit-2-11-0`) | 1 | **1** | 0 |

Trong kit:

- Dòng NOTE riêng từng hồ sơ «làn V … cửa veto mở» in cho 25 hồ sơ; 23 hồ sơ trong
  số đó đã ký.
- Dòng tổng liệt 30 tên; 27 tên đã ký.

Gần chín phần mười những gì lưới nói về cửa veto là sai. Một dòng sai tới mức đó thì
người đọc học cách bỏ qua nó, và ba hồ sơ còn mở thật chìm theo.

### Gốc ở mã (dẫn dòng tại `f1892be7`)

1. **NOTE riêng từng hồ sơ, khối Cổng 1 làn V** — `scripts/pre-merge-check.sh:766–782`.
   Nhánh `elif [ -n "$_vsig" ] || xanh_sach_check "$_vrep"` (dòng 777) gộp HAI trường
   hợp vào cùng câu NOTE ở dòng 778:
   - (a) bằng chứng xanh-sạch mà chưa ai ký. Đây là cửa veto mở thật.
   - (b) đã có chữ ký người. Người đã quyết, nên «cửa veto mở» là câu sai.

   Vế `[ -n "$_vsig" ]` do hồ sơ `lan-v-khong-phai-cho-ky` thêm vào. Mục đích của nó
   là **đừng chặn** hồ sơ đã ký, và mục đích đó đúng. Chỗ sai là hai trường hợp dùng
   chung một câu.
2. **Dòng tổng veto-trace** — `scripts/pre-merge-check.sh:1344–1386`.
   - Nhánh `mo)` ở dòng 1353–1355 đếm MỌI hồ sơ `veto_state: mo` và không đọc
     `evidence-report.md` lần nào.
   - Vì vậy hồ sơ có `approved_by` cũng bị đếm, dù chúng bỏ qua khối Cổng 1 ở trên.
     Ví dụ: `release-2-6-0`, `suite-run-log-provenance`, và cả ba hồ sơ của
     media-library.
   - Dòng 1385 in «… mà owner chưa veto: <tên>».
3. **Bộ đọc anh em** — `scripts/start-scan.mjs:122–128, 252–253`.
   - `vetoOpen[]` được dựng để hỏi đúng câu lưới hỏi: «mọi `veto_state: mo`, bất kể
     status» (hồ sơ `start-bang-dieu-khien`, AC-5/AC-6).
   - Thẻ `/start` và `acceptance-status` đọc nó rồi in «Còn veto được — <tên>».
   - Hôm nay thẻ lặp lại đúng câu sai của lưới.

**Hệ quả cho repo tiêu thụ:** media-library từng vá tại chỗ (`_vapp`, commit
`15b5593`: chỉ đếm `mo` khi `approved_by` rỗng). Bản vá đó mất hai lần vì chép đè.
Owner đã chốt bản sửa phải nằm trong kit. Vá kiểu `_vapp` cũng chưa đủ: nó vẫn đếm
hồ sơ làn V đã ký, là loại chiếm đa số trong kit.

## 2. Luật

> **Chữ ký người ở Cổng Bằng chứng ĐÓNG cửa veto.** Cửa veto mở ⇔
> `veto_state: mo` **∧** `human_signoff` trong frontmatter DẪN ĐẦU của
> `evidence-report.md` KHÔNG phải một chữ ký thật. «Không phải chữ ký thật» gồm:
> rỗng · chỉ có chú thích · báo cáo vắng · frontmatter không đọc được · khớp bảng
> giữ-chỗ `placeholder_signoff`.

Bốn điểm của luật:

- **Căn cứ là QUAN HỆ, không phải nhãn** (cùng tinh thần chú thích dòng 764–765).
  `status: signed-off` mà không có chữ ký thì KHÔNG đóng cửa. Nhãn đó là một lời khai,
  và các luật khác đã bắt nó.
- **Chữ ký giữ-chỗ không đóng cửa.** Lưới dùng đúng hàm `placeholder_signoff` (dòng
  413) mà luật chữ ký đã dùng. Máy quét là bản dựng JS thứ hai của cùng vị từ, nên
  bảng mẫu của nó được canh bằng ma trận TOÀN PHẦN rút lúc chạy từ chính hàm bash
  (xem §6). Nếu `TBD` được tính là chữ ký thì cửa đóng oan, và đó là chiều hỏng nguy
  hiểm hơn.
- **Chỉ frontmatter DẪN ĐẦU là nguồn.** Một dòng `human_signoff: …` ở thân báo cáo
  (ví dụ trích khuôn) không phải chữ ký.
- **Luật chỉ đổi LỜI, không đổi CHẶN.**
  - Mọi VIOLATION đang có vẫn nguyên: `da-veto` chưa xử · chiều ghi-ngược · làn V hạng
    T3 · vết giờ hỏng · không sạch mà không ký.
  - Mã thoát của lưới trên mọi fixture không đổi.
  - `veto_state` vẫn là dấu vết lịch sử «máy đã đi trước ở Cổng 1», và khoá đó không bị
    gỡ (gỡ khoá là VIOLATION ở dòng 1376).

## 3. Lưới và máy quét nói gì thay

| Trường hợp | Hôm nay | Sau hồ sơ |
|---|---|---|
| Làn V, chưa ký, xanh-sạch | `NOTE [s]: làn V — máy đi trước, Cổng 1 không có chữ duyệt; cửa veto mở` + có tên trong dòng tổng | **giữ nguyên** (trường hợp thật) |
| Làn V (`approved_by` rỗng), ĐÃ ký | cùng câu «cửa veto mở» + có tên trong dòng tổng | `NOTE [s]: làn V — Cổng 1 không có chữ duyệt; Cổng 2 đã có chữ ký người: cửa veto đã đóng bằng chữ ký` — **một dòng**, không vào dòng tổng |
| `approved_by` có tên + `mo` + ĐÃ ký | có tên trong dòng tổng | không có dòng nào (khối Cổng 1 vốn không in gì cho hồ sơ này) |
| `mo` + chữ ký giữ-chỗ / chỉ chú thích / chỉ ở thân / frontmatter hỏng | cửa mở | vẫn là cửa mở; VIOLATION giữ-chỗ của luật chữ ký giữ nguyên |
| Mọi `mo` đều đã ký | dòng tổng liệt N tên | **không có dòng tổng** (VETO_OPEN_N = 0 → im, như khi không có cửa nào) |

Không thêm dòng đếm «N hồ sơ đã ký». Chú thích dòng 1324–1326 của chính lưới đã nói:
một dòng hằng lặp lại là dòng người đọc học cách bỏ qua.

**Máy quét `/start` — ba trường CỘNG thêm, không lọc gì:**

- `vetoOpen[]` giữ nguyên tập phần tử («mọi `mo`, bất kể status» — lời hứa đã ký của
  `start-bang-dieu-khien`). Mỗi phần tử thêm:
  - `humanSignoff: true|false` — đọc theo đúng vị từ ở §2;
  - `signoffWarn: "<lý do>"` — LUÔN có mặt, chuỗi rỗng khi đọc sạch. Khi báo cáo không
    đọc được hoặc frontmatter hỏng hay không dẫn đầu, trường này nêu lý do. Phần tử vẫn
    `humanSignoff: false`: fail về phía cửa còn mở, và không nuốt im.
- `vetoOpenUnsigned[]` — **danh sách tên dựng sẵn để in**: các slug của `vetoOpen` có
  `humanSignoff: false`, đúng thứ tự `vetoOpen`.

Thân lệnh `/start` và `acceptance-status` **chỉ CHÉP nguyên** `vetoOpenUnsigned[]` vào
dòng «Còn veto được — <tên>», không tự lọc `vetoOpen`. Nhờ vậy phép đo máy (E6) chấm
đúng danh sách thẻ in ra. Giới hạn «đo chỉ dẫn, không đo render» co lại thành một câu
chép (xem Notes của contract).

Quan hệ giữa hai bộ đọc: **tập tên dòng tổng của lưới = `vetoOpenUnsigned[]` = `vetoOpen`
lọc `humanSignoff: false`.**

## 4. Phương án đã cân

| # | Phương án | Được | Mất | Kết |
|---|---|---|---|---|
| P1 | Chỉ sửa dòng tổng (kiểu `_vapp`) | nhỏ nhất | NOTE riêng dòng 778 vẫn nói sai cho 23 hồ sơ; `_vapp` lọc theo `approved_by` nên vẫn đếm làn V đã ký, là loại chiếm đa số | loại |
| P2 | Lệnh `/signoff` ghi thêm một trạng thái đóng vào `veto_state` | trạng thái nằm ngay trong contract | cần giá trị enum mới trong `lib/evidence-core.cjs` `vetoGateState` (dòng 969 đang chặn giá trị lạ), tức sửa hook đã vendor sang mọi repo · 27 + 4 hồ sơ đã ký phải migrate hoặc cần đường đọc-cũ, mà đường đọc-cũ chính là P4 · đổi thân một lệnh cổng người bị khoá model-invocation (ADR 0002) · thêm một bước cho người ký nhớ, tức dặn-bằng-lời | loại |
| P3 | P2 + P4 | trạng thái có ở cả hai nơi | toàn bộ chi phí của P2, trong khi P4 đã đủ | loại |
| **P4** | **Sửa ở bộ đọc**: lưới hỏi chữ ký ở cả hai chỗ + máy quét cộng ba trường | chữa ngay mọi hồ sơ tồn kho ở mọi repo (không migrate); không chạm `lib/`, `hooks/`, lệnh cổng người; sự thật «đã ký» có sẵn ở `human_signoff`, không dựng khoá thứ hai | máy quét và lưới vẫn là hai bản dựng của một vị từ (nợ đã khai của `lan-v-khong-phai-cho-ky`), phải có đẳng thức canh trên ma trận toàn phần | **chọn** |

**Vì sao P4 kéo thêm máy quét (đề bài nghiêng về chỉ-sửa-lưới).**

- Nếu chỉ sửa lưới: lưới nói 3 cửa, thẻ `/start` vẫn in «Còn veto được» với 30 tên.
  Đó đúng là lớp «thẻ đếm X, lưới đếm Y» mà `start-bang-dieu-khien` sinh ra để diệt.
- Tệ hơn, không răng nào bắt được sự lệch này: fixture `dang-thuc` của `rang-bdk.sh`
  dựng hồ sơ `signed-off` KHÔNG có `evidence-report.md`, nên hai bên vẫn khớp trên
  fixture trong khi lệch trên cây thật.

**Vì sao cộng trường, không lọc `vetoOpen`.**

- Lọc thì eval E5 (`bdk_rang_veto`) của hồ sơ ĐÃ KÝ `start-bang-dieu-khien` đỏ vĩnh
  viễn: nó đòi tập `vetoOpen` = tập grep `veto_state: mo` và chứa ≥1 hồ sơ
  `signed-off`. Khi đó làn ghim lại của hồ sơ đó ở chiến dịch phát hành tới sẽ dừng.
- Cái giá là nợ tên: `vetoOpen` nay chứa cả phần tử đã đóng. Nợ này đã ghi sổ kèm điều
  kiện xem lại.

## 5. Ràng buộc hình dạng bản sửa

- **DV5 — lưới chỉ được THÊM** (`tests/scripts/additive-only.test.mjs`). Bản sửa đi
  bằng dòng thêm:
  - chèn một nhánh `elif` «đã ký thật» TRƯỚC dòng 777. Vế `[ -n "$_vsig" ] ||` ở dòng
    777 thành mã không còn tới được nhưng giữ nguyên văn;
  - ở vòng veto-trace, thêm dòng đọc chữ ký và rẽ trước khi đếm, không sửa dòng `mo)` cũ.

  Nếu S2 thấy bắt buộc phải gỡ một dòng thì liệt ĐÍCH DANH dòng đó trong
  `ALLOWED_REMOVALS` kèm lý do «chỉ đổi NOTE, không nới luật» (tiền lệ
  `duong-lui-phai-song`). Mặc định là không cần.
- **Lưới đọc chữ ký** bằng `front_field`: chỉ frontmatter dẫn đầu, có bóc nháy và bóc
  chú thích đuôi, như `_vsig` ở dòng 770. Kiểm giữ-chỗ bằng `placeholder_signoff` có
  sẵn. Cả hai hàm đều khai trước vòng lặp (SELF01 canh thứ tự khai-gọi).
- **Máy quét đọc chữ ký:**
  - đọc ở chỗ cửa veto đang đọc, TRƯỚC chốt status hỏng (dòng 248–253);
  - đọc `evidence-report.md` KHÔNG qua `readEvidence()`, vì hàm đó `pushHong` và đổi ô
    của slug;
  - chỉ đọc frontmatter DẪN ĐẦU, không regex cả file;
  - bóc nháy và chú thích theo cùng luật `front_field`;
  - lỗi đọc hoặc frontmatter hỏng → `humanSignoff: false` kèm `signoffWarn` có lý do.
- **Bảng giữ-chỗ của máy quét** là bản dựng thứ hai. Nó phải khớp `placeholder_signoff`
  trên MỌI mẫu rút lúc chạy (E4), không chỉ trên mẫu fixture chọn tay.
- **Không chạm** `lib/`, `hooks/`, `commands/signoff.md`, `commands/approve.md`.

## 6. Phép đo (tóm tắt — chi tiết ở `evals.yaml`)

- **Fixture:** kho git tạm do CODE sinh trong lượt chạy, chép TRỌN thư mục `scripts` +
  `lib` của cây đang kiểm (nếp `pm_fixture` của `rang-veto.sh`: suy từ vị trí script,
  không hardcode ROOT).
- **Báo cáo trong fixture:** `evidence-report.md` rút từ khuôn bên VIẾT
  `skills/acceptance/references/evidence-report-template.md`. Ô «rỗng» lấy NGUYÊN VĂN
  dòng `human_signoff:` mặc định của khuôn. Hôm nay dòng đó mang chú thích gợi ý chứa
  `<name>` — chính hình dạng dễ bị đọc nhầm thành chữ ký. Không gõ tay ô trống.
- **ĐỔI KHUÔN S4-r2 (owner quyết 12/09 tại chốt DỪNG-VÁ).** Hai lượt chấm bắt cùng
  một lớp: vị từ «đã ký thật» dựng HAI lần (bash · JS), hai ngữ pháp, lệch trong im
  lặng. Nay vị từ có **một nguồn**: `chuKyThat()` trong `lib/evidence-core.cjs`, sở
  hữu trọn ngữ pháp (khối frontmatter · luật cột của dấu fence · cách viết khoá ·
  bảng giữ-chỗ · bốn ca rỗng/vắng/chỉ-ở-thân/không-giải-được). `start-scan.mjs`
  `require` nó; `pre-merge-check.sh` gọi `node lib/evidence-core.cjs chu-ky-that
  <báo cáo>` và đọc một dòng tab, đúng nếp `lop-nhin-thay`. Hệ quả cho phép đo: hai
  bộ đọc khớp **theo cấu trúc**, nên phép đo chuyển sang (0) chứng CHỈ CÓ một nguồn
  và (1) từng ô ngữ pháp cho đúng kết luận hợp đồng nói. Ma trận lên **108 ô** (18 ô
  chữ ký: 14 cũ + ba cách viết khoá + dấu đóng thụt lề).
- **Ma trận đẳng thức hai bộ đọc (E6), khai TRƯỚC:**
  - veto (3) × Cổng 1 (2) × ô chữ ký (14) = **84 ô**.
  - 14 ô chữ ký gồm: thật {trần · nháy kép · nháy đơn · chú thích đuôi}; giữ-chỗ `TBD`
    {trần · nháy kép · nháy đơn · chú thích đuôi}; rỗng {dòng mặc định của khuôn · chỉ
    chú thích}; báo cáo vắng; chữ ký thật chỉ ở THÂN; frontmatter hỏng hoặc không dẫn
    đầu; frontmatter MỞ mà thiếu dấu đóng.
  - **Ô «thiếu dấu đóng» thêm ở S4-r1.** `frontmatterField` (JS) đòi ĐỦ CẶP `---` và
    trả `null` khi thiếu vế đóng, còn `front_field` (awk) đọc tới dấu đóng HOẶC HẾT
    TỆP — nên trên cùng một tệp, lưới thấy chữ ký còn máy quét thì không. Máy quét nay
    SOI GƯƠNG bản lưới ở đúng ca này (đọc tới hết tệp) và nêu `signoffWarn` có tên hồ
    sơ; chọn vậy vì chữ ký người CÓ THẬT trong tệp và bất biến của hồ sơ là hai bộ đọc
    cùng kết luận — coi là «chưa ký» thì giấu sự lệch chứ không gỡ nó.
- **Ma trận giữ-chỗ (E4):** mọi mẫu rút lúc chạy từ `placeholder_signoff` × hai bộ đọc.
  Số assert = 2 × số mẫu, sàn ≥ 3 mẫu.
- **Neo base cho phép so «không nới luật» (E7) và chiều đỏ cây thật (E10):**
  - base = **cha của commit đầu tiên đưa câu «cửa veto đã đóng bằng chữ ký» vào
    `scripts/pre-merge-check.sh`**, tìm bằng `git log -S … --reverse` trong lượt chạy
    (không gõ tay) và in ra output;
  - bản base lấy bằng `git archive <base> scripts lib` (trọn thư mục, bài học P150);
  - tự kiểm trước khi so: base ≠ HEAD trên file đó, VÀ bản base chưa chứa câu ấy. Sai
    một vế → chân thoát **97** (mã hạ tầng của khối `INFRA-EXIT-CODES`), không xanh
    cũng không đỏ trên vật;
  - lý do không neo `origin/main`: main trôi giữa lượt chấm, và sau khi hồ sơ gộp thì
    main đã mang bản sửa, nên hai chân tự chết ở chiến dịch ghim lại (bài học
    `[release-2-10-0#F1]`).
- **Nếp chân:** mỗi chân có đối chứng dương, rồi chiều đỏ tiêm vào BẢN SAO, kèm thông
  điệp ghim.
- **Ca thường trực** vào `tests/scripts/` để luật còn răng sau khi hồ sơ khép. Răng hồ
  sơ `rang.sh` chết theo hồ sơ.

## 7. Ngoài phạm vi, hệ quả

- Repo tiêu thụ nhận bản sửa qua bản phát hành tới. `pre-merge-check.sh` nằm trong danh
  sách chép lớp CI, nên hồ sơ mốc phải ghi «chép lại». Vòng này không chạm kho tiêu thụ
  nào.
- Ba hồ sơ ở media-library hết cần vá tại chỗ khi bản sửa lên nhánh chính. Việc gỡ vá
  (nếu còn) là việc của kho đó.
- Không đổi nhãn `da-giao-may-thong-veto-mo` của bản đồ và máy quét: `machine-cleared`
  theo định nghĩa là chưa có chữ ký. Hồ sơ `machine-cleared` mang chữ ký là mâu thuẫn
  mà `machineClearedSignoffConflict` đã chặn.
- Phạm vi máy quét gồm `scripts/start-scan.mjs` + thân lệnh `commands/start.md`,
  `commands/acceptance-status.md` (khối `START-SCAN-KEYS`). Không bộ đọc nào khác.

## 8. Phản biện context sạch đã xử (S1#7)

Kết quả `findings`: p0 0 · p1 3 · p2 2. Cả năm mục `fixed` trong bản này:

- base của E7/E10 neo vào cha commit sửa;
- ma trận giữ-chỗ chạy trên hai bộ đọc;
- trục hình dạng giá trị chữ ký;
- hai ô «chỉ ở thân» / «frontmatter hỏng» + `signoffWarn`;
- danh sách dựng sẵn `vetoOpenUnsigned[]`.

Chi tiết: `_acceptance/cua-veto-sau-chu-ky/gap-probe.md`.
