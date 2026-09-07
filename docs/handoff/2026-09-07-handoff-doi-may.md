# Handoff 07/09/2026 — đổi MÁY giữa lúc hàng đợi vừa được xếp lại

*Người bàn giao: phiên chạy bốn lượt đối chiếu playbook AI-Native SDLC (Claude,
máy cũ) · Người nhận: phiên đầu tiên trên máy mới.*

> **Đổi MÁY, không phải đổi tài khoản.** Khác biệt quan trọng: **trí nhớ dự án
> KHÔNG đi theo** — `~/.claude/projects/-Users-manhphan-dev-acceptance-gate-kit/memory/`
> là thư mục thường, **không** phải git repo, **156 file** tích trong hai tháng.
> Máy mới mở phiên đầu tiên sẽ có `MEMORY.md` **rỗng**. Mục 1 dưới đây chép lại
> phần trí nhớ **không có bản nào trong repo**; mọi thứ khác trong mục 2 đều
> truy được từ kho.

---

## 0. Một câu: không có gì đang chạy dở, việc kế là một mốc phát hành

Cây sạch, `main` = `origin/main` = **`6aa6bb0a`**, không nhánh nào treo, không
vòng nào giữa S1–S4. Owner đã gật thứ tự hàng đợi 07/09. **Việc đầu tiên của
phiên nhận: phát hành 2.9.0 làn V** — không phải mở ô mới, không phải làm tiếp
thứ gì.

---

## 1. ⚠ Điều KHÔNG đi theo máy — chép nguyên văn

### 1.1 Owner nới luật «chỉ TRỪ, không CỘNG» (07/09) — CHƯA vào `CLAUDE.md`

**Nguyên văn owner, 07/09, sau khi đọc hồ sơ đối chiếu playbook:**

> «Luôn giữ Kit đi về north star nhưng tại Thời điểm này Kit sẽ chấp nhận lắng
> nghe để mở luật có thể cộng nhưng scope rộng hơn để làm tốt điều đó thì hãy: …»

**Đọc thế nào** (bản của phiên bàn giao, owner chưa sửa): đây là nới **một** luật
— «chỉ TRỪ, không CỘNG» ở mục *Ba nguyên tố* của `CLAUDE.md` — **không** phải nới
cả hiến pháp. Ba thứ **không** đổi:

1. mọi thứ thêm vẫn phải **trace về một trong ba nguyên tố** + nêu **người hưởng**;
2. mục tiêu **≤3 lượt gọi người/vòng** (T3 trần 4) và **≤1 chạm/lượt** vẫn là thước;
3. **khó-đảo vẫn luôn là câu hỏi cho người**.

Cái đổi: một đề xuất **không còn bị bác chỉ vì nó là CỘNG**. Nó bị bác khi làm
tăng lượt gọi người mà không cắt gì, hoặc không trace được.

**Vì sao owner nới:** bảy đề xuất từ playbook bị bác 07/09 phần lớn vì lăng kính
«vi phạm luật kit» đánh vào vế CỘNG; owner thấy lăng kính đó chặn quá tay ở giai
đoạn kit cần học từ ngoài.

**Áp dụng:** khi đối chiếu tài liệu ngoài hay mở ô, **không** dùng «đây là CỘNG»
làm lý do bác duy nhất. Vẫn bắt trace + người hưởng + ảnh hưởng lượt gọi người.
Ô nào mở dưới luật này thì **ghi rõ trong hồ sơ** («mở dưới luật nới 07/09») —
bốn hạt giống ở mục 4.2 đã ghi sẵn.

**⚠ Đang treo:** luật này chưa được viết vào `CLAUDE.md`, tức người đọc hiến pháp
vẫn thấy bản chưa nới. Đây đúng lớp lỗi mà `docs/reference/DIAGRAM-RULE.md` §6 đã
gọi tên: *luật sống trong trí nhớ thì không đi theo máy*. Xem mục 6.

### 1.2 Nếp «hạt giống phải có ô» — đã có VẬT canh, không cần chép luật

Vấp thật của phiên này (CI đỏ lần đầu ở PR #152): ghi 4 hạt giống mới vào
`docs/plans/*-hat-giong-*.md` mà không kèm ô → ca **VC8** đỏ.

Nếp: **viết hạt giống = viết ĐÔI** — file hạt giống **+** stub
`_acceptance/<slug>/opportunity.md` theo khuôn `OPP-FRONTMATTER-TEMPLATE`
(bắt đầu ngay ở `---`, `stage: discovery`, `decision` trống, ngưỡng để
`[đề xuất]` hoặc `…`, Cổng 0 để trống). Trong **10 dòng đầu** file hạt giống
**không** khai trạng thái («chờ Cổng 0», «HẠT GIỐNG») — chỉ trỏ về ô: trạng thái
sống MỘT chỗ. Xong thì **vẽ lại bản đồ** cùng lượt (`node scripts/product-map.mjs --root .`)
vì «Đang cân nhắc» đổi số.

Kiểm nhanh trước khi đẩy:

```bash
VC_CASES=VC8 node tests/plugins/vao-co-o.test.mjs && node scripts/product-map.mjs --root . --check
```

Nếp này **không cần chép vào tài liệu nào**: ca VC8 (`tests/plugins/vao-co-o.test.mjs`)
là vật canh, nó đỏ nếu ai quên. Đúng doctrine của kit — vật thay lời.

### 1.3 Hai vấp hạ tầng của máy cũ (có thể khác trên máy mới)

- **`playwright` chưa cài** → không xuất được PNG cho hình. Sáu hình của phiên
  này chỉ có `.html` + `.svg`. Muốn PNG: `pip install playwright && playwright install chromium`.
- **Mạng tới `github.com` chết ~10 phút rồi tự hồi** (cả https lẫn ssh, trong khi
  `gh api` vẫn chạy). Nếu `git push` treo: `gh api` để đọc trạng thái, và bọc
  lệnh git bằng `perl -e 'alarm 150; exec @ARGV' git …` (máy cũ **không có**
  `timeout`).

---

## 2. Đọc gì trước — đúng thứ tự

| # | File | Vì sao |
|---|---|---|
| 1 | `CLAUDE.md` | hiến pháp kit: North Star · ba nguyên tố · luật Giới hạn CHIỀU RỘNG (a)(b)(c). **Đọc kèm mục 1.1 ở trên** — bản trong file chưa nới |
| 2 | `docs/findings/2026-09-07-tong-hop-hat-giong-va-o.md` | kết của phiên này: 24 phát hiện → 7 lớp → một ô + bốn hạt giống + **thứ tự owner gật** (§3) |
| 3 | `docs/findings/2026-09-07-bai-hoc-playbook-ban-de-doc.md` | bản dễ đọc: 3 bài tác động lớn nhất · bài nào đã có chỗ · 4 việc sửa ngay |
| 4 | `_acceptance/release-2-8-0/contract.md` | khuôn hồ sơ mốc phát hành — **mẫu để dựng 2.9.0**: §Context · §Ba dòng số · §Chỗ cắt gọi tên · Criteria · Coverage · Đường đo. Cũng chứa hai bẫy đã đo (mục 5.2) |
| 5 | `GUIDE.md` §7.1 | luật re-pin theo mốc phát hành (phiên này vừa sửa một câu chết ở đây) |
| 6 | `docs/findings/2026-09-07-doi-chieu-ai-native-sdlc-playbook.md` | hồ sơ bằng chứng đầy đủ, mọi khẳng định kèm `file:line` — đọc khi cần tra lại, không cần đọc trước |
| 7 | `docs/research/2026-09-07-ai-native-sdlc-playbook.md` | bản gốc playbook (1084 dòng) — nguồn của mọi trích dẫn |

Sáu hình tầng 2 ở `docs/plans/assets/2026-09-07-bai-hoc-playbook/` (`.html` +
`.svg`; hai hình toàn trình có `procgen.py` + `*.spec.json` để **tái sinh** chứ
không sửa tay).

---

## 3. Trạng thái chính xác

| Món | Giá trị |
|---|---|
| Nhánh | `main`, sạch, `HEAD` = `origin/main` = `6aa6bb0a` |
| Phiên bản | acceptance-gate **2.8.0** · feature-loop **2.8.0** · diagram-design 2.7.0 (`GUIDE.md:5` khớp) |
| CI mốc gần nhất | PR #152 xanh cả hai check: `gate` 37s · `tests` 7m25s |
| Bảo vệ nhánh `main` | **PR bắt buộc** (0 review), checks bắt buộc `gate` + `tests`, không strict, không linear → merge bằng **merge commit**, KHÔNG squash (squash giết chữ ký Cổng 2) |
| Hàng đợi | **21** ô `discovery` chờ Cổng Đáng · **1** ô đã ký build chưa xây (`vong-la-mot-ket-qua`) · 2 park · 1 kill |
| Nợ nhát cắt | **Ngoài-4** của 2.8.0 «họ fail-open trong phép đo + hậu-chữ-ký» — chưa làm |

**Cửa sổ 2.8 → 2.9 đã tiêu BA vòng sửa** (#146 `inputs-tinh-tu-goc-kho` · #149
`co-qua-timebox-nhom-da-xong` · #151 `thuoc-khai-mot-dang-do-mot-neo`) — **vượt
trần một-vòng-meta** của luật (b). Đó là lý do «phát hành 2.9.0 ngay» là việc kế,
không phải một ô nữa.

---

## 4. Việc kế — thứ tự owner gật 07/09

Hình: `docs/plans/assets/2026-09-07-bai-hoc-playbook/06-hang-doi-theo-cua-so.svg`.
Owner nói nguyên văn: *«Gật thứ tự này, commit hết lên main»*.

### 4.1 Việc số 1 — phát hành 2.9.0 làn V

Phạm vi: 11 PR gộp sau mốc 2.8.0 (`cd94d004`).

| PR | Nội dung |
|---|---|
| #142 | chiến dịch ghim lại mốc 2.8.0 (3 làn + con trỏ thay thế) |
| #143 | ô Cổng Đáng `vong-la-mot-ket-qua` — ký build 04/09 |
| #144 | audit tài liệu 05/09 + **ADR 0013** (mở thật dưới MIT) + dọn drift |
| #145 | `LICENSE` thuần MIT, phần vendor sang `NOTICE` |
| #146 | `s4-args`: inputs của judgment tính từ gốc kho, input vắng → exit 2 |
| #147 | chip: danh sách chép CI thiếu `product-map` (ca thật từ kho crm) |
| #148 | hạt giống «việc kế theo plan» + ô discovery |
| #149 | `start-scan`: cờ quá-timebox cắt ngang cả nhóm đã xong |
| #150 | vẽ lại bản đồ (gộp song song #148/#149) |
| #151 | răng P86: hai thước đo đúng vật được giao |
| #152 | bộ tài liệu playbook 07/09 (phiên này) |

**Vật chạm engine cần khai trong hợp đồng mốc:** `feature-loop/scripts/s4-args.mjs`
· `scripts/start-scan.mjs` · `feature-loop/skills/feature-loop/SKILL.md` ·
`skills/acceptance/SKILL.md` · `skills/acceptance/references/eval-executors.md` ·
`LICENSE` · `NOTICE` · `README.md` · `QUICKSTART.md` · `GUIDE.md` · hai
`plugin.json` (hiện chỉ đổi `license` Proprietary→MIT, **version chưa bump**).

Nhắc của luật (c): mốc phát hành **≤1 lượt gọi người** (làn V — tiền lệ 2.5.0 →
2.8.0 đều một lượt), và hồ sơ mốc **phải đếm ba dòng số** + **gọi tên một chỗ cắt**
cho cửa sổ kế. Chỗ cắt đã có tên sẵn: **ô «Đường lùi phải sống»** (4.2).

### 4.2 Sau đó — theo đúng thứ tự này

| # | Việc | Vật đã có |
|---|---|---|
| 2 | **Ô «Đường lùi phải sống»** — gom 5 mục cùng một câu hỏi *làn máy-đi-trước có đường lùi thật không?*: (a) thẻ mời «veto: lý do» mà lệnh ký không nhận · (b) ô kết `machine-cleared` có bộ đọc, chưa có đường ghi · (c) «không soi lại được» là NOTE kể cả chế độ nghiêm · (d) làn V thoát phép kiểm bằng-chứng-cũ · (e) lệnh ký không chạy suite → 1 CI đỏ/chữ ký. **Kế thừa nợ Ngoài-4**; gom hai ô discovery đang lẻ (`lan-may-thong-duong-ghi`, `lan-v-thoat-kiem-stale`). Cắt hai lát: lát 1 = đường ghi (a,b), lát 2 = fail-open ở chốt (c,d,e) | `docs/findings/2026-09-07-bai-hoc-playbook-ban-de-doc.md` §2 bài 3 + §4; hình `03-cua-veto-hom-nay-va-sau.svg`; răng đã canh sẵn ở `scripts/pre-merge-check.sh:1226-1247` |
| 3 | **`vong-la-mot-ket-qua`** — ô đã ký build 04/09, timebox ≤2 ngày; media-library chờ 5 vòng A–E | `_acceptance/vong-la-mot-ket-qua/opportunity.md` (4 chỗ cắm đã ghi) |
| 4 | **Thước sống theo đời model** | `docs/plans/2026-09-07-hat-giong-thuoc-song-theo-doi-model.md` + ô `_acceptance/thuoc-song-theo-doi-model/` |
| 5 | **Nhà ý định lát A + B** | `docs/plans/2026-09-07-hat-giong-y-dinh-co-nha-rieng.md` + ô `_acceptance/y-dinh-co-nha-rieng/` |
| — | **Theo ngưỡng đếm, chưa vào hàng:** luật lái máy hồi quy (`luat-lai-may-duoc-hoi-quy`) · nhà ý định lát C (băng sau phát hành) · bất biến sản phẩm (`bat-bien-san-pham`) | ba file hạt giống + ba ô, mỗi cái có ngưỡng ghi sẵn |

**Đảo được rẻ:** đảo việc 2 ↔ 3 chỉ làm nhát cắt gọi tên trượt một mốc. Và việc
«luật lái máy hồi quy» nhảy lên đầu nếu mốc 2.9.0 lại có ≥2 lượt hạ tầng phiên.

---

## 5. Phiên này đã giao gì (PR #152, merge `6aa6bb0a`)

### 5.1 Năm commit, add đích danh từng file

1. `research(playbook)` — bản gốc + 4 hồ sơ findings + 6 hình + `.out-of-scope`
2. `docs(plans)` — bốn hạt giống
3. `docs(guide)` — §7.1 gỡ câu chết «mỗi lần một lượt gọi người» (làn ghim-lại
   máy-một-mình đã sống từ 16/08 → câu cũ dạy sai mô hình chi phí)
4. `chore(product-map)` — hồ sơ bác vào «Ngoài phạm vi đã ký»
5. `docs(acceptance)` — **bốn ô discovery** (sửa CI đỏ VC8) + bản đồ 17 → 21

### 5.2 Kết luận đáng nhớ của hai đợt đối chiếu

- **0/9 bài sống nguyên văn** qua hai lăng kính đối kháng. Ba hình dạng bị bác
  lặp lại: *tố kit thiếu thứ kit đã có* · *đề nghị CỘNG* · *phát hiện đã nằm
  trong ô đang sống*. Nếp đọc tài liệu ngoài: đọc như **danh mục đối chứng** thì
  chỉ trích trúng vùng kit đã mạnh — phải đọc như **chuỗi bàn giao**.
- **Giá trị thật nằm ngoài 9 bài**: bốn lớp «máy tin nhầm chính nó» playbook chỉ
  ra mà kit chưa canh — 80/80 bằng chứng không ghi model sinh ra nó · luật lái máy
  đổi mỗi mốc không thước nào chạm · ca đo nhạt theo đời model · không gì cấm
  người sửa mã nới thước của mã đó.
- **Kit mạnh hơn playbook ở giữa vòng** (chiều đỏ, phản biện sạch, sổ quyết định),
  **yếu hơn ở hai đầu vòng và ở thời gian**. Bốn chỗ kit **cố ý** đi ngược
  playbook đã ghi kèm giá ở `.out-of-scope/doi-chieu-playbook-ai-native.md`.
- **Ba đính chính máy tự bắt** (đọc trước khi tin lại số nào): «31/31 hồ sơ
  `veto_state: mo`» sai mẫu số — đo tại `5c15e065` là **78 hợp đồng / 31 có khoá**,
  đếm lại hôm nay trên `6aa6bb0a` là **80 / 33** — **và** sai cả kết luận: khoá
  vắng là đường đọc-cũ, chiều AN TOÀN (`lib/evidence-core.cjs:460`) · cáo buộc
  `mirror-sync-grandfather` miễn trừ 21 slug là **sai**, `recheckCorpus()` đọc
  MỌI report · 4/9 bài không có trích dẫn playbook nào (thước không gắn vào vật).

### 5.3 Hai bẫy của mốc phát hành trước — đọc trước khi dựng 2.9.0

Cả hai ghi trong `_acceptance/release-2-8-0/contract.md`:

- **Bẫy xanh-sạch (§Notes, Ngoài-3):** để trống hai mục «Known limits» và «Ngoài
  hợp đồng» của báo cáo → bộ đọc xanh-sạch tuyên «không mời ký» trong khi thẻ
  Cổng 2 vẫn in 6 ô → **suýt merge mốc không có chữ ký**. Điền hai mục TRƯỚC khi
  trình thẻ.
- **Thuế ghim-dòng-lúc-ký:** dòng định tuyến ở `tests/scripts/fixtures/` chỉ ghim
  được **sau** khi ký, mà thêm dòng lại làm chính hồ sơ hoá cũ → mỗi chữ ký kéo
  một lần ghim lại. Cách tránh đã ghi ở 2.8.0 Known limits: thêm dòng **trước**
  khi commit chữ ký, **cùng commit**.
- Và: **đổi `status` thì phải vẽ lại bản đồ cùng lượt** — vòng 1 của 2.8.0 REJECT
  vì đúng chỗ này (5 eval đỏ một gốc).

---

## 6. Việc còn treo — cần owner, không phải máy

**Một câu hỏi duy nhất:** luật nới 07/09 (mục 1.1) nên **vào `CLAUDE.md`** thành
một dòng có ngày và điều kiện thu hồi, hay để nguyên trong hồ sơ bàn giao này?

- **Máy khuyên: vào `CLAUDE.md`.** Căn cứ: `DIAGRAM-RULE.md` §6 của chính repo đã
  phán lớp lỗi này — *luật cất ở trí nhớ thì không tới được máy khác, người khác,
  hay một bản clone mới; nó tự vi phạm chính nó*. Phiên bàn giao này là bằng
  chứng thực nghiệm: luật mới **một ngày tuổi** đã suýt mất khi đổi máy.
- **Giá:** `CLAUDE.md` dài thêm ~6 dòng (playbook khuyên giữ dưới một trang; file
  hiện 178 dòng ≈ 5 trang — đã là giới hạn đã khai).
- **Vì sao máy không tự làm:** đây là sửa hiến pháp, thuộc lớp khó-đảo → chữ quyết
  của người (ADR 0002 · nguyên tố 3).

Các thứ **không** cần quyết bây giờ: bốn hạt giống đã có ngưỡng đếm, tự vào hàng
khi ngưỡng chạm; ba ô discovery mới của #147/#148 (`viec-ke-theo-plan` ·
`the-cong-2-giau-loi-trong-hop-dong` · `danh-sach-chep-ci-thieu-product-map`)
nằm trong 21 ô chờ Cổng Đáng như mọi ô khác.

---

## 7. Nếp làm việc của repo — thứ trí nhớ máy cũ giữ mà kho cũng có

Không chép lại ở đây; chúng đã có nguồn trong kho, chỉ nêu con trỏ:

| Nếp | Nguồn trong kho |
|---|---|
| `git add` **đích danh** từng file, không `-A` / `-am` | `CLAUDE.md` (repo bán audit-trail diff ↔ contract) |
| Merge PR bằng **merge commit**, không squash | chữ ký Cổng 2 nằm trong commit — squash làm đứt |
| Hình là **chiếu của chữ**, ba tầng theo tuổi thọ | `docs/reference/DIAGRAM-RULE.md` |
| Term chuẩn + danh sách từ cấm khi viết cho người | `CONTEXT.md` (48 term) |
| Đổi schema artifact phải có **đường đọc-cũ** + cờ vàng | `CLAUDE.md` |
| Assertion âm-tính phải có **đối chứng dương** + ghim thông điệp | `CLAUDE.md` |
| Thước phải gắn vào **vật được giao** | `CLAUDE.md` (4 hình dạng đã dẫm) |
| Sáu thao tác cổng người là **danh sách đóng** | `docs/adr/0002-human-gate-invocation-lock.md` |
| Chữ ký là quyết định, provenance từ forge | `docs/adr/0012-…` |
| Mở thật dưới MIT + bản chép mô hình cổng phải có răng | `docs/adr/0013-…` |

**Nếu owner muốn trí nhớ đi theo máy** thì đó là một việc riêng (kho riêng cho
`memory/`, hoặc chấp nhận mất và dựa vào kho). Không mở ở đây.
