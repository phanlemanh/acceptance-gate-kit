---
schema_version: 1
feature: Siết răng của phép đo câu-về-hình — P90 canh mọi bản chép, răng đọc bảng thông điệp từ P197, chiều đỏ tách-đoạn cho quan hệ cùng-đoạn, ma trận nhãn nở đủ, đối chứng P90 dùng chung
slug: siet-rang-cau-ve-hinh
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: verified
approved_by: ""
approved_at: ""
veto_state: mo
veto_opened_at: 2026-08-17T14:40:48Z
---

# Acceptance Contract: siet-rang-cau-ve-hinh

## Context

Bốn Known limits của `hinh-tai-cong-1` (ký 17/08, PR #62) cùng một lớp «thước
chưa gắn hết vào lời hứa» của phép đo câu-về-hình. Vòng này chỉ đụng phép đo:
`tests/plugins/run-tests.sh` (P90, P197, case mới P198), module dùng chung mới
`tests/plugins/hfl_clause.py`, `_acceptance/hinh-tai-cong-1/rang.sh`. Không đổi
`SKILL.md`, không đổi bản luật. Design:
`docs/superpowers/specs/2026-08-17-siet-rang-cau-ve-hinh-design.md`.

Source input: Known limits 1·2·3·4 trong `_acceptance/hinh-tai-cong-1/contract.md`
+ review-findings các vòng r2–r7 của hồ sơ đó + lệnh owner «mở hợp đồng siết răng».

## Criteria

- AC-1: Given module `tests/plugins/hfl_clause.py` với hàm `clause_copies_ok(text, clause)` neo HAI đầu (n_anchor = max(số lần 4 chữ ĐẦU, số lần 4 chữ CUỐI của clause); n_full = số bản NGUYÊN VĂN sau gộp khoảng trắng) và bảng kỳ vọng sáu ca — (a) hai bản chép đúng → danh sách trống · (b) sửa một chữ GIỮA ở đúng MỘT bản → `["cau ve hinh lech khuon mot-nguon (1/2 ban chep)"]` · (c) sửa một chữ trong 4 chữ ĐẦU của một bản → cùng thông điệp `(1/2 ban chep)` · (d) sửa một chữ trong 4 chữ CUỐI → cùng thông điệp · (e) xoá hẳn một bản → danh sách trống · (f) xoá cả hai → `["khong co ban chep nao"]`, When chạy hàm trên fixture code-sinh trong chính lần chạy cho cả sáu ca, Then kết quả khớp bảng kỳ vọng sáu trên sáu, mỗi ca in `P198-CA-<x> OK`.
- AC-2: Given case P90 đã thay `CLAUSE not in t` bằng `clause_copies_ok` trên TOÀN VĂN file (import từ `hfl_clause`), When chạy đối chứng dương trên cây thật và ba đột biến m3 (sửa một chữ bản ĐẦU, `count=1`) · m4 (thay bản ĐẦU bằng câu khác) · m3b (sửa một chữ bản CUỐI — bản S2, đúng lỗ KL1), Then đối chứng dương XANH và cả ba đột biến ĐỎ ghim thông điệp có `(1/2 ban chep)`, P90 in `P90-COPIES: m3|m4|m3b do (1/2 ban chep)`.
- AC-3: Given P197 in một dòng `P197-M: <msg>` cho MỖI phần tử của tập EXPECTED trước khi chạy đột biến, và `_acceptance/hinh-tai-cong-1/rang.sh` đã thay danh sách chuỗi tay bằng việc đọc tập đó từ stdout (đòi ≥ 21 phần tử, MỖI phần tử có dòng `DO dung (<msg>)`, số `P197-MUT-n` ≥ số phần tử) và nhận biến `RANG_STDOUT_FILE` để đọc stdout từ file, When răng của hồ sơ này ghi stdout THẬT của P197 ra file rồi (o) chạy rang.sh nguyên bản · (i) xoá MỘT dòng `DO dung (<msg>)` · (ii) xoá MỘT dòng `P197-M:`, Then (o) OK · (i) ĐỎ ghim đúng `<msg>` · (ii) ĐỎ ghim `so P197-M khong khop P197-M-COUNT`.
- AC-4: Given P197 có, cho MỖI check quan-hệ cùng-đoạn (`dieu_kien` · `bo_qua` · `skill_vang` · `nhin` · `dung_lai`), một đột biến chèn `\n\n` giữa hai needle mà giữ nguyên mọi chữ, và hàm `presence_only` (chỉ kiểm chữ có mặt trong khối), When chạy, Then mỗi đột biến ĐỎ đúng thông điệp của khoá (in `P197-MUT-n: tach doan <khoá> DO dung (...)`) và cùng đột biến đó qua `presence_only` VẪN XANH (in `P197-TACH-<khoá>: presence_only van xanh`) — chiều đỏ đo quan hệ; `m_cond` nối lại bằng `\n\n`.
- AC-5: Given P197 nở `M["nhan"]` theo ĐỦ 5 nhãn trong LABELS và có một lượt gỡ cho mỗi nhãn, When chạy, Then đủ 5 dòng ĐỎ ghim `thieu nhan buoc <nhãn>`, và bản sao suite bỏ đi một đột biến nhãn bất kỳ làm assert `ma tran chua toan phan` ĐỎ ghim nhãn thiếu.
- AC-6: Given P197 dùng `p90_check = clause_copies_ok` import từ `hfl_clause` (đã thay bản chép tay `CLAUSE_P90 in t`), When chạy trên TOÀN VĂN của đột biến xoá-clause-khỏi-khối (bản S2 còn) và của đột biến sửa-một-chữ-ở-khối, Then lần lượt XANH và ĐỎ; P197 in `P197-P90CHECK: xanh tren xoa-khoi, do tren sua-mot-chu`.
- AC-7: Given case mới P198 trong suite (vĩnh viễn — chỉ đọc `tests/**`, `feature-loop/**`, `skills/**`) gồm AC-1 + kiểm cấu trúc hai khối P90/P197 (mỗi khối chứa `from hfl_clause import`; chuỗi chép tay `CLAUSE not in t` và `CLAUSE_P90 in` đã được thay hết) + hai đột biến chèn lại chuỗi chép tay vào bản sao khối, When chạy, Then đối chứng dương XANH, hai đột biến ĐỎ ghim `P90 con chep tay logic clause` / `P197 con chep tay p90_check`, và dòng tổng kết `P198 OK: <n> ca fixture · <k> kiem cau truc` in số từ biến.
- AC-8: Given toàn suite `tests/plugins` và răng của hồ sơ này `_acceptance/siet-rang-cau-ve-hinh/rang.sh` (sống-chết theo hồ sơ, nếp p194), When chạy tại HEAD, Then suite XANH (P90 · P93 · P197 · P198); răng của hồ sơ này ghim: dòng `PASS: P90/P197/P198`, ba dòng `P90-COPIES`, ≥21 dòng `P197-M:`, 5 dòng `tach doan` + 5 dòng `P197-TACH-`, 5 dòng `thieu nhan buoc`, dòng `P197-P90CHECK`, dòng `P198 OK`; rang.sh của hinh-tai-cong-1 với `RANG_STDOUT_FILE` trên stdout thật → OK và trên hai bản sao sửa một dòng (AC-3 i/ii) → ĐỎ đúng thông điệp; và rang.sh của hinh-tai-cong-1 vẫn ĐỎ trên bản sao diffBase thật `7d76384` (merge-base với main, mốc ghi trong răng của hồ sơ này; ở đó P197 chưa in P197-M nên rang.sh cũ đỏ vì hợp đồng P197-M, và suite chưa có khối P198).

## Coverage

Bài toán là đóng bốn lỗ đã gọi tên — một chiều theo danh sách Known limits;
không quét `morphological-scan` — xem entry `descope` trong `decisions.jsonl`.

- Trục duy nhất — bốn lỗ: mọi-bản-chép (AC-1, AC-2) · răng-một-nguồn (AC-3) · quan-hệ-tách-đoạn (AC-4) · nhãn-đủ + đối-chứng-dùng-chung (AC-5, AC-6) [thước CE: danh sách Known limits 1–4 trong contract hinh-tai-cong-1 + review-findings r3–r7]
- Cross-cutting: phép đo của chính vòng này (AC-7) và tính phân biệt giữ nguyên (AC-8)

## Out of scope

- **Đổi khối GATE 1 / câu luật / bản luật** — vòng này chỉ đổi phép đo.
- **Đưa răng nào vào suite vĩnh viễn / cho P198 grep `_acceptance/**` hay dựng worktree** — giữ nếp p194: mọi thứ gắn với hồ sơ (rang.sh của hinh-tai-cong-1, mốc diffBase) đo bằng răng của hồ sơ này.
- **Đếm bản chép cho các marker khác** (GOAL-TEMPLATE, REPIN-TEMPLATE) — chưa có lỗ thật.
- **Đo hành vi thật của Cổng 1 (máy có kê/đếm đúng không)** — vẫn là vòng pilot.

> Out of scope = scope-truth (Gate 1 duyệt mục này).

## Notes

(Known limits — điền tại Cổng 2.)
