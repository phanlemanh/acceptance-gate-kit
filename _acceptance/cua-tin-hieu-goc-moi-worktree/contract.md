---
schema_version: 1
feature: Ý gửi vào cửa tín hiệu từ bất kỳ worktree nào đều nằm ở thư mục chính của kho — mọi bộ đọc ở mọi worktree thấy cùng một tập, và dọn worktree không làm mất ý
slug: cua-tin-hieu-goc-moi-worktree
owner: phanlemanh@gmail.com
risk_tier: T2               # hàng RM3b khai T2: scripts/tin-hieu.mjs, scripts/gui-tin-hieu.mjs, scripts/start-scan.mjs, dieu-phoi/scripts/cua-tin-hieu.mjs — không chạm lib/**, hooks/**, lưới trước-merge
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-16-cua-tin-hieu-goc-moi-worktree-design.md
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: cua-tin-hieu-goc-moi-worktree

## Context

Vòng sửa của RM3 (`cua-tin-hieu-giua-chien-dich`). Trên main 66951212 (`repro/dau-ra-66951212.txt`): `/road-map:gui` từ
worktree ghi vào worktree, thợ qua đợt ghi vào thư mục chính, hai bộ đọc thấy hai tập rời nhau, dọn worktree ép làm mất
ý. Vòng này cho thư mục NGUỒN của cửa đi theo một bộ giải `gocKhoChinh` (`dieu-phoi/scripts/dot.mjs`) ở cả bên ghi lẫn
bên đọc. Chủ kho ký Cổng Đáng 16/10 (sổ dòng `gate0`).

Ca đo ở `tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs` (ca `GW-<n>` = AC-n). Kho thử, worktree (`git worktree
add`) và đợt do code sinh trong lượt. «Bộ máy gốc» = `git archive <gốc so> scripts lib skills commands road-map dieu-phoi
feature-loop`, gốc so đọc từ `_acceptance/cua-tin-hieu-goc-moi-worktree/goc-so`. Mỗi ca đỏ chạy trên BẢN SAO của vật với
nhát tiêm khớp ĐÚNG một lần, SAU khi bản lành xanh trên cùng fixture, và ghim thông điệp. Ca in đúng một dòng
`PASS: GW-…` hoặc `FAIL: GW-… — <vì sao>`.

## Criteria

Fixture chung: kho thử khai cửa `tin_hieu.nguon: [tin-hieu/kho]` mà thư mục nguồn KHÔNG được git theo dõi (worktree mới
không có thư mục ấy — như kho thật, vì tệp ý chưa theo dõi), cộng hai worktree A, B.

- AC-1: When chạy đúng dòng lệnh khối `RM-GUI-LENH` của `road-map/commands/gui.md` lần lượt từ worktree A, worktree B rồi
  thư mục chính, Then mỗi lần thoát 0 và có đúng ba tệp `nguoi-<tên>-1.json`, `-2.json`, `-3.json` ở
  `<thư mục chính>/tin-hieu/kho/` (băm tệp trước giữ nguyên sau mỗi lần gửi), 0 tệp `.json` trong thư mục nguồn của A và
  B, dòng in nêu đường tệp tương đối thư mục chính, và tệp mang `noi_dung.gui_tu` = `"worktree"` cho hai lần đầu,
  `"thu-muc-chinh"` cho lần cuối.
  Chiều đỏ: bản sao bên ghi giải nguồn theo gốc phiên → FAIL ghim «ý người nằm trong worktree»; bản sao chỉ tính số thứ
  tự theo thư mục nguồn của gốc phiên → FAIL ghim «ý bị ghi đè».
- AC-2: Given ba ý của AC-1 và một việc phụ của thợ qua đợt (gốc kho đợt = thư mục chính), When chạy ở thư mục chính, ở A
  và ở B: `scripts/tin-hieu.mjs --chua-gom` (tập id), `--duong` (tập id), `--rang` (mã thoát và mọi dòng nhắc nguồn),
  `--cau` (mã thoát), và `scripts/start-scan.mjs` (TRỌN các dòng thẻ mở đầu «Cửa tín hiệu:» hoặc «! cửa tín hiệu:») trên
  kho khai thêm lộ trình, và `scripts/product-map.mjs` (trang lộ trình chứa đủ bốn id), Then ở mỗi lệnh đầu ra ba gốc
  BẰNG nhau, tập id đúng bốn.
  Chiều đỏ: bản sao bộ đọc giải nguồn theo gốc phiên → FAIL ghim «bộ đọc ở worktree thấy tập khác thư mục chính»; bản sao
  để phép lọc «thư mục nguồn chưa có» của thẻ theo gốc phiên → FAIL ghim «thẻ worktree báo nguồn chưa có».
- AC-3: Given ý gửi từ worktree A, When `git worktree remove --force` worktree A, Then `--chua-gom` ở thư mục chính vẫn
  liệt id ấy và tệp còn nguyên băm.
  Chiều đỏ: bản sao bên ghi giải theo gốc phiên → FAIL ghim «ý mất khi dọn worktree».
- AC-4: Given kho thử KHÔNG có worktree, chạy ở thư mục chính (như CI), và given gốc là một thư mục CON của kho thử có
  `_acceptance/config.yaml` riêng, When chạy `gui-tin-hieu.mjs`, `--chua-gom`, `--rang`, `--duong` và `start-scan.mjs`
  bằng bộ máy hiện tại và bộ máy gốc trên cùng fixture, Then stdout, stderr, mã thoát và tệp sinh ra giống TỪNG BYTE (bỏ
  khoá `luc` và `noi_dung.gui_tu` của tệp ý), sau đối chứng dương (bộ máy gốc thoát 0 và đầu ra khác rỗng; thiếu →
  «đối chứng gốc không chạy: <lệnh>»); một nhịp `phat-lich` của đợt cũng giống từng byte.
  Chiều đỏ: bản sao luôn lấy thư mục CHA của gốc làm thư mục chính → FAIL ghim «thư mục chính đổi đầu ra: <lệnh>».
- AC-5: Given một bản sao mà `gocKhoChinh` của `dieu-phoi/scripts/dot.mjs` trả một thư mục khác (nhát tiêm), When người gửi
  từ worktree rồi đọc bằng `--chua-gom`, Then bên ghi và bên đọc CÙNG đi theo thư mục ấy (tệp nằm ở đó, bộ đọc thấy nó) —
  chứng cả hai dùng chung một bộ giải.
  Chiều đỏ: bản sao bên đọc tự giải bằng `git rev-parse --show-toplevel` thay cho `gocKhoChinh` → FAIL ghim «bên ghi và
  bên đọc dùng hai bộ giải».
- AC-6: Given gốc không phải kho git (thư mục thường có `_acceptance/config.yaml` khai cửa) — một ở ngoài mọi kho, một
  LỒNG trong kho thử — When `gui-tin-hieu.mjs` và `--chua-gom`, Then chạy như cũ theo gốc ấy (tệp ở
  `<gốc>/tin-hieu/kho/`, bộ đọc thấy, không sập) và thư mục chính của kho bên ngoài có 0 tệp ý mới. Given worktree có
  bản gom commit trong nhánh của nó phủ một id, When `--chua-gom` ở worktree đó, Then id ấy KHÔNG còn trong danh sách chờ
  (bản gom đọc theo gốc phiên).
  Chiều đỏ: bản sao bỏ chốt «gốc là đỉnh worktree» → FAIL ghim «ý rơi ra kho bên ngoài»; bản sao đọc bản gom theo thư
  mục chính → FAIL ghim «bản gom của nhánh bị bỏ qua».

## Coverage

Quét gọn (design doc §3). Chân sản phẩm: `[SUY-TỪ-REPO: _acceptance/cua-tin-hieu-goc-moi-worktree/repro/dau-ra-66951212.txt]`,
`[SUY-TỪ-REPO: dieu-phoi/scripts/dot.mjs]`. Chân ngành: `[NGÀNH: git-worktree(1)]`.
- Trục A — nơi chạy lệnh: thư mục chính · worktree · không phải git  [thước CE: git-worktree(1)] → AC-1, AC-4, AC-6
- Trục B — bên: người ghi · thợ ghi qua đợt · bộ đọc (gom, thẻ, đường đi)  [thước CE: bảng §1 design] → AC-1, AC-2, AC-5
- Trục C — trạng thái worktree: sống · đã dọn ép  [thước CE: repro bước 7–8] → AC-3
- Lớp xuyên: bản gom theo nhánh (AC-6) · không đổi byte ở thư mục chính và CI (AC-4)

## Đường đo

- Số đọc (ngưỡng ô cơ hội, chính xác hoá — sổ dòng S1 «đường đo bao hàm»): trên kho cài bản chứa vòng này, trong cửa sổ
  14 ngày, N = số tệp ý mang `noi_dung.gui_tu: "worktree"` (gửi từ worktree — chỉ nhánh này từng hỏng). SỐNG khi N ≥ 1,
  `git worktree list --porcelain` cho 0 tệp `<worktree>/<nguồn>/*.json` ở mọi worktree khác thư mục chính, và mỗi id
  `nguoi-*` ở thư mục chính hoặc có trong `--chua-gom` chạy ở một worktree, hoặc đã nằm trong bản gom của nhánh worktree
  ấy (phép BAO HÀM, không phải phép bằng — ý đã gom ở nhánh là có chỗ). CHẾT khi một tệp ý nằm trong worktree, hay một id
  không ở đâu trong hai chỗ trên. N = 0 → «chưa đọc được». Bảo đảm bởi AC-1 (khoá `gui_tu`), AC-2, AC-6 (bản gom nhánh).

## Out of scope

- Chuyển ý đã nằm sẵn trong worktree từ trước bản này — chưa kho nào cài RM3, không có dữ liệu thật.
- Commit tệp ý từ worktree — tệp ý sống ở thư mục chính, chưa theo dõi; commit là việc ở thư mục chính.
- Đặt tệp ý vào `.git` hay chỗ ngoài cây làm việc.

## Notes

- Bản gom và cấu hình vẫn đọc theo gốc phiên; chỉ thư mục nguồn đi theo thư mục chính.
- Trường `tep` của tín hiệu là đường tương đối THƯ MỤC NGUỒN ở thư mục chính; skill gom đọc `noi_dung` từ JSON của
  `--chua-gom`, không mở tệp theo `tep`.
- Gốc phiên chỉ đi theo thư mục chính khi nó là ĐỈNH của chính worktree/kho của nó (`--show-toplevel` = gốc); thư mục
  con hay thư mục thường lồng trong kho giữ hành vi cũ.
