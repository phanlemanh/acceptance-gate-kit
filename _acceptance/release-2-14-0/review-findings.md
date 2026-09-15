## Trong hợp đồng

- **PRODUCT-MAP.md trỏ tới tệp CHƯA commit — `product-map --check` ĐỎ trên checkout sạch**
  file: `PRODUCT-MAP.md:162`
  severity: high
  AC: AC-3
  Commit 97952e60 (trong vùng diff) thêm dòng «- Bốn kho cắt token cho Claude Code — BÁC 15/09/2026 (`.out-of-scope/bon-kho-cat-token-rtk-headroom-ponytail-caveman.md`)» vào mục «Ngoài phạm vi đã ký», nhưng tệp `.out-of-scope/bon-kho-cat-token-rtk-headroom-ponytail-caveman.md` KHÔNG hề được commit — `git ls-files .out-of-scope/` không có nó, `git check-ignore` trả rc=1 (không phải bị ignore), `git status` vẫn liệt nó là `??`.

  ĐÃ CHỨNG THỰC BẰNG BẢN SAO SẠCH (không đoán): `git archive HEAD | tar -x -C <tmp>` rồi `node scripts/product-map.mjs --root . --check` → **exit 1**, thông điệp «PRODUCT-MAP.md lệch với hồ sơ xưởng». Vẽ lại trong bản sạch rồi diff cho ra ĐÚNG một dòng lệch — chính dòng 162 ở trên.

  Vì sao đây là vi phạm invariant chứ không phải lỗi vặt:
  1. E3e (AC-3, `config:executors.script.product_map`) được ghi PASS trong `evidence-report.md`. Màu xanh đó chỉ có vì một tệp KHÔNG-THEO-DÕI nằm trong cây của tác giả. Đúng hình dạng 4 mà CLAUDE.md gọi tên ở bài học 4 round s4-scope-triage: «phép-đo hardcode/neo vào checkout của tác giả nên so với cây của tác giả thay vì cây đang kiểm» (họ hàng P150). Vật được đo (PRODUCT-MAP.md ở HEAD) đỏ; thước chạy trên cây tác giả nên xanh.
  2. `PRODUCT-MAP.md` nằm trong `t1_skip_globs` với lý do khai thẳng trong config: an toàn được «vì `product-map.mjs --check` trong CI canh bản-đồ == hồ-sơ độc lập». Tiền đề đó đang SAI ở HEAD: CI (checkout sạch) sẽ đỏ, còn phiên tác giả thì không bao giờ thấy.
  3. PRODUCT-MAP là view máy sinh cho người đọc; ở HEAD nó có một liên kết chết tới tệp không tồn tại trong kho.

  Hai đường sửa (KHÔNG tự fix theo yêu cầu): commit `.out-of-scope/bon-kho-cat-token-rtk-headroom-ponytail-caveman.md` (và cân nhắc `docs/findings/2026-09-15-bon-kho-cat-token-doi-chieu-hoa-don-that.md` cũng đang `??`), hoặc vẽ lại PRODUCT-MAP.md ở cây không có tệp ấy. Đường một đúng hơn — hồ sơ BÁC là sử liệu, CLAUDE.md đòi nó sống ở `.out-of-scope/`.
  source: conventions

- **PRODUCT-MAP.md trỏ vào file .out-of-scope CHƯA COMMIT — product-map --check (E3e + CI gate) sẽ ĐỎ trên cây sạch, xanh chỉ nhờ cây làm việc của tác giả**
  file: `PRODUCT-MAP.md:162`
  severity: high
  AC: AC-3
  Commit 97952e60 (trong dải review) thêm dòng `- Bốn kho cắt token cho Claude Code — BÁC 15/09/2026 (`.out-of-scope/bon-kho-cat-token-rtk-headroom-ponytail-caveman.md`)` vào mục «Ngoài phạm vi đã ký». File đó KHÔNG có trong git index: `git ls-files --error-unmatch .out-of-scope/bon-kho-cat-token-rtk-headroom-ponytail-caveman.md` → «did not match any file(s) known to git» (git status vẫn là `??`).

  `scripts/product-map.mjs` sinh mục đó bằng cách QUÉT THƯ MỤC `.out-of-scope/` trên đĩa (scripts/product-map.mjs:270, :301), rồi `--check` so bản sinh với PRODUCT-MAP.md. Vì thế phép đo đọc cây làm việc của tác giả chứ không đọc cây đang được chấm — đúng lớp P150 mà CLAUDE.md đã ghi.

  Đã dựng chiều đỏ, không suy diễn:
  - trên cây làm việc hiện tại: `node scripts/product-map.mjs --root . --check` → «PRODUCT-MAP.md khớp hồ sơ xưởng.», rc=0
  - trên bản xuất SẠCH của chính HEAD (`git archive HEAD | tar -x -C <tmp>`, tức không có file untracked): rc=1, «PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node scripts/product-map.mjs --root .»

  Hai hệ quả:
  (a) `.github/workflows/gate.yml:37` chạy đúng lệnh này trên cây đã đẩy → CI sẽ đỏ ngay khi commit này lên remote, vì lý do hạ tầng-dữ-liệu chứ không vì vật.
  (b) `_acceptance/release-2-14-0/evidence-report.md` ghim E3e PASS (run_id minted-release-2-14-0-E3e-r1, exit_code 0, output «PRODUCT-MAP.md khớp hồ sơ xưởng.»). Màu xanh đó chỉ tái lập được trên máy có file untracked — bằng chứng không tái lập được ở chiến dịch ghim lại kế.

  Sửa: `git add .out-of-scope/bon-kho-cat-token-rtk-headroom-ponytail-caveman.md` (và `docs/findings/2026-09-15-bon-kho-cat-token-doi-chieu-hoa-don-that.md` mà file đó link tới, cũng đang untracked), hoặc gỡ dòng 162 khỏi PRODUCT-MAP.md.
  source: bugs

- **Hình dạng 5 ở tầng eval — AC-4 hứa «MỌI số máy-đo khớp từng chữ số với nguồn, CẢ HAI vòng» nhưng E4 chỉ liệt ba phép đối chiếu điểm**
  file: `_acceptance/release-2-14-0/evals.yaml:96`
  severity: medium
  AC: AC-4
  `contract.md:97` (AC-4 Then) phát biểu lớp: «MỌI số máy-đo khớp từng chữ số với nguồn — của CẢ HAI vòng». Question của E4 (dòng 96–111) lại mở đầu bằng «KHÔNG tính lại con số nào» rồi liệt đúng ba ca RIÊNG: (a) hai dòng máy đo của `do-tin-tram-phan-loai` vs input 2; (b) số lượt chấm + lượt hạ-tầng-đốt của `chu-ky-khong-tu-lam-hoa-cu` vs «## Iterations» ở input 3; (c) hai số token của vòng thứ hai (ô lượt PASS · tổng vòng) vs input 4. Không có vế nào phủ phần còn lại của cùng lớp.

  Cụ thể những số máy-đo của vòng `chu-ky-khong-tu-lam-hoa-cu` KHÔNG có ai đối chiếu, dù nguồn đã nằm sẵn trong `inputs`: dòng 5 «22,8 ở lượt PASS; TB 26,1 (157 phút / 6)» (rút từ các dòng `wall:` của usage-report — kiểm tay: 1369s = 22,8 phút và tổng sáu dòng wall = 9390s ≈ 157 phút, tức số ĐÚNG, nhưng eval không đòi ai kiểm) và dòng 4b «tìm-lỗi 19,9 %» (rút từ bảng vai trò của cùng tệp). Với những ô này hội đồng chỉ chấm được «có ghi NGUỒN không» — tức đo LỜI GHI NGUỒN thay vì đo con số, đúng lỗ mà chính E4 (dòng 108) và `contract.md:100-104` kể là chỗ lượt chấm 1 để lọt lệch 26.837. Lỗ được vá cho một ô cụ thể bằng cách thêm một input và một câu hỏi điểm, chứ không vá theo lớp mà AC-4 đã tuyên.
  source: measurement

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Chốt «một nguồn» của rang-ton-dong.sh vẫn tuyên quét LỚP mà chỉ soi được vài dòng — «69 hồ sơ» lọt**
  Người dùng thấy gì: Báo cáo phát hành có thể còn sót vài con số cũ chưa cập nhật trong hồ sơ, dù phần kiểm tra chính vẫn báo đạt.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: high
  Đề xuất: known-limits

- **rang-ton-dong.sh nuốt im `--chan ghim-lai` — fail-open, ngược hẳn hai răng cùng hồ sơ**
  Người dùng thấy gì: Nếu ai đó gõ nhầm tên cấu hình khi chạy kiểm tra này (ví dụ chọn sai loại kiểm), hệ thống vẫn báo "đạt" thay vì báo lỗi cấu hình sai, nên có thể bỏ sót việc kiểm tra chưa thực sự chạy đúng ý.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **evidence-report E5 ghim dòng PASS mà răng ở HEAD không còn in — bên viết và bên đọc lại trôi khỏi nhau**
  Người dùng thấy gì: Báo cáo bằng chứng đã lưu có thể không khớp từng chữ với thông điệp mà công cụ kiểm tra hiện in ra, gây khó đối chiếu lại về sau.
  file: `_acceptance/release-2-14-0/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **rang-so-tang.sh đọc số từ CÂY LÀM VIỆC còn neo lấy từ git — bằng chứng không dựng lại được từ verified_commit**
  Người dùng thấy gì: Nếu số phiên bản mới chỉ được sửa trên máy mà chưa lưu vào kho, bước kiểm tra tăng số vẫn có thể báo đạt nhầm.
  file: `_acceptance/release-2-14-0/rang-so-tang.sh`
  severity: low
  Đề xuất: known-limits

- **rang-ton-dong.sh nuốt im cờ `--chan ghim-lai` mà config truyền — fail-open, trái đúng chốt vừa thêm cho hai răng bên cạnh**
  Người dùng thấy gì: Nếu tuỳ chọn cấu hình của bước kiểm tra chiến dịch bị gõ sai hoặc mất, hệ thống vẫn báo đạt mà không có cảnh báo nào.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên quét LỚP «mọi cụm số trong văn hợp đồng» nhưng chỉ soi những DÒNG chứa hai literal neo**
  Người dùng thấy gì: Báo cáo phát hành có thể còn sót vài con số cũ chưa cập nhật trong hồ sơ, dù phần kiểm tra chính vẫn báo đạt.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: high
  Đề xuất: known-limits

- **Cờ `--chan ghim-lai` rơi vào hư không — răng không đọc $@, fail-open đúng lớp mà hai răng bên cạnh đã cưỡng chế**
  Người dùng thấy gì: Nếu tuỳ chọn cấu hình của bước kiểm tra chiến dịch bị gõ sai hoặc mất, hệ thống vẫn báo đạt mà không cảnh báo.
  file: `_acceptance/release-2-14-0/rang-ton-dong.sh`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).