---
schema_version: 1
feature: Bộ kiểm và phần sản phẩm còn bám bố cục phẳng chạy xanh ở cả bố cục hôm nay lẫn plugins/<tên>/ với tên plugin mới
slug: phan-du-bo-cuc-moi
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm scripts/recheck-evidence.cjs và lib/chan-lo-trinh.cjs (t3_paths)
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-11-15-phan-du-bo-cuc-moi-design.md
status: signed-off
approved_by: Phan Le Manh
approved_at: 2026-11-15T02:23:54Z
---

# Acceptance Contract: phan-du-bo-cuc-moi

## Context

Gốc: kit/_acceptance/goi-cheo-loi-dieu-phoi/ — vòng liền trước để lại «không đổi đường dẫn trong `tests/` cho bố cục
mới» ở Out of scope; B2 (kho `delivery-loop`) đo phần còn thiếu. Cổng Đáng ký 15/11: build, K3 lối (a), neo và ngưỡng như
ô (`opportunity.md`).

Thuật ngữ:
- **bố cục cũ** = cây kho này như hôm nay. **kho mới** = kho thước giữ khoá dựng từ cây đang kiểm: `dungKhoMoi` của
  `_acceptance/goi-cheo-loi-dieu-phoi/rang/luat-doi-chu.mjs` + phần ở lại gốc + luật đổi tên trên `tests/`, không luật
  đường bước 6, không bảng vá (design §7).
- **bộ dịch** = `tests/bo-cuc.mjs` + bảng bố cục phẳng `tests/fixtures/bo-cuc-phang.json` (design §2).
- **khoá đích** = các dòng của `_acceptance/phan-du-bo-cuc-moi/khoa-dich.tsv`, cột `cum` chỉ cụm. **túi khoá** của một
  tệp kiểm = tập tên ca nó in khi chạy. **bản gốc** = `git archive` trọn cây của merge-base với nhánh chính.
- **thước giữ khoá** = `_acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs` (`--cu`, `--moi`, `--chieu-do`).

## Criteria

- AC-1: Given cây đang kiểm ở bố cục cũ, When chạy mọi khoá `feature_loop.suite_keys` và thước giữ khoá `--cu` trên mọi
  tệp kiểm vòng chạm (mọi tệp đổi dưới `tests/`, gồm `tests/dieu-phoi/`), Then mọi suite thoát 0 (kể cả `LT-94`, `LT-94-do`, nay không đỏ theo lịch) và túi khoá của mỗi tệp ở
  HEAD chứa trọn túi khoá ở bản gốc — không ca nào mất tên hay rời túi.
- AC-2: Given một cây phẳng (bung HEAD) và một kho mới, cả hai do mã sinh trong lần chạy, When bộ dịch giải ma trận đường
  phẳng viết trước (mỗi thư mục lõi, mỗi gói, `tests/`, `_acceptance/`) cộng chính các đường ấy ở dạng `plugins/…` mà
  luật bước 6 sinh ra, ở từng cây — cây phẳng, kho mới, một commit lịch sử trước #503, một bản sao gốc gói — Then mỗi ô ra
  đúng đường có thật ở cây ấy (số assert bằng số ô; ô `plugins/…` × cây phẳng ra đường phẳng), dịch hai lần bằng dịch một
  lần, và cây thiếu `.claude-plugin/marketplace.json` cho lỗi `bo-cuc: <cây> không có .claude-plugin/marketplace.json`
  trong khi cây đủ thì xanh.
- AC-3: Given kho mới, When chạy các tệp kiểm của cụm K2 (bộ plugins: P188, P193, DP11, LB1, LM1, «ca lệnh bấm được», «ca
  nạc phản ứng»; `moi-cong-khong-qua-nut`; JI12), Then mọi khoá đích cụm K2 có mặt và xanh; khối khai chỗ trong
  `human-facing-language.md` và `design-pass/SKILL.md` giữ dạng phẳng từng byte.
- AC-4: Given ma trận viết trước {bố cục cũ, kho mới} × {tệp khai chợ có, thiếu cạnh bản cài gói}, When chạy luật chặn lộ
  trình (`lib/chan-lo-trinh.cjs`) và khởi tạo lộ trình (`scripts/lo-trinh-khoi-tao.mjs`) ở từng ô, Then CK-4-lib và
  KM-1-do3 xanh: khoá bật đọc được từ bảng tên ở mọi ô, tên gói khai ra ghép từ bảng tên của cây ấy (cũ
  `road-map@acceptance-gate-kit`, mới `roadmap@delivery-loop`), mã nguồn hết chữ viết cứng ấy; ô bố cục cũ có tệp khai
  bằng bản gốc từng byte, ô bố cục cũ thiếu tệp khai khác bản gốc đúng chữ tên gói (bản gốc in tên mới — đối chứng rằng
  nhánh dự phòng thật sự chạy).
- AC-5: Given các hồ sơ đã ký giữ nguyên từng byte, When chạy ở kho mới các ca đọc hợp đồng, khối khai và mã đo của hồ sơ
  đã ký (P169, LM5, LM8b, ba ca «lan may qua bo phan loai», RT13, RT18, CVS1–CVS4, TH-10-ong, TH-10-do, ca `stop-patching-law`), Then mọi khoá
  đích của chúng có mặt và xanh, và `git diff --stat <bản gốc> HEAD -- '_acceptance/*/'` không chạm hồ sơ nào trừ
  `_acceptance/phan-du-bo-cuc-moi/`.
- AC-6: Given một kho có `marketplace.json` đặt gói lõi ở thư mục con và báo cáo đã ký trỏ `verifier:` theo đường phẳng
  (`scripts/product-map.mjs`), When chạy `scripts/recheck-evidence.cjs`, Then bộ giải tìm verifier trong gốc gói lõi và
  JR11b, DV4a, L05, `lan-status-not-run` xanh ở kho mới; gỡ ứng viên gốc gói lõi trên bản sao → «verifier script not found»
  với đúng đường ấy; kho không có `marketplace.json` → hành vi cũ từng byte.
- AC-7: Given kho mới, When chạy các tệp kiểm cụm K4-SC, Then mọi khoá đích cụm K4-SC có mặt và xanh; ở cả hai bố cục, mỗi
  pathspec đã dịch mà ca dùng cho `git diff`/`git archive` một commit lịch sử có thật ở commit ấy (chốt chống rỗng), nên bốn
  chỗ xanh giả loại (ii) (`ho-so-da-ky-giu-tuoi`, JR11a, CC-02, KK-4) đỏ khi pathspec rỗng.
- AC-8: Given kho mới, When chạy bộ plugins và bộ điều phối, Then mọi khoá đích cụm K4-PL có mặt và xanh (P161, P91, P93,
  TC1-06, TC1-08, TC1-09, TC2-09, DP2-01, DP6-03, DP7-06, DV5), mỗi heredoc Python/bash giải đường qua dạng CLI của bộ
  dịch.
- AC-11: Given kho mới, When chạy thước giữ khoá `--moi` rồi `--chieu-do`, Then `--moi` in một dòng mỗi cụm vòng nhận với
  «thiếu 0» và túi khoá mỗi tệp ⊇ túi khoá bố cục cũ; `--chieu-do` (bộ dịch thay bằng bản đồng nhất) làm mỗi cụm có ít nhất
  một ca canh đỏ với thông điệp ghim; và `_acceptance/phan-du-bo-cuc-moi/gui-b2.md` liệt kê mọi mục `va-bo-kiem.json`
  mà diff của vòng làm thừa, rút bằng máy.
- AC-12: Given bản sao một kho tiêu thụ đã chép `lib/chan-lo-trinh.cjs` mà thiếu
  `lib/ho-goi.cjs`, When nạp luật chặn rồi gọi tới chỗ cần bảng tên, Then nạp thoát êm và chỗ cần bảng tên in lỗi
  `chan-lo-trinh: thiếu lib/ho-goi.cjs cạnh luật chặn`; kho đủ tệp thì khoá bật giải được (đối chứng dương).

## Coverage

Quét ba trục (skill morphological-scan, preset test-matrix, làm tại chỗ):

- Trục cây mà một chuỗi đường nói tới: cây đang đứng · commit lịch sử · bản sao gốc gói · hồ sơ đã ký · kho tiêu thụ giả
  [thước CE: bốn khảo sát chỉ-đọc 15/11 trên `644e9b49` — năm hình dạng ở design §1; SUY-TỪ-REPO: `tests/`].
- Trục bố cục: cũ · mới [thước CE: `luat-doi-chu.mjs` của hồ sơ gọi chéo, chép từ `bang-xep.json` của kịch bản].
- Trục cụm khoá: K2 · K3 · SP · K4-SC · K4-PL · K4-LT · K4-TB [thước CE: `khoa-dich.tsv`, đếm 415 = 27 + 20 + 4 + 77 + 13 +
  174 + 98 + 2 của B2].

Ô có nghĩa → tiêu chí: mọi cụm × cũ → AC-1 · bộ dịch × mọi cây → AC-2 · K2 × mới → AC-3 · SP × mới → AC-4 · K3 (hồ sơ đã
ký) × mới → AC-5, AC-6 · K4-SC → AC-7 · K4-PL → AC-8 · chiều đỏ và
ghép nối B2 → AC-11 · nạp lười bảng tên ở kho tiêu thụ chép thiếu (Hỏi-2) → AC-12.

Later: K4-LT (174 khoá, 16 tệp) và K4-TB (98 khoá, 9 tệp) — vòng kế trên bộ dịch đã gộp (Hỏi-1, Out of scope).

Never: cụm B2 (KM-1, CT-10-do) — vá cơ học cần luật đảo mới, việc của kịch bản. Later: lệnh eval của hồ sơ đã ký chạy lại ở
kho mới (ô cơ hội, Out of scope).

## Đường đo

- SỐNG — lượt giữ khoá của B2 trên cây dựng lại từ nhánh chính sau gộp thiếu 0 ở các cụm vòng nhận: số từ đo chéo cuối vòng
  trên bản kéo tạm của `delivery-loop` (ngoài làn máy, ghi ở Notes) và lượt đo của B2 · AC bảo đảm: AC-3…AC-8, AC-11.
- CHẾT — ở bố cục cũ một ca xanh hoá đỏ, rời túi khoá, hay chiều đỏ thôi đỏ: số từ thước giữ khoá `--cu` và suite · AC bảo
  đảm: AC-1.
- Timebox — gộp trước lượt đo lại của B2 cho Cổng Bằng chứng của nó, chậm nhất 04/12/2026: số từ giờ gộp (`dem`
  `ky_den_gop`) · AC bảo đảm: không AC — ràng buộc lịch.

## Out of scope

- Không sửa gì ở `~/dev/delivery-loop` (kịch bản, bảng vá, thước giữ khoá của B2) — vòng chỉ ghi `gui-b2.md`.
- Không đổi byte nào của hồ sơ đã ký; không làm cho lệnh eval của hồ sơ đã ký chạy lại được ở kho mới.
- Không cắt số, không gắn thẻ; không chép lại lớp CI ở kho tiêu thụ — đi theo mốc 3.0.
- Không đổi `.claude/settings.json` (LM1 sửa ở bên đọc; tệp đổi ở kho mới do kịch bản).
- Cụm K4-LT (lộ trình, tín hiệu: 174 khoá, 16 tệp) và K4-TB (thẻ, bản đồ, khuôn: 98 khoá, 9 tệp) — dời sang vòng kế dùng
  cùng bộ dịch (Hỏi-1, chủ kho duyệt theo khuyến nghị 15/11). Ngoại lệ: `tests/scripts/lo-trinh.test.mjs` chỉ đổi ngày mẫu
  của LT-94.
- Cụm B2 (KM-1, CT-10-do) và PM17/PM18 (xanh giả có từ trước, không thuộc bố cục).

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Mã tiêu chí giữ nguyên số sau khi dời AC-9, AC-10 sang vòng kế (eval E9, E10 dời theo), để sổ và thẻ không phải đánh số lại.
- Cổng Phạm vi 15/11: chủ kho gõ «duyệt» trần; máy đọc là duyệt kèm khuyến nghị của Hỏi-1 (cắt K4-LT, K4-TB) và Hỏi-2
  (gom giới hạn nạp cứng bảng tên) — sổ d-…-gate1.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-16:
  - Ngoài-1: thước giữ khoá miễn trừ các khoá có chữ số đếm nội dung cây bằng một danh sách gõ tay, nên một khoá khác cùng hình dạng có thể làm lượt chấm đỏ oan «mất khoá».
  - Ngoài-3: ca tự kiểm của khoá đếm chép tay chuỗi khoá thay vì rút từ nơi viết, nên nơi viết đổi chữ thì tự kiểm vẫn xanh còn lượt chạy thật đỏ oan.
  - Ngoài-4: bước kiểm lại bằng chứng tìm gói lõi bằng tên cứng rồi lùi về so chuỗi con, nên kho có thư mục tên gần giống có thể bị nhận nhầm.
  - Ngoài-6: thước giữ khoá nhận cờ mốc so sánh không kèm giá trị thì lặng lẽ dùng mốc mặc định thay vì báo lỗi.
  - Ngoài-7: phép so ở bố cục cũ cho xanh 0/0 khi phía bản gốc không in ca nào, nên một lượt bản gốc hỏng im có thể trông như không mất ca.
  - Ngoài-8: danh sách mục vá thừa gửi sang kho bên kia không so với bản gốc, nên có thể lẫn mục vốn đã thừa từ trước vòng.
  - Ngoài-9: ứng viên gốc gói lõi viết cứng tên plugin và so chuỗi con trên dữ liệu ngoài; cùng lỗ với Ngoài-4, nhìn từ phía khác.
  - Ngoài-10: ở kho tự là một plugin mà thiếu tệp chợ, luật chặn lộ trình có thể nhận nhầm kho thành bản cài gói lõi và tắt lặng.
  - Ngoài-12: cùng giả định ở luật chặn lộ trình như Ngoài-10, nhìn từ phía bản chép CI thiếu bảng tên.
  - Ngoài-13: cách rút danh sách mục vá thừa chưa chứng minh được chỉ mục do vòng này làm thừa mới được liệt kê; cùng gốc với Ngoài-8.
  - Ngoài-14: phép so «túi HEAD chứa túi bản gốc» không có đối chứng dương cho phía tham chiếu; cùng gốc với Ngoài-7.
- Chấp nhận, không sửa (chủ kho quyết ở Cổng Bằng chứng 16/11): Ngoài-2 (chú thích và ca tự kiểm ghi ngược cặp số 232/233;
  phép so ở dạng «<n>» không phụ thuộc giá trị) · Ngoài-5 (đầu tệp bản nhân fixture trích sai một dòng sổ cũ).
- Mở hợp đồng mới (chủ kho quyết ở Cổng Bằng chứng 16/11) — ghi hạt giống, không tạo ô (luật «Ô chỉ mở khi có NEO NGOÀI»):
  - Ngoài-11 → `docs/plans/2026-11-15-hat-giong-ung-vien-verifier-hook-ci.md` (hook lúc ghi và bước kiểm lại ở CI giải
    công cụ kiểm theo hai cách).
