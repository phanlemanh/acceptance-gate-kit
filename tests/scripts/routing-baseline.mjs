#!/usr/bin/env node
// routing-baseline.mjs — NGUỒN DUY NHẤT của bản ghi mốc định tuyến
// `tests/scripts/fixtures/routing-baseline.txt`: vừa là WRITER (lệnh sinh dòng
// cho một hồ sơ vừa được ký), vừa xuất hai vị từ mà READER (ca LM20 trong
// gate-card-lmcms.test.mjs) NHẬP từ đây.
//
// Vì sao tồn tại (hồ sơ chu-ky-khong-tu-lam-hoa-cu, 15/09/2026): LM20 chỉ ghim
// hồ sơ `settled` (có `human_signoff`), nên CHÍNH hành động ký đưa hồ sơ vào
// diện quét và buộc baseline thêm một dòng. Trước vòng này dòng ấy được thêm
// TAY sau chữ ký → commit sau verify → bằng chứng hoá cũ → một làn re-pin 13
// phút nữa. Nay baseline là vật T1 máy sinh (ADR 0017, cùng lớp PRODUCT-MAP ở
// ADR 0007) và dòng của nó do lệnh này sinh trong CÙNG lượt ký.
//
//   node tests/scripts/routing-baseline.mjs --root <repo> --slug <slug> [--write]
//
// exit 0 = xong (in dòng ra stdout; có --write thì đã ghi vào fixture)
//      2 = không kết luận được: hồ sơ chưa ký, gate-card sập, JSON hỏng, thiếu
//          tệp. KHÔNG bao giờ ghi một dòng đoán.
//      3 = usage.
//
// KHÔNG vào gói plugin (kit-nội-bộ, cùng chỗ với mirror-sync-grandfather.mjs):
// nó canh một fixture của SUITE kit, không phải hành vi của engine.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// Đường dẫn SUY TỪ VỊ TRÍ SCRIPT, không hardcode ROOT (luật «thước gắn vào vật»,
// hình dạng 4 — phép đo từng so với checkout của tác giả thay vì cây đang kiểm).
export const FIXTURE_REL = 'tests/scripts/fixtures/routing-baseline.txt';
const GATE_CARD = path.join(HERE, '..', '..', 'scripts', 'gate-card.js');

// ── Vị từ 1: hồ sơ đã ĐỊNH ĐOẠT chưa ────────────────────────────────────────
// `[ \t]*` chứ KHÔNG `\s*`: \s nuốt cả xuống dòng, nên chữ ký RỖNG sẽ khớp dòng
// kế và một hồ sơ chưa ký bị tính là đã ký.
export function settled(root, slug) {
  try {
    const m = fs.readFileSync(path.join(root, '_acceptance', slug, 'evidence-report.md'), 'utf8')
      .match(/^human_signoff:[ \t]*(\S.*)$/m);
    return !!m && m[1].trim().length > 0;
  } catch { return false; }
}

// ── Vị từ 2: khuôn MỘT DÒNG của bản ghi mốc ─────────────────────────────────
// Cả writer (lệnh này) lẫn reader (LM20) dựng dòng bằng ĐÚNG hàm này — hai bản
// chép khuôn là hai thứ sẽ trôi khỏi nhau (lớp lỗi writer/reader, CLAUDE.md).
export function routingLine(slug, routing) {
  const rt = routing || {};
  return `${slug}\thoi=${(rt.hoi || []).join('|')}\tbao=${(rt.bao || []).join('|')}`;
}

// ── Rút routing của một hồ sơ bằng chính bộ dựng thẻ ────────────────────────
// Trả { line } hoặc { err } — KHÔNG ném, để bên gọi quyết định exit.
export function extractRouting(root, slug, gateCard = GATE_CARD) {
  const r = spawnSync('node', [gateCard, '--root', root, '--slug', slug, '--extract'], { encoding: 'utf8' });
  if (r.status !== 0) return { err: `gate-card --extract thoát ${r.status} cho hồ sơ «${slug}» — không kết luận được routing, KHÔNG ghi gì:\n${(r.stderr || '').trim().split('\n').slice(-5).join('\n')}` };
  let j;
  try { j = JSON.parse(r.stdout); } catch { return { err: `gate-card --extract trả JSON không đọc được cho hồ sơ «${slug}» — KHÔNG ghi gì` }; }
  if (!j || typeof j !== 'object') return { err: `gate-card --extract trả giá trị không phải object cho hồ sơ «${slug}» — KHÔNG ghi gì` };
  return { line: routingLine(slug, j.routing) };
}

// ── Ghi: THAY hoặc THÊM đúng dòng của slug, mọi dòng khác nguyên văn ────────
// Không sinh lại trọn tệp: dòng của các hồ sơ cũ LÀ bản ghi mốc — sinh lại tất
// sẽ nuốt đúng hồi quy định tuyến mà LM20 sinh ra để bắt.
export function spliceLine(text, slug, line) {
  const eol = text.endsWith('\n') || text === '' ? '\n' : '';
  const lines = text.split('\n');
  const isSlug = l => l.split('\t')[0] === slug && !l.startsWith('#');
  const at = lines.findIndex(isSlug);
  if (at >= 0) { lines[at] = line; return lines.join('\n'); }
  // Thêm mới: chèn trước đuôi rỗng để tệp giữ đúng một newline cuối.
  let end = lines.length;
  while (end > 0 && lines[end - 1] === '') end -= 1;
  lines.splice(end, 0, line);
  return lines.join('\n') + (eol && !text.endsWith('\n') ? '\n' : '');
}

// ── CLI ─────────────────────────────────────────────────────────────────────
const isMain = process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
if (isMain) {
  const usage = (m) => { console.error(`routing-baseline: ${m}\nusage: routing-baseline.mjs --root <repo> --slug <slug> [--write]`); process.exit(3); };
  const die = (m) => { console.error(`routing-baseline: ${m}`); process.exit(2); };
  const flags = {};
  {
    const argv = process.argv.slice(2);
    for (let i = 0; i < argv.length; i += 1) {
      const tok = argv[i];
      if (!tok.startsWith('--')) usage(`tham số lạ (không phải cờ): ${tok}`);
      const name = tok.slice(2);
      if (!['root', 'slug', 'write'].includes(name)) usage(`cờ không nhận diện được: ${tok}`);
      if (name === 'write') { flags.write = true; continue; }
      if (argv[i + 1] === undefined || argv[i + 1].startsWith('--')) usage(`cờ ${tok} thiếu giá trị`);
      flags[name] = argv[i + 1]; i += 1;
    }
  }
  if (!flags.root || !flags.slug) usage('thiếu --root hoặc --slug');
  const root = (() => { try { return fs.realpathSync(flags.root); } catch { return die(`--root không tồn tại: ${flags.root}`); } })();
  const slug = flags.slug;

  if (!settled(root, slug)) die(`hồ sơ «${slug}» chưa ký (human_signoff rỗng hoặc không đọc được evidence-report.md) — bản ghi mốc chỉ nhận hồ sơ đã ĐỊNH ĐOẠT, KHÔNG ghi gì`);

  const got = extractRouting(root, slug);
  if (got.err) die(got.err);

  if (!flags.write) { process.stdout.write(got.line + '\n'); process.exit(0); }

  const fixture = path.join(root, FIXTURE_REL);
  let prev;
  try { prev = fs.readFileSync(fixture, 'utf8'); } catch { die(`không đọc được bản ghi mốc: ${fixture}`); }
  const next = spliceLine(prev, slug, got.line);
  if (next === prev) { console.error(`routing-baseline: dòng của «${slug}» đã đúng — không đổi tệp`); process.stdout.write(got.line + '\n'); process.exit(0); }
  fs.writeFileSync(fixture, next);
  console.error(`routing-baseline: ghi dòng của «${slug}» vào ${FIXTURE_REL}`);
  process.stdout.write(got.line + '\n');
}
