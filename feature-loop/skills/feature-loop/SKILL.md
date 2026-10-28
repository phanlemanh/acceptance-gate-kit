---
name: feature-loop
description: Vòng lặp chuẩn phát triển 1 tính năng từ ý tưởng đến PR — hợp nhất Superpowers (brainstorm/plan/execute) + acceptance-gate (contract/evals/evidence/signoff) + Workflow orchestration. 2 điểm dừng human (Gate 1 duyệt design+contract+evals, Gate 2 duyệt evidence+signoff); T3 thêm Gate 1.5 duyệt plan. Use khi user nói "làm tính năng X", "/feature-loop:feature-loop <mô tả>", hoặc "/feature-loop:feature-loop <slug>" để resume. KHÔNG dùng cho hotfix T1 (docs/config nhỏ) — thoát ngay ở S0. YÊU CẦU: plugin acceptance-gate (cùng marketplace) + plugin superpowers đã cài; repo đích đã chạy acceptance-init (_acceptance/config.yaml); vòng chạy trong phiên cấp cao nhất có công cụ Workflow — tác tử con không có Workflow, đừng chạy vòng trong tác tử con.
---

# feature-loop

Nhạc trưởng điều phối — KHÔNG tự code thay các skill con, chỉ gọi đúng thứ tự và giữ 2 gate.

**Bất biến dừng (đợt 2 «người về biên» — thu hẹp):** hai cổng T2 nay có đường ĐI TIẾP, nên chỉ dừng chờ người ở: **Gate 1.5 (T3)** · **Gate 1 khi T2 KHÔNG đủ điều kiện đi tiếp ở trạng thái V** (gap-probe còn P0 · danh từ mờ/đề bài mơ hồ · coverage cluster chưa gạch · sổ bước thiết kế còn câu chỉ-người-biết hoặc dòng đỏ · hạng T3) · **Gate 2 khi bằng chứng KHÔNG xanh-sạch** (thiếu một trong sáu: verdict PASS · 0 UNCERTAIN · không bypass · Known limits hiện-diện-và-rỗng · Ngoài hợp đồng hiện-diện-và-rỗng · hạng T2) **hoặc việc chạm KHÓ-ĐẢO** (ship ra người dùng thật · xoá dữ liệu · cam kết ra ngoài repo — khó-đảo LUÔN thắng xanh-sạch). T2 xanh-sạch: commit phần máy viết, báo ĐÚNG MỘT DÒNG (đã qua · cửa veto vẫn mở · việc kế), đi tiếp — không câu hỏi. T2 chốt phạm vi: ghi `veto_state: mo` + `veto_opened_at`, để `approved_by` RỖNG, đi tiếp; người veto thì đổi `da-veto` + entry sổ quyết định và máy DỪNG NGAY, không tranh luận lại, không bày menu. Ngoài các mốc trên là các DỪNG-lỗi được liệt kê tường minh trong skill này (preflight thiếu, BLOCKED, hết 3 round, escalate). MỌI ranh giới stage khác: đi tiếp NGAY trong cùng lượt, không hỏi "tiếp chứ?" / "lập plan nhé?" / "chạy S4 nhé?" — mỗi lượt hỏi tự chèn là một lần can thiệp người ngoài thiết kế, phá đúng KPI mà kit tồn tại để giảm. **Tiến trình nền (agent, Workflow) báo xong giữa một đoạn máy → đi tiếp trong CÙNG lượt**; «báo cáo rồi ngừng nói» là một lần dừng ngoài thiết kế, đếm vào ba dòng số (đo 02/09: 2 lần ở S3 của một vòng T3). (Đo 2026-07-26: 7/14 lần dừng của một phiên là agent tự chèn — xem docs/findings/2026-07-26-feature-loop-khong-tu-loop.md.)

> 2 workflow script đi kèm nằm trong plugin. Đường dẫn: lấy "Base directory for this skill" khi skill này được nạp → `WORKFLOWS_DIR = <base-dir>/../../workflows/` (layout cache: `.../<plugin>/<version>/skills/feature-loop/` → `../../` = thư mục version chứa `workflows/`). TRƯỚC KHI invoke lần đầu: `ls "$WORKFLOWS_DIR"` phải thấy `acceptance-verify.js` + `execute-parallel.js` — không thấy → `node <base-dir>/../../scripts/resolve-plugin.mjs --plugin feature-loop --require workflows/acceptance-verify.js` rồi dùng `<kết quả>/workflows/`. KHÔNG glob cache bằng `ls`: `ls` sắp theo chữ nên "bản mới nhất" chọn 1.9.2 thay vì 1.20.1. LUÔN invoke Workflow bằng `scriptPath` (abs path), KHÔNG bằng `name` — registry theo tên có thể cache bản script cũ. Script tự parse args nếu harness truyền JSON string.

<!-- <<<TRONG-DOT -->
**Trong đợt (Điều phối – Thợ, gói `dieu-phoi`).** Ở S0 — cả khi resume — chạy
`node "$WORKFLOWS_DIR/../scripts/trong-dot.mjs" --root .` (chỉ đọc). Không in gì → phiên không trong đợt: bỏ
qua TRỌN khối này, vòng y như các mục dưới. In một dòng `trong-dot: …` → nói lại đúng dòng đó, bỏ qua khối. In
JSON `{"trong_dot":true,…}` → phiên là thợ của dãy `day`; năm luật dưới thắng luật cùng chỗ ở các mục sau, chỉ
trong vòng này. Mọi lần ghi vào thư mục đợt (xin lượt, nhả lượt, gửi yêu cầu) làm đúng mục «Cách xin tài
nguyên» của tệp `luat` trong JSON — khối này không chép cách ghi; đọc `luat` trước S1.
- **S0, hàng chưa có ô** (khối S0-MO-O in `moi: true`): không trình thẻ Cổng Đáng ở phiên thợ — gửi yêu cầu
  `hang-moi` (slug + câu giao) cho giám sát rồi chờ trả lời bằng lệnh nền. Cổng Đáng của hàng phát sinh gom về
  giám sát. Yêu cầu này KHAI CHẶN — phiên đứng chờ nó; không khai thì kho có cửa tín hiệu trả «đã ghi» và thợ kẹt:
  <!-- <<<TRONG-DOT-HANG-MOI -->
  `node <thư mục đợt>/loi/dieu-phoi.mjs yeu-cau hang-moi --chan --hang <slug> --noi-dung '{"cau_giao":"<câu giao>"}'`
  <!-- TRONG-DOT-HANG-MOI>>> -->
- **S1:** không mở hỏi đáp brainstorm — trả lời từ ô của hàng (hoặc ô dù nó trỏ), câu giao của hàng lộ trình và
  `luat`; mỗi câu xin duyệt thiết kế thành một dòng sổ `approach` (Cổng Phạm vi vẫn theo luật làn V); không in
  khối GOAL-TEMPLATE. Câu chỉ người biết → gửi yêu cầu `can-nguoi` (câu hỏi + khuyến nghị) TRƯỚC khi hỏi bằng
  chữ, để bảng đợt thấy và đếm.
- **S4, ghim lại, đường nền:** xin lượt (`s4`, `ghim-lai`, `duong-nen`) rồi chờ bằng lệnh nền tới khi khoá ghi
  tên dãy; chạy; nhả khi verdict đã ghi. Lời chặn `chan-s4` là CHỜ LƯỢT: không phải BLOCKED, không hỏi người,
  không tung lượt mới, không đếm round.
- **S5:** `tu_merge: true` → sau khi PR mở, xin lượt `merge`, chạy `node <thư mục đợt>/loi/dieu-phoi.mjs gop <số PR>`,
  nhả. Thoát 0 = đã gộp (CI xanh trên đúng đầu nhánh, và nhánh đã chứa đỉnh nhánh chính hoặc — kho bật
  `gop_khong_chay_lai_ci` — không tệp nào trùng commit vào nhánh chính từ base của CI); thoát 4 = gộp nhánh chính vào
  nhánh hoặc chờ CI theo lệ của kho rồi chạy lại; thoát 1 = chặn, báo giám sát. `false` hoặc `null` → chỉ mở PR; bấm
  merge là của người (`gop <số PR> --xet` in quyết định cho người). Rồi chạy lại lệnh nhận biết kèm `--slug <slug vừa xong>` và làm đúng
  `viec_ke`:
  - `mo-hang` → gọi `/feature-loop:feature-loop <hang_ke.slug>` ngay trong phiên này.
  - `cho-nhip` → chờ một nhịp (lệnh nền khoảng 30 giây) rồi đọc lại; ba lần vẫn vậy → báo giám sát một dòng.
  - `bao-giam-sat` → gửi yêu cầu `khac` cho giám sát nêu `ly_do`, dừng.
  - `cho` → một dòng «dãy <day> chờ: <ly_do>», dừng.
  - `xong` → một dòng «dãy <day> hết hàng», dừng.
- Khối không đổi bảng cổng: khó-đảo vẫn là câu hỏi cho người; chữ quyết vẫn chỉ của người.
<!-- TRONG-DOT>>> -->

## State machine & resume

Nguồn sự thật duy nhất: frontmatter `status` trong `_acceptance/<slug>/contract.md`.

| status hiện tại | Vào stage |
|---|---|
| (chưa có workspace/contract) | S0 → S1 |
| `draft` | Gate 1 (trình lại gói duyệt; CT-S: THIẾU `gap-probe.md` ∧ ledger không có entry `descope` decision bắt đầu `"bỏ gap-probe"` → cờ vàng trên thẻ + hỏi user 1 câu có chạy bổ sung S1#7 không — KHÔNG tự chạy, KHÔNG chặn; workspace cũ trước 1.14.0 đi đường này) |
| `approved` | S2 PLAN; plan của slug đã tồn tại → S3 tiếp tục task chưa xong (T3: plan chưa duyệt → Gate 1.5 trước) |
| `implemented` | S4 VERIFY |
| `verified` | (trước đó: khối DINH-TUYEN-MAY) Xanh-sạch đủ SÁU điều kiện ∧ không chạm KHÓ-ĐẢO → chạy `node <acceptance-gate>/scripts/khong-can-nguoi.mjs --write --root . --slug <slug>` (exit 2 = còn cần người → Gate 2), vẽ lại bản đồ, commit phần máy viết (contract nay `machine-cleared`), báo một dòng, đi tiếp S5 (KHÔNG mời ký). Thiếu một điều kiện, hoặc chạm khó-đảo → Gate 2 (trình gói evidence) |
| `machine-cleared` | S5 SHIP — máy đã thông, không có chữ ký người; cửa veto theo `veto_state`. Người ký sau vẫn được: `/acceptance-gate:signoff` đổi sang `signed-off` cùng lượt ghi chữ ký. Đường ghi: bước ở hàng `verified` (duong-lui-phai-song) |
| `signed-off` | S5 SHIP |

Resume: `/feature-loop:feature-loop <slug>` → đọc status, vào đúng hàng trong bảng. Luôn nói rõ cho user đang ở stage nào trước khi làm. Có `decisions.jsonl` → đọc (parse từng dòng, dòng hỏng bỏ qua + báo số lượng), tóm tắt "đã chốt: <id — decision>" cho user và KHÔNG lật lại các quyết định đó trừ khi đi nghi thức `supersedes` + human phê ở gate kế; file vắng → bỏ qua, không nhắc gì.

**Staleness guard (mọi feature, chạy TRƯỚC khi trình Gate 2):** khi resume vào `verified`, đọc `verified_commit` trong frontmatter `evidence-report.md`. Có field → chạy `git diff --name-only <verified_commit>`: nếu có file đổi NGOÀI `_acceptance/` và không khớp `risk_tiers.t1_skip_globs` → evidence STALE (code đổi sau verify): báo user, hạ contract `status: implemented`, vào S4 round mới — KHÔNG trình Gate 2 trên evidence cũ. **Round staleness này là ROUND DELTA (Đợt 5):** khi report cũ verdict PASS-family, GIỮ lại `deltaFiles` (danh sách file đổi, loại `_acceptance/**`) + `verified_commit` cũ làm anchor cho carry-forward P1 ở bước chuẩn-bị-args S4; round fix sau REJECT không có anchor → full re-run như cũ. Không có field (report từ template cũ) → cảnh báo "evidence chưa pin commit, khuyên re-verify", không tự hạ. (CI `pre-merge-check.sh` chặn độc lập cùng luật — guard này bắt sớm để đỡ tốn round.)

**Nghi thức re-pin (1 lượt lane, N chữ ký — dùng cho MỌI sự kiện re-pin machine-only):** một sự kiện re-pin = dispatch **1 agent tươi** chạy làn bằng MÁY tại HEAD: `node "$WORKFLOWS_DIR/../scripts/repin-lane.mjs" --root . --slug <a> --slug <b> … --reason "<lý do 1 dòng>" --write` (kit tự host thêm `--ag-root .`; env như khi chạy S4 — `CLAUDE_PLUGIN_ROOT`…). Script chạy `feature_loop.suite_keys` **VÀ mọi eval `test`/`script` trong `evals.yaml` của TỪNG slug TRỪ ô tự khai `status: not-run`** (lệnh trùng chỉ chạy một lần; từ 2.12.0 ô khai không-chạy KHÔNG bị thi hành — bên viết và bên đọc rút danh sách từ MỘT hàm dùng chung, và pin phải nói ra ô bị loại, xem khuôn dưới), mint `run_id` mới, `sha = git rev-parse HEAD` (cây bẩn ngoài `_acceptance/` → từ chối), rồi: **bất kỳ suite hay eval exit ≠ 0 → DỪNG: KHÔNG append dòng repin, KHÔNG sửa evidence (script exit 1, không ghi pin) — khắc phục nguyên nhân rồi chạy lane MỚI (run_id mới), không ký mù**; lệnh đỏ để nhật ký TRỌN ở `.acceptance-runs/<slug đầu>/repin-<run_id>/` (đọc tệp đó trước khi đoán nguyên nhân), và với `--write` mỗi slug nhận MỘT dòng `kind: repin-do` (lệnh đỏ · mã · đường nhật ký · `wall_s` · `so_lenh` · tải máy) — dấu lượt đỏ, không chống lưng pin nào (hồ sơ lan-ghim-lai-giu-tron-loi-loi) — **và cũng DỪNG như vậy khi executor chạm cây `_acceptance/<slug>/` của BẤT KỲ hồ sơ `signed-off`/`machine-cleared` nào** (làn chụp băm + mtime trước suite đầu, sau eval cuối, in đường từng tệp bị chạm; luật tạo phẩm ra `.acceptance-runs/<slug>/`: `eval-executors.md` mục «Where a run writes its artifacts») (từ 07/09/2026: làn chỉ chứng suite từng cho một hồ sơ mất tiền đề đi thẳng nhánh chính với CI xanh — eval của chính hồ sơ mới là thứ pin hứa). Làn xanh → script tự làm với TỪNG slug: (1) append 1 dòng đúng khuôn REPIN-TEMPLATE dưới đây vào run-log.jsonl CỦA TỪNG slug (`_acceptance/<slug>/run-log.jsonl`) — cùng một `run_id` cho cả sự kiện, `evals_exit` = {id eval máy: exit}, `wall_s` = giây từ suite đầu tới eval cuối, `so_lenh` = số lệnh khác nhau thực chạy; (2) evidence-report: frontmatter `verified_commit` → `sha` (bất biến `verified_commit` == `sha` của dòng repin) + append section `### Re-pin lần <N>` đúng khuôn, cite `run_id` nguyên văn — KHÔNG đụng chữ ký người (human_signoff/human_override); (3) tự kiểm bằng `recheck-evidence.cjs` — đỏ thì exit 1 trước khi ai commit. Agent KHÔNG viết tay dòng repin/section: bên đọc đòi đúng vật script sinh. Xong hết N slug, báo user 1 dòng: "re-pin N slug bằng 1 lượt lane (run_id <id>)". Lưới máy đối chiếu (pre-merge + recheck): run_id cite mà không có dòng repin khớp trong run-log slug đó / `sha` dòng repin ≠ `verified_commit` / `suites_exit` có phần tử ≠ 0 / run-log vắng file / **làn chống lưng `verified_commit` thiếu `evals_exit`, thiếu eval máy nào của `evals.yaml` (id tự khai `status: not-run` KHÔNG tính là thiếu — 2.12.0), có eval ≠ 0, mang mã ≠ 0 cho chính một id đã khai không-chạy, hoặc hồ sơ không có `evals.yaml`** — đều là VIOLATION; và luật HAI VẾ của lời khai không-chạy (2.12.0, cùng khuôn ADR 0016): ô khai `status: not-run` mà báo cáo ĐÃ KÝ vẫn có khối `- eval:` mang mã thoát cho chính nó là hai vế mâu thuẫn (làn dừng exit 2 TRƯỚC khi ghi byte nào; bên đọc ghi VIOLATION), và không đọc được báo cáo đã ký để đối chiếu vế hai cũng là VIOLATION (fail-closed — «thêm một dòng khai» không được thành đường né đo); KHÔNG có mốc ngày, KHÔNG sử liệu (owner 08/09/2026): dòng repin thiếu `evals_exit` là VIOLATION dù ghi khi nào — hồ sơ ghim bằng làn suite-only đời cũ là nợ thật, phải ghim lại bằng làn eval (thường ở chiến dịch phát hành); section Re-pin cũ không cite run_id theo khuôn thì không luật nào áp (grandfather). Giới hạn khai: eval `ui-check`/`judgment` không chạy được trong làn máy — re-pin không chứng lại chúng, và từ 2.18 làn NÓI RA điều đó thay vì im: `evals_not_machine` liệt mọi id ngoài làn máy, `evals_not_machine_touched` liệt những id mà diff từ pin cũ tới HEAD chạm `paths` của chính chúng, và section Re-pin nêu thêm `AC không có chốt máy` (AC mà MỌI eval phủ nó đều ngoài làn máy hoặc tự khai không-chạy). Làn KHÔNG chặn ở đây (owner quyết 20/09) — hồ sơ mang `evals_not_machine_touched` là hồ sơ phải đi vòng S4 delta (carry P1 theo `paths`), không đi re-pin; ngưỡng mở vòng chặn đếm bằng lệnh ở GUIDE §7.1.

<!-- <<<REPIN-TEMPLATE -->
```
{"ts":"<ISO>","kind":"repin","run_id":"<id>","sha":"<40-hex>","suites_exit":[0,0,0,0],"evals_exit":{"<E>":0},"wall_s":812.4,"so_lenh":5,"evals_not_run":["<E>"],"evals_not_machine":["<E>"],"evals_not_machine_touched":["<E>"],"chap_chon":[{"lenh":"<cmd>","nhan":"suite 1/4","lan_dau":1,"log":"<đường>","ca":["<tên ca>"]}],"suites_env":"ci","evals_hash":{"<E>":"<64-hex>"},"evals_carry":{"<E>":"<run_id>"},"carry_lech":["<E>"],"tong_ket":{"ket_cuc":"xanh","phut":13.5,"so_lenh":5,"model_goi":0,"model_carry":0,"chap_chon":1,"chi_phi":0.42}}
{"ts":"<ISO>","kind":"repin-do","lan_id":"<id>","sha":"<40-hex>","ly_do":"vuot-tran","tran_phut":80,"da_chay_phut":80.1,"tin_hieu":"SIGTERM","chua_chay":["<nhãn>"],"suites_exit":[1],"evals_exit":{"<E>":0},"lenh_do":[{"cmd":"<cmd>","exit":1,"log":"<đường>","lan_thu_lai":1,"log_lan_dau":"<đường>","moi_truong":"ci"}],"cham":[],"wall_s":812.4,"so_lenh":5,"chap_chon":[],"evals_hash":{"<E>":"<64-hex>"},"carry_lech":["<E>"],"tong_ket":{},"tai":{}}
### Re-pin lần <N> — <ngày>, do <lý do 1 dòng>
run_id: <id>
sha: <40-hex> · suites: <k> lệnh exit 0 · evals: <m>/<m> eval máy đạt kỳ vọng
```
<!-- REPIN-TEMPLATE>>> -->
Ba khoá của hồ sơ gia-lan-ghim-lai (2.23). `chap_chon` (khoá `feature_loop.repin_retry: 1`) và
`suites_env: "ci"` (khoá `feature_loop.repin_ci_blank_env`) theo CÙNG luật hiện diện — kho không bật
khoá thì vắng hẳn. `tong_ket` LUÔN có mặt (bật mặc định, chỉ thêm): kết cục, phút, số lệnh, eval
model thật đã gọi (khoá `feature_loop.model_evals`), `model_carry` = số eval model dùng lại theo băm đầu vào (0 khi `feature_loop.model_carry_cmd` vắng),
số lệnh chập chờn, và chi phí đo khi kho khai `feature_loop.repin_cost_cmd`. Làn còn hai kết cục dừng
sớm, không ghi pin, mỗi slug một dòng `repin-do` khi `--write`: **mã thoát 4** = vượt trần
(`--tran-phut` / `feature_loop.repin_budget_min`, `ly_do: "vuot-tran"` + `tran_phut`, `da_chay_phut`,
`chua_chay`) và **128 + số hiệu tín hiệu** = bị ngắt mềm (`ly_do: "bi-ngat"` + `tin_hieu`, `chua_chay`);
cả hai dừng lệnh bằng cách thu cả cây tiến trình theo `ppid` rồi SIGTERM → SIGKILL sau 10 giây. Dòng
stderr cuối của mọi kết cục bắt đầu `[lane] TỔNG KẾT`.

Ba khoá của hồ sơ eval-goi-model-that-khong-chay theo CÙNG luật hiện diện, bật bằng khoá
`feature_loop.model_carry_cmd` (lệnh in dấu vân tay môi trường model — vắng thì ba khoá vắng hẳn và làn y
như 2.26): `evals_hash` — băm năm lớp đầu vào của mỗi eval trong `model_evals` đã băm được; `evals_carry` —
eval nào DÙNG LẠI kết quả của lượt nào (`run_id` nơi nó thật sự chạy, chuỗi dàn phẳng; mã trong
`evals_exit` chép từ lượt đó; không cộng `model_goi`, cộng `tong_ket.model_carry`); `carry_lech` — eval chạy
thật với băm từng có mà mã khác (cũng ghi ở `repin-do`; eval đó thôi dùng lại tới khi băm đổi). Section
thêm hậu tố ` · dùng lại theo băm đầu vào (không gọi model): <E>←<run_id>` và ` · cùng băm mà kết quả khác
(carry_lech): <E>`; stderr mỗi eval model một dòng `dùng lại theo băm …` hoặc `không dùng lại — <lý do>`.
Cờ `--chay-lai-model` ép mọi eval model chạy thật ở lượt đó (vẫn ghi băm). Năm lớp, hạn 7 ngày, lý do
luôn chạy, bốn giới hạn và lệnh đếm `dem-dung-lai-model.mjs`: GUIDE §7.1.

Khoá `evals_not_run` chỉ CÓ MẶT khi hồ sơ có eval `test`/`script` tự khai
`status: not-run` (2.12.0) — hồ sơ không khai ô nào thì khoá VẮNG HẲN khỏi dòng,
không phải mang một mảng rỗng; giá trị là đúng các id bị loại, theo thứ tự bản khai.

Hai khoá `evals_not_machine` và `evals_not_machine_touched` (2.18) theo CÙNG luật
hiện diện. `evals_not_machine` liệt đúng các id có executor NGOÀI làn máy
(`ui-check`/`judgment`) theo thứ tự bản khai — **KIỂU thắng TRẠNG THÁI**: một ô
ngoài làn máy khai `status: not-run` chỉ vào khoá này, KHÔNG vào `evals_not_run`.
`evals_not_machine_touched` là tập con của nó, gồm các id mà
`git diff <pin cũ> HEAD` chạm một glob trong `paths` của CHÍNH eval đó — pin nói
ra rằng vật một ô ngoài làn máy đo đã đổi mà lượt ghim này không chứng lại.
Hồ sơ không có ô nào thì khoá VẮNG HẲN. Ba tập — khoá của `evals_exit`,
`evals_not_run`, `evals_not_machine` — rời nhau và hợp lại BẰNG tập id của
`evals.yaml`.

Dòng `sha:` mang thêm ba hậu tố TUỲ CHỌN (script tự nối, KHÔNG viết tay). Hai
hậu tố đầu khi hồ sơ có eval khai `expected_exit` (2.11.0, ADR 0016): ` ·
đạt-có-giới-hạn: <E>=<mã>` cho mỗi eval đạt ĐÚNG một mã khác 0 đã khai, và ` ·
giới hạn đã khai không còn: <E> (khai <mã>)` cho mỗi eval từng khai mã khác 0 mà
lượt này trả 0 (AC-10 — không phạt một cải thiện, nhưng phải nói ra, không được
im). Hậu tố thứ ba ` · không chạy theo hồ sơ: <E>` (2.12.0) liệt kê đúng các id
trong `evals_not_run`, để pin THÔI im lặng về ô nó không đo. Ngay sau nó, hậu tố
` · thay bởi hồ sơ đã ký: <E>→<hồ sơ>#<AC>` (2.24, hồ sơ eval-thay-boi-co-chung) liệt kê các ô
không-chạy mang con trỏ `superseded_by` đã qua chứng — cùng luật vắng-khi-rỗng, và bên đọc
KHÔNG tin hậu tố: nó chứng lại chuỗi ở mỗi lượt (khuôn khai: GUIDE §7.1). Ví dụ
dòng `sha:` mang cả hai (VÍ DỤ MINH HOẠ — nằm NGOÀI khuôn máy-đọc ở trên, không
phải một biến thể khuôn thứ hai):
```
sha: <40-hex> · suites: <k> lệnh exit 0 · evals: <m>/<m> eval máy đạt kỳ vọng · đạt-có-giới-hạn: E5=2 · giới hạn đã khai không còn: E7 (khai 3)
```

## Sổ quyết định (decisions.jsonl — rationale, KHÔNG phải scope-truth)

`_acceptance/<slug>/decisions.jsonl` — append-only, 1 dòng JSON/quyết định; ledger KHÔNG BAO GIỜ override contract/evals (descope một AC = sửa contract + re-approve; ledger chỉ ghi *vì sao*; mâu thuẫn ledger↔contract = lỗi phải báo user). Schema: `{"id":"d-<UTC>-<n>","type":"descope|approach|fix|revisit","stage":"S1|S2|S3|S4-r<N>|gate1|gate2","at":"<ISO>","decision":"1 câu — quyết gì, viết cho người ký","why":"1 câu — vì sao, được trỏ tệp và mã eval","cost_if_wrong":"1 câu — sai thì tốn gì, viết cho người ký"}` (ADR 0021 «ba vế một câu»; `impact` là đường đọc-cũ cho dòng ghi trước 2.19 — bộ đọc vẫn đọc nó, dòng mới không ghi nó) + optional `serves:["AC-2"]`, `revisit`, `supersedes:"<id>"`. Append (không script mới) bằng ĐÚNG khối lệnh ba dòng dưới, mỗi dòng sổ một lần chạy — chỉ thay `<slug>` và các ô `<…>` ở dòng giữa. Id `d-<UTC>-<n>` do lệnh tự tính: `<n>` = số thứ tự dòng mới trong sổ, nên sổ append-only cho mỗi dòng một mã kể cả khi nhiều dòng rơi vào cùng một giây. Phần JSON đi trong heredoc CÓ NHÁY (`<<'JSON'`), nên mọi ký tự trong câu — nháy đơn, `%`, `$`, backtick — được ghi nguyên văn; chỉ `"` và `\` phải escape theo JSON (`\"`, `\\`), và phần JSON nằm trên MỘT dòng. Đừng tính id một lần vào biến rồi dùng cho nhiều dòng — đó đúng là lỗi làm 8 dòng sổ release-2-11-0 chung một mã, và câu dịch trên thẻ bị lặp sang mọi dòng cùng mã:
<!-- <<<DEC-ID-RECIPE -->
```
L=_acceptance/<slug>/decisions.jsonl; { printf '{"id":"d-%s-%s",' "$(date -u +%Y%m%dT%H%M%SZ)" "$(( $(cat "$L" 2>/dev/null | grep -c '') + 1 ))"; tr -d '\n' <<'JSON'; printf '}\n'; } >> "$L"
"type":"<type>","stage":"<stage>","at":"<ISO>","decision":"<1 câu>","why":"<vì sao, 1 câu>","cost_if_wrong":"<sai thì tốn gì, 1 câu>"
JSON
```
<!-- DEC-ID-RECIPE>>> -->

**Lớp của nhát sửa (dòng `fix` ở S4, thuoc-co-cua AC-13):** thêm ĐÚNG đoạn dưới vào dòng giữa của khối lệnh trên, NGAY SAU `"cost_if_wrong":"<sai thì tốn gì, 1 câu>"` — không chen giữa `type` và `stage` (bộ đếm sức khoẻ vòng khớp hai khoá ấy trên chuỗi thô). `<lớp>` chép nguyên văn từ `node "$WORKFLOWS_DIR/../scripts/thuoc-vat.mjs" --root . --slug <slug> --target HEAD` sau khi commit nhát sửa. Ô này TUỲ CHỌN và chỉ để người đọc sổ: số nhát sửa thước do git đếm, không bao giờ đọc từ sổ — dòng thiếu ô vẫn đọc được ở mọi bộ đọc.
<!-- <<<DEC-TARGET-SLOT -->
,"target":"<lớp>"
<!-- DEC-TARGET-SLOT>>> -->

**Căn cứ của lựa chọn ở bước thiết kế (dòng `stage:"S1"`, ADR 0022):** thêm ĐÚNG MỘT dòng dưới vào dòng giữa của khối lệnh trên, NGAY SAU `"cost_if_wrong":"<sai thì tốn gì, 1 câu>"`, chọn theo nguồn căn cứ (luật xếp ở S1 mục 1): mục tiêu + quy tắc đã khai · chỉ một lối ra sống · chỉ người có. `kho_dao` là `true` khi lựa chọn chạm ship ra người dùng thật · xoá dữ liệu · cam kết ra ngoài kho. Khoá này máy đọc (`scripts/can-cu-s1.cjs`), không phải câu thứ tư để người đọc; dòng không có khoá là dòng đời trước, đọc như cũ. Thay một dòng S1 trước Cổng Phạm vi = ghi dòng mới mang `"supersedes":"<mã dòng cũ>"` (sổ chỉ thêm).
<!-- <<<DEC-CAN-CU-SLOT -->
,"can_cu":{"nguon":"muc-tieu","kho_dao":false,"tep":"<đường dẫn tương đối gốc kho>","trich":"<câu trích nguyên văn, một dòng>"}
,"can_cu":{"nguon":"mot-loi","kho_dao":false,"loi_chet":"<lối khác chết vì sao, 1 câu>"}
,"can_cu":{"nguon":"chi-nguoi","kho_dao":false,"khuyen":"<lối máy khuyên, 1 câu>","loi_khac":"<lối khác — giá nếu chọn nó, 1 câu>"}
<!-- DEC-CAN-CU-SLOT>>> -->

**Lật ở Cổng Phạm vi:** người trả «sửa:» mà đổi một lựa chọn đã ghi ở bước thiết kế → TRƯỚC khi soạn lại, ghi MỘT dòng bằng khối lệnh trên với dòng giữa thay bằng đúng dòng dưới (`decided_by` là danh tính người — điều máy biết, suy như lệnh duyệt). Đây là bên viết của cột «máy quyết bị lật» trong `AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/can-cu-s1.cjs) && node "$AG/scripts/can-cu-s1.cjs" --root . --dem` — đường đo của hồ sơ buoc-len-thiet-ke-khong-hoi.
<!-- <<<DEC-LAT-GATE1 -->
"type":"<type>","stage":"gate1","at":"<ISO>","decision":"<lựa chọn mới theo lời người, 1 câu>","why":"người chọn ở Cổng Phạm vi: <câu người gõ ở Cổng Phạm vi>","cost_if_wrong":"<sai thì tốn gì, 1 câu>","supersedes":"<mã dòng S1 bị đổi>","decided_by":"<tên người>"
<!-- DEC-LAT-GATE1>>> -->

**Rule đáng-log (chống nhiễu):** CHỈ khi (a) loại một phương án khả dĩ ∨ (b) cố tình nhận downside ∨ (c) có điều kiện revisit. Không có phương án thay thế → KHÔNG log; feature đơn giản 0 entry là hợp lệ. `descope` = ưu tiên 1 — quyết định "không làm" vô hình trong code, đắt nhất khi bị lật lại.

**Điểm ghi (friction ≈ 0, cuối stage):** cuối S1 (approach/descope chưng cất từ brainstorm — design-doc giữ văn xuôi) · cuối S2 (lựa chọn load-bearing của plan) · giữa S3 khi buộc đổi hướng so với plan · mỗi S4 REJECT→fix: `stage:"S4-r<N>"`, ghi cách-sửa-đã-chọn + vì sao · Gate 2 nếu human để lại revisit/override. **Seal:** khi Gate 1 duyệt, append `{"id":"d-...","type":"seal","gate":1,"at":"<ISO>"}` CÙNG LÚC set `approved_by` — mọi dòng SAU seal là provisional bất kể `stage` tự khai, card Gate 2 trình riêng khối "CHƯA duyệt" cho human phê. **Lật quyết định:** entry mới `supersedes:"<id>"` + human phê ở gate kế — không sửa/xóa dòng cũ.

**Dòng nạp luật sản phẩm (hồ sơ bat-bien-san-pham, ADR 0024):** kho có `PRODUCT-INVARIANTS.md` ở gốc → bước thiết kế ghi đúng MỘT dòng theo khuôn dưới, thay cho dòng giữa của `DEC-ID-RECIPE`: `<ban>` = `git hash-object PRODUCT-INVARIANTS.md` (phiên bản luật đã nạp), `<N>` = số luật đọc được (số, không nháy). Kho không có tệp → không ghi gì. Thẻ Cổng Phạm vi so `ban` với tệp hiện tại; thiếu dòng hoặc lệch bản là cờ vàng.
<!-- <<<DEC-LUAT-NAP -->
"type":"approach","stage":"S1","at":"<ISO>","decision":"Nạp <N> luật sản phẩm từ PRODUCT-INVARIANTS.md","why":"Kho đã khai tệp luật sản phẩm — bước thiết kế đọc nó trước khi chọn.","cost_if_wrong":"Không nạp thì lựa chọn phạm luật đi qua Cổng Phạm vi không ai gọi tên.","can_cu":{"nguon":"mot-loi","kho_dao":false,"loi_chet":"Kho đã khai tệp luật — bỏ qua tệp là phạm luật nạp của kit."},"luat_nap":{"ban":"<ban>","so":<N>}
<!-- DEC-LUAT-NAP>>> -->

**Dòng «đã tra tri thức» (hồ sơ thiet-ke-nap-tri-thuc):** kho khai `tri_thuc` trong `_acceptance/config.yaml` → bước thiết kế ghi đúng MỘT dòng theo khuôn dưới, thay cho dòng giữa của `DEC-ID-RECIPE`: `<mã hàng hoặc câu tra>` = mã hàng (vòng từ hàng) hoặc câu tra (vòng đơn lẻ); mảng `trang` = đường trỏ băm của MỌI trang đã đọc, gồm mọi trang của dòng «Nguồn:» trong ô — thêm phần tử thì nối bằng dấu phẩy, đã tra mà không có trang liên quan thì `"trang":[]`; mảng `so` = đường trỏ `<hồ sơ>#<mã dòng>` của mọi dòng sổ hồ sơ trước đã đọc, không có thì `"so":[]` (hồ sơ vong-don-le-tra-tri-thuc: dòng tra của hồ sơ `draft` thiếu `so` là chưa tra sổ — thẻ chặn như thiếu dòng). Lệnh tra (khối `TRI-THUC-TRA-MO-TA`, S1 bước 0c) in đối tượng `tri_thuc_tra`: điền ô của khuôn từ nó — `tra`, mảng `trang`, mảng `so`, và thêm `khong_doc` khi đối tượng có. Máy không đọc được kho tri thức (kho riêng vắng, clone không được) → `"trang":[]` và thêm `,"khong_doc":"<dòng «không đọc được ở đây» lệnh in>"` ngay sau mảng. Ghi lại dòng tra (tra thêm trang) = ghi dòng mới; thẻ theo dòng cuối còn hiệu lực. Kho không khai → không ghi gì.
<!-- <<<DEC-TRI-THUC-TRA -->
"type":"approach","stage":"S1","at":"<ISO>","decision":"Đã tra tri thức: <mã hàng hoặc câu tra>","why":"Kho đã khai tri_thuc — bước thiết kế tra trang trước khi chọn.","cost_if_wrong":"Không tra thì bối cảnh nghiên cứu và thảo luận không tới vòng này.","can_cu":{"nguon":"mot-loi","kho_dao":false,"loi_chet":"Kho đã khai tri_thuc — bỏ tra là phạm luật nạp của kit."},"tri_thuc_tra":{"tra":"<mã hàng hoặc câu tra>","trang":["<đường trỏ băm>"],"so":["<đường trỏ sổ>"]}
<!-- DEC-TRI-THUC-TRA>>> -->

Căn cứ của một lựa chọn là một trang tri thức → dùng khoá dưới thay cho dòng `muc-tieu` của `DEC-CAN-CU-SLOT` (cùng chỗ đặt, ngay sau `"cost_if_wrong":…`): đường trỏ băm thay cặp `tep` + `trich`. Trang nằm ở kho riêng thì KHÔNG chở câu trích hay tệp nào sang sổ, design doc hay mô tả PR — bộ xếp đỏ `tri-thuc-kem-trich`. Bộ xếp nhận dòng là máy đã quyết khi băm khớp, kèm nhãn «không đọc được ở đây» khi máy không có bản kho; lệch hay sai khuôn là đỏ.
<!-- <<<DEC-CAN-CU-TRI-THUC -->
,"can_cu":{"nguon":"muc-tieu","kho_dao":false,"tri_thuc":"<kho>:<trang>#<băm>"}
<!-- DEC-CAN-CU-TRI-THUC>>> -->

## Làn design (2 công tắc — bảng tra duy nhất, KHÔNG lưu field tier)

Mọi điểm 🎨 dưới đây tra bảng này — mỗi điểm là MỘT câu hỏi nhị phân, không nhánh phụ:

| Công tắc | Điều kiện (máy-đọc, derive từ artifact) | Khi bật |
|---|---|---|
| **CT1 — chạm UI** (rẻ, tự động) | config có `executors.design.*` (wire tay — xem GUIDE mục Wire executors.design) **∧** feature chạm surface web-UI | S1: static evals per-surface (cmd `config:executors.design.static` + target + capture `--html` + `--require-html`) + eval `config:executors.design.gate` (P0 floor, cùng capture) + vài dòng "surface & state chạm" trong design-doc + nghi thức S1-D cuối S1 (xem đoạn "Nghi thức S1-D" dưới bảng) · S4: fidelity ADVISORY nếu surface có reference cũ · Gate 2: ghi lane vào gói |

Từ vựng hiển thị: **D0** = ¬CT1 · **D1** = CT1 — chỉ để nói chuyện với user/card, không lưu đâu cả. Feature chạm UI mà repo CHƯA wire `executors.design.*` → CẢNH BÁO (không chặn), và việc static-không-chạy phải hiện trong gói Gate 2. AC perceptual-so-chuẩn xuất hiện trong contract mà repo chưa có bản chuẩn để so → nhắc user (cần chuẩn để so = phải có chuẩn), không tự chặn. **Nghi lễ design-of-record (mockup → evidence → push) đã khai tử 2026-08-12** — vai "khoảnh khắc visual trước Cổng 1" nay do nghi thức S1-D (skill `design-pass`) đảm nhiệm, chấm bằng eval `ui-check`/`design-gate`.

**Nghi thức S1-D (cuối S1, MỌI feature chạm UI — trigger là surface web-UI của feature, KHÔNG phụ thuộc CT1 hay `executors.design.*`):** feature chạm UI → chạy skill `design-pass` (plugin acceptance-gate ≥ 1.26.0, in-harness) TRƯỚC Gate 1 — Gate 1 duyệt UI trên BẢN BẤM ĐƯỢC, không duyệt UI bằng chữ. Bỏ bước này PHẢI là entry `descope` CÓ TÊN trong ledger (AUTO-DRAFT: decision bắt đầu đúng chuỗi `"bỏ design-pass — <lý do 1 dòng>"`, impact "Gate 1 duyệt UI bằng chữ — mất khoảnh khắc visual trước duyệt"); không có đường bỏ im lặng. Chọn chạy = entry `type:"approach"` như mọi quyết định lane. Nấc phản ứng theo thang bốn nấc của nghi thức — Mặc định là KHÔNG ĐỒNG BỘ: máy dựng bản mẫu, tự chụp ma trận trạng thái × khổ, gửi gói rồi đi làm việc khác; nac-3 (ngồi cùng) chỉ mở khi có người gọi tên nó. Kết phiên S1-D phải đủ 4 mục: ma trận capture + findings + nấc ngữ cảnh đã khai + nấc phản ứng đã khai (khoá `reaction:`; thiếu → thẻ cờ vàng đường đọc-cũ, KHÔNG chặn, không bắt migrate) (khoá `context:` trong `design-pass.md` — thẻ Cổng 1 render nấc; `standalone` thiếu cảnh ngữ-cảnh sẽ cờ vàng). Khi resume vào workspace có `design-pass.md`, đọc khoá `context:`; thiếu (sổ phiên đời trước trục ngữ cảnh) → thẻ cờ vàng đường đọc-cũ, KHÔNG chặn, không bắt migrate.

**Lưới S4 tier-mismatch (chạy ở bước chuẩn-bị-args S4):** config có `design.surface_globs` → chạy `git diff --name-only <diffBase>`; có file khớp glob mà `evals.yaml` KHÔNG có eval design nào (static/fidelity) → DỪNG, báo user: "diff chạm surface (`<path>` → `<glob>`) nhưng lane hiện tại không có design eval — nâng lane (thêm static evals) hoặc xác nhận + ghi entry `descope`". Key vắng → bỏ qua lưới, ghi chú 1 dòng vào gói Gate 2.

🎨 Resume guard: khi resume vào feature chạm UI mà `status` ≥ `approved` nhưng workspace KHÔNG có `design-pass.md` → báo user + đề nghị chạy skill `design-pass`, KHÔNG chặn (workspace cũ đi đường đọc-cũ).

## Công tắc coverage (CT-S — chống sót AC, 1.13.0)

**CT-S bật ⟺ `risk_tier ∈ {T2, T3}`** — tier đã máy-derive ở S0, zero phán đoán ngữ nghĩa (T1 thoát từ S0 nên không bao giờ đụng). Đảo mặc định để chống bỏ-qua-thầm-lặng: câu hỏi KHÔNG phải "có nên quét không?" (quên = vô hình) mà là "có muốn BỎ quét không?" (bỏ = 1 entry `descope` hiện trên card). 3 lớp:

1. **S1 mặc định:** quét không gian AC bằng skill `morphological-scan` (plugin acceptance-gate) trong lúc brainstorm — xem S1#3.
2. **Structural slot:** contract PHẢI có section `## Coverage` (trục + thước CE, hoặc 1 dòng lý do bỏ trỏ entry descope) — thiếu → CHƯA đủ điều kiện vào Gate 1 (S1#5).
3. **Card render:** `/acceptance-gate:acceptance-card` Cổng 1 hiện khối "Độ phủ AC" + cờ vàng khi thiếu section / có `[CE chưa kiểm chứng]` — máy chỉ enforce CÓ MẶT + ghi vết; ĐÚNG/đủ thật là việc human soi tại gate.

Workspace cũ (contract sinh trước 1.13.0, không có Coverage) → cờ vàng trên card, KHÔNG chặn resume, không bắt migrate.

## S0 — INTAKE

0. **Preflight dependency** (chỉ lần đầu mỗi repo/máy): skill `superpowers:brainstorming` + `superpowers:writing-plans` có trong danh sách skill khả dụng? Plugin acceptance-gate resolve được, KÈM cả references lẫn skill coverage-scan — một lệnh, một lần: `node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require skills/acceptance/references/judge-personas.md --require skills/morphological-scan/SKILL.md` (thiếu morphological-scan = acceptance-gate < 1.16, cần update; resolver bỏ qua bản không đủ file thay vì trả về thư mục chết ở bước sau)? Thiếu cái nào → DỪNG, đưa user lệnh cài cụ thể (`claude plugin install acceptance-gate@acceptance-gate-kit` / `claude plugin install superpowers@claude-plugins-official`), KHÔNG đi tiếp với lỗi mờ.
1. Xác định files dự kiến đụng (từ mô tả feature; chưa cần chính xác tuyệt đối).
2. Đọc `_acceptance/config.yaml` (chưa có → bảo user chạy `/acceptance-gate:acceptance-init` trước):
   - Match toàn bộ vào `risk_tiers.t1_skip_globs` → **T1: thoát loop**, nhưng KHÔNG thoát im lặng: in bảng match (`<path dự kiến> → <glob>`), hỏi user XÁC NHẬN kết luận T1 rồi mới thoát, kèm cảnh báo backstop CI (`pre-merge-check.sh --base <ref>`) sẽ chặn merge nếu PR thực tế đụng path gated mà không có `_acceptance/` artifacts.
   - Match bất kỳ `risk_tiers.t3_paths` → **T3**. Còn lại **T2**.
3. Slug = kebab-case tên feature. Workspace: `_acceptance/<slug>/`. **Guard trùng slug:** workspace đã tồn tại → so `feature:` (và `owner:`) trong frontmatter contract với mô tả hiện tại — KHÁC feature → đây là ĐỤNG slug chứ không phải resume: BẮT đổi slug mới (đề xuất `<slug>-2` hoặc suffix ngày), tuyệt đối không im lặng ghi đè workspace của feature khác; CÙNG feature → resume theo bảng state. Contract mới sinh ở S1 phải ghi `owner:` = `git config user.email`. Vòng mới (chưa có hồ sơ) → chạy dòng một của khối `S4-DO-VONG` (đọc hạn mức tuần lúc mở) để lượt đo cuối vòng quy đổi được % hạn mức. Workspace đã có `opportunity.md` (vòng đi từ Cổng Đáng) → đó là INPUT THỨ NHẤT của brainstorm S1: đọc trước khi hỏi câu nào; ngưỡng nghiệm thu và khung người/việc/dữ liệu của nó chảy vào contract — không hỏi lại owner điều đã grill.
   **Nhận một hàng lộ trình** (kho khai ổ cắm `lo_trinh.tep`, một tệp hoặc danh sách): đối số không khớp workspace nào. CHỈ khi đối số khớp mẫu trong khối `S0-MA-HANG-RE` dưới đây — một mã, hoặc `<tệp>:<mã>` khi kho có nhiều lộ trình — mới chạy khối `S0-MO-O`, thay `<mã>` bằng đối số (nằm trong nháy đơn). Đối số không khớp mẫu — có khoảng trắng, dấu, backtick, `$(...)`, ngoặc — là mô tả việc: KHÔNG đưa nó vào bất kỳ lệnh shell nào, vì trong nháy kép shell vẫn chạy backtick và `$(...)`. Khối `S0-MO-O` mở việc từ hàng QUA Cổng Đáng (hồ sơ lo-trinh-tren-du-lieu-that): hàng đã có hồ sơ (thư mục slug, hoặc ô cơ hội ghi `lo_trinh_ma` của hàng) → in `{"hoSo":"<slug>","moi":false}`; chưa có → ghi `_acceptance/<slug>/opportunity.md` từ khuôn ô cơ hội (slug = `slug` của hàng, vắng thì suy tất định từ câu giao; ngưỡng đề xuất từ `bat_khi` và ngày mốc của hàng; ghi `lo_trinh_ma`/`lo_trinh_tep`) rồi in `{"hoSo":"<slug>","moi":true}`. Ứng xử theo mã thoát ĐÚNG bảng `S0-MO-O-THOAT` — bảng là hợp đồng với lệnh, ca đo LT-76 đọc chính bảng này. `moi: true` → in lại slug máy chọn, trình thẻ Cổng Đáng của ô (`/acceptance-gate:acceptance-card <slug>`) rồi DỪNG ở Cổng Đáng, kết lượt theo điều khoản kết-lượt-cổng (mục GATE 1) — KHÔNG vào S1: Cổng Đáng là cổng đã có trong thiết kế, chọn hàng không phải chốt «có làm». `hang` của hàng in cạnh hạng máy suy ở bước 2 khi vòng chạy tiếp (khác thì nói ra, máy không tự đổi). Kit không ghi gì vào tệp ý định — trạng thái hàng tự hiện trên `LO-TRINH.html` khi hồ sơ của vòng sinh ra. Khối `S0-NHAN-HANG` chỉ đọc một hàng (in JSON, không ghi gì) — dùng khi cần soi hàng mà không mở việc.
<!-- <<<S0-MA-HANG-RE -->
```
^([A-Za-z0-9][A-Za-z0-9_./-]*:)?[A-Za-z0-9][A-Za-z0-9_.-]*$
```
<!-- S0-MA-HANG-RE>>> -->
<!-- <<<S0-MO-O -->
```
AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/lo-trinh.mjs --require skills/acceptance/references/opportunity-template.md) && node "$AG/scripts/lo-trinh.mjs" --root . --hang '<mã>' --mo-o --owner "$(git config user.email)"
```
<!-- S0-MO-O>>> -->
<!-- <<<S0-MO-O-THOAT -->
```
0 → theo moi: true → in slug, trình thẻ Cổng Đáng của ô rồi DỪNG · false → resume hồ sơ hoSo như workspace có sẵn
1 → mô tả việc (kho chưa khai lộ trình, không có hàng mang mã đó, hoặc gói chưa có bộ đọc)
2 → dừng: in nguyên thông điệp (đối số sai, thư mục đích đã có, khuôn ô cơ hội thiếu)
3 → dừng: in nguyên thông điệp (mã có ở nhiều lộ trình — người gọi lại bằng <tệp>:<mã>)
```
<!-- S0-MO-O-THOAT>>> -->
   **Tên phiên và nhóm thanh bên theo mốc** (hồ sơ moc-la-chien-dich): JSON của khối `S0-MO-O` — cả `moi: true` lẫn `moi: false` — mang thêm ba khoá liệt ở khối `S0-TEN-CHIEN-DICH` dưới đây, do MỘT hàm của bộ đọc lộ trình sinh: `moc` (mốc của hàng, hoặc `null`), `ten_phien` (`<mã> · <tên ngắn> (<kho>)`), `nhom` (`<lộ trình> · <mốc>`, kho một lộ trình thì `<mốc>`). In `ten_phien` và `nhom` ngay dưới slug — `nhom` rỗng thì in «chưa gắn mốc» thay cho nó. Phiên có công cụ đặt tên phiên và xếp nhóm thanh bên của app desktop → đặt tên phiên bằng đúng `ten_phien`, rồi xếp phiên vào nhóm tên đúng bằng `nhom` (tạo nhóm khi chưa có); luật ca `nhom` rỗng là dòng `nhom-rong` của khối. Mặt không có thanh bên chỉ in. Đây không phải câu hỏi cho người, không thêm lượt gọi; tên KHÔNG mang trạng thái (chờ ký, đang chấm…).
<!-- <<<S0-TEN-CHIEN-DICH -->
```
khoa: moc ten_phien nhom
nhom-rong: khong-xep
```
<!-- S0-TEN-CHIEN-DICH>>> -->
   **Tự áp chính sách ở điểm mở việc** (hồ sơ ap-chinh-sach-lo-trinh): khi chiến dịch đang chạy của lộ trình khai `chinh_sach.tu_ap: true`, lệnh của khối `S0-MO-O` áp chính sách TRƯỚC khi mở ô (báo trước · dời · huỷ, ghi sổ `<tệp>.so.jsonl`; hàng đang mở không bị đụng) và JSON mang thêm khoá `ap` khi có dòng sổ mới. Có khoá `ap` → commit RIÊNG tệp lộ trình + sổ tự áp TRƯỚC commit mở ô, đúng tiêu đề trong khối dưới. Không hỏi người: chính sách là chữ chủ kho đã chốt lúc cắt mốc; đường đảo là lệnh trả lại và lệnh ghim của gói road-map (lệnh chỉ người gõ). Thước «dời bằng tay» nhận phần máy làm bằng dòng `ap` của sổ, không bằng tiêu đề — tiêu đề là để người đọc lịch sử.
<!-- <<<S0-AP-COMMIT -->
```
lo-trinh(may-ap): <n> hàng — <YYYY-MM-DD>
```
<!-- S0-AP-COMMIT>>> -->
<!-- <<<S0-NHAN-HANG -->
```
AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/lo-trinh.mjs) && node "$AG/scripts/lo-trinh.mjs" --root . --hang '<mã>'
```
<!-- S0-NHAN-HANG>>> -->
   **Kho bật chặn lộ trình, đối số là mô tả** (hồ sơ kho-cam-ket-co-lo-trinh; kho bật = gói `road-map` ở `.claude/settings.json` + `lo_trinh.chan: true`): đối số không khớp `S0-MA-HANG-RE`, hoặc `S0-MO-O` thoát 1 → sau khi chọn slug ở bước 3, chạy khối `S0-THEM-HANG` (thay `<slug>` và `<mô tả>`) — câu mô tả đi trong heredoc CÓ NHÁY, không bao giờ vào đối số shell — rồi làm đúng bảng `S0-THEM-HANG-THOAT`. Máy thêm một hàng mã = slug vào tệp lộ trình đầu tiên của kho; câu «gắn mốc nào» không hỏi ở đây — cờ «chưa thuộc mốc nào» hiện trên thẻ khởi động. Phiên quên chạy khối thì bước ghi hợp đồng bị hook chặn kèm đúng lệnh này.
<!-- <<<S0-THEM-HANG -->
```
AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/lo-trinh.mjs --require lib/chan-lo-trinh.cjs) && node "$AG/scripts/lo-trinh.mjs" --root . --them-hang --slug '<slug>' <<'CAU_GIAO_HET'
<mô tả>
CAU_GIAO_HET
```
<!-- S0-THEM-HANG>>> -->
<!-- <<<S0-THEM-HANG-THOAT -->
```
0 → đã thêm hàng mã <slug> vào lộ trình → đi tiếp S1 như cũ; commit tệp lộ trình cùng hồ sơ
1 → kho không bật chặn → đi tiếp như cũ, không nói gì thêm
2 → dừng: in nguyên thông điệp (tệp lệch khuôn, đã có hàng, câu rỗng, khoá sai giá trị)
```
<!-- S0-THEM-HANG-THOAT>>> -->
   **Dòng «Nguồn:» của ô** (hồ sơ o-mo-viec-mang-nguon): kho khai `tri_thuc` và hàng có `dot` → ô do khối `S0-MO-O` mở mang thêm dòng «Nguồn:» ngay sau dòng «Mở từ hàng …»: đường trỏ băm tới trang nền, trang đợt và trang mang mã của hàng (bên ghi và bên đọc `scripts/tri-thuc-nguon.cjs`). Kho không khai, hay hàng không có `dot`, nhận ô như cũ từng byte.
4. Nếu giữa chừng phát hiện tier sai (vd T1 hóa ra đụng t3_paths) → nâng tier, quay lại stage thiếu (thường là S1 sinh contract).
4b. **Bậc design-floor của kho (hồ sơ design-floor-moc-s0-s1).** Chạy đúng khối dưới (kit tự host thêm `--root .` ngay sau `--plugin acceptance-gate`) và nói lại nguyên văn dòng nó in. Kho M0 (không khai `design.surface_globs`, hay khai mà không khớp tệp nào) → lệnh không in gì: không nhắc design-floor, đi tiếp. Dòng in là thông tin, không phải câu hỏi; lệnh không ghi tệp nào; máy không tự nâng bậc hay ghi `design_floor.niem_phong` (M3 chỉ người ghi).
<!-- <<<DESIGN-FLOOR-S0 -->
```
AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/design-floor-bac.mjs) && node "$AG/scripts/design-floor-bac.mjs" --root .
```
<!-- DESIGN-FLOOR-S0>>> -->
5. 🎨 **(CT1 signals)** Feature có vẻ chạm UI mà config CHƯA có `executors.design.*` → CẢNH BÁO (không chặn): đề nghị wire `executors.design.*` bằng tay (GUIDE mục Wire executors.design), hoặc user xác nhận đi tiếp functional-only (sẽ hiện ở gói Gate 2). Đã wire → làn design theo bảng tra. Nếu `provenance.design_repo` set mà repo KHÔNG reachable → cảnh báo ngay từ S0, trước khi tốn công S1-D (fidelity sẽ skip). Surface `mobile` KHÔNG phải web-UI surface: không kích hoạt CT1/làn design (làn design là web-only) — flow mobile đi làn eval `test` qua `config:executors.test.e2e_mobile` (xem eval-executors.md §Mobile mechanics).

## S1 — DESIGN (sinh 3 artifact CÙNG LÚC)

0. **Đường nền hạ tầng — TRƯỚC khi viết tệp nào của vòng, trên cây chưa đụng.** Chạy NỀN (tiến trình nền, máy được báo khi xong — chân suite ở kho lớn chạy hàng chục phút, không lời gọi công cụ nào được ôm trọn nó): `node "$WORKFLOWS_DIR/../scripts/duong-nen.mjs" --root . --slug <slug>`; brainstorm đi song song, không chờ. Mã 0 → nền xanh. Mã 1 → `_acceptance/<slug>/duong-nen.md` gọi tên từng thứ đỏ: máy TỰ gỡ thứ gỡ được trong phạm vi repo (sửa lệnh executor sai đường, chạy lệnh cài phụ thuộc repo đã khai) rồi chạy lại; thứ chỉ người gỡ được (cài phần mềm hệ thống, quyền, khoá) gom MỘT lần vào lời mời Cổng Phạm vi — không hỏi rải rác. Đỏ ở đây theo định nghĩa KHÔNG phải lỗi của vòng. Mục «Dòng vàng» của tệp là tệp hay vi phạm của CHÍNH vòng (đường mang slug, `_acceptance/config.yaml`, `VIOLATION [<slug>]`) mà vòng ghi trong lúc nền chạy — không lật nền, không phải lý do chạy lại. Mã 2 → không chạy được (không phải kho git, thiếu `_acceptance/config.yaml` hoặc `feature_loop.suite_keys`): trình nguyên văn thông điệp, không tự dựng tệp thay. Thẻ Cổng Phạm vi đọc tệp này thành khối «Nền hạ tầng».
0b. **Luật sản phẩm của kho (hồ sơ bat-bien-san-pham, ADR 0024).** Kho có `PRODUCT-INVARIANTS.md` ở gốc → đọc TRỌN tệp làm input tường minh của bước nghĩ (tệp ở gốc không tự nạp như `CLAUDE.md`) và ghi đúng MỘT dòng nạp theo khuôn `DEC-LUAT-NAP` (mục «Sổ quyết định»). Lựa chọn theo một luật → căn cứ nguồn mục-tiêu trỏ `PRODUCT-INVARIANTS.md` + câu luật; lựa chọn trái một luật → câu chỉ-người mang `"pham_luat":"SP-<số>"` trong `can_cu`, `kho_dao` theo mức luật (luật «khó đảo» → `true`), khuyến nghị và lối khác như mọi câu chỉ-người — máy không tự quyết phạm luật. Máy KHÔNG sửa tệp luật: muốn đổi luật thì đề nghị trong design doc, chủ kho sửa bằng commit riêng. Kho không có tệp → bỏ bước, không ghi gì.
0c. **Tra tri thức của kho (hồ sơ thiet-ke-nap-tri-thuc).** Kho khai `tri_thuc` → TRƯỚC khi chọn: kho riêng vắng ở máy thì chạy `AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/tri-thuc-tra.cjs) && node "$AG/scripts/tri-thuc-tra.cjs" --root . --clone` (kit tự host: `AG=.`) — tự clone khi có `remote` và quyền, từ chối đích nằm trong cây kho; thoát 3 = không đọc được ở đây. Rồi tra bằng khối lệnh `TRI-THUC-TRA-MO-TA` dưới (hồ sơ vong-don-le-tra-tri-thuc) — MỌI vòng, câu đi trong heredoc CÓ NHÁY, không bao giờ vào đối số shell: vòng đơn lẻ thay `<câu mô tả hoặc câu giao>` bằng câu mô tả người gõ; vòng từ hàng thay bằng câu giao của hàng. `<slug>` là hồ sơ của vòng: lệnh cộng đường trỏ dòng «Nguồn:» của ô vào `trang` và loại sổ của chính hồ sơ. Lệnh in trang nền + trang khớp chữ (tiêu đề, frontmatter, tiêu đề mục), dòng sổ hồ sơ trước khớp chữ (lời người ở cổng xếp trước) kèm khối `can_cu` dựng sẵn, và đối tượng `tri_thuc_tra`. Đọc các trang và dòng sổ ấy, rồi ghi đúng MỘT dòng theo khuôn `DEC-TRI-THUC-TRA` (mục «Sổ quyết định»), ô điền từ đối tượng lệnh in. Lựa chọn dựa trên một trang → căn cứ khuôn `DEC-CAN-CU-TRI-THUC`; dựa trên một dòng sổ hồ sơ trước → căn cứ là khối `can_cu` lệnh in cho dòng ấy (khuôn mục tiêu, `tep` + `trich`). Thoát 2 = kho chưa khai hoặc khối lỗi: trình nguyên văn. Kho không khai → bỏ bước, không ghi gì.
<!-- <<<TRI-THUC-TRA-MO-TA -->
```
AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/tri-thuc.mjs --require scripts/tri-thuc-tra.cjs) && node "$AG/scripts/tri-thuc.mjs" --root . --tra --slug '<slug>' <<'CAU_TRA_HET'
<câu mô tả hoặc câu giao>
CAU_TRA_HET
```
<!-- TRI-THUC-TRA-MO-TA>>> -->
0d. **Sàn thiết kế ở S1 (hồ sơ design-floor-moc-s0-s1).** Sau khi hồ sơ có `contract.md` (hay ít nhất ô cơ hội), chạy đúng khối dưới, thay `<slug>` (kit tự host thêm `--root .` ngay sau `--plugin acceptance-gate`). Kho M0 → không in, không ghi. M1–M3 → lệnh ghi `_acceptance/<slug>/design-floor.json` và một dòng vào `usage-report.md` của hồ sơ, rồi in các dòng: bậc kho · tri thức thiết kế (chỉ mục + tối đa hai tệp, kèm token) · kế hoạch dùng lại (khi hồ sơ có `reuse-plan.md`) · luồng (khi hồ sơ có `flow.json`). Đọc ĐÚNG các tệp tri thức dòng ấy trỏ (đường tương đối thư mục `tri_thuc.goc` của `design-floor.json`) trước khi chọn phương án — không mở tệp tri thức nào khác. Viết `reuse-plan.md` hay `flow.json` rồi thì chạy lại khối để dòng thẻ mới. Dòng «không đọc được ở đây» không chặn vòng. Thẻ Cổng Phạm vi in các dòng thành khối «Sàn thiết kế» — thông tin, không câu hỏi.
<!-- <<<DESIGN-FLOOR-S1 -->
```
AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/design-floor-s1.mjs) && node "$AG/scripts/design-floor-s1.mjs" --root . --slug '<slug>'
```
<!-- DESIGN-FLOOR-S1>>> -->
1. **Nghĩ bằng brainstorming, KHÔNG hỏi-đáp với người** (ngoài đợt; trong đợt theo khối TRONG-DOT). Invoke `superpowers:brainstorming` để dựng phương án, nhưng câu brainstorm lẽ ra hỏi người thì máy tự trả lời từ ô cơ hội đã ký, câu giao của hàng lộ trình, luật kho (CLAUDE.md · AGENTS.md · CONTEXT.md · ADR) và vật đã có. Mỗi lựa chọn như vậy xếp theo **nguồn căn cứ** rồi thành MỘT dòng sổ S1 mang khoá `can_cu` (khuôn `DEC-CAN-CU-SLOT`, mục «Sổ quyết định»):
   - **mục tiêu + quy tắc đã khai** — trỏ được MỘT tệp có từ trước vòng (không phải vật của chính vòng; ô cơ hội đã ký thì được) và câu trích nguyên văn QUYẾT được lựa chọn → máy quyết;
   - **chỉ một lối ra sống** — các lối khác chết vì một ràng buộc nêu được → máy quyết, ghi lối khác chết vì sao;
   - **chỉ người có** — gu nhìn, nghĩa sản phẩm người dùng thấy, đánh đổi giá trị, khẩu vị rủi ro, sự kiện chỉ chủ kho biết, việc luật đòi người ký (CỘNG) → KHÔNG hỏi giữa chừng: soạn nháp theo khuyến nghị, ghi dòng dạng câu hỏi (khuyến nghị + lối khác + giá); dòng lên thẻ Cổng Phạm vi thành «Hỏi-n».

   Không trỏ được căn cứ thì là «chỉ người có», không phải «mục tiêu». Chạm khó-đảo (ship ra người dùng thật · xoá dữ liệu · cam kết ra ngoài kho) → luôn là câu hỏi, `kho_dao: true`, bất kể nguồn. KHÔNG dừng xin duyệt thiết kế, KHÔNG hỏi «làm ngay chứ?» hay «chọn A hay B?» giữa bước thiết kế — mỗi câu như vậy là một lượt gọi người ngoài thiết kế (đo 22/09–11/10: 28/51 lựa chọn chủ kho trả lời ở bước này có căn cứ máy đã có — hồ sơ `buoc-len-thiet-ke-khong-hoi`). Đề bài mơ hồ vẫn soạn nháp theo khuyến nghị; Cổng Phạm vi dừng chờ người theo bất biến dừng. **Điểm vũ trang `/goal` đầu tiên** là lời mời Cổng Đáng của ô — in kèm khối `GOAL-TEMPLATE` (thay `<slug>`) với một dòng «sau khi trả lời, dán luôn dòng này»; bước thiết kế không còn lượt người nào, và vòng mở từ một câu mô tả chạy S0 tới Cổng Phạm vi trong cùng lượt nên không cần vũ trang.
2. Nếu feature chạm ≥3 subsystem (DB / API / core layer / UI / integration) hoặc user yêu cầu → chạy Workflow fan-out Explore readers (ad-hoc script, pattern 'Understand') trước khi đề xuất approach. Mỗi reader truyền `model: 'haiku'` — đọc-và-tóm-tắt không cần model lớn (synthesize approach vẫn ở main loop).
3. **(CT-S — bước mặc định khi T2/T3)** Trong/ngay sau brainstorm: invoke skill `morphological-scan` (plugin acceptance-gate; preset theo bảng routing của skill — entity-feature / test-matrix / risk-premortem…) cho KHÔNG GIAN AC. Gắn output vào các artifact bước dưới: **Core** → ứng viên AC (cỡ theo khoảng của kit — khối `CAT-LUOT-CO` của skill cắt lượt: mục tiêu 8–10 · cho phép tới 12 · từ 13; Core vượt mục tiêu → hợp nhất ô thành một AC hoặc tách thành nhiều vòng, mỗi vòng một kết quả); **Later/Never** → `Out of scope` + entry `descope` (rule đáng-log áp bình thường); **Trục + thước CE** → section `## Coverage` của contract (GIỮ nhãn `[CE chưa kiểm chứng]` nếu có — card sẽ hiện cờ). Bài toán KHÔNG dạng liệt-kê-đủ (1 chiều, AC hiển nhiên, spec ngoài đã chốt scope) → BỎ quét bằng entry `descope` AUTO-DRAFT ("bỏ coverage-scan — <lý do 1 dòng>; đổi lại không có bằng chứng độ phủ") + Coverage = 1 dòng trỏ entry đó. CẤM bỏ không dấu vết.
4. Kết thúc brainstorm — 🎨 feature chạm UI: TRƯỚC khi sinh 3 artifact, đọc key `feature_loop.ui_standards_skill` trong `_acceptance/config.yaml` (giá trị = tên skill chuẩn-plugin/DS của repo tiêu thụ, vd `create-<org>-plugin`); key CÓ → BẮT BUỘC invoke skill đó ngay (đối trọng chuẩn nội đặt lên cùng bàn cân với vật liệu ngoài — retro V1 quy luật meta 1: model neo vào khối context mạnh nhất); key VẮNG → ghi chú đúng 1 dòng vào gói Gate 1 ("repo chưa khai `feature_loop.ui_standards_skill` — artifact UI không có đối trọng chuẩn nội"), KHÔNG chặn. Kế đó, VẪN TRƯỚC khi sinh 3 artifact: điền section `## Đặc tả UX` vào design-doc theo khuôn `ux-spec-template.md` của plugin acceptance-gate (resolve bằng `AGX=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require skills/acceptance/references/ux-spec-template.md)` rồi đọc `$AGX/skills/acceptance/references/ux-spec-template.md` — KHÔNG hardcode path cache; resolver exit khác 0 nghĩa là bản acceptance-gate đang cài CHƯA có khuôn → ghi đúng 1 dòng vào gói Cổng 1 («repo đang chạy bản acceptance-gate chưa có khuôn đặc tả UX») rồi ĐI TIẾP, KHÔNG dừng vòng), GIỮ NGUYÊN các marker; máy điền MỘT lượt, không gọi owner. Mục «Khuôn IA đã chọn + căn cứ»: máy KHÔNG tự chắc khuôn (≥2 khuôn khả dĩ) → tra mẫu theo thang 2 nấc của khuôn ((i) phiên có công cụ tra mẫu thị trường, vd MCP Mobbin → tra luồng cùng loại, ghi vết 1 dòng đã xem gì + rút gì; (ii) không có → chọn từ danh sách khuôn IA có tên, ghi lý do) — không phụ thuộc công cụ nào, luồng hiển nhiên không tra. Contract ghi `design_doc: <path design-doc>` trong frontmatter để người duyệt mở thẳng; GIỮ NGUYÊN các marker của khuôn (mỏ neo cho phép đo khớp vòng sẽ làm ở việc riêng — `docs/plans/2026-08-24-hat-giong-khop-vong-dac-ta-ux.md`). Vòng này KHÔNG có phép đo máy nào cho đặc tả UX: người duyệt soi nó tại Cổng 1 cùng ba artifact. Feature KHÔNG chạm UI → bỏ bằng entry `descope` AUTO-DRAFT với decision bắt đầu đúng chuỗi `"bỏ đặc-tả-UX — <lý do 1 dòng>"` + impact "cấu trúc không khai trước — owner thấy nó lần đầu trong code". Rồi sinh CÙNG LÚC từ một ngữ cảnh:
   - Design doc → `docs/superpowers/specs/YYYY-MM-DD-<slug>-design.md` (hoặc convention spec của repo)
   - `_acceptance/<slug>/contract.md` — theo template plugin acceptance-gate (frontmatter schema_version/feature/slug/risk_tier/surfaces/status: draft; AC Given/When/Then theo khoảng cỡ — khối `CAT-LUOT-CO`: mục tiêu 8–10 · cho phép tới 12 · từ 13 phải tách hoặc ghi dòng giữ (khối `DEC-GIU-CO`, S1#5), tag `(judgment)` cho business-judgment; section `## Coverage` từ bước CT-S; Out of scope ≥2 bullet; section `## Đường đo` khi hồ sơ có `opportunity.md` với ngưỡng đã khai (mỗi thước một dòng: số từ đâu · AC nào bảo đảm — đường đo là VẬT, code mới thì thành một AC); bỏ thì entry `descope` AUTO-DRAFT với decision bắt đầu đúng chuỗi `"bỏ đường-đo — <lý do 1 dòng>"` + impact "Cổng Giá trị sẽ đọc bảng ngưỡng với ô CHƯA ĐO — quyết release/iterate/kill mất căn cứ số")
   - `_acceptance/<slug>/evals.yaml` — map mỗi AC ≥1 eval; executor ưu tiên test > script > ui-check > judgment, chọn người chấm theo TỪNG VẾ chứ không theo Dấu của cả AC (vế một lệnh đọc được → script/test của kho đo TRẠNG THÁI cây · vế chỉ thấy trên màn đang chạy → ui-check · vế cần cân với ý định trên một tệp → judgment với đúng tệp đó trong `inputs` · vế không ai ở đây đọc được → khai giới hạn ngay lúc viết; luật đủ + ba bẫy của script luật kho: `eval-executors.md` «Pick the grader per clause»); hội đồng chỉ đọc đúng `inputs` — không diff, không lệnh — nên `question` hỏi diff của lượt hoặc bảo chạy lệnh thì `s4-args.mjs` từ chối sinh args (exit 2, nêu eval); cmd PHẢI là `config:` ref (vd `config:executors.test.api`), KHÔNG hardcode lệnh. Kế hoạch đo theo khuôn `MEASURE-BIRTH-CLAUSE` (khối ở S3): `expected` của mỗi eval máy phải khai được CHIỀU ĐỎ — cặp hai-chiều cùng fixture + thông điệp ghim. Mỗi eval máy/ui NÊN khai `paths: [<glob tương đối repo>]` = các file eval này THẬT SỰ kiểm — dùng cho carry-forward round delta (P1, Đợt 5); thiếu `paths` → eval LUÔN chạy lại (mặc định an toàn); criterion tag `(cross-layer)` → thêm ≥1 eval `layer: backend-effect` theo Pairing mechanics của eval-executors.md (ui-check một mình không bao giờ đủ cho criterion xuyên lớp); surface mặt người nhìn (`ui`, alias `web`/`web-ui`, không tính `mobile`) → ≥1 eval `ui-check` khai `layer: ui-observed` THEO HỢP ĐỒNG — test/script cho UI không trả nghĩa vụ này (luật gương của cross-layer, mục 2c của acceptance SKILL); bỏ → entry `descope` AUTO-DRAFT với decision bắt đầu đúng chuỗi `"bỏ ui-observed — <lý do 1 dòng>"` + impact "Cổng Bằng chứng không có frame — người ký đọc tên ca máy thay vì nhìn"
   - Cuối S1: append entry ledger cho approach/descope thỏa rule đáng-log (xem "Sổ quyết định") — mỗi dòng S1 mang khoá `can_cu` theo khuôn `DEC-CAN-CU-SLOT`.
5. **KHÔNG vào Gate 1 khi chưa đủ 3 artifact — và (CT-S) contract THIẾU section `## Coverage` (dù chỉ 1 dòng skip) cũng tính là chưa đủ.** (HARD-GATE của brainstorming và Gate 1A/1B của kit gộp thành MỘT Gate 1; dòng `/goal` in kèm lời mời Cổng Đáng và câu chỉ-người-biết của bước thiết kế KHÔNG phải một cổng — nó đi cùng câu trả lời, không thêm lượt. Sổ S1 còn câu chỉ-người-biết hoặc dòng đỏ — lệnh `AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/can-cu-s1.cjs) && node "$AG/scripts/can-cu-s1.cjs" --root . --slug <slug>` (kho tự host kit thêm `--root .` ngay sau `--plugin acceptance-gate`) in dòng tổng kết `<slug> · câu hỏi N · máy đã quyết M · đỏ K · …` với N > 0 hoặc K > 0 → Cổng Phạm vi dừng chờ người, không đi làn V. Đọc dòng tổng kết, KHÔNG đọc mã thoát: lệnh không in dòng tổng kết là bộ xếp không chạy được (thiếu gói, gói cũ, lỗi nạp) — trình nguyên văn thông điệp như một DỪNG-lỗi có tên, không gọi là sổ đỏ.) Ngược lại, đủ điều kiện rồi (3 artifact + Coverage + gap-probe đã định đoạt + cỡ hợp đồng không chặn + dòng tra tri thức không chặn) → render thẻ Gate 1 NGAY trong cùng lượt, không chèn câu hỏi trung gian nào trước đó.
   **Cỡ hợp đồng là điều kiện vào Gate 1 như Coverage** — máy đọc khoá dưới từ `gate-card.js --extract` (một bộ đọc với đồng hồ cỡ, khoảng từ khối `CAT-LUOT-CO`):
<!-- <<<CO-HOP-DONG-CHAN -->
   `khi: co_hop_dong.chan = true → lan_v: khong · moi_nguoi: khong · loi_ra: tach, giu`

   Khoá đúng (hợp đồng `draft` từ 13 tiêu chí, sổ chưa có dòng giữ) → CHƯA đủ điều kiện vào Gate 1: không đi làn V, không mời người. Máy TỰ gỡ trong cùng lượt rồi dựng lại thẻ: mặc định TÁCH (dời tiêu chí sang hạt giống hay vòng kế, ghi `descope` theo luật đáng-log); chỉ GIỮ khi kết quả không tách được mà giữ nghĩa — ghi đúng một dòng sổ theo khối `DEC-GIU-CO` dưới. 11–12 tiêu chí: thẻ cờ vàng, không chặn — giữ thì cũng ghi dòng ấy.
<!-- CO-HOP-DONG-CHAN>>> -->
   Dòng giữ: chạy khối `DEC-ID-RECIPE` (mục «Sổ quyết định») với dòng giữa là ĐÚNG khối dưới — `decision` mở đầu bằng chuỗi giữ mà thẻ đọc, ô `can_cu` theo khuôn `DEC-CAN-CU-SLOT` (`muc-tieu`, trỏ hợp đồng) (thẻ đỏ in nguyên văn chuỗi ấy); dòng không lý do không được tính.
<!-- <<<DEC-GIU-CO -->
```
"type":"approach","stage":"S1","at":"<ISO>","decision":"giữ cỡ — <vì sao kết quả không tách được mà giữ nghĩa, 1 câu>","why":"<căn cứ trỏ tệp hay mã AC, 1 câu>","cost_if_wrong":"<sai thì tốn gì, 1 câu>","can_cu":{"nguon":"muc-tieu","kho_dao":false,"tep":"_acceptance/<slug>/contract.md","trich":"<câu trích nguyên văn của kết quả không tách được, một dòng>"}
```
<!-- DEC-GIU-CO>>> -->
   **Dòng tra tri thức là điều kiện vào Gate 1 như cỡ hợp đồng** (kho khai `tri_thuc`) — máy đọc khoá dưới từ `gate-card.js --extract`:
<!-- <<<TRI-THUC-TRA-CHAN -->
   `khi: tri_thuc.chan = true → moi_nguoi: khong · lan_v: khong · loi_ra: tra`

   Khoá đúng (hồ sơ `draft` thiếu dòng tra, dòng tra bỏ sót trang mà dòng «Nguồn:» của ô đã nêu, hoặc dòng tra thiếu mảng `so`) → CHƯA đủ điều kiện vào Gate 1: không đi làn V, không mời người. Máy TỰ gỡ trong cùng lượt: chạy khối `TRI-THUC-TRA-MO-TA`, ghi dòng tra mới theo khuôn `DEC-TRI-THUC-TRA`, dựng lại thẻ. Đường trỏ sổ không có dòng: thẻ cờ vàng, không chặn. Trang lệch băm, đường trỏ sai khuôn, kho không đọc được ở máy: thẻ cờ vàng, không chặn.
<!-- TRI-THUC-TRA-CHAN>>> -->
6. 🎨 **(CT1)** static evals + dòng surface&state; MỌI feature chạm UI (CT1 hay không) đi nghi thức S1-D — xem đoạn "Nghi thức S1-D" ở mục Làn design. Feature chạm UI thì design-doc phải có section Đặc tả UX theo khuôn `ux-spec-template.md` (một nguồn — thay «dòng state-matrix» cũ, bảng trạng thái nay sống trong khuôn); THIẾU → nhắc bổ sung, KHÔNG dừng vòng.
7. **(CT-S — bước mặc định khi T2/T3) Phản biện context sạch (gap-probe), TRƯỚC khi render thẻ Gate 1 — dispatch ĐỒNG BỘ (chờ trong lượt, KHÔNG nền): kết quả về là render thẻ trong cùng lượt, đuôi S1 không còn chỗ để «báo rồi ngừng».** **Input thứ 5 — bài học xuyên feature (claim-scan):** trước khi dispatch, chạy `node "<WORKFLOWS_DIR>/../scripts/claim-scan.mjs" --root <repo-root> --slug <slug> > <scratch>/claims-<slug>.md`. Exit 0 và file CÓ nội dung → truyền file làm **input thứ 5** của critic. Corpus rỗng (file trống) → KHÔNG truyền input 5, không note (repo mới là bình thường). Scan exit ≠0 → probe VẪN chạy với 4 input như cũ, và khi ghi `gap-probe.md` thêm frontmatter `claims_input: failed` (1 dòng note trong gói Gate 1 — không chặn, không tính probe-failed). Rồi dispatch 1 subagent fresh (Agent tool; model = phiên, hoặc `feature_loop.models.critic` nếu config có). Input CHỈ 4 file: design doc + `contract.md` + `evals.yaml` + `decisions.jsonl` (ledger vắng → bỏ qua) — CỘNG file claims làm input thứ 5 khi bước claim-scan ở trên có claim, CỘNG `_acceptance/<slug>/opportunity.md` làm input thứ 6 khi file tồn tại (để cross-check ngưỡng ↔ đường đo); ngoài các file đó CẤM đưa hội thoại brainstorm, CẤM bảo agent đọc code repo (critic phán artifact, không audit code — code chưa tồn tại). Prompt giữ đủ 7 ý: (1) giả định sẵn CÓ thiếu sót — "liệt kê điều thiếu sót trong bộ artifact này, xếp theo độ nặng"; (2) scope guard: CHỈ lỗ hổng làm chính feature này fail acceptance hoặc làm Gate 1 duyệt sai — không wishlist/feature mới; (3) mỗi finding đủ 4 trường: artifact (design|contract|evals) · kịch bản fail cụ thể · severity P0/P1/P2 · thước đo đề xuất — thiếu kịch bản fail = LOẠI; (4) cross-check bắt buộc: AC nào không có eval đo · GWT nào không đo được · trục Coverage nào không có AC · criterion nào When/Then đi qua backend mà THIẾU tag (cross-layer) hoặc chỉ có eval lớp UI (ui-check/judgment) · hợp đồng có mặt người nhìn mà không eval `ui-check` nào (bằng chứng lớp mã thay lớp nhìn-thấy) · eval judgment nào hỏi điều không nằm trong tệp của chính nó — diff của lượt, kết quả một lệnh, tệp ngoài `inputs` (sự thật nền: hội đồng chỉ đọc đúng `inputs`, không diff, không lệnh; vế kiểm được bằng lệnh thuộc về eval script/test của kho) · artifact có tuân chuẩn UI/plugin sẵn có của repo tiêu thụ không; skill/quy định nào của repo LẼ RA phải nạp mà chưa nạp; ngưỡng nào ở `opportunity.md` không có đường đo nào trong contract (section `## Đường đo` hoặc entry bỏ có tên); và LỚP ĐO-LƯỜNG (matrix-measure-law — trả lời các câu này từ field `expected` của evals.yaml + design doc, tức KẾ HOẠCH phép đo; không cần code, code chưa tồn tại): mỗi eval tuyên quét LỚP có ma trận toàn phần viết-trước không (số assert = số phần tử) · assertion âm tính nào thiếu đối chứng dương hoặc không ghim thông điệp · fixture nào viết tay đúng khuôn bên đọc · fixture nào (kể cả code-sinh) tự dựng đúng khuôn bên đọc mà không round-trip rút-từ-writer-thật · assert nào đo chuỗi-có-mặt trong khi lời hứa là quan hệ · eval nào đo CHỈ DẪN/tài liệu hướng dẫn thay vì ĐẦU RA thật của code · đường dẫn nào trong phép đo/script sinh fixture hardcode ROOT thay vì suy từ vị trí script; và CĂN CỨ CỦA MÁY (hồ sơ buoc-len-thiet-ke-khong-hoi): với MỌI dòng sổ S1 máy đã quyết — lựa chọn có chạm ship ra người dùng thật, xoá dữ liệu hay cam kết ra ngoài kho mà `kho_dao` ghi false không · nguồn mục-tiêu: câu trích có QUYẾT lựa chọn hay chỉ liên quan · nguồn một-lối: lối khác có thật chết vì ràng buộc nêu được không · có lựa chọn «chỉ người có» nào trong design/contract mà sổ ghi máy quyết hoặc không ghi · có lựa chọn nào trái một luật trong `PRODUCT-INVARIANTS.md` đã nạp mà sổ không ghi `pham_luat` — mỗi chỗ là P0, xử lý bằng một dòng S1 mới mang `supersedes` (thường thành câu hỏi); (5) cap 5 finding; verdict `clean` (không còn lỗ đáng kể) là kết quả HỢP LỆ; (6) KHÔNG lật quyết định đã seal/`descope` trong ledger trừ khi nêu được lý do MỚI; (7) nếu có input thứ 5 (bài học từ feature trước): các claim là ADVISORY — không phải luật của feature này, KHÔNG dùng claim để lật quyết định đã seal/`descope` trong ledger của feature đang xét; finding nào dựa trên một claim PHẢI cite `[<id>]` nguyên văn (vd `[d-20260728T154945Z-3400]`, `[s4-scope-triage#F2]`) trong cột Thiếu gì hoặc Kịch bản fail — id là đường đo việc dùng lại bài học. Ghi `_acceptance/<slug>/gap-probe.md` — frontmatter `slug / at (ISO UTC) / verdict: clean|findings|probe-failed / p0 / p1 / p2` + section `## Findings` bảng `| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |` (cell không chứa `|`; `clean` → 1 dòng "Không còn lỗ đáng kể") — rồi ĐỊNH ĐOẠT từng finding, điền cột Xử lý: **P0 = sửa artifact ngay HOẶC `human-gate1` (đẩy human quyết ở Gate 1) — không im lặng**; P1/P2 = `fixed: <gì>` | `deferred: <ghi chú>` (entry `revisit` nếu thỏa rule đáng-log) | `rejected: <lý do 1 dòng>`. Sửa xong artifact KHÔNG re-probe (one-pass) — phần code đã có 3 round S4. Agent lỗi → retry 1; vẫn lỗi → ghi file `verdict: probe-failed` (thẻ cờ vàng, không chặn gate). User chủ động bỏ bước → entry `descope` AUTO-DRAFT với decision bắt đầu đúng chuỗi `"bỏ gap-probe — <lý do 1 dòng>"` (quy ước máy-đọc cho card/resume) + impact "đổi lại không có phản biện context sạch trước duyệt", KHÔNG tạo file.

## GATE 1 (human — điểm dừng 1)

**BƯỚC MẶC ĐỊNH — render thẻ quyết định TRƯỚC:** invoke `/acceptance-gate:acceptance-card <slug>` (tự nhận Cổng 1 từ contract.status) — trình "sẽ làm / sẽ KHÔNG làm" + cờ phủ-biên bằng ngôn ngữ sản phẩm thay vì YAML thô — RỒI hỏi đúng 1 câu: duyệt / sửa gì. Mời cổng như đồng nghiệp hỏi: một câu hỏi đóng, nói ngả máy khuyên và vì sao, kèm ĐÚNG MỘT dòng lệnh máy đã điền sẵn mọi ô có khuyến nghị — người chỉ gõ chữ quyết định hoặc sửa ô mình nghĩ khác, rồi máy nói mình làm gì tiếp; máy không viết sẵn CHỮ QUYẾT của người và không hỏi phút. Kết lượt chờ người bằng chữ thường, không qua nút: lượt có trang thẻ (`card.html`; Cổng Bằng chứng thêm `evidence-page.html`) thì gửi trang ấy bằng công cụ gửi tệp của phiên (`SendUserFile`), phiên không có công cụ ấy thì in đường dẫn trang; dòng lệnh hay dòng trả lời mẫu nằm trong một khối `` ```text ``, chép đúng như thẻ in — ô thẻ để `___` thì giữ `___`, máy không tự điền chữ quyết; hộp «bước kế» của app (`wrap_up`) ở lượt này chỉ mang phần tóm tắt, không câu hỏi và không nút, vì app bỏ nút mở đầu «/» hay «!» hoặc chứa «@», cắt tin của nút ở 300 ký tự, và bỏ nút khuyến nghị thì mất luôn câu hỏi. Đính kèm gói text đầy đủ để user soi sâu khi cần: tóm tắt design (≤10 dòng) + contract.md NGUYÊN VĂN + bảng mapping AC → eval → executor. Thẻ Cổng 1 nay gồm khối "Phản biện context sạch" (findings + xử lý từ gap-probe.md; vắng file / probe-failed → cờ vàng — không chặn, nhưng phải hiện). Thẻ chỉ là lớp trình bày — contract/evals vẫn là nguồn-sự-thật, quyết định vẫn vào `approved_by`. Feature chạm UI: trình kèm thẻ BẢN BẤM ĐƯỢC (URL/proto từ nghi thức S1-D design-pass) — không duyệt UI bằng chữ; nếu S1 có ghi chú vắng `feature_loop.ui_standards_skill` thì dòng đó phải nằm trong gói. (Lệnh/script `/acceptance-gate:acceptance-card` không có → cài/cập nhật plugin acceptance-gate, hoặc tạm trình gói text.) Cổng dừng chờ người: chạy khối «Hình tại điểm quyết định» ở cuối mục này TRƯỚC khi render thẻ — thẻ và hình đi cùng nhau.

🎨 User chủ động bỏ design-pass ở nghi thức S1-D → entry `descope` trong sổ quyết định là dấu vết hiện (thay marker `design_subtrack: skipped-by-user` cũ — workspace cũ còn marker thì vẫn đọc được, không lỗi).

Khi duyệt: set contract `status: approved`, `approved_by`, `approved_at` (ISO); append seal entry vào decisions.jsonl (xem "Sổ quyết định"). **KHÔNG hỏi số phút** — kit thôi đo phút người; vế `, phút <số>` người quen tay gõ thì chấp nhận và bỏ qua lặng. Commit design doc + contract + evals. **LUÔN IN gợi ý `/goal` — bắt buộc, không chờ user hỏi** (đây là cơ chế duy nhất để đoạn S2→S4 chạy không-người-trông; bỏ qua nó là nguyên nhân số 1 của "loop không tự loop" — findings 2026-07-26): IN NGUYÊN VĂN khối GOAL-TEMPLATE ngay dưới đây, thay `<slug>` bằng slug thật — CHỈ in gợi ý (slash command là của user, không tự đặt); TUYỆT ĐỐI không gợi ý goal tới `signed-off` (hook chặn chữ ký máy → spin vô hạn). Kèm theo: nếu phiên đang chạy model đắt hơn mức đoạn máy cần (vd tier thiết kế), in thêm gợi ý `/model opus` + `/effort high` TRƯỚC dòng /goal — alias `opus` tự trỏ bản mới nhất của tier (KHÔNG ghim model ID có số version kẻo lỗi thời), effort high giữ chất lượng đoạn máy; S3 tuần tự + điều phối S4 chạy model phiên nên đổi ca ở Gate 1 là điểm rẻ nhất (GUIDE mục "Model theo giai đoạn"); KHÔNG tự đổi model (là lệnh của user).

<!-- <<<GOAL-TEMPLATE -->
```
/goal Feature <slug>: coi là HOÀN THÀNH chỉ khi transcript cho thấy phiên chính
đã trình thẻ Cổng Bằng chứng của vòng <slug>, hoặc (làn V) đã mở PR ở S5, hoặc đã dừng
ở một cổng có tên — Cổng Phạm vi, Gate 1.5, trần 3 round, dừng-vá, DỪNG-lỗi có tên.
Lượt BLOCKED vì hạ tầng chưa thử lại cùng round = CHƯA hoàn thành: máy thử lại, không hỏi.
Chỉ neo vào việc phiên đã trình trong transcript, không neo vào trạng thái tệp. Hoặc dừng
sau 15 turns.
```
<!-- GOAL-TEMPLATE>>> -->

(Khối trên là bản runtime — bản người-đọc kèm giải thích nằm ở GUIDE mục /goal, bản thứ ba là hằng trong `scripts/gate-card.js` để thẻ Cổng 1 in dòng goal; ba bản được test P85 giữ khớp (so sau strip, 6 dòng). Dán thành 1 dòng khi dùng; xuống dòng chỉ để dễ đọc.)

### Hình tại điểm quyết định

Điểm quyết định vượt ngưỡng N5 thì kèm hình; chọn cách vẽ bằng bảng tra `DECISION-DIAGRAM-SURFACES` theo mặt phẳng đang trình, và kiểm lại bằng phép thử nhìn-thấy-hình.

Năm bước dưới đây chạy TRƯỚC `/acceptance-gate:acceptance-card`, và CHỈ khi cổng thật sự dừng chờ người — T3, hoặc T2 không đủ điều kiện đi tiếp ở trạng thái V.

T2 xanh-sạch đi tiếp thì bỏ qua cả năm bước — hình không ai đọc là giờ-kit vứt đi.

Resume vào `draft` mà workspace đã có `figures/` → dùng lại, không vẽ lại.

- **[1] Kê** điểm quyết định — máy kê từ artifact cuối S1, không hỏi người: mỗi entry sổ quyết định chờ seal · mỗi chỗ design lệch spec/plan gốc đã có · mỗi dòng `[GIẢ ĐỊNH]` trong Coverage · mỗi finding gap-probe xử lý `human-gate1`. Không kê AC/GWT từng dòng — AC là bằng chứng của quyết định, không phải quyết định.
- **[2] Đếm** ngưỡng N5 từng điểm: từ ba bước nối tiếp hoặc từ hai nhánh rẽ → «cần hình» + đề bài ≤5 dòng (loại hình · nút · nhãn bằng chữ · AC liên quan); ngược lại → «dưới ngưỡng: <đếm>». Ghi kết quả xuống `_acceptance/<slug>/figures/index.md` (bảng `| Điểm | Đếm | Hình |` + đề bài từng hình) — chỗ máy hết đường quên, và là đầu vào của bước vẽ; file là vật docs của hồ sơ đi cùng commit, thẻ không đọc nó.
- **[3] Vẽ** — vòng chính KHÔNG tự vẽ: dispatch subagent tươi (Agent tool; một agent một hình, hoặc một agent cả bộ khi ít hình) đọc `figures/index.md` + design doc + contract TỪ ĐĨA, dùng skill `diagram-design` (plugin thứ ba của marketplace, kit ≥ 2.1.0), đầu ra `_acceptance/<slug>/figures/<tên>.html` + `.png` cạnh nguồn (skill `export-diagram`). Feature chạm UI: hình luồng/màn vẽ TỪ section Đặc tả UX của design-doc (hình là chiếu của khuôn, không vẽ tay). Nếu skill vắng → không chặn: vẽ khối mermaid vào design doc (mặt phẳng «tài liệu trong kho») + một dòng trong tin mời cổng «bộ khuôn vẽ chưa cài — hình ở dạng mermaid trong design doc».
- **[4] Nhìn** — vòng chính Read bản `.png` của từng hình: đây là phép thử nhìn-thấy-hình đúng nghĩa, không phải đọc mã nguồn hình. Hình hỏng (chữ đè, nút thiếu, lệch nguồn) → trả về bước vẽ kèm ghi chú, tối đa MỘT lần; vẫn hỏng → đính kèm cờ «hình <tên> chưa đạt», không chặn cổng.
- **[5] Đính** — gửi `card.html` và các hình trong CÙNG một lượt bằng công cụ gửi tệp của phiên (`SendUserFile`) (mặt phẳng panel → «trang HTML gửi kèm» theo bảng tra); tin mời cổng vẫn theo điều khoản mời-cổng (một câu hỏi đóng), mỗi hình 1–3 dòng chú thích gắn tên quyết định; điểm dưới ngưỡng hiện đúng số đếm; 0 điểm vượt → nói đúng một dòng. Không có đường im lặng.

## S2 — PLAN

1. Invoke `superpowers:writing-plans` → `docs/superpowers/plans/YYYY-MM-DD-<slug>.md`.
2. Mỗi task PHẢI ghi: Files / verify command per-task / evals nó phục vụ (vd "phục vụ E1, E3") / cờ `independent: true|false` so với các task khác.
3. **Trình cho người bằng tiếng sản phẩm — áp cho MỌI lần trình, không riêng T3.** Nạp bản luật TRƯỚC khi viết: `node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require skills/acceptance/references/human-facing-language.md` rồi đọc `<kết quả>/skills/acceptance/references/human-facing-language.md`. Gói feature-loop KHÔNG chứa bản luật nên ghép thẳng gốc gói là con trỏ chết — luôn đi qua bộ giải. Mọi lần trình kế hoạch hoặc tiến độ cho người dùng khuôn `PLAN-SUMMARY-TABLE-TEMPLATE` trong file đó. Điểm quyết định vượt ngưỡng N5 thì kèm hình; chọn cách vẽ bằng bảng tra `DECISION-DIAGRAM-SURFACES` theo mặt phẳng đang trình, và kiểm lại bằng phép thử nhìn-thấy-hình. **T3: GATE 1.5** — trình tóm tắt plan (task list + files + thứ tự) theo đúng khuôn đó, chờ duyệt — kèm dòng `/goal` (khối GOAL-TEMPLATE, thay `<slug>`) để người dán cùng câu duyệt: goal đã kết ở Cổng 1 (khuôn coi dừng ở một cổng có tên là hoàn thành), S3→S4 cần vũ trang lại; kết lượt theo điều khoản kết-lượt-cổng (mục GATE 1). T2: đi tiếp luôn, không dừng.
4. Cuối S2: append entry ledger cho lựa chọn load-bearing (nếu có). Xong → vào S3 NGAY, không hỏi.

## S3 — EXECUTE

1. Mặc định: thực thi plan TUẦN TỰ trong main loop (theo `superpowers:executing-plans` hoặc subagent-driven nếu đang theo skill đó). Quy ước verify của repo (CLAUDE.md) THẮNG default của skill con nếu xung đột (vd repo cấm test framework → verify per-task = build/typecheck/smoke của repo). Buộc đổi hướng so với plan giữa chừng (plan không khớp thực tế) → append ngay 1 entry `fix`/`descope` vào decisions.jsonl (xem "Sổ quyết định") — đây là entry provisional, card Gate 2 sẽ trình để phê. Ruling mà superpowers ghi vào `.superpowers/sdd/<plan>/progress.md` được gặt vào sổ tự động bởi hook `ruling-truoc-khi-xoa` trước khi thư mục đó bị xoá; harness không chạy hook thì chạy tay `node <acceptance-gate>/scripts/cau-noi-ruling.mjs --root . --workspace .superpowers/sdd/<plan> --write` trước khi xoá.
   <!-- <<<MEASURE-BIRTH-CLAUSE -->
   **Một phép đo MỚI (case suite, eval trong evals.yaml, rule/check trong
   script) chỉ được tính XONG khi đi kèm cặp case hai-chiều trên CÙNG một
   fixture:** vật lành → thước xanh (đối chứng dương), phá vật thật trong bản
   sao → thước đỏ với THÔNG ĐIỆP GHIM (tên mốc/case/bất biến — không chỉ exit
   code). Thiếu cặp = task CHƯA XONG — verify per-task của task đó phải chứa
   lượt phá-thử. Khuôn đầy đủ + mẫu sống: `references/measure-birth.md` của
   gói acceptance-gate (nạp qua resolve-plugin.mjs). Vì sao: màu xanh của một
   phép đo chưa-từng-đỏ không phân biệt được "vật lành" với "thước chưa bao
   giờ chạy" — fixture hỏng, cp lỗi, exit 127 đều cho cùng một màu xanh.
   <!-- MBC-CORE: pair-same-fixture + pinned-message + not-done-without-pair; objects: suite-case, eval, rule-script -->
   <!-- MEASURE-BIRTH-CLAUSE>>> -->
2. Plan có ≥2 task `independent: true` → gom các task đó, invoke Workflow:
   `Workflow({ scriptPath: '<WORKFLOWS_DIR>/execute-parallel.js', args: { planPath: '<abs plan path>', repoRoot: '<abs repo root>', tasks: [{ id, title, summary, files, verifyCmd }], models: <feature_loop.models nếu có, như S4> } })` (WORKFLOWS_DIR xem ghi chú đầu file; script chỉ dùng `models.executor` — default kế thừa model phiên)
   Xong: merge các branch worktree về feature branch (task failed → tự fix tuần tự trong main loop). Ngay khi Workflow trả về: chạy usage report (xem "Đo model/token per run").
3. Kết thúc S3 (mọi task xong + verify per-task pass): set contract `status: implemented`, rồi **dispatch Workflow S4 NGAY trong cùng lượt**. KHÔNG tự chạy evals trong main loop — nhưng cũng KHÔNG dừng chờ người ở ranh giới này: doer ≠ grader được thoả bởi agent TƯƠI của Workflow S4, không phải bởi một lượt hỏi người.

## S4 — VERIFY (một Workflow run)

1. Chuẩn bị args — **MỘT lệnh, máy sinh trọn tệp** (script chạy NGOÀI workflow vì workflow không có filesystem; bản soạn-tay-theo-văn-xuôi là lớp lỗi có đo — hồ sơ cham-dung-cay-dung-cho-dung, điều tra 29/08):

   `node "$WORKFLOWS_DIR/../scripts/s4-args.mjs" --slug <slug> --root <repo-root> --out <ws>/s4-args.json`

   Round ≥ 2 PHẢI khai đường carry tường minh («quên» = script exit 2, không phải trạng thái lặng): thêm `--carry-anchor <sha>` (round delta: `verified_commit` cũ từ Staleness guard; round fix: `sha` dòng run-log round trước) để script tính carry, hoặc `--no-carry` khi cố ý full re-run.
   Script tự làm trọn các việc từng phải soạn tay, fail-CLOSED từng phần (thiếu/ref hỏng → exit ≠ 0 ghim tên, KHÔNG sinh tệp, không đoán): resolve `config:` ref và GIỮ `ref` gốc trên từng eval (hook L2 đối chiếu `verifier:` bằng ref, không nhận lệnh resolved) · `suiteCommands` từ `feature_loop.suite_keys` · `inputs` judgment tính từ GỐC KHO (cùng gốc với `paths`) → abs path, input vắng trên đĩa hoặc là thư mục → exit 2 gọi tên file, không sinh tệp; riêng `_acceptance/<slug>/evidence/**` của chính hồ sơ được phép chưa có (ui-check sinh trong lúc chấm) — giải kèm một dòng khai, vắng lúc chấm thì hội đồng UNCERTAIN · resolve plugin acceptance-gate qua `resolve-plugin.mjs` (KHÔNG glob cache — `ls` sắp theo CHỮ nên "bản mới nhất" chọn nhầm bản cũ) với `--require skills/acceptance/references/judge-personas.md --require skills/acceptance/references/evidence-report-template.md --require skills/acceptance/references/tool-kill-rule.md`, rồi đọc **`toolKillRule` NGUYÊN VĂN** từ file nguồn (nguồn DUY NHẤT của luật «lệnh bị công cụ ngắt ≠ lệnh fail»; workflow tự rút khối marker, thiếu → BLOCKED `(args)` có tên) · `riskTier` từ contract frontmatter · `diffBase` = merge-base với nhánh chính (detect remote → fallback main/master/develop/trunk) · `contractPath` cho scope-triage · `invokedAt`/`invokedSha` · `round` đếm từ `## Iterations` (đếm không được → exit ≠ 0, chống mint trùng run_id) · carry P1 (tự gọi `carry-plan.mjs` — đủ ma trận paths-vs-delta + atomic-pair `(cross-layer)`; suite LUÔN chạy lại) · P2 (`evalsHash`, baseline-once theo dòng `kind:"baseline"`) · P3 (`inputsHash` per judgment, panel memo theo dòng `kind:"panel"`) · `models` từ `feature_loop.models` nếu có. Chuỗi lệnh trong tệp giữ SẠCH — ghim chỗ đứng là việc của từng LANE trong workflow (verifier `cd <repoRoot> && …`, baseline `cd "$WT" && …`), KHÔNG nướng `cd` vào args.
   - Repo tự-host kit (kit là nguồn plugin) → thêm `--ag-root <repo-root>`. Nhánh chính không detect được → script exit có tên, truyền `--diff-base <ref>` tường minh; KHÔNG để `git merge-base` fail mờ.
   - Repo có skill review invariant riêng (vd `.claude/skills/<review-skill>/SKILL.md`) → sau khi đọc tệp args, thêm field `reviewSkillPath` (abs path) vào object trước khi invoke; không có → bỏ qua, workflow tự review theo conventions.
   - `config.yaml` thiếu `feature_loop.suite_keys` → script exit 2 có tên. Hỏi user MỘT lần: liệt kê key đang có trong `executors.*`, user chọn lệnh chạy mỗi round → GHI **bằng script splice chung, KHÔNG tự edit tay**: `node <acceptance-gate-plugin-root>/scripts/config-patch.mjs --config _acceptance/config.yaml --key feature_loop.suite_keys --value "[<key1>, <key2>]" --write`, rồi chạy lại s4-args (lần sau không hỏi lại). KHÔNG đoán theo Node convention, KHÔNG tự lấy toàn bộ `executors.*` — itest của feature KHÁC có thể flaky đốt round.
   - Round fix có carry → danh sách eval carried phải nằm RÕ trong báo cáo user + gói Cổng 2, kèm lý do từng eval (luật minh bạch ở bước "Mọi verdict").
   <!-- <<<S4-ARGS-CLAUSE -->
   **Script sinh-args lỗi (exit ≠ 0) → DỪNG, trình người NGUYÊN VĂN thông điệp
   của script. TUYỆT ĐỐI KHÔNG rơi về soạn args bằng tay theo trí nhớ hay văn
   xuôi** — args soạn tay chính là lớp lỗi vòng này đóng (agent giải nhầm chỗ
   đứng, trường chép sót, carry bị quên); ca script chưa phủ là việc sửa
   SCRIPT trong một vòng mới, không phải đường tay lặng lẽ.
   <!-- S4-ARGS-CLAUSE>>> -->
   <!-- <<<S4-ARGS-FRESHNESS -->
   **Tệp args có hạn dùng theo cây:** tệp do `s4-args.mjs` sinh mang
   `generated_sha`; TRƯỚC khi invoke Workflow, so `git rev-parse HEAD` với
   `generated_sha` — HEAD khác nghĩa là cây đã đổi sau khi sinh: SINH LẠI tệp
   args rồi mới invoke, KHÔNG dùng tệp cũ (args trỏ cây cũ là bằng chứng neo
   sai cây — lớp lỗi verify-trước-commit).
   <!-- S4-ARGS-FRESHNESS>>> -->
2. Invoke: `Workflow({ scriptPath: '<WORKFLOWS_DIR>/acceptance-verify.js', args: { slug, round, riskTier, evals, suiteCommands, diffBase, repoRoot, personasPath, templatePath, toolKillRule, contractPath, reviewSkillPath?, invokedAt, invokedSha, carriedEvals?, carriedPanels?, runBaseline?, carriedAnalyst?, evalsHash?, vungVat?, ngoaiVatGlobs?, carriedFindings?, evalsChayRieng? } })` (debug fan-out không tốn agent: thêm `dryRun: true` → trả về distinctCommands/judgePanels + carried plan + `finders` (lane THẬT SỰ chạy lượt này) + `vungVat`, không chạy gì).
3. Routing theo verdict trả về:
   - `REJECT` → quay S3 fix `failedEvals` + `failedCommands` + **`rejectFindings`** (findings TRONG hợp đồng — máy chỉ sửa cái contract đã bao). **`triaged` có mục `inContract: false` → TUYỆT ĐỐI KHÔNG sửa trong round này**: đó là lỗi thật nhưng ngoài phạm vi đã duyệt, nó đi Gate 2 cho người quyết. Sửa nó ở đây chính là vòng xoáy mà scope-triage sinh ra để chặn — mỗi bản vá trong vùng-không-đặc-tả lại đẻ ra lựa chọn không-đặc-tả mới. Fix xong → dispatch S4 round mới (round + 1) NGAY, không hỏi giữa chừng — vòng REJECT→fix→round kế là TỰ ĐỘNG. **Panel judgment có vote FAIL/UNCERTAIN (judge-required-evidence):** bước ĐẦU của round fix là đọc `required_evidence` từ dòng `kind:panel` trong run-log (hoặc block judgment của report) và bổ sung ĐÚNG bằng chứng được nêu — CẤM đoán-mò nguyên nhân judgment khi danh sách tồn tại; vote mang dấu "(judge không nêu bằng-chứng-thiếu)" thì báo user dấu đó trong gói kế tiếp. Trước khi rời S3-fix: append entry `fix` (`stage:"S4-r<N>"`).
     <!-- <<<STOP-PATCHING-CLAUSE -->
     **Trước khi dispatch vòng kế: so lớp lỗi vòng này với vòng trước.** Vòng
     sửa thứ HAI vẫn sinh lỗi CÙNG LỚP với vòng một ⇒ **khuôn giải sai**, không
     phải chi tiết sai. DỪNG — KHÔNG tự dispatch vòng ba. Trình người ba đường:
     **đổi khuôn** · **thu phạm vi** · **ship với giới hạn đã biết**; vá tiếp là
     đường người phải chọn tường minh, không phải mặc định. "Cùng lớp" = cùng
     TÊN LỚP LỖI trong sổ lớp lỗi (đo-chuỗi-thay-quan-hệ, hạ-thước, fail-open,
     đếm-rồi-vứt, hằng-đúng, assertion-âm-tính-một-mình…), KHÔNG phải cùng dòng
     mã hay cùng phép đo — hai lỗi ở hai file khác nhau vẫn là cùng lớp nếu
     cùng tên, và hai lỗi trên cùng một dòng vẫn là khác lớp nếu khác tên.
     <!-- STOP-PATCHING-CLAUSE>>> -->

     **«Ship với giới hạn đã biết» = thu phạm vi có tên** (đưa tiêu chí ra Known limits, ký lại
     Cổng Phạm vi) — KHÔNG phải ký trên báo cáo REJECT/BLOCKED: báo cáo ấy không ký được.

     **Tối đa 3 round** — quá → DỪNG, escalate user kèm phân tích từng round. `result.report` rỗng ở round REJECT → cảnh báo user lịch sử Iterations của round này không được ghi (vẫn PHẢI ghi report/findings từ result như bước "Mọi verdict" nếu có nội dung).
     <!-- <<<TRAN-LUOT-LOI-RA -->
     **Mời ở trần lượt và ở dừng-vá bằng khối «Lối ra» của thẻ — không tự soạn lời mời.** Ở hai
     điểm dừng này phiên ghi report + run-log như mọi verdict, chạy `thuoc-vat.mjs --write`, rồi
     render thẻ Cổng Bằng chứng (`/acceptance-gate:acceptance-card <slug>`): thẻ CHƯA-ký-được tự
     in khối «Lối ra» — các lượt đã chấm kèm phút máy, eval chưa đạt lặp lại, ba lối có giá (thu
     phạm vi · chấm thêm một lượt · dừng vòng) và lối máy khuyên. Tin mời chép ĐÚNG ba lối và lối
     khuyên của khối; không thêm lối, không đổi khuyến nghị, không mời ký — báo cáo REJECT/BLOCKED
     không ký được, nên một lối «ký ngay» là lối chết. Được thêm tối đa ba dòng phân tích từng
     lượt. Thẻ không in khối (bản acceptance-gate cũ) → một dòng báo điều đó rồi mời bằng đúng ba
     lối ấy, giá ghi «chưa đo».
     <!-- TRAN-LUOT-LOI-RA>>> -->
   - `BLOCKED` → đọc `blocked[].cmd` + `blocked[].reason` từ kết quả, trình NGUYÊN VĂN cho user (một dòng báo, không phải câu hỏi) rồi khắc phục nguyên nhân và chạy lại — KHÔNG tự chọn số round: `s4-args` đánh số. Lượt mà mọi mục chặn mang nhãn hạ tầng (`chet`/`mu` của `lib/nhan-canh-gay.cjs`) và không có finding trong hợp đồng thì `s4-args` ra CÙNG round — lượt ấy không đếm vào trần, và chỉ thử lại MỘT lần (khối ĐỊNH VỊ, K8). Lượt BLOCKED còn finding trong hợp đồng (`rejectFindings`) là REJECT về bản chất: sửa như REJECT rồi chấm round kế — round ấy đếm. Đã thử lại một lần mà vẫn chặn vì hạ tầng (`s4-args` in một dòng báo) → ghi run-log + báo cáo như mọi verdict rồi trình thẻ Cổng Bằng chứng (cạnh gãy, ô ký trên cạnh gãy) — không hỏi thêm, không tự tung lượt thứ ba. Không bao giờ downgrade BLOCKED thành pass.
     <!-- <<<CLASSIFIER-FALLBACK -->
     **Lượt bị chặn VÌ BỘ PHÂN LOẠI thì lượt kế ĐỔI ĐƯỜNG, không tung bầy lại.**
     Dấu hiệu nằm ở `blocked[].reason`, HAI hình dạng — đừng chỉ đợi hình dạng thứ
     nhất: (1) reason nhắc thẳng classifier / rate-limit / safety — agent còn sống
     nên tự thuật được lý do; (2) reason là câu CỐ ĐỊNH engine phát khi agent không
     trả kết quả — `agent bi skip/chet` — dính từ HAI lệnh trở lên. Hình dạng (2)
     nặng hơn và im hơn: agent chết thì không còn ai thuật lại, nên chữ «classifier»
     sẽ KHÔNG xuất hiện; bầy chết hàng loạt ở kho này đo được nguyên nhân là bộ phân
     loại. Phân biệt với BLOCKED do nguyên nhân khác — args sai, thiếu file luật,
     evals khai thiếu — vì các ca đó engine phát reason RIÊNG nêu đích danh vật
     hỏng. Gặp một trong hai dấu hiệu thì lượt kế PHẢI đi **verify độc lập, lệnh
     chạy TUẦN TỰ** — một phiên tươi làm lần lượt từng lệnh (skill `acceptance`
     Phase 3) — và **KHÔNG dispatch lại fan-out**. Vì sao: xác suất một vòng fan-out
     sống là pⁿ với n agent cần Bash, nên tung bầy lại chỉ đổi lượt trúng đạn chứ
     không đổi kết cục. Đã chứng 2/2 ở kho này: chip A vòng 4 thông ngay sau ba vòng
     chặn; chip B đi tuần tự từ đầu, 0 vòng chặn. Sổ cái đầy đủ:
     `docs/findings/2026-08-25-retro-classifier-va-nghi-thuc-khong-hoc.md`.
     <!-- CLASSIFIER-FALLBACK>>> -->
   - `PASS` / `PENDING-JUDGMENT` → kiểm tra `result.report` có nội dung (synthesize agent có thể chết); rỗng → chạy lại S4 cùng round. Có → làm ĐÚNG THỨ TỰ: (1) append `result.runLog` vào run-log.jsonl, (2) Write `_acceptance/<slug>/evidence-report.md` = `result.report` rồi `review-findings.md` = `result.findings` — log phải nằm trên đĩa TRƯỚC report vì hook L2 đối chiếu run_id trong report với log, ghi ngược thứ tự là hook chặn oan; (3) set contract `status: verified`, chạy khối DINH-TUYEN-MAY — rồi **COMMIT NGAY gói evidence máy-viết** (evidence-report.md + run-log.jsonl + contract + evidence/ + usage-report.md nếu có, + decisions.jsonl khi khối vừa ghi) TRƯỚC khi vào Gate 2 — commit sớm để tránh dính stale-guard (không còn bắt tách khỏi chữ ký: ADR 0012). → Gate 2. `reviewIncomplete` không rỗng → ghi cảnh báo vào gói Gate 2.
   - **Mọi verdict:** main loop LUÔN là người ghi (không còn agent scribe/ghi-file): append từng dòng `result.runLog` (nguyên văn, mỗi phần tử 1 dòng) vào `_acceptance/<slug>/run-log.jsonl` TRƯỚC, rồi Write evidence-report.md = `result.report` và review-findings.md = `result.findings` — hook + CI đối chiếu run_id trong report với log này; ghi report trước log là PASS bị chặn oan ở recheck strict. Kết quả có `carried` không rỗng (Đợt 5) → khi báo user VÀ trong gói Gate 2 ghi RÕ round này carry gì: evals (P1), panels (P3), baseline (P2), findings ngoài hợp đồng (T5 — mục mang nhãn «(r<N>)» trong review-findings.md, round này KHÔNG chấm lại; lượt sửa chạm tệp của mục thì nhãn là «(r<N> · tệp đã đổi)» — mục KHÔNG bị bỏ, người gạch nếu nó đã hết; máy chèn các mục này, không phải tác tử tổng hợp), eval ui-check carry (khối giữ `screenshot`/`observed` của lượt gốc khi cùng run_id và ảnh còn trên đĩa — thiếu thì `s4-args` in một dòng vì sao). Kết quả có `boNgoaiVat` không rỗng → báo user ĐÚNG MỘT DÒNG «bỏ N finding ngoài vật: <tệp>» — đó KHÔNG phải lỗi, đó là bộ lọc vùng vật (T2) làm đúng việc; im lặng ở đây thì một bộ lọc hỏng trông y hệt một lượt sạch — carry-forward phải minh bạch, không được ẩn vào "máy đã lo". Riêng round fix có carry → danh sách eval carried (P1) phải nằm RÕ trong báo cáo user và gói Cổng 2, kèm lý do từng eval được carry (paths không chạm diff-fix). Kết quả có `triageFailed: true` → verdict của round LUÔN là `PENDING-JUDGMENT` (máy không biết round này sạch thì không được ký một PASS sạch bong), evidence-report.md mang `triage_failed: true` trong frontmatter + một dòng ⚠ dưới tiêu đề; báo user RÕ "phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, toàn bộ findings chờ người xem ở Gate 2", và đưa cảnh báo đó vào gói Gate 2 (KHÔNG nén vào phần "máy đã lo"). Nâng lên PASS ở Gate 2 nghĩa là người ký ĐÃ tự đọc hết danh sách trong review-findings.md, không phải máy đã kiểm. Kết quả có `coverageCluster` khác null → nêu ngay: "N/M lỗi rơi ngoài vùng phủ của bộ đo (`<file>`…) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi". Và NGAY khi Workflow trả về (mọi verdict, kể cả BLOCKED): chạy usage report (xem "Đo model/token per run"), rồi `node "$WORKFLOWS_DIR/../scripts/thuoc-vat.mjs" --root . --slug <slug> --write --transcript "<transcriptDir>"` (`transcriptDir` của kết quả Workflow — cùng giá trị đưa cho `wf-usage`; vắng thì máy tự tìm) — nối một dòng đếm vật · thước · nhát vào run-log để thẻ Cổng Bằng chứng in thành một dòng; script lỗi → WARN một dòng, không chặn vòng. Lệnh tự lấy tệp `s4-args*.json` MỚI NHẤT thuộc lượt cuối trong hồ sơ (cham-lai-khong-tu-doi); tệp args của lượt nằm ngoài hồ sơ, hoặc lệnh thoát 2 «tệp args không thuộc lượt cuối» / «không tệp args nào trong hồ sơ thuộc lượt cuối» → máy chạy lại kèm `--args <tệp --out của lượt này>`, không hỏi người. Rồi chạy khối `S4-DO-VONG` dưới (đọc hạn mức tuần lần hai, rồi đo vòng) — nối một dòng `gio-may` (giờ máy · giờ chờ · token · % hạn mức tuần) vào run-log; lỗi → WARN một dòng, không chặn vòng. Kho có `PRODUCT-INVARIANTS.md` → chạy tiếp `AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/luat-san-pham.cjs) && node "$AG/scripts/luat-san-pham.cjs" --root . --slug <slug> --quet --base <diffBase> --den <sha lượt chấm> --write` (kit tự host: `AG=.`) — ghi `luat-cham.json` cho thẻ Cổng Bằng chứng gọi tên luật bị chạm; lỗi → WARN một dòng, không chặn vòng. **Mã 5 của lệnh này = *thước lệch*** (nhan-trang-thai-va-reality AC-3): thước của hồ sơ (`evals.yaml` · `rang/` · `config.yaml` · test kho) đổi NỘI DUNG giữa lúc sinh args và lúc lượt xong — lượt ấy chấm bằng thước khác, không dùng được; thẻ khoá với nhãn đó, máy chấm lại lượt MỚI. Không sửa thước giữa S4. **Mã 6 = *cây đổi trong lượt chấm*** (luot-cham-ghi-vao-cay): giữa lúc sinh args và lúc lượt xong có commit mới hoặc tệp đang theo dõi bị sửa ở phần vật/thước của kho (trừ `.acceptance-runs/`, `evidence/` của hồ sơ, `.claude/`) — ai làm máy không biết; lượt ấy KHÔNG dùng được bất kể verdict: không ghi PASS, không đặt `verified`, không chạy `khong-can-nguoi`. Đọc danh sách tệp + commit lệnh in (dòng `cay-doi` trong run-log), HOÀN LẠI rồi sinh args lại — `s4-args` tự ra CÙNG round (không đếm trần), một lần; lần hai vẫn đổi → trình thẻ. Hoàn lại tách hai ca: commit CHƯA đẩy mà phiên này không tạo và không phối hợp (tác tử chấm tự sửa) → `git reset --keep <sha đã chấm>` (giữ sổ phiên chính chưa commit), tệp sửa không commit → `git checkout -- <tệp>`; thay đổi CÓ CHỦ ĐÍCH của phiên khác (gộp nhánh) → không hoàn lại, sinh args với `--nhan-cay-moi` để chấm trên HEAD mới, kèm một dòng sổ `fix` nói vì sao. Việc khó-đảo — commit đã đẩy lên remote, hay không rõ là việc của ai — thì HỎI NGƯỜI, không tự reset. Chưa hoàn lại mà sinh args lại thì `s4-args` thoát 2 «cay doi chua hoan lai» gọi tên commit/tệp còn đó. Sau dòng `cay-doi` luôn có ĐÚNG MỘT dòng `ghi-boi-tac-tu-cham` (tac-tu-cham-chi-cham-khong) nói tác tử chấm nào đã ghi tệp nào. Máy KHÔNG tự hoàn lại (bước sau-lượt không đổi cây): dòng ấy cho phiên biết thay đổi nào của tác tử chấm (`tac_tu`) và thay đổi nào không rõ chủ (`tep_khong_ro`, có thể là việc của phiên — đừng hoàn lại mù) — rồi phiên hoàn lại theo đúng hai ca ở trên. Kết quả Workflow có `loaiTacTuVang` → lượt ấy chạy KHÔNG có loại tác tử hẹp (phiên mở trước khi cài bản gói mang ba loại tác tử chấm) — báo user đúng một dòng, không chặn; mở phiên mới thì lượt kế có loại.

<!-- <<<S4-DO-VONG -->
**Đo vòng bằng giờ máy và token (hồ sơ lo-trinh-gio-may).** Ba dòng, mỗi dòng tự giải gói acceptance-gate ngay trong dòng
(kho tự host kit thêm `--root .` ngay sau `--plugin acceptance-gate`). Phần trăm và thời điểm đặt lại lấy từ công cụ đọc hạn mức của phiên (`get_usage`, cửa sổ «Weekly · all
models»: `percentUsed`, `resetsAt`) — không đoán; phiên không có công cụ ấy thì bỏ hai dòng đọc, dòng đo vẫn chạy và ghi
`phan_tram_tuan: null` kèm lý do. Dòng một chạy ở S0 ngay khi mở vòng; dòng hai và ba chạy khi lượt chấm trả về, cạnh
`thuoc-vat`.
```
AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/do-vong.mjs) && node "$AG/scripts/do-vong.mjs" --doc-han-muc <phần trăm tuần> --dat-lai <thời điểm đặt lại>
AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/do-vong.mjs) && node "$AG/scripts/do-vong.mjs" --doc-han-muc <phần trăm tuần> --dat-lai <thời điểm đặt lại>
AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/do-vong.mjs) && node "$AG/scripts/do-vong.mjs" --root . --slug <slug> --write
```
<!-- S4-DO-VONG>>> -->
4. Workflow đứt giữa chừng (crash/cancel) → resume `resumeFromRunId` CÙNG round. Đã fix code → LUÔN run mới, không cache.
5. 🎨 **(CT1)** eval fidelity ADVISORY: surface có reference cũ (repo/`provenance.design_repo` trỏ được) → chạy so-drift, kết quả vào gói Gate 2; không có reference → skip-note thường. **(CT2)** fidelity trả "skipped" → in WARN RÕ vào gói Gate 2: "fidelity pixel-diff KHÔNG chạy — thị-giác CHƯA được so", KHÔNG lẫn vào PASS xanh.

## Đo model/token per run (ADVISORY, 0-token)

Sau MỖI Workflow run trong vòng lặp (S1 fan-out/gap-probe, S3 execute-parallel, S4 mọi round):

1. Lấy `transcriptDir` từ tool result của Workflow (không có field đó → dùng `--latest` thay cho đường dẫn).
2. `node "<WORKFLOWS_DIR>/../scripts/wf-usage.mjs" "<transcriptDir>" --md --title "<S3 | S4 round N | S1 gap-probe>" >> _acceptance/<slug>/usage-report.md`
3. In cho user 1 dòng tóm tắt từ output (per model: số agent · out-token) — đây là chỗ kiểm chứng `feature_loop.models` có hiệu lực THẬT (label nào chạy model nào, từ transcript, không phải config hứa).

Đây là telemetry vận hành, KHÔNG phải evidence: script lỗi / không tìm thấy transcript → WARN 1 dòng rồi đi tiếp, TUYỆT ĐỐI không chặn vòng lặp và không retry; KHÔNG tham chiếu usage-report.md trong evidence-report.md (hook không biết nó). File commit cùng gói evidence cuối S4 để theo dõi chi phí per-feature.

## Máy tự định tuyến mục Ngoài-n (khối DINH-TUYEN-MAY)

<!-- <<<DINH-TUYEN-MAY -->
**Máy tự định tuyến mục ngoài hợp đồng (hồ sơ ngoai-n-tu-dinh-tuyen).** Ngay khi hợp đồng sang `verified` — ở bước
PASS của S4 và khi resume vào hàng `verified` — chạy đúng dòng dưới, TRƯỚC bước máy thông (kho kit tự host: `AG=.`):
```
AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/dinh-tuyen-may.cjs) && node "$AG/scripts/dinh-tuyen-may.cjs" --write --root . --slug <slug>
```
Xong mới tới `khong-can-nguoi.mjs --write` (hàng `verified` của bảng trạng thái).
- Thoát 0 → nói lại ĐÚNG dòng lệnh in, một dòng; hồ sơ đi tiếp làn V thì gộp nó vào dòng báo một dòng của làn V.
  Commit `decisions.jsonl` + `contract.md` CÙNG gói evidence máy-viết. Dòng «tắt», «không định tuyến: …», «0 mục» là
  bình thường: kho chưa bật `feature_loop.ngoai_n_tu_dinh_tuyen`, hoặc hồ sơ không đủ điều kiện — vòng đi như cũ.
- Thoát 2 VÀ dòng lỗi bắt đầu `dinh-tuyen-may:` → vào Gate 2, KHÔNG chạy `khong-can-nguoi.mjs --write`; dòng lý do
  (khoá sai giá trị · dòng máy trỏ mục đã đổi) đi vào gói Cổng 2.
- Mã thoát khác 0 và 2 — bộ giải gói thoát 1 khi bản acceptance-gate đang cài chưa có `scripts/dinh-tuyen-may.cjs`,
  bên ghi thoát 3 khi gọi sai hay không đọc được hợp đồng — hoặc thoát 2 mà dòng lỗi không bắt đầu `dinh-tuyen-may:`
  (bộ giải gọi sai cú pháp): báo ĐÚNG MỘT dòng nêu mã và nguyên văn dòng lỗi, coi như khoá tắt (không mục nào được
  định tuyến), rồi đi tiếp `khong-can-nguoi.mjs --write` như trước vòng. KHÔNG dừng chờ người — đây không phải cổng.
- Khối KHÔNG đổi bảng cổng: máy chỉ ghi định tuyến cho mục mà CHÍNH nó đề xuất `known-limits`/`wont-fix`, ở hồ sơ T2 ·
  PASS · 0 UNCERTAIN; `new-contract`, T3, UNCERTAIN vẫn là của người; khó-đảo vẫn là câu hỏi cho người; chữ quyết vẫn
  của người — người đảo một mục bằng lệnh ở khoá `dao` của dòng sổ máy (lệnh ký cổng người).
<!-- DINH-TUYEN-MAY>>> -->

## GATE 2 (human — điểm dừng 2)

<!-- <<<PR-SAN-SANG -->
**Bước máy TRƯỚC thẻ — PR sẵn sàng lúc trình (hồ sơ ky-den-gop).** Ngay sau khi gói bằng chứng máy viết đã commit và
trước khi dựng thẻ Cổng Bằng chứng, chạy đúng dòng dưới (`<nhánh chính>` = nhánh PR nhắm tới):
```
node "$WORKFLOWS_DIR/../scripts/pr-san-sang.mjs" --root . --slug <slug> --base <nhánh chính>
```
Lệnh đẩy nhánh và chuyển PR sang sẵn sàng (mở nháp trước nếu chưa có) để CI chạy trong lúc người đọc thẻ; chữ ký Cổng 2
sau đó là một commit chỉ đổi tệp hồ sơ. Thoát 0 → gộp dòng nó in vào gói Cổng 2 (phần «máy đã lo»). Thoát 2 (chưa
verified · verdict không PASS · vật đổi sau lượt chấm) hay 3 (không remote, gh hỏng) → báo ĐÚNG MỘT dòng nguyên văn,
đi tiếp tới thẻ — đây không phải cổng. `feature_loop.ship_default` khác `pr` thì lệnh chỉ đẩy nhánh. PR sẵn sàng không
gộp được trước chữ ký: lưới trước-gộp đòi hồ sơ đã ký.
<!-- PR-SAN-SANG>>> -->

**BƯỚC MẶC ĐỊNH — render thẻ quyết định TRƯỚC:** invoke `/acceptance-gate:acceptance-card <slug>` (tự nhận Cổng 2) — judgment + scope (việc-của-người) lên đầu bằng ngôn ngữ sản phẩm, "máy đã lo" thu gọn, luôn kèm đảo-ngược. Mời cổng như đồng nghiệp hỏi: một câu hỏi đóng, nói ngả máy khuyên và vì sao, kèm ĐÚNG MỘT dòng lệnh máy đã điền sẵn mọi ô có khuyến nghị — người chỉ gõ chữ quyết định hoặc sửa ô mình nghĩ khác, rồi máy nói mình làm gì tiếp; máy không viết sẵn CHỮ QUYẾT của người và không hỏi phút. Kết lượt chờ người bằng chữ thường, không qua nút: lượt có trang thẻ (`card.html`; Cổng Bằng chứng thêm `evidence-page.html`) thì gửi trang ấy bằng công cụ gửi tệp của phiên (`SendUserFile`), phiên không có công cụ ấy thì in đường dẫn trang; dòng lệnh hay dòng trả lời mẫu nằm trong một khối `` ```text ``, chép đúng như thẻ in — ô thẻ để `___` thì giữ `___`, máy không tự điền chữ quyết; hộp «bước kế» của app (`wrap_up`) ở lượt này chỉ mang phần tóm tắt, không câu hỏi và không nút, vì app bỏ nút mở đầu «/» hay «!» hoặc chứa «@», cắt tin của nút ở 300 ký tự, và bỏ nút khuyến nghị thì mất luôn câu hỏi. Đính kèm gói text đầy đủ để soi sâu: verdict + bảng per-eval (đọc từ `reportPath` = evidence-report.md) + judge panel proposals + review findings (đọc từ `findingsPath` = review-findings.md, gồm cả section "chưa adversarial-verify" nếu có) + cảnh báo reviewIncomplete nếu có + diff summary (`git diff --stat <diffBase>...HEAD`) + tóm tắt usage 1 dòng/model từ usage-report.md (xếp trong phần "máy đã lo"). Thẻ chỉ là lớp trình bày — verdict/hook/evidence vẫn là nguồn-sự-thật. (Lệnh/script `/acceptance-gate:acceptance-card` không có → cài/cập nhật plugin acceptance-gate, hoặc tạm trình gói text.)

**Khối "Ngoài hợp đồng" (việc-của-người, trình TRƯỚC judgment items):** mọi finding `inContract: false` trong `triaged` — lỗi THẬT nhưng ngoài phạm vi đã duyệt ở Gate 1. Mỗi mục trình bằng ngôn ngữ sản phẩm + đúng 3 lựa chọn: (a) **ghi Known limits** — thêm bullet vào `## Notes` của contract, ship như hiện tại; (b) **mở contract mới** — một feature riêng có AC + eval của nó; (c) **nâng phạm vi sửa ngay** — sửa contract (thêm AC) + re-approve Gate 1 rồi S4 round mới. Khuyến nghị mặc định là (a) hoặc (b): (c) đắt và chỉ đúng khi lỗi đủ nặng để chặn ship. `triageFailed: true` → THÊM cảnh báo lên đầu khối (không thay thế — finding đã phân được ngăn vẫn phải hiện): "phân loại phạm vi không trọn — người xem lại danh sách đầy đủ trong review-findings.md". `coverageCluster` khác null → thêm dòng cờ "dừng và quyết: mở rộng hợp đồng hay rút phạm vi" kèm danh sách file.

**Judgment item trình cho user PHẢI ở dạng câu hỏi nghiệp vụ phi kỹ thuật** — user là người quyết kinh doanh, không phải engineer. Mỗi item: dịch thành 1 câu hỏi có/không hoặc lựa chọn a/b bằng ngôn ngữ SẢN PHẨM (không jargon schema/tool/migration), kèm (1) đề xuất của Claude + lý do 1 dòng, (2) hệ quả mỗi lựa chọn, (3) lựa chọn có đảo ngược được không. **Tính năng MỚI chưa có số liệu:** đừng bắt user phán bằng data — câu hỏi đúng là "đúng intent đã duyệt ở Gate 1 chưa · ship được chưa · đổi sau có rẻ không"; phương án đảo-ngược-được + ghi chú revisit là mặc định hợp lệ, data thật sau khi ship sẽ vào contract của vòng sau.

🎨 S4 có WARN fidelity-skip → nêu lên ĐẦU gói Gate 2, không nén vào phần "máy đã lo". **(CT1)** ghi lane hiện tại (D0/D1) + các entry descope lane vào gói Gate 2.

User: điền `human_override: <tên> <ngày>` cho từng UNCERTAIN (T3: MỌI judgment item), nâng PENDING-JUDGMENT → PASS nếu đồng ý, điền `human_signoff`. Xong: set contract `status: signed-off`, rồi commit các edit Gate-2 này — MỘT lượt, không cần tách khỏi thân báo cáo (nghi thức tách đã gỡ, ADR 0012); evidence máy-viết đã commit từ cuối S4. Ai chịu trách nhiệm đọc ở forge: người approve / bấm merge PR; pre-merge in một dòng «chữ ký mới trong diff» để chỗ đó không vô hình. Human để lại ghi chú revisit/đảo-ngược → append 1 entry `stage:"gate2"`; signoff đồng thời là phê chuẩn khối provisional mà card đã trình riêng.

## S5 — SHIP

<!-- <<<S5-SHIP-DEFAULT -->
**Mặc định MỞ PR — KHÔNG bày menu ba lối.** Nếp của kit là PR, nên câu hỏi «merge hay PR hay
giữ nhánh?» ở cuối vòng chỉ có một lối ra sống: đó là trạm thu phí, không phải điểm quyết định
(đo: 1 lượt gọi người mỗi vòng). Máy mở PR rồi báo MỘT DÒNG. Chỉ hỏi khi repo khai
`feature_loop.ship_default: ask` trong `_acceptance/config.yaml`.
Mặc định: `pr` (khoá vắng cũng là `pr`).
giá trị hợp lệ: `pr` · `merge` · `branch` · `ask`
(`merge` gộp thẳng khi repo cho phép · `branch` đẩy nhánh không mở PR · `ask` bày ba lối như
cũ). Việc BẤM MERGE vẫn là của người — khó-đảo.
<!-- S5-SHIP-DEFAULT>>> -->

PR đã sẵn sàng từ bước PR-SAN-SANG ở Cổng 2 → đẩy commit chữ ký lên đúng PR ấy, không mở PR mới. Chưa có PR: invoke `superpowers:finishing-a-development-branch` → PR theo quy trình repo (không push thẳng nhánh chính nếu repo cấm). Update doc trạng thái của repo nếu có. CI pre-merge check của acceptance-gate kit (`scripts/pre-merge-check.sh`) là chốt chặn độc lập — không bypass; repo CHƯA wire nó vào CI → cảnh báo user rõ ràng (gate không enforce trước merge, xem README của kit cách wire).

**Kết S5 — bàn giao sang Vòng TRAO, không kết bằng «xong».** Có `_acceptance/<slug>/opportunity.md` (vòng đi từ Cổng Đáng, có ngưỡng nghiệm thu) → in ĐÚNG MỘT DÒNG: «đã giao sau cờ · bước kế: lái-thử người-lạ (nghi thức của skill `/acceptance-gate:uat-session` §0, khuôn nhật-ký-vấp trong references của plugin acceptance-gate) rồi phiên nghiệm thu — `/acceptance-gate:uat-session <slug>`» — không hỏi, không tự chạy phiên nghiệm thu; lái-thử chạy trong lúc chờ mời người dự nên không kéo dài đường tới quyết định. Không có `opportunity.md` → một dòng «không hồ sơ cơ hội → ship thẳng, không phiên nghiệm thu; vòng đóng». Đường đi KHÔNG lưu ở đâu — suy khi đọc từ có/không hồ sơ cơ hội (cùng luật với thẻ Cổng Phạm vi và bộ đọc hồ sơ xưởng).

## Quy tắc gộp xung đột

- Quy ước verify của repo (CLAUDE.md) THẮNG default của skill con (vd TDD) nếu xung đột. Bù lại luôn có **evals-first**: evals.yaml duyệt TRƯỚC khi code.
- `verification-before-completion` → được thỏa bởi evidence S4, không verify trùng lần hai.
- Doer ≠ grader → main loop đã code thì KHÔNG tự chấm; mọi verifier/judge là fresh Workflow agents.
