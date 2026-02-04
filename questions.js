const questionsData = {
    "tab-historico": [
        {
            title: "O(A) agressor(a) já ameaçou você ou algum familiar com a finalidade de atingi-la?",
            id: "p_ameaca",
            options: [
                { id: "1", label: "Sim, utilizando arma de fogo", score: 3 },
                { id: "2", label: "Sim, utilizando faca", score: 2 },
                { id: "216", label: "Sim, de outra forma", score: 1 },
                { id: "4", label: "Não", exclusive: true, score: 0 }
            ]
        },
        {
            title: "O(A) agressor(a) já praticou alguma(s) dessas agressões físicas contra você?",
            id: "p_agressao_fisica",
            options: [
                { id: "217", label: "Queimadura", score: 2 },
                { id: "218", label: "Enforcamento", score: 3 },
                { id: "219", label: "Sufocamento", score: 3 },
                { id: "220", label: "Estrangulamento", score: 3 },
                { id: "221", label: "Tiro", score: 3 },
                { id: "222", label: "Afogamento", score: 3 },
                { id: "223", label: "Facada", score: 3 },
                { id: "224", label: "Paulada", score: 2 },
                { id: "225", label: "Soco", score: 1 },
                { id: "226", label: "Chute", score: 1 },
                { id: "227", label: "Tapa", score: 1 },
                { id: "228", label: "Empurrão", score: 1 },
                { id: "229", label: "Puxão de Cabelo", score: 1 },
                { id: "230", label: "Outra", hasInput: true, score: 1 },
                { id: "231", label: "Nenhuma agressão física", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Você necessitou de atendimento médico e/ou internação após algumas dessas agressões?",
            id: "p_atendimento",
            dependsOn: { questionId: "p_agressao_fisica", notAnswerId: "231" },
            options: [
                { id: "232", label: "Sim, atendimento médico", score: 1 },
                { id: "233", label: "Sim, internação", score: 2 },
                { id: "234", label: "Não", exclusive: true, score: 0 }
            ]
        },
        {
            title: "O(A) agressor(a) já obrigou você a ter relações sexuais ou praticar atos sexuais contra a sua vontade?",
            id: "p_violencia_sexual",
            options: [
                { id: "235", label: "Sim", exclusive: true, score: 3 },
                { id: "236", label: "Não", exclusive: true, score: 0 },
                { id: "237", label: "Não sei", exclusive: true, score: 0 }
            ]
        },
        {
            title: "O(A) agressor(a) persegue você, demonstra ciúme excessivo, tenta controlar sua vida?",
            id: "p_ciume",
            options: [
                { id: "238", label: "Sim", exclusive: true, score: 1 },
                { id: "239", label: "Não", exclusive: true, score: 0 },
                { id: "240", label: "Não sei", exclusive: true, score: 0 }
            ]
        }
    ],
    "tab-agressor": [
        {
            title: "O(A) agressor(a) já teve algum destes comportamentos?",
            id: "p_comportamento",
            options: [
                { id: "21", label: "Disse 'se não for minha, não será de mais ninguém'", score: 3 },
                { id: "241", label: "Perturbou, perseguiu ou vigiou você", score: 1 },
                { id: "23", label: "Proibiu visita a familiares/amigos", score: 1 },
                { id: "24", label: "Proibiu trabalhar ou estudar", score: 1 },
                { id: "25", label: "Mensagens/Ligações insistentes", score: 1 },
                { id: "26", label: "Impediu acesso a dinheiro/bens", score: 1 },
                { id: "27", label: "Outros comportamentos de controle", score: 1 },
                { id: "28", label: "Nenhum dos acima", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Você já registrou ocorrência ou pediu medida protetiva contra esse agressor?",
            id: "p_bo_anterior",
            options: [
                { id: "242", label: "Sim", exclusive: true, score: 1 },
                { id: "243", label: "Não", exclusive: true, score: 0 }
            ]
        },
        {
            title: "O(A) agressor(a) já descumpriu medida protetiva anteriormente?",
            id: "p_descumpriu",
            options: [
                { id: "244", label: "Sim", exclusive: true, score: 3 },
                { id: "245", label: "Não", exclusive: true, score: 0 },
                { id: "246", label: "Não sei", exclusive: true, score: 0 }
            ]
        },
        {
            title: "As agressões se tornaram mais frequentes ou graves nos últimos meses?",
            id: "p_frequencia",
            options: [
                { id: "247", label: "Sim", exclusive: true, score: 2 },
                { id: "248", label: "Não", exclusive: true, score: 0 },
                { id: "249", label: "Não sei", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Uso abusivo de álcool, drogas ou medicamentos?",
            id: "p_drogas",
            options: [
                { id: "250", label: "Sim, álcool", score: 1 },
                { id: "251", label: "Sim, drogas", score: 2 },
                { id: "252", label: "Sim, medicamentos", score: 1 },
                { id: "253", label: "Não", exclusive: true, score: 0 },
                { id: "254", label: "Não sei", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Doença mental comprovada?",
            id: "p_mental",
            options: [
                { id: "37", label: "Sim, usa medicação", exclusive: true, score: 1 },
                { id: "38", label: "Sim, não usa medicação", exclusive: true, score: 2 },
                { id: "39", label: "Não", exclusive: true, score: 0 },
                { id: "40", label: "Não sei", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Tentativa ou ameaça de suicídio?",
            id: "p_suicidio",
            options: [
                { id: "43", label: "Sim", exclusive: true, score: 2 },
                { id: "44", label: "Não", exclusive: true, score: 0 },
                { id: "255", label: "Não sei", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Dificuldades financeiras ou desemprego?",
            id: "p_financeiro",
            options: [
                { id: "256", label: "Sim", exclusive: true, score: 1 },
                { id: "257", label: "Não", exclusive: true, score: 0 },
                { id: "258", label: "Não sei", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Acesso ou uso de arma de fogo?",
            id: "p_arma",
            options: [
                { id: "259", label: "Sim, usou", score: 3 },
                { id: "260", label: "Sim, ameaçou usar", score: 3 },
                { id: "261", label: "Tem fácil acesso", score: 2 },
                { id: "262", label: "Não", exclusive: true, score: 0 },
                { id: "263", label: "Não sei", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Ameaçou/Agrediu terceiros (filhos, familiares, animais)?",
            id: "p_terceiros",
            options: [
                { id: "264", label: "Sim, filhos", score: 1 },
                { id: "265", label: "Sim, familiares", score: 1 },
                { id: "266", label: "Sim, amigos", score: 1 },
                { id: "267", label: "Sim, colegas", score: 1 },
                { id: "268", label: "Sim, outros", score: 1 },
                { id: "269", label: "Sim, animais", score: 1 },
                { id: "270", label: "Não", exclusive: true, score: 0 },
                { id: "271", label: "Não sei", exclusive: true, score: 0 }
            ]
        }
    ],
    "tab-vitima": [
        {
            title: "Separação recente ou intenção de separar?",
            id: "p_separacao",
            options: [
                { id: "272", label: "Sim", exclusive: true, score: 2 },
                { id: "273", label: "Não", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Você tem filhos?",
            id: "p_filhos_qtd",
            options: [
                { id: "274", label: "Sim, com o agressor", hasInput: true, score: 1 },
                { id: "62", label: "Sim, de outro relacionamento", hasInput: true, score: 0 },
                { id: "63", label: "Não", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Faixa etária dos filhos",
            id: "p_filhos_idade",
            dependsOn: { questionId: "p_filhos_qtd", notAnswerId: "63" },
            options: [
                { id: "275", label: "0 a 11 anos", score: 1 },
                { id: "276", label: "12 a 17 anos", score: 0 },
                { id: "277", label: "A partir de 18 anos", score: 0 }
            ]
        },
        {
            title: "Algum filho com deficiência?",
            id: "p_filhos_pcd",
            dependsOn: { questionId: "p_filhos_qtd", notAnswerId: "63" },
            options: [
                { id: "278", label: "Sim", exclusive: true, score: 1 },
                { id: "279", label: "Não", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Conflito sobre guarda/visitas/pensão?",
            id: "p_guarda",
            dependsOn: { questionId: "p_filhos_qtd", notAnswerId: "63" },
            options: [
                { id: "280", label: "Sim", exclusive: true, score: 2 },
                { id: "281", label: "Não", exclusive: true, score: 0 },
                { id: "282", label: "Não sei", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Filhos presenciaram violência?",
            id: "p_presenciaram",
            dependsOn: { questionId: "p_filhos_qtd", notAnswerId: "63" },
            options: [
                { id: "72", label: "Sim", exclusive: true, score: 1 },
                { id: "73", label: "Não", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Violência na gravidez ou pós-parto?",
            id: "p_gravidez_violencia",
            dependsOn: { questionId: "p_filhos_qtd", notAnswerId: "63" },
            options: [
                { id: "74", label: "Sim", exclusive: true, score: 2 },
                { id: "75", label: "Não", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Está grávida ou teve bebê recentemente?",
            id: "p_gravida_agora",
            options: [
                { id: "283", label: "Sim", exclusive: true, score: 1 },
                { id: "284", label: "Não", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Novo relacionamento aumentou riscos?",
            id: "p_novo_relacionamento",
            options: [
                { id: "285", label: "Sim", exclusive: true, score: 2 },
                { id: "286", label: "Não", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Possui deficiência ou vulnerabilidade?",
            id: "p_vitima_pcd",
            options: [
                { id: "287", label: "Sim", hasInput: true, exclusive: true, score: 1 },
                { id: "288", label: "Não", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Cor/Raça",
            id: "p_raca",
            options: [
                { id: "82", label: "Branca", exclusive: true, score: 0 },
                { id: "83", label: "Preta", exclusive: true, score: 0 },
                { id: "84", label: "Parda", exclusive: true, score: 0 },
                { id: "85", label: "Amarela/Oriental", exclusive: true, score: 0 },
                { id: "86", label: "Indígena", exclusive: true, score: 0 }
            ]
        }
    ],
    "tab-outros": [
        {
            title: "Mora em local de risco?",
            id: "p_local_risco",
            options: [
                { id: "87", label: "Sim", exclusive: true, score: 1 },
                { id: "88", label: "Não", exclusive: true, score: 0 },
                { id: "89", label: "Não sei", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Situação de moradia",
            id: "p_moradia",
            options: [
                { id: "289", label: "Própria", exclusive: true, score: 0 },
                { id: "290", label: "Alugada", exclusive: true, score: 0 },
                { id: "291", label: "Cedida", hasInput: true, exclusive: true, score: 0 }
            ]
        },
        {
            title: "Dependente financeiramente do agressor?",
            id: "p_dependencia",
            options: [
                { id: "90", label: "Sim", exclusive: true, score: 1 },
                { id: "91", label: "Não", exclusive: true, score: 0 }
            ]
        },
        {
            title: "Aceita abrigamento temporário?",
            id: "p_abrigo",
            options: [
                { id: "92", label: "Sim", exclusive: true, score: 0 },
                { id: "93", label: "Não", exclusive: true, score: 0 }
            ]
        }
    ]
};
