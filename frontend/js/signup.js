// --- Funções de Manipulação de Modal ---

// Variável global para armazenar o evento de submissão
let storedSubmitEvent = null;

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal() {
    document.getElementById('incompleteDataModal').style.display = 'none';
}

function closeDuplicateModal() {
    document.getElementById('duplicateRegistrationModal').style.display = 'none';
}

// Quando o usuário escolhe "Continuar" no modal de dados incompletos, 
// o código original simplesmente submetia o formulário.
function proceedWithIncompleteData() {
    closeModal();
    // Re-chama o handleSubmit, mas agora passando o evento original que foi armazenado
    // e a flag 'forceSubmit' como true.
    if (storedSubmitEvent) {
        handleSubmit(storedSubmitEvent, true);
    }
}

// --- Funções de Formatação (Adaptadas do React) ---

function restrictToNumbers(event) {
    const input = event.target;
    let numericValue = input.value.replace(/[^0-9]/g, "");
    const isCpf = input.name === "cpf";
    const isTelefone = input.name === "telefone";

    let maxLength = isTelefone ? 11 : (isCpf ? 11 : 11); // Max length 11 for CPF and Telefone
    if (numericValue.length > maxLength) numericValue = numericValue.substring(0, maxLength);

    if (isCpf) {
        if (numericValue.length <= 3) input.value = numericValue;
        else if (numericValue.length <= 6)
            input.value = `${numericValue.substring(0, 3)}.${numericValue.substring(3)}`;
        else if (numericValue.length <= 9)
            input.value = `${numericValue.substring(0, 3)}.${numericValue.substring(3, 6)}.${numericValue.substring(6)}`;
        else
            input.value =
                `${numericValue.substring(0, 3)}.` +
                `${numericValue.substring(3, 6)}.` +
                `${numericValue.substring(6, 9)}-` +
                `${numericValue.substring(9)}`;
    } else if (isTelefone) {
        if (numericValue.length <= 2) input.value = "(" + numericValue;
        else if (numericValue.length <= 7)
            input.value = `(${numericValue.substring(0, 2)}) ${numericValue.substring(2)}`;
        else
            input.value = `(${numericValue.substring(0, 2)}) ${numericValue.substring(2, 7)}-${numericValue.substring(7)}`;
    } else {
        input.value = numericValue;
    }
}

// --- Funções de Lógica do Formulário (Adaptadas do React) ---

async function handleSubmit(e, forceSubmit = false) {
    // Previne o comportamento padrão do formulário e armazena o evento
    storedSubmitEvent = e; 
    e.preventDefault();

    const form = document.getElementById('registrationForm');
    //const formData = new FormData(form);
    const data = {};

    // Inicializa data com valores padrão para garantir que todos os campos da entidade Users estejam presentes
    // Isso evita problemas de desserialização no backend se um campo estiver ausente no JSON
    data.nome = document.getElementById('nome_input').value || '';
    data.email = document.getElementById('email_input').value || '';
    data.senha = document.getElementById('senha_input').value || '';
    const tipo_usuario = document.getElementById('tipo_usuario').value;
    data.tipo_usuario = tipo_usuario;
    data.cpf = document.getElementById('cpf_input').value || '';
    data.cnh = document.getElementById('cnh_input').value || '';
    data.telefone = document.getElementById('telefone_input').value || '';

    // Ajusta os campos com base no tipo de usuário
    if (tipo_usuario === "Administrador") {
        const cargoSelect = document.getElementById('cpf_select');
        data.cpf = cargoSelect.value; // 'cpf' armazena o cargo para Administrador
        data.cnh = document.getElementById('cnh_input').value || ''; // 'cnh' armazena o código de verificação para Administrador
        data.telefone = ''; // Administrador não usa telefone
    }

    // Lógica de validação do React:
    const basic = data.nome && data.email && data.senha && data.tipo_usuario;
    // O campo 'extra' só é obrigatório para Cliente
    // Para Administrador, 'cpf' (cargo) e 'cnh' (código de verificação) são os campos 'extra'
    let extra;
    if (tipo_usuario === "Cliente") {
        extra = data.cpf && data.cnh && data.telefone;
    } else { // Administrador
        extra = data.cpf && data.cnh; // Cargo e Código de Verificação são obrigatórios
    }

    // Se a validação falhar e não for uma submissão forçada (ou seja, a primeira tentativa)
    if (basic && !extra && !forceSubmit) {
        showModal('incompleteDataModal');
        return;
    }

    // Removendo a formatação para o envio (importante para o servidor)
    const dataToSend = {};
    // Mapeia os dados do formulário para o formato esperado pela entidade Java (camelCase)
    Object.assign(dataToSend, data);
    dataToSend.tipoUsuario = data.tipo_usuario; // Renomeia 'tipo_usuario' para 'tipoUsuario'
    delete dataToSend.tipo_usuario; // Remove a chave antiga

    if (tipo_usuario === "Administrador") {
        // Para Admin, o 'cpf' é o cargo (texto) e não precisa de limpeza.
        // Telefone é vazio e CNH é o código de verificação.
        dataToSend.cpf = data.cpf; // O valor já está correto
    } else { // Cliente
        // A limpeza só é necessária para Cliente, que usa os campos formatados.
        dataToSend.cpf = data.cpf ? data.cpf.replace(/\D/g, "") : ""; // Remove formatação do CPF
        dataToSend.telefone = data.telefone ? data.telefone.replace(/\D/g, "") : ""; // Remove formatação do Telefone
        dataToSend.cnh = data.cnh ? data.cnh.replace(/\D/g, "") : ""; // Remove formatação da CNH
    }

    try {
            const response = await fetch("http://localhost:8080/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend)
        });

        if (response.ok) {
            // Sucesso: Redireciona para a página de sucesso
            window.location.href = "/sucesso";
        } else {
            const error = await response.json();
            if (error.error && error.error.includes("já cadastrado")) {
                // Erro de Duplicidade: Mostra o modal de duplicidade
                showModal('duplicateRegistrationModal');
            } else {
                // Outros Erros de API: Exibe um alerta
                alert("Erro: " + (error.error || "Erro desconhecido"));
            }
        }
    } catch (err) {
        // Erro de Rede ou Interno: Exibe um alerta
        alert("Erro interno. Tente novamente.");
    }
}

// --- Lógica de Interação de UI e Inicialização ---

function updateFormFields(tipoUsuario) {
    const cpfLabel = document.getElementById('cpf_label');
    const cpfInput = document.getElementById('cpf_input');
    const cpfSelect = document.getElementById('cpf_select');
    const cnhLabel = document.getElementById('cnh_label');
    const telefoneField = document.getElementById('telefone_field');
    const cnhInput = document.getElementById('cnh_input');

    if (tipoUsuario === 'Administrador') {
        // Campos para Administrador
        cpfLabel.textContent = 'Cargo';
        cpfInput.style.display = 'none';
        cpfInput.removeAttribute('required'); // Remove required do input CPF
        cpfSelect.style.display = 'block';
        cpfSelect.setAttribute('required', 'required'); // Adiciona required ao select
        
        cnhLabel.textContent = 'Código de Verificação';
        telefoneField.style.display = 'none';
        document.getElementById('telefone_input').removeAttribute('required');
    } else {
        // Campos para Cliente
        cpfLabel.textContent = 'CPF';
        cpfInput.style.display = 'block';
        cpfInput.setAttribute('required', 'required'); // Adiciona required de volta
        cpfSelect.style.display = 'none';
        cpfSelect.removeAttribute('required');
        
        cnhLabel.textContent = 'CNH';
        telefoneField.style.display = 'flex'; // Exibe o campo de telefone
        document.getElementById('telefone_input').setAttribute('required', 'required');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const tipoUsuarioSelect = document.getElementById('tipo_usuario');
    const cpfInput = document.getElementById('cpf_input');
    const cnhInput = document.getElementById('cnh_input');
    const telefoneInput = document.getElementById('telefone_input');

    // 1. Event Listeners para a Submissão do Formulário
    // Ajuste: Envolvemos a chamada em uma função anônima para garantir que o 'event' seja passado.
    form.addEventListener('submit', (e) => {
        handleSubmit(e);
    });

    // 2. Event Listeners para Formatação (CPF/CNH/Telefone)
    cpfInput.addEventListener('input', restrictToNumbers);
    cnhInput.addEventListener('input', restrictToNumbers);
    telefoneInput.addEventListener('input', restrictToNumbers);

    // 3. Event Listener para mudança de Tipo de Usuário
    tipoUsuarioSelect.addEventListener('change', (e) => {
        updateFormFields(e.target.value);
    });

    // 4. Inicialização do formulário com o valor padrão ('Cliente')
    updateFormFields(tipoUsuarioSelect.value);

    // Adiciona o listener para fechar o modal clicando no overlay
    document.getElementById('incompleteDataModal').addEventListener('click', (e) => {
        if (e.target.id === 'incompleteDataModal') {
            closeModal();
        }
    });

    document.getElementById('duplicateRegistrationModal').addEventListener('click', (e) => {
        if (e.target.id === 'duplicateRegistrationModal') {
            closeDuplicateModal();
        }
    });

});