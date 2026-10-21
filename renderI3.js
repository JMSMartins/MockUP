const fs = require('fs');
let appJs = fs.readFileSync('mockup/app.js', 'utf8');

const oldRenderI3 = /function renderI3DetalheProcessoAtivo\(\) \{[\s\S]*?return html;\n\}/;

const newRenderI3 = `
function renderI3DetalheProcessoAtivo() {
    const p = getItemById(currentState.contextId);
    if(!p) return \`Processo não encontrado. <button onclick="navigateTo('I1')">Voltar</button>\`;

    let html = \`<div class="mb-4 flex justify-between items-center">
                    <h1 class="text-3xl font-bold">[I3] Detalhe de Processo (\${p.status})</h1>
                    <div class="space-x-2">
                        <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I6', '\${p.id}')">Adicionar sub processo</button>
                        <button class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I10', '\${p.id}')">Adicionar documentos</button>
                        <button class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I4', '\${p.id}')">Editar</button>
                        <button class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow" onclick="desativarProcesso('\${p.id}')">Desativar</button>
                        <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow" onclick="eliminarProcesso('\${p.id}')">Eliminar</button>
                    </div>
                </div>\`;

    html += \`
        <div class="grid grid-cols-2 gap-4 mb-6 bg-white p-4 border rounded">
            <div><strong>Label de Registo:</strong> \${p.labelRegisto || ''}</div>
            <div><strong>Código:</strong> \${p.codigo || ''}</div>
            <div><strong>Nome:</strong> \${p.nome || ''}</div>
            <div><strong>Objetivo:</strong> \${p.objetivo || ''}</div>
            <div><strong>Âmbito:</strong> \${p.ambito || ''}</div>
            <div><strong>Data de Elaboração:</strong> \${p.dataElaboracao || ''}</div>
            <div><strong>Donos do Processo:</strong> \${p.donos || ''}</div>
            <div><strong>Versão:</strong> \${p.versao || ''}</div>
            <div><strong>Data de revisão da versão:</strong> \${p.dataRevisao || ''}</div>
            <div><strong>Estado:</strong> <span class="px-2 py-1 rounded \${p.status === 'Publicado' ? 'bg-green-100 text-green-800' : (p.status === 'Rascunho' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800')}">\${p.status}</span></div>
            <div><strong>Riscos Relevantes:</strong> \${p.riscosRelevantes || ''}</div>
            <div><strong>Oportunidades:</strong> \${p.oportunidades || ''}</div>
            <div><strong>Entradas:</strong> \${p.entradas || ''}</div>
            <div><strong>Saídas:</strong> \${p.saidas || ''}</div>
            <div><strong>Indicadores de Sucesso:</strong> \${p.indicadoresSucesso || ''}</div>
            <div><strong>Partes Interessadas Externas:</strong> \${p.partesInteressadasExternas || ''}</div>
            <div><strong>Partes Interessadas Internas:</strong> \${p.partesInteressadasInternas || ''}</div>
            <div><strong>Referenciais:</strong> \${p.referenciais || ''}</div>
        </div>
    \`;

    html += \`<h2 class="text-xl font-bold mt-8 mb-2">Tabela com a lista de sub processos</h2>\`;
    html += \`<table class="min-w-full bg-white border mb-6"><thead class="bg-gray-200"><tr><th class="border px-4 py-2">Sub Processo</th><th class="border px-4 py-2">Versão</th><th class="border px-4 py-2">Data Elaboração</th><th class="border px-4 py-2">Ação</th></tr></thead><tbody>\`;
    p.subProcessosId.forEach(spId => {
        const sp = getItemById(spId);
        if(sp && sp.status === 'Publicado') html += \`<tr><td class="border px-4 py-2">\${sp.codigo} - \${sp.nome}</td><td class="border px-4 py-2">\${sp.versao}</td><td class="border px-4 py-2">\${sp.dataElaboracao}</td><td class="border px-4 py-2"><button class="bg-blue-600 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I7', '\${sp.id}')">Detalhe</button><button class="bg-yellow-500 text-white px-3 py-1 rounded" onclick="navigateTo('I8', '\${sp.id}')">Editar</button></td></tr>\`;
    });
    html += \`</tbody></table>\`;

    html += \`<h2 class="text-xl font-bold mt-8 mb-2">Tabela com a lista de documentos</h2>\`;
    html += \`<table class="min-w-full bg-white border mb-6"><thead class="bg-gray-200"><tr><th class="border px-4 py-2">Documento</th><th class="border px-4 py-2">Versão</th><th class="border px-4 py-2">Data Elaboração</th><th class="border px-4 py-2">Tipo</th><th class="border px-4 py-2">Ação</th></tr></thead><tbody>\`;
    p.documentosId.forEach(docId => {
        const doc = getItemById(docId);
        if(doc && doc.status === 'Publicado') html += \`<tr><td class="border px-4 py-2">\${doc.codigo} - \${doc.designacao}</td><td class="border px-4 py-2">\${doc.versao}</td><td class="border px-4 py-2">\${doc.dataElaboracao}</td><td class="border px-4 py-2">\${doc.tipo}</td><td class="border px-4 py-2"><button class="bg-blue-600 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I11', '\${doc.id}')">Detalhe</button><button class="bg-yellow-500 text-white px-3 py-1 rounded" onclick="navigateTo('I12', '\${doc.id}')">Editar</button></td></tr>\`;
    });
    html += \`</tbody></table>\`;

    // History Table
    const historico = mockData.processos.filter(x => x.codigo === p.codigo && x.id !== p.id).sort((a,b) => new Date(b.dataRevisao) - new Date(a.dataRevisao));
    html += \`<h2 class="text-xl font-bold mt-8 mb-2">Tabela de Histórico de Versões</h2>\`;
    if(historico.length > 0) {
        html += \`<table class="min-w-full bg-white border">
                    <thead class="bg-gray-200">
                        <tr><th class="border px-4 py-2">Código</th><th class="border px-4 py-2">Nome</th><th class="border px-4 py-2">Versão</th><th class="border px-4 py-2">Data Edição</th><th class="border px-4 py-2">Estado</th><th class="border px-4 py-2">Ação</th></tr>
                    </thead>
                    <tbody>\`;
        historico.forEach(h => {
            html += \`<tr class="historical-row">
                        <td class="border px-4 py-2">\${h.codigo}</td>
                        <td class="border px-4 py-2">\${h.nome}</td>
                        <td class="border px-4 py-2">\${h.versao}</td>
                        <td class="border px-4 py-2">\${h.dataRevisao}</td>
                        <td class="border px-4 py-2">\${h.status}</td>
                        <td class="border px-4 py-2 flex flex-wrap gap-2">
                            <button class="bg-gray-500 text-white px-3 py-1 rounded" onclick="navigateTo('I13', '\${h.id}')">Detalhe Histórico</button>
                            <button class="bg-yellow-500 text-white px-3 py-1 rounded" onclick="navigateTo('I4', '\${h.id}')">Edição</button>
                            \${h.status === 'Rascunho' ? \`<button class="bg-green-600 text-white px-3 py-1 rounded" onclick="guardarProcessoI4('\${h.id}', 'Publicado')">Publicar</button>\` : ''}
                        </td>
                     </tr>\`;
        });
        html += \`</tbody></table>\`;
    } else {
        html += \`<p class="text-gray-500">Nenhum histórico disponível.</p>\`;
    }

    html += \`<br><button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I1')">Voltar</button>\`;
    return html;
}
`;

appJs = appJs.replace(oldRenderI3, newRenderI3);

fs.writeFileSync('mockup/app.js', appJs);
console.log('Updated I3 in mockup/app.js');
