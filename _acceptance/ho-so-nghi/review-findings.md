# Review Findings: ho-so-nghi (round 1)

## Trong hợp đồng

- **product-map.mjs không hỏi hoSoNghi — bản đồ và bộ quét xếp hồ sơ nghỉ vào HAI ô khác nhau**
  file: `scripts/product-map.mjs:211`
  severity: high
  AC: AC-5

  `classify()` của product-map.mjs tự suy ô từ `navValues` và KHÔNG gọi `hoSoNghi`, trong khi start-scan.mjs nay cắt nhánh nghỉ trước mọi nhánh trạng thái. Với hợp đồng CHƯA thông Cổng 2 (`status: approved`/`implemented`) mang một dòng nghỉ hợp lệ, hai bộ đọc trả hai ô khác NHÓM:
  - start-scan.mjs → `da-dong-ho-so`, nhóm `done`, ô bản đồ `da-bac` («Đã bác từ khám phá»)
  - product-map.mjs → `dang-viet-code`, ô «Đang làm»

  Đo trên fixture tối thiểu (`_acceptance/hsn/` với contract `status: approved` + một dòng nghỉ): scan in `done da-dong-ho-so`, còn PRODUCT-MAP.md máy sinh in hồ sơ ấy dưới `## Đang làm` với `Đang làm<br/>1 việc`.

  Đây đúng lớp lỗi `lib/workspace-record.cjs` sinh ra để đóng và chính hợp đồng tuyên đã đóng: Coverage của contract.md viết «scripts/start-scan.mjs (bản đồ chiếu từ đây)» — bản đồ KHÔNG chiếu từ đó, nó là bộ đọc thứ năm tự suy. AC-5 nêu đúng ca này («thứ hai: da-dong-ho-so, khối Đã bác từ khám phá») nhưng ca HSN5 chỉ chạy `scan()`, không chạy product-map, nên ma trận so-bằng-nhau xanh mà hai bên vẫn lệch. Ca `signed-off` may mắn cùng nhóm `da-ship` (scan `da-nghi` vs map `da-giao`) nên chỉ lệch chữ chú thích — nhưng cùng một nguyên nhân.

  Vì sao thuộc hợp đồng: AC-5 yêu cầu chạy CẢ start-scan.mjs và product-map.mjs trên fixture "nghỉ hợp lệ trên hợp đồng approved" và kỳ vọng cùng xếp vào khối "Đã bác từ khám phá"; finding cho thấy product-map xếp hồ sơ này vào "Đang làm", trực tiếp trái Then của AC-5.

- **product-map.mjs chưa được dạy hoSoNghi — bản đồ và bộ quét xếp cùng một hồ sơ nghỉ vào hai ô khác nhau (bản EN, cùng lớp lỗi với finding trên)**
  file: `scripts/product-map.mjs:212`
  severity: high
  AC: AC-5

  `lib/workspace-record.cjs` sinh ra chính để bản đồ và bộ quét không trôi khỏi nhau (chú thích đầu tệp: "Hai kết luận trái nhau về cùng một sự thật là false-green đúng nghĩa"). start-scan.mjs:313 nay hỏi `hoSoNghi` trước mọi nhánh trạng thái, nhưng product-map.mjs tự định tuyến trạng thái ở dòng 212–248 và không bao giờ gọi hàm này. Diff vòng này thêm `da-nghi` vào trang-thai-ho-so.cjs và chạm start-scan/gate-card/pre-merge/recheck, nhưng để nguyên product-map.mjs.

  Với `signed-off`/`machine-cleared` cả hai đều rơi vào `da-ship` nên "bản đồ không thêm khối" của AC-5 vẫn đúng — nhưng với mọi trạng thái khác thì lệch, vì start-scan đẩy hồ sơ nghỉ không-thuộc-DA_THONG_CONG_2 vào `da-dong-ho-so` (ô `da-bac`). Tái hiện trên fixture sinh (status: approved + một dòng nghỉ hợp lệ): start-scan in `done da-dong-ho-so` (ô «Đã bác từ khám phá»), còn product-map in hồ sơ dưới `## Đang làm` với một việc đang sống. AC-5 fixture (b) đúng là "nghỉ hợp lệ trên hợp đồng `approved`", tức một hình dạng đã tuyên hỗ trợ, và PRODUCT-MAP.md được `--check` trong CI — bản đồ sẽ tiếp tục khẳng định hồ sơ đang sống trong khi thẻ, cổng và bộ quét đều nói đã nghỉ.

  Kịch bản lỗi: Một hồ sơ T2 ở `status: approved` được gắn một dòng nghỉ hợp lệ. `start-scan.mjs --json` và thẻ báo nó dưới «Đã bác từ khám phá» / đã nghỉ; `product-map.mjs` sinh lại PRODUCT-MAP.md xếp nó dưới «Đang làm» với một việc còn sống, và `--check` vẫn xanh vì chỉ so bản đồ với chính đầu ra nó vừa sinh.

  Vì sao thuộc hợp đồng: cùng lý do với finding trên — AC-5 yêu cầu product-map.mjs và start-scan.mjs xếp fixture "nghỉ trên hợp đồng approved" vào cùng khối "Đã bác từ khám phá"; finding chứng minh product-map xếp khác, trái Then của AC-5.

- **Assertion âm-tính-một-mình — chân «thẻ» của mutant HSN7 xanh khi thẻ không in gì**
  file: `tests/scripts/ho-so-nghi.test.mjs:336`
  severity: high
  AC: AC-6

  Dòng 336: `thẻ=${!tc.includes('đã nghỉ') ? 'không-nói-nghỉ' : 'KHÁC'}`, với `tc` lấy từ `chay('scripts/gate-card.js', …).stdout || ''` (dòng 330). Đây là assert VẮNG-MẶT một mình: không đối chứng dương (không hề kiểm bản chưa tiêm CÓ in «đã nghỉ» trên chính fixture signed-off này), và không ghim chuỗi nào phải CÓ — trong khi `MOI_KY = 'Ký duyệt'` đã được rút từ nguồn ở HSN-THE và evals.yaml E6 hứa «thẻ KHÔNG chứa «đã nghỉ» VÀ CÓ chuỗi mời ký», vế sau không được đo. Đo thực nghiệm: `git archive HEAD scripts lib` vào thư mục tạm, thay `lib/workspace-record.cjs` bằng `throw new Error('vo')`, chạy `node scripts/gate-card.js --root /tmp --slug hsn` → exit 2, stdout đúng 0 byte, lỗi chỉ ra stderr. Nghĩa là mọi đường thẻ chết (thẻ vỡ vì lib, sai slug, xưởng chưa mở, đổi tên chuỗi) đều cho `tc === ''` → `!''.includes('đã nghỉ')` là true → chân này báo «không-nói-nghỉ» và ca HSN7 vẫn xanh. Cùng khối, chân `cổng` (dòng 333) và `kiểm-lại` (dòng 334) chỉ so `status !== 0`, không ghim thông điệp, dù hằng `CHUOI` (dòng 167) đã có sẵn và HSN0/HSN8 dùng đúng nếp đó: một bản sao hỏng vì hạ tầng (thiếu tệp, lỗi cú pháp lib, exit 127) cũng cho «đỏ». Ba trên bốn chân của ca mutant chính không phân biệt được «bắt đúng lớp lỗi» với «chưa bao giờ chạy».

  Kịch bản lỗi: Bản vá thẻ (scripts/gate-card.js) bị gỡ hẳn khối `if (NGHI) flags.push(...)` hoặc thẻ vỡ ở bất kỳ đường nào: `chay('scripts/gate-card.js', …).stdout` trả '' → `!''.includes('đã nghỉ')` = true → chân `thẻ=không-nói-nghỉ` → HSN7 xanh, mutant sống sót, và E6 vẫn được chấm PASS với lời khai «cả BỐN lật».

  Vì sao thuộc hợp đồng: AC-6 yêu cầu khi hàm hoSoNghi bị phá, thẻ phải "KHÔNG chứa đã nghỉ VÀ CÓ lời mời ký"; ca kiểm chỉ assert vắng mặt "đã nghỉ" (kể cả khi thẻ vỡ hoàn toàn) mà không hề assert có mặt lời mời ký, nên không verify được vế bắt buộc thứ hai của Then.

- **Tuyên quét LỚP nhưng chỉ điểm-case — ma trận 3 vế × 3 bộ đọc của E2 thực ra là 3+1+1, và lỗ còn lại là thật**
  file: `_acceptance/ho-so-nghi/evals.yaml:29`
  severity: high
  AC: AC-2

  E2 (AC-2) khai: «ma trận ba ca × ba bộ đọc so BẰNG NHAU với danh sách viết trước: … Cổng … Bộ quét: da-giao + cờ «nghi-thieu-ve:by» / «:decision» / «:at». Thẻ: có cờ vàng nêu đúng vế và CÓ chuỗi mời ký. Thiếu ô nào là đỏ.» Bộ kiểm chỉ có 5/9 ô: HSN2 (dòng 196-203) chạy cổng cho cả ba vế; HSN5b (dòng 118-122) chạy bộ quét cho ĐÚNG MỘT vế (`by`); HSN-THE (dòng 299-303) chạy thẻ cho ĐÚNG MỘT vế (`by`). `decision` và `at` không bao giờ đi qua bộ quét hay thẻ. Đây là mẫu P105 đảo ngược: số assert (5) không bằng số phần tử của lớp được tuyên (9), và không có vòng lặp nào sinh ma trận toàn phần — ba vế được lặp ở HSN2 nhưng bị viết tay một ca ở hai bộ đọc kia. Lỗ này không lý thuyết: `nghiFlags` chỉ được truyền vào 8 trên 9 nhánh của scripts/start-scan.mjs, nhánh `kcnState` (dòng 453: `else if (kcnState) done.push(g(…, { slug, state: kcnState, at: ngayXong(dir, cPath) }))`) KHÔNG mang `flags`, nên hồ sơ «máy đi tiếp» có dòng nghỉ thiếu vế sẽ mất sạch cờ. Ba ca của HSN2 đều dùng fixture `status: 'signed-off'` (khoFixture mặc định) nên chỉ chạm nhánh dòng 447 — không ca nào đi qua dòng 453, và ma trận được tuyên là toàn phần lại không phát hiện ra.

  Kịch bản lỗi: Hồ sơ ở trạng thái verified, chưa có human_signoff, thoả `kcn()` (làn V / xanh-sạch), kèm một dòng `type: nghi` thiếu `decision`: start-scan.mjs dòng 453 đẩy nó vào `may-di-tiep-xanh-sach` với `flags` undefined → người viết dòng nghỉ không bao giờ thấy cờ «nghi-thieu-ve:decision» trên bộ quét lẫn trên thẻ, tưởng hồ sơ đã nghỉ trong khi cổng vẫn chặn. Toàn bộ HSN2/HSN5b/HSN-THE vẫn xanh vì không ca nào đặt fixture ở nhánh đó.

  Vì sao thuộc hợp đồng: AC-2 đòi "ma trận ba ca × ba bộ đọc so bằng nhau với danh sách viết trước"; bộ kiểm chỉ chạy đủ ba ca cho cổng, nhưng bộ quét và thẻ mỗi bên chỉ chạy một ca (by), bỏ hẳn decision và at — không đủ ma trận AC-2 yêu cầu.

- **Đo CHỈ DẪN thay vì ĐẦU RA — E5 hứa hai phép đo trên bản đồ mà bộ kiểm không hề gọi bộ dựng bản đồ**
  file: `_acceptance/ho-so-nghi/evals.yaml:66`
  severity: high
  AC: AC-5

  E5 (AC-5) khai: «bản đồ sinh ra có tập tiêu đề khối BẰNG tập khối của bản đồ fixture HSN0 (không thêm khối) và hồ sơ da-nghi nằm dưới «Đã giao»», và `paths` liệt kê `scripts/trang-thai-ho-so.cjs`, `scripts/product-map.mjs`. Cả hai phép đo ấy không tồn tại trong tests/scripts/ho-so-nghi.test.mjs. Grep toàn tệp: `product-map` 0 lần; `trang-thai-ho-so` đúng 1 lần, ở dòng 314 — chỉ là một phần tử trong danh sách tệp cần chép vào bản sao của HSN7, không phải một lượt chạy hay một assert. Khối HSN5 (dòng 106-126) chỉ gọi `scan()` và so `stateKey` + `flags`; không dựng bản đồ, không đọc tiêu đề khối, không kiểm vị trí «Đã giao». Quan hệ được hứa (khoá `da-nghi` mới → xếp đúng nhóm da-ship, không đẻ khối mới trên bản đồ) hoàn toàn không được đo trong vòng này; E10 chạy `product_map` nhưng trên cây kit thật cho AC-9 và chỉ chứng PRODUCT-MAP.md khớp hồ sơ xưởng, không chứng điều E5 nói. Người đọc phán quyết AC-5 sẽ đọc `expected` và tin bản đồ đã được đo.

  Kịch bản lỗi: Thêm khoá `da-nghi` vào scripts/trang-thai-ho-so.cjs với `BUCKET_OF` sai (ví dụ trỏ 'da-bac' thay vì 'da-ship'), hoặc bộ dựng bản đồ đẻ thêm một khối riêng cho trạng thái mới: E5 vẫn PASS vì lệnh của nó là `node tests/scripts/ho-so-nghi.test.mjs` và tệp ca không bao giờ dựng bản đồ; hồ sơ nghỉ rơi nhầm nhóm trên PRODUCT-MAP.md mà không phép đo nào của AC-5 đỏ.

  Vì sao thuộc hợp đồng: AC-5 yêu cầu chạy product-map.mjs và kiểm tra tập khối/vị trí hồ sơ trên bản đồ; bộ kiểm test.mjs không hề gọi product-map.mjs (0 lần trong toàn tệp), nên phần bản đồ của AC-5 hoàn toàn chưa được verify dù evals.yaml tuyên đã đo.

- **Assertion âm-tính-một-mình + thiếu ô ma trận — HSN10 đo «mở lại» bằng mã thoát trần, bỏ hẳn bộ đọc thứ tư**
  file: `tests/scripts/ho-so-nghi.test.mjs:281`
  severity: medium
  AC: AC-10

  Dòng 281: `mở-lại=${ga.ma !== 0 && ra.ma !== 0 && sa && sa.stateKey === 'da-giao' ? …}` — cổng và kiểm-lại chỉ so `ma !== 0`, không ghim thông điệp, dù `CHUOI.eval` ('recorded no evals_exit') và 'REPIN x' đã được dùng đúng nếp ở HSN0 (dòng 178), HSN2 (dòng 200), HSN4 (dòng 236-237) và HSN8 (dòng 225) trên đúng loại fixture này. Bất kỳ đường đỏ nào khác luật đang đo (lib ném lỗi khi gặp `supersedes`, fixture hỏng, node vắng) đều đọc thành «sống-lại». Ngoài ra E11 (evals.yaml) khai «bốn bộ đọc cho đúng kết quả HSN0(c) (VIOLATION · đỏ · da-giao · thẻ mời ký)» — bộ đọc thứ tư, cái thẻ, không xuất hiện trong khối HSN10: không có lượt gọi `the()`, không assert `MOI_KY`. Ma trận 2 chiều × 4 bộ đọc được tuyên, 2 × 3 được viết, và 2 trong 3 ô còn lại là mã thoát trần.

  Kịch bản lỗi: Thay `const goBo = dong.some(e => e.supersedes && …)` trong lib/workspace-record.cjs bằng một biểu thức ném lỗi (hoặc để `hoSoNghi` throw khi sổ có dòng `revisit`): cổng và recheck thoát khác 0 vì lỗi hạ tầng chứ không vì luật làn eval, `sa.stateKey` vẫn là 'da-giao' vì bộ quét cũng rơi về nhánh không-nghỉ → HSN10 báo «mở-lại=sống-lại», ca xanh, và thẻ của hồ sơ mở lại (nếu vẫn nói «đã nghỉ») không ai kiểm.

  Vì sao thuộc hợp đồng: AC-10 yêu cầu 'cả bốn' bộ đọc (cổng, kiểm lại, bộ quét, thẻ) cho kết quả y hệt đối chứng sau khi mở lại; ca kiểm HSN10 không hề gọi thẻ(), nên vế thứ tư của Then chưa từng được verify.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Dòng nghỉ miễn hồ sơ khỏi TOÀN BỘ luật của cổng, không phải ba luật như lời khai**
  Người dùng thấy gì: Khi một hồ sơ được đánh dấu 'nghỉ', hệ thống có thể vô tình bỏ qua luôn cả các kiểm tra bắt buộc phải có người ký duyệt, không chỉ ba lý do đã công bố — một hồ sơ chưa từng được duyệt có thể lọt qua mà không ai hay.
  file: `scripts/pre-merge-check.sh`
  severity: high
  Đề xuất: known-limits

- **recheck-evidence.cjs require thẳng workspace-record.cjs — kho thiếu tệp đó hoá ĐỎ giả ở mọi hồ sơ PASS**
  Người dùng thấy gì: Nếu một kho không có sẵn một tệp thư viện tùy chọn, mọi hồ sơ đã đạt bằng chứng có thể bị báo lỗi giả và bị chặn gộp, dù kết quả thật vẫn đúng.
  file: `scripts/recheck-evidence.cjs`
  severity: high
  Đề xuất: known-limits

- **Dòng nghỉ không có `id` vẫn hợp lệ và KHÔNG BAO GIỜ mở lại được**
  Người dùng thấy gì: Một hồ sơ 'nghỉ' viết thiếu một mục thông tin vẫn được chấp nhận, nhưng sau đó sẽ không ai có thể mở lại hồ sơ đó được nữa.
  file: `lib/workspace-record.cjs`
  severity: medium
  Đề xuất: known-limits

- **recheck-evidence.cjs crashes (exit 1 = false VIOLATION) when lib/workspace-record.cjs is not vendored**
  Người dùng thấy gì: Nếu một kho không có sẵn một tệp thư viện tùy chọn, mọi hồ sơ đã đạt bằng chứng có thể bị báo lỗi giả và bị chặn gộp, dù kết quả thật vẫn đúng.
  file: `scripts/recheck-evidence.cjs`
  severity: high
  Đề xuất: known-limits

- **A nghi line without `id` is accepted but can never be reopened — permanent, irreversible gate exemption**
  Người dùng thấy gì: Một hồ sơ 'nghỉ' viết thiếu một mục thông tin vẫn được chấp nhận, nhưng sau đó sẽ không ai có thể mở lại hồ sơ đó được nữa.
  file: `lib/workspace-record.cjs`
  severity: high
  Đề xuất: known-limits

- **start-scan drops nghi-thieu-ve flags on the làn-V branch, so a malformed nghi line is never surfaced there**
  Người dùng thấy gì: Ở một số đường đi, một hồ sơ 'nghỉ' viết sai định dạng sẽ không hiện cảnh báo trên thẻ, nên người xem có thể không biết dữ liệu đang có lỗi.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Pre-merge nghi NOTE claims three laws are dropped while the `continue` exempts every remaining rule, including bypass_used and human_signoff**
  Người dùng thấy gì: Dòng thông báo khi miễn một hồ sơ chỉ kể ba lý do, trong khi thực tế có thể đã bỏ qua nhiều kiểm tra khác — người đọc dễ hiểu nhầm mức độ miễn.
  file: `scripts/pre-merge-check.sh`
  severity: medium
  Đề xuất: known-limits

- **Fixture/kỳ vọng viết tay thay vì rút từ cây — E9 hứa so với tập trước vòng lấy qua git, bộ kiểm ghim hằng 0**
  Người dùng thấy gì: Cách đo 'hồ sơ hỏng' dựa vào một con số cố định thay vì so sánh thực tế trước và sau, nên có thể không phát hiện lúc một hồ sơ cũ hết lỗi đúng vào lúc một hồ sơ khác mới bị lỗi thay vào.
  file: `tests/scripts/ho-so-nghi.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Đo CHỈ DẪN thay vì ĐẦU RA — đối chứng của HSN9 là grep văn bản mã nguồn cũ, không phải lượt chạy bộ quét cũ**
  Người dùng thấy gì: Phép kiểm chỉ so khớp chữ trong mã nguồn cũ thay vì chạy thử hành vi thật của phiên bản trước, nên không chắc chắn hành vi cũ có thực sự khác bây giờ hay không.
  file: `tests/scripts/ho-so-nghi.test.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/15 lỗi rơi vào file không bộ đo nào phủ (_acceptance/ho-so-nghi/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.