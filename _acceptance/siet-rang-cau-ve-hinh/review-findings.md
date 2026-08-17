## Trong hợp đồng

- **Assert "chuỗi có mặt" — ghim nhãn thiếu của ma trận thoả bởi dòng P197-M in sẵn (hình dạng 3, kéo theo 4: ghim thông điệp giả)**
  file: `_acceptance/siet-rang-cau-ve-hinh/rang.sh:57`
  severity: high
  AC: AC-5
  detail: AC-5 (evals E5) hứa «assert 'ma tran chua toan phan' ĐỎ ghim nhãn thiếu». Nhưng `has "$OUTN" "thieu nhan buoc [5] Đính"` ở dòng 57 chỉ kiểm chuỗi này có mặt ĐÂU ĐÓ trong `$OUTN` — mà P197 in `P197-M: GATE 1: thieu nhan buoc [5] Đính` (tests/plugins/run-tests.sh:10018-10024) TRƯỚC khi chạy đột biến, trên MỌI lượt chạy, kể cả bản sao `LABELS[:4]`. Nên chuỗi `thieu nhan buoc [5] Đính` luôn có mặt trong `$OUTN` bất kể thông điệp của chính assert ma trận có nêu đúng nhãn thiếu hay không. Đã mô phỏng: chạy khối P197 với `LABELS[:4]`, xoá tên nhãn khỏi thông điệp assert → dòng 57 vẫn xanh. Phép đo dòng 57 vì thế không đo QUAN HỆ «assert ma trận → nêu đúng nhãn thiếu» mà chỉ đo chuỗi có mặt ở đâu đó trong stdout; chỉ dòng 56 (`ma tran chua toan phan`) còn sống. Ghim đúng phải nhắm vào thông điệp CỦA CHÍNH assert dòng 56, ví dụ `thong diep chua tung do: ['GATE 1: thieu nhan buoc [5] Đính']`.
  rationale: AC-5 đòi assert "ma tran chua toan phan" phải ĐỎ ghim đúng nhãn thiếu; finding cho thấy dòng 57 chỉ bắt chuỗi có mặt đâu đó trong stdout (do P197-M in sẵn mọi lượt) chứ không đo quan hệ assert-ma-trận→nêu-đúng-nhãn mà AC-5 hứa.

- **Thước không gắn vào vật: đột biến m3b "sửa bản CUỐI = S2" không có guard rfind≠find nên có thể suy biến thành m3 (hình dạng 4: không đối chứng mục tiêu đột biến)**
  file: `tests/plugins/run-tests.sh:1850`
  severity: low
  AC: AC-2
  detail: m3b dùng `_last(live(rel), CLAUSE, ...)` (rfind trên CLAUSE raw `.strip()`), còn `check()` đếm bản chép qua hfl_clause đã `_norm` khoảng trắng. Nếu bản S2 sau này bị wrap/thụt dòng khác bản GATE 1 (vẫn 2/2 theo `_norm` → đối chứng dương xanh), rfind trả về cùng vị trí với find → m3b == m3, assert `(1/2 ban chep)` vẫn ĐỎ đúng thông điệp và vòng for vẫn in `P90-COPIES: m3b do` — trong khi bản S2 (Known limit 1 mà evals E2 tuyên đóng) chưa từng bị chạm. Hiện tại raw count = 2, find=25701, rfind=28830 nên chưa sai; nhưng không có assert nào (ví dụ `live(lp2).rfind(CLAUSE) != live(lp2).find(CLAUSE)` hoặc `m3b(lp2) != m3(lp2)`) giữ cho đột biến thật sự đánh vào bản thứ hai.
  rationale: AC-2 định nghĩa m3b là đột biến nhắm đúng bản CUỐI (S2, lỗ KL1) khác với m3 (bản ĐẦU); finding chỉ ra không có assert nào giữ cho m3b thật sự đánh vào bản thứ hai, nên lời hứa "m3b nhắm S2" của AC-2 chưa được đảm bảo chắc chắn.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

## Chưa adversarial-verify (refuter chết)

(không có — không có finding nào cờ unverified=true round này)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).