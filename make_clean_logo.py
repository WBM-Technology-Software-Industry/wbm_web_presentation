from PIL import Image

img = Image.open('public/assets/wbm-header-logo.png').convert('RGBA')
pixels = img.load()
w, h = img.size

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        # Calculate brightness of background
        if r < 22 and g < 22 and b < 22:
            pixels[x, y] = (0, 0, 0, 0)

bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

img.save('public/assets/wbm-logo-clean.png')
print("Clean logo saved! Size:", img.size)
