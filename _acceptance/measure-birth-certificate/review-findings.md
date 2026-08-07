## Trong hợp đồng

- **P177 negative branch trusts exit code alone, violating the pinned-message half of the repo's assertion invariant**
  file: `tests/plugins/run-tests.sh:8799`
  severity: medium
  AC: AC-8
  detail: CLAUDE.md's invariant says every case that concludes from "exit khác 0" MUST have both (a) a positive control AND (b) the exact expected message pinned, "không chỉ mã thoát". P177's second mutant (resolver run with --root pointing at an empty temp dir) asserts only `r2.returncode != 0` with no message pin, even though resolve-plugin.mjs emits a distinctive, pinnable message ("--root \"...\" does not carry skills/acceptance/references/measure-birth.md" — verified live). Failure scenario: the empty temp dir also lacks plugin markers, so the resolver can exit non-zero on an earlier, unrelated check (e.g. "not a plugin root") without ever exercising the --require missing-file path; the guarantee the mutant claims to prove ("a tree missing the file must fail rather than fall back to an outside root") could silently disappear in a resolver refactor while P177 stays green. Every other MBC mutant in this block pins its message; this is the one exception — inside the very feature that codifies the rule — and P182's self-check cannot catch it because it only requires the MUTANT-OK marker to exist, not that each mutant pins a message.
  source: conventions

- **Hình dạng 2 — fixture viết tay đúng khuôn bên đọc: 4 artifact hanh-vi-*.md và dấu "hoàn thành: có" không do code nào sinh, dù AC-5 hứa "do make-record.mjs ghi trong chính lần chạy"**
  file: `tests/plugins/run-tests.sh:8824`
  severity: high
  AC: AC-5
  detail: P178 (E5) có hai đường: ĐƯỜNG 1 round-trip chỉ phủ 5 file trong GEN (4 chi-dan-*.md + de-bai.md — đúng là make-record.mjs sinh, dòng ~8810-8813); ĐƯỜNG 2 scanner scan() đọc các artifact bài-làm hanh-vi-A1/A2/B1/B2.md bằng 3 khoá: "hoàn thành: có" (dòng 8824), regex "grep -q .missing slug", regex derivation grep -v/sed. Nhưng make-record.mjs (dòng 42-72) KHÔNG ghi file hanh-vi nào và không ghi dấu hoàn-thành — các transcript này là file commit tay (header "· hoàn thành: có" là metadata người chấm viết vào cho khớp scanner), trong khi contract AC-5 hứa nguyên văn "artifact bài-làm khác rỗng + dấu hoàn-thành do make-record.mjs ghi trong chính lần chạy" và "round-trip record↔nguồn (không fixture viết tay)". Seam LLM-viết→máy-đọc này không có khuôn một-chỗ-có-marker phía writer và không có round-trip rút-từ-writer: bên VIẾT (người/agent chấm ghi header) và bên ĐỌC (scan() P178) chỉ khớp nhau vì cùng một người viết cả hai lúc authoring — đúng hình dạng (3) của luật CLAUDE.md. Điểm giảm nhẹ: lệch khuôn sau này sẽ fail-closed ("thieu dau hoan-thanh") chứ không xanh giả, nhưng phép đo hành-vi cốt lõi của E5 vẫn đứng trên vật không code path nào tái sinh được.
  source: measurement

- **Hình dạng 4 — assertion âm-tính không ghim thông điệp: nhánh resolver-trên-cây-thiếu của P177 chỉ kiểm exit != 0**
  file: `tests/plugins/run-tests.sh:8799`
  severity: medium
  AC: AC-8
  detail: P177 (E4) chạy resolve-plugin.mjs trên TemporaryDirectory rỗng rồi chỉ assert `r2.returncode != 0` — không ghim chuỗi lỗi nào từ stderr. Đối chứng dương có (r trên cây thật đã xanh ở đầu case, loại được exit 127/node vắng), nhưng thiếu vế (b) của luật "assertion âm-tính-một-mình": resolver fail vì BẤT KỲ lý do gì (cãi cờ --root, lỗi cú pháp arg, crash khác) cũng cho cùng màu xanh, nên case không phân biệt được "resolver từ chối trả gốc ngoài cây khi thiếu file" (điều E4 hứa: chặn hình dạng đọc-bản-lành-từ-plugin-đã-cài) với "resolver chết vì lý do không liên quan". Mọi mutant khác trong chính block P174–P182 đều ghim thông điệp qua measure() — riêng nhánh này là exit-code-alone.
  source: measurement

- **Hình dạng 3 — assert chuỗi có mặt thay cho quan hệ: P175 quy "hai bản mang cùng mệnh đề" (AC-2) về so MỘT dòng comment neo, tìm trên toàn file thay vì trong khối**
  file: `tests/plugins/run-tests.sh:8728`
  severity: medium
  AC: AC-2
  detail: AC-2 hứa quan hệ "so khối giữa mốc của hai bản chỉ dẫn... hai bản mang cùng mệnh đề". measure() của P175 chỉ regex-search dòng `<!-- MBC-CORE:...-->` trên TOÀN VĂN mỗi SKILL (dòng 8728) — không bóc text giữa cặp mốc MEASURE-BIRTH-CLAUSE — rồi fullmatch với CANON (khiến phép so anchors['claude'] != anchors['codex'] thành thừa). Hệ quả kiểm được bằng mắt trong code: (a) thân mệnh đề tiếng Anh phía Codex có thể mất/đổi bất kỳ thành phần nào ("No pair = NOT done", "PINNED MESSAGE"...) mà P175 vẫn xanh miễn dòng neo còn nguyên — và không case nào khác kiểm thành phần thân khối phía Codex (P174 chỉ đọc SKILL Claude, P176 chỉ kiểm con trỏ S1); (b) dòng neo nằm NGOÀI cặp mốc ở bất kỳ đâu trong file cũng thoả. Mutant của P175 chỉ phá đúng chuỗi trong dòng neo ("not-done-without-pair"→"optional-pair") nên không chứng minh được phép đo gắn vào mệnh đề thật — nó gắn vào dòng comment tóm tắt.
  source: measurement

- **P179 mutant e4 silently assumes ledger row count exactly equals corpus count**
  file: `tests/plugins/run-tests.sh:8920`
  severity: low
  AC: AC-6
  detail: The measured invariant is `ledger rows >= corpus count` (line 8887), but the break-it branch `e4 = measure('\n'.join(lines[:-1]), known)` only turns red because today rows == corpus exactly (verified: 107 == 107). The ledger is allowed by the invariant to be a strict superset (a row added directly, or a review-findings.md archived/removed shrinking the corpus). In any such legitimate state, removing one row still satisfies >=, e4 stays green, and the case fails with the misleading message "mutant xoa dong khong do quan he >=" — reporting the measure as broken when the fixture assumption is what broke. Fix shape: derive the mutant from the measured relation (drop `len(rows) - known + 1` rows, or drop rows down to `known - 1`) instead of dropping exactly one. Everything else in the range checked out: all P174–P182 pass at HEAD in a clean worktree with positive controls and pinned-message mutants; make-record.mjs exits 2 (no silent fallback) on missing MEASURE-BIRTH-CLAUSE markers or unmatched S3 section; P178's round-trip is anchored to the committed evidence; P177's resolver check correctly asserts in-tree root and fail-on-missing-file.
  source: bugs

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

<<<OOC-ITEM-TEMPLATE
- **Dead variable SRC in P182**
  Người dùng thấy gì: Có một chỗ thiết lập dư thừa trong bộ kiểm nội bộ, không dùng đến ở đâu cả. Không ảnh hưởng gì tới người dùng hay tính năng, chỉ là việc dọn dẹp có thể để dành cho lần sau.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits
OOC-ITEM-TEMPLATE>>>

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).