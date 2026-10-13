# Đo 11/10 — múi giờ của tổ chức trong crm

Kho `crm`, cây `27d47de04` (`origin/onehub` lúc đo). Lệnh sinh tệp này: `do-mui-gio.sh` cùng thư mục — chỉ đọc.

## 1. Tệp mã sản phẩm khai múi giờ Việt Nam (`Asia/Ho_Chi_Minh` hoặc `+07:00`)

Bỏ test, spec, bản mẫu `proto`, tài liệu, `package.json`.

```
apps/agent/agent/lib/ai-doi-soat.ts:114:		`${thangVN(now)}-${hai(AI_DOI_SOAT.ngayChay)}T${hai(AI_DOI_SOAT.gioChayVN)}:00:00+07:00`,
apps/api/scripts/okr-mau/lenh.ts:38:					? Date.parse(`${mocTho}T12:00:00+07:00`)
apps/api/src/okr/okr-xem.service.ts:641:						new Date(`${tuan}T00:00:00+07:00`),
apps/api/src/tai-lieu/tai-lieu-config.ts:22:	gioXacMinh: "12:00:00+07:00",
apps/app/app/(app)/[slug]/okr/cap-nhat-tuan/cap-nhat-tuan.tsx:85:const MUI_GIO = "Asia/Ho_Chi_Minh";
apps/app/app/(app)/[slug]/okr/cap-nhat-tuan/cap-nhat-tuan.tsx:117:		timeZone: "Asia/Ho_Chi_Minh",
apps/app/app/(app)/[slug]/okr/hoi-y/man-hoi-y.ts:20:	muiGio: "Asia/Ho_Chi_Minh",
apps/app/app/(app)/[slug]/okr/hoi-y/man-hoi-y.ts:21:	lechGio: "+07:00",
apps/app/lib/okr-chu-ky-nhan.ts:2:	muiGio: "Asia/Ho_Chi_Minh",
apps/app/lib/tai-lieu-man.ts:20:	muiGio: "Asia/Ho_Chi_Minh",
packages/auth/src/thu-mat-khau.ts:65:			new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
packages/db/src/ai-chi-phi.ts:60:	return dauNgayVN(new Date(`${thang}-01T12:00:00+07:00`));
packages/db/src/onboarding-nhac.ts:52:	muiGio: "Asia/Ho_Chi_Minh",
packages/db/src/tai-lieu-hoi.ts:17:	return dauNgayVN(new Date(`${ngayVN(now).slice(0, 8)}01T12:00:00+07:00`));
```

Số tệp: **12** · số dòng: **14**

## 2. Hàm «ngày/giờ Việt Nam» tự dựng

```
apps/app/app/(app)/[slug]/okr/cap-nhat-tuan/cap-nhat-tuan.tsx:115:function ngayVN(luc: string): string {
apps/app/app/(app)/[slug]/okr/hoi-y/man-hoi-y.ts:137:export function homNayVN(bayGio: number): string {
apps/app/app/(app)/[slug]/okr/hoi-y/man-hoi-y.ts:153:export function gioVN(iso: string): string {
apps/app/lib/okr-chu-ky-nhan.ts:15:export function homNayVn(luc: Date): string {
packages/db/src/ai-chi-phi.ts:43:export function thangVN(at: Date): string {
packages/db/src/onboarding-nhac.ts:92:export function ngayVN(d: Date): string {
packages/db/src/onboarding-nhac.ts:110:export function gioVN(d: Date): string {
packages/db/src/onboarding-nhac.ts:114:export function dauNgayVN(now: Date): Date {
```

## 3. Chỗ khai múi giờ trong khuôn dữ liệu

Số dòng nhắc múi giờ trong `*.prisma`: **0** — múi giờ không phải cấu hình của không gian làm việc.

## 4. Lựa chọn về múi giờ trong sổ quyết định của mọi hồ sơ

Số hồ sơ: **238**. Dòng sổ nhắc «múi giờ»/«timezone», tách theo bước và người quyết:

```
S1         máy   3
S3         máy   2
gate2      máy   1
gate2      người 5
```

Mọi dòng NGƯỜI quyết trong số đó (hồ sơ · bước · đầu câu):

```
dieu-phoi-va · gate2 · Ngoài-8: ghi Known limits — Người mở Tổng quan từ trình duyệt đặt múi giờ khác Việt Nam, trong vài giờ quanh n
dot-hoi-y-tuong-okr · gate2 · Ngoài-4: ghi Known limits — múi giờ và đơn vị thời gian của màn Hỏi ý khai lại thay vì dùng cấu hình khu OKR
dot-hoi-y-tuong-okr · gate2 · Ngoài-3: ghi Known limits — đơn vị phút và múi giờ của màn Hỏi ý khai riêng
tim-va-dieu-huong-kho · gate2 · Ngoài-13 «Shape 2: expected dates and fake clock in E8 are computed with dauNgayVN, the same function the serv
zalo-gio-theo-mui-gio-xuong · gate2 · Ngoài-1: ghi Known limits — câu expected của E1 hứa so từng ô với Intl.DateTimeFormat khai múi giờ mà test khô
```

## 5. Hồ sơ neo: `okr-soat-anh-luot-3`

Hai mục ngoài hợp đồng về múi giờ (thứ tự trong `review-findings.md`):

```
Ngoài-1: **okr-chu-ky-nhan.ts dựng lại helper «hôm nay giờ Việt Nam» và hằng múi giờ đã có sẵn ở @crm/db/onboarding-nhac**
Ngoài-7: **New code hardcodes the Vietnam timezone again and rewrites the existing ngayVN helper (r1)**
```

Cách chúng được quyết — dòng Known limits trong `contract.md`:

```
- Ngoài-1 và Ngoài-7: phần gợi ý tên chu kỳ tự giữ cách tính «hôm nay giờ Việt Nam» (`homNayVn`, `OKR_CHU_KY.muiGio`) thay vì dùng `ngayVN` có sẵn ở `@crm/db/onboarding-nhac` mà API OKR đang dùng; đổi múi giờ ở một chỗ mà quên chỗ kia thì gợi ý tên có thể lệch ngày.
```

## 6. Vòng riêng đã tốn cho lỗi múi giờ

- `zalo-gio-theo-mui-gio-xuong` — 3 tiêu chí, status: signed-off
- `ngay-gieo-theo-gio-vn` — 6 tiêu chí, status: signed-off
