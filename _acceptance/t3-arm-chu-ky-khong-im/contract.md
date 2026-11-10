---
schema_version: 1
feature: Vế chữ ký của luật code t3_paths không được tắt im lặng
slug: t3-arm-chu-ky-khong-im
owner: phanlemanh@gmail.com
risk_tier: T3      # chạm scripts/pre-merge-check.sh — trong risk_tiers.t3_paths
surfaces: [cli, ci]
status: implemented
approved_by: Manh Phan
approved_at: 2026-11-10
design_doc: _acceptance/t3-arm-chu-ky-khong-im/design.md
---

# Acceptance Contract: t3-arm-chu-ky-khong-im

## Context

Luật mới cho code trọng yếu đòi hồ sơ hạng dưới T3 phải có chữ ký người, nhưng máy thiếu công cụ đọc chữ ký thì vế đó tắt mà
không báo. Đo trên kho thử: có node, thiếu thư viện chữ ký, cổng không chạy `strict` thì hồ sơ T2 chưa ký ở cả bốn trạng thái
đều ra `clean`. Người hưởng: chủ kho của mọi kho cài kit. Trace nguyên tố 2: `clean` phải đứng trên một lần chấm có thật.

Source input: mục Ngoài-16 ở Cổng Bằng chứng của `t3-can-ho-so-arm`, chủ kho chọn mở hợp đồng mới ngày 10/11/2026.

## Criteria

- AC-1: Given `recheck` mặc định (warn) và PR đổi một tệp `t3_paths` kèm hồ sơ T2 chưa ký ở một trong bốn trạng thái `machine-cleared` · `verified` · `implemented` · `signed-off`, When cổng chạy trên máy có node mà vắng `lib/evidence-core.cjs`, Then thoát 1, in dòng `VIOLATION [PR]` với cụm `no record in it is judged by the gate`, nêu tệp T3, nêu `feat: hạng T2 không kiểm được chữ ký người — thiếu lib/evidence-core.cjs (mang cổng vào repo phải copy CẢ lib/)`, không in `pre-merge-check: clean`; và cùng kho thử trên máy đủ công cụ thì thoát 1 với lý do cũ `feat: hạng T2 chưa có chữ ký người`, không có cụm `không kiểm được chữ ký người`.
- AC-2: Given `recheck` mặc định và PR đổi một tệp `t3_paths` kèm hồ sơ T2 có chữ ký thật, When cổng chạy trên máy đủ công cụ, Then thoát 0 và in `pre-merge-check: clean`; và cùng kho thử trên máy vắng `lib/evidence-core.cjs` thì thoát 1 với lý do ở AC-1.
- AC-3: Given `recheck` mặc định và PR đổi một tệp `t3_paths`, When cổng chạy trên máy không có node, Then hồ sơ T2 có chữ ký thoát 1 và nêu `feat: hạng T2 không kiểm được chữ ký người — thiếu node (cài node trên máy chạy cổng)` trong khi cùng kho thử trên máy đủ công cụ thoát 0; và hồ sơ T2 máy-thông chưa ký thoát 1 và nêu cùng lý do đó.
- AC-4: Given `recheck` mặc định trừ dòng cuối, When cổng chạy trên hai máy, Then mỗi ô cho đúng kết quả ở bảng dưới, và tám ô đầu không có cụm `không kiểm được chữ ký người`.

  | Dạng | Máy thiếu lib | Máy thiếu node |
  |---|---|---|
  | T3 có chữ ký, code `t3_paths` | 0, `clean` | 0, `clean` |
  | Code ngoài `t3_paths`, T2 máy-thông chưa ký | 0, `clean` | 1, `VIOLATION [feat]: status machine-cleared nhưng hồ sơ còn cần người` |
  | `--no-t1-escape`, T2 có chữ ký, code `t3_paths` | 0, `clean`, `T1-ESCAPE: NOT ENFORCED` | 0, `clean`, `T1-ESCAPE: NOT ENFORCED` |
  | T2 máy-thông chưa ký cạnh T3 có chữ ký, code `t3_paths` | 0, `clean` | 1, `VIOLATION [feat]: status machine-cleared nhưng hồ sơ còn cần người` |
  | `recheck: strict`, T2 có chữ ký, code `t3_paths` | 1, `evidence re-check KHÔNG CHẠY ĐƯỢC (exit 2)` và lý do ở AC-1 | 1, `evidence re-check KHÔNG CHẠY ĐƯỢC (node vắng)` và lý do ở AC-3 |

- AC-5: Given bản sao cổng bị gỡ riêng nhánh lý do thiếu lib, When chạy CHÍNH kho thử T2 máy-thông chưa ký của AC-1 và T2 có chữ ký của AC-2 trên máy thiếu lib, và Given bản sao bị gỡ riêng nhánh lý do thiếu node, When chạy CHÍNH kho thử T2 có chữ ký của AC-3 trên máy thiếu node, Then mỗi lần thoát 0 và in `pre-merge-check: clean`, sau khi bản chưa gỡ đã chặn đúng lý do trên cùng kho thử.
- AC-6: Given 46 ca đã có của tệp ca, liệt kê đích danh trong lệnh chấm, cộng 17 ca mới, When chạy, Then đủ 63 dòng PASS và `Results: 63 passed, 0 failed`, thiếu một tên là đỏ; bảng viết trước của luật đối chiếu đúng mười một lý do với mười một kim; phép đo «hai tệp cưỡng chế chỉ được thêm dòng» xanh; và Given danh sách PR thật đã chốt của `t3-can-ho-so-arm`, When chạy lại trên máy đủ công cụ, Then mỗi PR cho đúng kết quả đã chốt.
- AC-7: Given kho khai `signoff.required_for: [T1, T2, T3]` và PR đổi một tệp `t3_paths` kèm hồ sơ T1 có chữ ký, When cổng chạy trên máy đủ công cụ, Then thoát 0 và in `pre-merge-check: clean`; và cùng kho thử trên máy vắng lib thì thoát 1 và nêu `feat: hạng T1 không kiểm được chữ ký người — thiếu lib/evidence-core.cjs`; bản sao gỡ nhánh lý do thì về `clean`.

## Coverage

Quét bằng skill `morphological-scan`, preset test-matrix.

- Trục A — máy chạy cổng: đủ công cụ | có node, thiếu lib | thiếu node | có đủ mà lib chạy lỗi [thước CE: ba nhánh `command -v node`, `-f "$CHU_KY_LIB"` và mã thoát của `chu-ky-that`].
- Trục B — hồ sơ: T2 chưa ký (bốn trạng thái) | T2 có ký | T3 có ký | T1 có ký khi kho khai T1 | T2 chưa ký cạnh T3 có ký [thước CE: nhánh hạng và `required_for`].
- Trục C — loại code PR đổi: `t3_paths` | code thường [thước CE: nhánh `t3_hits` của khối T1-escape].
- Trục D — bối cảnh chạy: PR thường, `recheck` warn | `recheck: strict` | `--no-t1-escape` [thước CE: hai công tắc của cổng].
- Ngành: cách chọn chặn hay cho qua khi bộ kiểm không chạy được đối chiếu `failurePolicy` của webhook kiểm duyệt Kubernetes, mặc định `Fail` [NGÀNH: Kubernetes admission webhook].
- Không gian 120 ô, Core 18 ô, gồm: A2×B1 và đối chứng A1 (AC-1) · A2, A1×B2 (AC-2) · A3×B1, B2 (AC-3) · A2, A3×B3, C2, D3, B5 và D2 (AC-4) · A2, A1×B4 (AC-7).
- Later: A4 có đủ mà lib chạy lỗi — đã chặn, chỉ lời báo chưa đúng; xem Hỏi-2.
- Never: A1×D3 và các ô A1 không nằm ở trên — máy đủ công cụ không đi vào khối mới, AC-6 giữ nguyên hành vi.

## Out of scope

- Thêm công tắc advisory cho luật này.
- Sửa lý do in ra khi lib có mặt nhưng chạy lỗi.
- Nâng các kho tiêu thụ (làm ở lượt phát hành).
- Các mục Ngoài khác của `t3-can-ho-so-arm`.

## Notes

- Vật: `scripts/pre-merge-check.sh` (hàm `t3_co_ho_so_arm`) · thước: `tests/scripts/t3-can-ho-so-arm.test.mjs` ca HA37 tới HA49 và HA36-bang · tài liệu: đoạn về `t3_paths` trong `README.md`.
- Phụ thuộc: cắt từ `fix/t1-escape-ho-so-khong-arm` (97886eea, chưa đẩy). PR chỉ mở sau khi bản vá đó gộp.
- Chiều đỏ: đột biến ở AC-5 trả đúng mã trước vòng vì khối mới chỉ thêm dòng; đo trực tiếp trước khi viết, ghi ở design doc.
- Nguồn việc là Ngoài-16 của `t3-can-ho-so-arm`. Hợp đồng này không ghi gì vào hồ sơ đó.
- Known limits khai trước: hồ sơ T2 có chữ ký thật trên máy thiếu công cụ ở kho `recheck: warn` nay bị chặn, gỡ bằng cài node hoặc chép `lib/`.
