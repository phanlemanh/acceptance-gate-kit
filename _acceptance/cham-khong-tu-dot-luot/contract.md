---
schema_version: 1
feature: Lượt chấm không tự đốt lượt — mã thoát máy đọc từ dấu, lượt chặn vì hạ tầng mang nhãn hạ tầng và thử lại cùng round, verified_commit từ máy; thẻ Cổng Phạm vi hiện đủ «sẽ không làm» và mọi bảng phản biện; bảng chi phí S4 tách theo khối; ảnh ui-check neo trong hồ sơ
slug: cham-khong-tu-dot-luot
owner: phanlemanh@gmail.com
risk_tier: T3      # sửa lib/nhan-canh-gay.cjs (khớp t3_paths lib/**)
surfaces: [cli, docs]
status: signed-off    # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by: "Phan Le Manh"
approved_at: 2026-09-27T07:49:56Z
design_doc: docs/superpowers/specs/2026-09-27-cham-khong-tu-dot-luot-design.md
---

# Acceptance Contract: cham-khong-tu-dot-luot

## Context

Lượt 4 OKR ở crm đốt hai round và một lượt gọi người mà không có lỗi sản phẩm nào; quen-mat-khau
và okr-soat-anh-luot-3 khoá vì dòng SUITE mang lý do tự do. Luật đúng đã có (khối ĐỊNH VỊ, K8:
giới hạn là nhãn, hệ thống chết thử lại MỘT lần; bộ phân nhãn `lib/nhan-canh-gay.cjs` từ 2.18.0;
đường thử lại cùng round ở `s4-args.mjs` từ 2.18.3), nhưng ba chỗ để hạ tầng lọt thành vật: mã
thoát do tác tử đoán từ chữ in ra (E21), cờ `killedByTool` bị bộ chấm bỏ khi ghi sổ, và dòng SUITE
không chạy được mang lý do tự do bị khoá thay vì gắn nhãn. Cùng lượt, người ký Cổng Phạm vi ký trên
thẻ thiếu 5/8 mục «sẽ không làm» và thiếu bảng phản biện thứ hai.

Người hưởng: owner (bớt lượt gọi ngoài thiết kế; chữ ký có đủ bề mặt veto) · phiên Claude Code
chạy vòng ở mọi kho tiêu thụ (round không bị hạ tầng đốt, không REJECT giả) · chi phí máy mỗi vòng.
Trace: nguyên tố 2 (bằng chứng không tự dối — mã thoát, commit, cờ là vật máy giữ) và nguyên tố 3
(khoảnh khắc quyết thật — không hỏi người điều K8 đã quyết; thẻ hiện đủ điều chỉ người biết).
Toàn bộ là SỬA: không thêm trạng thái, không thêm khoá cấu hình, không đổi schema hồ sơ.

Source input: `_acceptance/cham-khong-tu-dot-luot/opportunity.md` ·
`docs/findings/2026-09-26-loi-kit-tu-luot-4-okr.md` §3, §6–§10 · design doc ở frontmatter.

## Criteria

- AC-1: Given nguồn bộ chấm `feature-loop/workflows/acceptance-verify.js` có ĐÚNG MỘT khối marker `EXIT-MARK` định nghĩa khung bọc lệnh, When workflow chạy (harness `tests/workflows/`) với eval máy và lệnh suite, Then prompt của MỌI tác tử lane machine chứa khung bọc rút từ khối ấy quanh đúng lệnh `cd <repoRoot> || exit 97 && <cmd>`, còn chuỗi `cmd` trong args, nhãn tác tử, tên `SUITE-*` và `run_id` đúc BẰNG ĐÚNG giá trị của cùng nguồn bộ chấm có khối `EXIT-MARK` thay bằng hàm đồng nhất (đối chứng trong bộ nhớ, không git, không tag); và khung bọc rút từ khối ấy, chạy thật bằng bash trên lệnh do code sinh, in dòng cuối `__EXIT=<n>` với n = mã thoát thật cho các lệnh thoát 0 · 1 · 3 · 97 (bước cd hỏng) · 127, và với lệnh in 74 KB (ASCII) cũng như lệnh in ≥ 30 dòng × ≥ 240 ký tự tiếng Việt có dấu thì toàn bộ đầu ra ≤ 8 000 byte mà dòng dấu vẫn còn. Chiều đỏ: bản sao khung bọc bỏ bước giới hạn đầu ra → ca đỏ ghim «dau ra vuot tran: <số byte>»; bản sao bỏ `printf` dấu → ca đỏ ghim «mat dau __EXIT».
- AC-2: Given kết quả tác tử lane machine có hoặc không có dòng `__EXIT=<n>` trong `outputTail`, When bộ chấm chuẩn hoá kết quả, Then bộ chấm cho đúng mã và nhãn theo ma trận tám hàng viết trước, gồm: (1) tác tử không khai cannotRun + dấu 0 + khai exitCode 1 (hình E21) → mã 0, eval đạt · (2) khai killedByTool + dấu 3 → mã 3, không cannotRun, không `killed_by_tool` · (3) khai killedByTool + không dấu → cannotRun, `killed_by_tool` · (4) khai cannotRun khác (thiếu env) + dấu 0 → mã 0 · (5) khai cannotRun khác + dấu 1 → giữ cannotRun (hạ tầng, không REJECT) · (6) không cannotRun + không dấu + khai mã 1 → mã 1 (giữ) · (7) không cannotRun + không dấu + khai 0 → giữ lời khai (mã 0) — vế «không PASS» đã gỡ theo ngưỡng chết ở lượt chấm 1 (3/11 tác tử chạy lệnh trần, không qua khung bọc; sổ S4-r1) · (8) không cannotRun + dấu 1 + khai 0 → mã 1, REJECT (chiều xanh-giả); số assert = 8. Làn chấm mặt người (executor `ui-check`) không bị luật này chạm (đối chứng: kết quả của làn ấy khai 0 không dấu vẫn đạt). Chiều đỏ: bản sao bộ chấm gỡ bước đọc dấu → hàng (1), (2) và (8) lật; bản sao «dấu chỉ áp khi tác tử khai ≠ 0» → hàng (8) lật; thông điệp ghim số hàng.
- AC-3: Given tác tử lệnh eval hoặc suite trả `cannotRun` + `killedByTool` không kèm dấu, When bộ chấm ghi sổ chạy, Then dòng sổ mang `cannot_run: true`, `killed_by_tool: true`, lý do tác tử NGUYÊN VĂN; `canhGay` của `lib/nhan-canh-gay.cjs` đọc dòng ấy (sổ do bộ chấm sinh, round-trip) ra nhãn `mu`, trạng thái `mo`, và `s4-args.mjs` cho CÙNG round. Chiều đỏ: bản sao bộ chấm bỏ trường `killed_by_tool` → ca đỏ ghim trạng thái `khoa`.
- AC-4: Given dòng SUITE `cannot_run` do bộ chấm sinh, When `canhGay` phân nhãn, Then nhãn đi theo lý do, dòng có lý do (tự do, kể cả nguyên văn hai lý do crm) → `mu` như dòng eval; lý do rỗng (dòng đời trước 2.18.0) → vẫn null, khoá; dòng SUITE `exit_code` ≠ 0 thật → `vat`; lượt có cả SUITE hạ tầng lẫn SUITE `vat` (hình round 2 quen-mat-khau) → khoá, `s4-args` ra round kế. Chiều đỏ: bản sao lib khôi phục nhánh «SUITE lý do tự do → null» → ca đỏ ghim trạng thái `khoa` trên hàng lý do tự do.
- AC-5: Given args có `invokedSha` 40-hex và tác tử provenance trả `verified_commit` khác (bịa hoặc HEAD đã trôi), When bộ chấm dựng prompt báo cáo, Then dòng `verified_commit:` mang ĐÚNG `invokedSha`; args không có `invokedSha` hợp lệ → giữ đường cũ (giá trị tác tử qua bộ lọc hình dạng; rác → bỏ trường). Chiều đỏ: bản sao bộ chấm đảo thứ tự ưu tiên → ca đỏ ghim sha tác tử lọt vào báo cáo.
- AC-6: Given hợp đồng có N mục `## Out of scope`, When `gate-card.js --extract` chạy, Then `scope` phát N mục mang id `OOS-1…OOS-N` theo thứ tự (khuôn phía viết một chỗ có marker); và When thẻ Cổng Phạm vi dựng với bản dịch, Then đủ N mục hiện trên thẻ, mỗi mục một dòng trong khối «sẽ KHÔNG làm»: mục có dòng dịch (khoá `OOS-n` trong `wont_do` — đúng hình crm; khuôn khoá đóng CARD-PLAIN-KEYS không thêm khoá mới, sổ S4-r2) dùng câu dịch, mục không có dùng chữ hợp đồng; `scope_plain` không còn thay các mục; mỗi id dịch không khớp mục nào (`OOS-99`, `AC-99`) bật một cờ vàng «dòng dịch không khớp mục nào: <id>». Round-trip: bản dịch dựng từ id do `--extract` phát → thẻ hiện đủ N câu dịch. Hình crm (8 mục, 5 dịch `OOS-*` trong `wont_do`, một `scope_plain`) → 8 dòng, 0 cờ. Chiều đỏ: bản sao bộ dựng quay về in `scope_plain` → ca đỏ ghim «thieu muc OOS-<n>».
- AC-7: Given `gap-probe.md` có nhiều bảng phản biện ở nhiều mục `##` (hình crm: hai bảng, 5 + 5 hàng), When thẻ Cổng 1 dựng, Then mọi bảng có hàng tiêu đề đúng chữ ký sáu cột — chữ ký rút từ câu định nghĩa bảng trong `feature-loop/skills/feature-loop/SKILL.md` S1#7 (bên viết), không gõ lại — đều được đọc (10 hàng hiện đủ); số hàng phát hiện (ô Sev dạng P0/P1/P2) > p0+p1+p2 khai ở frontmatter → một cờ vàng «bảng phản biện ngoài khai báo: <số hàng> > <tổng khai>»; hàng «Không còn lỗ đáng kể» của hồ sơ `clean` không tính là phát hiện (0 cờ — chiều im); bảng có tiêu đề khác chữ ký không được đọc, trừ đường đọc-cũ: dưới «## Findings», bảng đúng sáu cột mở bằng ô «sev» (tiêu đề chữ khác, hình artifact-platform) vẫn đọc như trước vòng (sổ S4-r1). Hình crm chép NGUYÊN VĂN hai dòng tiêu đề và tên hai mục `##` của `cap-nhat-tuan-okr/gap-probe.md` (đọc 27/09). Chiều đỏ: bản sao bộ dựng dừng sau bảng đầu → ca đỏ ghim «thieu hang bang 2»; bản sao đếm mọi hàng → ca clean đỏ ghim «co gia tren ho so clean».
- AC-8: Given thư mục transcript Workflow do code sinh mà tin người đầu của mọi tác tử mở bằng «[Workflow harness — user request]» và mỗi tác tử có `agent-*.meta.json` mang `description` riêng, When `wf-usage.mjs` tổng hợp, Then nhãn mỗi tác tử = `description` của meta (các nhãn khác nhau), thứ tự dự phòng: meta `description` → thẻ `[wf-label: …]` ở ba tin người đầu → 48 ký tự đầu; thư mục không có meta (hình trước harness mới) cho nhãn như trước vòng (đối chứng). Chiều đỏ: bản sao bỏ nhánh đọc meta → ca đỏ ghim «nhan trung: <nhãn>».
- AC-9: Given eval ui-check, When bộ chấm dựng prompt cho tác tử chấm mặt người, Then mọi đường lưu khung trong prompt là đường TUYỆT ĐỐI dưới `<repoRoot>/_acceptance/<slug>/evidence/`, không còn đường `evidence/` tương đối trơ; và When tác tử trả `screenshotPath` tuyệt đối dưới hồ sơ, Then báo cáo mang đường tương đối `evidence/<tệp>`, để đường máy không lộ vào hồ sơ; đường ngoài hồ sơ giữ nguyên. Chiều đỏ: bản sao prompt quay về đường tương đối → ca đỏ ghim số chỗ `evidence/` trơ.
- AC-10 (judgment): Given ba tài liệu — `feature-loop/skills/feature-loop/SKILL.md`, `skills/acceptance/references/eval-executors.md`, `skills/acceptance/references/tool-kill-rule.md`, When người đọc lạ đọc, Then (a) YÊU CẦU của SKILL nói vòng chạy trong phiên cấp cao có công cụ Workflow, tác tử con không có nó; (b) eval-executors.md nói driver dùng tài nguyên độc quyền (một kho dữ liệu, một trình duyệt) tự xếp hàng trong chính thước, kit không xếp tuần tự thay; (c) khối TOOL-KILL-RULE nói harness lưu đầu ra dài ra tệp và chỉ hiện đoạn đầu — đó KHÔNG phải bị giết, đọc đuôi tệp ấy; mỗi ý đứng một mình đọc được, không mâu thuẫn chữ cũ quanh nó.

## Coverage

Quét Zwicky rút gọn (preset test-matrix), đầy đủ ở design doc §3.

- **Trục 1 — lane × tín hiệu mã thoát** [thước CE: lane rút từ `acceptance-verify.js` — SUY-TỪ-REPO]: machine × (dấu có · dấu mất · khai killed · khai cannotRun khác · khai mã tay) → AC-1, AC-2 toàn phần; suite (cùng lane machine) → AC-1, AC-2, AC-3, AC-4; baseline × * → Out of scope (giới hạn khai); ui-check × * → AC-2 hàng đối chứng + Out of scope.
- **Trục 2 — dòng sổ × nhãn**: eval/SUITE × (killed_by_tool · lý do tự do · lý do rỗng · exit ≠ 0 · hỗn hợp) → AC-3, AC-4 toàn phần.
- **Trục 3 — trường provenance**: invokedSha có/không/rác × giá trị tác tử khớp/khác/rác → AC-5.
- **Trục 4 — thẻ Cổng 1 × nguồn chữ**: mục phạm vi (không dịch · dịch đủ · dịch một phần · id lạ · hình crm) → AC-6; bảng phản biện (một · nhiều · tiêu đề lạ · vượt khai báo) → AC-7.
- **Trục 5 — telemetry × hình transcript**: có meta · không meta · thẻ ở tin thứ hai → AC-8.
- **Trục 6 — ảnh ui**: đường lưu × đường khai (trong/ngoài hồ sơ) → AC-9.
- `[GIẢ ĐỊNH]` Ngưỡng lưu-ra-tệp của harness > 8 000 byte (khung giới hạn theo BYTE, không theo ký tự — gap-probe P2) (đo 27/09: 74 KB bị lưu, preview 2 KB; ngưỡng chính xác chưa đo) — đường đo thật là lượt chấm đầu của chính vòng này.

## Đường đo

- lượt BLOCKED mà mọi mục là hạ tầng ra trạng thái `mo`/`chet-lan-dau` = 100 %: số từ `canhGay` trên run-log crm sau cài (lệnh quét ở findings §10–§11) · AC bảo đảm: AC-2, AC-3, AC-4
- lần owner cho vượt trần / gõ `--round` vì hạ tầng = 0 trên ≥ 10 lượt chấm crm sau cài: đếm tay từ sổ quyết định + hội thoại · AC bảo đảm: AC-2, AC-3, AC-4
- BLOCKED «ma thoat khong doc duoc» ở kho không có sự cố ≤ 1/10 lượt đầu (ngưỡng chết B7): đếm bằng grep lý do trong run-log · AC bảo đảm: AC-1, AC-2
- mục «sẽ không làm» hiện trên thẻ = số mục hợp đồng: số từ `gate-card.js` trên hồ sơ crm `cap-nhat-tuan-okr` sau cài · AC bảo đảm: AC-6
- hàng bảng phản biện trên thẻ = số hàng phát hiện thật: số từ `gate-card.js --extract` trên `crm/_acceptance/cap-nhat-tuan-okr/gap-probe.md` sau cài (kỳ vọng 10) · AC bảo đảm: AC-7
- dòng 4 luật (c) cắt được ở mốc 2.18.5: bảng `usage-report.md` của vòng này có nhãn khối khác nhau · AC bảo đảm: AC-8

## Out of scope

- B6 lớp (b) — đoạn đầu prompt + trường có kiểu + chạy lại khi tác tử dừng vì câu chuyển tiếp: lõi là dặn bằng lời; sau AC-2/AC-4 dòng bị chặn đã ra nhãn hạ tầng và thử lại bằng cơ chế sẵn có. Mở lại khi ≥ 1 vòng BLOCKED do câu chuyển tiếp SAU khi mẫu phiên cấp cao đã áp.
- Phát hiện «cây đổi giữa lượt» (vế phát hiện của B8) — AC-5 chỉ gỡ quyền khai khỏi tác tử. Mở lại khi ≥ 1 hồ sơ ký lệch commit.
- Khung bọc cho lane baseline và lane ui-check (tác tử ui tự soạn lệnh từ `steps`; baseline là tín hiệu phụ) — giới hạn khai.
- B5 (`run_id` không kiểm hình dạng), B9 (ui-check mặc định tuần tự) — sổ, không vào vòng.
- Nửa còn lại lỗi đường nền (phiên ghi tệp hồ sơ lúc suite chạy) — hạt giống.
- Rollout 2.18.5 ra kho tiêu thụ và chiến dịch ghim lại — việc của mốc phát hành.

## Notes

- B12 (AC-3 và một phần AC-4) đã dựng trước vòng trên nhánh `fix/suite-bi-cat-la-ha-tang` (test đỏ `c886122f` → sửa `68d2d60c`), lấy sang nguyên; ca `tests/scripts/suite-bi-cat.test.mjs` nhập vào tệp ca của vòng.
- **Known limits (owner quyết ở Cổng Bằng chứng 27/09, lượt chấm 3):**
  - Ngoài-2: `nhanLyDo` của `lib/nhan-canh-gay.cjs` còn hai nhánh chết (mã hạ tầng, câu tool-kill) và tham số `laEval` không còn đọc sau AC-4 — không đổi phân loại, chỉ gây hiểu nhầm cho người sửa sau. Ngưỡng mở lại: một lượt sửa khôi phục nhầm nhánh «SUITE → null» dựa vào tham số này.
- **Mở hợp đồng mới (owner quyết ở Cổng Bằng chứng 27/09) — ghi hạt giống, không tạo ô (luật «Ô chỉ mở khi có NEO NGOÀI»):**
  - Ngoài-1 → `docs/plans/2026-09-27-hat-giong-the-cong-2-scope-plain-thay-muc.md` (thẻ Cổng 2 vẫn để câu tóm thay các mục «không làm»).
  - Ngoài-3 → `docs/plans/2026-09-27-hat-giong-ca-lan-ui-khong-phan-biet.md` (ca «luật dấu không chạm làn ui» không có chiều đỏ).
