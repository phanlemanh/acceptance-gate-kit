# Per-task model tier cho executor S3 — Design

**Date:** 2026-07-24

**Status:** Approved in chat; written-spec review pending

**Target:** `feature-loop/workflows/execute-parallel.js` (resolve tier→model) +
`feature-loop/skills/feature-loop/SKILL.md` (rubric S2 + args S3) +
`tests/workflows/execute-parallel.test.mjs` + GUIDE.md mục "Model theo giai đoạn"

**Compatibility:** feature-loop 1.15.0 → 1.16.0 (bump minor lúc ship, tương đối
so với manifest lúc đó). KHÔNG đụng `acceptance-verify.js` (finder giữ role-level),
KHÔNG đụng lane Codex (spec 2026-07-13-codex-model-routing-optimization là chuyện
`.codex/agents/` — độc lập), KHÔNG đụng acceptance-gate/design-loop.

## 1. Vì sao

Engine hiện route model theo VAI: mọi task S3 chạy chung một
`feature_loop.models.executor`. Nhưng độ khó task trong một plan lệch nhau rõ —
wiring theo khuôn có sẵn ≠ logic mới chạm core. Gán một model cho cả plan buộc
chọn giữa "trả giá frontier cho việc cơ học" và "giao việc gai cho model giữa".

Vấn đề thứ hai: giá trị model ghi cứng (`executor: opus`) mục dần khi danh mục
model đổi (Fable ra đời là ví dụ sống — config viết trước đó không biết tới nó).

Hai quyết định gốc (chốt trong chat 2026-07-24):

1. **Bộ chọn = planner ở S2, người sửa được.** Trí tuệ chọn model đặt ở chỗ đã
   hiểu task sâu nhất và đã được trả tiền để hiểu — main loop lúc lập plan.
   Nhãn nằm trong plan → T3 có Gate 1.5 người duyệt/đổi tay từng dòng.
   Không thêm router runtime (tốn tiền đúng chỗ muốn tiết kiệm, thêm tầng máy).
2. **Vocabulary = tier độ-khó, không phải tên model.** Planner phán thứ bền theo
   thời gian (độ khó nhiệm vụ); "độ khó đó hôm nay model nào phục vụ" là quyết
   định ops, sống ở MỘT map trong config repo. Model mới ra → đổi 1 dòng map,
   hoặc không cần đổi gì khi tier đỉnh trỏ `session`.

Evidence nền (usage-report S4 goi-w1-map-scene, artifact-platform): finder chiếm
~42% out-token round S4 nhưng NGOÀI phạm vi vòng này (xem §6); executor S3 mỗi
task một agent worktree là nơi per-task routing ăn tiền thật.

## 2. Kiến trúc & data flow

Bốn chặng, mỗi chặng một chủ:

```
[S2 plan]               [config.yaml repo]        [SKILL S3]               [engine execute-parallel.js]
task có nhãn      +     feature_loop:       →     đọc 2 nguồn, truyền  →   resolve + sanitize + fallback
Tier: frontier          model_tiers:              NGUYÊN (không diễn        → agent(…, {model})
(planner gán,             mechanical: sonnet      giải): tasks[].tier
người sửa được            standard: opus          + args.modelTiers
ở Gate 1.5)               frontier: session
```

1. **Plan (S2):** planner gán mỗi task một dòng `Tier: mechanical|standard|frontier`
   theo rubric §3. Nhãn là đề xuất — người sửa được trong plan trước khi S3 chạy.
2. **Config repo (`_acceptance/config.yaml`):** block mới `feature_loop.model_tiers`
   — map tier→model, giá trị hợp lệ `haiku|sonnet|opus|fable|session`.
   Không khai → engine dùng bảng default.
3. **SKILL S3:** object task truyền thêm `tier`
   (`{id, title, summary, files, verifyCmd, tier}`) + args thêm
   `modelTiers: <block config nếu có, truyền nguyên map>`. SKILL là người đưa
   thư — đúng pattern `models` hiện tại, không quy đổi, không bịa.
4. **Engine (`execute-parallel.js`):** bảng `TIER_ROUTES` default + sanitize
   thuần + `modelForTask(t)`:

```js
// Bảng default — quyết định đã cân nhắc, đổi = đổi Ở ĐÂY kèm sửa test.
const TIER_ROUTES = {
  mechanical: 'sonnet', // vẫn VIẾT CODE trong worktree — sàn sonnet, không haiku
  standard: 'opus',     // code thường không chạm core
  frontier: null,       // null = kế thừa session — tự đón model mạnh nhất/mới nhất
}
```

**Luật ưu tiên per-task:** `t.tier` hợp lệ → map (config đè default) →
không có tier / tier lạ → route `executor` hiện tại (`models.executor`) →
cuối cùng kế thừa session. `session`/`null` = không truyền opt model.

**Backward compatible tuyệt đối:** plan cũ không nhãn tier → mọi task rơi về
route `executor` → hành vi y hệt 1.15.0. args là của script — field mới
`modelTiers`/`tasks[].tier` chỉ engine 1.16.0 đọc; engine cũ không đọc nên
SKILL mới chạy trên engine cũ cũng không vỡ (và ngược lại).

## 3. Rubric gán tier (văn bản vào SKILL S2)

- `mechanical` — CHỈ khi thỏa đủ 3: (1) lặp mẫu đã có trong repo (thêm case
  tương tự, wiring theo khuôn, rename lan toả); (2) không có quyết định thiết
  kế nào phải đưa ra; (3) `verifyCmd` tự chứng minh kết quả.
- `frontier` — khi có ≥1: chạm ≥2 subsystem; đụng core/DB/contract
  (migration, write-path, `@onehub/contracts`-tương-đương của repo đích);
  logic mới chưa có mẫu trong repo.
- `standard` — phần còn lại.
- **Luật phân vân: lấy bậc CAO hơn.** Kinh tế bất đối xứng: gán cao thừa =
  phí thêm ít tiền một task; gán thấp sai = task hỏng + round S4 bắt bug +
  main loop (model đắt nhất) fix tuần tự — lỗ nặng hơn khoản tiết kiệm.

## 4. Edge cases (tất cả thuần, unit-tested)

| Tình huống | Hành vi |
|---|---|
| Task không có `tier` | Rơi về route `executor` (y hệt hôm nay) |
| `tier` lạ/typo (`frontiar`) | `log()` cảnh báo 1 dòng (no-silent-caps) + rơi về route `executor` |
| Map config thiếu 1 tier | Tier thiếu lấy default engine |
| Giá trị map rác (tên model lạ, rỗng, non-string) | Sanitize bỏ dòng đó → default engine |
| `session` trong map | → `null` = kế thừa model phiên |
| `modelTiers` không phải object / args là JSON-string | Sanitize trả `{}` / parse như nếp E06 |

Ghi chú sanitize giá trị model: whitelist `haiku|sonnet|opus|fable|session`
(harness chỉ nhận 4 tên + session-alias; tên ngoài whitelist = rác → bỏ).
Đây là điểm NGHIÊM hơn sanitize của `models.<role>` hiện tại (nhận string bất
kỳ) — chủ đích: map tier là chỗ ops sửa tay nhiều nhất, typo tên model phải
rơi về default an toàn thay vì đẩy tên hỏng vào harness. KHÔNG retrofit
whitelist vào sanitize `models` cũ trong vòng này (giữ diff hẹp).

## 5. Testing & verify

1. **Unit** (`tests/workflows/execute-parallel.test.mjs`, case E08+): tier
   resolve đúng model; không tier → executor route; tier lạ → fallback + có
   log; map config đè default; `session` → inherit; model rác trong map → bỏ;
   sống qua args JSON-string. E05/E06 giữ nguyên pass (backward compat).
2. **Thước E2E có sẵn:** `wf-usage.mjs` đọc transcript ra bảng label×model —
   chạy 1 plan trộn tier, đối chiếu `exec:<id>` chạy đúng model kỳ vọng.
   "Config có hiệu lực THẬT, không phải config hứa."
3. **Docs đồng bộ:** SKILL.md (rubric ở bước lập plan S2 + args S3 + ghi chú
   quan hệ với `models.executor`), GUIDE.md mục "Model theo giai đoạn",
   README feature-loop.

## 6. Rollout & đảo ngược

- Sửa tại repo kit → bump feature-loop 1.16.0 → re-sync cache plugin →
  repo dùng (artifact-platform) khai `model_tiers` vào `_acceptance/config.yaml`.
- Đảo ngược: gỡ block `model_tiers` + plan không gán tier = nguyên trạng 100%;
  hoặc pin plugin 1.15.0.

**Ngoài phạm vi (chốt trong chat):**

- Finder per-dimension (bugs vs invariants) — review là lưới bắt bug duy nhất
  ngoài evals; chưa có số đo recall thì không hạ tier. Để dành một vòng A/B
  đo recall riêng nếu muốn.
- Router runtime / double-check lúc dispatch.
- Đổi giá trị `models.finder/executor` của repo đang dùng (quyết định ops
  Tầng 1, tách khỏi feature này).
- Lane Codex (spec 2026-07-13 riêng).
