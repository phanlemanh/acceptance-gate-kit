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

## 4. Việc kế

Cả bốn chỗ ở §2 đều có neo ngoài: đó là PR cài kit của kho tiêu thụ, đúng vế 4 luật (b).
Đề xuất gom thành MỘT vòng `2.18.2` (T2):

- **§2.1 và §2.4** là vá điểm, không CỘNG.
- **§2.2 và §2.3** là CỘNG, chờ owner duyệt đích danh ở Cổng Phạm vi.

Chưa mở ô nào khi owner chưa gọi tên.
