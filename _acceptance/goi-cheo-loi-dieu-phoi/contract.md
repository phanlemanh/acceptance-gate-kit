---
schema_version: 1
feature: Lõi và feature-loop thôi bám bố cục và tên plugin cũ — chạy đúng ở cả bố cục hôm nay lẫn plugins/<tên>/ với tên mới
slug: goi-cheo-loi-dieu-phoi
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm lib/chan-lo-trinh.cjs (lib/**)
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-11-14-goi-cheo-loi-dieu-phoi-design.md
status: signed-off
approved_by: Phan Le Manh
approved_at: 2026-11-14T12:09:32Z
---

# Acceptance Contract: goi-cheo-loi-dieu-phoi

## Context

Gốc: ~/dev/delivery-loop/_acceptance/kich-ban-chuyen-nha/ (vòng B1 của kho kế nhiệm — sổ kiểm kê trên cây dựng lại báo
các đường treo; hạt giống `~/dev/delivery-loop/migration/hat-giong-goi-cheo-loi-dieu-phoi.md`). Cổng Đáng ký 14/11:
build, đường C, neo và ngưỡng như ô (`opportunity.md`).

Thuật ngữ:
- **bố cục cũ** = cây của kho này như hôm nay (lõi là gốc kho, tên plugin cũ).
- **bộ dựng** = `_acceptance/goi-cheo-loi-dieu-phoi/rang/bo-cuc-moi.mjs`: từ một cây nguồn dựng bằng mã một kho theo bảng
  xếp của kịch bản chuyển nhà (`plugins/acceptance-gate/`, `plugins/feature-loop/`, `plugins/dispatch/`,
  `plugins/roadmap/`, `plugins/knowledge/`, `plugins/diagram-design/`, `marketplace.json` ở gốc) và áp luật đổi chữ của
  kịch bản lên mọi tệp dưới `plugins/`.
- **kho mới** = kho bộ dựng sinh từ cây đang kiểm. **bản cài lõi mới** = riêng thư mục `plugins/acceptance-gate/` của kho
  mới, chép sang một thư mục khác (đúng thứ bản cài một plugin mang).
- **bản gốc** = cây tại `593e6837` (nhánh chính trước vòng).
- **bảng tên** = `lib/ho-goi.cjs`. **hộp thư** = `scripts/hop-thu/` của lõi.

## Criteria

- AC-1: Given bộ kho tiêu thụ do mã sinh ở bố cục cũ, mỗi kho đã chép lớp CI của đúng bản đang chạy (có và không khai
  `tin_hieu`, có và không bật gói lộ trình, có và không `lo_trinh.chan`, và một bản cài từ chợ fork — `marketplace.json`
  cạnh gói mang tên chợ khác), cộng kho kit ở bố cục cũ có mốc và một hồ sơ mở, When chạy `plugin-declare` (`--list`, khai
  thử), khởi tạo lộ trình, luật chặn lộ trình, `tin-hieu --rang`, `gui-tin-hieu`, `start-scan` từ bản gốc và từ cây đang
  kiểm, Then stdout, stderr và mã thoát bằng nhau từng byte (sau khi thay đường gốc cây) — không bảng khác biệt nào; và
  phá `scripts/hop-thu/cua-tin-hieu.mjs` trên bản sao cây làm ca cửa tín hiệu có sẵn tương ứng đỏ.
- AC-2: Given bản cài lõi mới và một kho tiêu thụ khai cửa tín hiệu, When nạp `scripts/tin-hieu.mjs` và chạy
  `gui-tin-hieu.mjs --root <kho> --noi-dung "<câu>"`, Then cả hai nạp được không lỗi `ERR_MODULE_NOT_FOUND`, câu được ghi
  vào cửa với dòng «đã ghi» của bộ ghi, và `tin-hieu --rang` thoát 0 trên kho ấy.
- AC-3: Given khối `INIT-CI-COPY-LIST` của `commands/acceptance-init.md` ở bản cài lõi mới, When giải từng mục
  `${CLAUDE_PLUGIN_ROOT}/<đường>` vào bản cài ấy rồi chép theo cột đích vào một kho tiêu thụ do mã sinh, Then mọi mục
  giải ra một tệp có thật, và ở kho tiêu thụ `scripts/tin-hieu.mjs` nạp được, `lib/chan-lo-trinh.cjs` chạy được.
- AC-4: Given bản cài lõi mới (không `marketplace.json` cạnh gói), When chạy `plugin-declare.mjs --list` và khai thử trên một kho, Then nó in
  `acceptance-gate@delivery-loop`, `feature-loop@delivery-loop`, `diagram-design@delivery-loop`,
  `superpowers@claude-plugins-official` theo đúng thứ tự, thoát 0, và nguồn chợ khai là `phanlemanh/delivery-loop`.
- AC-5: Given bản cài lõi mới và một kho tiêu thụ bật `roadmap@delivery-loop` ở `.claude/settings.json`, When chạy khởi
  tạo lộ trình (khai thử) và luật chặn lộ trình với `lo_trinh.chan: true` cùng một hồ sơ mới không thuộc hàng nào, Then
  khởi tạo nhận kho là đã bật (không in dòng «chưa cài», không thoát 2) và luật chặn in `VIOLATION` gọi tên hồ sơ, thoát 1.
- AC-6: Given kho mới là một kho git có commit cắt số ở `plugins/acceptance-gate/.claude-plugin/plugin.json` và một hồ sơ
  mở sinh sau mốc, When chạy `start-scan` ở gốc kho mới, Then phần đếm vòng meta nhận đây là kho kit (`applies` đúng) và
  đếm đúng hồ sơ ấy.
- AC-7: Given cây của một ref ở kho mới (chợ có `dispatch`, không còn `dieu-phoi`), When `kiem-ban-cai` chọn gói cho ba
  mục chạm bản cài (thẻ cổng, lưới trước gộp, điều phối), Then nó chọn `acceptance-gate`, `feature-loop`, `dispatch` theo
  tệp gói mang, và ở bố cục cũ chọn đúng ba tên cũ.
- AC-8: Given kho mới, không `--ag-root`, và một thư mục bộ đệm plugin rỗng, When chạy `giu-tuoi`, `thuoc-vat` và nạp
  bộ đọc của `carry-plan` từ `plugins/feature-loop/scripts/`, Then cả ba dùng lõi `plugins/acceptance-gate/` của chính kho
  (không lỗi «không resolve được»/«không nạp được»), và ở bố cục cũ vẫn dùng gốc kho.
- AC-9: Given cây đang kiểm, When chạy răng một nguồn, Then bảng tên khớp `.claude-plugin/marketplace.json` (cùng tên,
  cùng thứ tự, cùng tập bật-theo-lựa-chọn, cùng tên chợ) và bốn tệp của hộp thư bằng từng byte bản ở `dieu-phoi/scripts/`;
  trên bản sao, thêm một plugin vào chợ, đổi dấu bật-theo-lựa-chọn, đổi tên chợ, hay sửa một byte của một tệp hộp thư thì
  răng đỏ gọi tên đúng chỗ lệch.
- AC-10: Given bộ dựng chạy trên bản gốc (`593e6837`), When chạy lại đúng các ca của AC-2…AC-8, Then MỖI ca đỏ với thông
  điệp ghim của nó (ví dụ `ERR_MODULE_NOT_FOUND` có tên `hinh-dang.mjs`, «không đọc được marketplace.json», luật chặn
  không in `VIOLATION`), và chế độ chiều đỏ chỉ chạy khi lần lành trên cây đang kiểm đã xanh.
- AC-11: Given ca RT13 của `tests/plugins/ra-co-ten.test.mjs` (phép so bộ phân loại cũ tại `cb38ea01` ↔ mới trên mọi hồ
  sơ của cây thật), When chạy trên cây đang kiểm và trên bản sao cây có thêm một hồ sơ do mã sinh SAU mốc mà hai bộ phân
  loại xếp khác lớp, Then RT13 xanh ở cả hai mà không cần dòng `KHAC-BIET-DOC-CU` cho hồ sơ ấy; và trên bản sao, một hồ
  sơ CÓ ở mốc đổi lớp mà không khai thì RT13 đỏ «lệch … mà khối không khai», còn xoá một dòng khai của hồ sơ có ở mốc thì
  chiều đỏ (ii) vẫn đỏ.

## Coverage

Quét ba trục (skill morphological-scan, preset test-matrix, làm tại chỗ):

- Trục đường: tín hiệu · danh sách chép CI · khai plugin · lộ trình (khởi tạo, chặn) · dò kho kit · kiểm bản cài ·
  feature-loop tự host [thước CE: quét mã 14/11 trên `593e6837` theo bốn mẫu — `../dieu-phoi/`, `.claude-plugin`,
  `HERE/../..`, tên plugin trong ngoặc; SUY-TỪ-REPO: `scripts/`, `lib/`, `commands/`, `feature-loop/scripts/`].
- Trục bố cục: cũ · mới [thước CE: `migration/kich-ban/bang-xep.json` + `luatDoiChu` của kịch bản, chỉ đọc].
- Trục ngữ cảnh chạy: bản cài (chỉ thư mục plugin) · tự host (bản kéo kit) · bản chép CI ở kho tiêu thụ [thước CE: đo bộ
  đệm cài thật 14/11; SUY-TỪ-REPO: `commands/acceptance-init.md` INIT-CI-COPY-LIST].

Ô có nghĩa → tiêu chí: mọi đường × bố cục cũ → AC-1 (vi phân) · tín hiệu × mới × bản cài → AC-2 · chép CI × mới × kho
tiêu thụ → AC-3 · khai plugin × mới × bản cài → AC-4 · lộ trình × mới × bản cài → AC-5 · dò kho kit × mới × tự host → AC-6
· kiểm bản cài × mới × tự host → AC-7 · feature-loop × mới × tự host → AC-8 · một nguồn tên/hộp thư → AC-9 · chiều đỏ mọi
ô mới → AC-10 · phép so đọc-cũ của RT13 × hồ sơ sinh sau mốc (chỉ gãy ở kho mới, cùng lớp MC-11) → AC-11 (Hỏi-1: gộp hay
tách).

Later: tín hiệu / khai plugin × mới × tự host — cùng đường mã với bản cài, bản cài là ca khó hơn. Never: dò kho kit, kiểm
bản cài, feature-loop × bản chép CI — ba vật không nằm trong danh sách chép.

## Đường đo

- SỐNG — lệnh đếm của hạt giống trả 0 trên cây dựng lại: số từ đo chéo cuối vòng trên bản kéo tạm của `delivery-loop` (E16, ngoài làn máy) và lượt dựng lại cây của B3 · AC bảo đảm: AC-2…AC-8 (cùng đường trên bộ dựng).
- SỐNG — `kiem-ban-cai` ở 3.0 ĐẠT mục điều phối; `acceptance-init` khai `roadmap@delivery-loop`: số từ lượt kiểm bản cài của mốc 3.0 · AC bảo đảm: AC-7, AC-4, AC-5.
- CHẾT — kho ở bố cục cũ đổi đầu ra: số từ vi phân bản gốc ↔ cây đang kiểm (E1) · AC bảo đảm: AC-1.

## Out of scope

- Không sửa gì ở `~/dev/delivery-loop` (kịch bản, bộ kiểm cây mới — việc của B2).
- Không đổi đường dẫn trong `tests/` cho bố cục mới; chỉ đổi ba tệp ca cửa tín hiệu cho đúng vật mới (design §6).
- Không cắt số, không gắn thẻ, không chép lại lớp CI ở kho tiêu thụ — chiến dịch của mốc 3.0.
- Không đổi điều phối (`dieu-phoi/`): bốn tệp gốc giữ nguyên từng byte.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Lệch có kiểm soát khỏi luật «một cây nguồn» (CLAUDE.md): hộp thư là bản chép có răng từng byte — chủ kho nhận khi chọn
  đường C ở Cổng Đáng.
- Đo chéo E16 (giả định 4, chạy tay 14/11 trên bản kéo TẠM của delivery-loop `5192aff2` ở scratchpad; Repo Standards
  `repo-setup-v0.5.0` = `4dc53e0`). Cây dựng bằng `migration/kich-ban/don-nha.mjs`, đếm bằng đúng lệnh của
  `migration/hat-giong-goi-cheo-loi-dieu-phoi.md` §3 (`kiemKe … treo` dưới `plugins/`, trừ `vendor`):
  nhánh vòng `d287e067` → cây `e649b331` → **0**; chiều đỏ, gốc `593e6837` → cây `6f36f791` → **5** (ba dòng
  `dieu-phoi/scripts/` của `commands/acceptance-init.md`, hai import của `scripts/tin-hieu.mjs`). `main` cục bộ cũ
  `c8fa5a65` không dựng được (khuôn chạm `.nvmrc` ngoài danh sách) — không phải gốc của vòng.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-15:
  - Ngoài-1: Một lần sửa sau này chỉ chạm thư viện dựng bố cục có thể được coi là đã kiểm vì kết quả xanh cũ được mang sang, dù các phép kiểm chưa chạy lại.
  - Ngoài-2: Nếu một kho chỉ chép bản mới của một tệp mà quên tệp đi kèm, mọi PR của kho đó bị chặn nhầm kể cả khi họ không bật luật chặn lộ trình.
  - Ngoài-3: Nếu sau này thêm một tệp vào hộp thư, một số phép kiểm có thể vẫn xanh dù chỉ kiểm một trong hai bản, nên lỗi có thể lọt qua.
  - Ngoài-4: Phép kiểm chứng tỏ bộ so sánh biết bắt lỗi có thể xanh vì một lý do khác lỗi định bắt, nên độ tin cậy của nó thấp hơn vẻ ngoài.
  - Ngoài-5: Khi có sửa đổi chưa commit ở tệp cửa tín hiệu, một phép kiểm có thể phán trên bản cũ đã commit thay vì bản đang kiểm.
  - Ngoài-6: Nếu thêm tệp mới vào hộp thư mà quên cập nhật danh sách, phép kiểm bản sao đồng nhất vẫn xanh mà không so tệp ấy.
  - Ngoài-7: Khi chạy kiểm trên một bản cũ cụ thể, phần kiểm bố cục cũ vẫn đọc bản đang làm việc, nên thông điệp xanh có thể mô tả sai bản.
  - Ngoài-8: Khi người dùng nhờ kiểm một phiên bản khác bằng cờ chọn phiên bản, phần kiểm cách bố trí cũ vẫn đọc bản đang đứng, nên kết quả có thể xanh hoặc đỏ nhầm.
  - Ngoài-9: Kiểm một phiên bản chỉ định bằng cờ chọn phiên bản có thể cho kết quả cách bố trí cũ theo bản đang đứng thay vì bản được chọn.
  - Ngoài-10: Khi kiểm một phiên bản chỉ định, phần bố cục cũ có thể phản ánh bản đang đứng cùng thay đổi chưa lưu, nên có thể báo xanh hoặc đỏ sai cho phiên bản đó.
  - Ngoài-11: Tên và địa chỉ chợ plugin còn được khai ở hai nơi trong kit; nếu sau này sửa một nơi mà quên nơi kia thì không có gì báo, và người dùng có thể nhận địa chỉ chợ sai.
  - Ngoài-13: Nếu có sửa đổi chưa lưu vào lịch sử khi chạy kiểm, hai phép kiểm sẽ đo bản đã lưu chứ không phải bản đang sửa, nên có thể báo xanh cho thứ chưa được kiểm.
