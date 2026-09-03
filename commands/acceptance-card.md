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

2. **Chốt tiền đề — hồ sơ có thật không.** CHẠY TRƯỚC MỌI BƯỚC RENDER:
   `node <gate-card.js> --root . --slug <slug> --extract`. Mã thoát khác 0 nghĩa
   là không có gì để trình — bộ dựng đã từ chối, và bước tiếp theo KHÔNG phải là
   dựng thẻ. Đây là lỗ đã đo 2026-08-30: trước bản vá, một tên hồ sơ gõ nhầm vẫn
   ra một thẻ Cổng Phạm vi đầy đủ, tiêu đề là chính chuỗi gõ nhầm, và người được
   mời ký trên hư không.

   Bốn mệnh đề bắt buộc của bước này (danh sách ĐÓNG, máy đọc được):

   <!-- <<<CARD-PRECHECK-RULES
   chay-chot-truoc-khi-render
   khong-render
   khong-ghi-card-html
   thuat-lai-tieng-san-pham
   CARD-PRECHECK-RULES>>> -->

   Mã thoát khác 0 → **DỪNG**: không chạy bước dựng thẻ, không ghi tệp thẻ, không
   bịa một thẻ rỗng thay thế. Thuật lại cho người theo bản luật ngôn ngữ mặt người
   (nạp nó NGAY như bước 4 chỉ dẫn — ca từ chối cũng là chữ cho người đọc, cũng
   phải qua luật): nói bằng tiếng sản phẩm chuyện gì đã xảy ra và việc kế là gì,
   KHÔNG dán nguyên thông điệp máy vào mặt người — trừ đúng một chỗ: danh sách tên
   hồ sơ có thật thì chép nguyên văn, vì tên hồ sơ là tên riêng, dịch là làm hỏng.

   NĂM ca từ chối, NĂM lời thuật RIÊNG — mỗi dòng một ca, tuyệt đối không gộp thành
   một câu chung «không dựng được thẻ»: người phải phân biệt được mình đang ở ca nào
   thì mới biết việc kế.

   GIỚI HẠN ĐÃ KHAI, đọc trước khi tin danh sách này là đủ: ô đang **chờ** Cổng
   Đáng — đã có ô cơ hội, chưa có hợp đồng, chưa ai quyết — rơi vào ca thứ ba
   («hồ sơ chưa có contract.md»), tức người mở một ý đang chờ quyết vẫn nhận câu
   chỉ SAI bước kế: nó mời đi chuẩn hoá yêu cầu trong khi việc thật là chờ người
   quyết có làm hay không. Làn thẻ riêng cho ca này đã dựng rồi TRẢ VỀ Ô ngày
   2026-09-01 tại điều khoản dừng-vá (cây ghim `528caaa8`, xem
   `_acceptance/cong-dang-co-cua/discovery/LAY-VE-LAN-THE.md`). Lấy lại là một
   quyết định riêng. ĐỪNG viết ở đây rằng ca đó ra thẻ — bản 01/09 từng viết thế
   và nó nói ngược hành vi đang ship.

   - `gate-card: xưởng chưa mở` → kho này chưa từng mở sổ nghiệm thu, nên chưa có hồ sơ nào để trình; việc kế là mở sổ cho kho rồi quay lại.
   - `gate-card: không có hồ sơ` → tên vừa gõ không có trong sổ; đọc lại nguyên văn danh sách tên có thật mà chốt vừa in, để người nhận ra mình nhầm tên nào.
   - `gate-card: hồ sơ chưa có contract.md` → hồ sơ có trong sổ nhưng chưa chốt bộ tiêu chí, nên chưa có gì để duyệt; việc kế là chạy bước chuẩn hoá yêu cầu cho hồ sơ đó.
   - `gate-card: ý đã đóng` → ý này đã được xếp lại hoặc đã dừng, nên không có gì để ký và không ai phải làm gì tiếp; mở lại nó là một quyết định riêng, không phải bước kế.
   - `gate-card: hồ sơ hỏng` → hồ sơ của việc này ghi sai một chỗ nên máy không đọc được nó đang ở nấc nào; việc kế là sửa đúng chỗ máy vừa gọi tên rồi quay lại.

   Từ 2.7 thẻ còn BA thông điệp KHÔNG phải ca từ chối — mã thoát 0, thẻ vẫn dựng —
   nhưng cũng là chữ máy phát ra mà người phải hiểu đang ở ca nào; mỗi thông điệp
   một lời thuật riêng, cùng nếp «mỗi hằng bên viết một dòng bên đọc» (răng
   `khong-ve-the-ma` đếm hằng từ `gate-card.js`, thiếu dòng nào là đỏ):
   - `mục «Ngoài hợp đồng» có chữ nhưng máy không đọc ra finding nào — sai khuôn OOC-ITEM-TEMPLATE, khối đang bị GIẤU khỏi thẻ; soi review-findings.md trước khi ký` → cờ vàng trên thẻ Cổng 2: có mục ngoài hợp đồng viết sai khuôn nên thẻ không in được mục nào, tức người sắp ký mà không thấy nó; việc kế là sửa `review-findings.md` theo khuôn OOC-ITEM-TEMPLATE rồi dựng thẻ lại — đừng ký khi khối còn bị giấu.
   - `đề xuất không đọc được` → cờ vàng trên một mục Ngoài-<số>: phiên soi ghi đề xuất bằng chữ người thay vì một trong ba token máy đọc; thẻ in nguyên văn chữ đó kèm ba token hợp lệ, ô ấy trong dòng lệnh để trống — người chọn một trong ba ở câu gộp, máy KHÔNG đoán thay.
   - `Đối kháng máy KHÔNG chạy được — phần vượt-nhận-thức RƠI VỀ ANH: thẻ này không điền sẵn ô nào, và chữ ký ở đây KHÔNG có nghĩa «đối kháng đã hội tụ». Anh tự đọc vật, hoặc chạy lại bước phản biện context sạch rồi dựng thẻ lại.` → khối rơi bậc trên thẻ Cổng 1: gap-probe vắng khi repo khai `required`, hỏng, hay verdict lạ, nên phần lẽ ra máy soi thay mắt người nay rơi về người; dòng lệnh không điền sẵn gì, và người ký lúc này là ký trên vật tự đọc — nói rõ điều đó, đừng mời ký như thẻ thường; việc kế rẻ nhất là chạy lại phản biện context sạch rồi dựng thẻ lại.

3. **Extract** the bits to translate (gate auto-detected: `evidence-report.md`
   present → Gate 2, else Gate 1):
   `node <gate-card.js> --root . --slug <slug> --extract`

   Từ 2.7, JSON còn ba khoá thẻ tự tính — ĐỌC chúng, đừng soạn lại bằng tay:
   - `one_shot` — trọn dòng lệnh cho người: tên lệnh plugin đầy đủ, mọi ô đã có
     khuyến nghị máy đã điền sẵn, `___` chỉ ở ô người phải tự chấm và ở chữ
     quyết. `null` nghĩa là thẻ này KHÔNG ký được (REJECT/BLOCKED) — đừng mời ký.
   - `routing` — `hoi` là các mục người phải quyết, `bao` là các mục máy đã đi
     tiếp và chỉ báo lại. Khối «VIỆC CỦA ANH» chỉ được chứa mục trong `hoi`.
   - `roi_bac` (Cổng 1) — đối kháng máy không chạy được (gap-probe vắng khi repo
     khai `required`, file hỏng, verdict lạ, probe-failed). Bật thì thẻ KHÔNG
     điền sẵn gì và lời mời phải nói thẳng: phần vượt-nhận-thức rơi về người,
     chữ ký ở đây không có nghĩa «đối kháng đã hội tụ».

   Thuật lại cho người: in `one_shot` NGUYÊN VĂN để họ dán lại và sửa ô nào họ
   nghĩ khác — đừng diễn đạt lại thành câu khác, người sẽ gõ tay và mất một lượt.

   Gate 1 + repo có `CONTEXT.md` → thêm `--glossary-base <merge-base với nhánh
   chính>` (vd `$(git merge-base HEAD origin/main)`) để thẻ trình khối "Từ vựng
   chốt ở feature này" (term mới/sửa). Đây là lối gọi DUY NHẤT khiến gate-card
   đụng git; thiếu cờ thì thẻ chỉ ghi chú info, không im lặng bỏ qua.

4. **Nạp luật TRƯỚC khi viết:** đọc `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md`
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

5. **Render** + present:
   `node <gate-card.js> --root . --slug <slug> --plain _acceptance/<slug>/card-plain.json`
   Prepend `<!doctype html><meta charset="utf-8"><body style="margin:0;padding:24px">`
   and save to `_acceptance/<slug>/card.html`; tell the user to open it (or show the
   fragment inline if a visual tool is available). Thẻ đã liệt sẵn việc-của-người;
   TIN NHẮN trình thẻ theo điều khoản single-source (chép nguyên văn, một
   dòng):
   Mời cổng như đồng nghiệp hỏi: một câu hỏi đóng, nói ngả máy khuyên và vì sao, kèm ĐÚNG MỘT dòng lệnh máy đã điền sẵn mọi ô có khuyến nghị — người chỉ gõ chữ quyết định hoặc sửa ô mình nghĩ khác, rồi máy nói mình làm gì tiếp; máy không viết sẵn CHỮ QUYẾT của người và không hỏi phút.

6. **(Gate 2 only — `evidence-report.md` present) Full evidence page + AUTO-OPEN.**
   The card is intentionally link-only; the human SEES the real artifacts here. Run
   the sibling script (same `scripts/` dir as gate-card.js):
   `node "$(dirname <gate-card.js>)/evidence-page.js" --root . --slug <slug>`
   → writes `_acceptance/<slug>/evidence-page.html` (self-contained: screenshots,
   real output, judge rationale, override status, review findings, Gate-2 checklist;
   a ui-check eval with multiple `evidence/<id>-*.png` frames plays as a CSS
   slideshow). Then **auto-open it for the user** — do NOT make them open it
   manually: macOS `open <path>`, Linux `xdg-open <path>`, Windows/WSL `start <path>`
   (the script prints the absolute path on stdout). Gate 1 has no evidence page → skip.

7. The card NEVER decides. The human's click flows into the REAL gate: Gate 1 →
   contract `approved_by`; Gate 2 → `human_signoff` / per-item `human_override`.
   The verdict, hook enforcement, and machine evidence are unchanged.
   **Thẻ không ghi gì, nên phải NÓI RA lệnh ghi** — in đúng một dòng dưới thẻ:
   Cổng Phạm vi ghi bằng `/acceptance-gate:approve <slug>`, Cổng Bằng chứng ghi
   bằng `/acceptance-gate:signoff <slug>`. Người đọc thẻ xong mà không biết gõ
   gì tiếp là điểm bàn giao bị bỏ trống.

8. **Người duyệt có quyền TRẢ LẠI thẻ.** Thẻ vi phạm luật ngôn ngữ mặt người thì
   người duyệt trả lại tại cổng, không duyệt cho xong rồi góp ý sau. Trả lại là
   lỗ của bộ công cụ chứ không phải lỗi của người viết: ghi vào
   `_acceptance/<slug>/decisions.jsonl` một entry `revisit` có `decision` mở đầu
   đúng chuỗi `lỗ-kit — ngôn ngữ mặt người` kèm câu vi phạm, để đợt nâng bộ thẻ
   đọc lại bằng số thay vì bằng trí nhớ.
