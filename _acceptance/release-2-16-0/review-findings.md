# Review Findings: release-2-16-0 (round 1)

## Trong hợp đồng

- **rang-so-tang.sh (E1b/AC-1) đỏ vĩnh viễn: neo = chính commit nâng số**
  file: `_acceptance/release-2-16-0/rang-so-tang.sh:37`
  severity: high
  AC: AC-1
  detail: Răng neo vào `git log --diff-filter=A -- _acceptance/release-2-16-0/contract.md` — commit ĐƯA HỒ SƠ MỐC VÀO KHO. Ở mốc này hồ sơ mốc VÀ bước nâng số cùng nằm trong một commit (26bf12fe «Cổng Phạm vi (làn V) + nâng số 2.16.0»), nên `ver_tai NEO` = 2.16.0 = số ở cây → nhánh BANG → exit 3.

    Chạy thật trên worktree hiện tại:
      [neo] so tai commit dua ho so moc vao kho (26bf12fe) = 2.16.0 · so trong cay lam viec = 2.16.0
      DO: so (2.16.0) BANG so tai neo — buoc nang so cua moc nay CHUA CHAY  → exit=3

    E1b trong evals.yaml đòi exit 0, và eval này KHÔNG thể xanh bằng cách chạy lại: neo là một commit lịch sử. Hai mốc trước không dính vì hồ sơ vào kho TRƯỚC bước nâng số (release-2-15-0 thêm ở 81e508d5 khi manifest còn 2.14.0; release-2-14-0 ở 4c4d58f9 khi còn 2.13.0) — bản chép 2.15.0 vẫn PASS trên chính cây này. Bảy răng còn lại của mốc (p200, moc, ba chân cua-so, ghim-lai) đều PASS; chỉ mình răng này đỏ. Cần tách commit hồ sơ khỏi commit nâng số, hoặc đổi neo (ví dụ commit thêm contract.md CHA của nó / neo ghim tay vào hợp đồng như chính §5 mục 0 đề xuất).
  source: conventions
  rationale: AC-1 Then đòi rõ "số ở cây LỚN HƠN theo semver số tại commit đưa hồ sơ mốc này vào kho"; finding claim đúng vế này không thoả (bằng nhau, không lớn hơn) khi chạy răng của chính hợp đồng.

- **Chân viec-va tự chép danh sách «engine» thay vì dùng một-nguồn của kho — bỏ sót đúng tệp mốc này đổi**
  file: `_acceptance/release-2-16-0/rang-cua-so.mjs:125`
  severity: medium
  AC: AC-8
  detail: `const ENGINE = ['hooks/','lib/','scripts/','commands/','skills/','feature-loop/','diagram-design/','vendor/','tests/','.github/']` là một mảng gõ tay. Kho đã có MỘT nguồn cho «cái gì là hành vi»: `risk_tiers.t1_skip_globs` trong `_acceptance/config.yaml` (pre-merge-check.sh dùng đúng nó: «falling outside t1_skip_globs» = code đổi). Răng chị em `rang-ghim-lai.mjs` làm đúng luật này — nó rút `DA_THONG_CONG_2` từ `lib/workspace-record.cjs` và tự ghi rõ «Bài học 2.15.0 AC-8: một bản chép mảng trạng thái là một khuôn sẽ trôi». Bản chép ở đây đã trôi ngay ở lượt đầu.

    Hai lỗ cụ thể, đo được trên cây này:
    - `_acceptance/config.yaml` KHÔNG có trong t1_skip_globs (tức là hành vi), và nó ĐÃ đổi sau chữ ký b9f8766e (thêm bảy khoá executors 2_16 ở dòng 351–357), nhưng KHÔNG nằm trong khối VIEC-VA-SAU-CHU-KY (contract.md dòng 46–48, chỉ khai hai manifest). Răng vẫn in «PASS: viec-va 0 tep engine doi sau chu ky b9f8766e ngoai 2 tep cua chinh moc» — đúng lớp fail-open mà AC-8 sinh ra để đóng.
    - `.claude-plugin/` không có tiền tố nào trong ENGINE, nên `.claude-plugin/plugin.json` và `.claude-plugin/marketplace.json` vô hình; trong khi `feature-loop/.claude-plugin/plugin.json` (cùng lớp vật) lại được coi là engine qua tiền tố `feature-loop/`. Bất đối xứng này làm dòng khai `.claude-plugin/plugin.json` trong khối chỉ là trang trí.

    Hệ quả: câu «không việc nào chạm engine» ở Context + `risk_tier: T2` + ngưỡng «cửa sổ này là 0» ở Known limits đều đứng trên một phép đo có bộ lọc hẹp hơn định nghĩa của kho.
  source: conventions
  rationale: AC-8 Then định nghĩa engine là "mọi cây mã và mọi cây thước của kit" và đòi "KHÔNG tệp engine nào đổi ngoài các tệp mốc đã khai – có thì đỏ"; finding claim có tệp engine đổi sau chữ ký mà bộ lọc không bắt được, tức đúng vế Then của AC-8.

- **AC-7 khai «bảy điều bất lợi» nhưng chỉ liệt kê sáu — lệch với câu hỏi hội đồng trong evals.yaml**
  file: `_acceptance/release-2-16-0/contract.md:196`
  severity: medium
  AC: AC-7
  detail: Dòng 196–201 viết «Và nói thẳng bảy điều bất lợi:» rồi liệt kê ĐÚNG SÁU mục: (1) tìm-lỗi 71,2 % · (2) lượt gọi người 5 so trần T3 4 · (3) một lượt thi công S3 chết trọn · (4) owner tự bắt một phát hiện trong hợp đồng · (5) số chạm không đo được · (6) hiệu lực khuôn /goal chưa có số.

    `evals.yaml` E7 liệt bảy, thêm mục thứ bảy «chiến dịch ghim lại tốn 2 giờ 25 phút máy và ghim được 0 hồ sơ». Hợp đồng là nguồn sự thật của phạm vi (CONTEXT.md), nên một hội đồng đọc AC-7 sẽ đếm sáu và có thể cho qua một khối Notes che mất chính con số đắt nhất của cửa sổ — trong khi tiêu chí tự tuyên «Che bất kỳ điều nào là FAIL». Hai bên phải khai cùng một tập.
  source: conventions
  rationale: AC-7 tự tuyên "Che bất kỳ điều nào là FAIL" và nói thẳng bảy điều, nhưng chỉ liệt sáu trong chính văn bản Then của AC-7 — đây là lỗi nội tại của tiêu chí AC-7, không phải suy diễn từ AC khác.

- **AC-7 trỏ nhầm mục Notes: đòi «§4 phải gọi tên chỗ cắt» trong khi chỗ cắt ở §5**
  file: `_acceptance/release-2-16-0/contract.md:201`
  severity: low
  AC: AC-7
  detail: Dòng 201: «§4 phải gọi tên ít nhất MỘT chỗ cắt cho cửa sổ kế và định đoạt router». Notes của chính hợp đồng đánh số: §1 năm dòng số · §2 lớp vendored · §3 lớp lỗi tái phát · §4 chiến dịch ghim lại · §5 nhát cắt cho cửa sổ kế. Chỗ cắt + định đoạt router nằm ở §5; §4 không có mục nào như thế. evals.yaml E7 hỏi đúng («mục 5 có gọi tên ít nhất MỘT chỗ cắt… và mục 4 có nói đúng ba số»), nên hội đồng đi theo hợp đồng và hội đồng đi theo eval sẽ chấm hai chỗ khác nhau.

    Cùng lớp lệch số: Coverage dòng 220 ghi «bốn khối Notes và năm dòng số → AC-7», còn AC-7 (dòng 130–133) đòi ĐỦ NĂM khối.
  source: conventions
  rationale: Đây là lỗi nội tại trong chính văn bản Then của AC-7 (trỏ sai số mục Notes), làm tiêu chí AC-7 không thể chấm nhất quán — nằm trong chính hợp đồng, không phải suy diễn.

- **rang-so-tang.sh ĐỎ ngay tại HEAD — AC-1/E1b không thể xanh (neo trùng commit nâng số)**
  file: `_acceptance/release-2-16-0/rang-so-tang.sh:37`
  severity: high
  AC: AC-1
  detail: Neo của răng là commit ĐẦU TIÊN đưa `_acceptance/release-2-16-0/contract.md` vào kho (`git log --diff-filter=A ... | tail -1`). Ở mốc này hồ sơ mốc VÀ bước nâng số 2.15.0 → 2.16.0 nằm CÙNG một commit (26bf12fe «Cổng Phạm vi (làn V) + nâng số 2.16.0»), nên số tại neo = 2.16.0 = số ở cây làm việc.

    Chạy thật tại HEAD (c7cd7e2a) trong worktree:
      [neo] so tai commit dua ho so moc vao kho (26bf12fe) = 2.16.0 · so trong cay lam viec = 2.16.0
      DO: so (2.16.0) BANG so tai neo — buoc nang so cua moc nay CHUA CHAY
      EXIT=3

    E1b (`_acceptance/release-2-16-0/evals.yaml`, cmd `config:executors.script.so_tang_2_16`) đòi exit 0, và AC-1 phát biểu «số ở cây LỚN HƠN theo semver số tại commit đưa hồ sơ mốc này vào kho» — với cách commit hiện tại điều kiện ấy là bất khả, không phải chỉ đỏ một lần rồi tự lành. Hồ sơ đã chuyển `status: implemented` nên S4 sẽ đọc đúng mã 3 này.

    Thân răng giống hệt bản 2.15.0 (diff chỉ khác dòng comment tiêu đề); mốc 2.15.0 xanh vì hồ sơ của nó được mở ở commit RIÊNG trước đó (81e508d5, manifest còn 2.14.0) rồi mới nâng số ở commit sau. Tức bug nằm ở trình tự commit của mốc này, và răng — vốn dựng để bắt «quên bump» — nay khai một sự thật sai về VẬT (số đã bump rồi). Ngoài ra Known limits của hợp đồng có liệt kê hai chân sẽ đỏ ở chiến dịch ghim lại kế (viec-meta, viec-va) nhưng KHÔNG nhắc chân so-tang đang đỏ ngay bây giờ.
  source: bugs
  rationale: Cùng vế "số ở cây LỚN HƠN theo semver số tại commit đưa hồ sơ mốc này vào kho" của AC-1 Then — finding claim chạy thật tại HEAD cho kết quả bằng nhau, không lớn hơn.

- **rang-ghim-lai.mjs: nhánh làn-đỏ vẫn là HẰNG ĐÚNG — run_id/sha/exit không có vật máy giữ nào đối chiếu**
  file: `_acceptance/release-2-16-0/rang-ghim-lai.mjs:133`
  severity: high
  AC: AC-5
  detail: Răng tự khai (header + AC-5 + gap-probe P0 «fixed») rằng `run_id` «do làn tự đúc và nằm trong sổ chạy, nên nó là vật nói đã-chạy». Điều đó chỉ đúng cho làn XANH. `feature-loop/scripts/repin-lane.mjs` ở nhánh đỏ (`if (red) { ... process.exit(1) }`, dòng ~355-364) chỉ in stdout/stderr rồi thoát 1 — KHÔNG ghi `run-log.jsonl`, không ghi `evidence-report.md`, không ghi bất kỳ tệp nào. Chính thông điệp của nó là «LÀN ĐỎ — không ghi gì».

    Với khối khai của mốc này (exit khác 0), răng chỉ kiểm được: (i) sha 40 hex tồn tại trong kho — 26bf12fe là commit của chính mốc, ai cũng gõ được; (ii) không hồ sơ nào mang run_id ấy — hằng đúng với MỌI chuỗi run_id chưa từng tồn tại; (iii) danh sách rỗng. Không một vế nào chạm tới sự kiện «làn đã chạy». Một hồ sơ khai mã thoát khác 0 + một run_id bịa + danh sách rỗng cho ĐÚNG cùng dòng PASS với lượt thật tốn 2 giờ 25 phút:

      PASS: chien-dich lan repin-20260918T025435Z-51649 exit 1 tai sha 26bf12fe — 0 ho so da ky mang dong ghim lai moi nhat cua luot BANG khoi khai [rong]

    Đối chứng dương mà dòng PASS quảng cáo (72 hồ sơ đã ký, 48 hồ sơ có dòng ghim lại) đến từ các lượt ghim lại LỊCH SỬ của cửa sổ trước, không gắn vào lượt đang khai — đúng lỗ mà gap-probe P0 mô tả là «đối chứng dương không gắn vào vật của vòng» và tuyên đã sửa. Vế (c) chỉ giết hằng-đúng ở chiều exit 0; chiều exit≠0 — chiều duy nhất mà mốc này thực sự rơi vào — vẫn nguyên. Hệ quả: AC-5 «kết quả THẬT, đếm được» và ba số của Notes §4 (14/72 hồ sơ, 60 eval đỏ, 0 hồ sơ ghim) không có thước máy nào, dù hợp đồng khai là có.
  source: bugs
  rationale: AC-5 tự đặt tên là "kết quả THẬT, đếm được" và vế (c) của Then là đúng cơ chế bị chất vấn (exit khác 0 thì không hồ sơ nào mang run_id ấy); finding claim vế này hằng-đúng vô nghĩa ở nhánh exit≠0 — đúng phạm vi Then của AC-5.

- **chân viec-va (và vendored) dùng `git diff <sha>` nên tệp engine MỚI chưa `git add` là vô hình**
  file: `_acceptance/release-2-16-0/rang-cua-so.mjs:133`
  severity: medium
  AC: AC-8
  detail: AC-8 khai phép đo chạy «từ chữ ký ấy tới CÂY LÀM VIỆC», nhưng `git('diff', '--name-only', ky)` chỉ so tệp ĐÃ THEO DÕI; tệp untracked không xuất hiện (kiểm lại bằng kho tạm: thêm `lib/new.cjs` chưa `git add` → `git diff --name-only HEAD` in rỗng).

    S4 và chiến dịch ghim lại chạy trên cây làm việc TRƯỚC khi commit, nên đúng cửa sổ mà răng canh cũng là cửa sổ tệp mới chưa được stage. Một tệp engine hoàn toàn mới (`lib/…`, `scripts/…`, `hooks/…`) thêm trong cửa sổ mà chưa add sẽ không vào `tepSau`, `pham` rỗng, răng PASS — trong khi lời khai «không việc nào chạm engine», `risk_tier: T2` và ngưỡng «cửa sổ này là 0» của Known limits đều đứng trên kết luận ấy. Cùng lớp áp cho chân `vendored` (dòng ~104, `git diff --name-only neo -- ...tep`) nếu một tệp trong danh sách chép bị xoá rồi tạo lại chưa add. Đối chứng dương hiện có (cửa sổ neo..chữ-ký có tệp engine · cửa sổ sau chữ ký không rỗng) không phủ được ca này vì nó chỉ chứng minh bộ lọc engine còn thấy tệp ĐÃ COMMIT.
  source: bugs
  rationale: Trực tiếp chạm Then của AC-8 ("KHÔNG tệp engine nào đổi ngoài các tệp mốc đã khai – có thì đỏ") bằng cách chỉ ra một lớp tệp engine mà phép đo không thấy được.

- **Neo của phép đo trùng chính commit mang vật — quan hệ «số đã tăng» thành hằng-SAI (rang-so-tang.sh đang ĐỎ ở HEAD)**
  file: `_acceptance/release-2-16-0/rang-so-tang.sh:37`
  severity: high
  AC: AC-1
  detail: `NEO="$(G log --diff-filter=A --format=%H -- "$HS" | tail -1)"` lấy commit ĐẦU TIÊN thêm `_acceptance/release-2-16-0/contract.md`. Ở mốc này hồ sơ mốc VÀ bước nâng số cùng nằm trong MỘT commit: `26bf12fe` («Cổng Phạm vi (làn V) + nâng số 2.16.0: hồ sơ mốc, bốn răng chép…»), và `git show 26bf12fe:.claude-plugin/plugin.json` đã là 2.16.0. Nên `CU` = `MOI` = 2.16.0 → nhánh `BANG` → exit 3.

    Chạy thật ở cây hiện tại:
      bash _acceptance/release-2-16-0/rang-so-tang.sh
      [neo] so tai commit dua ho so moc vao kho (26bf12fe) = 2.16.0 · so trong cay lam viec = 2.16.0
      DO: so (2.16.0) BANG so tai neo — buoc nang so cua moc nay CHUA CHAY

    Hai hệ quả:
    (1) E1b (`so_tang_2_16`, evals.yaml dòng ~18) khai `expected` là exit 0 + dòng PASS, không có `expected_exit`, nên eval này ĐỎ ngay ở lượt chấm S4.
    (2) Thông điệp ĐỎ nói SAI về vật: «buoc nang so cua moc nay CHUA CHAY» trong khi bước nâng số ĐÃ chạy (2.15.0 → 2.16.0 tại chính commit ấy). Đây là thước khai một thất bại của NEO thành một sự thật về VẬT — đúng lớp mà header rang-moc.sh (dòng 5-8, «hồ sơ ĐÃ KÝ sẽ đỏ giả vĩnh viễn ở chiến dịch ghim lại kế») nói là lý do chân 4 bị TRỪ. Và nó vĩnh viễn: mọi chiến dịch ghim lại sau này chạy lại eval này trên hồ sơ đã ký và luôn ra mã 3.

    Đối chứng cho thấy đây là hồi quy chứ không phải thiết kế: bản 2.15.0 (thân giống hệt, chỉ khác dòng 2) XANH vì hồ sơ 2-15-0 vào kho ở `81e508d5` — một commit vá-trong-mốc còn mang 2.14.0, tách khỏi commit nâng số. Dòng `expected` của E1b còn ghi «trước khi hồ sơ được commit, răng rơi về HEAD đã commit» — tức nó được thử ở trạng thái hồ sơ CHƯA commit; trạng thái ấy không còn.
  source: measurement
  rationale: Cùng vế của AC-1 Then về số phải lớn hơn số tại commit đưa hồ sơ mốc vào kho.

- **Assertion âm-tính-một-mình ở nhánh làn-đỏ: không vật nào ràng `run_id`/`exit` khai vào một lượt chạy thật**
  file: `_acceptance/release-2-16-0/rang-ghim-lai.mjs:133`
  severity: medium
  AC: AC-5
  detail: Khối `CHIEN-DICH-GHIM-LAI` của contract.md (dòng 143-147) khai mã thoát khác 0 và danh sách RỖNG. Với ca ấy, toàn bộ phán quyết xanh gồm đúng ba vế: (a) `cuoiLaRun` rỗng == `khai` rỗng; (c) dòng 133 `exitKhai !== 0 && mangRun.length` — không hồ sơ nào mang `runKhai`; và dòng 92 `git cat-file -e` chứng sha khai có trong kho. Vế (b) (dòng 136-143, nơi duy nhất đối chiếu `verified_commit`) KHÔNG chạy vì `khai` rỗng.

    Không vế nào phân biệt «làn chạy 2 giờ 25 phút rồi chết ở mã thoát khác 0» với «chưa ai chạy làn nào»: `runKhai` là một chuỗi tự do — thay `repin-20260918T025435Z-51649` bằng bất kỳ chuỗi nào chưa từng xuất hiện thì cả ba vế vẫn xanh y hệt. `feature-loop/scripts/repin-lane.mjs` dòng 356-364 xác nhận làn ĐỎ **không ghi gì xuống đĩa** (chỉ stdout + thoát khác 0), nên không tồn tại tạo phẩm nào để ràng; và dòng 320 cho thấy `run_id` còn có thể do cờ `--run-id` truyền tay, không nhất thiết do làn tự đúc.

    Đối chứng dương duy nhất có mặt (`coGhim.length > 0`, dòng 119) chỉ chứng bộ đọc `run-log.jsonl` parse được dòng `kind:repin` của các CHIẾN DỊCH CŨ — nó không chứng gì về lượt đang khai. Vì thế header của chính răng (dòng 15-17: «run_id — mã lượt làn tự đúc; đây là vật nói "đã chạy", thay cho lời khai») và câu «Vế (c) là thứ giết hằng-đúng» chỉ đúng cho nhánh exit 0; ở nhánh exit≠0 — nhánh mốc này thực sự đi — nó vẫn là lời khai không có thước. Ba số headline của Notes §4 (2 giờ 25 phút, 60 eval đỏ, 14/72 hồ sơ) không có vế nào đo.
  source: measurement
  rationale: Cùng vế (c) của AC-5 Then — finding claim vế này không phân biệt được một lượt đã chạy thật với một lời khai bịa, tức Then của AC-5 không đạt được điều nó tuyên bố kiểm.

- **Lời khai `chu-ky` là tham số tự do — răng chỉ kiểm sha TỒN TẠI, nên neo trượt được và kết luận «0 tệp engine» hoá rỗng nghĩa**
  file: `_acceptance/release-2-16-0/rang-cua-so.mjs:120`
  severity: medium
  AC: AC-8
  detail: Chân `viec-va` đọc sha chữ ký từ dòng 1 khối `VIEC-VA-SAU-CHU-KY` rồi kiểm DUY NHẤT `git cat-file -e ${ky}^{commit}` (dòng 120). Không vế nào buộc sha ấy là chữ ký Cổng Bằng chứng của vòng meta được nêu tên: không đối chiếu với `_acceptance/thuoc-co-cua/evidence-report.md` (`verified_commit` ở đó là `f53fc76f`, khác `b9f8766e`), không đối chiếu `decisions.jsonl`, không kiểm thông điệp commit.

    Hệ quả đo được: mọi commit có trong kho đều là lời khai hợp lệ, nên bên khai trượt neo về phía trước là thu nhỏ cửa sổ bị soi. Hai chốt còn lại không chặn được: dòng 136 chỉ đòi cửa sổ `ky..cây` KHÔNG rỗng, và đối chứng dương ở dòng 131 đo cửa sổ KHÁC (`neo..ky`) — nó chứng bộ lọc engine thấy tệp engine trong cửa sổ LỊCH SỬ, chứ không chứng gì về cửa sổ mà kết luận nói tới. So với răng bên cạnh, sự bất đối xứng lộ rõ: `rang-ghim-lai.mjs` dòng 141-142 ràng `sha` khai vào `verified_commit` của từng hồ sơ; chân này không ràng gì cả.

    Ở cây hiện tại, cửa sổ `b9f8766e..cây` có 21 tệp đổi mà chỉ MỘT tệp lọt bộ lọc engine — tức phán quyết «0 tệp engine đổi» đứng trên đúng một phép so, trong khi dòng PASS quảng cáo «doi chung: cua so 89fbc87b..b9f8766e co 30 tep engine» lấy số từ cửa sổ không liên quan.
  source: measurement
  rationale: AC-8 Given đòi dòng đầu của khối khai là "chữ ký Cổng Bằng chứng của vòng meta"; finding claim răng không đối chiếu sha ấy với chữ ký thật, làm Given/Then của AC-8 không được bảo đảm.

- **Bộ lọc `laEngine` bỏ `.claude-plugin/`, nên một trong hai «tệp của mốc» được loại trừ là trang trí và dòng PASS đếm thừa**
  file: `_acceptance/release-2-16-0/rang-cua-so.mjs:125`
  severity: low
  AC: AC-8
  detail: `const ENGINE = ['hooks/', 'lib/', 'scripts/', 'commands/', 'skills/', 'feature-loop/', 'diagram-design/', 'vendor/', 'tests/', '.github/']` không có `.claude-plugin/`. Khối khai `VIEC-VA-SAU-CHU-KY` (contract.md dòng 46-48) liệt kê hai tệp loại trừ: `.claude-plugin/plugin.json` và `feature-loop/.claude-plugin/plugin.json`. Tệp thứ nhất KHÔNG BAO GIỜ lọt `laEngine` (không khớp tiền tố nào), nên việc khai nó không loại trừ gì — chỉ tệp thứ hai là loại trừ thật.

    Hai hệ quả cụ thể: (1) dòng PASS ở dòng 139 in «ngoai ${cuaMoc.length} tep cua chinh moc» = «ngoai 2 tep», một con số bên đọc bằng chứng không kiểm lại được và cao hơn thực tế; (2) toàn bộ `.claude-plugin/` — kể cả `marketplace.json`, bề mặt đăng ký plugin của kit — vô hình với AC-8: đổi nó sau chữ ký mà không khai thì răng vẫn xanh. Chú thích dòng 123-124 nói phần bị loại là «Văn (docs, README…) và hồ sơ xưởng»; `.claude-plugin/` không thuộc hai loại ấy, nên đây là lỗ chứ không phải loại trừ đã khai.
  source: measurement
  rationale: Trực tiếp chạm định nghĩa "engine" và cơ chế loại trừ tệp mốc của AC-8 Then — nếu .claude-plugin/ vô hình với bộ lọc, một phần lời khai loại trừ của AC-8 không có tác dụng thật.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **W6 lint: AC-7 dùng «spec», từ nằm trong _Avoid_ của CONTEXT.md**
  Người dùng thấy gì: Việc dùng từ "spec" thay vì tên chuẩn trong một dòng tài liệu nội bộ không làm thay đổi gì người dùng nhận được — đây là lỗi thuật ngữ trong văn bản nội bộ của đội, không chạm tính năng hay bằng chứng của mốc phát hành.
  file: `_acceptance/release-2-16-0/contract.md`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).