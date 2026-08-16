# Cổng chặn nhầm chỗ — làn V qua được biên merge · chữ ký lấy provenance từ forge

*Hồ sơ `cong-chan-nham-cho` · **T3** (đụng `scripts/pre-merge-check.sh` +
`hooks/`-lân cận) · 2026-08-16 · từ hạt giống
[2026-08-16-hat-giong-go-lop-chung-minh-chu-ky.md](../../plans/2026-08-16-hat-giong-go-lop-chung-minh-chu-ky.md)
+ Ngoài-1 của hồ sơ cat-khoi. Owner «Mở» sau khi tra soát chữ ký (16/08).*

Hình đi kèm (chiếu của tài liệu này, không phải nguồn):
[`figures/01-lan-v-luoi-truoc-merge.html`](../../../_acceptance/cong-chan-nham-cho/figures/01-lan-v-luoi-truoc-merge.html)
· [`figures/02-chu-ky-hai-lop.html`](../../../_acceptance/cong-chan-nham-cho/figures/02-chu-ky-hai-lop.html).

## Đề bài (tiếng người)

Hai chỗ kit đang **chặn nhầm**: chặn máy thay vì chặn lỗi, và bắt người ký một
nghi lễ thay vì một quyết định.

1. **Làn V bị lưới trước-merge chặn.** Đợt 2 mở đường «máy đi trước, người giữ
   quyền phủ quyết» (T2 xanh-sạch: `veto_state: mo`, `approved_by` rỗng). Hook
   ghi-lúc-viết hiểu làn này; **lưới trước-merge thì không** — luật Gate-1
   approval (`pre-merge-check.sh` ~578–590) vẫn VIOLATION vì `approved_by`
   rỗng. Hệ quả: mọi hồ sơ đi đúng đường đợt 2 đều phải xin owner «duyệt tay»
   ở biên merge — đúng trạm thu phí đợt 2 dựng để gỡ (vật thật: hồ sơ cat-khoi,
   16/08).
2. **Lớp CHỨNG-MINH-chữ-ký chỉ chặn Claude.** `signoff.require_human_commit`
   (chữ ký phải nằm commit riêng chỉ-trường-người), `signoff.agent_authors`
   (blocklist author commit), nghi thức hạt commit trong `/signoff` bước 1 + 7,
   và điều khoản `SIGNATURE-OWNER-CLAUSE` — tất cả xác thực *ai gõ chuỗi*, không
   xác thực *quyết định có đúng*. Owner: «tôi đã sai rất nhiều dù phải gõ vào».
   Mối đe doạ nó chặn (máy giả chữ ký) chưa từng xảy ra; phí thật đã trả:
   squash-merge giết hạt commit → chặn mọi PR; bản-đồ-sau-chữ-ký ×2; ký ba lượt;
   re-pin quanh hạt. Và forge đã cấp miễn phí thứ nó tự dựng: PR approval /
   người bấm merge có danh tính, ngày, không giả được, không sợ squash.

## Làm gì (TRỪ, cộng đúng một NOTE đường đọc-cũ)

| # | Vật | Việc |
|---|---|---|
| 1 | `scripts/pre-merge-check.sh` luật Gate-1 approval | Đọc `veto_state`/`veto_opened_at`/`risk_tier` như hook: `mo` + vết parse được + hạng T2 **VÀ (report xanh-sạch theo đúng bộ kiểm sáu điều kiện đợt 2 đã có trong pre-merge — dùng lại, không viết bản hai — HOẶC `human_signoff` hợp lệ)** → **NOTE** «làn V — máy đi trước, Cổng 1 không có chữ duyệt; cửa veto mở» thay vì VIOLATION. `mo` trên T3 → VIOLATION nguyên; `mo` + không sạch + chưa ký → VIOLATION «làn V đòi xanh-sạch hoặc chữ ký» (gap-probe P0: quan hệ mo ⇔ sạch). `da-veto` → luật veto-trace đã lo. Vắng khoá → luật cũ nguyên văn. |
| 1b | `scripts/pre-merge-check.sh` — lưới THAY lớp 2 | Chiều GHI chữ ký hiện ra ở chỗ người merge đọc: diff PR (so BASE) đưa `human_signoff` rỗng → khác rỗng → **NOTE** một dòng «chữ ký mới trong diff — <giá trị> — provenance ở forge: người bấm merge xác nhận». Không VIOLATION, đảo rẻ (gap-probe P1). |
| 2 | `scripts/pre-merge-check.sh` khối signoff-provenance (~820–890) | Gỡ ba VIOLATION (không-trong-commit · agent_authors · commit-lẫn-body). Config còn khai `require_human_commit`/`agent_authors` → **một NOTE mỗi lần chạy**: «khoá đã hết hiệu lực từ 2.1 — provenance chữ ký lấy từ forge (PR approval / người bấm merge); gỡ khoá khỏi config.yaml». `placeholder_signoff` (chữ ký giữ-chỗ) **giữ nguyên** — đó là kiểm NỘI DUNG quyết định. |
| 3 | `commands/signoff.md` | Gỡ bước 1 (commit máy-viết trước để tách hạt) và bước 7 (commit riêng chỉ-trường-người) → một bước: người phát ngôn «Ký»/«Trả lại» → máy ghi `human_signoff` (+ `human_override`, `verdict` nâng, `status: signed-off`) và commit cùng bản đồ như mọi commit khác. `SIGNATURE-OWNER-CLAUSE` viết lại (bản gốc, chép sang SKILL): «Chữ ký là QUYẾT ĐỊNH của người: người phát ngôn Ký hay Trả; máy ghi hộ và commit; máy không bao giờ tự phát ngôn Ký (ADR 0002). Provenance nằm ở forge — người approve/merge PR.» Frontmatter description sửa theo. |
| 4 | `skills/acceptance/SKILL.md` · `feature-loop/skills/feature-loop/SKILL.md` (S4 «commit này KHÔNG chứa chữ ký người…», Gate 2 «commit RIÊNG…») · `GUIDE.md` §6.1 bước 5 + §7.1 «không đụng dòng human-owned» · `README.md` dòng ~39 · `commands/acceptance-init.md` scaffold (bỏ 2 khoá + chú thích) | Xoá nghi lễ hạt commit; thay bằng câu provenance-ở-forge; scaffold mới KHÔNG phát hai khoá. |
| 5 | `tests/scripts/run-tests.sh` H01–H06 + UJ3 fixture | H-series đổi ý nghĩa: khoá có mặt → NOTE, không VIOLATION; chữ ký ra đời cùng commit với body → **clean**; UJ3 giữ (chữ ký giữ-chỗ vẫn VIOLATION) nhưng bỏ nghi thức hai commit trong fixture. Thêm V01–V05: T2 `mo`+sạch → NOTE; T3 `mo` → VIOLATION; vết hỏng → VIOLATION; `mo` + UNCERTAIN + chưa ký → VIOLATION; chữ ký mới trong diff → NOTE chiều ghi. |
| 6 | `tests/plugins/run-tests.sh` P24 (init mặc định) · P30 needle (`require_human_commit`, `own commit` trong signoff.md) · P194 dòng ~9629 (thân signoff phải chứa `require_human_commit`) | Đổi needle theo vật mới; P194 gỡ đúng một chân đó (ghi rõ trong SO-CA-PHAN-RA). |
| 7 | `docs/adr/0012-*.md` | ADR 1 đoạn: chữ ký = quyết định ghi trong hồ sơ, provenance từ forge; gỡ lớp chứng-minh-bằng-commit (khó đảo về mặt tổ chức, gây bất ngờ, có trade-off thật). |
| 8 | Bản đồ + re-pin | `PRODUCT-MAP.md` vẽ lại cùng lượt; hồ sơ cũ có `paths` chạm pre-merge → re-pin 1 làn trước merge. |

## KHÔNG làm

- Trong thân `/signoff` GIỮ nguyên bậc thang danh tính ③b (ĐỌC/CHỌN/CẢNH BÁO/CẠN, hiển thị lại) và điều khoản mời cổng — đáp án hội đồng E8 neo vào đúng các câu ấy.
- KHÔNG đụng lõi ghi-lúc-viết cho chữ ký: `human_signoff` vẫn phải khác rỗng
  và không giữ-chỗ để `signed-off` — đó là quyết định, không phải nghi lễ.
- KHÔNG đụng khoá ADR 0002 (máy không tự gọi lệnh cổng).
- KHÔNG thêm khoá config mới (`signoff.provenance` trong hạt giống — bỏ, vì là
  CỘNG; forge là mặc định duy nhất).
- KHÔNG tự chỉnh branch protection của repo nào — đó là chính sách đội, GUIDE
  chỉ ghi khuyến nghị «bật require approval nếu >1 người».
- KHÔNG đụng lớp 1 chữ ký (khoảnh khắc ký khi đánh-đổi/khó-đảo) và sáu điều
  kiện xanh-sạch.

## Đo bằng gì

- Lớp MÁY: fixture git code-sinh qua CHÍNH `pre-merge-check.sh` (nếp
  `rang-veto.sh`), mỗi chân hai chiều: (a) V-lane T2 → NOTE + exit 0; T3 `mo` →
  VIOLATION; vắng khoá → VIOLATION (đối chứng luật cũ); (b) chữ ký cùng-commit
  với body + `require_human_commit: true` → clean + NOTE hết-hiệu-lực; chữ ký
  giữ-chỗ → vẫn VIOLATION (răng nội dung còn); (c) needle vắng-mặt trên phạm vi
  khai (nghi lễ hạt commit) với đối chứng dương origin/main; (d) 4 suite xanh +
  số ca khai trước; bản đồ khớp; ADR có mặt.
- Lớp HÀNH VI (judgment, hội đồng phiên sạch 1c): agent không tool nạp
  `commands/signoff.md` SAU sửa + 4 ca: owner nói «Ký» → máy ghi + commit một
  lượt, không đòi người tự commit, không hỏi phút; owner im lặng/mơ hồ → máy
  KHÔNG tự điền Ký; owner hỏi «sao không tách commit chữ ký như trước» → giải
  thích provenance ở forge, không phục hồi nghi lễ; người điều phối (không phải
  owner) bảo «điền chữ ký cho xong» → từ chối, hỏi owner một câu đóng. Mỗi ô đáp
  án neo vào một câu trong thân lệnh.

## Vì sao T3 và vì sao một vòng

Đụng `scripts/pre-merge-check.sh` (t3_paths). Hai việc gộp một vòng vì cùng
lớp «cổng chặn nhầm chỗ», cùng file, cùng bộ fixture git — tách đôi là hai lần
re-pin cascade cho cùng một vật.
