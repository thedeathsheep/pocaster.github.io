# -*- coding: utf-8 -*-
"""
Reassign Jekyll post tags using the first ~50 visible characters of the body,
plus title and filename stem. Idempotent-safe: rewrite only the tags: line in FM.

Usage:
  py -3 _scripts/retag_posts_by_preview.py          # dry-run, print summary
  py -3 _scripts/retag_posts_by_preview.py --apply  # write files
"""
from __future__ import annotations

import argparse
import os
import re
from collections import defaultdict

BASE = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "_posts"))

# Canonical tags only (merge legacy spellings here)
TAG_KEYWORDS: dict[str, list[str]] = {
    "Game Dev": [
        "游戏",
        "Unity",
        "关卡",
        "战斗",
        "物理",
        "引擎",
        "渲染",
        "技能",
        "GDC",
        "Game Jam",
        "Game-Jam",
        "Celeste",
        "状态机",
        "行为树",
        "ECS",
        "协程",
        "帧率",
        "碰撞",
        "图形",
        "数值",
        "战棋",
        "吸血鬼",
        "Twine",
        "互动小说",
        "跑酷",
        "角色",
        "UI",
        "Jam",
        "无引擎",
        "停车",
        "短剧",
        "对谈",
        "小游戏",
        "DND",
        "war3",
        "42Tips",
        "git",
        "克隆",
        "游戏框架",
        "粒子",
        "RigidBody",
        "SoftBody",
        "Verlet",
        "Shape",
        "Circle",
        "Torque",
        "惯性",
        "角速度",
        "速度",
        "逆质量",
        "DeltaTime",
        "SAT ",
        "Projection",
        "Impulse",
        "LocalSpace",
        "WorldSpace",
        "Velocity",
        "SoftBody",
        "叙事",
        "文本研究",
        "开发技术",
        "收藏夹",
        "编码",
        "战斗系统",
        "技能系统",
        "核心玩法",
        "网格地图",
        "横板",
        "格斗",
        "协程",
        "脚本语言",
        "开源游戏",
        "路线",
        "手感",
        "Roguelite",
        "Quest",
        "关卡设计",
        "负空间",
        "VideoNovel",
        "燕云",
        "泥宫",
        "黄天",
        "献祭",
        "卡塔西斯",
        "医美",  # industry app still filed under product/game-adjacent? -> actually AI - move
    ],
    "AI": [
        "AI",
        "Mermaid",
        "mermaid",
        "Agent",
        "LLM",
        "大模型",
        "语言模型",
        "机器学习模型",
        "提示词",
        "Prompt",
        "GPT",
        "Dify",
        "向量",
        "训练",
        "智能体",
        "大模型",
        "MCP",
        "机器学习",
        "SageMaker",
        "TensorFlow",
        "Vertex",
        "AgentEval",
        "JSONSchema",
        "护栏",
        "聚类",
        "豆包",
        "嵌入",
        "评测",
        "人机回环",
        "智能体产品",
        "PRD",
        "notebook",
        "anaconda",
        "MLOps",
        "微调",
        "RAG",
        "医美",
        "就业",
        "语音模仿",
        "工作流",
        "DIFY",
        "离线指标",
        "监控",
        "DAG",
        "工具调用",
        "共处一室",
        "Feed",
        "Deed",
        "考研Agent",
        "知识图谱",
        "PE",
        "沟通、记忆",
    ],
    "Programming": [
        "SQL",
        "C++",
        "Python",
        "编程",
        "开发指南",
        "Windows",
        "脚本",
        "开源协议",
        "许可证",
        "数据分析",
        "API",
        "SDK",
        "git操作",
        "JSON",
        "Schema",
    ],
    "Writing": [
        "写作练习",
        "习作",
        "小说",
        "散文",
        "诗",
        "沉默",
        "魏博",
        "铁蒺藜",
        "两重潮",
        "水中苎麻",
        "吉多尼亚",
        "梅子苏打",
        "影评",
        "技术写作",
        "散步",
        "录音",
        "碎片笔记",
        "读书",
        "注意力",
        "天真的语言",
    ],
    "Fiction": [
        "写作练习",
        "习作",
        "《",
        "拂匣生",
        "铁蒺藜",
        "两重潮",
        "水中苎麻",
        "魏博",
    ],
    "Novel": [
        "信件",
        "春末",
        "幽微",
        "牢房",
        "味觉",
        "五月",
        "短篇",
        "楔子",
    ],
    "Poetry": [
        "地铁启示",
        "Poetry",
        "分行",
    ],
    "Diary": [
        "医院",
        "寺庙",
        "转经筒",
        "眼睛的不舒服",
        "世界上只有一个人",
        "地铁在说话",
        "故事之虚伪",
    ],
    "Thoughts": [
        "随笔",
        "思考",
        "脱口秀",
        "深度成长",
        "线性成长",
        "年初清单",
        "惯性",
        "产品经理",
        "JD",
    ],
    "Source": [
        "I argue",
        "According to",
        "Nowadays,",
        "cosmopolitanism",
        "Papastergiadis",
        "论文",
        "文献",
        "Maddy",
        "Forgiveness",
        "Celeste &",
    ],
    "VideoNovel": [
        "设定",
        "VideoNovel",
        "互动小说",
    ],
    "PRD": [
        "需求文档",
        "PRD",
        "需求模板",
        "验收",
    ],
    "Philosophy": [
        "哲学",
        "本体",
        "伦理",
        "Deed",
    ],
    "Tech": [
        "协程",
        "42Tips",
        "备忘",
        "技术路线图",
    ],
    "Drama": [
        "戏剧",
        "剧本",
        "魏博",
    ],
    "Essay": [
        "虚伪",
        "杂文",
    ],
    "Agent": [
        "Agent",
        "智能体",
        "考研Agent",
    ],
    "Books": [
        "Books",
        "flake",
    ],
    "Test": [
        "Sample blog",
        "sample-markdown",
        "readme",
    ],
}

# Remove false positives: Game Dev list had 医美 - I duplicated in AI - remove from Game Dev
TAG_KEYWORDS["Game Dev"] = [k for k in TAG_KEYWORDS["Game Dev"] if k != "医美"]


def split_front_matter(raw: str) -> tuple[str | None, str, str]:
    if raw.startswith("\ufeff"):
        raw = raw[1:]
    m = re.match(r"^---\s*\r?\n(.*?)\r?\n---\s*\r?\n", raw, re.S)
    if not m:
        return None, "", raw
    return m.group(1), raw[m.end() :], raw


def strip_opening_fences(body: str) -> str:
    t = body.lstrip()
    while t.startswith("```"):
        end = t.find("\n```", 3)
        if end == -1:
            break
        t = t[end + 4 :].lstrip()
    return t


def extract_preview(body: str, n: int = 50) -> str:
    t = strip_opening_fences(body)
    lines = t.splitlines()
    parts: list[str] = []
    for line in lines:
        s = line.strip()
        if not s or s == "---":
            continue
        if s.startswith("#"):
            s = re.sub(r"^#+\s*", "", s)
        parts.append(s)
    t = " ".join(parts)
    t = strip_opening_fences(t)
    t = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", t)
    t = re.sub(r"[#*`_|\\]", "", t)
    t = re.sub(r"<[^>]+>", " ", t)
    t = re.sub(r"\s+", "", t)
    return t[:n]


def parse_title(fm: str) -> str:
    m = re.search(r"^title:\s*(.+)$", fm, re.M)
    if not m:
        return ""
    s = m.group(1).strip()
    if (s.startswith('"') and s.endswith('"')) or (s.startswith("'") and s.endswith("'")):
        s = s[1:-1]
    return s


def stem_name(filename: str) -> str:
    base = filename[:-3] if filename.endswith(".md") else filename
    return re.sub(r"^\d{4}-\d{2}-\d{2}-", "", base)


def score_tags(preview: str, title: str, stem: str) -> list[str]:
    hay = preview + title + stem
    scores: dict[str, int] = defaultdict(int)
    for tag, kws in TAG_KEYWORDS.items():
        for kw in kws:
            if kw in hay:
                scores[tag] += 2 if kw in preview else 1
    # Filename / title strong signals
    if "AI笔记" in title or "AI笔记" in stem:
        scores["AI"] += 5
    if "写作练习" in title or "写作练习" in stem:
        scores["Writing"] += 5
        scores["Fiction"] += 3
    if "信件" in title or re.search(r"信件[A-Z]", stem):
        scores["Novel"] += 6
        scores["Fiction"] -= 2
    if "设定" in title or "设定" in stem:
        scores["VideoNovel"] += 4
        scores["Game Dev"] += 2
    if "GDC" in title or "GDC" in stem:
        scores["Game Dev"] += 4
        scores["Source"] += 2
    if re.search(r"Maddy|Forgiveness|Celeste &|2D跑酷", stem + title):
        scores["Source"] += 4
        scores["Game Dev"] += 2
    if re.search(r"Indies|Games' Arts|cosmopolitanism", stem + title, re.I):
        scores["Game Dev"] += 6
        scores["Source"] += 3
    if "sql" in title.lower() or "SQL" in preview:
        scores["Programming"] += 5
    if "数据分析" in title:
        scores["Programming"] += 4
    if "Agent" in title or "Agent" in stem or "考研Agent" in stem + title:
        scores["Agent"] += 5
        scores["AI"] += 2
    if "Feed" in title or "Deed" in title:
        scores["Philosophy"] += 2
        scores["AI"] += 2
        scores["Agent"] += 3
    if "地铁" in title:
        scores["Writing"] += 4
        scores["Poetry"] += 3
    if "寺庙" in title or "寺庙" in stem:
        scores["Diary"] += 2
        scores["Writing"] += 4
    if re.search(r"AI提示词|提示词技巧", title + stem):
        scores["AI"] += 6
        scores["Game Dev"] = max(0, scores["Game Dev"] - 5)
    if scores.get("Fiction", 0) > 0 and scores.get("Novel", 0) > 4:
        scores["Fiction"] = max(0, scores["Fiction"] - 3)
    if "设定" in title and scores.get("VideoNovel", 0) >= 4:
        scores["Fiction"] = max(0, scores["Fiction"] - 4)
    if "你提到的" in preview + title or "让我们再从" in preview + title:
        scores["AI"] += 4
        scores["Writing"] += 3
        scores["Diary"] += 2
        scores["Source"] = max(0, scores["Source"] - 3)
    _series = "二十二世纪精神病人" in title
    _chat_markers = (
        "你提到的",
        "你觉得",
        "这个表述",
        "让我们再从",
        "基于你",
        "确实有点模糊",
        "为什么你",
    )
    if _series:
        scores["Writing"] += 3
        scores["Diary"] += 2
    if _series and any(m in preview + title for m in _chat_markers):
        scores["AI"] += 4
    if "Copilot" in preview + title or "Cursor" in preview + title:
        scores["AI"] += 5
        scores["Programming"] += 4
        scores["Thoughts"] += 2
    if "mermaid" in (title + stem).lower():
        scores["AI"] += 4
    if re.search(r"设计分析|系统分析|机制研究|编码思路", title + stem):
        scores["Fiction"] = max(0, scores["Fiction"] - 8)

    ranked = sorted(scores.items(), key=lambda x: (-x[1], x[0]))
    out = [t for t, s in ranked if s > 0][:4]
    if not out:
        if "AI" in title or "Agent" in title or "智能" in title:
            out = ["AI"]
        elif "游戏" in title or "关卡" in title or "Unity" in title:
            out = ["Game Dev"]
        elif "写作" in title or "习作" in title or "小说" in title:
            out = ["Writing"]
        else:
            out = ["Thoughts"]
    if "Thoughts" in out and "Writing" in out and "Diary" in out:
        out = [t for t in out if t != "Thoughts"][:4]
    return out


def format_tags_line(tags: list[str]) -> str:
    inner = ", ".join(tags)
    return f"tags: [{inner}]"


def replace_tags_line(fm: str, new_line: str) -> str:
    if re.search(r"(?m)^tags:\s*", fm):
        return re.sub(r"(?m)^tags:\s*\[.*?\]\s*$", new_line, fm, count=1)
    return re.sub(
        r"(?m)^(author:\s*[^\n]+\n)",
        r"\1" + new_line + "\n",
        fm,
        count=1,
    )


def should_preserve_theme_post(fm: str, filename: str) -> list[str] | None:
    if "gh-repo:" in fm and "sample-markdown" in filename:
        return ["Test"]
    if "flake-it-till-you-make-it" in filename:
        return ["Books", "Test"]
    if re.match(r"2020-02-26-readme\.md$", filename):
        return ["Books", "Test"]
    return None


def parse_tags_from_fm(fm: str) -> list[str]:
    m = re.search(r"(?m)^tags:\s*\[(.*)\]\s*$", fm)
    if not m:
        return []
    inner = m.group(1).strip()
    if not inner:
        return []
    return [p.strip().strip("'\"") for p in inner.split(",") if p.strip()]


def process_file(path: str, apply: bool) -> tuple[bool, str, list[str], list[str]]:
    name = os.path.basename(path)
    with open(path, encoding="utf-8") as f:
        raw = f.read()
    fm, body, _ = split_front_matter(raw)
    if fm is None:
        return False, name, [], []
    preserved = should_preserve_theme_post(fm, name)
    title = parse_title(fm)
    stem = stem_name(name)
    preview = extract_preview(body, 50)
    if preserved is not None:
        new_tags = preserved
    else:
        new_tags = score_tags(preview, title, stem)
    old_tags = parse_tags_from_fm(fm)
    new_line = format_tags_line(new_tags)
    fm2 = replace_tags_line(fm, new_line)
    changed = fm2 != fm
    if apply and changed:
        out = "---\n" + fm2.strip() + "\n---\n" + body
        if not out.endswith("\n"):
            out += "\n"
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(out)
    return changed, name, old_tags, new_tags


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()
    names = sorted({n for n in os.listdir(BASE) if n.endswith(".md")})
    changed_n = 0
    samples = []
    for n in names:
        path = os.path.join(BASE, n)
        ch, name, old, new = process_file(path, args.apply)
        if ch:
            changed_n += 1
            if len(samples) < 15:
                samples.append((name, old, new))
    print("posts:", len(names))
    print("changed:", changed_n, "(dry-run)" if not args.apply else "(written)")
    for name, old, new in samples:
        print(" ", name)
        print("    old:", old, "-> new:", new)


if __name__ == "__main__":
    main()
