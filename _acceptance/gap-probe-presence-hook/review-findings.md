# Review Findings: gap-probe-presence-hook (round 2)

Informational — nằm NGOÀI phạm vi acceptance-evidence-gate hook (hook chỉ đọc
`evidence-report.md`/`contract.md`). File này liệt kê các finding đã qua
**adversarial-verify** (refuter đã chạy và xác nhận, không chỉ heuristic một
lượt) trên diff của feature `gap-probe-presence-hook` tính tới
`verified_commit: ead1c847635a93772475168b9266e0b0e23bf2e9`, dùng để nạp cho
`evidence-page.js` (bảng "Review findings") và cho human đọc tại Gate 2. File
này GHI ĐÈ nội dung findings của round trước; lịch sử round nằm ở
`evidence-report.md` § Iterations.

8/8 finding dưới đây đều đã adversarial-verify thành công (không có finding
nào gắn `unverified: true`). Sắp xếp severity giảm dần.

## High severity (2)

### 1. Invariant 4 (`.out-of-scope`) — thư mục không tồn tại; đề xuất guard write-time bị từ chối không có file "Prior requests"

- title: Invariant 4 (.out-of-scope) — thư mục không tồn tại; đề xuất guard write-time bị từ chối không có file "Prior requests"
  file: .out-of-scope/
  line: —
  severity: high
  source: invariants
  detail: |
    `ls -a` ở repo root: không có `.out-of-scope/`. Grep toàn repo cho
    `.out-of-scope` chỉ ra 2 nơi: CLAUDE.md:21 (chính invariant) và
    docs/research/2026-07-25-mattpocock-skills-teardown.md:252/410/577 (bài
    học #4 đề xuất cơ chế) — cơ chế được codify nhưng chưa từng được dùng.

    Ứng viên rõ ràng nhất nằm ngay trong diff này: guard gap-probe
    write-time (contract v1, 3 vòng S4, ~69 agent / ~5.4M token) đã bị TỪ
    CHỐI ở 8ac4ce6 vì lý do kiến trúc. Đây là đề xuất có nguy cơ quay lại
    cao nhất — nó từng LÀ thiết kế gốc của cả feature, và người đọc code sau
    này thấy pre-merge làm việc mà hook không làm sẽ tự nhiên đề nghị "đưa
    lại vào hook". Không có file `.out-of-scope/` nào ghi hai lý do bác (hạ
    risk_tier trong chính lần ghi → exit 0 stderr rỗng; nửa "nhắc" chạy trên
    kênh stderr mà hợp đồng PreToolUse loại bỏ) kèm mục "Prior requests".

### 2. Section scan vẫn cắt tại dòng `#`/H1 — răng cross-layer và lint W1/W3/W4/W5 lặng lẽ thấy 0 AC

- title: Section scan still truncates on `#`/H1 lines — cross-layer teeth and lint W1/W3/W4/W5 silently see zero ACs
  file: scripts/pre-merge-check.sh
  line: 311
  severity: high
  source: bugs
  detail: |
    Bản vá wave-2 trong diff này chỉ dạy cho section scanner biết một
    heading SÂU HƠN (`###`) là nội dung. Một heading CÙNG-hoặc-nông-hơn vẫn
    kết thúc section — và cả hai scanner coi một dòng `# ...` trơn là
    heading như vậy.

    - pre-merge awk: `/^#/ && !/^###/ {insec=0}` (scripts/pre-merge-check.sh:311)
    - lint: `const h = line.match(/^(#{1,6})\s/)` … `if (inSec && h[1].length <= secLevel) inSec = false` (scripts/eval-coverage-lint.js:66-69)

    Trong khi đó scripts/gate-card.js:92 và scripts/evidence-page.js:44 dùng
    `^(#{2,6})\s`, nên một dòng `#` là NỘI DUNG ở đó — comment của chính
    gate-card còn nói rõ ý định đó ("a leading '# guidance' comment inside a
    section is content, never a boundary"). Ba parser giờ bất đồng về nơi
    `## Criteria` kết thúc.

    Repro đã xác minh (contract với `# guidance: ...` là dòng đầu dưới
    `## Criteria`, theo sau bởi `- AC-1: ... (cross-layer)` chỉ ghép với
    `layer: ui-observable`):
      * awk không phát ra gì -> không có
        `VIOLATION [slug]: AC-1 is tagged (cross-layer)...`, merge được cho qua
      * `node scripts/eval-coverage-lint.js` -> không có cảnh báo W4
      * `node scripts/gate-card.js --extract` -> `will_do: ['AC-1']`, tức
        human duyệt một card liệt kê AC-1 trong khi răng merge-boundary
        đang tắt

    Repro thứ hai đã xác minh: `# lưu ý chung` ở giữa Criteria làm rơi AC-2
    (và mọi thứ sau nó) khỏi cả awk lẫn lint trong khi card vẫn hiển thị nó.
    `#!/usr/bin/env bash` trong một fenced block ở Criteria trúng awk nhưng
    không trúng lint — một điểm bất đồng khác.

    Đây chính xác là false-green mà comment của khối này tuyên bố tồn tại
    để chặn ("teeth silently off"). Cùng code này lặp lại trong mirror sinh
    ra: plugins/acceptance-gate/scripts/pre-merge-check.sh và
    plugins/acceptance-gate/scripts/eval-coverage-lint.js.

## Medium severity (4)

### 3. Invariant 1 — 9 commit sau khi CLAUDE.md ra đời sửa nguồn mà không commit mirror `plugins/` cùng lượt

- title: Invariant 1 (mirror cùng lượt) — 9 commit sau CLAUDE.md sửa nguồn mà không commit plugins/ mirror trong cùng lượt
  file: plugins/acceptance-gate/
  line: —
  severity: medium
  source: invariants
  detail: |
    Invariant nói "sửa nguồn xong PHẢI chạy sync và commit mirror cùng
    lượt". HEAD hiện in sync (P30 xanh) nên end-state ổn, nhưng kiểm từng
    commit (checkout vào worktree rời, chạy sync, đếm `git status --
    plugins`) cho thấy mirror ĐANG drift tại 9 commit nằm SAU 0a1110a —
    commit tạo ra chính CLAUDE.md: 852edc5 (hooks/acceptance-evidence-gate.js
    + lib/evidence-core.js, 2 file drift), 6164be0 (2), 34ee656 (2), f7b8f72
    (2), 8c593df (scripts/pre-merge-check.sh, 1), cd1ae63 (1), 2e07374 (1),
    70ceb28 (1), 6726213 (lib/gap-probe.js chưa có trong mirror, ??
    untracked).

    Hệ quả cụ thể: .github/workflows/gate.yml (thêm ở 89f7f95, chạy
    `on: push: branches: [main]`) gọi tests/plugins/run-tests.sh → P30
    `sync-plugin-packages.sh --check` sẽ ĐỎ tại từng commit trong số đó; và
    bất kỳ ai bisect/checkout một trong 9 commit này sẽ chạy plugin bằng mã
    cũ. 7 commit khác trước 0a1110a (1d47ba8, 98aa57e, 63da4e4, 7f4e28c,
    46adeee, 2a57caa, 26fbbf2) cũng drift nhưng có trước khi invariant tồn
    tại.

### 4. Invariant 4 (ADR) — sàn fail-CLOSED của `gap_probe: required` không có ADR

- title: Invariant 4 (ADR) — sàn fail-CLOSED của gap_probe: required không có ADR
  file: scripts/pre-merge-check.sh
  line: —
  severity: medium
  source: invariants
  detail: |
    Commit 3784266 (ledger d-128: "mode required có SÀN fail-CLOSED: không
    cưỡng chế được (thiếu node/lib/--base, git diff lỗi) = VIOLATION, kèm
    marker máy-đọc GAP-PROBE: NOT ENFORCED") đổi ngữ nghĩa của "không xác
    định được phạm vi" từ bỏ-qua-kèm-NOTE thành chặn-merge. Ba điều kiện:
    (a) khó đảo — đã ghim bằng test GPM18a/b/c + GPM19a-f và bằng posture
    `gap_probe: required` trong _acceptance/config.yaml của chính kit; (b)
    gây bất ngờ — nó lập tức làm job `gate` trên push đỏ vĩnh viễn, phải vá
    bằng commit riêng ead1c84 ("gate job luôn truyền base — sàn fail-closed
    làm job push đỏ vĩnh viễn"); (c) trade-off thật — fail-closed chống
    fail-open im lặng, đổi lấy việc mọi lối gọi thiếu --base thành lỗi
    cứng. Không có ADR nào trong docs/adr/. Lý do hiện chỉ sống trong
    comment của _acceptance/config.yaml và .github/workflows/gate.yml — cả
    hai là artifact của repo kit, không phải hồ sơ quyết định của kit.

### 5. Gate-1 card báo "không có thay đổi glossary" khi CONTEXT.md untracked — git thoát 0 với diff rỗng

- title: Gate-1 card claims "no glossary changes" when CONTEXT.md is untracked — git exits 0 with empty diff
  file: scripts/gate-card.js
  line: 72
  severity: medium
  source: bugs
  detail: |
    `git diff <base> -- CONTEXT.md` không báo gì cho một file UNTRACKED và
    thoát 0. Catch ở dòng 76 không bao giờ kích hoạt, nên `glossaryDelta`
    thành `[]` và dòng 230 đẩy ra flag trấn an: "Từ vựng: feature này không
    thêm/sửa term nào trong CONTEXT.md."

    Đã xác minh: git repo mới, một commit, rồi ghi CONTEXT.md (untracked)
    với một term `**Order**:` hoàn toàn mới kèm `_Avoid_`, và một contract
    dùng từ bị tránh:
      node scripts/gate-card.js --root . --slug f1 --gate 1 --glossary-base <sha>
      -> "Từ vựng: feature này không thêm/sửa term nào trong CONTEXT.md."
      --extract -> {'present': True, 'computed': True, 'error': None, 'terms': []}

    Đây là case feature-đầu-tiên: chính lần chạy giới thiệu glossary lại là
    lần báo cáo nó rỗng. Flag git-failed của chính card (dòng 232) nói rõ
    "đừng coi là 'không có thay đổi'" — nhưng cảnh báo đó không thể kích
    hoạt ở đây, vì git đã thành công. Một diff rỗng phải được phân biệt với
    CONTEXT.md chưa versioned/không có trong base (vd kiểm
    `git ls-files --error-unmatch CONTEXT.md`, hoặc
    `git cat-file -e <base>:CONTEXT.md` và coi "not in base" là toàn bộ
    dòng đều added).

### 6. gate-card lặng lẽ không render block vocabulary nào khi thiếu `lib/context-glossary.js`

- title: gate-card silently renders no vocabulary block at all when lib/context-glossary.js is missing
  file: scripts/gate-card.js
  line: 63
  severity: medium
  source: bugs
  detail: |
    `try { glossaryLib = require(.../lib/context-glossary.js) } catch (_) {}`
    nuốt lỗi. Khi lib vắng mặt, `glossaryPresent` vẫn true nhưng toàn bộ
    khối `if (glossaryPresent && glossaryLib)` ở dòng 68 bị bỏ qua, nên
    `glossaryDelta` giữ null VÀ `glossaryDeltaErr` cũng giữ null — không
    flag nào trong 3 flag ở dòng 230/231/232 kích hoạt. Card không in gì về
    vocabulary, mà human đọc thành "không có thay đổi term".

    Đã xác minh: copy scripts/gate-card.js + lib/gap-probe.js vào một cây
    KHÔNG có lib/context-glossary.js, chạy trên repo có CONTEXT.md và
    --glossary-base:
      HTML output -> 0 dòng "Từ vựng"
      --extract   -> glossary_delta: {'present': True, 'computed': False, 'error': None, 'terms': []}

    Kênh lỗi đã tồn tại sẵn ('no-base', 'git-failed') và
    pre-merge-check.sh xử lý case anh em của nó rất to ("thiếu $GP_LIB
    (mang cổng vào repo phải copy CẢ lib/)"). Nên thêm lỗi 'no-lib' để card
    nói vocabulary chưa được tính thay vì im lặng. Ghi chú: gate-card
    require lib/gap-probe.js vô điều kiện (dòng 32) nhưng context-glossary
    thì optional — xử lý không nhất quán cùng một hazard "copy cả lib/".

## Low severity (2)

### 7. Invariant 2 (glossary) — sweep `_Avoid_` chưa quét hết: "CI gate" còn ở 4 bề mặt authoring

- title: Invariant 2 (glossary) — sweep _Avoid_ chưa quét hết: 'CI gate' còn ở 4 bề mặt authoring
  file: scripts/pre-merge-check.sh
  line: —
  severity: low
  source: invariants
  detail: |
    CONTEXT.md:59-64 quy định máy móc không phải Gate — CI gọi là
    "pre-merge check", và liệt "evidence gate, merge gate, quality gate"
    vào _Avoid_. Commit a7530a3 trong diff này tuyên bố đã sweep ("hook/CI
    không gọi là 'gate'") nhưng bỏ sót 4 chỗ vẫn còn nguyên ở HEAD:
    scripts/pre-merge-check.sh:2 (`# pre-merge-check.sh — CI gate for the
    Acceptance-Gate Kit.` — comment header của script, thuộc đúng phạm vi
    "message của script"), README.md:88 và README.md:227
    (`| scripts/pre-merge-check.sh | CI gate (copy into consumer repos) |`),
    commands/acceptance-init.md:109 ("Suggest copying the CI gate from the
    plugin"), codex/feature-loop-codex/README.md:69. Bốn dòng này do commit
    cũ tạo ra, nhưng a7530a3 là commit nhận trách nhiệm sweep nên đây là
    sweep dở dang chứ không phải nợ ngoài phạm vi. Kèm theo, ledger
    _acceptance/gap-probe-presence-hook/decisions.jsonl có entry "CI gate
    job LUÔN truyền base" — cùng lối drift, viết mới trong diff này.

### 8. E9 judgment eval `inputs` dùng path gốc-repo trong khi kit resolve gốc-slug

- title: E9 judgment eval `inputs` uses a repo-relative path where the kit resolves slug-relative
  file: _acceptance/gap-probe-presence-hook/evals.yaml
  line: 134
  severity: low
  source: bugs
  detail: |
    `inputs: [_acceptance/gap-probe-presence-hook/evidence/premerge-messages.txt]`.

    Gốc resolve được tài liệu hoá là thư mục slug: feature-loop/skills/feature-loop/SKILL.md
    S4 nói "Resolve `inputs` của judgment evals thành abs path (gốc:
    `_acceptance/<slug>/`)", và skills/acceptance/references/eval-executors.md
    minh hoạ `inputs: [contract.md, evidence/E3-step3.png]`. Resolve theo
    cách đó, path này trở thành
    `_acceptance/gap-probe-presence-hook/_acceptance/gap-probe-presence-hook/evidence/premerge-messages.txt`,
    không tồn tại — judge sẽ nhận một input không đọc được.

    Mọi entry `inputs` khác trong file đều resolve đúng; chỉ entry này neo
    theo gốc-repo. Commit 0d7f1ef từng tuyên bố đã sửa path này. Đúng ra
    phải là `evidence/premerge-messages.txt`.

## Chưa adversarial-verify (refuter chết)

none — cả 8 finding trên đều đã refuter xác nhận trong round này.
