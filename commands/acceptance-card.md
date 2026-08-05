---
description: Render a plain-language DECISION CARD (Gate 1 criteria, or Gate 2 evidence) so a human decides the gate fast without reading raw markdown
---

Render the human decision card for a feature's gate. Goal of the kit: cut human
gate time without cutting quality — so the card puts the few things ONLY a human
decides FIRST, in plain product language, always with reversibility, and never as
a bare green check. It is a presentation layer: it reads artifacts the gate
already produced and DECIDES NOTHING; the deterministic hook + evidence remain the
source of truth.

Arg: a feature `<slug>` (the `_acceptance/<slug>/` directory). Repo root = cwd.

Steps:

1. **Find the script.** This command ships INSIDE acceptance-gate, so the
   harness already hands you the root — use `${CLAUDE_PLUGIN_ROOT}/scripts/gate-card.js`
   (`evidence-page.js` and `eval-coverage-lint.js` are its siblings). Never glob
   the plugin cache for your own plugin: `ls` sorts lexically, so "newest" picks
   1.9.2 over 1.20.1 and the card renders from an ancient release in silence.
   The variable is unset (bare `node`, odd harness) → resolve once with
   feature-loop's `scripts/resolve-plugin.mjs --plugin acceptance-gate --require
   scripts/gate-card.js`; still nothing → tell the user to install/update the plugin.

2. **Extract** the bits to translate (gate auto-detected: `evidence-report.md`
   present → Gate 2, else Gate 1):
   `node <gate-card.js> --root . --slug <slug> --extract`

   Gate 1 + repo có `CONTEXT.md` → thêm `--glossary-base <merge-base với nhánh
   chính>` (vd `$(git merge-base HEAD origin/main)`) để thẻ trình khối "Từ vựng
   chốt ở feature này" (term mới/sửa). Đây là lối gọi DUY NHẤT khiến gate-card
   đụng git; thiếu cờ thì thẻ chỉ ghi chú info, không im lặng bỏ qua.

3. **Nạp luật TRƯỚC khi viết:** đọc `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md`
   (sáu luật N1–N6, hai phép thử, khuôn trình bày) TRƯỚC khi viết bất kỳ câu nào
   sẽ hiện cho người. Mỗi lần render là một lần đọc — luật không sống trong trí
   nhớ. Biến gốc-plugin không có thì giải như bước 1.

   **Translate** the extract into PLAIN PRODUCT LANGUAGE for this repo's persona
   (read `AGENTS.md`, `CLAUDE.md`, or repo docs for who the user is). Keep
   meaning, do not invent:
   Khuôn key của `card-plain.json` — danh sách ĐÓNG, hai chiều: mọi key viết ra
   phải nằm trong khuôn, và reader (`gate-card.js`) không đọc key nào ngoài khuôn
   (test P147 canh cả hai chiều):

   <!-- <<<CARD-PLAIN-KEYS
   feature_plain will_do wont_do scope_plain decisions_plain
   coverage_plain gap_probe_plain decisions analyst_plain
   CARD-PLAIN-KEYS>>> -->

   - `feature_plain`: one plain sentence — what it does for the user.
   - Gate 1: `will_do[] → {id,p}` each starting "Sẽ …" (what the system DOES);
     `wont_do[] → {id,p}` starting "Sẽ KHÔNG …" or "Chặn …".
   - Gate 1 `coverage_plain[] → {i,p}`: mỗi dòng Coverage của contract (đúng thứ
     tự trong extract, `i` là chỉ số) → 1 câu tiếng sản phẩm nói trục đó đã phủ
     gì và bằng chứng "đủ" là gì. Giữ mã AC (N3: mã là tra cứu, kèm 3–5 chữ).
     Vắng key/thiếu dòng → script tự in bản lột-dấu-markdown của dòng contract —
     dòng không bao giờ biến mất, overlay chỉ đổi chữ.
   - Gate 1 `gap_probe_plain[] → {i,p}`: VIẾT LẠI phần chữ của từng finding
     (theo chỉ số `i` trong extract `gap_probe.rows`) bằng ngôn ngữ mặt người —
     thiếu gì, đã xử thế nào. KHÔNG bịa, KHÔNG gộp, KHÔNG làm nhẹ mức nặng; mức
     sev do script render, overlay không đè được, và hàng không có overlay vẫn
     hiện bản lột-markdown (overlay không giấu được finding nào). Cờ
     vắng/probe-failed/parse_dropped vẫn do script tự render.
   - Gate 2: `decisions[] → {id,q}` a SHORT product question (≤14 words, ends "?",
     NO Given/When/Then, NO jargon like DOM/exit code); optional `{id,why}` plain;
     `analyst_plain` = plain restatement of the non-discriminating note.
   - Gate 2 khối "Ngoài hợp đồng": **KHÔNG dịch, KHÔNG có key overlay cho khối
     này** — `gate-card.js` tự đọc `_acceptance/<slug>/review-findings.md` và tự
     render (cùng luật với `gap_probe`: cái gì phải hiện trên thẻ thì script
     render, để không thể quên hay điền sai). Ba nhãn lựa chọn giữ NGUYÊN VĂN:
     (a) **ghi Known limits** — chấp nhận, ghi vào phần hạn chế đã biết, ship bản này; (b) **mở hợp đồng mới** — tách thành một việc riêng có tiêu chí nghiệm thu của nó; (c) **nâng phạm vi sửa ngay** — bổ sung tiêu chí vào hợp đồng hiện tại rồi duyệt lại Cổng 1.
     File không có section "## Ngoài hợp đồng" (thế hệ cũ, hoặc round không có
     lỗi nào) → thẻ render như cũ, không cờ, không lỗi. Có "## Chưa phân loại (triage-failed)" → script THÊM một cờ vàng phía trên khối (không thay thế — các lỗi đã phân loại được vẫn hiện cho người quyết). Cờ cụm-ngoài-vùng-phủ
     cũng do script render, và cố ý KHÔNG nêu đường dẫn file: thẻ là chỗ quyết
     định, chi tiết nằm ở gói bằng chứng.
   - `scope_plain`: one plain phrase for the deferred/cut scope.
   - `decisions_plain[] → {id,p}` cho MỌI entry trong `decisions` (Gate 1) /
     `decisions_approved` + `decisions_provisional` (Gate 2): mỗi `p` = 1 câu sản
     phẩm "đã chọn gì — đổi lại gì" (descope: bắt đầu "KHÔNG làm ..."). Ledger là
     rationale, KHÔNG phải scope-truth — không dịch thành cam kết mới.
   Write it to `_acceptance/<slug>/card-plain.json`.

4. **Render** + present:
   `node <gate-card.js> --root . --slug <slug> --plain _acceptance/<slug>/card-plain.json`
   Prepend `<!doctype html><meta charset="utf-8"><body style="margin:0;padding:24px">`
   and save to `_acceptance/<slug>/card.html`; tell the user to open it (or show the
   fragment inline if a visual tool is available).

5. **(Gate 2 only — `evidence-report.md` present) Full evidence page + AUTO-OPEN.**
   The card is intentionally link-only; the human SEES the real artifacts here. Run
   the sibling script (same `scripts/` dir as gate-card.js):
   `node "$(dirname <gate-card.js>)/evidence-page.js" --root . --slug <slug>`
   → writes `_acceptance/<slug>/evidence-page.html` (self-contained: screenshots,
   real output, judge rationale, override status, review findings, Gate-2 checklist;
   a ui-check eval with multiple `evidence/<id>-*.png` frames plays as a CSS
   slideshow). Then **auto-open it for the user** — do NOT make them open it
   manually: macOS `open <path>`, Linux `xdg-open <path>`, Windows/WSL `start <path>`
   (the script prints the absolute path on stdout). Gate 1 has no evidence page → skip.

6. The card NEVER decides. The human's click flows into the REAL gate: Gate 1 →
   contract `approved_by`; Gate 2 → `human_signoff` / per-item `human_override`.
   The verdict, hook enforcement, and machine evidence are unchanged.

7. **Người duyệt có quyền TRẢ LẠI thẻ.** Thẻ vi phạm luật ngôn ngữ mặt người thì
   người duyệt trả lại tại cổng, không duyệt cho xong rồi góp ý sau. Trả lại là
   lỗ của bộ công cụ chứ không phải lỗi của người viết: ghi vào
   `_acceptance/<slug>/decisions.jsonl` một entry `revisit` có `decision` mở đầu
   đúng chuỗi `lỗ-kit — ngôn ngữ mặt người` kèm câu vi phạm, để đợt nâng bộ thẻ
   đọc lại bằng số thay vì bằng trí nhớ.
