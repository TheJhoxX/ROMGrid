# Editing the ROMGrid identity in Affinity

Open `romgrid-wordmark.svg` in Affinity. It contains the complete horizontal
logo with editable vector shapes and live text.

The transparent checkerboard around the artwork is intentional: the horizontal
logo has no background, so it can sit on the website, video, or any colored
surface. The dark outer shape belongs to the symbol. Its corner radius is 48 px
in the 512 px master, close to the original ROMGrid silhouette.

The document uses the same type family as the ROMGrid web application:

- Geist Black (900) for `ROMGrid`
- Geist Bold (700) for secondary copy

Both font files are included in `fonts/`. Install them in the Wine prefix or
temporarily activate them before opening the SVG if Affinity reports a missing
font.

After opening the SVG, use **File > Save As** and save the native Affinity
document beside it as `romgrid-identity.af`.

Keep the SVG files as the portable masters. Unlike the native Affinity format,
they can be edited by Affinity, Inkscape, Figma and ordinary text editors.
