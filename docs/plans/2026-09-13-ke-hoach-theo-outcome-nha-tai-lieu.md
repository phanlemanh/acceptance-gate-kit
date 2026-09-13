# Kế hoạch theo kết quả — nhà tài liệu hai tầng, 13/09/2026

> Owner chốt 13/09: **repo khai, kit kiểm** (Q1 của
> [khung quyết định](../findings/2026-09-13-khung-quyet-dinh-kien-truc-hai-tang.md)).
> Câu Q2 «mở khi nào» được thay bằng kế hoạch này: chia theo **kết quả người
> dùng kit nhìn thấy**, mốc phát hành rơi ra từ đó. Nguồn thiết kế vẫn là
> [spec router](../superpowers/specs/2026-09-13-nha-tai-lieu-router-design.md).

## Nguyên tắc chia phase

- Mỗi phase kết thúc bằng **một thứ ai đó nhìn thấy** ở repo tiêu thụ hoặc ở
  thẻ start — không kết thúc bằng «đã có lib».
- Phase nào **không chạm engine** thì không phải vòng meta: làm ngay, không đếm
  vào luật chiều rộng (b).
- Phase chạm engine đi theo **một vòng feature-loop** với đúng số cổng thiết kế
  (Đáng · Phạm vi · Bằng chứng; T3 thêm 1.5), ship ở **mốc phát hành kế**, re-pin
  theo release.
- Số SỐNG/CHẾT khai trước, đo ở repo tiêu thụ, không đo ở kit.

## Bốn phase + hai phase chờ ngưỡng

| Phase | Kết quả người dùng thấy | Ai thấy | Chạm engine? | Khi nào |
|---|---|---|---|---|
| **P0 — Lời khai viết tay** | 6 khối `DOC-HOMES` cho 6 repo, mỗi khối ≤10 dòng; crm-onehub lộ đúng một mâu thuẫn phải chọn | owner | **không** | **ngay** |
| **P1 — Hết mò** | Mở `/start` ở repo đã khai → một dòng «nhà tài liệu»; feature-loop ghi design/plan vào nhà repo khai; vắng khai → như hôm nay | engineer/agent · owner | có (lib · thẻ · 2 dòng SKILL) | vòng meta của cửa sổ **2.12→2.13** |
| **P2 — Lời khai sai không lọt merge** | CI đỏ đúng câu khi một lớp khai hai nhà; kit tự khai và **tự đỏ rồi xanh**; repo mới `init` xong đã có `docs/MAP.md` | CI của repo · owner | có (CI · init · ADR) | **cùng vòng với P1** — mốc **2.13** |
| **P3 — Thẻ biết việc kế** | `/start` ở OneFlow in «việc kế theo plan: B5 · ★ 4/16 · 3 tin theo lời» — hết «đọc cả hai» | owner OneFlow · agent | có (bộ đọc bind hàng ý-định) | sau mốc 09/10 OneFlow → cửa sổ **2.13→2.14** |
| P4 — Cửa vào có lệnh *(hạt giống lát A)* | ý từ người không phải owner thành ô nháp không cần phiên; owner ký Cổng Đáng một chạm | owner · đội | có | chờ ngưỡng đếm (07/09 §5) |
| P5 — Cửa ra tự nuôi *(hạt giống lát C)* | băng vượt → ô nháp xuất hiện ở `/start` không ai gõ | owner · người dùng cuối | có | chờ ≥1 ván nghiệm thu thật |

P4, P5 ghi để thấy trọn cung; **không lập chi tiết ở đây** — mỗi cái có hạt giống
riêng với ngưỡng mở riêng.

---

## P0 — Lời khai viết tay (không chạm engine, làm ngay)

**Mục tiêu:** chứng minh một khối ba cột đủ khai cho **mọi** hình dạng đang sống,
trước khi viết một dòng code. Đây là phép thử giả định #1 trong ô cơ hội.

**Bàn giao:**
- Phụ lục `docs/findings/2026-09-13-loi-khai-viet-tay-6-repo.md`: 6 khối
  `DOC-HOMES` (kit · OneFlow · artifact-platform · media-library · crm-onehub ·
  floorplanstudio; mapposter ghi «không có tầng thường-trú — khối 2 hàng»).
- Với crm-onehub: khối **cố ý khai cả hai** `crm-plan.md` để lộ K1 — kèm một
  dòng «owner chọn: …» để trống.
- Một bảng «hàng nào engine bind, hàng nào chỉ chịu K1/K2» đếm trên 6 khối.

**Người thấy gì:** owner đọc 6 khối trong 5 phút, thấy khối có đủ hay thiếu
trường; thấy crm phải chọn gì.

**SỐNG:** 6/6 repo khai được không cần trường thứ tư; số hàng engine bind = 3
ở mọi repo. **CHẾT:** ≥1 repo cần trường mới → quay lại spec trước khi mở P1.

**Cổng người:** không. **Đảo:** xoá file.

---

## P1 + P2 — một vòng feature-loop, ship ở mốc 2.13

Gộp vì cùng chạm `lib/doc-homes.cjs` và cùng đối chứng dương (kit tự khai);
tách thì phải ghim lại hai lần. Hạng dự kiến **T3** (chạm `pre-merge-check.sh`
+ `start-scan.mjs`) → 4 cổng: Đáng · Phạm vi · 1.5 · Bằng chứng. Timebox
**3 ngày làm việc**.

### Mục tiêu P1 — hết mò

Phiên start ở repo đã khai trả lời «tài liệu X ở đâu» với **0 lượt đọc thêm**.
Đối chứng: OneFlow 05/09 mất 4 lượt.

**Bàn giao P1:**
1. `lib/doc-homes.cjs` — `parseDocHomes`, `homeFor`, `FIXED_HOMES`, `ENGINE_KEYS`
   (3 cặp). Khuôn khối ở `skills/acceptance/references/doc-homes-template.md`
   giữa marker `<!-- <<<DOC-HOMES-TEMPLATE -->`; writer/reader cùng rút.
2. `scripts/start-scan.mjs` — khối `docHomes: {present, rows, dupes, strays}`;
   `commands/start.md` in **một dòng** khi khoá có, im khi vắng.
3. `feature-loop/skills/feature-loop/SKILL.md` :117 và :164 gọi `homeFor`;
   bỏ «hoặc convention spec của repo».
4. Khoá `docs.router` trong `_acceptance/config.yaml` (splice bằng
   `config-patch.mjs`), luật vắng-thì-im.

**Người thấy gì (demo P1):** dán khối P0 vào `docs/MAP.md` của OneFlow, thêm
một khoá config, chạy `/start` → dòng `nhà tài liệu: 9 lớp khai · 0 hai-nhà ·
n file lạc`. Chạy S1 của feature-loop → design doc rơi vào nhà repo khai.

### Mục tiêu P2 — lời khai sai không lọt merge

**Bàn giao P2:**
5. `scripts/doc-homes-check.mjs` — K1 đỏ (exit 1, thông điệp ghim), K2 vàng
   (exit 0 + NOTE), quét theo header `quét:`, trừ `FIXED_HOMES`.
6. Một bước trong `scripts/pre-merge-check.sh` sau `product-map --check`;
   bộ file CI của `acceptance-init` 8 → 10.
7. `commands/acceptance-init.md` bước 3c: ghi **bản khai mặc định** vào
   `docs/MAP.md` + khoá config; **không mkdir**; có MAP rồi → chỉ nhắc.
8. Kit tự khai `docs/MAP.md` → K1 **đỏ đúng cặp** `docs/specs · docs/superpowers/specs`,
   K2 nêu `docs/lai-thu-nguoi-la.md` + 16 plan cũ → dọn (dời, không xoá) → xanh.
   *(Dọn đã làm 13/09 trước vòng — chiều đỏ của mục này chạy trên bản chép `git archive 0a85ed12 docs`.)*
9. ADR 0017 «Engine bind vào nhà repo khai; engine không sở hữu đường dẫn nào
   trong `docs/`».
10. `CONTEXT.md`: mục «Nhà tài liệu» · «Bản đồ tài liệu ≠ Bản đồ sản phẩm».

**Người thấy gì (demo P2):** trên kit, commit khối tự khai → CI đỏ với đúng một
câu; dời file → xanh. Trên một repo trắng, `acceptance-init` → mở `docs/MAP.md`
thấy khối mặc định.

### Chiều đỏ (khai trước, fixture do code dựng)

R0–R12 trong spec, cộng: R13 dòng thẻ start biến mất khi xoá khoá (đảo rẻ);
R14 K2 exit 0 trên crm-onehub dù 14 file lạc (không chặn).

### Số đo SỐNG / CHẾT của vòng

- **SỐNG:** thẻ start ở ≥1 repo tiêu thụ trả lời nhà với 0 lượt đọc thêm ·
  kit CI đỏ đúng 3 chỗ đã biết rồi xanh · 0 lượt gọi người ngoài 4 cổng thiết
  kế · ≥1 repo cũ tự khai trong 30 ngày sau 2.13.
- **CHẾT:** kit ghi/sửa file trong `docs/` của repo ngoài lối init · K2 chặn
  merge ở bất kỳ repo nào · cần lệnh cổng thứ bảy · vòng sửa thứ hai cùng lớp
  «writer/reader không cùng marker».

### Cổng người của vòng (đúng thiết kế, không hơn)

| Cổng | Người quyết gì | Máy soạn sẵn |
|---|---|---|
| Đáng | ký ngưỡng SỐNG/CHẾT trên | ô đã có, gỡ `[đề xuất]` |
| Phạm vi | 5–15 AC + evals | từ bàn giao 1–10 |
| 1.5 (T3) | duyệt plan | plan theo 10 mục trên |
| Bằng chứng | ký | evidence + thẻ |

**Đường đảo:** xoá khoá `docs.router` → mọi repo về hôm nay; 3 đường mặc định
trong `homeFor` giữ nguyên hành vi cũ.

---

## P3 — Thẻ biết việc kế (cửa sổ 2.13→2.14, sau mốc 09/10 OneFlow)

**Mục tiêu:** hạt giống B (06/09) đóng bằng router — không thêm khoá config.

**Bàn giao:** bộ đọc khối trỏ bởi `#fragment` của hàng `(ý-định, thường-trú)`;
hai marker được nhận (`<!-- x:start -->` kiểu OneFlow, `<!-- <<<X -->` kiểu
kit) — **cặp ca cho cả hai**; thẻ start in ba dòng của hạt giống B; quyết định
dòng dõi `iterate` (hàng roadmap `kiểm: opportunity:<slug>` — khuyến nghị — hay
khoá trong contract).

**Người thấy gì:** owner OneFlow mở `/start`, không phải chạy `pnpm plan:check`
riêng nữa; CLAUDE.md OneFlow bỏ câu «read both».

**SỐNG:** 4 lượt đọc → 0 đo trên OneFlow · `plan:check` và thẻ start in cùng tỉ
lệ ★. **CHẾT:** kit ghi vào roadmap của repo · hai bộ đọc lệch số.

---

## Hàng đợi phát hành — điều đổi so với 07/09 §3

| Cửa sổ | Trước (07/09) | **Đề nghị mới** |
|---|---|---|
| 2.11 → 2.12 | H2 thước sống theo đời model | giữ H2 · **P0 làm ngay, không tính vòng** |
| 2.12 → 2.13 | H1 lát A + B | **P1+P2 router** (một vòng) — lát A trượt |
| 2.13 → 2.14 | — | **P3** (= B đóng bằng router) · lát A nếu ngưỡng chạm |
| theo ngưỡng | H3 · lát C | không đổi |

Lý do trượt lát A: lát A cần «nhà ý định» đã khai để lệnh ký có chỗ đọc —
router là tiền đề của nó, không phải đối thủ. Đây là **đổi thứ tự hàng đợi**,
owner gạch.

## Trạng thái

Kế hoạch viết 13/09. P0 chưa làm. Ô `nha-tai-lieu-router` vẫn `discovery`;
spec chưa sửa theo khung §2 (việc kế của máy sau khi owner gạch hàng đợi).
