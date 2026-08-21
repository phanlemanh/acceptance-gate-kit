---
schema_version: 1
feature: Repo khai plugin — acceptance-init ghi .claude/settings.json (marketplace + 4 plugin) bằng script hợp nhất JSON, tên plugin lấy từ marketplace.json ship cùng plugin; GUIDE §5.1 từ 5 lệnh còn 1 cho máy sau; diagram-design bắt buộc
slug: repo-khai-plugin
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/ mới + commands/acceptance-init.md + GUIDE §5.1 + tests/plugins — không chạm t3_paths
surfaces: [cli]
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-08-21T14:21:10Z
---

# Acceptance Contract: repo-khai-plugin

## Context

Tầng máy của kit (marketplace + 4 plugin) chưa được repo khai: GUIDE §5.1 là 5 lệnh gõ
tay mỗi máy, không gì buộc hai máy cùng bộ plugin. Claude Code có ổ sẵn —
`.claude/settings.json` cấp repo với `extraKnownMarketplaces` + `enabledPlugins`. Hồ sơ
này cho `acceptance-init` ghi file đó bằng một script hợp nhất JSON, lấy tên plugin từ
`.claude-plugin/marketplace.json` ship cùng plugin, và sửa GUIDE §5.1 cho đúng hai trường
hợp máy-đầu / máy-sau. Owner chốt 21/08: `diagram-design` là plugin bắt buộc.

Source input: `docs/plans/2026-08-21-hat-giong-repo-khai-plugin.md` (Cổng Đáng gật 21/08, chip A của dây A → B → C).

## Criteria

- AC-1: Given một repo **không** có `.claude/settings.json`, When chạy `node scripts/plugin-declare.mjs --root <repo> --write`, Then file được tạo với `extraKnownMarketplaces.acceptance-gate-kit.source` = `{source: "github", repo: "phanlemanh/acceptance-gate-kit"}` và `enabledPlugins` có **đúng n+1** khoá bằng `true` — n tên đọc từ `.claude-plugin/marketplace.json` hậu tố `@acceptance-gate-kit` (hiện n = 3) cộng `superpowers@claude-plugins-official`; tập khoá **bằng tập** đó, không ghim con số — in 2 khoảng trắng, kết thúc bằng newline. Tên marketplace là **một nguồn**: hậu tố plugin và khoá `extraKnownMarketplaces` đều lấy từ `name` trong `marketplace.json`. Biên: khi `marketplace.json` không đọc được thì **không** tạo file (xem AC-9).
- AC-2: Given repo **đã có** `.claude/settings.json` chứa khoá khác (`permissions`, `worktree`) và `enabledPlugins` có một plugin lạ bằng `true`, When chạy `--write`, Then bốn khoá của kit được thêm/đặt `true`, mọi khoá và giá trị khác **giữ nguyên** (so sánh object), và thứ tự các khoá có sẵn không đổi.
- AC-2b: Given `.claude/settings.json` là JSON hợp lệ nhưng **sai hình** (gốc không phải object, hoặc `enabledPlugins`/`extraKnownMarketplaces` có mặt mà không phải object), When chạy `--write`, Then exit 3, file **không bị chạm**, stderr nêu đúng lối («không phải object — không ghi đè» / «khoá <tên> không phải object»).
- AC-3: Given file đã đúng sau một lần ghi, When chạy `--write` lần hai, Then nội dung file **không đổi một byte**, exit 0, stdout có «đã khai, không đổi».
- AC-4: Given `.claude/settings.json` **không phải JSON hợp lệ**, When chạy `--write`, Then exit 3, file **không bị chạm** (bytes trước/sau giống hệt), stderr có «settings.json không đọc được — không ghi đè».
- AC-5: Given repo không có `.claude/settings.json`, When chạy **không** có `--write`, Then không file nào được tạo và stdout in kế hoạch có đủ bốn tên plugin.
- AC-6: Given tập tên plugin của kit đọc từ `.claude-plugin/marketplace.json`, When so với (a) đầu ra `--list` của script, (b) khối `INIT-PLUGIN-DECLARE` trong `commands/acceptance-init.md`, (c) danh sách `- name@marketplace` (một dòng một tên) trong khối `GUIDE-PLUGIN-DECLARE` của `GUIDE.md`, Then cả ba tập **bằng nhau** và bằng marketplace ∪ {`superpowers@claude-plugins-official`}; một bản sao của init hoặc GUIDE bị gỡ một tên → phép so đỏ với thông điệp nêu **đúng tên thiếu và nơi thiếu**; một bản sao đổi tên marker → đỏ với «không tìm thấy khối». Phép rút tên đi qua **một hàm duy nhất** cho cả ba nơi (round-trip), không grep riêng từng nơi.
- AC-7: Given `GUIDE.md` §5.1 sau hồ sơ, When đọc, Then trong khối `GUIDE-PLUGIN-DECLARE` có (i) danh sách đúng n+1 tên `- name@marketplace`, (ii) khối con `GUIDE-MAY-DAU` chứa **đúng 1** `claude plugin marketplace add phanlemanh/acceptance-gate-kit` và **đúng 1** `claude plugin install acceptance-gate@acceptance-gate-kit`, (iii) khối con `GUIDE-MAY-SAU` chứa **đúng 1** `marketplace add` và **0** lệnh `install`; toàn §5.1 có **0** lần «tuỳ chọn, cài riêng được» và có một câu nói rõ file này **không pin phiên bản**.
- AC-7b: Given **danh sách tài liệu khai tường minh trong hợp đồng này** — mọi `*.md` ở gốc repo, `commands/*.md`, README của từng plugin, cộng `docs/reference/DIAGRAM-RULE.md` và `docs/handoff/2026-08-10-onboarding-doi-gd3.md` — When quét, Then không file nào chứa lệnh `claude plugin install|update|marketplace add` **ngoài** khối `GUIDE-PLUGIN-DECLARE` của `GUIDE.md`, không dòng nào gọi plugin của kit là «tuỳ chọn / tùy chọn / optional / if installed / nếu đã cài» (NFC, cả hai chính tả), và phép đo **assert** sáu file bắt buộc có mặt trong vũ trụ quét. Phạm vi là danh sách này, KHÔNG phải «mọi tài liệu trong repo» — `docs/**` còn lại là sử liệu, ngoài phạm vi (xem Out of scope).
- AC-2c: Given `.claude/settings.json` đã có giá trị **do đội đặt** trong chính khoá của kit (`enabledPlugins.<plugin>: false`, hoặc `extraKnownMarketplaces.acceptance-gate-kit.source` trỏ nguồn riêng), When chạy `--write`, Then các giá trị đó **giữ nguyên** (không lật `false`→`true`, không thay `source`), plugin chưa khai vẫn được bật `true`, và stdout in một dòng «giữ nguyên (đội đã đặt): …» nêu đúng khoá được giữ.
- AC-8: Given dòng lệnh rút **nguyên văn** từ khối `INIT-PLUGIN-DECLARE` trong `commands/acceptance-init.md` (thay `${CLAUDE_PLUGIN_ROOT}` bằng gốc repo, `<path>` bằng một repo nháp), When **thực thi** dòng đó bằng `node`, Then exit 0 và repo nháp có `.claude/settings.json` với tập khoá bằng đầu ra `--list`; và khối đó nằm **sau** marker `INIT-CI-COPY-LIST>>>` và **trước** dòng «6. Print:», câu in cho người có «commit file này». Một bản sao init sửa `--write` thành `--writ` → lệnh rút ra exit 4 → đỏ «lệnh trong init không chạy được».
- AC-9: Given `.claude-plugin/marketplace.json` **không tồn tại** ở đường dẫn suy từ vị trí script (hoặc `--marketplace <path>` trỏ vào chỗ không có file), When chạy `--write`, Then exit 4, stderr nêu **đường dẫn đã thử**, và **không** tạo/đổi `.claude/settings.json`.
- AC-8b: Given bước 5b của `acceptance-init` chạy `plugin-declare.mjs` và script trả **exit 3 hoặc 4** (file không được ghi), When đọc chỉ dẫn của bước đó, Then nó BẮT BUỘC rẽ nhánh theo mã thoát: exit 0 → câu «đã khai… commit file này»; exit 3/4 → in stderr NGUYÊN VĂN + nói rõ chưa khai được và phải sửa gì, **không** bảo ai commit, **không** tuyên bố repo đã sẵn sàng.
- AC-9b: Given `--root` trỏ đường dẫn **không tồn tại**, When chạy `--write`, Then exit 4, stderr «--root trỏ đường dẫn không tồn tại», và **không** thư mục nào được tạo.
- AC-11: Given một repo **đã có** `_acceptance/config.yaml`, When chạy `/acceptance-init`, Then lệnh bỏ qua bước 2–5 (không ghi đè config, không chép lại CI) nhưng **vẫn chạy bước 5b** ghi `.claude/settings.json` và bước 6, kèm một dòng nói rõ «config đã có — bỏ qua khởi tạo, chỉ khai plugin». (Không có đường này thì mọi repo đã khởi tạo — tức mọi consumer hiện có — không bao giờ nhận file khai.)
- AC-10: Given file `_acceptance/repo-khai-plugin/kiem-tay-harness.md` do người viết sau khi mở repo trên một máy khác, When giám khảo đọc, Then file có ngày (ISO), tên máy/phiên, và câu trả lời **rõ ràng có/không** cho đúng hai câu: «`true` cấp repo có thắng `false` cấp user không» và «khoá có kích hoạt lời nhắc *cài* hay chỉ *bật* plugin đã cài»; thiếu một trong ba thì không PASS. (judgment)

## Coverage

- Bỏ coverage-scan — không gian AC một chiều, đã liệt kê trọn trong ma trận §4 của hạt giống (R+ · R0 · R− · RK) cộng ba AC tài liệu/biên và một AC lời-khai; quét thêm không đổi bộ AC (entry d-20260821T120000Z-4101).

## Out of scope

- Pin phiên bản plugin — khoá `enabledPlugins` không mang nghĩa đó; phiên bản theo release + `claude plugin update`.
- Settings cấp **user** (`~/.claude/settings.json`) — của người, không của kit.
- Plugin ngoài bốn tên; `product-management` (plugin desktop, ổ cắm `discovery.brainstorm_skill`).
- Đo **hành vi harness** bằng suite — ngoài tầm; thay bằng AC-10: lời khai kiểm tay có ngày, là **tiền điều kiện** của Cổng Bằng chứng.
- `commands/start.md` — phiên khác đang giữ; hồ sơ này không chạm.
- **`docs/**` ngoài hai file đã khai** — sử liệu (findings, plans, retro cũ); không canh, không sửa. Bản sao thủ tục cài ở đó nếu có là known-limit, không phải vi phạm hợp đồng.
- Luật lớp «mọi tài liệu trong repo» — **đã rút** sau S4 vòng 3: lời hứa vượt phép đo (vũ trụ quét là danh sách, không phải luật) và là nguồn của ba vòng lặp cùng lớp. Phạm vi nay bằng đúng phép đo.

## Notes

- **Thu phạm vi sau S4 vòng 3 (owner chọn, luật dừng-vá lần hai):** ba vòng review lặp cùng lớp vì AC-7b hứa «luật lớp cho mọi tài liệu» trong khi phép đo là allowlist ba thư mục — lời hứa vượt thước. Vòng này **TRỪ**: AC-7b thu về danh sách khai tường minh (thêm 2 file `docs/` đã có bản sao sống, sửa tay), `docs/**` còn lại vào Out of scope. Cộng bốn sửa toàn-vẹn-phép-đo từ vòng 3: chốt eval có ranh giới `[PDn]` (F1 — `PASS: PD1` từng khớp `PD1b`), `run-tests.sh` lặp theo `--ids` của chính file ca (F2), assert vũ trụ quét (F10), `mergeSettings` trả `{settings, kept}` (F4/F7), `isEntryPoint` thôi nuốt lỗi realpath (F8), và AC-8b cho 5b rẽ nhánh mã thoát (F5, high).
- **Mở rộng sau S4 vòng 2 — sửa theo LỚP (owner chọn đường A, luật dừng-vá):** hai vòng review liên tiếp sinh cùng ba lớp (bản-sao-lệch-nguồn · tên-hai-nguồn · chiều-đỏ-yếu), nên vòng này KHÔNG vá từng chỗ: AC-7b viết lại thành luật LỚP quét mọi tài liệu mặt người (không danh sách ngoại lệ — mọi lệnh cài/cập nhật chỉ được sống trong khối GUIDE), `marketplace.json` thiếu `name` → exit 4 như ba lối thiếu khác, hợp nhất thôi lật giá trị đội (AC-2c), lỗi hệ thống tệp về đúng exit 3, và AC-11 mở đường cho repo đã init. Ca kiểm: 16 (PD1·1b·1c·2·2b·2c·3·4·4b·5·6·7·7b·8·9·9b). Chiều đỏ tự nó bắt được **hai lỗi thật của chính phép đo** trong lượt này (regex mù chính tả «tùy»; `split('')` cắt văn bản thành ký tự) — cả hai đã vá.
- **Mở rộng sau S4 vòng 1 (BLOCKED hạ tầng, review vẫn trả 8 finding ngoài hợp đồng):** AC-2b · AC-7b · AC-9b + vế «một nguồn tên» của AC-1 + E2 viết lại chiều đỏ + chốt «PD_CASES lạ không xanh» — đi làn V, cửa veto mở (entry d-…-4107). Triage máy xếp cả 8 là ngoài hợp đồng; máy mở rộng thay vì đẩy 8 mục lên cổng vì tất cả cùng lớp kit cấm (fail-open · bản sao lệch nguồn · chiều đỏ rỗng) và đảo rẻ.

- **Tiền điều kiện signoff:** AC-10 — `kiem-tay-harness.md` phải tồn tại và trả lời rõ hai
  câu trước khi trình Cổng Bằng chứng; bằng chứng máy (AC-1…9) chỉ chứng minh FILE đúng.

- Nguồn tên: `.claude-plugin/marketplace.json` suy từ vị trí script (`../.claude-plugin/`),
  có trong cache cài đặt vì plugin `acceptance-gate` có `source: "./"` (kiểm 12 phiên bản).
- Răng của hồ sơ (nếu cần) sống trong `_acceptance/repo-khai-plugin/`, không thêm khoá vào
  `config.yaml` (nếp hạt giống ba-chỗ-tích-luỹ).
- Ca kiểm: file riêng `tests/plugins/plugin-declare.test.mjs`, nối bằng một vòng `for` trong
  `run-tests.sh`, tên ca theo slug (PD1–PD8), không lấy số P toàn cục.
