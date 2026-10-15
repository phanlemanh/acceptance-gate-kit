---
schema_version: 1
feature: Người nhìn lộ trình thấy mỗi hàng và mỗi mốc ước bằng giờ máy và phần trăm hạn mức tuần; ngày mốc do máy tính từ tổng giờ máy, mốc quá tải có cờ vàng, và mỗi vòng khép ghi giờ máy cùng token thật để ước lần sau sát hơn
slug: lo-trinh-gio-may
owner: phanlemanh@gmail.com
risk_tier: T2               # hàng RM6 khai T2: scripts/lo-trinh.mjs + script mới scripts/do-vong.mjs + khối SKILL feature-loop — không chạm lib/**, hooks/**, lưới trước-merge, lệnh khoá
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-15-lo-trinh-gio-may-design.md
status: implemented
approved_by: Manh Phan
approved_at: 2026-10-15T07:56:41Z
---

# Acceptance Contract: lo-trinh-gio-may

## Context

Hàng RM6 của gói road-map (B′), dựng trên nhánh RM2 (`ap-chinh-sach-lo-trinh`, cùng `scripts/lo-trinh.mjs`). Chủ kho ký
Cổng Đáng 15/10. Ba lớp:
- **ước** — tất định, lên trang lộ trình;
- **ngày** — theo hôm nay, lên `/road-map:xem`;
- **đo** — ghi vào hồ sơ trước chữ ký: dự báo đóng băng lúc mở hàng, giờ máy và token thật khi lượt chấm trả về.

Kho thử trong mọi ca do code sinh trong lượt:
- thư mục tạm, `git init`, commit ghim ngày;
- hồ sơ dựng theo hình ô của bản đồ;
- «hôm nay» ghim bằng `ACCEPTANCE_TODAY`;
- thư mục bản ghi phiên giả do ca sinh, trỏ bằng `CLAUDE_PROJECTS_DIR`;
- tệp đọc hạn mức trỏ bằng `HAN_MUC_TEP`.
Giá trị mong đợi viết sẵn trong ca, không rút từ đầu ra của hàm đang đo. «Bộ máy gốc» =
`git archive <gốc so> scripts lib skills commands road-map`, với gốc so đọc từ `_acceptance/lo-trinh-gio-may/goc-so`.

## Criteria

- AC-1: Given kho thử có sáu hàng (A–D hạng T2):
  - A `gio_may: 6`;
  - B `gio_may: [3, 5]`;
  - C `gio_may: "nhiều"`;
  - D `gio_may: [5, 3]`;
  - E không khoá, hạng T3;
  - F không khoá, không hạng;
  When vẽ trang lộ trình, Then ô giờ máy của sáu hàng BẰNG dãy viết sẵn
  `6 · 3–5 · 4–7 (máy ước) · 4–7 (máy ước) · 7–10 (máy ước) · 4–7 (máy ước, chưa khai hạng)`.
  Trang có đúng hai cờ khuôn:
  - «hàng C: gio_may phải là số giờ dương hoặc cặp [thấp, cao]»;
  - «hàng D: gio_may phải là số giờ dương hoặc cặp [thấp, cao]».
  Trang có đúng một dòng «4/6 hàng máy tự ước giờ máy — khai gio_may trên hàng để ghi đè».
  Given kho thử không có khoá `gio_may` nào và không hồ sơ đo, Then:
  - `--ra-soat` (chữ và JSON), `--ap --json` và `--mo-o` (stdout và ô cơ hội) giống TỪNG BYTE bộ máy gốc, sau đối chứng dương;
  - khối dữ liệu máy đọc của trang giống từng byte bộ máy gốc.
  Given kho thử đã commit trang lộ trình vẽ bằng bộ máy gốc, When chạy `product-map.mjs --check` bằng bộ máy mới, Then
  thoát khác 0 với đúng câu có sẵn «LO-TRINH.html lệch với tệp ý định và hồ sơ — chạy: …»; vẽ lại bằng bộ máy mới rồi
  `--check` thoát 0 (đường nâng kit của kho tiêu thụ: vẽ lại trang một lần, như mọi lần đổi trang trước).
  Chiều đỏ: bản sao nhận `gio_may` chuỗi → ca đỏ «gio_may sai kiểu mà không cờ: C».
- AC-2: Given kho thử có sáu hồ sơ T2 đã giao, mỗi hồ sơ mang dòng `gio-may` đo `[3, 4, 5, 6, 8, 2]` giờ, và năm trong
  sáu có `phan_tram_tuan` `[2, 3, 4, 5, 6]`, When vẽ trang, Then:
  - hàng T2 chưa khoá ghi `3–6 (theo 6 vòng đo)` (p25–p75 lấy theo thứ hạng gần nhất, không nội suy);
  - hàng T3 chưa khoá vẫn ghi `7–10 (máy ước)` vì T3 chưa đủ năm vòng;
  - % ước của hàng T2 là `~4 %`.
  Given chỉ bốn hồ sơ có `phan_tram_tuan`, Then ô % ghi đúng «chưa ước (4/5 vòng đo)».
  Given một hồ sơ đo mà chưa giao, Then nó không vào phép ước.
  Chiều đỏ: bản sao đếm cả hồ sơ chưa giao → ca đỏ «hồ sơ chưa giao vào phép ước: <slug>».
- AC-3: Given kho thử có mốc M `phat-hanh`, mục tiêu D+2, gắn ba hàng chưa giao:
  - T2 khai `gio_may: 5`;
  - T3 không khoá;
  - một hàng đã giao;
  When vẽ trang, Then dòng mốc M mang đúng `~15,5–20 giờ máy` gồm:
  - 5 + 7–10;
  - gộp 2 × 1–1,5;
  - cắt bản 1,5–2.
  Trang vẽ hai lần với `ACCEPTANCE_TODAY` khác nhau giống từng byte.
  Given mốc phát hành M′ có một hàng nhóm `phat-hanh` (hàng cắt bản) và một hàng T2 khai `gio_may: 5`, Then tổng M′ là
  `~7,5–8,5 giờ máy`: hàng cắt bản là phần cắt bản (1,5–2, không cộng thêm cắt bản cấp mốc, không cộng gộp), hàng T2
  là 5 + gộp 1–1,5.
  Given hồ sơ đầu tiên mở trong mốc có `du-bao.json` với hoàn tất dự kiến D+3, Then dòng mốc mang
  «dự báo lúc bắt đầu (dd/mm): hoàn tất dd/mm» và đúng một cờ vàng «mốc quá tải: dự kiến dd/mm, mục tiêu dd/mm».
  Chiều đỏ:
  - bản sao bỏ phần gộp → ca đỏ «tổng mốc 13,5–17, cần 15,5–20»;
  - bản sao đọc hôm nay khi vẽ trang → ca đỏ «trang đổi theo hôm nay»;
  - bản sao cộng cắt bản cấp mốc dù mốc có hàng cắt bản → ca đỏ «cắt bản đếm hai lần: M′».
- AC-4: Given kho thử hôm nay D có:
  - mốc M1: mục tiêu D, ba hàng T3 không khoá, chưa mở;
  - mốc M2: mục tiêu D+5, một hàng `dung_tren` một hàng của M1;
  - một hàng đang dở có dòng `gio-may` đo 3 giờ trên ước 4–7;
  When chạy `lo-trinh.mjs --xem`, Then mỗi mốc chưa khép có đúng một dòng khuôn
  `<mốc>: bắt đầu ~dd/mm · ~X giờ máy · ~Y % hạn mức tuần · hoàn tất dự kiến dd/mm · mục tiêu dd/mm`. Các dòng BẰNG
  khối viết sẵn:
  - bắt đầu M2 = hoàn tất M1;
  - hàng đang dở chỉ tính phần còn lại 1–4 giờ;
  - chưa vòng nào đo nên giờ chờ 0 và mỗi dòng mang «(chưa có giờ chờ đo)»;
  - M1 mang «(quá tải — dự kiến dd/mm, mục tiêu dd/mm)».
  Given kho có vòng đã giao mang dòng `gio-may`, Then giờ chờ dùng trung vị đo của chúng và dòng không mang nhãn ấy. Given mốc không có `ngay` hợp lệ, Then dòng bỏ vế mục tiêu
  và không cờ. Lệnh thoát 0, không ghi tệp nào.
  Chiều đỏ:
  - bản sao bỏ phụ thuộc → ca đỏ «M2 bắt đầu D, cần sau M1»;
  - bản sao tính đủ hàng đang dở → ca đỏ «hàng đang dở tính lại phần đã làm».
- AC-5: Given kho thử của AC-4, When chạy `--hang <mã hàng của M1> --mo-o`, Then `_acceptance/<slug>/du-bao.json`
  BẰNG đối tượng viết sẵn:
  - `ngay_tinh`;
  - `hang: {ma, gio_may, phan_tram}`;
  - `moc: {ten, bat_dau, hoan_tat, gio_may, gio_cho, gio_cho_do, muc_tieu, hang}` — `hang` là danh sách mã của mốc lúc
    đóng băng, `gio_cho` là giờ chờ đã cộng vào dự báo,
    `gio_cho_do` là false khi chưa có vòng đo (dự báo là cận sớm).
  Stdout và ô cơ hội giống từng byte lần chạy của bộ máy gốc.
  Given `du-bao.json` đã có, When chạy lại, Then tệp không đổi byte. Given hàng không gắn mốc nào, Then tệp chỉ có `hang`.
  Chiều đỏ: bản sao ghi đè tệp đã có → ca đỏ «dự báo đóng băng bị ghi đè».
- AC-6: Given thư mục bản ghi phiên giả do ca sinh — một phiên chính và một tác tử con chạm `_acceptance/<slug>/`,
  sự kiện viết sẵn giờ, một lời nhắn lặp mã, một phiên khác không chạm slug — When chạy
  `do-vong.mjs --root . --slug <slug> --write`, Then `run-log.jsonl` thêm đúng một dòng `kind:"gio-may"` có:
  - `gio_may`, `gio_cho` BẰNG số viết sẵn: khoảng ≤ 10 phút tính máy, khoảng dài hơn tính chờ;
  - `token` theo model × loại BẰNG số viết sẵn: lời nhắn lặp đếm một lần, phiên không chạm slug không đếm;
  - `nguon` liệt đúng các bản ghi chạm slug.
  Kho thử có thêm hai tác tử con chạy CHỒNG giờ với phiên chính và một phiên mang sự kiện trước ngày quyết của ô: giờ máy
  là độ dài HỢP các khoảng hoạt động trên dòng thời gian gộp mọi bản ghi (không cộng từng bản ghi), và sự kiện ngoài cửa
  sổ vòng không vào giờ lẫn token.
  Given máy chạy lượt có bản ghi phiên thật của chính vòng này, When chạy `do-vong.mjs` không `--write` trên thư mục bản
  ghi thật, Then `nguon` có ít nhất một bản ghi phiên chính và một bản ghi tác tử con, `gio_may` > 0, token ra > 0, và mọi
  model có lời nhắn trong bản ghi đều có token > 0 (round-trip với bên viết thật). Máy không có bản ghi (CI) → ca bỏ qua
  có tên «không đọc được ở đây: không có bản ghi phiên của vòng», không xanh.
  Given không bản ghi nào chạm slug, Then dòng mang `nguon:"khong-co-ban-ghi"`, `gio_may:null`, `token:null`, lệnh thoát 0.
  Lệnh không `--write` không ghi gì.
  Chiều đỏ:
  - bản sao đếm lời nhắn lặp hai lần → ca đỏ «token ra 2×, cần 1×»;
  - bản sao đếm phiên không chạm slug → ca đỏ «bản ghi lạ vào phép đo»;
  - bản sao cộng giờ từng bản ghi → ca đỏ «giờ máy cộng trùng tác tử song song»;
  - bản sao bỏ cắt cửa sổ → ca đỏ «sự kiện ngoài cửa sổ vào phép đo».
- AC-7: Given tệp đọc hạn mức có hai lần đọc cùng mốc đặt lại (20 % rồi 30 %) và bản ghi giả cả máy trong khoảng ấy có
  token quy đổi viết sẵn, When đo vòng, Then `phan_tram_tuan` của dòng `gio-may` BẰNG số viết sẵn (tỉ lệ × token quy đổi
  của vòng). Dòng ghi kèm `ty_le` và khoảng đọc.
  Given:
  - hai lần đọc khác mốc đặt lại;
  - hay % giảm;
  - hay chỉ một lần đọc;
  Then `phan_tram_tuan:null` kèm `ly_do` đúng ba câu viết sẵn, mỗi ca một câu.
  `--doc-han-muc 23 --dat-lai <ISO>` thêm đúng một dòng vào tệp đọc. Giá trị sai (âm, > 100, ISO hỏng) → thoát 2 nêu cờ.
  Chiều đỏ: bản sao nhận cặp khác mốc đặt lại → ca đỏ «tỉ lệ qua hai tài khoản».
- AC-8: Given kho thử có:
  - mốc M khép (ba hàng đã giao, ngày ký 18–20/10);
  - `du-bao.json` mở sớm nhất trong M có hoàn tất 19/10;
  - một hàng thêm vào M sau ngày đóng băng;
  - mỗi hàng có dòng `gio-may` đo;
  When chạy `lo-trinh.mjs --do-lech`, Then đầu ra BẰNG khối viết sẵn:
  - `M: dự báo 19/10 (đóng băng 15/10) · khép thật 20/10 · lệch 1 ngày · 1 hàng thêm sau đóng băng`;
  - dòng `giờ chờ: ước A (đo được lúc đóng băng: có/không) · đo B`;
  - mỗi hàng một dòng `<mã>: ước X giờ máy · đo Y giờ máy · ~Z % hạn mức tuần`;
  - hàng không có dòng `gio-may`, hay có dòng `nguon:"khong-co-ban-ghi"`, in đúng `<mã>: thiếu số đo`;
  - một dòng `k/N vòng có số đo`.
  Mốc chưa khép không in. Mốc khép mà không `du-bao.json` in «chưa đóng băng dự báo — không đo được lệch». Lệnh không
  ghi tệp nào.
  Chiều đỏ:
  - bản sao lấy dự báo mới nhất thay vì sớm nhất → ca đỏ «dự báo không phải bản đóng băng»;
  - bản sao bỏ hàng thiếu đo → ca đỏ «vòng thiếu số đo bị giấu».
- AC-9: Given cây, When đọc SKILL feature-loop và `road-map/commands/xem.md`, Then:
  - SKILL có khối máy đọc `S4-DO-VONG` mang ba dòng lệnh:
    - đọc hạn mức lúc mở;
    - đọc hạn mức khi lượt chấm trả về;
    - `do-vong.mjs --write`;
  - dòng lệnh rút từ khối (không chép tay) chạy trên kho thử của AC-6 ra đúng dòng `gio-may`;
  - `xem.md` nêu khối giờ máy và cờ quá tải;
  - GUIDE (mục khuôn tệp lộ trình) nêu khoá `gio_may` cùng đường đọc-cũ.
  Chiều đỏ: bản sao khối thiếu `--write` → ca đỏ «khối S4-DO-VONG không ghi dòng gio-may».

## Coverage

Quét không gian AC theo bốn trục (skill morphological-scan, preset entity-feature tự dựng lại trục). Chân ngành:
`[NGÀNH: FogBugz Evidence-Based Scheduling]` — dự báo ngày giao từ lịch sử ước-so-thật của từng người. Đối chiếu thêm
Jira (ước gốc so thời gian đã tiêu).

- **Trục nguồn số của hàng:** khai tay đúng · khai tay sai kiểu · luật (chưa đủ 5 vòng) · đo (≥ 5 vòng) · không hạng —
  AC-1, AC-2. [thước CE: luật ước 15/10 + EBS dùng lịch sử thật thay ước tay]
- **Trục bề mặt:**
  - trang tất định — AC-1–AC-3;
  - lệnh xem theo hôm nay — AC-4;
  - mở ô đóng băng — AC-5;
  - sổ chạy hồ sơ — AC-6, AC-7;
  - lệnh đo lệch — AC-8;
  - bước của vòng — AC-9.
  [thước CE: mọi chỗ người nhìn lộ trình hoặc máy ghi số trong vòng `lo-trinh.mjs` + SKILL S0/S4]
- **Trục trạng thái hàng:** chưa mở · đang dở (trừ phần đã đo) · đã giao (vào phép ước, ra khỏi tổng mốc) —
  AC-2, AC-3, AC-4. [thước CE: ba nhóm tiến độ của `demTienDo`]
- **Trục dữ liệu đo:**
  - đủ;
  - không bản ghi (mù);
  - thiếu lần đọc hạn mức;
  - đổi tài khoản giữa hai lần đọc;
  - bản ghi lạ / lời nhắn lặp;
  AC-6, AC-7. [CE chưa kiểm chứng — cấu trúc bản ghi phiên là của Claude Code, không có đặc tả công bố; ca dựng theo
  hình bản ghi đọc được trên máy 15/10]
- **Cắt (Later → hạt giống):** khối dữ liệu máy đọc mang giờ máy · đo bù vòng cũ · ×1,3 khác máy và hàng chờ khoá máy ·
  nhiều làn song song. **Never:** ước theo ngày người · hiện token thô cho người (chủ kho 15/10: đơn vị là % hạn mức tuần).

## Đường đo

- Ngưỡng «lệch ≤ 1 ngày ở mốc phát hành đầu tiên bắt đầu sau khi RM6 lên `main`»: số từ `lo-trinh.mjs --do-lech` (AC-8),
  đọc dự báo đóng băng do `--mo-o` ghi (AC-5).
- Ngưỡng «mỗi vòng khép có giờ máy + token thật cạnh số ước»: dòng `gio-may` (AC-6, AC-7), ghi bằng khối `S4-DO-VONG`
  (AC-9), in cạnh số ước bởi `--do-lech` (AC-8).

## Out of scope

- Khối dữ liệu máy đọc `lo-trinh-du-lieu` mang giờ máy (đổi khuôn sang bản 3 — vòng riêng có neo; hạt giống
  `docs/plans/2026-10-15-hat-giong-khoi-du-lieu-gio-may.md`).
- Đo bù vòng cũ từ bản ghi phiên (ghi vào hồ sơ đã ký).
- Hệ số ×1,3 khi chạm vùng máy khác, hàng chờ khoá máy và lô gộp trong «bắt đầu dự kiến» — người khai `gio_may` tay.
- Nhiều làn song song trên một mốc.
- Thẻ khởi động (bộ quét) không đổi: răng so byte AC-9 của RM2 giữ nguyên.

## Notes

- Đo trước ước sau: token chỉ ước khi ≥ 5 vòng có % đo; năm vòng đầu sau gộp hiện «chưa ước (k/5 vòng đo)».
