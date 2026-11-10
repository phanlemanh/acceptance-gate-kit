# Thiết kế: code t3_paths phải có hồ sơ thật sự bị cổng chấm

## Vấn đề

Kiểm cài kit ở `onehub-inventory` (2.38.0), ma trận 15 ca merge-gate, có hai ca để code trọng yếu lọt: PR đổi tệp
`t3_paths` kèm (1) `contract.md` không frontmatter, (2) `contract.md` khai `risk_tier: T1` + `status: verified`. Cả hai
ra `pre-merge-check: clean`. Nguyên nhân: răng T1-escape thoả khi có bất kỳ tệp nào dưới `_acceptance/`, còn vòng chấm từng
hồ sơ bỏ qua đúng các hồ sơ không khai đủ hoặc khai hạng ngoài `signoff.required_for`.

Người hưởng: mọi kho cài kit, ở lúc code trọng yếu đi qua PR. Trace nguyên tố 2 (bằng chứng không tự dối): `clean` hiện
có thể đứng trên một lần chấm không xảy ra.

## Phương án

Trong khối T1-escape của `scripts/pre-merge-check.sh`, thêm một nhánh: PR đổi code `t3_paths` và có đổi dưới `_acceptance/`
thì phải có ít nhất một hồ sơ trong PR thật sự được cổng chấm. Luật không buộc hồ sơ với từng tệp T3, vì kit không có ánh xạ tệp → hồ sơ; chữ «cho code đó» đã bỏ khỏi thông điệp (Hỏi-3). Hàm `t3_co_ho_so_arm` duyệt các hồ sơ trong diff.

| Hồ sơ trong PR | Tính? | Vì sao |
|---|---|---|
| Không có `contract.md` | Không | Vòng chấm bỏ qua |
| Thiếu `risk_tier` hoặc `status` | Không | Vòng chấm bỏ qua |
| Hạng ngoài `required_for` | Không | Vòng chấm bỏ qua |
| Đã cho nghỉ, đã chấm bởi thực tế | Không | Hồ sơ đã khép, không nhận code mới |
| Chỉ đổi tệp chữ (`opportunity.md`, `decisions.jsonl`) | Không | Luật #468 không kéo hồ sơ vào xét lại |
| Hạng dưới T3, đã arm, không có chữ ký người | Không | Làn V và máy-thông cho T2 đi không chữ ký |
| `draft`/`approved`, hạng đúng | Có | Vòng chấm đã chặn bằng thông điệp riêng (B02) |
| Các hồ sơ còn lại | Có | Vòng chấm xử đủ |

Miễn: PR mà đỉnh nhánh đích chưa có `_acceptance/config.yaml` (lần cài kit). Điều kiện đọc đỉnh nhánh đích, không đọc merge-base: nhánh cắt trước lần cài không được miễn. Tắt có khai báo qua `--no-t1-escape` như cũ.

## Không chọn

- Ép hạng ở vòng chấm từng hồ sơ: mỗi hồ sơ bị xét độc lập nên hạt giống T1 đi cạnh một hồ sơ thật sẽ bị chặn oan.
- Áp cho cả code thường: giá đo được là 27 PR đổi màu; `onehub-invest` đang dùng đều hồ sơ `T1/draft`, `crm` dùng hạt giống chưa frontmatter. Đây là đánh đổi khẩu vị rủi ro, xem Hỏi-1.
- Buộc mọi PR chạm T3 phải khai T3, hoặc coi máy-thông là đủ: xem Hỏi-2.
- Miễn hẹp cho riêng tệp bộ cài sinh: xem Hỏi-3.

## Đo trên kho thật

Chạy thật bản 2.38.0 và bản vá trên 54 PR đã gộp ở 11 kho: 27 PR code thường không đổi; 12 PR hồ sơ T2 có chữ ký không
đổi; 2 PR cài kit qua; 7 PR T3 không có hồ sơ được chấm bị chặn thêm; 6 commit đẩy thẳng cũ của kit nằm ngoài phạm vi vì
CI của kit chạy `--no-t1-escape` ở nhánh chính. Danh sách PR và kết quả được chốt trong `rang/ds-pr.json` để E8 đo lại từng PR, lệch một PR là đỏ.

## Khai thẳng về thứ tự

Vật đã có trước hồ sơ: phiên sửa làm theo TDD trên nhánh riêng, owner gọi mở hồ sơ sau khi thấy kết quả. Chiều đỏ nằm trong
lịch sử: commit test 3539300c đứng trước commit vật 4b66432c. Cổng Phạm vi vì vậy duyệt phạm vi của một bản vá đã dựng; bác
hoặc sửa thì vật đổi theo.

## Đặc tả UX

Bỏ: không có mặt người nhìn; xem dòng sổ «bỏ đặc-tả-UX».
