# Kiểm bản cài sau phát hành (KC1) — thiết kế

Ngày 13/10/2026 · hồ sơ `_acceptance/kiem-ban-cai-sau-phat-hanh/` · hàng KC1 của `docs/plans/lo-trinh-kit.json`
· vòng meta DUY NHẤT giữa 2.28 và mốc kế (luật chiều rộng (b), chủ kho gọi tên 12/10).

## 1. Vấn đề

Hai lỗi của mốc 2.27 chỉ lộ SAU khi kho thật đã cài:

- **Thiếu thư mục gói.** Bản cài `feature-loop` không có `agents/` → mọi lượt chấm ghi `loai-tac-tu-vang`
  («agent type 'feature-loop:cham-lenh' not found»), A1 chưa chạy sống lần nào.
- **Bản cài khác tag.** Bản «2.27.0» ở M5 là main 294b29d, không phải tag a1e2e0b9.

Gốc chung, đo 13/10: chợ plugin của kit là kiểu THƯ MỤC trỏ bản checkout chính, nên thứ cài về là cây
đang checkout lúc cài; và bộ đệm plugin khoá theo SỐ phiên bản — `marketplace update` + `plugin update`
báo «already at the latest version» mà giữ nội dung cũ, chỉ gỡ rồi cài mới làm mới.

## 2. Hình dạng nghiệm

Một lệnh `scripts/kiem-ban-cai.mjs` (gói gốc, tự host) với hai chế độ.

### 2.1 Kho giả lập (`--ref <tag|sha>`)

1. Giải `ref` ra commit; đọc `.claude-plugin/marketplace.json` TẠI ref → danh sách gói và nguồn của từng gói
   (rút từ manifest, không danh sách gõ tay); số phiên bản mong đợi đọc từ `plugin.json` của từng gói tại ref.
2. Nguồn cài = `git archive <ref>` vào thư mục tạm. Cờ `--nguon-cai <dir>` thay nguồn — dùng cho ca đo
   (nguồn bị tiêm) và để chứng một nguồn bất kỳ so với tag.
3. Cấu hình Claude CÁCH LY: `CLAUDE_CONFIG_DIR=<tạm>`; `claude plugin marketplace add <nguồn>` rồi
   `claude plugin install <gói>@<chợ> --scope user` cho mọi gói. Không bao giờ chạm `~/.claude` thật.
4. `claude plugin list --json` (cùng cấu hình tạm) → `installPath` + `version` từng gói — đọc bản cài từ CHÍNH
   lời khai của CLI, không đoán đường bộ đệm.
5. Kho giả lập do code sinh: `git init -b main`, `_acceptance/config.yaml`, một hồ sơ hợp lệ trên `main`, nhánh
   `f` có một commit thường.
6. Tám mục, mỗi mục một dòng `ĐẠT|ĐỎ <mục>: <chi tiết>`:

| Mục | Kiểm gì | Đỏ khi |
|---|---|---|
| `so-phien-ban` | số của từng bản cài = số trong `plugin.json` tại ref | lệch số |
| `khop-tag` | mọi tệp của `git ls-tree -r <ref> -- <nguồn gói>` có trong bản cài với cùng băm blob git | THIẾU hoặc LỆCH tệp — in số + tối đa 5 tên `<gói>:<đường>`. Tệp/thư mục THỪA (có trong bản cài, không có trong cây — vd `.claude/`, `node_modules/`, `.DS_Store` mà chợ kiểu thư mục chép từ bản checkout) chỉ in `VÀNG khop-tag` kèm số, không đỏ; thư mục thừa đếm ở cấp thư mục, không đi sâu |
| `thu-muc-goi` | mọi thư mục cấp một của nguồn gói tại ref có mặt trong bản cài | in «THIẾU thư mục gói: <gói>/<thư mục>» |
| `tac-tu-cham` | mọi `feature-loop:<tên>` mà `workflows/acceptance-verify.js` ĐÃ CÀI gọi tên có `agents/<tên>.md` trong bản cài feature-loop, frontmatter `name: <tên>`, `tools:` không chứa Edit/Write/NotebookEdit | «tác tử chấm vắng trong bản cài: feature-loop:<tên>, …» · «<tệp>: name không khớp» · «<tệp>: tác tử chấm cầm bút: <công cụ>» |
| `hook-goi` | mọi tệp `${CLAUDE_PLUGIN_ROOT}/…` mà `hooks/hooks.json` đã cài trỏ tới đều có trong bản cài | in tên tệp vắng |
| `the-cong` | `node <AG cài>/scripts/gate-card.js --root <kho> --slug <hồ sơ>` thoát 0 và đầu ra mang tên hồ sơ | thoát ≠ 0 / thiếu tên |
| `luoi-truoc-gop` | `bash <AG cài>/scripts/pre-merge-check.sh <kho> --base main` HAI chiều: kho lành thoát 0; kho có hồ sơ phạm luật (evidence PASS mà `exit_code` ≠ 0) thoát ≠ 0 và in `VIOLATION` | «lưới không chặn hồ sơ phạm luật» (lưới câm) · «kho lành bị chặn» (lưới chặn tất) |
| `dieu-phoi` | `node <DP cài>/scripts/dieu-phoi.mjs chan-doan --json` trong kho thoát 0 và in JSON mảng có mục `co-dot` | thoát ≠ 0 / JSON hỏng |

7. Dòng cuối luôn bắt đầu `[kiem-ban-cai] TỔNG KẾT:` — `ĐẠT 8/8 — <ref> (<sha8>) cài đúng tag` (thoát 0)
   hoặc `ĐỎ k/8 — <ref> (<sha8>): <mục>, …` (thoát 1). Không chạy được (thiếu CLI `claude`, ref không có,
   cài thất bại) → thoát 2, dòng `TỔNG KẾT: KHÔNG CHẠY ĐƯỢC — <lý do>`; KHÔNG BAO GIỜ in «ĐẠT» trong ca ấy.
8. Dọn thư mục tạm khi xong (giữ lại với `--giu`, in đường).

### 2.2 Máy thật (`--may --ref <tag>`)

Đọc `claude plugin list --json` của cấu hình ĐANG DÙNG (chỉ đọc). Với mỗi bản ghi của chợ kit:

- số = số tại tag → so nội dung như `khop-tag` + `thu-muc-goi` (tệp thừa từ bản checkout — `.claude/`, `node_modules/` — đo 13/10 có thật trong bộ đệm máy này — chỉ đếm, không đỏ): `ĐẠT may: <id> <scope> <dự án|-> <số> khớp <ref>`
  hoặc `ĐỎ may: … khác tag: N tệp (…)` / `THIẾU thư mục gói …`;
- số khác → `VÀNG may: … khác số <số> (chưa nâng)` — không đổi mã thoát (cây phụ cũ là trạng thái chấp nhận
  được giữa hai mốc).

Đây là lệnh thay khối `node -e` một dòng ở bước 3 của mục A1 trong CHANGELOG 2.27, và bắt được đúng ca M5
(cùng số, nội dung main ≠ tag) mà khối cũ không bắt (khối cũ chỉ hỏi có `agents/` không).

## 3. Răng phát hành — chỉ ở lượt cắt mốc, vòng thường giá ≈ 0

Điều phối 13/10: chạy trọn bộ ca ở MỌI lượt chấm là CỘNG ~1–2′ máy vào mọi vòng kit, trong khi ý định là kiểm
SAU PHÁT HÀNH. Nghiệm giữ răng máy mà không trả giá đó:

- Hai khoá executor cho CÙNG tệp ca:
  - `kiem_ban_cai: "node tests/scripts/kiem-ban-cai.ca.mjs"` — luôn chạy trọn; eval của chính hồ sơ này dùng nó.
  - `kiem_ban_cai_moc: "node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc"` — VÀO `feature_loop.suite_keys`.
- `--chi-luot-moc`: tệp ca so số trong `.claude-plugin/plugin.json` ở HEAD với số ở gốc vòng
  (`git merge-base HEAD <nhánh chính>`; nhánh chính dò như `s4-args`). Bằng nhau → in đúng một dòng
  `BỎ QUA: KB — không phải lượt cắt mốc (số <x> = gốc vòng)` rồi thoát 0, không cài gì (dưới một giây). Khác
  nhau → chạy trọn bộ ca. Không dò được gốc vòng hay đọc được số → chạy trọn (đóng khi nghi ngờ, không mở).
- Hồ sơ cắt mốc là hồ sơ DUY NHẤT đổi số → lượt chấm mốc tự chạy trọn kiểm trên HEAD (= cây sẽ gắn tag), không ai
  phải nhớ thêm eval vào hồ sơ mốc. Bản cài của HEAD hỏng → suite đỏ → lượt chấm mốc đỏ → không cắt số. Làn ghim
  lại của chiến dịch phát hành cũng chạy suite_keys nên cũng chạy trọn.
- Ca KB-6 (tag phát hành mới nhất mà HEAD chứa) chạy trong bộ trọn — tức ở lượt mốc N+1 nó kiểm lại tag N.
- Sau khi cắt tag (tag = commit gộp của PR mốc): `node scripts/kiem-ban-cai.mjs --ref v<số>` — bước của người cắt
  mốc, ghi trong CHANGELOG/GUIDE. Cây của commit gộp = cây đỉnh PR mốc khi nhánh chính không chạy trước, nên
  lượt chấm mốc đã chứng nó; bước sau-tag là chứng lại trên đúng tên tag.
- Máy nhận: sau khi cài → `--may --ref v<số>`; dòng ĐỎ = chưa xong, gỡ + cài lại theo bốn bước.

**Bảng dự báo năm dòng (luật chiều rộng (c)):** thời gian làm-xong→quyết-được `=` · lượt gọi người/vòng `=` ·
vòng bị hạ tầng kit đốt lượt chấm `↓` (bản cài thiếu thư mục không còn đốt lượt chấm ở kho nhận) · token
máy/vòng `=` (bộ ca không gọi model) · phút máy/lượt chấm: vòng thường `=` (+<1 s cho dòng bỏ qua), lượt cắt
mốc `↑` ~1–2′. Điều kiện tin cậy: đường verdict không đổi thành phần (chỉ thêm một khoá suite).

## 4. Giới hạn đã khai

- **Tác tử chấm đo tĩnh.** Không mở phiên Claude thật (tốn lượt model, cấu hình cách ly không có đăng nhập).
  Lỗi nạp tác tử ở tầng Claude Code khi tệp CÓ MẶT sẽ lọt — đồng hồ reality vẫn là dòng `loai-tac-tu-vang`
  ở lượt chấm đầu sau khi cài. Ngưỡng mở ô: ≥1 lượt chấm sau cài có `loai-tac-tu-vang` trong khi kiểm XANH.
- **Hồ sơ của kho giả lập do HEAD viết** theo khuôn `schema_version: 1` tối thiểu, không do bên-viết của bản cài
  (kho khách khởi tạo hồ sơ bằng phiên Claude điền khuôn chữ — không có bộ sinh máy). Đổi khuôn ở HEAD mà tag cũ
  không đọc được thì KB-6 ĐỎ, không im. Ngưỡng mở ô: ≥1 lần KB-6 đỏ vì khuôn hồ sơ giả lập, không vì bản cài.
- **CI GitHub không chạy** (runner không có CLI `claude`); tệp ca mang đuôi `.ca.mjs` nên không lọt vào các
  mảnh `*.test.mjs`. Răng sống ở lượt chấm trên máy dev.
- **Sau-tag là lời dặn cho người cắt mốc**; lưới máy cho tag N chỉ tới ở lượt mốc N+1 (KB-6), quá trễ cho kho đã
  cài N. Ngưỡng: một mốc mà kiểm trên tag đỏ trong khi lượt chấm mốc xanh.
- **Nhận diện lượt mốc dựa vào số trong `plugin.json` gốc**: một vòng đổi engine mà không đổi số thì không chạy
  kiểm — đúng chủ đích (bản cài chỉ đổi khi có số mới). Ngưỡng: một mốc đổi số ở gói con mà quên gói gốc.
- **Hành vi bộ đệm của CLI** đo trên Claude Code 2.1.281; đổi bản CLI có thể đổi ca M5 tái hiện (KB-7 tự đỏ
  nếu hành vi đổi — ca ghim nó).

## 5. Không làm

- Đổi chợ plugin từ kiểu thư mục sang kiểu git — đổi mặc định của mọi máy; vòng này chỉ đo và chặn.
- Ba hạt giống 13/10 (KK-8 khi cây bẩn · ca Chrome chập chờn · thẻ đổi chữ khi dựng song song) — không trace
  thẳng về ý định cài-đúng-tag.

## 6. Cỡ và hạng

T2 (chạm `scripts/` mới + `_acceptance/config.yaml` + CHANGELOG/GUIDE; không chạm `lib/`, `hooks/`,
`pre-merge-check.sh`, `recheck-evidence`). 9 tiêu chí — trong khung 8–12.
