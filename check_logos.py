import os
from PIL import Image

# Let's inspect the small logos in slide 4:
# image18.png, image19.png, image20.png, image21.png, image23.png, image24.png, image25.png, image26.png
# and also image5.png, image7.png, image9.png, image10.png, image11.png, image12.png

logos = ['image5.png', 'image7.png', 'image9.png', 'image10.png', 'image11.png', 'image12.png',
         'image18.png', 'image19.png', 'image20.png', 'image21.png', 'image23.png', 'image24.png', 'image25.png', 'image26.png',
         'image28.png', 'image29.png', 'image30.svg', 'image31.svg']

for l in logos:
    p = os.path.join('extracted_pptx/ppt/media', l)
    if os.path.exists(p):
        print(f"File {l}: size {os.path.getsize(p)}")
