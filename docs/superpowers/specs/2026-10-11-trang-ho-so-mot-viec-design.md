# Trang hồ sơ một việc — thiết kế

Hồ sơ: `_acceptance/trang-ho-so-mot-viec/` · hàng X2 của lộ trình kit · Cổng Đáng ký build T2
(owner «Làm», 11/10). Gốc: `crm/_acceptance/trang-lo-trinh-trong-crm` — Out of scope dòng 73.

## Vấn đề

Một hồ sơ đã giao (LT1 của crm: 71 tệp, 42 quyết định, 3 lượt chấm, 140.353 token) chỉ máy đọc được.
Trang bằng chứng hiện có (`scripts/evidence-page.js`) chỉ trả lời «đã chấm ra sao»; sáu câu chủ kho
hỏi — vì sao làm · hứa gì · quyết gì · tốn gì · giao gì · có ăn thua không — đều phải hỏi máy.

## Hướng đã chọn

**Kit VẼ từ vật, không soạn.** Một mô-đun đọc hồ sơ dùng chung, hai bộ vẽ đọc nó:

```
_acceptance/<slug>/{opportunity,contract,decisions,usage-report,evidence-report,uat-session}
        │
        ▼
scripts/ho-so-tom-tat.cjs  — tomTatHoSo(dir, {trangThai}) → { dai, chiTiet, thieu[] }
        │                                   (thuần: đọc tệp, không git, không mạng, không giờ chạy)
        ├──► scripts/evidence-page.js  → trang hồ sơ: dải một phút + mục gập (+ phần bằng chứng cũ)
        └──► scripts/lo-trinh.mjs      → khối lo-trinh-du-lieu bản 2: hang.tom_tat = dai
```

Một mô-đun là răng của luật «bên viết/bên đọc cùng rút»: con số trên trang và con số trong khối
không thể trôi khỏi nhau vì cả hai gọi cùng một hàm. Mô-đun là CJS cạnh `lo-trinh-khoa.cjs` (tiền lệ
sẵn có), không vào `lib/**` — vòng giữ hạng T2. Nó chỉ ĐỌC hai bộ đọc dùng chung ở `lib`
(`ac-line.cjs`, `md-section.cjs`, `nguong-o-co-hoi.cjs`, `eval-yaml.cjs`).

### Phương án bị loại

| Phương án | Vì sao loại |
|---|---|
| Trang thứ ba riêng cho hồ sơ | hai trang người đọc cho một hồ sơ; chủ kho chốt mở rộng trang bằng chứng |
| Gọi model tóm tắt «vì sao» | tốn token mỗi lần vẽ, không tất định, máy soạn thay vì vật nói |
| Mỗi bộ vẽ tự đọc hồ sơ | hai bộ đọc → số trên trang lệch số trong khối (lớp lỗi bên viết/bên đọc trôi) |
| Đặt mô-đun ở `lib/` | đẩy vòng lên T3 (thêm một lượt duyệt kế hoạch) mà không thêm răng nào |

## Dải một phút — chín ô, thứ tự cố định

Tầng **mọi người** (dải trên đầu trang, cũng là `tom_tat.moi_nguoi` của khối):

| Ô | Nguồn (ô thiếu nguồn → «chưa có — <tệp>») |
|---|---|
| `da_giao` — đã giao gì | `feature` của `contract.md` (vắng → của `opportunity.md`), bỏ một cặp «» bao ngoài |
| `vi_sao` — vì sao | đoạn lý do đầu tiên của mục «Vấn đề & ai gặp» của `opportunity.md` — bỏ qua đoạn trích (`>`), đoạn «Mở từ hàng…», đoạn chỉ là câu giao, đoạn bắt đầu bằng dòng neo `Gốc:`; đoạn dạng `--mo-o` «Vì sao: Gốc: <con trỏ> — <lý do>» lấy phần sau « — » đầu tiên; vắng → đoạn đầu `## Context` của `contract.md` |
| `trang_thai`, `ngay` — trạng thái + ngày | chữ trạng thái do bộ người gọi đưa vào (trang: `classify` của bản đồ sản phẩm — cùng chữ với trang lộ trình); ngày = ngày của mốc gần nhất trong hồ sơ: dòng `thuc-te` · ngày `human_signoff` · `approved_at` · `decided_at` |
| `production` — đã lên production chưa | dòng sổ `type: thuc-te` cuối: «đã chạy ở production — bản dựng <sha7>, quan sát <ngày>, <người>»; vắng → «chưa ghi quan sát production» |
| `do_gi` — sẽ đo gì, khi nào | câu hỏi phép đo + Timebox của mục ngưỡng `opportunity.md` (bộ đọc `lib/nguong-o-co-hoi.cjs`) |
| `ket_qua` — kết quả | `uat-session.md` (phán quyết + số đo); vắng → «chưa đo» |
| `chua_lam` — chưa làm gì | số mục Out of scope + số mục Known limits; ba mục đầu nguyên văn |
| `ai_quyet` — ai quyết | người ký từng cổng: Cổng Đáng `decided_by` · Cổng Phạm vi `approved_by` (rỗng + veto mở → «máy đi tiếp, cửa veto mở») · Cổng Bằng chứng `human_signoff` (vắng + `machine-cleared` → «máy thông») |

Tầng **chủ kho** (`tom_tat.chu_kho`): `tieu_chi` (đếm `parseACBlock`) · `phep_do` (số eval trong
`evals.yaml`) · `luot_cham` (số khối «S4 round» trong `usage-report.md`) · `token` (tổng out-token
mọi khối của `usage-report.md`) · `quyet_dinh_may` / `quyet_dinh_nguoi` · `ma` (`verified_commit`).

**Luật người/máy cho một dòng sổ** (một hàm, dùng cho cả dải, dòng thời gian và khối): dòng là
NGƯỜI khi có `decided_by` hoặc `by` khác rỗng, hoặc `type` ∈ {`seal`, `thuc-te`}; còn lại là MÁY.
Trên LT1: 16 người · 26 máy (khớp số đếm tay trong ô cơ hội).

**Sáu câu → chỗ trả lời** (eval nhìn E12 chấm đúng bảng này; mọi ô và dòng tầng chủ kho nằm trên
màn đầu):

| Câu | Chỗ trả lời |
|---|---|
| vì sao làm | ô `vi_sao` |
| hứa gì | ô `da_giao` + mục «Đã hứa» (mở bằng một phím) |
| quyết gì | ô `ai_quyet` + số Máy/Người của dòng tầng chủ kho + mục «Quyết định» |
| tốn gì | dòng tầng chủ kho: lượt chấm, token |
| giao gì | ô `trang_thai` / `ngay` + mã đã chấm của dòng tầng chủ kho |
| có ăn thua không | ô `do_gi` + ô `ket_qua` |

**Không có ô «số lần gọi người»** — chưa có máy đếm; khuôn khoá không mang khoá này.

## Trang hồ sơ (`evidence-page.js` mở rộng)

Thứ tự: tiêu đề (câu giao bỏ «») → dải một phút (chín ô + một dòng tầng chủ kho) → mục gập
`<details>`: **Vì sao làm** · **Đã hứa** (từng AC: mã + câu) · **Thiết kế** (đường `design_doc`) ·
**Quyết định** (dòng thời gian theo `at`, nút lọc Tất cả/Máy/Người — script nội tuyến, không mạng) ·
**Bằng chứng** (toàn bộ phần trang bằng chứng cũ, giữ nguyên) · **Tài nguyên** (mỗi khối của
`usage-report.md` một dòng: tên khối, số tác tử, out-token) · **Giới hạn và ngoài hợp đồng** ·
**Giao** (mã đã chấm, ngày ký, người ký/máy thông, PR) · **Giá trị** (mỗi ngưỡng của ô cơ hội cạnh số
đo của phiên nghiệm thu; chưa có → «chưa đo»).

- **PR trên trang:** mọi lỗi git (gốc không phải kho git, mã đã chấm không có trong kho, clone nông) → «chưa gộp», không in gì ra stderr. Tìm trong lịch sử gộp của HEAD commit gộp đầu tiên có `verified_commit` là tổ
  tiên và tiêu đề «Merge pull request #N»; không có → «chưa gộp». Trang vẽ theo yêu cầu, không nằm
  trong git của kit (`.gitignore`), nên đọc git ở đây không làm lệch phép `--check` nào.
- **Đường đọc-cũ:** mỗi tệp nguồn vắng thì ô của nó in «chưa có — <tệp>» và trang vẫn ra; sổ đời
  trước ghi `impact` vẫn đọc; dòng sổ JSON hỏng bị bỏ và đếm «N dòng sổ không đọc được». Hồ sơ chưa có
  `evidence-report.md` thì trang vẫn dừng mã 2 như hôm nay (lệnh thẻ đang dựa vào hành vi này).
- **Tất định:** không ngày chạy, không múi giờ, không số ngẫu nhiên; vẽ hai lần ra cùng byte.

## Khối dữ liệu lộ trình bản 2

- `phien_ban: 2`. Thêm đúng một khoá ở cấp hàng: `tom_tat` — `null` khi hàng chưa có hồ sơ; có hồ sơ
  thì `{ moi_nguoi: {da_giao, vi_sao, trang_thai, ngay, production, do_gi, ket_qua, chua_lam, ai_quyet},
  chu_kho: {tieu_chi, phep_do, luot_cham, token, quyet_dinh_may, quyet_dinh_nguoi, ma} }`.
  `trang_thai` trong dải = đúng chữ trạng thái của hàng.
- **Không có số PR trong khối** (lệch phạm vi đã chốt — ghi sổ): khối được vẽ trước lúc gộp và
  `--check` của CI so byte, nên số PR (chỉ có SAU khi gộp) làm trang lệch ngay sau mỗi lần gộp. `ma`
  đủ để lần ra PR.
- **Đọc hai chiều:** `docDuLieu` mới biết `phien_ban` 1 và 2 — trang bản 1 cho mỗi hàng `tom_tat: null`
  và đúng một cảnh báo có tên «trang vẽ bằng khuôn bản 1 — chưa có tóm tắt hồ sơ». Bộ đọc bản 1 mà crm
  đang chép gặp trang bản 2 thì đã «đọc phần biết» + một cảnh báo — ca đo chạy CHÍNH bản chép đó (rút từ
  commit gốc bằng `git archive`).
- Tài liệu `skills/acceptance/references/lo-trinh-du-lieu.md` thêm bảng khoá bản 2 trong cùng khối
  marker; ca đo so hai bên như bản 1.

## Dấu «» quanh câu giao

Hàm `boNgoacNgoai(s)`: bỏ ĐÚNG một cặp khi ký tự đầu là «, ký tự cuối là », và dấu « đầu tiên đóng
đúng ở ký tự cuối (đếm độ sâu). Ma trận: `«A»`→`A` · `«A» và «B»`→ giữ nguyên · `««A» b»`→`«A» b` ·
`A`→`A` · `«»`→`` · `` → `` · `«A`→ giữ nguyên. Áp ở: ô câu giao trên trang lộ trình, «làm tiếp»,
`hang.cau_giao` + `hang_ke.cau_giao` của khối, tiêu đề + `da_giao` của trang hồ sơ, `feature` của ô cơ
hội `--mo-o` sinh. Không áp vào `vi_sao`/`bat_khi` (không phải tiêu đề). Tệp kế hoạch của kho không bị
đụng. Khuôn mẫu `lo-trinh-template.json` thôi bọc «».

## Rủi ro đã biết

- Ca đo LT-112 của X1 so phần hiển thị với bộ vẽ ở commit gốc — bỏ «» đổi phần hiển thị nên ca phải
  chuẩn hoá đúng phép bỏ ngoặc ở bên cũ (hoặc dùng câu giao không bọc), kéo hồ sơ X1 vào lượt ghim lại
  ở mốc phát hành kế.
- Bản chiếu crm đang hiện `cau_giao` có «» — sau khi nhận mốc mang X2 thì hiện không «» (đúng ý hàng).

## Đặc tả UX

Trang tĩnh một cột, rộng tối đa 920 px như trang bằng chứng hiện có; dải là lưới 3 cột × 3 hàng ở
≥ 720 px, một cột ở màn hẹp. Mỗi ô: nhãn câu hỏi (chữ nhỏ, màu phụ) trên, câu trả lời dưới; ô «chưa có»
màu nhạt kèm tên tệp. Mục gập dùng `<details>` (bàn phím mở được, không cần script); bộ lọc quyết
định là ba nút có `aria-pressed`. Không tải gì từ mạng. Trạng thái trang: đủ · thiếu một phần (ô
«chưa có») · hồ sơ không có báo cáo (dừng, như cũ).
