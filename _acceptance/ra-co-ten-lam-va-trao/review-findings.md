# Review Findings: ra-co-ten-lam-va-trao (round 4)

Informational — nằm NGOÀI hook `acceptance-evidence-gate.js`. File này chia theo kết quả scope-triage: mỗi finding ghi title, file:line, severity, detail, source.

## Trong hợp đồng

### 1. Răng chiều đỏ của /approve chặn đúng lối mà chính bước 2 dựng ra
- file: `commands/approve.md:156`
- severity: high
- AC: AC-8
- nguồn: conventions
- rationale: AC-8(i) chỉ định rõ răng chiều đỏ chỉ kích hoạt khi ngưỡng còn `…` (chưa-chốt) chứ không phải khi còn `[đề xuất]`, và văn bản thật của approve.md vi phạm đúng điều kiện này.

Bước 1 khai: «`làm`/`lặp` mà ô ngưỡng còn `…` (hoặc còn `[đề xuất]`) và không có dòng «Không đo được — » → TỪ CHỐI, in đúng câu cờ đỏ của thẻ». Bước 2 ngay dưới lại là: «Gỡ tiền tố `[đề xuất]` khỏi mọi bullet ngưỡng: ký là nhận».

Hai câu loại trừ nhau. `[đề xuất]` chính là trạng thái bình thường của ngưỡng máy vừa đề xuất (`/start` bước ⑤ dạy máy viết nó, `OPP-DE-XUAT-PREFIX` là bản gốc), và bước 2 tồn tại chỉ để xử đúng ca đó lúc ký. Áp bước 1 theo mặt chữ thì mọi lượt `làm`/`lặp` trên ô có đề xuất đều bị từ chối và bước 2 không bao giờ chạy được — lối «máy đề xuất, người gỡ tiền tố là chốt» thành ngõ cụt.

Máy đã cài ngược lại với bước 1, nên đây là chỉ dẫn lệch khỏi vật:
- `scripts/gate-card.js` chỉ cắm cờ đỏ khi `nguong0 === 'chua-chot'`; với `de-xuat` nó in chip hổ phách «máy đề xuất — anh sửa hoặc nhận». Nghĩa là «in đúng câu cờ đỏ của thẻ» không có nguồn để in.
- `lib/nguong-o-co-hoi.cjs` phân `de-xuat` khác `chua-chot`; `scripts/start-scan.mjs` (`thresholdFilled`) xếp `de-xuat` là ĐÃ điền → hồ sơ vào nhóm chờ Cổng Đáng.
- Ca đo cũng chốt vậy: `tests/plugins/ra-co-ten.test.mjs:472-475` đòi ô `de-xuat` chưa hợp đồng phải là `gate: 'dang'`.

Sửa: bỏ vế «(hoặc còn `[đề xuất]`)» khỏi bước 1 — chỉ `chua-chot` mới là chiều đỏ, đúng như thẻ và bộ quét đang nói.

### 2. Ca đo timebox chép lại luật lib và lệch một ngày — suite đỏ ngày 30/08/2026
- file: `tests/plugins/ra-co-ten.test.mjs:708`
- severity: high
- AC: AC-13
- nguồn: conventions
- rationale: AC-13(iii) đòi cờ qua-timebox được đo bằng đúng quan hệ của lib, đúng ở mọi ngày chạy; ca đo hiện tại chép lại vị từ lệch một ngày nên chính phép đo của hợp đồng không giữ đúng lời hứa đó.

AC-13(iii) đo cờ bằng quan hệ, nhưng ca đo tự viết lại vị từ thay vì gọi `NG.quaTimebox` của `lib/nguong-o-co-hoi.cjs`:
- lib: `d + 86400000 <= now` — hạn viết «muộn nhất <ngày>» BAO GỒM ngày đó, quá hạn tính từ 00:00 hôm SAU (comment nói thẳng lý do).
- ca đo dòng 708: `date != null && date < Date.now()` — quá hạn ngay 00:00 chính ngày hạn.

Hai vị từ khác nhau đúng một ngày. `_acceptance/lenh-in-ra-phai-bam-duoc/opportunity.md:42` có `Timebox: ván lái-thử kế ≤ 30/08/2026`, và bộ quét trên cây thật đang xếp slug này vào `gates` (`gate: gia-tri`, `flags: []`) — tức nó nằm trong tập ca đo quét. Ngày 2026-08-30: lib trả false (chưa cắm cờ), ca đo tính `expQua = true` → `cờ qua-timebox thiếu` → RT13 ĐỎ suốt ngày hôm đó rồi tự xanh lại hôm sau. Không ai chạm code, màu vẫn đổi — đúng lớp «thước ghim vào thứ SẼ ĐỔI».

Kèm theo, dòng 700 chỉ quét `['gates','inProgress','done']`. Nhóm `considering` bị bỏ, mà đó lại chính là nhóm `start-scan.mjs` KHÔNG gắn `oFlags` vào (`considering.push(g('y-can-nhac', …))` không nhận flags). Vế «và ngược lại mọi slug thoả quan hệ đó phải mang cờ» của AC-13(iii) vì thế không đo được ở đúng chỗ nó có thể sai.

Sửa: ca đo gọi thẳng `NG.quaTimebox(oTxt)` (một luật, một bản) và mở tập quét sang `considering`.

### 3. Oracle của RT13(iii) CHÉP LẠI luật ngưỡng/timebox thay vì gọi lib/nguong-o-co-hoi.cjs — bản chép đã lệch (đã chứng bằng chạy thật)
- file: `tests/plugins/ra-co-ten.test.mjs:708`
- severity: high
- AC: AC-13
- nguồn: measurement
- rationale: AC-13(iii) đòi đẳng thức hai chiều đúng theo luật thật của lib cho cả qua-timebox lẫn nguong-chua-chot; ca đo chép tay lệch cả hai luật này nên chính phép đo của hợp đồng sai.

Hình dạng vi phạm: **fixture/oracle viết tay theo khuôn bên ĐỌC, không round-trip rút-từ-writer-đọc-bằng-reader** (hình dạng 2) — đây chính là «bộ đọc thứ ba chép luật» mà `lib/nguong-o-co-hoi.cjs` vừa được lập ra để xoá (xem header comment của lib: «vòng 1 viết luật này BA LẦN … bản thứ ba đã lệch ngay khi ra đời»). RT13(iii) tự dựng lại luật thay vì `require('lib/nguong-o-co-hoi.cjs')` như start-scan và gate-card đều làm, và bản chép lệch ở hai chỗ:

(a) **Lệch một ngày.** Test dòng 708: `const expQua = date != null && date < Date.now();`. Bản thật `lib/nguong-o-co-hoi.cjs`: `quaTimebox = ... d + 86400000 <= now` (hạn «muộn nhất <ngày>» BAO GỒM ngày đó). Đúng ngày hạn: oracle nói «phải có cờ», bộ quét nói «chưa quá» → RT13 ĐỎ oan.

(b) **Lệch định nghĩa `chốt`.** Test dòng 712 chỉ đòi «mọi bullet ĐANG CÓ đều đã điền» (`bul.every(...)`); bản thật đòi ĐỦ NHÃN của khuôn (`labels.every(lb => got.has(lb) && ...)`). Kiểm bằng lệnh chạy thật: bỏ bullet `- Timebox:` khỏi `_acceptance/start-bang-dieu-khien/opportunity.md` → lib trả `chua-chot` (bộ quét cắm cờ), oracle của test tính `chot=true` (đòi KHÔNG cờ) → ĐỎ oan.

Bằng chứng chạy thật (bản sao cây, đã hoàn nguyên): đổi Timebox của `_acceptance/lenh-in-ra-phai-bam-duoc/opportunity.md` từ `≤ 30/08/2026` thành `≤ 24/08/2026` (= hôm nay) → `RT_CASES=RT13 node tests/plugins/ra-co-ten.test.mjs` cho `FAIL: [RT13] lenh-in-ra-phai-bam-duoc: cờ qua-timebox thiếu (ngày 24/08/2026)`. Hồ sơ đó đang khai hạn **30/08/2026** → suite sẽ tự đỏ vào ngày 2026-08-30 dù không ai đụng code. Nguy hiểm kép: đỏ-oan huấn luyện người sửa THƯỚC cho vừa VẬT (hạ thước lặng lẽ) đúng lúc vế «có cờ» của đẳng thức lần đầu tiên được chạy thật. Sửa rẻ: gọi `NG.quaTimebox(oTxt)` và `NG.thresholdState(oTxt, oppTpl)` trong ca đo, giữ chiều đỏ bằng mutant trên lib chứ không bằng công thức chép tay.

### 4. RT13(iii) áp đẳng thức qua-timebox lên cả nhóm inProgress mà start-scan không hề tính cờ ở đó
- file: `tests/plugins/ra-co-ten.test.mjs:700`
- severity: medium
- AC: AC-13
- nguồn: measurement
- rationale: AC-13(iii) yêu cầu đẳng thức quan hệ đúng ở mọi ô mà bộ quét thực sự hứa gắn cờ; ca đo áp đẳng thức đó lên nhóm inProgress nơi bộ quét không tính cờ, khiến phép đo của chính hợp đồng sai ở phạm vi áp dụng.

Hình dạng vi phạm: **assert «quan hệ» đặt lên vật không hứa quan hệ đó** — cùng lớp với finding trên nhưng cơ chế khác, nên sửa khác. Dòng 700 duyệt `['gates','inProgress','done']` rồi dòng 709 bắt buộc `flags.includes('qua-timebox') === expQua` cho MỌI phần tử. Nhưng `scripts/start-scan.mjs` chỉ tính `quaTimebox` ở hai chỗ: dòng 325 (nhánh hồ sơ đã thông Cổng Bằng chứng) và dòng 408 (`oFlags`, nhánh hồ sơ chỉ có opportunity). Các nhánh inProgress có hợp đồng — dòng 363 (`nghiem-thu-bi-chan` / `dang-sua-theo-bang-chung`), 376–378 (`cho-nghiem-thu-may`), 383 (`dang-viet-code` / `dang-lap-ke-hoach`) — gọi `g(...)` không truyền `flags`, nên luôn nhận mặc định `flags: []`.

Bằng chứng chạy thật (đã hoàn nguyên): đổi Timebox trong `_acceptance/ra-co-ten-lam-va-trao/opportunity.md` (hồ sơ này đang ở `nghiem-thu-bi-chan`) sang `2026-01-01` → `FAIL: [RT13] ra-co-ten-lam-va-trao: cờ qua-timebox thiếu (ngày 2026-01-01)`. Hồ sơ đang khai hạn **2026-09-30**; bất kỳ hồ sơ nào còn ở giữa vòng khi quá hạn đều làm suite đỏ oan. Phải chốt một trong hai rồi ghim: hoặc bộ quét tính cờ cho mọi ô (thì oracle đúng), hoặc oracle chỉ áp đẳng thức lên đúng các ô bộ quét hứa (thì phải nói ra trong AC-13).

### 5. RT17 khai «bốn vế RÚT TỪ thân lệnh ký» nhưng thực chất là bốn regex chép tay + assert chuỗi-có-mặt
- file: `tests/plugins/ra-co-ten.test.mjs:884`
- severity: medium
- AC: AC-17
- nguồn: measurement
- rationale: AC-17 chỉ định rõ bốn vế điều kiện phải được rút từ chính thân commands/approve.md rồi đối chiếu bằng ma trận toàn phần 4 ca biên; ca đo hiện tại chép tay bốn regex và không có ràng buộc số ca = số vế, trái đúng yêu cầu này.

Hình dạng vi phạm: **assert «chuỗi có mặt» trong khi lời hứa là QUAN HỆ giữa hai bên** (hình dạng 3), kèm **thiếu ràng buộc số assert = số phần tử** (hình dạng 5). Chú thích dòng 882 viết «Bốn vế RÚT TỪ thân lệnh ký, không chép tay», nhưng dòng 884–889 là một mảng literal bốn cặp regex gõ tay, và dòng 890 chỉ kiểm `re.test(ap)` — tức là *chép tay rồi kiểm sự có mặt*, không phải rút.

AC-17 hứa quan hệ: tập vế khai trong `commands/approve.md` ⇔ tập điều kiện `scripts/gate-card.js` thật sự cưỡng chế. Phép đo hiện tại là HAI danh sách gõ tay độc lập (mảng `VE` bốn phần tử ở dòng 884 và mảng `CA` ba ca + một ca rời ở dòng 902–911), không có phép đếm nào buộc hai bên bằng nhau — khác hẳn RT9/RT16 cùng file, nơi có `if (oDem !== 8) errs.push('ma trận ... != 8 khai trước')`. Hệ quả: thêm một vế thứ năm vào `approve.md`, hoặc gate-card cưỡng chế thêm một điều kiện không khai trong thân lệnh, đều KHÔNG có ca nào đỏ. Sửa rẻ: rút danh sách vế từ một khối marker trong `approve.md` (như RT8 đã làm với `GATE-ONESHOT-SLOTS` hàng `g0`), sinh ca biên theo vòng lặp trên danh sách rút được, và ghim `số ca biên === số vế rút được`.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **product-map nuốt lỗi khuôn — biến luật fail-closed thành fail-open**
  Người dùng thấy gì: Nếu khuôn dùng để đọc ô cơ hội bị hỏng, bản đồ sản phẩm và bộ quét nội bộ có thể kết luận khác nhau về cùng một hồ sơ — một bên nói đã xong, một bên nói còn đang chờ — khiến người xem thấy thông tin sai lệch mà không có gì báo hiệu.
  file: `scripts/product-map.mjs:190`
  severity: high
  Đề xuất: new-contract

- **Thẻ Cổng Phạm vi không nhận lối «không đo được» — cảnh báo sai trên hồ sơ đã khai đúng**
  Người dùng thấy gì: Một hồ sơ đã khai rõ lý do không đo được vẫn có thể bị hệ thống cảnh báo nhầm là thiếu cách đo, khiến người xem hiểu lầm hồ sơ chưa hoàn chỉnh dù nó đã khai đúng theo đúng lối cho phép.
  file: `scripts/gate-card.js:384`
  severity: medium
  Đề xuất: new-contract

- **gate-card vừa gọi lib ngưỡng vừa giữ bản chép của cùng hai hằng**
  Người dùng thấy gì: Vì cùng một quy tắc nhận diện văn bản tồn tại hai bản sao trong hệ thống, sau này khi có người cập nhật quy tắc ở một chỗ mà quên chỗ kia, hệ thống có thể lại đưa ra cảnh báo sai cho người xem mà không ai nhận ra ngay.
  file: `scripts/gate-card.js:359`
  severity: medium
  Đề xuất: new-contract

- **pre-merge-check: `_enf` không khai `local` — rò ra phạm vi toàn cục**
  Người dùng thấy gì: Một biến tạm trong script kiểm tra trước khi gộp bị rò ra ngoài phạm vi đáng lẽ của nó; hiện chưa gây sai lệch nào thấy được cho người dùng, nhưng có thể tạo kết quả kiểm tra khó lường nếu code sau này thay đổi.
  file: `scripts/pre-merge-check.sh:346`
  severity: low
  Đề xuất: known-limits

- **Thông điệp «chưa arm cổng» chưa kể `machine-cleared`**
  Người dùng thấy gì: Khi hệ thống từ chối một hồ sơ vì trạng thái chưa hợp lệ, dòng thông báo hiển thị cho người có thể khiến người đọc hiểu lầm rằng trạng thái «máy đã thông» không được chấp nhận, dù thực tế nó đã được cho phép.
  file: `scripts/pre-merge-check.sh:702`
  severity: low
  Đề xuất: known-limits

- **Thẻ Cổng 2 mời KÝ hồ sơ `machine-cleared` khi bộ quét không xếp được slug — fail-open, không một dòng cảnh báo**
  Người dùng thấy gì: Nếu bộ quét phát hiện một hồ sơ «máy đã thông» đang có mâu thuẫn nội bộ, thẻ quyết định vẫn có thể hiện nút Ký duyệt cho người xem — mời người ký một hồ sơ tự khai là có vấn đề, mà không có cảnh báo nào báo trước.
  file: `scripts/gate-card.js:594`
  severity: high
  Đề xuất: new-contract

- **Bản đồ sản phẩm NUỐT lỗi khuôn ô cơ hội rồi xếp sai ô — hai bộ đọc nói hai chuyện về cùng hồ sơ**
  Người dùng thấy gì: Nếu khuôn dùng để đọc ô cơ hội bị hỏng, bản đồ sản phẩm và bộ quét nội bộ có thể kết luận khác nhau về cùng một hồ sơ — một bên nói đã xong, một bên nói còn đang chờ — khiến người xem thấy thông tin sai lệch mà không có gì báo hiệu.
  file: `scripts/product-map.mjs:190`
  severity: medium
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
