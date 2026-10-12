---
schema_version: 1
feature: Ca kiểm chập chờn theo máy thôi làm đỏ lượt dài — dọn eve mồ côi của lượt bị ngắt, chờ route thật có trần, trần hook dựng Nest có tên, công tắc bỏ ca tới được test
slug: ca-chap-chon-cach-ly
owner: manh.phan@onemount.com
risk_tier: T2
surfaces: []
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-08T00:35:00Z
design_doc: _acceptance/ca-chap-chon-cach-ly/design.md
---

# Acceptance Contract: ca-chap-chon-cach-ly

## Criteria

- AC-1: Given tệp chủ khoá eve của một gốc ghi pid của một tiến trình test đã chết, cùng pid các `eve dev` nó đã sinh, và những eve đó còn sống, When lượt sau gọi `khoiDongEve` cho gốc đó, Then các eve đã ghi bị dừng trước khi eve mới được gọi; And eve mới lên, và máy được trả cho bài thử.
- AC-2: Given ở gốc đó có một `eve dev` đang chạy mà không có trong tệp khoá, hoặc một pid ghi trong khoá nay là tiến trình không phải `eve dev` của gốc đó, When `khoiDongEve` chạy cho gốc đó, Then tiến trình ấy không bị dừng; And với eve ngoài khoá, `khoiDongEve` vẫn ném lỗi có tên như hôm nay (pid, url, lệnh `kill`).
- AC-3: Given `/eve/v1/health` đã trả 200 mà `/health` của app còn trả 503 hoặc từ chối kết nối, When `khoiDongEve` chờ máy sẵn sàng, Then nó chỉ trả máy khi `/health` trả một mã khác 503, kể cả khi trước đó đã bị từ chối kết nối vài lần; And nếu hết trần `KHOI_DONG.sanSang` mà vẫn 503 hoặc vẫn bị từ chối, nó ném lỗi gọi tên route và mã cuối cùng, ra trước khi hook của `app-rieng` hết giờ.
- AC-4: Given máy chạy Node ≥ 24, When một lượt `app-rieng.integration.spec.ts` bị SIGKILL lúc eve con đang sống, và ngay sau đó ca «chạy cạnh apps/agent» chạy lại (ba lần liền, mỗi lần một lượt bị giết trước), Then cả ba lượt chạy lại đều xanh và eve mồ côi đã bị dừng; And trên bản sao của cây đã gỡ bước dọn, cùng bàn đo đỏ với thông điệp «dang co eve dev khong phai cua bai thu».
- AC-5: Given một trong ba hook — `beforeAll` của `dungSan()`, `beforeAll` riêng của `tai-lieu-khong-ro.spec.ts`, `beforeAll` riêng của `tai-lieu-thay-trang.spec.ts` — mất hơn 5 s, When chạy spec dùng hook đó, Then hook không hết giờ trước `TAI_LIEU_SAN.hookMs`; And khi hook nhanh như hôm nay, hai spec vẫn xanh đủ số ca như trước.
- AC-6: Given người gọi đặt `SOKR_KHONG_CHAY_AGENT_CU=1`, When chạy `bun run test` qua turbo cho gói `agent-okr`, Then ca «chạy cạnh apps/agent» bị bỏ; And không đặt biến thì ca đó chạy.
- AC-7: Given diff của vòng so với merge-base với `onehub`, Then không tệp nào dưới `apps/*/src/**`, `apps/*/agent/**`, `apps/*/app/**`, `packages/*/src/**` đổi.
