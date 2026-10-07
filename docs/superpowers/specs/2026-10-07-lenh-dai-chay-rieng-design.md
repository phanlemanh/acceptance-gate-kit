# Lượt chấm S4: lệnh dài hơn trần công cụ · eval nặng chạy riêng — thiết kế

Gốc: crm/_acceptance/tro-ly-okr-bo-final-output (run-log.jsonl dòng 29–30, 49–50; evidence-report.md dòng 16, 144, 161–162 — ngày 07/10/2026)

## Hai sự cố đo được ở crm

Hồ sơ `tro-ly-okr-bo-final-output` của crm, bốn lượt chấm S4 trên feature-loop 2.24.0:

| Lượt | Verdict | Nguyên nhân |
|---|---|---|
| 1 | REJECT | suite `agent-okr` đỏ một ca: `app-rieng.integration.spec.ts` từ chối chạy vì gốc `apps/agent` đang có `eve dev` không phải của bài thử — `eve dev` do eval gọi model (E6/E7) dựng, chạy CÙNG LÚC với suite |
| 2 | BLOCKED | E6/E7 (`do-mo-hinh.mjs`, 20–35 phút) khai «bị công cụ giết ở ~600 giây» |
| 3 | BLOCKED | như lượt 2 |
| 3 (lại) | REJECT | E6/E7 ĐẠT (thước tự ghi nhật ký có dòng `KET THUC ma <n>`), nhưng suite `agent-okr` đỏ lại đúng như lượt 1 |

Chạy riêng thì suite 5/5 xanh. Hai lượt REJECT và hai lượt BLOCKED đều là **hạ tầng của kit đốt lượt chấm**, không phải vật.

### Sự cố 1 — gốc thật (đọc bản ghi tác tử, không đọc lời khai)

Bản ghi tác tử chấm của lượt 2 (`wf_d56fc728-904`) và lượt 3-lại (`wf_06e1732e-3e9`):

1. Tác tử chạy lệnh qua khung bọc `BOC_LENH` với `timeout: 900000`.
2. Công cụ trả: «Command did not complete within its 600s timeout and was **moved to the background** … Output is being written to: <tệp>». Lệnh **không bị giết** — nó vẫn chạy.
3. Tác tử đọc tệp đầu ra nền: **trống**. Trống vì CHÍNH khung bọc của kit ghi toàn bộ đầu ra vào một tệp tạm (`mktemp`) và chỉ in đuôi + dòng `__EXIT=` khi lệnh đã xong.
4. Lượt 2: tác tử kết luận «chưa có output → bị giết», khai `killedByTool: true`. Lượt 3-lại: tác tử chờ bằng vòng `while [ -z "$(cat <tệp>)" ]; do sleep 5; done` và nhận đủ kết quả.

Vậy chỗ hỏng là **luật TOOL-KILL không có lối cho «chuyển sang nền»** — nó chỉ biết «bị giết» — cộng với **khung bọc làm tệp nền trống tới phút chót**, nên một tác tử đọc đúng luật vẫn ra BLOCKED. Thước của crm tự ghi nhật ký là đường vòng của kho, không phải nghiệm của kit.

### Sự cố 2 — gốc

`acceptance-verify.js` chia lệnh máy làm hai nhánh chạy đồng thời: `songSong` (mọi lệnh eval) và `tuanTu` (chuỗi suite). Eval gọi model dựng tiến trình chung (`eve dev` ở `apps/agent`) mà một ca suite canh — nhánh song song đè nhánh tuần tự. Làn ghim lại (`repin-lane.mjs`) không mắc vì nó chạy eval nối đuôi SAU khối suite; S4 thì không.

## Thiết kế

### A. Eval khai `long_running: <phút>` — kit chạy nền và chờ, bằng lệnh MÁY sinh

- **Khai:** khoá mới trên một eval `test`/`script` trong `evals.yaml`: `long_running: <phút>` — số nguyên 1…240, là **thời lượng tối đa dự kiến** của lệnh. Vắng = như hôm nay.
- **Bên viết** (`s4-args.mjs`): đọc khoá qua bộ đọc dùng chung `parseEvals`, kiểm số nguyên trong 1…240, mang lên eval trong args thành `longRunning: <phút>`. Giá trị sai → exit 2 gọi tên eval + giá trị, không sinh tệp.
- **Bên đọc** (`acceptance-verify.js`): thuộc tính của LỆNH (dedupe theo `cmd`): `phút(lệnh) = max(longRunning)` trên mọi eval trỏ tới lệnh. `longRunning` hỏng trên args → BLOCKED `(evals)` có tên (cùng nhánh fail-loud với trường bắt buộc).
- **Lane máy cho lệnh dài** — prompt nhận HAI lệnh do JS sinh, tác tử chỉ chép nguyên văn:
  - **Khởi chạy** (`BOC_NEN`): ghi đầu ra vào nhật ký đường CỐ ĐỊNH `<repoRoot>/.acceptance-runs/<slug>/s4-lenh-dai/r<round>-l<k>-<lần>.log`, lúc xong nối dòng `__EXIT=<n>` (cùng `EXIT_MARK` với khung bọc thường) và viết tệp `.xong`; ghi `.pid` + `.bat-dau`; tự tạo `.acceptance-runs/.gitignore` nếu vắng (nếp `TU-AN-GIT` của làn ghim lại). Tác tử khởi chạy với `run_in_background` của công cụ; quên tham số thì công cụ tự đẩy sang nền ở 600 s — nhật ký vẫn ở đường cố định, nên kết cục không đổi.
  - **Chờ** (`CHO_NEN`): mỗi lần gọi tối đa `TRAN_LAN=100` giây — DƯỚI trần MẶC ĐỊNH 120 s của công cụ, nên tác tử quên truyền timeout thì lệnh chờ cũng không bị đẩy sang nền (gap-probe F2: máy giữ, không dặn bằng lời). Chờ tệp `.xong` (KHÔNG chờ chuỗi trong nhật ký — lệnh tự in một dòng `__EXIT=` giả giữa chừng không được kết thúc việc chờ). Ra một trong ba dạng: **xong** — đuôi nhật ký (cùng trần byte với khung bọc thường), dòng cuối là `__EXIT=<n>` thật · **`__CHUA_XONG`** — 5 dòng cuối nhật ký với MỌI dòng `__EXIT=` bị che thành `[__EXIT che]` (gap-probe F1: đuôi chưa-xong không được mang dấu nào cho `normDau` đọc), rồi dấu; tác tử gọi lại đúng lệnh · **`__QUA_HAN`** — quá `HAN_PHUT` tính từ `.bat-dau`: lệnh chờ tự dừng CẢ CÂY tiến trình từ `.pid` (đệ quy theo `pgrep -P`), in đuôi đã che như trên rồi dấu; tác tử khai `cannotRun` + lý do «vượt thời lượng khai».
- **Mã thoát đi qua cùng đường đọc dấu** `normDau`: dòng `__EXIT=` cuối trong `outputTail` thắng mọi lời khai — tác tử lỡ khai `killedByTool` mà đuôi có dấu thì dấu thắng (hành vi sẵn có).
- Lệnh KHÔNG khai: prompt giữ **nguyên văn từng byte** như 2.24.0 (AC-7 đo bằng vi phân với tag `v2.24.0` — mốc cố định, không phải merge-base: sau khi gộp merge-base trùng cây và phép vi phân rỗng; gap-probe F3).
- Lệnh vừa chạy-riêng vừa dài (đúng ca crm E6/E7): nhóm chạy-riêng đi qua CÙNG `agentCuaLenh` nên nhận khung nền — đo trực tiếp ở AC-6 (gap-probe F5).

### B. Luật TOOL-KILL: «chuyển sang nền ≠ bị giết» (lời, cho mọi đường chạy lệnh)

Thêm một dòng vào khối marker `TOOL-KILL-RULE` (nguồn duy nhất, đi vào prompt cả ba lane qua `args.toolKillRule` và vào phiên VERIFY độc lập): tool result báo lệnh đã CHUYỂN SANG NỀN → lệnh vẫn chạy, KHÔNG khai `killedByTool`; tệp nền trống là bình thường vì khung bọc chỉ in lúc xong; chờ bằng lệnh có giới hạn mỗi lần ≤ 100 s (dưới trần mặc định 120 s của công cụ) tới khi có dòng `__EXIT=<n>`; tổng chờ tối đa = `long_running` của eval, vắng thì 30 phút; quá → `cannotRun` + lý do gọi tên việc cần làm («khai long_running: <phút>»).

Đây là **lời**, không phải răng: hành vi tác tử trên lệnh không khai không đo được bằng máy (giới hạn khai). Răng của vòng là nhánh A — lệnh máy sinh, đo bằng bash thật.

### C. Eval trong `feature_loop.model_evals` chạy RIÊNG, sau mọi lệnh máy khác

- **Khai:** không khoá mới. `feature_loop.model_evals` (`<slug>/<Eid>`) đã có từ 2.23 và crm đã liệt E6/E7. Đọc bằng CHÍNH `docKhoa` của `feature-loop/scripts/lib/lan-khoa.mjs` (bộ đọc của làn ghim lại) — một nguồn, cùng luật kiểm giá trị.
- **Bên viết:** `s4-args` thêm `evalsChayRieng: [<Eid>…]` = id của slug đang chấm có trong danh sách và còn trong `evals` (ô `not-run` đã bị lọc). Khoá VẮNG hẳn khi rỗng.
- **Bên đọc:** lệnh có ít nhất một eval thuộc `evalsChayRieng` (và không phải lệnh suite — lệnh suite giữ chỗ trong chuỗi suite) vào nhóm `chayRieng`, chạy **tuần tự** SAU khi cả nhánh song song lẫn chuỗi suite kết thúc. Ngữ nghĩa «chạy một mình» chặt hơn «sau suite»: hai eval model cũng không chồng nhau (crm tự xếp E22 → E17 tuần tự trong thước; kit giữ đúng nếp đó). Dry-run in `commandGroups.chayRieng`.
- Args đời cũ (không khoá) → nhóm rỗng → thứ tự y như hôm nay.

### Vì sao chọn vậy (đã cân, máy tự quyết — cửa veto mở)

| Chỗ rẽ | Chọn | Bỏ | Vì sao |
|---|---|---|---|
| Ai giữ nhật ký + dòng kết | Kit (khung `BOC_NEN`, dấu `__EXIT=` một nguồn) | Eval tự khai đường nhật ký + dòng kết (gợi ý ban đầu) | Biến bất biến từ đầu-người sang vật-máy-giữ (hiến pháp 30/08). Mỗi thước tự viết nhật ký là thước nào cũng phải làm đúng một việc kit làm được một lần; crm đã phải sửa thước mới qua được. |
| Ngữ nghĩa số phút | Thời lượng TỐI ĐA dự kiến (trần chờ) | Thời lượng trung bình | Máy cần một hạn để biết «treo» — hạn là thứ duy nhất số này phục vụ. |
| Dấu hiệu «nặng» | `feature_loop.model_evals` có sẵn | Khoá eval mới `chay_rieng: true` | Không thêm khoá; crm đã khai; làn ghim lại đã chạy chúng sau suite — S4 nay nhất quán với làn. |
| Chạy riêng = sau gì | Sau MỌI lệnh máy (song song + suite), tuần tự với nhau | Chỉ sau suite | Tài nguyên chung không chỉ va với suite; giá là đồng hồ tường (crm: ~13 phút suite + 35 phút eval thay vì max), rẻ hơn một lượt chấm bị đốt (~25 phút + token). |
| Lệnh không khai bị đẩy sang nền | Chờ tới 30 phút theo luật lời | Giữ BLOCKED | Kho không có lệnh > 600 s không thấy gì đổi; kho có thì lượt hết BLOCKED giả, và lý do BLOCKED khi quá 30 phút chỉ thẳng việc cần làm. |

### Phép thử mọi kho (luật 26/09)

- **Kho không khai gì** (không `long_running`, không `model_evals`): prompt từng lệnh và thứ tự chạy BẰNG HỆT bản base — AC-7 đo bằng vi phân trên CÙNG args. Đổi duy nhất là một dòng mới trong luật TOOL-KILL (thêm lối, không đổi lối cũ); lệnh < 600 s không bao giờ chạm lối đó.
- **Kho có `model_evals`** (crm hôm nay, và mọi kho khai sau): eval model chạy sau, đồng hồ tường dài hơn. Hành vi cũ có ai dựa không? Không — chạy chồng chính là sự cố.
- **Bộ máy cũ + args mới / args cũ + bộ máy mới:** khoá vắng → hành vi cũ; workflow cũ gặp khoá lạ thì bỏ qua (không có nhánh kiểm khoá thừa).

## Giới hạn đã khai

- Suite (`feature_loop.suite_keys`) KHÔNG khai được `long_running` — suite dài vẫn phải chia mảnh như tiền lệ `ha-tang-khong-dot-luot`; lối lời (B) vẫn phủ nó tới 30 phút. Ngưỡng mở: ≥ 1 lượt chấm BLOCKED vì một suite quá 30 phút.
- Lane baseline và ui-check không dùng `BOC_NEN`; baseline gặp lệnh dài đi lối lời (B), vẫn là tín hiệu phụ rời đường găng.
- «Chạy riêng» chỉ riêng với lệnh MÁY (eval + suite); ui-check và baseline vẫn chạy đồng thời.
- Dừng tiến trình khi `__QUA_HAN` giết cả cây con từ `.pid` của vỏ khởi chạy (đo bằng pid canh của tiến trình cháu); tiến trình tự tách khỏi cây (daemon, `setsid`) thoát được.
- Hành vi tác tử trên lối lời (B) không có răng máy.
