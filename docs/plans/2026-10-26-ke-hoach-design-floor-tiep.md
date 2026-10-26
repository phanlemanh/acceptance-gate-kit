# Kế hoạch tiếp — design-floor sau bước 1, 26/10/2026

Gốc: acceptance-gate-kit/_acceptance/design-floor-hop-dong-nhap/ — Cổng 0 `build` (Mạnh, 26/10); hồ sơ và bộ đo nằm ở
PR #421 (nhánh `vong/design-floor-hop-dong-nhap`, CHƯA gộp).

**Tệp này là gì.** Một kế hoạch theo kết quả, không phải hạt giống (ý đã có ô) và chưa phải bản phạm vi (bước 5 cắt nó
thành bản phạm vi). Nó nói sáu bước còn lại theo thứ tự đã chốt: mỗi bước ra vật gì, ai quyết, xong khi nào, và bốn phép
thử North Star. Phiên viết tệp này KHÔNG bật tầng tri thức, KHÔNG ghi trang, KHÔNG sửa lộ trình, KHÔNG vendor mã — chỉ
lập kế hoạch và chuẩn bị.

**Không gửi PR upstream (chủ kho 26/10).** Bốn nhóm sửa đổi A–D mà khối máy của #421 ghi là «chờ upstream» được áp
thành bản vá cục bộ lúc vendor (bước 4), mỗi bản vá một dòng ở sổ LOCAL-PATCHES. Kit không mở PR nào tới kho upstream.

## 0. Đã có, và sự thật đo hôm nay khác lời giao

**Bước 1 (#421) đã giao:** hợp đồng nhập `design-floor/HOP-DONG-NHAP.md` (năm lệnh v1, đầu vào tường minh, ba trạng
thái với mã 0/2/3/4/5, không bút không mạng) · `design-floor/upstream.lock.json` (124 tệp · 18 474 dòng, băm từng tệp
= danh sách chép của bước 4) · `tests/design-floor/` (DF-01…09, FN-01…04, 14 ca chiều đỏ) · job CI `design-floor`. Đỏ
có chủ đích (xfail chặt): DF-01, DF-03, DF-04, DF-05, DF-06, DF-07, DF-08, FN-02.

Máy đo 26/10, tự điền — chủ kho phủ quyết được:

| Lời giao | Đo được | Hệ quả cho kế hoạch |
|---|---|---|
| Thí điểm ở `~/dev/one-invest` | `one-invest` đứng yên từ 22/10 (commit cuối `d8abc68`), không có `_acceptance/config.yaml`. README của `onehub-invest`: «gom từ one-invest + onehub-data-api, 2026-10-22». `onehub-invest` chạy kit 2.34.0, 102 hồ sơ có evals, ~17 hồ sơ có eval `ui-check`, 7 có design-pass, đã gọi design gate của kit ở 2 eval | Bước 6 chạy ở **onehub-invest**. Máy này chưa có bản clone của nó |
| Bật tầng tri thức của kit | Kho kit **công khai**. «Tri thức của chính kit» là mục chờ điều kiện `TT-C5` (mã `F5`), mở lại khi «một mốc có TT1–TT4 được một kho tiêu thụ nhận» — đã tới: onehub-invest gọi script từ bộ đệm `acceptance-gate/2.34.0` | Raw phải vào kho riêng (tiền lệ `onehub-invest-tri-thuc`). Bật nó là vòng meta của cửa sổ sau 2.34.0 — luật chiều rộng (b) |
| Số đo chéo làm nguồn cho trang tri thức | Số đo chéo chỉ còn ở phiên 26/10 và thư mục tạm của máy (mất khi khởi động lại) | Đã chép bản tạm 2,8 MB sang thư mục ghi chú dùng chung của nhóm phiên (cục bộ, không công khai). Bước 2 lấy raw từ đó |

## 1. Bảng tổng

| # | Bước | Vật ra | Ai quyết | Xong khi | Phụ thuộc |
|---|---|---|---|---|---|
| 1 | Bật tầng tri thức | khối `tri_thuc` trong `_acceptance/config.yaml` + kho riêng `acceptance-gate-kit-tri-thuc` | **chủ kho** (Hỏi-1: tạo kho riêng, dùng lượt meta) · máy làm phần còn lại | `/tri-thuc:kiem` 0 lỗi trên kho kit, và đỏ đúng lỗi khi cài một raw vào bản sao công khai | — |
| 2 | Ghi design-floor vào tri thức | `wiki/chu-de/design-floor.md` + raw bất biến ở kho riêng | máy | trang + raw đã đẩy, `/tri-thuc:kiem` 0 lỗi, có đường trỏ băm | 1; nguồn trong kho đọc trên `main` sau khi #421 gộp |
| 3 | Cổng thiết kế của kit trả KHÔNG-ĐO-ĐƯỢC | vòng feature-loop T2 sửa `lib/design-detect.mjs` | máy (phán quyết sai = sai hợp đồng) · người ở cổng đã có | 5/5 P0 sai của đo chéo thành KHÔNG-ĐO-ĐƯỢC có lý do; ca tương phản thật vẫn REJECT | — |
| 4 | Vendor + vá cục bộ + móc bốn điểm | vòng feature-loop: bản vendored khớp băm + sổ LOCAL-PATCHES (A–D) + móc S0/S1/cuối S3/S4 | chủ kho ở các cổng đã có của vòng (CỘNG một plugin mới) | bộ đo bước 1 chạy trên bản vendored, tám XFAIL xanh nhờ bản vá; mỗi điểm móc có đột biến đỏ; không ghi gì sau S4 | #421 gộp |
| 5 | Lộ trình | bản phạm vi + hàng `lo-trinh-kit.json` qua `cat-luot` | người gộp PR cắt lượt | răng phủ xanh, mọi mã ở đúng một chỗ, mỗi hàng có `Gốc:` | #421 gộp; 2 |
| 6 | Thí điểm | báo cáo năm số trên onehub-invest | máy đo · chủ kho giữ/bỏ (ngoài lộ trình) | ≥10 vòng giao diện đã chạy, năm tiêu chí có số | 4 ở một bản phát hành 2.x |

Bước 3 không phụ thuộc gì — chạy được ngay, song song với 1–2.

## 2. Từng bước

### Bước 1 — bật tầng tri thức của kit

**Vật ra.**
- Kho riêng `phanlemanh/acceptance-gate-kit-tri-thuc`, clone cạnh checkout chính (`../acceptance-gate-kit-tri-thuc`),
  mở bằng `TRI-THUC.md` rút từ khối `TRI-THUC-LUAT` của `skills/acceptance/references/tri-thuc-template.md`. Mục «Không
  đưa vào»: khoá/token/`.env`, dữ liệu khách hàng của kho tiêu thụ, ảnh có tên người.
- Khối khai trong `_acceptance/config.yaml` của kit (đúng hình dạng onehub-invest đã dùng):

  ```yaml
  tri_thuc:
    cong_khai: true
    kho:
      ten: acceptance-gate-kit-tri-thuc
      duong: ../acceptance-gate-kit-tri-thuc
      remote: https://github.com/phanlemanh/acceptance-gate-kit-tri-thuc.git
  ```

  Gốc tri thức là kho riêng nên không thêm gì vào `t1_skip_globs` của kit.

**Ai quyết.** Chủ kho: tạo một kho GitHub (việc ra ngoài) và dùng lượt meta duy nhất của cửa sổ sau 2.34.0 cho `TT-C5`
— Hỏi-1. Máy: khối khai, `TRI-THUC.md`, chạy lint.

**Xong khi.** `/tri-thuc:kiem` trên kho kit báo 0 lỗi; `tri-thuc-tra.cjs --root . --clone` đọc được kho riêng từ một
worktree; **chiều đỏ:** trên bản sao bỏ đi của kho kit, cài một `raw/<ngày>-thu/nguon.md` vào cây công khai → lint đỏ
đúng lỗi `raw-trong-kho-cong-khai`; một commit ở kho riêng chưa đẩy → đỏ đúng `kho-rieng-chua-day`.

**North Star.** Không ghi sau S4: thay đổi cấu hình nằm ngoài mọi vòng; tra tri thức ở S1 chỉ đọc. · Lượt người: một
câu một chạm (Hỏi-1), không thêm cổng — bước 0c của S1 và cờ ở thẻ Cổng Phạm vi đã có. · **Chi phí máy:** từ khi bật, MỌI
vòng của kit tra tri thức ở S1 — lệnh tra 0 token, đọc trang tốn token; trần: trang nền + ≤2 trang mỗi vòng, đọc số ở
`usage-report.md`. · Chiều đỏ: hai ca trên.

### Bước 2 — ghi design-floor vào tri thức

**Vật ra.** `/tri-thuc:ghi` tạo raw bất biến kèm băm và trang `wiki/chu-de/design-floor.md` ở kho riêng.

Raw (mỗi nguồn một thư mục `raw/<ngày>-<tên>/`):
- `phien` — trích phiên 26/10 của nhóm design-floor (đo chéo, kiểm nợ, phép thử North Star).
- `tep-may` — bản tạm đo chéo đã chép ở thư mục ghi chú dùng chung (`design-floor-raw/doi-chieu-26-10/`); ba ghi chú bộ
  nhớ của phiên (`design-os-slim-core`, `design-floor-north-star-check`, `crm-ui-grading-churn`); hai phác hình
  `01-bac-cua-repo.html`, `02-vong-s0-s5.html`; ghi chú bàn giao `design-floor-buoc-1.md`.
- `tep-kho` — `design-floor/HOP-DONG-NHAP.md`, `design-floor/upstream.lock.json`,
  `_acceptance/design-floor-hop-dong-nhap/opportunity.md`, đọc trên `main` SAU khi #421 gộp (trước đó đường trỏ không
  phân giải được trên `main`).

Năm mục của trang:
1. **Đo chéo 26/10** — 10 fixture của kit + 4 trang thật, thư mục trung tính: Design OS bắt 11/22 lỗi cài, kit 9/22.
   P0 tương phản của kit sai 5/8 lần và lặng lẽ REJECT 3/5 tệp vì chúng; ba nguyên nhân: CSS Tailwind v4 không đọc được
   thành chữ trắng trên nền trắng · nền tối khai ở body bị bỏ qua · chữ gradient cắt theo chữ. `ui gate` của Design OS
   thoát 0 với ghi chú `partial` «NOT COMPUTABLE».
2. **Lỗ luật design system** — `lib/p-tiers.json` thả `design-system-color/font/radius`; engine static không tính màu;
   dom mù `@layer`. Kit không chấm sự tuân thủ design system ở đâu cả.
3. **Kiểm nợ upstream** — 3 dấu `es-debt:`, 6 TODO; 72/508 tệp lõi vượt trần 200 dòng; đóng kín `ui gate` 104 tệp ·
   16 465 dòng, hợp năm lệnh 124 · 18 474; tám module `memory-*` và `figma-ds-tokens.ts` trong đóng kín; đường ghi sự
   kiện của gate là chủ ý của upstream (spec 006), không phải lỗi.
4. **Phép thử North Star** — bốn phép thử, và một vi phạm đã bắt: phác 02 từng sinh lại bảng kê ở S5, đã dời về cuối S3.
5. **Quyết định đã chốt** — tên `design-floor`; từ vựng M0–M3 · S0–S5 · cổng của kit; phạm vi v1 (tuân thủ DS, flow lint
   ở Cổng 1, sàn cổng + autofix ở S3, định tuyến chỉ mục tri thức); vendor có ghim + băm + sổ LOCAL-PATCHES, sửa đổi giữ
   thành bản vá cục bộ, không gửi PR upstream; chỉ luật đã phân xử mới được chặn; thí điểm ở onehub-invest.

Frontmatter `loai: chu-de`, `ma: []` cho tới bước 5; bước 5 điền mã của các hàng.

**Ai quyết.** Máy. Nguồn nào chạm điều «Không đưa vào» của `TRI-THUC.md` thì không ghi nguồn đó; không có gì vào kho
công khai.

**Xong khi.** Raw + trang đã commit và đẩy lên kho riêng; `/tri-thuc:kiem` 0 lỗi; lệnh in đường trỏ băm của trang.
**Chiều đỏ:** sửa một byte của một raw trên bản sao → lint đỏ đúng `raw-bi-sua`; xoá một nguồn trang trỏ tới → đỏ đúng
`nguon-khong-co`.

**North Star.** Ngoài mọi vòng — không ghi sau S4. · 0 lượt người. · Chi phí: một lượt ghi, một lần. · Chiều đỏ: hai ca
trên.

### Bước 3 — cổng thiết kế của kit trả KHÔNG-ĐO-ĐƯỢC thay vì REJECT

**Vật ra.** Một vòng feature-loop T2 (`Gốc:` `_acceptance/design-gate-che-do-chat/` + hạt giống
`docs/plans/2026-10-25-hat-giong-design-gate-dom-mu-tailwind-v4.md`, trang tri thức của bước 2 khi đã có). Sửa ở tầng
dùng chung `lib/design-detect.mjs` (đường dom); bản Impeccable vendored giữ nguyên từng byte như NOTICE khai. Ba nguyên
nhân → phần tử đó KHÔNG-ĐO-ĐƯỢC có lý do riêng, không thành P0 `low-contrast`:
1. stylesheet DOM không áp được (`@layer` dưới jsdom, CSS không phân tích được);
2. nền khai ở tổ tiên (vd. body tối) mà nền tính ra bỏ qua;
3. chữ `background-clip: text` trên gradient — tương phản với gradient không tính được.

Thứ tự FAIL > KHÔNG-ĐO-ĐƯỢC > PASS giữ nguyên: lỗi thật khác trên cùng trang vẫn REJECT. Mã thoát giữ hợp đồng hiện
có: 0 kèm verdict KHONG-DO-DUOC, 5 dưới `--require-measured`.

**Đo trước khi đổi (luật «cân trên mọi kho»).** Đếm ở crm, onehub-invest, artifact-platform: eval design gate chế độ
dom đang REJECT vì đúng ba nguyên nhân trên. Đó là các REJECT sai; nếu có kho dựa vào chúng để chặn thật → đưa số lên thẻ
Cổng Phạm vi của vòng, không đổi lặng.

**Ai quyết.** Máy: phán quyết sai là sai hợp đồng, máy sửa vật. Chủ kho chỉ ở các cổng đã thiết kế của vòng (≤3 lượt).

**Xong khi.** Fixture do mã sinh tái lập 5/5 P0 sai của đo chéo → cả năm thành KHÔNG-ĐO-ĐƯỢC kèm đúng lý do; ba ca đối
chứng tương phản thật trên CSS đọc được vẫn REJECT; ba đột biến (gỡ từng nhánh) đỏ đúng ca; bộ ca kit xanh; vào bản phát
hành 2.x kế tiếp. Mốc này cũng là đường nền của tiêu chí 4 ở bước 6.

**North Star.** Không ghi sau S4: sửa ở kit, kho tiêu thụ không có tệp mới. · Lượt người: chỉ các cổng thiết kế. · Chi
phí lúc chạy: 0 token (tất định). · Chiều đỏ: ba đột biến + ca đối chứng.

### Bước 4 — bước 2 của design-floor: vendor bản lõi gọn, vá cục bộ, móc bốn điểm

**Vật ra.** Một vòng feature-loop (dự kiến T3 vì thêm plugin và móc vào vòng — có Cổng 1.5, trần 4 lượt người):
- **Vendor:** chép đúng 124 tệp của `upstream.lock.json`, mỗi tệp khớp sha256; `chuanBiNguon` trong
  `tests/design-floor/lib/upstream.mjs` trỏ sang bản vendored. Cách giao bản chạy được (bản gói một tệp dựng tất định
  từ nguồn đã ghim, CI dựng lại và so băm — hay nguồn TS dựng lúc chạy) là lựa chọn của bước thiết kế vòng đó; máy đề
  xuất, đảo rẻ.
- **Vá cục bộ, sổ LOCAL-PATCHES** — một dòng một bản vá: tệp · băm trước/sau · vì sao · phép đo nó làm xanh. Bản vá áp
  trên tệp đã khớp băm ghim; tệp khoá ghi cả hai băm.

  | Bản vá | Sửa gì | XFAIL xanh lên |
  |---|---|---|
  | A — bộ chấm không bút | đường ghi sự kiện (`src/core/memory-autorecord.ts`, gọi ở `gate.ts:18/387`, `autofix.ts:15/137`) rời khỏi module lệnh `gate`/`autofix` | DF-07, DF-08, và 16/20 cặp của FN-02 (tám `memory-*` × gate, autofix) |
  | B — mã thoát ba trạng thái | `partial` không lỗi → 5 (`gate.ts:165`); thiếu tệp 3 · sai cú pháp 4 · có lỗi 2, lỗi nội bộ rời mã 2 (`output.ts:116`); đích không phải `.html/.htm` → 5; 0 khai báo được chấm → 5 | DF-01, DF-04, DF-05, DF-06 |
  | C — đầu vào tường minh | tắt tự dò (`discoverDesignSystem`, `<cwd>/design/component-registry.json`); vắng `--tokens`/`--file` → 4 | DF-03 |
  | D — hàm làm sạch tên token trung tính | dời `sanitizeSeg`/`buildTokensTree` khỏi `figma-ds-tokens.ts` ra module trung tính | 4/20 cặp còn lại của FN-02 |

  Mỗi bản vá xanh lên một XFAIL → xfail chặt làm CI đỏ → vòng gỡ giới hạn đó khỏi khối máy trong cùng commit. Trường
  `pr_upstream` của khối máy đổi thành con trỏ tới dòng LOCAL-PATCHES; luật «mỗi giới hạn phải mang PR» của hợp đồng
  sửa theo trong cùng vòng (bên viết và bên đọc của khối máy cùng đổi).
- **Móc vào feature-loop** (chỉ đọc trừ autofix):
  - **S0** — đọc bậc của kho: không giao diện → M0, design-floor im; có giao diện → M1; đã khai nguồn (token, manifest
    DS) → M2; đã niêm phong → M3. Một dòng ở intake, không câu hỏi.
  - **S1** — định tuyến chỉ mục tri thức thiết kế (chỉ mục + ≤2 tệp, đếm token); `ui reuse-plan check` trên bản kế hoạch
    dùng lại và `ui flow lint` trên `flow.json`, kết quả lên thẻ Cổng 1 thành dòng thông tin.
  - **Cuối S3** — `ui autofix --write` (lệnh ghi duy nhất, chỉ tệp đích) rồi sinh lại mọi tệp dẫn xuất (bảng kê, registry,
    token) và commit TRONG S3 — TRƯỚC S4.
  - **S4** — tuân thủ DS bằng `ui token-coverage` + hex thô, chạy thành executor `script` (0 token).
- **Luật cứng thành răng:** một ca trong `tests/design-floor/` đỏ khi bất kỳ chỗ móc S4 nào nhắc `ui gate` trong lúc
  khối máy còn giới hạn DF-07. Chiều đỏ: chèn `ui gate` vào bản sao của chỗ móc S4 → ca đỏ đúng thông điệp. Không có
  ngoại lệ «chạy trong bản sao bỏ đi» ở v1. Bản vá A làm DF-07 xanh; `ui gate` ở S4 vẫn là mục chờ điều kiện (bước 5),
  không tự vào vòng này.
- **Chặn theo bậc:** M1 chỉ luật đã phân xử mới chặn; M2 cảnh báo; M3 mọi kiểm chặn. «Đã phân xử» = luật có phán quyết
  khớp sự thật trên bộ đo chéo 14 tệp; danh sách nằm trong hợp đồng của vòng, không trong văn xuôi.

**Ai quyết.** Chủ kho ở các cổng đã có: Cổng Phạm vi phê CỘNG (một plugin mới + bốn điểm móc), Cổng 1.5, Cổng Bằng
chứng. Niêm phong M3 ở kho tiêu thụ là việc khó đảo — câu hỏi người ở cổng của vòng làm việc đó, không phải cổng mới.

**Xong khi.** Bản vendored khớp băm của tệp khoá (trước vá) và sổ LOCAL-PATCHES (sau vá); DF/FN chạy trên bản vendored:
tám XFAIL xanh, giới hạn đã gỡ; mỗi điểm móc có đột biến đỏ; một vòng mẫu trên kho fixture chạy trọn S0→S5 và
`pre-merge-check.sh` không thấy tệp nào đổi sau commit S4; bộ ca kit xanh; vào một bản phát hành 2.x.

**North Star.** Không ghi sau S4: bản vá A + autofix và sinh lại ở S3 + răng `ui gate`. · Lượt người: không dòng thẻ nào
mà câu trả lời duy nhất là «ừ» — dòng design-floor trên thẻ là thông tin, chỉ niêm phong M3 là câu hỏi. · Chi phí: kiểm
tất định 0 token; định tuyến tri thức ở S1 có trần và có số. · Chiều đỏ: tám phép đo đã đỏ thật trên bản ghim (XFAIL) +
đột biến mỗi điểm móc + răng `ui gate`.

### Bước 5 — lộ trình

**Vật ra.** Sau khi #421 gộp và bước 2 xong: bản phạm vi `docs/plans/pham-vi-design-floor-<ngày>.md` (`dot:
design-floor-<ngày>`, `dang: chuoi`, `nguon:` đường trỏ băm tới `wiki/chu-de/design-floor.md` — kho đã khai `tri_thuc`
thì răng phủ chỉ nhận dạng này), rồi skill `cat-luot` cắt thành hàng `docs/plans/lo-trinh-kit.json`. Mỗi hàng mang
`Gốc:` tới `acceptance-gate-kit/_acceptance/design-floor-hop-dong-nhap/` hoặc trang tri thức. Mã dự thảo (lượt cắt
quyết):

| Mã dự thảo | Câu giao | Từ bước |
|---|---|---|
| DF-K1 | Cổng thiết kế của kit trả KHÔNG-ĐO-ĐƯỢC cho ba nguyên nhân thay vì REJECT | 3 |
| DF-V1 | Bản lõi gọn vendored khớp băm, bốn bản vá có sổ LOCAL-PATCHES, kiểm trong CI | 4 |
| DF-S0 | S0 đọc bậc của kho | 4 |
| DF-S1 | S1 định tuyến chỉ mục tri thức thiết kế, kiểm kế hoạch dùng lại và flow lint ở Cổng 1 | 4 |
| DF-S3 | Cuối S3 autofix và sinh lại tệp dẫn xuất trước S4 | 4 |
| DF-S4 | S4 chấm tuân thủ DS bằng độ phủ token và hex thô | 4 |
| DF-P1 | Đo thí điểm năm số trên onehub-invest | 6 |

- **Chờ điều kiện:** `ui gate` ở S4 — mở lại khi DF-07 xanh trên bản vendored và có một vòng thật chứng không ghi gì.
- **Không vào lộ trình:** quyết định giữ/bỏ sau thí điểm (việc của người — liệt «Ra khỏi kho» ở mô tả PR cắt lượt).
- `TT-C5`/`F5` (tri thức của chính kit) rời mục chờ điều kiện trong cùng PR, vì bước 1 đã làm nó; răng phủ quyết chỗ.
- Hàng chỉ gắn vào mốc phát hành 2.x kế tiếp khi đã sẵn (hợp đồng đã duyệt); trước đó đứng ở «Kế tiếp».

**Ai quyết.** Người gộp PR cắt lượt là người chốt. Máy soạn bản phạm vi, hàng, bảng phủ.

**Xong khi.** Răng phủ của `cat-luot` xanh (mọi mã ở đúng một chỗ); mỗi hàng có `Gốc:`; trang tri thức nhận mã vào `ma`.
**Chiều đỏ:** răng phủ đã có của `cat-luot` — bỏ một mã khỏi bản phạm vi trên bản sao → đỏ đúng mã.

**North Star.** Không trong vòng — không ghi sau S4. · Lượt người: một lần gộp PR. · Chi phí: một lượt cắt. · Chiều đỏ:
răng phủ.

### Bước 6 — thí điểm trên onehub-invest

**Vật ra.** Kho nhận bản 2.x có design-floor; máy đọc bậc của kho ở S0; sau ≥10 vòng giao diện, một báo cáo
`docs/findings/<ngày>-thi-diem-design-floor.md` ở kit với năm số. Đường nền: 10 vòng giao diện gần nhất của chính kho
TRƯỚC khi nhận bản (đo bằng `dieu-phoi.mjs dem` cho ký→gộp, `loop-health` cho làm-xong→ký, `usage-report.md` cho
token · phút).

**Tiêu chí chết** (một tiêu chí hỏng → báo cáo nói «chết» kèm số):
1. Thời gian làm-xong→gộp không tăng — **từng đoạn riêng**: trung vị làm-xong→ký và trung vị ký→gộp, so với đường nền.
2. Chi phí máy mỗi kết quả gộp được báo (token · phút), tách phần của design-floor.
3. Không thêm lượt gọi người: số lượt mỗi vòng gộp không vượt đường nền, và 0 lượt ngoài cổng thiết kế do design-floor.
4. Tỉ lệ chặn sai không tệ hơn cổng thiết kế hiện tại của kit, chấm trên CÙNG các vòng (đường nền = cổng của kit ở bản
   phát hành thí điểm bắt đầu, tức đã có bước 3). Chặn sai = FAIL của design-floor mà Cổng Bằng chứng phân xử là sai.
5. Trong ≥10 vòng giao diện, design-floor bắt được ít nhất một lỗi thật mà kit bỏ sót (Cổng Bằng chứng phân xử là thật).
   0 lỗi → không có giá trị → chết.

**Ai quyết.** Máy đo và viết báo cáo. Giữ hay bỏ là của chủ kho, KHÔNG lên lộ trình; hàng DF-P1 chỉ là phép đo.

**Xong khi.** Báo cáo có năm số và nguồn của từng số; quyết định giữ/bỏ của chủ kho được ghi (ngoài lộ trình).
**Chiều đỏ của chính phép đo:** một vòng trên nhánh bỏ đi cài một lỗi DS đã biết → tiêu chí 5 phải đếm được nó; thước
không bắt được lỗi cài là thước chưa chạy.

**North Star.** Không ghi sau S4: đếm số lần `pre-merge-check.sh` chặn vì hồ sơ cũ do design-floor — phải là 0. · Lượt
người: tiêu chí 3. · Chi phí: tiêu chí 2. · Chiều đỏ: vòng cài lỗi ở trên.

## 3. Bốn phép thử North Star — tổng

| Bước | Không ghi sau S4 | Không thêm lượt / không câu chỉ-«ừ» | Chi phí máy mỗi kết quả gộp | Chiều đỏ |
|---|---|---|---|---|
| 1 | ngoài vòng; S1 chỉ đọc | Hỏi-1, một chạm | tra 0 token; đọc trang có trần (nền + ≤2) | raw cài vào bản sao công khai |
| 2 | ngoài vòng | 0 | một lượt ghi | raw sửa một byte |
| 3 | sửa ở kit | cổng thiết kế của vòng | 0 token | ba đột biến + đối chứng |
| 4 | bản vá A; autofix + sinh lại ở S3; răng `ui gate` | dòng thẻ là thông tin; chỉ M3 hỏi | 0 token kiểm; trần định tuyến | tám XFAIL + đột biến mỗi điểm móc |
| 5 | ngoài vòng | một lần gộp | một lượt cắt | răng phủ |
| 6 | đếm chặn-vì-cũ = 0 | tiêu chí 3 | tiêu chí 2 | vòng cài lỗi |

## 4. Câu hỏi cho chủ kho — một lượt

| # | Câu hỏi | Khuyến nghị và căn cứ | Trả lời một chạm |
|---|---|---|---|
| Hỏi-1 | Tạo kho riêng `phanlemanh/acceptance-gate-kit-tri-thuc` và bật tầng tri thức của kit, dùng lượt meta của cửa sổ sau 2.34.0 cho `TT-C5`? | **Có.** Kho kit công khai nên raw không được nằm trong nó; tiền lệ `onehub-invest-tri-thuc` đã chạy; điều kiện mở lại của `TT-C5` đã tới | `Hỏi-1 có` / `Hỏi-1 không` |

Phủ quyết được (máy đã tự điền): thí điểm ở **onehub-invest** thay cho `one-invest` (§0).
