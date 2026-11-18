import xml.etree.ElementTree as ET
import os

ns = {
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

for i in range(1, 6):
    print(f"\n==================== SLIDE {i} ====================")
    slide_xml = f'extracted_pptx/ppt/slides/slide{i}.xml'
    tree = ET.parse(slide_xml)
    root = tree.getroot()
    
    # Load relationships
    rel_xml = f'extracted_pptx/ppt/slides/_rels/slide{i}.xml.rels'
    rels = {}
    if os.path.exists(rel_xml):
        rel_tree = ET.parse(rel_xml)
        for rel in rel_tree.getroot():
            rels[rel.attrib.get('Id')] = rel.attrib.get('Target')

    # Find colors
    colors = set()
    for srgb in root.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}srgbClr'):
        colors.add(srgb.attrib.get('val'))
    print("Colors (sRGB):", sorted(list(colors)))

    # Find fonts
    fonts = set()
    for font in root.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}rPr'):
        for child in font:
            if 'typeface' in child.attrib:
                fonts.add(child.attrib['typeface'])
    print("Typefaces:", sorted(list(fonts)))

    # Pictures
    print("Pictures:")
    for pic in root.iter('{http://schemas.openxmlformats.org/presentationml/2006/main}pic'):
        nvPr = pic.find('{http://schemas.openxmlformats.org/presentationml/2006/main}nvPicPr')
        cNvPr = nvPr.find('{http://schemas.openxmlformats.org/presentationml/2006/main}cNvPr') if nvPr is not None else None
        name = cNvPr.attrib.get('name', '') if cNvPr is not None else ''
        descr = cNvPr.attrib.get('descr', '') if cNvPr is not None else ''
        blip = pic.find('.//{http://schemas.openxmlformats.org/drawingml/2006/main}blip')
        rid = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed', '') if blip is not None else ''
        target = rels.get(rid, '')
        print(f"  - name: '{name}', descr: '{descr}', target: '{target}'")

    # Shapes and texts
    print("Text shapes:")
    for sp in root.iter('{http://schemas.openxmlformats.org/presentationml/2006/main}sp'):
        txBody = sp.find('{http://schemas.openxmlformats.org/presentationml/2006/main}txBody')
        if txBody is not None:
            paragraphs = []
            for p in txBody.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}p'):
                p_text = "".join([t.text for t in p.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}t') if t.text])
                if p_text.strip():
                    paragraphs.append(p_text.strip())
            if paragraphs:
                print("    * " + " | ".join(paragraphs))
