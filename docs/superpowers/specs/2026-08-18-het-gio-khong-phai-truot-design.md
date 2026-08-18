# Hết giờ không phải trượt — verifier bị công cụ giết ≠ suite fail

**Ngày:** 2026-08-18 · **Slug:** `het-gio-khong-phai-truot` · **Tier:** T2 (làn V)

## Vấn đề (vấp thật, hồ sơ release-2-2-0 S4 vòng 5)

Verifier máy của `bash tests/plugins/run-tests.sh` gọi Bash **không truyền
`timeout`**. Suite chạy đơn 108 s; dưới tải 4 suite + baseline song song nó
vượt trần mặc định ~120 s của công cụ → công cụ giết lệnh ở 118 s giữa case
P188. Tool result trả «Error: Exit code 1», output cắt ở 10 000 ký tự, **không
một dòng FAIL nào** — nhưng verifier khai `exitCode=1, cannotRun=false`, nên
workflow REJECT giả (4 eval FAIL). Vòng 4 cùng lệnh, verifier tình cờ truyền
`timeout: 600000` → xanh. Cùng một cây code, hai verdict — verdict phụ thuộc
vào thói quen gọi tool của agent, không vào vật.

Bản chất lớp lỗi: **exit code do công cụ sinh ra bị đọc như exit code của
lệnh**. Nó là anh em của lớp «runner nuốt mã thoát» (ba-lop-che-mau-xanh) —
nhưng chiều ngược: runner nuốt làm đỏ thành xanh, công cụ giết làm xanh thành
đỏ. Cả hai đều là *hạ tầng mạo danh vật*.

## Quét không gian (Zwicky, test-matrix)

Trục **lane chạy lệnh dài** × **phòng tuyến** × **kết cục**:

| Lane | Phòng ngừa (dặn timeout) | Nhận diện (tool-kill ≠ exit thật) | Routing JS | Kết cục đúng |
|---|---|---|---|---|
| machine | ✅ Core | ✅ Core | ✅ Core (không tin lời khai đơn lẻ) | BLOCKED |
| ui-check | ✅ Core (cùng khối rule) | ✅ Core | ✅ Core (chung normalize) | BLOCKED |
| baseline | ✅ Core | ✅ Core | ✅ (cannotRun → n-a) | advisory `n-a`, không `red` giả |

- Judge / triage / refute / provenance / synthesize: không chạy lệnh dài → ngoài không gian.
- `execute-parallel.js` (S3): executor tự chạy verifyCmd nhưng không sinh verdict cổng, fail → main loop tự fix — **Later**, hồ sơ riêng nếu vấp thật.
- **Never:** JS tự đoán tool-kill bằng grep chuỗi «Results»/«FAIL» trong `outputTail` — chuỗi tổng kết là của suite từng repo, engine phục vụ mọi repo; heuristic consumer-specific trong engine vi phạm bất biến «kit là engine». Nhận diện là việc của agent (nó nhìn thấy tool result thật); JS chỉ tin **field có cấu trúc** (`killedByTool`) và phòng thủ trên đó.

## Thiết kế

**Ba lớp, một nguồn luật:**

1. **Luật trong marker `TOOL-KILL-RULE`** (const trong acceptance-verify.js,
   cùng nếp `EVAL-REQUIRED-FIELDS`): (a) gọi Bash chạy lệnh suite → LUÔN đặt
   `timeout ≥ 600000` ms — trần mặc định của công cụ ngắn hơn nhiều suite;
   (b) lệnh bị công cụ dừng (tool báo timeout/killed, hoặc output bị cắt
   giữa chừng) → exit code đó KHÔNG phải của lệnh: `cannotRun=true` +
   `killedByTool=true` + reason khuôn «bi cong cu giet o <so giay> giay».
   Prompt của **cả 3 lane** (machine, ui-check, baseline) nội suy nguyên khối
   này — không chép tay ba bản.
2. **Schema:** `MACHINE_SCHEMA` + `UI_SCHEMA` + item của
   `BASELINE_SCHEMA.results` đều thêm field optional `killedByTool: boolean`
   (description hướng dẫn) — cả 3 lane có CÙNG field cấu trúc để normKill bám,
   không lane nào phải được fixture «tự chế field ngoài schema» (gap-probe P0).
3. **Routing JS phòng thủ (`normKill`):** kết quả machine/ui/baseline có
   `killedByTool === true` → ép `cannotRun=true` + reason mặc định ghim
   «bi cong cu giet» nếu agent bỏ trống — kể cả khi agent khai
   `cannotRun=false` (đúng ca sự cố). Từ đó routing sẵn có đưa về **BLOCKED**
   (hạ tầng, chạy lại cùng round), tuyệt đối không vào `failed`/REJECT.

**Tương thích:** mọi field mới optional. Kết quả không có `killedByTool`
(agent cũ, flow cũ) → hành vi y nguyên từng bit — suite tồn kho phải xanh
nguyên không sửa case nào.

## Phép đo (tests/workflows/acceptance-verify.test.mjs)

- **W25 round-trip marker:** rút nguyên văn khối rule từ marker
  `TOOL-KILL-RULE` trong source (không chép tay), assert prompt cả 3 lane
  chứa nó + schema 3 lane có `killedByTool` ngoài `required`; **chiều đỏ = 3
  mutant, một mutant mỗi lane** (gap-probe P1): mỗi `srcOverride` xoá ĐÚNG
  một lượt nội suy rule (theo thứ tự xuất hiện machine → ui → baseline),
  assert lane bị xoá mất rule và HAI lane còn lại vẫn còn — ca cô lập lớp,
  chặn copy-paste-grep-nhầm-biến.
- **W26 routing hai chiều trên CÙNG fixture** (tái hiện sự cố: `exitCode=1`,
  `outputTail` cắt giữa chừng không có dòng tổng kết):
  - chiều đỏ của vật cũ: `killedByTool=true, cannotRun=false` → verdict
    **BLOCKED**, reason ghim «bi cong cu giet», eval KHÔNG vào `failedEvals`;
  - hai nhánh reason (gap-probe P2): agent có reason → giữ NGUYÊN VĂN;
    reason trống → JS điền đúng khuôn ghim — mỗi nhánh một dòng PASS riêng;
  - đối chứng dương: cùng fixture, `killedByTool=false`, outputTail có dòng
    FAIL thật → verdict **REJECT** như cũ.
- **W27 baseline:** baseline result `killedByTool=true` (đúng khuôn schema
  thật — round-trip, không tự chế field) → status `n-a` (không `red` giả
  trong nonDiscriminating/report); đối chứng: baseline exit 1 thật → `red`.
- **Răng hồ sơ `rang.sh`** (đăng ký `executors.script.rang_hgkpt` vào
  `_acceptance/config.yaml` — task thi công tường minh, gap-probe P2): chạy
  suite workflows một lần, ghim ĐÚNG các dòng `PASS: W25/W26/W27` (nếp p194 —
  không tin exit code trọn suite) + tự-phá-thử grep trên bản sao stdout đã
  xoá dòng; **chân tồn-kho** (gap-probe P1): rút danh sách tên case từ bản
  diffBase của test file (`git show`), assert từng tên còn nguyên văn trong
  file hiện tại và có `PASS: <tên>` trong stdout — đo vế «không sửa case cũ»
  của AC-7, không hardcode số ca.

## Out of scope

- Lane executor của `execute-parallel.js` (xem Later ở trên).
- Nâng trần timeout của harness / đổi cách harness cắt output — vật của
  Claude Code, không phải của kit.
- Heuristic nội dung output trong JS (xem Never ở trên).
