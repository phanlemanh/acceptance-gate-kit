// Ca kiểm của hồ sơ luot-kiem-nhe, AC-1…AC-8 (tên ca = mã AC; chiều đỏ mang hậu tố -do…).
// Vật được đo: .github/workflows/gate.yml (lượt kiểm tự động chia mảnh + việc gom `tests` + lượt trọn trên nhánh
// chính), tests/bo-chay.sh (Node tự xưng/tự so + bảng thời gian từng ca), bốn bộ chạy tests/*/run-tests.sh, .nvmrc.
// Fixture do CODE SINH trong lượt: thư mục tạm, tệp `node` giả đặt đầu PATH, bản sao đột biến của vật. Mỗi kim đột
// biến khẳng định khớp ĐÚNG MỘT lần trong nguồn thật trước khi tiêm; mỗi phép đo có đối chứng dương trên vật lành.
// Đường dẫn suy từ vị trí tệp này. LKN_CASES=<tiền tố,…> chạy riêng vài ca.
import { spawnSync, spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, copyFileSync, rmSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const GATE_YML = path.join(ROOT, '.github', 'workflows', 'gate.yml');
const ACTION_YML = path.join(ROOT, '.github', 'actions', 'node-tu-xung', 'action.yml');
const BO_CHAY = path.join(ROOT, 'tests', 'bo-chay.sh');
const NVMRC = path.join(ROOT, '.nvmrc');
const RUNNER = {
  scripts: path.join(ROOT, 'tests', 'scripts', 'run-tests.sh'),
  hooks: path.join(ROOT, 'tests', 'hooks', 'run-tests.sh'),
  plugins: path.join(ROOT, 'tests', 'plugins', 'run-tests.sh'),
  workflows: path.join(ROOT, 'tests', 'workflows', 'run-tests.sh'),
};
const TMP = mkdtempSync(path.join(tmpdir(), 'lkn-'));
process.on('exit', () => { try { rmSync(TMP, { recursive: true, force: true }); } catch {} });

const ONLY = (process.env.LKN_CASES || '').split(',').map((x) => x.trim()).filter(Boolean);
let passed = 0, failed = 0;
const chon = (n) => !ONLY.length || ONLY.some((p) => n.startsWith(p));
const ca = async (n, f) => {
  if (!chon(n)) return;
  try { const ghi = await f(); passed++; console.log(`  PASS: ${n}${ghi ? ` — ${ghi}` : ''}`); }
  catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${String(e.message).split('\n').join('\n    ')}`); }
};
const die = (m) => { throw new Error(m); };
const motLan = (src, kim, ten) => {
  const n = src.split(kim).length - 1;
  if (n !== 1) die(`kim đột biến «${ten}» khớp ${n} lần trong nguồn thật (cần đúng 1) — cập nhật phép đo`);
};

// Môi trường cho tiến trình con: bỏ biến của lượt kiểm tự động để lượt con không ghi vào tóm tắt của lượt cha.
const envCon = (them = {}) => {
  const e = { ...process.env, THOI_GIAN_CA_DIR: path.join(TMP, 'tg-rac'), ...them };
  if (!('GITHUB_ACTIONS' in them)) delete e.GITHUB_ACTIONS;
  if (!('GITHUB_STEP_SUMMARY' in them)) delete e.GITHUB_STEP_SUMMARY;
  return e;
};

// ── tệp `node` giả: báo phiên bản đặt sẵn khi hỏi --version, mọi lời gọi khác chuyển cho node thật ──
const nodeGia = (ban) => {
  const d = mkdtempSync(path.join(TMP, 'node-'));
  const f = path.join(d, 'node');
  writeFileSync(f, `#!/bin/sh\nif [ "$1" = "--version" ]; then echo "v${ban}"; exit 0; fi\nexec "${process.execPath}" "$@"\n`);
  chmodSync(f, 0o755);
  return d;
};
const pathVoi = (d) => `${d}${path.delimiter}${process.env.PATH}`;

// ── bộ đọc gate.yml theo dòng (không có thư viện YAML trong kho) ──
// Việc = khối thụt 2 dưới `jobs:`; bước = mục `- ` thụt 6 dưới `steps:`; ma trận = các dòng `- { … }`.
export function docGate(yml) {
  const dong = yml.split('\n');
  const iJobs = dong.findIndex((l) => /^jobs:\s*$/.test(l));
  const viec = {};
  let cur = null;
  for (let i = iJobs + 1; i < dong.length; i++) {
    const m = /^ {2}([a-z][a-z0-9_-]*):\s*$/.exec(dong[i]);
    if (m) { cur = { id: m[1], dong: [] }; viec[m[1]] = cur; continue; }
    if (cur) cur.dong.push(dong[i]);
  }
  for (const v of Object.values(viec)) {
    const tr = (re) => { for (const l of v.dong) { const m = re.exec(l); if (m) return m[1].trim(); } return null; };
    v.name = tr(/^ {4}name:\s*(.+)$/);
    v.if = tr(/^ {4}if:\s*(.+)$/);
    v.needs = tr(/^ {4}needs:\s*(.+)$/);
    v.matrix = v.dong.map((l) => /^ {10}- \{ ten: '([^']*)', zsh: (true|false), lenh: '([^']*)' \}\s*$/.exec(l))
      .filter(Boolean).map((m) => ({ ten: m[1], zsh: m[2] === 'true', lenh: m[3] }));
    const iSteps = v.dong.findIndex((l) => /^ {4}steps:\s*$/.test(l));
    v.buoc = [];
    if (iSteps >= 0) {
      let b = null;
      for (const l of v.dong.slice(iSteps + 1)) {
        if (/^ {6}- /.test(l)) { b = { dong: [l.replace(/^ {6}- /, '        ')] }; v.buoc.push(b); continue; }
        if (b && (/^ {8}/.test(l) || l.trim() === '' || /^\s*#/.test(l))) b.dong.push(l);
      }
      for (const b of v.buoc) {
        const tr = (re) => { for (const l of b.dong) { const m = re.exec(l); if (m) return m[1].trim(); } return null; };
        b.uses = tr(/^ {8}uses:\s*(.+)$/);
        b.name = tr(/^ {8}name:\s*(.+)$/);
        b.if = tr(/^ {8}if:\s*(.+)$/);
        b.nodeFile = tr(/^ {10}node-version-file:\s*(.+)$/);
        b.nodeTay = tr(/^ {10}node-version:\s*(.+)$/);
        const iRun = b.dong.findIndex((l) => /^ {8}run:/.test(l));
        if (iRun >= 0) {
          const dau = b.dong[iRun].replace(/^ {8}run:\s*/, '');
          if (dau === '|') {
            const than = [];
            for (const l of b.dong.slice(iRun + 1)) { if (/^ {10}/.test(l)) than.push(l.slice(10)); else if (l.trim() === '') than.push(''); else break; }
            b.run = than.join('\n').trim();
          } else b.run = dau.trim();
        } else b.run = null;
      }
    }
  }
  return viec;
}

// Tập lệnh của một chuỗi `a && b && c`
const lenhCua = (chuoi) => chuoi.split('&&').map((x) => x.trim()).filter(Boolean);
const PLUGINS_VUNG = () => readFileSync(RUNNER.plugins, 'utf8').split('\n').filter((l) => /^# <<<PLUGINS-VUNG \d+$/.test(l)).length;

// ══ AC-1: mảnh trên PR phủ đúng lượt trọn ══
export function kiemManh(yml, K) {
  const v = docGate(yml).manh;
  if (!v) return 'không có việc mảnh (manh) trong gate.yml';
  if (!/pull_request/.test(v.if || '')) return 'việc mảnh không giới hạn trên pull_request';
  const co = new Set(v.matrix.flatMap((m) => lenhCua(m.lenh)));
  const ns = [...co].map((l) => /--manh mjs:\d+\/(\d+)$/.exec(l)).filter(Boolean).map((m) => Number(m[1]));
  if (!ns.length) return 'không có mảnh mjs nào';
  const n = ns[0];
  if (ns.some((x) => x !== n)) return `số mảnh mjs không thống nhất: ${[...new Set(ns)].join(', ')}`;
  const can = new Set([
    'bash tests/scripts/run-tests.sh --manh bash',
    ...Array.from({ length: n }, (_, i) => `bash tests/scripts/run-tests.sh --manh mjs:${i + 1}/${n}`),
    ...Array.from({ length: K }, (_, k) => `bash tests/plugins/run-tests.sh --manh vung:${k + 1}`),
    'bash tests/hooks/run-tests.sh',
    'bash tests/workflows/run-tests.sh',
    'node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs"',
    'node scripts/product-map.mjs --root . --check',
  ]);
  const boQua = new Set(['bash tests/bo-chay.sh node']);
  for (const l of can) if (!co.has(l)) { const m = /--manh (\S+)$/.exec(l); return `mảnh thiếu: ${m ? m[1] : l}`; }
  for (const l of co) if (!can.has(l) && !boQua.has(l)) { const m = /--manh (\S+)$/.exec(l); return `mảnh không có: ${m ? m[1] : l}`; }
  return { n, K, so: v.matrix.length };
}
const listMjs = (manh) => {
  const r = spawnSync('bash', [RUNNER.scripts], { env: envCon({ SCRIPTS_SHARD_LIST: '1', ...(manh ? { SCRIPTS_SHARD: manh } : {}) }), encoding: 'utf8' });
  if (r.status !== 0) die(`in danh sách mảnh ${manh || 'trọn'} thoát ${r.status}: ${r.stderr}`);
  return r.stdout.split('\n').map((x) => x.trim()).filter(Boolean);
};

// ══ AC-2: lượt trọn trên nhánh chính ══
export function kiemTron(yml) {
  const v = docGate(yml).tests;
  if (!v) return 'không có việc tests';
  const buocDay = v.buoc.filter((b) => /github\.event_name == 'push'/.test(b.if || '') && b.run);
  const runs = buocDay.map((b) => b.run);
  for (const r of runs) if (/--manh|SCRIPTS_SHARD|PLUGINS_SHARD/.test(r)) return 'lượt trọn bị chia mảnh';
  const can = {
    scripts: 'bash tests/scripts/run-tests.sh', hooks: 'bash tests/hooks/run-tests.sh',
    plugins: 'bash tests/plugins/run-tests.sh', workflows: 'bash tests/workflows/run-tests.sh',
    'dieu-phoi': 'node --test --test-reporter=tap "tests/dieu-phoi/**/*.test.mjs"',
    'bản đồ': 'node scripts/product-map.mjs --root . --check',
  };
  for (const [bo, lenh] of Object.entries(can)) if (!runs.includes(lenh)) return `lượt trọn thiếu bộ: ${bo}`;
  return { so: runs.length };
}

// ══ AC-3: việc gom `tests` ══
export function kiemGom(yml) {
  const all = docGate(yml);
  const v = all.tests;
  if (!v) return 'không có việc tests';
  if (v.name !== 'tests') return `việc gom mang tên hiển thị «${v.name}» thay vì tests`;
  if (!v.needs || !/\bmanh\b/.test(v.needs)) return 'việc gom không chờ mảnh';
  if (!v.if || !/always\(\)/.test(v.if)) return 'việc gom bị bỏ qua khi mảnh đỏ — PR đỏ vẫn gộp được';
  const gom = v.buoc.find((b) => /pull_request/.test(b.if || '') && b.run && /KET_QUA_MANH/.test(b.run));
  if (!gom) return 'việc gom không có bước đọc kết quả mảnh trên PR';
  const envLine = gom.dong.find((l) => /KET_QUA_MANH:/.test(l)) || '';
  if (!/needs\.manh\.result/.test(envLine)) return 'bước gom không đọc needs.manh.result';
  if (!all.gate || (all.gate.name && all.gate.name !== 'gate')) return 'việc gate đổi tên';
  return { run: gom.run };
}

// ══ AC-5 (phần việc): mọi việc kiểm Node trước bước đầu dùng Node ══
const BO_CHAY_DAU = [
  'bash tests/scripts/run-tests.sh', 'bash tests/hooks/run-tests.sh',
  'bash tests/plugins/run-tests.sh', 'bash tests/workflows/run-tests.sh', 'bash tests/bo-chay.sh node',
];
const kiemDuoc = (lenh) => BO_CHAY_DAU.some((p) => lenh === p || lenh.startsWith(p + ' '));
const dungNode = (lenh) => /(^|\s)(node|npm|npx|bash tests\/)/.test(lenh);
export function kiemViec(yml) {
  const all = docGate(yml);
  const duong = [];
  for (const v of Object.values(all)) {
    // việc có ma trận: mỗi phần tử là một việc chạy riêng
    const thuc = v.matrix.length ? v.matrix.map((m) => ({ ten: `${v.id} · ${m.ten}`, m })) : [{ ten: v.id, m: null }];
    for (const t of thuc) {
      let daSetup = false, ket = null;
      for (const b of v.buoc) {
        if (b.uses && b.uses.startsWith('actions/setup-node')) { daSetup = true; continue; }
        if (!daSetup) continue;
        if (b.uses === './.github/actions/node-tu-xung') { ket = 'hành động node-tu-xung'; break; }
        if (!b.run) continue;
        const run = t.m ? b.run.replace('${{ matrix.lenh }}', t.m.lenh) : b.run;
        const dau = lenhCua(run.split('\n')[0])[0] || '';
        if (!dungNode(run)) continue;
        ket = kiemDuoc(dau) ? `lệnh «${dau}»` : null;
        if (!ket) return `việc không kiểm Node: ${v.id}`;
        break;
      }
      if (daSetup && !ket) return `việc không kiểm Node: ${v.id}`;
      if (daSetup) duong.push(`${t.ten} → ${ket}`);
    }
  }
  return { duong };
}

// ══ AC-6: một nguồn khai Node ══
export function kiemNguonKhai(yml) {
  let so = 0;
  for (const v of Object.values(docGate(yml))) for (const b of v.buoc) {
    if (!(b.uses || '').startsWith('actions/setup-node')) continue;
    so++;
    if (b.nodeTay) return `việc ${v.id} ghi tay phiên bản Node`;
    if (b.nodeFile !== '.nvmrc') return `việc ${v.id} không đọc .nvmrc`;
  }
  return { so };
}

const ketQua = (r, thongDiep) => {
  if (typeof r === 'string') die(r);
  return r;
};
const phaiDo = (r, thongDiep) => {
  if (typeof r !== 'string') die(`bản đột biến vẫn xanh — phép đo không bắt «${thongDiep}»`);
  if (!r.includes(thongDiep)) die(`bản đột biến đỏ sai thông điệp: «${r}» (cần «${thongDiep}»)`);
};

// Chạy một bộ chạy với Node giả, gom stdout tới dòng đầu rồi dừng cả nhóm tiến trình, hoặc chờ nó thoát.
function chayToiDongDau(runner, args, env, tranMs = 30000) {
  return new Promise((res) => {
    const c = spawn('bash', [runner, ...args], { env, detached: true });
    let out = '', err = '', xong = false;
    const ket = (lyDo, ma) => {
      if (xong) return; xong = true; clearTimeout(t);
      try { process.kill(-c.pid, 'SIGKILL'); } catch {}
      res({ lyDo, ma, out, err });
    };
    const t = setTimeout(() => ket('het-tran', null), tranMs);
    c.stdout.setEncoding('utf8'); c.stderr.setEncoding('utf8');
    c.stdout.on('data', (d) => { out += d; if (out.includes('\n')) ket('dong-dau', null); });
    c.stderr.on('data', (d) => { err += d; });
    c.on('close', (ma) => ket('thoat', ma));
  });
}

const KHAI = readFileSync(NVMRC, 'utf8').split('\n')[0].trim();
const SO_CHINH = KHAI.replace(/^v/, '').split('.')[0];
const BAN_LECH = SO_CHINH === '18' ? '20.0.0' : '18.20.0';

// Kiểm một bộ chạy: Node giả lệch → thoát 3 «node lệch», không in dòng ca nào.
async function kiemBoChayLech(runner) {
  const d = nodeGia(BAN_LECH);
  const r = await chayToiDongDau(runner, [], envCon({ PATH: pathVoi(d) }), 30000);
  if (r.lyDo !== 'thoat' || r.ma !== 3 || !r.err.includes('node lệch')) return { ok: false, r };
  if (/^\s*(PASS|FAIL):|^=== /m.test(r.out)) return { ok: false, r };
  return { ok: true, r };
}

// ═════════════════════════════════ các ca ═════════════════════════════════
const YML = readFileSync(GATE_YML, 'utf8');

await ca('LKN-AC1', () => {
  const K = PLUGINS_VUNG();
  if (K < 1) die('bộ chạy plugin thật không có marker vùng nào');
  const r = ketQua(kiemManh(YML, K));
  const tron = listMjs(null);
  const thay = new Map();
  for (let i = 1; i <= r.n; i++) for (const f of listMjs(`mjs:${i}/${r.n}`)) {
    if (thay.has(f)) die(`tệp ${f} nằm ở hai mảnh: ${thay.get(f)} và ${i}`);
    thay.set(f, i);
  }
  const thieu = tron.filter((f) => !thay.has(f));
  const thua = [...thay.keys()].filter((f) => !tron.includes(f));
  if (thieu.length || thua.length) die(`hợp các mảnh khác lượt trọn — thiếu: ${thieu.join(', ')} · thừa: ${thua.join(', ')}`);
  return `n=${r.n} K=${K} · ${r.so} việc mảnh · ${tron.length} tệp mjs chia ${r.n} mảnh rời nhau, hợp bằng lượt trọn`;
});
await ca('LKN-AC1-do-thieu', () => {
  const K = PLUGINS_VUNG();
  const { n } = ketQua(kiemManh(YML, K));
  const kim = `--manh mjs:${n}/${n}' }\n`;
  motLan(YML, kim, `mjs:${n}/${n}`);
  const dong = YML.split('\n').filter((l) => !l.includes(`--manh mjs:${n}/${n}'`)).join('\n');
  phaiDo(kiemManh(dong, K), `mảnh thiếu: mjs:${n}/${n}`);
});
await ca('LKN-AC1-do-thua', () => {
  const K = PLUGINS_VUNG();
  const kim = `          - { ten: 'plugins vung ${K}', zsh: false, lenh: 'bash tests/plugins/run-tests.sh --manh vung:${K}' }\n`;
  motLan(YML, kim, `vung:${K}`);
  const them = kim.replace(`vung ${K}`, `vung ${K + 1}`).replace(`vung:${K}`, `vung:${K + 1}`);
  phaiDo(kiemManh(YML.replace(kim, kim + them), K), `mảnh không có: vung:${K + 1}`);
});

await ca('LKN-AC2', () => `${ketQua(kiemTron(YML)).so} bước trọn trên sự kiện đẩy`);
await ca('LKN-AC2-do-manh', () => {
  const kim = "        run: bash tests/scripts/run-tests.sh\n";
  motLan(YML, kim, 'lệnh bộ script của việc trọn');
  phaiDo(kiemTron(YML.replace(kim, "        run: bash tests/scripts/run-tests.sh --manh bash\n")), 'lượt trọn bị chia mảnh');
});
await ca('LKN-AC2-do-thieu', () => {
  const kim = "        run: bash tests/plugins/run-tests.sh\n";
  motLan(YML, kim, 'lệnh bộ plugin của việc trọn');
  phaiDo(kiemTron(YML.replace(kim, "        run: echo bo-plugin-da-go\n")), 'lượt trọn thiếu bộ: plugins');
});

await ca('LKN-AC3', () => {
  const { run } = ketQua(kiemGom(YML));
  const chay = (kq) => spawnSync('bash', ['-c', run], { env: { ...envCon(), KET_QUA_MANH: kq }, encoding: 'utf8' }).status;
  const hong = chay('failure'), huy = chay('cancelled'), xanh = chay('success');
  if (hong === 0 || huy === 0) die(`bước gom thoát 0 khi mảnh ${hong === 0 ? 'failure' : 'cancelled'}`);
  if (xanh !== 0) die(`bước gom thoát ${xanh} khi mọi mảnh success`);
  return 'failure → đỏ · cancelled → đỏ · success → xanh';
});
await ca('LKN-AC3-do-always', () => {
  const kim = "    needs: [manh]\n    if: always()\n";
  motLan(YML, kim, 'if: always() của việc gom');
  phaiDo(kiemGom(YML.replace(kim, "    needs: [manh]\n")), 'việc gom bị bỏ qua khi mảnh đỏ — PR đỏ vẫn gộp được');
});
await ca('LKN-AC3-do-needs', () => {
  const kim = "    needs: [manh]\n";
  motLan(YML, kim, 'needs của việc gom');
  phaiDo(kiemGom(YML.replace(kim, '')), 'việc gom không chờ mảnh');
});

// AC-4: ma trận mười hai hàng viết trước
const MA_TRAN = [
  { khai: '24', chay: '24.22.0', kq: 'khop' },
  { khai: 'v24', chay: '24.22.0', kq: 'khop' },
  { khai: '24.22', chay: '24.22.0', kq: 'khop' },
  { khai: '24.22.0', chay: '24.22.0', kq: 'khop' },
  { khai: '22', chay: '24.22.0', kq: 'lech' },
  { khai: '24', chay: '22.11.0', kq: 'lech' },
  { khai: '24', chay: '18.20.0', kq: 'lech' },
  { khai: '24.21', chay: '24.22.0', kq: 'lech' },
  { khai: '24.15.0', chay: '24.22.0', kq: 'lech' },
  { khai: null, chay: '24.22.0', kq: 'vang' },
  { khai: '', chay: '24.22.0', kq: 'khong-doc' },
  { khai: 'lts/*', chay: '24.22.0', kq: 'khong-doc' },
];
await ca('LKN-AC4', () => {
  let dung = 0;
  for (const h of MA_TRAN) {
    const goc = mkdtempSync(path.join(TMP, 'goc-'));
    if (h.khai !== null) writeFileSync(path.join(goc, '.nvmrc'), h.khai + '\n');
    const r = spawnSync('bash', [BO_CHAY, 'node', goc], { env: envCon({ PATH: pathVoi(nodeGia(h.chay)) }), encoding: 'utf8' });
    const o = r.stdout, e = r.stderr, ten = `${h.khai === null ? '(vắng)' : `«${h.khai}»`} × v${h.chay}`;
    if (h.kq === 'khop') {
      const can = `node: v${h.chay} · kho khai ${h.khai} (.nvmrc) · khớp`;
      if (r.status !== 0 || o.trim() !== can) die(`${ten}: cần thoát 0 + đúng một dòng «${can}», được ${r.status} «${o.trim()}» ${e}`);
    } else if (h.kq === 'lech') {
      const can = `node lệch: đang chạy v${h.chay}, kho khai ${h.khai} (.nvmrc)`;
      if (r.status !== 3 || !e.includes(can) || o.trim()) die(`${ten}: cần thoát 3 + «${can}», được ${r.status} «${e.trim()}»`);
    } else if (h.kq === 'vang') {
      if (r.status !== 3 || !e.includes('kho chưa khai phiên bản Node')) die(`${ten}: cần thoát 3 «kho chưa khai phiên bản Node», được ${r.status} «${e.trim()}»`);
    } else {
      if (r.status !== 3 || !e.includes('không đọc được lời khai')) die(`${ten}: cần thoát 3 «không đọc được lời khai», được ${r.status} «${e.trim()}»`);
    }
    dung++;
  }
  if (dung !== MA_TRAN.length || MA_TRAN.length !== 12) die(`ma trận ${dung}/${MA_TRAN.length}`);
  return `${dung}/12 hàng`;
});
await ca('LKN-AC4-that', () => {
  const r = spawnSync('bash', [BO_CHAY, 'node'], { env: envCon(), encoding: 'utf8' });
  const can = `node: v${process.versions.node} · kho khai ${KHAI} (.nvmrc) · khớp`;
  if (r.status !== 0 || r.stdout.trim() !== can) die(`kho thật: cần «${can}», được ${r.status} «${r.stdout.trim()}» ${r.stderr}`);
  return can;
});

await ca('LKN-AC5', async () => {
  const ghi = [];
  for (const [ten, runner] of Object.entries(RUNNER)) {
    const { ok, r } = await kiemBoChayLech(runner);
    if (!ok) die(`bộ chạy không kiểm Node: ${ten} (kết cục ${r.lyDo}, mã ${r.ma}, stderr «${r.err.trim().slice(0, 200)}»)`);
    ghi.push(`${ten} thoát 3`);
  }
  return ghi.join(' · ');
});
await ca('LKN-AC5-khop', async () => {
  const d = nodeGia(`${SO_CHINH}.99.0`);
  const can = `node: v${SO_CHINH}.99.0 · kho khai ${KHAI} (.nvmrc) · khớp`;
  for (const [ten, runner] of Object.entries(RUNNER)) {
    const r = await chayToiDongDau(runner, [], envCon({ PATH: pathVoi(d) }), 60000);
    const dau = r.out.split('\n')[0];
    if (dau !== can) die(`${ten}: dòng đầu «${dau}» (kết cục ${r.lyDo}, mã ${r.ma}) — cần «${can}»`);
  }
  return `bốn bộ chạy in «${can}» ở dòng đầu`;
});
await ca('LKN-AC5-viec', () => {
  const { duong } = ketQua(kiemViec(YML));
  const act = readFileSync(ACTION_YML, 'utf8');
  const m = /^\s+run:\s*(.+)$/m.exec(act);
  if (!m || m[1].trim() !== 'bash tests/bo-chay.sh node') die('hành động node-tu-xung không chạy đúng «bash tests/bo-chay.sh node»');
  const r = spawnSync('bash', ['-c', m[1]], { cwd: ROOT, env: envCon({ PATH: pathVoi(nodeGia(BAN_LECH)) }), encoding: 'utf8' });
  if (r.status !== 3 || !r.stderr.includes('node lệch')) die(`lệnh bước kiểm dưới Node giả thoát ${r.status}: ${r.stderr}`);
  return `${duong.length} việc: ${duong.join(' ; ')}`;
});
await ca('LKN-AC5-do-bo-chay', async () => {
  const src = readFileSync(RUNNER.plugins, 'utf8');
  const kim = '    if [ -n "${PLUGINS_SHARD_EMIT:-}" ]; then bc_node "$ROOT" >&2 || exit 3; else bc_node "$ROOT" || exit 3; fi\n';
  motLan(src, kim, 'dòng gọi kiểm Node của bộ chạy plugin');
  // bản sao đặt đúng chỗ trong một gốc giả có bo-chay.sh và .nvmrc thật — chỉ khác đúng dòng gọi kiểm
  const goc = mkdtempSync(path.join(TMP, 'gocp-'));
  mkdirSync(path.join(goc, 'tests', 'plugins'), { recursive: true });
  copyFileSync(BO_CHAY, path.join(goc, 'tests', 'bo-chay.sh'));
  copyFileSync(NVMRC, path.join(goc, '.nvmrc'));
  const lanh = path.join(goc, 'tests', 'plugins', 'run-tests.sh');
  writeFileSync(lanh, src);
  const a = await kiemBoChayLech(lanh);
  if (!a.ok) die(`đối chứng dương: bản sao lành ở gốc giả không thoát 3 (${a.r.lyDo}, ${a.r.ma})`);
  writeFileSync(lanh, src.replace(kim, ''));
  const b = await kiemBoChayLech(lanh);
  if (b.ok) die('bản sao đã gỡ dòng gọi kiểm Node vẫn thoát 3 «node lệch» — phép đo không bắt');
  return 'bộ chạy không kiểm Node: plugins (bản gỡ dòng) — bản lành ở cùng gốc thoát 3';
});
await ca('LKN-AC5-do-viec', () => {
  const v = docGate(YML)['design-eval'];
  if (!v) die('gate.yml không có việc design-eval');
  const kim = '      - uses: ./.github/actions/node-tu-xung\n';
  const doan = YML.slice(YML.indexOf('\n  design-eval:\n'));
  const dau = YML.indexOf('\n  design-eval:\n') + doan.indexOf(kim);
  if (doan.indexOf(kim) < 0) die('việc design-eval không có bước node-tu-xung');
  phaiDo(kiemViec(YML.slice(0, dau) + YML.slice(dau + kim.length)), 'việc không kiểm Node: design-eval');
});
await ca('LKN-AC5-do-viec-moi', () => {
  const them = "  viec-moi:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v7\n      - uses: actions/setup-node@v7\n        with:\n          node-version-file: .nvmrc\n      - name: chạy node\n        run: node -v\n";
  phaiDo(kiemViec(YML.trimEnd() + '\n\n' + them), 'việc không kiểm Node: viec-moi');
});

await ca('LKN-AC6', () => {
  const dong = readFileSync(NVMRC, 'utf8').split('\n').filter((l) => l.trim());
  if (dong.length !== 1 || !/^v?\d+(\.\d+){0,2}$/.test(dong[0].trim())) die(`.nvmrc phải đúng một dòng số phiên bản, đang là ${JSON.stringify(dong)}`);
  const { so } = ketQua(kiemNguonKhai(YML));
  if (so < 5) die(`chỉ thấy ${so} bước setup-node — bộ đọc gate.yml hỏng?`);
  return `${so} bước setup-node đều đọc .nvmrc «${dong[0].trim()}»`;
});
await ca('LKN-AC6-do', () => {
  const doan = YML.indexOf('\n  design-floor:\n');
  const kim = '          node-version-file: .nvmrc\n';
  const vt = YML.indexOf(kim, doan);
  if (doan < 0 || vt < 0) die('không tìm thấy setup-node của việc design-floor');
  phaiDo(kiemNguonKhai(YML.slice(0, vt) + "          node-version: '22'\n" + YML.slice(vt + kim.length)), 'việc design-floor ghi tay phiên bản Node');
});

// ── AC-7: bảng thời gian từng ca trên bộ chạy ──
const dongKetQua = (out) => out.split('\n').filter((l) => /^\s*(PASS|FAIL):/.test(l)).length;
const docBang = (f) => (existsSync(f) ? readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => { const [g, ...t] = l.split('\t'); return { giay: Number(g), ca: t.join('\t') }; }) : []);
const dauBangIn = (out) => {
  const i = out.split('\n').findIndex((l) => l.startsWith('Thời gian từng ca ('));
  return i < 0 ? null : out.split('\n')[i + 1];
};
// Gốc giả có tests/bo-chay.sh (thật, hoặc bản đột biến) + .nvmrc thật.
const gocGia = (boChaySrc) => {
  const goc = mkdtempSync(path.join(TMP, 'gocf-'));
  mkdirSync(path.join(goc, 'tests'), { recursive: true });
  writeFileSync(path.join(goc, 'tests', 'bo-chay.sh'), boChaySrc ?? readFileSync(BO_CHAY, 'utf8'));
  copyFileSync(NVMRC, path.join(goc, '.nvmrc'));
  return goc;
};
const CA_NGU = `console.log('  PASS: ca-ngu-hai-giay'); `;
// Bản ghép bộ chạy script theo marker: phần đầu tới CA-BASH-DAU + một ca bash ngủ + một ca bash nhanh + khối MJS-GOI + phần kết.
const ghepScripts = (goc) => {
  const L = readFileSync(RUNNER.scripts, 'utf8').split('\n');
  const tim = (m) => { const i = L.findIndex((l) => l.startsWith(m)); if (i < 0) die(`bộ chạy script thiếu marker ${m}`); return i; };
  const dau = tim('# <<<CA-BASH-DAU'), goi = tim('# <<<MJS-GOI'), het = tim('# MJS-GOI>>>'), ket = tim('# <<<KET-SUITE');
  const than = [...L.slice(0, dau), 'sleep 2; check "ca-bash-ngu" 0 0', 'check "ca-bash-nhanh" 0 0', ...L.slice(goi, het + 1), ...L.slice(ket)];
  const d = path.join(goc, 'tests', 'scripts'); mkdirSync(d, { recursive: true });
  writeFileSync(path.join(d, 'run-tests.sh'), than.join('\n'));
  writeFileSync(path.join(d, 'a-ngu.test.mjs'), `await new Promise(r => setTimeout(r, 2100)); console.log('ngủ xong');\n`);
  writeFileSync(path.join(d, 'b-nhanh.test.mjs'), `console.log('nhanh');\n`);
  writeFileSync(path.join(d, 'c-nhanh.test.mjs'), `console.log('nhanh');\n`);
  return path.join(d, 'run-tests.sh');
};
const kiemBang = (bo, out, f, tenNgu) => {
  const bang = docBang(f), n = dongKetQua(out);
  if (bang.length !== n) die(`bảng thiếu hàng: ${bo} có ${n} ca, ${bang.length} hàng`);
  const ngu = bang.find((h) => h.ca.includes(tenNgu));
  if (!ngu || ngu.giay < 2) die(`${bo}: hàng của ca ngủ ${ngu ? ngu.giay + ' s' : 'vắng'} (cần ≥ 2 s)`);
  for (const h of bang) if (!h.ca.includes(tenNgu) && h.giay >= 1) die(`${bo}: ca nhanh «${h.ca}» ${h.giay} s (cần < 1 s)`);
  const dau = dauBangIn(out);
  if (!dau || !dau.includes(tenNgu)) die(`${bo}: hàng đầu danh sách chậm nhất in ra là «${dau}» — cần ca ngủ`);
  return `${n} ca = ${bang.length} hàng · ca ngủ ${ngu.giay} s đứng đầu`;
};
const chayCho = (runner, args, them) => spawnSync('bash', [runner, ...args], { env: envCon(them), encoding: 'utf8', timeout: 120000 });

await ca('LKN-AC7-scripts', () => {
  const goc = gocGia(); const R = ghepScripts(goc); const tg = path.join(goc, 'tg');
  const a = chayCho(R, ['--manh', 'mjs:1/1'], { THOI_GIAN_CA_DIR: tg });
  if (a.status !== 0) die(`mảnh mjs thoát ${a.status}: ${a.stdout.slice(-400)} ${a.stderr.slice(-300)}`);
  const ghiA = kiemBang('scripts mjs', a.stdout, path.join(tg, 'scripts-mjs-1-1.tsv'), 'a-ngu.test.mjs');
  const b = chayCho(R, ['--manh', 'bash'], { THOI_GIAN_CA_DIR: tg });
  if (b.status !== 0) die(`mảnh bash thoát ${b.status}: ${b.stdout.slice(-400)}`);
  const ghiB = kiemBang('scripts bash', b.stdout, path.join(tg, 'scripts-bash.tsv'), 'ca-bash-ngu');
  return `mjs: ${ghiA} · bash: ${ghiB}`;
});
await ca('LKN-AC7-plugins', () => {
  const goc = gocGia(); const tg = path.join(goc, 'tg');
  const L = readFileSync(RUNNER.plugins, 'utf8').split('\n');
  const v1 = L.findIndex((l) => l === '# <<<PLUGINS-VUNG 1'), ket = L.findIndex((l) => l === '# <<<PLUGINS-KET');
  if (v1 < 0 || ket < 0) die('bộ chạy plugin thiếu marker vùng/kết');
  const d = path.join(goc, 'tests', 'plugins'); mkdirSync(d, { recursive: true });
  const R = path.join(d, 'run-tests.sh');
  writeFileSync(R, [...L.slice(0, v1), '# <<<PLUGINS-VUNG 1', 'run "ca-plugin-ngu" sleep 2', 'run "ca-plugin-nhanh" true', 'pass "ca-plugin-tu-ghi"', ...L.slice(ket)].join('\n'));
  const r = chayCho(R, ['--manh', 'vung:1'], { THOI_GIAN_CA_DIR: tg });
  if (r.status !== 0) die(`vùng 1 thoát ${r.status}: ${r.stdout.slice(-400)} ${r.stderr.slice(-300)}`);
  return kiemBang('plugins vùng 1', r.stdout, path.join(tg, 'plugins-vung-1.tsv'), 'ca-plugin-ngu');
});
await ca('LKN-AC7-workflows', () => {
  const goc = gocGia(); const tg = path.join(goc, 'tg');
  const d = path.join(goc, 'tests', 'workflows'); mkdirSync(d, { recursive: true });
  copyFileSync(RUNNER.workflows, path.join(d, 'run-tests.sh'));
  writeFileSync(path.join(d, 'a.test.mjs'), `await new Promise(r => setTimeout(r, 2100)); ${CA_NGU}\n`);
  writeFileSync(path.join(d, 'b.test.mjs'), `console.log('  PASS: ca-wf-nhanh');\n`);
  const r = chayCho(path.join(d, 'run-tests.sh'), [], { THOI_GIAN_CA_DIR: tg });
  if (r.status !== 0) die(`workflows thoát ${r.status}: ${r.stdout.slice(-400)}`);
  return kiemBang('workflows', r.stdout, path.join(tg, 'workflows-tron.tsv'), 'ca-ngu-hai-giay');
});
await ca('LKN-AC7-hooks', () => {
  const tg = path.join(TMP, 'tg-hooks');
  const r = chayCho(RUNNER.hooks, [], { THOI_GIAN_CA_DIR: tg });
  if (r.status !== 0) die(`bộ móc thật thoát ${r.status}`);
  const bang = docBang(path.join(tg, 'hooks-tron.tsv')), n = dongKetQua(r.stdout);
  if (bang.length !== n || n < 50) die(`bảng thiếu hàng: hooks có ${n} ca, ${bang.length} hàng`);
  if (!dauBangIn(r.stdout)) die('bộ móc thật không in danh sách chậm nhất');
  return `bộ móc thật: ${n} dòng kết quả = ${bang.length} hàng`;
});
await ca('LKN-AC7-that', () => {
  const tg = path.join(TMP, 'tg-that');
  const r = chayCho(RUNNER.plugins, ['--manh', 'vung:1'], { THOI_GIAN_CA_DIR: tg });
  const bang = docBang(path.join(tg, 'plugins-vung-1.tsv')), n = dongKetQua(r.stdout);
  if (bang.length !== n || n < 10) die(`bảng thiếu hàng: plugins vùng 1 có ${n} ca, ${bang.length} hàng (thoát ${r.status})`);
  return `bộ plugin thật vùng 1: ${n} dòng kết quả = ${bang.length} hàng (thoát ${r.status})`;
});
await ca('LKN-AC7-do', () => {
  const src = readFileSync(BO_CHAY, 'utf8');
  const kim = '    case "$t" in PASS:*|FAIL:*) bc_tg_ca "$t" ;; esac\n';
  motLan(src, kim, 'lần ghi hàng trong bộ lọc dòng');
  const goc = gocGia(src.replace(kim, '    :\n')); const R = ghepScripts(goc); const tg = path.join(goc, 'tg');
  const r = chayCho(R, ['--manh', 'mjs:1/1'], { THOI_GIAN_CA_DIR: tg });
  let loi = null;
  try { kiemBang('scripts', r.stdout, path.join(tg, 'scripts-mjs-1-1.tsv'), 'a-ngu.test.mjs'); } catch (e) { loi = e.message; }
  if (!loi) die('bản bo-chay bỏ lần ghi hàng mà bảng vẫn đủ — phép đo không bắt');
  if (!loi.startsWith('bảng thiếu hàng: scripts có ')) die(`đỏ sai thông điệp: ${loi}`);
  return loi;
});

// ── AC-8: bảng trên tóm tắt của lượt kiểm tự động ──
const chayTomTat = (boChay, them) => {
  const d = mkdtempSync(path.join(TMP, 'ac8-'));
  const f = path.join(d, 'bo-chay.sh'); writeFileSync(f, boChay);
  const lenh = `. "${f}"; bc_tg_mo thu mjs:2/3 "${d}"; for i in $(seq 1 20); do echo "  PASS: ca-$i"; done; bc_tg_dong`;
  const r = spawnSync('bash', ['-c', lenh], { env: envCon({ THOI_GIAN_CA_DIR: path.join(d, 'tg'), ...them(d) }), encoding: 'utf8' });
  return { d, r, tsv: docBang(path.join(d, 'tg', 'thu-mjs-2-3.tsv')) };
};
const kiemTomTat = (boChay) => {
  const { d, r, tsv } = chayTomTat(boChay, (d) => ({ GITHUB_ACTIONS: 'true', GITHUB_STEP_SUMMARY: path.join(d, 'sum.md') }));
  const sum = path.join(d, 'sum.md');
  if (!existsSync(sum)) return 'lượt kiểm tự động không có bảng thời gian';
  const s = readFileSync(sum, 'utf8');
  if (!s.includes('### Thời gian từng ca — thu/mjs-2-3')) return 'tóm tắt thiếu tên bộ và mảnh';
  const hang = s.split('\n').filter((l) => /^\| [\d.]+ \|/.test(l)).length;
  if (hang !== 15) return `tóm tắt có ${hang} hàng (cần 15 trên 20 ca)`;
  const L = r.stdout.split('\n'); const a = L.findIndex((l) => l.startsWith('::group::')), b = L.indexOf('::endgroup::');
  if (a < 0 || b < a) return 'nhật ký không có nhóm thu gọn chứa trọn bảng';
  if (b - a - 1 !== tsv.length || tsv.length !== 20) return `nhóm thu gọn có ${b - a - 1} hàng, tệp có ${tsv.length}`;
  return { hang, nhom: b - a - 1 };
};
await ca('LKN-AC8', () => { const r = ketQua(kiemTomTat(readFileSync(BO_CHAY, 'utf8'))); return `tóm tắt ${r.hang} hàng · nhóm thu gọn ${r.nhom} hàng`; });
await ca('LKN-AC8-im', () => {
  const { d, r } = chayTomTat(readFileSync(BO_CHAY, 'utf8'), () => ({}));
  if (readdirSync(d).some((x) => x.endsWith('.md'))) die('không đặt biến của lượt kiểm tự động mà vẫn ghi tệp tóm tắt');
  if (r.stdout.includes('::group::')) die('không đặt biến của lượt kiểm tự động mà vẫn in nhóm thu gọn');
  if (!r.stdout.includes('Thời gian từng ca (thu/mjs-2-3): 20 ca')) die('máy cá nhân vẫn phải in mười ca chậm nhất');
});
await ca('LKN-AC8-do', () => {
  const src = readFileSync(BO_CHAY, 'utf8');
  const kim = '    if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then\n';
  motLan(src, kim, 'nhánh tóm tắt');
  phaiDo(kiemTomTat(src.replace(kim, '    if false; then\n')), 'lượt kiểm tự động không có bảng thời gian');
});

console.log(`\nResults: ${passed} passed, ${failed} failed (luot-kiem-nhe)`);
process.exit(failed ? 1 : 0);
