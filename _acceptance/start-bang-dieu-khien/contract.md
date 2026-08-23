---
schema_version: 1
feature: «/start» là bảng điều khiển của owner, không phải bộ định tuyến — hiện hết ý đang cân nhắc, nêu tên việc máy vừa làm và thứ còn veto được, và mọi bộ đọc nói cùng một chữ
slug: start-bang-dieu-khien
owner: manh.phan@onemount.com
risk_tier: T2      # T2 (chuẩn) | T3 (auth/dữ liệu/API phá vỡ)
surfaces: [cli]
status: verified
approved_by: Manh Phan
approved_at: 2026-08-23T01:58:21Z
---

# Acceptance Contract: start-bang-dieu-khien

## Context

Thẻ vào phiên là vật owner nhìn đầu tiên mỗi lượt ngồi xuống, nhưng nó đang trả
lời câu «đi đâu tiếp» thay vì «tôi cần quyết gì, và máy vừa làm gì cho tôi». Nó
giấu backlog (cắt còn 3 ý trên 7), giấu việc máy vừa làm (một con số gộp «57
việc»), không nêu tên thứ owner còn veto được và đếm sai nó (thẻ 2 · lưới 16),
nói khác ba bộ đọc kia cho cùng một sự thật, và câm khi cây làm việc đã sau bản
chung. Vòng này sửa **bộ đọc và lời thẻ** — không đụng trạng thái hồ sơ, không
đụng nghi thức cổng.

Source input: `_acceptance/start-bang-dieu-khien/opportunity.md` (Cổng Đáng
`decision: build`, Manh Phan 2026-08-23) · nền
`docs/findings/2026-08-22-audit-day-nghi-thuc-kit.md` §3 lớp C/D, §8, §9 hàng 1
· thiết kế `docs/superpowers/specs/2026-08-23-start-bang-dieu-khien-design.md`

## Criteria

- AC-1: Given khối marker `START-CAN-NHAC` trong `commands/start.md`, When đọc,
  Then nó dặn in **mọi** phần tử `groups.considering` (không còn con số trần
  nào giới hạn danh sách), giữ nguyên dòng gộp «Đang cân nhắc: N ý · cũ nhất X
  ngày» và luật «N = 0 → KHÔNG in dòng nào», và chứa một câu ràng buộc rằng máy
  **chỉ được xếp hạng khi ô đã khai thước trước**, chưa có thước thì hiện hết
  theo thứ tự cũ-nhất-trước.
- AC-2: Given ca đo VC6 (suite plugins) đang ghim luật cũ «tối đa 3 tên» cho
  hồ sơ đã ký `vao-co-o-ra-co-ten`, When ô này đổi luật, Then **chỉ ca đo** VC6
  được sửa để ghim luật MỚI — hợp đồng đã ký của hồ sơ kia **không đổi một
  chữ** (AC-6 ở đó là sự thật của ngày nó ký; kéo hồ sơ đã ký vào diff của một
  PR chạm engine là tự làm bằng chứng của nó stale — ADR 0010), và `## Notes`
  của hồ sơ này ghi con trỏ «AC-1 thay thế AC-6 của vao-co-o-ra-co-ten»; ca
  VC6 vẫn còn chiều đỏ: bản sao `commands/start.md` đổi khoá máy-đọc về một
  giới hạn → VC6 đỏ nêu đúng mệnh đề.
- AC-3: Given một hồ sơ đã đóng (`groups.done[]`), When chạy `start-scan.mjs`,
  Then mỗi phần tử mang khoá `at` = ngày (YYYY-MM-DD) suy theo thang
  `human_signoff` trong `evidence-report.md` → `decided_at` (`uat-session.md`
  rồi `opportunity.md`) → `git log -1 --format=%cs` trên file hồ sơ; không nấc
  nào ra ngày thì `at` là `null` (không bịa), và trên toàn bộ `_acceptance/`
  của chính kit **số hồ sơ `at: null` bằng 0**.
- AC-4: Given khối `START-SCAN-KEYS` và thân `commands/start.md`, When đọc,
  Then thẻ được dặn in **N việc vừa xong gần nhất** — mỗi việc một dòng «ngày ·
  trạng thái · tên», xếp theo `at` giảm dần — thay cho việc chỉ in con số gộp,
  với N là một con số khai tường minh trong chính thân lệnh.
- AC-5: Given mọi `contract.md` trong `_acceptance/`, When chạy
  `start-scan.mjs`, Then đầu ra có khoá `vetoOpen[]` liệt **mọi** hồ sơ có
  `veto_state: mo` bất kể `status` — đúng vị từ lưới trước-merge dùng — và
  `commands/start.md` dặn thẻ **nêu TÊN** từng phần tử, không chỉ đếm.
- AC-6: Given một kho git fixture code-sinh, When chạy `start-scan.mjs` và
  `scripts/pre-merge-check.sh` trên **cùng** cây đó, Then tập slug của
  `vetoOpen[]` bằng đúng tập slug lưới in trong dòng «cửa veto đang mở», và khi
  thêm một hồ sơ `veto_state: mo` vào bản sao thì **cả hai cùng tăng đúng 1**.
- AC-7: Given bảng trạng-thái→chữ đặt tại `scripts/`, When bốn bộ đọc (máy quét
  `/start`, thẻ cổng `gate-card.js`, `commands/acceptance-status.md`, bản đồ
  `product-map.mjs`) nói về cùng một hồ sơ, Then chữ của mỗi bộ đọc **rút từ
  bảng đó**, không bộ đọc nào tự chế chuỗi; bản đồ dùng phép chiếu
  nhiều-về-một `BUCKET_OF` nên vẫn **không mang vị từ**.
- AC-8: Given một fixture code-sinh mang hồ sơ `verified` + PASS + xanh-sạch +
  `veto_state: mo`, When chạy cả bốn bộ đọc trên cùng cây đó, Then **không bộ
  đọc nào mời ký** hồ sơ ấy (hôm nay `gate-card.js` in «máy đã xong — ký nhanh»
  và `acceptance-status` in «Chờ người ký»), và đổi chữ ở **một** phía của bảng
  làm phép đo đỏ nêu đúng tên bộ đọc lệch.
- AC-9: Given một kho git, When chạy `start-scan.mjs`, Then `git` mang thêm
  `ahead`, `behind`, `compareRef` so với **bản chung** theo thang
  `refs/remotes/origin/HEAD` → `origin/main` → `origin/master` → `@{u}` (nhánh
  trên cùng chỉ là nấc cuối — một nhánh tính năng có nhánh trên cùng riêng mà
  so với nó sẽ nói «khớp» trong khi bản chung đã đi trước), **không gọi
  mạng**; không nấc nào giải được thì cả ba là `null` (nghĩa «chưa biết», khác
  hẳn `0`), và `commands/start.md` dặn thẻ tự nói một dòng khi `behind > 0` và
  nói «chưa biết» khi `compareRef` là `null`.
- AC-10: Given `docs/plans/2026-08-21-hat-giong-vao-co-o-ra-co-ten.md` §9.1 và
  lối (a) của `commands/start.md`, When đọc sau vòng này, Then §9.1 mang dấu
  vết TRỪ có lý do (không cắm `product-management:brainstorm` vào Vòng HIỂU),
  ổ cắm `discovery.brainstorm_skill` **giữ nguyên** không đổi một chữ, và lối
  (a) có thêm một câu phủ định cạnh câu đã có về `superpowers:brainstorming`:
  mặc định là máy phân kỳ theo khuôn rồi trình một câu đóng.
- AC-12: Given `groups.gates[]` có phần tử `since` rỗng (cổng `gia-tri` chưa
  dựng phiên nghiệm thu) và `groups.considering[]` có từ hai ý trở lên **chung
  một** dấu thời gian, When chạy `start-scan.mjs` rồi đọc thân
  `commands/start.md`, Then (i) phần tử `since` rỗng xếp **cuối** nhóm cổng,
  không phải đầu — hôm nay chuỗi rỗng sort lên đầu nên Cổng Giá trị luôn đứng
  đầu thẻ bất kể tuổi; và (ii) máy quét emit `ageTied: true` cho nhóm ý có dấu
  thời gian trùng, và thân lệnh dặn thẻ nói «chưa rõ tuổi» thay vì in «cũ nhất
  X ngày» như một sự thật khi `ageTied` bật.

- AC-11: Given `commands/approve.md`, `commands/signoff.md`,
  `commands/acceptance-card.md`, When đọc phần kết, Then mỗi file in bước kế
  của nó — `approve` → S2 lập kế hoạch, `signoff` → S5 bàn giao, thẻ → nêu
  `/acceptance-gate:approve` và `/acceptance-gate:signoff` — và mọi tên lệnh in
  ra ở **dạng bấm được** đúng cột «Lệnh bấm được» của bảng `COMMAND-NAMES`, 0
  token trần.

## Coverage

Quét bằng skill `morphological-scan` (preset entity-feature + test-matrix),
chi tiết ở §3 của design doc. 5 × 6 × 5 = 150 ô; Core 7 ô (4,7 %).

- Trục A — **bộ đọc**: máy quét/thẻ `/start` | thẻ cổng `gate-card.js` |
  `acceptance-status` | bản đồ `product-map` | lưới trước-merge
  [thước CE: audit 22/08 §3 lớp C — chạy thật trên 4 máy đọc, 8 ca lệch]
- Trục B — **loại sự thật**: ý chưa quyết | việc máy vừa làm | thứ còn veto
  được | trạng thái hồ sơ | trạng thái mặt phẳng làm việc | bước kế của cổng
  [thước CE: sáu hạng mục của `opportunity.md` + ba ý owner audit §8]
- Trục C — **hình dạng lỗi**: giấu | lệch | giả | câm | nhiễu
  [thước CE: bốn điều kiện CHẾT của ngưỡng đã chốt ở Cổng Đáng]
- Core → AC-1/2 (giấu ý) · AC-3/4 (giấu việc vừa làm) · AC-5/6 (lệch đếm veto)
  · AC-7/8 (lệch chữ) · AC-9 (câm khi cây lệch) · AC-10 (nhiễu ở bước mờ) ·
  AC-11 (câm ở bước kế) · **AC-12 (giả — mốc rỗng sort lên đầu, tuổi trùng in
  thành «cũ nhất X ngày»)**. Cả năm giá trị của trục C đều có AC nhận.
- Later/Never → `## Out of scope` dưới đây, mỗi mục một dòng.
- Chân ngành: **Shape Up — betting table** và **Stage-Gate (Cooper) — năm
  thành phần một cổng** [NGÀNH], hai nguồn đã phân loại và ký ở bảng «Nguồn
  ngoài & phạm vi kế thừa» của `opportunity.md`. Không dòng nào của quét này
  còn ở mức [GIẢ ĐỊNH].

## Đường đo

Chép từ section «Ngưỡng chết / ngưỡng UAT» của `opportunity.md` — ván thử là
BA phiên `/start` thật của owner trên chính kit; timebox 3 phiên, muộn nhất
2026-09-15 → `park`.

- Thước: số lần owner phải rời thẻ đi mở bản đồ / thư mục `_acceptance/` / lưới
  để biết bức tranh thật (đích 0) · số từ: owner đếm trong phiên; thẻ phải chứa
  đủ ba nhóm tin để không cần rời · bảo đảm bởi: AC-1, AC-4, AC-5, AC-9
- Thước: tỷ lệ ý «đang cân nhắc» hiện trên thẻ (đích 100 %) · số từ:
  `groups.considering[].length` của `start-scan.mjs` đặt cạnh số dòng thẻ in ·
  bảo đảm bởi: AC-1
- Thước: độ lệch đếm «cửa veto mở» giữa thẻ và lưới (đích 0; nay 2 vs 16) · số
  từ: `vetoOpen[].length` của máy quét đặt cạnh `VETO_OPEN_N` của
  `scripts/pre-merge-check.sh` trên cùng cây · bảo đảm bởi: AC-5, AC-6
- Thước: số lần owner hành động trên một dòng mới sinh — veto, mở hồ sơ đọc,
  bảo dừng (đích ≥ 1 trong ba phiên) · số từ: owner đếm trong phiên; dòng mới
  sinh là dòng «vừa xong» và dòng nêu tên veto-mở · bảo đảm bởi: AC-4, AC-5
- Thước: số lần thẻ in trạng thái cũ vì cây lệch bản chung mà không cảnh báo
  (đích 0) · số từ: `git.behind` của máy quét đặt cạnh dòng thẻ in · bảo đảm
  bởi: AC-9
- Thước: số ô trong bảng trạng-thái × bộ-đọc mà hai bộ đọc nói khác chữ cho
  cùng một sự thật (đích 0 ngoài ca cố ý đã khai) · số từ: phép đo round-trip
  chạy một fixture qua bốn bộ đọc · bảo đảm bởi: AC-7, AC-8
- Thước: số lượt gọi người **thêm** do các thay đổi này (đích 0) · số từ: thân
  `commands/start.md` vẫn kết bằng ĐÚNG MỘT câu hỏi chọn · bảo đảm bởi: AC-1
  (thẻ dài hơn không được sinh câu hỏi thứ hai)

Hai thước dưới đây phủ **điều kiện CHẾT** của ngưỡng — rủi ro số một của một ô
mà nội dung chính là BỎ giới hạn hiển thị. Cả hai **đo bằng người**, khai thẳng
như vậy để Cổng Giá trị không đọc bảng toàn xanh trong khi một ngưỡng CHẾT đã
bật:

- Thước: số nhóm owner khai «phần này tôi không đọc» trong một phiên — điều
  kiện CHẾT (a), đích 0 · số từ: owner nói trong phiên, không có đường đo máy ·
  bảo đảm bởi: AC-1, AC-4 (giữ thẻ ở dạng nhóm có nhãn để owner chỉ được tên
  nhóm mình bỏ)
- Thước: số lần owner veto một lần **cắt** hoặc một **thứ tự** do máy tự chọn —
  điều kiện CHẾT (c), đích 0 · số từ: owner đếm trong phiên; máy chỉ được cắt
  hay xếp hạng khi ô đã khai thước, nên mỗi lần veto là một lần máy tự chế ·
  bảo đảm bởi: AC-1 (câu ràng buộc thước), AC-12 (không bịa tuổi khi tuổi trùng)

## Out of scope

- **Không** chạm `scripts/pre-merge-check.sh` hay `lib/**` (`t3_paths`) — giữ ô
  ở hạng T2 như bảng phân ô audit §9 đã xếp. Hệ quả nhận tường minh: ca **C6**
  (status lạ — lưới nói «chưa arm cổng», ba bộ đọc kia nói «hồ sơ hỏng») KHÔNG
  được chữa trong vòng này; ghi known-limit có tên ở `## Notes`.
- **Không** đổi bản đồ sản phẩm sang dùng vị từ («xanh-sạch», «chờ ký») — đã
  quyết bản đồ gom theo giai đoạn (`start-scan.mjs:16-18`, known-limit
  `lan-v-khong-phai-cho-ky`); chữa lệch chữ bằng bảng chung, không bằng đổi vai
  bản đồ.
- **Không** cho máy tự `park`/`kill` ý theo tuổi, và **không** bịa trọng số ưu
  tiên — máy nhắc tuổi, người quyết số phận.
- **Không** đụng trạng thái hồ sơ hay nghi thức cổng: làn V có ô kết ·
  `verified` → `signed-off` · nghi thức Cổng Đáng · lối «không đo được» của
  Cổng Giá trị · chủ bước kế cho `iterate`/`kill` · bộ đọc timebox · veto có
  động từ · Gate 1.5. Cả cụm thuộc ô `ra-co-ten-lam-va-trao`, **chưa ký Cổng
  Đáng** — lấn sang là mở phạm vi không có ai duyệt.
- **Không** thêm lệnh mới, **không** skill mới.
- **Không** mở rộng sang QUICKSTART/README/GUIDE — nợ đã khai của chip D.

## Notes

- **Known limit đã biết trước khi code (C6):** với một `contract.md` có
  `status` ngoài từ vựng, máy quét/bản đồ/thẻ nói «hồ sơ hỏng» còn lưới
  trước-merge nói «chưa arm cổng — status=X» (hoặc im khi không có bằng
  chứng). Vòng này **không** chữa: chữa phải sửa `scripts/pre-merge-check.sh`
  (`t3_paths`) và nâng cả ô lên T3. AC-7/AC-8 vì vậy đo ba bộ đọc trong nguồn
  chung cộng phép so với lưới ở đúng một trục — trục veto (AC-6).
- **AC-1 của hồ sơ này THAY THẾ AC-6 của hồ sơ đã ký `vao-co-o-ra-co-ten`**
  (giới hạn «tối đa 3 tên» → hiện hết, xếp hạng chỉ khi có thước khai trước).
  Hợp đồng đã ký kia giữ nguyên văn — nó là sự thật của ngày nó ký. Ca đo VC6
  ghim luật mới; không ca nào đọc hợp đồng của hồ sơ khác lúc chạy (lớp «thước
  ghim vào chặng hồ sơ khác», chip C).
- **Ràng buộc thi công cho `commands/acceptance-status.md`:** viết lại phần
  việc-cần-làm để đọc chữ từ máy quét, nhưng PHẢI giữ đoạn điều khoản
  một-lượt-gõ và cờ `--repo` (ca đo hiện có ghim needle `--repo` per-site và
  chép-nguyên-văn điều khoản — MUTANT-F), và giữ lệnh trong danh sách khoá
  model-invocation (P32).
- **Quyết định load-bearing 1:** bảng trạng-thái→chữ đặt ở `scripts/`, không ở
  `lib/`. Lý do đầy đủ ở §5 design doc; tóm tắt: `lib/**` là `t3_paths` vì nó
  là lõi cưỡng chế sinh false-green, còn một bảng chữ hỏng chỉ cho **chữ sai**,
  không cho **màu xanh giả**. Tiền lệ cùng lý do: `scripts/khong-can-nguoi.mjs`.
- **Quyết định load-bearing 2:** `gate-card.js` lấy trạng thái bằng cách **chạy
  `start-scan.mjs`**, không dựng lại vị từ xanh-sạch. Đó sẽ là bản dựng THỨ BA
  của đúng lớp lỗi mà `lan-v-khong-phai-cho-ky` đã trả giá. Máy quét chết → thẻ
  giữ hành vi cũ **kèm cờ vàng**, không bao giờ im lặng tuyên sạch.
- **Con số 16 (hồ sơ cửa veto mở) là QUAN SÁT ngày 23/08, không phải hằng
  ghim.** Hồ sơ cơ hội và sổ quyết định ghi 14 vì audit đếm ngày 22/08 — hai
  hồ sơ đã ký thêm trong một ngày; không sửa hai file đã ký. Phép đo vì vậy
  assert **quan hệ** (tập slug của máy quét === tập slug của lưới, và phá thử
  cùng tăng 1) với sàn đếm ≥ 1, **không** assert `=== 16`: một làn song song
  merge thêm một hồ sơ `veto_state: mo` sẽ làm hằng đỏ trên một bản cài ĐÚNG.
  Đúng lớp «thước ghim vào thứ sẽ đổi» mà sổ lớp lỗi đang ghi «chưa quét trọn
  lớp» — lớp này đã bắt được ngay trong phản biện của chính vòng này.
- Vòng này chạm engine → theo GUIDE §7.1, re-pin đi theo **release**, không
  theo từng merge. Không mở chiến dịch re-pin trong vòng này.
