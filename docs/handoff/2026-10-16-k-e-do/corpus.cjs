// K-E: vi phân 2.28 ↔ HEAD trên bộ hồ sơ thật. argv: newLib, oldLib, repo...
const fs = require('fs'), path = require('path');
const NEW = require(process.argv[2]), OLD = require(process.argv[3]);
const rd = p => { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } };
const fm = (t, k) => { const m = new RegExp('^' + k + ':\\s*(.*)$', 'm').exec(t || ''); return m ? m[1].trim().replace(/^["']|["']$/g, '') : ''; };
for (const repo of process.argv.slice(4)) {
  const acc = path.join(repo, '_acceptance');
  let n = 0, coMuc = 0, diff = [];
  for (const slug of fs.readdirSync(acc)) {
    const d = path.join(acc, slug);
    const f = rd(path.join(d, 'review-findings.md')); if (f == null) continue;
    n++;
    const l = rd(path.join(d, 'decisions.jsonl')), r = rd(path.join(d, 'run-log.jsonl'));
    const o = OLD.mucChuaDinhTuyen(f, l), w = NEW.mucChuaDinhTuyen(f, l, r);
    if (o.tong) coMuc++;
    if (o.chua.join() !== w.chua.join()) {
      const c = rd(path.join(d, 'contract.md')), e = rd(path.join(d, 'evidence-report.md'));
      diff.push({ slug, tong: o.tong, cu: o.chua.join(' '), moi: w.chua.join(' '), cumCu: NEW.cumCu(f, l, r), status: fm(c, 'status'), signoff: fm(e, 'human_signoff') });
    }
  }
  console.log(JSON.stringify({ repo: path.basename(repo), hoSoCoFindings: n, coMuc, lech: diff.length }));
  for (const x of diff) console.log('  ' + JSON.stringify(x));
}
