// ghi-boi.mjs — MỘT nguồn cho «ai đã ghi vào cây trong lượt chấm» (hồ sơ tac-tu-cham-chi-cham-khong).
//
// Lượt chấm có cây đổi (lib/cay-doi.mjs, mã 6) thì bước sau-lượt `thuoc-vat --write` đọc transcript
// các tác tử của lượt, quy từng tệp đổi cho tác tử đã ghi nó, ghi ĐÚNG MỘT dòng sổ ngay sau dòng
// `cay-doi`, và tự hoàn lại cây khi đủ bốn điều kiện an toàn (design doc §3.3). Bên đọc dòng sổ:
// phiên nghiệm thu đếm ngưỡng (contract «Đường đo»). Lượt sạch không đi qua đây.
//
// Bốn việc, một tệp: timTranscript (tìm) · docTranscript (đọc) · quyTrachNhiem (quy) · hoanLai.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// <<<GHI-BOI-LINE
// {"kind":"ghi-boi-tac-tu-cham","ts":"<ISO>","round":<n>,"luot_ts":"<invokedAt>","sha":"<sha đã chấm>","tac_tu":[{"id":"agent-<…>","vai":"<nhãn>","cong_cu":["Edit"],"tep":["<đường>"]}],"tep_khong_ro":["<đường>"],"hoan_lai":false,"ly_do":"<vì sao không hoàn lại>"}
// GHI-BOI-LINE>>>
// Khoá `khong_doc_duoc` chỉ có mặt khi không đọc được transcript; `ly_do` chỉ có mặt khi hoan_lai=false.

// Động từ ghi của một đoạn lệnh shell (đoạn = phần giữa ; && || | và xuống dòng). Chuyển hướng `>`
// xét riêng theo ĐÍCH (không theo sự có mặt của `>`: `2>/dev/null` không ghi tệp nào của kho).
export const GHI_RE = /(?:^|\s)(sed\s+(?:-[a-zA-Z]*i\b|--in-place)|perl\s+-[a-zA-Z]*i|tee\b|mv\b|cp\b|rm\b|git\b[^\n]*?\b(?:checkout|restore|apply|am|stash|reset|rebase|merge|cherry-pick)\b)/;
const COMMIT_RE = /\bgit\b[^\n]*?\bcommit\b/;

// Đường «thật» kể cả khi tệp đã bị xoá: realpath tổ tiên gần nhất còn tồn tại + phần đuôi.
// macOS: /var → /private/var; transcript có thể mang dạng nào cũng được.
export function thuc(p) {
  let cur = path.resolve(p); const duoi = [];
  for (;;) {
    try { return path.join(fs.realpathSync(cur), ...duoi.reverse()); } catch { /* đi lên */ }
    const cha = path.dirname(cur);
    if (cha === cur) return path.resolve(p);
    duoi.push(path.basename(cur)); cur = cha;
  }
}

// ── Tìm ─────────────────────────────────────────────────────────────────────
// Thư mục wf_* có journal sửa SAU invokedAt và có tác tử mà đề bài chứa gốc kho + `_acceptance/<slug>/`.
// Quét MỌI thư mục dự án (phiên có thể chạy với cwd khác --root); lọc thời gian trước khi đọc tệp.
export function timTranscript({ roots, slug, invokedAt, home = os.homedir() }) {
  const tu = Date.parse(invokedAt || '');
  if (!Number.isFinite(tu)) return [];
  const proj = path.join(home, '.claude', 'projects');
  const ds = n => { try { return fs.readdirSync(n); } catch { return []; } };
  const dau = `_acceptance/${slug}/`;
  const out = [];
  for (const p of ds(proj)) for (const s of ds(path.join(proj, p))) {
    const wfRoot = path.join(proj, p, s, 'subagents', 'workflows');
    for (const wf of ds(wfRoot).filter(n => n.startsWith('wf_'))) {
      const d = path.join(wfRoot, wf);
      let m; try { m = fs.statSync(path.join(d, 'journal.jsonl')).mtimeMs; } catch { continue; }
      if (m + 1000 < tu) continue;
      const khop = ds(d).filter(n => /^agent-.*\.jsonl$/.test(n)).some(n => {
        let t; try { t = fs.readFileSync(path.join(d, n), 'utf8').slice(0, 262144); } catch { return false; }
        return t.includes(dau) && roots.some(r => t.includes(r));
      });
      if (khop) out.push(d);
    }
  }
  return out.sort();
}

// ── Đọc ─────────────────────────────────────────────────────────────────────
// → [{ id, vai, dung: [{ ten, input }] }] — một phần tử mỗi tệp agent-*.jsonl.
export function docTranscript(dirs) {
  const out = [];
  for (const d of dirs) {
    let ten; try { ten = fs.readdirSync(d).filter(n => /^agent-.*\.jsonl$/.test(n)).sort(); } catch { continue; }
    for (const n of ten) {
      const t = { id: n.replace(/\.jsonl$/, ''), vai: '', dung: [] };
      let raw; try { raw = fs.readFileSync(path.join(d, n), 'utf8'); } catch { continue; }
      for (const l of raw.split('\n')) {
        if (!l.trim()) continue;
        let o; try { o = JSON.parse(l); } catch { continue; }
        const msg = o && o.message; if (!msg) continue;
        const c = Array.isArray(msg.content) ? msg.content : [{ type: 'text', text: String(msg.content || '') }];
        for (const x of c) {
          if (!x || typeof x !== 'object') continue;
          if (msg.role === 'user' && !t.vai) {
            const m = String(x.text || '').match(/\[wf-label: ([^\]\n]+)\]/);
            if (m) t.vai = m[1].trim();
          }
          if (msg.role === 'assistant' && x.type === 'tool_use') t.dung.push({ ten: x.name, input: x.input || {} });
        }
      }
      out.push(t);
    }
  }
  return out;
}

// ── Quy ─────────────────────────────────────────────────────────────────────
const boHeredoc = s => String(s).replace(/<<-?\s*['"]?(\w+)['"]?[^\n]*\n[\s\S]*?\n\s*\1\b/g, ' ');
const doan = s => boHeredoc(s).split(/\n|&&|\|\||;|\|/).map(x => x.trim()).filter(Boolean);
const token = s => (s.match(/(?:[^\s'"]+|'[^']*'|"[^"]*")+/g) || []).map(t => t.replace(/^['"]|['"]$/g, ''));

// Một lệnh Bash ghi những tệp nào của `tepDoi` (đường tương đối gốc kho) → [{ tep, dongTu }].
export function lenhGhi(cmd, { root, tepDoi }) {
  const R = thuc(root);
  const dich = new Map(tepDoi.map(f => [path.join(R, f), f]));
  const out = [];
  let cwd = R;
  for (const d of doan(cmd)) {
    const tk = token(d);
    if (tk[0] === 'cd' && tk[1]) { cwd = thuc(path.resolve(cwd, tk[1])); continue; }
    const nhac = new Set();
    for (const t of tk) { const f = dich.get(thuc(path.resolve(cwd, t))); if (f) nhac.add(f); }
    const v = d.match(GHI_RE);
    if (v) for (const f of nhac) out.push({ tep: f, dongTu: v[1].split(/\s+/)[0] === 'git' ? `git ${v[1].match(/\b(checkout|restore|apply|am|stash|reset|rebase|merge|cherry-pick)\b/)[1]}` : v[1].replace(/\s+/g, ' ') });
    for (const m of d.matchAll(/(?:^|[^0-9&])>>?\s*([^\s;&|]+)/g)) {
      const f = dich.get(thuc(path.resolve(cwd, m[1].replace(/^['"]|['"]$/g, ''))));
      if (f) out.push({ tep: f, dongTu: '>' });
    }
  }
  return out;
}

// tep: [{ tep, doi }] của soCay · tacTu: docTranscript → { tac_tu, tep_khong_ro }.
export function quyTrachNhiem({ root, tep, tacTu }) {
  const R = thuc(root);
  const tepDoi = tep.map(x => x.tep);
  const coCommit = new Set(tep.filter(x => x.doi === 'commit').map(x => x.tep));
  const daQuy = new Set();
  const tac_tu = [];
  for (const t of tacTu) {
    const congCu = new Set(); const cuaNo = new Set();
    for (const u of t.dung) {
      if (u.ten === 'Edit' || u.ten === 'Write' || u.ten === 'NotebookEdit') {
        const fp = u.input.file_path || u.input.notebook_path;
        if (typeof fp !== 'string') continue;
        const rel = path.relative(R, thuc(fp)).split(path.sep).join('/');
        if (tepDoi.includes(rel)) { congCu.add(u.ten); cuaNo.add(rel); }
      } else if (u.ten === 'Bash' && typeof u.input.command === 'string') {
        for (const g of lenhGhi(u.input.command, { root: R, tepDoi })) { congCu.add(`Bash:${g.dongTu}`); cuaNo.add(g.tep); }
        if (coCommit.size && doan(u.input.command).some(d => COMMIT_RE.test(d))) {
          congCu.add('Bash:git commit');
          for (const f of coCommit) cuaNo.add(f);
        }
      }
    }
    if (cuaNo.size) {
      tac_tu.push({ id: t.id, vai: t.vai, cong_cu: [...congCu], tep: [...cuaNo].sort() });
      for (const f of cuaNo) daQuy.add(f);
    }
  }
  return { tac_tu, tep_khong_ro: tepDoi.filter(f => !daQuy.has(f)).sort() };
}

// ── Hoàn lại ────────────────────────────────────────────────────────────────
const git = (root, args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const laToTien = (root, a, b) => { try { git(root, ['merge-base', '--is-ancestor', a, b]); return true; } catch { return false; } };

// Bốn điều kiện (design doc §3.3), mất cả hoặc không gì. → { hoan_lai, ly_do? }
export function hoanLai({ root, sha, ban = {}, tep, quy, khongDocDuoc }) {
  if (khongDocDuoc) return { hoan_lai: false, ly_do: 'khong doc duoc transcript' };
  if (!laToTien(root, sha, 'HEAD')) return { hoan_lai: false, ly_do: 'HEAD khong con sha da cham lam to tien' };
  if (!quy.tac_tu.length) return { hoan_lai: false, ly_do: 'khong co tac tu cham nao bi quy' };
  if (quy.tep_khong_ro.length) return { hoan_lai: false, ly_do: `co tep khong ro chu: ${quy.tep_khong_ro.join(', ')}` };
  const commits = git(root, ['rev-list', `${sha}..HEAD`]).split('\n').filter(Boolean);
  for (const c of commits) {
    if (git(root, ['branch', '-r', '--contains', c]).trim()) return { hoan_lai: false, ly_do: `commit da day len nhanh xa: ${c.slice(0, 8)}` };
  }
  const banSan = tep.map(x => x.tep).filter(f => Object.prototype.hasOwnProperty.call(ban, f));
  if (banSan.length) return { hoan_lai: false, ly_do: `tep ban san truoc luot bi ghi de: ${banSan.join(', ')}` };
  try {
    if (commits.length) git(root, ['reset', '-q', '--keep', sha]);
    const conLai = tep.filter(x => x.doi !== 'commit').map(x => x.tep);
    if (conLai.length) git(root, ['checkout', sha, '--', ...conLai]);
  } catch (e) { return { hoan_lai: false, ly_do: `git tu choi hoan lai: ${String(e.stderr || e.message).split('\n')[0]}` }; }
  return { hoan_lai: true };
}

// Dựng MỘT dòng sổ đúng khuôn GHI-BOI-LINE.
export function dongGhiBoi({ ts, round, luotTs, sha, quy, hoan, khongDocDuoc }) {
  if (!Number.isInteger(round)) throw new Error('dongGhiBoi: round phai la so nguyen');
  return JSON.stringify({
    kind: 'ghi-boi-tac-tu-cham', ts, round, luot_ts: luotTs || '', sha,
    tac_tu: quy.tac_tu, tep_khong_ro: quy.tep_khong_ro,
    ...(khongDocDuoc ? { khong_doc_duoc: khongDocDuoc } : {}),
    hoan_lai: !!hoan.hoan_lai, ...(hoan.hoan_lai ? {} : { ly_do: hoan.ly_do || '' }),
  });
}
