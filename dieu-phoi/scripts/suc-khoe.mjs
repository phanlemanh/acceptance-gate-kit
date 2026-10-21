import { PHUT_MS, SUC_KHOE_MAC_DINH } from './cau-hinh.mjs';

export function docSwap(text) {
  const so = (khoa) => {
    const m = text.match(new RegExp(`${khoa} = ([\\d.]+)M`));
    return m ? Number(m[1]) / 1024 : null;
  };
  return { tongGb: so('total'), dungGb: so('used') };
}

export function docLoad(text) {
  const m = text.match(/\{\s*([\d.]+)/);
  return m ? Number(m[1]) : null;
}

export function docRssLonNhat(psText) {
  let lonNhat = null;
  for (const dong of psText.trim().split('\n')) {
    const m = dong.trim().match(/^(\d+)\s+(.+)$/);
    if (!m) continue;
    const gb = Number(m[1]) / 1024 / 1024;
    if (lonNhat === null || gb > lonNhat.gb) lonNhat = { gb, lenh: m[2] };
  }
  return lonNhat;
}

export function docApLuc(text) {
  const m = String(text).match(/^\s*(\d+)/);
  return m ? Number(m[1]) : null;
}

const soNguyen = (text) => {
  const m = String(text ?? '').match(/^\s*(\d+)\s*$/);
  return m ? Number(m[1]) : null;
};

export function docMucTrong(text) {
  const n = soNguyen(text);
  return n !== null && n <= 100 ? n : null;
}

export function docRamGb(text) {
  const n = soNguyen(text);
  return n !== null ? n / 1024 ** 3 : null;
}

export function docVmStat(text) {
  const s = String(text ?? '');
  const trang = s.match(/page size of (\d+) bytes/);
  const vao = s.match(/^Swapins:\s+(\d+)\.?\s*$/m);
  return { coTrang: trang ? Number(trang[1]) : null, swapins: vao ? Number(vao[1]) : null };
}

export function tocDoSwapinMbPhut(truoc, sau) {
  if (!truoc || !sau) return null;
  if (![truoc.swapins, sau.swapins, sau.coTrang, truoc.luc, sau.luc].every(Number.isFinite)) return null;
  const phut = (sau.luc - truoc.luc) / PHUT_MS;
  const trang = sau.swapins - truoc.swapins;
  if (!(phut > 0) || trang < 0) return null;
  return (trang * sau.coTrang) / 1024 / 1024 / phut;
}

export function nguongSucKhoe(cfg) {
  return { ...SUC_KHOE_MAC_DINH, dinh_lan_gb: {}, swapin_mb_phut: null, ...cfg.suc_khoe };
}

export function danhGiaSucKhoe({ swap, apLuc, load, rssLonNhat, mucTrong = null, ramGb = null, tocDo = null }, cfg) {
  const n = nguongSucKhoe(cfg);
  const lyDo = [];
  if (Number.isFinite(apLuc) && apLuc >= n.ap_luc_muc) lyDo.push(`áp lực bộ nhớ mức ${apLuc}`);
  const choTrongGb = Number.isFinite(mucTrong) && Number.isFinite(ramGb) ? (mucTrong / 100) * ramGb : null;
  const coSwap = Number.isFinite(swap?.dungGb) && Number.isFinite(swap?.tongGb);
  return {
    giamTai: lyDo.length > 0,
    lyDo,
    canNguoi: null,
    load,
    apLuc: Number.isFinite(apLuc) ? apLuc : null,
    choTrongGb,
    tocDoSwapinMbPhut: Number.isFinite(tocDo) ? tocDo : null,
    ghi: {
      swap: coSwap ? `${swap.dungGb.toFixed(1)}/${swap.tongGb.toFixed(1)} GB` : null,
      rss_lon_nhat: rssLonNhat ? { lenh: rssLonNhat.lenh, gb: rssLonNhat.gb } : null,
    },
  };
}

export function vuaLan(loai, sk, nhuCau, cfg) {
  if (loai === 'merge' || !Number.isFinite(nhuCau?.gb) || !Number.isFinite(sk.choTrongGb)) return { duoc: true, ly_do: null };
  const can = nhuCau.gb * nguongSucKhoe(cfg).he_so_cho;
  if (sk.choTrongGb >= can) return { duoc: true, ly_do: null };
  return { duoc: false, ly_do: `thiếu chỗ: cần ${can.toFixed(1)} GB, trống ${sk.choTrongGb.toFixed(1)} GB` };
}

export function dieuKienDuoiTai(sk, cfg) {
  const n = nguongSucKhoe(cfg);
  if (Number.isFinite(sk.apLuc) && sk.apLuc >= n.ap_luc_muc) return `áp lực bộ nhớ mức ${sk.apLuc}`;
  if (Number.isFinite(n.swapin_mb_phut) && Number.isFinite(sk.tocDoSwapinMbPhut) && sk.tocDoSwapinMbPhut >= n.swapin_mb_phut) {
    return `swapin ${sk.tocDoSwapinMbPhut.toFixed(1)} MB/phút`;
  }
  return null;
}
