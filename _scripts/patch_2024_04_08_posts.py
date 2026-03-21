# Patch 2024-04..08 post front matter: excerpt + trim yaml trailing spaces
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
    if not re.match(r"2024-(04|05|06|07|08)-.+\.md$", name):
        continue
    path = os.path.join(base, name)
    with open(path, encoding="utf-8") as f:
        c = f.read()
    fm_body = split_front_matter(c)
    if fm_body[0] is None:
        print("skip no-fm", name)
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
    cover_line = "cover-img: /assets/img/0028963732_0.jpg"
    if cover_line not in fm and "cover-img:" not in fm:
        fm = re.sub(
            r"(^title:\s*[^\n]+\n)",
            r"\1" + cover_line + "\n",
            fm,
            count=1,
            flags=re.M,
        )
    c2 = "---\n" + fm.strip() + "\n---\n" + body
    if c2 != c.lstrip("\ufeff"):
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(c2)
        print("updated", name)
