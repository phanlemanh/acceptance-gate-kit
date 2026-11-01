# Kế hoạch: ten-may-mot-luat

Hai việc tuần tự (việc 2 phụ thuộc việc 1 — chiều đỏ phải nằm trong lịch sử trước vật).

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | Độc lập |
|---|---|---|---|---|---|
| 1 | Commit tệp ca TM-1…TM-5 + sáu khoá eval, ĐỎ trên cây trước vòng | `tests/dieu-phoi/ten-may-mot-luat.test.mjs` · `_acceptance/config.yaml` | `node --test tests/dieu-phoi/ten-may-mot-luat.test.mjs` → TM-1, TM-3, TM-4 đỏ; TM-2, TM-5 xanh | E1–E6 | không |
| 2 | Nguồn luật `TEN_MAY_NGUON` + `TEN_MAY_RE` + `loiTenMay` ở `tin-doc.mjs` (MA_RE rút từ cùng nguồn); `vai` gọi `loiTenMay`; `tin.mjs` kiểm đích chế độ kênh trước khi mở nơi chứa; một câu ở README | `dieu-phoi/scripts/tin-doc.mjs` · `dieu-phoi/scripts/tin-kenh.mjs` · `dieu-phoi/scripts/tin.mjs` · `dieu-phoi/README.md` | tệp ca xanh trọn (10/10) · hai tệp ca GT- xanh (≥ 69, 0 hỏng) · DP1-07 xanh | E1–E6 | không |

Sau việc 2: hợp đồng `implemented`, lượt chấm S4 (khoá chấm toàn máy — chờ lượt nếu máy khác giữ).
