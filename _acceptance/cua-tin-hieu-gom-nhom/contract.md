---
schema_version: 1
feature: Cửa tín hiệu của kho — tín hiệu người và phát sinh của thợ chung một khuôn; phiên gom theo trục kết quả thành bản gom (cũng là bản phạm vi của cắt lượt); răng phủ «mỗi tín hiệu ở đúng một chỗ»; đường đi tín hiệu → nhóm → hàng → hồ sơ cho người gửi, kể cả trong khối dữ liệu lộ trình
slug: cua-tin-hieu-gom-nhom
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/tin-hieu.mjs (mới) + scripts/lo-trinh.mjs (khối dữ liệu) + skills/gom-tin-hieu (mới) + references + CONTEXT/GUIDE + test — không chạm lib/**, hooks/**, dieu-phoi/**, scripts/cat-luot.mjs, lưới trước-gộp
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-11-cua-tin-hieu-gom-nhom-design.md
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-11T09:08:03Z
---

# Acceptance Contract: cua-tin-hieu-gom-nhom

## Context

Cổng Đáng 11/10 ký build T2 hàng L3, trục gom A — kết quả người dùng (owner «Làm»). Hôm nay chủ kho gom
tay mục «Hạng mục cùng lớp» (10/238 hồ sơ crm, không phân hoạch: F11 ở hai cụm), người không dùng git
không có cửa gửi, và không gì nói một ý đã được việc đã giao phủ. Vòng này giao khuôn tín hiệu chung với
kênh yêu cầu của gói Điều phối, ổ cắm nguồn tín hiệu kho khai, skill gom, răng phủ chỉ đọc, đường đi về
người gửi và khoá tuỳ chọn trong khối dữ liệu lộ trình. Khuôn, luật đỏ, phương án bỏ: design doc.

## Criteria

- AC-1: Given khối mẫu tín hiệu người `TIN-HIEU-MAU` rút từ khuôn `skills/acceptance/references/tin-hieu-template.md` và 374 tệp yêu cầu thật (ẩn danh) của đợt crm 07–09/10 ở `tests/dieu-phoi/fixtures/dot-crm-0910/yeu-cau/`, When bộ đọc của `scripts/tin-hieu.mjs` đọc, Then tín hiệu mẫu qua CHÍNH hàm `kiemYeuCau` của `dieu-phoi/scripts/hinh-dang.mjs` và ra đúng một tín hiệu với `id` = tên tệp, `tieu_de` = tiêu đề mẫu; trên 374 tệp thật số đếm theo `loai` bằng đếm độc lập trong ca, tín hiệu là đúng các tệp có loại trong khối `TIN-HIEU-LOAI` của khuôn mà đúng khuôn (tệp loại ấy mà sai khuôn — dữ liệu thật có 2 tệp thiếu `luc` — mỗi tệp một lỗi, số tín hiệu cộng số lỗi bằng số tệp loại ấy), và các loại còn lại hiện trong MỘT dòng «ngoài khuôn tín hiệu: …» kèm số từng loại; tệp sai khuôn (JSON hỏng · thiếu `phien` · `luc` không đọc được · `tin-hieu` thiếu `tieu_de`) mỗi tệp ra một lỗi nêu tên tệp và lý do, không bỏ lặng.
- AC-2: Given `_acceptance/config.yaml` khai khối `tin_hieu:` với `nguon` (chuỗi · dòng `[a, b]` · danh sách `- a`) và `gom`, When đọc khoá, Then ra đúng danh sách nguồn theo thứ tự và thư mục gom; khoá `nguon:` thụt ở khối khác không bị nhặt; vắng khối, vắng `nguon` hoặc vắng `gom` → cửa vắng. Given kho không khai cửa, When chạy `--rang`, `--chua-gom`, `--duong`, Then mỗi lệnh thoát 2 với «kho chưa khai cửa tín hiệu»; khối `lo-trinh-du-lieu` THÔ của trang (chưa qua bộ đọc) KHÔNG có khoá `tin_hieu`; và `PRODUCT-MAP.md`, `LO-TRINH.html` của kho đó vẽ bằng cây đang kiểm giống từng byte bản vẽ bằng bản sao cùng cây có mô-đun cửa tín hiệu bị thay bằng bản ném lỗi khi nạp.
- AC-3: Given khối mẫu bản gom `GOM-MAU` rút từ khuôn, When bộ đọc bản gom đọc, Then ra đúng `dot`, `dang`, `nguon`, `truc`, `den`, danh sách nhóm (mã, tên, tín hiệu theo thứ tự), danh sách lẻ (tín hiệu, lý do) và đã phủ (tín hiệu, hồ sơ) — bằng đếm độc lập trong ca; và CÙNG văn bản đọc bằng `docPhamVi` import từ `scripts/cat-luot.mjs` ra đúng danh sách mã nhóm, 0 lỗi — dòng lẻ và đã phủ không thành mã của bản phạm vi.
- AC-4: Given kho thử N tín hiệu và bản gom đặt mỗi tín hiệu ở đúng một chỗ, When chạy `--rang`, Then thoát 0 và in bảng phủ đủ N dòng (tín hiệu → chỗ); trên ma trận toàn phần viết sẵn {chưa có chỗ · hai nhóm cùng tệp · nhóm và lẻ · hai tệp bản gom · kê lặp trong cùng nhóm · tín hiệu lạ không có trong nguồn · lẻ thiếu lý do · nhóm không kê tín hiệu} mỗi ca thoát 1 với đúng một dòng lỗi nêu tín hiệu (ca trùng nêu cả hai chỗ); tín hiệu có `luc` sau `den` lớn nhất không làm đỏ; và mọi lượt chạy (xanh, đỏ, `--chua-gom`, `--duong`) để băm mọi tệp của cây trước = sau, `git status --porcelain` rỗng.
- AC-5: Given bản gom ghi «đã phủ» một tín hiệu bằng một hồ sơ, When chạy `--rang`, Then hồ sơ có trạng thái thuộc tập «đã giao» của lưới trước-gộp (import `lib/workspace-record.cjs`, không chép) → không lỗi; hồ sơ không có, hoặc hồ sơ ở trạng thái chưa giao (ô cơ hội đang chờ · `draft` · `approved` · `implemented`) → thoát 1, lỗi nêu tín hiệu, hồ sơ và trạng thái.
- AC-6: Given bản gom vắng `truc` hoặc mang `truc` khác giá trị khối `GOM-TRUC` của `skills/gom-tin-hieu/SKILL.md`, When chạy `--rang`, Then thoát 1 nêu cả hai giá trị; bản sao SKILL đổi giá trị khối làm một bản gom đang xanh thành đỏ (chính sách đọc từ SKILL, không ghi cứng trong mã); bản gom không phải tệp git theo dõi → thoát 2 «bản gom phải là tệp có trong git», cùng tệp sau commit thì chạy được.
- AC-7: Given kho thử có tín hiệu ở mọi chỗ {chưa gom · lẻ · đã phủ · nhóm chưa cắt · nhóm ở chân trời · nhóm → hàng chưa có hồ sơ · nhóm → hàng có hồ sơ}, When chạy `--duong`, Then mỗi bản ghi có `cho` và câu `cau` đúng bằng bảng viết sẵn trong ca; trạng thái hàng trong câu bằng trạng thái của chính hàng ấy trong khối dữ liệu lộ trình vẽ từ cùng kho; `--id <id>` ra đúng một bản ghi; id không có → thoát 1 nêu id; hàng phủ cùng mã nhóm nhưng thuộc đợt khác KHÔNG được nối — tín hiệu vẫn «vào nhóm, chưa thành việc».
- AC-8: Given kho khai cửa tín hiệu, When vẽ trang lộ trình, Then khối `lo-trinh-du-lieu` mang khoá gốc `tin_hieu` bằng đúng mảng `--duong` của cùng kho, vẽ hai lần ra cùng byte; bản chép rời của `docDuLieu` đọc trang có khoá thì giữ nguyên mảng (khoá tuỳ chọn, bảng khoá chuẩn `KHUON_DU_LIEU` không đổi) và cảnh báo giống hệt trang cùng kho không khoá; khối khoá tuỳ chọn trong `skills/acceptance/references/lo-trinh-du-lieu.md` khớp đúng các trường bản ghi đường đi của mã.
- AC-9: Given `skills/gom-tin-hieu/SKILL.md`, When chạy NGUYÊN VĂN ba khối lệnh `GOM-CHUA-GOM`, `GOM-RANG`, `GOM-DUONG` trên kho thử (thay ô `<…>`, gốc gói như harness thay), Then ba lệnh chạy được và ra đúng mã thoát của ca xanh và ca đỏ; SKILL mang khối `GOM-TRUC` giá trị `ket-qua`, nêu ba ngăn (nhóm · lẻ có lý do · đã phủ), thứ tự «gom → commit → răng xanh → chuyển cắt lượt», và không có câu nào bảo kit giữ kho tín hiệu hay ghi trạng thái vào tệp ý định.
- AC-10: Given bộ vàng — 20 tín hiệu giả có nhãn do `rang/sinh-bo-vang.mjs` sinh từ 10 hồ sơ crm có «Hạng mục cùng lớp» (`origin/onehub` `27d47de04`), hai tín hiệu mỗi hồ sơ, trên kho thử dựng trạng thái hồ sơ đúng như crm lúc `be1324ba1` (09/10 18:00: 4 hồ sơ đã giao), đáp án chỉ ở `mau/bo-vang.json` commit trước — và bản gom `mau/gom-bo-vang.md` do một tác tử tươi chỉ cầm SKILL, khuôn và kho thử viết ra, When chạy lệnh chấm `rang/cham-bo-vang.mjs`, Then răng xanh; 10/10 cặp trùng ở chung một chỗ; 8 tín hiệu của 4 hồ sơ đã giao ra «đã phủ» đúng hồ sơ; 12 tín hiệu còn lại ở nhóm; và kho thử đưa cho tác tử KÍN ĐÁP ÁN — không tệp tín hiệu nào chứa slug hồ sơ, không tiêu đề nào trùng nguyên văn một câu giao, `bo-vang.json` vắng mặt; 20 mục của `bo-vang.json` khớp đúng 20 tệp tín hiệu đọc bằng bộ đọc thật; cùng lệnh chấm chạy được trên một bộ vàng thứ hai do mã sinh.
- AC-11: Given SKILL gom, `mau/bo-vang.json` (bốn cụm «cùng lớp» viết tay của crm) và `mau/gom-bo-vang.md`, When hội đồng đọc, Then mỗi nhóm là một điều một vai muốn làm được, tên mở bằng vai, bằng tiếng sản phẩm mà người gửi không dùng git nhận ra ý mình; nhóm không gộp hai kết quả khác nhau chỉ vì cùng cơ chế mã; và cách nhóm đặt các tín hiệu của bốn cụm viết tay giải thích được bằng trục kết quả. (judgment)

## Coverage

Quét bằng `morphological-scan` (preset test-matrix; đối tượng = tín hiệu × bản gom × đường đi × kho). Chân
sản phẩm: kênh yêu cầu thật của Điều phối (374 tệp, 9 loại) `[SUY-TỪ-REPO: tests/dieu-phoi/fixtures/dot-crm-0910/yeu-cau]`,
khuôn §4.9 `[SUY-TỪ-REPO: docs/superpowers/specs/2026-10-05-orchestrator-workers-hai-tang-design.md]`, khuôn
bản phạm vi và răng L2 `[SUY-TỪ-REPO: scripts/cat-luot.mjs]`, gom tay crm `[SUY-TỪ-REPO: _acceptance/cua-tin-hieu-gom-nhom/opportunity.md]`.
Chân ngành: `[NGÀNH: Canny — gộp bài trùng, đổi trạng thái báo người đã gửi]` · `[NGÀNH: Productboard —
hộp ghi chú chưa xử lý, nối ghi chú vào tính năng có trạng thái]` — ba món bắt buộc của loại sản phẩm này:
hộp chưa xử lý, gộp trùng, trạng thái trả về người gửi.

- Trục A — nguồn & khuôn: tín hiệu người đúng khuôn | phát sinh của thợ (viec-phu, hang-moi) | yêu cầu vận hành (ngoài khuôn) | tệp sai khuôn | kho không khai  [thước CE: 374 yêu cầu thật + khuôn §4.9] → AC-1, AC-2
- Trục B — chỗ của một tín hiệu: một nhóm | lẻ có lý do | lẻ thiếu lý do | đã phủ hồ sơ đã giao | đã phủ hồ sơ chưa giao / không có | hai chỗ (cùng tệp · hai tệp) | không chỗ | sau mốc `den` | tín hiệu lạ  [thước CE: luật «mỗi mã ở đúng một chỗ» của L2; Canny gộp trùng] → AC-4, AC-5, AC-10
- Trục C — bản gom như vật: đúng khuôn và trục | trục vắng/khác | ngoài git | đọc bằng bộ đọc cắt lượt | tên nhóm theo trục A  [thước CE: khuôn PHAM-VI-MA + chính sách trục của Cổng Đáng] → AC-3, AC-6, AC-9, AC-11
- Trục D — đường đi về người gửi: chưa gom | lẻ | đã phủ | nhóm chưa cắt | chân trời | hàng chưa hồ sơ | hàng có hồ sơ | khối dữ liệu (khai / không khai)  [thước CE: Canny / Productboard trạng thái trả về] → AC-7, AC-8, AC-2
- Cross-cutting: chỉ đọc · tất định (hai lần cùng byte) · tiếng Việt có dấu trong tên nhóm và tiêu đề → AC-4, AC-8, AC-10
- Later: trục B (gốc vấn đề) và C (màn) · mục «Tín hiệu» nhìn thấy trên trang lộ trình · bộ vàng thứ hai từ góp ý phòng ban thật (sau đợt 14/10 của crm).
- Never: kit giữ kho tín hiệu · gom bằng mô hình trong mã · đếm người bầu / xếp ưu tiên tự động · kit gửi tin cho người gửi.

## Đường đo

- Chủ kho sửa dưới 1/5 số nhóm máy đề xuất · số từ: git crm — commit ĐẦU TIÊN của tệp bản gom mà trên đó `--rang` thoát 0 (máy dò bằng cách chạy răng trên từng commit; lượt máy sửa cho răng xanh không tính) so commit gộp PR, đếm nhóm đổi tên, tách, gộp hay chuyển tín hiệu · không AC (đo ở kho tiêu thụ, đọc ở Cổng Giá trị).
- 0 tín hiệu lọt · số từ: `tin-hieu.mjs --rang` trên lượt gom của crm · AC-4.
- Mọi cặp trùng đã biết chung một chỗ · số từ: `rang/cham-bo-vang.mjs --root <crm> --bo-vang <tệp> --gom <thư mục>` trên bộ vàng crm — lệnh tự kiểm `bo-vang.json` commit TRƯỚC bản gom · AC-10 (vật), đọc ở Cổng Giá trị.
- Người gửi thấy tín hiệu đi tới đâu · số từ: khoá `tin_hieu` trong khối dữ liệu lộ trình của crm · AC-7, AC-8.

## Out of scope

- Nút «Gửi tín hiệu» trong CRM, nơi crm cất tín hiệu, xuất tín hiệu ra thư mục — hàng LT2 và việc của crm.
- Sửa `dieu-phoi/` hay thêm dòng vào bảng loại §4.9; sửa `scripts/cat-luot.mjs`.
- Trục gom B, C hay trục theo từng kho; mục «Tín hiệu» nhìn thấy trên `LO-TRINH.html`.
- Đếm người bầu, xếp ưu tiên theo số tín hiệu; kit gửi tin báo cho người gửi.
- Kit tự khai cửa tín hiệu cho hạt giống của chính nó.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ca đo: `tests/scripts/tin-hieu.test.mjs` (mã ca `TH-…`), executor mới `executors.test.tin_hieu` thêm ở S3
  (tiền lệ DP3, DP7). Kho thử do mã sinh trong lượt; tín hiệu và bản gom thử sinh từ khối mẫu rút từ khuôn.
- Ràng buộc quy trình, kiểm ở diff của PR chứ không thành ca đo thường trực (ca «vòng này không đụng X» neo
  merge-base sống thành lệnh cấm vĩnh viễn — bài học #307): diff của vòng không chạm `dieu-phoi/**` và
  `scripts/cat-luot.mjs`.
- Vào S3 sau khi DP4 (máy M5) lên main — lời giao 11/10.
