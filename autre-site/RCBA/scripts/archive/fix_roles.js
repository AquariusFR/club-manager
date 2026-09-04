const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('app', (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Fix !session.playerId redirects
  if (content.includes('!session.playerId')) {
    content = content.replace(
      /if\s*\(\!session\s*\|\|\s*\!session\.playerId\)\s*\{\s*redirect\(['"]\/login['"]\);\s*\}/g,
      "if (!session || (!session.playerId && session.roleName.toLowerCase() !== 'admin' && session.roleName !== 'Direction')) { redirect('/login'); }"
    );
  }

  // Find all if statements that contain redirect('/login') and check session
  const redirectRegex = /if\s*\(([^)]+session\.roleName[^)]+)\)\s*\{?\s*redirect\(['"]\/login[^'"]*['"]\);?/g;
  
  content = content.replace(redirectRegex, (match, condition) => {
    // If the condition already checks for admin, skip it
    if (condition.toLowerCase().includes('admin')) {
      return match;
    }
    
    // Otherwise, append ' && session.roleName.toLowerCase() !== 'admin''
    const newCondition = `((${condition}) && session.roleName.toLowerCase() !== 'admin')`;
    return match.replace(condition, newCondition);
  });
  
  // also handle one-liners without braces: if (...) redirect(...)
  const redirectRegexOneLiner = /if\s*\(([^)]+session\.roleName[^)]+)\)\s*redirect\(['"]\/login[^'"]*['"]\);?/g;
  content = content.replace(redirectRegexOneLiner, (match, condition) => {
    if (condition.toLowerCase().includes('admin')) {
      return match;
    }
    const newCondition = `((${condition}) && session.roleName.toLowerCase() !== 'admin')`;
    return match.replace(condition, newCondition);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
});
