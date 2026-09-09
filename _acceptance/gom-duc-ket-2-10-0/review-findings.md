## Trong hợp đồng

- **Chiều đỏ của PV5 là assert vô điều kiện (răng rỗng)**
  file: `tests/scripts/w6-w8-pham-vi.test.mjs:154`
  severity: high
  AC: AC-5
  PV5 tự khai có «chiều đỏ của phép quét» nhưng phép đó không bao giờ đỏ được:

    const probe = code.filter(l => !/L42m/.test(l));
    if (probe.filter(l => /L42m/.test(l)).length !== 0) fail(id, 'phép quét không phân biệt được bản sao đã gỡ ca');

  `probe` được dựng bằng cách LOẠI mọi dòng khớp /L42m/, nên `probe.filter(l => /L42m/.test(l))` luôn rỗng theo cấu tạo — nhánh `fail` không đạt tới được với bất kỳ nội dung nào của `tests/scripts/run-tests.sh`. Nó không chạy lại phép quét thật trên bản sao; chiều đỏ đúng phải là khẳng định bộ dò (hai nhánh `l47Case` / `l42mLines` ở dòng 148–152) SẼ kêu trên `probe`, ví dụ `probe.filter(l => /L42m/.test(l)).length === 0` phải kích hoạt đúng thông điệp «không tìm thấy ca L42m».

  Đây đúng lớp lỗi CLAUDE.md gọi tên hai lần («assertion âm-tính-một-mình là assertion không sống», và ghi chú của chính vòng này về «assert vô điều kiện»): PV5 hiện chỉ có chiều dương, nếu bộ dò L42m chết thì không phép đo nào biết. Ca này đang XANH trên cây, nên nó âm thầm chứng nhận một thứ chưa từng được kiểm.
  Rationale: AC-5(d) đòi ca L42m phải chứng minh được mutant bỏ alias thật sự đã chạy (token_la [web]); assert hằng-đúng ở đây không làm được điều đó nên AC-5 chưa đạt.

- **loop-health: `git log -S` khớp CHỮ trong thân hợp đồng, nên «làm-xong → quyết-được» ra số sai (có ca ÂM)**
  file: `scripts/loop-health.mjs:115`
  severity: high
  AC: AC-8
  `firstOf(needle)` chạy `git log --format=%cI --reverse -S "<needle>" -- _acceptance/<slug>/contract.md` rồi lấy dòng đầu. `-S` khớp MỌI commit làm đổi số lần xuất hiện của chuỗi ở BẤT KỲ đâu trong file — kể cả khi chuỗi nằm trong văn AC chứ không phải ở frontmatter. Nhiều hợp đồng trích nguyên văn `status: signed-off` / `status: implemented` trong tiêu chí (đo trên cây này: 4 hồ sơ — judge-required-evidence, premerge-unjudged-pass, ra-co-ten-lam-va-trao, status-chua-arm-cong).

  Chiều đỏ chạy thật: `node scripts/loop-health.mjs --root .` in `premerge-unjudged-pass -64′` và `ra-co-ten-lam-va-trao -98′` — thời lượng ÂM, tức mốc «ký» được tính trước mốc «làm xong». Truy nguyên: với premerge-unjudged-pass, `firstOf('status: signed-off')` trả về `db4a23ed` (commit Cổng 1, 2026-07-28T20:20) vì contract.md tại commit đó đã chứa chuỗi `status: signed-off` trong AC-1 và AC-9; commit ký thật là `c858ad3f` (2026-07-29T08:05). Với các hồ sơ khác cùng hình dạng, sai số đi theo chiều LẶNG (số phình to) chứ không âm nên không ai thấy.

  Đây là dòng số ĐẦU TIÊN của luật (c) — chính thứ script sinh ra để đếm. Không có chỗ nào chặn giá trị âm/vô lý, và `--check-hand` không phủ `minutes` (chỉ so `tiers`), nên `rang.sh --chan loop-health-that` vẫn PASS. Hướng sửa: đọc trạng thái từ dòng frontmatter (`^status:` trong khối `---`) của từng revision, hoặc ít nhất từ chối/gắn cờ khi `minutes < 0`.
  Rationale: AC-8(a) yêu cầu dòng số «làm-xong→quyết-được đúng theo giờ commit»; số ÂM đo được trên chính cây kit chứng minh yêu cầu này chưa đạt.

- **loop-health: `infra_burned` đếm mọi lần xuất hiện chữ «BLOCKED» trong văn xuôi, không đếm round**
  file: `scripts/loop-health.mjs:110`
  severity: medium
  AC: AC-8
  `const blockedRounds = (it.match(/BLOCKED/g) || []).length;` grep chuỗi trên TOÀN BỘ section `## Iterations`, trong khi các dòng còn lại của cùng hàm đếm round bằng neo có cấu trúc (`/^\s*(?:[-*]\s*)?(?:\*\*)?Round\s+(\d+)/gim`).

  Đo thật trên cây này: `_acceptance/s4-scope-triage/evidence-report.md` có 3 round BLOCKED nhưng 6 lần chữ «BLOCKED» trong Iterations, vì mỗi mục viết cả «verdict BLOCKED …» lẫn «Nguyên nhân BLOCKED: …» → đếm gấp đôi. `repo-khai-plugin` 4 lần, `t1-escape-event-scope` 2 lần, cùng hình dạng.

  Hệ quả: dòng số thứ ba của luật (c) («vòng bị hạ-tầng đốt», in ra 297 ở cây này) phình theo cách người viết report diễn đạt — số càng chi tiết thì càng cao. Cùng lớp với finding trên: phép đo bám VĂN thay vì bám VẬT. Sửa: đếm số round trong Iterations mà mục của round đó chứa BLOCKED (một lần/round), không đếm chuỗi.
  Rationale: AC-8(a) định nghĩa rõ «vòng bị hạ tầng đốt = round BLOCKED»; đếm theo số lần xuất hiện chữ thay vì số round là sai đúng phép đo mà AC yêu cầu.

- **Hình dạng 4 — «chiều đỏ» của PV5 là assert vô điều kiện, không bao giờ đỏ được**
  file: `tests/scripts/w6-w8-pham-vi.test.mjs:153`
  severity: medium
  AC: AC-5
  Hai dòng được chú thích là «chiều đỏ của phép quét»: `const probe = code.filter(l => !/L42m/.test(l));` rồi `if (probe.filter(l => /L42m/.test(l)).length !== 0) fail(...)`. `probe` được dựng bằng cách loại MỌI dòng khớp /L42m/, rồi assert rằng probe không còn dòng nào khớp /L42m/ — hằng đúng theo cấu trúc, độc lập hoàn toàn với nội dung `tests/scripts/run-tests.sh`. Nó không hề chạy lại phép quét (l42mLines / kiểm token_la) trên bản sao đã gỡ ca, tức không chứng minh được phép quét ở dòng 149-151 phân biệt được «suite còn ca L42m» với «suite đã mất ca». Kết quả: PV5 chỉ còn hai assert dương (L47 vắng, L42m có token_la) không có đối chứng nào chứng minh phép quét biết đỏ.
  Rationale: Cùng lỗi với ca PV5 nêu trên: AC-5(d) đòi chiều đỏ mutant phải chứng minh được, còn assert hằng-đúng thì không bao giờ có thể đỏ.

- **Hình dạng 4 — bất biến thường trực của rang.sh --chan cay-that là assert âm-tính-một-mình trên chuỗi không mã nào còn sinh ra được**
  file: `_acceptance/gom-duc-ket-2-10-0/rang.sh:44`
  severity: medium
  AC: AC-5
  Chân cay-that ghim BẤT BIẾN THƯỜNG TRỰC = 0 dòng «W8 surfaces carry token» ở mọi cây có mặt (dòng 44 grep -c, dòng 48 FAIL nếu tk != 0). Nhưng chính diff này đã XOÁ nhánh sinh chuỗi đó khỏi `scripts/eval-coverage-lint.js` (AC-5d); grep toàn cây xác nhận chuỗi «surfaces carry token» giờ chỉ còn trong test/plan/hồ sơ, không còn trong bất kỳ đường sinh cảnh báo nào. Vì thế nhánh FAIL này không thể nổ với BẤT KỲ input nào của bất kỳ cây nào — nó là assert âm-tính không có đối chứng dương chứng minh phép đo còn phân biệt được. Dấu hiệu quét dương ở dòng 41 chỉ chứng minh «lint đã chạy», không chứng minh «bộ dò token-lạ còn sống». expected của E5b trong evals.yaml có khai chiều đỏ («lint cũ trên artifact-platform -> W8-token 140 -> đỏ nêu số») nhưng rang.sh không bao giờ chạy bản lint cũ, nên chiều đỏ đó chỉ tồn tại trong lời văn.
  Rationale: AC-5(e) đặt bất biến «0 dòng W8 surfaces carry token» làm phép đo thường trực; chuỗi đó không còn đường sinh ra nên phép đo không còn khả năng phân biệt đúng/sai, tức AC-5(e) chưa thật sự được chứng minh.

- **Hình dạng 4 — E8b: expected khai số và bất biến mà phép đo không chạy, đầu ra PASS không ghim số nào**
  file: `_acceptance/gom-duc-ket-2-10-0/evals.yaml:118`
  severity: medium
  AC: AC-8
  expected của E8b hứa ba thứ: (1) in bảng tier với T2 round-usage 3.06±0.05, tokenS4 43.8M±0.5M; T3 3.25±0.05, 55.6M±0.5M; T3 Iterations 5.5±0.1; (2) bất biến máy-với-máy «--json == text cùng sha»; (3) dòng cuối PASS: LH-THAT. Thực tế rang.sh dòng 62 chỉ chạy `loop-health.mjs --root ... --at 8caa9998 --check-hand mocs-tay.json`. Ba lệch: (a) `--json` không hề được gọi, không có so sánh json-với-text nào — bất biến (2) không tồn tại trong phép đo; (b) mocs-tay.json ghim T2.round_usage 3.0 (không phải 3.06), T3.token_s4 54400000 (không phải 55.6M), T3.round_iter 6.6 (không phải 5.5) — số trong expected khác số thực sự bị ghim; (c) checkHand ở `scripts/loop-health.mjs:205` khi đạt chỉ in đúng một dòng «PASS: LH-THAT», không in bảng nào, nên bằng chứng thu được không chứa số nào để đọc lại — đã chạy thử: đầu ra là một dòng PASS. Người đọc evidence không phân biệt được «số máy khớp số tay đã khai» với «số tay đã bị sửa theo máy».
  Rationale: AC-8(b) đòi hỏi so sánh --json với text cùng sha và số máy phải đối chiếu được với mocs-tay.json; eval E8b không chạy --json và không in số nào để đối chiếu, nên AC-8(b) chưa được chứng minh đầy đủ.

- **Hình dạng 3 — LH1 assert chuỗi-có-mặt bằng OR nên nhận cả bản đúng lẫn bản hỏng**
  file: `tests/scripts/loop-health.test.mjs:93`
  severity: low
  AC: AC-8
  `if (!/đếm tay|s-a 3/.test(text)) fail(id, 'bản chữ không nói rõ dòng lượt-gọi-người')`. Hai vế của OR là hai đầu ra LOẠI TRỪ nhau của cùng một dòng in trong `scripts/loop-health.mjs:180`: có hồ sơ khai `human_calls` thì in «s-a 3», không hồ sơ nào khai thì in «đếm tay (không hồ sơ nào khai human_calls:)». Vì thế nếu đường đọc human_calls hỏng hoàn toàn (mọi hồ sơ trả null), dòng chữ đổi sang nhánh «đếm tay» và assert này vẫn xanh — nó không đo được QUAN HỆ «bản chữ nói đúng human_calls của s-a», chỉ đo «một trong hai chuỗi có mặt». Ràng buộc thật nằm ở assert JSON phía trên (`a.human_calls !== 3`), nên assert này chỉ thêm màu xanh không mang thông tin.
  Rationale: AC-8(a) đòi dòng chữ phải phản ánh đúng việc đọc human_calls: có/không; assert OR chấp nhận cả hai nhánh nên không thật sự kiểm chứng được yêu cầu này của AC-8.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Câu `<dir>/**` trong contract làm suite tests/plugins đỏ (P161 zero-tolerance)**
  Người dùng thấy gì: Một câu mô tả phạm vi trong hồ sơ đang khiến bộ kiểm tra nội bộ của kit báo lỗi, có thể làm chậm việc phát hành nếu không được sửa trước khi gộp.
  file: `_acceptance/gom-duc-ket-2-10-0/contract.md`
  severity: high
  Đề xuất: known-limits

- **Contract còn khai phủ K4/K7 và ngưỡng của mã đã gỡ**
  Người dùng thấy gì: Bảng tổng kết phạm vi trong hồ sơ vẫn liệt kê hai phần việc đã bị rút khỏi vòng này, có thể khiến người đọc báo cáo sau này hiểu nhầm là đã hoàn tất.
  file: `_acceptance/gom-duc-ket-2-10-0/contract.md`
  severity: medium
  Đề xuất: known-limits

- **Đường đọc-cũ của nguong-o-co-hoi.cjs không còn sống: lỗi chuyển từ require-time sang call-time**
  Người dùng thấy gì: Các dự án khác đang dùng bản sao thư viện cũ của kit có thể bị dừng chương trình đột ngột thay vì được xử lý êm khi kit này cập nhật.
  file: `lib/nguong-o-co-hoi.cjs`
  severity: medium
  Đề xuất: known-limits

- **W6 im lặng bỏ luật khi hợp đồng không có heading `## Criteria` — không có dòng rơi-bậc**
  Người dùng thấy gì: Nếu một tài liệu tiêu chí thiếu đúng tên tiêu đề quy định, công cụ rà từ ngữ sẽ bỏ qua toàn bộ tài liệu mà không báo hiệu, khiến lỗi dùng từ có thể lọt qua âm thầm.
  file: `lib/context-glossary.js`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — NO4 tuyên «ma trận toàn phần» của một LỚP nhưng bộ lọc chỉ thấy 1/11+ phần tử**
  Người dùng thấy gì: Bộ kiểm tra tự nhận đã rà soát toàn bộ nơi hiển thị kết quả nhưng trên thực tế chỉ rà một phần nhỏ, nên các chỗ hiển thị còn lại có thể mang lỗi định dạng mà không ai phát hiện.
  file: `tests/scripts/lnt-no.test.mjs`
  severity: high
  Đề xuất: new-contract

⚠ Cụm ngoài vùng phủ: 3/12 lỗi rơi vào file không bộ đo nào phủ (_acceptance/gom-duc-ket-2-10-0/contract.md, _acceptance/gom-duc-ket-2-10-0/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
