# Handoff 25/08/2026 — vòng `design-pass-nac-khong-dong-bo` dừng ở một câu hỏi cho owner

*Người bàn giao: phiên chạy vòng (Claude, tài khoản cũ) · Người nhận: phiên sau
khi Manh đổi tài khoản. Máy KHÔNG đổi: kho, nhánh, plugin cache, trí nhớ dự án
vẫn nguyên chỗ. Không có artifact nào thuộc tài khoản cũ cần đăng lại.*

---

## 0. Một câu: vòng đang chờ owner chọn, không chờ máy làm

Vòng đã thi công xong toàn bộ và đi qua hai lượt nghiệm thu máy. **Luật dừng-vá
kích hoạt ở vòng 2** nên máy KHÔNG được tự chạy vòng 3. Owner được trình ba
đường và **chưa trả lời**. Việc đầu tiên của phiên nhận: lấy câu trả lời đó,
không phải làm tiếp.

**Câu hỏi đang treo — ba đường, máy khuyên B:**

| Đường | Nghĩa | Đánh đổi |
|---|---|---|
| A · đổi khuôn đo | tìm cách đo LỜI khác phép so chữ | chưa có cơ chế nào sẵn; mở một cuộc tìm kiếm giữa vòng |
| **B · thu phạm vi đo** (khuyên) | giữ phần đo ĐẦU RA thật, cắt phần đo chữ; owner soi lời tại Cổng Phạm vi | mất lưới máy cho phần lời — nhưng phần đó đã hai vòng không giữ được |
| C · giao kèm giới hạn đã khai | giữ nguyên mọi phép đo, khai lỗ còn lại | lỗ còn lại KHÔNG gọi tên gọn được → owner khó ký có căn cứ |

Giá trị cho người dùng **không đổi ở cả ba đường**: nghi thức đã thôi đòi ngồi
cạnh máy, bước phân kỳ đã có, thẻ đã hiện nấc.

---

## 1. Đọc gì trước (đúng thứ tự)

| # | File | Vì sao |
|---|---|---|
| 1 | `_acceptance/design-pass-nac-khong-dong-bo/contract.md` | 15 tiêu chí + Coverage + Đường đo + danh sách kim đóng |
| 2 | `_acceptance/design-pass-nac-khong-dong-bo/review-findings.md` | findings vòng 2 (bản mới nhất, đã ghi đè vòng 1) |
| 3 | `_acceptance/design-pass-nac-khong-dong-bo/evidence-report.md` | báo cáo vòng 2 |
| 4 | `_acceptance/design-pass-nac-khong-dong-bo/decisions.jsonl` | 8 quyết định, gồm 3 lượt tự sửa thước |
| 5 | `docs/plans/2026-08-19-hat-giong-design-pass-nac-khong-dong-bo.md` | đề bài gốc — mục 3 · 3b · 4.3 |

Ô anh em: `dac-ta-ux-vat-hoa-cau-truc` (đã ship #107). Hai ô **đo chung một ván
thử** ở kho tiêu thụ; ngưỡng của cả hai chỉ có số khi ván đó chạy.

---

## 2. Trạng thái chính xác

- Nhánh: `feat/design-pass-nac-khong-dong-bo`, **chưa push**, cắt từ `c444c512`.
- 10 commit, cây sạch. Hợp đồng `status: implemented`, `veto_state: mo`,
  `approved_by` RỖNG (Cổng Phạm vi đi làn V — owner veto được bất cứ lúc nào).
- Bốn bộ kiểm + bản đồ: **XANH khi phiên này tự chạy** (`plugins` · `scripts` ·
  `hooks` · `workflows` · `product-map --check`).
- Bộ ca hồ sơ: `tests/plugins/design-pass-nac.test.mjs` — 13 ca, 44 mutant.

**⚠ Sự thật cứng nhất của vòng này:** cả HAI lượt nghiệm thu máy đều **BLOCKED
vì hạ tầng** — bộ phân loại an toàn bị giới hạn nhịp, vòng 2 chặn trọn 6/6 lệnh.
Nghĩa là **chưa có một dòng bằng chứng máy độc lập nào**. Màu xanh trên chỉ là
phiên này tự chạy. Dù owner chọn đường nào cũng phải có một lượt lane sạch khi
bộ phân loại hồi rồi mới ký được.

---

## 3. Đã giao gì (phần này KHÔNG tranh chấp)

| Vật | Đổi gì |
|---|---|
| `skills/design-pass/SKILL.md` | mặc định thành KHÔNG ĐỒNG BỘ; thang 4 nấc `nac-0..nac-3` trong mốc neo `REACTION-LADDER`; luật leo thang theo tín hiệu đếm được; mục 3b bước phân kỳ (mở bằng vật thật TRƯỚC khi bày hướng; ngả máy khuyên GHIM TRÊN VẬT); thang vật dựng 4 nấc; khuôn sổ phiên thêm `reaction:` · `options:` · `divergence:` |
| `scripts/gate-card.js` | thẻ Cổng Phạm vi hiện nấc phản ứng bằng nhãn tiếng người + có/không bộ phương án; ba nhánh cờ vàng đọc-cũ |
| `feature-loop/.../SKILL.md` | đoạn S1-D chép NGUYÊN VĂN câu nấc-mặc-định từ mốc neo; manifest `REACTION-DEFAULT-SITES` |
| `GUIDE.md` · `commands/acceptance-init.md` | lấp lỗ hai ổ cắm `design_pass.ds_skill` + `feature_loop.ui_standards_skill` |
| `_acceptance/.../rang-cau-chet.sh` | răng «câu chết phải chết», đối chứng dương neo mốc git cố định `BASE-DPNKDB` |

Bốn phép đo đã **phá thử tay** và chứng minh có răng:
lệch một chữ giữa thang trong nghi thức và bảng nhãn trong bộ dựng thẻ → đỏ ·
xoá cờ giá trị-lạ → đỏ · xoá vế «không có đường bỏ im lặng» → đỏ ·
tiêm câu chết vào một file THỨ BA → đỏ.

---

## 4. Vì sao dừng — lớp lỗi lặp, không phải chi tiết lỗi

Cùng MỘT lớp qua hai vòng: **đo LỜI bằng phép so chữ, và phép so chữ luôn còn
chỗ trốn.** Bốn hình dạng đã dẫm, tất cả trong bộ ca do phiên này viết:

1. **chuỗi `else-if`** — mutant bắn nhánh trước làm nhánh sau không bao giờ chạy
   (vế lõi AC-6 thành assert chết ở vòng 1);
2. **đo bản in dự phòng** — thẻ luôn in id thô khi không có nhãn, nên assert chỉ
   đòi thấy id là đo bản in dự phòng chứ không đo cờ (xoá cờ, ca vẫn xanh);
3. **phép `HOẶC` trong assert** — một vế của phép hoặc chết mà không ai biết;
4. **danh sách cấm / danh sách cho phép trên không gian mở** — chỉ bắt được đúng
   chữ người viết nghĩ ra; bản chép thứ ba ngoài danh sách lọt.

Và một lớp nền: **bảng hứa ở một chỗ, bản chép thứ hai không sửa** — bảng ma
trận mutant ở đầu `evals.yaml` được đính chính, nhưng bản chép trong `question:`
của E14 trong cùng file thì không.

Điều đáng ghi nhất: lớp này **đã được phản biện trước-khi-code nêu ở mức P0**, và
phiên này tuyên đóng nó — nhưng đóng TRÊN GIẤY (viết bảng vào hợp đồng) rồi thi
công không giao đúng bảng. Hứa trong hợp đồng mà không giao, trong khi ca vẫn in
xanh, là dạng nặng nhất của thước tự dối ở kho này.

**Tin tốt:** hội đồng ma trận mutant (E14) **vòng 2 đã ĐẠT** — đúng thứ trượt ở
vòng 1. Và mọi lỗ nặng cả hai vòng đều rơi vào phần **đo chữ**, không rơi vào
phần **đo đầu ra thật**. Đó là căn cứ của khuyến nghị B.

---

## 5. Nếu owner chọn B — làm chính xác những gì

1. Cắt khỏi `evals.yaml` các phép đo CHỮ: E1–E8, E11, E12 (và các ca DP tương ứng).
2. Giữ phần đo ĐẦU RA thật: **E9** (khớp vòng khuôn→thẻ) · **E10** (ba nhánh
   đọc-cũ) · **E15** (nhánh không có sổ phiên) · **E13** (răng câu-chết).
3. Các tiêu chí mất lưới máy → sửa văn AC thành «người duyệt soi tại Cổng Phạm
   vi», ĐÚNG khuôn mà `dac-ta-ux-vat-hoa-cau-truc` đã dùng (xem `Out of scope`
   của hợp đồng ô đó).
4. Ghi entry `descope` có tên vào `decisions.jsonl`, nêu rõ đổi lại được gì.
5. Mở hạt giống cho phần cắt (kho có nếp này: xem
   `docs/plans/2026-08-24-hat-giong-khop-vong-dac-ta-ux.md`).
6. Chạy lại lane khi bộ phân loại hồi → mới có bằng chứng thật.

---

## 6. Sáu finding NGOÀI hợp đồng — để dành cho Cổng Bằng chứng, ĐỪNG sửa lén

Luật phân loại phạm vi cấm sửa chúng trong vòng fix. Owner quyết ở cổng: ghi
Known limits · mở ô mới · hay nâng phạm vi.

- `CONTEXT.md` chưa có mục nào cho từ vựng đóng mới (`reaction` · `options` ·
  `divergence` · bốn nấc). Tiền lệ: trục ngữ cảnh có hẳn hai mục glossary.
- `evals.yaml` — `question:` của E14 còn ghim bảng ma trận LỖI THỜI (7/14 ô sai).
- `evidence-report.md` vòng 1 commit cùng lượt với bản sửa chính vật nó đo →
  `verified_commit` trỏ cây trước bản sửa.
- `feature-loop/.../SKILL.md:60` — hai ngoặc đơn dính nhau làm chú giải `context:`
  treo nhầm vào mục `reaction:`.
- `scripts/gate-card.js` — chép lần thứ hai danh sách id nấc vào chuỗi thông điệp,
  không phép đo nào ghim.
- `skills/design-pass/SKILL.md` — `divergence:` có trong khuôn nhưng **không bộ
  đọc nào đọc**; câu «không có đường bỏ im lặng» hiện mạnh hơn lưới thật có.

---

## 7. Bẫy đã dẫm — phiên sau đừng dẫm lại

- **`| tail` nuốt mã thoát.** `bash run-tests.sh | tail -12` trả mã thoát của
  `tail`. Suýt đọc «exit 0» thành xanh trong khi bộ kiểm báo 4 ca đỏ. Ghi thẳng
  ra file rồi mới đọc.
- **`set -o pipefail` + `grep` không-khớp** làm script chết im lặng, thoát 1,
  không in gì — mà không-khớp chính là kết quả ĐÚNG ở chân đo cây sạch. Đỏ hạ
  tầng đội lốt đỏ vật.
- **Từ vựng host bị cấm trong nguồn engine** (`Creator` · `canvas` · `OneHub`,
  lưới P139). Đề bài 19/08 viết «canvas» suốt — hồ sơ và nghi thức phải dùng tên
  khác; hạt giống giữ nguyên chữ cũ làm sử liệu.
- **Khuôn bảng chuẩn chỉ được sống MỘT chỗ** (lưới P93, kim là cụm chữ «Người
  dùng thấy gì khác» — bắt cả tiêu đề mục, không riêng dòng bảng).
- **Đổi khuôn sổ phiên làm đỏ SÁU bộ dựng hồ sơ thử** trong `run-tests.sh`; chỉ
  MỘT trong sáu có phép khẳng định «không còn chỗ trống sống». Vá cả sáu.
- **Truyền `toolKillRule` phải là TRỌN FILE kèm cặp mốc neo**, không phải phần
  ruột — thiếu mốc thì workflow trả BLOCKED (fail-closed, đúng thiết kế).
- **Bản đồ sản phẩm lệch mỗi khi tên hồ sơ đổi** → `node scripts/product-map.mjs
  --root .` rồi commit cùng lượt.

---

## 8. Lệnh vào lại

```bash
cd /Users/manhphan/dev/acceptance-gate-kit && git checkout feat/design-pass-nac-khong-dong-bo
```

Rồi `/feature-loop design-pass-nac-khong-dong-bo` — hồ sơ ở `implemented` nên
vòng lặp sẽ vào S4. **ĐỪNG chạy S4 ngay**: lấy câu trả lời A/B/C của owner
trước, vì đường B đổi chính bộ đo mà S4 sẽ chạy.
