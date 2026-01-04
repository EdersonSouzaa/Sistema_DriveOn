// ================= MODAIS =================

function showModal(modalId) {
    const modalElement = document.getElementById(modalId);
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
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

    if (input.id === "cpf_input") {
        value = value.substring(0, 11);
        input.value = value
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else if (input.id === "telefone_input") {
        value = value.substring(0, 11);
        input.value = value
            .replace(/^(\d{2})(\d)/g, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2");
    } else if (input.id === "cnh_input") {
        value = value.substring(0, 11);
        input.value = value;
    } else {
        input.value = value;
    }
}

// ================= SUBMIT =================

async function handleSubmit(e) {
    e.preventDefault();

    const tipoUsuario = document.getElementById('tipo_usuario').value;

    const data = {
        nome: document.getElementById('nome_input').value.trim(),
        email: document.getElementById('email_input').value.trim(),
        senha: document.getElementById('senha_input').value.trim(),
        tipoUsuario,

        cpf: null,
        cnh: null,
        telefone: null,
        cargo: null,
        codigo_verificacao: null
    };

    // ===== ADMINISTRADOR =====
    if (tipoUsuario === "Administrador") {
        data.cargo = document.getElementById('cpf_select').value.trim();
        data.codigo_verificacao = document.getElementById('cnh_input').value.trim();

        if (!data.cargo || !data.codigo_verificacao) {
            showModal('incompleteDataModal');
            return;
        }
    }

    // ===== CLIENTE =====
    if (tipoUsuario === "Cliente") {
        data.cpf = document.getElementById('cpf_input').value.replace(/\D/g, '');
        data.cnh = document.getElementById('cnh_input').value.replace(/\D/g, '');
        data.telefone = document.getElementById('telefone_input').value.replace(/\D/g, '');

        if (!data.cpf || !data.cnh || !data.telefone) {
            showModal('incompleteDataModal');
            return;
        }
    }

    console.log("📤 DADOS ENVIADOS:", data);

    try {
        const response = await fetch("http://localhost:3001/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            document.getElementById('duplicateMessage').textContent =
                result.error || "Erro no cadastro";
            showModal('duplicateRegistrationModal');
            return;
        }

        window.location.href = "./success.html";

    } catch (err) {
        console.error("❌ ERRO:", err);
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
        cpfSelect.style.display = 'block';

        telefoneRow.style.display = 'none';

        cnhLabel.textContent = 'Código de Verificação';
    } else {
        cpfLabel.textContent = 'CPF';
        cpfInput.style.display = 'block';
        cpfSelect.style.display = 'none';

        telefoneRow.style.display = 'flex';

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
});
