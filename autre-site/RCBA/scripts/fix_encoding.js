const fs = require('fs');
const path = require('path');

const fixes = {
  'é': 'é',
  'è': 'è',
  'Ã\\xa0': 'à',
  'à': 'à', // regular space fallback
  'à': 'à', // actual non-breaking space
  'ê': 'ê',
  'â': 'â',
  'ô': 'ô',
  'î': 'î',
  'û': 'û',
  'ç': 'ç',
  'œ': 'œ',
  'É': 'É',
  'È': 'È',
  'À': 'À',
  'Ç': 'Ç',
  'ï': 'ï',
  'ë': 'ë',
  'ü': 'ü',
  ''': "'",
  '"': '"',
  '"': '"',
  '-': '-',
  '—': '—',
  '...': '...',
  '«': '«',
  '»': '»',
  '°': '°',
  '': ''
};

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (f.startsWith('.git') || f.startsWith('.next') || f.startsWith('node_modules')) return;
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const fixDoubleEncoding = (str) => {
  let res = str;
  // First, we can just use the mapping, but actually the mapping is incomplete.
  // We can use a regex to find sequences of  or àfollowed by another char, 
  // or "followed by a char, etc.
  
  // Actually, a very reliable way to do this without mapping is to find substrings 
  // that match the double-encoded UTF-8 pattern and decode just those substrings!
  // A double-encoded UTF-8 character in latin1 usually looks like 2 or 3 characters 
  // in the range \xC2-\xF4 followed by \x80-\xBF (which are displayed as Ã, , etc.).
  
  // Let's use the explicit mapping since it's much safer and covers 99% of French text.
  for (const [bad, good] of Object.entries(fixes)) {
    if (bad === '') continue; // Handle single  carefully later if needed
    // global replace
    res = res.split(bad).join(good);
  }
  // Remove trailing  that often appear before non-breaking spaces
  res = res.replace(/ /g, ' ');
  res = res.replace(//g, ''); // be careful, but  alone is rarely valid French text
  return res;
};

let filesFixed = 0;

['app', 'components', 'lib', 'scripts', 'styles', 'types', '.'].forEach(folder => {
  const fullPath = path.join('c:/CodeIA/projects/RCBA', folder);
  if (!fs.existsSync(fullPath)) return;
  
  if (fs.statSync(fullPath).isFile()) {
    processFile(fullPath);
  } else {
    walkDir(fullPath, processFile);
  }
});

function processFile(filePath) {
  if (!filePath.match(/\.(tsx|ts|md|css|js|json)$/)) return;
  if (filePath.includes('package-lock.json')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('Ã') || content.includes('Å') || content.includes('â€') || content.includes('')) {
    const original = content;
    content = fixDoubleEncoding(content);
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed encoding in:', filePath);
      filesFixed++;
    }
  }
}

console.log('Total files fixed:', filesFixed);
