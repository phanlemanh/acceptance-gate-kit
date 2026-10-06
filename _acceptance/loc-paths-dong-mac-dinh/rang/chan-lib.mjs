// Chân E1 (ma-tran), E2 (doi-chung-crm), E4 (cay) của hồ sơ loc-paths-dong-mac-dinh. Mỗi chân: bản
// lành XANH trước (đối chứng dương), rồi bản sao bị tiêm phải ĐỎ với thông điệp ghim, kèm dấu dương
// rằng bản sao đã chạy tới đúng bước (luật «âm tính một mình» của CLAUDE.md).
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, cpSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { KIT, dungKho, banSao, lsFiles, chayPremerge } from './kho.mjs';
import { rutMaTran, evalsCua, D_SO_O, CAY_D } from './ma-tran-d.mjs';

const chan = process.argv[2];
const require = createRequire(import.meta.url);
let loi = 0;
const ok = (c, m) => { if (!c) { loi++; console.log(`  FAIL: ${m}`); } else console.log(`  PASS: ${m}`); };
const ket = (ten) => { if (loi) { console.log(`${ten} ĐỎ: ${loi} ca`); process.exit(1); } console.log(`${ten} XANH`); };
const LIB = 'lib/evidence-core.cjs';
const nap = (engine) => { const p = path.join(engine, LIB); delete require.cache[require.resolve(p)]; return require(p); };
const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

if (chan === 'ma-tran') {
  const M = rutMaTran();
  ok(M.length === D_SO_O, `số ô lệch: bảng contract có ${M.length} ô, hằng ${D_SO_O}`);
  // Một lượt chấm cả ma trận trên một engine; trả { chay: số ô gọi được hàm, lech: [id ô sai] }.
  const cham = (engine) => {
    const core = nap(engine);
    let chay = 0; const lech = [];
    for (const o of M) {
      let r;
      try { r = core.staleByPaths(o.doi, evalsCua(o), { cay: core.dungCayPaths(CAY_D) }); chay++; } catch (e) { lech.push(`${o.id}(ném: ${String(e.message).slice(0, 40)})`); continue; }
      const dung = o.nhan
        ? r.apply === true && same(r.kept, o.kept)
        : r.apply === false && String(r.reason).startsWith(o.ma) && (o.ma === 'evals-hong' || String(r.reason).includes(o.mucDau));
      if (!dung) lech.push(o.id);
    }
    return { chay, lech };
  };
  const lanh = cham(KIT);
  ok(lanh.chay === D_SO_O && lanh.lech.length === 0, `đối chứng dương: ${D_SO_O}/${D_SO_O} ô đúng cột contract (gọi được ${lanh.chay}, sai: ${lanh.lech.join(', ') || 'không'})`);
  // Chiều đỏ 1: bỏ bước phân loại — mọi mục coi như glob (hành vi trước vòng).
  const s1 = banSao([{ tep: LIB, tu: 'const pl = phanLoaiMucPaths(muc, cay);', thanh: 'const pl = { nhan: true, glob: muc };' }]);
  const r1 = cham(s1);
  console.log(`  bỏ phân loại → lệch ${r1.lech.length} ô: ${r1.lech.join(', ')}`);
  ok(r1.chay === D_SO_O && ['D4', 'D12'].every(d => r1.lech.includes(d)), `chiều đỏ «bỏ qua thầm»: bản sao bỏ phân loại phải lệch ở D4 và D12 [bản sao chạy đủ ${r1.chay}/${D_SO_O} ô]`);
  // Chiều đỏ 2: khớp glob luôn rỗng → kept rỗng ở các ô nhận.
  const s2 = banSao([{ tep: LIB, tu: 'const res = globs.map(pathGlobToRe);', thanh: 'const res = globs.map(() => /^$a/);' }]);
  const r2 = cham(s2);
  console.log(`  khớp rỗng → lệch ${r2.lech.length} ô: ${r2.lech.join(', ')}`);
  ok(r2.chay === D_SO_O && ['D1', 'D3', 'D5', 'D6'].every(d => r2.lech.includes(d)), `chiều đỏ «kept rỗng»: bản sao khớp rỗng phải lệch ở D1, D3, D5, D6 [bản sao chạy đủ ${r2.chay}/${D_SO_O} ô]`);
  ket('E1');
} else if (chan === 'doi-chung-crm') {
  const M = rutMaTran().filter(o => o.id !== 'D18');   // D18 là hồ sơ hai eval, không phải một dạng khai
  const slug = (o) => o.id.toLowerCase();
  const LUOI = path.join(KIT, '_acceptance', 'loc-paths-dong-mac-dinh', 'rang', 'doi-chung-crm', 'kiem-paths-dong.mjs');
  const k = dungKho({ hoSo: M.map(o => ({ slug: slug(o), evalsYaml: evalsCua(o) })), tep: CAY_D });
  const doiChieu = (engine) => {
    mkdirSync(path.join(k.AR, 'lib'), { recursive: true }); mkdirSync(path.join(k.AR, 'scripts'), { recursive: true });
    for (const f of ['evidence-core.cjs', 'eval-yaml.cjs']) cpSync(path.join(engine, 'lib', f), path.join(k.AR, 'lib', f));
    cpSync(LUOI, path.join(k.AR, 'scripts', 'kiem-paths-dong.mjs'));
    const g = spawnSync(process.execPath, [path.join(k.AR, 'scripts', 'kiem-paths-dong.mjs')], { encoding: 'utf8' });
    const loiDong = (g.stdout.match(/^LỖI /gm) || []).length;
    const luoi = new Set([...g.stdout.matchAll(/^(?:LỖI|CẢNH BÁO) (d\d+)\//gm)].map(m => m[1]));
    const core = nap(engine);
    const cay = core.dungCayPaths(lsFiles(k));
    const tuChoi = new Set(M.map(slug).filter(s => !core.staleByPaths(['x'], readFileSync(path.join(k.AR, '_acceptance', s, 'evals.yaml'), 'utf8'), { cay }).apply));
    return { loiDong, tongKet: /kiem-paths-dong: \d+ lỗi/.test(g.stdout), a: [...luoi].filter(s => !tuChoi.has(s)).sort(), b: [...tuChoi].filter(s => !luoi.has(s)).sort() };
  };
  const lanh = doiChieu(KIT);
  ok(lanh.tongKet && lanh.loiDong >= 7, `đối chứng dương: lưới crm chạy trọn và báo ${lanh.loiDong} LỖI (≥ 7)`);
  ok(same(lanh.a, ['d4']), `(lưới chặn) − (bộ lọc từ chối) = {D4}: được {${lanh.a.join(', ')}}`);
  ok(same(lanh.b, ['d15', 'd17', 'd19']), `(bộ lọc từ chối) − (lưới chặn) = {D15, D17, D19}: được {${lanh.b.join(', ')}}`);
  const s = banSao([{ tep: LIB, tu: "|| v.endsWith('/')) return { nhan: false, ma: 'dang-khai-la' };", thanh: ") return { nhan: false, ma: 'dang-khai-la' };" }]);
  const do_ = doiChieu(s);
  ok(do_.tongKet && do_.a.includes('d12'), `chiều đỏ «lưới crm chặn mà bộ lọc nhận: D12»: bản sao nhận \`/\` cuối → hiệu {${do_.a.join(', ')}} [lưới chạy trọn: ${do_.tongKet ? 'có' : 'KHÔNG'}]`);
  k.don();
  ket('E2');
} else if (chan === 'cay') {
  const ev = (muc) => evalsCua({ evals: [{ id: 'E1', muc: [muc] }] });
  const note = (out) => (out.match(/NOTE \[feat\]: bộ lọc paths không áp \(([^)]*)\)/) || [])[1] || null;
  const stale = (out) => /VIOLATION \[feat\]: evidence is stale/.test(out);
  const chayXong = (out) => /pre-merge-check: (clean|\d+ violation)/.test(out) && /\[feat\]/.test(out);
  // (a) thư mục CHƯA theo dõi trùng tên mục trần.
  const khoA = () => { const k = dungKho({ staleScope: 'paths', hoSo: [{ slug: 'feat', evalsYaml: ev('vendor') }], tep: ['src/a.js'] });
    mkdirSync(path.join(k.AR, 'vendor'), { recursive: true }); writeFileSync(path.join(k.AR, 'vendor', 'x.js'), 'v\n'); k.doi(['src/a.js']); return k; };
  { const k = khoA(); const r = chayPremerge(KIT, k);
    ok(note(r.out) === 'paths-khong-tro-toi-tep:E1:vendor' && stale(r.out), `(a) thư mục chưa theo dõi «vendor» → không trỏ tới tệp, hồ sơ hoá cũ theo luật cũ (NOTE: ${note(r.out)})`);
    k.git('add', '-A'); k.git('commit', '-qm', 'theo doi vendor');
    const r2 = chayPremerge(KIT, k);
    ok(note(r2.out) === null && /bỏ qua theo paths: 1 tệp/.test(r2.out) && !stale(r2.out), '(a) đối chứng dương: thư mục đã theo dõi → nhận như vendor/**, tệp ngoài bị bỏ qua có NOTE');
    k.don(); }
  { const k = khoA();
    const s = banSao([{ tep: 'scripts/pre-merge-check.sh', tu: 'git -C "$ROOT" ls-files -z', thanh: '(cd "$ROOT" && find . -type f -not -path "./.git/*" | sed "s|^\\./||" | tr "\\n" "\\0")' }]);
    const r = chayPremerge(s, k);
    ok(chayXong(r.out) && !stale(r.out), `(a) chiều đỏ «cây đọc từ đĩa»: bản sao đọc đĩa nhận «vendor», hồ sơ không hoá cũ [lưới chạy tới hồ sơ: ${chayXong(r.out) ? 'có' : 'KHÔNG'}]`);
    k.don(); }
  // (b) diff xoá đúng tệp mục khai.
  { const k = dungKho({ staleScope: 'paths', hoSo: [{ slug: 'feat', evalsYaml: ev('src/old.js') }], tep: ['src/a.js', 'src/old.js'] });
    k.xoa(['src/old.js']); const r = chayPremerge(KIT, k);
    ok(note(r.out) === 'paths-khong-tro-toi-tep:E1:src/old.js' && stale(r.out) && /\n {4}src\/old\.js/.test(r.out), `(b) tệp mục khai bị xoá trong diff → không trỏ tới tệp, VIOLATION liệt src/old.js (NOTE: ${note(r.out)})`);
    k.don(); }
  // (c) không truyền cây.
  { const core = nap(KIT); const r = core.staleByPaths(['src/a.js'], ev('src/**'));
    ok(r.apply === false && r.reason === 'thieu-cay', `(c) không truyền cây → thieu-cay (được ${r.reason})`); }
  // (d) git ls-files lỗi trong lưới trước-merge.
  { const k = dungKho({ staleScope: 'paths', hoSo: [{ slug: 'feat', evalsYaml: ev('src/**') }], tep: ['src/a.js'] }); k.doi(['src/a.js']);
    const s = banSao([{ tep: 'scripts/pre-merge-check.sh', tu: 'git -C "$ROOT" ls-files -z', thanh: 'false' }]);
    const r = chayPremerge(s, k);
    ok(chayXong(r.out) && note(r.out) === 'thieu-cay' && stale(r.out), `(d) ls-files lỗi → NOTE «không áp (thieu-cay)», VIOLATION luật cũ giữ nguyên (NOTE: ${note(r.out)})`);
    k.don(); }
  ket('E4');
} else {
  console.log(`chan-lib: chân lạ ${chan}`); process.exit(3);
}
