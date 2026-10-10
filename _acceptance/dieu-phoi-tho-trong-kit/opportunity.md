---
schema_version: 1
slug: dieu-phoi-tho-trong-kit
feature: «Một kho bất kỳ bật được mô hình Điều phối – Thợ của kit; mở đợt bằng một lệnh, nối lại bằng một lệnh sau khi phiên khởi động lại, và sang tài khoản khác khi hết hạn mức mà không mất việc»
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build               # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-09T14:30:35Z   # chủ kho gõ «build» một chạm trong phiên 09/10, máy ghi hộ
prototype:
  base_commit:                # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:                # keep | archive
---

> Mở 09/10 theo lời chủ kho, nguyên văn: «Kit Điều Phối – Thợ chạy trên Acceptance Gate Kit đã thử trên
> CRM và các quy trình khởi động, resume, đổi tài khoản liên tục…». Phạm vi có bốn trục: đóng gói ·
> khởi động · tiếp tục · đổi tài khoản. Chủ kho đã hoãn nhiều máy và chuyển máy. Ô này là CỘNG,
> nên chủ kho phê ở Cổng Đáng (ADR 0018).

## Vấn đề & ai gặp

Gốc: crm/_acceptance/dieu-phoi-hai-tang — tầng máy của mô hình (bộ phát lịch, CLI đợt, bốn hook), ký Cổng 2 ngày 07/10, chạy thật trong đợt crm `sau-14-10` từ 07/10. Bản ghi nhu cầu 09/10 ở `crm/.acceptance-runs/ghi-chep/nhu-cau-dieu-phoi-tho-vao-kit.md` (ngoài git, worktree giám sát) — các số cần dùng đã chép vào ô này.

Mô hình đang chạy ở crm. Đợt `sau-14-10` có 7 dãy thợ trên một máy. Theo bản ghi nhu cầu, trong khoảng 41 giờ đợt gộp 28 hàng (ngày 04/10 làm thủ công: 9 hàng trong 19 giờ). Sổ sự kiện của đợt, từ 07/10 12:58Z tới 09/10 14:12Z, có 130 lượt cấp khoá, 1 lần thu hồi, 11 lần giảm tải và 296 yêu cầu. Sổ luật của đợt đã có 52 luật, phần lớn sinh ra từ một sự cố.

Người gặp, theo thứ tự trả giá:

- **Chủ kho, người đứng ở biên.**
  - *Mở đợt* hôm nay là sáu bước tay theo `crm/scripts/dieu-phoi/README.md`: mở thư mục đợt · điền hàng
    việc · chạy bộ phát lịch · giăng Monitor · tạo nhịp 30 phút · dựng nhóm thanh bên và chip thợ.
  - *Phiên giám sát khởi động lại* thì mất hết việc nền. Ngày 09/10, 37 việc nền dừng cùng lúc.
    Monitor còn tự hết hạn sau 30 phút. Nhật ký đợt có 5 lần «giăng lại». Ngày 08/10, quãng
    15:35–20:44Z Monitor hết hạn lúc đang chờ người trả lời, và hai việc của một dãy bị lỡ 5 giờ.
  - *Hết hạn mức* là ca thường gặp. Đo 09/10 qua công cụ `get_usage` của app: tài khoản của phiên này
    đã dùng 76 % hạn mức tuần, còn 5 ngày mới đặt lại. Kit chưa có đường nào để đổi sang tài khoản
    khác giữa đợt. Lần đổi gần nhất (05–06/10) là bàn giao tay bằng tệp nhớ.
- **Kho thứ hai, OneFlow.** Muốn chạy mô hình thì phải chép 1.186 dòng mã, 4 hook và khuôn cấu hình
  từ crm. Luật «kit là engine» chặn đúng việc này: thứ gì phải chép sang một kho sản phẩm thứ hai
  thì phải nằm trong kit.
- **Phiên giám sát.** Phiên này tự làm phần máy móc lẽ ra máy làm: giăng lại Monitor, dựng lại nhịp,
  nhớ dãy nào đang dở việc gì.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Lõi ở crm không ghi cứng gì của crm, nên đóng gói chỉ là chuyển chỗ, không phải viết lại | Vòng thành viết lại lõi; OneFlow vấp những giả định ẩn của crm | Tìm chuỗi riêng của crm (`onehub`, `crm`, `bun`, `prisma`, cổng 3000/3001/5432) trong 14 tệp mã `scripts/dieu-phoi/*.mjs` | Thử 09/10, **ĐỨNG**: 0 dòng. Mọi giá trị riêng nằm trong cấu hình đợt. Có một việc chuyển: crm gắn 4 khối hook qua `$CLAUDE_PROJECT_DIR/scripts/dieu-phoi/` trong `.claude/settings.json`; khi lõi vào gói, crm phải gỡ 4 khối đó, nếu không hai bản chạy cùng lúc |
| 2 | OneFlow có đủ việc chạy song song cho một đợt | Không có đợt thật ở kho thứ hai, nên điều kiện «chạy được trên ≥ 2 kho» (spec §5.1) không đo được | Đọc khối `plan-freeze` trong `docs/roadmap.md` và `STATUS.md` của OneFlow `origin/main` | Thử 09/10, **LUNG LAY**. STATUS của OneFlow ghi «thứ tự làn B là thứ tự thực thi, một hồ sơ mở tại một thời điểm». Các hàng ★ còn lại là B5–B10, phần lớn hạng T3, nhiều hàng chờ việc của chủ kho (A2, A3, A5, A7). Muốn có ≥ 2 thợ thì phải nới luật này cho đợt thử (ví dụ B5 chạy cùng S1 hoặc S3). Không nới thì đợt thử chỉ có 1 thợ cộng giám sát: đo được khởi động, tiếp tục và đổi tài khoản, nhưng không đo được tranh khoá. Mốc tái hoạch của OneFlow là 09/10 |
| 3 | Mức dùng tài khoản đọc được bằng máy, đủ sớm để bàn giao trước khi chạm trần | Không có cảnh báo trước; hết hạn mức thì phiên chết giữa bước | Gọi `get_usage` trong một phiên app desktop | Thử 09/10, **ĐỨNG**, có điều kiện. Công cụ trả cửa sổ 5 giờ (40 %) và cửa sổ tuần (76 %), kèm giờ đặt lại. Công cụ này thuộc phiên app, nên bộ phát lịch (Node) không gọi được: phiên giám sát phải tự đọc mỗi lần thức. Chưa thử: CLI, và phiên đã cạn hạn mức còn đọc được không |
| 4 | Đổi tài khoản trong app desktop giữ lại những thứ «tiếp tục» cần | Phải dựng lại nhiều hơn dự tính, hoặc mất việc | Đọc cấu trúc đĩa, không đổi gì. Sau đó chủ kho đổi tài khoản thật một lần (S1) | **MỘT NỬA.** App giữ danh sách phiên trong `~/Library/Application Support/Claude/claude-code-sessions/<mã>/<mã>/`. Kho 333 phiên ngừng ghi lúc 06/10 23:21, khớp lần đổi tài khoản 05–06/10; kho 184 phiên đang ghi hôm nay. Bản ghi hội thoại (`~/.claude/projects/`) và lịch hẹn (`~/.claude/scheduled-tasks/`) nằm ngoài phần tách đó. **Suy ra, chưa thấy tận mắt:** sau khi đổi, phiên thợ, nhóm thanh bên và chip cũ không hiện ở tài khoản mới, nên «tiếp tục» phải mở phiên thợ mới đọc từ tệp, không nối phiên cũ. Lịch hẹn có chạy dưới tài khoản mới không thì chưa biết |
| 5 | Phiên thợ mới nối được hàng đang dở mà người không phải kể lại | Mỗi lần đổi, người phải kể lại ngữ cảnh cho từng dãy | Đọc bảng trạng thái của feature-loop. Đọc Nhật ký crm 08/10 11:21 | **ĐỨNG** khi việc dừng ở ranh giới stage: `/feature-loop:feature-loop <slug>` đã nối theo `status` của hồ sơ. Bộ phát lịch là tiến trình Node tách rời: sau khi app cập nhật ngày 08/10 nó vẫn sống (pid 16906), nên app khởi động lại chỉ làm mất lớp app (Monitor, hội thoại). Hai chỗ còn hở: phần S3 chưa commit (bàn giao nhẹ phải commit WIP) và lượt S4 đang chạy (Workflow chết theo phiên, nên chạy lại cùng round) |
| 6 | Mở lại phiên thợ không tốn người quá nhiều lần bấm | Mỗi lần đổi tài khoản tốn N lần bấm cho N thợ, ngược thước «lượt gọi người» | Xem danh sách công cụ của app trong phiên này | **ĐỨNG về phía xấu.** App vẫn không cho phiên tự mở phiên mới (spec §9: `start_session` bị khoá sau cờ tính năng). Mỗi phiên thợ cần chủ kho bấm một chip. Một lần đổi ở đợt 7 thợ là 7 lần bấm. Khai đây là giới hạn; không đo thì không giảm được |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: một kho thứ hai có chạy được một đợt Điều phối – Thợ trên lõi của kit mà không sửa lõi không, và chủ kho có mở đợt, nối lại đợt, đổi tài khoản giữa đợt, mỗi việc bằng một lệnh và không mất việc không?
- Kết quả nào là SỐNG: Trong timebox, đạt đủ bốn điều. (1) crm chạy đợt kế (hoặc phần còn lại của đợt `sau-14-10`) trên lõi của kit, đã gỡ bản `scripts/dieu-phoi/` riêng; và OneFlow chạy một đợt có ≥ 2 hàng gộp; trong cả hai đợt, kit không phát hành bản vá lõi nào vì hai kho này, và không kho nào giữ bản sao lõi. (2) Mở đợt ở một trong hai kho bằng một lệnh; phần tay chỉ còn bấm chip phiên thợ. (3) Ít nhất một lần «tiếp tục» thật sau khi phiên giám sát khởi động lại: 0 việc nền phải giăng tay; khoá, đơn và việc chờ người còn nguyên. (4) Ít nhất một vòng thật: báo trước khi chạm hạn mức → bàn giao nhẹ → «tiếp tục» dưới tài khoản kia; 0 commit, chữ ký hay quyết định bị mất; người không gõ thêm câu nào ngoài lệnh tiếp tục và các lần bấm chip.
- Kết quả nào là CHẾT: Một trong ba. (a) Hết timebox mà OneFlow phải sửa lõi mới chạy được: lõi còn mang hình dạng crm, nên đóng gói dừng và mô hình ở lại crm. (b) Một vòng hết-hạn-mức thật làm mất một commit, chữ ký hay quyết định: trục 4 thu về bàn giao tay theo khuôn. (c) Sau khi crm chuyển sang lõi của kit, số hàng gộp mỗi ngày hoặc lượt gọi chủ kho mỗi hàng xấu hơn đợt `sau-14-10`.
- Timebox: 2026-11-07 (dời từ 2026-10-31, chủ kho quyết 10/10 khi lịch thành «đóng gói 25/10 → thử crm ~26/10 và OneFlow ~27/10 → tinh chỉnh ~05/11»). Đủ cho vòng kit, một quãng lặng ở crm để chuyển và nâng, và một đợt thử ở OneFlow. Ngưỡng đọc khi đợt thử OneFlow đóng.

## Kết quả prototype

Chưa dựng. Mã crm `scripts/dieu-phoi/` (hồ sơ `dieu-phoi-hai-tang`, ký 07/10) đã sống ở kho tiêu thụ.
Nó là vật liệu kế thừa (bảng dưới), không phải prototype của ô này, nên `disposition` không áp.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Bộ phát lịch, CLI đợt, 4 hook, khuôn `mau/` và 14 tệp test (84 ca) | crm `scripts/dieu-phoi/` (1.186 dòng mã), hồ sơ `dieu-phoi-hai-tang` | triết-lý/logic | có — chuyển chỗ, giữ test đi kèm | — |
| Kiến trúc ba tầng (máy · giám sát · người) và ranh giới lõi / riêng kho / riêng máy | spec kit `docs/superpowers/specs/2026-10-05-orchestrator-workers-hai-tang-design.md` §3, §5.1 | triết-lý/logic | có | — |
| Bảng «trạng thái nằm ở đâu» và nghi thức bàn giao/tiếp tục | bản ghi nhu cầu 09/10 §3, §4.2 | triết-lý/logic | có — chỉ phần một máy | — |
| 52 luật của đợt `sau-14-10` | crm `.acceptance-runs/dieu-phoi-sau-14-10/LUAT.md` | triết-lý/logic | có chọn lọc — chỉ luật chung mà một đợt thử vấp; luật riêng của crm (1–15) ở lại crm | — |
| Bảng đồng hồ `bang.html` | crm `scripts/dieu-phoi/bang.mjs` | ngôn-ngữ-thiết-kế/hình-thái | có — trang máy vẽ cho người vận hành, không phải giao diện người dùng cuối | chủ kho, cùng chữ ký Cổng 0 |

## Cổng 0

- **decision = build** (Manh Phan, 09/10 14:30Z — «build» một chạm). Ngưỡng giữ nguyên bốn dòng đề xuất, timebox 2026-10-31.
- **Năm câu chờ của bàn giao chuyển máy §3 — chủ kho trả một dòng (manh, 10/10, máy mới), máy ghi hộ:**
  - timebox: **2026-11-07** (dời từ 31/10; dòng Timebox ở mục Ngưỡng đã sửa theo).
  - OneFlow nới luật «một hồ sơ mở tại một thời điểm» cho đợt thử: **có, một cặp hàng** — đợt thử DP5 chạy
    đúng hai hàng song song, đủ đo tranh khoá. Việc nới nằm ở kho OneFlow, làm khi DP5 mở.
  - Bàn giao CHỦ ĐỘNG (người gõ «bàn giao» trước khi chạm hạn mức) tính là «vòng thật» cho SỐNG (4): **có**.
    Chữ của ngưỡng (4) không đổi; đây là cách đọc chủ kho chốt trước khi có số.
  - Spec workflow `docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md`: **duyệt**.
  - Đẩy lộ trình `docs/plans/lo-trinh-kit.json`: **có** — lộ trình đi vào `main` cùng PR #295.
- **disposition = …** Không có prototype.
- **Ngưỡng UAT chốt cùng lúc ký:** bốn dòng ở mục Ngưỡng, giữ nguyên chữ, đã gỡ tiền tố.
- **CỘNG (ADR 0018):** trace về nguyên tố 3 (người ở biên, thôi làm nhịp tim và thôi giăng tay) và hai
  thước đo của kit: lượt gọi người, và chi phí máy trên mỗi kết quả ship. Người hưởng: chủ kho khi chạy
  đợt ở crm và OneFlow; phiên giám sát.
- **Luật chiều rộng (b):** đây không phải vòng meta. Vật chạm người dùng ở hai kho tiêu thụ đã có tên:
  crm đã chạy mô hình, OneFlow là kho neo thứ hai.
- **Hạng dự kiến:** T2 nếu lõi nằm trong thư mục gói riêng. Nâng T3 nếu thiết kế đặt mã vào `hooks/**`
  hay `lib/**` của gói acceptance-gate (`t3_paths`).
- **Ràng buộc nhịp:**
  - Không cài hay nâng plugin kit trên máy khi crm còn giữ khoá `s4` hoặc hàng gộp chưa trống. Lúc
    viết ô (09/10), crm giữ khoá `s4` và `duong-nen`, có 4 đơn đang chờ.
  - crm chuyển sang lõi của kit do phiên giám sát đợt `sau-14-10` điều phối, ở một quãng lặng. Không
    đổi lõi dưới chân một đợt đang chạy.
  - OneFlow `origin/main` đã ở kit 2.24.0 (#134, 08/10). Bản clone ở máy này đang đứng ở nhánh cũ
    `chore/kit-2-16-0-doi-soat` (19/09). «Nâng trước» nghĩa là đưa bản clone về `main`, rồi nâng plugin
    phạm vi dự án lên mốc mang lõi điều phối.

## Thước đo thành công → ứng viên criterion

- **Bật theo kho, mặc định tắt:** kho không bật thì không tệp nào đổi và hook im. Kiểm theo ma trận
  chiều im trên kit, crm, OneFlow và một kho trống.
- **Đường đọc-cũ:** lõi của kit đọc được thư mục đợt crm đang chạy (khuôn 07/10) mà không sửa tay. Đây là
  đường chuyển của crm.
- **Thư mục đợt ghi được** từ phiên giám sát mở ở bất kỳ worktree nào. Ngày 09/10, hook của một phiên
  giám sát mới đã chặn ghi vào `.acceptance-runs/` vì thư mục này nằm ngoài worktree của phiên.
- **Mở đợt một lệnh:** dựng đủ sáu thứ và in vai đã khai (phiên nào giám sát, dãy nào ở đâu). Hàng việc
  lấy từ nguồn kho đã khai: lộ trình hoặc bản phạm vi nếu kho có, tệp tay nếu không. Chiều đỏ: thiếu một
  thứ thì lệnh nói đúng tên thứ thiếu, không báo xong.
- **Tiếp tục một lệnh, chạy lại được nhiều lần:** chạy hai lần không sinh bộ phát lịch thứ hai hay Monitor
  đôi. Có `ban-giao.json` thì đọc nó. Báo đủ việc chờ người, gồm cả đơn `can-nguoi` (luật 52 của đợt:
  câu hỏi viết bằng chữ chưa vào bảng chờ người).
- **Bàn giao nhẹ:** ngưỡng hạn mức khai trong cấu hình đợt. Tới ngưỡng thì: ngừng cấp khoá mới, thợ commit
  WIP và đẩy nhánh, ghi `ban-giao.json`, in câu tiếp tục. Chiều đỏ: còn tệp chưa commit thì bàn giao không
  được báo xong.
- **Ba phép đo trên máy thật**, ghi thành bằng chứng, không đoán: (i) đổi tài khoản thì phiên cũ, lịch hẹn
  và lịch sử còn hay mất; (ii) mức dùng đọc được từ đâu, lúc nào; (iii) một vòng hết hạn mức → bàn giao →
  tiếp tục.
- **Dự báo năm dòng số (luật c):** làm-xong→quyết-được `=` · lượt gọi người ngoài thiết kế `↓` (hết hỏi
  trạng thái, hết giăng tay) · vòng bị hạ tầng đốt lượt `↓` · token máy mỗi vòng `↓` (giám sát thôi tự giăng
  lại) · phút máy mỗi lượt chấm `=`. Điều kiện tin cậy: bộ phát lịch không chấm gì, nên đường verdict giữ
  nguyên thành phần.

### Đề xuất chia hàng (máy đề xuất, chốt ở S1)

| Hàng | Trục | Việc | Đi sau |
|---|---|---|---|
| DP0 | 4 | Ba phép đo tài khoản trên máy thật. Không có mã. Chủ kho đổi tài khoản một lần, máy ghi kết quả | — (đi trước, vì kết quả đổi thiết kế của DP3 và DP4) |
| DP1 | 1 | Đóng gói lõi vào kit: bật theo kho, mặc định tắt, đường đọc-cũ cho thư mục đợt crm | — |
| DP2 | 2 | Mở đợt một lệnh, khai vai lúc mở | DP1 |
| DP3 | 3 | Tiếp tục một lệnh, chạy lại được nhiều lần | DP1 |
| DP4 | 4 | Báo hạn mức, bàn giao nhẹ, tiếp tục dưới tài khoản kia | DP0, DP3 |
| DP5 | 1 | Nâng OneFlow, cấu hình đợt, chạy đợt thử. Đây là phép đo SỐNG, việc nằm ở kho OneFlow | mốc phát hành mang DP1–DP4 |

Việc ở crm (gỡ bản riêng, chuyển sang lõi của kit) là việc của crm. Phiên giám sát `sau-14-10` điều phối
việc này ở quãng lặng.

## Out of scope từ khám phá

- **Nhiều máy, chuyển máy (N2, N4).** Chủ kho hoãn ngày 09/10, sau khi thử hai máy cùng tài khoản: hai
  phiên thấy nhau nhưng tin Remote Control không tới chiều nào. Mở lại khi kit có kênh tin dựng sẵn,
  hoặc khi tin Remote Control cùng tài khoản nhắn được.
- **Lớp chung trên GitHub** (hàng việc có trường `may`, kênh yêu cầu qua nhãn PR). Chỉ cần cho nhiều máy,
  nên hoãn cùng N2.
- **Bộ phát lịch tự gộp PR** (giai đoạn 1b của spec). crm chưa dựng phần này, nên không có gì để đóng gói.
- **S4 trên phiên cloud** (giai đoạn 2 của spec).
- **Các bài học khác của đợt `sau-14-10`** (bản nháp trong bản ghi nhu cầu §5 mục 4): tự gắn `mo_merge`,
  giữ hàng gộp khi hồ sơ hoá cũ, bản đồ cặp PR xung đột, đăng ký phiên mở thẳng từ chip. Mục nào đợt thử
  OneFlow vấp thì vào. Mục còn lại ghi thành hạt giống.
- **Tự mở phiên thợ không cần người bấm.** App khoá `start_session`, kit không gỡ được. Khai ở giả định 6.
