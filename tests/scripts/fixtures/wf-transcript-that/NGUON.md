# Nguồn của fixture này — KHÔNG viết tay

Đây là transcript THẬT do harness Workflow sinh, cắt gọn để làm ca U06c của
`tests/scripts/wf-usage.test.mjs`.

- Nguồn: lượt chấm S4 `wf_3e8f4e9b-29d` (hồ sơ `release-2-12-0`, 14/09/2026).
- Cắt gọn thế nào: giữ HAI tệp agent đầu; mỗi tệp giữ dòng `user` đầu (chỉ còn thẻ
  `[wf-label: …]`) và BA dòng `assistant` đầu. Giữ NGUYÊN `timestamp`, `message.id`,
  `message.model`, `message.usage` — đó là thứ `wf-usage.mjs` đọc. Thân văn bản thay
  bằng chỗ giữ chỗ để fixture nhẹ và không mang chữ của hồ sơ.
- Vì sao cần: U06/U06b chạy trên fixture do CHÍNH tệp ca dựng, tức khuôn bên ĐỌC. Nếu
  tên trường thời gian ở harness đổi, mọi agent rơi vào nhánh «không đọc được thời
  gian» mà U06 vẫn xanh. U06c là ca duy nhất đo trên vật do bên VIẾT thật sinh ra.
