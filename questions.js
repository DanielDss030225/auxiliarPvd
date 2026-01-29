const questionsData = {
    "tab-historico": [
        {
            title: "O(A) agressor(a) já ameaçou você ou algum familiar com a finalidade de atingi-la?",
            id: "p_ameaca",
            options: [
                { id: "1", label: "Sim, utilizando arma de fogo" },
                { id: "2", label: "Sim, utilizando faca" },
                { id: "216", label: "Sim, de outra forma" },
                { id: "4", label: "Não" }
            ]
        },
        {
            title: "O(A) agressor(a) já praticou alguma(s) dessas agressões físicas contra você?",
            id: "p_agressao_fisica",
            options: [
                { id: "217", label: "Queimadura" },
                { id: "218", label: "Enforcamento" },
                { id: "219", label: "Sufocamento" },
                { id: "220", label: "Estrangulamento" },
                { id: "221", label: "Tiro" },
                { id: "222", label: "Afogamento" },
                { id: "223", label: "Facada" },
                { id: "224", label: "Paulada" },
                { id: "225", label: "Soco" },
                { id: "226", label: "Chute" },
                { id: "227", label: "Tapa" },
                { id: "228", label: "Empurrão" },
                { id: "229", label: "Puxão de Cabelo" },
                { id: "230", label: "Outra", hasInput: true },
                { id: "231", label: "Nenhuma agressão física" }
            ]
        },
        {
            title: "Você necessitou de atendimento médico e/ou internação após algumas dessas agressões?",
            id: "p_atendimento",
            options: [
                { id: "232", label: "Sim, atendimento médico" },
                { id: "233", label: "Sim, internação" },
                { id: "234", label: "Não" }
            ]
        },
        {
            title: "O(A) agressor(a) já obrigou você a ter relações sexuais ou praticar atos sexuais contra a sua vontade?",
            id: "p_violencia_sexual",
            options: [
                { id: "235", label: "Sim" },
                { id: "236", label: "Não" },
                { id: "237", label: "Não sei" }
            ]
        },
        {
            title: "O(A) agressor(a) persegue você, demonstra ciúme excessivo, tenta controlar sua vida?",
            id: "p_ciume",
            options: [
                { id: "238", label: "Sim" },
                { id: "239", label: "Não" },
                { id: "240", label: "Não sei" }
            ]
        }
    ],
    "tab-agressor": [
        {
            title: "O(A) agressor(a) já teve algum destes comportamentos?",
            id: "p_comportamento",
            options: [
                { id: "21", label: "Disse 'se não for minha, não será de mais ninguém'" },
                { id: "241", label: "Perturbou, perseguiu ou vigiou você" },
                { id: "23", label: "Proibiu visita a familiares/amigos" },
                { id: "24", label: "Proibiu trabalhar ou estudar" },
                { id: "25", label: "Mensagens/Ligações insistentes" },
                { id: "26", label: "Impediu acesso a dinheiro/bens" },
                { id: "27", label: "Outros comportamentos de controle" },
                { id: "28", label: "Nenhum dos acima" }
            ]
        },
        {
            title: "Você já registrou ocorrência ou pediu medida protetiva contra esse agressor?",
            id: "p_bo_anterior",
            options: [
                { id: "242", label: "Sim" },
                { id: "243", label: "Não" }
            ]
        },
        {
            title: "O(A) agressor(a) já descumpriu medida protetiva anteriormente?",
            id: "p_descumpriu",
            options: [
                { id: "244", label: "Sim" },
                { id: "245", label: "Não" },
                { id: "246", label: "Não sei" }
            ]
        },
        {
            title: "As agressões se tornaram mais frequentes ou graves nos últimos meses?",
            id: "p_frequencia",
            options: [
                { id: "247", label: "Sim" },
                { id: "248", label: "Não" },
                { id: "249", label: "Não sei" }
            ]
        },
        {
            title: "Uso abusivo de álcool, drogas ou medicamentos?",
            id: "p_drogas",
            options: [
                { id: "250", label: "Sim, álcool" },
                { id: "251", label: "Sim, drogas" },
                { id: "252", label: "Sim, medicamentos" },
                { id: "253", label: "Não" },
                { id: "254", label: "Não sei" }
            ]
        },
        {
            title: "Doença mental comprovada?",
            id: "p_mental",
            options: [
                { id: "37", label: "Sim, usa medicação" },
                { id: "38", label: "Sim, não usa medicação" },
                { id: "39", label: "Não" },
                { id: "40", label: "Não sei" }
            ]
        },
        {
            title: "Tentativa ou ameaça de suicídio?",
            id: "p_suicidio",
            options: [
                { id: "43", label: "Sim" },
                { id: "44", label: "Não" },
                { id: "255", label: "Não sei" }
            ]
        },
        {
            title: "Dificuldades financeiras ou desemprego?",
            id: "p_financeiro",
            options: [
                { id: "256", label: "Sim" },
                { id: "257", label: "Não" },
                { id: "258", label: "Não sei" }
            ]
        },
        {
            title: "Acesso ou uso de arma de fogo?",
            id: "p_arma",
            options: [
                { id: "259", label: "Sim, usou" },
                { id: "260", label: "Sim, ameaçou usar" },
                { id: "261", label: "Tem fácil acesso" },
                { id: "262", label: "Não" },
                { id: "263", label: "Não sei" }
            ]
        },
        {
            title: "Ameaçou/Agrediu terceiros (filhos, familiares, animais)?",
            id: "p_terceiros",
            options: [
                { id: "264", label: "Sim, filhos" },
                { id: "265", label: "Sim, familiares" },
                { id: "266", label: "Sim, amigos" },
                { id: "267", label: "Sim, colegas" },
                { id: "268", label: "Sim, outros" },
                { id: "269", label: "Sim, animais" },
                { id: "270", label: "Não" },
                { id: "271", label: "Não sei" }
            ]
        }
    ],
    "tab-vitima": [
        {
            title: "Separação recente ou intenção de separar?",
            id: "p_separacao",
            options: [
                { id: "272", label: "Sim" },
                { id: "273", label: "Não" }
            ]
        },
        {
            title: "Você tem filhos?",
            id: "p_filhos_qtd",
            options: [
                { id: "274", label: "Sim, com o agressor", hasInput: true },
                { id: "62", label: "Sim, de outro relacionamento", hasInput: true },
                { id: "63", label: "Não" }
            ]
        },
        {
            title: "Faixa etária dos filhos",
            id: "p_filhos_idade",
            options: [
                { id: "275", label: "0 a 11 anos" },
                { id: "276", label: "12 a 17 anos" },
                { id: "277", label: "A partir de 18 anos" }
            ]
        },
        {
            title: "Algum filho com deficiência?",
            id: "p_filhos_pcd",
            options: [
                { id: "278", label: "Sim" },
                { id: "279", label: "Não" }
            ]
        },
        {
            title: "Conflito sobre guarda/visitas/pensão?",
            id: "p_guarda",
            options: [
                { id: "280", label: "Sim" },
                { id: "281", label: "Não" },
                { id: "282", label: "Não sei" }
            ]
        },
        {
            title: "Filhos presenciaram violência?",
            id: "p_presenciaram",
            options: [
                { id: "72", label: "Sim" },
                { id: "73", label: "Não" }
            ]
        },
        {
            title: "Violência na gravidez ou pós-parto?",
            id: "p_gravidez_violencia",
            options: [
                { id: "74", label: "Sim" },
                { id: "75", label: "Não" }
            ]
        },
        {
            title: "Está grávida ou teve bebê recentemente?",
            id: "p_gravida_agora",
            options: [
                { id: "283", label: "Sim" },
                { id: "284", label: "Não" }
            ]
        },
        {
            title: "Novo relacionamento aumentou riscos?",
            id: "p_novo_relacionamento",
            options: [
                { id: "285", label: "Sim" },
                { id: "286", label: "Não" }
            ]
        },
        {
            title: "Possui deficiência ou vulnerabilidade?",
            id: "p_vitima_pcd",
            options: [
                { id: "287", label: "Sim", hasInput: true },
                { id: "288", label: "Não" }
            ]
        },
        {
            title: "Cor/Raça",
            id: "p_raca",
            options: [
                { id: "82", label: "Branca" },
                { id: "83", label: "Preta" },
                { id: "84", label: "Parda" },
                { id: "85", label: "Amarela/Oriental" },
                { id: "86", label: "Indígena" }
            ]
        }
    ],
    "tab-outros": [
        {
            title: "Mora em local de risco?",
            id: "p_local_risco",
            options: [
                { id: "87", label: "Sim" },
                { id: "88", label: "Não" },
                { id: "89", label: "Não sei" }
            ]
        },
        {
            title: "Situação de moradia",
            id: "p_moradia",
            options: [
                { id: "289", label: "Própria" },
                { id: "290", label: "Alugada" },
                { id: "291", label: "Cedida", hasInput: true }
            ]
        },
        {
            title: "Dependente financeiramente do agressor?",
            id: "p_dependencia",
            options: [
                { id: "90", label: "Sim" },
                { id: "91", label: "Não" }
            ]
        },
        {
            title: "Aceita abrigamento temporário?",
            id: "p_abrigo",
            options: [
                { id: "92", label: "Sim" },
                { id: "93", label: "Não" }
            ]
        }
    ]
};
