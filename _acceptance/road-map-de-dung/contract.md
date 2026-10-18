---
schema_version: 1
feature: Road-map dễ dùng — cắt lượt theo luật 17/10 (không mốc ngoài; việc vận hành ra khỏi kho, không vào bản phạm vi), khối Mốc của trang đọc bằng tên tiếng sản phẩm kèm trạng thái, luật «chỉ việc phát triển» kiểm trên mọi lần đọc tệp, ngày dự kiến nối tiếp theo làn
slug: road-map-de-dung
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/cat-luot.mjs + scripts/lo-trinh.mjs + scripts/gio-may.mjs + skills/cat-luot/SKILL.md + hai khuôn lộ trình + CONTEXT.md + ADR + ca đo — không chạm lib/**, hooks/**, lưới trước-merge
surfaces: [ui, cli]
design_doc: docs/superpowers/specs/2026-10-17-road-map-de-dung-design.md
status: signed-off
approved_by: Manh Phan
approved_at: 2026-10-17T13:28:03Z
---

# Acceptance Contract: road-map-de-dung

## Context

Vòng RD1 (chủ kho giao 17/10, phiên điều phối MacBook Pro; chính sách «ship nhanh mà vẫn tin được»). Bốn phần trong vòng:
A TRỪ — bỏ mốc ngoài (chủ kho 17/10 «bỏ mốc ngoài», thay vế «vận hành → mốc ngoài» của luật S3b 11/10, hồ sơ
`lo-trinh-chi-viec-phat-trien`); B sửa lỗi — khối Mốc của trang đọc được trong một phút; C sửa lỗi — luật «chỉ việc phát
triển» chạy trên mọi lần đọc tệp, không chỉ lúc cắt lượt (crm #465, #466) + hạt giống «rà soát không xét mốc qua ngày»;
D sửa lỗi — hạt giống «giờ máy theo mốc không xếp nối tiếp». Phần E (ba việc CỘNG) tách sang vòng RD2 — design §3. Bổ sung 17/10 (chủ kho, qua điều phối): «Lộ trình CRM và lộ trình của phiên đọc cùng một nguồn; khi Lộ trình CRM đọc đúng thì phiên cũng phải đồng nhất» → AC-11, một mô hình hiển thị chung trong khối dữ liệu.

Số đo nền (design §2): crm `onehub` b74ec7eae có 17/28 mốc OKR là mốc ngoài, 11/17 hàng Kho tài liệu thiếu `ten_ngan`; khối
Mốc của trang kit in mã trần; năm mốc độc lập cùng «bắt đầu ~17/10».

Kho thử trong mọi ca do code sinh trong lượt (thư mục tạm, `git init`, commit ghim ngày, «hôm nay» ghim bằng
`ACCEPTANCE_TODAY`). Bản chụp crm do `tests/scripts/lo-trinh-chup-crm.mjs` chụp ba tệp lộ trình `onehub` b74ec7eae vào
`tests/scripts/fixtures/lo-trinh/crm-onehub-1017/`. **Bộ máy cũ** = `git archive v2.32.0 scripts lib skills` (trọn thư mục).

## Criteria

- AC-1: Given bản phạm vi một đợt (chỉ mã việc phát triển) và lộ trình, When chạy răng cắt lượt, Then bảng phủ chỉ còn hai chỗ — hàng · Chờ điều kiện — và mỗi mốc `loai: "ngoai"` của đợt đang cắt cho đúng một dòng `lỗi: mốc <nhãn> [moc-ngoai-da-bo]: …` nêu bốn chỗ đến của luật 17/10 (ngày của mốc phát triển bị ràng buộc · ngưỡng + ngày đọc trong ô cơ hội · ra khỏi kho = không chép vào bản phạm vi, liệt «Ra khỏi kho» ở mô tả PR · Chờ điều kiện + `mo_lai_khi`), mã nó mang không tính phủ; trên ma trận viết sẵn {mã chỉ ở mốc ngoài · mã ở mốc ngoài và ở một hàng · mã chỉ ở `da_bac` · mốc ngoài ngoài đợt · hàng `dung_tren` mốc ngoài · mốc `phat-hanh` mang `phu` · đợt chỉ có mốc ngoài} mỗi ca ra đúng mã thoát và đúng dòng ghim (mã chỉ ở mốc ngoài hay chỉ ở `da_bac` → «không ở hàng hay mục chờ điều kiện nào»; mốc ngoài ngoài đợt → một dòng gom `cảnh báo: [moc-ngoai-da-bo] <k> mốc ngoài đợt`, thoát không đổi; đợt chỉ có mốc ngoài → «đợt chưa cắt»); cờ `van-hanh-lap-chua-tu-phuc-vu` và các luật `ai`/`lap`/`tu_phuc_vu` của mốc ngoài không còn; số ca đo == số phần tử ma trận (in ra).
- AC-3: Given `skills/cat-luot/SKILL.md`, khuôn `lo-trinh-template.json`, bản phạm vi mẫu `pham-vi-template.md`, `CONTEXT.md` và ADR mới trong `docs/adr/`, When đọc các khối máy-đọc và chạy NGUYÊN VĂN khối lệnh răng `CAT-LUOT-RANG` trên đợt mẫu, Then khối `CAT-LUOT-VAN-HANH` nêu đủ bốn chỗ đến (sự kiện tạo hạn → `ngay` của mốc phát triển · đo giá trị → `opportunity.md` + lệnh `observed` · vận hành thuần → không chép vào bản phạm vi, liệt «Ra khỏi kho» ở mô tả PR · việc cần kết quả vận hành → `chan_troi` + `mo_lai_khi`) và không còn dạy tạo mốc `loai: ngoai`; bước 1 dặn chỉ chép mã việc phát triển vào bản phạm vi; bảng cờ `CAT-LUOT-BANG-CO` có đúng tập tên bằng danh sách cờ xuất khẩu; khuôn lộ trình có 0 mốc `loai: ngoai`; bản phạm vi mẫu không còn mã việc vận hành; răng trên đợt mẫu ra 0 lỗi, 0 cảnh báo; mục «Mốc ngoài» của `CONTEXT.md` ghi đã bỏ và trỏ ADR; ADR nêu đánh đổi «mất chỗ chung xem ngày của người» và «răng không bắt được việc vận hành bị quên».
- AC-4: Given chỉ SKILL `cat-luot`, khuôn lộ trình, đầu vào mẫu `_acceptance/road-map-de-dung/mau/dau-vao-crm.md` (văn bản tự do dựng từ việc thật của lộ trình crm `onehub`: việc phát triển, sự kiện tạo hạn, đo giá trị, vận hành thuần, việc cần kết quả vận hành, vận hành lặp lại) và đáp án viết trước `mau/dap-an.json` (mục nào vào bản phạm vi và đứng ở đâu · mục nào ra khỏi kho · mốc nào nhận hạn) — đáp án đi qua răng cắt lượt với thoát 0, 0 dòng `lỗi:`, và mọi mục đầu vào ở đúng một trong hai: bản phạm vi hoặc danh sách «Ra khỏi kho» (ca máy) — When một giám khảo đối chiếu SKILL với đáp án, Then với TỪNG mục đầu vào giám khảo chỉ ra bước hoặc khối của SKILL buộc phiên cắt xử lý mục ấy đúng như đáp án, và mục nào SKILL im lặng, nước đôi, hay dẫn tới một mốc ngoài thì FAIL. (judgment)
- AC-5: Given trang vẽ từ bản chụp crm `onehub` và từ kho thử năm trạng thái, When một bộ đọc máy rút CHỮ NHÌN THẤY của khối Mốc (bỏ thẻ, bỏ thuộc tính, bỏ nội dung `<details>` đang đóng), Then với MỖI mốc còn việc chưa giao, chữ của mốc ấy có «còn k/n việc» đúng số và mỗi việc chưa giao một dòng mang tên hiển thị của khối (`ten_hien_thi` — chủ kho chốt ở Cổng Phạm vi 17/10: câu giao đầy đủ bỏ ngoặc «», việc không có câu giao thì `ten_ngan` → `ten`) kèm chữ trạng thái của bảng việc, mã đứng SAU tên; mở `<details>` của dòng thấy tên hồ sơ khi có; đáp án do code tính từ tệp, số ô đã so == tổng tính từ tệp (in ra); bộ máy cũ trên cùng bản chụp → FAIL nêu tên ≥ 1 mốc; và khối Rà soát (bản xem chữ, thẻ khởi động) có ĐÚNG một dòng gom «<k> việc chưa có tên ngắn — tên phiên đang rút gọn tên việc: …» với k == số hàng thiếu `ten_ngan` ở kho đã dùng tên ngắn (Kho tài liệu 11, OKR không dòng nào, kho chưa từng dùng tên ngắn không dòng nào), dòng ấy không lên trang.
- AC-6: Given trang mới vẽ từ kho thử năm trạng thái, When đo trên Chrome thật ở khổ 1280 và 375, sáng và tối, Then mỗi `<summary>` dòng việc có vùng chạm ≥ 44px, tương phản chữ tên và chữ trạng thái ≥ 4,5 : 1, không cuộn ngang ở 375, và chiều cao trang ≤ 0,4 trang bộ máy 2.21.0 cùng kho (thước LTT-san — chủ kho nới từ 1/3 lên 0,4 ngày 17/10 để khối Mốc liệt đủ câu giao); chiều đỏ: bản sao bỏ chiều cao tối thiểu của `<summary>` → ca đỏ nêu thước vùng chạm.
- AC-7: Given chữ khối Mốc của trang mới vẽ từ bản chụp crm `onehub` (xuất bằng code vào `mau/trang-moi.txt`) và ba câu «mốc X còn làm những gì, xong chưa» cho ba mốc còn việc nhiều nhất (code chọn và soạn `mau/cau-hoi-trang.md` + `mau/dap-an-trang.json`; ca máy vẽ lại trong lượt và so từng byte với ba tệp đã commit — lệch thì FAIL «tệp mẫu cũ»), When một giám khảo chỉ đọc tệp chữ ấy (không đọc tệp lộ trình, không biết mã), Then giám khảo trả lời được từng câu bằng tên việc và trạng thái khớp đáp án `mau/dap-an-trang.json` (do code tính từ tệp), và đánh giá được một người không biết mã hiểu mốc còn gì trong một phút. (judgment)
- AC-8: Given tệp lộ trình bị sửa tay ngoài lượt cắt, When bất kỳ mặt nào đọc tệp (trang, bản xem chữ, thẻ khởi động) qua bộ đọc chung, Then trên ma trận viết sẵn {mốc `loai: "ngoai"` (dòng nêu tên mốc và bốn chỗ đến của luật 17/10) · mốc không khai `loai` · `dung_tren` trỏ `ma` một mốc · trỏ `ten` một mốc · `du_lieu` sai giá trị · `du_lieu: gia` không đứng trên hàng `sinh-gia`} mỗi ca cho đúng một dòng cờ có tên ở cả ba mặt (cùng chữ, một nguồn), mã thoát không đổi; bản chụp crm `onehub` 55811c635^ (bốn mốc người không `loai` giữ hàng) → dòng `moc-chua-khai-loai` nêu đúng bốn mốc ấy; bản chụp `onehub` b74ec7eae → dòng mốc ngoài nêu đúng 17 mốc OKR và 1 mốc Kho tài liệu (tính từ tệp); đối chứng im: tệp sạch → không dòng nào của sáu cờ.
- AC-9: Given lộ trình có mốc đã qua ngày, When chạy rà soát (bản xem chữ, `--ra-soat`, thẻ khởi động), Then trên ma trận {loại `phat-hanh` · `han-cung` · `su-kien`} × {đã qua · chưa tới} × {có `that` · không} × {không hàng · mọi hàng đã giao · còn hàng chưa giao} đúng các ô «đã qua · không `that` · (không hàng hoặc mọi hàng đã giao)» vào MỘT dòng gom «<k> mốc đã qua ngày, chưa ghi ngày khép: <tên dd/mm…>» (tối đa 5 tên rồi «…»), các ô khác không mang dòng gom; với các ô «còn hàng chưa giao» đầu ra rà soát BẰNG bộ máy cũ trên cùng ô (vi phân); số ô kỳ vọng viết sẵn đủ 36; trang không mang chuỗi «mốc đã qua ngày, chưa ghi ngày khép» (vẽ ở hai ngày «hôm nay» cho hai tập mốc qua ngày khác nhau, giống từng byte); trên bản chụp crm `onehub` mỗi mốc đã qua ngày chưa khép rơi vào ĐÚNG một trong hai dòng (cờ mốc ngoài của AC-8 hoặc gom AC-9) — tập rỗng là FAIL.
- AC-10: Given lộ trình có nhiều mốc còn việc, When tính «Giờ máy theo mốc», Then mốc sắp theo `ngay` (mốc không ngày đứng cuối) và `bắt đầu` của mốc k == max(hôm nay, `hoàn tất` mốc k−1, ràng buộc `dung_tren` sẵn có); ca hai mốc độc lập M1 (mục tiêu D), M2 (D+5) → bắt đầu M2 == hoàn tất M1; một mốc duy nhất → dòng bằng bộ máy cũ trừ nhãn «(máy chạy 24/24 — chưa đo nhịp ngày)»; hai lộ trình cùng kho tính riêng; chiều đỏ: bản sao giữ `batDau = hôm nay` → ca đỏ nêu M2; và trên năm kho (kit `docs/plans/lo-trinh-kit.json` · ba tệp crm `onehub` · `oneflow.json` · kho không khai `lo_trinh`) mọi đầu ra của bộ máy mới khác bộ máy cũ CHỈ ở các dòng thuộc tập khác biệt tính độc lập từ dữ liệu của kho (tên trước mã · tên ngắn thiếu · sáu cờ AC-8 · dòng AC-9 · ngày AC-10 · khoá mới AC-11), in kỳ vọng và thực tế từng kho; kho không khai `lo_trinh` → không đổi một byte.
- AC-11: Given một lộ trình có mốc gắn việc, mốc không gắn việc, mốc ngoài, việc thuộc hai mốc, việc không thuộc mốc nào, việc có và thiếu `ten_ngan`, When vẽ trang và chạy bản xem chữ, Then khối dữ liệu mang `hang[].ten_hien_thi`, `moc[].viec_hien` (việc thuộc mốc ĐẦU TIÊN liệt nó), `moc[].hien` (= có việc hiện, mọi loại mốc kể cả mốc ngoài), `moc[].con_lai` và `chua_hen_moc` đúng kỳ vọng viết sẵn; tập (mốc hiện, việc chưa giao, tên, trạng thái, số chưa hẹn mốc) rút từ chữ nhìn thấy của trang BẰNG tập rút từ khối dữ liệu BẰNG tập rút từ khối «Mốc» của bản xem chữ, trên kho thử và trên bản chụp crm `onehub`; bộ đọc mẫu `docDuLieu` đọc trang vẽ bằng bộ máy cũ ra các khoá mới rỗng/`null` kèm đúng một cờ vàng «khối chưa mang mô hình hiển thị»; chiều đỏ: bản sao trang tự lọc lại mốc theo luật riêng (vẽ mốc không có việc) → FAIL ghim «trang lệch khối», bản sao bản xem chữ dùng câu giao thay tên hiển thị → FAIL ghim «bản xem lệch khối».

## Coverage

Quét bằng `morphological-scan` (preset test-matrix, trục tự dựng; đối tượng = một mục của tệp lộ trình × mặt đọc × trạng thái
tệp × kho). Chân sản phẩm: luật chủ kho 17/10 `[SUY-TỪ-REPO: docs/plans/2026-10-17-hat-giong-ra-soat-khong-xet-moc-qua-ngay.md]`
· luật S3b `[SUY-TỪ-REPO: _acceptance/lo-trinh-chi-viec-phat-trien/contract.md]` · bộ vẽ `[SUY-TỪ-REPO: scripts/lo-trinh.mjs]` ·
giờ máy `[SUY-TỪ-REPO: scripts/gio-may.mjs]` · số đo crm `[SUY-TỪ-REPO: docs/superpowers/specs/2026-10-17-road-map-de-dung-design.md]`.
Chân ngành: `[NGÀNH: Linear — Projects/Roadmap hiện tiêu đề việc, mã định danh là chữ phụ]` (tên trước mã) · `[NGÀNH: Jira
Advanced Roadmaps — dòng việc hiện summary, key là phụ]` · `[NGÀNH: Microsoft Project — resource leveling xếp việc cùng nguồn lực
nối tiếp]` (giờ máy nối tiếp theo làn) · `[NGÀNH: Shape Up (Basecamp) — chu kỳ chỉ nhận việc dựng]` (chỉ việc phát triển).

- Trục A — loại mục: mốc `phat-hanh` | `han`/`han-cung` | `su-kien` | `ngoai` | không `loai` | hàng có/thiếu `ten_ngan`   [thước CE: luật 17/10 + khuôn lộ trình + ba tệp crm thật] → AC-1, AC-5, AC-8, AC-9, AC-11
- Trục B — mặt đọc: răng cắt lượt | trang | khối dữ liệu | bản xem chữ (Rà soát, Giờ máy) | thẻ khởi động | SKILL (người cắt) | trang Lộ trình trong sản phẩm crm (qua khối)  [thước CE: bảng nơi chạy của report khảo sát + design §4.3 + luật trang crm `apps/app/components/lo-trinh/viec.ts`] → AC-1, AC-3, AC-4, AC-5, AC-8, AC-9, AC-10, AC-11
- Trục C — trạng thái tệp: sạch | còn mốc ngoài | thiếu tên ngắn | sửa tay đi vòng răng | nhiều mốc mở | mốc qua ngày  [thước CE: crm #465/#466 + hai hạt giống 17/10] → AC-5, AC-8, AC-9, AC-10
- Trục D — kho: kit | crm (ba lộ trình) | OneFlow (fixture) | kho không khai lộ trình  [thước CE: luật 26/09 + đo `~/dev/*` 17/10] → AC-10
- Người đọc (cross-cutting): người không biết mã đọc trang trong một phút, và thấy CÙNG một lộ trình ở trang kit, bản xem chữ và trang crm → AC-5, AC-6, AC-7, AC-11.
- Later: lệnh `/road-map:xem` đưa đường dẫn trang · Rà soát + Giờ máy lên trang · cài road-map khi kho khai lộ trình (vòng RD2, hạt giống) · giờ máy mỗi ngày đọc từ số đo vòng (vế 2 hạt giống giờ máy) · trang Lộ trình trong sản phẩm crm (việc của crm).
- Never: máy tự viết lại tệp lộ trình của kho (máy chỉ cờ) · răng đoán việc vận hành bằng nghĩa câu (blacklist trên không gian mở).

## Đường đo

Vòng không có `opportunity.md` (giao thẳng từ phiên điều phối) — bỏ đường đo bằng dòng sổ `descope` «bỏ đường-đo». Đồng hồ thật:
lần crm nhận mốc mang vòng này — số mốc ngoài còn lại trên trang crm và số hàng thiếu tên ngắn đọc từ chính trang crm vẽ lại.

## Out of scope

- Ba việc CỘNG của phần E (lệnh xem đưa đường dẫn trang · Rà soát + Giờ máy lên trang · cài road-map mặc định) — vòng RD2, hạt giống `docs/plans/2026-10-17-hat-giong-road-map-xem-trang-va-cai-goi.md`.
- Trang Lộ trình TRONG sản phẩm crm (LT1/LT1e) — việc của crm; ghi chú nhận nêu nguyên tắc tên-trước-mã.
- Cắt lại lộ trình đã có theo luật mới (crm khi nhận mốc; lộ trình của kit do điều phối) — chủ kho 17/10: lộ trình cắt trước luật là đồ cũ, cắt lại bằng skill mới là xong; máy không sửa tệp lộ trình của kho.
- Đường đọc riêng cho mốc ngoài cũ (ẩn trên trang, chỗ «Không làm trong kho») — chủ kho chọn ở Cổng Phạm vi 17/10: mốc ngoài hiện như mọi mốc (chỉ khi có việc gắn, luật AC-11) kèm cờ AC-8; nợ cũ dọn bằng cắt lại.
- Giờ máy mỗi ngày đo từ vòng đã giao (thay 24/24) — chỉ gắn nhãn ở vòng này.
- Hook hay cổng mới chặn sửa tệp lộ trình — luật hiện qua bộ đọc chung + `product-map --check` sẵn có trong CI.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ghi chú nhận cho crm (đi vào CHANGELOG của mốc): trang Lộ trình trong sản phẩm đọc `ten_hien_thi`, `moc[].hien`/`viec_hien`/`con_lai`,
  `chua_hen_moc` thay vì tự lọc, và thêm một ca đối chiếu trang crm với tập hiển thị của khối (crm tự làm khi nhận).
- Ca đo: `tests/scripts/road-map-de-dung.test.mjs` (ca `RD-<n>`), khoá `executors.test.road_map_de_dung`; ca Chrome AC-6 thêm
  vào `tests/scripts/xem-trang-lo-trinh.test.mjs` (`LTT-ten-*`, khoá `lo_trinh_trang` sẵn có).
- **Con trỏ thay thế (hồ sơ đã ký — KHÔNG sửa hợp đồng của chúng):** AC-1/AC-3 hồ sơ này thay các vế về mốc ngoài của
  `lo-trinh-chi-viec-phat-trien` (AC-1, AC-4, AC-7, AC-10; ca LT-163, LT-166, LT-169, LT-171) và của `vong-la-mot-ket-qua` AC-9
  (ca LT-150 qua con trỏ của S3b); AC-10 hồ sơ này thay vế «bắt đầu = hôm nay khi không `dung_tren` chéo mốc» của
  `lo-trinh-gio-may` AC-4; AC-5 hồ sơ này thay vế «khối Mốc liệt mã» nếu ca LTT-moc / LT-94 ghim chữ ấy. Eval bị thay mang
  `superseded_by: road-map-de-dung#AC-<n>` ở chiến dịch ghim lại của mốc phát hành. AC-6 hồ sơ này thay vế «trang ≤ 1/3 bản 2.21.0»
  của `trang-lo-trinh-doc-mot-phut` (ca LTT-san) bằng «≤ 0,4» — chủ kho chốt 17/10 (sổ dòng gate1).
- **Ca đã ký đổi GỐC SO, không đổi lời hứa** (lời hứa gốc «phần còn lại giống bộ máy đời trước» giữ nguyên nghĩa): LT-77,
  LT-94, LT-111 (kho-thu, crm-okr, bốn ca -do), LT-112, LT-141 so trên cây tắt đúng các khối RD1 (`tests/scripts/tat-rd1.mjs`,
  tự kiểm bằng ca RD-tat); LT-72 đếm cờ đời trước (lọc năm cờ của luật chỉ việc phát triển); LT-17 thêm `loai` vào đồ thử
  viết tay; LT-79 thêm dòng `  ! … chưa khai loại` vào kỳ vọng thẻ (đổi có chủ ý, AC-4); LT-110 thêm năm khoá mô hình hiển
  thị vào bảng viết sẵn (AC-11); LT-157-do nhát tiêm theo dòng NUL mới; khối START-SCAN-KEYS khai `loTrinh.ds[].raSoatCanh`
  (khoá có từ RM1, nay đồ thử LT-09 chạm tới vì dòng tên ngắn của AC-5 nằm ở khối Rà soát).
  Sau gộp VA2 (`ve-lo-trinh-doc-tin-hieu-cua-cay`): ca VT-4 / VT-4-do «kho không có sự cố vẽ giống từng byte bộ máy gốc»
  so trên cùng cây tắt RD1.
  Sau chữ ký (CI của PR #381): đồ thử `khoCoLoTrinh` của bộ ca điều phối (ca DP2-11 khong-dot «không đợt thì thẻ khởi động
  như bản nhánh chính») khai `loai: han` cho mốc — đồ thử theo khuôn mới; bộ ca này không nằm trong các bộ ca của lượt chấm
  nên chỉ CI thấy (hạt giống `docs/plans/2026-10-18-hat-giong-bo-ca-dieu-phoi-ngoai-luot-cham.md`).
- Cân trên mọi kho (đếm 18/10 trên tệp thật): kit (origin/main) — 1 cờ «3 mốc là việc của người» + dòng Rà soát «39 việc
  chưa có tên ngắn»; crm OKR (origin/onehub b22c0a329) — 0 cờ, 0 dòng; crm kho tài liệu — 0 cờ + dòng Rà soát «9 việc chưa
  có tên ngắn»; crm việc dự án — 0; oneflow — chưa khai lộ trình, không đổi.
- Known limits — chọn ở Cổng Bằng chứng 2026-10-18:
  - Ngoài-1: Ở phần giờ máy theo mốc của bản xem chữ, các dòng có thể xếp theo ngày chứ không theo thứ tự máy thật sự chạy khi có mốc phụ thuộc ngược ngày. Ngày ghi trên từng dòng vẫn đúng, nên người đọc chỉ thấy thứ tự hơi khác chứ không thấy số sai.
  - Ngoài-2: Hai phép thử phụ mới thêm vào lượt sửa chạy được và đang đạt, nhưng bộ chấm chưa ghi tên chúng vào danh sách bắt buộc phải có. Nếu sau này ai đó lỡ gỡ chúng đi, bộ chấm vẫn báo xanh dù một phần kiểm tra đã mất.
  - Ngoài-3: Khi có ba mốc mà mốc gần hạn nhất phụ thuộc vào một mốc xa hạn, trang và bản xem có thể báo «quá tải» sai cho mốc gần hạn nhất và ghi ngày bắt đầu muộn hơn thực tế. Có cách xếp khác kịp hạn, nhưng người xem sẽ tưởng mốc đó không kịp.
  - Ngoài-4: Phép kiểm trên năm kho thật chưa đối chiếu giá trị của năm trường mới trong dữ liệu hiển thị, nên nếu số việc còn lại hay việc gắn vào mốc bị sai ở kho thật thì phép kiểm này vẫn xanh. Các phép kiểm khác trên kho thử và bản chụp crm vẫn đang canh phần này.
  - Ngoài-5: Người đọc hồ sơ làm theo chỉ dẫn sẽ chạy nhầm công cụ chụp dữ liệu và không dựng lại được bản chụp của vòng này. Sản phẩm chạy đúng, chỉ có tài liệu hướng dẫn sai tên.
  - Ngoài-6: Khi lộ trình có một mục phụ thuộc bị để trống, hệ thống cảnh báo nhầm rằng việc đó đứng trên một mốc thật và nuốt mất cảnh báo đúng là mục phụ thuộc không có mã. Người đọc có thể bị chỉ sai chỗ cần sửa.
  - Ngoài-7: Với trang lộ trình vẽ từ rất sớm, người đọc thấy hai dòng cảnh báo cùng bảo vẽ lại trang, trong khi tài liệu hứa đúng một dòng. Chỉ gây rườm, không làm sai nội dung.
  - Ngoài-8: Cùng một luật kiểm dữ liệu giả được viết ở hai nơi, nên sau này sửa một nơi mà quên nơi kia thì lúc cắt lượt và lúc đọc có thể báo khác nhau. Hiện chưa có người dùng nào gặp sai lệch cụ thể.
  - Ngoài-9: Khi một việc được liệt ở nhiều mốc, giờ máy của việc đó bị cộng lại ở mỗi mốc nên ngày dự kiến của các mốc sau bị đẩy muộn hơn thực tế. Người đọc có thể thấy ngày giao dự kiến xa hơn mức cần.
  - Ngoài-10: Dòng tiêu đề khối Mốc nói một số mốc là chưa gắn việc nào, nhưng thực ra có mốc đã gắn việc mà việc đó đã hiện ở mốc trước. Người đọc hiểu nhầm lý do mốc bị ẩn.
  - Ngoài-11: Khi một việc nằm ở cả mốc chưa có ngày và mốc có ngày, trang hiện việc đó dưới mốc chưa có ngày, ngược với cách tính giờ máy. Người đọc thấy việc nhóm khác nơi ngày dự kiến tính.
  - Ngoài-12: Ca kiểm chiều đỏ của luật bỏ mốc ngoài có thể vẫn báo đúng dù lỗi xảy ra ở chỗ khác, nên khó tin hoàn toàn rằng nó bắt đúng chỗ. Người dùng sản phẩm không bị ảnh hưởng trực tiếp.
  - Ngoài-13: Ca kiểm chiều đỏ của dòng gom mốc đã qua ngày ghim vào tên ô do chính ca tự đặt, nên chưa chứng minh được nó bắt đúng lỗi báo nhầm mốc đã khép. Người dùng không thấy khác biệt nào.
  - Ngoài-14: Ca kiểm không loại trừ được việc hệ thống báo thêm lỗi sai bên cạnh lỗi mốc ngoài, nên một lỗi báo thừa có thể lọt qua. Người dùng có thể thấy thêm một dòng lỗi không đáng có ở ca hiếm.
  - Ngoài-15: Chưa có phép đo nào kiểm rằng khi mở một dòng việc thì thấy tên hồ sơ; nếu chỗ này hỏng thì không ai biết qua bộ kiểm. Người dùng có thể mở dòng ra mà không thấy tên hồ sơ.
  - Ngoài-16: Phép kiểm rằng hướng dẫn cắt lượt không dạy tạo mốc ngoài chỉ bắt hai cách viết cố định, nên nếu sau này ai dạy bằng câu chữ khác thì không bị phát hiện. Hiện hướng dẫn chưa sai.
