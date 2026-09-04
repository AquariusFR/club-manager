const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') && !fullPath.endsWith('layout.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const regex = /if\s*\(\s*!session[^\{]*\{\s*redirect\([^)]+\);\s*\}/g;
      
      if (regex.test(content)) {
        content = content.replace(regex, '// Security check handled by layout');
        
        // Let's also remove import { redirect } if it's not used elsewhere
        if (!content.includes('redirect(')) {
          content = content.replace(/import\s*\{\s*redirect\s*\}\s*from\s*['"]next\/navigation['"];?\n?/, '');
        }
        
        fs.writeFileSync(fullPath, content);
        console.log('Modified: ' + fullPath);
      }
    }
  }
}

try {
  processDir('c:/CodeIA/projects/RCBA/app/coach');
  processDir('c:/CodeIA/projects/RCBA/app/joueur');
} catch(e) {
  console.error(e);
}
