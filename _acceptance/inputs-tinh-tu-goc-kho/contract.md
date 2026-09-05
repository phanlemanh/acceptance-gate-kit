---
schema_version: 1
feature: inputs của hội đồng tính từ gốc kho — một gốc cho mọi đường dẫn trong evals, vắng thì kêu to
slug: inputs-tinh-tu-goc-kho
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-05T01:54:26Z
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
- AC-6: Given nhánh này so với mốc gộp với nhánh chính (`git merge-base`), When liệt kê file đổi, Then `feature-loop/workflows/acceptance-verify.js` có diff RỖNG (lane hội đồng không đổi nghĩa: bảng `EVAL-REQUIRED-FIELDS`, nhánh UNCERTAIN, `inputsHash` giữ nguyên vì file giữ nguyên) và tập file mã đổi ngoài `tests/**`, `docs/**`, `skills/**`, `feature-loop/skills/**`, `_acceptance/**`, `.github/**`, `PRODUCT-MAP.md` (bản đồ máy vẽ lại khi thêm hồ sơ) BẰNG đúng tập một phần tử {`feature-loop/scripts/s4-args.mjs`}; bộ kiểm lớp thuần của workflow xanh là đối chứng dương, không phải thước chính. Mỗi vế có chiều đỏ riêng trên clone tạm: chạm `acceptance-verify.js` → đỏ vế một; thêm một file mã lạ ngoài tập trắng → đỏ vế hai nêu tên file.

## Coverage

Quét theo tích hai trục rời rạc; tích đủ vì hàm giải chỉ phân nhánh theo
(kiểu đường dẫn) × (tồn tại trên đĩa). Trục thứ ba là nơi luật sống.

- Trục kiểu đường dẫn khai: gốc kho (AC-1, AC-2) | tuyệt đối (AC-4) | kiểu cũ theo thư mục hồ sơ (AC-3). [thước CE: ba nhánh mà hàm `resolveJudgmentInput` phân biệt — `isAbsolute` · tồn tại ở gốc kho · tồn tại ở đường cũ]
- Trục tồn tại trên đĩa: có (AC-1, AC-3, AC-4 ô 1) | không (AC-2, AC-4 ô 2). Ô «kiểu cũ mà không có ở đâu cả» rơi về AC-2 (cùng thông điệp, không gợi ý) — thước là chính chân AC-2. [thước CE: hai vế `existsSync` trong hàm]
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
- Bản sửa mã và lưới thường trực đã nằm ở commit 4279ba42 trên nhánh, viết đỏ trước (9/13 đỏ trên mã cũ). Vòng này dựng hồ sơ + răng để cổng pre-merge của kit cho merge; không mở rộng phạm vi.
