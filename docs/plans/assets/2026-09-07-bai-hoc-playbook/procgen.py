# Process-type generator (diagram-design type-process, geometry widened for Vietnamese)
import sys, json, pathlib
LABEL_W=140; SLOT=152; NODE_W=136; NODE_H=72; LANE_H=88; HEADER=40; RPAD=28
PAPER="#f5f5f5"; INK="#2d3142"; MUTED="#4f5d75"; SOFT="#636b80"; ACC="#eb6c36"; RULE="rgba(45,49,66,0.12)"
def gen(spec):
    lanes=spec['lanes']; steps=spec['steps']; nodes=spec['nodes']; arrows=spec['arrows']
    nl,ns=len(lanes),len(steps)
    has_color=any(n.get('color') for n in nodes)
    legend_h=104 if has_color else 84
    W=LABEL_W+ns*SLOT+RPAD; legend_top=HEADER+nl*LANE_H; H=legend_top+legend_h
    lane_top=lambda k:HEADER+k*LANE_H; lane_mid=lambda k:lane_top(k)+LANE_H//2
    cx=lambda j:LABEL_W+8+j*SLOT+NODE_W//2
    nx=lambda j:cx(j)-NODE_W//2; ny=lambda k:lane_top(k)+(LANE_H-NODE_H)//2
    key2k={l['key']:i for i,l in enumerate(lanes)}
    o=[]
    o.append(f'<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg">')
    o.append(f'''<defs>
<marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="{MUTED}"/></marker>
<marker id="arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="{ACC}"/></marker>
<marker id="arrow-sm" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto"><polygon points="0 0, 6 2.5, 0 5" fill="{MUTED}"/></marker>
<marker id="arrow-link" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#2e5aa8"/></marker>
</defs>''')
    o.append(f'<rect width="100%" height="100%" fill="{PAPER}"/>')
    for k in range(0,nl,2):
        o.append(f'<rect x="{LABEL_W}" y="{lane_top(k)}" width="{W-LABEL_W}" height="{LANE_H}" fill="rgba(45,49,66,0.018)"/>')
    for k in range(nl+1):
        y=lane_top(k); o.append(f'<line x1="0" y1="{y}" x2="{W}" y2="{y}" stroke="{RULE}" stroke-width="0.8"/>')
    o.append(f'<line x1="{LABEL_W}" y1="{HEADER}" x2="{LABEL_W}" y2="{legend_top}" stroke="rgba(45,49,66,0.20)" stroke-width="1"/>')
    # step headers
    for j,s in enumerate(steps):
        foc=s.get('focal'); fill="rgba(235,108,54,0.20)" if foc else "rgba(45,49,66,0.12)"; tc=ACC if foc else INK; lc="#ba4513" if foc else MUTED
        o.append(f'<rect x="{cx(j)-8}" y="8" width="16" height="16" rx="8" fill="{fill}"/>')
        o.append(f'<text x="{cx(j)}" y="20" fill="{tc}" font-size="9" font-weight="600" font-family="\'Geist Mono\', monospace" text-anchor="middle">{s["number"]}</text>')
        o.append(f'<text x="{cx(j)}" y="36" fill="{lc}" font-size="9" font-weight="500" font-family="\'Geist Mono\', monospace" text-anchor="middle" letter-spacing="0.12em">{s["label"].upper()}</text>')
    # lane labels
    for k,l in enumerate(lanes):
        nm=l['name']
        if len(nm)==1: o.append(f'<text x="{LABEL_W//2}" y="{lane_mid(k)+4}" fill="{MUTED}" font-size="9" font-family="\'Geist Mono\', monospace" text-anchor="middle" letter-spacing="0.08em">{nm[0]}</text>')
        else:
            o.append(f'<text x="{LABEL_W//2}" y="{lane_mid(k)-4}" fill="{MUTED}" font-size="9" font-family="\'Geist Mono\', monospace" text-anchor="middle" letter-spacing="0.08em">{nm[0]}</text>')
            o.append(f'<text x="{LABEL_W//2}" y="{lane_mid(k)+8}" fill="{MUTED}" font-size="9" font-family="\'Geist Mono\', monospace" text-anchor="middle" letter-spacing="0.08em">{nm[1]}</text>')
    # arrows first
    def node_at(lane,step):
        for n in nodes:
            if n['lane']==lane and n['step']==step: return n
    for a in arrows:
        sk,ss=key2k[a['from']['lane']],a['from']['step']; dk,ds=key2k[a['to']['lane']],a['to']['step']
        st=a.get('style','normal')
        stroke=ACC if st.startswith('focal') else MUTED; width=1.2 if st.startswith('focal') else 1
        dash=' stroke-dasharray="4,3"' if st=='trigger' else ''; mk='arrow-accent' if st.startswith('focal') else ('arrow-sm' if st=='trigger' else 'arrow')
        rx=nx(ss)+NODE_W; scy=lane_mid(sk); dcx=cx(ds)
        if sk==dk:
            o.append(f'<line x1="{rx}" y1="{scy}" x2="{nx(ds)-1}" y2="{scy}" stroke="{stroke}" stroke-width="{width}"{dash} marker-end="url(#{mk})"/>')
        elif dk>sk:
            o.append(f'<path d="M {rx},{scy} H {dcx-8} Q {dcx},{scy} {dcx},{scy+8} V {ny(dk)-1}" fill="none" stroke="{stroke}" stroke-width="{width}"{dash} marker-end="url(#{mk})"/>')
        else:
            o.append(f'<path d="M {rx},{scy} H {dcx-8} Q {dcx},{scy} {dcx},{scy-8} V {ny(dk)+NODE_H+1}" fill="none" stroke="{stroke}" stroke-width="{width}"{dash} marker-end="url(#{mk})"/>')
    # nodes
    for n in nodes:
        k=key2k[n['lane']]; j=n['step']; x,y=nx(j),ny(k); c=n.get('color'); foc=n.get('focal')
        if foc: fill,stroke,sw="rgba(235,108,54,0.08)",ACC,1.4
        elif c:
            r,g,b=int(c[1:3],16),int(c[3:5],16),int(c[5:7],16); fill,stroke,sw=f"rgba({r},{g},{b},0.06)",f"rgba({r},{g},{b},0.35)",1
        else: fill,stroke,sw="#ffffff","rgba(45,49,66,0.25)",1
        o.append(f'<rect x="{x}" y="{y}" width="{NODE_W}" height="{NODE_H}" rx="6" fill="{PAPER}"/>')
        o.append(f'<rect x="{x}" y="{y}" width="{NODE_W}" height="{NODE_H}" rx="6" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
        # role chip
        if foc: cf,ct="rgba(235,108,54,0.18)","#ba4513"
        elif c: cf,ct=f"rgba({r},{g},{b},0.18)",c
        else: cf,ct="rgba(45,49,66,0.10)",MUTED
        o.append(f'<rect x="{x+4}" y="{y+4}" width="28" height="16" rx="2" fill="{cf}"/>')
        o.append(f'<text x="{x+18}" y="{y+16}" fill="{ct}" font-size="9" font-weight="600" font-family="\'Geist Mono\', monospace" text-anchor="middle">{n["lane"]}</text>')
        tcol=c if (c and not foc) else INK
        o.append(f'<text x="{cx(j)}" y="{y+34}" fill="{tcol}" font-size="10" font-weight="600" font-family="\'Geist\', sans-serif" text-anchor="middle">{n["title"]}</text>')
        o.append(f'<text x="{cx(j)}" y="{y+48}" fill="{MUTED}" font-size="9" font-family="\'Geist Mono\', monospace" text-anchor="middle">{n["sub"]}</text>')
        o.append(f'<text x="{cx(j)}" y="{y+62}" fill="{SOFT}" font-size="9" font-family="\'Geist Mono\', monospace" text-anchor="middle">{n["tool"]}</text>')
    # legend
    ly=legend_top; o.append(f'<line x1="0" y1="{ly}" x2="{W}" y2="{ly}" stroke="{RULE}" stroke-width="0.8"/>')
    row=ly+20
    o.append(f'<text x="{LABEL_W+4}" y="{row}" fill="{MUTED}" font-size="9" font-family="\'Geist Mono\', monospace" letter-spacing="0.14em">DÒNG NODE</text>')
    o.append(f'<text x="{LABEL_W+108}" y="{row}" fill="{MUTED}" font-size="10" font-family="\'Geist\', sans-serif">dòng 1 = vật bước này để lại · dòng 2 = ai duyệt, bằng gì · dòng 3 = cái gì kích hoạt bước sau</text>')
    row+=24
    o.append(f'<text x="{LABEL_W+4}" y="{row}" fill="{MUTED}" font-size="9" font-family="\'Geist Mono\', monospace" letter-spacing="0.14em">LUỒNG</text>')
    o.append(f'<line x1="{LABEL_W+108}" y1="{row-4}" x2="{LABEL_W+140}" y2="{row-4}" stroke="{MUTED}" stroke-width="1" marker-end="url(#arrow)"/>')
    o.append(f'<text x="{LABEL_W+148}" y="{row}" fill="{MUTED}" font-size="10" font-family="\'Geist\', sans-serif">bàn giao vật</text>')
    o.append(f'<line x1="{LABEL_W+268}" y1="{row-4}" x2="{LABEL_W+300}" y2="{row-4}" stroke="{ACC}" stroke-width="1.2" marker-end="url(#arrow-accent)"/>')
    o.append(f'<text x="{LABEL_W+308}" y="{row}" fill="{MUTED}" font-size="10" font-family="\'Geist\', sans-serif">vào/ra cổng người cứng nhất</text>')
    o.append(f'<line x1="{LABEL_W+520}" y1="{row-4}" x2="{LABEL_W+552}" y2="{row-4}" stroke="{MUTED}" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#arrow-sm)"/>')
    o.append(f'<text x="{LABEL_W+560}" y="{row}" fill="{MUTED}" font-size="10" font-family="\'Geist\', sans-serif">kích hoạt tự động, không người</text>')
    if has_color:
        row+=24
        o.append(f'<text x="{LABEL_W+4}" y="{row}" fill="{MUTED}" font-size="9" font-family="\'Geist Mono\', monospace" letter-spacing="0.14em">MÀU</text>')
        o.append(f'<rect x="{LABEL_W+108}" y="{row-12}" width="20" height="16" rx="3" fill="rgba(184,84,80,0.06)" stroke="rgba(184,84,80,0.35)"/>')
        o.append(f'<text x="{LABEL_W+136}" y="{row}" fill="{MUTED}" font-size="10" font-family="\'Geist\', sans-serif">{spec["color_legend"]}</text>')
    o.append('</svg>')
    return '\n'.join(o)

HEAD='''<!DOCTYPE html>
<html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Lora:ital,wght@0,400;1,400&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{{box-sizing:border-box;margin:0;padding:0}}
:root{{--color-paper:#f5f5f5;--color-ink:#2d3142;--color-muted:#4f5d75;--color-soft:#636b80;--color-rule:rgba(45,49,66,0.12);--font-sans:'Geist',system-ui,sans-serif;--font-serif:'Instrument Serif','Lora',serif;--font-mono:'Geist Mono',ui-monospace,monospace}}
body{{font-family:var(--font-sans);background:var(--color-paper);color:var(--color-ink);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:3rem 2rem}}
.frame{{max-width:1200px;width:100%}}
.eyebrow{{font-family:var(--font-mono);font-size:.66rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--color-muted);margin-bottom:.5rem}}
h1{{font-family:var(--font-serif);font-size:clamp(1.5rem,2.4vw + .75rem,2rem);font-weight:400;letter-spacing:-.02em;line-height:1.15;margin-bottom:.5rem}}
.sub{{color:var(--color-muted);font-size:.9rem;margin-bottom:1.5rem}}
svg{{width:100%;min-width:900px;display:block}}
.colophon{{font-family:var(--font-mono);font-size:.66rem;color:var(--color-soft);border-top:1px solid var(--color-rule);padding-top:.75rem;margin-top:1rem}}
</style></head><body><div class="frame">
<p class="eyebrow">{eyebrow}</p><h1>{title}</h1><p class="sub">{sub}</p>
{svg}
<p class="colophon">{colophon}</p>
</div></body></html>
'''
if __name__=='__main__':
    spec=json.load(open(sys.argv[1],encoding='utf-8'))
    html=HEAD.format(title=spec['title'],eyebrow=spec['eyebrow'],sub=spec['subtitle'],svg=gen(spec),colophon=spec['colophon'])
    pathlib.Path(sys.argv[2]).write_text(html,encoding='utf-8'); print('wrote',sys.argv[2])
