import json,subprocess,sys,collections
repo,ref=sys.argv[1],sys.argv[2]
for s in sys.argv[3].split(','):
    t=subprocess.run(['git','-C',repo,'show',f'{ref}:_acceptance/{s}/run-log.jsonl'],capture_output=True,text=True).stdout
    c=collections.Counter()
    for l in t.splitlines():
        try: r=json.loads(l)
        except: continue
        if r.get('kind')!='finding': continue
        c['tong']+=1
        if r.get('inContract'): c['trong-hd']+=1
        else: c['ngoai-hd:'+str(r.get('proposal'))]+=1
    print(s, dict(c))
