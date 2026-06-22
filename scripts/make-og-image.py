#!/usr/bin/env python3
"""Generate the social-share (Open Graph) card for rogerwinter.dev.

Renders a 1200x630 PNG that mirrors the site's dark theme and header
monogram: the accent-green "RW" badge, the wordmark, and the tagline,
over the same radial accent glow used by the site hero.

Fonts (Syne / Hanken Grotesk) are read straight from the site's own
vendored web fonts in site/vendor/fonts/ (variable woff2, pinned to the
weights the header uses), so the card matches the live typography exactly
and the build needs no external font fetch.
"""
import os

from PIL import Image, ImageDraw, ImageFont, ImageFilter

# ── theme tokens (from portfolio/shell.jsx) ────────────────────────────
BG     = (11, 13, 12)     # --bg     #0b0d0c
PANEL  = (16, 20, 18)     # --panel  #101412
ACC    = (91, 140, 255)   # --acc    #5b8cff (TW_DEFAULTS accent, applied as --acc)
BORDER = (63, 93, 155)    # color-mix(acc 55%, line) -> header monogram border (#3f5d9b)
INK    = (215, 224, 218)  # --ink    #d7e0da
DIM    = (126, 138, 131)  # --dim    #7e8a83

W, H = 1200, 630
PAD = 96

# The site's own vendored Google Fonts (variable woff2). Filenames are the
# content-hashed ones written by fetch-fonts.py; see site/vendor/fonts/fonts.css
# for the family/weight mapping. Pillow's FreeType reads woff2, and vfont() pins
# the weight via the variable Weight axis so the card matches the header.
ROOT   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS  = os.path.join(ROOT, "site", "vendor", "fonts")
SYNE   = os.path.join(FONTS, "8vIH7w4qzmVxm2BL9A.woff2")               # Syne, var wght
HANKEN = os.path.join(FONTS, "ieVn2YZDLWuGJpnzaiwFXS9tYtpd59A.woff2")  # Hanken Grotesk, var wght
MONO   = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"


def vfont(path, size, weight):
    """Load a variable font at a pixel size with its Weight axis pinned."""
    f = ImageFont.truetype(path, size)
    f.set_variation_by_axes([weight])
    return f

img = Image.new("RGB", (W, H), BG)

# ── radial accent glow (echoes the site hero gradient) ─────────────────
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
gd.ellipse([W * 0.5 - 720, -360, W * 0.5 + 720, 480], fill=ACC + (40,))
glow = glow.filter(ImageFilter.GaussianBlur(160))
img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
draw = ImageDraw.Draw(img)

# ── monogram badge (outlined rounded square, like .tm-mono) ────────────
badge = 132
bx, by = PAD, PAD
draw.rounded_rectangle([bx, by, bx + badge, by + badge], radius=34,
                       fill=PANEL, outline=BORDER, width=3)
mono_font = vfont(SYNE, 70, 800)
mb = draw.textbbox((0, 0), "RW", font=mono_font)
mx = bx + (badge - (mb[2] - mb[0])) / 2 - mb[0]
my = by + (badge - (mb[3] - mb[1])) / 2 - mb[1]
draw.text((mx, my), "RW", font=mono_font, fill=ACC)

# ── wordmark + tagline ─────────────────────────────────────────────────
name_font = vfont(SYNE, 104, 700)
tag_font  = vfont(HANKEN, 38, 500)
url_font  = ImageFont.truetype(MONO, 26)

name_y = by + badge + 56
draw.text((PAD, name_y), "Roger Winter", font=name_font, fill=INK)

# short accent rule under the name (like the site's pg-kicker rule)
nb = draw.textbbox((PAD, name_y), "Roger Winter", font=name_font)
rule_y = nb[3] + 40
draw.rounded_rectangle([PAD, rule_y, PAD + 64, rule_y + 5], radius=2, fill=ACC)

tag_y = rule_y + 30
draw.text((PAD, tag_y),
          "Developer Advocate",
          font=tag_font, fill=DIM)

# ── footer url ─────────────────────────────────────────────────────────
url = "rogerwinter.dev"
ub = draw.textbbox((0, 0), url, font=url_font)
draw.text((PAD, H - PAD - (ub[3] - ub[1])), url, font=url_font, fill=ACC)

out = os.path.join(ROOT, "site", "portfolio", "assets", "og-cover.png")
img.save(out, "PNG")
print("wrote", out, img.size)
