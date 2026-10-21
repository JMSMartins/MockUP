const fs = require('fs');
let appJs = fs.readFileSync('mockup/app.js', 'utf8');

// Replace "Revisão" with "Edição" globally in app.js where appropriate
// Except "Data de revisão da versão"
appJs = appJs.replace(/>Revisão</g, ">Edição<");
appJs = appJs.replace(/Revisão de Processo/g, "Edição de Processo");
appJs = appJs.replace(/Revisão de Documento/g, "Edição de Documento");
appJs = appJs.replace(/Revisão de Sub Processo/g, "Edição de Sub Processo");
appJs = appJs.replace(/\[I4\] Revisão de Processo/g, "[I4] Edição de Processo");
appJs = appJs.replace(/function novaRevisaoProcesso/g, "function novaEdicaoProcesso");
appJs = appJs.replace(/onclick="novaRevisaoProcesso/g, 'onclick="novaEdicaoProcesso');

const oldRenderI4 = /function renderI4RevisaoProcesso\(\) \{[\s\S]*?return html;\n\}/;
const newRenderI4 = `
function renderI4RevisaoProcesso() {
    const p = getItemById(currentState.contextId);
    let html = \`<h1 class="text-3xl font-bold mb-4">[I4] Edição de Processo</h1>\`;
    html += \`<div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">Label de Registo</label><input type="text" id="i4_labelRegisto" class="border p-2 w-full" value="\${p.labelRegisto || ''}"></div>
            <div><label class="block font-bold">Código (Imutável)</label><input type="text" id="i4_codigo" class="border p-2 w-full bg-gray-100" value="\${p.codigo}" readonly></div>

            <div><label class="block font-bold">Nome (Imutável)</label><input type="text" id="i4_nome" class="border p-2 w-full bg-gray-100" value="\${p.nome}" readonly></div>
            <div><label class="block font-bold">Objetivo (Imutável)</label><input type="text" id="i4_objetivo" class="border p-2 w-full bg-gray-100" value="\${p.objetivo}" readonly></div>

            <div><label class="block font-bold">Âmbito (Imutável)</label><input type="text" id="i4_ambito" class="border p-2 w-full bg-gray-100" value="\${p.ambito}" readonly></div>
            <div><label class="block font-bold">Data de Elaboração</label><input type="date" id="i4_dataElaboracao" class="border p-2 w-full" value="\${p.dataElaboracao || ''}"></div>

            <div><label class="block font-bold">Donos do Processo</label><input type="text" id="i4_donos" class="border p-2 w-full" value="\${p.donos || ''}"></div>
            <div><label class="block font-bold">Versão</label><input type="text" id="i4_versao" class="border p-2 w-full" value="\${p.versao || ''}"></div>

            <div><label class="block font-bold">Data de revisão da versão</label><input type="date" id="i4_dataRevisao" class="border p-2 w-full" value="\${p.dataRevisao || ''}"></div>
            <div><label class="block font-bold">Riscos Relevantes</label><input type="text" id="i4_riscosRelevantes" class="border p-2 w-full" value="\${p.riscosRelevantes || ''}"></div>

            <div><label class="block font-bold">Oportunidades</label><input type="text" id="i4_oportunidades" class="border p-2 w-full" value="\${p.oportunidades || ''}"></div>
            <div><label class="block font-bold">Entradas</label><input type="text" id="i4_entradas" class="border p-2 w-full" value="\${p.entradas || ''}"></div>

            <div><label class="block font-bold">Saídas</label><input type="text" id="i4_saidas" class="border p-2 w-full" value="\${p.saidas || ''}"></div>
            <div><label class="block font-bold">Indicadores de Sucesso</label><input type="text" id="i4_indicadoresSucesso" class="border p-2 w-full" value="\${p.indicadoresSucesso || ''}"></div>

            <div><label class="block font-bold">Partes Interessadas Externas</label><input type="text" id="i4_partesInteressadasExternas" class="border p-2 w-full" value="\${p.partesInteressadasExternas || ''}"></div>
            <div><label class="block font-bold">Partes Interessadas Internas</label><input type="text" id="i4_partesInteressadasInternas" class="border p-2 w-full" value="\${p.partesInteressadasInternas || ''}"></div>

            <div class="col-span-2"><label class="block font-bold">Referenciais</label><input type="text" id="i4_referenciais" class="border p-2 w-full" value="\${p.referenciais || ''}"></div>
        </div>

        <div class="flex gap-2 mt-6">
            <button class="bg-yellow-500 text-white px-4 py-2 rounded" onclick="guardarProcessoI4('\${p.id}', 'Rascunho')">Guardar como Rascunho</button>
            <button class="bg-green-600 text-white px-4 py-2 rounded" onclick="guardarProcessoI4('\${p.id}', 'Publicado')">Guardar e Publicar</button>
            <button class="bg-gray-500 text-white px-4 py-2 rounded" onclick="navigateTo('I1')">Voltar</button>
        </div>
    </div>\`;
    return html;
}

function guardarProcessoI4(originalId, status) {
    const original = getItemById(originalId);
    if(!original) return;

    const novosDados = {
        labelRegisto: document.getElementById('i4_labelRegisto').value,
        dataElaboracao: document.getElementById('i4_dataElaboracao').value,
        donos: document.getElementById('i4_donos').value,
        versao: document.getElementById('i4_versao').value,
        dataRevisao: document.getElementById('i4_dataRevisao').value,
        riscosRelevantes: document.getElementById('i4_riscosRelevantes').value,
        oportunidades: document.getElementById('i4_oportunidades').value,
        entradas: document.getElementById('i4_entradas').value,
        saidas: document.getElementById('i4_saidas').value,
        indicadoresSucesso: document.getElementById('i4_indicadoresSucesso').value,
        partesInteressadasExternas: document.getElementById('i4_partesInteressadasExternas').value,
        partesInteressadasInternas: document.getElementById('i4_partesInteressadasInternas').value,
        referenciais: document.getElementById('i4_referenciais').value
    };

    if (original.status === 'Publicado' && status === 'Rascunho') {
        // Create Draft Replica
        const replica = {
            ...original,
            ...novosDados,
            id: 'P' + Date.now(), // New ID for replica
            status: 'Rascunho'
        };
        mockData.processos.push(replica);
        alert('Criada nova cópia em Rascunho. O original ativo permanece inalterado.');
    } else if (original.status === 'Publicado' && status === 'Publicado') {
        // Publish new version, set old to inactive
        const newVersion = {
            ...original,
            ...novosDados,
            id: 'P' + Date.now(),
            status: 'Publicado'
        };
        original.status = 'Inativo';
        mockData.processos.push(newVersion);
        alert('Nova versão publicada. A versão anterior foi inativada.');
    } else if (original.status === 'Rascunho' && status === 'Rascunho') {
        // Update existing draft
        Object.assign(original, novosDados);
        alert('Rascunho atualizado.');
    } else if ((original.status === 'Rascunho' || original.status === 'Inativo') && status === 'Publicado') {
        // Publish this record, inactivate currently active record of the same code
        Object.assign(original, novosDados);
        original.status = 'Publicado';
        mockData.processos.forEach(p => {
            if (p.codigo === original.codigo && p.id !== original.id && p.status === 'Publicado') {
                p.status = 'Inativo';
            }
        });
        alert('Registo publicado. Qualquer versão anterior ativa foi inativada.');
    } else if (original.status === 'Inativo' && status === 'Rascunho') {
        // Edit inactive to draft (duplicate)
        const replica = {
            ...original,
            ...novosDados,
            id: 'P' + Date.now(), // New ID for replica
            status: 'Rascunho'
        };
        mockData.processos.push(replica);
        alert('Criado novo Rascunho a partir do histórico.');
    }

    navigateTo('I1');
}

function novaEdicaoProcesso(id) {
    navigateTo('I4', id);
}
`;

appJs = appJs.replace(oldRenderI4, newRenderI4);

// Remove the old guardarProcesso logic if it exists (we replaced its usage for I2 and I4 with specific functions)
appJs = appJs.replace(/function guardarProcesso\(actionType, id = null\) \{[\s\S]*?navigateTo\('I1'\);\n    \}\n\}/g, '');

fs.writeFileSync('mockup/app.js', appJs);
console.log('Updated Logic and terminology in app.js');
