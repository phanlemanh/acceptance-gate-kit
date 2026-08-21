# Hạt giống — ô nuốt luật: đổi hai ô hỏi-khẩu-vị thành ô hỏi-phép-đối-chiếu

*Trạng thái: sống ở `_acceptance/o-nuot-luat/opportunity.md`. Sinh 15/08 từ điều tra
[«khuôn nuốt luật — hai họ luật kit»](../findings/2026-08-15-khuon-nuot-luat-hai-ho-luat.md)
trên hồ sơ Cổng Đáng `trang-tu-van-v2-r4` của `artifact-platform` (PR #352).
Vòng điều tra KHÔNG sửa file kit; tệp này là đề bài cho vòng riêng, đúng
nhóm 1 của §7 findings — không gộp nhóm 2 (U4+U5) hay nhóm 3 (Cổng 0 không
có chiều đỏ).*

## Lỗi

Bản mẫu Cổng Đáng viết luật bằng chữ — *hình thái mặc định KHÔNG kế thừa,
chuẩn repo tiêu thụ thắng* — nhưng ô ngay dưới không có chỗ để ghi «mặc định
đã áp, đây là căn cứ». Hai lối duy nhất ô cho phép là điền `không` trơ hoặc
đẩy lên người; lối đẩy-lên-người là lối duy nhất *trông giống đã suy nghĩ*.
Phiên r4 viết đúng phép suy ba dòng dưới bảng, rồi **vẫn** đẻ ra một câu hỏi
thừa cho người tại Cổng 0. Hỏng ở **định tuyến**, không ở suy luận: kết luận
có sẵn nhưng không ô nào nhận nó nên nó chảy vào ô chữ ký.

Cùng section, ba gạch `## Cổng 0` trống cạnh nhau tự đọc thành ba câu hỏi —
ca r4 nở thành ba câu người, câu thứ ba là câu thừa.

Đây **không** phải «luật làm model kém đi»: cùng hồ sơ ấy, luật ép ĐO bắt 4 lỗi
thật và lôi ra 1 phát hiện đổi kế hoạch; cột bảng bị nghi là thủ phạm
(`Chạm t3_paths?`) lại là cột bắt lỗi nặng nhất. Việc là **chuyển hai ô từ họ
ép-hình-dạng sang họ ép-đo**, không phải bớt luật.

## Ý định — ba món, cùng MỘT section của MỘT file

Vật: `skills/acceptance/references/opportunity-template.md`, đoạn «Nguồn ngoài
& phạm vi kế thừa» + «Cổng 0».

1. **U1 — cột `Kế thừa?` mang mặc định in sẵn.** Ô mẫu ghi thẳng
   `không (mặc định)` cho hình thái; cột `Người ký` đổi thành *căn cứ / ai ký
   (chỉ khi kế thừa)* — chỗ điền là **câu suy**, không phải tên người. Giá trị
   `chờ ký` không còn là hình dạng hợp lệ của ô.
2. **Phép thử chủ ngữ — chiều đỏ của U1.** Dòng phân loại hình thái phải kèm
   kết quả bốn động tác: chép nguyên văn câu mở màn của bề mặt đang sống (nhãn
   tab, tiêu đề, nút chính) → gọi tên chủ ngữ → so với chủ ngữ khung mới trong
   hồ sơ → lệch ⇒ `không` + câu suy; không lệch ⇒ `có` + câu suy. Đỏ được vì
   chủ ngữ suy từ **chuỗi thật trong cây nguồn**, mở file ra là cãi được. Chạy
   thử trên r4 nó tách đôi câu hỏi phiên đã gộp (workbench LỆCH · thẻ căn +
   trang sống KHÔNG lệch) mà không tốn lượt gọi người nào.
3. **U3 — `## Cổng 0` trình đúng MỘT quyết định.** Bản mẫu nói thẳng:
   `decision` là câu người; `disposition` và ngưỡng UAT là
   **mặc-định-kèm-căn-cứ-và-cửa-veto** (đúng luật gọi người toàn cục).

Trace: nguyên tố 3 (khoảnh khắc quyết thật — bớt một câu hỏi thừa mỗi hồ sơ
Cổng Đáng) · người hưởng: owner ký Cổng 0 của mọi repo tiêu thụ. Nếp «chỉ TRỪ,
không CỘNG»: một ô đang hỏi khẩu vị được đổi thành ô hỏi phép đối chiếu; không
đẻ cơ chế mới, không thêm file.

## Điều đã kiểm trước khi mở — để hồ sơ khỏi dò lại

- **Máy chỉ đọc frontmatter của opportunity.md** (`lib/workspace-record.cjs`
  khoá `stage` · `decision`; `start-scan.mjs`, `product-map.mjs` đi qua cùng
  reader; P82 round-trip khối `OPP-FRONTMATTER-TEMPLATE`). Ba món trên chạm
  **thân văn** dưới frontmatter — không reader nào đổi, `schema_version` giữ
  nguyên, **không cần đường đọc-cũ kiểu cờ vàng**. Hồ sơ phải khai điều này
  tường minh chứ không im lặng.
- **P83 ghim 13 anchor** của bản mẫu (tên section + ba cụm *triết-lý/logic* ·
  *ngôn-ngữ-thiết-kế/hình-thái* · *không phân loại = chưa đủ điều kiện ký Cổng
  0*). Giữ nguyên chuỗi; đổi cột bảng không chạm anchor nào. Cần thêm anchor
  cho mặc định in sẵn thì thêm vào P83 (đã có đối chứng âm theo lớp) chứ
  không viết case mới cùng hình dạng.
- **Con trỏ tới file** (`commands/start.md`, P-case đóng gói) chỉ trỏ đường
  dẫn — không đổi tên/đường dẫn file.
- `skills/**` không nằm trong `t1_skip_globs` → PR là T2, đi trọn nghi thức
  tự-host: hồ sơ `_acceptance/<slug>/` + eval + bằng chứng + bản đồ vẽ CÙNG
  lượt chữ ký.

## Điều kiện vào Cổng 1 — thước cho lời hứa hành vi

Lời hứa của cả ba món là **loại B** (một phiên đọc bản mẫu rồi điền ô thế nào)
— grep không đo được; nếp 1c áp nguyên: **hội đồng phiên sạch, bảng đáp án viết
TRƯỚC, bắt buộc trước Cổng 2**.

- ≥3 ca judgment, trong đó:
  · **ca tái hiện** — vật liệu hình thái + luật đã có mặc định (đúng hình r4,
    dựng lại từ đề bài mở, KHÔNG chép opportunity.md thật của artifact-platform
    vào kit): đáp án đúng là ô điền mặc định + câu suy, không có câu hỏi cho
    người;
  · **ca giữ-gân** — vật liệu mà luật CHƯA định mặc định (đánh-đổi thật): đáp
    án đúng là **vẫn** lên người — chứng minh việc cắt không nuốt luôn khoảnh
    khắc quyết thật;
  · **ca chống-a-dua** — đề bài hỏi ngược («chỗ này có nên hỏi owner không?»)
    để xem agent có chiều theo câu dẫn.
- Đề bài ca **không mớm đáp án**; agent hội đồng không-tool, nạp thẳng bản mẫu
  mới, đáp án ở thư mục riêng (nếp 1c).
- Lớp máy chỉ nhận vai **mực đã in**: chuỗi mặc định có mặt trong ô mẫu +
  P83 vẫn xanh + đối chứng dương thật trên `main` (bản cũ KHÔNG có chuỗi ấy —
  đây là needle có thật, không phải `base=0` gõ theo trí nhớ).
- Nghi thức phá-thử một lần cho mỗi chân mới: phá bản mẫu trong bản sao, thước
  phải đỏ.

## Ràng buộc

- KHÔNG chạm `morphological-scan/SKILL.md` (U4) hay cột `Trạng thái` của bảng
  giả định (U5) — nhóm 2, mở riêng nếu owner muốn.
- KHÔNG gỡ hay thay con trỏ `red-team D2` (dòng 1 và dòng 41 của bản mẫu) —
  đó là nhóm 3, một **quyết định thật** giữa gỡ-con-trỏ-chết và cấp-cho-Cổng-0
  -một-chiều-đỏ; gộp vào đây là giấu quyết định trong một PR sửa bảng.
- Không mở rộng sang `contract-template.md` (`## Out of scope` ≥2 bullet giữ
  nguyên — đã có `descope` ledger làm chiều răng).
- Merge theo nhịp release: bản mẫu đổi thì repo tiêu thụ nhận ở lần re-pin kế,
  không đổi engine dưới chân vòng r4 đang giữa Cổng 0.
