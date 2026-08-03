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
import { execFileSync } from 'node:child_process';
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
const { recordProblem, navValues, consumedTexts, usesUat, usesOpportunity,
        readRecord, ioReason, configList, NAV_RULES } =
  require(path.join(__dirname, '..', 'lib', 'workspace-record.js'));

export { NAV_RULES };

// Tên ô nói VIỆC ĐANG Ở ĐÂU, không gọi tên cơ chế máy (N1). Thứ tự cố định —
// nó cũng là thứ tự các chặng trong hình.
const SECTIONS = [
  ['can-nhac', 'Đang cân nhắc cơ hội'],
  ['sap-mo', 'Sắp mở vòng'],
  ['cho-duyet', 'Chờ duyệt phạm vi'],
  ['dang-dung', 'Đang làm'],
  ['cho-nghiem-thu', 'Đã giao — chờ phiên nghiệm thu'],
  ['da-ship', 'Đã giao'],
  ['da-nghiem-thu', 'Đã nghiệm thu giá trị'],
  ['xep-lai', 'Xếp lại sau'],
  ['da-bac', 'Đã bác từ khám phá'],
  ['ngoai-pham-vi', 'Ngoài phạm vi đã ký'],
  ['hong', 'Hồ sơ hỏng'],
];

// HÌNH dẫn đầu, chữ là chú thích (N5). Bản đồ là điểm quyết định — người ta
// đọc nó lúc chọn việc tiếp theo — và nó có 3+ chặng nối tiếp cùng 2 nhánh rẽ,
// tức vượt ngưỡng bắt buộc kèm sơ đồ. Mặt phẳng ở đây là tài liệu trong kho,
// nên cách vẽ đúng theo bảng tra DECISION-DIAGRAM-SURFACES là khối mermaid.
const dem = n => (n === 0 ? 'chưa có' : `${n} việc`);
function mermaidBlock(count) {
  const n = key => dem(count[key] || 0);
  const lines = [
    '```mermaid',
    'flowchart TD',
    `  A["Đang cân nhắc cơ hội<br/>${n('can-nhac')}"] --> GD{"Cổng Đáng"}`,
    `  GD --> B["Sắp mở vòng<br/>${n('sap-mo')}"]`,
    `  GD --> XL["Xếp lại sau<br/>${n('xep-lai')}"]`,
    `  GD --> DB["Đã bác từ khám phá<br/>${n('da-bac')}"]`,
    `  B --> CD["Chờ duyệt phạm vi<br/>${n('cho-duyet')}"] --> GP{"Cổng Phạm vi"}`,
    `  GP --> DL["Đang làm<br/>${n('dang-dung')}"] --> GB{"Cổng Bằng chứng"}`,
    `  GB --> DG["Đã giao<br/>${n('da-ship')}"]`,
    `  GB --> CN["Chờ phiên nghiệm thu<br/>${n('cho-nghiem-thu')}"] --> GG{"Cổng Giá trị"}`,
    `  GG --> NT["Đã nghiệm thu giá trị<br/>${n('da-nghiem-thu')}"]`,
  ];
  // Ô hỏng KHÔNG nằm trong mạch — nó là cờ. Chỉ hiện khi có, và hiện thì phải
  // đập vào mắt chứ không nấp cuối danh sách.
  if (count.hong) lines.push(`  HS["Hồ sơ hỏng<br/>${dem(count.hong)}"]`);
  lines.push('```');
  return lines;
}
const UAT_KET_CUC = {
  release: 'giao rộng (release)',
  iterate: 'lặp thêm (iterate)',
  kill: 'dừng (kill)',
};

// Doc file KHONG phai ho so workspace (chinh PRODUCT-MAP.md khi so noi dung,
// va cac de xuat trong .out-of-scope/). Ho so workspace di qua readRecord cua
// luat chung — phan biet ENOENT voi loi khac, khong nuot chung mot ro.
const readPlain = p => { try { return readFileSync(p, 'utf8'); } catch { return null; } };
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
  // Đọc LƯỜI và phân biệt lỗi, đúng thứ tự bộ quét đi: mở file nào là câu hỏi
  // của luật chung. Đọc cả ba vô điều kiện thì (a) lỗi quyền ở một hồ sơ trạng
  // thái hiện tại không dùng lại quyết định ô của slug, và (b) `read` cũ nuốt
  // mọi lỗi thành "vắng" nên một contract.md mất quyền đọc bị xếp xuống đường
  // opportunity — bản đồ nói "Sắp mở vòng" trong khi bộ quét nói hỏng (S4-r14).
  const cR = readRecord(path.join(dir, 'contract.md'));
  if (cR.err) return { key: 'hong', slug, file: 'contract.md', reason: ioReason(cR.err) };
  const cTxt = cR.t;
  const uR = readRecord(path.join(dir, 'uat-session.md'));
  const oR = readRecord(path.join(dir, 'opportunity.md'));

  // HAI câu hỏi khác nhau, đừng trộn:
  //   PHÂN Ô — hồ sơ nào được quyền quyết định ô của slug, và lỗi của hồ sơ nào
  //     làm slug thành hỏng. Câu này do luật chung trả lời (consumedTexts), và
  //     lỗi ở hồ sơ KHÔNG được tiêu thụ thì không quyết định gì.
  //   HIỂN THỊ — tên việc và các cạnh (epic/thay thế/liên quan) lấy ở đâu. Câu
  //     này đọc CẢ BA, luôn luôn: `epic:` được khai lúc khám phá, tức nằm trong
  //     opportunity.md — mà opportunity chỉ được TIÊU THỤ khi chưa có hợp đồng
  //     hoặc đã ký. S4-r14 tôi gộp hai câu này làm một, nên suốt cả pha dựng
  //     (draft→verified) bản đồ mất tên việc lẫn mọi cạnh của hồ sơ khám phá
  //     (S4-r15 dựng lại được: `- Ban do gia tri (\`x\`) · epic: EP-1` thành
  //     `- \`x\``). Lỗi đọc ở hồ sơ không tiêu thụ chỉ làm mất phần hiển thị
  //     của nó, không làm hỏng slug.
  if (usesUat(cTxt) && uR.err)
    return { key: 'hong', slug, file: 'uat-session.md', reason: ioReason(uR.err) };
  if (usesOpportunity(cTxt, usesUat(cTxt) ? uR.t : null) && oR.err)
    return { key: 'hong', slug, file: 'opportunity.md', reason: ioReason(oR.err) };
  const uTxt = uR.t, oTxt = oR.t;
  // `feature:` hay mở đầu bằng chính slug ("<slug> — mô tả"); dòng bản đồ đã
  // in slug rồi nên để nguyên là đọc thành tiếng máy vọng lại hai lần.
  const rawName = fm(cTxt, 'feature') || fm(oTxt, 'feature') || fm(uTxt, 'feature') || slug;
  const name = rawName.startsWith(slug + ' — ') ? rawName.slice(slug.length + 3) : rawName;
  const edge = edges(cTxt, oTxt);
  // uat-session.md CHỈ được TIÊU THỤ khi hợp đồng đã ký — một phiên nghiệm thu
  // nằm cạnh hợp đồng còn draft là hồ sơ chưa tới lượt, lỗi của nó không được
  // quyết định ô của slug. Doctrine này của start-scan-hardening (học qua 4
  // round), và bộ quét vào phiên áp cùng luật — hai bên đọc phải tiêu thụ CÙNG
  // tập hồ sơ thì mới có nghĩa khi so kết luận (case P123).
  // ĐIỀU KIỆN TIÊU THỤ do LUẬT CHUNG trả lời — chép lại điều kiện ở đây là
  // đúng cách hai reader trôi khỏi nhau suốt r12/r13 dù bảng enum đã gom.
  const texts = consumedTexts({ contract: cTxt, opportunity: oTxt, uat: uTxt });

  // Lượt 1 — luật chung: hồ sơ đọc được không? (file có mà frontmatter hỏng,
  // field bắt buộc rỗng, giá trị ngoài enum — tất cả là hỏng, không cái nào
  // được rơi vào khoảng trống rồi hiện ở một ô bình thường.)
  const problem = recordProblem(texts);
  if (problem) return { key: 'hong', slug, file: problem.file, reason: problem.reason };

  // Lượt 2 — xếp ô, tra từ artifact muộn nhất về sớm nhất.
  const { status, stage, decision, verdict } = navValues(texts);
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
      const txt = readPlain(path.join(oos, f)) || '';
      const title = (txt.split('\n').find(l => l.startsWith('# ')) || '# ' + f).slice(2).trim();
      buckets['ngoai-pham-vi'].push({ slug: f.replace(/\.md$/, ''), name: title, file: f });
    }
  }

  // Không timestamp, sort theo slug: hai lần chạy phải cho hai bản giống hệt,
  // nếu không thì `--check` không so được bằng đẳng thức.
  const lines = [
    '# Bản đồ sản phẩm',
    '',
    '> Bản đồ vẽ lại từ hồ sơ của xưởng mỗi lần một người ký một cổng — đừng sửa tay.',
    '> (đọc từ thư mục `_acceptance/` và `.out-of-scope/`)',
    '',
    ...mermaidBlock(Object.fromEntries(SECTIONS.map(([k]) => [k, buckets[k].length]))),
    '',
  ];
  for (const [key, title] of SECTIONS) {
    const items = buckets[key].sort((a, b) => a.slug.localeCompare(b.slug));
    if (!items.length) continue;
    lines.push(`## ${title}`, '');
    for (const it of items) {
      // Tên việc đứng trước, slug xuống cuối dòng trong ngoặc: mã là thứ để
      // TRA CỨU, không phải nội dung (N3). Không in đậm — tên việc thừa hưởng
      // từ hồ sơ có thể dài cả câu, bôi đậm cả câu thì dòng nặng và hết quét
      // được. Hình ở đầu file mới là thứ dẫn mắt.
      if (key === 'hong') lines.push(`- \`${it.slug}\` — không đọc được hồ sơ (\`${it.file}\`): ${it.reason}`);
      else if (key === 'ngoai-pham-vi') lines.push(`- ${it.name} (\`.out-of-scope/${it.file}\`)`);
      else if (it.name === it.slug) lines.push(`- \`${it.slug}\`${it.note ? ` — ${it.note}` : ''}${it.edge}`);
      else lines.push(`- ${it.name} (\`${it.slug}\`)${it.note ? ` — ${it.note}` : ''}${it.edge}`);
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
// đúng dạng false-green. Case P119 chạy trong bản sao dưới /var/folders bắt
// được điều này.
const isMain = (() => {
  if (!process.argv[1]) return false;
  const same = (a, b) => { try { return realpathSync(a) === realpathSync(b); } catch { return false; } };
  return same(process.argv[1], __filename) ||
    path.resolve(process.argv[1]) === path.resolve(__filename);
})();
if (isMain) {
  const args = process.argv.slice(2);
  // Chốt mode + thứ tự tham số, theo đúng khuôn scripts/sync-plugin-packages.sh
  // đã dựng cho chính lớp lỗi này: một lỗi gõ (`--chek`) không được biến lệnh
  // KIỂM thành lệnh GHI rồi báo thành công — nó xoá luôn cái drift vừa tiêm.
  // Và `--root` không có giá trị thì `--check` bị nuốt làm đường dẫn, script
  // soi một thư mục không tồn tại rồi exit 0 mà chẳng kiểm gì. ADR 0007 lấy
  // `--check` làm cổng độc lập DUY NHẤT biện minh cho miễn trừ t1 của bản đồ,
  // nên `--check` fail-open là cả miễn trừ mất căn cứ.
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--check') continue;
    if (args[i] === '--root') {
      const v = args[i + 1];
      if (!v || v.startsWith('--')) {
        console.error('product-map: `--root` cần một đường dẫn ngay sau nó — nhận được ' +
          (v ? `\`${v}\`` : '(trống)'));
        process.exit(2);
      }
      i++;
      continue;
    }
    console.error(`product-map: tham số lạ ${args[i]} — chỉ nhận \`--root <thư-mục>\` và \`--check\``);
    process.exit(2);
  }
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
    // Phân biệt "repo CHƯA TỪNG dựng bản đồ" (đường đọc-cũ, hợp lệ) với "đã có
    // rồi MẤT". File được git theo dõi mà biến khỏi cây làm việc là một lần
    // XOÁ — và vì bản đồ nằm trong t1_skip_globs, một PR chỉ xoá nó vừa bỏ qua
    // cổng nghiệm thu vừa xanh ở CI nếu đây cũng exit 0. Mirror bị xoá thì P30
    // đỏ; bản đồ phải xử như vậy.
    // Hỏi INDEX thôi là fail-OPEN ở đúng hình dạng CI gặp: một PR đã COMMIT
    // việc xoá thì `actions/checkout` ra cây không còn file trong index,
    // `ls-files` thất bại, và cổng in "repo chưa dựng bản đồ" rồi exit 0 —
    // tức PR xoá bản đồ vừa bỏ qua cổng nghiệm thu vừa xanh CI (S4-r14, dựng
    // lại được). Nên hỏi thêm LỊCH SỬ: file từng bị xoá trong quá khứ cũng là
    // "đã có rồi mất". Chỉ repo chưa từng có bản đồ mới đi đường đọc-cũ.
    const gitCo = args => {
      try { return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }); }
      catch { return null; }
    };
    const trongIndex = gitCo(['ls-files', '--error-unmatch', '--', 'PRODUCT-MAP.md']) != null;
    const tungBiXoa = (gitCo(['log', '--diff-filter=D', '--format=%H', '-1', '--', 'PRODUCT-MAP.md']) || '').trim() !== '';
    // Hai chốt trên đều cần LỊCH SỬ, mà `actions/checkout` mặc định là depth 1:
    // commit bị graft nên git không thấy lần xoá nào và cổng lại fail-open y
    // như trước khi vá (S4-r15). Đặt `fetch-depth: 0` chỉ cứu CI của kit — repo
    // tiêu thụ dùng checkout mặc định thì lỗ vẫn còn, và đây là cổng độc lập
    // DUY NHẤT canh miễn trừ t1 của ADR 0007.
    //
    // Tín hiệu KHÔNG cần lịch sử: repo đã KHAI dùng bản đồ chưa. Có
    // `PRODUCT-MAP.md` trong `t1_skip_globs` = repo này bật bản đồ, nên vắng
    // bản đồ là chuyện phải sửa — dù vì bị xoá hay vì chưa vẽ lần nào. Sai về
    // phía ĐỎ ở đây là đỏ sửa được bằng đúng một lệnh đã in sẵn; sai về phía
    // xanh là một PR xoá bản đồ đi thẳng qua cổng.
    const cfgTxt = (() => { try { return readFileSync(path.join(root, '_acceptance', 'config.yaml'), 'utf8'); } catch { return ''; } })();
    const daBat = configList(cfgTxt, 't1_skip_globs').includes('PRODUCT-MAP.md');
    const daTheoDoi = trongIndex || tungBiXoa || daBat;
    if (daTheoDoi) {
      console.error(`PRODUCT-MAP.md đã bị xoá khỏi cây làm việc — khôi phục, hoặc vẽ lại: node ${hint} --root .`);
      process.exit(1);
    }
    console.log('PRODUCT-MAP.md chưa có — repo chưa bật bản đồ sản phẩm; bật thì nó tự sinh ở lần đóng cổng người kế.');
    process.exit(0);
  }
  if (readPlain(mapPath) === rendered) {
    console.log('PRODUCT-MAP.md khớp hồ sơ xưởng.');
    process.exit(0);
  }
  console.error(`PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node ${hint} --root .`);
  process.exit(1);
}
