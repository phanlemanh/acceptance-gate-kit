---
schema_version: 1
feature: Scope-triage cho review findings ở S4 — ngăn thứ ba "thật nhưng ngoài hợp đồng"
slug: s4-scope-triage
risk_tier: T3
surfaces: [cli]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-07-27T12:16:56Z
owner: phanlemanh@gmail.com
---

## Criteria

- AC-1: Given một round S4 mà mọi eval/suite xanh nhưng có ≥1 confirmed finding severity `high` được triage `inContract: true` (kèm `acRef`), When verdict routing chạy, Then verdict là `REJECT` và finding đó nằm trong `rejectFindings` của result — máy tự quay S3 fix cái đã bounded bởi contract, không chờ human. Đối chứng dương: cùng round đó nếu finding là `medium` thì verdict giữ `PASS`.
- AC-2: Given cùng round mọi eval xanh và confirmed finding severity `high` được triage `inContract: false`, When verdict routing chạy, Then verdict giữ nguyên `PASS` (finding KHÔNG đổi verdict), finding KHÔNG nằm trong `rejectFindings`, và xuất hiện trong section `## Ngoài hợp đồng` của review-findings.md kèm `proposal` (`known-limits` | `new-contract`) — ngăn thứ ba tồn tại và không kéo máy đi sửa.
- AC-3: Given confirmed finding severity `medium`/`low` triage `inContract: true`, When round kết thúc, Then không REJECT vì nó, finding ghi trong section `## Trong hợp đồng` kèm `acRef` — informational, ngưỡng REJECT chỉ dành cho `high`.
- AC-4: Given triage agent chết cả lần retry (hoặc contract.md không đọc được), When verdict routing chạy, Then KHÔNG có REJECT nào bắt nguồn từ findings (kể cả high), result mang `triageFailed: true`, mọi confirmed finding vào section `## Chưa phân loại (triage-failed)` — fail-toward-human, không đoán scope. Đối chứng dương: triage sống → không có section đó và cờ false.
- AC-5: Given round có eval FAIL (REJECT sẵn) VÀ hỗn hợp findings in-contract + out-of-contract, When result trả về, Then `rejectFindings` chứa ĐÚNG các finding in-contract và KHÔNG chứa finding out-of-contract nào — dù round REJECT vì lý do khác, out-of-contract không bao giờ lọt vào fix-list. Đây là chốt chặn spiral OneFlow.
- AC-6: Given round có finding `unverified: true` (refuter chết), When triage chạy, Then finding unverified KHÔNG được đưa vào input triage và vẫn liệt kê ở section "Chưa adversarial-verify" như hành vi hiện tại — regression guard.
- AC-7: Given ≥2 confirmed findings có `file` không khớp bất kỳ glob nào trong union `paths` của mọi eval, When result trả về, Then `coverageCluster = {count, total, files}` và review-findings.md có dòng cờ "dừng và quyết: mở rộng contract hay rút scope"; Given ĐÚNG 1 finding ngoài vùng phủ, Then `coverageCluster` là null — cờ đòi cụm (≥2), 1 finding lẻ không đẩy human vào quyết định mở-rộng-hay-rút-scope; Given không eval nào khai `paths`, Then `coverageCluster` là null và review-findings.md ghi 1 dòng "cluster: n-a" — không flag, không fail.
- AC-8: Given review-findings.md thế hệ CŨ (không có section Trong/Ngoài hợp đồng), When card Cổng 2 render theo chỉ dẫn mới (cả `commands/acceptance-card.md` lẫn bản codex), Then chỉ dẫn card có nhánh tường minh "không có section → render như cũ" — backward-tolerant, workspace cũ không lỗi.
- AC-9: Given SKILL feature-loop-codex vùng S4, When soi text, Then có bước triage tương đương: 3 ngăn (in-contract / out-of-contract / unclassified), quyền REJECT chỉ cho in-contract high, fail-toward-human khi triage hỏng — parity hai harness, không lệch ngữ nghĩa.
- AC-10: Given evidence-report.md của round có triage (mọi verdict), When soi shape, Then KHÔNG có field/section triage mới nào trong evidence-report.md — thông tin triage chỉ sống trong review-findings.md (ngoài hook); hook evidence-gate L1/L2/L3 giữ nguyên hành vi trên report cũ lẫn mới.
- AC-11: (judgment) Given khối "Ngoài hợp đồng" trên card Cổng 2 render từ fixture mẫu, When một người quyết kinh doanh (không đọc code) đọc khối đó, Then họ hiểu finding là thật-nhưng-ngoài-phạm-vi-đã-duyệt và phân biệt được 3 lựa chọn: ghi Known limits / mở contract mới / nâng scope sửa ngay — bằng ngôn ngữ sản phẩm, không jargon.
- AC-12: Given round BLOCKED (suite/eval không chạy được) VÀ có confirmed finding severity `high` triage `inContract: true`, When verdict routing chạy, Then verdict vẫn là `BLOCKED` — vế REJECT-từ-finding là vế mới nhưng đứng DƯỚI BLOCKED check như mọi nguồn REJECT khác; không fan-out fix nào từ findings trên môi trường hỏng. Đối chứng dương: cùng fixture không BLOCKED → `REJECT`.
- AC-14: Given khuôn tài liệu mà prompt synthesize CHỈ DẪN cho `review-findings.md` (rút thẳng từ `acceptance-verify.js`, KHÔNG phải fixture viết sẵn theo khuôn parser), When `lib/out-of-contract.js` đọc một tài liệu dựng đúng khuôn đó, Then mỗi finding out-of-contract parse ra đủ `title` / `file` / `severity` / `proposal` / `plain` khác rỗng — bên VIẾT và bên ĐỌC phải khớp nhau bằng máy, không bằng mắt. Đối chứng dương: đảo thứ tự dòng `Người dùng thấy gì` với dòng title trong tài liệu → case ĐỎ. Đây là AC bổ sung ở round 4 vì cùng một lớp lỗi "writer↔reader trôi khỏi nhau" đã tái diễn 3 round liên tiếp mà không eval nào đỏ.
- AC-15: Given SKILL feature-loop-codex vùng S4, When soi text, Then nó chỉ dẫn writer ghi ĐÚNG khuôn của AC-14 — có dòng `Người dùng thấy gì:` (trường `plain`) và cấu trúc `- **<title>**` + các dòng khoá thụt vào — vì hai harness render qua CÙNG `gate-card.js`; thiếu chỉ dẫn này thì mọi mục trên thẻ Codex ra placeholder và parity của AC-9 chỉ là chữ.
- AC-13: Given repo kit, When soi CI và config, Then `.github/workflows/gate.yml` có step chạy `tests/workflows/run-tests.sh` VÀ `_acceptance/config.yaml` có `executors.test.workflows` + key đó trong `feature_loop.suite_keys` — wiring là deliverable của feature, không phải lời hứa.

## Coverage

- Trục loại finding: confirmed-high | confirmed-med/low | unverified [thước CE: AC-1/AC-3/AC-6]
- Trục kết quả triage: in-contract | out-of-contract | unclassified [thước CE: AC-1/AC-2/AC-4 — SARIF baseline: phân loại là trạng thái máy-đọc]
- Trục bối cảnh verdict: evals xanh | evals đỏ | BLOCKED (dominates cả vế REJECT-từ-finding MỚI — ghim bằng AC, không waive) [thước CE: AC-1/AC-2/AC-5/AC-12]
- Trục cluster: computable-có-cụm (≥2) | computable-1-finding-lẻ (không cờ) | computable-không-cụm | n-a-không-paths [thước CE: AC-7 — SonarQube Clean-as-You-Code: biên phạm vi của finding]
- Trục tương thích ngược: file findings cũ không section | hook shape nguyên vẹn [thước CE: AC-8/AC-10]
- Trục harness parity: Claude workflow JS | codex text [thước CE: AC-9]
- Trục người-đọc-gate: khối Ngoài-hợp-đồng đọc được bằng ngôn ngữ sản phẩm [thước CE: AC-11]
- Trục seam writer↔reader: tài liệu máy VIẾT phải được máy ĐỌC lại đúng, đo bằng round-trip chứ không bằng fixture dựng sẵn theo khuôn reader [thước CE: AC-14/AC-15 — trục thêm ở round 4; thiếu nó thì 3 round liên tiếp lỗi cùng lớp mà mọi eval vẫn xanh]

## Out of scope

- **Auto-fix out-of-contract findings.** Chính là bệnh OneFlow mà feature này chữa — máy sửa hành-vi-không-đặc-tả dưới áp lực review. Không bao giờ.
- **Triage bằng heuristic/regex thay LLM.** Finding là văn tự nhiên; map vào AC là việc ngữ nghĩa.
- **Ngưỡng severity configurable per-repo** (vd cho med/low cũng REJECT). Chờ dữ liệu vận hành; mở contract sau nếu cần.
- **Triage cho suite-command failures.** Suite fail là REJECT vô điều kiện như cũ — đó là thước của repo, không phải finding của reviewer.
- **Auto-draft contract mới từ out-of-contract findings.** Đề xuất `new-contract` chỉ là chữ trên card; việc mở contract là của human.

## Known limits (người duyệt chốt ở Cổng 2 — 2026-07-28)

Round 6 PASS. Người duyệt ký và chọn GOM toàn bộ mục dưới đây vào MỘT hợp đồng
kế tiếp (`s4-doc-truth-guard`) thay vì vá lẻ — vá lẻ chạm file gated sẽ làm
evidence stale và đốt thêm round mà vẫn còn nợ. Không mục nào bị bỏ im lặng.

**Sửa tier sau khi ký (2026-07-28, phát hiện ở review round 12 của
`premerge-rules-ledger`):** hợp đồng này khai `risk_tier: T2` cho tới lúc ký,
trong khi chính nó thêm `lib/out-of-contract.js` ở round 2 (commit `3a31688`) —
`lib/**` nằm trong `risk_tiers.t3_paths`, nên theo luật S0 của skill ("Match
bất kỳ `t3_paths` → T3", bước 4 "phát hiện tier sai → nâng tier") nó phải là
T3 từ thời điểm đó. Đã nâng `risk_tier: T3` và điền `human_override` cho E11
(người duyệt xác nhận đề xuất PASS 3/3 của panel, không để máy tự nâng).

Hai điều KHÔNG vá được ngược, khai nhận ở đây thay vì làm như chưa từng xảy ra:

1. **Gate 1.5 (chốt duyệt plan, chỉ có ở T3) đã không diễn ra.** Plan của đợt
   này đi thẳng vào S3 theo đường T2. Không có cách nào duyệt bù một chốt đã
   trôi qua; bù lại toàn bộ code của đợt đã qua 6 round S4 + review adversarial.
2. **Cổng 2 lần ký đầu (`b195a26`) chỉ điền `human_signoff`, bỏ trống
   `human_override` của E11** — hợp lệ dưới T2 (panel PASS 3/3, không có item
   UNCERTAIN), không hợp lệ dưới T3. Đã điền bổ sung.

**Máy KHÔNG bắt được lớp lỗi này** — `pre-merge-check.sh:765` chỉ nổ khi PR
chạm `t3_paths` mà **không có** thư mục `_acceptance/` nào; một contract khai
T2 nhưng có đủ hồ sơ thì qua cổng sạch. Đây là điểm mù thật, và nó rơi đúng
vào lớp `t3_paths` được lập ra để canh ("bug ở đây biến thành false-green im
lặng trên MỌI repo tiêu thụ") — thêm vào `s4-doc-truth-guard` như một mục
riêng: cổng phải chặn contract khai tier THẤP hơn path nó thật sự chạm.

**Ngoài hợp đồng, từ review round 6 (7 mục):**

- **high** — `scripts/gate-card.js`: renderer chỉ đọc `ooc.findings.length`, KHÔNG đọc `ooc.present`. Writer viết lệch khuôn (`*` thay `-`, sai thụt) → khối Ngoài-hợp-đồng biến mất im lặng, không cờ, exit 0. Sửa theo mẫu guard đã có sẵn cho `gap-probe.md` trong cùng file.
- **medium** — `lib/out-of-contract.js`: ba marker máy-đọc (`## Ngoài hợp đồng`, `## Chưa phân loại`, dòng cờ cụm) chỉ có khuôn item được round-trip bởi P55; cờ cụm và heading chưa có case nối writer↔reader.
- **medium/low** — doc-truth trôi theo chính đợt refactor này: `feature-loop/skills/feature-loop/SKILL.md` (bước Cổng 2 còn trỏ `reportPath`/`findingsPath` đã bỏ; thiếu role `triage` trong bảng `feature_loop.models`), `commands/acceptance-init.md` (còn quảng cáo role `scribe` đã xoá), `GUIDE.md` (còn mô tả agent `scribe` + giá trị trả `reportPath`).

**Trong hợp đồng, medium, CHƯA sửa — người duyệt nhận có ý thức:**

- **AC-4** — `feature-loop/workflows/acceptance-verify.js:539`: nhánh partial-triage bật `triageFailed` và ép `rejectFindings` rỗng đúng, nhưng không hạ `inContract: true` trên từng finding, nên `review-findings.md` vẫn in section "## Trong hợp đồng" cho round mà máy thực tế đã fail-toward-human. Theo AC-3 medium in-contract không kéo REJECT nên PASS hợp lệ; nợ này chuyển sang hợp đồng kế tiếp.

**Ứng viên treo từ các round trước (đã triage, nay chốt cùng nhóm):**

- escape `?` trong `globToRe` ship ở round 2 như tác dụng phụ — chưa có case ghim.
- P53 bỏ 6 dòng header fixture khỏi phép so byte.
- `CLUSTER_RE` không nhận biến thể emoji `⚠️` (U+FE0F).
- Hint sửa lỗi của P53 in ra công thức `{ head -6 f; …; } > f` TỰ HUỶ fixture — đề xuất new-contract.

**Cờ cụm round 6:** 5/8 finding rơi vào file không bộ đo nào phủ
(`feature-loop/skills/feature-loop/SKILL.md`, `commands/acceptance-init.md`,
`GUIDE.md`) — người duyệt chọn MỞ RỘNG bằng hợp đồng kế tiếp, không rút phạm vi.

## Notes

- Verdict enum KHÔNG đổi (PASS / PENDING-JUDGMENT / REJECT / BLOCKED) — vế REJECT mới chỉ thêm nguồn, không thêm giá trị; hooks và pre-merge không cần biết feature này tồn tại (AC-10).
- Case suite workflows dùng tiền tố `WT*`; case plugins dùng tiếp dải `P49`+.
- MỌI assertion âm tính theo bất biến CLAUDE.md #4: đối chứng dương + ghim đúng thông điệp.
- **Sửa hợp đồng ở round 4 (2026-07-27):** AC-14 + AC-15 + trục Coverage "seam writer↔reader" được THÊM sau khi round 3 dừng ở cap-3. Người duyệt cho phép mở round 4 kèm mở rộng hợp đồng bằng lệnh minh danh trong chat ("Đồng ý Mở round 4" — phương án 2 nêu rõ nội dung mở rộng). Lý do mở rộng chứ không vá tiếp: ba round liên tiếp hỏng CÙNG một lớp (round 1 thẻ không có renderer · round 2 thẻ in title kỹ thuật, fixture judge là văn viết tay · round 3 khuôn writer khác khuôn reader nên khối bốc hơi), và không eval nào đỏ ở cả ba — nghĩa là thiếu THƯỚC, không phải thiếu bản vá.
- Feature kèm wiring `tests/workflows/run-tests.sh` vào `executors.test.workflows` + `feature_loop.suite_keys` + gate.yml (suite tồn tại từ Đợt 5 nhưng mồ côi — evals feature này cần nó làm executor).
