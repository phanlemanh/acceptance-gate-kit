---
schema_version: 1
feature: Hồ sơ làn V không phải «chờ ký» — máy quét vào phiên và bản đồ đọc cùng luật với lưới trước-merge: V-mở + PASS + T2 ⇒ đã giao, cửa veto mở
slug: lan-v-khong-phai-cho-ky
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 script đọc + thân lệnh /start + ca kiểm + bản đồ — không dính t3_paths (lib/ chỉ được GỌI)
surfaces: [cli]
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-08-21T09:42:27Z
---

# Acceptance Contract: lan-v-khong-phai-cho-ky

## Context

Đợt 2 dựng làn V: hồ sơ T2 xanh-sạch đi qua cổng không chờ chữ ký, `veto_state: mo`,
người veto lúc nào cũng được. Lưới trước-merge đọc đúng («làn V — cửa veto mở»),
nhưng máy quét vào phiên (`scripts/start-scan.mjs`) và bản đồ (`scripts/product-map.mjs`)
chỉ biết *verified + PASS + chưa chữ ký = chờ ký / đang làm*. Hai bản phát hành
2.0.0 và 2.1.0 đang chịu: màn vào phiên `/start` đòi đúng lượt gọi người mà hồ sơ M1 được
dựng để không đòi. Hồ sơ này TRỪ một suy diễn sai ở hai bộ đọc; không thêm trường,
không thêm trạng thái.

Source input: `docs/plans/2026-08-21-hat-giong-lan-v-khong-phai-cho-ky.md` (Cổng 0 gật, #74)

## Criteria

- AC-1: Given một hồ sơ `status: verified`, `veto_state: mo`, `veto_opened_at` parse được, `risk_tier: T2`, evidence `verdict: PASS`, `human_signoff` rỗng, When chạy `start-scan.mjs`, Then slug nằm trong `groups.done` với `state: lan-v-mo` và KHÔNG nằm trong `groups.gates`.
- AC-2: Given cùng hồ sơ AC-1, When vẽ bản đồ (`renderProductMap`), Then slug nằm dưới mục «Đã giao» kèm chú thích «cửa veto mở» và KHÔNG nằm dưới «Đang làm»; ô «Đã giao» trong hình đếm nó.
- AC-3: Given cùng hồ sơ AC-1 nhưng GỠ `veto_state`, When chạy cả hai bộ đọc, Then luật cũ chạy nguyên văn: máy quét xếp `gates: bang-chung`, bản đồ xếp «Đang làm».
- AC-4: Given cùng hồ sơ AC-1 nhưng `veto_state: da-veto`, When chạy cả hai bộ đọc, Then KHÔNG bộ đọc nào xếp «đã giao» — máy quét giữ `gates: bang-chung`, bản đồ giữ «Đang làm» (veto đã phát ngôn phải còn hiện ở nơi người thấy).
- AC-5: Given cùng hồ sơ AC-1 nhưng `veto_opened_at` rỗng HOẶC không parse được, When chạy cả hai bộ đọc, Then như AC-3 (V không vết là bỏ-cổng lặng, không phải V).
- AC-6: Given cùng hồ sơ AC-1 nhưng `risk_tier: T3`, When chạy cả hai bộ đọc, Then như AC-3 (làn V chỉ T2).
- AC-7: Given cùng hồ sơ AC-1 nhưng evidence `verdict: PENDING-JUDGMENT`, When chạy cả hai bộ đọc, Then máy quét giữ `gates: bang-chung`, bản đồ giữ «Đang làm» — phần judgment là của người, máy không giao thay.
- AC-8: Given **bảng sự-thật viết trước** trên tích Descartes trạng-thái-veto (5) × verdict (5) × hạng (2) × chữ ký (2) = 100 ô, fixture code-sinh, When hỏi cả hai bộ đọc từng ô, Then ĐÚNG MỘT ô (mo + vết ok · PASS · T2 · chưa ký) cho «đã giao, cửa veto mở» ở cả hai bộ đọc, 99 ô còn lại KHÔNG — mỗi ô so GIÁ TRỊ kỳ vọng của từng bộ đọc trước, rồi mới so quan hệ giữa hai bộ đọc; ô có chữ ký giữ `signed-off` không chú thích; ô REJECT/BLOCKED/vắng-evidence dưới V không bao giờ là «đã giao».
- AC-9: Given chuỗi chú thích «cửa veto mở» khai MỘT lần (hằng `VETO_OPEN_NOTE` xuất từ `product-map.mjs`), When so với dòng NOTE làn V trong `scripts/pre-merge-check.sh` và với thân lệnh `commands/start.md`, Then cả ba chứa đúng một chuỗi (đẳng thức), và bản sao đổi một chữ ở bất kỳ bên nào làm răng đỏ ghim tên bên lệch.
- AC-10: Given cây thật của kit sau thay đổi, When vẽ lại `PRODUCT-MAP.md` và chạy máy quét thật, Then `release-2-0-0` và `release-2-1-0` nằm dưới «Đã giao» kèm chú thích, `product-map.mjs --check` exit 0, và `groups.gates` của máy quét KHÔNG chứa hai slug đó; thân lệnh `commands/start.md` nêu trạng thái `lan-v-mo` và cách đếm «trong đó N làn V, cửa veto mở» ở dòng cuối thẻ.

## Coverage

Quét bằng morphological-scan (preset ma-trận-kiểm) — chân sản phẩm: đào repo; chân ngành: quy ước «auto-merge sau khi checks xanh, người revert sau» của GitHub auto-merge / merge queue `[NGÀNH: GitHub auto-merge]` — cùng hình dạng «máy đi trước, người đảo sau, không có hạn đảo».

- Trục A — bộ đọc: máy quét vào phiên | bản đồ | lưới trước-merge (tham chiếu, không đổi) `[SUY-TỪ-REPO: scripts/start-scan.mjs, scripts/product-map.mjs, scripts/pre-merge-check.sh]` [thước CE: ba file tồn tại, không bộ đọc hồ sơ nào khác trong `scripts/`]
- Trục B — trạng thái veto (từ `vetoGateState`): vắng | mo + vết parse được | mo + vết rỗng/hỏng | da-veto | giá trị lạ `[SUY-TỪ-REPO: lib/evidence-core.cjs:454-478]` [thước CE: enum đúng của hàm đọc chung; «lạ» bị lưới ghi-lúc-viết chặn nên chỉ vào được khi người sửa thẳng file]
- Trục C — verdict evidence: PASS | PENDING-JUDGMENT | REJECT | BLOCKED | vắng file `[SUY-TỪ-REPO: scripts/start-scan.mjs VERDICT_MEANING, skills/acceptance/references/evidence-report-template.md]` [thước CE: bảng VERDICT_MEANING + khuôn writer]
- Trục D — hạng: T2 | T3 `[SUY-TỪ-REPO: skills/acceptance/references/contract-template.md]` [thước CE: enum contract]
- Trục E — chữ ký (`human_signoff` trong evidence): có | không `[SUY-TỪ-REPO: scripts/start-scan.mjs:205]` [thước CE: nhánh `ev.signoff` của máy quét] — gap-probe nâng từ cross-cutting lên trục: thứ tự nhánh (chữ ký TRƯỚC vị từ V) là điều phải ghim, không được để «không đổi» bằng lời.

Không gian 5×5×2×2 = **100 ô** mỗi bộ đọc, đo bằng **bảng sự-thật viết trước** (AC-8): **Core (1 ô, ×2 bộ đọc):** B=mo+vết ok · C=PASS · D=T2 · E=không → «đã giao, cửa veto mở» (AC-1, AC-2). **99 ô còn lại giữ luật cũ và đều được ghim GIÁ TRỊ**, trong đó các ô có tên riêng vì là chiều rủi ro của vị từ MỚI: B=vắng (AC-3) · B=da-veto (AC-4) · B=mo+vết hỏng (AC-5) · D=T3 (AC-6) · C=PENDING-JUDGMENT (AC-7) · C=REJECT/BLOCKED/vắng-evidence dưới V (AC-8 — vị từ chỉ kiểm «có evidence» thay vì «PASS» sẽ đỏ ở đây) · E=có (AC-8 — vị từ đặt trước nhánh chữ ký sẽ đỏ ở đây) · B=lạ (AC-8 — lưới ghi-lúc-viết chặn, nhưng sửa thẳng file thì vào được, bộ đọc phải coi như không V). **Never:** thêm trạng thái «cửa đóng» — luật làn V nói cửa không hạn (SKILL 4c).

## Out of scope

- Không thêm trạng thái «cửa veto đã đóng» hay thời hạn veto — bản sau chồng lên chỉ làm veto *không còn đáng*, người cân khi nhìn, máy không suy.
- Không ký bù 2.0.0/2.1.0 và không xoá hai hồ sơ đó — sổ M1 (`decisions.jsonl` của release-2-1-0) sống trong chúng.
- Không sửa `scripts/pre-merge-check.sh` — nó đã đọc đúng; chỉ so chuỗi với nó.
- Không đọc `decisions.jsonl` để suy trạng thái hồ sơ — frontmatter là nguồn.
- Không mở vòng nạp `tests/plugins/cases/` — thuộc hồ sơ B (`hat-giong-ba-cho-tich-luy`); ca mới của hồ sơ này vào suite `plugins` nhưng đặt tên theo slug (`LV<n>`), không lấy số P.
- Không đo hành vi render của thân lệnh `/start` bằng hội đồng phiên sạch — lớp mã tiền định trước (hạt giống §4).

## Notes

- **Vị từ sống ở `scripts/product-map.mjs`, không vào `lib/`** — giữ hạng T2 (lib là t3_paths); vị từ chỉ GỌI `vetoGateState` + `frontmatterField` có sẵn. `start-scan.mjs` đã phụ thuộc `product-map.mjs` (import `renderProductMap`), không thêm cạnh mới.
- **Răng hồ sơ khai `cmd:` bằng đường dẫn** (`_acceptance/<slug>/rang.sh --chan <x>`), không thêm khoá vào `config.yaml` — tự áp câu 1 của hạt giống B; `evidence-core` chấp nhận verifier dạng đường dẫn từ trước.
- **Răng KHÔNG chạy trọn suite** — **7 ca** LV1–LV7 sống trong `tests/plugins/lan-v.test.mjs` (suite gọi bằng **7 dòng `run`**, LV7 = bảng sự-thật 100 ô), răng gọi thẳng file đó trên **bản sao không tiêm** (đối chứng dương) và **bản sao bị đột biến** (chiều đỏ) — cùng cách chép, cùng lệnh; trọn suite `plugins` vẫn chạy qua `feature_loop.suite_keys` mỗi vòng.
- **Răng suy ROOT từ vị trí script** (`$(cd "$(dirname "$0")/../.." && pwd)`), mọi lệnh truyền `--root "$ROOT"` hoặc `"$COPY"` tường minh; răng tự kiểm `$ROOT/_acceptance/lan-v-khong-phai-cho-ky/rang.sh` là chính nó — không có `--root .` suy từ cwd.
- **Known limit (khai trước):** vế «thân lệnh `/start` nêu cách đếm» của AC-10 đo CHỈ DẪN (chuỗi trong `commands/start.md`), không đo hành vi render — lớp hành vi cố tình không mở ở vòng này (Out of scope, mục cuối).
- Bản đồ vẽ lại trong CÙNG lượt sửa script (lớp «vẽ bản đồ sau chữ ký» đã dẫm ×2) — AC-10 ghim `--check` exit 0 trên cây thật.
