# Check what is in slide_4.png and what logos are there
import xml.etree.ElementTree as ET
import os

print("=== SLIDE 4 SHAPES & IMAGES ===")
tree = ET.parse('extracted_pptx/ppt/slides/slide4.xml')
root = tree.getroot()
rel_tree = ET.parse('extracted_pptx/ppt/slides/_rels/slide4.xml.rels')
rels = {rel.attrib.get('Id'): rel.attrib.get('Target') for rel in rel_tree.getroot()}

for elem in root.iter('{http://schemas.openxmlformats.org/presentationml/2006/main}pic'):
    cNvPr = elem.find('.//{http://schemas.openxmlformats.org/presentationml/2006/main}cNvPr')
    name = cNvPr.attrib.get('name') if cNvPr is not None else ''
    descr = cNvPr.attrib.get('descr') if cNvPr is not None else ''
    blip = elem.find('.//{http://schemas.openxmlformats.org/drawingml/2006/main}blip')
    rid = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed') if blip is not None else ''
    target = rels.get(rid, '')
    print(f"Pic: name='{name}', descr='{descr}', file='{target}'")

