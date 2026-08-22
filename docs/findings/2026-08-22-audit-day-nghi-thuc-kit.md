# Audit dây nghi thức kit — 22/08/2026

**Câu hỏi:** từ một ý tới phiên nghiệm thu, chỗ nào của kit 2.3.0 **không có ai đứng tên**, **trỏ vào chỗ chết**, **thu phí thay vì hỏi quyết định**, hoặc **ba bộ đọc nói ba chữ**?
**Kích hoạt:** owner thấy phiên «Điền Ngưỡng cho ô bản đặc tả UX → chờ Cổng Đáng» lủng củng; trước khi mở ô mới, quét cả kit một lần.
**Cách quét:** Zwicky box — trục A = 17 chuyển trạng thái hồ sơ; trục B = 5 câu kiểm (ai đứng tên · con trỏ bước kế sống? · ≥ 2 lối ra hay trạm thu phí · mấy lần gọi người · bộ đọc cùng chữ?). Chân ngành: Stage-Gate (R. Cooper) — mỗi cổng cần *vật nộp · tiêu chí · lối ra · người gác · chủ bước kế*. Bốn máy đọc song song, chỉ đọc; chữ của bộ đọc lấy bằng cách **chạy thật** `start-scan` · `product-map --check` · `pre-merge-check` · `gate-card --extract` trên cây hiện tại và trên **fixture máy sinh** (10 ô cơ hội + 6 hợp đồng ở mọi trạng thái, đặt trong scratchpad). Cây chính lúc quét: `main 8dd77e5b`, sau `origin/main` 2 commit.

---

## 1. Kết luận

Kit có con trỏ sống ở mọi **đích** (không lệnh/skill/script nào được in ra mà không tồn tại), nhưng dây nghi thức **hở ở hai đầu vòng và ở làn máy-đi-trước**:

1. **Cổng Đáng không có lệnh.** Ba cổng kia có `approve` · `signoff` · `uat-session`; Cổng Đáng chỉ có 8 dòng chú thích trong khuôn ô. `/start` bàn giao nó sang `/acceptance-card`, thẻ in ra là **thẻ Cổng Phạm vi rỗng** với nút «Duyệt, cho code». Ngưỡng và chữ ký bị tách thành hai lượt người, hai PR, lượt sau chỉ còn «ừ».
2. **Làn V là đường một chiều không có ô kết.** Hồ sơ máy-đi-trước xanh-sạch đứng ở `verified` mãi; không ai đổi sang `signed-off`; phiên nghiệm thu lại đòi `signed-off`. Hệ quả: **ô cơ hội đã ký `build` mà vòng đi làn V thì không bao giờ tới Cổng Giá trị** — ca sắp đụng là `design-pass-nac-khong-dong-bo`.
3. **Cổng Giá trị không có lối «không đo được»** và không có chủ bước kế cho `iterate`/`kill`; timebox không bộ đọc nào đọc. Vòng kit tự-dùng với ngưỡng `…` treo vĩnh viễn (`duong-do-trong-dinh-nghia-xong`); lối rẻ nhất đang là sửa tay `decision` sau ship, không vết.
4. **Bộ đọc lệch chữ ở 8 ca**, 2 đã biết, 6 mới — nặng nhất: thẻ và `/acceptance-status` vẫn **mời ký** hồ sơ mà lưới, máy quét và feature-loop đã tuyên «không mời ký».
5. **Mặt phẳng làm việc:** chip làm trong worktree rồi merge, không bước nào đưa cây chính về origin, máy quét không đọc ahead/behind → `/start` và bản đồ ở cây chính nói sai; ba thân cổng dặn commit ba kiểu, Cổng Đáng không dặn gì; không luật đợi CI trước khi merge.

Gốc chung: luật «**vào có ô, ra có tên**» mới phủ Vòng HIỂU (chip B). Ở Vòng LÀM và TRAO, **6 chỗ có ô mà không có tên**: Cổng Đáng (không động từ) · làn V (không ô kết) · veto (không động từ) · duyệt kế hoạch T3 (không vết) · Cổng Giá trị (không lối hold, `iterate`/`kill` không chủ bước kế) · timebox (không bộ đọc). Đối chiếu Stage-Gate: **cả bốn cổng đều thiếu «chủ bước kế»**, ba cổng thiếu «người gác có hạn».

---

## 2. Bản đồ chuyển trạng thái — ai đứng tên

| # | Chuyển | Ai đứng tên | Bước trước in «bước kế» | Sống? |
|---|---|---|---|---|
| 1 | ý → ô `discovery` | `/start` lối (a) + `START-HIEU-KET` (`commands/start.md:68-91`) | «điền đủ là chờ Cổng Đáng» | sống |
| 2 | ô → điền Ngưỡng | **KHÔNG AI** — `start.md:65-66` «việc kế là điền section Ngưỡng» (người sửa tay); bước 4 không có lối bàn giao cho «chọn một ý» | «máy tự đưa sang chờ Cổng Đáng ở lần quét sau» | máy: sống · nghi thức: **không đích** |
| 3 | Ngưỡng → ký Cổng Đáng | **KHÔNG AI** — chỉ `opportunity-template.md:82-93`; grep `decided_by` trong `commands/` = 0; không khoá model-invocation, không lưới kiểm | `start.md:125` «chọn một cổng → `/acceptance-card`» | **sai cổng**: `gate-card.js:188-193` chỉ suy Gate 1/2 → thẻ Cổng 1, `will_do: []`, nút «Duyệt, cho code» |
| 4 | decided → S1 | `start-scan.mjs:292` (máy suy `nextStep: S1`) | `/feature-loop <slug>` | nửa sống: bảng resume `feature-loop/SKILL.md:18-25` không có hàng «chỉ có ô»; S0 **không đọc `decision`** → ô chưa ký/`park` vẫn vào S1 |
| 5 | S1 → `draft` | feature-loop `SKILL.md:92-99` | «render thẻ Gate 1 trong cùng lượt» | sống |
| 6 | `draft` → thẻ Cổng Phạm vi | `/acceptance-card` | thẻ kết «duyệt hay sửa: ___»; **không nêu `/approve`** (`acceptance-card.md:104-106`) | nửa sống: không động từ |
| 7a | `draft` → `approved` | `/approve` (`approve.md:102-104`) | `approve.md:128-131` kết ở «Offer ONE commit», **không in S2** | thiếu con trỏ |
| 7b | `draft` → làn V Cổng Phạm vi | **KHÔNG AI nói ghi `status` gì** (`skills/acceptance/SKILL.md:153-158`; `feature-loop/SKILL.md:10`); hook cho cả `approved` lẫn nhảy `draft→implemented` (`lib/evidence-core.cjs:500-507`) | «đi tiếp sang thi công» | để nguyên `draft` → ba bộ đọc xếp «chờ ký» |
| 8 | Gate 1.5 (T3) | **KHÔNG AI** — không trường, không entry, không hook (`feature-loop/SKILL.md:142`; `approve.md:19` từ chối ghi) | «chờ duyệt» — 1 lối ra | không vết |
| 9 | `approved` → S2 → S3 → `implemented` → S4 | feature-loop `SKILL.md:140-163,187-202` | Workflow S4 | sống |
| 10a | `verified` → `signed-off` | `/signoff` (`signoff.md:137-146`) | `signoff.md:158-162` kết «READY TO MERGE», **không in S5** | thiếu con trỏ |
| 10b | `verified` xanh-sạch (làn V) → ? | **KHÔNG AI** — `feature-loop/SKILL.md:24` «đi tiếp S5, KHÔNG mời ký», không đổi status | S5 in «`uat-session <slug>`» | **chết**: `uat-session/SKILL.md:21,39` đòi `status: signed-off` → DỪNG; `start-scan.mjs:206-236` chỉ mở ô `gia-tri` ở nhánh `signed-off` |
| 11 | veto `mo` → `da-veto` | **KHÔNG AI** — người sửa tay frontmatter (`feature-loop/SKILL.md:10`); `approve.md`/`signoff.md` không có chữ veto; ngữ pháp một-lượt-gõ không có ô veto (`human-facing-language.md:260-268`) | lưới `:1195` «quay về draft hoặc duyệt tay» | không động từ; máy quét xếp `da-veto`+PASS vào «Cổng Bằng chứng: đọc rồi ký» (`start-scan.mjs:253-254`) — sai việc |
| 12 | `signed-off` → S5 → PR | `superpowers:finishing-a-development-branch` (`feature-loop/SKILL.md:231`) | menu 3 lựa chọn «Which option?» | sống; trạm thu phí ở repo có branch protection (lối hợp lý duy nhất = PR) |
| 13 | S5 → lái-thử → `uat-session` | **KHÔNG AI khởi động lái-thử** (S5 chỉ in một dòng, `SKILL.md:233`) | «`uat-session <slug>`» | sống khi model tự gọi; dạng tên = chip D |
| 14 | §1–§5 → `verdict` | người ký (`uat-session/SKILL.md:85-90`) | «giao rộng, lặp thêm, hay dừng?» | sống |
| 15 | `verdict: iterate` → vòng mới | **KHÔNG AI** — `SKILL.md:113-114` «giữ giả định, sửa rồi đo lại»; máy quét → `done: uat-iterate` (`start-scan.mjs:111`) vĩnh viễn; resume `signed-off` → S5 lại | không có | **chết** |
| 16 | `verdict: kill` / `stage: archived` | **KHÔNG AI viết `archived`** (chỉ enum `lib/workspace-record.cjs:43`); hai bộ đọc coi `stage ≠ decided` = chưa quyết (`start-scan.mjs:284`, `product-map.mjs:179`) | «đóng có hồ sơ» — không định nghĩa | fixture `archived + kill` → «chờ Cổng Đáng» / «Đang cân nhắc» |
| 17 | timebox quá hạn → `park` | **KHÔNG AI** — grep `timebox` trong engine = 0; ô design-pass tự khai luật riêng (`opportunity.md:35`) | không có | chết |

---

## 3. Findings theo lớp

Nhãn: **MỚI** = chưa có ô/hạt giống · **đã có ô `<slug>`** = không mở lại, chỉ ghi phần thêm.

### Lớp A — Có ô, không có tên (KHÔNG-AI-ĐỨNG-TÊN)

- **A1 · Cổng Đáng không có lệnh.** Không lệnh ghi `decision/decided_by/decided_at/prototype.disposition`, không vẽ lại bản đồ, không răng kiểm «nguồn ngoài chưa phân loại = chưa đủ điều kiện ký» (`opportunity-template.md:76`). Ba ô ký trong một ngày theo ba đường: design-pass ghi tay trong chat (#91) · lenh-in-ra ký trong phiên feature-loop · dac-ta-ux kẹt. Bằng chứng: `opportunity-template.md:82-93`; `pre-merge-check.sh` 0 hit `opportunity`; `GUIDE.md` 0 lần nhắc Cổng Đáng, bảng trạng thái `GUIDE.md:204-211` bắt đầu từ «chưa có contract». **MỚI.**
- **A2 · Ngưỡng tách khỏi chữ ký → trạm thu phí.** `start.md:61-66` «chưa điền ngưỡng = chưa có gì để ký» vs khuôn `opportunity-template.md:87` «ngưỡng chốt CÙNG LÚC ký». Thực tế: gật ngưỡng (1) → PR → merge? (2) → ký (3) + PR nữa; lượt (3) chỉ còn «ừ». Thêm: «khám thêm trước khi ký» không có tên trạng thái (ghi prose `design-pass…/opportunity.md:53-58`); `iterate` ≡ `build` ở mọi bộ đọc (`start-scan.mjs:292`, `product-map.mjs:180`) → lối ra thật là 3, không phải 4. **MỚI.**
- **A3 · Làn V không có ô kết.** `verified` xanh-sạch không bao giờ thành `signed-off`; `uat-session` đòi `signed-off`; máy quét chỉ mở Cổng Giá trị ở nhánh `signed-off`. Resume `/feature-loop <slug>` vào hồ sơ này chạy lại S5 mỗi lần → menu merge/PR hỏi lại. Bằng chứng: `feature-loop/SKILL.md:24,233`; `uat-session/SKILL.md:21,39`; `start-scan.mjs:206-236,253`. Ca sắp đụng: `design-pass-nac-khong-dong-bo` (decided build, T2, nextStep S1). **MỚI** — kề hạt giống «vòng kit tự-dùng không có chặng bàn giao» nhưng là lỗ rộng hơn: mọi repo, không riêng kit tự-host.
- **A4 · Làn V Cổng Phạm vi không nói ghi `status` gì.** Hook cho cả `approved` lẫn nhảy `draft→implemented`; để nguyên `draft` thì ba bộ đọc đều «chờ ký». `skills/acceptance/SKILL.md:153-158`; `lib/evidence-core.cjs:500-507`; `start-scan.mjs:268`; `product-map.mjs:176`. **MỚI.**
- **A5 · Veto không có động từ.** Người phải sửa tay frontmatter — trái luật «máy ghi hộ, người phát ngôn» (`signoff.md:156`); hồ sơ `veto-co-dau-vet` hứa «một chạm» (contract:36) mà không có vật. **MỚI.**
- **A6 · Gate 1.5 không có vết.** Không trường, không entry, không hook; resume không biết plan đã duyệt; máy quét mù (`start-scan.mjs:267`). **MỚI.**
- **A7 · Cổng Giá trị treo vĩnh viễn khi ngưỡng là `…`.** `start-scan.mjs:231-234` xếp `gia-tri` chỉ theo `decision`, không hỏi `thresholdFilled`; `uat-session` §0 đòi ngưỡng → DỪNG. Cùng stub `…`: ở Cổng Đáng là «chưa có gì để ký», ở Cổng Giá trị là «chờ ký». Gốc: khuôn đòi ngưỡng chốt lúc ký nhưng không răng nào canh; `duong-do` ký 21/08 với `…` (`opportunity.md:7-9,21-24`), cờ vàng ở Cổng Phạm vi được trả bằng descope d-4306 — đúng luật, và đúng luật dẫn tới treo. Lối rẻ nhất đang là sửa `decision: park` sau ship **không vết** (fixture → `done: signed-off`, bản đồ «Đã giao»; không đòi entry sổ, không `[SUPERSEDED]`). **MỚI** — nhắc ở 3 chỗ (`docs/plans/2026-08-21-hat-giong-duong-do…:59`, `release-2-3-0/contract.md:55`, chip D plan :87 «hồ sơ riêng»), chưa có ô.
- **A8 · `iterate` / `kill` không có chủ bước kế; `archived` không ai viết, đọc sai.** Bảng §2 #15–16. **MỚI.**
- **A9 · Timebox không bộ đọc nào đọc.** Bảng §2 #17. **MỚI.**
- **A10 · Cổng Phạm vi không có lối «không làm»; «Trả lại» Cổng Bằng chứng không vết.** `approve.md:132` «Not now → contract stays draft» treo không hạn, không park/kill; `signoff.md:118-119` trả lại không đổi status, không entry → resume trình Gate 2 y nguyên. **MỚI** (luật «ra có tên» mới phủ Vòng HIỂU).
- **A11 · Re-pin không có lối vào có tên.** `feature-loop/SKILL.md:31` «dispatch 1 agent tươi»; GUIDE §7.1 là chính sách, không lệnh. Đã có nếp trong memory, chưa có ô.
- **A12 · Không ai khởi động lái-thử người-lạ.** S5 in một dòng; đề bài nói «phiên cũ / người điều phối làm» (`docs/plans/2026-08-13-de-bai-lai-thu-nguoi-la.md:151`). **MỚI** (nhẹ).

### Lớp B — Con trỏ chết / sai đích

- **B1 · `/start` cổng `dang` → `/acceptance-card` → thẻ Cổng Phạm vi rỗng** với nút «Duyệt, cho code» và cờ vàng về contract chưa tồn tại; không lối park/kill. `start.md:125`; `gate-card.js:188-193`; `acceptance-card.md:25-26,104-105`. Render thật trên `design-pass-nac-khong-dong-bo` và `dac-ta-ux-vat-hoa-cau-truc`. **MỚI** (chip D là *dạng* tên, không phải *sai cổng*).
- **B2 · Ba thân cổng không in bước kế.** `approve.md` kết ở commit; `signoff.md` kết ở re-check; `acceptance-card.md` không nêu `/approve`/`/signoff`. Đường `/start → chọn cổng → thẻ` dừng ở thẻ, người tự biết động từ. **MỚI** (VẮNG con trỏ, khác chip D).
- **B3 · feature-loop S0 không đọc `decision`.** Ô chưa ký / `park` vẫn vào S1 nếu gọi `/feature-loop <slug>`; lưới trước-merge bỏ qua thư mục không contract, không bao giờ đọc ô. `feature-loop/SKILL.md:18-27,83`; `pre-merge-check.sh:638-643`. **MỚI.**
- **B4 · «Mở worktree/phiên riêng TRƯỚC» không trỏ nghi thức nào.** `start.md:128-129`; `GUIDE.md:497`; `superpowers:using-git-worktrees` tồn tại nhưng không được gọi tên; feature-loop không mở worktree cho vòng. **MỚI.**
- **B5 · Khuôn ô trỏ «red-team D2», «D2.5», «D1b», «funnel Cổng 0»** — không tồn tại ngoài chính khuôn (`opportunity-template.md:1,6,41-42`). Nhắc ở findings 21/08 («chiều đỏ Cổng Đáng chưa có hạt giống»; `o-nuot-luat` cấm đụng D2). Chưa có ô.
- **B6 · `uat-session <slug>` dạng tên** — **đã có ô `lenh-in-ra-phai-bam-duoc`.**
- **B7 · `uat-session` §6 «append kết quả đo vào opportunity.md»** không có section đích trong khuôn; spec hứa reminder đo-sau-ship + retro mà retro đã TRỪ (`workflow-v2-spec.md:272-274`). Nhẹ.

### Lớp C — Bộ đọc lệch chữ (cùng sự thật, hai chữ)

| # | Trạng thái | Bộ đọc nói gì | Ô? |
|---|---|---|---|
| C1 | ô đã điền ngưỡng, chưa ký | `/start`: «Chờ chữ ký — Cổng Đáng» · bản đồ: «Đang cân nhắc cơ hội» (không có ô chờ-Cổng-Đáng trong `product-map.mjs:35-47`) | đã biết (memory, chip D mục 4) — **chưa có ô** |
| C2 | `verified` xanh-sạch (`release-2-0-0`, `release-2-1-0`) | lưới + máy quét + feature-loop: «máy đi tiếp, KHÔNG mời ký» · **thẻ `gate-card.js:287-291`: «Cổng 2 · ký duyệt — máy đã xong — ký nhanh» + nút Ký** (0 tham chiếu veto/xanh-sạch) · **`acceptance-status.md:33`: «Chờ người ký»** · `/signoff` không slug quét nó làm ứng viên (`signoff.md:14-18`) · bản đồ: «Đang làm» | bản đồ = known-limit `lan-v-khong-phai-cho-ky`; **ba bộ đọc còn lại: MỚI** |
| C3 | «cửa veto mở» | lưới đếm mọi contract `veto_state: mo` = **14** (`pre-merge-check.sh:1184-1224`) · `/start` chỉ đếm nhánh `verified` = **2** (`start-scan.mjs:253`; nhánh `signed-off` không đọc `veto_state`) — `start.md:111-121` hứa «cùng câu lưới hỏi» | **MỚI** |
| C4 | cổng `gia-tri` chưa có `uat-session.md` | `since: ""` (lấy `decided_at` của file chưa tồn tại, `start-scan.mjs:232-234`) → sort chuỗi rỗng lên đầu → Cổng Giá trị **luôn đứng đầu thẻ** bất kể tuổi, trái «cổng chờ lâu nhất lên đầu» (`start.md:49`) | **MỚI** |
| C5 | `decided` + `decision` rỗng; `archived` | máy quét: «chờ Cổng Đáng» · bản đồ: «Đang cân nhắc» | **MỚI** |
| C6 | status lạ trong contract | máy quét/bản đồ: «hồ sơ hỏng — status không nhận diện được» · lưới: «chưa arm cổng — status=X» hoặc **im** khi không có evidence (`pre-merge-check.sh:681-696`) | **MỚI** |
| C7 | ngưỡng `…` | Cổng Đáng: «chưa có gì để ký» · Cổng Giá trị: «chờ ký» | = A7 |
| C8 | `implemented` | `acceptance-status.md:32` trỏ «Phase 3 của skill acceptance» · feature-loop trỏ Workflow S4; `:31` «Chờ code» gộp S2/S3; thiếu dòng `signed-off`; GUIDE §3 mermaid «Cổng 2 luôn ký» tự khai lỗi thời (`GUIDE.md:177,191`); `docs/specs/2026-08-03-start-command-design.md:97-101` tự xưng nguồn sự thật mà hàng «stage ≠ decided → chờ Cổng Đáng» đã lỗi thời, `start-scan.mjs:3` vẫn trỏ vào | GUIDE đã nêu; còn lại **MỚI, nhẹ** |

### Lớp D — Mặt phẳng làm việc

- **D1 · Cây chính lệch origin, không ai đưa về.** Sau chip merge trong worktree, cây chính sau origin 2 commit; `/start` và bản đồ cục bộ nói sai ô của `dac-ta-ux…` mà `--check` vẫn xanh (so cục bộ với cục bộ). `start-scan.mjs:70-78` chỉ đọc `branch`+`dirty`; `START-SCAN-KEYS` không có ahead/behind. Repo: required checks `strict: false` → nhánh lùi 9 commit (worktree chip D) vẫn merge được — chính là đường sinh ra lệch. **MỚI.**
- **D2 · Ký cổng không dặn nhánh; ba thân dặn ba kiểu.** `approve.md:128-131` commit; `signoff.md:137-150` commit + pre-merge; `uat-session/SKILL.md:94-115` vẽ bản đồ **không commit**; Cổng Đáng không có thân. Branch protection chặn push thẳng main — kit không nói. **MỚI** (liên quan `ban-do-dinh-chu-ky`).
- **D3 · Không luật đợi CI rồi merge; repo không cho auto-merge.** Phiên hỏi «merge?» trước CI xong → bounce → thử `--auto` (không được) → đợi → merge lại. `finishing-a-development-branch` bày menu 3 lựa chọn ở repo mà lối hợp lý duy nhất là PR. **MỚI** (nhẹ; nếp đã ghi ở findings 21/08 §7).
- **D4 · `required_approving_review_count: 0`** trong khi ADR 0012:20 đặt điều kiện «repo nhiều người phải bật». Ghi để biết; repo một người — Never.

---

## 4. Đối chiếu Stage-Gate (Cooper) — bốn cổng × năm thành phần

| Cổng | Vật nộp | Tiêu chí | Lối ra | Người gác | Chủ bước kế |
|---|---|---|---|---|---|
| **Đáng** | 6 section khuôn; chỉ ngưỡng được máy kiểm «đủ» | **không** — «Căn cứ: …» tự do; chiều đỏ chưa có | enum 4 nhưng `iterate`≡`build`, «khám thêm» (Hold) không tên → 3 | chỉ field `decided_by`; không lệnh, không khoá, không lưới | **không** — `nextStep: S1` do máy suy; không bàn giao |
| **Phạm vi** | đủ (design · contract · evals · gap-probe · thẻ) | advisory (cờ thẻ, lint W1/W3/W4); 6 điều kiện chặn-chờ | duyệt / sửa; **thiếu «không làm»** (draft treo); làn V 1 lối + veto không động từ | `approved_by`; làn V: trạng thái không ghi tên | S2 — `approve.md` không in |
| **Bằng chứng** | đủ nhất kit | đủ nhất kit (hook L1–L3 + 6 điều kiện + lưới) | Ký / Trả lại (+3 ngả ngoài hợp đồng); **Trả lại không vết**; làn V không ô kết | `human_signoff`; làn V: cửa veto không động từ | S5 — `signoff.md` không in; làn V trỏ vào điều kiện không thoả |
| **Giá trị** | bảng số đo cạnh ngưỡng | ngưỡng khai trước, cấm sửa — nhưng không răng «ký Cổng Đáng phải có ngưỡng» | release / iterate / kill; **thiếu hold / không-đo-được**; `iterate`/`kill` không chủ bước kế | `decided_by` ghi sau; **không ai triệu tập, không hạn** (timebox không reader) | release → nghi thức repo (ngoài kit); iterate → ?; kill → «đóng» không định nghĩa |

---

## 5. Số lần gọi người theo đúng lời kit (không theo cách các phiên đã làm)

| Đoạn | Tối thiểu | Ghi chú |
|---|---|---|
| ý → vào S1 | **4** (khai thác · tự điền ngưỡng · tự ký tay · `/start` chọn vòng dở) | gộp ngưỡng+ký như khuôn nói → 3, nhưng khi đó máy quét không bao giờ thấy «chờ Cổng Đáng». PR: lời kit 0, dưới branch protection tối thiểu 1, quan sát **3** cho `dac-ta-ux` |
| S1 → signed-off, T2, không UI, làn V hai cổng | **2** (brainstorm ≥ 1 · chọn merge/PR 1) | và vòng **không tới** `signed-off` (A3). Người ở hai cổng: 4. Repo lần đầu +1 (suite_keys). Chạm UI: + số vòng design-pass |
| signed-off → đóng, đường A | **≥ 7** (menu finishing · bấm merge · khởi động lái-thử · mở uat · N người chấm · ký verdict · phát hành) | 2 là khoảnh khắc quyết thật (merge, verdict); sau `iterate`/`kill` không đếm được |
| đường B/C/E | 2 | vòng đóng ngầm |
| kit tự-host, ngưỡng `…` | 2 rồi **∞** | hoặc 1 lần sửa tay không vết |

---

## 6. Cắt — Core · Later · Never

Tổng ~35 ô có nghĩa. Core = 5 (≈14 %).

### Core — một lớp, ba chỗ hở + một bảng chung

1. **Làn V có ô kết + Cổng Giá trị nhận nó** (A3, A4) — hố đang sống, ca kế (`design-pass`) sẽ rơi vào. Một seam: trạng thái kết có tên cho hồ sơ máy-đi-trước + `uat-session` §0 và `start-scan` đọc nó.
2. **Cổng Đáng một lượt, một PR** (A1, A2, B1) — máy đề xuất ngưỡng + thẻ Cổng Đáng + ký trong cùng lượt; `/start` hết trỏ sang thẻ sai cổng; thân cổng dặn nhánh + vẽ lại bản đồ như `signoff`.
3. **Cổng Giá trị có lối «không đo được» + chủ bước kế cho `iterate`/`kill` + bộ đọc timebox** (A7, A8, A9) — bịt lỗ `duong-do` bằng lối ra có tên, không bằng sửa tay.
4. **Một bảng trạng-thái→chữ dùng chung cho mọi bộ đọc** (C1–C6) — `start.md` đã nói «nhãn rút từ bảng nhãn chung trong lib, CÙNG chữ với cổng CI»; mở rộng bảng đó cho thẻ, `acceptance-status`, bản đồ; test round-trip một fixture chạy qua cả bốn bộ đọc phải ra cùng chữ.
5. **Máy quét đọc ahead/behind + cảnh báo một dòng** (D1) — rẻ, chặn «bộ đọc ở cây chính nói sai» ngay.

### Later (mỗi mục một dòng)

- Veto có động từ (A5) — đi cùng Core 1 khi đụng làn V, hoặc ô riêng.
- Gate 1.5 có vết (A6) — chỉ T3; chưa có vòng T3 nào chạy.
- Cổng Phạm vi lối «không làm» + Trả lại có vết (A10).
- Re-pin lối vào có tên (A11) — chờ chiến dịch release kế.
- `approve`/`signoff`/thẻ in bước kế (B2) và «phiên riêng» có đích (B4) — ứng viên gộp vào chip D kế (cùng họ «điểm bàn giao»).
- Khuôn ô bỏ con trỏ D2/D2.5/D1b/funnel hoặc cho chúng một vật (B5) — chờ hạt giống chiều đỏ Cổng Đáng.
- feature-loop S0 đọc `decision` (B3) — một câu trong SKILL; ghép Core 2.
- `acceptance-status` chữ (C8), GUIDE §3 mermaid, spec start-command lỗi thời — dọn docs khi đụng.
- Ba thân cổng dặn nhánh thống nhất (D2); luật «đợi CI rồi hỏi merge» (D3) — một câu mỗi nơi.
- Lái-thử người-lạ có người khởi động (A12) — chờ ván lái-thử kế.

### Never (lý do một dòng)

- Lưới trước-merge mù Vòng TRAO — cố ý theo spec «thất bại chảy một chiều» (findings 21/08 §34-36).
- Bản đồ dùng vị từ «xanh-sạch» — đã quyết bản đồ KHÔNG dùng vị từ (`start-scan.mjs:16-18`, known-limit `lan-v-khong-phai-cho-ky`); chữa bằng Core 4, không bằng vị từ.
- `required_approving_review_count` — repo một người; ADR 0012 đã nói điều kiện bật.
- Retro sau Cổng Giá trị — đã TRỪ (L3) có chủ đích.

### Cross-cutting áp mọi ô Core

- Mỗi chuyển trạng thái mới phải trả lời đủ 5 thành phần Stage-Gate trước khi vào S1; thiếu «chủ bước kế» = chưa xong.
- Mọi chữ mới cho người vào **một** bảng trong lib; bốn bộ đọc đọc từ đó; test round-trip.
- Fixture máy sinh ở mọi trạng thái (10 ô + 6 contract của đợt này) giữ lại làm bộ đối chứng dương cho Core 4.

---

## 7. Đề xuất ban đầu (22/08) — đã thay bằng §9

Mở một ô cho cả lớp «Ra có tên ở Vòng LÀM và TRAO» (Core 1–3), Core 4–5 làm đường đo của ô.

---

## 8. Bổ sung 23/08 — ba ý của owner, đối chiếu với audit

Owner nêu ba điều sau các phiên gần đây. Cả ba chạm **cùng một bề mặt**: thẻ `/start` — thứ owner nhìn đầu mỗi phiên. Audit §3 lớp C/D đã soi bề mặt này từ phía máy; ba ý này soi nó từ phía người.

### 8.1 «Đang cân nhắc» chỉ hiện 3, không ưu tiên

- **Sự thật:** `commands/start.md:63-66` in một dòng gộp + tối đa 3 tên cũ nhất — là lựa chọn của hạt giống chip B (`docs/plans/2026-08-21-hat-giong-vao-co-o-ra-co-ten.md:109-110`), ghim bằng AC-6; **không có luật độ dài thẻ nào ép** (grep `human-facing-language.md` = 0). Máy quét chỉ có `since`/`ageDays` (`start-scan.mjs:286-290`); ô cơ hội không có trường ưu tiên/trọng số (grep template/lib = 0). Tuổi đang **giả**: 6/8 ý cùng `since: 2026-08-21T18:24:01Z` vì cùng một commit đổ stub (chip D đã ghi «tuổi ý = tuổi ô»).
- **Đối chiếu North Star:** đây là bàn cược (betting table — Shape Up; «Hold/Go» ở Stage-Gate) của owner, mà kit không có bề mặt nào xếp ý cạnh ý. Cắt còn 3 theo tuổi giả là **giấu backlog sau một số đếm** — owner phải mở bản đồ hay thư mục để tự xếp → người về giữa vòng. Owner nói đúng luật kit: máy chỉ được **đề xuất** ưu tiên khi có thước khai trước; chưa có thước thì **hiện hết**, không tự cắt.
- **Kết luận:** TRỪ giới hạn 3 (rẻ, AC-6 đổi một con số). Xếp hạng máy = **Later**, chỉ khi có thước khai trước trong ô (một dòng, không phải trọng số bịa). Tín hiệu máy được phép in cạnh mỗi ý mà không bịa: tuổi thật từ git của file ô · có con trỏ từ ô đã ký (design-pass → dac-ta-ux) · timebox đã khai. Gắn với audit **A2** (không lối bàn giao cho «chọn một ý»).

### 8.2 «Đã làm» nên hiện việc vừa làm, không để trống

- **Sự thật:** `groups.done[]` chỉ có `slug, state` (`start-scan.mjs:230-293`; spec `:132`); thẻ in «đã xong/đã xếp lại: 56 việc, trong đó 2 máy đi tiếp không ký, 2 còn cửa veto mở» (`start.md:110-121`). Ngày có sẵn: `human_signoff: <tên> <ngày>` trong contract (đa số) · `decided_at` trong `uat-session.md`/`opportunity.md` · fallback `git log -1 --format=%cs` trên file hồ sơ. Thử suy «vừa làm» từ git ngay trên cây này: `release-2-3-0 · repo-khai-plugin · vao-co-o-ra-co-ten` (22/08), `lan-v-khong-phai-cho-ky` (21/08) — đúng.
- **Đối chiếu North Star:** nặng hơn ý owner nêu. Làn V là **veto-default**: máy đi trước, người veto lúc nào cũng được — nhưng veto đòi **thấy**. Dòng «2 còn cửa veto mở» **không nêu tên** → owner không veto được thứ mình không thấy; cộng audit **C3** (lưới đếm 14, `/start` đếm 2) → số còn sai. Một thẻ không nêu tên việc máy vừa làm là thẻ không đóng được vòng «máy làm và tự chứng minh».
- **Kết luận:** `done[]` thêm `at` (ngày, suy từ chữ ký → `decided_at` → git) — một khoá trong `START-SCAN-KEYS`, round-trip test như luật; thẻ in **N việc vừa xong gần nhất** (mỗi việc một dòng: ngày · trạng thái · tên) và **nêu tên mọi hồ sơ còn cửa veto mở** (đếm từ cùng vị từ với lưới). Đây là CỘNG một khoá có đường đo, TRỪ một con số gộp.

### 8.3 Không gọi skill brainstorm (product-management) ở bước còn mờ

- **Sự thật:** hiện `_acceptance/config.yaml` của kit **chưa cắm** `discovery.brainstorm_skill` → lối (a) của `/start` đang dùng khuôn kit (`start.md:80-91`). Nhưng hạt giống chip B **§9.1 lên kế hoạch cắm** `product-management:brainstorm` vào Vòng HIỂU (`docs/plans/2026-08-21-hat-giong-vao-co-o-ra-co-ten.md:210-222`; spec D1a `docs/specs/2026-07-27-discovery-gate0-design.md:65,73`; memory «cắm brainstorm vào Vòng HIỂU»).
- **Đối chiếu North Star:** skill đó là **hội thoại «thinking partner»** — nhiều lượt hỏi mở, owner ngồi giữa vòng trả lời. Đúng thứ luật kit gọi là «hỏi mở là đường cùng». Hai phiên 22/08 cho thấy cách đúng: máy tự phân kỳ (quét 12 nguồn, đối chiếu 8 bước UX, vẽ hình), rồi trình **một** câu đóng («tách hay gộp?») — owner quyết trong một chạm. Bước mờ là bước **máy gánh suy nghĩ**, không phải bước kéo người vào đối thoại. Mặt khác: cắm skill bên thứ ba làm mặc định cũng trái F-K (đích không tồn tại ở repo khác).
- **Kết luận:** TRỪ §9.1 khỏi kế hoạch; ổ cắm giữ nguyên (trung tính, repo tự khai nếu muốn) nhưng **mặc định của kit là máy phân kỳ theo khuôn** (morphological-scan / nghiên cứu / hình) rồi một câu đóng. Viết một câu phủ định vào lối (a) cạnh câu đã có về `superpowers:brainstorming`: *«không cắm skill hội thoại mở vào bước này — máy phân kỳ, người quyết một chạm»*.

### 8.4 Ba ý gộp với audit = một lớp

Ba ý + lớp C/D của audit đều nói: **`/start` đang là bộ định tuyến, chưa phải bảng điều khiển của owner.** Nó giấu backlog (8.1), giấu việc máy vừa làm và thứ có thể veto (8.2, C3), nói khác lưới (C2–C6), nói sai khi cây lệch (D1), và sắp kéo owner vào hội thoại ở bước mờ (8.3). Mỗi thứ sửa riêng đều rẻ; gộp lại mới thành một thẻ đọc một phút mà quyết được.

---

## 9. Đề xuất lại — hai ô, theo thứ tự

| | Ô | Gồm | Tính chất | Vì sao thứ tự này |
|---|---|---|---|---|
| **1** | **`/start` là bảng điều khiển của owner** | 8.1 hiện hết ý (TRỪ giới hạn 3) · 8.2 `done[].at` + N việc vừa xong + nêu tên cửa veto mở · C2–C6 một bảng trạng-thái→chữ chung cho bốn bộ đọc (thẻ, `acceptance-status`, bản đồ, lưới) · D1 máy quét đọc ahead/behind · 8.3 TRỪ §9.1 + một câu phủ định ở lối (a) · B2 ba thân cổng in bước kế | T2, phần lớn TRỪ hoặc một bộ đọc; không chạm trạng thái hồ sơ | Rẻ, chạm mặt owner mỗi phiên, và là **đường đo** của ô 2 (không có thẻ nói đúng thì không thấy ô 2 có sửa được gì) |
| **2** | **Ra có tên ở Vòng LÀM và TRAO** | Core 1 làn V có ô kết + `uat-session`/máy quét nhận nó · Core 2 Cổng Đáng một lượt một PR (máy đề xuất ngưỡng + thẻ + ký; `/start` hết trỏ thẻ sai cổng; thân cổng dặn nhánh + vẽ bản đồ) · Core 3 Cổng Giá trị lối «không đo được» + chủ bước kế `iterate`/`kill` + bộ đọc timebox | T2–T3, chạm trạng thái hồ sơ và ba bộ đọc | Hố cấu trúc, ca kế (design-pass) rơi vào ở cuối vòng — có thời gian hơn ô 1, nhưng phải mở trước khi design-pass tới S4 |

Hai ô không trùng ba ô «đang cân nhắc» hiện có; B2/B4 không gộp vào chip D (đang ở Cổng Bằng chứng, PR #93). Later/Never §6 giữ nguyên. Hồ sơ này làm `discovery/` của cả hai ô.

*Bốn máy đọc · 154 lượt tool · fixture trong scratchpad, repo không đổi. Bổ sung 23/08: ba ý owner, kiểm bằng `start-scan`, git log, hạt giống chip B.*
