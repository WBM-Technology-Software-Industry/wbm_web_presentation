from PIL import Image

with Image.open('slide_images/slide_1.png') as img:
    # Logo is around top right, let's find the exact area
    # In 1920x1080, x ~ 1200-1500, y ~ 20-150
    crop = img.crop((1200, 20, 1500, 150))
    crop.save('public/assets/wbm-header-logo.png')
    print("Saved public/assets/wbm-header-logo.png")
