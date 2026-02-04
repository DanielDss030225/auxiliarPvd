// --- Estado da Aplicação ---
let currentId = null;
let currentFormData = {};
let isNew = false;

// --- Configuração API ---
const API_BASE_URL = "https://auxiliar-pvd-be.vercel.app"; // URL DE PRODUÇÃO NO VERCEL

// --- Elementos DOM ---
const views = {
    login: document.getElementById('view-login'),
    dashboard: document.getElementById('view-dashboard'),
    form: document.getElementById('view-formulario')
};

const dom = {
    listaAvaliacoes: document.getElementById('lista-avaliacoes'),
    btnNovaAvaliacao: document.getElementById('btn-nova-avaliacao'),
    btnVoltarDashboard: document.getElementById('btn-voltar-dashboard'),
    btnSalvar: document.getElementById('btn-salvar'),
    btnExcluir: document.getElementById('btn-excluir'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    // Novos inputs
    inputNomeVitima: document.getElementById('input_nome_vitima'),
    inputRgVitima: document.getElementById('input_rg_vitima'),
    inputBreveHistorico: document.getElementById('input_breve_historico'),

    formTitle: document.getElementById('form-title'),
    // Pesquisa
    searchBar: document.getElementById('search-bar'),
    btnOpenSearch: document.getElementById('btn-open-search'),
    btnCloseSearch: document.getElementById('btn-close-search'),
    inputSearch: document.getElementById('input-search'),

    // Login
    inputLoginUsuario: document.getElementById('login_usuario'),
    inputLoginSenha: document.getElementById('login_senha'),
    btnLogin: document.getElementById('btn-login'),
    btnLogout: document.getElementById('btn-logout'),
    loginError: document.getElementById('login-error')
};

let listaCompleta = [];
let offlineQueue = JSON.parse(localStorage.getItem('offline_queue') || '[]');

// --- Sincronização Offline ---
function syncOfflineItems() {
    if (!navigator.onLine || offlineQueue.length === 0) return;

    showToast("Sincronizando avaliações offline...", "info");

    const queueCopy = [...offlineQueue];
    const promises = queueCopy.map(async (item) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/risk-assessments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: item.data }) // item.data já deve conter tudo
            });
            const data = await response.json();
            if (data.success) {
                // Remove da fila se sucesso
                offlineQueue = offlineQueue.filter(q => q.tempId !== item.tempId);
                localStorage.setItem('offline_queue', JSON.stringify(offlineQueue));
                return true; // Sucesso
            }
            return false;
        } catch (e) {
            console.error("Falha ao sincronizar item:", e);
            return false;
        }
    });

    Promise.all(promises).then(() => {
        if (offlineQueue.length < queueCopy.length) {
            showToast("Sincronização concluída!", "success");
            carregarListaAvaliacoes(); // Atualiza a lista com os dados reais do servidor
        }
    });
}

// Escutar retorno da internet
window.addEventListener('online', syncOfflineItems);

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    verificarSessao();
    renderizarFormulario();
    carregarListaAvaliacoes();
    setupEventListeners();

    // Tentar sincronizar ao abrir se tiver internet
    if (navigator.onLine) {
        setTimeout(syncOfflineItems, 2000);
    }
});

function verificarSessao() {
    const usuarioLogado = localStorage.getItem('usuario_rppm');
    if (usuarioLogado) {
        showView('dashboard');
    } else {
        showView('login');
    }
}

function showView(viewName) {
    Object.keys(views).forEach(v => {
        if (v === viewName) {
            views[v].classList.remove('hidden');
            views[v].classList.add('active');
        } else {
            views[v].classList.add('hidden');
            views[v].classList.remove('active');
        }
    });
}

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
        showView('form');
    });

    // Navegação Form -> Dashboard (Voltar)
    dom.btnVoltarDashboard.addEventListener('click', () => {
        showView('dashboard');
    });

    // Salvar
    dom.btnSalvar.addEventListener('click', salvarDados);

    // Excluir
    if (dom.btnExcluir) {
        dom.btnExcluir.addEventListener('click', () => {
            if (confirm("Tem certeza que deseja excluir esta avaliação?")) {
                deletarAvaliacao();
            }
        });
    }

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

    // Restringir RG para apenas números
    dom.inputRgVitima.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // NOVO: Auto-preenchimento por RG
    dom.inputRgVitima.addEventListener('change', async (e) => {
        const rg = e.target.value.trim();
        if (rg.length < 3) return; // Evitar buscas curtas demais

        try {
            const response = await fetch(`${API_BASE_URL}/api/general-data?rg=${rg}`);
            const dadosVítima = await response.json();

            if (dadosVítima && !dadosVítima.error) {
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

    // NOVO: Controle da Barra de Pesquisa
    dom.btnOpenSearch.addEventListener('click', () => {
        dom.searchBar.classList.remove('hidden');
        dom.inputSearch.focus();
    });

    dom.btnCloseSearch.addEventListener('click', () => {
        dom.searchBar.classList.add('closing');
        setTimeout(() => {
            dom.searchBar.classList.add('hidden');
            dom.searchBar.classList.remove('closing');
            dom.inputSearch.value = '';
            renderizarLista(listaCompleta);
        }, 150); // Tempo da animação no CSS
    });

    dom.inputSearch.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase().trim();
        const filtrados = listaCompleta.filter(item => {
            const nome = (item.nomeVitima || '').toLowerCase();
            const rg = (item.rgVitima || '').toLowerCase();
            return nome.includes(termo) || rg.includes(termo);
        });
        renderizarLista(filtrados);
    });

    // Login
    dom.btnLogin.addEventListener('click', async () => {
        const usuario = dom.inputLoginUsuario.value.trim().toLowerCase();
        const senha = dom.inputLoginSenha.value.trim();

        console.log("Tentativa de login (normalizado):", { usuario });

        if (!usuario || !senha) {
            dom.loginError.textContent = "Preencha todos os campos.";
            dom.loginError.classList.remove('hidden');
            return;
        }

        try {
            console.log(`Buscando no Backend: /api/police/login`);

            const response = await fetch(`${API_BASE_URL}/api/police/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, senha })
            });

            const data = await response.json();

            if (data.success) {
                console.log("Autenticação confirmada!");
                localStorage.setItem('usuario_rppm', usuario);
                showView('dashboard');
                showToast(`Bem-vindo, ${usuario}!`, "success");
                dom.loginError.classList.add('hidden');
                dom.inputLoginSenha.value = '';
            } else {
                console.warn("Falha no login:", data.error);
                throw new Error(data.error || "Acesso negado");
            }

        } catch (err) {
            console.error("Falha no login:", err);
            dom.loginError.textContent = "Acesso negado. Usuário ou senha inválidos.";
            dom.loginError.classList.remove('hidden');
        }
    });

    dom.btnLogout.addEventListener('click', () => {
        localStorage.removeItem('usuario_rppm');
        showView('login');
        dom.inputLoginUsuario.value = '';
        dom.inputLoginSenha.value = '';
    });

    // Auto-resize do breve histórico
    if (dom.inputBreveHistorico) {
        dom.inputBreveHistorico.addEventListener('input', function () {
            autoResizeTextarea(this);
        });
    }
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

    // Se for a aba de resultado, atualiza os dados
    if (tabId === 'tab-resultado') {
        atualizarResultadoNaAba();
    }

    // NOVO: Atualizar estado dos botões de navegação
    updateNavigationButtons();
}

// --- Lógica de Dados (Firebase) ---

function carregarListaAvaliacoes() {


    // Função interna para mesclar e renderizar
    const mesclarERenderizar = async () => {
        try {
            // Se tiver online, busca. Se não, usa vazio ou cache (se tivesse)
            let onlineData = [];
            if (navigator.onLine) {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/risk-assessments`);
                    const data = await res.json();
                    if (data && !data.error) {
                        onlineData = Object.entries(data).map(([key, value]) => ({
                            id: key,
                            ...value
                        }));
                    }
                } catch (e) { console.warn("Erro fetch lista", e); }
            }

            // Adicionar itens da fila offline
            const offlineItems = offlineQueue.map(item => ({
                id: item.tempId, // ID temporário
                ...item.data,
                isOffline: true, // Marker visual
                statusOffline: 'Aguardando Sincronização'
            }));

            // Combinar
            listaCompleta = [...offlineItems, ...onlineData];

            // Ordenar por data
            listaCompleta.sort((a, b) => {
                const parseDate = (str) => {
                    if (!str) return 0;
                    try {
                        const params = str.split(' ');
                        if (params.length < 2) return 0;
                        const dataPart = params[0].replace(',', '').split('/');
                        const horaPart = params[1].split(':');
                        return new Date(
                            parseInt(dataPart[2]),
                            parseInt(dataPart[1]) - 1,
                            parseInt(dataPart[0]),
                            parseInt(horaPart[0]),
                            parseInt(horaPart[1]),
                            parseInt(horaPart[2] || 0)
                        ).getTime();
                    } catch (e) { return 0; }
                };
                return parseDate(b.ultimaAtualizacao) - parseDate(a.ultimaAtualizacao);
            });

            // Renderizar
            if (!dom.searchBar.classList.contains('hidden') && dom.inputSearch.value) {
                // ... lógica de filtro existente ...
                const termo = dom.inputSearch.value.toLowerCase().trim();
                const filtrados = listaCompleta.filter(item => {
                    const nome = (item.nomeVitima || '').toLowerCase();
                    const rg = (item.rgVitima || '').toLowerCase();
                    return nome.includes(termo) || rg.includes(termo);
                });
                renderizarLista(filtrados);
            } else {
                renderizarLista(listaCompleta);
            }

        } catch (err) {
            console.error("Erro geral carregarListaAvaliacoes:", err);
        }
    };

    mesclarERenderizar();
    // Atualiza a cada 5 segundos
    setInterval(mesclarERenderizar, 5000);
}

function renderizarLista(lista) {
    dom.listaAvaliacoes.innerHTML = '';
    if (lista.length === 0) {
        dom.listaAvaliacoes.innerHTML = '<div class="loading-spinner">Nenhuma avaliação encontrada.</div>';
        return;
    }

    lista.forEach(item => {
        const card = criarCardAvaliacao(item);
        dom.listaAvaliacoes.appendChild(card);
    });
}

function criarCardAvaliacao(item) {
    const el = document.createElement('div');
    const status = calcularStatus(item);
    el.className = `card status-${status.toLowerCase()}`;

    const dataDisplay = item.ultimaAtualizacao || 'Data desconhecida';
    const titulo = item.nomeVitima || 'Vítima Não Identificada';
    const autor = item.usuario ? `Autor: ${item.usuario}` : 'Autor: Desconhecido';

    el.innerHTML = `
        <div class="card-info">
            <h3>${titulo} ${item.isOffline ? '<span style="color:orange; font-size:0.8em">(Offline)</span>' : ''}</h3>
            <p>${autor}</p>
            <p style="font-size: 0.85em; color: #888;">Atualizado em: ${dataDisplay}</p>
            <div class="status-text ${status.toLowerCase()}">Status: ${status}</div>
        </div>
        <div class="card-chevron">›</div>
    `;

    el.addEventListener('click', () => {
        carregarFormulario(item);
        showView('form');
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
    dom.inputBreveHistorico.value = '';
    autoResizeTextarea(dom.inputBreveHistorico); // Reseta altura

    // Reabilitar inputs e botões
    toggleFormInputs(true);
    dom.btnSalvar.classList.remove('hidden');
    dom.btnExcluir.classList.add('hidden'); // Esconder excluir em novos

    // Limpar todos os checkboxes e inputs de texto
    document.querySelectorAll('.response-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('.extra-text-input').forEach(input => {
        input.value = '';
        input.classList.add('hidden');
    });

    // Reseta visualização da aba de resultado
    document.getElementById('tab-score-value').textContent = '0';
    document.getElementById('tab-risk-level-title').textContent = 'Calculando...';
    document.getElementById('tab-risk-level-title').className = '';
    document.getElementById('tab-risk-desc').textContent = 'Preencha o formulário para ver o resultado.';
    document.getElementById('tab-risk-pointer').style.left = '0%';

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
    dom.inputBreveHistorico.value = dados.breveHistorico || '';
    // Ajustar altura após carregar dados (pequeno delay para rendering)
    setTimeout(() => autoResizeTextarea(dom.inputBreveHistorico), 0);

    // Verificar Permissões
    const currentUser = localStorage.getItem('usuario_rppm');
    const isOwner = dados.usuario === currentUser;

    if (isOwner) {
        dom.formTitle.textContent = `Editando: ${dados.nomeVitima || 'Registro'}`;
        toggleFormInputs(true);
        dom.btnSalvar.classList.remove('hidden');
        dom.btnExcluir.classList.remove('hidden');
    } else {
        dom.formTitle.textContent = `Visualizando: ${dados.nomeVitima || 'Registro'}`;
        toggleFormInputs(false);
        dom.btnSalvar.classList.add('hidden');
        dom.btnExcluir.classList.add('hidden');
        showToast("Modo de leitura: Você não é o autor deste registro.", "info");
    }

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

    showView('form');
}

function salvarDados() {
    const nomeVitima = dom.inputNomeVitima.value.trim();
    const rgVitima = dom.inputRgVitima.value.trim();

    if (!rgVitima) {
        showToast("Por favor, preencha o RG da Vítima.", "error");
        return;
    }

    if (!nomeVitima) {
        showToast("Por favor, preencha o Nome da Vítima.", "error");
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

    // Calcular pontuação e risco
    const pontuacao = calcularPontuacaoTotal();
    const classificacao = classificarRisco(pontuacao);

    const dadosParaSalvar = {
        nomeVitima: nomeVitima,
        rgVitima: dom.inputRgVitima.value.trim(),
        breveHistorico: dom.inputBreveHistorico.value.trim(),
        ultimaAtualizacao: new Date().toLocaleString('pt-BR'),
        usuario: localStorage.getItem('usuario_rppm'),
        respostas: respostas,
        respostasExtras: respostasExtras,
        pontuacao: pontuacao,
        nivelRisco: classificacao.nível
    };

    if (!navigator.onLine) {
        // --- MODO OFFLINE ---
        if (isNew) {
            const tempId = `temp-${Date.now()}`;
            offlineQueue.push({
                tempId: tempId,
                data: dadosParaSalvar
            });
            localStorage.setItem('offline_queue', JSON.stringify(offlineQueue));

            showToast("Sem internet. Salvo no dispositivo e será enviado quando conectar!", "warning");
            exibirResultado(pontuacao, dadosParaSalvar);
            carregarListaAvaliacoes(); // Atualiza UI imediatamente
            return;
        } else {
            showToast("Edição offline não suportada ainda para itens já sincronizados.", "error");
            return;
        }
    }

    if (isNew) {
        // Novo registro
        fetch(`${API_BASE_URL}/api/risk-assessments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: dadosParaSalvar })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showToast("Avaliação criada com sucesso!", "success");
                    // Mostrar resultado ao invés de voltar direto
                    exibirResultado(pontuacao, dadosParaSalvar);
                    carregarListaAvaliacoes();
                } else {
                    throw new Error(data.error);
                }
            })
            .catch(err => {
                console.error(err);
                showToast("Erro ao criar: " + err.message, "error");
            });
    } else {
        // Edição: usa currentId
        if (!currentId) {
            showToast("Erro fatal: ID do registro perdido.", "error");
            return;
        }

        fetch(`${API_BASE_URL}/api/risk-assessments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentId, data: dadosParaSalvar })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showToast("Avaliação atualizada com sucesso!", "success");
                    exibirResultado(pontuacao, dadosParaSalvar);
                } else {
                    throw new Error(data.error);
                }
            })
            .catch(err => {
                console.error(err);
                showToast("Erro ao atualizar: " + err.message, "error");
            });
    }
}

function deletarAvaliacao() {
    if (!currentId) return;

    fetch(`${API_BASE_URL}/api/risk-assessments?id=${currentId}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showToast("Avaliação excluída com sucesso!", "success");
                showView('dashboard');
                carregarListaAvaliacoes();
            } else {
                throw new Error(data.error);
            }
        })
        .catch(err => {
            console.error(err);
            showToast("Erro ao excluir: " + err.message, "error");
        });
}

function toggleFormInputs(enable) {
    const inputs = document.querySelectorAll('#view-formulario input, #view-formulario textarea');
    inputs.forEach(input => {
        input.disabled = !enable;
    });
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

// --- Lógica de Pontuação e Resultados ---

function calcularPontuacaoTotal() {
    let totalScore = 0;

    // Iterar por todas as perguntas e opções marcadas
    document.querySelectorAll('.response-checkbox:checked').forEach(cb => {
        const questionId = cb.getAttribute('data-question-id');
        const optionId = cb.value;

        // Encontrar a opção correspondente em questionsData
        for (const [tab, questions] of Object.entries(questionsData)) {
            const question = questions.find(q => q.id === questionId);
            if (question) {
                const option = question.options.find(o => o.id === optionId);
                if (option && option.score) {
                    totalScore += option.score;
                }
                break;
            }
        }
    });

    return totalScore;
}

function classificarRisco(pontuacao) {
    if (pontuacao <= 8) return { nível: "Baixo", classe: "low", percent: "12.5%" };
    if (pontuacao <= 18) return { nível: "Médio", classe: "medium", percent: "37.5%" };
    if (pontuacao <= 30) return { nível: "Alto", classe: "high", percent: "62.5%" };
    return { nível: "Extremo", classe: "extreme", percent: "87.5%" };
}

function exibirResultado(pontuacao, dados) {
    const classificacao = classificarRisco(pontuacao);

    document.getElementById('score-value').textContent = pontuacao;

    const titleEl = document.getElementById('risk-level-title');
    titleEl.textContent = `Risco ${classificacao.nível}`;
    titleEl.className = ''; // Limpar classes anteriores
    titleEl.classList.add(`outcome-${classificacao.classe}`); // Cor dinâmica

    document.getElementById('risk-desc').textContent = `Com base nos fatores identificados (${pontuacao} pontos).`;

    // Atualizar ponteiro do gráfico
    document.getElementById('risk-pointer').style.left = classificacao.percent;

    // Mostrar modal
    document.getElementById('view-resultado').classList.remove('hidden');
    document.getElementById('view-resultado').classList.add('active');
}

// Inicialização de eventos da tela de resultado
document.addEventListener('DOMContentLoaded', () => {
    const btnFechar = document.getElementById('btn-fechar-resultado');
    const btnFinalizar = document.getElementById('btn-finalizar-resultado');

    if (btnFechar) {
        btnFechar.addEventListener('click', () => {
            document.getElementById('view-resultado').classList.add('hidden');
            document.getElementById('view-resultado').classList.remove('active');
            showView('dashboard'); // Volta pro dashboard ao fechar
        });
    }

    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            document.getElementById('view-resultado').classList.add('hidden');
            document.getElementById('view-resultado').classList.remove('active');
            showView('dashboard');
        });
    }
});

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
const tabOrder = ['tab-dados-gerais', 'tab-historico', 'tab-agressor', 'tab-vitima', 'tab-outros', 'tab-resultado'];

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

function atualizarResultadoNaAba() {
    const pontuacao = calcularPontuacaoTotal();
    const classificacao = classificarRisco(pontuacao);

    document.getElementById('tab-score-value').textContent = pontuacao;

    const titleEl = document.getElementById('tab-risk-level-title');
    titleEl.textContent = `Risco ${classificacao.nível}`;
    titleEl.className = '';
    titleEl.classList.add(`outcome-${classificacao.classe}`);

    document.getElementById('tab-risk-desc').textContent = `Com base nos fatores identificados (${pontuacao} pontos).`;
    document.getElementById('tab-risk-pointer').style.left = classificacao.percent;
}

function updateNavigationButtons() {
    const currentTab = document.querySelector('.tab-content.active');
    if (!currentTab) return;

    const currentIndex = tabOrder.indexOf(currentTab.id);

    const btnPrev = document.getElementById('btn-prev-tab');
    const btnNext = document.getElementById('btn-next-tab'); // Originalmente 'btn-next-tab'

    if (btnPrev) btnPrev.disabled = currentIndex === 0;
    if (btnNext) btnNext.disabled = currentIndex === tabOrder.length - 1; // Changed from nextBtn to btnNext
}

function autoResizeTextarea(element) {
    if (!element) return;
    element.style.height = 'auto'; // Reseta para calcular o scrollHeight correto
    element.style.height = (element.scrollHeight) + 'px';
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
