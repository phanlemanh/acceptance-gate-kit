---
schema_version: 1
feature: Chấm đúng cây, đúng chỗ đứng — tầng chấm S4 tự chứng minh chỗ đứng
slug: cham-dung-cay-dung-cho-dung
owner: manh@mstar.vn
risk_tier: T2
surfaces: [cli]
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-08-29T08:44:00Z
---

# Acceptance Contract: cham-dung-cay-dung-cho-dung

## Context

Điều tra 29/08 (docs/findings/2026-08-29-dieu-tra-luat-hoi-tu.md): vòng chấm
S4 bị đốt bởi hạ tầng chấm là hiện tượng diện rộng — args cho workflow soạn
tay theo 14 gạch đầu dòng văn xuôi, cwd được *kể* cho agent thay vì *đặt*
(lane baseline ghim `git -C` thì đúng, lane verifier chỉ kể thì dính thư mục
mồi nhử), agent chết không để lại một dòng vết nào. Lỗi hạ tầng vì thế giả
dạng tín hiệu sản phẩm theo cả hai chiều (REJECT giả, PASS giả). Vòng này đưa
tầng chấm vào cùng kỷ luật nó áp cho sản phẩm: vật-vào do máy sinh fail-closed,
chỗ đứng do lane đặt, vắng mặt thành tín hiệu, mỗi lượt một dòng tổng kết
máy-đọc-được.

Source input: opportunity.md (Cổng Đáng build — Manh Phan 2026-08-29)

## Criteria

- AC-1: Given hồ sơ có `evals.yaml` + `_acceptance/config.yaml` hợp lệ, When chạy `s4-args.mjs --slug <slug> --root <repo>`, Then tệp args JSON sinh ra chứa đủ các trường hợp đồng của `acceptance-verify.js` (slug, round, riskTier, evals đã resolve, suiteCommands, diffBase, repoRoot, personasPath, templatePath, toolKillRule nguyên văn, contractPath, invokedAt, invokedSha), mỗi eval giữ `ref` gốc của `cmd`, và chuỗi lệnh trong tệp GIỮ SẠCH — không mang `cd` nào được nướng sẵn.
- AC-2: Given một eval mang `cmd: config:<ref>` mà ref không tồn tại trong config.yaml, When chạy `s4-args.mjs`, Then script thoát khác 0, thông điệp ghim ĐÚNG tên ref hỏng, và KHÔNG tệp args nào được sinh (fail-closed, không đoán lệnh).
- AC-3: Given workspace có `evidence-report.md` với section `## Iterations` ghi N round, When chạy `s4-args.mjs` không có `--round`, Then tệp args mang `round: N+1`; và Given không có evidence-report, Then `round: 1`.
- AC-4: Given round fix/delta có anchor sha (`--carry-anchor`), When chạy `s4-args.mjs`, Then script TỰ gọi `carry-plan.mjs` và điền carriedEvals theo kết quả, đồng thời LUÔN tính `evalsHash` (P2) và `inputsHash` cho từng judgment eval (P3); Given không truyền `--carry-anchor` lẫn `--no-carry` ở round ≥ 2, Then script thoát khác 0 đòi khai tường minh — «quên carry» không còn là trạng thái lặng.
- AC-5: Given tệp args do `s4-args.mjs` sinh, When đọc phần đầu tệp, Then có `generated_at` và `generated_sha`; và thân SKILL feature-loop bước chuẩn-bị-args dạy: HEAD hiện tại khác `generated_sha` → sinh lại tệp, không invoke bằng tệp cũ.
- AC-6: Given lane verifier máy trong `acceptance-verify.js`, When dựng prompt chạy lệnh cho agent, Then chuỗi lệnh giao cho agent có dạng `cd <repoRoot> && <cmd>` (đặt chỗ đứng trong chính lệnh), không còn dạng chỉ *kể* «trong repo X hãy chạy» — và lane UI cùng nếp.
- AC-7: Given lane baseline, When dựng prompt chạy lệnh trong worktree, Then lệnh vẫn chạy với chỗ đứng là worktree (`cd "$WT" && …`) — chốt AC-6 không được rò `cd <repoRoot>` vào lane baseline, nếu rò thì mọi eval baseline mất khả năng phân biệt.
- AC-8: Given một eval được fan-out mà agent không trả kết quả (chết/skip), When lượt chấm kết thúc, Then run-log có dòng `kind: vang-mat` nêu evalId + round + lý do, và verdict lượt đó KHÔNG phải PASS/PENDING-JUDGMENT sạch — vắng mặt đi nhánh BLOCKED (ERROR-hạ-tầng, không phải FAILURE-sản-phẩm).
- AC-9: Given một lượt chấm kết thúc với bất kỳ verdict nào, When main loop ghi run-log, Then có đúng MỘT dòng `kind: round-tally` của lượt đó mang {round, verdict, expected, returned, blocked, sha} với expected = số eval + suite đã lên lịch, returned = số có kết quả — và bộ đọc dòng này (dùng cho ngưỡng 5-vòng-kế) rút được các số ấy bằng round-trip từ dòng do CHÍNH bộ viết sinh ra trong lần chạy.
- AC-10: Given scope-triage đề xuất phân ngăn một finding ngoài hợp đồng, When triage trả `proposal`, Then giá trị `wont-fix` là hợp lệ trong schema và thẻ Cổng 2 render nó thành lựa chọn có tên; và Given review-findings/args đời cũ không có giá trị này, Then mọi bộ đọc chạy như cũ, không cờ đỏ, không bắt migrate.
- AC-11: Given args KHÔNG mang trường mới nào (tệp soạn theo đời 2.4.0), When chạy `acceptance-verify.js`, Then hành vi giữ nguyên đời cũ — suite workflows hiện hành xanh nguyên trạng, không đường nào bắt buộc trường mới.
- AC-12: Given lệnh của lane verifier hỏng vì HẠ TẦNG — bước `cd <repoRoot>` thất bại, hoặc lệnh thoát 127 (không tìm thấy lệnh/script), When lượt chấm xử lý kết quả, Then kết quả đó đi nhánh BLOCKED kèm dòng nguyên nhân máy-đọc-được, KHÔNG được đếm thành eval đỏ sản phẩm; và Given lệnh thoát 1 thường, Then vẫn là FAIL sản phẩm như trước — phân loại không nuốt lỗi thật.
- AC-13: Given SKILL feature-loop sau vòng này, When đọc bước chuẩn-bị-args S4, Then (a) điều khoản «script sinh-args lỗi → DỪNG trình người, KHÔNG rơi về soạn tay» có mặt dưới marker máy-đọc và khối marker chứa cả hành-động-dừng lẫn cấm-fallback, và (b) khối công thức 14-gạch-soạn-tay cũ đã VẮNG khỏi SKILL — soạn tay không còn là đường được dạy.

## Coverage

Quét theo ba trục rời rạc (docs/superpowers/specs/2026-08-29-cham-dung-cay-dung-cho-dung-design.md
§Quét hình thái); tích được cắt Pareto, ô có nghĩa phủ như sau:

- Trục giả định được ghim: chỗ-đứng (AC-6, AC-7, AC-12) | vật-vào args (AC-1, AC-2, AC-5, AC-13) | vắng-mặt (AC-8, AC-9) | trí-nhớ-carry (AC-4) | ngăn-phân-loại (AC-10). [thước CE: 5 lớp nguyên nhân đo được ở findings 29/08 §1, §3]
- Trục tầng vật: script sinh-args (AC-1..AC-5) | workflow acceptance-verify (AC-6..AC-9, AC-11) | run-log + bộ đọc + thẻ (AC-9, AC-10). [thước CE: hợp đồng args acceptance-verify.js:13-48 + bảng lane trong script]
- Trục chiều bằng chứng: mỗi AC máy có cặp hai-chiều cùng fixture theo MEASURE-BIRTH — chiều đỏ ghim thông điệp, khai trong `expected` của từng eval. [thước CE: MEASURE-BIRTH-CLAUSE, feature-loop SKILL.md]
- Ô «round tự đếm» (AC-3) là chốt chống mint trùng run_id đã ghi ở SKILL — giữ vì lớp lỗi từng nổ (BLOCKED cùng round đụng run_id minted).

## Đường đo

Ngưỡng khai ở opportunity.md → truy thành tiêu chí:

- «Trong 5 vòng S4 kế trên repo kit: 0 lượt hỏng vì hình dạng cwd/args» — số đọc từ các dòng `kind: round-tally` + `kind: vang-mat` của run-log các hồ sơ sau khi vòng này merge; VẬT sinh số là AC-8/AC-9.
- «Mọi lượt hỏng hạ tầng tự xưng CHƯA-CHẤM-ĐƯỢC, không đổ thành đỏ/xanh sản phẩm» — phủ bởi AC-8 (vắng mặt) + AC-12 (cd-fail · exit 127). GIỚI HẠN ĐÃ KHAI: các hình dạng hạ tầng KHÁC hai dấu hiệu đó (vd môi trường hỏng làm lệnh exit 1) chưa phân loại máy được — chúng đi đường FAIL như cũ và cần mắt người ở cổng; không tuyên «bảo đảm» trọn lớp.
- «≥2 lượt cùng lớp trong 5 vòng kế → leo nấc, không vá hình dạng» — phép đếm dùng cùng dòng round-tally; quyết định leo nấc là của người, ghi ở opportunity §Ngưỡng.
- Timebox 15/09 — lịch, không cần vật đo.

## Out of scope

- KHÔNG mở sổ phát hiện persist (luật 2 đề bài gốc) — hạt giống riêng; muốn làm phải supersede quyết định «claim-index là VIEW, không persist» (docs/superpowers/plans/2026-07-29-cross-feature-claim-index.md).
- KHÔNG thêm WIP limit một-vòng-mở (luật 3b) — hạt giống riêng.
- KHÔNG làm lại carry-forward (luật 3a) — `carry-plan.mjs` + P1/P2/P3 đã có; vòng này chỉ đưa bước GỌI vào máy (AC-4).
- KHÔNG nới điều kiện đóng vòng «xếp ngăn xong là đóng» (luật 1) — đổi luật veto-default, đã bác ở điều tra.
- KHÔNG làm nấc 2 (chấm thế-giới-bất-biến) và nấc 3 (bằng chứng gắn (eval, cây)) — chỉ mở khi ngưỡng CHẾT của opportunity kích.
- KHÔNG sửa gì trong repo media-library; KHÔNG sửa cache plugin.
- KHÔNG bắt verifier đối chiếu vân tay môi trường đầy đủ (realpath/env fingerprint do bên đọc kiểm) — dạng đầy đủ của nấc 1, để dành khi số 5-vòng-kế cho thấy cần.

## Notes

- Hạng T2: mọi file dự kiến đụng (`feature-loop/scripts/`, `feature-loop/workflows/acceptance-verify.js`, `feature-loop/skills/feature-loop/SKILL.md`, `scripts/gate-card.js`, `tests/**`) ngoài `t1_skip_globs` và ngoài `t3_paths`.
- Ghim chỗ đứng đặt ở tầng LANE (quyết định thiết kế 2 của design doc): nướng `cd <repoRoot>` vào chuỗi lệnh trong args sẽ phá lane baseline chạy worktree — AC-7 là chốt giữ điều đó.
- Case suite đang ghim chuỗi của đoạn SKILL S4 cũ sẽ được cập nhật theo VẬT mới trong cùng vòng — cập nhật thước theo vật được giao, không hạ thước (luật «thước phải gắn vào vật được giao», CLAUDE.md).
- Giới hạn đã khai: dòng `round-tally` ghi bởi MAIN LOOP theo điều khoản SKILL (main loop là người ghi run-log) — nếu main loop chết trước khi ghi thì dòng vắng; lớp đó thuộc bộ điều phối ngoài phạm vi workflow script, đã gọi tên ở đây thay vì im lặng.
