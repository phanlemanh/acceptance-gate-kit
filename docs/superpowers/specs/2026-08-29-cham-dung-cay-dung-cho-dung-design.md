# Design — chấm đúng cây, đúng chỗ đứng (cham-dung-cay-dung-cho-dung)

Nguồn: `_acceptance/cham-dung-cay-dung-cho-dung/opportunity.md` (Cổng Đáng build
29/08) + hồ sơ điều tra `docs/findings/2026-08-29-dieu-tra-luat-hoi-tu.md`.

## Vấn đề (một câu)

Tầng chấm S4 chạy trên văn xuôi và trạng thái ngầm — args soạn tay theo 14 gạch
đầu dòng, cwd được *kể* cho agent thay vì *đặt*, agent chết không để lại vết —
nên lỗi hạ tầng chấm giả dạng tín hiệu sản phẩm và đốt vòng.

## Quét hình thái (CT-S)

- Trục A — giả định được ghim: chỗ-đứng (cwd) | vật-vào (args/ref) | vắng-mặt
  (agent chết) | trí-nhớ-carry (P1/P2/P3) | ngăn-phân-loại (không-sửa).
  [thước CE: 5 lớp nguyên nhân đo được ở findings 29/08 §1, §3]
- Trục B — tầng vật: script sinh-args (mới) | workflow `acceptance-verify.js` |
  dòng run-log + bộ đọc. [thước CE: hợp đồng args `acceptance-verify.js:13-48`]
- Trục C — chiều bằng chứng: dương (vật lành → xanh) | đỏ (phá vật → đỏ ghim
  thông điệp). [thước CE: `MEASURE-BIRTH-CLAUSE` trong feature-loop SKILL.md]
- Chân ngành: [NGÀNH: JUnit/xUnit] phân biệt ERROR (hạ tầng) ↔ FAILURE
  (assertion) — nguồn của nhãn «CHƯA-CHẤM-ĐƯỢC»; [NGÀNH: pytest] mã thoát
  collection-error ≠ test-fail; [NGÀNH: Bazel] hermeticity — khai input, ghim
  chỗ đứng. Nấc hermetic đầy đủ nằm ở Later (nấc 2, chờ ngưỡng CHẾT kích).

## Bốn quyết định thiết kế

1. **Script sinh-args `feature-loop/scripts/s4-args.mjs`** (node, chạy ngoài
   workflow — workflow không có filesystem, ràng buộc thật). Vào: `--slug
   --root` (+ `--round`, `--carry-anchor <sha>` | `--no-carry`, `--ag-root`
   cho self-host, `--out`). Ra: MỘT tệp JSON đúng hợp đồng args của
   `acceptance-verify.js` — resolve `config:` ref (giữ `ref` gốc), suiteCommands
   từ `feature_loop.suite_keys`, inputs judgment → abs path, toolKillRule đọc
   nguyên văn, riskTier từ contract, diffBase = merge-base với nhánh chính,
   invokedAt/invokedSha, round đếm từ `## Iterations`, và TỰ tính carry
   (gọi `carry-plan.mjs` P1 khi có anchor; P2 evalsHash; P3 inputsHash) — bước
   carry không còn là bước tay có thể quên. Ref không resolve được → exit ≠ 0,
   ghim tên ref, KHÔNG sinh tệp (fail-closed). Tệp args mang lời khai phạm vi:
   `generated_at` + `generated_sha`; SKILL bắt sinh lại khi HEAD ≠
   `generated_sha`.
2. **Ghim chỗ đứng ở tầng LANE, không nướng vào chuỗi lệnh.** Đề bài gợi «ghim
   cwd vào mọi lệnh» — làm đúng nghĩa đen sẽ phá lane baseline: baseline chạy
   trong worktree (`cd "$WT"`), lệnh mang `cd <repoRoot>` cứng sẽ trốn khỏi
   worktree và biến mọi eval thành non-discriminating. Chỗ duy nhất biết agent
   phải đứng đâu là lúc dựng prompt cho từng lane trong `acceptance-verify.js`:
   lane verifier máy/UI wrap `cd ${args.repoRoot} && ${cmd}` (thay «Trong repo
   …, chạy đúng lệnh» — kể suông); lane baseline giữ `cd "$WT" &&` như đang
   đúng. Lệnh trong args giữ SẠCH.
3. **Vắng mặt là tín hiệu + dòng tổng kết vòng.** Trong `acceptance-verify.js`:
   agent eval không trả kết quả → một dòng run-log `kind: vang-mat` (evalId,
   round, lý do) và round KHÔNG được thành PASS sạch (xếp nhánh BLOCKED —
   tương đương ERROR của JUnit, không phải FAILURE). Cuối mỗi lượt: một dòng
   `kind: round-tally` `{round, verdict, expected, returned, blocked, sha}` —
   vật đo cho ngưỡng 5-vòng-kế của opportunity. Bộ đọc đi kèm bộ viết
   (round-trip, không fixture tay).
4. **Ngăn «không-sửa» vào schema proposal.** Enum scope-triage thêm
   `wont-fix`; thẻ Cổng 2 render nó thành lựa chọn thứ ba có tên; file cũ
   không có giá trị mới → đọc như cũ (đường đọc-cũ, không migrate).

SKILL.md S4 bước «Chuẩn bị args» đổi từ 14 gạch đầu dòng soạn-tay thành: gọi
`s4-args.mjs` → đọc tệp → invoke Workflow; script lỗi → DỪNG trình người,
KHÔNG rơi về soạn tay im lặng (soạn tay chính là lớp lỗi đang đóng).

## Tương thích

Không đổi schema args — mọi trường script sinh ra đều là trường hợp đồng hiện
hành; `acceptance-verify.js` chạy với args không-có-gì-mới phải giữ nguyên
hành vi 2.4.0. Repo tiêu thụ nhận thay đổi theo release kế, không phải giữa
vòng.

## Kiểm

Mỗi phép đo mới theo `MEASURE-BIRTH-CLAUSE` (cặp hai chiều cùng fixture, đỏ
ghim thông điệp). Răng hồ sơ `_acceptance/cham-dung-cay-dung-cho-dung/rang.sh`
theo nếp không-vào-suite-vĩnh-viễn; lưới thường trực là case mới trong
`tests/scripts/` (s4-args) và `tests/workflows/` (lane-pin, vang-mat,
round-tally, wont-fix, tương thích). Trước khi sửa SKILL S4: grep case đang
ghim chuỗi của đoạn đó, cập nhật case theo VẬT mới — không hạ thước.

## Ngoài phạm vi (chép từ opportunity)

Sổ phát hiện persist (hạt giống, phải supersede «VIEW không persist») · WIP
limit (hạt giống) · carry-forward đã có, không làm lại · nới điều kiện đóng
vòng (bác) · nấc 2 hermetic + nấc 3 bằng-chứng-gắn-(eval,cây) chỉ mở khi
ngưỡng CHẾT kích · không sửa media-library, không sửa cache plugin.
