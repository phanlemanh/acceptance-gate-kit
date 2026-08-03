#!/usr/bin/env node
// product-map.mjs — bản đồ sản phẩm SINH từ hồ sơ xưởng (_acceptance/*/ +
// .out-of-scope/). View, không phải kho: regenerate = hết trôi.
//
// Bucket cố ý THÔ — approved/implemented/verified gộp MỘT nhãn — để bản đồ
// đứng yên giữa hai lần đóng cổng người. Nếu bucket bám sát từng status thì
// mỗi bước máy chạy xong lại làm `--check` đỏ giữa vòng, và cái đỏ-oan đó dạy
// người ta bỏ qua màu đỏ. Bản đồ đổi ở đúng chỗ người ký.
//
// Reader duy nhất là frontmatterField của lib/evidence-core.js: không parser
// fence thứ hai (tiền lệ start-command S4-r1 — parser riêng chặt hơn reader
// chuẩn thì báo hỏng oan những hồ sơ mọi cổng khác đọc được).
import { readFileSync, readdirSync, existsSync, writeFileSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { frontmatterField } = require(path.join(__dirname, '..', 'lib', 'evidence-core.js'));
// Luật "hồ sơ này có hỏng không" sống một chỗ và được CẢ bộ quét vào phiên
// dùng chung — xem lib/workspace-record.js để biết vì sao (S4-r1: hai bên đọc
// cùng hồ sơ cho hai kết luận trái nhau).
const { recordProblem, navValues, NAV_ENUMS } =
  require(path.join(__dirname, '..', 'lib', 'workspace-record.js'));

export { NAV_ENUMS };

const SECTIONS = [
  ['can-nhac', 'Đang cân nhắc cơ hội'],
  ['sap-mo', 'Sắp mở vòng'],
  ['cho-duyet', 'Vòng đang mở — chờ duyệt phạm vi'],
  ['dang-dung', 'Vòng đang mở — đang dựng và nghiệm thu máy'],
  ['cho-nghiem-thu', 'Đã ship — chờ phiên nghiệm thu'],
  ['da-ship', 'Đã ship'],
  ['da-nghiem-thu', 'Đã nghiệm thu giá trị'],
  ['xep-lai', 'Xếp lại sau'],
  ['da-bac', 'Đã bác từ khám phá'],
  ['ngoai-pham-vi', 'Ngoài phạm vi đã ký'],
  ['hong', 'Hồ sơ hỏng'],
];
const UAT_KET_CUC = {
  release: 'giao rộng (release)',
  iterate: 'lặp thêm (iterate)',
  kill: 'dừng (kill)',
};

const read = p => { try { return readFileSync(p, 'utf8'); } catch { return null; } };
const fm = (txt, key) => (txt == null ? null : frontmatterField(txt, key));
const low = v => (v == null ? null : v.toLowerCase());

// Cạnh chỉ hiện khi hồ sơ THẬT có khai — vắng thì im, không placeholder.
// (Write-side `epic:` thuộc vòng khám phá; đây chỉ là bên đọc.)
function edges(cTxt, oTxt) {
  const pick = k => fm(cTxt, k) || fm(oTxt, k) || '';
  const out = [];
  const epic = pick('epic'); if (epic) out.push(`epic: ${epic}`);
  const sup = pick('supersedes'); if (sup) out.push(`thay thế: ${sup}`);
  const rel = pick('relates'); if (rel) out.push(`liên quan: ${rel}`);
  return out.length ? ' · ' + out.join(' · ') : '';
}

function classify(dir, slug) {
  const cTxt = read(path.join(dir, 'contract.md'));
  const oTxt = read(path.join(dir, 'opportunity.md'));
  const uTxt = read(path.join(dir, 'uat-session.md'));
  // `feature:` hay mở đầu bằng chính slug ("<slug> — mô tả"); dòng bản đồ đã
  // in slug rồi nên để nguyên là đọc thành tiếng máy vọng lại hai lần.
  const rawName = fm(cTxt, 'feature') || fm(oTxt, 'feature') || fm(uTxt, 'feature') || slug;
  const name = rawName.startsWith(slug + ' — ') ? rawName.slice(slug.length + 3) : rawName;
  const edge = edges(cTxt, oTxt);
  const texts = { 'contract.md': cTxt, 'opportunity.md': oTxt, 'uat-session.md': uTxt };

  // Lượt 1 — luật chung: hồ sơ đọc được không? (file có mà frontmatter hỏng,
  // field bắt buộc rỗng, giá trị ngoài enum — tất cả là hỏng, không cái nào
  // được rơi vào khoảng trống rồi hiện ở một ô bình thường.)
  const problem = recordProblem(texts);
  if (problem) return { key: 'hong', slug, file: problem.file, reason: problem.reason };

  // Lượt 2 — xếp ô, tra từ artifact muộn nhất về sớm nhất.
  const { status, decision, verdict } = navValues(texts);
  if (verdict) return { key: 'da-nghiem-thu', slug, name, edge, note: UAT_KET_CUC[verdict] };

  if (status) {
    if (status === 'signed-off') {
      // Đường A (cơ hội quyết build/iterate) còn một cổng người nữa: phiên
      // nghiệm thu. Đường B/C/E ship thẳng — không dựng phiên giả cho chúng.
      const duongA = decision === 'build' || decision === 'iterate';
      return { key: duongA ? 'cho-nghiem-thu' : 'da-ship', slug, name, edge };
    }
    if (status === 'draft') return { key: 'cho-duyet', slug, name, edge };
    return { key: 'dang-dung', slug, name, edge };
  }

  const stage = low(fm(oTxt, 'stage')) || '';
  if (stage !== 'decided' || !decision) return { key: 'can-nhac', slug, name, edge };
  if (decision === 'build' || decision === 'iterate') return { key: 'sap-mo', slug, name, edge };
  if (decision === 'park') return { key: 'xep-lai', slug, name, edge };
  return { key: 'da-bac', slug, name, edge };
}

export function renderProductMap(root) {
  const acc = path.join(root, '_acceptance');
  const buckets = Object.fromEntries(SECTIONS.map(([k]) => [k, []]));

  if (existsSync(acc)) {
    for (const entry of readdirSync(acc, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const item = classify(path.join(acc, entry.name), entry.name);
      buckets[item.key].push(item);
    }
  }

  const oos = path.join(root, '.out-of-scope');
  if (existsSync(oos)) {
    for (const f of readdirSync(oos)) {
      if (!f.endsWith('.md')) continue;
      const txt = read(path.join(oos, f)) || '';
      const title = (txt.split('\n').find(l => l.startsWith('# ')) || '# ' + f).slice(2).trim();
      buckets['ngoai-pham-vi'].push({ slug: f.replace(/\.md$/, ''), name: title, file: f });
    }
  }

  // Không timestamp, sort theo slug: hai lần chạy phải cho hai bản giống hệt,
  // nếu không thì `--check` không so được bằng đẳng thức.
  const lines = [
    '# Bản đồ sản phẩm',
    '',
    '> Máy sinh từ hồ sơ trong `_acceptance/` và `.out-of-scope/` — đừng sửa tay.',
    '> Bản đồ được làm mới ở mỗi lần một người ký một cổng.',
    '',
  ];
  for (const [key, title] of SECTIONS) {
    const items = buckets[key].sort((a, b) => a.slug.localeCompare(b.slug));
    if (!items.length) continue;
    lines.push(`## ${title}`, '');
    for (const it of items) {
      if (key === 'hong') lines.push(`- **${it.slug}** — \`${it.file}\`: ${it.reason}`);
      else if (key === 'ngoai-pham-vi') lines.push(`- **${it.name}** (\`.out-of-scope/${it.file}\`)`);
      else lines.push(`- **${it.slug}** — ${it.name}${it.note ? ` — ${it.note}` : ''}${it.edge}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

// ─── CLI ───
// So bằng realpath, KHÔNG bằng path.resolve: loader ESM đã giải symlink cho
// import.meta.url trong khi argv[1] giữ nguyên đường người gõ. Repo nằm dưới
// một symlink (/tmp, /var/folders trên macOS, home mount…) thì hai chuỗi khác
// nhau, khối CLI im lặng không chạy, và `--check` exit 0 mà chẳng kiểm gì —
// đúng dạng false-green. Case P106 chạy trong bản sao dưới /var/folders bắt
// được điều này.
const isMain = (() => {
  if (!process.argv[1]) return false;
  const same = (a, b) => { try { return realpathSync(a) === realpathSync(b); } catch { return false; } };
  return same(process.argv[1], __filename) ||
    path.resolve(process.argv[1]) === path.resolve(__filename);
})();
if (isMain) {
  const args = process.argv.slice(2);
  const rootIx = args.indexOf('--root');
  const root = path.resolve(rootIx >= 0 && args[rootIx + 1] ? args[rootIx + 1] : '.');
  const mapPath = path.join(root, 'PRODUCT-MAP.md');
  const check = args.includes('--check');
  // Gợi ý lệnh phải chạy được ở CHÍNH repo đang đỏ, nên suy từ vị trí script
  // thật: tự host → `scripts/product-map.mjs`; repo tiêu thụ → đường dẫn
  // plugin. Ghim một đường dẫn self-host vào đây là đưa consumer một lệnh
  // exit 127 ngay lúc họ cần nó nhất.
  const rel = path.relative(root, __filename);
  const hint = rel && !rel.startsWith('..') ? rel : __filename;

  if (!existsSync(path.join(root, '_acceptance', 'config.yaml'))) {
    console.log('Repo chưa dựng cổng nghiệm thu — chưa có gì để vẽ bản đồ.');
    process.exit(0);
  }
  const rendered = renderProductMap(root);
  if (!check) {
    writeFileSync(mapPath, rendered);
    console.log(mapPath);
    process.exit(0);
  }
  if (!existsSync(mapPath)) {
    console.log('PRODUCT-MAP.md chưa có — repo chưa dựng bản đồ; nó sẽ tự sinh ở lần đóng cổng người kế.');
    process.exit(0);
  }
  if (read(mapPath) === rendered) {
    console.log('PRODUCT-MAP.md khớp hồ sơ xưởng.');
    process.exit(0);
  }
  console.error(`PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node ${hint} --root .`);
  process.exit(1);
}
