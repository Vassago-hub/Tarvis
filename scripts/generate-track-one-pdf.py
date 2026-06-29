from __future__ import annotations

from pathlib import Path
import re

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont, TTFError
from reportlab.platypus import Paragraph, Preformatted, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "submissions" / "track-one-tcl-service-agent" / "TECHNICAL_DOCUMENT.md"
OUTPUT = ROOT / "submissions" / "track-one-tcl-service-agent" / "TCL官网智能服务助手_技术文档.pdf"


def register_fonts() -> tuple[str, str]:
    regular_candidates = [
        (Path(r"C:\Windows\Fonts\Noto Sans SC (TrueType).otf"), "NotoSansSC"),
        (Path(r"C:\Windows\Fonts\msyh.ttc"), "MicrosoftYaHei"),
        (Path(r"C:\Windows\Fonts\simhei.ttf"), "SimHei"),
        (Path(r"C:\Windows\Fonts\ARIALUNI.ttf"), "ArialUnicode"),
    ]
    bold_candidates = [
        (Path(r"C:\Windows\Fonts\Noto Sans SC Bold (TrueType).otf"), "NotoSansSCBold"),
        (Path(r"C:\Windows\Fonts\msyhbd.ttc"), "MicrosoftYaHeiBold"),
        (Path(r"C:\Windows\Fonts\simhei.ttf"), "SimHeiBold"),
        (Path(r"C:\Windows\Fonts\ARIALUNI.ttf"), "ArialUnicodeBold"),
    ]
    regular = None
    bold = None
    for path, name in regular_candidates:
        if path.exists():
            try:
                pdfmetrics.registerFont(TTFont(name, str(path)))
            except TTFError:
                continue
            regular = name
            break
    for path, name in bold_candidates:
        if path.exists():
            try:
                pdfmetrics.registerFont(TTFont(name, str(path)))
            except TTFError:
                continue
            bold = name
            break
    return regular or "Helvetica", bold or regular or "Helvetica-Bold"


def escape(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def inline_markdown(text: str) -> str:
    text = escape(text)
    text = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"`([^`]+)`", r"<font name='Courier'>\1</font>", text)
    return text


def parse_table(lines: list[str], style: ParagraphStyle):
    rows = []
    for line in lines:
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells):
            continue
        rows.append([Paragraph(inline_markdown(cell), style) for cell in cells])
    if not rows:
        return None
    table = Table(rows, hAlign="LEFT", repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#eef2ff")),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#cbd5e1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return table


def build_story(markdown: str):
    regular, bold = register_fonts()
    base = getSampleStyleSheet()
    base.add(ParagraphStyle(name="TitleCN", fontName=bold, fontSize=20, leading=26, spaceAfter=10, wordWrap="CJK"))
    base.add(ParagraphStyle(name="HeadingCN", fontName=bold, fontSize=14, leading=19, spaceBefore=10, spaceAfter=5, wordWrap="CJK"))
    base.add(ParagraphStyle(name="Heading2CN", fontName=bold, fontSize=11.5, leading=16, spaceBefore=7, spaceAfter=3, wordWrap="CJK"))
    base.add(ParagraphStyle(name="BodyCN", fontName=regular, fontSize=9.2, leading=13.5, spaceAfter=4, wordWrap="CJK"))
    base.add(ParagraphStyle(name="BulletCN", parent=base["BodyCN"], leftIndent=12, firstLineIndent=-7))
    code_style = ParagraphStyle(
        name="CodeCN",
        fontName=regular,
        fontSize=7.2,
        leading=9.5,
        leftIndent=5,
        rightIndent=5,
        spaceBefore=3,
        spaceAfter=5,
        backColor=colors.HexColor("#f8fafc"),
        borderColor=colors.HexColor("#e2e8f0"),
        borderWidth=0.25,
        borderPadding=4,
    )

    story = []
    lines = markdown.splitlines()
    in_code = False
    code_lines: list[str] = []
    table_lines: list[str] = []

    def flush_table():
        nonlocal table_lines
        if table_lines:
            table = parse_table(table_lines, base["BodyCN"])
            if table:
                story.append(table)
                story.append(Spacer(1, 4))
            table_lines = []

    for line in lines:
        if line.startswith("```"):
            if in_code:
                story.append(Preformatted("\n".join(code_lines), code_style))
                code_lines = []
                in_code = False
            else:
                flush_table()
                in_code = True
            continue
        if in_code:
            code_lines.append(line)
            continue
        if line.startswith("|"):
            table_lines.append(line)
            continue
        flush_table()
        text = line.strip()
        if not text:
            story.append(Spacer(1, 2))
        elif text.startswith("# "):
            story.append(Paragraph(inline_markdown(text[2:]), base["TitleCN"]))
        elif text.startswith("## "):
            story.append(Paragraph(inline_markdown(text[3:]), base["HeadingCN"]))
        elif text.startswith("### "):
            story.append(Paragraph(inline_markdown(text[4:]), base["Heading2CN"]))
        elif text.startswith("- "):
            story.append(Paragraph("• " + inline_markdown(text[2:]), base["BulletCN"]))
        else:
            story.append(Paragraph(inline_markdown(text), base["BodyCN"]))
    flush_table()
    return story


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#64748b"))
    canvas.drawRightString(200 * mm, 10 * mm, f"Page {doc.page}")
    canvas.restoreState()


def main() -> None:
    markdown = SOURCE.read_text(encoding="utf-8")
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=15 * mm,
        leftMargin=15 * mm,
        topMargin=14 * mm,
        bottomMargin=15 * mm,
        title="TCL Official Site Service Agent Technical Document",
    )
    doc.build(build_story(markdown), onFirstPage=footer, onLaterPages=footer)
    print(OUTPUT)


if __name__ == "__main__":
    main()


