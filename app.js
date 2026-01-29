// --- Estado da Aplicação ---
let currentId = null;
let currentFormData = {};
let isNew = false;

// --- Elementos DOM ---
const views = {
    dashboard: document.getElementById('view-dashboard'),
    form: document.getElementById('view-formulario')
};

const dom = {
    listaAvaliacoes: document.getElementById('lista-avaliacoes'),
    btnNovaAvaliacao: document.getElementById('btn-nova-avaliacao'),
    btnVoltarDashboard: document.getElementById('btn-voltar-dashboard'),
    btnSalvar: document.getElementById('btn-salvar'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    // Novos inputs
    inputNomeVitima: document.getElementById('input_nome_vitima'),
    inputRgVitima: document.getElementById('input_rg_vitima'),
    inputNomeAutor: document.getElementById('input_nome_autor'),
    inputRgAutor: document.getElementById('input_rg_autor'),

    formTitle: document.getElementById('form-title')
};

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    renderizarFormulario();
    carregarListaAvaliacoes();
    setupEventListeners();
});

function renderizarFormulario() {
    // Itera sobre as abas definidas em questionsData
    for (const [tabId, questions] of Object.entries(questionsData)) {
        const container = document.getElementById(tabId.replace('tab-', 'container-'));
        if (!container) continue;

        container.innerHTML = '';
        questions.forEach(q => {
            const questionEl = document.createElement('div');
            questionEl.className = 'question-block';

            const title = document.createElement('p');
            title.className = 'question-title';
            title.textContent = q.title;
            questionEl.appendChild(title);

            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'options-container';

            q.options.forEach(opt => {
                const label = document.createElement('label');
                label.className = 'option-item';

                // Checkbox Input
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = `resp_${opt.id}`;
                checkbox.value = opt.id;
                checkbox.className = 'response-checkbox';

                // Texto da opção
                const textSpan = document.createElement('span');
                textSpan.textContent = opt.label;

                label.appendChild(checkbox);
                label.appendChild(textSpan);

                optionsContainer.appendChild(label);

                // Input de texto adicional (se houver)
                if (opt.hasInput) {
                    const textInput = document.createElement('input');
                    textInput.type = 'text';
                    textInput.className = 'extra-text-input hidden';
                    textInput.placeholder = 'Detalhes...';
                    textInput.setAttribute('data-for-check', opt.id);

                    // Mostra/Oculta input extra
                    checkbox.addEventListener('change', () => {
                        if (checkbox.checked) textInput.classList.remove('hidden');
                        else textInput.classList.add('hidden');
                    });

                    optionsContainer.appendChild(textInput);
                }
            });

            questionEl.appendChild(optionsContainer);
            container.appendChild(questionEl);
        });
    }
}

function setupEventListeners() {
    // Navegação Dashboard -> Form (Novo)
    dom.btnNovaAvaliacao.addEventListener('click', () => {
        resetForm();
        isNew = true;
        currentId = null;
        dom.formTitle.textContent = "Nova Avaliação";
        navigate('form');
    });

    // Navegação Form -> Dashboard (Voltar)
    dom.btnVoltarDashboard.addEventListener('click', () => {
        navigate('dashboard');
    });

    // Salvar
    dom.btnSalvar.addEventListener('click', salvarDados);

    // Abas
    dom.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            switchTab(targetId);
        });
    });
}

function navigate(viewName) {
    // Simplificado para garantir funcionamento sem animações complexas primeiro
    Object.values(views).forEach(el => {
        el.classList.remove('active');
        el.classList.add('hidden');
    });

    const target = (viewName === 'dashboard') ? views.dashboard : views.form;
    target.classList.remove('hidden');
    // Pequeno timeout para permitir que o navegador processe a remoção do display:none
    setTimeout(() => {
        target.classList.add('active');
    }, 50);
}

function switchTab(tabId) {
    // Atualiza botões
    dom.tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
            // Scroll botão para visibilidade se necessário
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
            btn.classList.remove('active');
        }
    });

    // Atualiza Conteúdo
    dom.tabContents.forEach(content => {
        if (content.id === tabId) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// --- Lógica de Dados (Firebase) ---

function carregarListaAvaliacoes() {
    // Escuta em tempo real
    db.ref('AvaliacoesDeRisco').on('value', (snapshot) => {
        dom.listaAvaliacoes.innerHTML = '';
        const data = snapshot.val();

        if (!data) {
            dom.listaAvaliacoes.innerHTML = '<div class="loading-spinner">Nenhuma avaliação encontrada.</div>';
            return;
        }

        // Converte objeto em array e inverte ordem (mais recente primeiro?)
        // Assumindo que as chaves são os números de REDS
        const lista = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value
        }));

        lista.forEach(item => {
            const card = criarCardAvaliacao(item);
            dom.listaAvaliacoes.appendChild(card);
        });
    });
}

function criarCardAvaliacao(item) {
    const el = document.createElement('div');
    const status = calcularStatus(item);
    el.className = `card status-${status.toLowerCase()}`;

    const dataDisplay = item.ultimaAtualizacao || 'Data desconhecida';
    // Exibe Nome da Vítima como título principal
    const titulo = item.nomeVitima || 'Vítima Não Identificada';
    const sub = item.nomeAutor ? `Autor: ${item.nomeAutor}` : 'Autor não informado';

    el.innerHTML = `
        <h3>${titulo}</h3>
        <p style="margin-bottom: 4px;">${sub}</p>
        <p style="font-size: 11px; color: #999;">Atualizado em: ${dataDisplay}</p>
        <span class="status-badge">${status}</span>
    `;

    el.addEventListener('click', () => {
        carregarFormulario(item);
    });

    return el;
}

function calcularStatus(dados) {
    if (dados.nomeVitima && Object.keys(dados.respostas || {}).length > 3) return 'Completo';
    return 'Incompleto';
}

function resetForm() {
    dom.inputNomeVitima.value = '';
    dom.inputRgVitima.value = '';
    dom.inputNomeAutor.value = '';
    dom.inputRgAutor.value = '';

    // Limpar todos os checkboxes e inputs de texto
    document.querySelectorAll('.response-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('.extra-text-input').forEach(input => {
        input.value = '';
        input.classList.add('hidden');
    });

    switchTab('tab-dados-gerais');
    currentFormData = {};
}

function carregarFormulario(dados) {
    resetForm();
    isNew = false;
    currentId = dados.id;
    currentFormData = dados;

    dom.inputNomeVitima.value = dados.nomeVitima || '';
    dom.inputRgVitima.value = dados.rgVitima || '';
    dom.inputNomeAutor.value = dados.nomeAutor || '';
    dom.inputRgAutor.value = dados.rgAutor || '';

    dom.formTitle.textContent = `Editando: ${dados.nomeVitima || 'Registro'}`;

    // Preencher dados dinâmicos
    if (dados.respostas) {
        Object.keys(dados.respostas).forEach(key => {
            const checkbox = document.querySelector(`input[type="checkbox"][value="${key}"]`);
            if (checkbox) {
                checkbox.checked = true;
                const extraInput = document.querySelector(`input.extra-text-input[data-for-check="${key}"]`);
                if (extraInput) {
                    extraInput.classList.remove('hidden');
                    if (dados.respostasExtras && dados.respostasExtras[key]) {
                        extraInput.value = dados.respostasExtras[key];
                    }
                }
            }
        });
    }

    navigate('form');
}

function salvarDados() {
    const nomeVitima = dom.inputNomeVitima.value.trim();

    if (!nomeVitima) {
        alert("Por favor, preencha pelo menos o Nome da Vítima.");
        return;
    }

    // Coletar respostas
    const respostas = {};
    const respostasExtras = {};

    document.querySelectorAll('.response-checkbox:checked').forEach(cb => {
        respostas[cb.value] = true;
        const extraInput = document.querySelector(`input.extra-text-input[data-for-check="${cb.value}"]`);
        if (extraInput) {
            respostasExtras[cb.value] = extraInput.value;
        }
    });

    const dadosParaSalvar = {
        nomeVitima: nomeVitima,
        rgVitima: dom.inputRgVitima.value.trim(),
        nomeAutor: dom.inputNomeAutor.value.trim(),
        rgAutor: dom.inputRgAutor.value.trim(),
        ultimaAtualizacao: new Date().toLocaleString('pt-BR'),
        respostas: respostas,
        respostasExtras: respostasExtras
    };

    if (isNew) {
        // Novo registro: push() gera chave única
        db.ref('AvaliacoesDeRisco').push(dadosParaSalvar).then(() => {
            alert("Avaliação criada com sucesso!");
            navigate('dashboard');
        }).catch(err => {
            console.error(err);
            alert("Erro ao criar: " + err.message);
        });
    } else {
        // Edição: usa currentId
        if (!currentId) {
            alert("Erro fatal: ID do registro perdido.");
            return;
        }
        db.ref(`AvaliacoesDeRisco/${currentId}`).update(dadosParaSalvar).then(() => {
            alert("Avaliação atualizada com sucesso!");
            navigate('dashboard');
        }).catch(err => {
            console.error(err);
            alert("Erro ao atualizar: " + err.message);
        });
    }
}
