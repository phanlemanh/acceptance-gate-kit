---
schema_version: 1
feature: Lộ trình vào kit, lát 1 — ổ cắm đọc tệp ý định của kho, trạng thái suy từ hồ sơ bằng bảng ô của bản đồ sản phẩm, ba dòng thẻ start, trang LO-TRINH.html cạnh PRODUCT-MAP.md, feature-loop S0 nhận một hàng; kit không ghi tệp ý định
slug: viec-ke-theo-plan
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/ (lo-trinh.mjs mới, product-map, start-scan) + commands/{start,approve,signoff,observed}.md + SKILL feature-loop + SKILL uat-session + test — không chạm lib/**, hook, lưới trước-merge
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-02-viec-ke-theo-plan-design.md
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-02T22:29:00Z
---

# Acceptance Contract: viec-ke-theo-plan

## Context

Chủ kho đã dựng lộ trình bằng tay ba lần ở hai kho, mỗi lần một khuôn, trạng thái gõ tay dù sự
thật đã nằm trong hồ sơ cổng: 12 commit «bản chụp» trong 4 ngày; 23/48 tin owner ở lượt 4 OKR là
hỏi tiến độ. Lát 1 cho kit một ổ cắm ĐỌC tệp ý định do kho viết, suy trạng thái từ `_acceptance/`
bằng đúng hàm xếp ô của bản đồ sản phẩm, rồi in lên thẻ start và một trang tĩnh. Người hưởng: owner
ở phiên điều phối và mọi phiên S0. Trace: nguyên tố 1.

Source input: `_acceptance/viec-ke-theo-plan/opportunity.md` (Cổng Đáng `build`, Phan Le Manh,
2026-10-02T11:09:50Z) · hạt giống `docs/plans/2026-09-06-hat-giong-viec-ke-theo-plan.md` §«Cập nhật
02/10» và §8 · owner duyệt hướng thiết kế trong phiên 02/10.

## Criteria

- AC-1: Given một kho KHÔNG khai `lo_trinh.tep` (fixture do code sinh, có hồ sơ ở nhiều ô), When chạy `product-map.mjs` ghi, `product-map.mjs --check` và `start-scan.mjs` bằng cây đang kiểm và bằng một bản sao trọn `scripts lib skills` của cây đó trong đó `scripts/lo-trinh.mjs` bị thay bằng mô-đun ném lỗi «LO-TRINH-GOI-KHI-VANG» ở mọi lối, Then hai bản cho `PRODUCT-MAP.md` giống từng byte, JSON quét giống từng byte và có `loTrinh: null`, không có `LO-TRINH.html`, và bản sao không ném — tức mã lộ trình không được gọi khi ổ cắm vắng; bản sao product-map luôn vẽ trang → CHÍNH phép đo của vế xanh, chạy lại trên bản sao, trả về thông điệp «trang sinh khi ổ cắm vắng» (thông điệp lấy từ đầu ra của phép đo, không do ca đỏ tự gán). Đo một lần trên bốn kho thật không khai (oneflow, radar, aes, media-library), so mã trước vòng `418436ce` với nhánh, ghi kết quả vào Notes.
- AC-2: Given tệp ý định có hàng đủ trường bắt buộc + tuỳ chọn + trường tự do, hàng thiếu `ma`, hàng thiếu `cau_giao`, hàng thiếu `hang`, và hai hàng trùng mã, When đọc, Then hàng giữ thứ tự tệp và giữ nguyên mọi trường tự do; hàng thiếu `ma` hoặc `cau_giao` có đúng một cờ vàng nêu mã (hoặc vị trí) và tên trường; mã trùng có cờ nêu mã; hàng thiếu `hang` hay trường tuỳ chọn khác KHÔNG có cờ; mọi hàng vẫn hiện trên trang.
- AC-3: Given ba khối sáu trường rút từ ba lộ trình thật (crm OKR · crm Kho tài liệu · oneflow lát cắt chứng minh) lưu làm fixture, mỗi khối ghi trong `_nguon` số hàng, các trường tự do, số ô bắt buộc thiếu và mã trùng của NGUỒN, When đọc, Then số hàng bằng `_nguon.so_hang`, mọi trường tự do khai trong `_nguon` còn nguyên ở ít nhất một hàng, số cờ thiếu trường bắt buộc bằng `_nguon.thieu_bat_buoc` và tập mã trùng bằng `_nguon.ma_trung` — tức khuôn phủ cả ba nguồn mà không bỏ trường nào, và cờ chỉ nói đúng khoảng trống có thật trong nguồn.
- AC-4: Given hàng có `slug` trỏ hồ sơ nằm ở mỗi ô của bản đồ (cân nhắc · sắp mở · chờ duyệt · đang làm · chờ nghiệm thu · đã giao · đã nghiệm thu · xếp lại · đã bác · hỏng), hàng slug dự kiến chưa có thư mục, hàng không slug có và không có tự khai, When vẽ, Then chữ trạng thái mỗi hàng có hồ sơ đúng bằng tiêu đề mục mà `PRODUCT-MAP.md` vẽ cùng lượt xếp slug đó (so bằng nhau từng hàng, rút từ bản đồ thật); hàng slug dự kiến in «Chưa mở» KHÔNG cờ; hàng không slug in tiêu đề ô tự khai hoặc «Chưa mở», kèm «(tin theo lời)», đúng bảng §Trạng thái của design doc; bản sao dùng bảng chữ riêng cho một ô → đỏ, thông điệp ghim nêu slug và hai chữ.
- AC-5: Given hàng có hồ sơ mang `trang_thai` tự khai bằng một tiêu đề ô KHÁC ô suy từ hồ sơ, hàng tự khai TRÙNG, và hàng tự khai ngoài từ vựng ô, When vẽ trang và chạy `start-scan.mjs`, Then trang in ô suy từ hồ sơ kèm cờ «tệp khai khác hồ sơ: khai <X>, hồ sơ <Y>» cho hàng lệch, không cờ cho hàng trùng, in «tự khai: <giá trị>» cho hàng ngoài từ vựng; `loTrinh.co` bằng đúng danh sách cờ trên trang; trang và `loTrinh.tuKhaiNgoai` cùng nói số hàng ngoài từ vựng; khối `tu_vung` của tệp quy đổi chữ riêng của kho sang tên trạng thái trước khi so, đích sai có cờ; trên fixture crm OKR thật, bảng từ vựng tự khai được in và số ngoài từ vựng được ghim cả khi chưa khai và khi đã khai `tu_vung`; đổi một hồ sơ KHÔNG hàng nào trỏ tới → không hàng nào đổi cờ.
- AC-6: Given kho có khoá, When chạy bộ vẽ hai lần liền, Then `LO-TRINH.html` giống từng byte, không chứa ngày giờ chạy, không có `<script`, `src=` hay `href=` ra ngoài; `--check` in «LO-TRINH.html khớp tệp ý định và hồ sơ.» exit 0; sửa một byte trang, hoặc đổi `status` một hồ sơ có hàng trỏ mà chưa vẽ lại, hoặc xoá trang → `--check` exit 1 với thông điệp ghim chứa «LO-TRINH.html» và lệnh vẽ lại.
- AC-7: Given tệp ý định trong fixture, When chạy lần lượt bộ vẽ ghi, `--check`, `start-scan.mjs` và `lo-trinh.mjs --hang`, Then băm SHA-256 và mtime của tệp ý định trước và sau bằng nhau; bản sao ghi lại tệp sau khi đọc → CHÍNH phép đo của vế xanh, chạy lại trên bản sao, trả về thông điệp «tệp ý định bị ghi» kèm tên lệnh đã ghi (thông điệp lấy từ đầu ra của phép đo).
- AC-8: Given khoá trỏ tệp vắng, tệp JSON hỏng, đường dẫn thoát ra ngoài gốc kho, và gốc JSON không phải object, When chạy bộ vẽ và bộ quét, Then mỗi ca: bộ vẽ ghi thoát 0, trang có một khối nêu đúng lý do của ca, `loTrinh.loi` mang cùng lý do, stderr không có stack trace Node; đối chứng: tệp lành thì `loTrinh.loi` là null.
- AC-9: Given ma trận hàng kế viết trước — hàng không slug không tự khai · không slug tự khai ngoài tập đã giao · slug dự kiến chưa có thư mục · slug ở ô cân nhắc · slug ở ô sắp mở · hàng có một hàng đứng trên chưa giao · hàng trỏ mã lạ · không slug tự khai không quy đổi được («Không suy được», không bao giờ là hàng kế) · đứng trên hàng không slug tự khai quy đổi sang đã giao — cùng mốc quá ngày gắn hàng chưa giao và mốc quá ngày gắn hàng đã giao, đồng hồ ghim bằng `ACCEPTANCE_TODAY`, When chạy `start-scan.mjs` trên từng biến thể thứ tự, Then `loTrinh.hangKe` đúng bằng giá trị ghim trước cho từng biến thể (theo định nghĩa §Trạng thái), hàng trỏ mã lạ không bao giờ là hàng kế và có cờ, `loTrinh.hangTre` liệt đúng hàng chưa giao của mốc quá ngày, `loTrinh.tinTheoLoi` đúng `{n, tong}`; dời đồng hồ về trước mốc → `hangTre` rỗng; trên fixture crm OKR thật, `hangKe` khác null; khối `START-SCAN-KEYS` của `commands/start.md` chứa đủ khoá `loTrinh.*` mà script sinh (round-trip).
- AC-10: Given ba ca biên lấy từ crm — một vòng phủ nhiều mã (năm hàng cùng một slug), một mã tách hai vòng (hai hàng hai slug), hàng đổi hạng giữa đường (tệp `T2`, hợp đồng `risk_tier: T3` có chú thích cuối dòng đúng như khuôn hợp đồng thật) — và một hồ sơ chỉ có `opportunity.md`, When vẽ, Then năm hàng cùng slug mang cùng trạng thái và không cờ trùng slug, hai hàng tách mang trạng thái riêng của từng hồ sơ, hàng đổi hạng có đúng một cờ «hạng tệp T2, hồ sơ T3», hồ sơ chỉ có cơ hội không có cờ hạng, và hợp đồng `risk_tier: T2  # …` khớp hàng `T2` không có cờ.
- AC-11: Given kho có hồ sơ không hàng nào trỏ, mốc, mục đã bác, và hàng có slug ở các quyết định Cổng Đáng khác nhau, When vẽ, Then trang có khối «Vòng ngoài lộ trình» liệt đúng các slug đó kèm số, không cờ; khối mốc và khối đã bác liệt đủ mục kèm lý do; dòng «Hàng sống qua Cổng Đáng: k/n» đúng định nghĩa ở design doc, mỗi slug đếm một lần.
- AC-12: Given khoá có, tệp có hàng `9b`, và thư mục làm việc là kho fixture KHÔNG chứa `scripts/lo-trinh.mjs`, When chạy lệnh rút NGUYÊN VĂN từ khối `S0-NHAN-HANG` của SKILL feature-loop, chỉ thay `<mã>` = `9b`, với `WORKFLOWS_DIR` và gốc bộ giải gói đặt như harness đặt, Then thoát 0 và in JSON có `ma` `cau_giao` `vi_sao` `hang` `slug` `bat_khi` `dung_tren` đúng giá trị tệp; mã không có → exit 1, thông điệp ghim «không có hàng»; vắng khoá → exit 1, thông điệp ghim «kho chưa khai lo_trinh.tep»; bản sao khối dùng đường `scripts/lo-trinh.mjs` tương đối → đỏ, thông điệp ghim «lệnh S0 không chạy được ở kho tiêu thụ».
- AC-13: Given khuôn mẫu `skills/acceptance/references/lo-trinh-template.json`, When bộ đọc đọc nó, Then 0 cờ và mọi trường của khuôn ra đúng vai (bắt buộc, tuỳ chọn, tự do); bản sao khuôn đổi tên `cau_giao` → đỏ với cờ thiếu trường nêu `cau_giao`.
- AC-14 (judgment): Given trang `mau/lo-trinh-crm-okr.html` sinh từ fixture crm OKR cộng cây hồ sơ do code sinh (vật máy sinh, test giữ bằng nhau với bản vẽ lại), When một người đọc chưa biết kho đọc riêng trang đó trong một phút, Then người đó trả lời được ba câu bằng chữ trên trang: hàng nào làm kế và các hàng nó đứng trên đang ở đâu, mỗi hàng đang ở đâu và hàng nào chỉ là tin theo lời, chỗ nào tệp khai lệch hồ sơ.
- AC-15: Given cây ở commit đã kiểm, When chạy `product-map.mjs --check` của kho kit và các suite `scripts` · `plugins` · `hooks` · `workflows`, Then tất cả thoát 0 (kho kit không khai `lo_trinh.tep` nên bản đồ không đổi).
- AC-16: Given một kho khai `lo_trinh.tep`, có `PRODUCT-MAP.md` và `LO-TRINH.html` được `risk_tiers.t1_skip_globs` phủ, và một hồ sơ có hàng trỏ vừa đổi ô bản đồ, When chạy NGUYÊN VĂN khối `MAP-STAGE` của từng thân lệnh đóng cổng (`/acceptance-gate:approve`, `/acceptance-gate:signoff`, `/acceptance-gate:observed`, phiên nghiệm thu) sau khi thay `${CLAUDE_PLUGIN_ROOT}` bằng gốc gói như harness thay và KHÔNG gán sẵn biến nào, rồi commit và chạy `product-map.mjs --check` trên một bản clone sạch của commit đó, Then `--check` thoát 0 ở cả bốn thân; khối giống hệt nhau ở bốn thân; trong mỗi thân khối đứng SAU bước ghi trường của cổng (approve: dòng sửa frontmatter `status: approved` · signoff: bước 7a ghi trường người · observed: bước đặt `status: da-cham-boi-thuc-te` · phiên nghiệm thu: dòng người ký điền `verdict`), và bản sao đặt khối ngay TRƯỚC bước ghi đó thì phép đo nêu tên thân; bản sao khối bỏ phần tự lấy gốc gói thì chạy nguyên văn đỏ với lỗi không tìm thấy bộ vẽ; kho KHÔNG khai lộ trình chạy cùng khối thì thoát 0 và chỉ đưa bản đồ vào commit; bản sao khối chỉ đưa bản đồ → `--check` trên clone thoát 1 nêu «LO-TRINH.html»; kho khai lộ trình mà không glob nào trong `t1_skip_globs` phủ `LO-TRINH.html` (khớp bằng đúng bộ khớp glob của lưới trước-merge) → `--check` thoát 1 nêu «t1_skip_globs»; glob tương đương (`**/LO-TRINH.html`, `*.html`) thì thoát 0.
- AC-17: Given hàng có `dung_tren` không phải mảng (chuỗi, số, object) và mốc có `hang` không phải mảng, When đọc và tính hàng kế, hàng trễ, Then mỗi trường sai kiểu có đúng một cờ nêu mã hàng (hoặc tên mốc) và tên trường; hàng có `dung_tren` sai kiểu không bao giờ là hàng kế; mốc có `hang` sai kiểu không làm mất cờ của mốc khác; trường đúng kiểu không có cờ.
- AC-18: Given kho có khoá và tệp có hàng `9b`, When phiên S0 nhận một đối số, Then chỉ đối số là MỘT mã khớp mẫu trong khối `S0-MA-HANG-RE` mới được đưa vào lệnh tra (khối `S0-NHAN-HANG`, mã trong nháy đơn); mọi mã `ma` của ba lộ trình thật đều khớp mẫu; một mô tả nhiều từ chứa backtick, `$(...)`, dấu, ngoặc và chấm phẩy KHÔNG khớp, nên không lệnh shell nào chạy (tệp canh mà backtick và `$(...)` định tạo không tồn tại); SKILL nói rõ đối số không khớp mẫu và mọi mã thoát khác 0 đều là mô tả việc; bản sao mẫu nhận-mọi-thứ cộng nháy kép → tệp canh bị tạo.

## Coverage

Quét bằng `morphological-scan` (preset entity-feature, thực thể = hàng lộ trình + tệp ý định).
Chân sản phẩm: `[SUY-TỪ-REPO: docs/plans/2026-09-06-hat-giong-viec-ke-theo-plan.md]` · ba lộ trình
thật crm/oneflow. Chân ngành: thông lệ đội sản phẩm đã rà ở §8 hạt giống — Now/Next/Later, Shape Up,
outcome-based roadmap `[NGÀNH: rà soát §8, owner gật 02/10]`.

- Trục A — sức khoẻ tệp ý định: vắng khoá | tệp vắng | JSON hỏng | đường thoát gốc | gốc không object | thiếu trường bắt buộc (ma, cau_giao) | thiếu trường tuỳ chọn | mã trùng | trường phụ thuộc/mốc sai kiểu | đủ + trường tự do | tự khai trạng thái  [thước CE: §3 và §5 hạt giống + ba lộ trình thật] → AC-1, AC-2, AC-3, AC-5, AC-8, AC-13, AC-17
- Trục B — nối hàng với hồ sơ: không slug | slug khớp (×10 ô bản đồ) | slug vắng | nhiều hàng một slug | một mã hai slug | đổi hạng | hồ sơ không hàng trỏ  [thước CE: giả định 4 của ô — ba ca crm] → AC-4, AC-10, AC-11
- Trục C — bên đọc: trang + `--check` | thẻ start | S0 (mã một từ và mô tả nhiều từ) | lệnh đóng cổng đưa trang vào commit | tệp ý định (không bị ghi)  [thước CE: năm món phạm vi đã ký ở Cổng 0 + Cổng Bằng chứng 02/10] → AC-6, AC-7, AC-9, AC-12, AC-14, AC-16, AC-18
- Trục D — kho: kho kit | kho khai | kho không khai  [thước CE: 4 kho không khai đo được trên máy owner: oneflow, radar, aes, media-library] → AC-1, AC-15
- Later: cờ tuổi «hàng không mở quá hai mốc phát hành» · cờ «không kịp mốc» theo nhịp thật · thước «hàng bị sửa sau khi vòng mở» (lát 2).
- Never: kit ghi tệp ý định · đọc `data.js` của một kho · RICE/WSJF trong khuôn.

## Đường đo

- Tin hỏi tiến độ/lượt ≤ nửa nền 23/48 · số từ: đếm tay trên phiên điều phối của hai lộ trình crm kế tiếp, cùng khuôn đếm finding 26/09 §4 · không AC (đếm người, không phải vật).
- 0 commit «bản chụp» chỉ đổi trạng thái · số từ: `git log` trên tệp lộ trình của crm sau ngày ổ cắm chạy · không AC (git của kho tiêu thụ).
- 0 hàng tự khai lệch hồ sơ mà thẻ im · AC-5.
- Tỉ lệ hàng sống qua Cổng Đáng · AC-11.
- Số hàng bị sửa sau khi vòng mở · bỏ ở lát này, entry descope «bỏ đường-đo — …».

## Out of scope

- Kit không ghi bất kỳ byte nào vào tệp ý định; trạng thái chỉ hiện trên trang và thẻ.
- Không đọc thẳng `lo-trinh-okr.data.js` hay khuôn riêng của kho nào — kho tự chuyển sang tệp JSON.
- Không skill cắt lượt, không nhịp thật, không cờ «không kịp mốc» theo nhịp (lát 2).
- Không cờ tuổi theo mốc phát hành (Later, entry descope).
- Không băng hay răng chống trôi dùng chung (lát C), không nấc CRM.
- Không gộp bản đồ sản phẩm với lộ trình: hai trang, hai tệp.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- **Known limits (Cổng Bằng chứng 02/10, owner định tuyến «ghi Known limits»):** slug sai dạng
  trỏ ra ngoài `_acceptance/` vẫn được đọc khi đếm hàng sống qua Cổng Đáng (Ngoài-4) · không phép đo
  nào kiểm cờ và nhãn tự khai nằm đúng hàng trên trang, chỉ kiểm chuỗi có mặt (Ngoài-5) · ô hồ sơ của
  fixture crm OKR khai tay nên trang đọc đúng trên mẫu chưa chứng minh đọc đúng trên lộ trình thật
  (Ngoài-6, Ngoài-11) · LT-06 không có ca đỏ cho «không ngày chạy, không script» (Ngoài-7) · bản sao
  mutant của P99 nối danh sách tệp tay (Ngoài-9).
- **Known limits (Cổng Bằng chứng, ký 03/10):** khối `MAP-STAGE` ở phiên nghiệm thu bỏ dự phòng
  `$PLUGIN_ROOT` — harness chỉ có biến đó thì khối đỏ to (Ngoài-1) · lệnh ký bằng chứng còn hai câu cũ
  nói bước 6 vẽ lại bản đồ (Ngoài-2, Ngoài-4) · chiều đỏ của LT-16-thu-tu chỉ so tiền tố thông điệp
  (Ngoài-5). Ngoài-3 (làn 7b chạy trước bước vẽ lại) → hạt giống
  `docs/plans/2026-10-03-hat-giong-lan-ky-truoc-ban-do.md`.
- **Known limits (Cổng Bằng chứng lần hai, 03/10):** bộ kiểm khuôn bỏ im `moc`, `da_bac` sai kiểu,
  mốc không phải object và ngày mốc sai dạng (Ngoài-3) · ca luật S0 đo chữ của SKILL chứ không đo bộ chạy
  (Ngoài-4) · ba mục mang sang từ vòng trước: fixture crm OKR khai tay, bản sao P99 nối danh sách tay
  (Ngoài-5..7).

- Ca đo: `tests/scripts/lo-trinh.test.mjs` (LT-*), suite scripts tự chạy qua glob `*.test.mjs`.
- Đường nền hạ tầng xanh cả bốn chân tại `418436ce` (`duong-nen.md`).
- Đo bốn kho thật không khai (AC-1, một lần, 02/10, nhánh `c5a22f44` so mã trước vòng `418436ce`,
  trên bản sao `_acceptance/` + `.out-of-scope/` của từng kho, không ghi vào kho thật):

  | Kho | Bản đồ giống từng byte | JSON quét giống (bỏ `git`, `loTrinh`) | `loTrinh` | `LO-TRINH.html` |
  |---|---|---|---|---|
  | oneflow | có | có | null | không sinh |
  | radar | có | có | null | không sinh |
  | aes | có | có | null | không sinh |
  | media-library | có | có, trừ `since` lệch 1 giây — giờ commit của hai bản sao do phép đo tự tạo | null | không sinh |
- Giả định sinh tử 1 (khuôn phủ ba lộ trình): phủ được, không bỏ trường tự do nào; đo ra 6/43 hàng crm
  chưa có hạng → `hang` thành tuỳ chọn (sổ d-20261002T143650Z-11). Giả định 2 (trạng thái suy khớp crm): 24/32 hàng
  OKR tự khai bằng chữ riêng, không so được nếu không khai `tu_vung` (sổ d-20261002T144907Z-12); có `tu_vung` thì 0.
- Giả định 3 (vắng thì im): bảng trên + LT-01. Giả định 4 (ca biên crm): LT-10.
