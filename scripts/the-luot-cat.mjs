// the-luot-cat.mjs — thẻ lượt cắt: bản markdown cho người gộp PR cắt lượt, dựng từ ĐÚNG dữ liệu răng phủ vừa đọc
// (`cat-luot.mjs --the`). Cùng nếp thẻ cổng (`gate-card.js`): thẻ chỉ TRÌNH, không quyết gì; việc của người đứng đầu;
// mọi chữ trên thẻ rút từ bản phạm vi, tệp lộ trình, khối khoảng cỡ của SKILL, đồng hồ cỡ và nhịp của kho, hoặc lời khai
// phiên truyền vào (`--ra` · `--giu`) — thẻ không soạn câu nào về hàng.
//
// Hai lời khai không nằm trong tệp nào (ADR 0026: «Ra khỏi kho» là lời khai ở mô tả PR; SKILL bước 4: lý do giữ một cảnh
// báo của đợt ghi vào mô tả PR) — phiên truyền chúng, thẻ in kèm. Vắng thì thẻ nói «chưa khai», không đoán.
import { readFileSync } from 'node:fs';
import { kiemKhuon } from './lo-trinh.mjs';

const chuoi = v => (v == null ? '' : String(v).trim());
// Ô bảng markdown: không xuống dòng, không vỡ cột.
const o = v => chuoi(v).replace(/\r?\n/g, ' ').replace(/\|/g, '\\|');
const NGAY_RE = /^\d{4}-\d{2}-\d{2}$/;

// ── Cảnh báo: một nguồn với SKILL (khối CAT-LUOT-CANH-BAO, dòng `cua-dot`) ──
export function docCuaDot(tepSkill) {
  const s = readFileSync(tepSkill, 'utf8');
  const m = s.match(/<!-- <<<CAT-LUOT-CANH-BAO -->\n```\n([\s\S]*?)```\n<!-- CAT-LUOT-CANH-BAO>>> -->/);
  const d = m && m[1].split('\n').find(l => l.startsWith('cua-dot: '));
  if (!d) throw new Error(`SKILL ${tepSkill} thiếu dòng cua-dot của khối CAT-LUOT-CANH-BAO`);
  return new RegExp(d.slice('cua-dot: '.length).trim());
}
const MA_CANH_BAO = /^cảnh báo: (?:hàng|mốc) (.+?) \[([a-z-]+)\]:/;

// ── Lời khai của phiên ──
// `--ra "<việc> · <ai> · <khi>"` (bước 2b luật 4: việc · ai làm · ngày nếu có); `--ra -` khai đợt không có việc nào.
export function docRa(ds) {
  if (!ds.length) return null;
  if (ds.includes('-')) { if (ds.length > 1) throw new Error('--ra - (không có việc nào) không đi cùng --ra khác'); return []; }
  if (ds.some(x => !chuoi(x.split(' · ')[0]))) throw new Error('--ra cần một việc trước « · »');
  return ds.map(x => { const [viec, ai = '', ...khi] = x.split(' · '); return { viec: chuoi(viec), ai: chuoi(ai), khi: chuoi(khi.join(' · ')) }; });
}
// `--giu "<mã>: <lý do>"` — lý do giữ mọi cảnh báo của hàng (hay mốc) ấy.
export function docGiu(ds) {
  const m = new Map(); const sai = [];
  for (const x of ds) { const k = x.indexOf(': '); if (k <= 0 || !chuoi(x.slice(k + 2))) { sai.push(x); continue; } m.set(chuoi(x.slice(0, k)), chuoi(x.slice(k + 2))); }
  return { giu: m, sai };
}

// ── Dãy: thành phần liên thông của `dung_tren` ∪ `chay_sau` trong đợt, thứ tự tôpô (hoà thì theo thứ tự trong tệp) ──
const mang = v => (Array.isArray(v) ? v.map(chuoi).filter(Boolean) : []);
export function dayCuaDot(hangVao) {
  // Mã trùng là lỗi của răng (`mã trùng:`); thẻ vẫn phải dựng được — giữ hàng đầu tiên của mỗi mã.
  const hang = hangVao.filter((r, i) => hangVao.findIndex(x => x._ma === r._ma) === i);
  const theoMa = new Map(hang.map((r, i) => [r._ma, { r, i }]));
  const truoc = new Map(hang.map(r => [r._ma, []])); const ngoai = new Map(hang.map(r => [r._ma, []]));
  for (const r of hang) {
    for (const [x, loai] of [...mang(r.dung_tren).map(x => [x, 'that']), ...mang(r.chay_sau).map(x => [x, 'tep'])]) {
      if (theoMa.has(x)) { if (!truoc.get(r._ma).some(t => t.ma === x)) truoc.get(r._ma).push({ ma: x, loai }); } else ngoai.get(r._ma).push({ ma: x, loai });
    }
  }
  const cha = new Map(hang.map(r => [r._ma, r._ma]));
  const goc = x => (cha.get(x) === x ? x : (cha.set(x, goc(cha.get(x))), cha.get(x)));
  for (const [ma, ds] of truoc) for (const t of ds) cha.set(goc(ma), goc(t.ma));
  const nhom = new Map();
  for (const r of hang) { const g = goc(r._ma); if (!nhom.has(g)) nhom.set(g, []); nhom.get(g).push(r._ma); }
  return [...nhom.values()].map(ds => {
    const con = new Set(ds); const ra = []; const xong = new Set();
    while (ra.length < ds.length) {
      const san = ds.filter(m => !xong.has(m) && truoc.get(m).every(t => xong.has(t.ma) || !con.has(t.ma)));
      const k = (san.length ? san : ds.filter(m => !xong.has(m))).sort((a, b) => theoMa.get(a).i - theoMa.get(b).i)[0];
      xong.add(k); ra.push(k);
    }
    return ra.map(m => ({ r: theoMa.get(m).r, truoc: truoc.get(m), ngoai: ngoai.get(m) }));
  }).sort((a, b) => theoMa.get(a[0].r._ma).i - theoMa.get(b[0].r._ma).i);
}

// ── Cổng sau khi gộp, theo hạng — chép từ feature-loop (bất biến dừng) và CONTEXT.md (bảng «Tên bốn cổng») ──
const CONG = {
  T3: k => [['Cổng Đáng', 'người', 'việc này có đáng làm không — mở bằng `/feature-loop:feature-loop <mã>`'],
    ['Cổng Phạm vi', 'người', 'duyệt bộ tiêu chí'], ['Duyệt kế hoạch', 'người — vì T3', 'xem máy định sửa tệp nào, theo thứ tự nào'],
    ['Máy dựng và chấm', 'máy', `viết mã, chạy bài kiểm, chấm từng tiêu chí trong context sạch, tối đa ${k.tran_luot_cham} lượt`],
    ['Cổng Bằng chứng', 'người', 'đọc thẻ bằng chứng, ký hay trả lại'], ['Cổng Giá trị', 'người — khi ô cơ hội có ngưỡng', 'đọc số thật cạnh ngưỡng sau khi bật cho người dùng']],
  T2: k => [['Cổng Đáng', 'người', 'việc này có đáng làm không — mở bằng `/feature-loop:feature-loop <mã>`'],
    ['Cổng Phạm vi', 'máy đi tiếp khi đủ điều kiện (cửa veto mở), người khi không', 'duyệt bộ tiêu chí'],
    ['Máy dựng và chấm', 'máy', `viết mã, chạy bài kiểm, chấm từng tiêu chí trong context sạch, tối đa ${k.tran_luot_cham} lượt`],
    ['Cổng Bằng chứng', 'máy đi tiếp khi bằng chứng xanh-sạch và không chạm khó-đảo, người khi không', 'ký hay trả lại'],
    ['Cổng Giá trị', 'người — khi ô cơ hội có ngưỡng', 'đọc số thật cạnh ngưỡng sau khi bật cho người dùng']],
};
const TRAN_GOI = { T3: 4, T2: 3 };
const TEN_DANG = { chuoi: 'chuỗi tính năng', 'lan-va': 'làn vá' };

const nhomCo = (v, k) => {
  if (!Number.isInteger(v) || v <= 0) return null;
  if (v >= k.tach_tu) return 'phai-tach'; if (v > k.muc_tieu[1]) return 'cho-phep'; if (v >= k.muc_tieu[0]) return 'muc-tieu'; return 'duoi-muc-tieu';
};
const TEN_NHOM = { 'duoi-muc-tieu': 'dưới mục tiêu', 'muc-tieu': 'mục tiêu', 'cho-phep': 'cho phép', 'phai-tach': 'phải tách' };
const tenHang = r => chuoi(r.ten_ngan) || chuoi(r.ten) || chuoi(r.cau_giao);

// ── Thẻ ──
// đầu vào: pv (docPhamVi) · data (tệp lộ trình) · kq (kiemPhu) · co (kiemCo) · them (lỗi/cảnh báo của phép kiểm khác, vd nguồn bản phạm vi) · khoang · dongHo (dongHoCo) · nhip (nhip, chiTiet)
//          · cuaDot (RegExp) · ra (docRa) · giu (Map) · tep { pv, lt }
export function vietThe({ pv, data, kq, co, them = { loi: [], canhBao: [] }, khoang: k, dongHo, nhip, cuaDot, ra, giu, tep }) {
  const kk = kiemKhuon(data);
  const hang = kk.hang.filter(r => chuoi(r.dot) === pv.dot && r._ma);
  const cho = (Array.isArray(data.chan_troi) ? data.chan_troi : []).filter(c => c && typeof c === 'object' && chuoi(c.dot) === pv.dot);
  const loi = [...pv.loi, ...kq.loi, ...co.loi, ...(them.loi || [])];
  const canh = [...kq.canhBao, ...co.canhBao, ...(them.canhBao || [])].map(c => `cảnh báo: ${c}`);
  const canhDot = canh.filter(c => cuaDot.test(c)); const canhNgoai = canh.filter(c => !cuaDot.test(c));
  const L = [];
  const p = (...x) => L.push(...x);

  p(`## Thẻ lượt cắt — đợt \`${pv.dot}\``, '');
  p(loi.length ? `**Răng phủ: ĐỎ — ${loi.length} lỗi.** Đừng gộp PR: sửa hàng rồi chạy lại răng.` : `**Răng phủ: xanh** — ${pv.ma.length} mã, mỗi mã ở đúng một chỗ.`);
  p(`Dáng cắt: ${TEN_DANG[pv.dang] || pv.dang} (\`${pv.dang}\`) · nguồn: ${pv.nguon || '—'}`, '');
  if (loi.length) p(...loi.map(l => `- lỗi: ${l}`), '');
  p('**Việc của người gộp PR:** gộp PR là chốt cách cắt dưới đây. Muốn đổi thì nói — phiên sửa hàng rồi chạy lại răng.', '');

  p('### Đợt trong bốn con số', '', '| mã | hàng | mục chờ điều kiện | việc của người, ra khỏi kho |', '|---|---|---|---|');
  p(`| ${pv.ma.length} | ${hang.length} | ${cho.length} | ${ra == null ? 'chưa khai' : ra.length} |`, '');

  p('### Mã nào về đâu', '', '| Mã | Việc | Về |', '|---|---|---|');
  const theoMa = new Map(hang.map(r => [r._ma, r])); const choTheoMa = new Map(cho.map(c => [chuoi(c.ma), c]));
  for (const b of kq.bang) {
    const mo = (pv.ma.find(m => m.ma === b.ma) || {}).mo_ta;
    const ve = !b.cho ? '— chưa ở đâu' : b.cho.startsWith('hàng ') ? `hàng **${o(b.cho.slice(5))}** — ${o(tenHang(theoMa.get(b.cho.slice(5)) || {}))}` : `chờ điều kiện **${o(b.cho.replace(/^chờ điều kiện /, ''))}**`;
    p(`| \`${o(b.ma)}\` | ${o(mo)} | ${ve} |`);
  }
  p('');

  const day = dayCuaDot(hang);
  const coTep = hang.some(r => mang(r.chay_sau).length);
  p(`### ${hang.length} hàng chạy thành ${day.length} dãy`, '');
  p('Các dãy chạy song song; trong một dãy, hàng chạy lần lượt. Nối **cần … đã giao** là `dung_tren` (hàng sau dùng kết quả thật của hàng trước); nối **chạm cùng tệp** là `chay_sau` (không cần kết quả, chỉ để hai vòng không cùng sửa một tệp).');
  if (!coTep) p('', '_Chưa hàng nào của đợt khai `chay_sau` — dãy chỉ tính từ `dung_tren`, nên hai hàng khác dãy vẫn có thể chạm cùng tệp._');
  p('');
  day.forEach((d, i) => {
    p(`**Dãy ${i + 1}** — ${d.map(x => `**${o(x.r._ma)}**`).join(' → ')}`, '');
    d.forEach(({ r, truoc, ngoai }, j) => {
      const noi = [...truoc.map(t => (t.loai === 'that' ? `cần ${t.ma} đã giao` : `chạm cùng tệp với ${t.ma}`)), ...ngoai.map(t => (t.loai === 'that' ? `cần ${t.ma} (ngoài đợt) đã giao` : `chạm cùng tệp với ${t.ma} (ngoài đợt)`))];
      const vai = chuoi(r.vai) === 'nen' ? 'việc nền' : chuoi(r.vai) || 'chưa khai vai';
      p(`${j + 1}. **${o(r._ma)}** ${o(tenHang(r))} · ${o(r.hang) || '—'} · ${Number.isInteger(r.tieu_chi) ? `${r.tieu_chi} tiêu chí` : 'chưa ước tiêu chí'} · ${o(vai)}${noi.length ? ` · _${noi.join('; ')}_` : ''}`);
      p(`   «${o(r.cau_giao)}»`);
      if (chuoi(r.bat_khi)) p(`   Xong khi: ${o(r.bat_khi)}`);
    });
    p('');
  });

  p('### Cỡ từng hàng', '', `Khoảng của kit: mục tiêu ${k.muc_tieu[0]}–${k.muc_tieu[1]} tiêu chí · cho phép tới ${k.cho_phep_den} · từ ${k.tach_tu} phải tách.`, '');
  p('| Hàng | Tiêu chí | Khối | |', '|---|---|---|---|');
  for (const r of hang) {
    const n = nhomCo(r.tieu_chi, k);
    p(`| **${o(r._ma)}** | ${n ? r.tieu_chi : 'chưa ước'} | ${n ? TEN_NHOM[n] : '—'} | ${n ? `\`${'█'.repeat(Math.min(r.tieu_chi, k.tach_tu + 2))}\`` : ''} |`);
  }
  p('', `Đồng hồ cỡ của kho (\`--co\`, đo trên hồ sơ của chính kho lúc chạy):`, '');
  p('| Khối | Khoảng | Vòng đã chốt | Đã giao có lượt chấm | Lượt chấm TB | Chạm trần ' + k.tran_luot_cham + ' lượt | Hàng của đợt |', '|---|---|---|---|---|---|---|');
  for (const g of dongHo.nhom) {
    const cua = hang.filter(r => nhomCo(r.tieu_chi, k) === g.ten).map(r => r._ma);
    const kh = g.den == null ? `từ ${g.tu}` : `${g.tu}–${g.den}`;
    p(`| ${TEN_NHOM[g.ten]} | ${kh} | ${g.n_chot} | ${g.n || 0}${g.it_du_lieu ? ' (ít dữ liệu)' : ''} | ${g.n ? g.luot_tb : '—'} | ${g.n ? `${g.cham_tran_pt} %` : '—'} | ${cua.join(', ') || '—'} |`);
  }
  p('');

  p('### Cảnh báo của đợt', '');
  if (!canhDot.length) p('Không có.');
  for (const c of canhDot) {
    const m = c.match(MA_CANH_BAO); const ly = m && giu.get(m[1]);
    p(`- ${o(c.replace(/^cảnh báo: /, ''))}`, `  - ${ly ? `Giữ vì: ${o(ly)}` : '**Chưa ghi lý do giữ** — xử lý (gộp, khai) hoặc ghi vì sao giữ (`--giu "<mã>: <lý do>"`).'}`);
  }
  const coCanh = new Set(canhDot.map(c => (c.match(MA_CANH_BAO) || [])[1]).filter(Boolean));
  const thua = [...giu.keys()].filter(m => !coCanh.has(m));
  if (thua.length) p(`- **Lý do giữ cho mã không có cảnh báo nào:** ${thua.map(m => `\`${o(m)}\``).join(', ')} — gõ nhầm mã, hay cảnh báo đã xử lý?`);
  if (canhNgoai.length) p('', `<details><summary>${canhNgoai.length} cảnh báo ngoài đợt — không thuộc lượt cắt này, không sửa ở đây</summary>`, '', ...canhNgoai.map(c => `- ${o(c.replace(/^cảnh báo: /, ''))}`), '', '</details>');
  p('');

  p('### Chưa làm — mục chờ điều kiện', '');
  if (!cho.length) p('Không có.');
  else {
    p('| Mục | Mã | Vì sao chưa | Mở lại khi |', '|---|---|---|---|');
    for (const c of cho) p(`| **${o(c.ma)}** | ${mang(c.phu).map(x => `\`${o(x)}\``).join(', ')} | ${o(c.ly_do)} | ${o(c.mo_lai_khi) || '—'} |`);
  }
  p('');

  p('### Ra khỏi kho — việc của người, không nằm trên lộ trình', '');
  if (ra == null) p('**Chưa khai.** Phiên chép danh sách đã tách ở bước 2b vào `--ra "<việc> · <ai> · <khi>"` (đợt không có việc nào: `--ra -`).');
  else if (!ra.length) p('Không có việc nào (đã khai).');
  else { p('| Việc | Ai | Khi |', '|---|---|---|'); for (const x of ra) p(`| ${o(x.viec)} | ${o(x.ai) || '—'} | ${o(x.khi) || '—'} |`); }
  p('', '_Lời khai của phiên cắt — răng phủ không thấy danh sách này (ADR 0026)._', '');

  p('### Ngày', '');
  const mocCua = ma => (Array.isArray(data.moc) ? data.moc : []).filter(m => m && Array.isArray(m.hang) && m.hang.map(chuoi).includes(ma));
  const coNgay = hang.filter(r => NGAY_RE.test(chuoi(r.ngay)) || mocCua(r._ma).length);
  for (const r of coNgay) p(`- **${o(r._ma)}**: ${NGAY_RE.test(chuoi(r.ngay)) ? chuoi(r.ngay) : 'chưa ghi ngày'}${mocCua(r._ma).map(m => ` · gắn mốc «${o(m.ten)}» ${o(m.ngay)}`).join('')}`);
  const khong = hang.filter(r => !coNgay.includes(r));
  if (khong.length) {
    p(`${coNgay.length ? '- ' : ''}${khong.length}/${hang.length} hàng chưa có ngày và không gắn mốc nào: ${khong.map(r => r._ma).join(', ')}.`);
    for (const h of [...new Set(khong.map(r => chuoi(r.hang)))].filter(h => h in nhip.hang)) {
      const x = nhip.hang[h];
      p(x.n ? `- Nhịp hạng ${h} (\`--nhip\`): trung vị ${x.trung_vi} ngày từ chốt phạm vi tới ký Cổng Bằng chứng, trên ${x.n} vòng đã ký; ${x.cung_ngay} vòng ký ngay trong ngày chốt. Nhịp đo độ dài một vòng theo ngày lịch — không đo thời gian một hàng chờ tới lượt.`
        : `- Nhịp hạng ${h}: kho chưa có vòng hạng ${h} nào đã ký — SKILL bước 2: không đặt ngày, để trống còn hơn bịa.`);
    }
    p('- Muốn có hạn: nêu một ngày, phiên gắn nó thành mốc cho các hàng phải xong trước.');
  }
  p('');

  p('### Sau khi gộp — mỗi hàng đi qua cổng nào', '');
  const hangs = [...new Set(hang.map(r => chuoi(r.hang)))];
  for (const h of hangs) {
    const ds = hang.filter(r => chuoi(r.hang) === h).map(r => r._ma);
    if (!CONG[h]) { p(`**${h || 'chưa khai hạng'}** (${ds.join(', ')}): ${h === 'T1' ? 'thoát ở bước đầu — không mở vòng, sửa thẳng trong một PR.' : 'hạng lạ — feature-loop suy hạng lúc mở vòng.'}`, ''); continue; }
    p(`**${h}** (${ds.join(', ')}) — trần ${TRAN_GOI[h]} lượt gọi người mỗi vòng tới Cổng Bằng chứng; Cổng Giá trị đếm riêng, sau khi giao:`, '');
    CONG[h](k).forEach(([ten, ai, viec], i) => p(`${i + 1}. **${ten}** — _${ai}_ — ${viec}`));
    p('');
  }

  p('---', `_Sinh bởi \`cat-luot.mjs --the\` từ \`${tep.pv}\` và \`${tep.lt}\` — cùng dữ liệu răng phủ vừa đọc. Thẻ không quyết gì; đồng hồ cỡ và nhịp đo từ \`_acceptance/\` của kho lúc chạy._`);
  return L.join('\n') + '\n';
}
