---
schema_version: 1
feature: Kho mới cài gói road-map có sẵn tệp lộ trình khởi tạo đúng khuôn
slug: kho-moi-cai-goi-road-map
owner: phanlemanh@gmail.com
risk_tier: T2               # chạm scripts/ (khởi tạo mới, config-patch, product-map, lo-trinh) + commands/acceptance-init.md + road-map/README.md — không chạm hooks/**, lib/**, lưới trước-merge
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-15-kho-moi-cai-goi-road-map-design.md
status: signed-off
approved_by: Manh Phan
approved_at: 2026-10-15T07:54:38Z
---

# Acceptance Contract: kho-moi-cai-goi-road-map

## Context

Nấc 2 của ADR 0025, hàng RM4 của lộ trình kit; chủ kho ký Cổng Đáng 15/10 (build, ngưỡng nhận, ngoại lệ luật (b)).
Số đo trước (ô cơ hội): kho thử trống khai lộ trình bằng tay → năm việc tay, `product-map.mjs --check` đỏ cho tới khi
đủ. Vòng thêm bước `5d` vào lệnh khởi tạo kho: kho cài `road-map` ở phạm vi kho thì bước tự làm đủ năm việc, hội tụ
khi chạy lại; kho không cài thì 0 byte. Dựng trên đỉnh nhánh RM2 (bộ ghi `ghiLoTrinh`, `dangChuan`).

Kho thử trong mọi ca do code sinh trong lượt (thư mục tạm, `git init`, `config.yaml` theo khuôn của khối cấu hình
trong `commands/acceptance-init.md`, settings dựng theo từng ca). «Gói» = cây kit đang kiểm; mọi đường dẫn suy từ vị
trí tệp ca. «Bộ máy gốc» = `git archive <gốc so> scripts lib skills commands road-map .claude-plugin` bung trong lượt,
gốc so đọc từ `_acceptance/kho-moi-cai-goi-road-map/goc-so`.

## Criteria

- AC-1: Given kho thử có `config.yaml`, khoá bật `road-map@<tên marketplace>` dựng từ `.claude-plugin/marketplace.json` của cây (tên gói và tên marketplace rút trong lượt), và bảy trạng thái settings — không có tệp nào · `.claude/settings.json` không có khoá · khoá `false` · `true` ở `settings.json` · `true` CHỈ ở `settings.local.json` · `true` ở `settings.json` + `false` ở `settings.local.json` · `settings.json` không phải JSON — đều chạy với HOME trỏ thư mục thử có `~/.claude/settings.json` bật khoá, When chạy NGUYÊN VĂN lệnh trong khối `INIT-LO-TRINH` của `commands/acceptance-init.md` (thay `<path>` bằng kho thử), Then đúng hai ca ghi tệp (`true` ở `settings.json`, có và không có local `false`); bốn ca không bật thoát 0, in dòng «kho chưa cài road-map ở phạm vi kho — không tạo lộ trình» (ca chỉ-local thêm «cài với --scope project») và băm mọi tệp của cây (kể cả tệp chưa theo dõi và `.claude/`) giống trước khi chạy; ca JSON hỏng thoát 3, dòng nêu tên tệp, 0 byte đổi. Chiều đỏ: bản sao bỏ điều kiện bật → ca «không có tệp nào» FAIL nêu tệp bị tạo; bản sao tính `settings.local.json` → ca chỉ-local FAIL «phạm vi local không được bật»; bản sao viết cứng tên marketplace, chạy trên bản sao `marketplace.json` đổi `name` → FAIL «khoá bật không rút từ marketplace.json».
- AC-2: Given kho thử bật `road-map`, chưa khai lộ trình, When chạy khởi tạo, Then có `docs/plan/lo-trinh.json`; `kiemKhuon` trả 0 cờ; tập khoá gốc BẰNG tập viết sẵn {schema, ten, ghi_chu, moc, hang, chan_troi, da_bac} và mọi khoá trừ `ghi_chu` là khoá gốc của `skills/acceptance/references/lo-trinh-template.json` (rút trong lượt), bốn mảng rỗng, `schema` = 1; `ten` = «Lộ trình <tên thư mục kho thử>» (chuỗi ca tự dựng từ tên thư mục, không gọi `tenKho`), kể cả khi chạy từ một `git worktree` tên khác; `dangChuan(nội dung)` = true; `ghi_chu` nêu `/acceptance-gate:cat-luot`. Chiều đỏ: bản sao ghi bằng `JSON.stringify(…)` không thụt → FAIL «tệp không ở dạng chuẩn — bộ tự áp của RM2 không ghi được».
- AC-3: Given ba kho thử bật `road-map` — `t1_skip_globs` có `docs/**` và `PRODUCT-MAP.md` mà không phủ `LO-TRINH.html` · có `"*.html"` · không có khối `risk_tiers` nào — và bộ đường mẫu viết sẵn {`docs/x.md`, `PRODUCT-MAP.md`, `LO-TRINH.html`, `src/a.ts`, `trang.html`}, When chạy khởi tạo, Then `docCacTep` đọc lại đúng `[docs/plan/lo-trinh.json]`; tập đường mẫu được `match_globs` (rút từ `scripts/pre-merge-check.sh` như `product-map.mjs`) miễn SAU khởi tạo BẰNG tập TRƯỚC cộng `LO-TRINH.html` ở cả ba kho (đối chứng dương: tập trước khác rỗng ở hai kho có khối); `git diff --numstat` của `config.yaml` có 0 dòng xoá; ca `"*.html"` không thêm dòng nào chứa `LO-TRINH.html`; không còn `config.yaml.bak`; `config-patch.mjs --append` trên mục đã có thoát 2 không ghi. Chiều đỏ: bản sao bỏ bước miễn trừ → `product-map.mjs --check` của kho thử FAIL với ĐÚNG câu «không glob nào trong risk_tiers.t1_skip_globs phủ LO-TRINH.html».
- AC-4: Given kho thử theo khuôn khởi tạo mà chỉ khai `lo_trinh.tep` bằng tay (đối chứng của số đo trước), When chạy `product-map.mjs --check` thì thoát 1 (ca ghim mã và câu); Given cùng kho thử chạy khởi tạo rồi `git add -A && git commit`, When chạy `product-map.mjs --root <kho> --check`, `start-scan.mjs` và `lo-trinh.mjs --ra-soat`, Then `--check` thoát 0 và in «LO-TRINH.html khớp tệp ý định và hồ sơ.»; JSON quét không có khoá `loTrinhChuaKhai` và `loTrinh.loi` = null; `--ra-soat` thoát 0, stdout rỗng; `PRODUCT-MAP.md` do bước khởi tạo vẽ khi và chỉ khi kho đã bật bản đồ (`t1_skip_globs` có `PRODUCT-MAP.md`) mà tệp vắng — kho thử chưa bật bản đồ không nhận tệp ấy (sửa ở S3, sổ `fix` — vế cũ «không tạo PRODUCT-MAP.md» làm `--check` đỏ ở mọi kho mới theo khuôn khởi tạo).
- AC-5: Given kho thử bật `road-map`, When chạy khởi tạo trên bốn trạng thái — đã chạy đủ một lần (chạy lần hai) · chưa khai mà `docs/plan/lo-trinh.json` đã có (nội dung bất kỳ) · `LO-TRINH.html` đã có với nội dung cũ · đứt sau bước k của năm bước với k ∈ {1, 2, 3, 4} (bản sao tiêm `process.exit(9)` ngay sau bước k, ma trận bốn phần tử viết trước) rồi chạy lại một lần bằng bản lành — Then lần hai: 0 byte đổi, một dòng «lộ trình đã sẵn»; tệp chiếm chỗ: thoát 2, dòng nêu `docs/plan/lo-trinh.json`, 0 byte đổi; trang cũ: không bị ghi lại; mỗi điểm đứt k: lần chạy lại thoát 0 và băm cây BẰNG băm của kho thử chạy liền một mạch (đối chứng: bản tiêm thật sự thoát 9 ở bước k). Chiều đỏ: bản sao bỏ phép kiểm «tệp đã có» → ca tệp chiếm chỗ FAIL «tệp của kho bị ghi đè»; bản sao đảo thứ tự (tệp trước khoá) → phần tử k = 1 FAIL «thoát 2 trên tệp do khởi tạo ghi».
- AC-6: Given kho thử bật `road-map` đã chép lớp CI theo `INIT-CI-COPY-LIST` trừ các mục mang dấu `[only-if-declared: lo_trinh]`, When chạy khởi tạo, Then đúng tập tệp mang dấu ấy (rút từ khối trong lượt, ≥ 2) được chép, mỗi tệp giống từng byte bản gói; rồi chạy BẢN CHÉP `node scripts/product-map.mjs --root . --check` của kho (sau commit) thoát 0. Given kho chưa chép lớp CI → không tệp nào dưới `scripts/` được tạo; Given kho có một bản chép mang dấu mà khác bản gói → tệp ấy giữ nguyên byte, đúng một dòng «bản chép khác bản gói». Chiều đỏ: bản sao danh sách bỏ một mục mang dấu → bản chép `--check` FAIL nêu `MODULE_NOT_FOUND` hoặc tên tệp thiếu.
- AC-7: Given kho thử vừa khởi tạo (0 việc), When chạy `start-scan.mjs`, Then dòng «Hàng kế» của `loTrinh.dong` BẰNG chuỗi viết sẵn «Lộ trình chưa có việc nào — thêm việc bằng skill cắt lượt (/acceptance-gate:cat-luot), rồi mở bằng /feature-loop:feature-loop <mã>»; Given kho thử có việc mà không việc nào đủ điều kiện, dòng ấy giống từng byte bộ máy gốc; Given ca ghi thêm một hàng chép từ hàng đầu của `lo-trinh-template.json` (rút trong lượt; đổi `ma` thành `1`, bỏ `slug`, `dot`, `phu`) vào tệp khởi tạo bằng `ghiLoTrinh`, When chạy NGUYÊN VĂN khối `S0-MO-O` của SKILL feature-loop với mã ấy, Then JSON có `moi: true`, ô cơ hội có `lo_trinh_ma: <mã>`, và sau khi vẽ lại + commit `product-map.mjs --check` thoát 0; và Given tệp ấy thêm (bằng `ghiLoTrinh`) một mốc phát hành đã qua ngày chứa hàng `1` và một mốc chiến dịch phát hành ngày tương lai mang `chinh_sach: {tu_ap: true, nhip_ngay: 1}`, When chạy `lo-trinh.mjs --ap --write` hai ngày liền (`ACCEPTANCE_TODAY`), Then cả hai lần thoát 0, ngày một tệp lộ trình giữ byte (báo trước), ngày hai tệp đổi (hàng `1` rời mốc đã qua) và `dangChuan` vẫn true — bộ tự áp của RM2 chạy được trên tệp khởi tạo. Chiều đỏ: bản sao giữ câu cũ cho ca 0 việc → FAIL nêu câu nhận được.
- AC-8: Given `commands/acceptance-init.md` của cây, When rút khối `INIT-LO-TRINH` và đọc bước 1, Then khối có đúng một dòng lệnh gọi `lo-trinh-khoi-tao.mjs` với `--root <path> --write`; bảng nhánh mã thoát trong khối có ĐÚNG tập mã {0, 2, 3} và mỗi mã có một kho thử của AC-1/AC-5 cho ra nó (round-trip); bước 1 nêu `5d` trong các bước vẫn chạy khi cấu hình đã có; mọi khối máy đọc khác của tệp (`INIT-CI-COPY-LIST`, `INIT-PLUGIN-DECLARE`, `CONSUMER-ALLOW-ADVICE`) giống từng byte bộ máy gốc; `road-map/README.md` mục «Cài cho một kho» nêu `/acceptance-gate:acceptance-init`. Chiều đỏ: bản sao khối thêm mã 4 vào bảng → FAIL «mã 4 không kho thử nào cho ra».
- AC-9: Given mọi kho trên máy có `_acceptance/config.yaml` dưới thư mục `KHO_GOC` (mặc định `~/dev`, ca tự dò, ≥ 1; không dò được → thoát 2 nêu đường — mù, không xanh), When chạy khởi tạo trên bản sao `git archive HEAD` của từng kho kèm `.claude/` đang có, Then mỗi kho không bật `road-map` ở phạm vi kho cho 0 byte đổi và đúng dòng «kho chưa cài road-map…»; và trên bản sao của kit với `road-map: true` được thêm vào settings, khởi tạo cho 0 byte đổi ngoài `.claude/settings.json` (kho đã có lộ trình — bước 1–5 thấy đủ). Ca in danh sách kho đã đo.

## Coverage

Quét không gian theo preset entity-feature, thực thể = một kho lúc chạy bước khởi tạo lộ trình. Chân sản phẩm
`[SUY-TỪ-REPO: commands/acceptance-init.md, scripts/plugin-declare.mjs, scripts/product-map.mjs]` + số đo 15/10 trên
14 kho của máy (ô cơ hội); chân ngành `[NGÀNH: create-react-app / cargo new — scaffold chỉ tạo khi đích vắng, từ chối
ghi đè]` `[NGÀNH: Terraform/Ansible — bước hội tụ, chạy lại không đổi gì]` `[CE chưa kiểm chứng]`.

- Trục A — gói road-map: không cài · khai false · phạm vi kho · phạm vi local · phạm vi người dùng · settings hỏng  [thước CE: tài liệu `claude plugin install --scope`, `plugin-declare.mjs`] → AC-1, AC-9
- Trục B — lộ trình: chưa khai · khai có tệp · khai tệp vắng · chưa khai mà đích bị chiếm  [thước CE: `docCacTep`, `docTep`] → AC-2, AC-5, AC-9
- Trục C — cấu hình: miễn trừ thiếu · phủ bằng glob rộng · không có khối · đã đủ  [thước CE: `match_globs` của lưới trước-merge] → AC-3, AC-5
- Trục D — lớp CI chép: chưa chép · chép thiếu tệp lộ trình · chép lệch bản  [thước CE: dấu `only-if-declared` của `INIT-CI-COPY-LIST`] → AC-6
- Trục E — bước kế của người: `--check` · thẻ khởi động · rà soát · mở vòng từ hàng  [thước CE: ngưỡng ô cơ hội] → AC-4, AC-7
- Trục F — lời dặn trong lệnh khởi tạo  [thước CE: khối máy đọc của `acceptance-init.md`] → AC-8

## Đường đo

- Ngưỡng của ô cơ hội («còn việc tay nào trong năm việc; `--check` có thoát 0 ở commit khởi tạo») — số đọc trên kho
  thật đầu tiên cài `road-map` (git log của kho đó). Vòng bảo đảm vật cho cả năm việc trên kho thử máy sinh: AC-2 (tệp),
  AC-3 (khoá + miễn trừ), AC-6 (bản chép CI), AC-4 (trang + `--check` ở commit khởi tạo), AC-7 (vòng đầu).
- Kho thật: tới 19/11 chưa kho nào cài → «chưa đọc được ở đây». AC-9 đo phía không-đổi trên mọi kho của máy.

## Out of scope

- Nấc 3 của ADR 0025 (mở vòng từ mô tả tự do thì máy thêm hàng vào tệp lộ trình) — Hỏi-1 ở Cổng Phạm vi; máy khuyên ghi vào hàng RM5.
- Nấc 4 (chặn mở vòng không thuộc hàng) — hàng RM5.
- Lệnh `/road-map:khoi-tao` riêng — sẽ là một lệnh khoá mới (ADR 0002 + P32), không cần khi lệnh khởi tạo kho đã là cửa vào.
- Bật bản đồ sản phẩm cho kho chưa bật, cài gói `road-map` hộ kho, hay khai `road-map` trong `plugin-declare.mjs` — mỗi thứ là quyết định riêng của kho; bước chỉ nói ra một dòng.
- Hàng mẫu trong tệp khởi tạo — sẽ hiện thành «hàng kế» giả trên kho thật.
- Ghi đè bản chép CI lệch phiên bản — chép lại theo đợt phát hành (luật re-pin theo release).

## Notes

- CỘNG (ADR 0018) duyệt đích danh bằng chữ ký Cổng Phạm vi: script `lo-trinh-khoi-tao.mjs` · bước `5d` của `acceptance-init` · chế độ `--append` của `config-patch.mjs` · hàm `veTrangLoTrinh` export từ `product-map.mjs`.
- `config-patch.mjs` và `product-map.mjs` nằm trong danh sách chép CI (`product-map.mjs`) hoặc được kho gọi trực tiếp — ghi chú phát hành nêu «chép lại».
- Phụ thuộc RM2: bộ ghi `ghiLoTrinh` + `dangChuan`. Nhánh dựng từ đỉnh nhánh RM2; RM2 gộp main thì gộp main vào nhánh này.
- Known limits — chọn ở Cổng Bằng chứng 2026-10-16:
  - Ngoài-2: Khi cấu hình của kho khai đường lộ trình trỏ ra ngoài kho, bước khởi tạo từ chối và báo «không ghi gì».
  - Ngoài-3: Hai bài kiểm của tính năng này có thể vẫn xanh dù bước kiểm tương ứng không chạy thật.
  - Ngoài-7: Với kho viết danh sách cấu hình theo kiểu gọn, bước thêm miễn trừ có thể làm tệp cấu hình hỏng và các công cụ khác không đọc được.
  - Ngoài-8: Một bài kiểm có thể xanh dù bước khởi tạo không chạy.
  - Ngoài-9: Bài kiểm cho kho chưa chép bộ kiểm có thể xanh dù lần khởi tạo chưa chạy tới đó.
  - Ngoài-10: Bài kiểm trang cũ có thể xanh dù lần khởi tạo đã dừng sớm.
  - Ngoài-11: Bài kiểm việc từ chối thêm mục trùng không phân biệt được lý do từ chối.
  - Ngoài-12: Bài kiểm chiều đỏ của bản đồ có thể chấp nhận một lỗi khác với lỗi định bắt.
  - Ngoài-13: Bài kiểm lời dặn trong lệnh khởi tạo chỉ kiểm có nhắc bước 5d, không kiểm nó nằm trong nhóm bước vẫn chạy.
  - Ngoài-14: Kịch bản đứt giữa lúc chép bộ kiểm chưa từng được thử thật.
  - Ngoài-15: Nếu tệp cấu hình của kho viết danh sách miễn trừ theo kiểu gạch đầu dòng sát lề, bước khởi tạo thêm mục mới vào sai chỗ và tệp cấu hình trở thành không hợp lệ với các công cụ đọc cấu hình chuẩn bên ngoài.
  - Ngoài-16: Phép kiểm xác nhận trang lộ trình có sẵn không bị ghi đè có thể báo xanh ngay cả khi bước khởi tạo hoàn toàn không chạy, nên màu xanh của riêng ca này chưa đủ để tin.
  - Ngoài-17: Phép kiểm kho chưa chép lớp CI có thể báo xanh dù bước khởi tạo chết ngay từ đầu, nên người đọc kết quả có thể tin nhầm là hành vi đúng đã được xác nhận.
  - Ngoài-18: Phép kiểm xác nhận kho chưa bật bản đồ không bị vẽ thêm bản đồ có thể xanh dù bước khởi tạo không làm gì cả, nên lời hứa này chưa được chứng minh chắc bằng ca đó.
  - Ngoài-19: Khi kho khai tệp lộ trình nằm ngoài kho, công cụ báo «từ chối, không ghi gì» nhưng thực ra đã thêm một dòng miễn trừ vào cấu hình của kho.
  - Ngoài-20: Bộ kiểm tra không phân biệt được hai lý do từ chối khi thêm trùng một mục miễn trừ, nên nếu chế độ thêm bị hỏng thì bộ kiểm tra vẫn xanh.
  - Ngoài-21: Nếu bản công cụ kiểm tra chép sẵn trong kho cũ hơn bản trong gói, trang lộ trình vẽ lúc khởi tạo có thể bị kiểm tra của kho báo đỏ ngay ở commit đầu.
  - Ngoài-24: Nếu gói được cài qua một thư mục là đường tắt, lệnh khởi tạo lộ trình im lặng không làm gì và báo xong.
  - Ngoài-25: Khi kho khai tệp lộ trình nằm ngoài kho, lệnh báo «từ chối, không ghi» nhưng đã thêm một dòng miễn trừ vào cấu hình.
  - Ngoài-26: Khi mọi kho trên máy đều đã cài road-map, phép đo trên các kho thật vẫn báo xanh dù không đo kho nào.
  - Ngoài-27: Lời hứa «đứt giữa chừng thì chạy lại là xong» chưa từng được thử cho bước chép công cụ kiểm tra vào kho.
  - Ngoài-28: Bộ kiểm tra không phân biệt được «kho đã có lộ trình đầy đủ» với «công cụ không nhận ra kho đã bật».
  - Ngoài-29: Bộ kiểm tra không phân biệt hai lý do từ chối cùng một mã, nên nếu chế độ thêm hỏng nó vẫn xanh.
  - Ngoài-30: Phép đo trên các kho thật có thể báo xanh mà không đo kho nào khi mọi kho đã cài road-map.
  - Ngoài-31: Nếu ai đó sau này sửa lời dặn để 5d bị xếp vào nhóm bước bỏ qua, bộ kiểm tra vẫn xanh.
- Mở hợp đồng mới (Ngoài-1, Ngoài-6) — ghi thành hạt giống `docs/plans/2026-10-16-hat-giong-khoi-tao-lo-trinh-im-lang.md`, không tạo ô.
