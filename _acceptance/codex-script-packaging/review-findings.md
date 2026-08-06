# Review Findings: codex-script-packaging (round 1)

## Trong hợp đồng

### 1. E5 ships without the positive control AC-5 promises — the "gói mất file" leg is never proven able to go ĐỎ
- file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh:7161`
- severity: high
- source: conventions
- AC: AC-5

CLAUDE.md's core invariant ("Assertion âm-tính-một-mình là assertion không sống" + the ritual "phá thử một lần cho mỗi phép đo mới") and AC-5 itself both require a control: "đối chứng: bỏ một dòng chép trong hàm dựng → ĐỎ nêu file bị mất" (contract.md AC-5; evals.yaml E5 repeats it as "bỏ một dòng chép trong bản sao hàm dựng → ĐỎ đúng file mất"). The E5 block (lines 7161-7201) never invokes scripts/sync-plugin-packages.sh at all — it only diffs `git ls-tree` at BASE against the current working tree. There is no copy-tree + remove-an-rsync-line + rebuild mutant anywhere in P162 (`grep sync-plugin-packages` inside the P162 heredoc returns 0 hits). Every other leg of P162 carries its mutant (E3 has clean-control + 2 positive + 1 negative; E4 runs the tool for real), so this is the one leg that is assertion-only.

Second, weaker deviation in the same block: AC-5's other control is "đổi mã commit trong BẢN SAO sổ thành mã không tồn tại → phải ĐỎ đúng thông điệp không-lấy-được-bản-cũ". Line 7201 instead calls `pkg_files_at("0"*40)` directly and asserts it returns None — it bypasses the decisions.jsonl reading path and never exercises the assertion message, so a regression in the `base = <sha>` extraction (lines 7162-7170) or in the fail-closed assert at 7192-7194 would not be caught.

Verified externally that the comparison itself does work for base-era files (patching `now_map["feature-loop-codex"].discard("scripts/resolve-plugin.mjs")` into a copy of the block makes it fail with `goi feature-loop-codex MAT 1 file so voi moc, vd ['scripts/resolve-plugin.mjs']`), so this is a missing-proof gap rather than a broken measure — but it is exactly the gap the repo's invariant exists to prevent.

Worth noting the blind spot the missing control would have exposed: BASE is 9952405, taken *before* carry-plan.mjs entered the mirror, so E5 cannot catch a regression that drops the newly added `rsync .../carry-plan.mjs` line. Only E1's `assert "carry-plan.mjs" in files_in("feature-loop-codex")` covers that, and E1 reads the committed tree rather than a rebuild.

AC rationale: AC-5 tự khai rõ đối chứng dương "bỏ một dòng chép trong hàm dựng → ĐỎ nêu file bị mất", và finding xác nhận đối chứng này không tồn tại trong khối đo.

### 2. E6 does not measure what AC-6 promises: no negative case, and the anchor path is a hardcoded literal never tied to where P162 actually lives
- file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh:7213`
- severity: high
- source: conventions
- AC: AC-6

AC-6 promises "ca âm: đổi tên tệp chốt trong bản sao cây thì lưới phải ĐỎ (chốt nằm ngoài đường quét thì lần thêm công cụ kế tiếp lại không có gì đỏ)", and E6's expected field repeats it. The E6 block (lines 7203-7214) has no mutant, no copy-tree, no negative case at all — it reads config, resolves commands, and does one string containment assert.

The assert is:

    here = "tests/plugins/run-tests.sh"
    assert any(here in c for c in resolved), ...

`here` is a hardcoded literal, not derived from where the check actually sits. Nothing in E6 establishes that P162 lives in that file. Move the P162 block into a new helper (e.g. tests/plugins/codex-packaging.sh) that the grid never invokes, and E6 stays GREEN because tests/plugins/run-tests.sh is still listed in feature_loop.suite_keys — which is precisely the false-green gap-probe P2 named ("Chốt mới viết vào chỗ nằm ngoài đường quét của lưới: 6 lệnh cũ vẫn xanh nên E6 XANH"). The hardcode also violates the s4-scope-triage rule in CLAUDE.md: "mọi đường dẫn trong test/script sinh fixture phải suy từ vị trí script, không hardcode" (shape 4 of the four already stepped on).

This is the same class as finding 1 but with a live false-green rather than just a missing proof: the leg whose whole job is "the new chốt is inside the standing grid" cannot distinguish that from "some file with this name is inside the grid".

AC rationale: AC-6 khai rõ ca âm "đổi tên tệp chốt trong bản sao cây thì lưới phải ĐỎ" và yêu cầu chốt thật sự nằm trong lưới thường trực; finding cho thấy cả hai vắng mặt.

### 3. E2's instruction scan covers only SKILL.md, narrower than AC-2's "mọi chỉ dẫn của mọi gói Codex"
- file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh:7053`
- severity: medium
- source: conventions
- AC: AC-2

AC-2 reads "Given mọi chỉ dẫn của mọi gói Codex" and E2's expected says "TẤT CẢ chỉ dẫn của 3 gói Codex thật". The implementation globs one fixed shape:

    for sk in sorted(pathlib.Path(codex_dir).glob("*/skills/*/SKILL.md")):

The codex/ tree contains other surfaces Codex reads as instructions: `*/skills/*/agents/openai.yaml`, `feature-loop-codex/agent-templates/*.toml` (6 role personas), `*/skills/*/references/*`, and the package README.md files. None are scanned. Because the E2 assert is set-equality against the DECLARED table, a `${PLUGIN_ROOT}/scripts/foo.mjs` reference added to an agent template or an openai.yaml is neither reported as `extra` nor checked for a dead pointer — it is simply invisible, which reopens the exact class the feature exists to close ("thêm công cụ mới vào chỉ dẫn mà quên chép thì hôm nay không gì đỏ").

The guard that was written against this (lines 7098-7101, `PKGS <= scanned_pkgs`) only proves all three package *names* appear; it says nothing about file types, so it cannot detect the glob missing a whole surface. Today no non-SKILL.md file in codex/ carries a self-script ref, so this is a live scope hole rather than a live dead pointer. Note the mutant matrix in E3 inherits the same blind spot: all three probes inject into a SKILL.md, so a broken non-SKILL branch would never show.

AC rationale: AC-2 hứa quét "mọi chỉ dẫn của mọi gói Codex"; finding cho thấy các dạng chỉ dẫn khác ngoài SKILL.md hoàn toàn không được quét, thu hẹp lời hứa toàn phần.

### 4. P162 E2 scans the codex/ overlay, not the built package — 4 of 12 shipped acceptance-gate instruction files are never checked
- file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh:7061`
- severity: high
- source: bugs
- AC: AC-2

`CODEX = root / "codex"` + `extract()` globs `*/skills/*/SKILL.md` under the OVERLAY source. But `build_acceptance()` rsyncs `$ROOT/skills/` into the Codex package first and only then overlays `codex/acceptance-gate`, so the shipped package carries 12 SKILL.md while `codex/acceptance-gate` has 8. Verified unscanned but shipped: plugins/acceptance-gate/skills/{design-pass,morphological-scan,uat-session,ux-ui-craft}/SKILL.md. Adding `node ${PLUGIN_ROOT}/scripts/whatever.mjs` to any of those four produces NO red, which is precisely the class AC-2 claims to close ("chỉ dẫn của MỌI gói Codex") and contradicts the eval's own rule that measurement runs on the built package (E1 does; E2 does not). The coverage assert `PKGS <= scanned_pkgs` (line 7073) only compares at package granularity, so it reports full coverage while file coverage is 15/19 — the "đếm rồi vứt / bộ đếm làm thước phạm vi" defect the contract explicitly forbids. Fix: extract from `plugins/*/skills/**/SKILL.md` (the built mirror), and assert the scanned file SET against a pinned list, not just the package set.

AC rationale: AC-2 đòi tập tệp chỉ dẫn đã quét phải phủ cả ba gói Codex đối chiếu danh sách viết trước; finding cho thấy 4/12 tệp chỉ dẫn thật sự được giao (từ mirror đồng bộ) nằm ngoài vùng quét.

### 5. E4's "independent" expected set uses a different rule than plan() — false red waiting on the next workspace
- file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh:7151`
- severity: medium
- source: bugs
- AC: AC-4

The set claimed to be computed independently diverges from the tool's contract in three ways: (a) `with_paths` keeps only blocks containing `executor: test`, while plan() carries every executor except `judgment` — a green `script`/`ui-check` eval with `paths:` lands in `got` but not `expect`; (b) `green_last = {e["evalId"] for e in ok_lines}` accepts ANY green line in the round, while plan() builds `lastOfPrev` last-line-wins — an eval that ran green then red in the same round is carried by the test's expectation and rerun by the tool; (c) `blocks = re.split(r"\n(?=  - id: )")` hardcodes exactly two spaces of indent, while parseEvals accepts any indent. The fixture is whichever `_acceptance/` dir sorts first and matches (today `card-text-fidelity`), so a newly added workspace can silently become the fixture and flip this equality with no product defect. Line 7151 also assigns `with_paths` once and immediately overwrites it on 7153 — the first regex is dead.

AC rationale: AC-4 đòi tập mã-hạng-mục mang-sang BẰNG ĐÚNG tập đủ điều kiện tính độc lập theo đúng quan hệ của công cụ, không phải một luật tự dựng khác đi; finding cho thấy luật tự dựng lệch khỏi luật thật.

### 6. Tuyên quét LỚP nhưng corpus là thư mục NGUỒN, không phải chỉ dẫn của GÓI ĐÃ DỰNG — 4/12 chỉ dẫn shipped nằm ngoài đường quét
- file: `tests/plugins/run-tests.sh:7053`
- severity: high
- source: measurement
- AC: AC-2

Hình dạng 5 (+1). extract() chỉ duyệt pathlib.Path(codex_dir).glob("*/skills/*/SKILL.md") với codex_dir = root/"codex", tức CHỈ lớp overlay nguồn. Nhưng gói Codex đã dựng lấy chỉ dẫn từ nhiều nguồn: scripts/sync-plugin-packages.sh:42 rsync cả $ROOT/skills/ vào plugins/acceptance-gate/skills/, nên gói shipped có 12 skill trong khi codex/acceptance-gate/skills/ chỉ có 8. Bốn tệp plugins/acceptance-gate/skills/{design-pass,morphological-scan,uat-session,ux-ui-craft}/SKILL.md — cùng README.md/GUIDE.md/QUICKSTART.md (sync line 47-48) — KHÔNG BAO GIỜ được đọc. Hệ quả cụ thể: thêm ${PLUGIN_ROOT}/scripts/newtool.mjs vào skills/design-pass/SKILL.md sẽ ship một con trỏ chết trong gói Codex mà P162 vẫn xanh — đúng lớp lỗi mà feature này tuyên đóng. Cả hai assert đóng vai thước phạm vi đều vô hiệu trên phần khuất: `assert not extra` (thừa đỏ) chỉ so trên tập overlay, và `assert PKGS <= scanned_pkgs` (line 7073) chỉ đòi 3 tên gói xuất hiện — nó xanh ngay cả khi mỗi gói mới quét được 1 tệp. Đối chiếu evals.yaml E2 ("TẤT CẢ chỉ dẫn của 3 gói Codex thật") và AC-2 ("Given mọi chỉ dẫn của mọi gói Codex"): lời hứa là toàn phần, phép đo là tập con, và chưa có ma trận viết-trước liệt kê tệp chỉ dẫn shipped để đối chiếu.

AC rationale: Cùng nội dung với finding #4 (tiếng Anh tương ứng): AC-2 đòi tập tệp chỉ dẫn đã quét phủ cả ba gói và đối chiếu danh sách viết trước; 4 tệp chỉ dẫn shipped thật sự nằm ngoài vùng quét.

### 7. Không đối chứng dương cho chân bắt MẤT FILE của E5 — đối chứng đã khai trong AC-5 vắng mặt
- file: `tests/plugins/run-tests.sh:7198`
- severity: high
- source: measurement
- AC: AC-5

Hình dạng 4. Assert lõi của AC-5 là `assert not lost, "goi %s MAT %d file so voi moc..."` (line 7196-7198). AC-5 và evals.yaml E5 khai rõ hai đối chứng: (a) "bỏ một dòng chép trong bản sao hàm dựng → ĐỎ đúng file mất"; (b) "đổi mã commit trong BẢN SAO sổ thành mã không tồn tại → ĐỎ đúng thông điệp không-lấy-được-bản-cũ". Trong code chỉ có (b) ở dạng rút gọn — `assert pkg_files_at("0"*40) is None` (line 7201) — và nó chỉ chứng minh HÀM TRA CỨU trả None cho rev bịa, không đi qua đường đọc sổ decisions.jsonl lẫn thông điệp assert thật. Đối chứng (a) không tồn tại ở bất kỳ dòng nào của khối P162: không có tempfile/cp nào dựng bản sao rồi xoá một file khỏi mirror để chứng minh nhánh `lost` biết ĐỎ. Khác hẳn E3 (line 7112-7130) nơi mẫu probe/đối-chứng-dương được làm đầy đủ — cho thấy khoảng trống này là bỏ sót chứ không phải cố ý. Vì base_map lấy từ `git ls-tree` còn now_map lấy từ rglob trên cây làm việc, một lệch chuẩn hoá đường dẫn (hoặc MIRROR/tên gói đổi) sẽ chỉ làm nó đỏ-oan hoặc xanh-oan tuỳ hướng, mà chưa lần nào phép đo được chứng minh đỏ đúng chỗ.

AC rationale: Trùng nội dung với finding #1 về E5: AC-5 tự khai đối chứng dương "bỏ một dòng chép → ĐỎ nêu file mất" và đối chứng này không tồn tại trong phép đo.

### 8. E6 đo CHỈ DẪN (text của config.yaml) thay vì đầu ra — không có ca âm chứng minh lưới biết đỏ
- file: `tests/plugins/run-tests.sh:7214`
- severity: high
- source: measurement
- AC: AC-6

Hình dạng 1 (+4). AC-6 hứa "chốt quan hệ mới thật sự nằm trong lưới thường trực — ca âm: đổi tên tệp chốt trong bản sao cây thì lưới phải ĐỎ". Cái được thi hành là `assert any(here in c for c in resolved)` với here = "tests/plugins/run-tests.sh" (line 7213-7215): đọc _acceptance/config.yaml, regex lấy vài chuỗi lệnh, rồi kiểm một chuỗi con có mặt trong đó. Không dòng nào chạy lưới, không dòng nào quan sát đầu ra của lưới, và ca âm đã khai (bản sao cây + đổi tên tệp chốt) hoàn toàn vắng mặt. E6 trong evals.yaml còn hứa thêm "tất cả xanh" cho danh sách lệnh đọc từ feature_loop.suite_keys — không lệnh nào trong `resolved` được thực thi. Đây đúng nghĩa grep tệp khai báo trong khi vật cần đo là hành vi thực thi; nó vẫn xanh nếu khối P162 bị đặt sau một exit sớm, bị đổi tên, hoặc bị lệch khỏi đường quét của lưới.

AC rationale: Trùng nội dung với finding #2 về E6: AC-6 khai rõ ca âm đổi tên tệp chốt phải làm lưới ĐỎ, và ca âm này vắng mặt hoàn toàn trong phép đo.

### 9. Tập kỳ vọng của E4 dựng bằng luật KHÁC luật trong lời hứa (executor: test vs. !== judgment)
- file: `tests/plugins/run-tests.sh:7154`
- severity: low
- source: measurement
- AC: AC-4

Hình dạng 3 (biến thể). E4/AC-4 hứa "tập mã-hạng-mục mang-sang BẰNG ĐÚNG tập ĐỦ ĐIỀU KIỆN tính độc lập từ hồ sơ đó". Tập kỳ vọng được dựng là with_paths = {id của block có "paths:" và "executor: test"} (line 7152-7154), rồi expect = with_paths & green_last (line 7156). Nhưng luật đủ-điều-kiện của vật được đo là `parseEvals(evalsText).filter(e => e.executor !== 'judgment')` trong plugins/feature-loop-codex/scripts/carry-plan.mjs — tức bao gồm cả executor script và ui-check, và còn có luật atomic-pair cross-layer (AC-9) loại bớt phần tử khỏi carried. Hai luật này chỉ trùng nhau trên hồ sơ được chọn (card-text-fidelity, 12/12). Hệ quả: nếu carry-plan hồi quy theo hướng bỏ carry cho executor script/ui-check, hoặc bỏ luật atomic-pair, `got == expect` vẫn xanh. Thêm nữa vòng chọn hồ sơ ở line 7135-7147 lấy hồ sơ ĐẦU TIÊN thoả điều kiện theo thứ tự sorted(), nên đối tượng đo có thể tự đổi khi thêm workspace mới mà không ai chủ ý.

AC rationale: Trùng nội dung với finding #5 về E4: AC-4 đòi tập mã-hạng-mục mang-sang bằng đúng quan hệ thật của công cụ, còn tập kỳ vọng ở đây dùng luật lọc khác đi.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **E6's config resolver matches suite keys by leaf name anywhere in the file and silently drops unresolvable keys**
  Người dùng thấy gì: Nếu sau này có thêm một mục cấu hình trùng tên ở nhánh khác, việc kiểm tra có thể âm thầm đổi sang xét nhầm mục — hoặc một mục cấu hình bị xoá cũng không có cảnh báo — khiến người xem tưởng mọi thứ vẫn được kiểm đầy đủ.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Dead/overwritten code inside the new P162 block**
  Người dùng thấy gì: Không ảnh hưởng tới người dùng — đây chỉ là phần mã thừa bên trong công cụ kiểm nội bộ, khiến việc bảo trì về sau khó hơn một chút nhưng không đổi kết quả kiểm hiện tại.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **E4 parses every workspace run-log with bare json.loads — one malformed line anywhere aborts the whole guard**
  Người dùng thấy gì: Nếu một tính năng khác không liên quan có một dòng nhật ký ghi hỏng, việc kiểm tính năng này có thể báo lỗi ở sai chỗ, khiến người xem mất thời gian tìm nhầm nguyên nhân.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **E4 never asserts anchorSha — the value it computes for that purpose is unused**
  Người dùng thấy gì: Nếu công cụ ghim nhầm điểm mốc khi mang kết quả sang vòng sau, phép kiểm hiện tại sẽ không phát hiện — kết quả của vòng trước có thể bị mang sang dựa trên mốc sai mà không có cảnh báo nào.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **E6 resolves config keys by last path segment only and silently drops keys that fail to resolve**
  Người dùng thấy gì: Nếu sau này có thêm một mục cấu hình trùng tên ở nhánh khác, việc kiểm tra có thể âm thầm đổi sang xét nhầm mục, hoặc một mục cấu hình biến mất mà không có cảnh báo nào.
  file: `/Users/manhphan/dev/acceptance-gate-kit/tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Rút lệnh từ config bằng tên khoá LÁ — quan hệ đường-khoá bị thay bằng phép tìm chuỗi**
  Người dùng thấy gì: Nếu sau này có thêm một mục cấu hình trùng tên ở nhánh khác, việc kiểm tra có thể âm thầm xét nhầm mục, hoặc một mục cấu hình biến mất mà không ai được cảnh báo.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
