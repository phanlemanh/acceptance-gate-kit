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

## Cài 1 lần mỗi máy

Claude Code:

```bash
claude plugin marketplace add phanlemanh/acceptance-gate-kit
claude plugin install acceptance-gate@acceptance-gate-kit
```

> **Codex:** bản port đang hoàn thiện, **chưa phát hành** — hiện kit chỉ chạy trên
> Claude Code. (Bản Codex sẽ được công bố kèm ghi chú riêng về mức enforcement,
> vì Codex không có hook chặn lúc ghi file như Claude Code.)

> Cần quyền đọc repo GitHub `phanlemanh/acceptance-gate-kit` (hỏi Mạnh nếu chưa có).
> Sau khi cài, mở phiên Claude Code mới để runtime nạp plugin.

## Cập nhật plugin (quan trọng với cả đội)

```bash
claude plugin update acceptance-gate@acceptance-gate-kit
claude plugin update feature-loop@acceptance-gate-kit    # nếu đã cài
```

Chạy khi có thông báo release, hoặc đầu mỗi sprint. Hai dev chạy 2 version
khác nhau trên cùng repo = 2 chuẩn gate khác nhau (verifier bị chặn "oan",
feature lọt eval...) — cập nhật là một phần của kỷ luật gate, không phải tuỳ chọn.

## Setup 1 lần mỗi repo (thường đã có sẵn)

Nếu repo đã có thư mục `_acceptance/` → bỏ qua mục này.
Repo mới: chạy `/acceptance-init` trong Claude Code, trả lời các câu hỏi
(lệnh test, đường dẫn nhạy cảm...).

**CI:** copy **đủ 3 file** từ plugin vào repo, giữ đúng layout `scripts/` + `lib/`
(re-check cần `require ../lib`), rồi thêm 1 step `bash scripts/pre-merge-check.sh .`:

- `scripts/pre-merge-check.sh`
- `scripts/recheck-evidence.js`
- `lib/evidence-core.js`

Chỉ copy mỗi `pre-merge-check.sh` là repo âm thầm **mất lớp re-check** evidence
đã commit (chống report bị sửa tay sau hook).

**Repo có web UI:** chạy thêm `npm i -D jsdom` — design gate chạy chế độ DOM
cần jsdom; thiếu nó mọi eval design sẽ ra `BLOCKED`.

---

## Dùng hằng ngày

**Bắt đầu tính năng mới** — nói với agent:

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
  legacy. Lần bypass được GHI vào report (`bypass_used: true`) và CI
  `pre-merge-check.sh` CHẶN merge — trừ khi 1 người ghi `bypass_ack: <tên>
  <ngày>` để chủ động chịu trách nhiệm (để lại dấu vết audit).
- **Đo hiệu quả?** `time_human_minutes` trong contract.md — điền số phút thật ở
  mỗi cổng; baseline nằm ở `_acceptance/config.yaml::baseline_minutes`.

---

# ⚡ feature-loop — vòng lặp trọn gói (plugin thứ 2, tùy chọn)

Nếu acceptance-gate là **cái cổng**, feature-loop là **cả con đường**: một lệnh
duy nhất dẫn tính năng từ ý tưởng → design → contract+evals → plan → code →
verify đa-agent → evidence → PR. Bạn vẫn chỉ dừng tay đúng 2 lần (T3: 3 lần).

```
/feature-loop <mô tả tính năng>
  S1 máy brainstorm với bạn → design + contract + evals  ── 🚪 CỔNG 1 (duyệt 1 gói)
  S2 máy lên plan            (T3: 🚪 duyệt plan)
  S3 máy code                (task độc lập → chạy song song, mỗi task 1 worktree)
  S4 máy verify MỘT lần chạy: evals máy (dedupe) + 3 AI-judge
     độc lập/judgment + code review adversarial → evidence-report.md
     fail → tự quay lại sửa, tối đa 3 vòng
  ── 🚪 CỔNG 2: bạn kiểm UNCERTAIN + ký signoff
  S5 máy tạo PR
```

**Cài thêm (sau khi đã cài acceptance-gate):**

```bash
claude plugin install feature-loop@acceptance-gate-kit
claude plugin install superpowers@claude-plugins-official   # dependency (brainstorm/plan)
```

`feature-loop` dùng Claude workflow scripts. (Bản `feature-loop-codex` cho Codex
đang hoàn thiện, **chưa phát hành**.)

**Setup mỗi repo:** đã chạy `/acceptance-init` rồi thì chỉ cần thêm vào
`_acceptance/config.yaml` các lệnh verify chạy mỗi vòng (chọn từ `executors.*`
của repo bạn — quên cũng không sao, lần đầu chạy skill sẽ hỏi rồi tự ghi):

```yaml
feature_loop:
  suite_keys:
    - executors.test.build       # ví dụ — dùng key THẬT của repo bạn
    - executors.test.typecheck
```

**Dùng:** `/feature-loop <mô tả>` cho tính năng mới · truyền `<slug>` để
resume (loop nhớ đang ở đâu qua `status` trong contract.md — đổi máy/đổi session
vẫn tiếp tục đúng chỗ). Sửa nhỏ T1 (docs/typo) → loop tự thoát, làm kiểu thường.

**Khác gì chạy acceptance-gate tay?** Cùng contract/evals/hook/CI — feature-loop
chỉ tự động hóa phần giữa các cổng: gộp duyệt design+contract+evals làm 1 lần,
verify chạy song song (1 lệnh test cover nhiều eval, không chạy lặp), judgment
có 3 AI-judge bỏ phiếu trước khi đến tay bạn, và code review adversarial đính kèm
luôn vào gói Cổng 2.

---

Chi tiết kỹ thuật: [README.md](README.md) · feature-loop: [feature-loop/README.md](feature-loop/README.md) · Thiết kế: [docs/specs/](docs/specs/2026-06-10-acceptance-gate-kit-design.md)
