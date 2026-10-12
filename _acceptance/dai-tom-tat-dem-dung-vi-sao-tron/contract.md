---
schema_version: 1
feature: Ô «chưa làm gì» của dải tóm tắt in đúng số giới hạn đã biết ở mọi hình dạng khối gặp thật trên sáu kho — đầu đoạn bọc dòng, đoạn dẫn trước danh sách, danh sách đánh số, gạch tự mở bằng «known-limits», «None.» — và nói «chưa đọc được» thay vì in số khi khối không theo khuôn; trang hồ sơ đầy đủ hiện trọn mục «Vì sao làm», trần 400 ký tự chỉ áp cho dải một phút
slug: dai-tom-tat-dem-dung-vi-sao-tron
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/ho-so-tom-tat.cjs + scripts/evidence-page.js + references lo-trinh-du-lieu.md + test — không chạm lib/**, hooks/**, lưới trước-gộp
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-12-dai-tom-tat-dem-dung-vi-sao-tron-design.md
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-12T04:13:49Z
---

# Acceptance Contract: dai-tom-tat-dem-dung-vi-sao-tron

## Context

Gốc: acceptance-gate-kit/_acceptance/dai-tom-tat-doc-dung — Ngoài-8 và Ngoài-9, chủ kho chọn «mở hợp đồng mới»
(sổ `d-20261012T033640Z-15`); hạt giống `docs/plans/2026-10-12-hat-giong-dai-tom-tat-sau-x2s.md` mục 1–2. Cổng
Đáng ký «Làm» 12/10. Đo 12/10 trên sáu kho (`do-truoc.md`): ô «chưa làm gì» in sai số giới hạn ở 86 / 661 hồ sơ
theo bốn cơ chế (đầu đoạn bọc dòng hay có đoạn dẫn bỏ cả danh sách · gạch tự mở «known-limits» đếm đôi · báo cáo
đánh số nối thành một, gạch con đếm riêng, khối ghim lại lọt vào · khối nhiều nhóm ra số ngẫu nhiên); 301 hồ sơ
có «Vì sao» dài hơn 400 ký tự mà trang đầy đủ sẽ cắt. Luật chủ kho trong lời giao: «None.»/«Không có» ra 0, đoạn
dẫn không là một mục, không đọc được → «chưa đọc được», không in số. Khuôn, bảng hình dạng, phương án bỏ: design doc.

## Criteria

- AC-1: Given `## Notes` của hợp đồng thử có khối giới hạn dạng đầu đoạn — (a) đoạn văn bọc hai dòng mở bằng «Known limits — …» kết «:» rồi 3 gạch; (b) tiêu đề `### Known limits — …` rồi một đoạn dẫn hai dòng rồi 4 gạch; (c) đoạn văn trơn «Known limits» rồi một đoạn dẫn rồi danh sách đánh số 5 mục (mục có dòng tiếp thụt lề, dòng trắng giữa các mục); (d) tiêu đề rồi HAI đoạn dẫn rồi một danh sách 3 gạch; (e) đầu đoạn văn rồi danh sách 2 gạch, sau đó một đoạn khác và một gạch thường — và (f) một đoạn thường có DÒNG BỌC giữa đoạn tình cờ mở bằng chữ «Known limits», When dựng dải (trang hồ sơ và khối dữ liệu lộ trình), Then bộ đọc đếm lần lượt 3 · 4 · 5 · 3 · 2 · 0 giới hạn; vế giới hạn của ô `chua_lam` là «N giới hạn đã biết» cho (a)…(e) và, ở (f), KHÔNG in «1 giới hạn» mà giữ cờ của vòng trước «giới hạn đã biết: chưa đọc được — Notes nhắc giới hạn sai khuôn» (dòng nhắc chưa thuộc khối nào); mục giới hạn của trang hồ sơ liệt đúng các mục ấy nguyên văn theo thứ tự.
- AC-2: Given khối giới hạn (tiêu đề `###`; đầu đoạn văn) mà mỗi gạch tự mở bằng «known-limits (Ngoài-n, …):» hay «**known-limit (…):**», When dựng dải, Then mỗi gạch đếm đúng MỘT lần (4 gạch → «4 giới hạn đã biết», không phải 8) và trang hồ sơ có đúng 4 dòng giới hạn.
- AC-3: Given mục `## Known limits` của báo cáo thử (hợp đồng không ghi giới hạn) — (a) danh sách đánh số 6 mục, mục bọc dòng thụt lề, dòng trắng giữa mục; (b) 2 gạch «-», mỗi gạch có 2 gạch con lồng; (c) một đoạn dẫn rồi 3 gạch; (d) một đoạn duy nhất; (e) mục rỗng; (f) 2 gạch rồi khối ghim lại rút từ khuôn `REPIN-TEMPLATE` (tiêu đề `### Re-pin lần 1 — …` và dòng `run_id:`/`sha:`) ở cuối báo cáo; (g) 3 gạch phẳng «-» (dạng trước vòng) — When dựng dải, Then vế giới hạn lần lượt 6 · 2 · 3 · 1 · 0 · 2 · 3, và trang hồ sơ liệt đúng các mục ấy.
- AC-4: Given khối giới hạn chỉ ghi «None.», «none», «Không có», «không có.», «*None.*» ở mỗi dạng — tiêu đề rồi đoạn; đầu đoạn văn rồi đoạn; gạch giới hạn trơn; gạch con của gạch giới hạn; mục báo cáo — When dựng dải, Then vế giới hạn ra «0 giới hạn đã biết» ở mọi ca; và gạch «Giới hạn đã biết: không có kênh báo cho người dùng khi thông tin đăng nhập đổi.» ra 1.
- AC-5: Given khối giới hạn hình dạng không đọc được — tiêu đề có tiêu đề con bên trong; tiêu đề có hai danh sách cách nhau một đoạn; đầu đoạn văn rồi HAI đoạn rồi danh sách; mục báo cáo có tiêu đề con không phải ghim lại; mục báo cáo gồm hai đoạn không danh sách — When dựng dải (trang và khối), Then ô `chua_lam` đúng «<N> mục để ngoài phạm vi · giới hạn đã biết: chưa đọc được — khối giới hạn ở hợp đồng không theo khuôn» (nguồn hợp đồng) hay «… ở báo cáo …» (nguồn báo cáo), «… ở hợp đồng và báo cáo …» khi cả hai; khi một nguồn không đọc được mà nguồn kia đọc được 3 giới hạn — cả hai chiều: hợp đồng hỏng + báo cáo 3 gạch, VÀ báo cáo hỏng + hợp đồng 3 gạch — ô vẫn nói «chưa đọc được» (nêu đúng nguồn hỏng) và vế giới hạn không có chữ số nào; mục «Giới hạn và ngoài hợp đồng» của trang không có dòng giới hạn nào mà có đúng câu «giới hạn đã biết: chưa đọc được — …» ấy.
- AC-6: Given bộ ca của hồ sơ đã ký `dai-tom-tat-doc-dung` (`tests/scripts/dai-tom-tat.test.mjs`, DT-1…DT-8, kể cả các ca chiều đỏ tiêm vào mô-đun dải), When chạy trên cây này, Then mọi ca PASS («0 failed») và tệp ca giống từng byte bản ở `bd8163dc` (băm SHA-256 ghim trong ca).
- AC-7: Given bản chụp `_acceptance/` của sáu kho ở mã ghim (kit `bd8163dc` · crm `4c440ab1` · radar `0d355f36` · oneflow `93b0129c` · artifact-platform `92fc58a3` · media-library `75f4bf4a`; `git archive` vào thư mục tạm, không ghi vào kho nào), When dựng ô `chua_lam` của mọi hồ sơ có hợp đồng bằng cây đang kiểm và bằng bộ đọc base (cây `bd8163dc`, `git archive` trọn `scripts lib`), Then tập hồ sơ đổi ô đúng bằng danh sách 91 hồ sơ viết sẵn trong ca (không thừa, không thiếu); mọi hồ sơ khác giống từng ký tự; với MỌI hồ sơ đổi, vế giới hạn bằng số của BỘ ĐẾM ĐỘC LẬP của ca (đếm dòng mở mục cấp ngoài trong khoảng dòng của khối do ca tự cắt, không gọi mô-đun dải) hoặc đúng «chưa đọc được» khi bộ dò độc lập của ca thấy khối nhiều nhóm — in số theo nhóm (đúng số · chưa đọc được · chỉ bỏ cờ vàng) và đủ 15/15 hồ sơ nhiều nhóm nói «chưa đọc được»; danh sách hồ sơ đã soi tay ra đúng giá trị viết sẵn ở cây đang kiểm VÀ đúng giá trị cũ ở base (đối chứng: phép đo phân biệt hai bản); bản sao tách dòng tiếp thụt lề thành mục riêng → ĐỎ nêu tên một hồ sơ thật; thiếu kho hay mã → ĐỎ nêu tên kho.
- AC-8: Given ô cơ hội thử có đoạn lý do (a) năm câu mỗi câu 150 ký tự; (b) một câu đơn hơn 500 ký tự; (c) câu dẫn «Sáu chỗ hở:» rồi sáu mục mở bằng cụm in đậm 90 ký tự kèm câu chi tiết; (d) câu dẫn rồi một bảng ba hàng; (e) đoạn 399 ký tự; và (f) ô cơ hội vắng, đoạn đầu `## Context` của hợp đồng dài hơn 400 ký tự, When dựng trang hồ sơ đầy đủ và dải, Then mục «Vì sao làm» của trang chứa nguyên văn câu thứ năm của (a), trọn câu (b), câu dẫn và đủ sáu mục của (c) kể cả câu chi tiết, các ô của cả ba hàng bảng (d), đúng đoạn (e), trọn đoạn Context (f), và — khi đoạn KHÔNG phải câu dẫn mà có danh sách dính liền ngay dưới (không dòng trắng) — mọi mục của danh sách ấy như trang trước vòng `dai-tom-tat-doc-dung`; còn ô `vi_sao` của dải và của khối vẫn tối đa 400 ký tự và ca (a) đúng hai câu đầu rồi «…» như vòng trước.
- AC-9: Given bản chụp sáu kho như AC-7, When dựng dải và trang hồ sơ đầy đủ bằng cây đang kiểm và bộ đọc base, Then ô `vi_sao` của dải giống từng ký tự base ở mọi hồ sơ; số hồ sơ có ô `vi_sao` kết «…» in ra, không dưới 301; với mọi hồ sơ ấy có báo cáo (nên có trang hồ sơ — số in ra), mục «Vì sao làm» của trang chứa CÂU CUỐI của đoạn lý do mà trang in trước khi có trần (bộ vẽ `7f65e5a0`, `git archive` trọn thư mục) và — khi đoạn là câu dẫn — MỤC CUỐI của danh sách theo sau (bộ tách độc lập của ca); bản sao cắt trang ở ranh câu dưới một trần thứ hai lớn hơn mọi ca AC-8 → ĐỎ nêu tên một hồ sơ thật (số hồ sơ dài hơn trần ấy in ra); tập khoá, kiểu từng khoá và `phien_ban` của khối dữ liệu lộ trình vẽ bằng hai bản trên bản sao crm bằng nhau.
- AC-10: Given tài liệu khối dữ liệu `skills/acceptance/references/lo-trinh-du-lieu.md`, When đọc mô tả ô `chua_lam` và `vi_sao`, Then mô tả khớp hành vi mới — đọc khối giới hạn (danh sách đánh số, đoạn dẫn, gạch con thuộc mục, dừng ở khối ghim lại, «None.» ra 0), câu «chưa đọc được — khối giới hạn ở … không theo khuôn» không kèm số khi một nguồn không đọc được, trần 400 chỉ cho dải và khối còn trang hồ sơ in trọn — không câu nào mâu thuẫn mã. (judgment)

## Coverage

Trục (thước CE: bảng 91 hồ sơ đổi trên sáu kho ở `do-truoc.md` — mỗi hình dạng có ít nhất một hồ sơ thật):

- Nguồn khối giới hạn: Notes đầu đoạn văn · Notes tiêu đề · Notes gạch (không đổi) · mục báo cáo → AC-1, AC-2, AC-3, AC-6
- Hình dạng thân: bọc dòng · đoạn dẫn (một / hai) · đánh số · gạch con lồng · gạch tự mở «known-limits» · khối ghim lại · «None.» · trống · nhiều danh sách · tiêu đề con · nhiều đoạn → AC-1 … AC-5
- Đầu ra: ô dải · khối dữ liệu lộ trình · danh sách giới hạn trang hồ sơ → AC-1, AC-5 (trang + khối), AC-2 … AC-4 (trang)
- Khi không đọc được: một nguồn · hai nguồn · nguồn kia đọc được → AC-5
- Vì sao: dải · khối · trang đầy đủ × nhiều câu · câu dài · câu dẫn + danh sách · câu dẫn + bảng · ngắn · Context → AC-8
- Dữ liệu thật sáu kho trước/sau, đối chứng base → AC-7, AC-9
- Giữ lời hứa đã ký của vòng trước → AC-6
- Tài liệu cho kho tiêu thụ → AC-10
- Bỏ quét bằng skill: entry `descope` «bỏ coverage-scan — …» trong sổ quyết định (không gian hình dạng liệt bằng vi phân 661 hồ sơ thật).

## Đường đo

Ngưỡng nghiệm thu của ô cơ hội (đo trên crm sau khi nhận mốc mang vòng này) đọc bằng MỘT lệnh:
`node tests/scripts/dai-tom-tat-sau-kho.mjs --hien-tai crm=<gốc kho crm>` — chế độ đọc cây hiện tại (không ghim mã,
không so danh sách 91), in bốn số, mỗi vế của ngưỡng một số:

- (i) hồ sơ mà vế giới hạn ≠ bộ đếm độc lập (khối một danh sách) → vế SỐNG «0 hồ sơ cơ chế 1–3 còn số sai» và vế CHẾT «số khác số mục của khối» · AC-7 bảo đảm bộ đếm và bộ dò.
- (ii) hồ sơ bộ dò thấy khối nhiều nhóm mà ô không nói «chưa đọc được» → vế «mọi hồ sơ cơ chế 4 nói chưa đọc được» · AC-5, AC-7.
- (iii) hồ sơ đổi ô so với bộ đọc base mà bộ dò không gán cơ chế nào → vế «hồ sơ không dính cơ chế nào giữ nguyên chữ ô» · AC-7.
- (iv) trang hồ sơ có «Vì sao» quá 400 ký tự mà thiếu câu cuối hay mục cuối → vế «chứa trọn câu cuối» và vế CHẾT «cắt Vì sao làm» · AC-9.

SỐNG = bốn số đều 0. Giới hạn của đường đo, khai thẳng: một hồ sơ mà CẢ bộ đọc lẫn bộ đếm độc lập cùng đếm sai
(hình dạng mới cả hai chưa biết) không hiện ở (i) — bộ đếm là thước thứ hai, không phải người đếm tay.

## Out of scope

- Đọc số bằng chữ trong lời văn («Mười một giới hạn») — kit đếm mục của danh sách, không hiểu câu.
- Cộng mục của khối nhiều danh sách hay chỉ lấy danh sách đầu — máy không phân biệt được nhóm không phải giới hạn; khối ấy nói «chưa đọc được».
- Đổi khuôn khối `lo-trinh-du-lieu` (khoá, kiểu, phiên bản) hay bộ đọc `docDuLieu`; đề nghị LT1b thêm danh sách tiêu chí và câu giới hạn (hạt giống mục 3).
- Sửa `lib/md-section.cjs` (`contentLines`) hay mọi bên gọi khác của nó (thẻ cổng, lint).
- Sửa hồ sơ ở kho tiêu thụ cho đọc được — vật của kho tự lo.
- Ngoài-1, Ngoài-2 của vòng trước (đếm phần «để ngoài phạm vi» viết bằng bảng / dấu sao).

## Notes

- Không CỘNG: không khoá cấu hình mới, không đổi khuôn khối; hai khoá executor mới chỉ trỏ hai tệp ca của vòng.
- Hồ sơ đã ký `dai-tom-tat-doc-dung`: tệp ca của nó không sửa (AC-6) — các dòng mã mà ca chiều đỏ DT-2-do-co,
  DT-3-do-tron-none … tiêm vào giữ nguyên chữ. Bản vẽ `LO-TRINH.html`/`PRODUCT-MAP.md` của kit vẽ lại cùng lượt;
  trang mẫu của hồ sơ đã ký nào mang dải của hồ sơ kit đổi ô thì ghim lại bằng làn trước khi gộp (tiền lệ X2).
- Giá đã biết của luật «khối nhiều danh sách → chưa đọc được»: crm `bo-dung-khong-ket` (8) và radar `doc-mang-v0`
  (32) hôm nay đếm đúng nhờ may, sau vòng nói «chưa đọc được» (`do-truoc.md`).
- S4 chạy trên nhánh chồng với gốc so = đỉnh nhánh `vong/dai-tom-tat-doc-dung` (phiên điều phối 12/10, cắt mốc sớm); #325 mang cả #324, gộp một lần.
- Known limits — chọn ở Cổng Bằng chứng 2026-10-12:
  - Ngoài-1: Nếu sau này trang hồ sơ đầy đủ lỡ in thừa phần đầu «Vì sao: Gốc: …» trước lý do thật, bộ kiểm tự động hiện tại vẫn báo xanh; hôm nay trang vẫn hiện đủ lý do.
  - Ngoài-2: Bộ kiểm chưa thử với ô cơ hội do chính lệnh mở ô sinh ra; nếu câu giao tự sinh lọt vào ô «Vì sao», người đọc dải thấy câu giao thay cho lý do thật mà bộ kiểm vẫn xanh.
  - Ngoài-3: Phép thử «làm hỏng rồi xem báo đỏ» cho lỗi đếm đôi giới hạn có thể báo xanh dù lỗi tiêm vào không phải lỗi đếm đôi — sản phẩm vẫn đếm đúng, bằng chứng chiều đỏ yếu hơn vẻ ngoài.
  - Ngoài-4: Lệnh đọc ngưỡng nghiệm thu trên crm chỉ kiểm câu cuối của lý do làm, chưa kiểm mục cuối của danh sách đi kèm.
  - Ngoài-7: Khi mục giới hạn của hồ sơ chỉ là một bảng, ô báo «1 giới hạn đã biết» và trang in cả bảng thành một dòng dính thay vì nói «chưa đọc được»; chưa hồ sơ thật nào dính.
  - Ngoài-8: Nếu bộ đọc ném lỗi trên vài hồ sơ, phép đo trên sáu kho lặng lẽ bỏ qua chúng và vẫn báo xanh; hôm nay không hồ sơ thật nào gây lỗi.
  - Ngoài-9: Hai phép thử chiều đỏ (đếm đôi giới hạn, nguồn hỏng là báo cáo) ghim một chữ mà câu báo lỗi luôn tự in ra, nên có thể báo «bắt được» cho bất kỳ lỗi nào.
  - Ngoài-10: Phép đo sáu kho tự khai «19 hồ sơ đã kiểm mục cuối» trong khi chỉ 18 được so — một hồ sơ crm bộ tách không tách được vẫn được tính.
  - Ngoài-11: Phép thử khối «ghim lại» lấy mẫu từ tài liệu hướng dẫn chứ không từ chính công cụ sinh ra khối đó; công cụ đổi tiêu đề mà tài liệu giữ nguyên thì phép thử vẫn xanh.
  - Trong-1: Câu tài liệu về dạng «Vì sao: Gốc: … — lý do» chưa khớp mã ở ca hiếm phần con trỏ có dấu gạch dài không cách — ô giữ cả dòng thay vì chỉ lấy lý do; hôm nay 0 hồ sơ thật dính (lỗi trong hợp đồng mức thấp của lượt chấm 3, không chặn PASS, chủ kho nhận qua chữ «ký»).
- Ngoài-5 (Cổng Bằng chứng 2026-10-12): chấp nhận, không sửa — hai phép thử chiều đỏ của bộ đo sáu kho không đòi bản lành xanh trước; kết quả tổng vẫn đỏ khi có lỗi thật.
- Mở hợp đồng mới (Cổng Bằng chứng 2026-10-12) — Ngoài-6 ghi thành hạt giống `docs/plans/2026-10-12-hat-giong-dau-doan-gioi-han-khong-hai-cham.md` (không tạo ô).
