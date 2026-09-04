import os

fixes = {
    'Ã©': 'é', 'Ã¨': 'è', 'Ã ': 'à', 'Ã¢': 'â', 'Ã´': 'ô', 'Ã®': 'î', 'Ã»': 'û', 'Ã§': 'ç',
    'Ã‰': 'É', 'Ãˆ': 'È', 'Ã€': 'À', 'Ã‡': 'Ç', 'Ã¯': 'ï', 'Ã«': 'ë', 'Ã¼': 'ü',
    'â€™': "'", 'â€œ': '"', 'â€\x9d': '"', 'â€“': '–', 'â€”': '—', 'Â°': '°'
}

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = content
        for k, v in fixes.items():
            new_content = new_content.replace(k, v)
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Fixed: {filepath}')
    except Exception as e:
        print(f'Error {filepath}: {e}')

for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['.git', '.next', 'node_modules']):
        continue
    for file in files:
        if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.md')):
            fix_file(os.path.join(root, file))
