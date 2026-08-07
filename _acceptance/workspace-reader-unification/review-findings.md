# Review Findings: workspace-reader-unification (round 1)

## Trong hợp đồng

### Codex /start body still hardcodes old map strings; declared map.state/map.label unused
- file: `/Users/manhphan/dev/acceptance-gate-kit/codex/acceptance-gate/skills/start/SKILL.md:70`
- severity: high
- AC: AC-3
- source: conventions

The START-SCAN-KEYS block (line 26) was updated to declare `map.state` and `map.label`, but the body (lines 70-76) still branches on `map.present`/`map.enabled` with its own hardcoded strings and has no `da-xoa` branch. In the deleted-map state, CI (`product-map --check`) exits 1 saying "PRODUCT-MAP.md đã bị xoá khỏi cây làm việc", while the Codex `/start` card renders "chưa có bản đồ sản phẩm (sẽ tự vẽ ở lần ký cổng kế)" — the card contradicts CI, which is exactly the AC-3 scenario this feature closes, and the hand-rolled strings violate AC-7 ("không bên nào hardcode chuỗi riêng" — nhãn phải rút từ MAP_LABELS). The Claude edition (`commands/start.md`) was correctly rewritten to print `map.label`; the Codex overlay (source of `plugins/acceptance-gate/skills/start/SKILL.md`) was not. No test pins this: P173/E14 checks the Codex start only for the uat-session pointer, P171 checks only scan JSON and product-map output — the writer side of this seam in the Codex edition is unmeasured (thước không gắn vào vật được giao). Contract out-of-scope only excludes the Codex uat-session ritual, not the Codex start map line.

Rationale: Ca chính xác đúng Given/Then của AC-3 — sau khi PRODUCT-MAP.md bị xoá khỏi cây làm việc sau commit, `--check` gọi là ĐÃ XOÁ nhưng thẻ `/start` của Codex lại in một chuỗi khác ("chưa có bản đồ"), tức card không nói đúng điều CI đang nói.

### AC-3 divergence: /start calls a deleted-but-tracked map "chua-bat" while --check calls it "da-xoa"
- file: `scripts/start-scan.mjs:307`
- severity: medium
- AC: AC-3
- source: bugs

start-scan derives the map's tracked-ness ONLY from the config signal (`tracked: map.enabled`, i.e. PRODUCT-MAP.md listed in `t1_skip_globs`), while `product-map --check` derives it from `trongIndex || tungBiXoa || daBat` (`scripts/product-map.mjs:335`). Reproduced concretely: a repo where PRODUCT-MAP.md was committed and then deleted from the working tree, with config NOT declaring it in `t1_skip_globs` — `product-map --check` prints "PRODUCT-MAP.md đã bị xoá khỏi cây làm việc" and exits 1, while `start-scan` emits `{state: "chua-bat", label: "repo chưa bật bản đồ sản phẩm"}`. That is exactly the contradiction AC-3 forbids ("cả hai gọi nó là ĐÃ XOÁ ... card /start nói đúng điều CI đang nói"). The new P171 net only exercises tree shapes where the config DOES declare the map (CFG_BAT) or where nothing tracks it, so this shape passes the suite. The in-code comment acknowledges the shallow-checkout rationale for using only the config signal, but the result is the two readers give opposite conclusions about the same fact on a plain full clone — the false-green class this feature exists to close. Fix direction: start-scan can consult the same git index/history signals when git is available (it already shells out to git for branch/dirty), falling back to the config signal on shallow/git-less trees.

Rationale: Finding tự đặt tên đúng AC-3 và nội dung khớp hoàn toàn Given/When/Then của AC-3: map bị xoá sau commit, hai bên đọc phải cùng gọi là ĐÃ XOÁ nhưng không cùng.

### Hình dạng 2 — mutant chấm bằng bản sao cục bộ, không round-trip qua bên đọc thật (P173/E19 tautology)
- file: `tests/plugins/run-tests.sh:8620`
- severity: high
- AC: AC-4
- source: measurement

E19 tuyên bố (comment dòng 8620-8621) rằng xoá một bước trong khối UAT-COPY-PROCEDURE của bản sao thì "phép đo khuôn (logic P172) phải ĐỎ nêu đúng bước bị xoá" — nhưng logic P172 không hề được chạy trên mutant. E19 tự chép lại danh sách bước (`BUOC = ["ĐỪNG chép", "BẮT ĐẦU ngay ở dòng \`---\`", "Xoá các dòng hướng dẫn"]`, dòng 8624) rồi assert `thieu != ["ĐỪNG chép"]` (dòng 8631-8633) sau `proc.replace("ĐỪNG chép", "cứ chép", 1)`. Khi đối chứng dương (8625-8626) đã xanh và guard tiêm (8627-8629) đã qua, assert cuối là hệ quả tất yếu của `str.replace` — nó KHÔNG BAO GIỜ đỏ được, chỉ đo ngữ nghĩa của Python chứ không đo phép đo P172. Nếu ai đó làm yếu P172 (bỏ bớt một phrase khỏi tuple kiểm ở dòng ~8455), E19 vẫn xanh vì nó kiểm bản sao riêng của mình. Đây đúng hình dạng "bên VIẾT và bên ĐỌC trôi khỏi nhau vì test tự dựng bản sao đúng khuôn" — mutant phải được rút-từ-writer rồi ĐỌC bằng chính checker của P172 (tách checker thành hàm/khối dùng chung), không phải bằng một replica inline.

Rationale: Đây đúng điểm AC-4 đòi hỏi: thủ tục chép phải sống trong một khối có marker để phép đo RÚT RA và thi hành, không phải văn xuôi/danh sách mà eval tự cài lại — E19 tự chép lại danh sách bước thay vì đọc từ khối có marker mà logic kiểm dùng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Codex start claims the UAT ritual "does NOT ship in the Codex edition" while the shipped Codex package contains skills/uat-session; E14 measures the source overlay, not the shipped artifact**
  Người dùng thấy gì: Trong bản Codex, hướng dẫn khởi động có thể nói tính năng phiên nghiệm thu "chưa có sẵn" trong khi thực tế gói cài đặt đã kèm sẵn nó — người dùng có thể bị hướng dẫn sao chép thủ công một cách không cần thiết, hoặc nhận thông tin không đúng về những gì đã có sẵn.
  file: `codex/acceptance-gate/skills/start/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên quét ma trận '3 state x 3 bên cùng bảng nhãn' nhưng ô (dang-co, label) không có assert (P171)**
  Người dùng thấy gì: Với một trạng thái bản đồ sản phẩm cụ thể (đang xây dựng dở), bộ kiểm tra tự động hiện chưa xác minh đầy đủ nhãn hiển thị có khớp với nguồn nhãn chuẩn hay không — nếu về sau có sai lệch nhãn ở trạng thái này, người dùng có thể thấy thông tin không nhất quán mà không ai phát hiện ngay.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ

### start-scan and product-map derive 'tracked' from different signals — residual two-conclusions divergence
- file: `/Users/manhphan/dev/acceptance-gate-kit/scripts/start-scan.mjs:307`
- severity: medium
- source: conventions

start-scan.mjs computes `map.state` với `tracked = map.enabled` (chỉ tín hiệu config `t1_skip_globs`), trong khi `product-map.mjs --check` tính `daTheoDoi = trongIndex || tungBiXoa || daBat` (git index/history HOẶC config). Trên một clone đầy đủ nơi PRODUCT-MAP.md đang được track hoặc đã bị xoá trong lịch sử git nhưng config không còn liệt nó, `--check` báo `da-xoa` (exit 1) trong khi `/start` báo `chua-bat` — hai bên đọc cho ra hai kết luận trái nhau về cùng một thực tế của repo, đúng lớp trôi mà AC-3/AC-7 và bất biến của repo ("hai bên đọc cùng một khoá không được cho hai kết luận trái nhau") nhắm tới. Comment trong code có ghi lý do dùng tín hiệu config (an toàn cho shallow-checkout), nhưng khác với cặp NAV_RULES/VERDICT_MEANING, không có guard hai-bảng-lệch cho việc tách tín hiệu này, và P171 chỉ kiểm các hình dạng cây có tín hiệu config (CFG_BAT), nên ca phân kỳ này chưa được đo.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
