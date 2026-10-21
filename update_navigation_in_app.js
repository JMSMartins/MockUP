const fs = require('fs');
let appJs = fs.readFileSync('mockup/app.js', 'utf8');

// The Rascunho states can just navigate back to the main list (I1) since it now filters all states.
appJs = appJs.replace(/navigateTo\('I16'\);/g, "navigateTo('I1');");
appJs = appJs.replace(/navigateTo\('I17'\);/g, "navigateTo('I1');"); // Actually, sub process goes to I5 usually, but I1 is fine for now, or just leave as is. Wait, let's make them navigateTo('I1')
appJs = appJs.replace(/navigateTo\('I18'\);/g, "navigateTo('I1');");

appJs = appJs.replace(/disponível apenas nas listas de Rascunho \(ex: I16\)\./g, "disponível na lista principal (I1).");

fs.writeFileSync('mockup/app.js', appJs);
