# Chiến dịch ghim lại sau luật làn eval — bốn tầng nợ của một vật đã lưu kho (08/09)

> Owner ra lệnh 08/09: *«chạy ghim lại trước khi gộp»* (PR #157). Chiến dịch
> bóc ra bốn tầng nợ, không tầng nào là hồi quy sản phẩm. Ba lượt làn máy
> (~75 phút) mới thấy hết. Mọi con số dưới đây dán được bằng một lệnh.

## Kết luận trước

**Luật làn eval (ADR 0014, owner siết 07–08/09) biến một vật ĐÃ LƯU KHO thành
chặn-merge trên 25 hồ sơ đã ký.** Vật đó là bản sao `plugins/` + cây Codex, lưu
kho 12/08 (ADR 0008 + 0009, Cổng 1 duyệt). Khi ấy khoá `executors.script.mirror_sync`
bị xoá khỏi `config.yaml` — đúng và có chủ đích. Nhưng con trỏ tới nó còn sống
ở **ba tầng** của các hồ sơ đã ký, và luật cũ (làn chỉ chứng suite) không bao
giờ chạm tới chúng. Luật mới chạy mọi eval máy của từng hồ sơ, nên mọi con trỏ
chết thành làn đỏ.

Đây là hình dạng thứ sáu của lớp lỗi **«thước ghim vào thứ SẼ ĐỔI»** trong sổ:
không phải thước ghim hằng, mà **thước ghim vào một VẬT đã bị lưu kho**.

## Bốn tầng, đo được

| Tầng | Hồ sơ | Vật ghim chết | Trạng thái |
|---|---|---|---|
| 1 · con trỏ eval | 21 | `evals.yaml` trỏ `config:executors.script.mirror_sync` | **ĐÃ SỬA** (`c7ad2850`) |
| 2 · thước mục nát | 6 | tên ca · khuôn `inputs` cũ · số ca · hash SKILL · file Codex · hằng version | chờ owner |
| 3 · bằng chứng đã ký | 21 | `evidence-report.md` ghi `verifier: config:executors.script.mirror_sync` | chờ owner |
| 4 · lỗ của chính script | — | `repin-lane.mjs` ghi từng hồ sơ RỒI recheck từng hồ sơ | chờ owner |

Tầng 2 và 3 giao nhau 2 hồ sơ → **25 hồ sơ** còn đỏ (từ 48).

### Tầng 2 — sáu hình dạng thước mục nát

| Hồ sơ | Thước ghim vào | Nay là |
|---|---|---|
| `het-gio-khong-phai-truot` | tên ca `"W25 rule rut tu marker"` | ca đổi tên thành `"W25 rule rut tu file nguon"`, vẫn sống |
| `cham-dung-cay-dung-cho-dung` | fixture dùng khuôn `inputs` cũ | vòng `inputs-tinh-tu-goc-kho` đã đổi luật sang gốc kho |
| `cong-chan-nham-cho` | số ca `686`, `145` | `799`, `261` |
| `moi-noi-vong-trao` | hash nội dung SKILL | SKILL tiến hoá mỗi vòng |
| `may-ganh-nguoi-quyet` | file `codex/acceptance-gate/skills/…` tại `origin/main` | cây Codex đã lưu kho |
| `stale-theo-diff-pr` | hằng version `1.39.2` + đường mirror | kho ở `2.9.0`, mirror đã lưu kho |

Ba trong sáu (`may-ganh`, `stale-theo-diff`, và một nửa của `cong-chan`) bắt
nguồn từ **cùng quyết định lưu kho 12/08** — cùng gốc với tầng 1 và 3.

## Việc máy đã tự làm

- **Gỡ trọn lớp tầng 1 (21 hồ sơ, `c7ad2850`).** Quét TOÀN KHO chứ không chỉ
  18 hồ sơ pre-merge nêu tên — ba hồ sơ ngoài danh sách cũng mang con trỏ chết.
  Hợp đồng KHÔNG sửa; mỗi `evals.yaml` để lại ghi chú trỏ ADR 0008/0009.
- **Ghim lại 26 hồ sơ (`683e8e06`).** Làn xanh: 5 suite + 278 eval máy tại
  `c7ad2850`, `run_id repin-20260908T050515Z-82614`; recheck xanh 26/26.
  Vi phạm cổng: **48 → 25**.

## Hệ quả máy gây ra, khai thẳng

Gỡ con trỏ ở tầng 1 làm `evals.yaml` của ba hồ sơ **vốn xanh** đổi nội dung →
bằng chứng của chúng lệch cây → đỏ dạng `evidence is stale`:
`consumer-copy-cjs`, `mot-luot-go-cong-nguoi`, `rang-phep-do-viec-cua-anh`.
Chúng rơi vào đúng nhóm tầng 3 (bằng chứng ghi khoá chết), nên không phát sinh
việc mới — nhưng con số 25 gồm cả ba cái này, không phải 22.

Hoàn nguyên việc gỡ KHÔNG phải lối ra: con trỏ chết sống lại thì lần ghim lại
kế tiếp đỏ vì hạ tầng, đúng vòng tròn.

## Ba lối cho phần còn lại (25 hồ sơ)

**Lối A — sửa cả tầng 2 và 3, ghim lại trọn kho.** Chạm 25 hồ sơ đã ký, trong
đó 21 hồ sơ phải sửa dòng `verifier:` nằm cạnh chữ ký người. Đảo được bằng
`git revert`, nhưng là chạm bằng chứng đã ký ở quy mô lớn nhất từ đầu kit.
Chi phí: ~2 giờ máy cộng một lượt làn cho 25 hồ sơ.

**Lối B — nợ có tên, gộp #157 trước.** Vi phạm 25 dòng không thêm nợ mới, và
PR #157 không sinh dòng nào. Ghi 25 hồ sơ vào một ô nợ có tên, xử ở mốc phát
hành kế theo GUIDE §7.1. Rủi ro: cổng đỏ thường trực làm cảnh báo mất giá —
đúng cái North Star gọi là trạm thu phí.

**Lối C — nới ADR 0014.** Cho luật làn eval bỏ qua eval trỏ executor không còn
định nghĩa, thay vì đỏ. Rẻ nhất về giờ, nhưng mở đường fail-open ở đúng luật
owner vừa siết hai lần trong hai ngày.

**Máy khuyên lối B cho hôm nay + lối A ở mốc phát hành kế.** Căn cứ: tầng 3 là
sửa bằng chứng đã ký của 21 hồ sơ — việc đó xứng một vòng riêng có hồ sơ và
chữ ký, không phải phần đuôi của một chiến dịch ghim lại. Và PR #157 đang chờ
gộp không sinh nợ nào.

## Lỗ của script, nên mở ô riêng

`feature-loop/scripts/repin-lane.mjs` ghi hồ sơ thứ N rồi mới recheck hồ sơ
thứ N. Làn đỏ ở giữa để lại N−1 hồ sơ đã ghi, phải hoàn nguyên tay
(`git checkout --`). Nghi thức tuyên «làn đỏ → KHÔNG ghi gì» nhưng script
không nguyên tử. Đã xảy ra một lần trong chiến dịch này.
