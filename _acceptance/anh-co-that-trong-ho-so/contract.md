---
schema_version: 1
feature: Thẻ Cổng Bằng chứng và trang bằng chứng chỉ tính một ảnh khi tệp có thật dưới evidence/ của chính hồ sơ; đường ra thư mục lượt chấm, đường tuyệt đối hay tệp không có thì báo thiếu ảnh kèm nguyên nhân
slug: anh-co-that-trong-ho-so
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: signed-off
design_doc: docs/superpowers/specs/2026-10-22-anh-co-that-trong-ho-so-design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-22T08:55:52Z
---

# Acceptance Contract: anh-co-that-trong-ho-so

## Context

Thẻ Cổng Bằng chứng tính một eval ui-check «đạt — xem frame ở trang bằng chứng» chỉ từ chuỗi `screenshot:` trong báo
cáo; không bước nào kiểm tệp. Ở một kho tiêu thụ (22/10) hai hồ sơ đã ký được tính «có ảnh» mà không chứa ảnh nào, và
26/293 đường trỏ ra thư mục lượt chấm hay đường tuyệt đối của máy khác. Hai hồ sơ ấy là ca gốc của hạt giống
`docs/plans/2026-10-22-hat-giong-the-tin-chuoi-anh-khong-kiem-tep.md`, không phải lần gặp thêm. Vòng mở vì chủ kho báo
22/10, qua phiên giám sát đợt, rằng lỗi gặp thêm ở máy M5 — đúng ngưỡng «≥ 1 lần nữa» của hạt giống. Tên ca M5 (kho, hồ
sơ, eval) không chép vào đây: ca thuộc một kho riêng tư, kho kit công khai (cùng luật ẩn danh hạt giống đã áp). Gốc: `_acceptance/lop-bang-chung-nhin-thay/`
(AC-4; ca LNT4(b) đang ghim chỗ hở thành hành vi đúng).

Source input: prompt — phiên giám sát đợt chuyển lời chủ kho 22/10; thiết kế ở `design_doc`.

Fixture chung của AC-1…AC-6: hồ sơ `x`, `surfaces: [ui]`, evals có eval ui-check E10 (AC-3, AC-5 thêm E11), báo cáo
dựng từ vùng chép của `evidence-report-template.md` với khối rút từ marker `UI-CHECK-BLOCK-TEMPLATE`, `exit_code: 0`.
«Ảnh thật» = tệp thường > 0 byte do ca ghi trong lượt.

## Criteria

- AC-1: Given fixture chung và lần lượt từng hàng giá trị `screenshot:` × trạng thái tệp — `evidence/E10-step1.png` có thật · `./evidence/E10-step1.png` có thật · `E10-step1.png` (tên trần) có thật · `evidence/E10-step1.png   # chú thích` có thật · `"evidence/E10-step1.png"` (nháy kép) có thật · `'./evidence/E10-step1.png'` (nháy đơn) có thật, When chạy `gate-card.js --extract`, Then mỗi hàng cho `ui_observed` `present: true`, `passed: 1` và không có khoá `thieu_anh`.
- AC-2: Given fixture chung và lần lượt từng hàng thiếu — đường tuyệt đối trỏ một tệp CÓ THẬT · `~/E10.png` · `C:\w\E10.png` · `.acceptance-runs/x/evidence/E10-step1.png` có thật · `evidence/../../y.png` · `https://h/E10.png` · `docs/E10.png` · `evidence/sub/E10.png` · `evidence/E10-step1.txt` · `evidence/E10-step1.png` không có tệp · cùng đường là một thư mục · tệp 0 byte · liên kết mềm trong `evidence/` trỏ ra ngoài hồ sơ, When chạy `gate-card.js --extract`, Then mỗi hàng cho `present: false`, `passed: 0`, `thieu_anh` đúng một mục `{id: "E10", gia_tri, ly_do}` với `gia_tri` là giá trị đã bỏ chú thích và `ly_do` đúng chuỗi nguyên nhân của bảng luật trong design doc cho hàng ấy.
- AC-3: Given fixture chung với E10 có ảnh thật và E11 trỏ `.acceptance-runs/…`, When chạy thẻ (`--extract` và HTML), Then `present: true`, `passed: 1`, `thieu_anh` chỉ có E11; HTML có dòng «Bằng chứng lớp nhìn-thấy: 1 eval ui-check đạt (E10) — xem frame ở trang bằng chứng.» và một cờ «Bằng chứng lớp nhìn-thấy: THIẾU ảnh» nêu E11, giá trị và nguyên nhân.
- AC-4: Given mọi hàng thiếu của AC-2, When render HTML thẻ, Then HTML có cờ «Bằng chứng lớp nhìn-thấy: KHÔNG có» nêu E10, giá trị và nguyên nhân của hàng, và KHÔNG có cụm «xem frame ở trang bằng chứng».
- AC-5: Given cùng các fixture của AC-1, AC-2, AC-3, When chạy `evidence-page.js`, Then với mỗi eval tập `src` của `<img>` trên trang khác rỗng khi và chỉ khi thẻ tính eval đó đạt, mọi `src` trỏ một tệp có thật dưới `evidence/` của hồ sơ, và mỗi mục `thieu_anh` của thẻ hiện thành một cờ đỏ «Thiếu ảnh:» mang đúng giá trị và nguyên nhân; trang không in câu «downgrade sang judgment» cho eval có `screenshot:`; đối chứng: eval ui-check `exit_code: 0` không có dòng `screenshot:` và hồ sơ không có ảnh → trang VẪN in câu ấy, thẻ `present: false` và không có khoá `thieu_anh`.
- AC-6: Given hai hình dạng thật đã ẩn danh — (A) hai eval ui-check E10, E11 `exit_code: 0` trỏ `evidence/E10-step1.png`, `evidence/E11-step1.png`, `observed:` nói đã đọc 8 ảnh, hồ sơ không có thư mục `evidence/`; (B) eval E6 mang `carried_from_round: 1` trỏ `.acceptance-runs/x/evidence/e6-1280.png` mà tệp có ở đó, cùng một eval E7 trỏ đường tuyệt đối vào một worktree khác có tệp thật, When chạy thẻ và trang, Then (A) cờ KHÔNG có nêu E10 và E11 với nguyên nhân `tệp không có trong evidence/ của hồ sơ`, trang 0 `<img>`; (B) cờ KHÔNG có nêu E6 nguyên nhân `thư mục lượt chấm (.acceptance-runs/)` và E7 nguyên nhân `đường tuyệt đối`, trang 0 `<img>` và hai cờ «Thiếu ảnh:».
- AC-7: Given bản sao trọn `scripts/` + `lib/` của kit trong thư mục tạm, lần lượt tiêm (i) thẻ quay về luật chuỗi-có-mặt, (ii) bộ xét ảnh bỏ kiểm tệp có thật, (iii) trang bỏ gọi bộ xét ảnh, When chạy ca đo AC-2 và AC-5 trên bản sao — SAU khi bản sao chưa tiêm xanh trên cùng fixture — Then mỗi nhát tiêm làm ca đo đỏ với thông điệp nêu đúng tên hàng bị lật, và ca kiểm riêng rằng chuỗi tiêm có mặt và chuỗi gốc vắng trong bản sao.
- AC-8: Given hồ sơ có ảnh thật đúng chỗ (hàng đầu AC-1) và các ca LNT4 (a1–a3, c, d, e) của hồ sơ gốc, When chạy thẻ và trang bằng bản vòng này và bằng bản `main` trước vòng (`git archive` trọn `scripts lib`), Then HTML thẻ, `--extract` và các `src` của trang trùng khớp từng byte giữa hai bản; ca LNT4(b) ghi tệp ảnh thật và vẫn xanh.
- AC-9: Given một thư mục kho khai bằng biến `KHO_DO` hoặc tệp cục bộ của máy `.acceptance-runs/kho-do` (thư mục ấy nằm trong `.gitignore`; lệnh không có đường mặc định), When chạy `node tests/scripts/anh-co-that-kho.mjs`, Then lệnh in số hồ sơ có eval ui-check, số hồ sơ bản `main` trước vòng tính `ui_observed.present: true`, số bản vòng này tính `present: true`, `doi` = số hồ sơ cũ true → mới false, và `du-kien` = số hồ sơ cũ true mà phép đếm độc lập (viết riêng trong lệnh, không gọi bộ xét ảnh của kit) thấy KHÔNG eval ui-check `exit_code: 0` nào có ảnh thật dưới `evidence/`; `doi` = `du-kien`; hồ sơ có đủ ảnh không đổi; lệnh chỉ in số và nguyên nhân gộp, không in tên hồ sơ hay đường máy; không khai kho hay thư mục vắng → thoát 2 kèm «không có kho để đo». Trên kho tổng hợp do code sinh (hồ sơ đủ ảnh · hồ sơ trộn · hồ sơ hết ảnh) lệnh in `doi 1 · du-kien 1` và `khong-doi-khi-du-anh 2/2`; trên kho tiêu thụ có mặt trên máy, số in ra là giá người ký thấy.

## Coverage

- Trục A — giá trị `screenshot:`: tương đối trong hồ sơ | `./` | tên trần | kèm chú thích | tuyệt đối | thư mục lượt chấm | `..` | URL | thư mục khác | thư mục con | đuôi lạ [thước CE: hai ca thật + 26+9 đường hỏng đo ở hạt giống]
- Trục B — tệp: có > 0 byte | không có | thư mục | 0 byte | liên kết mềm ra ngoài | `evidence/` vắng hẳn [thước CE: `fs.statSync` / `fs.realpathSync` của Node]
- Trục C — tập eval: 1 đạt | 1 thiếu | trộn | exit ≠ 0 (ca LNT4 sẵn có)
- Trục D — mặt đọc: thẻ `--extract` | thẻ HTML | trang — đo trên CÙNG fixture
- Chân ngành: [NGÀNH: Playwright HTML reporter] — tệp đính kèm được chép vào thư mục báo cáo; đường ngoài báo cáo không là bằng chứng của báo cáo.
- Later: cho phép thư mục con trong `evidence/` (trang hôm nay đã từ chối; giữ nguyên). Never: kiểm điểm ảnh; tự chép ảnh từ thư mục lượt chấm về hồ sơ.

## Out of scope

- Bên viết: tác tử chấm ui-check ghi ảnh vào thư mục lượt chấm rồi không chép về hồ sơ — vòng này chỉ làm bên đọc nói thật.
- Hook ký (`hooks/acceptance-evidence-gate.js`, `lib/evidence-core.cjs`) không chặn chữ ký vì thiếu ảnh.
- Không kiểm nội dung hay định dạng thật của ảnh.
- Không sửa hồ sơ đã ký ở kho nào; thẻ của chúng nói thật khi vẽ lại.

## Notes

- Ca đo: `tests/plugins/lop-nhin-thay.test.mjs` ca LNT7 (AC-1…AC-5), LNT8 (AC-6, AC-8), LNT9 (AC-7) — tự đăng ký vào suite
  plugins qua `--ids`. AC-9: `tests/scripts/anh-co-that-kho.mjs` — vế kho tổng hợp đo bằng ca LNT10 (trong suite);
  vế kho thật chạy tay với `KHO_DO`, không vào suite (vắng → mù), chỉ in số.
- Known limits — chọn ở Cổng Bằng chứng 2026-10-22:
  - Ngoài-1: Lệnh đo kho thật báo «khớp» (thoát 0) cả khi không so được hồ sơ nào — người chạy tay phải đọc dòng «lỗi đọc» và số hồ sơ.
  - Ngoài-2: Ảnh có dấu thăng, dấu hỏi hay phần trăm trong tên vẫn được thẻ tính là có ảnh, nhưng trang bằng chứng hiện ảnh vỡ.
  - Ngoài-4: Hồ sơ khai sai đường ảnh nhưng vẫn có ảnh đúng tên theo mã eval: thẻ tính có ảnh, còn trang lại hiện cờ đỏ nói thẻ không tính.
  - Ngoài-5: Trùng Ngoài-1 — lệnh đo kho báo «khớp» khi mọi thẻ lỗi hoặc kho không có hồ sơ nào cần so.
  - Ngoài-7: Một phép kiểm của ma trận so tập chuỗi có mặt thay vì quan hệ giá trị với nguyên nhân, nên một lệch ghép cặp có thể lọt.
  - Ngoài-8: Ma trận viết trước thiếu dạng đường mạng `\\máy\…` của hàng «đường tuyệt đối».
- Hạt giống cho Ngoài-4 và Ngoài-1/5 (ghi sau chữ ký 22/10): `docs/plans/2026-10-22-hat-giong-anh-co-that-con-lai.md`.
