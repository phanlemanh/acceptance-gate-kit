# Model theo giai đoạn — đổi ca tại Gate 1 + docs feature_loop.models — Design Spec

> Ngày: 2026-07-08 · Trạng thái: DRAFT chờ user review
> Phạm vi: docs-only — acceptance-gate 1.11.1 → 1.11.2 (GUIDE) · feature-loop 1.11.1 → 1.11.2 (1 vế nối câu SKILL) · design-loop KHÔNG đổi
> Không đụng: mọi cơ chế/script/bảng route; workflow MODEL_ROUTES giữ nguyên
> Liên quan: artifact-platform PR #155 (Lớp 1 — pin finder/executor=opus, ĐÃ tạo, ngoài phạm vi spec này)
> Đã qua: council rút gọn 1-Skeptic (2026-07-08) — deltas §2/§5

---

## 1. Vấn đề

User chạy phiên mặc định **Fable (tier Mythos, đắt nhất)** vì giá trị của nó nằm ở
thiết kế (brainstorm/council/spec). Nhưng model phiên chạm vào **đoạn máy** S2→S4
qua 3 đường:

1. `finder` (S4) + `executor` (S3 song song) — 2 vai `null` trong bảng route, kế thừa
   session. → Đã có núm config `feature_loop.models` (Lớp 1, PR #155 artifact-platform).
2. **S3 TUẦN TỰ — đường thực thi MẶC ĐỊNH** — code chạy ngay trong main loop = model
   phiên. KHÔNG config nào với tới; cách duy nhất là đổi model phiên.
3. Điều phối S2/S4 (đọc plan, build args, routing verdict) — token ít hơn nhưng cùng
   giá Mythos.

Gate 1 là điểm đổi ca tự nhiên: ranh giới thiết-kế↔máy TRÙNG điểm-dừng-người sẵn có
(user đằng nào cũng đứng đó — duyệt, đặt `/goal`). Thiếu duy nhất: **nếp chưa được
tài liệu hóa** + docs gap thật về alias model (chính architect từng tư vấn sai
"`finder: opus-4.8`" — harness chỉ nhận tier alias `sonnet|opus|haiku|fable`).

Đóng khung đúng (Skeptic): đây là **cost-optimization**, không phải correctness —
S4 vẫn chấm đúng dù coder là ai; và L1 đã chặn 2 đường kế-thừa. Giá trị của wave
này: đường (2)+(3) — chỉ xử được bằng nếp thao tác, và nếp phải nằm đúng điểm dùng.

## 2. Quyết định đã chốt (vòng hỏi + council rút gọn 2026-07-08)

| # | Quyết định | Lựa chọn |
|---|---|---|
| Q1 | Kiến trúc 3 lớp | L1 config pin (repo tiêu thụ, đã làm) · L2 nếp "đổi ca tại Gate 1" · L3 nếp-hóa vào kit (spec này) |
| C1 | (Skeptic) Mảnh acceptance-init | **Bác** — scaffold gợi ý `feature_loop.models` trong `/acceptance-init` là cross-plugin coupling (models là seam của feature-loop); init sẽ phình thành registry của plugin con |
| C2 | (Skeptic) Điều kiện "nếu phiên Mythos" | **Bác nhánh if** — self-identify không đủ tin cậy, model tương lai tên khác → câu im lặng chết. Vế gợi ý `/model` viết MỀM (không xưng tier) và đi BÊN TRONG câu `/goal` 1.11.1 (vốn conditional theo "user muốn rời máy") → không thành báo động mỗi Gate 1 |
| C3 | (Skeptic) Vị trí cảnh báo alias | GUIDE mục **"Model theo giai đoạn"** riêng = source-of-truth (syntax + alias + bảng vai); mục `/goal` chỉ cross-ref 1 dòng |
| C4 | (Architect chỉnh Skeptic) | Skeptic claim "L1 giải quyết 100%" — sai một nửa: S3 TUẦN TỰ (default) là main loop, config không với tới → L2 là cơ chế chính danh cho đường code mặc định, không chỉ tiết kiệm điều phối |

## 3. Mục GUIDE mới — "Model theo giai đoạn (feature_loop.models) (1.11.2)"

Vị trí: NGAY SAU mục "/goal" (4.6), entry mục lục **4.7**. Nội dung 4 khối:

1. **Nguyên tắc xếp model** (3 dòng): đắt nhất nơi không-có-lưới và sai số compound
   (S1/S2 design, finder recall) · vừa nơi có lưới (coder, judge, ui) · rẻ nơi cơ học
   (machine, scribe). Bảng route mặc định của kit đã encode sẵn — chỉ 2 vai kế thừa
   phiên: `finder` (S4) + `executor` (S3 song song).
2. **Block config** (syntax + ví dụ):
   ```yaml
   feature_loop:
     models:
       finder: opus      # S4 bug-recall — không kế thừa phiên nữa
       executor: opus    # S3 nhánh song song
   ```
   Vai nhận: machine/ui/judge/finder/refute/baseline/provenance/scribe/synthesize
   (verify) + executor (execute). Giá trị `session` = kế thừa phiên.
3. **⚠ Cảnh báo alias:** harness CHỈ nhận tier alias `sonnet | opus | haiku | fable`
   — alias tự trỏ bản mới nhất của tier. Chuỗi version kiểu "opus-4.8" / "sonnet-5"
   bị harness TỪ CHỐI khi spawn agent.
4. **Giới hạn phạm vi:** pin `executor` chỉ cắn nhánh S3 **song song** (≥2 task
   independent); S3 **tuần tự** (mặc định) chạy model PHIÊN — muốn đổi phải đổi ca
   tại Gate 1 (xem mục /goal).

## 4. Sửa mục GUIDE "/goal" (4.6) — combo đổi ca

Chèn NGAY SAU dòng "**Khi nào:** ngay sau khi bạn duyệt Gate 1, trước khi rời máy."
(trước khối Template) đoạn ngắn:

> **Combo rời-máy trọn bộ (phiên đang chạy model đắt cho phần thiết kế):** duyệt
> Gate 1 → `/model claude-opus-4-8` (đoạn máy S2→S4 không cần tier thiết kế — S3
> tuần tự + điều phối chạy model phiên) → dán `/goal` theo template dưới → rời máy.
> Vai nào agent hóa được đã pin qua `feature_loop.models` — xem mục 4.7.

## 5. Câu SKILL — nối 1 vế vào câu /goal 1.11.1

`feature-loop/skills/feature-loop/SKILL.md`, section GATE 1 — câu 1.11.1 hiện kết
thúc bằng "…(hook chặn chữ ký máy → spin vô hạn)." Nối tiếp NGAY SAU (cùng câu ghép):

> Kèm theo đó: phiên đang chạy model đắt hơn mức đoạn máy cần (vd tier thiết kế) →
> in thêm gợi ý `/model claude-opus-4-8` TRƯỚC dòng /goal — S3 tuần tự + điều phối
> S4 chạy model phiên, đổi ca ở đây là điểm rẻ nhất (GUIDE mục "Model theo giai đoạn").

Không nhánh if theo tên model (C2) — "phiên đang chạy model đắt hơn mức cần" là phán
xét mềm của loop tại chỗ, in kèm trong cùng khối gợi ý /goal vốn đã conditional.

## 6. Ngoài phạm vi / đã bác

- **Scaffold models trong `/acceptance-init`** — bác (C1, cross-plugin coupling).
- **Nhánh if "phiên = Fable/Mythos"** — bác (C2, im-lặng-chết với model tương lai).
- **Đổi default bảng MODEL_ROUTES của workflow** (vd pin cứng finder=opus cho mọi
  repo) — bác: `finder: null` là quyết định có chủ đích ("recall = chỗ trí tuệ tạo
  giá trị"); repo phiên-rẻ vẫn muốn finder ăn model phiên lớn. Núm per-repo là đủ.
- **Auto-detect + auto-switch model** — bác: `/model` là slash command của user.

## 7. Nơi chạm & release

| File | Thay đổi |
|---|---|
| `GUIDE.md` | mục 4.7 mới (§3) + sửa mục 4.6 (§4) + entry mục lục 4.7 |
| `feature-loop/skills/feature-loop/SKILL.md` | 1 vế nối (§5) |
| Manifests | acceptance-gate 1.11.2 · feature-loop 1.11.2 (sync script lo package) |

Release: sync + 3 suite xanh + commit `Release: acceptance-gate 1.11.2 / feature-loop 1.11.2 — model theo giai đoạn: đổi ca tại Gate 1 + docs feature_loop.models (docs-only)`. Repo tiêu thụ: không cần gì thêm (Lớp 1 đã đi riêng PR #155).

## 8. Council log (rút gọn, truy vết)

- **Architect:** 3 khe Fable→đoạn-máy; Gate 1 = switchpoint miễn phí; docs gap alias có bằng chứng (chính mình tư vấn sai).
- **Skeptic (×2 trọng số):** giữ (a)+(b), cắt (c) acceptance-init; bỏ if-Mythos (in mềm, đi trong câu /goal); alias-warning về mục models riêng, /goal cross-ref; reframe cost-optimization. Architect chỉnh lại claim "L1 đủ 100%": S3 tuần tự vẫn là model phiên — L2 chính danh.
