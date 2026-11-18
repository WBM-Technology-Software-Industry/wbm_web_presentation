import os

for f in ['image3.svg', 'image22.svg', 'image27.svg', 'image30.svg', 'image31.svg']:
    p = os.path.join('extracted_pptx/ppt/media', f)
    if os.path.exists(p):
        print(f"=== {f} ===")
        with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
            content = fp.read()
            print(content[:300] + ('...' if len(content) > 300 else ''))
