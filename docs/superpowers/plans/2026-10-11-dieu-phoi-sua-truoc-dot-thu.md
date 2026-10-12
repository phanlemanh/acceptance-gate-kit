# dieu-phoi-sua-truoc-dot-thu — kế hoạch thi công

> **Cho tác tử thi công:** vòng T2 của feature-loop, thi công TUẦN TỰ trong phiên chính (không fan-out: mọi task
> chạm chung `tiep-tuc.mjs` / `chan-doan.mjs` / tệp ca mới). Bước dùng `- [ ]`.

**Goal:** sửa năm lỗi CHẶN-THỬ của gói `dieu-phoi` (D4 · D1 · B1 ngay; E2 · E1 sau khi DP4 gộp) mà không vỡ ca
nào của hồ sơ đã ký ngoài các ca đang ghim chính lỗi.

**Architecture:** hai bảng một-nguồn mới (`TRANG_THAI_HANH_DONG` cạnh `HANH_DONG`; bên đọc `hangKeTuTiep` cạnh
`chonHangKe`), một tham số `quyet` cho `chonHangKe` do bộ phát lịch dựng bằng `quyetCua`, và văn của hai lệnh
người theo đúng đầu ra CLI.

**Tech Stack:** Node ≥ 20 ESM, `node:test`, git worktree thật trong thư mục tạm.

**Spec:** `docs/superpowers/specs/2026-10-11-dieu-phoi-sua-truoc-dot-thu-design.md` · hợp đồng
`_acceptance/dieu-phoi-sua-truoc-dot-thu/contract.md` (8 AC) · evals cùng thư mục.

## Global Constraints

- Tập trạng thái chẩn đoán giữ `{du, thieu, khong-ap}` (DP2-AC-6).
- Không đổi tên/dời hàm dùng chung ở `phat-lich.mjs` (DP6 đang sửa song song): chỉ thêm tham số cuối và một dòng
  import.
- Mọi ca đỏ: bản lành xanh trước trên cùng fixture, kiểm bước tiêm đã áp, ghim đúng thông điệp.
- Đường dẫn trong ca suy từ vị trí tệp ca; kho thử do code sinh.
- Không sửa tệp nào dưới `_acceptance/<hồ sơ đã ký>/`.

## Review Focus

1. Đợt cũ / ca đơn vị gọi `chonHangKe` không có bảng quyết → hành vi cũ nguyên vẹn (`lich.test.mjs` xanh).
2. Hàng không mang mã và hàng đã có `contract.md` trong worktree dãy → vẫn giao (luật DP7) — hàng trong ma trận AC-4.
3. Dãy `tiep` vắng (bộ phát lịch chưa chạy nhịp nào) → lối cũ, DP3-03 (c), (g) giữ nguyên hành động.
4. Ô thật có chú thích sau `decision:` → đọc đúng (hàng ô-do-writer-sinh của AC-4).
5. Sau khi gộp DP4: `slugCuaDay` của `muc-day.mjs` gọi `hangKeTuTiep`, ghi danh và `ban-giao.json` cùng nguồn.

---

### Task 1: D4 — bảng hành động → trạng thái chẩn đoán (AC-1)

**Files:** Modify `dieu-phoi/scripts/tiep-tuc.mjs` (HANH_DONG, VIEC_HANH_DONG, hằng mới) ·
`dieu-phoi/scripts/chan-doan.mjs:90-93` · `tests/dieu-phoi/tiep-tuc.test.mjs` (DP3-03: `c.muc.trang_thai` → `du`) ·
Create `tests/dieu-phoi/sua-truoc-dot-thu.test.mjs` (SDT-01*). Phục vụ E1. `independent: false`.

**Produces:** `export const TRANG_THAI_HANH_DONG = { khong:'du', 'mo-chip':'du', 'khong-hang':'du',
'nhan-giang-lai':'thieu', 'worktree-mat':'thieu', 'cho-nguoi':'thieu', 'chua-biet':'thieu' }`.

- [ ] Viết SDT-01 cho-bam-chip / bang-trang-thai / -do mo-chip-thieu / -do nhan-giang-lai-du (đợt hai dãy, ô build,
      `motNhip` thật, `giuPid` thật, nhịp giám sát bằng hook thật, `chan-doan` hai lần + `--chi-tiet`).
- [ ] Chạy: đỏ (`day:P1 thieu — bước 7 mở chip lần hai`; bảng chưa có).
- [ ] Thêm hằng; `chan-doan` dùng `TRANG_THAI_HANH_DONG[k.hanh_dong] ?? 'thieu'`; viec của `mo-chip` nêu «chờ người
      bấm chip». Sửa dòng DP3-03 + dòng sổ `fix`.
- [ ] Chạy `node --test tests/dieu-phoi/sua-truoc-dot-thu.test.mjs tests/dieu-phoi/tiep-tuc.test.mjs` → xanh.

### Task 2: D1 — bên đọc `tiep/` + hành động `khong-hang` (AC-3)

**Files:** `dieu-phoi/scripts/lich.mjs` (thêm `hangKeTuTiep`) · `tiep-tuc.mjs` (bỏ `slugKe`, `xetDay` gọi
`hangKeTuTiep`; `khong-hang` trước `chua-biet`) · `chan-doan.mjs` (viec nêu `ly_do`) · `commands/tiep-tuc.md`
bước 4 (dòng `khong-hang`) · tệp ca (SDT-03*). Phục vụ E3. `independent: false`.

```js
export function hangKeTuTiep(tiep, hangViec, id) {
  if (hangViec.day?.find((d) => d.id === id)?.nghi === true) return { hang: null, ly_do: 'nghi' };
  if (tiep) return tiep.hang ? { hang: tiep.hang } : { hang: null, ly_do: tiep.xong ? 'xong' : tiep.cho ?? 'cho' };
  const dau = (hangViec.hang ?? []).filter((h) => h.day === id).sort((a, b) => (a.uu_tien ?? 99) - (b.uu_tien ?? 99))[0];
  return dau ? { hang: dau.slug } : { hang: null, ly_do: 'khong-co-hang' };
}
```

- [ ] Viết SDT-03 ma trận 7 hàng (a)–(g) + ba ca đỏ; chạy → đỏ.
- [ ] Thi công; chạy tệp ca + `tiep-tuc.test.mjs` (DP3-01 đòi dòng `khong-hang` trong tiep-tuc.md) → xanh.
- [ ] Hàng (g) cần B1 (Task 3) để nhịp ghi `cong-dang`: viết hàng trước, xanh sau Task 3.

### Task 3: B1 — bộ phát lịch chỉ giao hàng đã quyết (AC-4)

**Files:** `lich.mjs` (`chonHangKe(hangViec, phien, tienDo, quyet = null)`) · `tho.mjs` (export `quyetCua`,
thêm `bangQuyet(gocKho, hangViec)`) · `phat-lich.mjs` (`capNhatHangKe(..., gocKho)` + gọi với `cfg.goc_kho`) ·
`tests/dieu-phoi/trong-dot.test.mjs` (DP7-03: năm hàng dựng ô build trước nhịp, đổi ô sau nhịp — trường `sauNhip`)
· `tests/dieu-phoi/mo-dot.test.mjs` (DP2-07 ap-nhip-ke: ô build cho ba hàng) · tệp ca (SDT-04*). Phục vụ E4.

```js
const q = (h) => quyet?.get(h.slug) ?? 'da-quyet';
const coThe = cua.filter((h) => chua(h) && duPhuThuoc(h));
const sanSang = coThe.filter((h) => q(h) === 'da-quyet').sort(theoUuTien);
if (sanSang.length > 0) return { hang: sanSang[0].slug, moi: true };
const conViec = cua.some((h) => !(chua(h) && q(h) === 'khong-build') && !['ky', 'gop'].includes(td(h)));
if (!conViec) return { hang: null, xong: true };
return { hang: null, cho: coThe.some((h) => q(h) === 'cho') ? 'cong-dang' : 'phu-thuoc' };
```

- [ ] Viết SDT-04 ma trận 13 hàng (hai hàng ô từ `dungCoHoi` + khuôn thật), the-va-tiep, hai ca đỏ; chạy → đỏ.
- [ ] Thi công; sửa DP7-03, DP2-07 + dòng sổ `fix` mỗi ca; chạy trọn `tests/dieu-phoi/**` → xanh.

### Task 4: lệnh người + tài liệu (AC-2, AC-8)

**Files:** `commands/mo-dot.md` bước 1, 6, 7 · `commands/tiep-tuc.md` bước 5 · `dieu-phoi/README.md` ·
`CONTEXT.md` «Hàng kế của dãy» · tệp ca (SDT-02*, SDT-08*). Phục vụ E2, E8.

- [ ] Viết SDT-02 (điều kiện theo đoạn bước, đối chứng trên bản ở mốc so qua `git show`) và SDT-08; chạy → đỏ.
- [ ] Sửa văn; chạy DP2-01, DP3-01, DP7-05 + SDT-02, SDT-08 → xanh.

### Task 5: sổ đổi thân có tên (AC-7)

**Files:** tệp ca (SDT-07 doi-than-co-ten, chon-moc, hai ca đỏ) · `_acceptance/config.yaml` (khoá
`executors.test.dieu_phoi_sdt`). Phục vụ E7.

- [ ] Hàm `mocSo()` (commit gộp PR của nhánh → [mb(cha-1, cha-2), cha-2]; không có → [mb(HEAD, origin/main), HEAD]),
      `caDoiThan(tu, toi, tep)` (tách khối `test('<tên>'` hai đầu, so thân), `thieuSo(ten, soText)`.
- [ ] Ca kho tạm hai chiều gộp; chạy → xanh; chạy trọn suite.
- [ ] Commit S3 phần 1.

### Task 6 (sau khi DP4 vào main): gộp main + E2, E1 (AC-5, AC-6)

- [ ] `git fetch && git merge origin/main` (merge commit); giải xung đột `tiep-tuc.mjs` (giữ cấu trúc DP4, `xetDay`
      thêm `khong-hang`), `chan-doan.mjs`, `the.mjs`, `mo-dot.md`, `tiep-tuc.md`; `slugCuaDay` gọi `hangKeTuTiep`.
- [ ] SDT-05: khối `LICH-30` ở hai lệnh, byte-bằng, chuỗi cũ có mặt ở mốc so và vắng ở HEAD; ca đỏ.
- [ ] SDT-06: `hoi` không có `khau-vi-han-muc`; mo-dot bước 3 in ngưỡng; sửa DP4-04 + danh sách hoi trong
      mo-dot.test.mjs + dòng sổ; ca đỏ.
- [ ] Chạy trọn `tests/dieu-phoi/**`, validate, LB; contract `status: implemented`; xin lượt S4.
