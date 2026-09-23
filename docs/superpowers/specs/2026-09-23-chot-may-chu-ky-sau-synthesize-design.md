# Chốt máy trường-của-người sau bước tổng hợp S4 — thiết kế

**Ngày:** 2026-09-23 · **Hồ sơ:** `_acceptance/chot-may-chu-ky-sau-synthesize/` · **Hạng:** T2
**Nguồn:** hạt giống `docs/plans/2026-09-23-hat-giong-tac-tu-tong-hop-ghi-truong-cua-nguoi.md`
(Gốc: crm `bo-dung-chung-nhan-chuoi` run `wf_e0599192-048`; crm `tieu-de-cot-doc-tron` run `wf_dee46a14-acb`).
**Quyết định owner 23/09 áp vào thiết kế này:** vòng đi RIÊNG hạt giống; vế 1 (chốt máy) và vế 3
(cặp kiểm hai chiều + chiều im trên corpus) là TRỪ, đi mặc định; vế 2 (răng bên đọc) là CỘNG,
trình ở Cổng Phạm vi để owner phê đích danh.

## Vấn đề

Workflow S4 nhận `report` là một chuỗi do tác tử tổng hợp viết, rồi trả nguyên chuỗi đó cho
vòng chính ghi thành `evidence-report.md`. Bốn trường trong chuỗi ấy không thuộc quyền tác tử:

- `human_signoff`, `human_override`, `bypass_ack` là chữ của NGƯỜI (ADR 0002).
- `verified_at` là giờ ENGINE đo — workflow đã có giờ ấy (`invokedAt` cho lượt này, giờ gốc
  cho eval carry) và đã ghi nó vào từng dòng run-log.

Hôm nay không bước máy nào giữ bốn trường. Prompt chỉ DẶN. Đo 23/09 trên hai kho, cùng lớp:

| kho | báo cáo | đã ký | `verified_at` sớm hơn ts run-log cùng run_id | `verified_at` muộn hơn giờ commit báo cáo |
|---|---|---|---|---|
| kit (`origin/main`) | 84 | 81 | 13 hồ sơ | 0 |
| crm (`origin/fix/tieu-de-cot-doc-tron`) | 56 | 51 | 12 hồ sơ | 6 hồ sơ |

Ví dụ kit: `ho-so-nghi` ghi `verified_at: 2026-09-19T10:15:00Z` trong khi run-log cùng run_id
ghi `14:01:23Z` — giờ tròn, do tác tử đặt. Chữ ký máy: crm round 6 `bo-dung-chung-nhan-chuoi`
trả `human_signoff: Phan Le Manh 2026-09-23` trước khi người ký; phiên crm gỡ tay.

Chân ngành: SLSA v1.0, mức Build L3 — bản kê xuất xứ do NỀN TẢNG dựng sinh, bên thuê (tenant)
không giả được. Ở đây nền tảng là workflow JS, bên thuê là tác tử LLM: trường xuất xứ phải do
JS viết lần cuối, không do tác tử.

## Thiết kế (vế 1 — chốt máy)

Một hàm thuần `chotTruongNguoi(report, { invokedAt, gioTheoRunId })` sống TRONG
`feature-loop/workflows/acceptance-verify.js`, giữa hai marker
`// <<<CHOT-TRUONG-NGUOI` và `// CHOT-TRUONG-NGUOI>>>` (sandbox workflow không có import;
test rút đúng khối này từ tệp thật, không chép). Workflow gọi nó ngay sau `synthesize:report`,
TRƯỚC khi trả `report` cho vòng chính.

Luật của hàm chỉ áp ở **vị trí trường** — đúng hai chỗ bên viết (vùng chép của
`evidence-report-template.md`) đặt trường:

- (a) khoá cấp 0 của frontmatter (giữa cặp `---` đầu tệp);
- (b) dòng trường của một khối bằng chứng: khối mở bằng dòng `- <khoá>:` ở cột bất kỳ
  (`- eval:`, `- cmd:` — mọi khuôn khối của template: eval máy, ui-check, judgment, suite, carry
  đều mở bằng một trong hai), dòng trường là dòng thụt đúng bằng cột nội dung của khối.

Nội dung của trường khối vô hướng (`output: |`, `observed: |`, `expected: >` … — các dòng thụt
sâu hơn dòng mở của nó) và văn xuôi ở thân báo cáo KHÔNG phải vị trí trường: giữ nguyên byte, kể
cả khi chứa chuỗi hình khoá (ví dụ output của chính test vòng này in `human_signoff: …`).

1. Khoá `human_signoff` / `human_override` / `bypass_ack` ở vị trí trường, dấu tách `:` hoặc
   `=`, giá trị KHÁC rỗng và không chỉ là chú thích → viết lại thành `<thụt lề><khoá><dấu tách>`,
   bỏ giá trị. Giá trị rỗng hoặc chỉ-chú-thích → giữ nguyên byte. Dòng bắt đầu bằng `#` là chú
   thích, không phải vị trí trường.
2. `verified_at` ở vị trí trường → giờ engine. Ở khối: theo `run_id` của khối qua `gioTheoRunId`
   (eval tươi và lệnh suite → `invokedAt`; eval carry → `verifiedAt` gốc của payload carry —
   đúng giá trị prompt đã đưa); khối không có run_id đã biết → `invokedAt`. Ở frontmatter →
   `invokedAt`. Giá trị đã bằng giờ engine → giữ nguyên byte.
3. Không dòng nào khác bị chạm; số dòng không đổi; kết thúc dòng giữ nguyên.

Giới hạn đã khai của luật vị trí: bộ đọc L3 của `lib/evidence-core.cjs` đếm dòng
`human_override:` có giá trị Ở BẤT KỲ ĐÂU trong báo cáo, kể cả trong khối vô hướng. Chốt không
xoá chuỗi trong khối vô hướng (xoá là làm giả output), nên một override tác tử đặt vào output
vẫn được bộ đọc đếm. Đó là lỗ của BÊN ĐỌC — thuộc vế 2. Ngưỡng mở lại: ≥ 1 báo cáo có
`human_override` có giá trị nằm trong khối vô hướng mà không phải output của một test.

Trả `{ text, doi: { human_signoff, human_override, bypass_ack, verified_at }, loi }`.
`loi` khác null khi có ít nhất một dòng `verified_at` ở vị trí trường cần giờ engine mà
`invokedAt` vắng hoặc không phải ISO: workflow khi đó trả `BLOCKED` với lý do gọi tên
`chot-truong-nguoi: khong co gio engine (invokedAt vang) — khong ep duoc verified_at`, `report`
rỗng. Báo cáo không có dòng `verified_at` nào thì không cần giờ, W14 giữ PASS — nhưng đó KHÔNG
phải tương thích ngược thật: báo cáo thật luôn có `verified_at` (mọi eval đòi nó). Bên dựng args
S4 duy nhất là `feature-loop/scripts/s4-args.mjs`, và nó luôn ghi `invokedAt` (dòng 402, 514);
bên gọi tự dựng args thiếu `invokedAt` sẽ BLOCKED có tên — đúng ý, không phải hồi quy.

**Hồ sơ đã ký chạy lại S4 thì sao.** Chốt xoá chữ ký trong báo cáo MỚI của một lượt S4, và đó là
đúng: chữ ký cũ ký trên bằng chứng cũ. S4 chỉ chạy lại trên hồ sơ đã ký qua bảo vệ hết-hạn
(SKILL feature-loop, «Staleness guard»: hạ `status: implemented` rồi vào round mới → Cổng Bằng
chứng lần nữa). Ghim lại theo release KHÔNG đi S4: nó đi `repin-lane.mjs`, vốn không chạm
`human_signoff`/`human_override` (SKILL feature-loop, «Nghi thức re-pin», bước 2).

**Nói ra, không sửa lặng:** khi `doi` có số khác 0, workflow thêm MỘT dòng run-log
`{"ts":<invokedAt>,"round":N,"kind":"chot-truong-nguoi","human_signoff":a,"human_override":b,"bypass_ack":c,"verified_at":d}`
và một dòng `log()`. Không đổi gì → không dòng nào (W03 giữ đúng số dòng). Vì sao: sửa lặng thì
tần suất tác tử bịa biến mất khỏi mọi số đo; dòng này là thứ duy nhất đếm được lớp lỗi sau khi
nó bị chặn.

Prompt synthesize KHÔNG đổi (dặn-bằng-lời không phải nghiệm; bỏ dặn cũng không cần — chốt máy
đứng sau nó).

## Đổi khuôn 23/09 (owner chọn tại điểm dừng-vá sau S4 lượt 2)

Hai lượt chấm liên tiếp tìm lỗi cùng lớp «chốt nhận hình dạng HẸP hơn bên đọc» (lượt 1: rào
frontmatter, run_id có nháy; lượt 2: run_id ở dòng mở khối, sáu đột biến cùng lớp vẫn xanh).
Khuôn «tự liệt kê vị trí trường theo khuôn bên viết» ở trên bị THAY bằng: chốt nhận đúng những
gì BÊN ĐỌC (`lib/evidence-core.cjs`) nhận.

- `human_signoff` / `bypass_ack`: chỉ trong frontmatter, khoá cấp 0, rào `---[ \t]*` sau dòng trống
  đầu, rào không đóng thì tới hết tệp (`frontmatterField` · `chuKyThat`).
- `human_override` / `verified_at`: mọi dòng `^\s*(-\s+)?khoá\s*[:=]`, mọi cột, không phân biệt hoa
  thường (L3 đếm override ở mọi nơi).
- run_id của một bản ghi: mọi dòng `^\s*(-\s+)?run_id\s*[:=]` trong bản ghi kể cả dòng mở, bỏ chú
  thích và nháy (`extractRunIds`); bản ghi mở bằng `^\s*-\s+` (`walkEvalExits`).
- `human_override` rỗng được viết `human_override:  # chi nguoi ghi`: biểu thức L3 của bên đọc
  (`\s*` vượt dòng) đếm một dòng rỗng TRẦN là «đã có người chấp thuận» khi dòng kế không mở bằng
  `#` — ca vi phân lộ ra điều này; lỗi của bên đọc ghi vào hạt giống vế 2.
- Ngoại lệ duy nhất vẫn giữ: nội dung khối vô hướng không bao giờ chạm.

Phép đo mới: bảng vi phân viết trước 282 ô (A chữ ký frontmatter 84 · B override mọi nơi 12 ·
C giờ carry theo run_id 160 · D khối vô hướng 24 · E giờ đúng dạng khác 2), mỗi ô đối chứng dương
bằng chính bộ đọc trên bản trước, rồi hỏi lại bộ đọc sau chốt; chín đột biến của khuôn mới, mỗi
cái phải làm đỏ đúng trục nó phá.

## Lượt 4 (owner «tiếp tục» ở trần 3 lượt, 23/09)

Lượt 3 tìm hai hồi quy của chính lượt đổi khuôn và một lệch đo. Sửa: giới hạn «cột 0 · chỉ trong
frontmatter» chỉ áp cho `human_signoff`/`bypass_ack` (override và giờ đọc ở mọi nơi, kể cả khi rào
không đóng làm cả tệp thành frontmatter); cột nội dung khối vô hướng tính từ cột khoá chứ không
từ dấu gạch (`- output: |`); trục B của bảng vi phân rút từ chính biểu thức L3 — mười hình dạng
thuộc lời hứa và năm hình dạng là giới hạn đã khai (khối `GIOI-HAN-CHOT` trong workflow, một
nguồn). Bảng thành 472 ô, 11 đột biến.

## Đo (vế 3 — cặp hai chiều + chiều im)

Tệp mới `tests/workflows/chot-truong-nguoi.test.mjs`, chạy trong suite workflows.

- **Fixture do code sinh:** báo cáo nền rút từ vùng chép của
  `skills/acceptance/references/evidence-report-template.md` (sau `---8<---`), điền bằng
  run_id lấy từ `result.runLog` của CHÍNH lượt chạy harness — không chuỗi viết tay đúng khuôn.
- **Chiều đỏ:** tác tử tổng hợp giả trả báo cáo nền + chữ ký ở cả ba khoá + `verified_at`
  tương lai (2099) ở mọi khối → `result.report` có ba khoá rỗng, mọi `verified_at` = giờ engine.
  Ma trận viết trước: mọi khuôn khối của template (eval máy · ui-check · judgment · suite) ×
  (tươi · carry) + frontmatter; fixture carry có `verifiedAt` KHÁC `invokedAt` (assert trước khi so).
- **Khối vô hướng:** fixture có `output: |` chứa `human_signoff: X` và `verified_at: 2099…` →
  giữ nguyên byte; mutant «khớp khoá ở mọi cột» → đỏ.
- **Đối chứng dương / không đổi byte:** báo cáo nền đúng → `result.report === ` chuỗi tác tử trả;
  và chốt(báo cáo giả) `===` báo cáo nền (so bằng, không so chuỗi-có-mặt).
- **Độ nhạy (mutant trong bộ nhớ, `srcOverride` của harness):** gỡ lời gọi chốt → ca chiều đỏ
  ĐỎ với thông điệp ghim; bỏ `bypass_ack` khỏi danh sách khoá → ĐỎ ghim tên khoá; khối carry lấy
  `invokedAt` → ĐỎ ghim eval carry; khớp khoá ở mọi cột → ĐỎ ghim dòng output.
- **Chiều im trên corpus kit:** áp khối hàm rút từ tệp lên MỌI `_acceptance/*/evidence-report.md`
  → mọi dòng đổi đều mang một trong bốn khoá, số dòng bằng; đối chứng dương: số báo cáo quét
  ≥ 80 và ≥ 1 báo cáo bị chạm (chữ ký thật của người); mutant chạm thêm `verdict:` → ĐỎ ghim
  «cham dong ngoai bon khoa».
- **Chiều im trên corpus crm:** cùng phép, script `tests/workflows/chot-truong-nguoi-corpus.mjs
  --root <kho> --ref <ref>… --can <slug>…`, đọc bằng `git show` (không chạm cây làm việc của
  crm). Bốn nhánh, mỗi nhánh một ca trên kho git tạm do code sinh: ref lẻ vắng → một dòng khai,
  thoát 0 · mọi ref vắng → mã riêng · hồ sơ `--can` vắng ở mọi ref đọc được → mã riêng · không phải
  kho git → mã riêng; ba nhánh sau in «khong doc duoc o day». Lượt thật đòi số báo cáo bị chạm ≥ 1.

## Ngoài phạm vi

- **Vế 2 — răng bên đọc** (CỘNG): chờ owner phê ở Cổng Phạm vi. Số đo cho câu hỏi ở mục Vấn đề
  và thêm: luật «chữ ký khác rỗng mà không có commit `Gate 2 signoff: <slug>`» chạm 37/81 hồ sơ
  kit đã ký và 6/51 hồ sơ crm (hồ sơ ký trước khi có nghi thức commit ấy). Chạm `lib/` và
  `scripts/recheck-evidence.cjs` → hạng T3 theo `risk_tiers.t3_paths`.
- Chữa ngược giá trị bịa đã nằm trong 13 hồ sơ kit + 12 hồ sơ crm: chiến dịch ghim lại dùng
  run-log thật, không thuộc vòng này (vế 1 chỉ chặn từ nay).
- Suite-qua-trần, thẻ Cổng 1 hồ sơ khép, S1 — owner tách riêng 23/09.

## Coverage (quét hình thái, preset test-matrix)

Trục:
- **Khoá:** human_signoff | human_override | bypass_ack | verified_at
  [thước CE: vùng chép của evidence-report-template + ba khoá người trong ADR 0002]
- **Vị trí dòng:** frontmatter | khối eval máy | khối ui-check | khối judgment | khối suite | khối carry
  | nội dung khối vô hướng | văn xuôi thân
  [thước CE: vùng chép + SUITE-BLOCK / UI-CHECK-BLOCK / JUDGMENT-BLOCK template + prompt carried]
- **Trạng thái hồ sơ khi S4 chạy:** chưa ký | đã ký rồi chạy lại S4 | ghim lại theo release
  [thước CE: SKILL feature-loop «Staleness guard» + «Nghi thức re-pin»]
- **Giá trị:** rỗng | chỉ chú thích | có giá trị | trùng giờ engine | lệch giờ
- **Nguồn giờ engine:** invokedAt có | invokedAt vắng | verifiedAt carry
  [thước CE: `invokedAt` + `carriedForReport` trong workflow]

Core: ba khoá người có giá trị ở frontmatter và khối judgment → rỗng (AC-1) · verified_at lệch ở
mọi khuôn khối × tươi/carry + frontmatter → giờ engine đúng nguồn (AC-2) · rỗng/chú thích/trùng
giờ, khối vô hướng, văn xuôi → không đổi byte (AC-3) · invokedAt vắng + có verified_at → BLOCKED (AC-4) · nói ra (AC-5) ·
chiều im corpus (AC-6, AC-7) · độ nhạy (AC-8).
Never: khoá người ở khối suite/eval máy — gộp vào luật vị trí trường, không cần ô riêng · hồ sơ
đã ký chạy lại S4 — chữ ký cũ mất là đúng ý (xem «Hồ sơ đã ký chạy lại S4»), không cần AC ·
ghim lại theo release — không đi S4. Later: không có.
