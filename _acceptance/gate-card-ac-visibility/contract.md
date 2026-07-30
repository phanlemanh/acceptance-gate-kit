---
schema_version: 1
feature: Card Cổng 1 phải hiện ĐỦ criterion contract khai — hoặc kêu to khi không đọc được
slug: gate-card-ac-visibility
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-07-30T01:09:13Z
time_human_minutes: {gate1: 10, gate2: 10}
---

# Acceptance Contract: gate-card-ac-visibility

## Context

`gate-card.js` bóc criterion từ `## Criteria` bằng một regex đòi đúng khuôn
template (`- AC-1: GWT`, colon dán ngay sau id). Contract thật đã trôi sang
những khuôn khác (`**` bọc id, ngoặc nhãn chen giữa id và colon, `.` thay `:`).
Regex không khớp thì hàm **trả mảng rỗng, không throw** — card Cổng 1 render
thiếu criterion hoặc trắng hẳn mà vẫn `approvable: true`, exit 0.

Đo trên repo tiêu thụ artifact-platform (170 contract) + repo này (6 contract):
**916 → 1246 dòng criterion đọc được (+330, 28% đang vô hình)**. 43 contract ra
0 criterion; **11 contract ra danh sách CỤT** — `radar-d3-crawl-cron` đã được ký
Cổng 1 trên card hiện `[AC-1, AC-8]` trên tổng 8. Ca cụt sống lâu hơn ca rỗng
vì nó trông bình thường, không xin được chú ý. Trong chính repo này,
`cross-feature-claim-index` dùng heading `## Acceptance criteria` nên card ra
**0 criterion**, và Cổng 2 đã ký ngày 2026-07-29 trong tình trạng đó.

Source input: prompt (phiên 2026-07-29/30) · [artifact-platform#321](https://github.com/phanlemanh/artifact-platform/pull/321) · [kit#18](https://github.com/phanlemanh/acceptance-gate-kit/pull/18)

**Contract này viết SAU khi mã đã tồn tại** (nhánh `fix/ac-bullet-regex-widen`,
commit `c9cd5c3`+`3a80983`) — đúng anti-pattern mà chính skill này cảnh báo
("criteria mold themselves to what was built"). Hai việc để nó không thành hình
thức: criterion rút từ **hiện tượng đo được** chứ không từ diff, và **AC-5 cố ý
nằm NGOÀI mã hiện có** — nó là bài học lõi (rỗng-mà-câm) mà bản vá regex mới chỉ
chữa triệu chứng. Duyệt AC-5 = mở rộng PR#18.

## Criteria

- AC-1: Given **corpus fixture** giữ trong repo, mỗi dòng kèm giá trị `id` / `gwt` / `judgment` mong đợi ghim sẵn, phủ 5 khuôn hợp lệ (`- AC-1: GWT` · `- **AC-1 (nhãn):** GWT` · `- **AC-10** (judgment) GWT` · `- AC-1 (F1): GWT` · `- **AC-1.** GWT`) và ≥2 dòng-không-phải-criterion, When `gate-card.js` bóc, Then khớp ĐÚNG bảng ghim — cả ba trường, không chỉ "khác rỗng". Corpus phải nằm trong repo vì contract của chính kit chỉ dùng 2/5 khuôn (đo 2026-07-30: 88 dòng `- AC-n:` + 13 dòng `- **AC-n**`), nên chạy eval trên `_acceptance/` của kit là gần như rỗng nghĩa. Đối chứng dương: dòng văn xuôi chỉ NHẮC id ở giữa câu (`- **Đ — đường đo** (CE: …): AC-6, AC-11`) ra 0 criterion.
- AC-2: Given tập contract thật của cả hai repo (kit + artifact-platform) mà parser CŨ đọc được ≥1 dòng, When parser mới chạy trên cùng tập đó, Then tập `id` mới **bao** tập cũ — **0 dòng mất**. Đây là bất biến phân biệt "nới thước" với "bắt bừa"; thiếu nó thì mọi con số "+N criterion" đều vô nghĩa.
- AC-3: Given một dòng mà CẢ HAI parser cùng đọc được, When so cờ `judgment`, Then hai bên y hệt — **0 lật NGOÀI luật code-span nói ở cuối criterion này** (luật đó theo định nghĩa lật đúng những dòng trích dẫn dấu; "0 lật" trơ sẽ tự mâu thuẫn với nó). Given dòng chỉ parser MỚI đọc được (330 dòng không có mốc so cũ), Then cờ `judgment` khớp giá trị ghim trong corpus fixture của AC-1 — không có baseline thì phải có bảng ghim, nếu không 330 dòng mới vào card với cờ chưa ai kiểm. Given nhãn chứa chữ judgment (`- AC-5 (chi phí có trần — judgment): …`), Then `judgment` = true. Given thân criterion BÀN VỀ judgment nhưng không mang dấu `(judgment)`, Then `judgment` = **false** — một Then-clause nhắc chữ judgment không được âm thầm hạ một criterion máy-kiểm-được xuống human-only. Đối chứng dương cho vế cuối: thêm dấu judgment vào cuối chính dòng đó → true. Given dấu judgment xuất hiện **bên trong code span backtick** (criterion đang TRÍCH DẪN cái dấu, không mang nó — vd chính AC-1 và AC-3 của contract này), Then **không** tính là dấu; cùng luật `lib/context-glossary.js` đang dùng cho W6 ("code span không phải tiếng nói của tác giả"). Đo 2026-07-30 trên 178 contract của cả hai repo: 157 dòng criterion mang dấu, chỉ 4 dòng có dấu nằm hoàn toàn trong backtick — 2 là AC-1/AC-3 của chính contract này (đổi đúng chiều), 2 còn lại vẫn giữ judgment qua nhánh nhãn nên KHÔNG bị declassify.
- AC-4: Given corpus fixture của AC-1, When cho CẢ HAI lối gọi trong `gate-card.js` (đường card Cổng 1 và đường `critText` của Cổng 2) bóc cùng corpus đó, Then hai bên trả **cùng một tập** `id` → `gwt`. Đo bằng HÀNH VI chứ không bằng grep đếm regex: assertion vắng-mặt-một-mình (grep "không còn chuỗi X") là đúng lớp mà CLAUDE.md #4 cấm — viết lại khuôn bằng cú pháp khác thì grep vẫn xanh trong khi hai lối gọi đã trôi khỏi nhau, chính là điều kiện sinh ra lớp lỗi này. Đối chứng dương: bản sao cho một lối gọi dùng khuôn hẹp hơn → case ĐỎ nêu đích danh dòng lệch.
- AC-5: Given một `contract.md` chứa ≥1 dòng hình dạng khai-báo-criterion — quét **trong section `## Criteria` khi section đó tồn tại, quét CẢ FILE khi không** — nhưng parser bóc ra **0** criterion, When render card Cổng 1, Then card **nêu rõ** rằng không đọc được criterion nào, kèm số dòng nghi vấn và heading của section criterion mà nó ĐÃ tìm. **Rỗng phải KÊU, không được câm.** Phạm vi hai-nhánh là có chủ đích: nhánh CẢ FILE tồn tại vì ca heading-lệch (`## Acceptance criteria` ⇒ `section()` trả rỗng ⇒ không còn section để bám) — đúng ca đã sinh ra feature này; nhánh TRONG-SECTION tồn tại vì quét cả file ở contract lành sẽ đếm nhầm ghi chú dạng `- **AC-4** — …` trong Known limits thành khai báo (đo: `s4-scope-triage` báo giả 15/16). Đối chứng dương: contract khuôn chuẩn đọc ra ≥1 criterion → KHÔNG có cảnh báo nào (không cry-wolf).
- AC-11: Given một contract mà parser bóc ra `n ≥ 1` criterion nhưng file có `m` dòng nghi vấn với `m > n`, When render card Cổng 1, Then card nêu rõ đang đọc **thiếu** `m − n` dòng và liệt số dòng bỏ sót. **Ca CỤT nguy hiểm hơn ca RỖNG** — card 0 criterion sai lộ liễu và bị bắt ngay, card `[AC-1, AC-8]` trên tổng 8 trông bình thường nên sống sót qua chữ ký (đã xảy ra thật: `radar-d3-crawl-cron`). AC-5 một mình KHÔNG phủ ca này vì `n ≥ 1`. Đối chứng dương: contract mà `m = n` → KHÔNG cảnh báo.
- AC-6: Given mọi `_acceptance/*/contract.md` trong repo này, When soi heading của section criterion, Then đều là `## Criteria` — kit không được mang chính con bọ nó tồn tại để bắt. Đối chứng dương: đổi một heading thành `## Acceptance criteria` → case ĐỎ, và thông điệp nêu đích danh file.
- AC-7: Given bản mirror `plugins/acceptance-gate/scripts/gate-card.js`, When `sync-plugin-packages.sh --check` chạy, Then mirror khớp nguồn — vá một bên mà quên bên kia là lỗi đã lặp ở repo này.
- AC-8: Given fixture card mẫu của `s4-scope-triage` (`evidence/out-of-contract-card-sample.md`), When sinh lại bằng `gate-card.js` đã vá trong cùng lần chạy, Then khớp **byte-đối-byte** — nới parser KHÔNG được làm trôi khuôn render. Regression guard cho tài sản của slug khác.
- AC-9: (judgment) Given card Cổng 1 render từ một contract dùng khuôn nhà-phong (`- **AC-n (nhãn):** …`), When một người quyết kinh doanh (không đọc code) đọc card, Then phần nhãn trong ngoặc đọc ra như thông tin bổ trợ của criterion chứ không thành rác chen ngang câu — vì `gwt` giờ mang cả nhãn.
- AC-10: (judgment) Given cảnh báo của AC-5 hiện trên card, When người duyệt Cổng 1 đọc nó, Then họ hiểu **card đang không tin được** và biết việc phải làm tiếp (sửa contract, không phải bấm duyệt) — cảnh báo mà người ta lướt qua thì bằng không có.

## Coverage

- Trục khuôn dòng criterion: template chuẩn | `**` bọc id | ngoặc nhãn chen giữa | `.` thay `:` | `**` đóng TRƯỚC nhãn | văn xuôi chỉ nhắc id [thước CE: AC-1 — bảng biến thể rút từ 176 contract thật, không phải khuôn tự nghĩ]
- Trục bất biến khi nới thước: bao-tập (0 mất) | cờ judgment không lật | 0 false-positive [thước CE: AC-1/AC-2/AC-3 — ba tính chất này mới là thước; "+330 criterion" chỉ là hệ quả]
- Trục cái-chưa-biết: khuôn lạ trong section | heading lệch nên KHÔNG CÓ section → cả hai phải KÊU chứ không câm [thước CE: AC-5 — trục tồn tại vì AC-1 theo bản chất chỉ phủ được cái đã thấy; vế heading-lệch là ca đã sinh ra feature này]
- Trục mức mù: RỖNG (n=0) | CỤT (n≥1 mà m>n) | ĐỦ (m=n) [thước CE: AC-5/AC-11 — ca CỤT là ca đã lọt qua chữ ký thật (`radar-d3-crawl-cron` 2/8), AC-5 một mình không phủ nó]
- Trục cry-wolf: contract lành KHÔNG được sinh cảnh báo, ở CẢ hai luật [thước CE: AC-5 + AC-11, vế đối chứng dương]
- Trục một-nguồn-sự-thật: khuôn định nghĩa 1 chỗ | mirror đồng bộ [thước CE: AC-4/AC-7]
- Trục không-trôi tài sản slug khác: khuôn render giữ nguyên byte [thước CE: AC-8]
- Trục dogfood: contract của chính kit không mang con bọ [thước CE: AC-6]
- Trục người-đọc-gate: nhãn trong `gwt` đọc được | cảnh báo rỗng đủ sức đổi hành vi người duyệt [thước CE: AC-9/AC-10]

## Out of scope

- **Nới `section()` để nhận `## Acceptance Criteria`.** CỐ Ý không làm. Heading giữ CHẶT, cái rỗng làm KÊU TO (AC-5) mới là lối chữa: nhận thêm alias thì mỗi lần trôi lại thêm một alias, và khi trượt vẫn câm y như cũ. Repo tiêu thụ chuẩn hoá heading về `## Criteria` (artifact-platform#321, 52 file).
- **Vá lỗ T1-escape bị treadmill re-pin tháo ngòi** (`pre-merge-check.sh:848` — `gate_touched=1` khi diff có BẤT KỲ file `_acceptance/*`). Thật, tái lập được, nhưng là luật khác và chạm `t3_paths` — slug riêng.
- **Rewrite dòng criterion của contract đã `signed-off`** ở repo tiêu thụ. Sửa thước, không sửa sổ đã ký — nhoè audit trail.
- **25 contract bố cục khác** ở artifact-platform (`## AC — Gói B`, `## 1. AC`, criterion nằm thẳng dưới H1). Là restructure contract, không phải việc của parser. AC-5 sẽ làm chúng KÊU.
- **Đổi khuôn render của card** (bố cục, nhãn, thứ tự khối). AC-8 khoá chiều này lại.
- **Hồi tố chữ ký đã đặt trên card cụt/rỗng.** Re-pin không làm được việc đó; muốn chữ ký dựa trên criterion thật thì phải xem lại card — quyết định của người, ngoài phạm vi máy.

## Đổi id case khi tích hợp với main (2026-07-30)

Merge `origin/main` vào nhánh này thì `P58` đụng case đã có sẵn trên main
(`smoke ban MIRROR: gate-card cua plugin chay that`). Case của slug này dời
thành **P65–P71**:

| trước | P58 | P59 | P60 | P61 | P62 | P63 | P64 |
|---|---|---|---|---|---|---|---|
| **sau** | **P65** | **P66** | **P67** | **P68** | **P69** | **P71** | **P70** |

`evidence-report.md` của vòng verify 1 và 2 **giữ nguyên id cũ** — nó ghi đúng
cái đã chạy tại thời điểm đó, sửa lại là viết lại lịch sử. Dùng bảng trên để
tra khi đọc hai vòng đó.

## Known limits (người duyệt chốt ở Cổng 2 — 2026-07-30)

Bốn **nợ THƯỚC**, không phải lỗi tính chất. Verify vòng 2 (context sạch) đo tay
từng cái và xác nhận tính chất ĐÚNG; chỗ thiếu là eval không chạm tới. Manh chọn
ghi nhận thay vì tiêu vòng 3. **Không mục nào bị bỏ im lặng** — mỗi mục dưới đây
có bằng chứng đo tay kèm theo, và mục 2 là nợ ĐÃ TỪNG được đánh dấu "fixed" sai
một lần, nên nó được ghi to hơn ba mục kia.

1. **Chế độ CI đo ít hơn AC-2 khai.** `AC_EXTRA_CORPUS_ROOT` là opt-in; CI không
   có repo tiêu thụ. CI phủ +19 dòng, bật env phủ +427; `LOST=0` cả hai chiều nên
   bất biến bao-tập ĐÚNG trên cả hai repo — chỉ là CI không chứng minh được. Có
   dòng `PHAM-VI:` in ra khi thiếu env, nên phạm vi hẹp được KHAI chứ không im
   lặng. **Khai không phải là phủ** — đừng đọc dấu xanh CI như đã phủ 170 contract.
2. **Vế "2 dòng repo tiêu thụ" của AC-3 không được đo, kể cả khi bật env.** P67 bỏ
   qua mọi dòng khuôn CŨ không đọc được (`if(!o) continue`), mà hai dòng đó
   (`- **AC-2 (LÕI — …, judgment):**` ở `creator-choicecard` và
   `ds-debt-artifact-table`) đúng là loại đó. Grader đo trực tiếp: cả hai
   `OLD_MATCH=false`, `parseAC.judgment=true`; quét độc lập 177 contract cho
   `TAGGED=162 CODESPAN_ONLY=4`, khớp con số contract khai. **`FLIP=0` sẽ vẫn xanh
   y hệt nếu hai dòng đó biến mất** — đó là dấu hiệu thước không chạm.
3. **Vế "thông điệp nêu đích danh file" của AC-6 chưa có case đỏ.** Đối chứng của
   P70 chỉ chứng minh phép grep bắt được bản sao đổi heading, không chứng minh
   thông điệp có nêu tên file.
4. **Đối chứng script của P66 canh nhánh GAINED, không canh nhánh LOST** như
   `expected` mô tả. Grader kiểm tay: nhánh LOST CÓ nổ và CÓ nêu tên dòng — nên
   đây là nợ script-hoá, không phải phép đo rỗng.

## Notes

**Phân hạng — cần Manh chốt ở Cổng 1.** Máy tính ra **T2**: `scripts/gate-card.js`
không nằm trong `risk_tiers.t3_paths` (chỉ có `hooks/**`, `lib/**`,
`pre-merge-check.sh`, `recheck-evidence.js`). Tôi đặt **T3** vì lý do tồn tại của
`t3_paths` được ghi ngay trên nó — *"bug ở đây biến thành false-green im lặng
trên MỌI repo tiêu thụ"* — và đó là mô tả nguyên văn việc `gate-card.js` vừa gây
ra trên artifact-platform. Hai lối đi, Manh chọn:
- giữ T3 cho slug này (mọi judgment item cần phán trực tiếp của người ở Cổng 2), **và** thêm `scripts/gate-card.js` vào `t3_paths` — sửa gốc phân hạng; hoặc
- hạ về T2 nếu đánh giá card là lớp trình bày nên rủi ro thấp hơn lõi cưỡng chế.

**Sửa contract SAU Cổng 1 — hai chỗ, khai báo tường minh.** Cả hai do implement
chứng minh bản duyệt viết chưa đúng, không phải nới scope:
1. AC-5 ban đầu ràng "quét CẢ FILE". Đo thấy quét-cả-file luôn có một lớp báo
   động giả: ghi chú dạng `- **AC-4** — …` trong Known limits là hình dạng khai
   báo nhưng không phải khai báo (`s4-scope-triage` dòng 88 → báo giả 15/16).
   Sửa thành: quét trong section khi có section, quét cả file khi không —
   giữ nguyên ca heading-lệch mà AC-5 sinh ra để bắt.
2. AC-3 ban đầu ghi "0 lật" trơ, tự mâu thuẫn với chính vế code-span của nó
   (luật đó theo định nghĩa lật đúng những dòng trích dẫn dấu). Sửa thành
   "0 lật NGOÀI luật code-span"; case P67 ghim đúng nghĩa đó.

**Ba hành vi lộ ra khi implement, đều đã nằm trong corpus của AC-1** (không mở
criterion mới): dòng tham-chiếu-chéo (`**AC-5, AC-9, AC-10 …**`) không được ra
criterion; dòng id-trần không có thân (`- **AC-11**`) không được ra criterion
`gwt = "*"`; và khuôn phải sống ở `lib/ac-line.js` để hai lối gọi không thể trôi.
