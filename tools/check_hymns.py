"""檢查 hymns.json 的資料一致性。

用法（在專案資料夾執行）：
    python tools/check_hymns.py

檢查項目：
1. 合訂本 H／HH 編號：缺號、重複
2. 歌詞裡夾帶的另一首詩歌（例如「0211b  榮耀的復活 (H081)」寫在 0209 的歌詞中）
3. 歌詞裡出現 H／HH 編號（編號應寫在歌名上，網站才會把它放進合訂本）
4. 重複的詩歌編號（code）

有任何問題時結束代碼為 1，沒有問題為 0。
"""
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

HYMNS_PATH = Path(__file__).resolve().parent.parent / 'hymns.json'

# 合訂本編號範圍，與 index.html 的「合訂本第一冊／第二冊」一致
BOOKS = {'H': 335, 'HH': 199}

# 歌詞中夾帶的詩歌開頭：4～5 位數編號，可接 a/b 或 (A)/(B)，後面緊接歌名
EMBEDDED_HEADER = re.compile(r'^\s*(\d{4,5})([a-z]|\([A-Z]\))?\s*(?=[^\d\s\-.:/])')
# 夾帶詩歌的編號必須緊接在本首之後（差距在此範圍內），用來排除歌詞中的日期、年份
MAX_CODE_DISTANCE = 10


def book_numbers(text, prefix):
    return [int(n) for n in re.findall(r'(?<![A-Za-z])' + prefix + r'(\d{3})(?!\d)', text)]


def check_books(hymns):
    problems = []
    for prefix, last in BOOKS.items():
        used = defaultdict(list)
        for h in hymns:
            for n in book_numbers(h.get('title', ''), prefix):
                used[n].append(h)
        missing = [n for n in range(1, last + 1) if n not in used]
        for n in missing:
            problems.append(f'{prefix}{n:03d} 缺號')
        for n, items in sorted(used.items()):
            if len(items) > 1:
                names = '、'.join(f"{h['code']} {h['title']}" for h in items)
                problems.append(f'{prefix}{n:03d} 重複：{names}')
            if n > last:
                problems.append(f"{prefix}{n:03d} 超出合訂本範圍（{prefix}001～{prefix}{last:03d}）：{items[0]['code']} {items[0]['title']}")
    return problems


def check_embedded(hymns):
    problems = []
    for h in hymns:
        code = h.get('code', '')
        lines = h.get('content', '').split('\n')
        for i, line in enumerate(lines, 1):
            m = EMBEDDED_HEADER.match(line)
            if m and code.isdigit() and len(m.group(1)) == len(code):
                distance = int(m.group(1)) - int(code)
                if 0 < distance <= MAX_CODE_DISTANCE:
                    problems.append(f"{code} {h['title']} 的歌詞第 {i} 行夾帶另一首詩歌：{line.strip()}")
                    continue
            if re.search(r'(?<![A-Za-z])H{1,2}\d{3}(?!\d)', line):
                problems.append(f"{code} {h['title']} 的歌詞第 {i} 行有合訂本編號（應寫在歌名上）：{line.strip()}")
    return problems


def check_codes(hymns):
    seen = defaultdict(list)
    for h in hymns:
        seen[h.get('code', '')].append(h)
    problems = []
    for code, items in seen.items():
        if len(items) > 1:
            names = '、'.join(f"{h['title']}（{h.get('collection', '未標示詩歌集')}）" for h in items)
            problems.append(f'編號 {code} 重複 {len(items)} 次：{names}')
    return problems


def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    hymns = json.loads(HYMNS_PATH.read_text(encoding='utf-8'))
    sections = [
        ('合訂本 H／HH 編號', check_books(hymns)),
        ('歌詞中夾帶的詩歌或編號', check_embedded(hymns)),
        ('重複的詩歌編號', check_codes(hymns)),
    ]
    total = 0
    for title, problems in sections:
        print(f'== {title}：{len(problems)} 個問題')
        for p in problems:
            print(f'  - {p}')
        total += len(problems)
    print(f'\n共 {len(hymns)} 筆資料，{total} 個問題。')
    return 1 if total else 0


if __name__ == '__main__':
    sys.exit(main())
