import xml.etree.ElementTree as ET
import glob

# Check all slides rels and usages
media_usage = {}
for i in range(1, 6):
    tree = ET.parse(f'extracted_pptx/ppt/slides/slide{i}.xml')
    rel_tree = ET.parse(f'extracted_pptx/ppt/slides/_rels/slide{i}.xml.rels')
    rels = {r.attrib.get('Id'): r.attrib.get('Target') for r in rel_tree.getroot()}
    
    for elem in tree.iter():
        blip = elem.find('.//{http://schemas.openxmlformats.org/drawingml/2006/main}blip')
        if blip is not None:
            rid = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
            target = rels.get(rid, '')
            if target:
                fname = target.split('/')[-1]
                cNvPr = elem.find('.//{http://schemas.openxmlformats.org/presentationml/2006/main}cNvPr')
                name = cNvPr.attrib.get('name', '') if cNvPr is not None else ''
                descr = cNvPr.attrib.get('descr', '') if cNvPr is not None else ''
                if fname not in media_usage:
                    media_usage[fname] = []
                media_usage[fname].append((i, name, descr))

for k in sorted(media_usage.keys()):
    print(f"{k}:")
    for u in media_usage[k]:
        print(f"   Slide {u[0]}: name='{u[1]}', descr='{u[2]}'")
