import xml.etree.ElementTree as ET

tree = ET.parse('extracted_pptx/ppt/slides/slide4.xml')
root = tree.getroot()
print("=== DETALHES SLIDE 4 ===")
for elem in root.iter():
    if elem.tag.endswith('cNvPr'):
        name = elem.attrib.get('name', '')
        descr = elem.attrib.get('descr', '')
        title = elem.attrib.get('title', '')
        if name or descr or title:
            print(f"Shape: name='{name}' descr='{descr}' title='{title}'")

# Check slide 1 text elements in detail
tree1 = ET.parse('extracted_pptx/ppt/slides/slide1.xml')
root1 = tree1.getroot()
print("\n=== DETALHES SLIDE 1 ===")
for p in root1.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}p'):
    t = "".join([x.text for x in p.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}t') if x.text])
    if t.strip():
        print("  P:", t.strip())
