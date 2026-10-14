# DUONG-NEN — khuôn tệp `duong-nen.md` và khuôn dòng đỏ

Chỗ **single-source** của hình dạng tệp `_acceptance/<slug>/duong-nen.md` mà
`feature-loop/scripts/duong-nen.mjs` ghi ở bước đầu S1. Bên viết (script) rút
hai khối marker dưới đây lúc chạy, không chép khuôn vào mã; bên đọc (thẻ Cổng
Phạm vi) đọc cùng khuôn. Thiếu tệp này hoặc thiếu một khối → script thoát mã 2
và KHÔNG ghi tệp nào.

Vì sao có đường nền: một lượt chấm bị hạ tầng đốt (công cụ vắng trên máy, suite
đỏ sẵn trên nhánh gốc, suite ghi rác vào cây, lưới trước-merge nợ vi phạm cũ,
engine vendored lệch bản đang chạy) trông giống hệt một lượt chấm đỏ vì vật.
Đường nền đo bốn chân đó TRƯỚC khi vòng viết tệp nào, không LLM, để đỏ của nền
không bao giờ được tính cho vật.

## Khuôn tệp

Mỗi dòng frontmatter `khoá: {…}` được thay bằng giá trị của chân; dòng bullet
giữ chỗ của mỗi mục được thay bằng từng dòng của MỤC ĐÓ nguyên văn, mỗi dòng một
bullet — mục rỗng thì đúng một bullet «không có». Hai dòng marker không vào tệp
ghi ra. Mục «Dòng vàng» (hồ sơ nen-khong-tinh-tep-cua-vong) có từ 2.31; tệp đời
trước không có mục ấy, bên đọc coi như rỗng.

<!-- <<<DUONG-NEN-TEMPLATE -->
---
slug: {slug}
at: {ISO}
sha: {sha}
nen: {xanh|do}
cong_cu: {xanh|do|bo-qua}
suite: {xanh|do|bo-qua}
luoi: {xanh|do|bo-qua}
engine: {xanh|do|bo-qua}
---

## Dòng đỏ

- {nguyên văn một dòng đỏ, mỗi dòng một bullet; nền xanh thì đúng một bullet «không có»}

## Dòng vàng

- {nguyên văn một dòng của chính vòng, mỗi dòng một bullet — tệp vòng viết trong lúc nền chạy, vi phạm lưới của chính hồ sơ; không lật nền; không có thì đúng một bullet «không có»}
<!-- DUONG-NEN-TEMPLATE>>> -->

## Khuôn dòng đỏ

Mỗi dòng dưới đây là `- <mã>: \`<khuôn>\``; `{tên}` là chỗ script điền. Script
tra khuôn theo mã; mã vắng → thoát mã 2.

<!-- <<<DUONG-NEN-DONG-DO -->
- cong-cu-thieu: `nen cong-cu: THIEU {tu} (khoa {khoa})`
- suite-khong-lenh: `nen suite: KHONG CO LENH {khoa}`
- suite-do-san: `nen suite: DO SAN {khoa} ma {ma}`
- suite-cay-ban: `nen suite: CAY BAN SAU SUITE {tep}`
- luoi-co-san: `nen luoi: {k} vi pham co san`
- luoi-loi-chay: `nen luoi: LOI CHAY ma {ma}`
- engine-lech: `nen engine: LECH {tep} ({a} ≠ {b})`
- engine-tu-host: `nen engine: tu-host`
<!-- DUONG-NEN-DONG-DO>>> -->

## Khuôn dòng vàng

Dòng của CHÍNH vòng — vòng viết tệp S1 trong lúc nền chạy (feature-loop S1#0 dặn soạn
song song), nên chân suite thấy cây bẩn và chân lưới thấy hồ sơ viết dở. Những dòng ấy
vào mục «Dòng vàng»: vẫn có tên trên thẻ, KHÔNG lật `nen` hay chân nào sang đỏ. Cùng
cách tra như khuôn dòng đỏ; mã vắng hoặc khối vắng → thoát mã 2, không ghi tệp.

<!-- <<<DUONG-NEN-DONG-VANG -->
- suite-tep-cua-vong: `nen suite: TEP CUA VONG {tep} (khong tinh)`
- luoi-cua-vong: `nen luoi: {k} vi pham cua chinh vong (khong tinh)`
<!-- DUONG-NEN-DONG-VANG>>> -->

Tệp nào là của vòng — vị từ MỘT chỗ, `feature-loop/scripts/lib/tep-cua-vong.mjs`: đường
bắt đầu `_acceptance/<slug>/` · tên tệp `YYYY-MM-DD-<slug>-design.md` hoặc
`YYYY-MM-DD-<slug>.md` · đúng `_acceptance/config.yaml` · một đoạn thư mục bằng `<slug>`
mà thư mục ấy chưa có ở HEAD. Suite không biết slug của vòng (slug sinh ở S0), nên lọc
các đường ấy không mất chiều đỏ; đánh đổi duy nhất là `config.yaml`. Vi phạm lưới của
vòng = dòng mở đầu đúng `VIOLATION [<slug>]:`; chân lưới chỉ xanh với các dòng ấy khi
lưới tự giải thích mã thoát — mã 1, có dòng tóm `pre-merge-check: <N> violation(s) —
merge blocked`, N bằng số dòng VIOLATION; thiếu một vế thì vẫn `LOI CHAY`.

## Bốn chân

| Chân | Đo gì | Đỏ khi |
|---|---|---|
| `cong_cu` | từ đầu (bỏ các phép gán `TEN=gia-tri` đứng trước) của mọi lệnh `executors.<loại>.<tên>` — hỏi máy bằng `command -v` CHỈ KHI từ đầu là một tên chương trình; từ đầu mang thay thế của shell (`$` `` ` ``) hoặc mở nhóm (`(` `{`) thì không tra, không đỏ, và in một dòng lý do kèm khoá ra stderr | một từ đầu **là tên chương trình** mà không có trên máy — luật xét đúng từ đầu, nên `lenh-thieu \| head` vẫn đỏ |
| `suite` | chụp `git status --porcelain`, chạy từng lệnh của `feature_loop.suite_keys` MỘT lần, TUẦN TỰ, mỗi lệnh một tiến trình con, chụp lại | suite thoát khác 0 · cây có dòng mới sau suite |
| `luoi` | `pre-merge-check.sh <root> --base <merge-base nhánh gốc> --no-t1-escape` — không bao giờ thu phạm vi theo slug; ưu tiên bản vendored của repo | có dòng `VIOLATION` (in nguyên văn dưới nhãn «có sẵn») · lưới chạy lỗi |
| `engine` | băm sha256 các tệp của khối `INIT-CI-COPY-LIST` (rút từ marker của `commands/acceptance-init.md`) ở bản vendored · bản plugin cache · bản đang chạy; tệp mang thẻ `[only-if-declared: <khoá>]` mà kho không khai khoá (không có dòng cột 0 `<khoá>:` trong config) và VẮNG ở bản vendored thì bỏ bản vendored khỏi các cặp của riêng tệp đó, in `engine: bo-qua <tệp> — tệp có điều kiện, kho không khai <khoá>` ra stderr | hai bản bất kỳ lệch nhau — kể cả tệp mang thẻ đang CÓ mặt mà lệch, và tệp mang thẻ vắng khi kho đã khai khoá |

`bo-qua` không phải đỏ: lưới không tìm thấy hoặc không dò được nhánh gốc, repo
không vendored tệp engine nào. Lý do bỏ qua in ra stderr của script. Máy không
có plugin cache → vế so với cache ghi `engine: cache bo-qua` ra stderr, chân
engine không vì thế mà đỏ. Kho tự host (gốc repo trùng gốc engine đang chạy) →
`nen engine: tu-host` ra stderr, chân xanh.

Mã thoát: 0 nền xanh · 1 nền đỏ (vẫn ghi tệp) · 2 không chạy được (không phải
kho git, thiếu `_acceptance/config.yaml`, thiếu `feature_loop.suite_keys`, thiếu
khuôn) — mã 2 KHÔNG ghi tệp.
