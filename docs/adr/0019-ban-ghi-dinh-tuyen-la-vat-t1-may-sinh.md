# ADR 0019 — Bản ghi mốc định tuyến là vật T1 máy sinh; làn trước chữ ký bỏ qua khi cây bằng pin

2026-09-15 · owner gọi tên vòng meta duy nhất của cửa sổ 2.13 sau khi tự thấy đồng hồ.
**Số đo:** chữ ký `khoi-tim-loi-tra-phi-theo-vat` (14/09) mất **54 phút · 87 lượt model ·
≈ 42 M token** từ lúc owner gõ «Ký» tới READY TO MERGE, trong đó ≈ 6 M là việc thật;
**7/7** chữ ký từ 08/09 đều đi qua **ba** lượt `repin-lane.mjs` (≈ 13 phút/làn:
`tests/scripts` 362 s + `tests/plugins` 402 s). Nguyên nhân **tất định**: ca LM20
(`tests/scripts/gate-card-lmcms.test.mjs`) chỉ ghim hồ sơ `settled` — có `human_signoff`
— nên CHÍNH hành động ký đưa hồ sơ vào diện quét và buộc
`tests/scripts/fixtures/routing-baseline.txt` thêm một dòng; dòng ấy trước nay thêm TAY
sau chữ ký, mà tệp đó là **code**, nên `stale_files()` của `pre-merge-check.sh` gọi bằng
chứng hoá cũ và bắt ghim lại — đúng vòng lặp «commit chữ ký tự làm bằng chứng hoá cũ,
pre-merge chặn không lối ra» mà **ADR 0007** đã giải một lần cho `PRODUCT-MAP.md`; bản
ghi định tuyến ra đời sau (03/09) nên chưa được xếp cùng lớp. **Quyết, hai vế:**
(1) `tests/scripts/fixtures/routing-baseline.txt` vào `risk_tiers.t1_skip_globs`, và dòng
của nó do `tests/scripts/routing-baseline.mjs --slug <s> --write` sinh ở **bước 7a-bis** (ngay sau 7a, vì nó đọc `human_signoff` làm tiền điều kiện) của
`/signoff`, cùng lượt với bản đồ, kèm ca LM20 chạy ngay sau làm đối chứng dương — lệnh
sinh **xuất** `routingLine` và `settled` mà chính LM20 **nhập**, nên writer và reader có
một nguồn thay vì hai khuôn trôi khỏi nhau; (2) `repin-lane.mjs` nhận cờ tường minh
`--skip-unchanged`: cây **bằng pin** — 0 tệp git-theo-dõi ngoài `_acceptance/` (tính theo
PHÂN ĐOẠN đường dẫn, không qua `globToRe` vì `*` của nó không xuyên `/`) và ngoài
`t1_skip_globs` đổi so `verified_commit` — thì làn in một dòng rồi bỏ qua, exit 0, không
chạy suite nào. Vị từ ấy **là** ngữ nghĩa `stale_files`, tái dùng chứ không dựng phép đo
mới. **Điều kiện được vào danh sách T1 vẫn y nguyên ADR 0007** — máy sinh toàn phần +
một cổng độc lập canh drift — và bản ghi định tuyến thoả: LM20 so trọn xưởng với nó, sửa
tay là đỏ. Miễn trừ này KHÔNG mở rộng thêm tên nào khác. **Khó đảo:** đội sẽ quen chữ ký
ra READY trong vài phút; dựng lại nghi thức ba làn sau khi gỡ là đắt, và một hồ sơ đã ký
dưới luật mới không thể «ký lại» dưới luật cũ. **Gây bất ngờ:** người đọc lịch sử sẽ thấy
một tệp trong `tests/` nằm trong danh sách T1 — trước nay T1 chỉ có tài liệu và view máy
sinh ở gốc kho; và thấy làn trước chữ ký in «bỏ qua» thay vì một bảng kết quả suite.
**Trade-off thật:** đổi lấy ≈ 50–70 phút và ≈ 85 % token mỗi chữ ký, kit nhận hai giới
hạn — (a) ca **cây đã đổi sau verify** vẫn tốn làn trọn ≈ 13 phút và vẫn vượt trần Bash
600 s (ngoài phạm vi vòng này), và (b) vị từ T1 phía bash (`case`, `*` xuyên `/`) và phía
JS (`globToRe`, `*` không xuyên `/`) chỉ đồng nghĩa trên danh sách T1 hiện tại; lệch chỉ
có thể xuất hiện ở glob dạng `dir/*`, **ngưỡng đang đếm: ≥1 lần làn bỏ qua sai vì glob
như vậy giữa hai bản phát hành** thì phải mở vòng đưa hai vị từ về một nguồn. Vế sinh ra
bước 7b — hồ sơ `duong-lui-phai-song`, hai mốc liên tiếp trả 5 CI đỏ hậu-chữ-ký vì commit
trước soi sau — **không mất răng**: cây đổi thì vị từ khác rỗng và làn chạy trọn như cũ.
**ĐIỀU KIỆN THU HỒI:** ngày LM20 thôi canh tệp này, hoặc dòng của nó được viết tay trở
lại, thì dòng glob phải GỠ trong cùng PR — điều kiện ghi kèm ngay tại `config.yaml`.
