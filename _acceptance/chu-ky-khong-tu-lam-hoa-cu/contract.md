---
schema_version: 1
feature: Chữ ký không tự làm bằng chứng hoá cũ (bản ghi định tuyến là vật T1 máy sinh) và làn trước chữ ký bỏ qua khi cây bằng pin
slug: chu-ky-khong-tu-lam-hoa-cu
owner: phanlemanh@gmail.com
risk_tier: T2               # chạm feature-loop/scripts/repin-lane.mjs, commands/signoff.md, skills/acceptance/SKILL.md, _acceptance/config.yaml, tests/scripts; KHÔNG chạm lib, hooks, pre-merge, recheck
surfaces: [cli]
status: signed-off
design_doc: docs/superpowers/specs/2026-09-15-chu-ky-khong-tu-lam-hoa-cu-design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-15T01:05:00Z
---

# Acceptance Contract: chu-ky-khong-tu-lam-hoa-cu

## Context

Vòng meta duy nhất của cửa sổ 2.13 (owner gọi tên 15/09). Đo trên chữ ký
`khoi-tim-loi-tra-phi-theo-vat` 14/09: «Ký» → READY **54 phút · 87 lượt · ≈ 42 M
token**, ≈ 6 M là việc thật; 7/7 chữ ký từ 08/09 đều qua ba làn `repin-lane.mjs`
(≈ 13 phút/làn). Nguyên nhân tất định: LM20 chỉ ghim hồ sơ có `human_signoff`, nên
chính chữ ký buộc `tests/scripts/fixtures/routing-baseline.txt` thêm dòng; fixture là
code nên `stale_files` báo hoá cũ; và bước 7b chạy làn trọn corpus dù cây không đổi so
với `verified_commit`. Cùng hình dạng ADR 0007 (PRODUCT-MAP.md). Hai nhát: (d) bản ghi
định tuyến là vật T1 máy sinh + lệnh sinh dòng ở bước 6 của `/signoff`; (c′) làn
`--skip-unchanged` theo đúng vị từ `stale_files`. Đầu vào thứ nhất: hồ sơ cơ hội
`ba-cho-cat-sau-chu-ky-cua-so-2-13` (ngưỡng SỐNG: ≤ 15 phút, ≤ 1 làn; CHẾT: còn sửa
fixture sau chữ ký hoặc làn bị giết ở 600 s).

## Criteria

### AC-1 — Bản ghi định tuyến nằm trong T1: commit chỉ chạm nó không làm bằng chứng hoá cũ

**Given** `_acceptance/config.yaml` khai `tests/scripts/fixtures/routing-baseline.txt`
trong `risk_tiers.t1_skip_globs`, và một hồ sơ đã ghim `verified_commit`
**When** cây đổi CHỈ ở tệp đó và dưới `_acceptance/` rồi `pre-merge-check.sh` chạy
**Then** không có `VIOLATION … evidence is stale` cho hồ sơ; gỡ dòng glob khỏi config
(chiều đỏ) → đúng VIOLATION đó xuất hiện và nêu tên tệp baseline; `lib/evidence-core`
và `pre-merge-check.sh` KHÔNG đổi một dòng — lời khai nằm ở config như ADR 0007.
Pin của hồ sơ fixture do **chính `repin-lane.mjs --write` ghi** trong lần chạy đó, để
bên đọc `pre-merge` đọc đúng vật writer thật sinh ra, không phải khuôn răng tự dựng.

### AC-2 — Lệnh sinh dòng baseline chỉ chạm đúng dòng của hồ sơ được ký, cùng nguồn với LM20

**Given** `tests/scripts/routing-baseline.mjs --root <repo> --slug <slug> --write` và
một baseline có sẵn dòng của hồ sơ khác
**When** hồ sơ `<slug>` đã `settled` (`human_signoff` khác rỗng)
**Then** tệp có đúng một dòng cho `<slug>` bằng chuỗi `gate-card.js --extract` sinh
(thêm nếu chưa có, thay nếu đã có), mọi dòng khác và comment giữ nguyên văn, chạy lại
lần hai không đổi tệp. Đối chứng dương là **chính ca LM20 của
`tests/scripts/gate-card-lmcms.test.mjs` chạy trên kho fixture** (gốc truyền qua tham
số/env, KHÔNG hardcode) trả `PASS: LM20` — không phải một bản chép phép so ở phía răng.
Hai hàm `routingLine` VÀ `settled` XUẤT từ lệnh sinh, LM20 nhập từ đó — không bản chép
thứ hai của vị từ nào.
**And** hồ sơ chưa `settled` → exit 2, thông điệp gọi tên slug và lý do «chưa ký», tệp
không đổi. `gate-card.js --extract` thoát khác 0 hoặc trả JSON không đọc được → lệnh
exit khác 0 gọi tên slug, tệp giữ nguyên **từng byte** — không ghi dòng `undefined`.

### AC-3 — `/signoff` sinh dòng baseline ở bước 6 và đưa tệp vào commit chữ ký; SKILL chép nguyên văn

**Given** `commands/signoff.md`
**When** đọc bước 7 và 7c
**Then** bước sinh bản ghi mốc đứng **SAU 7a và TRƯỚC 7b** — đo bằng QUAN HỆ vị trí
trong văn bản, không bằng lời dặn: lệnh sinh đọc `human_signoff` làm tiền điều kiện và
thoát 2 khi rỗng, nên đặt nó trước 7a là tự chặn chính lượt ký (lỗi đã đo, lượt chấm 2).
Bước đó chạy ĐÚNG MỘT ca LM20 (`LMCMS_ONLY=LM20`) làm đối chứng dương trong luồng thật,
kèm **số đo thật** trong chính lời dặn — không được khai «vài giây» khi đo được là
≈ 1 ph 45 s (trọn tệp: ≈ 2 ph 40 s), và neo đoạn văn phải được kiểm trước khi assert
đọc nó (neo trôi → assert hoá rỗng im lặng);
7c nêu tệp baseline trong `git add` của kho kit; khối
`SIGNOFF-LANE-CLAUSE` trong `commands/signoff.md` và bản chép trong
`skills/acceptance/SKILL.md` **bằng nhau từng ký tự**; khối gốc mang lệnh 7b có
`--skip-unchanged` và câu «cây bằng pin → làn tự bỏ qua».

### AC-4 — Làn `--skip-unchanged` bỏ qua đúng khi cây bằng pin, chạy trọn khi cây đổi

**Given** kho git code-sinh mà pin `verified_commit` do **chính `repin-lane.mjs --write`
ghi trong cùng lần chạy** (không dựng tay theo khuôn bên đọc), và một suite ghi dấu vết
khi chạy
**When** `repin-lane.mjs --root . --slug <s> --allow-dirty --skip-unchanged`
**Then** cây bằng pin → exit 0, stdout JSON `skipped: true` kèm `sha` (bằng SHA writer
vừa ghi) và `pins`, stderr đúng một dòng có «cây bằng pin» và «làn bỏ qua», suite KHÔNG
chạy (dấu vết vắng), sổ chạy và báo cáo không đổi.
**And** loại trừ hồ sơ tính theo **PHÂN ĐOẠN đường dẫn**: một đoạn bằng đúng
`_acceptance` ở BẤT KỲ độ sâu nào (`_acceptance/<slug>/evidence-report.md` sâu 2,
`packages/x/_acceptance/<slug>/decisions.jsonl` trong monorepo) — không đi qua
`globToRe`, vì `*` của nó không xuyên `/`. Ma trận 4 ô viết trước, mỗi ô một assert:
(1) `_acceptance/<slug>/evidence-report.md` bẩn · (2) `pkg/a/_acceptance/<slug>/x.jsonl`
bẩn · (3) một tệp `t1_skip_globs` bẩn → cả ba vẫn `skipped: true`; (4) `_acceptance-x/y.md`
(tiền tố giả) bẩn → **KHÔNG** bỏ qua.
**And** chiều đỏ: một tệp vật đổi trong cây làm việc, HOẶC một commit sau pin chạm
tệp vật → làn KHÔNG bỏ qua, chạy trọn và trả LÀN ĐỎ gọi tên eval mất tiền đề, dấu
vết suite có mặt.

### AC-5 — Bỏ qua không bao giờ là một pin; pin không giải được thì không bỏ qua

**Given** cùng kho ở AC-4
**When** gọi `--skip-unchanged` cùng `--write`
**Then** usage exit 3, thông điệp nêu hai cờ loại trừ nhau, không chạy gì.
**And** `verified_commit` vắng trong báo cáo hoặc trỏ SHA không có trong kho → làn
KHÔNG bỏ qua, in một dòng nêu lý do, chạy trọn như không có cờ.

### AC-6 — Lệnh 7b rút từ khối clause bỏ qua đúng ở TRẠNG THÁI HẬU-BƯỚC-6 thật; sổ sách đủ

**Given** khối `SIGNOFF-LANE-CLAUSE` của `commands/signoff.md` và kho fixture dựng đúng
trạng thái cây ngay sau bước sinh của một lượt ký: `human_signoff` vừa ghi **chưa
commit**, rồi dòng baseline do **CHÍNH `routing-baseline.mjs --write` chạy thật trong
lần chạy ca đó** sinh ra, cũng **chưa commit** — KHÔNG gõ tay theo khuôn bên đọc (hai
thứ bẩn cùng lúc là trạng thái ghép mà (d) và (c′) chỉ cùng nhau mới tạo ra; gõ tay thì
writer đổi khuôn vẫn xanh — lỗi đã đo, lượt chấm 2)
**When** răng rút nguyên văn dòng lệnh 7b từ khối (thay `<feature-loop>` = gốc gói,
`<slug>` = hồ sơ fixture) và chạy
**Then** exit 0 và JSON `skipped: true` — tức vị từ bỏ qua được xét trên cây làm việc và
tệp baseline bẩn không cản, vì nó đã là T1; đổi cờ ở khối là đổi phép đo, không phải lời
dặn. **And** ADR 0017 tồn tại (một đoạn, nới danh sách ADR 0007 đúng một tên kèm điều
kiện thu hồi), GUIDE §7.1 và CHANGELOG mục chưa phát hành nêu hai nhát.

### AC-7 — Ba chỗ mà chính hai nhát cắt tự phản lại mình (owner nâng phạm vi 15/09, lượt chấm 3)

**Given** `commands/signoff.md`, bản chép trong `skills/acceptance/SKILL.md`, và
`tests/scripts/gate-card-lmcms.test.mjs`
**When** đọc khối `SIGNOFF-LANE-CLAUSE`, điều kiện `git add` ở 7c, và chạy tệp ca LM
với một `LMCMS_ONLY` không khớp ca nào
**Then** cả ba vế đúng:
- **(A1) Ghim lại sau commit là CÓ ĐIỀU KIỆN.** Khối không còn khẳng định vô điều kiện
  rằng commit chữ ký chạm tệp ngoài T1; nó nói rõ ghim lại **chỉ khi** lưới thật sự báo
  `evidence is stale`, và nêu rằng sau ADR 0017 ca THƯỜNG là không stale nên bước ấy bỏ
  qua — chạy `--write` lúc đó là trả lại đúng khoản phút `--skip-unchanged` vừa cắt.
  Hai bản chép vẫn bằng nhau từng ký tự.
- **(A2) Không văn bản nào của kit còn trỏ «bước 6b».** Bước sinh bản ghi mốc tên
  **7a-bis** ở mọi nơi nói về nó: `commands/signoff.md` (thân bước và điều kiện 7c),
  `docs/adr/0017-…md`, `GUIDE.md`, và comment/thông điệp của tệp ca — một tên trỏ một
  bước, để bên thi hành không đi tìm một bước không tồn tại rồi bỏ sót `git add`.
- **(A3) Bộ lọc ca fail-CLOSED.** `LMCMS_ONLY` khớp 0 ca → **exit 2** kèm thông điệp gọi
  tên giá trị đã truyền, KHÔNG phải exit 0; đối chứng dương của bước 7a-bis không thể
  xanh trên 0 ca. Đối chứng dương: `LMCMS_ONLY=LM20` vẫn chạy đúng một ca và exit 0.

## Coverage

Bỏ coverage-scan — entry `descope` trong `decisions.jsonl` (d-…-1): không gian AC không
phải bài liệt-kê-đủ, hai nhát đã chốt từ số đo 14 chữ ký và truy nguyên tất định
(LM20 `settled` → fixture → `stale_files`). Trục còn lại: mỗi phép đo mới có đúng hai
chiều (đỏ · im) — bảng trong design doc, mục Thước.

## Out of scope

- E3c của hồ sơ release chạy lại trọn suite plugins — răng của hồ sơ release, sửa ở
  hồ sơ 2.14.
- Dòng 1 «đo tới lên main» + ship chạy nền (mục 3 hạt giống) — sửa hồ sơ release riêng.
- Chiến dịch ghim lại 41 hồ sơ stale (mục 4) — việc ở mốc 2.13, chạy sau vòng này.
- Re-pin theo diff chọn suite theo `paths` (mục 1 nguyên bản của hạt giống).
- Rút ngắn suite `tests/plugins` (402 s) hay `tests/scripts` (362 s).
- Đổi vị từ staleness của `pre-merge-check.sh`/`lib` — vòng này chỉ TÁI DÙNG.

## Known limits

Mười ba mục NGOÀI hợp đồng của lượt chấm 2, owner định đoạt «ghi Known limits» ở cổng
DỪNG-VÁ 15/09 (lối 2 — thu phạm vi). Chúng là lỗi THẬT nhưng nằm ngoài phạm vi đã duyệt
ở Cổng Phạm vi, và **chưa qua bác bỏ đối kháng** (khối tìm-lỗi chỉ trả phí refute cho
mục trong hợp đồng). Phần lớn cùng MỘT lớp — «thước không sống» — nằm trong chính bộ
răng vòng này viết, không nằm trong hai nhát cắt:

- **Lệnh ký nêu đích danh tệp kit-nội-bộ** (`high`) — bước sinh bản ghi mốc viết thẳng
  `tests/scripts/routing-baseline.mjs`, mà `commands/signoff.md` chạy ở MỌI repo tiêu
  thụ. Điều kiện áp dụng đang là LỜI («kho không tự host kit thì bỏ qua») thay vì VẬT
  như bước bản đồ (giải `config:executors.script.product_map`). Lối đúng đã có tên:
  khai `routing_baseline:` trong `executors.script` và chỉ chạy khi key giải được.
- **`LMCMS_ONLY` sai tên → 0 ca chạy nhưng exit 0** (`high`) — cổng đối chứng dương của
  bước sinh có thể xanh mà chưa kiểm gì. Kit đã có sàn đúng hình dạng này ở
  `tests/scripts/run-tests.sh` («có ít nhất một *.test.mjs được chạy»); ở đây sàn vắng.
- **RB2c là đột biến NO-OP** (`high`) — chuỗi sửa-tay không có trong dòng thật nên
  «chiều im» không có đột biến nào chạy; thay `spliceLine` bằng sinh-lại-trọn-tệp thì
  ca vẫn xanh.
- **E7 khai grep mà lệnh không grep** (`medium`) — khoá config là lệnh trần, nên chiều
  đỏ «tệp ca không được runner nhặt» chưa có răng.
- **Nhánh «pin vắng» của `--skip-unchanged` là code chết** (`medium`) — `perSlug` đã
  chặn cùng vị từ trước đó, và SK4 xanh qua đường khác nên không đo cái nó khai.
- **Regex `verified_commit` dùng `\s*`** (`medium`) — `\s` nuốt xuống dòng, cùng lớp
  bẫy mà `settled()` đã tránh bằng `[ \t]*`.
- **«Chiều IM» của RB3 là tautology** (`medium`) — không đột biến nào được chấm lại
  bằng chính phép đo.
- **SK6 assert CHANGELOG đã xanh sẵn trên cây gốc** (`medium`) và không ghim chuỗi mà
  eval hứa.
- **RB2e chứng «một nguồn» bằng grep mã nguồn** (`medium`) dù eval khai «kiểm bằng
  import thật» — vế import có chạy, nhưng vế ghim quan hệ thì đo bằng chuỗi.
- **E3 khai một dòng PASS không tồn tại nguyên văn** (`low`) — executor chỉ grep tiền
  tố nên eval vẫn xanh; người đọc hồ sơ đi tìm đúng chuỗi sẽ không thấy.
- **`isMain` gọi `realpathSync` không bọc try/catch** (`low`) — ném lúc import nếu
  `process.argv[1]` không giải được.
- **Assert «không khai vài giây» có thể hoá rỗng nếu neo văn bản trôi** (`low`) — mục
  này ĐÃ VÁ trong lượt sửa: neo được kiểm trước khi slice.
- (mục thứ mười ba là biến thể thứ hai của `LMCMS_ONLY` xanh câm, cùng gốc với mục 2.)

**Đánh đổi owner nhận khi ký:** hai nhát cắt tựa vào 5 mutant bị bắt + 7/7 eval máy
xanh hai lượt liên tiếp, KHÔNG tựa vào các assert yếu kể trên. Nợ thước có tên ở đây và
vào hạt giống 2.14; ngưỡng mở vòng sửa thước: ≥1 hồi quy của hai nhát cắt lọt qua bộ
răng này giữa hai bản phát hành.

**Bổ sung sau lượt chấm 5 (owner định đoạt 15/09 tại Cổng Bằng chứng).** Verdict PASS,
12 phát hiện: 1 trong hợp đồng (đã SỬA NGAY, xem dưới), 11 ngoài. Định đoạt:

- **Sửa ngay (mục ①, AC-3):** RB3 assert «1 ph 45 s» grep TRỌN `signoff.md` trong khi
  thông điệp hứa «bước 7a-bis nêu số đo CỦA CHÍNH NÓ». Nay dùng CÙNG neo với assert
  «vài giây» ngay trên nó. Mutant (dời con số sang cuối tệp, vẫn còn trong tệp) → RB3 đỏ.
- **Mở hợp đồng mới (mục ③) — nợ có tên cho 2.14:** `--skip-unchanged` loại trừ trọn
  `_acceptance/**`, nhưng `_acceptance/config.yaml` và `evals.yaml` LÀ nguồn định nghĩa
  lệnh mà làn sẽ chạy. Sửa một executor sau verify → cây «bằng pin» → làn bỏ qua → lệnh
  MỚI không bao giờ chạy trước chữ ký. Phân biệt đúng: `stale_files` hỏi «bằng chứng có
  hoá cũ không», còn ở đây vị từ được dùng để hỏi «có cần chạy lại phép đo không» — hai
  câu khác nhau, và `_acceptance/**` là ĐẦU VÀO của câu thứ hai. Không phải giả định:
  chính vòng này thêm 7 khoá executor vào `config.yaml` giữa chừng.
- **Known limits (9 mục còn lại):** RB2c là đột biến no-op · E7 khai chiều đỏ không tồn
  tại · RB2e và RB3-IM là tautology · SK6 grep chuỗi đã có ở cây gốc · A2 quét danh sách
  5 tệp gõ tay, thiếu `SKILL.md` · regex `\s*` làm nhánh «pin vắng» thành mã chết · số đo
  phút MÁY viết tắt «1 ph 45 s» né lớp lint LOP-PHUT thay vì đi đường khai miễn trừ (và
  dạng viết tắt nay bị RB3 ghim, nên sửa về dạng thường phải đi cùng một dòng `MIEN_TRU`)
  · tệp untracked vô hình với vị từ bỏ qua.

## Notes

- Mở dưới luật «vòng meta duy nhất giữa hai release, owner gọi tên» (CLAUDE.md (b));
  không dùng luật nới 07/09 — cả hai nhát là TRỪ chi phí, không cộng cổng.
- Cổng Đáng của hồ sơ cơ hội `ba-cho-cat-sau-chu-ky-cua-so-2-13` chưa điền trường
  `decision:` — owner phát ngôn «Đồng ý» trong phiên 15/09; trường đó là của người,
  máy không ghi.
- Giới hạn khai: vị từ T1 phía JS (`globToRe`: `*` không xuyên `/`) và phía bash
  (`case`: `*` xuyên `/`) đồng nghĩa trên danh sách T1 hiện tại của kit; lệch chỉ có thể
  xuất hiện ở glob dạng `dir/*` — ngưỡng đang đếm: ≥1 lần làn bỏ qua sai vì glob như
  vậy giữa hai release. Loại trừ `_acceptance` KHÔNG nằm trong giới hạn này: nó tính
  theo phân đoạn đường dẫn (AC-4), đúng vì nó bẩn ở 100 % lượt ký.
- Sáu finding của gap-probe 15/09 đều `fixed` trong artifact trước Cổng 1 — bốn P1 nằm ở
  chính chỗ hai nhát ghép nhau (độ sâu `_acceptance`, trạng thái cây hậu-bước-6, LM20
  thật thay bản chép, E7 phải ghim tên ca).
- Trần Bash 600 s: làn trọn corpus vẫn vượt trần ở ca cây đổi — ngoài phạm vi; ca
  cây-không-đổi (7/7 chữ ký tuần qua) không còn chạm trần.
