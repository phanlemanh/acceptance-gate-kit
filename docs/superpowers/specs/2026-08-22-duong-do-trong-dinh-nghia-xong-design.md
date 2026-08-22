# Thiết kế — «Đường đo nằm trong định-nghĩa-xong» (chip C)

**Đề bài:** `docs/plans/2026-08-21-hat-giong-duong-do-trong-dinh-nghia-xong.md` (Cổng Đáng gật
21/08, dây A → B → C). **Hạng:** T2 — chạm `scripts/gate-card.js`,
`skills/acceptance/references/contract-template.md`, `feature-loop/skills/feature-loop/SKILL.md`,
`CONTEXT.md`, tests. Không chạm `lib/**`, hook, lưới trước-merge, `uat-session`.

## Lỗ

Ngưỡng sống/chết khai ở Cổng Đáng, số đo đặt cạnh ngưỡng ở Cổng Giá trị — nhưng không
chỗ nào đòi XÂY thứ sinh ra con số. Người ký Cổng Giá trị ngồi trước bảng toàn «CHƯA ĐO»,
hợp lệ theo mọi luật, và `release/iterate/kill` rơi về cảm giác.

## Lời giải — chép khuôn CT-S (Coverage), bốn chân, +0 nghi thức

**Từ mới (vào CONTEXT.md):** *đường đo* = thứ trong sản phẩm sinh ra con số cho một thước
đã khai (event, counter, truy vấn, bảng đếm). Khác *thước* (đo gì), *ngưỡng* (bao nhiêu là
sống), *số đo* (con số thật).

1. **Ô cấu trúc trong contract** — `contract-template.md` thêm section `## Đường đo` trong
   khối marker `CONTRACT-DUONG-DO-TEMPLATE` (heading là nguồn duy nhất; gate-card ghim hằng
   cùng chuỗi, test round-trip): mỗi thước một dòng *thước · số từ đâu · bảo đảm bởi AC-n
   (hoặc «đã có sẵn: nguồn»)*. Section CHỈ có nghĩa khi hồ sơ có `opportunity.md` với
   ngưỡng đã khai (cùng vị từ `ut` mà thẻ đang dùng để in khối «Ngưỡng nghiệm thu»).
2. **Cửa bỏ có tên** — entry `descope` với decision bắt đầu đúng chuỗi `"bỏ đường-đo — "`
   (khuôn `bỏ gap-probe —`, `bỏ coverage-scan —`); SKILL.md S1#4 nêu auto-draft + impact
   «Cổng Giá trị sẽ đọc bảng ngưỡng với ô CHƯA ĐO».
3. **Thẻ Cổng 1** — `gate-card.js`: khối «Đường đo» cạnh «Độ phủ AC» khi có dòng; **cờ vàng**
   khi hồ sơ có ngưỡng mà contract vắng section / chỉ có placeholder, và không có entry bỏ;
   **cờ info** khi đã bỏ có tên; **không cờ, không khối** khi vòng không có cơ hội hoặc ngưỡng
   chưa khai (R0 — luật không rò sang vòng B/C/E). `--extract` thêm
   `duong_do: {applicable, present, lines, descoped}`.
4. **Một dòng cross-check gap-probe** — SKILL.md S1#7 ý (4) thêm «ngưỡng nào ở
   `opportunity.md` không có đường đo nào trong contract»; `opportunity.md` vào input của
   critic khi file tồn tại.

**Không làm:** không parse từng thước trong văn xuôi ngưỡng (chỉ xét có/không section + có
dòng thật) · không chặn Gate 1 · không đụng uat-session · không thêm chân lưới · không đòi công
cụ đo.

## Phép đo — `tests/plugins/duong-do.test.mjs` (DD1–DD7, chốt `PASS: [DDn]`)

Fixture CODE-SINH: contract từ `CONTRACT-FRONTMATTER-TEMPLATE` + khối `CONTRACT-DUONG-DO-TEMPLATE`
rút từ chính khuôn (placeholder `{{…}}` thay bằng giá trị thật), opportunity từ
`OPP-FRONTMATTER-TEMPLATE` + section Ngưỡng rút từ khuôn (điền); chạy `gate-card.js` THẬT
(`--extract` + HTML). Ma trận viết trước: R+ (có ngưỡng + section thật → không cờ, có khối) ·
R− (gỡ section / chỉ placeholder → cờ vàng ghim thông điệp) · R0 (không opportunity; hoặc ngưỡng
còn `…` → không cờ, `applicable:false`, kể cả khi contract có section) · RK (entry bỏ đúng tiền tố →
info, sai tiền tố → vẫn vàng). Round-trip heading khuôn ↔ hằng gate-card (đổi heading trong bản sao
khuôn → đỏ nêu hai chuỗi). SKILL/CONTEXT đo bằng quan hệ + mutant gỡ câu.

## Ngoài phạm vi

Eval hành vi (máy có viết section ở S1 không) — cố ý không mở (seed §4) · nghi thức retro
ngưỡng (L3) · đường đo cho thước North Star của kit (L4) · roadmap ngưỡng.
