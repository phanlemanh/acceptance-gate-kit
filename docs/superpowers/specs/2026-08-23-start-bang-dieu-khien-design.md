# `/start` là bảng điều khiển của owner — thiết kế S1

- Slug: `start-bang-dieu-khien` · hạng **T2** · surface `cli`
- Cổng Đáng: `decision: build`, Manh Phan 2026-08-23 (`_acceptance/start-bang-dieu-khien/opportunity.md`)
- Nền: `docs/findings/2026-08-22-audit-day-nghi-thuc-kit.md` §3 lớp C/D, §8, §9 hàng 1

## 1. Đề bài trong một câu

Thẻ vào phiên đang trả lời «đi đâu tiếp», owner cần nó trả lời «tôi cần quyết
gì, và máy vừa làm gì cho tôi». Sáu hạng mục, **năm là TRỪ**: bỏ giới hạn 3 ý,
bỏ con số gộp thay bằng tên, bỏ bốn từ vựng song song còn một, bỏ §9.1 cắm
skill hội thoại, bỏ chỗ câm khi cây lệch. Chỉ một hạng mục là CỘNG thật: khoá
`at` cho việc đã xong.

## 2. Đo lại trên cây hiện tại (không đọc code suy ra)

| Hố | Audit 22/08 | Đo lại 23/08 trên `origin/main` 58378148 |
|---|---|---|
| Ý «đang cân nhắc» bị cắt | 8 ý, hiện 3 | **7 ý, hiện 3**; 6/7 cùng `since 2026-08-21T18:24:01Z` |
| Lệch đếm cửa veto | thẻ 2 · lưới 14 | thẻ **2** · lưới **16** — khoảng cách đang giãn |
| Cổng Giá trị luôn đứng đầu | `since: ""` | xác nhận: 2 cổng `gia-tri` đều `since: ""` |
| Cây lệch bản chung | máy quét mù | xác nhận: `git` chỉ có `branch` + `dirty` |

Hai giả định sinh tử của hồ sơ cơ hội đã thử xong:

- **Giả định 2 (ngày «vừa xong» suy được, không cần trường mới): ĐÚNG, 57/57.**
  Chạy thang `human_signoff` (trong `evidence-report.md`) → `decided_at` →
  `git log -1 --format=%cs`: cả 57 hồ sơ `signed-off` ra ngày, **57 ra ngay ở
  nấc một**. Không phải migrate hồ sơ nào.
- **Giả định 5 (đọc ahead/behind rẻ, không mạng): ĐÚNG có điều kiện.**
  `git rev-list --left-right --count @{u}...HEAD` chạy 0 gọi mạng, nhưng
  `@{u}` **không tồn tại** ở phần lớn nhánh của repo này (7/11 nhánh cục bộ
  chưa có upstream), và `refs/remotes/origin/HEAD` cũng không phải symbolic
  ref ở đây. Nên thang so phải có nhiều nấc và nấc cuối là **`null` = chưa
  biết**, không phải `0` — «chưa biết» in ra khác hẳn «đã khớp». Và thang phải
  hỏi **bản chung** trước (`origin/HEAD` → `origin/main` → `origin/master`),
  nhánh trên cùng `@{u}` chỉ là nấc cuối: một nhánh tính năng đã push mà so với
  nhánh trên cùng của chính nó sẽ nói «khớp» trong khi bản chung đã đi trước —
  đúng ca `dac-ta-ux` 22/08 nhưng ở worktree.

## 3. Quét không gian AC (morphological, preset entity-feature + test-matrix)

**Ngữ cảnh** — chân sản phẩm: `CLAUDE.md` + `CONTEXT.md` + audit 22/08
[SUY-TỪ-REPO]. Chân ngành: **Shape Up (Basecamp) — betting table** và
**Stage-Gate (R. Cooper) — năm thành phần một cổng** [NGÀNH], hai nguồn đã
phân loại và ký trong bảng «Nguồn ngoài» của hồ sơ cơ hội.

**Trục** (mỗi trục nêu được vì sao là chiều độc lập):

- **Trục A — bộ đọc** (nơi chữ hiện ra, đổi bộ đọc không ép đổi sự thật):
  máy quét/thẻ `/start` | thẻ cổng `gate-card.js` | bảng trạng thái
  `acceptance-status` | bản đồ `product-map` | lưới trước-merge.
  [thước CE: audit §3 lớp C — chạy thật trên 4 máy đọc, 8 ca lệch]
- **Trục B — loại sự thật thẻ phải nói** (đổi loại sự thật không ép đổi bộ đọc):
  ý chưa quyết | việc máy vừa làm | thứ còn veto được | trạng thái hồ sơ |
  trạng thái mặt phẳng làm việc | bước kế của một cổng.
  [thước CE: sáu hạng mục hồ sơ cơ hội + ba ý owner §8]
- **Trục C — hình dạng lỗi phải chặn** (độc lập với cả hai trên):
  **giấu** (cắt/gộp) | **lệch** (hai bộ đọc hai chữ) | **giả** (số/tuổi sai) |
  **câm** (không nói khi sai) | **nhiễu** (nói quá nhiều).
  [thước CE: bốn điều kiện CHẾT của ngưỡng đã chốt]

5 × 6 × 5 = 150 ô, quét theo lát cắt của trục B.

**Core** (8 ô — 5,3 % số ô, dưới trần 20 %):

1. `ý chưa quyết × thẻ × giấu` — bỏ giới hạn 3; máy chỉ xếp hạng khi ô khai thước.
2. `việc máy vừa làm × thẻ × giấu` — `done[].at` + in N việc vừa xong.
3. `thứ còn veto được × thẻ+lưới × lệch` — nêu TÊN, đếm bằng ĐÚNG vị từ của lưới.
4. `trạng thái hồ sơ × bốn bộ đọc × lệch` — một bảng chữ, bốn bộ đọc đọc lại.
5. `mặt phẳng làm việc × thẻ × câm` — ahead/behind, nấc cuối là «chưa biết».
6. `bước kế × ba thân cổng × câm` — `approve`→S2, `signoff`→S5, thẻ→hai lệnh ký.
7. `ý chưa quyết × lối khai thác × nhiễu` — TRỪ §9.1: không cắm skill hội thoại.
8. `ý chưa quyết + việc đã đóng × thẻ × giả` — mốc rỗng phải xếp **cuối** chứ
   không đầu (C4), và tuổi trùng phải nói «chưa rõ tuổi» chứ không in «cũ nhất
   X ngày» như một sự thật. *(Thêm sau phản biện context sạch — trục C có năm
   giá trị mà giá trị «giả» ban đầu không có AC nào nhận.)*

**Later** (mỗi mục một dòng):

- `trạng thái hồ sơ × lưới × lệch` cho ca **status lạ** (C6: lưới nói «chưa arm
  cổng», máy quét nói «hồ sơ hỏng») — sửa cần chạm `scripts/pre-merge-check.sh`
  (`t3_paths`) và nâng cả ô lên T3; giữ nguyên, ghi known-limit.
- `bước kế × Cổng Đáng` — Cổng Đáng chưa có thân lệnh nào để in bước kế (A1),
  thuộc ô `ra-co-ten-lam-va-trao`.
- Xếp hạng ý theo thước máy-đọc (timebox, con trỏ từ ô đã ký) — cần bộ đọc
  timebox, mà bộ đọc timebox thuộc ô `ra-co-ten-lam-va-trao` (A9).
- `trạng thái hồ sơ × bản đồ × vị từ` — bản đồ giữ thang giai đoạn.

**Never**:

- Đổi bản đồ sang dùng vị từ — đã quyết (`start-scan.mjs:16-18`, known-limit
  `lan-v-khong-phai-cho-ky`); chữa bằng bảng chung.
- Máy tự `park`/`kill` ý theo tuổi — máy nhắc tuổi, người quyết số phận.
- Trọng số ưu tiên bịa — không thước khai trước thì hiện hết.
- Đụng trạng thái hồ sơ hay nghi thức cổng — ô `ra-co-ten-lam-va-trao`.

**Cross-cutting áp mọi ô Core**: mọi chữ mới cho người vào **một** bảng; mọi
phép đo mới đi kèm chiều đỏ trên cùng fixture code-sinh; fixture suy đường dẫn
từ vị trí script.

## 4. Bảng trạng-thái → chữ — mười bảy ô, một nguồn

Đây là vật trung tâm của hạng mục 3. Sự thật = bộ field của hồ sơ; mỗi bộ ra
**đúng một** khoá trạng thái; mỗi khoá có đúng một cặp chữ (`nhan` — trạng
thái, `viecKe` — việc kế của ai).

| # | Sự thật (field) | Khoá | Lệch hôm nay |
|---|---|---|---|
| 1 | ô, ngưỡng chưa điền | `y-can-nhac` | — |
| 2 | ô, ngưỡng đã điền, chưa ký | `cho-cong-dang` | **C1** bản đồ nói «Đang cân nhắc» |
| 3 | ô `decided` + build/iterate | `sap-mo-vong` | — |
| 4 | ô `park` | `xep-lai` | — |
| 5 | ô `kill` | `da-bac` | — |
| 6 | contract `draft` | `cho-cong-pham-vi` | — |
| 7 | `approved` | `dang-lap-ke-hoach` / `dang-viet-code` | — |
| 8 | `implemented` | `cho-nghiem-thu-may` | **C8** `acceptance-status` trỏ nghi thức đã chết |
| 9 | `verified` + REJECT | `dang-sua-theo-bang-chung` | — |
| 10 | `verified` + BLOCKED | `nghiem-thu-bi-chan` | — |
| 11 | `verified` + PASS + chưa ký + **chưa sạch** | `cho-cong-bang-chung` | — |
| 12 | `verified` + PASS + sạch + **cửa veto mở** | `may-di-tiep-veto-mo` | **C2** thẻ + `acceptance-status` MỜI KÝ |
| 13 | `verified` + PASS + sạch + người duyệt Cổng 1 | `may-di-tiep-xanh-sach` | **C2** như trên |
| 14 | `signed-off`, đường B/C/E | `da-giao` | — |
| 15 | `signed-off`, đường A, chưa nghiệm thu | `cho-cong-gia-tri` | **C4** mốc rỗng ⇒ luôn đứng đầu thẻ |
| 16 | `uat verdict` release/iterate/kill | `da-nghiem-thu-*` | — |
| 17 | hồ sơ đọc không được | `ho-so-hong` | **C6** lưới nói chữ khác — Later, xem §6 |

Bản đồ **không** lấy `nhan` của bảng: nó lấy **phép chiếu nhiều-về-một**
`BUCKET_OF: khoá → ô giai đoạn`, nên bản đồ vẫn không mang vị từ (điều kiện
ràng buộc của hồ sơ cơ hội) mà vẫn không thể trôi khỏi ba bộ đọc kia.

## 5. Bốn bộ đọc lấy chữ bằng cách nào

| Bộ đọc | Lấy chữ thế nào | Vì sao không chép |
|---|---|---|
| máy quét `/start` | `require` bảng, emit `state`+`label`+`viecKe` cho mọi phần tử | thẻ là văn của model — model chép `label` NGUYÊN VĂN, không tự chế |
| `acceptance-status` | **gọi chính `start-scan.mjs`** rồi in `label`/`viecKe` nguyên văn | TRỪ trọn danh sách if 7 dòng đang tự chế chữ — nguồn drift C2 + C8 |
| bản đồ `product-map` | `require` bảng, dùng `BUCKET_OF` | giữ thang giai đoạn, không mang vị từ |
| thẻ cổng `gate-card.js` | **chạy `start-scan.mjs` rồi tra slug** | mạnh hơn mọi cách khác: thẻ tiêu thụ chính đầu ra của máy quét nên không thể lệch theo cấu trúc |

**Quyết định load-bearing — bảng đặt ở `scripts/`, KHÔNG ở `lib/`.**
`lib/**` nằm trong `risk_tiers.t3_paths` với lý do đã ghi trong config: «lõi
cưỡng chế — bug ở đây biến thành false-green im lặng trên MỌI repo tiêu thụ».
Một bảng chữ không cưỡng chế gì; bug trong nó cho **chữ sai trên thẻ**, không
cho màu xanh giả. Đặt nó vào `lib/` sẽ nâng ô này lên T3, tức thêm Gate 1.5 và
bắt buộc chữ ký ở Cổng Bằng chứng — hai lượt gọi người, cho đúng cái ô sinh ra
để giảm số lượt gọi người. Có tiền lệ cùng lý do đã ghi trong repo:
`scripts/khong-can-nguoi.mjs` («không sống ở `lib/` là chủ ý của hồ sơ T2»), và
bảng phân ô của chính hồ sơ audit §9 đã xếp ô này **T2**.
Bảng nhãn `MAP_LABELS` trong `lib/workspace-record.cjs` **không** trùng vai:
nó là trạng thái của *file bản đồ*, bảng mới là trạng thái của *hồ sơ* — hai
trục khác nhau, không có gì để đồng bộ.

**Quyết định load-bearing thứ hai — thẻ cổng HỎI máy quét, không dựng vị từ
thứ ba.** `gate-card.js` là CJS còn `khong-can-nguoi.mjs` là ESM; mọi lối gọi
chung đều đòi đổi định dạng file (chạm 4 harness đo + một bộ răng hồ sơ), còn
dựng lại sáu điều kiện xanh-sạch trong `gate-card.js` là bản dựng THỨ BA của
đúng lớp lỗi mà `lan-v-khong-phai-cho-ky` đã trả giá. Rẻ và chắc hơn cả:
`gate-card.js` chạy `start-scan.mjs --root <root>` một lượt (chỉ-đọc, đã đo
dưới một giây trên 70 hồ sơ) và tra slug. Máy quét chết → thẻ **giữ nguyên
hành vi cũ + một cờ vàng**, không bao giờ im lặng tuyên sạch.

## 6. Việc CỐ Ý không làm trong ô này

- **Không** chạm `scripts/pre-merge-check.sh` hay `lib/**` — giữ T2. Hệ quả:
  ca C6 (status lạ: lưới nói «chưa arm cổng», ba bộ đọc kia nói «hồ sơ hỏng»)
  **không được chữa**, ghi thành known-limit có tên.
- **Không** đổi trạng thái hồ sơ, không thêm ô kết cho làn V, không nghi thức
  Cổng Đáng, không lối «không đo được» của Cổng Giá trị, không bộ đọc timebox,
  không veto có động từ, không Gate 1.5 — cả cụm thuộc ô
  `ra-co-ten-lam-va-trao`, **chưa ký Cổng Đáng**.
- **Không** thêm lệnh mới, không skill mới, không đụng
  QUICKSTART/README/GUIDE (nợ đã khai của chip D).

## 7. Thước và ngưỡng

Chép nguyên từ hồ sơ cơ hội vào section `## Đường đo` của contract: mỗi thước
một dòng — **số từ đâu** · **AC nào bảo đảm**. Ván thử = BA phiên `/start`
thật của owner trên chính kit; timebox 3 phiên, muộn nhất 2026-09-15 → `park`.

## 8. Luật đo áp cho mọi phép đo mới của ô này

- Assertion âm-tính-một-mình là assertion không sống: mỗi ca dựng bản sao PHẢI
  có đối chứng dương (bản nguyên vẹn XANH trước) + ghim ĐÚNG thông điệp.
- Thước gắn vào **vật được giao**: đo đầu ra thật của `start-scan`/`gate-card`,
  không đo chỉ dẫn trong file hướng dẫn.
- Fixture do **code sinh trong chính lần chạy**; đường dẫn **suy từ vị trí
  script**, không hardcode ROOT.
- Nghi thức mỗi phép đo mới: «phá vật thật trong một bản sao thì phép đo này có
  đỏ không?» — phá thử một lần, ghi kết quả.
- Riêng hạng mục 3, phép đo phải là **round-trip**: một fixture code-sinh chạy
  qua cả bốn bộ đọc phải ra **cùng chữ**; đổi chữ ở một phía → đỏ.
- Riêng hạng mục 4, khoá mới phải nằm trong khối `START-SCAN-KEYS` — khối đã có
  ca round-trip P99, đổi tên một phía là đỏ.

## 9. Sửa sau phản biện context sạch (một lượt, không probe lại)

`gap-probe.md`: verdict `findings`, **0 P0 · 4 P1 · 1 P2**, cả năm đã sửa
artifact ngay — không mục nào đẩy sang cổng.

1. **Trục C thiếu người nhận** → AC-12 mới + eval E14.
2. **`## Đường đo` không phủ điều kiện CHẾT** (a) và (c) → thêm hai dòng, khai
   thẳng là **đo bằng người**, để Cổng Giá trị không đọc bảng toàn xanh trong
   khi một ngưỡng CHẾT đã bật.
3. **E8 đo reader-với-reader** → nay rút khuôn sáu điều kiện xanh-sạch từ chính
   nguồn bên VIẾT (`evidence-report-template.md`, khối marker) rồi dựng fixture
   từ đó, cộng một chân neo vào `evidence-report.md` THẬT trong cây.
4. **Danh sách đen trên không gian mở** (E1, E7) → E1 đo mệnh đề DƯƠNG +
   round-trip số dòng `=== groups.considering.length`; E7 đổi sang ALLOWLIST.
   Mỗi ca có thêm một chiều đỏ cố ý nằm NGOÀI danh sách đen.
5. **Hằng ghim vào thứ sẽ đổi** (E5 `=== 16`, E10 hash khối) → đổi sang quan
   hệ. Con số veto-mở đã trôi 14 → 16 trong đúng một ngày; hai file đã ký
   (`opportunity.md`, `decisions.jsonl`) giữ nguyên 14, không sửa hồ sơ đã ký.
   Đây là lớp `thước ghim vào thứ sẽ đổi` mà sổ lớp lỗi đang ghi «chưa quét
   trọn lớp» — nó lại nổi lên ngay trong vòng này.


## 10. Rà lại trước khi mời Cổng Phạm vi (owner yêu cầu, 23/08)

Sáu chỗ sửa, hai là lỗi thật:

1. **AC-2 từng bảo sửa hợp đồng ĐÃ KÝ của `vao-co-o-ra-co-ten`.** Kéo hồ sơ đã
   ký vào diff của một PR chạm engine là tự làm bằng chứng của nó stale (luật
   staleness thu theo `slug_in_diff`, ADR 0010) — PR sẽ bị lưới chặn. Nay: chỉ
   sửa ca đo VC6; hợp đồng kia giữ nguyên văn; con trỏ «thay thế» ghi ở
   `## Notes` hồ sơ này. Kèm: không ca nào đọc hợp đồng hồ sơ khác lúc chạy.
2. **E11 tưởng vũ trụ LB2 phải 16 → 19** — ba thân cổng ĐÃ nằm trong 16 file
   của chip D; đổi hằng là tự làm đỏ ca có sẵn.
3. **E8 bắt bản đồ «mời ký» ở đối chứng dương** — bản đồ không bao giờ mời ký
   (cố ý không vị từ); đối chứng dương chỉ áp ba bộ đọc có vị từ, bản đồ assert
   `BUCKET_OF` riêng. Bỏ dấu `(cross-layer)` ở AC-8: dấu đó nghĩa là
   UI→backend, mượn cho một seam CLI là dùng sai từ điển.
4. **Thang ahead/behind đảo thứ tự** — bản chung trước, nhánh trên cùng sau
   (§2). E9 thêm chân «nhánh đã push khớp nhánh trên cùng nhưng sau bản chung».
5. **E1 có một round-trip giả** («số dòng thẻ được dặn in») — thẻ là văn của
   model, không có renderer đếm dòng. Nay: khoá máy-đọc `giới hạn: không`
   trong khối, cùng nếp `key: value` VC6 đã round-trip; nói thật giới hạn của
   phép đo (văn trái khoá là việc reviewer).
6. **`acceptance-status.md` có ca đo đang ghim** needle `--repo` và đoạn điều
   khoản một-lượt-gõ — ràng buộc thi công ghi ở `## Notes`.
