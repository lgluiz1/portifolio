/* * =================================
 * SCRIPT REVEAL ON SCROLL (REPETÍVEL)
 * =================================
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Configurações (continuam iguais)
    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.1 // Dispara com 10% visível
    };

    // 2. O Callback (AQUI ESTÁ A MUDANÇA)
    function observerCallback(entries, observer) {
        entries.forEach(entry => {
            
            if (entry.isIntersecting) {
                // Elemento ENTROU na tela: Adiciona a classe
                entry.target.classList.add('is-visible');
            } else {
                // Elemento SAIU da tela: Remove a classe
                entry.target.classList.remove('is-visible');
            }
            
            /*
             * A linha "observer.unobserve(entry.target);"
             * foi removida daqui para permitir a re-animação.
             */
        });
    }

    // 3. Cria o Observador (continua igual)
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // 4. Inicia a observação (continua igual)
    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
    elementsToReveal.forEach(el => {
        observer.observe(el);
    });

});