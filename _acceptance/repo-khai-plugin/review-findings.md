## Trong hợp đồng

- **Sentinel `__kept` nhét vào chính object settings — khoá `__kept` của đội bị xoá im lặng, trái AC-2**
  file: `scripts/plugin-declare.mjs:70`
  severity: low
  AC: AC-2
  `mergeSettings` gắn `out.__kept = kept` vào object settings rồi main() `delete merged.__kept` (dòng 97). Hệ quả 1: nếu `.claude/settings.json` của đội đã có khoá tên `__kept`, giá trị đó bị ghi đè rồi bị xoá hẳn — mất trắng, trong khi AC-2 hứa «mọi khoá và giá trị khác giữ nguyên» và chính header script hứa «giữ nguyên mọi khoá khác của đội»; không phép đo nào phủ ca này (PD2 chỉ dựng permissions/worktree/paper-desktop). Hệ quả 2: `mergeSettings` là API export nhưng đầu ra của nó KHÔNG an toàn để serialize thẳng — bên gọi ngoài main() sẽ ghi `__kept` vào file thật; chiều đỏ PD2 hiện đang ghi đúng như vậy vào fixture. Chữa rẻ: trả `{settings, kept}` thay vì nhét kênh điều khiển vào kênh dữ liệu.

- **`__kept` in-band sentinel silently deletes a same-named key from the team's settings.json**
  file: `scripts/plugin-declare.mjs:70`
  severity: medium
  AC: AC-2
  `mergeSettings` stashes its report on the merged object (`out.__kept = kept`) and `main()` does `delete merged.__kept` before serialising (line 97). Any pre-existing `__kept` key in the team's file is overwritten and then removed, with no entry in the `kept` list and no message — directly contradicting the file header's promise "giữ nguyên mọi khoá khác của đội" and the message contract ("giữ nguyên (đội đã đặt)").

  Reproduced on this tree:
  ```
  T=$(mktemp -d); mkdir -p "$T/.claude"
  printf '{\n  "__kept": ["team-value"],\n  "model": "opus",\n  "enabledPlugins": {}\n}\n' > "$T/.claude/settings.json"
  node scripts/plugin-declare.mjs --root "$T" --write   # exit 0, success line
  ```
  → output file contains `model`, `enabledPlugins`, `extraKnownMarketplaces`; `__kept` is gone, nothing printed about it.

  PD2 only checks `worktree`/`permissions`/`paper-desktop@paper`, so no case covers the sentinel colliding with real data. Fix: return `{ settings, kept }` instead of smuggling the report inside the settings object.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Chốt eval «PASS: PD<n>» là TIỀN TỐ của id ca anh em — E1/E2/E4/E7/E9 xanh dù ca gốc bị xoá**
  Người dùng thấy gì: Bằng chứng máy có thể báo "đã kiểm xong" một trường hợp dù trường hợp đó đã bị xoá khỏi bộ kiểm — người đọc báo cáo dễ tin nhầm là tính năng vẫn được kiểm đầy đủ trong khi thực ra không còn gì chạy nó.
  file: `_acceptance/repo-khai-plugin/evals.yaml`
  severity: high
  Đề xuất: new-contract

- **Danh sách ca PD trong run-tests.sh là bản sao thứ hai phải giữ đồng bộ tay — ca mới không chạy mà không đỏ**
  Người dùng thấy gì: Nếu sau này có người thêm một trường hợp kiểm mới mà quên đăng ký nó ở nơi thứ hai, trường hợp đó sẽ âm thầm không bao giờ chạy nhưng báo cáo vẫn hiện xanh, khiến người xem tin nhầm là mọi thứ đã được kiểm đầy đủ.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: new-contract

- **Lời hứa «lệnh cài sống ở MỘT chỗ duy nhất» chưa đúng — docs/ còn hai bản sao, và luật-LỚP AC-7b lại quét theo danh sách thư mục ghi cứng**
  Người dùng thấy gì: Tài liệu hướng dẫn cài đặt plugin vẫn còn tồn tại ở một vài nơi khác trong repo ngoài chỗ được công bố là "nguồn duy nhất" — người đọc nhầm chỗ có thể làm theo hướng dẫn cài đặt đã cũ.
  file: `tests/plugins/plugin-declare.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **init step 5b reports success unconditionally — exit 3/4 is swallowed**
  Người dùng thấy gì: Khi việc khai báo plugin thất bại (ví dụ file cấu hình bị lỗi), quy trình vẫn báo cho người dùng "đã xong, hãy commit" dù thực ra không có gì được ghi — người dùng commit nhầm một thay đổi không tồn tại, và các máy khác mở repo sau này sẽ không được nhắc cài plugin.
  file: `commands/acceptance-init.md`
  severity: high
  Đề xuất: new-contract

- **PD7b claims a class law but scans a hardcoded, non-recursive 3-directory list — live second copy escapes**
  Người dùng thấy gì: Tài liệu tuyên bố đã quét sạch mọi hướng dẫn cài đặt trong repo, nhưng thực tế bỏ sót một số tài liệu — người đọc các tài liệu bị bỏ sót vẫn có thể thấy hướng dẫn cài đặt cũ mà không ai phát hiện ra.
  file: `tests/plugins/plugin-declare.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **isEntryPoint() catch turns any realpath failure into exit 0 with no output and no write**
  Người dùng thấy gì: Trong một tình huống hiếm về môi trường máy (đường dẫn hỏng), công cụ khai báo plugin có thể thoát ra mà không báo lỗi và không ghi gì cả, khiến người dùng không biết là chưa có gì được khai báo.
  file: `scripts/plugin-declare.mjs`
  severity: low
  Đề xuất: known-limits

- **Tuyên quét LỚP nhưng vũ trụ quét là danh sách viết tay — có vi phạm sống ngoài tầm đo**
  Người dùng thấy gì: Bộ kiểm tự báo là đã quét sạch toàn bộ tài liệu hướng dẫn cài đặt trong repo, nhưng phạm vi quét thực tế hẹp hơn lời tuyên bố — vẫn có tài liệu chứa hướng dẫn cài đặt lỗi thời nằm ngoài tầm kiểm mà không ai được cảnh báo.
  file: `tests/plugins/plugin-declare.test.mjs`
  severity: high
  Đề xuất: new-contract

- **Số file đã quét được IN ra nhưng không được ASSERT — vũ trụ teo lại vẫn xanh im lặng**
  Người dùng thấy gì: Con số "đã kiểm bao nhiêu tài liệu" chỉ được in ra cho người đọc chứ không tự được máy kiểm tra — nếu sau này phạm vi quét bị thu hẹp do đổi cấu trúc thư mục, báo cáo vẫn báo "sạch" dù thực chất kiểm được ít tài liệu hơn trước, mà không ai được cảnh báo.
  file: `tests/plugins/plugin-declare.test.mjs`
  severity: medium
  Đề xuất: new-contract

## Chưa adversarial-verify (refuter chết)

(không có)

⚠ Cụm ngoài vùng phủ: 2/10 lỗi rơi vào file không bộ đo nào phủ (_acceptance/repo-khai-plugin/evals.yaml, tests/plugins/run-tests.sh) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
