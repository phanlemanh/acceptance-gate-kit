# Opportunity solution tree

**Best for:** discovery work that has a number attached — one measurable outcome, the unmet needs research actually heard, the solutions competing to serve *one* of those needs, and the cheap tests that let a solution earn its place. Lineage: Teresa Torres, *Continuous Discovery Habits*.

A plain tree draws hierarchy. This one draws a **discovery argument**: the outcome is the only thing that matters, opportunities are what research heard, solutions are guesses, and tests are how a guess earns its place. Its discipline is that solutions compete **inside one opportunity** — comparing a solution under need A against one under need B is comparing answers to different questions. Its second discipline is focus: exactly one opportunity is under attack, and the rest of the tree is visibly collapsed to say so. It specialises [type-tree.md](type-tree.md) and inherits its elbow and depth rules verbatim. **Routing:** a plain parent → child hierarchy with no outcome at the root and no evidence badges is `type-tree.md`, not this.

## Layout conventions

- **Canvas / bands:** `0 0 1000 560`, four typed bands top-down — outcome `y=56`, opportunities `y=168`, solutions `y=296`, tests `y=392`. The four level names sit as 8px mono tags in the left margin at `x=32`; diagram content starts at `x=116`. The bands are the type — a node's level is legible from its row before anything is read.
- **L1 outcome:** exactly one box, `240×56`, visibly wider than everything below it, white fill + `ink` stroke 1.2, `KẾT QUẢ` tag. Geist sans name, and beneath it a Geist Mono line carrying the number and its threshold (`hiện 28% → mục tiêu 40%`). **An outcome without a number is a slogan.** If you cannot write the current value and the target, you have a theme, not an outcome, and nothing below can be judged against it.
- **L2 opportunities:** `176×72`, white + `ink` 1, phrased as the user's unmet need **in their words** — keep the quote marks, never write a feature here. Each carries a 7px mono evidence badge at top-left (`nghe 7/12 buổi`). **An opportunity with no badge is a guess wearing a need's clothes.**
- **L3 solutions:** `176×48`, `ink@0.05` fill + `muted` stroke — deliberately lighter than the need above them, because they are candidates, not commitments. At least one opportunity must show **two or more competing solutions**; a single child means no choice was made.
- **L4 tests:** chips `96×24` `rx=4`, Geist Mono 8px, ordered **cheapest-first left to right**, each carrying a cost hint (`đọc log · 0đ`, `5 buổi · 1 ngày`). The left-to-right order is the argument: the cheap test either kills the guess or buys the right to run the expensive one.
- **The attacked opportunity:** exactly one L2 node takes `accent` stroke 1.2 + `accent-tint` fill over an **opaque lifted-fill mask** (`#ffffff` light, `#454b63` dark — without it the tint composites darker than its neighbours in dark mode) plus a `TẤN CÔNG` tag. Its subtree is drawn at full strength; every other opportunity's subtree collapses to one dashed `56×24` stub carrying `…` and a mono count (`3 giải pháp · thu gọn`), fed by a dashed drop. The collapse is about attention, not rank — the other needs are real, they are just not being worked this week.
- **Coral, exactly twice:** the attacked node (its own tag counts as part of that node) and one short italic Instrument Serif line naming why *this* need was chosen now. Nothing else.
- **Connectors:** inherited from tree. One feed drops from the parent's bottom edge into a **single** bus; the bus turns down at both ends with `r=8` elbows and any middle child T's off it — so no two strokes ever share a path and no edge carries two attach points. Straight `<line>` only where endpoints share x.
- **Legend:** bottom strip below a hairline, outside the diagram area — Kết quả · Cơ hội · Giải pháp · Phép thử · Đang tấn công. The outcome swatch is drawn wider than the rest, because width is how the outcome is distinguished in the figure.

## Complexity budget

Exactly 1 outcome · max 5 opportunities, only 1 expanded · max 4 solutions under the expanded opportunity · max 3 tests per solution · every opportunity carries an evidence badge · max 2 coral elements.

## Anti-patterns

- **A solution written in the opportunity row** — "cần một dashboard" is an answer, not a need. If the text names a screen, a button, or a technology, it belongs one level down.
- **An opportunity with no evidence badge** — without a count of sessions, the row is the team's opinion promoted to research.
- **Comparing solutions that hang under different opportunities.** They answer different questions, so the comparison is meaningless however tidy the boxes look.
- **One solution per opportunity** — nothing was chosen; it is a plan drawn as a tree.
- **Every branch expanded at once**, so no need is actually being attacked. The collapsed stubs are the diagram's point, not a rendering shortcut.
- **Tests that cannot fail** — a "test" whose only possible outcome is confirmation is a rollout with a research label on it.

## Examples

- `assets/example-solution-tree.html` — minimal light
- `assets/example-solution-tree-dark.html` — minimal dark
- `assets/example-solution-tree-full.html` — full editorial
