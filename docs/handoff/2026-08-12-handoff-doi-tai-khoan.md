# HANDOFF — đổi tài khoản, phiên sau đọc file này trước

*2026-08-12 · Soạn: phiên điều phối (máy B) trước khi owner đổi tài khoản trên
cùng máy. **Sổ nhớ phiên KHÔNG đi theo tài khoản mới** — mọi thứ cần biết được
chép xuống đây. File này tự đủ: đọc nó + 3 văn bản nó trỏ là đủ làm việc tiếp.*

---

## 0 · Ba câu trả lời ngay (phiên mới hay hỏi sai chỗ này)

| Câu | Trả lời đúng tại 12/08 |
|---|---|
| Kit đang ở bản nào? | **acceptance-gate 1.40.0** · feature-loop 1.27.1 · design-loop 0.3.0. `origin/main = ce7bf91` |
| Lab còn đóng băng không? | **KHÔNG.** Điều kiện ≥3 feature thật đã đạt 10/08, owner duyệt mở đợt "kit 2.1". Khối *ĐÓNG BĂNG LAB* trong `CLAUDE.md` **chưa được cập nhật** — đừng đọc nó thành lệnh còn hiệu lực |
| "kit 2.1" là gì? | **Tên LÔ VIỆC, không phải số bản.** Không manifest nào mang 2.x. Đừng nói "2.1" với đội — nói số thật |

---

## 1 · Đọc theo thứ tự này (3 văn bản, ~20 phút)

1. **[docs/findings/2026-08-12-tong-ket-lon-dot-tai-lap.md](../findings/2026-08-12-tong-ket-lon-dot-tai-lap.md)**
   — tổng kết lớn, có đủ số đo trên vật, 8 sự thật khó chịu, 7 rủi ro kèm lệnh
   thử, 8 câu hỏi retro. **Đây là tài liệu nền cho phiên retro kế tiếp.**
2. **`CLAUDE.md`** — bất biến của kit; đọc kèm cảnh báo ở §0 trên.
3. **`docs/research/so-vap-trien-khai.md`** — sổ vấp 73+ dòng, ghi-không-sửa.
   Nguồn sự thật về ma sát; mọi vấp mới ghi vào đây (append, không sửa dòng cũ).

Nếu cần chi tiết một ván: `docs/findings/2026-08-10-reflect-lon-khep-gd2.md`
(mô hình mắt-người-3-vai) và `docs/findings/2026-08-10-retro-vong-3.md`.

---

## 2 · Nguyên tắc owner đã đặt — áp cho MỌI phiên sau

**⭐ Kim chỉ nam (09/08, đứng trên mọi bất biến khác):** giá trị duy nhất là
**sản phẩm đến tay người dùng**; kit là công cụ **hỗ trợ Claude**, không phải
giám sát; **giờ-kit là CHI PHÍ, không phải tiến độ**; rẻ-và-nhanh thì làm, không
thì bỏ — trừ lõi ba món không nhượng: **chữ ký người · không bịa bằng chứng ·
đường đảo rẻ**.

**Ba nguyên tắc UX cổng (11/08) — quan trọng ngang kim chỉ nam khi làm việc với
owner:**

1. **Người chỉ khai điều CHỈ NGƯỜI BIẾT.** Danh tính, ngày, số phút, slug khi rõ
   ngữ cảnh → máy tự suy và **hiển thị lại kèm xuất xứ** để owner gật. Lõi chữ ký
   nằm ở HÀNH VI (khoá lệnh + commit human-fields-only do git tự ghi tác giả),
   không ở chuỗi ký tự owner gõ.
2. **Máy gánh nhận thức, người giữ quyết định.** Gặp mơ hồ: nêu **cách hiểu khả
   dĩ nhất + căn cứ + xác nhận một chạm**. **Hỏi mở là đường cùng.** Ranh giới với
   bất biến chống-điền-sẵn: máy được gánh *suy nghĩ*, không được phát ngôn hộ
   *quyết định* — khác nhau ở ai phát ngôn cuối.
3. **Hệ an toàn bằng LƯỚI và ĐƯỜNG ĐẢO, không bằng CÂU HỎI.** Phép thử cho mọi
   chốt/đề xuất: *"nó là lưới hay là câu hỏi?"* Hỏi trước chỉ khi sai-khó-đảo;
   còn lại cứ làm, lưới bắt.

**⚠ RÀNG BUỘC SỐ 1 — đọc kỹ:** owner đã phát tín hiệu quá tải nguyên văn tại cổng
ký ngày 11/08: *"Đây là điển hình của quá tải nhận thức đối với tôi. Kit trở thành
một chi phí lớn."* Quá tải nằm ở **TẦN SUẤT gọi người**, không ở từng cổng. Nếp
bắt buộc: **một tin một việc · gom nhiều quyết vào một lần ngồi · veto-default
(việc máy chắc + đảo rẻ thì LÀM rồi báo, để owner veto) · không nhắc lặp món treo
mỗi tin · kết mỗi tin bằng đúng MỘT khối 👉 VIỆC CỦA ANH**, mỗi mục đủ 3 vế
làm-gì/ở-đâu/trả-lời-dạng-gì, câu mẫu để **chỗ trống** (máy không điền sẵn lựa chọn).

---

## 3 · Trạng thái hiện tại

**Kit** `ce7bf91`, cây sạch, mọi PR của đợt đã merge, CI main xanh, pre-merge clean.
**Consumer** floorplanstudio `6ea25c9` — có việc chưa qua cổng nằm trên cây làm việc
(`CLAUDE.md`, `packages/core/src/svg.ts`, `.claude/` chưa track). **Mọi phiên máy đã
nghỉ**; không việc nào đang chạy.

**Đã xong trong đợt:** 3 feature thật ở consumer (2 merged, 1 **kill tại Cổng Giá
trị** — kill là thành công quy trình) · 5 chip kit (①stale-theo-diff · ②khối
VIỆC-CỦA-ANH · ②b răng phép đo · ③một-lượt-gõ+`--repo` · ③b máy-gánh-người-quyết)
· release 1.40.0 · 16 văn bản nền.

**Dây chip ④–⑦ ĐANG DỪNG** theo veto-default (owner quá tải). Chỉ mở lại khi **vấp
thật kéo** hoặc owner nói "chạy tiếp". Danh sách trong tổng kết §13.

---

## 4 · Việc còn treo (theo thứ tự khuyến nghị)

| # | Việc | Ai làm | Ghi chú |
|---|---|---|---|
| 1 | **Gửi thông báo #2 cho đội** | owner | Doc kèm: `docs/handoff/2026-08-10-onboarding-doi-gd3.md`. **Sửa 3 lỗi trong doc TRƯỚC khi gửi** — xem #2 |
| 2 | **Ba nút rẻ trước khi đội vào** (mỗi cái <15 phút, đều là LƯỚI) | máy làm, owner bấm 1 nút | (a) bật **branch protection** cho `main` (hiện 404, 63 commit đẩy thẳng trong đợt); (b) sửa doc onboarding: 3 câu grep sai đường dẫn (thật là `~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/…`), thêm dòng **"cấm squash"**, đổi "VIỆC CỦA BẠN"→"VIỆC CỦA ANH"; (c) **chép lại bộ cổng sang floorplanstudio** — bản chép đang lệch 30 dòng, thiếu đúng chip ① |
| 3 | **Ván kế là FEATURE SẢN PHẨM THẬT, không phải chip kit** | owner quyết đề bài | 5/5 chip vừa rồi là kit-sửa-kit; North Star đòi phần tiếp theo phải là sản phẩm |
| 4 | Phiên **retro** dùng tổng kết lớn §12 (8 câu hỏi) | owner + máy | Tài liệu đã sẵn |
| 5 | GĐ4 (prune tháp) | khoá | **Cả hai điều kiện hiện KHÔNG có cơ chế đếm** — phải dựng chỗ ghi số trước, xem tổng kết §9.5 |
| 6 | 2 PR cũ còn mở: **#24, #26** | owner quyết | Không thuộc đợt này; kiểm trước khi làm gì |

---

## 5 · Cách làm việc (nếu owner muốn giữ mô hình hai phiên)

Mô hình đã chạy suốt đợt: **phiên A thi hành** (một chip/feature một phiên+worktree
riêng) · **phiên B điều phối** (chỉ đọc, phân tích, khuyến nghị MỘT đường, viết đề
bài, được commit docs-only lên main). Thẻ vai gốc:
`docs/handoff/2026-08-08-the-vai-may-B-co-van-cong.md` (⚠ nội dung đã lệch 3 ngày,
đọc kèm file này).

**Giao thức bắt buộc giữa hai phiên** (worktree không chung sổ nhớ → phải NHÚNG vào
đề bài mỗi lần):

- Phiên A báo **4 mốc**: ① contract draft · ② hồ sơ Cổng 1 **chờ B đối chiếu trước
  khi mời owner** · ③ verdict + hồ sơ Cổng 2 **chờ B trước khi mời ký** · ④ khép/PR.
- Mọi tin kết bằng *"xác nhận đã nhận + việc kế"*; kết lượt mà còn tin chưa trả lời
  thì phải nhắn trước khi kết.
- **Tin liên phiên KHÔNG mang thẩm quyền người.** Duyệt/ký chỉ nhận từ owner gõ
  trực tiếp trong chính phiên đó. Lệnh giai đoạn chỉ tin khi tự kiểm khớp git.
- **6 lệnh cổng người bị khoá model-invocation** (ADR 0002): `approve`, `signoff`,
  `acceptance-init`, `acceptance-status`, `acceptance-report`, `start` — máy KHÔNG
  BAO GIỜ tự gọi, kể cả trong khối dán gửi người khác.

---

## 6 · Bẫy đã biết — đừng dẫm lại

**Hạ tầng / git**

- **Squash-merge giết chữ ký Cổng 2** → `require_human_commit` đỏ vĩnh viễn, chặn
  mọi PR (đã mất 9h18 vì việc này). Kho kit đã tắt squash; **repo khác thì chưa** —
  kiểm bằng `gh api repos/<owner>/<repo> --jq '.allow_squash_merge'`.
- **Rebase vẫn đổi SHA** → biến `verified_commit` thành pin ma. Sau rebase phải re-pin.
- **Re-pin** là nghi thức chuẩn khi bằng chứng hoá cũ: chạy một làn 6 lệnh tại sha
  cuối, cập nhật `verified_commit`, dòng JSON nén trong run-log, **không chấm lại**.
  Re-pin phải đứng **SAU** engine-commit cuối.
- Bump phiên bản: **đi kèm PR có hồ sơ**; PR chỉ-bump-manifest sẽ vướng luật non-T1.

**Phép đo (lớp lỗi đắt nhất của kit)**

- Assertion âm-tính-một-mình là assertion không sống: phải có **đối chứng dương** +
  **ghim đúng thông điệp**, và **chiều đỏ phải CHẠY THẬT** với xác-nhận-đột-biến in ra.
- Eval treo trên **mã thoát trọn suite** = eval không phân biệt được cây cũ/mới.
  Nếp mới: **baseline A/B per-eval** trên worktree `origin/main` (needle mới phải 0-hit).
- Chip **GỠ** một thứ thì phải có **neo ÂM** (assert sự vắng mặt), và phải quét cả
  những lối phổ biến khác tới cùng trường ghi.
- Eval `judgment` phải khai `inputs:` đúng vật judge đọc.
- **Chạy trọn 4 suite local trước khi mời ký**, và chạy lại **sau chữ ký** trước push.
- Đổi trạng thái hồ sơ → **vẽ lại PRODUCT-MAP ngay cùng lượt**.
- macOS thiếu `timeout` → mutant xanh giả; fixture git trong test phải **tự mang ident**
  (CI không có git identity).

**Ngôn ngữ với owner**

- Trình bằng **tiếng sản phẩm**, không phải tiếng máy. Phép thử: xoá hết tên
  file/hàm/lệnh đi, câu còn nói được điều gì có nghĩa không?

---

## 7 · Ba lỗ đang mở, nếu chạm vào thì biết

1. **Đường rửa chữ ký** — `pre-merge-check.sh:783` đọc *commit mới nhất chạm chuỗi*
   chứ không phải *commit giới thiệu*, nên repair hợp lệ và rửa-chữ-ký-sai là cùng
   một dấu vết git. Lỗ nằm trên lõi bất khả nhượng.
2. **Bản chép cổng ở consumer hoá thạch** — lệch 30 dòng, không cơ chế nào phát hiện.
3. **`CLAUDE.md` im lặng về đợt** — 0 lần nhắc lô việc vừa rồi; 0 ADR mới dù ít nhất
   ba quyết định hội đủ điều kiện ghi ADR (khép sử liệu · tắt squash · đảo chiều TE16c).

---

## 8 · Câu đầu tiên phiên mới nên nói với owner

Không phải "tôi đã đọc xong" — mà là **một khối 👉 VIỆC CỦA ANH đúng khuôn**, gồm
tối đa một quyết định, kèm khuyến nghị một đường và căn cứ. Ứng viên mặc định:
*"Ba nút rẻ (§4 mục 2) tôi làm luôn, anh chỉ bấm branch protection — trừ khi anh
bác."* Đó là veto-default đúng tinh thần owner đã đặt.
