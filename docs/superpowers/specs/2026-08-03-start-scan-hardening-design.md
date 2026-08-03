# Làm cứng bộ quét /start (start-scan-hardening) — Design

> Vòng con sinh từ Cổng 2 của start-command (03/08): 4 finding ngoài hợp đồng
> được ký known-limits kèm định hướng "gom một vòng làm cứng bộ quét". Scope
> chốt đúng 4 mục đó — không mở rộng. Nguồn: `_acceptance/start-command/contract.md`
> mục Notes + `review-findings.md` hai round S4.

## Vấn đề

Bộ quét `scripts/start-scan.mjs` đúng trên đường lành nhưng **fail-open trên
đầu vào bất thường**: lỗi I/O bị nuốt thành "file vắng" (việc chờ ký biến mất
im lặng khỏi thẻ), verdict ngoài từ vựng lọt qua một nhánh, lỗi gõ lệnh bị đổi
nghĩa thành chẩn đoán trạng thái repo, và một chân đối chứng âm trong P101
không thể đỏ. Tất cả cùng một lớp: **lỗi phải có tên, không được đổi nghĩa.**

## Giải — 4 mục, theo tiền lệ sẵn có của repo

1. **`read()` chỉ nuốt ENOENT.** Trả `{t, err}`; `err` khác ENOENT (EACCES,
   EISDIR, ELOOP…) → slug vào `broken[]` với ĐÚNG tên file + reason nêu mã lỗi
   (`không đọc được (EACCES)`) — không rơi sang artifact bên cạnh, không nói
   "không có file" khi file còn đó.
2. **Verdict ngoài từ vựng bị nêu tên ở MỌI nhánh.** `implemented` +
   verdict ∉ {PASS, REJECT, PENDING-JUDGMENT} → `broken[]` cùng khuôn thông
   điệp với nhánh `verified` (`verdict không nhận diện được: X`). Một artifact,
   một từ vựng, một cách chết.
3. **Argv chặt — lớp declared-but-unusable exit 2** (tiền lệ:
   `sync-plugin-packages.sh` từ chối mode lạ, `pre-merge-check.sh` v1.22.1):
   `--root` thiếu giá trị / giá trị rỗng → exit 2 + usage; token lạ → exit 2
   nêu token; `--root` trỏ đường dẫn không tồn tại hoặc không phải thư mục →
   exit 2 nêu đường dẫn — phân biệt rạch ròi với `config:false` (root có thật
   nhưng repo chưa init). Hai thân lệnh hardcode `--root .` nên không đổi khuôn
   lệnh nào.
4. **Chân đối chứng âm của phép đo docs (P101) phải chạy CHÍNH phép đo.**
   Viết lại thành hàm dùng chung `check_docs(...)`: chân dương chạy trên bản
   thật (phải trả rỗng), chân âm chạy trên bản mutant xoá mục /start (phải trả
   đúng thông điệp) — mẫu check() của P99/P100.

## Bất biến giữ nguyên

- Schema JSON không đổi key (marker START-SCAN-KEYS hai harness giữ nguyên,
  P99 không đổi). `broken[].reason` là giá trị chuỗi — thêm nội dung, không thêm key.
- Chỉ-đọc tuyệt đối; mọi case mới có đối chứng dương + ghim đúng thông điệp;
  fixture do code sinh; sửa nguồn xong sync mirror cùng lượt.

## Ngoài phạm vi (nói tên để khỏi bàn lại)

- **git-lỗi nuốt về null** (finding S4-r1 chưa được định đoạt ở cổng nào) —
  cần đổi schema JSON (`git.error`) + marker 2 harness + P99: để vòng riêng,
  entry `revisit` trong ledger.
- **Fixture P98/P99 rút từ template marker** thay vì viết tay — chất lượng
  test, không phải hành vi bộ quét; entry `revisit`.
- Không thêm cờ CLI mới, không đổi thân lệnh /start ở cả hai harness.

## Phạm vi thi công

| Chạm | Việc |
|---|---|
| `scripts/start-scan.mjs` | read() {t,err} · off-vocab mọi nhánh · argv validation exit 2 |
| `tests/plugins/run-tests.sh` | P102 (I/O errors + off-vocab) · P103 (argv, 4 đường chết + 1 dương) · P101 viết lại chân âm |
| mirror | sync + commit cùng lượt |
