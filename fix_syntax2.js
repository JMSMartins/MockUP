const fs = require('fs');

let appJs = fs.readFileSync('mockup/app.js', 'utf8');

// There are duplicate array endings
const duplicateRegex = /    \],\n            subProcessosId: \[\],\n            documentosId: \[\]\n        \}\n    \],/g;
appJs = appJs.replace(duplicateRegex, '    ],');

fs.writeFileSync('mockup/app.js', appJs);
