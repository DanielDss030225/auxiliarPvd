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

            // NOVO: Adicionar atributos para visibilidade condicional
            if (q.dependsOn) {
                questionEl.setAttribute('data-depends-on', q.dependsOn.questionId);
                questionEl.setAttribute('data-not-answer', q.dependsOn.notAnswerId);
                questionEl.style.display = 'none'; // Inicialmente oculto
            }

            const title = document.createElement('p');
            title.className = 'question-title';
            // Adiciona asterisco vermelho para campos obrigatórios (todos conforme TESTE.HTML)
            title.innerHTML = `${q.title} <span style="color: #c62828;">*</span>`;
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
                checkbox.setAttribute('data-question-id', q.id); // NOVO

                if (opt.exclusive) {
                    checkbox.setAttribute('data-exclusive', 'true'); // NOVO
                }

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
                        else {
                            textInput.classList.add('hidden');
                            textInput.value = ''; // Limpar ao desmarcar
                        }
                    });

                    optionsContainer.appendChild(textInput);
                }
            });

            questionEl.appendChild(optionsContainer);
            container.appendChild(questionEl);
        });
    }

    // NOVO: Configurar lógicas do formulário
    setupExclusiveCheckboxLogic();
    setupConditionalDisplay();
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

    // NOVO: Navegação via barra fixa
    const btnPrev = document.getElementById('btn-prev-tab');
    const btnNext = document.getElementById('btn-next-tab');

    if (btnPrev && btnNext) {
        btnPrev.addEventListener('click', navigateToPreviousTab);
        btnNext.addEventListener('click', navigateToNextTab);
        updateNavigationButtons(); // Atualizar estado inicial
    }

    // NOVO: Auto-preenchimento por RG
    dom.inputRgVitima.addEventListener('change', async (e) => {
        const rg = e.target.value.trim();
        if (rg.length < 3) return; // Evitar buscas curtas demais

        try {
            const snapshot = await db.ref(`DADOSGERAIS/${rg}`).once('value');
            const dadosVítima = snapshot.val();

            if (dadosVítima) {
                let parseado = dadosVítima;

                // Se for uma string que parece um array JSON (comum no Firebase dependendo de como foi salvo)
                if (typeof dadosVítima === 'string' && dadosVítima.trim().startsWith('[')) {
                    try {
                        parseado = JSON.parse(dadosVítima);
                    } catch (e) {
                        console.warn("Falha ao parsear JSON, tentando usar string pura");
                    }
                }

                let nomeEncontrado = null;
                if (Array.isArray(parseado)) {
                    nomeEncontrado = parseado[0];
                } else if (typeof parseado === 'object' && parseado !== null) {
                    nomeEncontrado = Object.values(parseado)[0];
                } else {
                    nomeEncontrado = parseado;
                }

                if (nomeEncontrado && typeof nomeEncontrado === 'string' && nomeEncontrado !== 'NULL') {
                    dom.inputNomeVitima.value = nomeEncontrado;
                    showToast(`Dados encontrados para o RG ${rg}!`, "success");
                }
            }
        } catch (err) {
            console.error("Erro ao buscar RG:", err);
        }
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

    // NOVO: Atualizar estado dos botões de navegação
    updateNavigationButtons();
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

    el.innerHTML = `
        <h3>${titulo}</h3>
        <p style="font-size: 11px; color: #999;">Atualizado em: ${dataDisplay}</p>
        <span class="status-badge">${status}</span>
    `;

    el.addEventListener('click', () => {
        carregarFormulario(item);
    });

    return el;
}

function calcularStatus(dados) {
    // 1. Nome da Vítima é obrigatório
    if (!dados.nomeVitima || dados.nomeVitima.trim() === '') return 'Incompleto';

    // 2. Todas as perguntas visíveis devem ter resposta
    const respostas = dados.respostas || {};

    // Itera por todas as abas e perguntas
    for (const [tabId, questions] of Object.entries(questionsData)) {
        for (const q of questions) {
            // Verificar se a pergunta está visível
            let isVisible = true;
            if (q.dependsOn) {
                const restrictiveAnswered = respostas[q.dependsOn.notAnswerId];
                if (restrictiveAnswered) {
                    isVisible = false;
                }
            }

            if (isVisible) {
                // Verificar se há pelo menos uma resposta para esta pergunta
                const hasAnswer = q.options.some(opt => respostas[opt.id]);
                if (!hasAnswer) return 'Incompleto';
            }
        }
    }

    return 'Completo';
}

function resetForm() {
    dom.inputNomeVitima.value = '';
    dom.inputRgVitima.value = '';

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
        showToast("Por favor, preencha pelo menos o Nome da Vítima.", "error");
        return;
    }

    // Coletar respostas
    const respostas = {};
    const respostasExtras = {};

    document.querySelectorAll('.response-checkbox:checked').forEach(cb => {
        respostas[cb.value] = true;
        const extraInput = document.querySelector(`input.extra-text-input[data-for-check="${cb.value}"]`);
        if (extraInput && extraInput.value.trim()) {
            respostasExtras[cb.value] = extraInput.value.trim();
        }
    });

    const dadosParaSalvar = {
        nomeVitima: nomeVitima,
        rgVitima: dom.inputRgVitima.value.trim(),
        ultimaAtualizacao: new Date().toLocaleString('pt-BR'),
        respostas: respostas,
        respostasExtras: respostasExtras
    };

    if (isNew) {
        // Novo registro: push() gera chave única
        db.ref('AvaliacoesDeRisco').push(dadosParaSalvar).then(() => {
            showToast("Avaliação criada com sucesso!", "success");
            navigate('dashboard');
        }).catch(err => {
            console.error(err);
            showToast("Erro ao criar: " + err.message, "error");
        });
    } else {
        // Edição: usa currentId
        if (!currentId) {
            showToast("Erro fatal: ID do registro perdido.", "error");
            return;
        }
        db.ref(`AvaliacoesDeRisco/${currentId}`).update(dadosParaSalvar).then(() => {
            showToast("Avaliação atualizada com sucesso!", "success");
            navigate('dashboard');
        }).catch(err => {
            console.error(err);
            showToast("Erro ao atualizar: " + err.message, "error");
        });
    }
}

// ===== NOVAS FUNÇÕES: LÓGICAS DO REDS =====

// Configurar lógica de checkboxes exclusivos
function setupExclusiveCheckboxLogic() {
    document.querySelectorAll('.response-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (!e.target.checked) {
                // Atualizar visibilidade ao desmarcar
                updateConditionalQuestions();
                return;
            }

            const questionId = e.target.getAttribute('data-question-id');
            const isExclusive = e.target.getAttribute('data-exclusive') === 'true';

            if (isExclusive) {
                // Desmarcar todos os outros da MESMA pergunta
                document.querySelectorAll(
                    `.response-checkbox[data-question-id="${questionId}"]:not([value="${e.target.value}"])`
                ).forEach(cb => {
                    cb.checked = false;
                    // Ocultar e limpar inputs extras
                    const extraInput = document.querySelector(`[data-for-check="${cb.value}"]`);
                    if (extraInput) {
                        extraInput.classList.add('hidden');
                        extraInput.value = '';
                    }
                });
            } else {
                // Desmarcar apenas as exclusivas da MESMA pergunta
                document.querySelectorAll(
                    `.response-checkbox[data-question-id="${questionId}"][data-exclusive="true"]`
                ).forEach(cb => {
                    cb.checked = false;
                    const extraInput = document.querySelector(`[data-for-check="${cb.value}"]`);
                    if (extraInput) {
                        extraInput.classList.add('hidden');
                        extraInput.value = '';
                    }
                });
            }

            // Atualizar perguntas dependentes
            updateConditionalQuestions();
        });
    });
}

// Configurar visibilidade condicional de perguntas
function setupConditionalDisplay() {
    // Inicializar visibilidade ao carregar
    updateConditionalQuestions();
}

function updateConditionalQuestions() {
    document.querySelectorAll('[data-depends-on]').forEach(questionBlock => {
        const dependsOnQuestionId = questionBlock.getAttribute('data-depends-on');
        const notAnswerId = questionBlock.getAttribute('data-not-answer');

        // Verificar se a resposta restritiva está marcada
        const restrictiveCheckbox = document.querySelector(
            `.response-checkbox[data-question-id="${dependsOnQuestionId}"][value="${notAnswerId}"]`
        );

        if (restrictiveCheckbox && restrictiveCheckbox.checked) {
            // Ocultar pergunta
            questionBlock.style.display = 'none';
            // Desmarcar todas as respostas desta pergunta
            questionBlock.querySelectorAll('.response-checkbox:checked').forEach(cb => {
                cb.checked = false;
                const extraInput = document.querySelector(`[data-for-check="${cb.value}"]`);
                if (extraInput) {
                    extraInput.value = '';
                    extraInput.classList.add('hidden');
                }
            });
        } else {
            // Mostrar pergunta
            questionBlock.style.display = 'block';
        }
    });
}

// Ordem das abas para navegação
const tabOrder = ['tab-dados-gerais', 'tab-historico', 'tab-agressor', 'tab-vitima', 'tab-outros'];

function navigateToPreviousTab() {
    const currentTab = document.querySelector('.tab-content.active').id;
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex > 0) {
        switchTab(tabOrder[currentIndex - 1]);
    }
}

function navigateToNextTab() {
    const currentTab = document.querySelector('.tab-content.active').id;
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex < tabOrder.length - 1) {
        switchTab(tabOrder[currentIndex + 1]);
    }
}

function updateNavigationButtons() {
    const currentTab = document.querySelector('.tab-content.active');
    if (!currentTab) return;

    const currentIndex = tabOrder.indexOf(currentTab.id);

    const btnPrev = document.getElementById('btn-prev-tab');
    const btnNext = document.getElementById('btn-next-tab');

    if (btnPrev && btnNext) {
        btnPrev.disabled = (currentIndex === 0);
        btnNext.disabled = (currentIndex === tabOrder.length - 1);
    }
}

// Mostrar notificação mobile (Toast)
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Remover do DOM após animação
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
