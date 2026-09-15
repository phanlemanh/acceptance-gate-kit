# Plan — chu-ky-khong-tu-lam-hoa-cu

Spec: `docs/superpowers/specs/2026-09-15-chu-ky-khong-tu-lam-hoa-cu-design.md`
Hợp đồng: `_acceptance/chu-ky-khong-tu-lam-hoa-cu/contract.md` (6 AC, 7 eval)

**Không task nào `independent: true`** — T1→T2 khoá nhau bằng seam một-nguồn,
T4→T7 khoá bằng cờ, T5 đọc kết quả T1+T4. Chạy TUẦN TỰ trong main loop.

Luật chung mọi task (MEASURE-BIRTH-CLAUSE): phép đo mới chỉ XONG khi có cặp
hai-chiều trên CÙNG fixture — vật lành → xanh, phá vật thật trong bản sao → đỏ
với thông điệp ghim. Fixture do CODE SINH trong chính lần chạy; đường dẫn suy
từ vị trí script, không hardcode ROOT.

---

## T1 — `tests/scripts/routing-baseline.mjs` (lệnh sinh + hai vị từ một-nguồn)

- **Files:** `tests/scripts/routing-baseline.mjs` (mới)
- **Nội dung:** `export function routingLine(slug, routing)` dựng đúng chuỗi
  `<slug>\thoi=<a|b>\tbao=<c|d>`; `export function settled(root, slug)` đọc
  `human_signoff` (regex `[ \t]*` — KHÔNG `\s*`, xem ghi chú tại
  `gate-card-lmcms.test.mjs:199`); CLI `--root <p> --slug <s> [--write]`:
  gọi `gate-card.js --extract`, exit≠0 hoặc JSON hỏng → **exit 2 gọi tên slug,
  không ghi**; chưa `settled` → exit 2 «chưa ký»; `--write` thay-hoặc-thêm
  ĐÚNG dòng của slug, giữ nguyên văn mọi dòng khác + comment; không `--write`
  → in dòng ra stdout.
- **Verify:** `node tests/scripts/routing-baseline.mjs --root . --slug
  cong-nguoi-doc-du-nguon` in đúng dòng đang có trong fixture thật (đối chứng
  dương trên vật thật, không cần ghi).
- **Phục vụ:** E2 (AC-2)

## T2 — LM20 nhập `routingLine` + `settled` từ T1

- **Files:** `tests/scripts/gate-card-lmcms.test.mjs`
- **Nội dung:** bỏ `const settled = …` tại chỗ và chuỗi dựng dòng inline; nhập
  từ `./routing-baseline.mjs`. Seam writer→reader nay có MỘT nguồn.
- **Verify:** `node tests/scripts/gate-card-lmcms.test.mjs` → `PASS: LM20`
  (đối chứng dương: xưởng thật không đổi màu sau khi đổi nguồn hàm).
- **Phục vụ:** E2 (AC-2)

## T3 — `_acceptance/config.yaml`: glob T1 + 6 executor của hồ sơ

- **Files:** `_acceptance/config.yaml`
- **Nội dung:** `risk_tiers.t1_skip_globs` += `tests/scripts/fixtures/routing-baseline.txt`
  kèm ghi chú điều kiện ADR 0007 + điều kiện thu hồi; `executors.script` +=
  `ckh_rb_t1_stale`, `ckh_rb_sinh_dong`, `ckh_rb_signoff_van_ban`,
  `ckh_sk_bo_qua`, `ckh_sk_fail_closed`, `ckh_sk_lenh_tu_khoi` (mỗi cái
  pipefail + grep MỘT dòng PASS riêng).
- **Ghi bằng** `scripts/config-patch.mjs` khi splice được; sửa tay thì phải qua
  lint 2-space của `pre-merge-check.sh`.
- **Verify:** `bash scripts/pre-merge-check.sh .` không có `VIOLATION [config]`.
- **Phục vụ:** E1 (AC-1), và là đường chạy của E1–E6

## T4 — `repin-lane.mjs --skip-unchanged`

- **Files:** `feature-loop/scripts/repin-lane.mjs`
- **Nội dung:** thêm cờ vào `KNOWN`+`BOOL`; **usage exit 3** khi đi cùng
  `--write`; sau khi đọc `perSlug` (có `verified_commit`) và TRƯỚC khi chạy
  suite: với mỗi slug, `git cat-file -e <vc>` — không giải được hoặc pin vắng →
  log lý do, KHÔNG bỏ qua; giải được → `git diff --name-only <vc> --` rồi lọc
  bỏ tệp có **một phân đoạn bằng đúng `_acceptance`** (`p.split('/').includes`)
  và tệp khớp `t1_skip_globs` (`resolveConfigList` + `globToRe` nhập từ
  `carry-plan.mjs`). MỌI slug rỗng → in đúng một dòng «cây bằng pin <sha7> — …
  làn bỏ qua», stdout `{skipped:true, sha, pins:{<slug>:<vc>}}`, exit 0.
- **Verify:** trong kho fixture của T7 (không tự dựng ca ở đây).
- **Phục vụ:** E4 (AC-4), E5 (AC-5)

## T5 — `commands/signoff.md` + bản chép trong `skills/acceptance/SKILL.md`

- **Files:** `commands/signoff.md`, `skills/acceptance/SKILL.md`
- **Nội dung:** bước 6 — sau bản đồ, kho tự host kit chạy `routing-baseline.mjs
  --write` rồi chạy NGAY tệp ca LM20 làm đối chứng dương; 7c — thêm tệp
  baseline vào `git add` của kho kit; khối `SIGNOFF-LANE-CLAUSE`: lệnh 7b thêm
  `--skip-unchanged` + một câu «cây bằng pin → làn tự bỏ qua, in một dòng; cây
  đã đổi sau verify → làn chạy trọn, luật đỏ không đổi». SKILL chép NGUYÊN VĂN.
- **Verify:** `diff <(rút khối từ signoff.md) <(rút khối từ SKILL.md)` rỗng.
- **Phục vụ:** E3 (AC-3), E6 (AC-6)

## T6 — `tests/scripts/routing-baseline-t1.test.mjs`

- **Files:** mới
- **Ca:** RB0 (config kit thật khai glob — đọc bằng `resolveConfigList`) ·
  RB1 + RB1b (kho fixture code-sinh, pin do **`repin-lane --write` thật** ghi;
  commit chỉ chạm baseline + `_acceptance/` → `pre-merge` 0 stale; gỡ glob →
  đúng VIOLATION nêu tên baseline) · RB2 (thêm/thay đúng một dòng, idempotent,
  dòng khác + comment nguyên văn) · RB2b (chạy **ca LM20 thật** trỏ kho fixture
  → `PASS: LM20`) · RB2c (dòng hồ sơ khác sửa tay → không bị chạm) · RB2d
  (chưa settled → exit 2) · RB2e (import thật: LM20 dùng đúng hai hàm của T1) ·
  RB2f (`--extract` hỏng → exit≠0, tệp byte-giống) · RB3 (signoff bước 6/7c +
  hai bản chép bằng nhau; ba chiều đỏ + hai chiều im).
- **Verify:** `node tests/scripts/routing-baseline-t1.test.mjs`
- **Phục vụ:** E1, E2, E3

## T7 — `tests/scripts/repin-lane-skip-unchanged.test.mjs`

- **Files:** mới
- **Kho fixture:** suite ghi **dấu vết** (tệp marker) mỗi lần chạy → «suite
  không chạy» đo được, không suy từ thời gian. Pin ghi bằng `repin-lane --write`.
- **Ca:** SK1 (cây bằng pin → `skipped:true`, một dòng stderr, marker vắng,
  sổ chạy + báo cáo không đổi, `sha` == SHA writer vừa ghi) · SK1b (ma trận 4 ô
  phân đoạn: sâu 2 · monorepo · tệp T1 → bỏ qua; `_acceptance-x/` → KHÔNG) ·
  SK2 (tệp vật bẩn → chạy trọn, LÀN ĐỎ gọi tên `feat/E1`, marker có) · SK2b
  (commit sau pin) · SK3 (`--skip-unchanged --write` → exit 3) · SK4 + SK4b
  (pin vắng / SHA ma → không bỏ qua) · SK5 (lệnh 7b **rút từ khối clause**,
  chạy ở trạng thái hậu-bước-6: chữ ký + baseline bẩn chưa commit) · SK6
  (ADR 0019 + GUIDE §7.1 + CHANGELOG).
- **Verify:** `node tests/scripts/repin-lane-skip-unchanged.test.mjs`
- **Phục vụ:** E4, E5, E6

## T8 — Sổ sách: ADR 0019 · GUIDE §7.1 · CHANGELOG

- **Files:** `docs/adr/0019-ban-ghi-dinh-tuyen-la-vat-t1-may-sinh.md` (mới),
  `GUIDE.md`, `CHANGELOG.md`
- **Nội dung:** ADR một đoạn theo khuôn 0007 (ba điều kiện đủ: khó-đảo, bất
  ngờ, trade-off thật); GUIDE §7.1 thêm đoạn «làn bỏ qua khi cây bằng pin»;
  CHANGELOG mục chưa phát hành thêm hai gạch.
- **Verify:** SK6 xanh.
- **Phục vụ:** E6 (AC-6)

---

**Cuối S3:** contract → `status: implemented`, rồi dispatch S4 NGAY trong cùng
lượt (không hỏi).
