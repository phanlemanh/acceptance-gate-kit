dot: tin-hieu-1110
dang: lan-va
nguon: cửa tín hiệu — tín hiệu tới 2026-10-11
truc: ket-qua
den: 2026-10-11T09:37:57Z

- `G1` — Kỹ sư chạy bộ test (pre-push, CI, làn ghim lại, S4) mà một ca chập chờn không làm đỏ cả lượt
  - tín hiệu: `vang-a-3`, `vang-a-5`, `vang-b-10`, `vang-b-20`
- `G2` — Kỹ sư chạy hai lượt test cùng lúc trên một gốc mà không bao giờ dựng hai máy chủ eve, kể cả khi cả hai cùng dọn khoá cũ
  - tín hiệu: `vang-a-1`, `vang-a-13`
- `G3` — Kỹ sư giữ hồ sơ đã ký xanh: thước đo đúng cây đã ký ở mốc cố định, không tự đỏ khi các lượt sau gộp vào
  - tín hiệu: `vang-a-7`, `vang-a-17`, `vang-b-12`
- `G4` — Kỹ sư ghim lại hồ sơ mà không trả lại tiền model thật cho eval có đầu vào không đổi
  - tín hiệu: `vang-a-11`, `vang-b-16`
- `G5` — Chủ kho gộp được mà CI không dừng giữa chừng vì hết hạn mức chi
  - tín hiệu: `vang-a-9`
- `G6` — Kỹ sư dọn dữ liệu của mọi loại bản ghi theo cùng một chuẩn vòng đời
  - tín hiệu: `vang-b-18`

- đã phủ `vang-b-2` — ci-ma-tran-ba-o
- đã phủ `vang-b-4` — ci-ma-tran-ba-o
- đã phủ `vang-b-6` — ci-ma-tran-ba-o
- đã phủ `vang-a-15` — ci-ma-tran-ba-o
- đã phủ `vang-b-8` — kiem-cheo-sau-gop
- đã phủ `vang-a-19` — kiem-cheo-sau-gop
- đã phủ `vang-b-14` — luat-kho-vong-doi
