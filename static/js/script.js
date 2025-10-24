document.addEventListener('DOMContentLoaded', () => {

    // =======================
    // LÓGICA DO MODO ESCURO
    // =======================
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // 1. Verificar localStorage. Se não houver, definir 'dark' como padrão.
    let currentTheme = localStorage.getItem('theme') || 'dark'; // Padrão 'dark'
    htmlEl.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙'; // Define o ícone correto

    // 2. Adicionar o clique no botão
    themeToggle.addEventListener('click', () => {
        // Pega o tema ATUAL do atributo html
        const themeOnHTML = htmlEl.getAttribute('data-theme');
        
        if (themeOnHTML === 'dark') {
            htmlEl.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌙';
        } else {
            htmlEl.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️';
        }
    });

    // ... (O resto do seu script.js para Idioma e Scroll continua igual) ...
});