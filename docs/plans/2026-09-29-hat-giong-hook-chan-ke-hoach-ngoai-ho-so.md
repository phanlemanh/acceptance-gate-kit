# Hạt giống — hook chặn xoá kẹt vĩnh viễn khi kế hoạch superpowers không thuộc hồ sơ nào

**Ngày:** 2026-09-29 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: acceptance-gate-kit/_acceptance/mot-so-ba-ve — lượt chấm 1, mục Ngoài-6 của `review-findings.md`; owner chọn «mở hợp đồng mới» ở Cổng Bằng chứng 29/09.

## Ca

Hook `ruling-truoc-khi-xoa` (AC-6 của `mot-so-ba-ve`) chặn `rm` đệ quy vào `.superpowers/sdd/<ws>/`
cho tới khi cầu nối gặt ruling vào sổ. Ở kho CÓ kit mà kế hoạch superpowers không gắn với hồ sơ
nào (tên thư mục bỏ tiền tố ngày không trùng slug, ledger không có dòng
`_acceptance/<slug>/contract.md`), cầu nối thoát 2 «không suy được hồ sơ», hook thoát 2 và in lệnh
chạy tay kèm `--slug <slug>`. Không có slug nào để điền, nên làm theo vẫn không gỡ được: lần xoá kế
tiếp lại bị chặn. Người (hay phiên) bị kẹt cho tới khi né chốt bằng đường khác `rm`.

Vòng `mot-so-ba-ve` đã gỡ ca kho CHƯA dùng kit (không có `_acceptance/config.yaml` → hook im, dòng
sổ d-18). Ca còn lại là kho có kit, kế hoạch ngoài hồ sơ.

## Dạng nghiệm đúng tầng (chưa chọn)

- Một lối ra có tên, máy giữ: cầu nối nhận `--khong-ho-so` ghi ruling vào một sổ kho-cấp
  (vd `_acceptance/_so-ngoai-ho-so.jsonl`) thay vì bỏ — ruling không mất, hook cho xoá.
- Hoặc hook im khi workspace không suy được hồ sơ, và đếm ca đó thành một dòng stderr — rẻ hơn,
  nhưng ruling của kế hoạch ngoài hồ sơ mất như trước vòng.

Chọn giữa hai là đánh-đổi của owner (giữ ruling hay giữ đơn giản) — mở ô khi có ca thật đầu tiên.

## Ngưỡng mở ô

≥ 1 lần hook chặn một kế hoạch ngoài hồ sơ ở kho tiêu thụ sau khi mốc chứa `mot-so-ba-ve` được cài.
