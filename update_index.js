const fs = require('fs');

let html = fs.readFileSync('mockup/index.html', 'utf8');

// Replace body class for sidebar layout
html = html.replace('body class="bg-gray-100 text-gray-800 p-8 flex flex-col items-center"', 'body class="bg-gray-100 text-gray-800 flex h-screen"');

// Replace nav with sidebar
const oldNav = `<nav class="w-full max-w-6xl mb-6 bg-white p-4 rounded shadow flex justify-between items-center">
        <div class="font-bold text-xl text-blue-900">Portal Qualidade Mockup</div>
        <div class="space-x-4">
            <button class="text-blue-600 font-semibold" onclick="navigateTo('I1')">Processos Ativos</button>
            <button class="text-blue-600 font-semibold" onclick="navigateTo('I5')">Sub Processos Ativos</button>
            <button class="text-blue-600 font-semibold" onclick="navigateTo('I9')">Documentos Ativos</button>
            <span class="text-gray-400">|</span>
            <button class="text-orange-600 font-semibold" onclick="navigateTo('I16')">Rascunhos (Proc)</button>
            <button class="text-orange-600 font-semibold" onclick="navigateTo('I17')">Rascunhos (Sub)</button>
            <button class="text-orange-600 font-semibold" onclick="navigateTo('I18')">Rascunhos (Doc)</button>
        </div>
    </nav>`;

const newNav = `<nav class="w-64 bg-white shadow-md flex flex-col p-4 space-y-4 flex-shrink-0 overflow-y-auto">
        <div class="font-bold text-xl text-blue-900 mb-4 border-b pb-2">Portal Qualidade Mockup</div>
        <button class="text-left text-blue-600 font-semibold hover:bg-gray-100 p-2 rounded transition" onclick="navigateTo('I1')">Processos</button>
        <button class="text-left text-blue-600 font-semibold hover:bg-gray-100 p-2 rounded transition" onclick="navigateTo('I5')">Sub Processos</button>
        <button class="text-left text-blue-600 font-semibold hover:bg-gray-100 p-2 rounded transition" onclick="navigateTo('I9')">Documentos</button>
    </nav>`;

html = html.replace(oldNav, newNav);

// Update main container to fill remaining space
html = html.replace('<div class="max-w-6xl w-full mx-auto bg-white p-6 rounded shadow" id="app">', '<div class="flex-grow p-8 overflow-y-auto">\n        <div class="max-w-6xl w-full mx-auto bg-white p-6 rounded shadow min-h-[500px]" id="app">');
html = html.replace('<!-- Render target for app.js -->\n    </div>', '<!-- Render target for app.js -->\n        </div>\n    </div>');

fs.writeFileSync('mockup/index.html', html);
console.log('Updated mockup/index.html');
