# Thước biết trước là không phán được — kế hoạch thi công

> **For agentic workers:** thi công tuần tự trong phiên chính (T2, các task phụ thuộc giao diện của nhau).

**Goal:** chặn eval judgment hỏi diff/lệnh ở bước sinh args S4, và kéo bên viết · bên chấm · bên phản biện về cùng sự thật nền.

**Architecture:** một module bộ dò `feature-loop/scripts/lib/hoi-ngoai-inputs.mjs` (một nguồn); `s4-args.mjs` gọi nó trong vòng lặp eval TRƯỚC khi giải `inputs`; script quét của bản ghi phát hiện nạp cùng module. Tài liệu skill sửa bằng văn.

**Tech Stack:** Node ≥ 22 (ESM, `require(esm)` cho script quét .cjs), bash cho răng hồ sơ.

**Spec:** `docs/superpowers/specs/2026-10-01-thuoc-biet-truoc-khong-phan-duoc-design.md` · hợp đồng `_acceptance/thuoc-biet-truoc-khong-phan-duoc/contract.md`.

## Global Constraints

- Không chạm `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` (giữ T2) — chạm là DỪNG, ghi sổ, báo owner.
- Không sửa `feature-loop/workflows/acceptance-verify.js`.
- `s4-args.mjs` không được chứa chuỗi `expected_exit` (răng hồ sơ eval-khai-ma-thoat-mong-doi); bốn mẫu đột biến của răng inputs-tinh-tu-goc-kho phải vẫn khớp đúng một lần.
- Thông điệp `die(...)` tiếng Việt, một dòng, cùng giọng các `die` sẵn có.
- Fixture code-sinh trong lần chạy; đường dẫn suy từ vị trí script.

## Review Focus

1. Câu hỏi khối gấp `question: >` cắt cụm giữa dòng → JI7 ô khối gấp + ca tiền đề parseEvals.
2. Câu hỏi có chữ «diff» nghĩa khác / «đang chạy:» không lệnh → JI10 (chặn oan).
3. Tệp tên «diff» trong inputs → JI9 (không miễn).
4. Bản sao khuôn mọc lại ở lint hay lib → JI12.
5. Hội đồng bị nới mai sau → JI11.

---

### Task 1: Ca kiểm đỏ trước (TDD)

**Files:** Modify `tests/scripts/s4-args-judgment-inputs.test.mjs` (thêm nhóm JI7–JI12; `buildRepo(inputs, dir?)`, `runArgs(repo, slug='demo')`).
**Phục vụ:** E1–E6. **independent:** false.

- [ ] Thêm nhóm JI7–JI12 (nội dung ở design §3 và evals.yaml E1–E6).
- [ ] Chạy `node tests/scripts/s4-args-judgment-inputs.test.mjs` — mong: JI1–JI6 xanh, JI7–JI12 ĐỎ (module chưa có → import lỗi, hoặc chặn chưa có).
- [ ] Commit `test(s4-args): JI7–JI12 đỏ trước — răng hỏi-ngoài-inputs`.

### Task 2: Module bộ dò + răng ở s4-args + script quét nạp module

**Files:** Create `feature-loop/scripts/lib/hoi-ngoai-inputs.mjs`; Modify `feature-loop/scripts/s4-args.mjs` (import + nhánh trong vòng lặp eval trước `resolveJudgmentInput`); Modify `docs/findings/assets/2026-10-01-quet-judgment-hoi-ngoai-inputs.cjs` (require module, bỏ khuôn tại chỗ).
**Interfaces:** Produces `export const DIFF_REQ`, `export const CMD_REQ`, `export function hoiNgoaiInputs(question: string): string|null`.
**Phục vụ:** E1–E5. **independent:** false.

- [ ] Viết module (khuôn chép nguyên văn từ commit a2db0fad + gộp khoảng trắng).
- [ ] s4-args: `const hoi = hoiNgoaiInputs(e.question); if (hoi) die(...)` chỉ cho `executor === 'judgment'`.
- [ ] Script quét: `require` module; đo lại `node docs/findings/assets/…cjs ~/dev` → vẫn 17 ca.
- [ ] Chạy test → JI7–JI12 xanh; JI1–JI6 xanh.
- [ ] Commit `feat(s4-args): chặn judgment hỏi diff/lệnh trước lượt chấm — bộ dò một nguồn`.

### Task 3: Tài liệu bên viết · bên chấm · bên phản biện

**Files:** Modify `skills/acceptance/references/eval-executors.md` (bảng, luật 4, đoạn `inputs`, mục «Pick the grader per clause» + ba bẫy); `skills/acceptance/SKILL.md` Phase 2 bước 2 + 3b; `feature-loop/skills/feature-loop/SKILL.md` dòng evals S1 + ý (4) gap-probe; `skills/acceptance/references/judge-personas.md` (trạng-thái-vs-lịch-sử, thay câu dặn >50 %).
**Phục vụ:** E7, E8. **independent:** true (so với Task 2), nhưng làm tuần tự cho rẻ.

- [ ] Sửa bốn tệp.
- [ ] Verify: chạy suite plugins (vùng 1–3) + scripts — không ca ghim văn bản nào đỏ.
- [ ] Commit `docs(skills): chọn người chấm theo từng vế; hội đồng đọc trạng thái, không đọc lịch sử`.

### Task 4: Răng hồ sơ + suite

- [ ] Chạy sáu chân `rang.sh` (E1–E6): mỗi chân cây thật xanh + mọi đột biến đỏ đúng dòng ghim.
- [ ] Chạy trọn `feature_loop.suite_keys`; vẽ lại PRODUCT-MAP nếu lệch.
- [ ] Contract → `status: implemented`, vào S4.
