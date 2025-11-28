// --------------------- ELEMENTOS DO DOM ---------------------

// Botão que gera a URL final
const generateBtn = document.getElementById("generateBtn");

// Botão que copia a URL gerada para a área de transferência
const copyBtn = document.getElementById("copyBtn");

// Campo de input onde a URL final será exibida
const resultUrl = document.getElementById("resultUrl");

// Elemento onde mensagens de status (como "URL copiada") serão exibidas
const copyMsg = document.getElementById("copyMsg");

// --------------------- LISTAS DE SIGLAS ---------------------

// Siglas dos produtos/programas da AIESEC
const siglaProduto = [
    'GV',  // Voluntário Global
    'GTas', // Talento Global Short Term
    'GTaml', // Talento Global Mid e Long Term
    'GTe'  // Professor Global
];

// Siglas dos escritórios (locais) da AIESEC
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
    "MC"   // BRASIL (NACIONAL)
];

// --------------------- VARIÁVEIS DE ARMAZENAMENTO ---------------------

// Array que armazenará os nomes das AIESEC locais ativos (CLs)
let ArrayCl;

// Array que armazenará os produtos ativos
let ArrayProduto;

// Objeto que armazenará os campos retornados pela API
let campos;

// --------------------- BOTÃO GERAR ---------------------

// Adiciona um evento de clique ao botão "Gerar URL".
// Quando o usuário clicar no botão, a função `atualizarURL` será chamada.
// Essa função é responsável por gerar a URL completa com base nos selects e inputs preenchidos.
generateBtn.addEventListener("click", () => {
    
    const utm_source = document.getElementById("utm_source")?.value; // Fonte de tráfego
    const utm_medium = document.getElementById("utm_medium")?.value; // Tipo de anúncio
    const utm_campaign = document.getElementById("utm_campaign")?.value?.trim(); // Nome da campanha
    const utm_term = document.getElementById("utm_term")?.value; // Cl/Escritório
    const utm_content = document.getElementById("utm_content")?.value; // Produto

    if (!utm_source || !utm_medium || !utm_campaign || !utm_term || !utm_content){

        const modal = document.getElementById("exampleModalLong");
        const modalErro = new bootstrap.Modal(modal);
        
        const tituloModal = document.getElementById("exampleModalLongTitle");
        tituloModal.textContent = "Erro!";

        const corpoModal = document.getElementById("DadosAqui");
        corpoModal.textContent = "Para gerar a URL, preencha todos os campos.";
        
        const botaoConfirmar = document.getElementById("botaoConfirmar");
        botaoConfirmar.style.display = "none";

        const botaoCorrigir = document.getElementById("botaoCancelar")
        botaoCorrigir.textContent = "Corrigir";
        
        modalErro.show();

        return;
    }

    atualizarURL;

});


// --------------------- BOTÃO COPIAR ---------------------

// Adiciona um evento de clique ao botão "Copiar URL".
// Quando o usuário clicar no botão, executa uma função assíncrona.
copyBtn.addEventListener("click", async () => {
    // Captura o valor atual da URL gerada no campo de texto
    const url = resultUrl.value;

    // Se não houver URL gerada, exibe uma mensagem de erro e retorna
    if (!url) {
        copyMsg.textContent = "Nenhuma URL gerada ainda!";
        copyMsg.style.color = "red";
        return;
    }

    try {
        // Tenta copiar a URL para a área de transferência usando a API Clipboard
        await navigator.clipboard.writeText(url);

        // Se bem-sucedido, atualiza a mensagem de status para sucesso
        copyMsg.textContent = "✅ URL copiada com sucesso!";
        copyMsg.style.color = "#00B2FF";
    } catch (err) {
        // Caso ocorra algum erro ao copiar, exibe mensagem de erro
        copyMsg.textContent = "❌ Erro ao copiar!";
        copyMsg.style.color = "red";
    }
});


/**
 * Função assíncrona que carrega os dados da API para popular os selects da página.
 * Durante o carregamento, cada select é desabilitado e exibe "Carregando...".
 * Após receber os dados, popula os selects com os valores ativos, habilita-os
 * e atualiza automaticamente a URL inicial.
 *
 * Campos populados:
 * - Produto (utm_content)
 * - AIESEC mais próxima (utm_term)
 * - Como conheceu a AIESEC (utm_source)
 * - Tipo de anúncio (utm_medium)
 *
 * @async
 * @function
 */
async function carregarElemento() {
    const selects = ["utm_content", "utm_term", "utm_source", "utm_medium"];

    // Inicializa selects com "Carregando..." e desabilita
    selects.forEach(id => {
        const dropdown = document.getElementById(id);
        dropdown.innerHTML = "";
        dropdown.setAttribute("disabled", "");

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Carregando...";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        dropdown.appendChild(defaultOption);
    });

    const url = "https://baziaiesec.pythonanywhere.com/metadados-card";

    try {
        const response = await fetch(url);
        const data = await response.json();
        campos = data?.data?.fields;

        if (!campos) throw new Error("Campos ausentes na resposta da API.");

        // ---------------- PRODUTOS ----------------
        const produtos = campos.find(f => f.label === "Produto");
        ArrayProduto = produtos.config.settings.options.filter(opt => opt.status === "active").map(opt => opt.text);

        
        const dropdownProduto = document.getElementById("utm_content");
        ArrayProduto.forEach((p, i) => {
            const opt = document.createElement("option");
            opt.value = p;
            opt.textContent = `${p} (${siglaProduto[i]})`;
            dropdownProduto.appendChild(opt);
        });
        dropdownProduto.removeAttribute("disabled");

        // ---------------- AIESEC MAIS PRÓXIMA ----------------
        const aiesecProx = campos.find(f => f.label === "Qual é a AIESEC mais próxima de você?");
        ArrayCl = aiesecProx.config.settings.options.filter(opt => opt.status === "active").map(opt => opt.text);

        const dropdownAiesec = document.getElementById("utm_term");
        ArrayCl.forEach((cl, i) => {
            const opt = document.createElement("option");
            opt.value = cl;
            opt.textContent = `${cl} (${escritorios[i]})`;
            dropdownAiesec.appendChild(opt);
        });
        dropdownAiesec.removeAttribute("disabled");

        // ---------------- COMO CONHECEU ----------------
        const comoConheceu = campos.find(f => f.label === "Como você conheceu a AIESEC?");
        const ativosComo = comoConheceu.config.settings.options.filter(opt => opt.status === "active").map(opt => opt.text);

        const dropdownSource = document.getElementById("utm_source");
        ativosComo.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c;
            opt.textContent = c;
            dropdownSource.appendChild(opt);
        });
        dropdownSource.removeAttribute("disabled");

        // ---------------- TIPO DE ANÚNCIO ----------------
        const tipoAnuncio = campos.find(f => f.label === "Como?");
        const ativosTipo = tipoAnuncio.config.settings.options.filter(opt => opt.status === "active").map(opt => opt.text);

        const dropdownMedium = document.getElementById("utm_medium");
        ativosTipo.forEach(a => {
            const opt = document.createElement("option");
            opt.value = a;
            opt.textContent = a;
            dropdownMedium.appendChild(opt);
        });
        dropdownMedium.removeAttribute("disabled");

        // Modifica o botão "Carregando..." para "Selecione"
        selects.forEach(id => {
        const dropdown = document.getElementById(id);
        const selectButton = dropdown.options[0];
        selectButton.textContent = "Selecione";
        });

        // Atualiza URL automaticamente
        atualizarURL();
        inicializarAtualizacaoAutomatica();

    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        alert("Erro de conexão. Recarregue a página e tente novamente.");
    }
}


/**
 * Converte um texto em um "slug" seguro para URL.
 * 
 * Transformações aplicadas:
 * - Converte todo o texto para minúsculas.
 * - Remove acentos e diacríticos.
 * - Substitui espaços por hífens.
 * - Remove caracteres que não sejam letras, números, hífens ou barras.
 * - Normaliza múltiplos hífens ou barras consecutivos para apenas um.
 * - Remove hífens ou barras no início ou no final.
 *
 * Exemplo:
 * slugify("Talento Global Short Term") -> "talento-global-short-term"
 *
 * @param {string} texto - O texto a ser transformado em slug.
 * @returns {string} - Texto convertido em slug seguro para URL.
 */
function slugify(texto) {
    return texto
        .toLowerCase() // Converte todas as letras para minúsculas
        .normalize("NFD") // Separa letras de acentos (ex: á -> a + ´)
        .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
        .replace(/\s+/g, "-") // Substitui espaços por hífens
        .replace(/[^a-z0-9-/]/g, "") // Remove caracteres inválidos
        .replace(/-+/g, "-") // Substitui múltiplos hífens consecutivos por um
        .replace(/\/+/g, "/") // Substitui múltiplas barras consecutivas por uma
        .replace(/^[-/]+|[-/]+$/g, ""); // Remove hífens ou barras no início/fim
}


/**
 * Atualiza o campo de URL (`resultUrl`) com base nos valores selecionados
 * nos campos de UTM (source, medium, campaign, term, content).
 * 
 * A URL é construída no formato:
 *   https://aiesec.org.br/{rota}/?utm_source={source}&utm_medium={medium}&utm_campaign={campaign}&utm_term={term}&utm_content={content}
 * 
 * Regras aplicadas:
 * - `utm_content` é usado para definir a rota; se for Talento Global Short/Long, a rota será "Talento Global".
 * - `utm_term` e `utm_content` são convertidos para suas siglas correspondentes (`escritorios` e `siglaProduto`).
 * - Caso os valores de term ou content não existam, eles virão vazios na URL.
 * - Os valores são normalizados e convertidos para slug seguro para URL.
 * 
 * Observação:
 * - A função só atualiza a URL se `ArrayCl` e `ArrayProduto` estiverem carregados.
 * - A mensagem de copiar (`copyMsg`) é resetada após a atualização.
 */
function atualizarURL() {
    const baseUrl = "https://aiesec.org.br"; // URL base da AIESEC

    // Retorna se os arrays de clientes ou produtos ainda não foram carregados
    if (!ArrayCl || !ArrayProduto) return;

    // Captura os valores dos campos UTM
    const utm_source = document.getElementById("utm_source")?.value; // Fonte de tráfego
    const utm_medium = document.getElementById("utm_medium")?.value; // Tipo de anúncio
    const utm_campaign = document.getElementById("utm_campaign")?.value?.trim(); // Nome da campanha
    const utm_term = document.getElementById("utm_term")?.value; // Cl/Escritório
    const utm_content = document.getElementById("utm_content")?.value; // Produto

    // Se todos os campos estiverem vazios, limpa a URL
    if (!utm_source && !utm_medium && !utm_campaign && !utm_term && !utm_content) {
        resultUrl.value = "";
        return;
    }

    // Normaliza e transforma os campos em slug seguro para URL
    const source = encodeURIComponent(slugify(utm_source));
    const medium = encodeURIComponent(slugify(utm_medium));
    const campaign = encodeURIComponent(slugify(utm_campaign));

    // Encontra o índice da sigla correspondente ao escritório e produto selecionados
    const termSigla = ArrayCl.indexOf(utm_term);
    const contentSigla = ArrayProduto.indexOf(utm_content);

    // Define a rota na URL com base no produto, usando "Talento Global" para os casos específicos
    const rota = slugify(
        (
            (
                utm_content === "Talento Global Short Term" ||
                utm_content === "Talento Global Mid e Long Term"
            ) ? "Talento Global" : utm_content
        ) || "Voluntário Global" // Valor padrão se utm_content estiver vazio
    );

    // Monta a URL final com os parâmetros UTM
    const fullUrl = `${baseUrl}/${rota}/?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}&utm_term=${escritorios[termSigla]?.toLowerCase() ?? ""}&utm_content=${siglaProduto[contentSigla]?.toLowerCase() ?? ""}`;

    //Se todos os campos não estiverem preenchidos, a URL não será gerada automaticamente
    if (!utm_source || !utm_medium || !utm_campaign || !utm_term || !utm_content) {
        resultUrl.value = "";
        return;
    } else{

        resultUrl.value = fullUrl; // Atualiza o campo de resultado da URL
        copyMsg.textContent = "";   // Limpa a mensagem de copiar

    }

}


/**
 * Inicializa o monitoramento automático dos campos do formulário.
 *
 * Cada campo definido em `camposIds` terá um listener que dispara
 * a função `atualizarURL` sempre que houver mudança (`change`) ou
 * entrada de texto (`input`). Isso garante que a URL seja atualizada
 * dinamicamente conforme o usuário interage com os selects ou inputs.
 *
 * @returns {void} Não retorna nada.
 */
function inicializarAtualizacaoAutomatica() {
    // IDs dos campos que devem ser monitorados
    const camposIds = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

    
    // Percorre todos os IDs e adiciona listeners de evento
    camposIds.forEach(id => {
        const el = document.getElementById(id); // Seleciona o elemento pelo ID
        if (el) { // Se o elemento existe no DOM
            el.addEventListener("change", atualizarURL); // Atualiza URL ao mudar valor
            el.addEventListener("input", atualizarURL);  // Atualiza URL ao digitar
        }
    });
}


/**
 * Chama a função `carregarElemento` ao carregar o script.
 *
 * Essa função é responsável por buscar os dados da API, popular os selects
 * com as opções de produtos, CLs, canais e tipos de anúncio, e habilitar
 * o monitoramento automático para atualizar a URL conforme o usuário interage.
 *
 * @returns {void} Não retorna nada.
 */
carregarElemento();


// _________________________ Botão de Dúvidas _____________________________________________

//  ------------------- Botão Canal ---------------
const botaoCanal = document.getElementById("botaoCanal");

botaoCanal.addEventListener("click", () => {

    const modalIns = document.getElementById("exampleModalLong");
    const modalDuvidas = new bootstrap.Modal(modalIns);
    const tituloModal = document.getElementById("exampleModalLongTitle");
    const corpoModal = document.getElementById("DadosAqui");
    const botaoConfirmar = document.getElementById("botaoConfirmar");
    const botaoCorrigir = document.getElementById("botaoCancelar")

    tituloModal.textContent = "Dúvidas";
    corpoModal.textContent = "Qual Canal de Comunicação foi Utilizado";
    botaoConfirmar.style.display = "none";
    botaoCorrigir.textContent = "Prosseguir";
    modalDuvidas.show();
});


//  ------------------- Botão Anuncio ---------------
const botaoAnuncio = document.getElementById("botaoAnuncio");
    
botaoAnuncio.addEventListener("click", () => {

    const modalIns = document.getElementById("exampleModalLong");
    const modalDuvidas = new bootstrap.Modal(modalIns);
    const tituloModal = document.getElementById("exampleModalLongTitle");
    const corpoModal = document.getElementById("DadosAqui");
    const botaoConfirmar = document.getElementById("botaoConfirmar");
    const botaoCorrigir = document.getElementById("botaoCancelar")

    tituloModal.textContent = "Dúvidas";
    corpoModal.textContent = "Qual Tipo de Anuncio foi Feito para divulgação";
    botaoConfirmar.style.display = "none";
    botaoCorrigir.textContent = "Prosseguir";
    modalDuvidas.show();
});


//  ------------------- Botão Programas ---------------
const botaoProgramas = document.getElementById("botaoProgramas");

botaoProgramas.addEventListener("click", () => {

    const modalIns = document.getElementById("exampleModalLong");
    const modalDuvidas = new bootstrap.Modal(modalIns);
    const tituloModal = document.getElementById("exampleModalLongTitle");
    const corpoModal = document.getElementById("DadosAqui");
    const botaoConfirmar = document.getElementById("botaoConfirmar");
    const botaoCorrigir = document.getElementById("botaoCancelar")

    tituloModal.textContent = "Dúvidas";
    corpoModal.textContent = "Qual Tipo de Programa está sendo divulgado";
    botaoConfirmar.style.display = "none";
    botaoCorrigir.textContent = "Prosseguir";
    modalDuvidas.show();
});


//  ------------------- Botão CL ---------------
const botaoCL = document.getElementById("botaoCL");

botaoCL.addEventListener("click", () => {

    const modalIns = document.getElementById("exampleModalLong");
    const modalDuvidas = new bootstrap.Modal(modalIns);
    const tituloModal = document.getElementById("exampleModalLongTitle");
    const corpoModal = document.getElementById("DadosAqui");
    const botaoConfirmar = document.getElementById("botaoConfirmar");
    const botaoCorrigir = document.getElementById("botaoCancelar")

    tituloModal.textContent = "Dúvidas";
    corpoModal.textContent = "Qual Cl está divulgando a Vaga";
    botaoConfirmar.style.display = "none";
    botaoCorrigir.textContent = "Prosseguir";
    modalDuvidas.show();
});


//  ------------------- Botão Campanha ---------------
const botaoCampanha = document.getElementById("botaoCampanha");

botaoCampanha.addEventListener("click", () => {

    const modalIns = document.getElementById("exampleModalLong");
    const modalDuvidas = new bootstrap.modal(modalIns);
    const tituloModal = document.getElementById("exampleModalLongTitle");
    const corpoModal = document.getElementById("DadosAqui");
    const botaoConfirmar = document.getElementById("botaoConfirmar");
    const botaoCorrigir = document.getElementById("botaoCancelar")

    tituloModal.textContent = "Dúvidas";
    corpoModal.textContent = "Informe a campanha";
    botaoConfirmar.style.display = "none";
    botaoCorrigir.textContent = "Prosseguir";
    modalDuvidas.show();
});