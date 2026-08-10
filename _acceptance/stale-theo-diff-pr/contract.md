---
schema_version: 1
feature: Staleness theo diff PR — staleness chỉ áp cho slug có hồ sơ trong diff
slug: stale-theo-diff-pr
owner: manh.phan@onemount.com
risk_tier: T3      # chạm scripts/pre-merge-check.sh (t3_paths) — tier máy-derive; nghi thức giữ gọn theo phê duyệt đề bài (contract 5 AC, trần 2 vòng chấm)
surfaces: [cli]
status: draft
approved_by:
approved_at:
time_human_minutes: {gate1: 0, gate2: 0}
---

# Acceptance Contract: stale-theo-diff-pr

## Context

Luật staleness của `pre-merge-check.sh` hiện áp cho MỌI slug trong `_acceptance/`
có `status implemented+`: một nhánh feature mới đương nhiên đổi code sau
`verified_commit` của các feature ĐÃ ký + merged, nên mọi PR từ vòng 2 trở đi
ở repo tiêu thụ bị chặn bởi lịch sử (đã cắn 2 lần thật ở floorplanstudio, phải
bắc cầu re-pin 4 lần — sổ vấp dòng 68). Ngữ nghĩa đúng: staleness bảo vệ
"bằng chứng mô tả cây ĐANG merge"; hồ sơ đã merge là sử liệu bất biến qua git;
ai CHẠM hồ sơ cũ thì nó vào diff → bị kiểm như thường. Phương án
stale-chỉ-áp-cho-slug-trong-diff đã được phân tích ở vòng 3 + B chuẩn y, và có
tiền lệ nội bộ ngay trong file: luật gap-probe đã dùng đúng ngữ nghĩa
`slug_in_diff` này từ 2026-07-26 (ledger d-116) vì cùng một lý do nợ-lịch-sử.

Source input: docs/research/so-vap-trien-khai.md dòng 68 + đề bài ① kit 2.1
(docs/findings/2026-08-10-reflect-lon-khep-gd2.md mục 9).

## Criteria

- AC-1: Given repo git có `--base` hợp lệ và slug S có file dưới
  `_acceptance/S/` trong diff PR, When một file code ngoài `t1_skip_globs`
  (và ngoài `_acceptance/`) đã đổi sau `verified_commit` của S, Then
  pre-merge exit 1 với `VIOLATION [S]: evidence is stale` nêu đúng file đổi —
  hành vi và thông điệp giữ nguyên khuôn cũ cho đối tượng đúng.
- AC-2: Given `--base` hợp lệ và slug cũ S (signed-off, `verified_commit`
  trỏ commit cũ hơn các thay đổi của PR) KHÔNG có file nào trong diff PR,
  When chạy pre-merge, Then S im lặng TRỌN khối `verified_commit` — không
  VIOLATION stale, không VIOLATION phantom-pin (kể cả khi pin là SHA mà
  squash-merge đã vứt — chính ca floorplanstudio), không NOTE shallow /
  no-verified_commit — sử liệu là sử liệu trọn gói; mọi luật khác trên S
  (verdict, chữ ký, recheck, re-pin) chạy y như trước — và vế "vẫn chạy" phải
  được chứng minh bằng ĐỐI CHỨNG DƯƠNG trong cùng ca: một slug ngoài diff mang
  lỗi KHÁC staleness (chữ ký trống) vẫn bị VIOLATION đúng luật đó (yêu cầu B
  mốc 1 — "im lặng về stale" phải phân biệt được với "miễn kiểm toàn bộ").
- AC-3: Given slug cũ S đã signed-off từ trước, When PR CHẠM vào hồ sơ của nó
  (bất kỳ file nào dưới `_acceptance/S/` nằm trong diff) trong lúc code đã
  đổi sau `verified_commit`, Then luật staleness áp như thường → VIOLATION
  (chống giả-dạng-sử-liệu: sửa hồ sơ cũ là mất quyền im lặng).
- AC-4: Given chạy KHÔNG có `--base`/`PRE_MERGE_BASE` (hoặc diff không dựng
  được — không merge-base), When tới luật staleness, Then áp cho MỌI slug như
  hành vi cũ (fail-safe), và cả lần chạy in đúng MỘT dòng NOTE hằng khai rõ
  "staleness đang kiểm toàn bộ slug vì không có phạm vi diff" — tắt-phạm-vi
  phải thấy được, không đổi mã thoát của các ca cũ (VC01–VC06 giữ nguyên màu).
- AC-5: Given bộ ca code-sinh tái hiện floorplanstudio (2 slug cũ signed-off
  với `verified_commit` cũ + 1 slug mới có hồ sơ trong diff PR, `--base`
  tường minh), When chạy pre-merge trên bản vá, Then chỉ slug mới bị
  soi staleness (2 slug cũ im lặng, exit phản ánh riêng chất lượng slug mới);
  và chiều đỏ của chính bộ ca này ĐÃ CHẠY THẬT: đột biến gỡ điều kiện
  slug-trong-diff (kèm xác-nhận-đột-biến bằng grep mẫu đã sửa trước khi đọc
  kết quả) làm ca đối chứng ĐỎ — không có xác nhận thì không khai PASS.
- AC-6: Given đợt sửa lõi cưỡng chế đóng gói xong, When đo tại commit ghi, Then
  version acceptance-gate = 1.39.2 ở MỌI manifest đang mang 1.39.1 (đổi thật
  đo bằng so với số cũ), mirror `plugins/` khớp nguồn (P30), diff của
  `pre-merge-check.sh` so với base thoả DV5 additive-only, và toàn bộ suite
  `feature_loop.suite_keys` xanh. (AC release-mechanics gộp — giữ contract
  gọn mà không để eval hồi quy nào mồ côi tiêu chí.)

## Coverage

Quét 2 trục (morphological, thu gọn theo nghi-thức-tương-xứng):

- Trục A — quan hệ slug↔diff: trong-diff (AC-1) | ngoài-diff (AC-2) |
  hồ-sơ-cũ-bị-chạm (AC-3) | không-có-diff-scope gồm cả no-base lẫn
  diff-fail-no-merge-base (AC-4) [thước CE: 4 nhánh của `DIFF_READY`/
  `slug_in_diff` trong chính script — đủ vì không còn nhánh code thứ 5]
- Trục B — chiều đo: xanh-đúng (AC-1/AC-3 vẫn đỏ khi phải đỏ, AC-2 xanh khi
  phải xanh) | đỏ-đã-chạy (AC-5 mutation-confirmed) | hồi-quy-cũ (VC01–VC06
  không đổi màu, AC-4) [thước CE: bảng ca hiện hữu trong tests/scripts/run-tests.sh]

## Out of scope

- KHÔNG đổi phạm vi bất kỳ luật nào khác (verdict/chữ ký/recheck/re-pin/
  gap-probe/T1-escape): slug ngoài diff vẫn đi qua toàn bộ các luật đó y như
  trước — chỉ luật staleness đổi phạm vi.
- KHÔNG đi đường "miễn staleness cho slug signed-off/merged" (phương án (c)
  sổ vấp dòng 68): trạng thái tự khai không phải bằng chứng bất biến; quan hệ
  vào-diff mới là ranh giới đúng (hồ sơ chạm là kiểm).
- KHÔNG xử staleness liên-tính-năng theo path-canh-chung (sổ vấp dòng 56) và
  KHÔNG phân biệt diff-comment-only (tiền lệ hẹp 09/08) — hai món 2.1 khác.
- KHÔNG thêm cờ CLI mới: phạm vi lấy từ `--base` sẵn có; không có `--base`
  là fallback kiểm-tất, không phải lỗi.

## Notes

- Vì sao KHÔNG có code mới ở tầng parse (cite theo yêu cầu B): tái dùng
  `slug_in_diff()` + khối diff-scope hoisted sẵn có — bài học ĐỢT 1 `W-spec`
  "khuôn-giải-sai là tự viết parser thứ ba thay vì dùng hàm chuẩn"; một nguồn
  ngữ nghĩa slug↔diff cho cả gap-probe lẫn staleness, lệch nhau là hết đường.
- Lưới an toàn giữ nguyên sau đổi: PR đổi code mà KHÔNG mang hồ sơ nào →
  T1-escape chặn như cũ; PR mang hồ sơ nào thì hồ sơ đó vào diff → bị
  soi staleness. Không có đường đi nào cho code lọt qua mà không bị một trong
  hai lưới đỡ.
- Vật đổi: `scripts/pre-merge-check.sh` (1 file lõi cưỡng chế) + `tests/scripts/
  run-tests.sh` (ca mới VC07+) + bump version 1.39.2 + sync mirror `plugins/`
  (P30) — phạm vi phình quá mức này là điều kiện dừng theo đề bài.
- Trần 2 vòng chấm; cùng lớp lỗi lần 2 → dừng hỏi owner (luật vòng).
- Known-limit 1 (gap-probe P1, đã ký nhận): phát-hiện-chạm đọc diff committed
  (`base...HEAD`) — tamper hồ sơ cũ CHƯA COMMIT không kích hoạt lại luật
  staleness ở lần chạy local; thẩm quyền merge là CI trên cây committed, nơi
  mọi thay đổi hoặc vào diff hoặc không tồn tại. Không mở rộng `slug_in_diff`
  (hàm dùng chung với luật gap-probe).
- Known-limit 2 (gap-probe P2): fixture/thư mục `*/_acceptance/<trùng-tên>/`
  ở cây con kéo slug cùng tên vào phạm vi soi (fail-closed, có tiền lệ khai
  trong chính script) — chặn oan chứ không xanh oan; không nới glob.
- Đánh đổi đã khai cho owner ký ở Cổng 1: pin ma (phantom verified_commit)
  trên slug NGOÀI diff trở thành vô hình theo thiết kế — hệ quả trực tiếp
  của ngữ nghĩa sử liệu; ai chạm hồ sơ đó thì phantom-pin VIOLATION nổ lại
  như cũ (ca đối chứng ghim cả hai chiều).
