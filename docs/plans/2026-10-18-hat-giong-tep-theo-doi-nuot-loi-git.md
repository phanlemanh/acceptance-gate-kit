# Hạt giống — bộ vẽ trang lộ trình nuốt lỗi git, lặng lẽ hiện cả ý chưa commit hoặc mất mọi ý

**Ngày:** 2026-10-18 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** sửa lỗi (vật của VA2; không thêm cổng, không thêm lệnh).
Gốc: `acceptance-gate-kit/_acceptance/release-2-32-1/` — `review-findings.md`, mục Ngoài-2; chủ kho ghi Known limits khi ký mốc 2.32.1 (18/10).
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Số đo

- Bản vá VA2 (`_acceptance/ve-lo-trinh-doc-tin-hieu-cua-cay/`) cho trang commit `LO-TRINH.html` chỉ đọc ý đã theo dõi
  trong index của cây đang vẽ (`scripts/product-map.mjs:382` gọi với `chiTheoDoi: true`). Lọc nằm ở `scripts/tin-hieu.mjs:96–101`:
  `try { ra = execFileSync('git', [..., 'ls-files', '-z', '--', ng], { ..., stdio: [..., 'ignore'] }); } catch { return null; }`
- Mọi lỗi git — không chỉ «không phải kho git» như chú thích nói — đều thành `null`, và `:114` `if (theoDoi) ds = ds.filter(...)`
  bỏ qua lọc: trang đọc MỌI tệp `.json` trên đĩa, kể cả ý chưa commit. stderr của git bị tắt, nên không có vết nào.
- Nguồn khai bằng đường tuyệt đối trong kho: git trả đường tương đối, `thu` (`:99`) vẫn tuyệt đối, không tệp nào khớp → Set
  rỗng (vẫn đúng-sự-thật với `if`) → trang mất mọi ý. Ngoài kho: git báo lỗi → lại quay về đọc hết.
- Đúng loại không-tất-định mà 2.32.1 sinh ra để chặn: cùng một commit, hai máy vẽ ra hai trang khác nhau mà không ai được báo.
  Trùng Ngoài-4 của VA2 (Known limits ký 17/10).

## Đề xuất (chưa làm)

1. Phân biệt «không phải kho git» (giữ `null`, đã có ca kiểm) với mọi lỗi git khác: lỗi khác → lỗi có tên vào `loi`
   («nguồn tín hiệu <ng>: git ls-files lỗi — <stderr dòng đầu>»), không quay về đọc hết im lặng. Bộ vẽ trang commit thoát
   khác 0 với lỗi ấy; nếu thấy quá chặt cho kho tiêu thụ, hạ thành cờ vàng có tên trên trang — chọn ở Cổng Phạm vi.
2. Đường tuyệt đối: chuẩn hoá `ng` về tương đối gốc cây trước khi so, hoặc từ chối bằng lỗi có tên — không để Set rỗng đi qua.
3. Chiều đỏ trong bộ kiểm: kho thử tiêm lỗi git (vd. index hỏng, `GIT_DIR` trỏ sai) → phải đỏ đúng thông điệp; nguồn tuyệt đối
   → đỏ đúng thông điệp (hoặc đủ ý nếu chuẩn hoá); đối chứng dương: kho sạch, nguồn tương đối → xanh, trang giữ từng byte.

**Người hưởng:** chủ kho tiêu thụ đọc trang lộ trình (trang luôn nói đúng ý đã commit, hoặc nói rõ vì sao không) và
điều phối máy (không phải so trang hai máy bằng mắt).

**Kho không gặp sự cố này được gì, mất gì:** kho có git lành và nguồn tương đối thấy y nguyên. Mất: kho đang chạy trên
git lỗi mà chưa biết sẽ thấy lỗi thay vì trang «đủ» — đó là ý định của bản vá, nhưng cần ghi ở CHANGELOG mốc chứa nó.

## Vì sao không gộp vào RD1

RD1 đã qua Cổng Phạm vi và đang chạy S4 — thêm vật giữa vòng là đổi phạm vi sau duyệt; vật này thuộc VA2, không thuộc RD1.

## Ngưỡng mở thành ô

Owner gọi tên (vòng nhỏ T2, chính sách chủ kho 17/10 «nhanh mà vẫn tin được»), hoặc một lần thật trang sai ý vì lỗi git.
