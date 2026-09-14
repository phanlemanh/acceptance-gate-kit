# Khung quyết định — kiến trúc hai tầng cho tài liệu của kit, 13/09/2026

> Bản đứng-lùi-ra, viết bằng ngôn ngữ thường, để owner quyết một lần. Nó **gom**
> sáu tài liệu cùng ngày (bản đồ · spec router · ô cơ hội · ba hình 04–06 ·
> khảo sát OneFlow) chứ không thay chúng; số và bằng chứng vẫn ở đó. Mọi câu
> ở đây đều trỏ được về một chỗ có số.

## 0. Một đoạn, nếu chỉ đọc một đoạn

Kit lo rất tốt cho **một vòng** (hồ sơ `_acceptance/<slug>/` là nguồn sự thật
sạch, cổng có răng, bằng chứng có chiều đỏ). Kit **không lo** cho thứ sống
**suốt đời repo** — roadmap, thiết kế nền, luật cho máy, trạng thái — nên mỗi
repo tự mọc một kiểu, và có repo mọc hai bản cùng tên khác nội dung. Đề xuất:
**kit không sở hữu đường dẫn nào trong `docs/` nữa; repo khai «vật này sống ở
đâu» trong một khối máy đọc được; kit chỉ đọc lời khai và bắt lời khai tự mâu
thuẫn.** Đó là một vòng meta, chờ mốc 2.12, không thêm lượt gọi người nào.
Owner chỉ còn hai câu phải trả lời — ở mục 6.

## 1. Hiện trạng — ba câu, mỗi câu một số

**1a. Kit mạnh ở giữa vòng, đứt ở hai đầu.** So với playbook của Anthropic
theo sáu chặng (hình 04): chặng 2–5 khớp hoặc kit đi xa hơn; chặng 1 và 6 đứt.

- Cửa vào: ý định chỉ sinh ra khi owner **ngồi trong phiên**; Cổng Đáng không có
  lệnh ký — **0/44** ô cơ hội ký bằng lệnh.
- Cửa ra: đo giá trị **một lần** rồi thôi; **0/97** hồ sơ trong kho kit từng đi
  hết tới Cổng Giá trị; không có gì canh sau phát hành.

**1b. Mỗi loại tài liệu có hai đời sống, kit chỉ lo một.** Một vòng cần ý định,
đặc tả, kế hoạch, bằng chứng — kit đặt nhà rõ cho chúng. Nhưng repo còn có bản
*thường trú* của cùng các loại đó (roadmap, design system, CLAUDE.md, STATUS) —
không ai đặt nhà. Hệ quả đo được: **6 repo, 6 hình dạng** thư mục; crm-onehub có
`docs/crm-plan.md` 1368 dòng **và** `docs/plan/crm-plan.md` 555 dòng; hai repo
có `AGENTS.md` khác `CLAUDE.md`. Chính kit cũng có hai nhà spec (12 vs 67) và
hai nhà plan (44 vs 69). Engine hôm nay ghim **hai đường cứng**
(`docs/superpowers/specs/`, `docs/superpowers/plans/`) kèm chữ «hoặc convention
của repo» mà không ai kiểm.

**1c. Một repo đã tự giải bài này ở phía repo — OneFlow.** Khối `plan-freeze`
máy đọc được trong `docs/roadmap.md`, guard F0–F4, sổ cái hạng mục đã ký, `STATUS.md`
có răng «không được cũ hơn hồ sơ mới nhất», và hai phiên nghiệm thu đã `held`.
Tất cả **không cần kit sở hữu một đường dẫn nào** — chúng chỉ đọc `_acceptance/`.
Đây là bằng chứng cho chiều phụ thuộc đúng: *repo đọc kit, kit không đọc ngược*.

## 2. Kiến trúc tương lai — hai tầng, một khối, một chiều

Ý cốt lõi, một câu: **engine biết TÊN CẶP, không biết ĐƯỜNG; đường sống ở lời
khai của repo.**

### Tầng ENGINE — kit sở hữu, đóng, có phiên bản

| Bộ phận | Làm gì |
|---|---|
| Ba nhà cố định | `_acceptance/<slug>/` · `PRODUCT-MAP.md` · `.out-of-scope/` — hằng số engine, không ai khai khác được |
| Ba khoá bind | `(đặc-tả, theo-vòng)` · `(kế-hoạch, theo-vòng)` · `(ý-định, thường-trú)` — engine chỉ hiểu ba cặp này |
| `homeFor()` | feature-loop hỏi «nhà của cặp X đâu?»; có lời khai → trả lời khai; vắng → trả mặc định hôm nay |
| Hai phép kiểm | **K1** một lớp khai hai nhà → **đỏ** (tự mâu thuẫn) · **K2** file nằm ngoài mọi nhà đã khai → **vàng**, không bao giờ chặn |
| Một dòng thẻ start | `nhà tài liệu: 9 lớp khai · 0 hai-nhà · 14 file lạc` |
| Lối vào repo mới | `acceptance-init` ghi **bản khai mặc định** + khoá config — **không tạo thư mục** |

### Tầng REPO — repo sở hữu, mở

```
<!-- <<<DOC-HOMES -->
phiên-bản: 1 · quét: docs/ · *.md · adrs/
lớp-vật     | vòng-đời   | nhà
đặc-tả      | theo-vòng  | docs/superpowers/specs/
kế-hoạch    | theo-vòng  | docs/superpowers/plans/
ý-định      | thường-trú | docs/roadmap.md#plan-freeze · docs/strategy/vision.md
trạng-thái  | thường-trú | STATUS.md
luật-máy    | thường-trú | CLAUDE.md · .claude/skills/
<!-- DOC-HOMES>>> -->
```

- Ba cột. Tên lớp **mở** — repo đặt thêm lớp gì tuỳ (`sổ-cái`, `quyết-định`…);
  engine chỉ bind ba cặp, còn lại chỉ chịu K1/K2.
- `nhà` nhận `#fragment` để trỏ một khối trong file (như OneFlow đang làm).
- `quét:` khai vùng K2 nhìn — hết vùng mù kiểu `adrs/` ở gốc.
- Răng riêng của repo (freeze, drift, sổ cái) **ở lại repo**. Kit không nuốt.

### Ba luật ranh giới

1. Engine **bind**, không **sở hữu**.
2. Chiều phụ thuộc **một hướng**: repo được đọc `_acceptance/`; engine không đọc
   vật repo ngoài ba khoá bind.
3. Vật engine **không đi qua lời khai** — ba nhà cố định là hằng, hiện ở thẻ
   start dưới nhãn «nhà kit» để người đọc playbook thấy `intent.md` ↔
   `opportunity.md`.

Hình: `docs/plans/assets/2026-09-13-ban-do-vung-lam-viec/05-truoc-sau-router.svg`
(trước/sau) · `06-kit-moi-vs-playbook.svg` (ba lane so playbook).

## 3. Hạng mục — ba nhóm, đừng lẫn

### A. Vòng «router» — mở sau mốc 2.12, một vòng, ~3 ngày

| # | Việc | Chạm |
|---|---|---|
| A1 | `lib/doc-homes.cjs`: parse khối, `homeFor`, `FIXED_HOMES`, `ENGINE_KEYS` | lib mới |
| A2 | `scripts/doc-homes-check.mjs`: K1 đỏ, K2 vàng, quét theo header | script mới |
| A3 | Một bước trong `pre-merge-check.sh`; bộ file CI 8 → 10 | CI |
| A4 | `start-scan.mjs` thêm khối `docHomes`; thẻ in một dòng | thẻ start |
| A5 | feature-loop SKILL.md :117 / :164 gọi `homeFor`, bỏ «hoặc convention repo» | skill |
| A6 | `acceptance-init` bước 3c: ghi bản khai mặc định + khoá `docs.router` | lệnh init |
| A7 | Kit tự khai `docs/MAP.md`; K1 phải **đỏ đúng chỗ đã biết** trước khi tin | đối chứng dương |
| A8 | ADR 0017 «Engine bind vào nhà repo khai; không sở hữu đường dẫn trong docs/» | ADR |

Chiều đỏ khai trước: R0–R12 trong spec (fixture do code dựng, round-trip
writer/reader, ca trên cây kit thật).

### B. Hạt giống liền kề — KHÔNG thuộc vòng A, đừng gộp

| Hạt giống | Đóng gì | Chờ gì |
|---|---|---|
| Lát A «Cổng Đáng có lệnh ký» | nửa còn lại của chặng 1 | ngưỡng đếm ở hạt giống 07/09 §5 |
| B «thẻ start đọc khối plan» (06/09) | 4 lượt đọc → 0; **trở thành** bộ đọc bind vào hàng `(ý-định, thường-trú)` — không thêm khoá config | mốc 09/10 của OneFlow |
| Lát C «băng sau phát hành» | chặng 6 | ≥1 ván nghiệm thu thật ở repo tiêu thụ |
| Nối `iterate` (phát hiện 13/09) | vòng lặp làm rơi ngưỡng | quyết cùng B: dòng dõi ở hàng roadmap (`kiểm: opportunity:<slug>`) hay khoá trong contract |

### C. Dọn nhà kit — T1, làm lúc nào cũng được, không cần vòng

Dời (không xoá) 12 spec cũ ở `docs/specs/`, 16 plan-theo-vòng cũ trong
`docs/plans/`, `docs/lai-thu-nguoi-la.md`. Sau A7 những chỗ này chính là ba
chỗ K1/K2 phải kêu.

**Đã làm 13/09** (cùng ngày, sau khi owner gọi): đính chính 12 → **10** design
doc dời (2 file là đặc-tả thường-trú, ở lại `docs/specs/`); 16 plan dời;
`lai-thu-nguoi-la.md` → `docs/reference/`. 27 `git mv`, mọi dòng trỏ sống đã
kéo. Chiều đỏ của R8 chuyển sang bản chép cây tại `8a703c36` (spec §8).

### Không làm — đã bác, có lý do trong spec và ô

Kit tuyên cây thư mục chuẩn · migrate 6 repo · tạo `intent/` ở gốc · kit-hoá
`STATUS.md` · lệnh cổng người thứ bảy · dời design doc vào hồ sơ trong vòng này.

## 4. Đối chiếu north star — từng vế, không đọc lướt

| Vế của north star | Đề xuất này | Kết luận |
|---|---|---|
| **Nguyên tố 2 — bằng chứng không tự dối** | «một vật một nguồn» hôm nay là lời dặn; K1 biến nó thành **vật máy giữ**. Người hưởng: **máy** (phiên start hết mò, 4 lượt → 0) và engineer repo tiêu thụ (hết hai `crm-plan.md` không ai biết) | trace được, người hưởng cụ thể |
| **Nguyên tố 1 — ý định chốt trước** | ý định thường-trú có nhà khai → có chỗ để chốt; hạt giống B/lát A xây tiếp trên nhà đó | trace được |
| **Nguyên tố 3 — khoảnh khắc quyết thật** | 0 cổng mới, 0 lượt gọi người thêm; K2 vàng không chặn; **đảo rẻ**: xoá một khoá là về hôm nay | trace được; không chạm khó-đảo ở phía consumer |
| **Thước: lượt gọi người/vòng** | không đổi (mục tiêu ≤3, T3 trần 4) | giữ |
| **Thước: giờ-kit là chi phí** | đây là **meta-work** — giá trị chạm engineer và máy, không chạm người dùng cuối của sản phẩm. Phải đi đúng luật (b): chờ 2.12, **một** vòng, owner gọi tên | đúng luật, ghi rõ trong ô |
| **Luật nới 07/09 (đề xuất CỘNG)** | có CỘNG (lib + script + bước CI). Hồ sơ đã ghi «đi dưới luật nới»; điều kiện thu hồi áp lên nó | tuân |
| **Bộ đo một tầng (luật a)** | K1/K2 đo *lời khai*, không đo *thước*. Nguy cơ: K2 vàng sinh vòng dọn dẹp → thành thước-của-thước | **chốt**: K2 không bao giờ đỏ và không mở vòng dọn; dọn là T1 |
| **Neo ngoài của việc-kit** | giá trị chỉ chạm khi phát hành tới repo tiêu thụ; ngưỡng SỐNG trong ô: ≥1 repo cũ tự khai trong 30 ngày | có neo, có ngưỡng |

**Kết luận:** align, với hai điều kiện đã ghi vào ô — (i) mở sau 2.12, một vòng;
(ii) K2 không chặn và không đẻ vòng dọn. Một điểm phải nói thẳng: đây là vòng
**thứ ba** meta trong cửa sổ 2.11→2.12 nếu mở sớm; luật (b) cho **một**. Nên
«sau 2.12» không phải thận trọng thừa, nó là luật.

## 5. Điều máy tự quyết — ghi sổ, cửa veto mở

Theo luật lời mời cổng (01/09): mục nào căn cứ là quy tắc đã khai thì máy đi
tiếp, không hỏi. Ba mục dưới đây máy quyết, owner veto nếu muốn:

- **Bỏ cột `chủ`, tên lớp mở** — căn cứ: cột `chủ` là hai nguồn cho một sự
  thật (engine đã hardcode ba nhà); tập đóng 6 lớp không chứa `trạng-thái`,
  `sổ-cái`, `quyết-định` mà OneFlow/crm đang có thật.
- **Kit tự khai hàng hạt giống để K1 đỏ đúng chỗ «trộn vòng đời»** — căn cứ:
  luật «thước phải gắn vào vật» — đối chứng dương phải đỏ trên vật thật.
- **Marker `<!-- <<<DOC-HOMES -->`** cho khối kit sở hữu — căn cứ: tiền lệ
  đang sống trong `commands/start.md`; khối repo sở hữu (plan-freeze) giữ marker
  của repo, engine đọc theo tên hàng khai — đó là việc của hạt giống B.

## 6. Hai câu chỉ owner trả lời được

Phép thử: *người trả lời khác khuyến nghị thì dựa vào điều gì máy không có?*
Hai câu dưới qua phép thử — một là đánh-đổi giá trị và khó đảo, một là khẩu vị
rủi ro.

**Q1 — Chốt hướng «repo khai, kit kiểm» (khó đảo: 7 repo sẽ khai theo).**
Đánh đổi thật: *tự do* (mỗi repo một hình, hợp lệ) ↔ *đồng nhất* (kit tuyên
một cây, dễ nhảy giữa repo). Khuyến nghị: **repo khai** — vì bất biến «kit là
engine» và vì OneFlow chứng minh repo tự lo được tầng này tốt hơn kit.

**Q2 — Mở vòng A khi nào.** Sau 2.12 theo luật (b), hay gọi tên sớm và chấp
nhận vượt (b) có chủ ý, ghi vào hồ sơ phát hành. Khuyến nghị: **sau 2.12** —
không có việc nào của consumer đang chặn vì thiếu router; cái đang chặn thật
(hai `crm-plan.md`) là quyết định người, làm được ngay bằng tay.

Trả lời hai câu này là đủ để máy đi tiếp: sửa spec theo mục 2, viết ADR nháp,
và đóng ô ở `discovery` chờ mốc.

**Owner trả lời 13/09:** Q1 — **đồng ý repo khai, kit kiểm.** Q2 — không chọn
mốc; yêu cầu lập lại theo kết quả người dùng kit thấy được → kế hoạch ở
[`docs/plans/2026-09-13-ke-hoach-theo-outcome-nha-tai-lieu.md`](../plans/2026-09-13-ke-hoach-theo-outcome-nha-tai-lieu.md)
(P0 làm ngay không chạm engine · P1+P2 một vòng ship 2.13 · P3 sau mốc 09/10
OneFlow). Câu còn treo cho owner: đổi thứ tự hàng đợi 07/09 §3 (lát A trượt
một cửa sổ).
**Owner 13/09 (tối):** đồng ý đổi hàng đợi. **14/09:** cửa sổ 2.12→2.13 chuyển
cho vòng tối ưu token `khoi-tim-loi-tra-phi-theo-vat`; router lùi 2.13→2.14.

## 7. Trạng thái

Chưa có gì được thi công. Vật của ngày 13/09: bản đồ
(`2026-09-13-ban-do-vung-lam-viec-hai-tang.md`) · spec
(`docs/superpowers/specs/2026-09-13-nha-tai-lieu-router-design.md`, **chưa sửa
theo mục 2**) · ô `_acceptance/nha-tai-lieu-router/` (`discovery`) · hình 01–06
trong `docs/plans/assets/2026-09-13-ban-do-vung-lam-viec/` (04–06 chưa commit).
