# WORKFLOW v2 — SPEC HỢP NHẤT

*v2.0-rc · 30/07/2026 · Trạng thái: bản hợp nhất được duyệt cùng chiến dịch
chứng-chỉ-toàn-tuyến (plan `2026-07-30-full-run-certification.md`); sẽ nhận
chứng chỉ sau full run Trang Tư Vấn.*

**SUPERSEDES:** `2026-07-30-workflow-v2-overview.md` (patchwork) ·
`2026-07-27-discovery-gate0-design.md` (draft trước pivot UAT) · mọi
amendment rải trong `2026-07-27-discovery-gate0-rollout.md` (plan giữ vai
NHẬT KÝ chương trình + số đo). Hai retro trong `docs/research/` là SỬ LIỆU.
**Đây là file DUY NHẤT một session cần đọc để hiểu workflow.**

---

## CHƯƠNG 1 — NHỊP: đơn vị nhỏ nhất

### 1.1 Primitive

> **NHỊP = KHAI → LÀM → ĐO → QUYẾT.**
> **Khai**: ý định + thước đo/ngưỡng thành artifact máy-đọc, TRƯỚC khi làm.
> **Làm**: Claude thực thi. **Đo**: bằng chứng so với thước ĐÃ khai.
> **Quyết**: mọi kết cục hợp lệ — giữ, sửa, GIẾT.

Toàn bộ workflow là nhịp lồng nhịp theo cỡ: **phút** (phép-thử-rẻ, một vòng
design-pass) · **giờ** (round S4, phiên design-pass) · **ngày** (vòng
feature: Cổng Đáng → Cổng Giá-trị) · **tuần** (chương trình/pilot). Chẩn
đoán lỗi: mọi sự cố là một nhịp thiếu một thì (thước nói dối = gãy ĐO;
kế thừa rơi trụ = thiếu KHAI; loop không chạy = LÀM không nối; UAT không
diễn ra = nhịp TRAO chưa đóng).

### 1.2 Năm luật lồng ghép

1. Nhịp con ĐÓNG trước khi nhịp cha QUYẾT (evidence cuộn lên).
2. Thước của nhịp khai tại thì QUYẾT của nhịp cha trước đó (ngưỡng UAT khai
   ở Cổng Đáng; evals duyệt ở Cổng Phạm-vi).
3. Doer≠grader trong từng nhịp: thì LÀM và thì ĐO không chung context.
4. Mọi thì để vết trong workspace artifact (một mặt phẳng làm việc).
5. Cổng NGƯỜI chỉ đặt ở nhịp đảo-ngược-đắt hoặc thước-không-máy-được.

### 1.3 Định lý tự-động-hoá thì QUYẾT

> **Quyết = máy ⟺ thước-máy-ĐỘC-LẬP-DOER ∧ đảo-ngược-rẻ ∧ horizon-ngắn.
> Hỏng một vế → Quyết = người. Quyết-máy PHẢI để vết như Quyết-người.**

Vế độc-lập-doer học từ r1-round-3 (doer ghi sai exit_code — thước "là máy"
nhưng bị doer kiểm soát ⇒ không tính). Hệ quả: S4 tự lặp round là hợp lệ;
chữ ký cổng KHÔNG BAO GIỜ máy hoá (thước = ý định + trách nhiệm — không tồn
tại dạng máy về nguyên tắc; khoá model-invocation ADR 0002 là hardcode của
định lý). Quy trình 3-câu-hỏi khi tranh luận tự-động-hoá: (1) thước máy độc
lập doer? (2) đảo tốn gì? (3) vòng phản hồi ngắn? — 3✓ máy hoá kèm vết;
1✗ cổng người.

---

## CHƯƠNG 2 — BA VÒNG & ĐỊNH TUYẾN

### 2.0 Nền (1 lần / repo — đứng ngoài vòng)

`/acceptance-init` (config cổng) · wire CI pre-merge · skill chuẩn
plugin/DS của repo · handbook đội · 2 key consumer:
`feature_loop.ui_standards_skill` + khối `design_pass` (proto_route…).

### 2.1 Vòng HIỂU — mơ hồ → quyết đáng-làm

- **D1 hai mode**: *brainstorm* (diverge, cùng nghĩ —
  `product-management:brainstorm`) và *grill* (phỏng vấn rút tri thức ngầm —
  bộ câu hỏi cấu trúc: phạm vi phủ định · biên nhận "build đúng mọi lời mà
  X thì có nhận không?" · trade-off ép chọn · kể-lần-gần-nhất · "điều gì
  hiển nhiên với anh mà tôi không biết?"). Mỗi câu grill đổ THẲNG vào một
  mục `opportunity.md` (template: `skills/acceptance/references/
  opportunity-template.md`, 1.27.0).
- **Luật kế thừa vật liệu ngoài** (trường "Nguồn ngoài & phạm vi kế thừa"):
  KIỂM KÊ đủ danh mục nguồn trước (inventory-first — cấm phân loại theo trí
  nhớ), rồi phân loại từng món: *triết lý/logic* kế thừa được; *ngôn ngữ
  thiết kế/hình thái* mặc định KHÔNG (chuẩn repo tiêu thụ thắng; muốn kế
  thừa phải khai + người ký).
- **D2 red-team** — phiên/pass TÁCH khỏi brainstorm (chống cùng-mù-điểm);
  output: bảng giả định xếp theo phép-thử-rẻ-nhất.
- **D2.5 phép-thử-rẻ** — chạy HẾT ẩn số không-cần-dựng trước (đọc schema,
  hỏi trực tiếp…), rẻ→đắt; giả định ĐỔI-THIẾT-KẾ phải thử trước khi build.
- **D3 prototype = HỘI TỤ Ý ĐỊNH, không đo lường** — dựng với kỷ luật như
  code sẽ sống; timebox; KHÔNG mang ngưỡng chết riêng (phép đo đã dời về
  UAT). Số phận code quyết tại Cổng Đáng.
- **CỔNG ĐÁNG** (`gate0`, người): build/iterate/park/kill + số phận code
  (keep→bảng nợ kế thừa + guard; archive) + **KHAI NGƯỠNG UAT tại đây**
  (luật lồng #2).

### 2.2 Vòng LÀM — quyết → sản phẩm chứng minh được (feature-loop)

- **S0**: derive tier (T1 thoát có xác nhận) · worktree RIÊNG mặc định
  T2/T3 (một-worktree-một-phiên) · đọc `opportunity.md` làm input · guard
  trùng-slug.
- **S1**: design doc + `contract.md` (5-15 AC GWT + Coverage) +
  `evals.yaml` (cmd `config:` ref, `paths:` cho carry-forward, cặp
  cross-layer) · chạm UI → BẮT nạp skill `feature_loop.ui_standards_skill` ·
  coverage-scan (morphological-scan, CT-S T2/T3) · **gap-probe context-sạch**
  (subagent fresh, chỉ 4 file; cross-check gồm câu platform-fit: "artifact
  có tuân CHUẨN SẴN CÓ của repo cho lớp artifact này — skill/quy định nào
  LẼ RA phải nạp mà chưa?").
- **S1-D (UI feature, BẮT BUỘC — descope phải có tên)**: skill
  `design-pass` (acceptance-gate ≥1.26.0) — phiên chuyên trách CHỈ thẩm mỹ
  + UX trên bản bấm được (component thật, thang vật liệu 3 bậc — hạ bậc
  khai `material:`; thang DS: skill repo → shadcn-vocabulary mặc định);
  owner ngồi xem Browser pane; cấm sửa `components/ui` "cho đẹp";
  kết phiên: capture ma trận state + findings 2 nhóm.
- **CỔNG PHẠM VI** (`gate1`, người): duyệt contract + evals + **BẢN BẤM
  ĐƯỢC** — không duyệt UI bằng chữ; sơ đồ trình bằng mermaid trong doc
  (visual-as-code); khi duyệt: in MẶC ĐỊNH gợi ý `/goal` (GOAL-TEMPLATE
  nhúng SKILL, 1.19.0) + gợi ý đổi model nếu phiên đang tier đắt.
- **S2 plan**: task = Files/verify-cmd/serves-evals/`independent:` ·
  **CỔNG KẾ HOẠCH** (`gate15`) chỉ T3.
- **S3 execute**: tuần tự main-loop mặc định; ≥2 task independent →
  Workflow `execute-parallel`; VÀO S3 in 1 dòng routing ("plan có X
  independent → đường Y vì Z"); chuỗi dài → checkpoint giữa chuỗi
  (build+smoke sau cụm nền tảng); code kế thừa (keep) phải nêu đích danh
  trong plan.
- **S4 verify** — MỘT Workflow run/round (`acceptance-verify.js`, fresh
  agents): evals máy + judge panel đa-lens + review + baseline analyst ·
  carry-forward P1 (delta×paths, atomic-pair cross-layer) / P2 (baseline
  theo evals-hash) / P3 (panel theo inputs-hash) · **cap 3 round — vượt =
  DỪNG escalate, mỗi round vượt cần 1 phê chuẩn người có vết** · disposition
  keep ⇒ runBaseline bắt buộc + eval non-discriminating không tính evidence
  (tạm ghi ở contract Notes cho tới khi máy hoá).
- **CỔNG BẰNG CHỨNG** (`gate2`, người): judgment items = câu hỏi nghiệp vụ
  phi-kỹ-thuật; signoff commit human-fields-only riêng; **TỪ CHỐI là kết
  cục hợp lệ có hồ sơ** (tiền lệ r1: máy hội tụ, người bác vì khung — hợp
  đồng chỉ bảo vệ thứ nó có ghi); đóng-vòng-không-signoff = ledger entry +
  commit đóng vòng (status `superseded` chính thức: T3-hardening).

### 2.3 Vòng TRAO — chứng minh → tay người dùng + số quay về

- **Phiên UAT** (sản phẩm THẬT sau flag): mời stakeholder/người dùng đại
  diện; **chấm kín trước thảo luận** (chống social-desirability) +
  **commitment device** ("anh gửi cho khách nào, khi nào?"); đo bằng
  tracking thật; số so ngưỡng ĐÃ khai ở Cổng Đáng — không sửa ngưỡng sau
  khi thấy số.
- **CỔNG GIÁ TRỊ** (`gateUAT`, người): release / iterate / **KILL — giết
  tại đây là THÀNH CÔNG của quy trình** (câu trả lời mua bằng giá một vòng
  build), không phải thất bại người làm.
- **Release** → **S5**: PR/merge theo nghi thức repo · **đối soát tài liệu
  sản phẩm** (PRD/Tech-Arch/GLOSSARY mô tả HIỆN TRẠNG mới — workflow
  KHÔNG SINH PRD, workflow NUÔI PRD; chưa có PRD → seed từ contract +
  opportunity SAU ship) · regenerate PRODUCT-MAP · đặt reminder đo-sau-ship.
- **Vòng đo sau ship**: kết quả đo append vào opportunity → retro
  per-feature (input: journal + ledger + rounds + usage) → nuôi D1 vòng sau.

### 2.4 Định tuyến A/B/C/D — máy-suy, không hỏi người

> **UAT theo GIẢ ĐỊNH, không theo kích thước/UI.**

| Đường | Dấu hiệu (máy-suy từ artifact) | HIỂU | S1-D | gap-probe đối chiếu | Sau Cổng Bằng-chứng |
|---|---|---|---|---|---|
| **A** value-bet | có opportunity + ngưỡng UAT | đầy đủ | theo UI | chuẩn plugin/DS | **UAT → Cổng Giá-trị** |
| **B** UI-không-giả-định-mới | chạm UI, không opportunity | không (nguồn: lát-2/known-limits) | **BẬT** | chuẩn plugin/DS | ship thẳng (nghiệm thu trải nghiệm = Cổng Phạm-vi bản-bấm-được; đo qua tracking) |
| **C** backend/kỹ thuật | không UI, không opportunity | không (nguồn: queue/plan/retro) | tắt | **invariant backend repo** | ship thẳng ("UAT" = itest trong evals; T3 → soak) |
| **D** T1 | match `t1_skip_globs` | — | — | — | thoát S0 có xác nhận |

Chống-quên: đường B/C → contract Notes TỰ ghi "không giả định giá trị mới —
không phiên UAT" (cổng thấy chữ); có ngưỡng UAT mà định ship thẳng → CHẶN.

---

## CHƯƠNG 3 — CỔNG (tên theo CÂU HỎI; mã máy giữ nguyên)

| Cổng (hiển thị) | Mã máy | Câu hỏi | Quyền |
|---|---|---|---|
| Cổng ĐÁNG | gate0 | Có đáng build? Code thăm dò sống hay chết? | kill cơ hội, archive code |
| Cổng PHẠM VI | gate1 | Đúng phạm vi + đúng hình? (trên bản bấm được) | sửa/chặn trước khi tốn build |
| Cổng KẾ HOẠCH | gate15 (T3) | Plan đúng đường? | chặn trước code |
| Cổng BẰNG CHỨNG | gate2 | Bằng chứng tin được? Judgment items? | **từ chối có hồ sơ** |
| Cổng GIÁ TRỊ | gateUAT | Người dùng nhận không? | **kill sau build = thành công** |

Nguyên tắc cổng: card là MẶT NGƯỜI (contract/evidence vẫn nguồn sự thật);
chữ ký khoá model-invocation (2 harness, ADR 0002); phút người ghi
`time_human_minutes`; visual-first khi trình (mermaid trong doc, bản bấm
được, thẻ) — không bắt người quyết trên YAML/ASCII.

---

## CHƯƠNG 4 — SONG DIỆN ARTIFACT

> **Mọi artifact hai mặt: mặt MÁY (frontmatter/schema — hook/CI/session đọc)
> + mặt NGƯỜI (card/render/bản-bấm-được). Artifact một mặt là artifact hỏng.**

### 4.1 LUẬT NGÔN NGỮ MẶT NGƯỜI (bắt buộc — quyết Manh 01/08)

**Phạm vi áp dụng:** mọi thứ trình cho người để đọc/quyết — thẻ cổng, bảng
tóm tắt kế hoạch, báo cáo checkpoint, tin nhắn tại điểm quyết định, handbook,
release notes. **KHÔNG áp** cho mặt máy (evals, run-log, code, frontmatter) —
ở đó tên chính xác là bắt buộc.

| # | Luật |
|---|---|
| N1 | **Chủ ngữ là người dùng hoặc sản phẩm, không phải file.** Câu nói *người dùng sẽ thấy gì khác*, không nói *sửa gì ở đâu*. |
| N2 | **Tên kỹ thuật (file/hàm/biến/bảng) xuống cột phụ hoặc ngoặc** — không bao giờ làm chủ ngữ. |
| N3 | **Mã số là tra cứu, không phải nội dung.** Lần đầu xuất hiện ở mặt người phải kèm 3–5 chữ nói nó là gì. |
| N4 | **Một dòng một ý** — không nhồi nhiều việc vào một ô bằng dấu phân cách. |
| N5 | **Hình trước, chữ là chú thích** tại mọi điểm quyết định (bảng có cột rõ · sơ đồ · bản bấm được). Câu hỏi cho người phải trả lời được bằng có/không hoặc a/b. |
| N6 | **Không dùng biệt ngữ nội bộ chưa có trong từ điển sản phẩm.** |

**Hai phép thử (rẻ, làm được trong vài giây):**
- **Xoá-tên-máy**: xoá hết tên file/hàm/biến/mã số khỏi câu — còn nghĩa cho
  người không đọc code thì ĐẠT; thành rỗng hoặc mơ hồ thì viết lại.
- **Người-thứ-ba**: một người trong đội không đọc code kể lại được *"sau việc
  này người dùng thấy gì khác"* không?

**Cưỡng chế (không dựa vào trí nhớ):** luật sống thành file tham chiếu trong
kit, được **nạp tự động bởi bộ dựng thẻ** — mỗi lần render là luật được đọc;
ba chỗ trỏ tới nó: thẻ cổng · bảng tóm tắt kế hoạch · báo cáo checkpoint.
Nấc máy soi (khi nâng bộ thẻ): đếm mật độ token kỹ thuật ở vùng mặt-người,
ratchet như census design system. Vi phạm ở cổng = người duyệt có quyền trả
lại, ghi `lỗ-kit` vào sổ.

*Vì sao là luật chứ không phải skill: skill chờ được gọi sẽ chết lúc bận
(tiền lệ ceremony design đã khai tử). Luật nhúng vào chỗ nghẽn đầu ra thì
không có đường vòng.*

Chuỗi & bảng dịch cho người mang từ vựng cũ:

| Cũ | Mới | Đóng băng khi | Máy bám |
|---|---|---|---|
| BRD | `opportunity.md` + ngưỡng UAT | Cổng Đáng | frontmatter |
| PRD (duyệt) | `contract.md` per-vòng | Cổng Phạm-vi (`approved_by`) | hook + CI |
| PRD (mô tả) | **PRD-được-nuôi** xuyên vòng (docs sản phẩm) | không — cập nhật tại S5 | lens docs-drift |
| Spec kiến trúc | design doc S1 + probe evidence | — | — |
| Test plan/QA | `evals.yaml` + evidence-report | signoff | hook + CI |
| Roadmap | **PRODUCT-MAP** view SINH từ frontmatter (`epic:`/`supersedes:`/`relates:`) — KHÔNG graph DB; roadmap = truy vấn trên park/lát-2/out-of-scope đã ký | regenerate = hết drift | script |

**Vận hành PRODUCT-MAP (quyết 30/07):** engine = `scripts/product-map.mjs`
(generic, KHÔNG thuộc diện khoá invocation — tách khỏi lệnh người
`/acceptance-report --map` vẫn khoá theo ADR 0002) · ghi cạnh: `epic:` tại
D1b (grill) → S1 chép sang contract; `supersedes:` tại Cổng Đáng · **regen
tại MỌI lần đóng cổng người** (Đáng/Bằng-chứng/Giá-trị/S5 — cùng khoảnh khắc
đối soát PRD) · chống drift: `--check` trong CI (pattern P30) · ĐỌC tại bước
chọn-feature (roadmap = truy vấn park/lát-2).

**4 lớp chống-missing tại đầu**: (1) grill-elicitation — điều BIẾT mà chưa
nói; (2) kiểm kê nguồn ngoài inventory-first — điều trong tài liệu nhưng rơi
khi liệt kê; (3) coverage-scan + chân ngành — must-have KHÔNG biết mình
thiếu; (4) giả định + UAT — unknown-unknowns: đo, không phỏng vấn.

Sổ quyết định `decisions.jsonl`: rationale KHÔNG override contract;
append-only; `supersedes` không xoá dòng cũ; rule đáng-log (loại phương án ∨
nhận downside ∨ có revisit); seal tại Cổng Phạm-vi.

---

## CHƯƠNG 5 — MÁY MÓC (5 planes)

| Plane | Trong kit |
|---|---|
| Control | feature-loop SKILL + main loop session |
| Execution | Workflow subagents (fresh context, ≤16 concurrent) + worktrees |
| Artifact | `_acceptance/<slug>/` (immutable-lean: evidence, report, ledger) |
| Graph | frontmatter edges + `run-log.jsonl` (work lineage) + ledger supersedes |
| Evaluation | evals 4 executor + hook write-time + pre-merge CI + judge panel + baseline |

**4 bất biến ghi-graph (khớp playbook Anthropic 4/4)**: mọi claim có nguồn
(`source_field`/V-NUM) hoặc đánh dấu inference · mọi artifact có run
(`run_id`) · mọi evaluation có rubric (personas/criteria) · mọi thứ bị
supersede vẫn truy được (append-only).

**Câu Bắc Đẩu** (acceptance test của chính spec): *mọi output quan trọng
truy được về objective → plan → artifact → source → evaluator → bounded run.*

**Kỷ luật thước đo** (giá 4/8 round r1): thước phải tự-phản-nghiệm được;
doer≠grader là TIỀN ĐỀ của mọi Quyết-máy. T3-hardening backlog: đối chiếu
exit_code report↔run-log per run_id · hash ảnh capture đôi-một khác · cap
round cứng · verify-agent read-only trên cây sản phẩm · status `superseded`
· block `feature_loop.budget` (token/agent/cost khai trước — Workflow hỗ
trợ sẵn).

**Một mặt phẳng làm việc**: mọi vòng lặp trong Claude Code trên artifact
thật; công cụ ngoài = tham khảo chụp-dán, không mắt xích bắt buộc. Audit
invoke định kỳ: skill 0-invoke một quý → khai tử hoặc tái định vai.

---

## CHƯƠNG 6 — VẬN HÀNH ĐỘI

- **Vai**: owner = quyết tại cổng + feedback (không đỡ nội dung) · session
  per-vòng = kit-tự-dẫn (một-worktree-một-phiên) · maintainer = quan sát,
  ghi lỗ vào nhật ký can thiệp (mọi paste-block loại A = nội dung kit chưa
  đóng gói), tổng hợp checkpoint.
- **Feedback giữa vòng**: mọi phản hồi người tại bất kỳ bước nào → session
  PHẢI ghi `review-findings.md`/pilot-journal (bước · nguyên văn · xử lý:
  fix-tại-chỗ / chờ-cổng / lỗ-kit). Không ghi = lỗ.
- **Quy định prototype**: D3 dựng kỷ luật như code sẽ sống; số phận quyết
  tại Cổng Đáng theo bảng nợ — không theo cảm giác tiếc code.
- **Định tuyến brainstorm**: chưa qua Cổng Đáng → PM brainstorm (làm gì);
  trong S1 → `superpowers:brainstorming` (làm thế nào).
- **Lối vào người mới**: PRODUCT-MAP → PRD → opportunity/card.
- **KPI bằng TẦN SUẤT** (cơ hội vào/tháng · kill-rate từng cổng ·
  conversion · phút/cổng) — không phút/lần.
- `/goal` cho đoạn máy (không bao giờ đặt goal tới signed-off).

---

## PHỤ LỤC

**A. Thuật ngữ mới (authoring-level; CONTEXT.md cập nhật khi F-series land):**
Nhịp KLĐQ · grill-mode · song diện · đường A/B/C/D · Cổng
Đáng/Phạm-vi/Kế-hoạch/Bằng-chứng/Giá-trị (display) · nuôi-không-sinh ·
inventory-first · một-mặt-phẳng · phễu-phải-có-lưới.

**B. Trạng thái triển khai**: xem plan rollout (nhật ký + số đo) — đã ship:
design-pass 1.26.0, gói lưới 1.27.0/1.19.0, DP-1 GO; queue: F-A (discovery
guide/elicitation + S0 auto-đọc + guard 7.2/7.3 máy) · F-B (PRODUCT-MAP +
card gate0/gateUAT + uat-session) · F-C (discovery-pack) · F-D
(proto-init/lint + khai tử ceremony) · T3-hardening (C5).

**C. Nguồn gốc & đối chiếu ngoài**: hội tụ độc lập với playbook
Graph-Engineering (Karpathy/Anthropic) — ratchet ≅ Nhịp; program.md ≅
SKILL-as-config; 5 planes; tiêu chí §VIII.C là ngưỡng xét lại graph DB.
