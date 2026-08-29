# Điều tra 29/08 — đề bài «4 luật hội tụ»: hiện tượng thật, địa chỉ lệch

Đề bài nhận từ ngoài phiên: «thêm 4 luật hội tụ cho kit» kèm số liệu một phiên
media-library 29/08. Trước khi thi công, chạy điều tra ba mũi: (1) hiện tượng
có diện rộng không, (2) nguyên nhân gốc, (3) đáng làm gì. Kết quả dưới đây;
quyết định mở ô ở cuối.

## 1. Hiện tượng: thật, diện rộng, nặng hơn mô tả

Ba bộ dữ liệu độc lập, đều đo từ vật (run-log.jsonl, decisions.jsonl,
evidence-report qua lịch sử git):

- **Repo kit**: 244 vòng chấm trên 50 hồ sơ; ~28–30 vòng bị đốt vì hạ tầng
  chấm (12% tổng thể, nhưng 50–75% ở 6 hồ sơ tệ nhất — `repo-khai-plugin` 3/4,
  `judgment-runs` 5/8, `s4-scope-triage` 3/6). `triage_failed` ≈18 lượt trên
  12 hồ sơ. Một phát hiện (CONTEXT.md thiếu mục từ) bị tái phát hiện **6 vòng
  liên tiếp** ở `design-pass-nac-khong-dong-bo`.
- **media-library 16–21/08** (9 hồ sơ, 42 vòng): ~46% lượt chấm lại KHÔNG do
  khiếm khuyết sản phẩm — thủ phạm chính là bằng-chứng-hết-hạn và phạm vi
  Input của panel.
- **media-library 27–29/08** (trên origin/main — bản clone máy này đứng 21/08,
  phải fetch mới thấy; lớp «đã mới nhất là nói dối» suýt giết cả cuộc điều
  tra): `ban-dieu-khien-curator` chạy 13 vòng, **5 vòng cuối không chứa một
  khiếm khuyết sản phẩm nào** — 3 vòng vì bằng chứng hết hạn (vòng 10 hết hạn
  *ngay khi vừa ghi xong* vì PR khác merge xen), 2 vòng vì agent chấm đứng
  nhầm thư mục (thư mục cùng tên trong worktree phiên điều phối làm mồi nhử;
  một lượt `cd` thẳng sang worktree của hồ sơ khác). `duyet-tai-cho`: lượt
  baseline ghi đè symlink workspace làm `pnpm build` đỏ 7 lỗi trên mã không
  đổi — lượt hỏng đó không để lại dòng nào trong run-log.

## 2. Số liệu đề bài: 1 đúng, 1 nửa, 4 sai — cùng một kiểu sai

Con số duy nhất đúng tuyệt đối (243 dòng run-log) là con số đếm được máy móc.
Bốn con số sai đều là **suy diễn cấu trúc từ dấu vết chữ**: gọi BLOCKED là
REJECT; nhân đôi `triage_failed` (thật: 1); gán «hội đồng 7 mốc finding» cho
một hồ sơ không có eval judgment nào (chuỗi thật: 15→16→16→8→14); đọc «4 lần
nhắc trong văn bản» thành «4 lần tái phát hiện qua 4 vòng» ở hồ sơ chỉ chạy
2 vòng. Bài học: **tin hiện tượng, tự đếm lại mọi con số trước khi thiết kế
luật theo chúng** — và bản tóm tắt nào cũng phải khai số-nào-đếm-máy,
số-nào-suy-từ-trí-nhớ.

## 3. Nguyên nhân cốt lõi

Kit bắt sản phẩm phải có hợp đồng + bằng chứng máy, nhưng **tầng chấm của
chính nó chạy trên văn xuôi và trạng thái ngầm** — nên lỗi ở tầng chấm không
có chiều đỏ, không hội tụ, và bị tính nhầm thành vòng của sản phẩm. Các giả
định ngầm không ai kiểm:

- «agent đứng đúng chỗ» — cwd được *kể* trong prompt, không được đặt. Trong
  cùng `feature-loop/workflows/acceptance-verify.js`, nhánh baseline ghim
  `git -C` thì chạy đúng (:507); nhánh verifier chỉ kể (:452, :460) thì dính
  mồi nhử.
- «args chép đúng» — hợp đồng args là 14 gạch đầu dòng văn bản cho main loop
  soạn tay; script chỉ kiểm 2 trường là mảng.
- «lệnh sẽ chạy được» — 3 tuần bộ phân loại chặn, ≥28M token cho những vòng
  không sinh một dòng bằng chứng; lớp này chỉ chết khi bài học vào VẬT
  (song ánh allowlist ↔ suite_keys + đi tuần tự, PR #110, 26/08) — sau mốc đó
  repo kit 0 vòng bị chặn. Đây là đối chứng dương cho chính chẩn đoán.
- «cây đứng yên giữa chấm và ký» — không gì đóng băng nhánh; chữ ký người bị
  xoá vì một khối comment.
- «hội đồng nhớ» — trí nhớ phát hiện sống trong phiên, không trong vật nào.

Hệ quả đo được: khiếm khuyết sản phẩm hội tụ sau một vòng sửa (5→0,
design-pass-nac); khiếm khuyết của bộ đo và hạ tầng chấm thì không. Nguy hiểm
nhất: hạ tầng hỏng **giả dạng** tín hiệu sản phẩm theo cả hai chiều — REJECT
giả (release-2-2-0 r1, trần công cụ 120s) và PASS giả (`triage_failed` →
danh sách từ chối rỗng, `acceptance-verify.js:750`).

## 4. Đối chiếu 4 luật đề xuất với kit 2.4.0

| Luật đề bài | Thực trạng | Phán quyết |
|---|---|---|
| 4 — sinh-args + ghim cwd | Mới; lỗ có thật đang cháy | **Mở ô** (`cham-dung-cay-dung-cho-dung`) |
| 3a — carry-forward mặc định | ĐÃ CÓ và đã mặc định (`carry-plan.mjs` + P1/P2/P3, SKILL.md:181-185) | Không làm lại; ô mới chỉ thêm phép kiểm «bước gọi đã chạy» |
| 3b — một-vòng-mở-mỗi-repo | Mới; răng cưỡng chế va nhiều vòng song song hợp lệ | Hạt giống riêng: điều khoản + nhắc ở /start, chưa răng |
| 2 — sổ phát hiện hợp nhất persist | Mới; va quyết định đã ghi «claim-index là VIEW, không persist» (docs/superpowers/plans/2026-07-29) | Hạt giống riêng; phải supersede tử tế; biến thể rẻ: VIEW từ lịch sử git của review-findings.md, S4 đối chiếu trước phản biện |
| 1 — điều kiện đóng là hợp đồng | Phần lớn ĐÃ CÓ (sáu điều kiện xanh-sạch, scope-triage 3 ngăn); vế «xếp ngăn xong là đóng» là ĐỔI luật veto-default | Bác vế đổi luật; giữ mảnh nhỏ: ngăn «không-sửa» vào schema proposal |

## 5. Nấc thang nếu bản vá không hội tụ (khai TRƯỚC)

Lịch sử kit cho thấy lớp lỗi đổi da khi chỉ vá hình dạng (s4-scope-triage 4
lần; thước nhãn-đè-khối 4 vòng). Nên ngưỡng leo thang khai trước trong ô:

1. **Nấc 1 (ô này)** — verdict phải tự chứng minh chỗ đứng: dấu vết
   máy-kiểm-được (realpath cwd, SHA cây, vân tay môi trường) do bên đọc đối
   chiếu; thiếu/lệch → nhãn thứ ba «CHƯA-CHẤM-ĐƯỢC», không bao giờ tính thành
   đỏ/xanh sản phẩm, không đốt vòng.
2. **Nấc 2** — chấm thế-giới-bất-biến: mỗi lượt chấm dựng worktree + dịch vụ
   cô lập từ đúng một SHA (kỹ thuật đã có ở nhánh baseline).
3. **Nấc 3** — bằng chứng gắn (eval, cây) thay vì gắn vòng: chấm lại co về
   đúng phần diff làm mất hiệu lực (carry P1/P2/P3 là bản thủ công của cái này).
4. **Phần dư không chữa bằng hạ tầng** — thước-máy-viết tự soi mình có trần;
   khiếm khuyết-của-bộ-đo đi làn riêng, neo bằng thực tại ngoài (fixture do
   code sinh, round-trip, mắt người xác suất, phiên nghiệm thu).

Điều kiện leo nấc phải là PHÉP ĐO, không phải cảm giác — hiện run-log không
ghi verdict/lý do (3.615 dòng chỉ 5 khoá verdict; agent chết không để lại dòng
nào), nên ô này bắt buộc kèm: mỗi vòng một dòng máy-đọc-được (vòng · verdict ·
lớp nguyên nhân · dấu vết chỗ đứng) và đối chiếu số-kết-quả-mong-đợi để «vắng
mặt» cũng thành tín hiệu.

## 6. Ý owner (29/08): «biết giới hạn cũng là một loại năng lực»

Nối vào hạt giống «giới-hạn-đã-khai ≠ bất định» (22/08). Điều khoản thiết kế
cho ô: mọi vật ô này sinh ra phải mang **lời khai phạm vi của chính nó** (chấm
trên cây nào, tin được tới đâu, hết hiệu lực khi nào); «không biết» là giá trị
hợp lệ, phân biệt được với «không có».

## 7. Quyết định

Owner gật 29/08: mở ô `cham-dung-cay-dung-cho-dung` (stage discovery, chờ
Cổng Đáng). Các luật 2 và 3b xếp hạt giống; không nhận trọn gói «4 luật +
nâng version» của đề bài. Không sửa gì trong repo media-library.
