# Bước đối chứng của lượt chấm chạy được — thiết kế (TC6 · `doi-chung-chay-duoc`)

Ngày: 2026-10-29 · hạng T2 · vùng: `feature-loop/workflows/acceptance-verify.js`, `feature-loop/agents/cham-lenh.md`
(+ ca kiểm dưới `tests/workflows/`) · ô: `_acceptance/doi-chung-chay-duoc/opportunity.md` (Cổng Đáng `build`, 29/10).

## Vấn đề

Lượt chấm S4 có một làn đối chứng: chạy lại các lệnh máy có eval trên commit gốc để biết eval nào xanh ở cả hai
phía (không phân biệt được code mới với code cũ). Từ 23/10 lời giao của làn này bảo tác tử «dùng công cụ ghi tệp
(Write)» chép kịch bản ra tệp rồi gọi `bash '<tệp>'`. Nhưng từ 09/10 (hồ sơ `tac-tu-cham-chi-cham-khong`) làn này
chạy bằng loại tác tử `feature-loop:cham-lenh`, chỉ có Bash, Read, Grep, Glob — cố ý không cầm bút. Hai thay đổi
đúng khi đứng riêng, va nhau khi gộp: ca kiểm 23/10 (BW1e) chỉ soi chữ «Write» trong đề bài, không chạy trên loại
tác tử thật.

Hệ quả đo được: mọi lượt chấm từ 23/10 ở mọi kho có làn đối chứng «chưa chạy dòng nào», lý do «No such tool
available: Write» — một kho tiêu thụ (hồ sơ `aer-ac2-so-cap-co-dinh`, báo lại trên 2.35.0) và chính kit (FL5,
`_acceptance/design-floor-moc-s3-s4/run-log.jsonl` dòng `baseline-khong-do`, 10 lệnh). Mọi eval máy xanh từ đó chưa
từng được thấy đỏ trên mã cũ; thẻ Cổng Bằng chứng nói ra điều ấy (cờ đối chứng) nhưng không ai sửa được ở cổng.

## Số đo trước khi chọn (29/10, phiên này)

Tác tử `feature-loop:cham-lenh` thật (sonnet), kịch bản thật do bộ chấm sinh cho hai eval:

| Lời gọi | Kết quả |
|---|---|
| công cụ Write | «No such tool available: Write» — tái hiện lỗi |
| Bash: `mkdir -p … && cat > '<tệp>' <<'X' … X` (kịch bản trơn trong heredoc) | ghi được |
| Bash: `printf '%s' '<base64>' \| base64 -d > '<tệp>' && cksum` | phiên worktree: ghi được, cksum khớp từng byte · tác tử `isolation: worktree`: **bị bộ phân loại an toàn dừng** |
| Bash: `bash '<tệp>'` (cả hai tệp) | đủ dấu `__BL_BAT_DAU` · `__BL 1 xong 0` · `__BL 2 bo-qua …` · `__BL_XONG` |
| Bash: khối kịch bản trơn (không qua tệp) | chạy — ở cả phiên worktree lẫn tác tử `isolation: worktree`; lời từ chối 23/10 «too complex to verify…» không tái hiện được hôm nay |

## Lựa chọn

**Kit sinh sẵn LỆNH GHI tệp kịch bản; tác tử chỉ gọi Bash hai lần; tác tử không cầm bút.**

Bước 1 của lời giao đổi từ «dùng Write ghi tệp» thành «MỘT lần gọi Bash với đúng lệnh giữa hai dòng dấu». Lệnh do
kit sinh, gồm: `mkdir -p` thư mục lượt · heredoc có nháy ghi nguyên văn kịch bản · một dòng so dấu kiểm `cksum` của
tệp vừa ghi với số kit tính sẵn (CRC POSIX, viết bằng JS thuần — sandbox workflow không có thư viện). Khớp → in
`__BL_GHI dung <số>`; lệch → đổi tên tệp thành `<tệp>.sai` (không xoá — luật «không rm» của khối lệnh) và in
`__BL_GHI sai <cksum thật>`, nên bước 2 không chạy một kịch bản chép hỏng. Lệnh ghi tạo cả `.acceptance-runs/` và tự bỏ
nó khỏi git trước khi ghi, nên ca hỏng cũng không làm bẩn cây. Bước 2 giữ nguyên: `bash '<tệp>'`. Tác tử trả `dauRa` =
đầu ra của CẢ HAI lời gọi.

Bộ đọc dấu (cùng nguồn với bên viết) **mặc định không tin** (gap-probe F1): thứ tự nhánh là công cụ giết → `__BL_GHI sai`
(«tác tử chép kịch bản sai») → không có dấu bắt đầu («chưa chạy dòng nào», giữ nguyên chữ công cụ trả — nên lời gọi ghi
bị từ chối mang chữ từ chối vào lý do và vào dòng `baseline-khong-do`) → kịch bản ĐÃ chạy mà không có dòng
`__BL_GHI dung` mang đúng số kit tính («lệnh ghi không xác nhận dấu kiểm» — tác tử bỏ dòng so, viết lại thành `echo`,
hay đầu ra không mang phần của lời gọi ghi) → các nhãn hạ tầng cũ. Chỉ khi qua hết mới có dòng `kind: baseline`.

Thư mục lượt ở `<gốc kho>/.acceptance-runs/<slug>/s4-baseline/<nhãn lượt>/` như bản 23/10 — vùng tạo phẩm của lượt chấm
(`.acceptance-runs/` tự bỏ khỏi git, ca cây-đổi-trong-lượt không canh nó). Đặt ngoài cây (`$TMPDIR`) thì bộ canh cô lập
worktree từng từ chối ghi ngoài worktree; nên «không ghi vào cây kho» được ghim là: mọi tệp mới, kể cả tệp git bỏ qua,
nằm dưới `.acceptance-runs/` (gap-probe F3).

Lối đã cân và loại:

- *Chạy khối kịch bản trơn, không qua tệp* — 29/10 chạy được ở cả phiên worktree lẫn tác tử `isolation: worktree`, đơn
  giản nhất (không tệp, không dấu kiểm, không đổi dấu kết). Không chọn vì luật kho «hành vi cũ có ai đang dựa không?»:
  lời gọi qua tệp sinh ra 23/10 chính vì một kho tiêu thụ ở chế độ cô lập bị từ chối khối trơn (đo và ghi ở
  `docs/plans/2026-10-23-hat-giong-viec-nang-qua-khoa-may-kit.md`); hôm nay không tái hiện được không chứng rằng chế độ
  ấy đã hết ở máy của kho đó. Giữ lời gọi 23/10 là lối không làm hỏng lại kho ấy; giá là dấu kiểm + đổi dấu kết.

- *Trao bút cho tác tử* (thêm Write vào `cham-lenh`, hoặc một loại tác tử mới có Write cho riêng làn này) — chết vì
  ràng buộc đã khai: hồ sơ `tac-tu-cham-chi-cham-khong` rút bút khỏi vai chấm vì lời dặn «không sửa code» trong đề
  bài đã thua (ca 07/10); câu giao của hàng TC6 đòi «tác tử chấm vẫn không cầm bút ghi vào cây kho».
- *`s4-args.mjs` ghi tệp kịch bản trước lượt chấm* — đúng nghĩa nhất của «kit sinh sẵn tệp», nhưng kịch bản phụ
  thuộc danh sách lệnh sau carry, nhãn lượt và các khối lệnh dùng chung sống trong workflow; đưa bên viết ra ngoài
  là hai bên viết phải giữ khớp (lớp lỗi «bên viết và bên đọc trôi khỏi nhau»), và chạm tệp ngoài vùng.
- *Base64 thay heredoc* (lời gọi ghi không chứa chữ `git`) — chết: trong tác tử `isolation: worktree` lời gọi
  `printf … | base64 -d > tệp` bị bộ phân loại an toàn dừng giữa chừng (đo 29/10). Ghi chú ở mã để không ai đổi sang.

## Lưới cho từng chỗ hỏng

| Chỗ hỏng | Lưới | Ca kiểm |
|---|---|---|
| Đề bài lại dặn một công cụ mà loại tác tử không có (lớp lỗi của sự cố này, ở BẤT KỲ vai nào) | đối chiếu đề bài của cả chín vai với bộ công cụ đọc từ `feature-loop/agents/*.md` | DC7 (chiều đỏ: bộ chấm `d3cfca5c`; đột biến «Bash» ở vai tổng hợp) |
| Tác tử chép lệnh ghi lệch một byte / bỏ một dòng | so `cksum`, lệch → `.sai` + nhãn hạ tầng có tên | DC3 |
| Lệnh eval nhiều dòng có dòng trùng dấu kết heredoc | kit đổi dấu tới khi không trùng | DC8 (đột biến gỡ vòng: đuôi kịch bản chạy NGAY trong lời gọi ghi — dấu kiểm không cứu được ca này, vòng đổi dấu là răng) |
| Kịch bản không chạy được trên zsh (công cụ chạy lệnh trong zsh) | lệnh ghi và lời gọi chạy trong bash VÀ zsh | DC2 |

Bộ kiểm làn đối chứng có sẵn (`baseline-tran-bo-qua-don`, `baseline-worktree-co-lap`) rút kịch bản qua MỘT bộ rút
chung mới trong `tests/workflows/harness.mjs` (thân heredoc của khối `AGK-BASELINE-GHI`) — không tệp ca nào giữ bản chép
khuôn. Ca BW1e (ghim chữ «Write») đổi thành ghim lời gọi Bash ghi đúng tệp; hợp đồng các hồ sơ đã ký không sửa.

## Bản ghi tác tử thật (AC-9)

Phiên của vòng sinh đề bài thật cho 8 lệnh eval của hồ sơ (lệnh ghi ~10 KB) và giao cho hai tác tử `cham-lenh` thật
(sonnet): đề bài mới → tác tử chép lệnh ghi đúng từng byte (`__BL_GHI dung 730097493 10313` khớp số kit tính), kịch bản
chạy đủ 8 dòng kết quả + `__BL_XONG`; đề bài của `d3cfca5c` → tác tử không gọi công cụ nào (biết mình không có Write) và
trả rỗng. Đầu ra chép nguyên văn vào `_acceptance/doi-chung-chay-duoc/evidence/tac-tu-that.json` kèm blob bộ chấm đã sinh
đề bài; ca DC9 phát lại qua đúng blob ấy, nên vòng sau sửa bộ chấm không làm ca cũ đi (mà cũng không chứng lại bản mới).

## Giới hạn đã khai

- Bộ canh lệnh của Claude Code là của công cụ, không của kit: nếu nó siết thêm (đọc cả thân heredoc), bước 1 bị từ
  chối và làn rơi về «chưa chạy dòng nào» như hôm nay — thẻ Cổng 2 vẫn nói ra (cờ đối chứng có sẵn). Ngưỡng mở
  lại: ≥1 lượt chấm sau bản này có dòng `baseline-khong-do` mang chữ từ chối của bộ canh.
- DC1–DC8 dùng bộ mô phỏng tất định (đọc bộ công cụ từ `cham-lenh.md`, chạy đúng các khối lệnh của đề bài trong shell
  thật); hành vi tác tử thật nằm ở DC9 — một bản ghi, 8 lệnh, ở gốc cả 8 ra `bo-qua` vì tệp ca là tệp mới (lệnh chạy
  thật trên gốc đo ở DC2). Lượt chấm S4 của vòng này cũng chạy làn đối chứng bằng tác tử thật — nhưng vì cùng lý do, các
  eval của hồ sơ sẽ ra `bo-qua`/`n-a` ở cột đối chứng; đó là hành vi đúng, không phải dấu hỏng.
- Bộ canh lệnh của Claude Code hay móc chặn lệnh nặng của gói điều phối đọc cả thân heredoc (chữ git, hay lệnh eval gọi
  thẳng lệnh chấm/ghim lại/đường nền của kit) thì bước ghi bị từ chối — làn rơi về «chưa chạy dòng nào» mang chữ từ chối;
  ngưỡng mở lại bên dưới đếm được nhờ đó.
