# Hạt giống — bản kế hoạch chép tiêu đề khuôn bảng tóm tắt, mỗi lần đốt trọn một lượt chấm

**Ngày:** 2026-10-17 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** TRỪ (bớt lượt chấm đốt vì luật kho, không vì vật).
Gốc: `_acceptance/ap-chinh-sach-lo-trinh/` — RM2 lượt chấm 1 (15/10) REJECT vì E7b (P93); `decisions.jsonl` dòng 33 ghi sửa «bảng tóm tắt kế hoạch đổi tên cột».
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Số đo

Ba lần trong một gói, mỗi lần đốt trọn một lượt chấm (~38 phút máy):

| Vòng | Hồ sơ | Ngày | Lượt |
|---|---|---|---|
| RM2 | `_acceptance/ap-chinh-sach-lo-trinh/` | 15/10 | 1 |
| RM6c | `_acceptance/lo-trinh-du-lieu-ngay-du-kien/` (evidence-report: «Round 1: REJECT vì P93») | 16/10 | 1 |
| VA1 | `cham-lai-khong-tu-doi` (hồ sơ chưa lên `main`, PR #370) | 16/10 | 1 |

Lần hai và ba xảy ra SAU khi ghi nhớ phiên đã dặn «không chép tên cột khuôn» — dặn-bằng-lời đang thua.

## Gốc

- Bước lên kế hoạch dặn mọi lần trình kế hoạch dùng khuôn `PLAN-SUMMARY-TABLE-TEMPLATE`
  (`feature-loop/skills/feature-loop/SKILL.md`). Bản kế hoạch ghi vào `docs/` chép nguyên dòng tiêu đề khuôn.
- Ca P93 (`tests/plugins/run-tests.sh`, «P93 mot-nguon») đòi tên cột của khuôn chỉ có ở ĐÚNG MỘT tệp nguồn toàn
  kho. Tệp kế hoạch thành tệp thứ hai → đỏ.
- Hai luật đúng riêng rẽ, va nhau ở vật thứ ba mà không ai sinh bằng máy. Lỗi chỉ lộ ở S4, muộn nhất có thể.

## Đề xuất (chưa làm — meta đóng băng, mở ở mốc «Tinh chỉnh sau hai đợt thử» 05/11 khi owner gọi tên)

Dạng nghiệm đúng tầng: biến bất biến thành vật máy giữ, không thêm lời dặn.

1. **Dời phép đo lên S2 (TRỪ):** chạy đúng phép đếm của P93 trên cây làm việc ngay khi ghi bản kế hoạch, trước khi
   xin lượt chấm. Phép đo cũ giữ nguyên, chỉ chạy sớm hơn.
2. **Hoặc máy sinh bảng:** bảng tóm tắt kế hoạch do một lệnh rút từ khuôn sinh ra để trình, không ghi vào tệp
   theo dõi.
3. Chiều đỏ: tệp kế hoạch có dòng tiêu đề khuôn → bước S2 đỏ với đúng thông điệp của P93; đối chứng dương: kế
   hoạch đổi tên cột → im.

**Người hưởng:** máy (bớt ~38 phút máy và một lượt trong trần ba lượt mỗi lần dẫm) và owner (lượt chấm còn lại dành
cho vật).

**Kho không gặp sự cố này được gì, mất gì:** P93 là ca của kho kit; kho tiêu thụ không đổi gì.

## Ngưỡng mở thành ô

Owner gọi tên ở mốc 05/11, hoặc lần dẫm thứ tư.
