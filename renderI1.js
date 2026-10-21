const fs = require('fs');
let appJs = fs.readFileSync('mockup/app.js', 'utf8');

const oldRenderI1 = /function renderI1ListaProcessos\(\) \{[\s\S]*?return html;\n\}/;

const newRenderI1 = `
let currentSortColumn = null;
let currentSortOrder = 'asc';
let currentPage = 1;
const itemsPerPage = 20;

function renderI1ListaProcessos() {
    let html = \`<div class="flex justify-between items-center mb-4">
                    <h1 class="text-3xl font-bold">[I1] Lista de Processos</h1>
                    <button class="bg-green-600 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I2')">Adicionar Processo</button>
                </div>\`;

    html += \`<div class="mb-4 bg-white p-4 rounded shadow">
                <div class="flex gap-2 mb-4">
                    <input type="text" id="pesquisaProc" placeholder="Pesquisar..." class="border p-2 rounded w-full" value="\${currentState.searchQuery || ''}">
                    <button class="bg-blue-600 text-white px-4 py-2 rounded flex-shrink-0" onclick="performSearch()">Pesquisar</button>
                </div>
                <div class="flex gap-4 items-center">
                    <span class="font-bold">Estado:</span>
                    <label><input type="checkbox" id="chkRascunho" \${currentState.filters && currentState.filters.includes('Rascunho') ? 'checked' : ''}> Rascunho</label>
                    <label><input type="checkbox" id="chkPublicado" \${currentState.filters && currentState.filters.includes('Publicado') ? 'checked' : ''}> Publicado</label>
                    <label><input type="checkbox" id="chkInativo" \${currentState.filters && currentState.filters.includes('Inativo') ? 'checked' : ''}> Inativo</label>
                </div>
             </div>\`;

    html += \`<table class="min-w-full bg-white border">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300" onclick="sortBy('codigo')">Código</th>
                        <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300" onclick="sortBy('nome')">Nome</th>
                        <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300" onclick="sortBy('versao')">Versão</th>
                        <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300" onclick="sortBy('dataElaboracao')">Data de elaboração</th>
                        <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300" onclick="sortBy('status')">Estado</th>
                        <th class="border px-4 py-2">Ações</th>
                    </tr>
                </thead>
                <tbody>\`;

    let filteredProcessos = mockData.processos;

    // Apply text search
    if (currentState.searchQuery) {
        const q = currentState.searchQuery.toLowerCase();
        filteredProcessos = filteredProcessos.filter(p =>
            (p.codigo && p.codigo.toLowerCase().includes(q)) ||
            (p.nome && p.nome.toLowerCase().includes(q)) ||
            (p.objetivo && p.objetivo.toLowerCase().includes(q)) ||
            (p.ambito && p.ambito.toLowerCase().includes(q))
        );
    }

    // Apply state filters
    let activeFilters = currentState.filters || [];
    if (activeFilters.length === 0) {
        // Por omissão devolve a totalidade
        activeFilters = ['Rascunho', 'Publicado', 'Inativo'];
    }
    filteredProcessos = filteredProcessos.filter(p => activeFilters.includes(p.status));

    // Sort logic
    if (currentSortColumn) {
        filteredProcessos.sort((a, b) => {
            let valA = a[currentSortColumn] || '';
            let valB = b[currentSortColumn] || '';
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            if (valA < valB) return currentSortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return currentSortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    } else {
        // Default sort: Código -> Nome -> Objetivo -> Âmbito -> Estado (Alfabético)
        filteredProcessos.sort((a, b) => {
            if ((a.codigo || '') !== (b.codigo || '')) return (a.codigo || '').localeCompare(b.codigo || '');
            if ((a.nome || '') !== (b.nome || '')) return (a.nome || '').localeCompare(b.nome || '');
            if ((a.objetivo || '') !== (b.objetivo || '')) return (a.objetivo || '').localeCompare(b.objetivo || '');
            if ((a.ambito || '') !== (b.ambito || '')) return (a.ambito || '').localeCompare(b.ambito || '');
            return (a.status || '').localeCompare(b.status || '');
        });
    }

    // Pagination
    const totalPages = Math.ceil(filteredProcessos.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProcessos = filteredProcessos.slice(startIndex, startIndex + itemsPerPage);

    paginatedProcessos.forEach(p => {
        let statusBadge = 'bg-gray-100 text-gray-800';
        if (p.status === 'Publicado') statusBadge = 'bg-green-100 text-green-800';
        if (p.status === 'Rascunho') statusBadge = 'bg-orange-100 text-orange-800';
        if (p.status === 'Inativo') statusBadge = 'bg-red-100 text-red-800';

        html += \`<tr>
            <td class="border px-4 py-2">\${p.codigo}</td>
            <td class="border px-4 py-2">\${p.nome}</td>
            <td class="border px-4 py-2">\${p.versao}</td>
            <td class="border px-4 py-2">\${p.dataElaboracao}</td>
            <td class="border px-4 py-2"><span class="\${statusBadge} px-2 py-1 rounded">\${p.status}</span></td>
            <td class="border px-4 py-2 flex flex-wrap gap-2">
                <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded" onclick="navigateTo('I3', '\${p.id}')">Detalhe</button>
                <button class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded" onclick="navigateTo('I4', '\${p.id}')">Edição</button>
                <button class="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded" onclick="navigateTo('I5', '\${p.id}')">Sub processos</button>
                <button class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded" onclick="navigateTo('I9', '\${p.id}')">Documentos</button>
                <button class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded" onclick="desativarProcesso('\${p.id}')">Desativar</button>
                <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded" onclick="eliminarProcesso('\${p.id}')">Eliminar</button>
            </td>
        </tr>\`;
    });

    if (paginatedProcessos.length === 0) {
        html += \`<tr><td colspan="6" class="border px-4 py-4 text-center text-gray-500">Nenhum processo encontrado.</td></tr>\`;
    }

    html += \`</tbody></table>\`;

    // Pagination Controls
    html += \`<div class="flex justify-between items-center mt-4">
                <div>Página \${currentPage} de \${totalPages}</div>
                <div class="flex gap-2">
                    <button class="bg-gray-300 px-3 py-1 rounded \${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'}" onclick="\${currentPage > 1 ? 'changePage(' + (currentPage - 1) + ')' : ''}">Anterior</button>
                    <button class="bg-gray-300 px-3 py-1 rounded \${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'}" onclick="\${currentPage < totalPages ? 'changePage(' + (currentPage + 1) + ')' : ''}">Próximo</button>
                </div>
             </div>\`;

    return html;
}

function performSearch() {
    const q = document.getElementById('pesquisaProc').value;
    const filters = [];
    if (document.getElementById('chkRascunho').checked) filters.push('Rascunho');
    if (document.getElementById('chkPublicado').checked) filters.push('Publicado');
    if (document.getElementById('chkInativo').checked) filters.push('Inativo');

    currentState.searchQuery = q;
    currentState.filters = filters.length > 0 ? filters : null;
    currentPage = 1;
    render();
}

function sortBy(column) {
    if (currentSortColumn === column) {
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortColumn = column;
        currentSortOrder = 'asc';
    }
    render();
}

function changePage(page) {
    currentPage = page;
    render();
}
`;

appJs = appJs.replace(oldRenderI1, newRenderI1);

// Update eliminarProcesso and desativarProcesso functions

const regexDesativar = /function desativarProcesso\(id\) \{[\s\S]*?\}\n/g;
appJs = appJs.replace(regexDesativar, `function desativarProcesso(id) {
    if(confirm('Tem a certeza que pretende desativar este processo? Todas as dependências (documentos e sub processos) serão também desativadas em cascata.')) {
        const p = getItemById(id);
        if(p) {
            p.status = 'Inativo';
            // Cascading deactivation
            p.subProcessosId.forEach(spId => {
                const sp = getItemById(spId);
                if(sp) {
                    sp.status = 'Inativo';
                    sp.documentosId.forEach(docId => {
                        const doc = getItemById(docId);
                        if(doc) doc.status = 'Inativo';
                    });
                }
            });
            p.documentosId.forEach(docId => {
                const doc = getItemById(docId);
                if(doc) doc.status = 'Inativo';
            });
            render();
        }
    }
}
`);

const regexEliminar = /function eliminarProcesso\(id\) \{[\s\S]*?\}\n/g;
appJs = appJs.replace(regexEliminar, `function eliminarProcesso(id) {
    const p = getItemById(id);
    if (!p) return;

    if (p.subProcessosId.length > 0 || p.documentosId.length > 0) {
        alert('Erro: Não é possível eliminar este processo porque possui dependências (sub processos ou documentos associados).');
        return;
    }

    if(confirm('Tem a certeza que pretende eliminar este processo? Esta ação é irreversível.')) {
        mockData.processos = mockData.processos.filter(x => x.id !== id);
        render();
    }
}
`);


fs.writeFileSync('mockup/app.js', appJs);
console.log('Updated I1 in mockup/app.js');
