const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      results.push(file);
    }
  });
  return results;
}

const files = walk('./components').filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replace(/hover:bg-blue-700/g, 'hover:bg-emerald-800')
    .replace(/border-blue-100/g, 'border-emerald-100')
    .replace(/border-blue-200/g, 'border-emerald-200')
    .replace(/text-blue-900/g, 'text-emerald-900')
    .replace(/ring-blue-100/g, 'ring-emerald-100')
    .replace(/text-blue-300/g, 'text-emerald-300');
    
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated ' + file);
  }
});
