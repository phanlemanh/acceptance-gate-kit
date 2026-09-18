---
slug: release-2-16-0
at: 2026-09-18T00:20:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
claims_input: ok
---

# Phản biện context sạch — release-2-16-0

Một tác tử tươi, context sạch, đọc năm đầu vào: hợp đồng · evals · sổ quyết định · hợp đồng
mốc TRƯỚC (đứng thay design doc — mốc phát hành không có design doc, khuôn của mốc trước LÀ
design) · bài học từ vòng trước. Không đọc code của kho; riêng `rang-ghim-lai.mjs` được đọc vì
nó là VẬT của AC-5, không phải code repo.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract (AC-5) + evals (E5) + rang-ghim-lai.mjs | Nhánh «khong-co» là HẰNG ĐÚNG: khi dòng sha là chữ ấy, mã bỏ qua chính phép so, nên tập so luôn rỗng và mọi vế sau chạy trên danh sách rỗng. Không ca nào phân biệt «chiến dịch đỏ thật» với «chưa ai chạy chiến dịch». Đối chứng dương cũng không gắn vào vật của vòng: nó xanh nhờ dòng ghim lại lịch sử của cửa sổ trước | Làn ghim được ba hồ sơ ở sha Y rồi chết giữa chừng; người dựng hồ sơ đọc «làn đỏ» và khai chữ «khong-co» với danh sách rỗng. Răng PASS, E5 xanh, Cổng Bằng chứng đọc «chiến dịch đã đo kết quả THẬT» trong khi sổ chạy có ba dòng ghim mà hợp đồng không kể. Ca «chưa ai chạy lệnh nào» cho ĐÚNG cùng một dòng PASS | Bỏ hẳn nhánh tắt; lượt chiến dịch LUÔN khai sha, run_id và mã thoát; ràng hai chiều giữa mã thoát và việc có pin mang run_id ấy | fixed: nhánh «khong-co» gỡ hẳn. Khối khai nay ba dòng đầu — sha, run_id, exit. Răng thêm vế (c) mã 6: exit 0 mà danh sách rỗng là đỏ, exit khác 0 mà vẫn có hồ sơ mang run_id ấy cũng đỏ. `run_id` do làn tự đúc và nằm trong sổ chạy, nên nó là vật nói «đã chạy» thay cho lời khai. AC-5 và E5 viết lại theo đúng vật |
| P1 | contract (Context, Known limits, risk_tier) + evals | Lời khai «ba việc vá, không việc nào chạm engine» và ngưỡng «cửa sổ này là 0» KHÔNG có thước nào. AC-4 chỉ đếm thư mục hồ sơ; không tiêu chí nào đọc tập TỆP đổi trong cửa sổ. Chính mục 3 lớp bốn của Notes thú nhận bảng Context liệt kê từ nhật ký git đọc tay. Cùng lớp mà mốc 2.15.0 đóng hai lần, nay tái sinh ở lời khai thứ ba [release-2-13-0#F1] | Một commit trong cửa sổ chạm cây thư viện hoặc cây script mà không mở hồ sơ nào. AC-4 vẫn xanh vì tập hồ sơ vẫn đúng một cái; AC-3 im vì tệp ấy không nằm trong khối chép CI; AC-6 im nếu suite vẫn qua. Mốc ship với risk_tier sai và ngưỡng «0» sai | Một chân mới đọc tập tệp đổi từ chữ ký vòng meta tới cây làm việc, đòi không tệp engine nào ngoài tệp mốc khai; đối chứng dương là cửa sổ trước chữ ký PHẢI có tệp engine | fixed: AC-8 mới + chân `viec-va` của `rang-cua-so.mjs` + eval E8 + khối khai VIEC-VA-SAU-CHU-KY. Mã 6 khi có tệp engine đổi sau chữ ký; mã 7 khi đối chứng dương hỏng. Coverage thêm trục lời-khai-về-cửa-sổ với ba lời khai, ba thước |
| P1 | contract (Notes mục 1 dòng 1) + evals (E7) | Số dẫn xuất tự mâu thuẫn: dòng 1 ghi «1 h 08 nằm giữa lượt trả lại 21:37 và chữ ký», trong khi chữ ký ở 23:05 — khoảng ấy là 1 h 28. E7 lại tự khoá «không tính lại con số nào ngoài bốn phép», và phép thứ ba chỉ đối chiếu giờ tác giả của commit được gọi tên, nên số dẫn xuất rơi ngoài danh sách đóng | Hội đồng chạy đủ bốn phép, thấy 21:37 và 23:05 khớp giờ tác giả, trả PASS. Mốc ship một chữ số sai trong đúng bảng mà luật (c) đếm, và cửa sổ sau đọc số sai ấy làm nền so sánh | Sửa số; và ghim mốc giờ thứ hai vào câu để số dẫn xuất tự kiểm được | fixed: 1 h 08 → 1 h 28, và câu nay ghi cả hai mốc giờ (21:37 và 23:05) nên phép thứ ba của E7 phủ được nó — không mở phép đo mới |
| P1 | contract (AC-3, Notes mục 2) + evals (E3) | Sàn của phép đo là «danh sách rút ra không dưới năm tệp», trong khi khối chép hôm nay có chín; răng rút danh sách TẠI HEAD rồi so chính danh sách ấy, không so với danh sách tại neo, và tệp mang khối không nằm trong tập được so | Một commit trong cửa sổ gỡ ba mục khỏi khối chép. Răng rút sáu tệp, sáu tệp ấy quả thật không đổi, sáu lớn hơn sàn năm nên E3 xanh. Notes ship câu «repo tiêu thụ không phải chép lại gì» trong khi lớp cưỡng chế vendored vừa tắt lặng ba tệp — đúng ca mà đợt rollout 2.14 đã trả giá | Rút khối ở CẢ HAI đầu cửa sổ, đòi hai danh sách BẰNG nhau, đỏ thì in mục thêm và mục bớt; cộng tệp mang khối vào tập so không-đổi | fixed: chân vendored rút khối tại neo bằng cùng một hàm, so hai danh sách, mã 3 in mục thêm và mục bớt; `commands/acceptance-init.md` vào tập so. AC-3 và E3 viết lại |
| P2 | evals (E5) so với rang-ghim-lai.mjs | Trường expected nói «khối khai RỖNG là lời khai hợp lệ», nhưng mã dừng mã 2 khi khối không có dòng nào. Hai văn bản của cùng một tiêu chí nói ngược nhau về đúng ca mà vòng này nhiều khả năng rơi vào | Làn đỏ; người thực thi làm theo chữ của expected và để khối trống. Răng FAIL mã 2, lượt chấm mất một vòng — hoặc tệ hơn, người chấm sửa hợp đồng giữa lượt cho răng xanh, đúng nhát mà trần sửa thước sinh ra để chặn | Sửa expected nói đúng vật, và ghim thông điệp của răng vào chiều đỏ | fixed: E5 nay nói rõ khối phải có ba dòng đầu, khối trống hẳn là mã 2, và danh sách rỗng chỉ hợp lệ khi exit khác 0 |

## Ba điểm cross-check đã chạy và sạch

- Mọi AC đều có eval đo: AC-1 → E1 và E1b · AC-2 → E2 · AC-3 → E3 · AC-4 → E4 · AC-5 → E5 ·
  AC-8 → E8 · AC-6 → E6a đến E6e · AC-7 → E7.
- Mọi trục Coverage đều trỏ về AC có thật. Giá trị thứ ba của trục chiến dịch — «chưa ghim vì
  không nằm trong phạm vi lượt» — không phân biệt được với giá trị thứ hai; đã gấp vào thước
  của P0 (vế mã thoát) và khai ở Known limits.
- Số học bảng năm dòng khớp: dòng 4 gộp 30,02 triệu và 54,80 triệu cộng đúng; ba tỉ lệ của
  từng lượt và tỉ lệ gộp đều bằng 100 %; 18,49 chia 25,95 bằng 71,2 %; dòng 5 gộp 83,1 đúng.
  Chỉ mỗi khoảng «1 h 08» lệch, đã sửa.
