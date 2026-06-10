# QUICKSTART — Acceptance Gate (5 phút đọc)

Gate nghiệm thu cho code do AI viết. Thay vì bạn click tay 1-2 giờ kiểm tra
một tính năng, máy tự chạy bộ evals và nộp **evidence report**; bạn chỉ làm
2 việc, mỗi việc 5-10 phút:

```
yêu cầu (prompt/ticket/PRD)
  → máy viết contract + evals     ── 🚪 CỔNG 1: bạn DUYỆT TIÊU CHÍ (5-10p)
  → AI code như bình thường
  → máy verify + evidence report  ── 🚪 CỔNG 2: bạn KÝ NGHIỆM THU (5-10p)
```

Verdict PASS không có bằng chứng máy (run_id, exit_code, verifier) sẽ bị
**hook chặn ngay lúc ghi file** — AI không thể tự khai "done". CI chặn merge
report chưa ký.

---

## Cài 1 lần mỗi máy (2 lệnh)

```bash
claude plugin marketplace add phanlemanh/acceptance-gate-kit
claude plugin install acceptance-gate@acceptance-gate-kit
```

> Cần quyền đọc repo GitHub `phanlemanh/acceptance-gate-kit` (hỏi Mạnh nếu chưa có).
> Sau khi cài, restart phiên Claude Code đang mở.

## Setup 1 lần mỗi repo (thường đã có sẵn)

Nếu repo đã có thư mục `_acceptance/` → bỏ qua mục này.
Repo mới: chạy `/acceptance-init` trong Claude Code, trả lời các câu hỏi
(lệnh test, đường dẫn nhạy cảm...). CI: copy `scripts/pre-merge-check.sh`
từ plugin vào repo và thêm 1 step `bash scripts/pre-merge-check.sh .`.

---

## Dùng hằng ngày

**Bắt đầu tính năng mới** — nói với Claude Code:

```
/acceptance <tên tính năng>     (hoặc: "acceptance feature X")
```

Máy sẽ tạo 2 file trong `_acceptance/<slug>/` rồi DỪNG chờ bạn:

| File | Bạn kiểm tra gì ở Cổng 1 |
|---|---|
| `contract.md` | Tiêu chí Given/When/Then có đúng ý nghiệp vụ? Mục Out-of-scope có đủ? |
| `evals.yaml` | Mỗi tiêu chí có ít nhất 1 eval? Executor hợp lý? |

Sửa trực tiếp nếu cần → approve (máy ghi `approved_by`). **Đây là 10 phút
đáng giá nhất**: sửa 1 dòng tiêu chí ở đây rẻ hơn 10 lần phát hiện sai sau khi code xong.

**Sau khi AI code xong** — máy tự verify và viết `evidence-report.md`.
Ở Cổng 2 bạn:

1. Đọc bảng per-eval (1 dòng/eval) + liếc 1-2 evidence bất kỳ
2. Tự tay kiểm CHỈ những item `UNCERTAIN` (máy không dám chắc → đẩy lên người)
3. Điền `human_override: <Tên> <ngày>` cho từng item đã kiểm
4. Nếu verdict là `PENDING-JUDGMENT` → sửa thành `PASS` (nhờ agent sửa để hook re-validate)
5. Điền `human_signoff: <Tên> <ngày>` trong frontmatter → xong, merge được

**Xem trạng thái mọi tính năng:** `/acceptance-status`

---

## Verdict nghĩa là gì

| Verdict | Nghĩa | Bạn làm gì |
|---|---|---|
| `PASS` | Mọi eval xanh, có bằng chứng | Đọc report, ký signoff |
| `PENDING-JUDGMENT` | Máy xanh hết, còn item chờ người phán | Kiểm item UNCERTAIN, override, nâng PASS |
| `REJECT` | Có eval fail (kèm `failed_evals`) | AI sửa code, tự verify lại (tối đa 3 vòng) |
| `BLOCKED` | Không chạy được verifier (env hỏng) | Sửa môi trường, không phải sửa code |

## Khi bị hook chặn (BLOCKED by acceptance-evidence-gate)

Đọc message — nó nói thiếu gì. 99% là một trong ba:
- **Thiếu evidence field** → chạy verifier thật, điền `run_id/exit_code/verifier/verified_at`
- **Verifier không hợp lệ** → phải là script tồn tại hoặc `config:executors.<type>.<surface>`; "manual review" bị từ chối by design
- **Còn UNCERTAIN chưa override** → người kiểm rồi điền `human_override`

**Đừng bao giờ** sửa chữ verdict để lách — REJECT trung thực luôn hợp lệ,
PASS giả mới bị chặn. Trong report PASS, log dán vào `output:` phải sạch
token `exit=1`/`exit_code: 1` (sanitize trước khi dán).

## Risk tiers

- **T1** (docs, typo, config vặt): gate tự bỏ qua — không tạo file gì
- **T2** (mặc định): flow đầy đủ
- **T3** (auth/data/migrations): verdict của AI-judge chỉ tham khảo — bạn
  phải tự kiểm **mọi** judgment item (hook ép, không né được)

## FAQ

- **UNCERTAIN có phải lỗi không?** Không — là thiết kế. Judge bị cấm đoán mò;
  không chắc thì đẩy lên người. UNCERTAIN nhiều (>50%) = tiêu chí viết chưa đủ rõ ở Cổng 1.
- **Tôi muốn skip Cổng 1 cho lẹ?** Gate sẽ từ chối một lần và giải thích; nếu vẫn
  muốn, nó ghi `gate1_skipped: true` làm audit trail. Đừng biến thành thói quen.
- **Bypass khẩn cấp?** `ACCEPTANCE_GATE_BYPASS=1` — chỉ dùng khi migrate
  legacy, và CI vẫn chặn merge report chưa ký.
- **Đo hiệu quả?** `time_human_minutes` trong contract.md — điền số phút thật ở
  mỗi cổng; baseline nằm ở `_acceptance/config.yaml::baseline_minutes`.

Chi tiết kỹ thuật: [README.md](README.md) · Thiết kế: [docs/specs/](docs/specs/2026-06-10-acceptance-gate-kit-design.md)
