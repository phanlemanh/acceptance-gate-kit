---
schema_version: 1
feature: làn máy sống qua bộ phân loại — lệnh kiểm cố định của kho thôi phải xin phép từng lần (A) + nghi thức biết đường thoái hoá tuần tự khi fan-out nghẽn (B)
slug: lan-may-song-qua-bo-phan-loai
owner: manh.phan@onemount.com
risk_tier: T2
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-08-25-lan-may-song-qua-bo-phan-loai-design.md
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: "2026-08-25T13:58:00Z"
---

# Acceptance Contract: lan-may-song-qua-bo-phan-loai

## Context

~15 vòng nghiệm thu trên 5 hồ sơ chết vì bộ phân loại an toàn bị giới hạn nhịp
(04/08 → 25/08, ≥28 triệu token cho 0 bằng chứng máy). Kho không cho-phép-sẵn lệnh
nào nên mọi lệnh của mọi agent đều phải hỏi; tung 26–30 agent là một cơn bão request.
Sổ cái: `docs/findings/2026-08-25-retro-classifier-va-nghi-thuc-khong-hoc.md`.

Nửa B là bài học **đã chứng hai lần** (chip A vòng 4 · chip B vòng 1) mà chưa bao giờ
được viết vào nghi thức — ô này là ứng viên hạt giống (c) ghi ngày 21/08.

**PHÁT HIỆN S1 quyết định hình dạng:** khoá `permissions.autoMode.classifyAllShell`
của khung cấu hình harness tự mô tả «khi true, mọi luật cho-phép Bash bị TREO… mặc
định false» — nói ngược lại, mặc định lệnh khớp luật cho-phép KHÔNG đi qua bộ phân
loại. Đó là căn cứ nhất thủ cho nửa A.

**RÀNG BUỘC đo được cùng lượt:** sửa `.claude/settings.json` giữa phiên KHÔNG có hiệu
lực (phá thử: cài luật CẤM cho một lệnh vô hại, lệnh đó vẫn chạy). Nên hiệu lực lúc
chạy không kiểm được trong phiên tạo ra nó — xem Notes.

**BASE-LMSQBPL:** `02d9bb59828f9ddfc061590701bdaf67910e27a3` — mốc git CỐ ĐỊNH trước ô này (điểm cắt nhánh), dùng làm
bản đối chiếu cho AC-3. Neo vào `origin/main` là sai: sau khi ô này gộp thì hai đầu
bằng nhau và phép đo tự chết mà vẫn xanh (lớp lỗi thước-ghim-vào-thứ-sẽ-đổi).

Source input: _acceptance/lan-may-song-qua-bo-phan-loai/opportunity.md
Đề bài: docs/plans/2026-08-25-hat-giong-lan-may-song-qua-bo-phan-loai.md

## Criteria

- AC-1: Given `.claude/settings.json` và `_acceptance/config.yaml`, When đọc cả hai, Then tập lệnh trong `permissions.allow` KHỚP SONG ÁNH với tập lệnh giải từ `feature_loop.suite_keys` — thừa một lệnh hoặc thiếu một lệnh đều ĐỎ, và thông điệp đỏ nêu ĐÍCH DANH lệnh thừa/thiếu. Tập lệnh là QUAN HỆ giữa hai file, không phải danh sách gõ tay ở một chỗ.
- AC-2: Given mọi entry trong `permissions.allow`, When kiểm hình dạng, Then mỗi entry là khớp CHÍNH XÁC một lệnh — KHÔNG entry nào chứa ký tự `*`. Mệnh đề đóng và đếm được, cố ý thay cho «cấm glob rộng» (phủ định phổ quát trên không gian mở, đúng lớp lỗi đã trả giá bốn vòng ở hồ sơ design-pass-nac).
- AC-3: Given bản `.claude/settings.json` ở mốc git CỐ ĐỊNH `BASE-LMSQBPL` và bản trong cây đang kiểm, When so hai bản, Then HAI CHÂN RỜI đều đúng: (a) mọi khoá cấp cao NGOÀI `permissions` giữ nguyên từng ký tự; (b) BÊN TRONG `permissions`, mọi khoá ngoài `allow` (`deny`, `ask`, `defaultMode`, `additionalDirectories`…) giữ nguyên, và `allow` chỉ được THÊM chứ không được xoá phần tử có sẵn. Danh sách khoá phải-giữ RÚT TỪ chính bản ở mốc, KHÔNG liệt tay — liệt tay là một allowlist mới. Phép đo này là RĂNG HỒ SƠ (`rang-khong-nuot.sh`), CỐ Ý không vào bộ kiểm thường trực và chết theo hồ sơ khi gộp: nó so một file cấu hình SỐNG của kho với một mốc BẤT BIẾN, nên để trong suite thì mọi sửa hợp lệ về sau của `enabledPlugins`/`extraKnownMarketplaces` — do hồ sơ KHÁC làm — sẽ làm suite đỏ oan. Đo trên VẬT THẬT (mốc ↔ cây), không đo một hàm trộn dựng riêng cho test: ô này KHÔNG giao đường trộn nào, nửa A là một lần sửa có chủ đích. GIỚI HẠN TẦM VỚI, khai thẳng: bản ở mốc chưa có khối `permissions` nào, nên chân (b) hôm nay không có gì để mất trên cặp thật — nó được chứng biết đỏ trên một cặp SINH BỞI CODE (cùng hàm so, khác input) và trở thành phép đo trên vật thật ngay khi settings của kho có `deny`/`ask`.
- AC-4: Given khuôn `commands/acceptance-init.md`, When người dựng kho mới đọc, Then có khối khuyên khai luật cho-phép cho suite của họ, nêu đủ ba điều: dạng khai KHỚP CHÍNH XÁC (không glob), vì sao (bộ phân loại là nút cổ chai của làn máy), và câu khai rõ kit KHÔNG tự ghi luật vào kho họ — đó là quyết định an ninh của đội đó.
- AC-5: Given nhánh `BLOCKED` trong `feature-loop/skills/feature-loop/SKILL.md`, When đọc, Then có đường thoái hoá nêu đủ: điều kiện kích hoạt (lượt bị chặn VÌ BỘ PHÂN LOẠI, phân biệt với BLOCKED vì nguyên nhân khác), hành động bắt buộc (lượt kế đi verify độc lập TUẦN TỰ, KHÔNG fan-out lại), và con trỏ tới đường tuần tự đó — nằm giữa cặp mốc neo `CLASSIFIER-FALLBACK`, và mốc neo là chỗ DUY NHẤT khai luật này trong hai thư mục `skills/` và `feature-loop/`.
- AC-6: Given `GUIDE.md`, When người vận hành tra, Then nêu cả hai: luật cho-phép của kho (làm gì, đánh đổi gì) và đường thoái hoá của nghi thức — người đọc tài liệu không phải đọc SKILL mới biết.
- AC-8: Given mọi entry trong `permissions.allow`, When kiểm văn phạm, Then mỗi entry khớp ĐÚNG khuôn luật quyền của khung cấu hình harness — dạng `Bash(<lệnh>)` — và nằm đúng dưới `permissions.allow` (không phải `ask`/`deny`). Khuôn đặt MỘT chỗ có mốc neo `PERM-RULE-GRAMMAR` kèm con trỏ tới nguồn khung cấu hình; cấm mỗi bên tự chế khuôn riêng. «MỘT chỗ» ĐẾM TRÊN các thư mục `tests/`, `lib/`, `scripts/`, `commands/`, `hooks/`, `skills/`, `feature-loop/` — phạm vi phải đóng thì phép đo mới phủ trọn lời hứa; để mở là lời hứa không thuộc loại chứng được. Vế này tồn tại vì bên VIẾT và bên ĐỌC có thể trôi cùng nhau: nếu settings ghi entry trần và bộ đọc của test cũng không mong bọc, thì song ánh và phép đếm `*` đều XANH trong khi luật câm hoàn toàn với harness.
- AC-7: Given bộ ca của ô này, When đọc test, Then mỗi mệnh đề đo được có chiều đỏ đi qua CHÍNH hàm/bộ kiểm của chiều xanh (cùng bộ đọc, khác input), fixture do CODE SINH trong chính lượt chạy, thông điệp đỏ GHIM tên vật/lệnh thiếu — không assertion âm-tính-một-mình, không thước viết vừa khít mutant của chính nó, không fixture do người viết tự liệt. (judgment)

## Coverage

- Trục A — Vật mang lời khai: luật cho-phép trong `.claude/settings.json` | khối khuyên trong `commands/acceptance-init.md` | đoạn thoái hoá trong `feature-loop/skills/feature-loop/SKILL.md` | tài liệu `GUIDE.md` [thước CE: bốn vật đối chiếu mục «Điều muốn có» của hạt giống 25/08 + danh sách file suy ở S0]
- Trục B — Hình dạng lời khai: đúng & hẹp | thiếu hẳn | **rộng quá (glob nuốt cả họ lệnh)** | sai chỗ / sai cú pháp [thước CE NGÀNH: `sudoers` NOPASSWD phân biệt lệnh-cụ-thể với `ALL` · khối `permissions:` của GitHub Actions theo least-privilege · khung cấu hình harness (`allow`/`deny`/`ask` + `classifyAllShell`), đọc nguyên văn ở S1]
- Trục C — Đời kho đọc vào: kho tự host | kho tiêu thụ mới init | kho tiêu thụ cũ đã init [thước CE: ba nhánh đọc-cũ đã chạy thật trong kit — contract thiếu Coverage 1.13.0, workspace thiếu gap-probe 1.14.0, sổ phiên thiếu `context:` 2.0.0]
- Ô Core → AC-1…AC-8; Later/Never → Out of scope. Ô nguy hiểm nhất là B«rộng quá» — nó biến allowlist thành cửa mở mà không kêu một tiếng. Ô đó KHÔNG do một AC đóng, mà do HAI: AC-2 đóng dạng ký tự `*` (mệnh đề đếm được trên tập entry); các dạng «rộng ra» khác — rút `permissions.deny` đang có, nới `defaultMode` — do AC-3 chân (b) đóng (mọi khoá trong `permissions` ngoài `allow` giữ nguyên so với mốc). Khai tách như vậy vì một bộ kiểm chỉ đếm `*` mà bị đòi bắt cả hai dạng kia là thước đòi chiều đỏ không bao giờ xảy ra.

## Đường đo

- Thước: số vòng S4 chết vì bộ phân loại trên lệnh đã cho-phép-sẵn (đích: 0 trong 5 vòng kế, hoặc tới 30/09) · số từ: mục `## Iterations` của evidence-report + run-log các hồ sơ · bảo đảm bởi: AC-1, AC-2 (luật phải có mặt và đúng hình dạng thì mới có gì để đo)
- Thước: còn chuỗi ≥2 lượt fan-out BLOCKED liên tiếp không (ngưỡng CHẾT: còn) · số từ: mục Iterations, đếm lượt liên tiếp cùng hồ sơ · bảo đảm bởi: AC-5 (đường thoái hoá phải nằm trong nghi thức thì máy mới đổi đường)
- Thước: danh sách cho-phép có gây một sự cố thật không (ngưỡng CHẾT: có) · số từ: ĐẾM TAY trên sổ vấp `docs/research/so-vap-trien-khai.md` · bảo đảm bởi: AC-2, AC-3 (khớp chính xác + không nuốt cấu hình khác)
- (KHÔNG ĐO trong ô này) Hiệu lực lúc chạy của luật cho-phép — settings đọc lúc khởi động phiên nên không phép đo nào trong phiên chứng được; xem Notes. Cổng Giá trị đọc ô này với ô đó CHƯA ĐO, có lý do và con trỏ tới ngưỡng Cổng Đáng.

## Out of scope

- **Răng hồ sơ `_acceptance/*/rang*.sh` KHÔNG vào danh sách cho-phép.** Kho đang có 38 răng; tên chúng đổi theo từng hồ sơ nên mọi luật cho chúng hoặc lỗi thời hoặc phải glob rộng — đúng ô nguy hiểm B«rộng quá». Suite chạy MỖI vòng (tải cao nhất), răng chạy một lượt: cắt theo Pareto.
- **Không dùng khoá `autoMode.allow`** (nhét lệnh vào phần allow của chính bộ phân loại) — nó vẫn GỌI bộ phân loại: giảm rủi ro bị từ chối, không giảm số lần gọi, nên không chạm nguyên nhân.
- **Không tự ghi luật cho-phép vào kho tiêu thụ** — kit chỉ khuyên trong khuôn; quyền là quyết định an ninh của đội đó.
- **Không làm fail-fast** (lệnh máy đầu bị chặn → dừng vòng sớm khỏi chi ~2M cho hội đồng/rà soát) — chạm engine workflow, xếp kho ở hạt giống, mở lại nếu sau ô này tần suất chặn vẫn đáng kể.
- Không sửa cách mint `run_id` khi BLOCKED-cùng-round (vấp 21/08) — họ hàng nhưng khác vật.
- Không đụng lõi cưỡng chế: `hooks/**`, `lib/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` — giữ T2.
- Không bắt kho tiêu thụ cũ migrate — khuôn chỉ khuyên, kho đã init không bị cờ nào.

## Notes

- **Giới hạn đã khai, đo được ở S1:** hiệu lực lúc chạy của nửa A KHÔNG có phép đo nào trong ô này. `.claude/settings.json` đọc lúc khởi động phiên; phá thử ở S1 (cài luật CẤM cho một lệnh vô hại rồi chạy đúng lệnh đó — nó vẫn chạy) cho thấy sửa giữa phiên không có hiệu lực. Bằng chứng máy của ô này chứng minh **lời khai đúng hình dạng và đúng quan hệ**, không chứng minh làn máy hết nghẽn. Chứng minh đó là 5 vòng S4 kế, và đó chính là thứ Cổng Giá trị đọc.
- Căn cứ nhất thủ cho nửa A: khoá `permissions.autoMode.classifyAllShell` trong khung cấu hình harness — «mặc định false» nghĩa là luật cho-phép KHÔNG bị treo, tức lệnh khớp luật không đi qua bộ phân loại.
