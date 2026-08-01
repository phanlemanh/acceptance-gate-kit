# Design — Luật ngôn ngữ mặt người: cưỡng chế bằng file tham chiếu + khuôn trình bày

**Slug:** `ngon-ngu-mat-nguoi` · **Tier:** T2 · **Ngày:** 2026-08-01
**Nguồn luật:** `docs/specs/workflow-v2-spec.md` §4.1 (quyết Manh 01/08) — spec là
NGUỒN, thiết kế này chỉ là bản thi hành. Không phát minh lại luật.

## 1. Vì sao có feature này (nguyên nhân thật)

Bảng tóm tắt kế hoạch của một feature **đang chạy** được trình cho owner bằng
ngôn ngữ máy: chủ ngữ là tên file và tên biến, nhiều việc nhồi vào một ô ngăn
bằng dấu chấm giữa, mã số (`AC-7`, `E3`) đứng trơ không kèm nghĩa. Owner không
duyệt được ở dạng đó — không phải vì thiếu thông tin, mà vì thông tin được xếp
theo trục của máy chứ không theo trục của người quyết.

Luật đã thành văn ở spec §4.1 từ 01/08. **Nhưng văn bản luật không tự cưỡng chế
được**: nó nằm trong một file spec mà không bước sinh-đầu-ra nào bắt buộc đọc.
Đúng tiền lệ đã khai tử ceremony design: *"skill chờ được gọi sẽ chết lúc bận"*.

Feature này chuyển luật từ **trạng thái thành văn** sang **trạng thái nhúng vào
chỗ nghẽn đầu ra**.

## 2. Chân ngành (outside view)

Đối chiếu với thực hành có tên cùng loại — "style guide cho ngôn ngữ hướng
người dùng, thi hành bằng công cụ chứ không bằng trí nhớ":

| Chuẩn / công cụ có tên | Cái nó dạy cho thiết kế này |
|---|---|
| **Vale** (prose linter) | Luật sống thành **file cấu hình versioned** (`.vale.ini` + `styles/`) được nạp MỖI lần chạy, không phải một trang wiki. Và Vale luôn có **scope selector** — luật văn xuôi không được áp lên code block. |
| **Google developer documentation style guide** | Mỗi luật đi kèm cặp **Recommended / Not recommended** cụ thể. Luật trừu tượng không có ví dụ thì mỗi người diễn giải một kiểu. |
| **Microsoft Writing Style Guide** | Có **word list** (từ điển) đi kèm; luật "đừng dùng biệt ngữ" chỉ thi hành được khi chỉ được đích danh danh sách từ hợp lệ sống ở đâu. |
| **Census + ratchet của design system** | Nấc đo mật độ + siết dần. Spec §4.1 đã nêu nấc này — feature này **KHÔNG làm** (xem §7 Descope). |

Hai điều chân ngành lộ ra mà đề bài chưa nêu, và đã được đưa vào phạm vi:

1. **Phải viết rõ chỗ KHÔNG áp luật.** Vale không cho luật văn xuôi chạm code
   block vì lý do sống còn. Ở đây: một agent đọc "chủ ngữ là người dùng, không
   phải file" rồi đi "dịch cho dễ đọc" một khoá frontmatter hay một `id:` trong
   `evals.yaml` là làm hỏng hợp đồng máy. Spec §4.1 có nêu phạm vi loại trừ —
   file tham chiếu PHẢI chép nguyên vế đó, không được rơi.
2. **N6 phải chỉ đích danh từ điển.** "Không dùng biệt ngữ chưa có trong từ
   điển sản phẩm" là luật rỗng nếu không nói từ điển nằm ở đâu.

## 3. Quét không gian AC (morphological scan — bước CT-S)

**Trục** (dựng từ B1, preset `test-matrix` không khớp nên tự dựng):

- **Trục A — vật được giao:** file tham chiếu | chỗ trỏ + mệnh lệnh nạp | khuôn
  bảng có marker | quyền trả-lại tại cổng | đóng gói (mirror 2 harness)
  [thước CE: spec §4.1 đoạn "Cưỡng chế", liệt kê đích danh 5 thứ này]
- **Trục B — thuộc tính bị hỏng:** có mặt | đủ nội dung | nguồn duy nhất | nối
  đúng (trỏ vào vật thật tồn tại) | parity hai harness | tự tuân luật
  [thước CE: bất biến CLAUDE.md (đối-chứng-dương, thước-gắn-vào-vật) + case
  P79/P82/P85 đã chạy trong `tests/plugins/run-tests.sh`]
- **Trục C — điểm nghẽn cưỡng chế:** lúc tác giả kit viết (CI) | lúc agent sinh
  đầu ra (runtime) | lúc người duyệt tại cổng
  [thước CE: spec §4.1 câu "luật nhúng vào chỗ nghẽn đầu ra thì không có đường vòng"]

5 × 6 × 3 = 90 ô; quét theo lát cắt trục A.

**Core** (thành AC-1…AC-14):

1. `file × có mặt + đủ nội dung` — không có file thì mọi thứ khác vô nghĩa.
2. `file × phạm vi loại trừ` — [NGÀNH: Vale scope selector] chống hỏng mặt máy.
3. `file × N6 chỉ đích từ điển` — [NGÀNH: MS word list] chống luật rỗng.
4. `chỗ trỏ × có mặt` — 8 điểm, cả hai harness.
5. `chỗ trỏ × nối đúng` — đường dẫn phải trỏ vào file THẬT tồn tại. Đây là lớp
   lỗi "thước không gắn vào vật": một pointer trỏ file chết vẫn grep xanh.
6. `luật × nguồn duy nhất` — chỗ trỏ không được chép lại N1–N6.
7. `khuôn × marker + đúng 3 cột` — một chỗ, có marker.
8. `khuôn × round-trip` — rút từ writer, đọc bằng reader bảng.
9. `khuôn × nguồn duy nhất` — tên 3 cột chỉ xuất hiện ở đúng một file nguồn.
10. `quyền trả-lại × có mặt + ghi sổ` — nêu trong lệnh dựng thẻ, 2 harness.
11. `từ điển × có mặt` — term mới vào `CONTEXT.md`, nếu không thì kit tự phạm N6.
12. `đóng gói × mirror` — `sync --check` xanh.

**Later** (park, có tên):

- `luật × tự tuân` đo bằng máy — đếm mật độ token kỹ thuật + ratchet. Chờ đợt
  nâng bộ thẻ (descope có tên, §7).
- `chỗ trỏ × runtime` — chứng minh agent THẬT SỰ đọc và tuân. Chỉ đo được bằng
  phiên chạy thật (pilot), không đo được trong CI. Ghi Known limit (§8).

**Never:**

- Đổi `gate-card.js` để nó tự sinh câu chữ mặt người — thẻ là lớp trình bày,
  câu chữ do người-viết-prompt sinh; máy sinh câu chữ là mở một seam sai.
- Áp luật lên mặt máy — đã là vế loại trừ của chính luật.

**Cross-cutting áp mọi ô Core:** mỗi phép đo có **đối chứng dương** (bản nguyên
vẹn phải XANH trước) + **ghim đúng thông điệp** (không chỉ mã thoát); fixture
do **code sinh trong chính lần chạy** (rút từ marker, không viết tay); mọi
đường dẫn **suy từ `$ROOT`**, không hardcode checkout của tác giả.

## 4. Kiến trúc

Một file nguồn, tám chỗ trỏ, không bản sao nội dung.

```
skills/acceptance/references/human-facing-language.md   ← BẢN THI HÀNH
  ├─ Phạm vi áp / KHÔNG áp   (vế loại trừ mặt máy)
  ├─ <<<HFL-LAW-TABLE … >>>            ← bảng 6 luật, khớp từng ký tự với spec §4.1
  ├─ Dòng vận hành cho N6: từ điển sống ở CONTEXT.md   (NGOÀI bảng luật)
  ├─ Hai phép thử: Xoá-tên-máy · Người-thứ-ba
  ├─ Bảng ví dụ TRƯỚC/SAU (mỗi luật ≥1 cặp)
  ├─ <<<PLAN-SUMMARY-TABLE-TEMPLATE … >>>   ← khuôn 3 cột, một chỗ, có marker
  ├─ <<<HFL-GLOSSARY-TERMS … >>>       ← từ feature này thêm vào từ điển
  └─ Quyền trả lại tại cổng + cách ghi sổ

trỏ tới (mệnh lệnh nạp, KHÔNG chép nội dung):
  Claude: commands/acceptance-card.md
          commands/acceptance-report.md
          commands/acceptance-status.md
          feature-loop/skills/feature-loop/SKILL.md
  Codex:  codex/acceptance-gate/skills/acceptance-card/SKILL.md
          codex/acceptance-gate/skills/acceptance-report/SKILL.md
          codex/acceptance-gate/skills/acceptance-status/SKILL.md
          codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md
```

**Vì sao file tham chiếu đặt trong `skills/acceptance/references/`:** `sync-plugin-packages.sh`
rsync trọn `skills/` vào gói Codex, nên đặt một chỗ là CẢ HAI harness đều có
file thật để trỏ tới. Đặt ở `docs/` thì gói Codex không có nó và 4 pointer bên
Codex trỏ vào hư không.

**Dạng đường dẫn khác nhau theo gói — và vì sao phải đo (P0 của gap-probe).**
Sáu chỗ trỏ nằm CÙNG gói với file tham chiếu, hai chỗ thì không:

| Chỗ trỏ | Gói của nó | Dạng đường dẫn đúng |
|---|---|---|
| 3 lệnh acceptance bản Claude | acceptance-gate (gốc kho) | `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md` |
| 3 skill acceptance bản Codex | acceptance-gate | `${PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md` |
| 2 SKILL vòng lặp tính năng | **feature-loop / feature-loop-codex — gói KHÔNG chứa file tham chiếu** | phải đi qua `resolve-plugin.mjs --plugin acceptance-gate --require skills/acceptance/references/human-facing-language.md` |

Ghép thẳng gốc gói ở hai dòng cuối là con trỏ chết: trên cây nguồn nó vẫn "tồn
tại" (vì cây nguồn có tất cả), mirror vẫn khớp byte, nên MỌI phép đo cũ vẫn
xanh trong khi nửa phần cưỡng chế đã chết lúc giao. Vì vậy có AC-6 đo **trong
gói đã đóng**, tách khỏi AC-5 đo **trên cây nguồn**.

**Luật sống ở đúng hai chỗ, không phải một.** `docs/specs/workflow-v2-spec.md`
§4.1 là bản ghi quyết định (có lịch sử, có ngày, có người quyết); file tham
chiếu là bản thi hành (được nạp lúc chạy). Xoá một trong hai đều sai. Nên bảng
sáu luật bọc marker ở cả hai nơi và test giữ chúng **khớp từng ký tự** — đúng
tiền lệ `GOAL-TEMPLATE` (SKILL là bản runtime, GUIDE là bản người đọc, case P85
giữ khớp). Phần "từ điển sống ở đâu" cố ý nằm NGOÀI bảng luật, để bổ sung vận
hành không làm hai bản lệch nhau.

**Khuôn 3 cột** (tên cột là literal đã chốt, chỉ tồn tại ở file nguồn):

| Người dùng thấy gì khác | Đụng đâu | Phục vụ tiêu chí |
|---|---|---|
| 1 câu, chủ ngữ là người dùng/sản phẩm (N1) | tên kỹ thuật trong nháy (N2) | mã + 3–5 chữ nói nó là gì (N3) |

Một dòng một việc (N4). Cột 1 phải qua được phép thử Xoá-tên-máy.

## 5. Cưỡng chế thật sự nằm ở đâu (và không nằm ở đâu)

| Điểm nghẽn | Cưỡng chế bằng gì | Đo được trong CI? |
|---|---|---|
| Tác giả kit sửa một trong 8 file | case test cấu trúc + đối chứng âm | **Có** |
| Agent sinh thẻ/báo cáo | mệnh lệnh nạp nằm ngay trong file mà agent BẮT BUỘC đọc để làm việc đó | Không (xem Known limit) |
| Người duyệt tại cổng | quyền trả lại + entry sổ quyết định `lỗ-kit` | Không — đây là quyền của người |

Điểm nghẽn giữa là chỗ luật thật sự sống. Chọn 8 file này vì chúng là **file
duy nhất agent phải đọc để làm đúng việc đang bị hỏng** — không có đường vòng:
muốn render thẻ thì phải đọc `acceptance-card`; muốn trình tiến độ trong vòng
lặp thì phải đọc `feature-loop`.

## 6. Kiểm chứng — thiết kế phép đo

Mọi case đi vào `tests/plugins/run-tests.sh` (suite `executors.test.plugins`,
đã nằm trong `feature_loop.suite_keys`). Đánh số tiếp: **P89–P96**.

| Case | Đo gì | Đối chứng dương | Đột biến → thông điệp ghim |
|---|---|---|---|
| P89 | File nguồn đủ N1–N6, 2 phép thử có tên, ≥6 cặp TRƯỚC/SAU, vế loại trừ mặt máy, dòng N6 chỉ đích từ điển | bản nguyên vẹn XANH | xoá 1 luật → `thiếu luật N<i>`; xoá vế loại trừ → `thiếu vế phạm vi KHÔNG áp` |
| P90 | 8 chỗ trỏ có path + động từ nạp; 2 SKILL vòng lặp có mệnh đề **mọi lần trình** + gọi khuôn theo tên marker | bản nguyên vẹn XANH | gỡ pointer khỏi 1 bản sao → `<file>: thiếu mệnh lệnh nạp`; thu mệnh đề về riêng T3 → `phạm vi khuôn bị thu hẹp` |
| P91 | Path RÚT TỪ 8 file trỏ vào file thật **trên cây nguồn** (+ đếm sanity = 8 path rút được) | bản sao cây nguyên vẹn XANH | đổi tên file đích trong bản sao → `pointer trỏ file không tồn tại` |
| P92 | Round-trip khuôn: rút từ marker → parser bảng → đúng 3 header + ≥1 dòng ví dụ 3 ô | bản nguyên vẹn XANH | xoá 1 cột / thêm cột 4 / nhét 2 việc vào 1 ô → 3 thông điệp riêng |
| P93 | Nguồn duy nhất: bảng N1–N6 **khớp từng ký tự** giữa file tham chiếu và spec §4.1, không có bản thứ ba; tên 3 cột chỉ ở 1 file (**đếm sanity** ≥40 file đã quét) | so khớp bản nguyên vẹn XANH | sửa 1 chữ ở 1 bản → `bảng luật lệch giữa <file A> và <file B>`; chép tên cột sang file thứ 2 → `tên cột xuất hiện ở N file — khuôn phải một chỗ` |
| P94 | Quyền trả lại + tiền tố sổ `lỗ-kit — ngôn ngữ mặt người` có ở lệnh dựng thẻ, 2 harness | bản nguyên vẹn XANH | gỡ câu khỏi 1 bản → `<file>: thiếu quyền trả lại tại cổng` |
| P95 ⭐ | **Pointer giải được TRONG GÓI ĐÃ ĐÓNG**: 3 skill Codex giải `${PLUGIN_ROOT}`+path ra file thật trong `plugins/acceptance-gate/`; 2 SKILL vòng lặp phải đi qua bộ giải plugin (gói của chúng không chứa file tham chiếu) và bộ giải phải có mặt | gói nguyên vẹn XANH | di chuyển file tham chiếu trong bản sao gói → `pointer trong gói <tên> trỏ file không tồn tại`; đổi pointer vòng lặp thành ghép-thẳng-gốc-gói → `gói này không chứa file tham chiếu — phải qua bộ giải plugin` |
| P96 | Từ điển: rút danh sách từ qua marker `HFL-GLOSSARY-TERMS` (+ đếm sanity ≥3 từ) rồi tra `CONTEXT.md` | bản nguyên vẹn XANH | xoá 1 mục khỏi bản sao `CONTEXT.md` → `từ <x> chưa có mục trong từ điển` |

Mirror: `executors.script.mirror_sync` (`sync-plugin-packages.sh --check`) —
đối chứng âm đã có sẵn ở P41, không dựng lại.

**Bẫy đã biết, tránh trước:**
- Case P93 quét chuỗi mà **chính source của case chứa chuỗi đó** → loại `tests/`
  khỏi vùng quét VÀ ghép mảnh literal như P80 đã phải làm.
- Grep 0 hit là triệu chứng grep hỏng, không phải bằng chứng sạch → bộ đếm sanity.
- Bản sao/fixture dựng trong `mktemp` phải suy path từ `$ROOT`, không hardcode.

## 7. Descope có tên (đợt sau)

**Máy soi mật độ token kỹ thuật + ratchet.** Nấc mà spec §4.1 gọi là "nấc máy
soi": đếm mật độ tên file/hàm/biến trong vùng mặt-người của thẻ, siết ngưỡng
dần như census design system. Không làm ở feature này — chờ **đợt nâng bộ thẻ**,
vì nó cần một bộ mẫu thẻ thật đủ lớn để đặt ngưỡng khởi điểm, và đặt ngưỡng bừa
sẽ sinh cờ giả rồi bị tắt. Đổi lại: giữa hai đợt, việc bắt vi phạm nằm ở mắt
người duyệt tại cổng (quyền trả lại — AC-12).

## 8. Known limits

1. **Không đo được bằng máy việc agent CÓ THẬT SỰ tuân luật.** CI chỉ chứng
   minh luật có mặt, nối đúng, một nguồn. Hành vi thật chờ pilot — giống hệt
   tiền lệ `design-pass` (ký 30/07, hành vi chờ pilot r2). Dấu hiệu để đọc ở
   vòng sau: số lần người duyệt dùng quyền trả lại (entry `lỗ-kit` trong sổ).
2. **Luật là văn tiếng Việt, kiểm bằng khớp chuỗi.** Viết lại một luật bằng từ
   đồng nghĩa mà giữ nguyên nghĩa vẫn làm case ĐỎ. Đây là đánh đổi có chủ đích:
   ghim chuỗi là cách duy nhất khiến "xoá mất một luật" nổ; chi phí là mỗi lần
   sửa câu chữ luật phải sửa case cùng lượt.
