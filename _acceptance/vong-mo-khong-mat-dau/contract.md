---
schema_version: 1
feature: Dấu «đã đến», «chấp nhận», «kết lượt» không mất khi bộ canh nền đồng bộ kênh cùng lúc; hạn gõ sai bị từ chối kèm câu báo; đáp một yêu cầu cũ bằng lệnh mới tới đúng người hỏi và đóng vòng
slug: vong-mo-khong-mat-dau
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: draft
design_doc: docs/superpowers/specs/2026-10-19-vong-mo-khong-mat-dau-design.md
approved_by:
approved_at:
---

## Context

Hàng GT2 của lộ trình kit, dựng trên GT1 (`_acceptance/vong-mo-co-chu-giu/`, gộp #387). Chủ kho ký Cổng Đáng 19/10 với
dòng «đáng: build · ngưỡng: nhận». Ba lỗi đều do lượt chấm 2 của GT1 tìm ra (Ngoài-4, 5, 7, 9) và cả ba làm sai đúng điều
GT1 hứa — một vòng đã mở thì máy giữ nó tới khi đóng thật:

1. bộ canh nền đồng bộ kênh ghi đè trọn tệp trạng thái bằng bản đọc từ trước khi chờ mạng, nên dấu máy hook ghi trong khe
   ấy mất và vòng kẹt ở «chờ chấp nhận»;
2. hạn gõ sai được báo thành công rồi bị bộ đọc lờ đi;
3. đáp một yêu cầu kiểu cũ bằng `tin` được báo thành công mà câu trả lời không tới người hỏi.

Nguồn đầu vào: ô cơ hội `_acceptance/vong-mo-khong-mat-dau/opportunity.md`; ba hạt giống
`docs/plans/2026-10-19-hat-giong-kenh-ghi-chong-dau-may.md`, `-han-go-sai-bi-lo.md`, `-dap-yeu-cau-cu-bi-nuot.md`; thiết kế
`docs/superpowers/specs/2026-10-19-vong-mo-khong-mat-dau-design.md`.

Thuật ngữ (cùng nghĩa với hợp đồng GT1, dùng chung bộ dựng `tests/dieu-phoi/tin-kho-thu.mjs`):
- **kho thử có đợt**, **kênh giả**, **bản lành / bản tiêm**, **0 byte ghi** — như GT1. Kênh giả thêm một tuỳ chọn **trễ**:
  lời gọi ĐỌC bình luận ngủ N ms rồi mới trả, để một lần đồng bộ thật đang chờ mạng khi việc khác ghi vào. Khi vào khe
  nó ghi tệp mốc «bắt đầu đọc», khi ra ghi mốc «trả về» — ca chờ mốc đầu rồi mới chen, không dựa vào đồng hồ.
- **máy kênh** = một kho thử đã `tin vai --kenh thu/kenh#308 --may <tên>`.
- **chen trong khe đồng bộ** = ca chạy `tin canh --kenh …` của bản đang kiểm ở tiến trình nền với kênh giả trễ 1500 ms;
  ca chờ tệp mốc «bắt đầu đọc» (tức `canh` đã đọc tệp trạng thái và đang chờ mạng), rồi chạy hook THẬT (lệnh rút từ
  `hooks.json`) của cùng bản; chờ `canh` thoát rồi mới đọc sổ. Mỗi hàng chứng mốc bắt đầu đọc < mốc ghi dấu < mốc trả về.
- **yêu cầu kiểu cũ** = tệp `yeu-cau/<dãy>-<số>.json` trong thư mục đợt, sinh bằng CLI `dieu-phoi.mjs yeu-cau` thật.
  Người hỏi chờ trả lời ở `tra-loi/<dãy>-<số>.json`.

## Criteria

- AC-1: Given máy kênh `MBP` giao `X-1910-1` cho máy kênh `M5` qua kênh giả, When dấu máy được ghi **chen trong khe đồng
  bộ** của bộ canh nền, Then sau khi đồng bộ xong sổ vẫn thấy dấu ấy — ma trận ba hàng, số hàng in ra:
  - (a) M5: hook PostToolUse đưa lời giao vào phiên trong khe → `tin so --json` của M5 ghi vòng ở nấc 2 «đã đến»;
  - (b) MBP: M5 đã `XONG`, hook PostToolUse của MBP đưa lời xong vào phiên trong khe → sổ MBP ghi `da-chap-nhan`, vòng
    vắng khỏi sổ mở;
  - (c) M5: hook Stop trong khe với lời giao chưa nhận → sổ M5 ghi `ket_luot_chua_nhan: true`.
- AC-2: Given như AC-1 (c) — hook Stop lần một chạy trong khe chờ mạng của đồng bộ — When hook Stop chạy lần thứ hai sau
  khi đồng bộ xong (lời giao vẫn chưa nhận), Then lần hai cho qua (không chặn): dấu chặn ghi trong khe chờ mạng không bị
  đồng bộ đè. Khe mili-giây giữa lần đọc lại và lần đổi tên tệp KHÔNG thuộc lời hứa này — giới hạn khai ở Notes kèm ngưỡng.
- AC-3: Given tệp trạng thái kênh ghi bằng bản trước GT2 có sẵn dấu máy cũ (sinh trong lượt bằng bản gói ở sha ghim
  `33c9e64f` — `origin/main` lúc mở vòng, `git archive` trọn thư mục `dieu-phoi`; đối chứng dương: `may_su` của tệp ấy
  chứa dấu «đã đến» trước khi bản mới chạy; không dựng được bản cũ → ca báo lỗi hạ tầng có tên, không báo vật hỏng), When bản mới đồng bộ và hook ghi thêm dấu mới, Then sổ đọc cả dấu cũ lẫn dấu mới; không lệnh nào bắt
  chuyển tệp, và tệp dấu mới không bị bộ quét kênh của hook nhận nhầm là một kênh (hook vẫn thấy đúng một kênh).
- AC-4: Given hai lần đồng bộ chồng nhau trên cùng máy kênh (lần một đang ngủ trong khe trễ, lần hai chạy xong trước với
  hai bình luận mới hơn), When lần một ghi xong, Then sổ có đủ mọi bình luận của cả hai lần, con trỏ là id lớn nhất, và
  các trường hook đã ghi giữa chừng (dấu chặn, mốc lỗi kênh) còn nguyên.
- AC-5: Given kho thử có đợt và máy kênh, When gõ hạn sai, Then lệnh thoát 1, stderr nêu đúng cờ và nguyên văn giá trị đã
  gõ («--han phải là số phút nguyên dương, nhận «1.5»»), 0 byte ghi — trên kênh không đăng bình luận nào. Ma trận viết
  sẵn, số hàng in ra: giá trị `1.5` · `abc` · `-5` · `0` · `` (rỗng) · `1e3` × cờ `GIAO --han` · `GIAO --han-xong` ·
  `HỎI --han` × nơi chứa đợt · kênh.
- AC-6: Given cùng hai nơi chứa, When gõ hạn đúng `1` · `45` · `100000` cho ba cờ trên, Then thoát 0 và giá trị sổ đọc lại
  (`han_nhan_phut`, `han_xong_khoang`) bằng đúng số đã gõ — bên viết và bên đọc cùng một miền.
- AC-7: Given đợt có yêu cầu kiểu cũ `P1-<n>` của dãy P1 chưa có trả lời, When giám sát `G` chạy
  `tin XONG P1-<n> "<câu>"`, Then:
  - thoát 0, stdout nêu đã trả lời `P1-<n>` vào hộp của P1;
  - `tra-loi/P1-<n>.json` có `ket_qua: "da-tra-loi"`, `boi: "giam-sat"`, `ly_do` bằng câu đã gõ, và qua được bộ kiểm
    trả lời của bộ phát lịch (một nhịp `chay` không chuyển nó vào `tra-loi/hong/`);
  - `tin so` không còn vòng `P1-<n>`;
  - người hỏi thôi bị coi là đang chờ: hook chờ người của P1 không còn trả «chờ trả lời» cho yêu cầu ấy;
  - với `--ket-qua duyet` thì `ket_qua` bằng `duyet`, không có cờ thì không bao giờ là `duyet`.
- AC-8: Given như AC-7, When `G` chạy `tin TRẢ P1-<n> "<lý do>" --chuyen P2`, Then `tra-loi/P1-<n>.json` có
  `ket_qua: "tra-lai"`, `ly_do` chứa lý do và «P2», vòng vắng khỏi sổ mở; thiếu `--chuyen` → thoát 1, 0 byte ghi.
- AC-9: Given như AC-7, When chạy một lệnh đáp không chuyển được, Then thoát 1, stderr nêu `P1-<n>` là yêu cầu kiểu cũ và
  chỉ đúng hai lệnh đáp được (`tin XONG`, `tin TRẢ`), 0 byte ghi (thư mục đợt, `tin.jsonl`, `tra-loi/`). Ma trận:
  `NHẬN` · `KẸT` · `HUỶ` (P1 gõ) · `MỞ LẠI` (G gõ) · `XONG` do P2 gõ (không phải người nhận) · `TRẢ` do P2 gõ · `XONG`
  không câu · `XONG` trên yêu cầu đã có trả lời · `TRẢ` trên yêu cầu đã có trả lời (câu trả lời trước còn nguyên từng byte). Đối chứng cùng ca: một vòng mã mới (`HỎI` của P1) vẫn đáp được bằng `XONG` như GT1.
- AC-10: Given khối luật `LUAT-TIN` của gói (tệp `dieu-phoi/scripts/mau/LUAT.md` mà `mo` chép vào thư mục đợt), When đọc
  bảng «mỗi việc một lệnh», Then có đúng một dòng nói hạn là số phút nguyên dương và đúng một dòng nói yêu cầu kiểu cũ
  đáp bằng `tin XONG`/`tin TRẢ` và câu trả lời vào hộp người hỏi; và mỗi dòng ấy khớp đúng hành vi đo ở AC-5 và AC-7 (ca
  đo rút câu lệnh mẫu của dòng luật rồi chạy nó trên kho thử).

## Coverage

Quét bằng morphological-scan (preset test-matrix) ở S1. Chân sản phẩm [SUY-TỪ-REPO: dieu-phoi/scripts/tin-kenh.mjs,
dieu-phoi/scripts/tin.mjs, dieu-phoi/scripts/tin-dua.mjs, dieu-phoi/scripts/hook-tin.mjs, dieu-phoi/scripts/ghi.mjs] và ba
hạt giống. Chân ngành:
- mất cập nhật khi hai bên đọc-sửa-ghi cùng một bản ghi [NGÀNH: «lost update» — Berenson et al. 1995, A Critique of ANSI
  SQL Isolation Levels];
- ghi chỉ-thêm không đan dòng [NGÀNH: POSIX write() với O_APPEND];
- đọc khoan dung bản cũ [NGÀNH: Tolerant Reader — Fowler].

- Trục A · bên ghi tệp kênh: đồng bộ | hook đưa tin (đã đến, chấp nhận) | hook dừng (kết lượt, dấu chặn) | `tin vai` |
  lệnh `tin` đăng rồi đồng bộ lại [thước CE: grep mọi lời ghi `ghiJsonNguyenTu`/`them` trên tệp kênh — SUY-TỪ-REPO]
- Trục B · kiểu chen: tuần tự | chen trong khe chờ mạng | hai đồng bộ chồng nhau | tệp đời trước [thước CE: «lost update»]
- Trục C · lệnh đáp × loại vòng: NHẬN, XONG, KẸT, TRẢ, HUỶ, MỞ LẠI × vòng mã mới | yêu cầu kiểu cũ [thước CE: chín khẩu
  lệnh của `KHAU_LENH` trong tin-doc.mjs — SUY-TỪ-REPO]
- Trục D · giá trị hạn × cờ × nơi chứa: nguyên dương | 0 | âm | lẻ | chữ | rỗng | dạng khoa học | rất lớn × `--han` GIAO,
  `--han-xong` GIAO, `--han` HỎI × đợt, kênh [thước CE: khuôn bên đọc `soPhut` — SUY-TỪ-REPO]
- Core → AC: A(hook đưa)×B(chen) → AC-1 (a)(b) · A(hook dừng)×B(chen) → AC-1 (c), AC-2 · B(đời trước) → AC-3 ·
  B(hai đồng bộ) → AC-4 · D(sai) → AC-5 · D(đúng, biên) → AC-6 · C(XONG×cũ) → AC-7 · C(TRẢ×cũ) → AC-8 · C(còn lại×cũ) +
  đối chứng mã mới → AC-9 · lời → AC-10.
- Đi chéo mọi ô Core: từ chối thì không ghi byte nào; máy không bao giờ tự ghi `duyet`; kênh không đăng bình luận khi từ
  chối; hook không gọi mạng.
- Later — A(`tin vai`)×B(chen): vai ghi lại tên máy trong khe đồng bộ; đồng bộ đọc lại trước khi ghi nên giữ được, nhưng
  không đo riêng (vai chạy một lần lúc cài).
- Later — HUỶ yêu cầu kiểu cũ bởi chính người hỏi (hôm nay bị từ chối kèm chỉ dẫn).
- Never — khoá tệp cho các trường JSON còn lại (sổ quyết định, dòng descope); chuyển yêu cầu kiểu cũ sang khuôn mã mới
  (trái luật đổi schema phải có đường đọc-cũ).

## Đường đo

- Thước: 14 ngày sau khi crm nhận mốc có GT2, không vòng nào kẹt ở «chờ chấp nhận» khi người giao đã chấp nhận · số từ:
  `tin so --kenh <kênh> --tat-ca --json` trên máy người giao, lọc `trang_thai == "cho-chap-nhan"` có `xong_luc` cũ hơn 24
  giờ, đối chiếu tệp đưa tin của worktree người giao (lời XONG đã được đưa vào phiên) — số kẹt phải bằng 0 · mẫu số N = số
  vòng kênh đã tới XONG trong cửa sổ; N = 0 thì thước VÔ HIỆU, không đọc thành «0 kẹt» · bảo đảm bởi: AC-1, AC-3, AC-4.
  Đã có sẵn: lệnh `tin so`; đếm tay mỗi hàng lọc ra.
- Thước: không lời đáp nào bị báo thành công mà không tới người hỏi · số từ: với mỗi yêu cầu kiểu cũ đã đáp bằng `tin`
  trong cửa sổ (dòng `tin XONG|TRẢ <mã kiểu cũ>` thoát 0 trong nhật ký phiên, hoặc tệp `tra-loi/<id>.json` có `boi:
  "giam-sat"` mang mốc trong cửa sổ): đếm (1) tệp cùng tên ở `tra-loi/hong/` và (2) yêu cầu mà hook chờ người của người
  hỏi còn báo «chờ trả lời» — cả hai phải bằng 0; thêm (3) dòng `tin.jsonl` có dòng đầu là khẩu lệnh đáp trên mã kiểu cũ
  (`grep -cE '^\{"text":"(NHẬN|XONG|KẸT|TRẢ|HUỶ|MỞ LẠI) [A-Za-z0-9]+-[0-9]+ ·'`) bằng 0 · mẫu số N = số yêu cầu kiểu cũ
  đã đáp; N = 0 thì thước VÔ HIỆU · bảo đảm bởi: AC-7, AC-8, AC-9.
- Thước: CHẾT — hạn sai lọt qua · số từ: AC-5 (từ chối trước khi ghi) · bảo đảm bởi: AC-5, AC-6.

## Out of scope

- Khoá tệp cho các trường còn lại của trạng thái kênh (dấu chặn, mốc lỗi kênh, tên máy) — khe mili-giây, khai ở Notes.
- HUỶ yêu cầu kiểu cũ bởi người hỏi; chuyển yêu cầu kiểu cũ sang khuôn mã mới; đổi `kiemYeuCau`, `kiemTraLoi` hay bộ phát
  lịch.
- Các mục Ngoài-n khác của GT1: dấu báo lỗi nạp không gỡ (Ngoài-8), mốc 24 giờ của MỞ LẠI (Ngoài-10), các giới hạn bộ kiểm.
- Engine nghiệm thu (`skills/`, `feature-loop/`, `scripts/` gốc, `lib/`, `hooks/` gốc); cắt số, gắn tag.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Known limits (nhãn trạng thái, không phải việc):
  - **Khe mili-giây của các trường JSON còn lại**: đồng bộ đọc lại tệp ngay trước khi ghi, nhưng giữa lần đọc lại và lần
    đổi tên tệp, một hook ghi dấu chặn có thể bị đè. Ngưỡng mở: ≥ 1 lần hook dừng chặn kết lượt hai lần cho cùng một vòng
    trên kênh thật.
  - **Chen đo trên đồng hồ thật với khe trễ 1500 ms**: ca chứng hai tiến trình thật cùng ghi, không chứng mọi thứ tự
    trong khe.
