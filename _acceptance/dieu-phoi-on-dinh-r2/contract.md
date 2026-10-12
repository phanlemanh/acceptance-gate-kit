---
schema_version: 1
feature: Ổn định gói dieu-phoi trước đợt chạy r2 của crm (DP8) — `xem --kiem-chuyen` tách dòng phải sửa khỏi dòng lịch sử và bắt import tương đối vào lõi cũ; phiên thợ tự ghi danh worktree của mình vào dãy; việc nền ngoài dãy giữ nhịp khoá thì bộ phát lịch thôi báo nhầm «khoa-khong-nhip»
slug: dieu-phoi-on-dinh-r2
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli, config, docs]
status: approved
design_doc: _acceptance/dieu-phoi-on-dinh-r2/design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-12T10:46:11Z
---

# Acceptance Contract: dieu-phoi-on-dinh-r2

## Context

Gốc: `crm-onehub/_acceptance/chuyen-goi-dieu-phoi/` (lượt chấm 1, 12/10, nhánh `chore/chuyen-goi-dieu-phoi` @
`48703713`) + phanlemanh/acceptance-gate-kit#301, phụ lục 12/10, điểm 1, 2, 6, 8. Vòng chạy dưới ô dù
`_acceptance/dieu-phoi-tho-trong-kit/` (Cổng Đáng build 09/10, timebox 07/11) như DP2–DP7, không có `opportunity.md`
riêng. Ba lỗ chặn đợt chạy `r2` của crm (mở ~16/10); cả ba là chỗ gói đã phát hành hứa một điều mà vật làm khác
trên kho tiêu thụ thật. Thiết kế và năm nhóm chỗ chọn: design doc ở frontmatter.

Thuật ngữ:
- **dãy**, **phiên thợ**, **phiên giám sát**, **bộ phát lịch**, **nhịp sống của phiên**: như `CONTEXT.md`.
- **dòng chuyển** = một phần tử `<tệp>:<dòng>` mà `kiemChuyen` trả: một dòng còn trỏ bản lõi chép tay
  `scripts/dieu-phoi/` của kho.
- **lớp lịch sử** = bảy lớp của bảng «Chỗ chọn 1b» ở design doc (`khai-boi-kho`, `ho-so`, `eval-chet`,
  `eval-ngoai-lan-may`, `executor-chet`, `tai-lieu`, `lo-trinh`); dòng chuyển không thuộc lớp nào là **phải sửa**.
- **kho thử** = kho git do code sinh trong lượt đo (`git init` + `git worktree add` thật, thư mục tạm).
- **đợt mở từ gói** = đợt dựng bằng `mo` thật từ gói khai qua `dieu_phoi.goi_dot`.
- **nhịp thật** = một lần `motNhip(...)` của `phat-lich.mjs` với đồng hồ giả.
- **nhịp khoá** = tệp `khoa/<tài nguyên>/nhip` mà `chamNhip` (hook PostToolUse, `giu-nhip.mjs`) ghi.
- **worktree kiểu chip** = một `git worktree add` mới của kho thử, tên ngẫu nhiên, không khai trong gói đợt.

## Criteria

- AC-1: Given một kho thử có đúng một dòng trỏ `scripts/dieu-phoi/` ở mỗi chỗ của ma trận viết sẵn — hook trong `.claude/settings.json` · script `package.json` · hook git · `README.md` gốc · `LUAT.md` của đợt đang chạy · eval `script` sống của hồ sơ đang mở · eval `script` sống của hồ sơ đã ký · eval `judgment` sống của hồ sơ đang mở · eval `judgment` sống của hồ sơ đã ký · eval `ui-check` sống của hồ sơ `machine-cleared` · eval `status: not-run` · executor mà một eval sống gọi · executor chỉ eval `not-run` gọi · executor nêu trong `feature_loop.suite_keys` · `run-log.jsonl`, `evidence-report.md`, `decisions.jsonl`, `rang/x.mjs` của một hồ sơ · `docs/superpowers/specs/x.md` · `docs/plan/y.md` · `LO-TRINH.html` · tệp khớp một glob của `dieu_phoi.lich_su` · khối eval sống được khai `<evals.yaml>#<id>` — When gọi `phanLopChuyen` trên kho đó, Then mỗi hàng rơi đúng nhóm viết sẵn (phải sửa, hay lịch sử với đúng lớp); số hàng kiểm == độ dài ma trận (in ra); hợp `phai_sua` với các `dong` của `lich_su` BẰNG đúng `kiemChuyen` trên cùng kho (so đa tập). Kho không khai `dieu_phoi.lich_su` thì hai hàng khai rơi về phải sửa. Chiều đỏ: bản sao bỏ luật `eval-chet` → ca nêu hàng eval `not-run`; bản sao xếp mọi tệp dưới `_acceptance/` vào `ho-so` → ca nêu hàng eval sống của hồ sơ đang mở.
- AC-2: Given một kho thử có `scripts/kiem-cheo/` với ma trận chỉ định viết sẵn — `from '../dieu-phoi/dot.mjs'` · `import('../dieu-phoi/hook-nhip.mjs')` · `require('../dieu-phoi/x.cjs')` · `import '../dieu-phoi/y.mjs'` · `export { a } from '../dieu-phoi/z.mjs'` · từ `scripts/kiem-cheo/test/`: `from '../../dieu-phoi/hinh-dang.mjs'` · từ `scripts/`: `from './dieu-phoi/dot.mjs'` · chỉ định trỏ đúng thư mục `'../dieu-phoi'` · khối `import {` nhiều dòng mà `from` ở dòng riêng — và các hàng phải IM: `'../dieu-phoi-khac/x.mjs'` · `'./dieu-phoi/x.mjs'` từ thư mục khác `scripts/` · chuỗi `../dieu-phoi/dot.mjs` trong một tệp `.md` · đường tuyệt đối không tương đối, When gọi `kiemChuyen`, Then đúng các dòng của hàng phải bắt có mặt (số dòng `from` của khối nhiều dòng), không dòng nào của hàng phải im; một dòng vừa chứa chuỗi `scripts/dieu-phoi/` vừa là import tương đối chỉ xuất hiện một lần; mọi dòng import tương đối ở ngoài `_acceptance/` và `docs/` là phải sửa. Chiều đỏ: bản sao gói bỏ bước quét import tương đối → ca nêu `scripts/kiem-cheo/dem.mjs` thiếu.
- AC-3: Given kho thử của AC-1, When chạy `xem --kiem-chuyen` (CLI thật) có và không có `--chi-tiet`, Then dòng phải sửa in đúng khuôn `kiem-chuyen: <tệp>:<dòng>` theo thứ tự của `kiemChuyen`; một dòng tổng `kiem-chuyen: lich-su <n> dòng — <lớp> <k> · …` với n bằng số dòng lịch sử, các lớp theo thứ tự bảng và tổng các k bằng n; `--chi-tiet` thêm đúng n dòng `kiem-chuyen lich-su: <tệp>:<dòng> · <lớp>`; thoát 1. Trên cùng kho sau khi gỡ mọi dòng phải sửa: dòng `kiem-chuyen: sach` rồi dòng tổng, thoát 0. Kho không có dòng chuyển nào: đầu ra đúng một dòng `kiem-chuyen: sach`, thoát 0. Ca đã ký `DP1-13 kiem-chuyen` xanh, thân không đổi. Chiều đỏ: bản sao CLI tính mã thoát trên MỌI dòng chuyển → ca nêu «thoát 1 khi chỉ còn lịch sử».
- AC-4: Given kho crm thật của máy này (`$HOME/dev/crm-onehub`) ở hai sha ghim — merge-base `b9a3b160` (trước khi gỡ) và đỉnh nhánh chuyển `48703713` — dựng thành bản sao chia đối tượng trong thư mục tạm, When chạy `kiemChuyen` và `phanLopChuyen` của gói lúc này, và `kiemChuyen` của gói `v2.27.0` (tag ghim `a1e2e0b9` — bản crm đang cài, rút bằng `git archive`), Then ở `b9a3b160`: phải sửa chứa đủ 4 dòng hook của `.claude/settings.json`, dòng script của `package.json`, và các dòng import tương đối của `scripts/kiem-cheo/dem.mjs`, `scripts/kiem-cheo/khoa.mjs`, `scripts/kiem-cheo/test/khoa.test.mjs`; danh sách mới bằng danh sách của `v2.27.0` cộng đúng các dòng import tương đối ấy. Ở `48703713`: danh sách mới BẰNG danh sách của `v2.27.0` (không thêm, không bớt); không khai gì thì phải sửa đúng là các dòng `evals.yaml` của hồ sơ `chuyen-goi-dieu-phoi` cộng các dòng của khối E7 `sua-paths-e5-soan-okr`; thêm vào `config.yaml` của bản sao `dieu_phoi.lich_su` gồm `_acceptance/chuyen-goi-dieu-phoi/**` và `_acceptance/sua-paths-e5-soan-okr/evals.yaml#E7` thì CLI in `kiem-chuyen: sach` và thoát 0. Phép đo in tổng dòng, số phải sửa và đếm theo lớp của cả hai cây. Kho vắng hay sha vắng → thoát 2 với lời «không đọc được ở đây: <kho hoặc sha>».
- AC-5: Given một đợt mở từ gói có `day[].worktree` là chỗ giữ không tồn tại (khuôn gói crm `r2`: `/CHUA-CO-WORKTREE/P<n>`), hai dãy `P1`, `P2`, và một worktree kiểu chip W, When phiên ở W chạy `ghi-danh P1` (CLI thật), Then `hang-viec.json` có `day[P1].worktree` == realpath(W), dãy `P2` và mọi khoá khác so sâu bằng trước; Nhật ký của `LUAT.md` thêm đúng một dòng; `su-kien.jsonl` thêm đúng một sự kiện `doi-ke-hoach` kiểu `ghi-danh` mang dãy và worktree; `cho-ghi-danh/P1.json` không còn. Sau đó, từ W: `tho --json` trả `trong_dot: true`, `day: "P1"`; `xin s4` ghi đơn mang `worktree` == W; hook nhịp thật ghi nhịp mang `day: "P1"`. Chạy lại `ghi-danh P1` → in «đã ghi danh», không thêm sự kiện. Đối chứng cùng fixture TRƯỚC khi ghi danh: `tho --json` từ W trả `khong-phai-tho`, `xin s4` thoát 1 nêu «không thuộc dãy nào».
- AC-6: Given một đợt mở từ gói và một worktree kiểu chip W, When chạy `ghi-danh` ở bốn hàng từ chối cố định — (a) `ghi-danh P9` (dãy không có) · (b) W đã là worktree của `P2` · (c) cwd là gốc kho chính · (d) không có đợt — Then mỗi hàng thoát 1 với thông điệp ghim riêng (in ra), `hang-viec.json` giữ nguyên từng byte, không thêm sự kiện; số hàng == 4. And Given ma trận trạng thái viết sẵn của dãy `P1` có worktree cũ — nhịp sống 3′ · 9′ · 11′ · 25′ trước · giữ khoá s4 trong hạn thuê, phiên chết · còn đơn `xin/P1-s4.json`, phiên chết · tệp `cho-nguoi/P1.json` · worktree cũ đã bị xoá — When mỗi hàng chạy `tiep-tuc --nhe --json` rồi `ghi-danh P1` từ W mới, Then bất biến «hành động của `P1` ∈ {`khong`, `nhan-giang-lai`, `cho-nguoi`} ⇔ `ghi-danh` thoát 1» đúng ở mọi hàng (số hàng in ra); hàng nhận thì `day[P1].worktree` == W, sự kiện mang `thay` == worktree cũ, đầu ra nhắc nhánh cũ còn checkout ở worktree cũ (khi worktree cũ còn), và hàng còn đơn thì đơn mang `worktree` == W với `luc` giữ nguyên. Chiều đỏ: bản sao `ghi-danh` thôi đọc hành động của dãy (luôn nhận) → ca nêu hàng «nhịp 3′» lệch bất biến.
- AC-7: Given đợt của AC-5 dựng theo khuôn gói crm `r2` (mọi hàng mang mã; ô cơ hội của hàng ở kho chính mang `decision: build`), trước khi ghi danh, giám sát có nhịp sống, một nhịp thật đã ghi `tiep/`, When chạy `chan-doan --json --chi-tiet` và `tiep-tuc --phien <giám sát> --nhe --json`, Then `day:P1`, `day:P2` mang hành động `mo-chip` ở cả hai lệnh, trạng thái `du`, `ghi_danh` chứa `node <thư mục đợt>/loi/dieu-phoi.mjs ghi-danh P1` (P2 tương ứng) và «worktree chưa ghi danh»; sau khi `P1` ghi danh và phiên ở W có nhịp sống → `day:P1` là `khong`. Ma trận dãy chỗ giữ × {có dấu `cho-ghi-danh`, không dấu} viết sẵn — có dấu: có hàng → `mo-chip` · nghỉ → `khong-hang` · chưa thư mục `song/` → `chua-biet` · tệp `cho-nguoi/` → `cho-nguoi` · khoá ghi cho dãy → `khong`; không dấu (đợt mở bằng gói `v2.27.0`) → `worktree-mat` — mỗi hàng một assert, số hàng in ra, hành động không với tới được in tên. Lời ghi danh của dãy `mo-chip` đã có worktree (ma trận DP3-03 hàng (c)) cũng mang lệnh `ghi-danh`; hàng (e) của DP3-03 (worktree từng có rồi bị xoá) vẫn `worktree-mat` (ca `DP3-03 ma-tran` xanh, thân không đổi). Chiều đỏ: bản sao `tiep-tuc.mjs` bỏ xét dấu `cho-ghi-danh` → ca nêu «day:P1 worktree-mat — dãy chưa ghi danh không được mời chip».
- AC-8: Given một đợt mở từ gói với tám dãy chỗ giữ và tám worktree kiểu chip, biến `DIEU_PHOI_TRE_GHI_MS` đặt trễ 300 ms giữa đọc và ghi, When tám tiến trình `ghi-danh P<k>` chạy đồng thời, Then cả tám dãy mang đúng worktree của mình, tám sự kiện `ghi-danh`, Nhật ký `LUAT.md` thêm đúng tám dòng, không tiến trình nào thoát khác 0, không còn thư mục khoá `hang-viec.khoa`. Hàng trộn: bốn `ghi-danh` cùng bốn `hang them <việc> --day P<k>` đồng thời → bốn worktree và bốn hàng mới đều có mặt. Một khoá bỏ rơi cũ hơn 30″ không chặn lệnh. Chiều đỏ: bản sao bỏ khoá → ca nêu tên dãy mất bản ghi; bản sao bỏ khoá CHỈ ở `hang them` → hàng trộn nêu tên dãy hoặc hàng mất bản ghi.
- AC-9: Given một đợt mở từ gói, bộ phát lịch thật (đồng hồ giả), và một việc nền ngoài dãy (phiên `kiem-cheo`) có đơn `xin/kiem-cheo-s4.json` hợp `kiemDon` của gói, worktree riêng `cay`, When nhịp thật ở T cấp s4 cho `kiem-cheo`, việc nền gọi `chamNhip({cwd: cay})` của gói sau lúc cấp, rồi nhịp thật ở T+11′ và T+12′, Then không có sự kiện `khoa-khong-nhip` nào. Ma trận cùng fixture (số hàng in ra): việc nền KHÔNG chạm nhịp → đúng 1 sự kiện `khoa-khong-nhip`, `can_phan: true` · việc nền chạy `giu-nhip.mjs -- <lệnh ngắn>` từ `cay` → 0 · nhịp khoá ghi TRƯỚC lúc cấp → 1 · dãy `P1` giữ s4 chỉ có nhịp khoá, không nhịp phiên → 1 (luật của dãy không đổi; ca `DP3-10 khoa-khong-nhip` và `DP3-10-do bo-dieu-kien` xanh, thân không đổi) · việc nền thôi chạm nhịp tới quá `nhip_cu_phut` sau hạn thuê → sự kiện `thu-hoi` như mọi khoá. Chiều đỏ: bản sao bỏ luật miễn cho phiên ngoài dãy → hàng có nhịp khoá ra 1 sự kiện, ca nêu «việc nền giữ nhịp khoá vẫn bị báo khoa-khong-nhip».
- AC-10: Given README của gói, `scripts/mau/LUAT.md` và chuỗi «dùng:» của CLI, When đọc, Then README nêu lệnh `ghi-danh` (phiên thợ chạy từ worktree của chip trước S1; bốn điều kiện từ chối), đầu ra mới của `xem --kiem-chuyen` cùng bảy lớp lịch sử và khoá `dieu_phoi.lich_su` (glob và `#<id>`), và việc nền ngoài dãy giữ nhịp khoá bằng `chamNhip`/`giu-nhip.mjs`; mục «Cách xin tài nguyên» của `LUAT.md` có dòng `ghi-danh`; chuỗi «dùng:» nêu `ghi-danh <dãy>` và `--chi-tiet` của `xem --kiem-chuyen`. Ca `DP1-06 khuon` xanh (README và LUAT không trỏ bản chép tay). Chiều đỏ: bản sao README bỏ đoạn `ghi-danh` → ca nêu «README thiếu ghi-danh».
- AC-11: Given cây sau vòng, When chạy suite `tests/dieu-phoi/**/*.test.mjs`, bộ kiểm gói (`kiem-validate.mjs`) và ca LB1, LB2, Then mọi ca xanh; và mỗi ca của các tệp dưới `tests/dieu-phoi/` có ở mốc so mà bị đổi thân hay bị bỏ có một dòng sổ `fix` của hồ sơ này nêu đúng tên ca. Mốc so theo bộ chọn của SDT-07: lịch sử HEAD có commit gộp «Merge pull request #<n> from <chủ>/vong/dieu-phoi-on-dinh-r2» → từ điểm rẽ hai cha tới cha-2; không có → `merge-base HEAD origin/main` tới HEAD. Ca in mốc đã chọn và danh sách tên ca đổi thân. Chiều đỏ trên kho git tạm do code sinh: đổi thân một ca không kèm dòng sổ → ca nêu đúng tên ca; thêm dòng sổ `fix` nêu tên ca → im; nhánh gộp `main` vào rồi gộp PR bằng `--no-ff` → danh sách chỉ gồm ca của nhánh.

## Coverage

Bỏ quét bằng skill `morphological-scan` — dòng sổ `descope` «bỏ coverage-scan — …». Phạm vi là ba lỗ đã chốt bởi
neo ngoài (crm lượt chấm 1 + #301 điểm 1, 2, 6, 8), không phải một không gian cần liệt kê cho đủ. Không gian của
từng lỗ nằm ở ma trận trong AC:

- Trục A · chỗ dòng chuyển nằm × lớp (lỗ 1): settings · `package.json` · hook git · LaunchAgent · `LUAT.md` đợt ·
  mã nguồn · README gốc · eval (sống/`not-run` × `script`/`judgment`/`ui-check` × hồ sơ đang mở/đã thông) ·
  executor (eval sống gọi / chỉ `not-run` gọi / `suite_keys`) · tệp hồ sơ · `docs/**` · `LO-TRINH.html` · khai của
  kho (glob / `#id`) → AC-1, AC-3, AC-4. [thước CE: bảng phân lớp crm tự dựng 12/10 + nháp đo trên crm thật]
- Trục B · hình dạng chỉ định import (lỗ 1, điểm 6): `from` · `import()` · `require()` · `import '…'` ·
  `export … from` · nhiều cấp `../..` · `./` · trỏ thư mục · khối nhiều dòng · trỏ chỗ khác (phải im) → AC-2.
  [thước CE: ba tệp `scripts/kiem-cheo/` của crm ở merge-base]
- Trục C · trạng thái dãy khi ghi danh (lỗ 2): chỗ giữ · worktree sống · worktree chết · worktree mất · giữ khoá ·
  còn đơn · W của dãy khác · gốc kho · không đợt · tranh chấp → AC-5, AC-6, AC-8. Hành động của dãy (bảy giá trị
  `HANH_DONG`) × có/không dấu chờ ghi danh → AC-7. [thước CE: nhánh `xetDay` của `tiep-tuc.mjs`]
- Trục D · người giữ khoá × nguồn nhịp (lỗ 3): việc nền ngoài dãy / dãy × nhịp khoá sau cấp / trước cấp / không ×
  nhịp phiên → AC-9. [thước CE: `baoKhoaKhongNhip` + ca DP3-10]

## Out of scope

- Sửa `feature-loop/scripts/trong-dot.mjs` để phiên chip quên ghi danh được nhắc ở S0 (vùng feature-loop của đường
  găng 2.28) — giới hạn khai ở design doc.
- Chip mở đúng worktree dựng sẵn (cần năng lực của app, không phải của gói).
- Chuyển nhánh của dãy sang worktree mới khi đè worktree chết — lệnh chỉ nhắc, không tự `git worktree remove`.
- Đổi thứ tự xếp lượt của kiểm chéo (#301 điểm 3), nghiệm thu theo lô (điểm 4), tên/tiêu đề phiên (điểm 7).
- Quét lệnh shell gọi đường tương đối và chỉ định import dựng động.
- Sửa kho crm (nó tự khai `dieu_phoi.lich_su` khi nâng gói).

## Notes

- `kiemChuyen` giữ giao kèo trả MỌI dòng chuyển vì E1 của hồ sơ crm `chuyen-goi-dieu-phoi` (chưa ký) tự phân lớp
  đầu ra của nó; AC-4 chứng trên cây crm thật rằng ở đỉnh nhánh chuyển danh sách không đổi.
- Hai CỘNG của vòng (lệnh `ghi-danh`, khoá `dieu_phoi.lich_su`) nằm trong lời giao của Điều phối M5 theo lệnh chủ
  kho 12/10; trace: lệnh `ghi-danh` → nguyên tố 3 (người khỏi điền worktree tay cho từng dãy — lượt gọi người);
  khoá khai lịch sử → nguyên tố 2.
