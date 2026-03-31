const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.controller.ts')) {
      results.push(file);
    }
  });
  return results;
}

const controllers = walk(srcDir);

for (const file of controllers) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Remove import
  content = content.replace(/import\s+{\s*AuthGuard\s*}\s+from\s+[^;]+;\n?/g, '');
  
  // Remove @UseGuards(AuthGuard)
  content = content.replace(/@UseGuards\(\s*AuthGuard\s*\)\n?/g, '');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Cleaned up:', file);
  }
}
console.log('Cleanup complete.');
