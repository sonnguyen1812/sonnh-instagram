// add-paths.js

const fs = require('fs');
const path = require('path');

// eslint-disable-next-line require-jsdoc
function addPathComment(dir, projectRoot) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isDirectory()) {
      addPathComment(filePath, projectRoot);
    } else if (
      file.endsWith('.js') ||
      file.endsWith('.ts') ||
      file.endsWith('.jsx') ||
      file.endsWith('.tsx') ||
      file.endsWith('.css') ||
      file.endsWith('.scss')
    ) {
      let content = fs.readFileSync(filePath, 'utf8');
      let relativePath = path.relative(projectRoot, filePath);

      // Convert Windows path to Unix style
      relativePath = relativePath.split(path.sep).join('/');

      const pathComment = `// ${relativePath}\n`;

      // Remove existing path comment if exists
      content = content.replace(/^\/\/[^\n]*\n/, '');

      // Add new path comment at the start
      content = pathComment + content;

      fs.writeFileSync(filePath, content);
    }
  });
}

// Sử dụng
const projectRoot = process.cwd();
addPathComment(projectRoot, projectRoot);
