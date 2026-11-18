# Script to inspect text runs, formatting, colors and layouts of all 5 slides
import xml.etree.ElementTree as ET

for slide_num in range(1, 6):
    tree = ET.parse(f'extracted_pptx/ppt/slides/slide{slide_num}.xml')
    root = tree.getroot()
    print(f"\n============================== SLIDE {slide_num} ==============================")
    for sp in root.iter('{http://schemas.openxmlformats.org/presentationml/2006/main}sp'):
        cNvPr = sp.find('.//{http://schemas.openxmlformats.org/presentationml/2006/main}cNvPr')
        name = cNvPr.attrib.get('name', '') if cNvPr is not None else ''
        txBody = sp.find('{http://schemas.openxmlformats.org/presentationml/2006/main}txBody')
        if txBody is not None:
            for p in txBody.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}p'):
                runs = []
                for r in p.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}r'):
                    t = r.find('{http://schemas.openxmlformats.org/drawingml/2006/main}t')
                    rPr = r.find('{http://schemas.openxmlformats.org/drawingml/2006/main}rPr')
                    color = None
                    bold = False
                    sz = None
                    if rPr is not None:
                        bold = rPr.attrib.get('b') == '1'
                        sz = rPr.attrib.get('sz')
                        clr = rPr.find('.//{http://schemas.openxmlformats.org/drawingml/2006/main}srgbClr')
                        if clr is not None:
                            color = clr.attrib.get('val')
                    if t is not None and t.text:
                        runs.append(f"[{t.text}] (c={color}, b={bold}, sz={sz})")
                if runs:
                    print(f"[{name}] " + " + ".join(runs))
