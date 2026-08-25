#!/usr/bin/env python3
"""Convert the audited GDS icon font into portable 24px SVG symbols."""

from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont


ICON_RULE = re.compile(
    r"\.gds-icon-([A-Za-z0-9-]+):before\s*\{\s*content:\s*\"\\([0-9a-fA-F]+)\""
)
GENERATED_SYMBOL = re.compile(
    r'\n\s*<symbol id="[^"]+" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="[^"]*"/></symbol>'
)


def compact_number(value: float) -> str:
    if abs(value) < 0.0005:
        value = 0
    return f"{value:.3f}".rstrip("0").rstrip(".")


def arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--css", type=Path, required=True)
    parser.add_argument("--font", type=Path, required=True)
    parser.add_argument("--sprite", type=Path, required=True)
    parser.add_argument("--registry", type=Path, required=True)
    return parser.parse_args()


def symbol_path(glyph_set, glyph_name: str) -> str | None:
    glyph = glyph_set[glyph_name]
    bounds_pen = BoundsPen(glyph_set)
    glyph.draw(bounds_pen)
    if not bounds_pen.bounds:
        return None

    x_min, y_min, x_max, y_max = bounds_pen.bounds
    width = max(x_max - x_min, 1)
    height = max(y_max - y_min, 1)
    scale = min(21 / width, 21 / height)
    translate_x = 12 - scale * (x_min + x_max) / 2
    translate_y = 12 + scale * (y_min + y_max) / 2

    path_pen = SVGPathPen(glyph_set, ntos=compact_number)
    transform_pen = TransformPen(path_pen, (scale, 0, 0, -scale, translate_x, translate_y))
    glyph.draw(transform_pen)
    return path_pen.getCommands()


def main() -> None:
    args = arguments()
    css = args.css.read_text(encoding="utf-8")
    mappings = dict(ICON_RULE.findall(css))
    font = TTFont(args.font)
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()

    sprite = GENERATED_SYMBOL.sub("", args.sprite.read_text(encoding="utf-8"))
    existing = set(re.findall(r'<symbol id="([^"]+)"', sprite))
    additions: list[tuple[str, str]] = []
    for name, codepoint in sorted(mappings.items()):
        icon_id = name.lower()
        if icon_id in existing or icon_id.startswith(("ad---", "ae---")):
            continue
        glyph_name = cmap.get(int(codepoint, 16))
        if not glyph_name:
            continue
        path = symbol_path(glyph_set, glyph_name)
        if path:
            additions.append((icon_id, path))
            existing.add(icon_id)

    generated = "\n".join(
        f'  <symbol id="{html.escape(name)}" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="{html.escape(path)}"/></symbol>'
        for name, path in additions
    )
    args.sprite.write_text(sprite.replace("\n</svg>", f"\n{generated}\n</svg>"), encoding="utf-8")

    registry = sorted(existing)
    args.registry.write_text(
        "window.FOUNDRY_ICON_REGISTRY = " + json.dumps(registry, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    print(f"Imported {len(additions)} icons; registry now contains {len(registry)} symbols.")


if __name__ == "__main__":
    main()
