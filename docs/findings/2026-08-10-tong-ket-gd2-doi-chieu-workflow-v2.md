# Tổng kết GĐ2 — đối chiếu ba ván thật với spec Workflow v2

*2026-08-10 · Soạn: phiên B theo lệnh owner ("tổng kết đi"), trước reflect lớn.
Dữ liệu: 3 feature trọn vòng (2 merged · 1 kill-tại-Cổng-Giá-trị) · 57 dòng sổ
vấp · lần chạy đầu của: Cổng Đáng (×2), pivot-tại-cổng, park, uat-session.
Đối tượng đối chiếu: `docs/specs/workflow-v2-spec.md`. Mục 3 là điều tra
design-pass theo yêu cầu owner. Owner bổ sung ý tại phiên này → amend trực
tiếp vào file.*

## 1 · Spec đúng ở đâu — chứng thực bằng ván thật

| Mảnh spec | Phán quyết | Bằng chứng nặng nhất |
|---|---|---|
| **Nhịp KHAI→LÀM→ĐO→QUYẾT** | CHỨNG THỰC | Ngưỡng UAT khai tại Cổng Đáng đứng nguyên tới lúc vỡ trung thực; điều kiện quay-lại-cổng TỰ KÍCH khi X=5% vỡ (không nới lặng lẽ); "đổi thước phải là quyết định có ghi" giữ được cả khi model mới xuất hiện (gemini-3.6 trượt 3/3 → giữ ghim) |
| **Luật 3 — doer≠grader** | CHỨNG THỰC (cả hai chiều) | Chiều thuận: judge đòi bằng-chứng-thiếu → A bổ sung bằng chứng thật (chặn mạng playwright), không sửa wording; recheck chặn 2 lỗ thật trước chữ ký. Chiều nghịch: lần duy nhất vi phạm (doer tự khai "khớp mắt") → owner bắt overlay lệch xa — vi phạm luật là ăn đòn ngay |
| **Định lý tự-động-hoá thì QUYẾT** | CHỨNG THỰC | Máy tự lặp round hợp lệ (verify 3 vòng); chữ ký không máy hoá được (mọi uỷ-quyền-qua-tin đều bị A đòi lời-người); quyết-máy để vết (run-log, Iterations) |
| **Vòng HIỂU + 4 câu hỏi thực tế** | CHỨNG THỰC, GIÁ RẺ BẤT NGỜ | Pivot refine-editor→digitize tại Cổng Đáng với giá 0 code; câu 4 (kiểm kê máy) tìm ra pipeline-tháng-5-kẹt-ở-vector = mắt xích thiếu có hồ sơ; grill lửng ("câu kết dấu hỏi") được vận-hành-hoá thay vì đoán |
| **Đo-tại-UAT (triết lý trung tâm)** | **CHỨNG THỰC — phát hiện lớn nhất GĐ2** | Mọi cổng máy xanh (39 test · 15 eval · 5 màn design · 3/3 VLM live) mà người đầu tiên nói "chưa dùng được cho khách". Máy đo ĐÚNG HÌNH; chỉ Cổng Giá trị đo được ĐỦ DÙNG. Chạy lần đầu, trả tiền vé ngay |
| **Funnel PRODUCT-MAP = truy vấn trạng thái** | CHỨNG THỰC | Lần đầu sống đủ trạng thái thật: cân nhắc 1 · xếp-lại 1 · đã-giao 2 · đã-nghiệm-thu (kill) 1 |

## 2 · Spec bị thực tế SỬA LẠI ở đâu

1. **Luật 5 ("cổng người chỉ đặt ở nhịp đảo-ngược-đắt") mô tả THIẾU vai trò
   người.** Số thật ván 3: 4 cổng đúng ngưỡng + **6 lượt can-thiệp-giữa-build**
   — và mắt owner bắt **2/4 lỗi nặng nhất** (overlay lệch, bản vẽ lộn ngược)
   mà không cổng máy nào thấy. Người không chỉ đứng ở cổng; người đan vào
   giữa dòng, và chỗ đan đó CHỊU LỰC. Spec cần một khái niệm mới: **mắt-người-
   giữa-dòng** là một tầng đo chính danh (rẻ, bắt lớp máy-mù), không phải
   "can thiệp ngoài quy trình". → đề bài reflect lớn: mô hình hoá chỗ đan này.
2. **Đường GIAO-HÀNG thực tế là acceptance-direct, không phải feature-loop
   workflow.** Cả 3 ván chạy 3-phase trực tiếp (workflow S4 hỏng ở strict từ
   1.27.2-không-ship). Spec coi feature-loop là đường chính — thực tế nó là
   đường *tuỳ chọn chưa chín*. → spec v2.1 nên công nhận acceptance-direct là
   first-class, feature-loop workflow là tăng-cường khi ổn định.
3. **"2 điểm dừng human" (Gate 1 + Gate 2) là mô tả của đường C, không phải
   đường A.** Đường A thật: Đáng + 1 + 2 + UAT = 4, cộng grill là nội dung.
   Ngưỡng gọi-người phải khai THEO ĐƯỜNG — đã học ở ván 2 (T2 vs T3) và ván 3.
4. **Thang lối thoát cần ĐỒNG HỒ, không chỉ tên bậc.** Timebox 16h chia
   5h/7h/4h với trigger đo-bằng-giờ là thứ làm descope khả thi; spec chỉ nói
   "timebox" chung. (Ván 3: 95 phút thật — thang ngủ yên, nhưng nhờ có nó mà
   nấc-C được duyệt không run tay.)

## 3 · Điều tra design-pass "mức 3" (yêu cầu owner)

**Hiện tượng owner nêu:** chọn mức chạy-UI-thật → trong quá trình,
*prototype và sản-phẩm-bàn-giao là một*. "Kiểm tra lại chỗ này."

**Sự thật đối chiếu spec:** đây KHÔNG phải vi phạm — nó là hệ quả trực tiếp
của nguyên tắc **một-mặt-phẳng** ("mọi vòng lặp trên artifact thật") cộng
thang vật liệu bậc real-components. Proto == product là *thiết kế có chủ đích*
của spec, và dữ liệu ván 3 cho thấy nó CHẠY TỐT: chính vì owner xem vật thật
giữa dòng mà 2 lỗi nặng bị bắt sớm (nếu xem mock thì overlay lệch không bao
giờ lộ).

**Owner truy tiếp và trúng tâm (amend tại phiên tổng kết): "proto==product
có nghĩa là đang bỏ qua giai đoạn design cả UX/UI?" — ĐÚNG, và sắc hơn phân
tích ban đầu của B.** Tách ba thứ bị trộn: (a) THIẾT KẾ UX/UI = hoạt động tư
duy có chủ đích, có so sánh phương án; (b) PROTOTYPE = phương tiện trò chuyện
thiết kế; (c) DESIGN-PASS = nghi thức mắt người. Một-mặt-phẳng chỉ nói về
(b) — vật liệu nên là đồ thật; nó KHÔNG BAO GIỜ nói bỏ (a).

**Ván 3 đã bỏ (a) thật — và vi phạm chính spec S1-D mà không ai kêu:** spec
đòi "Gate 1 duyệt trên bản bấm được, không duyệt UI bằng chữ"; thực tế UI vào
phạm vi qua pivot Q4, Gate 1 duyệt trên chữ, UI dựng sau plan (Task 9–13),
design-pass thoái hoá thành QA-bằng-mắt hậu-build. Mọi quyết định UX do agent
code quyết NGẦM trong lúc gõ. **Hoá đơn nằm trong biên bản UAT: 3/4 lý do C2
chết là lỗi THIẾT KẾ thuần — thông tin ("ô nào tính tường"), độ đủ mô hình
("thiếu cửa sổ/lô gia"), phủ luồng ("không xoá được hallway"). Không lỗi nào
là lỗi code.**

**Vì sao bị bỏ mà không ai thấy: build rẻ quá** (95 phút cả UI) làm "dựng
luôn" có vẻ rẻ hơn "thiết kế đã". Hệ luận North Star mới, owner + B cùng rút:
**khi LÀM rẻ đi trăm lần, giá trị dồn về KHAI — thiết kế chiếm tỉ trọng LỚN
hơn, vì sai-ở-tầng-ý-định thành loại sai duy nhất còn đắt.**

**Đề xuất sửa (spec/2.1, không cơ chế mới — là UN-SKIP một bước spec đã có):**
1. Feature chạm UI đường A/B: S1-D chạy ĐÚNG SPEC — khoảnh khắc thiết kế
   TRƯỚC Gate 1, trên vật liệu thật (skeleton màn bằng component thật — rẻ,
   95' đã chứng minh), trả lời các câu THIẾT KẾ: màn phải NÓI gì (information
   design) · mô hình tinh thần đủ chưa · luồng thao tác nào có/không (ô
   đã-loại-có-ý-thức) — một "grill thiết kế" song sinh với 4-câu-hỏi.
   Gate 1 duyệt trên bản bấm được như spec vốn viết.
2. Cuối mỗi phiên design-pass mượn trước câu UAT: "anh có dám đưa màn này cho
   khách xem NGAY BÂY GIỜ không? vì sao chưa?" — diễn tập C2 sớm.
3. Việc chữ: bỏ từ "prototype" khi bậc real-components (gọi: phiên mắt-người
   trên vật thật); đặt tên thang vật liệu bằng tiếng người (vụ "mức 3" hiểu
   lệch — lỗi đặt tên, đã ghi sổ).

## 4 · Số tổng GĐ2 (đã kiểm từng con số)

3 feature / ~3 ngày · sổ vấp 57 dòng (≈10 lớp) · ván 3: 26+1 commit, ~20
subagent, 95' build/16h ngân sách · bảng giá-trị-theo-tầng chốt: cổng-máy
bắt lỗi hồ-sơ xuất sắc + recheck bắt lỗi chất-lượng-bằng-chứng (đã trả tiền
thuê) · chân chấm độc lập bắt lỗi vật · mắt người bắt lỗi máy-mù (4 ca) ·
Cổng Giá trị bắt khoảng-cách-đúng-hình-vs-đủ-dùng (1 ca, duy nhất nó bắt
được). Không tầng nào thay được tầng nào — prune ở GĐ4 phải theo bảng này.

## 5 · Bàn giao cho reflect lớn

1. Mô hình hoá **mắt-người-giữa-dòng** (mục 2.1 trên) — câu hỏi trung tâm.
2. GĐ3 rollout đội: giờ kit đã có 3 ván bằng chứng + 1.39.1 ổn định — thông
   báo #2 viết bằng gì từ bảng số này?
3. Thứ tự 2.1 (điều kiện mở ĐÃ ĐẠT): stale-theo-diff-PR (phân tích sẵn) ·
   khối VIỆC-CỦA-ANH vào khuôn máy · một-lượt-gõ + `--repo` · card Cổng 0/UAT
   · quy-ước-đo cạnh ngưỡng trong template · chiều-đỏ-đã-chạy trong khuôn
   eval · runner exit-code · đặt tên lại thang vật liệu + câu-C2-sớm cho
   design-pass (mục 3).
4. Trace-v2 và số phận hướng số hoá — chờ tín hiệu Trang Tư Vấn.
