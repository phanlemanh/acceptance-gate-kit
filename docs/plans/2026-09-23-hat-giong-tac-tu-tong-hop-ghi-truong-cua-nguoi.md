# Hạt giống — tác tử tổng hợp báo cáo S4 tự ghi `human_signoff` và bịa `verified_at`; không chốt máy nào chặn

**Ngày:** 2026-09-23 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Mức:** cao — chạm thẳng nguyên tố 2 và ADR 0002
Gốc: crm/_acceptance/bo-dung-chung-nhan-chuoi — run `wf_e0599192-048` (round 6, 23/09 ~03:00Z): `result.report` do agent `synthesize:report` trả về mang `human_signoff: Phan Le Manh 2026-09-23` trong khi người chưa ký hồ sơ ấy (bản trước ghi `human_signoff: Manh Phan 2026-09-01`; hồ sơ `tieu-de-cot-doc-tron` cùng nhánh vừa được ký). Phiên crm gỡ tay trước khi commit `47e9fff9`.
Gốc: crm/_acceptance/tieu-de-cot-doc-tron — run `wf_dee46a14-acb` (round 1, invokedAt 00:05:57Z, 538 s): 14 khối eval mang `verified_at` 09:00–09:15Z, giờ TƯƠNG LAI so đồng hồ 00:24Z; round 2 ghi 10:00Z; round 6 của hồ sơ trên ghi `09:55:00+07:00`. Mọi dòng `run-log` cùng run mang ts thật. `recheck-evidence` xanh với giá trị bịa.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Lỗ

`feature-loop/workflows/acceptance-verify.js` nhận `report` là MỘT CHUỖI từ agent tổng hợp (prompt ~dòng 1442) rồi
ghi thẳng thành `evidence-report.md` sau khi append run-log. Prompt dặn PROVENANCE chép nguyên văn vài trường,
nhưng KHÔNG có bước máy nào sau synthesize: (a) ép rỗng `human_signoff` / `human_override` / `bypass_ack` — ba
trường thuộc về người (ADR 0002); (b) ép `verified_at` bằng giờ engine đo. Bên đọc cũng không có răng:
`lib/evidence-core.cjs:892` chỉ kiểm `verified_at` có dạng ISO; lưới trước-merge chỉ kiểm `human_signoff` khác
rỗng và khớp `status`. Hệ quả: một chữ ký do máy viết trên hồ sơ `verified` đi qua lưới như chữ ký thật; một
`verified_at` ở tương lai không làm gì đỏ. Đây là dặn-bằng-lời làm nghiệm — hiến pháp cấm.

## Dạng nghiệm đúng tầng (biến bất biến từ đầu-người sang vật-máy-giữ)

1. **Chốt máy sau synthesize** trong `acceptance-verify.js`: parse frontmatter của `report`; ghi đè
   `human_signoff:`/`human_override:`/`bypass_ack:` về rỗng (giữ đúng khuôn dòng); ghi đè MỌI `verified_at` trong
   khối eval bằng giờ engine (ts của dòng run-log cùng run_id, hoặc `invokedAt`). Agent không còn quyền viết.
2. **Răng bên đọc** (`evidence-core` / `recheck-evidence`): `verified_at` không muộn hơn giờ commit chứa báo cáo và
   không sớm hơn `invokedAt` của dòng run-log cùng run_id → VIOLATION có tên. `human_signoff` khác rỗng trên hồ sơ
   chưa có commit `Gate 2 signoff:` của chính slug → VIOLATION «chữ ký không có commit ký».
3. **Cặp kiểm hai chiều** trên fixture: report giả có chữ ký + giờ tương lai → sau workflow chữ ký rỗng, giờ đúng
   engine; report đúng → không đổi byte nào ngoài hai trường. Chiều im trên 132 hồ sơ thật kit + hồ sơ crm đã ký.

Vế 1 và 3 là TRỪ (bớt quyền của agent). Vế 2 là CỘNG một luật đọc, owner phê đích danh (ADR 0018). Xếp vào
vòng ĐẦU cửa sổ kế cùng suite-qua-trần và thẻ Cổng 1 hồ sơ khép — không mở vòng riêng (luật chiều rộng (b)).
Ngưỡng mở ô: đã chạm (2 hồ sơ, 4 run trong một ngày; một chữ ký máy đã lọt tới bước ghi tệp).

## Owner quyết 23/09 (phiên điều phối «Cập nhật kit mới nhất từ github»)

- **Đây là vòng meta ĐẦU của cửa sổ sau 2.18.1 → mốc 2.18.2.** Owner chọn nó trước hạt giống S1
  (`2026-09-22-hat-giong-may-hoi-ngoai-thiet-ke-o-s1.md`) vì nguyên tố 2 (bằng chứng không tự dối) đứng
  trên trạm thu phí ở S1 (nguyên tố 3): chữ ký máy lọt lưới là false-green ở lời hứa cốt lõi của cổng.
- **Vòng đi RIÊNG hạt giống này** — KHÔNG gộp suite-qua-trần hay thẻ Cổng 1 hồ sơ khép như đoạn trên đề
  nghị: ba lớp khác nhau, gộp vì «chỉ được một vòng» là đúng bệnh luật chiều rộng sinh ra để chặn; nhịp
  mốc 1–2 ngày nên làm tuần tự không tốn gì.
- Vế 1 và 3 (TRỪ) đi mặc định; **vế 2 (CỘNG một luật đọc) trình ở Cổng Phạm vi để owner phê đích danh.**
- Chip đã mở cùng ngày: «Kit 2.18.2: chốt máy chữ ký sau synthesize (vòng meta)».
