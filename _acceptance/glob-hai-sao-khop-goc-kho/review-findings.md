## Trong hợp đồng

- **Hình dạng 3 — HS10 assert «không có chuỗi stale» trong khi lời hứa E10/AC-10 là QUAN HỆ «bộ sinh biến thể chỉ tách tại `**/`, không tại `**`»: phép đo không thể đỏ cho lớp nó tuyên canh**
  file: `tests/scripts/run-tests.sh:2066`
  severity: medium
  AC: AC-10
  Chi tiết: Khối HS10 (dòng 2066–2074) và E10 trong `_acceptance/glob-hai-sao-khop-goc-kho/evals.yaml` khai đây là ca đóng gap-probe P1: «Chứng minh bộ sinh biến thể chỉ tách tại `**/`, không tại `**`». Nhưng assert thực tế chỉ là `check HS10 0` + `nothas HS10-nostale "evidence is stale"` cho fixture `docs/**` + `CHANGELOG.md`, và đối chứng đỏ `docs2/a.md`. Hai điểm thấy rõ trong `scripts/pre-merge-check.sh` khiến assert này không đo được lời hứa: (a) `match_globs` thử glob GỐC trước (`case "$1" in $g) return 0`) rồi mới cộng biến thể — bộ khớp là OR thuần cộng, nên `docs/**` khớp `docs/a.md` bất kể `glob_variants` sinh gì; (b) guard `case "$g" in *'**/'*)` khiến `docs/**` không bao giờ đi qua `glob_variants` — fixture HS10 không hề chạm vật nó tuyên đo. Đã tiêm thử đúng mutant gap-probe P1 mô tả (đổi guard + split sang `**`, bản sao suy từ cây đang kiểm): HS10, HS10-nostale, HS10-red, HS10-red-msg đều PASS 4/4; chỉ HS01/HS05 đỏ. Tức lớp «tách nhầm tại `**`» đang được HS01/HS05 bắt như tác dụng phụ, còn dòng bằng chứng E10 «PASS: HS10» là xanh không phân biệt được với «chưa bao giờ gọi bộ sinh». Đúng nếp «thước phải gắn vào vật được giao»: muốn đo quan hệ đó phải gọi thẳng `glob_variants` với `docs/**` và ghim tập biến thể sinh ra (round-trip từ writer), hoặc dựng mutant tách-tại-`**` như HS08 và đòi HS10 đỏ.
  Căn cứ: AC-10 tự khai cơ chế "đi qua bộ sinh biến thể nguyên vẹn" và finding chứng minh bằng đột biến có chủ đích rằng bài đo hiện tại không phân biệt được đúng/sai của đúng cơ chế đó, tức bằng chứng chưa chứng minh được điều AC-10 tuyên bố.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Evidence report ở HEAD neo vào commit TRƯỚC bản sửa HS09 — bằng chứng chưa phủ cây đang trình ký, và cổng đang che nó**
  Người dùng thấy gì: Hồ sơ đang chờ ký ghi kết quả đạt dựa trên một phiên bản cũ hơn phiên bản mới nhất sắp được duyệt, nên người ký có thể tin nhầm rằng phần vừa sửa đã được kiểm tra lại trong khi thực ra chưa.
  file: `_acceptance/glob-hai-sao-khop-goc-kho/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **Bằng chứng ghim 765a647c nhưng phép đo HS09 đổi ở c8fc1a32 — stale bị che vì luật «Gate 2 pending» continue trước luật staleness**
  Người dùng thấy gì: Dấu đạt hiển thị trên hồ sơ dựa trên một lần kiểm tra đã cũ; phần vừa sửa chưa được đo lại, nên dấu xanh đó có thể không phản ánh đúng trạng thái hiện tại tại thời điểm ai đó bấm ký.
  file: `_acceptance/glob-hai-sao-khop-goc-kho/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/3 lỗi rơi vào file không bộ đo nào phủ (_acceptance/glob-hai-sao-khop-goc-kho/evidence-report.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.