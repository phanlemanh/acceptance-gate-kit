---
schema_version: 1
feature: Máy tự định tuyến mục Ngoài-n mà chính máy đề xuất known-limits hoặc wont-fix — kho bật bằng một khoá, máy ghi dòng sổ gate2 phân biệt được với người kèm lệnh đảo một dòng, thẻ Cổng 2 hiện chúng là dòng báo, làn V chạy được; kho không bật không đổi byte nào
slug: ngoai-n-tu-dinh-tuyen
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli, config, docs]
status: approved
design_doc: docs/superpowers/specs/2026-10-11-ngoai-n-tu-dinh-tuyen-design.md
approved_by: manh
approved_at: 2026-10-11
---

# Acceptance Contract: ngoai-n-tu-dinh-tuyen

## Context

Gốc: crm-onehub/_acceptance/okr-mau-xoa-cau-hinh — T2, PASS, 0 UNCERTAIN, năm mục Ngoài-n đều đề xuất
`known-limits`; người định tuyến đúng năm đề xuất ấy rồi ký Cổng 2. Nền đo:
`docs/findings/2026-10-11-khao-sat-chi-phi-actions-va-thoi-gian-phien.md` §3, §5 (đề 2 + 3 hợp nhất), §7 mục 2.
Dự báo đo bằng vị từ `xanhSach` thật trên 71 hồ sơ đợt crm `sau-14-10`: làn V 0 → 37, mời ký 71 → 34, mục
người phân xử 565 → 172 (design doc §2). CỘNG — chủ kho đồng ý mở vòng 11/10; phạm vi chốt ở cổng này.

Thuật ngữ:
- **bên ghi** = `scripts/dinh-tuyen-may.cjs` (mới, gói acceptance-gate).
- **khoá kho** = `feature_loop.ngoai_n_tu_dinh_tuyen` trong `_acceptance/config.yaml`.
- **dòng máy** = dòng `decisions.jsonl` do bên ghi viết: `stage: gate2`, khoá `may: "dinh-tuyen-ngoai-n"`, KHÔNG
  có `decided_by`. **dòng người** = dòng `stage: gate2` không mang khoá `may`.
- **mục** = một finding trong khối «Ngoài hợp đồng» của `review-findings.md`, đọc bằng `parse` của
  `lib/out-of-contract.cjs`; nhãn `Ngoài-<vị trí>`.
- **hồ sơ đủ điều kiện** = `status: verified` · `risk_tier: T2` · `verdict: PASS` · không chữ `UNCERTAIN` trong
  báo cáo · `bypass_used` không true · `enforcement_mode` khác `off` · `triage_failed` không true ·
  `review-findings.md` không `suspect_empty` và không khối «Chưa phân loại».
- **0 byte** = băm SHA-256 của `contract.md`, `decisions.jsonl`, `evidence-report.md`, `run-log.jsonl`,
  `review-findings.md` của hồ sơ trước == sau.
- **kho thử** = kho git do chính ca kiểm dựng trong thư mục tạm; hợp đồng rút từ `CONTRACT-FRONTMATTER-TEMPLATE`,
  mục rút từ `OOC-ITEM-TEMPLATE` của `feature-loop/workflows/acceptance-verify.js`.

## Criteria

- AC-1: Given một kho thử có hồ sơ đủ điều kiện với hai mục `known-limits`, When chạy bên ghi `--write` với khoá
  kho ở bốn trạng thái — vắng, `false`, `true`, và giá trị sai `yes` — Then vắng và `false` thoát 0, stdout đúng
  một dòng chứa «tắt», 0 byte; giá trị sai thoát 2, stderr gọi tên khoá kèm «true | false», 0 byte; `true` thoát
  0 và ghi (AC-2). Chiều đỏ: bản sao bên ghi coi khoá vắng là bật → ca «vắng» đỏ nêu «khoá vắng mà vẫn ghi».
- AC-2: Given kho thử bật khoá, hồ sơ đủ điều kiện với ba mục theo thứ tự `known-limits`, `wont-fix`,
  `known-limits — vì <chú thích>`, When chạy bên ghi `--write`, Then `decisions.jsonl` nhận đúng ba dòng máy theo
  thứ tự mục; mỗi dòng có đủ và chỉ các khoá của khuôn có marker `DINH-TUYEN-MAY-LINE` trong bên ghi (`id`,
  `type: revisit`, `stage: gate2`, `at`, `decision`, `why`, `cost_if_wrong`, `may`, `tieu_de`, `dao`) và không có
  `decided_by`; `decision` lần lượt là `Ngoài-1: ghi Known limits`, `Ngoài-2: chấp nhận, không sửa`, `Ngoài-3:
  ghi Known limits` (chữ người rút từ `OOC_GLOSS_NGUOI`); `id` khớp `d-<UTC>-<n>` với `<n>` = số dòng của sổ sau
  khi ghi dòng đó; `tieu_de` bằng tiêu đề mục; `dao` bằng `/acceptance-gate:signoff <slug> Ngoài-<n>: mở hợp đồng
  mới; Ký`. `## Notes` của hợp đồng có thêm đúng hai gạch, mỗi gạch chứa `Ngoài-1`/`Ngoài-3` và câu «Người dùng
  thấy gì» của mục; mục `wont-fix` không có gạch. Frontmatter hợp đồng, `evidence-report.md`, `run-log.jsonl`,
  `review-findings.md` byte-bằng. Stdout đúng một dòng bắt đầu `dinh-tuyen-may: 3 mục (known-limits 2 · wont-fix
  1)`. Hợp đồng không có `## Notes` → mục được tạo ở cuối và chứa hai gạch. `--check` in cùng dòng, 0 byte. Chiều
  đỏ: bản sao bên ghi viết `decided_by: "may"` → ca nêu «dòng máy mang decided_by».
- AC-3: Given kho thử bật khoá, hồ sơ đủ điều kiện, When mỗi hàng của ma trận viết sẵn dựng một hồ sơ gồm mục
  của hàng ĐỨNG CẠNH một mục đối chứng `known-limits` chưa định tuyến — mục của hàng là: đề xuất `new-contract`;
  chữ người «ghi Known limits» ở chỗ token; thiếu dòng `Đề xuất:`; `known-limits` đã có dòng người gọi tên nó;
  `known-limits` đã có dòng người dạng khoảng «Ngoài-1 đến Ngoài-2»; `wont-fix` đã có dòng máy khớp tiêu đề — Then
  mỗi hàng thoát 0, sổ thêm ĐÚNG MỘT dòng máy và dòng ấy gọi tên mục đối chứng, 0 dòng mới gọi tên mục của hàng,
  stdout bằng `dinh-tuyen-may: 1 mục (known-limits 1 · wont-fix 0)` (ca in số hàng == độ dài ma trận == 6). Chạy
  bên ghi lần hai trên hồ sơ của AC-2 → 0 byte, stdout `dinh-tuyen-may: 0 mục`. Nhãn so theo SỐ, không theo chuỗi
  con: hồ sơ 11 mục có dòng máy cho `Ngoài-1` (tiêu đề A) và `Ngoài-11` (tiêu đề K) → chạy lại thoát 0, `0 mục`,
  không báo lệch. Chiều đỏ: bản sao bên ghi bỏ bước hỏi sổ → hàng «đã có dòng người» đỏ nêu «ghi đè định tuyến
  của người»; bản sao thoát 1 ngay sau khi đọc khoá → cả sáu hàng đỏ (đối chứng không nhận dòng); bản sao so nhãn
  bằng chuỗi con → hàng 11 mục đỏ nêu «Ngoài-1 lẫn Ngoài-11».
- AC-4: Given kho thử bật khoá với hai mục `known-limits`, When hồ sơ trượt đúng một vế ở từng hàng của ma trận
  viết sẵn — `status: implemented`, `risk_tier: T3`, `verdict: PENDING-JUDGMENT`, báo cáo có một khối eval
  `UNCERTAIN`, `bypass_used: true`, `enforcement_mode: off`, `triage_failed: true`, `review-findings.md` có `**` mà
  không đọc ra mục, `review-findings.md` có khối «Chưa phân loại» — Then mọi hàng thoát 0, 0 byte, stdout một dòng
  bắt đầu «không định tuyến:» nêu đúng vế trượt (ghim chuỗi mỗi hàng); hàng đối chứng đủ điều kiện ghi hai dòng.
  Ca in số hàng == 10. Vi phân với bên đọc làn V: trên CÙNG mười hồ sơ, ở mọi hàng mà vế trượt cũng là một điều
  kiện của `xanhSach` (verdict · bypass · enforcement · hạng · UNCERTAIN), `khong-can-nguoi.mjs --check` thoát 2
  và lý do nó in nêu cùng vế. Một nguồn cho danh sách vế: mã vế của bên ghi chứa mọi mã của khối
  `EVIDENCE-XANH-SACH-BLOCK` (`skills/acceptance/references/evidence-report-template.md`) trừ `sections` (ca rút
  khối và so tập); báo cáo của các hàng dựng từ khối `EVIDENCE-SECTIONS-TEMPLATE`, hàng UNCERTAIN chèn khối
  `JUDGMENT-BLOCK-TEMPLATE` của cùng khuôn. Chiều đỏ: bản sao bên ghi bỏ vế T2 → hàng T3 đỏ nêu «T3 bị máy định tuyến».
- AC-5: Given kho thử git (cùng khuôn ca LV5 của `tests/plugins/lan-v.test.mjs`: chép lib + recheck của kit), hồ
  sơ T2 PASS `verified` chưa ký, khoá bật, hai biến thể mục — (a) `known-limits` + `wont-fix`; (b) thêm mục thứ ba
  `new-contract` — When chạy `khong-can-nguoi.mjs --check` và `pre-merge-check.sh --base basepoint` trước và sau
  bên ghi `--write` (sổ + hợp đồng commit), Then trước: cả hai biến thể còn cần người (`--check` thoát 2;
  lưới in `VIOLATION [<slug>]`); sau: (a) `--check` thoát 0 và lưới không in VIOLATION cho slug; (b) `--check`
  thoát 2 với lý do nêu đúng `Ngoài-3` và lưới vẫn VIOLATION. Chiều đỏ: bản sao bên ghi viết `decision` thiếu nhãn
  `Ngoài-<n>` → biến thể (a) sau vẫn chặn, ca nêu «dòng máy không mở được làn V».
- AC-6: Given hồ sơ của AC-2 sau khi ghi, When review-findings đổi thứ tự hai mục đầu (mô phỏng một lượt chấm
  mới) rồi chạy bên ghi `--write`, Then thoát 2, stderr nêu `Ngoài-1` cùng tiêu đề trong dòng máy và tiêu đề
  hiện tại, 0 byte; `--check` cùng mã. Thẻ Cổng 2 (`gate-card.js --extract`) của hồ sơ ấy không xếp `Ngoài-1` vào
  `routing.bao` và HTML có cờ chứa «dòng máy trỏ mục đã đổi». Chiều đỏ: bản sao bên ghi bỏ so `tieu_de` → ca
  nêu «dòng máy lệch mục mà vẫn đi».
- AC-7: Given hồ sơ của AC-2 (ba dòng máy), When chạy `scripts/gate-card.js --extract` và bản HTML, Then
  `routing.bao` chứa `Ngoài-1`, `Ngoài-2`, `Ngoài-3`, `routing.hoi` không chứa nhãn nào trong ba; `one_shot` vẫn
  chứa `Ngoài-1: ghi Known limits`; `out_of_contract.dinh_tuyen_may` có ba phần tử `{nhan, id, de_xuat, dao}` khớp
  ba dòng máy; `dao` cắt sau tên slug, tách theo `;`, cho đúng hai vế `Ngoài-<n>: <OOC_GLOSS_NGUOI['new-contract']>` và
  `Ký`; HTML ở mỗi mục in «Máy đã định tuyến» kèm `dao` của mục, và khối «Quyết định CHƯA duyệt» in ba
  mục Treo mang chữ «máy định tuyến». Thêm một dòng người `Ngoài-2: mở hợp đồng mới` SAU dòng máy → `Ngoài-2` rời
  `dinh_tuyen_may` và về `routing.hoi`; hai mục kia giữ. Hồ sơ 11 mục có dòng máy cho `Ngoài-1` và `Ngoài-11` với tiêu đề khác nhau → cả hai trong `routing.bao`,
  không cờ «dòng máy trỏ mục đã đổi». Chiều đỏ: bản sao thẻ lấy dòng ĐẦU thay dòng MỚI NHẤT → ca nêu «người
  không thắng máy».
- AC-8: Given cây sau thay đổi, When chạy ca LM20 (`tests/scripts/gate-card-lmcms.test.mjs`), Then LM20 xanh (bản
  ghi mốc định tuyến khớp mọi hồ sơ đã ký — không hồ sơ cũ nào mang dòng máy); một hồ sơ fixture có `review-findings.md` hai mục và sổ không dòng
  máy cho `--extract` có `dinh_tuyen_may: []` và đúng `routing.hoi` gồm `Ngoài-1`, `Ngoài-2` như hôm nay.
- AC-9 (judgment): Given `feature-loop/skills/feature-loop/SKILL.md` và `commands/signoff.md`, When đọc khối giữa
  marker `DINH-TUYEN-MAY` của SKILL và câu mới của signoff, Then khối (i) gọi bên ghi `--write` ở hàng `verified`
  và ở bước PASS của S4, TRƯỚC `khong-can-nguoi.mjs --write`, giải đường gói acceptance-gate qua
  `resolve-plugin.mjs`; (ii) thoát 0 → nói lại đúng dòng in, gộp vào dòng báo làn V, commit sổ + hợp đồng cùng gói
  evidence máy viết; (iii) thoát 2 → vào Gate 2, không chạy `khong-can-nguoi`; (iv) không đổi bảng cổng (khó-đảo
  vẫn hỏi người, chữ quyết vẫn của người); signoff nói (v) câu gộp có `Ký` hoặc `Ngoài-<n>:` trên hồ sơ
  máy-đi-trước đi đường ký thường, và (vi) một mục đã mang dòng máy được định tuyến lại bằng `Ngoài-<n>: …; Ký` trên
  CẢ hồ sơ `machine-cleared` lẫn hồ sơ máy-đi-trước, ghi một dòng người MỚI (không sửa dòng máy). Kèm hai phép
  máy: (a) dòng lệnh RÚT từ khối, thay đường gói bằng gói acceptance-gate của cây, chạy trên kho thử của AC-2 cho
  đúng ba dòng máy (round-trip); (b) so với sha GỐC CỐ ĐỊNH của vòng `d9d1f3a6` (HEAD lúc mở hồ sơ, in ra): đoạn
  «Bất biến dừng» và bảng trạng thái của SKILL chỉ khác bằng hai lời gọi khối, khối `TRONG-DOT`, `GOAL-TEMPLATE`,
  `S5-SHIP-DEFAULT` của SKILL và `GATE-ONESHOT-LAN-V` của bản luật ngôn ngữ byte-bằng. Chiều đỏ: bản sao khối gọi
  tên script sai → ca nêu «lệnh trong khối không chạy»; bản sao SKILL đổi một chữ trong `GOAL-TEMPLATE` → (b) đỏ
  nêu tên khối.
- AC-10: Given `GUIDE.md` và bên ghi, When đọc, Then GUIDE có một đoạn nêu khoá kho, giá trị `true | false`, mặc
  định tắt, điều kiện hồ sơ, cách đảo, và giới hạn dòng máy lệch mục kèm ngưỡng; tên khoá trong GUIDE bằng hằng
  khoá xuất ra từ bên ghi (ca so hai chuỗi). Chiều đỏ: bản sao GUIDE đổi một chữ của tên khoá → ca đỏ nêu tên khoá.

## Coverage

Quét bằng skill `morphological-scan`, preset test-matrix — bảng đủ ở design doc §8.

- Chân sản phẩm: [SUY-TỪ-REPO: lib/out-of-contract.cjs] · [SUY-TỪ-REPO: scripts/khong-can-nguoi.mjs] ·
  [SUY-TỪ-REPO: scripts/gate-card.js] · [SUY-TỪ-REPO: commands/signoff.md].
- Chân ngành: [NGÀNH: Renovate `automerge` — tắt mặc định, bật theo cấu hình kho] (khoá kho) · [NGÀNH: GitHub
  Dependabot + auto-merge — máy đi trước theo luật kho bật, người đảo bằng một thao tác] (đảo rẻ).

Trục:
- Trục A · khoá kho: vắng | false | true | giá trị sai. [thước CE: ba nhánh bộ đọc khoá]
- Trục B · điều kiện hồ sơ: đủ | status≠verified | T3 | verdict≠PASS | UNCERTAIN | bypass | enforcement off |
  triage_failed | findings sai khuôn | chưa phân loại. [thước CE: sáu điều kiện `xanhSach` + hai cờ triage của
  `parse`]
- Trục C · đề xuất của mục: known-limits | wont-fix | new-contract | token lạ hoặc thiếu | có đuôi chú thích.
  [thước CE: `PROPOSALS` + `tokenOf`]
- Trục D · sổ cho mục: chưa dòng | dòng người | dòng máy khớp | dòng máy lệch tiêu đề | người sau máy.
  [thước CE: `daDinhTuyen` + khoá `tieu_de`]

Phân loại:
- **Core:** A → AC-1 · B → AC-4 · B=đủ × C∈{KL, WF} × D=chưa → AC-2 · C∉{KL, WF} và D≠chưa → AC-3 · mặt lưới →
  AC-5 · D=lệch → AC-6 · mặt thẻ → AC-7, AC-8 · mặt SKILL + signoff → AC-9 · khai khoá → AC-10.
- **Later:** lệnh đảo-mà-không-ký · bên đọc lib kiểm `tieu_de` · trang lộ trình / bản đồ sản phẩm đếm riêng hồ sơ
  máy định tuyến (ngưỡng ở design doc §5).
- **Never:** máy định tuyến `new-contract` · máy ghi mục Known limits của báo cáo.

## Out of scope

- Sửa `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` (t3_paths) và đường
  verdict của `feature-loop/workflows/acceptance-verify.js` — bên đọc làn V giữ nguyên; cần chạm chúng = nâng T3.
- Định tuyến mục trong hồ sơ T3, có UNCERTAIN, hay verdict khác PASS — giữ cho người như hôm nay.
- Bật khoá ở crm hay kho nào khác — việc của chiến dịch phát hành mốc 25/10, không phải vòng này.
- Lệnh đảo-mà-không-ký; ký Cổng 2 theo lô; đổ Ngoài-n vào Known limits của báo cáo.

## Notes

- Không ui-check: hồ sơ không có mặt người nhìn của sản phẩm (`surfaces: [cli, config, docs]`; thẻ Cổng 2 là
  vật cli, đo bằng `--extract` + HTML).
- Phép (b) của AC-9 so với sha gốc cố định `d9d1f3a6`: một vòng sau sửa có chủ đích các khối ấy làm nó đỏ ĐÚNG
  (hồ sơ này thôi chứng chúng) — lúc đó eval đổi `status: not-run` kèm `superseded_by` theo GUIDE §7.1, không
  sửa sha. Không so với merge-base: gốc ấy trôi, sau gộp thành so tệp với chính nó (bài học DP7 Ngoài-1).
- Reality đọc ở đợt thử crm 26/10 khi crm bật khoá: số hồ sơ đi làn V, số mục máy định tuyến bị người đảo.
  Ngưỡng xem lại thiết kế: tỉ lệ đảo > 10 % mục máy định tuyến trong một đợt (đo hôm nay 11/237 ≈ 4,6 %).
