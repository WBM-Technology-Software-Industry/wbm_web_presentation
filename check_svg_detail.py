# Inspect image3.svg and image27.svg in detail
with open('extracted_pptx/ppt/media/image3.svg', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()
    print("image3.svg len:", len(txt), "starts with:", txt[:200])

with open('extracted_pptx/ppt/media/image27.svg', 'r', encoding='utf-8', errors='ignore') as f:
    txt2 = f.read()
    print("image27.svg len:", len(txt2), "starts with:", txt2[:200])
