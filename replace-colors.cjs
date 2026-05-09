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
    .replace(/#0A192F/g, '#082F22')
    .replace(/bg-blue-600/g, 'bg-emerald-700')
    .replace(/text-blue-600/g, 'text-emerald-700')
    .replace(/border-blue-600/g, 'border-emerald-700')
    .replace(/ring-blue-500/g, 'ring-emerald-600')
    .replace(/bg-blue-50/g, 'bg-emerald-50')
    .replace(/text-blue-500/g, 'text-emerald-600')
    .replace(/bg-blue-100/g, 'bg-emerald-100')
    .replace(/bg-blue-500/g, 'bg-emerald-600');
    
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated ' + file);
  }
});
