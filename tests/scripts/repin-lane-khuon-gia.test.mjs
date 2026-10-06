// repin-lane-khuon-gia.test.mjs — ca bền của hồ sơ gia-lan-ghim-lai cho AC-6: khuôn REPIN-TEMPLATE của
// SKILL khớp thứ writer THẬT ghi (repin + repin-do, mọi khoá bật), SKILL nêu mã 4 và hai ly_do, và mỗi
// khoá trong khối LAN-KHOA có một dòng ở GUIDE §7.1. Kỳ vọng RÚT từ vật — rút rỗng là đỏ.
//   GG_CASES=AC6-khuon-writer node tests/scripts/repin-lane-khuon-gia.test.mjs
// Đường dẫn văn bản có thể đổi qua env (GG_SKILL, GG_GUIDE, GG_LAN_KHOA) để bộ răng chạy ca trên bản sao.
import fs from 'node:fs';
import path from 'node:path';
import { mkKho, boKiem, ok, lenhChapChon, ROOT } from './gia-lan-fixture.mjs';

const SKILL = process.env.GG_SKILL || path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const GUIDE = process.env.GG_GUIDE || path.join(ROOT, 'GUIDE.md');
const LAN_KHOA = process.env.GG_LAN_KHOA || path.join(ROOT, 'feature-loop', 'scripts', 'lib', 'lan-khoa.mjs');
const ALL = ['AC6-khuon-writer', 'AC6-skill-ma-4', 'AC6-guide-du-khoa', 'AC6-lan-khoa-rut'];
const { ca, ket } = boKiem(ALL);

function khoaKhuon(kind) {
  const m = fs.readFileSync(SKILL, 'utf8').match(/<!-- <<<REPIN-TEMPLATE -->\s*```\n([\s\S]*?)```\s*<!-- REPIN-TEMPLATE>>> -->/);
  ok(m, 'không thấy marker REPIN-TEMPLATE');
  const dong = m[1].split('\n').find(l => l.includes(`"kind":"${kind}"`));
  ok(dong, `khuôn không có dòng mẫu kind ${kind}`);
  return Object.keys(JSON.parse(dong.replace(/"<[^">]*>"/g, '"x"').replace(/<[^>]*>/g, 'x')));
}
// Thứ tự tương đối: mọi khoá writer có trong khuôn, theo đúng thứ tự xuất hiện trong khuôn.
function soKhuon(writer, khuon, ten) {
  const ngoai = writer.filter(k => !khuon.includes(k));
  ok(!ngoai.length, `ghim: khoá ngoài khuôn — ${ten} ghi ${ngoai.join(', ')}`);
  const vt = writer.map(k => khuon.indexOf(k));
  ok(vt.every((v, i) => i === 0 || v > vt[i - 1]), `thứ tự khoá ${ten} lệch khuôn: ${writer.join(',')} · khuôn ${khuon.join(',')}`);
}
function rutLanKhoa() {
  const m = fs.readFileSync(LAN_KHOA, 'utf8').match(/\/\/ <<<LAN-KHOA([\s\S]*?)\/\/ LAN-KHOA>>>/);
  const khoa = m ? [...m[1].matchAll(/khoa:\s*'([\w.]+)'/g)].map(x => x[1]) : [];
  ok(khoa.length, 'ghim: rút rỗng — khối LAN-KHOA không có khoá nào');
  return khoa;
}
const cfgDu = (extra = '') => `  repin_retry: 1\n  model_evals: [feat/E1]\n  repin_budget_min: 5\n  repin_cost_cmd: 'echo 1'\n  repin_ci_blank_env: [K]\n${extra}`;

await ca('AC6-khuon-writer', 'khoá dòng repin và repin-do của writer thật (mọi khoá bật) ⊆ khuôn, đúng thứ tự', async () => {
  const k = mkKho({ suiteCmd: lenhChapChon('dem.txt'), config: cfgDu() });
  const r = k.lane(['--write'], { env: { K: 'x' } });
  ok(r.status === 0, `làn xanh không chạy được: ${r.status}\n${r.stderr}`);
  const pin = k.docLog().filter(l => l.kind === 'repin').pop();
  ok(pin.chap_chon && pin.suites_env && pin.tong_ket, `fixture không bật đủ khoá: ${Object.keys(pin).join(',')}`);
  soKhuon(Object.keys(pin), khoaKhuon('repin'), 'repin');
  const k2 = mkKho({ suite: 'exit 1\n', config: cfgDu() });
  ok(k2.lane(['--write']).status === 1, 'làn đỏ không đỏ');
  const d = k2.docLog().filter(l => l.kind === 'repin-do').pop();
  soKhuon(Object.keys(d), khoaKhuon('repin-do'), 'repin-do (đỏ)');
  const k3 = mkKho({ suiteCmd: 'sleep 60', config: cfgDu() });
  ok(k3.lane(['--write', '--tran-phut', '0.1']).status === 4, 'làn vượt trần không thoát 4');
  soKhuon(Object.keys(k3.docLog().filter(l => l.kind === 'repin-do').pop()), khoaKhuon('repin-do'), 'repin-do (vượt trần)');
});
await ca('AC6-skill-ma-4', 'nghi thức re-pin của SKILL nêu mã thoát 4 và hai ly_do', async () => {
  const s = fs.readFileSync(SKILL, 'utf8');
  const i = s.indexOf('**Nghi thức re-pin'); const j = s.indexOf('## Sổ quyết định');
  ok(i >= 0 && j > i, 'không thấy đoạn nghi thức re-pin');
  const doan = s.slice(i, j);
  ok(/mã thoát 4\*\*/.test(doan), 'SKILL không nêu mã thoát 4');
  ok(doan.includes('"vuot-tran"') && doan.includes('"bi-ngat"'), 'SKILL thiếu một trong hai ly_do');
});
await ca('AC6-guide-du-khoa', 'mỗi khoá của khối LAN-KHOA có một dòng ở GUIDE §7.1', async () => {
  const g = fs.readFileSync(GUIDE, 'utf8');
  const i = g.indexOf('### 7.1');
  ok(i >= 0, 'không thấy GUIDE §7.1');
  // §7.1 kết ở tiêu đề cùng cấp hoặc cao hơn kế tiếp (### hoặc ##).
  const m = g.slice(i + 7).match(/\n#{2,3} /);
  const doan = g.slice(i, m ? i + 7 + m.index : g.length);
  for (const kh of rutLanKhoa()) {
    const ngan = kh.replace(/^feature_loop\./, '');
    ok(new RegExp(`^\\| \`${ngan}\` \\|`, 'm').test(doan), `ghim: khoá chưa khai ở GUIDE — ${ngan}`);
  }
});
await ca('AC6-lan-khoa-rut', 'khối LAN-KHOA rút đúng 5 khoá; giá trị sai ném lỗi gọi tên khoá', async () => {
  const khoa = rutLanKhoa();
  ok(khoa.length === 5, `số ô lệch: ${khoa.length} khoá, hứa 5`);
  const { docKhoa } = await import(LAN_KHOA);
  const { createRequire } = await import('node:module');
  const core = createRequire(import.meta.url)(path.join(ROOT, 'lib', 'evidence-core.cjs'));
  const nem = (cfg, re) => { try { docKhoa(`feature_loop:\n${cfg}`, core); } catch (e) { ok(re.test(e.message), `thông điệp ${e.message}`); return; } throw new Error(`không ném với ${cfg.trim()}`); };
  nem('  repin_retry: 2\n', /repin_retry.*0 \| 1/);
  nem('  repin_ci_blank_env: [1BAD]\n', /repin_ci_blank_env/);
  nem('  repin_budget_min: abc\n', /repin_budget_min/);
  nem('  model_evals: [khong-co-gach]\n', /model_evals/);
  const v = docKhoa('feature_loop:\n  suite_keys: [a]\n', core);
  ok(v.repin_retry === 0 && v.model_evals.size === 0 && v.repin_budget_min === null && v.repin_cost_cmd === null && v.repin_ci_blank_env.length === 0, `khoá vắng phải là mặc định tắt: ${JSON.stringify(v)}`);
});
ket();
