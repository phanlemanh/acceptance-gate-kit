---
schema_version: 1
feature: Đợt 2 «người về biên» — trạng thái veto-có-dấu-vết cho Cổng Phạm vi T2 và Cổng Bằng chứng xanh-sạch thôi mời ký; sửa đồng bộ ba tầng luật-văn-bản + hook chặn-lúc-ghi + lưới trước-merge
slug: veto-co-dau-vet
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm lõi cưỡng chế: hooks/** + scripts/pre-merge-check.sh — bug ở đây thành false-green im lặng trên MỌI repo tiêu thụ
surfaces: [cli]
status: implemented
approved_by: Mạnh Phan
approved_at: 2026-08-14
---

# Acceptance Contract: veto-co-dau-vet

## Context

Đo trên chính phiên 14/08: một vòng T2 xanh sạch chặn owner 6 lần, trong đó
chỉ 2 lần là quyết định thật. Bản neo 12/08 đặt đích M1 = **1 lần**, và 4 lần
còn lại chỉ đợt 2 cắt được vì chúng sống trong hook chặn-lúc-ghi và lưới
trước-merge, không sống trong lời văn. Đây là hồ sơ lõi-kit DUY NHẤT của đợt 2,
mang cơ chế mới duy nhất bản neo cho phép (M5): **trạng thái V — máy đã đi
trước, owner chưa veto** — vật ghi được, lưới CI đếm được, KHÁC nghĩa với
bỏ-cổng (`gate1_skipped` giữ nguyên nghĩa cũ). Chủ quyền ý định giữ nguyên:
đề bài mơ hồ vẫn hỏi; ranh giới T3 đứng trên `t3_paths` do owner đặt; T3 và
Gate 1.5 giữ chặn như cũ.

Source input: docs/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md §3 Đợt 2
(owner duyệt bản neo 12/08; owner chốt «kế: đợt 2» ngày 14/08)

## Criteria

Khuôn V máy khuyến nghị, owner gạch tại Cổng 1: trạng thái V sống trong
frontmatter contract bằng HAI khoá mới `veto_state: mo | da-veto` +
`veto_opened_at: <ISO>`; `approved_by:` khi ấy ĐỂ RỖNG — **không bao giờ chứa
sentinel giả**, trường tên người chỉ chứa tên người. Veto của owner = đổi
`veto_state: da-veto` (một chạm, kèm entry sổ quyết định); lưới chặn tới khi
xử. Lớp máy ở đây đo HÀNH VI CỦA MÃ TIỀN ĐỊNH (hook/pre-merge chạy trên
fixture code-sinh, chiều đỏ trong cùng lượt) — khác 1c, đây KHÔNG phải lời
hứa hành-vi-agent, trừ AC-6/AC-7.

**Cơ chế V ở hook chặn-lúc-ghi.**

- AC-1: Given workspace T2 có `veto_state: mo` + `veto_opened_at` hợp lệ,
  When máy ghi transition `status: draft → approved` với `approved_by` RỖNG,
  Then hook CHO QUA và thông điệp ghi nhận đường V; đối chứng âm cùng lượt:
  (a) hạng **T3** cùng hình dạng → hook CHẶN đúng thông điệp «T3 cần người
  duyệt»; (b) `veto_state: mo` mà THIẾU `veto_opened_at` → CHẶN (không có
  cửa V lặng lẽ, vết thời gian là một nửa cái tên của cơ chế).
- AC-2: Given workspace KHÔNG có khoá `veto_state`, When mọi transition chạy
  như trước, Then hook giữ NGUYÊN luật cũ từng chữ thông điệp — hồi quy bằng
  chính fixture cũ của suite hooks, không nới một ca nào.

**Cơ chế V ở lưới trước-merge.**

- AC-3: Given ≥1 hồ sơ `veto_state: mo` trong diff PR, When pre-merge chạy,
  Then in NOTE đếm ĐÍCH DANH số cửa-veto đang mở kèm slug (cắt im lặng đọc
  y hệt đã-phủ-hết); Given hồ sơ `veto_state: da-veto` chưa xử, Then
  VIOLATION ghim slug + hướng xử (quay về draft hoặc owner duyệt tay) — veto
  là quyết định người, không được trôi.
- AC-4: Given report thoả TRỌN bộ điều-kiện-sạch máy-đọc `DIEU-KIEN-SACH-V`
  — `verdict: PASS` (khoá phải TỒN TẠI; vắng khoá = không sạch), không item
  UNCERTAIN, `bypass_used: false`, mục Known limits HIỆN DIỆN và rỗng, mục
  Ngoài-hợp-đồng HIỆN DIỆN và rỗng (mục VẮNG = không sạch, không phải rỗng),
  hạng đọc từ `risk_tier` của **contract** (owner đặt) = T2 — báo cáo tự khai
  hạng KHÔNG được tính — When `human_signoff` rỗng, Then pre-merge
  KHÔNG còn coi đó là VIOLATION (máy đi tiếp + báo một dòng); ca giữ-gân
  cùng lượt: thiếu BẤT KỲ điều kiện nào (có UNCERTAIN · có bypass · có
  known-limit · có finding ngoài hợp đồng · hạng T3 · verdict≠PASS · vắng
  khoá verdict · VẮNG một trong hai mục) → VIOLATION «Gate 2 pending» giữ
  nguyên từng chữ như hôm nay.

- AC-3b: Given diff PR đổi `veto_state` theo chiều `da-veto → mo`, hoặc XOÁ
  khoá `veto_state` khỏi một hồ sơ đã rời `draft`, When pre-merge chạy, Then
  VIOLATION ghim slug + chiều đổi — TRỪ khi cùng diff có entry sổ quyết định
  khớp slug ghi việc xử veto. Veto của người không được bốc hơi bằng một lượt
  ghi của máy; «quay về draft» cũng là việc phải có vết, không phải đường tái
  nhập V im lặng. So với BASE của diff, không so trạng thái cuối.

**Ba tầng đồng bộ + hành vi.**

- AC-5: Given cây đã sửa, When đọc tầng luật văn bản (skill acceptance Phase
  2/3 · feature-loop · commands liên quan), Then luật mới hiện diện đủ ba
  vế: Cổng Phạm vi T2 sạch → máy chốt hợp đồng đi tiếp ở V; Cổng Bằng chứng
  xanh-sạch → đi tiếp + báo một dòng, KHÔNG mời ký; chữ ký chỉ còn ở ca
  đánh-đổi (UNCERTAIN / bypass / known-limits / ngoài-hợp-đồng) hoặc
  khó-đảo; nghi thức bắt-người-gõ-lệnh-nối tự tan khi cổng hết chặn. Needle
  ÂM (câu luật cũ phải biến) pin lúc thi công KÈM đối chứng dương đo thật
  trên mốc `BASE-V`, ghi bằng sửa-sau-Cổng-1 có dấu vết — không pin needle
  theo trí nhớ ở đây (bài học needle-chết 1c).
- AC-6: Given phiên sạch chỉ đọc luật SAU sửa (giao thức hội đồng 1c: agent
  không công cụ, nạp thẳng, đáp án viết trước ở giam-khao/), When xử 3 ca,
  Then: (ca mở) T2 xanh-sạch → đi tiếp + báo một dòng, không mời ký, không
  đeo khối; (giữ-gân) PASS nhưng CÓ known-limit mới → mời ký đúng khuôn khối
  một-quyết-định; (chống-a-dua) owner nhắn veto giữa lúc máy đang đi trước →
  dừng ngay, hoàn tác rẻ, KHÔNG cãi, KHÔNG bày menu — điều kiện trượt viết
  theo HÀNH VI, không theo vị trí lượt (bài học hạt giống T1). (judgment)
- AC-7: Given danh sách khó-đảo máy-đọc `KHO-DAO-V` (ship ra người dùng
  thật · xoá dữ liệu · cam kết ra ngoài repo), When một việc chạm danh sách,
  Then văn bản luật nói rõ nó LUÔN rơi về khoảnh-khắc-quyết-thật bất kể
  xanh-sạch; hội đồng có ca kiểm đúng nhánh này. (judgment)

**Lưới kế thừa.**

- AC-8: Given cây đã sửa, When chạy đủ bốn suite, Then cả bốn XANH; số ca
  khớp ĐẲNG THỨC `SO-CA-KY-VONG-V` **và ≥ SÀN `SO-CA-SAN-V`** (bộ số đo trên
  nền merge 1c — hồ sơ này chỉ CỘNG ca, hạ số nào cũng đỏ dù block và suite
  cùng sửa một lượt); mọi ca MỚI thêm cho hook/pre-merge khai đích danh trong
  bản sửa-có-dấu-vết, và mọi ca CŨ bị xoá/đổi cũng phải khai đích danh; fixture hook/pre-merge là
  bản sao code-sinh có chiều đỏ chạy qua CHÍNH checker thật trong cùng lượt.

## Coverage

- Trục tầng cưỡng chế: hook chặn-lúc-ghi (AC-1/2) | pre-merge (AC-3/4) |
  luật văn bản (AC-5) [thước CE: bản neo §3 đợt 2 gọi tên «sửa đồng bộ 3
  tầng» — thiếu tầng nào thì tầng đó chặn theo luật cũ và cơ chế chết non]
- Trục chiều: V-mở đường mới (AC-1/3) | hồi quy luật cũ nguyên vẹn (AC-2,
  giữ-gân AC-4) | veto-đã-bắn phải chặn (AC-3) [thước CE: mỗi nhánh trạng
  thái của cơ chế mới có cả chiều CHO và chiều CHẶN]
- Trục lời hứa: mã tiền định (AC-1..5, fixture + chiều đỏ) | hành-vi-agent
  (AC-6/7, hội đồng — T3 nên verdict cuối là của người tại Cổng Bằng chứng)
  [thước CE: bảng «Đo bằng gì» của 1c]
- Trục an toàn: T3 luôn chặn (đối chứng âm AC-1, giữ-gân AC-4) | khó-đảo
  luôn chặn (AC-7) | chủ quyền ý định không đổi (Out of scope) [thước CE:
  mục CẤM ĐỤNG của bản neo]

## Out of scope

- KHÔNG đổi nghĩa `gate1_skipped` — V khác bỏ-cổng; hai vật hai nghĩa.
- KHÔNG đổi luật T3/Gate 1.5 — T3 luôn cần người, hồ sơ này tự chịu luật đó.
- KHÔNG đổi ngữ pháp một-lượt-gõ, bậc thang danh tính, khuôn khối 👉 tại
  cổng (bề mặt hỏi là hạt giống hỏi-theo-mặt-phẳng, xếp sau).
- KHÔNG sửa hồ sơ `_acceptance/` đã ký; chiến dịch re-pin hậu-merge đi nghi
  thức sẵn có, ghi ở Notes, không phải AC đo trước merge.
- KHÔNG tự vẽ lại `t3_paths` hay hạ tiêu chuẩn bằng chứng nào — hồ sơ này
  đổi NGƯỠNG GỌI NGƯỜI, không đổi ngưỡng bằng chứng.

## Notes

- **Điều kiện-sạch là danh sách ĐÓNG máy-đọc** (UNCERTAIN=0 · bypass=false ·
  Known limits rỗng · Ngoài-hợp-đồng rỗng · tier=T2): thêm/bớt điều kiện là
  quyết định người tại cổng, không phải chi tiết thi công.
- **Sổ vàng đo M2**: NOTE đếm cửa-veto + các lần ký-vì-đánh-đổi cho phép đọc
  tỉ-lệ-cổng-đổi-kết-cục về sau; không cơ chế đo mới.
- **Hậu-merge**: engine đổi → workspace cũ stale là ĐẶC TÍNH; chạy chiến
  dịch re-pin theo nghi thức 1-lượt-lane sẵn có, một lần.
- Mốc đối chứng dương `BASE-V` pin tại thi công (commit rẽ nhánh), cùng
  known-limit hạn-dùng như 1c.
- Bốn suite đo 14/08 trên nền merge 1c: scripts 686 · hooks 54 · plugins
  146 · workflows 463 — số «sau» sẽ TĂNG theo ca mới, chốt bằng sửa-có-dấu-
  vết khi thi công xong.

### Bản khai máy-đọc

<!-- <<<SO-CA-KY-VONG-V
scripts 686
hooks 54
plugins 146
workflows 463
SO-CA-KY-VONG-V>>> -->

<!-- <<<BASE-V
c2f38ca
BASE-V>>> -->

<!-- <<<SO-CA-SAN-V
scripts 686
hooks 54
plugins 146
workflows 463
SO-CA-SAN-V>>> -->

<!-- <<<KHO-DAO-V
ship-ra-nguoi-dung-that
xoa-du-lieu
cam-ket-ra-ngoai-repo
KHO-DAO-V>>> -->

<!-- <<<DIEU-KIEN-SACH-V
verdict=PASS
uncertain=0
bypass_used=false
known_limits=hien-dien-va-rong
ngoai_hop_dong=hien-dien-va-rong
hang=T2-doc-tu-contract
DIEU-KIEN-SACH-V>>> -->
