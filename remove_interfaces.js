const fs = require('fs');
let appJs = fs.readFileSync('mockup/app.js', 'utf8');

// Remove cases from switch
appJs = appJs.replace(/case 'I16':\s*app\.innerHTML = renderI16ListaRascunhosProcessos\(\);\s*break;/g, '');
appJs = appJs.replace(/case 'I17':\s*app\.innerHTML = renderI17ListaRascunhosSubProcessos\(\);\s*break;/g, '');
appJs = appJs.replace(/case 'I18':\s*app\.innerHTML = renderI18ListaRascunhosDocumentos\(\);\s*break;/g, '');

// Remove render functions
const regexI16 = /function renderI16ListaRascunhosProcessos\(\) \{[\s\S]*?return html;\n\}/;
const regexI17 = /function renderI17ListaRascunhosSubProcessos\(\) \{[\s\S]*?return html;\n\}/;
const regexI18 = /function renderI18ListaRascunhosDocumentos\(\) \{[\s\S]*?return html;\n\}/;

appJs = appJs.replace(regexI16, '');
appJs = appJs.replace(regexI17, '');
appJs = appJs.replace(regexI18, '');

fs.writeFileSync('mockup/app.js', appJs);
console.log('Removed unused interfaces');
