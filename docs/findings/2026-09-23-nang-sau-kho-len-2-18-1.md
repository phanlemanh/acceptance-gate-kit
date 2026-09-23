# Nâng sáu kho tiêu thụ lên 2.18.1 — lớp CI chép tay là chỗ kit rò

**Ngày:** 2026-09-23 · **Chủ:** owner gọi tên («đưa lên toàn bộ thành 2.18.1», «đo ghi nhận
cách hoạt động với kit mới») · **Cách đo:** một phiên thí điểm ở oneflow báo theo khuôn bảy mục
(A–G); năm kho còn lại do một tác nhân con làm theo công thức rút từ thí điểm, báo cùng khuôn.
Mọi PR mở, KHÔNG merge. Không thước mới, không ô, không vòng meta.

## 1. Số đo

| Kho | PR | Phút tường | Tệp thêm/đổi/khớp sẵn | Fork cổng | pre-merge TRƯỚC→SAU |
|---|---|---|---|---|---|
| oneflow (thí điểm) | OneFlow#127 | 9–10 | 7/2/7 (+ `opportunity-template.md`) | có — gộp 3 chiều, 0 xung đột | 0 → 0 |
| artifact-platform | artifact-platform#391 | 1,9 | 2/7/7 | không | 0 → 0 |
| media-library | media-library#66 | 1,6 | 7/8/1 | không | **0 → 1** (§2.4) |
| floorplanstudio | floorplanstudio#34 | 1,3 | 7/3/6 | không | 0 → 0 |
| mapposter | MapPoster#58 | 0,8 | 7/3/6 | không | 0 → 0 |
| crm-onehub | — (đã nâng ở crm#78, 22/09) | 0,7 | 0/0/16 | không | 0 |

- **Lượt gọi người: 0** trên cả sáu kho. Owner nói hai câu lệnh ở phiên điều phối, không có câu hỏi cổng nào.
- **Phút máy:** thí điểm khoảng 5 phút máy; tác nhân con làm năm kho trong 7,4 phút tường, dùng 137 k token.
- **Plugin:** mọi scope `project` còn thư mục trên đĩa đã lên 2.18.1. Bốn scope trỏ vào worktree đã xoá, nên bỏ qua.
- **Giá trị tới tay kho hôm nay:** không phán quyết nào đổi. Không kho nào có hồ sơ máy-thông, BLOCKED có chữ ký hay dòng quan sát prod, nên ba lớp đọc mới chưa có gì để đọc. Thứ thấy được duy nhất là nhãn «đã nghỉ» của `normalize-text-vi` ở oneflow. Trước lượt nâng, plugin 2.16 vẫn gắn nhãn «đã giao» cho hồ sơ ấy.

## 2. Bốn chỗ kit rò, kèm chiều đỏ đã thấy

### 2.1 Danh sách chép vẫn thiếu tệp — lần thứ ba cùng một lớp

`scripts/product-map.mjs:38` đọc `skills/acceptance/references/opportunity-template.md`. Tệp này
không có trong danh sách 15 tệp của GUIDE §5.3. Chép đúng 15 tệp thì lệnh bản đồ thoát 2
(`khuôn opportunity-template không đọc được … ENOENT`).

- **oneflow** tự chép thêm tệp theo gợi ý của chính thông điệp lỗi.
- **crm** đã có sẵn tệp thứ 16 từ lượt #78.
- **Bốn kho còn lại** nhận tệp này vì tác nhân con được dặn trước.

Nghĩa là không kho nào tới được trạng thái xanh nếu chỉ theo tài liệu.

**Gốc:** ca CE2/CE2p ở `tests/scripts/consumer-esm.test.mjs:60` tính bao đóng bằng regex đọc mã.
`TEN_TEP` chỉ nhận đuôi `cjs|mjs|js|json`, nên một tệp dữ liệu `.md` đi qua `path.join(__dirname, …)`
thì lọt lưới. Đây là lần thứ ba cùng hình dạng:

1. `eval-yaml` và `lop-nhin-thay`, trước 2.13.
2. `product-map` và `trang-thai-ho-so`: crm#70, 22/09, vá ở 2.18.1 bằng cách nối danh sách.
3. `opportunity-template.md`: hôm nay.

Mỗi lần vá chỉ nới regex hoặc thêm tên. Theo luật «thước phải gắn vào vật», phép đo đang đo
*chỉ dẫn* (mã nguồn nhắc tên gì) thay vì *đầu ra* (ba lệnh CI có chạy được không).

**Dạng nghiệm đúng tầng:** một ca CHẠY ba điểm vào CI (`pre-merge-check.sh`, `recheck-evidence.cjs`,
lệnh `product_map:`) trong một thư mục tạm CHỈ chứa các tệp của danh sách, trên một kho fixture do
code sinh ra. Đối chứng dương: đủ danh sách thì xanh. Mutant: bỏ một mục thì đỏ, ghim đúng tên tệp.

### 2.2 T1-escape đỏ ở PR cài kit — ngưỡng đã chạm

Tổng kết cửa sổ 2.18 §6 ghi: «Không mở: `t1-escape` đỏ ở lượt CI đầu của PR cài kit, vì mới chạm
một lần. Ngưỡng: lần cài kế ở bất kỳ kho nào đỏ cùng lý do.»

oneflow đỏ đúng lý do ấy: exit 1, `VIOLATION [PR]: non-T1 files changed … NO _acceptance/<slug>/ artifacts`,
liệt kê sáu tệp mới. Không trang nào của kit nói tệp chép mới phải vào `t1_skip_globs`. Lời dặn
duy nhất nằm ở CHANGELOG 2.13.0 (dòng ~331).

Bốn kho sau không đỏ chỉ vì tác nhân con thêm glob trước theo bài học thí điểm, nên đó không
phải phép đo độc lập.

**Dạng nghiệm:** cổng tự nhận các tệp của danh sách chép là thước kit-owned. Danh sách đọc từ
MỘT nguồn có marker, không bắt từng kho khai tay. Việc này đổi hành vi cổng nên cần owner duyệt
(luật CỘNG).

### 2.3 Tầng lớp CI trôi mà không ai thấy

Trước lượt này, số phiên bản plugin nói «2.16.0» ở năm kho, trong khi lớp chép ở bốn kho
(artifact-platform, media-library, floorplanstudio, mapposter) mới có 7–8 trên 15 tệp. Theo GUIDE
§5.3, mỗi tệp thiếu là một lớp «tắt im lặng — CI vẫn xanh». Không tín hiệu máy nào nói ra điều
này. Phiên điều phối chỉ thấy vì tự `cmp` từng tệp với kit.

**Dạng nghiệm:** cổng tự kiểm đủ bộ. `pre-merge-check.sh` mang danh sách chép của chính nó, in
một dòng `ran`/`declared-off` cho «lớp chép đủ», và gọi tên tệp thiếu. Việc này cũng là CỘNG,
cần owner duyệt.

### 2.4 Nâng nhảy cóc không có đường đọc

**Con số theo từng bước.** CHANGELOG 2.18.1 ghi «chép thêm năm tệp». Con số này chỉ đúng với
kho đang ở 2.18.0. Kho thật cần thêm:

| Kho | Tệp cần thêm |
|---|---|
| oneflow | 6 |
| media-library, floorplanstudio, mapposter | 7 mỗi kho |
| artifact-platform | 2 |

**Không có sử liệu cho kho nâng từ bản cũ.** media-library nâng từ lớp khoảng 2.9 (07/09) lên
2.18.1 thì đỏ 9 VIOLATION `[cua-van-hanh]`. Lý do: làn ghim lại suite-only trước
`2026-09-07T12:00Z` hết được miễn (ADR 0014/0015). CHANGELOG không nhắc chữ `suite-only` hay
`evals_exit`, và tự khai rằng sử 2.0.0 → 2.12.0 không có trong tệp. Kho nâng từ dưới 2.13 không
có trang nào báo trước điều này. Ở đây kit giữ đúng luật; chỗ hở là không có đường đọc cho
người nâng.

**Dạng nghiệm:** GUIDE §5.3 nói rõ «nâng = đồng bộ theo danh sách, không theo con số của
CHANGELOG». CHANGELOG có một mục «nâng từ < 2.13» trỏ tới ADR 0014/0015 và lệnh ghim lại. Đây
là việc tài liệu, TRỪ-trung-tính.

## 3. Ngoài kit — ghi để không mất

- **oneflow** có hai thước bản đồ: `scripts/ci/check-product-map.mjs` của kho và `product-map.mjs --check` của kit. Hai thước đã lệch nhau trên main, và đó là quyết định của kho (đã nêu trong OneFlow#127).
- **oneflow** main đỏ sẵn ở «Roadmap ledger freshness» (`skill-system-v1`).
- **floorplanstudio** đỏ sẵn ở `digitize-published-area`.
- **Linter của kho** quét tệp vendored: biome của oneflow đỏ; oxlint của floorplanstudio và mapposter chỉ thêm cảnh báo. Mỗi kho loại trừ theo lệ riêng.
- **Phiên điều phối tự dẫm một lần:** bảng lệch đầu tiên đo crm trên checkout cục bộ tụt sau `origin/onehub`, nên báo sai «thiếu 2». Đây là cùng bài học với «worktree đi sau origin/main».

## 3b. Đo sâu cùng ngày (owner hỏi «phân tích kỹ trước khi quyết»)

Mọi số dưới đây đo bằng `git worktree` dựng từ ref gốc của chính kho, chép lớp từ kit `8a4ea881`.

- **§2.1 dựng lại được.** Có 15 tệp: `product-map --check` thoát 2 (ENOENT) trên cây crm và oneflow.
  Có 16 tệp: crm thoát 0; oneflow thoát 1 vì bản đồ vẽ dưới 2.16, khớp báo cáo F.
- **§2.2 lật một tiền đề.** Cả sáu kho đã có `scripts/pre-merge-check.sh` trong `t1_skip_globs`
  (lời khuyên của CHANGELOG 2.13.0). Mà trong mô hình chép, CI chạy bản cổng của CHÍNH PR, nên
  T1-escape không canh được tệp cổng dù có miễn hay không. Lỗ mà `.out-of-scope/t1-skip-globs-github-and-manifests.md`
  sợ («đổi CI có thể TẮT cổng») đã mở ở cả sáu kho từ 14/09. Thứ duy nhất canh được nó nằm ở forge:
  CODEOWNERS và branch protection trên `scripts/`, `lib/`, `.github/workflows/`.
- **§2.3: bỏ từng tệp một** (cây oneflow, `--base origin/main`).
  - **Năm tệp lên tiếng:** chính cổng (127), `recheck-evidence` (40 VIOLATION), `workspace-record`, `eval-yaml` (34), `ac-line` (NOTE).
  - **`evidence-core` lên tiếng khi có hồ sơ trong phạm vi:** 56 VIOLATION trên crm `--recheck-all`. Ghi chú đính chính: nó không fail-open.
  - **Chín tệp IM LẶNG, `clean` giống hệt bản đủ:** `gap-probe`, `md-section`, `lop-nhin-thay`, `nhan-canh-gay`, `product-map`, `trang-thai-ho-so`, `khong-can-nguoi`, `nguong-o-co-hoi`, `out-of-contract`.
  - **Im tới ngày có ca.** Hôm đó phần lớn fail-closed nhưng thông điệp đổ lỗi cho hồ sơ. Ví dụ «không đọc được mục Known limits» hay «verdict=BLOCKED must be PASS», trong khi nguyên nhân là thiếu lib.
  - **Riêng `lop-nhin-thay` chỉ in NOTE**, không bao giờ chặn.
- **Chạy cổng từ bản kit, không chép:** `bash <kit>/scripts/pre-merge-check.sh . --base …` trên cây đã gỡ lớp chép.
  - mapposter và artifact-platform: `clean`, product-map thoát 0.
  - crm: 3 VIOLATION «không đọc được mục Known limits», vì `pre-merge-check.sh:376` và `:397` đọc lib theo `$ROOT` thay vì theo thư mục của cổng như mọi chỗ khác.
  - Hai chỗ lệch này không test nào thấy, vì ở kit và ở kho chép hai đường trùng nhau.
- **Ghim lại media-library** (14,3 phút, 146 eval):
  - **8/9 hồ sơ đỏ-hạ-tầng:** DB chung đã nhận migration 0029 của nhánh khác; thiếu env.
  - **1/9 đỏ-vật:** `cua-nguon-thong-nhat` có insert ngoài danh sách trắng từ 27/08 và chặn 429 từ 05/09. Làn suite-only 04/09 đã che lỗi này.
  - **Bốn chỗ tác nhân con nêu về công cụ ghim lại — đã kiểm lại từng chỗ trên `repin-lane.mjs` 2.18.1:**
    1. Dòng `suites: N lệnh exit 0` là chuỗi cố định ở dòng 465, nhưng chỉ được GHI khi làn xanh
       (`red = suitesExit.some(x => x !== 0)` → «LÀN ĐỎ — không ghi gì», dòng 468–475). Làn xanh thì
       mọi suite đúng là exit 0. Vậy đây là một dòng stdout gây hiểu nhầm trong làn đỏ, KHÔNG phải
       bản ghi tự dối. Đính chính: bản đầu của tệp này xếp nó nặng nhất — sai.
    2. Một hồ sơ đỏ chặn tám hồ sơ còn lại: đây là mặt sau của lựa chọn «một làn máy — nhiều chữ ký»
       ở GUIDE §7.1, đổi lấy việc chạy suite MỘT lần cho N hồ sơ. Là đánh đổi đã quyết, không phải lỗi.
    3. BLOCKED/CANNOT-RUN gộp vào «LÀN ĐỔ»: đúng là chưa tách; nhãn cạnh gãy của 2.18.0 mới có ở thẻ
       Cổng 2, chưa có ở làn ghim lại. Vá điểm, nhỏ.
    4. Executor E7 ghi vào `evidence/` của hồ sơ đã ký: làn BẮT được và từ chối ghi (dòng 473) — đó là
       lưới «chặn phép đo ghi vào evidence/ đã ký» đang làm đúng việc, không phải lỗi công cụ.

## 3c. Rà lại theo North Star và ranh giới kit/kho (owner hỏi 23/09)

- **Lượt gọi người do bốn chỗ rò gây ra hôm nay: 0.** Chi phí đo được là phút máy (≈17 phút cho 6 kho)
  và RỦI RO (một lớp lọt lưới im lặng, thông điệp đỏ đổ lỗi sai chỗ). Dòng người đứng trước dòng máy,
  nên bốn chỗ này KHÔNG cạnh tranh được với hạt giống «máy hỏi ngoài thiết kế ở S1» (21 câu hỏi/3 vòng crm)
  cho suất vòng meta duy nhất của cửa sổ này, trừ khi owner cân rủi ro khác.
- **Bản sửa riêng của oneflow lớn hơn tưởng:** so với bản kit gần nhất (`11e98c47`, 2.17.0), gate của
  oneflow THÊM 508 dòng và BỎ 27 dòng của kit, trên 2103 dòng (≈24 %). Bỏ bản chép đồng nghĩa kit phải
  nhận `feature_scope` (CỘNG) hoặc oneflow ở lại đường chép vĩnh viễn — câu hỏi ranh giới, chỉ owner quyết.
- **Bỏ bản chép còn thiếu ba thiết kế** chưa ai đo: chỗ đặt dòng ghim (đặt trong `.github/` thì mỗi lần
  nâng lại đỏ T1-escape đúng theo luật đã bác ở `.out-of-scope`; đặt trong `_acceptance/config.yaml`
  thì không đỏ nhưng mọi PR đổi được phiên bản cổng — giới hạn được vì chỉ trỏ vào sha của kit); bản
  chạy ở máy và ở CI phải cùng một sha (hôm nay bản chép bảo đảm điều đó miễn phí); kit chưa có tag phát
  hành. Vì thế nó là T3, không phải nhát cắt rẻ.
- **Kết luận rà lại:** khuyến nghị «bỏ bản chép» ở bản đầu vượt ranh giới chiều rộng (b) và chưa đặt
  mình vào hàng đợi — rút về hạt giống có ngưỡng. Xem lời trình cho owner cùng ngày.

## 3d. Owner trả lời (23/09) và số đo bổ sung

Owner: (1) kho **theo sát từng mốc**; (2)–(4) yêu cầu giải thích + đề xuất; nguyên tắc **bỏ tốt hơn thêm**.

- **Đính chính §2.3/§3c về `lop-nhin-thay`:** đo lại theo ref `origin/*` (bash, không zsh): trước PR hôm nay
  chỉ **media-library** thiếu tệp này (gate chép 08/09, đúng ngày tệp vào kit). Năm kho kia có. Câu «vắng ở
  4 kho ~2 tuần» là sai, do đo trên checkout cục bộ tụt hậu. Làn của nó là NOTE có ngưỡng đếm (2 hợp đồng
  ký không frame trong một mốc → siết), thiếu lib thì in «không kiểm được»: không có răng nào mất.
- **Fork gate của oneflow, đo trên cây thật:** so với kit `11e98c47` (2.17.0): +508/−27 dòng trên 2103.
  - 27 dòng kit bị bỏ gồm **răng pin ma P184** (clone đầy đủ + `verified_commit` không tồn tại → VIOLATION);
    fork giữ bản NOTE cũ → yếu hơn kit ở đúng lớp «cổng tàng hình». Oneflow merge bằng merge-commit
    (40/40 commit gần nhất) nên răng này chưa có ca để bắt — yếu tiềm ẩn, chưa gây hại.
  - 508 dòng thêm = `feature_scope`: dùng khoá `paths:` của evals.yaml (kit khai là **nút hiệu năng P1
    carry-forward**, khai thiếu vô hại) làm **phạm vi đúng-sai** của luật stale ở cổng merge: hồ sơ trong
    diff chỉ stale khi đổi tệp thuộc scope (lỏng hơn kit); hồ sơ ngoài diff có khai `paths` vẫn bị soi
    theo scope (chặt hơn kit). Parser grep-YAML, tự khai «sáu vòng vá liên tiếp».
  - **Chạy hai gate cạnh nhau ở chế độ PR trên 4 merge gần nhất của oneflow (#119, #120, #121, #126):
    verdict và số VIOLATION GIỐNG HỆT.** `feature_scope` chỉ in NOTE «narrow staleness scope applied» và
    một lần «declared paths do not cover this PR's gated diff — whole-tree applied». Hai merge cũ hơn
    (#114, #115) cả hai gate đều đỏ vì cùng một lý do khác (làn suite-only, luật 2.13+).
  - Nhu cầu gốc của fork (hồ sơ cũ không liên quan chặn mọi PR) kit đã giải ở 1.39.2 + ADR 0010
    (`slug_in_diff`). Phần còn lại của fork chưa từng đổi một verdict nào trong mẫu đo.
- **Bỏ bản chép — đo lại kích cỡ thật:** `hooks/` và `commands/` của kit không gọi tệp chép nào (chỉ
  tài liệu nhắc). Gate, recheck, product-map đều giải lib theo thư mục của chính nó, trừ hai dòng 376/397
  (chỉ chạm hồ sơ machine-cleared; oneflow có 0, crm có). Chính kit đã đặt `.github/workflows/gate.yml`
  vào `t1_skip_globs` của mình — tiền lệ cho kho tiêu thụ đặt dòng ghim trong tệp workflow có tên mà không
  đỏ T1-escape. Vậy phần kit cần: tài liệu (T1) + hai dòng + xoá danh sách chép và ca CE2 (TRỪ). Định cỡ T3
  ở §3c là quá tay.
- **Hai PR cũ (#114/#115) của oneflow:** kit 2.17 báo 22–24 VIOLATION làn suite-only; fork cũng đỏ 33–34.
  Không liên quan `feature_scope`.

## 3e. Ma sát nghi thức kit ghi từ phiên media-library #66 (S4 delta hai hồ sơ đã ký, 23/09)

Kết quả: 9 → 3 → 1 vi phạm; `ban-dieu-khien-curator` vòng 14 PASS 21/21, `cua-nguon-thong-nhat` vòng 9 PASS;
3 lượt gọi người (1 quyết định thật + 2 lượt dán lệnh ký do khoá ADR 0002) — đúng trần T2. Tám chỗ phiên
phải đoán, trích nguyên dòng, để hạt giống sau đọc:

1. `s4-args`: «section "## Iterations" không chứa dòng "Round <n>" nào — không đếm được round; truyền --round tường minh» → đếm tay.
2. SKILL S4: «Invoke: Workflow({ scriptPath: …, args: { … } })» — args 58 KB, không có đường truyền theo tệp → bọc bằng bản sao script (đã là bộ nhớ kit «bọc args S4 bằng script»; lần thứ hai, vẫn chưa là lệnh).
3. SKILL: «Write `_acceptance/<slug>/evidence-report.md` = `result.report`» — báo cáo 15 KB → ghi bằng node rồi recheck thay hook Write.
4. `eval-executors.md`: «add `.acceptance-runs/` to `.gitignore`» — nhưng `.gitignore` không thuộc `t1_skip_globs`, sửa nó làm cũ-hoá mọi hồ sơ vừa ghim → tạm dùng `.git/info/exclude`. **Lời dặn tự mâu thuẫn với luật stale.**
5. SKILL: «descope một AC = sửa contract + re-approve» — không nói gì cho một dòng bảng mà hợp đồng khai «thêm một dòng là quyết định của người» → đi đường «Treo» ở Cổng 2.
6. Schema sổ («descope|approach|fix|revisit») không có type cho «chờ bí mật của người» → ghi vào PR body.
7. Cùng một người hai cách viết chữ ký («manh» nấc cổng-trước · «Mạnh» nấc git user.name) vì `approved_by` của hồ sơ do tác giả «phanlemanh» commit.
8. SIGNOFF-LANE-CLAUSE «--skip-unchanged: cây BẰNG PIN (0 tệp git-theo-dõi đổi so verified_commit)» tính cả tệp môi trường chưa commit (`supabase/config.toml`) → làn chạy trọn; pre-merge sau chữ ký báo stale tới khi trả tệp.

Cùng lớp với hạt giống `2026-09-22-hat-giong-may-hoi-ngoai-thiet-ke-o-s1.md` (mục 2, 3: máy phải tự chế đường
đi cho lệnh kit) và với `2026-09-22-hat-giong-bon-loi-nho-2-18-0-tu-crm.md` (mục 4: lời dặn đá luật). Không mở ô.

**Bổ sung sau khi `cua-van-hanh` xanh (vòng 12, ký «manh 2026-09-23»; PR #66 clean, 9/9):** 4 lượt gọi
người cho hồ sơ này (dán khoá Sentry · «chạy tiếp» · «theo khuyến nghị» · dán lệnh ký). Chốt bắt được một
va chạm giàn đo có từ trước chữ ký 05/09 (ba lượt itest song song đếm lẫn asset stock) — sản phẩm không rò.
Ba chỗ đoán thêm:
9. SKILL: «triaged có mục inContract: false → TUYỆT ĐỐI KHÔNG sửa trong round này» — lỗi ngoài hợp đồng nằm
   trong chính mã phép đo vừa viết ở vòng đó (E1 nuốt lỗi truy vấn) cũng bị cấm sửa → lên thẻ. Luật viết cho
   vật, không lường mã-đo.
10. `--skip-unchanged` chạy trọn vì tệp môi trường chưa commit (mục 8) → chạy lại cả E4 (workflow GitHub
    thật) và E13 (Sentry thật) ngay lúc ký, dù S4 vừa carry hai eval đó.
11. Luật stale chỉ soi hồ sơ trong diff (ADR 0010, đánh đổi đã khai): đổi `scripts/itest-l3.ts` dùng chung
    thì hai hồ sơ đã ký NGOÀI PR (`l3-search-media-card`, `itest-teardown-residue`) thối im lặng — phiên phải tự
    grep `paths`/`itest_ci` rồi chạy làn chỉ đo. Đây đúng là ca mà fork `feature_scope` của oneflow (hồ sơ
    ngoài diff có khai `paths` vẫn bị soi theo scope) sinh ra để bắt; kit đã có khoá `paths:` (P1) nhưng chưa
    dùng nó cho luật stale. Ghi để đếm, không mở lại ADR 0010.

## 3f. Hai kho đầu rời đường chép (23/09)

| Kho | PR | TRƯỚC→SAU | Dòng khác | CI | Phút |
|---|---|---|---|---|---|
| oneflow (kèm bỏ fork 508 dòng) | #129 → merged `9fbe0d60` | 0→0 | 0/51 (bỏ 9 NOTE «narrow scope» của fork) | 6/6 | ~6 |
| artifact-platform | #392 → merged `c9067c06` | 0→0; `--recheck-all` 490/490 | 0/275 | 3/3 | ~15 |

Cả hai ghim `KIT_SHA=8a4ea881` = HEAD marketplace máy dev. 0 lượt gọi người ở cả hai.

Ma sát tài liệu, trích nguyên dòng (đã sửa GUIDE §5.3 cùng ngày cho 1–4):
1. «`CLAUDE_PLUGIN_ROOT` là bản plugin đã cài» — không rõ marketplace hay `cache/…/2.18.1`.
2. `--base "origin/$GITHUB_BASE_REF"` — lượt `push` base rỗng.
3. «gỡ các dòng `t1_skip_globs` khai tệp kit» — không nói tên `.js` cũ có gồm không.
4. Khuôn `VAR=… bash "$VAR/…"` một dòng không chạy — shell mở rộng trước khi gán; phải `export`.
5. `lib/context-glossary.cjs` — tệp kit đời cũ nằm ngoài danh sách 16, hook vocab-guard của kho vẫn đọc; kho giữ lại. Cùng lớp «danh sách chép không khép».

Phát hiện đo được, đã có án: PR #392 xoá 16 tệp non-T1 mà T1-escape **im**, vì cùng PR chạm
`_acceptance/config.yaml` và luật coi mọi đường dưới `_acceptance/` là «mang bằng chứng»
(`pre-merge-check.sh` ≈ dòng 1617, ghi rõ trong chú thích). Đây là lần đo sống thứ hai của lỗ mà owner
đã bác siết ở 15/08 (`.out-of-scope/t1-escape-slug-only-thu-hep-mien-tru.md`) — đã ghi vào mục Prior
requests của tệp đó, không mở lại.

**Đính chính sau merge (artifact-platform, 05:05Z):** câu «gỡ `t1_skip_globs` cùng PR không đổi verdict» ở
GUIDE §5.3 (rút từ oneflow #129) là SAI — nó chỉ đúng ở chế độ `--base` (cổng soi hồ sơ trong diff).
Lượt `push` không `--base` trên main artifact-platform: 144 → 146 hồ sơ hết hạn; hai hồ sơ mới
(`chat-ux-chuan-hoa`, `deal-preview-link-reload`) có «Changed:» chứa chính các tệp kit vừa xoá. Khai lại
19 tên (kể cả `.js` cũ) → về 144. Cơ chế: luật stale đếm tệp đổi từ `verified_commit` ngoài
`t1_skip_globs`; gỡ dòng khai biến việc xoá tệp kit thành «code đổi sau verify». Oneflow #129 cũng đã
gỡ các dòng ấy — main oneflow chưa đỏ vì job `push` vẫn truyền `--base origin/main` (diff rỗng), nhưng
hồ sơ ký trước 23/09 sẽ stale ở PR kế chạm nó. GUIDE §5.3 đã sửa: GIỮ dòng khai làm lịch sử; đo
TRƯỚC↔SAU thêm một lượt không `--base`. Việc khôi phục ở hai kho giao lại cho phiên/chip của kho.

Nợ có tên ở artifact-platform: eval E2 của hồ sơ đã ký `gate-slug-visibility` chép đè
`scripts/pre-merge-check.sh` — tệp không còn; chờ lần ghim kế đỏ rồi xử cùng lớp với nợ oneflow.

## 3g. Oneflow trả nợ sau khi bỏ thước riêng và bản chép (PR #130, merged)

Stale không `--base` (kit 8a4ea881): 8ca36b5 (trước #129) **39** → 9fbe0d6 (sau #129) **40** (+`roadmap-drift-guard`)
→ sau khôi phục dòng khai **39**, cùng tập slug → cuối PR **31**, tập con thật của mốc. Phải khai thêm
`lib/lop-nhin-thay.cjs` — tệp chép ở a282fed nhưng chưa từng được khai. Owner chọn lối A (1 lượt gọi người):
nghỉ `cong-tu-canh-minh` + nhóm canh cổng fork (`gate-tooling-t1`, `stale-scope-by-paths`, `gate-scope-anchors`);
ghim lại 4 hồ sơ sống (18/18 · 11/11 · 9/9 · 17/17) và `roadmap-drift-guard`; xoá 2 thước riêng, 8 guard chỉ canh
cổng fork, 35 khoá config; −3065/+107 dòng. `--base` và `--recheck-all` đều clean.

Chỗ nghi thức kit bắt đoán:
12. GUIDE «Cho một hồ sơ nghỉ»: «Miễn trừ là **toàn phần** cho hồ sơ ấy» — không có nghỉ MỘT PHẦN; `gate-scope-anchors`
    mất tư cách đã ký cho 9 AC own-range còn xanh vì phần còn lại canh cổng fork.
13. GUIDE §7.1: «chạy `feature_loop.suite_keys` và mọi eval test/script của từng hồ sơ tại HEAD» — không nói có được
    đổi LỆNH sau một khoá config mà eval đã ký trỏ vào không. Phiên đã trỏ `lcm_pmap`, `mhb_existing_guards` sang bộ đọc
    kit rồi ghim lại xanh. Đây là đổi vật đo của hồ sơ đã ký ngoài nghi thức amendment — ghi để kit quyết khuôn.
14. Công thức dòng nghỉ chỉ đòi «một câu lý do»; với `stale-scope-by-paths` lý do «thước = kit» không đúng (kit không
    canh thay lời hứa scope-hẹp) — sự thật nằm ở vế impact. Cùng lớp với mục 11 (ADR 0010).
15. GUIDE §5.3 (3) có ở kit 8f662829 nhưng CHƯA có ở sha ghim 8a4ea881 — kho đọc tài liệu theo sha ghim thì không thấy
    bài học mới. Tài liệu đi theo main, engine đi theo sha: hai nhịp.

## 4. Việc kế

Cả bốn chỗ ở §2 đều có neo ngoài: đó là PR cài kit của kho tiêu thụ, đúng vế 4 luật (b).
Đề xuất gom thành MỘT vòng `2.18.2` (T2):

- **§2.1 và §2.4** là vá điểm, không CỘNG.
- **§2.2 và §2.3** là CỘNG, chờ owner duyệt đích danh ở Cổng Phạm vi.

Chưa mở ô nào khi owner chưa gọi tên.
