---
schema_version: 1
feature: Trang lộ trình vẽ ở đâu cũng chỉ lấy ý đã theo dõi trong chính cây đang vẽ — vẽ trong worktree khớp CI, còn các bộ đọc tương tác vẫn thấy mọi ý ở thư mục chính
slug: ve-lo-trinh-doc-tin-hieu-cua-cay
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/tin-hieu.mjs, scripts/product-map.mjs, tests — không chạm lib/**, hooks/**, lưới trước-merge
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-17-ve-lo-trinh-doc-tin-hieu-cua-cay-design.md
status: signed-off
approved_by: Manh Phan
approved_at: 2026-10-17T11:57:49Z
---

# Acceptance Contract: ve-lo-trinh-doc-tin-hieu-cua-cay

## Context

Vòng vá của RM3b (`cua-tin-hieu-goc-moi-worktree`, đã ký) cho mốc 2.32.1. Trên v2.32.0 bộ vẽ trang lộ trình đọc thư mục
tín hiệu ở thư mục chính của kho; trang được commit và CI vẽ lại từ cây đang kiểm → vẽ trong worktree thì `product-map
--check` đỏ «lệch» (crm-onehub#375, PR crm #463; tái hiện `repro/tai-hien.sh`, đầu ra `repro/dau-ra-v2.32.0.txt`).

Ca đo ở `tests/scripts/ve-lo-trinh-doc-tin-hieu-cua-cay.test.mjs` (ca `VT-<n>` = AC-n). Kho thử, worktree và bản tải
sạch (`git clone --no-hardlinks` rồi checkout đúng sha đã commit — hình dạng CI) do code sinh trong lượt. «Bộ máy gốc» =
`git archive <gốc so> scripts lib skills commands road-map dieu-phoi feature-loop`, gốc so đọc từ
`_acceptance/ve-lo-trinh-doc-tin-hieu-cua-cay/goc-so` (v2.32.0). Mỗi ca đỏ chạy trên BẢN SAO của vật với nhát tiêm khớp
ĐÚNG một lần, SAU khi bản lành xanh trên cùng fixture, và ghim thông điệp. Ca in đúng một dòng `PASS: VT-…` hoặc
`FAIL: VT-… — <vì sao>`. «Trang» = `LO-TRINH.html` do `scripts/product-map.mjs --root <cây>` vẽ; «CI xanh» = trên bản tải
sạch, `product-map.mjs --check` thoát 0 và in «LO-TRINH.html khớp tệp ý định và hồ sơ.».

## Criteria

- AC-1: Given kho thử khai lộ trình và cửa tín hiệu `tin-hieu/kho` mà tệp ý được git theo dõi; thư mục chính đứng ở
  commit có một ý `kho-1` và giữ thêm một ý CHƯA theo dõi `nguoi-x-1`; một worktree `--detach` sạch đứng ở commit có
  thêm hai ý đã theo dõi `kho-2`, `kho-3` (hình dạng crm #452), When vẽ trang trong worktree bằng bộ máy hiện tại, commit
  trang rồi chạy `--check` trên bản tải sạch của sha ấy, Then tập id trên trang đúng bằng {kho-1, kho-2, kho-3} và CI
  xanh. Đối chứng trên cùng fixture: bộ máy gốc vẽ trang có `nguoi-x-1` và CI thoát 1 in «LO-TRINH.html lệch» (thiếu →
  «fixture không tái hiện sự cố»).
  Chiều đỏ: bản sao bộ vẽ gọi đường đọc của thư mục chính → FAIL ghim «trang vẽ lấy tín hiệu của thư mục chính».
- AC-2: Given kho thử không worktree, ở thư mục chính có ý đã commit `t-1`, ý đã `git add` chưa commit `s-1`, ý chưa
  theo dõi `u-1`, ý đã commit rồi bị xoá khỏi đĩa chưa commit việc xoá `x-1`, và ý đã commit `m-1` mà tiêu đề đã sửa
  trên đĩa chưa add, When vẽ trang ở thư mục chính, Then lệnh thoát 0, tập id trên trang đúng bằng {t-1, s-1, m-1}, trang
  mang tiêu đề MỚI của `m-1` và không mang tiêu đề cũ, và sau khi commit mọi thứ trừ `u-1` thì CI xanh; When tiếp `git
  add u-1`, vẽ lại, commit, Then tập id là {t-1, s-1, m-1, u-1} và CI xanh. Given thêm một kho khai cửa mà MỌI tệp ý chưa
  theo dõi (khuôn RM3b), When vẽ ở thư mục chính, Then trang không mang id ý nào và CI xanh (giới hạn có tên).
  Chiều đỏ: bản sao bỏ phép lọc theo dõi (đọc mọi `.json` trong thư mục của cây) → FAIL ghim «trang vẽ hiện ý chưa theo
  dõi»; bản sao đọc nội dung tệp ý từ index (`git show :<tệp>`) → FAIL ghim «trang vẽ bản tệp ý cũ trong index».
  (Vế `x-1` không có chiều đỏ riêng: bộ đọc đã nuốt tệp không đọc được thành lỗi khuôn từ trước vòng này — vế ấy chỉ ghim
  «không sập, không lên trang».)
- AC-3: Given fixture của RM3b (tệp ý KHÔNG theo dõi, worktree A và B, ba ý gửi bằng `/road-map:gui` từ A, B và thư mục
  chính), When chạy `tin-hieu.mjs --chua-gom`, `--duong`, `--rang`, `--cau` và `start-scan.mjs` ở thư mục chính, A và B,
  Then ở mỗi lệnh đầu ra ba gốc BẰNG nhau và tập id đúng ba (bộ đọc tương tác giữ lời hứa RM3b); và trang vẽ ở A không
  chứa id nào trong ba (giới hạn có tên: ý chưa theo dõi không lên trang), sau đối chứng dương trên cùng fixture: bộ máy
  gốc vẽ trang ở A chứa đủ ba id (thiếu → «đối chứng không chạy: trang»). Lệnh ca RM3b
  (`executors.test.cua_tin_hieu_goc_moi_worktree`) thoát 0.
  Chiều đỏ: bản sao bật phép lọc theo dõi cho MỌI bộ đọc (mặc định của `docTinHieu`) → FAIL ghim «bộ đọc tương tác mất
  ý chưa theo dõi».
- AC-4: Given ba kho thử — (i) không khai `tin_hieu`, (ii) khai cửa, không worktree, mọi ý đã theo dõi, (iii) gốc là thư
  mục thường không phải kho git, có config khai lộ trình + cửa và hai ý — When vẽ bằng bộ máy hiện tại và bộ máy gốc trên
  cùng fixture, Then `PRODUCT-MAP.md` và `LO-TRINH.html` giống TỪNG BYTE, sau đối chứng dương (bộ máy gốc thoát 0, trang
  ca (ii) và (iii) chứa đủ id ý; thiếu → «đối chứng gốc không chạy: <ca>»).
  Chiều đỏ: bản sao trả danh sách rỗng khi gốc không phải kho git → FAIL ghim «thư mục thường mất ý trên trang».

## Coverage

Quét gọn ba trục (bỏ skill quét — sổ dòng `descope` «bỏ coverage-scan»). Chân sản phẩm:
`[SUY-TỪ-REPO: _acceptance/ve-lo-trinh-doc-tin-hieu-cua-cay/repro/dau-ra-v2.32.0.txt]`,
`[SUY-TỪ-REPO: _acceptance/cua-tin-hieu-goc-moi-worktree/contract.md]`. Chân ngành: `[NGÀNH: git-ls-files(1)]`.
- Trục A — nơi vẽ: worktree sạch (AC-1) · thư mục chính (AC-2) · bản tải sạch CI (AC-1, AC-2) · không phải git (AC-4)
  [thước CE: git-worktree(1)]
- Trục B — trạng thái tệp ý ở chỗ vẽ: đã commit · đã add chưa commit · chưa theo dõi · đã xoá chưa commit · đã sửa
  chưa add · kho không theo dõi ý nào (AC-2) · không
  có ở cây nhưng có ở thư mục chính (AC-1, AC-3)  [thước CE: git-ls-files(1)]
- Trục C — loại bộ đọc: bộ vẽ trang qua product-map (AC-1, AC-2, AC-4) · qua khởi tạo lộ trình (AC-1) · bộ đọc
  tương tác (AC-3)  [thước CE: bảng §1 design]
- Lớp xuyên: không đổi byte ở kho không có sự cố (AC-4).

## Đường đo

- Số đọc: PR nhận 2.32.1 ở crm — bước Product map `--check` của CI xanh với trang vẽ trong worktree (không qua bản tải
  độc lập), đọc trên lượt CI của PR ấy; rồi 14 ngày: số lượt CI crm đỏ «LO-TRINH.html lệch» do tín hiệu = 0, với N = số
  commit chạm `LO-TRINH.html` ở crm trong cửa sổ (N = 0 → «chưa đọc được»). Bảo đảm bởi AC-1 (hình dạng crm) và AC-2.

## Out of scope

- Bộ đọc tương tác (`--chua-gom`, `--duong`, `--rang`, `--cau`, thẻ khởi động, `/road-map:xem`, skill gom) — giữ nguyên
  RM3b.
- Nhắc trên trang «có N ý chờ chưa lên trang» — trang là vật commit, không mang trạng thái máy cục bộ.
- Tự commit tệp ý thay người, hay đổi `/road-map:gui` để ghi vào cây.

## Notes

- AC-1…AC-3 của hồ sơ này THAY THẾ chân `scripts/product-map.mjs` (trang lộ trình chứa đủ bốn id ở ba gốc) trong AC-2 của
  `cua-tin-hieu-goc-moi-worktree`; các chân khác của AC-2 ấy giữ nguyên. Hợp đồng đã ký không sửa; ca GW-2 bỏ chân
  product-map kèm chú thích trỏ về đây.
- Giới hạn có tên: ý chưa theo dõi không lên trang lộ trình — kể cả ở thư mục chính — tới khi được commit (hoặc `git
  add`); kho giữ mọi tệp ý ngoài git theo khuôn RM3b thì trang KHÔNG BAO GIỜ có khối đường đi tín hiệu. Ý vẫn hiện ở mọi
  bộ đọc tương tác. Đo 17/10: kho duy nhất khai cửa trên máy là crm, và crm theo dõi tệp ý trong git.
- Nội dung tệp ý đọc từ đĩa của cây đang vẽ: tệp đã theo dõi mà sửa chưa commit thì trang theo bản sửa; commit cùng trang
  thì CI khớp (bốn lệnh đóng cổng vẽ trước commit cùng lượt).
- Bước khởi tạo lộ trình (`lo-trinh-khoi-tao.mjs`) vẽ trang qua đúng hàm `veTrangLoTrinh` của product-map nên đi cùng
  đường này.
- Known limits — chọn ở Cổng Bằng chứng 2026-10-17:
  - Ngoài-1: eval E5 mượn chỗ ở AC-4 chỉ để lệnh vùng 2 của bộ kiểm plugin chạy nền; một lỗi ở nơi khác trong kit có thể làm AC-4 báo trượt dù trang vẫn giống từng byte.
  - Ngoài-3: tài liệu dữ liệu lộ trình (một câu thêm ở vòng này) nói ý chưa commit vẫn xem được ở /road-map:xem — sai: lệnh ấy không hiện tín hiệu; ý chưa commit hiện ở thẻ khởi động và các lệnh gom tín hiệu.
  - Ngoài-4: nguồn tín hiệu khai ngoài kho hay bằng đường tuyệt đối, hoặc git báo lỗi lạ, thì trang có thể hiện nhầm ý chưa commit hoặc mất cả ý đã commit mà không cảnh báo.
  - Ngoài-5: thư mục không có git riêng nằm trong một kho git khác thì trang không hiện ý nào (2.32.0 hiện đủ).
  - Ngoài-6: thông điệp ghim chiều đỏ của vài ca cũng khớp khi bộ đọc sập hay trang không vẽ, nên khi đỏ khó phân biệt hỏng hẳn với lọc sai.
