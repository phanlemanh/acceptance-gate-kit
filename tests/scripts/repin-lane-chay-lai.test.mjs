// repin-lane-chay-lai.test.mjs — ca bền của hồ sơ gia-lan-ghim-lai cho Đ4 (AC-1): chạy lại lệnh đỏ
// đúng một lần, một mình, gọi tên ca chập chờn; không chạy lại eval model thật.
//   GG_CASES=AC1-suite-chap-chon node tests/scripts/repin-lane-chay-lai.test.mjs
import path from 'node:path';
import { existsSync } from 'node:fs';
import { mkKho, boKiem, ok, lenhChapChon, ROOT } from './gia-lan-fixture.mjs';

const lib = (f) => import(path.join(ROOT, 'feature-loop', 'scripts', 'lib', f));
const { coChayLai, BANG_CHAN_TRI, rutTenCa } = await lib('chay-lai.mjs');

const ALL = ['AC1-bang-chan-tri', 'AC1-rut-ten-ca', 'AC1-suite-chap-chon', 'AC1-eval-chap-chon', 'AC1-do-hai-lan',
  'AC1-model-khong-lai', 'AC1-model-dung-chung', 'AC1-model-dung-chung-ci', 'AC1-model-dung-chung-song-song',
  'AC1-model-dung-chung-song-song-ci', 'AC1-khoa-vang', 'AC1-sau-song-song', 'AC1-khoa-sai', 'AC1-gioi-han-da-khai'];
const { ca, ket } = boKiem(ALL);
const pinCuoi = (k) => k.docLog().filter(l => l.kind === 'repin').pop();
const dauDo = (k) => k.docLog().filter(l => l.kind === 'repin-do').pop();

await ca('AC1-bang-chan-tri', 'hàm quyết chạy lại đúng ĐỦ 7 hàng bảng chân trị viết trước', async () => {
  ok(BANG_CHAN_TRI.length === 7, `số ô lệch: bảng có ${BANG_CHAN_TRI.length} hàng, hứa 7`);
  BANG_CHAN_TRI.forEach((h, i) => ok(coChayLai(h.vao).chay === h.ra, `hàng ${i + 1}: ${JSON.stringify(h.vao)} → mong ${h.ra}`));
});
await ca('AC1-rut-ten-ca', 'rút tên ca theo năm khuôn; rỗng → «không rút được tên ca»; tối đa 10', async () => {
  const mau = [
    ['(fail) nang-luc: khong [5.00ms]', 'nang-luc: khong'],
    ['  ✗ app-rieng chạy cạnh apps/agent', 'app-rieng chạy cạnh apps/agent'],
    [' × tai-lieu-khong-ro', 'tai-lieu-khong-ro'],
    ['  ✘  3 [chromium] › a.spec.ts:12:1 › ten ca (5.1s)', '[chromium] › a.spec.ts:12:1 › ten ca'],
    ['not ok 4 - nguoi-huy', 'nguoi-huy'],
  ];
  for (const [dong, ten] of mau) { const r = rutTenCa(`dòng rác\n${dong}\nrác`); ok(r.length === 1 && r[0] === ten, `«${dong}» → ${JSON.stringify(r)}, mong «${ten}»`); }
  ok(JSON.stringify(rutTenCa('')) === '["không rút được tên ca"]', 'rỗng phải nói thẳng');
  ok(rutTenCa(Array.from({ length: 15 }, (_, i) => `not ok ${i} - c${i}`).join('\n')).length === 10, 'không cắt ở 10');
});

await ca('AC1-suite-chap-chon', 'suite đỏ lần đầu, đạt lần hai → làn xanh, chap_chon gọi tên ca', async () => {
  const k = mkKho({ suiteCmd: lenhChapChon('dem.txt', 'app-rieng'), config: '  repin_retry: 1\n' });
  const r = k.lane(['--write']);
  ok(r.status === 0, `mã ${r.status}\n${r.stderr}`);
  ok(k.docDau('dem.txt').trim() === '2', `số lần chạy ${k.docDau('dem.txt').trim()}`);
  const c = (pinCuoi(k).chap_chon || [])[0];
  ok(c, 'ghim: chập chờn im — dòng repin không có chap_chon');
  ok(c.nhan === 'suite 1/1' && c.lan_dau === 1 && c.ca.includes('app-rieng'), `chap_chon ${JSON.stringify(c)}`);
  ok(c.log && existsSync(path.join(k.root, c.log)), `nhật ký lần đỏ vắng: ${c.log}`);
  ok(/chập chờn \(đỏ lần đầu, đạt khi chạy lại\): suite 1\/1/.test(k.docReport()), 'ghim: chập chờn im — section thiếu hậu tố');
});
await ca('AC1-eval-chap-chon', 'eval đỏ lần đầu, đạt lần hai → xanh, nhãn «feat E1»', async () => {
  const k = mkKho({ evals: [{ id: 'E1', cmd: 'rang_e1', body: lenhChapChon('dem.txt') + '\n' }], config: '  repin_retry: 1\n' });
  const r = k.lane(['--write']);
  ok(r.status === 0, `mã ${r.status}\n${r.stderr}`);
  const c = (pinCuoi(k).chap_chon || [])[0];
  ok(c && c.nhan === 'feat E1', `ghim: chập chờn im — ${JSON.stringify(c)}`);
  ok(pinCuoi(k).evals_exit.E1 === 0, 'evals_exit.E1 không phải 0');
});
await ca('AC1-do-hai-lan', 'đỏ cả hai lần → làn đỏ, hai nhật ký, lan_thu_lai', async () => {
  const k = mkKho({ suite: 'echo "(fail) luon-do"\nexit 1\n', config: '  repin_retry: 1\n' });
  const r = k.lane(['--write']);
  ok(r.status === 1, `ghim: lần hai đỏ vẫn tính đạt — mã ${r.status}`);
  ok((r.stderr.match(/nhật ký trọn:/g) || []).length === 2, `số nhật ký ${(r.stderr.match(/nhật ký trọn:/g) || []).length}`);
  const d = dauDo(k);
  ok(d && d.lenh_do[0].lan_thu_lai === 1, `lenh_do ${JSON.stringify(d && d.lenh_do)}`);
  ok(d.lenh_do[0].log && d.lenh_do[0].log_lan_dau && d.lenh_do[0].log !== d.lenh_do[0].log_lan_dau, 'thiếu nhật ký một trong hai lần');
});
await ca('AC1-model-khong-lai', 'eval model thật đỏ lần đầu → KHÔNG chạy lại', async () => {
  const k = mkKho({ evals: [{ id: 'E1', cmd: 'rang_e1', body: lenhChapChon('dem.txt') + '\n' }], config: '  repin_retry: 1\n  model_evals: [feat/E1]\n' });
  const r = k.lane([]);
  ok(k.docDau('dem.txt').trim() === '1', `ghim: chạy lại eval model thật — chạy ${k.docDau('dem.txt').trim()} lần`);
  ok(r.status === 1, `mã ${r.status}`);
});
// Lệnh DÙNG CHUNG với eval model thật — ma trận ĐỦ hai trục gặp lệnh (S4 lượt 1 sót ô nối đuôi, lượt 2 sót
// ô env CI): nhánh suite {nối đuôi, song song} × env suite {full, CI}. Suite và E1 (model thật) cùng NGUYÊN
// VĂN một lệnh, suite chạy trước nên làn gặp lệnh lần đầu với nhãn suite. Lời hứa AC-1: «lệnh dùng chung với
// một eval model thật cũng không» chạy lại; AC-4: mọi lần lệnh ấy chạy đều được đếm là gọi model.
// Env CI: suite và E1 là HAI phép đo (Đ3) nên E1 vẫn chạy riêng một lần — tổng 2 lần, cả hai được đếm.
async function modelDungChung({ songSong, ci }) {
  const cmd = 'sh rang_e1.sh';
  const config = '  repin_retry: 1\n  model_evals: [feat/E1]\n' + (songSong ? '  repin_parallel_suites: true\n' : '') + (ci ? '  repin_ci_blank_env: [K]\n' : '');
  const k = mkKho({ suiteCmd: cmd, evals: [{ id: 'E1', cmd: 'rang_e1', body: lenhChapChon('dem.txt') + '\n' }], config });
  const r = k.lane([]);
  const mong = ci ? 2 : 1;
  ok(k.docDau('dem.txt').trim() === String(mong), `ghim: chạy lại eval model thật — lệnh dùng chung chạy ${k.docDau('dem.txt').trim()} lần, mong ${mong}`);
  ok(r.status === 1, `mã ${r.status}`);
  const tk = (r.stderr.trim().split('\n').pop());
  ok(new RegExp(`eval model thật: gọi ${mong},`).test(tk), `ghim: đếm model sai — ${tk}`);
}
await ca('AC1-model-dung-chung', 'lệnh dùng chung với eval model thật — suite nối đuôi, env full', () => modelDungChung({ songSong: false, ci: false }));
await ca('AC1-model-dung-chung-ci', 'lệnh dùng chung với eval model thật — suite nối đuôi, env CI', () => modelDungChung({ songSong: false, ci: true }));
await ca('AC1-model-dung-chung-song-song', 'lệnh dùng chung với eval model thật — suite song song, env full', () => modelDungChung({ songSong: true, ci: false }));
await ca('AC1-model-dung-chung-song-song-ci', 'lệnh dùng chung với eval model thật — suite song song, env CI', () => modelDungChung({ songSong: true, ci: true }));
await ca('AC1-khoa-vang', 'khoá vắng → đỏ ngay, chạy đúng một lần (hành vi cũ)', async () => {
  const k = mkKho({ suiteCmd: lenhChapChon('dem.txt') });
  const r = k.lane([]);
  ok(r.status === 1, `mã ${r.status}`);
  ok(k.docDau('dem.txt').trim() === '1', `chạy ${k.docDau('dem.txt').trim()} lần`);
});
await ca('AC1-sau-song-song', 'suite song song bật → chạy lại bắt đầu SAU khi mọi suite song song xong', async () => {
  const s1 = `date +%s%N >> "$GG_DAU/bat-dau-1.txt"; ${lenhChapChon('dem.txt')}`;
  const s2 = 'sleep 2; date +%s%N > "$GG_DAU/xong-2.txt"; exit 0';
  const k = mkKho({ suiteCmd: s1, extraSuites: [{ key: 'suite2', cmd: s2 }], config: '  repin_parallel_suites: true\n  repin_retry: 1\n' });
  const r = k.lane([]);
  ok(r.status === 0, `mã ${r.status}\n${r.stderr}`);
  const batDau = k.docDau('bat-dau-1.txt').trim().split('\n').map(Number);
  const xong2 = Number(k.docDau('xong-2.txt').trim());
  ok(batDau.length === 2, `suite 1 chạy ${batDau.length} lần`);
  ok(batDau[1] > xong2, 'ghim: chạy lại dưới tải — lần chạy lại bắt đầu trước khi khối song song xong');
});
await ca('AC1-khoa-sai', 'repin_retry: 2 → thoát 2 gọi tên khoá và hai giá trị hợp lệ', async () => {
  const k = mkKho({ config: '  repin_retry: 2\n' });
  const r = k.lane([]);
  ok(r.status === 2 && /repin_retry/.test(r.stderr) && /0 \| 1/.test(r.stderr), `mã ${r.status}: ${r.stderr}`);
});
await ca('AC1-gioi-han-da-khai', 'eval khai expected_exit 2: lần đầu 1, lần hai 2 → đạt (cùng luật đạt kỳ vọng)', async () => {
  const body = 'n=$(cat "$GG_DAU/dem.txt" 2>/dev/null || echo 0); echo $((n+1)) > "$GG_DAU/dem.txt"; [ "$n" -ge 1 ] && exit 2; exit 1\n';
  const k = mkKho({ evals: [{ id: 'E1', cmd: 'rang_e1', body }], config: '  repin_retry: 1\n' });
  const ev = k.root + '/_acceptance/feat/evals.yaml';
  const { readFileSync, writeFileSync } = await import('node:fs');
  writeFileSync(ev, readFileSync(ev, 'utf8').replace('    expected: exit 0\n', '    expected: exit 2\n    expected_exit: 2\n'));
  k.git('add', '-A'); k.git('commit', '-qm', 'khai ma 2');
  const r = k.lane([]);
  ok(r.status === 0, `mã ${r.status}\n${r.stderr}`);
  ok(k.docDau('dem.txt').trim() === '2', `chạy ${k.docDau('dem.txt').trim()} lần`);
});

ket();
