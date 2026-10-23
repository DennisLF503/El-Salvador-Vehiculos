"""
Versión del logo 'Autos SV' con fondo transparente (PNG con alfa real).
Solo el fondo navy exterior (conectado al borde) se vuelve transparente;
las zonas oscuras del auto (ventanas, carrocería) se conservan opacas.
"""
import numpy as np
from PIL import Image, ImageFilter
from collections import deque

SRC = "img/logo-autos-sv.png"
DST = "img/logo-autos-sv-transparente.png"

im = Image.open(SRC).convert("RGB")
a = np.asarray(im).astype(np.float32)
h, w, _ = a.shape

k = 24
corners = np.concatenate([a[:k, :k].reshape(-1, 3), a[:k, -k:].reshape(-1, 3),
                          a[-k:, :k].reshape(-1, 3), a[-k:, -k:].reshape(-1, 3)])
bg = np.median(corners, axis=0)
dist = np.sqrt(((a - bg) ** 2).sum(axis=2))

# Flood-fill exterior solo por píxeles muy cercanos al fondo
T_FLOOD = 30.0
cand = dist <= T_FLOOD
outside = np.zeros((h, w), dtype=bool)
q = deque()
seeds = [(y, x) for y in (0, h - 1) for x in range(w)] + [(y, x) for x in (0, w - 1) for y in range(h)]
for y, x in seeds:
    if cand[y, x] and not outside[y, x]:
        outside[y, x] = True
        q.append((y, x))
while q:
    y, x = q.popleft()
    for ny, nx in ((y-1, x), (y+1, x), (y, x-1), (y, x+1)):
        if 0 <= ny < h and 0 <= nx < w and cand[ny, nx] and not outside[ny, nx]:
            outside[ny, nx] = True
            q.append((ny, nx))

# Alfa: exterior → rampa suave según cercanía al fondo; resto → opaco
ramp = np.clip((dist - 16.0) / (T_FLOOD - 16.0), 0.0, 1.0) ** 1.5
alpha = np.where(outside, ramp, 1.0).astype(np.float32)

# Desmezclar el fondo en la banda semitransparente
A = np.clip(alpha, 1e-3, 1.0)[..., None]
rgb = np.clip(bg + (a - bg) / A, 0, 255)
rgb = np.where(alpha[..., None] < 0.02, a, rgb)

out = np.concatenate([rgb, (alpha * 255)[..., None]], axis=2).astype(np.uint8)
img = Image.fromarray(out, "RGBA")
alpha_img = img.getchannel("A").filter(ImageFilter.GaussianBlur(0.8))
img.putalpha(alpha_img)

bbox = alpha_img.point(lambda v: 255 if v > 8 else 0).getbbox()
pad = 16
bbox = (max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(w, bbox[2]+pad), min(h, bbox[3]+pad))
img = img.crop(bbox)
img.save(DST)
print("saved", DST, img.size, "bg", bg)

for color, name in [((255, 255, 255, 255), "/tmp/check_light.png"), ((16, 20, 40, 255), "/tmp/check_dark.png")]:
    base = Image.new("RGBA", img.size, color)
    base.alpha_composite(img)
    base.convert("RGB").save(name)
