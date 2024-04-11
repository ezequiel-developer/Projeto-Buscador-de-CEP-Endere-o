// SESSÃO BOTÃO CHECK PARA MUDAR LAYOUT

// Adicionando um evento de escuta ao checkbox
document.getElementById('checkMudarLayout').addEventListener('change', function () {
    // Selecionando os containers de busca por endereço via CEP
    let containerBuscarCepViaEndereco = document.querySelector('.containerBuscarCepViaEndereco');
    let containerBuscarEnderecoViaCep = document.querySelector('.containerBuscarEnderecoViaCep');

    // Verificando se o checkbox está marcado
    if (this.checked) {
        containerBuscarCepViaEndereco.style.display = 'none';
        containerBuscarEnderecoViaCep.style.display = 'block';
    } else {
        containerBuscarCepViaEndereco.style.display = 'block';
        containerBuscarEnderecoViaCep.style.display = 'none';
    }
});

// SESSÃO BUSCAR CEP VIA ENDEREÇO

// Função para validar campos de estado, cidade e endereço
function validarCamposEndereco(estado, cidade, endereco) {
    if (estado.length !== 2 || estado.length === '') {
        alert('O campo estado precisa ter uma opção selecionada.');
        return false;
    }

    if (cidade === '') {
        alert('O campo (CIDADE) está vazio, por favor digite a cidade.');
        return false;
    }

    if (endereco === '') {
        alert('O campo (ENDEREÇO) está vazio, por favor digite o endereço Rua ou Avenida.');
        return false;
    }

    return true;
}

// Função assíncrona para buscar o CEP
async function buscarCep() {
    try {
        let estado = document.getElementById('estados').value;
        let cidade = document.getElementById('cidade').value;
        let endereco = document.getElementById('endereco').value;

        if (validarCamposEndereco(estado, cidade, endereco)) {
            let urlAPI = `https://viacep.com.br/ws/${estado}/${cidade}/${endereco}/json/`;
            dados = await fetch(urlAPI).then(resposta => resposta.json());

            if (dados.length > 0) {
                exibirDadosCep(dados);
                console.log(dados)
            } else {
                alert('Endereço não encontrado. Verifique os dados informados.');
            }
        }
    } catch (error) {
        console.error('Error servidor', error);
        alert('Erro no servidor, por favor tente mais tarde.');
    }
}

// Função para exibir os dados na tabela
function exibirDadosCep(dados) {
    setTimeout(() => {
        resultadoCEP.innerHTML = '';
        estado.value = '';
        cidade.value = '';
        endereco.value = '';
    }, 40000);

    let resultadoCEP = document.getElementById('resultadoCEP');
    resultadoCEP.innerHTML = '';

    // Cria a estrutura da tabela diretamente com map
    resultadoCEP.innerHTML = `
        <table class="tabela">
            <thead>
                <tr>
                    <th>Código Postal</th>
                    <th>Endereço</th>
                    <th>Complemento</th>
                </tr>
            </thead>
            <tbody>
                ${dados.map(dado => `
                    <tr>
                        <td>${dado.cep}</td>
                        <td>${dado.localidade}, ${dado.bairro}, ${dado.logradouro}</td>
                        <td>${dado.complemento}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Adicionando evento de clique ao botão de buscar CEP
let btnBuscarCepViaEndereco = document.getElementById('btnBuscarCepViaEndereco');
btnBuscarCepViaEndereco.addEventListener('click', buscarCep);


// SESSÃO BUSCAR ENDEREÇO VIA CEP


// Função para validar o campo de CEP
function validarCampoCep(cep) {
    if (cep.length != 8) {
        alert('Digite o CEP 8 caracteres, sem o HIFEN. Exemplo: 88345030')
        return false
    }

    return true
}

// Função assíncrona para buscar endereço via CEP
async function buscarEndereco() {
    let cep = document.getElementById('cep').value

    if (!validarCampoCep(cep)) {
        return
    }

    try {
        dadosEndereco = await fetch(`https://viacep.com.br/ws/${cep}/json/`).then(resposta => resposta.json())
        console.log(cep)
        console.log(dadosEndereco)
        exibirDadosEndereco(dadosEndereco)
    } catch (error) {
        console.error("erroo", error)
    }
}

// Função para exibir os dados de endereço na tabela
function exibirDadosEndereco(dados) {
    resultadoEndereco.innerHTML = `
        <table class="tabela">
            <thead>
                <tr>
                    <th>Endereço</th>
                    <th>Complemento</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${dados.localidade} <br> ${dados.bairro} <br> ${dados.logradouro}</td>
                    <td>${dados.complemento}</td>
                </tr>
            </tbody>
        </table>
    `;
}

// Adicionando evento de clique ao botão de buscar endereço via CEP
let btnBuscarEnderecoViaCep = document.getElementById('btnBuscarEnderecoViaCep')
btnBuscarEnderecoViaCep.addEventListener('click', buscarEndereco)
