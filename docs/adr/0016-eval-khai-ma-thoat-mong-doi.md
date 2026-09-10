# ADR 0016 — Eval máy khai được mã thoát mong đợi; mã khác 0 chỉ chống lưng pin khi đủ hai vế

2026-09-09 · hồ sơ `eval-khai-ma-thoat-mong-doi`, ca thật kho `crm`
(`man-cai-dat-noi-tieng-viet`, eval E5, ký 04/09): trường `expected` ghi nguyên
văn rằng mã 2 là kết quả đã khai trước, nhưng khối bằng chứng buộc phải **bỏ
hẳn** trường `exit_code` và giấu con số vào một trường tự đặt `khong_do_duoc:`
— luật nhất-quán L1 (`lib/evidence-core.cjs`) quét trọn báo cáo tìm mã thoát
khác 0 và sẽ chặn chính báo cáo PASS đó nếu người viết trung thực gọi đúng tên
trường. Giới hạn CÓ khai, nhưng bằng hình dạng không bộ đọc nào hiểu — và hình
dạng ấy được chọn *vì* máy. **Quyết:** thêm trường `expected_exit` vào
`evals.yaml`, đọc qua một nguồn duy nhất (`lib/eval-yaml.cjs#expectedExits`);
một eval `test`/`script` khai `expected_exit: n` (n≠0) mà lệnh trả đúng `n`
không còn là một lượt trượt, nó là **đạt-có-giới-hạn** — khối bằng chứng vẫn
ghi `exit_code: n` THẬT, đúng tên trường, và báo cáo sinh một dòng ở mục Known
limits gọi tên eval. Nhưng một mã khác 0 chỉ chống lưng được một PIN
(`checkRepinEvals`, cũng `lib/evidence-core.cjs`) khi ĐỦ HAI VẾ: (a)
`evals.yaml` đã khai đúng mã đó cho đúng eval đó, VÀ (b) báo cáo ĐÃ KÝ (khối
`- eval: <id>` trong `## Evidence`) đã ghi đúng mã đó TRƯỚC khi làn ghim lại
chạy lần này. Thiếu vế (b) — evals.yaml khai n nhưng báo cáo đã ký ghi mã khác
— nghĩa là mã khác 0 hôm nay là một tiền đề VỪA MẤT, không phải giới hạn ai đã
ký nhận, và luật fail-closed đúng chỗ đó (thông điệp «tiền đề vừa mất»); thiếu
vế (a) — báo cáo ghi mã n nhưng chưa khai — cũng fail-closed («chưa khai»).
Không vế nào được suy ngầm từ vế kia.

Ranh giới với ô đã park **`baseline-127-tin-hieu-phan-biet`**
(`.out-of-scope/thuoc-cua-thuoc-mot-tang.md`, owner park 30/08, ngưỡng mở lại
đang đếm 0, KHÔNG đổi bởi ADR này) phải nói ra, để hồ sơ sau không đọc nhầm là
kit đã ủi qua quyết định đó. Ô park là MÁY tự SUY kỳ vọng từ mã thoát của một
làn đối chứng (baseline) — máy chấm chính khí cụ đo của chính nó, tầng
thước-của-thước; hai vòng S4 liên tiếp của `khuon-rang-dung-chung` (park cùng
ngày) đã cho bằng chứng thực nghiệm rằng cơ khí hoá thêm một tầng suy luận ở
đó chỉ đẩy lỗi xuống tầng dưới, không hội tụ. Việc trong ADR này đứng khác
tầng: kỳ vọng không do máy suy — nó do NGƯỜI khai tường minh ở Cổng 1 (viết
`expected_exit` khi soạn `evals.yaml`) và NGƯỜI ký nhận ở Cổng Bằng chứng (chữ
ký đặt trên một báo cáo đã mang đúng mã đó); tầng một, ý người đi thẳng vào
vật máy giữ, không có máy tự suy diễn chen giữa. Ranh giới được vật hoá chứ
không chỉ nói: `EXPECTED_EXIT_BANNED` trong `lib/eval-yaml.cjs` cấm khai đúng
hai mã 97 và 127 — hai mã hạ tầng mà `normInfra` đổi thành `cannotRun` TRƯỚC
mọi phép so kỳ vọng. Đúng hai mã đó là lãnh địa của ô park; khai chúng ở đây
là hứa một điều máy không giữ được, nên bị cấm ngay tại nguồn rút kỳ vọng.

**Lối bị loại**, mỗi lối một lý do: (1) làm ĐỎ khi khai mã khác 0 mà lượt
chạy trả 0, theo nếp `xfail(strict=True)` của pytest — bị loại vì mã 0 nghĩa
là tiền đề đã có và phép đo chạy thật rồi ĐẠT nhiều hơn, không ít hơn; đỏ ở
đây là phạt một cải thiện, nên kit chọn XANH kèm tiếng «giới hạn đã khai không
còn» thay vì đỏ im lặng. (2) Lấy mã của eval đầu tiên khi hai eval trỏ chung
một lệnh (`byCmd` gom theo lệnh, một lệnh một mã thoát) — bị loại vì đó là một
lựa chọn thầm lặng đúng lớp fail-open kit đang chặn ở mọi nơi khác; hai eval
chung lệnh khai hai mã khác nhau là một mâu thuẫn không có lời giải đúng, nên
đi BLOCKED gọi tên cả hai eval, cả hai mã, cho người sửa `evals.yaml`. (3) Suy
mã mong đợi từ văn xuôi của trường `expected` — bị loại vì đó là máy đoán ý
người, đúng lớp lỗi kit tồn tại để chặn; `expected_exit` là một trường SỐ
riêng, `expected` vẫn mãi là văn cho người, không phải nguồn máy đọc.

**Giới hạn đã khai của chính ADR này:** `ui-check` và `judgment` không khai
được `expected_exit` — hai loại đó không chạy lệnh nên không có mã thoát để
so, và làn ghim lại bằng máy (`repin-lane.mjs`) không chạy được chúng; cho
khai sẽ làm S4 và làn ghim lại bất đồng về ý nghĩa của cùng một trường. Ngưỡng
mở lại đang đếm: ngày làn ghim lại chạy được `ui-check`.
