---
schema_version: 1
feature: Chủ kho ghi nghiên cứu và thảo luận của một phiên vào tri thức bằng một lệnh, và nguồn thô nhạy cảm của kho công khai không bao giờ vào kho công khai
slug: ghi-tri-thuc
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: implemented
design_doc: docs/superpowers/specs/2026-10-24-ghi-tri-thuc-design.md
approved_by: Manh Phan
approved_at: 2026-10-24
---

## Context

Hàng TT2 của đợt `tri-thuc-2410`, mã B1, B2, B3. Ô cơ hội đã qua Cổng Đáng 24/10 (`decision: build`). Đứng trên TT1
(`kho-tri-thuc-va-lint`, gộp #406). Gốc: crm-onehub/_acceptance/thanh-ben-khu-dung-chung/.

Thuật ngữ:
- **gốc tri thức**, **kho thử**, **lint** — như hồ sơ TT1 (`_acceptance/kho-tri-thuc-va-lint/contract.md`).
- **lệnh ghi** = `node scripts/tri-thuc-ghi.mjs --root <kho> …` (cú pháp ở design doc).
- **ảnh cây** = danh sách đường + băm `git hash-object` của mọi tệp dưới một thư mục (trừ `.git`), cộng
  `git status --porcelain` và `git rev-parse HEAD` của kho ấy — chụp trước và sau một lần chạy.

## Criteria

- AC-1: Given kho thử khai `noi` (không `cong_khai`) chưa có `TRI-THUC.md`, When chạy lệnh ghi loại `phien` với hai tệp
  (một chữ, một ảnh nhị phân) và `--trang chu-de/vi-du.md --than <tệp>`, Then thoát 0; `raw/<luc>-<ten>/` có hai tệp giống
  từng byte bản gốc và `nguon.md` mà frontmatter có đủ khoá của khối `TRI-THUC-RAW` (`loai: phien`, `goc`, `luc`, `ai`) và
  mỗi tệp một dòng khớp biểu thức của khối `TRI-THUC-RAW-DONG` với băm thật; `TRI-THUC.md` ghi từ khối `TRI-THUC-LUAT`;
  và lint TT1 thật trên kho ấy thoát 0 với «tri thức: 1 trang, 1 raw, 0 lỗi» — round-trip bên ghi → bên đọc.
- AC-2: Given ma trận mười hàng viết sẵn — mỗi loại trong năm loại của khối `TRI-THUC-NGUON` một hàng hợp lệ và một hàng
  phạm đúng luật hình dạng của loại ấy (`phien` gốc rỗng · `artifact` gốc không mở đầu `https://` · `issue` gốc không là
  URL hay `<chủ>/<kho>#<số>` · `tep-may` tệp nằm trong kho thử · `tep-kho` tệp không được git theo dõi) — cộng một hàng
  loại lạ, When chạy lệnh ghi từng hàng, Then năm hàng hợp lệ thoát 0 với `loai` đúng trong `nguon.md`; năm hàng phạm
  thoát 2 với câu lỗi gọi tên loại; hàng loại lạ thoát 2 và liệt đúng năm loại rút từ khối; mọi hàng thoát 2 có ảnh cây
  không đổi.
- AC-3: Given một lần ghi đã xong, When ghi lại CÙNG `--ten`, `--luc` với nội dung khác một byte, Then thoát 2 với
  «raw bất biến: raw/<luc>-<ten> đã có nội dung khác — nguồn mới là thư mục mới» và ảnh cây không đổi; When ghi lại với
  nội dung y hệt, Then thoát 0, in «dùng lại raw», không commit mới (HEAD không đổi). Mutant gỡ phép so nội dung thì hàng
  khác-nội-dung không còn thoát 2. Hai hàng nối: raw dựng bằng chính lệnh ghi với `--khong-commit` rồi chạy lại y hệt
  không cờ → thoát 0, HEAD tiến, `git show --name-only` chứa raw và trang; dùng lại raw kèm `--than` khác → trang vào
  commit mới. Mutant bỏ phép kiểm «raw đã được git theo dõi» thì hàng nối thứ nhất đỏ (HEAD không tiến).
- AC-4: Given kho thử của AC-1, When ghi nguồn thứ hai vào CÙNG trang với `--ma A2,A3` (trang đã có `ma: [A1, A2]`) không
  kèm `--than`, Then frontmatter giữ đúng thứ tự khoá của khối `TRI-THUC-TRANG`, `ma: [A1, A2, A3]`, `nguon` thêm các tệp
  raw mới sau các tệp cũ không trùng, `cap_nhat` = `--luc`, thân giữ nguyên từng byte; tạo trang mới không kèm `--than` →
  thoát 2; `--trang` có đoạn đầu ngoài khối `TRI-THUC-LOAI` → thoát 2 liệt ba loại; lint TT1 thoát 0 sau mỗi lần ghi
  thành công.
- AC-5: Given kho thử khai `kho` (kho riêng là kho git có remote trần) với kho tiêu thụ sạch, When chạy lệnh ghi, Then
  kho riêng có đúng MỘT commit mới mà `git show --name-only` bằng đúng tập {các tệp raw + `nguon.md`, trang, `TRI-THUC.md`
  nếu vừa tạo}; kho tiêu thụ có ảnh cây không đổi; lệnh không đẩy (remote trần không đổi); với `--khong-commit` thì tệp
  có mà HEAD kho riêng không đổi; khi thư mục kho riêng không phải kho git → thoát 2 «kho riêng không phải kho git»; kho
  riêng có hook pre-commit thoát 1 → lệnh thoát 2 kèm nguyên văn lỗi git và ảnh cây CẢ hai kho không đổi (đã hoàn lại).
  Mọi hàng thoát khác 0 của AC-4, AC-5, AC-8 chụp ảnh cây cả kho tiêu thụ lẫn kho riêng, đối chứng xanh trước.
- AC-6: Given một lần ghi thành công ở cả hai dạng gốc (trong kho, kho riêng), When đọc các dòng `raw:` và `trang:` lệnh in,
  Then mỗi đường trỏ khớp biểu thức khối `TRI-THUC-CON-TRO`, mang tiền tố `<kho>:` đúng khi gốc là kho riêng, và
  `scripts/tri-thuc.mjs --con-tro <đường trỏ>` thoát 0 với từng dòng; sau một commit khác ở gốc không chạm các tệp ấy vẫn
  thoát 0; dòng `commit:` mang đúng sha HEAD mới.
- AC-7: Given kho thử khai `noi` + `cong_khai: true` và không khai `kho`, When chạy lệnh ghi với một hàng hợp lệ của MỖI
  loại trong năm loại, Then cả năm thoát 4, in câu hỏi chứa «kho công khai chưa có kho riêng» và hai lối «khai
  tri_thuc.kho» · «bỏ cong_khai», và ảnh cây kho thử không đổi ở cả năm; đối chứng: cùng năm hàng trên kho thử có khai
  `kho` thì thoát 0 và raw nằm trong kho riêng. Mutant gỡ phép chặn thì cả năm hàng thôi thoát 4 và lint TT1 trên kết quả
  đỏ `raw-trong-kho-cong-khai`.
- AC-8: Given một `gh` giả đặt đầu `PATH` (ghi lại đối số nó nhận) và nơi giữ raw có remote GitHub, When chạy lệnh ghi
  theo ba ma trận viết sẵn, Then: (a) độ riêng tư — `PUBLIC` · `PRIVATE` · `gh` thoát 1 → thoát 4 «nơi giữ raw đang công
  khai trên GitHub: <chủ>/<kho>» · thoát 0 · thoát 4 «không kiểm được nơi giữ raw có riêng tư không» (theo Hỏi-1), hàng
  thoát 4 có ảnh cây hai kho không đổi; (b) năm dạng remote — https có `.git` · https không `.git` · `git@github.com:` ·
  `ssh://git@github.com/` · vắng `kho.remote` dùng `origin` dạng SSH — với `gh` trả `PUBLIC` thì cả năm thoát 4 và đối số
  `gh` chứa đúng `<chủ>/<kho>`; remote không phải GitHub → thoát 0 kèm «cảnh báo: remote không phải GitHub»; (c) kho tiêu
  thụ chỉ khai `noi`, KHÔNG khai `cong_khai`, `origin` GitHub và `gh` trả `PUBLIC` → thoát 4, ảnh cây không đổi; `PRIVATE` →
  thoát 0. Mutant gỡ nhánh `PUBLIC` thì hàng (a)1 thôi thoát 4; mutant bộ tách chỉ nhận https thì các hàng SSH của (b) thôi
  thoát 4.
- AC-9: Given kho thử lành, When chạy lệnh ghi theo ma trận bảy hàng viết sẵn — `--ten` có `/` · `--ten` có `..` · `--trang`
  có `..` · `--trang` không đuôi `.md` · `--tep` không có trên đĩa · thiếu `--tep` · kho thử không khai `tri_thuc` — và hàng
  thứ tám kho khai `kho` mà thư mục chưa có, Then bảy hàng đầu thoát 2 với câu lỗi riêng gọi tên đối số; hàng tám thoát 3
  với «không đọc được ở đây: <tên kho>» và dòng `git clone <remote> <đường tuyệt đối>`; cả tám có ảnh cây không đổi.
- AC-10: Given gói `tri-thuc` thêm `tri-thuc/commands/ghi.md` và `tri-thuc/README.md` liệt hai lệnh, When đọc lệnh và chạy
  TRỌN suite `tests/plugins`, Then `ghi.md` không khoá model-invocation, khối `TT-GHI-LENH` của nó rút được và dòng lệnh
  trong đó (thay `$AG` bằng gốc kit) đúng là lệnh các ca AC-1 chạy, bảng mã thoát trong `ghi.md` liệt đúng 0 · 2 · 3 · 4;
  suite plugins thoát 0 (P200 vẫn xanh với gói `tri-thuc`).

## Coverage

Bỏ quét hình thái — entry `descope` «bỏ coverage-scan» trong `decisions.jsonl`: không gian do bản phạm vi định sẵn (B1
ghi, B2 năm loại nguồn, B3 riêng tư); mỗi phần có ma trận viết sẵn và chiều đỏ.

- B1 ghi raw, trang, commit, đường trỏ: AC-1, AC-3, AC-4, AC-5, AC-6. B2 năm loại: AC-2. B3 riêng tư: AC-7, AC-8. An toàn
  đối số và «không đọc được ở đây»: AC-9. Gói: AC-10.

## Đường đo

- Ngưỡng của ô (14 ngày sau khi một kho nhận bản có TT2: 0 tệp raw trong thư mục tri thức của kho công khai) · số từ: lint
  TT1 (`/tri-thuc:kiem`) trên kho tiêu thụ, đếm dòng `raw-trong-kho-cong-khai` — chỉ thấy kho đã khai `cong_khai` — cộng
  `gh repo view --json visibility` cho mọi kho tiêu thụ có thư mục tri thức chứa `raw/` (kho quên khai) · bảo đảm bởi AC-7
  và AC-8 (bên ghi không sinh raw ở nơi công khai, khai hay không khai). Vế «mọi bản phạm vi mới trỏ trang tri thức» thuộc
  TT3.

## Out of scope

- Tạo kho riêng (`gh repo create`, khởi tạo `TRI-THUC.md` ngoài lần ghi đầu) — cam kết ra ngoài kho, việc của người.
- Đẩy kho riêng hay kho tiêu thụ — lệnh chỉ commit cục bộ; lint TT1 nhắc `kho-rieng-chua-day`.
- Quét thân trang tóm xem có lộ lời nguyên văn hay dữ liệu nội bộ không — giới hạn đã khai, ngưỡng ở findings §5.
- Nguồn bản phạm vi và dòng «Nguồn:» của ô — TT3. Dòng «đã tra» — TT4. Vòng đơn lẻ tra tri thức — TT5.
- `/tri-thuc:xem`, `/tri-thuc:hoi`, lint nghĩa — chờ điều kiện (TT-C2, TT-C4).

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes
