import os

files = sorted(os.listdir('extracted_pptx/ppt/media'))
print(f"Total files in media: {len(files)}")
for f in files:
    size = os.path.getsize(os.path.join('extracted_pptx/ppt/media', f))
    print(f"{f:15} {size} bytes")
