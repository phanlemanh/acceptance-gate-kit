# Bốn vòng chấm của `nen-shadcn` (radar) — lợi ích trên chi phí, và tám bài học gửi kit

> Owner hỏi 21/09, sau vòng chấm 4 của hồ sơ `nen-shadcn` ở kho `radar` (T3, rút Geist, nền là preset
> shadcn + token ReUI): *kiểm tra và đánh giá lợi ích trên chi phí (thời gian, token)*, rồi *rút ra bài
> học gửi kit*. Số đọc từ `usage` của bốn lượt Workflow S4, `run-log.jsonl`, `decisions.jsonl` và
> `git log` của nhánh `worktree-nen-shadcn` (mốc rẽ `5859ef6`). Token của phiên chính **không có số đo**
> nên không ước.

## 0. Một đoạn

Bốn vòng chấm tốn **~9,2 triệu token hội đồng** và **~2 giờ 45 chờ chấm**, cộng ~1 giờ 20 máy sửa và
**4 lượt gọi người** (một quyết định phạm vi, hai lượt duyệt lại Cổng 1, một lối ra khi chạm trần
thước). Vòng 1–2 đáng tiền: 2 lỗi màu người dùng thấy, 1 lỗi quản trị (máy tự nới một AC đã ký), và
một lưới tương phản trước đó đo **0 cặp** mà vẫn xanh. Vòng 3–4 gần như không: **mọi** mục trong hợp
đồng đều là câu chữ máy tự viết sai — 0 lỗi sản phẩm mới. Trong khi đó, **hai phát hiện giá trị nhất**
(câu báo lỗi mất màu đỏ; một phép kiểm sẽ đỏ vĩnh viễn trên CI sau khi gộp) bị luật «ngoài hợp đồng
thì không sửa» giữ nguyên suốt bốn vòng, và chỉ được sửa khi owner nới phạm vi bằng tay.

## 1. Số

| Vòng | Chờ chấm | Token hội đồng | Mục trong HĐ | Do lượt sửa trước của máy đẻ ra | Lỗi sản phẩm mới |
|---|---|---|---|---|---|
| 1 | 30 ph | 2,80 M | 8 | — | 1 (khung cảnh giới 1,91:1) |
| 2 | **74 ph** | **3,65 M** | 5 | 3 | 1 (chữ phụ màn Đăng nhập 4,48:1) |
| 3 | 36 ph | 1,50 M | 1 + E10b đỏ | 2/2 | 0 |
| 4 | 25 ph | 1,25 M | 1 + E10b đỏ | 2/2 | 0 |
| **Σ** | **~2 h 45** | **~9,2 M** | | | |

Vòng 2 đắt gấp đôi vì máy chấm quá tải: 27 lượt tác nhân treo, e2e chạy 28 phút (nền 38 giây), và
`npm test` báo đỏ ở `xuong-transcript.test.ts` — tệp vòng không chạm — vì một ca chạy 22,6 giây thay
vì 1,2 giây. Hai lệnh đỏ oan được tính thành FAIL cho mười ô đo.

## 2. Tám bài học, mỗi bài một đề xuất

### B1 · «Ngoài hợp đồng thì không sửa» khoá đúng hai phát hiện đáng tiền nhất

Câu báo lỗi «Chưa lưu được» mất màu khẩn (ReUI `Alert destructive` mang màu ở biểu tượng, kho bỏ biểu
tượng) được báo từ **vòng 1** và mang theo cả bốn vòng. Phép kiểm `git merge-base HEAD master` — do
chính bản sửa vòng 1 thêm vào — được báo từ vòng 2 là sẽ **đỏ vĩnh viễn trên nhánh chính sau khi
gộp** và lỗi trên CI. Cả hai `inContract: false`, nên luật định tuyến đẩy chúng về Cổng 2; không vòng
nào được sửa chúng, trong khi các vòng vẫn chạy để vá câu chữ.

**Đề xuất:** một lớp phát hiện ngoài hợp đồng có tên — *«gộp là lỗi đã biết»*: (a) do chính diff của
vòng đẻ ra **và** (b) người dùng thấy được hoặc làm đỏ CI. Lớp này không đợi Cổng 2: hỏi người MỘT câu
ngay vòng nó xuất hiện («sửa trong vòng này, hay khai?»). Chi phí một câu hỏi thấp hơn nhiều so với
kéo nó qua ba vòng.

### B2 · Lợi ích sụp sau vòng 2, và máy thấy được điều đó sớm hơn người

Từ vòng 3, mọi mục trong hợp đồng truy được về diff của lượt sửa ngay trước. Đây đúng là bài học kho
radar đã ghi nhiều lần («vòng sửa là chỗ đẻ lỗi mới»), và máy lặp lại nó ba lần trong một hồ sơ —
kể cả một lỗi (vật phá dựng lại vị từ thay vì gọi vị từ thật) sửa ở ba tệp rồi mắc lại ở tệp thứ tư.

**Đề xuất:** S4 tính một tỷ số mỗi vòng — *số mục trong hợp đồng mà `file:line` nằm trong diff của lượt
sửa vòng trước / tổng mục*. Khi tỷ số = 1 (mọi mục là do chính lượt sửa), thẻ kết quả khuyên dừng và
khai giới hạn thay vì phát vòng kế. Trần nhát sửa thước (`TRAN_NHAT = 3`) có bật đúng lúc ở vòng 3,
nhưng nó đếm commit chạm thước; nó không thấy lỗi nằm ở **câu chữ của evals/hợp đồng**.

### B3 · Câu kiểm viết ở S1 khẳng định thứ sản phẩm không làm và thứ công cụ không nhận

Hai câu máy viết lúc S1 làm ô E10b đỏ hai vòng liền: (1) «phải thấy câu “đường cấm vai”» — câu không tồn
tại ở đâu trong sản phẩm, vì đường bị cấm thì **đổi hướng** (có ghi ngay trong `src/App.tsx`); (2)
«`design:gate` trả 0 P0 trên cả chín ảnh» — cổng thiết kế của kho quét **mã nguồn**, gọi trên ảnh HTML
thì công cụ ném lỗi.

**Đề xuất:** lint ở Cổng 1, hai câu hỏi rẻ: mọi chuỗi mà `expected` đòi **thấy trên màn** phải grep ra
trong `src/` (hoặc gắn nhãn «chữ mới của vòng này»); mọi executor/chế độ mà một eval nêu tên phải là
thứ `_acceptance/config.yaml` của kho khai. Cả hai đều bắt được lúc S1, trước khi tốn một vòng chấm.

### B4 · Sửa `evals.yaml` sau Cổng 1 mà không sửa hợp đồng — hai nơi định nghĩa hai điều kiện đạt

Vòng 3 máy sửa chiều đỏ của E10b trong `evals.yaml` và quên AC-10 trong `contract.md`; vòng 4 bắt đúng
chỗ ấy. Hook ghi-lúc-ghi gác `contract.md`, không gác việc `evals.yaml` trôi khỏi câu chữ AC mà nó đo.

**Đề xuất:** `s4-args` (hoặc hook) so `evalsHash` với hash lúc niêm Cổng 1; lệch mà hợp đồng không mở
lại thì in một dòng: «evals đổi sau niêm — AC nào bị đổi nghĩa? mở lại Cổng 1 hay khai đây chỉ là sửa
đường đo».

### B5 · Máy dựng lại một cái bẫy mà kho đã ghi bằng chữ

`tests/khong-cham-hai-man.test.ts` dòng 3–14 và `scripts/van-tay-cay.mjs` dòng 3–6 của radar ghi rõ:
đo «không chạm» bằng `git merge-base` thì hỏng trên nhánh chính và trên CI; phải đo bằng vân tay trên
cây. Máy vẫn viết đúng cơ chế bị cấm, vì nó không grep bài học có sẵn trước khi viết một bộ gác mới.

**Đề xuất:** bước S3 (hoặc lời dặn implementer) có một mục cứng: *trước khi viết một phép đo mới, grep
kho theo cơ chế định dùng* (`merge-base`, `execSync('git`, `Date.now`…) và đọc mọi chú thích nói về
nó. Kho có thể khai danh sách «cơ chế đo bị cấm» trong `_acceptance/config.yaml` để lint thành luật.

### B6 · Máy chấm quá tải cho FAIL oan

Xem §1. Hai lệnh suite đỏ mà ca đỏ nằm ở tệp ngoài diff của vòng và thời gian chạy gấp ~20 lần nền.

**Đề xuất:** lệnh máy thoát ≠ 0 mà (a) ca đỏ nằm ngoài `vungVat` của vòng và (b) thời gian ≫ nền của
chính lệnh ấy ở vòng trước → chạy lại MỘT lần, tuần tự, trước khi tính FAIL; lệch nữa thì ghi
«nghi quá tải», không ghi FAIL trơn.

### B7 · Người chấm ui-check dựng môi trường bằng cách đụng dữ liệu của cây làm việc

Để có tài khoản thử, người chấm vòng 3 `mv data → data.bak-e10b-<epoch>` rồi dựng dữ liệu mới; vòng 4
tạo thêm `data.bak-e10b-verify-run/`. Mật khẩu dev của owner mất hiệu lực, và hai thư mục rác nằm lại.

**Đề xuất:** executor ui-check nhận một thư mục dữ liệu tạm (biến môi trường của kho) thay vì dời
`data/`; kết thúc lượt chấm phải dọn thứ mình tạo, và báo cáo phải liệt kê mọi thứ đã đổi trên cây.

### B8 · Bằng chứng ghi lệnh bằng lời kể, không bằng lệnh đã chạy

`E10b-network.txt` ghi `--strictPart` (không phải cờ của Vite) thay vì `--strictPort` — tức lệnh tái lập
trong bằng chứng không chạy được như ghi, và không chứng được khoá cổng (lớp «đo nhầm cây»).

**Đề xuất:** dòng lệnh trong bằng chứng lấy từ lượt gọi thật (tiến trình con in lại argv), không để
người chấm chép tay.

## 3. Những chỗ kit làm đúng — giữ nguyên

- **`QUET-LOP-PHAI-CO-SAN`** (lưới đo lưới của radar) bắt sàn lệch nguồn **ba lần** trong các bản sửa
  của máy, mỗi lần trước khi hội đồng thấy.
- **Trần thước** bật đúng ở vòng 3 và buộc một câu người; lối (1) «khai giới hạn có tên» rẻ và sạch.
- **Carry-plan** làm vòng 4 chỉ chấm lại 3/13 ô — chi phí vòng 4 thấp nhất trong bốn vòng.
- Hội đồng bắt được việc **máy tự nới một AC đã ký** (bảng nợ 19 chỗ thay cho sàn 0) — đúng thứ luật
  «máy không tự thông cổng» sinh ra để chặn.

## 4. Ô mở

- B1 và B3 là rẻ nhất và đáng nhất; B2 cần định nghĩa «mục do lượt sửa trước đẻ ra» chặt tới mức máy
  đếm được.
- Hồ sơ `nen-shadcn` còn một vòng chấm cuối sau khi owner duyệt lại Cổng 1 với AC-8 sửa và AC-14 mới
  (hai lỗi của B1). Kết quả vòng ấy nên được nối vào tệp này.
