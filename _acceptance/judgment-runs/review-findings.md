# Review Findings: judgment-runs (round 3)

## Trong hợp đồng

### 1. Ô inert ra ĐỒNG THỜI cờ vàng và cờ đỏ "pass-rate hỗn hợp" trên thẻ Cổng 2 — đúng thứ comment ngay trên nó tuyên bố phải tách
- file: `scripts/gate-card.js:397`
- severity: high
- AC: AC-12
- source: conventions

Comment tại scripts/gate-card.js:373-375 khai bất biến: "Section Variance mang HAI loai tin hieu khac han nhau, phai ra HAI cờ khác nhau — (a) phương sai thật ... cờ đỏ; (b) ô inert ... cờ vàng". Nhánh mới (388-394) đọc cờ vàng từ run-log, nhưng nhánh cũ (396-399) KHÔNG loại inertNote ra khỏi `varr`, nên cùng một câu ra hai cờ.

Đây không phải shape hiếm — nó là shape MẶC ĐỊNH mà writer bắt buộc sinh ra. feature-loop/workflows/acceptance-verify.js:782 chỉ thị synthesize: "section '## Variance' phai KET THUC bang DUNG cau sau ... Neu section khong con noi dung nao khac thi cau nay la noi dung DUY NHAT — TUYET DOI KHONG ghi 'none' o tren no". Tức khi có ô inert mà không có phương sai thật, `## Variance` chứa ĐÚNG inertNote và không có "none" chặn `/^none/i`.

_acceptance/judgment-runs/evidence-report.md:191-193 chính là shape đó. Tái hiện (fixture sinh bằng code, contract/evals/report/run-log đúng khuôn production, verdict PASS):

  `<div class="flag fwarn">`Field khai mà máy không dùng: E10 khai `runs: 3` nhưng eval hội đồng luôn chạy đúng một lần mỗi góc nhìn...   ← đúng
  `<div class="flag fred">`Có eval ngẫu nhiên (pass-rate hỗn hợp) — Field khai mà máy không dùng: E10 khai `runs: 3` nhưng eval hội đồng luôn chạy đúng một lần mỗi góc nhìn...   ← sai

Người ký thấy cờ ĐỎ nói "máy phát hiện eval ngẫu nhiên chưa ổn định" trong khi sự thật là "bạn khai thừa một field trong evals.yaml" — hai việc khác hẳn chủ thể (việc của máy vs việc của người), và cờ đỏ là hạng nặng nhất trên thẻ.

Vì sao thước không bắt: fixture của WI6 (tests/workflows/acceptance-verify.test.mjs:912) dùng `variance = 'none — every multi-run eval is uniform'` — CHUỖI VIẾT TAY mà chính prompt của writer CẤM sinh ra. Case `WI6 KHONG muon nhan co phuong-sai` (914) xanh nhờ `/^none/i`, tức nó đang đo một shape production không bao giờ tạo được. Sáu case IMMUNE (918-929) chỉ assert cờ vàng CÒN, không case nào assert cờ đỏ VẮNG. Cả 221 case xanh trong khi shape thật đỏ — đúng lớp "fixture cho judge là văn viết tay không code path nào sinh ra" (CLAUDE.md, hình dạng (2) của "Thước phải gắn vào vật được giao").

Sửa phải sửa cả LỚP: đường vàng và đường đỏ cùng ăn một section, nên hoặc loại inertNote khỏi `varr` bằng chính chuỗi hợp đồng liên-file, hoặc thôi bắt writer chèn note vào `## Variance` (văn xuôi cho người có thể sống ở section riêng). Kèm case round-trip: writer sinh note → report sinh theo chỉ dẫn → reader phải ra ĐÚNG một cờ vàng, KHÔNG cờ đỏ.

### 2. Inert-field note also fires the red "random eval / mixed pass-rate" flag on the Gate 2 card
- file: `scripts/gate-card.js:398`
- severity: high
- AC: AC-12
- source: bugs

Commit 6c59204 moved the inert-field flag to read run-log.jsonl but deleted the filter that used to strip the inert sentence out of the ## Variance prose (old code: `rest = lines.filter(l => !l.startsWith(INERT_NOTE_PREFIX))`). The remaining variance branch now takes the WHOLE section verbatim, so the inert note is re-flagged as `fred` "Có eval ngẫu nhiên (pass-rate hỗn hợp)" — the exact signal-mixing the feature exists to remove.

This is the normal case, not an edge case: the synthesize prompt (feature-loop/workflows/acceptance-verify.js:781) instructs the writer to end ## Variance with the inert sentence and explicitly forbids writing "none" above it, so when there is no real variance the section contains ONLY the inert note. The repo's own _acceptance/judgment-runs/evidence-report.md:191-193 is already in exactly that shape.

Reproduced: a fixture with `## Variance` = the inert note alone renders BOTH `fwarn` (correct) and `fred "Có eval ngẫu nhiên (pass-rate hỗn hợp) — Field khai mà máy không dùng: E9 khai `runs: 3` ..."` (false). Same on `**note**` and `- note` shapes.

No test catches it: tests/workflows/acceptance-verify.test.mjs:918-929 only asserts the yellow flag SURVIVES each shape; the only `!/pass-rate hỗn hợp/` assertion (line 914) uses a variance body starting with "none", which the `/^none/i` guard suppresses independently. Cases `note co gach dau dong` and `note in dam` in that same IMMUNE list already emit the false red and pass green.

Identical in the mirror plugins/acceptance-gate/scripts/gate-card.js:398.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Cờ ô inert không bao giờ tắt được: reader lấy dòng kind:inert CUỐI trong run-log append-only, không lọc round**
  Người dùng thấy gì: Sau khi đã sửa file khai eval để bỏ field gây cảnh báo, thẻ quyết định ở Cổng 2 vẫn tiếp tục hiện cảnh báo cũ như thể lỗi còn tồn tại, khiến người ký khó biết việc sửa đã có hiệu lực hay chưa.
  file: `scripts/gate-card.js:389`
  severity: medium
  Đề xuất: known-limits

- **mutation-check.mjs — bằng chứng phân biệt duy nhất của feature — không được CI hay suite nào chạy, chỉ sống trong một eval của workspace này**
  Người dùng thấy gì: Đoạn kiểm tra dùng để chứng minh cơ chế cảnh báo hoạt động đúng không được chạy tự động cùng các kiểm tra khác của dự án, nên các thay đổi sau này có thể làm hỏng lại cơ chế này mà không ai phát hiện ra.
  file: `tests/workflows/mutation-check.mjs:1`
  severity: medium
  Đề xuất: known-limits

- **Stale inert warning from an earlier round is never cleared (no round filter on run-log.jsonl)**
  Người dùng thấy gì: Cảnh báo về field khai không dùng có thể vẫn hiển thị trên thẻ quyết định ngay cả sau khi vấn đề đã được khắc phục ở vòng chạy mới, khiến người ký hiểu nhầm là lỗi vẫn còn tồn tại.
  file: `scripts/gate-card.js:389`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).