import os
from PIL import Image

# Check what each image is by looking at details
print("=== MEDIA SUMMARY ===")
for f in sorted(os.listdir('extracted_pptx/ppt/media')):
    p = os.path.join('extracted_pptx/ppt/media', f)
    size = os.path.getsize(p)
    ext = os.path.splitext(f)[1].lower()
    if ext in ['.png', '.jpg', '.jpeg']:
        with Image.open(p) as img:
            print(f"{f:12} {ext:5} {img.size} mode={img.mode} {size} bytes")
    else:
        print(f"{f:12} {ext:5} {size} bytes")
