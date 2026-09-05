---
schema_version: 1
feature: inputs của hội đồng tính từ gốc kho — một gốc cho mọi đường dẫn trong evals, vắng thì kêu to
slug: inputs-tinh-tu-goc-kho
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-05T06:20:59Z
design_doc: docs/superpowers/specs/2026-09-05-inputs-tinh-tu-goc-kho-design.md
---

# Acceptance Contract: inputs-tinh-tu-goc-kho

## Context

`s4-args.mjs` giải `inputs` của eval judgment theo thư mục hồ sơ
`_acceptance/<slug>/`, trong khi skill acceptance sinh evals viết theo gốc kho
như `paths`. Args sinh xong với exit 0 mà mọi input trỏ vào file không tồn
tại; hội đồng đọc file rỗng và vẫn phán. Đo trên crm 2026-09-05 (hồ sơ
cai-dat-con-lai-noi-tieng-viet, E19); hồ sơ đợt một cùng hình dạng. Vòng này
chốt MỘT gốc, bắt input vắng dừng có tên, và kéo ba nơi khai luật cho bên viết
về cùng gốc.

Source input: prompt của owner trong phiên crm 2026-09-05, chuyển sang kho kit
theo nếp «lỗi kit đi chip riêng».

## Criteria

- AC-1: Given evals.yaml của hồ sơ khai `inputs` cho một eval judgment bằng đường dẫn tương đối tính từ GỐC KHO (vd `src/a.ts`, `CONTEXT.md`) và các file đó có trên đĩa, When chạy `s4-args.mjs --slug <slug> --root <repo>`, Then script exit 0, sinh tệp args, và `inputs` của eval đó trong tệp BẰNG `<realpath(root)>/<đường dẫn>` cho từng phần tử theo đúng thứ tự — KHÔNG phải `<root>/_acceptance/<slug>/<đường dẫn>` — và mọi phần tử đó tồn tại trên đĩa.
- AC-2: Given một phần tử `inputs` không tồn tại trên đĩa (không ở gốc kho, cũng không ở thư mục hồ sơ), When chạy script, Then exit ĐÚNG 2, thông điệp nêu id eval và đường dẫn NGUYÊN VĂN như đã khai, tệp args KHÔNG được sinh; đối chứng dương trên CÙNG fixture: tạo file đó rồi chạy lại → exit 0, sinh tệp.
- AC-3: Given một phần tử `inputs` viết theo thư mục hồ sơ kiểu cũ (`../../src/a.ts`, `contract.md`) mà file CÓ ở vị trí tính từ thư mục hồ sơ, When chạy script, Then exit 2, không sinh tệp, và thông điệp chứa dạng viết lại theo gốc kho đặt trong «…» BẰNG `path.relative(root, <vị trí cũ>)` (vd «src/a.ts», «_acceptance/<slug>/contract.md»); đối chứng dương cùng fixture: viết lại theo gợi ý → exit 0, sinh tệp.
- AC-4: Given một phần tử `inputs` là đường dẫn tuyệt đối, When chạy script, Then file có thật → giữ NGUYÊN VĂN trong tệp args; file không có → exit 2 nêu đúng đường dẫn đó, không sinh tệp.
- AC-5 (judgment): Given ba nơi khai luật cho bên viết evals — mẫu trong `skills/acceptance/references/eval-executors.md`, bước EVAL-GEN và VERIFY của `skills/acceptance/SKILL.md`, câu mô tả bước chuẩn bị args trong `feature-loop/skills/feature-loop/SKILL.md` — When một người viết evals mới đọc chúng, Then cả ba nói MỘT gốc (gốc kho hoặc tuyệt đối) cho `inputs` giống `paths`, mẫu không còn ví dụ nào theo thư mục hồ sơ, và có nói hệ quả khi input vắng (dừng, exit 2, nêu tên); không chỗ nào còn mô tả hành vi cũ («→ abs path» trần, `contract.md` trần trong `inputs`).
- AC-7: Given một phần tử `inputs` tương đối có tiền tố `_acceptance/<slug>/evidence/` của CHÍNH hồ sơ đang chấm (bằng chứng do ui-check sinh trong lúc chấm), When file đó CHƯA tồn tại lúc sinh args, Then script KHÔNG dừng: phần tử vẫn giải thành `<realpath(root)>/<đường dẫn>`, tệp args sinh ra, và đầu ra lỗi chuẩn có ĐÚNG MỘT dòng khai tên input chưa có; cùng tiền tố nhưng của hồ sơ KHÁC (`_acceptance/<slug-khác>/evidence/…`) mà vắng → vẫn exit 2 như AC-2. Vắng lúc chấm thì hội đồng trả UNCERTAIN theo luật sẵn có của lane, không đổi lane.
- AC-8: Given một phần tử `inputs` trỏ tới đường dẫn TỒN TẠI nhưng là thư mục (không phải file thường), When chạy script, Then exit 2, thông điệp nêu id eval, đường dẫn nguyên văn và vế «là thư mục, không phải file», tệp args KHÔNG được sinh; đối chứng dương cùng fixture: trỏ tới một file trong thư mục đó → exit 0.
- AC-6: Given nhánh này so với mốc gộp với nhánh chính (`git merge-base`), When liệt kê file đổi, Then `feature-loop/workflows/acceptance-verify.js` có diff RỖNG (lane hội đồng không đổi nghĩa: bảng `EVAL-REQUIRED-FIELDS`, nhánh UNCERTAIN, `inputsHash` giữ nguyên vì file giữ nguyên) và tập file mã đổi ngoài `tests/**`, `docs/**`, `skills/**`, `feature-loop/skills/**`, `_acceptance/**`, `.github/**`, `PRODUCT-MAP.md` (bản đồ máy vẽ lại khi thêm hồ sơ) BẰNG đúng tập một phần tử {`feature-loop/scripts/s4-args.mjs`}; bộ kiểm lớp thuần của workflow xanh là đối chứng dương, không phải thước chính. Mỗi vế có chiều đỏ riêng trên clone tạm: chạm `acceptance-verify.js` → đỏ vế một; thêm một file mã lạ ngoài tập trắng → đỏ vế hai nêu tên file.

## Coverage

Quét theo tích hai trục rời rạc; tích đủ vì hàm giải chỉ phân nhánh theo
(kiểu đường dẫn) × (tồn tại trên đĩa). Trục thứ ba là nơi luật sống.

- Trục kiểu đường dẫn khai: gốc kho (AC-1, AC-2) | tuyệt đối (AC-4) | kiểu cũ theo thư mục hồ sơ (AC-3). [thước CE: ba nhánh mà hàm `resolveJudgmentInput` phân biệt — `isAbsolute` · tồn tại ở gốc kho · tồn tại ở đường cũ]
- Trục tồn tại trên đĩa: là file (AC-1, AC-3, AC-4 ô 1) | là thư mục (AC-8) | không có (AC-2, AC-4 ô 2) | không có nhưng là bằng chứng của chính hồ sơ, được sinh trong lúc chấm (AC-7). Ô «kiểu cũ mà không có ở đâu cả» rơi về AC-2 (cùng thông điệp, không gợi ý) — thước là chính chân AC-2. [thước CE: bốn nhánh của `statSync` + tiền tố evidence trong hàm]
- Trục nơi luật sống: mã (AC-1…AC-4) | ba nơi khai cho bên viết (AC-5 — hội đồng phán nội dung, chân grep âm tính canh ví dụ sót) | bên đọc args (AC-6 — không đổi, đo bằng diff). [thước CE: ba file tài liệu có tên trong AC-5 + một file bên đọc có tên trong AC-6]

Ô «đường tuyệt đối trỏ ra ngoài kho» không phân biệt với ô tuyệt đối thường
(script không chặn) — xem giới hạn ở Notes.

## Out of scope

- KHÔNG di trú hồ sơ cũ (khoảng 13 hồ sơ trong kho kit, vài hồ sơ trong crm) sang gốc kho trong vòng này — chúng đã ký; chạy lại S4 sẽ bị chặn có tên kèm gợi ý; sửa lúc ghim lại theo mốc phát hành.
- KHÔNG thêm chế độ đọc hai gốc (thử gốc kho rồi rơi về thư mục hồ sơ) — hai gốc là bệnh, không phải đường đọc-cũ.
- KHÔNG đổi bảng `EVAL-REQUIRED-FIELDS`, nhánh UNCERTAIN cho judgment thiếu `inputs`, hay cách tính `inputsHash` trong workflow.
- KHÔNG đụng `paths` (đã đúng gốc kho) và `carry-plan.mjs`.
- KHÔNG tăng phiên bản gói — kit lên số theo mốc phát hành.

## Notes

- Hạng T2: `feature-loop/scripts/s4-args.mjs`, `skills/**`, `tests/**` ngoài `t1_skip_globs`, ngoài `t3_paths`.
- Fixture do code sinh trong chính lần chạy, đường dẫn suy từ vị trí script; ca so đường dẫn là QUAN HỆ (`path.join(realpath(root), p)`, `path.relative`), không hằng chuỗi. Bản sao để tiêm đột biến chụp TRỌN cây làm việc; mỗi đột biến là MỘT phép thay thế nguyên văn khai trong design doc, chân đo assert mũi tiêm trúng (`cmp` khác) và mutant chạy được (`node --check`) trước khi chấm; chiều đỏ giữ đủ hai vế: exit ≠ 0 VÀ dòng FAIL có tên ca.
- Giới hạn đã khai: đường tuyệt đối trỏ ra ngoài kho vẫn được nhận nếu file có thật — script không chặn, hội đồng đọc được thứ ngoài kho. Không phải mục tiêu vòng này.
- Giới hạn đã khai: ô «kiểu cũ mà không có ở đâu» chỉ báo vắng, không gợi ý — máy không có gì để suy.
- **Known limits (owner xếp ngăn tại Cổng Bằng chứng vòng 2, 2026-09-05):**
  - Lưới thường trực `tests/scripts/s4-args-judgment-inputs.test.mjs` không dọn thư mục tạm sau khi chạy; mỗi lần chạy để lại vài kho git con trong thư mục tạm của máy (Ngoài-1).
  - Hai câu tiếng Anh trong `skills/acceptance/SKILL.md` và `eval-executors.md` dùng từ «dossier» cho `_acceptance/{slug}/` trong khi chỗ khác dùng «workspace»; CONTEXT.md chưa có mục cho từ này (Ngoài-2).
  - Chân grep tài liệu (E7) tuyên quét 3 tiền tố × 2 cú pháp nhưng chỉ chứng minh chiều đỏ cho 1 ô (dạng khối, tiền tố `contract.md`); nhánh inline, chính là dạng tài liệu thật đang dùng, chưa có đối chứng dương (Ngoài-5).
  - Ô «đường cũ mà không có ở đâu cả» chỉ được lấp bằng lời trong Coverage; lưới không có ca cấp đường kiểu cũ vắng cả hai nơi và assert thông điệp không mang gợi ý (Ngoài-6).
- Phạm vi mở lại sau Cổng Bằng chứng vòng 2 theo quyết định owner: AC-7 và AC-8 thêm vào, cùng hàm `resolveJudgmentInput`; các AC cũ giữ nguyên.
- **Known limits (owner xếp ngăn tại Cổng Bằng chứng vòng 3, 2026-09-05):**
  - Tài liệu skill acceptance nói input vắng bị chặn ở bước sinh args; bước đó chỉ có trong vòng feature-loop, đường `/acceptance` trần không có bước này nên phiên chấm phải tự kiểm tồn tại trước khi phái hội đồng (Ngoài-1).
  - Chân grep «tài liệu không còn đường cũ» chỉ sống trong răng hồ sơ, không nằm trong `tests/**`; sau merge không lưới thường trực nào canh ví dụ cũ quay lại (Ngoài-2, trái ADR 0011 — sửa rẻ ở chiến dịch ghim lại kế).
  - Lời chú khối P3 trong `s4-args.mjs` còn tả ca «thư mục» đã bị chặn sớm hơn; ca thật rơi vào nhánh đó nay là bằng chứng miễn trừ chưa có ở vòng ≥2, và panel đó không carry được (Ngoài-3).
  - Miễn trừ bằng chứng của chính hồ sơ chỉ áp cho đường TƯƠNG ĐỐI `_acceptance/<slug>/evidence/…`; viết cùng tệp bằng đường tuyệt đối thì vẫn bị chặn có tên (Ngoài-4 — sửa rẻ ở chiến dịch ghim lại kế).
  - Chân grep tài liệu (E7) mới chứng minh chiều đỏ cho một ô (dạng khối, `contract.md`); nhánh inline và hai tiền tố còn lại chưa có đối chứng dương (Ngoài-5, cùng lớp với mục đã khai ở vòng 2).
- Bản sửa mã và lưới thường trực đã nằm ở commit 4279ba42 trên nhánh, viết đỏ trước (9/13 đỏ trên mã cũ). Vòng này dựng hồ sơ + răng để cổng pre-merge của kit cho merge; không mở rộng phạm vi.
