# Điều tra làn ghim lại — cơ chế, số đo, ích lợi thật, và dự báo sau điều chỉnh

Ngày đo: 2026-10-02. Owner đặt: «điều tra kỹ repin trước khi mở hạt giống, dự đoán tác động».
Nguồn: dòng `kind: repin` trong `_acceptance/*/run-log.jsonl` (crm `origin/onehub` 04/09→02/10,
kit `origin/main` 05/08→02/10) · commit có tiền tố `repin` ở crm (155 từ 15/09) · `evals.yaml`
của 144 hồ sơ crm · `scripts/pre-merge-check.sh` (hàm `stale_files`, khối
STALE-DIFF-SCOPE-GUARD) · `feature-loop/scripts/repin-lane.mjs` · GUIDE §7.1.

## 1. Cơ chế thật — vì sao làn chạy theo PR

Ba điều tôi nói sai ở lượt trước, đính chính trước:

- **Luật «một chiến dịch mỗi phát hành» (charter 07/08) nói về ghim lại khi ENGINE đổi.** Làn
  theo PR ở crm sinh từ một luật khác: hồ sơ của CHÍNH nhánh hoá cũ.
- **Luật hoá cũ ĐÃ thu theo diff PR** (ADR 0010, 1.39.2): chỉ hồ sơ có tệp trong diff mới bị
  soi. Nhưng một nhánh tính năng luôn mang hồ sơ của nó trong diff, nên hồ sơ ấy luôn bị soi.
- **`stale_files` so MỌI tệp** đổi từ `verified_commit` tới HEAD (trừ `_acceptance/` và
  `t1_skip_globs`), KHÔNG so theo `paths` của eval. Gộp `onehub` vào nhánh là hàng trăm tệp đổi
  → hồ sơ hoá cũ → phải ghim trước khi mở PR. Đây là nguồn của 100/155 commit ghim ở crm
  («ghim lại sau khi gộp/kéo/trộn onehub»).

Script làn: chạy `suite_keys` (crm: 4 bộ test; từ 02/10 thêm lint và build `--force`) rồi mọi
eval `test`/`script` của từng hồ sơ, **nối đuôi** (`spawnSync` trong vòng lặp, chỉ gộp lệnh
trùng nguyên văn). Đỏ thì không ghi gì — làn đỏ KHÔNG để lại vết trong run-log.

GUIDE §7.1 có sẵn đường rẻ đúng tầng: «ghim lại theo diff» = vòng S4 delta mang theo eval có
`paths` không chạm (carry P1). Thực hành ở crm đi làn ghim (chạy lại TẤT CẢ eval máy) thay vì
S4 delta, vì S4 delta tốn token hội đồng còn làn ghim không tốn token.

## 2. Số đo

| | crm 4 tuần | kit 8 tuần |
|---|---|---|
| làn ghim | 186 (180 sha riêng — hầu như không có làn chạy hai lần cùng cây) | 124 |
| hồ sơ-lượt ghim | 301 trên 112 hồ sơ (12 lần/hồ sơ nhiều nhất; 40 hồ sơ ghim ≥3 lần) | 537 |
| eval máy chạy trong làn | 3 748 = 28 % mọi lần chạy eval máy | 2 930 = 36 % |
| đỉnh | 24–26/09: 22 · 18 · 20 làn/ngày | chiến dịch 2.18.0: 65 hồ sơ · 643 eval · 226 phút |
| nguyên nhân (message commit, crm) | gộp onehub 100 · sau vòng/bản sửa khác 40 · sửa thước 12 · mốc kit 2 · sau chữ ký 1 | — |

**Giá mỗi làn (crm, proxy = commit cha → commit ghim, n = 160, loại > 10 h):** p50 6 phút ·
p75 15 · p90 30 · Σ 38,4 giờ trong 2,5 tuần ≈ **15 giờ/tuần** nằm trên đường găng của PR (phiên
đứng chờ làn rồi mới mở PR). Hồi quy thô: **gap ≈ 13,6 phút + 0,08 phút × số eval** — chi phí
cố định (suite + khởi động) áp đảo, số eval gần như không đổi giá (eval 0–8: p50 4 phút; eval
31+: p50 9 phút). Kit: 97 commit ghim từ 01/09, p50 15 phút, Σ 53,8 giờ; chiến dịch mốc 91–226
phút mỗi lần.

Làn KHÔNG ghi thời lượng (một `ts` cho cả làn) và không có token hội đồng, nên nó vắng mặt ở
dòng 4–5 của luật (c) — chi phí chỉ hiện trên màn hình người ngồi chờ.

## 3. Làn có bắt được gì không — và hình dạng của «chạy lại»

- 0/155 commit ghim ở crm chạm mã sản phẩm: làn chỉ ghi lại bằng chứng, đúng thiết kế.
- **22/160 làn có commit ngay trước là một bản SỬA** (13 sửa mã, 9 sửa test/thước): đó là vết của
  làn đỏ trước đó. Ví dụ thật: Bun 1.3.12 ném lỗi mạng khác kiểu (zalo), đồng hồ giả rò giữa
  các test, E12 mock `next/navigation` thiếu export, ba chân màn hình đổi từ `exit_code` sang
  chân đỏ thật. **Năng suất ≈ 14 % làn dẫn tới một bản sửa**, phần lớn sửa THƯỚC; tiền lệ nặng
  nhất trong sử liệu kit là «hồ sơ mất tiền đề sau hợp nhất 88 commit vẫn xanh» (07/09) — lý do
  làn phải chạy eval, không chỉ suite.
- 22 làn «chạy lại cùng tập hồ sơ trong ≤ 60 phút» KHÔNG phải làn đỏ chạy lại: 21/22 có mã sản
  phẩm đổi ở giữa (nhánh tiếp tục nhận commit rồi phải ghim lần nữa). Làn đỏ không để vết nên
  tỉ lệ đỏ thật của làn **không đo được từ kho** — giới hạn khai.

## 4. Nếu luật hoá cũ so theo `paths` của eval thì sao — đo lại trên lịch sử

Mô phỏng: với mỗi hồ sơ-lượt ghim, lấy diff từ pin trước tới pin mới và so với hợp của `paths`
mọi eval máy trong `evals.yaml` tại pin mới. 95 % eval máy crm khai `paths` (1 700/1 774); chỉ
62 eval dùng glob rộng kiểu `apps/**`.

| | crm | kit |
|---|---|---|
| hồ sơ-lượt ghim xếp loại được | 283 | 475 |
| TRÁNH ĐƯỢC (diff không chạm `paths`) | **123 (43 %)** | 95 (20 %) |
| vẫn cần ghim | 160 | 380 |
| làn mà MỌI hồ sơ tránh được | **70 / 186 (38 %)** | 28 / 124 |
| làn tránh được mà commit ngay trước là một bản sửa (ca luật mới sẽ BỎ LỠ) | **3 / 70** — cả ba là sửa tệp test/`.githooks`, không phải mã sản phẩm | chưa đo |

Đọc: chuyển luật hoá cũ từ «mọi tệp» sang «tệp trong `paths`» cắt gần 4/10 làn ở crm, bỏ lỡ
khoảng 4 % ca đáng chạy, và ca bỏ lỡ là thước đổi (sẽ nổ ở lượt S4 kế của chính hồ sơ đó hoặc
ở chiến dịch mốc), không phải vật đổi.

## 5. Ba đòn bẩy và dự báo trên năm dòng số của luật (c)

Nền tuần W39 crm: 61 ô ký · lượt chấm p50 14 phút · làn ghim ≈ 15 giờ/tuần đường găng.

| đòn bẩy | cơ chế | 1. làm-xong→quyết-được | 2. lượt gọi người | 3. lượt chấm đốt vì hạ tầng | 4. token máy/vòng | 5. phút máy/lượt chấm | rủi ro có tên |
|---|---|---|---|---|---|---|---|
| **P — hoá cũ theo `paths`** | `stale_files` chỉ tính tệp khớp hợp `paths` của eval máy; hồ sơ không khai `paths` giữ luật cũ (đường đọc-cũ) | ↓ 6 h/tuần đường găng crm (−38 % làn) | = | = | = | ↓ (làn không vào dòng 5 — phải thêm thời lượng vào dòng repin trước đã) | bỏ lỡ ≈ 4 % ca, toàn thước; glob rộng vô hiệu hoá lợi ích cho 62 eval |
| **S — suite trong làn chạy song song** | 4 suite bắn cùng lúc, chờ hết; eval vẫn nối đuôi | ↓ 8–9 phút/làn × 186 ≈ 7 h/tuần | = | = | = | ↓ cố định 13,6 → ≈ 5 phút | tranh chấp tài nguyên — nhưng S4 Workflow đã chạy các suite này song song qua tác nhân máy mà không đỏ |
| **R — chỉ chặn hoá cũ ở mốc** | giữa hai mốc lưới chỉ NOTE, làn chạy một chiến dịch/mốc | ↓ ≈ 13 h/tuần (−85–90 % làn) | = | = | = | ↓ | 14 % làn từng dẫn tới sửa bị dời tới mốc; tiền lệ «88 commit vẫn xanh»; đổi mặc định mọi kho |

**Dự báo tổng khi làm P + S** (độc lập, cộng được): làn/tuần 70 → ≈ 43; giá/làn 6 → ≈ 3 phút
p50, 15 → ≈ 7 phút p75; đường găng ghim ≈ 15 → ≈ 4–5 giờ/tuần. Dòng 1 thu được 10 giờ/tuần ở
crm; dòng 2–4 bằng; dòng 5 chỉ đọc được khi làn ghi thời lượng.

**Điều kiện tin cậy (ràng buộc, không phải chỉ số):** (i) dòng `kind: repin` thêm `wall_s` và
số eval; không có nó thì không dòng nào ở trên đọc được — đây là việc đầu tiên, trước P và S;
(ii) P phải có chiều đỏ hai chiều: bản sao bỏ bộ lọc `paths` → làn chạy như cũ (độ nhạy); diff
chạm đúng một tệp trong `paths` → vẫn hoá cũ (độ đặc hiệu); (iii) chiến dịch mốc vẫn ghim
TOÀN BỘ hồ sơ (P không áp cho chiến dịch) — lưới cuối cho ca bỏ lỡ.

**Phép thử «cân trên mọi kho» (luật 26/09):** kho không có bão ghim (radar: 1 làn/tuần) được gì —
không gì; mất gì — không gì, vì P chỉ bớt làn khi diff không chạm `paths`, S chỉ đổi cách chạy.
Hành vi cũ có ai dựa không — lưới trước-merge và recheck đọc dòng repin theo khoá, thêm khoá
`wall_s` là bổ sung, chiều im phải chứng.

## 6. Khuyến nghị

Mở MỘT hạt giống «làn ghim lại: ghi thời lượng · hoá cũ theo paths · suite song song», neo:
`_acceptance/*/run-log.jsonl` crm (186 làn) + hồ sơ này. KHÔNG làm R ở vòng này: nó đổi mặc
định mọi kho, và năng suất 14 % của làn là thật.

## 7. Giới hạn phép đo

- Giờ làn là proxy từ khoảng cách commit; gồm cả phút người ngồi gõ. Loại > 10 h.
- Mô phỏng `paths` dùng glob → regex tự viết; glob lạ có thể lệch vài ca.
- Làn đỏ không để vết; «14 % dẫn tới sửa» đếm từ commit cha, có thể lẫn sửa không do làn.
- Kit: chưa chạy phép «tránh được ∩ có sửa trước».
