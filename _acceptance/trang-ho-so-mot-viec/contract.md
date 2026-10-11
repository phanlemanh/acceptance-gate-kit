---
schema_version: 1
feature: Mỗi việc đã giao có một trang hồ sơ đọc trong một phút — vì sao làm, hứa gì, quyết gì, tốn gì, giao gì, có ăn thua không — vẽ từ vật của hồ sơ, và bản chiếu lộ trình nhận cùng dải tóm tắt qua khối dữ liệu bản 2
slug: trang-ho-so-mot-viec
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/evidence-page.js + scripts/lo-trinh.mjs + scripts/ho-so-tom-tat.cjs (mới) + tài liệu + khuôn mẫu hàng + test — không chạm lib/**, hook, lưới trước-merge
surfaces: [cli, ui]
design_doc: docs/superpowers/specs/2026-10-11-trang-ho-so-mot-viec-design.md
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-10T23:56:04Z
---

# Acceptance Contract: trang-ho-so-mot-viec

## Context

Cổng Đáng 11/10 ký build hàng X2 (CỘNG, owner phê). Một hồ sơ đã giao chỉ máy đọc được; trang bằng
chứng hiện có chỉ trả lời «đã chấm ra sao». Vòng này dựng một mô-đun đọc hồ sơ dùng chung
(`scripts/ho-so-tom-tat.cjs`), mở rộng trang bằng chứng thành trang hồ sơ (dải một phút + mục gập),
đưa cùng dải vào khối dữ liệu lộ trình bản 2 (đọc được bản 1), và bỏ đúng một cặp «» bao ngoài câu
giao ở mọi chỗ kit in nó làm tiêu đề. Khuôn chín ô, luật người/máy và phương án bị loại: design doc.

Kho thử trong mọi ca do code sinh trong lượt (thư mục tạm, `git init`): một hồ sơ «đủ» có ô cơ hội với
ngưỡng, hợp đồng 3 AC + 2 mục Out of scope + 1 Known limit, sổ quyết định 6 dòng (3 máy · 1 người
`decided_by` · 1 `seal` · 1 `thuc-te`) + 1 dòng JSON hỏng, `usage-report.md` 3 khối (S3, S4 round 1,
S4 round 2), báo cáo bằng chứng đã ký, `uat-session.md`. Giá trị mong đợi của từng ô viết sẵn trong
ca lúc dựng kho thử, không rút từ đầu ra của bộ vẽ.

## Criteria

- AC-1: Given hồ sơ «đủ» của kho thử (ô cơ hội do chính lệnh `--mo-o` của kit ghi rồi thêm đoạn lý do, như phiên thật làm), When vẽ trang hồ sơ, Then đầu trang có dải chín ô theo đúng thứ tự `da_giao · vi_sao · trang_thai · ngay · production · do_gi · ket_qua · chua_lam · ai_quyet`, giá trị từng ô BẰNG giá trị viết sẵn trong ca, mỗi ô mang tên tệp nguồn của nó, chữ trạng thái BẰNG chữ của hàng cùng hồ sơ trên trang lộ trình vẽ cùng kho thử, ô `vi_sao` là đoạn lý do chứ không phải dòng neo `Gốc:` hay dòng «Mở từ hàng…» (cũng đúng trên ô cơ hội thật của chính hồ sơ này), và trang không có ô hay chữ «số lần gọi người».
- AC-2: Given hồ sơ «đủ», When vẽ trang hồ sơ, Then có các mục gập «Vì sao làm», «Đã hứa», «Thiết kế», «Giới hạn và ngoài hợp đồng»: «Đã hứa» liệt kê đúng mọi mã AC của hợp đồng kèm câu của nó (số dòng == số AC), «Giới hạn và ngoài hợp đồng» có đúng số mục Out of scope của hợp đồng + Known limits của báo cáo bằng chứng, nguyên văn, «Thiết kế» trỏ đúng `design_doc`.
- AC-3: Given sổ quyết định của hồ sơ «đủ» và bản sao do code dựng theo hình dạng sổ LT1 của crm (42 dòng, 26 máy · 16 người), When vẽ trang, Then mục «Quyết định» là dòng thời gian theo `at` tăng dần, mỗi dòng mang nhãn Máy/Người theo luật của design doc, số Máy/Người trên dải tầng chủ kho BẰNG số dòng mang nhãn đó (kho thử: 3/3; bản LT1: 26/16), dòng hỏng không hiện mà dải in «1 dòng sổ không đọc được», và nút lọc Máy/Người chỉ để lại đúng các dòng nhãn đó. Chiều đỏ: bản sao luật coi `seal` là máy → ca đỏ nêu id dòng seal.
- AC-4: Given hồ sơ «đủ», When vẽ trang, Then mục «Bằng chứng» chứa nguyên phần trang bằng chứng cũ (bảng eval, chi tiết từng eval, vòng verify) giống từng byte phần đó do bộ vẽ ở commit gốc của vòng sinh trên cùng hồ sơ; mục «Tài nguyên» có một dòng cho mỗi khối của `usage-report.md` (tên, số tác tử, out-token), số lượt chấm == số khối «S4 round» và tổng token == tổng các dòng (kho thử 2 lượt; bản LT1 3 lượt, 140.353).
- AC-5: Given hồ sơ «đủ» trong kho thử có commit gộp «Merge pull request #7» chứa mã đã chấm, When vẽ trang, Then mục «Giao» in mã đã chấm, ngày ký, người ký và «PR #7»; mục «Giá trị» đặt từng ngưỡng của ô cơ hội cạnh số đo của phiên nghiệm thu; ô `production` in sha 7 ký tự + ngày + người của dòng `thuc-te`. Và trên bản hồ sơ không có commit gộp, không `uat-session.md`, không dòng `thuc-te` thì ba chỗ đó in lần lượt «chưa gộp», «chưa đo», «chưa ghi quan sát production»; gốc hồ sơ không phải kho git, hoặc mã đã chấm không có trong kho, thì «Giao» in «chưa gộp», thoát 0, stderr rỗng.
- AC-6: Given ma trận hồ sơ thiếu đúng một tệp nguồn mỗi ca (ô cơ hội · sổ quyết định · `usage-report.md` · `design_doc` · `evals.yaml`; phiên nghiệm thu vắng là trạng thái thường, thuộc AC-5) cùng một hồ sơ có sổ đời trước ghi `impact`, When vẽ trang từng ca và vẽ hai lần ca «đủ» (lần hai `TZ` khác), Then mọi ca thoát 0 và mọi chỗ cần tệp thiếu in «chưa có — <tên tệp>» và tập tên tệp được nêu == đúng tệp đã gỡ, hai lần vẽ giống từng byte, trang không có `src`/`href` nào tới `http`; và chạy bộ vẽ trên MỌI hồ sơ có báo cáo bằng chứng trong kho kit (thư mục `_acceptance/` của cây) thì 0 ca ném lỗi, số hồ sơ đã chạy được in ra và > 100. Hồ sơ không có `evidence-report.md` vẫn thoát 2 như trước.
- AC-7: Given kho thử khai một lộ trình có hàng có hồ sơ «đủ» và hàng chưa có hồ sơ, When vẽ trang lộ trình, Then khối có `phien_ban == 2`, hàng có hồ sơ mang `tom_tat` với đúng hai nhóm khoá của khuôn (`moi_nguoi` chín khoá, `chu_kho` bảy khoá, không khoá nào chứa «goi_nguoi»), mỗi giá trị BẰNG giá trị cùng ô trên trang hồ sơ của cùng hồ sơ (so quan hệ, không so chuỗi có mặt), `tom_tat.moi_nguoi.trang_thai` BẰNG `trang_thai` của hàng; hàng chưa có hồ sơ `tom_tat: null`; mọi khoá bản 1 giữ nguyên. Chiều đỏ: bản sao mô-đun đổi luật đếm token → ca đỏ nêu mã hàng và khoá `token`.
- AC-8: Given trang lộ trình vẽ bằng bộ vẽ ở commit gốc của vòng (`git archive` trọn `scripts lib`) và trang vẽ bằng bộ vẽ của cây trên cùng kho thử, When bộ đọc `docDuLieu` của cây đọc trang cũ và bản chép rời `docDuLieu` lấy từ commit gốc đọc trang mới, Then: bộ đọc mới trả dữ liệu đủ khoá bản 2, `tom_tat: null` ở mọi hàng, đúng một cảnh báo chứa «khuôn bản 1»; bộ đọc cũ trả mọi khoá bản 1 bằng giá trị bộ đọc mới đọc ra trên cùng trang mới, đúng một cảnh báo «mới hơn bộ đọc», không ném. Và bản chép rời `docDuLieu` của cây (ngoài mô-đun) cho kết quả bằng bản trong mô-đun.
- AC-9: Given tài liệu `skills/acceptance/references/lo-trinh-du-lieu.md`, When rút bảng khoá trong khối marker, Then tập khoá theo từng cấp (gồm `tom_tat`, `moi_nguoi`, `chu_kho`) BẰNG khuôn khoá trong mã và tài liệu nói phiên bản 2 + cách đọc trang bản 1; chiều đỏ: bản sao tài liệu bỏ khoá `ket_qua` · bản sao mã thêm một khoá → ca đỏ nêu khoá lệch.
- AC-10: Given ma trận câu giao `«A»` · `«A» và «B»` · `««A» b»` · `A` · `«»` · chuỗi rỗng · `«A` và 12 câu giao thật của crm có «» bên trong (chép vào fixture từ crm `10063a25e`), When qua `boNgoacNgoai` và khi vẽ (trang lộ trình: ô câu giao + «làm tiếp»; khối: `hang.cau_giao`, `hang_ke.cau_giao`; trang hồ sơ: tiêu đề + `da_giao`; `--mo-o`: `feature` của ô cơ hội), Then mỗi ca ra đúng kết quả viết sẵn (`A` · giữ nguyên · `«A» b` · `A` · `` · `` · giữ nguyên; 12 câu crm mất đúng hai ký tự ngoài cùng, mọi «» bên trong còn), mỗi chỗ vẽ in câu đã bỏ ngoặc, và `vi_sao`/`bat_khi` trong khối giữ nguyên chữ gốc. Chiều đỏ: bản sao hàm dùng «bỏ ký tự đầu-cuối khi bắt đầu bằng « và kết thúc bằng »» → ca `«A» và «B»` đỏ, nêu ca.
- AC-11: Given khuôn mẫu `skills/acceptance/references/lo-trinh-template.json` và kho thử có tệp kế hoạch bọc «», When đọc khuôn và vẽ trang lộ trình rồi mở ô từ một hàng, Then không câu giao nào của khuôn bắt đầu bằng «, và băm của tệp kế hoạch trước/sau vẽ + mở ô bằng nhau (kit không ghi vào tệp ý định).
- AC-12: Given bản sao thư mục `_acceptance/` của crm ở `10063a25e` (do code bung trong lượt bằng `git archive`, không có `.git`), When vẽ trang hồ sơ LT1 (`trang-lo-trinh-trong-crm`) và mở trong trình duyệt ở khổ 1280×800 rồi 390×844, Then (máy) mô-đun đọc LT1 ra Máy 26 · Người 16 · 3 lượt chấm · 140.353 token, và bộ vẽ chạy trên MỌI hồ sơ có báo cáo bằng chứng của bản sao đó với 0 ca ném lỗi (in số hồ sơ crm); (nhìn) sáu câu trả lời được đúng theo bảng «sáu câu → chỗ» của design doc — vì sao: ô `vi_sao` · hứa gì: ô `da_giao` + mục «Đã hứa» mở bằng một phím · quyết gì: ô `ai_quyet` + số Máy/Người của dải + mục «Quyết định» · tốn gì: dòng tầng chủ kho (lượt chấm, token) · giao gì: ô `trang_thai`/`ngay` + mã đã chấm của dòng tầng chủ kho · có ăn thua không: ô `do_gi` + `ket_qua` — mọi ô và dòng tầng chủ kho nằm trên màn đầu 1280×800 không cuộn; mở/gập mục bằng bàn phím; lọc «Người» còn 16 dòng; ở 390×844 dải một cột, không cuộn ngang. (ui-observed)

## Coverage

Quét bằng `morphological-scan` (preset entity-feature, thực thể = một hồ sơ việc) — bản đầy đủ ở
`_acceptance/trang-ho-so-mot-viec/coverage-scan.md`. Chân sản phẩm: hàng X2, ô cơ hội, hồ sơ LT1 của
crm `[SUY-TỪ-REPO: scripts/evidence-page.js, scripts/lo-trinh.mjs]`. Chân ngành: `[NGÀNH: trang pull
request GitHub]` cho bố cục dải + mục gập, `[NGÀNH: trang issue Linear]` cho dòng thời gian lọc được,
`[NGÀNH: ADR — Nygard]` cho vì sao/quyết gì/hệ quả.

- Trục A — câu người đọc hỏi: vì sao · hứa gì · quyết gì · tốn gì · giao gì · có ăn thua không · production · chưa làm gì · ai quyết  [thước CE: câu giao + `vi_sao` của hàng X2] → AC-1, AC-2, AC-3, AC-4, AC-5, AC-12
- Trục B — tình trạng hồ sơ: đủ đã ký · đời cũ thiếu tệp · sổ đời trước · dòng sổ hỏng · chưa có báo cáo  [thước CE: 126 hồ sơ có báo cáo ở kit] → AC-3, AC-6
- Trục C — mặt hiện: trang hồ sơ · khối bản 2 · tiêu đề câu giao ở mọi chỗ in  [thước CE: «bộ vẽ + trường tiêu đề» của hàng X2] → AC-7, AC-10, AC-11
- Trục D — bên đọc khối: bộ đọc mới × trang bản 1 · bộ đọc bản 1 × trang bản 2 · tài liệu kho tiêu thụ  [thước CE: luật «đổi schema có đường đọc-cũ»] → AC-8, AC-9
- Later: liên kết từ hàng của trang lộ trình sang trang hồ sơ · số PR trong khối · ô «số lần gọi người» · trang hồ sơ cho việc chưa có báo cáo.
- Never: gọi model tóm tắt · trang thứ ba / máy chủ · sửa tệp kế hoạch của kho.

## Đường đo

- Chủ kho đọc xong hồ sơ mỗi việc trong ≤ 1 phút, không hỏi máy · số từ: phiên nghiệm thu kế (Cổng Giá trị), trên ≥ 2 hồ sơ thật đã ký (một kit, LT1 crm) · AC-12 bảo đảm trang trả lời đủ sáu câu trên một màn.
- Mọi câu trả lời trên trang là vật, không phải lời máy soạn · số từ: ca đo so từng ô với giá trị viết sẵn lúc dựng kho thử · AC-1…AC-5.
- Bản chiếu crm nhận cùng dải không phải tính lại · số từ: khối bản 2 so quan hệ với trang hồ sơ · AC-7, AC-8.

## Out of scope

- Ô «số lần gọi người» — chưa có máy đếm.
- Số PR trong khối dữ liệu lộ trình — chỉ có sau khi gộp; ghi vào khối làm trang lệch phép so của CI ngay sau mỗi lần gộp (mã đã chấm vẫn có).
- Bản chiếu trang hồ sơ trong CRM — hàng LT1b của crm.
- Liên kết từ trang lộ trình sang trang hồ sơ, và trang hồ sơ cho việc chưa có báo cáo bằng chứng.
- Sửa tệp kế hoạch của kho để gỡ «»; gọi model; trang thứ ba.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ca đo: `tests/scripts/lo-trinh.test.mjs` (LT-150…), chạy bằng `config:executors.test.lo_trinh` sẵn
  có — không thêm khoá executor (sửa `_acceptance/config.yaml` làm cũ hồ sơ khác). Ca của trang hồ sơ
  gọi `scripts/evidence-page.js` bằng `spawnSync`, như người gọi thật.
- Commit gốc của vòng: `65a01f4c` (Cổng Đáng ký; vật chưa đổi).
- Ca LT-112 của X1 (phần hiển thị giống bộ vẽ cũ) phải chuẩn hoá phép bỏ ngoặc — hồ sơ X1 vào lượt
  ghim lại ở mốc phát hành kế.
- **Thay thế một phần thước của hồ sơ đã ký** (dòng `fix` S3 của sổ): ca so «giống bộ máy trước vòng»
  của `lo-trinh-tren-du-lieu-that` (LT-73, LT-77), `trang-lo-trinh-doc-mot-phut` (LT-100),
  `xuat-du-lieu-lo-trinh` (LT-110, LT-112, LT-116, LT-118), `lo-trinh-cat-luot` (LT-141),
  `dieu-phoi-mo-dot-mot-lenh` (DP2-11) đi qua đúng phép bỏ ngoặc câu giao + gỡ `tom_tat` ở bên cũ; chữ
  mong đợi của LT-12/74/79/90 đổi theo câu đã bỏ ngoặc; hai trang mẫu đã ký vẽ + chụp lại; mũi tiêm
  «trang bằng chứng» của CN13 (`cong-nguoi-doc-du-nguon`) dời tới bộ đọc tiêu chí trong
  `scripts/ho-so-tom-tat.cjs`. Hợp đồng cũ đã ký không sửa; các hồ sơ đó ghim lại ở chiến dịch phát hành.
- Bản chép `docDuLieu` của gói Điều phối (`dieu-phoi/scripts/nguon-hang.mjs`) vẫn là bản 1 — ngoài ranh
  giới tệp của vòng; nó đọc trang bản 2 «phần biết» + một cờ vàng, DP2-08 so nhóm trạng thái và vẫn xanh.
  Chép lại bản 2 là việc của gói khi nó cần `tom_tat`.
- **Dải tóm tắt và phép so của CI** (dòng `fix` S3, chưa duyệt — hiện ở Cổng Bằng chứng): `product-map
  --check` bỏ qua riêng `tom_tat` khi so trang lộ trình; dải đúng tới lần vẽ lại gần nhất. Ca LT-161 (dưới
  E7) đo hai chiều. Kèm theo: `scripts/ho-so-tom-tat.cjs` vào danh sách chép CI (`INIT-CI-COPY-LIST`, 18 tệp)
  vì `lo-trinh.mjs` nạp nó; ca P99 bỏ danh sách chép tay, lấy trọn `scripts/` + `lib/`.
