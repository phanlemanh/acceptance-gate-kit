"""Dem ban chep cau-ve-hinh (LOOP-PICTURE-CLAUSE) trong mot van ban.

Mot nguon cho P90 va P197 (tests/plugins/run-tests.sh) — truoc day hai khoi
heredoc chep tay cung logic `CLAUSE in text`, chi chac duoc "it nhat MOT ban
con khop"; SKILL.md nay co HAI ban chep (GATE 1 + S2) nen sua lech rieng mot ban
khong lam phep do nao do (Known limit 1 cua hinh-tai-cong-1).

Neo HAI dau: n_anchor = max(so lan 4 chu DAU, so lan 4 chu CUOI cua clause);
n_full = so ban NGUYEN VAN. Sua chu o giua / o dau / o cuoi mot ban deu lam
n_full < n_anchor -> do. Diem mu con lai (ghi Known limits): sua CA HAI dau
cung luc trong cung mot ban.
"""
import re

def _norm(s):
    return re.sub(r"\s+", " ", s).strip()

def clause_copies(text, clause):
    t = _norm(text); c = _norm(clause)
    words = c.split(" ")
    head = " ".join(words[:4]); tail = " ".join(words[-4:])
    n_anchor = max(t.count(head), t.count(tail))
    n_full = t.count(c)
    return n_anchor, n_full

def clause_copies_ok(text, clause):
    n_anchor, n_full = clause_copies(text, clause)
    if n_anchor == 0:
        return ["khong co ban chep nao"]
    if n_full < n_anchor:
        return [f"cau ve hinh lech khuon mot-nguon ({n_full}/{n_anchor} ban chep)"]
    return []
