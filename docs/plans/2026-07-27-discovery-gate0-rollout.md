# Kế hoạch triển khai — Discovery lane, Cổng 0, phân tầng quản trị, vòng đo

*2026-07-27 · Căn cứ: [spec draft](../specs/2026-07-27-discovery-gate0-design.md)
+ hội thoại máy A cùng ngày (phân tích pm-skills, PM brainstorm, phân tầng
quản trị). Trạng thái: **ĐÃ DUYỆT — Manh Phan, 2026-07-27 (trong chat)**.
Input đã chốt: V1 chạy trên repo **Artifact Platform** (Manh làm trực tiếp,
theo [protocol V1](../research/2026-07-27-v1-discovery-probe-protocol.md));
G2 handbook = **repo nhẹ mới**; R1/V2 giả định cùng repo Artifact Platform
(Manh xác nhận lại khi chạy R1).*

**Nguyên tắc xuyên suốt:**
1. Phê duyệt kế hoạch này = phê duyệt *chương trình*. Mỗi feature Đợt 2/4 vẫn
   đi qua feature-loop của kit với Gate 1/Gate 2 riêng — không có đường tắt.
2. Kiểm chứng trước, đầu tư sau: Đợt 2–4 bị khoá sau điểm quyết DP-1.
3. Mọi sửa nguồn kit → sync mirror + commit cùng lượt (P30). Test mới cho
   guard phải có đối chứng dương (CLAUDE.md).

## Bảng tổng hạng mục

| ID | Việc | Nơi chạm | Tier | Phụ thuộc | Effort ước |
|---|---|---|---|---|---|
| **Đợt 0 — Kiểm chứng** | | | | | |
| V1 | Chạy discovery TAY trên 1 feature thật: opportunity.md tay → `strategy-red-team` → prototype có ngưỡng chết → Cổng 0 tay → `/feature-loop` | repo sản phẩm (không sửa kit) | — | Manh chọn feature | 1-2 buổi + prototype |
| V2 | Chạy `/document-app` trên repo sản phẩm; so `flows.md` với contract của 1 feature ĐÃ ship: đếm AC cross-layer bị sót ở S1 | repo sản phẩm | — | R1 | 1 buổi |
| **Đợt 1 — Quản trị (không chờ gì)** | | | | | |
| G1 | Bullet bất biến "kit không chứa" (product context · quy định đội · nội dung workspace · skill bên thứ ba chưa vendor có tên+version) | `CLAUDE.md` kit | T1 | — | 10 phút |
| G2 | Team handbook trang đầu: quy định prototype (§8 spec) + bảng 4 tầng + định tuyến 2 brainstorm + 4 điểm dừng | NGOÀI kit (mstar KB / repo nhẹ — Manh chọn) | — | — | 1 buổi ngắn |
| G3 | Luật phát hành thành văn: "đổi schema artifact phải có đường đọc-cũ + cờ vàng, không bắt migrate" + "release có chủ đích, consumer không nhận engine đổi giữa feature" | `GUIDE.md` hoặc `CLAUDE.md` kit | T1 | — | 30 phút |
| **Đợt 2 — Cơ chế discovery trong kit (khoá sau DP-1)** | | | | | |
| F-A | Feature "discovery-intake": template `opportunity-template.md` (kèm mục Đo-sau-ship) vào `skills/acceptance/references/` · S0 đọc opportunity (AC ứng viên, out-of-scope, disposition) · quy ước prototype S0/S2 · guard 7.2 (diffBase = base_commit) + 7.3 (baseline bắt buộc khi keep) ở bước chuẩn-bị-args S4 | `skills/acceptance/references/` + `feature-loop/skills/` (+ `feature-loop/workflows/` nếu 7.3 cần sửa script) + mirror | T2 | DP-1 GO | 2-3 buổi qua feature-loop |
| F-B | Feature "gate0-card-funnel": `/acceptance-card` nhận Cổng 0 (2 câu hỏi: số phận cơ hội + số phận code, bảng nợ khi keep) · `/acceptance-status` + `/acceptance-report` đọc opportunity → funnel (cơ hội vào · kill-rate Cổng 0 · conversion signed-off · phút gate0) | `commands/` + `codex/acceptance-gate/skills/` (2 harness) + mirror | T2 | F-A | 2 buổi qua feature-loop |
| **Đợt 3 — Vòng đo sau ship (khoá sau DP-1)** | | | | | |
| M1 | Quy ước S5: ship xong → tạo scheduled task/reminder đo lại "Thước đo thành công" theo ngày trong opportunity.md; kết quả append vào opportunity + là input retro | `feature-loop/skills/` (vài dòng S5, gộp vào F-A hoặc F-B được) + wiring per-repo (scheduled-tasks/apple-reminders MCP) | T2 | F-A | 1 buổi |
| M2 | Quy ước retro per-feature: input = `decisions.jsonl` + số round S4 + `usage-report.md`; skill `retro` từ pack | handbook (không sửa kit) | — | G2 | 30 phút |
| **Đợt 4 — discovery-pack (khoá sau DP-1)** | | | | | |
| F-C | Plugin `discovery-pack` trong marketplace kit: vendor 5 skill (`strategy-red-team`, `pre-mortem`, `retro`, `release-notes`, `stakeholder-map`) ghi rõ nguồn + version gốc (pm-skills v2.1.0); ghim version cài pm-ai-shipping + pm-data-analytics (không vendor); cài vào các repo sản phẩm | plugin mới + manifest marketplace + mirror | T2 | DP-1 GO (song song F-B) | 1-2 buổi |
| **Đợt 5 — Nền per-repo sản phẩm** | | | | | |
| R1 | `/document-app` + `/derive-tests` trên repo sản phẩm chính; đưa `documentation/**` vào `t1_skip_globs` của repo đó; quy ước refresh sau ship T3 (ghi vào handbook) | repo sản phẩm + handbook | — | — (làm ngay được, giúp V1/V2) | 1 buổi/repo |
| R2 | `morphological-scan` bậc (a′): đọc `documentation/` làm chân sản phẩm, sinh `docs/product-context.md` | `skills/morphological-scan/` + mirror | T2 | DP-2 GO | 1-2 buổi qua feature-loop |

## Trình tự & điểm quyết

```
Ngay khi duyệt ──► G1 · G3 (kit, T1) · G2 (handbook) · R1 (repo sản phẩm)
                          │
Manh chọn feature ──► V1 (discovery tay end-to-end)
                          │
                    ┌── DP-1: contract S1 có kế thừa từ opportunity.md? ──┐
                   GO                                                   NO-GO
                    │                                             quay lại thiết kế,
        F-A ──► F-B ──► M1                                        KHÔNG sửa harness
        F-C (song song từ sau F-A)
                          │
R1 xong ──► V2 ──► DP-2: AC cross-layer bị sót > 0? ── GO → R2 · NO → bỏ R2
                          │
Sau ≥3 feature qua Cổng 0 tay ──► DP-3: có đáng dựng thao tác cổng
thứ 6 + khoá invocation P31/P32? (nợ đã khai — quyết riêng, ngoài kế hoạch này)
```

## Rủi ro & chốt chặn

| Rủi ro | Chốt chặn |
|---|---|
| Đầu tư Đợt 2–4 trước khi biết mối nối thật | DP-1 khoá cứng; V1 chỉ tốn công tay, không sửa kit |
| F-A phình (5 việc trong 1 feature) | Nếu contract F-A vượt 15 AC → tách guard 7.2/7.3 thành feature riêng tại Gate 1 |
| Sửa nguồn quên mirror | P30 chặn; ghi trong từng task plan |
| Guard mới chỉ có test âm tính | Bất biến đối chứng dương CLAUDE.md — soi tại Gate 1 của từng feature |
| 2 harness lệch nhau (F-B) | Bản codex sửa cùng feature, cùng contract, eval riêng cho từng harness |
| Kit phình trở lại sau kế hoạch | G1 là phanh thành văn; review viện dẫn được |

## Amendment 28/07 — sau 2 ngày chạy V1 trên Artifact Platform

1. **Phép đo dời về UAT (quyết Manh 28/07):** giá build sập → UAT trên sản
   phẩm thật (sau flag, trước release) là phép đo chính; prototype rút về vai
   hội tụ ý định; Cổng UAT = điểm dừng người mới có quyền giết; ngưỡng chết
   khai tại Cổng 0, đo tại UAT. → Spec discovery-gate0 cần **bản v2** (không
   vá lẻ), viết SAU khi DP-1 có verdict, gộp cả queue learnings V1 (D2.5
   phép-thử-rẻ, tách D3-build/field, logistics-có-chủ, luật rẽ C2/C1/H1).
2. **F-D (mới): chưng cất C2 vào kit + khai tử design-loop ceremony.** Scope:
   luật rẽ "bề mặt đã tồn tại?" + proto-lint generic + `/proto-init` (theo
   spec C2 §3.4, degrade không-design-repo cho cộng đồng) + **khai tử kit-side**
   `design-mockup`/`design-evidence`/`design-push` (audit 28/07: 14/2/0 lượt
   invoke, chết từ 21/07) + skill mới **`design-pass`** (nghi thức thiết kế
   in-harness: phiên chuyên trách + ux-ui-craft + Browser pane, thay vai
   Claude Design bridge). Nguyên tắc ghi handbook: **một mặt phẳng làm việc**
   — không mắt xích bắt buộc nào ngoài Claude Code. Đi qua feature-loop kit
   (T2), sau khi proto-c2 Đợt 1 prove ở OneHub.
3. **Dọn nhiễu consumer-side ĐÃ LÀM 28/07** (không cần gate): artifact-platform
   khai tử `sync-design` + `verify-onehub-invariants` (→ `.claude/skills-retired/`,
   commit `2aec2461`); gỡ plugin `design-loop` + 7/8 plugin pm-skills (tổng
   1 lượt dùng thật); GIỮ `pm-execution` (strategy-red-team sống + 4 skill
   discovery-pack tương lai) và `product-management` (brainstorm 7 lượt).
   Hệ quả F-C: nguồn vendor discovery-pack vẫn là pm-execution (đã giữ);
   `pm-data-analytics` cài lại 1 lệnh khi tới vòng đo.

## Tổng kết sau V1 — ba việc, kích hoạt khi trang-tu-van-v2 xong vòng

**Trigger:** Gate 2 ký + phiên UAT chạy xong + scorecard DP-1 có verdict.
**Nghi thức:** retro (skill `retro`, input = v1-journal + decisions.jsonl + số
round S4 + usage-report) → rồi làm ba việc theo thứ tự:

**Phương pháp đóng gói (quyết Manh 29/07):** từ điểm này kit phải TỰ DẪN
người dùng — không prompt đỡ tay từ ngoài; mọi chỗ kit hụt được GHI thành lỗ,
không được vá bằng coaching. Nguồn spec chính = **nhật ký can thiệp** của V1
(bảng A/B/C trong hội thoại 29/07): mọi paste-block loại A là nội dung thuộc
kit chưa được đóng gói. Lỗ mới phát hiện 29/07: kit KHÔNG có kênh tiếp nhận
phản hồi người GIỮA vòng (chỉ có Gate 2) — thêm quy ước "phản hồi người giữa
vòng → review-findings.md, card Cổng 2 trình lại" vào spec v2.

**Khung spec v2 (chốt 30/07 sau đối chiếu Graph-Engineering playbook +
restructure Nhịp):** Chương 1 **Nhịp KLĐQ** (primitive + 5 luật lồng + định lý
tự-động-hoá-Quyết: máy ⟺ thước-máy-ĐỘC-LẬP-DOER ∧ đảo-rẻ ∧ horizon-ngắn —
vế độc-lập-doer học từ r1-round-3 thước bị doer ghi sai; Quyết-máy PHẢI để
vết như Quyết-người) · C2 **Ba vòng
HIỂU/LÀM/TRAO + định tuyến A/B/C/D** · C3 **Cổng theo câu hỏi** (Đáng · Phạm-vi
· Kế-hoạch · Bằng-chứng · Giá-trị — display name, mã máy giữ) · C4 **Song
diện artifact** (mặt máy + mặt người) · C5 **Máy móc theo 5 planes**
(control/execution/artifact/graph/evaluation) + T3-hardening + block
`feature_loop.budget` (token/agent/cost khai trước — Workflow hỗ trợ sẵn) ·
C6 **Vận hành đội** (handbook, bảng dịch BRD/PRD/SPEC). Câu kiểm Bắc Đẩu của
cả spec: "mọi output quan trọng truy được về objective → plan → artifact →
source → evaluator → bounded run". Cross-feature knowledge: giữ
frontmatter-first; ngưỡng xét lại = tiêu chí §VIII.C playbook (connected
queries + provenance thành trung tâm) → lúc đó theo cookbook KG chính thức
(extract→resolve→assemble, luật chống false-merge). Đối chiếu đầy đủ:
hội thoại 30/07 + doc Graph-Engineering (~/Documents/Work/Docs/).

### 1 · ĐIỀU CHỈNH (spec v2 — viết một thể, không vá lẻ)
- Mô hình pha mới: phép đo tại UAT, Cổng UAT có quyền giết, luật phân loại
  giả định (đổi-thiết-kế → thử trước · đổi-giá-trị → đo tại UAT).
- **S1-D visual-first (quyết Manh 30/07, từ retro B1):** feature chạm UI →
  BẮT BUỘC khoảnh khắc visual TRƯỚC Gate 1: C2 proto bằng component thật +
  design-pass in-harness + capture; **Gate 1 duyệt trên bản bấm được, không
  duyệt UI bằng chữ**; AC UX neo vào bản đã duyệt; UAT chỉ đo giá trị trên
  sản phẩm đã đúng hình (tách 2 tín hiệu — chống âm-tính-giả). Đây là thay
  thế có-slot cho làn CT2 đã khai tử: nhu cầu visual-first giữ nguyên, chỉ
  đổi cỗ máy (in-harness, không gương ngoài). F-D theo đó NÂNG từ hạng mục
  đóng gói → giai đoạn workflow; r2 (T7-T9) là pilot chạy trước.
- D2.5 phép-thử-rẻ-không-cần-dựng (pattern schema-probe 8'); luật rẽ C2/C1/H1
  cho D3; template opportunity tách build/field + mục Đo-sau-ship.
- Trình-người-quyết = visual trước: mermaid trong design-doc + artifact sống
  gật-từng-phần (mẫu: session C 28/07); card nhúng sơ đồ.
- feature-loop: Gate 1 in MẶC ĐỊNH gợi ý /goal (bệnh "không tự loop" — hồ sơ
  3 nguyên nhân + tái hiện 28/07); S3 in một dòng routing execute; định đoạt
  nhánh chết subagent-driven (cho điều kiện kích hoạt hoặc xoá); /feature-loop
  tự chặn khi chạy cùng session discovery (friction 2deeed9b); quy ước
  một-worktree-một-phiên.
- DP-1 verdict quyết F-A/F-B như kế hoạch gốc (§Trình tự).

### 2 · ĐÓNG GÓI (workflow thành sản phẩm dùng lại)
- F-A/F-B theo DP-1 · F-C discovery-pack (vendor từ pm-execution đã giữ) ·
  F-D C2-distill + khai tử ceremony + skill design-pass (§Amendment 28/07).
- Handbook bổ sung: một mặt phẳng làm việc · giết-tại-UAT là thành công của
  quy trình · định tuyến brainstorm · quy định prototype (đã có §8 spec).
- ADR khi F-D land: "kit không bao giờ ship UI/component".
- Repo-side: nhập từ vựng onehub-design-system vào interactive-prototype rồi
  chuyển nó vào skills-retired.

### 3 · KIỂM TRA LẠI KIT & PLUGIN (vệ sinh định kỳ đầu tiên)
- Chạy nghi thức audit invoke (lệnh trong RETIRED.md của artifact-platform)
  trên cả kit + repo tiêu thụ; áp luật 0-invoke-một-quý.
- Đối chiếu marketplace description với thực tế sau khai tử (uy tín khi chia
  sẻ cộng đồng); kiểm P30 mirror + version sync; kiểm các executor mồ côi
  trong config consumer (vd `design_static_video_qf` trỏ plugin đã gỡ).
- Cài lại `pm-data-analytics` khi tới vòng đo (1 lệnh).

## Pilot r2 — kế hoạch thử nghiệm (30/07, Manh yêu cầu; pilot của TOÀN workflow v2)

**Trình tự:** B0 ship design-pass (merge branch signed-off về main + update plugin,
~15') → B1 Pha 3 gói lưới 5 món (chip kit, 1-2 buổi máy + ~20' gate) → B2 song
song: chuẩn bị r2 (chip artifact-platform: workspace `trang-tu-van-v2-r2`,
opportunity-r2 tham chiếu r1 + trường "Nguồn ngoài & phạm vi kế thừa" [E03:
logic CÓ / hình thái KHÔNG] + ngưỡng UAT chuyển từ r1 + bảng nợ kế thừa đề
xuất: T1-T6 keep kèm guard baseline-bắt-buộc & branch-cắt-từ-main [toàn bộ
code kế thừa nằm trong diff S4] / T7-T9 archive → trình Cổng 0, Manh ký ~10')
→ **B2.5 đấu dây consumer (review 30/07 phát hiện — không có chủ trước đó):**
config artifact-platform thêm `feature_loop.ui_standards_skill: create-onehub-plugin`
+ khối `design_pass` (`proto_route` — kèm quyết định dựng `/proto` shell hay hạ
bậc có khai); pilot-journal thêm LUẬT ĐẾM can-thiệp (không tính: entry có tài
liệu + câu neo · trả lời câu loop hỏi · quyết định tại cổng · hậu cần UAT);
contract r2 Notes ghi guard baseline-keep (7.3 chưa máy hoá — F-A); hẹn lịch
môi giới UAT ngay tại Gate 1 (chủ: Manh — bài học logistics-không-chủ r1)
→ B3 `/feature-loop trang-tu-van-v2-r2` session mới, kit-tự-dẫn 100%: S1
khuôn plugin → **S1-D design-pass chạy thật lần đầu** (quyết bậc vật liệu tại
chỗ: dựng `/proto` shell = C2 Đợt 1, hoặc degrade có khai `material:`) →
Gate 1 trên bản bấm được → S2→S4 → Gate 2 → B4 **phiên UAT đầu tiên** (bản
tay, uat-session skill chưa có): 3-5 môi giới, chấm kín + commitment device,
số so ngưỡng T1′/T2′ → Cổng UAT: release / iterate / kill.

**Số đo pilot (khai TRƯỚC khi chạy):**

| Số | Ngưỡng thành công | Tham chiếu |
|---|---|---|
| Can thiệp ngoài (đỡ tay) | ≤3 | r1: hàng chục · design-pass: ≈0 |
| Drift lớp-B1 (E03/khuôn plugin) tái xuất | 0 finding | r1: nguyên nhân bác Gate 2 |
| Round S4 | ≤3 | r1: 8 |
| Phút người mỗi gate | ~10′ | chuẩn đang giữ |
| UAT chạy thật | phiên diễn ra ≤7 ngày sau Gate 2, verdict có số | giả thuyết lớn nhất chưa kiểm |

**Định nghĩa thất bại (khai trước):** can thiệp >10 HOẶC drift B1 tái xuất →
DỪNG build, quay lại vá kit trước — không lặp lại lỗi đo-tại-cuối của r1.

## Nợ đã khai (NGOÀI kế hoạch này — không phải bỏ sót)

- Thao tác cổng người thứ 6 + khoá model-invocation 2 harness + P31/P32 mở
  rộng (chờ DP-3).
- Máy-kiểm guard 7.1 (contract mù-prototype) — đợt đầu là quy ước.
- Hook enforce `decided_by` trước S1.
- Auth connectors (Notion/Linear/analytics) cho D1a supercharged — việc của
  user trên claude.ai settings, không phải hạng mục kit.

## Input đã chốt (2026-07-27)

1. **Duyệt kế hoạch**: ✅ Manh Phan, trong chat.
2. **V1**: repo Artifact Platform, Manh làm trực tiếp theo
   [protocol + scorecard](../research/2026-07-27-v1-discovery-probe-protocol.md)
   (ngưỡng GO/NO-GO khai trước; luật context-sạch: S0/S1 chạy session mới).
3. **Handbook (G2)**: repo nhẹ mới (scaffold tại `~/dev/team-handbook`,
   đổi tên/di chuyển tuỳ ý).
4. **R1/V2**: giả định Artifact Platform — xác nhận lại khi chạy R1.

## Bổ sung 2026-07-28 (từ probe V1 + spec C2 của artifact-platform)

| ID | Việc | Nơi chạm | Tier | Phụ thuộc |
|---|---|---|---|---|
| F-D | Chưng cất C2 "prototype bằng đồ thật" vào design-loop (Đợt 2 của spec C2 bên artifact-platform): bước S1-D.0 "bề mặt đã tồn tại?" + luật rẽ C2/C1/H1 + `proto-lint.mjs` generic + `/proto-init`; kèm 2 yêu cầu cộng đồng: chạy được KHÔNG cần design repo (capture optional) + block `proto:` theo bất biến đường-đọc-cũ; land kèm 1 ADR "kit không ship UI/component" | `design-loop/` + mirror | T2 | proto-c2 (app repo) qua Gate 2 — KHÔNG gate bởi DP-1 |

**Learnings queue (sửa spec discovery MỘT THỂ sau DP-1, không vá giữa probe):**
1. Thêm D2.5 — chạy hết phép thử không-cần-dựng trước, rẻ→đắt (probe: schema-probe 8' giết 1 ẩn số trước khi dựng).
2. Tách D3-build ↔ D3-field; logistics field-test phải có chủ (spec C2 §3.2 giải: PR Preview + `/api/track`).
3. D3-field là LỰA CHỌN CÓ GIÁ quyết tại Cổng 0 (field-test / đội-tự-chấm + đo-sau-ship), không phải nghi thức bắt buộc — quyết 28/07: descope hợp lệ khi ngưỡng gốc chuyển thành thước Đo-sau-ship + AC, có entry descope + revisit.
4. Dòng D3 spec: "interactive-prototype (C1i)" → "theo luật rẽ C2/C1/H1" (bề mặt đã tồn tại → C2 mặc định).
5. D1a đắt vì khảo cổ thiếu nền (293'/373' probe) — dữ liệu n=1 cho việc nâng lại nhánh R product-context; chờ feature thứ 2.

## DP-1 — Scorecard (điền sau V1)

| Tiêu chí | Ngưỡng | Kết quả (đo 29/07, v1-journal worktree) | Đạt? |
|---|---|---|---|
| Thước đo thành công → criterion | ≥70% | **2/2 (100%)** — "% khách chấm" → AC-15+AC-10 (chỉnh-mạnh-lên: contract buộc định nghĩa đếm + truy vấn); "xếp hạng mục mở" → AC-6+AC-14 (chỉnh-hạ-cấp-có-lý-do: khai thiên lệch vị trí). Bonus: cả 3 ngưỡng UAT/async cũng truy được (nguyên-chuyển-thì / mất-có-giải-trình) | ✅ |
| Out of scope chép sang contract | không mất bullet không giải trình | **Mất 0/5** — 3 nguyên văn, 2 nhánh-đã-bác thành ràng buộc kiến trúc (có ghi chú); S1 còn THÊM 6 bullet mới | ✅ |
| S1 hỏi trùng thông tin đã có | ≤1 câu | **0/5 câu trùng** (bảng đối chiếu từng câu trong journal) | ✅ |

*Chú thích hợp lệ: memory `e03-direction` không cách ly trước session C — nhưng
mọi tracer quyết định đều "chỉ-file" (re-rank #1, SourceBundle/TA, 3 lớp ô);
cột nguồn ghi rõ từng dòng.*

**Verdict: GO** — ký: **Manh Phan** ngày: **2026-07-30** (lệnh minh danh trong
chat maintainer session; máy điền số 29/07, người ký 30/07). **DP-1 GO chính
thức mở khoá F-A + F-B** theo §Trình tự & điểm quyết.
