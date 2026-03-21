# One-off: patch 2024-08..12 post front matter (excerpt + trim yaml lines)
import os
import re

base = os.path.join(os.path.dirname(__file__), "..", "_posts")
base = os.path.normpath(base)

def split_front_matter(c: str):
    if c.startswith("\ufeff"):
        c = c[1:]
    m = re.match(r"^---\s*\r?\n(.*?)\r?\n---\s*\r?\n", c, re.S)
    if not m:
        return None, c
    return m.group(1), c[m.end() :]


for name in sorted(os.listdir(base)):
    if not re.match(r"2024-(08|09|10|11|12)-.+\.md$", name):
        continue
    path = os.path.join(base, name)
    with open(path, encoding="utf-8") as f:
        c = f.read()
    fm_body = split_front_matter(c)
    if fm_body[0] is None:
        print("skip (no fm)", name)
        continue
    fm, body = fm_body
    orig_fm = fm
    if "excerpt:" not in fm:
        tm = re.search(r"^title:\s*(.+)$", fm, re.M)
        title = tm.group(1).strip().strip('"') if tm else name
        excerpt = title if len(title) <= 90 else title[:87] + "..."
        excerpt = excerpt.replace('"', "'")
        fm, n = re.subn(
            r"(^author:\s*[^\n]+\n)",
            r"\1excerpt: " + excerpt + "\n",
            fm,
            count=1,
            flags=re.M,
        )
        if n == 0:
            fm = fm.rstrip() + "\nexcerpt: " + excerpt + "\n"
    fm = re.sub(r"(?m)^(mermaid:\s*true)\s+\s*$", r"\1", fm)
    fm = re.sub(r"(?m)^(mathjax:\s*true)\s+\s*$", r"\1", fm)
    if fm == orig_fm and "excerpt:" in orig_fm:
        continue
    c2 = "---\n" + fm.strip() + "\n---\n" + body
    if c2 != c.lstrip("\ufeff"):
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(c2)
        print("updated", name)
