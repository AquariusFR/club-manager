const fs = require('fs');
const path = require('path');

const dirs = ['C:/CodeIA/projects/RCBA/app', 'C:/CodeIA/projects/RCBA/components'];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content.replace(/\btext-(xs|\[(\d+)px\])\b/g, (match, p1, p2) => {
        if (p1 === 'xs') return 'text-sm';
        const size = parseInt(p2, 10);
        if (size <= 7) return 'text-xs';
        if (size === 8) return 'text-xs';
        if (size === 9) return 'text-sm';
        if (size === 10) return 'text-sm';
        if (size === 11) return 'text-base';
        if (size === 12) return 'text-base';
        return match; // fallback
      });
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

for (const dir of dirs) {
  processDirectory(dir);
}
