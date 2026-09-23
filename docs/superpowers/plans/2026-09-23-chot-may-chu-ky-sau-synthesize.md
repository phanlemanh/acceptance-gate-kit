# Chốt máy trường-của-người sau synthesize — kế hoạch thi công

> **For agentic workers:** thực thi TUẦN TỰ trong vòng chính (feature-loop S3), TDD: ca kiểm đỏ trước, vật sau.

**Goal:** workflow S4 tự ép rỗng `human_signoff` / `human_override` / `bypass_ack` và ép `verified_at` bằng giờ engine trong báo cáo tác tử tổng hợp trả về, trước khi trả cho vòng chính.

**Architecture:** một hàm thuần `chotTruongNguoi(report, { invokedAt, gioTheoRunId })` giữa marker `CHOT-TRUONG-NGUOI` trong `feature-loop/workflows/acceptance-verify.js`, gọi ngay sau `synthesize:report`. Ca kiểm chạy workflow thật qua `tests/workflows/harness.mjs`; ca corpus rút khối hàm theo marker.

**Tech Stack:** Node ESM, harness vm của `tests/workflows`, git.

**Spec:** `docs/superpowers/specs/2026-09-23-chot-may-chu-ky-sau-synthesize-design.md` · hợp đồng `_acceptance/chot-may-chu-ky-sau-synthesize/contract.md` (đã duyệt 23/09).

## Global Constraints

- Sandbox workflow không có import, không có `Date` — hàm tự chứa, giờ lấy từ `args.invokedAt`.
- Luật chỉ áp ở vị trí trường: khoá cấp 0 frontmatter + dòng trường khối evidence; khối vô hướng và văn xuôi giữ nguyên byte.
- Không đổi prompt `synthesize:report`. Không chạm `lib/`, `scripts/recheck-evidence.cjs` (vế 2 không phê).
- Dòng PASS của ca không chứa chuỗi «exit <số>» (memory kit: tác tử máy đọc nhầm mã thoát).
- Không ghi byte nào vào kho crm — chỉ `git show`.

## File Structure

| Tệp | Trách nhiệm |
|---|---|
| `feature-loop/workflows/acceptance-verify.js` | hàm chốt (marker) + lời gọi sau synthesize + BLOCKED khi thiếu giờ + dòng run-log `kind: chot-truong-nguoi` |
| `tests/workflows/chot-truong-nguoi.test.mjs` | 23 ca CTN-AC1…CTN-AC8, fixture code sinh từ khuôn báo cáo |
| `tests/workflows/chot-truong-nguoi-corpus.mjs` | `napChot` (rút khối theo marker) · `kiemIm` (phép im theo khuôn bên viết) · CLI đọc kho khác bằng `git show` |
| `_acceptance/config.yaml` | khoá lệnh `ctn_ac1` … `ctn_ac8`, `ctn_ac7`, `ctn_ac7_nhanh` |

### Task 1: Ca kiểm + hàm chốt trong workflow

**Files:** Create `tests/workflows/chot-truong-nguoi.test.mjs`, `tests/workflows/chot-truong-nguoi-corpus.mjs` · Modify `feature-loop/workflows/acceptance-verify.js` (khối marker trước kiểm args; lời gọi trước `return` cuối; `report`/`findings` của kết quả).
**Phục vụ:** E1, E2, E3, E4, E5, E6, E8, E9 · **independent:** false.
**Interfaces:** Produces `chotTruongNguoi(report: string, { invokedAt: string, gioTheoRunId: Record<string,string> }) → { text: string, doi: {human_signoff,human_override,bypass_ack,verified_at: number}, loi: string|null }`; `napChot(src) → chotTruongNguoi`; `kiemIm(truoc, sau) → string[]`.

- [x] Step 1: viết ca kiểm (fixture từ vùng chép `---8<---` + marker SUITE/UI-CHECK/JUDGMENT; run_id từ `result.runLog` lượt 1 cùng args; ma trận 8 ô; bốn đột biến `srcOverride`).
- [x] Step 2: chạy `node tests/workflows/chot-truong-nguoi.test.mjs` → ĐỎ ở CTN-AC1, AC2-ma-tran, AC3-bang, AC4, AC5; ném lỗi «khong rut duoc khoi CHOT-TRUONG-NGUOI».
- [x] Step 3: viết hàm chốt + lời gọi (hai lượt: đánh dấu vị trí trường/khối/run_id; viết lại hai loại dòng). Chuỗi mà đột biến tìm phải có nguyên văn: `chotTruongNguoi(String(` · `const KHOA_NGUOI = ['human_signoff', 'human_override', 'bypass_ack']` · `gioTheoRunId[c.runId] = c.verifiedAt || invokedAt` · `if (!viTri[i]) return l`.
- [x] Step 4: chạy lại → 23/23 xanh; corpus kit 84 báo cáo im.
- [x] Step 5: commit.

### Task 2: Khoá lệnh eval + chiều im crm

**Files:** Modify `_acceptance/config.yaml` (cờ `--nhan crm` cho `ctn_ac7`).
**Phục vụ:** E7 · **independent:** false.

- [x] Step 1: `node tests/workflows/chot-truong-nguoi-corpus.mjs --root "$HOME/dev/crm-onehub" --ref origin/onehub --ref origin/fix/tieu-de-cot-doc-tron --can bo-dung-chung-nhan-chuoi --can tieu-de-cot-doc-tron --doi-cham --nhan crm` → «im: 51 bao cao crm, 51 bi cham, 0 dong ngoai bon khoa»; `git -C ~/dev/crm-onehub status` rỗng trước và sau.
- [x] Step 2: commit cùng Task 1.

### Task 3: Hồi quy toàn kho

**Files:** không tệp mới — chạy suite.
**Phục vụ:** suite_keys · **independent:** false.

- [x] Step 1: `bash tests/workflows/run-tests.sh` · `bash tests/hooks/run-tests.sh` · `bash tests/plugins/run-tests.sh` · `node scripts/product-map.mjs --root . --check` · `bash tests/scripts/run-tests.sh` (nền, ~600 s) — tất cả xanh.
- [x] Step 2: contract `status: implemented`, commit, sang S4.
