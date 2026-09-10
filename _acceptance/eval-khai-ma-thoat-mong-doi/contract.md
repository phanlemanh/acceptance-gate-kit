---
schema_version: 1
feature: Eval máy khai mã thoát mong đợi (expected_exit) — một giới hạn đã khai không còn bị năm bộ đọc coi là thất bại
slug: eval-khai-ma-thoat-mong-doi
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm lib/eval-yaml.cjs + lib/evidence-core.cjs (t3_paths: lib/**)
surfaces: [cli]
status: verified
approved_by: Manh Phan
approved_at: 2026-09-09T22:32:46Z
design_doc: docs/superpowers/specs/2026-09-09-eval-khai-ma-thoat-mong-doi-design.md
---

# Acceptance Contract: eval-khai-ma-thoat-mong-doi

## Context

Kit không có khái niệm «eval máy TỪ CHỐI ĐO vì tiền đề thiếu». Năm bộ đọc coi mọi mã
thoát khác 0 là thất bại, nên một hồ sơ ĐÃ KÝ đứng trên một giới hạn đã khai thì không
ghim lại lẫn chấm lại được. Ca thật: `~/dev/crm`, hồ sơ `man-cai-dat-noi-tieng-viet`,
eval E5, ký 04/09 — `expected` khai nguyên văn rằng mã 2 là kết quả đã khai trước.

Điều tra vòng này tìm thêm một vết đề bài chưa nêu: khối bằng chứng của E5 **bỏ hẳn**
trường `exit_code` và giấu con số vào trường tự đặt `khong_do_duoc:`, vì luật nhất-quán
L1 (`NONZERO_EXIT_RE` trong `lib/evidence-core.cjs`) quét trọn báo cáo và sẽ chặn chính
báo cáo PASS đó. Giới hạn có khai, nhưng bằng hình dạng không máy nào đọc — và hình dạng
ấy được chọn *vì* máy. Đó là lớp lỗi vòng này đóng.

Ranh giới với ô đã park `baseline-127-tin-hieu-phan-biet`
(`.out-of-scope/thuoc-cua-thuoc-mot-tang.md`, owner park 30/08, ngưỡng mở lại đang đếm 0):
ô đó là MÁY tự suy kỳ vọng từ mã thoát của làn đối chứng (thước-của-thước, tầng hai);
việc này là NGƯỜI khai kỳ vọng ở Cổng 1 và ký ở Cổng Bằng chứng (tầng một). Ranh giới
được vật hoá bằng lệnh cấm khai mã 97/127 — đúng hai mã là lãnh địa ô park.

## Criteria

- AC-1: Given `evals.yaml` code-sinh, When bốn bộ đọc tiêu thụ (`acceptance-verify.js` · `repin-lane.mjs` · `checkRepinEvals` · `evaluateEvidence`) cần kỳ vọng, Then đo QUAN HỆ chứ không chỉ giá trị: (a) ma trận TOÀN PHẦN 4 bộ đọc × 4 fixture (khai n hợp lệ · khai 0 TƯỜNG MINH · vắng trường · khai SAI luật), số assert BẰNG 16; ô «khai sai luật» đòi CẢ BỐN bộ đọc cùng NỔ và cùng thông điệp — bản tiêm đọc thẳng trường sẽ trả một số thay vì lỗi nên ĐỎ thật; (b) ràng buộc tĩnh: chỉ `lib/eval-yaml.cjs` được khớp tên trường `expected_exit`, bốn tệp kia khớp ĐÚNG 0 lần — chiều đỏ là thêm một lần khớp ở một tệp bất kỳ, thông điệp ghim gọi tên tệp; (c) ô «khai 0 tường minh» phải cho kết quả BẰNG HỆT ô «vắng trường» ở cả bốn bộ đọc.
- AC-2: Given `evals.yaml` khai `expected_exit` sai luật, When bộ đọc rút kỳ vọng, Then fail-CLOSED với thông điệp GỌI TÊN eval và nêu luật bị phạm, KHÔNG rơi thầm về 0, ở BA hình dạng: (a) không phải số nguyên 0–255 (`"hai"`, `-1`, `256`, `2.5`); (b) mã hạ tầng 97 hoặc 127 — thông điệp nêu «mã hạ tầng, không khai được»; (c) executor không phải `test`/`script` (`judgment`, `ui-check`) — thông điệp nêu tên executor; và HAI đối chứng dương CÙNG fixture để ba nhánh trên không phải hằng-đúng: `expected_exit: 2` hợp lệ → không lỗi; `expected_exit: 0` TƯỜNG MINH → không lỗi VÀ không bị tính là một giới hạn đã khai (không dòng Known limits, không câu nói-ra) — chiều đỏ: bản sao coi «có trường» là đã-khai → ĐỎ nêu «khai 0 bị tính là giới hạn».
- AC-3: Given S4 chạy một lệnh mà eval trỏ tới khai `expected_exit: 2`, When lệnh trả 2, Then eval KHÔNG nằm trong `failedEvals`/`failedCommands`, verdict không vì nó mà REJECT; và nó hiện DẤU PHÂN BIỆT: hàng bảng ghi mã thật kèm nhãn đạt-có-giới-hạn (không phải `PASS` trơn), khối eval ghi `exit_code: 2` THẬT (không bỏ trường, không đổi tên trường); chiều đỏ cùng fixture: cùng eval trả 1 → có trong `failedEvals`, verdict REJECT.
- AC-4: Given round S4 có ≥1 eval đạt-có-giới-hạn, When soạn báo cáo, Then dòng cho mục **Known limits** do JS TÍNH SẴN và truyền vào bên soạn để chép nguyên văn (bên soạn không tự diễn đạt), mỗi eval một dòng gọi tên id + mã + AC nó phục vụ; hệ quả bắt buộc: mục Known limits KHÔNG rỗng nên hồ sơ hết xanh-sạch và đi Cổng Bằng chứng có người — chiều đỏ: bản sao gỡ dòng tính sẵn khỏi luồng → ĐỎ nêu «Known limits vắng eval <id>».
- AC-5: Given hai eval trỏ CÙNG một lệnh mà khai HAI mã mong đợi khác nhau, When S4 dựng kỳ vọng theo lệnh, Then verdict là `BLOCKED` với mục `blocked` gọi tên CẢ HAI eval, cả hai mã và lệnh chung — máy KHÔNG chọn thầm một mã; chiều đỏ cùng fixture: hai eval chung lệnh khai CÙNG mã → chạy bình thường, không blocked.
- AC-6: Given lệnh có kỳ vọng khác 0, When S4 gộp nhiều lượt chạy và chấm làn đối chứng, Then mọi phép so đều so với KỲ VỌNG chứ không với 0: đếm lượt đạt, chọn lượt đại diện chẩn đoán, mã thoát gộp, và trạng thái làn đối chứng (`green` nghĩa là baseline trả đúng kỳ vọng); chiều đỏ: bản sao giữ lại một phép so `=== 0` ở một trong bốn chỗ → ĐỎ nêu đúng chỗ đó.
- AC-7: Given làn ghim lại chạy một hồ sơ có eval khai `expected_exit: 2`, When eval trả 2, Then làn XANH và ghi: `evals_exit` giữ MÃ THẬT `2` (không quy về 0), dòng chữ mục Re-pin đếm từ mã thật và GỌI TÊN eval đạt-có-giới-hạn (thay câu ghi cứng «N eval máy exit 0» đang lấy số từ độ dài mảng); chiều đỏ cùng fixture: cùng eval trả 1 → làn ĐỎ, exit 1, KHÔNG ghi gì.
- AC-8: Given một làn ghim lại chống lưng `verified_commit`, When `checkRepinEvals` chấm một mã khác 0, Then mã chỉ được nhận khi thoả CẢ HAI: `evals.yaml` khai đúng mã đó cho eval đó, VÀ báo cáo ĐÃ KÝ đã ghi eval đó cùng mã; ba chiều đỏ cùng fixture: (a) khai 2 + báo cáo ghi 2 + làn 2 → nhận; (b) khai 2 + báo cáo ghi 0 + làn 2 → ĐỎ nêu «tiền đề vừa mất»; (c) KHÔNG khai + báo cáo ghi 2 + làn 2 → ĐỎ nêu «chưa khai». **Báo cáo dùng làm đầu vào phải là báo cáo THẬT do `acceptance-verify.js` sinh trong chính lượt chạy** (round-trip rút-từ-writer-thật), CẤM fixture báo cáo viết tay theo khuôn bên đọc — chiều đỏ của chính lưới này: đổi khuôn bên VIẾT (dấu phân biệt của AC-3) mà bên đọc không đổi → ĐỎ nêu «writer trôi khỏi reader».
- AC-9: Given báo cáo PASS chứa `exit_code` khác 0, When `evaluateEvidence` chấm luật nhất-quán L1, Then mã được tha CHỈ KHI nó nằm trong khối của đúng eval đã khai đúng mã ấy; ba hình dạng còn lại vẫn vi phạm (ngoài khối · lệch mã · eval không khai); và điều kiện hình dạng L1 đòi ít nhất một dòng `exit_code: 0` được thoả bằng một dòng mã thoát ĐÚNG KỲ VỌNG đã khai. **Đầu vào là báo cáo THẬT do `acceptance-verify.js` sinh trong chính lượt chạy** (cùng luật round-trip với AC-8), CẤM fixture viết tay; chiều đỏ: cùng báo cáo thật, đổi mã trong khối từ 2 sang 3 → vi phạm nêu tên eval.
- AC-10: Given eval khai `expected_exit: 2` mà nay trả 0, When S4 chấm và khi làn ghim lại chạy, Then cả hai XANH (không phạt một cải thiện) NHƯNG phải NÓI RA: báo cáo và dòng mục Re-pin ghi «giới hạn đã khai không còn» kèm tên eval và cặp mã khai/thật; chiều đỏ: bản sao bỏ câu nói-ra → ĐỎ nêu «giới hạn hết mà im».
- AC-11: Given cây sau hồ sơ, When đọc tài liệu và chạy ca round-trip, Then (a) `GUIDE.md` §7.1 có đoạn nói làn ghim lại chấm theo kỳ vọng đã khai + luật hai-vế của AC-8 + giới hạn `ui-check`/`judgment` không khai được; (b) `docs/adr/0016-*.md` ghi quyết định, NÊU ĐÍCH DANH ô park `baseline-127-tin-hieu-phan-biet` và vì sao việc này nằm ngoài ô đó; (c) `CONTEXT.md` có term **đạt-có-giới-hạn** kèm `_Avoid_`; (d) chú thích của `lib/eval-yaml.cjs` trong khối `INIT-CI-COPY-LIST` nói thêm vai mới, ca CE2 vẫn xanh; (e) danh sách mã cấm trong `lib/eval-yaml.cjs` RÚT từ khối marker `INFRA-EXIT-CODES` của `acceptance-verify.js` và so BẰNG — bản sao đổi một mã ở marker → ĐỎ nêu «mã cấm trôi khỏi marker»; và ca DƯỚI NGƯỠNG phải IM: bản sao chỉ đổi khoảng trắng/thứ tự trong khối marker mà TẬP mã không đổi → KHÔNG kêu (so theo GIÁ TRỊ, không so byte) — thiếu ca im này thì phép so không phân biệt được «trôi thật» với «định dạng lại».
- AC-12: Given lời dặn cho bước soạn báo cáo trong `feature-loop/workflows/acceptance-verify.js` (câu «report PASS không được chứa mã thoát khác 0»), When cây sau hồ sơ, Then câu đó đã được NỚI đúng phạm vi — cho phép mã khác 0 trong khối của eval đã khai, và VẪN cấm mọi chỗ khác; đo trên CẢ HAI tầng: (a) vật prompt — bản sao khôi phục câu cấm cũ → ĐỎ nêu «lời dặn còn cấm mã khác 0»; (b) ĐẦU RA THẬT — báo cáo do bước soạn sinh ra cho một eval đạt-có-giới-hạn phải chứa dòng `exit_code: 2` ĐÚNG TÊN TRƯỜNG, không được bỏ trường và không được đặt tên trường khác; chiều đỏ: báo cáo sinh ra mang một tên trường tự đặt → ĐỎ nêu «bịa tên trường», đúng vết `khong_do_duoc:` của ca crm mà hồ sơ này lấy làm lý do tồn tại.
- AC-13: Given một khoá executor CODE-SINH trỏ một lệnh THẬT `exit 2` và một eval khai `expected_exit: 2` trỏ khoá đó, When chạy `acceptance-verify.js` KHÔNG bơm sẵn kết quả lượt chạy, Then mã 2 đi trọn đường THẬT — giải khoá `config:` → chạy lệnh → chuẩn hoá mã hạ tầng → so kỳ vọng — và ra đạt-có-giới-hạn, khối eval mang mã 2, mục Known limits có dòng; hai đối chứng cùng khoá: đổi lệnh sang `exit 0` với eval không khai → PASS trơn; đổi sang `exit 1` → REJECT gọi tên eval. Lý do có AC riêng: bốn chân S4 kia bơm mã vào SAU khâu giải khoá, nên không chân nào bắt được lớp lỗi đã xảy ra thật ở vòng trước (lệnh khai giải ra vỡ cú pháp, thoát 127 chứ không 2).

## Coverage

Quét theo preset test-matrix. Chân sản phẩm: `[SUY-TỪ-REPO: lib/evidence-core.cjs ·
feature-loop/workflows/acceptance-verify.js · feature-loop/scripts/repin-lane.mjs ·
_acceptance/config.yaml]`. Chân ngành: `[NGÀNH: pytest xfail(strict=True)]` cho khai-trước
một phép đo được phép trượt; `[NGÀNH: TAP — TODO khác SKIP]` cho ranh giới với `cannotRun`;
`[NGÀNH: JUnit error khác failure]` cho nếp kit đã dẫn ở `normInfra`.

- Trục A — chỗ đọc: parser | S4 | làn ghim lại | `checkRepinEvals` | luật nhất-quán L1 [thước CE: grep toàn cây mọi phép so mã thoát — 5/5 nơi có AC; AC-1 round-trip canh không nơi nào mọc lối đọc thứ sáu]
- Trục B — hình dạng khai: không khai | khai 0 | khai n hợp lệ | mã hạ tầng 97/127 | sai kiểu | executor không phải test/script [thước CE: lược đồ trường mới, MECE theo giá trị; 6/6 có AC — khai n hợp lệ ở AC-1/3/7/8/9, khai 0 tường minh ở AC-1(c)+AC-2 đối chứng dương, vắng trường ở AC-1(a), BA hình dạng hỏng ở AC-2]
- Trục C — quan hệ khai ↔ mã thật: khớp | lệch | mã khác 0 MỚI xuất hiện | mã đã khai MẤT đi [thước CE: ca thật crm E5 + luật ghim lại; khớp AC-3/7, lệch AC-3/7 chiều đỏ, mới AC-8(b), mất AC-10]
- Trục D — chia sẻ lệnh: riêng | chung cùng mã | chung khác mã [thước CE: `byCmd` gom eval theo lệnh, `acceptance-verify.js:399`; 3/3 ở AC-5 và AC-3; đường đầu-cuối thật ở AC-13]

Cross-cutting áp mọi ô Core — **vật mang dấu**: `evals.yaml` · dòng `kind:repin` trong
run-log · khối eval trong `evidence-report.md` · mục Known limits. Mỗi AC nêu vật nó chạm.

Ô gạch có lý do: `ui-check`/`judgment` × mọi hình dạng khai → Never (làn ghim lại không
chạy được hai loại đó, cho khai sẽ làm hai bộ đọc bất đồng — giới hạn khai ở Notes);
`hooks/**` × mọi ô → gạch (luật sống ở `lib/evidence-core.cjs`, `hooks/` chỉ gọi vào);
`carry-plan.mjs` × mọi ô → gạch (carry đi theo `paths`, không theo mã thoát).

## Out of scope

- **Sửa hồ sơ của `crm`.** Kit là engine; `crm` nhận qua bản phát hành 2.11.0. Vòng này
  không chạm kho tiêu thụ nào.
- **Hồ sơ mốc phát hành `release-2-11-0`.** Hồ sơ RIÊNG, mở sau hồ sơ này (owner chốt
  trình tự 09/09).
- **Khai một TẬP mã chấp nhận được** thay vì một mã. Chưa có ca thật đòi; thêm bây giờ là
  khái quát hoá đầu cơ.
- **Suy mã mong đợi từ văn xuôi của trường `expected`.** Never — máy đoán ý người, đúng
  lớp lỗi kit đang chặn.
- **Mở lại ô `baseline-127-tin-hieu-phan-biet`.** Vẫn park; ngưỡng mở lại không đổi.

## Notes

- Giới hạn khai của chính vòng này: `ui-check` và `judgment` KHÔNG khai được mã mong đợi.
  Ngưỡng mở lại đang đếm: ngày làn ghim lại chạy được `ui-check`.
- Chỉ khai được MỘT mã, không phải một tập.
- Hồ sơ này KHÔNG có `opportunity.md` (không đi từ Cổng Đáng), nên không có mục `## Đường đo`.
- **Ô này là một CỘNG, mở dưới luật NỚI 2026-09-07** của CLAUDE.md (vế «không CỘNG» tạm
  ngưng). Khai theo yêu cầu của luật nới: trace về nguyên tố 2 (bằng chứng không tự dối)
  và nguyên tố 3 (khoảnh khắc quyết thật); người hưởng cụ thể là chủ hồ sơ ở repo tiêu thụ
  đang có hồ sơ đã ký mà không ghim lại được — ca thật `crm/man-cai-dat-noi-tieng-viet`;
  KHÔNG tăng lượt gọi người: eval đạt-có-giới-hạn định tuyến qua mục Known limits, tức
  dùng đúng Cổng Bằng chứng sẵn có, không dựng cổng mới.
- **Trình tự ship (owner đổi 09/09, thay ràng buộc «chờ nhánh mốc gộp»).** Vòng này chạy
  S0→S4 ngay từ `main` hiện tại, SONG SONG với hồ sơ mốc `release-2-10-0`. Hai ràng buộc
  cứng: (1) KHÔNG gộp trước khi `claude/moc-2-10-0` lên `main`; khi nó lên thì merge `main`
  vào nhánh này, giải xung đột, chạy `repin-lane.mjs` cho chính hồ sơ này — hoá cũ là chắc
  chắn vì K4 stale-theo-`paths` đã rút ở `affc2108` nên luật cũ đo CẢ CÂY — mọi eval phải
  exit 0 nên làn phải xanh; ghim xong mới ship, rồi mới tới `release-2-11-0`. (2) Vùng của
  hồ sơ mốc là `evaluateContractWrite` (quanh dòng 613 của `lib/evidence-core.cjs`) và ca
  V14/V15/V16 trong `tests/hooks/run-tests.sh`; vùng của hồ sơ này là `checkRepinEvals`
  (quanh dòng 243) và `evaluateEvidence` (quanh dòng 460) — không chạm vùng của họ. Đã đo
  09/09: hai vùng rời nhau, `repin-lane.mjs` không bị nhánh mốc chạm, và ca kiểm hai bên
  nằm ở tệp khác nhau (`tests/workflows/` + `tests/scripts/` so với `tests/hooks/`).
