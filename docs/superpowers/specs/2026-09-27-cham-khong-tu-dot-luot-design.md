# Thiết kế — cham-khong-tu-dot-luot (vòng kit 2.18.5)

Hồ sơ: `_acceptance/cham-khong-tu-dot-luot/` · T3 · owner mở vòng 27/09 sau ba lượt phản biện
trong phiên (North Star · người hưởng · tổn thất nếu không làm · giá phải trả). Sổ nguồn:
`docs/findings/2026-09-26-loi-kit-tu-luot-4-okr.md` §3, §6–§11.

## 1. Vấn đề trong một đoạn

Luật K8 («giới hạn là nhãn; hệ thống chết thử lại MỘT lần») đã có bên đọc (`lib/nhan-canh-gay.cjs`)
và đường thử lại cùng round (`s4-args.mjs`). Ba chỗ vẫn để hạ tầng lọt thành vật: (i) mã thoát do
tác tử suy từ chữ in ra — E21 in lại «VIOLATION … verdict=REJECT» của lệnh con mà thoát 0, tác tử
khai 1 ở hai vòng; (ii) cờ `killedByTool` bị bộ chấm bỏ khi ghi sổ; (iii) dòng SUITE không chạy
được mang lý do tự do bị khoá (nhánh bất đối xứng với dòng eval, không ghi lý do ở đâu). Đo 27/09:
harness không cắt đầu ra — nó lưu trọn ra tệp và chỉ hiện 2 KB đầu; tác tử đọc preview đứt thành
«bị giết» (quen-mat-khau). Cùng lượt 4, thẻ Cổng Phạm vi làm rơi 5/8 mục «sẽ không làm» và cả
bảng phản biện thứ hai.

## 2. Phương án

**A (chọn) — dấu mã thoát máy giữ, bọc ở tầng prompt.** Một khối marker `EXIT-MARK` trong bộ chấm
định nghĩa khung: `F=$(mktemp); ( <lệnh>⏎) > "$F" 2>&1; rc=$?; tail -n 30 "$F" | cut -c1-240 | tail -c 6000;
printf '\n__EXIT=%s\n' "$rc"; rm -f "$F"`. Đầu ra luôn ≤ ~6 KB THEO BYTE (tiếng Việt nhiều byte mỗi ký tự — gap-probe P2) nên harness không lưu ra tệp; dấu là
dòng cuối; xuống dòng trước `)` để chú thích `#`, `exit`, `set -e` trong lệnh không phá dấu. Bộ chấm
rút dấu từ `outputTail` bằng JS (`/^__EXIT=(\d+)\s*$/m`, lần cuối). Chuỗi `cmd` trong args KHÔNG đổi
— nó là khoá của `byCmd`, `cmdRuns`, `SUITE_SET`, `expByCmd`, `tenDuyNhat`, carry-forward, run_id.

Bảng quyết định (AC-2):

| Tác tử khai | Dấu | Kết quả |
|---|---|---|
| không cannotRun | có | mã = dấu (cả hai chiều: cứu đỏ sai và kéo xanh sai) |
| killedByTool | có | lệnh đã chạy xong → mã = dấu, bỏ cờ |
| killedByTool | không | cannotRun + `killed_by_tool` (AC-3) |
| cannotRun khác | dấu 0 | mã 0 (lệnh xanh là xanh) |
| cannotRun khác | dấu ≠ 0 / không | giữ cannotRun → nhãn `mu` (tác tử thấy hạ tầng) |
| không cannotRun, mã ≠ 0 | không | giữ mã (97/127 qua `normInfra`) |
| không cannotRun, mã 0 | không | cannotRun «ma thoat khong doc duoc» → không đạt |

Luật chỉ áp lane machine (lệnh eval + suite). Lane ui tự soạn lệnh từ `steps`; baseline là tín hiệu
phụ — giới hạn khai (Out of scope).

**Loại — dấu thắng tuyệt đối.** Biến «thiếu env, lệnh thoát 1» từ BLOCKED hạ tầng thành REJECT đốt
round — đúng lớp vòng này đóng. **Loại — bọc chuỗi `cmd` trong args.** Đổi khoá của sáu bảng tra.
**Loại — dặn tác tử `echo EXIT=$?` bằng lời** (dòng từng thêm rồi gỡ 27/09): hai dấu trôi nhau, và
hiến pháp cấm dặn-bằng-lời làm nghiệm. **Loại — B6 lớp (b)** (đoạn đầu prompt + trường có kiểu +
chạy lại): lõi là lời; sau A, dòng bị câu chuyển tiếp chặn ra `mu` (khai cannotRun) hoặc bị dấu sửa
(bịa mã), cơ chế thử lại sẵn có gánh; mở lại theo ngưỡng.

**B12+ (AC-4).** `nhanLyDo`: dòng SUITE có lý do không rỗng → `mu` như dòng eval; lý do rỗng (đời
trước 2.18.0) → null như cũ. Là TRỪ (gỡ một bất đối xứng không ghi lý do: commit `0eb4db24` và hồ sơ
`nhan-trang-thai-va-reality` đều không nói vì sao). Giá: suite không chạy được VÌ vật (script bị xoá)
được thử lại một lần rồi lên thẻ — có trần.

**B8 thu gọn (AC-5).** `verifiedCommit = sanitize(args.invokedSha) || sanitize(prov.verified_commit)`.
Gỡ quyền khai khỏi tác tử; đường cũ giữ cho bên gọi không truyền `invokedSha`. Không phát hiện cây trôi.

**B1 (AC-6) — khuôn phía viết + bộ đọc khoan dung.** `--extract` phát `scope: [{id:"OOS-n", text}]`
(khuôn đặt trong khối marker `CARD-PLAIN-SCOPE`), bộ dựng hiện từng mục (thôi gộp vào «Hoãn/cắt: …»),
tra câu dịch theo `OOS-n` ở mảng `scope` của bản dịch HOẶC ở `wont_do` (hình crm), không dịch → chữ
hợp đồng; `scope_plain` thôi thay mục. Mọi id dịch không khớp mục nào → cờ vàng gọi tên (nghiệm cho
cả lớp «tiếng người vào ô máy đọc rơi im»). Bản dịch cũ theo AC-n: không cờ.

**B2 (AC-7).** Bộ dựng quét MỌI hàng tiêu đề bảng trong `gap-probe.md` bằng chữ ký sáu cột rút từ
SKILL S1#7 (bên viết), không theo tên mục `##`. Hàng > p0+p1+p2 khai → cờ vàng, không tự tính lại
frontmatter. `lib/gap-probe.cjs` (lưới trước gộp) chỉ đọc frontmatter → không đổi.

**B3 (AC-8).** `wf-usage.mjs`: nhãn = `description` của `agent-*.meta.json` cạnh transcript (đo 27/09:
meta có `description` = nhãn Workflow, `workflowPhase`) → thẻ `[wf-label:]` trong ba tin người đầu →
48 ký tự đầu. Không bỏ nhánh cũ.

**B4 (AC-9).** Prompt ui: `<repoRoot>/_acceptance/<slug>/evidence/<id>-step<n>.png` (đúng luật
`eval-executors.md` «Where a run writes its artifacts»); JS chuẩn hoá `screenshotPath` tuyệt đối dưới
hồ sơ về `evidence/<tệp>` trước khi vào báo cáo (không lộ đường máy, trang bằng chứng đọc tương đối).

**#9 (AC-10).** Ba câu tài liệu, không răng: YÊU CẦU Workflow trong phiên (SKILL), driver độc quyền
tự xếp hàng (eval-executors.md, thay B9), hành vi «saved to file» của harness (khối TOOL-KILL-RULE).

## 3. Quét không gian (Zwicky rút gọn, preset test-matrix)

| Trục | Giá trị | Phủ |
|---|---|---|
| Lane | machine-eval · suite · baseline · ui | AC-1/2/3/4 · Out |
| Tín hiệu mã | dấu có · dấu mất · khai killed · khai cannotRun khác · khai tay | AC-2 (7 hàng) |
| Dòng sổ | killed_by_tool · lý do tự do · lý do rỗng · exit ≠ 0 · hỗn hợp | AC-3, AC-4 |
| Provenance | invokedSha có/không/rác × tác tử khớp/khác/rác | AC-5 |
| Thẻ phạm vi | không dịch · đủ · một phần · id lạ · hình crm | AC-6 |
| Bảng phản biện | một · nhiều mục · tiêu đề lạ · vượt khai báo | AC-7 |
| Telemetry | meta · không meta · thẻ tin 2 | AC-8 |
| Ảnh | trong/ngoài hồ sơ | AC-9 |

Later/Never: B6(b) · phát hiện cây trôi · bọc baseline/ui · B5 · B9 · nửa đường nền.

## 4. Rủi ro và giới hạn khai

- **B7 đổi mặc định mọi lệnh ở mọi kho.** Phanh: đầu ra giới hạn; luật phân ca (không dấu thắng
  tuyệt đối); ca đỏ/im/mới do code sinh; ngưỡng chết ở opportunity (> 1 BLOCKED «ma thoat khong doc
  duoc» / 10 lượt ở kho không sự cố → gỡ vế hàng 7). Có thể TẠM tăng BLOCKED hạ tầng trước khi giảm.
- `[GIẢ ĐỊNH]` ngưỡng lưu-ra-tệp của harness > 8 000 byte — đo được ở lượt chấm đầu của chính vòng.
- Ghim lại hồ sơ kit hoá cũ (≈ 60) là việc của mốc phát hành, không của vòng.

## 5. Dự báo 5 dòng (luật c)

| Dòng | Dự báo | Căn cứ |
|---|---|---|
| Làm xong → quyết được | ↓ | round không bị hạ tầng đốt |
| Lượt gọi người ngoài thiết kế | ↓ | hết «cho vượt trần», `--round` tay |
| Vòng bị hạ tầng kit đốt | ↓ | nền: 2 round chắc chắn / 63 BLOCKED |
| Token máy/vòng | = | không thêm tác tử (B6(b) loại) |
| Phút máy/lượt chấm | = | khung bọc không làm chậm |

Điều kiện tin cậy: đường verdict đổi NGUỒN của `exitCode` → răng hai chiều (AC-2 hàng 1 đỏ, hàng 5
và 6 im, hàng 7 mới).
