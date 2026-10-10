# DP3 `dieu-phoi-tiep-tuc-mot-lenh` — thiết kế thi công

Gốc: hàng DP3 của lộ trình kit (`docs/plans/lo-trinh-kit.json`) · ô dù
[`dieu-phoi-tho-trong-kit`](../../../_acceptance/dieu-phoi-tho-trong-kit/opportunity.md) (Cổng Đáng build
09/10, phủ DP1–DP4 — spec ô dù §3) · **thiết kế chung đã duyệt 10/10:**
[workflow 2026-10-10](2026-10-10-dieu-phoi-workflow-design.md) §4.2, §5, §5.1, §6, §9, §16 (T12) · spec ô
dù [2026-10-09](2026-10-09-dieu-phoi-tho-trong-kit-design.md) §2.3 (mọi lần ghi vào thư mục đợt đi qua CLI).

Tài liệu này KHÔNG mở thiết kế lại. Nó chốt chi tiết thi công trong khung đã duyệt và chín chỗ chọn mà spec
để ngỏ (mục 3). Chỗ nào spec đã nói thì chỉ trỏ về.

## 1. Việc

Một lệnh `/dieu-phoi:tiep-tuc` nối lại đợt sau khi app khởi động lại, phiên giám sát hết ngữ cảnh hay
Monitor hết hạn: chẩn đoán đủ mục, nhận vai giám sát, chạy lại bộ phát lịch nếu chết, giăng lại Monitor,
lịch 30′, nhóm thanh bên, và chỉ mở chip cho dãy không còn phiên sống. Kèm theo, đúng phần §9 giao cho DP3:
nhịp sống của phiên (§5.1, tệp `song/`), đánh thức phiên giám sát (§5), lệnh con ghi qua CLI (spec ô dù
§2.3), `chan-doan` đủ mục, và kiểm môi trường do kho khai (T12).

Ca gốc: 09/10 phiên giám sát crm khởi động lại làm dừng 37 việc nền giăng tay; 08/10 Monitor hết hạn, hai
việc lỡ 5 giờ; 09/10 phiên giám sát mới bị chặn ghi tệp vào thư mục đợt (nằm ngoài worktree của phiên).

## 2. Bố cục

```
dieu-phoi/
  commands/tiep-tuc.md    lệnh người: CLI tiep-tuc → Monitor, lịch 30′, nhóm thanh bên → chip/tin theo
                          kế hoạch từng dãy → chẩn đoán lại; `--nhe` cho mỗi lần thức
  scripts/song.mjs        MỘT bên viết `song/<mã phiên>.json` (gọi từ hook-nhip) + bên đọc «dãy có phiên sống»
  scripts/tiep-tuc.mjs    phần tất định của tiếp tục: nhận vai, chạy lại bộ phát lịch, thuc_luc, kế hoạch dãy
  scripts/danh-thuc.mjs   quyết của phiên ngắn lịch 30′: không gì · nhắn giám sát · báo chủ kho
  scripts/viec-cho.mjs    MỘT hàm «việc chờ»: yêu cầu chưa trả lời · tệp chờ người · can_phan sau thuc_luc
                          (chan-doan mục viec-cho và danh-thuc cùng gọi)
  scripts/ghi.mjs         lệnh con ghi: xin · nha · yeu-cau · tra-loi · nhat-ky — ghi nguyên tử, kiểm khuôn
                          bằng CHÍNH hàm kiểm bộ phát lịch dùng (kiemDon, kiemYeuCau, kiemTraLoi)
  scripts/moi-truong.mjs  kiểm môi trường: gh, remote, bản gói lệch bản lõi đợt, `kiem_moi_truong` của kho
  scripts/chan-doan.mjs   thêm mục: giam-sat · hook-phien · viec-cho · day:<id> · moi-truong · ban-goi (giữ sáu mục của DP2)
  scripts/vai.mjs         thêm nhanVaiGiamSat (lịch sử nhận vai) và ghiThucLuc
  scripts/hook-nhip.mjs   thêm ghi nhịp sống
  scripts/phat-lich.mjs   thêm sự kiện khoa-khong-nhip
  scripts/mau/LUAT.md     thợ xin/nhả/yêu cầu bằng lệnh con, không ghi tay
```

Ngoài gói: bảng `COMMAND-NAMES` thêm `/dieu-phoi:tiep-tuc`; GUIDE §6.6, QUICKSTART nêu lệnh thứ tư;
`CONTEXT.md` thêm mục «Nhịp sống của phiên»; ca DP2-01 nâng tập lệnh lên bốn (dòng sổ `revisit` ở hồ sơ
DP2, ghim lại hồ sơ DP2).

## 3. Chín chỗ chọn (hai chỗ lệch chữ spec, có ghi)

1. **Mã phiên lấy từ đâu.** Hook nhận `session_id` trong đầu vào; CLI chạy bằng Bash thì không. Chọn: nhịp
   sống khoá theo `session_id` của hook; lệnh người truyền mã phiên của chính nó qua `--phien` (cùng nếp
   `mo --phien` của DP2, phiên lấy mã bằng công cụ phiên của app). «Dãy có phiên sống» nối qua **worktree**
   (spec §5.1: «có tệp nhịp mới hơn 10′ cho worktree của nó»). **Đây là chỗ LỆCH chữ của spec, không phải
   chỗ spec để ngỏ:** §5.1 còn viết «`chu.json` của khoá ghi thêm mã phiên, không chỉ mã dãy» và báo khi
   «không có nhịp của đúng phiên giữ». CLI `xin` chạy bằng Bash không biết mã phiên của phiên gọi nó, nên
   hàng này không làm vế đó (dòng sổ `descope`). Giá: một phiên KHÁC vào cùng worktree và gọi công cụ thì
   nhịp theo worktree vẫn tươi — khoá của phiên đã chết không bị báo (`khoa-khong-nhip` im). Hàng E10 khai
   đúng ca này. Ngưỡng mở lại: ≥1 lần đợt thử thấy hai phiên trên cùng worktree.
2. **Ghi nhịp sống ở mọi lời gọi công cụ** nhưng bỏ qua khi tệp nhịp của phiên mới hơn 30 giây: hook chạy
   ở mỗi lời gọi, ghi lại mỗi lần là thêm I/O vô ích; độ phân giải 10′ của §5.1 không cần hơn. Kho không
   đợt: im như cũ (chiều im DP1-02).
3. **Kế hoạch từng dãy do CLI tính, phiên chỉ làm.** `tiep-tuc --json` trả mỗi dãy một hành động:
   `khong` (có nhịp sống < 10′ hoặc giữ khoá, không đơn chờ) · `nhan-giang-lai` (có nhịp sống, còn đơn/khoá/
   yêu cầu chờ — phiên nhắn dãy «tiếp tục: giăng lại lệnh chờ») · `mo-chip` (không nhịp sống, không giữ
   khoá; kèm lời ghi danh dựng từ git + `status` hồ sơ + `tiep/`) · `worktree-mat` (worktree không còn —
   việc của người) · `cho-nguoi` (có `cho-nguoi/<dãy>.json` — thợ đứng chờ người ở cổng; nhịp sống chỉ đo
   HOẠT ĐỘNG nên thợ chờ cổng trông như chết, và tệp chờ người là tín hiệu phân biệt) · `chua-biet` (đợt
   chưa từng có thư mục `song/`: hook bản cũ, hoặc phiên chưa nạp lại gói — không mở chip, nói người kiểm
   thanh bên). Phiên không tự suy.
4. **Lệnh con chỉ-giám-sát** (`tra-loi`, `pha`, `vai`, `nhat-ky`) nhận `--phien`; `vai.json` có giám sát và
   `--phien` khác → từ chối, thoát 1, nêu hai mã, không ghi gì. Vắng `--phien` → chạy như DP2 (đường đọc-cũ:
   lệnh `dong-dot`, `mo-dot` và ca DP1/DP2 gọi `pha` không cờ). Lệnh người của DP3 luôn truyền `--phien`.
   Giới hạn khai: kiểm là chống nhầm, không chống giả — mã phiên là chuỗi tự khai.
5. **`tiep-tuc` không đổi `pha`.** Spec §4.2 bước 6 chỉ chuyển từ hai trạng thái ★ của DP4. Đợt `nhap` vẫn
   chờ thẻ khởi tạo; `tam-dung` là chữ người, máy không tự chạy tiếp. Bước 1 (đọc mức dùng) và phần
   `ban-giao.json` thuộc DP4.
6. **Lệnh con ghi dùng chính hàm kiểm của bên đọc** (`kiemDon`, `kiemYeuCau`, `kiemTraLoi` ở
   `hinh-dang.mjs`), và tên tệp theo đúng khuôn bộ phát lịch đọc (`xin/<dãy>-<loại>.json`,
   `yeu-cau/<dãy>-<số>.json`). Dãy suy từ worktree của cwd (`phienCuaCwd`); cwd không thuộc dãy nào → thoát
   1. Tệp ghi tay vẫn đọc được (đường đọc-cũ — đợt crm đang chạy).
7. **`kiem_moi_truong` là khoá của `dieu-phoi.config.json`**: danh sách `{ten, lenh}`; mỗi lệnh chạy ở gốc kho,
   trần 30 giây, thoát ≠ 0 hay quá trần → mục `moi-truong:<ten>` là `thieu` với dòng đầu stderr. Không
   khai → không mục nào. Bản gói đang cài khác `loi/PHIEN-BAN.json` của đợt → mục `ban-goi` `thieu` («chạy
   `chay` để chép lõi mới» — không tự chép, vì đổi lõi giữa đợt là quyết định).
8. **`LUAT.md` dạy thợ gọi lệnh con qua lõi của đợt** (`node <thư mục đợt>/loi/dieu-phoi.mjs xin s4`),
   không qua đường cache của gói: `chay` đã chép lõi vào `loi/` để nâng gói giữa đợt không rút mất mã đang
   chạy, nên đường này đứng yên suốt đợt, còn đường cache đổi theo mỗi lần nâng. `mo` thay chỗ giữ
   `{thu_muc_dot}` của khuôn bằng đường thật lúc ghép.
9. **Chỉ đánh thức hay gọi người khi CÓ việc chờ.** Spec §5 viết: phiên giám sát «không có nhịp sống …
   quá 10′» thì đẩy thông báo cho chủ kho. Nhưng nhịp sống chỉ đo hoạt động: giám sát RẢNH (không việc)
   cũng không gọi công cụ, nên chữ đó gọi người mỗi 30′ khi không có gì hỏng — lượt gọi người ngoài thiết
   kế. Chọn (dòng sổ `descope` có trích dẫn), giữ nguyên ngưỡng và trần ~30′ của spec, chỉ thêm điều kiện
   «có việc chờ»: không việc chờ → `khong`, bất kể tuổi; có việc chờ, thức cũ hơn 40′, giám sát còn nhịp
   sống trong 10′ → `nhan-giam-sat`; có việc chờ, thức cũ hơn 40′, giám sát không có nhịp sống quá 10′ →
   `bao-chu-kho`. Việc chờ là MỘT hàm dùng chung với mục `viec-cho` của `chan-doan` (AC-14): yêu cầu chưa
   trả lời · tệp chờ người · sự kiện `can_phan` sau `thuc_luc`.

## 4. Tệp trao tay mới (khuôn ở `dieu-phoi/scripts/mau/`, có marker)

| Tệp | Bên viết | Bên đọc | Khuôn |
|---|---|---|---|
| `song/<mã phiên>.json` | `song.mjs` (từ hook-nhip) | `chan-doan`, `tiep-tuc`, `danh-thuc`, bộ phát lịch | `{phien, day, worktree, luc}` — `day` null với phiên không thuộc dãy (giám sát) |
| `vai.json` (thêm) | `vai.mjs` | `chan-doan`, `danh-thuc` | `giam_sat` thêm `thuc_luc`; `lich_su[]` nhận `{phien, worktree, nhan_luc, thoi_luc}` |

Đầu ra `danh-thuc --json`: `{hanh_dong: khong|nhan-giam-sat|bao-chu-kho, phien, cau, ly_do}`, theo chỗ chọn
9: không việc chờ → `khong`; có việc chờ, thức cũ hơn 40′, giám sát còn nhịp sống → `nhan-giam-sat` với câu
«thức: chạy `/dieu-phoi:tiep-tuc --nhe`»; có việc chờ, thức cũ hơn 40′, giám sát không nhịp sống quá 10′ →
`bao-chu-kho` với câu `/dieu-phoi:tiep-tuc`.

Mục mới của `chan-doan` (thêm vào sáu mục của DP2): `giam-sat` (phiên `--phien` có phải giám sát) ·
`hook-phien` (có `song/<mã>.json` — hook của gói đã bắn trong phiên này) · `viec-cho` (danh sách việc chờ,
cũ nhất trước) · `day:<id>` mỗi dãy · `moi-truong:<tên>` mỗi lệnh kho khai · `ban-goi`.

Bộ phát lịch: khoá cấp quá 10′ mà không có nhịp sống nào của worktree giữ khoá kể từ lúc cấp → một sự kiện
`khoa-khong-nhip` `can_phan` (một lần mỗi lần cấp). Chỉ áp khi đợt có thư mục `song/` (đợt cũ im).

## 5. Đo

Ca của hàng sống ở `tests/dieu-phoi/tiep-tuc.test.mjs` (tên ca «DP3-…»), kho thử do mã sinh, đường suy từ
vị trí tệp, đồng hồ giả qua tham số. Mỗi phép đo mới có cặp hai chiều trên cùng fixture. Round-trip: hook
thật ghi nhịp → `chan-doan` thật đọc; lệnh con thật ghi đơn → bộ phát lịch thật cấp. Suite DP1 và DP2 phải
xanh nguyên, trừ ca DP2-01 nâng tập lệnh (có dòng sổ).

**Giới hạn đã khai:** tin liên phiên (§5) và việc của app (Monitor, lịch, nhóm, chip) không đo được trong
suite — CLI trả quyết định, lệnh người làm. Ngưỡng tin: đợt thử crm (~26/10) có ≥1 lần `danh-thuc` ra
`nhan-giam-sat` mà giám sát bắt đầu lượt mới; không thì mở ô.
