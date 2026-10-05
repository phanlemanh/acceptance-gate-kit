# Orchestrator–workers hai tầng — design

Gốc: crm/.acceptance-runs/dieu-phoi-1410/LUAT.md (Nhật ký 04–05/10) ·
[finding 2026-10-05](../../findings/2026-10-05-doi-phien-co-dieu-phoi.md) ·
hình: [2026-10-05-orchestrator-workers-hai-tang.html](2026-10-05-orchestrator-workers-hai-tang.html)

## 1. Điều owner muốn (máy viết lại, owner sửa nếu lệch)

Ngày 04/10, sáu phiên thợ cùng một phiên điều phối đã đưa 9 hàng lộ trình crm vào `onehub` trong
19 giờ. 12/14 merge không qua tay owner. Owner gọi mô hình này là **Orchestrator–workers**, và ngày
05/10 chọn phát triển nó theo hướng **hai tầng, phiên thợ cloud để giai đoạn 2**.

**Thành công** = đợt crm sau 14/10 chạy cùng mô hình với ba thay đổi:
- owner không phải hỏi trạng thái;
- khoá S4 không bao giờ bỏ trống khi có phiên đang chờ;
- phiên LLM điều phối chỉ tốn token cho việc cần phán đoán.

Đồng thời hai thứ không được xấu đi: số hàng gộp mỗi ngày và lượt gọi owner mỗi hàng.

Ràng buộc owner đã chốt:
- **Hướng A (05/10).** Không đổi engine kit. Mô hình được thử ở kho crm trước. Chỉ khi đo thấy tốt
  mới mở ô cho kit, và ô đó có `Gốc:` trỏ về hồ sơ crm.
- **Phiên bản.** Owner duyệt nâng Claude Code lên 2.1.289. CLI đã nâng ngày 05/10. App desktop còn
  chạy bản 2.1.286 do app tự quản (xem §9).
- **Giữ nguyên tới khi owner đổi:** chế độ quyền của các phiên và luật bảo vệ nhánh `onehub`. Cả hai
  không nằm trong đợt này.

## 2. Vì sao phải đổi (số đo 04/10)

| Triệu chứng | Số đo | Gốc rễ |
|---|---|---|
| Owner làm nhịp tim | 20/33 tin gửi điều phối là «kiểm tra» | `/loop` tự nhịp tắt hẳn khi một vòng quên hẹn giờ. Docs ghi: một wakeup dự phòng khoảng 20′, rồi loop tắt, và không về lại sau resume |
| Khoá S4 bỏ trống | Kẹt chéo 18′. Một tin tới trễ làm một phiên suýt chiếm lượt của phiên khác | Khoá được phát bằng LLM và bằng tin nhắn liên phiên. Tin có thể bị giữ chờ duyệt rồi hết hạn |
| Vi phạm khoá | 2 lần (S4 chạy chồng; giữ nhầm 39″) | Luật chỉ tồn tại bằng lời |
| Token điều phối | ≈302M token, 515 lượt gọi model: ngang một phiên thợ | LLM tự làm phần máy móc: 26 lần phát khoá, 47 lệnh canh |
| Khoá mồ côi sau sập | 2 lần app sập. Khoá phải gỡ tay | Khoá không có hạn thuê, không có tín hiệu còn sống |

Ngành rút ra cùng kết luận. Sai lầm phổ biến số 1 là «dùng LLM làm đồng hồ và bộ lập lịch».
- Refinery của Gas Town là thuật toán, không phải LLM.
- Cursor bỏ vai integrator bằng LLM vì nó gây nghẽn.

Nguồn ở finding và §12.

## 3. Kiến trúc

**Ba tầng, mỗi thứ đặt ở tầng rẻ nhất mà vẫn đúng:**

| Tầng | Giữ gì | Không làm gì |
|---|---|---|
| **Máy: bộ phát lịch** (script Node, tất định) | Khoá và hạn thuê · hàng ưu tiên · canh sức khoẻ máy · hàng merge · báo hoá cũ · bảng trạng thái · nhật ký sự kiện | Không phán đoán. Gặp gì ngoài luật thì phát `can_phan` rồi dừng ở chỗ an toàn |
| **LLM: phiên giám sát** (một phiên Claude Code) | Dựng hàng việc · duyệt nới ranh giới · xử lý `can_phan` · viết luật vào Nhật ký · gom quyết định cho owner rồi push | Không sửa mã sản phẩm · không ký cổng · không merge ngoài bộ phát lịch |
| **Người: owner** | Chốt ưu tiên, làn veto, quyền merge (một lần) · ký cổng trong phiên thợ (ADR 0002) · việc khó đảo, tiền, `sudo` | Không xếp hàng, không phát khoá, không hỏi trạng thái |

**Thợ** vẫn là phiên Claude Code cấp cao nhất, mỗi phiên trên một worktree riêng, tối đa **3–4 phiên
local**. Lý do: chỉ phiên cấp cao nhất có công cụ `Workflow`. Subagent và teammate của Agent Teams đều
thiếu `Workflow`, nên không chạy được `/feature-loop` hay S4. Agent Teams cũng chưa có trong app desktop.

**Vật chung** nằm ngoài git, trong thư mục đợt `<crm>/.acceptance-runs/dieu-phoi-<đợt>/`. Symlink
`dieu-phoi-hien-tai` trỏ tới thư mục đợt đang chạy.

| Vật | Ai ghi | Hình dạng |
|---|---|---|
| `LUAT.md` | Phiên giám sát | Luật cố định + Nhật ký chỉ nối thêm (giữ khuôn 04/10) |
| `hang-viec.json` | Phiên giám sát (owner chốt một lần) | Hàng việc dạng DAG (§4.1) |
| `khoa/<tên>/` | Bộ phát lịch cấp; thợ nhả | Thư mục `mkdir` + `chu.json` + `nhip` (§4.2) |
| `xin/<phiên>-<loại>.json` | Thợ | Đơn xin lượt; tạo theo kiểu nguyên tử |
| `su-kien.jsonl` | Bộ phát lịch | Mỗi quyết định máy là một dòng. Dòng có `"can_phan":true` là dòng đánh thức phiên giám sát |
| `yeu-cau/<phiên>-<số>.json` | Thợ | Yêu cầu có loại: phát sinh, đổi kế hoạch, hỏi người (§4.9) |
| `tra-loi/<id>.json` | Bộ phát lịch hoặc phiên giám sát | Trả lời một yêu cầu: duyệt, bác hay chuyển, ai quyết, lý do |
| `cho-nguoi/<phiên>.json` | Hook của thợ | Phiên đang chờ owner; hook tự ghi và tự xoá (§4.9) |
| `ranh-gioi-them.json` | Bộ phát lịch | Các tệp máy đã duyệt nới ranh giới (§4.9) |
| `trang-thai.json` + `bang.html` | Bộ phát lịch | Ảnh trạng thái và trang đồng hồ dựng từ nó |

**Không đường quan trọng nào đi qua tin nhắn liên phiên.** Lượt khoá, lệnh hoá cũ và lệnh merge đều
là tệp. Tin nhắn chỉ để nhắc. Lý do: owner chưa đổi chế độ quyền, nên tin vẫn có thể bị giữ rồi bỏ
sau 5′.

## 4. Thành phần

### 4.1 Hàng việc (`hang-viec.json`)

Mỗi hàng có các trường:
- `ma` (mã lộ trình), `slug`, `day` (phiên thợ phụ trách);
- `sau` (danh sách mã phải xong trước);
- `moc` (ngày hạn), `uu_tien` (số nhỏ đi trước);
- `ranh_gioi` (glob tệp được sửa), `chung_chi_them` (glob tệp chỉ được thêm dòng);
- `s4`: `local` hoặc `cloud-duoc`.

Mỗi phiên thợ có một bản ghi ở khối `day`: `id`, `worktree` (đường dẫn tuyệt đối), và `link` (liên kết
`claude://` lấy từ `list_sessions`, để trang đồng hồ mở thẳng được phiên).

Phiên giám sát dựng tệp này từ tệp lộ trình của kho, theo cách của phiên dựng lộ trình 04/10. Owner chốt
**một lần** ba thứ: ưu tiên, làn veto, quyền tự merge. Mọi lần đổi tệp về sau đều ghi một dòng Nhật ký.

### 4.2 Giao thức khoá

1. **Thợ xin lượt.** Thợ tạo `xin/<phiên>-<loại>.json` gồm `{phien, slug, loai, uoc_phut, luc}`.
   - `loai` ∈ `s4`, `ghim-lai`, `duong-nen`, `merge`.
   - Ngay sau đó thợ chạy một lệnh nền chờ lượt của mình:
     `until jq -e '.phien=="P3"' khoa/s4/chu.json >/dev/null 2>&1; do sleep 15; done`.
   - Lúc chờ không tốn token. Lệnh nền xong thì phiên thức dậy đúng lúc được lượt.
2. **Bộ phát lịch cấp lượt** khi tài nguyên trống và máy khoẻ (§4.3). Cách cấp:
   - `mkdir khoa/<tài nguyên>`, rồi ghi `chu.json` gồm `{phien, slug, loai, worktree, cap_luc, han_thue_den}`.
   - Xoá đơn xin, rồi ghi một dòng sự kiện.
   - Thứ tự cấp: hàng có `moc` sớm hơn đi trước (luật 13:40 ngày 04/10). Trong cùng mốc thì đơn đến trước
     đi trước. Ngoại lệ (luật 14:25): đơn `ghim-lai` ngắn mà mở được một merge thì chen lên trước.
3. **Hạn thuê và tín hiệu sống.** Mặc định: `s4` 90′, `ghim-lai` 40′, `duong-nen` 40′, `merge` 120′.
   - Thợ đang giữ khoá chạm tệp `khoa/<tên>/nhip` ở mỗi lời gọi công cụ, qua hook `PostToolUse`.
   - Hết hạn mà `nhip` còn mới (dưới 10′): tự gia hạn và ghi sự kiện.
   - Hết hạn mà `nhip` đã cũ: thu hồi khoá, ghi sự kiện `can_phan`.
4. **Thợ nhả lượt** bằng `rm -rf khoa/<tên>`. Bộ phát lịch thấy thì cấp lượt tiếp, trong vòng 15″.
5. **Chỉ một bộ phát lịch được chạy.** Nó giữ pidfile; bản thứ hai mở lên thấy pidfile thì thoát với
   thông điệp có tên.
6. **Bộ phát lịch chạy tách khỏi app.** Khởi động bằng `node scripts/dieu-phoi/khoi-dong.mjs`. Lệnh này
   spawn bộ phát lịch ở chế độ `detached`, tức một nhóm tiến trình riêng, nên app sập không kéo nó chết theo.
   Mỗi lần thức, phiên giám sát kiểm pidfile; tiến trình đã chết thì khởi động lại và ghi sự kiện.
   Cài dưới launchd để tự sống lại là cấu hình bền của máy, nên không làm trong đợt này: cần owner duyệt riêng.

### 4.3 Canh sức khoẻ máy

Cứ 30″ một lần, đọc `sysctl vm.swapusage`, `vm.loadavg` và tiến trình có RSS lớn nhất. Ngưỡng ghi
trong `LUAT.md`:
- **Khởi điểm:** swap dùng > 50 % hoặc > 8 GB → chế độ **giảm tải**. Không cấp lượt `s4` hay
  `duong-nen` mới; lượt đang chạy vẫn chạy tiếp; ghi sự kiện `can_phan`.
- **Một tiến trình hệ thống vượt 8 GB RSS** (ví dụ `fseventsd` 19 GB ngày 04/10) → sự kiện
  `can_phan` kèm lệnh gỡ. Lệnh cần `sudo`, nên chỉ owner chạy.

### 4.4 Hàng merge (giai đoạn 1b)

Bộ phát lịch merge một PR **chỉ khi đủ bốn điều kiện**. Đây đúng là quy trình merge trong `LUAT.md`
ngày 04/10, chuyển từ lời sang mã:
1. Hồ sơ trên đầu nhánh PR đã ký Cổng 2, hoặc máy đã thông đúng làn veto khai trong `hang-viec.json`.
   Bộ phát lịch đọc khối frontmatter của tệp, không đoán.
2. Mọi check trên đầu nhánh đều xanh, trừ danh sách bỏ qua khai trong `LUAT.md`.
3. Lượt CI chạy sau lần merge gần nhất vào `onehub`. Đây là phép so của bài học «check xanh nhưng
   cũ khi base dời».
4. Lệnh merge là `gh pr merge <n> --merge --match-head-commit <sha>`. **Không bao giờ dùng `--auto`.**
   Nhánh `onehub` không có luật bảo vệ, nên `--auto` sẽ merge ngay mà không chờ CI.

Sau mỗi lần merge, bộ phát lịch xét từng PR còn mở bằng bộ đọc hoá-cũ của kit. **Không viết lại bộ
đọc này.** PR nào hoá cũ thì ghi tệp `hoa-cu/<phiên>.json`, và thợ đó xin lượt `ghim-lai`.

**Train** (thử một chuyến trong giai đoạn 1b): khi có ≥2 PR đã ký cùng hoá cũ trên các hồ sơ chồng
nhau, bộ phát lịch ghi `can_phan`. Phiên giám sát giao một thợ dựng `train/<n>`:
- gộp `--no-ff` tối đa 4 PR;
- `repin-lane --slug …` cho mọi hồ sơ, chạy một lượt dưới khoá `s4`;
- một PR, một lượt CI;
- đỏ thì chia đôi.

Phải xác minh hai điều trước chuyến đầu:
- (i) `pre-merge-check` (không `--slug`) chạy đúng trên PR mang nhiều hồ sơ;
- (ii) PR gốc tự chuyển «merged» khi sha của nó vào `onehub`.

### 4.5 Hook chặn S4

**Đặt ở đâu.** Hook `PreToolUse` khai trong `.claude/settings.json` của crm, đã commit, nên mọi
worktree đều có.
- Khớp `Workflow` khi `scriptPath` kết thúc bằng `acceptance-verify.js`.
- Khớp `Bash` khi lệnh chứa `repin-lane`, `duong-nen.mjs` hoặc `s4-args`.

**Làm gì.** Script lấy thư mục đợt qua `git rev-parse --git-common-dir` cộng symlink `dieu-phoi-hien-tai`:
- Phiên đang giữ đúng loại khoá, và `worktree` trong `chu.json` trùng `cwd` → **cho qua**.
- Không có đợt nào đang chạy (thiếu symlink) → **cho qua**. Đây là chiều im: việc ngoài đợt không bị chặn.
- Mọi trường hợp khác → **exit 2**. stderr ghi một dòng gọi tên khoá đang thiếu, kèm cách xin lượt.

**Đóng khi lỗi.** Docs ghi rõ: hook thoát mã 1, không tìm thấy script, hay quá timeout thì lệnh vẫn
**được cho qua**. Vì vậy toàn bộ thân hook bọc `try/catch`, và lỗi nội bộ cũng thoát 2 kèm thông điệp có tên.

**Tín hiệu sống.** Cùng tệp `.claude/settings.json` khai thêm một hook `PostToolUse`. Khi phiên đang giữ
một khoá có `worktree` trùng `cwd`, hook chạm `khoa/<tên>/nhip`; khi không giữ khoá nào, hook thoát 0 ngay.

### 4.6 Trạng thái tự ghi

Bộ phát lịch suy trạng thái mỗi phiên thợ **từ vật của kit**, không từ sổ chép tay:
- khối frontmatter `status` của `contract.md`;
- độ mới của `card.html`;
- dòng cuối `run-log.jsonl`;
- PR và check trên GitHub.

Sổ chép tay `trang-thai/Pn.md` **bỏ**. Hai điều máy không suy được từ vật kit nay có kênh riêng:
- «chờ người» do hook tự ghi vào `cho-nguoi/`;
- «cần chạm tệp» đi qua yêu cầu `cham-tep` (§4.9).

Bên viết và bên đọc dùng chung một nguồn, nên hai bên không trôi khỏi nhau.

### 4.7 Phiên giám sát

Phiên giám sát thức dậy theo ba đường:
1. **Sự kiện.** Một Monitor chạy
   `tail -F su-kien.jsonl | grep --line-buffered '"can_phan":true'`, timeout 30′, hết hạn thì giăng
   lại. Monitor hết hạn cũng là một nhịp tim.
2. **Lưới an toàn.** Một task lịch của app desktop, chu kỳ 30′, `notifyOnCompletion`. Task này còn
   sống sau khi app khởi động lại, còn Monitor thì không.
3. **Tin của owner.**

Phiên giám sát **không dùng `/loop` tự nhịp**.

Khi thức dậy, phiên giám sát chỉ làm việc trong danh sách §3. Nó gom các quyết định owner đang chờ, rồi
push tối đa một lần mỗi 30′. Ngoại lệ: việc khó đảo hay chặn cả đợt thì push ngay.

### 4.8 Trang đồng hồ và hộp quyết định

Bộ phát lịch dựng `bang.html` từ `trang-thai.json` sau mỗi sự kiện, với `meta refresh` 30″, để xem
trên máy. Trang có:
- mỗi phiên thợ: hàng đang làm, bước, đang chờ gì và từ bao giờ;
- hàng `s4` và hàng merge;
- sức khoẻ máy;
- giờ nhịp cuối của bộ phát lịch và của phiên giám sát;
- **hộp quyết định**: mỗi việc chờ owner một dòng, gồm loại cổng, khuyến nghị một dòng và link mở
  thẳng phiên.

Trên điện thoại, owner nhận push qua Remote Control. Trang lộ trình artifact hiện có vẫn được dựng lại
bằng `trang/dung-trang.py` ở các mốc merge.

### 4.9 Kênh yêu cầu: phát sinh, đổi kế hoạch, hỏi người

Mọi phát sinh của phiên thợ đi qua **một kênh tệp có loại**, thay cho tin nhắn tự do:
1. Thợ ghi `yeu-cau/<phiên>-<số>.json` gồm `{id, phien, loai, hang, noi_dung, luc}`.
2. Bộ phát lịch đọc yêu cầu trong vòng 15″.
3. Câu trả lời ghi vào `tra-loi/<id>.json` gồm `{ket_qua, boi, ly_do, luc}`, trong đó `boi` ∈ `may`, `giam-sat`, `owner`.
4. Thợ chờ câu trả lời bằng lệnh nền, giống lúc chờ lượt khoá.

Tin nhắn chỉ dùng để nhắc. Phần máy kiểm được thì máy trả lời ngay. Phần cần phán thì thành `can_phan`,
đánh thức phiên giám sát tức thì, không phải chờ một vòng `/loop` (trung vị khoảng 21′ ngày 04/10).

| Loại | Ca ngày 04/10 | Máy kiểm gì | Ai quyết |
|---|---|---|---|
| `cham-tep` (xin nới ranh giới) | 6 lần: P5, P1, P6, P1 với R1d, P3 với R1f | Tệp có thuộc `ranh_gioi` của thợ khác không; có nhánh mở nào sửa nó không; có nằm trong danh sách bảo vệ không (`schema.prisma`, `migrations/`, các glob `chung_chi_them`) | Không vướng thì **máy duyệt** ngay, ghi `ranh-gioi-them.json` và một sự kiện. Vướng, hoặc kèm điều kiện kiểu «chỉ thêm biến thể», thì `can_phan` → **giám sát** |
| `viec-phu` (đề xuất chip hay việc phụ) | P7 sửa ca chập chờn; 3 chip sửa `gate-card` của kit; một chip bị mở trùng giữa P1 và phiên điều phối | Trong 24 giờ đã có yêu cầu hay chip trùng chưa (cùng kho, cùng tệp hoặc cùng tiêu đề) | **Giám sát** chọn một trong bốn: mở chip kèm lời ghi danh (§4.10); xếp thành hàng của một thợ sẵn có; ghi sổ cho kit; bác, có lý do. **Thợ không tự gọi `spawn_task`** |
| `hang-moi` (việc mới từ cổng, «Ngoài-N: mở hợp đồng mới») | Ngoài-3 của R1c giao P2; `thu-lai-sau-45-giay` giao P5 | Sổ quyết định của hồ sơ đã ghi lối «mở hợp đồng mới» do người chọn | **Giám sát** xếp chỗ: thợ nào, ưu tiên, `sau`. Owner đã quyết ở cổng nên không bị hỏi lại |
| `chuyen-hang` (việc rơi vào vùng của thợ khác) | R1m-7 chuyển từ P2 sang R1d của P1 | Tệp của việc nằm trong `ranh_gioi` của thợ nào. Máy gợi ý thợ đó | **Giám sát** |
| `s4-gom`, `gia-han` (gộp hai việc nặng vào một lượt; xin giữ thêm) | P4 gộp hai việc lúc 04:45; P3 giữ thêm 15–20′ khi E20 đỏ | Ước tính có trong trần chính sách không: ≤ 60′ khi có người chờ; gia hạn tối đa bằng ước tính ban đầu | Trong trần thì **máy**; vượt trần thì **giám sát** |
| `can-nguoi` (việc ngoài cổng, chỉ người làm được) | `sudo killall fseventsd`; nạp tín dụng Gateway; chọn model đo GLM hay Gemini | — | Vào **hộp quyết định** của owner. Giám sát gom rồi push theo §4.7 |
| `khac` | Mọi thứ không vừa loại nào | — | `can_phan` → **giám sát**, như phiên điều phối 04/10 |

**Chờ người, ghi tự động.**
- Hook `Notification` của phiên thợ, với `matcher` `idle_prompt\|permission_prompt`, ghi
  `cho-nguoi/<phiên>.json` gồm `{loai, tin, luc, link}`.
- Bộ phát lịch đọc vật của kit để biết đó là thẻ cổng nào hay một câu hỏi giữa vòng.
- Phiên còn đơn trong `xin/` là đang chờ lượt khoá, không phải chờ người. Lý do: `idle_prompt` không
  phân biệt hai trường hợp này.
- Hook `UserPromptSubmit` xoá tệp ngay khi owner trả lời.

Hộp quyết định ở §4.8 lấy dữ liệu từ đây. Owner không phải nhờ ai chuyển lời kiểu «P5 đã duyệt thiết kế».

**Owner đổi kế hoạch.** Owner nói với **một chỗ duy nhất** là phiên giám sát. Phiên giám sát sửa
`hang-viec.json` và ghi Nhật ký; bộ phát lịch áp từ nhịp kế tiếp. Danh sách PR owner cho đi qua hàng merge
cũng là một trường trong `hang-viec.json` (ví dụ #263–#266 ngày 05/10).

**Owner merge tay** (#255, #249) được bộ phát lịch phát hiện trong ≤ 60″. Khi nhánh `onehub` dời bởi một
merge không có trong hàng, bộ phát lịch:
- xét lại hoá cũ của mọi PR đang mở;
- đọc check Acceptance trên đỉnh mới; nếu đỏ thì phát `can_phan` ngay.

Ca #249 ngày 05/10: phiên điều phối chỉ thấy nhánh đỏ khoảng 50′ sau khi gộp.

### 4.10 Ghi danh phiên mới

- **Chip do phiên giám sát mở.** Lời dặn kèm theo luôn có thư mục đợt, mã phiên (P7…), ranh giới, và câu
  «đọc `LUAT.md` trước S1». Phiên giám sát ghi phiên đó vào `hang-viec.json` **trước** khi owner bấm chip.
- **Phiên mở ngoài đợt** (như tat-preview ngày 04/10) vẫn bị hook §4.5 chặn S4 khi đợt đang chạy. Thông
  điệp chặn chỉ đường ghi đơn vào `xin/`, nên phiên tự ghi danh đúng lúc nó cần tài nguyên chung.
- **Phiên ở kho khác** (như vòng sửa kit ngày 04/10) không chịu hook của crm, nhưng vẫn tiêu RAM và CPU
  của cùng máy.
  - Canh sức khoẻ §4.3 đã bao phần này.
  - Muốn chặn S4 xuyên kho thì phải đặt hook ở mức user. Đó là cấu hình bền, nên owner duyệt riêng.

## 5. Giai đoạn

| Giai đoạn | Gồm | Điều kiện qua |
|---|---|---|
| **1a**, trước khi mở đợt | Bộ phát lịch (§4.2, §4.3, §4.6, §4.8) · hook chặn S4 · phiên giám sát kiểu §4.7. Merge vẫn qua phiên giám sát như 04/10 | Test §7 xanh ở cả hai chiều. Chạy thử một ngày với 3 thợ |
| **1b**, giữa đợt | Bộ phát lịch tự merge (§4.4) · báo hoá cũ · một chuyến train | Đã có ≥3 merge qua phiên giám sát mà bộ phát lịch ở chế độ «chỉ đề xuất» đề xuất đúng cả 3 |
| **2**, sau 1b | Một lượt S4 chạy thử trên phiên cloud. Cần: skill kit commit vào `.claude/skills/` của crm hoặc cài qua Project settings; cài Playwright trong setup script; mở mạng tải trình duyệt; kiểm giới hạn lệnh 10′ | Lượt chạy thử ra cùng verdict với lượt local trên cùng sha. Khi đó các hàng `s4: cloud-duoc` mới đi phiên thợ cloud (`claude --cloud`) |
| **3**, sau đợt | Đếm §6. Nếu đạt: mở ô cho kit (khuôn H1, khoá S4 trong engine H2, trạng thái tự ghi H4), `Gốc:` trỏ hồ sơ crm | Luật «ô chỉ mở khi có neo ngoài» |

Spec này là **thiết kế phương pháp** và sống ở kho kit, cạnh finding. Phần dựng nằm ở crm:
- Mã giai đoạn 1 ở `scripts/dieu-phoi/`, hook ở `.claude/settings.json`.
- Làm bằng một vòng `/feature-loop` của crm, có hợp đồng và kế hoạch riêng, dẫn tới spec này.
- Hồ sơ của vòng đó là neo cho giai đoạn 3.
- Không chen vào làn R1 trước 12/10.

## 6. Thước đo của đợt thử

So với ngày 04/10. Máy đo bằng `su-kien.jsonl` và cùng script đếm token đã dùng ở finding.

| # | Thước | 04/10 | Mục tiêu |
|---|---|---|---|
| 1 | Tin owner hỏi trạng thái mỗi ngày | 20 | ≤ 2 |
| 2 | Phút khoá `s4` trống khi còn đơn xin | ≥ 18 | 0 |
| 3 | Lần S4 hay ghim lại chạy không giữ khoá | 2 | 0 (hook chặn, có dòng log) |
| 4 | Token LLM của tầng điều phối mỗi ngày | ≈ 302M | ≤ 100M |
| 5 | PR phải ghim lại riêng / PR gộp | 10/12 | giảm; đo từ giai đoạn 1b |

**Đo thêm, chưa có số nền:** thời gian từ lúc thợ ghi yêu cầu tới lúc có trả lời, tách hai nhánh: máy
quyết và giám sát quyết.

**Không được xấu đi:** số hàng gộp mỗi ngày (04/10: 9 hàng trong 19 giờ) và lượt gọi owner mỗi hàng
(04/10: 4,7).

**Chiều đỏ của chính thước đo:** sau một ngày đủ của giai đoạn 1a, nếu thước 1–3 không tốt hơn
04/10 thì tắt bộ phát lịch, quay về cách 04/10 (§8), và ghi kết luận vào finding.

## 7. Kiểm thử

Theo luật kit: không có assertion chỉ âm tính; mỗi phép đo phải thử hai chiều; fixture do mã sinh.

- **Lập lịch** (thuần, không I/O):
  - thứ tự theo `moc`, rồi theo giờ xin;
  - ngoại lệ `ghim-lai` mở merge được chen lên;
  - hạn thuê: gia hạn khi `nhip` mới, thu hồi khi cũ;
  - giảm tải: không cấp lượt mới, nhưng giữ lượt đang chạy.
- **Phát lại ngày 04/10:**
  - Dựng chuỗi đơn xin và lần nhả từ Nhật ký 04/10, cho chạy qua bộ lập lịch.
  - Kỳ vọng: không phút nào khoá trống khi còn đơn.
  - Đối chứng: chạy chuỗi ấy bằng luật «tự nhường» của 04/10 thì phải tái hiện được quãng kẹt.
- **Hook chặn S4**, ba ca so đúng thông điệp chứ không chỉ mã thoát:
  - chưa có lượt → exit 2;
  - có lượt đúng worktree → 0;
  - không có đợt, hoặc lệnh không phải S4 → 0.

  Cộng một ca tiêm lỗi nội bộ: hook phải thoát 2, không được cho qua.
- **Hàng merge** (`gh` giả lập):
  - mỗi điều kiện trong bốn điều kiện ở §4.4 thiếu thì không merge;
  - đủ cả bốn thì lệnh đúng `--match-head-commit`;
  - không bao giờ sinh `--auto`.

  Một mutant xoá điều kiện 3 phải làm ca «CI cũ» đỏ.
- **Chiều im:** chạm `LUAT.md`, sổ hay tệp ngoài đợt thì không sinh sự kiện merge hay thu hồi khoá nào.
- **Kênh yêu cầu (§4.9):**
  - `cham-tep` với tệp không ai giữ → máy duyệt.
  - Ba ca đỏ, mỗi ca phải so đúng lý do: tệp nằm trong ranh giới của thợ khác; nằm trong một nhánh mở;
    nằm trong danh sách bảo vệ. Cả ba phải ra `can_phan`.
  - `viec-phu` trùng trong 24 giờ → gộp làm một, không sinh `can_phan` thứ hai.
  - Phiên có đơn trong `xin/` mà `idle_prompt` bắn → không vào hộp quyết định (chiều im).
  - Hook `UserPromptSubmit` xoá đúng tệp `cho-nguoi` của phiên đó.

## 8. Đường lùi

Tắt bộ phát lịch (`kill <pid>`), xoá symlink `dieu-phoi-hien-tai`. Khi đó:
- hook rơi về chiều im;
- `LUAT.md` và thư mục khoá vẫn dùng được theo cách 04/10;
- phiên giám sát phát khoá bằng tay như phiên điều phối cũ.

Không có trạng thái nào chỉ nằm trong bộ phát lịch. Mọi thứ đều nằm trên đĩa.

## 9. Giới hạn đã khai, kèm ngưỡng đang đếm

- **Bộ phát lịch là điểm hỏng chung mới.**
  - Chữa: test §7 và nguyên tắc «gặp gì lạ thì `can_phan`».
  - Ngưỡng: ≥1 lần bộ phát lịch cấp sai khoá hoặc merge sai → tắt tự merge, quay về merge qua phiên
    giám sát cho tới khi có test tái hiện lỗi đó.
- **App desktop còn chạy Claude Code 2.1.286 do app tự quản.** CLI trên PATH đã là 2.1.289. Trước bản
  2.1.288, lệnh nền của phiên desktop có giới hạn thời gian. Chưa cập nhật app thì lệnh nền chờ lượt
  phải tự giăng lại mỗi ≤ 25′. Mods cũng chưa dùng được trong app.
  - Ngưỡng: cập nhật app (Claude → Check for Updates) vào một lúc không phiên nào đang chạy S4.
- **Tin liên phiên vẫn có thể bị giữ**, vì owner giữ nguyên chế độ quyền. Thiết kế đã né: không đường
  quan trọng nào đi qua tin.
  - Ngưỡng mở lại: ≥2 lần một phiên thợ lỡ việc vì tin bị bỏ.
- **Nhánh `onehub` không có luật bảo vệ**, nên merge tay vẫn có thể vào khi check đỏ (ca #249).
  - Ngưỡng mở lại: ≥1 lần nữa nhánh `onehub` đỏ vì một merge ngoài hàng.
- **`start_session` bị khoá sau cờ tính năng.** Mở phiên thợ local vẫn cần owner bấm chip, một lần
  cho mỗi phiên thợ. Thợ vẫn làm tuần tự các hàng trong dãy của mình, nên không phải bấm theo từng hàng.
- **Tầng điều phối không gỡ được ba thứ:**
  - S4 local vẫn chỉ có một khe;
  - lượt gọi owner sinh ra ở vòng làm việc (H3, dừng-vá, mở lại phạm vi);
  - owner vắng ban đêm.

  Giai đoạn 2 nhắm vào thứ nhất; H3 là việc của kit.

## 10. Ngoài phạm vi

Không làm trong đợt này:
- **Agent Teams:** teammate thiếu `Workflow`, Agent Teams chưa có trong app desktop.
- **Projects (beta):** theo dõi; đánh giá lại khi tài khoản có tính năng này.
- **Mods:** chờ app lên ≥2.1.287.
- **Merge queue bên ngoài (Mergify…):** không gỡ được thuế ghim lại, và cấp quyền ghi cho bên thứ ba.
- **Mọi thay đổi engine kit.**

## 11. Dự báo năm dòng số (luật chiều rộng c)

| Dòng | Dự báo | Vì sao |
|---|---|---|
| Làm-xong → quyết-được | = | Thẻ cổng không đổi. Hộp quyết định rút ngắn lúc owner tìm thẻ, nhưng thời gian ký không đổi |
| Lượt gọi người mỗi vòng | ↓ (ngoài thiết kế) | Mất 20 tin «kiểm tra». Lượt trong thiết kế không đổi |
| Vòng bị hạ tầng kit đốt lượt | ↓ | Hook chặn S4 chạy chồng. Canh sức khoẻ tránh sập |
| Token máy mỗi vòng | ↓ | Tầng điều phối từ ≈302M xuống mục tiêu ≤100M mỗi ngày |
| Phút máy mỗi lượt chấm | = | S4 local vẫn tuần tự. Chỉ giảm khi tới giai đoạn 2 |

**Điều kiện tin cậy:** đường verdict (S4 → REJECT/PASS) không đổi thành phần, vì bộ phát lịch không
chấm gì.

## 12. Nguồn

- **Docs Claude Code** (đọc 05/10, bản 2.1.289): agent-teams · sub-agents · cross-session-messaging ·
  workflows · hooks · scheduled-tasks · desktop · claude-code-on-the-web · cloud-environments ·
  claude-projects · remote-control · CHANGELOG 2.1.284–2.1.289.
- **GitHub:** docs điều kiện của merge queue; mã nguồn `gh pr merge`; cấu hình `crm-onehub` đọc qua API
  ngày 05/10.
- **Anthropic engineering:** building-effective-agents · multi-agent-research-system ·
  effective-harnesses-for-long-running-agents · harness-design-long-running-apps.
- **Hệ khác:** Gas Town (repo `steveyegge/gastown`; bài DoltHub 15/01/2026) · Cursor «scaling agents»
  (14/01/2026) · Google Research «scaling agent systems» (28/01/2026).
