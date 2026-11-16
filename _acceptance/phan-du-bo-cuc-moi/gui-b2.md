# Gửi B2 — phan-du-bo-cuc-moi

Ba thứ kịch bản chuyển nhà của B2 (`migration/kich-ban/` ở kho `delivery-loop`) cần biết để chạy trên cây của vòng này.
Thước: `node _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs` — bảng vá chép ở `rang/va-bo-kiem-b2.json`, luật bước 6
chép ở `rang/buoc6-chep.mjs`. Hai khối máy dưới đây không sửa tay trừ khi đổi khai báo có chủ ý.

## 1. Mục vá thừa trong `va-bo-kiem.json`

Máy ghi bằng `--ghi-gui-b2`; `--chieu-do` rút lại và so (GUI-B2). Một mục thừa khi tệp của nó nằm trong danh sách ở mục 2
(bước 6 bỏ qua tệp ấy), hoặc khi sau bước 1–3 + luật chung bước 6 chuỗi `cu` không còn khớp đúng `so_lan` lần. Xoá các
mục này khỏi bảng vá.

<!-- <<<GUI-B2-VA-THUA -->
máy ghi: 84/348 mục của va-bo-kiem-b2.json thừa — 76 trên tệp tự đúng đường (bước 6 bỏ qua), 8 không còn khớp sau bước 6 (rút từ HEAD lúc ghi)
```jsonl
{"tep":"tests/dieu-phoi/lop-mod.test.mjs","cu":"  for (const tep of ['mo-dot.md', 'tiep-tuc.md']) {","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/dieu-phoi/lop-mod.test.mjs","cu":"  assert.ok(loi.includes('bộ lọc Monitor không khớp: mo-dot.md'), loi.join(' | '));\n  assert.ok(loi.includes('bộ lọc Monitor không khớp: tiep-tuc.md'), loi.join(' | '));","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/dieu-phoi/mo-dot.test.mjs","cu":"    if (f === 'mo-dot.md' || f === 'dong-dot.md') {","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/dieu-phoi/mo-dot.test.mjs","cu":"    if (f === 'mo-dot.md') {","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/dieu-phoi/mo-dot.test.mjs","cu":"  const p = path.join(sao, 'commands', 'xem.md');","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/dieu-phoi/mo-dot.test.mjs","cu":"  assert.ok(loi.some((l) => l.startsWith('xem.md:')), `phải nêu xem.md: ${loi.join(' | ')}`);","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/dieu-phoi/mo-dot.test.mjs","cu":"  const p = path.join(sao, 'commands', 'mo-dot.md');","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/dieu-phoi/mo-dot.test.mjs","cu":"  assert.ok(loi.some((l) => l.startsWith('mo-dot.md: trình tự')), `phải nêu trình tự của mo-dot.md: ${loi.join(' | ')}`);","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/dieu-phoi/mo-dot.test.mjs","cu":"const QUET = (gocKit) => path.join(gocKit, 'plugins/acceptance-gate/scripts', 'start-scan.mjs');","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/dieu-phoi/mo-dot.test.mjs","cu":"chuan(quetStart(KIT, kho), KIT)","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/dieu-phoi/mo-dot.test.mjs","cu":"quetStart(KIT, kho)","so_lan":2,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/dieu-phoi/mo-dot.test.mjs","cu":"  for (const rel of ['lib', 'skills', 'commands', 'plugins/feature-loop/skills',","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/dieu-phoi/mo-dot.test.mjs","cu":"\\/dieu-phoi:","so_lan":2,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/dieu-phoi/tiep-tuc.test.mjs","cu":"  for (const rel of ['lib', 'skills', 'commands', 'plugins/feature-loop/skills',","so_lan":1}
{"tep":"tests/dieu-phoi/trong-dot.test.mjs","cu":"  const t = fs.readFileSync(path.join(GOI, 'commands', 'mo-dot.md'), 'utf8');","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/dieu-phoi/trong-dot.test.mjs","cu":"  const tar = execFileSync('git', ['archive', base, 'plugins/dispatch/scripts'], { cwd: KIT, env: ENV });","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/plugins/run-tests.sh","cu":"    old_js = dd / \"plugins/acceptance-gate/scripts\" / \"gate-card.js\"","so_lan":1}
{"tep":"tests/plugins/run-tests.sh","cu":"        for f in (root / \"lib\").iterdir():\n            if f.is_file(): (dst / f.name)","so_lan":1}
{"tep":"tests/plugins/run-tests.sh","cu":"iso_new / \"plugins/acceptance-gate/scripts\" / \"gate-card.js\"","so_lan":2}
{"tep":"tests/plugins/run-tests.sh","cu":"iso_old / \"plugins/acceptance-gate/scripts\" / \"gate-card.js\"","so_lan":2}
{"tep":"tests/plugins/design-pass-nac.test.mjs","cu":"    card = path.join(d, 'plugins/acceptance-gate/scripts', 'gate-card.js');","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/plugins/lenh-bam-duoc.test.mjs","cu":"for (const d of ['.', 'feature-loop', 'diagram-design', 'dieu-phoi']) {","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/plugins/lenh-bam-duoc.test.mjs","cu":"for (const d of ['scripts', 'lib', 'plugins/acceptance-gate/skills/acceptance/references', '_acceptance/config.yaml', 'CONTEXT.md'])","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/plugins/lenh-bam-duoc.test.mjs","cu":"    if (!existsSync(path.join(copy, 'lib', m[1])))\n      writeFileSync(path.join(copy, 'lib', m[1]),","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/plugins/ra-co-ten.test.mjs","cu":"path.join(R, 'plugins/acceptance-gate/scripts', 'recheck-evidence.cjs'));","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/plugins/ra-co-ten.test.mjs","cu":"      cpSync(path.join(ROOT, 'plugins/acceptance-gate/hooks'), path.join(cay, 'hooks'), { recursive: true });\n      cpSync(path.join(ROOT, 'plugins/acceptance-gate/lib'), path.join(cay, 'lib'), { recursive: true });","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/plugins/ra-co-ten.test.mjs","cu":"  for (const rel of ['plugins/acceptance-gate/scripts/start-scan.mjs', 'plugins/acceptance-gate/scripts/trang-thai-ho-so.cjs', 'plugins/acceptance-gate/scripts/khong-can-nguoi.mjs',\n                     'plugins/acceptance-gate/lib/workspace-record.cjs', 'plugins/acceptance-gate/lib/evidence-core.cjs', 'plugins/acceptance-gate/lib/md-section.cjs', 'plugins/acceptance-gate/lib/ac-line.cjs',\n                     'plugins/acceptance-gate/skills/acceptance/references/opportunity-template.md'])\n    W(old, rel, show(rel));\n  const OLD_SCAN = path.join(old, 'plugins/acceptance-gate/scripts', 'start-scan.mjs');","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/plugins/ra-co-ten.test.mjs","cu":"for (const d of ['scripts', 'lib', 'plugins/acceptance-gate/skills/acceptance/references']) cpSync(path.join(ROOT, d), path.join(m, d), { recursive: true });","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/plugins/ra-co-ten.test.mjs","cu":"for (const d of ['scripts', 'lib', 'plugins/acceptance-gate/skills/acceptance/references']) cpSync(path.join(ROOT, d), path.join(mut, d), { recursive: true });","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs","cu":"const p = path.join(T, 'lib', tep), goc","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs","cu":"  if (moi === goc) throw new Error(`đột biến không áp được vào lib/${tep}: không thấy «${tu.slice(0, 60)}»`);\n  writeFileSync(p, moi);\n  return path.join(T, 'scripts');","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs","cu":"path.join(R, 'plugins/acceptance-gate/scripts', 'recheck-evidence.cjs'));","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs","cu":"`AG='${ROOT}'`","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/giu-tuoi-fixture.mjs","cu":"const b = { dir, lane: path.join(dir, 'plugins/feature-loop', 'scripts', 'repin-lane.mjs'), agRoot: dir, recheck: path.join(dir, 'plugins/acceptance-gate/scripts', 'recheck-evidence.cjs') };","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/giu-tuoi-fixture.mjs","cu":"'--ag-root', o.agRoot || ROOT,","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/yaml-chuan.test.mjs","cu":"const co = [1, 2].filter(cong => coCua(the(hoSoThe(HAI_LOI, cong), path.join(b, 'plugins/acceptance-gate/scripts', 'gate-card.js')))","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs","cu":"rmSync(path.join(R, 'plugins/acceptance-gate/lib', 'out-of-contract.cjs'))","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs","cu":"\"$ROOT/plugins/acceptance-gate/lib/out-of-contract.cjs\"","so_lan":2,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs","cu":"'$ROOT/plugins/acceptance-gate/lib/out-of-contract.cjs'","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs","cu":"\"${ROOT}/plugins/acceptance-gate/lib/out-of-contract.cjs\"","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs","cu":"'ban-chep': [['plugins/acceptance-gate/scripts/pre-merge-check.sh', '.'], R],","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs","cu":"    writeFileSync(p, moi);\n  }\n  for (const f of boLib) rmSync(path.join(cp, 'lib', f));","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs","cu":"'\"plugins/acceptance-gate/lib/out-of-contract.cjs\"'","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs","cu":"node plugins/acceptance-gate/lib/out-of-contract.cjs","so_lan":2,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/tep-sinh-khong-chan-gop.test.mjs","cu":"cpSync(path.join(KIT, 'plugins/acceptance-gate/scripts'), path.join(d, 'scripts'), { recursive: true });","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/tep-sinh-khong-chan-gop.test.mjs","cu":"cpSync(path.join(KIT, 'plugins/acceptance-gate/lib'), path.join(d, 'lib'), { recursive: true });","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/tep-sinh-khong-chan-gop.test.mjs","cu":"doc(path.join(cu, 'plugins/acceptance-gate/lib', 'workspace-record.cjs'))","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/run-id-danh-sach-cho-phep.test.mjs","cu":"src: readFileSync(path.join(d, 'plugins/feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8') };","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/hskt.test.mjs","cu":"const p = path.join(cp, 'plugins/acceptance-gate/lib', 'workspace-record.cjs'); const src","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/hskt.test.mjs","cu":"'-S', 'hoSoDaKhep', '--', 'plugins/acceptance-gate/lib/workspace-record.cjs')","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/hskt.test.mjs","cu":"banSaoMay([[`scripts/${f}`","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lan-status-not-run.test.mjs","cu":"const lane = path.join(baseDir, 'plugins/feature-loop', 'scripts', 'repin-lane.mjs');","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lan-status-not-run.test.mjs","cu":"require(path.join(base, 'plugins/acceptance-gate/lib', 'evidence-core.cjs'))","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lan-status-not-run.test.mjs","cu":"quetKho(path.join(base, 'plugins/acceptance-gate/scripts', 'recheck-evidence.cjs'), accDir)","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/additive-only.test.mjs","cu":"const baseRecheck = showAtBase('plugins/acceptance-gate/scripts/recheck-evidence.cjs');","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs","cu":"'--root', k.root, '--ag-root', kit, ...args],","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/run-id-danh-sach-cho-phep.test.mjs","cu":"'--round', '2', '--ag-root', goc,","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/vong-don-le-tra-tri-thuc.test.mjs","cu":"`AG='${may}' && `","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/kho-moi-cai-goi-road-map.test.mjs","cu":"j.plugins.find(x => x.name === 'road-map')","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/kho-moi-cai-goi-road-map.test.mjs","cu":"x.startsWith('node \"${CLAUDE_PLUGIN_ROOT}/plugins/acceptance-gate/scripts/lo-trinh-khoi-tao.mjs\"')","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs","cu":"j.plugins.find(x => x.name === 'road-map')","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/kho-moi-cai-goi-road-map.test.mjs","cu":"lenhInit(kit).split('${CLAUDE_PLUGIN_ROOT}').join(kit)","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/run-tests.sh","cu":"\"$HERE/../../scripts\"","so_lan":4}
{"tep":"tests/scripts/run-tests.sh","cu":"\"$HERE/../../lib\"","so_lan":4}
{"tep":"tests/scripts/run-tests.sh","cu":"\"$M42/plugins/acceptance-gate/","so_lan":3}
{"tep":"tests/scripts/s4-args-judgment-inputs.test.mjs","cu":"['plugins/feature-loop', 'scripts', 'lib', 'hooks', 'skills', 'commands', path.join('docs', 'findings', 'assets')]","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/moi-cong-khong-qua-nut.test.mjs","cu":"/^\\s*\\/(acceptance-gate|feature-loop|dieu-phoi):/","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs","cu":"'--require', 'plugins/acceptance-gate/scripts/dinh-tuyen-may.cjs', '--root', ROOT]","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/can-cu-s1.ca.mjs","cu":"'Không nạp được bộ đọc căn cứ bước thiết kế (plugins/acceptance-gate/scripts/can-cu-s1.cjs)'","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/can-cu-s1.ca.mjs","cu":"--require plugins/acceptance-gate/scripts/can-cu-s1.cjs) && node \"$AG/plugins/acceptance-gate/scripts/can-cu-s1.cjs\"', 'node plugins/acceptance-gate/scripts/can-cu-s1.cjs');","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/kho-moi-cai-goi-road-map.test.mjs","cu":"path.join(KIT, m.nguon)","so_lan":2,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/kho-moi-cai-goi-road-map.test.mjs","cu":"node([path.join(g, 'plugins/acceptance-gate/scripts', 'product-map.mjs'), '--root', '.', '--check'], { cwd: g })","so_lan":2,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/kho-moi-cai-goi-road-map.test.mjs","cu":"writeFileSync(path.join(x, 'plugins/acceptance-gate/scripts', 'lo-trinh.mjs'), lech)","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/kho-moi-cai-goi-road-map.test.mjs","cu":"readFileSync(path.join(g, 'plugins/acceptance-gate/scripts', 'lo-trinh.mjs'), 'utf8') !== lech","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/kho-moi-cai-goi-road-map.test.mjs","cu":"x.includes('plugins/acceptance-gate/scripts/ho-so-tom-tat.cjs') && x.includes('[only-if-declared: lo_trinh]')","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/kho-moi-cai-goi-road-map.test.mjs","cu":"`AG='${KIT}' && `","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs","cu":"existsSync(path.join(kit, m.nguon))","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs","cu":"cpSync(path.join(kit, m.nguon)","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs","cu":"spawnSync('bash', [path.join(d, 'plugins/acceptance-gate/scripts', 'pre-merge-check.sh')","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs","cu":"{ boQua: ['plugins/acceptance-gate/lib/chan-lo-trinh.cjs'] }","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs","cu":"`AG='${kit}' && `","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs","cu":"x.includes('plugins/acceptance-gate/lib/chan-lo-trinh.cjs') && x.includes('[only-if-declared: lo_trinh]')).length !== 1) throw new Error('danh sách chép CI thiếu dòng plugins/acceptance-gate/lib/chan-lo-trinh.cjs","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/tin-hieu.test.mjs","cu":"env: { ...process.env, AG: kit } }","so_lan":2,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/tin-hieu.test.mjs","cu":"'node \"$AG/plugins/acceptance-gate/scripts/tin-hieu.mjs\" --root . --rang', 'node \"$AG/plugins/acceptance-gate/scripts/tin-hieu.mjs\" --root . --rangg'","so_lan":1,"ly_do":"tệp tự đúng đường"}
```
<!-- GUI-B2-VA-THUA>>> -->

## 2. Tệp tự đúng đường — bước 6 bỏ qua

Các tệp này đã tự giải đường qua bộ dịch `tests/bo-cuc.mjs`; luật đường của bước 6 viết lại chuỗi chúng đã dịch đúng
(đo ở Task 8: K4-SC 68/77 không bước 6, 55/77 có bước 6). Bước 6 không áp luật đường và bảng vá lên chúng; luật đổi tên
(bước 3) vẫn áp như mọi tệp dưới `tests/`. Đây là biến thể (iii) mà thước chấm (sổ `d-20261115T044131Z-24`).

Danh sách viết trước khi đo: mọi tệp dưới `tests/` vòng này sửa hoặc tạo (`git diff --name-only 644e9b49 HEAD -- tests/`),
trừ các tệp vẫn đi bước 6 (hằng `VAN_BUOC6` của `rang/giu-khoa.mjs`; thước giữ luật này — tệp vòng sửa = khối dưới + các tệp ấy): `tests/scripts/run-tests.sh` và `tests/plugins/run-tests.sh` (chỉ sửa một phần khối),
`tests/scripts/lo-trinh.test.mjs` (chỉ dời ngày LT-94, không đi qua bộ dịch; 13 mục vá của nó vẫn cần), và
`tests/dieu-phoi/tiep-tuc.test.mjs` (thêm sau chữ ký — đoạn ngay dưới khối).

<!-- <<<GUI-B2-TU-DUNG -->
```text
tests/bo-cuc.mjs
tests/dieu-phoi/danh-thuc-ma-phien.test.mjs
tests/dieu-phoi/lenh-dot-ghi-dung-hang.test.mjs
tests/dieu-phoi/lop-mod.test.mjs
tests/dieu-phoi/mo-dot.test.mjs
tests/dieu-phoi/trong-dot.test.mjs
tests/fixtures/bo-cuc-phang.json
tests/fixtures/cham-bo-vang.mjs
tests/fixtures/cua-veto-sau-chu-ky.mjs
tests/plugins/design-pass-nac.test.mjs
tests/plugins/lan-may-classifier.test.mjs
tests/plugins/lenh-bam-duoc.test.mjs
tests/plugins/ra-co-ten.test.mjs
tests/scripts/additive-only.test.mjs
tests/scripts/bang-ten-lo-trinh.test.mjs
tests/scripts/bo-cuc.test.mjs
tests/scripts/can-cu-s1.ca.mjs
tests/scripts/chep-tri-thuc-du.test.mjs
tests/scripts/core-untouched.test.mjs
tests/scripts/cua-veto-sau-chu-ky.test.mjs
tests/scripts/fixtures/routing-baseline.txt
tests/scripts/giu-tuoi-fixture.mjs
tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
tests/scripts/hskt.test.mjs
tests/scripts/kho-cam-ket-co-lo-trinh.test.mjs
tests/scripts/kho-moi-cai-goi-road-map.test.mjs
tests/scripts/kiem-ban-cai-loi-sua.test.mjs
tests/scripts/lan-status-not-run.test.mjs
tests/scripts/luot-sua-giu-du.test.mjs
tests/scripts/moi-cong-khong-qua-nut.test.mjs
tests/scripts/ngay-ky.test.mjs
tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs
tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs
tests/scripts/premerge-repin.test.mjs
tests/scripts/recheck-goc-goi-loi.test.mjs
tests/scripts/run-id-danh-sach-cho-phep.test.mjs
tests/scripts/s4-args-judgment-inputs.test.mjs
tests/scripts/tep-sinh-khong-chan-gop.test.mjs
tests/scripts/thiet-ke-nap-tri-thuc.test.mjs
tests/scripts/tin-hieu.test.mjs
tests/scripts/vong-don-le-tra-tri-thuc.test.mjs
tests/scripts/yaml-chuan.test.mjs
tests/workflows/harness.mjs
```
<!-- GUI-B2-TU-DUNG>>> -->

Đo sau khi khai (15/11, biến thể iii): `tests/scripts/tin-hieu.test.mjs` khai nhầm. Chỉ phần TH-10 đi qua bộ dịch; dòng
nạp `lib/workspace-record.cjs` ở đầu tệp vẫn là đường phẳng, nên bỏ bước 6 làm cả tệp sập (0/44 khoá). Danh sách vẫn giữ
như đã khai. Còn chờ quyết: trả tệp này về bước 6, hay sửa dòng nạp ấy.

Thêm sau chữ ký Cổng Bằng chứng (16/11), không phải khai trước khi đo: hai tệp vòng chạm sau lượt chấm 2. Thiếu chúng thì
làn ghim lại `repin-20261115T181928Z-60777` đỏ cả chín eval máy ở luật danh sách tự đúng đường, mọi túi khoá vẫn xanh.
- `tests/scripts/fixtures/routing-baseline.txt` vào khối trên: bước 7a-bis của nghi thức ký thêm một dòng của hồ sơ; tệp
  chỉ có tên hồ sơ và nhãn, không đường nào cho bước 6 viết lại.
- `tests/dieu-phoi/tiep-tuc.test.mjs` vào `VAN_BUOC6`, KHÔNG vào khối trên: CI `tests · dieu-phoi` đỏ ở ca DP3-12-do-lb,
  bản vá `475d5ed5` chỉ cho danh sách chép của ca ấy đi qua `boPhan`. `LUAT_MAU` và đường `'commands', 'tiep-tuc.md'`
  vẫn phẳng, nên hai mục vá B2 của chúng vẫn cần; khai cả tệp tự đúng đường sẽ báo B2 bỏ nhầm hai mục ấy (cùng lớp với
  `tin-hieu.test.mjs` ở trên). Mục vá cho dòng chép cũ của DP3-12 nay thừa vì dòng đã đổi.

## 3. Cấu hình kịch bản phải đổi

- Thêm `.claude/settings.json` vào `bo_kiem.tep_goc`. Lệnh `node scripts/product-map.mjs --root . --check` ở
  `permissions.allow` phải thành đường gói lõi ở kho mới; bước 3 chỉ đổi tên trong tệp này, không đổi đường.

## 4. Ca đổi nghĩa và lý do

Các ca dưới đây không chỉ đổi đường: cách đo đổi theo, nên B2 đọc lý do trước khi so số.

- **MQ** (`moi-cong-khong-qua-nut`): giữ đúng ba vai của bản cũ (lõi, feature-loop, điều phối), giải gốc từng vai qua bộ
  dịch thay vì quét mọi gói ở kho mới.
- **TC1-09** (`tests/dieu-phoi/`): so thân ca với bản ở commit ký của hồ sơ `danh-thuc-doc-nhip-dung-ma`, không với một
  bản viết cứng; tên trạng thái ký đọc từ `lib/workspace-record.cjs`.
- **TC1-06**: đổi tên lệnh về tên tại mốc trước khi so (tên lệnh theo mốc rút từ vật).
- **P93**: rút thư mục gói khỏi vùng loại trừ theo tệp khai chợ (`SKIP_TOP` từ `boCuc`), đếm theo tiền tố.
- **P161**: so thêm dạng dịch ngược (bản base và mốc nền qua bộ dịch; heredoc Python gọi CLI).
- **L05** (`lan-status-not-run`): chạy quét bản base trong khung phẳng symlink của cây đang chạy, để verifier đã ký giải
  được ở kho mới.
- **kiem-ban-cai-loi-sua**: lối A — chợ tự khai nguồn `./`.
- **NT13** (`core-untouched`): `--root <gốc gói lõi>`.

Để ngoài vòng (kho mới đỏ đúng các khoá này cho tới khi có quyết):

- **DV5** của `pre-merge-check.sh` ở kho mới, **KK-6** (`can-cu-s1`), **HK-AC7-dot-bien** (`hskt`) — đổi nghĩa mới về
  được; sổ `d-20261115T041020Z-23`.
- **LT-142**, **LT-142-do**, **LT-142-do-nhanh** (`lo-trinh.test.mjs`): `scripts/cat-luot.mjs` vẫn đọc
  `skills/cat-luot/SKILL.md` sau khi bước 3 đổi tên skill thành `scope-slice` — mã sản phẩm, việc của B2; bộ dịch của
  vòng không chạm được (đo ở `thu-bo-dich.md`).
