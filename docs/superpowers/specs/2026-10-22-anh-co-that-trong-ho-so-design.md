# Ảnh có thật trong hồ sơ — thẻ Cổng Bằng chứng và trang bằng chứng chỉ tính ảnh có tệp

Hồ sơ: `_acceptance/anh-co-that-trong-ho-so/` · hạt giống: `docs/plans/2026-10-22-hat-giong-the-tin-chuoi-anh-khong-kiem-tep.md`
· gốc: `_acceptance/lop-bang-chung-nhin-thay/` (AC-4, ca LNT4(b)).

## Vấn đề

Người ký Cổng Bằng chứng đọc trên thẻ «Bằng chứng lớp nhìn-thấy: n eval ui-check đạt — xem frame ở trang bằng chứng»,
mở trang bằng chứng và không thấy ảnh. Thẻ tính một eval ui-check là «đạt» khi khối của nó có `exit_code: 0` và trường
`screenshot:` khác rỗng (`scripts/gate-card.js:1073`) — không bước nào kiểm tệp ở đường ấy. Trang bằng chứng
(`scripts/evidence-page.js:117`, `safeShot`) lọc đường theo hình dạng rồi in `<img>` dù tệp không có, nên ảnh vỡ; đường
bị lọc bỏ thì trang in «ui-check có thể đã downgrade sang judgment» — một lý do sai.

Số đo ở một kho tiêu thụ 22/10 (ẩn danh, chi tiết ở hạt giống): 26/293 trường `screenshot:` trỏ ra thư mục lượt chấm
hoặc đường tuyệt đối trên máy khác, 9 mang tên không khớp tệp nào; 2 hồ sơ đã ký được thẻ tính «có ảnh» mà hồ sơ không
chứa ảnh nào. Hai hồ sơ ấy là ca gốc của hạt giống; vòng mở vì chủ kho báo 22/10 (qua phiên giám sát đợt) rằng lỗi gặp thêm ở máy
M5 — ngưỡng «≥ 1 lần nữa» của hạt giống. Tên ca M5 thuộc một kho riêng tư nên không chép vào kho công khai.

Hai hình dạng thật, dựng lại trong ca đo (ẩn danh):

- **Ca A — báo cáo trỏ đúng khuôn mà hồ sơ không có ảnh.** Hai eval ui-check `exit_code: 0`, `screenshot:
  evidence/E10-step1.png` và `evidence/E11-step1.png`, `observed:` nói đã đọc 8 ảnh; hồ sơ không có thư mục `evidence/`.
- **Ca B — ảnh nằm ở thư mục lượt chấm.** Eval ui-check mang `carried_from_round`, `screenshot:
  .acceptance-runs/<slug>/evidence/<tên>.png`; tệp có thật ở đó nhưng không ở hồ sơ. Trang in «downgrade sang judgment».
  Cùng lớp: đường tuyệt đối vào worktree của máy chấm (tệp có thể có thật trên máy ấy, không có trong hồ sơ được giao).

## Lựa chọn

**Một luật, một chỗ: `scripts/anh-ho-so.cjs`.** Hàm thuần-đọc-đĩa `xetAnh(dir, giaTri)` xét MỘT giá trị
`screenshot:` → `{ ok: true, rel: 'evidence/<tên>' }` hoặc `{ ok: false, gia_tri, ly_do }`; `khungAnh(dir, id, giaTri)`
trả `{ frames, thieu }` — `frames` là ảnh có thật (giá trị hợp lệ + mọi `evidence/<id>[-_.]*.<đuôi ảnh>` của hồ sơ),
`thieu` là các giá trị bị loại kèm lý do. Thẻ và trang cùng gọi `khungAnh`, nên «thẻ tính có ảnh» và «trang hiện ảnh»
không thể lệch nhau. Đặt ở `scripts/` (cạnh `ho-so-tom-tat.cjs`, `luat-san-pham.cjs`) vì cả hai bên đọc đều ở `scripts/`
và không hook nào đọc nó.

Luật một ảnh được tính (theo thứ tự xét, lý do đầu tiên khớp thắng):

| Giá trị / tệp | Kết luận | Lý do in |
|---|---|---|
| đường tuyệt đối (`/…`, `~/…`, `C:\…`, `\\máy\…`) — xét bằng mẫu, không bằng `path.isAbsolute` của máy đang chạy | thiếu | `đường tuyệt đối` |
| mở đầu `.acceptance-runs/` | thiếu | `thư mục lượt chấm (.acceptance-runs/)` |
| URL, `..`, thư mục khác, thư mục con của `evidence/` | thiếu | `ngoài evidence/ của hồ sơ` |
| đuôi không phải png/jpg/jpeg/gif/webp | thiếu | `không phải tệp ảnh` |
| tệp không có, hoặc là thư mục | thiếu | `tệp không có trong evidence/ của hồ sơ` |
| tệp 0 byte | thiếu | `tệp rỗng` |
| liên kết mềm trỏ ra ngoài `evidence/` của hồ sơ | thiếu | `ngoài evidence/ của hồ sơ` |
| `evidence/<tên>`, `./evidence/<tên>`, `<tên>` trần — tệp thường > 0 byte | đạt | — |

Chú thích cuối dòng (` # …`, khuôn `UI-CHECK-BLOCK-TEMPLATE` có một chú thích như vậy) và nháy bao được bỏ trước khi xét.

**Vì sao ảnh có thật ở thư mục lượt chấm hay worktree của máy chấm vẫn là «thiếu», không phải «đạt kèm cờ vàng».** Thẻ nói «xem
frame ở trang bằng chứng»; trang đọc ảnh theo đường tương đối của hồ sơ, và `.acceptance-runs/` nằm trong `.gitignore` —
người đọc PR hay máy khác không bao giờ mở được ảnh ấy. «Đạt kèm cờ» giữ đúng lời khai sai mà vòng này gỡ. Đổi này chỉ đổi
DÒNG CỜ lớp nhìn-thấy trên thẻ; nó không đổi `approvable` hay verdict. Giá người ký thấy: số hồ sơ đổi cờ trên một kho
tiêu thụ thật, do lệnh đo kho (AC-9) in ra trong báo cáo bằng chứng.
Tên trần giữ đường đọc-cũ của `safeShot` (nó đã chuẩn hoá tên trần về `evidence/`).

**Thẻ.** Eval ui-check «đạt» = `exit_code: 0` VÀ trường `screenshot:` khác rỗng VÀ `khungAnh` có ≥1 ảnh. Luật này chặt hơn
luật cũ (thêm một điều kiện), không nới: eval không khai `screenshot:` vẫn không đạt dù `evidence/` có ảnh theo id. Eval
`exit_code: 0` có `screenshot:` mà 0 ảnh → vào danh sách thiếu: khoá `thieu_anh: [{id, gia_tri, ly_do}]` trên
`ui_observed` của `--extract` — khoá VẮNG khi danh sách rỗng (đọc-cũ: bên đọc so cả đối tượng vẫn khớp). HTML:
- 0 eval đạt → cờ «Bằng chứng lớp nhìn-thấy: KHÔNG có» (chuỗi ghim cũ) nay nêu từng id thiếu kèm giá trị và lý do,
  thay cho câu «khai nhưng không đạt» khi nguyên nhân là ảnh;
- ≥1 đạt mà có id thiếu → dòng «đạt» cũ GIỮ NGUYÊN chuỗi và chỉ nêu id đạt, thêm một cờ vàng «Bằng chứng lớp nhìn-thấy:
  THIẾU ảnh — …» nêu id thiếu.

**Trang.** Mỗi eval chỉ in `<img>` cho `frames` của `khungAnh`; mỗi mục `thieu` in một cờ đỏ «Thiếu ảnh: `<giá trị>` —
<lý do>; thẻ không tính eval này là có ảnh.» Câu «downgrade sang judgment» chỉ còn khi eval ui-check không khai
`screenshot:` và hồ sơ không có ảnh nào theo id.

## Không làm (vòng này)

- Bên VIẾT: tác tử chấm ui-check ghi ảnh vào thư mục lượt chấm rồi không chép về hồ sơ, hay phiên viết lại báo cáo. Vòng
  này làm bên đọc nói thật; bên viết là việc riêng (hạt giống, chưa đo nguồn).
- Hook (`hooks/acceptance-evidence-gate.js`, `lib/evidence-core.cjs`) KHÔNG đổi: chặn ký vì thiếu ảnh là đổi luật cổng
  cho mọi kho (T3, khó đảo hơn) — thẻ và trang nói thật là đủ cho quyết định của người ký.
- Không kiểm nội dung ảnh (định dạng thật, điểm ảnh) — `observed:` và hook L2 lo vế «đã nhìn».
- Không sửa hồ sơ đã ký ở kho nào: thẻ của chúng sẽ nói thật khi vẽ lại.

## Cân trên mọi kho (luật 26/09)

Kho không có sự cố (ảnh đúng chỗ): thẻ và trang không đổi một chữ — ca LNT8 đo đúng điều này trên hồ sơ có ảnh thật, và
lệnh đo kho thật (`tests/scripts/anh-co-that-kho.mjs`, không vào suite) đếm số hồ sơ đổi kết luận trên một kho tiêu thụ
có mặt trên máy, chỉ in số. Kho có sự cố: thẻ hạ từ «có ảnh» xuống «KHÔNG có»/«THIẾU ảnh» — đó là điều sửa. Ai đang dựa
vào hành vi cũ: chỉ ca LNT4(b) của kit (nó ghim đúng chỗ hở), sửa trong vòng này để ghi tệp ảnh thật.

## Coverage (quét hình thái, preset test-matrix)

Trục: (A) giá trị `screenshot:` — tương đối trong hồ sơ · tên trần · tuyệt đối · thư mục lượt chấm · ra ngoài (`..`,
URL, thư mục khác) · đuôi lạ · vắng [thước CE: hai ca thật + 26+9 đường hỏng đã đo, hạt giống] · (B) tệp — có > 0 byte ·
không có · rỗng · thư mục · liên kết mềm ra ngoài · cả thư mục `evidence/` vắng [thước CE: `fs.statSync`/`realpath`
của Node] · (C) tập eval ui-check — 1 đạt · 1 thiếu · trộn · exit ≠ 0 · (D) mặt đọc — thẻ `--extract` · thẻ HTML · trang.
Chân ngành: [NGÀNH: Playwright HTML reporter] chép tệp đính kèm vào thư mục báo cáo để báo cáo tự đứng được — đường
ngoài thư mục báo cáo không phải bằng chứng của báo cáo.
Core (ca đo): A×B theo bảng luật (một hàng mỗi lý do + ba hàng đạt) · C trộn · D cả ba mặt trên cùng fixture · hai ca thật.
Later: thư mục con trong `evidence/` (trang vốn đã từ chối, giữ nguyên). Never: kiểm điểm ảnh; tự chép ảnh về hồ sơ.
