document.querySelector('.botao_deslogar').addEventListener('click', () => {
                localStorage.removeItem('userName');
                window.location.href = 'login.html';
});
