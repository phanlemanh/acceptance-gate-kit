# Thiết kế — lan-ghim-lai-theo-paths

Ngày 03/10/2026 · hạng T3 · ô `_acceptance/lan-ghim-lai-theo-paths/` (Cổng Đáng ký 03/10, «Làm»).
Nguồn: hạt giống `docs/plans/2026-10-02-hat-giong-lan-ghim-lai-theo-paths-va-suite-song-song.md`,
hồ sơ điều tra `docs/findings/2026-10-02-dieu-tra-lan-ghim-lai-va-du-bao.md`.

## Ý định (chốt ở Cổng Đáng, không đổi trong vòng)

Phiên thi công ở crm bớt đứng chờ làn ghim lại vô ích (≈ 15 giờ/tuần trên đường găng PR), mà
không lọt một hồi quy mã sản phẩm nào. Hai món CỘNG, cả hai **kho tự bật** (mặc định TẮT):

- **(b)** hồ sơ chỉ hoá cũ khi diff chạm `paths` các eval của nó;
- **(c)** các lệnh suite trong làn ghim lại chạy song song; eval vẫn nối đuôi.

Việc (a) — dòng `kind: repin` ghi `wall_s` + số lệnh — đã chuyển sang ô
`lan-ghim-lai-giu-tron-loi-loi` và lên mốc trước, để có số nền.

## (b) Vị từ hoá cũ theo `paths`

### Hình dạng: lọc, không thay

Luật cũ (`stale_files` trong `scripts/pre-merge-check.sh`) giữ NGUYÊN, chạy trước. Luật mới là
một **bộ lọc** đặt sau nó: nhận danh sách tệp luật cũ gọi là hoá cũ, trả về tập con khớp hợp
`paths` của hồ sơ. Vì bộ lọc chỉ có thể BỚT dòng, vế «chỉ thu, không bao giờ nới» là cấu trúc,
không phải lời hứa: kho nào bật khoá cũng không thể đỏ ở chỗ hôm nay xanh. Ca kiểm 03/10 cho
thấy vì sao vế này cần: hồ sơ crm `lenh-chung-khong-an-cache-doi` khai `paths` vào
`_acceptance/config.yaml`, mà luật cũ loại `_acceptance/`.

### Hợp `paths` của hồ sơ

- Gom `paths` của MỌI eval có khai (`test`, `script`, `ui-check`, `judgment`). Gom cả ô ngoài làn
  máy vì một lý do đã có tên: làn ghim lại là chỗ duy nhất nói ra «ô ngoài làn máy có vật đổi»
  (`evals_not_machine_touched`, hồ sơ `ghim-lai-noi-ra-o-khong-do`); nếu chỉ gom `paths` eval máy,
  diff chạm vật của một ô ui-check sẽ không còn sinh làn và câu nói-ra ấy im
  (cùng lớp với hạt giống `docs/plans/2026-09-20-hat-giong-skip-unchanged-dap-tat-touched.md`).
- **Một eval máy (`test`/`script`, không tự khai `status: not-run`) thiếu `paths` → cả hồ sơ giữ
  luật cũ.** Không biết eval ấy đo gì thì không được kết luận vật của nó không đổi.
- Hồ sơ không có `evals.yaml`, đọc lỗi, hoặc hợp `paths` RỖNG (không eval nào khai) → luật cũ.
  Hợp rỗng KHÔNG có nghĩa «không vật nào»: đọc thành im là lối fail-open (phản biện 03/10).
- Bộ đọc `paths` nhận cả hai cách viết (một dòng `[a, b]` và block seq) — chính bộ đọc
  `pathsCuaEval` đang sống trong `repin-lane.mjs`, dời về một chỗ hai bên cùng gọi. Khớp glob
  bằng ngữ nghĩa `globToRe` (`feature-loop/scripts/carry-plan.mjs`): `**` xuyên `/`, `*` và `?`
  không xuyên. **Lib phải tự đứng ở kho tiêu thụ** (phản biện 03/10, P0): `lib/` được chép sang kho
  tiêu thụ, còn `feature-loop/` là plugin riêng — lib KHÔNG được nạp tệp nào ngoài danh sách chép.
  Nên lib mang bản khớp glob của chính nó; một ca của bộ răng so bản lib với `globToRe` của
  `carry-plan.mjs` trên một ma trận glob viết trước (`**`, `**/`, `*`, `?`, ký tự đặc biệt) — hai
  bản, MỘT ngữ nghĩa có răng. Không dời `carry-plan` sang gọi lib: nó nằm trên đường verdict S4. Đường dẫn diff tương đối gốc kho git; `paths` tương đối gốc kho của hồ sơ — quy
  về cùng gốc như `chamTuPin` đang làm.

### Một nguồn, hai bên gọi

Vị từ sống ở **một hàm trong `lib/`** (bộ máy acceptance-gate mà kho tiêu thụ đã chép theo danh
sách chép của `acceptance-init`; thêm tệp vào danh sách nếu là tệp mới). Hai bên gọi:

1. `scripts/pre-merge-check.sh` — sau `stale_files`, khi khoá bật: đưa danh sách qua `node` +
   hàm lib. Thiếu `node`, thiếu lib, lib ném lỗi → **giữ danh sách cũ** (fail-closed = chặt hơn)
   và in một dòng NOTE nói vì sao. Khi bộ lọc bớt dòng, in một dòng NOTE
   «hoá cũ theo luật cũ, bỏ qua theo paths: N tệp» — dấu để đếm ca bỏ lỡ ở ngưỡng UAT và để
   người đọc CI thấy bộ lọc đã làm gì; im lặng ở đây thì bộ lọc hỏng trông y hệt một PR sạch.
2. `feature-loop/scripts/repin-lane.mjs --skip-unchanged` — khối `SKIP-UNCHANGED-PREDICATE` hôm
   nay tự tuyên «là ngữ nghĩa `stale_files()`»; khi khoá bật, danh sách `doi` qua CÙNG hàm lib.
   Vế riêng của làn (tệp định nghĩa phép đo `config.yaml` / `evals.yaml` đổi → không bỏ qua)
   giữ nguyên, không qua bộ lọc.

Ca round-trip: cùng diff + cùng `evals.yaml` → hai bên cùng kết luận hoá cũ/không.

### Khoá và cờ chiến dịch

- Khoá: `risk_tiers.stale_scope: paths` (vắng hoặc `all` = luật cũ). Giá trị khác → VIOLATION
  `[config]` gọi tên giá trị, cùng nếp `gap_probe:` (không âm thầm rơi về mặc định).
  Đặt dưới `risk_tiers` vì nó là anh em của `t1_skip_globs` — cùng một câu hỏi «tệp nào đổi thì
  bằng chứng hết hạn».
- **Cờ chiến dịch `--stale-all`** cho `pre-merge-check.sh`: bỏ qua bộ lọc bất kể khoá. Lý do có
  số: chiến dịch ghim lại ở mốc chọn hồ sơ bằng chính lưới này (`--base <tag mốc trước>`, sổ
  bàn giao 2.20 bước 8). Ở kho tiêu thụ, `paths` hiếm khi trỏ vào engine đã chép vào, nên không
  có cờ thì chiến dịch sẽ chọn gần như 0 hồ sơ — đúng lưới cuối mà hạt giống dựa vào cho ca
  bỏ lỡ. GUIDE §7.1 và sổ bàn giao mốc ghi cờ này vào công thức chiến dịch.

## (c) Suite song song trong làn

- Khoá `feature_loop.repin_parallel_suites: true` (vắng/false = nối đuôi như cũ).
- Bật: các lệnh suite (sau khi gộp lệnh trùng) bắn cùng lúc, chờ hết, rồi eval chạy nối đuôi như
  cũ. Mảng `suites_exit` giữ ĐÚNG thứ tự `suite_keys`, không theo thứ tự xong. Một suite đỏ → làn
  đỏ y như cũ; đầu ra của mỗi suite giữ riêng (không xen dòng), và lời lỗi đi đúng đường mà ô
  `lan-ghim-lai-giu-tron-loi-loi` dựng (ghi trọn ra tệp).
- Chụp hồ sơ đã thông cổng (`chup-ho-so-da-thong`) vẫn trước suite đầu, sau eval cuối — không đổi.
- Điều kiện kho nên thoả trước khi bật (ghi ở GUIDE, không cưỡng chế): không suite nào cùng ghi
  một tài nguyên với suite khác (crm: `suite_api` và `suite_agent_db` cùng chạm DB test — đo
  trước khi bật), và không eval nào tự gọi làn/suite bên trong (crm E14 — song song lồng song
  song).

## Lối đã loại (ghi vào sổ quyết định)

- Viết lại `stale_files` thành luật paths thay vì lọc sau — mất vế «chỉ thu» dạng cấu trúc.
- Chỉ gom `paths` eval máy (như hạt giống ghi) — im câu nói-ra của ô ui-check (lý do ở trên).
- Bật mặc định cho mọi kho — luật 26/09: đổi mặc định là mọi kho trả giá; bật-theo-lựa-chọn đứng trước.
- Chọn việc theo đồ thị phụ thuộc kiểu Nx `affected` / Turborepo `--affected` — đúng hơn cho tệp
  phụ thuộc gián tiếp nhưng là một máy hiểu mã theo từng ngôn ngữ; ngoài phạm vi engine. Lưới cho
  điểm mù này: chiến dịch mốc ghim toàn bộ + glob rộng mà kho đã tự khai.

## Giới hạn khai, kèm ngưỡng đang đếm

- **Phụ thuộc gián tiếp ngoài `paths`** không làm hồ sơ hoá cũ. Ngưỡng: ≥1 ca bỏ lỡ chạm mã sản
  phẩm (đã là dòng CHẾT của ngưỡng UAT).
- **Khuyến khích ngược:** sau (b), glob hẹp là bớt ghim, nên có thể thu `paths` để né làn. Lưới:
  chiến dịch mốc; ngưỡng như trên.
- **(c) chưa có chứng song song an toàn trên crm** — giả định 3 của ô; đo trước khi crm bật.

## Kiểm thử

Bộ răng hồ sơ `_acceptance/lan-ghim-lai-theo-paths/rang.sh`, mỗi chân một AC, fixture do code sinh
trong chính lượt chạy (kho git tạm), chạy CHÍNH `pre-merge-check.sh` / `repin-lane.mjs` thật, mỗi
chân một cặp hai chiều trên cùng fixture: bản lành xanh trước, bản sao bị tiêm đỏ với thông điệp
ghim. Chi tiết ở `evals.yaml`.
