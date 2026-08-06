## Trong hợp đồng

### Ca âm của AC-6 là assertion rỗng — không mô phỏng gì, không thể đỏ vì đúng lý do
- file: `tests/plugins/run-tests.sh:7255`
- severity: high
- source: conventions
- AC: AC-6

Chú thích ghi "ca AM: gia lap chot doi cho sang file luoi khong goi → phai phat hien", nhưng thân assert chỉ là `assert not any("tests/plugins/khong-co-trong-luoi.sh" in c for c in resolved)`. Nó kiểm rằng một chuỗi bịa KHÔNG có trong danh sách lệnh đọc từ config — mệnh đề đó đúng vô điều kiện, bất kể chốt P162 có thật sự nằm trong lưới chạy hay không. Không có bản sao cây, không có đổi tên tệp chốt, không có lượt chạy lại. Contract AC-6 khai rõ ca âm mạnh hơn ("đổi tên tệp chốt trong BẢN SAO cây kiểm → lưới phải ĐỎ") và `evals.yaml` E6 lặp lại đúng lời hứa đó. Đây chính là "assertion âm-tính-một-mình" của CLAUDE.md, ở ngay chân đo được dựng ra để chữa lớp đó. Đối chiếu: ca âm E3 (dòng 7141) và ca âm mốc-bịa E5 (dòng 7218) đều đi qua đường thật — chỉ riêng chân này không.

Rationale: AC-6 hứa ca âm cụ thể (đổi tên tệp chốt trong BẢN SAO cây kiểm phải làm lưới ĐỎ); assert hiện tại chỉ kiểm một chuỗi bịa không tồn tại, đúng vô điều kiện, không mô phỏng được điều AC-6 yêu cầu.

### Đối chứng dương của AC-5 chỉ assert "có file mất", không ghim file nào — bash lỗi cho cùng màu xanh
- file: `tests/plugins/run-tests.sh:7213`
- severity: high
- source: conventions
- AC: AC-5

Mutant gỡ dòng `rsync … resolve-plugin.mjs` khỏi bản sao hàm dựng, chạy `subprocess.run(["bash", str(sh)], cwd=str(work), capture_output=True)` (dòng 7211) rồi `assert lost_files(mutated)`. Hai lỗ: (a) mã thoát của lượt bash KHÔNG được kiểm — hàm dựng bắt đầu bằng `rm -rf "$out"`, nên nếu script chết giữa chừng vì bất kỳ lý do gì thì `lost_files` vẫn khác rỗng và đối chứng vẫn XANH, không phân biệt được "bắt đúng dòng chép bị gỡ" với "bản dựng hỏng toàn tập"; (b) không ghim THÔNG ĐIỆP mong đợi — assert chỉ đòi danh sách khác rỗng, không đòi nêu đích danh `scripts/resolve-plugin.mjs` của gói `feature-loop-codex`. Contract AC-5 và `evals.yaml` E5 đều khai "ĐỎ đúng file mất". Đối chiếu: mutant E3 làm đúng (`assert any(fake in b for b in bad)`, dòng 7141) — chân này rơi lại về "chỉ nhìn mã thoát" mà CLAUDE.md cấm.

Rationale: AC-5 hứa rõ đối chứng "bỏ một dòng chép trong hàm dựng → ĐỎ nêu file bị mất"; phép kiểm hiện tại không xác nhận bước dựng chạy đúng và không nêu đích danh file như hợp đồng yêu cầu.

### P162 E5: mutant "gỡ dòng chép" không phân biệt được với sync script crash — exit code bị nuốt
- file: `tests/plugins/run-tests.sh:7211`
- severity: high
- source: bugs
- AC: AC-5

Đối chứng dương của E5 (dòng 7200-7215) dựng worktree, xoá dòng `rsync ... resolve-plugin.mjs`, chạy `subprocess.run(["bash", str(sh)], cwd=..., capture_output=True)` — return code KHÔNG được kiểm — rồi kết luận bằng `assert lost_files(mutated)`. Vì `sync-plugin-packages.sh` chạy `rm -rf "$out"` trước mỗi build và có `set -euo pipefail`, BẤT KỲ lỗi nào cũng để lại gói bị xoá dở → `lost_files` non-empty → probe XANH dù mutation chẳng liên quan. Đã kiểm chứng: tiêm một mutant KHÁC hoàn toàn (đổi `$ROOT/skills/` thành `$ROOT/khong-ton-tai/` trong build_acceptance) → script exit 23, `plugins/acceptance-gate` còn 0 file, `lost_files` non-empty ⇒ assert vẫn pass. Đây đúng lớp lỗi CLAUDE.md cấm: kết luận từ "có mất file" mà không có (a) đối chứng chạy bản NGUYÊN VẸN trong chính worktree đó phải cho `lost_files` RỖNG, và (b) ghim đúng file mong đợi, không phải "gói nào đó mất file nào đó". Sửa: assert `r.returncode == 0` của lần chạy script; chạy bản nguyên vẹn trước (phải rỗng); rồi assert đích danh `("feature-loop-codex", ["scripts/resolve-plugin.mjs"]) in lost_files(mutated)`.

Rationale: cùng lời hứa AC-5 về đối chứng dương "bỏ một dòng chép → ĐỎ nêu file bị mất"; finding cho thấy phép kiểm không phân biệt được lỗi tiêm thật với một sự cố dựng bất kỳ khác, và không nêu đích danh file như hợp đồng đòi hỏi.

### Hình dạng 4 — ca ÂM của E6 không bao giờ đỏ được (assertion âm-tính-một-mình, không mutant thật)
- file: `tests/plugins/run-tests.sh:7255`
- severity: high
- source: measurement
- AC: AC-6

`assert not any("tests/plugins/khong-co-trong-luoi.sh" in c for c in resolved)` với comment "ca AM: gia lap chot doi cho sang file luoi khong goi → phai phat hien". `resolved` chỉ là các giá trị lệnh đọc từ `_acceptance/config.yaml` (executors.test.scripts/hooks/plugins/workflows, executors.script.mirror_sync/product_map). Chuỗi "tests/plugins/khong-co-trong-luoi.sh" là một tên bịa không tồn tại ở đâu trong config, nên vế `any(...)` luôn False và assert luôn xanh — không phân biệt được "phép đo bắt đúng" với "phép đo chưa bao giờ chạy". Hợp đồng AC-6 / evals E6 hứa ca âm là "đổi tên khối chốt trong BẢN SAO cây kiểm → lưới phải ĐỎ" (một mutant có dựng bản sao, như `probe()` ở E3 làm), nhưng code không copytree, không đổi tên khối chốt, không chạy lại gì cả. Toàn bộ chân E6 vì vậy chỉ còn một assert dương duy nhất (dòng 7252) không có đối chứng nào chứng minh nó biết đỏ.

Rationale: trùng lời hứa AC-6 về ca âm "đổi tên tệp chốt trong bản sao cây → lưới phải ĐỎ"; assert hiện tại chỉ kiểm một chuỗi bịa không tồn tại trong cấu hình, không mô phỏng được thao tác đổi tên mà AC-6 yêu cầu.

### Hình dạng 4 — assert `non_skill > 0` đo HỆ TỆP chứ không đo nhánh đọc, thông điệp tuyên sai vật
- file: `tests/plugins/run-tests.sh:7078`
- severity: high
- source: measurement
- AC: AC-2

Dòng 7078-7080 tự `rglob` lại `PLUGINS/pkg` một lần nữa để đếm file `.md/.toml/.yaml/.yml` không tên SKILL.md, rồi `assert non_skill > 0, "khong doc file chi dan NGOAI SKILL.md nao — nhanh do chua bao gio chay"`. Bộ đếm này hoàn toàn độc lập với `extract()` (dòng 7051-7063) — không dùng giá trị trả về nào của extract. Nếu vòng đọc trong `extract()` hỏng (đổi `DOC_EXT`, thêm điều kiện `f.name == "SKILL.md"`, hay `read_text` ném lỗi bị nuốt), `non_skill` vẫn > 0 và assert vẫn xanh trong khi "nhanh do" đúng là chưa bao giờ chạy. Thông điệp lỗi khẳng định một điều mà phép đo không hề đo.

Rationale: AC-2 yêu cầu "tập TỆP CHỈ DẪN đã quét phải phủ cả ba gói Codex"; bộ đếm này tính lại từ hệ tệp một cách độc lập với vòng đọc thật, nên không chứng minh được điều AC-2 đòi hỏi và có thể xanh dù vòng đọc hỏng.

### Hình dạng 4 — `PKGS <= scanned_pkgs` chỉ chứng minh THƯ MỤC tồn tại, không chứng minh đã quét gói
- file: `tests/plugins/run-tests.sh:7076`
- severity: high
- source: measurement
- AC: AC-2

Trong `extract()`, `pkgs.add(pkg_dir.name)` (dòng 7056) chạy TRƯỚC vòng `for f in sorted(pkg_dir.rglob("*"))` và không phụ thuộc vào việc có đọc được file nào. Vì vậy `assert PKGS <= scanned_pkgs, "quet thieu goi: ..."` (dòng 7076) chỉ khẳng định `plugins/` có đủ ba thư mục con — nó xanh ngay cả khi không một file chỉ dẫn nào trong `design-loop-codex` được mở. Hợp đồng AC-2 đòi "tập TỆP CHỈ DẪN đã quét phải phủ cả ba gói, đối chiếu danh sách viết trước"; phép đo hiện tại đo danh sách thư mục, không đo tập tệp đã quét (ví dụ `extract` phải trả số file đã đọc theo từng gói và assert từng gói > 0).

Rationale: AC-2 yêu cầu tập tệp ĐÃ QUÉT phủ đủ ba gói Codex đối chiếu danh sách viết trước; điều kiện hiện tại chỉ xác nhận thư mục gói tồn tại chứ không xác nhận có file nào trong đó thực sự được đọc.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **P162 fail-open: biểu thức rút tham chiếu bỏ sót dạng `${CLAUDE_PLUGIN_ROOT:-$PLUGIN_ROOT}` — 3 tham chiếu thật vô hình với chốt**
  Người dùng thấy gì: Nếu về sau có thêm trang hướng dẫn viết đường dẫn công cụ theo một cách khác với hai cách hiện đang được kiểm, hệ thống kiểm tra tự động sẽ không phát hiện được công cụ bị thiếu — dù hôm nay chưa có sự cố nào xảy ra.
  file: `tests/plugins/run-tests.sh:7050`
  severity: high
  Đề xuất: new-contract

- **Cây làm việc tạm rò khi assert thất bại, và mutant đo HEAD chứ không đo cây đang kiểm**
  Người dùng thấy gì: Khi phép kiểm tra nội bộ phát hiện đúng một lỗi, nó có thể để lại rác trong kho mã của người chạy, và phép kiểm này chỉ soi được các thay đổi đã lưu (commit) — sửa xong nhưng chưa lưu thì phép kiểm vẫn chạy trên bản cũ và có thể báo nhầm là ổn.
  file: `tests/plugins/run-tests.sh:7203`
  severity: medium
  Đề xuất: known-limits

- **Lưới thường trực bị neo vào hồ sơ workspace của MỘT feature (bảng ghim + mốc commit lịch sử)**
  Người dùng thấy gì: Danh sách công cụ chuẩn dùng để kiểm tra tự động đang nằm trong hồ sơ riêng của một tính năng đã đóng lại; nếu sau này cần thêm công cụ mới, người phụ trách phải sửa lại hồ sơ cũ đó thay vì một nơi cố định — dễ gây nhầm lẫn hoặc bị quên khi có người khác tiếp quản.
  file: `tests/plugins/run-tests.sh:7184`
  severity: medium
  Đề xuất: new-contract

- **P162: SELF_REF bỏ sót 2 dạng tham chiếu tự-gói ĐANG CÓ THẬT trong gói — con trỏ chết không bị bắt**
  Người dùng thấy gì: Một số trang hướng dẫn thật trong gói dùng cách viết đường dẫn công cụ khác với hai cách đang được kiểm tra tự động; nếu công cụ đó bị xoá nhầm, hệ thống sẽ không phát hiện ra và người dùng chỉ biết khi làm theo hướng dẫn mà công cụ không có ở đó.
  file: `tests/plugins/run-tests.sh:7050`
  severity: high
  Đề xuất: new-contract

- **P162 E6: assertion số lượng luôn đúng, không bao giờ đỏ được**
  Người dùng thấy gì: Có một bước kiểm tra nội bộ vô hại được viết ra để bắt lỗi đếm nhưng do cách viết nên nó không bao giờ có thể báo lỗi — không ảnh hưởng tới việc gói có đủ công cụ hay không, chỉ tạo cảm giác an toàn giả ở một chi tiết kỹ thuật nhỏ.
  file: `tests/plugins/run-tests.sh:7245`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — lớp khai 4 đuôi file chỉ dẫn nhưng chỉ có điểm-case `.md`, không có ma trận toàn phần**
  Người dùng thấy gì: Nếu công cụ bị xoá nhầm khỏi các định dạng tệp hướng dẫn ít phổ biến hơn (không phải .md), không có phép kiểm tự động nào xác nhận sẽ bắt được lỗi đó — dù hợp đồng có nói sẽ quét đủ mọi định dạng.
  file: `tests/plugins/run-tests.sh:7049`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — regex có 3 nhánh hình dạng tham chiếu, ma trận mutant chỉ phủ 2**
  Người dùng thấy gì: Có một cách viết đường dẫn công cụ (không dùng dấu ngoặc quanh tên biến gốc) không có phép kiểm thử riêng xác nhận nó hoạt động đúng, dù hợp đồng chỉ chính thức cam kết kiểm hai cách viết phổ biến nhất.
  file: `tests/plugins/run-tests.sh:7050`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — `len(resolved) == len(keys)` là assert đúng theo cấu trúc, không thể đỏ**
  Người dùng thấy gì: Có một bước kiểm tra nội bộ vô hại được viết ra như một cách đối chiếu số lượng nhưng do cách viết nên nó không bao giờ có thể báo lỗi — không ảnh hưởng tới kết quả kiểm tra chính, chỉ là một chi tiết kỹ thuật thừa.
  file: `tests/plugins/run-tests.sh:7245`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).