# BÀN GIAO — vòng sửa hồ sơ 1b + thi công hồ sơ 1a

*2026-08-13 · Soạn: Phiên C (thi hành) khi bàn giao sang phiên chạy trên cloud.
**Tài liệu này tự đủ** — phiên nhận không chung sổ nhớ với phiên nào. Mọi thứ
cần biết nằm ở đây cộng bốn tệp được trỏ.*

---

## 0 · Đọc trước (bắt buộc, theo thứ tự)

1. `docs/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md` — **bản neo**, owner
   duyệt 12/08. Mọi quyết định phải trace về nó; lệch thì append «Nhật ký lệch».
2. `docs/plans/2026-08-12-de-bai-dot1-cat-va-luu-kho.md` — đề bài gốc cả hai hồ
   sơ: danh sách CẤM ĐỤNG, mầm tiêu chí, bẫy đã biết.
3. `_acceptance/luu-kho-codex-va-nghi-le-design/review-findings.md` — **kết quả
   rà soát đối kháng vòng 1 (REJECT)**. Đây là đề bài chính của bạn.
4. `_acceptance/luu-kho-codex-va-nghi-le-design/nhat-ky-thi-cong.md` — bảy vấp
   đã ghi, kèm số đo và lý do từng lần sửa hợp đồng.

## 1 · Bạn đang cầm gì

Hai hồ sơ nghiệm thu chạy song song, cả hai **đã qua Cổng 1** (owner duyệt
12/08). Đợt việc: gỡ bớt thứ hình thức khỏi kit — lưu kho một harness song sinh
cùng bản sao phẳng của nó, và khai tử phần nghi lễ của một làn design.

| | nhánh | trạng thái |
|---|---|---|
| **1b** lưu kho | `feat/luu-kho-codex-va-nghi-le-design` | vật xong · S4 chạy cả hai làn · **verdict REJECT vòng 1** |
| **1a** cắt hình thức | `feat/cat-hinh-thuc` | **0%** — đứng nguyên tại commit Cổng 1 |

**Mốc đảo của 1b:** tag `truoc-luu-kho-2026-08` → commit
`1df86adb7da1a013adad9a4c2f14cd62a4ac9c39`, **đã có trên remote**. Đây là chân
duy nhất biện minh cho việc gỡ ~194 tệp. Đừng đụng vào nó.

**Bốn đẳng thức số ca đang giữ** (đo tại `b82650a`): bộ kiểm gói **145**
(`173 − 26 − 2`) · luồng **463** (`488 − 25`) · script **664** (`671 − 7`) ·
hook **54**. Bất kỳ con số nào đổi mà không có dẫn xuất là tín hiệu gỡ lan.

## 2 · Điều kiện cần trước khi bắt đầu

Ba nhánh phải có trên remote thì phiên cloud mới thấy: `main` (mang bản neo +
hai đề bài + tài liệu này), `feat/luu-kho-codex-va-nghi-le-design`,
`feat/cat-hinh-thuc`. Nếu chưa, dừng lại và nói với owner — **đừng tự tạo lại
nhánh từ đầu**.

---

## 3 · VIỆC A — vòng sửa 1b (làm trước, gộp MỘT lượt)

Sáu mục. Xếp theo hậu quả, không theo độ khó.

### A1 · Hai khẳng định SAI trong vật đã phát đi — làm đầu tiên

Đây là thứ duy nhất đã rời khỏi kho và tới tay người đọc khác.

**(a)** `skills/ux-ui-craft/references/layout-craft.md` — câu hiện tại khai một
luật khoảng-cách-bố-cục là *máy cưỡng chế bởi `design-gate.mjs`*. Kiểm bằng
đếm-có-kiểm-chứng: `design-gate.mjs` **0 hit** chuỗi `layout-token`,
`design-scan.js` **0 hit**. Luật ấy chết theo nghi lễ đã lưu kho.
**Xong khi:** câu đó nói đúng thứ máy thật sự làm, HOẶC nói thẳng rằng luật này
nay là kỷ luật người chứ không có răng máy. Skill này **phát cho repo tiêu
thụ** — sai ở đây là sai ngoài kho.

**(b)** `_acceptance/stop-patching-law/make-record.mjs` — chú thích quanh dòng
85 khẳng định *«nhánh còn lại sinh ra y nguyên byte, không dòng bằng chứng nào
bị viết lại»*. Câu đó **sai tại HEAD**: hai tệp
`_acceptance/stop-patching-law/evidence/chi-dan-claude-{co,khong}-menh-de.md`
đã bị viết lại (+11/−12 dòng mỗi tệp) khi bộ sinh chạy lại sau lúc sửa SKILL.
Hai tệp đó là bản ghi *chỉ dẫn thật đã đưa cho agent* trong một thí nghiệm **đã
ký**.
**Xong khi:** hai tệp bằng chứng trở về đúng nội dung lúc ký (lấy từ
`git show <commit trước đợt này>:<đường dẫn>`), bộ sinh **không sinh lại** nhánh
đã có bằng chứng ký, và chú thích nói đúng sự thật.
**Bẫy:** ca `P169`/`P170` round-trip trên chính hai tệp này — sửa xong phải
chạy `ONLY_BLOCK=P169 bash tests/plugins/run-tests.sh` và `P170` để kiểm.

### A2 · Chân đo rẻ mà nặng

Tất cả trong `_acceptance/luu-kho-codex-va-nghi-le-design/luu-kho-rang.sh`.

| # | Lỗi | Sửa |
|---|---|---|
| a | Chân «mốc đã đẩy» quét sha trong cả khối trả về | ghim `refs/tags/$TAG` — một mốc khác trỏ cùng commit đang làm chân này xanh giả |
| b | Chiều đỏ của E10 là hằng-đúng: `grep` tìm chuỗi vừa tự ghi, mà chuỗi ấy **đã có sẵn** trong một dòng chú thích của config | cho bản sao đi qua **chính trình đọc khoá** (đoạn `node`), không qua `grep` |
| c | Năm assertion của E10 chỉ soi HEAD nhưng in *«vắng ở HEAD, **có ở tag** OK»* | hoặc kiểm mốc thật, hoặc sửa thông điệp cho đúng — **không được để câu nói dối** |
| d | Chiều đỏ của E5 và E11b in câu ở **thì tương lai** («lưới trên *sẽ* ĐỎ») — chưa từng chạy | dựng bản sao, chạy lại chính hàm kiểm, đòi nó đỏ |
| e | Chiều đỏ của E2 được thoả bằng `mkdir` chạy TRƯỚC lúc giải nén | bỏ `mkdir` sớm; giải nén hỏng phải làm chiều đỏ ĐỎ, không phải xanh |

### A3 · Cho máy assert đẳng thức số ca — trụ cột đang do người đếm

`evals.yaml` E12/E7/E14 hứa in `LUU-KHO-SUITE: so ca lech ky vong: …`. Thông
điệp đó **không tồn tại trong bất kỳ mã nào**. Con số 145 hiện chỉ suy được
bằng đếm tay dòng `PASS:`. Lần chạy sau mất 20 ca vẫn in *"all plugin tests
passed"* và trả 0.

**Xong khi:** bộ răng có một chân chạy bộ kiểm gói, đếm dòng `PASS:`, so với
**145** và đỏ ghim đúng thông điệp đã hứa. Làm tương tự cho luồng (**463**) nếu
rẻ. Đây là AC-11 — trụ cột chống gỡ-quá-tay của cả hồ sơ.

### A4 · Thu hẹp miễn trừ theo TỪNG từ khoá

`MIENTRU_RE` hiện neo theo **tiền tố tệp**, nên nó che trọn ba tệp cho cả tám
từ khoá; hai chân chứng minh «miễn trừ chỉ hẹp» lại chỉ viết cho **một** từ
khoá. Đã có vật lọt thật: từ khoá `sync-plugin-packages` còn **1 hit sống** ở
`.claude-plugin/plugin.json:4`, xanh **chỉ nhờ** miễn trừ.

**Xong khi:** miễn trừ là cặp `(tệp, từ khoá)` chứ không phải `(tệp, *)`, và
chân đỏ-ngoài-danh-sách phủ mọi từ khoá được miễn trừ.

### A5 · Bump phiên bản + khai đường phát hành

Manifest vẫn đúng số cũ trong khi nội dung gói đổi lớn. Sổ nhớ của kho ghi
đúng lớp lỗi này: **lệnh cập nhật bỏ qua khi số trùng mà nội dung đổi.** Thêm
nữa, sau merge một gói biến khỏi marketplace trong khi bản đã cài trên máy đội
treo lơ lửng.

**Xong khi:** hai manifest bump minor; trang bằng chứng có một mục nói rõ đội
phải làm gì (gỡ gói đã cài, cập nhật hai gói còn lại).

### A6 · Khai hai lần sửa-sau-Cổng-1 còn thiếu

Hợp đồng khai sáu lần. Còn **hai lần chưa khai**: mảng từ khoá co từ 11 xuống
8, và phạm vi quét bỏ `tests/` — lý do hiện chỉ nằm trong chú thích script.
Thêm dấu `[SỬA SAU CỔNG 1 — <ngày>, <phiên>]` vào `contract.md` kèm lý do, đúng
khuôn sáu lần trước.

---

## 4 · KHÔNG sửa — ghi known-limits (đề xuất của Phiên C, owner có thể gạt)

Bốn mục dưới đây **cố ý không sửa**, ghi vào mục «Giới hạn đã biết» của trang
bằng chứng kèm lý do:

1. Phép quét tham chiếu (E4) không có chiều đỏ chạy qua chính nó; đối chứng
   dương dùng một danh sách đường dẫn hardcode riêng nên có thể trôi khỏi phạm
   vi mà không ai biết.
2. E15 canh khối thoát-sớm bằng **một hình dạng thụt lề** duy nhất.
3. Bánh cóc chống hạ-thước chỉ đếm dòng Python `assert `, mù với `grep -q`,
   `fail`, `die` của 26 ca đã xoá.
4. Mất một mẩu độ phủ ở cụm MBC, và bộ sinh của workspace ấy còn một con trỏ
   chết không ai canh.

**Căn cứ:** đây là răng **dùng một lần** cho một đợt lưu kho, chết theo hồ sơ
khi merge — không phải lưới engine vĩnh viễn. Chi phí siết chúng lớn hơn rủi ro
chúng che, và bản neo nói *giờ-kit là chi phí, không phải tiến độ*.

---

## 5 · Sau vòng sửa — chạy gì

```bash
bash _acceptance/luu-kho-codex-va-nghi-le-design/luu-kho-rang.sh   # bộ răng
bash tests/plugins/run-tests.sh        # phải 145 dòng PASS:
bash tests/workflows/run-tests.sh      # phải 463
bash tests/scripts/run-tests.sh        # phải 664
bash tests/hooks/run-tests.sh          # phải 54
node scripts/product-map.mjs --root . --check
```

Rồi **rà soát đối kháng vòng 2**: ba phiên sạch, ba lăng kính (phép đo ·
gỡ-quá-tay · hợp đồng-đối-vật). Người sửa KHÔNG chấm bản sửa của mình.

**Luật dừng-vá:** nếu vòng sửa thứ hai vẫn sinh lỗi CÙNG LỚP với vòng một thì
khuôn giải sai — DỪNG, trình owner ba đường (đổi hình · thu phạm vi · ship kèm
known-limits), đừng tự phát vòng ba.

---

## 6 · VIỆC B — thi công hồ sơ 1a (sau khi 1b xanh)

Nhánh `feat/cat-hinh-thuc`, **chưa một commit thi công nào**. Bảy hạng mục nằm
đủ trong đề bài §«HỒ SƠ 1a». Tóm tắt: cắt đo-phút-người ở cả bốn cổng · gỡ tư
cách luật-mỗi-tin của khối «VIỆC CỦA ANH» (giữ trên thẻ cổng) · đổi xác-nhận-T1
thành tuyên-kèm-căn-cứ · quét-độ-phủ thôi phỏng vấn · init một-lần-gạch · đồng
bộ mâu thuẫn ai-commit-chữ-ký · hợp nhất tuyên bố vào `CLAUDE.md`.

**Bản đề xuất `CLAUDE.md` owner đã gật trọn gói** nằm ở
`_acceptance/cat-hinh-thuc/de-xuat-claude-md.md`; mục «va chạm» trong đó nói
cách phối vùng sửa với 1b.

**Cảnh báo va chạm:** 1b vừa sửa `CLAUDE.md`, `skills/acceptance/`,
`commands/approve.md`, `commands/signoff.md`, `feature-loop/skills/` — đúng
vùng 1a sẽ đụng. Rebase 1a lên 1b **sau khi 1b merge**, đừng làm song song trên
cùng tệp.

**Tiêu chí đã chết:** `AC-11` của 1a đòi một script đã bị 1b xoá. Bên merge sau
phải rebase và bỏ tiêu chí đó — ghi ở đây để không ai phát hiện muộn.

---

## 7 · Luật KHÔNG được lược

- **Sáu lệnh cổng người bị khoá model-invocation.** Máy không bao giờ tự gọi
  `approve`/`signoff`/`acceptance-init`/`acceptance-status`/`acceptance-report`/
  `start`. Duyệt và ký chỉ nhận từ owner gõ trực tiếp.
- **Sửa hợp đồng đã duyệt phải có dấu vết, và phải TRƯỚC khi đo.** Đây là chỗ
  phiên trước sai hai lần — đừng lặp lại.
- **Đẳng thức số ca, không phải sàn `≥`.** Đo ra khác thì đi tìm nguyên nhân,
  không sửa số cho vừa kết quả.
- **`git add` đích danh** (kho tự chạy cổng của chính nó, `-A` cuốn nhầm việc
  khác). PR merge kiểu «Create a merge commit» — **cấm squash**, squash xoá hạt
  commit chữ ký và làm mọi PR sau đỏ vĩnh viễn.
- **Gom Cổng 2 hai hồ sơ vào MỘT lần ngồi của owner.** Ràng buộc số 1 là tần
  suất gọi người, không phải chất lượng câu trả lời.
- **Khuôn mời cổng: trình đúng MỘT quyết định.** Mục máy-chắc-đảo-rẻ là
  mặc-định-kèm-căn-cứ-và-cửa-veto, không phải ô hỏi.

## 8 · Bẫy đã biết (trích sổ vấp — lớp, không phải danh sách đóng)

- **Bộ kiểm gói từng có một khối thoát-sớm lạc giữa tệp** nuốt 46 ca cuối mỗi
  khi có ca đỏ phía trước, mà dòng tổng kết in ra vẫn trông bình thường. Đã gỡ.
  Nếu thấy tổng ca < 145 mà không hiểu vì sao, tìm khối `exit` giữa tệp trước.
- **Đột biến neo vào vật đã chết là đột biến chết** — luôn `assert mut != gốc`.
- **Sửa SKILL.md xong phải chạy lại bộ sinh biên bản** kẻo suite đỏ oan.
- **Danh sách site có thể sống trong BẢN LUẬT, không trong bộ kiểm** — quét
  tham chiếu chết phải quét cả dữ liệu bên đọc.
- **Grep trên GNU coi backtick là anchor** — match literal bằng lớp ký tự.
- **Phép đo phụ thuộc mạng phải nói được «đỏ này do vật hay do đường»**.

## 9 · Kết thúc thế nào

Khi 1b xanh và 1a xong: soạn hồ sơ Cổng 2 **cả hai**, đối chiếu chéo bằng một
phiên sạch, rồi mới mời owner ký **một lần ngồi**. Sau chữ ký: chạy lại trọn
bốn bộ kiểm trước khi đẩy. Merge 1a trước 1b nếu không có lý do ngược lại.
