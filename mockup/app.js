// mockData: Represents our database
const mockData = {
    processos: [
        {
            id: 'P1-V2',
            codigo: 'PROC-001',
            nome: 'Gestão de Qualidade',
            objetivo: 'Garantir padrões de qualidade',
            ambito: 'Toda a empresa',
            dataElaboracao: '2026-01-10',
            dataRevisao: '2026-10-15',
            versao: '2.0',
            status: 'Publicado',
            donos: [{ nome: 'João Silva', email: 'joao@empresa.com' }],
            // Active associations
            subProcessosId: ['SP1-V1'],
            documentosId: ['DOC1-V2', 'DOC2-V1']
        },
        {
            id: 'P1-V1',
            codigo: 'PROC-001',
            nome: 'Gestão de Qualidade',
            objetivo: 'Garantir padrões mínimos de qualidade',
            ambito: 'Toda a empresa',
            dataElaboracao: '2025-01-10',
            dataRevisao: '2025-01-10',
            versao: '1.0',
            status: 'Inativo',
            donos: [{ nome: 'João Silva', email: 'joao@empresa.com' }],
            // Historical associations (Snapshot of the time)
            subProcessosId: ['SP1-V1'], // Notice SP1-V1 is still the active version today
            documentosId: ['DOC1-V1', 'DOC2-V1'] // DOC1-V1 is historical, DOC2-V1 is active
        },
        {
            id: 'P2-DRAFT',
            codigo: 'PROC-002',
            nome: 'Gestão de Risco',
            objetivo: 'Identificar riscos',
            ambito: 'Toda a empresa',
            dataElaboracao: '2026-11-01',
            dataRevisao: '2026-11-01',
            versao: '1.0',
            status: 'Rascunho',
            donos: [{ nome: 'Maria Silva', email: 'maria@empresa.com' }],
            subProcessosId: [],
            documentosId: []
        },
        {
            id: 'P3-V1',
            codigo: 'PROC-003',
            nome: 'Sem Dependencias',
            objetivo: 'Teste Eliminacao',
            ambito: 'RH',
            dataElaboracao: '2026-11-01',
            dataRevisao: '2026-11-01',
            versao: '1.0',
            status: 'Publicado',
            donos: [{ nome: 'Teste', email: 'teste@empresa.com' }],
            subProcessosId: [],
            documentosId: []
        }
    ],
    subProcessos: [
        {
            id: 'SP1-V1',
            processoPaiId: 'PROC-001',
            codigo: 'SPROC-001',
            nome: 'Auditoria Interna',
            objetivo: 'Auditar processos',
            ambito: 'Departamento de Qualidade',
            dataElaboracao: '2025-02-15',
            dataRevisao: '2025-02-15',
            versao: '1.0',
            status: 'Publicado',
            donos: [{ nome: 'Ana Costa', email: 'ana@empresa.com' }],
            documentosId: ['DOC3-V1']
        },
        {
            id: 'SP2-DRAFT',
            processoPaiId: 'PROC-001',
            codigo: 'SPROC-002',
            nome: 'Auditoria Externa',
            objetivo: 'Auditar por terceiros',
            ambito: 'Departamento de Qualidade',
            dataElaboracao: '2026-11-01',
            dataRevisao: '2026-11-01',
            versao: '1.0',
            status: 'Rascunho',
            donos: [{ nome: 'Ana Costa', email: 'ana@empresa.com' }],
            documentosId: []
        }
    ],
    documentos: [
        {
            id: 'DOC1-V2',
            codigo: 'DOC-001',
            designacao: 'Manual de Qualidade',
            tipo: 'Regulamento',
            dataElaboracao: '2025-01-15',
            dataRevisao: '2026-10-10',
            versao: '2.0',
            status: 'Publicado',
            donos: [{ nome: 'Carlos Mendes', email: 'carlos@empresa.com' }]
        },
        {
            id: 'DOC1-V1',
            codigo: 'DOC-001',
            designacao: 'Manual de Qualidade Básico',
            tipo: 'Regulamento',
            dataElaboracao: '2025-01-15',
            dataRevisao: '2025-01-15',
            versao: '1.0',
            status: 'Inativo',
            donos: [{ nome: 'Carlos Mendes', email: 'carlos@empresa.com' }]
        },
        {
            id: 'DOC2-V1',
            codigo: 'DOC-002',
            designacao: 'Formulário de Auditoria',
            tipo: 'Impresso',
            dataElaboracao: '2025-03-01',
            dataRevisao: '2025-03-01',
            versao: '1.0',
            status: 'Publicado',
            donos: [{ nome: 'Ana Costa', email: 'ana@empresa.com' }]
        },
        {
            id: 'DOC3-V1',
            codigo: 'DOC-003',
            designacao: 'Guia de Auditoria Interna',
            tipo: 'Orientação',
            dataElaboracao: '2025-04-01',
            dataRevisao: '2025-04-01',
            versao: '1.0',
            status: 'Publicado',
            donos: [{ nome: 'Ana Costa', email: 'ana@empresa.com' }]
        },
        {
            id: 'DOC4-DRAFT',
            codigo: 'DOC-004',
            designacao: 'Novo Regulamento de Qualidade',
            tipo: 'Regulamento',
            dataElaboracao: '2026-11-01',
            dataRevisao: '2026-11-01',
            versao: '1.0',
            status: 'Rascunho',
            donos: [{ nome: 'Carlos Mendes', email: 'carlos@empresa.com' }]
        }
    ]
};

// Application State
let currentState = {
    view: 'I1', // Current Interface
    contextId: null // ID of the item being viewed/edited
};

// Helper: Get item by ID from any collection
function getItemById(id) {
    const p = mockData.processos.find(x => x.id === id);
    if (p) return { ...p, _type: 'processo' };
    const sp = mockData.subProcessos.find(x => x.id === id);
    if (sp) return { ...sp, _type: 'subProcesso' };
    const doc = mockData.documentos.find(x => x.id === id);
    if (doc) return { ...doc, _type: 'documento' };
    return null;
}


// Toggle Interface Tags Logic
let showInterfaceTags = true;
function toggleInterfaceTags() {
    showInterfaceTags = !showInterfaceTags;
    render();
}

// ==========================================
// BUSINESS LOGIC
// ==========================================

// --- Lógica de Desativação em Cascata ---
// Ao clicar em "Desativar" num Processo ativo, a função percorre os dados e altera o estado
// para "Inativo" desse Processo, de todos os seus Documentos, de todos os seus Sub processos
// e dos Documentos desses Sub processos.
function desativarProcesso(processId) {
    const processo = mockData.processos.find(x => x.id === processId);
    if (!processo || processo.status !== 'Publicado') return;

    // 1. Desativar o Processo
    processo.status = 'Inativo';

    // 2. Desativar todos os Documentos do Processo
    processo.documentosId.forEach(docId => {
        const doc = mockData.documentos.find(x => x.id === docId);
        if (doc && doc.status === 'Publicado') doc.status = 'Inativo';
    });

    // 3. Desativar todos os Sub Processos e seus Documentos
    processo.subProcessosId.forEach(spId => {
        const sp = mockData.subProcessos.find(x => x.id === spId);
        if (sp && sp.status === 'Publicado') {
            sp.status = 'Inativo';
            // Desativar Documentos do Sub Processo
            sp.documentosId.forEach(docId => {
                const doc = mockData.documentos.find(x => x.id === docId);
                if (doc && doc.status === 'Publicado') doc.status = 'Inativo';
            });
        }
    });

    alert('Processo e todas as suas dependências (Sub processos e Documentos) foram desativados em cascata.');
    render();
}

function desativarSubProcesso(spId) {
    const sp = mockData.subProcessos.find(x => x.id === spId);
    if (!sp || sp.status !== 'Publicado') return;

    sp.status = 'Inativo';
    sp.documentosId.forEach(docId => {
        const doc = mockData.documentos.find(x => x.id === docId);
        if (doc && doc.status === 'Publicado') doc.status = 'Inativo';
    });

    alert('Sub processo e os seus Documentos foram desativados em cascata.');
    render();
}

function desativarDocumento(docId) {
    const doc = mockData.documentos.find(x => x.id === docId);
    if (!doc || doc.status !== 'Publicado') return;

    doc.status = 'Inativo';
    alert('Documento desativado.');
    render();
}

// --- Lógica de Validação de Eliminação (Condicional) ---
// Valida dependências. Um Processo com Sub processos/Documentos associados não pode ser eliminado.
// O mesmo se aplica a Sub processos com Documentos.
function eliminarProcesso(processId) {
    const processo = mockData.processos.find(x => x.id === processId);
    if (!processo) return;

    if (processo.subProcessosId.length > 0 || processo.documentosId.length > 0) {
        alert('ERRO: Não é possível eliminar este Processo pois possui Sub processos ou Documentos associados.');
        return;
    }

    mockData.processos = mockData.processos.filter(x => x.id !== processId);
    alert('Processo eliminado com sucesso.');
    render();
}

function eliminarSubProcesso(spId) {
    const sp = mockData.subProcessos.find(x => x.id === spId);
    if (!sp) return;

    if (sp.documentosId.length > 0) {
        alert('ERRO: Não é possível eliminar este Sub processo pois possui Documentos associados.');
        return;
    }

    mockData.subProcessos = mockData.subProcessos.filter(x => x.id !== spId);
    alert('Sub processo eliminado com sucesso.');
    render();
}

function eliminarDocumento(docId) {
    mockData.documentos = mockData.documentos.filter(x => x.id !== docId);

    // Remover referências nos Processos e Sub Processos (Mock Data Cleanup)
    mockData.processos.forEach(p => {
        p.documentosId = p.documentosId.filter(id => id !== docId);
    });
    mockData.subProcessos.forEach(sp => {
        sp.documentosId = sp.documentosId.filter(id => id !== docId);
    });

    alert('Documento eliminado com sucesso.');
    render();
}

// --- Lógica de Gravação e Publicação ---
// "Guardar como Rascunho" e "Guardar e Publicar"
function guardarProcesso(actionType, id = null) {
    let processo = mockData.processos.find(x => x.id === id);
    let isNew = false;
    let isDuplicatingActive = false;

    // If it's an existing active record and we're saving as draft, duplicate it
    if (processo && processo.status === 'Publicado' && actionType === 'rascunho') {
        const originalProcesso = processo;
        processo = JSON.parse(JSON.stringify(originalProcesso));
        processo.id = 'P' + Date.now();
        mockData.processos.push(processo);
        isDuplicatingActive = true;
    } else if (!processo) {
        // Mock de Criação
        isNew = true;
        processo = {
            id: 'P' + Date.now(),
            codigo: 'PROC-MOCK-' + Date.now().toString().slice(-4),
            nome: 'Processo Mockado ' + Date.now().toString().slice(-4),
            objetivo: 'Objetivo mockado',
            ambito: 'Âmbito mockado',
            dataElaboracao: '2026-11-01',
            dataRevisao: '2026-11-01',
            versao: '1.0',
            donos: [{ nome: 'User', email: 'user@empresa.com' }],
            subProcessosId: [],
            documentosId: []
        };
        mockData.processos.push(processo);
    }

    if (actionType === 'rascunho') {
        processo.status = 'Rascunho';
        if (isDuplicatingActive) {
            alert('Guardado como Rascunho com sucesso! Foi criada uma réplica em Rascunho mantendo a versão original Ativa.');
        } else {
            alert('Guardado como Rascunho com sucesso! Este registo está agora disponível nas listas principais.');
        }
        navigateTo('I1');
    } else if (actionType === 'publicar') {
        processo.status = 'Publicado';

        // Regra de Ouro: Desativar a versão anteriormente ativa do mesmo código
        mockData.processos.forEach(p => {
            if (p.codigo === processo.codigo && p.id !== processo.id && p.status === 'Publicado') {
                p.status = 'Inativo';
            }
        });

        alert('Publicado com sucesso! A versão anterior (se existente) foi passada a Inativa.');
        navigateTo('I1');
    }
}

function guardarSubProcesso(actionType, id = null) {
    let sp = mockData.subProcessos.find(x => x.id === id);
    let isDuplicatingActive = false;

    if (sp && sp.status === 'Publicado' && actionType === 'rascunho') {
        const originalSp = sp;
        sp = JSON.parse(JSON.stringify(originalSp));
        sp.id = 'SP' + Date.now();
        mockData.subProcessos.push(sp);
        isDuplicatingActive = true;
    } else if (!sp) {
        sp = {
            id: 'SP' + Date.now(),
            processoPaiId: 'PROC-001',
            codigo: 'SPROC-MOCK-' + Date.now().toString().slice(-4),
            nome: 'Sub processo Mockado',
            objetivo: 'Mock',
            ambito: 'Mock',
            dataElaboracao: '2026-11-01',
            dataRevisao: '2026-11-01',
            versao: '1.0',
            donos: [],
            documentosId: []
        };
        mockData.subProcessos.push(sp);
    }

    if (actionType === 'rascunho') {
        sp.status = 'Rascunho';
        if (isDuplicatingActive) {
            alert('Guardado como Rascunho com sucesso! Foi criada uma réplica em Rascunho mantendo a versão original Ativa.');
        } else {
            alert('Guardado como Rascunho com sucesso!');
        }
        navigateTo('I5');
    } else if (actionType === 'publicar') {
        sp.status = 'Publicado';

        mockData.subProcessos.forEach(s => {
            if (s.codigo === sp.codigo && s.id !== sp.id && s.status === 'Publicado') {
                s.status = 'Inativo';
            }
        });

        alert('Publicado com sucesso!');
        navigateTo('I5');
    }
}

function guardarDocumento(actionType, id = null) {
    let doc = mockData.documentos.find(x => x.id === id);
    let isDuplicatingActive = false;

    if (doc && doc.status === 'Publicado' && actionType === 'rascunho') {
        const originalDoc = doc;
        doc = JSON.parse(JSON.stringify(originalDoc));
        doc.id = 'DOC' + Date.now();
        mockData.documentos.push(doc);
        isDuplicatingActive = true;
    } else if (!doc) {
        doc = {
            id: 'DOC' + Date.now(),
            codigo: 'DOC-MOCK-' + Date.now().toString().slice(-4),
            designacao: 'Documento Mockado',
            tipo: 'Regulamento',
            dataElaboracao: '2026-11-01',
            dataRevisao: '2026-11-01',
            versao: '1.0',
            donos: []
        };
        mockData.documentos.push(doc);
    }

    if (actionType === 'rascunho') {
        doc.status = 'Rascunho';
        if (isDuplicatingActive) {
            alert('Guardado como Rascunho com sucesso! Foi criada uma réplica em Rascunho mantendo a versão original Ativa.');
        } else {
            alert('Guardado como Rascunho com sucesso!');
        }
        navigateTo('I9');
    } else if (actionType === 'publicar') {
        doc.status = 'Publicado';

        mockData.documentos.forEach(d => {
            if (d.codigo === doc.codigo && d.id !== doc.id && d.status === 'Publicado') {
                d.status = 'Inativo';
            }
        });

        alert('Publicado com sucesso!');
        navigateTo('I9');
    }
}

// Action "Editar"
function novaRevisaoProcesso(processId) {
    const pIndex = mockData.processos.findIndex(x => x.id === processId);
    if (pIndex === -1) return;

    const currentAtivo = mockData.processos[pIndex];

    // Criar nova versão em Rascunho, baseada na versão atual
    const novoRascunho = JSON.parse(JSON.stringify(currentAtivo)); // Deep clone
    novoRascunho.id = 'P' + Date.now(); // Generate unique ID
    novoRascunho.status = 'Rascunho';
    novoRascunho.versao = (parseFloat(novoRascunho.versao) + 1).toFixed(1);

    mockData.processos.push(novoRascunho);

    alert(`Rascunho criado com sucesso! O sistema criou a versão ${novoRascunho.versao} em modo Rascunho [I4], mantendo a versão ${currentAtivo.versao} Ativa por agora.`);

    navigateTo('I4', novoRascunho.id);
}

// Navegação Contextual e Inteligente
function handleIntelligentNavigation(itemId) {
    const item = getItemById(itemId);
    if (!item) return;

    // Cenário A: Se a versão for histórica/rascunho, encaminha para a interface de observação histórica respectiva.
    // Cenário B: Se a versão for ativa, encaminha para a interface de detalhe normal (versão ativa).
    if (item._type === 'subProcesso') {
        if (item.status === 'Inativo' || item.status === 'Rascunho') {
            navigateTo('I13', itemId); // [I13] Detalhe Histórico de Sub processo
        } else {
            navigateTo('I7', itemId);  // [I7] Detalhe de Sub processo (Ativo)
        }
    } else if (item._type === 'documento') {
        if (item.status === 'Inativo' || item.status === 'Rascunho') {
            navigateTo('I14', itemId); // [I14] Detalhe Histórico de Documento
        } else {
            navigateTo('I11', itemId); // [I11] Detalhe de Documento (Ativo)
        }
    }
}

// Navigation System
function navigateTo(view, contextId = null) {
    currentState.view = view;
    currentState.contextId = contextId;
    render();
}

// Core Render Function
function render() {
    const app = document.getElementById('app');
    let htmlContent = '';

    switch (currentState.view) {
        case 'I1':
            htmlContent = renderI1ListaProcessos();
            break;
        case 'I2':
            htmlContent = renderI2CriacaoProcesso();
            break;
        case 'I3':
            htmlContent = renderI3DetalheProcessoAtivo();
            break;
        case 'I4':
            htmlContent = renderI4RevisaoProcesso();
            break;
        case 'I5':
            htmlContent = renderI5ListaSubProcessos();
            break;
        case 'I6':
            htmlContent = renderI6CriacaoSubProcesso();
            break;
        case 'I7':
            htmlContent = renderI7DetalheSubProcessoAtivo();
            break;
        case 'I8':
            htmlContent = renderI8RevisaoSubProcesso();
            break;
        case 'I9':
            htmlContent = renderI9ListaDocumentos();
            break;
        case 'I10':
            htmlContent = renderI10CriacaoEdicaoDocumento();
            break;
        case 'I11':
            htmlContent = renderI11DetalheDocumento();
            break;
        case 'I12':
            htmlContent = renderI12DetalheHistoricoProcesso();
            break;
        case 'I13':
            htmlContent = renderI13DetalheHistoricoSubProcesso();
            break;
        case 'I14':
            htmlContent = renderI14DetalheHistoricoDocumento();
            break;

        default:
            htmlContent = `<div><h1>404 Not Found</h1><button onclick="navigateTo('I1')">Go Home</button></div>`;
    }

    if (!showInterfaceTags) {
        // Regex to remove tags like [I1.BT01] or [I2]
        htmlContent = htmlContent.replace(/\[I[0-9]+(?:\.[A-Z0-9]+)*\]\s*/g, '');
    }

    app.innerHTML = htmlContent;
}

// ==========================================
// RENDERERS
// ==========================================

function renderI1ListaProcessos() {
    let html = `<div class="flex justify-between items-center mb-4">
                    <h1 class="text-3xl font-bold">[I1] Lista de Processos</h1>
                    <button class="bg-green-600 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I2')">[I1.BT02] Adicionar Processo</button>
                </div>`;

    html += `<div class="mb-4 flex gap-2">
                <input type="text" placeholder="Pesquisa (Código, Nome, Objetivo, Âmbito)" class="border p-2 rounded w-1/3" title="[I1.TXT01] Input Pesquisa">
                <button class="bg-blue-600 text-white px-4 py-2 rounded" title="[I1.BT01] Pesquisar">[I1.BT01] Pesquisar</button>
             </div>`;

    html += `<div class="mb-4">
                <label class="block text-sm font-bold mb-1">[I1.CHK01] Filtro de Estado</label>
                <div class="flex gap-4">
                    <label><input type="checkbox" value="Publicado"> Publicado</label>
                    <label><input type="checkbox" value="Rascunho"> Rascunho</label>
                    <label><input type="checkbox" value="Inativo"> Inativo</label>
                </div>
            </div>`;

    html += `<table class="min-w-full bg-white border">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Código</th>
                        <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Nome</th>
                        <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Versão</th>
                        <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Data de elaboração</th>
                        <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Estado</th>
                        <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Label de Registo + ID de registo</th>
                        <th class="border px-4 py-2">Ações</th>
                    </tr>
                </thead>
                <tbody>`;

    // Mostrar todos por omissão
    mockData.processos.forEach(p => {
            html += `<tr>
                <td class="border px-4 py-2">${p.codigo || ''}</td>
                <td class="border px-4 py-2">${p.nome || ''}</td>
                <td class="border px-4 py-2">${p.versao || ''}</td>
                <td class="border px-4 py-2">${p.dataElaboracao || ''}</td>
                <td class="border px-4 py-2"><span class="bg-gray-100 px-2 py-1 rounded">${p.status || ''}</span></td>
                <td class="border px-4 py-2">${p.labelRegisto ? p.labelRegisto + ' ' : ''}${p.id || ''}</td>
                <td class="border px-4 py-2">
                    <button class="bg-blue-500 text-white px-3 py-1 rounded mr-2 mb-1" onclick="navigateTo('I3', '${p.id}')">[I1.TB01.BT01] Detalhe</button>
                    <button class="bg-yellow-500 text-white px-3 py-1 rounded mr-2 mb-1" onclick="navigateTo('I4', '${p.id}')">[I1.TB01.BT02] Edição</button>
                    <button class="bg-gray-500 text-white px-3 py-1 rounded mr-2 mb-1" onclick="navigateTo('I5', '${p.id}')">[I1.TB01.BT03] Sub processos</button>
                    <button class="bg-indigo-500 text-white px-3 py-1 rounded mr-2 mb-1" onclick="navigateTo('I9', '${p.id}')">[I1.TB01.BT04] Documentos</button>
                    <button class="bg-orange-500 text-white px-3 py-1 rounded mr-2 mb-1" onclick="desativarProcesso('${p.id}')">[I1.TB01.BT05] Desativar</button>
                    <button class="bg-red-500 text-white px-3 py-1 rounded mb-1" onclick="eliminarProcesso('${p.id}')">[I1.TB01.BT06] Eliminar</button>
                </td>
            </tr>`;
    });

    html += `</tbody></table>`;
    return html;
}

function renderI2CriacaoProcesso() {
    let html = `<h1 class="text-3xl font-bold mb-4">[I2] Interface 2 – Criação de Processo</h1>`;
    html += `<div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">[I7.UPL01] Upload Logo</label><input type="file" accept="image/*" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.UPL02] Upload Banner</label><input type="file" accept="image/*" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.UPL03] Upload Ficheiro de Processo</label><input type="file" accept=".pdf" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.DWN01] Download Ficheiro de Processo</label><button class="border p-2 w-full bg-gray-100 text-gray-500 cursor-not-allowed" disabled>Sem ficheiro</button></div>
            <div><label class="block font-bold">[I2.TXT01] Label de Registo</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.TXT02] Código</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.TXT03] Nome</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.TXT04] Objetivo</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.TXT05] Âmbito</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.DT01] Data de Elaboração</label><input type="date" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.TXT06] Donos do Processo</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.TXT07] Versão</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.DT02] Data de revisão da versão</label><input type="date" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.TXT08] Riscos Relevantes</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.TXT09] Oportunidades</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.TXT10] Entradas</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.TXT11] Saídas</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.TXT12] Indicadores de Sucesso</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.TXT13] Partes Interessadas Externas</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.TXT14] Partes Interessadas Internas</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I2.TXT15] Referenciais</label><input type="text" class="border p-2 w-full"></div>
        </div>
        <div class="flex justify-end gap-2 mt-6 border-t pt-4">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="guardarProcesso('rascunho')">[I2.BT01] Guardar como Rascunho</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="guardarProcesso('publicar')">[I2.BT02] Guardar e Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I1')">[I2.BT03] Voltar</button>
        </div>
    </div>`;
    return html;
}

function renderI3DetalheProcessoAtivo() {
    const p = getItemById(currentState.contextId) || {};
    const headerTitle = `${p.status || 'Estado'} - ${p.labelRegisto || 'Label Registo'} - ${p.id || 'ID Registo'}`;

    let html = `
    <div class="mb-4">
        <h1 class="text-3xl font-bold mb-2">[I3] Interface 3 – Detalhe</h1>
        <h2 class="text-xl text-gray-600 font-semibold">${headerTitle}</h2>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-6 opacity-75 bg-white p-4 shadow rounded">
        <div><strong>[I3.UPL01] Upload Logo:</strong> <input type="file" disabled></div>
        <div><strong>[I3.UPL02] Upload Banner:</strong> <input type="file" disabled></div>
        <div><strong>[I3.DWN01] Download Ficheiro de Processo:</strong> <button class="text-blue-600 underline">Download PDF</button></div>
        <div><strong>[I3.TXT01] Label de Registo:</strong> ${p.labelRegisto || ''}</div>
        <div><strong>[I3.TXT02] ID do Registo:</strong> ${p.id || ''}</div>
        <div><strong>[I3.TXT03] Código:</strong> ${p.codigo || ''}</div>
        <div><strong>[I3.TXT04] Nome:</strong> ${p.nome || ''}</div>
        <div><strong>[I3.TXT05] Objetivo:</strong> ${p.objetivo || ''}</div>
        <div><strong>[I3.TXT06] Âmbito:</strong> ${p.ambito || ''}</div>
        <div><strong>[I3.DT01] Data de Elaboração:</strong> ${p.dataElaboracao || ''}</div>
        <div><strong>[I3.TXT07] Donos do Processo:</strong> ${p.donos ? p.donos.map(d=>d.nome).join(', ') : ''}</div>
        <div><strong>[I3.TXT08] Versão:</strong> ${p.versao || ''}</div>
        <div><strong>[I3.DT02] Data de revisão da versão:</strong> ${p.dataRevisao || ''}</div>
        <div><strong>[I3.TXT09] Estado:</strong> ${p.status || ''}</div>
        <div><strong>[I2.TXT10] Riscos Relevantes:</strong> ${p.riscos || ''}</div>
        <div><strong>[I2.TXT11] Oportunidades:</strong> ${p.oportunidades || ''}</div>
        <div><strong>[I2.TXT12] Entradas:</strong> ${p.entradas || ''}</div>
        <div><strong>[I2.TXT13] Saídas:</strong> ${p.saidas || ''}</div>
        <div><strong>[I2.TXT14] Indicadores de Sucesso:</strong> ${p.indicadoresSucesso || ''}</div>
        <div><strong>[I2.TXT15] Partes Interessadas Externas:</strong> ${p.partesInteressadasExternas || ''}</div>
        <div><strong>[I2.TXT16] Partes Interessadas Internas:</strong> ${p.partesInteressadasInternas || ''}</div>
        <div><strong>[I3.TXT17] Referenciais:</strong> ${p.referenciais || ''}</div>
    </div>

    <div class="mb-4">
        <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="navigateTo('I6', '${p.id}')">[I3.BT01] Adicionar sub processo</button>
    </div>
    <h2 class="text-xl font-bold mt-4 mb-2">[I3.TB02] Tabela com a lista de sub processos</h2>
    <table class="min-w-full bg-white border mb-6">
        <thead class="bg-gray-200">
            <tr>
                <th class="border px-4 py-2">Código do sub processo</th>
                <th class="border px-4 py-2">Nome</th>
                <th class="border px-4 py-2">Versão</th>
                <th class="border px-4 py-2">Data de elaboração</th>
                <th class="border px-4 py-2">Label do registo + ID do registo</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>`;
    if(p.subProcessosId) {
        p.subProcessosId.forEach(spId => {
            const sp = getItemById(spId);
            if(sp && sp.status === 'Publicado') {
                const spLabel = sp.labelRegisto ? sp.labelRegisto + ' - ' : '';
                html += `<tr>
                    <td class="border px-4 py-2">${sp.codigo}</td>
                    <td class="border px-4 py-2">${sp.nome}</td>
                    <td class="border px-4 py-2">${sp.versao}</td>
                    <td class="border px-4 py-2">${sp.dataElaboracao}</td>
                    <td class="border px-4 py-2">${spLabel}${sp.id}</td>
                    <td class="border px-4 py-2">
                        <button class="bg-blue-600 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I7', '${sp.id}')">[I3.TB02.BT01] Detalhe</button>
                        <button class="bg-yellow-500 text-white px-3 py-1 rounded" onclick="navigateTo('I8', '${sp.id}')">[I3.TB02.BT02] Editar</button>
                    </td>
                </tr>`;
            }
        });
    }
    html += `
        </tbody>
    </table>

    <div class="mb-4">
        <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="navigateTo('I10', '${p.id}')">[I3.BT02] Adicionar documentos</button>
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
                <th class="border px-4 py-2">Label do registo + Id do Registo</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>`;
    if(p.documentosId) {
        p.documentosId.forEach(docId => {
            const doc = getItemById(docId);
            if(doc && doc.status === 'Publicado') {
                const docLabel = doc.labelRegisto ? doc.labelRegisto + ' - ' : '';
                html += `<tr>
                    <td class="border px-4 py-2">${doc.codigo}</td>
                    <td class="border px-4 py-2">${doc.designacao}</td>
                    <td class="border px-4 py-2">${doc.versao}</td>
                    <td class="border px-4 py-2">${doc.dataElaboracao}</td>
                    <td class="border px-4 py-2">${doc.tipo || ''}</td>
                    <td class="border px-4 py-2">${docLabel}${doc.id}</td>
                    <td class="border px-4 py-2">
                        <button class="bg-blue-600 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I11', '${doc.id}')">[I3.TB03.BT01] Detalhe</button>
                        <button class="bg-yellow-500 text-white px-3 py-1 rounded" onclick="navigateTo('I10', '${doc.id}')">[I3.TB03.BT02] Editar</button>
                    </td>
                </tr>`;
            }
        });
    }
    html += `
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
                <th class="border px-4 py-2">Label do Registo + ID do Registo</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>`;

    const historico = mockData.processos
        .filter(x => x.codigo === p.codigo && x.id !== p.id)
        .sort((a,b) => new Date(b.dataRevisao) - new Date(a.dataRevisao));

    historico.forEach(h => {
        const hLabel = h.labelRegisto ? h.labelRegisto + ' - ' : '';
        html += `<tr>
            <td class="border px-4 py-2">${h.codigo}</td>
            <td class="border px-4 py-2">${h.nome}</td>
            <td class="border px-4 py-2">${h.versao}</td>
            <td class="border px-4 py-2">${h.dataRevisao}</td>
            <td class="border px-4 py-2">${h.status}</td>
            <td class="border px-4 py-2">${hLabel}${h.id}</td>
            <td class="border px-4 py-2">
                <button class="bg-gray-600 text-white px-3 py-1 rounded mr-1 mb-1" onclick="navigateTo('I12', '${h.id}')">[I3.TB04.BT01] Detalhe Histórico</button>
                <button class="bg-yellow-500 text-white px-3 py-1 rounded mr-1 mb-1" onclick="navigateTo('I4', '${h.id}')">[I3.TB04.BT02] Edição</button>
                ${(h.status === 'Rascunho' || h.status === 'Inativo') ? `<button class="bg-green-600 text-white px-3 py-1 rounded" onclick="guardarProcesso('publicar', '${h.id}')">[I3.TB04.BT03] Publicar</button>` : ''}
            </td>
        </tr>`;
    });

    html += `
        </tbody>
    </table>

    <div class="flex justify-end gap-2 mt-6 border-t pt-4">
        <button class="bg-blue-600 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I4', '${p.id}')">[I3.BT03] Edição</button>
        <button class="bg-orange-500 text-white px-4 py-2 rounded shadow" onclick="desativarProcesso('${p.id}')">[I3.BT04] Desativar</button>
        <button class="bg-red-500 text-white px-4 py-2 rounded shadow" onclick="eliminarProcesso('${p.id}')">[I3.BT05] Eliminar</button>
        <button class="bg-gray-500 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I1')">[I3.BT06] Voltar</button>
    </div>
    `;
    return html;
}

function renderI4RevisaoProcesso() {
    const p = getItemById(currentState.contextId) || {};
    const headerTitle = `${p.status || 'Estado'} - ${p.labelRegisto || 'Label Registo'} - ${p.id || 'ID Registo'}`;

    let html = `<div class="mb-4">
        <h1 class="text-3xl font-bold mb-2">[I4] Interface 4 – Edição</h1>
        <h2 class="text-xl text-gray-600 font-semibold">${headerTitle}</h2>
    </div>
    <div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">[I4.UPL01] Upload Logo</label><input type="file" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I4.UPL02] Upload Banner</label><input type="file" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I4.UPL03] Upload Ficheiro de Processo</label><input type="file" accept=".pdf" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I4.DWN01] Download Ficheiro de Processo</label><button class="text-blue-600 underline">Download PDF atual</button></div>
            <div><label class="block font-bold">[I4.TXT01] Label de Registo</label><input type="text" class="border p-2 w-full" value="${p.labelRegisto || ''}"></div>
            <div><label class="block font-bold">[I4.TXT02] ID do Registo</label><input type="text" class="border p-2 w-full bg-gray-100" value="${p.id || ''}" readonly></div>
            <div><label class="block font-bold">[I4.TXT03] Código</label><input type="text" class="border p-2 w-full" value="${p.codigo || ''}"></div>
            <div><label class="block font-bold">[I4.TXT04] Nome</label><input type="text" class="border p-2 w-full" value="${p.nome || ''}"></div>
            <div><label class="block font-bold">[I4.TXT05] Objetivo</label><input type="text" class="border p-2 w-full" value="${p.objetivo || ''}"></div>
            <div><label class="block font-bold">[I4.TXT06] Âmbito</label><input type="text" class="border p-2 w-full" value="${p.ambito || ''}"></div>
            <div><label class="block font-bold">[I4.DT01] Data de Elaboração</label><input type="date" class="border p-2 w-full" value="${p.dataElaboracao || ''}"></div>
            <div><label class="block font-bold">[I4.TXT07] Donos do Processo</label><input type="text" class="border p-2 w-full" value="${p.donos ? p.donos.map(d=>d.nome).join(', ') : ''}"></div>
            <div><label class="block font-bold">[I4.TXT08] Versão</label><input type="text" class="border p-2 w-full" value="${p.versao || ''}"></div>
            <div><label class="block font-bold">[I4.DT02] Data de revisão da versão</label><input type="date" class="border p-2 w-full" value="${p.dataRevisao || ''}"></div>
            <div><label class="block font-bold">[I4.TXT09] Riscos Relevantes</label><input type="text" class="border p-2 w-full" value="${p.riscos || ''}"></div>
            <div><label class="block font-bold">[I3.TXT11] Oportunidades</label><input type="text" class="border p-2 w-full" value="${p.oportunidades || ''}"></div>
            <div><label class="block font-bold">[I4.TXT11] Entradas</label><input type="text" class="border p-2 w-full" value="${p.entradas || ''}"></div>
            <div><label class="block font-bold">[I4.TXT12] Saídas</label><input type="text" class="border p-2 w-full" value="${p.saidas || ''}"></div>
            <div><label class="block font-bold">[I4.TXT13] Indicadores de Sucesso</label><input type="text" class="border p-2 w-full" value="${p.indicadoresSucesso || ''}"></div>
            <div><label class="block font-bold">[I4.TXT14] Partes Interessadas Externas</label><input type="text" class="border p-2 w-full" value="${p.partesInteressadasExternas || ''}"></div>
            <div><label class="block font-bold">[I4.TXT15] Partes Interessadas Internas</label><input type="text" class="border p-2 w-full" value="${p.partesInteressadasInternas || ''}"></div>
            <div><label class="block font-bold">[I4.TXT16] Referenciais</label><input type="text" class="border p-2 w-full" value="${p.referenciais || ''}"></div>
        </div>

        <div class="mb-4">
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="navigateTo('I6', '${p.id}')">[I4.BT01] Adicionar sub processos</button>
        </div>
        <h2 class="font-bold text-lg mb-2">[I4.TB02] Tabela com a lista de sub processos</h2>
        <table class="w-full border text-left mb-6"><thead class="bg-gray-100"><tr>
            <th class="p-2 border">Código do sub processo</th>
            <th class="p-2 border">Nome</th>
            <th class="p-2 border">Versão</th>
            <th class="p-2 border">Data de elaboração</th>
            <th class="p-2 border">Label do Registo + ID do Registo</th>
            <th class="p-2 border">Ações</th>
        </tr></thead><tbody>`;
        if(p.subProcessosId) {
            p.subProcessosId.forEach(spId => {
                const sp = getItemById(spId);
                if(sp && sp.status === 'Publicado') {
                    const spLabel = sp.labelRegisto ? sp.labelRegisto + ' - ' : '';
                    html += `<tr>
                        <td class="p-2 border">${sp.codigo}</td>
                        <td class="p-2 border">${sp.nome}</td>
                        <td class="p-2 border">${sp.versao}</td>
                        <td class="p-2 border">${sp.dataElaboracao}</td>
                        <td class="p-2 border">${spLabel}${sp.id}</td>
                        <td class="p-2 border">
                            <button class="bg-blue-500 text-white px-2 py-1 rounded mr-1 mb-1" onclick="navigateTo('I7', '${sp.id}')">[I4.TB02.BT01] Detalhe</button>
                            <button class="bg-yellow-500 text-white px-2 py-1 rounded mr-1 mb-1" onclick="navigateTo('I8', '${sp.id}')">[I4.TB02.BT02] Editar</button>
                            <button class="bg-orange-500 text-white px-2 py-1 rounded mr-1 mb-1" onclick="desativarSubProcesso('${sp.id}')">[I4.TB02.BT03] Desativar</button>
                            <button class="bg-red-500 text-white px-2 py-1 rounded mb-1" onclick="eliminarSubProcesso('${sp.id}')">[I4.TB02.BT04] Eliminar</button>
                        </td>
                    </tr>`;
                }
            });
        }
        html += `</tbody></table>

        <div class="mb-4">
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="navigateTo('I10', '${p.id}')">[I4.BT02] Adicionar documentos</button>
        </div>
        <h2 class="font-bold text-lg mb-2">[I4.TB03] Tabela com a lista de documentos</h2>
        <table class="w-full border text-left mb-6"><thead class="bg-gray-100"><tr>
            <th class="p-2 border">Código do documento</th>
            <th class="p-2 border">Designação</th>
            <th class="p-2 border">Versão</th>
            <th class="p-2 border">Data de elaboração</th>
            <th class="p-2 border">Tipo</th>
            <th class="p-2 border">Label do Registo + ID do Registo</th>
            <th class="p-2 border">Ações</th>
        </tr></thead><tbody>`;
        if(p.documentosId) {
            p.documentosId.forEach(docId => {
                const doc = getItemById(docId);
                if(doc && doc.status === 'Publicado') {
                    const docLabel = doc.labelRegisto ? doc.labelRegisto + ' - ' : '';
                    html += `<tr>
                        <td class="p-2 border">${doc.codigo}</td>
                        <td class="p-2 border">${doc.designacao}</td>
                        <td class="p-2 border">${doc.versao}</td>
                        <td class="p-2 border">${doc.dataElaboracao}</td>
                        <td class="p-2 border">${doc.tipo || ''}</td>
                        <td class="p-2 border">${docLabel}${doc.id}</td>
                        <td class="p-2 border">
                            <button class="bg-blue-500 text-white px-2 py-1 rounded mr-1 mb-1" onclick="navigateTo('I11', '${doc.id}')">[I4.TB03.BT01] Detalhe</button>
                            <button class="bg-yellow-500 text-white px-2 py-1 rounded mr-1 mb-1" onclick="navigateTo('I10', '${doc.id}')">[I4.TB03.BT02] Editar</button>
                            <button class="bg-orange-500 text-white px-2 py-1 rounded mr-1 mb-1" onclick="desativarDocumento('${doc.id}')">[I4.TB03.BT03] Desativar</button>
                            <button class="bg-red-500 text-white px-2 py-1 rounded mb-1" onclick="eliminarDocumento('${doc.id}')">[I4.TB03.BT04] Eliminar</button>
                        </td>
                    </tr>`;
                }
            });
        }
        html += `</tbody></table>

        <div class="flex justify-end gap-2 mt-6 border-t pt-4">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="guardarProcesso('rascunho', '${p.id}')">[I4.BT01] Guardar como Rascunho</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="guardarProcesso('publicar', '${p.id}')">[I4.BT02] Guardar e Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I3', '${p.id}')">[I4.BT03] Voltar</button>
        </div>
    </div>`;
    return html;
}

function renderI5ListaSubProcessos() {
    let html = `
    <div class="flex justify-between items-center mb-4">
        <h1 class="text-3xl font-bold">[I5] Lista de Sub processos</h1>
        <button class="bg-green-600 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I6')">[I5.BT02] Adicionar Sub processo</button>
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
                <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Estado</th>
                <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Label de Registo + ID de registo</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>`;

    mockData.subProcessos.forEach(sp => {
        const idRegisto = sp.id;
        const label = sp.labelRegisto ? sp.labelRegisto + ' - ' : '';
        html += `<tr>
            <td class="border px-4 py-2">${sp.processoPaiId}</td>
            <td class="border px-4 py-2">${sp.codigo}</td>
            <td class="border px-4 py-2">${sp.nome}</td>
            <td class="border px-4 py-2">${sp.versao}</td>
            <td class="border px-4 py-2">${sp.dataElaboracao}</td>
            <td class="border px-4 py-2"><span class="bg-gray-100 px-2 py-1 rounded">${sp.status}</span></td>
            <td class="border px-4 py-2">${label}${idRegisto}</td>
            <td class="border px-4 py-2">
                <button class="bg-blue-500 text-white px-2 py-1 rounded mr-1 mb-1" onclick="navigateTo('I7', '${sp.id}')">[I5.TB01.BT01] Detalhe</button>
                <button class="bg-yellow-500 text-white px-2 py-1 rounded mr-1 mb-1" onclick="navigateTo('I8', '${sp.id}')">[I5.TB01.BT02] Edição</button>
                <button class="bg-gray-500 text-white px-2 py-1 rounded mr-1 mb-1" onclick="navigateTo('I9', '${sp.id}')">[I5.TB01.BT03] Documentos</button>
                <button class="bg-orange-500 text-white px-2 py-1 rounded mr-1 mb-1" onclick="desativarSubProcesso('${sp.id}')">[I5.TB01.BT04] Desativar</button>
                <button class="bg-red-500 text-white px-2 py-1 rounded mb-1" onclick="eliminarSubProcesso('${sp.id}')">[I5.TB01.BT05] Eliminar</button>
            </td>
        </tr>`;
    });

    html += `</tbody></table><br><button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I1')">Voltar</button>`;
    return html;
}

function renderI6CriacaoSubProcesso() {
    let html = `<h1 class="text-3xl font-bold mb-4">[I6] Criação de Sub processo</h1>
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
            <div><label class="block font-bold">[I6.UPL03] Upload Ficheiro de Sub Processo</label><input type="file" accept=".pdf" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I6.DWN01] Download Ficheiro de Sub Processo</label><button class="border p-2 w-full bg-gray-100 text-gray-500 cursor-not-allowed" disabled>Sem ficheiro</button></div>
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
        <div class="flex justify-end gap-2 mt-6 border-t pt-4">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="guardarSubProcesso('rascunho')">[I6.BT01] Guardar como Rascunho</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="guardarSubProcesso('publicar')">[I6.BT02] Guardar e Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I5')">[I6.BT03] Voltar</button>
        </div>
    </div>`;
    return html;
}

function renderI7DetalheSubProcessoAtivo() {
    const sp = getItemById(currentState.contextId) || {};
    const headerTitle = `${sp.status || 'Estado'} - ${sp.labelRegisto || 'Label Registo'} - ${sp.id || 'ID Registo'}`;

    let html = `
    <div class="mb-4">
        <h1 class="text-3xl font-bold mb-2">[I7] Interface 7 – Detalhe</h1>
        <h2 class="text-xl text-gray-600 font-semibold">${headerTitle}</h2>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-6 opacity-75 bg-white p-4 shadow rounded">
        <div><strong>[I6.LB01] Processo Pai:</strong> ${sp.processoPaiId || ''}</div>
        <div><strong>[I7.UPL01] Upload Logo:</strong> <input type="file" disabled></div>
        <div><strong>[I7.UPL02] Upload Banner:</strong> <input type="file" disabled></div>
        <div><strong>[I7.DWN01] Download Ficheiro de Sub Processo:</strong> <button class="text-blue-600 underline">Download PDF</button></div>
        <div><strong>[I7.TXT01] Label de Registo:</strong> ${sp.labelRegisto || ''}</div>
        <div><strong>[I7.TXT02] ID do Registo:</strong> ${sp.id || ''}</div>
        <div><strong>[I7.TXT03] Código:</strong> ${sp.codigo || ''}</div>
        <div><strong>[I7.TXT04] Nome:</strong> ${sp.nome || ''}</div>
        <div><strong>[I7.TXT05] Objetivo:</strong> ${sp.objetivo || ''}</div>
        <div><strong>[I7.TXT06] Âmbito:</strong> ${sp.ambito || ''}</div>
        <div><strong>[I7.DT01] Data de Elaboração:</strong> ${sp.dataElaboracao || ''}</div>
        <div><strong>[I7.TXT07] Donos do Sub Processo:</strong> ${sp.donos ? sp.donos.map(d=>d.nome).join(', ') : ''}</div>
        <div><strong>[I7.TXT08] Versão:</strong> ${sp.versao || ''}</div>
        <div><strong>[I7.DT02] Data de revisão da versão:</strong> ${sp.dataRevisao || ''}</div>
        <div><strong>[I7.TXT09] Riscos Relevantes:</strong> ${sp.riscos || ''}</div>
        <div><strong>[I7.TXT10] Oportunidades:</strong> ${sp.oportunidades || ''}</div>
        <div><strong>[I7.TXT11] Entradas:</strong> ${sp.entradas || ''}</div>
        <div><strong>[I7.TXT12] Saídas:</strong> ${sp.saidas || ''}</div>
        <div><strong>[I7.TXT13] Indicadores de Sucesso:</strong> ${sp.indicadoresSucesso || ''}</div>
        <div><strong>[I7.TXT14] Partes Interessadas Externas:</strong> ${sp.partesInteressadasExternas || ''}</div>
        <div><strong>[I7.TXT15] Partes Interessadas Internas:</strong> ${sp.partesInteressadasInternas || ''}</div>
        <div><strong>[I7.TXT16] Referenciais:</strong> ${sp.referenciais || ''}</div>
    </div>

    <div class="mb-4">
        <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="navigateTo('I10', '${sp.id}')">[I7.BT01] Adicionar documentos</button>
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
                <th class="border px-4 py-2">Label do Registo + ID do registo</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>`;
    if(sp.documentosId) {
        sp.documentosId.forEach(docId => {
            const doc = getItemById(docId);
            if(doc && doc.status === 'Publicado') {
                const docLabel = doc.labelRegisto ? doc.labelRegisto + ' - ' : '';
                html += `<tr>
                    <td class="border px-4 py-2">${doc.codigo}</td>
                    <td class="border px-4 py-2">${doc.designacao}</td>
                    <td class="border px-4 py-2">${doc.versao}</td>
                    <td class="border px-4 py-2">${doc.dataElaboracao}</td>
                    <td class="border px-4 py-2">${doc.tipo || ''}</td>
                    <td class="border px-4 py-2">${docLabel}${doc.id}</td>
                    <td class="border px-4 py-2">
                        <button class="bg-blue-600 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I11', '${doc.id}')">[I7.TB01.BT01] Detalhe</button>
                        <button class="bg-yellow-500 text-white px-3 py-1 rounded" onclick="navigateTo('I10', '${doc.id}')">[I7.TB01.BT02] Editar</button>
                    </td>
                </tr>`;
            }
        });
    }
    html += `
        </tbody>
    </table>

    <h2 class="text-xl font-bold mt-4 mb-2">[I7.TB02] Tabela de Histórico</h2>
    <table class="min-w-full bg-white border mb-6">
        <thead class="bg-gray-200">
            <tr>
                <th class="border px-4 py-2">Código do sub processo</th>
                <th class="border px-4 py-2">Nome</th>
                <th class="border px-4 py-2">Versão</th>
                <th class="border px-4 py-2">Data de revisão da versão</th>
                <th class="border px-4 py-2">Estado</th>
                <th class="border px-4 py-2">Label do Registo + ID do Registo</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>`;
    const historicoSP = mockData.subProcessos
        .filter(x => x.codigo === sp.codigo && x.id !== sp.id)
        .sort((a,b) => new Date(b.dataRevisao) - new Date(a.dataRevisao));

    historicoSP.forEach(h => {
        const hLabel = h.labelRegisto ? h.labelRegisto + ' - ' : '';
        html += `<tr>
            <td class="border px-4 py-2">${h.codigo}</td>
            <td class="border px-4 py-2">${h.nome}</td>
            <td class="border px-4 py-2">${h.versao}</td>
            <td class="border px-4 py-2">${h.dataRevisao}</td>
            <td class="border px-4 py-2">${h.status}</td>
            <td class="border px-4 py-2">${hLabel}${h.id}</td>
            <td class="border px-4 py-2">
                <button class="bg-gray-600 text-white px-3 py-1 rounded mr-1 mb-1" onclick="navigateTo('I13', '${h.id}')">[I7.TB02.BT01] Detalhe Histórico</button>
                <button class="bg-yellow-500 text-white px-3 py-1 rounded mr-1 mb-1" onclick="navigateTo('I8', '${h.id}')">[I7.TB02.BT02] Edição</button>
                ${(h.status === 'Rascunho' || h.status === 'Inativo') ? `<button class="bg-green-600 text-white px-3 py-1 rounded" onclick="guardarSubProcesso('publicar', '${h.id}')">[I7.TB02.BT03] Publicar</button>` : ''}
            </td>
        </tr>`;
    });

    html += `
        </tbody>
    </table>

    <div class="flex justify-end gap-2 mt-6 border-t pt-4">
        <button class="bg-blue-600 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I8', '${sp.id}')">[I7.BT03] Edição</button>
        <button class="bg-orange-500 text-white px-4 py-2 rounded shadow" onclick="desativarSubProcesso('${sp.id}')">[I7.BT04] Desativar</button>
        <button class="bg-red-500 text-white px-4 py-2 rounded shadow" onclick="eliminarSubProcesso('${sp.id}')">[I7.BT05] Eliminar</button>
        <button class="bg-gray-500 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I5')">[I7.BT02] Voltar</button>
    </div>
    `;
    return html;
}

function renderI8RevisaoSubProcesso() {
    const sp = getItemById(currentState.contextId) || {};
    const headerTitle = `${sp.status || 'Estado'} - ${sp.labelRegisto || 'Label Registo'} - ${sp.id || 'ID Registo'}`;

    let html = `<div class="mb-4">
        <h1 class="text-3xl font-bold mb-2">[I8] Interface 8 – Edição</h1>
        <h2 class="text-xl text-gray-600 font-semibold">${headerTitle}</h2>
    </div>
    <div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">[I8.LB01] Processo Pai</label><input type="text" class="border p-2 w-full bg-gray-100" value="${sp.processoPaiId || ''}" readonly></div>
            <div><label class="block font-bold">[I8.UPL01] Upload Logo</label><input type="file" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I8.UPL02] Upload Banner</label><input type="file" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I8.UPL03] Upload Ficheiro de Sub Processo</label><input type="file" accept=".pdf" class="border p-2 w-full"></div>
            <div><label class="block font-bold">[I8.DWN01] Download Ficheiro de Sub Processo</label><button class="text-blue-600 underline">Download PDF atual</button></div>
            <div><label class="block font-bold">[I8.TXT01] Label de Registo</label><input type="text" class="border p-2 w-full" value="${sp.labelRegisto || ''}"></div>
            <div><label class="block font-bold">[I8.TXT02] ID do Registo</label><input type="text" class="border p-2 w-full bg-gray-100" value="${sp.id || ''}" readonly></div>
            <div><label class="block font-bold">[I8.TXT03] Código</label><input type="text" class="border p-2 w-full" value="${sp.codigo || ''}"></div>
            <div><label class="block font-bold">[I8.TXT04] Nome</label><input type="text" class="border p-2 w-full" value="${sp.nome || ''}"></div>
            <div><label class="block font-bold">[I8.TXT05] Objetivo</label><input type="text" class="border p-2 w-full" value="${sp.objetivo || ''}"></div>
            <div><label class="block font-bold">[I8.TXT06] Âmbito</label><input type="text" class="border p-2 w-full" value="${sp.ambito || ''}"></div>
            <div><label class="block font-bold">[I8.DT01] Data de Elaboração</label><input type="date" class="border p-2 w-full" value="${sp.dataElaboracao || ''}"></div>
            <div><label class="block font-bold">[I8.TXT07] Donos do Sub Processo</label><input type="text" class="border p-2 w-full" value="${sp.donos ? sp.donos.map(d=>d.nome).join(', ') : ''}"></div>
            <div><label class="block font-bold">[I8.TXT08] Versão</label><input type="text" class="border p-2 w-full" value="${sp.versao || ''}"></div>
            <div><label class="block font-bold">[I8.DT02] Data de revisão da versão</label><input type="date" class="border p-2 w-full" value="${sp.dataRevisao || ''}"></div>
            <div><label class="block font-bold">[I8.TXT09] Riscos Relevantes</label><input type="text" class="border p-2 w-full" value="${sp.riscos || ''}"></div>
            <div><label class="block font-bold">[I8.TXT10] Oportunidades</label><input type="text" class="border p-2 w-full" value="${sp.oportunidades || ''}"></div>
            <div><label class="block font-bold">[I8.TXT11] Entradas</label><input type="text" class="border p-2 w-full" value="${sp.entradas || ''}"></div>
            <div><label class="block font-bold">[I8.TXT12] Saídas</label><input type="text" class="border p-2 w-full" value="${sp.saidas || ''}"></div>
            <div><label class="block font-bold">[I8.TXT13] Indicadores de Sucesso</label><input type="text" class="border p-2 w-full" value="${sp.indicadoresSucesso || ''}"></div>
            <div><label class="block font-bold">[I8.TXT14] Partes Interessadas Externas</label><input type="text" class="border p-2 w-full" value="${sp.partesInteressadasExternas || ''}"></div>
            <div><label class="block font-bold">[I8.TXT15] Partes Interessadas Internas</label><input type="text" class="border p-2 w-full" value="${sp.partesInteressadasInternas || ''}"></div>
            <div><label class="block font-bold">[I8.TXT16] Referenciais</label><input type="text" class="border p-2 w-full" value="${sp.referenciais || ''}"></div>
        </div>

        <h2 class="font-bold text-lg mb-2">[I8.TB01] Tabela com a lista de documentos</h2>
        <table class="w-full border text-left mb-6"><thead class="bg-gray-100"><tr>
            <th class="p-2 border">Código do documento</th>
            <th class="p-2 border">Designação</th>
            <th class="p-2 border">Versão</th>
            <th class="p-2 border">Data de elaboração</th>
            <th class="p-2 border">Tipo</th>
            <th class="p-2 border">Label do registo + ID do registo</th>
            <th class="p-2 border">Ações</th>
        </tr></thead><tbody>`;
        if(sp.documentosId) {
            sp.documentosId.forEach(docId => {
                const doc = getItemById(docId);
                if(doc && doc.status === 'Publicado') {
                    const docLabel = doc.labelRegisto ? doc.labelRegisto + ' - ' : '';
                    html += `<tr>
                        <td class="p-2 border">${doc.codigo}</td>
                        <td class="p-2 border">${doc.designacao}</td>
                        <td class="p-2 border">${doc.versao}</td>
                        <td class="p-2 border">${doc.dataElaboracao}</td>
                        <td class="p-2 border">${doc.tipo || ''}</td>
                        <td class="p-2 border">${docLabel}${doc.id}</td>
                        <td class="p-2 border">
                            <button class="bg-blue-500 text-white px-2 py-1 rounded mr-1 mb-1" onclick="navigateTo('I11', '${doc.id}')">[I8.TB01.BT01] Detalhe</button>
                            <button class="bg-yellow-500 text-white px-2 py-1 rounded mr-1 mb-1" onclick="navigateTo('I10', '${doc.id}')">[I8.TB01.BT02] Editar</button>
                            <button class="bg-orange-500 text-white px-2 py-1 rounded mr-1 mb-1" onclick="desativarDocumento('${doc.id}')">[I8.TB01.BT03] Desativar</button>
                            <button class="bg-red-500 text-white px-2 py-1 rounded mb-1" onclick="eliminarDocumento('${doc.id}')">[I8.TB01.BT04] Eliminar</button>
                        </td>
                    </tr>`;
                }
            });
        }
        html += `</tbody></table>

        <div class="flex justify-end gap-2 mt-6 border-t pt-4">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="guardarSubProcesso('rascunho', '${sp.id}')">[I8.BT01] Guardar como Rascunho</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="guardarSubProcesso('publicar', '${sp.id}')">[I8.BT02] Guardar e Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I7', '${sp.id}')">[I8.BT03] Voltar</button>
        </div>
    </div>`;
    return html;
}

function renderI9ListaDocumentos() {
    let html = `
    <div class="flex justify-between items-center mb-4">
        <h1 class="text-3xl font-bold">[I9] Lista de Documentos</h1>
        <button class="bg-green-600 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I10')">[I9.BT02] Adicionar Documento</button>
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
                <th class="border px-4 py-2 cursor-pointer hover:bg-gray-300">Estado</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>`;

    mockData.documentos.forEach(doc => {
        const idRegisto = doc.id;
        const label = doc.labelRegisto ? doc.labelRegisto + ' - ' : '';
        const assocProc = "PROC-001"; // Mocked for display
        html += `<tr>
            <td class="border px-4 py-2">${doc.codigo}</td>
            <td class="border px-4 py-2">${assocProc}</td>
            <td class="border px-4 py-2">${doc.designacao}</td>
            <td class="border px-4 py-2">${doc.versao}</td>
            <td class="border px-4 py-2">${doc.dataElaboracao}</td>
            <td class="border px-4 py-2">${doc.tipo || ''}</td>
            <td class="border px-4 py-2">${label}${idRegisto}</td>
            <td class="border px-4 py-2"><span class="bg-gray-100 px-2 py-1 rounded">${doc.status}</span></td>
            <td class="border px-4 py-2">
                <button class="bg-blue-500 text-white px-2 py-1 rounded mr-1 mb-1" onclick="navigateTo('I11', '${doc.id}')">[I9.TB01.BT01] Detalhe</button>
                <button class="bg-yellow-500 text-white px-2 py-1 rounded mr-1 mb-1" onclick="navigateTo('I10', '${doc.id}')">[I9.TB01.BT02] Editar</button>
                <button class="bg-orange-500 text-white px-2 py-1 rounded mr-1 mb-1" onclick="desativarDocumento('${doc.id}')">[I9.TB01.BT03] Desativar</button>
                <button class="bg-red-500 text-white px-2 py-1 rounded mb-1" onclick="eliminarDocumento('${doc.id}')">[I9.TB01.BT04] Eliminar</button>
            </td>
        </tr>`;
    });

    html += `</tbody></table><br><button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I1')">Voltar</button>`;
    return html;
}

function renderI10CriacaoEdicaoDocumento() {
    const doc = currentState.contextId ? getItemById(currentState.contextId) : {};
    let isEdit = !!doc.id;
    const headerTitle = isEdit ? `${doc.status || 'Estado'} - ${doc.labelRegisto || 'Label Registo'} - ${doc.id || 'ID Registo'}` : '';

    let html = `<div class="mb-4">
        <h1 class="text-3xl font-bold mb-2">[I10] ${isEdit ? 'Edição do Documento' : 'Criação de Documento'}</h1>
        ${isEdit ? `<h2 class="text-xl text-gray-600 font-semibold">${headerTitle}</h2>` : ''}
    </div>
    <div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">[I10.LB01] Processo Associado</label>
                <select class="border p-2 w-full">
                    <option value="">Selecione...</option>
                    <option value="PROC-001" selected>PROC-001</option>
                </select>
            </div>
            <div><label class="block font-bold">[I10.TXT01] Label de Registo</label><input type="text" class="border p-2 w-full" value="${doc.labelRegisto || ''}"></div>
            ${isEdit ? `<div><label class="block font-bold">[I10.TXT02] ID do Registo</label><input type="text" class="border p-2 w-full bg-gray-100" value="${doc.id || ''}" readonly></div>` : ''}
            <div><label class="block font-bold">[I10.TXT03] Código</label><input type="text" class="border p-2 w-full" value="${doc.codigo || ''}"></div>
            <div><label class="block font-bold">[I10.TXT04] Designação</label><input type="text" class="border p-2 w-full" value="${doc.designacao || ''}"></div>
            <div><label class="block font-bold">[I10.TXT05] Versão</label><input type="text" class="border p-2 w-full" value="${doc.versao || ''}"></div>
            <div><label class="block font-bold">[I10.DT01] Data de Elaboração</label><input type="date" class="border p-2 w-full" value="${doc.dataElaboracao || ''}"></div>
            <div><label class="block font-bold">[I10.TXT06] Donos do Documento</label><input type="text" class="border p-2 w-full" value="${doc.donos ? doc.donos.map(d=>d.nome).join(', ') : ''}"></div>
            <div><label class="block font-bold">[I10.DT02] Data de revisão da versão</label><input type="date" class="border p-2 w-full" value="${doc.dataRevisao || ''}"></div>
            <div><label class="block font-bold">[I10.LB02] Tipo</label>
                <select class="border p-2 w-full">
                    <option value="">Selecione o Tipo</option>
                    <option value="Instrumento" ${doc.tipo === 'Instrumento' ? 'selected' : ''}>Instrumento</option>
                    <option value="Regulamento" ${doc.tipo === 'Regulamento' ? 'selected' : ''}>Regulamento</option>
                    <option value="Orientação" ${doc.tipo === 'Orientação' ? 'selected' : ''}>Orientação</option>
                    <option value="Impresso" ${doc.tipo === 'Impresso' ? 'selected' : ''}>Impresso</option>
                </select>
            </div>
            <div class="col-span-2 border p-4 bg-gray-50">
                <label class="block font-bold mb-2">[I10.UPL01] Upload de Ficheiros e Parametrização</label>
                <input type="file" multiple class="border p-2 w-full mb-2">
                <label class="flex items-center"><input type="checkbox" class="mr-2"> Documentos Parametrizáveis</label>
            </div>
        </div>

        ${isEdit ? `
        <div class="mb-6">
            <h2 class="font-bold text-lg mb-2">[I10.LST01] Lista de Ficheiros</h2>
            <ul class="list-disc pl-5">
                <li><button class="text-blue-600 underline" onclick="alert('Download do ficheiro 1')">[I10.LST01.BT01] Download ficheiro1.pdf</button></li>
                <li><button class="text-blue-600 underline" onclick="alert('Download do ficheiro 2')">[I10.LST01.BT01] Download ficheiro2.docx</button></li>
            </ul>
        </div>

        <h2 class="text-xl font-bold mt-4 mb-2">[I10.TB01] Tabela de Histórico de Versões</h2>
        <table class="min-w-full bg-white border mb-6">
            <thead class="bg-gray-200">
                <tr>
                    <th class="border px-4 py-2">Código do documento</th>
                    <th class="border px-4 py-2">Designação</th>
                    <th class="border px-4 py-2">Versão</th>
                    <th class="border px-4 py-2">Data de revisão da versão</th>
                    <th class="border px-4 py-2">Estado</th>
                    <th class="border px-4 py-2">Label do registo + ID do registo</th>
                    <th class="border px-4 py-2">Ações</th>
                </tr>
            </thead>
            <tbody>` +
            mockData.documentos
            .filter(x => x.codigo === doc.codigo && x.id !== doc.id)
            .sort((a,b) => new Date(b.dataRevisao) - new Date(a.dataRevisao))
            .map(h => {
                const hLabel = h.labelRegisto ? h.labelRegisto + ' - ' : '';
                return `<tr>
                <td class="border px-4 py-2">${h.codigo}</td>
                <td class="border px-4 py-2">${h.designacao}</td>
                <td class="border px-4 py-2">${h.versao}</td>
                <td class="border px-4 py-2">${h.dataRevisao}</td>
                <td class="border px-4 py-2">${h.status}</td>
                <td class="border px-4 py-2">${hLabel}${h.id}</td>
                <td class="border px-4 py-2">
                    <button class="bg-gray-600 text-white px-3 py-1 rounded mr-1 mb-1" onclick="navigateTo('I14', '${h.id}')">[I10.TB01.BT01] Detalhe Histórico</button>
                    <button class="bg-yellow-500 text-white px-3 py-1 rounded mr-1 mb-1" onclick="navigateTo('I10', '${h.id}')">[I10.TB01.BT02] Edição</button>
                    ${(h.status === 'Rascunho' || h.status === 'Inativo') ? `<button class="bg-green-600 text-white px-3 py-1 rounded mb-1" onclick="guardarDocumento('publicar', '${h.id}')">[I10.TB01.BT03] Publicar</button>` : ''}
                </td>
            </tr>`;
            }).join('') + `
            </tbody>
        </table>` : ''}

        <div class="flex justify-end gap-2 mt-6 border-t pt-4">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="guardarDocumento('rascunho', '${doc.id || ''}')">[I10.BT01] Guardar como Rascunho</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="guardarDocumento('publicar', '${doc.id || ''}')">[I10.BT02] Guardar e Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('${isEdit ? 'I11' : 'I9'}', '${doc.id || ''}')">[I10.BT03] Voltar</button>
        </div>
    </div>`;
    return html;
}

function renderI11DetalheDocumento() {
    const doc = getItemById(currentState.contextId) || {};
    const headerTitle = `${doc.status || 'Estado'} - ${doc.labelRegisto || 'Label Registo'} - ${doc.id || 'ID Registo'}`;

    let html = `
    <div class="mb-4">
        <h1 class="text-3xl font-bold mb-2">[I11] Interface 11 – Detalhe de Documento</h1>
        <h2 class="text-xl text-gray-600 font-semibold">${headerTitle}</h2>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-6 opacity-75 bg-white p-4 shadow rounded">
        <div><strong>[I11.LB01] Processo Associado:</strong> PROC-001</div>
        <div><strong>[I11.TXT01] Label de Registo:</strong> ${doc.labelRegisto || ''}</div>
        <div><strong>[I11.TXT02] ID do Registo:</strong> ${doc.id || ''}</div>
        <div><strong>[I11.TXT03] Código:</strong> ${doc.codigo || ''}</div>
        <div><strong>[I11.TXT04] Designação:</strong> ${doc.designacao || ''}</div>
        <div><strong>[I11.TXT05] Versão:</strong> ${doc.versao || ''}</div>
        <div><strong>[I11.DT01] Data de Elaboração:</strong> ${doc.dataElaboracao || ''}</div>
        <div><strong>[I11.TXT06] Donos do Documento:</strong> ${doc.donos ? doc.donos.map(d=>d.nome).join(', ') : ''}</div>
        <div><strong>[I11.DT02] Data de revisão da versão:</strong> ${doc.dataRevisao || ''}</div>
        <div><strong>[I11.LB02] Tipo:</strong> ${doc.tipo || ''}</div>
        <div><strong>[I11.TXT07] Estado:</strong> ${doc.status || ''}</div>
    </div>

    <div class="mb-6 bg-white p-4 shadow rounded">
        <h2 class="font-bold text-lg mb-2">[I11.LST01] Lista de Ficheiros</h2>
        <ul class="list-disc pl-5">
            <li><button class="text-blue-600 underline" onclick="alert('Download do ficheiro 1')">[I11.LST01.BT01] Download ficheiro1.pdf</button></li>
            <li><button class="text-blue-600 underline" onclick="alert('Download do ficheiro 2')">[I11.LST01.BT01] Download ficheiro2.docx</button></li>
        </ul>
    </div>

    <h2 class="text-xl font-bold mt-4 mb-2">[I11.TB01] Tabela de Histórico de Versões</h2>
    <table class="min-w-full bg-white border mb-6">
        <thead class="bg-gray-200">
            <tr>
                <th class="border px-4 py-2">Código do documento</th>
                <th class="border px-4 py-2">Designação</th>
                <th class="border px-4 py-2">Versão</th>
                <th class="border px-4 py-2">Data de revisão da versão</th>
                <th class="border px-4 py-2">Estado</th>
                <th class="border px-4 py-2">Label do registo + ID do registo</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>`;
    const historicoDoc = mockData.documentos
        .filter(x => x.codigo === doc.codigo && x.id !== doc.id)
        .sort((a,b) => new Date(b.dataRevisao) - new Date(a.dataRevisao));

    historicoDoc.forEach(h => {
        const hLabel = h.labelRegisto ? h.labelRegisto + ' - ' : '';
        html += `<tr>
            <td class="border px-4 py-2">${h.codigo}</td>
            <td class="border px-4 py-2">${h.designacao}</td>
            <td class="border px-4 py-2">${h.versao}</td>
            <td class="border px-4 py-2">${h.dataRevisao}</td>
            <td class="border px-4 py-2">${h.status}</td>
            <td class="border px-4 py-2">${hLabel}${h.id}</td>
            <td class="border px-4 py-2">
                <button class="bg-gray-600 text-white px-3 py-1 rounded mr-1 mb-1" onclick="navigateTo('I14', '${h.id}')">[I11.TB01.BT01] Detalhe Histórico</button>
                <button class="bg-yellow-500 text-white px-3 py-1 rounded mr-1 mb-1" onclick="navigateTo('I10', '${h.id}')">[I11.TB01.BT02] Edição</button>
                ${(h.status === 'Rascunho' || h.status === 'Inativo') ? `<button class="bg-green-600 text-white px-3 py-1 rounded" onclick="guardarDocumento('publicar', '${h.id}')">[I11.TB01.BT03] Publicar</button>` : ''}
            </td>
        </tr>`;
    });

    html += `
        </tbody>
    </table>

    <div class="flex justify-end gap-2 mt-6 border-t pt-4">
        <button class="bg-blue-600 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I10', '${doc.id}')">[I11.BT01] Edição</button>
        <button class="bg-orange-500 text-white px-4 py-2 rounded shadow" onclick="desativarDocumento('${doc.id}')">[I11.BT02] Desativar</button>
        <button class="bg-red-500 text-white px-4 py-2 rounded shadow" onclick="eliminarDocumento('${doc.id}')">[I11.BT03] Eliminar</button>
        <button class="bg-gray-500 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I9')">[I11.BT04] Voltar</button>
    </div>
    `;
    return html;
}

function renderI12DetalheHistoricoProcesso() {
    const p = getItemById(currentState.contextId) || {};
    const headerTitle = `${p.status || 'Estado'} - ${p.labelRegisto || 'Label Registo'} - ${p.id || 'ID Registo'}`;

    let html = `
    <div class="mb-4">
        <h1 class="text-3xl font-bold mb-2">[I12] Interface 12 – Detalhe Histórico de Processo</h1>
        <h2 class="text-xl text-gray-600 font-semibold">${headerTitle}</h2>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-6 opacity-75 bg-white p-4 shadow rounded">
        <div><strong>Código:</strong> ${p.codigo || ''}</div>
        <div><strong>Nome:</strong> ${p.nome || ''}</div>
        <div><strong>Objetivo:</strong> ${p.objetivo || ''}</div>
        <div><strong>Âmbito:</strong> ${p.ambito || ''}</div>
        <div><strong>Data de Elaboração:</strong> ${p.dataElaboracao || ''}</div>
        <div><strong>Versão:</strong> ${p.versao || ''}</div>
        <div><strong>Data de Revisão da versão:</strong> ${p.dataRevisao || ''}</div>
        <div><strong>Estado:</strong> ${p.status || ''}</div>
    </div>

    <h2 class="text-xl font-bold mt-4 mb-2">[I12.TB02] Tabela com a lista de sub processos</h2>
    <table class="min-w-full bg-white border mb-6">
        <thead class="bg-gray-200">
            <tr>
                <th class="border px-4 py-2">Código do sub processo</th>
                <th class="border px-4 py-2">Nome</th>
                <th class="border px-4 py-2">Versão</th>
                <th class="border px-4 py-2">Data de elaboração</th>
                <th class="border px-4 py-2">Label do registo + ID do registo</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>`;
    if(p.subProcessosId) {
        p.subProcessosId.forEach(spId => {
            const sp = getItemById(spId);
            if(sp) {
                const spLabel = sp.labelRegisto ? sp.labelRegisto + ' - ' : '';
                html += `<tr>
                    <td class="border px-4 py-2">${sp.codigo}</td>
                    <td class="border px-4 py-2">${sp.nome}</td>
                    <td class="border px-4 py-2">${sp.versao}</td>
                    <td class="border px-4 py-2">${sp.dataElaboracao}</td>
                    <td class="border px-4 py-2">${spLabel}${sp.id}</td>
                    <td class="border px-4 py-2">
                        <button class="bg-gray-600 text-white px-3 py-1 rounded" onclick="handleIntelligentNavigation('${sp.id}')">[I12.TB02.BT01] Detalhe</button>
                    </td>
                </tr>`;
            }
        });
    }
    html += `
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
                <th class="border px-4 py-2">Label do registo + ID do registo</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>`;
    if(p.documentosId) {
        p.documentosId.forEach(docId => {
            const doc = getItemById(docId);
            if(doc) {
                const docLabel = doc.labelRegisto ? doc.labelRegisto + ' - ' : '';
                html += `<tr>
                    <td class="border px-4 py-2">${doc.codigo}</td>
                    <td class="border px-4 py-2">${doc.designacao}</td>
                    <td class="border px-4 py-2">${doc.versao}</td>
                    <td class="border px-4 py-2">${doc.dataElaboracao}</td>
                    <td class="border px-4 py-2">${doc.tipo || ''}</td>
                    <td class="border px-4 py-2">${docLabel}${doc.id}</td>
                    <td class="border px-4 py-2">
                        <button class="bg-gray-600 text-white px-3 py-1 rounded" onclick="handleIntelligentNavigation('${doc.id}')">[I12.TB03.BT01] Detalhe</button>
                    </td>
                </tr>`;
            }
        });
    }
    html += `
        </tbody>
    </table>

    <div class="flex justify-end gap-2 mt-6 border-t pt-4">
        <button class="bg-blue-600 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I4', '${p.id}')">[I12.BT01] Edição</button>
        <button class="bg-green-600 text-white px-4 py-2 rounded shadow" onclick="guardarProcesso('publicar', '${p.id}')">[I12.BT02] Publicar</button>
        <button class="bg-gray-500 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I3', '${p.id}')">[I12.BT03] Voltar</button>
    </div>
    `;
    return html;
}

function renderI13DetalheHistoricoSubProcesso() {
    const sp = getItemById(currentState.contextId) || {};
    const headerTitle = `${sp.status || 'Estado'} - ${sp.labelRegisto || 'Label Registo'} - ${sp.id || 'ID Registo'}`;

    let html = `
    <div class="mb-4">
        <h1 class="text-3xl font-bold mb-2">[I13] Interface 13 – Detalhe Histórico de Sub processo</h1>
        <h2 class="text-xl text-gray-600 font-semibold">${headerTitle}</h2>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-6 opacity-75 bg-white p-4 shadow rounded">
        <div><strong>[I13.LB01] Processo Pai:</strong> ${sp.processoPaiId || ''}</div>
        <div><strong>Código:</strong> ${sp.codigo || ''}</div>
        <div><strong>Nome:</strong> ${sp.nome || ''}</div>
        <div><strong>Objetivo:</strong> ${sp.objetivo || ''}</div>
        <div><strong>Âmbito:</strong> ${sp.ambito || ''}</div>
        <div><strong>Data de Elaboração:</strong> ${sp.dataElaboracao || ''}</div>
        <div><strong>Versão:</strong> ${sp.versao || ''}</div>
        <div><strong>Data de Revisão da versão:</strong> ${sp.dataRevisao || ''}</div>
        <div><strong>Estado:</strong> ${sp.status || ''}</div>
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
                <th class="border px-4 py-2">Label do registo + ID do registo</th>
                <th class="border px-4 py-2">Ações</th>
            </tr>
        </thead>
        <tbody>`;
    if(sp.documentosId) {
        sp.documentosId.forEach(docId => {
            const doc = getItemById(docId);
            if(doc) {
                const docLabel = doc.labelRegisto ? doc.labelRegisto + ' - ' : '';
                html += `<tr>
                    <td class="border px-4 py-2">${doc.codigo}</td>
                    <td class="border px-4 py-2">${doc.designacao}</td>
                    <td class="border px-4 py-2">${doc.versao}</td>
                    <td class="border px-4 py-2">${doc.dataElaboracao}</td>
                    <td class="border px-4 py-2">${doc.tipo || ''}</td>
                    <td class="border px-4 py-2">${docLabel}${doc.id}</td>
                    <td class="border px-4 py-2">
                        <button class="bg-gray-600 text-white px-3 py-1 rounded" onclick="handleIntelligentNavigation('${doc.id}')">[I13.TB02.BT01] Detalhe</button>
                    </td>
                </tr>`;
            }
        });
    }
    html += `
        </tbody>
    </table>

    <div class="flex justify-end gap-2 mt-6 border-t pt-4">
        <button class="bg-blue-600 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I8', '${sp.id}')">[I13.BT01] Edição</button>
        <button class="bg-green-600 text-white px-4 py-2 rounded shadow" onclick="guardarSubProcesso('publicar', '${sp.id}')">[I13.BT02] Publicar</button>
        <button class="bg-gray-500 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I7', '${sp.id}')">[I13.BT03] Voltar</button>
    </div>
    `;
    return html;
}

function renderI14DetalheHistoricoDocumento() {
    const doc = getItemById(currentState.contextId) || {};
    const headerTitle = `${doc.status || 'Estado'} - ${doc.labelRegisto || 'Label Registo'} - ${doc.id || 'ID Registo'}`;

    let html = `
    <div class="mb-4">
        <h1 class="text-3xl font-bold mb-2">[I14] Interface 14 – Detalhe Histórico de Documento</h1>
        <h2 class="text-xl text-gray-600 font-semibold">${headerTitle}</h2>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-6 opacity-75 bg-white p-4 shadow rounded">
        <div><strong>[I14.LB01] Processo/Sub processo Associado:</strong> PROC-001</div>
        <div><strong>Código:</strong> ${doc.codigo || ''}</div>
        <div><strong>Designação:</strong> ${doc.designacao || ''}</div>
        <div><strong>Versão:</strong> ${doc.versao || ''}</div>
        <div><strong>Data de Elaboração:</strong> ${doc.dataElaboracao || ''}</div>
        <div><strong>Data de Revisão da versão:</strong> ${doc.dataRevisao || ''}</div>
        <div><strong>Tipo:</strong> ${doc.tipo || ''}</div>
        <div><strong>Estado:</strong> ${doc.status || ''}</div>
    </div>

    <div class="mb-6 bg-white p-4 shadow rounded opacity-75">
        <h2 class="font-bold text-lg mb-2">[I14.LST01] Lista de Ficheiros</h2>
        <ul class="list-disc pl-5">
            <li><button class="text-blue-600 underline" onclick="alert('Download do ficheiro histórico 1')">[I14.LST01.BT01] Download histórico 1.pdf</button></li>
        </ul>
    </div>

    <div class="flex justify-end gap-2 mt-6 border-t pt-4">
        <button class="bg-blue-600 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I10', '${doc.id}')">[I14.BT01] Edição</button>
        <button class="bg-green-600 text-white px-4 py-2 rounded shadow" onclick="guardarDocumento('publicar', '${doc.id}')">[I14.BT02] Publicar</button>
        <button class="bg-gray-500 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I11', '${doc.id}')">[I14.BT03] Voltar</button>
    </div>
    `;
    return html;
}

window.onload = render;// Initial render
