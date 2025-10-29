document.addEventListener('DOMContentLoaded', () => {

    // ===========================================
    // --- TRAVA DE SEGURANÇA ---
    // Impede que o script seja executado múltiplas vezes
    // ===========================================
    if (window.terminalAppIniciado) {
        return;
    }
    window.terminalAppIniciado = true;

    // ===========================================
    // --- 1. SELETORES DO DOM ---
    // ===========================================
    const openTerminalBtns = document.querySelectorAll('.open-terminal-btn');
    const terminalModal = document.getElementById('terminal-modal');
    const closeTerminalBtn = document.getElementById('close-terminal');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    
    // ===========================================
    // --- 2. ESTADO DA CONVERSA ---
    // ===========================================
    let currentStep = 0;
    const formData = {
        name: '',
        email: '',
        message: ''
    };

    const conversation = [
        { type: 'prompt', text: '[SYSTEM]: Olá! Para iniciar, qual é o seu nome?' },
        { type: 'prompt', text: '[SYSTEM]: Olá, {name}! Qual é o seu email?' },
        { type: 'prompt', text: '[SYSTEM]: Entendido. Agora, digite sua mensagem.' }
    ];

    // ===========================================
    // --- 3. FUNÇÕES PRINCIPAIS DO TERMINAL ---
    // ===========================================

    // ABRE O MODAL E INICIA A CONVERSA
    function openTerminal(e) {
        e.preventDefault(); 
        terminalModal.classList.remove('hidden');
        terminalInput.focus();
        
        if (currentStep === 0) { 
            startConversation();
        }
    }

    // FECHA O MODAL E CHAMA O RESET
    function closeTerminal() {
        terminalModal.classList.add('hidden');
        resetTerminal(); 
    }
    
    // LIMPA TUDO PARA A PRÓXIMA VEZ
    function resetTerminal() {
        terminalOutput.innerHTML = ''; 
        terminalInput.value = '';
        terminalInput.disabled = false; 
        currentStep = 0; 
        formData.name = '';
        formData.email = '';
        formData.message = '';
    }

    // ADICIONA UMA LINHA DE TEXTO AO TERMINAL
    function addOutput(text, type) {
        const p = document.createElement('p');
        p.textContent = text;
        p.className = `text-${type}`; // ex: 'text-system', 'text-user'
        terminalOutput.appendChild(p);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // MENSAGEM INICIAL DE CONEXÃO
    function startConversation() {
        addOutput('[SYSTEM]: Conectando ao servidor de Luiz Gustavo...', 'system');
        setTimeout(() => {
            addOutput('[SYSTEM]: Conectado.', 'system');
            askQuestion();
        }, 1000); 
    }

    // FAZ A PRÓXIMA PERGUNTA
    function askQuestion() {
        if (currentStep < conversation.length) {
            let questionText = conversation[currentStep].text;
            questionText = questionText.replace('{name}', formData.name);
            addOutput(questionText, conversation[currentStep].type);
        }
    }

    // LIDA COM O "ENTER" DO USUÁRIO
    async function handleInput(e) {
        if (e.key !== 'Enter' || terminalInput.value.trim() === '') return;

        const input = terminalInput.value.trim();
        addOutput(`> ${input}`, 'user'); 
        terminalInput.value = ''; 

        switch (currentStep) {
            case 0: // Recebeu o Nome
                formData.name = input;
                break;
            case 1: // Recebeu o Email
                formData.email = input;
                break;
            case 2: // Recebeu a Mensagem
                formData.message = input;
                currentStep++; // Avança para o passo final
                
                // Trava o input e inicia o envio
                terminalInput.disabled = true; 
                addOutput('[SYSTEM]: Mensagem recebida. Enviando para Luiz...', 'success');
                await submitForm(); // Chama a função de envio
                return; // Sai da função
        }
        
        currentStep++; // Avança para o próximo passo
        if (currentStep < conversation.length) {
            askQuestion();
        }
    }

    // ===========================================
    // --- 4. FUNÇÕES DE SUBMISSÃO (DJANGO) ---
    // ===========================================

    // FUNÇÃO PARA PEGAR O CSRF TOKEN DO DJANGO
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // ENVIA O FORMULÁRIO PARA O BACKEND DJANGO
    async function submitForm() {
        addOutput('[SYSTEM]: Processando sua mensagem...', 'system');
        
        const csrftoken = getCookie('csrftoken');
        
        // !!! MUITO IMPORTANTE !!!
        // Verifique se esta é a URL correta do seu urls.py
        const urlApi = '/api/receber-contato/'; 

        try {
            const response = await fetch(urlApi, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRFToken': csrftoken // Token de segurança do Django
                }
            });

            const data = await response.json(); 

            if (response.ok && data.status === 'sucesso') {
                // --- SUCESSO E COUNTDOWN ---
                addOutput('[SYSTEM]: mensagem enviada com sucesso', 'success');
                addOutput('[SYSTEM]: Luiz Gustavo vai em breve entrar em contato com vc. Muito Obrigado', 'success');

                const countdownMessage = document.createElement('p');
                countdownMessage.className = 'text-system';
                countdownMessage.textContent = '[SYSTEM]: Esse terminal será fechado automaticamente em 3...';
                terminalOutput.appendChild(countdownMessage);
                terminalOutput.scrollTop = terminalOutput.scrollHeight;

                setTimeout(() => {
                    countdownMessage.textContent = '[SYSTEM]: Esse terminal será fechado automaticamente em 2...';
                }, 1000);

                setTimeout(() => {
                    countdownMessage.textContent = '[SYSTEM]: Esse terminal será fechado automaticamente em 1...';
                }, 2000);

                setTimeout(() => {
                    closeTerminal(); // Fecha e reseta
                }, 3000);

            } else {
                // Erro vindo do Django (ex: dados inválidos)
                throw new Error(data.mensagem || 'Falha no envio');
            }
        } catch (error) {
            // Erro de rede ou falha no fetch
            addOutput(`[ERRO]: ${error.message || 'Não foi possível enviar.'}`, 'system');
            addOutput('[SYSTEM]: Por favor, tente contatá-lo por outro meio.', 'system');
            // Reabilita o input para o usuário tentar de novo
            terminalInput.disabled = false; 
        }
    }

    // ===========================================
    // --- 5. EVENT LISTENERS ---
    // ===========================================

    // LIGA OS BOTÕES "FALE COMIGO"
    openTerminalBtns.forEach(btn => {
        btn.addEventListener('click', openTerminal);
    });
    
    // BOTÃO DE FECHAR O MODAL
    closeTerminalBtn.addEventListener('click', closeTerminal);
    
    // "ENTER" NO INPUT
    terminalInput.addEventListener('keydown', handleInput);

    // FECHAR AO CLICAR FORA (NO OVERLAY)
    terminalModal.addEventListener('click', (e) => {
        if (e.target === terminalModal) {
            closeTerminal();
        }
    });

}); // Fim do DOMContentLoaded