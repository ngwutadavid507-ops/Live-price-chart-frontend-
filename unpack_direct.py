import os
import re
from pypdf import PdfReader

# Search common Android download paths for your PDF
possible_paths = [
    os.path.expanduser("~/storage/downloads/Phoenix Frontend Codebase.pdf"),
    "/storage/emulated/0/Download/Phoenix Frontend Codebase.pdf",
    "/sdcard/Download/Phoenix Frontend Codebase.pdf"
]

pdf_path = None
for path in possible_paths:
    if os.path.exists(path):
        pdf_path = path
        break

if not pdf_path:
    print("❌ Error: Could not find 'Phoenix Frontend Codebase.pdf' in your phone's Downloads folder.")
    print("Please make sure the PDF file is named exactly that and sits in your main Downloads.")
    exit(1)

print(f"🔍 Found PDF at: {pdf_path}")
print("🔄 Reading PDF layout...")

reader = PdfReader(pdf_path)
full_text = ""
for page in reader.pages:
    text = page.extract_text()
    if text:
        full_text += text + "\n"

matches = list(re.finditer(r'File:\s*([a-zA-Z0-9_\-\.\/]+)', full_text))

if not matches:
    print("❌ Error: Could not parse file structures from the PDF format.")
    exit(1)

print(f"📂 Found {len(matches)} files. Unpacking directly into current folder...")

for i in range(len(matches)):
    current_match = matches[i]
    file_path = current_match.group(1).strip()
    
    start_idx = current_match.end()
    end_idx = matches[i+1].start() if i + 1 < len(matches) else len(full_text)
    
    content = full_text[start_idx:end_idx]
    content = re.sub(r"--- PAGE \d+ ---", "", content)
    content = content.strip()
    
    # Create the folders right here locally
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"   ✅ Created: {file_path}")

print("\n🎉 Success! All folders and files have been generated right here!")
