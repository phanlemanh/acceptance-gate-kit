---
schema_version: 1
feature: Kit chấm vật theo bản đồ khuôn của kho bằng một bộ đọc dùng chung mà luật lint của kho cũng gọi được — màn ngoài khuôn bị trả lại, gọi đúng tệp và khối; kho không khai bản đồ thì không đổi gì
slug: khuon-loi
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: signed-off
approved_by: Phan Le Manh
approved_at: 2026-11-01T20:50:21Z
design_doc: _acceptance/khuon-loi/design.md
---

# Acceptance Contract: khuon-loi

## Context

Hàng KH1 của lộ trình kit (KH4 gộp vào), mốc 2.37.0. Gốc: `crm/_acceptance/khung-chung-ngan-ban-ghi/` (BK1 đã ký) —
hai kho thử mỗi kho tự dựng bộ đọc, răng và số đo bản đồ khuôn; kit chưa có. Chủ kho gọi tên vòng meta 01/11 và giao
Mac Studio. Thiết kế: design doc ở frontmatter.

Thuật ngữ:
- **kho mẫu** = kho git tạm do ca đo dựng trong lượt, có `design/patterns/` mang ba nhóm hình dạng rút từ hai kho thử
  (một nhóm màn YAML khối, một nhóm màn YAML một dòng, một nhóm phần tử), tên khối và tên tệp giả.
- **bước chấm** = `node scripts/design-floor-khuon.mjs --kiem --root <kho>`.
- **lệch** = cặp `(tệp, khối)` mà bước chấm in, kèm nhóm.

## Criteria

- AC-1: Given tệp bản đồ ở hai dạng thật (mapping khối thụt lề; một dòng `{…}` `[…]`), When bộ đọc
  `scripts/ban-do-khuon.cjs` đọc, Then cả hai ra cùng bản chuẩn hoá tám khoá lõi cộng khoá mở rộng có tên; khoá lạ →
  cờ vàng nêu tên khoá; thân thiếu «Dùng khi» hay «Không dùng», hoặc thiếu `nhan_viec` → cờ vàng; thiếu khoá lõi,
  `ngoai_le` thiếu `ly_do`, `cam_ho` ngoài `cam_ngoai_khuon` → sai lược đồ gọi đúng tệp và khoá; `nhan_dien` dạng sổ đăng
  ký không có `tep` → nhóm mang nhãn «không đọc được ở đây»; `lech-lot.md` và `README.md` trong `design/patterns/` không
  phải nhóm (không sai, không đếm vào số nhóm). `--tao <nhóm>` sinh tệp từ khuôn marker
  `BAN-DO-KHUON-TEMPLATE` và tệp ấy đọc ra 0 sai. Chiều đỏ: bản sao bộ đọc bỏ kiểm `ly_do` → hàm kiểm nêu «ngoại lệ
  thiếu lý do mà không sai».
- AC-2: Given kho mẫu `"type":"module"`, When một luật lint giả của kho nạp bộ đọc qua `createRequire` và CLI
  `--root <kho> --json` chạy, Then cả hai trả cùng tập khối cấm, cùng ngoại lệ và cùng nhóm-của-tệp mà bước chấm dùng
  trên cùng kho (so bằng nhau). Chiều đỏ: bản sao CLI bỏ `cam_ho` khỏi đầu ra → hàm kiểm nêu «lint và bước chấm lệch».
- AC-3: Given kho mẫu và một nhánh tiêm vào tệp vùng nhóm màn một khối cấm (nhập tên gốc · đổi tên bằng `as` · nhập
  mặc định · `ns.Khoi` sau `import * as` · một tên thuộc họ cấm), một màn không dựng khuôn, và một thẻ phần tử thiếu khe,
  When bước chấm chạy, Then thoát 1 và mỗi ca in đúng một dòng lệch nêu tệp, khối (hay «khuôn», hay khe thiếu), nhóm, và
  thành phần thay khi bản đồ khai `thay_cho`; đối chứng dương cùng kho chưa tiêm → thoát 0, 0 dòng lệch. Ma trận viết
  sẵn, in «số hàng: N».
- AC-4: Given một tệp khớp `nhan_dien` của hai nhóm màn, When bước chấm chạy, Then thoát 1 và dòng nêu tên cả hai nhóm;
  tệp khớp một nhóm màn và một nhóm phần tử → không đỏ; tệp giao diện (khớp `design.surface_globs`) không thuộc nhóm màn
  nào → một dòng «k tệp giao diện ngoài bản đồ», thoát 0. Chiều đỏ: bản sao bỏ kiểm quan hệ → hàm kiểm nêu «tệp hai
  nhóm mà im».
- AC-5: Given kho mẫu, When nhánh chỉ chạm tài liệu, `_acceptance/`, hay tệp ngoài mọi vùng; hoặc tệp vùng mang cặp
  lệch đã có ở base với số lần không tăng; hoặc cặp có dòng `ngoai_le` với `ly_do`, Then bước chấm thoát 0, không dòng
  lệch mới, cặp nợ cũ in nhãn «nợ cũ»; xoá một dòng khác trong tệp nợ cũ không biến cặp nợ cũ thành lệch mới hay thành
  biến mất. Đối chứng cùng kho: thêm chỗ thứ hai của khối nợ cũ vào chính tệp ấy → thoát 1, dòng lệch nêu «tăng 1 → 2». Hai mutant
  trên bản sao bước chấm: gỡ bộ lọc vùng → ca im nêu «tệp ngoài vùng bị chấm»; đổi loại trừ thành bao gồm → ca im nêu
  «nợ cũ hay ngoại lệ thành lệch».
- AC-6: (Hỏi-3) Given tệp vùng có `import(` hay `require(` động, thẻ phần tử mang `{...spread}`, hoặc nhóm `nhan_dien`
  dạng sổ đăng ký, When bước chấm chạy, Then mỗi ca in «không đo được: <tệp> — <lý do>» và thoát 0 (không chặn); ba
  dạng sót đã khai (xuất lại có đổi tên, thẻ qua biến, «ở gốc») nằm trong design doc §7 kèm ngưỡng mở DFK-C1.
- AC-7: Given hồ sơ trong kho mẫu, When `--kiem --write --slug <s> --den <sha>` chạy sau lượt chấm, Then
  `_acceptance/<s>/khuon-cham.json` mang `den`, `theo_khuon`, `lech_moi`, `no_cu`, `khong_do` khớp đầu ra của bước chấm
  cùng sha; thẻ Cổng Bằng chứng của hồ sơ in đúng một dòng «Khuôn: k tệp theo khuôn · n lệch mới · nợ cũ j · không đo m»
  (cộng «sổ lệch lọt: N mục» khi có `design/patterns/lech-lot.md`, N = số dòng mục theo khuôn sổ); hồ sơ chưa qua Cổng
  2 chạm vùng mà thiếu tệp, hoặc tệp có `den` khác `verified_commit` → cờ vàng «chưa chấm khuôn trên bản đã chấm»; hồ sơ
  đã ký → không cờ; hồ sơ chưa ký chỉ chạm `docs/` → không cờ. Chiều đỏ: bản sao thẻ bỏ nhánh cờ → hàm kiểm nêu «thiếu
  tệp khuôn mà không cờ»; bản sao bỏ so `den` → hàm kiểm nêu «số khuôn của lượt cũ mà không cờ».
- AC-8: Given kho mẫu không có `design/patterns/`, When chạy `--dem`, `--nap`, `--kiem`, `--kiem --write` và dựng thẻ hai
  cổng cho một hồ sơ, Then mọi lệnh thoát 0, không in gì, không ghi tệp nào; thẻ HTML và `--extract` bằng từng byte bản
  dựng bởi `scripts` và `lib` của gốc vòng (`git archive` trọn hai thư mục).
- AC-9: Given hồ sơ đã chạy `--nap` (ghim băm từng tệp bản đồ) rồi một tệp bản đồ đổi trên cây, When bước chấm chạy,
  Then nó chấm theo bản ghim và in «bản đồ nhóm <n> đổi sau khi ghim — chấm theo bản ghim»; nhóm chưa ghim đọc bản trên
  cây. `--goi-y-eval --nhom <n>` in khối eval có `paths` đúng bằng `[design/patterns/<n>.md]` cộng `nhan_dien` của n, không
  chứa glob của nhóm khác hay `design/patterns/**`. Chiều đỏ: bản sao đọc bản cây thay bản ghim → hàm kiểm nêu
  «chấm theo bản cây sau khi ghim».
- AC-10: Given kho mẫu, When `--dem` chạy ở bậc M0, Then in «khuôn: 3 nhóm (2 màn · 1 phần tử)»; `--nap --slug` in mỗi
  nhóm một dòng có nhóm, đối tượng, nhận việc, câu đầu «Dùng khi», tệp bản đồ, màn mẫu; khuôn đặc tả UX
  (`ux-spec-template.md`) có mục «Thẻ việc» với đúng năm trường ai dùng · việc chính · tần suất · số bản ghi · thiết bị;
  SKILL feature-loop có khối `KHUON-S0`, `KHUON-S1`, `KHUON-SAU-S4` mà lệnh trong đó chạy được trên kho mẫu (thoát 0).

- AC-11: (Hỏi-4) Given kho mẫu có `design/patterns/` và một hồ sơ mà diff chạm `nhan_dien` của một nhóm, When
  `feature-loop/scripts/s4-args.mjs` sinh tệp args mà `evals.yaml` của hồ sơ không có eval nào mang ref
  `config:executors.design.khuon`, Then thoát 2, thông điệp nêu tên hồ sơ, tên nhóm và `executors.design.khuon`, không
  sinh tệp; đối chứng cùng kho: thêm eval khuôn → thoát 0 sinh tệp; hồ sơ không chạm vùng nhóm, hoặc kho không có
  `design/patterns/` → thoát 0 như trước vòng. Chiều đỏ: bản sao `s4-args` bỏ lưới → hàm kiểm nêu «thiếu eval khuôn mà
  vẫn sinh args».

## Coverage

Quét hình thái preset test-matrix — bản đủ ở design doc §11. Trục A trạng thái kho · B tệp vòng chạm · C chỗ hành động.

- A{1 nhóm, nhiều nhóm} × B{khối cấm, thiếu khuôn, thiếu khe} × C{bước chấm} → AC-3. B{hai nhóm, ngoài bản đồ} → AC-4.
- B{tài liệu/hồ sơ, nợ cũ, ngoại lệ} → AC-5 (độ đặc hiệu + mutant). B{không đọc được} → AC-6.
- A{bản đồ sai lược đồ, khoá lạ, sổ đăng ký} × C{bộ đọc} → AC-1. C{lint của kho} → AC-2.
- C{sau lượt chấm + thẻ} → AC-7. A{không khai} × mọi C → AC-8. A{đổi sau ghim} + phạm vi đo theo nhóm → AC-9.
- C{S0, S1 nạp} + L1 → AC-10. B{chạm vùng nhóm} × C{sinh args S4} — hồ sơ quên eval khuôn → AC-11.
- [NGÀNH: ESLint no-restricted-imports, eslint-plugin-boundaries, dependency-cruiser — cấm nhập theo vùng; Shopify Polaris — dùng khi / không dùng khi].
- Later: ba lối chọn khối, khối «Khuôn» đầy đủ trên thẻ, màn mẫu chụp cạnh, khởi tạo từ mã, bộ đọc cây mã, L3–L10.
  Never: sinh cấu hình lint; hội đồng máy phán thẩm mỹ; cổng duyệt thiết kế riêng.

## Đường đo

- Thước trước phát hành (ma trận đỏ và im + hai mutant trong bộ kiểm kit) — số từ `tests/scripts/khuon-loi.test.mjs`
  ở lượt chấm · AC-3, AC-4, AC-5 bảo đảm.
- Thước sau phát hành (21 ngày ở kho nhận: vòng «đồng nhất lại» mới · lệch lọt) — số từ sổ quyết định của kho nhận và
  dòng «sổ lệch lọt: N mục» trên thẻ Cổng Bằng chứng · AC-7 bảo đảm phần thẻ; đếm vòng đồng nhất lại là việc đọc sổ ở
  hồ sơ mốc, không phải mã mới.
- Lượt chấm mỗi vòng giao diện và tỉ lệ hồ sơ giao diện có số đo ở kho nhận — số từ `khuon-cham.json` của từng hồ sơ ·
  AC-7 bảo đảm tệp có mặt sau mọi lượt chấm; AC-11 bảo đảm hồ sơ chạm vùng nhóm không bỏ được bước chấm.
- Sửa tay danh sách trong bài kiểm bản đồ ở kho nhận (mốc gốc 7) — số từ `git log` tệp bài kiểm bản đồ của kho nhận
  trong cửa sổ 21 ngày, đọc ở hồ sơ mốc; không phải mã mới.

## Out of scope

- Ba lối chọn khối ở Cổng Phạm vi (mục chờ KH-C6, vòng 2) và khối «Khuôn» đầy đủ trên thẻ hai cổng có ảnh (KH2, KH3).
- Khởi tạo bản đồ từ mã (KH5) và bộ đọc cây mã (DFK-C1).
- Sinh cấu hình lint (KH4 cũ): hai kho dùng hai bộ lint, kho tự bọc luật trên bộ đọc kit.
- Chặn làn V bằng khuôn hay dạy `scripts/pre-merge-check.sh` về khuôn.
- Cắt mốc 2.37.0, số phiên bản, `CHANGELOG.md` — việc của hồ sơ `release-2-37-0`.

## Notes

- Hạng T2: không tệp nào trong `lib/`, `hooks/`, `scripts/pre-merge-check.sh`; bộ đọc chỉ `require` hàm lib đang export.
- 11 tiêu chí (cờ vàng cỡ): AC-11 thêm sau phản biện ngữ cảnh sạch — dòng giữ cỡ trong sổ.
- Lưới tier-mismatch (#461) vẫn là lời trong SKILL; eval khuôn mang `config:executors.design.*` nên khớp cách hiểu đúng
  chữ «eval design» của lưới — không làm lưới thành mã ở vòng này.
- Hai số trong gói giao việc được sửa khi chép vào finding: 1/9 (không phải 2/9) hồ sơ giao diện kho thứ hai có số đo;
  0 lệch trong 2 vòng có số đo (không phải «trong 6 vòng»).
- Known limits — chọn ở Cổng Bằng chứng 2026-11-02:
  - Ngoài-1: Sửa cấu hình vùng giao diện sau lượt chấm thì tệp số đo vẫn được ghi như tính từ cấu hình cũ (con số ấy chưa hiện trên thẻ).
  - Ngoài-2: Dời một màn vào thư mục hồ sơ sau lượt chấm thì bước ghi số đo vẫn cho qua, số đo có thể lệch với bản đã chấm.
  - Ngoài-3: Gỡ nhầm phép từ chối «bản chấm không nằm trên nhánh hiện tại» thì bộ kiểm không báo đỏ.
  - Ngoài-4: Lời hứa «từ chối thì không đụng tệp số đo cũ» ở ca có commit mới sau lượt chấm chỉ được giữ bằng mã thoát.
  - Ngoài-5: Hai nhánh chặn ghi số đo khi cây đã đổi chưa có ca kiểm canh giữ.
  - Ngoài-7: Đổi tên một tệp trong hồ sơ mà chưa commit thì bước ghi số đo từ chối nhầm (đã hết từ lượt 3 khi phép kiểm chuyển sang git diff).
  - Ngoài-8: Gõ tên hồ sơ có dấu đi ngược thư mục thì lệnh khuôn có thể ghi tệp ra ngoài thư mục hồ sơ.
  - Ngoài-9: Khuôn đặc tả UX và hướng dẫn nói máy đối chiếu Thẻ việc với nhan_viec, nhưng chưa có bước nào làm vậy.
  - Ngoài-10: Một ca kiểm của hồ sơ lo-trinh-gio-may đã ký nay báo bỏ qua thay vì đỏ khi không có bản ghi tác tử con; hồ sơ ấy cần ghim lại ở đợt phát hành.
  - Ngoài-11: Lượt sau chỉ sửa dữ liệu mẫu của bộ kiểm thì các eval có thể giữ màu xanh cũ mà không chạy lại.
  - Ngoài-15: Tệp bản đồ dùng mô tả nhiều dòng thì các khoá phía sau bị bỏ qua lặng lẽ.
  - Ngoài-16: Phần dựng dòng Khuôn trên thẻ gặp lỗi bất ngờ thì thẻ bỏ dòng ấy và trông như kho không dùng khuôn.
