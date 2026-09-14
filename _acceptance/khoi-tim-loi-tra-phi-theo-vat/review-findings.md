## Trong hợp đồng

### 1. laNgoaiVat đổi sang phép thuộc-tập trên tệp-trong-diff → bộ lọc ngoài-vật im lặng tắt cho mọi tệp NGOÀI diff (docs/**, CLAUDE.md, gap-probe.md chưa commit)
- file: `feature-loop/workflows/acceptance-verify.js:528`
- severity: medium
- source: conventions
- AC: AC-4

`laNgoaiVat = pth => ngoaiVatSet.has(pth)` với `ngoaiVatSet` dựng từ `args.ngoaiVatFiles`, mà bên viết chỉ tính `ngoaiVatFiles = diffTatCa.filter(laNgoaiVat)` (s4-args.mjs:327) — tức CHỈ tệp trong diff.

Trước đổi khuôn, bên đọc khớp glob nên finding ở BẤT KỲ tệp nào thoả `t1_skip_globs` / `HO_SO_VAN_BAN_GLOBS` đều bị bỏ. Nay finding ở tệp ngoài-vật mà KHÔNG nằm trong diff đi thẳng vào triage + refute. Ví dụ cụ thể trong kho này: `docs/**`, `README.md`, `CLAUDE.md`, `CONTEXT.md` (đều trong `risk_tiers.t1_skip_globs`) — làn `conventions` được lệnh đọc CLAUDE.md nên báo finding trên chính CLAUDE.md là ca thường; và `_acceptance/<slug>/gap-probe.md` khi chưa commit thì không có trong `git diff --name-only` nên cũng lọt.

Comment gọi đây là «hệ quả đẹp» vì nó cho lớp liên-file đi tiếp, nhưng nó gộp hai lớp khác hẳn nhau: tệp SẢN PHẨM ngoài diff (phải đi tiếp) và tệp KHÔNG-PHẢI-VẬT ngoài diff (phải im). Đây đúng là chiều ĐẶC HIỆU mà T3/vung-vat-mutants sinh ra để đóng, và răng hiện có không bắt được: VVM-IM chỉ thử tệp đã có sẵn trong `ngoaiVatFiles`, không có ô nào cho tệp ngoài-vật NGOÀI diff. Chi phí: triage + refute + chỗ trên bản findings cho thứ repo đã khai là không-phải-hành-vi.

Rationale AC-4: AC-4 yêu cầu không điều kiện «finding có file khớp ngoài-vật bị bỏ TRƯỚC triage»; finding cho thấy tệp khớp mẫu ngoài-vật nhưng nằm ngoài diff không bị lọc, đúng Then của AC-4 thất bại.

### 2. vung-vat-mutants.test.mjs chép TAY bản thứ tư của globToRe thay vì rút từ nguồn
- file: `tests/workflows/vung-vat-mutants.test.mjs:42`
- severity: medium
- source: conventions
- AC: AC-5

`khopMau` gõ lại nguyên vẹn thân `globToRe` (split '**/', escape lớp ký tự, `?` → `[^/]`, `*` → `[^/]*`) ngay dưới comment tuyên bố mục đích là «để không phải ca tự bịa ra một định nghĩa thứ hai».

Kho đã có hai bản thật (feature-loop/scripts/carry-plan.mjs:83 và feature-loop/workflows/acceptance-verify.js:491) và chúng ĐÃ trôi thật ở ký tự `?` — lớp lỗi mà chính vòng này đi sửa. Tệp anh em tests/scripts/s4-args-vung-vat.test.mjs xử đúng nghi thức: rút hàm của bên ĐỌC TỪ NGUỒN bằng regex rồi `new Function`, và thêm ma trận VV4b so hai bản. Ca này thì tạo bản thứ ba/tư bằng tay, nên khi `globToRe` đổi (ví dụ thêm ngữ nghĩa cho `[...]` hay `{a,b}`), `khopMau` không theo và assert VVM-KHAI vẫn xanh — đúng hình dạng (2) «fixture cho judge là văn viết tay không code path nào sinh ra» trong luật «thước phải gắn vào vật» của CLAUDE.md. Sửa: import `globToRe` từ carry-plan.mjs (test chạy ngoài sandbox, import được — VV4 làm vậy) hoặc rút từ acceptance-verify.js đúng như s4-args-vung-vat.test.mjs.

Rationale AC-5: AC-5 đòi «răng» của bộ test hai-chiều-và-mutant phải sống; một khuôn khớp glob chép tay có thể trôi khỏi bên viết khiến răng không còn phản ánh đúng hành vi thật, đúng điều AC-5 yêu cầu phải tránh.

### 3. Bộ lọc ngoài-vật thành thuộc-tập chỉ-trong-diff → finding trên văn bản hồ sơ NGOÀI diff không còn bị lọc (fail-open)
- file: `feature-loop/workflows/acceptance-verify.js:527`
- severity: high
- source: bugs
- AC: AC-4

`laNgoaiVat = pth => ngoaiVatSet.has(pth)` với `ngoaiVatSet` dựng từ `args.ngoaiVatFiles`, mà bên viết tính là `diffTatCa.filter(laNgoaiVat)` (s4-args.mjs:327) — CHỈ tệp trong diff. Mọi tệp ngoài-vật KHÔNG nằm trong diff (ví dụ `_acceptance/<slug>/contract.md` không đổi ở vòng này, `_acceptance/<slug-khác>/evidence-report.md`, `docs/**` trong `t1_skip_globs`) nay trả false → finding trên chúng đi thẳng qua triage + refute + lên thẻ Cổng 2.

Đây đúng lớp «chiều im» mà T2/AC-5 sinh ra để đóng (CLAUDE.md: «chạm một thứ KHÔNG phải vật … phép đo này có IM không»; dữ liệu nền: 20/20 refuter của một lượt chấm soi hồ sơ, 0 soi vật). Chú thích trong mã chỉ biện minh cho chiều liên-file (mã sản phẩm ngoài diff), không nêu rằng nó đồng thời mở cửa cho văn bản hồ sơ/tài liệu ngoài diff.

Ca thật ở chính vòng này: `_acceptance/khoi-tim-loi-tra-phi-theo-vat/contract.md` KHÔNG nằm trong diff 4d05aeeb..HEAD → không có trong `ngoaiVatFiles` → không bị lọc.

Đo được bằng harness (finding trên `/repo/_acceptance/demo/contract.md`, ngoài diff):
```
nhánh MỚI (ngoaiVatFiles) → boNgoaiVat = []           ← lọt vào triage
nhánh CŨ  (ngoaiVatGlobs) → boNgoaiVat = [{file:"_acceptance/demo/contract.md", …}]
```

VVM1/VVM2 và W41 chỉ dùng tệp hồ sơ CÓ trong `ngoaiVatFiles`, nên chiều này không có răng.

Hướng sửa: giữ vế glob ở bên đọc cho quyết định lọc đầu ra (bên viết truyền cả `ngoaiVatFiles` lẫn `ngoaiVatGlobs`; dùng tập cho tệp trong diff, dùng glob cho tệp ngoài diff), hoặc nói rõ vế miễn trừ «tệp ngoài diff mà khớp mẫu văn-bản-hồ-sơ vẫn bị lọc».

Rationale AC-4: cùng cơ chế như finding #1 (laNgoaiVat/ngoaiVatSet) — AC-4 yêu cầu finding khớp ngoài-vật bị bỏ trước triage không kèm điều kiện diff, và hành vi thực tế không làm được điều đó.

### 4. Hình dạng 4 (khai kỳ vọng không ai kiểm): E7 khai chuỗi «PASS: W44b verdict PASS» không hề tồn tại trong đầu ra, và khai một mutant chiều-đỏ không tồn tại trong tệp ca
- file: `_acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml:114`
- severity: medium
- source: measurement
- AC: AC-7

E7 khai `expected` có «PASS: W44b verdict PASS, khong BLOCKED vi baseline». Đầu ra thật của `node tests/workflows/acceptance-verify.test.mjs` in «PASS: W44b verdict van la REJECT (khong BLOCKED vi baseline)» — `grep -c "PASS: W44b verdict PASS"` trả 0. Vòng này sửa `_acceptance/config.yaml` (khoá `ktl_w44_baseline_roi_gang`) đổi chuỗi grep từ «PASS: W44b verdict PASS» sang «PASS: W44c nonDiscriminating chua E1/E2», tức phép đo máy đã chuyển sang kiểm chuỗi khác, còn `expected` giữ nguyên chuỗi chết — hồ sơ nói một đằng, thước đo một nẻo, và không có gì đỏ. Cùng dòng expected (evals.yaml:116-119) còn khai «Chiều đỏ ghim thông điệp: mutant bỏ lượt đợi baseline ở điểm muộn → W44c đỏ»; trong tệp ca, W44c (acceptance-verify.test.mjs:2567-2573) chỉ có MỘT lượt chạy bản thật, câu «bo luot doi baseline o diem muon» chỉ nằm trong chuỗi detail của `check`, không có mũi tiêm nào được chạy.

Rationale AC-7: E7 là eval máy của chính hợp đồng này cho hành vi baseline; AC-7 đòi có chiều đỏ ghim thông điệp khi bỏ lượt đợi baseline ở điểm muộn, và finding cho thấy chiều đỏ đó không tồn tại trong tệp ca còn expected đã lệch khỏi thước đo thật — đúng Then của AC-7 không được xác minh được.

### 5. Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): VVM-CU gõ tay `ngoaiVatGlobs` trong khi HO_SO_GLOBS đã rút từ bên viết ngay phía trên
- file: `tests/workflows/vung-vat-mutants.test.mjs:117`
- severity: low
- source: measurement
- AC: AC-5

Dòng 24-28 rút `HO_SO_VAN_BAN_GLOBS` từ khối marker NGOAI-VAT của `s4-args.mjs` đúng nghi thức một-nguồn, rồi dùng nó ở dòng 42-48 chỉ để tự kiểm danh sách của ca. Nhưng ca VVM-CU — ca duy nhất còn chạy phép KHỚP GLOB thật ở bên đọc — lại gõ tay `ngoaiVatGlobs: ['_acceptance/*/**/*.md', '_acceptance/*/**/*.jsonl']` ở dòng 117 thay vì `[...HO_SO_GLOBS]`. Nếu bên viết đổi mẫu (thêm/sửa/bỏ một glob), ca này vẫn xanh vì nó đang khớp với bản chép tay, không với định nghĩa của bên viết — đúng lớp lỗi mà phần rút-từ-marker ở đầu tệp dựng ra để chặn.

Rationale AC-5: cùng tệp/cùng yêu cầu «răng sống» của AC-5 như finding #2 — ca VVM-CU chép tay mẫu glob thay vì rút từ nguồn khiến răng của đường đọc-cũ có thể không còn phản ánh đúng bên viết.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **coverageFiles chỉ chứa tệp TRONG DIFF → finding liên-file trên tệp ĐÃ được eval.paths phủ bị đếm là «ngoài vùng phủ»**
  Người dùng thấy gì: Hệ thống rà lỗi có thể tự ý báo hiệu sai rằng phạm vi công việc chưa được kiểm đủ, dù thực tế đã đủ, buộc người phải dừng lại quyết định mở rộng hay thu hẹp phạm vi một cách không cần thiết.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hợp đồng args trong SKILL.md không khai bốn khoá mới mà s4-args bắt đầu sinh**
  Người dùng thấy gì: Tài liệu hướng dẫn nội bộ về cách cấu hình tính năng này đã lạc hậu so với những gì hệ thống thực sự cần, có thể khiến người thiết lập sau này cấu hình sai mà không biết.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Vùng phủ đổi từ khớp-glob sang thuộc-tập chỉ-trong-diff → báo «cụm ngoài vùng phủ» GIẢ cho finding liên-file**
  Người dùng thấy gì: Hệ thống rà lỗi có thể tự đưa ra cảnh báo phạm vi kiểm tra sai và buộc người dừng việc lại để quyết định mở rộng hay thu hẹp phạm vi, dù không cần thiết.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: high
  Đề xuất: new-contract

- **wf-usage: dòng tiêu đề và TỔNG vẫn đếm DÒNG (agent × model) thay vì agent phân biệt — mâu thuẫn với bảng byRole vừa sửa**
  Người dùng thấy gì: Báo cáo chi phí vận hành của hệ thống có thể hiển thị hai con số khác nhau cho cùng một đại lượng (số tác nhân máy đã chạy) ngay trong cùng một báo cáo, khiến người đọc dễ hiểu sai mức chi phí thực.
  file: `feature-loop/scripts/wf-usage.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 (đo CHỈ DẪN thay vì ĐẦU RA): W41a2 đặt key `paths` mà bên đọc không hề đọc — xoá key đi ca vẫn XANH**
  Người dùng thấy gì: Một phép kiểm tra tự động tưởng như đang bảo vệ một quy tắc quan trọng của hệ thống thực ra không kiểm tra được gì, nên nếu quy tắc đó âm thầm hỏng sau này sẽ không ai được cảnh báo.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 1 (đo key đã chết): VV4 round-trip `ngoaiVatGlobs` — khoá bên đọc KHÔNG còn dùng; khoá thật `ngoaiVatFiles` không ca nào đo**
  Người dùng thấy gì: Một phép kiểm tra tự động tưởng như xác nhận dữ liệu loại-trừ được truyền đúng giữa hai phần của hệ thống thực ra không xác nhận được dữ liệu thật đang dùng, nên lỗi truyền sai có thể lọt qua mà không bị phát hiện.
  file: `tests/scripts/s4-args-vung-vat.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét LỚP nhưng phép đếm không thấy lớp): «đếm LỚP» grep chuỗi «run-log.jsonl» nên bỏ sót carry-plan.mjs — chính bộ đọc của dòng `finding`**
  Người dùng thấy gì: Một phép đếm dùng để canh giữ số lượng nơi đọc nhật ký hệ thống bị đếm thiếu, nên nếu có nơi đọc mới âm thầm xuất hiện, phép đếm này sẽ không phát hiện ra.
  file: `tests/scripts/finding-line-bo-doc.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **SKILL.md khai thiếu bốn trường args mới — hợp đồng writer/reader của chính seam vừa dựng lại (r2)**
  Người dùng thấy gì: Tài liệu hướng dẫn nội bộ chưa mô tả đúng các trường dữ liệu mới, có thể khiến người đọc sau này hiểu sai cách hệ thống vận hành.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Hai tệp ca chép tay bản thứ ba/thứ tư của globToRe thay vì import bản nguồn (r2)**
  Người dùng thấy gì: Một phần logic đối chiếu được chép tay ở nhiều nơi trong bộ kiểm thử; nếu định nghĩa gốc đổi sau này, các bản chép này có thể lệch mà không ai biết.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Đối chứng có lối thoát — VV-mau tự miễn trừ phần tử `docs/`, và không có đối chứng âm (r2)**
  Người dùng thấy gì: Một bài kiểm thử tự bỏ qua kiểm tra cho các tệp nằm trong thư mục tài liệu, và không có phép thử đối chứng để chắc rằng nó thực sự phân biệt đúng-sai, làm giảm độ tin cậy của phép kiểm.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Assert chuỗi đã trôi khỏi vật — `expected` của E7 ghim dòng PASS không tồn tại và sai verdict (r2)**
  Người dùng thấy gì: Văn bản mô tả kết quả mong đợi trong hồ sơ chấp nhận không khớp với thông điệp thật mà hệ thống in ra, có thể khiến người đọc hồ sơ hiểu nhầm hệ thống đang kiểm tra gì.
  file: `_acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — assertion âm-tính-một-mình: cả tệp finding-line-bo-doc xanh khi ba bộ đọc KHÔNG hề chạy (r1)**
  Người dùng thấy gì: Bài kiểm tra dùng để đảm bảo các báo cáo cũ vẫn đọc được sau khi thêm dữ liệu mới sẽ báo 'đạt' ngay cả khi công cụ đọc báo cáo bị hỏng hoàn toàn — người xem có thể tin nhầm rằng mọi thứ vẫn ổn trong khi chưa có gì được kiểm chứng thật.
  file: `tests/scripts/finding-line-bo-doc.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 5 — tuyên quét LỚP «không bộ đọc nào» nhưng chỉ có 3 điểm-case trên 8 bộ đọc (r1)**
  Người dùng thấy gì: Bài kiểm tra tuyên bố đã kiểm tra toàn bộ các nơi đọc dữ liệu nhật ký, nhưng thực tế chỉ kiểm một phần nhỏ — các nơi còn lại có thể hỏng mà không ai biết.
  file: `tests/scripts/finding-line-bo-doc.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Tuyên quét LỚP nhưng phép đếm chỉ phủ một phần lớp — grep bỏ đúng thư mục chứa bên ghi run-log (r1)**
  Người dùng thấy gì: Một bài kiểm tra tự động dùng để cảnh báo khi có thêm chỗ mới đọc sổ ghi lại đang bỏ sót đúng khu vực mã nguồn liên quan nhất, nên cảnh báo đó có thể không kêu khi cần.
  file: `tests/scripts/finding-line-bo-doc.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Chiều đỏ và thông điệp ghim trong `expected` là tuyên khống — mô tả PASS-line và assert không tồn tại trong tệp ca (r1)**
  Người dùng thấy gì: Phần mô tả trong hồ sơ kiểm thử ghi những điều bài kiểm tra thực tế không làm, khiến người đọc hồ sơ để duyệt có thể hiểu nhầm là bài kiểm tra chứng minh nhiều hơn thực tế.
  file: `_acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/12 lỗi rơi vào file không bộ đo nào phủ (feature-loop/skills/feature-loop/SKILL.md, tests/scripts/finding-line-bo-doc.test.mjs, _acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
