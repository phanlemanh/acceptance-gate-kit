# design-floor bước 2c — móc S0 và S1 (FL4)

Hồ sơ: `_acceptance/design-floor-moc-s0-s1/` · hàng FL4 của `docs/plans/lo-trinh-kit.json` (phủ GN0, GN1) · kế hoạch
`docs/plans/2026-10-26-ke-hoach-design-floor-tiep.md` bước 4 («Móc vào feature-loop») · dựng trên FL3 (#429).

## Vấn đề

Sau FL3, bản gói `design-floor/dist/ui.mjs` chấm đúng hợp đồng nhập, nhưng chưa vòng nào của kit gọi nó. Kho có giao
diện đi vòng như kho không có: không ai biết kho đang ở bậc nào, phiên thiết kế ở S1 không được trỏ tới tri thức thiết
kế nào, và bản kế hoạch dùng lại hay sơ đồ luồng (nếu có) không được kiểm trước Cổng Phạm vi.

Người hưởng: phiên Claude Code ở kho tiêu thụ có giao diện (biết bậc kho ở S0, đọc đúng ≤2 tệp tri thức ở S1 thay vì
đoán) và chủ kho (đọc ở Cổng Phạm vi một dòng thông tin: kế hoạch dùng lại có tên nào không có thật, luồng có nút cụt
không). Trace: nguyên tố 2 (bằng chứng máy có trước cổng) và North Star (không thêm lượt gọi người).

## Thiết kế

### S0 — đọc bậc của kho

Lệnh mới `scripts/design-floor-bac.mjs --root .` (lõi acceptance-gate, như tri-thuc). Chỉ đọc. Bậc tính từ khai báo của
kho, theo thứ tự cao xuống:

| Bậc | Điều kiện (máy đọc) | Dòng S0 |
|---|---|---|
| M3 | `design_floor.niem_phong` trong `_acceptance/config.yaml` khác rỗng (người ghi; máy không có đường ghi) | `design-floor: bậc M3 — đã niêm phong <giá trị>` |
| M2 | `design_floor.tokens` và `design_floor.registry` cùng khai, cả hai tệp tồn tại | `design-floor: bậc M2 — nguồn <tokens> · <registry>` |
| M1 | `design.surface_globs` khai và khớp ≥1 tệp git theo dõi | `design-floor: bậc M1 — có giao diện, chưa khai nguồn` |
| M0 | còn lại | (không in gì) |

«Đã khai nguồn» của kế hoạch là «token, manifest DS»: M2 đòi cả hai khoá vì `ui reuse-plan check` sau bản vá C thoát 4
khi thiếu `--file` (registry) hay `--tokens` — chỉ tokens thì kiểm ở S1 luôn «không đo được». Khai báo hỏng (M3 mà thiếu
nguồn, tokens hay registry khai mà tệp vắng, tokens có mà registry vắng) không nâng bậc: lệnh in bậc thấp hơn kèm lý do, không
chặn. `--json` in `{bac, ly_do, tokens, registry}` cho S1 dùng lại. Thoát 0 mọi ca đọc được; 2 khi gọi sai.

### S1 — định tuyến tri thức, kiểm kế hoạch dùng lại, flow lint

Lệnh mới `scripts/design-floor-s1.mjs --root . --slug <slug>`. M0 → không in, không ghi. M1–M3 → ghi
`_acceptance/<slug>/design-floor.json` (vật hồ sơ, sinh ở S1, trước S4) và in các dòng thông tin:

1. **Định tuyến tri thức.** Đọc `knowledge/index.json` của bản ghim Design OS; tách chữ của câu giao + design doc + hợp
   đồng; mỗi mục chỉ mục có điểm = số thẻ `when` (và `id`) khớp; chọn tối đa HAI mục điểm ≥ 1, điểm cao trước, hoà thì
   theo thứ tự chỉ mục. Ghi đường tệp + ước lượng token (byte/4) của chỉ mục và từng tệp; nối một dòng vào
   `usage-report.md` của hồ sơ («design-floor S1: chỉ mục N token · <tệp> M token …»). Phiên S1 đọc đúng các tệp ấy.
2. **Kiểm kế hoạch dùng lại.** Hồ sơ có `reuse-plan.md` và kho ở M2/M3 → `ui reuse-plan check reuse-plan.md --file
   <registry> --tokens <tokens> --json`; mã thoát dịch thành «đạt · trượt (N tên) · không đo được». M1 → dòng «chưa
   khai nguồn — không kiểm». Không có tệp → không dòng.
3. **Flow lint.** Hồ sơ có `flow.json` → `ui flow lint flow.json --json`, cùng cách dịch. Không có tệp → không dòng.

Bộ đệm tải về nằm NGOÀI cây kho: `$TMPDIR/design-floor-upstream/<commit>` (đổi bằng `DESIGN_FLOOR_CACHE`), cùng chỗ bộ đo
bước 1 đã dùng; tệp khoá thêm khối `tri_thuc` (băm chỉ mục + băm từng tệp chỉ mục trỏ). Nguồn tri thức: xem Hỏi-2 dưới — khuyến nghị tải lúc chạy từ bản ghim `a7ad5f1`, kiểm băm theo một khối `tri_thuc`
mới của tệp khoá; tải không được thì dòng ghi «không đọc được ở đây» và vòng đi tiếp không tri thức.

### Thẻ Cổng Phạm vi

`gate-card.js` đọc `design-floor.json` và in khối «Sàn thiết kế» gồm các dòng trên. Khối là thông tin: không thêm mục
nào vào `routing.hoi`, không đổi điều kiện làn V. M0 hay vắng tệp → thẻ không đổi một byte.

### Nối dây

SKILL feature-loop: S0 thêm một khối marker gọi lệnh bậc; S1 thêm bước 0d gọi lệnh S1 sau bước tra tri thức. Bên đọc
của khối marker là ca đo: rút lệnh từ khối, chạy trên kho fixture, so đầu ra (mẫu round-trip của kit).

## Ngoài phạm vi

- Chặn theo bậc (M1 chỉ luật đã phân xử · M2 cảnh báo · M3 chặn) — thuộc S4, hàng FL5.
- Cuối S3 autofix (GN3) và S4 chấm tuân thủ (GN4) — FL5; `ui gate` ở S4 (FL-C1).
- Máy tự nâng bậc hay ghi niêm phong — M3 chỉ người ghi; vòng nâng bậc ở kho tiêu thụ là việc của kho đó.
- Sinh `reuse-plan.md` hay `flow.json` — FL4 chỉ kiểm khi phiên S1 đã viết chúng.

## Bốn phép thử North Star

1. **Không ghi sau S4** — FL4 chỉ ghi ở S1 (`design-floor.json`, một dòng usage-report).
2. **Lượt người** — khối thẻ là thông tin, không câu hỏi; Cổng Phạm vi của vòng này có hai câu (CỘNG, nguồn tri thức), một
   chạm.
3. **Chi phí máy** — lệnh bậc và hai lệnh `ui` 0 token; đọc tri thức có trần chỉ mục + 2 tệp và có số ở usage-report.
4. **Chiều đỏ** — bốn kho fixture sinh bằng mã; mỗi điểm móc (S0, S1, thẻ) có đột biến đỏ đúng thông điệp.
