# Chữ ký không tự làm bằng chứng hoá cũ · làn trước chữ ký bỏ qua khi cây bằng pin

**Ngày:** 2026-09-15 · **Hạng:** T2 (chạm `feature-loop/scripts/repin-lane.mjs`,
`commands/signoff.md`, `skills/acceptance/SKILL.md`, `_acceptance/config.yaml`,
`tests/scripts/`; KHÔNG chạm `lib/**`, `hooks/**`, `pre-merge-check.sh`,
`recheck-evidence.cjs`) · **Vòng meta duy nhất cửa sổ 2.13**, owner gọi tên
15/09 («Đồng ý») sau khi đọc phân tích tác động. Đầu vào thứ nhất: hồ sơ cơ hội
`_acceptance/ba-cho-cat-sau-chu-ky-cua-so-2-13/opportunity.md` (mục 1 thu hẹp,
mục 2 chọn dạng thứ ba; mục 3–4 để riêng) và hạt giống
`docs/plans/2026-09-14-hat-giong-ba-cho-cat-sau-chu-ky-cua-so-2-13.md`.

## Vấn đề — đo, không ước

Chữ ký `khoi-tim-loi-tra-phi-theo-vat` (14/09): từ «Ký» tới READY **54 phút · 87
lượt model · ≈ 42 M token**, trong đó ≈ 6 M là việc thật (ghi trường người, sổ quyết
định). Phần còn lại là **ba làn `repin-lane.mjs`** (13 phút/làn: `tests/scripts`
362 s + `tests/plugins` 402 s) và 10 phút chẩn LM20. 7/7 chữ ký từ 08/09 đều đi
đúng đường này. `release-2-13-0` (15/09): 42 phút · 23,6 M token, vẫn đang làn 2.

Nguyên nhân là **tất định**, không phải xui:

1. `tests/scripts/gate-card-lmcms.test.mjs:199` — LM20 chỉ ghim hồ sơ `settled`
   = `human_signoff` khác rỗng. Ghi chữ ký ⇒ hồ sơ vào diện quét ⇒
   `tests/scripts/fixtures/routing-baseline.txt` **phải** thêm một dòng.
2. `scripts/pre-merge-check.sh:575` `stale_files` bỏ `_acceptance/*` và T1 — fixture
   là code ⇒ commit chữ ký làm bằng chứng **stale** ⇒ bước 8 chạy làn lần hai.
3. Bước 7b (`SIGNOFF-LANE-CLAUSE`, 08/09) chạy làn trọn corpus kể cả khi cây
   **không đổi** so với `verified_commit` — đúng ca của mọi chữ ký tuần qua.

Cùng hình dạng ADR 0007 (PRODUCT-MAP.md): «commit chữ ký tự làm bằng chứng hoá cũ,
pre-merge chặn không lối ra». Kit đã giải một lần cho bản đồ; bản ghi định tuyến ra
đời sau (03/09) nên chưa được xếp cùng lớp.

## Hai nhát — và chỉ hai

### (d) Bản ghi định tuyến là vật T1 máy sinh, cùng lớp PRODUCT-MAP

- `_acceptance/config.yaml` `risk_tiers.t1_skip_globs` thêm
  `tests/scripts/fixtures/routing-baseline.txt`, kèm ghi chú điều kiện ADR 0007
  (máy sinh toàn phần + cổng độc lập canh drift = LM20) và điều kiện thu hồi.
- Lệnh sinh **kit-nội-bộ** `tests/scripts/routing-baseline.mjs --root <repo>
  --slug <slug> --write` (cùng chỗ với `mirror-sync-grandfather.mjs`, không vào gói
  plugin): gọi `gate-card.js --extract` như LM20, dựng dòng bằng hàm `routingLine`
  XUẤT từ chính tệp này — LM20 nhập hàm đó (writer/reader một nguồn, round-trip);
  thay-hoặc-thêm **đúng dòng của slug**, mọi dòng khác và comment giữ nguyên văn
  (bản ghi của hồ sơ cũ vẫn là mốc — sinh lại toàn bộ sẽ nuốt hồi quy định tuyến);
  hồ sơ chưa `settled` → exit 2 gọi tên (không cho ghim trước khi người quyết).
- `commands/signoff.md` bước 6: sau khi ghi `human_signoff`, kho tự host kit chạy
  lệnh sinh; bước 7c `git add` kèm file — cùng nếp câu «bản ghi mốc mà làn đòi» đã
  có ở 7c. `skills/acceptance/SKILL.md` chép nguyên văn khối.
- ADR 0019 một đoạn: nới danh sách ADR 0007 thêm đúng một tên, cùng điều kiện.

Vì sao không chọn hai dạng của hạt giống: (a) «LM20 chỉ so hồ sơ đã ký trước
`--base`» đòi LM20 biết mốc nhánh chính — suite không có khái niệm đó, giòn trong
worktree/CI; (b) «baseline máy sinh trọn tại `--base`» biến thước thành hàm của
chính vật nó đo — mất khả năng bắt hồi quy định tuyến, đúng lý do LM20 sinh ra.

### (c′) Làn trước chữ ký bỏ qua khi cây bằng pin

- `repin-lane.mjs` thêm cờ `--skip-unchanged` (BOOL, tường minh — mặc định vẫn
  chạy trọn). Vị từ = **đúng ngữ nghĩa `stale_files`**: `git diff --name-only
  <verified_commit> --` (cây làm việc so pin, chỉ tệp git theo dõi) TRỪ tệp có
  **một PHÂN ĐOẠN đường dẫn bằng đúng `_acceptance`** ở bất kỳ độ sâu nào TRỪ tệp
  khớp `risk_tiers.t1_skip_globs` (đọc bằng `core.resolveConfigList`, khớp bằng
  `globToRe` của `carry-plan.mjs` — cùng hàm S4 dùng cho vùng vật).
  **Loại trừ hồ sơ KHÔNG đi qua `globToRe`** (gap-probe F1): `*` của nó không xuyên
  `/`, nên `_acceptance/<slug>/evidence-report.md` (sâu 2 — tệp chữ ký vừa ghi!) và
  `packages/x/_acceptance/...` sẽ lọt, tức không lượt ký nào bỏ qua được. Tách bằng
  `p.split('/').includes('_acceptance')`; tiền tố giả `_acceptance-x/` không khớp.
  Rỗng cho MỌI slug → in một dòng «cây bằng pin
  <sha7> — 0 tệp ngoài `_acceptance/` và T1 đổi — làn bỏ qua», stdout JSON
  `{skipped: true, sha, pins}`, exit 0, **không chạy suite/eval, không ghi gì**.
  Khác rỗng → log tối đa 5 tệp rồi chạy trọn như cũ.
- Fail-closed: `--skip-unchanged` đi cùng `--write` → usage exit 3 (bỏ qua không
  bao giờ là một pin); `verified_commit` vắng hoặc `git cat-file -e` không thấy →
  KHÔNG bỏ qua, log lý do, chạy trọn.
- `SIGNOFF-LANE-CLAUSE` (bản gốc `commands/signoff.md`, bản chép `SKILL.md`): lệnh
  7b thêm `--skip-unchanged`; thêm một câu: cây bằng pin → làn tự bỏ qua, in một
  dòng; cây đã đổi sau verify → làn chạy trọn và luật đỏ không đổi. Bước 8 giữ
  nguyên cho ca stale thật.
- Vụ sinh ra 7b (`duong-lui-phai-song`: hai mốc trả 5 CI đỏ hậu-chữ-ký vì commit
  sau verify) vẫn được bắt: cây đổi ⇒ vị từ khác rỗng ⇒ làn chạy.

**Trạng thái cây lúc 7b chạy thật** (gap-probe F2 — chỗ hai nhát ghép nhau): sau
bước 6 có HAI thứ bẩn chưa commit — `_acceptance/<slug>/*` (chữ ký) và
`tests/scripts/fixtures/routing-baseline.txt` (tệp **code**, vừa sinh). Lệnh 7b đã
mang `--allow-dirty` nên gác cây-bẩn không chặn; tệp baseline không làm vị từ khác
rỗng **chỉ vì (d) đã đưa nó vào T1**. Tức (c′) một mình không đủ: thiếu (d) thì mọi
lượt ký vẫn chạy làn trọn. Răng SK5 phải dựng đúng trạng thái ghép này, không phải
một cây đã commit sạch.

## Không làm ở vòng này (sổ quyết định ghi tên)

- E3c của hồ sơ release chạy lại trọn suite plugins (+7 phút/làn) — thiết kế răng
  của hồ sơ release, sửa khi mở hồ sơ 2.14.
- Dòng 1 «đo tới lên main» + ship chạy nền (mục 3 hạt giống) — sửa hồ sơ release,
  không cần S4.
- Chiến dịch ghim lại 41 hồ sơ (mục 4) — việc ở mốc 2.13, chạy SAU vòng này.
- Re-pin theo diff chọn suite theo `paths` (mục 1 nguyên bản) — đắt, dễ tự dối;
  (c′) lấy 100 % lợi ích cho ca cây-không-đổi mà không dựng phép đo mới.

## Thước — hai chiều cho mỗi phép đo mới

| Phép đo | Chiều đỏ | Chiều im |
|---|---|---|
| T1 glob của baseline | gỡ glob → `pre-merge` VIOLATION stale trên kho fixture | có glob → commit chỉ chạm baseline + `_acceptance/` → 0 stale |
| `routing-baseline.mjs` | hồ sơ chưa ký → exit 2; `--extract` hỏng → exit khác 0, tệp byte-giống; sau `--write` **ca LM20 thật** trên kho fixture → `PASS: LM20` (đối chứng dương) | dòng hồ sơ KHÁC bị đổi tay → lệnh sinh cho slug X KHÔNG chạm nó |
| `--skip-unchanged` | đổi một tệp vật / commit sau pin → làn chạy, đỏ đúng eval; `_acceptance-x/y.md` (tiền tố giả) bẩn → KHÔNG bỏ qua | ma trận 4 ô: `_acceptance/<slug>/…` sâu 2 · `pkg/a/_acceptance/…` · tệp T1 → đều bỏ qua, không suite nào chạy (marker) |
| Khối clause | hai bản chép lệch → đỏ; gỡ baseline khỏi T1 → SK5 đỏ | lệnh rút từ khối chạy ở trạng thái hậu-bước-6 (chữ ký + baseline bẩn) → bỏ qua |
| Suite `tests/scripts` (E7) | tệp ca mới không được runner nhặt → E7 đỏ dù suite exit 0 | — |

Pin của mọi kho fixture do **chính `repin-lane.mjs --write`** ghi trong cùng lần chạy
(gap-probe F5) — không dựng tay theo khuôn bên đọc, nên seam writer→reader được
round-trip thật.

Dự báo 5 dòng số (luật (c)): dòng 1 ↓ (≈ 60 → ≈ 5 phút từ «Ký» tới READY) · dòng 2 = ·
dòng 3 ↓ (hết lượt chấm bị LM20 đốt ở cổng ký) · dòng 4 = (không chạm S4) · dòng 5 ↓
phần sau chữ ký. Điều kiện tin cậy: đường verdict không đổi thành phần; răng hai chiều
như bảng trên.
