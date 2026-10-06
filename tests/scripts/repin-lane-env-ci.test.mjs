// repin-lane-env-ci.test.mjs — ca bền của hồ sơ gia-lan-ghim-lai cho Đ3 (AC-5): suite chạy với các
// khoá tuỳ chọn đặt RỖNG tường minh (giống CI), eval giữ env đầy đủ.
//   GG_CASES=AC5-do-o-ci node tests/scripts/repin-lane-env-ci.test.mjs
// Bộ nạp .env thật (`node --env-file`) — xoá biến thì nó điền lại từ .env, chỉ chuỗi rỗng mới thắng
// (đo 06/10, Bun 1.3.12 và Node --env-file cùng hành vi).
import { mkKho, boKiem, ok, lenhChapChon } from './gia-lan-fixture.mjs';

const ALL = ['AC5-do-o-ci', 'AC5-eval-rieng', 'AC5-xanh-ghi-env', 'AC5-chay-lai-cung-env', 'AC5-ten-sai', 'AC5-khoa-vang', 'AC5-bien-vang-env'];
const { ca, ket } = boKiem(ALL);
const DOC_K = `node --env-file=.env -e "process.exit(process.env.K ? 0 : 1)"`;
const ENV = { env: { K: 'x' } };
const files = { '.env': 'K=tu-file\n' };
const pinCuoi = (k) => k.docLog().filter(l => l.kind === 'repin').pop();
const dauDo = (k) => k.docLog().filter(l => l.kind === 'repin-do').pop();

await ca('AC5-do-o-ci', 'khoá [K] → suite đọc K rỗng (thắng .env) → làn đỏ, nhãn môi trường giống CI', async () => {
  const k = mkKho({ suiteCmd: DOC_K, files, config: '  repin_ci_blank_env: [K]\n' });
  const r = k.lane(['--write'], ENV);
  ok(r.status === 1, `ghim: xoá biến thay vì rỗng — suite không đỏ ở env CI (mã ${r.status})`);
  ok(/suite 1\/1: .* → exit 1 .*\(môi trường giống CI \(biến rỗng: K\)\)/.test(r.stderr), `dòng stderr thiếu nhãn:\n${r.stderr}`);
  ok(dauDo(k).lenh_do[0].moi_truong === 'ci', `lenh_do ${JSON.stringify(dauDo(k).lenh_do)}`);
});
await ca('AC5-eval-rieng', 'eval trùng NGUYÊN VĂN lệnh suite vẫn chạy riêng với env đầy đủ', async () => {
  const k = mkKho({ suiteCmd: DOC_K, files, config: '  repin_ci_blank_env: [K]\n', evals: [{ id: 'E1', cmd: 'rang_e1', sh: DOC_K }] });
  const r = k.lane([], ENV);
  ok(r.status === 1, `suite phải đỏ ở env CI (mã ${r.status})`);
  ok(/feat E1: .* → exit 0/.test(r.stderr), 'ghim: env CI tràn sang eval — eval không chạy xanh với env đầy đủ');
  ok(!/feat E1: \(đã chạy\)/.test(r.stderr), 'ghim: gộp lệnh khác env — eval mượn kết quả suite');
});
await ca('AC5-xanh-ghi-env', 'suite xanh ở env CI → dòng repin suites_env "ci" + hậu tố section', async () => {
  const k = mkKho({ files, config: '  repin_ci_blank_env: [K]\n' });
  const r = k.lane(['--write'], ENV);
  ok(r.status === 0, `mã ${r.status}\n${r.stderr}`);
  ok(pinCuoi(k).suites_env === 'ci', `suites_env ${pinCuoi(k).suites_env}`);
  ok(/suite chạy ở môi trường giống CI \(biến rỗng: K\)/.test(k.docReport()), 'section thiếu hậu tố');
});
await ca('AC5-chay-lai-cung-env', 'chạy lại (Đ4) dùng CÙNG env CI', async () => {
  const k = mkKho({ suiteCmd: DOC_K, files, config: '  repin_ci_blank_env: [K]\n  repin_retry: 1\n' });
  const r = k.lane(['--write'], ENV);
  ok(r.status === 1, `chạy lại không dùng env CI — mã ${r.status}`);
  const l = dauDo(k).lenh_do[0];
  ok(l.lan_thu_lai === 1 && l.moi_truong === 'ci', `lenh_do ${JSON.stringify(l)}`);
});
await ca('AC5-ten-sai', 'tên biến không hợp lệ → thoát 2', async () => {
  const k = mkKho({ config: '  repin_ci_blank_env: [1BAD]\n' });
  const r = k.lane([]);
  ok(r.status === 2 && /repin_ci_blank_env/.test(r.stderr), `mã ${r.status}: ${r.stderr}`);
});
await ca('AC5-khoa-vang', 'khoá vắng → cùng suite xanh với K từ env tiến trình, không suites_env (đối chứng)', async () => {
  const k = mkKho({ suiteCmd: DOC_K, files });
  const r = k.lane(['--write'], ENV);
  ok(r.status === 0, `mã ${r.status}\n${r.stderr}`);
  ok(!('suites_env' in pinCuoi(k)), 'suites_env có mặt khi khoá vắng');
});
await ca('AC5-bien-vang-env', 'khoá khai biến mà env tiến trình không có → vẫn đặt rỗng, suites_env vẫn ghi', async () => {
  const k = mkKho({ files: { '.env': 'K2=tu-file\n' }, suiteCmd: `node --env-file=.env -e "process.exit(process.env.K2 === String() ? 0 : 1)"`, config: '  repin_ci_blank_env: [K2]\n' });
  const r = k.lane(['--write']);
  ok(r.status === 0, `K2 không rỗng trong suite — mã ${r.status}\n${r.stderr}`);
  ok(pinCuoi(k).suites_env === 'ci', 'suites_env vắng');
});
void lenhChapChon;
ket();
