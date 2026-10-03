// E3 (AC-3) dấu lượt đỏ · E7 (AC-7) mã thoát không đổi. Làn THẬT của cây đang kiểm.
import { readFileSync, existsSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { dungKho, chayLan, banSao, bao, KIT } from './kho-mau.mjs';
import { banBase } from './ban-base.mjs';
const chan = process.argv[2];
const HAI = [{ slug: 'feat', evals: [{ id: 'E1', key: 'rang_a' }] }, { slug: 'feat2', evals: [{ id: 'E1', key: 'rang_b' }] }];
// Ba nguyên nhân đỏ — mỗi lệnh đỏ in một DẤU riêng để chứng đường nhật ký trỏ đúng tệp.
const CA = {
  suite: { suites: ['echo DAU-SUITE-91; exit 4'], scripts: { rang_a: 'true', rang_b: 'true' }, dau: ['DAU-SUITE-91'] },
  eval: { suites: ['true'], scripts: { rang_a: 'echo DAU-EVAL-55; exit 1', rang_b: 'true' }, dau: ['DAU-EVAL-55'], ky: { feat: 2 } },
  cham: { suites: ['mkdir -p _acceptance/feat2/evidence && echo x > _acceptance/feat2/evidence/cham.txt'], scripts: { rang_a: 'true', rang_b: 'true' }, dau: [] },
};
const dung = (ca) => dungKho({ slugs: HAI.map(s => ({ slug: s.slug, evals: s.evals.map(e => ({ ...e, expected_exit: CA[ca].ky && CA[ca].ky[s.slug] })) })), suites: CA[ca].suites, scripts: CA[ca].scripts });
const dongMoi = (k, slug, truoc) => k.doc(`_acceptance/${slug}/run-log.jsonl`).slice(truoc[slug].length).split('\n').filter(Boolean).map(l => JSON.parse(l));

if (chan === 'dau-do') {
  const { ok, ket } = bao('E3');
  const KHOA = ['ts', 'kind', 'lan_id', 'sha', 'suites_exit', 'evals_exit', 'lenh_do', 'cham', 'wall_s', 'so_lenh', 'tai'];
  const chay = (engine, ca) => {
    const k = dung(ca);
    const truoc = Object.fromEntries(HAI.map(s => [s.slug, k.doc(`_acceptance/${s.slug}/run-log.jsonl`)]));
    const rep = Object.fromEntries(HAI.map(s => [s.slug, k.doc(`_acceptance/${s.slug}/evidence-report.md`)]));
    const r = chayLan(engine, k, HAI.map(s => s.slug), ['--reason', 'do', '--write']);
    return { k, r, truoc, rep };
  };
  for (const ca of ['suite', 'eval', 'cham']) {
    const { k, r, truoc, rep } = chay(KIT, ca);
    ok(r.status === 1, `E3 ${ca}: làn đỏ thoát 1 (được ${r.status})`);
    for (const s of HAI) {
      const moi = dongMoi(k, s.slug, truoc);
      const dau = moi.filter(o => o.kind === 'repin-do');
      ok(moi.length === 1 && dau.length === 1, `E3 ${ca}/${s.slug}: đúng MỘT dòng mới và là repin-do (được ${moi.map(o => o.kind)})`);
      ok(!moi.some(o => o.kind === 'repin'), `E3 ${ca}/${s.slug}: KHÔNG dòng pin mới`);
      ok(k.doc(`_acceptance/${s.slug}/evidence-report.md`) === rep[s.slug], `E3 ${ca}/${s.slug}: evidence-report.md bằng hệt từng byte`);
      if (!dau.length) continue;
      const d = dau[0];
      ok(KHOA.every(x => x in d), `E3 ${ca}/${s.slug}: đủ khoá ${KHOA.filter(x => !(x in d)).join(',') || ''}`);
      ok(!('run_id' in d), `E3 ${ca}/${s.slug}: dấu đỏ KHÔNG mang khoá run_id (AC-8)`);
      for (const ld of d.lenh_do || []) {
        const p = ld.log && path.join(k.R, ld.log);
        const mo = p && existsSync(p) ? readFileSync(p, 'utf8') : null;
        ok(mo !== null && CA[ca].dau.some(x => mo.includes(x)), `E3 ${ca}/${s.slug}: nhật ký «${ld.log}» mở từ gốc kho và chứa dấu riêng của lệnh đỏ`);
      }
      if (ca !== 'cham') ok((d.lenh_do || []).length === 1, `E3 ${ca}/${s.slug}: một lệnh đỏ trong lenh_do (được ${(d.lenh_do || []).length})`);
      if (ca === 'cham') ok((d.cham || []).length > 0 && d.cham.every(c => c.log === null && c.ly_do === 'cham-ho-so') && (d.lenh_do || []).length === 0, `E3 cham/${s.slug}: ca chạm mang log null + ly_do cham-ho-so, không lệnh đỏ`);
    }
    k.don();
  }
  // QUAN HỆ lệnh ↔ nhật ký (lượt chấm 2, t7): MỘT lượt, BA lệnh đỏ in ba dấu khác nhau. Mỗi mục
  // lenh_do phải trỏ nhật ký chứa dấu của CHÍNH lệnh ấy và KHÔNG chứa dấu hai lệnh kia, ở cả hai slug.
  const NHIEU = { suites: ['echo DAU-S1-aa; exit 4', 'echo DAU-S2-bb; exit 5'], scripts: { rang_a: 'echo DAU-EV-cc; exit 1', rang_b: 'true' } };
  const dauCua = (cmd) => (String(cmd).match(/DAU-[A-Z0-9]+-[a-z]+/) || [])[0];
  const quanHe = (engine) => {
    const k = dungKho({ slugs: HAI, suites: NHIEU.suites, scripts: NHIEU.scripts });
    const truoc = Object.fromEntries(HAI.map(s => [s.slug, k.doc(`_acceptance/${s.slug}/run-log.jsonl`)]));
    const r = chayLan(engine, k, HAI.map(s => s.slug), ['--reason', 'do', '--write']);
    const sai = [];
    let soMuc = 0;
    for (const s of HAI) for (const d of dongMoi(k, s.slug, truoc).filter(o => o.kind === 'repin-do')) for (const ld of d.lenh_do || []) {
      soMuc++;
      const cua = dauCua(ld.cmd); const p = ld.log && path.join(k.R, ld.log);
      const noi = p && existsSync(p) ? readFileSync(p, 'utf8') : '';
      const khac = ['DAU-S1-aa', 'DAU-S2-bb', 'DAU-EV-cc'].filter(x => x !== cua && noi.includes(x));
      if (!cua || !noi.includes(cua) || khac.length) sai.push(`${s.slug}: ${ld.cmd} → ${ld.log} (thiếu dấu mình: ${!noi.includes(cua)}, lẫn: ${khac})`);
    }
    k.don(); return { r, sai, soMuc };
  };
  const qh = quanHe(KIT);
  ok(qh.r.status === 1 && qh.soMuc === 6 && qh.sai.length === 0, `E3 quan hệ: 3 lệnh đỏ × 2 slug = 6 mục, mỗi nhật ký đúng lệnh của nó (được ${qh.soMuc} mục, sai ${JSON.stringify(qh.sai)})`);
  { const sao = banSao([{ tep: 'feature-loop/scripts/repin-lane.mjs', tu: 'const lg = nhatKy.has(cmd) ? nhatKy.get(cmd) : null;', thanh: 'const lg = [...nhatKy.values()][0] ?? null;' }]);
    const qs = quanHe(sao);
    ok(qs.sai.length > 0, `E3 chiều đỏ: bản sao trỏ mọi lệnh về nhật ký đầu → thước thấy «nhật ký gán nhầm lệnh» (${qs.sai.length} mục sai)`);
    rmSync(sao, { recursive: true, force: true }); }
  // Ba chiều đỏ trên cùng ca «suite»
  const LANE = 'feature-loop/scripts/repin-lane.mjs';
  const M = [
    { pin: 'đỏ không vết', sua: [{ tep: LANE, tu: '  if (flags.write) {\n    const lenhDo = [];', thanh: '  if (false) {\n    const lenhDo = [];' }], do: (k, t) => HAI.every(s => dongMoi(k, s.slug, t).length === 0) },
    { pin: 'thiếu dấu ở slug', sua: [{ tep: LANE, tu: '    for (const s of perSlug) {\n      // Mã lượt dưới', thanh: '    for (const s of perSlug.slice(0, 1)) {\n      // Mã lượt dưới' }], do: (k, t) => dongMoi(k, 'feat2', t).length === 0 },
    { pin: 'dấu trỏ chỗ trống', sua: [{ tep: LANE, tu: 'nhatKy.set(cmd, rel);', thanh: "nhatKy.set(cmd, rel.split('/').slice(2).join('/'));" }], do: (k, t) => HAI.some(s => dongMoi(k, s.slug, t).some(o => (o.lenh_do || []).some(ld => !ld.log || !existsSync(path.join(k.R, ld.log))))) },
  ];
  for (const m of M) {
    const sao = banSao(m.sua);
    const { k, truoc } = chay(sao, 'suite');
    ok(m.do(k, truoc), `E3 chiều đỏ: bản sao «${m.pin}» → thước thấy`);
    k.don(); rmSync(sao, { recursive: true, force: true });
  }
  ket();
} else if (chan === 'do-khong-thanh-bang-chung') {
  // E8 (AC-8) — mã lượt của làn ĐỎ không bao giờ thành bằng chứng eval. Quan hệ báo cáo ↔ recheck,
  // bốn báo cáo trên CÙNG kho; thông điệp ghim; bên viết THẬT sinh dòng repin-do.
  const { ok, ket } = bao('E8');
  const RECHECK = path.join(KIT, 'scripts', 'recheck-evidence.cjs');
  const thu = (engine) => {
    const k = dungKho({ slugs: [{ slug: 'feat', evals: [{ id: 'E1', key: 'rang_a' }] }], suites: ['echo do; exit 4'], scripts: { rang_a: 'true' } });
    const truoc = k.doc('_acceptance/feat/run-log.jsonl');
    chayLan(engine, k, ['feat'], ['--reason', 'do', '--write']);
    const moi = k.doc('_acceptance/feat/run-log.jsonl').slice(truoc.length).split('\n').filter(Boolean).map(l => JSON.parse(l));
    const dau = moi.find(o => o.kind === 'repin-do') || {};
    const maDo = dau.lan_id || dau.run_id;
    const pin = truoc.split('\n').filter(Boolean).map(l => JSON.parse(l)).filter(o => o.kind === 'repin').pop().run_id;
    const REP = path.join(k.R, '_acceptance/feat/evidence-report.md'); const goc = readFileSync(REP, 'utf8');
    const rc = (id) => { writeFileSync(REP, id ? goc.replace('run_id: r1-feat', `run_id: ${id}`) : goc); const r = spawnSync(process.execPath, [RECHECK, REP], { encoding: 'utf8' }); return { st: r.status, out: r.stdout + r.stderr }; };
    const o = { dau, maDo, goc: rc(null), doRc: rc(maDo), pinRc: rc(pin), biaRc: rc('bia-77') };
    writeFileSync(REP, goc); k.don(); return o;
  };
  const a = thu(KIT);
  ok(a.maDo && !('run_id' in a.dau), `E8 dòng repin-do mang mã lượt dưới lan_id, KHÔNG khoá run_id (${JSON.stringify(Object.keys(a.dau))})`);
  ok(a.goc.st === 0, `E8 đối chứng: báo cáo gốc (mã verify thật) → recheck xanh (${a.goc.st})`);
  ok(a.doRc.st !== 0 && /not found in run-log\.jsonl/.test(a.doRc.out), `E8 trích mã lượt ĐỎ → recheck CHẶN, «not found» (mã ${a.doRc.st})`);
  ok(a.pinRc.st !== 0 && /cites re-pin lane run_id/.test(a.pinRc.out), `E8 đối chứng: trích mã pin xanh → chặn «cites re-pin lane run_id» (${a.pinRc.st})`);
  ok(a.biaRc.st !== 0 && /not found in run-log\.jsonl/.test(a.biaRc.out), `E8 đối chứng: trích mã bịa → chặn «not found» (${a.biaRc.st})`);
  const sao = banSao([{ tep: 'feature-loop/scripts/repin-lane.mjs', tu: "kind: 'repin-do', lan_id: runId,", thanh: "kind: 'repin-do', run_id: runId," }]);
  const b = thu(sao);
  ok(b.doRc.st === 0, `E8 chiều đỏ: bản sao ghi mã lượt đỏ dưới run_id → báo cáo trích nó QUA recheck — «mã lượt đỏ thành bằng chứng» được thước thấy (mã ${b.doRc.st})`);
  rmSync(sao, { recursive: true, force: true });
  ket();
} else if (chan === 'nghia-khong-doi') {
  const { ok, ket } = bao('E7');
  const MA = [
    { ten: 'xanh', ma: 0, lam: () => dungKho({ slugs: HAI, suites: ['true'], scripts: { rang_a: 'true', rang_b: 'true' } }) },
    { ten: 'suite đỏ', ma: 1, lam: () => dung('suite') },
    { ten: 'eval đỏ', ma: 1, lam: () => dung('eval') },
    { ten: 'chạm hồ sơ đã thông cổng', ma: 1, lam: () => dung('cham') },
    { ten: 'thiếu evals.yaml', ma: 2, lam: () => { const k = dungKho({ slugs: HAI, suites: ['true'], scripts: { rang_a: 'true', rang_b: 'true' } }); rmSync(path.join(k.R, '_acceptance/feat2/evals.yaml')); k.git('add', '-A'); k.git('commit', '-qm', 'xoa evals'); return k; } },
  ];
  ok(MA.length === 5, 'E7 đúng 5 ô (số ô lệch)');
  const BASE = banBase();
  ok(['scripts/pre-merge-check.sh', 'lib/evidence-core.cjs', 'feature-loop/scripts/repin-lane.mjs'].every(f => existsSync(path.join(BASE, f))), 'E7 bản base có trọn scripts + lib + feature-loop (không lai bộ máy mới)');
  const sao = banSao([{ tep: 'feature-loop/scripts/repin-lane.mjs', tu: 'không ký mù.${veCham}`);\n  process.exit(1);', thanh: 'không ký mù.${veCham}`);\n  process.exit(0);' }]);
  let thayDoi = false;
  for (const c of MA) {
    const kA = c.lam(), kB = c.lam(), kC = c.lam();
    const a = chayLan(KIT, kA, HAI.map(s => s.slug), ['--reason', 'x', '--write']).status;
    const b = chayLan(BASE, kB, HAI.map(s => s.slug), ['--reason', 'x', '--write'], {}, BASE).status;
    const m = chayLan(sao, kC, HAI.map(s => s.slug), ['--reason', 'x', '--write']).status;
    ok(a === b && a === c.ma, `E7 ${c.ten}: mã thoát cây đang kiểm ${a} = bản base ${b} = ghim sẵn ${c.ma}`);
    if (m !== c.ma) thayDoi = true;
    kA.don(); kB.don(); kC.don();
  }
  ok(thayDoi, 'E7 chiều đỏ: bản sao cho làn có dấu đỏ thoát 0 → thước thấy «đổi nghĩa đỏ»');
  rmSync(BASE, { recursive: true, force: true }); rmSync(sao, { recursive: true, force: true });
  ket();
}
