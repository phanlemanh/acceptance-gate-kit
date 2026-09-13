# Thiết kế — Cổng người đọc đủ nguồn

*Ngày 12/09/2026 · hạng T3 · slug `cong-nguoi-doc-du-nguon`*

## 1. Một câu

Hai cổng người của kit kết luận trên một nguồn HẸP HƠN nguồn đang có: Cổng Bằng chứng
phán «xanh-sạch» mà không đọc `review-findings.md`, và Cổng Phạm vi đếm tiêu chí bằng một
khuôn chỉ nhận dòng gạch đầu dòng. Vòng này nối hai cổng vào đủ nguồn, và bắt lời khai
phải đối chiếu được với vật.

## 2. Lớp lỗi — một hình dạng, ba chỗ

| Chỗ | Nguồn đang đọc | Nguồn đang có | Hệ quả |
|---|---|---|---|
| Luật xanh-sạch (`xanh_sach_check` bash · `xanhSach` mjs) | `evidence-report.md` | `review-findings.md` cùng lượt | Hồ sơ còn phát hiện chưa ai quyết vẫn đi làn V, không mời ký |
| Thẻ Cổng Phạm vi + lint + răng cross-layer (`lib/ac-line.cjs`) | dòng gạch đầu dòng trong mục `Criteria` | tiêu chí khai bằng `### AC-n`, và mục tên `Acceptance Criteria` | Thẻ hiện 0 tiêu chí; bộ dò điểm mù im ở 35 hồ sơ |
| Thẻ Cổng Bằng chứng (`gate-card.js`) | mục `Ngoài hợp đồng` | có thêm mục `Trong hợp đồng` | Lỗi trong hợp đồng chưa sửa không hiện ở đâu, thẻ vẫn ghi «Bằng chứng đầy đủ» |

Cả ba cùng một câu: **bên đọc hẹp hơn bên viết, và chỗ chênh lệch đó im lặng.** Vì thế
vòng này sửa theo LỚP — một bộ đọc cho mỗi vật, hai bên cùng rút — chứ không vá ba chỗ.

## 3. Số đo trước khi sửa

Lệnh sinh số nằm trong `## Đường đo` của hợp đồng; đây là kết quả.

| Số | Giá trị |
|---|---|
| Hợp đồng thẻ hiện ÍT tiêu chí hơn hợp đồng khai | **221** / 11 kho |
| Tiêu chí vô hình với thẻ | **1 491** |
| Trong đó đã có chữ duyệt Cổng Phạm vi | **214** |
| Bộ dò điểm mù IM LẶNG (thẻ trống, không cờ nào) | **35** |
| Hồ sơ làn V / máy-thông còn mục CHỜ NGƯỜI | **4** (kit 2 · crm 2) — đếm trần không trừ sổ định đoạt cho 5 |
| Hợp đồng sẽ sinh VIOLATION cross-layer MỚI nếu widen | **0** |

Hai con số cuối là hai bản lề của thiết kế: **0** nói răng cross-layer widen được mà không
khoá kho nào; **4** nói luật thứ bảy PHẢI có đường đọc-cũ, vì hai trong bốn hồ sơ đó nằm
trên `main` của chính kit — áp thẳng là kho tự khoá mình ở mọi PR.

Vị từ **«mục CHỜ NGƯỜI»** khai đủ ở mục Context của hợp đồng: số mục ở hai tiêu đề TRỪ số
dòng sổ khai `stage: "gate2"`. Đếm trần cho 5, vị từ cho 4 — `ghim-lai-tren-lop-cu` có 2
mục và 5 dòng định đoạt nên nó SẠCH, và đúng ra phải sạch. Phản biện context sạch xếp chỗ
thiếu định nghĩa này là P0; nếu đếm trần thì mọi hồ sơ từng có phát hiện rồi đã xử sẽ vĩnh
viễn không sạch và kit tự khoá mọi PR của chính nó.

## 4. Ba quyết định thiết kế

### D1 — Luật thứ bảy đọc VẬT, lời khai chỉ để đối chiếu

Khối `EVIDENCE-XANH-SACH-BLOCK` (nguồn duy nhất của sáu điều kiện) nhận điều kiện thứ bảy
`findings`: *`review-findings.md` không còn mục nào chờ người ở «Ngoài hợp đồng» và «Trong
hợp đồng»*. Cả hai bản dựng (bash + mjs) rút qua **một vị từ** trong `lib/evidence-core.cjs`,
vị từ đó gọi **một bộ đọc** `lib/out-of-contract.cjs`.

Đổi tên `lib/out-of-contract.js` → `.cjs` là bắt buộc, không phải thẩm mỹ: tệp nay chép sang
kho tiêu thụ, mà kho `type: module` sẽ nạp `.js` thành ESM và `require` chết. Chú thích cũ ở
`tests/plugins/run-tests.sh` nói «file không chép sang consumer nên giữ đuôi cũ» — lý do đó
hết hiệu lực trong chính vòng này, nên chú thích sửa cùng lượt.

### D2 — Đường đọc-cũ neo vào LỜI KHAI của báo cáo, không neo vào ngày

Báo cáo mang khoá mới `findings_open: <n>` do bên viết điền. Luật đọc:

| Báo cáo | Vật (`review-findings.md`) | Xử |
|---|---|---|
| có khoá, khớp vật | 0 mục | xanh-sạch |
| có khoá, khớp vật | n > 0 mục | **VIOLATION** — mời ký |
| có khoá, LỆCH vật | bất kỳ | **VIOLATION** — lời khai lệch vật |
| VẮNG khoá | n > 0 mục | **NOTE + cờ vàng** — hồ sơ đời trước, không chặn |
| VẮNG khoá | 0 mục | xanh-sạch |

Vì sao neo vào khoá chứ không vào ngày hay sha: mệnh đề gắn ngày là đúng thứ
`bat-bien-khong-duoc-nam-trong-ho-so-da-ky` vừa buộc lưu kho bốn hồ sơ. Khoá là **thuộc tính
của vật**, còn đúng sau 50 commit.

Vế «vắng khoá → NOTE» là một đường fail-open có tên: xoá khoá thì hạ xuống NOTE. Nó chấp
nhận được vì **cửa GHI không đi qua khoá** — `khong-can-nguoi.mjs --write` luôn đọc thẳng
`review-findings.md`, nên không hồ sơ MỚI nào vào được trạng thái máy-thông với phát hiện
còn treo. Ngưỡng mở lại ghi ở Known limits.

### D3 — `ac-line.cjs` đọc theo KHỐI, và mục tiêu chí nhận cả ba cách viết

`parseAC(line)` giữ nguyên chữ ký (ba bên gọi khỏi đổi). Thêm `parseACBlock(contractText)`
trả trọn danh sách, hiểu hai hình dạng khai:

- **gạch đầu dòng** — như hôm nay, `parseAC` từng dòng;
- **tiêu đề** — `### AC-n — nhãn`, thân là các dòng tới tiêu đề kế; nhãn và thân nối lại
  thành `gwt`, tag `(judgment)` / `(cross-layer)` đọc theo đúng luật cũ (nhãn lỏng, thân
  chỉ nhận tag đúng chữ, code span không phải tác giả đang nói).

Mục tiêu chí nhận `Criteria` · `Acceptance Criteria` · `Acceptance criteria`; không có mục
nào thì quét cả tệp như hôm nay. `AC_SUSPECT` nới để nhận dòng tiêu đề — không nới thì bộ dò
tiếp tục im đúng ở chỗ nó sinh ra để kêu.

Ba bên gọi (`gate-card.js` ×2, `evidence-page.js`, `eval-coverage-lint.js`) và nhánh node của
răng cross-layer trong `pre-merge-check.sh` chuyển sang `parseACBlock`. Nhánh awk dự phòng
nới cùng lượt, nếu không hai bề mặt trả lời khác nhau về cùng hợp đồng — đúng lớp lỗi
`xanh_sach_check` từng mắc.

## 5. Vì sao KHÔNG làm trong vòng này

- **`parseEvals` giữ nháy trên `id`** — vá đúng chỗ cần `unquoteScalar`, mà hàm đó sống ở
  `evidence-core.cjs`, tầng TRÊN `eval-yaml.cjs`. Vá tử tế là dời bộ tách token xuống tầng
  dưới, tức chạm hai tệp vendored ngay sau khi 2.11.0 vừa sắp xếp lại chúng. Bán kính đo
  được hôm nay: **0 eval** trong 8 kho. Ghi sổ, không làm.
- **Răng «đã nâng plugin mà chưa chép lớp CI»** — sống ở phía kho tiêu thụ, hợp đồng riêng.
- **Tool-kill đỏ giả** — cần tín hiệu cấu trúc từ harness, hợp đồng riêng.

## 6. Ràng buộc trình tự — ĐÃ GIẢI

Vòng `cua-veto-sau-chu-ky` gộp `main` ở `99137c06` (PR #172) ngày 12/09, TRƯỚC vòng này.
Nhánh của vòng này đã gộp `main` tại `2b49621c`. Xung đột duy nhất: cả hai chèn khoá
executor ở cùng chỗ trong `_acceptance/config.yaml` — giữ cả hai khối.

Ba chỗ phiên kia cảnh báo, kiểm sau khi gộp:

| Chỗ | Trạng thái |
|---|---|
| `lib/evidence-core.cjs` có khối mới `CHU-KY-THAT` (dòng 1038–1126) | KHÔNG đụng. Vị từ của vòng này là một khối marker RIÊNG. Khối kia còn là **tiền lệ khuôn**: một nguồn trong lõi, hai bên gọi rút vào — đúng hình dạng AC-2 đòi |
| `scripts/pre-merge-check.sh` đổi 98 dòng, bị DV5 canh chỉ-được-thêm | `xanh_sach_check` còn NGUYÊN 55 dòng, vẫn ba chỗ gọi. Điều kiện thứ bảy là dòng THÊM, không xoá dòng luật cũ nào, nên không cần mục `ALLOWED_REMOVALS` |
| `scripts/start-scan.mjs` thêm ba khoá vào `START-SCAN-KEYS` | Không chạm. Vòng này không đọc bộ quét |

## 7. Hình

Hai điểm quyết định vượt ngưỡng N5 — luật thứ bảy (bốn nhánh) và đường đọc của tiêu chí
(hai hình dạng khai × ba bên đọc). Đề bài và hình ở `_acceptance/cong-nguoi-doc-du-nguon/figures/`.
