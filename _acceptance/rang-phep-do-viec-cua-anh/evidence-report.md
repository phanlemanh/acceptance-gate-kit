---
schema_version: 2
feature_slug: rang-phep-do-viec-cua-anh
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 44bfc5a548c0f2aac5b8ec15831f68cf97c204b8
human_signoff:          # Gate 2 — human writes "<name> <ISO date>" AFTER review
---

# Evidence Report: rang-phep-do-viec-cua-anh

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E7 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |

E1–E5 dùng chung MỘT lần chạy `bash tests/plugins/run-tests.sh` (dedupe cmd);
mỗi khối dưới trích ĐÍCH DANH dòng output của chính phép đo mà eval đó gọi tên.
Mọi needle được grep trên log lần chạy, mỗi needle hit ≥1.

## Evidence

- eval: E1
  run_id: rang-phep-do-viec-cua-anh-E1-1786410780
  exit_code: 0
  baseline: red          # origin/main: suite xanh nhưng cả 5 needle E1 vắng trong stdout (SANITY-CO-LAP-LUAT-* chưa tồn tại trước khi vá)
  verifier: config:executors.test.plugins
  verified_at: 2026-08-11T01:13:00Z
  output: |
    SANITY-CO-LAP-LUAT-chi-bao: clause con nguyen trong ban dot bien
    MUTANT-lop-luat-chi-bao: xoa luat GIU clause -> check() DO ghim 'thieu luat chi-bao'
    SANITY-CO-LAP-LUAT-cam-dau-hoi: clause con nguyen trong ban dot bien
    MUTANT-lop-luat-cam-dau-hoi: xoa luat GIU clause -> check() DO ghim 'cam cau tu tu'
      PASS: P189 khuon VIEC-CUA-ANH: 3 ve + mau gop 1 dong + chi-bao + cam-dau-hoi (E6)

- eval: E2
  run_id: rang-phep-do-viec-cua-anh-E2-1786410780
  exit_code: 0
  baseline: red          # origin/main: chuỗi CO-LAP-CLAUSE-OK không tồn tại trong stdout suite trước khi vá
  verifier: config:executors.test.plugins
  verified_at: 2026-08-11T01:13:00Z
  output: |
    P189 DUONG-OK (khuon du 5 chuan tren cay that)
    CO-LAP-CLAUSE-OK: marker GATE-INVITE-CLAUSE da vang trong ban dot bien, check() van 0 loi — vung do P189 khong an clause

- eval: E3
  run_id: rang-phep-do-viec-cua-anh-E3-1786410780
  exit_code: 0
  baseline: red          # origin/main: MUTANT-4/5/6, SANITY-LUAT-CU-IM và luật đếm-nguồn chưa tồn tại (0 hit)
  verifier: config:executors.test.plugins
  verified_at: 2026-08-11T01:13:00Z
  output: |
    MUTANT-4: go 1 trong 2 ban o site NGUON feature-loop/skills/feature-loop/SKILL.md (khong co ban dung de mat theo — mo phong sau-sync tron ven)
    SANITY-LUAT-CU-IM: lech() va thieu_ban() deu im tren dot bien nguon-it-hon — lo r3 la that, luat moi khong thua
    MUTANT-4 bi bat: dem_nguon do dich danh feature-loop/skills/feature-loop/SKILL.md: it-hon-so-khai (1 < 2)
    MUTANT-5 bi bat: dem_nguon do dich danh feature-loop/skills/feature-loop/SKILL.md: nhieu-hon-so-khai (3 > 2)
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
      PASS: P188 round-trip dieu khoan moi-cong: nguon + MOI ban chep (ke ca goi dung + overlay) khop tung ky tu (E5)

- eval: E4
  run_id: rang-phep-do-viec-cua-anh-E4-1786410780
  exit_code: 0
  baseline: red          # origin/main: MUTANT-7 / SANITY-LUAT-KHOP-IM / luật ranh-giới-câu chưa tồn tại (0 hit)
  verifier: config:executors.test.plugins
  verified_at: 2026-08-11T01:13:00Z
  output: |
    MUTANT-7: tai tao layout pre-3caee05 trong skills/acceptance/SKILL.md (clause dong rieng chen giua 'the verdict + hook' / 'are unchanged.')
    SANITY-LUAT-KHOP-IM: lech/thieu_ban/dem_nguon deu im tren dot bien chen-giua-cau — chi ranh_gioi do duoc lo nay
    MUTANT-7 bi bat: ranh_gioi do dich danh skills/acceptance/SKILL.md @17433 (truoc khong ket cau: ...' collapsed; the verdict + hook')
    P188 DUONG-OK (6 site nguon + 3 ban dung/overlay suy ra, 4 cap nguon-ban-dung; dem nguon khop so khai 10 ban; ranh gioi cau qua o 15 luot xuat hien)

- eval: E5
  run_id: rang-phep-do-viec-cua-anh-E5-1786410780
  exit_code: 0
  baseline: red          # origin/main: suite xanh nhưng dòng "P188 OK (" cũ KHÔNG kèm số chiều đỏ ("moi ban chep khop; mutant ... deu do dich danh" — không đếm) — eval phân biệt được
  verifier: config:executors.test.plugins
  verified_at: 2026-08-11T01:13:00Z
  output: |
    P189 OK (5 chuan; 5 mutant chuan + 2 mutant co-lap-lop DO dung thong diep + 1 doi chung co-lap XANH, tat ca qua checker that)
    P188 OK (15 luot khop + ranh gioi + dem nguon 10 ban; 7 chieu do: lech-1-trong-2, go-overlay, go-1-ban-dung, nguon-it-hon, nguon-nhieu-hon (dieu kien B), manifest-thieu-so fail-loud (dieu kien B), chen-giua-cau 3caee05 — tat ca in xac-nhan-dot-bien va di qua luat that)
    Results: all plugin tests passed

- eval: E7
  run_id: rang-phep-do-viec-cua-anh-E7-1786410823
  exit_code: 0
  baseline: n-a          # script là vật của chính hồ sơ này, không tồn tại trên origin/main; phép so của nó lấy origin/main làm base tường minh
  verifier: bash _acceptance/rang-phep-do-viec-cua-anh/no-vat-that-drift.sh origin/main
  verified_at: 2026-08-11T01:13:43Z
  output: |
    scripts/gate-card.js: vang trong diff name-only so voi origin/main
    YOUR-MOVE-BLOCK-TEMPLATE: byte-equal voi origin/main
    GATE-INVITE-CLAUSE: byte-equal voi origin/main
    skills/acceptance/SKILL.md: cho dat clause giu nguyen (2 ban, dong [156, 261])
    commands/acceptance-card.md: cho dat clause giu nguyen (1 ban, dong [90])
    feature-loop/skills/feature-loop/SKILL.md: cho dat clause giu nguyen (2 ban, dong [103, 203])
    codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md: cho dat clause giu nguyen (2 ban, dong [363, 664])
    codex/acceptance-gate/skills/acceptance/SKILL.md: cho dat clause giu nguyen (2 ban, dong [163, 275])
    codex/acceptance-gate/skills/acceptance-card/SKILL.md: cho dat clause giu nguyen (1 ban, dong [95])
    NO-DRIFT OK: gate-card.js + khuon + clause + cho dat khong doi so voi origin/main

- eval: E6
  run_id: rang-phep-do-viec-cua-anh-E6-1786410823
  exit_code: 0
  baseline: green        # guard vĩnh viễn P30 — xanh cả hai phía là chủ đích (mirror == nguồn), xem Analyst
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-11T01:13:43Z
  output: |
    plugins/ mirror in sync.

## Analyst

E6 green-on-both: `sync-plugin-packages.sh --check` xanh trên cả nhánh lẫn
origin/main — đây là regression guard chủ đích (P30 giữ mirror == nguồn sau khi
manifest thêm số đếm được sync), không phải eval phân biệt tính năng; giữ nguyên.
E1–E5 đều red trên baseline: chạy đối chiếu THẬT trên worktree origin/main
(suite baseline xanh trọn nhưng 0 hit cho mọi needle mới — SANITY-CO-LAP-LUAT-*,
CO-LAP-CLAUSE-OK, MUTANT-4/5/6/7, SANITY-LUAT-CU-IM/KHOP-IM; dòng P188 OK cũ
không kèm số chiều đỏ). E7 n-a trên baseline (script mới sinh trong hồ sơ này).

## Variance

none — hồ sơ không có eval stochastic (không eval nào khai runs > 1).

## Iterations

Round 1: cả 7 eval PASS ngay lần chạy đầu — không vòng sửa nào.

## S4 self-host (phụ — nếp tự-host, không phải eval của hồ sơ)

Cùng cây 44bfc5a5, cả bốn lệnh đều exit 0:
- `bash tests/scripts/run-tests.sh` — "Results: 671 passed, 0 failed"
- `bash tests/hooks/run-tests.sh` — "Results: 54 passed, 0 failed"
- `bash tests/workflows/run-tests.sh` — "Results: all workflow tests passed"
- `node scripts/product-map.mjs --root . --check` — "PRODUCT-MAP.md khớp hồ sơ xưởng."

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line (hồ sơ này: không có eval judgment)
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (n/a — T2)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (n/a — verdict PASS máy)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract
