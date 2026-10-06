---
schema_version: 1
feature: Eval máy đã ký nghỉ hưu vì một hồ sơ đã ký khác thay nó — con trỏ `superseded_by` cạnh lời khai không-chạy; luật hai vế nhận khi máy chứng được con trỏ ở cây đang kiểm; pin nói ra ô nào thay bởi đâu
slug: eval-thay-boi-co-chung
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm lib/evidence-core.cjs, scripts/recheck-evidence.cjs, scripts/pre-merge-check.sh ∈ t3_paths
surfaces: [cli]
status: approved
approved_by: Manh Phan
approved_at: 2026-10-06T10:21:39Z
design_doc: docs/superpowers/specs/2026-10-06-eval-thay-boi-co-chung-design.md
---

# Acceptance Contract: eval-thay-boi-co-chung

## Context

Luật hai vế (ADR 0016, hồ sơ `lan-doc-status-not-run`) chặn mọi eval máy khai `status: not-run`
khi báo cáo đã ký có mã thoát cho chính nó — đúng để chặn né đo, nhưng không có lối hợp lệ cho
eval nghỉ hưu vì một hồ sơ ĐÃ KÝ khác đã đo lại điều tương đương. Ca thật crm 06/10
(`gop-y-dung-cho`, `081c9b792`): 25 eval máy ở năm hồ sơ đã ký mất vật đo, làn ghim lại dừng
exit 2 ở `notRunConflicts`, các hồ sơ không ghim lại được, kho vá bằng lưới riêng.

Vòng này cho ô mang con trỏ `superseded_by: <hồ sơ thay>#<AC-n>` cạnh lời khai không-chạy, và
cho luật hai vế nhận ô đó khi chín điều kiện chứng được ở cây đang kiểm (bảng ở design doc) —
quan trọng nhất là cái bắt tay hai đầu: hồ sơ thay phải có chữ ký người, chính nó nêu tên eval cũ
(`<slug cũ>/<id>`) trong hợp đồng hoặc design doc đã duyệt, và còn eval có mã thoát đã ký phủ AC
được trỏ.
Ô không con trỏ: luật cũ nguyên văn.

**Người hưởng:** owner và phiên crm đang ghim lại năm hồ sơ cũ; về sau mọi kho có lượt sản
phẩm gỡ một tính năng đã ký. **Trace nguyên tố 2** (bằng chứng không tự dối): thay một lời khai
một-vế bằng một chuỗi chứng máy kiểm lại mỗi lượt.

Source input: lời owner giao 06/10 + `_acceptance/eval-thay-boi-co-chung/opportunity.md` + đo
crm `origin/onehub` `e753383a` · thiết kế: `docs/superpowers/specs/2026-10-06-eval-thay-boi-co-chung-design.md`.

## Criteria

- AC-1 (nhận khi chứng đủ): Given kho tạm do MÃ SINH — hồ sơ cũ đã ký có eval máy X khai không-chạy kèm con trỏ tới hồ sơ thay đã ký có chữ ký người, báo cáo đã ký của hồ sơ cũ có mã thoát cho X, design doc của hồ sơ thay nêu thẻ `<slug cũ>/X`, hồ sơ thay có AC được trỏ và còn eval có mã thoát 0 trong báo cáo đã ký của nó phủ AC đó, When chạy làn ghim lại `--write` trên hồ sơ cũ rồi chạy bên đọc pin (recheck) và lưới trước-merge, Then làn thoát 0 và ghi pin, recheck 0 lỗi, lưới trước-merge không có vi phạm nào cho hồ sơ cũ. Đối chứng dương trên cùng kho: gỡ dòng con trỏ → làn exit 2 với thông điệp xung đột cũ NGUYÊN VĂN. Chiều đỏ: bản sao bỏ bước xét con trỏ → ĐỎ ghim «ô thay bởi hợp lệ vẫn bị chặn».

- AC-2 (từ chối có tên — ma trận): Given fixture lành của AC-1, When làm gãy ĐÚNG MỘT điều kiện mỗi lượt — con trỏ hỏng · tự trỏ · hồ sơ thay vắng · hồ sơ thay chưa ký (đang chờ duyệt bằng chứng) · hồ sơ thay chỉ được máy thông, không chữ ký người · hồ sơ thay đã khép · hồ sơ thay KHÔNG nêu tên eval cũ (con trỏ tới AC hợp lệ của một hồ sơ đã ký không liên quan) · AC không có trong hợp đồng thay · AC chỉ còn eval khai không-chạy · eval sống phủ AC được thêm sau khi ký, báo cáo thay không có mã thoát cho nó · con trỏ `#AC-1` khi chỉ `AC-10` có eval sống · vòng tròn hai hồ sơ trỏ nhau, Then làn exit 2 không ghi byte nào và recheck ghi vi phạm, cả hai gọi tên id, con trỏ và đúng lý do của hàng đó; số assert bằng số hàng ma trận đếm lúc chạy, lệch thì ĐỎ «số ca lệch». Hàng nhận kèm theo: criterion của eval thay liệt nhiều AC («AC-3, AC-7») với con trỏ `#AC-7` → được nhận. Chiều đỏ: mỗi mutant bỏ một điều kiện (ít nhất: bỏ kiểm chữ ký · bỏ kiểm hồ sơ thay nhận việc · bỏ kiểm mã thoát đã ký của eval thay · so AC bằng chuỗi con) → hàng tương ứng đi qua, ĐỎ ghim «đường né đo mở: <lý do>».

- AC-3 (bên gọi cũ vẫn chặn): Given fixture lành của AC-1, When gọi luật mà không truyền gốc cây (dạng gọi trước vòng này), hoặc khi thư viện đọc dòng AC/hồ sơ vắng cạnh thư viện bằng chứng, Then ô vẫn là xung đột với lý do `khong-tra-duoc` và không có ngoại lệ nào ném ra. Chiều đỏ: bản sao coi «không tra được» là nhận → ĐỎ ghim «bên gọi cũ bị nới lặng».

- AC-4 (một nguồn, ba bên gọi): Given mọi hàng ma trận của AC-2 cộng ca lành, When làn, recheck và lưới trước-merge cùng phán, Then ba đường cho cùng tập id được nhận và cùng lý do cho từng id bị từ chối — so đầu ra thật của ba lệnh, không so với danh sách gõ tay; và mọi export làn gọi thêm đều có hàng trong bảng điểm chạm bộ máy (ca thường trực lớp-cũ xanh). Chiều đỏ: bản sao recheck không truyền gốc cây → ĐỎ ghim «ba bên trả phán quyết khác nhau» kèm id lệch.

- AC-5 (cây đang kiểm, không cây tác giả): Given hai kho tạm cùng có hồ sơ thay trùng tên — ở kho thứ nhất đã ký, ở kho thứ hai chưa ký, When chạy làn ghim lại (`--root` kho thứ hai), recheck và lưới trước-merge của kho thứ hai với thư mục làm việc là kho thứ nhất, Then cả ba phán theo kho thứ hai (từ chối `ho-so-thay-chua-ky`) và làn không ghi byte nào. Chiều đỏ: bản sao đọc hồ sơ thay từ thư mục làm việc → ĐỎ ghim «đọc nhầm cây».

- AC-6 (pin nói ra): Given làn xanh của AC-1, When đọc dòng sổ chạy và mục ghim lại trong báo cáo, Then id ô thay bởi nằm trong `evals_not_run` theo thứ tự bản khai, dòng JSON không mang khoá mới, và dòng `sha:` nối hậu tố «thay bởi hồ sơ đã ký: <id>→<hồ sơ>#<AC>» theo thứ tự bản khai; hồ sơ không có ô thay bởi thì hậu tố vắng hẳn; recheck chấp nhận dòng `sha:` mang hậu tố. Hai chỗ đọc bằng hai bộ đọc khác nhau. Chiều đỏ: bản sao bỏ bước nối hậu tố → ĐỎ ghim «pin im lặng về ô thay bởi».

- AC-7 (chứng sống sau khi ghim): Given pin xanh của AC-1 đã ghi, When hồ sơ thay sau đó nghỉ (dòng nghỉ có chữ ký) hoặc trạng thái của nó lùi khỏi đã-ký, Then recheck pin cũ của hồ sơ cũ ghi vi phạm với lý do tương ứng — bên đọc không tin hậu tố đã ghi, nó kiểm lại chuỗi chứng. Đối chứng dương: không đổi gì ở hồ sơ thay → recheck 0 lỗi. Chiều đỏ: bản sao bên đọc tin hậu tố `sha:` → ĐỎ ghim «lời hứa thay đã hết mà pin vẫn xanh».

- AC-8 (kho không dùng trường giữ từng byte): Given bản base dựng bằng `git archive` lấy TRỌN `scripts lib` ở merge-base và bản mới, When chạy lưới trước-merge (có base, như CI) và recheck trên bộ hồ sơ của kit cộng một fixture mã sinh có ô không-chạy xung đột KHÔNG con trỏ, Then đầu ra hai bản giống từng byte và mã thoát giống nhau. Chân nhạy: thêm một con trỏ hợp lệ vào fixture → đầu ra hai bản KHÁC nhau. Chiều đỏ: bản sao đổi thông điệp xung đột cũ → ĐỎ ghim «kho không dùng trường đổi đầu ra».

- AC-9 (khuôn tài liệu đi qua bộ đọc thật): Given khối marker `EVAL-THAY-BOI-TEMPLATE` trong GUIDE §7.1, When ca đo rút khối bằng mã, điền chỗ trống bằng giá trị fixture AC-1 và chạy làn, Then làn xanh và ô được nhận. Chiều đỏ: bản sao khối đổi tên trường → làn exit 2 gọi tên xung đột, ĐỎ ghim «khuôn tài liệu không khớp bộ đọc».

- AC-10 (hình dạng crm): Given fixture mã sinh đúng hình dạng đo ở crm 06/10 — năm hồ sơ cũ đã ký, 25 eval máy khai không-chạy trỏ tám AC của một hồ sơ thay đã ký, mỗi hồ sơ cũ còn eval máy sống, When chạy làn `--write` một lượt cho cả năm slug rồi recheck, Then làn thoát 0, pin mỗi hồ sơ liệt đúng id thay bởi của nó, recheck 0 lỗi. Đối chứng: cùng fixture không con trỏ → làn exit 2 ở hồ sơ đầu với thông điệp xung đột cũ. Chiều đỏ: bản sao bỏ bước xét con trỏ → ĐỎ ghim tên ca.

## Coverage

Trục (quét morphological 06/10, preset test-matrix; chân ngành: Michael Nygard ADR — trạng thái
*superseded by*; IETF RFC header *Obsoletes / Obsoleted by* — bản thay phải tồn tại và đang hiệu lực):

- **A — BÊN GỌI:** A1 làn ghim lại · A2 recheck · A3 lưới trước-merge. [thước CE: ba bên gọi `notRunConflicts`/`checkRepinEvals` có thật — grep 06/10, `[SUY-TỪ-REPO: lib/evidence-core.cjs]`]
- **B — CHUỖI CHỨNG:** B1 lành · B2 con trỏ hỏng · B3 tự trỏ · B4 hồ sơ thay vắng · B5 chưa ký / chỉ máy thông · B6 đã khép · B7 hồ sơ thay không nhận việc thay · B8 AC vắng · B9 AC không còn eval có mã thoát đã ký (kể cả eval thêm sau ký, AC trùng tiền tố) · B10 vòng tròn. [thước CE: bảng điều kiện của design doc + `[NGÀNH: Nygard ADR, IETF RFC Obsoletes]`]
- **C — TUỔI & NGỮ CẢNH BÊN GỌI:** C1 có gốc cây · C2 không gốc (bên gọi cũ) · C3 thiếu thư viện phụ · C4 thư mục làm việc khác gốc. [thước CE: luật fail-closed vế hai của ADR 0016 + bài học «thước gắn vào vật» (4)]
- **D — THỜI ĐIỂM:** D1 lúc ghim · D2 sau ghim, hồ sơ thay đổi trạng thái. [thước CE: luật «Reality là đồng hồ cuối» — lời hứa có thể hết]
- **E — KHO:** E1 dùng trường · E2 không dùng trường. [thước CE: đo 06/10 — 4 hồ sơ/2 kho có `not-run`, 0 con trỏ; luật 26/09]

**Core** = A1·A2·A3 × B1 · A1/A2 × B2…B10 · C2·C3 · C4 · D1 nói ra · D2 · E2 · khuôn tài liệu · hình dạng crm → AC-1…AC-10.

**Lớp cross-cutting áp mọi ô Core:** cặp hai chiều trên cùng fixture + thông điệp ghim
(MEASURE-BIRTH-CLAUSE); mọi fixture do mã sinh trong chính lần chạy; mọi đường dẫn suy từ vị trí
script; bản base lấy trọn thư mục bằng `git archive`.

**Later:** thẻ Cổng và bản đồ sản phẩm hiển thị «thay bởi» · con trỏ nhiều đích · con trỏ trên ô
ngoài làn máy. **Never:** giá trị trạng thái mới `thay-boi` (giả định 3 của opportunity — mọi bộ
đọc hiện có đã đúng với `not-run`) · đọc bảng thay thế trong design doc của kho (từ vựng một kho).

## Đường đo

- Thước: crm ghim lại được hồ sơ có eval bị thay · số từ: ca hình dạng crm (fixture mã sinh, AC-10) lúc chấm, rồi chiến dịch phát hành trên crm (làn ghim lại năm hồ sơ sau khi kho khai con trỏ) · bảo đảm bởi: AC-10 (lúc chấm) · chiến dịch phát hành (sau mốc)
- Thước: không mở đường né đo · số từ: ma trận từ chối · bảo đảm bởi: AC-2, AC-7
- Thước: kho không dùng trường không đổi · số từ: vi phân trước/sau · bảo đảm bởi: AC-8

## Out of scope

- Sửa kho crm (khai con trỏ, ghim lại, gỡ nhánh «ĐÃ THAY» của lưới riêng) — việc của lượt nhận mốc.
- Thẻ Cổng Phạm vi/Bằng chứng và bản đồ sản phẩm hiển thị «thay bởi» — vòng này chỉ cho pin nói ra.
- Con trỏ nhiều đích, con trỏ trên eval ngoài làn máy, con trỏ trên ô không khai không-chạy.
- Đổi luật «cho một hồ sơ nghỉ» (2.17) — lối đó vẫn là lối cho cả hồ sơ.
- Bộ lọc hoá cũ theo `paths` (`staleByPaths`) — đang là phạm vi của vòng `loc-paths-dong-mac-dinh`.

## Notes

- **CỘNG cần owner phê đích danh ở Cổng Phạm vi (ADR 0018):** một trường mới trong khuôn
  `evals.yaml` (`superseded_by`) và một hậu tố tuỳ chọn thứ tư trên dòng `sha:` của mục Re-pin.
  Phần còn lại là mở rộng một luật có sẵn, không thêm lệnh, khoá cấu hình hay lượt gọi người.
- **Đã gộp `main` `8215e63a` trước Cổng Phạm vi (06/10):** vòng `gia-lan-ghim-lai` đổi làn ghim lại
  và khuôn REPIN-TEMPLATE, không đụng luật hai vế; hậu tố «thay bởi» đặt ngay sau «không chạy theo
  hồ sơ». Chi tiết ở design doc, mục «Đồng bộ với nhánh chính».
- **Chạy song song với `loc-paths-dong-mac-dinh`** (T3, cùng tệp `lib/evidence-core.cjs`, khác
  hàm): vòng nào gộp sau thì gộp nhánh chính vào trước lượt chấm cuối.
- **T3** nên Cổng 1.5 cần người theo thiết kế; trần 4 lượt gọi người.
- **Đường nền chạy ba lượt (06/10):** hai lượt đầu đỏ giả — lượt một vì vòng viết tệp hồ sơ vào cây
  trong lúc suite chạy (S1#0 cho brainstorm song song, nhưng tệp viết ra làm chân «cây sạch sau
  suite» và P122 đỏ), lượt hai vì máy tạo sẵn thư mục hồ sơ rỗng trước khi chạy (suite đọc nó thành
  hồ sơ hỏng). Lượt ba trên bản sao sạch của `bf79fdb1`, không tạo thư mục trước: năm chân xanh —
  sau khi gộp `main`, chạy lại lần bốn trên bản sạch `8215e63a`: năm chân xanh — đó là tệp
  `duong-nen.md` hiện tại của hồ sơ này. Lỗ ở nghi thức (song song mà cây bị ghi) ghi ở đây, không
  mở ô — luật chiều rộng.
- **Giới hạn khai trước — cái bắt tay đọc văn bản hiện tại:** điều kiện «hồ sơ thay nhận việc
  thay» đọc `contract.md`/design doc của hồ sơ thay ở cây đang kiểm, không đối chiếu bản lúc ký;
  một người sửa design doc của hồ sơ đã ký để thêm thẻ `<slug>/<id>` sẽ qua. Cùng tầng tin cậy
  với chính lời khai không-chạy (sửa `evals.yaml` của hồ sơ đã ký) và với dòng nghỉ — lưới là diff
  ở PR. Ngưỡng mở răng chặt hơn: ≥ 1 ca thật một thẻ nhận được thêm vào hồ sơ thay sau ngày nó ký.
- **Giới hạn khai trước:** AC-8 đo «kho không dùng trường giữ từng byte» trên bộ hồ sơ kit và
  fixture; các kho tiêu thụ khác được đo ở chiến dịch phát hành, không ở lượt chấm.
