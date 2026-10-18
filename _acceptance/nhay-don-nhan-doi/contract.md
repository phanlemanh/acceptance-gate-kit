---
schema_version: 1
feature: Lệnh trong config viết bằng nháy đơn có dấu nháy nhân đôi ('') tới shell đúng như người viết — làn ghim lại và lượt chấm S4 chạy đúng `bash -c '…'` thay vì một lệnh bị xẻ
slug: nhay-don-nhan-doi
owner: manh.phan@onemount.com
risk_tier: T3               # chạm lib/evidence-core.cjs — trong risk_tiers.t3_paths
surfaces: [cli]
status: signed-off
design_doc: docs/superpowers/specs/2026-10-18-nhay-don-nhan-doi-design.md
approved_by: Phan Le Manh
approved_at: 2026-10-18
---

# Acceptance Contract: nhay-don-nhan-doi

Gốc: crm/_acceptance/tac-nhan-va

## Context

Làn ghim lại ban đêm của crm (lượt C-2, 17/10/2026, `repin-20261017T174133Z-76354`, onehub `30d982d22`, kit
v2.32.0; luồng điều phối crm-onehub#375) ghi tac-nhan-va đỏ `E9=2`. Khoá `executors.script.tnv_khu_hoi` và
`tnv_man` viết `'… bash -c ''export TNV_LUONG_DIR="$PWD/…"; …'''` — YAML hợp lệ, nghĩa là `bash -c 'export …'`.
`unquoteScalar` bóc vỏ mà không gỡ `''` → `'`, nên shell chạy `bash -c export …`, biến không được đặt, eval thoát
2. Chú thích của chính hàm đã khai lỗ này là giới hạn «chưa có ca thật»; nay có.

Nghiệm một chỗ: nhánh nháy đơn của `unquoteScalar` (cổng duy nhất mọi bộ đọc giá trị thi hành đi qua) gỡ `''`.
Bán kính đo 18/10 trên 16 kho: chỉ crm, đúng hai khoá trên, hôm nay đang chạy sai.

## Criteria

- AC-1: Given bảng viết trước chín scalar nháy đơn {`'a''b'`, `'''a'`, `'a'''`, `''''`, `''''''`,
  `'bash -c ''echo "x y"; echo z'''`, `'it''s'  # ghi chu`, `'a '' # b'`, `''`} với giá trị mong đợi lấy từ
  PyYAML 6.0.3 lúc thiết kế {`a'b`, `'a`, `a'`, `'`, `''`, `bash -c 'echo "x y"; echo z'`, `it's`, `a ' # b`,
  rỗng}, When `resolveConfigKey` đọc từng khoá, Then mỗi ô BẰNG đúng hằng mong đợi (khoá rỗng → `null` như hôm nay)
  và số khẳng định bằng hằng khai trước.
- AC-2: Given danh sách inline `[x, 'a''b', '''']` và danh sách khối có mục `- 'it''s'`, When `resolveConfigList`
  đọc, và `parseFlowValue("'a''b'")` được gọi thẳng, Then ra đúng `["x", "a'b", "'"]`, `["it's"]` và `.value`
  `a'b`.
- AC-3: Given ba hình dạng ngoài vỏ nháy đơn hợp lệ {`"a''b"` (nháy kép), `a''b` (trần), `'a'b'` (nháy đơn không
  cân)}, When `resolveConfigKey` đọc, Then ra NGUYÊN VĂN như hôm nay {`a''b`, `a''b`, `'a'b'`} — bản vá không lan
  ra ngoài vỏ nháy đơn. And các chân BG1–BG9 sẵn có của bộ răng bộ bóc nháy vẫn xanh.
- AC-4: Given kho mẫu có `config.yaml` mang lệnh hình dạng crm
  `'bash -c ''export BG_VET="<thư mục ngoài kho>"; printf da-chay > "$BG_VET/vet"'''` và eval `cmd: config:…`
  trỏ vào nó, When `s4-args.mjs` thật sinh tệp args rồi lệnh trong args được chạy bằng `bash -c`, Then lệnh không
  chứa `''`, mã thoát 0 và tệp dấu vết có nội dung `da-chay`. Chiều đỏ trên bản chưa vá: không có dấu vết.
- AC-5: Given kho mẫu (fixture của `repin-lane.mjs`) có eval `cmd: config:executors.script.<khoá>` và khoá đó trong
  `config.yaml` mang lệnh cùng hình dạng nháy đơn crm (đúng đường repin-lane:255 → `resolveConfigKey` gây E9=2;
  `evals.yaml` của kho mẫu không chứa `''`), When `repin-lane.mjs` thật chạy với `--write`, Then lệnh thoát 0,
  dòng `kind: repin` trong `run-log.jsonl` của kho mẫu có `evals_exit` của eval đó BẰNG 0 (so theo trường) và tệp
  dấu vết của lệnh trong được ghi. Đối chứng dương: cùng kho, lệnh viết nháy kép, cùng đường `config:` → xanh.
  Chiều đỏ trên bản chưa vá: repin-lane thoát khác 0, không dấu vết.
- AC-6: Given bản sao trọn cây (`git archive HEAD`) với nhánh nháy đơn của `unquoteScalar` hoàn nguyên về
  `return s.slice(1, -1);`, When chạy lại tệp ca, Then chân BG10a ĐỎ với thông điệp ghim `DO BG10a: [giua]`;
  đối chứng dương: bản sao nguyên vẹn xanh. And trong lịch sử nhánh, commit ĐẦU TIÊN mang ca mới đứng TRƯỚC commit
  vá: ở chính sha đó `lib/` chưa mang bản vá, fixture đã nhận khoá `e.yaml`, đối chứng nháy kép của BG10d/BG10e
  XANH (hạ tầng ca chạy được), còn BG10a/BG10d/BG10e ĐỎ với thông điệp ghim của vật (`[giua]` · `lenh trong
  khong chay` · `khong dau vet`), không phải thông điệp hạ tầng.
- AC-7: Given cây sau sửa, When chạy bộ test `tests/scripts` trọn và các mảnh suite của lượt chấm
  (`feature_loop.suite_keys`), Then mọi bộ xanh.

## Coverage

| Trục | Giá trị | AC |
|---|---|---|
| A. Đường đọc | `resolveConfigKey` lá · `resolveConfigList` inline · khối · `parseFlowValue` thẳng · s4-args (bên viết args) · repin-lane (bên chạy lệnh) | AC-1, AC-2, AC-4, AC-5 |
| B. Vỏ | nháy đơn cân · nháy kép · trần · nháy đơn không cân | AC-1, AC-3 |
| C. Vị trí `''` trong thân | giữa · đầu · cuối · chỉ một · hai cặp liền · kề chú thích · chứa ` #` · thân rỗng | AC-1 |

Thước CE: YAML 1.2.2 §7.3.2 (single-quoted style) [NGÀNH: YAML 1.2.2], đối chiếu bằng PyYAML 6.0.3; danh sách bên gọi rút bằng `grep` trên cây [SUY-TỪ-REPO: lib/evidence-core.cjs, feature-loop/scripts/].

## Out of scope

- `parseEvals` (`lib/eval-yaml.cjs`) không bóc nháy `cmd:` viết thẳng trong `evals.yaml` — lớp khác (không bóc,
  chứ không bóc sai); hỏng hiện (thoát 127), 18 hồ sơ cũ ở artifact-platform. Ghi hạt giống.
- Bộ escape đầy đủ của nháy kép (`\n`, `\t`, `\x..`) — giữ luật hiện có theo lời giao việc.
- `scripts/config-patch.mjs` `boNhay` — ngoài `lib/`, chỉ chống trùng mục ở `--append`.
- Scalar nháy đơn nhiều dòng — bộ đọc theo dòng có chủ đích.
- Sửa hay ghim lại bất cứ gì ở crm.

## Notes

- Kiểm ngoài (không phải AC — vật ở crm): sau khi crm cài mốc mang bản sửa, ghim lại tac-nhan-va; E9 phải `exit 0`.
  Chỉ báo trên crm-onehub#375, không sửa crm.
- Hạng T3: thêm Gate 1.5 duyệt kế hoạch.
- Hạt giống cho OOS-1 (S3, sổ d-2): `docs/plans/2026-10-18-hat-giong-parse-evals-khong-boc-nhay.md`.
- Known limits — chọn ở Cổng Bằng chứng 2026-10-18:
  - Ngoài-1: một ô đột biến của bộ kiểm tra nháy (ô 10, chân BG10a) chỉ có đối chứng dương khi chạy cùng chân liền kề; chạy tách riêng thì ô đó chưa tự chứng minh — người dùng không bị ảnh hưởng. Hàng `nhay-don-nhan-doi#ngoai-1` ở `docs/research/known-limits-ledger.tsv`.
