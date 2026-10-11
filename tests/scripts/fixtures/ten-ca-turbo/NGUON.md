# Nguồn của fixture này — KHÔNG viết tay

`turbo-bun.log` là đầu ra THẬT của turbo chạy `bun test` trên một kho monorepo tạm, làm vật đo cho
`tests/scripts/ten-ca-qua-tien-to.test.mjs` (hồ sơ `ten-ca-qua-tien-to-turbo`).

- Ghi ngày 11/10/2026 bằng turbo 2.10.8 và bun 1.3.12 trên macOS, bằng `ghi-ban-ghi.mjs` cạnh tệp này.
- Kho tạm: một gói `@kho/goi` có `scripts.test = "bun test"` và một tệp `ca.test.ts` với ba ca trong
  `describe("app-rieng")`: `chay canh apps/agent` (đỏ — `expect(503).toBe(404)`), `van xanh` (xanh),
  và `doc: (fail) dong le` (xanh — bẫy cho bộ bóc tiền tố quá tay). `turbo.json` khai `"ui": "tui"`
  như crm và `"cache": false` cho tác vụ.
- Đường chạy: lệnh đi qua CHÍNH `chayLenh` của làn ghim lại (`feature-loop/scripts/lib/chay-lenh.mjs`:
  `bash -c`, stdout và stderr là ống, không TTY, env kế thừa), và tệp là `out + "\n" + err` — đúng
  chuỗi `repin-lane.mjs` đưa vào `rutTenCa`. Vì vậy dòng phiên bản turbo và dòng `ERROR` đứng sau phần
  stdout: turbo in chúng ra stderr.
- Phép biến đổi DUY NHẤT sau khi ghi: thay đường dẫn tuyệt đối của kho tạm bằng `<kho-tam>` và đường
  dẫn của bun bằng `<bun>` (kho công khai). Không dòng nào bị thêm, bớt hay sửa chữ khác; mã băm tác
  vụ và thời lượng giữ nguyên.

## Đối chiếu với lệnh suite của crm

Gốc của vòng là dòng `repin` 07/10 của `crm/_acceptance/tro-ly-okr-bo-final-output` (sha
`6d454331`), `chap_chon` của «suite 1/7».

| | crm ở sha `6d454331` | Bản ghi này |
|---|---|---|
| Lệnh suite | `bun run test -- --filter=api` → `packages/db/scripts/test-run.ts` gọi `turbo run test --concurrency=1 --filter=api`, stdio kế thừa | `turbo run test --concurrency=1 --filter=@kho/goi` |
| Turbo | `^2.10.8` trong `package.json` | 2.10.8 |
| `turbo.json` | `"ui": "tui"` | `"ui": "tui"` |
| Cách làn chạy | `chayLenh`: ống, không TTY, env của phiên; `repin_ci_blank_env` chỉ đặt rỗng bốn khoá bí mật | `chayLenh`, env của phiên |
| Biến màu / CI | phiên Claude Code ghi 11/10 không có `FORCE_COLOR`, `NO_COLOR`, `CI`, `GITHUB_ACTIONS`, `TERM` | như cột trái |

Khác nhau: crm gói và ca thật nhiều hơn, và `test-run.ts` dựng một cơ sở dữ liệu thử trước khi gọi
turbo. Hai thứ đó không đổi hình dạng một dòng ca. Nhật ký trọn của lần đỏ 07/10 không còn trên đĩa
(worktree đã dọn), nên dạng dòng thật ở crm hôm đó là suy từ bảng trên, không đọc trực tiếp; dòng
quan sát reality ở Notes của hợp đồng là chỗ đọc lại.

## Sinh lại

Cần turbo (biến `TURBO_BIN` hoặc trên `PATH`), bun và git. Chạy từ gốc kho kit:

```bash
node tests/scripts/fixtures/ten-ca-turbo/ghi-ban-ghi.mjs > tests/scripts/fixtures/ten-ca-turbo/turbo-bun.log
```

Công cụ dựng kho tạm, chạy thật rồi xoá kho tạm; thiếu turbo hay bun thì thoát 3 và in «can turbo +
bun tren may». Bản mới sẽ khác bản này ở mã băm và thời lượng — không ca nào đọc hai thứ đó.
