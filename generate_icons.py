from PIL import Image
import os

# Path to the source icon
source_icon = r"C:\Users\pedro\.gemini\antigravity\brain\eb046f57-6bdf-4397-84e4-32de1998d98a\uploaded_media_1769513900941.png"

# Output directory
output_dir = r"C:\Users\pedro\Desktop\Estágio WINPROVIT\winprovit-support-ai\public\icons"

# Icon sizes needed for PWA
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

# Open the source image
img = Image.open(source_icon)

# Convert to RGBA if necessary
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Generate icons for each size
for size in sizes:
    resized = img.resize((size, size), Image.LANCZOS)
    output_path = os.path.join(output_dir, f"icon-{size}x{size}.png")
    resized.save(output_path, "PNG")
    print(f"Created: {output_path}")

# Also create apple-touch-icon (180x180)
apple_icon = img.resize((180, 180), Image.LANCZOS)
apple_icon.save(os.path.join(output_dir, "apple-touch-icon.png"), "PNG")
print("Created: apple-touch-icon.png")

print("\nAll icons generated successfully!")
