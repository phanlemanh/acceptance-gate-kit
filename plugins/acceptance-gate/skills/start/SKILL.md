---
name: start
description: Open a work session — scan the acceptance workspace, present a three-group card (awaiting signature · in progress · start new), hand off after the human picks one line. Human-typed entry ritual; never self-invoke.
---

# Start Session for Codex

Session entry ritual. This skill ONLY orients and hands off — it never reads or
writes product files, never edits anything, never does the work of the target
ritual itself.

1. **Scan by machine, ask nothing:** run
   `node ${PLUGIN_ROOT}/scripts/start-scan.mjs --root .` → one-line JSON.
   When `config` is `false` → print exactly one line: "Repo này chưa dựng cổng
   nghiệm thu — chạy skill `acceptance-init` trước." then STOP — no further
   scanning, no extra questions.

   JSON keys this skill reads (the round-trip case compares them against the
   real script output — renaming either side turns the test red):
   <!-- <<<START-SCAN-KEYS
   config
   git.branch git.dirty
   groups.gates[].slug groups.gates[].gate groups.gates[].since groups.gates[].tier
   groups.inProgress[].slug groups.inProgress[].status groups.inProgress[].nextStep groups.inProgress[].tier
   groups.done[].slug groups.done[].state
   skipped[].source skipped[].reason
   broken[].slug broken[].file broken[].reason
   START-SCAN-KEYS>>> -->

2. **Load the language rules BEFORE writing:** read
   `${PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md`
   (six rules N1–N6, two quick tests, presentation templates) BEFORE writing any
   sentence a human will see. Every render re-reads the file — the rules do not
   live in memory.

3. **Present ONE card, three groups, in priority order:**
   - **Chờ chữ ký của anh** (`groups.gates` — the script already sorts the
     longest-waiting gate first; keep its order): one line per gate — which gate
     (`dang` = Cổng Đáng: decide whether this work is worth doing · `pham-vi` =
     Cổng Phạm vi: approve the criteria before code · `bang-chung` = Cổng Bằng
     chứng: read the evidence, then sign), for which piece of work, ~10 minutes.
   - **Đang dở** (`groups.inProgress`): one line per loop — *what the user will
     get* (one sentence from the work's name; do NOT open product files) + the
     next step written IN WORDS, machine code in parentheses — lookup table:
     chốt thiết kế và tiêu chí (`S1`) · lập kế hoạch (`S2`) · viết code (`S3`)
     · sửa theo bằng chứng (`S3-fix`) · nghiệm thu máy (`S4`). The first time a
     code appears on the card it must carry its meaning.
   - **Bắt đầu việc mới** — exactly three paths, never more: (a) idea still
     fuzzy → a discovery (HIỂU) session (grill/brainstorm per the advisor
     ritual); (b) work already clear → the feature-loop skill with a
     description; (c) a small chore covered by the T1 exemption → confirm it IS
     T1, then END this skill — the human orders the fix in a later turn,
     outside this ritual (this skill never edits anything, chores included).
   - Below the card: one line per `skipped[]` entry "(bỏ qua nguồn `source` —
     `reason`)" — every absent source is named, never silent; one warning line
     per `broken[]` entry: which work, which file (`file`), why (`reason`) — a
     work item with a broken record still shows, never hidden.
   - `groups.done` is a single summary count at the bottom of the card.

4. **ONE letter/line-number question** — never a second question. After the
   human picks → hand off to the target ritual:
   - A gate → the `acceptance-card` skill for that slug.
   - An in-progress loop → the feature-loop skill for that slug — BUT when
     `git.dirty` is `true` or this session shares a working tree with another
     loop: remind the human to open a separate worktree/session FIRST; do not
     hand over the resume command yet (the one-worktree-one-session trap).
   - New work → path (a)/(b)/(c) from step 3.

5. This skill never produces the content itself. After the handoff its role ends.
