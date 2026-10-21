function renderI3DetalheProcessoAtivo() {
    const p = getItemById(currentState.contextId);
    if(!p) return `Processo não encontrado. <button onclick="navigateTo('I1')">Voltar</button>`;

    let html = `<div class="mb-4 flex justify-between items-center">
                    <h1 class="text-3xl font-bold">[I3] Detalhe de Processo (Ativo)</h1>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow" onclick="novaRevisaoProcesso('${p.id}')">Editar</button>
                </div>`;

    html += `
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div><strong>Código:</strong> ${p.codigo}</div>
            <div><strong>Nome:</strong> ${p.nome}</div>
            <div><strong>Objetivo:</strong> ${p.objetivo}</div>
            <div><strong>Âmbito:</strong> ${p.ambito}</div>
            <div><strong>Data de Elaboração:</strong> ${p.dataElaboracao}</div>
            <div><strong>Data de Edição:</strong> ${p.dataRevisao}</div>
            <div><strong>Versão:</strong> ${p.versao}</div>
            <div><strong>Status:</strong> <span class="bg-green-100 text-green-800 px-2 py-1 rounded">${p.status}</span></div>
        </div>
    `;

    html += `<h2 class="text-xl font-bold mt-8 mb-2">Tabela de Donos do Processo</h2>`;
    html += `<table class="min-w-full bg-white border mb-6"><thead class="bg-gray-200"><tr><th class="border px-4 py-2">Nome</th><th class="border px-4 py-2">Email</th></tr></thead><tbody>`;
    p.donos.forEach(d => html += `<tr><td class="border px-4 py-2">${d.nome}</td><td class="border px-4 py-2">${d.email}</td></tr>`);
    html += `</tbody></table>`;

    html += `<h2 class="text-xl font-bold mt-8 mb-2">Tabela com a lista de sub processos</h2>`;
    html += `<table class="min-w-full bg-white border mb-6"><thead class="bg-gray-200"><tr><th class="border px-4 py-2">Sub Processo</th><th class="border px-4 py-2">Versão</th><th class="border px-4 py-2">Data Elaboração</th><th class="border px-4 py-2">Ação</th></tr></thead><tbody>`;
    p.subProcessosId.forEach(spId => {
        const sp = getItemById(spId);
        if(sp) html += `<tr><td class="border px-4 py-2">${sp.codigo} - ${sp.nome}</td><td class="border px-4 py-2">${sp.versao}</td><td class="border px-4 py-2">${sp.dataElaboracao}</td><td class="border px-4 py-2"><button class="bg-blue-600 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I7', '${sp.id}')">Detalhe</button><button class="bg-yellow-500 text-white px-3 py-1 rounded" onclick="navigateTo('I8', '${sp.id}')">Editar</button></td></tr>`;
    });
    html += `</tbody></table>`;

    html += `<h2 class="text-xl font-bold mt-8 mb-2">Tabela com a lista de documentos</h2>`;
    html += `<table class="min-w-full bg-white border mb-6"><thead class="bg-gray-200"><tr><th class="border px-4 py-2">Documento</th><th class="border px-4 py-2">Versão</th><th class="border px-4 py-2">Data Elaboração</th><th class="border px-4 py-2">Tipo</th><th class="border px-4 py-2">Ação</th></tr></thead><tbody>`;
    p.documentosId.forEach(docId => {
        const doc = getItemById(docId);
        if(doc) html += `<tr><td class="border px-4 py-2">${doc.codigo} - ${doc.designacao}</td><td class="border px-4 py-2">${doc.versao}</td><td class="border px-4 py-2">${doc.dataElaboracao}</td><td class="border px-4 py-2">${doc.tipo}</td><td class="border px-4 py-2"><button class="bg-blue-600 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I11', '${doc.id}')">Detalhe</button><button class="bg-yellow-500 text-white px-3 py-1 rounded" onclick="navigateTo('I12', '${doc.id}')">Editar</button></td></tr>`;
    });
    html += `</tbody></table>`;

    // History Table
    const historico = mockData.processos.filter(x => x.codigo === p.codigo && x.status === 'Inativo');
    html += `<h2 class="text-xl font-bold mt-8 mb-2">Tabela de Histórico de Versões</h2>`;
    if(historico.length > 0) {
        html += `<table class="min-w-full bg-white border">
                    <thead class="bg-gray-200">
                        <tr><th class="border px-4 py-2">Versão</th><th class="border px-4 py-2">Data Edição</th><th class="border px-4 py-2">Ação</th></tr>
                    </thead>
                    <tbody>`;
        historico.forEach(h => {
            html += `<tr class="historical-row">
                        <td class="border px-4 py-2">${h.versao}</td>
                        <td class="border px-4 py-2">${h.dataRevisao}</td>
                        <td class="border px-4 py-2">
                            <button class="bg-gray-500 text-white px-3 py-1 rounded" onclick="navigateTo('I13', '${h.id}')">Detalhe Histórico</button>
                        </td>
                     </tr>`;
        });
        html += `</tbody></table>`;
    } else {
        html += `<p class="text-gray-500">Nenhum histórico disponível.</p>`;
    }

    html += `<br><button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I1')">Voltar</button>`;
    return html;
}

function renderI4RevisaoProcesso() {
    const p = getItemById(currentState.contextId);
    let html = `<h1 class="text-3xl font-bold mb-4">[I4] Edição de Processo</h1>`;
    html += `<div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">Código (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${p.codigo}" readonly></div>
            <div><label class="block font-bold">Nome (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${p.nome}" readonly></div>
            <div><label class="block font-bold">Objetivo (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${p.objetivo}" readonly></div>
            <div><label class="block font-bold">Âmbito (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${p.ambito}" readonly></div>
            <div><label class="block font-bold">Data de Elaboração</label><input type="date" class="border p-2 w-full" value="${p.dataElaboracao}"></div>
            <div><label class="block font-bold">Versão</label><input type="text" class="border p-2 w-full" value="${p.versao}"></div>
            <div><label class="block font-bold">Data de revisão da versão</label><input type="date" class="border p-2 w-full" value="${p.dataRevisao}"></div>
        </div>
        <div class="mb-4">
            <h2 class="font-bold text-lg mb-2">Tabela de Donos do Processo</h2>
            <div class="flex gap-2 mb-2">
                <input type="text" placeholder="Email do dono" class="border p-2 flex-grow">
                <button class="bg-blue-600 text-white px-4 py-2 rounded">Adicionar</button>
            </div>
            <table class="w-full border text-left"><thead class="bg-gray-100"><tr><th class="p-2 border">Nome</th><th class="p-2 border">Email</th><th class="p-2 border">Ações</th></tr></thead><tbody>`;
            p.donos.forEach(d => html += `<tr><td class="p-2 border">${d.nome}</td><td class="p-2 border">${d.email}</td><td class="p-2 border"><button class="text-red-600">Remover</button></td></tr>`);
    html += `</tbody></table>
        </div>

        <div class="mb-4">
            <h2 class="font-bold text-lg mb-2">Tabela com a lista de sub processos</h2>
            <table class="w-full border text-left"><thead class="bg-gray-100"><tr><th class="p-2 border">Código do sub processo</th><th class="p-2 border">Nome</th><th class="p-2 border">Versão</th><th class="p-2 border">Data de elaboração</th><th class="p-2 border">Ações</th></tr></thead><tbody>`;
            // Mock sub processes
            html += `<tr><td class="p-2 border">SP-001</td><td class="p-2 border">Sub Processo Mock</td><td class="p-2 border">1.0</td><td class="p-2 border">2023-10-01</td><td class="p-2 border">
                <button class="bg-blue-500 text-white px-2 py-1 rounded mr-1">Detalhe</button>
                <button class="bg-yellow-500 text-white px-2 py-1 rounded mr-1">Editar</button>
                <button class="bg-orange-500 text-white px-2 py-1 rounded mr-1">Desativar</button>
                <button class="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
            </td></tr>`;
    html += `</tbody></table>
        </div>

        <div class="mb-4">
            <h2 class="font-bold text-lg mb-2">Tabela com a lista de documentos</h2>
            <table class="w-full border text-left"><thead class="bg-gray-100"><tr><th class="p-2 border">Código do documento</th><th class="p-2 border">Designação</th><th class="p-2 border">Versão</th><th class="p-2 border">Data de elaboração</th><th class="p-2 border">Tipo</th><th class="p-2 border">Ações</th></tr></thead><tbody>`;
            // Mock documents
            html += `<tr><td class="p-2 border">DOC-001</td><td class="p-2 border">Documento Mock</td><td class="p-2 border">1.0</td><td class="p-2 border">2023-10-01</td><td class="p-2 border">Instrumento</td><td class="p-2 border">
                <button class="bg-blue-500 text-white px-2 py-1 rounded mr-1">Detalhe</button>
                <button class="bg-yellow-500 text-white px-2 py-1 rounded mr-1">Editar</button>
                <button class="bg-orange-500 text-white px-2 py-1 rounded mr-1">Desativar</button>
                <button class="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
            </td></tr>`;

    html += `</tbody></table>
        </div>

        <div class="flex gap-2 mt-6">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="guardarProcesso('rascunho', '${p.id}')">Guardar como Rascunho</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="guardarProcesso('publicar', '${p.id}')">Guardar e Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I3', '${p.id}')">Voltar</button>
        </div>
    </div>`;
    return html;
}

function renderI5ListaSubProcessos() {
    let html = `<div class="flex justify-between items-center mb-4">
                    <h1 class="text-3xl font-bold">[I5] Lista de Sub processos</h1>
                    <button class="bg-green-600 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I6')">Adicionar Sub processo</button>
                </div>`;
    html += `<div class="mb-4 flex gap-2">
                <input type="text" placeholder="Pesquisa por Processo Pai, Código, Nome..." class="border p-2 rounded w-1/2">
                <button class="bg-blue-600 text-white px-4 py-2 rounded">Pesquisar</button>
             </div>`;
    html += `<table class="min-w-full bg-white border"><thead class="bg-gray-200"><tr><th class="border px-4 py-2">Código</th><th class="border px-4 py-2">Processo Pai</th><th class="border px-4 py-2">Nome</th><th class="border px-4 py-2">Ações</th></tr></thead><tbody>`;
    mockData.subProcessos.forEach(sp => {
        if(sp.status === 'Publicado') {
            html += `<tr><td class="border px-4 py-2">${sp.codigo}</td><td class="border px-4 py-2">${sp.processoPaiId}</td><td class="border px-4 py-2">${sp.nome}</td><td class="border px-4 py-2"><button class="bg-blue-500 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I7', '${sp.id}')">Detalhe</button><button class="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I8', '${sp.id}')">Editar</button><button class="bg-red-500 text-white px-3 py-1 rounded" onclick="desativarSubProcesso('${sp.id}')">Desativar</button></td></tr>`;
        }
    });
    html += `</tbody></table><br><button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I1')">Voltar para Home</button>`;
    return html;
}

function renderI6CriacaoSubProcesso() {
    let html = `<h1 class="text-3xl font-bold mb-4">[I6] Criação de Sub processo</h1>`;
    html += `<div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">Processo Pai</label><select class="border p-2 w-full"><option>PROC-001 - Gestão de Qualidade</option></select></div>
            <div><label class="block font-bold">Código</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Nome</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Objetivo</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Âmbito</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Data de Elaboração</label><input type="date" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Versão</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Data de revisão da versão</label><input type="date" class="border p-2 w-full"></div>
        </div>
        <div class="mb-4">
            <h2 class="font-bold text-lg mb-2">Tabela de Donos do Sub Processo</h2>
            <div class="flex gap-2 mb-2">
                <input type="text" placeholder="Email do dono" class="border p-2 flex-grow">
                <button class="bg-blue-600 text-white px-4 py-2 rounded">Adicionar</button>
            </div>
            <table class="w-full border text-left"><thead class="bg-gray-100"><tr><th class="p-2 border">Nome</th><th class="p-2 border">Email</th><th class="p-2 border">Ações</th></tr></thead><tbody><tr><td class="p-2 border">Atual Utilizador</td><td class="p-2 border">user@empresa.com</td><td class="p-2 border"><button class="text-red-600">Remover</button></td></tr></tbody></table>
        </div>
        <div class="flex gap-2 mt-6">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="guardarSubProcesso('rascunho')">Guardar como Rascunho</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="guardarSubProcesso('publicar')">Guardar e Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I5')">Voltar</button>
        </div>
    </div>`;
    return html;
}

function renderI7DetalheSubProcessoAtivo() {
    const sp = getItemById(currentState.contextId);
    if(!sp) return `Sub processo não encontrado. <button onclick="navigateTo('I1')">Voltar</button>`;

    let html = `<div class="mb-4 flex justify-between items-center">
                    <h1 class="text-3xl font-bold">[I7] Detalhe de Sub Processo (Ativo)</h1>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow" onclick="alert('Funcionalidade Editar mockada')">Editar</button>
                </div>`;

    html += `
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div><strong>Processo Pai:</strong> ${sp.processoPaiId}</div>
            <div><strong>Código:</strong> ${sp.codigo}</div>
            <div><strong>Nome:</strong> ${sp.nome}</div>
            <div><strong>Objetivo:</strong> ${sp.objetivo}</div>
            <div><strong>Âmbito:</strong> ${sp.ambito}</div>
            <div><strong>Data Elaboração:</strong> ${sp.dataElaboracao}</div>
            <div><strong>Versão:</strong> ${sp.versao}</div>
            <div><strong>Data Edição:</strong> ${sp.dataRevisao}</div>
            <div><strong>Status:</strong> <span class="bg-green-100 text-green-800 px-2 py-1 rounded">${sp.status}</span></div>
        </div>
    `;

    html += `<h2 class="text-xl font-bold mt-8 mb-2">Tabela de Donos do Sub Processo</h2>`;
    html += `<table class="min-w-full bg-white border mb-6"><thead class="bg-gray-200"><tr><th class="border px-4 py-2">Nome</th><th class="border px-4 py-2">Email</th></tr></thead><tbody>`;
    sp.donos.forEach(d => html += `<tr><td class="border px-4 py-2">${d.nome}</td><td class="border px-4 py-2">${d.email}</td></tr>`);
    html += `</tbody></table>`;

    html += `<h2 class="text-xl font-bold mt-8 mb-2">Tabela com a lista de documentos</h2>`;
    html += `<table class="min-w-full bg-white border mb-6"><thead class="bg-gray-200"><tr><th class="border px-4 py-2">Documento</th><th class="border px-4 py-2">Versão</th><th class="border px-4 py-2">Tipo</th></tr></thead><tbody>`;
    sp.documentosId.forEach(docId => {
        const doc = getItemById(docId);
        if(doc) html += `<tr><td class="border px-4 py-2">${doc.codigo} - ${doc.designacao}</td><td class="border px-4 py-2">${doc.versao}</td><td class="border px-4 py-2">${doc.tipo}</td></tr>`;
    });
    html += `</tbody></table>`;

    html += `<br><button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I1')">Voltar</button>`;
    return html;
}

function renderI8RevisaoSubProcesso() {
    const sp = getItemById(currentState.contextId);
    let html = `<h1 class="text-3xl font-bold mb-4">[I8] Edição de Sub processo</h1>`;
    html += `<div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">Processo Pai (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${sp.processoPaiId}" readonly></div>
            <div><label class="block font-bold">Código (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${sp.codigo}" readonly></div>
            <div><label class="block font-bold">Nome (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${sp.nome}" readonly></div>
            <div><label class="block font-bold">Objetivo (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${sp.objetivo}" readonly></div>
            <div><label class="block font-bold">Âmbito (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${sp.ambito}" readonly></div>
            <div><label class="block font-bold">Data de Elaboração (Imutável)</label><input type="date" class="border p-2 w-full bg-gray-100" value="${sp.dataElaboracao}" readonly></div>
            <div><label class="block font-bold">Versão</label><input type="text" class="border p-2 w-full" value="${sp.versao}"></div>
            <div><label class="block font-bold">Data de revisão da versão</label><input type="date" class="border p-2 w-full" value="${sp.dataRevisao || ''}"></div>
        </div>

        <div class="mb-4">
            <h2 class="font-bold text-lg mb-2">Tabela de Donos do Sub Processo</h2>
            <div class="flex gap-2 mb-2">
                <input type="text" placeholder="Email do dono" class="border p-2 flex-grow">
                <button class="bg-blue-600 text-white px-4 py-2 rounded">Adicionar</button>
            </div>
            <table class="w-full border text-left"><thead class="bg-gray-100"><tr><th class="p-2 border">Nome</th><th class="p-2 border">Email</th><th class="p-2 border">Ações</th></tr></thead><tbody>`;

            if (sp.donos && sp.donos.length > 0) {
                sp.donos.forEach(d => {
                    html += `<tr><td class="p-2 border">${d.nome}</td><td class="p-2 border">${d.email}</td><td class="p-2 border"><button class="text-red-600">Remover</button></td></tr>`;
                });
            } else {
                 html += `<tr><td class="p-2 border">Dono Exemplo</td><td class="p-2 border">dono@exemplo.com</td><td class="p-2 border"><button class="text-red-600">Remover</button></td></tr>`;
            }

    html += `</tbody></table>
        </div>

        <div class="mb-4">
            <h2 class="font-bold text-lg mb-2">Tabela com a lista de documentos</h2>
            <table class="w-full border text-left"><thead class="bg-gray-100"><tr><th class="p-2 border">Código do documento</th><th class="p-2 border">Designação</th><th class="p-2 border">Versão</th><th class="p-2 border">Data de elaboração</th><th class="p-2 border">Tipo</th><th class="p-2 border">Ações</th></tr></thead><tbody>`;

            // Mock documents
            html += `<tr><td class="p-2 border">DOC-001</td><td class="p-2 border">Documento Mock</td><td class="p-2 border">1.0</td><td class="p-2 border">2023-10-01</td><td class="p-2 border">Instrumento</td><td class="p-2 border">
                <button class="bg-blue-500 text-white px-2 py-1 rounded mr-1">Detalhe</button>
                <button class="bg-yellow-500 text-white px-2 py-1 rounded mr-1">Editar</button>
                <button class="bg-orange-500 text-white px-2 py-1 rounded mr-1">Desativar</button>
                <button class="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
            </td></tr>`;

    html += `</tbody></table>
        </div>

        <div class="flex gap-2 mt-6">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="guardarSubProcesso('rascunho', '${sp.id}')">Guardar como Rascunho</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="guardarSubProcesso('publicar', '${sp.id}')">Guardar e Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I7', '${sp.id}')">Voltar</button>
        </div>
    </div>`;
    return html;
}

function renderI9ListaDocumentos() {
    let html = `<div class="flex justify-between items-center mb-4">
                    <h1 class="text-3xl font-bold">[I9] Lista de Documentos</h1>
                    <button class="bg-green-600 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I10')">Adicionar Documento</button>
                </div>`;
    html += `<div class="mb-4 flex gap-2">
                <input type="text" placeholder="Pesquisa por Processo Pai, Código, Designação..." class="border p-2 rounded w-1/2">
                <button class="bg-blue-600 text-white px-4 py-2 rounded">Pesquisar</button>
             </div>`;
    html += `<table class="min-w-full bg-white border"><thead class="bg-gray-200"><tr><th class="border px-4 py-2">Código</th><th class="border px-4 py-2">Designação</th><th class="border px-4 py-2">Tipo</th><th class="border px-4 py-2">Ações</th></tr></thead><tbody>`;
    mockData.documentos.forEach(doc => {
        if(doc.status === 'Publicado') {
            html += `<tr><td class="border px-4 py-2">${doc.codigo}</td><td class="border px-4 py-2">${doc.designacao}</td><td class="border px-4 py-2">${doc.tipo}</td><td class="border px-4 py-2"><button class="bg-blue-500 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I11', '${doc.id}')">Detalhe</button><button class="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I12', '${doc.id}')">Editar</button><button class="bg-red-500 text-white px-3 py-1 rounded" onclick="desativarDocumento('${doc.id}')">Desativar</button></td></tr>`;
        }
    });
    html += `</tbody></table><br><button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I1')">Voltar para Home</button>`;
    return html;
}

function renderI10CriacaoDocumento() {
    let html = `<h1 class="text-3xl font-bold mb-4">[I10] Criação de Documento</h1>`;
    html += `<div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">Processo/Sub Processo Associado</label><select class="border p-2 w-full"><option>PROC-001</option></select></div>
            <div><label class="block font-bold">Código</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Designação</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Versão</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Data de Elaboração</label><input type="date" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Data de revisão da versão</label><input type="date" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Tipo</label>
                <select class="border p-2 w-full">
                    <option>Instrumento</option><option>Regulamento</option><option>Orientação</option><option>Impresso</option>
                </select>
            </div>
            <div><label class="block font-bold">Upload Ficheiro</label><input type="file" class="border p-2 w-full"></div>
        </div>
        <div class="mb-4">
            <h2 class="font-bold text-lg mb-2">Tabela de Donos do Documento</h2>
            <div class="flex gap-2 mb-2">
                <input type="text" placeholder="Email do dono" class="border p-2 flex-grow">
                <button class="bg-blue-600 text-white px-4 py-2 rounded">Adicionar</button>
            </div>
            <table class="w-full border text-left"><thead class="bg-gray-100"><tr><th class="p-2 border">Nome</th><th class="p-2 border">Email</th><th class="p-2 border">Ações</th></tr></thead><tbody><tr><td class="p-2 border">Atual Utilizador</td><td class="p-2 border">user@empresa.com</td><td class="p-2 border"><button class="text-red-600">Remover</button></td></tr></tbody></table>
        </div>
        <div class="flex gap-2 mt-6">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="guardarDocumento('rascunho')">Guardar como Rascunho</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="guardarDocumento('publicar')">Guardar e Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I9')">Voltar</button>
        </div>
    </div>`;
    return html;
}

function renderI11DetalheDocumentoAtivo() {
    const doc = getItemById(currentState.contextId);
    if(!doc) return `Documento não encontrado. <button onclick="navigateTo('I1')">Voltar</button>`;

    let html = `<div class="mb-4 flex justify-between items-center">
                    <h1 class="text-3xl font-bold">[I11] Detalhe de Documento (Ativo)</h1>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow" onclick="alert('Funcionalidade Editar mockada')">Editar</button>
                </div>`;

    html += `
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div><strong>Processo/Sub Processo Associado:</strong> P1-V2 (Mock)</div>
            <div><strong>Código:</strong> ${doc.codigo}</div>
            <div><strong>Designação:</strong> ${doc.designacao}</div>
            <div><strong>Versão:</strong> ${doc.versao}</div>
            <div><strong>Data Elaboração:</strong> ${doc.dataElaboracao}</div>
            <div><strong>Data Edição:</strong> ${doc.dataRevisao}</div>
            <div><strong>Tipo:</strong> ${doc.tipo}</div>
            <div><strong>Status:</strong> <span class="bg-green-100 text-green-800 px-2 py-1 rounded">${doc.status}</span></div>
        </div>
    `;

    html += `<h2 class="text-xl font-bold mt-8 mb-2">Tabela de Donos do Documento</h2>`;
    html += `<table class="min-w-full bg-white border mb-6"><thead class="bg-gray-200"><tr><th class="border px-4 py-2">Nome</th><th class="border px-4 py-2">Email</th></tr></thead><tbody>`;
    doc.donos.forEach(d => html += `<tr><td class="border px-4 py-2">${d.nome}</td><td class="border px-4 py-2">${d.email}</td></tr>`);
    html += `</tbody></table>`;

    html += `<div class="mb-6"><strong>Upload de Ficheiro:</strong> [Download Mock]</div>`;

    html += `<br><button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I1')">Voltar</button>`;
    return html;
}

function renderI12RevisaoDocumento() {
    const doc = getItemById(currentState.contextId);
    let html = `<h1 class="text-3xl font-bold mb-4">[I12] Edição de Documento</h1>`;
    html += `<div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">Processo/Sub processo Associado (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="P1-V2 (Mock)" readonly></div>
            <div><label class="block font-bold">Código (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${doc.codigo}" readonly></div>
            <div><label class="block font-bold">Designação (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${doc.designacao}" readonly></div>
            <div><label class="block font-bold">Data de Elaboração (Imutável)</label><input type="date" class="border p-2 w-full bg-gray-100" value="${doc.dataElaboracao}" readonly></div>
            <div><label class="block font-bold">Versão</label><input type="text" class="border p-2 w-full" value="${doc.versao}"></div>
            <div><label class="block font-bold">Data de revisão da versão</label><input type="date" class="border p-2 w-full" value="${doc.dataRevisao}"></div>
            <div><label class="block font-bold">Tipo</label><select class="border p-2 w-full"><option selected>${doc.tipo}</option><option>Instrumento</option><option>Regulamento</option></select></div>
            <div><label class="block font-bold">Upload Novo Ficheiro</label><input type="file" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Download Atual</label><button class="bg-blue-600 text-white px-3 py-1 mt-2 rounded">Download</button></div>
        </div>
        <div class="mb-4">
            <h2 class="font-bold text-lg mb-2">Tabela de Donos do Documento</h2>
            <div class="flex gap-2 mb-2">
                <input type="text" placeholder="Email do dono" class="border p-2 flex-grow">
                <button class="bg-blue-600 text-white px-4 py-2 rounded">Adicionar</button>
            </div>
            <table class="w-full border text-left"><thead class="bg-gray-100"><tr><th class="p-2 border">Nome</th><th class="p-2 border">Email</th><th class="p-2 border">Ações</th></tr></thead><tbody><tr><td class="p-2 border">Atual Utilizador</td><td class="p-2 border">user@empresa.com</td><td class="p-2 border"><button class="text-red-600">Remover</button></td></tr></tbody></table>
        </div>
        <div class="flex gap-2 mt-6">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="guardarDocumento('rascunho', '${doc.id}')">Guardar como Rascunho</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="guardarDocumento('publicar', '${doc.id}')">Guardar e Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I11', '${doc.id}')">Voltar</button>
        </div>
    </div>`;
    return html;
}

function renderI14DetalheHistoricoSubProcesso() {
    const sp = getItemById(currentState.contextId);
    if(!sp) return `Sub processo não encontrado. <button onclick="navigateTo('I1')">Voltar</button>`;

    let html = `<div class="mb-4 border-b pb-2 flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-red-800">[I14] Detalhe Histórico / Rascunho de Sub processo (Read-Only)</h1>
                        <p class="text-sm text-red-600 font-semibold mt-1">Modo de observação.</p>
                    </div>
                    ${sp.status === 'Rascunho' ? `<button class="bg-green-600 text-white px-4 py-2 rounded" onclick="guardarSubProcesso('publicar', '${sp.id}')">Publicar</button>` : ''}
                </div>`;

    html += `
        <div class="grid grid-cols-2 gap-4 mb-6 opacity-75">
            <div><strong>Processo Pai:</strong> ${sp.processoPaiId}</div>
            <div><strong>Código:</strong> ${sp.codigo}</div>
            <div><strong>Nome:</strong> ${sp.nome}</div>
            <div><strong>Objetivo:</strong> ${sp.objetivo}</div>
            <div><strong>Âmbito:</strong> ${sp.ambito}</div>
            <div><strong>Data Elaboração:</strong> ${sp.dataElaboracao}</div>
            <div><strong>Versão:</strong> ${sp.versao}</div>
            <div><strong>Data Edição:</strong> ${sp.dataRevisao}</div>
            <div><strong>Status:</strong> <span class="bg-red-100 text-red-800 px-2 py-1 rounded">${sp.status}</span></div>
        </div>
    `;

    html += `<h2 class="text-xl font-bold mt-8 mb-2">Tabela de Donos do Sub Processo</h2>`;
    html += `<table class="min-w-full bg-white border mb-6"><thead class="bg-gray-200"><tr><th class="border px-4 py-2">Nome</th><th class="border px-4 py-2">Email</th></tr></thead><tbody>`;
    sp.donos.forEach(d => html += `<tr><td class="border px-4 py-2">${d.nome}</td><td class="border px-4 py-2">${d.email}</td></tr>`);
    html += `</tbody></table>`;

    html += `<h2 class="text-xl font-bold mt-8 mb-2">Tabela com a lista de documentos</h2>`;
    html += `<table class="min-w-full bg-white border mb-6"><thead class="bg-gray-200"><tr><th class="border px-4 py-2">Documento</th><th class="border px-4 py-2">Versão</th><th class="border px-4 py-2">Tipo</th><th class="border px-4 py-2">Ação</th></tr></thead><tbody>`;
    sp.documentosId.forEach(docId => {
        const doc = getItemById(docId);
        if(doc) {
            html += `<tr class="${doc.status === 'historico' ? 'historical-row' : ''}">
                        <td class="border px-4 py-2">${doc.codigo} - ${doc.designacao}</td>
                        <td class="border px-4 py-2">${doc.versao}</td>
                        <td class="border px-4 py-2">${doc.tipo}</td>
                        <td class="border px-4 py-2">
                            <button class="bg-blue-600 text-white px-3 py-1 rounded" onclick="handleIntelligentNavigation('${doc.id}')">Detalhe (Contextual)</button>
                        </td>
                     </tr>`;
        }
    });
    html += `</tbody></table>`;

    html += `<br><button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I1')">Voltar</button>`;
    return html;
}

function renderI15DetalheHistoricoDocumento() {
    const doc = getItemById(currentState.contextId);
    if(!doc) return `Documento não encontrado. <button onclick="navigateTo('I1')">Voltar</button>`;

    let html = `<div class="mb-4 border-b pb-2 flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-red-800">[I15] Detalhe Histórico / Rascunho de Documento (Read-Only)</h1>
                        <p class="text-sm text-red-600 font-semibold mt-1">Modo de observação.</p>
                    </div>
                    ${doc.status === 'Rascunho' ? `<button class="bg-green-600 text-white px-4 py-2 rounded" onclick="guardarDocumento('publicar', '${doc.id}')">Publicar</button>` : ''}
                </div>`;

    html += `
        <div class="grid grid-cols-2 gap-4 mb-6 opacity-75">
            <div><strong>Processo/Sub Processo Associado:</strong> P1-V1 (Mock)</div>
            <div><strong>Código:</strong> ${doc.codigo}</div>
            <div><strong>Designação:</strong> ${doc.designacao}</div>
            <div><strong>Versão:</strong> ${doc.versao}</div>
            <div><strong>Data Elaboração:</strong> ${doc.dataElaboracao}</div>
            <div><strong>Data Edição:</strong> ${doc.dataRevisao}</div>
            <div><strong>Tipo:</strong> ${doc.tipo}</div>
            <div><strong>Status:</strong> <span class="bg-red-100 text-red-800 px-2 py-1 rounded">${doc.status}</span></div>
        </div>
    `;

    html += `<h2 class="text-xl font-bold mt-8 mb-2">Tabela de Donos do Documento</h2>`;
    html += `<table class="min-w-full bg-white border mb-6"><thead class="bg-gray-200"><tr><th class="border px-4 py-2">Nome</th><th class="border px-4 py-2">Email</th></tr></thead><tbody>`;
    doc.donos.forEach(d => html += `<tr><td class="border px-4 py-2">${d.nome}</td><td class="border px-4 py-2">${d.email}</td></tr>`);
    html += `</tbody></table>`;

    html += `<div class="mb-6"><strong>Download do Ficheiro Histórico:</strong> <button class="bg-green-600 text-white px-4 py-2 rounded">Download</button></div>`;

    html += `<br><button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I1')">Voltar</button>`;
    return html;
}

function renderI13DetalheProcessoHistorico() {
    const p = getItemById(currentState.contextId);
    if(!p) return `Processo não encontrado. <button onclick="navigateTo('I1')">Voltar</button>`;

    let html = `<div class="mb-4 border-b pb-2 flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-red-800">[I13] Detalhe Histórico / Rascunho de Processo (Read-Only)</h1>
                        <p class="text-sm text-red-600 font-semibold mt-1">Modo de observação. Não é permitida edição.</p>
                    </div>
                    ${p.status === 'Rascunho' ? `<button class="bg-green-600 text-white px-4 py-2 rounded" onclick="guardarProcesso('publicar', '${p.id}')">Publicar</button>` : ''}
                </div>`;

    html += `
        <div class="grid grid-cols-2 gap-4 mb-6 opacity-75">
            <div><strong>Código:</strong> ${p.codigo}</div>
            <div><strong>Nome:</strong> ${p.nome}</div>
            <div><strong>Objetivo:</strong> ${p.objetivo}</div>
            <div><strong>Âmbito:</strong> ${p.ambito}</div>
            <div><strong>Data de Elaboração:</strong> ${p.dataElaboracao}</div>
            <div><strong>Data de Edição:</strong> ${p.dataRevisao}</div>
            <div><strong>Versão:</strong> ${p.versao}</div>
            <div><strong>Status:</strong> <span class="bg-red-100 text-red-800 px-2 py-1 rounded">${p.status}</span></div>
        </div>
    `;

    html += `<h2 class="text-xl font-bold mt-8 mb-2">Tabela de Donos do Processo</h2>`;
    html += `<table class="min-w-full bg-white border mb-6"><thead class="bg-gray-200"><tr><th class="border px-4 py-2">Nome</th><th class="border px-4 py-2">Email</th></tr></thead><tbody>`;
    p.donos.forEach(d => html += `<tr><td class="border px-4 py-2">${d.nome}</td><td class="border px-4 py-2">${d.email}</td></tr>`);
    html += `</tbody></table>`;

    html += `<h2 class="text-xl font-bold mt-8 mb-2">Sub processos Associados a esta Versão</h2>`;
    html += `<table class="min-w-full bg-white border mb-6"><thead class="bg-gray-200"><tr><th class="border px-4 py-2">Sub Processo</th><th class="border px-4 py-2">Versão</th><th class="border px-4 py-2">Data Elaboração</th><th class="border px-4 py-2">Ação</th></tr></thead><tbody>`;
    p.subProcessosId.forEach(spId => {
        const sp = getItemById(spId);
        if(sp) {
            html += `<tr class="${sp.status === 'Inativo' ? 'historical-row' : ''}">
                        <td class="border px-4 py-2">${sp.codigo} - ${sp.nome}</td>
                        <td class="border px-4 py-2">${sp.versao}</td>
                        <td class="border px-4 py-2">${sp.dataElaboracao}</td>
                        <td class="border px-4 py-2">
                            <button class="bg-blue-600 text-white px-3 py-1 rounded" onclick="handleIntelligentNavigation('${sp.id}')">Detalhe (Contextual)</button>
                        </td>
                     </tr>`;
        }
    });
    html += `</tbody></table>`;

    // List historical associated documents
    html += `<h2 class="text-xl font-bold mt-8 mb-2">Documentos Associados a esta Versão</h2>`;
    html += `<table class="min-w-full bg-white border">
                <thead class="bg-gray-200">
                    <tr><th class="border px-4 py-2">Documento</th><th class="border px-4 py-2">Versão</th><th class="border px-4 py-2">Status do Doc.</th><th class="border px-4 py-2">Ação</th></tr>
                </thead>
                <tbody>`;

    p.documentosId.forEach(docId => {
        const doc = getItemById(docId);
        if(doc) {
            html += `<tr class="${doc.status === 'Inativo' ? 'historical-row' : ''}">
                        <td class="border px-4 py-2">${doc.codigo} - ${doc.designacao}</td>
                        <td class="border px-4 py-2">${doc.versao}</td>
                        <td class="border px-4 py-2">${doc.status}</td>
                        <td class="border px-4 py-2">
                            <button class="bg-blue-600 text-white px-3 py-1 rounded" onclick="handleIntelligentNavigation('${doc.id}')">Detalhe (Contextual)</button>
                        </td>
                     </tr>`;
        }
    });
    html += `</tbody></table>`;

    html += `<br><button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I3', 'P1-V2')">Voltar para Ativo</button>`;
    return html;
}

// Initial render
window.onload = render;
