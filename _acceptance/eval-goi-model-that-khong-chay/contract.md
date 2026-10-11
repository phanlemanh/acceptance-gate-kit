---
schema_version: 1
feature: Eval gọi model thật không chạy lại khi đầu vào không đổi — làn ghim lại dùng lại kết quả của lần eval model thật sự chạy gần nhất khi băm năm lớp đầu vào không đổi (hạn 7 ngày, khoá bật theo lựa chọn), nói ra mọi lần dùng lại, và chạy lại khi một byte đầu vào đổi
slug: eval-goi-model-that-khong-chay
owner: phanlemanh@gmail.com
risk_tier: T2               # feature-loop/scripts/** + tests/** + GUIDE/SKILL/CHANGELOG — không chạm lib/**, hooks/**, pre-merge-check.sh, recheck-evidence.cjs (AC-12 giữ)
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-11-eval-goi-model-that-khong-chay-design.md
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-11T09:18:19Z
---

# Acceptance Contract: eval-goi-model-that-khong-chay

## Context

Hàng là CỘNG (ADR 0018) — owner phê ở Cổng Đáng; trace về nguyên tố 2 (bằng chứng không tự dối:
kết quả dùng lại phải nói ra nguồn và tự kiểm khi chạy lại cùng băm), người hưởng là chủ kho crm (trả
AI Gateway) và phiên thợ crm (làn ghim lại ngắn hơn). Cổng Phạm vi đi làn V (T2, phản biện đã định
đoạt hết, không mục chỉ-người-biết): cửa veto mở.

Cổng Đáng 11/10 ký build hàng G3 (owner «Làm»; chính sách chốt ở `opportunity.md`: chỉ eval trong
`feature_loop.model_evals`, chỉ làn ghim lại, khoá bật theo lựa chọn, hạn 7 ngày, bên đọc pin không
đổi). Đo trên crm: 17/44 lần chạy lại eval model trong làn ghim lại có đầu vào không đổi theo ba lớp
(số ở ô cơ hội); đo lại sau phản biện với cả năm lớp — tệp lệnh gọi tên giải theo `cd`, `bun.lock` thay
cho dấu vân tay — còn **14/44**, 9 lần trong 7 ngày 04–10/10; 15 làn gọi model 06–11/10 tốn 15,67 USD. Vòng này thêm khoá `feature_loop.model_carry_cmd` (lệnh in dấu vân tay
môi trường model), hàm băm năm lớp đầu vào, luật chọn nguồn từ `run-log.jsonl` của chính hồ sơ, bộ tự
kiểm `carry_lech`, cờ ép `--chay-lai-model` và script đếm cho đường đo. Cơ chế, bảng lớp, bảng lý do
luôn chạy và giới hạn: design doc.

Kho thử trong mọi ca do code sinh trong lượt (`tests/scripts/gia-lan-fixture.mjs`, thư mục tạm,
`git init`): suite một lệnh; eval model E1 (trong `model_evals`, `paths: [src/a.txt]`, lệnh
`sh tools/e1.sh` — tệp lệnh gọi tên nằm ngoài `paths`; thêm một ca lệnh dạng `cd tools && sh e1.sh` để tệp gọi tên giải theo thư mục `cd`); eval thường E2; lệnh dấu vân tay đọc một tệp
NGOÀI kho. Mọi pin do CHÍNH `repin-lane.mjs --write` ghi; bộ đếm số lần chạy mỗi lệnh ghi ra thư mục
NGOÀI kho. Mốc so trước vòng: `08ba287d30ad96a89e3103436822f298c2684296` (merge-base). Commit lõi
SAU-G3 = commit không-gộp mới nhất mang dấu `(eval-goi-model-that-khong-chay)` trong thông điệp VÀ chạm
`feature-loop/scripts/` — commit ký, commit ghim lại về sau không chạm thư mục đó nên SAU-G3 cố định
sau khi gộp. Chiều đỏ áp phép phá vào bản sao `git archive SAU-G3`. Mọi commit của vòng mang dấu ấy
trong tiêu đề (AC-12 rút tệp của vòng từ chính các commit đó).

## Criteria

- AC-1: Given khoá `model_carry_cmd` khai, lượt ghim lại 1 đã chạy E1 và E2 rồi commit, When lượt 2 chạy trên cây không đổi, Then lệnh của E1 KHÔNG chạy (bộ đếm E1 = 1) còn E2 chạy (bộ đếm E2 = 2); And dòng `repin` lượt 2 mang `evals_exit.E1` = mã của lượt 1, `evals_carry` = {E1: run_id lượt 1}, `evals_hash.E1` bằng `evals_hash.E1` của lượt 1, `tong_ket.model_goi` = 0 và `tong_ket.model_carry` = 1; And section `### Re-pin` có hậu tố «dùng lại theo băm đầu vào (không gọi model): E1←<run_id lượt 1>», stderr có «feat E1: dùng lại theo băm», dòng `[lane] TỔNG KẾT` có «gọi 0, carry 1», và làn tự kiểm `recheck-evidence` xanh.
- AC-2: Given lượt 1 như AC-1 và bảng năm lớp RÚT từ khối `CARRY-INPUT-LAYERS` của bên viết (lệnh đã giải · tệp khớp `paths` · cây hồ sơ · tệp lệnh gọi tên · dấu vân tay môi trường), When đổi ĐÚNG một byte ở ĐÚNG một lớp rồi commit (năm ca, một ca một lớp, trên cùng kho thử dựng lại cho mỗi ca; ca lớp tệp lệnh gọi tên dùng lệnh `cd tools && sh e1.sh`, nên tệp chỉ giải được theo thư mục `cd`), Then lượt 2 chạy lệnh E1 (bộ đếm = 2), `evals_hash.E1` khác lượt 1, không có `evals_carry`, stderr «feat E1: không dùng lại — băm đổi» — 5/5; số ca bằng số lớp rút được, rút rỗng là ĐỎ; And độ đặc hiệu — ba ca phải VẪN dùng lại: đổi một khoá KHÁC của `config.yaml` (không đổi lệnh E1) · đổi `tools/khac.txt` cùng thư mục với tệp lệnh gọi tên mà lệnh không nêu · đổi một tệp dưới thư mục là đối số của `cd` mà lệnh không nêu (đối số `cd` không phải từ trỏ tệp; tên thư mục không kéo cả thư mục vào băm); chiều đỏ: với mỗi lớp, bản sao bỏ ĐÚNG lớp ấy khỏi hàm băm → ca của lớp ấy ghim «lớp <tên> không vào băm» (5 phép phá); bản sao bỏ bước giải theo `cd` → ca lớp tệp lệnh gọi tên ghim «lớp tệp lệnh gọi tên không vào băm»; bản sao kéo trọn thư mục khi gặp tên thư mục → ca độ đặc hiệu ghim «băm kéo cả thư mục».
- AC-3: Given lượt 1 đã chạy E1, When `ts` của dòng nguồn (do làn ghi) lùi về 7 ngày trừ 1 phút trước lúc chạy lượt 2, Then lượt 2 dùng lại; And lùi về 7 ngày cộng 1 phút thì lượt 2 chạy E1 với stderr «không dùng lại — nguồn quá 7 ngày»; And `ts` nguồn muộn hơn lúc lượt 2 bắt đầu thì không tính là nguồn (chạy, stderr «không dùng lại — chưa có nguồn cùng băm»); chiều đỏ: bản sao bỏ phép so tuổi → ca 7 ngày cộng 1 phút ghim «dùng lại nguồn quá hạn».
- AC-4: Given lượt 1 đã chạy E1 với nguồn hợp lệ, When lượt 2 rơi vào MỘT lý do luôn chạy — bảng RÚT từ khối `CARRY-LY-DO-CHAY`: lệnh dấu vân tay thoát khác 0 · lệnh dấu vân tay hết giờ · lệnh dấu vân tay in rỗng · cờ `--chay-lai-model` · eval không khai `paths` · `paths` có mục không chứng được trỏ tới tệp · tệp trong cây hồ sơ sửa chưa commit hoặc tệp chưa theo dõi trong cây hồ sơ · làn chạy `--allow-dirty` · lệnh có biến hoặc thay thế lệnh của shell (`$`, backtick) · lệnh E1 trùng nguyên văn một suite cùng môi trường, Then lệnh E1 chạy (hoặc kết quả lấy từ lần suite vừa chạy ở ca trùng suite), không có `evals_carry`, stderr «feat E1: không dùng lại — <lý do>» với đúng chữ lý do của khối — mỗi lý do một ca, số ca bằng số lý do rút được; riêng lý do hết giờ đo ở hàm chạy lệnh dấu vân tay với trần 0,5 giây và lệnh `sleep 5` (trần thật 60 giây — một ca làn 60 giây không đứng được trong suite), phải trả trong ≤ 3 giây với đúng chữ lý do; And khi hồ sơ có HAI eval model, lệnh dấu vân tay chạy đúng MỘT lần mỗi lượt (bộ đếm ngoài kho); And E2 (không thuộc `model_evals`) chạy ở MỌI lượt và không bao giờ có trong `evals_hash`; chiều đỏ: bản sao bỏ kiểm cây hồ sơ bẩn → ca tương ứng ghim «dùng lại trên cây bẩn»; bản sao bỏ kiểm lệnh dấu vân tay → ca thoát khác 0 ghim «dùng lại khi không biết model»; bản sao bỏ trần giờ → ca hết giờ ghim «lệnh dấu vân tay không có trần».
- AC-5: Given khoá khai, When lượt 1 chạy E1, lượt 2 dùng lại, lượt 3 dùng lại, Then `evals_carry.E1` của lượt 3 là run_id lượt 1 (chuỗi dàn phẳng, không trỏ lượt 2); And khi lượt 2 chạy thật bằng `--chay-lai-model` (cùng băm) thì lượt 3 dùng lại từ lượt 2 (nguồn mới nhất); And pin ghi khi khoá còn vắng (dòng không có `evals_hash`, như mọi dòng đời trước) rồi bật khoá, lượt kế chạy E1 với stderr «không dùng lại — chưa có nguồn cùng băm»; chiều đỏ: bản sao lấy run_id của dòng nguồn kể cả khi dòng ấy chỉ dùng lại → ghim «chuỗi dùng lại không dàn phẳng».
- AC-6: Given lượt 1 chạy E1 xanh rồi `ts` nguồn lùi quá 7 ngày, When lượt 2 chạy E1 cùng băm mà lệnh trả mã 1 (mã điều khiển bằng tệp NGOÀI kho, không vào băm), Then làn đỏ và dòng `repin-do` mang `carry_lech: ["E1"]` cùng `evals_hash.E1`, dòng `[lane] TỔNG KẾT` có «carry_lech: E1»; And sau khi lệnh trả lại mã 0, lượt 3 chạy xanh (nguồn mới), lượt 4 cùng băm vẫn CHẠY với stderr «không dùng lại — cùng băm từng cho kết quả khác»; And đổi một byte lớp tệp khớp `paths` thì lượt 5 chạy, lượt 6 dùng lại; chiều đỏ: bản sao bỏ luật chặn sau `carry_lech` → lượt 4 dùng lại, ghim «dùng lại sau carry_lech».
- AC-7: Given CÙNG một kho thử có eval model E1 khai `paths` và KHÔNG khai `model_carry_cmd`, When chạy ba lượt ghim lại, Then (vế sống, làn của cây đang kiểm) không dòng nào có `evals_hash`, `evals_carry`, `carry_lech`, E1 chạy cả ba lượt, lệnh dấu vân tay không chạy lần nào, `tong_ket.model_carry` = 0, và tập khoá dòng `repin` bằng tập khoá của cùng kho thử khi khoá khai trừ đúng ba khoá ấy; And (vế đông cứng, hai bản `git archive`: làn của mốc trước vòng và làn của SAU-G3) bộ đếm số lần chạy mỗi lệnh, tập khoá mọi dòng `repin` và tập khoá JSON stdout bằng nhau — hai nguồn trùng nhau là ĐỎ «base trùng cây», mốc không giải được là ĐỎ gọi tên hạ tầng; chiều đỏ: bản sao ghi `evals_hash` khi khoá vắng → ghim «khoá vắng mà dòng đổi».
- AC-8: Given pin có E1 dùng lại, When (vế sống) làn của cây đang kiểm ghi pin rồi `recheck-evidence.cjs` của cây đang kiểm đọc, và (vế đông cứng) làn của SAU-G3 ghi pin rồi `recheck-evidence.cjs` của mốc trước vòng đọc (hai bản `git archive`), Then cả hai thoát 0; And sửa `evals_exit.E1` của dòng `repin` cuối thành 1 thì cả hai thoát khác 0 với thông điệp nêu E1 (bên đọc thật sự đọc dòng đó).
- AC-9: Given làn đang kiểm chạy với MỌI khoá của khối `LAN-KHOA` bật và một lượt dùng lại, When so khoá dòng `repin` và `repin-do` writer thật ghi với khuôn `REPIN-TEMPLATE` của SKILL, Then mọi khoá writer ghi có trong khuôn và đúng thứ tự khuôn (gồm `evals_hash`, `evals_carry`, `carry_lech`); And khối `LAN-KHOA` rút đúng 6 khoá, mỗi khoá có một dòng ở GUIDE §7.1; And `model_carry_cmd` rỗng được đọc như vắng.
- AC-10: Given run-log do làn thật ghi trong một kho thử có một lượt chạy E1, một lượt dùng lại, hai lượt `carry_lech` — (a) lệch khi không tệp git nào đổi giữa sha nguồn và sha lượt lệch (mã điều khiển ngoài kho), (b) lệch sau khi đổi `lib/x.txt` (không nằm trong lớp nào của băm) — và thêm một dòng `repin` có `evals_carry` trỏ run_id không tồn tại, When chạy `feature-loop/scripts/dem-dung-lai-model.mjs --root <kho>`, Then dòng tổng in đúng `model_goi`, `model_carry` và `carry_lech` = 2 viết trước trong ca, một dòng cho E1, lượt (a) mang nhãn «lệch không tất định», lượt (b) mang «nghi thiếu đầu vào: lib/x.txt», và một dòng «nguồn không có» nêu run_id đó; chiều đỏ: bản sao chỉ đếm dòng `repin` → ghim «carry_lech đếm thiếu»; bản sao in «lệch không tất định» cho mọi lượt → ghim «không tách nguyên nhân lệch».
- AC-11 (judgment): Given `GUIDE.md` §7.1, `feature-loop/skills/feature-loop/SKILL.md` (nghi thức re-pin) và `CHANGELOG.md`, When người viết eval ở một kho tiêu thụ đọc chúng, Then họ biết: bật dùng lại bằng khoá nào; lệnh dấu vân tay phải in gì (id model nhà cung cấp trả, băm khoá gói, phiên bản runtime khi đáng kể) và nó không bao giờ bị ghi ra; năm lớp của băm; hạn 7 ngày; các lý do luôn chạy và cách ép chạy lại; bốn giới hạn khai (paths thiếu đầu vào, tệp chưa theo dõi ngoài cây hồ sơ, model trôi cùng id, bên đọc không chứng chuỗi) mỗi cái kèm ngưỡng; lệnh đếm của đường đo; và CHANGELOG có mục chưa phát hành nêu «khoá vắng = như 2.26».
- AC-12: Given tập tệp của vòng = mọi tệp mà các commit không-gộp trong `08ba287d..HEAD` mang dấu `(eval-goi-model-that-khong-chay)` trong thông điệp đã chạm, trừ hồ sơ của chính vòng (rút rỗng là ĐỎ), Then không tệp nào khớp `risk_tiers.t3_paths` của `_acceptance/config.yaml` (đọc lúc chạy, không chép danh sách) và không tệp nào nằm dưới `_acceptance/<hồ sơ khác>/` của một hồ sơ `signed-off` hoặc `machine-cleared`; And chiều im trên kho thử: một commit KHÔNG mang dấu (như commit ghim lại kéo về từ `main`) chạm hồ sơ đã ký → vẫn xanh; chiều đỏ trên CÙNG phép đo: commit mang dấu chạm `lib/evidence-core.cjs` → ĐỎ ghim «chạm vùng T3»; commit mang dấu chạm `_acceptance/<hồ sơ đã ký>/contract.md` → ĐỎ ghim «chạm hồ sơ đã ký».

## Coverage

Quét bằng `morphological-scan` (preset test-matrix). Chân sản phẩm: làn ghim lại và hồ sơ gốc crm
`[SUY-TỪ-REPO: feature-loop/scripts/repin-lane.mjs, feature-loop/scripts/lib/lan-khoa.mjs, docs/superpowers/specs/2026-10-06-gia-lan-ghim-lai-design.md]`.
Chân ngành: `[NGÀNH: Bazel — khoá action cache băm dòng lệnh + băm từng tệp vào + môi trường]` cho
lớp lệnh/tệp/môi trường; `[NGÀNH: Turborepo — task hash gồm inputs, env khai, global dependencies như lockfile; cờ --force]`
cho lớp dấu vân tay và cờ ép; `[NGÀNH: crm eval-model-that-dung-luc E15]` cho hạn 7 ngày và id model nhà cung cấp trả.

- Trục A — lớp đầu vào của băm: lệnh đã giải · tệp khớp `paths` · cây hồ sơ · tệp lệnh gọi tên · dấu vân tay môi trường  [thước CE: đề bài «lệnh, tệp vào, phiên bản model/gói» + năm lớp crm E15 AC-3] → AC-1, AC-2
- Trục B — vì sao vẫn chạy: lệnh dấu vân tay hỏng · ép chạy · không `paths` · `paths` không chứng được · cây hồ sơ bẩn · `--allow-dirty` · lệnh đã chạy ở suite · eval không thuộc `model_evals`  [thước CE: bảng điều kiện của Đ2 + trục B crm E15] → AC-4
- Trục C — nguồn: không có · cùng băm còn hạn · quá hạn · ghi giờ sau lượt · dòng chỉ dùng lại (dàn phẳng) · nhiều nguồn (mới nhất) · cùng băm đã lệch  [thước CE: luật carry Đ2] → AC-3, AC-5, AC-6
- Cross-cutting — hiện ra và đọc được: dòng `repin`/`repin-do` · section · tổng kết · stderr · khuôn SKILL · bên đọc hiện tại và bản trước · khoá vắng như cũ · đường đo → AC-1, AC-7, AC-8, AC-9, AC-10, AC-11; hạng giữ T2 → AC-12.
- Later: dùng lại cho MỌI eval máy (Đ2 đầy đủ) · bên đọc chứng chuỗi dùng lại (T3) · dùng lại trong lượt chấm S4 · lệnh dấu vân tay riêng mỗi eval · băm tệp chưa theo dõi ngoài cây hồ sơ · ép chạy lại theo từng eval.
- Never: ghi giá trị biến môi trường hay đầu ra lệnh dấu vân tay ra sổ (chỉ băm) · bên đọc so tuổi với giờ hiện tại (CI tự đỏ sau 7 ngày không đổi gì — trái luật ghim lại theo release) · dùng lại từ dòng `repin-do` (lượt đỏ không bao giờ là bằng chứng).

## Đường đo

- Lượt ghim lại không đổi đầu vào của eval model thì chi phí model của eval đó bằng 0 · số từ: `dem-dung-lai-model.mjs` trên run-log của crm 14 ngày sau khi cài (`model_carry`, `model_goi`, `tong_ket.chi_phi`) · AC-1, AC-10 bảo đảm số ấy là vật làn ghi.
- Không dùng lại sai · số từ: cùng script — ngưỡng CHẾT của ô cơ hội («carry_lech … dùng lại kết quả mà đầu vào thật đã đổi») đọc các lượt `carry_lech` mang nhãn «nghi thiếu đầu vào»; lượt «lệch không tất định» báo eval chập chờn cùng đầu vào, không tính CHẾT; dòng «nguồn không có» đếm giới hạn bên đọc · AC-6, AC-10.

## Out of scope

- Dùng lại cho mọi eval máy (Đ2 đầy đủ, 59 % lần chạy eval ở crm) — điểm đổi cái được tính là «đã chứng» cho cả bộ đo; hạt giống `2026-10-06-hat-giong-gia-lan-ghim-lai-vong-b.md`.
- Bên đọc pin chứng lại chuỗi dùng lại (`lib/evidence-core.cjs`, `pre-merge-check.sh`) — đổi hạng sang T3, bắt crm chép lại lớp CI; giới hạn khai kèm ngưỡng ở Notes.
- Dùng lại trong lượt chấm S4 — S4 đã có carry theo `paths`; hồ sơ mới thì đầu vào vốn đổi.
- Khoá `long_running` và nhóm chạy riêng của S4 (N8) — không đổi; làn ghim lại không có trần công cụ.
- Đổi cách crm E15 tự dùng lại bản ghi của nó — việc của crm.

## Notes

- Giới hạn khai, mỗi cái một ngưỡng (đếm bằng `dem-dung-lai-model.mjs`):
  - `paths` thiếu đầu vào, hoặc eval không tất định → kết quả dùng lại không còn đúng. Ngưỡng mở vòng siết: `carry_lech` ≥ 1 ở bất kỳ kho nào.
  - Tệp chưa theo dõi ngoài cây hồ sơ vô hình với băm (cùng giới hạn `--skip-unchanged`, ADR 0019). Cùng ngưỡng.
  - Model trôi mà giữ nguyên id không bắt được trong 7 ngày — owner chấp nhận ở crm E15 (10/10) và ở Cổng Đáng vòng này.
  - Bên đọc không chứng lại chuỗi dùng lại. Ngưỡng mở vòng răng bên đọc (T3): ≥ 1 dòng «nguồn không có».
- Lượt ghim lại đầu tiên sau khi bật khoá chạy trọn (dòng đời trước không có băm).
- AC-12 chỉ thấy commit mang dấu của vòng — một commit của vòng quên dấu thì vô hình với nó. Lưới: nghi thức commit của vòng (mọi tiêu đề mang `(eval-goi-model-that-khong-chay)`), và lưới hạng ở trước-gộp vẫn đọc trọn diff PR.
- Phát hành theo mốc 01/11; engine không đổi dưới chân crm trước 14/10. Một vòng khác đang sửa nhánh làn đỏ của `repin-lane.mjs` (`vong/gate-card-xa-stdout-qua-pipe`) — gộp `main` sau khi nó vào.
