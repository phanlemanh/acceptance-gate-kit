---
schema_version: 1
feature: Chủ kho khai chính sách một lần khi mở chiến dịch; máy tự dời hàng khớp chính sách — báo trước một nhịp, ghi sổ — và chủ kho trả lại hay ghim một hàng bằng một lệnh, còn tệp lộ trình giữ nguyên định dạng, thứ tự và mọi khoá lạ
slug: ap-chinh-sach-lo-trinh
owner: phanlemanh@gmail.com
risk_tier: T3               # hàng RM2 khai T3: CỘNG ba lệnh khoá (ADR 0002 + P32) · scripts/lo-trinh.mjs ghi tệp kế hoạch của kho · SKILL feature-loop S0 · gói road-map — không chạm lib/**, hooks/**, lưới trước-merge, dieu-phoi/
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-15-ap-chinh-sach-lo-trinh-design.md
status: signed-off
approved_by: Manh Phan
approved_at: 2026-10-15T02:16:50Z
---

# Acceptance Contract: ap-chinh-sach-lo-trinh

## Context

Vòng 2 của gói `road-map` theo hướng B′ (`docs/findings/2026-10-14-kien-truc-roadmap-plugin.md` §6 mục 2–3, §11; ADR 0025
bổ sung 14/10). Vòng 1 (`ra-soat-lo-trinh`, ký 15/10) làm lát «chỉ cờ». Vòng này thêm phần còn lại:
- chính sách khai trên mốc chiến dịch;
- máy tự áp theo nhịp báo trước → áp, có trần mỗi ngày;
- bộ ghi cùng tệp với bộ đọc;
- sổ tự áp;
- trả lại · ghim · bỏ ghim;
- `/road-map:xem` thành bản đồ;
- giới hạn Ngoài-3 của RM1.
Chủ kho ký Cổng Đáng 15/10 với ngoại lệ luật chiều rộng (b) (sổ dòng `gate0`).

Kho thử trong mọi ca do code sinh trong lượt: thư mục tạm, `git init`, commit ghim ngày bằng `GIT_COMMITTER_DATE` /
`GIT_AUTHOR_DATE`, hồ sơ dựng theo hình dạng ô của bản đồ. «Hôm nay» ghim bằng `ACCEPTANCE_TODAY`. Giá trị mong đợi
viết sẵn trong ca, không rút từ đầu ra của hàm đang đo. «Bộ máy gốc» = `scripts lib skills commands road-map`, lấy bằng
`git archive <gốc so>` trong lượt, với gốc so đọc từ `_acceptance/ap-chinh-sach-lo-trinh/goc-so` (hôm nay `d01df558`).
Nhánh nhận nền mới thì tệp đổi sang commit nhận nền, kèm một dòng sổ `fix`. «Kho không bật tự áp» = không mốc chiến
dịch đang chạy nào khai `chinh_sach.tu_ap: true`.

## Criteria

- AC-1: Given kho thử có:
  - `chinh_sach` ở tệp: `{tuoi_ngay: 30, tran_ke_tiep: 2}`;
  - mốc A `phat-hanh` đã qua ngày, khai `{tu_ap: true}`;
  - mốc B `phat-hanh` hôm nay + 3, khai `{tu_ap: true, tuoi_ngay: 20}`;
  - mốc C `phat-hanh` hôm nay + 10, khai `{tu_ap: false}`;
  - mốc N `ngoai`, khai `{tu_ap: true}`;
  When chạy `lo-trinh.mjs --ap --json`, Then:
  - chiến dịch đang chạy = B; chính sách hiệu lực BẰNG `{tu_ap: true, tuoi_ngay: 20, tran_ke_tiep: 2, nhip_ngay: 1, tran_ap: 5}`;
  - luật tuổi của `--ra-soat --json` dùng 20, không dùng 30 (hàng tuổi 25 mang `tuoi`);
  - trang lộ trình có đúng một cờ «chính sách chỉ khai ở mốc phát hành» nêu mốc N.
  Given `tu_ap: "true"` (chuỗi) ở B, Then có đúng một cờ «chính sách tu_ap phải là true hoặc false», và `--ap --write` không tạo sổ, không đổi tệp.
  Given ba kho không bật tự áp, Then:
  - `--ap --write` thoát 0, `git status --porcelain` rỗng, không có tệp sổ;
  - `--ra-soat` (chữ và JSON) giống TỪNG BYTE bộ máy gốc, sau đối chứng dương.
  Chiều đỏ:
  - bản sao chọn mốc xa nhất → ca đỏ «chiến dịch đang chạy: C, cần B»;
  - bản sao đọc `tu_ap` từ khối của tệp → ca đỏ «kho không bật tự áp mà máy ghi sổ».
- AC-2: Given kho bật tự áp (`nhip_ngay: 1`, `tran_ap: 2`) với ba đề xuất X (`tuoi`), Y (`moc-qua-ngay`), Z (`ho-so-bac`), hôm nay D = 2026-10-20, When chạy `--ap --write` lần lượt:
  - ngày D; lại ngày D;
  - ngày D+1, sau khi Y có hồ sơ đang mở;
  - ngày D+2;
  Then:
  - ngày D: tệp lộ trình không đổi byte; sổ có đúng ba dòng `bao-truoc` với `ap_tu: 2026-10-21`;
  - lần chạy thứ hai cùng ngày D: sổ không đổi byte;
  - D+1: X và Z được áp (trần 2), Y nhận một dòng `huy`;
  - D+2: không thêm dòng nào.
  Given cùng kho với `tran_ap: 1`, Then D+1 áp đúng X (theo thứ tự hàng trong tệp), D+2 áp Z.
  Given X được báo trước ngày D với luật `tuoi`, và tới D+1 hồ sơ của X bị bác (đề xuất đổi thành `bac`), Then ngày D+1 tệp
  không đổi; sổ có `huy` cho cái cũ và `bao-truoc` mới (`bac`, áp từ D+2); X vào `da_bac` ngày D+2.
  Dãy dòng sổ (loai, ma, ngay) BẰNG dãy viết sẵn.
  Chiều đỏ:
  - bản sao áp ngay ngày báo trước → ca đỏ «áp trước nhịp: X»;
  - bản sao không kiểm đề xuất còn nguyên → ca đỏ «áp hàng đã có hồ sơ mở: Y»;
  - bản sao bỏ trần → ca đỏ «áp 3, trần 2»;
  - bản sao chỉ so mã khi áp → ca đỏ «áp đề xuất chưa báo trước: X bac».
- AC-3: Given kho bật tự áp có năm hàng, When báo trước ở D và áp ở D+1, Then tệp lộ trình sau áp BẰNG đối tượng viết sẵn trong ca. Năm hàng:
  - M ở mốc chiến dịch đã qua (dời mốc);
  - T ngoài mốc, quá tuổi (chờ điều kiện);
  - L tự khai «xếp lại», đã có `ly_do` riêng;
  - B có hồ sơ đã bác;
  - Q ở mốc đã qua của một tệp không còn mốc chiến dịch nào phía trước.
  Hình mong đợi:
  - M nằm cuối `hang` của chiến dịch đang chạy và không còn ở mốc cũ;
  - T và L là hai mục cuối `chan_troi`, mang `ly_do` (L giữ `ly_do` cũ, câu máy vào `ly_do_may`), `mo_lai_khi`, `tu_ap: {ngay}`, và không còn ở mốc nào;
  - B là mục cuối `da_bac`;
  - Q không đổi, và JSON mang cảnh báo «không có mốc chiến dịch phía trước».
  Tập mã trên hợp `hang ∪ chan_troi ∪ da_bac` không đổi.
  Chiều đỏ:
  - bản sao xoá hàng thay vì chuyển → ca đỏ «hàng biến mất: T»;
  - bản sao chèn đầu mảng → ca đỏ «mục máy không ở cuối chan_troi».
- AC-4: Given bản sao từng byte của `docs/plans/lo-trinh-kit.json` ở gốc so, thêm khoá lạ ở gốc, ở một hàng, ở một mốc và một object lồng, cùng một đề xuất được áp, When áp, Then:
  - mọi dòng của tệp nằm ngoài các đoạn của hàng bị dời giống TỪNG BYTE bản trước, tính bằng diff dòng do ca tự làm;
  - thứ tự khoá của mọi object không bị dời không đổi, khoá lạ còn đủ;
  - tệp kết bằng đúng một `\n`.
  Given bốn tệp không ở dạng chuẩn — thụt 4 dấu cách · thiếu dòng cuối · có BOM · khoá dạng số trong `tu_vung` — Then `--ap --write` thoát 2 với «tệp lộ trình không ở dạng chuẩn — máy không ghi: <tệp>», tệp và sổ không đổi (băm + mtime).
  Chiều đỏ:
  - bản sao ghi thụt 4 dấu cách → ca đỏ «byte ngoài phần dời đổi»;
  - bản sao bỏ điều kiện trước → ca đỏ «ghi đè tệp không chuẩn: <ca>».
- AC-5: Given hai bản clone của cùng một kho bật tự áp, When mỗi bản chạy `--ap --write` ngày D rồi D+1 trên nhánh riêng và commit, Then:
  - tệp lộ trình và sổ của hai bản giống TỪNG BYTE;
  - `git merge` nhánh này vào nhánh kia thoát 0, không xung đột;
  - mỗi dòng `ap` có `ngay` (không giờ), `ma`, `de_xuat`, `luat`, `can_cu`, `vi_tri`, `hang_goc`, `lenh_tra_lai`.
  Given bản sao dừng ngay sau khi ghi dòng `ap` mà chưa đổi tệp lộ trình, When bản lành chạy lại cùng ngày, Then tệp được đổi đúng một lần, sổ không có dòng `ap` thứ hai cho mã đó, và tệp bằng kết quả của lần chạy không đứt.
  Chiều đỏ: bản sao ghi giờ vào `ngay` → ca đỏ «sổ hai máy khác byte».
- AC-6: Given kho của AC-3 sau khi áp T (`tuoi`) và M (`moc-qua-ngay`), mỗi lệnh `--write` theo sau bởi một commit ghim ngày (như S0 thật), When:
  - (a) `--tra-lai T --write` rồi `--tra-lai M --write`;
  - (b) `--ap --write` ngày kế;
  - (c) hồ sơ của T bị bác, rồi `--ap --write` ngày kế nữa;
  - (d) `--ghim M --write`, rồi chạy áp ở các ngày kế; sau đó `--bo-ghim M --write` và chạy áp ngày kế;
  - (e) `--ghim` một hàng đang có `bao-truoc` chờ;
  Then:
  - sau (a), tệp lộ trình giống TỪNG BYTE tệp trước lần áp;
  - (b) không sinh `bao-truoc` cho T hay M (cùng đề xuất vừa bị trả);
  - (c) sinh `bao-truoc` mới cho T với đề xuất `bac` (đề xuất đã đổi);
  - (d) khi M đang ghim: không `bao-truoc` nào cho M, tệp lộ trình không đổi byte vì lệnh ghim, và tuổi T/M trong JSON rà
    soát không đổi vì ghim; sau khi bỏ ghim: sổ của M chỉ có `bao-truoc` khi đề xuất khác lần bị trả;
  - (e) sinh một dòng `huy` cho hàng ấy;
  - dòng `tra-lai`/`ghim`/`bo-ghim` mang `boi` = `git config user.name` của kho thử.
  Lệnh từ chối:
  - `--tra-lai` một mã chưa từng áp → thoát 2 «không có lần áp nào của <mã> để trả lại»;
  - `--tra-lai` khi mục máy chuyển đã bị sửa tay → thoát 2 «hàng đã đổi sau khi máy áp — trả lại bằng tay», tệp không đổi.
  Chiều đỏ:
  - bản sao bỏ luật «chặn đề xuất vừa bị trả» → ca đỏ «máy báo trước lại đề xuất vừa trả: T tuoi»;
  - bản sao ghi khoá ghim lên hàng → ca đỏ «lệnh ghim đổi tệp lộ trình».
- AC-7 (CỘNG — chủ kho duyệt đích danh ở Cổng Phạm vi): Given cây, When đọc gói `road-map` và chạy suite plugin vùng 1 cùng ca của hồ sơ, Then:
  - `road-map/commands/ghim.md`, `bo-ghim.md`, `tra-lai.md` mang `disable-model-invocation: true`; `xem.md` không mang;
  - P32 khoá cả ba qua một danh sách riêng `LOCKED_ROAD_MAP`, đọc thư mục `road-map/commands/`; danh sách `LOCKED` của acceptance-gate giữ nguyên bảy tên (NO-AC11 không đổi);
  - ADR 0002 nêu ba tên kèm câu vì sao;
  - dòng lệnh trong từng tệp lệnh (rút từ tệp, không chép tay) chạy trên kho thử của AC-6 ra đúng hiệu ứng của `--ghim` / `--bo-ghim` / `--tra-lai`.
  Chiều đỏ:
  - bản sao gỡ khoá của `ghim.md` → P32 đỏ nêu `road-map/commands/ghim.md`;
  - bản sao khoá `xem.md` → P32 đỏ nêu `xem.md`.
- AC-8: Given kho thử bật tự áp có ba hàng đã giao, hai đang dở, bốn chưa làm, ba đề xuất (một hàng ghim), một báo trước và một đã áp trong 7 ngày, When chạy dòng lệnh rút từ `road-map/commands/xem.md`, Then đầu ra BẰNG khối dòng viết sẵn, theo thứ tự:
  - `Xong 3 · Đang dở 2 · Kế 4`;
  - danh sách đang dở;
  - hàng kế cùng tối đa ba hàng tiếp;
  - khối «Rà soát» (hàng ghim mang «(ghim — máy không tự áp)»);
  - khối «Tự áp» (báo trước kèm ngày áp · đã áp kèm lệnh trả lại · chính sách chiến dịch đang chạy).
  Lệnh thoát 0 và không ghi tệp nào. Kho không bật tự áp: không có khối «Tự áp»; `--ra-soat` giữ nguyên byte với bộ máy gốc.
  Given tệp lộ trình trong kho git mà chưa từng commit, có `tuoi_ngay`, Then JSON rà soát mang `canh_bao` «không đọc được tuổi hàng — luật tuổi không chạy (tệp lộ trình chưa từng commit)», và cả lệnh xem lẫn thẻ khởi động in câu ấy đúng một dòng (RM1 Ngoài-3).
  Chiều đỏ:
  - bản sao để lệnh xem ghi tệp → ca đỏ «lệnh xem ghi tệp: <tệp>»;
  - bản sao bỏ cảnh báo chưa commit → ca đỏ «tệp chưa commit mà không cảnh báo».
- AC-9: Given kho bật tự áp có hai báo trước và một đã áp, When chạy bộ quét thẻ khởi động, Then:
  - `loTrinh.dong` có đúng một dòng `Tự áp: 2 báo trước (áp từ <ngày>) · 1 đã áp 7 ngày qua` cùng ba dòng chi tiết, đặt ngay sau khối «Rà soát»;
  - `git status --porcelain` rỗng sau lệnh.
  Given ba kho không bật tự áp và không có đề xuất rà soát nào (không khai lộ trình · không mốc · mốc chưa tới ngày, không chính sách), Then stdout bộ quét giống TỪNG BYTE bộ máy gốc (sau đối chứng dương). Given kho có chiến dịch đang chạy mà không khai `tu_ap`, Then có đúng một dòng «chiến dịch <tên> chưa khai chính sách tự áp — chỉ cờ», và chỉ ở kho có ít nhất một đề xuất.
  Chiều đỏ: bản sao in dòng «Tự áp: 0 báo trước» ở kho không bật → ca so byte đỏ nêu kho.
- AC-10: Given kho bật tự áp có báo trước đã qua nhịp cho hàng X và cho chính hàng H, When chạy `lo-trinh.mjs --hang H --mo-o`, Then:
  - việc áp chạy TRƯỚC khi mở ô: X được áp như AC-3;
  - H KHÔNG bị áp, giữ đúng chỗ cũ, và sổ có một dòng `huy` cho H;
  - JSON in ra mang `ap: {bao_truoc, da_ap, huy}` đúng số viết sẵn; ô cơ hội của H vẫn được tạo.
  Given kho không bật tự áp, Then stdout và ô cơ hội của `--mo-o` giống TỪNG BYTE bộ máy gốc. SKILL feature-loop S0 có khối máy đọc `S0-AP-COMMIT` ghim tiêu đề commit `lo-trinh(may-ap): <n> hàng — <ngày>`.
  Given kho thử có ba commit, When chạy `_acceptance/ap-chinh-sach-lo-trinh/nen/do-nen.mjs`, Then lớp «dời» đếm đúng 1. Ba commit là:
  - một commit dời tay;
  - một commit máy áp mang tiêu đề `lo-trinh(may-ap)`;
  - một commit máy áp KHÔNG mang tiêu đề ấy (như sau khi gộp squash), nhưng sổ có dòng `ap` khớp.
  Given một commit chứa cả phần máy áp (khớp sổ) lẫn một lần dời tay, Then lớp «dời» đếm 1.
  Chiều đỏ:
  - bản sao áp cả hàng đang mở → ca đỏ «áp hàng đang mở: H»;
  - bản sao thước trừ theo tiêu đề commit → ca đỏ «lớp dời 2, cần 1».
- AC-11: Given bản sao `docs/plan/` + `_acceptance/` của crm ở `3818ad4e`, bung bằng `git archive` trong lượt (crm vắng trên máy → thoát 2 nêu đường, không xanh), mỗi tệp được thêm `chinh_sach: {tu_ap: true, tuoi_ngay: 14, tran_ke_tiep: 5}` vào mốc `phat-hanh` đầu tiên có ngày ≥ hôm nay (tệp không có mốc ấy thì thêm một mốc `phat-hanh` hôm nay + 7), hôm nay 2026-10-15, When chạy `--ap --write` ngày 15/10 rồi 16/10, Then:
  - tập (tệp, mã, đề xuất) được báo trước rồi áp BẰNG tập viết sẵn từ một phép đếm độc lập (luật viết riêng trong ca);
  - mọi tệp vẫn qua điều kiện dạng chuẩn sau khi ghi;
  - tập mã trên hợp ba khối của mỗi tệp không đổi;
  - `product-map.mjs --check` của bản sao thoát 0 sau khi vẽ lại.

## Coverage

Quét bằng `morphological-scan` (preset entity-feature; thực thể = một lần máy tự áp lên một hàng). Bản đầy đủ ở
`_acceptance/ap-chinh-sach-lo-trinh/coverage-scan.md`.
- Chân sản phẩm: `[SUY-TỪ-REPO: scripts/lo-trinh.mjs]`, B′ §6/§11, số đo nền crm 15/10.
- Chân ngành: `[NGÀNH: GitHub actions/stale]` (báo trước rồi mới đóng · nhãn miễn trừ), `[NGÀNH: Linear — auto-close]`, `[NGÀNH: Renovate — Dependency Dashboard]`.

- Trục A — đề xuất → hành động: dời mốc · chờ điều kiện · bác · dời mốc không còn chiến dịch phía trước  [thước CE: B′ §6 mục 3] → AC-3, AC-11
- Trục B — pha: báo trước · trong nhịp · áp · huỷ · trả lại · ghim  [thước CE: actions/stale, B′ §11] → AC-2, AC-6
- Trục C — chính sách: không khai · khai ở tệp không tự áp · chiến dịch đang chạy bật · khai sai · mốc đã qua có chính sách  [thước CE: ADR 0025 bổ sung, B′ §11 `docChinhSach`] → AC-1
- Trục D — mặt và tệp: tệp lộ trình · sổ · thẻ khởi động · lệnh xem · ba lệnh khoá · trang (không đổi) · nhiều máy cùng áp  [thước CE: B′ §6 mục 3, §11 ràng buộc (i)(ii), ADR 0002] → AC-4, AC-5, AC-7, AC-8, AC-9
- Điểm chạy tự động + thước «dời bằng tay» trừ commit máy  [thước CE: ngưỡng ô cơ hội] → AC-10
- Dữ liệu thật crm  [thước CE: số đo nền `nen/`] → AC-11

## Đường đo

- «Ở kho đã khai chính sách, một mốc khép mà chủ kho không phải sửa tay tệp lộ trình lần nào để dời hàng quá hạn». Số đọc:
  `nen/do-nen.mjs <gốc crm>` trên cửa sổ giữa hai mốc khép sau khi crm cài bản chứa RM2 và khai `tu_ap`. Lớp «dời» đã trừ
  phần máy làm, nhận ra bằng dòng `ap` của sổ tự áp (không bằng tiêu đề commit). SỐNG = 0; nền = 8 commit / 12 ngày. Bảo đảm bởi AC-10 (thước trừ commit máy) và AC-2/AC-3 (máy
  thật sự dời).
- «Mỗi lần máy tự dời có một dòng sổ và trả lại được bằng một lệnh». Số đọc: mỗi dòng `ap` trong sổ của crm có
  `lenh_tra_lai`; chạy thử lệnh ấy trên một bản sao phải thoát 0. Bảo đảm bởi AC-5, AC-6.
- crm chưa cài bản chứa RM2 lúc tới hạn thì ô đo ghi «chưa đọc được ở đây» — nhãn trạng thái, không phải CHẾT.

## Out of scope

- Đóng băng (`dong_bang`) và cờ cắt-lượt-vào-mốc-đang-chạy dưới đóng băng (B′ §10) — vào hạt giống.
- Cửa tín hiệu `/road-map:gui` (RM3) và chính sách hỏi ở thẻ mở đợt — gói `dieu-phoi`, vùng máy M5.
- RM4 (tệp lộ trình khởi tạo) và RM5 (chặn vòng không thuộc hàng). Chặn là khó đảo, không bao giờ máy tự áp.
- Tự kéo mục «chờ điều kiện» về «Kế tiếp» theo `mo_lai_khi`; sổ tự áp hiện trên trang lộ trình.
- Áp khi đọc thẻ khởi động (lệnh `/start` chỉ đọc).
- Lộ trình tính theo giờ máy và khối lượng token (ý định bổ sung của chủ kho 15/10, tới sau Cổng Đáng) — hạt giống `docs/plans/2026-10-15-hat-giong-gio-may-va-token-lo-trinh.md`, chờ một hàng và Cổng Đáng riêng.

## Notes

- Ghim chỉ sống trong sổ tự áp: tệp lộ trình và trang không cho thấy hàng nào đang ghim — xem bằng `/road-map:xem`.
- Chính sách không tự chuyển sang chiến dịch kế: khi mốc mang chính sách qua ngày, tự áp dừng tới khi mốc kế khai chính sách
  (thẻ khởi động nhắc nếu có đề xuất). Đo trên crm (AC-11): mốc Việc–Dự án đổi khoảng 9 ngày một lần.
- Con trỏ thay thế (ca đo, không sửa hồ sơ đã ký): LT-97 thêm năm dòng ma trận cho năm dạng cờ khuôn của chính sách trên mốc;
  lời hứa gốc giữ nguyên nghĩa. RS-10 (hồ sơ `ra-soat-lo-trinh`) so «mọi dòng `--ra-soat` có mặt trong đầu ra lệnh xem, đúng
  thứ tự» thay cho so byte, vì lệnh xem thành bản đồ. Lý do: sổ quyết định, dòng `fix` stage S3.
  JR11c (hồ sơ `judge-required-evidence`) tiêm «verdict: FAIL» vào báo cáo KHAI PASS đầu tiên thay cho hồ sơ đầu tiên theo chữ cái
  (lời hứa gốc — bộ kiểm lại bắt mâu thuẫn — giữ nguyên). Lý do: sổ quyết định, dòng `fix` stage S4-r2.
- Trả lại một hàng bị dời vì tuổi thì tuổi hàng tính lại từ ngày trả lại: luật tuổi chỉ theo dõi hàng trong danh sách việc,
  nên hàng rời đi rồi quay về được coi là hàng mới. Hệ quả: hàng ấy không bị đề xuất lại theo tuổi cho tới khi đủ tuổi lần
  nữa (chiều đỏ AP-6-do ghim theo hàng dời mốc M thay cho T).
- Thước «dời bằng tay» trừ nhầm một lần dời tay trùng đúng mã, ngày và khối đích với một dòng `ap` của sổ.
- Sổ tất định chỉ chống xung đột khi hai máy áp CÙNG ngày. Hai máy áp KHÁC ngày trên hai nhánh có thể xung đột khi gộp.
  Đây là giới hạn đã khai, kèm ngưỡng mở lại: ≥ 1 lần gộp xung đột ở tệp lộ trình hay sổ do máy áp.
- Cắt lượt chưa tự gợi ý khối chính sách khi cắt mốc: chủ kho thêm tay; dòng nhắc trên thẻ khởi động (AC-9) là lời nhắc.
- Known limits — chọn ở Cổng Bằng chứng 2026-10-15:
  - Ngoài-1: Một bài kiểm tra của bộ máy chấm có thể báo xanh dù nó chưa thật sự bắt được lỗi mà nó định bắt. Người dùng cuối không thấy gì ngay, nhưng độ tin của màu xanh ở chỗ đó yếu hơn vẻ ngoài.
  - Ngoài-2: Một bài kiểm tra nội bộ có thể vẫn xanh khi hồ sơ mẫu được chọn vốn đã có lỗi, nên không phân biệt được lỗi do bài tiêm với lỗi sẵn có. Người dùng cuối chưa bị ảnh hưởng.
  - Ngoài-3: Một bài kiểm tra nội bộ của bộ máy chấm có thể xanh vì lý do khác với lý do nó tuyên bố, nên màu xanh đó đáng tin kém hơn. Người dùng cuối không thấy hậu quả trực tiếp.
  - Ngoài-4: Nếu chủ kho tự hoàn tác thay đổi máy vừa dời bằng git hoặc undo mà không dùng lệnh trả lại, rồi lần chạy kế trong cùng ngày thì máy có thể áp lại đúng thay đổi đó. Thay đổi bị áp lại sẽ nằm lẫn trong commit khác, không có commit riêng của máy.
  - Ngoài-5: Nếu máy bị ngắt đúng giữa lúc ghi sổ và ghi tệp, rồi lần chạy kế rơi sang ngày hôm sau, sổ sẽ báo một hàng đã được dời trong khi tệp lộ trình chưa hề đổi. Lệnh xem và thẻ khởi động có thể hiện cả «đã dời» lẫn «sẽ dời» cho cùng hàng đó, và lệnh trả lại báo sai là hàng đã bị sửa tay.
  - Ngoài-6: Khi mở việc mới bị từ chối (ví dụ thư mục đã tồn tại), máy vẫn có thể đã dời hàng trong lộ trình rồi. Thay đổi đó nằm lại chưa commit, lần mở sau có thể không còn được tách thành commit riêng của máy.
  - Ngoài-7: Hướng dẫn mà phiên Claude đọc lúc mở việc vừa nói kit không ghi gì vào lộ trình, vừa nói máy sẽ tự dời hàng và commit riêng tệp lộ trình. Hai chỉ dẫn trái nhau có thể khiến phiên làm sai hoặc bối rối.
  - Ngoài-8: Ở kho còn giữ bản chép mã cũ, máy vẫn tự dời hàng nhưng lệnh trả lại hàng báo lỗi tham số lạ. Chủ kho không đảo được việc máy vừa làm bằng một lệnh cho tới khi kho cập nhật bản chép.
  - Ngoài-9: Ba lệnh ghim, bỏ ghim, trả lại mỗi lệnh giữ một bản chép riêng của quy tắc lọc đối số người gõ. Nếu quy tắc gốc đổi sau này, ba bản chép có thể lệch mà không ai hay.
  - Ngoài-10: Nếu tệp lộ trình có dấu BOM đầu tệp và kho bật tự áp, thẻ khởi động phiên và lệnh xem bản đồ có thể vỡ bằng một đống thông báo lỗi thay vì chạy bình thường. Trước thay đổi này, tệp như vậy vẫn đọc được.
  - Ngoài-12: Khi lịch sử có một commit với tệp lộ trình hỏng, số đo trước/sau của vòng này sẽ lệch lặng lẽ mà không có cảnh báo. Con số báo cho chủ kho có thể không phản ánh đúng thực tế.
  - Ngoài-13: Bài kiểm cho trường hợp khai chính sách sai kiểu chỉ chứng minh máy không ghi gì, chưa chứng minh cùng kho khai đúng thì máy có ghi. Nếu máy vốn không báo trước ngày đó thì bài vẫn xanh mà không bắt được gì.
  - Ngoài-14: Bài kiểm cho tệp lộ trình chưa commit chỉ xác nhận không có đề xuất theo tuổi, không xác nhận lý do hay lời cảnh báo. Nếu luật tuổi hỏng hoàn toàn, bài vẫn xanh.
- Ngoài-11 (cờ giả «hồ sơ trỏ hàng không có» sau khi máy dời hàng có hồ sơ) → hạt giống `docs/plans/2026-10-15-hat-giong-co-gia-ho-so-tro-hang-sau-tu-ap.md`.
