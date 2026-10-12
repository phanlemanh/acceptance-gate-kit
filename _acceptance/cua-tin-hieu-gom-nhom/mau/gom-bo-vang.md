dot: gom-1110
dang: lan-va
nguon: cửa tín hiệu — tín hiệu tới 2026-10-11
truc: ket-qua
den: 2026-10-11T11:13:27Z

- `G1` — Kỹ sư chạy bun run test (pre-push, CI, làn ghim lại, S4) mà một ca chập chờn mới không làm đỏ và bắt chạy lại cả lượt
  - tín hiệu: `vang-a-3`, `vang-a-5`, `vang-b-10`, `vang-b-20`
- `G2` — Kỹ sư chạy hai bài thử cùng lúc trên một gốc eve mà khoá giữ máy eve không bị hai bên cùng giành
  - tín hiệu: `vang-a-1`, `vang-a-13`
- `G3` — Kỹ sư ghim lại hồ sơ mà eval gọi model thật chỉ chạy lại khi prompt, model hay dữ liệu mẫu đổi
  - tín hiệu: `vang-a-11`, `vang-b-16`
- `G4` — Kỹ sư thấy thước của hồ sơ đã ký vẫn đúng sau khi các lượt khác gộp vào, kể cả trên CI nông
  - tín hiệu: `vang-a-7`, `vang-a-17`
- `G5` — Chủ kho không bị chặn mọi lượt gộp vì CI hết hạn mức chi
  - tín hiệu: `vang-a-9`
- `G6` — Kỹ sư tin cây onehub sau khi gộp đúng là cây đã kiểm ở đầu PR
  - tín hiệu: `vang-b-12`
- `G7` — Người dùng CRM thấy mọi loại bản ghi được cất và xoá theo cùng một cách
  - tín hiệu: `vang-b-18`

- đã phủ `vang-b-2` — ci-ma-tran-ba-o
- đã phủ `vang-b-4` — ci-ma-tran-ba-o
- đã phủ `vang-b-6` — ci-ma-tran-ba-o
- đã phủ `vang-a-15` — ci-ma-tran-ba-o
- đã phủ `vang-a-19` — kiem-cheo-sau-gop
- đã phủ `vang-b-8` — kiem-cheo-sau-gop
- đã phủ `vang-b-14` — luat-kho-vong-doi
