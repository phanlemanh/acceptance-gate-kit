# Bộ lọc hoá cũ theo paths đóng mặc định — thiết kế

**Hồ sơ:** `_acceptance/loc-paths-dong-mac-dinh/` · **Hạng:** T3 (chạm `lib/**`, `scripts/pre-merge-check.sh`)
· **Ô cơ hội:** Cổng Đáng ký build 06/10 · **Gốc:** crm/_acceptance/go-khoa-goc-nhin.

## Ý định (chép từ ô, không đổi)

crm đã bật `risk_tiers.stale_scope: paths` và đang được che bằng lưới tạm của chính kho
(`scripts/kiem-paths-dong.mjs`). Kit phải làm việc lưới đó đang làm, để crm gỡ được lưới và để kho
thứ hai bật khoá mà không cần lưới riêng. Thước sống/chết đã chốt ở ô: mọi dạng lưới crm chặn đều
bị bộ lọc từ chối · thư mục trần có thật giữ tệp bên trong · ≥ 115/167 hồ sơ crm áp được · phát lại
tránh ≥ 33 % lượt hồ sơ · kho không bật khoá giữ từng byte.

## Lớp lỗi và nghiệm đúng tầng

Bộ lọc hôm nay nhận MỌI chuỗi làm glob rồi đoán về phía «bỏ qua». Bốn lượt vá trước (lỗi node · tên có
dấu · chú thích và dòng trống · thư mục trần) đều vá một dạng; dạng thứ năm (`/` cuối, `./` đầu, glob
khớp thư mục) lại lọt. Nghiệm đúng tầng là **đảo chiều mặc định**: bộ lọc chỉ được bớt tệp khi chứng
được nó hiểu MỌI mục `paths` của hồ sơ; một mục không chứng được → cả hồ sơ giữ luật cũ, NOTE gọi tên.

## Phân loại một mục `paths` (một hàm, một nguồn)

Hàm mới `phanLoaiMucPaths(muc, cay)` trong `lib/evidence-core.cjs`, `cay` là chỉ mục dựng một lần từ
danh sách tệp git theo dõi ở commit đang kiểm (`dungCayPaths(files)` → tập tệp + tập thư mục suy từ
tệp). Thứ tự xét, dừng ở bước đầu khớp:

| # | Dạng | Kết luận | Glob thật dùng để so |
|---|---|---|---|
| 1 | rỗng / chỉ khoảng trắng | từ chối: `evals-hong` (giữ lý do hiện có) | — |
| 2 | có `\`, có khoảng trắng, mở bằng `./` `../` `/`, kết bằng `/` | từ chối: `dang-khai-la` | — |
| 3 | có `*` hoặc `?`, kết bằng `/**` (hoặc đúng `**`) | khớp ≥ 1 tệp → **nhận**; 0 tệp → `paths-khong-tro-toi-tep` | chính nó |
| 4 | có `*` hoặc `?`, dạng khác | khớp thư mục nào → `dang-khai-la`; khớp ≥ 1 tệp, 0 thư mục → **nhận**; 0 cả hai → `paths-khong-tro-toi-tep` | chính nó |
| 5 | không ký tự glob, là tệp trong cây | **nhận** | chính nó |
| 6 | không ký tự glob, là thư mục trong cây | **nhận** | `<mục>/**` |
| 7 | còn lại (tệp không còn trong cây) | `paths-khong-tro-toi-tep` | — |

Chỉ `*` và `?` là ký tự glob, đúng như `pathGlobToRe`; `[` `(` `{` là chữ thường (đường dẫn Next
`[slug]`, `(app)`). Đối chiếu lưới crm: mọi dạng nó báo LỖI rơi vào bước 1 hoặc 2, TRỪ thư mục trần có thật —
lưới chặn nó vì bộ lọc cũ bỏ qua tệp bên trong; bộ lọc mới nhận nó ở bước 6 như `<thư mục>/**`, đúng
Cổng 0 đã ký. Dạng lưới báo CẢNH BÁO (tệp không còn) rơi vào bước 7. Bước 4 chặt hơn lưới crm (lưới cho qua mọi glob): glob
khớp thư mục mang đúng lỗ của thư mục trần (`apps/*` không khớp `apps/api/x.ts`).

`staleByPaths(staleFiles, evalsText, { prefix, cay })`: sau các bước hiện có (evals hỏng, eval máy
thiếu `paths`, …), phân loại MỌI mục của mọi eval trước khi so; mục đầu tiên bị từ chối → `apply:
false`, lý do `<mã>:<id eval>:<mục>`. Không có `cay` → `apply: false`, `thieu-cay` (đóng mặc định với
bên gọi đời cũ). Khớp tệp dùng glob thật của cột cuối.

**Vì sao cây là danh sách tệp git, không phải đĩa:** đĩa có thư mục chưa theo dõi (`node_modules`,
thư mục dựng) trùng tên một mục trần; git ls-files ở commit đang kiểm là đúng thứ «hồ sơ đo». Tệp bị
xoá trong chính diff không có trong cây → mục trỏ đúng tệp ấy rơi bước 7 → hồ sơ hoá cũ theo luật cũ.

## Hai bên gọi

- **Lưới trước-merge** (`scripts/pre-merge-check.sh`): khi khoá `paths` bật và có ít nhất một hồ sơ cần
  lọc, chạy `git -C "$ROOT" ls-files -z` MỘT lần vào tệp tạm, truyền đường dẫn tệp cho node. ls-files
  lỗi → không có cây → `thieu-cay` → NOTE giữ luật cũ (đúng khuôn «không chạy được» hiện có).
- **Làn ghim lại** (`repin-lane.mjs`): dựng cây một lần tại HEAD; `--skip-unchanged` truyền `cay`.
  Bỏ `pathsCuaEval` riêng và `globToRe` của carry-plan trong `chamTuPin`: dùng `core.evalPathsOf` +
  `core.phanLoaiMucPaths` + `core.pathGlobToRe`. Một ô ngoài làn máy có mục bị từ chối hay không trỏ
  → tính là «diff chạm vật đo» khi diff khác rỗng (chiều nói-nhiều-hơn). Hệ quả đã cân trên mọi kho:
  danh sách `evals_not_machine_touched` chỉ có thể THÊM id, không bao giờ bớt; mã thoát và việc ghi
  hay không ghi pin không đổi. Bảng `AG_ENGINE` thêm ba hàng ĐIỀU KIỆN (`evalPathsOf`,
  `dungCayPaths`, `phanLoaiMucPaths`, `khi: stale_scope=paths`) — giữ luật đã ký của vòng paths
  (AC-10 của nó: kho không bật khoá chạy y như trên bộ máy cũ). Khoá bật mà bộ máy thiếu hàm → làn
  dừng gọi tên hàm, không ghi gì (`engineStop`). Khoá vắng mà bộ máy thiếu hàm (chỉ xảy ra khi
  `--ag-root` trỏ bản kit cũ hơn làn) → `chamTuPin` in một dòng «bộ máy thiếu <hàm> — không tính được
  ô ngoài làn máy có vật đổi» và trả rỗng, đúng khuôn suy giảm nó đã có cho pin không đọc được;
  không giữ bộ đọc thứ hai làm đường lui.

`carry-plan.mjs` (đường verdict S4) KHÔNG đổi — điều kiện tin cậy của luật (c).

## Kho không bật khoá

Lưới trước-merge không gọi bộ lọc khi khoá tắt nên giữ từng byte. Làn: chỉ `chamTuPin` đổi, và chỉ
theo chiều thêm id như trên; kho mà ô ngoài làn máy khai `paths` dạng thường thì giữ từng byte.

## Quét không gian AC (morphological-scan, preset test-matrix)

- Chân sản phẩm: mã engine `lib/evidence-core.cjs`, `scripts/pre-merge-check.sh`,
  `feature-loop/scripts/repin-lane.mjs` [SUY-TỪ-REPO]; dạng khai thật của crm (5 333 mục, 06/10)
  [SUY-TỪ-REPO: _acceptance/loc-paths-dong-mac-dinh/opportunity.md].
- Chân ngành: bộ lọc `on.push.paths` của GitHub Actions — mục `docs` không khớp tệp bên trong, phải
  viết `docs/**` [NGÀNH: GitHub Actions workflow syntax]; CODEOWNERS coi `/` cuối là «thư mục và mọi
  thứ bên trong» [NGÀNH: GitHub CODEOWNERS]. Hai nền lớn chọn hai nghĩa khác nhau cho cùng một cách
  viết — đúng lý do bộ lọc không được đoán.

| Trục | Giá trị | Thước CE |
|---|---|---|
| A. Dạng mục | tệp · glob `/**` · glob chỉ khớp tệp · thư mục trần có thật · rỗng · `./` · `../` · `/` đầu · `/` cuối · `\` · khoảng trắng · glob khớp thư mục · tệp không còn · glob không khớp | lưới crm `kiem-paths-dong.mjs` (7 dạng LỖI + 1 CẢNH BÁO) + phân loại 5 333 mục crm |
| B. Cây | có cây · không có cây · thư mục chỉ trên đĩa · tệp bị xoá trong diff | đường gọi của hai bên |
| C. Bên hỏi | lưới trước-merge · `--skip-unchanged` · `chamTuPin` | AC-7 của vòng paths (một nguồn) |
| D. Khoá | vắng · `paths` | vi phân bản base |

- Core → AC-1…AC-9 (ma trận D 19 ô: 18 dạng của trục A + một hồ sơ trộn; trục B ở AC-4; C ở AC-5, AC-6; D ở AC-7).
- Later: dạng `**/` giữa đường đi qua thư mục (`a/**/b`) đã đúng nghĩa từ vòng glob-hai-sao; brace
  `{a,b}` — hôm nay là chữ thường, mục chứa nó rơi bước 7 (đóng), mở khi một kho khai thật.
- Never: đọc đĩa thay cây git — sai nghĩa «vật đo», xem trên.

## Đo

Răng một tệp `rang.sh`, mỗi chân một AC, fixture code-sinh trong lượt chạy, cặp hai chiều trên cùng
fixture, bản base lấy bằng `git archive <merge-base> scripts lib feature-loop/scripts`. Đối chứng lưới
crm: bản chụp `kiem-paths-dong.mjs` (crm `e753383a`, chép nguyên văn, ghi sha) chạy trên kho fixture
sinh trong lượt — không viết lại luật của nó bằng tay.
