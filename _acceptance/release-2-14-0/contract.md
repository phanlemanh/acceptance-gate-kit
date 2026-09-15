---
schema_version: 1
feature: Phát hành kit 2.14.0 — cắt số cho hai gói kit và định đoạt công khai chiến dịch ghim lại đang hoãn mốc thứ hai. Hạ về draft 15/09 chờ PR #176 merge, dựng lại bốn khối sự thật từ cây sau merge, trình lại Cổng Phạm vi.
slug: release-2-14-0
owner: phanlemanh@gmail.com
risk_tier: T2               # chạm hai manifest + GUIDE; KHÔNG chạm t3_paths (hooks, lib, pre-merge-check.sh, recheck-evidence.cjs)
surfaces: [cli]
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-15T09:37:00Z
---

# Acceptance Contract: release-2-14-0

## Context

Cửa sổ 2.13 → 2.14 có **HAI vòng meta đã ký**, không phải một — luật (b) cho tối đa MỘT, nên
con số này là điều mốc phải khai chứ không được làm tròn:

| vòng | hạng | ký | nội dung |
|---|---|---|---|
| `do-tin-tram-phan-loai` | T2 | 15/09 `c47ae5f8` | độ tin trạm phân loại phạm vi — mã máy đúc, một lượt hỏi lại |
| `chu-ky-khong-tu-lam-hoa-cu` | T2 | 15/09 `76879ac4` | chữ ký thôi tự làm bằng chứng hoá cũ; làn trước chữ ký bỏ qua khi cây bằng pin (ADR 0019) |

Hai vòng chạy **song song ở hai phiên khác nhau** trên cùng kho; vòng thứ hai vào `main` qua
PR #176 lúc 08:30Z. Thêm một vòng thứ ba được mở rồi owner đóng cùng ngày
(`mot-nguon-tai-gui-triage`, park, đề bài ở hạt giống), và một hồ sơ draft chờ cửa sổ sau
(`bo-qua-phai-thay-dinh-nghia-phep-do`).

Cửa sổ cũng đổi luật hai lần trong một ngày: ADR 0017 → **ADR 0018** (vế «có thể CỘNG» giữ
nguyên nhưng CỘNG phải owner phê từng ca; đoạn luật trong `CLAUDE.md` từ 29 dòng xuống 15), và
**ADR 0019** đến từ vòng thứ hai.

**Bốn tệp engine đổi, ở CẢ HAI gói kit** (+172 / −36 kể từ mốc `ea26fdfe`):

| tệp | gói |
|---|---|
| `feature-loop/workflows/acceptance-verify.js` | feature-loop |
| `feature-loop/scripts/repin-lane.mjs` | feature-loop |
| `commands/signoff.md` | acceptance-gate |
| `skills/acceptance/SKILL.md` | acceptance-gate |

Hai gói cùng lên một số — vừa vì bất biến ca P200 canh (**số đặt tên cho bản phát hành của
KIT, không cho từng gói**), vừa vì lần này cả hai đều đổi thật. `diagram-design` là ngoại lệ
đã khai, giữ 2.7.0 có răng riêng.

**Hồ sơ này từng được duyệt ở một cây CHƯA có PR #176, rồi owner hạ về draft cùng ngày** khi
phát hiện phiên kia đang giữ PR ấy. Bốn khối sự thật đã dựng lại từ cây sau merge; sổ quyết
định giữ nguyên cả dấu seal cũ lẫn entry hạ-draft, kèm bài học: lần ấy máy khai «cửa sổ đổi
đúng MỘT tệp engine» sau khi chỉ nhìn `main`, không soi PR đang mở của phiên khác trong cùng
kho.

## Criteria

### AC-1 (cắt số) — MỘT số, nhất quán ở mọi bề mặt người dùng đọc

**Given** cây tại HEAD của hồ sơ mốc
**When** chạy `rang-p200.sh` của hồ sơ này (bọc ca thường trực `P200`)
**Then** hai plugin `acceptance-gate` và `feature-loop` cùng mang MỘT số; số hợp semver;
`GUIDE.md` dẫn xuất số ĐÓ từ manifest chứ không gõ tay; mục mô tả của số đó nói người dùng
nhận gì; `feature-loop` tự khai cặp `acceptance-gate >= <số đó>`. Vế giá trị — số ấy là
**2.14.0** — nằm trong chính gói được ký, owner xác nhận trên thẻ; răng canh tính NHẤT QUÁN,
không ghim con số.

**VÀ số phải TĂNG.** Chạy `rang-so-tang.sh`: số ở cây phải lớn hơn theo semver số tại lúc hồ
sơ mốc này ra đời, neo suy TỪ KHO. Không có vế này thì quên hẳn bước nâng số vẫn cho mọi eval
xanh — hai manifest nhất quán ở số CŨ, GUIDE dẫn xuất đúng số cũ, cặp phụ thuộc khớp — và một
bản «phát hành 2.14.0» ra cửa mang số 2.13.0. Phản biện context sạch gọi tên lỗ này; bản đầu
của chính răng ấy cũng xanh oan vì neo sai (so với «lần cắt gần nhất» thay vì với hồ sơ), đã
sửa và có chiều đỏ.

### AC-2 (gói không đổi thì GIỮ số) — diagram-design ở 2.7.0, chứng bằng cửa sổ diff

**Given** cây tại HEAD
**When** chạy `rang-moc.sh --chan diagram`
**Then** `diagram-design/` không đổi một dòng nào kể từ lần cắt số gần nhất, và số đọc được
tại HEAD là 2.7.0. Đối chứng dương trong cùng lượt: cửa sổ `mốc..HEAD` KHÔNG rỗng và bộ lọc
`diagram-design/` còn khớp vật — nếu không thì «không đổi» chỉ nghĩa là phép đo chưa chạy.

### AC-3 (hồi quy) — bốn suite và bản đồ sản phẩm

**Given** cây tại HEAD
**When** chạy bốn suite của kho cùng `product-map --check`
**Then** cả năm lệnh exit 0. Cửa sổ này chạm engine chấm điểm, nên hồi quy là chỗ dựa duy
nhất cho câu «không làm trôi cái gì».

### AC-4 (judgment) — bốn khối Notes đủ mặt, năm dòng số có nguồn rút

**Given** khối `## Notes` của hợp đồng này
**When** hội đồng đọc nó cùng BA nguồn: `usage-report.md` của vòng `do-tin-tram-phan-loai` ·
`evidence-report.md` **và** `usage-report.md` của vòng `chu-ky-khong-tu-lam-hoa-cu`
**Then** đủ bốn khối bắt buộc (năm dòng số · lớp vendored · lớp lỗi tái phát · nhát cắt cho
cửa sổ kế); bảng năm dòng đủ HAI CỘT cho hai vòng; mỗi ô có nguồn rút gọi tên; dòng 2 đếm
bằng ba ngăn cho cả hai vòng; và BA phép đối chiếu nhãn-với-nguồn dưới đây khớp từng chữ số.
Và khối năm dòng phải nói thẳng điều số đang nói, kể cả khi nó bất lợi: token/lượt KHÔNG giảm
so với mốc trước.

**Ba phép đối chiếu, liệt kê ĐÓNG — không phải «mọi số».** (i) hai dòng máy-đo của
`do-tin-tram-phan-loai` so `usage-report.md` của nó · (ii) số lượt chấm và lượt hạ-tầng-đốt
của `chu-ky-khong-tu-lam-hoa-cu` so `## Iterations` trong báo cáo của nó · (iii) hai số token
của vòng ấy (ô lượt PASS · tổng vòng) so `usage-report.md` của nó. Ba dòng đếm TAY (dòng 1,
2, 3) KHÔNG đối chiếu được bằng máy — chúng là việc mắt người ở Cổng Bằng chứng, và hồ sơ
nói thẳng thế thay vì hứa suông.

Vì sao liệt kê đóng: bản trước viết «MỌI số máy-đo khớp từng chữ số», trong khi E4 chỉ liệt
ba phép đối chiếu điểm — lượt chấm 2 gọi tên là «tuyên quét LỚP nhưng chỉ có điểm-case», cùng
lớp với lỗi ở răng tồn đọng mà lượt 1b đã bắt. DỪNG-VÁ nổ ở đó; owner chọn đường ĐỔI KHUÔN
15/09: lời khai phát biểu đúng phép đo, không rộng hơn.

**Mỗi số máy-đo phải có nguồn NẰM TRONG `inputs`.** Lượt chấm 1 của chính mốc này chứng vì
sao: ô lượt PASS của vòng thứ hai ghi 50.222.052 trong khi `usage-report.md` trên main cộng
ra 50.195.215 — hội đồng vẫn đề xuất PASS, vì tệp ấy KHÔNG nằm trong `inputs` nên thứ duy
nhất chấm được là LỜI GHI NGUỒN chứ không phải con số. Làn tìm-lỗi bắt, hồ sơ sửa số theo
nguồn và thêm nguồn vào `inputs`; vế này ở đây để lần sau không lặp.

### AC-5 (chiến dịch ghim lại) — con số trong hồ sơ là số lưới đang nói, không phải số chép

**Given** hồ sơ này khai một cặp số-hồ-sơ-hoá-cũ và mốc so trong khối marker
**When** chạy `rang-ton-dong.sh --chan ghim-lai`
**Then** con số ấy BẰNG con số lưới trước-merge đếm được hôm nay ở đúng mốc ấy, đo bằng
CHÍNH lưới đó chứ không bằng một phép đếm thứ hai. Chiều đỏ ghim mã: 3 hai số lệch · 4 hồ sơ
không khai đủ cặp · 2 không chạy được lưới · 5 lưới không tới kết luận. Vì sao cần răng cho
một con số: chiến dịch bị hoãn mốc thứ hai liên tiếp, và mỗi lần hoãn thì hồ sơ lại chép con
số của lần trước — số chép tay hoá cũ lặng lẽ rồi mốc sau đọc nó như sự thật.

## Coverage

Mốc phát hành là bài toán liệt-kê-đủ theo BỀ MẶT người dùng đọc số, không theo tổ hợp. Trục
lấy nguyên từ ca thường trực P200 — nó đã là bản liệt kê đã duyệt, dựng lại là tạo nguồn thứ
hai.

- **Trục bề mặt** `[thước CE: ca P200 trong tests/plugins/run-tests.sh]`: manifest gói một ·
  manifest gói hai · số dẫn xuất trong GUIDE · mục mô tả của chính số đó · cặp phụ thuộc mà
  feature-loop tự khai. → AC-1.
- **Trục gói** `[thước CE: ba manifest có thật trong kho]`: hai gói kit lên số · gói thứ ba
  giữ số. → AC-1 và AC-2.
- **Trục việc-của-mốc** `[thước CE: luật re-pin-theo-release và luật (c)]`: hồi quy · bốn
  khối Notes · chiến dịch ghim lại. → AC-3, AC-4, AC-5.

## Out of scope

- **Chạy chiến dịch ghim lại 45 hồ sơ** — hoãn mốc thứ hai liên tiếp, và hoãn CÔNG KHAI: AC-5
  bắt hồ sơ mang con số thật có răng canh, thay vì im lặng bỏ qua. Điều kiện tiên quyết
  («ghim lại theo diff», hồ sơ 2.13 §4 mục 1) vẫn chưa làm, nên chạy chiến dịch bây giờ là
  một khoản giờ máy lớn lặp lại ở mọi mốc.
- Sáu mục Known limits của `do-tin-tram-phan-loai` — ở tệp ca và chẩn đoán nội bộ, không phải
  việc của mốc.
- Nhát vá cho hạt giống `mot-nguon-tai-gui-triage` — owner đã park; mốc này KHÔNG kéo vào.
- Sáu mục còn lại của hồ sơ 2.13 §4 — chưa làm, giữ nguyên trong sổ tồn đọng.
- Dựng phép đo mới cho chính phép đo của mốc — luật (a).

## Notes

<!-- <<<TON-DONG-GHIM-LAI -->
so_stale: 45
so_stale_toan_kho: 71
moc_so: 7d12ffad
<!-- TON-DONG-GHIM-LAI>>> -->

### 1. Năm dòng số của luật (c) — HAI vòng, đếm cùng luật, đối chiếu chéo hai phiên

Cửa sổ có hai vòng đã ký, chạy song song ở hai phiên. Mỗi con số dưới đây đã được **phiên kia
kiểm lại**; hai chỗ hai phiên đếm sai đã sửa và ghi ở §3. Nguồn cho vòng
`chu-ky-khong-tu-lam-hoa-cu`: bản bàn giao `docs/plans/2026-09-15-ban-giao-cua-so-2-14.md`
cộng trao đổi trực tiếp giữa hai phiên ngày 15/09.

| Dòng | `do-tin-tram-phan-loai` | `chu-ky-khong-tu-lam-hoa-cu` | Nguồn rút |
|---|---|---|---|
| 1 làm-xong → quyết-được | **3h59** | **5h52** | ts dòng `round` đầu của `run-log.jsonl` → commit Cổng 2 (`c47ae5f8` · `76879ac4`) |
| 2 lượt gọi người/vòng | **5** — ①2 · ②1 · ③2 | **5** — ①1 · ②3 · ③1 | ba ngăn, xem bảng dưới; đếm tay hai phiên đối chiếu |
| 3 lượt chấm bị hạ-tầng-kit đốt | **0** trên 3 | **2** trên 6 — lượt 3 args thiếu `diffFiles` (phiên gọi cắt tệp args) · lượt 4 một tác tử chết | `## Iterations` + log workflow; hai lần dispatch chết ngay cổng args (0 tác tử) KHÔNG tính là lượt chấm |
| 4 token máy/lượt | **19.223.828** ở lượt PASS · vòng 3 lượt **53.974.767** (18,0 M/lượt) | **50.195.215** ở lượt PASS · vòng 6 lượt **145.925.121** (24,3 M/lượt) | `usage-report.md` của từng vòng; NỀN: ba dòng tổng per-model (out + in + cache_read + cache_create), cùng nền mốc 2.13.0. Vòng thứ hai: `_acceptance/chu-ky-khong-tu-lam-hoa-cu/usage-report.md`, lên main bằng merge commit `8c5c01ac`. Ô lượt PASS từng ghi 50.222.052 — số phiên kia báo trước khi merge; làn tìm-lỗi của lượt chấm 1 bắt lệch 26.837 so với tệp trên main, đã sửa theo NGUỒN |
| 4b ba khối của lượt PASS | tìm-lỗi **75,4 %** · chứng-minh-vật **18,9 %** · tổng hợp **5,7 %** | tìm-lỗi **19,9 %** — lượt PASS chạy `runBaseline` cùng suite đầy đủ nên khối chứng-minh-vật nuốt phần lớn; ghi nguyên số, chưa tách được | NỀN KHÁC, khai rõ: bảng vai trò (out + in + cache_read, KHÔNG có cache_create). ÁNH XẠ: `review`+`refute` → tìm-lỗi · `machine`+`baseline`+`triage`+`capture` → chứng-minh-vật · `synthesize` → tổng hợp |
| 5 phút máy/lượt chấm | **15,3** ở lượt PASS; TB **22,5** | **22,8** ở lượt PASS; TB **26,1** (157 phút / 6) | dòng `wall` từng mục |

**Cả cửa sổ: ≈ 199,9 M token cho hai vòng meta**, trong khi luật (b) cho một.

**Dòng 2 đếm bằng BA NGĂN, không hai.** Luật định nghĩa «trong thiết kế» = ba cổng người
(Đáng · Phạm vi · Bằng chứng), tập đóng. Nhưng DỪNG-VÁ và «xin vượt trần ba lượt chấm» là lượt
LUẬT ĐÒI, không phải máy tự chèn; gộp chúng với «máy báo cáo rồi ngừng nói» là xoá mất khác
biệt duy nhất đáng sửa.

| | `do-tin-tram-phan-loai` | `chu-ky-khong-tu-lam-hoa-cu` |
|---|--:|--:|
| ① cổng thiết kế | 2 — Phạm vi (duyệt thật, gap-probe 2 P0 nên không đủ làn V) · Bằng chứng | 1 — Bằng chứng; Phạm vi đi làn V, `approved_by` rỗng |
| ② luật đòi, ngoài ba cổng | 1 — DỪNG-VÁ | 3 — DỪNG-VÁ · xin vượt trần ×2 |
| ③ máy tự chèn | **2** — báo trạng thái rồi ngừng nói (owner phải gõ «chạy lượt chấm 3 đi») · in lệnh ký bọc `claude "…"` nên owner dán thành văn bản, phải gõ lại | **1** — ở S5 bày menu «mở PR hay dừng» dù luật đã định mặc định `pr` |
| tổng so trần 3 | **5** | **5** |
| mức cửa sổ, ghi riêng | 1 — owner gọi tên mở vòng meta (luật (b)); một lượt cho cả cửa sổ, không gán vào vòng nào | |

Cả hai vòng vượt trần **hai** lượt, và **mọi lượt ngăn ③ đều là lỗi hình thức của máy** — không
lượt nào là quyết định thật. Cổng Đáng bằng 0 ở cả hai vì không vòng nào có `opportunity.md`.

**Lượt gọi người ở HAI mốc liên tiếp, và điều kiện thu hồi.** Mốc 2.13.0 ghi 4 lượt so trần
3 — vượt. Mốc này: hai vòng, mỗi vòng 5 — vượt. Luật NỚI 07/09 gắn con số ấy vào một điều kiện
thu hồi tự động; **điều kiện ấy nay KHÔNG CÒN**: ADR 0018 (15/09) thay luật NỚI và bỏ hẳn cả
luật giám sát riêng lẫn điều kiện thu hồi tự động. Nói ra để hồ sơ sau không đọc thành «chưa
bao giờ chạm»: nó ĐÃ chạm theo số, và hết hiệu lực vì luật đã đổi, không phải vì số đẹp lên.

**Đọc dòng 4 cho đúng — số đang nói điều bất lợi.** Mốc 2.13.0 ghi lượt PASS của vòng nó là
16,7 M. Hai lượt PASS ở đây là **19,2 M** và **50,2 M**. So CHÉO ba vòng khác đề bài nên không
kết luận được về hiệu quả nhát cắt 2.13.0; nhưng đủ để nói chắc: **cửa sổ này không có bằng
chứng nào cho thấy chi phí một lượt chấm đã giảm.**

### 2. Lớp vendored — KHÔNG mục nào đổi trong cửa sổ

`git diff --stat <mốc 2.13.0>..HEAD -- vendor/` trả về RỖNG, đo lại trên cây sau khi PR #176
vào. Cả hai vòng của cửa sổ chạm `feature-loop/` và `skills/`+`commands/`, không chạm cây
vendor. Tree-hash trong `NOTICE` của cây vendor vì thế còn nguyên (P196 giữ).

### 3. Lớp lỗi TÁI PHÁT trong cửa sổ

**Lớp một — «assertion âm-tính-một-mình», nổ DỪNG-VÁ ở CẢ HAI vòng.** `do-tin-tram-phan-loai`:
lượt 1 một mục, lượt 2 **bốn** mục cùng lớp trên chính tiêu chí vừa vá; khuôn sai nằm ở phần
MÁY tự thêm vào hợp đồng. `chu-ky-khong-tu-lam-hoa-cu`: **bốn lượt chấm đầu đều đỏ vì THƯỚC
CỦA CHÍNH VÒNG, không vì vật** — vật xanh 7/7 eval ngay từ lượt 1, và cả ba lượt gọi người
ngăn ② của vòng ấy đều từ đó mà ra. Hai vòng độc lập, hai phiên, cùng một lớp — đây là lớp lỗi
ĐỊNH NGHĨA cửa sổ này.

**Lớp hai — «routing-baseline đỏ vì hồ sơ mới ký», ba lần đếm rồi ĐƯỢC CHỮA trong cùng cửa
sổ.** Ba chữ ký liên tiếp (14/09 · 15/09 · 15/09), mỗi lần eval xanh trọn, đỏ từ hạ tầng, đốt
một làn 12 phút ngay trước chữ ký. Vòng `chu-ky-khong-tu-lam-hoa-cu` chữa (ADR 0019: bản ghi
định tuyến thành vật T1 máy sinh) — mục này rời §4.

**Lớp ba — GIÁ CỦA VIỆC MẤT PHÂN LOẠI, đo được bằng token lần đầu.** Lượt chấm 3 của
`chu-ky-khong-tu-lam-hoa-cu` hỏng ở trạm phân loại (args thiếu `diffFiles`) và rơi về đường cũ
«bác bỏ TẤT CẢ», 19/19 phát hiện: **37 tác tử · 32,7 M token**, so với 20–23 tác tử · 13–17 M
ở mọi lượt lành của cùng vòng — gần gấp đôi. Lượt ấy chạy tại `17009471`, **TRƯỚC** nhát cắt
của `do-tin-tram-phan-loai` (bản workflow tại đó có 0 dấu vết mã máy đúc; `origin/main` có 10).
Hồ sơ 2.13 §4 mục 2 mô tả lớp này bằng lời («5 tác tử lên 10 rồi 15»); đây là lần đầu có số.
**Giới hạn phải ghi kèm, do chính phiên kia đặt:** con số đo giá của việc *mất* phân loại, KHÔNG
đo giá của một trạm phân loại; và hai lượt khác nhau cả args lẫn bản workflow nên không đọc như
phép so có kiểm soát — chiều thuận với nhát cắt, không phải bằng chứng cho nó.

**Lớp bốn — cả hai vòng đếm SAI cổng thiết kế của chính mình, cùng một kiểu.** Phiên này ghi
«3 trong thiết kế» (thật 2), phiên kia ghi «3» (thật 1): cả hai lấy «ba cổng» làm mặc định thay
vì đếm cổng nào THẬT tiêu một lượt — Cổng Đáng vắng khi không có `opportunity.md`, Cổng Phạm vi
bằng 0 khi đi làn V. Chỉ lộ ra vì hai phiên đối chiếu. Không đối chiếu thì cả hai đã ghi số đẹp
hơn thực vào hồ sơ mốc — đúng bệnh «đo hình thức» luật (c) sinh ra để chặn. Phép đếm máy-kiểm
đi vào §4.

**Lớp năm — lệnh cổng in sai khuôn, lần thứ BA trong phiên.** Máy in dòng lệnh ký bọc
`claude "…"` trong fence bash; owner dán y nguyên thì nó tới như văn bản, phải gõ lại. Hai lần ở
mốc 2.13, một lần ở vòng này. Mỗi lần một lượt ngăn ③.

### 4. Nhát cắt cho cửa sổ kế — gọi tên, theo thứ tự PHỤ THUỘC

1. **Đếm cổng thiết kế bằng MÁY, không bằng trí nhớ.** Cổng thiết kế = (có `opportunity.md`
   ? 1 : 0) + (`approved_by` khác rỗng ? 1 : 0) + (`human_signoff` khác rỗng ? 1 : 0). Ba
   trường đọc từ hồ sơ. Cả hai vòng của cửa sổ đếm sai cùng kiểu, chỉ lộ vì hai phiên đối chiếu.
   Đề xuất của phiên `chu-ky-khong-tu-lam-hoa-cu`; mốc này CHỈ gọi tên — dựng phép đếm là CỘNG,
   cần owner phê (ADR 0018).
2. **`wf-usage` phải chạy, hoặc phải có gì đó kêu khi nó không chạy.** Một vòng chạy sáu lượt
   chấm mà không có `usage-report.md` cho tới khi phiên kia đòi; số chỉ đầy đủ nhờ transcript
   còn. Không có phép đo nào canh việc ấy.
3. **Lệnh cổng in ra phải là dòng trần, không bọc `claude "…"`.** Ba lần đếm; mỗi lần một lượt
   gọi người chết. Sửa ở chỗ in lời mời cổng — một chỗ, không phải ba.
4. **Ghim lại theo diff.** Vẫn chưa làm; ADR 0019 đã cắt phần «chữ ký làm hoá cũ» và «làn bỏ
   qua khi cây bằng pin» nên đề bài ở hạt giống 2.13 mục 1 cần đọc lại — có thể đã nhỏ đi.
   `--skip-unchanged` (mới) KHÔNG giúp chiến dịch: nó loại trừ `--write`.
5. **Chiến dịch ghim lại.** Hai nền, khai cạnh nhau: **71** hồ sơ có pin tụt sau vật (thứ CI
   thật sự chặn, phạm vi chiến dịch) · **45** tụt trong cửa sổ `7d12ffad..HEAD` (số so-sánh-qua-mốc,
   răng AC-5 canh). Trước commit cắt số hai số là 69 và 43; chính commit cắt số (`2ce88a2b`, chạm
   hai manifest — code, không phải T1) làm hai vòng vừa ký của cửa sổ tụt pin theo:
   `do-tin-tram-phan-loai` và `chu-ky-khong-tu-lam-hoa-cu`. Răng AC-5 bắt đúng lúc: hồ sơ ghi 43,
   lưới nói 45, đỏ mã 3 — sửa số theo lưới, không sửa lưới theo số. Lượt ĐO không ghi chạy trên
   danh sách 69 (sinh trước commit cắt số) — kết quả ở khối Notes 5 dưới đây.
6. **Tải gửi trạm phân loại về MỘT nguồn** — hạt giống `docs/plans/2026-09-15-hat-giong-mot-nguon-tai-gui-triage.md`.
7. **`bo-qua-phai-thay-dinh-nghia-phep-do`** — hồ sơ draft đã ở trên main (PR #177), 3 AC · 5
   eval, chờ cửa sổ này.
8. **Lượt 5 của vòng thứ hai: 50,2 M mà tìm-lỗi 19,9 %** — manh mối: lượt duy nhất chạy
   `runBaseline` cùng suite đầy đủ trên cây đã gộp main. Chưa tách được số; việc-cần-đào, không
   kết luận.
9. **Ba mục còn lại của `release-2-12-0` §4** và các mục chưa làm của 2.13 §4.

### 5. Chiến dịch ghim lại — lượt ĐO (không ghi), và điều nó lộ ra

Mốc này chạy một lượt làn ĐO (`repin-lane.mjs`, KHÔNG `--write`) trên danh sách 69 hồ sơ
sinh bằng lưới trước-merge. Lượt bị **dừng tay ở hồ sơ thứ tư** vì nó chạy song song với
lượt chấm của chính mốc và bắt đầu làm verifier bị công cụ giết; số dưới đây là số ĐÃ ĐO,
không ngoại suy.

| | số đo |
|---|---|
| hồ sơ đã qua | **4 / 69** |
| eval máy đã chạy | **43 / 688** |
| xanh · đỏ | **25 · 18** (42 % đỏ) |
| 5 suite (chạy một lần cho cả lượt) | scripts 461 s · hooks 2 s · plugins 524 s · workflows 2 s · bản đồ 0 s |
| thời gian | ≈ 37 phút cho 4 hồ sơ, trong đó ≈ 16,5 phút là suite |

**Kết luận đắt hơn con số: chiến dịch ở dạng hiện tại KHÔNG chạy được, không phải «đắt».**
Luật làn re-pin đòi **mọi** eval của hồ sơ xanh mới được ghi dòng pin (07/09: làn chỉ chứng
suite là làn mất tiền đề). 18/43 eval đỏ ngay ở bốn hồ sơ đầu ⇒ làn dừng và **không ghi gì**.
Ba lớp nguyên nhân, đều đã gọi tên bằng vết trong log:

1. **Phép đo neo vào MỐC DI ĐỘNG.** Răng của các hồ sơ ấy dựng bản base từ `origin/main`
   *hiện tại* (`CAT-BASE: origin/main -> 87a53ff5`), rồi tìm dấu hiệu ở base làm đối chứng
   dương. Kit đổi văn bản thì dấu hiệu biến khỏi CẢ hai bên, nên răng tự khai đúng điều phải
   khai: `base=0 — needle chua bao gio ton tai, phep do khong song` (5 ca). Đây là lớp P150
   ở dạng khác: bản base không còn là bản base.
2. **Đỏ THẬT vì văn bản đã đổi sau chữ ký** — `thieu dau hieu 'một chữ'`, `thieu luat am
   'Máy không viết sẵn câu trả lời của người'`. Câu ấy đã sửa hoặc gỡ trong cửa sổ sau. Hồ sơ
   cũ đo văn bản của cây lúc nó ký; ghim lại trên cây mới là đòi cây mới nói y câu cũ.
3. **Eval trỏ CHÉO hồ sơ** — 4 eval của `cat-hinh-thuc` chạy răng nằm trong
   `_acceptance/luu-kho-codex-va-nghi-le-design/`. Một hồ sơ hỏng kéo hồ sơ khác đỏ theo, và
   làn không phân biệt được.

**Hệ quả cho quyết định hoãn.** Hồ sơ này hoãn chiến dịch với lý do «điều kiện tiên quyết
chưa làm + giờ máy lớn». Lượt ĐO đổi lý do ấy thành một điều mạnh hơn và đo được: **chạy
chiến dịch bây giờ chỉ sinh ra một làn đỏ không ghi được dòng nào.** Nhát cắt «ghim lại theo
diff» (§4 mục 4) vì thế không còn là tối ưu tốc độ — nó là **điều kiện tồn tại** của chiến
dịch: chỉ khi làn biết hồ sơ nào KHÔNG bị diff chạm để bỏ qua, phần còn lại mới đủ nhỏ để
người sửa từng eval chết một cách có nghĩa.

**Giới hạn của chính số này (khai thẳng):** 4/69 hồ sơ là **5,8 %** mẫu, chọn theo thứ tự
bảng chữ cái chứ không ngẫu nhiên; ba lớp nguyên nhân đúng cho bốn hồ sơ ấy, và KHÔNG được
đọc thành tỉ lệ của 69. Con số dùng được là hướng, không phải ước lượng: ba lớp ấy đều là
lớp cấu trúc, không phải sự cố riêng của một hồ sơ.

- Thước tự dối: không dán glob-literal vào văn hồ sơ (P161 quét corpus); mọi mẫu ở đây nói
  bằng chữ.
