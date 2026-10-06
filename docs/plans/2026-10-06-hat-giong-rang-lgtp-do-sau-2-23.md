# Hạt giống — bộ răng hồ sơ đã ký `lan-ghim-lai-theo-paths` đỏ năm chân trên `main` sau 2.23.0 và vòng đóng mặc định

**Ngày:** 2026-10-06 · **Trạng thái:** hạt giống (SỔ, chưa là ô).
Gốc: acceptance-gate-kit/_acceptance/loc-paths-dong-mac-dinh/ — S3 của vòng đóng mặc định chạy lại mười chân của hồ sơ chị em và đo ra năm chân đỏ.

## Hình dạng

Bộ răng `_acceptance/lan-ghim-lai-theo-paths/rang/` (hồ sơ ký 03/10) đỏ ở hai lớp:

- **Đỏ sẵn trên `main` `892755ec` (mốc 2.23.0), không do vòng đóng mặc định:** `lan-doc-cu` (E10, 29 ca —
  so làn với bản base ghim `8ac65451`, mà làn 2.23 thêm dòng tổng kết và năm khoá), `song-song` (E8) và
  `loi-khong-xen` (E9) — chuỗi tiêm `  return cmds.map((c, i) => {` và `    p.stdout.on('data', d => { out += d; });`
  đã biến mất ở commit `115f190a` của vòng `gia-lan-ghim-lai`. Đo 06/10 trên cây sạch `origin/main`: cùng 29 ca đỏ.
- **Do vòng đóng mặc định (thay thế cách đo, chưa gộp):** `hinh-ho-so` (E4) hai bản sao phá thử — M14 «chú thích
  nuốt paths» và M15 «dòng trống cắt paths» — không còn làm hồ sơ xanh-sai, vì bộ lọc mới từ chối mục rỗng và mục
  không trỏ tới tệp. Bản sửa ca đo đã viết và chạy xanh (chân `hinh-ho-so` xanh), nhưng KHÔNG gộp trong vòng đóng
  mặc định: sửa tệp của hồ sơ kéo nó vào diff, lưới đòi ghim lại, và làn ghim lại hồ sơ ấy đỏ vì ba chân đỏ sẵn ở trên.

## Bản sửa ca đo E4 đã có (áp nguyên văn khi mở ô)

```diff
diff --git a/_acceptance/lan-ghim-lai-theo-paths/rang/chan-premerge.mjs b/_acceptance/lan-ghim-lai-theo-paths/rang/chan-premerge.mjs
index 7ed8f442..3e604fe8 100644
--- a/_acceptance/lan-ghim-lai-theo-paths/rang/chan-premerge.mjs
+++ b/_acceptance/lan-ghim-lai-theo-paths/rang/chan-premerge.mjs
@@ -110,13 +110,17 @@ if (chan === 'doc-cu') {
     { pin: 'im ô ngoài làn máy', o: 'M6', sua: [{ tep: LIB, tu: '    globs.push(...p);', thanh: '    if (isRepinMachineEval(e)) globs.push(...p);' }] },
     { pin: 'eval máy thiếu paths', o: 'M4', sua: [{ tep: LIB, tu: 'if (isRepinMachineEval(e)) return cu(`eval-may-thieu-paths:${e.id}`);', thanh: 'if (isRepinMachineEval(e)) continue;' }] },
     { pin: 'eval ngoài làn máy thiếu paths', o: 'M13', sua: [{ tep: LIB, tu: 'if (normaliseEvalStatus(e.status) !== EVAL_STATUS_NOT_RUN) return cu(`eval-ngoai-may-thieu-paths:${e.id}`);', thanh: '' }] },
-    { pin: 'chú thích nuốt paths', o: 'M14', sua: [{ tep: LIB, tu: "const v = (f[1].trim().startsWith('#') ? '' : f[1].replace(/\\s+#.*$/, '')).trim();", thanh: 'const v = f[1].trim();' }, { tep: LIB, tu: "  if (globs.some(g => !String(g || '').trim())) return cu('evals-hong');", thanh: '' }] },
+    // M14 (06/10, hồ sơ loc-paths-dong-mac-dinh THAY THẾ cách đo): bản sao nuốt chú thích thành một mục RỖNG;
+    // bộ lọc đóng mặc định từ chối mục rỗng nên hồ sơ không còn xanh-sai — lỗi lộ ra thành dòng NOTE
+    // «không áp (evals-hong)» mà bản lành không có. Đo đúng dấu đó.
+    { pin: 'chú thích nuốt paths', o: 'M14', thay: (r) => /NOTE \[feat\]: bộ lọc paths không áp \(evals-hong\)/.test(r.out), sua: [{ tep: LIB, tu: "const v = (f[1].trim().startsWith('#') ? '' : f[1].replace(/\\s+#.*$/, '')).trim();", thanh: 'const v = f[1].trim();' }, { tep: LIB, tu: "  if (globs.some(g => !String(g || '').trim())) return cu('evals-hong');", thanh: '' }] },
     { pin: 'dòng trống cắt paths', o: 'M15', sua: [{ tep: LIB, tu: '      if (!raw.trim() || /^\\s*#/.test(raw)) continue;', thanh: '' }] },
     { pin: 'tệp hỏng thành im', o: 'M8', sua: [{ tep: LIB, tu: "return cu('evals-hong');\n  const globs", thanh: "return { apply: true, reason: null, kept: [], skipped: all };\n  const globs" }] },
     { pin: 'not-run chặn lọc', o: 'M5', sua: [{ tep: LIB, tu: 'if (isRepinMachineEval(e)) return cu(`eval-may-thieu-paths', thanh: "if (['test', 'script'].includes(String(e.executor).trim())) return cu(`eval-may-thieu-paths" }] },
     { pin: 'bộ đọc paths một dạng', o: 'M10', sua: [{ tep: LIB, tu: '    if (!v) { seq = []; continue; }', thanh: '    if (!v) return null;' }] },
   ];
-  for (const m of M) { const s = sao(m.sua); const r = ketLuanDu(s, m.o); batDo(ok, `E4 chiều đỏ: bản sao «${m.pin}» → ${m.o} lệch kỳ vọng (${r.t})`, daChayLuoi(r.out), r.t !== muon(KY[m.o])); don(s); }
+  for (const m of M) { const s = sao(m.sua); const r = ketLuanDu(s, m.o); batDo(ok, `E4 chiều đỏ: bản sao «${m.pin}» → ${m.o} lệch kỳ vọng (${r.t})`, daChayLuoi(r.out), m.thay ? m.thay(r) : r.t !== muon(KY[m.o])); don(s); }
+  ok(!/NOTE \[feat\]: bộ lọc paths không áp/.test(ketLuanDu(KIT, 'M14').out), 'E4 M14 bản lành KHÔNG có NOTE «không áp» — dấu đo bản sao «chú thích nuốt paths» phân biệt được');
   ket('E4');
 } else if (chan === 'khong-chay-duoc') {
   // E5 — bộ lọc không chạy được → giữ luật cũ + NOTE nói vì sao; đối chứng: lành thì lọc.
diff --git a/_acceptance/lan-ghim-lai-theo-paths/rang/ma-tran.mjs b/_acceptance/lan-ghim-lai-theo-paths/rang/ma-tran.mjs
index db2e3d0d..3ce8eb46 100644
--- a/_acceptance/lan-ghim-lai-theo-paths/rang/ma-tran.mjs
+++ b/_acceptance/lan-ghim-lai-theo-paths/rang/ma-tran.mjs
@@ -26,6 +26,8 @@ export const MA_TRAN = [
   // M13–M15: owner nâng phạm vi ở Cổng Bằng chứng lượt 3 (Ngoài-1, 4, 5 — fail-open đã tái hiện).
   { id: 'M13', evalsYaml: Y(ev('E1', 'script', P('src/**')), ev('E2', 'ui-check')), diff: ['ui/p.tsx'], kyVong: 'cu' },
   { id: 'M14', evalsYaml: Y(ev('E1', 'script', '    paths:   # vat do cua E1\n      - "src/**"\n')), diff: ['src/a.js'], kyVong: 'hoa-cu', tep: ['src/a.js'] },
-  { id: 'M15', evalsYaml: Y(ev('E1', 'script', '    paths:\n      - "lib2/zz/**"\n\n      - "src/**"\n')), diff: ['src/a.js'], kyVong: 'hoa-cu', tep: ['src/a.js'] },
+  // M15: mục đầu `lib2/**` trỏ tệp có thật (06/10, hồ sơ loc-paths-dong-mac-dinh): bộ lọc đóng mặc định từ chối
+  // mục không trỏ tới tệp nào, nên với `lib2/zz/**` cũ bản sao «dòng trống cắt paths» rơi về luật cũ và hết đỏ.
+  { id: 'M15', evalsYaml: Y(ev('E1', 'script', '    paths:\n      - "lib2/**"\n\n      - "src/**"\n')), diff: ['src/a.js'], kyVong: 'hoa-cu', tep: ['src/a.js'] },
 ];
 if (MA_TRAN.length !== M_SO_O) throw new Error(`số ô lệch: ${MA_TRAN.length} ≠ ${M_SO_O}`);
```

## Hướng nghiệm (chưa chọn)

Một vòng sửa bộ răng của hồ sơ đã ký, cùng lượt: áp bản sửa E4 ở trên · đổi bản base E10 sang mốc sau 2.23 hoặc so
theo luật «chỉ thêm» thay vì bằng hệt · rút chuỗi tiêm E8/E9 theo mã làn hiện tại · ghim lại hồ sơ bằng làn.

## Ngưỡng mở ô

Chiến dịch ghim lại ở mốc kế (mốc mang `loc-paths-dong-mac-dinh`) chọn hồ sơ `lan-ghim-lai-theo-paths`, hoặc owner gọi tên.
