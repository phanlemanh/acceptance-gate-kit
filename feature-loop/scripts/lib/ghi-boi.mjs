// ghi-boi.mjs — MỘT nguồn cho «ai đã ghi vào cây trong lượt chấm» (hồ sơ tac-tu-cham-chi-cham-khong).
//
// Lượt chấm có cây đổi (lib/cay-doi.mjs, mã 6) thì bước sau-lượt `thuoc-vat --write` đọc transcript
// các tác tử của lượt, quy từng tệp đổi cho tác tử đã ghi nó, ghi ĐÚNG MỘT dòng sổ ngay sau dòng
// `cay-doi`. Máy KHÔNG đổi cây: hoàn lại là việc của phiên theo hai ca của SKILL (owner thu phạm vi
// 10/10 sau dừng-vá — hai lượt chấm liền tự hoàn lại phá việc không thuộc tác tử). Bên đọc dòng sổ:
// phiên nghiệm thu đếm ngưỡng (contract «Đường đo»). Lượt sạch không đi qua đây.
//
// Ba việc, một tệp: timTranscript (tìm) · docTranscript (đọc) · quyTrachNhiem (quy) + dòng sổ.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// <<<GHI-BOI-LINE
// {"kind":"ghi-boi-tac-tu-cham","ts":"<ISO>","round":<n>,"luot_ts":"<invokedAt>","sha":"<sha đã chấm>","tac_tu":[{"id":"agent-<…>","vai":"<nhãn>","cong_cu":["Edit"],"tep":["<đường>"]}],"tep_khong_ro":["<đường>"]}
// GHI-BOI-LINE>>>
// Khoá `khong_doc_duoc` chỉ có mặt khi không đọc được transcript.

// Động từ ghi của một đoạn lệnh shell (đoạn = phần giữa ; && || | và xuống dòng), xét theo VỊ TRÍ:
// động từ là từ ĐẦU đoạn (Cổng Bằng chứng 09/10, Ngoài-1/5 — khớp chuỗi con bắt nhầm `--merge-base`,
// `cat-file commit`). Chuyển hướng `>` xét riêng theo ĐÍCH (`2>/dev/null` không ghi tệp nào của kho).
export const GHI_RE = /^(sed\s+(?:-[a-zA-Z]*i\b|--in-place)|perl\s+-[a-zA-Z]*i|tee\b|mv\b|cp\b|rm\b)/;
// Lệnh con git ghi cây làm việc / chỉ mục; lệnh con lấy theo vị trí (gitCon), không theo chuỗi con.
const GIT_GHI = new Set(['checkout', 'restore', 'apply', 'am', 'stash', 'reset', 'rebase', 'merge', 'cherry-pick', 'rm', 'mv', 'switch', 'pull'])
// `git [-C <dir>] [-c k=v] [--git-dir=…] [--work-tree=…] [--no-pager] <lệnh con> …` → lệnh con.
export function gitCon(tk) {
  if (tk[0] !== 'git') return null
  for (let i = 1; i < tk.length; i += 1) {
    const t = tk[i]
    if (t === '-C' || t === '-c' || t === '--git-dir' || t === '--work-tree' || t === '--namespace') { i += 1; continue }
    if (t.startsWith('-')) continue
    return t
  }
  return null
}

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
    const tepCua = ts => { const n = new Set(); for (const t of ts) { const f = dich.get(thuc(path.resolve(cwd, t))); if (f) n.add(f); } return n; };
    const sub = gitCon(tk);
    if (sub !== null) {
      if (GIT_GHI.has(sub)) for (const f of tepCua(tk)) out.push({ tep: f, dongTu: `git ${sub}` });
    } else {
      const v = d.match(GHI_RE);
      // cp: chỉ ĐÍCH (đối số cuối) là ghi — nguồn là đọc (Ngoài-1/5).
      const dong = v && v[1].startsWith('cp') ? tepCua(tk.filter(t => !t.startsWith('-')).slice(-1)) : tepCua(tk);
      if (v) for (const f of dong) out.push({ tep: f, dongTu: v[1].replace(/\s+/g, ' ') });
    }
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
        if (coCommit.size && doan(u.input.command).some(d => gitCon(token(d)) === 'commit')) {
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

// Dựng MỘT dòng sổ đúng khuôn GHI-BOI-LINE.
export function dongGhiBoi({ ts, round, luotTs, sha, quy, khongDocDuoc }) {
  if (!Number.isInteger(round)) throw new Error('dongGhiBoi: round phai la so nguyen');
  return JSON.stringify({
    kind: 'ghi-boi-tac-tu-cham', ts, round, luot_ts: luotTs || '', sha,
    tac_tu: quy.tac_tu, tep_khong_ro: quy.tep_khong_ro,
    ...(khongDocDuoc ? { khong_doc_duoc: khongDocDuoc } : {}),
  });
}
