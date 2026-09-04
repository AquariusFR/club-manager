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
      
      let modified = false;
      if (content.includes('// Security check handled by layout')) {
        content = content.replace(/\/\/ Security check handled by layout/g, "if (!session) redirect('/login');");
        modified = true;
      }
      
      if (modified) {
        if (!content.includes('import { redirect }') && !content.includes('import {redirect}')) {
          content = 'import { redirect } from "next/navigation";\n' + content;
        }
        fs.writeFileSync(fullPath, content);
        console.log('Fixed TS: ' + fullPath);
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
