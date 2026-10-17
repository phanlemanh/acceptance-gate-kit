# Chấm lại không tự dối — thiết kế (hàng VA1, T2)

**Ngày:** 2026-10-16 · **Hồ sơ:** `_acceptance/cham-lai-khong-tu-doi/` · **Gốc:** crm-onehub DA3b (`goi-y-mo-ke-hoach`) + K7.

## Hai lỗi, một lớp

Cả hai là «thước tự dối» ở lượt chấm lại (round ≥ 2): máy trình cho người một nhãn về lượt này mà nhãn ấy thật ra nói
về một lượt khác.

1. **Mang sang thiếu vân tay định nghĩa.** `carry-plan.mjs` mang sang eval khi `paths` không chạm diff và lượt trước
   xanh. Nó không hỏi «eval hôm nay có hỏi cùng câu với lần nó chạy không». DA3b đổi `expected` E10 21→22 và chữ AC-10
   → E10 mang màu xanh lượt 2 sang lượt 3.
2. **Bộ ghi thước dùng tham số lượt khác.** `thuoc-vat.mjs --write` so ảnh chụp thước/cây trong tệp args với cây lúc
   này, và luôn đọc `<hồ sơ>/s4-args.json`. Phiên crm lưu tham số lượt 2–3 vào `s4-args-r2.json`/`-r3.json` (25 tệp
   `s4-args*.json` đã commit ở crm-onehub) → lượt 2–3 so bằng ảnh lượt 1: `thuoc-lech` mang sha lượt 1 (round 2, 3),
   `cay-doi` muộn cho round 1, thẻ khoá «thước lệch — chấm lại» và mất khối Lối ra ở trần.

## Lựa chọn

**Lỗi 1 — so định nghĩa với lượt GỐC, đọc từ git.** Với mỗi eval sắp mang sang: lấy sha của lượt eval thật chạy (dòng
lượt gốc qua `carried_from_round` + `run_id`; sổ cắt cụt thì sha dòng mang), `git show <sha>:<evals.yaml>` và
`<contract.md>`, so (a) KHỐI eval nguyên văn — mọi dòng từ `- id:` tới mục kế, bỏ khoảng trắng cuối dòng và dòng trống
— và (b) chữ tiêu chí nó phục vụ, đọc bằng bộ bóc chung `lib/ac-line.cjs` `parseACBlock`. Khác → chạy lại, lý do có
tên; không đọc được (sha không còn, tệp chưa commit ở sha đó) → chạy lại (fail-closed). `s4-args` in một dòng cho mỗi
eval chạy lại vì định nghĩa.

Lối khác đã loại: ghi vân tay vào dòng eval của run-log ở bộ chấm rồi so ở lượt sau — đúng tầng hơn (vật-máy-giữ lúc
chấm) nhưng phải sửa bộ chấm `acceptance-verify.js` (đường dòng eval + dòng mang), không cứu được sổ đời cũ (DA3b đang
giữa vòng), và mọi hồ sơ đang mở mất mang sang một lượt sau khi nhận bản. Đọc từ git cứu được sổ cũ và không đổi bộ
chấm. Giá: một ca hụt khai ở Known limits (eval sửa chưa commit lúc chấm rồi hoàn lại).

**Lỗi 2 — chọn tệp args THUỘC lượt cuối.** Khoá ghép = `ts` của round-tally cuối (bộ chấm ghi bằng `invokedAt` của
tệp args) + sha khi cả hai có. Tệp hợp lệ: khớp, hoặc MỚI HƠN (lượt chết không kịp ghi round-tally — dòng `cay-doi`
mồ côi vẫn phải được ghi để s4-args đòi hoàn lại). Không cờ → xét `<hồ sơ>/s4-args*.json`, ưu tiên `s4-args.json` khớp;
`--args` tường minh cũ hơn → dừng mã 2 có tên; hồ sơ có tệp args mà không tệp nào thuộc lượt cuối → dừng mã 2 có tên;
cả hai dừng TRƯỚC khi ghi byte nào. Sổ chưa có round-tally, hay hồ sơ không có tệp args → đường cũ từng byte. Dòng
`thuoc-lech` mang `round` của tệp args (bằng round lượt cuối khi khớp).

Lối khác đã loại: chỉ thêm `--args` vào SKILL — dặn-bằng-lời làm nghiệm (hiến pháp cấm); thẻ đọc khoan dung dòng
`thuoc-lech` sai sha (cứu K7 hồi tố) — chạm `lib/` (t3_paths) → T3, thêm Gate 1.5; để thành câu hỏi Hỏi-1.

## Không đổi

Bộ chấm (`acceptance-verify.js`), bộ đọc nhãn (`lib/nhan-canh-gay.cjs`), khuôn dòng `thuoc-lech`/`cay-doi`, carry
finding (T5), P2/P3. Kho không gặp hai ca: eval không đổi định nghĩa vẫn mang sang y như cũ; hồ sơ một tệp
`s4-args.json` ra đúng mã thoát và dòng sổ như cũ (CL4, CL7 so bằng nhau với bản trước vòng).
