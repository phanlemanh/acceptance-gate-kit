# Đường nền — chân công cụ thôi báo động giả cho lệnh dựng đường bằng cú pháp shell

Ngày 2026-09-19 · slug `nen-cong-cu-lenh-shell` · T2 · owner: manh@mstar.vn

## Vấn đề (đo được, không phải suy đoán)

Chân `cong_cu` của `feature-loop/scripts/duong-nen.mjs` lấy TỪ ĐẦU của mỗi lệnh
`executors.<loại>.<tên>` rồi hỏi máy bằng `command -v`. Hàm `tuDau()` tách token
chỉ theo khoảng trắng và nháy — nó không biết gì về phép thay thế của shell. Với
một executor dựng đường chạy bằng `${VAR:-$(lệnh con)}/đường/dẫn`, khoảng trắng
đầu tiên nằm BÊN TRONG `$( )`, nên token đầu bị cắt cụt thành
`${CLAUDE_PLUGIN_ROOT:-$(node` và `command -v` tất nhiên không tìm thấy.

Tái hiện trên fixture code-sinh của kho (`tests/scripts/duong-nen-fixture.mjs`),
19/09, bản `feature-loop` 2.16.0 — bản repo và bản plugin cache giống hệt nhau:

| Ca | Lệnh executor | Hôm nay | Đúng ra phải |
|---|---|---|---|
| A | `${KHONG_CO_BIEN:-$(echo /bin)}/echo chay-duoc` | `cong_cu: do`, bullet `THIEU ${KHONG_CO_BIEN:-$(echo` | IM |
| B | `khong-co-lenh-nay-xyz --x` | `cong_cu: do`, ghim đúng tên | giữ nguyên ĐỎ |
| C | `khong-co-lenh-nay-xyz --x \| head -n 1` | `cong_cu: do`, ghim đúng tên | giữ nguyên ĐỎ |

Triệu chứng ở kho tiêu thụ, đo ngày 19/09 trên `~/dev/crm` nhánh `onehub`:
ĐÚNG MỘT executor có từ đầu mở bằng `${` — `executors.design.ui_check`, dòng 425
của `_acceptance/config.yaml`:

```
ui_check: "${CLAUDE_PLUGIN_ROOT:-$(node scripts/resolve-plugin.mjs --plugin acceptance-gate --require scripts/design-gate.mjs --require scripts/design-scan.js)}/scripts/design-scan.js"
```

Một khoá ấy đủ làm `nen: do` thường trực → cờ vàng bật trên MỌI thẻ Cổng Phạm vi
của kho đó. Cờ vàng luôn bật vì lý do sai là cờ vàng người học cách bỏ qua — nó
phá đúng cái cổng mà kit dựng ra. Khoá chị em `executors.design.gate` KHÔNG đỏ vì
nó mở đầu bằng `node ` — đó là lý do chỉ một trong hai dòng kêu.

## Phạm vi lớp

Quét cả kho: `tuDau()` tồn tại ở đúng MỘT chỗ (`duong-nen.mjs:139`). Mọi lời gọi
`command -v` còn lại (`pre-merge-check.sh`, `run-tests.sh`) tra tên CỐ ĐỊNH
(`node`, `git`), không tách từ chuỗi cấu hình. Vá một chỗ là hết lớp.

## Lối đã chọn và lối đã bỏ

Owner đề nghị hai lối; lối (b) — khai triển thật qua shell rồi mới tra — BỎ:
khai triển `$( )` nghĩa là CHẠY lệnh con ngay trong bước dò, biến đường nền từ
một phép ĐO thành một lượt THI HÀNH, và mở đúng cửa mà đường nền sinh ra để
đóng (nền không được có tác dụng phụ lên cây).

Lối (a) — bỏ bước tra tên — có hai bản, và ca C ở trên là số phân biệt:

- **(a) thô:** thấy `$(`, `${`, `|`, `&&`, `;` ở BẤT KỲ đâu trong lệnh thì bỏ
  qua cả lệnh. Ca C hôm nay ĐỎ đúng; sau bản này nó IM. Đó là tắt một cái đèn
  đang sáng đúng — chính điều owner cấm.
- **(a) hẹp — CHỌN:** chỉ bỏ bước tra khi TOKEN ĐẦU không phải một tên chương
  trình, tức nó chứa ký tự thay-thế hoặc mở nhóm của shell: `$`, `` ` ``, `(`,
  `{`. Ca A im, ca B và ca C vẫn đỏ ghim tên. Lệnh có ống dẫn nhưng mở đầu bằng
  một tên thật (`bash -c '…' | grep …` — chính executor `plugins` của kit) vẫn
  được tra như cũ.

Bản chất: bug không nằm ở chỗ "lệnh có cú pháp shell" mà ở chỗ "token đầu không
phải tên chương trình". Luật vá phát biểu đúng cái đó.

## Cách làm

1. `duong-nen.mjs` — thêm vị từ `tenChuongTrinh(tu)` (`!/[$\`({]/.test(tu)`) bọc
   trong marker `CONG-CU-TU-DAU` để ca đột biến thay được. Vòng lặp chân công cụ:
   token đầu không phải tên chương trình → **không tra, không đỏ**, in một dòng
   lý do ra **stderr** kèm khoá. Không đổi trạng thái chân, không đổi khuôn dòng
   đỏ, không đổi mã thoát.
2. `skills/acceptance/references/duong-nen-template.md` — ô `cong_cu` của bảng
   «Bốn chân» nói ra luật mới, để lời và vật không trôi khỏi nhau.
3. `tests/scripts/duong-nen.test.mjs` — bốn ca mới trên CÙNG fixture lành của
   NEN0 (xem Coverage của contract).

## Vì sao im ra stderr, không phải một dòng đỏ mới

Khuôn `duong-nen.md` đã có sẵn quy ước: `bo-qua` không phải đỏ, và lý do bỏ qua
in ra stderr (chân `luoi`, chân `engine` dùng đúng nếp này). Chân công cụ đi
theo, nên không sinh mã dòng đỏ thứ chín và không đụng bên đọc (thẻ Cổng Phạm
vi). Đèn tắt vẫn có tiếng — người đọc stderr biết khoá nào không được tra.

## Giới hạn đã biết (khai, không giấu)

Executor mà token đầu dựng bằng thay thế shell thì chân công cụ KHÔNG còn chứng
gì về nó.

Phân biệt hai tập khoá, vì chúng khác nhau và lẫn lộn chúng là cách dễ nhất để
tin sai về phạm vi bản vá:

- **Chân `cong_cu` duyệt MỌI khoá `executors.<loại>.<tên>`** — `khoaExecutor()`
  quét theo thụt lề toàn mục `executors:`, không lọc theo `suite_keys`. Vì thế
  `executors.design.ui_check` của crm NẰM TRONG tầm chân này, và bản vá này tắt
  được đúng cờ vàng ấy.
- **Chân `suite` chỉ chạy lệnh thật cho khoá trong `feature_loop.suite_keys`.**
  Khoá ngoài danh sách ấy — `executors.design.ui_check` là một — không được chân
  nào CHẠY THẬT. Nên với riêng khoá ấy, sau bản vá đường nền không còn nói gì:
  không báo động giả, cũng không bảo chứng. Đó là trạng thái vốn có của đường
  nền, bản này không làm hẹp thêm và cũng không mở rộng.

## Bán kính đo được (chạy luật mới trên MỌI executor thật, 19/09)

| Kho | Khoá VẪN được tra | Khoá bỏ tra | Phán quyết đổi |
|---|---|---|---|
| kit (`_acceptance/config.yaml`) | 232 | 1 — `executors.script.gdk_lnt_do`, từ đầu `{` | **không** |
| `~/dev/crm` nhánh `onehub` | 401 | 1 — `executors.design.ui_check`, từ đầu `${CLAUDE_PLUGIN_ROOT:-$(node` | **có** — cờ vàng tắt |

Vì sao khoá của kit không đổi phán quyết: `command -v {` thoát **0** trong bash
(`{` là từ khoá của shell), nên hôm nay nó đã im; sau bản vá nó vẫn im, chỉ thêm
một dòng lý do trên stderr. Cùng lý do ấy giải thích ô Never của Coverage: `if`
và `for` cũng thoát 0. Ngược lại `(` thoát **1** — đó là ca `(cd … && …)` hôm nay
đỏ sai và AC-4 đóng lại.

Tức bản vá tắt **đúng một** cờ trên toàn bộ 633 khoá executor của hai kho, và
không khoá nào đang đỏ đúng bị làm im.
