// ================= MODAIS =================

let storedSubmitEvent = null;

function showModal(modalId) {
    const modalElement = document.getElementById(modalId);
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function closeModal() {
    const modalElement = document.getElementById('incompleteDataModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
}

function closeDuplicateModal() {
    const modalElement = document.getElementById('duplicateRegistrationModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
}

// ================= FORMATAÇÃO =================

function restrictToNumbers(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, "");

    if (input.name === "cpf") {
        value = value.substring(0, 11);
        input.value = value
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else if (input.name === "telefone") {
        value = value.substring(0, 11);
        input.value = value
            .replace(/^(\d{2})(\d)/g, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2");
    } else {
        input.value = value;
    }
}

// ================= SUBMIT =================

async function handleSubmit(e) {
    e.preventDefault();

    const tipo_usuario = document.getElementById('tipo_usuario').value;

    const data = {
        nome: document.getElementById('nome_input').value.trim(),
        email: document.getElementById('email_input').value.trim(),
        senha: document.getElementById('senha_input').value.trim(),
        tipoUsuario: tipo_usuario,

        // CLIENTE
        cpf: '',
        cnh: '',
        telefone: '',

        // ADMIN
        cargo: '',
        codigoVerificacao: ''
    };

    // ================= ADMINISTRADOR =================
    if (tipo_usuario === "Administrador") {
        data.cargo = document.getElementById('cpf_select').value.trim();
        data.codigoVerificacao = document.getElementById('cnh_input').value.trim();
    }

    // ================= CLIENTE =================
    if (tipo_usuario === "Cliente") {
        data.cpf = document.getElementById('cpf_input').value.replace(/\D/g, '');
        data.cnh = document.getElementById('cnh_input').value.replace(/\D/g, '');
        data.telefone = document.getElementById('telefone_input').value.replace(/\D/g, '');
    }

    console.log("📤 DADOS ENVIADOS:", data);

    // ================= VALIDAÇÃO =================
    if (!data.nome || !data.email || !data.senha || !data.tipoUsuario) {
        alert("Preencha os campos obrigatórios.");
        return;
    }

    if (tipo_usuario === "Cliente") {
        if (!data.cpf || !data.cnh || !data.telefone) {
            showModal('incompleteDataModal');
            return;
        }
    }

    if (tipo_usuario === "Administrador") {
        if (!data.cargo || !data.codigoVerificacao) {
            showModal('incompleteDataModal');
            return;
        }
    }

    // ================= FETCH =================
    try {
        const response = await fetch("http://localhost:3001/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        console.log("📥 RESPOSTA BACKEND:", result);

        if (!response.ok) {
            const msg = result.error || "Erro no cadastro";

            if (msg.toLowerCase().includes("já")) {
                document.getElementById('duplicateMessage').textContent = msg;
                showModal('duplicateRegistrationModal');
                return;
            }

            alert(msg);
            return;
        }

        // ✅ SUCESSO
        window.location.href = "./success.html";

    } catch (err) {
        console.error("❌ ERRO FRONTEND:", err);
        alert("Erro ao conectar com o servidor");
    }
}


// ================= UI =================

function updateFormFields(tipoUsuario) {
    const cpfLabel = document.getElementById('cpf_label');
    const cpfInput = document.getElementById('cpf_input');
    const cpfSelect = document.getElementById('cpf_select');
    const telefoneInput = document.getElementById('telefone_input');
    const telefoneRow = telefoneInput.closest('.row');
    const cnhLabel = document.getElementById('cnh_label');

    if (tipoUsuario === 'Administrador') {
        cpfLabel.textContent = 'Cargo';

        cpfInput.style.display = 'none';
        cpfInput.removeAttribute('required');

        cpfSelect.style.display = 'block';
        cpfSelect.setAttribute('required', 'required');

        telefoneRow.style.display = 'none';
        telefoneInput.removeAttribute('required');

        cnhLabel.textContent = 'Código de Verificação';
    } 
    else {
        cpfLabel.textContent = 'CPF';

        cpfInput.style.display = 'block';
        cpfInput.setAttribute('required', 'required');

        cpfSelect.style.display = 'none';
        cpfSelect.removeAttribute('required');

        telefoneRow.style.display = 'flex';
        telefoneInput.setAttribute('required', 'required');

        cnhLabel.textContent = 'CNH';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registrationForm')
        .addEventListener('submit', handleSubmit);

    document.getElementById('cpf_input')?.addEventListener('input', restrictToNumbers);
    document.getElementById('cnh_input')?.addEventListener('input', restrictToNumbers);
    document.getElementById('telefone_input')?.addEventListener('input', restrictToNumbers);

    const tipo = document.getElementById('tipo_usuario');
    tipo.addEventListener('change', e => updateFormFields(e.target.value));
    updateFormFields(tipo.value);

    document.getElementById('closeDuplicate')
        ?.addEventListener('click', closeDuplicateModal);
});
