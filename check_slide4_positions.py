import xml.etree.ElementTree as ET

def emu_to_px(val):
    if val is None:
        return 0
    return round(int(val) / 9525)  # 1 px = 9525 EMU at 96 DPI (or ~12700 at 72)

tree = ET.parse('extracted_pptx/ppt/slides/slide4.xml')
rel_tree = ET.parse('extracted_pptx/ppt/slides/_rels/slide4.xml.rels')
rels = {r.attrib.get('Id'): r.attrib.get('Target') for r in rel_tree.getroot()}

print("=== SLIDE 4 ELEMENTS WITH POSITIONS ===")
for elem in tree.getroot().iter():
    if elem.tag.endswith('pic') or elem.tag.endswith('sp'):
        cNvPr = elem.find('.//{http://schemas.openxmlformats.org/presentationml/2006/main}cNvPr')
        name = cNvPr.attrib.get('name', '') if cNvPr is not None else ''
        descr = cNvPr.attrib.get('descr', '') if cNvPr is not None else ''
        
        blip = elem.find('.//{http://schemas.openxmlformats.org/drawingml/2006/main}blip')
        rid = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed') if blip is not None else ''
        target = rels.get(rid, '')
        
        xfrm = elem.find('.//{http://schemas.openxmlformats.org/drawingml/2006/main}xfrm')
        off = xfrm.find('{http://schemas.openxmlformats.org/drawingml/2006/main}off') if xfrm is not None else None
        ext = xfrm.find('{http://schemas.openxmlformats.org/drawingml/2006/main}ext') if xfrm is not None else None
        
        x = off.attrib.get('x') if off is not None else 0
        y = off.attrib.get('y') if off is not None else 0
        cx = ext.attrib.get('cx') if ext is not None else 0
        cy = ext.attrib.get('cy') if ext is not None else 0
        
        t = "".join([tx.text for tx in elem.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}t') if tx.text])
        
        if name or target or t:
            print(f"[{name}] target='{target}' descr='{descr}' pos=({emu_to_px(x)}, {emu_to_px(y)}, w={emu_to_px(cx)}, h={emu_to_px(cy)}) text='{t.strip()}'")
