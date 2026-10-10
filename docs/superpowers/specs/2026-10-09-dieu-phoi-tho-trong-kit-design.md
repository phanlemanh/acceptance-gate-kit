# Điều phối – Thợ trong kit — design (ô dù) và hàng DP1

Gốc: [ô cơ hội `dieu-phoi-tho-trong-kit`](../../../_acceptance/dieu-phoi-tho-trong-kit/opportunity.md)
(Cổng Đáng: build, 09/10) · hồ sơ crm `dieu-phoi-hai-tang` (ký 07/10) · spec phương pháp
[2026-10-05](2026-10-05-orchestrator-workers-hai-tang-design.md) §3, §5.1.

Tài liệu này có hai phần. Phần I là bản đồ cả bốn trục: kiến trúc đóng gói, chia hàng, thứ tự.
Phần II là thiết kế của hàng đầu tiên, DP1. Các hàng sau có spec riêng khi vòng của chúng mở.

---

## Phần I — Ô dù

### 1. Ý định

**Chủ kho nói (09/10):**
- Đóng gói mô hình Điều phối – Thợ đã chạy ở crm vào kit. Bật theo từng kho, mặc định tắt.
  OneFlow là kho neo thứ hai.
- Mở đợt bằng một lệnh, thay sáu bước tay.
- Một lệnh «tiếp tục» nối lại đợt sau khi phiên khởi động lại, hết ngữ cảnh hoặc app sập.
- Đổi tài khoản vì hết hạn mức: báo trước, tự bàn giao nhẹ, tài khoản kia «tiếp tục» bằng một lệnh.
  Có thể đổi nhiều lần trong một đợt, trên cùng một máy.
- Hoãn: nhiều máy, chuyển máy.

**Máy giả định (sửa nếu lệch):**
- Người dùng của mọi lệnh là phiên giám sát; chủ kho chỉ gõ lệnh và bấm chip.
- Một máy, một hệ điều hành người dùng; mọi tài khoản dùng chung ổ đĩa, worktree và tiến trình.
- macOS. Phép canh sức khoẻ máy của lõi đọc áp lực bộ nhớ và swap theo kiểu macOS; cả hai kho neo
  đều chạy trên Mac.

**Thành công** = bốn điều SỐNG ở mục Ngưỡng của ô, đọc khi đợt thử OneFlow đóng, timebox 31/10.

### 2. Kiến trúc đóng gói

#### 2.1 Lõi nằm ở đâu — chọn: một gói thứ tư `dieu-phoi`

| Phương án | Được | Mất |
|---|---|---|
| **A. Gói riêng `dieu-phoi` trong cùng marketplace** (chọn) | «Bật theo kho» = cài gói ở phạm vi dự án; «mặc định tắt» = chưa cài. Kho chưa cài thì hook không chạy: không một lần khởi động `node` nào thêm vào mỗi lời gọi công cụ. Lệnh mang tên `/dieu-phoi:…` đúng như bản ghi nhu cầu đề xuất | Thêm một gói phải cài và nâng theo mốc; chiến dịch phát hành có thêm một dòng |
| B. Trong `feature-loop`, bật bằng khoá cấu hình | Không thêm gói | Hook `PreToolUse` (Bash, Workflow) và `PostToolUse` (mọi công cụ) chạy ở MỌI kho có feature-loop, kể cả kho không bao giờ chạy đợt. Mỗi lời gọi công cụ thêm một lần khởi động `node`. Ngược «mặc định tắt» |
| C. Kit chỉ phát khuôn, mỗi kho giữ bản sao mã | Không đổi gì ở kit | Đúng điều luật «kit là engine» cấm: OneFlow phải chép 1.186 dòng mã; hai bản trôi khỏi nhau |

Phiên bản của gói đi theo dòng phiên bản kit (như `feature-loop`).

#### 2.2 Ba lớp — giữ ranh giới spec 05/10 §5.1

| Lớp | Gồm | Nằm ở |
|---|---|---|
| Lõi | bộ phát lịch · CLI đợt · 4 hook · lệnh bọc giữ nhịp · khuôn `LUAT.md`, `hang-viec.json`, `dieu-phoi.config.json` · bảng đồng hồ · lệnh mở/tiếp tục/bàn giao (DP2–DP4) | gói `dieu-phoi` |
| Riêng kho | cấu hình đợt (nhánh chính, tệp bảo vệ, ngưỡng) · hàng việc · luật riêng | thư mục gói đợt trong git của kho (crm: `docs/plan/dot-<tên>/`), chép vào thư mục đợt lúc mở |
| Riêng máy | thư mục đợt đang chạy, tiến trình bộ phát lịch, khoá, worktree, quyền của phiên | `<checkout chính>/.acceptance-runs/dieu-phoi-<đợt>/`, ngoài git |

#### 2.3 Thư mục đợt — giữ chỗ cũ, mọi lần ghi đi qua CLI

Thư mục đợt giữ nguyên chỗ crm đang dùng (`<checkout chính>/.acceptance-runs/dieu-phoi-<đợt>/` và
symlink `dieu-phoi-hien-tai`). Lý do: crm đang chạy một đợt ở đó, và chuyển chỗ thì phải chuyển giữa
đợt.

Sự cố 09/10: một phiên giám sát mới, mở ở worktree khác, bị chặn ghi tệp vào thư mục đợt vì thư mục
nằm ngoài worktree của phiên. Nghiệm: mọi lần ghi vào thư mục đợt đi qua lệnh con của CLI (đơn xin,
nhả khoá, yêu cầu, trả lời, dòng Nhật ký). Phiên gọi lệnh bằng Bash, không bằng công cụ ghi tệp. Lệnh
con ghi nguyên tử và kiểm khuôn trước khi ghi. Việc này nằm ở DP3, vì ca đã xảy ra là ca tiếp tục.

#### 2.4 Phần máy và phần LLM của «mở» và «tiếp tục»

Mở và tiếp tục cần cả hai phần:
- **Phần tất định** (CLI Node): dựng thư mục đợt, chạy bộ phát lịch, chẩn đoán thiếu gì.
- **Phần chỉ phiên làm được**: giăng Monitor, tạo lịch hẹn, dựng nhóm thanh bên, tạo chip. Các việc
  này dùng công cụ của app; tiến trình Node không gọi được.

Vì vậy mỗi lệnh `/dieu-phoi:…` là một lệnh của gói, chạy trong phiên giám sát:
1. Gọi CLI để lấy bản chẩn đoán dạng JSON.
2. Làm đúng các mục bản chẩn đoán báo thiếu.
3. Gọi CLI lần nữa để xác nhận.

Lệnh chạy lại được nhiều lần: mục nào đã có thì bỏ qua.

#### 2.5 Đọc mức dùng và tín hiệu hết hạn mức

Ba đường, tra ngày 09/10. DP0 đo trên bản đang cài trước khi DP4 chọn:

| Đường | Ai đọc | Biết gì | Đã chứng |
|---|---|---|---|
| `get_usage`, công cụ của app desktop | phiên giám sát, mỗi lần thức | % cửa sổ 5 giờ, % tuần, giờ đặt lại | Đo 09/10: chạy (40 %, 76 %) |
| Trường `rate_limits` trong JSON của dòng trạng thái (`five_hour`, `seven_day`: `used_percentage`, `resets_at`), ghi ra tệp bằng một lệnh statusline | bộ phát lịch (Node), không tốn token | như trên, cập nhật mỗi lượt của phiên | Docs `statusline#rate-limit-usage`: chỉ có với Pro/Max, sau phản hồi API đầu tiên. Chưa thử trên app desktop; một báo cáo ngoài, chưa xác minh, nói trường từng mất ở một bản |
| Hook `StopFailure` với `error: "rate_limit"` | hook Node ở worktree của thợ | lượt vừa chết vì hạn mức (báo muộn, không báo trước) | Docs `hooks#stopfailure`. Chưa thử |

Hướng của DP4, chốt sau DP0:
1. Báo trước bằng đường 2 nếu nó sống trên app desktop; nếu không, dùng đường 1.
2. Bộ phát lịch so với ngưỡng khai trong cấu hình đợt và phát `can_phan` loại `gan-han-muc`.
3. Đường 3 là lưới cuối: thợ đã cạn hạn mức thì hook tự commit WIP và ghi trạng thái dãy vào thư mục
   đợt. Hook là mã Node nên chạy được cả khi phiên không còn gọi model.

Docs còn khuyên mỗi tài khoản một `CLAUDE_CONFIG_DIR` thay vì đổi đăng nhập giữa chừng (`authentication#log-in-with-multiple-accounts`).
Đổi `/login` huỷ lượt chờ tự tiếp tục. Lời khuyên này áp cho CLI. App desktop có áp được không thì DP0 đo.

### 3. Chia hàng

| Hàng | Trục | Slug | Hạng | Việc | Đi sau |
|---|---|---|---|---|---|
| DP0 | 4 | (phép đo của ô dù) | — | Ba phép đo tài khoản trên máy thật, đi kèm lần đổi thật kế tiếp. Quy trình: [`discovery/do-tai-khoan/README.md`](../../../_acceptance/dieu-phoi-tho-trong-kit/discovery/do-tai-khoan/README.md) | — |
| DP1 | 1 | `dieu-phoi-dong-goi-loi` | T2 | Gói `dieu-phoi`: chuyển lõi, gắn hook qua gói, đọc được thư mục đợt crm, chiều im ở kho không có đợt. Phần II | — |
| DP2 | 2 | `dieu-phoi-mo-dot-mot-lenh` | T2 | `/dieu-phoi:mo-dot <tên>` và `/dieu-phoi:dong-dot`: dựng sáu thứ từ gói đợt của kho, khai vai giám sát và các dãy thợ; đóng đợt theo thẻ | DP1 |
| DP3 | 3 | `dieu-phoi-tiep-tuc-mot-lenh` | T2 | `/dieu-phoi:tiep-tuc`: chẩn đoán, chạy lại bộ phát lịch nếu chết, giăng lại Monitor và nhịp, mở chip cho dãy không có phiên sống, báo việc chờ người. Lệnh con ghi qua CLI (§2.3) | DP1 |
| DP4 | 4 | `dieu-phoi-doi-tai-khoan` | T2 | Ngưỡng hạn mức trong cấu hình đợt; `can_phan` khi gần ngưỡng; `/dieu-phoi:ban-giao` (ngừng cấp khoá, thợ commit WIP và đẩy nhánh, ghi `ban-giao.json`, in câu tiếp tục); DP3 đọc `ban-giao.json` | DP0, DP3 |
| DP6 | 2–4 | `dieu-phoi-lop-mod` | T2 | Lớp mod (workflow §12): khung trạng thái đợt, chặn S4 bằng bộ phân loại theo cấu trúc, tự bắt việc chờ người. Chủ kho đồng ý đưa vào 10/10 | DP3 |
| DP7 | 2–3 | `dieu-phoi-feature-loop-trong-dot` | T2 | Khối «Trong đợt» của feature-loop: chờ lượt S4 không thành câu hỏi, S5 mở hàng kế của dãy, quyền merge theo thẻ khởi tạo; kho không đợt không đổi byte (workflow §16 T7) | DP1 |
| DP5 | 1 | (việc ở kho OneFlow) | — | Đưa bản clone về `main`, cài gói, cấu hình đợt, chạy đợt thử. Đây là phép đo SỐNG | mốc mang DP1–DP4 |
| — | 1 | (việc ở kho crm) | — | Gỡ `scripts/dieu-phoi/` và 4 khối hook trong `.claude/settings.json`, cài gói. Phiên giám sát crm điều phối ở quãng lặng | mốc mang DP1 |

Hành trình chung của DP2–DP4 (vòng đời đợt, bốn lệnh, tệp trao tay, đếm chạm) nằm ở một bản duy nhất:
[workflow 2026-10-10](2026-10-10-dieu-phoi-workflow-design.md). Chủ kho chọn thiết kế trọn một lần ngày 10/10.

Mỗi hàng DP1–DP4 là một vòng `/feature-loop` riêng, có hợp đồng và lượt chấm riêng, không có ô cơ
hội riêng. Chữ ký Cổng Đáng của ô dù phủ cả bốn hàng (tiền lệ crm, luật 16 của đợt `sau-14-10`).
Ngưỡng nghiệm thu nằm ở ô dù và được đọc khi đợt thử OneFlow đóng.

### 4. Thứ tự và nhịp

- **DP1 mở ngay.** Gói mới không chạm crm cho tới khi crm cài nó, nên không vướng mốc «kit không đổi
  engine dưới chân crm trước 14/10».
- **DP2 và DP3** mở sau khi DP1 gộp. Hai hàng độc lập với nhau.
- **DP0** đi theo lần đổi tài khoản thật kế tiếp; nó phải xong trước khi DP4 mở.
- **Phát hành:** mốc mang DP1–DP4 phải cắt trước khoảng 25/10, để DP5 kịp đợt thử trước 31/10.
  Lộ trình kit đang xếp sáu hàng chưa mở (A1, R1, L3 cho mốc 18/10; G2, G3, A2 cho 25/10), nên chèn
  bốn hàng DP vào là một đánh đổi giá trị. Chủ kho chốt thứ tự này; xem câu hỏi ở Cổng Phạm vi của DP1.
- **Ràng buộc máy:** không cài hay nâng gói kit khi crm giữ khoá `s4` hoặc hàng gộp chưa trống. Lượt
  chấm của kit chạy cả bộ test; khi crm giữ khoá `s4` và swap đã cao, lượt chấm chờ quãng lặng để không
  đẩy crm vào giảm tải.

### 5. Ngoài phạm vi

Giữ nguyên mục «Out of scope» của ô. Thêm hai điều:
- Hệ điều hành ngoài macOS.
- ~~Tự sinh hàng việc từ lộ trình~~ — đưa vào DP2 ngày 10/10 dưới dạng bật thêm (workflow §14): đo crm
  cho thấy 24/24 hàng lúc mở đợt là hàng lộ trình chép tay.

### 6. Giới hạn đã khai, kèm ngưỡng đang đếm

- **Mở lại phiên thợ cần người bấm chip.** App khoá `start_session`, nên mỗi lần tiếp tục dưới tài
  khoản mới tốn một lần bấm cho mỗi dãy. Ngưỡng mở lại: app cho mở phiên mà không cần người bấm.
- **Bản lõi ở crm vẫn có thể đổi trong lúc DP1 chạy.** DP1 chép từ crm `origin/onehub` `a9e8bc75a`
  (lần đổi cuối của lõi: `5a2432153`, 08/10). Trước khi gộp, so lại bằng `git diff`. Có khác thì đưa
  phần khác vào, hoặc khai nó trong ghi chú chuyển cho crm.
- **Bộ phát lịch là điểm hỏng chung**, như spec 05/10 §9; ngưỡng giữ nguyên.

### 7. Dự báo năm dòng số (luật c)

| Dòng | Dự báo | Vì sao |
|---|---|---|
| Làm-xong → quyết-được | = | Thẻ cổng không đổi |
| Lượt gọi người mỗi vòng | ↓ ngoài thiết kế | Hết sáu bước mở tay, hết giăng lại Monitor bằng tay |
| Vòng bị hạ tầng đốt lượt | ↓ | Khoá S4 có ở kho thứ hai |
| Token máy mỗi vòng | ↓ | Phiên giám sát thôi tự dựng lại lớp app |
| Phút máy mỗi lượt chấm | = | Lõi không chấm gì |

Điều kiện tin cậy: đường verdict không đổi thành phần, vì lõi không chấm gì.

---

## Phần II — Hàng DP1 `dieu-phoi-dong-goi-loi`

### 8. Việc

Chuyển lõi từ crm vào gói `dieu-phoi` của kit, sao cho:
1. Một kho cài gói ở phạm vi dự án là có đủ CLI đợt và 4 hook. Kho không phải gắn gì vào
   `.claude/settings.json`.
2. Kho đã cài gói mà không có đợt nào đang chạy: mọi hook im, không tạo tệp nào.
3. Thư mục đợt do bản crm dựng (khuôn 07/10) chạy tiếp được bằng bản gói, không sửa tay.
4. Gói không chứa thứ gì riêng của crm.

DP1 không thêm lệnh `/dieu-phoi:…` nào. Lệnh thuộc DP2–DP4. CLI gọi bằng đường tuyệt đối của gói, giải
qua `resolve-plugin.mjs` của feature-loop.

### 9. Bố cục

```
dieu-phoi/
  .claude-plugin/plugin.json        tên dieu-phoi, phiên bản theo dòng kit
  hooks/hooks.json                  4 khối: PreToolUse Workflow|Bash → hook-chan-s4 ·
                                    PostToolUse * → hook-nhip · Notification idle_prompt|permission_prompt
                                    và UserPromptSubmit → hook-cho-nguoi. Lệnh dùng ${CLAUDE_PLUGIN_ROOT}
  scripts/                          14 tệp .mjs của lõi, chép nguyên từ crm a9e8bc75a
  scripts/mau/                      khuôn LUAT.md, hang-viec.json, dieu-phoi.config.json
  README.md                         mở, trong đợt, đóng, đường lùi — bản trung lập kho
tests/dieu-phoi/                    14 tệp test của lõi (84 ca, node:test), tệp dựng mẫu, ca của DP1
```

Đổi so với bản crm, và chỉ những đổi này:
- **Khuôn `LUAT.md`:** bỏ đường `scripts/dieu-phoi/giu-nhip.mjs`. Thay bằng «lệnh bọc mà hook in sẵn»:
  hook đã in đường tuyệt đối thật của `giu-nhip.mjs`, vì đường này suy từ vị trí tệp.
- **README:** viết lại trung lập kho. Không nhắc `onehub`, Postgres hay lệnh riêng của crm.
- **Hook:** gắn qua `hooks/hooks.json` của gói thay cho `.claude/settings.json` của kho. Thân hook giữ
  nguyên.

### 10. Hai bản cùng gắn trong lúc chuyển

crm sẽ có một quãng còn hook cũ trong `.claude/settings.json` mà gói đã cài. Cả hai bản đọc cùng thư
mục đợt, cùng tệp pid và cùng khoá, nên ra cùng quyết định:
- `chay` thấy pid sống thì không sinh bộ phát lịch thứ hai.
- `hook-chan-s4` của hai bản cho cùng mã thoát.
- `hook-nhip` chạm cùng tệp `nhip`.
- `hook-cho-nguoi` ghi cùng một tệp.

Cái giá là mỗi lời gọi công cụ chạy hook hai lần. Lệnh `xem` in một dòng cảnh báo khi thấy
`scripts/dieu-phoi/` trong `.claude/settings.json` của kho, kèm tên tệp, để phiên giám sát crm biết còn
việc gỡ.

### 11. Kiểm thử

Theo luật kit: mỗi phép đo mới có cặp hai chiều trên cùng một fixture, ghim thông điệp; fixture do mã
sinh, trừ ca đọc-cũ; đường dẫn suy từ vị trí script. Hợp đồng `dieu-phoi-dong-goi-loi` ghi chi tiết;
đây là hình dạng.
- **14 tệp test của lõi (84 ca)** chạy trong CI của kit, xanh. Chúng đã có đối chứng dương và chiều
  đỏ từ hồ sơ crm. Một tệp chạy rút đúng bước CI của gói từ `gate.yml` rồi chạy nó; chiều đỏ chạy trên
  bản sao không có tệp ca của DP1, để lệnh không tự gọi lại chính nó.
- **`hooks.json` qua bộ nạp thật:** `claude plugin validate --strict` trên gói, và trên bản sao bỏ lớp
  `hooks` ngoài cùng (phải báo lỗi). Thử 09/10 trên bản 2.1.293: bộ kiểm bắt được cả ca thiếu lớp
  `hooks` lẫn ca thiếu `"type"`. CI không có CLI này, nên vế ấy chỉ chạy ở lượt chấm trên máy.
- **Ánh xạ sự kiện → tệp hook:** so bằng nhau với bảng viết sẵn theo §9; mutant đảo hai lệnh → đỏ.
- **Chiều im:** ma trận ba kho dựng bằng mã (kho trống · kho có `_acceptance/` · kho có đợt đã đóng) ×
  bảy đầu vào của bốn sự kiện. Mỗi ô: mã thoát 0, stdout rỗng (stdout của `UserPromptSubmit` bị chèn
  vào ngữ cảnh mô hình), stderr rỗng, cây tệp băm giống hệt trước và sau. Đối chứng dương cho từng
  lệnh trên kho có đợt đang chạy.
- **Đọc-cũ:** bản chụp thật thư mục đợt crm (09/10), ẩn danh bằng một script trong cây. Script giữ
  nguyên tập khoá JSON, chỉ đổi giá trị. Bản chụp phải có ít nhất một khoá còn hạn và một đơn chờ, để
  phép so không xanh trên tập rỗng. Chiều đỏ: phá một trường của khuôn → sự kiện `loi-nhip` nêu đúng
  trường. Đây là ca duy nhất dùng fixture không do mã sinh, vì vật cần đo là thứ bản cũ đã sinh ra.
- **Gói chạy ở chỗ khác cây kit:** chép CHỈ `dieu-phoi/` ra thư mục tạm, chạy mọi lệnh hook và lệnh
  CLI, so mã thoát với bản nguồn. Mutant import `../../feature-loop/…` → bản chép đỏ. Bài học
  [lan-ghim-lai-theo-paths#F1]: mã nạp đồ của gói khác theo đường tương đối thì xanh ở cây kit, gãy ở
  kho tiêu thụ.
- **Không gì riêng crm:** quét chuỗi trên cây `dieu-phoi/` bằng danh sách cấm. Chiều đỏ: tiêm một chuỗi
  vào bản sao → đỏ, nêu tệp và dòng.
