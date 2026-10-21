const fs = require('fs');

let appJs = fs.readFileSync('mockup/app.js', 'utf8');

const regex = /const mockData = {[\s\S]*?processos: \[[\s\S]*?\],/m;

const newMockData = `const mockData = {
    processos: [
        {
            id: 'P1-V2',
            labelRegisto: 'Versão de Sistema 2',
            codigo: 'PROC-001',
            nome: 'Gestão de Qualidade',
            objetivo: 'Garantir padrões de qualidade',
            ambito: 'Toda a empresa',
            dataElaboracao: '2026-01-10',
            donos: 'João Silva',
            versao: '2.0',
            dataRevisao: '2026-10-15',
            status: 'Publicado',
            riscosRelevantes: 'Risco de falha de sistema',
            oportunidades: 'Melhoria de processos internos',
            entradas: 'Dados de auditoria',
            saidas: 'Relatórios de qualidade',
            indicadoresSucesso: 'Taxa de conformidade de 99%',
            partesInteressadasExternas: 'Fornecedores',
            partesInteressadasInternas: 'Colaboradores',
            referenciais: 'ISO 9001',
            // Active associations
            subProcessosId: ['SP1-V1'],
            documentosId: ['DOC1-V2', 'DOC2-V1']
        },
        {
            id: 'P1-V1',
            labelRegisto: 'Versão de Sistema 1',
            codigo: 'PROC-001',
            nome: 'Gestão de Qualidade',
            objetivo: 'Garantir padrões mínimos de qualidade',
            ambito: 'Toda a empresa',
            dataElaboracao: '2025-01-10',
            donos: 'João Silva',
            versao: '1.0',
            dataRevisao: '2025-01-10',
            status: 'Inativo',
            riscosRelevantes: 'Risco de falha de sistema',
            oportunidades: 'Melhoria de processos internos',
            entradas: 'Dados de auditoria',
            saidas: 'Relatórios de qualidade',
            indicadoresSucesso: 'Taxa de conformidade de 95%',
            partesInteressadasExternas: 'Fornecedores',
            partesInteressadasInternas: 'Colaboradores',
            referenciais: 'ISO 9001',
            // Historical associations (Snapshot of the time)
            subProcessosId: ['SP1-V1'], // Notice SP1-V1 is still the active version today
            documentosId: ['DOC1-V1', 'DOC2-V1'] // DOC1-V1 is historical, DOC2-V1 is active
        },
        {
            id: 'P2-V1',
            labelRegisto: 'Versão de Sistema 1',
            codigo: 'PROC-002',
            nome: 'Gestão Financeira',
            objetivo: 'Controlo financeiro',
            ambito: 'Dpt Financeiro',
            dataElaboracao: '2024-05-20',
            donos: 'Maria Costa',
            versao: '1.0',
            dataRevisao: '2024-05-20',
            status: 'Rascunho',
            riscosRelevantes: 'Perda de dados financeiros',
            oportunidades: 'Otimização de custos',
            entradas: 'Faturas, recibos',
            saidas: 'Balanços',
            indicadoresSucesso: 'Redução de custos em 10%',
            partesInteressadasExternas: 'Bancos, Finanças',
            partesInteressadasInternas: 'Gestão de Topo',
            referenciais: 'Normas Contabilísticas',
            subProcessosId: [],
            documentosId: []
        }
    ],`;

appJs = appJs.replace(regex, newMockData);
fs.writeFileSync('mockup/app.js', appJs);
console.log('Updated mockData in mockup/app.js');
