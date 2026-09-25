// duong-nen-fixture.mjs — kho fixture DO CODE SINH cho đường nền hạ tầng
// (feature-loop/scripts/duong-nen.mjs). Dùng chung: tests/scripts/duong-nen.test.mjs
// (Task 7) và ca thẻ Cổng Phạm vi (Task 9) — mọi `duong-nen.md` các ca ấy đọc
// đều do chính script ghi trên kho này, không văn viết tay theo khuôn bên đọc.
//
// Không ca nào đọc plugin cache thật của máy: `dungCache()` dựng một cache tạm
// theo bố cục `<cache>/<marketplace>/acceptance-gate/<version>/` và `chayNen()`
// LUÔN truyền `--cache-root`. Không ca nào ghi vào `_acceptance/` của kho kit:
// mọi thư mục nằm dưới `os.tmpdir()`.
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const KIT = path.join(HERE, '..', '..');
export const DUONG_NEN = path.join(KIT, 'feature-loop', 'scripts', 'duong-nen.mjs');

// Mọi thư mục tạm fixture tạo ra — `donDep()` gỡ hết ở cuối lượt chạy.
const TAO = [];
export const tamDir = (tien) => { const d = mkdtempSync(path.join(tmpdir(), tien)); TAO.push(d); return d; };
export const donDep = () => { for (const d of TAO.splice(0)) rmSync(d, { recursive: true, force: true }); };

const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();

export const CONFIG_LANH =
  'schema_version: 1\n' +
  'executors:\n' +
  '  test:\n' +
  '    a: "bash suite-a.sh"\n' +
  '    b: "bash suite-b.sh"\n' +
  'feature_loop:\n' +
  '  suite_keys:\n' +
  '    - executors.test.a\n' +
  '    - executors.test.b\n';

// Suite ghi dấu vào `$NEN_DAU/thu-tu.log` (ngoài cây) bằng `>>` — thứ tự DÒNG là
// thứ tự sự kiện, ca đọc thứ tự dòng chứ không so đồng hồ. `sleep` giữa hai dấu để
// hai suite chạy cùng lúc chắc chắn chồng nhau.
const suite = (ten, giua, cuoi) =>
  '#!/usr/bin/env bash\n' +
  `echo ${ten}.start >> "$NEN_DAU/thu-tu.log"\n` +
  'sleep 0.4\n' +
  (giua || '') +
  `echo ${ten}.end >> "$NEN_DAU/thu-tu.log"\n` +
  (cuoi || '');

/**
 * dungKho(opts) — kho git tạm, lành mặc định. Mỗi ca đỏ chỉ đổi MỘT biến:
 *   config      thay nguyên văn `_acceptance/config.yaml`
 *   giuaA       dòng chèn vào giữa suite-a (vd ghi tệp vào cây)
 *   cuoiB       dòng nối cuối suite-b (vd `exit 3`)
 *   noLuoi      nhánh `main` mang hồ sơ `status: verified` không có evidence-report.md
 *   khongGit    gỡ `.git` sau khi dựng (không còn là kho git)
 *   tuHost      chép thêm commands/acceptance-init.md + khuôn đường nền để kho
 *               đóng được vai `--ag-root` của chính nó
 * Trả { dir, dau } — `dau` là thư mục dấu của suite (ngoài cây).
 */
export function dungKho(opts = {}) {
  const dir = tamDir('duong-nen-kho-');
  const dau = tamDir('duong-nen-dau-');
  execFileSync('git', ['init', '-q', '-b', 'main', dir]);
  git(dir, 'config', 'user.email', 't@t.t');
  git(dir, 'config', 'user.name', 'T');
  mkdirSync(path.join(dir, '_acceptance', 'demo'), { recursive: true });
  writeFileSync(path.join(dir, '_acceptance', 'config.yaml'), opts.config || CONFIG_LANH);
  writeFileSync(path.join(dir, '_acceptance', 'demo', 'contract.md'),
    '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: draft\n---\n\n# demo\n');
  writeFileSync(path.join(dir, 'suite-a.sh'), suite('a', opts.giuaA, ''));
  writeFileSync(path.join(dir, 'suite-b.sh'), suite('b', '', opts.cuoiB));
  writeFileSync(path.join(dir, 'README.md'), 'kho fixture duong-nen\n');
  // Bản vendored: chép TRỌN `lib/` và mọi tệp `scripts/` của danh sách chép CI — RÚT từ khối
  // INIT-CI-COPY-LIST (danh sách tay hai tệp từng làm chân engine đỏ oan khi danh sách lên 15
  // tệp ở vòng ho-so-khep-thoi-hoi).
  mkdirSync(path.join(dir, 'scripts'), { recursive: true });
  const initTxt = readFileSync(path.join(KIT, 'commands', 'acceptance-init.md'), 'utf8');
  const khoi = (initTxt.split('<<<INIT-CI-COPY-LIST')[1] || '').split('INIT-CI-COPY-LIST>>>')[0];
  const tepScripts = [...khoi.matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/scripts\/([^`]+)`/g)].map(m => m[1]);
  if (tepScripts.length < 2) throw new Error(`duong-nen-fixture: rut duoc ${tepScripts.length} tep scripts/ tu INIT-CI-COPY-LIST`);
  for (const f of tepScripts) {
    cpSync(path.join(KIT, 'scripts', f), path.join(dir, 'scripts', f));
  }
  cpSync(path.join(KIT, 'lib'), path.join(dir, 'lib'), { recursive: true });
  if (opts.tuHost) {
    mkdirSync(path.join(dir, 'commands'), { recursive: true });
    cpSync(path.join(KIT, 'commands', 'acceptance-init.md'), path.join(dir, 'commands', 'acceptance-init.md'));
    mkdirSync(path.join(dir, 'skills', 'acceptance', 'references'), { recursive: true });
    cpSync(path.join(KIT, 'skills', 'acceptance', 'references', 'duong-nen-template.md'),
      path.join(dir, 'skills', 'acceptance', 'references', 'duong-nen-template.md'));
  }
  if (opts.noLuoi) {
    mkdirSync(path.join(dir, '_acceptance', 'no-cu'), { recursive: true });
    writeFileSync(path.join(dir, '_acceptance', 'no-cu', 'contract.md'),
      '---\nschema_version: 1\nfeature: no-cu\nslug: no-cu\nrisk_tier: T2\nsurfaces: [api]\nstatus: verified\napproved_by: Manh Phan\napproved_at: 2026-06-10\n---\n\n# no-cu\n');
  }
  git(dir, 'add', '-A');
  git(dir, 'commit', '-qm', 'nhanh goc');
  // Vòng đứng trên nhánh riêng như đời thật: nhánh gốc khác HEAD.
  git(dir, 'checkout', '-qb', 'vong');
  writeFileSync(path.join(dir, 'vat.txt'), 'vat cua vong\n');
  git(dir, 'add', '-A');
  git(dir, 'commit', '-qm', 'vong');
  if (opts.khongGit) rmSync(path.join(dir, '.git'), { recursive: true, force: true });
  return { dir, dau };
}

/** dungCache() — plugin cache tạm, bố cục resolve-plugin đọc được, chép từ KIT. */
export function dungCache() {
  const c = tamDir('duong-nen-cache-');
  const v = path.join(c, 'kit-mkt', 'acceptance-gate', '9.9.9');
  mkdirSync(v, { recursive: true });
  for (const d of ['scripts', 'lib', 'commands', 'skills']) {
    cpSync(path.join(KIT, d), path.join(v, d), { recursive: true });
  }
  return c;
}

/**
 * chayNen(kho, { cache, agRoot, root, script, them, env }) — chạy đường nền, trả
 * { code, stdout, stderr, tep } với `tep` = nội dung duong-nen.md hoặc null.
 * `env` đè lên môi trường của lượt test (vd HOME, PATH của ca NEN-ENV).
 */
export function chayNen(kho, o = {}) {
  const root = o.root || kho.dir;
  const args = [o.script || DUONG_NEN, '--root', root, '--slug', 'demo',
    '--ag-root', o.agRoot || KIT, '--cache-root', o.cache, ...(o.them || [])];
  const r = spawnSync(process.execPath, args, {
    encoding: 'utf8', env: { ...process.env, ...(o.env || {}), NEN_DAU: kho.dau }, maxBuffer: 64 * 1024 * 1024,
  });
  const p = path.join(root, '_acceptance', 'demo', 'duong-nen.md');
  return { code: r.status, stdout: r.stdout || '', stderr: r.stderr || '', tep: existsSync(p) ? readFileSync(p, 'utf8') : null, tepPath: p };
}
