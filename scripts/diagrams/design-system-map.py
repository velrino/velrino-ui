# /// script
# requires-python = ">=3.11"
# dependencies = ["diagrams>=0.25,<0.26", "pillow>=11,<13"]
# ///
"""Render the reviewed Velrino UI topology with Graphviz and local symbols.

Run from any working directory:
  uv run --locked scripts/diagrams/design-system-map.py --output-dir docs/assets/diagrams

Generated files stay in the requested output directory. No project sources are modified.
"""

from __future__ import annotations

import argparse
import base64
import html
import shutil
import subprocess
import textwrap
import xml.etree.ElementTree as ET
from pathlib import Path

import diagrams
from diagrams.programming.framework import React
from graphviz import Digraph
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
DEFAULT_OUTPUT = ROOT.parents[1] / "docs" / "assets" / "diagrams"
OUTPUT = DEFAULT_OUTPUT
SYMBOLS = OUTPUT / "symbols"

INK = "#211833"
MUTED = "#696278"
CYAN = "#06a6bb"
PURPLE = "#8956dd"
GREEN = "#159b75"
PANEL = "#f6f7fc"
LINE = "#d9deeb"
TITLE = "Velrino UI · Design system map"
SUBTITLE = "Application-owned presentation, reusable React UI and tested release artifacts"
SOURCE_REVISION = "637e7ca"
SIZE = (3840, 2160)
GRAPH_FRAME = (96, 224, 3744, 1940)


def font(size: int, bold: bool = False):
    names = [
        f"/System/Library/Fonts/Supplemental/Arial{' Bold' if bold else ''}.ttf",
        f"/Library/Fonts/Arial{' Bold' if bold else ''}.ttf",
        f"/usr/share/fonts/truetype/dejavu/DejaVuSans{'-Bold' if bold else ''}.ttf",
    ]
    for name in names:
        if Path(name).exists():
            return ImageFont.truetype(name, size)
    return ImageFont.load_default(size=size)


def symbol(name: str, color: str = CYAN) -> Path:
    """Neutral icons communicate roles rather than introducing dependencies."""
    path = SYMBOLS / f"{name}.png"
    canvas = Image.new("RGBA", (256, 256), (255, 255, 255, 0))
    d = ImageDraw.Draw(canvas)
    if name in {"palette", "tokens"}:
        colors = [CYAN, PURPLE, "#63c7d1", "#b195e8"]
        for (x, y), fill in zip([(40, 40), (142, 40), (40, 142), (142, 142)], colors):
            d.rounded_rectangle((x, y, x + 74, y + 74), radius=17, fill=fill)
        if name == "tokens":
            d.line((62, 77, 90, 77), fill="white", width=10)
            d.line((179, 62, 179, 90), fill="white", width=10)
            d.line((165, 77, 193, 77), fill="white", width=10)
    elif name == "provider":
        for x, y in [(128, 48), (54, 194), (202, 194)]:
            d.line((128, 122, x, y), fill=color, width=11)
            d.ellipse((x - 26, y - 26, x + 26, y + 26), fill="white", outline=color, width=10)
        d.ellipse((92, 87, 164, 159), fill=color)
    elif name == "primitives":
        for x, y in [(39, 43), (145, 43), (39, 148), (145, 148)]:
            d.rounded_rectangle((x, y, x + 72, y + 67), radius=13, outline=color, width=10)
    elif name in {"gallery", "apps"}:
        d.rounded_rectangle((25, 35, 232, 219), radius=19, outline=color, width=10)
        d.line((30, 76, 227, 76), fill=color, width=9)
        for x in (50, 73, 96):
            d.ellipse((x, 50, x + 9, 59), fill=color)
        for x, y in [(49, 103), (139, 103), (49, 161), (139, 161)]:
            d.rounded_rectangle((x, y, x + 67, y + 36), radius=8, fill=color)
    elif name == "docs":
        d.rounded_rectangle((48, 24, 208, 231), radius=18, outline=color, width=11)
        d.line((82, 28, 82, 227), fill=color, width=10)
        for y in (84, 126, 168):
            d.line((109, y, 178, y), fill=color, width=10)
    elif name == "artifact":
        d.polygon([(128, 28), (224, 78), (224, 183), (128, 234), (32, 183), (32, 78)], outline=color, width=11)
        d.line((32, 78, 128, 131, 224, 78), fill=color, width=11)
        d.line((128, 131, 128, 234), fill=color, width=11)
        d.line((82, 53, 177, 105), fill=color, width=9)
    elif name == "release":
        d.rounded_rectangle((40, 30, 216, 226), radius=22, outline=color, width=11)
        d.line((128, 59, 128, 153), fill=color, width=13)
        d.line((89, 116, 128, 156, 167, 116), fill=color, width=13, joint="curve")
        d.line((78, 189, 179, 189), fill=color, width=12)
    elif name == "checks":
        d.rounded_rectangle((44, 27, 212, 229), radius=18, outline=color, width=11)
        for y in (77, 129, 180):
            d.line((66, y, 80, y + 12, 102, y - 14), fill=color, width=9, joint="curve")
            d.line((126, y, 185, y), fill=color, width=9)
    else:
        raise ValueError(name)
    canvas.save(path)
    return path


def react_icon() -> Path:
    source = Path(diagrams.__file__).resolve().parent.parent / React._icon_dir / React._icon
    target = SYMBOLS / "react.png"
    shutil.copy2(source, target)
    return target


def card(graph, node_id: str, title: str, subtitle: str, icon: Path):
    title_lines = "<br/>".join(html.escape(line) for line in textwrap.wrap(title, 23))
    sub_lines = "<br/>".join(html.escape(line) for line in subtitle.split("\n"))
    label = (
        '<<table border="0" cellborder="0" cellspacing="0" cellpadding="0">'
        '<tr><td width="180" height="74" fixedsize="true">'
        f'<img src="{html.escape(icon.relative_to(OUTPUT).as_posix())}" scale="true"/></td></tr>'
        '<tr><td height="12"></td></tr>'
        f'<tr><td width="180"><font point-size="17"><b>{title_lines}</b></font></td></tr>'
        '<tr><td height="5"></td></tr>'
        f'<tr><td><font point-size="12" color="{MUTED}">{sub_lines}</font></td></tr>'
        '</table>>'
    )
    graph.node(node_id, label=label)


def make_graph() -> Digraph:
    graph = Digraph("velrino_ui", engine="dot")
    graph.attr(
        rankdir="LR", bgcolor="white", dpi="192", pad="0.24",
        nodesep="0.44", ranksep="0.90", splines="spline", newrank="true",
        compound="true", ordering="out", fontname="Helvetica",
    )
    graph.attr("node", shape="plain", fontname="Helvetica", fontcolor=INK, margin="0")
    graph.attr("edge", color=CYAN, fontcolor=MUTED, fontname="Helvetica", fontsize="11.5", penwidth="1.8", arrowsize="0.72")

    def style(cluster, title: str, tint: str = PANEL):
        cluster.attr(label=title, style="rounded,filled", fillcolor=tint, pencolor=LINE,
                     penwidth="1.2", fontname="Helvetica-Bold", fontsize="13",
                     fontcolor=MUTED, labeljust="l", margin="26")

    with graph.subgraph(name="cluster_app_input") as cluster:
        style(cluster, "APPLICATION PRESENTATION", "#f5fbfc")
        card(cluster, "palette", "App palettes", "Brand colors · fonts\nOverride --vui-* tokens", symbol("palette"))
    with graph.subgraph(name="cluster_foundations") as cluster:
        style(cluster, "LIBRARY FOUNDATIONS")
        card(cluster, "tokens", "Tokens + CSS", "Semantic contract\nNamespaced · accessible", symbol("tokens"))
        card(cluster, "provider", "UIProvider", "Default / sci-fi surfaces\nPer-surface overrides", symbol("provider", PURPLE))
        card(cluster, "primitives", "Radix + Base UI", "Accessible interactions\nUsed by relevant families", symbol("primitives", PURPLE))
    with graph.subgraph(name="cluster_runtime") as cluster:
        style(cluster, "REUSABLE RUNTIME")
        cluster.attr(labeljust="r")
        card(cluster, "components", "React components", "Panel · Dialog · controls\nPublic + granular exports", react_icon())
    with graph.subgraph(name="cluster_docs") as cluster:
        style(cluster, "OPTIONAL SHOWCASE · CANONICAL DOCS", "#f8f5fd")
        card(cluster, "showcase", "Optional showcase", "Real public components\nSeparate export + typed copy", symbol("gallery", PURPLE))
        card(cluster, "docs", "Docs website", "apps/docs · Vite\nHosted on GitHub Pages", symbol("docs", PURPLE))
    with graph.subgraph(name="cluster_distribution") as cluster:
        style(cluster, "BUILD & DISTRIBUTION")
        card(cluster, "artifact", "Package artifacts", "ESM · declarations · CSS\nPreserves client boundaries", symbol("artifact"))
        card(cluster, "release", "GitHub release", "Tested tarball\nPinned release URL", symbol("release"))
    with graph.subgraph(name="cluster_consumers") as cluster:
        style(cluster, "APPLICATION OWNERSHIP", "#f5fbfc")
        card(cluster, "apps", "Consumer apps", "Own routes · locale · brand\nReact + React DOM peers", symbol("apps"))
    with graph.subgraph(name="cluster_verification") as cluster:
        style(cluster, "VERIFICATION", "#f3faf7")
        cluster.attr(labeljust="r")
        card(cluster, "checks", "Source + package checks", "Types · behavior · imports\nSSR · peers · bundled CSS", symbol("checks", GREEN))

    # Rank constraints keep branches legible without changing edge meaning.
    with graph.subgraph() as ranks:
        ranks.attr(rank="same")
        for node in ("palette", "tokens", "provider", "primitives"):
            ranks.node(node)
    with graph.subgraph() as ranks:
        ranks.attr(rank="same")
        ranks.node("showcase")
        ranks.node("artifact")
        ranks.node("checks")
    graph.edge("palette", "tokens", style="invis", weight="20")
    graph.edge("tokens", "provider", style="invis", weight="20")
    graph.edge("provider", "primitives", style="invis", weight="20")
    graph.edge("showcase", "artifact", style="invis", weight="20")
    graph.edge("artifact", "checks", style="invis", weight="20")

    graph.edge("palette", "components", label="colors + fonts", weight="3", tailport="e", headport="nw")
    graph.edge("tokens", "components", label="semantic CSS", weight="3")
    graph.edge("provider", "components", label="appearance", color=PURPLE, weight="3")
    graph.edge("primitives", "components", label="where used", color=PURPLE, weight="3")
    graph.edge("components", "showcase", label="compose", color=PURPLE, weight="5")
    graph.edge("showcase", "docs", label="render", color=PURPLE, weight="5")
    graph.edge("components", "artifact", label="compile", weight="5")
    graph.edge("artifact", "release", label="pack", weight="5")
    graph.edge("release", "apps", label="install + pin", weight="5")
    graph.edge("components", "checks", label="behavior", color=GREEN, style="dotted", constraint="false")
    graph.edge("artifact", "checks", color=GREEN, style="dotted", constraint="false")
    return graph


def layout_frame(width: float, height: float):
    left, top, right, bottom = GRAPH_FRAME
    factor = min((right - left) / width, (bottom - top) / height)
    return factor, left + ((right - left) - width * factor) / 2, top + ((bottom - top) - height * factor) / 2


def decorate_png(raw: Path):
    canvas = Image.new("RGB", SIZE, "white")
    with Image.open(raw) as source:
        factor, x, y = layout_frame(source.width, source.height)
        fitted = source.convert("RGB").resize((round(source.width * factor), round(source.height * factor)), Image.Resampling.LANCZOS)
        canvas.paste(fitted, (round(x), round(y)))
    draw = ImageDraw.Draw(canvas)
    draw.text((88, 40), TITLE, fill=INK, font=font(72, True))
    draw.text((90, 132), SUBTITLE, fill=MUTED, font=font(34))
    draw.line((92, 2013, 190, 2013), fill=CYAN, width=5)
    draw.polygon([(190, 2013), (175, 2005), (175, 2021)], fill=CYAN)
    draw.text((211, 1995), "Composition / distribution", fill=MUTED, font=font(28))
    for x in range(780, 879, 17):
        draw.ellipse((x, 2009, x + 7, 2016), fill=GREEN)
    draw.text((900, 1995), "Verification", fill=MUTED, font=font(28))
    footer = f"Source {SOURCE_REVISION} · Relationships show responsibility and composition, not a complete import graph."
    draw.text((90, 2080), footer, fill=MUTED, font=font(27))
    canvas.save(OUTPUT / "design-system-map.png")


def decorate_svg(raw: Path):
    """Embed icons so the SVG remains portable and independently editable."""
    ns = "http://www.w3.org/2000/svg"
    xlink = "http://www.w3.org/1999/xlink"
    ET.register_namespace("", ns)
    ET.register_namespace("xlink", xlink)
    tree = ET.parse(raw)
    original = tree.getroot()
    box = [float(item) for item in original.attrib["viewBox"].split()]
    factor, x, y = layout_frame(box[2], box[3])
    svg = ET.Element(f"{{{ns}}}svg", {"width": str(SIZE[0]), "height": str(SIZE[1]), "viewBox": f"0 0 {SIZE[0]} {SIZE[1]}"})
    svg.set("role", "img")
    svg.set("aria-labelledby", "map-title map-description")
    ET.SubElement(svg, f"{{{ns}}}title", {"id": "map-title"}).text = TITLE
    ET.SubElement(svg, f"{{{ns}}}desc", {"id": "map-description"}).text = "Application palettes and shared foundations shape reusable React components. Components support optional documentation and packaged GitHub releases for consuming applications. Dotted arrows show verification."
    ET.SubElement(svg, f"{{{ns}}}rect", {"width": "100%", "height": "100%", "fill": "white"})
    graph = ET.SubElement(svg, f"{{{ns}}}g", {"transform": f"translate({x:g},{y:g}) scale({factor:g})"})
    for child in original:
        graph.append(child)
    for image in graph.iter(f"{{{ns}}}image"):
        key = f"{{{xlink}}}href"
        asset = raw.parent / image.attrib[key]
        image.set(key, "data:image/png;base64," + base64.b64encode(asset.read_bytes()).decode())
    def text(x, y, value, size=28, bold=False, color=MUTED):
        el = ET.SubElement(svg, f"{{{ns}}}text", {"x": str(x), "y": str(y), "font-family": "Arial, Helvetica, sans-serif", "font-size": str(size), "fill": color, "font-weight": "700" if bold else "400"})
        el.text = value
    text(88, 103, TITLE, 72, True, INK)
    text(90, 161, SUBTITLE, 34)
    ET.SubElement(svg, f"{{{ns}}}path", {"d": "M92 2013 H190 l-15 -8 m15 8 l-15 8", "stroke": CYAN, "stroke-width": "5", "fill": "none"})
    text(211, 2019, "Composition / distribution")
    ET.SubElement(svg, f"{{{ns}}}path", {"d": "M780 2013 H879", "stroke": GREEN, "stroke-width": "6", "stroke-dasharray": "2 14", "stroke-linecap": "round", "fill": "none"})
    text(900, 2019, "Verification")
    text(90, 2105, f"Source {SOURCE_REVISION} · Relationships show responsibility and composition, not a complete import graph.", 27)
    ET.ElementTree(svg).write(OUTPUT / "design-system-map.svg", encoding="utf-8", xml_declaration=True)


def main():
    global OUTPUT, SYMBOLS
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT, help="Directory for PNG, SVG, DOT and generated symbol sidecars.")
    args = parser.parse_args()
    OUTPUT = args.output_dir.expanduser().resolve()
    SYMBOLS = OUTPUT / "symbols"
    SYMBOLS.mkdir(parents=True, exist_ok=True)
    if not shutil.which("dot"):
        raise SystemExit("Graphviz dot is required (brew install graphviz).")
    graph = make_graph()
    source = OUTPUT / "design-system-map.dot"
    source.write_text(graph.source, encoding="utf-8")
    for extension in ("png", "svg"):
        raw = OUTPUT / f"design-system-map-raw.{extension}"
        subprocess.run(["dot", f"-T{extension}", str(source), "-o", str(raw)], cwd=OUTPUT, check=True)
        (decorate_png if extension == "png" else decorate_svg)(raw)
        raw.unlink()
    print(f"PNG: {OUTPUT / 'design-system-map.png'}")
    print(f"SVG: {OUTPUT / 'design-system-map.svg'}")
    print(f"DOT: {source}")


if __name__ == "__main__":
    main()
