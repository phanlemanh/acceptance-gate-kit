---
name: design-pass
description: Nghi thức thiết kế IN-HARNESS cho bước S1-D của feature-loop — phiên chuyên trách CHỈ làm thẩm mỹ + UX trên bản bấm được đang chạy trong Browser pane, owner ngồi xem và phản ứng bằng lời từng vòng; Gate 1 duyệt trên bản bấm được, không duyệt UI bằng chữ. Dùng khi feature chạm UI cần khoảnh khắc visual trước Gate 1, hoặc khi user muốn design-pass một surface đang chạy (redesign, polish, dark-mode pass trên proto). KHÔNG dùng cho logic/backend, KHÔNG sửa component nền "cho proto đẹp", KHÔNG chấm fidelity hay sinh evidence máy (grading sống ở S4), KHÔNG thay vòng lặp code S3.
---

# design-pass — phiên thẩm mỹ + UX trên bản bấm được

**Một mặt phẳng làm việc:** mọi vòng lặp diễn ra trong Claude Code, trên
artifact thật đang chạy. Không surface thứ hai, không gương ngoài, không cầu
đồng bộ nào là mắt xích bắt buộc. Phiên này CHỈ làm thẩm mỹ + UX — mọi thứ
khác (logic, dữ liệu, component nền) là finding chờ Gate 1, không phải việc
của phiên.

Vai trong feature-loop: chạy ở **S1-D, TRƯỚC Gate 1** — để người duyệt bấm
được thứ họ duyệt. Doer≠grader giữ nguyên: skill này chỉ AUTHOR (sửa proto,
ghi vết); chấm máy là việc của S4, chấm thẩm mỹ là việc của owner ngồi xem.

## 1. Preflight — thiếu gì nói đích danh, không lỗi mờ

1. Đọc `_acceptance/config.yaml` khối `design_pass`:

   | Key | Bắt buộc? | Nghĩa |
   |---|---|---|
   | `design_pass.proto_route` | BẮT BUỘC | TEMPLATE per-repo của URL bản bấm được, PHẢI chứa `{slug}` (vd `http://localhost:3000/proto/{slug}`). Route là per-feature nên config chỉ giữ khuôn; mỗi lần gọi điền slug, và cho phép override bằng arg khi route đặc thù. |
   | `design_pass.ds_skill` | khuyến nghị | Tên skill chuẩn DS/plugin của repo tiêu thụ (vd `<plugin>:<skill>`). Vắng → thang DS ở mục 2. |
   | `design_pass.dev_cmd` | optional | Lệnh khởi động dev server của repo — để thông điệp DỪNG-vì-route-chết in đúng lệnh. |
   | `design_pass.capture_cmd` | optional | Lệnh chụp riêng của repo; vắng → chụp bằng Browser pane. |

   Repo chưa có khối → in lệnh mẫu cho user chạy (script `config-patch` của
   plugin acceptance-gate, dry-run mặc định):

   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/scripts/config-patch.mjs" --config _acceptance/config.yaml --key design_pass.proto_route --value "http://localhost:3000/proto/{slug}"
   ```

2. **Thiếu khối `design_pass` hoặc thiếu `proto_route` → DỪNG nghi thức
   NGAY**: in đích danh key thiếu + lệnh mẫu trên + giải thích cần một bản
   bấm được đang chạy (đường proto C2 của repo). TUYỆT ĐỐI không fail-open
   sang một route mặc định tự đoán.

3. Xác định **workspace slug đang phục vụ** (phiên design-pass luôn phục vụ
   một feature đang trong vòng lặp): feature-loop gọi thì slug đi kèm; gọi
   standalone không có slug → hỏi user đúng 1 câu chọn slug trong
   `_acceptance/`; repo chưa có workspace nào → nói rõ design-pass không
   chạy mồ côi — chạy `/feature-loop` trước để có contract mà findings có
   chỗ về.

## 2. Nạp 2 nguồn luật

- **(a) `ux-ui-craft`** (skill cùng plugin) — sàn accessibility, chống
  AI-slop, kỷ luật token. Luôn nạp.
- **(b) Nguồn luật DS của repo — theo THANG, mọi nấc có tên:**
  1. `design_pass.ds_skill` khai trong config → nạp skill đó.
  2. Key vắng / skill không resolve được → tìm **từ vựng token của repo**
     (theme.css, tailwind config, design-tokens file… — vật liệu per-repo,
     kit không đoán tên cụ thể) → dùng nó làm luật.
  3. Repo 0 token (không có từ vựng nào nhận diện được) → dùng từ vựng
     **shadcn** làm mặc định CÓ TÊN: token/component đề xuất trong phiên
     theo khuôn shadcn. shadcn là chuẩn ngành công khai — với repo ngoài
     React/Tailwind chỉ mượn TỪ VỰNG token (tên biến, thang màu/spacing),
     không mượn component.

  Rơi xuống nấc 2 hoặc 3 thì KHÔNG im lặng: tự ghi 1 finding **Nhóm 2**
  ("repo chưa khai skill chuẩn DS — phiên chạy trên `<repo-tokens|
  shadcn-default>`") để Gate 1 thấy và quyết nhận nấc đó làm chuẩn repo hay
  đầu tư DS riêng. Thiếu nhánh này là thiếu nhánh degrade ds_skill.

## 3. Mở đối tượng làm việc (Browser pane)

Đối tượng của phiên là **bản bấm được ĐANG CHẠY**, mở qua URL từ
`proto_route` (điền `{slug}`). Vật liệu của nó theo **thang vật liệu** —
hạ bậc phải ĐỂ VẾT, không hạ ngầm:

| Bậc `material:` | Khi nào | Độ tin cho người duyệt |
|---|---|---|
| `real-components` (MẶC ĐỊNH) | Repo có component/token — kể cả SURFACE MỚI: proto module mới ghép từ component sẵn có | Fidelity cấu trúc, drift 0, công port ~0 |
| `scaffold` | Repo có token/DS nhưng chưa đủ component cho surface này — khung dựng bằng primitives + token repo | Token đúng; hình khối component là bản nháp |
| `static` | Repo mới tinh / khác stack — HTML tĩnh token-only | Chỉ ý định thị giác; công port xa nhất |

Bậc đang dùng PHẢI khai `material:` trong ghi vết kết phiên (mục 5) — thẻ
Gate 1 hiện nó để người duyệt biết mình đang duyệt trên vật liệu gì.

Route không mở được (404 / connection refused) → **DỪNG nghi thức**: nói rõ
bản bấm được chưa chạy; repo đã khai `design_pass.dev_cmd` → in đúng lệnh đó
cho user khởi động; chưa khai → nói rõ chưa có lệnh khởi động được khai và
trỏ đường dựng proto của repo. **KHÔNG tự dựng route/logic thay repo** —
dựng proto là việc của feature-loop/S1, không phải của phiên thẩm mỹ.

## 4. Vòng lặp owner-phản-ứng

Nhịp MỖI vòng, không tắt bước:

1. **Sửa** code proto — chỉ thẩm mỹ + UX, trong từ vựng token (nguồn luật
   mục 2).
2. **Reload** Browser pane cho owner nhìn bản mới.
3. **CHỜ owner phản ứng bằng lời** — owner ngồi xem là giác quan thẩm mỹ
   của phiên; mô tả ngắn cái vừa đổi rồi im để owner nói.
4. Phản ứng → vòng kế; owner gật phần nào ghi nhận phần đó.

KHÔNG tự chấm thẩm mỹ thay owner — không "tôi thấy đẹp rồi" để tự kết
phiên, không thay phản ứng của owner bằng đánh giá của model. Phần chấm máy
(evals, hook) sống ở S4; phiên này không sinh evidence.

**Ví dụ một vòng (nhịp chuẩn):**

> Owner: "Nút hành động chính chìm quá, với giá tiền đọc không nổi."
>
> 1. Sửa proto trong TỪ VỰNG TOKEN: nút chính đổi sang class/token nhấn của
>    repo (vd `--color-primary`), giá tiền lên bậc typography có sẵn — KHÔNG
>    chèn hex, KHÔNG sửa component nền.
> 2. Reload Browser pane, nói 1 câu: "Đã nâng nút chính lên token nhấn +
>    giá lên bậc chữ lớn — anh thấy sao?"
> 3. Owner gật nút, chê tiếp khoảng cách card → vòng kế. Cuối phiên: 2 việc
>    trên vào findings Nhóm 1 (đã vá); nếu owner đòi một variant nút mà DS
>    chưa có → đó là finding Nhóm 2, ghi chờ Gate 1, KHÔNG chế tại chỗ.

## RÀNG BUỘC CỨNG (cả phiên — vi phạm là dừng tay, không phải style)

- **không hex mới** — chỉ từ vựng token của repo (hoặc nấc DS đang khai);
  cần màu chưa có = finding Nhóm 2, không phải một mã hex chèn tạm.
- **không webfont** — không thêm font ngoài; typography đi theo token repo.
- **không sửa `components/ui`** hay component nền "cho proto đẹp" —
  thiếu/xấu ở tầng component = finding Nhóm 2 chờ Gate 1, sửa ở Build.
- **không logic nghiệp vụ / write-path** — proto là Ý ĐỊNH: data mock, không
  đường ghi; phiên thẩm mỹ càng không mở đường ghi mới.

## 5. Kết phiên — capture + findings + ghi vết workspace

1. **Capture ma trận** state × breakpoint (× theme khi repo có dark mode):
   - states: lấy từ khai báo states của proto (query `?state=` hoặc file
     states của proto module). Proto KHÔNG khai states → **hỏi owner danh
     sách state cần duyệt ngay đầu phiên** (1 câu), ghi vào frontmatter —
     không bịa, không chụp mỗi default rồi im.
   - breakpoints mặc định: mobile 375 / desktop 1280 (resize Browser pane);
     theme light/dark qua colorScheme khi repo có dark mode.
   - repo khai `design_pass.capture_cmd` → dùng lệnh đó thay chụp tay.
   - Ảnh về `_acceptance/<slug>/evidence/design-pass/<state>--<breakpoint>[--<theme>].png`.
2. **Cấm đường cũ:** KHÔNG ghi vào `evidence/design/` và KHÔNG tạo
   `provenance.json` — đó là trigger của công tắc CT2 (ceremony mockup đã
   khai tử); design-pass không được bật nhầm làn chết.
3. **Ghi vết:** viết `_acceptance/<slug>/design-pass.md` theo ĐÚNG khuôn
   giữa cặp marker `DESIGN-PASS-NOTE-TEMPLATE` dưới đây (khuôn là seam
   LLM-viết→máy-đọc — một chỗ, có marker, đừng chế biến thể):

<<<DESIGN-PASS-NOTE-TEMPLATE
---
slug: <slug>
at: <ISO UTC>
route: <url đã mở>
material: <real-components|scaffold|static>
ds_skill: <tên-skill-đã-nạp|repo-tokens|shadcn-default>
states: [<danh sách state đã duyệt>]
breakpoints: [mobile-375, desktop-1280]
themes: [light]
patched: <n>
deferred: <n>
---
# design-pass — <slug>

## Ma trận capture

| state | breakpoint | theme | file |
|---|---|---|---|
| <state> | <breakpoint> | <theme> | evidence/design-pass/<file>.png |

## Findings

### Nhóm 1 — vá-được-trong-từ-vựng-token (đã vá tại chỗ)

- <finding — đã đổi gì, 1 dòng/finding>

### Nhóm 2 — đòi-đổi-DS/component (chờ Gate 1)

- <finding — thiếu/xấu gì ở tầng DS/component, đề xuất 1 dòng>
DESIGN-PASS-NOTE-TEMPLATE>>>

   `patched` = số finding Nhóm 1, `deferred` = số finding Nhóm 2; `themes`
   ghi `[light, dark]` khi có chụp dark. Nhóm 2 là input trực tiếp của
   Gate 1 — người duyệt quyết ghi Known limits / mở contract / nâng phạm vi.

## Degrade — bảng tra (mỗi thiếu hụt 1 hàng, không lỗi mờ)

| Thiếu | Hành xử |
|---|---|
| Khối `design_pass` / key `proto_route` | DỪNG + in key thiếu đích danh + lệnh `config-patch` mẫu (mục 1). Không fail-open. |
| `ds_skill` vắng / không resolve | Chạy tiếp theo thang DS (mục 2) + finding Nhóm 2 nêu nấc đã dùng. |
| Route không mở được | DỪNG + in `dev_cmd` nếu khai + trỏ đường dựng. Không tự dựng. |
| Proto không khai states | Hỏi owner danh sách state đầu phiên, ghi frontmatter. Không bịa. |
| Slug không xác định (standalone) | Hỏi 1 câu chọn slug trong `_acceptance/`; không có workspace → không chạy mồ côi. |

## Ranh giới

- **Bề mặt hoàn toàn chưa dựng được bản chạy** (chưa có proto nào mở nổi):
  việc của bước dựng proto trong S1, không phải của phiên này — DỪNG theo
  hàng route-chết, đừng lách bằng cách tự dựng.
- **Phiên SAU Gate 1** (owner phản hồi thẩm mỹ giữa S3/S4): findings đổ về
  `review-findings.md` của slug (kênh phản-hồi-giữa-vòng), KHÔNG ghi đè
  `design-pass.md` của bản đã duyệt — bản đã duyệt là mốc neo của Gate 1.
- Phiên đòi owner ngồi xem trực tiếp; owner async chưa nằm trong phạm vi
  nghi thức này.
