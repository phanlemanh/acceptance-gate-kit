# Đường lùi phải sống — thiết kế

*Ngày 08/09/2026 · hạng T3 · owner gọi tên («Thực hiện hết», 04:40 giờ VN) · một vòng, hai lát, đường cắt khai trước.*

## 1. Câu hỏi vòng này trả lời

Làn máy-đi-trước (làn V) hợp pháp vì hiến pháp nói *máy giữ được đường đảo thì máy mới được đi
trước*. Vòng này chứng minh đường đảo đó là thật ở **hai cửa** và không thêm cổng người nào:

| Cửa | Hôm nay | Sau vòng |
|---|---|---|
| Người — veto | Lời mời cổng in «veto: lý do» nhưng không lệnh nào nhận | Người gõ một chữ ở lệnh ký; hồ sơ sang `da-veto`, sổ có lý do, lưới chặn merge, máy dừng |
| Người — ô kết | 38 hồ sơ mở cửa veto đều nằm ở `verified`; 0 ở `machine-cleared` vì không bước nào ghi | Máy tự ghi ô kết khi đủ sáu điều kiện; bảng điều khiển phân biệt «chờ tôi» với «xong, tôi chỉ veto» |
| Máy — soi lại | Bộ soi lại không chạy được → NOTE, kể cả chế độ nghiêm | Chế độ nghiêm: không chạy được là VIOLATION có tên đường |
| Máy — hoá cũ | Nhánh xanh-sạch `continue` trước khối kiểm bằng-chứng-cũ; heading h1 làm mục có nội dung đọc thành rỗng | Làn V trong diff bị kiểm hoá cũ như hồ sơ có chữ ký; ranh tiêu đề về `#{2,6}` cùng bộ đọc section |
| Máy — chữ ký | Lệnh ký commit rồi mới soi, không chạy suite; mỗi chữ ký một CI đỏ | Làn máy chạy TRƯỚC commit; hoá cũ do chính chữ ký → ghim lại cùng lượt trước khi push |

## 2. Không gian AC (quét độ phủ, khuôn Zwicky)

**Ngữ cảnh.** Sản phẩm: bộ công cụ nghiệm thu (kit) — chân sản phẩm `[SUY-TỪ-REPO: scripts/pre-merge-check.sh ·
commands/signoff.md · scripts/khong-can-nguoi.mjs · feature-loop/skills/feature-loop/SKILL.md]`; chân ngành
`[NGÀNH: The AI-Native SDLC playbook — «rollback là đường được tập nhiều nhất, chứng minh trước khi cần»;
«một lớp chỉ thành cổng khi hỏng thì không chạy»]` và `[NGÀNH: GitHub branch protection — required
status check «không chạy» không tính là pass]`.

- **Trục A · Cửa:** người | máy — *[thước CE: hiến pháp nguyên tố 3 — đường đảo có hai chủ thể]*
- **Trục B · Thời điểm:** lúc máy đi tiếp (S4 PASS) | lượt người ở lệnh ký | chốt trước-merge (CI) — *[thước CE: ba chỗ duy nhất mã cổng chạy; đọc từ SKILL feature-loop + pre-merge-check]*
- **Trục C · Lớp lỗi:** thiếu bộ ghi (có bộ đọc, không đường ghi) | fail-open (không đo được = sạch) | nối tắt (kiểm bị bỏ qua) | thứ tự sai (ghi trước khi kiểm) — *[thước CE: sổ lớp lỗi của kit (CLAUDE.md, gap-probe 2.5.0→2.9.0)]*

Không gian 2 × 3 × 4 = 24 ô; có nghĩa 9:

| Ô | Cửa × Thời điểm × Lớp | Nhãn |
|---|---|---|
| (b) | người × S4 đi tiếp × thiếu bộ ghi | **Core** — ô kết `machine-cleared` |
| (a) | người × lệnh ký × thiếu bộ ghi | **Core** — veto |
| (e) | người × lệnh ký × thứ tự sai | **Core** — làn trước chữ ký |
| (c) | máy × CI × fail-open | **Core** — soi lại không chạy được |
| (d) | máy × CI × nối tắt | **Core** — làn V thoát kiểm hoá cũ |
| (d′) | máy × CI × fail-open | **Core** — h1 đọc thành rỗng (cùng họ (d), một dòng, LV5 đang loại trừ) |
| — | máy × S4 đi tiếp × fail-open | **Later** — mục «Ngoài hợp đồng» bốc hơi ở bước tổng hợp (8 finding → rỗng): vật là workflow S4, ô riêng |
| — | người × CI × thứ tự sai | **Never** — lệnh cổng người thứ bảy để «xử veto» (ADR 0002, danh sách đóng) |
| — | máy × lệnh ký × fail-open | **Later** — thuế dòng định tuyến của kit (LM20) là ca riêng của kho kit, không vào engine; lệnh ký chỉ cần «làn đỏ thì không commit» |

Cross-cutting mọi ô Core: mỗi phép đo mới có cặp hai chiều trên cùng fixture code-sinh (khoản khai sinh phép đo);
răng additive-only DV5 — sửa `pre-merge-check.sh` chỉ THÊM dòng, dòng gỡ khai đích danh.

## 3. Thiết kế từng mục (thứ tự làm: (e)(c)(d)(d′) rồi (a)(b))

### (e) Lệnh ký: làn máy chạy trước chữ ký, ghim lại cùng lượt

Bước 7 của `commands/signoff.md` tách thành ba bước có răng, chép nguyên văn sang `skills/acceptance/SKILL.md`
bằng khối marker `SIGNOFF-LANE-CLAUSE` (nếp SIGNATURE-OWNER-CLAUSE). Khối chứa DÒNG LỆNH NGUYÊN VĂN của làn
(7b) và của bước ghim lại (8) trong fence — răng rút lệnh từ khối để chạy trên fixture (round-trip
writer→reader), không chép lời; mutant đổi cờ trong khối làm răng đỏ:

1. **7a — ghi trường người** (như cũ).
2. **7b — làn trước chữ ký.** Chạy làn máy của chính hồ sơ trên cây làm việc, KHÔNG ghi:
   `node <feature-loop>/scripts/repin-lane.mjs --root . --slug <slug> --allow-dirty` (không `--write`;
   gói feature-loop giải qua `resolve-plugin.mjs`; vắng gói → chạy từng eval `test`/`script` của
   `evals.yaml` + suite trong `feature_loop.suite_keys`, cùng luật đỏ). Làn đỏ → **KHÔNG commit**, in
   nguyên văn dòng đỏ, dừng — chữ ký không được vào lịch sử trên một cây đỏ.
3. **7c — commit chữ ký cùng mọi file làn đòi** (kho kit: bản ghi mốc định tuyến; kho khác: không có gì thêm).
4. **Bước 8 mở rộng.** Chạy pre-merge; nếu nó báo `evidence is stale` cho CHÍNH slug (commit chữ ký chạm
   file ngoài T1) → chạy `repin-lane.mjs --write`, commit ghim lại, chạy pre-merge lần nữa. READY chỉ khi
   0 violation; push là việc của S5, sau READY.

Vật máy giữ: `repin-lane.mjs` exit 1 (đã có). Vật mới của vòng: khối marker + răng round-trip
nguồn↔bản chép, và một fixture kho-git code-sinh chạy đúng thứ tự 7b→7c→8 để chứng «cây đỏ thì
không có commit chữ ký».

### (c) Chế độ nghiêm: soi lại không chạy được là vi phạm

Trong `scripts/pre-merge-check.sh` khối 1207–1231, THÊM (không sửa dòng cũ) trước hai dòng NOTE
«unavailable»/«not vendored»: nếu `RECHECK_MODE = strict` → `VIOLATION [slug]: evidence re-check
KHÔNG CHẠY ĐƯỢC (<đường>) — recheck: strict coi cổng câm là cổng hỏng` với `<đường>` là một trong
`recheck-evidence.cjs vắng` · `node vắng` · `exit <rc>` (2 = lib vắng/đọc file lỗi); `violations++;
continue`. Chế độ `warn`/`off` giữ nguyên NOTE. Kho tiêu thụ chưa đủ điều kiện (chưa vendor lib) mà
đang `strict` sẽ đỏ đúng chỗ — đó là thiết kế, ghi vào mô tả phát hành.

### (d) + (d′) Làn V không thoát kiểm hoá cũ; h1 không còn đọc thành rỗng

Trước `continue` ở dòng 956, THÊM một khối cho hồ sơ trong diff PR (`slug_in_diff`), ma trận 5 ô: (1)
`verified_commit` giải được và `stale_files "$ROOT" "$vc"` không rỗng → `VIOLATION [slug]: làn V — evidence
is stale (code changed after verify, verified_commit <vc>): <n file>` + `continue`; (2) giải được, không
stale → NOTE xanh-sạch như cũ; (3) `verified_commit` là SHA không có trong repo (clone đầy đủ) → VIOLATION
pin-ma cùng họ P184, không xanh-sạch; (4) rỗng → NOTE «report has no verified_commit» (không xanh-sạch); (5)
ngoài diff → im lặng (stale-theo-diff-pr). Không gọi lại khối 1021 (không tái cấu trúc — DV5).

(d′): ranh tiêu đề trong `xanh_sach_check` (bash) đổi `#{1,6}` → `#{2,6}` ở CẢ HAI dòng (vế kiểm có mặt
và vế cắt tiền tố) cho khớp `section()` — h1 khi đó là «VẮNG» ở cả hai bản; hai dòng cũ khai vào
`ALLOWED_REMOVALS` của DV5 đích danh; `tests/plugins/lan-v.test.mjs` gỡ dòng loại trừ ca
`kl-h1-co` và đưa ca vào ma trận LV5.

### (a) Veto có tay nắm

- `GATE-ONESHOT-SLOTS` thêm `g2 veto hay để yên`; `GATE-ONESHOT-GRAMMAR` thêm nhãn «veto: <lý do>» —
  chỉ hợp lệ trên hồ sơ máy-đi-trước (lời mời cổng đang in ô đó); «để yên» = không làm gì.
- `lib/evidence-core.cjs` `evaluateContractWrite`: `da-veto` là một lối Cổng-1-đã-ghi hợp lệ trên hồ sơ
  máy-đi-trước — hôm nay ô `machine-cleared × mo → da-veto` bị từ chối («Gate 1 approval not recorded», vì
  `da-veto` làm `vOpen=false`), tức veto chết đúng trên dân số vòng này sinh ra để cứu (gap-probe P0). Ma trận
  4 ô {verified, machine-cleared} × {approved_by, mo} đều phải qua.
- `commands/signoff.md`: nhận nhãn đó → ghi `veto_state: da-veto` (qua công cụ sửa file để lưới ghi-lúc-viết
  kiểm), append entry sổ `{"type":"veto","stage":"gate2","decision":"<lý do nguyên văn>","decided_by":…}`,
  commit `Veto: <slug> — <tên>`, in một dòng «máy dừng; hồ sơ chờ người xử (về draft hoặc duyệt tay)» và
  DỪNG — không menu, không tranh luận (SKILL feature-loop, bất biến dừng).
- Lưới trước-merge đã chặn `da-veto` và đã canh chiều ghi-ngược bằng entry có chữ «veto» — không đổi.
- P191/P192: fixture thẻ máy-đi-trước phải có trong ma trận round-trip để nhãn mới không chết.

### (b) Đường ghi ô kết

- `scripts/khong-can-nguoi.mjs` thêm chế độ `--write --root <r> --slug <s>`: hồ sơ `status: verified`,
  `risk_tier: T2`, `khongCanNguoi()` ≠ null → ghi `status: machine-cleared` (chỉ dòng status), tự kiểm
  bằng `evaluateContractWrite` (cùng luật hook), in một dòng; thiếu điều kiện → exit 2 nêu điều kiện trượt
  đầu tiên, KHÔNG ghi; `--check` = chạy khô.
- `feature-loop/skills/feature-loop/SKILL.md` hàng `verified`: «xanh-sạch → chạy `khong-can-nguoi.mjs
  --write` rồi vẽ lại bản đồ, commit phần máy viết, đi tiếp S5»; hàng `machine-cleared`: gỡ đoạn «ĐƯỜNG
  GHI CHƯA BẬT». Lời mời cổng đã nhận `machine-cleared` bằng status (S4-r10), không cần sửa.

## 4. Kiểm thử — răng của hồ sơ

`_acceptance/duong-lui-phai-song/rang.sh --chan <x>`, mỗi chân dựng fixture code-sinh trong lần chạy
(kho git tạm cho các chân cần diff), có đối chứng dương và chiều đỏ ghim thông điệp:

| Chân | Đối chứng dương | Chiều đỏ |
|---|---|---|
| `recheck-vang` | strict + soi lại chạy được → không VIOLATION mới | strict + script vắng / node vắng / exit 2 → đúng ba thông điệp; warn → NOTE |
| `lan-v-stale` | làn V trong diff, không đổi mã → NOTE xanh-sạch | đổi một file mã sau `verified_commit` → VIOLATION «làn V — evidence is stale» |
| `h1-rong` | bash và mjs cùng trả «VẮNG khỏi báo cáo (vắng ≠ rỗng)» trên `# Known limits` h1 (h1 không phải tiêu đề với ranh `#{2,6}`) | mutant đưa `#{1,6}` trở lại → bash «sạch» / mjs «vắng» lệch, LV5 đỏ |
| `veto-slot` | SLOTS có nhãn, thẻ máy-đi-trước render nhãn, signoff.md có khối clause | gỡ nhãn khỏi SLOTS → P192 đỏ; gỡ khối → răng đỏ |
| `veto-ghi` | fixture máy-đi-trước + lệnh ghi → `da-veto` + entry `type:veto` + pre-merge chặn | ghi mà thiếu entry → lưới đỏ chiều ghi-ngược khi xử |
| `ket-ghi` | fixture verified sạch T2 → `machine-cleared`, evaluateContractWrite xanh | thiếu một điều kiện / T3 → exit 2, file không đổi |
| `ky-lan` | khối `SIGNOFF-LANE-CLAUSE` nguồn == bản chép | lệch một ký tự → đỏ gọi tên bản |
| `ky-lan-song` | kho git giả: làn xanh → có commit chữ ký | phá một eval → không có commit chữ ký, thông điệp nguyên văn |

Bốn suite thường trực + `additive-only` + `product-map --check` chạy mỗi vòng chấm.

## 5. Ngoài phạm vi và đường cắt

- Không thêm lệnh cổng người (ADR 0002). Không đổi sáu điều kiện xanh-sạch. Không tổng quát hoá thuế
  dòng định tuyến (kit-only) vào engine. Không sửa bước tổng hợp S4 làm mục rỗng (ô Later).
- **Đường cắt khai trước:** S4 chạm trần ba vòng chấm → thu phạm vi: bỏ (a)(b) (lát 1), ship (c)(d)(d′)(e).

## 6. Ba dòng số kỳ vọng

Vòng T3: Cổng Đáng (đã, «Thực hiện hết») · Cổng Phạm vi (người, kèm hình) · Gate 1.5 (kế hoạch) ·
Cổng Bằng chứng — **≤4 lượt**, 1 chạm mỗi lượt; mục tiêu 0 lượt ngoài thiết kế.
