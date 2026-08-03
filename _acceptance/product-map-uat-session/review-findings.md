# Review Findings: product-map-uat-session (round 1)

## Trong hợp đồng

- **product-map bỏ qua uat-session.md không parse được — slug hiện ở ô bình thường thay vì Hồ sơ hỏng**
  file: `scripts/product-map.mjs:93`
  severity: high
  detail: Trong lượt 1 của `classify`, khi `fm(txt, field)` trả `null` thì nhánh `if (field === 'decision' || field === 'verdict') continue;` bỏ qua. Với opportunity.md điều này vô hại vì `stage` được kiểm trước và bắt được file hỏng. Với uat-session.md thì `verdict` là field DUY NHẤT được kiểm — nên `null` (frontmatter hỏng / thiếu hẳn) bị gộp chung với `null` do "chưa tới lúc ký", và cả file hỏng trôi qua không tiếng động.

  Đã dựng lại: `_acceptance/x/` có contract `signed-off`, opportunity `decision: build`, uat-session.md = `khong co frontmatter\n` →
    product-map: `## Đã ship — chờ phiên nghiệm thu — **x** — viec x`  (KHÔNG có mục Hồ sơ hỏng)
    start-scan: `broken [{'slug':'x','file':'uat-session.md','reason':'frontmatter không parse được hoặc thiếu verdict'}]`
  Đúng cái mà comment đầu file cấm: bản đồ nói "chờ phiên nghiệm thu" trong khi hồ sơ phiên đã hỏng. P103 chỉ tiêm verdict NGOÀI ENUM (`verdict: done`) chứ không tiêm file không parse được, nên ca này không có phép đo.

  Sửa: phân biệt "file vắng" với "file có mà không đọc được" — chỉ `continue` khi uTxt/oTxt vắng hoặc frontmatter đọc được mà key thiếu; frontmatter không parse được thì `hong(file, ...)` như start-scan.
  source: bugs
  AC: AC-1

- **`status:` rỗng trong contract.md rơi vào ô "Đang cân nhắc cơ hội" thay vì Hồ sơ hỏng**
  file: `scripts/product-map.mjs:96`
  severity: medium
  detail: `if (raw === '') continue;` ở lượt 1 cho giá trị rỗng đi qua; lượt 2 thì `const status = low(fm(cTxt,'status')) || ''` rồi `if (status)` là falsy nên bỏ luôn nhánh contract và rơi xuống nhánh `stage` — với oTxt vắng, `stage !== 'decided'` → trả `can-nhac`.

  Đã dựng lại (contract.md có `status:` là dòng cuối frontmatter, hoặc `status: # chua ky`):
    product-map: `## Đang cân nhắc cơ hội — **x** — viec x`
    start-scan:  `broken [{'file':'contract.md','reason':'status không nhận diện được: (rỗng)'}]`
  Bản đồ báo "chưa mở vòng" cho một vòng đã có contract — sai hướng chứ không chỉ thiếu. Comment đầu file nói rõ giá trị điều hướng không được rơi vào khoảng trống; ở đây khoảng trống chính là giá trị rỗng.

  Sửa: coi `raw === ''` trên `status`/`stage` là hỏng (giống start-scan dòng 106), chỉ cho rỗng đi qua với `decision`/`verdict` — hai field cố ý để trống trước khi ký.
  source: bugs
  AC: AC-1

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **start-scan nuốt `decision` ngoài enum trên contract signed-off → mất cổng Giá trị, không cờ hỏng**
  Người dùng thấy gì: Nếu ai đó gõ nhầm giá trị của quyết định 'build hay iterate' sau khi hồ sơ đã ký, hệ thống âm thầm coi hồ sơ đó là đã xong việc thay vì báo hỏng — nên một hồ sơ đáng lẽ vẫn đang chờ quyết định giá trị có thể biến mất khỏi tầm nhìn thay vì được nhắc sửa lỗi gõ.
  file: `scripts/start-scan.mjs:88`
  severity: high
  Đề xuất: new-contract

- **Hai chân đột biến P107/P109 là chân chết — biến `mut` không bao giờ được đo lại**
  Người dùng thấy gì: Vài phép kiểm 'trước và sau khi phá hỏng cố ý' trong bộ test không bao giờ thật sự chạy lại phép đo trên bản đã phá, nên chúng vẫn xanh ngay cả khi luật an toàn mà chúng tuyên bố bảo vệ bị xoá mất.
  file: `tests/plugins/run-tests.sh:3468`
  severity: medium
  Đề xuất: known-limits

- **P108 còn một assert chết về `skipped[]` — luôn xanh sau khi khoá bị gỡ**
  Người dùng thấy gì: Một dòng kiểm tra cũ dành cho một tính năng đã bị gỡ giờ luôn báo 'đạt' bất kể chuyện gì xảy ra, nên nó không còn bảo vệ được gì — vô hại nhưng có thể khiến người xem lầm tưởng vẫn đang được canh.
  file: `tests/plugins/run-tests.sh:3538`
  severity: low
  Đề xuất: known-limits

- **P109 khẳng định vị trí trong suite_keys nhưng chỉ grep substring cả file**
  Người dùng thấy gì: Bài kiểm được cho là xác nhận một bước nằm đúng vị trí trong danh sách kiểm tự động thực ra chỉ tìm xem cụm chữ đó có xuất hiện ở bất kỳ đâu trong toàn bộ tệp cấu hình hay không, nên dời bước đó sang chỗ khác (kể cả biến nó thành ghi chú vô hiệu) vẫn được báo là đạt.
  file: `tests/plugins/run-tests.sh:3589`
  severity: low
  Đề xuất: known-limits

- **`since` của cổng gia-tri đọc `decided_at` từ uat-session — nhánh không sinh ra được trong nghi thức thật**
  Người dùng thấy gì: Một quy tắc được tài liệu hoá để tính thời điểm chờ quyết định giá trị dựa vào một mốc thời gian mà trong thực tế thao tác thật không bao giờ có sẵn ở đúng lúc cần dùng — nên trên thực tế mốc đó luôn dùng phương án dự phòng kém chính xác hơn, dù thiết kế mô tả hai cách hoạt động.
  file: `scripts/start-scan.mjs:90`
  severity: low
  Đề xuất: known-limits

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ.

- **Bản đồ sản phẩm không cờ được uat-session.md hỏng — hai bên đọc cùng hồ sơ cho hai kết luận trái nhau**
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/cranky-shannon-5dc195/scripts/product-map.mjs:93`
  severity: high
  detail: Trong `classify()` lượt 1, `verdict` (và `decision`) được miễn kiểm với lý do "được phép VẮNG (chưa tới lúc ký)". Nhưng `fm()` trả `null` cho CẢ HAI trường hợp: (a) key chưa điền và (b) file KHÔNG parse được frontmatter. Kết quả là uat-session.md hỏng hoàn toàn rơi vào khoảng trống — đúng cái mà comment ở đầu NAV_ENUMS tuyên bố không được xảy ra ("một lỗi gõ ... mà làm slug ... thì bản đồ nói dối đúng lúc người ta tin nó nhất"). Lưu ý contract.md/opportunity.md KHÔNG dính lỗ này vì `status`/`stage` bị kiểm bắt buộc; uat-session.md không có field bắt buộc nào nên không có chân đo.

  Đã repro (không phải suy luận): dựng `_acceptance/x/` với contract `status: signed-off`, opportunity `decision: build`, và `uat-session.md` chứa đúng một dòng `khong co frontmatter gi ca`. `scripts/start-scan.mjs` trả `broken: [{slug:"x", file:"uat-session.md", reason:"frontmatter không parse được hoặc thiếu verdict"}]`, còn `PRODUCT-MAP.md` sinh ra chỉ có `## Đã ship — chờ phiên nghiệm thu\n- **x** — viec` và MỤC "Hồ sơ hỏng" hoàn toàn vắng.

  Hai script này là hai READER của cùng một bộ hồ sơ và đã trôi khỏi nhau ngay trong lần đầu ra mắt (start-scan.mjs:64-66 coi verdict==null là hỏng; product-map.mjs:93 coi là hợp lệ). Đây là hình dạng 3 của "thước phải gắn vào vật được giao" trong CLAUDE.md, chỉ đổi trục: không phải writer↔reader mà reader↔reader. Bản đồ được quảng cáo là "view over the workshop's records" và được nhét vào commit chữ ký của cả hai cổng, nên một hồ sơ hỏng vô hình trên bản đồ là đúng dạng false-green mà kit tồn tại để chặn. Không có case nào trong P103/P108 phủ tổ hợp này: P103 chỉ tiêm enum-lạc (`verdict: done`) chứ không tiêm file mất frontmatter; P108 có `f-uat-hong` nhưng chỉ soi đầu ra của start-scan.
  source: conventions

- **Điểm nghẽn đầu ra của cả thiết kế — `--check` trong CI — chưa hề được nối vào CI**
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/cranky-shannon-5dc195/commands/approve.md:52`
  severity: high
  detail: Bốn thân cổng người mới sửa đều hứa cùng một câu: "CI's `--check` turns any drift red" (commands/approve.md:52, commands/signoff.md:41-45, codex/acceptance-gate/skills/approve/SKILL.md:62, codex/.../signoff/SKILL.md:52-56). Design spec docs/superpowers/specs/2026-08-03-product-map-uat-session-design.md:200 nói thẳng đây là chỗ tựa của cả quyết định regen-bằng-văn-lệnh: "văn lệnh + `--check` CI là điểm nghẽn đầu ra đúng nghĩa" — tức lời hứa CI chính là lý do KHÔNG dùng hook.

  Lời hứa đó hiện không có gì đỡ. `grep -rn 'product-map\|product_map' .github/ tests/ scripts/pre-merge-check.sh` (loại trừ khối P103-P109 trong tests/plugins/run-tests.sh) trả về RỖNG. `.github/workflows/gate.yml` chạy 4 suite + pre-merge-check, không suite nào chạy `node scripts/product-map.mjs --root . --check` trên cây thật.

  Đối chiếu với pattern mà chính config.yaml:84 viện dẫn: `mirror_sync` KHÔNG chỉ nằm trong `feature_loop.suite_keys` — nó còn có case P30 (tests/plugins/run-tests.sh:457) chạy `sync-plugin-packages.sh --check` trên $ROOT thật, và suite đó nằm trong gate.yml. `product_map` mới chỉ có nửa đầu (config.yaml:85 suite_keys), thiếu nửa sau. Hệ quả: PRODUCT-MAP.md chỉ được kiểm khi có ai đó chạy một vòng feature-loop verify; mọi PR khác (kể cả PR sửa _acceptance/) merge được với bản đồ lệch, trong khi bốn thân cổng vẫn nói với người ký rằng CI canh giúp. P109 (dòng 3593) chỉ assert `PRODUCT-MAP.md.is_file()` — có file, không kiểm khớp.
  source: conventions

- **Hai assert đột-biến trong P107/P109 là hằng-đúng — chưa bao giờ đo lại phép đo**
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/cranky-shannon-5dc195/tests/plugins/run-tests.sh:3467`
  severity: high
  detail: |
    P107 (3467-3468):
    ```python
    mut = t.replace("Chấm kín TRƯỚC thảo luận", "Thu y kien")
    assert "Chấm kín TRƯỚC thảo luận" not in mut, "buoc tiem chua bao gio chay"
    ```
    P109 (3591-3592):
    ```python
    mut = "\n".join(l for l in cfg.splitlines() if "executors.script.product_map" not in l)
    assert "executors.script.product_map" not in mut, "buoc tiem chua bao gio chay"
    ```
    Cả hai xoá một chuỗi rồi assert chuỗi đó đã biến mất — hằng đúng theo định nghĩa của `str.replace` / bộ lọc list. `mut` không bao giờ được đưa lại qua vòng lặp FLOW (P107) hay qua bất kỳ assert nào của P109. Comment ghi "bo mot chot thi phep do PHAI mat dau moc" / "go dong suite_keys thi phep do PHAI mat dau moc" — phép đo đó không hề chạy lại, nên hai dòng này xanh kể cả khi vòng kiểm thứ tự của P107 hay chốt suite_keys của P109 bị gỡ sạch.

    Đây đúng lớp "assertion âm-tính-một-mình" mà CLAUDE.md liệt ≥9 lượt tái phát, và repo đã có sẵn khuôn đúng ngay trong cùng file: dòng 1513-1514 (`mut = t.replace(...)` rồi `assert any(... in e for e in check(mut))`) và dòng 3113-3115 (`mut = ...` rồi `e1 = check_text({...: (mut, ...)})` rồi assert e1 đỏ). CLAUDE.md yêu cầu sửa theo LỚP: quét cả file tìm mọi `mut`/`mut2` rồi kiểm từng cái có được đưa lại qua checker không, đừng chỉ vá hai chỗ được nêu tên.
  source: conventions

- **P109 assert quan hệ suite_keys bằng phép đo từ vựng toàn-file**
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/cranky-shannon-5dc195/tests/plugins/run-tests.sh:3589`
  severity: medium
  detail: |
    ```python
    assert "product_map:" in cfg, "config thieu executors.script.product_map"
    assert "executors.script.product_map" in cfg, "product_map chua nam trong feature_loop.suite_keys"
    ```
    `cfg` là TOÀN BỘ _acceptance/config.yaml đọc thành một chuỗi. Lời hứa trong thông điệp là quan hệ ("nằm trong feature_loop.suite_keys"), phép đo là sự có mặt của chuỗi ở bất kỳ đâu trong file — kể cả trong một dòng comment, hay dưới một khối khác. Di dời dòng `- executors.script.product_map` từ `feature_loop.suite_keys` sang bất kỳ list nào khác vẫn xanh, mà đó chính là hỏng cần bắt. Kit đã ghi bài học này ("Đo từ vựng thay vì quan hệ" — 6 vòng cùng một xương) và có sẵn `core.resolveConfigKey` được dùng ở tests/scripts/run-tests.sh:1569 để đọc đúng khoá.

    Cùng case, dòng 3593: comment nói "ban do cua CHINH kit da commit va khop ho so xuong (doi chung song cua P30)" nhưng assert chỉ là `.is_file()` — "khớp hồ sơ" không được đo. Đối chứng sống của P30 là chạy `--check`, không phải kiểm file tồn tại.
  source: conventions

- **contract-template mất literal `status: draft` khi bị templatize thành `{status}`**
  file: `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/cranky-shannon-5dc195/skills/acceptance/references/contract-template.md:44`
  severity: low
  detail: Khối `---8<---` trước đây ghim cứng `status: draft` (giá trị duy nhất hợp lệ lúc tạo hồ sơ — start-scan xếp `draft` vào ô chờ-Cổng-Phạm-vi, cả Gate 1 dựa vào nó). Sau khi thêm marker CONTRACT-FRONTMATTER-TEMPLATE cho helper test, dòng thành `status: {status}` — khuôn không còn tự nói giá trị khởi tạo. Cùng lượt, `{{T2|T3}}` → `{risk_tier}` và `[{{api|cli|sdk|ui|mobile, comma-separated}}]` → `[{surfaces}]` cũng mất gợi ý enum ngay tại chỗ dùng.

  Giảm nhẹ: skills/acceptance/SKILL.md:101 vẫn ra lệnh `status: draft`, và "Frontmatter rules" phía trên khuôn còn mô tả lifecycle + T1/T2/T3 — nên đây là mất thông tin tại điểm dùng chứ chưa phải lỗ hở. Đáng cân nhắc giữ `status: draft` nguyên literal (helper `fillTemplate` chỉ thay khoá được truyền vào, giá trị literal không cản test nào) hoặc kéo enum vào comment `#` cuối dòng như uat-session-template.md đang làm.

  Rủi ro phụ cùng khối: dòng hướng dẫn mới nói "replace the placeholders (`{single-brace}` in the frontmatter)", trong khi frontmatter còn `time_human_minutes: {gate1: 0, gate2: 0}` — cũng single-brace nhưng KHÔNG phải placeholder.
  source: conventions

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).