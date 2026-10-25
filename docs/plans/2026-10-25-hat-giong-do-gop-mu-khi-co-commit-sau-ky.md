# Hạt giống — thước ký → gộp mù khi PR còn commit sau chữ ký

Gốc: `_acceptance/ky-den-gop/` — thước «ký → gộp» của hồ sơ ấy (`dieu-phoi/scripts/do-gop.mjs`, khoá `ky_den_gop` của
`dieu-phoi.mjs dem`). Ô ghi hạt giống này: `_acceptance/release-2-34-0/` (hồ sơ mốc 2.34.0 trích lại tên tệp ở `## Notes`).

## Người dùng gặp gì

Khi đếm năm dòng số cho mốc 2.34.0 (25/10), hàm `soDoGop` trả rỗng giờ ký và giờ gộp cho **4/7** hồ sơ của cửa sổ đã
ký và đã gộp vào nhánh chính kit: `suc-khoe-cho-trong-va-toc-do`, `anh-co-that-trong-ho-so`, `ghi-tri-thuc`,
`thiet-ke-nap-tri-thuc`. Điểm chung: PR còn commit SAU commit chữ ký (ghim lại sau chữ ký, hạt giống ghi sau ký, gộp
nhánh chính vào nhánh). Ba hồ sơ đọc được (`ky-den-gop`, `kho-tri-thuc-va-lint`, `o-mo-viec-mang-nguon`) có commit chữ
ký là đầu nhánh lúc gộp. Hàng mất số đúng là hàng tốn nhất: hai trong bốn có ghim lại sau chữ ký (57′, 44′), ký → gộp
đo tay 1 g 33 – 7 g 33. Lệnh `dem` xếp các hàng ấy vào `chua_do` như thể gộp squash — người đọc `ky_den_gop` thấy trung
vị đẹp hơn thật.

## Đọc mã (kit, `main` 396c08f8)

- `dieu-phoi/scripts/do-gop.mjs:28` — tìm commit gộp bằng `git rev-list --first-parent --reverse --ancestry-path
  <ký>..origin/<nhánh chính>`. Trên git 2.37.1 (máy cắt mốc), cặp cờ này không đi qua cha thứ hai của commit gộp
  khi commit ký không phải cha trực tiếp → danh sách rỗng → `rong`.
- Đo tay cùng định nghĩa của tệp: commit đầu trên lối cha-đầu của nhánh chính mà `git merge-base --is-ancestor <ký> <x>`
  đúng. Kết quả ở bảng năm dòng số, mục `2.34.0` của `CHANGELOG.md`.

Chưa đo: hành vi trên git mới hơn (2.38+ đổi cách `--ancestry-path` nhận đối số), và số hàng `chua_do` ở các đợt crm.
Ca DG-1…DG-4 của `tests/dieu-phoi/loi/do-gop.test.mjs` dựng lịch sử trong đó commit ký là đầu nhánh — không có ca nào có
commit sau chữ ký.

## Ngưỡng mở ô

≥ 1 lần nữa `dieu-phoi.mjs dem` ở một kho có hàng đã gộp mà `ky_den_gop` vắng, trong khi đo tay theo định nghĩa của tệp
ra được số.
