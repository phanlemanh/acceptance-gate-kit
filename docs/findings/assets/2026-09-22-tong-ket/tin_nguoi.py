#!/usr/bin/env python3
"""Rút mọi tin do NGƯỜI gõ trong transcript Claude Code (crm + kit), khử trùng theo uuid.
Dùng: tin_nguoi.py <từ-UTC> > tin.jsonl
Loại: lệnh (<command-name>) · tin thường · tự động (task-notification, cross-session, system-reminder,
local-command, tóm tắt nén, tool_result). Chỉ «lệnh» và «tin thường» là người."""
import glob, json, os, re, sys
base = os.path.expanduser('~/.claude/projects')
since = sys.argv[1]
AUTO = ('<task-notification', '<cross-session-message', '<system-reminder', '<local-command', 'Caveat:',
        '[Request interrupted', 'This session is being continued', '<command-message>', '<ci-monitor-event', '<user-prompt-submit-hook')
seen = set()
for d in sorted(os.listdir(base)):
    if d.startswith('-Users-manh-macmini-dev-crm'): kho = 'crm'
    elif d.startswith('-Users-manh-macmini-dev-acceptance-gate-kit'): kho = 'kit'
    else: continue
    for f in glob.glob(os.path.join(base, d, '*.jsonl')):
        for l in open(f, errors='replace'):
            try: r = json.loads(l)
            except Exception: continue
            if r.get('type') != 'user' or r.get('isMeta') or r.get('isCompactSummary') or r.get('isSidechain'): continue
            t = r.get('timestamp') or ''
            if t < since: continue
            u = r.get('uuid')
            if u in seen: continue
            m = r.get('message', {}).get('content')
            if isinstance(m, list):
                if any(isinstance(x, dict) and x.get('type') == 'tool_result' for x in m): continue
                txt = ' '.join(x.get('text', '') for x in m if isinstance(x, dict) and x.get('type') == 'text')
            else: txt = m or ''
            txt = txt.strip()
            if not txt: continue
            seen.add(u)
            cm = re.search(r'<command-name>/?([^<]+)</command-name>', txt)
            if cm:
                a = re.search(r'<command-args>([^<]*)</command-args>', txt)
                loai, show = 'lenh', cm.group(1).strip() + ' ' + (a.group(1).strip() if a else '')
            elif txt.startswith(AUTO): loai, show = 'tu-dong', txt[:60]
            else: loai, show = 'tin', txt[:160]
            print(json.dumps({'ts': t[:19], 'kho': kho, 'dir': d.split('worktrees-')[-1][:24] if 'worktrees' in d else 'goc', 'ses': os.path.basename(f)[:8], 'loai': loai, 'txt': show.replace('\n', ' ')}, ensure_ascii=False))
