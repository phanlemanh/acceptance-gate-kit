# Tích hợp mỏng /goal vào feature-loop — Design Spec

> Ngày: 2026-07-07 · Trạng thái: DRAFT chờ user review
> Phạm vi: docs-only — acceptance-gate 1.11.0 → 1.11.1 (GUIDE) · feature-loop 1.11.0 → 1.11.1 (1 câu SKILL) · design-loop KHÔNG đổi
> Không đụng: mọi cơ chế/script/state; kit KHÔNG phụ thuộc `/goal` (không có → mọi thứ y nguyên)
> Đã qua: council rút gọn 1-Skeptic (2026-07-07) — deltas ghi §2/§5

---

## 1. Vấn đề

`/goal` (Claude Code ≥ 2.1.139) tự nổ turn mới cho đến khi một Haiku-checker đọc
transcript xác nhận điều kiện thỏa. Đoạn S2→S4 của feature-loop toàn việc máy nhưng
chỉ tự chạy khi phiên còn sống — phiên dừng sớm là loop treo chờ prompt. `/goal` lấp
đúng khoảng trống đó. Nhưng dùng sai sẽ tốn tiền hoặc tệ hơn:

- **Goal vượt human gate** (tới `signed-off`): hook của kit chặn agent điền chữ ký →
  điều kiện không bao giờ thỏa bằng máy → spin đốt token tới bound.
- **Checker mù filesystem:** nó đọc TRANSCRIPT — loop chỉ Edit file mà không tường
  thuật thì điều kiện ngữ nghĩa không bao giờ cháy (fallback N-turn gánh hết độ tin cậy).
- **Checker thiên vị đoán:** rủi ro lớn hơn spin là **dừng-sớm-sai** — thấy log mơ hồ
  giống "verified" rồi tắt goal trước khi S4 thật xong (Skeptic surprise).

Tri thức "điều kiện nào an toàn" là domain-specific của kit — không suy ra được từ docs
`/goal` chung → xứng đáng 1 mục GUIDE + 1 câu nhắc an toàn tại điểm dùng.

## 2. Quyết định đã chốt (vòng hỏi + council rút gọn 2026-07-07)

| # | Quyết định | Lựa chọn |
|---|---|---|
| Q1 | Mức chạm | **GUIDE + 1 câu trong feature-loop SKILL** (không đụng acceptance-card) |
| Q2 | Council | Rút gọn 1-Skeptic (đợt docs-only — Pareto) |
| C1 | (Skeptic) Template | Neo vào **tường thuật** loop vốn in (verdict + set status), KHÔNG neo vào trạng thái file; thêm vế calibrate "mơ hồ = CHƯA thỏa" chống dừng-sớm-sai |
| C2 | (Skeptic) Test P22 | **Bác** — string-match docs = over-build, false-fail rẻ tiền |
| C3 | (Skeptic đề nghị cắt câu SKILL) | **Bác** — giữ, vì giá trị chính là **an toàn tại điểm dùng** (vế cấm signed-off đúng khoảnh khắc user sắp gõ lệnh); cơ chế đẩy hết về GUIDE, câu rút tối đa |
| C4 | Version | Patch bump 2 plugin theo lệ docs-release (tiền lệ 1.9.2) |

## 3. Mục GUIDE (nội dung chốt)

Vị trí: ngay SAU mục "Sổ quyết định & 2 công tắc design (1.11.0)", **kèm entry mục lục**.
Heading: `## Chạy không-người-trông đoạn máy với /goal (1.11.1 · Claude Code ≥ 2.1.139)`.

Nội dung phải có đủ 5 khối:

1. **Khi nào dùng:** sau Gate 1 duyệt, trước khi rời máy — S2→S4 toàn việc máy;
   `/goal` là backstop tầng harness cho phiên dừng sớm.
2. **Template (điền `<slug>`, dán thành 1 dòng — xuống dòng dưới đây chỉ để dễ đọc):**

   ```
   /goal Feature <slug>: coi là HOÀN THÀNH chỉ khi transcript tường thuật rõ
   S4 verdict PASS hoặc PENDING-JUDGMENT và xác nhận đã set contract
   _acceptance/<slug>/contract.md sang status: verified. Loop đã escalate cho
   user (REJECT quá 3 round / BLOCKED / chờ input người) cũng coi là HOÀN THÀNH
   — để dừng. Thông tin mơ hồ hoặc không chắc = CHƯA hoàn thành. Hoặc dừng
   sau 15 turns.
   ```

3. **Vì sao template viết vậy** (2 câu): checker đọc transcript chứ không đọc file —
   điều kiện phải neo vào tường thuật của loop; vế "mơ hồ = CHƯA hoàn thành" calibrate
   checker khỏi dừng-sớm-sai, vế escalate + 15 turns là 2 lối thoát.
4. **Giới hạn cứng (đậm):** ① KHÔNG BAO GIỜ goal tới `signed-off` — hook chặn chữ ký
   máy, spin vô hạn; Gate 2 là việc người. ② `/goal` không thay grader — Haiku-checker
   chỉ trả lời "chạy tiếp không", S4 mới là chấm thật (doer≠grader). ③ Đạt `verified`
   → goal tự tắt, quay lại làm Gate 2 bằng mắt người.
5. **Yêu cầu & phạm vi:** Claude Code ≥ 2.1.139, workspace trusted, hooks bật;
   Codex KHÔNG có `/goal` (feature-loop-codex không áp dụng); kit không phụ thuộc —
   không dùng `/goal` thì mọi thứ y nguyên.

## 4. Câu SKILL (nội dung chốt)

Vị trí: `feature-loop/skills/feature-loop/SKILL.md`, CUỐI đoạn "Khi duyệt:" của
section `## GATE 1` (sau "Commit design doc + contract + evals."):

> User muốn rời máy cho đoạn S2→S4 tự chạy (Claude Code có `/goal`)? → IN gợi ý lệnh
> theo template mục /goal trong GUIDE, điền sẵn slug — CHỈ in gợi ý (slash command là
> của user, không tự đặt); TUYỆT ĐỐI không gợi ý goal tới `signed-off` (hook chặn chữ
> ký máy → spin vô hạn).

Đúng 1 câu ghép, không thêm section, không đổi gì khác của file.

## 5. Ngoài phạm vi / đã bác

- **Test P22 canh câu docs** — bác (C2): kiểm-docs-bằng-string-match, giá trị thấp.
- **Auto-set goal thay user** — bác: slash command là của user; tự bật vòng chạy dài
  không hỏi = ngược nguyên tắc human-gate.
- **Dùng Haiku-checker thay grader / nới điều kiện qua Gate 2** — bác: phá doer≠grader.
- **Nudge trong acceptance-card** — bác từ vòng hỏi (nặng hơn giá trị).
- **Port sang feature-loop-codex** — không áp dụng (Codex không có `/goal`).

## 6. Nơi chạm & release

| File | Thay đổi |
|---|---|
| `GUIDE.md` (root) | mục §3 + entry mục lục |
| `feature-loop/skills/feature-loop/SKILL.md` | 1 câu §4 |
| `.claude-plugin/plugin.json` + manifests acceptance-gate | 1.11.0 → 1.11.1 (sync script lo package) |
| `feature-loop/.claude-plugin/plugin.json` | 1.11.0 → 1.11.1 |

Release: sync + 3 suite xanh + commit `Release: acceptance-gate 1.11.1 / feature-loop 1.11.1 — nếp /goal cho đoạn máy S2→S4 (docs-only)`.
Repo tiêu thụ: không cần làm gì (plugin update là đủ).

## 7. Council log (rút gọn, truy vết)

- **Architect:** đúng cỡ; rủi ro chính = docs rot (template pin semantics của feature mới).
- **Skeptic (1-voice, trọng số ×2):** GUIDE xứng đáng (tri thức domain-specific);
  template gốc có lỗ transcript-mù + checker đoán bừa → C1; P22 over-build → C2;
  đề nghị cắt câu SKILL → bác có lý do (an toàn tại điểm dùng; Risk của chính Skeptic
  thừa nhận lỗ "user không đọc GUIDE"); bump patch hợp lệ theo tiền lệ.
