# Design — inputs của hội đồng tính từ gốc kho (inputs-tinh-tu-goc-kho)

Nguồn: lỗi đo được 2026-09-05 trên repo tiêu thụ crm, hồ sơ
`cai-dat-con-lai-noi-tieng-viet` (E19, judgment). Hồ sơ đợt một
`man-cai-dat-noi-tieng-viet` (E12) cùng hình dạng. Owner gọi tên việc này
trong phiên crm và chuyển sang kho kit theo nếp «lỗi kit đi chip riêng».

## Vấn đề (một câu)

`s4-args.mjs` giải `inputs` của eval judgment theo thư mục hồ sơ
`_acceptance/<slug>/`, trong khi skill acceptance sinh evals viết chúng theo
gốc kho — cùng gốc với `paths` và mọi đường dẫn khác trong evals.yaml. Args
sinh xong, exit 0, mà sáu input trỏ vào file không tồn tại; hội đồng ba lăng
kính đọc file rỗng và vẫn phán.

Đây là lớp «hai bên của một artifact trôi khỏi nhau»: bên VIẾT (skill) và bên
ĐỌC (script) mỗi bên tự chắc một gốc, và không phép đo nào đứng giữa. Nặng hơn
lỗi thường vì nó im: không exit code, không dòng báo, chỉ một hội đồng phán
trên hư không.

## Lời giải: MỘT gốc, và vắng thì kêu to

Hai quyết định, mỗi quyết định loại một phương án khả dĩ:

1. **Gốc = gốc kho (hoặc đường tuyệt đối).** Loại phương án «gốc hồ sơ» vì mọi
   đường dẫn khác trong evals.yaml đã theo gốc kho và skill đã viết theo đó
   từ lâu — đổi bên viết là sửa nhiều chỗ hơn và trái trực giác người đọc
   `paths`. Loại phương án «hai gốc, thử gốc kho rồi rơi về hồ sơ» vì hai gốc
   chính là bệnh: một tên file có thể tồn tại ở cả hai chỗ và máy chọn lặng.
2. **Input vắng trên đĩa → exit 2, nêu eval + file, KHÔNG sinh tệp.** Đúng nếp
   fail-closed của mọi trường khác trong cùng script. Khi file lại có ở đường
   cũ theo hồ sơ, thông điệp in luôn dạng viết lại đúng — máy suy được thì
   máy điền, người chỉ chép.

Hàm `resolveJudgmentInput(e, p)` trong `s4-args.mjs` là toàn bộ thay đổi mã:
ba nhánh phân biệt được — `isAbsolute` · tồn tại ở gốc kho · tồn tại ở đường
cũ (chỉ để gợi ý). Lời chú P3 trong script sửa theo (file vắng nay chết sớm
hơn, chỉ còn «có mà không đọc được» đi đường hash mới).

## Bên viết khớp theo

- `skills/acceptance/references/eval-executors.md`: mẫu evals dùng
  `_acceptance/login-flow/contract.md`; thêm đoạn «một gốc» cạnh ghi chú
  `config:`.
- `skills/acceptance/SKILL.md`: mục 3b ở EVAL-GEN + một vế ở VERIFY.
- `feature-loop/skills/feature-loop/SKILL.md`: câu mô tả bước chuẩn bị args.

## Kế hoạch đo

- **Lưới thường trực** `tests/scripts/s4-args-judgment-inputs.test.mjs` (đã
  viết đỏ trước, 9/13 đỏ trên mã cũ): bốn nhóm JI1–JI4, mỗi ca âm có đối
  chứng dương trên cùng fixture, fixture do code sinh, đường dẫn suy từ vị trí
  file. ADR 0011: thứ phải đúng sau merge sống ở đây, không ở răng hồ sơ.
- **Răng hồ sơ** `_acceptance/inputs-tinh-tu-goc-kho/rang.sh`: mỗi chân chạy
  MỘT nhóm của lưới trên cây thật (đối chứng dương) rồi trên BẢN SAO trọn cây
  đã tiêm đột biến (chiều đỏ). Chiều đỏ phải đủ HAI vế: exit ≠ 0 VÀ dòng FAIL
  có tên ca — không được rơi xuống một vế. Sau khi tiêm, chân assert mũi tiêm
  trúng (`cmp` bản sao khác bản thật) và mutant chạy được (`node --check`).
  Mỗi đột biến là MỘT phép thay thế nguyên văn trong `s4-args.mjs`:

  | Tên | Dòng trước (nguyên văn) | Dòng sau | Chân dùng |
  |---|---|---|---|
  | `goc-cu` | `const abs = path.isAbsolute(p) ? p : path.resolve(root, p);` | `const abs = path.isAbsolute(p) ? p : path.resolve(ws, p);` | E1, E3 |
  | `fail-open` | `if (st && st.isFile()) return abs;` | `return abs;` | E2, E4 |
  | `goi-y-sai` | `viết lại thành «${path.relative(root, legacy)}»` | `viết lại thành «${legacy}»` | E3 |
  | `thu-muc-lot` | `if (st && st.isFile()) return abs;` | `if (st) return abs;` | E9 |
  | `bo-mien-tru` | `if (!path.isAbsolute(p) && norm.startsWith(EVIDENCE_PREFIX)) {` | `if (false) {` | E8 |
  | `mien-tru-rong` | `if (!path.isAbsolute(p) && norm.startsWith(EVIDENCE_PREFIX)) {` | `if (!path.isAbsolute(p) && norm.includes('/evidence/')) {` | E8 |

  Đối chứng dương của AC-3 là ROUND-TRIP: rút chuỗi giữa «…» từ stderr thật
  rồi viết lại evals.yaml bằng đúng chuỗi đó, không gõ tay.
- **Không đổi bên đọc (AC-6)**: đo bằng `git diff` so mốc gộp — file
  `acceptance-verify.js` diff rỗng và tập file mã đổi bằng đúng
  {`s4-args.mjs`}; chiều đỏ trên clone tạm có commit chạm file đó.
- **Tài liệu không còn đường cũ (AC-5)**: hội đồng phán nội dung (E5, inputs
  khai theo gốc kho — chính hồ sơ này dogfood luật mới) + chân grep âm tính
  trong khối `inputs:` của ba file, đối chứng dương tiêm một dòng
  `- contract.md` vào bản sao (E7).

## Mở lại sau Cổng Bằng chứng vòng 2 (owner quyết 2026-09-05)

Review vòng 2 chỉ ra fail-closed chặn nhầm một mẫu có sẵn: hội đồng chấm ảnh
do ui-check chụp trong CÙNG vòng — ảnh chưa tồn tại lúc sinh args nên script
chết ở bước đó, mẫu trong `eval-executors.md` (E4 đọc `evidence/E3-step3.png`)
không còn đi được. Owner chọn nâng phạm vi: **AC-7** — đường tương đối có tiền
tố `_acceptance/<slug>/evidence/` của CHÍNH hồ sơ đang chấm được phép chưa tồn
tại: vẫn giải thành đường tuyệt đối, một dòng khai trên stderr, vắng lúc chấm
thì hội đồng trả UNCERTAIN theo luật sẵn có. Hồ sơ khác vắng vẫn chết như AC-2.
Cùng lượt, **AC-8** — đường tồn tại nhưng là thư mục → exit 2 «là thư mục,
không phải file» (`statSync(...).isFile()` thay `existsSync`).

## Nợ khai trước

Hồ sơ đã ký dùng đường cũ (`../../x`, `contract.md`): khoảng 13 hồ sơ trong
kho kit, vài hồ sơ trong crm. Chạy lại S4 sẽ bị chặn CÓ TÊN kèm gợi ý viết
lại. Không di trú trong vòng này — sửa lúc ghim lại theo mốc phát hành.
