# Hạt giống — `--skip-unchanged` dập tắt đúng tín hiệu `evals_not_machine_touched`

**Ngày:** 2026-09-20 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T2
(`feature-loop/scripts/repin-lane.mjs`, vị ngữ bỏ-qua — ĐỔI HÀNH VI CHẶN nên không thuộc
vòng đã sinh ra nó).
**Sinh từ:** hồ sơ `_acceptance/ghim-lai-noi-ra-o-khong-do/` — mục Ngoài-1 của Cổng Bằng
chứng round 3, owner định đoạt «mở hợp đồng mới» (20/09).

## Lỗ

Hai vị từ mâu thuẫn trong CÙNG một tệp:

- `chamTuPin` tính diff THÔ từ pin cũ tới HEAD — cố ý không loại `_acceptance/`, vì
  `paths` của một eval UI thường trỏ răng của chính nó dưới `_acceptance/<slug>/rang/**`,
  và răng đổi LÀ vật đổi.
- Vị ngữ của `--skip-unchanged` (`laVatHoSo(f) = f.split('/').includes('_acceptance')`)
  xếp mọi tệp dưới `_acceptance/` là «không phải vật», KHÔNG có vế ghi-đè theo
  `eval.paths` — nên làn bỏ qua TRƯỚC khi tính gì.

Tái lập thật trên fixture ma trận của vòng (E6 `paths: ["apps/x/**",
"_acceptance/feat-gn/rang/**"]`, chỉ commit một thay đổi ở `rang/r.mjs`):
`--skip-unchanged` → «cây bằng pin … làn bỏ qua», `{"skipped": true}`; làn `--write`
trên CÙNG cây → `"evals_not_machine_touched":["E6"]`.

`feature-loop/scripts/s4-args.mjs:326` dựng đúng vị từ ấy CÓ vế ghi-đè
(`!pathsKhaiRes.some(...) && ngoaiVatRes.some(...)`) và chú thích ngay trên nó nêu lý do —
`repin-lane.mjs` làm đúng thứ chú thích đó cấm.

**Tần suất, đo 20/09:** `paths` trỏ vào `_acceptance/` — crm **202** dòng / 44 hồ sơ ·
oneflow 20 / 41 · kit 32 / 79. Không hiếm. `--skip-unchanged` là chế độ của chiến dịch ghim
lại theo mốc phát hành (GUIDE §7.1, 2.14), nên tín hiệu bị dập ở đúng chỗ cần nó; lệnh đếm
ngưỡng ở GUIDE §7.1 sẽ đếm hụt. Lỗ này áp cả eval MÁY khai `paths` trỏ răng.

## Việc

Vế ghi-đè giống `s4-args.mjs`: tệp khớp `paths` của bất kỳ eval nào của hồ sơ là VẬT, bất
kể nằm dưới `_acceptance/` hay t1. Răng: `tests/scripts/repin-lane-skip-unchanged.test.mjs`
thêm ca «chỉ răng dưới `_acceptance/` đổi mà `paths` trỏ vào → làn KHÔNG bỏ qua», hai chiều.

## Ngưỡng mở ô

- ≥1 lượt ghim `--skip-unchanged` trên kho tiêu thụ mà lượt `--write` cùng cây cho khoá
  `evals_not_machine_touched` (đo bằng chạy hai lần trên cùng HEAD); hoặc mở kèm khi có vòng
  khác đã chạm vị ngữ `--skip-unchanged`.
