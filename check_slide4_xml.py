# Check text or labels in images if possible, or print their properties
import os

# Let's inspect slide 4's full text and shapes, as well as the exact shapes in slide 4 XML
import xml.etree.ElementTree as ET

tree = ET.parse('extracted_pptx/ppt/slides/slide4.xml')
for node in tree.iter():
    if node.text and node.text.strip():
        print(f"Node text: {node.text.strip()}")
