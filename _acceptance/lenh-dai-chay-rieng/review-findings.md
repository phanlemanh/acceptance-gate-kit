# Review findings: lenh-dai-chay-rieng (round 4)

## Trong hợp đồng

- **The new pid identity check stops orphan cleanup under zsh, and LN7/LN9 only test it under bash**
  file: `feature-loop/workflows/acceptance-verify.js:709`
  severity: high
  AC: AC-3
  source: conventions
  detail: After round 3, BOC_NEN only kills an orphan when this holds: `ps -ww -o command= -p "$P0" | grep -qF "${f%.pid}"`. The idea is that the launch shell carries the log name in its own command line. That is only true when the shell forks the subshell `( cd … || exit 97 && <cmd>\n)` instead of exec-ing into it. zsh execs the last command of the subshell, so the pid stored in `.log.pid` belongs to the eval command itself. The code's own comment says the agent's Bash tool runs zsh ("zsh dừng cả dòng lệnh khi glob không khớp"), and this machine's shell is zsh. Measured on HEAD: I took the real launch command from the prompt (cmd `sleep 5`, longRunning 45) and ran it with `zsh -c`. `ps -o command= -p <pid in .log.pid>` printed `sleep 5`, which does not contain `r1-l1-1-….log`. So under zsh, every orphan from an earlier run in the same round fails the identity check and is never stopped. The next line, `rm -f "$D/$f"`, then deletes its pid file, so no later run ever retries the cleanup. This silently undoes the orphan-cleanup part of AC-3 that LN7 asserts, which brings back the shared-resource collision that the run-separately group exists to prevent. The tests miss it because the launch command is the measured artifact, but LN7, LN9 and `luotThat` always launch it with `spawn('bash', ['-c', khoi])`. macOS /bin/bash 3.2 does not exec-optimize this compound subshell, so LN7 and LN9 pass (both were green when I ran them) on a different shell from the one that runs the command in production. That breaks the rule that the measure must attach to the delivered artifact. Two ways to close it: drop the exec optimization (for example by appending `; :` or wrapping in `sh -c` so the stored pid always belongs to a shell that carries the log name), or store an identity marker the eval command cannot change. In both cases LN7 and LN9 need a zsh run, and the red direction must show that the orphan survives under zsh.
  rationale: AC-3 mục (iii) hứa cây của lượt trước bị dừng khi lượt sau khởi chạy; finding nói điều đó không xảy ra ở shell chạy thật (zsh), nên đúng kết cục AC-3(iii) bị hỏng.

- **Under zsh (the Bash tool's shell here), the cleanup step never recognises the previous attempt's still-running process, so it is silently left alive**
  file: `feature-loop/workflows/acceptance-verify.js:709`
  severity: high
  AC: AC-3
  source: bugs
  detail: BOC_NEN only cleans up a previous attempt's process when `ps -ww -o command= -p "$P0" | grep -qF "${f%.pid}"` finds the log name in that process's command line. The PID it checks is `$!` of `( cd "<root>" || exit 97 && <cmd>\n) > "$L" 2>&1 &`. zsh runs the last command of a subshell in place, so that PID's command line turns into the eval command itself (for example `bash -c 'out=$(node …)'` or `npm test`). That command line never contains the log name. Tested on this machine: `/bin/zsh -c '( cd /tmp || exit 97 && sleep 3\n) >/dev/null & P=$!; ps -ww -o command= -p $P'` prints `sleep 3`. `/bin/bash` 3.2 prints the parent's full `bash -c …` line instead. bash 5.1+ has the same in-place optimisation, so Linux CI is likely affected too (not tested). What happens: the identity grep fails, the `&& dung "$P0"` step is skipped, and the next line runs `rm -f "$D/$f"` regardless. The previous attempt's process tree keeps running with nothing reported, and no later attempt can find it, because its pid file is gone. This is the exact case AC 'nhãn lượt + dọn cây mồ côi' (S4-r1 t5 / S4-r3 t1) is meant to stop: a still-running heavy command overlapping the run-separately group. The prompt tells the agent to run BOC_NEN through the Bash tool, which uses the user's shell (zsh in this environment). LN7 and LN9 stay green only because the test harness runs the launch command with `spawn('bash', …)` / `execFileSync('bash', …)`, which is macOS /bin/bash 3.2 and does not run the last subshell command in place. Their green does not cover the shell the command actually runs in. To fix it, the identity check needs something that survives the in-place exec. One way: run the command through a wrapper that keeps the log name in its own command line and record that wrapper's PID. Another: match on something other than the command line, such as an environment variable that both sides read. Then run LN7/LN9 under zsh as well.
  rationale: Cùng gốc với finding trên: bước dọn cây mồ côi của AC-3(iii) không nhận ra tiến trình lượt trước dưới zsh nên cây đó vẫn sống, trái kết cục AC-3(iii).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 1 (đo văn bản thay vì đầu ra): bản vá gây ra lượt REJECT S4-r3 — ghi mốc nguyên tử và chặn mốc rỗng — không có ca hành vi nào đo**
  Người dùng thấy gì: Phần chống báo «quá hạn» giả khi dấu giờ bắt đầu bị rỗng hiện chạy đúng, nhưng chưa có bài thử nào bảo vệ nó. Nếu sau này ai đó vô tình làm hỏng phần này, bộ kiểm vẫn báo xanh và lỗi cũ có thể lặng lẽ quay lại.
  file: `tests/workflows/lenh-dai-chay-rieng.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 + phép HOẶC trong assert: SC5 tuyên «ba khoá» nhưng chiều đỏ chỉ chạm repin_retry**
  Người dùng thấy gì: Bài thử về các khoá cấu hình của làn ghim lại ghi là phủ ba khoá nhưng thực tế chỉ kiểm chứng được một. Nếu hai khoá còn lại đổi cách hiểu, bài thử vẫn xanh nên có thể cho cảm giác an tâm hơn mức thật.
  file: `tests/scripts/s4-args-lenh-dai-chay-rieng.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
