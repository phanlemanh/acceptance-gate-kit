---
schema_version: 1
feature: Thẻ Cổng Bằng chứng gọi đúng tên cạnh gãy (đỏ-bàn-đo ≠ đỏ-vật, hệ thống chết) và mở ô ký kèm giá; reality có quyền đóng hồ sơ bằng thao tác cổng người thứ bảy; test của kho thôi bị đếm là thước — để ba hồ sơ ở crm đóng được hoặc chấm được mà không dựng thêm một dòng thước nào
slug: nhan-trang-thai-va-reality
owner: phanlemanh@gmail.com
risk_tier: T3      # lib/workspace-record.cjs + scripts/pre-merge-check.sh + scripts/recheck-evidence.cjs — lõi cưỡng chế; đổi enum + thêm thao tác cổng người = khó-đảo
surfaces: [cli, ci, docs]
status: signed-off      # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by: Phan Le Manh
approved_at: 2026-09-21T06:12:41Z
design_doc: docs/superpowers/specs/2026-09-21-nhan-trang-thai-va-reality-design.md
---

# Acceptance Contract: nhan-trang-thai-va-reality

## Context

Ba hồ sơ ở `crm` chờ đúng ba thứ kit chưa có. `nhan-ung-dung-noi-tieng-viet` chạy trên prod
từ `ff3fb8bf` mà hồ sơ kẹt `approved / BLOCKED / chữ ký rỗng` vì enum trạng thái không có giá
trị «reality đã chấm». `ho-so-khai-dung-tieng` là tháp đo tháp trên cùng vật ấy (+4 622 dòng
thước / +81 dòng vật). `dieu-phoi-30-ngay-dau` bị trần nhát nổ vì ba commit TDD vào
`apps/api/test/*.spec.ts`, và thẻ BLOCKED khoá người lái khi eval đỏ vì bàn đo (khoá `.next`).

Người hưởng: owner ở Cổng Bằng chứng (ký được trên cạnh gãy có tên; đóng được thứ đã ở prod) ·
phiên Claude Code ở `crm` (thôi bị phạt khi làm TDD) · người đọc sau ở `crm` (hồ sơ thôi tàng
hình, PR #65 gỡ được). Trace: nguyên tố 2 (thước không tự dối: chỉ-đọc trong lượt chấm, nhãn
rút từ dữ liệu đã ghi) · nguyên tố 3 (khoảnh khắc quyết thật: ô ký có ba lối sống; reality là
người chấm cuối). CỘNG Đ8 + Đ9 đã phê ở ADR 0020; Đ1 · Đ2 · Đ3 là TRỪ/DỜI.

Source input: `_acceptance/nhan-trang-thai-va-reality/opportunity.md` (Cổng Đáng `build` 21/09) ·
`docs/superpowers/plans/2026-09-21-dieu-phoi-cach-moi-kit-va-crm.md` §3 ·
`docs/findings/2026-09-21-dinh-vi-lai-kit-vat-tao-ra-ban-giao.md` Đ1–Đ3, Đ7, Đ8, Đ9 · ADR 0020 ·
`docs/superpowers/specs/2026-09-21-nhan-trang-thai-va-reality-design.md`.

## Criteria

- AC-1: Given `feature-loop/scripts/lib/phan-loai.mjs`, When phân lớp một ma trận đường dẫn viết trước (tệp khớp `DO_GLOBS` — `tests/scripts/a.test.mjs`, `apps/api/test/x.spec.ts`, `pkg/__tests__/b.js`, `src/spec/c.rb` — và tệp thước thật — `_acceptance/config.yaml`, `_acceptance/s/evals.yaml`, `_acceptance/s/rang/r.mjs`, `_acceptance/s/do.sh`), Then mọi tệp khớp `DO_GLOBS` ra `vat` và mọi tệp thước thật vẫn ra `thuoc` — số assert bằng số phần tử ma trận; bản sao gỡ vế `evals.yaml` thì đúng ô ấy lật.
- AC-2: Given một kho fixture code sinh có hợp đồng đã `implemented` và ba commit sau đó chỉ chạm `_acceptance/<slug>/evals.yaml`, When chạy `s4-args.mjs`, Then script SINH tệp args, thoát 0, stderr không chứa `tran nhat sua thuoc` lẫn ba lối, và `thuoc-vat.mjs --json` vẫn đếm `nhat: 3` — bộ đếm còn, cái chặn mất; bộ đếm lỗi thì script vẫn thoát khác 0 có tên như hôm nay.
- AC-3: Given `s4-args.mjs` vừa sinh args cho một hồ sơ, When sau đó một tệp thước đổi NỘI DUNG (`evals.yaml`, một tệp trong `rang/`, `_acceptance/config.yaml`, hoặc một tệp tracked khớp `DO_GLOBS`) rồi chạy `thuoc-vat.mjs --write`, Then run-log có dòng `kind: thuoc-lech` đúng khuôn marker `THUOC-LECH-LINE` liệt đúng đường tệp, script thoát 5 với thông điệp ghim `thuoc lech trong luot cham`; đối chứng dương cùng fixture — không đổi gì → không dòng, thoát 0; chiều im — chỉ ghi lại cùng byte (mtime đổi) hoặc đổi một tệp `.md` của hồ sơ → không dòng, thoát 0.
- AC-4: Given run-log của hồ sơ có dòng `thuoc-lech` cùng round với báo cáo, When dựng thẻ Cổng 2, Then thẻ KHÔNG có lối ký, gắn nhãn **thước lệch**, liệt các đường tệp, và câu việc nói máy chấm lại lượt mới; hồ sơ không có dòng ấy → khối thẻ y hệt trước vòng.
- AC-5: Given một báo cáo `verdict: BLOCKED` mà mọi mục chặn là bàn đo (exit 97, exit 127, lý do tool-kill, hoặc `cannotRun` của một eval trong hợp đồng), When dựng thẻ Cổng 2, Then thẻ có ô ký mở, mỗi cạnh gãy một khối mang nhãn **không đọc được ở đây** + eval + AC + đủ ba lối (ghi hạn chế rồi ship · dựng bàn đo rồi chấm lại · trả lại) mỗi lối một giá, câu gộp một chạm có `Mù-<n>` và ô chữ quyết để trống; verdict và bảng per-eval y nguyên; khi `duong-nen.md` của hồ sơ có chân đỏ trùng lệnh của mục chặn, khối ấy thêm câu «đỏ từ trước vòng — không phải lỗi của vòng» (logic cờ nền đỏ của Cổng 1 dời sang, cùng một bộ đọc tệp đường nền). (cross-layer)
- AC-6: Given một báo cáo `verdict: REJECT` có eval exit 1, hoặc BLOCKED có mục không phân loại được (args sai, evals khai thiếu), When dựng thẻ Cổng 2, Then khối không-ký-được ra BYTE-IDENTICAL với bản dựng bằng `gate-card.js` trước vòng trên cùng fixture.
- AC-7: Given một báo cáo BLOCKED vì agent chết (chuỗi cố định engine phát, `agent bi skip/chet`), When run-log có đúng MỘT dòng `round-tally` BLOCKED cho round ấy (dòng sinh bằng writer `tallyLine` thật của `acceptance-verify.js`), Then thẻ khoá với nhãn **hệ thống chết** và câu việc «máy thử lại một lần»; When writer ấy ghi dòng thứ hai cho CÙNG round (SKILL chạy lại BLOCKED ở cùng round), Then thẻ mở ô ký như AC-5 với nhãn **hệ thống chết**. Lý do classifier/rate-limit do agent tự thuật là văn tự do, KHÔNG phân loại (khoá như cũ) — giới hạn khai ở Notes.
- AC-8: Given hồ sơ `signed-off` với báo cáo BLOCKED, When chạy `pre-merge-check.sh` và `recheck-evidence.cjs <báo cáo>`, Then cả hai trả NOTE «ký trên cạnh gãy có tên» khi MỌI mục chặn phân loại được và có dòng sổ `type: revisit` khớp; thiếu dòng cho một eval → VIOLATION gọi tên eval ấy; báo cáo REJECT có chữ ký → VIOLATION y hôm nay; cả hai bên đọc gọi CÙNG một vị từ của `lib/nhan-canh-gay.cjs`. Khuôn dòng `revisit` mà `/acceptance-gate:signoff` ghi (bên viết) sống ở ĐÚNG MỘT khối marker `CANH-GAY-REVISIT-LINE` trong `commands/signoff.md`; ca đo rút khuôn ấy, điền eval, đưa vào hai bên đọc (round-trip); đổi tiền tố trong khối marker → cả hai bên đọc đỏ. (cross-layer)
- AC-9: Given `lib/workspace-record.cjs`, When đọc hồ sơ `status: da-cham-boi-thuc-te` có dòng sổ `type: thuc-te` đủ `by` · `at` · `build_sha` 40-hex · `decision` — `build_sha` là sha BẢN DỰNG đang phục vụ prod lúc quan sát (đỉnh nhánh phát hành), KHÔNG phải commit đầu tiên đưa vật vào, Then `fieldProblem` không báo hỏng, bộ quét xưởng xếp hồ sơ vào nhóm đã xong với nhãn «đã chấm bởi thực tế», bản đồ sản phẩm rời nó khỏi nhóm đang dở; và trên TOÀN BỘ hồ sơ thật của kit (không mang trạng thái mới) đầu ra của bộ quét và bản đồ bằng đúng đầu ra trước vòng; giá trị gõ sai (`da-cham-boi-thuc-t`) vẫn là hồ sơ hỏng như hôm nay.
- AC-10: Given hồ sơ `status: da-cham-boi-thuc-te`, When chạy `pre-merge-check.sh` VÀ `recheck-evidence.cjs <báo cáo>`, Then ở CẢ HAI bên đọc: dòng `thuc-te` hợp lệ → NOTE «đã chấm bởi thực tế — chạy trên prod từ bản dựng <sha7> (quan sát <ngày>, <tên>)» và không VIOLATION nào từ luật verdict/chữ ký; dòng thiếu một vế → VIOLATION gọi tên vế; `build_sha` không tồn tại trong kho (`git cat-file -e` trượt) → VIOLATION ghim «bản dựng không có trong kho»; đổi `evals.yaml` hoặc `rang/**` của hồ sơ ấy sau dòng quan sát → VIOLATION «khoá việc thước»; dòng `supersedes` trỏ id dòng `thuc-te` → hồ sơ về luật cũ; hai bên gọi CÙNG vị từ `thucTe` của lib. (cross-layer)
- AC-11: Given `commands/observed.md`, When chạy P32, Then lệnh mang `disable-model-invocation: true`, danh sách khoá của P32 có bảy tên, và danh sách ấy RÚT từ mục thao tác cổng người trong `CLAUDE.md` bằng đúng bảy tên đó; bản sao gỡ dòng khoá của `observed.md` → P32 đỏ với thông điệp ghim `commands/observed.md lacks lock`; khuôn dòng `thuc-te` mà lệnh ghi sống ở ĐÚNG MỘT khối marker `THUC-TE-LINE` trong `commands/observed.md`, ca đo rút khuôn ấy, điền `build_sha` 40-hex có thật, đưa vào `thucTe()` và `pre-merge-check.sh` → NOTE (round-trip); đổi tên một vế trong khối marker → đỏ ghim tên vế. Thân lệnh là văn cho LLM thi hành — việc nó từ chối `draft`/sha ngắn và commit một lượt KHÔNG có răng hành vi (khai ở Notes).
- AC-12: Given thẻ Cổng 2 của một hồ sơ có `opportunity.md`, When dựng thẻ, Then thẻ có khối ý định trích NGUYÊN VĂN giá trị `feature:` và thân mục `## Vấn đề & ai gặp` (rút từ chính tệp lúc chạy): thân ≤ 12 dòng không trống → mọi dòng có mặt; thân > 12 dòng → đúng 12 dòng đầu có mặt, dòng thứ 13 vắng, có chuỗi «xem opportunity.md»; hồ sơ không có `opportunity.md` → không khối, không cờ.
- AC-13: Given `scripts/hieu-chuan-moc.mjs --root <kho fixture>`, When kho có N hồ sơ mang dòng `thuc-te` hợp lệ và k trong số đó có dòng `revisit` mở đầu `prod đỏ — ` sau dòng quan sát, Then in đúng một dòng `ĐẠT đã ký → prod đỏ: k / N`; N = 0 → in `ĐẠT đã ký → prod đỏ: vô hiệu (N = 0)` và đầu ra không chứa `0 / 0` lẫn `0 sự cố`; GUIDE mục năm dòng số có dòng thứ sáu trỏ lệnh này.

## Coverage

Quét Zwicky (preset test-matrix), đầy đủ ở design doc §7.

- **Trục A — bên đọc chịu đổi** [thước CE: grep `phan-loai` · `NAV_RULES` · `DA_THONG_CONG_2` · luật `verdict != PASS` — SUY-TỪ-REPO: `feature-loop/scripts/lib/phan-loai.mjs`, `lib/workspace-record.cjs`, `scripts/pre-merge-check.sh`]: phân lớp (AC-1) · sinh args (AC-2) · so sau lượt (AC-3) · thẻ Cổng 2 (AC-4, AC-5, AC-6, AC-7, AC-12) · bộ đọc trạng thái (AC-9) · lưới trước-merge + recheck (AC-8, AC-10) · lệnh cổng người (AC-11) · dòng mốc (AC-13).
- **Trục B — chiều**: xanh · đỏ · đọc-cũ (AC-4, AC-6, AC-9, AC-12) · đặc hiệu (AC-3 chiều im).
- **Trục C — gốc đỏ ở S4** [NGÀNH: trạng thái test của Bazel — `FAILED` tách khỏi `NO_STATUS`/`TIMEOUT`/`FLAKY`]: vật (AC-6) · bàn đo (AC-5) · hệ thống chết lần đầu và đã thử lại (AC-7) · thước lệch (AC-3, AC-4).
- `[GIẢ ĐỊNH]` «đã thử lại» = hai dòng `round-tally` BLOCKED cùng round — đúng hình dạng run-log hôm nay; engine đổi cách ghi thì AC-7 đổi theo.

## Đường đo

Ngưỡng ở `opportunity.md` đo ở `crm` SAU khi cài 2.18.0 (lệnh ở §7 kế hoạch điều phối); vòng này giao VẬT làm các số ấy đo được:

- hồ sơ `crm` tàng hình = 0: số từ `grep` §7 kế hoạch trên `crm/_acceptance/*` · AC bảo đảm: AC-9, AC-10 (đóng được) · AC-5, AC-8 (ký được)
- PR crm #65 merge: số từ `gh pr view 65 --json mergeable` · AC bảo đảm: AC-10 (lưới không chặn hồ sơ đã chấm bởi thực tế)
- 0 lượt chấm `dieu-phoi` bị hạ tầng/hệ thống đốt: số từ `run-log.jsonl` của `dieu-phoi`, dòng `round-tally` · AC bảo đảm: AC-1, AC-2 (không trần) · AC-5, AC-7 (không khoá)
- 0 lượt gọi người ngoài thiết kế của vòng này: số từ sổ quyết định + hội thoại (đếm tay, dòng 2 luật (c)) · AC bảo đảm: — (đếm, không phải vật)
- dòng M3 `k / 3` ở hồ sơ mốc 2.18.0: số từ `scripts/hieu-chuan-moc.mjs --root <crm>` · AC bảo đảm: AC-13
- thước / vật ≤ 3 : 1: số từ dòng `thuoc-vat` cuối của run-log vòng này · AC bảo đảm: AC-1 (định nghĩa lớp)

## Out of scope

- Đ4 (ui-check thành lệnh, bỏ W8) · Đ5 (hội đồng theo yêu cầu, synthesize → render) · Đ6 (review chỉ diff vật — `fileDoTrongDiff` giữ nguyên) · Đ10 (dời tháp `rang/` của `crm`) · Đ11 răng — mỗi cái chờ một ca thật gọi tên, vào hạt giống.
- Đ7 đầy đủ: trọng số AC↔cơn đau và định tuyến AC lõi/phụ — vòng này chỉ trích nguyên văn, và vì chưa có trọng số nên MỌI cạnh gãy ở AC-5/AC-7 là câu hỏi cho người.
- Rollout 2.18.0 ra kho khác ngoài `crm`; tự đóng ba hồ sơ `crm` (việc của phiên crm-rollout sau khi cài).
- Sửa bất kỳ byte nào trong `_acceptance/<slug>/` của hồ sơ đã ký (kể cả `thuoc-co-cua`) — xử lý ở chiến dịch ghim lại, xem Notes.
- LLM phân loại lý do BLOCKED — cấm theo giả định sinh tử 2 của ô.

## Notes

- **Hồ sơ đã ký đo hành vi bị thu hồi — chốt ở S3 bằng lượt chạy trọn năm suite (xanh cả năm):** đúng MỘT eval, `thuoc-co-cua` E17 (AC-12, trần nhát, khoá `executors.script.tcc_tran_thuoc`): tệp ca `tests/scripts/s4-args-tran-thuoc.test.mjs` rời suite cùng trần, nên lượt ghim lại 2.18.0 sẽ đỏ trên eval ấy. `thuoc-co-cua` AC-10 (E12) KHÔNG bị thu hồi — lời hứa của nó là «một nguồn, bốn lớp», và nó xanh dưới luật mới. Vòng này KHÔNG chạm hồ sơ đã ký; người quyết cho `thuoc-co-cua` nghỉ ở đợt ghim lại (khuôn hồ sơ nghỉ 2.17.0, sổ `d-20260921T055016Z-7`). Kèm theo: một lượt chạy trước 231 khoá executor riêng của mọi hồ sơ đã ký (mỗi khoá tối đa 120 giây) đang chạy nền lúc chuyển `implemented`; kết quả của nó thuộc chiến dịch ghim lại, không phải điều kiện của vòng.
- **So sánh thước/vật đứt đời:** từ vòng này test kho là `vat`; dòng `thuoc-vat` của hồ sơ trước và sau không so thẳng được.
- **Hai giới hạn khai của mảnh B/C.** (i) Lý do classifier/rate-limit/«Dừng nó» là văn tự do agent thuật: không rút được từ nguồn engine nên KHÔNG phân loại — nếu agent khai `cannotRun` cho một eval, nó rơi vào «không đọc được ở đây» (mở ô ký, nhãn chưa đúng tên), nếu không thì khoá như cũ; ngưỡng đếm: một lượt chấm `crm` bị đốt với lý do này sau 2.18.0 thì mở hạt giống. (ii) `commands/observed.md` là prompt: răng chỉ có ở khuôn dòng (round-trip) và ở lưới đọc dòng; lệnh bỏ bước kiểm tiền đề thì lưới vẫn bắt dòng thiếu vế.
- **Chạm/lượt ở Cổng 2 có thể tăng** vì mọi cạnh gãy là câu hỏi (chưa có trọng số) — đo ở hai vòng `crm` đầu (kế hoạch §5 mục 5).
- **Ngoài phạm vi, vào hạt giống:** tác nhân chấm commit vào cây giữa lượt (ca crm `dieu-phoi` lượt D 21/09) — AC-3 chỉ bắt phần chạm thước; phần chạm vật và báo cáo ở `docs/plans/2026-09-21-hat-giong-tac-nhan-cham-ghi-vao-cay.md`.
- Khuôn hợp đồng (`contract-template.md`) và comment `status:` của mọi khuôn liệt thêm `da-cham-boi-thuc-te`; hồ sơ cũ không phải sửa.
- **Known limits — owner ghi ở Cổng Bằng chứng 21/09 (sổ `d-20260921T115445Z-14` … `-21`):**
  (1) nhánh «không tìm thấy commit ghi dòng quan sát → THIEU» trong `checkThucTe` chưa có ca đỏ nào chạm tới (Ngoài-1, Ngoài-5); (2) ca ấy dùng lại mã 1 «thiếu vế», nên lưới trước-merge và `recheck-evidence` in lời «thiếu vế commit-ghi-dong-quan-sat» và gợi ý ghi lại dòng, trong khi việc đúng là commit dòng đã có (Ngoài-2, Ngoài-4); (3) phần kỳ vọng của E10 còn ghi «năm ca = 10 assert», thực tế sáu ca = 12 (Ngoài-3); (4) hồ sơ `draft` nhảy thẳng sang `da-cham-boi-thuc-te` được — hook tự khai «never from draft» nhưng không mã nào chặn, và lưới trước-merge không áp luật Cổng 1 (Ngoài-6, Ngoài-7; mức cao nhất là high); (5) `thuoc-vat --write` bỏ qua phép so thước khi tệp args đọc/parse lỗi, kể cả khi `--args` truyền tường minh (Ngoài-8).
