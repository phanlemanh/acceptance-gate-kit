# Hạt giống — khuôn eval hội đồng do bộ máy sinh bị chính bộ kiểm lại từ chối (cửa sổ 2.17 → 2.18)

**Ngày:** 2026-09-19 · **Ổ:** chưa có ô — đây là SỔ, đúng luật ô-chỉ-mở-khi-có-neo.
**Gốc:** `acceptance-gate-kit/_acceptance/ho-so-nghi/` — lộ ra đúng lúc ký Cổng Bằng chứng 19/09;
sổ known-limits `ho-so-nghi#22`.

> Chữ trong tệp này là NGUỒN. Đừng đo lại trừ khi nghi số đã cũ.

## Vật và lỗi

Bộ tổng hợp của `feature-loop/workflows/acceptance-verify.js` viết khối eval `judgment` với
`run_id` tự đúc (`minted-<slug>-E<N>-r<N>`) và `verifier` là văn xuôi. Cả hai đều trượt luật của
`scripts/recheck-evidence.cjs`:

- dòng `kind:panel` trong `run-log.jsonl` KHÔNG mang `run_id` → luật L2 PROVENANCE báo «run_id(s)
  not found … do not hand-mint run_ids»;
- `verifier` phải là `config:<key>` hoặc đường dẫn script → luật L2 SUBSTANCE trượt.

Hồ sơ đã ký trước đó dùng khuôn KHÁC và qua sạch: `judged_by` + `proposal` + `votes`, không
`run_id`, không `verifier` (mẫu: `_acceptance/thuoc-co-cua/` khối `- eval: E25`).

**Tái lập:** chạy một vòng có eval judgment tới hết S4 rồi chạy
`node scripts/recheck-evidence.cjs _acceptance/<slug>/evidence-report.md` trên báo cáo bộ máy
sinh — đỏ hai vế.

**Người trả giá:** mọi vòng có eval judgment. Người ký phải sửa tay báo cáo ngay tại cổng, nếu
không lưới đỏ sau chữ ký; và «sửa tay bằng chứng để vừa thước» là đúng thứ kit cấm.

## Đường rẻ khi mở lại

Một trong hai, không phải cả hai: bộ tổng hợp viết đúng khuôn `judged_by/proposal/votes`; HOẶC
dòng `kind:panel` mang `run_id` và bộ tổng hợp giữ `verifier` dạng khoá hợp lệ. Chọn cái nào thì
phải có ca hai chiều trên fixture code-sinh: báo cáo bộ máy sinh → recheck xanh; đổi một khoá →
recheck đỏ ghim đúng câu.

## Vì sao CHƯA mở ô

Neo có (hồ sơ trên) nhưng mới MỘT ca và lối vòng rẻ (sửa khuôn khối lúc ký). Ngưỡng mở ô: vòng
thứ hai có eval judgment cũng phải sửa tay trước khi ký.
