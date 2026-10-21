const fs = require('fs');
let appJs = fs.readFileSync('mockup/app.js', 'utf8');

const oldRenderI2 = /function renderI2CriacaoProcesso\(\) \{[\s\S]*?return html;\n\}/;

const newRenderI2 = `
function renderI2CriacaoProcesso() {
    let html = \`<h1 class="text-3xl font-bold mb-4">[I2] Criação de Processo</h1>\`;
    html += \`<div class="bg-white p-6 border rounded shadow-sm">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block font-bold">Label de Registo</label><input type="text" id="i2_labelRegisto" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Código</label><input type="text" id="i2_codigo" class="border p-2 w-full"></div>

            <div><label class="block font-bold">Nome</label><input type="text" id="i2_nome" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Objetivo</label><input type="text" id="i2_objetivo" class="border p-2 w-full"></div>

            <div><label class="block font-bold">Âmbito</label><input type="text" id="i2_ambito" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Data de Elaboração</label><input type="date" id="i2_dataElaboracao" class="border p-2 w-full"></div>

            <div><label class="block font-bold">Donos do Processo</label><input type="text" id="i2_donos" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Versão</label><input type="text" id="i2_versao" class="border p-2 w-full"></div>

            <div><label class="block font-bold">Data de revisão da versão</label><input type="date" id="i2_dataRevisao" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Riscos Relevantes</label><input type="text" id="i2_riscosRelevantes" class="border p-2 w-full"></div>

            <div><label class="block font-bold">Oportunidades</label><input type="text" id="i2_oportunidades" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Entradas</label><input type="text" id="i2_entradas" class="border p-2 w-full"></div>

            <div><label class="block font-bold">Saídas</label><input type="text" id="i2_saidas" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Indicadores de Sucesso</label><input type="text" id="i2_indicadoresSucesso" class="border p-2 w-full"></div>

            <div><label class="block font-bold">Partes Interessadas Externas</label><input type="text" id="i2_partesInteressadasExternas" class="border p-2 w-full"></div>
            <div><label class="block font-bold">Partes Interessadas Internas</label><input type="text" id="i2_partesInteressadasInternas" class="border p-2 w-full"></div>

            <div class="col-span-2"><label class="block font-bold">Referenciais</label><input type="text" id="i2_referenciais" class="border p-2 w-full"></div>
        </div>

        <div class="flex gap-2 mt-6">
            <button class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded" onclick="guardarProcessoI2('Rascunho')">Guardar como Rascunho</button>
            <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded" onclick="guardarProcessoI2('Publicado')">Guardar e Publicar</button>
            <button class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded" onclick="navigateTo('I1')">Voltar</button>
        </div>
    </div>\`;
    return html;
}

function guardarProcessoI2(status) {
    const cod = document.getElementById('i2_codigo').value.trim();
    if(status === 'Publicado' && !cod) {
        alert('Código é obrigatório.');
        return;
    }

    // Verificacao de codigo unico para processos ativos
    if(status === 'Publicado' && mockData.processos.find(p => p.codigo === cod && p.status === 'Publicado')) {
        alert('Erro: Já existe um processo ativo com este código.');
        return;
    }

    const novoProcesso = {
        id: 'P' + Date.now(),
        labelRegisto: document.getElementById('i2_labelRegisto').value,
        codigo: cod,
        nome: document.getElementById('i2_nome').value,
        objetivo: document.getElementById('i2_objetivo').value,
        ambito: document.getElementById('i2_ambito').value,
        dataElaboracao: document.getElementById('i2_dataElaboracao').value,
        donos: document.getElementById('i2_donos').value,
        versao: document.getElementById('i2_versao').value,
        dataRevisao: document.getElementById('i2_dataRevisao').value,
        status: status,
        riscosRelevantes: document.getElementById('i2_riscosRelevantes').value,
        oportunidades: document.getElementById('i2_oportunidades').value,
        entradas: document.getElementById('i2_entradas').value,
        saidas: document.getElementById('i2_saidas').value,
        indicadoresSucesso: document.getElementById('i2_indicadoresSucesso').value,
        partesInteressadasExternas: document.getElementById('i2_partesInteressadasExternas').value,
        partesInteressadasInternas: document.getElementById('i2_partesInteressadasInternas').value,
        referenciais: document.getElementById('i2_referenciais').value,
        subProcessosId: [],
        documentosId: []
    };

    mockData.processos.push(novoProcesso);

    alert('Processo guardado com sucesso.');
    navigateTo('I1');
}
`;

appJs = appJs.replace(oldRenderI2, newRenderI2);

fs.writeFileSync('mockup/app.js', appJs);
console.log('Updated I2 in mockup/app.js');
