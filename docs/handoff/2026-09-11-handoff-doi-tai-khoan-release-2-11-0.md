# Handoff 11/09/2026 — đổi TÀI KHOẢN giữa vòng mốc 2.11.0, đang đứng ở Cổng Bằng chứng

*Người bàn giao: phiên chạy trọn vòng `release-2-11-0` từ S0 tới lượt chấm 4 ·
Người nhận: phiên đầu tiên trên tài khoản mới.*

> **Đổi TÀI KHOẢN, cùng máy.** Trí nhớ dự án ở
> `~/.claude/projects/-Users-manh-macmini-dev-acceptance-gate-kit/memory/` là thư mục
> thường trên máy này — nếu tài khoản mới dùng cùng `$HOME` thì nó **đi theo**; nếu khác
> `$HOME` thì **không**. Mục 1 dưới đây chép lại phần không truy được từ kho.

---

## 0. Một câu

Vòng **CHƯA ký, CHƯA ship**. Đang đứng ở **Cổng Bằng chứng** sau lượt chấm 4
(`PENDING-JUDGMENT`, 0 eval đỏ). Máy đã khuyến nghị **lượt 5 phạm vi hẹp 4 mục**; owner
chưa trả lời. Việc đầu tiên của phiên nhận: **đọc mục 4, rồi hỏi owner đúng một câu** —
không tự ký, không tự sửa.

---

## 1. Toạ độ

| | |
|---|---|
| Worktree | `/Users/manh-macmini/dev/acceptance-gate-kit/.claude/worktrees/gracious-shannon-0fb94f` |
| Nhánh | `claude/gracious-shannon-0fb94f` |
| HEAD | `e0ad2d3e` · cây **sạch** · đi trước `origin/main` **31 commit** |
| `origin/main` | `d1d36479` — **không nhúc nhích** suốt vòng, 0 PR mở ở kho kit |
| Hồ sơ | `_acceptance/release-2-11-0/` — `status: verified`, **12 AC · 17 eval · 25 dòng sổ** |
| `verified_commit` | `cd8b3403` (lượt chấm 4) |

**Chưa push, chưa mở PR.** Không có tiến trình nền nào đang chạy.

---

## 2. Vòng này là gì

Mốc phát hành **2.11.0** (`acceptance-gate` + `feature-loop` 2.11.0; `diagram-design` giữ
**2.7.0** có bằng chứng). Cửa sổ `04069351` → `d1d36479`, 31 commit, **một vòng** (#165).

Owner gọi tên 10/09 «Đồng ý lối 1»: **vá TRONG mốc** lỗ xanh-giả của bộ giải cấu hình,
theo tiền lệ 2.10.0 đã mở. Vá chạm `lib/**` nên hồ sơ mốc lên **T3**.

**Lỗ gốc:** `resolveConfigKey` bóc một nháy đầu và một nháy cuối **vô điều kiện**, nên
`pytest -q -k 'a or b'` mất dấu đóng → `bash -c` **thoát 2** → luật `expected_exit` (cấm
97/127, KHÔNG cấm 2) đọc mã 2 của SHELL thành «giới hạn đã khai» của CÔNG CỤ → **PASS**.

---

## 3. Đã làm — và ba lần đổi khuôn

### Khuôn cuối (đường A, owner chọn 11/09)

MỘT cổng tách token `parseFlowValue(raw)` trong `lib/evidence-core.cjs`, trả
`{kind:'seq', items, text, value}` hoặc `{kind:'scalar', value, text}`. **CHÍN đường**
tiêu thụ: `resolveConfigKey` lá · `resolveConfigList` inline + khối · `s4-args` list-field
/ list-khối / id / models · `carry-plan` paths + cmd.

**Vì sao phải đổi khuôn:** hai lượt vá đầu cùng thất bại MỘT cơ chế — nhận-biết-vỏ gắn
vào một bước phẫu-thuật-chuỗi, bước kế bên trong cùng ống dẫn lại thiếu. STOP-PATCHING nổ
ở lượt 2; hội đồng (skill `council`) **3/3** chọn đổi khuôn.

### Răng: `tests/scripts/bo-giai-nhay.test.mjs`, **9 chân**

| | |
|---|---|
| BG1 | ma trận 10 hình dạng qua `resolveConfigKey` |
| BG2 | quan hệ escape, so BẰNG trọn chuỗi |
| BG3 | round-trip chuỗi 4 bước qua `s4-args.mjs` **THẬT**; công cụ giả ghi dấu vết ra đĩa để phân biệt «công cụ chạy và trả 2» với «shell vỡ cú pháp và trả 2» |
| BG4 | ma trận **hành vi** 13 khẳng định; ba hình dạng lấy NGUYÊN VĂN từ crm/artifact-platform |
| BG5 | chiều đỏ trên bản sao `git archive HEAD` TRỌN cây, 3 đột biến, đối chứng dương + so BĂM |
| BG6 | ranh giới: 9 đường neo theo CHỖ GỌI + 5 hàm cố-ý-giữ + phép đếm tổng |
| BG7 | cắt chú thích/tách phẩy nhận biết vỏ, **18** khẳng định + chân «chạy được» bắt thẳng mã 2 |
| BG8 | **hoàn nguyên ĐÚNG MỘT đường** rồi đòi chân của đường đó ĐỎ — 7 đột biến |
| BG9 | `carry-plan` và `s4-args` đồng ý về `paths`, đo bằng **hệ quả** (quyết định carry) |

`BG_NO_RED=1` chống đệ quy · `BG_ONLY=<chân>` để BG8 chấm rẻ · bảng `DUONG` 9 dòng là
**một nguồn** cho BG5/BG6/BG8.

### Bán kính, đo bằng chính bộ giải đã vá

**28 chỗ / 7 kho tiêu thụ** — oneflow 19 · artifact-platform 5 · crm 4 · bốn kho khác 0 ·
**kit 0**. Đo lại bằng khuôn cuối: **không đổi**. `artifact-platform` đang mang khoá
`executors.script.uicheck_avatar_pool` sinh đúng chuỗi xanh-giả hôm nay.

### Chuỗi bốn bước — ĐÃ ĐÓNG, đo lại trên HEAD

| Hình dạng | cũ | mới |
|---|---|---|
| `pytest -q -k 'a or b'` | `bash` **exit 2** ← vector | **exit 127** (mã của công cụ; 127 lại NẰM TRONG `EXPECTED_EXIT_BANNED` nên không rửa được) |
| `"… --with \"x==1\" …"` | sai argv, âm thầm exit 0 | argv đúng |
| `"echo a # b"` | xén thành `echo a` | nguyên vẹn |
| `["click #submit", "then b"]` | `['"click']` | đúng 2 item |

---

## 4. ⚠ VIỆC CỦA PHIÊN NHẬN — đọc kỹ mục này

Lượt chấm 4 trả **PENDING-JUDGMENT, 0 eval đỏ**, nhưng **11 phát hiện xác nhận**
(3 trong hợp đồng, 8 ngoài). Máy đã trình Cổng Bằng chứng và **khuyến nghị lượt 5 phạm vi
hẹp 4 mục**; owner **chưa trả lời**. Đừng ký thay, đừng tự mở lượt 5.

### 4.1 Phát hiện quan trọng nhất — XANH-GIẢ SỐNG, đã kiểm chứng tại chỗ

`stripYamlComment` **không cắt** một giá trị CHỈ LÀ chú thích: nó `trim()` trước rồi mới
đòi khoảng trắng đứng trước `#`.

```
executors.script.chua_dien:   # TODO điền lệnh thật
→ resolveConfigKey trả "# TODO điền lệnh thật"   (truthy → qua lưới `if (!val) die`)
→ bash -c '# TODO…'  → exit 0
→ eval ghi PASS mà KHÔNG chạy gì
```

Nó nằm **BÊN TRONG cổng chung**. Và `lib/eval-yaml.cjs` `stripComment` — tự khai là «MỘT
nguồn cho mọi bộ đọc dòng» — trả `""` cho cùng đầu vào: hai hàm cùng xưng một nguồn, hai
kết quả.

**Người soi ghi chú trung thực:** mệnh đề CŨ cũng sai y hệt, nên là lỗi **mang sang**,
không phải mới sinh — nhưng dòng đó được viết lại trong vòng này và hợp đồng mới tuyên sở
hữu ca đó. Phân loại xếp nó **ngoài** hợp đồng; phiên bàn giao **không đồng ý** với phân
loại đó và đã nói rõ với owner.

**Vá đề xuất:** `s.replace(/(^|\s)#.*$/, '').trim()` — khớp `eval-yaml`; hoặc nhập thẳng
`stripComment` của `eval-yaml` để thật sự có một nguồn.

### 4.2 Ba mục TRONG hợp đồng

1. **`feature_loop.models` vẫn cắt bằng `(\S+)`** (`s4-args.mjs:219`) — `executor: "sonnet 4.6"`
   → `"sonnet` (giữ nháy mở). Đường thi-hành thứ 7, fail-open trong chính phạm vi đã khai.
   Vá: bắt `(.*)$` rồi để cổng chung cắt, giống bốn chỗ kia.
2. **`BG8_MUTANTS = MUT_ALL.length` là HẰNG-ĐÚNG** — hằng số suy TỪ chính danh sách nên
   phép kiểm không bao giờ nổ. **Lớp hằng-đúng, lần thứ tư trong vòng.**
3. **Đường 9 (`carry-plan cmd`)** chỉ đo bằng chuỗi-có-mặt, chưa có ca hành vi.

### 4.3 Năm mục NGOÀI hợp đồng còn lại

- **`rang-moc.sh --chan` không giá trị → TREO VÔ HẠN** (`shift 2` khi `$# < 2` không shift
  gì, `set -e` không bật). Không mã, không thông điệp. Vá:
  `--chan) [ $# -ge 2 ] || { echo 'thieu gia tri' >&2; exit 2; }; CHAN="$2"; shift 2 ;;`
- **Manifest khai SAI cơ chế** — cả hai `plugin.json` nói `unquoteScalar` là cổng duy
  nhất, mã gác bằng `parseFlowValue`; và mang con số `+258/−16` mà chính hồ sơ đã ghi là
  đo sai (tại HEAD là `388/17`). **Hai thứ này ship tới 7 kho tiêu thụ.**
- `.gitignore` mẫu `s4-args.json` không neo, trong khi 2 tệp cùng tên đang được track.
- `carry-plan readers()` cache bộ đọc đầu tiên ở biến module, bỏ qua `agRoot` lần gọi sau.
- Lời khai E10 mâu thuẫn mã (`--ag-root` là TÙY CHỌN, không bắt buộc).

### 4.4 Ba lối máy đã trình owner

```
/feature-loop:feature-loop release-2-11-0 lượt 5     ← khuyến nghị (vá 4 mục: 4.1 + models + BG8_MUTANTS + manifest)
/feature-loop:feature-loop release-2-11-0 ký          ← 11 phát hiện vào Known limits
/feature-loop:feature-loop release-2-11-0 thu phạm vi ← rút rang-moc/AC-7/AC-11, ship phần bộ giải
```

**Chữ quyết là của owner. Máy KHÔNG BAO GIỜ tự nói «Ký» (ADR 0002).**

---

## 5. Ba dòng số (luật (c)) — ĐẾM TAY, tính tới lời mời Cổng Bằng chứng

| | Số | Trần |
|---|---|---|
| làm-xong → quyết-được | **chưa chốt** (chưa ký) — điền ở làn ghim lại | — |
| lượt chấm | **4** | 3 (owner mở lượt 4) |
| gọi người | **5 thiết kế + 1 ngoài = 6** | mốc ≤1 · T3 ≤4 |
| hạ tầng đốt | **3** | — |

Vòng #165 trong cửa sổ: **184′ · 1 lượt chấm · 4/0 lượt gọi người · 0 bị đốt** — vòng rẻ
nhất kit từng đo.

**Lượt gọi người, kể tên:** Cổng Phạm vi · Gate 1.5 · STOP-PATCHING · escalate-hết-trần ·
Cổng Bằng chứng *(thiết kế)* + «nâng phạm vi và tiếp tục» *(NGOÀI — nơi thiết kế dành cho
quyết định đó là Cổng Bằng chứng; máy trình sớm nên tự tạo thêm một điểm quyết định; ghi
NGOÀI dù nó tiết kiệm việc)*.

**Hạ tầng đốt = 3:** 1 lỗi vận chuyển args (máy gõ tay bản `toolKillRule` rút gọn, mất
khối marker → BLOCKED) + **2 lần tool-kill** ở `E8c`. Lượt 4 là lần đầu `E8c` không bị
cắt trong bốn lượt.

---

## 6. Nhát cắt kế đã gọi tên (3)

1. **`TOOL-KILL-RULE` cần RĂNG** — ba mốc liên tiếp bị đốt; agent CÓ luật nguyên văn trong
   prompt và vẫn khai `exit 1` ba lần. Hai lối: tín hiệu **cấu trúc** từ harness, hoặc
   **một lượt chạy-lại-xác-nhận** cho eval đỏ trước khi verdict được ghi.
   *Lối rẻ tạm thời máy đã soạn nhưng KHÔNG tự làm* (chạm khoá dùng chung):
   bọc `executors.test.plugins` bằng `set -o pipefail` + lọc `FAIL|^Results:` + `tail`,
   giữ nguyên mã thoát, chỉ chặn đầu ra khỏi bị cắt — cùng khuôn `E6` đang dùng cho P200.
2. **Mốc phát hành T3 không đạt ≤1 lượt gọi người về mặt CẤU TRÚC** — tách bản vá khỏi hồ
   sơ mốc (mốc về T2 → làn V → ≤1), hoặc đọc trần mốc theo «= số cổng thiết kế».
3. **Chuyển tiếp từ 2.10.0, vẫn treo:** phiên nghiệm thu **GỘP** 10 hồ sơ chờ Cổng Giá trị.

**Điểm Critic của hội đồng nêu, CHƯA đóng:** tokenizer không đóng được chuỗi — chuỗi đóng
ở **luật nhận mã thoát đã khai**; mọi cái chết cấp shell (127, 126, 1) trùng số đã khai vẫn
đọc thành PASS. Nháy chỉ là MỘT cửa vào. Đó là hợp đồng vòng #165, ứng viên cửa sổ kế.

---

## 7. Sau khi ký (nếu owner ký) — trình tự bắt buộc

1. Ghim lại nếu cây đã đổi: `node feature-loop/scripts/repin-lane.mjs --root . --ag-root . --slug release-2-11-0 --reason "<1 dòng>" --write`
2. Mở PR; **pre-merge TRƯỚC push**: `bash scripts/pre-merge-check.sh . --base origin/main --recheck-all`
3. CI xanh → **owner bấm merge** (khó-đảo, không phải việc máy).
4. Chiến dịch ghim lại theo mốc; cài 2.11.0 lên máy
   (`claude plugin marketplace update acceptance-gate-kit` rồi `plugin update` hai plugin;
   kiểm `diff -rq` cache với kho phải RỖNG và với bản cũ phải KHÁC).
5. Rollout 7 kho tiêu thụ — **9 mục `INIT-CI-COPY-LIST`** phải chép lại. Sau khi chép,
   oneflow **hết fork** ở `lib/evidence-core.cjs`.
6. Hai PR nháp 2.10.0 vẫn treo, **vòng này KHÔNG chạm**:
   `phanlemanh/OneFlow#116` · `phanlemanh/crm#35` (base `onehub`).

---

## 8. Bẫy đã dẫm — đừng dẫm lại

- **Hook `block-no-verify` chặn mọi lệnh Bash có `git commit` kèm một cờ ` -n` rời** — kể
  cả `grep -n`, `sed -n`, `head -n`. Tách lệnh ra.
- **Backtick trong `git commit -m "…"`** bị zsh thực thi và nuốt mất chữ. Dùng heredoc
  `-F -` với `<<'MSG'`.
- **`git archive HEAD`** lấy bản ĐÃ COMMIT — BG5/BG8 fail-CLOSED nếu tệp ca ở HEAD khác
  bản đang chạy. **Commit trước khi đo chiều đỏ.**
- **`git diff-tree` cần `--root`** với commit gốc, không thì trả rỗng và chẩn đoán sai.
- **Chạy suite song song với lúc đang sửa file** cho kết quả rác — hai lần trong vòng này.
- **Escape nhiều tầng trong `printf`/heredoc của shell** đã tạo 2 fixture sai; viết fixture
  ra FILE rồi đọc, đừng nhồi qua nhiều tầng nháy.
- **Vòng lặp `for k in … ; do` với `\$k` escape sai** cho một lượt suite «chạy» mà không
  chạy gì, exit 0. Luôn đọc output, đừng tin mã thoát.
- **Đọc lại tệp args ngay trước khi dispatch** — nếp này bắt được **bốn** lần lời khai
  `expected` trôi khỏi mã.
- **`S4-ARGS-CLAUSE`: TUYỆT ĐỐI không gõ tay args.** Vi phạm một lần, mất trọn một lượt.

---

## 9. Bài học đáng mang sang vòng khác

**Lớp «bên VIẾT trôi khỏi bên ĐỌC» nổ HAI lần trong chính bộ răng của vòng** — ba chân
BG5/BG6/BG8 giữ ba bản cùng danh sách neo. Đó đúng là lớp mà đường A đang đi giải cho mã
sản phẩm, tái diễn bên trong thước đo. Nay hợp nhất về bảng `DUONG`.

**Lớp «hằng-đúng» nổ BỐN lần**: hai bản đối chứng dương của `rang-moc` + `BG8_MUTANTS` +
(bản đầu) phép đếm của BG6. Nghi thức rút ra: mỗi khi viết một đối chứng dương, hỏi
**«điều gì phải xảy ra để chân này ĐỎ?»** — trả lời không được thì nó là trang trí.

**Chiều đỏ bắt được BỐN lỗi của chính bản vá** mà không lần nào suite xanh thấy: nháy
giữa-chừng, xoá vật vẫn PASS, neo trôi, và `.value` undefined.

---

## 10. Đọc thêm

`_acceptance/release-2-11-0/` — `contract.md` (12 AC + Coverage + ba dòng số + bảng
vendored + lớp lỗi tái phát + nhát cắt) · `evals.yaml` (17) · `decisions.jsonl` (**25
dòng, đọc hết** — mọi quyết định đều có lý do) · `gap-probe.md` · `evidence-report.md` ·
`review-findings.md` (**11 phát hiện lượt 4**) · `figures/` (2 hình) ·
`docs/superpowers/specs/2026-09-10-release-2-11-0-design.md` ·
`docs/superpowers/plans/2026-09-10-release-2-11-0.md`.
