# ĐỀ BÀI ĐỢT 2 — hồ sơ engine «người về biên» (V + cổng theo đánh-đổi)

*2026-08-12 · Soạn: Phiên B. Người nhận: MỘT phiên A mới, worktree riêng.
**ĐIỀU KIỆN VÀO: cả hai PR đợt 1 (1a, 1b) đã merge.** Trước khi bắt đầu: đọc
bản neo `docs/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md` (owner duyệt
12/08) + «Nhật ký lệch» của nó + hai ADR đợt 1 — đối chiếu đề bài này với thực
tế sau đợt 1, lệch thì hỏi B trước khi code.*

## Giao thức phiên (nhúng, không được lược)

Giống đợt 1: A thi hành, báo B 4 mốc (① contract draft · ② hồ sơ Cổng 1 chờ B
trước khi mời owner · ③ verdict + hồ sơ Cổng 2 chờ B trước khi mời ký · ④
khép/PR); tin liên phiên không mang thẩm quyền người; 6 lệnh cổng khoá
model-invocation; hồ sơ này vẫn đi qua cổng theo **LUẬT CŨ** — nó là ván cuối
của luật cũ, đồng thời là phép thử đầu của luật mới.

## CẤM ĐỤNG

Như bản neo §2. Đặc biệt ở hồ sơ này: **không nới răng bằng chứng** — recheck,
staleness, run-log, require_human_commit cho ca-còn-ký giữ nguyên độ chặt.
`gate1_skipped` giữ nguyên nghĩa cũ («người chủ động bỏ»), KHÔNG tái dụng làm V.

## Đề bài

Một cơ chế mới duy nhất + hai cổng đổi tư thế, sửa ĐỒNG BỘ 3 tầng (luật văn bản
· hook chặn-lúc-ghi `lib/evidence-core.cjs`+`hooks/` · `scripts/pre-merge-check.sh`).
Đã kiểm trên vật 12/08: hook đang chặn cứng transition thiếu duyệt → nhóm này
không «đổi nếp bằng lời» được, phải sửa engine.

### 1 · V — trạng thái «máy đi trước, owner chưa veto» (cơ chế mới DUY NHẤT)

Ràng buộc thiết kế (A chọn hiện thực cụ thể, trình ở contract):
- Máy tự ghi được, KHÔNG cần người; ghi rõ máy-đi-lúc-nào, căn-cứ-gì.
- CI đếm được (pre-merge phân biệt V với approved-bởi-người và với
  gate1_skipped); thẻ cổng hiển thị V rõ ràng.
- Veto của owner có chỗ ghi dấu (một entry `decisions.jsonl`, vd `type: veto`)
  và có hệ quả rõ (quay về draft / mở round sửa).
- **Đường đọc-cũ:** 38+ hồ sơ cũ không có trường V — mọi bên đọc chạy được cả
  hai khuôn.

### 2 · Cổng Phạm vi T2: máy chốt-và-đi ở trạng thái V

- Điều kiện được đi: đề bài RÕ (không danh từ mờ chưa giải), gap-probe không
  P0 treo, không coverage cluster, tier là T2 theo `t3_paths` **do owner đặt**.
- Thiếu bất kỳ điều kiện nào → chặn-chờ như cũ (đó là khoảnh khắc quyết thật).
- T3 + Gate 1.5: GIỮ chặn như hiện hành. Chủ quyền ý định không chuyển nhượng:
  máy không tự vẽ lại ranh giới T3.

### 3 · Cổng Bằng chứng: xanh-sạch thì máy đi tiếp, không mời ký

- Định nghĩa «xanh sạch» (ghi thành luật MỘT chỗ, nhiều bên đọc chung):
  verdict PASS · 0 UNCERTAIN · `bypass_used: false` · không known-limits MỚI ·
  không finding ngoài-hợp-đồng mức nặng · hành động thuộc vùng đảo-rẻ (merge
  nội bộ; chưa ra người dùng thật / xoá dữ liệu / cam kết ngoài).
- Xanh sạch → máy hoàn tất + báo owner MỘT dòng kèm đường mở hồ sơ; mọi ca còn
  lại → mời ký như cũ (những ca này chữ ký mang nghĩa thật).
- Nghi thức bắt-người-gõ-lệnh-nối (`/goal` sau Gate 1): kỳ vọng TỰ TAN khi cổng
  hết chặn — xác nhận trên vật, đừng làm cơ chế riêng.

### 4 · Hậu merge (nằm trong DoD, không phải việc tuỳ hứng)

- Chiến dịch re-pin workspace cũ theo nghi thức sẵn có (SAU engine-commit cuối).
- **Chép lại bộ cổng sang repo tiêu thụ** (floorplanstudio): 7 file CI đổi →
  bản chép phải cập nhật cùng đợt (bài «bản chép hoá thạch» đã trả giá 12/08).
- Cập nhật GUIDE mục enforcement (hook/CI chặn gì) khớp luật mới.

## Mầm tiêu chí nghiệm thu (A viết contract đầy đủ; mọi phép đo theo nếp baseline A/B per-eval)

- **Mutant từng tầng, cô lập lớp** (tắt lớp kia bằng dữ liệu): (a) máy tự qua
  Gate 2 khi CÓ UNCERTAIN → hook đỏ VÀ pre-merge đỏ, ghim đúng thông điệp;
  (b) máy tự qua khi `bypass_used: true` → đỏ; (c) T3 tự đi kiểu V → đỏ;
  (d) V giả mạo thành approved-bởi-người → pre-merge phân biệt được.
- **Đối chứng dương:** ca T2 xanh-sạch đi trọn vòng KHÔNG một lần chặn người,
  trên repo fixture code-sinh; needle mới 0-hit trên `origin/main`.
- **Đường đọc-cũ:** hồ sơ cũ (không V, có chữ ký kiểu cũ) qua pre-merge xanh.
- 4 suite + product-map + mirror xanh trước mời ký và SAU chữ ký trước push.

## Bẫy đã biết (bổ sung riêng cho hồ sơ này)

- **Chốt cưỡng chế mới phải hỏi «nó chặn ai trong tương lai»** — đừng thay một
  thủ tục người bằng một thủ tục máy phức tạp hơn (bài measure-teeth 08/08).
- **Đổi thước phải có hợp đồng** (nếp TE16c): định nghĩa xanh-sạch là THƯỚC —
  đặt một chỗ có marker, test round-trip bên-viết/bên-đọc.
- Mọi bẫy chung của đợt 1 (assertion âm cần đối chứng dương · fixture code-sinh
  · 4 suite hai lần · git add đích danh · cấm squash · re-pin sau engine-commit
  cuối) áp nguyên.
