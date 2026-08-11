---
schema_version: 1
feature: Một-lượt-gõ + --repo cho 6 lệnh cổng người — người gõ MỘT câu gộp đúng dạng câu mẫu thẻ đã dạy, từ phiên/cwd bất kỳ
slug: mot-luot-go-cong-nguoi
owner: phanlemanh@gmail.com
risk_tier: T2      # đụng commands/*.md + codex/acceptance-gate/skills/*/SKILL.md + skills/acceptance/references/ + tests/plugins/run-tests.sh — không khớp t1_skip_globs, không khớp t3_paths
surfaces: [cli]
status: verified
approved_by: Manh Phan
approved_at: 2026-08-11
time_human_minutes: {gate1: 0, gate2: 0}   # owner tuyên không đo phút — 0 có chủ đích
---

# Acceptance Contract: mot-luot-go-cong-nguoi

## Context

Chip ③ của kit 2.1 (hàng đợi ⓪–⑦ owner duyệt 10/08, reflect lớn mục 9). Hai
vấp hành-vi-owner nuôi chip này: (1) thẻ cổng dạy owner một câu trả lời mẫu
(«duyệt hay sửa: ___» · «…; ký hay trả: ___») nhưng lệnh cổng lại hỏi từng
bước — owner phải trả lời lại thứ đã trả lời; (2) owner phải nhảy đúng
phiên đúng repo mới gõ được lệnh cổng — làm mất nhịp (sổ vấp 10/08, dòng
hành-vi-owner #8 và dòng điều-phối-liên-phiên).

Chip làm lệnh DỄ GÕ HƠN cho NGƯỜI. Nó không mở một milimet nào cho máy:
khoá chỉ-người-gõ (ADR 0002, case P31/P32) giữ nguyên trạng cả hai harness,
và bất biến chỗ-trống của chip ② (máy không điền sẵn câu trả lời của người)
áp luôn vào ngữ pháp mới.

Vật được giao là VĂN CHỈ DẪN trong 12 thân lệnh (6 lệnh Claude + 6 skill
Codex song sinh) + MỘT khối ngữ pháp single-source trong bản luật ngôn ngữ
mặt người. `scripts/gate-card.js` — bên VIẾT câu mẫu — không đổi một byte;
chip chỉ dạy bên ĐỌC (thân lệnh) hiểu đúng câu thẻ đã dạy, và ghim quan hệ
viết↔đọc bằng phép đo round-trip để hai bên hết đường trôi khỏi nhau.

Source input: docs/findings/2026-08-10-reflect-lon-khep-gd2.md mục 9 (③) +
docs/research/so-vap-trien-khai.md dòng 62/64 (10/08).

## Criteria

- AC-1 (ngữ-pháp-một-chỗ): Given bản luật ngôn ngữ mặt người
  (`skills/acceptance/references/human-facing-language.md`), When đọc mục
  mới về câu gộp tại cổng, Then nó chứa khối marker `GATE-ONESHOT-GRAMMAR`
  định nghĩa câu gộp cho ba lệnh có-câu-hỏi (duyệt Cổng 1 qua `/approve` ·
  ký Cổng 2 qua `/signoff` · chọn-trước lối vào ở `/start`), kèm danh sách
  nhãn chỗ trống máy-đọc trong khối marker `GATE-ONESHOT-SLOTS` (mỗi dòng
  `<cổng> <nhãn>`, nhãn biến thiên khai bằng khuôn «Ngoài-<số>» / «<mã
  eval>»), và sáu luật đi kèm viết thành gạch đầu dòng: (a) câu gộp là câu
  NGƯỜI gõ — máy chỉ dạy khuôn có chỗ trống, không bao giờ điền sẵn (nối dài
  bất biến chip ②); (b) vắng câu gộp → lệnh hỏi từng bước như cũ, không
  trường ghi nào đổi tên hay thêm bắt buộc; (c) đuôi tự do người viết thêm
  sau các nhãn nhận ra được → GIỮ NGUYÊN VĂN và ghi lại (sổ quyết định hoặc
  Notes), cấm nuốt lặng lẽ; (d) phần câu KHÔNG nhận ra được ở giữa các nhãn
  → hỏi lại đúng phần đó, không đoán; (e) tên người duyệt/ký và số phút là
  nhãn NGOÀI-THẺ («duyệt: <tên>[, phút <N>]» · «Ký: <tên> <ngày>[, phút
  <N>]») — thẻ không dạy chúng, thân lệnh dạy; trong SLOTS chúng mang cờ
  `extra` để round-trip không đòi thẻ render, kèm luật «tên/phút là
  follow-up DUY NHẤT được phép hỏi thêm khi câu gộp vắng đuôi»; (f) mục
  /start của grammar chứa chữ `slug` (chọn-trước bằng slug, KHÔNG bằng chữ
  cái) + quy tắc «không thấy slug trong nhóm nào → trình thẻ như cũ». Khuôn
  «<mã eval>» trong SLOTS ghim ĐÚNG khuôn reader thật của thẻ: `E\w+`
  (gate-card.js chỉ đưa lên thẻ id khớp khuôn này) — không khai «chuỗi bất
  kỳ».
- AC-2 (round-trip thẻ→ngữ pháp): Given một workspace fixture DO CODE SINH
  trong chính lần chạy (đủ bốn họ việc-người: mục Ngoài hợp đồng, câu hỏi
  judgment, xác nhận cắt/hoãn, quyết định treo), When chạy
  `scripts/gate-card.js` THẬT (--gate 1 và --gate 2) rồi rút các nhãn chỗ
  trống từ dòng «Trả lời mẫu» của thẻ, Then MỌI nhãn rút được khớp đúng một
  mục đã khai trong `GATE-ONESHOT-SLOTS` (nhãn cố định khớp nguyên văn; nhãn
  biến thiên khớp khuôn của nó — «Ngoài-<số>» theo dạng số, «<mã eval>» đối
  chiếu id thật của fixture, hai lớp không nuốt lẫn nhau); chiều đỏ CHẠY
  THẬT: (đỏ-a) gỡ một nhãn cố định khỏi bản sao khối SLOTS → checker ĐỎ đích
  danh «nhãn thẻ dạy mà ngữ pháp không khai»; (đỏ-b) tiêm một nhãn lạ vào
  đúng dòng «Trả lời mẫu» của HTML thẻ đã render → checker ĐỎ đích danh
  «nhãn lạ ngoài ngữ pháp»; (đỏ-c — leg NGƯỢC, bài đếm-nguồn-2-hướng chip
  ②b) mỗi dòng SLOTS không mang cờ `extra` phải được render bởi ít nhất một
  fixture trong CHÍNH lần chạy — thêm một dòng nhãn chết vào bản sao SLOTS →
  checker ĐỎ đích danh «nhãn SLOTS không fixture nào render» (chặn nhãn ma /
  nhãn sai chính tả sống cạnh nhãn đúng); đối chứng dương: bản nguyên vẹn
  XANH trước mọi đột biến, trên CÙNG fixture.
- AC-3 (12 bản chép + manifest số bản): Given manifest `GATE-ONESHOT-SITES`
  trong bản luật ngôn ngữ mặt người khai từng site nguồn kèm SỐ BẢN PHẢI CÓ
  (mỗi dòng `<đường-dẫn> <số>` — 6 lệnh `commands/*.md` + 6 skill
  `codex/acceptance-gate/skills/*/SKILL.md`), When chạy phép đo, Then mỗi
  site chứa ĐÚNG số bản khai của điều khoản `GATE-ONESHOT-CLAUSE` nguyên văn
  từng ký tự, mọi bản suy ra dưới `plugins/` (mirror sau overlay) cũng khớp
  nguyên văn; VÀ ba quan hệ per-site đo thêm trên TỪNG site (gap-probe P0 +
  cờ phiên B): (i) site chứa needle `--repo` — chỉ dẫn cờ có mặt ở cả 12
  thân, không chỉ 3; (ii) site chứa con trỏ `GATE-ONESHOT-GRAMMAR` — thân
  lệnh trỏ về ngữ pháp, không tự chế; (iii) round-trip SLOTS→thân-lệnh:
  thân `approve` (cả hai harness) liệt đủ nhãn g1, thân `signoff` liệt đủ
  nhãn g2 (nhãn cố định nguyên văn; nhãn biến thiên bằng khuôn của nó), thân
  `start` chứa dạng chọn-trước `slug`; chiều đỏ: (đỏ-a) mangle một ký tự của
  điều khoản trong MỘT bản chép → ĐỎ đích danh file; (đỏ-b) dòng site thiếu
  số → ĐỎ «site thieu so ban», không default lặng lẽ (bài học AC-3 chip ②b,
  cùng format manifest); (đỏ-c) gỡ needle `--repo` khỏi MỘT bản sao thân
  lệnh → ĐỎ đích danh file; (đỏ-d) xoá một nhãn g2 khỏi bản sao thân
  `signoff` → ĐỎ đích danh nhãn thiếu.
- AC-4 (khoá nguyên trạng — ADR 0002): Given diff của chip này, When chạy
  P31/P32 trong suite, Then cả hai XANH nguyên trạng: 6 lệnh Claude còn
  `disable-model-invocation: true`, 6 skill Codex còn
  `allow_implicit_invocation: false` (cả nguồn lẫn mirror), `acceptance-card`
  vẫn mở; VÀ điều khoản `GATE-ONESHOT-CLAUSE` chứa nguyên văn CẢ HAI câu
  neo: «câu gộp là câu NGƯỜI gõ — cờ và ngữ pháp này không mở đường cho máy
  gọi lệnh» VÀ câu kết-khối «còn việc kế thì kết bằng đúng MỘT khối 👉 VIỆC
  CỦA ANH theo khuôn YOUR-MOVE-BLOCK-TEMPLATE» (deliverable (c) có phép đo
  riêng, không bốc hơi sau AC-3 — gap-probe P1). Về răng của khoá: P31/P32
  là assert-TRỰC-TIẾP trên cây thật, KHÔNG phải mutant — phá vật thật (gỡ
  một dòng khoá) thì chúng đỏ với thông điệp ĐÃ ghim sẵn «lacks policy
  lock» / «lacks lock»; chip này không đo lại lớp đã có chủ và không nhận
  vơ một mutant không tồn tại (gap-probe P1).
- AC-5 (đối chứng dương toàn cục + khai sinh phép đo + không-trôi-vật-viết):
  Given cây thật hiện tại, When chạy trọn suite plugins VÀ phép kiểm
  không-trôi-vật-thật so BASE TƯỜNG MINH `origin/main`, Then suite exit 0
  với dòng tổng kết case mới KÈM SỐ chiều đỏ đã chạy; mọi mutant in
  xác-nhận-đột-biến và đi qua chính checker thật (MEASURE-BIRTH:
  đối-chứng-dương + phá-vật-thật + thông-điệp-ghim trên cùng fixture); và
  diff name-only so `origin/main` KHÔNG chứa `scripts/gate-card.js` — bên
  VIẾT câu mẫu không đổi một byte, đúng lời hứa phạm vi.
- AC-6 (mirror): Given nguồn đã sửa (commands/ không vào mirror; codex/ +
  skills/references vào mirror), When chạy `sync-plugin-packages.sh --check`
  sau khi sync, Then mirror khớp nguồn (P30 xanh) và bản luật + 6 SKILL
  trong mirror mang cùng khối grammar/điều khoản.
- AC-7 (judgment — người-gõ context tươi): Given một agent context sạch
  được đưa CHỈ thân lệnh (không contract, không grammar rời), When đóng vai
  owner cầm câu «Trả lời mẫu» của thẻ, Then với ca `/approve` và ca
  `/signoff` nó trả lời đúng: gõ câu gộp dạng nào, lệnh sẽ điền giá trị nào
  vào trường nào (`approved_by`/`approved_at`/`time_human_minutes.gate1` ·
  `human_override`/`human_signoff`/`status`/`time_human_minutes.gate2`), và
  khi nào lệnh được phép hỏi thêm (chỉ tên/phút khi vắng đuôi). Trả lời
  lệch bảng đáp án → REJECT của vòng verify, sửa THÂN LỆNH chứ không sửa
  đáp án (hạ-thước bị cấm).

## Coverage

Ma trận viết-trước 2 trục. Trục vật-giao: ngữ-pháp-một-chỗ (AC-1) ·
quan-hệ-viết↔đọc thẻ→grammar (AC-2, HAI hướng kể cả leg SLOTS-phải-được-
render) · 12-bản-chép + --repo + SLOTS→thân-lệnh (AC-3) · khoá-không-suy-
suyển + hai câu neo clause (AC-4) · hành-vi-đọc-hiểu của model thi hành
(AC-7, judgment) · mirror (AC-6). Trục khai sinh phép đo: đối-chứng-dương
(AC-2/AC-5) · phá-vật-thật (AC-2 ba chiều, AC-3 bốn chiều) · thông-điệp-ghim
(AC-2/AC-3 đều ghim đích danh). Thước "đủ": mỗi phép đo mới có ít nhất một
chiều đỏ CHẠY THẬT + đối chứng dương trên cùng fixture; nhãn biến thiên phải
có ca chứng minh hai lớp không nuốt lẫn nhau (gỡ «Ngoài-<số>» khỏi SLOTS thì
Ngoài-1 không được chui lọt qua lớp «<mã eval>» — checker đối chiếu mã eval
bằng id THẬT của fixture, không regex rộng). Lỗ nhìn-thấy-mà-không-đo-được
khai CÓ Ý THỨC ở known-limits trong Notes.

## Out of scope

- `/acceptance-init` KHÔNG nhận câu gộp — không thẻ/lời-mời nào dạy owner
  câu mẫu cho 7 câu hỏi setup, và init là nghi thức một-lần-mỗi-repo (tần
  suất không trả nổi giá ngữ pháp). Nó chỉ nhận `--repo`. Xem lại khi: có
  vấp thật owner phải init nhiều repo liên tiếp.
- `/acceptance-status` và `/acceptance-report` không có câu hỏi nào để gộp —
  chỉ nhận `--repo` (báo cáo/valid args cũ như `--since` giữ nguyên).
- KHÔNG đổi một byte nào của `scripts/gate-card.js`, khuôn
  `YOUR-MOVE-BLOCK-TEMPLATE`, câu `GATE-INVITE-CLAUSE`, manifest
  `GATE-INVITE-SITES` — bên viết câu mẫu và luật mời-cổng là vật của chip
  ②/②b, đã có chủ và có răng riêng (P186/P188/P189). Nếu thi công buộc phải
  đụng → DỪNG, báo phiên B.
- KHÔNG thêm cơ chế parse bằng CODE (script tách câu gộp): thân lệnh là
  prompt cho model đọc — ngữ pháp sống ở bản luật, phép đo ghim quan hệ văn
  bản. Xem lại khi: có vấp thật model đọc sai ngữ pháp ở repo tiêu thụ.
- KHÔNG đổi nghi thức require_human_commit, tên/nghĩa mọi trường ghi
  (approved_by, human_signoff, time_human_minutes, human_override…), thang
  verdict, hay hành vi hook write-time.
- KHÔNG thêm site mời-cổng mới vào GATE-INVITE-SITES (6 lệnh không render
  thẻ — chúng CHỈ DẪN kết khối 👉 VIỆC CỦA ANH qua điều khoản của chính
  chip này, đo bằng AC-3, không lấn sân manifest của chip ②b).

## Notes

- Mobile backend target: n/a (kit CLI, không surface mobile).
- **known-limits (khai CÓ Ý THỨC, người ký đọc trước khi duyệt):** hành vi
  LLM THẬT khi thi hành lệnh — model đọc câu gộp của owner rồi điền trường —
  KHÔNG máy-đo được trong chip này: mọi phép đo máy (AC-1..6) đo tài-liệu-
  dạy và quan-hệ-văn-bản; AC-7 (judgment context tươi) đo đọc-hiểu một lần
  lúc verify, không đo mọi phiên tương lai. Răng thật của lớp này là LẦN GÕ
  ĐẦU của owner sau khi ship — nếu lệnh hiểu sai câu gộp, ghi sổ vấp và mở
  chip vá theo lớp (đường revisit đã khai ở sổ quyết định d-10004: cân
  parser bằng code khi có vấp thật).
- **Finding tại Cổng 2 → hồ sơ ③b (KHÔNG sửa trong chip này):** owner gõ
  thật câu ký và nêu «danh tính + ngày là dư — máy phải tự suy» (tên suy từ
  `signoff.approvers` khi duy nhất, ngày = hôm nay; chữ «Ký» vẫn là hành vi
  người, bất biến máy-không-ký-thay không suy suyển). Owner xác nhận tách
  thành hồ sơ ③b riêng, điều kiện vào: PR chip ③ merged. Lời nguyên văn ghi
  ở khối bằng chứng E7.
- **known-limits 2:** đường gộp của `/start` (chọn-trước bằng slug) không
  có dòng «Trả lời mẫu» máy-render để round-trip — AC-2 không phủ nó; chỉ
  có needle-pin trong grammar (AC-1f) + bản chép (AC-3). Hành vi model của
  /start là ngoài thước, cùng lớp known-limits 1.
- Quyết định thiết kế cần owner thấy ở Cổng 1 (chọn A — hai phương án):
  (A — chọn) ngữ pháp câu gộp đặt trong bản luật ngôn ngữ mặt người cạnh
  khuôn YOUR-MOVE — vì câu gộp CHÍNH LÀ câu «Trả lời mẫu» của khuôn đó, hai
  vật cùng seam người-viết↔máy-đọc, một chỗ marker + round-trip là mẫu đã
  thắng (OOC-ITEM-TEMPLATE/P55, GATE-INVITE/P188). (B — loại) file reference
  mới riêng cho quy ước lệnh — loại vì đẻ mặt phẳng thứ hai cho cùng một
  luật, đúng lớp lỗi một-mặt-phẳng-làm-việc đã dẫm.
- `/start` nhận câu gộp dạng CHỌN-TRƯỚC MỤC TIÊU: `<slug>` (không phải chữ
  cái — chữ cái của thẻ đổi theo từng lần quét, slug thì bền giữa các
  phiên). Quét xong, slug có mặt trong nhóm nào thì bàn giao thẳng theo lối
  nhóm đó (không hỏi câu chọn); không thấy → trình thẻ như cũ. Cả gõ-một-lượt
  lẫn `--repo` vẫn giữ nguyên tắc «lệnh CHỈ định hướng + bàn giao».
- `--repo <path>`: mọi đọc/ghi/git của lệnh chạy trên gốc `<path>` (`git -C`,
  script kèm `--root <path>`); hook write-time vẫn cắn vì matcher đi theo
  MẪU đường dẫn `_acceptance/…` bất kể gốc tuyệt đối (đã kiểm
  `hooks/acceptance-evidence-gate.js` TARGET_RE/CONTRACT_RE); chữ ký
  require_human_commit nằm trong lịch sử git của repo đích, không đổi.
- PR này chạm `commands/`, `codex/`, `skills/acceptance/references/`,
  `tests/plugins/run-tests.sh` → stale-theo-diff (1.39.2) sẽ kéo hồ sơ cũ
  khai các path đó vào diện stale; đã tính sẵn giá một làn re-pin
  1-làn-N-chữ-ký sau chữ ký (tiền lệ a4f4f89/99d1ea5; có thể không phải trả
  — tiền lệ chip ②b không phải trả vì hồ sơ cũ nào khai path trùng đã được
  re-pin ngay trước đó).
