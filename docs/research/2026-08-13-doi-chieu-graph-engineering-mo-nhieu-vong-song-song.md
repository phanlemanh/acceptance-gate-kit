# Đối chiếu Graph Engineering ↔ kit — dưới ý định mở nhiều vòng feature song song

*2026-08-13 · Soạn: phiên cloud theo yêu cầu owner («phân tích kỹ tài liệu
Graph Engineering và đối chiếu với Acceptance Gate Kit với ý định tăng tốc mở
nhiều Feature Loop»). Nguồn đối chiếu:
[bản chưng cất GE 29/07 + cập nhật 05/08](2026-07-29-graph-engineering-karpathy-anthropic.md)
· [bản neo «người về biên» 12/08](../plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md)
· [tổng kết lớn đợt tái lập 12/08](../findings/2026-08-12-tong-ket-lon-dot-tai-lap.md)
· hồ sơ xưởng tại HEAD. Đây là tài liệu PHÂN TÍCH, không phải đề bài — mọi
khuyến nghị ở §6 đều phải qua phép thử North Star trước khi thành việc.*

## 1 · Đề bài và thước

«Tăng tốc mở nhiều Feature Loop» đọc theo North Star 12/08 nghĩa là: **nhiều
vòng SẢN PHẨM ở repo tiêu thụ chạy đồng thời, người đứng ở biên** — không phải
mở thêm vòng kit-sửa-kit (giờ-kit là chi phí). Thước đã chốt trong bản neo:
**M1** (số lần chặn owner trong một vòng T2 xanh sạch: 4–5 → 1) và **M2** (chữ
ký chỉ còn ở nơi có đánh-đổi hoặc khó-đảo). Mọi phân tích dưới đây quy về một
câu: *cái gì NHÂN LÊN theo N khi N vòng chạy song song, và cái gì chặn trần.*

## 2 · Sổ sách trước đã: hàng đợi GE duyệt 05/08 đã thi hành XONG

Điều dễ trôi nhất khi đọc lại tài liệu GE: gap ranking của nó không còn là
danh sách việc. Kiểm tại HEAD (frontmatter hồ sơ xưởng):

| Món GE | Hồ sơ | Trạng thái |
|---|---|---|
| G1 trí nhớ xuyên feature | `cross-feature-claim-index` (+ 2 vòng hardening) | **signed-off**, đo GO: 9/12 feature có citation |
| NG3 stale-cascade (một phần) | `delta-verify-repin` (T3) + chip ① staleness-theo-diff (1.39.2) | **signed-off** cả hai |
| NG2 thước-đo là bề mặt lỗi | `matrix-measure-law` | **signed-off** |
| G2 + mầm G5 | `judge-required-evidence` (gộp gold-seed) | **signed-off** |
| G4 budget khai trước · G6 swarm/DAG · semantic matching · persist index | — | **từ chối có căn cứ**, giữ nguyên |

Tài liệu GE với tư cách *nguồn đề bài* đã cạn: món đáng làm đã làm, món không
đáng đã ghi lý do. Đối chiếu lần này vì vậy không đào tài liệu tìm món mới —
nó hỏi hai câu khác: (a) các **nguyên tắc** của tài liệu nói gì về bài toán
N-vòng, (b) **số vận hành** 08→12/08 nói gì về chỗ N-vòng sẽ gãy.

## 3 · Năm nguyên tắc GE còn sức nặng khi áp vào N vòng

1. **Bốn điều kiện autonomy là điều kiện VÀO của song song hoá.** «Không
   verify được thì đừng bắt đầu bằng autonomy» — suy ra: chỉ nhân bản vòng đã
   đủ bốn điều kiện, đừng nhân vòng còn người đứng giữa. Kit hiện đủ 3/4 cho
   một vòng T2 (output đo được: contract+eval · chu kỳ ngắn: trần 3 vòng ·
   biên: `t3_paths` + hook); điều kiện thứ tư — *hành động revert được mà
   không dừng chờ người* — chính là trạng thái V + Cổng Bằng chứng xanh-sạch
   của **đợt 2 (đã duyệt 12/08, chưa thi công)**. Nghĩa là: song song hoá ĐỢI
   đợt 2 xong, không chạy trước nó.
2. **«Bottleneck là chỗ đặt memory và evaluation»** — với N vòng: memory
   xuyên vòng đã có đường máy-tra (claim index làm input 5 của gap-probe);
   còn evaluation đặt sai chỗ thì chi phí nhân thẳng theo N. Số phải nhìn:
   ván đắt nhất GĐ2 (`describe-scheme-perf`) có **12 phép đo máy bắt 0/4 lỗi
   chặn-phát-hành; chân chấm độc lập bắt 4/4**. Nhân N vòng kiểu hiện tại là
   nhân đúng lớp chi phí có giá trị biên thấp nhất.
3. **Nguyên tắc 7 — fan-out chỉ đáng khi reviewer KHÁC nhau.** «Rộng-độc-lập
   thay sâu-xếp-chồng» (09/08) là chính nguyên tắc này phát biểu lại từ vận
   hành: hai tín hiệu rẻ độc lập hơn năm tầng đo xếp chồng vì lỗi chung không
   truyền qua được. Áp cho N vòng: cái đáng nhân là **chân chấm độc lập rẻ**
   (một phiên sạch, một lăng kính), không phải tháp eval giống nhau.
4. **Nguyên tắc 8 — đối trọng: ý định owner không song song hoá được.** Quyết
   định sản phẩm, kiến trúc, thẩm mỹ (design-pass) cần MỘT context liền mạch —
   và người mang context đó là tài nguyên tuần tự duy nhất của hệ. Câu trả lời
   đúng khuôn đã có trong luật hiện hành: **gom cổng theo LẦN NGỒI, không theo
   vòng** (handoff 13/08 §7: «Gom Cổng 2 hai hồ sơ vào MỘT lần ngồi»). Đây là
   cách duy nhất làm chi phí người tăng CHẬM hơn N.
5. **Artifact contract thay transcript** — N phiên song song không chung sổ
   nhớ chỉ sống được nhờ đề bài tự-đủ + vật bàn giao trên `main`. Nếp này đã
   thành hình (bản neo + đề bài nhúng nghĩa vụ báo cáo; handoff 13/08 đặt trên
   main đúng vì «để trên một nhánh là nó chết theo nhánh»). Nhưng tổng kết §11
   chỉ ra mặt trái: **tầng điều phối đang nhớ bằng MỘT phiên B**, còn ba vật
   đáng lẽ giữ trí nhớ thay B (CLAUDE.md · thẻ vai B · ADR) đều câm. N vòng
   nghĩa là N phiên mới bootstrap từ các vật đó — vật câm thì mỗi phiên trả
   giá khảo cổ lại từ đầu.

## 4 · Nút thắt thật khi N > 1 — xếp theo mức nhân

| # | Nút thắt | Số hiện có (≈2 vòng đồng thời) | Nhân theo N | Đã có | Còn thiếu (và giá) |
|---|---|---|---|---|---|
| B1 | **Người-tuần-tự** | 4–5 chặn/vòng T2; 53 lượt gọi/4 ngày, 70% không phải lúc quyết | tuyến tính → trần cứng của cả hệ | Đợt 2 đã duyệt (V + xanh-sạch không mời ký) | **0 món mới** — chỉ cần thi công xong đợt 2 |
| B2 | **Stale-cascade** | 13 làn re-pin/4 ngày; mỗi merge làm N−1 vòng kia hoá cũ | tuyến tính theo N × nhịp merge | chip ① staleness-theo-diff · `delta-verify-repin` (1 machine-lane, N chữ ký) | chính sách **re-pin-theo-release** (charter 07/08 mục 1d — tổng kết §9.2 xác nhận 0 hit; giá = một đoạn GUIDE/CLAUDE.md) |
| B3 | **Trí nhớ điều phối đơn-điểm** | CLAUDE.md câm về 2.1; sổ known-limits đóng băng từ 08/08; 0 ADR đợt qua | mỗi phiên mới đọc vật bootstrap sai một lần | phép thử 10-phút đã viết (tổng kết §11); hồ sơ 1a có mục «hợp nhất tuyên bố vào CLAUDE.md» | phần còn lại là docs, rẻ — làm cùng 1a, không mở món riêng |
| B4 | **Vật chung đụng nhau** | Bằng chứng mức N=2 đã có: 1a/1b va chạm vùng tệp phải dặn «đừng song song trên cùng tệp»; AC-11 của 1a chết vì 1b xoá script | PRODUCT-MAP.md (máy sinh) · sổ vấp chung · manifest là điểm đụng; vòng sản phẩm mỗi slug một thư mục nên nhẹ hơn vòng kit | luật rebase-sau-merge trong handoff | **chưa xây gì** — tỉ lệ chưa đo ở repo tiêu thụ; ghi sổ chờ theo phép thử tỉ-lệ-đo-được |
| B5 | **Chi phí đọc của máy tại cổng** | 4 tệp lệnh cổng 342 → 640 dòng (+87%) | mỗi vòng trả một lần → nhân N | hồ sơ 1a đang cắt đúng lớp này | làm xong 1a trước khi nhân N |

Điểm chung của bảng: **không nút nào cần cơ chế mới.** B1/B5 đã nằm trong đợt
1–2 duyệt rồi; B2 là một đoạn chính sách đã duyệt từ charter mà chưa ai viết;
B3 đi ké 1a; B4 chờ số.

## 5 · Chỗ tài liệu GE im lặng — đừng quay lại tài liệu tìm lời giải

Ba điều kiện sống của N-vòng đều nằm NGOÀI tài liệu, kit tự học qua vận hành:

- **Hội tụ của vòng verify** (NG1): REJECT vô hạn trên diff to là cơ chế của
  evaluator mở. Lời giải đã ship (scope-triage + trần 3 vòng + luật dừng-vá);
  hệ quả cho N vòng: **mỗi vòng phải NHỎ** — «hai hồ sơ để S4 hội tụ» của đợt
  1 chính là tiền lệ. N vòng nhỏ hội tụ nhanh hơn một vòng to, và đó mới là
  dạng tăng tốc thật.
- **Meta-evaluation** (NG2): phần lớn lỗi mới nằm ở chính các phép đo. Nhân N
  vòng = nhân bề mặt phép đo; `matrix-measure-law` đã thành luật nhưng số GĐ2
  (12 phép đo máy → 0 lỗi) nói hướng đi tiếp là **bớt** phép đo máy mỗi vòng
  chứ không phải thêm.
- **Tần suất gọi người**: tài liệu chỉ có «human escalation policy» một dòng;
  toàn bộ bài học 4–5 chặn/vòng, cổng-trạm-thu-phí, gom-lần-ngồi là của kit.
  Trần của N không nằm ở token hay CI — nằm ở **số lần ngồi của owner mỗi
  tuần**.

## 6 · Khuyến nghị — xếp theo luật rẻ-thì-làm, mỗi món kèm hai câu North Star

1. **Thi công xong đợt 1 + đợt 2 theo bản neo, không chen món mới.** Rút ngắn
   đường sản-phẩm ở chỗ: gỡ 3–4 chặn/vòng để N vòng không nhân quá tải owner.
   Failure mode có tỉ lệ: 53 lượt gọi/4 ngày đã đo. Là LƯỚI (trạng thái V có
   dấu vết, CI đếm được). *Đây là toàn bộ phần «tăng tốc» thật — mọi thứ khác
   là phụ trợ.*
2. **Trước khi mở N>1: ba nút rẻ của tổng kết §13 + một đoạn chính sách
   re-pin-theo-release** (B2 — món duy nhất bảng §4 chưa có chỗ ở). Mỗi món
   <15 phút; branch protection và bộ cổng-chép-sang-consumer đều là LƯỚI cho
   failure mode đã xảy ra (63 commit đẩy thẳng · bản chép lệch 30 dòng).
3. **Mở N=2–3 ở repo tiêu thụ theo khuôn đã có tiền lệ**, chưa cần cơ chế:
   mỗi vòng một phiên/worktree với đề bài tự-đủ trỏ về bản neo · cổng người
   gom theo lần ngồi · vòng nhỏ để S4 hội tụ · chân chấm độc lập một-phiên-sạch
   thay vì phình tháp eval. **Ngưỡng khai trước** (để «tăng N» không tự thoả
   như bài học §9.3 tổng kết): sau đợt 2, đo M1 trên 2 vòng thật — M1 ≤ 2 thì
   mới tăng N; re-pin/vòng và va chạm vật-chung ghi sổ vấp làm số cho lần quyết
   sau.
4. **KHÔNG làm** — đúng cả lời dặn của chính tài liệu lẫn North Star: tầng
   orchestrator/swarm riêng cho N vòng · graph DB · budget chung liên-vòng ·
   semantic matching cho claim index. Chưa món nào có failure mode tỉ-lệ-đo-được
   trên model hiện tại; thêm chúng bây giờ là «thêm graph/swarm chỉ vì hệ có
   agent».

**Một câu chốt:** tài liệu Graph Engineering đã trả xong giá trị của nó cho
kit (mọi gap duyệt đều signed-off); đường tăng tốc N vòng không nằm trong
tài liệu — nó nằm ở *làm xong đợt 2 · nhặt nốt đoạn chính sách re-pin đã duyệt
· rồi đo M1/M2 trên 2–3 vòng thật trước khi nhân tiếp*.
