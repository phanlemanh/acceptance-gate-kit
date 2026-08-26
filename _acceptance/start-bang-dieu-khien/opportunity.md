---
schema_version: 1
slug: start-bang-dieu-khien
feature: «/start» là bảng điều khiển của owner, không phải bộ định tuyến — hiện hết ý đang cân nhắc, nêu tên việc máy vừa làm và thứ còn veto được, và mọi bộ đọc nói cùng một chữ
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-08-23T04:12:00Z     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition: archive     # keep | archive
---

## Vấn đề & ai gặp

Thẻ vào phiên là **vật owner nhìn đầu tiên mỗi lượt ngồi xuống**, nhưng nó đang trả lời câu «đi đâu tiếp» thay vì câu «tôi cần quyết gì, và máy vừa làm gì cho tôi». Bốn chỗ hụt, cả bốn đều làm owner phải rời thẻ đi tìm chỗ khác:

1. **Giấu backlog.** Thẻ cắt còn 3 ý «đang cân nhắc» theo tuổi (`commands/start.md:63-66`), trong khi kit hiện có 8 ý. Không luật độ dài nào ép con số đó — nó là lựa chọn của hạt giống chip B (`docs/plans/2026-08-21-hat-giong-vao-co-o-ra-co-ten.md:109-110`). Tệ hơn: tuổi đang **giả** — 6/8 ý cùng `since: 2026-08-21T18:24:01Z` vì cùng một commit đổ stub, nên thứ tự «cũ nhất» không mang tin. Owner nói (23/08): đây là bàn cược, «nếu đã xếp hạng thì đề xuất, chưa có thì hiện hết để tôi tự xếp».
2. **Giấu việc máy vừa làm.** `groups.done[]` chỉ mang `slug` + `state` (`scripts/start-scan.mjs:230-293`), nên thẻ in một con số gộp «56 việc». Owner đóng vòng «máy làm và tự chứng minh» bằng cách **nhìn thấy** cái máy vừa làm — con số không cho nhìn thấy gì.
3. **Cửa veto mở không nêu tên, và đếm sai.** Làn V là veto-default: máy đi trước, người veto lúc nào cũng được — nhưng veto đòi **thấy**. Thẻ in «2 còn cửa veto mở» không kèm tên; lưới trước-merge đếm cùng thứ ra **14** (`scripts/pre-merge-check.sh:1184-1224` vs `start-scan.mjs:253`, nhánh `signed-off` không đọc `veto_state`) trong khi `commands/start.md:111-121` hứa «cùng câu lưới trước-merge hỏi».
4. **Bộ đọc nói khác nhau, và nói sai khi cây lệch.** Cùng một hồ sơ: thẻ + `acceptance-status` **mời ký** cái mà lưới, máy quét và feature-loop đã tuyên «không mời ký» (`scripts/gate-card.js:287-291` · `commands/acceptance-status.md:33`); ô đã điền ngưỡng là «chờ Cổng Đáng» ở thẻ nhưng «Đang cân nhắc» trên bản đồ; Cổng Giá trị luôn đứng đầu thẻ bất kể tuổi vì mốc rỗng (`start-scan.mjs:232-234` + sort `:295`). Và sau khi một chip merge trong worktree, **không bước nào đưa cây chính về origin**; máy quét chỉ đọc `branch`/`dirty` (`:70-78`), nên `/start` ở cây chính in trạng thái cũ mà `product-map --check` vẫn xanh (so cục bộ với cục bộ) — đã xảy ra 22/08 với `dac-ta-ux-vat-hoa-cau-truc`.

**Người trả giá:** owner (mỗi phiên phải mở bản đồ / thư mục / lưới để có bức tranh thật, và không veto được thứ không thấy) và **máy** (bốn bộ đọc, bốn nguồn chữ, nên sửa một chỗ là lệch chỗ khác).

**Bằng chứng thực địa:** audit dây nghi thức 22/08 — `docs/findings/2026-08-22-audit-day-nghi-thuc-kit.md` §3 lớp C (8 ca lệch chữ, 6 mới) và lớp D (mặt phẳng làm việc); ba ý owner 23/08 ghi ở §8 cùng hồ sơ. Chữ của bộ đọc trong audit lấy bằng **chạy thật** trên cây hiện tại và trên fixture máy sinh, không đọc code suy ra.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Owner muốn thấy **hết** ý đang cân nhắc trên thẻ, không phải 3 ý | thẻ dài thành nhiễu, owner bỏ qua cả nhóm — quay lại cắt, nhưng cắt theo thước khai trước | in hết 8 ý một lượt, hỏi owner sau 3 phiên: dài quá hay vừa | Chưa thử — owner tự nêu yêu cầu 23/08 |
| 2 | Ngày «vừa xong» suy được từ hồ sơ, không cần khai thêm | phải thêm trường và migrate 56 hồ sơ — đắt, trái «đọc-cũ» | chuỗi `human_signoff` → `decided_at` → `git log -1 --format=%cs`; thử trên 56 hồ sơ, đếm số hồ sơ không ra ngày | **Đã thử một phần 23/08**: git cho đúng 3 việc gần nhất (release-2-3-0 · repo-khai-plugin · vao-co-o-ra-co-ten, 22/08); chưa đếm hết 56 |
| 3 | Bốn bộ đọc dùng chung được **một** bảng trạng-thái→chữ | mỗi bộ đọc có ngữ cảnh riêng nên phải rẽ nhánh — bảng chung thành lớp trừu tượng rỗng | lập bảng 13 trạng thái × 4 bộ đọc từ audit §3-A; đếm ô mà hai bộ đọc **phải** nói khác nhau vì lý do thật | Chưa thử — `commands/start.md:104` đã nói «nhãn rút từ bảng nhãn chung trong lib, CÙNG chữ với cổng CI», tức hình dạng có sẵn |
| 4 | Nêu tên hồ sơ còn cửa veto mở làm owner **veto thật**, không thành nhiễu | danh sách 14 dòng mỗi phiên = nhiễu; phải lọc theo tuổi hoặc theo hạng | in tên (đếm theo cùng vị từ với lưới) trong 3 phiên, đếm số lần owner chạm vào | Chưa thử |
| 5 | Máy đọc được «cây sau origin N commit» rẻ và không làm chậm thẻ | thêm một lần gọi mạng mỗi lượt `/start` | `git rev-list --count @{u}..` trên bản sao — không fetch, chỉ đọc ref đã có | Chưa thử |
| 6 | Bước còn mờ giải bằng **máy phân kỳ** tốt hơn hội thoại nhiều lượt | ý mờ mà máy tự phân kỳ sẽ chệch ý owner, tốn nhiều lượt hơn là hỏi thẳng | hai phiên 22/08 đã chạy lối máy-phân-kỳ (12 nguồn → một câu «tách hay gộp?») | **Đã thử, đúng một lần** — owner quyết trong một chạm cả hai lần |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: Sau BA phiên `/start` thật của owner (ván thử là chính kit — người dùng cuối của thẻ là owner, không phải chờ ván ở repo tiêu thụ như hai ô UX), thẻ có đủ để owner quyết mà không phải mở thứ gì khác không — đo bằng số lần rời thẻ đi tìm bức tranh thật, tỷ lệ ý đang cân nhắc hiện ra, độ lệch đếm «còn veto được» giữa thẻ và lưới, và có lần nào owner thật sự hành động trên một dòng mới sinh.
- Kết quả nào là SỐNG: đủ CẢ NĂM, đếm trên ba phiên liên tiếp — (1) **0 lần** owner phải mở bản đồ / thư mục `_acceptance/` / lưới để biết bức tranh thật; (2) **mọi** ý đang cân nhắc hiện trên thẻ, HOẶC máy xếp hạng và nói rõ xếp theo **thước đã khai trước** (không thước tự chế); (3) thẻ **nêu tên** mọi hồ sơ còn cửa veto mở và đếm **khớp lưới** (lệch 0; nay 2 vs 14) — phá thử: thêm một hồ sơ `veto_state: mo` vào bản sao thì thẻ và lưới cùng tăng; (4) **≥ 1 lần** owner hành động trên một dòng mới sinh (veto · mở hồ sơ đọc · bảo dừng) — chứng nêu tên là dùng được; (5) thẻ **tự nói** khi cây đang sau bản chung — phá thử: lùi cây một commit thì thẻ phải cảnh báo — và **0 lượt gọi người thêm** (thẻ dài hơn không được sinh câu hỏi mới).
- Kết quả nào là CHẾT: bất kỳ MỘT — (a) thẻ dài tới mức owner **bỏ qua** một nhóm ≥ 1 lần (nói thẳng «phần này tôi không đọc»); HOẶC (b) **hai bộ đọc lại lệch chữ** cho cùng một sự thật mà suite vẫn xanh (bảng chung không có răng — đúng lớp «bên viết và bên đọc trôi khỏi nhau»); HOẶC (c) máy **tự cắt hoặc tự xếp hạng** ý theo thước tự chế, không khai trước, và bị owner veto ≥ 1; HOẶC (d) ba phiên liên tiếp owner **không chạm** dòng nào trong danh sách nêu tên → nêu tên là nhiễu, không phải thấy-để-veto.
- Timebox: hết ba phiên `/start` thật, muộn nhất **2026-09-15** → `decision: park`. Ngắn hơn hai ô UX (30/09) vì ô này đo trên chính kit và phiên xảy ra hằng ngày — ba tuần không đủ ba phiên thì tự nó là tín hiệu thẻ không được dùng; và ô `ra-co-ten-lam-va-trao` cần ô này xong trước khi `design-pass-nac-khong-dong-bo` tới S4.

## Kết quả prototype

Chưa dựng. Không cần prototype: mọi thay đổi đo được trên chính kit (kit tự chạy cổng của mình) — ván thử là các phiên `/start` thật của owner ở cả kit lẫn repo tiêu thụ.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Ý «bàn cược» — danh sách ý đặt cạnh nhau, người chọn cược, máy không tự cắt | Shape Up (Basecamp), chương betting table | triết-lý/logic | có — hình dạng bàn cược; KHÔNG vay chu kỳ 6 tuần / cool-down | — |
| Bộ năm thành phần của một cổng (vật nộp · tiêu chí · lối ra · người gác · chủ bước kế) dùng làm thước audit | Stage-Gate, R. Cooper | triết-lý/logic | có — làm thước đối chiếu, không bê quy trình | — |
| Ba ý owner 23/08 (hiện hết ý · nêu việc vừa làm · không hội thoại ở bước mờ) | owner, phiên 23/08 (chép trong `docs/findings/2026-08-22-audit-day-nghi-thuc-kit.md` §8) | triết-lý/logic | có — là đề bài của ô này | — |
| `product-management:brainstorm` (hội thoại thinking-partner) | plugin product-management | cơ chế riêng | **không** — TRỪ khỏi kế hoạch §9.1 của hạt giống chip B; ổ cắm `discovery.brainstorm_skill` giữ nguyên cho repo nào muốn tự khai | — |

## Cổng 0

- **decision = build** (owner «làm», 2026-08-23). Căn cứ: phần lớn là **TRỪ** chứ không CỘNG (bỏ giới hạn 3 ý, bỏ §9.1 cắm skill hội thoại, bỏ con số gộp) — hợp «chỉ TRỪ, không CỘNG»; hố chạm owner **mỗi phiên**, không phải rủi ro xa; **đảo rẻ** — chỉ sửa bộ đọc và lời thẻ, không đụng trạng thái hồ sơ nên không kéo theo migrate; và nó là **đường đo** của ô `ra-co-ten-lam-va-trao` (thẻ không nói đúng thì không thấy ô kia sửa được gì). Rủi ro «thẻ hoá dài thành nhiễu» đã chặn bằng điều kiện CHẾT (a).
- **disposition = archive** (không có prototype code) Căn cứ: không dựng thử — sửa bộ đọc ngay trong kit, ván thử là phiên `/start` thật; không có mã nào để giữ hay vứt.
- **Phiên nghiệm thu ở đâu:** các phiên `/start` thật của owner sau khi ship (kit tự-dùng + repo tiêu thụ) — số đo là các thước dưới. Lưu ý ô này **đo được trên kit tự-host**, khác hai ô UX phải chờ ván ở repo tiêu thụ.
- **Ngưỡng UAT chốt cùng lúc ký:** chép nguyên bốn dòng của section «Ngưỡng chết / ngưỡng UAT» — câu hỏi: sau ba phiên `/start` thật, thẻ có đủ để owner quyết mà không phải mở thứ khác · SỐNG: 0 lần rời thẻ · mọi ý hiện ra (hoặc xếp hạng theo thước đã khai) · nêu tên veto-mở khớp lưới, lệch 0, phá thử phải cùng tăng · ≥ 1 lần owner hành động trên dòng mới sinh · thẻ tự nói khi cây lệch, 0 lượt gọi người thêm · CHẾT: owner bỏ qua một nhóm, HOẶC hai bộ đọc lại lệch chữ mà suite xanh, HOẶC máy tự cắt theo thước tự chế bị veto, HOẶC ba phiên không ai chạm danh sách nêu tên · Timebox: ba phiên, muộn nhất 2026-09-15 → park.

## Thước đo thành công → ứng viên criterion

- Số lần owner phải **rời thẻ** đi mở bản đồ / thư mục `_acceptance/` / lưới để có bức tranh thật trong một phiên — đích 0.
- Tỷ lệ ý «đang cân nhắc» hiện trên thẻ — đích 100% (hoặc: có thước khai trước thì máy xếp hạng và nói rõ xếp theo gì).
- Số lần owner **veto** một hồ sơ làn V sau khi thẻ nêu tên — đích ≥ 1 trong ba phiên đầu (chứng minh nêu tên làm veto thành thật, không phải nhiễu).
- Độ lệch đếm «cửa veto mở» giữa thẻ và lưới — đích 0 (nay: 2 vs 14).
- Số ô trong bảng trạng-thái × bộ-đọc mà hai bộ đọc nói **khác chữ** cho cùng một sự thật — đích 0 ngoài các ca cố ý đã khai (bản đồ không dùng vị từ).
- Số lần thẻ in trạng thái **cũ** vì cây lệch origin mà không cảnh báo — đích 0.
- Số lượt gọi người thêm do các thay đổi này — đích 0 (thẻ dài hơn không được đổi thành câu hỏi mới).

## Out of scope từ khám phá

- **Không** đổi bản đồ sản phẩm sang dùng vị từ («xanh-sạch», «chờ ký») — đã quyết bản đồ gom theo giai đoạn, không mang vị từ (`start-scan.mjs:16-18`, known-limit `lan-v-khong-phai-cho-ky`); lệch chữ chữa bằng bảng chung, không bằng đổi vai bản đồ.
- **Không** cho máy tự `park`/`kill` ý theo tuổi — máy nhắc tuổi, người quyết số phận (giữ nguyên luật chip B).
- **Không** bịa trọng số ưu tiên. Máy chỉ xếp hạng khi ô có thước khai trước; chưa có thì hiện hết theo thứ tự có tin (tuổi thật, timebox, con trỏ từ ô đã ký).
- **Không** đụng trạng thái hồ sơ hay nghi thức cổng — đó là ô `ra-co-ten-lam-va-trao` (mở cùng lượt, ô này đi trước và làm đường đo cho nó); ô này chỉ sửa **bộ đọc và lời thẻ**.
- **Không** thêm lệnh mới; không skill mới.
- **Không** gộp phần «dạng tên lệnh in ra» — đã có ô `lenh-in-ra-phai-bam-duoc` (đang ở Cổng Bằng chứng, PR #93).
- **Không** mở rộng sang QUICKSTART/README/GUIDE trong ô này (đó là nợ đã khai của chip D).
