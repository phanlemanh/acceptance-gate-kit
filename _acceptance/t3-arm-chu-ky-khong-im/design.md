# Thiết kế: vế chữ ký của luật code t3_paths không được tắt im lặng

## Vấn đề

Luật `t3-can-ho-so-arm` đòi: PR đổi code trọng yếu phải kèm hồ sơ thật sự được cổng chấm, và hồ sơ hạng dưới T3 phải có chữ
ký người. Vế chữ ký chỉ chạy khi máy có `node` và có `lib/evidence-core.cjs`. Thiếu một trong hai thì vế đó bị bỏ qua, hồ sơ
vẫn được tính là đã chấm, và không có dòng nào báo.

Cổng Bằng chứng của `t3-can-ho-so-arm` xếp lỗi này vào mục Ngoài-16, chủ kho chọn mở hợp đồng mới. Người hưởng: chủ kho của
mọi kho cài kit. Trace nguyên tố 2: `clean` phải đứng trên một lần chấm có thật.

## Đo trước khi chọn

Chạy bản vá `97886eea` trên kho thử, ba trạng thái máy nhân bốn trạng thái hồ sơ:

| Máy chạy cổng | `recheck` | T2 chưa ký (4 status) | T2 có ký | T3 có ký |
|---|---|---|---|---|
| Đủ công cụ | strict hoặc warn | chặn bởi luật này | qua | qua |
| Có node, thiếu lib | warn | **`clean`, lọt** | qua | qua |
| Có node, thiếu lib | strict | chặn, bởi soi lại bằng chứng | chặn, cùng lý do | chặn, cùng lý do |
| Thiếu node | warn | chặn, bởi luật theo từng hồ sơ | qua | qua |
| Thiếu node | strict | chặn | chặn, soi lại bằng chứng | chặn, soi lại bằng chứng |

Hạng dưới T3 là T2, và cả T1 khi kho khai T1 trong `signoff.required_for`.

Lỗ hổng thật hẹp hơn mô tả ban đầu: chỉ một hàng lọt, tức có node, thiếu đúng tệp lib chữ ký, và cổng không chạy `strict`.
Thiếu node thì vế này vẫn tắt, nhưng hồ sơ chưa ký đã bị luật khác chặn.

Các ô quanh luật, đo trên bản trước vòng, là kết quả mà AC-4 giữ nguyên:

| Dạng, `recheck` warn | Thiếu lib | Thiếu node |
|---|---|---|
| T3 có chữ ký | qua | qua |
| Code thường, T2 máy-thông chưa ký | qua | chặn bởi luật máy-thông |
| `--no-t1-escape`, T2 có chữ ký | qua | qua |
| T2 máy-thông chưa ký cạnh T3 có chữ ký | qua | chặn bởi luật máy-thông |

## Cân trên các kho tiêu thụ

Đọc ngày 10/11/2026, 13 kho trên máy có `_acceptance/config.yaml` và cổng:

| Kho | `recheck` | Lib cạnh cổng | CI có node |
|---|---|---|---|
| OpenMAIC, aes, crm, floorplanstudio, media-library, oneflow, onehub-invest, radar | strict | có | có |
| invest | strict | có | không có CI cổng |
| artifact-platform | **warn** | có | có |
| map | strict | **không**, bản cổng đời cũ chưa có luật này | có |
| onehub-inventory, onehub-quy-hang | strict | có, cài qua thẻ kit | có |

Kết luận: không kho nào đang ở hàng lọt. Chặn thay vì báo không làm đổi màu PR nào của 13 kho hôm nay. Khi `map` nâng bản,
lượt nâng chép cả `lib/`.

## Phương án

**Khuyến nghị: coi hồ sơ là chưa được tính.** Thêm một khối trong `t3_co_ho_so_arm`: hồ sơ dưới T3 đã ở trạng thái được chấm
mà máy thiếu `node` hoặc thiếu lib thì nhận lý do riêng, PR bị chặn bằng thông điệp sẵn có của luật.

| Máy | Lý do in ra |
|---|---|
| Thiếu node | `hạng T2 không kiểm được chữ ký người — thiếu node (cài node trên máy chạy cổng)` |
| Thiếu lib | `hạng T2 không kiểm được chữ ký người — thiếu lib/evidence-core.cjs (mang cổng vào repo phải copy CẢ lib/)` |

Vì sao: vế chữ ký là thứ duy nhất ngăn T2 máy-thông đi vào code trọng yếu. Không đọc được chữ ký thì không biết có người ký
hay không, và `signoff_that` của chính tệp đã coi «không đọc được nguồn» là «chưa ký».

Hai lý do riêng để người đọc biết phải cài node hay chép lib, theo nợ đã ghi ở lớp nhìn-thấy.

Khối mới chỉ thêm dòng, không sửa dòng cũ, để giữ luật «chỉ được thêm» của hai tệp cưỡng chế.

## Không chọn

- **Đối chiếu ngoài:** webhook kiểm duyệt của Kubernetes có đúng hai chế độ khi bộ kiểm không chạy được, `Fail` và `Ignore`, và mặc định là `Fail`. Khuyến nghị đi cùng hướng đó.
- **In `NOT ENFORCED` riêng cho vế chữ ký rồi cho qua.** Đúng nếp của gap-probe ở mức advisory và của `--no-t1-escape`. Giá:
  kho `warn` thiếu lib vẫn gộp code trọng yếu với hồ sơ T2 chưa ký, chỉ thêm một dòng trong nhật ký CI. Đây là đánh đổi khẩu
  vị rủi ro, xem Hỏi-1 trong sổ quyết định.
- **Bỏ điều kiện máy, để `signoff_that` tự trả 1.** Ngắn nhất, nhưng in `chưa có chữ ký người` cho hồ sơ có chữ ký thật.
- **Đọc chữ ký bằng bộ đọc shell khi thiếu lib.** Tạo lại ngữ pháp thứ hai mà `signoff_that` đã gỡ.

## Giá của lựa chọn

Hồ sơ T2 có chữ ký thật, chạy trên máy thiếu công cụ, ở kho `warn`, trước đây qua và nay bị chặn. Gỡ một lần: cài node hoặc
chép `lib/`. Các kho `strict` đã bị chặn ở tình huống đó từ trước.

## Thứ tự với bản vá gốc

Nhánh này cắt từ `fix/t1-escape-ho-so-khong-arm`, chưa gộp. PR này chỉ mở sau khi bản vá gốc đã gộp, nếu không PR sẽ mang cả
hai hồ sơ và bằng chứng đã ký của `t3-can-ho-so-arm` thành cũ vì cùng tệp. Ca HA36-bang sẽ đổi từ chín lên mười một lý do.
Ca đó là bảng viết trước của luật, nên tăng số là đúng việc, không phải hạ thước.

## Đặc tả UX

Không có. Xem dòng sổ «bỏ đặc-tả-UX».
