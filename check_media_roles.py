# Let's inspect the names and logos of slide 4
from PIL import Image
import os

# Check image1.png, image2.png, image3.svg, image4.png, image8.png, image13.png, image15.png, image16.png, image17.png, image27.svg, image32.png
print("Checking slide background images and components...")
for img_name in ['image1.png', 'image2.png', 'image4.png', 'image6.png', 'image8.png', 'image13.png', 'image14.jpeg', 'image15.png', 'image16.png', 'image17.png', 'image27.svg', 'image28.png', 'image29.png', 'image32.png']:
    p = os.path.join('extracted_pptx/ppt/media', img_name)
    if os.path.exists(p):
        print(f"{img_name}: {os.path.getsize(p)} bytes")
