---
schema_version: 2
feature_slug: loi-moi-cong-may-sinh
verdict: REJECT
failed_evals: []
reason: 11/11 eval máy XANH cả hai vòng, nhưng rà soát đối kháng còn 5 finding TRONG hợp đồng chưa đóng (AC-2 · AC-3 ×2 · AC-5 · AC-8). ĐIỀU KHOẢN DỪNG-VÁ kích hoạt: ba trong năm finding vòng 2 cùng TÊN LỚP với vòng 1 (allowlist-trên-không-gian-mở · nhánh-không-có-chiều-đỏ · hai-nguồn-cho-một-luật), nên khuôn giải sai chứ không phải chi tiết sai. Máy KHÔNG dispatch vòng ba; trình người ba đường.
verified_by: implementing session (rà soát đối kháng do hai phiên tươi độc lập làm — xem Known limits #1)
enforcement_mode: strict
bypass_used: false
verified_commit: bf76d74ea17c30e78a6fd8c527c77bace09a111e
human_signoff:
---

# Evidence Report: loi-moi-cong-may-sinh

**Đọc dòng này trước mọi dòng khác.** Mọi phép đo máy đều XANH ở CẢ HAI vòng —
và cả hai vòng đối kháng đều tìm ra lỗ thật mà không phép đo nào bắt. Đây là
lý do hồ sơ này KHÔNG được ký với verdict PASS.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-3 | test | PASS |
| E10 | AC-1 | test | PASS |
| E11 | AC-5 | test | PASS |

## Evidence

Sinh TỪ `run-log.jsonl` vòng 2 — `verified_at` là `ts` thật, `exit_code` là mã
thoát thật; không con số nào đi qua tay người viết.

- eval: E1
  run_id: lmcms-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-02T12:32:45Z
  output: |
    Results: 795 passed, 0 failed

- eval: E2
  run_id: lmcms-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-02T12:32:45Z
  output: |
    Results: 795 passed, 0 failed

- eval: E3
  run_id: lmcms-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-02T12:30:48Z
  output: |
    Results: 795 passed, 0 failed

- eval: E4
  run_id: lmcms-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-02T12:32:45Z
  output: |
    Results: 795 passed, 0 failed

- eval: E5
  run_id: lmcms-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-02T12:32:45Z
  output: |
    Results: 795 passed, 0 failed

- eval: E6
  run_id: lmcms-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-02T12:32:45Z
  output: |
    Results: 795 passed, 0 failed

- eval: E7
  run_id: lmcms-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-02T12:32:45Z
  output: |
    Results: 795 passed, 0 failed

- eval: E8
  run_id: lmcms-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-02T12:32:45Z
  output: |
    Results: all plugin tests passed

- eval: E9
  run_id: lmcms-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-09-02T12:32:43Z
  output: |
    Results: 60 passed, 0 failed

- eval: E10
  run_id: lmcms-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-02T12:32:45Z
  output: |
    Results: all plugin tests passed

- eval: E11
  run_id: lmcms-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-02T12:32:45Z
  output: |
    Results: 795 passed, 0 failed

## Vòng chấm

| Vòng | Cây | Máy | Đối kháng | Kết quả |
|---|---|---|---|---|
| r1 | `d859a830` | 11/11 XANH | **9 finding TRONG hợp đồng** | REJECT → sửa |
| r2 | `bf76d74e` | 11/11 XANH | 6 đóng · 3 đóng-một-nửa · **5 finding còn/mới** | REJECT → **DỪNG-VÁ** |

Chấm lại TOÀN BỘ ở r2, không chỉ phần vừa vá.

## Vì sao DỪNG thay vì mở vòng ba

Điều khoản dừng-vá (`STOP-PATCHING-CLAUSE`): *vòng sửa thứ HAI vẫn sinh lỗi
CÙNG LỚP với vòng một ⇒ khuôn giải sai, không phải chi tiết sai.* «Cùng lớp» =
cùng TÊN LỚP trong sổ lớp lỗi, không cần cùng dòng mã. Ba lớp tái phát:

| Lớp lỗi | Vòng 1 | Vòng 2 |
|---|---|---|
| **allowlist trên không gian mở** | `OOC_NOISE_RE` liệt các câu «khai rỗng» | `ROUTING` liệt bốn loại entry sổ — xưởng thật dùng **11 loại** |
| **nhánh không có chiều đỏ** | hàng `'*'` chết · `g1Blocked` · AC-8 | vế tên-trường của `OOC_TRIED_ITEM_RE` · nửa prototype của `route()` |
| **hai nguồn cho một luật** | ROUTING chưa áp vào thẻ → hai dòng đá nhau | thẻ chưa-ký-được: `--extract` khai 6 ô hỏi, HTML khai «không cần làm gì» |

Nặng nhất và đã tự kiểm lại: bản vá «làm hàng `'*'` sống» **đẻ hồi quy thật**.
Vi phân hai cây trên hồ sơ `release-2-2-0`:

```
d859a830  hoi=[Ngoài-1..4, ký hay trả]        bao=[cắt/hoãn, Treo]
bf76d74e  hoi=[Ngoài-1..4, Treo, ký hay trả]  bao=[cắt/hoãn]
```

Nhóm Treo chuyển từ dòng-báo sang ô-hỏi ở hai hồ sơ thật — tức bản vá làm TĂNG
số ô hỏi, đúng chiều ngược với Đường đo của chính hợp đồng («≤3 lượt gọi
người/vòng, ≤1 chạm/lượt»). Nguyên nhân: để hàng mặc định sống, tôi lấy khoá
từ `e.type` rồi liệt bốn loại quen — nhưng bốn loại đó là allowlist, và xưởng
đang dùng 11 loại. Sửa một allowlist bằng cách dựng một allowlist khác.

## Ngoài hợp đồng

Xem `review-findings.md` — mục ngoài hợp đồng của cả hai vòng còn nguyên ở đó.
Cộng hai mục ghi sổ từ trước vòng này: khối Ngưỡng của thẻ không lột markdown
(`gate-card.js`), và thẻ chưa tự render khối `/goal` sau khi duyệt.

## Known limits

1. **Bằng chứng máy do chính phiên thi công chạy**; phần đối kháng do hai phiên
   tươi độc lập làm — và chính chúng tìm ra 100% lỗ (14 finding trong hợp đồng
   qua hai vòng, phép đo máy bắt **0**).
2. **Ba finding vòng 1 mới đóng MỘT NỬA**: hàng `'*'` sống nhưng nửa prototype
   chưa có răng · round-trip Cổng 1 là phép CHỨA không phải đẳng thức · răng
   AC-8 đo từ vựng không đo quan hệ (một bản chép khai NGƯỢC nguồn vẫn xanh).
3. **Vá đang giao có một hồi quy đã đo** (Treo → ô hỏi ở 2 hồ sơ) — chưa sửa,
   vì sửa nó là vòng ba mà điều khoản cấm tự mở.
4. Ba thước phải đổi theo hành vi đã khai ở vòng 1 (P186 · P192 · ba thẻ
   check-in). Đổi-thước-có-khai, nhưng số lần đổi thước trong MỘT vòng là tín
   hiệu đáng đọc kèm.
