---
schema_version: 1
slug: the-xep-nham-o-se-lam
feature: Thẻ Cổng Phạm vi phải nói đúng «hệ thống sẽ làm gì» — hôm nay nó xếp tiêu chí bằng cách dò chữ «không» trong vế Then, nên hồ sơ càng viết đúng luật khai-chiều-đỏ càng bị đọc thành «hệ thống không làm gì»
owner: phanlemanh@gmail.com
stage: discovery            # discovery | decided | archived
decision:                   # build | iterate | park | kill — người ký Cổng Đáng điền
decided_by:
decided_at:
prototype:
  base_commit:
  disposition: archive      # keep | archive
---

## Vấn đề & ai gặp

Thẻ Cổng Phạm vi là **vật duy nhất owner đọc để duyệt phạm vi**. Nó chia bộ tiêu chí
làm hai khối — «Hệ thống SẼ làm» và khối phủ định — và owner quyết trên hai khối đó.
Phép chia ấy đang dùng **một phép dò chuỗi**: `scripts/gate-card.js:149` dựng
`NEG_RE` (bắt `không`/`KHÔNG`/`NOT`/`reject`/`từ chối`/`biên`/`rỗng`/`suppress`/`vắng`…),
rồi `:227-228` xếp mọi tiêu chí có một trong các chữ đó **trong vế Then** sang khối
phủ định.

**Cùng lúc đó, luật kit BẮT mọi tiêu chí phải khai chiều đỏ.** `MEASURE-BIRTH-CLAUSE`
(`feature-loop/skills/feature-loop/SKILL.md`) nói một phép đo chỉ tính XONG khi có cặp
hai chiều trên cùng fixture: vật lành → xanh, phá vật thật → **đỏ có thông điệp ghim**.
Bất biến «assertion âm-tính-một-mình» trong `CLAUDE.md` nói y hệt ở tầng hợp đồng. Nên
vế Then đúng luật gần như luôn chứa một mệnh đề dạng «… ; bản sao gỡ mệnh đề → **đỏ**
nêu mệnh đề», «đối chứng: `surfaces: [cli]` → **không** cờ», «mutant đổi trạng thái →
slug **không** ở `gates`».

**Hai thứ khác hẳn nhau đang rơi vào cùng một cái rổ:**

| | Điều hệ thống SẼ CHẶN | Chiều đỏ của một phép đo |
|---|---|---|
| Nói về | hành vi sản phẩm khi chạy thật | hành vi **thước** khi vật bị phá trong bản sao |
| Người hưởng | owner (phạm vi) | máy (bằng chứng không tự dối) |
| Sống ở | vế Then, và ở section `Out of scope` | vế Then, bắt buộc bởi `MEASURE-BIRTH-CLAUSE` |
| Chữ dùng | «không», «từ chối», «chặn» | «không», «đỏ», «từ chối», «vắng» |

Cột phải là **điều kiện để tin cột trái**, không phải phủ định của nó. Dò chuỗi không
phân biệt được hai cột vì chúng dùng chung từ vựng. Và cùng cái `NEG_RE` ấy ở
`:230` được dùng **đúng** — hỏi «tiêu chí này đã có eval nào khai chiều đỏ chưa» trên
`e.expected`. Một biểu thức, hai nghĩa: ở `:230` nó đo *thước*, ở `:227` nó bị bắt đo
*sản phẩm*.

**Ca thật, đo trên cây hiện tại:**

- `_acceptance/ra-co-ten-lam-va-trao/contract.md` — 15 tiêu chí →
  `will_do: []`, `wont_do: 15/15`. Thẻ HTML **không in khối «Hệ thống SẼ làm» nào**
  (`gate-card.js:349` chỉ in khi `willDo.length`), đọc như thể hồ sơ không làm gì.
  Đọc 15 tiêu chí đó thì **không cái nào** là «hệ thống sẽ chặn»: chúng là thêm trạng
  thái `machine-cleared`, thêm bốn khoá nhãn, thêm chế độ Cổng Đáng cho `/approve` —
  đều là điều hệ thống SẼ làm, chỉ khai kèm chiều đỏ. Vết: entry
  `d-20260823T124500Z-31008` trong `decisions.jsonl` của hồ sơ đó (chốt KHÔNG sửa
  trong hợp đồng ấy vì mở phạm vi → điều kiện chết (e)).
- **Quét cả 58 hợp đồng đọc được trên `main`** (`--gate 1 --extract`, đếm hai ô):

  | Hợp đồng mở | Số hồ sơ | Tổng «sẽ làm» | Tổng «không làm» | Hồ sơ có ≤ 2 «sẽ làm» |
  |---|---|---|---|---|
  | trước 2026-08-21 | 50 | 313 | 150 | 7 / 50 |
  | từ 2026-08-21 | 8 | 18 | 42 | **7 / 8** |

  Cùng chiều với `ra-co-ten-lam-va-trao` (0/15, chưa merge): tỷ lệ lật từ 68% «sẽ làm»
  xuống 30% đúng quãng kit siết luật khai-chiều-đỏ.
- **Nhưng nó cũng không nhất quán theo luật:** `start-bang-dieu-khien` mở **cùng ngày**
  23/08, cùng luật, ra `11 / 1`. Hai hồ sơ cùng tuần nằm hai cực — nên đây không phải
  «luật mới làm lệch thước», mà là **thước chưa bao giờ đo cái nó nói nó đo**; kết quả
  là **ngẫu nhiên từ vựng**. Con số 68% ở nhóm cũ cũng không phải bằng chứng nó từng đúng.
- **Lối thoát ngôn-ngữ-mặt-người không cứu được.** `commands/acceptance-card.md:52-53`
  cho LLM viết lại chữ cho từng `id` trong `will_do`/`wont_do`, nhưng overlay **map theo
  id trong rổ máy đã chia** — nó đổi được câu chữ, không đổi được hồ sơ nằm rổ nào.

**Người trả giá — theo thứ tự:**

1. **Owner**, tại đúng khoảnh khắc quyết thật. Thẻ trình sai chính câu hỏi cổng đặt ra
   («duyệt phạm vi này chứ?»). Hai lối ra đều hỏng: gật trên bức tranh sai, hoặc bỏ thẻ
   mở `contract.md` đọc thô — tức cổng thành **trạm thu phí**, đúng thứ North Star cấm.
2. **Máy.** Không có đường vòng: hồ sơ càng theo `MEASURE-BIRTH-CLAUSE` càng bị đọc lệch,
   nên máy phải **giải thích bằng lời ngoài thẻ** mỗi lượt trình (đã phải làm ở
   `ra-co-ten-lam-va-trao`) — thêm một lượt nói, đúng thứ trần «tần suất gọi người».
3. **Repo tiêu thụ.** Cùng bộ đọc, cùng luật, chưa ai đo — nhưng hợp đồng ở đó cũng đi
   qua `MEASURE-BIRTH-CLAUSE`.

**Ca tái phát 2026-09-01 (đếm thêm một):** thẻ Cổng Phạm vi của hồ sơ
`cong-dang-co-cua` xếp **5/13 tiêu chí** sang khối phủ định — AC-3, AC-6, AC-7,
AC-9, AC-12 — trong khi cả năm đều là việc hệ thống SẼ làm. Cả năm rơi vào khối
sai vì đúng lý do ô này nêu: vế Then của chúng khai chiều đỏ («bản sao gỡ dòng →
đỏ», «KHÔNG nhận nhầm thành thẻ Cổng Đáng», «không đầu ra nào chứa…»). Lớp phủ
`card-plain.json` KHÔNG chữa được: khuôn khoá chỉ cho đổi CHỮ theo từng mã, việc
xếp mã vào khối nào do bộ dựng quyết. Nên lượt trình 01/09 lại phải giải thích
bằng lời ngoài thẻ — đúng hệ quả (2) ở trên, nay có hai ca có tên.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Hai khối «sẽ làm / sẽ không làm» thật sự giúp owner quyết — đáng sửa chứ không đáng bỏ | mọi công sửa là đắp cho một khối trang trí; lời giải đúng là hướng C (bỏ hai ô) | hỏi owner một câu tại thẻ kế: «khối *sẽ KHÔNG làm* có bao giờ đổi quyết định của anh không» + đếm ngược: `Out of scope` đã trả lời câu đó chưa | **Chưa thử** — thẻ đã tự gộp `Out of scope` vào khối phủ định (`gate-card.js:350`), tức hai nguồn đang chồng nhau |
| 2 | Phân biệt được «hệ thống sẽ chặn» với «chiều đỏ của thước» **mà không** bắt tác giả khai thêm | mọi hướng đều đòi nhãn tay → chi phí rơi lên mọi hợp đồng mới | thử một quy tắc cấu trúc (mệnh đề đầu tiên của Then quyết định, mệnh đề sau `;`/«phá thử»/«đối chứng»/«mutant» bỏ qua) trên 58 hợp đồng, so với nhãn người chấm trên mẫu 20 | Chưa thử |
| 3 | Nếu phải khai tay thì nhãn hợp đồng là chỗ rẻ nhất | thêm một khuôn nữa cho tác giả nhớ | khuôn đã có tiền lệ chạy thật: `(judgment)` và `(cross-layer)` đọc từ nhãn ở `lib/ac-line.cjs`; đếm chi phí = 1 tag trên ~10% tiêu chí | **Đã có hình dạng** — chưa đo chi phí thật |
| 4 | Đổi cách xếp **không** phá hồ sơ cũ | 58 hồ sơ đổi mặt cùng lượt, có hồ sơ đã ký | chạy bộ xếp mới trên toàn bộ 58 + `ra-co-ten` (0/15) và 2 hồ sơ 0-AC; đếm hồ sơ đổi rổ và soi tay mẫu 10 | Chưa thử — số nền đã có (bảng trên) |
| 5 | Owner đọc được «điều này là chiều đỏ của thước» nếu máy in nó ra, chứ không thấy nhiễu | in thêm = thẻ dài hơn mà không giúp quyết | ở hướng B/C, in chiều đỏ như **một dòng phụ dưới tiêu chí** thay vì một khối riêng; thử trên 1 thẻ thật | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: Trên **hồ sơ THẬT** (không fixture tự chế), owner đọc thẻ
  Cổng Phạm vi có nắm đúng «hệ thống sẽ làm gì» **mà không phải mở `contract.md`** không
  — và bộ xếp mới có còn xếp nhầm khi hợp đồng viết đúng `MEASURE-BIRTH-CLAUSE` không.
- Kết quả nào là SỐNG: đủ CẢ BỐN — (1) trên `ra-co-ten-lam-va-trao` và **≥ 2 hồ sơ
  thật khác mở từ 21/08**, mọi tiêu chí «hệ thống sẽ làm» hiện ở khối «sẽ làm», và
  **owner xác nhận bằng lời** bức tranh khớp hợp đồng — *phá thử: tiêm vào bản sao một
  tiêu chí thật sự là «hệ thống sẽ chặn» → nó phải rơi khối phủ định, nêu id*; (2) **0
  lần** owner phải mở `contract.md` để biết hệ thống làm gì, đếm trên 3 thẻ liên tiếp;
  (3) **0 lượt gọi người thêm** — không thêm câu hỏi nào ở cổng, và nếu hướng chọn đòi
  nhãn tay thì nhãn do **máy đề xuất, người chỉ veto** (không mở một lượt hỏi mới); (4)
  **đọc-cũ:** chạy bộ xếp mới trên toàn bộ 58 hợp đồng hiện có → **0 hồ sơ hoá «hỏng»,
  0 hồ sơ phải migrate**, mọi khác biệt là cờ vàng hoặc là chỗ xếp *đúng hơn* có soi tay.
- Kết quả nào là CHẾT: bất kỳ MỘT — (a) bộ xếp mới vẫn xếp nhầm ≥ 1 tiêu chí trên
  hồ sơ thật, và cách chữa duy nhất là **nới danh sách chữ** (lật giả định 2 → dò-chuỗi
  không có đáy, chỉ đổi được sang hướng A hoặc C); HOẶC (b) chi phí rơi lên tác giả:
  hợp đồng mới phải khai thêm nhãn cho **> 30%** tiêu chí (lật giả định 3); HOẶC (c)
  owner nói khối «sẽ KHÔNG làm» chưa từng đổi quyết định của mình (lật giả định 1 → lời
  giải là **hướng C**, và mọi công ở A/B là đắp cho trang trí); HOẶC (d) phải sửa tay
  hoặc migrate ≥ 1 hồ sơ đã ký (lật giả định 4).
- Timebox: ba thẻ Cổng Phạm vi thật, muộn nhất **2026-09-30** → `decision: park`.
  Cùng mốc với `ra-co-ten-lam-va-trao` vì ô này chỉ đo được sau khi hồ sơ đó ship.

## Kết quả prototype

Chưa dựng, và **không cần dựng**: mọi thứ đo được trên chính kit. Ba con số nền đã lấy
bằng **chạy thật** (không đọc code suy ra) trong phiên 23/08:

- `node scripts/gate-card.js --root . --slug ra-co-ten-lam-va-trao --gate 1 --extract`
  → `will_do: 0`, `wont_do: 15`.
- Quét 58 hợp đồng trên `main` → bảng ở section «Vấn đề».
- **Chưa đo:** tỷ lệ xếp nhầm *thật* (cần người chấm nhãn trên mẫu) — đây là phép thử
  của giả định 2, chưa chạy.

## Hướng khả dĩ (chưa chọn — red-team D2 xếp lại)

**A · Đánh dấu tường minh trong hợp đồng.** Tác giả gắn một tag ở nhãn tiêu chí (dạng
`(chặn)`), bộ đọc chỉ tin tag. *Tiền lệ:* `lib/ac-line.cjs` đã đọc `(judgment)` và
`(cross-layer)` từ đúng chỗ đó — hình dạng có sẵn, không sinh khuôn mới. *Giá:* chi
phí rơi lên **mọi hợp đồng mới**; và tag thiếu thì im lặng rơi về «sẽ làm» — cần một
cờ khi bộ tiêu chí có 0 tag mà văn bản đầy chữ phủ định.

**B · Xếp theo cấu trúc, không theo từ vựng.** Chỉ đọc **mệnh đề đầu** của Then; các
mệnh đề sau dấu `;` mở bằng «phá thử» / «đối chứng» / «mutant» / «bản sao … → đỏ» là
**khai chiều đỏ**, không phải hành vi sản phẩm — bỏ khỏi phép xếp và (tuỳ) in thành
dòng phụ «chứng bằng». *Giá:* vẫn là heuristic — đúng thứ đã hỏng một lần; muốn có
răng thì phải khoá khuôn vế Then bằng marker + test round-trip, tức trượt về A.

**C · Bỏ hẳn hai ô will/wont.** Thẻ in **một** danh sách tiêu chí, và để `Out of scope`
gánh câu «điều cố ý không làm» — nó vốn đã là scope-truth của Cổng Phạm vi, và thẻ đã
tự gộp nó vào khối phủ định ở `gate-card.js:350`. *Giá:* mất một lát cắt owner có thể
đang dùng — giả định 1 phải trả lời trước. *Được:* bỏ luôn một phép suy đoán không có
đáy; đúng luật «chỉ TRỪ, không CỘNG».

**Ghi chú xếp hạng ban đầu:** C rẻ nhất và trace thẳng vào «chỉ TRỪ»; A chắc nhất nhưng
CỘNG chi phí lên tác giả; B nhìn rẻ nhưng là cùng lớp lỗi đang sửa. Thứ tự phép thử nên
là **giả định 1 trước** (nó có thể xoá A và B khỏi bàn trong một câu hỏi).

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Bất biến «assertion âm-tính-một-mình» + `MEASURE-BIRTH-CLAUSE` | `CLAUDE.md` · `feature-loop/skills/feature-loop/SKILL.md` | triết-lý/logic | có — là **ràng buộc**, không được nới để chữa thẻ | — |
| Lớp lỗi «đo từ vựng thay vì quan hệ» | nếp đo nội bộ (memory: `do-tu-vung-thay-vi-quan-he`) | triết-lý/logic | có — ô này là một ca của đúng lớp đó | — |
| Khuôn tag đọc-từ-nhãn `(judgment)` / `(cross-layer)` | `lib/ac-line.cjs` | triết-lý/logic | có — tiền lệ cho hướng A | — |

Không có vật liệu ngoài repo. Không kế thừa hình thái.

## Cổng 0

- **decision = …** Căn cứ: …
- **disposition = …** Căn cứ: … *(không có prototype → `archive`)*
- **Ngưỡng UAT chốt cùng lúc ký:** …

## Thước đo thành công → ứng viên criterion

- Trên `ra-co-ten-lam-va-trao` + ≥ 2 hồ sơ thật khác từ 21/08: mọi tiêu chí «hệ thống
  sẽ làm» ở đúng khối, kèm phá-thử tiêm một tiêu chí «sẽ chặn» thật → rơi khối phủ định
  và nêu id. → ứng viên AC.
- Chạy bộ xếp mới trên toàn bộ 58 hợp đồng: `broken = 0`, `migrate = 0`; tập
  `(slug, rổ)` khác bản cũ đúng ở các dòng khai trong Notes. → ứng viên AC (đo bằng
  **quan hệ**, không ghim con số — bộ hợp đồng còn tăng).
- Nếu chọn hướng A: mọi chuỗi tag sống ở **một** khối marker, round-trip khuôn ↔ bộ
  đọc; bản sao khuôn đổi chuỗi → đỏ nêu chuỗi. → ứng viên AC.
- Nếu chọn hướng C: khối «Hệ thống SẼ làm» biến mất khỏi mọi bộ đọc, `card-plain.json`
  gỡ hai key khỏi danh-sách-đóng `CARD-PLAIN-KEYS`, và test G01 (`tests/scripts/run-tests.sh:1139`)
  + GS1 (`:1429`) đổi theo — hai test này đang **ghim chữ «Hệ thống SẼ làm»**, nên đây
  là chi phí đo được của hướng C, không phải rủi ro mờ.

## Out of scope từ khám phá

- **Không nới `MEASURE-BIRTH-CLAUSE` hay bất biến «assertion âm-tính-một-mình».** Chúng
  là lý do màu xanh của kit đáng tin; sửa thước đọc, không sửa luật viết. Nhánh này bác
  ngay từ đầu.
- **Không sửa `NEG_RE` ở `gate-card.js:230`** (cross-check «tiêu chí có eval khai chiều
  đỏ chưa»). Ở đó nó đo *thước* và đang đúng; ô này chỉ chạm chỗ nó bị bắt đo *sản phẩm*.
- **Không sửa trong hợp đồng `ra-co-ten-lam-va-trao`** — đã chốt ở entry
  `d-20260823T124500Z-31008`; sửa ở đó là mở phạm vi (điều kiện chết (e) của hồ sơ đó).
- **Lỗi 0-tiêu-chí là ô KHÁC, không gộp.** `het-gio-khong-phai-truot` và
  `tool-kill-duong-doc-lap` khai tiêu chí bằng heading `### AC-1 — …` nên `AC_LINE`
  (`lib/ac-line.cjs`) bóc được **0** dòng — thẻ hai hồ sơ đó không có tiêu chí nào, cả
  hai ô đều rỗng, và `acBlindSpot` **không kêu** vì `AC_SUSPECT` cũng đòi dạng bullet.
  Cùng hậu quả mặt người (owner duyệt trên thẻ rỗng), khác nguyên nhân hoàn toàn — ghi
  ra đây để khỏi bàn lại, mở ô riêng nếu đáng.
- **Không đụng thẻ Cổng Bằng chứng.** Hai ô will/wont chỉ sống ở Cổng Phạm vi.
