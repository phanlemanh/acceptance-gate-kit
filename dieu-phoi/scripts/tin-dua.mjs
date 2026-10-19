// Tin tự đến (hồ sơ vong-mo-co-chu-giu, thiết kế §3.7): hook-nhip (sau mỗi lời gọi công cụ) và hook-cho-nguoi (mỗi lời
// nhắc) nạp ĐỘNG tệp này trong khối bắt lỗi rồi gọi `duaTin`. Đưa mỗi tin mới gửi mình vào ngữ cảnh đúng MỘT lần, ghi
// «đã đến» (lời giao, câu hỏi) hay «chấp nhận» (lời báo xong — im lặng sau khi đã nghe), và tự nhắc một lần khi vòng mình
// gửi quá hạn nhận. Kho không đợt, không kênh → trả rỗng, không tạo tệp. Tác tử con → không làm gì. Trên kênh chỉ đọc bản
// đã đồng bộ, KHÔNG gọi mạng. Hỏng → không đưa, báo đúng một lần mỗi worktree.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { docJson, ghiJsonNguyenTu, gocKhoChinh, timThuMucDot, trongWorktree } from './dot.mjs';
import { bayGio } from './song.mjs';
import { docDongDau, gapSo, maMoi, vietDongDau } from './tin-doc.mjs';
import { minhTrongDot, noiChuaDot } from './tin-noi-chua.mjs';

const bam = (s) => crypto.createHash('sha1').update(String(s)).digest('hex').slice(0, 16);
export const laTacTuCon = (dauVao) => typeof dauVao?.agent_id === 'string' && dauVao.agent_id !== '';
const thuMucTin = (goc) => path.join(goc, '.acceptance-runs', 'tin');
const thuc = (p) => {
  try {
    return fs.realpathSync(p);
  } catch {
    return p;
  }
};

// Mọi «mình» của cwd: dãy hay giám sát trong đợt, và máy giữ kênh khi cwd là worktree đã `tin vai`.
export function cacMinh(cwd) {
  const ds = [];
  let goc = null;
  try {
    goc = gocKhoChinh(cwd);
  } catch {
    return { goc: null, ds };
  }
  const thuMuc = timThuMucDot(cwd);
  if (thuMuc) {
    const { minh, hangViec } = minhTrongDot(thuMuc, cwd);
    if (minh) {
      const vai = docJson(path.join(thuMuc, 'vai.json'), null);
      const wt = minh === 'G' ? vai?.giam_sat?.worktree : hangViec?.day?.find((d) => d.id === minh)?.worktree;
      ds.push({ loai: 'dot', minh, worktree: thuc(wt ?? cwd), thuMuc, nguon: path.join(thuMuc, 'tin.jsonl'), nc: noiChuaDot(thuMuc) });
    }
  }
  const dTin = thuMucTin(goc);
  if (fs.existsSync(dTin)) {
    for (const f of fs.readdirSync(dTin)) {
      if (!/^kenh-.+\.json$/u.test(f)) continue;
      const p = path.join(dTin, f);
      const tt = docJson(p, null);
      if (!tt?.may || !tt.worktree || !trongWorktree(thuc(tt.worktree), cwd)) continue;
      ds.push({
        loai: 'kenh',
        minh: tt.may,
        worktree: thuc(tt.worktree),
        tep: p,
        nguon: p,
        kenh: f.replace(/^kenh-/u, '').replace(/\.json$/u, ''),
        kenhTen: tt.ten ?? kenhTuTenTep(f),
        nc: {
          doc: () => {
            const t = docJson(p, null) ?? {};
            return { dong: [...(t.dong ?? []), ...(t.may_su ?? [])], hong: 0 };
          },
          them: (o) => {
            const t = docJson(p, null) ?? {};
            t.may_su = [...(t.may_su ?? []), o];
            ghiJsonNguyenTu(p, t);
          },
        },
      });
    }
  }
  return { goc, ds };
}

// Đường đọc-cũ: trạng thái kênh ghi trước khi `vai` lưu tên gốc → suy từ tên tệp, chỉ đúng khi chủ và kho không có gạch nối.
function kenhTuTenTep(f) {
  const m = /^kenh-([^-]+)-(.+)-(\d+)\.json$/u.exec(f);
  return m ? `${m[1]}/${m[2]}#${m[3]}` : f;
}

export const daTat = (goc, worktree) => fs.existsSync(path.join(thuMucTin(goc), 'tat', bam(worktree)));

export function datTat(cwd, tat) {
  const goc = gocKhoChinh(cwd);
  let wt;
  try {
    wt = thuc(cwd);
    const { ds } = cacMinh(cwd);
    if (ds[0]) wt = ds[0].worktree;
  } catch {}
  const p = path.join(thuMucTin(goc), 'tat', bam(wt));
  if (tat) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, `${JSON.stringify({ worktree: wt, luc: new Date().toISOString() })}\n`);
    return `tin: đã tắt tin tự đến và chặn kết lượt cho ${wt} — bật lại: tin bat`;
  }
  fs.rmSync(p, { force: true });
  return `tin: đã bật lại cho ${wt}`;
}

// Danh sách worktree đang tắt (cho `xem`).
export function dsTat(goc) {
  const d = path.join(thuMucTin(goc), 'tat');
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).map((f) => docJson(path.join(d, f), null)?.worktree).filter(Boolean);
}

const LOI_BAO = 'không đọc được hộp tin';
const KIEM_LAI_MS = 60_000;
// Báo lỗi đúng một lần mỗi worktree; trả câu báo hoặc null. `het = true` gỡ dấu khi hết lỗi.
export function baoMotLan(goc, worktree, lyDo, het = false) {
  const p = path.join(thuMucTin(goc), 'loi-da-bao', bam(worktree));
  if (het) {
    fs.rmSync(p, { force: true });
    return null;
  }
  if (fs.existsSync(p)) return null;
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify({ worktree, ly_do: lyDo, luc: new Date().toISOString() })}\n`);
  return `${LOI_BAO} (${lyDo}) — tin tự đến tạm dừng ở worktree này; sửa hộp tin rồi gọi lại, hoặc tắt bằng: tin tat`;
}

const khoaDong = (d) => `${d.luc}|${d.text.split('\n')[0]}`;
function goiY(dd, ten) {
  const k = ten.loai === 'kenh' ? ` --kenh ${ten.kenhTen ?? '<kênh>'}` : '';
  if (dd.khau_lenh === 'GIAO') return `Nhận việc: tin NHẬN ${dd.ma} "sẽ giao <một câu bằng lời của mình>"${k}`;
  if (dd.khau_lenh === 'HỎI') return `Trả lời: tin XONG ${dd.ma} "<câu trả lời>"${k}`;
  if (dd.khau_lenh === 'XONG') return `Đã giao — im lặng là chấp nhận; chưa đạt thì: tin MỞ LẠI ${dd.ma} "<vì sao>"${k} (trong 24 giờ)`;
  if (dd.khau_lenh === 'MỞ LẠI') return `Vòng mở lại — sửa xong thì: tin XONG ${dd.ma}${k}`;
  return null;
}

export function duaTin(dauVao, { nowMs = null } = {}) {
  if (laTacTuCon(dauVao)) return { ngu_canh: null, canh_bao: null };
  const now = bayGio(nowMs);
  const { goc, ds } = cacMinh(dauVao.cwd);
  if (!goc || ds.length === 0) return { ngu_canh: null, canh_bao: null };
  const phan = [];
  let canhBao = null;
  for (const ten of ds) {
    if (daTat(goc, ten.worktree)) continue;
    const pDua = path.join(thuMucTin(goc), 'da-dua', `${bam(`${ten.loai}|${ten.minh}|${ten.worktree}`)}.json`);
    const dau = docJson(pDua, null) ?? {};
    // Đường nhanh: nguồn không đổi kích thước và đã kiểm nhắc trong phút vừa qua → không đọc gì.
    let co = -1;
    try {
      co = fs.statSync(ten.nguon).size;
    } catch {}
    if (co >= 0 && dau.co === co && now - (dau.kiem_luc ?? 0) < KIEM_LAI_MS) continue;
    let dong;
    let hong;
    try {
      ({ dong, hong } = ten.nc.doc());
    } catch (e) {
      canhBao = canhBao ?? baoMotLan(goc, ten.worktree, e.code ?? e.message);
      continue;
    }
    if (hong) {
      canhBao = canhBao ?? baoMotLan(goc, ten.worktree, `${hong} dòng hỏng`);
      continue;
    }
    baoMotLan(goc, ten.worktree, '', true);
    const daDua = new Set(dau.khoa ?? []);
    const muc = gapSo(dong, { nowMs: now });
    const moi = [];
    for (const d of dong) {
      if (!d.text) continue;
      const dd = docDongDau(d.text);
      if (!dd || dd.cu || dd.den !== ten.minh || daDua.has(khoaDong(d))) continue;
      moi.push({ d, dd });
    }
    for (const { d, dd } of moi) {
      const gy = goiY(dd, ten);
      phan.push(`Tin gửi ${ten.minh}${ten.loai === 'kenh' ? ` trên kênh ${ten.kenhTen}` : ''}:\n${d.text}${gy ? `\n→ ${gy}` : ''}`);
      daDua.add(khoaDong(d));
      if (dd.khau_lenh === 'GIAO' || dd.khau_lenh === 'HỎI') ten.nc.them({ may: 'da-den', ma: dd.ma, luc: new Date(now).toISOString() });
      if (dd.khau_lenh === 'XONG') ten.nc.them({ may: 'chap-nhan', ma: dd.ma, luc: new Date(now).toISOString() });
    }
    // Tự nhắc một lần khi vòng mình gửi quá hạn nhận.
    const goiYNhac = new Set(dau.nhac ?? []);
    for (const v of muc) {
      if (v.tu !== ten.minh || v.qua_han_nhan < 1 || v.yeu_cau_cu) continue;
      const daNhac = dong.some((d) => d.text && docDongDau(d.text)?.khau_lenh === 'BÁO' && d.text.split('\n')[1]?.trim() === `nhắc ${v.ma}`);
      if (daNhac || goiYNhac.has(v.ma)) continue;
      if (ten.loai === 'dot') {
        const ma = maMoi(dong, ten.minh, now);
        const text = `${vietDongDau({ khau_lenh: 'BÁO', ma, tu: ten.minh, den: v.den })}\nnhắc ${v.ma}`;
        ten.nc.them({ text, luc: new Date(now).toISOString() });
        dong.push({ text, luc: new Date(now).toISOString() });
        phan.push(`Đã tự nhắc ${v.den} về vòng ${v.ma} (quá hạn nhận).`);
      } else {
        phan.push(`Vòng ${v.ma} gửi ${v.den} quá hạn nhận — nhắc một lần: tin nhac ${v.ma} --kenh ${ten.kenhTen}`);
      }
      goiYNhac.add(v.ma);
    }
    let coSau = co;
    try {
      coSau = fs.statSync(ten.nguon).size;
    } catch {}
    fs.mkdirSync(path.dirname(pDua), { recursive: true });
    ghiJsonNguyenTu(pDua, { khoa: [...daDua], nhac: [...goiYNhac], co: coSau, kiem_luc: now });
  }
  return { ngu_canh: phan.length ? phan.join('\n\n') : null, canh_bao: canhBao };
}

// Khối dùng chung cho hai hook: nạp động bởi chính hook, nên lỗi của tệp này không lan sang việc cũ của hook.
export { LOI_BAO };
