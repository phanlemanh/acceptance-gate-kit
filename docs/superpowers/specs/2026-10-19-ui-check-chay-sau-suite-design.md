# ui-check-chay-sau-suite — eval ui-check khai trong `model_evals` chạy sau chuỗi suite

Ngày: 2026-10-19 · Hạng T2 · Hồ sơ `_acceptance/ui-check-chay-sau-suite/`

## Gốc

crm-onehub, hồ sơ `hoi-dap-okr`, S4 round 1 (15/10/2026) bị REJECT. Eval E10 là `ui-check` dựng `eve dev` trong
`apps/agent-okr`; cùng lúc chuỗi suite chạy `turbo run build --force`, lệnh này chạy `eve build` ở cùng thư mục và
ghi lại `.eve/compile/compiled-agent-manifest.json` + `module-map.mjs` — đúng hai tệp `eve dev` đang nạp. Luồng trả
lời đứt (`ERR_INCOMPLETE_CHUNKED_ENCODING`), màn hình treo «Kara đang đọc OKR…». Chạy riêng hai lượt: 7/7 ĐẠT.
Nguồn: `crm/.acceptance-runs/dieu-phoi-r2/yeu-cau/P1-17.json`.

## Khe hở

Hồ sơ `lenh-dai-chay-rieng` (2.28.0) hứa ở `skills/acceptance/references/eval-executors.md`: «Evals listed in
`feature_loop.model_evals` … also run alone in the S4 round: after every other machine command (parallel evals and
the sequential suite chain) has finished, one at a time». Lời hứa không giới hạn executor. Vật thì giới hạn hai chỗ:

1. Bên viết `feature-loop/scripts/s4-args.mjs` lọc `evalsChayRieng` chỉ lấy `test`/`script`.
2. Bên đọc `feature-loop/workflows/acceptance-verify.js` — nhánh ui-check là một thunk riêng của `parallel([...])`,
   chạy đồng thời với chuỗi suite, không đọc `CHAY_RIENG`.

Kiểm 19/10: v2.30.0 và `main` (v2.33.0+, `acceptance-verify.js` trùng byte với v2.33.0) đều còn khe hở.

## Thiết kế

**Bên viết.** `evalsChayRieng` = eval có id trong `model_evals` và executor ∈ {`test`, `script`, `ui-check`}.
`judgment` vẫn bị loại: hội đồng chỉ đọc tệp, không dựng tiến trình — xếp nó vào hàng đợi chỉ kéo dài lượt.

**Bên đọc.** Tách `uiEvals` thành `uiSongSong` (id không trong `CHAY_RIENG`) và `uiChayRieng`. Nhánh máy GIỮ
NGUYÊN (eval lệnh song song ∥ chuỗi suite → lệnh chạy-riêng tuần tự). Nhánh ui:

```
uiChayRieng rỗng → parallel(uiSongSong)                         (y hệt 2.33.0)
ngược lại        → Promise.all([ parallel(uiSongSong), nhánh máy xong ])
                   .then(→ ui chạy-riêng tuần tự, mỗi cái chờ cái trước)
```

Promise của nhánh máy được nhớ (một hàm trả cùng một promise cho cả hai thunk), nên nhánh ui chờ được nó mà không
chạy lại lệnh nào. Nhánh ui bắt lỗi của promise máy (`.catch(() => null)`): một lỗi bên máy không được kéo mất kết
quả ui song song; hình `[machineRaw, uiRaw, judgeRaw, reviewRaw]` giữ nguyên cho mọi bên đọc phía sau.

Lời gọi tác tử ui rút thành hàm `agentCuaUi(e)` — một nguồn prompt cho cả hai đường, như `agentCuaLenh` của nhánh
máy. Prompt giữ nguyên từng byte.

Dry-run thêm khoá `uiChayRieng: [<id>]` (chỉ khi khác rỗng). Log in số ui chạy-riêng.

### Hệ quả cho kho nhận

- Kho không khai `model_evals`, hoặc khai mà không có ui-check: không đổi gì — nhánh máy giữ nguyên, nhánh ui đi
  đúng đường 2.33.0 (đo vi phân, kể cả trên đường lỗi).
- Kho khai ui-check trong `model_evals`: ui-check đó chạy sau mọi lệnh máy, sau mọi ui-check song song, sau mọi lệnh
  chạy-riêng, từng cái một. Đo 19/10: chỉ crm khai `model_evals` (29 test/script, 6 ui-check, 0 judgment); sáu
  ui-check ấy hôm nay bị lặng lẽ chạy song song, sau mốc sẽ chạy riêng — lượt chấm của các hồ sơ đó dài hơn.
- Lệnh chạy-riêng vẫn có thể chồng một ui-check song song (như 2.28–2.33). Ca đó kho gỡ bằng cách khai ui-check ấy
  vào `model_evals` — chọn vậy để không đổi mặc định cho mọi kho vì sự cố của một kho (CLAUDE.md «Sửa kit vì sự cố
  của MỘT kho phải cân trên MỌI kho»; gap-probe P0).

### Không làm

- Cờ riêng trên eval (`run_alone: true`…): `model_evals` đã là cờ, mọi kho đang dùng nó; thêm khoá thứ hai là hai
  nguồn sự thật cho cùng một thuộc tính.
- `judgment` trong `model_evals` vẫn chạy song song (xem trên).
- Làn ghim lại (`repin-lane.mjs`): không chạy ui-check, không đổi.
- Không sửa gì ở crm.

## Đo

Hai tệp ca, cùng khuôn với hồ sơ `lenh-dai-chay-rieng`:

- `tests/workflows/ui-check-chay-sau-suite.test.mjs` — bên đọc, nạp chính `acceptance-verify.js` qua harness;
  responder giả ghi cờ start/end có độ trễ để đo thứ tự; đột biến chạy trên bản sao trong bộ nhớ, kim khẳng định
  khớp đúng một lần. Vi phân với mốc cố định `v2.33.0` khi không khai gì.
- `tests/scripts/s4-args-ui-check-chay-sau-suite.test.mjs` — bên viết, kho git fixture dựng bằng code, chạy chính
  `s4-args.mjs`; round-trip: tệp args do s4-args thật sinh → workflow thật đọc.

Thứ tự commit: ca trước (đỏ trên vật cũ), vá sau.
