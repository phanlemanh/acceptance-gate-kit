# Vòng là một kết quả — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (T2, tuần tự trong phiên chính — Feature Loop S3). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Răng cắt lượt nói ra hàng phải tách / gộp được / lệch dáng câu giao bằng cờ có tên, khoảng cỡ đọc từ một khối trong SKILL, và một đồng hồ chỉ đọc in bảng cỡ → lượt chấm → chạm trần.

**Architecture:** Mọi mã mới sống trong `scripts/cat-luot.mjs` (cùng nhà với răng phủ và `--nhip`). Khoảng cỡ là khối marker `CAT-LUOT-CO` trong `skills/cat-luot/SKILL.md`, script đọc nó qua đường suy từ vị trí script. Tiêu chí đếm bằng `parseACBlock` (`lib/ac-line.cjs`), trạng thái đã giao từ `DA_THONG_CONG_2` ∪ `DA_DONG_THUC_TE` (`lib/workspace-record.cjs`) — không chép khuôn.

**Tech Stack:** Node ESM, không thư viện ngoài. Ca đo trong `tests/scripts/lo-trinh.test.mjs` (khuôn `chayCa`/`chayDo`/`banSao`, kho thử `khoCL`, bản phạm vi `vietPV`).

**Spec:** `docs/superpowers/specs/2026-10-11-vong-la-mot-ket-qua-design.md` · hợp đồng `_acceptance/vong-la-mot-ket-qua/contract.md` · bộ đo `evals.yaml`.

## Global Constraints

- Khoảng: `muc_tieu: 8-10` · `cho_phep_den: 12` · `tach_tu: 13` · `tran_luot_cham: 3` · `it_du_lieu_duoi: 10` — chỉ ở khối SKILL; mã không chứa số nào trong năm số này.
- Tên cờ (hằng `CO_TEN`): `can-tach` · `tren-muc-tieu` · `duoi-muc-tieu` · `tieu-chi-sai-kieu` · `chua-uoc-tieu-chi` · `vai-khong-mo-cau` · `nen-thieu-bat-khi` · `chua-khai-dang-giao`.
- Dòng ra cờ: `hàng <nhãn> [<cờ>]: <câu>`; hàng ngoài đợt gom: `[<cờ>] <k> hàng ngoài đợt <dot> — <mã>, …` (≤ 8 mã rồi «…»).
- Hàng ngoài đợt không đổi mã thoát; thiếu khai (`vai`, `tieu_chi`) chỉ vàng kể cả trong đợt.
- Chỉ đọc: không lệnh nào ghi tệp. Không chạm `lib/**`, `dieu-phoi/`, `feature-loop/skills/`.
- Răng gốc để so vi phân: `68951cef`.

## Review Focus

1. Khối khoảng có khoảng trắng / chú thích `#` cuối dòng → đọc vẫn đúng (ca trong LT-142 đối chứng dương: khối lành có chú thích).
2. Câu giao không có dấu « (crm có hàng không dấu) → so vai vẫn đúng (ca `mo-cau` không dấu trong LT-145).
3. `nhom` vắng ở cả hai hàng → không gộp (vắng ≠ bằng nhau) — ca trong LT-144.
4. Hồ sơ có `usage-report.md` mà không tiêu đề S4 → `khong_luot_cham`, không chia cho 0 — ca trong LT-148.
5. `--co` trên kho không có `_acceptance/` → `chua_do_duoc`, thoát 0 — ca trong LT-148.

---

### Task 1: Khoảng cỡ một nguồn

**Files:** Modify `skills/cat-luot/SKILL.md` (thêm khối `CAT-LUOT-CO` ở Bước 3), `scripts/cat-luot.mjs`; Test `tests/scripts/lo-trinh.test.mjs` (LT-142, LT-142-do).
**Phục vụ:** E1 (AC-1). **independent:** false (Task 2–5 dùng `napKhoang`).

**Interfaces — Produces:**
- `export const KHOA_CO = ['muc_tieu','cho_phep_den','tach_tu','tran_luot_cham','it_du_lieu_duoi']`
- `export function docKhoang(skillTxt) → { khoang: { muc_tieu:[a,b], cho_phep_den, tach_tu, tran_luot_cham, it_du_lieu_duoi } | null, loi: string[] }` — lỗi nêu tên khoá.
- `export const TEP_SKILL = path.join(__dirname,'..','skills','cat-luot','SKILL.md')`; `napKhoang(tep = TEP_SKILL)` → khoang hoặc ném `{ma:2, thongDiep}`.

- [ ] Viết LT-142: đối chứng (gói lành, hàng 11 → `tren-muc-tieu`, thoát 0) · bản sao gói sửa khối (`tach_tu: 11`, `cho_phep_den: 10`) → `can-tach` thoát 1 · ma trận 13 khối hỏng (vắng khối · thiếu từng khoá ×5 · `muc_tieu: 0-10` · `tran_luot_cham: 0` · `it_du_lieu_duoi: abc` · `muc_tieu: 10-8` · `cho_phep_den: 9` · `tach_tu: 14` · `tach_tu: 12`) → thoát 2, stderr nêu khoá, stdout không có «bảng phủ», in «13 ca». LT-142-do: bản sao thay `napKhoang()` bằng hằng → ghim «khối sửa không đổi cờ».
- [ ] Chạy `node tests/scripts/lo-trinh.test.mjs --only LT-142` → đỏ (hàm chưa có).
- [ ] Viết `docKhoang`, `napKhoang`, khối SKILL; CLI gọi `napKhoang` trước mọi chế độ (lỗi → thoát 2).
- [ ] Chạy lại → xanh; chạy `--only LT-142-do` → PASS.
- [ ] Commit.

### Task 2: Cờ cỡ và dáng câu giao

**Files:** Modify `scripts/cat-luot.mjs`; Test LT-143…LT-146 (+ `-do`).
**Phục vụ:** E2–E5 (AC-2…AC-5). **independent:** false.

**Interfaces — Consumes:** `napKhoang`. **Produces:**
- `export const CO_TEN = [...8 tên]`
- `export function kiemCo(pv, data, khoang) → { loi: string[], canhBao: string[] }` — CLI nối sau dòng của `kiemPhu`.

Luật (đúng design §4.2–4.3): `tieu_chi` vắng → `chua-uoc-tieu-chi`; không phải `Number.isInteger` > 0 → `tieu-chi-sai-kieu`; ≥ `tach_tu` → `can-tach`; > cuối mục tiêu và ≤ `cho_phep_den` → `tren-muc-tieu`; < đầu mục tiêu → `duoi-muc-tieu` (+ «gộp được với <mã> (tổng N)» cho mỗi hàng cùng đợt, cùng `nhom` khác rỗng, cũng dưới mục tiêu, tổng ≤ `cho_phep_den`). `vai` vắng → `chua-khai-dang-giao`; `vai === 'nen'` và `bat_khi` rỗng sau trim → `nen-thieu-bat-khi`; còn lại so `chuan(cau_giao).startsWith(chuan(vai))` với `chuan = s => s.normalize('NFC').replace(/^[\s«“"']+/, '').toLocaleLowerCase('vi')` → sai thì `vai-khong-mo-cau`. Mức: lỗi = `can-tach`, `tieu-chi-sai-kieu`, `vai-khong-mo-cau`, `nen-thieu-bat-khi`; vàng = ba cờ còn lại. Hàng ngoài đợt: gom một dòng vàng mỗi cờ (bỏ `tren-muc-tieu`/`duoi-muc-tieu` — chỉ là gợi ý cắt cho đợt đang cắt).

- [ ] Viết LT-143 (bảng 21 phần tử dựng từ khối) · LT-144 (gộp + ba đối chứng + nhom vắng) · LT-145 (9 ca vai, gồm không dấu và NFD) · LT-146 (10 hàng ngoài đợt, gom, «…»; đối chứng chuyển vào đợt → thoát 1). Bốn `-do`: `>=`→`>` · bỏ điều kiện nhom · `startsWith`→`includes` · in theo từng hàng.
- [ ] Chạy → đỏ. Viết `kiemCo` + nối CLI. Chạy → xanh, bốn `-do` PASS. Chạy cả `lo-trinh.test.mjs` → LT-130…141 vẫn xanh.
- [ ] Commit.

### Task 3: Đường đọc-cũ + khuôn mẫu

**Files:** Modify `skills/acceptance/references/lo-trinh-template.json`; Test LT-147 (+ `-do`, `-do-trang`).
**Phục vụ:** E6 (AC-6), một phần E9. **independent:** false.

- [ ] Khuôn: hàng 1 → `"cau_giao": "«Trưởng nhóm mở trang X và thấy Y của tuần này»"`, `"vai": "Trưởng nhóm"`, `"tieu_chi": 9`; hàng 2 → `"cau_giao": "«Yêu cầu duyệt tới người duyệt trong một phút sau khi gửi»"`, `"vai": "nen"`, `"tieu_chi": 8` (có `bat_khi`); hàng 3 (không đợt) giữ nguyên.
- [ ] LT-147: răng gốc = `git archive 68951cef scripts lib skills` (hàm `banGoc(sha)` dựng theo mẫu `banGocL2`). Ba kho: khuôn ở `68951cef` + pv đợt `mau-1` sinh từ `phu` · `docs/plans/lo-trinh-kit.json` + đợt mới sạch (hàng mới có `vai`/`tieu_chi`) · `fixtures/lo-trinh/crm-okr.json` + đợt mới sạch. So mã thoát, tập dòng không mở «cảnh báo:», dòng thêm đều «cảnh báo:» và chứa một `CO_TEN`; ít nhất một kho có dòng thêm. Trang: vẽ `LO-TRINH.html` từ kho có hàng mang `vai`/`tieu_chi` và từ bản xoá hai trường → bằng byte. `-do`: bản sao coi `chua-khai-dang-giao` là lỗi trong đợt; `-do-trang`: bản sao bộ vẽ chèn `vai` vào ô câu giao.
- [ ] Chạy → xanh (vật đã có từ Task 2 — đây là ca canh, chiều đỏ ở hai `-do`). LT-13 vẫn xanh.
- [ ] Commit.

### Task 4: Đồng hồ cỡ

**Files:** Modify `scripts/cat-luot.mjs`; Test LT-148, LT-149 (+ `-do`, `-do-ghi`, `-do-song-sot`, `-do-du-kien`).
**Phục vụ:** E7, E8 (AC-7, AC-8). **independent:** false.

**Interfaces — Produces:** `export function dongHoCo(root, { khoang, tu = null, loTrinh = null }) → object` (khuôn JSON design §4.4). CLI: `--co [--tu YYYY-MM-DD] [--lo-trinh <tệp>]`; `--tu` sai khuôn → thoát 2 nêu giá trị.

Luật đếm: mỗi `_acceptance/<slug>/contract.md`; `status` = `draft` → `chua_chot`; `new Set(parseACBlock(c).map(a=>a.id)).size === 0` → `khong_doc_tieu_chi`; có `--tu` mà không ngày chốt (`ngayDau(approved_at) || ngayDau(veto_opened_at)`) → `khong_ngay_chot`, ngày < `tu` → bỏ khỏi tập (không đếm bo_qua); còn lại vào `n_chot` của nhóm cỡ. Trong đó: status ∉ đã giao → `chua_giao`; đếm `/^###\s+S4\s+round\b/gm` trong `usage-report.md` = 0 → `khong_luot_cham`; còn lại vào `n` (lượt, chạm trần ≥ `tran_luot_cham`). `--lo-trinh`: đọc JSON, mỗi hàng có `tieu_chi` nguyên dương và `slug` mà hồ sơ đã chốt có trong tập → `{ma, slug, du_kien, that}`.

- [ ] LT-148: kho thử dựng bằng code — hợp đồng gạch đầu dòng và tiêu đề; `usage-report.md` sinh bằng `node feature-loop/scripts/wf-usage.mjs <dir transcript giả> --md --title "<tiêu đề rút từ dòng --title của feature-loop SKILL, thay N>"` (transcript giả: một `agent-x.jsonl` một dòng assistant có `message.model`/`usage`, khuôn theo `tests/scripts/wf-usage.test.mjs`). Bảng kỳ vọng tính tay trong ca. Băm cây (số tệp > 0) trước = sau, `git status` rỗng. Cây kit thật: `n_chot` ≥ 50, `khong_doc_tieu_chi` = 0. Ba `-do`: mẫu `- AC-` · ghi tệp trước khi in · `pt_tong` trên đã giao.
- [ ] LT-149: năm hồ sơ quanh mốc + lộ trình ba hàng; `-do` bỏ nhánh veto; `-do-du-kien` lấy `that = du_kien`.
- [ ] Chạy → đỏ; viết `dongHoCo` + CLI; chạy → xanh; năm `-do` PASS.
- [ ] Commit.

### Task 5: Skill, khuôn lệnh, nhật ký đổi

**Files:** Modify `skills/cat-luot/SKILL.md`, `CHANGELOG.md`; Test LT-150 (+ `-do`, `-do-khuon`).
**Phục vụ:** E9, E10 (AC-9, AC-10). **independent:** false.

- [ ] SKILL: Bước 2 thêm khối lệnh `CAT-LUOT-CO-LENH` (`AG="${AG:-${CLAUDE_PLUGIN_ROOT}}" && node "$AG/scripts/cat-luot.mjs" --root . --co`) + cách đọc bảng (`n`, `it_du_lieu`, đặt cạnh khối khoảng; lệch thì nêu trong PR, không tự sửa khối). Sáu luật: luật 1 «Mỗi hàng MỘT kết quả, câu giao một trong hai dáng: việc người dùng thấy → mở bằng vai (`vai`); việc nền → hành vi đo được (`vai: nen` + `bat_khi`), không ép «Là kỹ sư…».»; luật 4 «Cỡ hàng theo khoảng tiêu chí của khối CAT-LUOT-CO (`tieu_chi`): vượt cho phép thì tách, dưới mục tiêu thì xét gộp cùng nhóm.» Mục «Hai dáng câu giao» kèm hai ví dụ. Bước 3 khuôn hàng thêm `vai`, `tieu_chi` (trường của LƯỢT CẮT, agent không đọc). Bước 4 bảng cờ (8 dòng, cột cờ · khi · mức).
- [ ] LT-150: khối `CAT-LUOT-CO-LENH` chạy nguyên văn → JSON có `nhom`; LT-138 vẫn xanh; sáu luật, dòng 1 chứa «vai» và «nền», dòng 4 chứa «CAT-LUOT-CO»; tập tên trong bảng cờ == `CO_TEN`; khuôn có hàng vai và hàng `nen`, đợt mẫu 0 lỗi 0 cảnh báo. `-do`: bản sao SKILL bỏ một dòng bảng cờ; `-do-khuon`: bản sao khuôn bỏ hàng `nen`.
- [ ] CHANGELOG mục chưa phát hành: một đoạn (răng cỡ + dáng, đồng hồ, đường đọc-cũ, crm không phải làm gì).
- [ ] Chạy cả `node tests/scripts/lo-trinh.test.mjs` → xanh. Commit.

### Task 6: Kết S3

- [ ] Chạy bộ kiểm đầy đủ của kho qua khoá máy (`bash ~/.claude/projects/-Users-manhphan-dev-crm/khoa-may/chay-nang.sh "S3 vong-la-mot-ket-qua bộ kiểm" bash tests/scripts/run-tests.sh`).
- [ ] Hợp đồng `status: implemented`, commit, sang S4.
