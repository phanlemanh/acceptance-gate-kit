# Hạt giống — năm lỗi kit từ đợt Điều phối – Thợ `lo-trinh-tin-hieu` của crm (kit 2.33.0, 19–20/10)

**Ngày:** 2026-10-20 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** TRỪ trước (sửa lỗ của bộ máy đang có;
không khoá bắt buộc mới, không đổi mặc định của kho nào).
Gốc: crm-onehub `.acceptance-runs/dieu-phoi-lo-trinh-tin-hieu/` — đợt Điều phối – Thợ thật đầu tiên chạy kit 2.33.0
(ba dãy L1 · S1 · F1, máy MacBook Pro, 19/10 13:12Z → 20/10). Bằng chứng: `su-kien.jsonl` (198 dòng), `vai.json`,
`yeu-cau/` + `tra-loi/` (F1-5, F1-7, F1-8, F1-11). Chủ kho duyệt «gom các lỗi kit của đợt thành một việc ở kho kit»
ngày 20/10; luật kho crm: lỗi kit sửa ở kho kit, không vá tại chỗ.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

Đây là đầu vào của mốc lộ trình kit **«Tinh chỉnh sau hai đợt thử» (05/11)** — mốc khai «hàng sinh từ đợt thử, mở khi
có neo», hiện chưa có hàng nào. Neo đã có (đợt thật vấp, có sự kiện); hàng chỉ cắt khi mốc mở hoặc owner gọi tên
(luật chiều rộng (b) — kho đang đóng băng meta-work). Gộp theo đợt, không theo lớp: lỗi 1–3 ở gói `dieu-phoi`,
lỗi 4–5 ở lệnh giữ tươi và lưới trước-gộp của `feature-loop`.

---

## 1. Mã phiên của app và mã phiên của CLI lệch nhau — giám sát bị báo «không có nhịp sống» giả

**Người dùng gặp gì.** Chẩn đoán đợt báo `hook-phien thieu` («hook của gói chưa bắn trong phiên này») dù hook chạy
bình thường; lệnh đánh thức sẽ báo chủ kho «giám sát không có nhịp sống — chạy lại vai giám sát» trong khi giám sát
đang làm việc. Một lượt gọi người ngoài thiết kế, sinh từ hạ tầng.

**Gốc trong mã.** `dieu-phoi/commands/tiep-tuc.md` bước 1 và `ban-giao.md` bước 1 dặn «lấy mã phiên này bằng công cụ
phiên của app» rồi truyền `--phien` (mã app `local_<uuid>`); `mo-dot.md` bước 2 dặn `--phien <mã phiên này>` không nói
mã nào. Còn hook `hook-nhip.mjs` (`ghiSong`) ghi `song/<session_id>.json` theo `session_id` của CLI (trùng tên tệp
transcript / thư mục scratchpad). `chan-doan.mjs` (dòng ~83) và `danh-thuc.mjs` (dòng ~23) tìm `song/<vai.giam_sat.phien>.json`
— tức tìm bằng mã app một tệp mang tên mã CLI.

**Tái hiện.** Mở đợt theo đúng lệnh `/dieu-phoi:mo-dot` với `--phien local_<uuid>`; gọi một công cụ bất kỳ trong kho
(hook ghi `song/<uuid CLI>.json`); chạy `chan-doan --json --chi-tiet --phien local_<uuid>` → mục `hook-phien` là `thieu`.
Đợt crm: `vai.json` giữ `lich_su[0].phien = local_08e4…` (13:12Z) rồi `giam_sat.phien = 17909e8f-…` (13:24Z) sau khi
giám sát nhận lại vai bằng mã CLI; `song/` chỉ có tệp mang mã CLI.

**Cách lách đã dùng.** `tiep-tuc --phien <session_id CLI> --json` để nhận lại vai bằng mã CLI (lấy từ đường scratchpad
hoặc tên tệp trong `song/`). Cái giá chưa đo: lối `nhan-giam-sat` của đánh thức gửi tin liên phiên tới `phien` — mã CLI
không phải mã mà công cụ tin liên phiên của app nhận, nên lách xong thì chiều nhắn giám sát có thể hỏng.

**Đề xuất.** Vai giữ HAI mã tách bạch: mã app (để nhắn) và mã CLI (để đọc nhịp). Lệnh nhận vai nhận mã app như lời dặn
hiện tại, rồi tự suy mã CLI từ nhịp sống mới nhất mang đúng worktree của phiên — đúng một ứng viên thì điền và in lại,
nhiều ứng viên thì báo đúng tên các ứng viên, không đoán. Chẩn đoán và đánh thức đọc nhịp bằng mã CLI, nhắn bằng mã app.
Chiều đỏ: ca dựng đợt với vai mang mã app + `song/` mang mã CLI cùng worktree → chẩn đoán `du`, đánh thức không báo chủ
kho; đối chứng: không tệp nhịp nào cùng worktree → `thieu` như cũ.

**Kho không có sự cố được gì, mất gì.** Mọi kho chạy đợt đều đi qua lời dặn này, nên mọi kho đều có sự cố — không kho
nào mất hành vi đang dựa. Vai cũ một mã: đọc khoan dung (mã khớp tệp nhịp nào thì dùng làm mã CLI) + cờ vàng.

---

## 2. Thợ đứng chờ khoá lâu bị coi «không còn phiên sống» — được mời mở chip trùng, mất lượt đầu hàng

**Người dùng gặp gì.** Thợ xin khoá rồi đứng chờ (không gọi công cụ) quá 10′ thì `tiep-tuc` xếp dãy là «không còn
phiên sống — mở chip», tức mời giám sát mở một phiên thứ hai cho cùng dãy; giám sát làm theo thì hai phiên cùng một
worktree. Theo báo cáo của giám sát đợt, đơn s4 đang đứng đầu hàng của F1 bị bỏ qua và lượt đi sang S1.

**Gốc trong mã.** DP10 (`dieu-phoi-khoa-day-giu-nhip`) đã dạy bộ phát lịch coi nhịp khoá (`khoa/<tài nguyên>/nhip`, do
`giu-nhip.mjs` → `chamNhip` chạm) là dấu sống cho khoá ĐANG GIỮ. Nhưng hai chỗ vẫn chỉ đọc `song/<phiên>.json`, mà tệp
này chỉ ghi khi phiên có lời gọi công cụ: (a) `xetDay` trong `tiep-tuc.mjs` — dãy không giữ khoá, có đơn trong `xin/`,
nhịp sống cũ hơn `NGUONG_SONG_MS` (10′) → `mo-chip`; (b) lối chờ khoá chưa được cấp không có gì chạm nhịp — `giu-nhip`
chỉ chạm khoá đã có chủ. Lỗ (a) là cùng lớp DP10, chưa áp sang bộ xét dãy.

**Tái hiện.** Đợt có thư mục `song/`; dãy X đặt đơn `xin/X-…json` cho s4 trong khi s4 đang bị dãy Y giữ; X không gọi
công cụ 11′; chạy `tiep-tuc --json` → dãy X mang `hanh_dong: mo-chip`. Đợt crm: F1 giữ khoá `merge` cho
`chu-thich-glob-md` từ 04:28Z, bị `thu-hoi` lúc 06:28Z («hết hạn thuê, nhịp cũ»); s4 cấp cho S1 lúc 06:58Z và 07:46Z;
F1 ghi danh lại worktree mới lúc 07:42Z. (Thứ tự đơn đã bị dọn khỏi `xin/` nên chuỗi «đơn đầu hàng bị bỏ qua» chỉ dựng
lại được từ lời giám sát và sự kiện, không từ tệp đơn.)

**Cách lách đã dùng.** Thợ chạy một vòng nền gọi `hook-nhip.mjs` với `{session_id, cwd}` mỗi phút suốt lúc chờ — tức
giả lời gọi công cụ để có nhịp sống. Giám sát thấy `mo-chip`/`nhan-giang-lai` cho dãy mà phiên còn trong nhóm đợt thì
nhắn phiên ấy, không mở phiên trùng.

**Đề xuất.** Một dấu sống cho «đang chờ khoá»: lệnh chờ khoá của thợ (bọc bằng `giu-nhip` như lượt dài) chạm một nhịp
của ĐƠN (ví dụ `xin/<đơn>.nhip`), và `xetDay` coi «dãy có đơn đang chờ với nhịp đơn tươi» là còn sống — cùng hình dạng
lời giải DP10, không thêm khoá cấu hình. Chiều đỏ: ca dựng đúng ca tái hiện có nhịp đơn tươi → `nhan-giang-lai` hoặc
`khong`, không `mo-chip`; đối chứng: nhịp đơn cũ quá ngưỡng → `mo-chip` như cũ (thợ chết thật vẫn được mở lại).

**Kho không có sự cố được gì, mất gì.** Kho không chờ khoá lâu: không đổi gì. Mất: thợ chết khi đang chờ mà tiến trình
nền còn chạy thì được coi sống tới khi tiến trình nền chết — cùng giới hạn đã khai của DP10.

---

## 3. Hàng T1 không có hồ sơ không bao giờ «xong» — dãy kẹt ở hàng đã gộp

**Người dùng gặp gì.** F36 (`chu-thich-glob-md`, chỉ sửa chú thích, đi T1 nên không mở hồ sơ) xong ở PR, hook trước-đẩy
xanh, đã xin gộp; nhưng bộ phát lịch ba lần trả lời «nhịp chưa thấy `chu-thich-glob-md` xong». Thợ phải gửi yêu cầu
loại `khac` (F1-7, chặn), giám sát phán tay và đẩy hàng F35 lên trước F36 (`doi-ke-hoach day-len` 08:27Z) — một lượt
gọi giám sát ngoài thiết kế, và hàng F36 vẫn nằm trong kế hoạch như chưa làm.

**Gốc trong mã.** `tienDoCua` (`dieu-phoi/scripts/phat-lich.mjs`, dòng ~288) chỉ biết tiến độ qua
`_acceptance/<slug>/contract.md`: trên nhánh chính mang trạng thái đã thông → `gop`; trong worktree dãy → `ky`/`dang`;
không có tệp → `chua`. Hàng T1 không bao giờ có contract, nên mãi là `chua`; `chonHangKe` không có hàng `dang` nào nên
trả lại chính hàng đó như hàng chưa bắt đầu. Cùng họ với hạt giống
`docs/plans/2026-10-17-hat-giong-hang-lo-trinh-thieu-slug-bao-nham-chua-xong.md` (bộ suy trạng thái của lộ trình rơi về
«chưa mở» im lặng khi không có hồ sơ) và mục 4 của `docs/plans/2026-10-10-hat-giong-loi-dieu-phoi-chuyen-nguyen-tu-crm.md`
(tập «đã gộp» đọc từ một chỗ hẹp).

**Tái hiện.** Đợt có một hàng `slug: x` không có `_acceptance/x/`; gộp một PR của nhánh dãy vào nhánh chính; chạy một
nhịp bộ phát lịch → `tiep/<dãy>.json` vẫn trỏ `x`, không có sự kiện `hang-gop` cho `x` (đợt crm: có `hang-gop` cho F26,
LT3, TH5; không có cho F36).

**Cách lách đã dùng.** `hang day-len F35 --truoc F36` (đẩy hàng kế lên trước hàng kẹt).

**Đề xuất.** Hàng không có hồ sơ được xét «gộp» bằng một bằng chứng khác hồ sơ, đọc từ MỘT nguồn: PR của nhánh dãy
mang mã hàng đã gộp vào nhánh chính (bộ phát lịch đã dò PR mở cho luật chạm tệp), hoặc khai tường minh `t1: true` ở
hàng thì xét theo nhánh đã gộp. Không tự xếp «xong» khi không dò được — lúc ấy cờ vàng «hàng không hồ sơ, chưa thấy
PR gộp» thay cho im lặng. Chiều đỏ: ca hàng không hồ sơ + PR đã gộp → `gop` và một sự kiện `hang-gop`; đối chứng: PR
còn mở → không `gop`.

**Kho không có sự cố được gì, mất gì.** Kho mọi hàng đều có hồ sơ: không đổi gì. Mất: một lần dò PR cho hàng không
hồ sơ mỗi nhịp (đã có kênh dò sẵn).

---

## 4. Lệnh giữ tươi không nhắm được một hồ sơ — muốn một dòng nền cho một hồ sơ phải kéo cả trăm

**Người dùng gặp gì.** Hồ sơ tồn đọng `dot-hoi-y-tuong-okr` cần một dòng `nen-do` (để vòng khác đọc được nhãn «đỏ sẵn
trên nền» thay vì bị chặn). Lệnh giữ tươi không có cách nói «chỉ hồ sơ này»: phải chọn khoảng `<từ>` lùi về trước lúc hồ
sơ hoá cũ, và khoảng ấy kéo theo khoảng 139 hồ sơ khác — ước ~8 giờ máy (số của giám sát đợt, chưa đo lại ở đây).

**Gốc trong mã.** `feature-loop/scripts/giu-tuoi.mjs`: `KNOWN = root, tu, den, write, json, ag-root` — không có `--slug`.
Bước 1 chọn = cũ-ở-đỉnh − cũ-ở-`<từ>`; hồ sơ cũ ở cả hai đầu là TỒN ĐỌNG: chỉ in tên, không ghim, không quy về PR, không
ghi `nen-do`. Một lượt thật của chính đợt (khoảng `be5151e..4206083`, nhật ký giữ ở ghi chú phiên) in 8 hồ sơ cũ vì
khoảng và **263 hồ sơ tồn đọng không ghim**. Lối ghim riêng đã có ở `repin-lane.mjs --slug … --tung-ho-so`, nhưng lối
ấy không quy cái đỏ về PR và không ghi `nen-do` — phần đó chỉ giữ tươi làm.

**Tái hiện.** Kho có hồ sơ A đã ký cũ từ trước `<từ>`; chạy `giu-tuoi.mjs --root . --tu <từ> --write` → A nằm trong
«tồn đọng», run-log của A không thêm dòng nào; lùi `<từ>` cho tới khi A rơi vào tập chọn → tập chọn gồm mọi hồ sơ hoá
cũ trong khoảng dài ấy.

**Cách lách đã dùng.** Không dùng lối kéo cả trăm hồ sơ; F35 tách nhóm, chủ kho chọn ghim lười (mục 5).

**Đề xuất.** `--slug <s>` lặp được: thu tập chọn về giao của tập chọn với danh sách đã cho, và cho phép hồ sơ TỒN ĐỌNG
có tên trong `--slug` đi qua bước 2–4 (ghim, quy về PR trong khoảng, ghi `nen-do`) — mặc định không cờ giữ nguyên hành
vi. Chiều đỏ: ca hai hồ sơ cũ vì khoảng + một tồn đọng, `--slug` tồn đọng → chỉ hồ sơ ấy được chạy và có đúng một dòng
`nen-do` khi đỏ; đối chứng: không cờ → tập chọn và tồn đọng như cũ.

**Kho không có sự cố được gì, mất gì.** Cờ bật theo lựa chọn, không đổi mặc định — không kho nào mất hành vi đang dựa.

---

## 5. Hồ sơ đã ký bị coi «cũ» hàng loạt — dọn hết tốn ~21,6 giờ máy cho 0 kết quả ship

**Người dùng gặp gì.** Ở crm, lưới trước-gộp coi **281/299** hồ sơ đã ký là cũ; **77** trong số đó cũ vì có eval không
khai `paths` (số của dãy F1 trong hàng F35 `don-ho-so-cu`, yêu cầu F1-8 và F1-11). Ước dọn hàng loạt ~21,6 giờ máy mà
không kết quả nào tới tay người dùng. Chủ kho đã chọn **ghim lười**: mỗi PR tự ghim lại hồ sơ nó chạm, nhóm 77 tách
thành hàng riêng «khai `paths` còn thiếu» (judgment khai bằng `inputs`).

**Gốc trong luật.** Với `risk_tiers.stale_scope: paths` (crm bật), bộ lọc chỉ BỚT tệp khi MỌI eval máy của hồ sơ khai
`paths` chứng được (GUIDE §«Hoá cũ theo `paths`», 2.21 + 2.24): một eval thiếu `paths` là CẢ hồ sơ rơi về luật cũ —
cũ sau mọi lần gộp chạm mã ngoài `_acceptance/`. Eval judgment không có `paths` theo khuôn, nên hồ sơ có eval judgment
gần như luôn rơi về luật cũ. Charter re-pin theo release (CLAUDE.md, GUIDE §7.1) đã nói «hồ sơ cũ giữa hai release là
trạng thái chấp nhận được» — nên số 281 không phải nợ phải trả ngay; nhưng lưới vẫn in nó như vi phạm, và mọi lệnh đọc
lưới (giữ tươi, thẻ, bản đồ) kéo nó theo.

**Câu hỏi gốc cho kit (chưa phải đề xuất chốt).**
- (a) Bộ lọc `paths` có nên xét THEO TỪNG EVAL thay vì cả hồ sơ: eval có `paths` chứng được thì lọc theo nó, chỉ eval
  thiếu `paths` mới giữ luật cũ — và hồ sơ chỉ cũ khi một eval của nó cũ? Cùng hướng với
  `docs/plans/2026-10-18-hat-giong-nen-do-xet-theo-tung-eval.md` (dòng nền xét theo cả hồ sơ).
- (b) Eval judgment có nên được đọc `inputs` như `paths` (đúng điều crm định khai tay ở hàng riêng)? Nghiệm đúng tầng
  ở kit thì mọi kho có judgment hưởng, không kho nào phải khai trùng.
- (c) Ghim riêng một hồ sơ: lối ghim đã có (`repin-lane.mjs --slug`); thứ thiếu là giữ tươi cho một hồ sơ (mục 4).
- (d) Lưới có nên tách «cũ vì PR này» (chặn) khỏi «cũ tồn đọng» (đếm, không chặn) khi kho khai ghim lười — để số tồn
  đọng không làm ồn mọi lượt đọc?

**Cách lách đã dùng.** Ghim lười (PR nào chạm hồ sơ thì tự ghim lại hồ sơ ấy) + hàng crm riêng khai `paths` cho nhóm 77.

**Phép thử trước khi chọn nghiệm** (luật 26/09 «sửa kit vì sự cố một kho phải cân trên mọi kho»): đo trước→sau trên các
kho đang cài — số hồ sơ cũ ở đỉnh, dưới luật hiện tại và dưới (a)/(b), cùng số hồ sơ mà nghiệm mới coi là tươi nhưng
eval thật đỏ khi chạy lại (chiều đỏ của việc nới). Nghiệm nới phạm vi «cũ» là đổi mặc định của mọi kho có bật
`stale_scope: paths` → đi sau bộ đọc khoan dung + cờ vàng theo đúng thứ tự chọn nghiệm.

---

## Ngưỡng mở thành ô

Mục 1–3 và 4: neo đã có (đợt thật vấp, có sự kiện) → cắt hàng ở mốc «Tinh chỉnh sau hai đợt thử» 05/11, hoặc sớm hơn
khi owner gọi tên, hoặc khi đợt thử thứ hai (OneFlow hay crm) vấp lại một trong bốn lỗ. Mục 5: mở khi ≥ 1 kho tiêu thụ
thứ hai có tỉ lệ hồ sơ đã ký cũ > 50 % dưới `stale_scope: paths`, hoặc khi hàng crm «khai `paths` còn thiếu» xong mà tỉ
lệ ở crm vẫn > 50 % — tức khai tay không đủ và câu hỏi (a)/(b) là của kit.

**Người hưởng:** giám sát và thợ của mọi đợt Điều phối – Thợ (mục 1–3: bớt lượt gọi giám sát/chủ kho sinh từ hạ tầng),
người vận hành giữ tươi (mục 4), mọi kho bật `stale_scope: paths` (mục 5: số «cũ» đọc được thành hành động).
