# Khảo sát trước khi đổi kit: tiền GitHub Actions và thời gian phiên — đo trên mọi kho tiêu thụ

Ngày 11/10/2026. Chủ kho giao: kit đổi là nhiều kho chịu, nên khảo sát lợi ích và tác động trước khi
quyết, đứng từ northstar. **Bối cảnh gốc kích hoạt việc tìm:** tốn tiền GitHub Actions và tốn thời gian ở
mỗi phiên. Đầu vào là tám đề xuất của hạt giống
`docs/plans/2026-10-11-hat-giong-northstar-tu-dot-crm-sau-14-10.md` (PR #301, chưa gộp).

Đây là SỔ đo, không phải ô. Mọi số đo lại được bằng các script ở
`docs/findings/assets/2026-10-11-khao-sat-actions-va-phien/` (cách chạy ở cuối).

## Kết luận một đoạn

Tiền và thời gian là **hai bài toán có hai gốc khác nhau**. Tiền: 98 % số tiền Actions phải trả tháng 10
nằm ở **một kho** (crm), và ở crm **chỉ ~10 % phút là job của kit** — phần còn lại là test sản phẩm mà
quy trình kit kích chạy lại: 30 % phút rơi vào PR không đổi dòng mã sản phẩm nào, 19 % vào commit giữa
chừng. Thời gian: chờ CI chỉ là **3,3 %** giờ máy có mặt trong phiên; thời gian đi vào **chờ người (24 %)**,
**S4 (14 %; crm 21 %)** và **suite/ghim lại (10 %; kit 19 %)**. Đòn bẩy lớn nhất về lượt gọi người **đã có
sẵn trong kit mà không chạy**: làn V (xanh-sạch, không mời ký) bắn **0/71** hồ sơ của đợt crm vì mỗi hồ sơ
còn mục Ngoài-n chờ người định tuyến — trong khi người định tuyến **trùng đề xuất của máy 94,9 %**.

## 1. Tiền — hoá đơn thật

Nguồn: API billing của tài khoản (`/users/phanlemanh/settings/billing/usage`). Giá runner Linux
**$0,006/phút**; không kho nào chạy macOS/Windows.

| Kho | Tháng 9: phút · trả | Tháng 10 (1–11): phút · trả | Ghi chú |
|---|--:|--:|---|
| crm-onehub (riêng tư) | 4 864 · **$21,00** | 10 332 · **$44,02** | ≈ 98 % số trả tháng 10 |
| radar (riêng tư) | 1 277 · $1,50 | 0 | ngủ từ 28/09 |
| 6 kho riêng tư khác | ≈ 720 · $0,70 | ≈ 50 · $0,27 | gần như ngủ |
| kit · OneFlow · MapPoster · OpenMAIC (công khai) | 5 190 · $0 | 5 079 · $0 | runner thường miễn phí ở kho công khai |
| **Tổng phải trả** | **$23,19** | **$44,32** | |

Nhịp crm tháng 10 ≈ 940 phút/ngày ⇒ **≈ $170/tháng** nếu đợt Điều phối – Thợ giữ cường độ; tuần 04–10/10
đốt ≈ 1 340 phút/ngày, gần **6 lần** trung bình 12–30/09 (≈ 230 phút/ngày). Tiền tuyệt đối nhỏ, **độ dốc** mới là tín hiệu: nó tăng theo số
máy × số hàng song song — đúng hướng lộ trình Điều phối – Thợ đang đẩy.

Chủ kho cân và **giữ crm ở private** (11/10): chuyển public đưa tiền về $0 nhưng khó đảo (lịch sử 7 185
commit, hồ sơ, log Actions thành công khai) và chạm quyền sở hữu mã.

### 1.1 Bên trong 14 701 phút-job của crm (30 ngày, 2 407 lượt)

| Phần | Phút | % | Ai sở hữu |
|---|--:|--:|---|
| Job kit (acceptance gate · bộ điều phối · luật kho · phân loại) | ≈ 1 450 | ≈ 10 % | kit |
| Test/build/tác nhân OKR trên **PR không đổi mã sản phẩm** | 4 378 | **30 %** | kho chạy, **quy trình kit sinh PR** |
| Test/build trên **commit giữa chừng** của PR có mã | 2 728 | **19 %** | kho chạy, **nhịp đẩy của vòng sinh** |
| Còn lại (lượt cuối của PR có mã · đẩy lên `onehub`) | ≈ 6 150 | ≈ 41 % | sản phẩm |

PR không đổi mã: **116/335 PR** (35 %). Theo tệp chạm: 72 PR chỉ T1 (job sản phẩm 2 541 phút = 17 % tổng)
và 44 PR chỉ hồ sơ `_acceptance/` + T1 (1 837 phút = 12,5 %). Theo nhánh: 63 `docs/` (lộ trình, sổ đợt), 20 `chore/` (nâng kit, ghim lại,
khai paths), 20 `fix/` (sửa thước), 9 `feat/`. Đây là việc **của chính quy trình**, không phải của vật.

Thời gian chờ CI mỗi lần đẩy (không có hàng đợi runner — mọi phút là chạy thật):

| Kho | trung vị | p90 |
|---|--:|--:|
| crm | 9,7′ | 25,6′ |
| **kit** | **14,6′** | 24,2′ |
| radar | 8,5′ | 13,6′ |
| OneFlow | 1,3′ | 1,8′ |

CI của kit chậm vì các bộ chạy **nối tiếp trong một job**: `scripts` 12,5′, `plugins` 6′, `workflows` 1,4′.

## 2. Thời gian phiên — bản ghi 12/08 → 11/10

Nguồn: 173 phiên chính + ~7 750 tệp tác tử con trong `~/.claude/projects`. Mỗi khoảng giữa hai bản ghi gán
đúng một trạng thái. «Giờ có mặt» = tổng giờ phiên trừ khoảng người vắng > 30′ và đuôi phiên.

| % giờ có mặt | crm (141 h) | kit (286 h) | mọi kho (702 h) |
|---|--:|--:|--:|
| Chờ người ≤ 30′ (gồm AskUserQuestion) | 27 % | 18 % | 24 % |
| Model nghĩ/viết | 28 % | 20 % | 24 % |
| **S4** (acceptance-verify) | **21 %** | 12 % | 14 % |
| **Suite test + ghim lại** | 4 % | **19 %** | 10 % |
| Chờ phiên khác (điều phối/peer) | 3 % | **21 %** | 10 % |
| Tác tử con | 9 % | 1 % | 5 % |
| **Chờ CI GitHub** | 1,6 % | 3,6 % | **3,3 %** |

- Một lượt S4: trung vị **18′** (crm), **25′** (kit). Vòng REJECT: crm 149, kit 81, OneFlow 21.
- Ghim lại: crm 14,8′/lượt (64,7 h), **kit 34,4′/lượt** (57,9 h).
- 238 AskUserQuestion (1,4/phiên), 2 379 tin người gõ (13,9/phiên).

**Giới hạn đo (đọc trước khi dùng):** giờ cộng theo phiên nên phiên điều phối và thợ chạy song song bị đếm
chồng; «chờ CI» là cận dưới (máy dừng lượt «đợi CI rồi báo» thì khoảng đó rơi vào «chờ người»); không tách
được chờ duyệt quyền; phân lớp lệnh bằng regex còn ~17 h «Bash khác»; hồ sơ chỉ đọc ở checkout chính.

## 3. Cổng Bằng chứng ở đợt crm `sau-14-10` — làn V có mà không chạy

Kit đã có làn V từ hồ sơ `veto-co-dau-vet`: hồ sơ T2 PASS, 0 UNCERTAIN, không bypass, mục Known limits và
Ngoài hợp đồng **có mặt-và-rỗng**, và mọi mục Ngoài-n trong `review-findings.md` **đã có dòng sổ `gate2`**
→ máy đi tiếp, KHÔNG mời ký (`scripts/pre-merge-check.sh`, `xanh_sach_check`; `lib/out-of-contract.cjs`,
`mucChuaDinhTuyen`). Dòng sổ được tính là «đã định tuyến» khi `stage: gate2` và `decision` mang nhãn
`Ngoài-n` — **không** đòi người viết (`daDinhTuyen`).

Mô phỏng trên 71 hồ sơ signed-off của đợt (đọc từ `origin/onehub`, `git archive`):

| Vì sao hồ sơ phải mời ký | Hồ sơ |
|---|--:|
| **Có Ngoài-n chưa định tuyến** (lý do DUY NHẤT) | **59** |
| Hạng T3 (luôn ký — đúng thiết kế) | 7 |
| Có UNCERTAIN (luôn ký — đúng thiết kế) | 5 |
| Đủ điều kiện làn V | **0** |

565 mục Ngoài-n trong 71 hồ sơ. Máy đề xuất: known-limits 450 · wont-fix 72 · new-contract 52. Lớp tệp:
404 thước (test/eval/hồ sơ) · 162 mã sản phẩm · 8 công cụ/tài liệu.

**Người làm khác máy bao nhiêu:** 376 dòng định tuyến của người ở Cổng 2 so với đề xuất của máy: **357 trùng
(94,9 %)**, 19 khác — 13 ca «máy: known-limits → người: mở hợp đồng mới», 3 ca wont-fix → known-limits,
2 ca new-contract → known-limits, 1 ca wont-fix → new-contract. Lớp tệp **không** tách được ca lệch
(thước|known-limits lệch 8/222, mã SP|known-limits lệch 5/77) — nên phép chia đúng là theo **đề xuất**, không
theo tệp.

**Nếu máy tự định tuyến mục mà chính nó đề xuất known-limits/wont-fix** (ghi dòng sổ `gate2` có
`decided_by` máy, hiện ở khối «CHƯA duyệt» của thẻ, đảo bằng một dòng sổ người) và để `new-contract` cho
người:

| | Hôm nay | Sau |
|---|--:|--:|
| Hồ sơ mời ký Cổng 2 | 71 | **33** (−54 %) |
| Mục Ngoài-n người phải phân xử | 565 | **52** (−91 %) |
| Ca người sẽ định tuyến khác mà nay đi qua không hỏi | — | 11/237 mục, ở 3 hồ sơ (8 ở `logo-onehub`, hồ sơ UI) |

Giá của 11 ca: 8 mục người muốn mở việc mới thì nằm ở Known limits/sổ — **đảo rẻ** (mở hạt giống sau),
không mất dấu. 3 ca wont-fix → known-limits chỉ là ghi sổ chặt hơn.

## 4. Kho nào còn sống, ai dựa vào gì

Đọc 15 kho qua `gh api` ở HEAD nhánh mặc định 11/10 (chi tiết sha ở bản đo gốc).

| Kho | Kit cài | Sống? | Job kit trong CI |
|---|---|---|---|
| crm | v2.26.0 | **sống** (100 PR/6 ngày) | pre-merge · product-map · `test:dieu-phoi` |
| OneFlow | v2.24.0 | ngủ nhẹ — **đợt thử Điều phối ~27/10** | pre-merge · product-map |
| radar | ≈ 2.18–2.19 | ngủ từ 28/09 | pre-merge · product-map |
| artifact-platform · media-library · floorplanstudio · MapPoster | v2.24.0 | ngủ (artifact-platform: main đỏ ở pre-merge từ 23/09) | pre-merge (± product-map) |
| OpenMAIC · aes · radar-realestate · realestate-data-foundation | ≈ 2.11–2.19 | ngủ | pre-merge nhẹ |
| media-crawler · policy-graph-hub · artifact-platform-design · floorplan | — | ngủ | không CI theo PR |

Không kho nào bỏ qua PR nháp ở job nặng (crm PR #369 đang mở mới thêm), không kho nào có merge queue, nhánh
`onehub` của crm không được bảo vệ. 12 kho có CI dựa vào `human_signoff` từng hồ sơ ở pre-merge.

**Một khớp nối mong manh đã có thật:** bộ phân loại PR của crm (#369) rút hai hàm `glob_variants` và
`match_globs` khỏi `scripts/pre-merge-check.sh` bằng `sed`. Kit đổi tên/tách hai hàm đó thì khoản tiết kiệm
của crm tắt mà không báo — kit đang có một người tiêu thụ hàm nội bộ mà không biết.

## 5. Tám đề xuất — cân trên mọi kho

Phép thử của CLAUDE.md: «kho KHÔNG có sự cố này được gì, mất gì?» · «hành vi cũ có ai đang dựa không?» ·
thứ tự nghiệm: đúng tầng → đọc khoan dung → bật thêm theo lựa chọn → đổi mặc định.

| # | Đề xuất | Lợi trên hai trục gốc | Kho khác | Hành vi cũ ai dựa | Kết luận |
|---|---|---|---|---|---|
| 1 | Đo chi phí từng vòng | gián tiếp: điều kiện để đo mọi thứ khác | trung tính | crm khoá `repin_cost_cmd` | **Làm, thu nhỏ.** Tiền đề «0 hồ sơ ghi token» SAI: token có ở `usage-report.md` (166 hồ sơ crm), `scripts/ho-so-tom-tat.cjs` đã đọc. Hở thật = **lớp lý do REJECT** (mã · thước · hạ tầng · chập chờn; BLOCKED crm 75 lượt không ghi lý do) + **bản tổng theo đợt** |
| 2 | Ký Cổng 2 theo lô | người: 71 → 33 lời mời | được lợi khi Ngoài-n có (radar 137 nhãn) | 12 kho đọc `human_signoff` — **lô bỏ trường này thì 12 CI đỏ** | **Thay bằng làn V có sẵn** (§3) — không dựng bảng lô |
| 3 | Ngoài-n tự phân loại, Known limits mặc định | người: 565 → 52 mục | như trên | Làn V đòi mục Known limits của báo cáo **rỗng**: đổ Ngoài-n vào đó thì làn V càng tắt | **Gộp với 2:** định tuyến bằng **dòng sổ** (như người đang làm, mục ghi ở Notes hợp đồng), KHÔNG viết vào Known limits của báo cáo |
| 4 | Cổng Đáng một lần cho gói đợt | người: ≤ 48 → 1/đợt | không áp dụng (chỉ crm có đợt) | `lo-trinh.mjs`, `product-map.mjs`, bước S5 đọc `opportunity.md` **theo slug**; hàng kế thừa không tệp bị coi là ship thẳng, **bỏ phiên nghiệm thu** | **Hoãn**, đo ở đợt thử 26/10 |
| 5 | PR nháp tới lúc trình Cổng 2 | tiền crm ≤ 19 % | **mất** ở 4 kho: hôm nay nhánh chưa PR thì không CI; mở nháp sớm biến mỗi lần đẩy thành một lượt đủ | — | **Không đổi mặc định.** Bật theo lựa chọn, chỉ cho kho có CI bỏ qua nháp |
| 6 | Hàng gộp chung nhiều máy | thời gian (chuỗi gộp lại kiểu #358); lượt chạy lại 1 316 phút/30 ngày | không áp dụng | luật riêng 5 của crm (cấm `--auto`, chỉ phiên giám sát gộp); `onehub` chưa ruleset | **Hoãn**, thuộc DP4/DP7, đo ở đợt thử |
| 7 | Phát hành vá baseline + mod canh hộp quyền | thời gian: hai lần S4 treo ≈ 2 h 30 và ≈ 8 h giữ khoá | trung tính | crm có hook riêng `hook-cho-nguoi.mjs` trên `permission_prompt` → **dễ bắn đôi** | **Làm** ở mốc 18/10: `baseline-tran-bo-qua-don` đã ký, DP6 là PR #315 — kiểm bắn đôi trước khi cắt |
| 8 | Kit in tầng PR cho CI kho | tiền crm: 12,5 % phút (PR chỉ hồ sơ; PR chỉ T1 crm tự lo ở #369) | trung tính nếu chỉ thêm lệnh | 5 kho khai `ci.yml` là T1, MapPoster khai `.github/**` — lệnh đọc **đúng danh sách của kho**, không thêm danh sách thứ hai; án `.out-of-scope/t1-skip-globs-github-and-manifests.md` giữ | **Làm, bật theo lựa chọn**, và nâng ưu tiên: thay khớp nối `sed` mong manh (§4). Đầu ra cần thêm một bit **«chạm vật sản phẩm?»** — PR chỉ hồ sơ (12,5 % phút) không là T1 nhưng không cần test sản phẩm |

## 6. Đòn bẩy hạt giống không có

- **CI của kit chạy nối tiếp** (§1.1): tách bộ thành job song song — kit công khai nên không tốn tiền, không
  chạm kho nào; cận dưới chờ là bộ `scripts` 12,5′ (muốn nhanh hơn phải chia bộ đó). Chỉ có lợi cho phiên
  sửa kit — meta, nên vào sổ, không mở ô.
- **Ghim lại 34′/lượt ở kit, 15′ ở crm**: một trong hai khối lớn nhất của thời gian phiên kit. Hạt giống
  `gia-ghim-lai` đã có; số này là neo cho nó.
- **Số PR của quy trình** ở crm (lộ trình, sổ đợt, nâng kit, sửa thước — 116 PR/30 ngày) là việc của kho
  (gom hoặc đẩy theo lô) — kit không đổi.

## 7. Một đường đề nghị

Đích đo là **đợt thử 26/10 (crm) và ~27/10 (OneFlow)**, nên mọi thứ dưới đây phải vào mốc 25/10 hoặc
sớm hơn; thứ không kịp thì hoãn chứ không đổi engine dưới chân đợt.

1. **crm tự làm, không chờ kit:** gộp #369 (bỏ job nặng cho PR chỉ T1 và PR nháp). Lợi ≈ 17 % phút ngay.
2. **Vòng kit A (T2) — đề 2 + 3 hợp nhất:** máy ghi dòng sổ `gate2` cho mục Ngoài-n mà chính nó đề xuất
   known-limits/wont-fix; `new-contract`, T3, UNCERTAIN giữ cho người; thẻ hiện các mục đó ở khối «CHƯA
   duyệt» kèm lệnh đảo. Dự báo trên đợt vừa rồi: lời mời ký 71 → 33, mục phân xử 565 → 52. CỘNG → cần
   chủ kho phê ở Cổng Phạm vi. Nối vào **DP7** (khối «Trong đợt» của feature-loop).
3. **Vòng kit B (T2 nhỏ) — đề 8:** lệnh in tầng + bit «chạm vật sản phẩm?» thành output GitHub, đọc
   `t1_skip_globs` của kho; crm thay `sed` bằng lệnh này. Lợi crm thêm ≈ 12,5 % phút (PR chỉ hồ sơ).
4. **Mốc 18/10 — đề 7:** phát hành `baseline-tran-bo-qua-don` + DP6 (#315), sau khi kiểm bắn đôi với hook
   của crm.
5. **Đề 1 thu nhỏ** đi cùng vòng A hoặc B: lớp lý do REJECT trong dòng `round-tally` + tổng đợt từ
   `usage-report.md` — để đợt thử 26/10 đo được.
6. **Hoãn, đo ở đợt thử:** đề 4 (nối **DP2**), đề 5 (bật theo lựa chọn, sau đề 8), đề 6 (nối **DP4/DP7**).

Dự báo năm dòng (luật (c)) nếu làm 1–5: thời gian làm-xong→quyết-được ↓ (bớt lượt chờ ký) · lượt gọi người
↓ (Cổng 2 −54 % trên đợt) · vòng bị hạ tầng đốt ↓ (đề 7) · token máy/vòng = (không đổi S4) · phút máy/lượt
chấm = ; ngoài luật (c): **phút Actions crm ↓ ≈ 30 %** (17 % + 12,5 %), tới ≈ 48 % khi bật thêm PR nháp (≈ $170 → ≈ $90/tháng ở nhịp tháng 10).
Điều kiện tin cậy: đường verdict không đổi thành phần — vòng A chỉ đổi AI ghi dòng sổ định tuyến, không đổi
finder/refute/REJECT.

## Cách đo lại

Từ `docs/findings/assets/2026-10-11-khao-sat-actions-va-phien/` (cần `gh` có quyền `repo`; hoá đơn cần
thêm quyền `user`):

```bash
node pull-daily.mjs crm-onehub            # runs + jobs 30 ngày, chia theo ngày để né trần 1 000 kết quả → raw-<kho>.json
node analyze.mjs                          # bảng phút theo kho; thêm tên kho để xem theo workflow/job
node superseded.mjs crm-onehub            # phút trên commit giữa chừng, theo ngày, lượt chạy lại
node latency.mjs crm-onehub acceptance-gate-kit
gh api "/users/phanlemanh/settings/billing/usage?year=2026&month=10"
```

Phân loại PR theo tệp cần `prs-<kho>.json` (danh sách tệp mỗi PR qua `gh api pulls/<n>/files`) và danh sách
`t1_skip_globs` của kho, rồi `node savings.mjs crm-onehub <tệp glob>`. Làn V:

```bash
git -C <kho crm> archive origin/onehub _acceptance | tar -x -C <thư mục>
git -C <kho crm> log origin/onehub --since=2026-10-07 --name-only --format= -- '_acceptance/*/evidence-report.md' | cut -d/ -f2 | sort -u > slugs.txt
node lan-v-mo-phong.mjs <thư mục> slugs.txt
```

Thời gian phiên: `python3 session_time.py <out.json>` (đọc `~/.claude/projects`) và `python3 runlog.py
<out.json>` (đọc `_acceptance/*/run-log.jsonl` + `usage-report.md` ở các kho trong `~/dev`).
