from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    # Create valid directory if it doesn't exist
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    # Create a simple icon
    img = Image.new('RGB', (size, size), color='#4F46E5') # Indigo-600 color
    d = ImageDraw.Draw(img)
    
    # Draw a circle
    margin = size // 10
    d.ellipse([margin, margin, size - margin, size - margin], outline="white", width=size//20)
    
    # Draw arrow (simplified)
    # arrow points
    center_x = size // 2
    center_y = size // 2
    arrow_width = size // 4
    arrow_height = size // 3
    
    # Draw triangle part
    triangle_points = [
        (center_x - arrow_width, center_y),
        (center_x + arrow_width, center_y),
        (center_x, center_y + arrow_height)
    ]
    d.polygon(triangle_points, fill="white")
    
    # Draw rectangle part
    rect_width = arrow_width // 2
    d.rectangle(
        [center_x - rect_width, center_y - arrow_height, center_x + rect_width, center_y],
        fill="white"
    )
    
    img.save(filename)
    print(f"Created {filename}")

# Create icons in frontend/public
public_dir = os.path.join('frontend', 'public')
create_icon(192, os.path.join(public_dir, 'pwa-192x192.png'))
create_icon(512, os.path.join(public_dir, 'pwa-512x512.png'))
