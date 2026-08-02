## Trong hợp đồng

(rỗng — không có finding nào map được vào một AC cụ thể ở vòng chấm này.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Bằng chứng + thẻ Cổng 2 đứng yên ở 9 tiêu chí sau khi hợp đồng nâng lên 11 — verdict PASS phủ thiếu AC-10/AC-11**
  Người dùng thấy gì: Thẻ quyết định ở Cổng 2 vẫn ghi 'đạt' và nói 'chín tiêu chí' dù hợp đồng vừa được thêm hai tiêu chí mới — người duyệt có thể bấm ký duyệt cho một tính năng mà hai phần mới nhất chưa từng được đo lại lần nào.
  file: `_acceptance/hinh-theo-mat-phang/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **_Avoid_: surface trong mục "Mặt phẳng" đụng chính term chuẩn Surface — luật chết theo cấu trúc ở máy, mâu thuẫn ở người**
  Người dùng thấy gì: Trong tài liệu thuật ngữ nội bộ của kit, mục 'Mặt phẳng' liệt kê chữ 'surface' là từ nên tránh, nhưng 'Surface' lại đang là thuật ngữ chuẩn được dùng ở nơi khác trong kit — hướng dẫn viết tài liệu tự mâu thuẫn, và công cụ kiểm tra tự động không phát hiện được khi có ai đó lỡ dùng từ 'surface'.
  file: `CONTEXT.md`
  severity: low
  Đề xuất: known-limits

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ

- **AC-11 glossary check is self-gated: deleting the new terms silently deletes the requirement**
  file: `tests/plugins/run-tests.sh:2213`
  severity: high
  detail: P96 wraps the entire AC-11 assertion (new term must have a CONTEXT.md entry, and the 'mặt phẳng' entry must state how it differs from Surface) in `if "mặt phẳng" in terms:`, where `terms` is extracted from the HFL-GLOSSARY-TERMS block in skills/acceptance/references/human-facing-language.md — the very artifact under test. Reproduced: removed `- mặt phẳng` and `- nhìn-thấy-hình` from HFL-GLOSSARY-TERMS, removed the `**Mặt phẳng**:` and `**Nhìn-thấy-hình**:` entries from CONTEXT.md, re-ran scripts/sync-plugin-packages.sh, ran the full suite -> `Results: all plugin tests passed`. N6 and AC-11 are both violated with zero red. The `assert len(terms) >= 3` sanity counter at line 2203 does not fire because 3 pre-existing terms remain. This is the same hole review-findings.md:11 raised at S4-r1 ('P96 xanh rỗng'); commit 00e3c19 added the missing entries but left the ruler conditional on them, so the class is reopened rather than closed. Fix: pin the two terms this feature introduced as a fixed EXPECTED list (or assert the term count grew), instead of deriving the guard from the block being measured.
  source: bugs

- **Marker name cited inside LOOP-PICTURE-CLAUSE is never resolved — a typo is a dead pointer in both harnesses and the suite stays green**
  file: `skills/acceptance/references/human-facing-language.md:119`
  severity: high
  detail: The single-source clause both harnesses copy verbatim names a lookup table: "chọn cách vẽ bằng bảng tra `DECISION-DIAGRAM-SURFACES` theo mặt phẳng đang trình". No measurement resolves that name to an actual marker pair. P90 (run-tests.sh:2248-2268) only compares the clause byte-for-byte between the law and the two loop SKILLs, so a typo propagated to all three is *consistent* and passes. P97 (run-tests.sh:2646) looks the block up by a hardcoded literal name, not by the name the clause cites. P95 (run-tests.sh:2562-2566) verifies the block exists inside plugins/acceptance-gate, not that the clause points at it. Reproduced: replaced `DECISION-DIAGRAM-SURFACES` with `DECISION-DIAGRAM-SURFACE` in skills/acceptance/references/human-facing-language.md:119, feature-loop/skills/feature-loop/SKILL.md:116 and codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md:346, re-ran sync-plugin-packages.sh, ran the full suite -> `Results: all plugin tests passed`. Both harnesses would then instruct the model to consult a table that does not exist. This is exactly the dead-pointer class P95's own comment claims to close ('Con tro phai giai toi tan VAT, khong chi toi FILE') — applied to the file->block hop but not to the clause->marker hop. CONTEXT.md:149 cites the same name and has the same gap. Fix: extract the marker name from the clause with a regex and assert a matching `<!-- <<<NAME -->` … `<!-- NAME>>> -->` pair exists in the law, with a negative control that typos the name.
  source: bugs

- **P97 raises IndexError instead of reporting a malformed surfaces-table row**
  file: `tests/plugins/run-tests.sh:2664`
  severity: low
  detail: The per-row loop `continue`s when `len(row) != 3` after appending 'hang bang tra khong du 3 o', but `hoi_thoai = [x for x in body if "hội thoại" in x[0]]` is then built from all of `body` and line 2667 indexes `x[2]`. A `| Khung hội thoại | hình vẽ nội tuyến của phiên |` row (2 cells) makes the check raise `IndexError: list index out of range` instead of returning the intended diagnostic. Confirmed by direct probe. The test still exits nonzero so it fails loud — the defect is that the failure surfaces as a Python traceback rather than the named message, which is the opposite of the 'ghim đúng thông điệp' invariant the file enforces everywhere else. Fix: build `hoi_thoai` only from rows that already passed the 3-cell check.
  source: bugs

## Chưa adversarial-verify (refuter chết)

(rỗng — không có finding nào với unverified=true ở vòng chấm này.)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
