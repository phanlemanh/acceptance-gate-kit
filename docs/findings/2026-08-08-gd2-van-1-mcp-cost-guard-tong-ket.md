# GĐ2 ván 1 — `mcp-cost-guard` @ floorplanstudio: hồ sơ tổng kết vòng

*2026-08-08 · Soạn: phiên B (cố vấn) trên bằng chứng đã kiểm độc lập · Bối cảnh
bắt buộc: [charter tái lập](../handoff/2026-08-07-handoff-tai-lap-va-trien-khai-doi.md)
· [GĐ1 dừng, GĐ2 mở](../handoff/2026-08-08-handoff-dung-2-0-0-mo-gd2.md) ·
sổ vấp: [so-vap-trien-khai.md](../research/so-vap-trien-khai.md).*

Đây là **feature thật đầu tiên đi trọn vòng ở một repo tiêu thụ** — điều mà 29
việc trước đó (toàn kit-sửa-kit) chưa từng làm được, và là mục đích GĐ2 sinh ra.
Chạy trên bản đội đang dùng: acceptance-gate **1.39.0** / feature-loop
**1.27.0**. Kết quả: **KÝ + merge-ready**, đếm **1/≥3** cho điều kiện mở lại lab.

## 1 · Vòng đời, đo từ git (không có con số tự khai nào)

| Mốc | Bằng chứng |
|---|---|
| Khói 3 lệnh → mở vòng | sổ vấp dòng 18–19; suite nền 415/415 |
| S1: thiết kế trình chờ duyệt, chưa ghi file | phiên A idle tại câu hỏi duyệt; đĩa sạch (B kiểm) |
| Cổng 1: 12 AC + 13 eval, gap-probe bắt 2 P0 thật | `gap-probe.md` (E9 tự-chứng-minh; I-6 có thể xanh-mà-còn-nợ) |
| S3+S4: 2 vòng đúng ngân sách | r1 REJECT (cổng tự đỏ — vấp #20), r2 0 phép đo trượt, 437/437 |
| Cổng 2: PENDING-JUDGMENT → người quyết | E8b judgment chờ `human_override` — máy không tự PASS |
| Ký | `ffc09af` — commit chữ ký riêng, 3 dòng người |
| Vá cổng recheck + re-pin | `766634b` → `061d40f`, run_id `repin-20260808-mcp-cost-guard-lane1`, suites `[0,0,0,0]` |
| Pre-merge | `clean` exit 0 — B chạy lại độc lập, cùng kết quả |

**Sự kiện cần người: 3 lần theo luật T3** (Cổng 1 · Gate 1.5 · ký) — ngưỡng
"≤2/feature" đã khai là cho feature thường; đề nghị từ nay **ghi ngưỡng theo
tier** (T2 ≤2, T3 ≤3) để số không bị đọc oan. Ngoài luật: 5 tương tác phụ
(duyệt thiết kế S1 · gõ status hộ khối dán B · 2 lượt gõ hụt vì tên lệnh thật là
`/acceptance-gate:signoff` · đọc 4 giá trị ký). Phần lớn là chi phí lần-đầu,
nhưng tên lệnh khó tìm là vấp thật của rollout đội.

## 2 · Ba viên ngọc — lần đầu được kiểm bằng ván thật, cả ba đứng vững

1. **Cổng 1 duyệt tiêu chí trước code**: chặn được 2 lỗi chữ-không-khớp-vật
   *trước* khi một dòng code nào ra đời (nhãn "số dòng export" sai vật; coverage
   11→12), và gap-probe tự bắt được lỗ "bộ tiêu chí xanh trọn mà nợ I-6 còn
   nguyên" rồi tự vá bằng AC-12/E12 — phép đo sau đó chứng minh nợ trả thật.
2. **Bằng chứng không giả được**: lưới staleness bắt đúng cả khi **chính bản vá
   công cụ** làm bằng chứng cũ đi (không có ngoại lệ cho ai); re-pin gỡ đúng
   nghi thức mà không đụng một ký tự chữ ký; hook bắt subagent review sửa cây
   thật (SECURITY WARNING, vấp #21); recheck khi sống dậy chấm evidence thật
   exit 0 — ba nguồn độc lập (panel · B · A-tại-cổng, sha256 trùng) hội tụ trên
   E8b.
3. **Luật dừng**: máy A dừng đúng 3 lần trong một ván (khoá cổng người chặn khói
   1a · engine chặn-merge · lệch phạm vi khoá khi re-pin lộ đường gỡ mới) —
   không lần nào tự xử, không lần nào cãi. GĐ1 chết vì luật này được tôn trọng;
   GĐ2 chạy được cũng vì nó.

## 3 · Kit lộ gì — giá trị thật của GĐ2, không ván thật thì không bao giờ thấy

Lớp chung của các lỗ nặng: **"vật chép sang consumer" chưa từng được đo ở phía
consumer** — đúng bài học đã ghi sổ từ trước, nay có xương thịt:

- `scripts/recheck-evidence.js` (CJS) **chưa từng chạy được một lần nào kể từ
  init** trong repo khai `"type": "module"` — tầng recheck của bộ cưỡng chế câm
  lặng mà mọi suite tự-host của kit vẫn xanh (kho kit không có `package.json`
  gốc nên `.js` = CJS ở xưởng, = ESM ở repo tiêu thụ).
- `acceptance-init` chép `lib/` **thiếu** (`gap-probe.js`) → cổng phản biện phía
  pre-merge `NOT ENFORCED` từ đầu (vấp #12/sổ).
- Cổng tự làm mình đỏ bằng vật nó đẻ ra (workspace mới → PRODUCT-MAP lệch),
  cháy trọn vòng chấm r1 (vấp #20).
- Subagent review dám sửa cây thật để thử giả thuyết — harness bắt và có hoàn
  tác, nhưng nếu nó chết giữa chừng thì kho hỏng câm (vấp #21).
- Vận hành: snapshot skill đóng băng theo phiên (vấp #10) · clone marketplace
  stale làm update câm (vấp #15) · trường người trong frontmatter phải một dòng
  (vấp #10-11/0bc2c3e) · tên lệnh cổng cần prefix plugin, khó gõ đúng.

**Phân loại xử lý** (đúng luật đóng băng — bugfix được phép, không mở vòng meta):

- → **Đề bài 1.39.1 (bugfix)**: lớp `.cjs` cho mọi file chép sang consumer +
  danh sách chép đủ bộ `lib/` + audit `node -e '…require(…)'` nội tuyến +
  2 cảnh báo lint trong recheck. Một đợt, quét theo lớp, không vá lẻ.
- → **Đề bài GĐ4 (cần bằng chứng thêm, KHÔNG làm bây giờ)**: cổng-tự-đỏ theo
  vật-của-vòng (thiết kế lại staleness cho artifact máy sinh) · rào subagent
  review khỏi cây thật (worktree riêng) · ngưỡng gọi-người theo tier.

## 4 · Cách vận hành hai-phiên A/B — lần đầu chạy trọn một ván

Vai gắn với **phiên**, không với máy; từ hôm nay cả hai chạy trên một máy, B đọc
trực tiếp phiên A (session-mgmt) và vật trên đĩa thay vì chờ dán thẻ. Giá trị đã
chứng minh bằng việc cụ thể: B bắt sổ-đóng-GĐ1-trên-nhánh-chết trước khi nó thành
vĩnh viễn; bắt 2 lỗi chữ-vật trước Cổng 1; xác nhận HIGH của reviewer tận fixture
(80 wc × 68m²); tái tạo độc lập bằng chứng E8b. Chi phí cũng thật: khối dán của
B từng giao lệnh cổng-người cho máy (vấp #18-19) — nghi thức mới cho B: mọi lệnh
giao máy phải qua phép thử "có phải 1 trong 6 thao tác cổng người không".

## 5 · Đối chiếu ngưỡng khai trước (khai 2026-08-08, TRƯỚC ván)

| Ngưỡng | Thực tế ván 1 | Đọc thế nào |
|---|---|---|
| 0 lỗi chặn-việc | **2** (snapshot phiên #10 · recheck chặn merge) | Cả hai gỡ trong ngày; ván 1 đã khai trước là THÁM HIỂM — ngưỡng này chấm ở quyết-phát-hành-đội sau 2–3 feature, không chấm ván đầu |
| Bị gọi ≤ 2/feature | 3 (luật T3) + 5 phụ | Đề nghị ngưỡng theo tier; phần phụ đa số là chi phí lần-đầu |
| Owner "muốn dùng tiếp tuần sau" | *— owner tự điền, không ai điền hộ —* | |

## 6 · Việc kế (theo thứ tự)

1. Merge PR `feat/mcp-cost-guard` (CI chạy đúng bộ pre-merge đã xanh local).
2. Dọn T1 nhóm chữ-trôi bên floorplanstudio (5 mục known-limits nhóm A +
   `docs/handoff/README.md` còn nói Spec 1 chưa merge).
3. Kit **1.39.1** — một đợt bugfix theo lớp (mục 3), bump số thật, sync mirror.
4. Feature thật #2–#3 trên 1.39.0/1.39.1 → đủ điều kiện xét mở lại lab.
5. **Cổng Giá trị (uat-session) lần đầu** trên thứ đã ship — món GĐ2 chưa chạm.
