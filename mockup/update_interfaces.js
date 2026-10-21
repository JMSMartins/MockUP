const fs = require('fs');
let appJs = fs.readFileSync('mockup/app.js', 'utf8');

const splitRegex = /function renderI3DetalheProcessoAtivo\(\) \{/;
const parts = appJs.split(splitRegex);

if (parts.length !== 2) {
    console.error("Could not find renderI3DetalheProcessoAtivo");
    process.exit(1);
}

const beforeI3 = parts[0];

const endString = `
// Initial render
window.onload = render;`;

const newCode = `function renderI3DetalheProcessoAtivo() {
    const p = getItemById(currentState.contextId) || {};
    let html = \`
    <div class="mb-4 flex justify-between items-center">
        <h1 class="text-3xl font-bold">[I3] Interface 3 – Detalhe</h1>
        <div>
            <button class="bg-blue-600 text-white px-4 py-2 rounded shadow mr-2" onclick="navigateTo('I4', '\${p.id}')">Edição</button>
            <button class="bg-orange-500 text-white px-4 py-2 rounded shadow mr-2" onclick="alert('Desativar')">Desativar</button>
            <button class="bg-red-500 text-white px-4 py-2 rounded shadow mr-2" onclick="alert('Eliminar')">Eliminar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I1')">Voltar</button>
        </div>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-6">
        <div><strong>[I3.UPL01] Upload Logo:</strong> <input type="file" disabled></div>
        <div><strong>[I3.UPL02] Upload Banner:</strong> <input type="file" disabled></div>
        <div><strong>[I3.TXT01] Label de Registo:</strong> \${p.labelRegisto || ''}</div>
        <div><strong>[I3.TXT02] Código:</strong> \${p.codigo || ''}</div>
        <div><strong>[I3.TXT03] Nome:</strong> \${p.nome || ''}</div>
        <div><strong>[I3.TXT04] Objetivo:</strong> \${p.objetivo || ''}</div>
        <div><strong>[I3.TXT05] Âmbito:</strong> \${p.ambito || ''}</div>
        <div><strong>[I3.DT01] Data de Elaboração:</strong> \${p.dataElaboracao || ''}</div>
        <div><strong>[I3.TXT06] Donos do Processo:</strong> \${p.donos ? p.donos.map(d=>d.nome).join(', ') : ''}</div>
        <div><strong>[I3.TXT07] Versão:</strong> \${p.versao || ''}</div>
        <div><strong>[I3.DT02] Data de revisão da versão:</strong> \${p.dataRevisao || ''}</div>
        <div><strong>[I3.TXT08] Estado:</strong> \${p.status || ''}</div>
        <div><strong>[I2.TXT09] Riscos Relevantes:</strong> \${p.riscos || ''}</div>
        <div><strong>[I2.TXT10] Oportunidades:</strong> \${p.oportunidades || ''}</div>
        <div><strong>[I2.TXT11] Entradas:</strong> \${p.entradas || ''}</div>
        <div><strong>[I2.TXT12] Saídas:</strong> \${p.saidas || ''}</div>
        <div><strong>[I2.TXT13] Indicadores de Sucesso:</strong> \${p.indicadoresSucesso || ''}</div>
        <div><strong>[I2.TXT14] Partes Interessadas Externas:</strong> \${p.partesInteressadasExternas || ''}</div>
        <div><strong>[I2.TXT15] Partes Interessadas Internas:</strong> \${p.partesInteressadasInternas || ''}</div>
        <div><strong>[I2.TXT16] Referenciais:</strong> \${p.referenciais || ''}</div>
    </div>

    <div class="mb-4">
        <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="navigateTo('I6', '\${p.id}')">Adicionar sub processo</button>
    </div>
    <h2 class="text-xl font-bold mt-4 mb-2">[I3.TB02] Tabela com a lista de sub processos</h2>
    <table class="min-w-full bg-white border mb-6">
        <thead class="bg-gray-200">
            <tr>
                <th class="border px-4 py-2">Código do sub processo</th>
                <th class="border px-4 py-2">Nome</th>
                <th class="border px-4 py-2">Versão</th>
                <th class="border px-4 py-2">Data de elaboração</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>\`;
    if(p.subProcessosId) {
        p.subProcessosId.forEach(spId => {
            const sp = getItemById(spId);
            if(sp && sp.status === 'Publicado') {
                html += \`<tr>
                    <td class="border px-4 py-2">\${sp.codigo}</td>
                    <td class="border px-4 py-2">\${sp.nome}</td>
                    <td class="border px-4 py-2">\${sp.versao}</td>
                    <td class="border px-4 py-2">\${sp.dataElaboracao}</td>
                    <td class="border px-4 py-2">
                        <button class="bg-blue-600 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I7', '\${sp.id}')">Detalhe</button>
                        <button class="bg-yellow-500 text-white px-3 py-1 rounded" onclick="navigateTo('I8', '\${sp.id}')">Editar</button>
                    </td>
                </tr>\`;
            }
        });
    }
    html += \`
        </tbody>
    </table>

    <div class="mb-4">
        <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="navigateTo('I10', '\${p.id}')">Adicionar documentos</button>
    </div>
    <h2 class="text-xl font-bold mt-4 mb-2">[I3.TB03] Tabela com a lista de documentos</h2>
    <table class="min-w-full bg-white border mb-6">
        <thead class="bg-gray-200">
            <tr>
                <th class="border px-4 py-2">Código do documento</th>
                <th class="border px-4 py-2">Designação</th>
                <th class="border px-4 py-2">Versão</th>
                <th class="border px-4 py-2">Data de elaboração</th>
                <th class="border px-4 py-2">Tipo</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>\`;
    if(p.documentosId) {
        p.documentosId.forEach(docId => {
            const doc = getItemById(docId);
            if(doc && doc.status === 'Publicado') {
                html += \`<tr>
                    <td class="border px-4 py-2">\${doc.codigo}</td>
                    <td class="border px-4 py-2">\${doc.designacao}</td>
                    <td class="border px-4 py-2">\${doc.versao}</td>
                    <td class="border px-4 py-2">\${doc.dataElaboracao}</td>
                    <td class="border px-4 py-2">\${doc.tipo || ''}</td>
                    <td class="border px-4 py-2">
                        <button class="bg-blue-600 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I11', '\${doc.id}')">Detalhe</button>
                        <button class="bg-yellow-500 text-white px-3 py-1 rounded" onclick="navigateTo('I10', '\${doc.id}')">Editar</button>
                    </td>
                </tr>\`;
            }
        });
    }
    html += \`
        </tbody>
    </table>

    <h2 class="text-xl font-bold mt-4 mb-2">[I3.TB04] Tabela de Histórico de Versões</h2>
    <table class="min-w-full bg-white border mb-6">
        <thead class="bg-gray-200">
            <tr>
                <th class="border px-4 py-2">Código do processo</th>
                <th class="border px-4 py-2">Nome</th>
                <th class="border px-4 py-2">Versão</th>
                <th class="border px-4 py-2">Data de revisão da versão</th>
                <th class="border px-4 py-2">Estado</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>\`;

    // Historico order by dataRevisao desc
    const historico = mockData.processos
        .filter(x => x.codigo === p.codigo && x.id !== p.id)
        .sort((a,b) => new Date(b.dataRevisao) - new Date(a.dataRevisao));

    historico.forEach(h => {
        html += \`<tr>
            <td class="border px-4 py-2">\${h.codigo}</td>
            <td class="border px-4 py-2">\${h.nome}</td>
            <td class="border px-4 py-2">\${h.versao}</td>
            <td class="border px-4 py-2">\${h.dataRevisao}</td>
            <td class="border px-4 py-2">\${h.status}</td>
            <td class="border px-4 py-2">
                <button class="bg-gray-600 text-white px-3 py-1 rounded mr-1" onclick="navigateTo('I12', '\${h.id}')">Detalhe Histórico</button>
                <button class="bg-yellow-500 text-white px-3 py-1 rounded mr-1" onclick="navigateTo('I4', '\${h.id}')">Edição</button>
                <button class="bg-green-600 text-white px-3 py-1 rounded" onclick="alert('Publicar')">Publicar</button>
            </td>
        </tr>\`;
    });

    html += \`
        </tbody>
    </table>
    \`;
    return html;
}

function renderI4RevisaoProcesso() {
    const p = getItemById(currentState.contextId) || {};
    let html = \`<h1 class="text-3xl font-bold mb-4">[I4] Interface 4 – Edição</h1>
    <div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">[I4.UPL01] Upload Logo</label><input type="file" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I4.UPL02] Upload Banner</label><input type="file" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I4.TXT01] Label de Registo</label><input type="text" class="border p-2 w-full" value="\${p.labelRegisto || ''}"></div>
            <div><label class="block font-bold">[I4.TXT02] Código</label><input type="text" class="border p-2 w-full" value="\${p.codigo || ''}"></div>
            <div><label class="block font-bold">[I4.TXT03] Nome</label><input type="text" class="border p-2 w-full" value="\${p.nome || ''}"></div>
            <div><label class="block font-bold">[I4.TXT04] Objetivo</label><input type="text" class="border p-2 w-full" value="\${p.objetivo || ''}"></div>
            <div><label class="block font-bold">[I4.TXT05] Âmbito</label><input type="text" class="border p-2 w-full" value="\${p.ambito || ''}"></div>
            <div><label class="block font-bold">[I4.DT01] Data de Elaboração</label><input type="date" class="border p-2 w-full" value="\${p.dataElaboracao || ''}"></div>
            <div><label class="block font-bold">[I4.TXT06] Donos do Processo</label><input type="text" class="border p-2 w-full" value="\${p.donos ? p.donos.map(d=>d.nome).join(', ') : ''}"></div>
            <div><label class="block font-bold">[I4.TXT07] Versão</label><input type="text" class="border p-2 w-full" value="\${p.versao || ''}"></div>
            <div><label class="block font-bold">[I4.DT02] Data de revisão da versão</label><input type="date" class="border p-2 w-full" value="\${p.dataRevisao || ''}"></div>
            <div><label class="block font-bold">[I4.TXT08] Riscos Relevantes</label><input type="text" class="border p-2 w-full" value="\${p.riscos || ''}"></div>
            <div><label class="block font-bold">[I2.TXT09] Oportunidades</label><input type="text" class="border p-2 w-full" value="\${p.oportunidades || ''}"></div>
            <div><label class="block font-bold">[I4.TXT10] Entradas</label><input type="text" class="border p-2 w-full" value="\${p.entradas || ''}"></div>
            <div><label class="block font-bold">[I4.TXT11] Saídas</label><input type="text" class="border p-2 w-full" value="\${p.saidas || ''}"></div>
            <div><label class="block font-bold">[I4.TXT12] Indicadores de Sucesso</label><input type="text" class="border p-2 w-full" value="\${p.indicadoresSucesso || ''}"></div>
            <div><label class="block font-bold">[I4.TXT13] Partes Interessadas Externas</label><input type="text" class="border p-2 w-full" value="\${p.partesInteressadasExternas || ''}"></div>
            <div><label class="block font-bold">[I4.TXT14] Partes Interessadas Internas</label><input type="text" class="border p-2 w-full" value="\${p.partesInteressadasInternas || ''}"></div>
            <div><label class="block font-bold">[I4.TXT15] Referenciais</label><input type="text" class="border p-2 w-full" value="\${p.referenciais || ''}"></div>
        </div>

        <div class="mb-4">
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="navigateTo('I6', '\${p.id}')">Adicionar sub processos</button>
        </div>
        <h2 class="font-bold text-lg mb-2">[I4.TB02] Tabela com a lista de sub processos</h2>
        <table class="w-full border text-left mb-6"><thead class="bg-gray-100"><tr>
            <th class="p-2 border">Código do sub processo</th>
            <th class="p-2 border">Nome</th>
            <th class="p-2 border">Versão</th>
            <th class="p-2 border">Data de elaboração</th>
            <th class="p-2 border">Ações</th>
        </tr></thead><tbody>\`;
        if(p.subProcessosId) {
            p.subProcessosId.forEach(spId => {
                const sp = getItemById(spId);
                if(sp && sp.status === 'Publicado') {
                    html += \`<tr>
                        <td class="p-2 border">\${sp.codigo}</td>
                        <td class="p-2 border">\${sp.nome}</td>
                        <td class="p-2 border">\${sp.versao}</td>
                        <td class="p-2 border">\${sp.dataElaboracao}</td>
                        <td class="p-2 border">
                            <button class="bg-blue-500 text-white px-2 py-1 rounded mr-1" onclick="navigateTo('I7', '\${sp.id}')">Detalhe</button>
                            <button class="bg-yellow-500 text-white px-2 py-1 rounded mr-1" onclick="navigateTo('I8', '\${sp.id}')">Editar</button>
                            <button class="bg-orange-500 text-white px-2 py-1 rounded mr-1" onclick="alert('Desativar')">Desativar</button>
                            <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="alert('Eliminar')">Eliminar</button>
                        </td>
                    </tr>\`;
                }
            });
        }
        html += \`</tbody></table>

        <div class="mb-4">
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="navigateTo('I10', '\${p.id}')">Adicionar documentos</button>
        </div>
        <h2 class="font-bold text-lg mb-2">[I4.TB03] Tabela com a lista de documentos</h2>
        <table class="w-full border text-left mb-6"><thead class="bg-gray-100"><tr>
            <th class="p-2 border">Código do documento</th>
            <th class="p-2 border">Designação</th>
            <th class="p-2 border">Versão</th>
            <th class="p-2 border">Data de elaboração</th>
            <th class="p-2 border">Tipo</th>
            <th class="p-2 border">Ações</th>
        </tr></thead><tbody>\`;
        if(p.documentosId) {
            p.documentosId.forEach(docId => {
                const doc = getItemById(docId);
                if(doc && doc.status === 'Publicado') {
                    html += \`<tr>
                        <td class="p-2 border">\${doc.codigo}</td>
                        <td class="p-2 border">\${doc.designacao}</td>
                        <td class="p-2 border">\${doc.versao}</td>
                        <td class="p-2 border">\${doc.dataElaboracao}</td>
                        <td class="p-2 border">\${doc.tipo || ''}</td>
                        <td class="p-2 border">
                            <button class="bg-blue-500 text-white px-2 py-1 rounded mr-1" onclick="navigateTo('I11', '\${doc.id}')">Detalhe</button>
                            <button class="bg-yellow-500 text-white px-2 py-1 rounded mr-1" onclick="navigateTo('I10', '\${doc.id}')">Editar</button>
                            <button class="bg-orange-500 text-white px-2 py-1 rounded mr-1" onclick="alert('Desativar')">Desativar</button>
                            <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="alert('Eliminar')">Eliminar</button>
                        </td>
                    </tr>\`;
                }
            });
        }
        html += \`</tbody></table>

        <div class="flex gap-2 mt-6">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="alert('Guardar como Rascunho')">Guardar como Rascunho</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="alert('Guardar e Publicar')">Guardar e Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I3', '\${p.id}')">Voltar</button>
        </div>
    </div>\`;
    return html;
}

function renderI5ListaSubProcessos() {
    let html = \`
    <div class="flex justify-between items-center mb-4">
        <h1 class="text-3xl font-bold">[I5] Interface 5 – Lista de Sub processos</h1>
        <button class="bg-green-600 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I6')">Adicionar Sub processo</button>
    </div>
    <div class="mb-4 flex gap-2 items-end">
        <div>
            <label class="block text-sm font-bold mb-1">[I5.LB01] Código Processo Pai</label>
            <select class="border p-2 rounded">
                <option value="">Todos</option>
                <option value="PROC-001">PROC-001</option>
            </select>
        </div>
        <div class="flex-grow">
            <label class="block text-sm font-bold mb-1">[I5.TXT01] Input Pesquisa</label>
            <input type="text" placeholder="Pesquisar..." class="border p-2 rounded w-full">
        </div>
        <button class="bg-blue-600 text-white px-4 py-2 rounded h-10">[I5.BT01] Pesquisar</button>
    </div>
    <div class="mb-4">
        <label class="block text-sm font-bold mb-1">[I2.CHK01] Filtro de Estado</label>
        <div class="flex gap-4">
            <label><input type="checkbox" value="Publicado"> Publicado</label>
            <label><input type="checkbox" value="Rascunho"> Rascunho</label>
            <label><input type="checkbox" value="Inativo"> Inativo</label>
        </div>
    </div>

    <h2 class="text-xl font-bold mt-4 mb-2">[I5.TB01] Tabela com a lista de sub processos</h2>
    <table class="min-w-full bg-white border mb-6">
        <thead class="bg-gray-200">
            <tr>
                <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Código do processo Pai</th>
                <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Código do sub processo</th>
                <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Nome</th>
                <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Versão</th>
                <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Data de elaboração</th>
                <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Label de Registo + ID de registo</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>\`;

    mockData.subProcessos.forEach(sp => {
        const idRegisto = sp.id;
        const label = sp.labelRegisto ? sp.labelRegisto + ' - ' : '';
        html += \`<tr>
            <td class="border px-4 py-2">\${sp.processoPaiId}</td>
            <td class="border px-4 py-2">\${sp.codigo}</td>
            <td class="border px-4 py-2">\${sp.nome}</td>
            <td class="border px-4 py-2">\${sp.versao}</td>
            <td class="border px-4 py-2">\${sp.dataElaboracao}</td>
            <td class="border px-4 py-2">\${label}\${idRegisto}</td>
            <td class="border px-4 py-2">
                <button class="bg-blue-500 text-white px-2 py-1 rounded mr-1" onclick="navigateTo('I7', '\${sp.id}')">Detalhe</button>
                <button class="bg-yellow-500 text-white px-2 py-1 rounded mr-1" onclick="navigateTo('I8', '\${sp.id}')">Edição</button>
                <button class="bg-gray-500 text-white px-2 py-1 rounded mr-1" onclick="navigateTo('I9', '\${sp.id}')">Documentos</button>
                <button class="bg-orange-500 text-white px-2 py-1 rounded mr-1" onclick="alert('Desativar')">Desativar</button>
                <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="alert('Eliminar')">Eliminar</button>
            </td>
        </tr>\`;
    });

    html += \`</tbody></table><br><button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I1')">Voltar</button>\`;
    return html;
}

function renderI6CriacaoSubProcesso() {
    let html = \`<h1 class="text-3xl font-bold mb-4">[I6] Interface 6 – Criação de Sub processo</h1>
    <div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">[I6.LB01] Processo Pai</label>
                <select class="border p-2 w-full">
                    <option value="">Selecione...</option>
                    <option value="PROC-001">PROC-001</option>
                </select>
            </div>
            <div><label class="block font-bold">[I6.UPL01] Upload Logo</label><input type="file" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.UPL02] Upload Banner</label><input type="file" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.TXT01] Label de Registo</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.TXT02] Código</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.TXT03] Nome</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.TXT04] Objetivo</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.TXT05] Âmbito</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.DT01] Data de Elaboração</label><input type="date" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.TXT06] Donos do Sub Processo</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.TXT07] Versão</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.DT02] Data de revisão da versão</label><input type="date" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.TXT08] Riscos Relevantes</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.TXT09] Oportunidades</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.TXT10] Entradas</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.TXT11] Saídas</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.TXT12] Indicadores de Sucesso</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.TXT13] Partes Interessadas Externas</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.TXT14] Partes Interessadas Internas</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.TXT15] Referenciais</label><input type="text" class="border p-2 w-full"></div>
        </div>
        <div class="flex gap-2 mt-6">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="alert('Guardar como Rascunho')">Guardar como Rascunho</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="alert('Guardar e Publicar')">Guardar e Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I5')">Voltar</button>
        </div>
    </div>\`;
    return html;
}

function renderI7DetalheSubProcessoAtivo() {
    const sp = getItemById(currentState.contextId) || {};
    let html = \`
    <div class="mb-4 flex justify-between items-center">
        <h1 class="text-3xl font-bold">[I7] Interface 7 – Detalhe</h1>
        <div>
            <button class="bg-blue-600 text-white px-4 py-2 rounded shadow mr-2" onclick="navigateTo('I8', '\${sp.id}')">Edição</button>
            <button class="bg-orange-500 text-white px-4 py-2 rounded shadow mr-2" onclick="alert('Desativar')">Desativar</button>
            <button class="bg-red-500 text-white px-4 py-2 rounded shadow mr-2" onclick="alert('Eliminar')">Eliminar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I5')">Voltar</button>
        </div>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-6">
        <div><strong>[I6.LB01] Processo Pai:</strong> \${sp.processoPaiId || ''}</div>
        <div><strong>[I2.UPL01] Upload Logo:</strong> <input type="file" disabled></div>
        <div><strong>[I2.UPL02] Upload Banner:</strong> <input type="file" disabled></div>
        <div><strong>[I7.TXT01] Label de Registo:</strong> \${sp.labelRegisto || ''}</div>
        <div><strong>[I7.TXT02] Código:</strong> \${sp.codigo || ''}</div>
        <div><strong>[I7.TXT03] Nome:</strong> \${sp.nome || ''}</div>
        <div><strong>[I7.TXT04] Objetivo:</strong> \${sp.objetivo || ''}</div>
        <div><strong>[I7.TXT05] Âmbito:</strong> \${sp.ambito || ''}</div>
        <div><strong>[I7.DT01] Data de Elaboração:</strong> \${sp.dataElaboracao || ''}</div>
        <div><strong>[I7.TXT06] Donos do Sub Processo:</strong> \${sp.donos ? sp.donos.map(d=>d.nome).join(', ') : ''}</div>
        <div><strong>[I7.TXT07] Versão:</strong> \${sp.versao || ''}</div>
        <div><strong>[I7.DT02] Data de revisão da versão:</strong> \${sp.dataRevisao || ''}</div>
        <div><strong>[I7.TXT08] Riscos Relevantes:</strong> \${sp.riscos || ''}</div>
        <div><strong>[I7.TXT09] Oportunidades:</strong> \${sp.oportunidades || ''}</div>
        <div><strong>[I7.TXT10] Entradas:</strong> \${sp.entradas || ''}</div>
        <div><strong>[I7.TXT11] Saídas:</strong> \${sp.saidas || ''}</div>
        <div><strong>[I7.TXT12] Indicadores de Sucesso:</strong> \${sp.indicadoresSucesso || ''}</div>
        <div><strong>[I7.TXT13] Partes Interessadas Externas:</strong> \${sp.partesInteressadasExternas || ''}</div>
        <div><strong>[I7.TXT14] Partes Interessadas Internas:</strong> \${sp.partesInteressadasInternas || ''}</div>
        <div><strong>[I7.TXT15] Referenciais:</strong> \${sp.referenciais || ''}</div>
    </div>

    <div class="mb-4">
        <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="navigateTo('I10', '\${sp.id}')">Adicionar documentos</button>
    </div>
    <h2 class="text-xl font-bold mt-4 mb-2">[I7.TB01] Tabela com a lista de documentos</h2>
    <table class="min-w-full bg-white border mb-6">
        <thead class="bg-gray-200">
            <tr>
                <th class="border px-4 py-2">Código do documento</th>
                <th class="border px-4 py-2">Designação</th>
                <th class="border px-4 py-2">Versão</th>
                <th class="border px-4 py-2">Data de elaboração</th>
                <th class="border px-4 py-2">Tipo</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>\`;
    if(sp.documentosId) {
        sp.documentosId.forEach(docId => {
            const doc = getItemById(docId);
            if(doc) {
                html += \`<tr>
                    <td class="border px-4 py-2">\${doc.codigo}</td>
                    <td class="border px-4 py-2">\${doc.designacao}</td>
                    <td class="border px-4 py-2">\${doc.versao}</td>
                    <td class="border px-4 py-2">\${doc.dataElaboracao}</td>
                    <td class="border px-4 py-2">\${doc.tipo || ''}</td>
                    <td class="border px-4 py-2">
                        <button class="bg-blue-600 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I11', '\${doc.id}')">Detalhe</button>
                        <button class="bg-yellow-500 text-white px-3 py-1 rounded" onclick="navigateTo('I10', '\${doc.id}')">Editar</button>
                    </td>
                </tr>\`;
            }
        });
    }
    html += \`
        </tbody>
    </table>

    <h2 class="text-xl font-bold mt-4 mb-2">[I7.TB02] Tabela de Histórico de Versões</h2>
    <table class="min-w-full bg-white border mb-6">
        <thead class="bg-gray-200">
            <tr>
                <th class="border px-4 py-2">Código do sub processo</th>
                <th class="border px-4 py-2">Nome</th>
                <th class="border px-4 py-2">Versão</th>
                <th class="border px-4 py-2">Data de revisão da versão</th>
                <th class="border px-4 py-2">Estado</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>\`;
    const historicoSP = mockData.subProcessos
        .filter(x => x.codigo === sp.codigo && x.id !== sp.id)
        .sort((a,b) => new Date(b.dataRevisao) - new Date(a.dataRevisao));

    historicoSP.forEach(h => {
        html += \`<tr>
            <td class="border px-4 py-2">\${h.codigo}</td>
            <td class="border px-4 py-2">\${h.nome}</td>
            <td class="border px-4 py-2">\${h.versao}</td>
            <td class="border px-4 py-2">\${h.dataRevisao}</td>
            <td class="border px-4 py-2">\${h.status}</td>
            <td class="border px-4 py-2">
                <button class="bg-gray-600 text-white px-3 py-1 rounded mr-1" onclick="navigateTo('I13', '\${h.id}')">Detalhe Histórico</button>
                <button class="bg-yellow-500 text-white px-3 py-1 rounded mr-1" onclick="navigateTo('I8', '\${h.id}')">Edição</button>
                <button class="bg-green-600 text-white px-3 py-1 rounded" onclick="alert('Publicar')">Publicar</button>
            </td>
        </tr>\`;
    });

    html += \`
        </tbody>
    </table>
    \`;
    return html;
}

function renderI8RevisaoSubProcesso() {
    const sp = getItemById(currentState.contextId) || {};
    let html = \`<h1 class="text-3xl font-bold mb-4">[I8] Interface 8 – Edição</h1>
    <div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">[I8.LB01] Processo Pai</label><input type="text" class="border p-2 w-full bg-gray-100" value="\${sp.processoPaiId || ''}" readonly></div>
            <div><label class="block font-bold">[I8.UPL01] Upload Logo</label><input type="file" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I8.UPL02] Upload Banner</label><input type="file" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I8.TXT01] Label de Registo</label><input type="text" class="border p-2 w-full" value="\${sp.labelRegisto || ''}"></div>
            <div><label class="block font-bold">[I8.TXT02] Código</label><input type="text" class="border p-2 w-full" value="\${sp.codigo || ''}"></div>
            <div><label class="block font-bold">[I8.TXT03] Nome</label><input type="text" class="border p-2 w-full" value="\${sp.nome || ''}"></div>
            <div><label class="block font-bold">[I8.TXT04] Objetivo</label><input type="text" class="border p-2 w-full" value="\${sp.objetivo || ''}"></div>
            <div><label class="block font-bold">[I8.TXT05] Âmbito</label><input type="text" class="border p-2 w-full" value="\${sp.ambito || ''}"></div>
            <div><label class="block font-bold">[I8.DT01] Data de Elaboração</label><input type="date" class="border p-2 w-full" value="\${sp.dataElaboracao || ''}"></div>
            <div><label class="block font-bold">[I8.TXT06] Donos do Sub Processo</label><input type="text" class="border p-2 w-full" value="\${sp.donos ? sp.donos.map(d=>d.nome).join(', ') : ''}"></div>
            <div><label class="block font-bold">[I8.TXT07] Versão</label><input type="text" class="border p-2 w-full" value="\${sp.versao || ''}"></div>
            <div><label class="block font-bold">[I8.DT02] Data de revisão da versão</label><input type="date" class="border p-2 w-full" value="\${sp.dataRevisao || ''}"></div>
            <div><label class="block font-bold">[I8.TXT08] Riscos Relevantes</label><input type="text" class="border p-2 w-full" value="\${sp.riscos || ''}"></div>
            <div><label class="block font-bold">[I8.TXT09] Oportunidades</label><input type="text" class="border p-2 w-full" value="\${sp.oportunidades || ''}"></div>
            <div><label class="block font-bold">[I8.TXT10] Entradas</label><input type="text" class="border p-2 w-full" value="\${sp.entradas || ''}"></div>
            <div><label class="block font-bold">[I8.TXT11] Saídas</label><input type="text" class="border p-2 w-full" value="\${sp.saidas || ''}"></div>
            <div><label class="block font-bold">[I8.TXT12] Indicadores de Sucesso</label><input type="text" class="border p-2 w-full" value="\${sp.indicadoresSucesso || ''}"></div>
            <div><label class="block font-bold">[I8.TXT13] Partes Interessadas Externas</label><input type="text" class="border p-2 w-full" value="\${sp.partesInteressadasExternas || ''}"></div>
            <div><label class="block font-bold">[I8.TXT14] Partes Interessadas Internas</label><input type="text" class="border p-2 w-full" value="\${sp.partesInteressadasInternas || ''}"></div>
            <div><label class="block font-bold">[I8.TXT15] Referenciais</label><input type="text" class="border p-2 w-full" value="\${sp.referenciais || ''}"></div>
        </div>

        <h2 class="font-bold text-lg mb-2">[I8.TB01] Tabela com a lista de documentos</h2>
        <table class="w-full border text-left mb-6"><thead class="bg-gray-100"><tr>
            <th class="p-2 border">Código do documento</th>
            <th class="p-2 border">Designação</th>
            <th class="p-2 border">Versão</th>
            <th class="p-2 border">Data de elaboração</th>
            <th class="p-2 border">Tipo</th>
            <th class="p-2 border">Ações</th>
        </tr></thead><tbody>\`;
        if(sp.documentosId) {
            sp.documentosId.forEach(docId => {
                const doc = getItemById(docId);
                if(doc && doc.status === 'Publicado') {
                    html += \`<tr>
                        <td class="p-2 border">\${doc.codigo}</td>
                        <td class="p-2 border">\${doc.designacao}</td>
                        <td class="p-2 border">\${doc.versao}</td>
                        <td class="p-2 border">\${doc.dataElaboracao}</td>
                        <td class="p-2 border">\${doc.tipo || ''}</td>
                        <td class="p-2 border">
                            <button class="bg-blue-500 text-white px-2 py-1 rounded mr-1" onclick="navigateTo('I11', '\${doc.id}')">Detalhe</button>
                            <button class="bg-yellow-500 text-white px-2 py-1 rounded mr-1" onclick="navigateTo('I10', '\${doc.id}')">Editar</button>
                            <button class="bg-orange-500 text-white px-2 py-1 rounded mr-1" onclick="alert('Desativar')">Desativar</button>
                            <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="alert('Eliminar')">Eliminar</button>
                        </td>
                    </tr>\`;
                }
            });
        }
        html += \`</tbody></table>

        <div class="flex gap-2 mt-6">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="alert('Guardar como Rascunho')">Guardar como Rascunho</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="alert('Guardar e Publicar')">Guardar e Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I7', '\${sp.id}')">Voltar</button>
        </div>
    </div>\`;
    return html;
}

function renderI9ListaDocumentos() {
    let html = \`
    <div class="flex justify-between items-center mb-4">
        <h1 class="text-3xl font-bold">[I9] Interface 9 – Lista de Documentos</h1>
        <button class="bg-green-600 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I10')">Adicionar Documento</button>
    </div>
    <div class="mb-4 flex gap-2 items-end">
        <div class="flex-grow">
            <label class="block text-sm font-bold mb-1">[I9.TXT01] Input Pesquisa</label>
            <input type="text" placeholder="Pesquisar por Código Processo/Sub processo, Designação, Código Documento..." class="border p-2 rounded w-full">
        </div>
        <button class="bg-blue-600 text-white px-4 py-2 rounded h-10">[I9.BT01] Pesquisar</button>
    </div>
    <div class="mb-4">
        <label class="block text-sm font-bold mb-1">[I1.CHK01] Filtro de Estado</label>
        <div class="flex gap-4">
            <label><input type="checkbox" value="Publicado"> Publicado</label>
            <label><input type="checkbox" value="Rascunho"> Rascunho</label>
            <label><input type="checkbox" value="Inativo"> Inativo</label>
        </div>
    </div>

    <h2 class="text-xl font-bold mt-4 mb-2">[I9.TB01] Tabela com a lista de documentos</h2>
    <table class="min-w-full bg-white border mb-6">
        <thead class="bg-gray-200">
            <tr>
                <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Código do documento</th>
                <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Código do processo / sub processo associado</th>
                <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Designação</th>
                <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Versão</th>
                <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Data de elaboração</th>
                <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Tipo</th>
                <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Label de registo + ID Registo</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>\`;

    mockData.documentos.forEach(doc => {
        const idRegisto = doc.id;
        const label = doc.labelRegisto ? doc.labelRegisto + ' - ' : '';
        const assocProc = "PROC-001"; // Mocked for display
        html += \`<tr>
            <td class="border px-4 py-2">\${doc.codigo}</td>
            <td class="border px-4 py-2">\${assocProc}</td>
            <td class="border px-4 py-2">\${doc.designacao}</td>
            <td class="border px-4 py-2">\${doc.versao}</td>
            <td class="border px-4 py-2">\${doc.dataElaboracao}</td>
            <td class="border px-4 py-2">\${doc.tipo || ''}</td>
            <td class="border px-4 py-2">\${label}\${idRegisto}</td>
            <td class="border px-4 py-2">
                <button class="bg-blue-500 text-white px-2 py-1 rounded mr-1" onclick="navigateTo('I11', '\${doc.id}')">Detalhe</button>
                <button class="bg-yellow-500 text-white px-2 py-1 rounded mr-1" onclick="navigateTo('I10', '\${doc.id}')">Edição</button>
                <button class="bg-orange-500 text-white px-2 py-1 rounded mr-1" onclick="alert('Desativar')">Desativar</button>
                <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="alert('Eliminar')">Eliminar</button>
            </td>
        </tr>\`;
    });

    html += \`</tbody></table><br><button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I1')">Voltar</button>\`;
    return html;
}

function renderI10CriacaoEdicaoDocumento() {
    const doc = currentState.contextId ? getItemById(currentState.contextId) : {};
    let isEdit = !!doc.id;
    let html = \`<h1 class="text-3xl font-bold mb-4">[I10] Interface 10 – \${isEdit ? 'Edição' : 'Criação'} de Documento</h1>
    <div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">[I10.LB01] Processo Associado</label>
                <select class="border p-2 w-full">
                    <option value="">Selecione...</option>
                    <option value="PROC-001" selected>PROC-001</option>
                </select>
            </div>
            <div><label class="block font-bold">[I10.TXT01] Label de Registo</label><input type="text" class="border p-2 w-full" value="\${doc.labelRegisto || ''}"></div>
            <div><label class="block font-bold">[I10.TXT02] Código</label><input type="text" class="border p-2 w-full" value="\${doc.codigo || ''}"></div>
            <div><label class="block font-bold">[I10.TXT03] Designação</label><input type="text" class="border p-2 w-full" value="\${doc.designacao || ''}"></div>
            <div><label class="block font-bold">[I10.TXT04] Versão</label><input type="text" class="border p-2 w-full" value="\${doc.versao || ''}"></div>
            <div><label class="block font-bold">[I10.DT01] Data de Elaboração</label><input type="date" class="border p-2 w-full" value="\${doc.dataElaboracao || ''}"></div>
            <div><label class="block font-bold">[I10.TXT05] Donos do Documento</label><input type="text" class="border p-2 w-full" value="\${doc.donos ? doc.donos.map(d=>d.nome).join(', ') : ''}"></div>
            <div><label class="block font-bold">[I10.DT02] Data de revisão da versão</label><input type="date" class="border p-2 w-full" value="\${doc.dataRevisao || ''}"></div>
            <div><label class="block font-bold">[I10.LB02] Tipo</label>
                <select class="border p-2 w-full">
                    <option value="">Selecione o Tipo</option>
                    <option value="Instrumento" \${doc.tipo === 'Instrumento' ? 'selected' : ''}>Instrumento</option>
                    <option value="Regulamento" \${doc.tipo === 'Regulamento' ? 'selected' : ''}>Regulamento</option>
                    <option value="Orientação" \${doc.tipo === 'Orientação' ? 'selected' : ''}>Orientação</option>
                    <option value="Impresso" \${doc.tipo === 'Impresso' ? 'selected' : ''}>Impresso</option>
                </select>
            </div>
            <div class="col-span-2 border p-4 bg-gray-50">
                <label class="block font-bold mb-2">[I10.UPL01] Upload de Ficheiros e Parametrização</label>
                <input type="file" multiple class="border p-2 w-full mb-2">
                <label class="flex items-center"><input type="checkbox" class="mr-2"> Documentos Parametrizáveis</label>
            </div>
        </div>
        \${isEdit ? \`<div class="mb-4"><button class="text-blue-600 underline" onclick="alert('Download do(s) ficheiro(s)')">[I10.BT01] Download</button></div>\` : ''}
        <div class="flex gap-2 mt-6">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="alert('Guardar como Rascunho')">[I10.BT02] Guardar como Rascunho</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="alert('Guardar e Publicar')">[I10.BT03] Guardar e Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('\${isEdit ? 'I11' : 'I9'}', '\${doc.id || ''}')">[I10.BT04] Voltar</button>
        </div>
    </div>\`;
    return html;
}

function renderI11DetalheDocumento() {
    const doc = getItemById(currentState.contextId) || {};
    let html = \`
    <div class="mb-4 flex justify-between items-center">
        <h1 class="text-3xl font-bold">[I11] Interface 11 – Detalhe de Documento</h1>
        <div>
            <button class="text-blue-600 underline mr-4" onclick="alert('Download')">[I11.BT01] Download</button>
            <button class="bg-blue-600 text-white px-4 py-2 rounded shadow mr-2" onclick="navigateTo('I10', '\${doc.id}')">[I11.BT02] Edição</button>
            <button class="bg-orange-500 text-white px-4 py-2 rounded shadow mr-2" onclick="alert('Desativar')">[I11.BT03] Desativar</button>
            <button class="bg-red-500 text-white px-4 py-2 rounded shadow mr-2" onclick="alert('Eliminar')">[I11.BT04] Eliminar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I9')">[I11.BT05] Voltar</button>
        </div>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-6">
        <div><strong>[I11.LB01] Processo Associado:</strong> PROC-001</div>
        <div><strong>[I11.TXT01] Label de Registo:</strong> \${doc.labelRegisto || ''}</div>
        <div><strong>[I11.TXT02] Código:</strong> \${doc.codigo || ''}</div>
        <div><strong>[I11.TXT03] Designação:</strong> \${doc.designacao || ''}</div>
        <div><strong>[I11.TXT04] Versão:</strong> \${doc.versao || ''}</div>
        <div><strong>[I11.DT01] Data de Elaboração:</strong> \${doc.dataElaboracao || ''}</div>
        <div><strong>[I11.TXT05] Donos do Documento:</strong> \${doc.donos ? doc.donos.map(d=>d.nome).join(', ') : ''}</div>
        <div><strong>[I11.DT02] Data de revisão da versão:</strong> \${doc.dataRevisao || ''}</div>
        <div><strong>[I11.LB02] Tipo:</strong> \${doc.tipo || ''}</div>
        <div><strong>[I11.TXT04] Estado:</strong> \${doc.status || ''}</div>
    </div>

    <h2 class="text-xl font-bold mt-4 mb-2">[I11.TB02] Tabela de Histórico de Versões</h2>
    <table class="min-w-full bg-white border mb-6">
        <thead class="bg-gray-200">
            <tr>
                <th class="border px-4 py-2">Código do documento</th>
                <th class="border px-4 py-2">Designação</th>
                <th class="border px-4 py-2">Versão</th>
                <th class="border px-4 py-2">Data de revisão da versão</th>
                <th class="border px-4 py-2">Estado</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>\`;
    const historicoDoc = mockData.documentos
        .filter(x => x.codigo === doc.codigo && x.id !== doc.id)
        .sort((a,b) => new Date(b.dataRevisao) - new Date(a.dataRevisao));

    historicoDoc.forEach(h => {
        html += \`<tr>
            <td class="border px-4 py-2">\${h.codigo}</td>
            <td class="border px-4 py-2">\${h.designacao}</td>
            <td class="border px-4 py-2">\${h.versao}</td>
            <td class="border px-4 py-2">\${h.dataRevisao}</td>
            <td class="border px-4 py-2">\${h.status}</td>
            <td class="border px-4 py-2">
                <button class="bg-gray-600 text-white px-3 py-1 rounded mr-1" onclick="navigateTo('I14', '\${h.id}')">Detalhe Histórico</button>
                <button class="bg-yellow-500 text-white px-3 py-1 rounded mr-1" onclick="navigateTo('I10', '\${h.id}')">Edição</button>
                <button class="bg-green-600 text-white px-3 py-1 rounded" onclick="alert('Publicar')">Publicar</button>
            </td>
        </tr>\`;
    });

    html += \`
        </tbody>
    </table>
    \`;
    return html;
}

function renderI12DetalheHistoricoProcesso() {
    const p = getItemById(currentState.contextId) || {};
    let html = \`
    <div class="mb-4 flex justify-between items-center">
        <h1 class="text-3xl font-bold">[I12] Interface 12 – Detalhe Histórico de Processo</h1>
        <div>
            <button class="bg-blue-600 text-white px-4 py-2 rounded shadow mr-2" onclick="navigateTo('I4', '\${p.id}')">[I12.BT01] Edição</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded shadow mr-2" onclick="alert('Publicar')">[I12.BT02] Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I3', '\${p.id}')">[I12.BT03] Voltar</button>
        </div>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-6 opacity-75">
        <div><strong>Código:</strong> \${p.codigo || ''}</div>
        <div><strong>Nome:</strong> \${p.nome || ''}</div>
        <div><strong>Objetivo:</strong> \${p.objetivo || ''}</div>
        <div><strong>Âmbito:</strong> \${p.ambito || ''}</div>
        <div><strong>Data de Elaboração:</strong> \${p.dataElaboracao || ''}</div>
        <div><strong>Versão:</strong> \${p.versao || ''}</div>
        <div><strong>Data de Revisão da versão:</strong> \${p.dataRevisao || ''}</div>
        <div><strong>Estado:</strong> \${p.status || ''}</div>
    </div>

    <h2 class="text-xl font-bold mt-4 mb-2">[I12.TB02] Tabela com a lista de sub processos</h2>
    <table class="min-w-full bg-white border mb-6">
        <thead class="bg-gray-200">
            <tr>
                <th class="border px-4 py-2">Código do sub processo</th>
                <th class="border px-4 py-2">Nome</th>
                <th class="border px-4 py-2">Versão</th>
                <th class="border px-4 py-2">Data de elaboração</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>\`;
    if(p.subProcessosId) {
        p.subProcessosId.forEach(spId => {
            const sp = getItemById(spId);
            if(sp) {
                html += \`<tr>
                    <td class="border px-4 py-2">\${sp.codigo}</td>
                    <td class="border px-4 py-2">\${sp.nome}</td>
                    <td class="border px-4 py-2">\${sp.versao}</td>
                    <td class="border px-4 py-2">\${sp.dataElaboracao}</td>
                    <td class="border px-4 py-2">
                        <button class="bg-gray-600 text-white px-3 py-1 rounded" onclick="navigateTo('\${sp.status==='Publicado'?'I7':'I13'}', '\${sp.id}')">Detalhe</button>
                    </td>
                </tr>\`;
            }
        });
    }
    html += \`
        </tbody>
    </table>

    <h2 class="text-xl font-bold mt-4 mb-2">[I12.TB03] Tabela com a lista de documentos</h2>
    <table class="min-w-full bg-white border mb-6">
        <thead class="bg-gray-200">
            <tr>
                <th class="border px-4 py-2">Código do documento</th>
                <th class="border px-4 py-2">Designação</th>
                <th class="border px-4 py-2">Versão</th>
                <th class="border px-4 py-2">Data de elaboração</th>
                <th class="border px-4 py-2">Tipo</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>\`;
    if(p.documentosId) {
        p.documentosId.forEach(docId => {
            const doc = getItemById(docId);
            if(doc) {
                html += \`<tr>
                    <td class="border px-4 py-2">\${doc.codigo}</td>
                    <td class="border px-4 py-2">\${doc.designacao}</td>
                    <td class="border px-4 py-2">\${doc.versao}</td>
                    <td class="border px-4 py-2">\${doc.dataElaboracao}</td>
                    <td class="border px-4 py-2">\${doc.tipo || ''}</td>
                    <td class="border px-4 py-2">
                        <button class="bg-gray-600 text-white px-3 py-1 rounded" onclick="navigateTo('\${doc.status==='Publicado'?'I11':'I14'}', '\${doc.id}')">Detalhe</button>
                    </td>
                </tr>\`;
            }
        });
    }
    html += \`
        </tbody>
    </table>
    \`;
    return html;
}

function renderI13DetalheHistoricoSubProcesso() {
    const sp = getItemById(currentState.contextId) || {};
    let html = \`
    <div class="mb-4 flex justify-between items-center">
        <h1 class="text-3xl font-bold">[I13] Interface 13 – Detalhe Histórico de Sub processo</h1>
        <div>
            <button class="bg-blue-600 text-white px-4 py-2 rounded shadow mr-2" onclick="navigateTo('I8', '\${sp.id}')">[I13.BT01] Edição</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded shadow mr-2" onclick="alert('Publicar')">[I13.BT02] Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I7', '\${sp.id}')">[I13.BT03] Voltar</button>
        </div>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-6 opacity-75">
        <div><strong>[I13.LB01] Processo Pai:</strong> \${sp.processoPaiId || ''}</div>
        <div><strong>Código:</strong> \${sp.codigo || ''}</div>
        <div><strong>Nome:</strong> \${sp.nome || ''}</div>
        <div><strong>Objetivo:</strong> \${sp.objetivo || ''}</div>
        <div><strong>Âmbito:</strong> \${sp.ambito || ''}</div>
        <div><strong>Data de Elaboração:</strong> \${sp.dataElaboracao || ''}</div>
        <div><strong>Versão:</strong> \${sp.versao || ''}</div>
        <div><strong>Data de Revisão da versão:</strong> \${sp.dataRevisao || ''}</div>
        <div><strong>Estado:</strong> \${sp.status || ''}</div>
    </div>

    <h2 class="text-xl font-bold mt-4 mb-2">[I13.TB02] Tabela com a lista de documentos</h2>
    <table class="min-w-full bg-white border mb-6">
        <thead class="bg-gray-200">
            <tr>
                <th class="border px-4 py-2">Código do documento</th>
                <th class="border px-4 py-2">Designação</th>
                <th class="border px-4 py-2">Versão</th>
                <th class="border px-4 py-2">Data de elaboração</th>
                <th class="border px-4 py-2">Tipo</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>\`;
    if(sp.documentosId) {
        sp.documentosId.forEach(docId => {
            const doc = getItemById(docId);
            if(doc) {
                html += \`<tr>
                    <td class="border px-4 py-2">\${doc.codigo}</td>
                    <td class="border px-4 py-2">\${doc.designacao}</td>
                    <td class="border px-4 py-2">\${doc.versao}</td>
                    <td class="border px-4 py-2">\${doc.dataElaboracao}</td>
                    <td class="border px-4 py-2">\${doc.tipo || ''}</td>
                    <td class="border px-4 py-2">
                        <button class="bg-gray-600 text-white px-3 py-1 rounded" onclick="navigateTo('\${doc.status==='Publicado'?'I11':'I14'}', '\${doc.id}')">Detalhe</button>
                    </td>
                </tr>\`;
            }
        });
    }
    html += \`
        </tbody>
    </table>
    \`;
    return html;
}

function renderI14DetalheHistoricoDocumento() {
    const doc = getItemById(currentState.contextId) || {};
    let html = \`
    <div class="mb-4 flex justify-between items-center">
        <h1 class="text-3xl font-bold">[I14] Interface 14 – Detalhe Histórico de Documento</h1>
        <div>
            <button class="text-blue-600 underline mr-4" onclick="alert('Download')">[I14.BT01] Download do Ficheiro Histórico</button>
            <button class="bg-blue-600 text-white px-4 py-2 rounded shadow mr-2" onclick="navigateTo('I10', '\${doc.id}')">[I14.BT02] Edição</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded shadow mr-2" onclick="alert('Publicar')">[I14.BT03] Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I11', '\${doc.id}')">[I14.BT04] Voltar</button>
        </div>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-6 opacity-75">
        <div><strong>[I14.LB01] Processo/Sub processo Associado:</strong> PROC-001</div>
        <div><strong>Código:</strong> \${doc.codigo || ''}</div>
        <div><strong>Designação:</strong> \${doc.designacao || ''}</div>
        <div><strong>Versão:</strong> \${doc.versao || ''}</div>
        <div><strong>Data de Elaboração:</strong> \${doc.dataElaboracao || ''}</div>
        <div><strong>Data de Revisão da versão:</strong> \${doc.dataRevisao || ''}</div>
        <div><strong>Tipo:</strong> \${doc.tipo || ''}</div>
        <div><strong>Estado:</strong> \${doc.status || ''}</div>
    </div>
    \`;
    return html;
}
`;

const newAppJs = beforeI3 + newCode + endString;
fs.writeFileSync('mockup/app.js', newAppJs);
console.log('Successfully updated app.js interfaces.');
