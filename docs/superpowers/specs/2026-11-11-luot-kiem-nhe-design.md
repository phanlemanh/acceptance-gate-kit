# Thiết kế — lượt kiểm tự động nhẹ đi mà vẫn tin được (`luot-kiem-nhe`)

Hồ sơ: `_acceptance/luot-kiem-nhe/` · hạng T2 · vòng meta chủ kho gọi tên, gắn mốc 2.39 · Cổng Đáng ký 11/11/2026.

## 1. Vấn đề, bằng số

Lượt kiểm tự động của kho (`.github/workflows/gate.yml`, việc `tests`) chạy năm bộ kiểm nối đuôi trong MỘT việc:
trung vị 58 phút. Mỗi lần đẩy lên PR, mỗi lần ghim lại, mỗi lần gộp nhánh chính vào nhánh làm việc là một lượt
(từ 01/10: 141 commit ghim lại, 258 lần gộp nhánh chính vào nhánh). Đoạn ký→gộp chờ đúng lượt ấy.

Đo lúc mở vòng, từ dấu giờ từng dòng trong nhật ký hai lượt xanh trên nhánh chính (lượt 42954542780 tại `9ff2e4f7`,
lượt 42912994864 tại `be736814`):

| Chỗ tốn giờ | `9ff2e4f7` | `be736814` |
|---|---|---|
| Cả việc `tests` | 57′ | 67′ |
| Bộ kiểm script | 34,4′ | 40,3′ |
| ↳ tệp `gate-card-lmcms.test.mjs` (ca LM13 + LM20) | 7,1′ | 8,6′ |
| ↳ 125 tệp `.test.mjs` khác / phần ca bash | 24,5′ / 2,7′ | 28,4′ / 3,3′ |
| Bộ kiểm plugin | 16,1′ | 19,3′ |
| ↳ ca P161 (một khối, vùng 2) | 13,3′ | 15,9′ |
| ↳ vùng 1 / vùng 3 | 1,0′ / 1,8′ | 1,2′ / 2,2′ |
| Bộ điều phối · bộ workflows · bộ móc · bản đồ | 4,8′ · 1,5′ · 0,1′ · 0′ | 5,6′ · 1,5′ · 0,1′ · 0′ |

Ba ca P161, LM13, LM20 dựng thẻ cho TỪNG hồ sơ thật của kit (276 hôm nay), mỗi lần một tiến trình `node` mới. Chúng
chậm thêm theo mỗi hồ sơ kit ký: hạt giống 22/09 ghi LM20 ≈ 105 giây, nay 210–260 giây; hồ sơ `ha-tang-khong-dot-luot`
khai giới hạn «vùng 2 của suite plugins là MỘT khối — P161, 320 s máy rảnh … ngưỡng mở lại: vùng 2 đo máy rảnh
> 480 s» — trên máy của lượt kiểm tự động nó đã 800–950 giây.

Phiên bản Node: lượt kiểm tự động chạy Node 22 (`node-version: '22'` ghi tay ở bốn việc), máy làm việc chạy Node 24.
Lớp lệch phiên bản đã đốt lượt ít nhất ba lần; chưa bộ chạy nào nói nó đang chạy trên Node nào.

## 2. Ba lối, và lối máy khuyên

| Lối | Lượt kiểm của PR (ước) | Lượt trọn trên nhánh chính | Giá |
|---|---|---|---|
| A — chỉ chia mảnh bằng cơ chế sẵn có | ~16–23′: sàn là vùng chỉ có P161 (13–16′); với 3 mảnh mjs như lượt chấm, mảnh chứa tệp LM13/LM20 mất 19–23′ (số ở ô cơ hội), với 6–8 mảnh còn ~16–20′ | 57–67′, không đổi | rẻ nhất; không chạm tệp kiểm nào |
| **B — chia mảnh + sửa ba ca chậm** | ~8–12′: mảnh dài nhất là mảnh mjs nặng nhất | ~35–45′ | +1–2 giờ máy; sửa hai tệp kiểm mà hai hồ sơ đã ký trỏ tới — điều chúng khẳng định giữ nguyên |
| C — chỉ sửa ba ca chậm | ~35–45′ | ~35–45′ | không đạt kết quả 1 của vòng |

Máy khuyên **B** (câu hỏi cho chủ kho ở Cổng Phạm vi, Hỏi trong sổ). Số ở cột hai là ước từ thời gian từng tệp trong
nhật ký; số thật đo trên lượt kiểm của chính PR vòng này.

## 3. Quét không gian (Zwicky rút gọn, preset test-matrix)

Ngữ cảnh: sản phẩm là kit nghiệm thu, chân sản phẩm suy từ kho (`.github/workflows/gate.yml`, `tests/*/run-tests.sh`,
`_acceptance/ha-tang-khong-dot-luot/`) · chân ngành: GitHub Actions — ma trận việc, việc phụ thuộc (`needs`), kiểm bắt
buộc của nhánh; `actions/setup-node` với `node-version-file`; tệp `.nvmrc` của nvm.

- **Trục 1 — sự kiện × việc**: PR → các việc mảnh · PR → việc gom tên `tests` · đẩy lên nhánh chính → việc trọn tên
  `tests` · cả hai → việc `gate`, `design-floor`, `design-eval` (không đổi ngoài nguồn khai Node).
  [thước CE: hai kiểm bắt buộc của nhánh chính đọc từ API là `gate` và `tests` — SUY-TỪ-REPO; NGÀNH: GitHub Actions
  coi việc bị bỏ qua là đạt khi xét kiểm bắt buộc, nên việc gom phải chạy cả khi mảnh đỏ]
- **Trục 2 — lời khai Node × Node đang chạy**: khai `24` · `v24` · `24.22` · `24.15.0` · vắng · không đọc được
  (`lts/*`, rỗng) × chạy `24.22.0` · `22.x` · `18.x`. [thước CE: cú pháp `.nvmrc` mà setup-node nhận — NGÀNH]
- **Trục 3 — nơi kiểm Node**: bốn bộ chạy bash (script, plugin, móc, workflows) · ba việc không qua bộ chạy bash
  (điều phối, bản đồ, `gate`) · hai việc có bộ chạy riêng (`design-floor`, `design-eval`). [SUY-TỪ-REPO: gate.yml]
- **Trục 4 — đơn vị đo thời gian × môi trường**: tệp mjs · lần ghi đạt/trượt (ca bash, khối plugin) · tệp workflows ×
  máy cá nhân (bash 3.2, độ phân giải giây) · lượt kiểm tự động (bash 5, mili giây).

Core → AC-1…AC-9. Later: huỷ lượt cũ của cùng PR khi đẩy lượt mới (concurrency) · chia mảnh mjs theo thời gian đo thay
cho chia theo thứ tự tệp · bảng thời gian cho bộ điều phối (đang có `duration_ms` của `node --test`). Never: bỏ lượt trọn
trên nhánh chính (đề bài giữ nó để lỗi chỉ lộ khi chạy trọn không lọt) · đổi tên kiểm bắt buộc (PR không gộp được).

## 4. Thiết kế

### 4.1 Lượt kiểm tự động (`gate.yml`)

- Việc `manh` — chỉ trên `pull_request`, ma trận `fail-fast: false`, mỗi phần tử một lệnh mảnh:
  `scripts --manh bash` · `scripts --manh mjs:i/n` cho i = 1…n · `plugins --manh vung:k` cho k = 1…K · một việc gom
  ba bộ nhỏ (móc · workflows · bản đồ) · bộ điều phối. Mỗi việc tự checkout đủ lịch sử (`fetch-depth: 0`) vì nhiều ca
  đọc lịch sử git. Việc mảnh script cài zsh như hôm nay.
- Việc `tests` — chạy trên cả hai sự kiện, `needs: manh`, `if: always()`:
  - đẩy lên nhánh chính: chạy trọn năm bộ không `--manh`, như hôm nay;
  - PR: một bước duy nhất — đỏ khi `needs.manh.result != 'success'`, gọi tên kết quả. Không `always()` thì một mảnh đỏ
    làm việc gom bị bỏ qua, và việc bị bỏ qua được tính là đạt — PR đỏ vẫn gộp được.
- `n` của mảnh mjs chọn ở S3 bằng số đo sau khi sửa ca chậm (ước 6–8). Hàm chọn tệp không đổi (lượt chấm đang dùng
  `mjs:i/3` với cùng hàm). `K` rút từ số marker vùng của bộ chạy plugin.
- Mọi `actions/setup-node` đọc `node-version-file: .nvmrc`; không còn phiên bản ghi tay.

### 4.2 Bộ chạy tự xưng và tự so Node — `tests/bo-chay.sh`

Tệp bash dùng chung, được bốn bộ chạy `source` ở dòng đầu thân (trước mọi ca, trước cả chế độ in danh sách mảnh), và
chạy được độc lập (`bash tests/bo-chay.sh node`) cho các việc không qua bộ chạy bash.

- Đọc dòng đầu `.nvmrc` ở gốc kho, bỏ tiền tố `v`. Đọc `node --version` của chính `node` trong PATH.
- So theo độ chính xác người khai: khai `24` → so số chính; `24.22` → so hai số; `24.22.0` → so đủ.
- Khớp → in đúng một dòng `node: v24.22.0 · kho khai 24 (.nvmrc) · khớp`, đi tiếp.
- Lệch → in ra stderr `node lệch: đang chạy v22.11.0, kho khai 24 (.nvmrc) — đổi Node rồi chạy lại`, thoát 3, không
  ca nào chạy.
- `.nvmrc` vắng → `node: kho chưa khai phiên bản Node (.nvmrc vắng ở <gốc>)`, thoát 3. Không đọc được (`lts/*`,
  rỗng, chữ lạ) → `node: không đọc được lời khai «<chữ>» trong .nvmrc — ghi số phiên bản`, thoát 3.

### 4.3 Bảng thời gian từng ca — cùng tệp `tests/bo-chay.sh`

- Mọi dòng kết quả của bộ plugin đi qua hai hàm ghi đạt/trượt (quét 11/11: 69 lời gọi `pass`/`fail`, 124 lời gọi
  `run`, chỉ hai dòng `echo "  PASS/FAIL` là chính thân hai hàm), nên ghi theo lần đạt/trượt không sót khối nào có in kết
  quả; AC-7 chứng trên bộ chạy thật.
- Đơn vị «ca» là thứ bộ chạy đã gọi tên khi in kết quả: mỗi lần ghi đạt/trượt (`check`/`same` của bộ script và bộ móc,
  `pass`/`fail` của bộ plugin — khối `run()` ghi đạt/trượt ngay khi xong nên thời gian của khối là một hàng), mỗi tệp
  của bộ workflows. Thời gian một hàng = khoảng từ lần ghi trước tới lần ghi này.
- Nguồn giờ: `$EPOCHREALTIME` khi có (bash 5 — lượt kiểm tự động), không thì `$SECONDS` (bash 3.2 của máy cá nhân,
  độ phân giải giây). Không gọi tiến trình con nào mỗi lần ghi.
- Ghi tệp `<gốc>/.acceptance-runs/thoi-gian-ca/<bộ>-<mảnh>.tsv` (thư mục bỏ qua bởi git; ghi đè đầu lượt). Cuối lượt in
  «Thời gian từng ca (<bộ>/<mảnh>): N ca · tổng X s · chậm nhất:» và mười hàng chậm nhất.
- Trên lượt kiểm tự động (`GITHUB_ACTIONS=true`): in trọn bảng trong một nhóm thu gọn của nhật ký, và nối bảng 15 hàng
  chậm nhất vào tóm tắt của việc (`$GITHUB_STEP_SUMMARY`). Không dùng hành động bên thứ ba.

### 4.4 Ba ca chậm (chỉ khi chủ kho chọn lối B)

- P161: các lần dựng thẻ độc lập nhau → chạy song song bằng một bể luồng cỡ số lõi, và nhớ kết quả theo (bản script,
  hồ sơ, cổng) để không dựng một thẻ hai lần. Mọi khẳng định, thứ tự in và dòng tóm tắt giữ nguyên.
- LM13, LM20: cùng gọi `gate-card.js --extract` cho từng hồ sơ trên cùng gốc → dựng một lần cho cả hai, song song, rồi
  hai ca đọc chung. Ca vẫn chạy được trên kho fixture qua `LMCMS_ROOT` như hôm nay.
- Chứng «không đổi điều khẳng định»: chạy bản cũ (rút từ nhánh chính bằng `git show`) và bản mới trên cùng cây → cùng
  dòng kết quả; và một đột biến làm hỏng điều ca canh → cả hai bản đỏ cùng thông điệp.

## 5. Rủi ro

- Đổi lượt kiểm tự động sang Node 24 (nếu chủ kho chọn) có thể làm đỏ ca nào đó chỉ đỏ trên 24 ở máy của lượt kiểm.
  Đo thử trước đây chạy đủ bộ trên Node 24 ở máy cá nhân, không ca nào đỏ vì Node; lượt kiểm của PR vòng này là phép đo
  thật.
- Máy khác chạy vòng kit với số chính khác lời khai sẽ đỏ ngay đầu mọi bộ chạy, kèm thông điệp. Đó là đúng hành vi muốn
  có, nhưng máy ấy phải đổi Node. Phiên bản Node của máy kia máy này không biết.
- Việc mảnh nhân phần chuẩn bị (checkout đủ lịch sử, cài zsh) lên mỗi việc: ~0,5–1′ mỗi việc, tính vào phút máy. Tổng
  phút máy của lượt PR có thể không giảm dù giờ đồng hồ giảm — hợp đồng đo cả hai (mục Đường đo). Huỷ lượt cũ của cùng
  PR khi đẩy lượt mới là khoản bù phút máy tự nhiên nhất, để vòng sau (hạt giống).
