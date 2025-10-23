const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const resultUrl = document.getElementById("resultUrl");
const copyMsg = document.getElementById("copyMsg");
const siglaProduto = [
    'GV', // Voluntário Global
    'GTs', // Talento Global Short Term
    'GTml', // Talento Global Mid e Long Term
    'PG' // Professor Global
];
const escritorios = [
    "AB",  // ABC
    "AJ",  // ARACAJU
    "BA",  // Bauru
    "BH",  // BELO HORIZONTE
    "BS",  // BRASÍLIA
    "CT",  // CURITIBA
    "FL",  // FLORIANÓPOLIS
    "FR",  // FRANCA
    "FO",  // FORTALEZA
    "JP",  // JOÃO PESSOA
    "LM",  // LIMEIRA
    "MZ",  // MACEIÓ
    "MN",  // MANAUS
    "MA",  // MARINGÁ
    "PA",  // PORTO ALEGRE
    "RC",  // RECIFE
    "RJ",  // RIO DE JANEIRO
    "SS",  // SALVADOR
    "SM",  // SANTA MARIA
    "GV",  // SÃO PAULO UNIDADE GETÚLIO VARGAS
    "MK",  // SÃO PAULO UNIDADE MACKENZIE
    "US",  // SÃO PAULO UNIDADE USP
    "SO",  // SOROCABA
    "UB",  // UBERLÂNDIA
    "VT",  // VITÓRIA
    "MC" // BRASIL (NACIONAL)
];
let ArrayCl;
let ArrayProduto;
let campos;
let canal;
let projeto;
let anuncio;
let cl;

generateBtn.addEventListener("click", () => {
    const baseUrl = "https://aiesec.org.br";

    let utm_source = document.getElementById("utm_source");
    let utm_medium = document.getElementById("utm_medium");
    let utm_campaign = document.getElementById("utm_campaign");
    let utm_term = document.getElementById("utm_term");
    let utm_content = document.getElementById("utm_content");

    if(
    utm_source.value === "" || 
    utm_medium.value === "" || 
    utm_campaign.value.trim() === "" ||
    utm_term.value === "" ||
    utm_content.value === ""
    ){

        // 🔻 Modal de erro
            const modal = document.getElementById('exampleModalLong');
            const myModal = new bootstrap.Modal(modal);
            const botaoEnviar = document.getElementById("botaoConfirmar");
            const botaoRemover = document.getElementById("botaoCancelar");

            const tituloModal = document.getElementById("exampleModalLongTitle");

            tituloModal.textContent = "Alguns campos não foram preenchidos";

            document.getElementById("DadosAqui").textContent = `Por favor, preencha todos os campos`;
            botaoEnviar.style.display = 'none';
            botaoEnviar.disabled = true;
            botaoRemover.textContent = "Corrigir";

            myModal.show();

            console.error("Alguns campos não foram preenchidos");
            return;

    }

    utm_source = utm_source.options[utm_source.selectedIndex].value;
    utm_medium = utm_medium.options[utm_medium.selectedIndex].value;
    utm_term = utm_term.options[utm_term.selectedIndex].value;
    utm_content = utm_content.options[utm_content.selectedIndex].value;

    
    
    utm_source = encodeURIComponent(slugify(utm_source));
    utm_medium = encodeURIComponent(slugify(utm_medium));
    utm_campaign = encodeURIComponent(slugify(document.getElementById("utm_campaign").value.trim()));

    const utm_term_sigla  = ArrayCl.indexOf(utm_term);
    const utm_content_sigla = ArrayProduto.indexOf(utm_content);
    const rota = utm_content === "Talento Global Short Term" || utm_content === "Talento Global Mid e Long Term" ? "Talento Global": utm_content;
    
    const fullUrl = `${baseUrl}/${slugify(rota)}/?utm_source=${utm_source}&utm_medium=${utm_medium}&utm_campaign=${utm_campaign}&utm_term=${escritorios[utm_term_sigla].toLowerCase()}&utm_content=${siglaProduto[utm_content_sigla].toLowerCase()}`;

    resultUrl.value = fullUrl;
    copyMsg.textContent = "";
});

copyBtn.addEventListener("click", async () => {
    const url = resultUrl.value;

    if (!url) {
        copyMsg.textContent = "Nenhuma URL gerada ainda!";
        copyMsg.style.color = "red";
        return;
    }

    try {
        await navigator.clipboard.writeText(url);
        copyMsg.textContent = "✅ URL copiada com sucesso!";
        copyMsg.style.color = "#00B2FF";
    } catch (err) {
        copyMsg.textContent = "❌ Erro ao copiar!";
        copyMsg.style.color = "red";
    }
});

async function carregarElemento() {
    //__________________________________________BOTÃO PRODUTO____________________________________________________

    // Cria o menu suspenso
    const dropdown = document.getElementById('utm_content');
    dropdown.innerHTML = '';
    dropdown.setAttribute("disabled", "")

    // Cria um botão com a frase "Carregando" enquanto o Menu Suspenso está desativado
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Carregando';
    dropdown.appendChild(defaultOption);

    defaultOption.setAttribute('disabled', '');
    defaultOption.setAttribute('selected', '');

    //____________________________________________________________________________________________________


    //__________________________________BOTÃO AIESEC MAIS PRÓXIMA_______________________________________

    // Cria o menu suspenso
    const dropdown_AiesecProx = document.getElementById('utm_term');
    dropdown_AiesecProx.innerHTML = '';
    dropdown_AiesecProx.setAttribute("disabled", "")

    // Cria um botão com a frase "Carregando" enquanto o Menu Suspenso está desativado
    const defaultOption_AiesecProx = document.createElement('option');
    defaultOption_AiesecProx.value = '';
    defaultOption_AiesecProx.textContent = 'Carregando';
    dropdown_AiesecProx.appendChild(defaultOption_AiesecProx);

    defaultOption_AiesecProx.setAttribute('disabled', '');
    defaultOption_AiesecProx.setAttribute('selected', '');

    //________________________________________________________________________________________________

    //___________________________BOTÃO COMO CONHECEU A AIESEC_________________________________________

    // Cria o menu suspenso
    const dropdown_Como_Conheceu = document.getElementById('utm_source');
    dropdown_Como_Conheceu.innerHTML = '';
    dropdown_Como_Conheceu.setAttribute("disabled", "")

    // Cria um botão com a frase "Carregando" enquanto o Menu Suspenso está desativado
    const defaultOption_Como_Conheceu = document.createElement('option');
    defaultOption_Como_Conheceu.value = '';
    defaultOption_Como_Conheceu.textContent = 'Carregando';
    dropdown_Como_Conheceu.appendChild(defaultOption_Como_Conheceu);

    defaultOption_Como_Conheceu.setAttribute('disabled', '');
    defaultOption_Como_Conheceu.setAttribute('selected', '');

    //_________________________________________________________________________________________________

    //___________________________BOTÃO COMO TiPOS DE ANUNCIO_________________________________________

    // Cria o menu suspenso
    const dropdown_tipo_anuncio = document.getElementById('utm_medium');
    dropdown_tipo_anuncio.innerHTML = '';
    dropdown_tipo_anuncio.setAttribute("disabled", "")

    // Cria um botão com a frase "Carregando" enquanto o Menu Suspenso está desativado
    const defaultOption_tipo_anuncio = document.createElement('option');
    defaultOption_tipo_anuncio.value = '';
    defaultOption_tipo_anuncio.textContent = 'Carregando';
    dropdown_tipo_anuncio.appendChild(defaultOption_tipo_anuncio);

    defaultOption_tipo_anuncio.setAttribute('disabled', '');
    defaultOption_tipo_anuncio.setAttribute('selected', '');

    //_________________________________________________________________________________________________


    //___________________________BOTÃO COMO CONHECEU A AIESEC_________________________________________

    // Cria o menu suspenso
    const dropdown_canal = document.getElementById('utm_source');
    dropdown_canal.innerHTML = '';
    dropdown_canal.setAttribute("disabled", "")

    // Cria um botão com a frase "Carregando" enquanto o Menu Suspenso está desativado
    const defaultOption_canal = document.createElement('option');
    defaultOption_canal.value = '';
    defaultOption_canal.textContent = 'Carregando';
    dropdown_canal.appendChild(defaultOption_canal);

    defaultOption_canal.setAttribute('disabled', '');
    defaultOption_canal.setAttribute('selected', '');

    //_________________________________________________________________________________________________


    const url = 'https://baziaiesec.pythonanywhere.com/metadados-card';

    try {

        const response = await fetch(url);
        const data = await response.json();

        // Verificação de segurança mais completa
        campos = data?.data?.fields;

        //Verfica se o dado campos é não nulo
        if (!campos) {

            // 🔻 Modal de erro
            const modal = document.getElementById('exampleModalLong');
            const myModal = new bootstrap.Modal(modal);
            const botaoEnviar = document.getElementById("botaoConfirmar");
            const botaoRemover = document.getElementById("botaoCancelar");

            const tituloModal = document.getElementById("exampleModalLongTitle");

            tituloModal.textContent = "Erro de conexão";


            document.getElementById("DadosAqui").textContent = `Por favor, Recarregue a Pagina e tente novamente.
            Caso o erro persista contate o email: contato@aiesec.org.br`;
            botaoEnviar.style.display = 'none';
            botaoEnviar.disabled = true;
            botaoRemover.textContent = "Recarregar";

            myModal.show();

            console.error("A comunicação não foi corretamente estabelecida. Recarregue a página");

            botaoRemover.addEventListener("click", () => {
                document.getElementById("meuForm").reset();
                location.reload();
            }, { once: true });

        }

        //____________________________Lógica Produtos_____________________________________________________

        // Encontra os produtos dentro dos objetos retornado pela API
        const produtos = campos.find(field => field.label === "Produto");
        const opcoesDeProduto = produtos.config.settings.options;

        // Colocando todos os produtos em uma variável chamada todosProdutos
        // A função reduce serve para fazer chamada recursiva de uma função em todos os elementos do array
        var todosProdutos = opcoesDeProduto.reduce(
            function (prev, curr) {

                if (curr.status == "active") {

                    return [...prev, curr.text];
                }

                return [...prev]

            },
            []
        )
        ArrayProduto = todosProdutos;
        // Cria o menu suspenso
        todosProdutos.forEach((produto) => {
            const newOption = document.createElement("option");
            newOption.value = produto;
            newOption.textContent = produto;
            dropdown.appendChild(newOption);
        });

        // Quando todas as opções estiverem prontas o botão se tranforma em "Selecione" e 
        // ativa o Menu Suspenso novamente
        defaultOption.textContent = "Selecione";
        dropdown.removeAttribute("disabled");

        //________________________________________________________________________________________________

        //____________________________Lógica TiPOS Anuncios_____________________________________________________

        // Encontra os produtos dentro dos objetos retornado pela API
        const tipoAnuncio = campos.find(field => field.label === "Como?");
        const opcoesTipoAnuncio = tipoAnuncio.config.settings.options;

        // Colocando todos os produtos em uma variável chamada todosProdutos
        // A função reduce serve para fazer chamada recursiva de uma função em todos os elementos do array
        var todosTipoAnuncio = opcoesTipoAnuncio.reduce(
            function (prev, curr) {

                if (curr.status == "active") {

                    return [...prev, curr.text];
                }

                return [...prev]

            },
            []
        )
        // Cria o menu suspenso
        todosTipoAnuncio.forEach((anuncio) => {
            const newOption = document.createElement("option");
            newOption.value = anuncio;
            newOption.textContent = anuncio;
            dropdown_tipo_anuncio.appendChild(newOption);
        });

        // Quando todas as opções estiverem prontas o botão se tranforma em "Selecione" e 
        // ativa o Menu Suspenso novamente
        defaultOption_tipo_anuncio.textContent = "Selecione";
        dropdown_tipo_anuncio.removeAttribute("disabled");

        //________________________________________________________________________________________________


        //____________________________Lógica Aiesec Mais Próxima__________________________________________

        const aiesecProx = campos.find(field => field.label === "Qual é a AIESEC mais próxima de você?");
        const aiesecs = aiesecProx.config.settings.options;


        var todasAiesecs = aiesecs.reduce(
            function (prev, curr) {

                if (curr.status == "active") {
                    return [...prev, curr.text];
                }

                return [...prev]

            },
            []
        )
        ArrayCl = todasAiesecs;
        todasAiesecs.forEach((aiesec) => {
            const newOption = document.createElement('option');
            newOption.value = aiesec;
            newOption.textContent = aiesec;
            dropdown_AiesecProx.appendChild(newOption);
        });

        // Quando todas as opções estiverem prontas o botão se tranforma em "Selecione" e 
        // ativa o Menu Suspenso novamente
        defaultOption_AiesecProx.textContent = "Selecione";
        dropdown_AiesecProx.removeAttribute("disabled");


        //________________________________________________________________________________________________


        //______________________Lógica Como conheceu a AIESEC______________________________________________


        const comoConheceu = campos.find(field => field.label === "Como você conheceu a AIESEC?");
        const opçoes_Como_Conheceu = comoConheceu.config.settings.options;


        var todasOpcoes_Como_Conheceu = opçoes_Como_Conheceu.reduce(
            function (prev, curr) {

                if (curr.status == "active") {
                    return [...prev, curr.text];
                }

                return [...prev]

            },
            []
        )

        todasOpcoes_Como_Conheceu.forEach((opcoes) => {
            const newOption = document.createElement('option');
            newOption.value = opcoes;
            newOption.textContent = opcoes;
            dropdown_Como_Conheceu.appendChild(newOption);
        });

        // Quando todas as opções estiverem prontas o botão se tranforma em "Selecione" e 
        // ativa o Menu Suspenso novamente
        defaultOption_Como_Conheceu.textContent = "Selecione";
        dropdown_Como_Conheceu.removeAttribute("disabled");





        const canal = campos.find(field => field.label === "Como?");
        const opcoe_canal = canal.config.settings.options;

        var todasopcoe_canal = opcoe_canal.reduce(
            function (prev, curr) {

                if (curr.status == "active") {
                    return [...prev, curr.text];
                }

                return [...prev]

            },
            []
        )

        todasopcoe_canal.forEach((opcoes) => {
            const newOption = document.createElement('option');
            newOption.value = opcoes;
            newOption.textContent = opcoes;
            defaultOption_canal.appendChild(newOption);
        });

        // Quando todas as opções estiverem prontas o botão se tranforma em "Selecione" e 
        // ativa o Menu Suspenso novamente
        defaultOption_canal.textContent = "Selecione";
        dropdown_canal.removeAttribute("disabled");



    } catch (error) {
        // 🔻 Modal de erro
        const modal = document.getElementById('exampleModalLong');
        const myModal = new bootstrap.Modal(modal);
        const botaoEnviar = document.getElementById("botaoConfirmar");
        const botaoRemover = document.getElementById("botaoCancelar");

        const tituloModal = document.getElementById("exampleModalLongTitle");

        tituloModal.textContent = "Erro de conexão";


        document.getElementById("DadosAqui").textContent = `Por favor, Recarregue a Pagina e tente novamente.
    Caso o erro persista contate o email: contato@aiesec.org.br`;
        botaoEnviar.style.display = 'none';
        botaoEnviar.disabled = true;
        botaoRemover.textContent = "Recarregar";

        myModal.show();

        console.error("A comunicação não foi corretamente estabelecida. Recarregue a página");

        botaoRemover.addEventListener("click", () => {
            document.getElementById("meuForm").reset();
            location.reload();
        }, { once: true });
        console.error('Erro ao buscar dados:', error);
    }
}
function slugify(texto) {
  return texto
    .toLowerCase()                       // tudo minúsculo
    .normalize("NFD")                    // separa letras dos acentos
    .replace(/[\u0300-\u036f]/g, "")     // remove acentos
    .replace(/\s+/g, "-")                // substitui espaços por hífen
    .replace(/[^a-z0-9-/]/g, "")         // mantém letras, números, hífen e barra
    .replace(/-+/g, "-")                 // evita múltiplos hífens
    .replace(/\/+/g, "/")                // evita múltiplas barras
    .replace(/^[-/]+|[-/]+$/g, "");      // remove hífens ou barras no início/fim
}


carregarElemento();