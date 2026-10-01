---
schema_version: 1
feature: thước biết trước là không phán được — chặn eval judgment hỏi diff/lệnh ở bước sinh args S4, chọn người chấm theo từng vế
slug: thuoc-biet-truoc-khong-phan-duoc
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-01T02:03:04Z
design_doc: docs/superpowers/specs/2026-10-01-thuoc-biet-truoc-khong-phan-duoc-design.md
---

# Acceptance Contract: thuoc-biet-truoc-khong-phan-duoc

Gốc: crm/_acceptance/va-tro-ly-okr-sau-thu

## Context

Từ 04/08 hội đồng chấm judgment chỉ đọc đúng các tệp trong `inputs` — không
diff, không lệnh. Bên viết eval không được báo: 17 eval judgment trên 10 kho
hỏi «diff của lượt» hoặc bảo chạy lệnh; sau 04/08, 10/12 ca kết thúc UNCERTAIN
và người ký «Đạt» bằng tay. Ở ca gốc (crm `va-tro-ly-okr-sau-thu`, E14 của
AC-13) một lỗi thật đã lọt qua đúng khe này. Vòng này đặt răng ở chỗ mọi lượt
chấm S4 phải đi qua (bước sinh args), và sửa bên viết + bên chấm + bên phản
biện để nói cùng một sự thật nền.

Source input: bản ghi phát hiện `docs/findings/2026-10-01-thuoc-biet-truoc-khong-phan-duoc.md`
§8 (bản đã sửa sau tự phản biện §10), owner duyệt mở vòng 01/10/2026 — việc
CỘNG được phê đích danh (ADR 0018).

## Criteria

- AC-1: Given một hồ sơ có eval `executor: judgment` mà `question` hỏi diff của lượt (dạng ca gốc «Đọc diff của lượt (git diff diffBase...HEAD…)», viết một dòng hoặc khối gấp `>` mà cụm «diff của lượt» bị xuống dòng giữa chừng) với `inputs` toàn tài liệu có thật, When chạy `s4-args.mjs --slug <slug> --root <repo>`, Then exit ĐÚNG 2, tệp args KHÔNG được sinh, và thông điệp nêu id eval, đoạn khớp trong «…», cùng ĐÚNG hai lối ra — (a) vế đo được bằng lệnh → eval script/test của kho đo trạng thái cây, phải xanh trên cây hiện tại; (b) vế cần phán → hỏi về tệp có trong inputs; đối chứng dương trên CÙNG fixture: đổi câu hỏi sang hỏi nội dung tài liệu → exit 0, sinh tệp.
- AC-2: Given `question` bảo chạy lệnh (một trong ba dạng: «Run: `…`»/«Chạy `…`», «grep -n …», «git -C <dir> …»), When chạy script, Then exit 2, không sinh tệp, cùng thông điệp với AC-1 nêu đoạn khớp của dạng đó.
- AC-3: Given `inputs` có một tệp diff có thật (`_acceptance/<slug>/evidence/diff-luot.txt`) mà `question` vẫn hỏi diff của lượt, When chạy script, Then vẫn exit 2 như AC-1 — tên tệp không miễn răng (diff là lịch sử đóng băng; bộ nhớ hội đồng băm `inputs` sẽ mang phán quyết cũ sang mã mới).
- AC-4: Given bốn câu hỏi KHÔNG đòi thứ ngoài `inputs` — hỏi nội dung tài liệu; hỏi về một tệp mã nguồn CÓ trong `inputs` (`src/a.ts`); dùng chữ «diff» theo nghĩa khác («diff giữa hai cấu hình đính kèm»); «Trên app QC đang chạy:» không kèm lệnh trong backtick — When chạy script với từng câu, Then cả bốn exit 0 và sinh tệp; và bộ dò chạy trên MỌI eval judgment trong `_acceptance/*/evals.yaml` của chính kho kit trả 0 ca khớp (đối chứng dương cùng lượt: tiêm một câu hỏi diff vào bản sao văn bản của một hồ sơ → đúng 1 ca).
- AC-5: Given bộ dò (hai khuôn «hỏi diff» và «bảo chạy lệnh» + phép gộp khoảng trắng), When kiểm nơi nó được định nghĩa, Then nó sống ở ĐÚNG MỘT module (`feature-loop/scripts/lib/hoi-ngoai-inputs.mjs`) mà cả `s4-args.mjs` lẫn script quét của bản ghi phát hiện cùng nạp — không bản sao của khuôn nào ở nơi khác trong các thư mục nguồn của kit (`feature-loop/`, `scripts/`, `lib/`, `hooks/`, `skills/`, `commands/`, `docs/findings/assets/`); round-trip: script quét chạy trên một gốc kho giả do code sinh (một kho, ba hồ sơ) báo ĐÚNG tập eval mà `s4-args.mjs` chặn trên cùng các hồ sơ đó.
- AC-6: Given lời giao việc cho hội đồng trong `feature-loop/workflows/acceptance-verify.js` (tiền đề của răng: hội đồng mù diff, chỉ đọc danh sách Input), When chạy lưới thường trực, Then một ca ghim rằng dòng mẫu dựng lời giao việc (không phải chú thích) còn cả hai vế «KHONG doc diff» và «CHI duoc doc dung cac file liet ke»; chiều đỏ trên bản sao bỏ vế nào cũng → ca đỏ với thông điệp nêu tên răng phải gỡ cùng lúc. `acceptance-verify.js` không đổi trong vòng này.
- AC-7 (judgment): Given ba nơi khai luật cho bên viết eval — `skills/acceptance/references/eval-executors.md`, Phase 2 của `skills/acceptance/SKILL.md`, dòng evals.yaml ở S1 của `feature-loop/skills/feature-loop/SKILL.md` — When một phiên sinh eval đọc chúng, Then cả ba dạy chọn người chấm theo TỪNG VẾ (lệnh đọc được → script/test của kho · chỉ thấy trên màn đang chạy → ui-check · cần cân với ý định trên một tệp → judgment với đúng tệp đó trong inputs · không ai ở đây đọc được → khai giới hạn lúc viết), nói Dấu `(judgment)` của cả AC không đè «executor máy nhất», nói hội đồng đọc trạng thái chứ không đọc lịch sử (diff/patch không là input), và ghi ba bẫy của script luật kho (đo diff xanh rỗng sau gộp · đo trạng thái đỏ oan khi cây đã bẩn → thu phạm vi về `paths:`, script là vật của kho · thước dùng chung phải chạy được ở mọi nhánh vật chạy — thư mục vắng thì im hoặc khai có tên, ca gài tự dựng tệp mục tiêu trong bản sao).
- AC-8 (judgment): Given bên chấm (`skills/acceptance/references/judge-personas.md`) và bên phản biện (câu hỏi chéo bắt buộc của gap-probe trong `feature-loop/skills/feature-loop/SKILL.md`), When đọc cùng `eval-executors.md`, Then không còn mâu thuẫn «judge không nhận diff» vs «tệp mã trong inputs hợp lệ» — cả hai đọc được bằng câu trạng-thái-vs-lịch-sử; câu dặn «>50 % UNCERTAIN → sửa contract ở Gate 1 lần sau» không còn, thay bằng con trỏ tới răng ở bước sinh args; và gap-probe có một ý hỏi eval judgment nào hỏi điều không nằm trong tệp của chính nó, kèm sự thật nền «hội đồng chỉ đọc đúng `inputs`, không diff, không lệnh».

## Coverage

Không chạy skill quét không gian: phạm vi đã chốt ở bản ghi phát hiện §8 (entry
`descope` «bỏ coverage-scan» trong decisions.jsonl). Trục dưới đây dựng từ nhánh
của hàm và các nơi luật sống.

- Trục dạng câu hỏi: hỏi diff của lượt (AC-1) | bảo chạy lệnh, ba dạng (AC-2) | hỏi tài liệu (AC-4 ô 1, AC-1 đối chứng) | hỏi tệp mã có trong inputs (AC-4 ô 2) | chữ «diff» nghĩa khác (AC-4 ô 3) | «đang chạy:» không lệnh (AC-4 ô 4). [thước CE: hai khuôn của bộ dò và các nhánh của chúng]
- Trục dạng YAML của `question`: một dòng (AC-1, AC-2, AC-4) | khối gấp xuống dòng giữa cụm (AC-1). [thước CE: hai đường của bộ đọc `parseEvals` — giá trị dòng và khối]
- Trục `inputs`: tài liệu (AC-1) | tệp mã nguồn (AC-4) | tệp tên «diff» (AC-3). [thước CE: ba loại tệp mà luật trạng-thái-vs-lịch-sử phân biệt]
- Trục nơi luật sống: răng ở bước sinh args (AC-1…AC-4) | một nguồn của bộ dò (AC-5) | tiền đề ở lời giao việc hội đồng (AC-6) | bên viết (AC-7) | bên chấm + bên phản biện (AC-8). [thước CE: tệp có tên trong từng AC]
- Trục kho: kho kit (AC-4 vế bộ hồ sơ thật) | kho tiêu thụ — đo một lần ở bản ghi phát hiện (434 eval, 17 ca, 17/17 đúng), không thành phép đo thường trực vì CI không có các kho ấy. [GIẢ ĐỊNH: kho tiêu thụ không có dạng câu hỏi nào khác lọt bộ dò ngoài hai giới hạn đã khai ở Notes]

## Out of scope

- KHÔNG thêm cảnh báo W9 vào `scripts/eval-coverage-lint.js` và KHÔNG thêm làn trên thẻ Cổng Phạm vi — cùng bộ dò, hai bộ đọc nữa; lint không nằm trên đường feature-loop. Ngưỡng mở: ≥1 hồ sơ mắc dạng này tới được lượt chấm qua đường acceptance trần sau mốc phát hành vòng này.
- KHÔNG thêm bộ đọc khoan dung ở lượt chấm (UNCERTAIN cơ học cho hồ sơ cũ) — hồ sơ đã ký không chạy lại s4-args, không có đường đọc-cũ nào cần.
- KHÔNG mở ô «chỉ người làm được» cho judgment (`[HUMAN — BE thật]`, onehub) — 1 ca, 1 kho. Ngưỡng: ≥2 kho.
- KHÔNG nới hội đồng cho đọc diff hay chạy lệnh; KHÔNG sửa `feature-loop/workflows/acceptance-verify.js`.
- KHÔNG sửa gì ở crm — các phiên crm đã được nhắn đường đi tiếp phía kho.
- KHÔNG chạm `lib/**`, `hooks/**`, lưới trước-merge; KHÔNG tăng phiên bản gói — kit lên số theo mốc phát hành.

## Notes

- Hạng T2: `feature-loop/scripts/**`, `skills/**`, `feature-loop/skills/**`, `tests/**` ngoài `t1_skip_globs`, ngoài `t3_paths`.
- Giới hạn đã khai (chép từ bản ghi phát hiện §8, kèm ngưỡng đang đếm):
  - Bộ dò là ngôn ngữ tự nhiên mà răng là CHẶN → có thể chặn oan. Độ đặc hiệu đo 17/17 trên 434 eval judgment của 10 kho; bản đầu từng bắt nhầm «Trên app QC đang chạy:» nên đã siết (AC-4 ô 4 giữ chỗ siết đó). Ngưỡng nới thành cờ vàng: ≥1 lần chặn oan có tên.
  - Sót tiếng Anh («the changes», «what was modified») — 1/17 ca là tiếng Anh. Ngưỡng mở rộng: ≥2 ca sót đi tới lượt chấm.
  - Sót «Đọc diff …» không kèm từ khoá khác: ranh giới từ `\b` của khuôn không nhận chữ đầu có dấu, nên nhánh «nhìn/đọc/so diff» chỉ bắt «nhìn», «doc», «so», «read». Đo 01/10: sửa ranh giới thêm đúng 2 ca trên 434 (một ca thật, một ca «bản diff đính kèm») — khuôn giữ nguyên bản đã đo, cùng ngưỡng với sót tiếng Anh.
  - Đếm ngưỡng bằng chính lệnh quét của bản ghi phát hiện (`node docs/findings/assets/2026-10-01-quet-judgment-hoi-ngoai-inputs.cjs ~/dev`) — từ vòng này nó nạp bộ dò đang ship (AC-5).
- Bảng dự báo năm dòng (luật (c) chiều rộng; chép từ bản ghi phát hiện §8): thời gian làm-xong→quyết-được ↓ (người thôi tự đọc diff cho mục luật kho) · lượt gọi người/vòng = (7/9 hồ sơ crm là T3, mọi mục judgment đều phải người phán theo thiết kế — eval này không thêm lượt dừng, nó thêm một mục không căn cứ vào lượt có sẵn) · vòng bị hạ tầng đốt lượt chấm = (răng chặn TRƯỚC lượt, không trong lượt) · token máy/vòng ↓ (≈16 lượt hội đồng × 3 giám khảo ở crm cho câu hỏi không trả lời được) · phút máy/lượt chấm =. Điều kiện tin cậy: đường verdict (finder → refute → REJECT) không đổi thành phần — răng nằm trước lượt chấm, `acceptance-verify.js` không đổi (AC-6).
- **Known limits (owner xếp ngăn 01/10 sau lượt chấm 1 — «ok» theo khuyến nghị):**
  - Phạm vi `paths:` của E5 chỉ liệt năm tệp, trong khi nhóm JI12 quét mọi thư mục nguồn; ở một vòng sửa sau, bản sao khuôn dán vào tệp ngoài năm tệp đó có thể được mang PASS cũ sang mà không chạy lại (Ngoài-2). Tương tự E1/E4 không liệt `lib/eval-yaml.cjs`.
  - Kiểm «bộ dò một nguồn» chỉ bắt bản sao chép NGUYÊN chữ một mảnh mỗi khuôn; bản sao viết lại khác chữ hoặc thiếu nhánh thì lọt (Ngoài-3).
  - Răng hồ sơ không chạy bản sao trọn cây xanh trước khi tiêm đột biến; một bản sao hỏng vì hạ tầng có thể in trùng dòng ghim của chiều đỏ (Ngoài-4).
- Ngoài-1 (tên hồ sơ, đường dẫn, commit riêng của crm trong tài liệu skill giao đi) SỬA ở lượt 2 theo quyết định owner: tài liệu giữ luật + số đo, con trỏ nguồn chuyển sang bản ghi phát hiện §10.8.
- Fixture do code sinh trong chính lần chạy; đường dẫn suy từ vị trí script. Bản sao để tiêm đột biến chụp TRỌN cây làm việc; mỗi đột biến là MỘT phép thay thế nguyên văn khai trong design doc; chân đo chứng mũi tiêm trúng (đúng một chỗ khớp, bản sao khác bản thật, mutant chạy được) trước khi chấm; chiều đỏ giữ đủ hai vế: exit ≠ 0 VÀ dòng FAIL có tên ca.
