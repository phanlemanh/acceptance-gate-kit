// Danh sách grandfather cho một khoá config ĐÃ CHẾT — MỘT bản, hai bên đọc.
//
// Vì sao tồn tại: hồ sơ `luu-kho-codex-va-nghi-le-design` gỡ khoá
// `executors.script.mirror_sync` khỏi `_acceptance/config.yaml` (đó là tiêu chí
// AC-9 của nó, owner duyệt 12/08). 21 hồ sơ ĐÃ KÝ có eval khai
// `verifier: config:executors.script.mirror_sync`, nên `recheck-evidence.cjs`
// đỏ trên chúng vĩnh viễn. Không hồ sơ nào trong 21 sửa được mà không **viết
// vào vật đã ký** — mục *Out of scope* của hồ sơ ấy khai thẳng "hồ sơ
// `_acceptance/` cũ là sử liệu bất biến".
//
// Đây là ALLOWLIST CÓ TÊN, không phải nới ngưỡng. Ba ràng buộc giữ nó khỏi
// trượt thành cái cửa mở:
//   1. Chỉ che hồ sơ CÓ TÊN trong danh sách dưới. Hồ sơ mới đỏ → vẫn ĐỎ.
//   2. Chỉ che đúng MỘT lý do: thông điệp lỗi phải nhắc `mirror_sync`. Cùng hồ
//      sơ đó hỏng vì lý do KHÁC → vẫn ĐỎ. Không có vế này thì một cái tên trong
//      danh sách che luôn mọi lỗi tương lai của hồ sơ ấy.
//   3. HAI CHIỀU: tên trong danh sách mà hồ sơ đã HẾT đỏ → cũng ĐỎ, đòi rút
//      tên. Chặn thói đổ sẵn danh sách dài cho khỏi phải nghĩ — cùng khuôn
//      `tests/plugins/asserts-da-go.txt` và bảng miễn trừ của bộ răng lưu-kho.
//
// Trigger XOÁ cả tệp này: khi 21 hồ sơ dưới đây không còn được `recheck` soi
// (chúng rời corpus), hoặc khi có quyết định migrate chúng. Xem ADR 0010.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

// 21 hồ sơ đã ký, đo tại chỗ 2026-08-13 — KHÔNG chép tay từ log.
export const MIRROR_SYNC_GRANDFATHER = [
  'claim-scan-parser-hardening', 'consumer-copy-cjs', 'context-ladder',
  'cross-feature-claim-index', 'delta-verify-repin', 'design-pass-skill',
  'discovery-brainstorm-socket', 'docs-first-run-audit', 'findings-section-boundary',
  'gate-card-ac-visibility', 'hinh-theo-mat-phang', 'judgment-question-guard',
  'may-ganh-nguoi-quyet', 'mot-luot-go-cong-nguoi', 'ngon-ngu-mat-nguoi',
  'pha3-goi-luoi', 'product-map-uat-session', 'rang-phep-do-viec-cua-anh',
  'stale-theo-diff-pr', 'start-command', 'start-scan-hardening',
];

const DEAD_KEY = 'executors.script.mirror_sync';

// Chạy recheck trên MỌI report thật, trả {slug, err} cho từng hồ sơ đỏ.
export function recheckCorpus(root) {
  const acc = path.join(root, '_acceptance');
  const reports = readdirSync(acc)
    .map(s => path.join(acc, s, 'evidence-report.md'))
    .filter(existsSync);
  const bad = [];
  for (const r of reports) {
    try {
      execFileSync('node', [path.join(root, 'scripts/recheck-evidence.cjs'), r],
        { stdio: ['ignore', 'ignore', 'pipe'] });
    } catch (e) {
      bad.push({ slug: path.basename(path.dirname(r)), err: String(e.stderr || '') });
    }
  }
  return { reports, bad };
}

// Phân loại một tập đỏ thành {ngoaiDanhSach, saiLyDo, khaiThua}. Rỗng cả ba = ĐẠT.
export function classify(bad) {
  const allow = new Set(MIRROR_SYNC_GRANDFATHER);
  const ngoaiDanhSach = bad.filter(b => !allow.has(b.slug)).map(b => b.slug);
  const saiLyDo = bad
    .filter(b => allow.has(b.slug) && !b.err.includes(DEAD_KEY))
    .map(b => `${b.slug} (${b.err.replace(/\s+/g, ' ').slice(0, 80)})`);
  const doRoi = new Set(bad.map(b => b.slug));
  const khaiThua = MIRROR_SYNC_GRANDFATHER.filter(s => !doRoi.has(s));
  return { ngoaiDanhSach, saiLyDo, khaiThua };
}

export function assertCorpus(assert, root, label) {
  const { reports, bad } = recheckCorpus(root);
  assert.ok(reports.length >= 10, `sanity: chỉ ${reports.length} report — glob hỏng?`);
  const { ngoaiDanhSach, saiLyDo, khaiThua } = classify(bad);
  assert.deepEqual(ngoaiDanhSach, [],
    `${label}: hồ sơ đỏ NGOÀI danh sách grandfather — đây là lỗi mới, không phải nợ cũ: ${ngoaiDanhSach.join(', ')}`);
  assert.deepEqual(saiLyDo, [],
    `${label}: hồ sơ trong danh sách nhưng đỏ vì lý do KHÁC "${DEAD_KEY}" — grandfather chỉ che đúng một lý do: ${saiLyDo.join('; ')}`);
  assert.deepEqual(khaiThua, [],
    `${label}: tên khai trong danh sách mà hồ sơ ĐÃ HẾT đỏ — rút tên ra, đừng để danh sách phình: ${khaiThua.join(', ')}`);
}
