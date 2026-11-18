import xml.etree.ElementTree as ET

try:
    tree = ET.parse('extracted_pptx/ppt/media/image3.svg')
    root = tree.getroot()
    print("image3.svg tag:", root.tag, "attribs:", root.attrib)
    for el in root.iter():
        if 'id' in el.attrib:
            print("  el id:", el.attrib['id'])
except Exception as e:
    print("image3 err:", e)

try:
    tree2 = ET.parse('extracted_pptx/ppt/media/image27.svg')
    root2 = tree2.getroot()
    print("image27.svg tag:", root2.tag, "attribs:", root2.attrib)
    ids = [el.attrib.get('id') for el in root2.iter() if 'id' in el.attrib]
    print("  image27 ids count:", len(ids), ids[:10])
except Exception as e:
    print("image27 err:", e)
