# Hạt giống — đo một đợt thật theo northstar: người xuất hiện theo từng hàng, thước tự mục, CI chạy theo từng lần đẩy

**Trạng thái 17/10:** đề xuất 1 (đo chi phí từng vòng) đã ship qua RM6 lo-trinh-gio-may; 3 (Ngoài-n tự phân loại) qua A3; 7 (vá đối chứng S4 + mod DP6) qua 2.27–2.28; còn sống: 2, 4, 5, 6, 8.
**Trạng thái 23/10:** đề xuất 5 dựng ở hồ sơ `_acceptance/ky-den-gop/` (hạng H — bước máy `pr-san-sang` của feature-loop:
đẩy nhánh, mở nháp nếu chưa có, chuyển sẵn sàng ngay lúc trình thẻ Cổng 2). Nửa «đẩy tự do ở nháp trong lúc làm» không đổi:
PR chỉ mở ở lúc trình thẻ. Còn sống: 2, 4, 6, 8.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

Gốc: đợt Điều phối – Thợ `sau-14-10` của crm (`phanlemanh/crm-onehub`), mở 07/10 20:00, đóng 11/10 06:43 (+07).
51 hàng, 8 làn thợ, một phiên giám sát. Số đo lấy từ `_acceptance/*/run-log.jsonl`, `decisions.jsonl`,
`contract.md` của 51 hồ sơ, sổ đợt `.acceptance-runs/dieu-phoi-sau-14-10/` và API GitHub Actions; cách đo lại ở
cuối. Chủ kho giao phần kit cho máy khác chạy, crm tự làm phần của crm (mục «Phần crm làm»).

Northstar dùng để chấm: **mang sản phẩm tới nhanh hơn mà vẫn tin cậy, người xuất hiện ít lần hơn, tốn ít hơn —
cả tiền token, phút CI lẫn thời gian.** Hạt giống là SỔ, không phải ô.

## Số đo

| Trục | Chỉ số | Số đo |
|---|---|---|
| Tốc độ | Quyết định đầu tiên trong `decisions.jsonl` → PR gộp | trung vị **10,1 giờ**, p90 24,8 giờ (50 hàng) |
| Tin cậy | S4 PASS ngay vòng 1 | **23/50 (46%)**; 104 vòng S4 (`round-tally`), trung vị 2 vòng |
| Tin cậy | Hàng ≥ 3 vòng S4 | 13: K2, V2, E4, E6, F9 (6), F10 (4), F12 (4), K6c, H1 (4), DT1, K2e, K3b, F26 |
| Tin cậy | Hồ sơ đã ký đỏ khi kiểm chéo sau gộp | 12/22 hồ sơ đầu; F10 đo 46 eval chết ở 14 hồ sơ |
| Người | Chữ ký cổng trong 4 ngày | 48 Cổng Đáng (`opportunity.md` có decision), 50 Cổng 1 (`approved_at`), 61 commit `Gate 2 signoff` trên onehub từ 07/10 — **khoảng 160** |
| Người | Mục ngoài hợp đồng phải phân xử | **320 nhãn `Ngoài-n`** trong 51 hợp đồng |
| Người | Mục tồn đọng loại «hành vi» (người dùng thấy) | 8/53 dòng `ton_dong` (**15%**); phần còn lại là thước, công cụ, chập chờn |
| Người | Can thiệp khác của chủ kho ghi trong nhật ký đợt | 34 dòng; hai lần phiên S4 đứng chờ hộp xin quyền mà vẫn giữ khoá (K3b ≈ 2 giờ 30, E6 ≈ 8 giờ) |
| Phạm vi | Số hàng của đợt | 24 → 69 (mỗi lần ký Cổng 2 sinh 1–2 hàng con), chặn bằng luật 53 của crm |
| Tiền | Phút Actions mỗi lần đẩy PR (crm) | ≈ 35′ → **≈ 45′** sau ma trận ba ô; 156 lượt `ci.yml` cho 94 nhánh PR (1,7 lượt/nhánh) trong 02–08/10 |
| Tiền | PR chỉ chạm tệp T1 mà vẫn chạy đủ CI | 27/134 PR gộp 02–11/10 (**20%**) |
| Thời gian | Gộp lại base vì PR từ máy khác làm onehub dời | #358 gộp lại 4 lần trong một ngày |
| Thời gian | Ghim lại | 59 lượt, 354 phút máy |
| Token | Token mỗi vòng S4, mỗi hàng | **Không đo được: 0 `run-log.jsonl` ghi token** |

## Chẩn đoán: ba nút thắt cùng một gốc

Hệ thống làm việc **theo từng đơn vị**, không **theo ngoại lệ**:

1. **Người xuất hiện theo từng hàng.** Mỗi hàng ≈ 3 chữ ký và một lượt phân xử Ngoài-n, kể cả hàng sạch. Thời gian
   chờ người chiếm phần lớn 10 giờ trung vị.
2. **Thước tự mục.** 54% hàng không qua vòng 1. Nguyên nhân đã thấy trong đợt: eval chết (paths trỏ tệp đã xoá),
   REJECT giả do tác tử tự suy mã thoát, segfault hạ tầng, ca chập chờn. Kit không ghi lý do REJECT theo lớp nên
   chưa tách được bao nhiêu phần do mã, bao nhiêu do thước — mỗi vòng thừa là token, giờ và một lần người nhìn.
3. **CI của kho tiêu thụ chạy theo từng lần đẩy.** Luật gộp chỉ dùng lượt CI cuối (sau lần gộp base mới nhất);
   khoảng 1/3 lượt là lượt giữa chừng bị thay. Mỗi commit ghim lại, mỗi commit vẽ bản đồ, mỗi lần gộp base vào
   nhánh là một lượt đủ.

## Ranh giới kit / kho tiêu thụ

Luật phân định: **OneFlow (kho thứ hai) cũng sẽ gặp → kit; chỉ crm có vì sản phẩm hay cấu hình của crm → kho.**
Kho không vá engine kit tại chỗ; kit không đổi engine dưới chân kho trong hạn cứng.

| Kit sở hữu — quy trình và engine | Kho tiêu thụ sở hữu — sản phẩm và CI của nó |
|---|---|
| Cổng, hợp đồng, eval, S4, giám khảo, ghim lại, pre-merge, bản đồ | `ci.yml`, ma trận test, build, job riêng của sản phẩm |
| Khuôn phân tầng T1/T2/T3 (`t1_skip_globs` là khuôn kit, danh sách do kho khai) | Hook `pre-push`, luật kho, `.claude/settings.json` |
| Khi nào commit, khi nào đẩy, khi nào PR chuyển «sẵn sàng» | Việc gì chạy khi PR «sẵn sàng» |
| Gói `dieu-phoi`: khoá S4, hàng gộp, đợt, mod canh hộp xin quyền | Thước trong hồ sơ của chính kho (eval chết, hồ sơ đỏ sẵn) |
| Đo lường trong `run-log`: token, thời gian, lớp lý do REJECT | Độ sạch bộ test (chập chờn, bom giờ) |
| Mặc định quy trình: Ngoài-n → Known limits, ≤ 1 hàng con mỗi Cổng 2 | Tệp ý định lộ trình, production |

Lệch hiện nay: crm đang tự gánh phần của kit — luật 53 (Known limits mặc định, đóng cửa nhận việc), trần một
hàng con, `scripts/dieu-phoi/` — đều sống trong `LUAT.md` và script của crm. OneFlow sẽ phải dựng lại.

## Đề xuất cho kit

Xếp theo thứ tự nên làm. Câu giao là bản nháp để Cổng Đáng của kit sửa.

1. **Đo chi phí từng vòng trước khi cắt.** «Mỗi vòng S4 và mỗi lượt ghim lại ghi token, thời gian tường và lớp lý
   do REJECT (mã · thước · hạ tầng · chập chờn); thẻ Cổng Bằng chứng in chi phí của hàng, thẻ đóng đợt in chi phí
   của đợt.» Không có số này thì mọi đề xuất cắt token phía dưới là đoán. Hàng mới; đi cùng X2 (trang hồ sơ một
   việc) nếu hợp.
2. **Ký Cổng Bằng chứng theo lô, theo ngoại lệ.** «Hàng có S4 PASS, giám khảo đồng thuận, không Ngoài-n loại hành
   vi và không phải T3 vào một bảng tổng mỗi ngày, người ký một lần cho cả bảng; hàng ngoại lệ mới có thẻ riêng.»
   Người vẫn ký — chỉ ít lần hơn (≈ 60 → vài lần mỗi ngày ở crm). Gần DP7.
3. **Ngoài-n tự phân loại, Known limits mặc định.** «Mỗi Ngoài-n mang một lớp (hành vi · đo · công cụ); lớp không
   phải hành vi tự thành Known limits kèm một dòng tồn đọng; người chỉ thấy lớp hành vi; mỗi lần ký Cổng 2 mở tối
   đa một hàng con.» Chuyển luật 53 của crm thành mặc định của kit. 320 mục → khoảng 15% cần người. Gần N7, L3.
4. **Cổng Đáng ký một lần cho gói đợt.** «Chủ kho ký Cổng Đáng ở cấp gói đợt (các hàng lộ trình đưa vào đợt); hàng
   kế thừa chữ ký đó, chỉ hàng thêm giữa đợt mới cần Cổng Đáng riêng.» 48 chữ ký → 1. Gần DP2.
5. **PR để nháp tới lúc trình Cổng Bằng chứng.** «feature-loop mở PR ở dạng nháp, đẩy tự do trong lúc làm, ghim lại
   và vẽ bản đồ xong mới chuyển sẵn sàng đúng lúc trình thẻ Cổng 2.» Đây là nửa của một hợp đồng hai bên: crm đã
   nhận làm nửa kia (job nặng của `ci.yml` chỉ chạy khi PR không còn nháp). Gần DP7.
6. **Hàng gộp chung cho nhiều máy.** «PR của mọi máy và mọi phiên vào một hàng gộp; base dời thì hàng tự gộp lại
   và chỉ chạy lại đúng một lượt; không hai PR gộp chồng.» Chặn chuỗi kiểu #358. Gần DP2–DP4, DP7.
7. **Phát hành vá làn đối chứng S4 và canh hộp xin quyền.** `baseline-tran-bo-qua-don` (đang ở «Chưa phát hành»)
   vào mốc 18/10; mod của DP6 phát hiện phiên đứng chờ quyền và nhả hoặc báo khoá S4.
8. **Phân tầng PR cho CI kho tiêu thụ.** «Kit in tầng T1/T2/T3 của một diff thành output GitHub, đọc đúng
   `t1_skip_globs` và luật T1-escape, để workflow của kho bỏ job nặng cho PR T1 mà không tự viết danh sách thứ
   hai.» crm tự đọc `t1_skip_globs` tới khi kit có lệnh này. Án `.out-of-scope/t1-skip-globs-github-and-manifests.md`
   giữ nguyên: PR sửa workflow không là T1.

## Phần crm làm (máy Mac mini, không chờ kit)

- `ci.yml`: job nặng (test ba ô, build, tác nhân OKR) bỏ qua PR nháp và PR chỉ chạm tệp T1; `ci-ok` chấp nhận
  «bỏ qua» ở hai trường hợp đó để check bắt buộc không treo. Một vòng feature-loop T2 của crm.
- Hook `pre-push` đang chạy `TURBO_FORCE=true`: xem lại khi GitHub là trọng tài thì máy có dùng cache được không
  (phụ thuộc `verify-gate-shape`).
- Làn nợ thước có hạn mức (F24 + kiểm chéo đêm) cho các hồ sơ đỏ sẵn của crm, sau 14/10.

## Ràng buộc thời gian

Kit không đổi engine dưới chân crm trước 14/10. crm cài đúng tag `v2.26.0` ngày 11/10 (không phải `main`: cache
khoá theo version nên `update` kéo `main` vào thư mục `2.26.0`; đã dựng lại từ `git archive v2.26.0`). Mốc kit
18/10 và 25/10; crm thử gói `dieu-phoi` ngày 26/10. Đề xuất 2–6 có ý nghĩa nhất nếu vào mốc 25/10, vì đợt thử
26/10 là lần đo lại tự nhiên.

## Cách đo lại

Trên một bản clone crm ở `onehub`, từ gốc kho:

```bash
gh pr list --repo phanlemanh/crm-onehub --state merged --base onehub --search "merged:2026-10-07..2026-10-11" --limit 200 --json number,headRefName,mergedAt > /tmp/prs.json
```

- Vòng S4, REJECT, ghim lại: đọc dòng `kind: round-tally` và `kind: repin` trong `_acceptance/<slug>/run-log.jsonl`
  của các slug trong `hang-viec.json` của đợt.
- Thời gian tới gộp: `at` nhỏ nhất trong `decisions.jsonl` so với `mergedAt` của PR có `headRefName` kết thúc
  bằng slug.
- Phút Acceptance: `bun _acceptance/giam-phut-acceptance/rang/do-phut.mjs --tu <ngày> --ngay 7`.
- Phút `ci.yml`: cùng cách tính (mỗi job làm tròn lên phút, bỏ job `skipped`) trên
  `repos/phanlemanh/crm-onehub/actions/workflows/ci.yml/runs?created=<từ>..<đến>`.
- PR T1: mọi tệp của PR khớp một mẫu `case` trong `risk_tiers.t1_skip_globs` của `_acceptance/config.yaml`.
