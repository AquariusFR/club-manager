import os
import glob

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content.replace('lib/auth', 'lib/authentication')
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

for root, _, files in os.walk('.'):
    if 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            replace_in_file(os.path.join(root, file))
