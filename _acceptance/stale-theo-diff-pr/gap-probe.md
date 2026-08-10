---
slug: stale-theo-diff-pr
at: 2026-08-10T10:43:31Z
verdict: findings
p0: 2
p1: 2
p2: 4
---

# Phản biện context sạch — stale-theo-diff-pr

Bộ đo bám khá sát khuôn V1 hiện hữu và có đủ hai chiều xanh/đỏ cho lõi thay đổi
(E1↔E2 phân biệt được bản-vá-no-op, E5 có control dương + xác-nhận-đột-biến).
Nhưng nó đo LỖ HẸP hơn contract hứa ở ba chỗ: Coverage trục A khai 4 nhánh của
`DIFF_READY`/`slug_in_diff` mà eval chỉ chạm 3 (nhánh diff-fail-có-base — chính
là shallow clone mặc định của CI — không có ca nào); AC-5 tả một lần chạy hỗn
hợp cũ-im-mới-đỏ nhưng không eval nào chạy đúng kịch bản đó theo chiều xanh (E5
chỉ mượn fixture VC07 cho mutant); và ranh giới "luật staleness" chưa được định
nghĩa trên 5 nhánh của khối `verified_commit` (dòng 812–842), trong đó nhánh
phantom-pin là đúng cơ chế mà squash-merge ở repo tiêu thụ sẽ kích hoạt — nghĩa
là bản vá có thể ship xanh 12/12 eval mà vẫn không chữa được incident
floorplanstudio, hoặc chữa bằng cách tắt im một VIOLATION có thật. Các finding
dưới xếp nặng trước.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals.yaml E4 / AC-4 | AC-4 khai phủ cả nhánh "diff không dựng được" (base có nhưng không merge-base → `DIFF_READY=0` + `DIFF_SKIP_NOTE`, pre-merge-check.sh:455-460) nhưng E4/VC10 chỉ đo nhánh no-base | Bản vá guard sai biến — kiểm `[ -z "$BASE" ]` thay vì `DIFF_READY` — thì trên clone shallow/grafted (fetch-depth:1 là MẶC ĐỊNH của actions/checkout) `slug_in_diff` trả 1 cho MỌI slug → staleness tắt im lặng toàn bộ, không NOTE, exit 0; E1–E5 đều dùng base resolve được hoặc không base nên mọi eval xanh | Thêm 1 ca code-sinh: base là nhánh orphan (`git checkout --orphan`) cùng repo → kỳ vọng fallback kiểm-tất (stale VIOLATION trên slug cũ, cùng màu VC10) + đúng 1 dòng NOTE hằng | **fixed (pre-Gate-1)**: thêm ca VC10b orphan-base vào E4; guard trong bản vá sẽ kiểm `DIFF_READY`, không kiểm `$BASE` |
| P0 | evals.yaml E1/E5 / AC-5 | Không eval nào chạy đúng fixture hỗn hợp AC-5 theo chiều xanh-đỏ ĐỒNG THỜI: E1 không khai fixture có slug cũ đứng trước, E2 không có slug mới bị soi, E5 chỉ dùng VC07 (không slug mới) cho cặp control/mutant | Bug rò trạng thái giữa hai lượt vòng lặp per-slug làm slug MỚI xếp sau slug cũ theo alphabet thừa hưởng kết quả "ngoài diff" → staleness của slug mới bị skip → false-green; E1 (fixture 1-slug) và E2 (không drift) đều vẫn xanh | Dựng VC08 (E1) đúng theo AC-5: 2 slug cũ + 1 slug mới trong MỘT repo, tên xếp cũ-trước-mới, một lần chạy ghim đủ cả `OK [slug-cũ]` (×2) lẫn `VIOLATION [slug-mới] ... stale` trong cùng stdout | **fixed (pre-Gate-1)**: VC08 đổi thành fixture hỗn hợp 2-cũ-trước-1-mới, một lần chạy ghim cả hai chiều; E5 control/mutant chạy trên CHÍNH fixture này |
| P1 | contract.md AC-2/AC-3 + evals | Ranh giới "luật staleness" không định nghĩa trên 5 nhánh của khối vc (no-vc NOTE 814 / not-git NOTE 816 / phantom-pin VIOLATION 831 / shallow NOTE 834 / stale_files 836-841): nhánh nào theo `slug_in_diff`? Không eval nào ghim phantom-pin cho slug ngoài diff khi có --base | Hai chiều đều hỏng mà eval vẫn xanh: (a) chỉ scope `stale_files` → repo squash-merge (đúng floorplanstudio) có verified_commit cũ là SHA nhánh đã vứt → phantom VIOLATION vẫn chặn mọi PR, bản vá KHÔNG chữa được incident nguồn; (b) scope trọn khối → pin ma trên slug cũ vô hình vĩnh viễn ở mọi PR | Disposition tường minh từng nhánh trong contract + 1 ca: slug cũ ngoài diff mang phantom pin, chạy với --base, ghim hành vi đã chọn bằng thông điệp đích danh | **fixed (pre-Gate-1)**: chọn scope TRỌN khối verified_commit (cả phantom-pin/shallow/no-vc NOTE) — sử liệu là sử liệu trọn gói, và đây mới là thứ chữa incident squash-merge floorplanstudio; AC-2 viết rõ 5 nhánh, thêm ca VC12 phantom-ngoài-diff-im-lặng + đối chứng phantom-trong-diff-VIOLATION; đánh đổi (pin ma vô hình trên sử liệu) khai trong Notes cho owner ký |
| P1 | scripts/pre-merge-check.sh slug_in_diff + evals | `slug_in_diff` đọc diff committed (`BASE_SHA...HEAD`) còn `stale_files` đọc cả working tree (VC06); không AC/eval nào đo touch chỉ-working-tree | Sửa `_acceptance/<slug-cũ>/evidence-report.md` KHÔNG commit rồi chạy pre-merge với --base: hồ sơ tampered được đọc từ đĩa nhưng slug không "trong diff" → lưới AC-3 không nổ ở lần chạy local | Disposition: chấp nhận + ghi known-limit "CI trên cây committed mới là thẩm quyền", hoặc cộng working-tree diff vào phát hiện chạm | **known-limit (khai Notes)**: CI chạy trên cây committed là thẩm quyền merge — tamper local chưa commit hoặc sẽ vào diff khi commit, hoặc không tồn tại ở CI; không mở rộng slug_in_diff (hàm dùng chung với gap-probe, đổi nó là đổi phạm vi 2 luật) |
| P2 | evals.yaml E4 | "Đúng MỘT dòng NOTE hằng" chỉ sống trong văn AC-4; expected của E4 không đòi đếm | Test viết lỏng vẫn thoả E4 trong khi bản vá in NOTE mỗi-slug-một-dòng | Ghim trong expected E4: `grep -cF "<chuỗi hằng>"` == 1 trên fixture ≥2 slug có vc | **fixed (pre-Gate-1)**: E4 expected ghim đếm ==1 trên fixture 2 slug |
| P2 | evals.yaml E5 | Chép "bản script" đơn lẻ sang vị trí mutant làm mất `lib/` + `recheck-evidence.cjs` cạnh nó → control leg xanh nhờ chuỗi fallback-NOTE, đường chạy KHÁC bản thật | Fixture tương lai bật strict/required → bản chép đổi màu vì thiếu lib chứ không vì mutant | Chép trọn `scripts/` + `lib/` sang vị trí mutant | **fixed (pre-Gate-1)**: E5 expected ghi rõ chép trọn scripts/ + lib/ |
| P2 | tests VC10 + VC01–VC06 | Các ca no-base đổi nghĩa nếu `PRE_MERGE_BASE` lọt từ env | Máy dev/CI export PRE_MERGE_BASE → ca đo nhầm nhánh | Chạy ca no-base qua `env -u PRE_MERGE_BASE` | **accepted-partial**: ca MỚI đều chạy qua `env -u PRE_MERGE_BASE`; lớp VC01–VC06 cũ để nguyên (phơi nhiễm có sẵn, ngoài phạm vi hẹp — ghi vào sổ nếu cắn) |
| P2 | scripts/pre-merge-check.sh:478 + contract Notes | Nhánh `*/_acceptance/<slug>/*` (monorepo) khiến fixture test trùng tên slug cũ kéo slug cũ vào scope → stale VIOLATION oan (fail-closed, không false-green) | Kit thêm fixture trùng tên slug đã ký → PR bị chặn khó hiểu, người vá dễ nới glob sai | Ghi known-limit trong contract Notes | **known-limit (khai Notes)**: fail-closed có chủ đích, tiền lệ comment dòng 467-472; không nới glob |
