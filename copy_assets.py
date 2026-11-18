import os
import shutil

os.makedirs('public/assets', exist_ok=True)

# Copy media
files_to_copy = {
    'extracted_pptx/ppt/media/image2.png': 'public/assets/wbm-logo.png',
    'extracted_pptx/ppt/media/image14.jpeg': 'public/assets/wbm-team.jpg',
    'extracted_pptx/ppt/media/image17.png': 'public/assets/clients-logos.png',
    'extracted_pptx/ppt/media/image25.png': 'public/assets/partner-testari.png',
    'extracted_pptx/ppt/media/image26.png': 'public/assets/partner-aqualabo.png',
    'extracted_pptx/ppt/media/image23.png': 'public/assets/partner-keller.png',
    'extracted_pptx/ppt/media/image24.png': 'public/assets/partner-gutermann.png',
    'extracted_pptx/ppt/media/image32.png': 'public/assets/vcr-solution.png',
    'extracted_pptx/ppt/media/image6.png': 'public/assets/icon-integration.png',
    'extracted_pptx/ppt/media/image1.png': 'public/assets/bg-mesh.png',
    'extracted_pptx/ppt/media/image13.png': 'public/assets/slide3-frame.png',
    'slide_images/slide_1.png': 'public/assets/og-preview.png',
    'slide_images/slide_1.png': 'public/assets/slide-1-full.png',
    'slide_images/slide_2.png': 'public/assets/slide-2-full.png',
    'slide_images/slide_3.png': 'public/assets/slide-3-full.png',
    'slide_images/slide_4.png': 'public/assets/slide-4-full.png',
    'slide_images/slide_5.png': 'public/assets/slide-5-full.png',
}

for src, dst in files_to_copy.items():
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Copied {src} -> {dst}")
    else:
        print(f"WARNING: {src} not found!")

# Also let's create a transparent square favicon from the WBM logo
from PIL import Image

try:
    with Image.open('public/assets/wbm-logo.png') as img:
        # Resize to 64x64 or 192x192 favicon
        img.thumbnail((192, 192), Image.Resampling.LANCZOS)
        img.save('public/favicon.png', 'PNG')
        print("Created public/favicon.png")
except Exception as e:
    print("Favicon creation error:", e)
