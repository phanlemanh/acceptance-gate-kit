## Trong hợp đồng

- **Tập lệnh model khoá cứng envTag 'full': bật env CI thì suite dùng chung lệnh với eval model thật vẫn bị chạy lại và không được đếm**
  file:line: `feature-loop/scripts/repin-lane.mjs:275`
  severity: medium
  AC: AC-1
  source: conventions
  detail: `lenhModel` được dựng bằng `khoaLenh(e.cmd, 'full')`, còn `laLenhModel(cmd, envTag)` tra theo envTag của lần chạy. Khi kho khai `feature_loop.repin_ci_blank_env`, `runSuites` chạy suite với envTag 'ci' (dòng 357), nên `laLenhModel(c, 'ci')` luôn trả false cho mọi suite. Ca hỏng cụ thể: suite và một eval trong `model_evals` có cùng nguyên văn lệnh, repin_retry: 1, có env CI, và suite đỏ ở lần đầu. Khi đó (a) suite chạy dưới env CI bị chạy lại, tức lệnh gọi model thật hai lần, đúng điều Never của hợp đồng («chạy lại eval model thật») và vế AC-1 «lệnh dùng chung với một eval model thật cũng không»; (b) cả hai lần chạy đó không vào `demModel`, nên «eval model thật: gọi n» của AC-4 đếm thiếu. Eval chạy sau với tag 'full' là một khoá riêng (Đ3), nên nó vẫn chạy và chỉ lần đó được đếm. Tính chất model thuộc về LỆNH, không thuộc môi trường; khoá gộp env+lệnh của Đ3 bị áp nhầm sang phép phân loại này. Ca AC1-model-dung-chung và mutant `model-chi-theo-nhan-dau` trong ma-tran.mjs chỉ dựng kho không có env CI, nên không lối nào bắt được ca này. Hướng sửa: so theo cmd, không kèm envTag (ví dụ Set chỉ chứa e.cmd), và thêm một ca có `repin_ci_blank_env`.

- **Model-command set is keyed only to env tag 'full', so with repin_ci_blank_env a suite sharing a model eval's command is retried and its runs go uncounted**
  file:line: `feature-loop/scripts/repin-lane.mjs:275`
  severity: high
  AC: AC-1
  source: bugs
  detail: The S4-r1 fix builds `lenhModel` as `khoaLenh(e.cmd, 'full')` and then checks `laLenhModel(cmd, envTag)` using the caller's env tag. When `feature_loop.repin_ci_blank_env` is set, runSuites passes `envTag = 'ci'` (lines 356-357, 371 and runCmd at 341). The key `ci\0<cmd>` is never in `lenhModel`, so a suite that runs the same literal command as a real model eval gets `model: false`. That suite is then retried under AC-1, and its runs are left out of the AC-4 count `n`. Reproduced with the repo's own fixture (gia-lan-fixture mkKho): suiteCmd 'sh rang_e1.sh' equals E1's command, plus `repin_retry: 1`, `model_evals: [feat/E1]` and `repin_ci_blank_env: [GG_X]`, with the flaky command lenhChapChon. Result: the model command ran 3 times (suite, suite retry, then the separate full-env eval). The lane exited 0 with 'chập chờn: 1' recorded on a model command, and the summary said 'eval model thật: gọi 1'. With the CI key absent, the same fixture correctly runs once, goes red and counts 1. This breaks AC-1 ('lệnh dùng chung với một eval model thật' cũng không chạy lại: picking the better of two draws) and AC-4 (n = every actual run of a model-eval command). The new case AC1-model-dung-chung only covers the non-CI path, so it stays green. Fix: key the model set by command text alone, ignoring envTag, e.g. `lenhModel = new Set(... .map(e => e.cmd))` and `laLenhModel = (cmd) => lenhModel.has(cmd)`. Then add a CI-env variant of AC1-model-dung-chung.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 5 — bản vá tuyên «mọi lần gặp lệnh» nhưng ca AC1-model-dung-chung chỉ chạm một trong hai chỗ gặp; nhánh suite song song không có ca nào, phép phá ở chỗ đó sống sót**
  Người dùng thấy gì: Làn ghim lại chạy suite song song chưa có phép thử riêng cho chuyện lệnh gọi model thật không bị chạy lại. Hôm nay nó vẫn chạy đúng, nhưng nếu sau này ai sửa nhầm ở nhánh đó thì lệnh model thật có thể bị gọi hai lần mà không phép thử nào báo đỏ.
  file: `tests/scripts/repin-lane-chay-lai.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **GUIDE §7.1 ships a «Gợi ý cho crm» column carrying one consumer repo's product config (eval IDs, env var names, AI Gateway cost command) (r1)**
  Người dùng thấy gì: Tài liệu hướng dẫn gửi cho mọi kho đang kèm một cột gợi ý riêng cho một kho cụ thể (tên eval, tên khoá bí mật). Kho khác đọc sẽ thấy cấu hình không phải của mình; không làm hỏng chức năng, chỉ làm tài liệu kém trung lập.
  file: `GUIDE.md`
  severity: medium
  Đề xuất: known-limits

- **model_evals entries are checked for shape only; a typo silently re-runs a real-model eval, the exact case the round forbids (r1)**
  Người dùng thấy gì: Nếu kho gõ sai tên một eval gọi model thật khi khai báo, hệ thống không báo lỗi mà vẫn chạy lại eval đó và lấy lượt tốt hơn, tức tự làm đẹp kết quả mà không ai hay. Chỉ xảy ra khi người cấu hình gõ nhầm.
  file: `feature-loop/scripts/lib/lan-khoa.mjs`
  severity: medium
  Đề xuất: known-limits

- **Every lane command now runs under setsid (detached:true), so a group SIGKILL from the calling tool no longer reaches suites; this limit is undeclared (r1)**
  Người dùng thấy gì: Nếu công cụ bên ngoài ngắt cứng lượt ghim lại, các tiến trình con có thể chạy sót sau khi lượt đã chết và lượt sau có thể đỏ giả. Giới hạn này cần được ghi rõ cho mọi kho vì nó áp dụng mặc định.
  file: `feature-loop/scripts/lib/chay-lenh.mjs`
  severity: medium
  Đề xuất: known-limits

- **The repin-do sample in the SKILL template shows `"chap_chon":[]`, contradicting the presence rule stated just below it (r1)**
  Người dùng thấy gì: Dòng mẫu trong hướng dẫn cho thấy một mục luôn có mặt dù quy tắc ngay bên dưới nói nó vắng hẳn khi không dùng. Người đọc có thể hiểu sai hình dạng bản ghi, nhưng hệ thống chạy đúng.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **doChiPhi misreads a cost that has a thousands separator, giving a wrong cost delta (r1)**
  Người dùng thấy gì: Nếu công cụ đo chi phí in số có dấu phẩy ngăn cách hàng nghìn, con số chênh chi phí trong tổng kết sẽ sai lệch rất lớn mà không báo lỗi. Chỉ ảnh hưởng dòng chi phí đo, không ảnh hưởng đỏ hay xanh của lượt.
  file: `feature-loop/scripts/lib/lan-khoa.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — AC2-B7 chỉ ghim mã thoát 3, không ghim thông điệp; ca vẫn xanh trên BASE-GIA (nơi chưa có cờ) (r1)**
  Người dùng thấy gì: Phép thử kiểm tra cờ giới hạn thời gian sai chỉ nhìn kết quả thất bại chung chung, nên không phân biệt được 'giá trị sai bị bắt đúng' với 'cờ chưa tồn tại'. Tính năng chạy đúng, chỉ là bằng chứng kiểm thử yếu hơn mức mong muốn.
  file: `tests/scripts/repin-lane-tran.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — lời hứa «không ghi pin, verified_commit/báo cáo giữ nguyên» được đo trên làn KHÔNG --write, nơi làn vốn không bao giờ ghi (r1)**
  Người dùng thấy gì: Phép thử lời hứa 'vượt trần thì không ghi kết quả ghim' chạy ở chế độ vốn không ghi gì, nên một lỗi thật khi chế độ ghi bật có thể lọt mà không phép thử nào bắt. Chưa có bằng chứng lỗi đang xảy ra.
  file: `tests/scripts/repin-lane-tran.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
