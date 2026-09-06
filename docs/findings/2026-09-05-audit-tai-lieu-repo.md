# Audit tài liệu repo (05/09) — mặt máy tươi, mặt người đóng băng 23/08

> Owner yêu cầu 05/09: *«Đã từ lâu chưa cập nhật các tài liệu của repo trên
> github, làm đợt audit lớn cho nó sau đó đề xuất hướng cập nhật.»*
>
> Phạm vi: mọi mặt tài liệu người đọc được trên GitHub — 6 file gốc
> (168 KB), `docs/` (240 file `.md`, 5.9 MB), `.github/`, và mặt meta của
> repo (license · release · issue/PR · nhánh).
> Nguồn đếm: cây làm việc tại `df053f7e` + `gh api`. Mọi con số dưới đây
> đều dán được bằng một lệnh; không dòng nào dựa trí nhớ.

## Kết luận trước

Tài liệu **không mục nát đều** — nó **tách làm hai lớp trôi ngược nhau**:

- **Mặt máy đọc vẫn tươi.** `CLAUDE.md` (03/09), `CONTEXT.md` (48 term, có đủ
  «Tên bốn cổng», «Máy đã thông», «Đường đo»), `PRODUCT-MAP.md` (04/09,
  máy sinh), `SKILL.md`, ADR (12 bản, có dấu SUPERSEDED tử tế).
- **Mặt người đọc đóng băng ở 23/08.** `README.md`, `QUICKSTART.md` — kể từ
  lần chạm cuối đã có **101 commit hành vi** và **5 mốc phát hành**
  (2.4.0 → 2.8.0). `GUIDE.md` được cập nhật *dòng phiên bản* mỗi mốc nhưng
  **§0–§4 vẫn dạy mô hình cũ**.

Hệ quả là một sự đảo ngược đúng chỗ North Star đau nhất: **bề mặt đọc-trong-
một-phút lại là bề mặt sai nhất.** Người ở biên đọc README/QUICKSTART/GUIDE §0
sẽ dựng trong đầu một cỗ máy mà kit không còn là.

Bằng chứng gọn nhất: mô hình **bốn cổng người** — khung tổ chức hiện hành, in
ngay đầu `PRODUCT-MAP.md` và định nghĩa trong `CONTEXT.md` — xuất hiện **0 lần**
ở README, **0 lần** ở QUICKSTART.

| Term | README | QUICKSTART | GUIDE | CONTEXT |
|---|---|---|---|---|
| Cổng Đáng | 0 | 0 | **0** | 2 |
| Cổng Phạm vi | 0 | 0 | 1 | 1 |
| Cổng Bằng chứng | 0 | 0 | 1 | 3 |
| Cổng Giá trị | 1 | 1 | 2 | 5 |
| làn V | **0** | **0** | 1 | 1 |
| Gate 1.5 | 0 | 0 | 2 | 1 |
| `/goal` | 0 | 0 | 11 | 0 |

## Bảng 1 — mặt tài liệu × độ tươi × người hưởng

| Mặt | Chạm cuối | Tình trạng | Người hưởng cụ thể |
|---|---|---|---|
| `CLAUDE.md` 14.8 KB | 03/09 | **Tươi** — là hiến pháp đang chạy | Máy (mọi phiên) |
| `CONTEXT.md` 20 KB | 23/08 | **Tươi về khái niệm**, 48 term có cả term mới nhất | Máy lúc soạn chữ |
| `PRODUCT-MAP.md` 21 KB | 04/09 | Máy sinh — nhưng **2 bản ghi kẹt** (dưới) | Owner |
| `GUIDE.md` 77 KB | 03/09 | **Phân tầng**: header + §5/§7 tươi · §0–§4 mô hình cũ | Đội tiêu thụ |
| `QUICKSTART.md` 14 KB | 23/08 | Cài đặt/CI **chính xác** · mô hình cổng **sai** | Đội tiêu thụ (VI) |
| `README.md` 21 KB | 23/08 | **Trôi nhất** · tiếng Anh · người hưởng chưa định danh | ? |
| `feature-loop/README.md` | 22/08 | Khai «đúng 2 điểm dừng human» — sai từ 2.0.0 | Đội tiêu thụ |
| `docs/` 240 file | 04/09 | Kho quyết định, sống; **134 file không đường link tới** | Owner + máy |
| `.github/` | 15/08 | Chỉ có `gate.yml`. Không template, không CODEOWNERS | — |

## Bảng 2 — sai lệch NỘI DUNG (không phải chính tả)

| # | Chỗ | Đang nói | Sự thật đang chạy | Biên lai |
|---|---|---|---|---|
| N1 | `README.md:4` | *«puts the human at two high-leverage decision points»* | Sai **hai chiều cùng lúc**: thiếu Cổng Đáng + Cổng Giá trị (bốn cổng), mà lại thừa với T2 xanh-sạch (làn V đi tiếp, không ký) | `PRODUCT-MAP.md:20` · `CONTEXT.md` «Tên bốn cổng» · `feature-loop/SKILL.md:10` |
| N2 | `QUICKSTART.md:8-14` | *«bạn chỉ làm 2 việc»* + sơ đồ CỔNG 1 → CỔNG 2 | Cùng lớp N1. Người mới được dạy phải ký mọi vòng T2 | như trên |
| N3 | `GUIDE.md:51` (bảng Mục tiêu §0) | *«Đúng **2 điểm dừng người** (T3: +1)»* | Luật hiện hành: **mục tiêu ≤3 lượt/vòng · T3 trần 4 · mốc phát hành ≤1** | `CLAUDE.md` luật (c) |
| N4 | `GUIDE.md:178` | Tự thú: *«khối mermaid chờ một PR chữ riêng»* | Nợ **đã khai** từ 2.0.0 (12/08), qua **7 mốc phát hành** chưa trả. Sơ đồ §3 vẫn vẽ Cổng 2 luôn ký | `GUIDE.md:178` |
| N5 | `GUIDE.md` §3 bảng `status` | 6 trạng thái, dừng ở `signed-off` | Thiếu trạng thái **«máy đã thông»** của làn V; thiếu `opportunity.md` và Cổng Đáng khỏi vòng đời | `CONTEXT.md` «Máy đã thông» |
| N6 | `GUIDE.md` mục lục §4.5–§4.11 | Đánh số theo phiên bản 1.11.0 → 1.18.0 | Kit ở 2.8.0. Mục lục là **nhật ký bồi đắp**, không phải cấu trúc tra cứu | `plugin.json` version |
| N7 | `feature-loop/README.md:3` + `SKILL.md` description | *«đúng 2 điểm dừng human»* | `SKILL.md:10` ngay bên dưới mô tả **đúng** làn V — một file, hai lời | `feature-loop/skills/feature-loop/SKILL.md` |
| N8 | `README.md` §Known limitations | Tiêu đề **«(v1)»** | Đang ở 2.8.0 | — |

**Điểm chung của N1–N7: không phải quên cập nhật, mà là _bản sao khái niệm_.**
Kit đã áp luật một-nguồn ở tầng **lệnh** rất tốt — README và QUICKSTART cố ý
không chép lệnh cài, cả hai trỏ về GUIDE §5.1 («bản sao thứ hai là bản sao sẽ
trôi»). Nhưng **mô hình cổng thì được chép ba lần** (README EN · QUICKSTART VI ·
GUIDE §0/§3) và **đã trôi ra ba hướng khác nhau**. Đúng lớp lỗi mà chính luật
đó sinh ra để chặn, chỉ khác tầng.

## Bảng 3 — lỗi cơ học (rẻ, máy tự sửa được)

| # | Chỗ | Lỗi | Cách kiểm lại |
|---|---|---|---|
| C1 | `GUIDE.md:1067` | Một gạch đầu dòng bị nuốt vào ô bảng → GitHub render thành cột thứ 4, dòng thụt sau đó mất | quét bảng: header 3 cột, dòng 4 cột |
| C2 | `README.md:38–41` | Câu gãy giữa chừng: *«With the Gate-2 signature is a DECISION…»* — dấu vết sửa dở | đọc |
| C3 | 3 file `docs/superpowers/specs/2026-08-05-*` | Link chết tới `../plans/2026-08-05-nang-cap-8020-graph-loop.md` (file nằm ở `docs/plans/`, không phải `docs/superpowers/plans/`) | 3/280 link tương đối hỏng |
| C4 | `README.md:221` · `_acceptance/config.yaml:11` | *«23 file SKILL.md/command là hành vi thật»* — thực tế 13 (SKILL+command) hoặc 42 (kèm references), không có cách đếm nào ra 23 | `find` |
| ~~C5~~ | ~~`GUIDE.md` mục lục~~ | **DƯƠNG TÍNH GIẢ — rút.** Anchor đúng; bộ slug hoá của chính script audit sai (nó nuốt `_` và gộp `—` thành một gạch, GitHub thì giữ `_` và để lại hai gạch). Đúng lớp «thước sai chứ vật không sai» — ghi lại để bộ đo lần sau không lặp | chạy lại bằng luật slug của GitHub → 0 anchor lệch |

C4 là ví dụ nhỏ của đúng lớp **«thước không gắn vào vật»**: một con số viết tay
trong văn xuôi, không phép đếm nào giữ nó, nên nó rời sự thật lúc nào không hay
— và nó **đã được chép sang file thứ hai** (`config.yaml`).

## Bảng 4 — mặt repo trên GitHub (ngoài file .md)

| # | Sự việc | Số | Vì sao đáng nói |
|---|---|---|---|
| G1 | Repo **PUBLIC**, `license: null`, không file `LICENSE` | `gh api` → `"visibility":"public"`, `"license":null` | `plugin.json` khai `"license": "Proprietary"`. Public + không license = mọi người **thấy được nhưng không được dùng**. Hai lời khai mâu thuẫn nhau ở nơi ai cũng đọc |
| G2 | `QUICKSTART.md:35` bảo đồng đội *«Cần quyền đọc repo… hỏi Mạnh nếu chưa có»* | repo public từ lâu | Chỉ dẫn sai cho đúng người nó phục vụ |
| G3 | **0 GitHub Release**, 1 tag (`truoc-luu-kho-2026-08`) | `gh release list` rỗng | 9 mốc 2.x đã ký, không mốc nào có ghi chú phát hành người đọc được trên GitHub |
| G4 | Không có `CHANGELOG.md`… nhưng `config.yaml` đã **giữ chỗ** cho nó trong `t1_skip_globs` | — | Nhật ký thay đổi thực tế sống trong **trường `description` của `plugin.json`: 31.384 ký tự** — một chuỗi JSON, hiển thị trong trình liệt kê plugin |
| G5 | 40 nhánh remote — **32 đã merge chưa xoá** | `git merge-base --is-ancestor` | Nhiễu |
| G6 | 8 nhánh chưa merge, **2 là việc TÀI LIỆU bỏ dở**: `docs/finding-chu-ky-va-dong-ho-so-trung` (14/08), `docs/hat-giong-hinh-ho-so` (16/08) | — | Công đã bỏ ra, chưa chạm ai |
| G7 | PR #102 mở 13 ngày · issue #32 mở 29 ngày | `gh pr/issue list` | Đúng ô «Dọn tồn kho PR» đang nằm ở *Đang cân nhắc* của bản đồ |
| G8 | `PRODUCT-MAP.md` khai **«Đang làm: release-2-0-0, release-2-1-0»** | 2 contract kẹt `status: verified` | Bản đồ máy sinh **đúng luật mà sai sự thật**: hai mốc đã phát hành từ 12–16/08 vẫn hiện là việc đang chạy. Bản đồ là trang owner đọc đầu tiên |

## Chẩn đoán lớp

Ba lớp, xếp theo độ sâu:

1. **Không có neo ngoài cho việc-tài-liệu.** Luật «giá trị chỉ chạm người dùng ở
   BẢN PHÁT HÀNH» đang làm việc *đúng như thiết kế* — nó đẩy mọi giờ-kit về
   phía engine. Tài liệu không nằm trong định nghĩa-xong của bất kỳ vòng nào,
   nên nó là thứ **duy nhất trong repo không có ai đòi**. 101 commit hành vi
   qua đi mà không một răng nào đỏ.
2. **Bản sao khái niệm không có marker.** Luật một-nguồn đã được áp ở tầng
   *lệnh* (README/QUICKSTART trỏ GUIDE §5.1) nhưng chưa ở tầng *mô hình*.
   Không có chỗ nào để writer và reader cùng rút ra — nên ba bản trôi tự do.
3. **Người hưởng của README chưa từng được định danh.** Đây là file trôi nhất,
   viết bằng ngôn ngữ không phải ngôn ngữ đội, cho một công chúng có 0 sao,
   0 fork và không có license để dùng kit. Theo phép thử ba-nguyên-tố của
   CLAUDE.md: **trace được về nguyên tố nào? người hưởng cụ thể là ai?**

## Đề xuất — bốn nhát, phân loại theo NGUỒN CĂN CỨ

Phân loại theo luật lời-mời 01/09: căn cứ là mục-tiêu+quy-tắc đã khai → máy đi
tiếp; căn cứ chỉ người có → câu hỏi thật.

### Nhát 1 — GỘP mô hình cổng về MỘT nguồn có marker · *máy đi tiếp*

> ⚠️ **Đọc kèm mục (i) bên dưới.** Quyết định B (05/09) làm nếp *con-trỏ*
> dưới đây KHÔNG dùng được — một-nguồn phải đổi sang nếp *bản-chép-có-răng*.

Không phải «cập nhật ba file». Là **cắt ba bản sao xuống một**:
`GUIDE.md` giữ khối `<<<GATE-MODEL … >>>` (cùng nếp marker đã dùng cho
`GUIDE-CLASSIFIER-LANE`, `GOAL-TEMPLATE`); README và QUICKSTART **trỏ về**, y
như đã làm với lệnh cài. Sửa N1–N8 một lượt tại nguồn duy nhất đó, kèm bảng
`status` có «máy đã thông» và vòng đời có Cổng Đáng. Trả luôn nợ N4 (mermaid
§3) — đã khai 7 mốc.
*Căn cứ: luật một-nguồn của CLAUDE.md + North Star. T1 (`docs/**`,
`README.md`, `GUIDE.md`, `QUICKSTART.md` đều trong `t1_skip_globs`) → không tốn
vòng nghiệm thu. Đảo rẻ: một `git revert`.*

### Nhát 2 — sửa cơ học C1–C5 + dọn G5/G8 · *máy đi tiếp*

C1–C5 là sửa một dòng. G8 là đóng hai bản ghi kẹt (`release-2-0-0`,
`release-2-1-0`) để bản đồ nói đúng. G5 xoá 32 nhánh đã merge.
*Căn cứ: quy tắc đã khai. Đảo rẻ.*

### Nhát 3 — nhật ký phát hành có neo ngoài · *đối kháng máy, rồi báo một dòng*

31.384 ký tự changelog trong một trường JSON là chỗ **không ai đọc được**. Hai
lối, không phải một: (a) `CHANGELOG.md` — chỗ mà `config.yaml` **đã giữ sẵn**,
`plugin.json.description` rút về 2–3 câu; (b) GitHub Release mỗi mốc, sinh từ
hồ sơ `_acceptance/release-*`. ~~Cả hai đều là CỘNG~~ — **quyết định B (05/09) lật chỗ này**: người hưởng đã
định danh (lập trình viên ngoài đội đọc trình liệt kê plugin), nên di dời
31.384 ký tự khỏi trường `description` là **TRỪ**, không phải CỘNG. Xem mục (ii).

### Nhát 4 — CÂU HỎI THẬT (chỉ người biết) · **ĐÃ QUYẾT 05/09: lối B — MỞ THẬT**

Đây là mục duy nhất máy không dựng được căn cứ: **đánh-đổi giá trị** và
**khó-đảo một chiều**.

> **Repo `phanlemanh/acceptance-gate-kit` đang PUBLIC, không LICENSE, trong khi
> `plugin.json` khai `Proprietary` — và README tiếng Anh, file trôi nhất trong
> kho, là file duy nhất viết cho công chúng đó.**

| Lối | Nghĩa là | Kéo theo |
|---|---|---|
| A. Đóng lại | Chuyển private, TRỪ README, QUICKSTART (VI) làm cửa trước | Khớp `Proprietary`, cắt file trôi nhất |
| **B. Mở thật** ✅ | Giữ public, **thêm `LICENSE` mở**, README là cửa cho người ngoài, **chấp nhận nuôi bản tiếng Anh lâu dài** | README **trace được** — người hưởng cụ thể: lập trình viên ngoài đội cài kit từ marketplace. Đổi lại: thêm một mặt phải giữ đồng bộ |
| C. Public thôi giả vờ | Giữ public, LICENSE "all rights reserved", TRỪ README | Rẻ nhất, công chúng chỉ để XEM |

**Owner quyết 05/09: B.** Từ đây README **có** người hưởng định danh được, nên
nó thôi là ứng viên cắt — và đề xuất phải đổi theo đúng hai chỗ dưới.

## Lối B đổi gì so với đề xuất ban đầu

### (i) Nhát 1 đổi hình: một-nguồn KHÔNG còn là «trỏ về GUIDE»

Mẹo đã dùng cho lệnh cài — README/QUICKSTART **trỏ** về GUIDE §5.1 — **không
dùng lại được ở đây**, vì lối B khai README là cửa cho người **không đọc được
tiếng Việt**. Bắt họ nhảy sang một tài liệu tiếng Việt để biết kit có mấy cổng
là hỏng đúng cái vừa quyết giữ.

Nên một-nguồn ở đây phải là **hình dạng thứ hai** — đúng nếp `GOAL-TEMPLATE`
(ba bản chép, giữ khớp bằng răng P85, mỗi chiều đỏ nêu tên bản lệch), chứ không
phải nếp con-trỏ:

- **Một khối nguồn có marker** `<<<GATE-MODEL … >>>` giữ *danh sách cổng + điều
  kiện làn V + trạng thái hồ sơ* dưới dạng **máy-đọc** (tên cổng · id · điều
  kiện đi tiếp), một chỗ duy nhất.
- README (EN) và QUICKSTART/GUIDE (VI) mỗi bên **render** khối đó bằng ngôn ngữ
  của mình; nhãn hai thứ tiếng lấy từ bảng «Tên bốn cổng» **đã có sẵn** trong
  `CONTEXT.md`.
- **Răng**: một ca so *tập cổng và điều kiện* rút từ mỗi bản mặt người với bản
  nguồn — lệch là đỏ, kèm chiều đỏ nêu tên bản lệch. Đây là chỗ biến bất biến
  từ **đầu-người** (nhớ sửa cả ba) sang **vật-máy-giữ**, đúng dạng nghiệm mà
  CLAUDE.md đòi. Không có răng thì lối B chỉ là cam kết bằng lời — và bảng 1
  của chính hồ sơ này là bằng chứng lời không giữ được 101 commit.

### (ii) Chỗ cắt gọi tên cho cửa sổ kế — đổi mục tiêu

Đề xuất ban đầu gọi tên **README** làm nhát cắt. Lối B **rút nhát đó** (README
nay có người hưởng). Nhát cắt thay thế, cùng thoả luật (c):

> **`plugin.json.description` — 31.384 ký tự.** Nó vừa là *bản sao thứ hai*
> không ai giữ đồng bộ, vừa là *nhật ký đặt sai chỗ*, vừa là **thứ đập vào mắt
> đúng người mà lối B vừa quyết phục vụ** (trình liệt kê plugin của Claude Code
> in trường này). Rút về 2–3 câu, phần còn lại về `CHANGELOG.md` — chỗ
> `config.yaml` **đã giữ sẵn** trong `t1_skip_globs`. Trừ ~31 KB khỏi diện
> bảo trì, và Nhát 3 thôi là CỘNG: nó thành DI DỜI.

### (iii) Còn đúng MỘT mục chỉ-người-biết trong lối B

**Chọn giấy phép nào.** Khó-đảo một chiều (code đã phát hành dưới một giấy phép
thì không thu về được), và căn cứ là khẩu vị quyền — máy không có.

| Lối | Khi nào chọn |
|---|---|
| **MIT** *(khuyến nghị)* | Đơn giản nhất, tiền lệ ngay trong kho: `vendor/impeccable` và `diagram-design` **đã** là MIT — kit sẽ nhất quán với thứ nó vendor |
| Apache-2.0 | Nếu muốn thêm điều khoản cấp bằng sáng chế tường minh |

Kéo theo bắt buộc dù chọn gì: `plugin.json.license` phải đổi khỏi
`"Proprietary"` trong **cùng** PR — hai lời khai mâu thuẫn ở nơi ai cũng đọc là
đúng thứ audit này đi bắt.

## Đã chạy 05/09 — kết quả thật

Nhánh `docs/audit-05-09-mo-that`. **6/6 suite xanh · `pre-merge-check: clean`.**

| Nhát | Trạng thái | Vật |
|---|---|---|
| 1. Gộp mô hình cổng về MỘT nguồn **có răng** | ✅ | GUIDE §0 giữ khối `<<<GATE-MODEL` (tsv máy đọc) + `<<<GATE-MODEL-VI`; QUICKSTART chép bản VI **byte-equal**; README chép bản EN. Răng **P86** trong `tests/plugins`: 5 chiều đỏ, mỗi chiều gọi tên đúng bản lệch |
| 1b. Trả nợ N4 (mermaid §3, khai từ 2.0.0) | ✅ | Sơ đồ §3 và §0 nay vẽ nhánh **làn V**; bảng `status` có `machine-cleared`; gỡ dòng tự thú «chờ một PR chữ riêng» |
| 1c. N1·N2·N3·N5·N7·N8 | ✅ | README opener · QUICKSTART opener · bảng Mục tiêu §0 (nay là ngân sách ≤3/4/1) · §1 «2 điểm dừng» · `feature-loop/README.md` · tiêu đề «(v1)» |
| 2. Lỗi cơ học | ✅ C1 (bảng vỡ GUIDE), C2 (câu gãy README), C3 (3 link chết) · C4 (số 23 → phát biểu không cần đếm, sửa **cả hai** bản chép) · C5 rút | link tương đối hỏng: 3 → **0** |
| 2b. Dọn nhánh remote | ✅ | 40 → **8** nhánh (xoá 32 nhánh đã merge; 8 nhánh chưa merge giữ nguyên) |
| 4. `LICENSE` MIT + `plugin.json.license` | ✅ | MIT ở gốc + mục THIRD-PARTY nêu rõ `vendor/impeccable` (Apache-2.0) và `diagram-design` (MIT, Cathryn Lavery) giữ giấy phép riêng; hai manifest `Proprietary` → `MIT` |
| 5. `QUICKSTART.md:35` | ✅ | Thôi bảo đồng đội xin quyền đọc một repo public |

### Hai nhát KHÔNG chạy — và vì sao

**G8 — hai bản ghi kẹt (`release-2-0-0`, `release-2-1-0`).** Đo được: cả hai
**thoả sáu điều kiện xanh-sạch** (verdict PASS · 0 UNCERTAIN · Known limits và
Ngoài hợp đồng đều hiện-diện-và-rỗng · hạng T2), tức chúng **đã đi trọn làn V**
— đúng như hợp đồng `release-2-1-0` tự đặt ra («phải đi trọn làn V qua biên
merge với 0 lượt gọi owner»). Chúng kẹt vì **tên trạng thái `machine-cleared`
ra đời SAU chúng**: hai hồ sơ đi đúng làn nhưng chưa có chữ để ghi.

Máy **không tự sửa** `status` trong hai hồ sơ này. Lý do không phải e ngại:
sửa `status` là **thao tác cổng**, mà mọi thao tác cổng bị khoá
model-invocation (ADR 0002) — và ở đây máy đang chạy qua Bash, tức đi vòng
đúng cái lỗ hook mà kit sinh ra để bịt («hook chỉ thấy edit của agent»). Dùng
lỗ đó để đổi một hồ sơ cổng là chính xác thứ audit này đi bắt. Việc còn lại là
**một lượt gõ của owner**, hai lệnh:

```
/acceptance-gate:signoff release-2-0-0
/acceptance-gate:signoff release-2-1-0
```

**Nhát 3 — di dời changelog.** Chạy dở thì phát hiện tiền đề của chính đề xuất
sai: `plugin.json.description` **không phải bãi rác**, nó là **sổ ghi chú phát
hành mà CI đang ghim** — ít nhất ba ca: **P88** (bắt buộc chứa 4 + 6 từ khoá
hành vi), **P133** (bắt thứ tự `v1.29:` < `v1.30:` < `/start session-entry` để
attribution không trôi), **P200** (bắt mô tả phải có mục `v<VERSION>` hiện
hành, và mục đó của feature-loop phải tự khai `acceptance-gate >= <VERSION>`).
Nó phình tới 31.384 ký tự **vì có răng giữ**, không vì buông.

Nên «rút mô tả về 2–3 câu» **không phải việc tài liệu** — nó là dời neo của ba
bộ răng sang một vật khác, tức một vòng T2 có hồ sơ. Ghi vào bản đồ như một ô
cơ hội, không nhét vào PR này. Nhận định đã sửa: chỗ cần cắt **không phải độ
dài mô tả**, mà là **thiếu một mặt người-đọc-được** cho cùng nội dung đó — và
lối rẻ đúng luật một-nguồn là `CHANGELOG.md` **sinh ra từ** mô tả kèm răng so
khớp, không phải bản chép thứ hai viết tay.

### Chỗ cắt gọi tên cho cửa sổ kế

Lối B rút README khỏi diện cắt (nó có người hưởng rồi). Nhát cắt thay thế —
**`plugin.json.description`**, theo đúng phân tích trên: không cắt độ dài, mà
**cắt vai trò kép** của nó (vừa là mô tả plugin vừa là changelog vừa là mốc neo
của ba bộ răng). Một vật ba vai là một vật sẽ trôi.

## Đuôi 05/09 — hai thứ chỉ lộ ra khi kiểm bằng máy, không bằng mắt

**(1) `LICENSE` viết xong mà GitHub không thấy.** Sau khi merge #144, phép đo
thật không nằm trong cây mà ở phía GitHub:

```
gh api repos/phanlemanh/acceptance-gate-kit --jq .license.spdx_id
→ NOASSERTION
```

Bộ dò của GitHub chỉ nhận `LICENSE` khớp gần-nguyên-văn một giấy phép đã biết;
mục THIRD-PARTY nối thêm sau dấu `---` làm nó bỏ nhận diện. Tức công bố quan
trọng NHẤT của lối B — «repo này dùng được» — **không hiện ở đúng chỗ người
ngoài đọc**. Răng ship rồi mà hiệu lực 0: đúng lớp lỗi kit tồn tại để chặn, lần
này ở mặt-người của chính kit. Sửa ở #145: `LICENSE` thuần MIT, phần vendor
sang `NOTICE` ở gốc (cùng nếp `vendor/impeccable/NOTICE`), README thêm mục
Licence — lối B khai README là cửa cho người ngoài mà cửa đó chưa hề nói tới
giấy phép.

Bài học đúng dạng của repo này: **phép đo phải nằm ở nơi lời hứa được tiêu
thụ.** «Có file LICENSE» là đo cây; thứ đáng đo là `spdx_id` mà bên kia đọc ra.

**(2) #144 lọt cổng bằng đúng lỗ đã khai.** #144 chạm `LICENSE`,
`.claude-plugin/plugin.json`, `feature-loop/.claude-plugin/plugin.json` — **không
file nào trong `t1_skip_globs`** — nên lẽ ra răng T1-escape phải đòi hồ sơ. Nó
không đòi, vì cùng PR có sửa một dòng chú thích trong `_acceptance/config.yaml`,
và backstop tính «có kèm artifact» là *bất kỳ* thay đổi nào dưới `_acceptance/`.
Đó chính là giới hạn README đã khai từ đầu: **backstop không có ánh xạ
path→slug**.

Khai thẳng: đây không phải suy đoán mà là **vấp thật, do chính đợt này gây ra**
— và nó chỉ lộ khi #145 (chạm `LICENSE` + `NOTICE`, không chạm `_acceptance/`)
bị chặn đúng như thiết kế. Một PR bị chặn đã chứng minh răng còn sống; PR trước
đó qua được đã chứng minh lỗ còn đó. Cả hai là cùng một phép đo.

Cách xử ở #145 theo đúng hai lối mà chính thông điệp lỗi đưa ra: **khai T1 cho
đúng thứ là T1**. `LICENSE`/`NOTICE` là văn xuôi pháp lý, không code path nào
đọc — liệt **đích danh** (không glob, vì `NOTICE*` sẽ nuốt NOTICE của cây vendor
mà tree-hash trong đó LÀ răng P196), kèm điều kiện thu hồi. QUYẾT ĐỊNH cấp phép
thì ngược lại — khó-đảo, và nó đã qua cổng người rồi (ADR 0013); hai file chỉ là
bản chiếu.

**Còn nợ, ghi vào ô cơ hội:** hai manifest `plugin.json` trong #144 vẫn là
non-T1 đi qua backstop nhờ lỗ trên. Ô «neo backstop vào ánh xạ path→slug» đã
nằm trong known-limits của README từ v1; đợt này thêm một biên lai cho nó.
