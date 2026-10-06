# Eval thay bởi hồ sơ đã ký — lời khai nghỉ hưu có chứng

Hồ sơ: `_acceptance/eval-thay-boi-co-chung/` · T3 (chạm `lib/evidence-core.cjs`,
`scripts/recheck-evidence.cjs`, `scripts/pre-merge-check.sh`) · 06/10/2026.

## Vấn đề

Một lượt sản phẩm ở crm (`gop-y-dung-cho`, ký 03/10) gỡ hẳn cột góp ý OKR. 36 eval ĐÃ KÝ ở năm
hồ sơ cũ mất vật đo (25 eval máy, 11 ngoài làn máy); bản thiết kế của lượt mới nêu, cho từng
eval, AC nào của lượt mới đo lại điều tương đương. Kit có đúng một lối cho eval không chạy được
nữa — khai `status: not-run` — và luật hai vế (ADR 0016 · hồ sơ `lan-doc-status-not-run`) chặn
lối đó cho mọi eval mà báo cáo đã ký mang mã thoát. Luật đúng: «thêm một dòng khai» không được
thành đường né đo. Nhưng không có lối nào cho ca «eval nghỉ hưu vì một hồ sơ ĐÃ KÝ khác đã đo
lại», nên năm hồ sơ cũ không bao giờ ghim lại được, và crm vá bằng lưới riêng đọc bảng của
chính kho.

Lối «cho hồ sơ nghỉ» (2.17, `GUIDE.md` «Cho một hồ sơ nghỉ») không vừa: nó miễn TOÀN BỘ hồ sơ,
trong khi mỗi hồ sơ cũ còn nhiều eval sống phải ghim lại.

## Ý định (đỉnh cố định của vòng)

Một eval đã ký được thôi đo **chỉ khi** máy chứng được, ở cây đang kiểm, rằng một hồ sơ khác đã
qua Cổng Bằng chứng có chữ ký người, chính nó nêu tên eval cũ, và còn đang đo lại — có mã thoát
đã ký — đúng tiêu chí được trỏ. Chữ ký của hồ sơ thay là chữ
ký người cho việc thay — kit không đòi thêm chữ ký nào, và không thêm lượt gọi người nào.

Trọng số: chiều **chặn né đo** nặng hơn chiều **tiện cho crm**. Mọi điều kiện không chứng được
→ vẫn xung đột như hôm nay.

## Khuôn khai

Cạnh lời khai không-chạy, ô mang thêm một con trỏ `<slug hồ sơ thay>#<AC-n>`:

```yaml
  - id: E3
    criterion: AC-2
    executor: test
    cmd: config:executors.test.unit
    status: not-run
    superseded_by: gop-y-dung-cho#AC-7
```

- Tên trường theo nếp khoá tiếng Anh của `evals.yaml` (`status`, `expected_exit`, `paths`).
- Một con trỏ cho một ô. Con trỏ cấp **AC**, không cấp eval: bảng thật của crm nêu AC ở cả 36
  dòng, và AC là đơn vị người đã ký — hồ sơ thay đổi id eval mà không đổi AC thì con trỏ vẫn đúng.
- Không thêm giá trị trạng thái mới. Mọi bộ đọc hiện có (`isRepinMachineEval`, `staleByPaths`,
  `carry-plan`, `s4-args`, thẻ) đã coi ô `not-run` là không chạy; con trỏ chỉ đổi đúng MỘT phán
  quyết — luật hai vế.

Khuôn đặt trong khối marker `EVAL-THAY-BOI-TEMPLATE` ở GUIDE §7.1; ca đo rút khối đó ra, dựng
fixture từ nó, và chạy qua làn thật (round-trip tài liệu → bộ đọc).

## Luật chứng (một hàm, ba bên gọi)

`notRunConflicts(evalsText, reportText, { root, slug })` — với mỗi ô bị loại mà báo cáo đã ký có
mã thoát (tập `xungDot` hôm nay), nếu ô mang con trỏ thì kiểm theo thứ tự, gãy ở điều đầu tiên:

| # | Điều kiện | Lý do khi gãy (ghim trong thông điệp) |
|---|---|---|
| 0 | Bên gọi truyền được `root` và hai thư viện phụ nạp được | `khong-tra-duoc` — fail-closed như vế hai cũ |
| 1 | Con trỏ khớp `^<slug>#AC-<số>$` | `con-tro-hong` |
| 2 | Slug thay khác slug của chính hồ sơ | `tu-tro` |
| 3 | `<root>/_acceptance/<thay>/contract.md` tồn tại | `ho-so-thay-vang` |
| 4 | `status` của hồ sơ thay là `signed-off` — có chữ ký người | `ho-so-thay-chua-ky` |
| 5 | Hồ sơ thay không khép (`hoSoDaKhep` — nghỉ, hay thực tế đã đóng) | `ho-so-thay-da-khep` |
| 6 | Hồ sơ thay NHẬN việc thay: `contract.md` của nó, hoặc tệp `design_doc:` mà nó trỏ, chứa thẻ `<slug cũ>/<id eval cũ>` đứng riêng (không dính chữ/số/gạch hai bên) | `thay-khong-nhan` |
| 7 | AC được trỏ có trong tiêu chí của hợp đồng thay (`criteriaLines` của `lib/ac-line.cjs`) | `ac-thay-vang` |
| 8 | `evals.yaml` của hồ sơ thay có ≥ 1 eval mà `criterion` chứa ĐÚNG thẻ AC đó (so theo ranh giới — `AC-1` không khớp `AC-10`), không khai không-chạy, VÀ báo cáo đã ký của hồ sơ thay có khối `- eval:` cho nó mang mã 0 hoặc đúng mã mong đợi đã khai | `ac-thay-khong-con-eval` |

Qua đủ → ô vào tập mới `thayBoi: [{ id, thay, ac }]`, rời khỏi `xungDot`. Gãy → ô ở lại
`xungDot` và một mảng `lyDo` gọi tên `<id>: <lý do> (<con trỏ>)`.

Vì sao điều 6 (gap-probe P0, 06/10): các điều kiện khác chỉ chứng hồ sơ thay còn sống — một
con trỏ tới AC hợp lệ của một hồ sơ đã ký KHÔNG liên quan vẫn qua, tức đúng ngưỡng chết của ô.
Con trỏ được viết vào hồ sơ CŨ sau khi nó đã ký, nên người ký hồ sơ thay chưa thấy lời thay —
trừ khi chính hồ sơ thay nêu tên eval cũ. Tiền lệ IETF đặt «Obsoletes» ở bản THAY, được duyệt
cùng bản thay; điều 6 là cái bắt tay hai đầu: đầu cũ trỏ đi, đầu thay nhận về. Ca crm đã có sẵn
đầu thay: bảng trong design doc của `gop-y-dung-cho` nêu cả 36 thẻ `<hồ sơ>/<eval>`. Kit neo vào
thẻ `<slug>/<id>` (khuôn tên của chính kit), không vào marker `BANG-THAY-THE` của kho.

Vì sao điều 8 đọc báo cáo đã ký (gap-probe P1): chỉ đọc `evals.yaml` hiện tại thì thêm một eval
chưa từng chạy vào hồ sơ thay sau khi ký là đủ qua — phía thay phải có bằng chứng mã thoát như
phía cũ. Điều này cũng đóng ca vòng tròn: hai hồ sơ trỏ nhau thì AC đích chỉ còn eval không-chạy.

Vì sao điều 4 chỉ nhận `signed-off` (gap-probe P1): ý định của vòng nói chữ ký hồ sơ thay là chữ
ký NGƯỜI cho việc thay; hồ sơ máy đã thông (làn V) không có chữ ký nào. Cùng nếp với «cho một hồ
sơ nghỉ» — hồ sơ máy đã thông phải ký trước. Lối ra cho kho: ký hồ sơ thay (một lệnh) rồi ghim.

Đọc tệp: chỉ trong `<root>/_acceptance/`, `root` do bên gọi truyền (làn: `--root`; recheck: suy
từ vị trí `evidence-report.md`; pre-merge: suy từ vị trí `evals.yaml`). Không đọc cwd, không
hardcode gốc (bài học thứ tư của «thước gắn vào vật»). Hai thư viện cần thêm
(`lib/ac-line.cjs`, `lib/workspace-record.cjs`) đã nằm trong INIT-CI-COPY-LIST; nạp lười tại lúc
gọi (workspace-record nạp evidence-core lúc tải — nạp lười tránh vòng). Thiếu tệp → ô ở lại
`xungDot` với lý do `khong-tra-duoc`.

## Bên gọi

- `repin-lane.mjs` (dòng ~258 trên `main` `8215e63a`): truyền `{ root, slug }` với `root` = `--root` đã giải tuyệt đối (làn không bao giờ tự lấy cwd cho phép tra này). Ô `thayBoi` không làm làn dừng; ô ở lại
  `xungDot` vẫn dừng exit 2, thông điệp nối thêm lý do từng ô.
- `checkRepinEvals(entry, evalsText, slug, reportText, opts)`: tham số thứ năm tuỳ chọn chuyển
  thẳng xuống. `recheck-evidence.cjs` và `pre-merge-check.sh` truyền `root`. Bên gọi cũ bốn đối
  số → không có `root` → ô có con trỏ vẫn VIOLATION (hướng an toàn; kho chưa chép lib mới không
  được nới lặng).
- Bảng điểm chạm bộ máy (`AG-ENGINE-TABLE` trong `repin-lane.mjs`) thêm hàng cho mọi export mới
  làn gọi.

## Pin nói ra

Ô thay bởi vẫn là ô không chạy: id của nó vẫn vào `evals_not_run` (ba tập rời nhau giữ nguyên,
không thêm khoá JSON). Dòng `sha:` của mục Re-pin nối thêm MỘT hậu tố tuỳ chọn, do script nối, chỉ
khi có ô qua chứng — đặt NGAY SAU hậu tố «không chạy theo hồ sơ» (cùng nói về ô không chạy), trước
các hậu tố về ô ngoài làn máy và hai hậu tố của vòng `gia-lan-ghim-lai` (chập chờn · môi trường CI):

```
 · thay bởi hồ sơ đã ký: E3→gop-y-dung-cho#AC-7, E4→gop-y-dung-cho#AC-5
```

Hồ sơ không có ô nào như vậy → hậu tố vắng hẳn. Bên đọc sau này KHÔNG tin hậu tố: nó kiểm lại
chuỗi chứng sống từ `evals.yaml` ở mỗi lượt (hồ sơ thay sau này nghỉ hay bị gỡ thì xung đột quay
lại — đúng ý: lời hứa thay đã hết).

## Đồng bộ với nhánh chính (06/10)

Trước Cổng Phạm vi, nhánh vòng gộp `main` `8215e63a` (32 commit sau điểm rẽ `bf79fdb1`): vòng
`gia-lan-ghim-lai` (ký; phát hành ở mốc 2.23.0 cũng ngày 06/10, `892755ec` — vòng này vì thế vào mốc 2.24) sửa `repin-lane.mjs` (trần phút, chạy lại
lệnh đỏ, môi trường giống CI, dòng `repin-do`, khoá `tong_ket`) và khuôn REPIN-TEMPLATE. Không đụng
`lib/evidence-core.cjs` (băm giống hệt), không đụng luật hai vế; lời gọi `notRunConflicts` giữ
nguyên, chỉ dời dòng. Lối dừng exit 2 của luật hai vế vẫn đứng TRƯỚC lượt chạy suite đầu và không
ghi dòng `repin-do` nào (dòng đó chỉ cho mã 4 và mã tín hiệu). Không nhánh hay PR nào khác chạm
con trỏ thay thế. `loc-paths-dong-mac-dinh` mới qua Cổng Đáng — chưa có mã, cùng tệp lib nhưng
khác hàm.

## Cân trên mọi kho (luật 26/09)

- Kho không có sự cố này: không khai trường mới → `notRunConflicts` đi đúng nhánh cũ, không đọc
  thêm tệp nào; đầu ra lưới trước-merge và recheck giống từng byte (đo bằng vi phân trên bộ hồ sơ
  kit + fixture mã sinh có ô `not-run` xung đột không con trỏ).
- Hành vi cũ có ai dựa: thông điệp xung đột cũ giữ nguyên chữ khi ô không mang con trỏ.
- Thứ tự nghiệm: đây là nấc «bộ đọc khoan dung» — mặc định không đổi, chỉ ô tự khai con trỏ mới
  được xét, và chỉ được nới khi chứng đủ.
- Neo vào khuôn kit (trường trong `evals.yaml`, hàm của `lib/`), không vào từ vựng
  `BANG-THAY-THE` của crm.

## Ngoài phạm vi

- Sửa crm; khai con trỏ cho 25 eval của crm là việc của lượt nhận mốc.
- Con trỏ nhiều đích (một ô thay bởi nhiều AC) — một con trỏ đủ cho 36/36 dòng thật.
- Kiểm con trỏ trên eval ngoài làn máy (không bị luật hai vế chặn hôm nay).
- Thẻ Cổng và bản đồ sản phẩm hiển thị «thay bởi» — chỉ pin nói ra trong vòng này.
- Con trỏ trên ô không khai không-chạy: không đọc (ô vẫn chạy như thường, luật chạy không đổi).

## Kiểm (tóm — đủ ở `evals.yaml`)

Một tệp ca thường trực `tests/scripts/eval-thay-boi.test.mjs`, ca chọn bằng biến `ETB_CASES`;
mọi kho/hồ sơ do mã sinh trong thư mục tạm; mỗi ca có đối chứng dương trên cùng fixture và chiều
đỏ trên bản sao vật (ghim thông điệp, không chỉ mã thoát). TDD: commit ca đứng trước commit vật.
