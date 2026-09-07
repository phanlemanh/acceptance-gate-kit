# File chỉ dẫn máy (AGENTS.md · CLAUDE.md) và luật evidence-stale — 07/09

> Chip mở từ kho CRM. Bối cảnh: một thay đổi THUẦN TÀI LIỆU ở `~/dev/crm`
> (xoá ba mục hành vi của hãng khỏi `AGENTS.md`, sửa đoạn tương ứng trong
> `CLAUDE.md`) làm `pre-merge-check.sh` báo 21 hồ sơ stale; 3 hồ sơ stale
> CHỈ vì hai file này (`cron-theo-ban-khai`, `nhan-ung-dung-noi-tieng-viet`,
> `tiep-thi-tuyen-doi-tac`). Câu hỏi đặt ra: luật stale có nên coi file chỉ
> dẫn máy là «mã» không?
>
> Không sửa gì ở CRM. Mọi con số dưới đây dán được bằng lệnh.

## Kết luận trước

**Kit chưa từng quyết «AGENTS.md là mã». Nó rơi qua một lỗ ngữ nghĩa glob.**

CRM đã khai `**/*.md` trong `risk_tiers.t1_skip_globs` — ý rõ ràng là «mọi
markdown là tài liệu». Nhưng bộ khớp glob duy nhất của kit (`match_globs`,
[scripts/pre-merge-check.sh:467](../../scripts/pre-merge-check.sh)) là
`case` của bash, nơi `**/` đòi **ít nhất một dấu `/`** — nên mẫu đó bắt
`docs/x.md`, `apps/app/README.md` mà KHÔNG bắt bất kỳ `.md` nào ở gốc kho:
`AGENTS.md`, `CLAUDE.md`, `README.md`, `CONTRIBUTING.md`, `SECURITY.md`,
`CHANGELOG.md`, `CONTEXT.md`. `PRODUCT-MAP.md` thoát chỉ vì template
`acceptance-init` liệt nó đích danh.

Tái hiện bằng fixture máy sinh, chạy đúng `pre-merge-check.sh` của cây này:

| Glob khai | File đổi sau verify | Kết quả |
|---|---|---|
| `**/*.md` | `AGENTS.md` (ca CRM) | **VIOLATION stale**, exit 1 |
| `**/*.md` | `docs/d.md` (đối chứng) | clean, exit 0 |
| `*.md` | `AGENTS.md` | clean, exit 0 |
| `**/*.md` | `src/app.js` (đối chứng đỏ) | VIOLATION stale, exit 1 |

Không tài liệu nào của kit (GUIDE §8 bảng config, README, QUICKSTART) nói
glob là mẫu `case` bash; mọi công cụ người dùng quen (gitignore, minimatch,
ripgrep) đều hiểu `**/` là «không hoặc nhiều thư mục». Đây là lớp lỗi
**bên khai và bên đọc trôi khỏi nhau** — đúng lớp hiến pháp gọi «marker
một-nguồn writer/reader cùng rút». Không có test nào ghim ngữ nghĩa `**/`
(grep `\*\*/` trong `tests/scripts/run-tests.sh`: 0 dòng).

## Trả lời câu hỏi chính sách

**Không.** Kit là engine; nó không được biết `AGENTS.md` là gì (hiến pháp:
«Kit là engine — KHÔNG chứa product context của repo tiêu thụ»). Việc xếp một
file vào tài-liệu hay hành-vi là quyết định của repo tiêu thụ, và cơ chế cho
quyết định đó ĐÃ tồn tại: `t1_skip_globs`. Kit tự áp lên chính nó đúng như
vậy: `CLAUDE.md` của kit nằm đích danh trong `t1_skip_globs`
([_acceptance/config.yaml](../../_acceptance/config.yaml)) từ commit dogfood
`89f7f955`, dù làn review của verify đọc `CLAUDE.md`
([feature-loop/workflows/acceptance-verify.js:491](../../feature-loop/workflows/acceptance-verify.js)).

Ba lối đề xuất, phân loại theo nguồn căn cứ:

1. **Kit loại nhóm «file chỉ dẫn máy» khỏi phép so** — BÁC. Kit phải chứa
   danh sách tên file của một hệ sinh thái (AGENTS.md, CLAUDE.md, GEMINI.md,
   .cursorrules…) — blacklist trên không gian mở, và là product context.
2. **Chỉ tính cho hồ sơ có executor `judgment`** — BÁC. Chính xác hơn về lý
   nhưng đòi kit liệt kê «file nào đi vào ngữ cảnh harness của judge»:
   `CLAUDE.md` + mọi `@import` + `.claude/rules/*` + skill plugin… tập này
   dịch theo harness, không đóng được. Thêm nữa: ở CRM, `CLAUDE.md` có
   `@AGENTS.md`, nên AGENTS.md THẬT SỰ vào ngữ cảnh judge — lối 2 sẽ giữ
   nguyên 21 vi phạm cho mọi hồ sơ có judgment, không giải được cơn đau.
3. **Khai loại trừ trong `_acceptance/config.yaml`** — ĐÂY LÀ CƠ CHẾ HIỆN
   CÓ, và CRM đã dùng nó. Lỗi nằm ở chỗ kit hiểu lời khai khác người khai.

## Lập luận «đổi AGENTS.md đổi cách judge chấm» — cân đúng

Có thật một đường mã: judge là subagent tươi nhưng vẫn nhận `CLAUDE.md`
(+`@AGENTS.md`) từ harness; làn review đọc `CLAUDE.md`/`CONTRIBUTING.md`
đích danh. Nhưng:

- **Thước của judge là tiêu chí trong contract**, không phải AGENTS.md.
  Judge bị lệch bởi hướng dẫn hãng là nhiễu, không phải phép đo — sửa
  hướng dẫn không làm tiêu chí đổi.
- Trong 3 hồ sơ bị chạm: `cron-theo-ban-khai` 8/8 script, 0 judgment;
  `nhan-ung-dung-noi-tieng-viet` 1 judgment (E14) đang UNCERTAIN → người
  quyết, máy không cầm verdict; `tiep-thi-tuyen-doi-tac` T3 → mọi judgment
  đều người quyết theo luật T3. **Không hồ sơ nào có verdict judgment do máy
  cầm.** Sửa AGENTS.md không đổi được chữ nào trong ba bằng chứng đó.
- Kẻ đổi `CLAUDE.md` để lái judge là chính owner — ADR 0012 đã khai mối đe
  doạ của cổng là drift thật, không phải máy/người giả mạo.

## Khả năng bỏ sót nếu coi root-markdown là T1

- Repo mà markdown LÀ hành vi (chính kit: `SKILL.md`, `commands/*.md`) —
  kit đã xử lý: không dùng `*.md`, liệt docs đích danh (README §self-hosting,
  ghi chú 2 đầu config). Lối sửa dưới KHÔNG chạm repo không khai `**/`.
- `CLAUDE.md` đổi quy ước verify («repo cấm test framework») — đổi cách
  vòng SAU đo, không đổi cây SẢN PHẨM mà bằng chứng cũ mô tả. Stale bảo vệ
  «bằng chứng mô tả cây đang merge», không bảo vệ «quy trình bất biến».
- Răng T1-escape dùng cùng `match_globs`: sửa ngữ nghĩa `**/` cũng làm PR
  chỉ chạm root-md thành T1 thật. Đó là ý người khai, nhất quán.

## Khuyến nghị — hai việc, hai kho

**Kit (ô mới, cần mở):** `match_globs` hiểu `**/` như mọi công cụ khác —
mẫu bắt đầu bằng `**/` khớp thêm cả bản đã cắt tiền tố. Một hàm, một chỗ
(bash là bộ khớp duy nhất; phía JS chỉ `includes('PRODUCT-MAP.md')`).
Kèm: một dòng ở GUIDE §8 nói rõ ngữ nghĩa glob; test đỏ/xanh theo bảng trên
(4 ca, fixture máy sinh, đối chứng dương là ca `src/app.js`). Chạm
`scripts/pre-merge-check.sh` = `t3_paths` → vòng T3, Gate 1 · 1.5 · 2.
Không phải meta-work: neo ngoài là CRM, hôm nay.

**CRM (chủ kho tự quyết, ngoài phạm vi chip này):** hai lối, cùng kết quả
hôm nay: thêm `"*.md"` (bắt trọn root) hoặc liệt đích danh `AGENTS.md`,
`CLAUDE.md`. Ba hồ sơ bị chạm chỉ cần **ghim lại theo làn máy** (GUIDE
§7.1) sau khi config đổi — không phải verify lại từ đầu. 18 hồ sơ còn lại
thuộc bảng nợ `632aee6`, không liên quan.

## Bổ sung từ phiên CRM (crm-11, đo 07/09 nhánh onehub)

- **Luật tự sinh việc, không cần ai sửa mã sản phẩm.** Hồ sơ
  `o-cam-chay-duoc-that` ký Cổng 2 lúc 18:03, hai mươi phút sau bị báo cũ vì
  commit `d5bd83c` — sáu dòng ghi chú vào `CLAUDE.md` (root) nói cổng dev
  3000/3001 là mặc định phép đo. `git show --stat d5bd83c`: đúng một file,
  `CLAUDE.md`. Cùng lỗ `**/` ở trên; đây là ca thứ tư trong ngày.
- **Nhịp sửa hai file:** `git log -- AGENTS.md CLAUDE.md` cho 6 commit trong
  7 ngày, riêng 07/09 có 3. Với nhịp ~1 lần/ngày, chạy lại verify không mua
  được gì bền — ngay hồ sơ rẻ nhất (`cron-theo-ban-khai`, 8 ổ cắm, chạy tay
  9/9 xanh) cũng cũ lại ở commit tài liệu kế tiếp. Hai hồ sơ kia cần máy
  chủ dev (12/15 và 5/10 ổ cắm) cộng judgment/ui-check — giá chạy lại là
  thật, kết quả mua được là không. Đây chính là hình dạng «cổng mà câu trả
  lời hợp lý duy nhất là ừ» — trạm thu phí, và người bắt đầu bỏ qua cảnh
  báo là hệ quả đã được North Star nêu tên.
- **Tổng cảnh CRM:** 22 vi phạm stale = 18 nợ cũ (bảng `632aee6`) + 3 do
  thay đổi thuần tài liệu AGENTS.md/CLAUDE.md + 1 do `d5bd83c`. Cả 4 ca mới
  đều là root-markdown; con số 18 không thuộc phát hiện này.
- **Tóm tắt per-slug dễ đọc nhầm.** `--slug` là bộ lọc operator KHAI (script
  đã fail-loud khi lọc rỗng/không khớp), nên «1 violation(s) — merge
  blocked» là đúng cho phạm vi lọc, còn toàn kho ở cùng commit là 22.
  Phiên CRM đã loại giả thuyết chỗ-chạy (cây gốc và worktree sạch cùng số).
  Ghi nhận như quan sát mặt người: dòng tóm tắt chưa nói mình đang đếm trên
  bao nhiêu hồ sơ. Không đề xuất trong chip này; nếu mở ô, một dòng «trong
  1/N hồ sơ được lọc» là đủ.

## Đường đảo

Hồ sơ này là văn xuôi (`docs/**` T1). Ô kit chưa mở; mở hay không là một
chạm của owner. Nếu bác: CRM vẫn tự giải được bằng `"*.md"`, lỗ ngữ nghĩa
giữ nguyên cho consumer kế tiếp khai `**/`.
