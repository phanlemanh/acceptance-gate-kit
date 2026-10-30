# Giao diện không đồng nhất giữa các màn — đo ở kho tiêu thụ, luật hiện có, nguyên tắc gốc, cách giải (30/10/2026)

**Trạng thái:** finding nháp, chờ chủ kho đọc. Không mở ô, không mở hàng lộ trình, không đổi engine.
Phiên: thao-luan-ui-dong-nhat (mở bởi điều phối MBP local_e9d2c0cb theo yêu cầu chủ kho 30/10).

**Câu hỏi của chủ kho (30/10):** ở kho crm, màn chi tiết deal đã có giao diện riêng, nhưng màn OKR mới lại dựng
một giao diện chi tiết khác. Luật giao diện của design-floor và Design OS giải việc này tới đâu? Rút về nguyên tắc
gốc; framework nào đã giải; cách giải đúng tầng là gì?

**Cách đo.** Đọc mã trên `origin/onehub` của crm ở `16604ce3f` (30/10 10:25), sau `git fetch`. Không chạy app
(cần cơ sở dữ liệu và đăng nhập), nên không chụp ảnh — mọi số dưới đây đọc từ mã, lệnh đo ghi ở §6. Kho kit công
khai: tệp này chỉ trích tên tệp và tên thành phần, không có dữ liệu sản phẩm.

---

## 0. Trả lời một phút

1. **Lệch nằm ở tầng KHUNG và TRẠNG THÁI, không nằm ở tầng token.** Khu OKR gần như không có mã màu thô, giá trị
   tuỳ ý hay bo góc tự đặt. Lệch là: ngăn chi tiết KR **không dùng khung ngăn chung** mà ngăn deal, liên hệ, công
   ty, kế hoạch và mục tiêu đều dùng. Nó tự dựng đầu ngăn, chờ tải, báo lỗi và «không thấy». Riêng khu OKR có
   khoảng 30 thành phần rỗng/tải/lỗi đặt tên riêng.
2. **Khung chung đã có từ trước khi màn KR được dựng.** `RecordSheetFrame` có từ commit đầu tiên (31/07). Ngăn KR
   dựng ngày 28/09 vẫn đi vòng qua nó. Vậy *có mẫu* chưa đủ: không gì *buộc* màn mới phải dùng mẫu.
3. **Luật của kit hôm nay không chặn lệch kiểu này.**
   - crm đang ở bậc **M0** (chưa khai vùng giao diện), nên design-floor không chạy gì ở crm.
   - Kể cả khi lên M2, design-floor chỉ chặn được mã màu thô và kiểm *bản kế hoạch dùng lại* có ghi tên có thật
     hay không. Không phần nào kiểm *mã đã dựng* có theo khung đã chọn, hay so màn mới với màn chuẩn.
   - Design OS chẩn đúng bệnh. Nó tự khai rằng bộ kiểm của nó chỉ chứng minh ý định, không chứng minh vật.
4. **Cách giải đúng tầng:** biến «màn mới dùng khung chung» từ một câu trong tài liệu thành **một ràng buộc máy
   giữ trên mã**. Ràng buộc quét mọi ngăn và mọi trang hiện có lẫn sẽ có (không dùng danh sách đóng), có ngoại lệ
   kèm tên và lý do, có chiều đỏ. Khi khung không đủ chỗ cho nhu cầu mới thì **sửa khung, không thoát khung**.
   - Việc này là **vật của kho crm**. crm đã có sẵn bộ quét JSX và hai răng cùng dạng: màu trạng thái và khung
     trang.
   - Phía kit chỉ ghi hạt giống, và chỉ đưa lên kit khi một kho thứ hai cần cùng cơ chế.

---

## 1. Hiện trạng crm — lệch ở đâu, tầng nào

### 1.1 «Chi tiết deal» và «chi tiết KR» cùng là một loại màn

Cả hai mở thành **ngăn bản ghi** trượt từ phải, chung một chỗ đặt ngăn (`?record=<loại>:<id>`). Hai trang
`deals/[dealId]/page.tsx` và `okr/kr/[keyResultId]/page.tsx` chỉ chuyển hướng tới ngăn. Vậy câu hỏi đúng là:
*các ngăn bản ghi có cùng một khung không?*

Khung chung là `RecordSheetFrame` (`apps/app/components/crm/record-sheet/record-parts.tsx`). Nó gói năm phần: đầu
ngăn (`DetailSheetHeader`: tiêu đề, mô tả, hành động, nút lùi khi ngăn chồng), chờ tải, lỗi tải (`KhungTaiLoi`,
nói đúng lý do: đã xoá · không có quyền · mất kết nối), dải ô số (`stats`) và thẻ con (`DetailSheetTabs`).

| Ngăn | Dùng khung chung | Chờ tải | Lỗi tải | Ô số | Hành động bản ghi | Dòng thời gian |
|---|---|---|---|---|---|---|
| Deal | ✓ | vòng quay (của khung) | `KhungTaiLoi` (của khung) | ✓ | `RecordActions` | ✓ |
| Liên hệ · Công ty | ✓ | vòng quay | `KhungTaiLoi` | ✓ | `RecordActions` | ✓ |
| Kế hoạch | ✓ | vòng quay | `KhungTaiLoi` | ✓ | — | ✓ |
| Mục tiêu | ✓ | vòng quay | `KhungTaiLoi` | ✓ | — (riêng) | — (Trao đổi riêng) |
| **KR** | **✗** — gọi thẳng `DetailSheetHeader` | **khung xương riêng** (`DangTaiKr`) | **`VungTaiLoi`** + `KhongThayKr` riêng | ✗ | ✗ (hành động tự đặt ở đầu) | ✗ (Lịch sử riêng) |
| Số KR | **✗** | khung xương riêng | riêng | ✓ (gọi thẳng) | ✗ | ✗ |

Đo bằng số lần xuất hiện của các khối dựng ở từng tệp (lệnh ở §6). Ngăn deal dùng `RecordSheetFrame` ×2,
`RecordActions` ×2, `Timeline` ×2. Ngăn KR dùng ba khối đó 0 lần, `DetailSheetHeader` ×2 và `Skeleton` ×6.

### 1.2 Trạng thái rỗng · tải · lỗi: ba đường song song

- **Hai thành phần lỗi tải dùng chung cùng tồn tại.** `KhungTaiLoi` là của khung ngăn, nói lý do. `VungTaiLoi`
  nằm trong `packages/ui`, thêm ngày 08/10, chỉ có tiêu đề, mô tả và nút thử lại. `docs/design.md` chỉ định
  `VungTaiLoi` cho *trang*, nhưng không nói gì về *ngăn*.
- **Khu OKR tự đặt khoảng 30 hàm rỗng/tải/lỗi/chờ:** `BangRong`, `RongCuaToi`, `RongTheoChip`, `DangTaiHoiY`,
  `LoiPhan`, `LoiTai`, `KhungCho`, `ManSoDoCho`… Thư mục deal không đặt hàm nào như vậy.
- **Chờ tải trong ngăn chưa có chuẩn.** Ngăn deal (qua khung) dùng vòng quay; ngăn KR dùng khung xương. Luật
  «khung xương cùng hình, không vòng quay» của `docs/design.md` viết cho *trang*. Ở tầng ngăn, chưa ai quyết đâu
  là đúng. Đây là chỗ máy không tự suy được nếu chỉ đọc mã (xem §5.1 bước 1).

### 1.3 Tầng token và thành phần: gần như sạch

| Vùng | Dòng `.tsx` | Mã màu thô | Giá trị tuỳ ý (đối chứng: cả app có `w-[12%]` ×29, `text-[13px]` ×16) | `className` đè lên `Button/Badge/Card/Input/Tabs/Sheet` |
|---|---|---|---|---|
| khu OKR | 26 473 | 0 | chỉ bề rộng cột bảng theo % | 11 |
| khu deal | 1 300 | 0 | 0 | 0 |
| các ngăn bản ghi | 10 608 | 0 | chỉ bề rộng cột bảng | 0 |

Màu trạng thái đã có răng: `packages/ui/test/mau-trang-thai-mot-bang.spec.ts` đỏ khi một tệp tự khai bảng màu
trạng thái. **Kết luận tầng:** token ✓ đã giữ · thành phần ✓ phần lớn · **khung ngăn ✗** · **trạng thái ✗** ·
hành vi ghi trong ngăn: đang lệch, chủ kho vừa chốt luật hôm nay (§1.5).

### 1.4 Giá của lệch: sửa sau tốn hơn chặn trước

- **Ít nhất 8 vòng đã ký có mục đích chính là đồng nhất lại**, theo dòng `feature:` của hợp đồng:
  `khung-tao-okr-nhu-deal` (T2, 14 tiêu chí), `soan-okr-trong-khung`, `muc-tieu-va-kr` («trong cùng một khung»),
  `khung-ban-ghi-kara`, `khung-loi-ban-ghi-dung-ly-do`, `kara-gop-y-luot-2` («dùng khung chung»),
  `dai-luu-tru-dung-chung`, `khung-trang-cai-dat`, `thanh-vien-hai-khoi-cung-khuon`.
- **Lộ trình OKR đang chở thêm khoảng 15 hàng cùng loại:** NM1–NM4 (khung màn chung, lọc chung, màu trạng thái
  chung, chữ màn — ba hàng chưa mở) và SV1–SV11 (bấm KR mở chi tiết KR, cập nhật ngay trong ngăn, sửa ngay trong
  ngăn…).
- **Thước «trông giống» hôm nay là mắt người, dựng tay từng vòng.** Ví dụ AC-12 của `khung-tao-okr-nhu-deal`:
  «một người không làm lượt này đặt cạnh nhau… thấy cùng một khung».

### 1.5 Mốc thời gian: luật đến sau màn

| Ngày | Sự kiện |
|---|---|
| 31/07 | `RecordSheetFrame` đã có (commit đầu tiên) |
| 28/09 | Ngăn KR dựng — đi vòng qua khung |
| 09/10 | `docs/design.md` thêm «Nếp màn trong app» (khung trang, chờ tải, lỗi tải…), rút từ bảy màn đang chạy |
| 13/10 | Răng `apps/app/test/khung-man-chung.spec.ts`: tiêu đề trang, khung xương thay vòng quay — **chỉ cho trang** |
| 30/10 | Chủ kho chốt bảng «Ghi vào bản ghi: ngay trong ngăn» sau khi soát tay sáu ngăn |

Tác tử **có** đọc luật: `AGENTS.md` nạp `@docs/design.md` và bảng «đọc gì trước khi chạm gì» trỏ tới nó. Nhưng
luật được viết *sau* màn, để mô tả đích. Ngoài hai răng kể trên, mọi phần còn lại vẫn là chữ.

Răng khung trang cũng có giới hạn. Phần «hình khung xương theo màn» neo vào một bảng 39 tệp, rút từ một commit gốc
(`SHA_GOC`). Trang sinh ra sau ngày đó không bị buộc vào bảng: đó là danh sách đóng. Phần «không vòng quay» quét
rộng hơn bảng; chưa đo nó có bắt trang mới hay không.

---

## 2. Luật hiện có — chặn ở tầng nào, bỏ ngỏ tầng nào

| Tầng | Kit: design-floor (M0–M3) | Kit: skill `ux-ui-craft` / `design-pass` | Design OS (bản vendored) | crm hôm nay |
|---|---|---|---|---|
| **Token** | S4 chặn mã màu thô (M1+). Độ phủ token chỉ trên `.html` (M2 cảnh báo, M3 chặn) — **không chạy trên `.tsx`** | lời: «tokens before screens», gắn vào hệ có sẵn | `ui gate` / `token-coverage` trên `.html` | lời (`docs/design.md`) + răng màu trạng thái |
| **Thành phần** | — | lời | `reuse-plan check` bậc 3–5: tên trong kế hoạch có thật trong sổ thành phần (M2, cần sổ) | lời: «`/packages/ui` là nguồn duy nhất» |
| **Khung trang / mẫu màn** | — | `ux-ui-craft` đo khoảng cách và đường căn *trong* một màn; không so với màn khác | `reuse-plan check` bậc 2 + dòng `Pattern:` — **gần nhất với câu hỏi**, nhưng chỉ kiểm *kế hoạch* | lời + răng khung trang (chỉ trang, bảng đóng) |
| **Khung ngăn bản ghi** | — | — | như trên | **chỉ lời** (hôm nay) |
| **Hành vi** (ghi ở đâu, chờ tải kiểu gì) | — | `design-pass`: người phản ứng trên bản mẫu của *một* vòng | `flow lint` kiểm cấu trúc luồng của một vòng | lời; AC «đặt cạnh nhau» dựng tay mỗi vòng |

**Trả lời thẳng: luật hôm nay KHÔNG chặn được lệch kiểu deal-vs-OKR.** Có ba lý do:

1. **crm ở M0.** `design-floor-bac.mjs --root crm` in `{"bac":"M0","ly_do":"chưa khai design.surface_globs"}`.
2. **Ngay cả ở M2–M3, các phần CHẶN đều nằm ở tầng token**: mã màu thô, độ phủ token trên `.html`. Kho React
   `.tsx` chỉ còn kiểm mã màu thô — đúng điều bản phạm vi DFK đã đo ở kho invest (K4).
3. **Thang dùng lại của Design OS đúng hướng nhưng dừng ở ý định.**
   - Mô hình của nó gần như mô tả nguyên văn ca crm: kho đã có sẵn thành phần, nhưng không gì bắt tác tử chọn từ
     đó; tác tử chép mã gần nhất, mà mã gần nhất lại là mã đã lệch. (Diễn ý `knowledge/design-reuse-ladder.md`,
     mục «Mental Model».)
   - Mục «What the checker proves, and what it does not» của tệp đó tự khai: bộ kiểm chỉ chứng minh tên có trong
     sổ. Nó **không** chứng minh mã đã dựng theo kế hoạch, và cũng không chứng minh thành phần được chọn là đúng.
   - Nó cần một sổ thành phần và mẫu màn khai sẵn (`design/patterns/*` hoặc `Pattern/*`). crm chưa có cả hai.
     Kit cũng chưa có lệnh sinh sổ từ mã (hàng chờ DFK-C3).

**Phần bỏ ngỏ, gọi tên:** chưa tầng nào của kit kiểm **«vật đã dựng đi qua khung đã chọn»**, và chưa tầng nào **so
màn mới với màn chuẩn**. Cả hai là bất biến *xuyên vòng*, trong khi mọi thước hiện có đều là thước *của một vòng*.

---

## 3. Nguyên tắc gốc

### 3.1 Vì sao màn mới lệch — sáu nguyên nhân, có số đo đỡ

| # | Nguyên nhân | Bằng chứng ở crm |
|---|---|---|
| N1 | **Nhất quán là bất biến xuyên vòng, còn hợp đồng chỉ nói về một vòng.** Không tiêu chí nào của vòng KR đòi «giống ngăn deal», nên không thước nào đỏ. Đây là nguyên tử tái diễn của hiến pháp kit: một trí tưởng tượng viết cả vật, thước và lời | vòng `canh-kr-okr` (28/09) ký mà ngăn KR ngoài khung |
| N2 | **Có mẫu ≠ bị buộc dùng mẫu.** Đường rẻ nhất cho tác tử là viết mới cho vừa nhu cầu riêng. Khi khung không có chỗ cho nhu cầu đó (ngăn KR cần hành động riêng ở đầu và một thân nhận thẻ con), tác tử thoát khung thay vì mở rộng khung | khung có từ 31/07; ngăn KR 28/09 đi vòng |
| N3 | **Luật viết sau màn.** Luật mô tả đích; mỗi màn lệch biến thành một hàng sửa | «Nếp màn» 09/10 rút từ màn đang chạy; ~15 hàng NM/SV |
| N4 | **Luật bằng lời không có răng.** Lời dặn không phải nghiệm (hiến pháp kit) | hai răng (màu, khung trang) đều giữ được tầng của chúng; tầng ngăn không răng thì lệch |
| N5 | **Chưa có màn chuẩn được chỉ định ở mỗi tầng.** Máy không thể chặn một thứ chưa được quyết | chờ tải trong ngăn: vòng quay (deal) hay khung xương (KR)? chưa ai chốt |
| N6 | **Thước «trông giống» là mắt người, dùng sau khi giao.** Lệch được phát hiện khi chủ kho dùng thử, thành lượt gọi người ngoài thiết kế | AC-12 dựng tay; bảng 30/10 sinh từ một lần soát tay |

### 3.2 Bảy nguyên tắc cốt lõi

1. **Mỗi quyết định thiết kế có MỘT nguồn, đặt ở tầng thấp nhất giữ được nó.** Thứ tự tầng: token → thành phần →
   khung (màn, ngăn) → hành vi. Quyết định sống trong **vật** (một thành phần, một khung có khe), không sống trong
   chữ.
2. **Đường đúng phải là đường rẻ nhất.** Màn mới dựng bằng cách *điền khe* của khung. Khi khung thiếu khe thì
   **sửa khung một chỗ**, không thoát khung. crm đã có luật này cho thành phần («cần biến thể mới thì làm trong
   `packages/ui`»); mở rộng nó lên khung.
3. **Bất biến xuyên vòng do máy giữ, quét mở.** Quét *mọi* tệp thuộc loại (mọi ngăn mà chỗ đặt ngăn đăng ký, mọi
   `page.tsx`), không dùng danh sách đóng. Ngoại lệ có tên và lý do.
4. **Hai chiều cho mọi thước.** Phá khung trong một bản sao thì thước đỏ, đúng tên tệp. Chạm tài liệu hay hồ sơ
   thì thước im.
5. **Người quyết màn chuẩn MỘT lần, máy áp mãi.** Mỗi tầng có một mẫu đang chạy được chỉ định («mẫu đang chạy»
   như bảng 30/10 của crm). Câu hỏi «cái nào đúng» chỉ hỏi khi hai mẫu mâu thuẫn.
6. **Luật trước màn, không sau màn.** Lần đầu một loại màn xuất hiện, khung của nó được rút thành thành phần *trong
   chính vòng đó*. Vòng thứ hai cùng loại chỉ điền khe.
7. **Phần không tất định («đọc như cùng một sản phẩm») đi qua một phép so cạnh nhau ở cổng ĐÃ CÓ.** Máy chụp màn
   mới cạnh màn chuẩn, người đọc lúc rảnh. Không thêm lượt gọi người.

---

## 4. Các framework đã giải — giải tầng nào, giá ra sao, hợp với kit đến đâu

| Framework / cách | Tầng giải | Cơ chế ép | Giá | Hợp với kit (máy làm + tự chứng minh, người chỉ quyết) |
|---|---|---|---|---|
| **Design token (W3C DTCG)** — định dạng chuẩn cho token, công cụ như Style Dictionary sinh ra CSS/TS | token | một nguồn, sinh sang các nền | thấp | ✓ — crm đã giữ tầng này; không giải khung |
| **Atomic Design** (nguyên tử → phân tử → khối → **khuôn trang** → trang) | từ vựng cho mọi tầng | không có — là mô hình tư duy | 0 | ✓ làm ngôn ngữ: chỗ crm hở chính là tầng *template* |
| **Design system có thư viện mẫu** — Material (bố cục chuẩn: danh sách–chi tiết, ngăn phụ), Carbon (mẫu rỗng, tải, luồng tạo), Polaris (thành phần `Page` có khe tiêu đề/hành động/lùi; khuôn trang chỉ mục và chi tiết), Atlassian, GOV.UK (mẫu kèm «khi nào KHÔNG dùng») | khung + hành vi | **thành phần cấp trang có khe** + tài liệu + duyệt | trung bình (một lần dựng khung) | ✓✓ — đúng tầng hở; cơ chế «khe» là nguyên tắc 2 |
| **Ràng buộc bằng cấu tạo** — Braid (SEEK), Every Layout (Stack/Box/Cluster/Sidebar): cấm `className`/`style` tự do, chỉ ghép primitive bố cục | khoảng cách, bố cục trong màn | API không cho phép lệch | cao nếu áp ngược lên mã cũ | ◐ — crm đã cấm đè kiểu bằng lời; đủ dùng ở tầng thành phần |
| **Lint / quét cấu trúc** — `no-restricted-imports`, `no-restricted-syntax`, luật AST tự viết, lint Tailwind cấm giá trị tuỳ ý | token · thành phần · **khung** | máy, tất định, chạy trong suite | thấp | ✓✓ — đúng dạng răng kit ưa: thước cùng nhà với vật, chiều đỏ nằm trong lịch sử. crm đã có bộ quét JSX (`apps/app/test/lib/quet-jsx.ts`) và hai răng dùng nó |
| **Storybook + so ảnh** (Chromatic, `toHaveScreenshot` của Playwright) | giữ một màn không trôi khỏi chính nó | so điểm ảnh với ảnh nền | trung bình–cao (dữ liệu giả ổn định, duyệt ảnh nền) | ◐ — bắt trôi, **không** bắt màn MỚI lệch (màn mới chưa có ảnh nền); dùng được cho chính khung chung |
| **Màn chuẩn / bản tham chiếu** (golden screen, reference implementation) | cảm nhận tổng thể | so cạnh nhau | thấp nếu máy chụp | ✓ — nguyên tắc 7; ghép vào gói `design-pass` sẵn có |
| **Thang dùng lại + kế hoạch dùng lại** (Design OS); sổ thành phần cho tác tử (sổ shadcn, máy chủ MCP của ReUI) | ý định của tác tử trước khi dựng | kiểm tên trong kế hoạch | trung bình (cần sổ thành phần + mẫu khai) | ◐ — giải nửa ý định; thiếu nửa vật (Design OS tự khai) |

**Rút gọn:** các design system lớn giải bằng **thành phần cấp trang có khe**, cộng với **duyệt của người**. Kit
thay phần «duyệt của người» bằng **răng quét cấu trúc trên mã**, rẻ và tất định, cộng với **so cạnh nhau ở cổng đã
có** cho phần cảm nhận. So ảnh và thang dùng lại là bổ sung, không thay được răng cấu trúc.

---

## 5. Cách giải đề xuất

### 5.1 Khuyến nghị chính: «khung là vật, không phải lời» — làm ở KHO crm trước

Đây là vật của kho, theo thứ tự chọn nghiệm của luật 26/09: sửa đúng tầng trước, đổi mặc định của kit sau cùng.
Gọn trong MỘT vòng, ước 8–10 tiêu chí:

1. **Chốt mẫu tầng ngăn (máy đề xuất, cửa veto mở).** Mẫu = ngăn deal qua `RecordSheetFrame`. Riêng chờ tải
   trong ngăn, máy đề xuất **khung xương**: kéo luật trang đã chốt 09/10 xuống tầng ngăn, nghĩa là khung chung đổi
   theo, còn ngăn KR đã đúng ở điểm này. Căn cứ là luật đã khai, nên máy đi tiếp và ghi sổ; chủ kho có thể đảo.
2. **Sửa khung, không thoát khung.** Mở `RecordSheetFrame` thêm đúng các khe mà ngăn KR và Số KR đang cần (hành
   động riêng ở đầu, thân nhận thẻ con, lỗi «không thấy» riêng). Đưa hai ngăn đó vào khung. Chọn **một** thành
   phần lỗi tải cho ngăn (`KhungTaiLoi` nói lý do), ghi vào `docs/design.md`.
3. **Răng quét mở cho tầng ngăn**, dựng trên `quet-jsx.ts`:
   - Mọi loại bản ghi mà chỗ đặt ngăn (`record-sheet-host.tsx`) đăng ký phải dựng `RecordSheetFrame` ở gốc.
   - Ngăn không được tự dựng `DetailSheetHeader`, `Skeleton`, hay một thành phần lỗi ngoài khung.
   - Ngoại lệ là một bảng có tên và lý do.
   - Chiều đỏ: tiêm một ngăn gọi thẳng `DetailSheetHeader` thì đỏ đúng tên tệp. Chiều im: sửa `docs/` hay
     `_acceptance/` thì im.
4. **Mở răng khung trang.** Phần «hình theo màn» của `khung-man-chung.spec.ts` chuyển từ bảng neo vào commit gốc
   sang quét mọi `page.tsx`, có bảng ngoại lệ. Trang mới sau 13/10 tự vào lưới.
5. **Màn chuẩn trong gói thiết kế.** Khai danh sách màn chuẩn theo tầng (trang danh sách, ngăn bản ghi, ngăn
   tạo). `design-pass` của mỗi vòng chạm loại màn ấy chụp màn mới cạnh màn chuẩn, cùng khổ và cùng trạng thái.
   Người phản ứng ở Cổng 1 sẵn có, không thêm lượt. Lúc đầu chỉ cần một dòng trong `docs/proto.md` hoặc khối
   `design_pass` của config; chưa cần kit đổi gì.

Các hàng SV và NM đang mở **giữ nguyên** — đó là dọn nợ. Vòng này là phần *chặn tái sinh*. Không có nó thì mỗi lần
dọn xong, màn OKR kế tiếp lại đẻ hàng mới.

**Dự báo trên thước của kit** (↑ ↓ =):

| Dòng | Dự báo | Vì sao |
|---|---|---|
| làm-xong → ký | = | thêm một bài kiểm nhanh trong suite sẵn có |
| ký → gộp | = | — |
| lượt gọi người ngoài thiết kế / vòng | ↓ | lệch khung bị chặn trong suite, không chờ chủ kho dùng thử mới thấy |
| token · phút máy / kết quả gộp | ↓ về sau | bớt vòng «đồng nhất lại»: hôm nay ≥ 8 vòng đã ký, ~15 hàng chờ |
| vòng bị hạ tầng đốt lượt chấm | = | răng cùng nhà với vật, không cần bàn đo mới |

**Điều kiện tin cậy:** răng ở bước 3 phải có đối chứng dương (mọi ngăn hiện có xanh sau bước 2) và ghim đúng thông
điệp. Không có hai thứ đó thì bước 3 không tính.

### 5.2 Phần của KIT — ghi hạt giống, không mở vòng bây giờ

- **Đóng băng meta và luật CỘNG:** cơ chế mới trong kit cần chủ kho phê và chỉ mở sau mốc kho nhận gần nhất.
- **Hạt giống đề xuất (chưa ghi):** «design-floor kiểm *vật theo khung*». Đây là một khoá tuỳ chọn trong config,
  ánh xạ glob tệp → thành phần khung bắt buộc, ví dụ `**/record-sheet/*-sheet.tsx → RecordSheetFrame`. S4 kiểm mã
  đã dựng có đi qua khung đó, cho cả `.tsx` lẫn `.html`. Đây là nửa còn thiếu của `reuse-plan check`: nửa kia
  kiểm ý định, nửa này kiểm vật.
  - Kho không khai thì không đổi gì. Đó là nấc «bật thêm theo lựa chọn», không đổi mặc định.
  - Neo: bản phạm vi DFK (PR #446) ghi rằng hàng chờ DFK-C2 «mở sớm hơn điều kiện… chỉ khi chủ kho chỉ ra một màn
    lệch thật trên kho tiêu thụ» — ca này là màn lệch thật đó, nhưng nó nằm ở tầng khung, không ở tầng token của
    DFK-C2. Nên nó là bằng chứng cho một hạt giống khác (DFK-C3 / vật theo khung), không phải lý do mở DFK-C2.
  - Điều kiện nâng từ kho lên kit: răng bước 3 của crm chạy qua ≥ 3 vòng OKR mà bắt được ≥ 1 lệch thật, **và** một
    kho thứ hai (invest) muốn cùng cơ chế. Chưa đủ hai vế thì đây là vật của kho.
  - **Cập nhật cùng ngày (§7.1):** kho thứ hai đã cho thấy *cùng lớp lỗi*. Vế «kho thứ hai» chuyển từ «muốn» sang
    «đã đo thấy». Vế còn lại vẫn là crm chạy thử và bắt được lệch thật. §7 thay khoá đơn «vật theo khung» ở trên
    bằng một hình dạng chung hơn: bản đồ khuôn.
- **`design-pass`:** mục «màn chuẩn cạnh màn mới» ở bước 5 là một đổi lời của skill. Đưa vào kit sau khi crm dùng
  thử bằng config.

### 5.3 Các lối khác và hệ quả

| Lối | Được | Mất |
|---|---|---|
| **A. Kit trước** — dựng khoá «vật theo khung» trong design-floor ngay | mọi kho có cùng lúc | cần một vòng meta có tên + CỘNG; chờ ≥ 1 mốc phát hành; dựng cơ chế khi mới có một kho có số — trái luật 26/09 |
| **B. Chỉ thêm lời** vào `docs/design.md` / `AGENTS.md` | gần như 0 giá | đã thử: tác tử đọc luật mà ngăn KR vẫn đi vòng khung có sẵn; ≥ 8 vòng đồng nhất lại là giá của lối này |
| **C. So ảnh cho mọi ngăn** (Chromatic / `toHaveScreenshot`) | bắt trôi điểm ảnh của khung chung | không bắt màn MỚI lệch; cần dữ liệu giả ổn định và duyệt ảnh nền — đắt hơn răng cấu trúc, nên là lớp sau |
| **D. Lên M2 design-floor ở crm** (sổ thành phần + tệp token + kế hoạch dùng lại) | tác tử phải khai khung trước khi dựng | chưa có lệnh sinh sổ từ mã; vẫn chỉ kiểm ý định; tốn công dựng sổ |
| **E. Chỉ dọn nợ** (chạy hết SV/NM) | màn hiện có đồng nhất | không chặn tái sinh: màn OKR kế tiếp lại lệch |

---

## 6. Lệnh đo (đọc lại được)

```bash
cd ~/dev/crm && git fetch origin onehub && git rev-parse --short origin/onehub   # 16604ce3f
# khối dựng theo ngăn
for f in deal-sheet contact-sheet company-sheet plan-sheet kr-sheet objective-sheet so-kr-sheet; do
  git show "origin/onehub:apps/app/components/crm/record-sheet/$f.tsx" \
  | grep -oE '\b(RecordSheetFrame|RecordActions|Timeline|DetailSheetHeader|DetailSheetStats|Skeleton|VungTaiLoi|KhungTaiLoi)\b' \
  | sort | uniq -c | tr '\n' ' '; echo " ← $f"; done
# bậc design-floor của crm
node scripts/design-floor-bac.mjs --root ~/dev/crm --json   # {"bac":"M0",...}
# vòng «đồng nhất lại»: dòng feature: của mọi contract.md có «như deal | khung chung | thống nhất | dùng chung …»
```

Đối chứng tầng token: cùng biểu thức giá trị tuỳ ý bắt `w-[12%]` ×29 và `text-[13px]` ×16 trên cả app. Vậy số 0 ở
khu OKR là đo thật, không phải biểu thức mù.

**Giới hạn đã khai:**
- Không chụp ảnh. Lệch *thị giác* (khoảng cách, cỡ chữ đầu ngăn) chưa đo trên bản chạy. Kết luận tầng khung đọc từ
  cấu trúc mã.
- Số «khoảng 30 hàm» đếm tay từ 44 tên khớp `Rong|DangTai|Loi|Cho|KhongThay…`, đã bỏ 14 tên khớp nhầm
  (`ChonChuKy`, `TraLoi`, `HopChonDuong`…).
- Danh sách vòng «đồng nhất lại» lọc theo từ khoá dòng `feature:`, nên có thể sót vòng không dùng các từ đó.

---

## 7. Nguyên lý cho MỌI kho — biến bất định thành tất định

Câu hỏi tiếp của chủ kho (30/10): chỉ giải ở một kho thì kho khác sẽ lặp lại. Nguyên lý gốc và cách giải đúng
cho mọi kho là gì? Biến bất định thành tất định, hoặc thành một bộ nguyên tắc để tác tử viết mã dễ làm đúng?

### 7.1 Lớp lỗi lặp ở kho thứ hai

Đo onehub-invest ở `origin/main` `ec899d03` (30/10), vùng vận hành (`app/src/app/ops` + `app/src/components/ops`):

- **Khung đầu trang:** có thành phần dùng chung `PageHeader`, 8 tệp dùng. Nhưng 2 trang tự dựng `<h1>`
  (`ops/deals/page.tsx`, `ops/review-content.tsx`).
- **Trạng thái:** có thành phần lỗi dùng chung `RegionError` (4 chỗ dùng). Nhưng mỗi khu tự đặt khung xương và
  trạng thái rỗng riêng: `AiCallsSkeleton`, `AiCallsEmpty`, `LabelsSkeleton`, `LabelsEmpty`, `ReviewQueueEmpty`,
  `DataFlowSkeleton`… — 11 hàm.

Cùng hình dạng với crm: **mẫu dùng chung có sẵn, màn mới đi vòng; trạng thái vẽ lại theo từng khu.** Hai kho chung
nền kỹ thuật (Next, shadcn, ReUI) nhưng khác tên thành phần, cách chia khu và luật chữ. Vậy nghiệm không thể là
tên thành phần của một kho; nghiệm phải là **cơ chế**.

### 7.2 Định lý gốc: bất định = điểm chọn không có người giữ

Khi dựng một màn, tác tử đi qua một chuỗi **điểm chọn**: màn này thuộc loại nào, khung gì, đầu trang ra sao, chờ
tải vẽ gì, lỗi vẽ gì… Ở mỗi điểm chọn mà **không có câu trả lời do máy giữ**, tác tử trả lời bằng thứ gần nhất
trong ngữ cảnh của nó: mã cạnh bên, mẫu trong đầu, nhu cầu riêng của vòng. Ngữ cảnh mỗi vòng một khác, nên mỗi vòng
một đáp án.

> **Độ lệch giữa các màn ≈ số điểm chọn không ai giữ × số cách trả lời hợp lệ ở mỗi điểm.**

Tất định hoá không có nghĩa là bắt tác tử «cẩn thận hơn». Nó có nghĩa là **đẩy từng điểm chọn lên bậc cao nhất có
thể của thang tất định**:

| Bậc | Tên | Điểm chọn còn lại | Ví dụ | Tất định? |
|---|---|---|---|---|
| T0 | **Không còn lựa chọn** (ràng bằng cấu tạo) | 0 — chỉ có một đường | khung có khe; ngoài khung cấm dùng tiêu đề trần, khung xương trần | ✓ |
| T1 | **Sinh sẵn** | 0 lúc bắt đầu | lệnh «tạo màn loại X» sinh tệp từ khuôn, tác tử chỉ điền khe | ✓ |
| T2 | **Khai rồi kiểm** | có, nhưng sai thì đỏ | bản đồ khuôn + bài quét trên mã | ✓ (sau khi chạy) |
| T3 | **Chọn có đối chiếu** | có, người phản ứng | ảnh màn mới cạnh mẫu đang chạy ở cổng sẵn có | ◐ |
| T4 | **Gu** | người quyết | chọn khung xương hay vòng quay; chọn tỉ lệ cỡ chữ | ✗ — nhưng chỉ quyết MỘT lần, rồi ghi thành giá trị luật và hạ xuống T2 |

**Lời dặn** («hãy dùng `/packages/ui`») không nằm trên thang. Nó chỉ thêm một dòng vào ngữ cảnh — đúng thứ hiến
pháp kit cấm dùng làm nghiệm. Ở crm, luật được tác tử đọc mà ngăn KR vẫn đi vòng (§1.5).

### 7.3 Ngữ pháp màn: các điểm chọn mọi kho đều có

Mọi màn của mọi sản phẩm phải trả lời cùng một bộ câu hỏi. Kho này khác kho kia ở **giá trị** của câu trả lời,
không ở **bộ câu hỏi**. Bộ này là phần chung mà kit giữ được:

| # | Điểm chọn | crm đã có câu trả lời ở | invest |
|---|---|---|---|
| 1 | **Loại màn** (danh sách · chi tiết · ngăn bản ghi · tạo/sửa · tổng quan · toàn vùng · cài đặt…) | rải trong `docs/design.md`, `docs/settings.md` | chưa khai |
| 2 | **Khung của loại** (thành phần + khe) | `PageShell`, `RecordSheetFrame` | `PageHeader`, hai vỏ (cổng · vận hành) |
| 3 | **Trạng thái** chờ tải · rỗng · lỗi · không quyền · không thấy | `VungTaiLoi`, `KhungTaiLoi` (hai cái, §1.2) | `RegionError`; rỗng/tải chưa có chuẩn |
| 4 | **Đầu** tiêu đề · mô tả · số nút chính · lùi | `docs/design.md` «Khung trang» | — |
| 5 | **Ghi** sửa tại chỗ · ngăn · hộp thoại, theo loại việc | bảng 30/10 | — |
| 6 | **Phản hồi** báo thành công/lỗi · hoàn tác | rải rác | — |
| 7 | **Giá trị** màu · cỡ chữ · khoảng cách · bo góc | token + răng màu trạng thái | `design/tokens.json` |

Điểm chọn 7 là tầng mà design-floor và hạt giống DFK-C2 (tệp luật hình học, chủ kho chốt hình dạng 30/10) đang
giải. **Điểm chọn 1–6 là tầng khung và hành vi — hôm nay không kho nào có răng ở đó, ngoài hai răng của crm.**

### 7.4 Cơ chế chung: «bản đồ khuôn» — kit giữ cơ chế, kho giữ giá trị

Cùng hình dạng mà chủ kho đã chốt cho DFK-C2: **một tệp luật của kho, kit đọc nó; kho không khai thì không đổi
gì.** Ở đây tệp luật mô tả khuôn thay vì giá trị hình học.

**Tệp của kho** (ví dụ `design/khuon.yaml`, hay một khối trong config) — mỗi loại màn một mục:

```yaml
loai:
  ngan-ban-ghi:
    nhan_dien: "apps/app/components/crm/record-sheet/*-sheet.tsx"   # hoặc marker: data-khuon="ngan-ban-ghi"
    khuon: RecordSheetFrame                                         # thành phần phải dựng ở gốc
    mau_dang_chay: { tep: ".../deal-sheet.tsx", duong: "/deals?record=deal:<mau>" }
    trang_thai: { cho: "(của khuôn)", loi: KhungTaiLoi, rong: DetailSheetEmpty }
    cam_ngoai_khuon: [DetailSheetHeader, Skeleton, Spinner]         # khối dựng chỉ khuôn được dùng
    ngoai_le: []                                                    # { tep, ly_do } — lý do bắt buộc
```

**Kit làm bốn việc, đều ở bước ĐÃ CÓ của vòng — không thêm cổng người:**

1. **Định tuyến ngữ cảnh (S1).** Vòng chạm giao diện thì máy xếp mỗi màn mới/sửa vào một loại theo `nhan_dien`,
   rồi nạp **đúng khuôn + tệp mẫu đang chạy** vào ngữ cảnh tác tử. Đây là chỗ sửa nguyên nhân «nguồn chuẩn không
   nằm nơi tác tử đọc khi làm». Hợp đồng tự mang một tiêu chí máy: «màn X theo khuôn Y», người không phải viết.
   - Màn không khớp loại nào → **một mục ở thẻ Cổng Phạm vi** sẵn có: «loại mới — rút khuôn trong chính vòng này»
     hay «xếp vào loại Z». Đây là điểm T4 duy nhất, và mỗi loại chỉ hỏi một lần trong đời kho.
2. **Sinh sẵn (S3, tuỳ chọn).** Khuôn có tệp mẫu → lệnh tạo màn sinh khung, tác tử điền khe (T1).
3. **Kiểm vật (S4).** Mọi tệp vòng chạm mà khớp `nhan_dien` phải dựng `khuon` ở gốc và không dùng
   `cam_ngoai_khuon`; ngoại lệ phải có lý do. Hai đường đo, chọn theo kho:
   - **tĩnh** — đọc cây JSX/TSX (phần đông kho tiêu thụ; Design OS đã có bộ đọc JSX ~630 dòng, hàng chờ DFK-C1);
   - **chạy** — khuôn tự gắn `data-khuon="<loai>"` lên phần tử gốc; bài kiểm giao diện trên bản đang chạy đếm màn
     loại X mà gốc thiếu marker. Đường này không phụ thuộc ngôn ngữ (HTML, Vue, Swift web view…).
   - Hai chiều theo luật kit: tiêm một màn gọi thẳng khối bị cấm thì đỏ đúng tên tệp; chạm `docs/` hay
     `_acceptance/` thì im. Nợ cũ không làm đỏ vòng không gây ra nó (cùng luật «chấm phần đổi» của DFK2); nợ cũ lên
     thẻ thành nhãn, không tự sinh việc (K8).
4. **Đối chiếu (design-pass).** Gói thiết kế tự chụp màn mới cạnh `mau_dang_chay`, cùng khổ và cùng trạng thái
   (T3), ở Cổng 1 sẵn có.

**Khởi tạo cho kho đã có mã (một lần).** Máy dò ứng viên khuôn từ mã: thành phần được ≥ 3 màn dựng ở gốc. Kèm theo
là danh sách tệp cùng loại mà không dựng nó — chính là bản kiểm kê lệch hiện có (ở crm: ngăn KR, ngăn Số KR; ở
invest: hai trang tự dựng `<h1>`). Đây là dạng tổng quát của DFK-C3 («sinh sổ thành phần từ mã»). Invest đã tự
dựng lệnh sinh sổ thành phần trên nhánh M2 của nó — tiền lệ cho thấy việc này máy làm được.

**Cân trên mọi kho (luật 26/09):**

| Kho | Được | Mất |
|---|---|---|
| không khai bản đồ | — | 0: không đọc, không chấm |
| không có giao diện | — | 0: M0 im |
| có bản đồ | màn mới vào khuôn từ lúc dựng; lệch hiện ra ở suite thay vì ở mắt chủ kho | một tệp luật; một lần khởi tạo do máy đề xuất |
| hành vi cũ có ai dựa không? | không — khoá mới, không đổi mặc định | — |

### 7.5 Bộ nguyên tắc cho tác tử viết mã — mỗi dòng đi kèm răng của nó

Lời dặn một mình không phải nghiệm. Bảy nguyên tắc dưới chép được vào `AGENTS.md` của bất kỳ kho nào, nhưng **chỉ
tính khi cột phải có răng**:

| # | Nguyên tắc | Răng giữ nó |
|---|---|---|
| 1 | **Xếp loại trước khi dựng.** Gọi tên loại màn; mở và đọc tệp mẫu đang chạy của loại đó trước khi viết dòng nào. | S1 nạp mẫu vào ngữ cảnh; tiêu chí «theo khuôn Y» tự vào hợp đồng |
| 2 | **Điền khe, không dựng khung.** Khung thiếu khe thì sửa khung một chỗ, mọi màn cùng hưởng; ghi lý do trong PR. | S4: tệp loại X không dựng khuôn X thì đỏ |
| 3 | **Không tự vẽ trạng thái.** Chờ · rỗng · lỗi · không quyền · không thấy luôn dùng thành phần trạng thái của khuôn. | S4: khối trạng thái trần ngoài khuôn thì đỏ |
| 4 | **Chép mẫu đang chạy, không chép mã gần nhất.** Mã gần nhất là mã dễ lệch nhất (Design OS). | `mau_dang_chay` là tệp duy nhất được nạp làm mẫu |
| 5 | **Loại mới thì rút khuôn ngay trong vòng ấy.** Màn thứ hai cùng loại chỉ điền khe. | thẻ Cổng Phạm vi hiện «loại mới»; S4 đòi bản đồ có loại ấy trước khi ký |
| 6 | **Thành phần mới là bậc cuối, có tên và lý do, hiện cho người thấy.** | thang dùng lại (Design OS) — danh sách `ds-new` lên thẻ |
| 7 | **Khai trong PR: loại · khuôn · mẫu đối chiếu · ngoại lệ.** | máy tự in từ bản đồ, không viết tay |

### 7.6 Giới hạn tất định — khai thẳng

- **Xếp đúng loại cho một màn thật sự mới** thuộc người, một lần mỗi loại, ở Cổng Phạm vi.
  Ngưỡng đang đếm: số màn mỗi vòng không khớp loại nào. Số này không giảm qua các vòng thì bản đồ đang thiếu loại.
- **Khuôn có đúng cho người dùng không** thuộc reality (phiên nghiệm thu, prod), không thuộc thước.
- **«Đọc như cùng một sản phẩm»** chỉ tới được T3 (so cạnh nhau). Phần còn lại là gu, quyết một lần.
- **Bản đồ khuôn chính là một thước mới.** Nó phải có chiều đỏ và chiều im ngay từ bản đầu; không mở vòng
  «đo thước của bản đồ» (luật chiều rộng (a)).

### 7.7 Đường đi theo luật kit

1. **crm chạy thử đúng hình dạng này như vật của kho** (vòng NM1 mở rộng, §5.1): tệp `khuon` của kho + bài quét
   của kho. Mục đích là thử *lược đồ* trên một kho thật trước khi kit đóng băng nó.
2. **invest khai cùng lược đồ** cho vùng vận hành, đo xem bài quét bắt đúng hai trang `<h1>` và im trên phần còn
   lại. Đây là phép thử «cân trên mọi kho» bằng số.
3. **Kit rút cơ chế** — đọc bản đồ, nạp ngữ cảnh S1, kiểm S4 tĩnh/chạy, ảnh đối chiếu — trong **một vòng meta có
   tên** sau mốc kho nhận gần nhất. Đây là CỘNG, nên chủ kho phê đích danh ở Cổng Phạm vi của chính vòng đó.
   Hạt giống DFK-C1 (bộ đọc JSX) và DFK-C3 (sổ từ mã) gộp vào đây làm nguyên liệu.

Thứ tự này đổi chiều so với «kit trước». Kho trả giá một tệp luật và một bài kiểm đổi lấy kết quả ngay. Kit chỉ
đóng băng lược đồ sau khi hai kho thật đã dùng nó, nên không dựng cơ chế trên một ca duy nhất.

---

## 8. Design OS đã giải tới đâu, và các đội hàng đầu đã giải thế nào

Câu hỏi tiếp của chủ kho (30/10): Design OS đã giải vấn đề này chưa? Trước nay con người và các đội hàng đầu giải
nó thế nào, bằng framework hay phương thức nào?

### 8.1 Design OS — đọc toàn bộ kho, không chỉ năm lệnh kit đã vendor

Bản sao `~/dev/designos` có khoảng 100 lệnh; kit vendor 5. Những lệnh chạm vấn đề này:

| Lệnh / tri thức | Làm gì | Có giải lệch giữa các màn không |
|---|---|---|
| `reuse-plan check` + `design-reuse-ladder.md` (đã vendor) | thang 7 bậc; bậc 2 = mẫu màn khai sẵn; mỗi màn phải có dòng `Pattern:` | **giải nửa ý định**: tác tử phải khai khuôn trước khi dựng. Tự khai là không kiểm mã đã dựng |
| `synthesize-conventions` | học «ngữ pháp đã áp dụng» từ màn thật, sinh `CONVENTIONS.md` (DO/DON'T có số đếm theo bố cục, màu, khoảng cách, bo góc, chữ, thành phần, từng phần) | gần nhất với «khởi tạo bản đồ khuôn» — nhưng đầu vào là bản quét **Figma**, không phải mã; tách lệch chủ yếu ở tầng giá trị |
| `vr` | so ảnh tất định (diff · gate · accept) | giữ một màn không trôi khỏi ảnh nền của **chính nó**; không so màn mới với màn mẫu |
| `ds-usage-lint`, `token-coverage`, `gate` | trang có dùng token của hệ không | tầng token, trên HTML |
| `pattern` + `pattern-cards.md` | thẻ mẫu màn rút từ màn sản phẩm khác (đếm trên n, sàn n ≥ 8) | bằng chứng thị trường «thường có gì», tự khai **không phải quyết định** |
| `templates`, `registry`, `scan` | danh mục khuôn, sổ thành phần, dò tín hiệu thiết kế của dự án | nguyên liệu; không có bước kiểm vật theo khuôn |

**Kết luận về Design OS:** nó đã **chẩn đúng bệnh** và có đủ **nguyên liệu**: thang dùng lại, học quy ước từ màn
thật, so ảnh, sổ thành phần. Nó **chưa** có mắt xích cuối: kiểm *mã đã dựng* có đi qua khuôn đã khai, quét trên
toàn bộ màn cùng loại. Đó đúng là bậc T2 của §7.2, và cũng là thứ các đội hàng đầu dưới đây đã phải tự dựng.

### 8.2 Con người đã giải thế nào — bốn thời kỳ

| Thời kỳ | Cách giải | Người giữ nhất quán | Hạn chế |
|---|---|---|---|
| **Sổ tay quy chuẩn** (in ấn, nhận diện; vd. sổ quy chuẩn đồ hoạ của NASA 1975, hệ biển báo tàu điện New York) | luật bằng chữ + hình mẫu | một nhóm trung tâm duyệt từng ấn phẩm | nút cổ chai người duyệt; luật chữ trôi khi nhóm duyệt vắng mặt |
| **Thư viện thành phần** (Bootstrap 2011, rồi design system của từng hãng: Material 2014, Salesforce Lightning + công cụ token 2014–15, Airbnb DLS 2016) | thành phần + token **trong mã** — nhất quán nhờ dùng chung | nhóm design system + designer chọn mẫu ở Figma trước khi kỹ sư code | thành phần thống nhất nhưng **bố cục màn** vẫn do từng đội ghép |
| **Mẫu cấp trang** (Atomic Design 2013 đặt tên tầng *template*; Polaris có khuôn «Resource index», «Resource details», «App settings»; Material có bố cục chuẩn danh sách–chi tiết; GOV.UK có mẫu kèm nghiên cứu và mục «khi nào KHÔNG dùng») | khuôn trang có khe + hướng dẫn chọn khuôn theo loại màn | designer + duyệt thiết kế | chọn đúng khuôn vẫn là việc của người |
| **Ép bằng máy trong CI** | luật lint của chính design system: Atlassian `use-primitives` (bắt dùng primitive) và `ensure-design-token-usage`; Primer `direct-slot-children` (ràng cấu trúc khe), `no-deprecated-props`; Shopify `stylelint-polaris` (hơn 40 luật xếp theo nhóm để **đo độ phủ** hệ trên mã admin, có lệnh chèn chú thích bỏ qua cho mã cũ để bật được ngay); codemod để di chuyển hàng loạt | máy | phần lớn mới ép tầng token và thành phần; tầng khuôn trang ít đội ép bằng máy |

Song song có một nguyên lý từ kỹ thuật nền tảng: **«đường lát sẵn»** (Netflix: *paved road*; Spotify: *golden
path*). Không ép ai, nhưng làm đường đúng **tốt và dễ hơn hẳn** mọi lối khác (khuôn khởi tạo, công cụ có sẵn), nên
các đội tự chọn nó. Đây chính là bậc T0–T1 của §7.2.

### 8.3 Đội hàng đầu giữ nhất quán bằng bốn chân — và chân nào gãy khi tác tử viết mã

1. **Một nguồn:** token + thành phần + khuôn trang có khe.
2. **Đường lát sẵn:** khuôn khởi tạo; đường đúng là đường rẻ nhất.
3. **Ép và đo bằng máy:** luật lint trong CI, số độ phủ, mã cũ được ghi bỏ qua chứ không chặn.
4. **Quản trị đóng góp:** mẫu không vừa thì *đóng góp vào hệ* (nhóm hệ duyệt), không tự chế ở màn.

**Chân thứ năm, ẩn:** trong quy trình của người, **designer chọn khuôn trước khi kỹ sư viết dòng nào**, và duyệt
thiết kế bắt phần còn lại. Khi tác tử viết mã đi thẳng từ yêu cầu sang mã, bước đó biến mất. Điểm chọn «khuôn nào»
trở thành **điểm chọn không ai giữ**. Đó là lý do lệch tăng rõ ở kho do tác tử viết, dù ba chân đầu vẫn còn: crm có
nguồn chung, có khung, có hai răng — nhưng không ai giữ điểm chọn khuôn.

**Vì vậy nghiệm cho kho do tác tử viết = bốn chân của đội hàng đầu + máy thay chỗ designer ở chân năm:**

| Chân | Đội hàng đầu | Kho do tác tử viết (cơ chế §7.4) |
|---|---|---|
| Một nguồn | design system + khuôn trang | tệp bản đồ khuôn của kho |
| Đường lát sẵn | khuôn khởi tạo | S1 nạp khuôn + màn mẫu vào ngữ cảnh; S3 sinh khung |
| Ép và đo | lint CI + số độ phủ | S4 kiểm vật theo khuôn; mã cũ thành nhãn, không chặn |
| Quản trị đóng góp | nhóm hệ duyệt đóng góp | «sửa khung, không thoát khung», ngoại lệ có lý do lên thẻ |
| **Designer chọn khuôn** | người | **máy xếp loại theo bản đồ; chỉ màn thuộc loại mới mới hỏi người, ở Cổng Phạm vi sẵn có, một lần mỗi loại** |

Cột phải không phát minh gì mới về nguyên lý — nó dịch đúng cách đã chạy ở Shopify, Atlassian, GitHub sang chỗ
mà người đã rời khỏi giữa vòng. Thứ thật sự mới chỉ là chân năm.

**Nguồn tra cứu (30/10):** [Stylelint Polaris](https://polaris.shopify.com/tools/stylelint-polaris) ·
[Polaris patterns (bản lưu)](https://shopify.github.io/polaris-react-archive/patterns) ·
[Atlassian `ensure-design-token-usage`](https://atlassian.design/components/eslint-plugin-design-system/ensure-design-token-usage) ·
[`@atlaskit/eslint-plugin-design-system`](https://npmjs.com/package/@atlaskit/eslint-plugin-design-system) ·
[`eslint-plugin-primer-react`](https://www.npmjs.com/package/eslint-plugin-primer-react) ·
[Spotify paved paths (InfoQ)](https://www.infoq.com/jp/news/2021/05/spotify-paved-paths) ·
[Golden paths (platformengineering.org)](https://platformengineering.org/blog/how-to-pave-golden-paths-that-actually-go-somewhere).
Mốc năm của sổ tay NASA, Bootstrap, Material, Atomic Design, Airbnb DLS ghi theo hiểu biết chung, chưa tra lại.

---

## 9. Trình bằng hình — cấu trúc sáu hình

Chủ kho (30/10) muốn ra quyết định bằng hình. Bộ hình tầng 2 theo `docs/reference/DIAGRAM-RULE.md`:
[`assets/2026-10-30-ui-dong-nhat-giua-cac-man.html`](assets/2026-10-30-ui-dong-nhat-giua-cac-man.html). Hình là chiếu
của các mục chữ ở trên; sửa chữ trước rồi vẽ lại.

**Cấu trúc:** sáu câu hỏi theo đúng đường ra quyết định. Mỗi câu dùng loại hình hợp với nó, không gộp nhiều ngữ
pháp vào một hình.

| # | Câu hỏi | Loại hình | Chiếu từ | Vì sao loại này |
|---|---|---|---|---|
| 1 | Lệch ở đâu, chỗ nào có máy giữ? | ma trận (7 điểm chọn × crm · invest · design-floor · Design OS; ô = MÁY / KẾ / LỜI / trống) | §1, §2, §7.1, §7.3 | thấy *chỗ trống* trong một cái nhìn |
| 2 | Vì sao lệch? | hai làn song song (đội người · vòng tác tử) | §3.1, §8.3 | bước «chọn khuôn» bị mất hiện ra ở cùng một cột |
| 3 | Nguyên lý tất định hoá | chồng tầng T0–T4 + «lời dặn» ngoài thang | §7.2 | thang có thứ bậc; thấy đứng ở đâu và đi lên đâu |
| 4 | Thế giới đã giải tới đâu? | bốn góc (tầng giải × lời/máy) | §4, §8 | góc «máy giữ khung» còn trống = chỗ cần lấp |
| 5 | Lời giải chạy thế nào? | kiến trúc (bản đồ khuôn → S1 · S3 · S4; người ở Cổng 1) | §7.4 | ai giữ gì: kho, kit, người |
| 6 | Quyết gì? | lưu đồ hai nhánh kèm giá | §5.3, §7.7 | một câu hỏi, hai lối, hệ quả từng lối |

**Bổ sung số cho hình 1 (đo 30/10, invest `origin/main` `ec899d03`):** invest có skill danh mục giao diện
(`.claude/skills/onehub-ui/`) nói về đầu trang và trạng thái — tức là lời. Lộ trình của invest có hàng
«/ops/deals thiếu PageHeader» (OPS-16) và các hàng GD «đủ tải/trống/lỗi». Bản kiểm kê giao diện tháng 10 của invest
đếm 5 kiểu đầu trang ở vùng vận hành. Cùng lớp với crm: luật bằng lời, lệch sửa sau bằng hàng lộ trình.

**Giới hạn của bộ hình:** vị trí các chấm ở hình 4 là phán đoán định tính, không phải số đo. Ô «LỜI» của invest ở
hàng «loại màn» suy từ việc có skill danh mục và tệp tuyến (`routes.md`), chưa đọc hết nội dung.

---

## 10. Chủ kho đồng ý cách giải · bài học từ gói «ux-kit» của phiên brainstorm khác

**Ghi nhận (30/10):** chủ kho viết «Tôi đồng ý với cách giải». Máy đọc đây là gật nhánh trái ở hình 6 (§7.7): crm
chạy thử bản đồ khuôn như việc của kho → invest khai cùng hình dạng → kit rút cơ chế ở một vòng meta có tên sau mốc
kho nhận. Cửa veto mở: chủ kho nói khác thì sửa dòng này. Không ô nào được mở, không hàng lộ trình nào được thêm từ
phiên này.

Cùng ngày, chủ kho đưa một gói skill do phiên brainstorm khác sinh ra cho cùng câu hỏi (`ux-kit.zip`, 23 tệp, ~1 000
dòng; đã đọc trọn, không chạy gì). Gói gồm: skill `ux-patterns` (8 luật vàng G1–G8, 5 nguyên tắc có thứ tự, bảng
nếu–thì có mã D/L/F/V/S/O/T/E/U/K, ma trận trạng thái, hợp đồng thành phần bằng TypeScript, token hành vi, từ vựng
nhãn, mẫu đặc tả màn, danh sách tự rà), một hook chạy sau mỗi lần sửa tệp, và cấu hình ESLint.

### 10.1 Học được gì — tám điều, xếp theo mức đổi lời giải

| # | Điều | Gói làm thế nào | Đổi gì ở lời giải bản đồ khuôn |
|---|---|---|---|
| H1 | **Xếp loại theo ĐỐI TƯỢNG, không theo tệp** (hướng OOUX) | sổ đăng ký đối tượng; mỗi đối tượng có bộ màn chuẩn List · Detail · Create · Edit; luật G5 «cùng loại đối tượng thì cùng bộ màn và cùng vị trí hành động» | bản đồ khuôn khoá theo đối tượng: `deal`, `kr`, `muc-tieu`… → loại «bản ghi» → khuôn ngăn chi tiết. Ca deal–KR chính là một vi phạm G5. Câu hỏi cho người đổi từ «màn này loại gì» (khó) thành «đối tượng mới thuộc nhóm nào» (người biết). **Thay đổi lớn nhất.** |
| H2 | **Khe bắt buộc qua kiểu — «props là luật»** | `DataView` bắt buộc `skeleton`, `empty.first`, `empty.filtered`, `retry`; thiếu thì không biên dịch | trạng thái rỗng · tải · lỗi thành bắt buộc ngay trong khuôn, kiểm bằng bộ kiểm kiểu có sẵn — không cần bàn đo mới. Chiều đỏ rẻ: một ca `@ts-expect-error` thiếu khe. `RecordSheetFrame` của crm đã bắt `loading`, `error`; thiếu là các nhánh rỗng theo từng khu. |
| H3 | **Cấm nhập khối dựng mà khuôn đã bọc, theo vùng** | `no-restricted-imports` cấm gọi thẳng `dialog`, `alert-dialog` ngoài thư mục khuôn | dạng răng rẻ nhất của T0: ví dụ trong thư mục ngăn bản ghi cấm nhập `DetailSheetHeader`, `Skeleton` trừ tệp khuôn. crm đã có plugin oxlint riêng với ghi đè theo glob (`.oxlintrc.json`) — chỗ đặt sẵn. Giảm phần phải dựng bằng bộ quét JSX tự viết. |
| H4 | **Mỗi luật có MÃ, bảng nếu–thì** | `D-01`, `L-03`, `O-04`…; mã ghi vào mã nguồn và báo cáo | luật ở tầng hành vi (cách ghi, phản hồi) có mã → tiêu chí hợp đồng trỏ mã, S4 chấm theo mã, máy đếm được mã nào chưa có răng. Bảng «Ghi vào bản ghi» 30/10 của crm đã là bảng nếu–thì, chỉ thiếu mã. |
| H5 | **Nguyên tắc có thứ tự + luật phá hoà** | P1 không mất dữ liệu > P2 biết chuyện gì xảy ra > P3 nhất quán > P4 nhanh > P5 tối giản | đây là cách đổi «gu» (T4) thành luật máy áp: người xếp thứ tự MỘT lần, xung đột sau đó máy tự phân xử. Khớp đúng «chính sách chốt một lần ở Cổng Đáng» của kit. |
| H6 | **Token hành vi** | thời gian chờ, debounce, z-index, ngưỡng số ô của form… gom một tệp | mở rộng điểm chọn 7 (§7.3) từ giá trị thị giác sang giá trị hành vi. Luật «tối đa ba ô thì `Dialog`» của crm hôm nay là token hành vi viết bằng chữ. |
| H7 | **Phản hồi ngay lúc sửa tệp** | hook sau mỗi lần sửa, thoát 2 để gửi lỗi về tác tử | cùng bài quét của S4 có thể chạy sớm hơn, lúc tác tử đang viết — rẻ hơn chờ tới lượt chấm. Phải là bản đọc cây cú pháp và có vùng, không phải grep (xem K4). |
| H8 | **Luật đi trước mã + mẫu đề xuất mẫu mới** | G1: không luật nào khớp thì đề xuất theo mẫu, duyệt xong ghi luật rồi mới dựng | khớp «loại mới → rút khuôn trong chính vòng». Mẫu đề xuất của gói (tình huống · vì sao luật cũ không khớp · hành vi · nguyên tắc ưu tiên · phạm vi) dùng được làm khuôn cho mục «loại mới» trên thẻ Cổng Phạm vi. |

### 10.2 Không lấy — năm điều, kèm lý do đo được

| # | Điều | Vì sao không |
|---|---|---|
| K1 | **Lấy nguyên bộ luật mặc định** | va trực tiếp với quyết định crm đã chốt: gói V-03 «nút gửi luôn bật» ↔ crm `docs/settings.md` «Nút gửi tắt tới khi form hợp lệ» (đã ký trong `khung-tao-okr-nhu-deal` AC-4); gói O-02 «≤ 6 ô thì hộp thoại» ↔ crm «tối đa ba ô thì `Dialog`»; gói cấm gọi thẳng thư viện báo nổi ↔ crm có 144 tệp gọi thẳng `sonner`. Luật phải rút từ quyết định của kho và màn đang chạy, không nhập từ một bộ mặc định viết chung — nếu không là một trí tưởng tượng viết luật thay chủ kho. |
| K2 | **G1 «dừng lại chờ duyệt»** mỗi khi không có luật khớp | thêm lượt gọi người giữa vòng, trái mục tiêu ≤ 3 lượt/vòng. Dịch sang kit: đề xuất thành một mục trên thẻ cổng đã có, máy đi tiếp phần không phụ thuộc. |
| K3 | **Đặc tả màn + danh sách tự rà làm bằng chứng** | là lời tự khai (mức «KẾ»/«LỜI» ở hình 1). Kit chỉ tính bằng chứng có chiều đỏ. Giữ đặc tả làm đầu vào cho tác tử, không làm bằng chứng. |
| K4 | **Hook grep trên mọi `.ts`** | bắt nhầm: `setTimeout(fn, 1000)` ở mã máy chủ cũng bị chặn; mù chú thích và chuỗi — đúng lớp lỗi K3 của bản phạm vi DFK (mã màu trong chú thích bị bắt). Không có ca đối chứng nào chứng minh hook đỏ đúng và im đúng. |
| K5 | **Dựng mới lớp `src/ux/` mười thành phần** | crm đã có tương đương trong `packages/ui` và `apps/app` (`VungTaiLoi`, `KhungTaiLoi`, `RecordSheetFrame`, `ConfirmDialog`, bộ giữ thay đổi `useKhaiThayDoi`…). Việc đúng là **ánh xạ vai trò → thành phần sẵn có** trong bản đồ khuôn, không dựng lớp song song. |

### 10.3 Lời giải sau khi học

Bản đồ khuôn (§7.4) đổi ba chỗ, hình 3 và hình 5 vẽ lại theo:

1. **Khoá theo đối tượng (H1).** `doi_tuong → loai`, rồi `loai → khuon · mau_dang_chay · trang_thai`. Điểm hỏi người
   duy nhất thành «đối tượng mới thuộc nhóm nào».
2. **Răng ba lớp, từ rẻ tới đắt:** kiểu bắt buộc khe (H2) → cấm nhập khối dựng theo vùng bằng lint sẵn có của kho (H3)
   → bài quét «tệp loại X dựng khuôn X» chỉ cho phần hai lớp trên không phủ. Cả ba chạy được lúc sửa (H7) và ở S4.
3. **Tầng hành vi có mã luật (H4) và token hành vi (H6)**, giá trị rút từ `docs/design.md` và `docs/settings.md` của
   kho, không nhập mặc định (K1).

Vòng crm chạy thử (§5.1) giữ nguyên cỡ 8–10 tiêu chí. Bước 3 của nó dùng H3 trước (rẻ hơn bộ quét tự viết), và bước 2
thêm khe bắt buộc cho trạng thái trong khuôn ngăn (H2).

---

## 11. Nếu bản đồ khuôn nằm trong kit — kiến trúc và các giai đoạn nó đi qua

Chủ kho hỏi (30/10): nếu cơ chế này tồn tại trong kit thì kiến trúc ra sao, và nó đi qua các giai đoạn thế nào?
Mục này là **thiết kế để quyết hướng**, chưa phải hợp đồng. Thứ tự đã chốt ở §10 vẫn giữ: crm làm trước như việc
của kho, kit rút cơ chế sau. Bảng §11.7 nói phần nào crm dựng bây giờ sẽ thành phần nào của kit sau này.
Hình 7 và hình 8 trong trang hình là chiếu của mục này.

### 11.1 Năm nguyên tắc kiến trúc — mỗi cái neo vào một tiền lệ của kit

| # | Nguyên tắc | Tiền lệ |
|---|---|---|
| A1 | **Kho giữ giá trị, kit giữ cơ chế.** Kho khai đối tượng, nhóm, khuôn, màn mẫu; kit đọc, nạp, kiểm, trình. Kho không khai thì không đổi gì. | hình dạng DFK-C2 chủ kho chốt 30/10; luật 26/09 |
| A2 | **Đường cố định, không thêm khoá cấu hình.** Bản đồ nằm ở `design/patterns/<nhóm>.md` của kho — đúng thư mục mà thang dùng lại của Design OS (đã vendor) tự nhận làm «mẫu màn» ở bậc 2. Một tệp phục vụ hai việc, không ổ cắm mới. | ADR 0024 (luật sản phẩm ở đường cố định); `design-reuse-ladder.md` |
| A3 | **Trục riêng, không phải bậc M.** Bậc M0–M3 nói về token; khuôn chạy được cả ở M0. crm hôm nay là M0 vẫn dùng được, không phải trả nợ mã màu trước. | crm đo ở §2: `design-floor-bac` in M0 |
| A4 | **Răng ba lớp, rẻ trước đắt sau:** (1) kiểu bắt buộc khe — sống trong mã khuôn của kho, chạy trong suite sẵn có; (2) lint cấm nhập khối dựng theo vùng — cấu hình lint của kho, kit chỉ *sinh gợi ý*; (3) bài quét của kit — chỉ cho phần hai lớp trên không phủ. | §10 H2, H3; crm có plugin oxlint riêng |
| A5 | **Không thêm cổng người.** Người chỉ xuất hiện ở cổng đã có, và chỉ khi gặp một đối tượng chưa có trong bản đồ. Mọi kết quả khác lên thẻ thành dòng thông tin. | bất biến ≤ 3 lượt/vòng; K8 (nhãn không tự sinh việc) |

### 11.2 Thành phần

| Thành phần | Ai giữ | Ở đâu | Vai |
|---|---|---|---|
| **Bản đồ khuôn** — mỗi nhóm một tệp | kho | `design/patterns/<nhóm>.md` | khai đối tượng thuộc nhóm, khuôn, màn mẫu, khe, khối cấm, ngoại lệ |
| **Khuôn có khe** | kho | mã của kho (vd `RecordSheetFrame`) | khe bắt buộc qua kiểu; bộ kiểm kiểu của kho chấm |
| **Lint cấm nhập theo vùng** | kho | cấu hình lint của kho | chặn dùng khối dựng ngoài khuôn; kit sinh đoạn cấu hình gợi ý từ bản đồ |
| **Lệnh khuôn** — bốn chế độ: `de-xuat` · `nap` · `kiem` · `goi-y-lint` | kit | `scripts/design-floor-khuon.mjs` (tên dự kiến) | dò từ mã · nạp vào vòng · kiểm vật · in cấu hình lint |
| **Tệp kết quả lượt chấm** | kit ghi, thẻ đọc | `_acceptance/<slug>/khuon-cham.json` | nguồn duy nhất cho thẻ — thẻ không tự chạm git (cùng luật với `luat-cham.json`) |
| **Khối «Khuôn» trên thẻ** | kit | `scripts/gate-card.js` | Cổng 1: nhóm đã chọn, màn mẫu, đối tượng mới. Cổng 2: số tệp theo khuôn, lệch mới, nợ cũ |
| **Ảnh đối chiếu** | kit | skill `design-pass` | chụp màn mới cạnh màn mẫu, cùng khổ, cùng trạng thái |
| **Kiểm lúc sửa** (tuỳ chọn) | kho bật | hook của kho gọi `kiem --tep` | phản hồi sớm, trước lượt chấm |
| **Nguyên liệu từ Design OS** | vendor | bộ đọc JSX/TSX (hàng chờ DFK-C1) · sổ từ mã (DFK-C3) · thang dùng lại (đã có) | parser cho `kiem` · dữ liệu cho `de-xuat` · dòng `Pattern:` trỏ nhóm |

### 11.3 Hình dạng một tệp bản đồ (ví dụ của crm, giá trị là của kho)

```markdown
---
nhom: ngan-ban-ghi
doi_tuong: [deal, lien-he, cong-ty, ke-hoach, muc-tieu, kr]
khuon: { ten: RecordSheetFrame, nhap: "@/components/crm/record-sheet/record-parts" }
nhan_dien: ["apps/app/components/crm/record-sheet/*-sheet.tsx"]
mau_dang_chay: { tep: "apps/app/components/crm/record-sheet/deal-sheet.tsx", duong: "/deals?record=deal:<mau>", trang_thai: [dang-tai, loi, xong] }
khe_bat_buoc: [loading, error, tabs]
cam_ngoai_khuon: [DetailSheetHeader, Skeleton, Spinner, VungTaiLoi]
ngoai_le: []          # { tep, ly_do } — lý do bắt buộc
luat: [KH-ghi-tai-cho, KH-loi-noi-ly-do]   # mã luật hành vi, câu luật nằm trong thân tệp
---
# Ngăn bản ghi
<câu chữ cho người và tác tử: khi nào dùng, khi nào KHÔNG dùng, luật hành vi kèm mã>
```

Một màn thuộc nhóm theo **đối tượng nó trình bày** (H1). `nhan_dien` chỉ dùng để quét tệp. Hai nguồn lệch nhau —
đối tượng `kr` mà tệp `kr-sheet.tsx` không dựng `RecordSheetFrame` — chính là ca lệch cần bắt.

### 11.4 Đi qua các giai đoạn

| Giai đoạn | Máy làm | Người | Ghi gì | Thiếu / không đo được |
|---|---|---|---|---|
| **Khởi tạo kho** (một lần, cùng lệnh «bật nền thiết kế» DFK1) | `de-xuat`: tìm thành phần mà ≥ 3 màn dựng ở gốc → nháp `design/patterns/*.md` + danh sách màn đang lệch | duyệt bản đồ **một lần**, commit như mọi tệp luật của kho | nháp bản đồ; danh sách lệch là **nhãn**, không tự thành việc (K8) | kho không có giao diện → không đề xuất gì |
| **S0** | lệnh bậc in thêm một dòng «khuôn: N nhóm, M đối tượng» | — | — | không có `design/patterns/` → không in gì |
| **S1, bước 0d** | `nap`: từ ô và hợp đồng suy đối tượng → nhóm → nạp khuôn + **đọc tệp màn mẫu** trước khi chọn phương án; ghi khối `khuon` vào `design-floor.json`; thêm eval máy `config:executors.design.khuon` vào `evals.yaml` | — | `design-floor.json`, `evals.yaml` | đối tượng chưa có trong bản đồ → soạn nháp mục bản đồ theo khuyến nghị + một dòng «Hỏi-n» (nguồn «chỉ người có») |
| **S1-D** (`design-pass`) | chụp màn mới cạnh màn mẫu, cùng khổ và trạng thái | phản ứng lúc rảnh (không đồng bộ, như hôm nay) | ảnh trong hồ sơ | không có màn mẫu chạy được → cờ vàng |
| **Cổng 1 (Phạm vi)** | thẻ in khối «Khuôn»: nhóm, màn mẫu, ảnh cạnh nhau | **chỉ khi có đối tượng mới**: một chạm chọn nhóm (khuyến nghị sẵn) | máy ghi mục bản đồ mới vào commit của vòng | — |
| **S3** | dựng bằng khuôn; kho bật hook thì `kiem --tep` sau mỗi lần sửa; cuối S3 giữ nguyên bước 2b | — | — | — |
| **S4** | `kiem --base`: tệp vòng chạm khớp `nhan_dien` hoặc thuộc đối tượng trong bản đồ phải dựng khuôn và không dùng khối cấm; chỉ chấm dòng thêm/đổi; kiểu và lint chạy trong suite của kho | — | `khuon-cham.json` | parser không đọc được tệp → «không đo được», **không chặn** |
| **Cổng 2 (Bằng chứng)** | thẻ in «Khuôn: k tệp theo khuôn · 0 lệch mới · nợ cũ j (nhãn)» + ảnh đối chiếu | đọc như mọi dòng thẻ — **không thêm câu hỏi** | — | — |
| **Sau gộp / thực tế** | — | chủ kho vẫn thấy lệch khi dùng | một dòng đếm: lệch lọt qua lưới | đếm tăng = bản đồ thiếu luật hoặc thước lệch (§11.6) |

**Đếm lượt người:** một lần khi khởi tạo kho; mỗi vòng **0**, trừ vòng mang đối tượng mới — khi đó một chạm, ở Cổng
1 sẵn có. Không mục nào cộng lượt ngoài thiết kế.

### 11.5 Hai chiều của thước (bắt buộc trong bộ đo của kit)

| Chiều | Ca | Kỳ vọng |
|---|---|---|
| đỏ | tiêm một tệp nhóm «ngăn bản ghi» gọi thẳng `DetailSheetHeader` | REJECT, gọi đúng tên tệp và khối cấm |
| đỏ | đối tượng `kr` khai trong bản đồ, tệp của nó không dựng khuôn | REJECT, nói «đối tượng kr thuộc ngăn-ban-ghi» |
| đỏ | ngoại lệ không có `ly_do` | REJECT ở bước đọc bản đồ |
| im | chỉ sửa `docs/`, `_acceptance/`, hay tệp ngoài mọi nhóm | PASS, không dòng nào |
| im | nợ cũ trong tệp vòng chạm nhưng dòng thêm không lệch | PASS + nhãn nợ cũ |
| đối chứng dương | bản đồ và mã nguyên vẹn sau khi crm đưa ngăn KR vào khuôn | PASS — trước khi tin mọi ca đỏ |

### 11.6 Cân trên mọi kho · đường đọc cũ · giới hạn

- **Kho không khai bản đồ:** lệnh không in, không ghi, thẻ không có khối — nhận bản mới không đổi một byte hành vi.
- **Kho không phải React:** lớp kiểu và lint không áp; lệnh `kiem` dùng đường «chạy»: khuôn tự gắn
  `data-khuon="<nhóm>"` lên phần tử gốc, bài kiểm giao diện đếm màn thiếu dấu. Đây là giới hạn đã khai, không dựng
  trước khi có kho cần.
- **Hồ sơ cũ:** không có `khuon-cham.json` → thẻ cờ vàng đường đọc cũ, không bắt chuyển đổi.
- **Giới hạn đã khai, kèm ngưỡng:** thước chứng minh màn *đi qua khuôn*, không chứng minh khuôn *đúng cho người
  dùng* (thuộc thực tế) hay màn *trông giống* (thuộc ảnh đối chiếu). Ngưỡng đếm: số lần chủ kho thấy lệch khi
  dùng mà lưới không bắt. Hai lần giữa hai mốc thì mở lại thiết kế bản đồ.

### 11.7 crm dựng bây giờ → kit rút sau

| crm làm trong vòng chạy thử (việc của kho) | Thành phần kit rút ra sau |
|---|---|
| tệp `design/patterns/ngan-ban-ghi.md` theo §11.3 | lược đồ bản đồ + bộ đọc + bộ đo lược đồ |
| khe bắt buộc trong `RecordSheetFrame`; ngăn KR và Số KR vào khuôn | (không rút — là vật của kho) |
| luật oxlint cấm nhập trong thư mục ngăn bản ghi | chế độ `goi-y-lint` sinh đoạn cấu hình từ bản đồ |
| bài kiểm dựng trên `quet-jsx.ts` cho phần lint không phủ | chế độ `kiem` + bộ đọc JSX (DFK-C1) + `khuon-cham.json` |
| dòng «màn mẫu» trong `docs/proto.md` cho `design-pass` | bước chụp đối chiếu của skill `design-pass` |
| (invest khai cùng lược đồ cho vùng vận hành, đo bắt đúng 2 trang lệch) | chế độ `de-xuat` + khối thẻ + dòng S0 — vòng meta có tên sau mốc kho nhận, phần CỘNG chủ kho phê |

---

## 12. Bản kiến trúc để chủ kho duyệt cuối

Tổng hợp §7.4, §10.3 và §11 thành MỘT hình kiến trúc tương tác (skill archify):
[`assets/2026-10-30-kien-truc-ban-do-khuon.html`](assets/2026-10-30-kien-truc-ban-do-khuon.html).
Đặc tả nguồn: [`assets/2026-10-30-kien-truc-ban-do-khuon.archify.json`](assets/2026-10-30-kien-truc-ban-do-khuon.archify.json).
Hình là chiếu của chữ ở các mục trên: sửa thì sửa chữ và đặc tả, rồi xuất lại.

**Cách đọc:**
- Ba vùng: KHO giữ giá trị (trái) · KIT giữ cơ chế (giữa) · DESIGN OS cấp nguyên liệu (dưới).
- Đường chính màu xanh đậm: bản đồ khuôn → lệnh khuôn → tệp kết quả lượt chấm → thẻ cổng → chủ kho.
- Tác tử viết mã nằm ngoài cả ba vùng: lệnh khuôn nạp khuôn cho nó, nó điền khe vào khuôn của kho.
- Nét đứt quanh viền trên: chỗ duy nhất người ghi vào bản đồ — khi vòng mang một đối tượng mới.
- Bốn «guided view» ở đầu trang lọc theo từng câu hỏi: đường chính · tác tử dựng màn · người chạm ở đâu · nguyên liệu Design OS.

**Biên nhận máy (30/10):** `validate --quality showcase` 9/9 kiểm, 0 lỗi, 0 cảnh báo. `deliver` đặc tả sha256
`9ef7dea3…` (7 888 byte) → HTML sha256 `cbdfad3d…` (714 628 byte). `visual-check` không tràn ở 1440×900, 1600×1000,
1920×1080, 2048×1320; chữ nhỏ nhất 6,45 px ở 1440 (ngưỡng 6). Máy đã tự xem ảnh sáng/tối ở khổ nhỏ nhất và lớn nhất,
qua hai vòng sửa bằng mắt: (1) tác tử bị vùng KIT bao nhầm và đường «đối tượng mới» chạy dưới thanh điều hướng →
đưa tác tử ra ngoài, đổi đường lên trên; (2) nhãn «đối tượng mới» bị cắt ở mép trên → đặt xuống dưới nét. Ảnh chụp
kiểm tra để ngoài kho.

**Giới hạn:** chữ của khung trình xem (Light/Dark, Present, Export, Legend, tên loại khối Frontend/Backend…) là
tiếng Anh — trình xem chỉ có giao diện tiếng Anh và tiếng Trung; nội dung hình là tiếng Việt.
