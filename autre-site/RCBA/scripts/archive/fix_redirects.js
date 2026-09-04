const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('c:/CodeIA/projects/RCBA/app');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Pattern for: if (!session || ... !== 'Role' ...) { redirect('/login'); }
  const regex = /if\s*\(\s*!session\s*\|\|([^)]+)\)\s*\{\s*redirect\(['"`]\/login.*?['"`]\);\s*\}/gs;
  
  content = content.replace(regex, (match, condition) => {
    if (condition.includes("session.roleName.toLowerCase() !== 'admin'")) {
        return match; // already handled
    }
    // We want to add the admin check to the end of the condition
    // For example: condition is `session.roleName !== 'Joueur'`
    // We want to change it to `session.roleName !== 'Joueur' && session.roleName.toLowerCase() !== 'admin'`
    // Wait, some conditions are already complex. 
    // An easier way is to just replace the whole if statement logic.
    // If the role is admin, bypass this redirect.
    return match.replace(/if\s*\(/, "if (session?.roleName?.toLowerCase() !== 'admin' && ");
  });

  // Also catch one-liner if statements
  const regex2 = /if\s*\(\s*!session\s*\|\|([^)]+)\)\s*redirect\(['"`]\/login.*?['"`]\);/gs;
  content = content.replace(regex2, (match, condition) => {
    if (condition.includes("session.roleName.toLowerCase() !== 'admin'") || match.includes("session?.roleName?.toLowerCase() !== 'admin'")) {
        return match;
    }
    return match.replace(/if\s*\(/, "if (session?.roleName?.toLowerCase() !== 'admin' && ");
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Patched:', file);
  }
});
console.log('Done.');
