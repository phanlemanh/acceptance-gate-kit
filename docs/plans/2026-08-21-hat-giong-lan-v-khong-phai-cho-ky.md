# Hạt giống — hồ sơ làn V không phải «chờ ký»

**Ngày:** 2026-08-21 · **Trạng thái:** hạt giống, chờ Cổng 0 · **Hạng dự kiến:**
T2 (hai bộ đọc hồ sơ: máy quét vào phiên + bản đồ sản phẩm; không chạm lưới
trước-merge, không chạm lưới ghi-lúc-viết, không thêm trường nào vào hồ sơ).
**Sinh từ:** phiên 21/08 — owner hỏi «hạng mục nào ở chờ-chữ-ký đã lỗi thời»;
bốn trên bốn đều lỗi thời, hai vì thiếu trạng thái «xếp lại» (đã xử bằng PR
xoá #73), hai vì lỗ này.

> Chữ trong file này là NGUỒN. Chưa có hình; điểm quyết định chỉ có một nhánh
> rẽ, bảng là đủ (ngưỡng N5).

## 0. Tóm tắt một đoạn

Đợt 2 dựng **làn V**: hồ sơ T2 xanh-sạch đi qua cổng mà không chờ chữ ký, cửa
veto mở, «người veto lúc nào cũng được». Hai bản phát hành 2.0.0 và 2.1.0 đi
đúng làn đó, đã qua biên merge, đã bị 2.2.0 (ký 18/08) chồng lên. Nhưng **máy
quét vào phiên** (`/start`) và **bản đồ sản phẩm** vẫn đọc chúng là «chờ Cổng
Bằng chứng» / «đang làm» — vì cả hai bộ đọc chỉ biết *verified + PASS + chưa
chữ ký = chờ ký*, không biết *làn V*. Kết quả: thẻ vào phiên đòi đúng lượt gọi
người mà hồ sơ M1 được dựng để **không đòi** (sổ quyết định release-2-1-0:
«lượt owner gọi ngoài merge = 0»). Đề xuất **TRỪ một suy diễn sai**: hồ sơ có
`veto_state: mo` và verdict PASS thì xếp vào **«đã giao · cửa veto mở»**, không
xếp vào chờ ký — cùng cách đọc mà lưới trước-merge đã dùng (dòng `NOTE: làn V —
máy đi trước … cửa veto mở`). Không thêm trường, không thêm trạng thái, không
có «cửa đóng» — vì theo đúng luật làn V, cửa veto **không có hạn**.

## 1. Lỗ — bằng chứng trên nguồn

| Bộ đọc | Đọc hồ sơ làn V thế nào | Nguồn |
|---|---|---|
| Lưới trước-merge | `NOTE [slug]: làn V — máy đi trước, Cổng 1 không có chữ duyệt; cửa veto mở` — không chặn, không đòi | `scripts/pre-merge-check.sh` khối sáu-điều-kiện xanh-sạch (≈322–340, 709–722) |
| Máy quét vào phiên | `status === 'verified'` → có evidence, verdict settled, không signoff → **`gates: bang-chung`** | `scripts/start-scan.mjs:196-206` |
| Bản đồ sản phẩm | approved/implemented/verified gộp một ô **«Đang làm»** (cố ý thô) | `scripts/product-map.mjs:5` |

Ba bộ đọc, hai cách hiểu. Chính chú thích ở `start-scan.mjs:197-199` đã tự
cảnh báo lớp này — «verified không kèm điều kiện là hiện chờ ký oan (S4-r1)» —
rồi sửa bằng điều kiện *verdict đã chốt*, nhưng không tính tới làn V vì làn V
sinh sau (đợt 2, 15/08; start-scan ship 1.30.0 đầu 08).

Hai hồ sơ đang chịu: `release-2-0-0` (verified, `veto_state: mo`, mở 15/08,
`approved_by: Manh Phan` từ Cổng 1) và `release-2-1-0` (verified, `veto_state:
mo`, mở 16/08, `approved_by` rỗng — làn V cả hai cổng). Thẻ `/start` 21/08 xếp
cả hai vào «Chờ chữ ký của anh»; bản đồ in «Đang làm: 2 việc». Thực tế: plugin
trong repo đã là 2.2.0, ký 18/08.

Quét xác nhận: toàn bộ hồ sơ `status: verified` hôm nay **chỉ có đúng hai** hồ
sơ này — tức mọi hồ sơ verified-không-ký trong xưởng đều là làn V; ô «chờ Cổng
Bằng chứng» của máy quét hiện **không có ca nào đúng**.

## 2. Kiểm bằng first principles từ North Star

| Nguyên tố | Lỗ | Người hưởng cụ thể | Kết |
|---|---|---|---|
| ③ Khoảnh khắc quyết thật | Thẻ vào phiên trình hai «cổng» mà câu trả lời hợp lý duy nhất là «ừ» — định nghĩa trạm thu phí trong North Star | Owner mỗi lần `/start` (bốn dòng chờ-ký, hai dòng giả) | **Trượt** |
| ② Bằng chứng không tự dối | Bản đồ nói «đang làm 2 việc» cho hai bản đã phát hành và đã bị chồng | Người đọc bản đồ để biết xưởng đang làm gì | **Trượt** |
| ① Ý định chốt trước | không chạm | — | — |

Ba giả định dễ tự lừa đã kiểm:

- *Có phải chỉ cần ký bù hai hồ sơ là xong?* — **Không.** Ký 2.0.0 sau khi 2.2.0
  đã ký là hình thức thuần, và hồ sơ làn V kế tiếp sẽ lại rơi vào đúng ô này.
  Sửa bộ đọc, không sửa hồ sơ.
- *Có cần trạng thái «cửa veto đã đóng» không?* — **Không.** SKILL 4c: «V là
  cổng VẪN MỞ, người veto lúc nào cũng được». Cửa không có hạn thì không có
  «đóng»; thêm trạng thái là CỘNG một thứ luật không cần. Bản sau chồng lên
  không đóng cửa bản trước về mặt luật — nó chỉ làm veto **không còn đáng**,
  và đó là việc người cân, không phải máy suy.
- *Có phải CỘNG không?* — Là **TRỪ một suy diễn**: bỏ nhánh «verified + PASS +
  không chữ ký ⇒ chờ ký» cho hồ sơ có `veto_state: mo`. Hai bộ đọc về cùng
  cách hiểu với lưới trước-merge — một luật, ba chỗ đọc, thay vì hai luật.

## 3. Đề xuất — một luật đọc, hai chỗ áp

**Luật:** hồ sơ có `veto_state: mo` (vết giờ parse được — đúng điều kiện lưới
đang kiểm) **và** evidence verdict PASS ⇒ **đã giao, cửa veto mở**. Không phải
cổng, không phải đang làm.

| Chỗ áp | Hôm nay | Sau |
|---|---|---|
| Máy quét vào phiên (`start-scan.mjs`) | `gates: bang-chung` | `done` với `state: 'v-mo'` (hoặc tên do bảng nhãn chung đặt); thẻ `/start` đếm gộp ở dòng cuối kèm «(trong đó N làn V, cửa veto mở)» — **không** dòng riêng, không câu hỏi |
| Bản đồ sản phẩm (`product-map.mjs`) | ô «Đang làm» | ô «Đã giao», tên việc kèm hậu tố «· cửa veto mở» — cùng chữ với dòng NOTE của lưới |
| Lưới trước-merge | NOTE làn V | **không đổi** — nó đã đúng |

Nhãn «cửa veto mở» lấy từ **bảng nhãn chung trong lib** (nơi `map.label` đang
lấy), để ba bộ đọc in cùng một chữ; không tự chế chuỗi ở từng file (lớp
«hai-bản-chép-trong-cùng-một-file» đã dẫm).

`veto_state: da-veto` **giữ nguyên đường cũ**: đó là một quyết định người đã
phát ngôn, lưới chặn tới khi xử — nó phải hiện ở nơi người thấy (hôm nay máy
quét xếp `da-veto` ra sao cần kiểm khi mở hồ sơ; nếu đang rơi vào «chờ ký» thì
đó là ca đúng của ô ấy, giữ).

**Không làm:** không ký bù 2.0.0/2.1.0 · không xoá hai hồ sơ đó (sổ M1 nằm
trong `decisions.jsonl`) · không thêm trạng thái «đóng» · không thêm trường
nào vào contract · không đụng SKILL 4c · không đụng lưới trước-merge.

## 4. Chiều đỏ — thước gắn vào vật, ma trận viết trước

Vật là **JSON của máy quét** và **PRODUCT-MAP.md vẽ ra** — hai đầu ra thật;
fixture workspace do code sinh trong chính lần chạy, đi qua chính hai script.

| Vật | R+ | R− (ghim đúng thông điệp) | R0 (cô lập lớp) |
|---|---|---|---|
| JSON máy quét | workspace verified + PASS + `veto_state: mo` + `veto_opened_at` ISO → nằm trong `done`, **không** trong `gates` | cùng workspace, gỡ `veto_state` → về `gates: bang-chung` như cũ (đường cũ còn sống) | workspace verified + PASS + `veto_state: da-veto` → **không** vào `done` (veto đã phát ngôn không được «đã giao») |
| PRODUCT-MAP.md | cùng fixture → tên việc nằm dưới «Đã giao» kèm «cửa veto mở» | gỡ `veto_state` → về «Đang làm» | `veto_opened_at` không parse được → **không** xếp đã giao (cùng sàn với lưới: V không vết là bỏ-cổng lặng) |
| Một chữ ba nơi | chuỗi nhãn trong JSON/map **bằng** chuỗi NOTE của lưới, đọc từ cùng hằng trong lib | bản sao map hardcode chuỗi khác → ca đỏ «nhãn lệch nguồn» | — |

R0 hàng 1 là chân quan trọng nhất: thiếu nó, luật «V ⇒ đã giao» dễ được viết
thành «có veto_state ⇒ đã giao», và một hồ sơ **bị veto** sẽ biến mất khỏi mọi
chỗ người nhìn — đúng chiều nguy hiểm nhất của lớp lỗi này.

Ca tự-host của kit chạy được ngay: hai hồ sơ release thật là R+ sống; nhưng
**đừng** kết luận từ chúng — chúng sẽ đổi (bản đồ vẽ lại) trong chính hồ sơ
này; fixture code-sinh mới là thước.

## 5. Vấp dự đoán

- **Bảng nhãn chung** — `map.label` đang rút từ một bảng trong lib (hồ sơ
  start-scan-hardening); thêm nhãn mới vào **đúng bảng đó**, đừng mở bảng thứ
  hai.
- **Round-trip `START-SCAN-KEYS`** — thân lệnh `/start` khai danh sách key JSON
  nó đọc (`groups.done[].state`); giá trị mới của `state` phải được thân lệnh
  biết để đếm «trong đó N làn V». Ca round-trip của start-command canh đổi
  tên key, **không** canh giá trị — kiểm tay một lần.
- **Bản đồ vẽ lại trong cùng lượt** — hồ sơ này làm hai release đổi ô ⇒
  `PRODUCT-MAP.md` đổi ⇒ CI `--check` đỏ nếu quên vẽ lại (lớp «vẽ bản đồ sau
  chữ ký» ×2 đã dẫm).
- **Đếm «đã giao»** trong bản đồ sẽ nhảy +2; dòng tổng của thẻ `/start` cũng
  vậy — không phải lỗi, ghi trước để người đọc diff khỏi ngạc nhiên.
- **Hồ sơ này có thể tự đi làn V** (T2, hai script không thuộc t3_paths) — nếu
  vậy nó là R+ sống thứ ba cho chính luật của nó sau khi merge.

## 6. Điều cố tình không làm

Không dựng «thời hạn veto» hay «tự đóng khi bản kế ký» — luật làn V nói cửa
không hạn, và việc một bản bị chồng lên làm veto *không còn đáng* là điều
người cân khi nhìn, không phải máy suy · không gom luật này vào hồ sơ B «ba
chỗ tích luỹ» (Cổng 0 đã gật phạm vi, thêm mục sau cổng là đổi đề bài sau
lưng chữ ký) · không sửa `start-scan` để đọc `decisions.jsonl` tìm entry xếp
lại — lỗ «xếp lại» đã xử bằng xoá (#73), và đọc sổ quyết định để suy trạng
thái là mở bộ đọc thứ hai cho một thứ đã có frontmatter.

## Nguồn

- Luật làn V: `skills/acceptance/SKILL.md` mục 4c; sổ đợt 2 veto-có-dấu-vết
  (`_acceptance/veto-co-dau-vet/`), ADR 0012.
- Ba bộ đọc: `scripts/pre-merge-check.sh` (sáu điều kiện xanh-sạch),
  `scripts/start-scan.mjs:196-222`, `scripts/product-map.mjs:5`.
- Hai hồ sơ đang chịu: `_acceptance/release-2-0-0/contract.md`,
  `_acceptance/release-2-1-0/{contract.md,decisions.jsonl}` (entry revisit M1).
- Lớp lỗi liên quan: hai-bản-chép-trong-cùng-một-file, vẽ-bản-đồ-sau-chữ-ký —
  sổ nhớ phiên; «verified không kèm điều kiện là hiện chờ ký oan» — chú thích
  S4-r1 ngay trong `start-scan.mjs`.
