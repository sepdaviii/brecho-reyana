
const moeda = valor =>
    Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

const hoje = new Date();

const dataAtual = hoje.toLocaleDateString("pt-BR");

let proximoId = 109;
let tipoModal = "";

// Produtos cadastrados
let produtos = [
    { id: 101, nome: "Blusa de linho", categoria: "Blusas", tamanho: "M", preco: 39.90, quantidade: 18 },
];

// Vendas de exemplo
let vendas = [
    { data: "22/10/2026", nome: "Blusa de linho", quantidade: 1, pagamento: "Pix", total: 39.90 },
];

// Despesas de exemplo
let despesas = [
    { nome: "Embalagens", categoria: "Materiais", data: "20/10/2026", valor: 180 },
    { nome: "Aluguel", categoria: "Estrutura", data: "05/10/2026", valor: 800 },
    { nome: "Transporte", categoria: "Logística", data: "18/10/2026", valor: 170 }
];


// FUNÇÕES AUXILIARES

function buscarElemento(id) {
    return document.getElementById(id);
}

function textoSeguro(texto) {
    return String(texto).replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}

function quantidadeEmEstoque() {
    return produtos.reduce((total, produto) => total + produto.quantidade, 0);
}

function produtosComPoucoEstoque() {
    return produtos.filter(produto => produto.quantidade <= 3);
}

function mostrarAviso(mensagem) {
    const avisoAntigo = document.querySelector(".aviso");

    if (avisoAntigo) {
        avisoAntigo.remove();
    }

    const aviso = document.createElement("div");
    aviso.className = "aviso";
    aviso.textContent = mensagem;

    document.body.appendChild(aviso);

    setTimeout(() => aviso.remove(), 2800);
}


// NAVEGAÇÃO

const nomesPaginas = {
    dashboard: "Visão geral",
    estoque: "Estoque",
    vendas: "Vendas",
    financeiro: "Financeiro",
    relatorios: "Relatórios",
    configuracoes: "Configurações"
};

function abrirPagina(nome) {
    document.querySelectorAll(".page").forEach(pagina => {
        pagina.classList.add("hidden");
    });

    const paginaSelecionada = buscarElemento(nome + "Page");

    if (!paginaSelecionada) return;

    paginaSelecionada.classList.remove("hidden");

    document.querySelectorAll("[data-page]").forEach(botao => {
        botao.classList.toggle("active", botao.dataset.page === nome);
    });

    buscarElemento("breadcrumb").textContent = nomesPaginas[nome];

    buscarElemento("sidebar").classList.remove("open");

    if (nome === "estoque") atualizarEstoque();
    if (nome === "vendas") atualizarVendas();
    if (nome === "financeiro") atualizarFinanceiro();
    if (nome === "relatorios") atualizarRelatorios();

    window.scrollTo(0, 0);
}


// DASHBOARD

function atualizarGrafico() {
    const valores = [42, 65, 50, 78, 57, 88, 68];
    const dias = ["Sex", "Sáb", "Dom", "Seg", "Ter", "Qua", "Qui"];

    buscarElemento("salesChart").innerHTML = valores.map((valor, indice) => `
        <div class="bar-wrap">
            <div class="bar ${indice === 6 ? "highlight" : ""}"
                 style="height: ${valor}%"></div>
            <div class="bar-label">${dias[indice]}</div>
        </div>
    `).join("");
}

function atualizarAtividades() {
    buscarElemento("activityList").innerHTML = vendas.slice(0, 4).map(venda => `
        <div class="activity-item">
            <div class="activity-icon">↗</div>

            <div class="activity-copy">
                <strong>${textoSeguro(venda.nome)}</strong>
                <small>
                    ${textoSeguro(venda.data)} ·
                    ${venda.quantidade} peça(s) ·
                    ${textoSeguro(venda.pagamento || "Venda")}
                </small>
            </div>

            <div class="activity-amount">${moeda(venda.total)}</div>
        </div>
    `).join("");
}

function atualizarProdutosBaixos() {
    const lista = produtosComPoucoEstoque();

    buscarElemento("lowStockTable").innerHTML = lista.length
        ? lista.slice(0, 5).map(produto => `
            <tr>
                <td>
                    <div class="product-name">${textoSeguro(produto.nome)}</div>
                    <div class="product-code">#BR${produto.id}</div>
                </td>
                <td>${produto.quantidade}</td>
                <td><span class="pill low">Estoque baixo</span></td>
            </tr>
        `).join("")
        : `<tr><td colspan="3" class="empty">Tudo certo por aqui!</td></tr>`;
}


// ESTOQUE

function atualizarEstoque() {
    const busca = (buscarElemento("productSearch")?.value || "").toLowerCase();
    const categoria = buscarElemento("categoryFilter")?.value || "";
    const situacao = buscarElemento("stockFilter")?.value || "";

    const lista = produtos.filter(produto => {
        const correspondeBusca =
            produto.nome.toLowerCase().includes(busca) ||
            String(produto.id).includes(busca);

        const correspondeCategoria =
            !categoria || produto.categoria === categoria;

        const correspondeEstoque =
            !situacao ||
            (situacao === "low" && produto.quantidade <= 3) ||
            (situacao === "ok" && produto.quantidade > 3);

        return correspondeBusca && correspondeCategoria && correspondeEstoque;
    });

    buscarElemento("inventoryTable").innerHTML = lista.length
        ? lista.map(produto => `
            <tr>
                <td>
                    <div class="product-name">${textoSeguro(produto.nome)}</div>
                    <div class="product-code">#BR${produto.id}</div>
                </td>
                <td>${textoSeguro(produto.categoria)}</td>
                <td>${textoSeguro(produto.tamanho)}</td>
                <td>${moeda(produto.preco)}</td>
                <td>${produto.quantidade}</td>
                <td>
                    <span class="pill ${produto.quantidade <= 3 ? "low" : ""}">
                        ${produto.quantidade <= 3 ? "Estoque baixo" : "Disponível"}
                    </span>
                </td>
                <td>
                    <button class="text-link" data-vender="${produto.id}">
                        Vender
                    </button>
                </td>
            </tr>
        `).join("")
        : `<tr><td colspan="7" class="empty">Nenhum produto encontrado.</td></tr>`;

    atualizarResumo();
}


// VENDAS

function atualizarVendas() {
    const busca = (buscarElemento("saleSearch")?.value || "").toLowerCase();

    const lista = vendas.filter(venda =>
        venda.nome.toLowerCase().includes(busca)
    );

    buscarElemento("salesTable").innerHTML = lista.length
        ? lista.map(venda => `
            <tr>
                <td>${textoSeguro(venda.data)}</td>
                <td class="product-name">${textoSeguro(venda.nome)}</td>
                <td>${venda.quantidade}</td>
                <td><span class="pill neutral">${textoSeguro(venda.pagamento || "Não informado")}</span></td>
                <td><b>${moeda(venda.total)}</b></td>
            </tr>
        `).join("")
        : `<tr><td colspan="5" class="empty">Nenhuma venda encontrada.</td></tr>`;

    buscarElemento("salesQty").textContent = vendas.length;

    const totalVendas = vendas.reduce((total, venda) => total + venda.total, 0);
    buscarElemento("salesSum").textContent = moeda(totalVendas);
}


// FINANCEIRO

function atualizarFinanceiro() {
    buscarElemento("expensesTable").innerHTML = despesas.map(despesa => `
        <tr>
            <td class="product-name">${textoSeguro(despesa.nome)}</td>
            <td>${textoSeguro(despesa.categoria)}</td>
            <td>${textoSeguro(despesa.data)}</td>
            <td><b>${moeda(despesa.valor)}</b></td>
        </tr>
    `).join("");

    const totalDespesas = despesas.reduce((total, despesa) => total + despesa.valor, 0);

    buscarElemento("finExpenses").textContent = moeda(totalDespesas);
    buscarElemento("finBalance").textContent = moeda(4280 - totalDespesas);
}


// RELATÓRIOS

function atualizarRelatorios() {
    const categorias = {};

    produtos.forEach(produto => {
        categorias[produto.categoria] =
            (categorias[produto.categoria] || 0) + produto.quantidade;
    });

    const maiorQuantidade = Math.max(1, ...Object.values(categorias));

    buscarElemento("categoryReport").innerHTML =
        Object.entries(categorias).map(([categoria, quantidade]) => `
            <div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:7px">
                    <b>${textoSeguro(categoria)}</b>
                    <span style="color:var(--muted)">${quantidade} peças</span>
                </div>

                <div style="height:8px;border-radius:8px;background:#f0e7de;overflow:hidden">
                    <div style="height:100%;width:${quantidade / maiorQuantidade * 100}%;background:var(--brown);border-radius:8px"></div>
                </div>
            </div>
        `).join("");

    buscarElemento("reportProducts").textContent = produtos.length;
    buscarElemento("reportStock").textContent = quantidadeEmEstoque();
    buscarElemento("reportLow").textContent = produtosComPoucoEstoque().length;

    const valorEstoque = produtos.reduce(
        (total, produto) => total + produto.preco * produto.quantidade,
        0
    );

    buscarElemento("reportValue").textContent = moeda(valorEstoque);
}


// RESUMO DO ESTOQUE

function atualizarResumo() {
    const total = quantidadeEmEstoque();
    const poucos = produtosComPoucoEstoque().length;

    buscarElemento("stockCount").textContent = total;
    buscarElemento("inventoryTotal").textContent = total;
    buscarElemento("productTotal").textContent = produtos.length;
    buscarElemento("inventoryLow").textContent = poucos;
    buscarElemento("lowCount").textContent = poucos + " itens";

    atualizarProdutosBaixos();
    atualizarRelatorios();
}


// JANELA DE CADASTRO

function criarCampo(rotulo, nome, tipo = "text", opcoes = "") {
    const campoCompleto = nome === "nome" ? "full" : "";

    if (tipo === "select") {
        return `
            <div class="field ${campoCompleto}">
                <label for="campo_${nome}">${rotulo}</label>
                <select id="campo_${nome}" name="${nome}" required>
                    ${opcoes}
                </select>
            </div>
        `;
    }

    return `
        <div class="field ${campoCompleto}">
            <label for="campo_${nome}">${rotulo}</label>
            <input
                id="campo_${nome}"
                name="${nome}"
                type="${tipo}"
                ${tipo === "number" ? 'min="0" step="any"' : ""}
                required
            >
        </div>
    `;
}

function abrirModal(tipo) {
    tipoModal = tipo;

    let titulo = "";
    let descricao = "";
    let campos = "";

    if (tipo === "produto") {
        titulo = "Cadastrar peça";
        descricao = "Adicione uma peça ao estoque.";

        campos =
            criarCampo("Nome da peça", "nome") +
            criarCampo(
                "Categoria",
                "categoria",
                "select",
                `<option value="">Selecione</option>
                ${["Blusas", "Calças", "Vestidos", "Casacos", "Calçados", "Acessórios"]
                    .map(categoria => `<option>${categoria}</option>`).join("")}`
            ) +
            criarCampo("Tamanho", "tamanho") +
            criarCampo("Preço de venda (R$)", "preco", "number") +
            criarCampo("Quantidade", "quantidade", "number");

    } else if (tipo === "venda") {
        titulo = "Registrar venda";
        descricao = "Informe os dados da venda.";

        campos =
            criarCampo(
                "Produto",
                "produtoId",
                "select",
                `<option value="">Selecione uma peça</option>
                ${produtos.filter(p => p.quantidade > 0)
                    .map(p => `<option value="${p.id}">${textoSeguro(p.nome)} — ${p.quantidade} un.</option>`)
                    .join("")}`
            ) +
            criarCampo("Quantidade", "quantidade", "number") +
            criarCampo(
                "Forma de pagamento",
                "pagamento",
                "select",
                `<option>Pix</option><option>Cartão</option><option>Dinheiro</option><option>Transferência</option>`
            );

    } else {
        titulo = "Registrar despesa";
        descricao = "Registre uma saída financeira.";

        campos =
            criarCampo("Descrição", "nome") +
            criarCampo(
                "Categoria",
                "categoria",
                "select",
                `<option>Materiais</option><option>Estrutura</option><option>Logística</option><option>Outros</option>`
            ) +
            criarCampo("Valor (R$)", "valor", "number");
    }

    buscarElemento("modalTitle").textContent = titulo;
    buscarElemento("modalDescription").textContent = descricao;
    buscarElemento("modalFields").innerHTML = campos;
    buscarElemento("modalBackdrop").classList.remove("hidden");

    document.body.style.overflow = "hidden";
}

function fecharModal() {
    buscarElemento("modalBackdrop").classList.add("hidden");
    document.body.style.overflow = "";
}


// SALVAR FORMULÁRIOS

function salvarFormulario(evento) {
    evento.preventDefault();

    const dados = Object.fromEntries(new FormData(evento.target));

    if (tipoModal === "produto") {
        produtos.unshift({
            id: proximoId++,
            nome: dados.nome.trim(),
            categoria: dados.categoria,
            tamanho: dados.tamanho.trim(),
            preco: Number(dados.preco),
            quantidade: Math.floor(Number(dados.quantidade))
        });

        atualizarEstoque();
        mostrarAviso("Peça cadastrada com sucesso!");
    }

    if (tipoModal === "venda") {
        const produto = produtos.find(p => p.id === Number(dados.produtoId));
        const quantidade = Math.floor(Number(dados.quantidade));

        if (!produto || quantidade < 1 || quantidade > produto.quantidade) {
            mostrarAviso("Confira o produto e a quantidade disponível.");
            return;
        }

        produto.quantidade -= quantidade;

        vendas.unshift({
            data: dataAtual,
            nome: produto.nome,
            quantidade,
            pagamento: dados.pagamento,
            total: produto.preco * quantidade
        });

        atualizarVendas();
        atualizarAtividades();
        atualizarEstoque();

        mostrarAviso("Venda registrada com sucesso!");
    }

    if (tipoModal === "despesa") {
        despesas.unshift({
            nome: dados.nome.trim(),
            categoria: dados.categoria,
            data: dataAtual,
            valor: Number(dados.valor)
        });

        atualizarFinanceiro();
        mostrarAviso("Despesa registrada com sucesso!");
    }

    fecharModal();
}


// EXPORTAR ESTOQUE

function exportarEstoque() {
    const linhas = [
        ["Código", "Produto", "Categoria", "Tamanho", "Preço", "Quantidade"],
        ...produtos.map(produto => [
            produto.id,
            produto.nome,
            produto.categoria,
            produto.tamanho,
            produto.preco,
            produto.quantidade
        ])
    ];

    const conteudo = "\uFEFF" + linhas
        .map(linha => linha.map(valor =>
            '"' + String(valor).replace(/"/g, '""') + '"'
        ).join(";"))
        .join("\n");

    const arquivo = new Blob([conteudo], {
        type: "text/csv;charset=utf-8;"
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(arquivo);

    link.href = url;
    link.download = "estoque-brecho-reyana.csv";
    link.click();

    URL.revokeObjectURL(url);
}


// CONFIGURAÇÕES

function salvarConfiguracoes(evento) {
    evento.preventDefault();

    const nome = buscarElemento("companyName").value.trim();

    document.querySelector(".brand-name").textContent = nome;

    mostrarAviso("Preferências atualizadas nesta sessão.");
}


// EVENTOS

document.querySelectorAll("[data-page]").forEach(botao => {
    botao.addEventListener("click", () => abrirPagina(botao.dataset.page));
});

document.querySelectorAll("[data-goto]").forEach(botao => {
    botao.addEventListener("click", () => abrirPagina(botao.dataset.goto));
});

buscarElemento("menuBtn").addEventListener("click", () => {
    buscarElemento("sidebar").classList.toggle("open");
});

buscarElemento("productSearch").addEventListener("input", atualizarEstoque);
buscarElemento("categoryFilter").addEventListener("change", atualizarEstoque);
buscarElemento("stockFilter").addEventListener("change", atualizarEstoque);
buscarElemento("saleSearch").addEventListener("input", atualizarVendas);

buscarElemento("addProduct").addEventListener("click", () => abrirModal("produto"));
buscarElemento("addSale").addEventListener("click", () => abrirModal("venda"));
buscarElemento("addExpense").addEventListener("click", () => abrirModal("despesa"));

buscarElemento("quickSale").addEventListener("click", () => {
    abrirPagina("vendas");
    abrirModal("venda");
});

buscarElemento("cancelModal").addEventListener("click", fecharModal);
buscarElemento("modalForm").addEventListener("submit", salvarFormulario);
buscarElemento("exportCsv").addEventListener("click", exportarEstoque);
buscarElemento("settingsForm").addEventListener("submit", salvarConfiguracoes);

buscarElemento("modalBackdrop").addEventListener("click", evento => {
    if (evento.target === buscarElemento("modalBackdrop")) {
        fecharModal();
    }
});

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") fecharModal();
});

document.addEventListener("click", evento => {
    const botao = evento.target.closest("[data-vender]");

    if (!botao) return;

    const produtoId = Number(botao.dataset.vender);
    const produto = produtos.find(p => p.id === produtoId);

    if (!produto || produto.quantidade < 1) {
        mostrarAviso("Produto sem estoque.");
        return;
    }

    abrirModal("venda");
    buscarElemento("campo_produtoId").value = String(produtoId);
    buscarElemento("campo_quantidade").value = "1";
});


// INICIALIZAÇÃO

buscarElemento("today").textContent = hoje.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
});

atualizarGrafico();
atualizarAtividades();
atualizarEstoque();
atualizarVendas();
atualizarFinanceiro();
atualizarRelatorios();
