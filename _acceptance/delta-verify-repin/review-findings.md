## Trong hợp đồng

### Re-pin section boundary grammar diverges between the two enforcement readers (pre-merge fail-open vs recheck)
- file: `scripts/pre-merge-check.sh:776`
- severity: medium
- source: conventions
- AC: AC-2

pre-merge's awk terminates the '### Re-pin' section at ANY line matching /^#/ (including #### sub-headings), while recheck-evidence.js:59 secRe only terminates at \n#{1,3}\s. Reproduced with a code-generated fixture: a `run_id: repin-test-1` line cited after a `#### chi tiết lane` sub-heading inside the Re-pin section, with no matching {"kind":"repin"} log line — recheck exits 1 with the REPIN fraud message ('the lane never logged this re-pin'), pre-merge exits 0 (silently grandfathered). CI (the merge gate) is fail-open on a shape the hook treats as hand-minted provenance. This is the same 'hai reader lệch chuẩn' class this PR's own S4-r1 fixed — DV2p-7 and DV12pm were added specifically so the two readers cannot diverge, but they only pin the blank-line shape, not the sub-heading shape; the CLAUDE.md invariant says the fix must sweep the whole class ('quét cả file tìm mọi case cùng hình dạng'). The section-end grammar should live in one agreed definition (e.g. both stop at #{1,3} headings, or both at any ^#) with a round-trip case pinning it in both readers.

### Repin run_id được chấp nhận làm eval run_id — L2 PROVENANCE bypass
- file: `lib/evidence-core.js:140`
- severity: high
- source: bugs
- AC: AC-11

Feature này bắt đầu ghi dòng {"kind":"repin","run_id":...} vào cùng run-log.jsonl mà loadRunLogIds() của lib/evidence-core.js đọc, nhưng reader này gom run_id của MỌI dòng không phân biệt kind. Hệ quả (đã tái hiện bằng thực nghiệm với evaluateEvidence): một evidence block PASS bịa tay cite run_id của dòng repin (vd `- eval: E1\n  run_id: repin-abc-1\n  exit_code: 0`) cho runLogFailure = null — lớp đối chiếu run_id (hook acceptance-evidence-gate + recheck-evidence, dùng chung core) coi nó là machine-logged. Agent vừa re-pin xong có sẵn run_id repin trong context nên đây đúng là kịch bản 'lazy fabrication' mà lớp này được thiết kế để chặn. Test DV11 trong tests/hooks/run-tests.sh (dòng ~456) mang tên 'dòng kind:repin KHÔNG bị nhận nhầm làm dòng eval' nhưng chỉ test run_id không-tồn-tại (DV11b), không test nhánh mượn run_id repin — thuộc tính được tuyên bố chưa hề được đo. Fix gợi ý: loadRunLogIds bỏ qua dòng có `kind` (hoặc chỉ nhận dòng có evalId), kèm test DV11c mượn-repin-id → block.

### Hai reader section Re-pin lệch ngữ nghĩa: awk pre-merge kết thúc section ở MỌI dòng bắt đầu bằng '#', recheck chỉ ở heading cấp 1–3
- file: `scripts/pre-merge-check.sh:776`
- severity: medium
- source: bugs
- AC: AC-2

awk của pre-merge dùng `/^#/{s=0}` — bất kỳ dòng bắt đầu bằng '#' (heading cấp 4 `#### chi tiết`, hoặc dòng `# comment` trong fenced code block của section) đều tắt cờ section, nên dòng `run_id:` đứng sau đó KHÔNG được thu thập → grandfather âm thầm ở lớp CHẶN. recheck-evidence.js (secRe với lookahead `\n#{1,3}\s`) vẫn coi phần đó thuộc section và enforce; regex citation của recheck còn có flag `i` (bắt cả `Run_id:`) trong khi awk chỉ bắt chữ thường. Trong repo kit (recheck: strict) sự lệch chỉ gây fail-closed; nhưng ở consumer repo với RECHECK_MODE mặc định `warn` (scripts/pre-merge-check.sh:198), recheck chỉ NOTE không chặn — lớp blocking duy nhất cho luật repin là khối awk, nên một section Re-pin có sub-heading `####` (hoặc `Run_id:` viết hoa) trước dòng run_id sẽ lọt qua gate CI dù cite run_id chưa từng được lane log. Đây đúng lớp lỗi finding S4-r1 của chính feature này (hai parser của một seam lệch chuẩn); DV2p-7 chỉ test dòng-trống, chưa test dòng-bắt-đầu-bằng-# trong body. Fix gợi ý: awk đổi `/^#/` thành `/^#{1,3}[[:space:]]/`-tương-đương (vd `/^###? |^# /`) + thêm tolower cho run_id, và thêm case đối xứng vào premerge-repin.test.mjs.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **carry-plan.mjs not shipped in Codex package its SKILL instructs to invoke (dead pointer)**
  Người dùng thấy gì: Người dùng bản Codex chạy đúng theo hướng dẫn để tính lại kế hoạch mang-theo (carry) sau vòng sửa có thể gặp lỗi "không tìm thấy tệp" vì tệp đó chưa được đóng gói kèm bản Codex họ cài.
  file: `scripts/sync-plugin-packages.sh`
  severity: high
  Đề xuất: known-limits

- **carry-plan.mjs: --delta-files rỗng/thiếu → carry TOÀN BỘ eval xanh, không cảnh báo**
  Người dùng thấy gì: Nếu bước tính "những gì đã đổi" bị lỗi ngầm (ví dụ do sự cố kỹ thuật) thì hệ thống có thể tự động coi mọi bài kiểm tra vòng trước là vẫn còn hiệu lực và bỏ qua chạy lại chúng ở vòng sửa, mà không có bất kỳ cảnh báo nào — rủi ro một lỗi lẽ ra phải được phát hiện lại bị bỏ lọt.
  file: `feature-loop/scripts/carry-plan.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).