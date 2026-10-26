// Lấy về ĐÚNG bản upstream đã ghim, dựng `ui` từ nguồn, đo đóng kín bằng esbuild metafile.
// Bước 1 chưa vendor nên nguồn đến từ mạng (sparse + depth 1, ~2 s) vào một cache theo commit;
// bước 2 thay hàm chuanBiNguon bằng đường tới bản vendored — mọi bên đọc khác giữ nguyên.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export function esbuild() {
  try {
    return require('esbuild');
  } catch {
    throw new Error('thiếu esbuild — chạy: npm ci --prefix tests/design-floor');
  }
}

function sh(cmd, args, cwd) {
  return execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

export function thuMucCache(hd) {
  return process.env.DESIGN_FLOOR_CACHE || join(tmpdir(), 'design-floor-upstream', hd.nguon.commit);
}

// Cache chỉ được dùng khi dấu `.xong` ghi đúng commit + tập lấy về; dở dang thì xoá làm lại.
export function chuanBiNguon(hd) {
  const dir = thuMucCache(hd);
  const dau = join(dir, '.xong');
  const ky = `${hd.nguon.commit} ${hd.nguon.lay_ve.join(' ')}`;
  if (existsSync(dau) && readFileSync(dau, 'utf8').trim() === ky) return dir;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  sh('git', ['init', '-q'], dir);
  sh('git', ['remote', 'add', 'origin', `${hd.nguon.repo}.git`], dir);
  sh('git', ['sparse-checkout', 'set', '--no-cone', ...hd.nguon.lay_ve], dir);
  sh('git', ['fetch', '-q', '--depth', '1', '--filter=blob:none', 'origin', hd.nguon.commit], dir);
  sh('git', ['checkout', '-q', 'FETCH_HEAD'], dir);
  const head = sh('git', ['rev-parse', 'HEAD'], dir).trim();
  if (head !== hd.nguon.commit) throw new Error(`lấy về ${head}, ghim ${hd.nguon.commit}`);
  sh('npm', ['ci', '--omit=dev', '--ignore-scripts', '--workspaces=false', '--no-audit', '--no-fund'], dir);
  writeFileSync(dau, `${ky}\n`);
  return dir;
}

// `ui` dựng từ src/cli.ts như tsup của upstream (deps runtime gói vào). Bản dựng đặt DƯỚI gốc
// nguồn vì gate tìm knowledge/personas/families.json bằng cách đi ngược từ vị trí module.
export function dungCli(goc) {
  const out = join(goc, '.design-floor-build', 'cli.mjs');
  if (!existsSync(out)) {
    esbuild().buildSync({
      absWorkingDir: goc,
      entryPoints: ['src/cli.ts'],
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node20',
      outfile: out,
      logLevel: 'error',
    });
  }
  return out;
}

export function bam(duong) {
  return createHash('sha256').update(readFileSync(duong)).digest('hex');
}

export function soDong(duong) {
  return readFileSync(duong, 'utf8').split('\n').length;
}

// Đóng kín của MỘT điểm vào: mọi tệp của kho upstream esbuild kéo theo — src/ và cả JSON nhập
// từ schemas/ — (import chỉ-kiểu bị bỏ như lúc chạy) và mọi import ngoài (builtin node + gói npm).
export async function dongKin(goc, entry) {
  const r = await esbuild().build({
    absWorkingDir: goc,
    entryPoints: [entry],
    bundle: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    write: false,
    metafile: true,
    logLevel: 'silent',
  });
  const tep = Object.keys(r.metafile.inputs).filter((f) => !f.startsWith('node_modules/')).sort();
  const ngoai = new Set();
  for (const i of Object.values(r.metafile.inputs)) for (const im of i.imports) if (im.external) ngoai.add(im.path);
  return { tep, ngoai: [...ngoai].sort() };
}

// Mã không chú thích — để phép quét token mạng không bắt nhầm lời giải thích (bài học `-an`).
export function boChuThich(duong) {
  const loader = /\.json$/.test(duong) ? 'json' : /\.tsx$/.test(duong) ? 'tsx' : 'ts';
  return esbuild().transformSync(readFileSync(duong, 'utf8'), { loader, legalComments: 'none' }).code;
}
