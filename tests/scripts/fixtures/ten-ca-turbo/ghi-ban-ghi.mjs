#!/usr/bin/env node
// ghi-ban-ghi.mjs — ghi bản ghi turbo + bun THẬT cho ca ten-ca-qua-tien-to (công thức của NGUON.md).
// Chạy lệnh suite qua CHÍNH `chayLenh` của làn ghim lại (bash -c, ống, không TTY, env kế thừa) và in
// `out + "\n" + err` — đúng chuỗi repin-lane.mjs đưa vào rutTenCa. Cần turbo (TURBO_BIN hoặc PATH), bun, git.
//   node tests/scripts/fixtures/ten-ca-turbo/ghi-ban-ghi.mjs > tests/scripts/fixtures/ten-ca-turbo/turbo-bun.log
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..', '..', '..');
const { chayLenh } = await import(pathToFileURL(path.join(ROOT, 'feature-loop', 'scripts', 'lib', 'chay-lenh.mjs')).href);

const tim = (ten) => { try { return execFileSync('bash', ['-c', `command -v ${ten}`], { encoding: 'utf8' }).trim(); } catch { return ''; } };
const TURBO = process.env.TURBO_BIN || tim('turbo');
const BUN = tim('bun');
if (!TURBO || !BUN) { console.error('can turbo + bun tren may (TURBO_BIN hoac PATH)'); process.exit(3); }

const kho = realpathSync(mkdtempSync(path.join(tmpdir(), 'tctt-ghi-')));
try {
  const viet = (rel, nd) => { const p = path.join(kho, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, nd); };
  const bunVer = execFileSync(BUN, ['--version'], { encoding: 'utf8' }).trim();
  viet('package.json', JSON.stringify({ name: 'kho-thu', private: true, packageManager: `bun@${bunVer}`, workspaces: ['packages/*'] }) + '\n');
  viet('packages/goi/package.json', JSON.stringify({ name: '@kho/goi', private: true, scripts: { test: 'bun test' } }) + '\n');
  // Ba ca: một đỏ (vật đo), một xanh, và một xanh có tên chứa «: (fail) » — bẫy cho bộ bóc tiền tố quá tay.
  viet('packages/goi/ca.test.ts', [
    'import { describe, expect, test } from "bun:test";',
    'describe("app-rieng", () => {',
    '  test("chay canh apps/agent", () => { expect(503).toBe(404); });',
    '  test("van xanh", () => { expect(1).toBe(1); });',
    '  test("doc: (fail) dong le", () => { expect(2).toBe(2); });',
    '});',
    '',
  ].join('\n'));
  viet('turbo.json', JSON.stringify({ $schema: 'https://turbo.build/schema.json', ui: 'tui', tasks: { test: { cache: false } } }) + '\n');
  execFileSync('git', ['init', '-q', kho]);
  execFileSync(BUN, ['install'], { cwd: kho, stdio: 'ignore' });
  // Hình dạng lệnh của crm: scripts test-run.ts gọi `turbo run test --concurrency=1 --filter=<gói>`.
  const env = { ...process.env, TURBO_TELEMETRY_DISABLED: '1', DO_NOT_TRACK: '1' };
  const r = await chayLenh(`"${TURBO}" run test --concurrency=1 --filter=@kho/goi`, { cwd: kho, env }).done;
  const an = (s) => s.split(kho).join('<kho-tam>').split(BUN).join('<bun>');
  process.stdout.write(an(`${r.out}\n${r.err}`));
} finally {
  rmSync(kho, { recursive: true, force: true });
}
