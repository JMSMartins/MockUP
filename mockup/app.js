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
    // Para simplificar o mockup, não lemos todos os campos do DOM, vamos apenas simular
    // o save de um novo ou existente com o estado correto.
    let processo = mockData.processos.find(x => x.id === id);
    let isNew = false;

    if (!processo) {
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
        alert('Guardado como Rascunho com sucesso! Este registo está agora disponível apenas nas listas de Rascunho (ex: I16).');
        navigateTo('I16');
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

    if (!sp) {
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
        alert('Guardado como Rascunho com sucesso!');
        navigateTo('I17');
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

    if (!doc) {
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
        alert('Guardado como Rascunho com sucesso!');
        navigateTo('I18');
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

// Action "Nova Revisão"
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
            navigateTo('I14', itemId); // [I14] Detalhe Histórico de Sub processo
        } else {
            navigateTo('I7', itemId);  // [I7] Detalhe de Sub processo (Ativo)
        }
    } else if (item._type === 'documento') {
        if (item.status === 'Inativo' || item.status === 'Rascunho') {
            navigateTo('I15', itemId); // [I15] Detalhe Histórico de Documento
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
    app.innerHTML = ''; // Clear current view

    switch (currentState.view) {
        case 'I1':
            app.innerHTML = renderI1ListaProcessos();
            break;
        case 'I2':
            app.innerHTML = renderI2CriacaoProcesso();
            break;
        case 'I3':
            app.innerHTML = renderI3DetalheProcessoAtivo();
            break;
        case 'I4':
            app.innerHTML = renderI4RevisaoProcesso();
            break;
        case 'I5':
            app.innerHTML = renderI5ListaSubProcessos();
            break;
        case 'I6':
            app.innerHTML = renderI6CriacaoSubProcesso();
            break;
        case 'I7':
            app.innerHTML = renderI7DetalheSubProcessoAtivo();
            break;
        case 'I8':
            app.innerHTML = renderI8RevisaoSubProcesso();
            break;
        case 'I9':
            app.innerHTML = renderI9ListaDocumentos();
            break;
        case 'I10':
            app.innerHTML = renderI10CriacaoDocumento();
            break;
        case 'I11':
            app.innerHTML = renderI11DetalheDocumentoAtivo();
            break;
        case 'I12':
            app.innerHTML = renderI12RevisaoDocumento();
            break;
        case 'I13':
            app.innerHTML = renderI13DetalheProcessoHistorico();
            break;
        case 'I14':
            app.innerHTML = renderI14DetalheHistoricoSubProcesso();
            break;
        case 'I15':
            app.innerHTML = renderI15DetalheHistoricoDocumento();
            break;
        case 'I16':
            app.innerHTML = renderI16ListaRascunhosProcessos();
            break;
        case 'I17':
            app.innerHTML = renderI17ListaRascunhosSubProcessos();
            break;
        case 'I18':
            app.innerHTML = renderI18ListaRascunhosDocumentos();
            break;
        default:
            app.innerHTML = `<div><h1>404 Not Found</h1><button onclick="navigateTo('I1')">Go Home</button></div>`;
    }
}

// ==========================================
// RENDERERS
// ==========================================

function renderI16ListaRascunhosProcessos() {
    let html = `<div class="flex justify-between items-center mb-4">
                    <h1 class="text-3xl font-bold">[I16] Lista de Processos em Rascunho</h1>
                </div>`;
    html += `<table class="min-w-full bg-white border"><thead class="bg-gray-200"><tr><th class="border px-4 py-2">Código</th><th class="border px-4 py-2">Nome</th><th class="border px-4 py-2">Versão</th><th class="border px-4 py-2">Ações</th></tr></thead><tbody>`;

    mockData.processos.filter(p => p.status === 'Rascunho').forEach(p => {
        html += `<tr>
            <td class="border px-4 py-2">${p.codigo}</td>
            <td class="border px-4 py-2">${p.nome}</td>
            <td class="border px-4 py-2">${p.versao}</td>
            <td class="border px-4 py-2">
                <button class="bg-blue-500 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I13', '${p.id}')">Detalhe</button>
                <button class="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I4', '${p.id}')">Edição</button>
                <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="eliminarProcesso('${p.id}')">Eliminar</button>
            </td>
        </tr>`;
    });
    html += `</tbody></table>`;
    return html;
}

function renderI17ListaRascunhosSubProcessos() {
    let html = `<div class="flex justify-between items-center mb-4">
                    <h1 class="text-3xl font-bold">[I17] Lista de Sub processos em Rascunho</h1>
                </div>`;
    html += `<table class="min-w-full bg-white border"><thead class="bg-gray-200"><tr><th class="border px-4 py-2">Código Pai</th><th class="border px-4 py-2">Código</th><th class="border px-4 py-2">Nome</th><th class="border px-4 py-2">Versão</th><th class="border px-4 py-2">Ações</th></tr></thead><tbody>`;

    mockData.subProcessos.filter(sp => sp.status === 'Rascunho').forEach(sp => {
        html += `<tr>
            <td class="border px-4 py-2">${sp.processoPaiId}</td>
            <td class="border px-4 py-2">${sp.codigo}</td>
            <td class="border px-4 py-2">${sp.nome}</td>
            <td class="border px-4 py-2">${sp.versao}</td>
            <td class="border px-4 py-2">
                <button class="bg-blue-500 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I14', '${sp.id}')">Detalhe</button>
                <button class="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I8', '${sp.id}')">Edição</button>
                <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="eliminarSubProcesso('${sp.id}')">Eliminar</button>
            </td>
        </tr>`;
    });
    html += `</tbody></table>`;
    return html;
}

function renderI18ListaRascunhosDocumentos() {
    let html = `<div class="flex justify-between items-center mb-4">
                    <h1 class="text-3xl font-bold">[I18] Lista de Documentos em Rascunho</h1>
                </div>`;
    html += `<table class="min-w-full bg-white border"><thead class="bg-gray-200"><tr><th class="border px-4 py-2">Código</th><th class="border px-4 py-2">Designação</th><th class="border px-4 py-2">Versão</th><th class="border px-4 py-2">Ações</th></tr></thead><tbody>`;

    mockData.documentos.filter(doc => doc.status === 'Rascunho').forEach(doc => {
        html += `<tr>
            <td class="border px-4 py-2">${doc.codigo}</td>
            <td class="border px-4 py-2">${doc.designacao}</td>
            <td class="border px-4 py-2">${doc.versao}</td>
            <td class="border px-4 py-2">
                <button class="bg-blue-500 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I15', '${doc.id}')">Detalhe</button>
                <button class="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I12', '${doc.id}')">Edição</button>
                <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="eliminarDocumento('${doc.id}')">Eliminar</button>
            </td>
        </tr>`;
    });
    html += `</tbody></table>`;
    return html;
}

function renderI1ListaProcessos() {
    let html = `<div class="flex justify-between items-center mb-4">
                    <h1 class="text-3xl font-bold">[I1] Lista de Processos</h1>
                    <button class="bg-green-600 text-white px-4 py-2 rounded shadow" onclick="navigateTo('I2')">Adicionar Processo</button>
                </div>`;

    html += `<div class="mb-4 flex gap-2">
                <input type="text" placeholder="Pesquisa (Código, Nome, Objetivo, Âmbito)" class="border p-2 rounded w-1/3">
                <button class="bg-blue-600 text-white px-4 py-2 rounded">Pesquisar</button>
             </div>`;

    html += `<table class="min-w-full bg-white border">
                <thead class="bg-gray-200">
                    <tr><th class="border px-4 py-2">Código</th><th class="border px-4 py-2">Nome</th><th class="border px-4 py-2">Versão</th><th class="border px-4 py-2">Status</th><th class="border px-4 py-2">Ações</th></tr>
                </thead>
                <tbody>`;

    // Só mostrar Ativos / Publicados
    mockData.processos.forEach(p => {
        if(p.status === 'Publicado') {
            html += `<tr>
                <td class="border px-4 py-2">${p.codigo}</td>
                <td class="border px-4 py-2">${p.nome}</td>
                <td class="border px-4 py-2">${p.versao}</td>
                <td class="border px-4 py-2"><span class="bg-green-100 text-green-800 px-2 py-1 rounded">${p.status}</span></td>
                <td class="border px-4 py-2">
                    <button class="bg-blue-500 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I3', '${p.id}')">Detalhe</button>
                    <button class="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I4', '${p.id}')">Editar (Revisão)</button>
                    <button class="bg-gray-500 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I5', '${p.id}')">Sub processos</button>
                    <button class="bg-indigo-500 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I9', '${p.id}')">Documentos</button>
                    <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="desativarProcesso('${p.id}')">Desativar</button>
                </td>
            </tr>`;
        }
    });

    html += `</tbody></table>`;
    return html;
}

function renderI2CriacaoProcesso() {
    let html = `<h1 class="text-3xl font-bold mb-4">[I2] Criação de Processo</h1>`;
    html += `<div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">Código</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Nome</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Objetivo</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Âmbito</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Data de Elaboração</label><input type="date" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Versão</label><input type="text" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Data de Revisão</label><input type="date" class="border p-2 w-full"></div>
        </div>
        <div class="mb-4">
            <h2 class="font-bold text-lg mb-2">Tabela de Donos do Processo</h2>
            <div class="flex gap-2 mb-2">
                <input type="text" placeholder="Email do dono" class="border p-2 flex-grow">
                <button class="bg-blue-600 text-white px-4 py-2 rounded">Adicionar</button>
            </div>
            <table class="w-full border text-left"><thead class="bg-gray-100"><tr><th class="p-2 border">Nome</th><th class="p-2 border">Email</th><th class="p-2 border">Ações</th></tr></thead><tbody><tr><td class="p-2 border">Atual Utilizador</td><td class="p-2 border">user@empresa.com</td><td class="p-2 border"><button class="text-red-600">Remover</button></td></tr></tbody></table>
        </div>
        <div class="flex gap-2 mt-6">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="guardarProcesso('rascunho')">Guardar como Rascunho</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="guardarProcesso('publicar')">Guardar e Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I1')">Voltar</button>
        </div>
    </div>`;
    return html;
}

function renderI3DetalheProcessoAtivo() {
    const p = getItemById(currentState.contextId);
    if(!p) return `Processo não encontrado. <button onclick="navigateTo('I1')">Voltar</button>`;

    let html = `<div class="mb-4 flex justify-between items-center">
                    <h1 class="text-3xl font-bold">[I3] Detalhe de Processo (Ativo)</h1>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow" onclick="novaRevisaoProcesso('${p.id}')">Nova Revisão</button>
                </div>`;

    html += `
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div><strong>Código:</strong> ${p.codigo}</div>
            <div><strong>Nome:</strong> ${p.nome}</div>
            <div><strong>Objetivo:</strong> ${p.objetivo}</div>
            <div><strong>Âmbito:</strong> ${p.ambito}</div>
            <div><strong>Data de Elaboração:</strong> ${p.dataElaboracao}</div>
            <div><strong>Data de Revisão:</strong> ${p.dataRevisao}</div>
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
                        <tr><th class="border px-4 py-2">Versão</th><th class="border px-4 py-2">Data Revisão</th><th class="border px-4 py-2">Ação</th></tr>
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
    let html = `<h1 class="text-3xl font-bold mb-4">[I4] Revisão (Edição de Processo)</h1>`;
    html += `<div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">Código (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${p.codigo}" readonly></div>
            <div><label class="block font-bold">Nome (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${p.nome}" readonly></div>
            <div><label class="block font-bold">Objetivo (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${p.objetivo}" readonly></div>
            <div><label class="block font-bold">Âmbito (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${p.ambito}" readonly></div>
            <div><label class="block font-bold">Data de Elaboração</label><input type="date" class="border p-2 w-full" value="${p.dataElaboracao}"></div>
            <div><label class="block font-bold">Versão</label><input type="text" class="border p-2 w-full" value="${p.versao}"></div>
            <div><label class="block font-bold">Data de Revisão</label><input type="date" class="border p-2 w-full" value="${p.dataRevisao}"></div>
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
            html += `<tr><td class="border px-4 py-2">${sp.codigo}</td><td class="border px-4 py-2">${sp.processoPaiId}</td><td class="border px-4 py-2">${sp.nome}</td><td class="border px-4 py-2"><button class="bg-blue-500 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I7', '${sp.id}')">Detalhe</button><button class="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onclick="navigateTo('I8', '${sp.id}')">Editar (Revisão)</button><button class="bg-red-500 text-white px-3 py-1 rounded" onclick="desativarSubProcesso('${sp.id}')">Desativar</button></td></tr>`;
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
                    <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow" onclick="alert('Funcionalidade Nova Revisão mockada')">Nova Revisão</button>
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
            <div><strong>Data Revisão:</strong> ${sp.dataRevisao}</div>
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
    let html = `<h1 class="text-3xl font-bold mb-4">[I8] Revisão de Sub processo</h1>`;
    html += `<div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">Processo Pai (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${sp.processoPaiId}" readonly></div>
            <div><label class="block font-bold">Código (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${sp.codigo}" readonly></div>
            <div><label class="block font-bold">Nome (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${sp.nome}" readonly></div>
            <div><label class="block font-bold">Versão</label><input type="text" class="border p-2 w-full" value="${sp.versao}"></div>
            <div><label class="block font-bold">Data de Revisão</label><input type="date" class="border p-2 w-full" value="${sp.dataRevisao}"></div>
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
            <div><label class="block font-bold">Tipo</label>
                <select class="border p-2 w-full">
                    <option>Instrumento</option><option>Regulamento</option><option>Orientação</option><option>Impresso</option>
                </select>
            </div>
            <div><label class="block font-bold">Upload Ficheiro</label><input type="file" class="border p-2 w-full"></div>
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
                    <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow" onclick="alert('Funcionalidade Nova Revisão mockada')">Nova Revisão</button>
                </div>`;

    html += `
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div><strong>Processo/Sub Processo Associado:</strong> P1-V2 (Mock)</div>
            <div><strong>Código:</strong> ${doc.codigo}</div>
            <div><strong>Designação:</strong> ${doc.designacao}</div>
            <div><strong>Versão:</strong> ${doc.versao}</div>
            <div><strong>Data Elaboração:</strong> ${doc.dataElaboracao}</div>
            <div><strong>Data Revisão:</strong> ${doc.dataRevisao}</div>
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
    let html = `<h1 class="text-3xl font-bold mb-4">[I12] Revisão de Documento</h1>`;
    html += `<div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">Processo Associado (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="P1-V2 (Mock)" readonly></div>
            <div><label class="block font-bold">Código (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${doc.codigo}" readonly></div>
            <div><label class="block font-bold">Designação (Imutável)</label><input type="text" class="border p-2 w-full bg-gray-100" value="${doc.designacao}" readonly></div>
            <div><label class="block font-bold">Versão</label><input type="text" class="border p-2 w-full" value="${doc.versao}"></div>
            <div><label class="block font-bold">Data de Revisão</label><input type="date" class="border p-2 w-full" value="${doc.dataRevisao}"></div>
            <div><label class="block font-bold">Tipo</label><select class="border p-2 w-full"><option selected>${doc.tipo}</option><option>Instrumento</option><option>Regulamento</option></select></div>
            <div><label class="block font-bold">Upload Novo Ficheiro</label><input type="file" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Download Atual</label><button class="bg-blue-600 text-white px-3 py-1 mt-2 rounded">Download</button></div>
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
            <div><strong>Data Revisão:</strong> ${sp.dataRevisao}</div>
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
            <div><strong>Data Revisão:</strong> ${doc.dataRevisao}</div>
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
            <div><strong>Data de Revisão:</strong> ${p.dataRevisao}</div>
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
