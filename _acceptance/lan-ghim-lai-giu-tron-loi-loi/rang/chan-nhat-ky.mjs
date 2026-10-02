// E1 (AC-1) nhật ký trọn · E2 (AC-2) lệnh xanh không sinh tệp. Làn THẬT của cây đang kiểm.
import { dungKho, chayLan, banSao, bao, KIT } from './kho-mau.mjs';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
const chan = process.argv[2];
const RUNCMD_GHI = "fs.writeFileSync(abs, dau + 'stdout ===\\n' + out + '\\n=== stderr ===\\n' + err);";

if (chan === 'nhat-ky-tron') {
  const { ok, ket } = bao('E1');
  // 200 dòng đánh số, chẵn ra stdout, lẻ ra stderr; rồi thoát 1.
  const IN200 = `node -e 'for(let i=1;i<=200;i++){require("fs").writeSync(i%2?2:1,"dong-"+i+"\\n")}process.exit(1)'`;
  const kho = dungKho({ slugs: [{ slug: 'feat', evals: [{ id: 'E1', key: 'rang_ok' }] }], suites: [IN200], scripts: { rang_ok: 'true' } });
  const kiem = (engine, nhan) => {
    const r = chayLan(engine, kho, ['feat'], []);
    const files = kho.runs();
    const tep = files.filter(f => f.endsWith('.log'));
    const noi = tep.length === 1 ? readFileSync(path.join(kho.R, tep[0]), 'utf8') : '';
    const thieu = []; for (let i = 1; i <= 200; i++) if (!new RegExp(`^dong-${i}$`, 'm').test(noi)) thieu.push(i);
    return { r, tep, thieu };
  };
  const a = kiem(KIT, 'lành');
  ok(a.r.status === 1, `E1 làn đỏ thoát 1 (được ${a.r.status})`);
  ok(a.tep.length === 1 && /^\.acceptance-runs\/feat\/repin-[^/]+\/[^/]+\.log$/.test(a.tep[0]), `E1 đúng một tệp dưới .acceptance-runs/feat/repin-<run_id>/ (được ${JSON.stringify(a.tep)})`);
  ok(a.thieu.length === 0, `E1 tệp chứa đủ 200 dòng đánh số (thiếu ${a.thieu.length}: ${a.thieu.slice(0, 5)})`);
  ok(a.tep[0] && a.r.stderr.includes(a.tep[0]), 'E1 stderr làn in đường dẫn tệp nhật ký');
  const duoi = (a.r.stderr.match(/^    dong-\d+$/gm) || []).length;
  ok(duoi === 30, `E1 stderr vẫn in đúng 30 dòng đuôi như 2.20 (được ${duoi})`);
  // > 1 MiB, dấu riêng ở DÒNG ĐẦU
  const kho2 = dungKho({ slugs: [{ slug: 'feat', evals: [{ id: 'E1', key: 'rang_ok' }] }], suites: [`node -e 'const fs=require("fs");fs.writeSync(1,"DAU-DONG-DAU-7f3a\\n");for(let i=0;i<30000;i++)fs.writeSync(1,"x".repeat(40)+" "+i+"\\n");process.exit(1)'`], scripts: { rang_ok: 'true' } });
  const r2 = chayLan(KIT, kho2, ['feat'], []);
  const t2 = kho2.runs().filter(f => f.endsWith('.log'));
  const n2 = t2.length === 1 ? readFileSync(path.join(kho2.R, t2[0]), 'utf8') : '';
  ok(r2.status === 1 && n2.length > 1024 * 1024 && n2.includes('DAU-DONG-DAU-7f3a'), `E1 đầu ra > 1 MiB: dấu dòng đầu có trong tệp (cỡ ${n2.length})`);
  kho2.don();
  // chiều đỏ: bản sao chỉ ghi 30 dòng cuối vào tệp
  kho.git('clean', '-fdxq');
  const sao = banSao([{ tep: 'feature-loop/scripts/repin-lane.mjs', tu: RUNCMD_GHI, thanh: "fs.writeFileSync(abs, (out + '\\n' + err).split('\\n').filter(Boolean).slice(-30).join('\\n'));" }]);
  const b = kiem(sao, 'sao');
  ok(b.thieu.length > 0, `E1 chiều đỏ: bản sao cắt 30 dòng → thước thấy «nhật ký bị cắt» (thiếu ${b.thieu.length})`);
  if (!(b.thieu.length > 0)) console.log('  nhật ký bị cắt — KHÔNG được bắt');
  kho.don(); ket();
} else if (chan === 'xanh-im') {
  const { ok, ket } = bao('E2');
  const kho = dungKho({ slugs: [{ slug: 'feat', evals: [{ id: 'E1', key: 'rang_ok' }] }], suites: ['echo xanh', 'echo xanh2'], scripts: { rang_ok: 'echo eval-xanh' } });
  const truoc = kho.runs();
  const logTruoc = kho.doc('_acceptance/feat/run-log.jsonl');
  const r1 = chayLan(KIT, kho, ['feat'], []);
  const r2 = chayLan(KIT, kho, ['feat'], ['--write', '--reason', 'xanh']);
  ok(r1.status === 0 && r2.status === 0, `E2 làn xanh thoát 0 cả hai lượt (${r1.status}, ${r2.status})`);
  ok(JSON.stringify(kho.runs()) === JSON.stringify(truoc) && truoc.length === 0, `E2 KHÔNG tạo mục nào dưới .acceptance-runs/ (được ${JSON.stringify(kho.runs())})`);
  ok(!/"kind":"repin-do"/.test(kho.doc('_acceptance/feat/run-log.jsonl')), 'E2 không dòng repin-do nào ở làn xanh');
  // đối chứng dương cùng fixture: một lệnh đỏ → có tệp (ca đếm sống)
  kho.git('checkout', '-q', '--', '.'); 
  const kho3 = dungKho({ slugs: [{ slug: 'feat', evals: [{ id: 'E1', key: 'rang_ok' }] }], suites: ['echo xanh', 'echo do; exit 3'], scripts: { rang_ok: 'echo eval-xanh' } });
  chayLan(KIT, kho3, ['feat'], []);
  ok(kho3.runs().length === 1, `E2 đối chứng dương: một lệnh đỏ → đúng một tệp (được ${kho3.runs().length})`);
  kho3.don();
  // chiều đỏ: bản sao ghi nhật ký cho MỌI lệnh
  const sao = banSao([{ tep: 'feature-loop/scripts/repin-lane.mjs', tu: '  if (exit !== 0) { // NHAT-KY-KHI-DO', thanh: '  if (true) { // NHAT-KY-KHI-DO' }]);
  const kho4 = dungKho({ slugs: [{ slug: 'feat', evals: [{ id: 'E1', key: 'rang_ok' }] }], suites: ['echo xanh'], scripts: { rang_ok: 'echo eval-xanh' } });
  chayLan(sao, kho4, ['feat'], []);
  ok(kho4.runs().length > 0, `E2 chiều đỏ: bản sao ghi mọi lệnh → thước thấy «xanh sinh tệp» (${kho4.runs().length} tệp)`);
  kho4.don(); kho.don(); ket();
}
