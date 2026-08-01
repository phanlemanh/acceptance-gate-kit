# Review Findings: ngon-ngu-mat-nguoi (round 3)

## Trong hợp đồng

### P89 đo AC-3 bằng substring toàn-file — đột biến E4 khai vẫn XANH
- file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/adoring-rubin-5bf1c9/tests/plugins/run-tests.sh:2038`
- severity: high
- AC: AC-3
- source: bugs

AC-3 đòi *dòng vận hành đi kèm N6* phải chỉ đích danh `CONTEXT.md` "thay vì chỉ nói 'từ điển sản phẩm' chung chung". P89 chỉ kiểm `if "CONTEXT.md" not in text` trên TOÀN file. Chuỗi `CONTEXT.md` xuất hiện HAI lần trong skills/acceptance/references/human-facing-language.md: dòng 37 (dòng N6 — vật thật được đo) và dòng 88 (mục 'Từ mới feature này đưa vào từ điển'). Lần thứ hai giữ phép đo xanh vĩnh viễn.

RED-probe đã chạy (bản sao sạch, baseline XANH trước): thay dòng 37 thành '**Từ điển sản phẩm sống ở đâu (N6):** từ điển sản phẩm của kho đang làm.' → `Results: all plugin tests passed`. Đúng vi phạm AC-3 mà không phép đo nào đỏ.

Nặng hơn: _acceptance/ngon-ngu-mat-nguoi/evals.yaml E4 KHAI chính đột biến này làm đối chứng âm ("đột biến thay bằng cụm chung chung 'từ điển sản phẩm' → ĐỎ ghim thông điệp N6-không-chỉ-đích-từ-điển"), nhưng P89 không hề có đột biến đó — 4 đột biến hiện có là N4/ngưỡng/KHÔNG-ÁP/ví-dụ-N6. E4 đang PASS trong evidence-report mà chưa bao giờ có đối chứng âm.

Sửa: neo phép đo vào ĐÚNG dòng N6, ví dụ `re.search(r'^\*\*Từ điển sản phẩm sống ở đâu \(N6\):\*\*[^\n]*CONTEXT\.md', text, re.M)`, rồi thêm đột biến E4 đã khai.

### AC-8 'cặp marker duy nhất trong toàn kho nguồn' không có phép đo nào — marker trùng nội-dung-khác vẫn XANH
- file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/adoring-rubin-5bf1c9/tests/plugins/run-tests.sh:2122`
- severity: high
- AC: AC-8
- source: bugs

AC-8 đòi "mỗi cặp marker chỉ xuất hiện đúng một lần TRONG TOÀN KHO NGUỒN". Không phép đo nào đo điều đó:
- P92 dòng 2122-2123 chỉ đếm TRONG một file (`t.count(...) == 1` với t = human-facing-language.md).
- P93 đếm theo NỘI DUNG (tên ba cột `COL`, thân sơ đồ `DIAG`), không đếm TÊN MARKER — một khối marker trùng tên nhưng nội dung khác hoàn toàn lọt lưới.

RED-probe đã chạy (baseline XANH trước): thêm vào cuối docs/superpowers/specs/2026-08-01-ngon-ngu-mat-nguoi-design.md một cặp `<!-- <<<PLAN-SUMMARY-TABLE-TEMPLATE -->` bọc bảng 2 cột `| A | B |` và một cặp `<!-- <<<DECISION-DIAGRAM-TEMPLATE -->` bọc fence khai `text` (không phải mermaid) → `Results: all plugin tests passed`.

Đây đúng seam LLM-viết→máy/LLM-đọc mà CLAUDE.md nêu: hai SKILL vòng lặp (feature-loop + feature-loop-codex) chỉ dẫn 'trình theo khuôn PLAN-SUMMARY-TABLE-TEMPLATE' — gọi theo TÊN. Tên trùng ở hai chỗ với nội dung mâu thuẫn nghĩa là bên đọc có thể bốc nhầm khối, im lặng.

Kèm theo: E9 trong evals.yaml khai hai đột biến ('xoá marker mở của khuôn bảng', 'xoá marker mở của khuôn sơ đồ') mà P92 không hề thực hiện — hai nhánh lỗi 'khong rut duoc khuon bang'/'khong rut duoc khuon so do' (dòng 2086, 2088) chưa từng được đá RED.

Sửa: đếm cặp marker trên cùng vùng quét của P93 (scan(root)), không phải trong một file; và bổ sung hai đột biến E9 đã khai.

### P93 loại thêm HAI vùng ngoài ba mục AC-10 khai (mọi path bắt đầu bằng dấu chấm, và mọi đuôi ngoài allowlist)
- file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/adoring-rubin-5bf1c9/tests/plugins/run-tests.sh:2318`
- severity: medium
- AC: AC-10
- source: bugs

AC-10 khai vùng quét là "toàn bộ cây nguồn (trừ mirror plugins/, _acceptance/, tests/)" — ĐÚNG ba mục, và commit d22e7e4 nói rõ 'cấm khoét thêm mục nào'. Nhưng `scan()` khoét thêm hai lớp nữa, cả hai không khai ở đâu:
1. dòng 2318 `if any(part.startswith(".") for part in rel): continue` — bỏ TOÀN BỘ path có phần bắt đầu bằng dấu chấm. Trong kho này .out-of-scope/ (2 file .md, git-tracked) và .agents/ (marketplace.json, git-tracked) là nguồn thật, CLAUDE.md gọi đích danh .out-of-scope/ là nơi ghi đề xuất bị từ chối.
2. dòng 2310 `EXT = {".md", ".js", ".mjs", ".sh", ".json"}` — bản sao nằm trong .yaml/.yml/.txt/.html/.py không bao giờ bị thấy.

RED-probe đã chạy (baseline XANH trước): `cp skills/acceptance/references/human-facing-language.md .out-of-scope/BAN-SAO-THU-3.md` — tức bản sao thứ ba NGUYÊN VĂN của cả bảng luật lẫn hai khuôn → `Results: all plugin tests passed`. Bảo đảm một-nguồn của AC-7/AC-10 sai mà phép đo vẫn báo đạt.

Đây cùng hình dạng lỗi mà round 1 (allowlist bỏ lọt design-loop/) và round 2 (khoét docs/superpowers/) đã dẫm; danh sách loại-trừ mới vẫn còn hai mục ẩn.

Sửa: loại đích danh chỉ những gì AC khai cộng vùng máy sinh không thể tránh (`.git`, `.claude`, `node_modules`) và ghi lý do từng mục, thay vì luật 'mọi path có dấu chấm'; nới EXT hoặc bỏ hẳn lọc đuôi (đọc nhị phân đã có errors='ignore').

### P89 kiểm 'hai phép thử' cũng bằng substring toàn-file — xoá định nghĩa Xoá-tên-máy vẫn XANH
- file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/adoring-rubin-5bf1c9/tests/plugins/run-tests.sh:2024`
- severity: medium
- AC: AC-1
- source: bugs

Cùng lớp lỗi với finding #1. AC-1 đòi file tham chiếu chứa 'hai phép thử gọi đích danh tên Xoá-tên-máy và Người-thứ-ba'. P89 chỉ làm `if name not in text`. Chuỗi 'Xoá-tên-máy' xuất hiện HAI lần trong human-facing-language.md: dòng 43 (định nghĩa phép thử — vật thật) và dòng 62 (câu dẫn của khuôn bảng, chỉ nhắc tên).

RED-probe đã chạy (baseline XANH trước): xoá nguyên gạch đầu dòng định nghĩa 'Xoá-tên-máy' ở mục '## Hai phép thử' (giữ nguyên nhắc tên dòng 62) → `Results: all plugin tests passed`. Phép thử biến mất khỏi bản luật mà phép đo AC-1 không đỏ.

(Ghi chú cùng file, mức thấp hơn: P95 dòng 2447 và 2449 là HAI điều kiện khác nhau nhưng phát ra CÙNG MỘT thông điệp, nên đột biến ở dòng 2471 chỉ chứng minh được điều kiện thứ nhất — nhánh 'ghép thẳng ${PLUGIN_ROOT} khi vẫn còn dòng resolver' chưa từng được đá RED riêng.)

Sửa: neo vào mục '## Hai phép thử' (rút block rồi tìm tên trong block đó), không tìm trên toàn văn bản; và tách thông điệp của hai nhánh P95.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **feature-loop 1.20.0 hard-depends on acceptance-gate ≥1.28.0 at S2 with no preflight declaration and no failure branch**
  Người dùng thấy gì: Nếu máy đang chạy bản vòng lặp tính năng mới trong khi phần công cụ chấp nhận vẫn ở bản cũ hơn, bước trình kế hoạch giữa vòng lặp có thể lặng lẽ không áp luật ngôn ngữ mặt người, khiến người xem tiếp tục nhận bảng kế hoạch viết bằng lối diễn đạt kỹ thuật khó hiểu mà không có cảnh báo nào.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/adoring-rubin-5bf1c9/feature-loop/skills/feature-loop/SKILL.md:116`
  severity: high
  Đề xuất: known-limits

- **P88 release-intent guard not updated for the 1.28.0 / 1.20.0 release — reverting the bump stays green**
  Người dùng thấy gì: Bộ kiểm dùng để đảm bảo một bản phát hành mới thật sự mang tính năng mới không được cập nhật cho đợt này, nên nếu sau này ai đó lỡ đưa các thành phần liên quan về phiên bản cũ hơn, hệ thống kiểm tra tự động vẫn báo mọi thứ ổn thay vì cảnh báo.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/adoring-rubin-5bf1c9/tests/plugins/run-tests.sh:1992`
  severity: medium
  Đề xuất: known-limits

- **Duplicate decision entry in the ledger — same decision appended twice with two ids**
  Người dùng thấy gì: Sổ ghi quyết định của tính năng này đang lưu trùng một quyết định thành hai dòng gần như giống hệt nhau, nên người xem lại thẻ quyết định hoặc đếm số quyết định đã đưa ra có thể bị nhầm lẫn hay đếm sai.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/adoring-rubin-5bf1c9/_acceptance/ngon-ngu-mat-nguoi/decisions.jsonl:16`
  severity: medium
  Đề xuất: known-limits

- **acceptance-card's PLUGIN_ROOT fallback resolves with the wrong --require, so it can return a version lacking the rules file**
  Người dùng thấy gì: Trong một số cách cài đặt thiếu biến môi trường gốc-công-cụ, thẻ quyết định có thể tự động chọn nhầm một bản cài cũ hơn không mang theo luật ngôn ngữ mặt người, khiến thẻ hiển thị cho người duyệt thiếu áp luật mà không có cảnh báo nào.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/adoring-rubin-5bf1c9/commands/acceptance-card.md:37`
  severity: medium
  Đề xuất: known-limits

- **Gate-2 review artifact cites code the same commit deleted**
  Người dùng thấy gì: Tài liệu rà soát dùng để người duyệt xem xét ở cổng thứ hai vẫn mô tả một số lỗi nghiêm trọng như đang còn tồn tại, dù các lỗi đó đã được sửa trong cùng đợt sửa — người đọc tài liệu này có thể tưởng nhầm công việc chưa hoàn tất.
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/adoring-rubin-5bf1c9/_acceptance/ngon-ngu-mat-nguoi/review-findings.md:11`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/9 lỗi rơi vào file không bộ đo nào phủ (_acceptance/ngon-ngu-mat-nguoi/decisions.jsonl, _acceptance/ngon-ngu-mat-nguoi/review-findings.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.