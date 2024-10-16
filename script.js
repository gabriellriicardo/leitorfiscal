document.getElementById('xmlfile').addEventListener('change', function() {
    let formData = new FormData();
    formData.append('xmlfile', this.files[0]);

    fetch('processar.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            displayNFInfo(data.emitente, data.dataEmissao);
            displayProducts(data.produtos);
        }
    })
    .catch(error => console.error('Erro:', error));
});

function displayNFInfo(emitente, dataEmissao) {
    document.getElementById('emitente').innerText = emitente;
    document.getElementById('dataEmissao').innerText = new Date(dataEmissao).toLocaleString();
}

let allProducts = []; // Guardar todos os produtos para restaurar após pesquisa

function displayProducts(produtos) {
    allProducts = produtos; // Salva todos os produtos

    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    produtos.forEach(produto => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        productDiv.innerHTML = `
            <h3>${produto.nome}</h3>
            <p><strong>Código de Barras:</strong> ${produto.codigo_barras}</p>
            <p><strong>Quantidade:</strong> ${produto.quantidade}</p>
            <p><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</p>
            <button class="copy-btn" data-copy="${produto.codigo_barras}">Copiar Código de Barras</button>
            <button class="copy-btn" data-copy="${produto.nome}">Copiar Nome do Produto</button>
        `;
        
        productList.appendChild(productDiv);
    });

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();

        const filteredProducts = allProducts.filter(produto => {
            return produto.nome.toLowerCase().includes(query) || produto.preco.toString().includes(query);
        });

        if (query === '') {
            displayProducts(allProducts); // Restaurar lista completa
        } else {
            displayFilteredProducts(filteredProducts);
        }
    });

    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('Copiado: ' + textToCopy);
            });
        });
    });
}

function displayFilteredProducts(filteredProducts) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    filteredProducts.forEach(produto => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        productDiv.innerHTML = `
            <h3>${produto.nome}</h3>
            <p><strong>Código de Barras:</strong> ${produto.codigo_barras}</p>
            <p><strong>Quantidade:</strong> ${produto.quantidade}</p>
            <p><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</p>
            <button class="copy-btn" data-copy="${produto.codigo_barras}">Copiar Código de Barras</button>
            <button class="copy-btn" data-copy="${produto.nome}">Copiar Nome do Produto</button>
        `;
        
        productList.appendChild(productDiv);
    });
}
