# Bộ xếp căn cứ chạy được ở mọi kho, thẻ giữ ba vế — thiết kế

**Hồ sơ:** `_acceptance/can-cu-s1-chay-moi-kho/` · **Hạng:** T2 · **Ngày:** 2026-10-11
**Gốc:** vòng `buoc-len-thiet-ke-khong-hoi` (A2), Ngoài-1/2/3 — chủ kho ký «mở hợp đồng mới».

## 1. Vì sao

A2 dạy bước thiết kế tự quyết lựa chọn có căn cứ và gom câu chỉ-người-biết về Cổng Phạm vi. Hai lỗi
lọt qua lượt chấm của A2, cả hai chỉ lộ NGOÀI kho kit:

1. **Lời dặn gọi bộ xếp bằng đường tương đối** `node scripts/can-cu-s1.cjs` ở hai chỗ của
   `feature-loop/skills/feature-loop/SKILL.md` (mục «Lật ở Cổng Phạm vi» và S1 mục 5). Ở crm, lệnh thoát
   1 «Cannot find module» (đo 11/10 trên checkout `eaf0886d5`) — trùng mã «còn dòng đỏ». Mọi vòng crm sẽ
   dừng Cổng Phạm vi vì một lỗi hạ tầng đọc thành sổ đỏ, và ngưỡng nghiệm thu của A2 không đo được.
2. **Thẻ Cổng Phạm vi bỏ «vì sao» và «sai thì tốn gì»** của mọi dòng sổ bước thiết kế mang `can_cu`
   (`scripts/gate-card.js`, hai khối căn cứ). Trái ADR 0021 và lời ADR 0022.

## 2. Ý định (cố định trong vòng)

Ở kho tiêu thụ, bước thiết kế kiểm sổ được và chỉ dừng Cổng Phạm vi vì lý do thật; người được mời lật
một lựa chọn máy đã quyết thấy đủ quyết gì · vì sao · sai thì tốn gì. Hồ sơ cũ không đổi màu.

## 3. Thiết kế

### 3.1 Lệnh gọi bộ xếp (SKILL feature-loop)

Hai lời gọi đổi sang mẫu đã có của cùng tệp (khối `S0-MO-O`):

```
AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/can-cu-s1.cjs) && node "$AG/scripts/can-cu-s1.cjs" --root . --slug <slug>
AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/can-cu-s1.cjs) && node "$AG/scripts/can-cu-s1.cjs" --root . --dem
```

Kho tự host kit thêm `--root .` NGAY SAU `--plugin acceptance-gate` của lệnh giải gói — không nhầm với `--root .` của bộ xếp (bộ giải nhận gốc khai, vẫn kiểm tệp có mặt) — bản
cài 2.26.0 chưa mang bộ xếp, nên kho kit cũng không dùng được bản cài cho tới mốc kế.

### 3.2 Đọc kết quả: dòng tổng kết, không mã thoát

S1 mục 5 đổi vế dừng: «sổ còn câu chỉ-người-biết hoặc dòng đỏ» = **dòng tổng kết** của bộ xếp
(`<slug> · câu hỏi N · máy đã quyết M · đỏ K · …`) có N > 0 hoặc K > 0. Lệnh **không in dòng tổng kết** =
bộ xếp không chạy được (thiếu gói, gói cũ, lỗi nạp): trình nguyên văn thông điệp như một DỪNG-lỗi có tên
— cùng loại với preflight thiếu gói ở S0#0 — không gọi là sổ đỏ. Mã thoát của bộ xếp KHÔNG đổi (A2 ghim).

### 3.3 Thẻ Cổng Phạm vi — ba vế cho hai khối căn cứ

Hai khối của A2 dùng lại hàm ba vế của khối chung (`decBaVe`, khối `DEC-BA-VE`) — một nguồn chữ:

- **«Câu chỉ anh trả lời được»:** `Hỏi-n · <quyết gì> — <vì sao> — sai thì tốn: <giá>[ · khó-đảo] —
  máy khuyên: … · lối khác: …`
- **«Máy đã quyết ở bước thiết kế — anh lật được»:** `[KHÔNG làm:] <quyết gì> — <vì sao> — sai thì tốn:
  <giá> — căn cứ: «trích» (tệp)` hoặc `… — lối khác chết vì: …`
- Dòng thiếu `cost_if_wrong` → nhãn «⚠ chưa khai giá nếu sai» ngay dòng đó (luật sẵn có của khuôn ba vế),
  không chặn thẻ.
- Bản rút (`--extract`) — `can_cu.cau_hoi[]` và `can_cu.da_quyet[]` mang thêm `why`, `cost_if_wrong`.

Dòng KHÔNG mang `can_cu` không đi vào hai khối này — khối chung in như cũ.

### 3.4 Răng

Ca mới ở `tests/scripts/can-cu-s1.ca.mjs` (cạnh ca của bộ xếp), mã `KK-<n>` = AC-n:

- **KK-1:** kho thử do code sinh (thư mục tạm + `git init`, KHÔNG có `scripts/` của kit) có hồ sơ với
  sổ S1 viết sẵn; bộ nhớ đệm plugin giả (`HOME` tạm) chứa
  `acceptance-gate-kit/acceptance-gate/<bản>/` trỏ cây đang kiểm — đúng hình kho khách đã cài gói. Rút
  MỌI lệnh trong SKILL gọi `can-cu-s1.cjs` (đúng hai), thay `$WORKFLOWS_DIR`, `<slug>`, chạy dưới bash và
  zsh → thoát 0 + dòng tổng kết với số đếm viết sẵn. Chiều đỏ: bản sao SKILL đặt lại lệnh tương đối →
  hàm kiểm nêu «không chạy được ngoài kho kit» (cùng kho thử, cùng bộ nhớ đệm).
- **KK-2:** cùng lệnh rút từ SKILL — (a) sổ có một dòng đỏ → thoát 1 KÈM dòng tổng kết «đỏ 1»; (b) bộ nhớ
  đệm chỉ có bản gói KHÔNG mang bộ xếp → không có dòng tổng kết, thông điệp nêu tên gói và lệnh cài.
- **KK-4:** quét TRỌN SKILL feature-loop: lời gọi `node|bash|sh [./][<gói>/]scripts/<tệp>` mà tệp ấy có trong
  cây kit (gốc kho hoặc gói feature-loop) = lỗi, không danh sách ngoại lệ. Ma trận bốn hình viết sẵn
  (`node scripts/…` · `node ./scripts/…` · `node feature-loop/scripts/…` · `bash scripts/….sh`), mỗi hình
  tiêm một bản sao → đúng một mục tệp:dòng; đối chứng dương: bản sao chưa tiêm → [].
- **KK-5..7:** thẻ dựng từ hồ sơ nháp do code sinh, mỗi dòng S1 mang `why`/`cost_if_wrong` RIÊNG → chữ
  của chính dòng nằm trong chính `<p>` của dòng ấy (quan hệ, không chỉ có mặt); khối máy đã quyết phủ đủ
  nguồn {mục-tiêu, một-lối} × loại {approach, descope}; dòng thiếu giá → nhãn; bản rút mang hai vế. Thêm
  một ca VÒNG TRÒN trên sổ THẬT của chính hồ sơ này (ghi bằng khối lệnh `DEC-ID-RECIPE` của SKILL): thẻ ép
  `--gate 1` có đúng một dòng mỗi dòng S1 mang căn cứ chưa bị thay (đếm bằng bộ xếp, không từ thẻ). Chiều
  đỏ: bản sao thẻ trả lại cách in cũ của A2 → ca nêu tên dòng thiếu vế.
- **KK-8:** mọi hồ sơ của kho kit không có dòng mang `can_cu` → thẻ Cổng Phạm vi ép `--gate 1` (HTML + bản
  rút) ở gốc vòng và ở đỉnh giống từng byte. Gốc/đỉnh lấy từ lịch sử (commit gộp nhánh vòng: merge-base hai
  cha / cha thứ hai) hoặc, khi chưa gộp, merge-base với nhánh chính / cây làm việc — lượt chấm chỉ chạy SAU
  khi A2 lên main và nhánh đã cập nhật từ main. Bản gốc dựng bằng `git archive <gốc> scripts lib skills`;
  đối chứng dương cho bộ thư mục: lưu trữ của HEAD so với cây làm việc → 0 lệch. Chiều đỏ: bản sao thẻ đổi
  chữ khối chung → ca nêu tên hồ sơ.

### 3.5 Quét tay 11/10 (một lần, ghi lại để khỏi quét lại)

Quét 110 tệp `.md` lời dặn của bốn gói (`skills/`, `commands/` của acceptance-gate, feature-loop,
dieu-phoi, diagram-design) với mọi vỏ (`node|bash|sh`) và mọi tiền tố gói (`[./][<gói>/]scripts/<tệp>`):
10 lời gọi. 2 là lỗi của vòng này (`feature-loop/skills/feature-loop/SKILL.md:136`, `:222`). 8 đúng chủ
đích: `vlm-assert.mjs`, `ui-capture.mjs` (3 — tệp kho khách tự chép vào kho mình, không có trong kit) ·
`bash scripts/pre-merge-check.sh` ở `commands/acceptance-init.md:186` và `commands/signoff.md:276` (2 —
kho khách chép tệp này theo danh sách chép CI của acceptance-init; signoff nói rõ «nếu kho có tệp, không thì
dùng bản của gói») · `node scripts/product-map.mjs` ở `skills/uat-session/SKILL.md:121` (1 — câu viết cho
kho tự host) · `node tests/scripts/…` ở `commands/signoff.md:212–213` (2 — khối đo trên kho kit). Vì 8/8
đúng chủ đích, luật «công cụ có trong kit gọi bằng đường tương đối là lỗi» đỏ oan ngoài SKILL feature-loop —
ca quét chỉ đặt trên SKILL ấy (sổ `d-20261011T150339Z-8`, `-9`).

## 4. Giới hạn đã khai

- Lời dặn «dòng tổng kết, không mã thoát» là văn cho phiên đọc — không bộ máy nào cưỡng chế cách phiên
  đọc. Răng máy chỉ chứng hai chiều mà phiên phải phân biệt có hình dạng khác nhau (KK-2). Ngưỡng mở ô:
  ≥ 1 vòng ở kho khách dừng Cổng Phạm vi vì đọc lỗi bộ xếp thành sổ đỏ.
- Kho tự host kit (`--root .` ngay sau `--plugin acceptance-gate`) không có ca riêng — cùng lệnh, khác gốc
  gói; bộ giải đã có ca cho `--root`. Trong MỘT mốc phát hành hai gói đi cùng nhau, nên bản cài luôn mang bộ
  xếp khi SKILL đã dặn gọi nó; `--root .` chỉ cần khi kho kit muốn chạy bộ xếp của cây. Ngưỡng mở ô: ≥ 1
  vòng ở kho kit dừng S1 vì bản cài thiếu bộ xếp.

## 5. Phương án đã cân

- Đổi mã thoát của bộ xếp để tách «không chạy được» — loại: sửa vật A2 đã ký (sổ `d-…-2`).
- Mở rộng ca DP7-08 — loại: tệp ca của gói điều phối, ngoài ranh giới lời giao (sổ `d-…-3`).
- Quét mọi tệp lời dặn của bốn gói — loại sau phản biện: 8/8 lời gọi cùng hình ngoài SKILL feature-loop
  đúng chủ đích, luật biểu thức đỏ oan (sổ `d-…-8` thay `d-…-4`, `d-…-9`).
- Neo gốc vòng của KK-8 vào cha của commit mở ô — loại: gộp main vào nhánh mang theo thay đổi thẻ của vòng
  khác, ca đỏ vì vật không phải của vòng này.

## 6. Tệp dự kiến

- `feature-loop/skills/feature-loop/SKILL.md` — hai lời gọi + vế dừng S1 mục 5.
- `scripts/gate-card.js` — hai khối căn cứ + bản rút.
- `tests/scripts/can-cu-s1.ca.mjs` — KK-1..KK-8 (+ dựng thẻ cho eval nhìn); `tests/scripts/run-tests.sh` —
  nhãn dòng gọi.
- `GUIDE.md` — câu mô tả hai khối của thẻ Cổng Phạm vi.
- KHÔNG đụng: `lib/`, `hooks/`, `dieu-phoi/`, `tests/dieu-phoi/`, khối TRONG-DOT, `feature-loop/scripts/`,
  `feature-loop/workflows/`, `scripts/can-cu-s1.cjs`.

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: máy dựng thẻ Cổng Phạm vi → người đọc từng lựa chọn: quyết gì · vì sao · sai thì tốn gì ·
  căn cứ → duyệt hoặc «sửa:» (điểm ra: lệnh duyệt)
- Biên: dòng thiếu giá → nhãn ngay dòng · sổ không có dòng mang căn cứ → thẻ như trước vòng
- Lỗi & quay lại: không đổi so với A2 (dòng đỏ → cờ đỏ, dòng lệnh không điền sẵn)

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Thẻ Cổng Phạm vi | cho người thấy giá của từng lựa chọn máy đã quyết hoặc đang hỏi, trước khi duyệt | lời mời cổng / lệnh duyệt |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-hoi-ba-ve | Thẻ Cổng Phạm vi | Hỏi-n: quyết gì — vì sao — sai thì tốn — máy khuyên · lối khác | duyệt (nhận khuyến nghị) hoặc «sửa: Hỏi-n = lối» |
| ST-may-quyet-ba-ve | Thẻ Cổng Phạm vi | dòng máy đã quyết: quyết gì — vì sao — sai thì tốn — căn cứ / lối chết | duyệt, hoặc lật bằng «sửa:» |
| ST-thieu-gia | Thẻ Cổng Phạm vi | nhãn «⚠ chưa khai giá nếu sai» ngay dòng | duyệt hoặc trả lại |
| ST-ho-so-cu | Thẻ Cổng Phạm vi | như trước vòng | như trước vòng |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Thứ tự trong dòng: quyết gì → vì sao → sai thì tốn → căn cứ hoặc khuyến nghị (người đọc giá trước
  bằng chứng). Thứ tự khối giữ như A2.

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| hàm ba vế `decBaVe` (khối `DEC-BA-VE`) | dùng | một nguồn chữ cho cả ba khối |
| khối `lab` + `grp` + `li` | dùng | không đổi |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: một-cột-cuộn
Căn cứ: thẻ hiện có là một cột cuộn; vòng chỉ thêm chữ vào dòng, không tra mẫu ngoài.
<!-- UX-SPEC-TEMPLATE>>> -->
