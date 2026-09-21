# Kế hoạch điều phối — đưa cách mới vào kit và vào `crm` — 21/09/2026

**Phiên điều phối:** phiên viết tài liệu định vị (kit, `main`). Nó **không chạy vòng
nào** — chỉ giữ bức tranh, soạn hợp đồng cho vòng kit, đối chiếu số, và nói một dòng
cho từng phiên khác biết việc của mình.
**Nền:** `docs/findings/2026-09-21-dinh-vi-lai-kit-vat-tao-ra-ban-giao.md` (đã duyệt
§1–§3) · ADR 0020 (Đ8, Đ9 đã phê) · khối ĐỊNH VỊ trong `CLAUDE.md` · PR #192.
**Luật ràng buộc kế hoạch này:** chiều rộng (b) — giữa hai mốc *một kho nhận* tối đa
**một** vòng meta, owner gọi tên; §7.2 — **không có vòng «định vị lại»**; ADR 0002 —
thao tác cổng người khoá model-invocation; re-pin theo release, không theo merge.

> Chữ ở đây là NGUỒN của kế hoạch. Trạng thái đo lúc 04:30 UTC 21/09; lệnh đo ở cuối.

---

## 0. Một trang

Ba hồ sơ ở `crm` đang chờ **đúng ba thứ kit chưa có**:

| Hồ sơ crm | Chờ gì | Đề xuất tương ứng |
|---|---|---|
| `nhan-ung-dung-noi-tieng-viet` — vật ở prod từ `ff3fb8bf`, hồ sơ `approved/BLOCKED/chữ ký rỗng`, chặn PR #65 | trạng thái *reality đã chấm* | **Đ8** |
| `ho-so-khai-dung-tieng` — lối C đã commit, mục 2–3 là tháp đo tháp | như trên + luật «không mở việc thước» | **Đ8**, **Đ11** |
| `dieu-phoi-30-ngay-dau` — trần thước nổ (lối 1 đã ghi), thẻ BLOCKED khoá người lái, hai lượt chấm huỷ vì «Dừng nó» lọt vào ngữ cảnh | `DO_GLOBS` thôi phạt TDD · thẻ phân biệt đỏ-bàn-đo · nhãn *hệ thống chết* | **Đ1**, **Đ2**, **Đ3** |

→ Đây là lần đầu một mốc kit có **kho chờ nhận theo cấu trúc** — vế 4 của luật (b) mà
CLAUDE.md khai «chưa có răng» được thoả bằng chính hình dạng kế hoạch. Vì thế:

- **Một vòng meta duy nhất** ở kit, owner gọi tên, `Gốc:` trỏ vào hồ sơ `crm` —
  gom Đ1 · Đ2 · Đ3 · Đ8 · lát mỏng Đ7 · Đ9 (dòng M3 đầu tiên ở hồ sơ mốc).
- Mốc **2.18.0** cắt khi vòng ký, **cài vào `crm` trước và chỉ `crm`** trong cửa sổ
  này; kho khác đi chiến dịch re-pin sau.
- `crm` **không chờ kit** ở chỗ không cần: `dieu-phoi` chấm lại ngay bằng phiên mới;
  hai hồ sơ tháp **đóng băng** tới khi 2.18.0 cài, không dựng bàn đo, không mở mục 2–3.

Bốn quyết định của owner, theo thứ tự: merge #192 → gọi tên vòng kit → ký hai cổng
của vòng ấy → cắt 2.18.0. Mọi thứ khác máy tự đi.

## 1. Trạng thái bốn mặt trận (đo 21/09 04:30 UTC)

| Mặt trận | Ở đâu | Chặn gì |
|---|---|---|
| **Kit** `main` 2.17.0 | PR #192 (docs + ADR 0020 + CLAUDE.md), 4 commit, CI 1 xanh 1 chờ, hết nháp | chưa merge; **0 dòng engine** đổi |
| **crm / dieu-phoi** (`feat/dieu-phoi-30-ngay-dau` @ `027d1e13`) | vật xong, 3 lỗi hợp đồng đã sửa, trần thước lối (1) ghi `d-…-15`, cổng 3000/3300/3301 rảnh, HANDOFF mới | S4 lượt B, C huỷ: 12/19 và 11/20 tác nhân `cannotRun` vì đọc «Dừng nó» thành lệnh huỷ — **nhiễm ngữ cảnh phiên**, đợi không hết |
| **crm / ho-so-khai-dung-tieng** (worktree `busy-chatterjee` @ `2c72da97`) | lối C xong 2 commit, cây sạch, `thuoc-` không đổi | mục 2 (E9 đột biến) và 3 (agent ghi vào cây) đang mời «dựng bàn đo ~20–30 phút» — **đó là tháp**; PR #65 `CONFLICTING` |
| **crm / nhan-ung-dung** (trên `onehub`) | ở prod; owner quyết đóng 18/09 | không chỗ ghi hợp lệ → tàng hình → chặn #65 |

`crm` đang cài kit **2.17.0** (cache có 2.15/2.16/2.17) — cài 2.18.0 là một bước
`plugin update` + kiểm `diff -rq` (bẫy đã ghi ở memory rollout).

## 2. Ai làm gì — vai và phiên

| Vai | Phiên | Việc | KHÔNG làm |
|---|---|---|---|
| **Owner** | — | 4 quyết định §0; đọc thẻ | không tự dựng bàn đo, không gõ run_id |
| **Điều phối** | phiên này (kit `main`) | theo dõi #192; soạn `opportunity.md` + `contract.md` nháp cho vòng kit; sau mỗi mốc đối chiếu 5 dòng số + M1/M3; giữ bảng này | không chạy vòng, không sửa engine |
| **Kit-vòng** | phiên MỚI ở kit, `/feature-loop:feature-loop <slug>` | vòng meta duy nhất (§3) | không mở vòng thứ hai; không chạm Đ4–Đ6, Đ10 |
| **crm-A** | phiên MỚI ở `crm` (ngữ cảnh sạch) | `dieu-phoi`: đọc HANDOFF, sinh args `--round 1`, chạy S4, tới Cổng Bằng chứng | không nhắc «Dừng nó»; không sửa thước trong S4 |
| **crm-B** | phiên `ho-so-…` hiện có | **đóng băng**: một dòng sổ «chờ 2.18.0 để đóng theo quan sát (ADR 0020)»; mục 2–3 → hạt giống ở crm | không dựng bàn đo, không mở mục 2–3 |
| **crm-rollout** | phiên MỚI ở `crm`, sau 2.18.0 | cài 2.18.0; đóng `nhan-ung-dung` + `ho-so-` bằng thao tác thứ bảy; rebase #65; ghim lại theo release | không chép đè vá local |

## 3. Vòng kit duy nhất — nháp hợp đồng (owner gọi tên thì phiên Kit-vòng mở)

**Slug đề nghị:** `nhan-trang-thai-va-reality` · hạng **T3** (đổi enum + thao tác cổng
người = khó-đảo) · `Gốc:` `crm/_acceptance/nhan-ung-dung-noi-tieng-viet` +
`crm/_acceptance/dieu-phoi-30-ngay-dau` (con trỏ kho tiêu thụ — đúng luật neo).

**Ý định (đỉnh cố định của vòng):** *ba hồ sơ ở `crm` đóng được hoặc chấm được mà
không dựng thêm một dòng thước nào; người lái không bị khoá ngoài thẻ khi bàn đo
hỏng.* Người hưởng: owner (ký), phiên crm-A/rollout, người đọc sau.

| AC | Nội dung | Đ | Chiều đỏ |
|---|---|---|---|
| AC-1 | `phan-loai.mjs` `DO_GLOBS` thôi xếp test của kho là thước; trần nhát + ba lối gỡ khỏi `s4-args`; **thước của hồ sơ đang chấm chỉ-đọc trong S4** (băm `evals.yaml` + `rang/` + tệp test trước/sau lượt chấm; lệch → lỗi làn, dừng) | Đ1, Đ3 | tác nhân giả sửa `evals.yaml` giữa S4 → làn đỏ có tên; sửa `apps/**/*.spec.ts` ở S3 → không đếm |
| AC-2 | Thẻ Cổng 2: eval đỏ vì bàn đo (mã 97/127, tool-kill, `cannotRun`) hoặc hệ thống chết ≠ đỏ vì vật; ô ký **mở** kèm cạnh gãy có tên + ba lối + giá; ghi bằng `revisit`; con số không đổi; BLOCKED chỉ còn cho hệ thống chết chưa thử lại | Đ2 | fixture eval exit 127 → thẻ có ô ký + dòng «không đọc được ở đây»; eval exit 1 do vật → thẻ khoá như cũ |
| AC-3 | Trạng thái thứ bảy `da-cham-boi-thuc-te` trong enum; **thao tác cổng người thứ bảy** khoá model-invocation (P32 mở rộng); người ghi sha prod + ngày + tên; hồ sơ rời nhóm đang dở ở thẻ mở phiên + bản đồ sản phẩm; đường đọc-cũ | Đ8 | model-invoke thao tác → bị khoá; hồ sơ cũ không trạng thái → render y nguyên |
| AC-4 | Thẻ Cổng 2 in dòng **ý định** (trích nguyên văn `feature:` + mục «Vấn đề & ai gặp» từ `opportunity.md` khi có) — lát mỏng, chưa trọng số | Đ7 (mỏng) | hồ sơ không `opportunity.md` → thẻ không in, không cờ |
| AC-5 | Hồ sơ mốc 2.18.0 mang dòng `ĐẠT đã ký → prod đỏ: k / N` với N đếm từ dòng quan sát prod (crm: N = 3 sau khi đóng) | Đ9 | N = 0 → dòng in «vô hiệu», không in «0 sự cố» |

Ngoài phạm vi (ghi hạt giống, **không** mở ô): Đ4 (ui-check thành lệnh, W8), Đ5, Đ6,
Đ10 (dời tháp `rang/` của crm), Đ7 đầy đủ (trọng số + chính sách), Đ11 răng.

**Ngân sách:** ≤ 4 lượt gọi người (T3) · S4 ≤ 3 lượt chấm · **dừng-vá** nếu lượt 2
còn phát hiện cùng lớp · nếu bộ tìm lỗi soi thước/hồ sơ nhiều hơn vật → đó là K8
nổ, dừng, không «làm cho xanh».

## 4. Trình tự và điểm chờ

```
T0  owner merge #192 ─────────────────────────────────────────────┐
T0  crm-A (phiên mới): dieu-phoi S4 lượt 1 ── không chờ kit ──► Cổng Bằng chứng
T0  crm-B: đóng băng ho-so-, 1 dòng sổ, mục 2–3 → hạt giống
T1  owner gọi tên vòng ─► Kit-vòng: Cổng Đáng ─► Cổng Phạm vi ─► S3 ─► S4 ─► Cổng BC
T2  cắt 2.18.0 (làn V) ─► crm-rollout: cài, diff -rq, đóng 2 hồ sơ bằng thao tác 7
T2  crm-rollout: rebase #65 ─► merge; dieu-phoi ký trên thẻ mới nếu còn cạnh gãy
T3  điều phối: hồ sơ mốc 5 dòng + M1 + M3 (N=3) ─► so dự báo §7.1 của bản định vị
```

Điểm chờ người: T0 (merge), T1 (gọi tên + 2–3 chữ ký của vòng), T2 (cắt mốc, làn
V một dòng), và các chữ ký Cổng Bằng chứng ở crm. **Không có điểm chờ nào khác** —
ranh giới không phải cổng thì máy tự đi.

## 5. Lưới — để kế hoạch không tự phản bội

1. **Thêm vòng kit thứ hai trong cửa sổ = vi phạm (b).** Phát hiện mới trong lúc làm
   → hạt giống, chờ mốc 2.18.0 được crm cài rồi mới tính cửa sổ kế.
2. **`dieu-phoi` thấy trần hoặc thẻ khoá lần nữa trước 2.18.0** → chọn lối (1) / ghi
   sổ như hôm nay; **không** vá kit trong lúc chạy. Số lần đó là bằng chứng cho AC-1/AC-2.
3. **crm-B bị cám dỗ «dựng bàn đo 20–30 phút»** → không: vật ở prod, mục 2–3 là tháp;
   Đ8 sẽ đóng nó. Nếu owner vẫn muốn đo E9 → đó là một ô mới với `Gốc:` là một ca
   prod thật, không phải hồ sơ này.
4. **Rollout 2.18.0 rộng ra 9 kho ngay** → không: một kho trong cửa sổ này; rộng ra
   ở chiến dịch re-pin theo release.
5. **Chạm/lượt tăng ở thẻ Cổng 2 mới** (AC-2, AC-4) → đo ở hai vòng crm đầu; tăng →
   AC phụ không hỏi (làn V), chỉ AC lõi.
6. **Kit-vòng mở rộng sang Đ4–Đ6** vì «tiện tay» → ngoài phạm vi, trả lại ở Cổng Phạm vi.

## 6. Việc ngay hôm nay, một dòng mỗi phiên

- **Owner:** merge #192 khi CI xanh; nếu đồng ý §3, nói «gọi tên `nhan-trang-thai-va-reality`».
- **crm-A (mở mới):** «Đọc `_acceptance/dieu-phoi-30-ngay-dau/HANDOFF.md`, sinh args
  `--round 1`, chạy S4 vòng 1, tới Cổng Bằng chứng. Không sửa thước trong S4.»
- **crm-B (phiên hiện có):** «Không dựng bàn đo. Ghi một dòng sổ `revisit`: chờ
  2.18.0 (ADR 0020) để đóng theo quan sát; mục 2–3 thành hạt giống `docs/plans/`. Xong thì
  dừng.»
- **Điều phối (phiên này):** soạn `opportunity.md` + `contract.md` nháp của §3 khi
  owner gọi tên; theo dõi #192; không làm gì khác.

## 7. Số để kiểm kế hoạch (đọc ở T3)

| Số | Trước (21/09) | Kỳ vọng sau 2.18.0 ở crm |
|---|---|---|
| hồ sơ crm tàng hình (`approved` + evidence đỏ + chữ ký rỗng) | 3 | 0 |
| PR #65 | CONFLICTING, chặn bởi hồ sơ tàng hình | merge |
| lượt chấm `dieu-phoi` bị hạ tầng/hệ thống đốt | 3 (A, B, C) | 0 sau phiên mới |
| lượt gọi người ngoài thiết kế ở `dieu-phoi` | ≥ 2 (trần, ba lối) | 0 |
| M3 ở hồ sơ mốc | không có | `k / 3` |
| vòng meta trong cửa sổ | — | **1** |

Lệnh đo: `gh pr view 65 --json mergeable` · `grep -l "^status: approved" crm/_acceptance/*/contract.md | xargs -I{} sh -c 'grep -q "^verdict: \(BLOCKED\|REJECT\)" $(dirname {})/evidence-report.md 2>/dev/null && echo {}'` · `run-log.jsonl` của `dieu-phoi` đếm `kind:round-tally` có `vang-mat`.
