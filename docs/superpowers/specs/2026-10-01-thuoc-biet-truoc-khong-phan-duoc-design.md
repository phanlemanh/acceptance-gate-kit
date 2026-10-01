# Thước biết trước là không phán được — thiết kế vòng T2

> Ngày: 2026-10-01 · hồ sơ `_acceptance/thuoc-biet-truoc-khong-phan-duoc/` ·
> nguồn: [finding 2026-10-01](../../findings/2026-10-01-thuoc-biet-truoc-khong-phan-duoc.md)
> §5 (họ lỗi), §8 (đề xuất bản đã sửa — owner duyệt 01/10), §10 (tự phản biện).
> Thiết kế đã được owner duyệt ở mức đề xuất; brainstorm không hỏi lại điều đã chốt.

## 1. Vấn đề trong một đoạn

Từ vòng `judgment-question-guard` (04/08), hội đồng chấm judgment chỉ đọc đúng
các tệp trong `inputs` — không diff, không lệnh. Bên VIẾT eval (luật chọn
executor, Phase 2 của skill acceptance, S1 của feature-loop, câu hỏi chéo của
gap-probe) không được báo. Kết quả đo trên 10 kho: 17 eval judgment hỏi «diff
của lượt» hoặc bảo chạy lệnh; sau 04/08, 10/12 ca kết thúc UNCERTAIN — phán
quyết không phụ thuộc vật, người ký «Đạt» tay. Ở ca gốc (crm
`va-tro-ly-okr-sau-thu` E14) một lỗi thật lọt qua đúng khe này.

## 2. Ba mảnh, theo thứ tự lực

### 2.1 Răng ở bước sinh args S4 (vật chính)

`feature-loop/scripts/s4-args.mjs` là chỗ mọi lượt chấm S4 ở mọi kho đi qua và
đã có răng cùng hình (`resolveJudgmentInput`: input vắng → exit 2 gọi tên, không
sinh tệp). Thêm một nhánh trong CÙNG vòng lặp eval, chạy TRƯỚC khi giải
`inputs`: eval `executor: judgment` có `question` hỏi diff của lượt hoặc bảo
chạy lệnh → `die(...)` exit 2, nêu id eval + đoạn khớp, KHÔNG sinh tệp, thông
điệp nói đúng hai lối ra:

- (a) vế đo được bằng lệnh → eval `script`/`test` của kho đo TRẠNG THÁI cây,
  không đo diff (tiền lệ JR11a: sau gộp diff rỗng, phép đo xanh rỗng), và phải
  xanh trên cây hiện tại trước khi nhận (eval máy đỏ → REJECT, baseline không
  cứu);
- (b) vế cần phán → viết lại câu hỏi về TỆP có trong `inputs` (tệp mã nguồn
  được, diff/patch không).

Vì sao CHẶN chứ không «UNCERTAIN cơ học, 0 giám khảo»: không có hồ sơ cũ nào cần
đường đọc-cũ ở đây (răng chạy lúc sinh args, hồ sơ đã ký không chạy lại
s4-args), và UNCERTAIN cơ học vẫn đẩy một mục không căn cứ lên Cổng Bằng chứng —
trạm thu phí. Chặn trước lượt chấm thì máy sửa, 0 người, 0 giám khảo.

Răng KHÔNG ở `eval-coverage-lint.js`: lint không nằm trên đường feature-loop
(finding §10.1) — W9 ở đó không bao giờ nổ ở crm, nơi sinh 9/17 ca.

**Bộ dò — một nguồn.** Module mới `feature-loop/scripts/lib/hoi-ngoai-inputs.mjs`
mang hai khuôn `DIFF_REQ` · `CMD_REQ` chép NGUYÊN VĂN từ script quét của finding
(commit `a2db0fad`) cùng hàm `hoiNgoaiInputs(question)`. s4-args gọi hàm; script
quét của finding đổi sang `require` module này — từ nay lệnh quét trong finding
là lệnh đếm ngưỡng của chính bộ dò đang ship, không phải bản sao trôi.

Một khác biệt duy nhất so với script quét: câu hỏi được gộp khoảng trắng
(`\s+` → một dấu cách) trước khi dò. `question: >` của YAML là khối GẤP — xuống
dòng trong nguồn là dấu cách trong nghĩa; không gộp thì «diff của⏎lượt» lọt vì
khuôn có `[^.\n]`. Đo lại trên 434 eval judgment của 10 kho: bản gộp bắt đúng
17 ca như bản gốc, không thêm, không mất (lệnh và số ở hồ sơ, decisions.jsonl).

Không miễn khi `inputs` có tệp tên «diff» (finding §10.3): tệp diff làm tay là
lịch sử đóng băng — P3 băm `inputs` sẽ mang phán quyết cũ sang mã mới.

**Phạm vi chạy.** Mọi eval judgment có mặt trong tệp args. Bộ lọc `status: not-run`
của s4-args chỉ loại ô MÁY (`test`/`script` — `machineEvalIdsSkipped`); một judgment
tự khai not-run vẫn tới hội đồng, nên răng vẫn chặn nó — đúng, vì nó vẫn tốn ba
giám khảo. s4-args dừng ở eval vi phạm ĐẦU TIÊN (cùng nếp mọi `die` trong tệp);
script quét báo mọi ca.

### 2.2 Bên viết: chọn người chấm theo TỪNG VẾ

`skills/acceptance/references/eval-executors.md` (bảng executor dòng judgment,
luật chọn số 4, đoạn `inputs`), `skills/acceptance/SKILL.md` Phase 2 (bước 2 +
3b), dòng evals.yaml ở S1 của `feature-loop/skills/feature-loop/SKILL.md`. Nội
dung một luật, bốn lối:

| Vế của AC | Người chấm |
|---|---|
| một lệnh đọc được | `script`/`test` của kho — đo trạng thái cây |
| chỉ thấy trên màn đang chạy | `ui-check` |
| cần cân với ý định trên một tệp | `judgment` với đúng tệp đó trong `inputs` |
| không ai ở đây đọc được (prod, khoá thật, người dùng thật) | khai giới hạn ngay lúc viết |

Dấu `(judgment)` của cả AC không đè «executor máy nhất»: một AC gộp bảy vế grep
được với một vế cần phán thì tách eval. Hội đồng đọc TRẠNG THÁI, không đọc LỊCH
SỬ: diff/patch không bao giờ là input. Ba bẫy của script luật kho: đo diff →
xanh rỗng sau gộp (JR11a, finding §10.2); đo trạng thái → đỏ oan khi cây đã bẩn
→ thu phạm vi quét về `paths:` của vòng, script là vật của kho (finding §10.2);
thước dùng chung không chạy được ở nhánh khác — coi thư mục của riêng một lượt
là tiền đề, ca gài tiêm vào tệp chỉ có ở nhánh sinh thước (crm
`scripts/luat-kho/do-cay.mjs` 39779f90: chiều đỏ sống 6/20 ở nhánh khác) → thư
mục vắng thì im hoặc khai có tên, ca gài tự dựng tệp mục tiêu trong bản sao.
Bẫy thứ ba do phiên phối hợp báo về 01/10, chỉ thêm vào tài liệu, không răng.

### 2.3 Bên chấm và bên phản biện nói cùng sự thật nền

- `skills/acceptance/references/judge-personas.md`: «không nhận implementation
  diff» giữ nguyên, thêm câu trạng-thái-vs-lịch-sử (tệp mã nguồn trong `inputs`
  hợp lệ — đó là trạng thái; diff là lịch sử); thay câu dặn chết «>50 %
  UNCERTAIN → sửa contract ở Gate 1 lần sau» bằng con trỏ tới răng 2.1.
- Câu hỏi chéo bắt buộc của gap-probe (feature-loop SKILL S1#7, ý (4)) thêm một
  ý: eval judgment nào hỏi điều không nằm trong tệp của chính nó — kèm sự thật
  nền «hội đồng chỉ đọc đúng `inputs`, không diff, không lệnh». Bắt ở Cổng Phạm
  vi; răng 2.1 là lưới nếu lọt.

### 2.4 Tiền đề của răng do máy giữ

Răng đúng chỉ khi hội đồng còn mù diff. Lời giao việc ấy (`acceptance-verify.js`,
dòng dựng prompt judge) hôm nay không ca nào ghim. Thêm MỘT ca vào lưới thường
trực: lời giao việc còn «KHONG doc diff» và «CHI duoc doc dung cac file liet
ke» — ai nới hội đồng mai sau thì suite đỏ, chỉ về răng này để gỡ cùng lúc.
Không sửa `acceptance-verify.js`.

## 3. Phép đo

Lưới thường trực: `tests/scripts/s4-args-judgment-inputs.test.mjs` thêm nhóm
JI7–JI12 trên CÙNG harness (kho giả code-sinh, `--only <nhóm>`). Răng hồ sơ
`_acceptance/thuoc-biet-truoc-khong-phan-duoc/rang.sh`: mỗi chân chạy một nhóm
trên cây thật (đối chứng dương) rồi trên bản sao trọn cây đã tiêm một đột biến
(chiều đỏ: exit ≠ 0 VÀ dòng FAIL ghim); mũi tiêm chứng nó đổi được đúng một chỗ.

| Đột biến | Phá gì | Nhóm phải đỏ |
|---|---|---|
| bo-rang | xoá lời gọi bộ dò trong s4-args | JI7, JI8, JI9 |
| mien-ten-diff | miễn khi `inputs` có tệp tên chứa «diff» | JI9 |
| khong-gop | bỏ gộp khoảng trắng trong module | JI7 (ô gấp dòng) |
| bo-loi-b | thông điệp mất lối (b) | JI7 |
| do-rong | `DIFF_REQ` thành `/\bdiff\b/i` | JI10 |
| chay-khong-backtick | `CMD_REQ` bỏ điều kiện backtick | JI10 |
| noi-hoi-dong | lời giao việc judge mất «KHONG doc diff» | JI11 |
| noi-hoi-dong-2 | lời giao việc judge mất «CHI duoc doc dung cac file liet ke» | JI11 |
| ban-sao-khuon | dán lại khuôn «hỏi diff» tại chỗ vào script quét của bản ghi phát hiện | JI12 |
| ban-sao-lenh | dán một bản khuôn «bảo chạy lệnh» vào `scripts/eval-coverage-lint.js` | JI12 |

Nguyên văn từng phép thay thế (trước → sau) nằm ở biến `*_B` / `*_A` của
`rang.sh` — một nguồn; bảng này là chiếu của nó.

Tiền đề của đột biến khong-gop: bộ đọc `parseEvals` (lib/eval-yaml.cjs) nối dòng
của khối `question: >` bằng `\n` chứ không gấp thành dấu cách — JI7 assert tiền
đề này trước khi dựa vào nó; bộ đọc đổi sang gấp chuẩn YAML thì JI7 đỏ có tên và
đột biến phải đo lại.

JI12 dò mảnh đặc trưng của CẢ hai khuôn trên mọi thư mục nguồn của kit
(`feature-loop/`, `scripts/`, `lib/`, `hooks/`, `skills/`, `commands/`,
`docs/findings/assets/`), trừ `tests/` và `_acceptance/`.

## 4. Không làm (đuôi — ghi Notes kèm ngưỡng)

W9 ở lint · làn trên thẻ Cổng Phạm vi · bộ đọc khoan dung ở lượt chấm · ô «chỉ
người làm được» · sửa sót `\b` trước chữ đầu có dấu («Đọc diff» không có từ khoá
kèm) · cho hội đồng đọc diff · mọi sửa ở crm.

## 5. Tier

Chạm `feature-loop/scripts/**`, `skills/**`, `feature-loop/skills/**`, `tests/**`,
`docs/**`, `_acceptance/**`. Không chạm `hooks/**`, `lib/**`,
`scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` → T2.
