# Review Findings: ra-co-ten-lam-va-trao (round 6)

Informational — nằm NGOÀI hook `acceptance-evidence-gate.js`. File này chia theo kết quả scope-triage: mỗi finding ghi title, file:line, severity, detail, source.

## Trong hợp đồng

### 1. Khối `EVIDENCE-SECTIONS-TEMPLATE` đặt trên h1 — mọi báo cáo sinh từ khuôn đều KHÔNG xanh-sạch, `machine-cleared` không bao giờ ghi được
- file: `skills/acceptance/references/evidence-report-template.md:162`
- severity: high
- AC: AC-2
- nguồn: conventions
- rationale: AC-2 đòi evidence-report.md của fixture PASS xanh-sạch phải sinh từ khối EVIDENCE-XANH-SACH-BLOCK của khuôn bên viết (không gõ tay); vì khối hai mục đặt sai vị trí (trên h1) làm section bị cắt sai, một báo cáo sinh đúng như AC-2 mô tả sẽ KHÔNG đạt điều kiện sections nên pre-merge-check không thể trả exit 0 như AC-2 yêu cầu.

Khối hai mục nằm ở dòng 159–163, tức NGAY TRÊN `# Evidence Report: {{slug}}` (dòng 165). `lib/md-section.cjs` cắt section theo luật `default -> same-or-higher` (`lv >= 2 && lv <= lvl`), nên một h1 KHÔNG đóng section h2. Hệ quả: `## Ngoài hợp đồng` nuốt luôn `<!-- EVIDENCE-SECTIONS-TEMPLATE>>> -->`, dòng tiêu đề h1 và cả bảng eval, tới tận `## Evidence`.

Đo trên vật thật (chép vùng sau `---8<---`, thay `{{slug}}`, đọc bằng chính reader):
```
Known limits    present=true empty=true
Ngoài hợp đồng  present=true empty=false
```

Cả hai bộ kiểm xanh-sạch — `xanhSach` (scripts/khong-can-nguoi.mjs:65-69) và `xanh_sach_check` (scripts/pre-merge-check.sh:361-378) — vì thế trả «mục «Ngoài hợp đồng» có nội dung». Điều kiện thứ sáu không bao giờ đạt, nên `status: machine-cleared` (ô kết của làn V, đúng thứ hồ sơ này mở) không bao giờ ghi được cho một báo cáo sinh từ khuôn. Hồ sơ thật hiện có đặt hai mục SAU h1 và trước `## Analyst` — khuôn mới dạy ngược lại vị trí đang chạy được.

Vì sao suite không bắt: tests/plugins/ra-co-ten.test.mjs:91 rút khối bằng marker (đúng doctrine) nhưng dán nó vào CUỐI fixture (`t += '\n' + secBlk`), tức đổi vị trí so với khuôn. Đó đúng lớp «thước gắn vào vật khác vật được giao» của CLAUDE.md: fixture do code sinh, nhưng lắp lại theo hình dạng mà không writer nào theo khuôn sẽ tạo ra. Phép đo round-trip cần dựng báo cáo từ TRỌN vùng sau `---8<---` rồi hỏi chính reader, chứ không ghép lại thứ tự.

### 2. Assert QUAN HỆ nhưng lấy vị từ của chính vật đo — biên «+1 ngày» của quaTimebox không ca nào chạm
- file: `tests/plugins/ra-co-ten.test.mjs:682`
- severity: high
- AC: AC-13
- nguồn: measurement
- rationale: AC-13(iii) đòi phép đo QUAN HỆ hai chiều đúng ở mọi ngày chạy cho cờ qua-timebox; ca hiện tại so kết quả sản xuất với chính hàm sản xuất đó nên không thật sự kiểm được ngữ nghĩa biên +1 ngày, và không có fixture nào gần biên — đúng điều AC-13(iii) yêu cầu chứng minh nhưng chưa được chứng minh.

RT13(iii) hứa (AC-13(iii), E13) một đẳng thức HAI CHIỀU độc lập: «slug có cờ qua-timebox ⇔ có bullet Timebox parse được ngày ∧ ngày đó trước ngày chạy». Thân ca lại viết `const expQua = !!oTxt && NG.quaTimebox(oTxt);` rồi so với `x.flags`. `scripts/start-scan.mjs` (dòng `const quaTimebox = oTxt => NG.quaTimebox(oTxt)`) gọi ĐÚNG hàm đó. Nên vế «mong đợi» và vế «thực tế» là cùng một hàm: assert chỉ chứng minh start-scan có NỐI DÂY tới lib, không chứng minh được ngữ nghĩa của luật. Vị từ sai cách nào thì hai vế cũng sai giống nhau và ca vẫn xanh.

Điều làm nó thành lỗ thật: ngữ nghĩa duy nhất mà `quaTimebox` mã hoá là biên cộng-một-ngày — `d + 86400000 <= now` trong `lib/nguong-o-co-hoi.cjs`, kèm chú thích «hạn viết "muộn nhất <ngày>" BAO GỒM ngày đó, nên quá hạn tính từ 00:00 hôm SAU». Đó chính là lớp lỗi vòng trước đã dẫm (S4-r4: bản chép «lệch đúng MỘT NGÀY»). Ca duy nhất còn lại chạm timebox là RT12 dòng 534/538 với bốn fixture `2000-01-01` · `01/01/2000` · `2999-12-31` · `cuối quý` — cách biên hàng trăm/nghìn năm. `grep -rn 'quaTimebox|qua-timebox|Timebox' tests/` cho thấy không còn ca nào khác. Kết quả: đổi `d + 86400000 <= now` thành `d <= now` (hoặc `d + 2*86400000 <= now`) thì RT12 vẫn xanh (2000 và 2999 không đổi kết luận) VÀ RT13(iii) vẫn xanh (hai vế cùng đổi). Luật ngày mà lib được sinh ra để giữ hiện không có phép đo nào.

Sửa rẻ: thêm vào RT12 hai fixture biên sinh từ `Date.now()` lúc chạy — hạn = hôm nay (mong: KHÔNG cờ) và hạn = hôm qua (mong: CÓ cờ); đó là hai assert phân biệt được ba cách viết biên.

### 3. Đo CHỈ DẪN thay vì ĐẦU RA — răng chống-blacklist RT13(iv) miễn trừ được bằng một câu chú thích
- file: `tests/plugins/ra-co-ten.test.mjs:705`
- severity: medium
- AC: AC-13
- nguồn: measurement
- rationale: AC-13(iv) đòi quét không gian mở chống blacklist thật — file nào không có ca đo thật phải bị nêu tên; vị từ 'có ca' hiện chỉ hỏi tên file có xuất hiện đâu đó trong văn bản ca (kể cả chú thích), nên răng chống lách mà AC-13(iv) đòi hỏi có thể bị tắt mà không cần viết assert nào — đúng lỗ mà điều khoản này sinh ra để chặn.

RT13(iv) là răng chống blacklist trên không gian mở: mọi file chứa `signed-off` phải «có ca thật» hoặc nằm trong khối `BO-DOC-KHAI-GACH`. Vị từ «có ca thật» là `const coCa = f => khaiPaths.has(f) && testSrc.includes(f.split('/').pop());` — vế thứ hai chỉ hỏi tên file có XUẤT HIỆN trong văn bản của chính file ca hay không, không hỏi có assert nào chạy trên nó.

Ca cụ thể đang tồn tại trong diff: `commands/approve.md` vẫn nằm trong `paths:` của E10 (evals.yaml) nên `khaiPaths.has('commands/approve.md')` = true; và `testSrc.includes('approve.md')` = true — thoả mãn nhờ ĐÚNG dòng chú thích ở RT10 dòng 595 nói ngược lại: «`commands/approve.md` KHÔNG còn trong vòng này: chế độ ký Cổng Đáng đã tách sang hồ sơ `cong-dang-co-cua`». Nghĩa là một câu khai «file này KHÔNG được đo» lại là thứ làm cho răng coi nó «đã có ca». Hôm nay chưa sai kết luận chỉ vì `approve.md` không còn chuỗi `signed-off` (đã kiểm bằng `git grep -l signed-off`), nhưng cơ chế miễn trừ đang sống: thêm tên file vào một dòng `paths:` cộng với nhắc tên nó ở bất kỳ đâu trong file ca (kể cả trong chú thích, kể cả trong danh sách NGOAI) là tắt được răng mà không viết assert nào.

Sửa rẻ: `coCa` đòi tên file xuất hiện trong một BIỂU THỨC được chạy — ví dụ chỉ đếm hit của `readRepo('<path>')` / `path.join(ROOT, ...)` sau khi đã lột hết chú thích khỏi `testSrc`; và quét `paths:` khai file mà không có lượt đọc nào thì gọi là dòng chết (đối xứng với vế `chet` đang có cho khối gạch).

### 4. Fixture VIẾT TAY đúng khuôn bên ĐỌC — phần báo cáo mà reader thật sự parse không sinh từ khuôn bên viết
- file: `tests/plugins/ra-co-ten.test.mjs:86`
- severity: medium
- AC: AC-2
- nguồn: measurement
- rationale: AC-2 nêu rõ evidence-report.md dùng cho fixture phải sinh từ khối khuôn bên viết, không gõ tay theo khuôn bên đọc; fixture nền evidenceText() lại gõ tay đúng hình dạng mà scripts/recheck-evidence.cjs (bên đọc) parse cho đúng phần bảng eval và khối Evidence, vi phạm trực tiếp điều kiện round-trip mà AC-2 đặt ra cho các ca RT2/RT3/RT15/RT16.

`evidenceText()` (dòng 74–95) là fixture nền cho RT2 (đối chứng dương của lưới trước-merge), RT3, RT15, RT16. Chú thích đầu hàm và `expected` của E2 khai nó «SINH TỪ khuôn bên viết … không gõ tay theo khuôn bên đọc». Thực tế chỉ HAI mảnh đến từ khuôn: frontmatter (cắt sau mốc `---8<---`) và khối `EVIDENCE-SECTIONS-TEMPLATE` (hai heading rỗng). Mảnh mà bên đọc thật sự parse thì gõ tay ngay tại dòng 86–89:

```
let t = fm + `\n# Evidence Report: ${slug}\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| E1 | AC-1 | test | PASS |\n\n` +
  `## Evidence\n- eval: E1\n  run_id: ${slug}-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: ...`;
```

Bảng eval và khối `## Evidence` (run_id · exit_code · verifier · verified_at) chính là seam LLM-viết→máy-đọc: bên viết chép hình dạng đó từ `evidence-report-template.md`, bên đọc là `scripts/recheck-evidence.cjs` mà `pre-merge-check.sh` gọi trong RT2. Vì fixture gõ theo khuôn bên ĐỌC, khuôn bên viết đổi hình dạng khối `## Evidence` (thêm trường bắt buộc, đổi tên `verified_at`, đổi cách xuống dòng) thì mọi ca RT vẫn xanh trong khi hồ sơ do bên viết sinh ra sẽ đỏ ở lưới — đúng hình dạng (3) trong CLAUDE.md «bên VIẾT và bên ĐỌC trôi khỏi nhau vì mọi test tự dựng fixture đúng khuôn bên đọc».

Ghi chú cho triage: có ràng buộc thật ở đây — vùng chép của khuôn chứa hàng `| E4 | AC-2 | judgment | UNCERTAIN |`, nên một fixture chép NGUYÊN vùng chép không bao giờ xanh-sạch được. Tức là khuôn hiện chưa có một khối marker cho «thân báo cáo tối thiểu, xanh-sạch». Lối sửa đúng lớp là thêm marker đó vào khuôn rồi rút, chứ không phải gõ tay tiếp.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Bộ quét gắn `flags` cho nhóm «Đang dở» và «Đã xong» nhưng thân lệnh chỉ dạy in cờ ở nhóm cổng**
  Người dùng thấy gì: Ở màn hình /start, các cảnh báo như 'đã quá hạn tự khai theo lịch' hoặc 'khai không đo được dù có người dùng thật' hiện tại chỉ được hướng dẫn hiển thị cho những việc đang chờ chữ ký — việc đang làm hoặc đã xong có thể mang cùng cảnh báo mà không hiện ra, khiến người dễ bỏ sót tín hiệu cần xem lại.
  file: `commands/start.md`
  severity: medium
  Đề xuất: known-limits

- **`commands/approve.md` chỉ còn thay đổi khoảng trắng — sót lại của lượt cắt đôi hồ sơ**
  Người dùng thấy gì: Lệnh duyệt (approve) còn sót lại một dòng trống thừa từ lần tách hồ sơ trước đó — không đổi cách lệnh hoạt động, nhưng khiến người rà soát PR tưởng lệnh này có thay đổi thật.
  file: `commands/approve.md`
  severity: low
  Đề xuất: known-limits

- **Thẻ Cổng 2 gọi hồ sơ HỎNG là «máy đã đi tiếp hợp lệ» — gate-card không đọc mảng broken**
  Người dùng thấy gì: Khi một hồ sơ bị đánh dấu mâu thuẫn — ví dụ đã có chữ ký người nhưng trạng thái vẫn ghi là 'máy tự thông' — thẻ quyết định hiển thị cho người duyệt vẫn nói 'hợp lệ, không cần chữ ký' thay vì cảnh báo, nên người duyệt có thể bỏ qua đúng hồ sơ cần soi lại nhất.
  file: `scripts/gate-card.js`
  severity: high
  Đề xuất: new-contract

- **Lối ra «Không đo được» viết dạng bullet bị xếp im lặng thành «ngưỡng chưa chốt»**
  Người dùng thấy gì: Nếu người khai viết lý do 'không đo được' theo dạng gạch đầu dòng thay vì dòng riêng như hướng dẫn, hệ thống âm thầm coi ngưỡng là 'chưa chốt' và treo hồ sơ chờ một phiên nghiệm thu sẽ không bao giờ diễn ra, thay vì đóng hồ sơ đúng lối ra đã khai.
  file: `lib/nguong-o-co-hoi.cjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).