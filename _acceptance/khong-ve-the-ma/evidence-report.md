---
schema_version: 2
feature_slug: khong-ve-the-ma
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 184a36464fc13b2af0786995890942cd64f481d1
human_signoff:
---

# Evidence Report: khong-ve-the-ma

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-1 | script | PASS |
| E10 | AC-6 | script | PASS |

## Evidence

- eval: E1
  run_id: khong-ve-the-ma-E1-r2-1787975273
  exit_code: 0
  verifier: config:executors.script.kvtm_vang_thu_muc
  verified_at: 2026-08-29T03:47:53Z
  output: |
    === rang khong-ve-the-ma · chan: vang-thu-muc ===
      PASS: doi-chung-duong (ho so that: exit 0, 4999 byte the)
      PASS: AC-1 ma thoat khac 0 (=2)
      PASS: AC-1 stdout RONG (0 byte the)
      PASS: AC-1 ghim thong diep «gate-card: không có hồ sơ»
    --- chan vang-thu-muc: 4 pass, 0 fail ---

- eval: E2
  run_id: khong-ve-the-ma-E2-r2-1787975283
  exit_code: 0
  verifier: config:executors.script.kvtm_liet_ho_so_that
  verified_at: 2026-08-29T03:48:03Z
  output: |
    === rang khong-ve-the-ma · chan: liet-ho-so-that ===
      PASS: AC-2 neu dung ten vua go
      PASS: AC-2 liet ho so that alpha
      PASS: AC-2 liet ho so that beta
      PASS: AC-2 danh sach doc tu he thong tep that (beta bien mat khi xuong khong co)
      PASS: AC-2 alpha van con trong xuong rut gon
    --- chan liet-ho-so-that: 5 pass, 0 fail ---

- eval: E3
  run_id: khong-ve-the-ma-E3-r2-1787975291
  exit_code: 0
  verifier: config:executors.script.kvtm_thieu_hop_dong
  verified_at: 2026-08-29T03:48:11Z
  output: |
      PASS: AC-3 [o-evals/doan-cong] ghim «gate-card: hồ sơ chưa có contract.md»
      PASS: AC-3 [o-evals/doan-cong] phan biet duoc voi ca vang-thu-muc
      PASS: AC-3 [o-evals/gate2] ma thoat khac 0 (=2)
      PASS: AC-3 [o-evals/gate2] stdout RONG
      PASS: AC-3 [o-evals/gate2] ghim «gate-card: hồ sơ chưa có contract.md»
      PASS: AC-3 [o-evals/gate2] phan biet duoc voi ca vang-thu-muc
      PASS: AC-3 ma tran du 6 o (so assert = so phan tu)
      PASS: AC-3 doi-chung-duong (them contract.md -> exit 0, 4995 byte)
      PASS: AC-3 doi-chung-duong Cong 2 (hop dong + bang chung -> exit 0, 5001 byte)
    --- chan thieu-hop-dong: 27 pass, 0 fail ---

- eval: E4
  run_id: khong-ve-the-ma-E4-r2-1787975298
  exit_code: 0
  verifier: config:executors.script.kvtm_chua_mo_xuong
  verified_at: 2026-08-29T03:48:18Z
  output: |
    === rang khong-ve-the-ma · chan: chua-mo-xuong ===
      PASS: AC-4 ma thoat khac 0 (=2)
      PASS: AC-4 stdout RONG
      PASS: AC-4 ghim thong diep «gate-card: xưởng chưa mở»
      PASS: AC-4 phan biet duoc voi AC-1 va AC-3
      PASS: AC-4 doi-chung-duong (mo xuong -> doi sang thong diep vang-thu-muc)
    --- chan chua-mo-xuong: 5 pass, 0 fail ---

- eval: E5
  run_id: khong-ve-the-ma-E5-r2-1787975305
  exit_code: 0
  verifier: config:executors.script.kvtm_extract
  verified_at: 2026-08-29T03:48:25Z
  output: |
      PASS: AC-5 [ho-so-ma] --extract stdout RONG
      PASS: AC-5 [ho-so-ma] ghim «gate-card: không có hồ sơ»
      PASS: AC-5 [ho-so-rong] --extract thoat khac 0 (=2)
      PASS: AC-5 [ho-so-rong] --extract stdout RONG
      PASS: AC-5 [ho-so-rong] ghim «gate-card: hồ sơ chưa có contract.md»
      PASS: AC-5 [bat-ky] --extract thoat khac 0 (=2)
      PASS: AC-5 [bat-ky] --extract stdout RONG
      PASS: AC-5 [bat-ky] ghim «gate-card: xưởng chưa mở»
      PASS: AC-5 doi-chung-duong (--extract ho so du: JSON hop le co khoa gate)
    --- chan extract: 10 pass, 0 fail ---

- eval: E6
  run_id: khong-ve-the-ma-E6-r2-1787975313
  exit_code: 0
  verifier: config:executors.script.kvtm_doi_chung_duong
  verified_at: 2026-08-29T03:48:33Z
  output: |
    === rang khong-ve-the-ma · chan: doi-chung-duong ===
      PASS: AC-6 ho so du: ma thoat 0
      PASS: AC-6 the con khoi «Hệ thống SẼ làm»
      PASS: AC-6 the con khoi «Sẽ KHÔNG làm»
      PASS: AC-6 tiem mutant doi duoc vat (74878 -> 73587 byte)
      PASS: AC-6 mutant khong-chot VE LAI the ma (exit 0, 4190 byte) — phep do phan biet duoc co-chot/khong-chot
    --- chan doi-chung-duong: 5 pass, 0 fail ---

- eval: E7
  run_id: khong-ve-the-ma-E7-r2-1787975321
  exit_code: 0
  verifier: config:executors.script.kvtm_than_lenh
  verified_at: 2026-08-29T03:48:41Z
  output: |
      PASS: AC-7 luat «khong-render» co mat
      PASS: AC-7 luat «khong-ghi-card-html» co mat
      PASS: AC-7 luat «thuat-lai-tieng-san-pham» co mat
      PASS: AC-7 mutant «chay-chot-truoc-khi-render» do dung menh de bi go
      PASS: AC-7 mutant «khong-render» do dung menh de bi go
      PASS: AC-7 mutant «khong-ghi-card-html» do dung menh de bi go
      PASS: AC-7 mutant «thuat-lai-tieng-san-pham» do dung menh de bi go
      PASS: AC-7 thu tu: khoi tien de (dong 38) dung TRUOC buoc render dau tien (dong 114)
      PASS: AC-7 mutant hoan vi: doi khoi xuong cuoi -> phep do DO dung nhu ky vong
    --- chan than-lenh: 11 pass, 0 fail ---

- eval: E8
  run_id: khong-ve-the-ma-E8-r2-1787975328
  exit_code: 0
  verifier: config:executors.script.kvtm_round_trip
  verified_at: 2026-08-29T03:48:48Z
  output: |
      PASS: AC-8 «gate-card: hồ sơ chưa có contract.md» ghep dung MOT loi thuat rieng (rut tu MSG_NO_CONTRACT)
      PASS: AC-8 dang thuc: 3 dong thuat = 3 hang rut duoc
      PASS: AC-8 du 3 cap (so assert = so phan tu)
      PASS: AC-8 mutant [MSG_NO_WORKSPACE]: doi chu ben viet -> cap do dung cho
      PASS: AC-8 mutant [MSG_NO_WORKSPACE] khong lam do lan hai cap kia
      PASS: AC-8 mutant [MSG_NO_DOSSIER]: doi chu ben viet -> cap do dung cho
      PASS: AC-8 mutant [MSG_NO_DOSSIER] khong lam do lan hai cap kia
      PASS: AC-8 mutant [MSG_NO_CONTRACT]: doi chu ben viet -> cap do dung cho
      PASS: AC-8 mutant [MSG_NO_CONTRACT] khong lam do lan hai cap kia
    --- chan round-trip: 11 pass, 0 fail ---

- eval: E9
  run_id: khong-ve-the-ma-E9-r2-1787975337
  exit_code: 0
  verifier: config:executors.script.kvtm_suite_case
  verified_at: 2026-08-29T03:48:57Z
  output: |
    === rang khong-ve-the-ma · chan: suite-case ===
      PASS: suite co dong «PASS: GM01»
      PASS: suite co dong «PASS: GM02»
      PASS: suite co dong «PASS: GM03»
      PASS: suite co dong «PASS: GM04»
      PASS: suite co dong «PASS: GM05»
      PASS: suite co dong «PASS: GM06»
      PASS: suite khong co case GM* nao ngoai danh sach khai
      PASS: khong case GM* nao FAIL
    --- chan suite-case: 8 pass, 0 fail ---

- eval: E10
  run_id: khong-ve-the-ma-E10-r2-1787975419
  exit_code: 0
  verifier: config:executors.script.kvtm_suite_tong
  verified_at: 2026-08-29T03:50:19Z
  output: |
    === rang khong-ve-the-ma · chan: suite-tong ===
      PASS: cay hien tai: 0 case fail
      PASS: so case: base 749 -> moi 767 (>= 755, du 6 case moi, khong mat case nao)
    --- chan suite-tong: 2 pass, 0 fail ---

## Known limits

- Tầng thân lệnh (AC-7, AC-8) đo VĂN BẢN của thân lệnh — sự có mặt, quan hệ thứ
  tự, và phép ghép cặp — chứ KHÔNG đo một lượt chạy thật của lệnh. Tầng đo được
  đầu ra thật ở đây là ca đo skill (`evals/thieu-ho-so-khong-ve-the-ma/`, chấm
  `last_message`), và tầng đó đang TRƠ: `claude plugin eval` chưa được bật cho
  org. Đây là giới hạn ĐÃ KHAI, không phải bất định: cái không đo được đã gọi
  đúng tên và có sẵn đường đo khi harness mở.

## Ngoài hợp đồng

## Analyst

Vòng verify này không chạy nhánh baseline trên diffBase, nên không eval nào mang
trường `baseline` và danh sách green-on-both không xác lập được từ lượt chạy này.
Bù lại, hai chân mang răng nội tại chạy trong chính lượt này: E6 tiêm một bản sao
`gate-card.js` đã gỡ khối chốt và chứng bản sao đó VẼ LẠI thẻ ma (phép đo phân
biệt được có-chốt / không-chốt), còn E7 và E8 mỗi mệnh đề một mutant riêng, mỗi
mutant chỉ được làm đỏ đúng cặp của nó. E10 so theo SỐ ca chứ không theo mã thoát
của suite.

## Variance

none — không eval nào khai `runs > 1`; cả mười đều tất định.

## Iterations

Round 1: mọi eval đạt, không eval nào trượt — nhưng lượt chạy diễn ra khi mã của
tính năng còn nằm trong cây làm việc chưa commit, nên `verified_commit` khi đó
trỏ vào một cây KHÔNG chứa mã được nghiệm thu; bằng chứng không neo vào vật.
Round 2: chạy lại trọn 10 eval trên cây đã commit (184a3646, cây làm việc sạch
ngoài `_acceptance/`) sau khi `rang.sh` đổi sang tệp tạm riêng cho mỗi lượt chạy;
10/10 đạt, bằng chứng nay neo đúng cây. Đây là sửa NEO, không phải sửa mã.
