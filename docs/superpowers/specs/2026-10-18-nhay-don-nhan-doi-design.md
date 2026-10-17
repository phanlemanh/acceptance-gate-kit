# Nháy đơn nhân đôi được gỡ ở bộ bóc nháy dùng chung — design

Ngày: 2026-10-18 · Hồ sơ: `_acceptance/nhay-don-nhan-doi/` · Hạng T3 (`lib/evidence-core.cjs` ∈ `risk_tiers.t3_paths`)

## Vấn đề

Làn ghim lại ban đêm của crm (lượt C-2, 17/10, `repin-20261017T174133Z-76354`, onehub `30d982d22`, kit
v2.32.0) ghi tac-nhan-va đỏ `E9=2`. Dòng config gây đỏ là YAML hợp lệ:

```yaml
tnv_khu_hoi: 'mkdir -p … && bash -c ''export TNV_LUONG_DIR="$PWD/…"; …'''
```

YAML 1.2.2 §7.3.2: trong scalar nháy đơn, `''` là MỘT dấu nháy literal. Ý người viết là
`bash -c 'export TNV_LUONG_DIR=…; …'`. `unquoteScalar` (`lib/evidence-core.cjs`) bóc vỏ nhưng KHÔNG gỡ `''`,
nên shell nhận `bash -c ''export TNV_LUONG_DIR=…'` — tách thành `bash -c export`, biến không bao giờ được đặt,
`tac-tu-gia.ts` ném `thieu TNV_LUONG_DIR`, `mkdir: : No such file or directory`, eval thoát 2.

Chính chú thích của `unquoteScalar` đã khai đúng lỗ này là giới hạn: «nháy đơn nhân đôi KHÔNG được un-double
— chưa có ca thật nào trong 8 kho đo được». crm là ca thật đầu tiên. Kit cũng đã vấp nó một lần trong nhà:
`tests/scripts/gia-lan-fixture.mjs` chú thích «đo 06/10: `trap` không bao giờ chạy» và né bằng nháy kép.

## Nghiệm — một chỗ, đúng tầng

`unquoteScalar` là cổng DUY NHẤT bóc nháy cho mọi giá trị sẽ thi hành (khuôn «một cổng» của hồ sơ
release-2-11-0). Nhánh nháy đơn đã chỉ nhận thân hợp lệ `^'(?:[^']|'')*'$`, nên thân chỉ gồm ký tự không-nháy
và các cặp `''` — gỡ `''` → `'` từ trái sang phải là đúng và đủ:

```js
if (/^'(?:[^']|'')*'$/.test(s)) return s.slice(1, -1).replace(/''/g, "'");
```

Mọi bên tiêu thụ đi qua cổng đó tự đúng theo: `resolveConfigKey` (repin-lane:255, s4-args:213, suite_keys,
start-scan, dinh-tuyen-may, duong-nen, lan-khoa), `resolveConfigList` (inline và khối), `parseFlowValue`
(carry-plan id/cmd, evalListsOf), `giaTriTruong` và các bộ đọc frontmatter trong lib. Không chạm nhánh nháy kép
(escape của nó giữ nguyên luật hiện có), không chạm chuỗi trần, không chạm nháy đơn không cân (vẫn trả nguyên
văn — fail-closed như thiết kế cũ).

## Các bộ đọc khác trong `lib/` — đã rà

| Chỗ | Kết luận |
|---|---|
| `evidence-core.cjs` `unquoteScalar` | lỗi — vá ở đây |
| `evidence-core.cjs` `stripYamlComment` / `closingQuoteIndex` / `splitTopLevel` / `closingBracketIndex` (chạy TRƯỚC `unquoteScalar`) | đã hiểu `''` là nháy literal (nhánh `if (s[i + 1] === "'")` ở cả bốn hàm); đo trên mã hiện tại: `'it''s'  # ghi chu` → `it''s`, `'a '' # b'` → `a '' # b` — chú thích cắt đúng, chỉ thiếu bước gỡ `''`. Không cần chỗ sửa thứ hai |
| `evidence-core.cjs:522` chuẩn hoá `executor` bằng `replace(/^['"]\|['"]$/g,'')` | giá trị là enum (test/script/ui-check/judgment) — không có `''` hợp lệ; không lỗi thực tế |
| `evidence-core.cjs` `tenGitThat` | giải tên tệp git in trong ngoặc kép, không phải YAML |
| `eval-yaml.cjs` `expectedExits` bóc nháy thô | giá trị là số nguyên — không ảnh hưởng |
| `eval-yaml.cjs` `parseEvals` mặc định chỉ `trim` | không bóc nháy CHÚT NÀO — lớp khác, xem Ngoài phạm vi |

## Bán kính trên các kho (luật «cân trên mọi kho»)

Đo 18/10, hai lượt. (1) 16 `config.yaml` ở `~/dev/*/_acceptance/`: chỉ crm có scalar nháy đơn chứa `''` — đúng hai khoá
`executors.script.tnv_man` (dòng 2938) và `tnv_khu_hoi` (dòng 2939), cả hai chỉ dùng bởi hồ sơ tac-nhan-va. Hai
lệnh đó hôm nay chạy SAI; sau bản vá chạy đúng ý người viết. Không kho nào dựa vào hành vi cũ. `expected:` nháy
đơn có `''` ở crm `dieu-phoi-va-bien` đi qua `parseEvals` (không bóc nháy) — không đổi. (2) Mở rộng sang MỌI
`*.md`/`*.yaml` dưới `_acceptance/**` của 16 kho (frontmatter, evals, sổ): mọi khoá mang scalar nháy đơn có `''` =
20 trường `expected:` (crm) + 2 khoá config trên. `expected` không đi qua `unquoteScalar` (bộ đọc đi qua cổng chỉ
đọc `superseded_by`, `status`, id eval, `run_id`, và các trường danh sách `inputs`/`paths`/`evidence_required`/
`steps`) → không đổi. Lệnh đo: `grep -rhoE "^[[:space:]]*(-[[:space:]]+)?[A-Za-z_][A-Za-z0-9_-]*:[[:space:]]*'([^']|'')*''" */_acceptance --include='*.md' --include='*.yaml'`.

## Phép đo

Chân mới BG10 trong `tests/scripts/bo-giai-nhay.test.mjs` (bộ răng sẵn có của bộ bóc nháy):

- Hằng mong đợi lấy từ PyYAML 6.0.3 (`yaml.safe_load`) chạy ở lúc thiết kế, ghi cứng vào tệp ca — nguồn đối
  chiếu ngoài, không phải người vá tự viết. Ma trận viết trước, số khẳng định khai hằng.
- Khứ hồi qua bên VIẾT thật: s4-args sinh tệp args; làn ghim lại chạy lệnh. Lệnh mang đúng hình dạng crm
  (`bash -c ''export X=…; ghi dấu vết vào "$X/…"'''`); khẳng định là DẤU VẾT trên đĩa (lệnh trong thật sự chạy
  với biến đã đặt), không phải chuỗi có mặt.
- Chiều đỏ: thêm một hàng vào bảng `DUONG` (hoàn nguyên nhánh nháy đơn về `return s.slice(1, -1);`) — BG8 đòi
  BG10 đỏ ghim tên; BG5 đòi BG10 trong `CHAN_DO`. Và trong LỊCH SỬ: commit ca đứng trước commit vá, ca đỏ ở sha
  của nó.
- Fixture làn ghim lại: `gia-lan-fixture.mjs` nhận thêm `e.yaml` = scalar YAML thô ghi vào khoá
  `executors.script.<e.cmd>` của `config.yaml` (eval vẫn `cmd: config:executors.script.<e.cmd>` — đúng đường
  repin-lane:255 gây sự cố) — thêm, không đổi đầu ra khi vắng. Đi cùng commit ca (không ở commit vá), để ở sha lịch
  sử hạ tầng ca đã chạy được.
- Mỗi chân khứ hồi chạy ĐỐI CHỨNG nháy kép trước, cùng đường; hỏng thì thông điệp hạ tầng riêng, khác thông điệp
  vật — chiều đỏ trong lịch sử phân biệt được «đỏ vì vật» với «đỏ vì ca chưa chạy được».
- AC-5 đọc bản ghi làn (`run-log.jsonl`, dòng `kind: repin`, `evals_exit`) theo trường — đó là thứ crm đọc lại.

## Ngoài phạm vi (ghi lại, không làm)

- `parseEvals` không bóc nháy `cmd:` viết thẳng trong `evals.yaml`: `cmd: "config:…"` hay lệnh bọc nháy kép chạy
  nguyên văn kèm dấu nháy (thoát 127 — hỏng HIỆN, không xanh giả). Bán kính: 18 hồ sơ cũ ở artifact-platform. Lớp
  khác (không bóc chứ không bóc sai) → hạt giống.
- Bộ escape đầy đủ của nháy kép (`\n`, `\t`, `\x..`) — người giao việc dặn giữ luật hiện có.
- `scripts/config-patch.mjs` `boNhay` (ngoài lib, chỉ để chống trùng mục khi `--append`).
- Scalar nháy đơn nhiều dòng (folding) — bộ đọc theo dòng có chủ đích.
