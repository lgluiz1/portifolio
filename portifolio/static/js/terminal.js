document.addEventListener('DOMContentLoaded', () => {

    // Trava de segurança
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
        telefone: '', // <-- MUDANÇA
        message: ''
    };

    const conversation = [
        { type: 'prompt', text: '[SYSTEM]: Olá! Para iniciar, qual é o seu nome?' },
        { type: 'prompt', text: '[SYSTEM]: Olá, {name}! Qual é o seu email?' },
        // <-- MUDANÇA: Nova pergunta adicionada
        { type: 'prompt', text: '[SYSTEM]: Qual é o seu telefone? (Opcional - pressione Enter para pular)' },
        { type: 'prompt', text: '[SYSTEM]: Entendido. Agora, digite sua mensagem.' }
    ];

    // ===========================================
    // --- 3. FUNÇÕES PRINCIPAIS DO TERMINAL ---
    // ===========================================

    function openTerminal(e) {
        e.preventDefault(); 
        terminalModal.classList.remove('hidden');
        terminalInput.focus();
        
        if (currentStep === 0) { 
            startConversation();
        }
    }

    function closeTerminal() {
        terminalModal.classList.add('hidden');
        resetTerminal(); 
    }
    
    function resetTerminal() {
        terminalOutput.innerHTML = ''; 
        terminalInput.value = '';
        terminalInput.disabled = false; 
        currentStep = 0; 
        formData.name = '';
        formData.email = '';
        formData.telefone = ''; // <-- MUDANÇA
        formData.message = '';
    }

    function addOutput(text, type) {
        const p = document.createElement('p');
        p.textContent = text;
        p.className = `text-${type}`;
        terminalOutput.appendChild(p);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function startConversation() {
        addOutput('[SYSTEM]: Conectando ao servidor de Luiz Gustavo...', 'system');
        setTimeout(() => {
            addOutput('[SYSTEM]: Conectado.', 'system');
            askQuestion();
        }, 1000); 
    }

    function askQuestion() {
        if (currentStep < conversation.length) {
            let questionText = conversation[currentStep].text;
            questionText = questionText.replace('{name}', formData.name);
            addOutput(questionText, conversation[currentStep].type);
        }
    }

    // LIDA COM O "ENTER" DO USUÁRIO
    async function handleInput(e) {
        if (e.key !== 'Enter') return; // <-- MUDANÇA: Só processa no Enter
        
        // Pega o input. Se for opcional e vazio, tudo bem.
        const input = terminalInput.value.trim();
        
        // Se a etapa NÃO for opcional (ex: nome) e o input estiver vazio, não faça nada.
        // O passo 2 (telefone) é o único opcional.
        if (currentStep !== 2 && input === '') {
            return;
        }

        addOutput(`> ${input || '(pulado)'}`, 'user'); // Mostra '(pulado)' se for vazio
        terminalInput.value = ''; 

        switch (currentStep) {
            case 0: // Recebeu o Nome
                formData.name = input;
                break;
            case 1: // Recebeu o Email
                formData.email = input;
                break;
            case 2: // <-- MUDANÇA: Recebeu o Telefone
                formData.telefone = input; // Salva o telefone (ou string vazia)
                break;
            case 3: // <-- MUDANÇA: Recebeu a Mensagem
                formData.message = input;
                currentStep++; // Avança para o passo final
                
                terminalInput.disabled = true; 
                addOutput('[SYSTEM]: Mensagem recebida. Enviando para Luiz...', 'success');
                await submitForm(); 
                return; 
        }
        
        currentStep++; 
        if (currentStep < conversation.length) {
            askQuestion();
        }
    }

    // ===========================================
    // --- 4. FUNÇÕES DE SUBMISSÃO (DJANGO) ---
    // ===========================================

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

    async function submitForm() {
        addOutput('[SYSTEM]: Processando sua mensagem...', 'system');
        
        const csrftoken = getCookie('csrftoken');
        const urlApi = '/api/receber-contato/'; // Verifique esta URL

        try {
            const response = await fetch(urlApi, {
                method: 'POST',
                body: JSON.stringify(formData), // Agora inclui o telefone
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRFToken': csrftoken
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
                    closeTerminal(); 
                }, 3000);

            } else {
                throw new Error(data.mensagem || 'Falha no envio');
            }
        } catch (error) {
            addOutput(`[ERRO]: ${error.message || 'Não foi possível enviar.'}`, 'system');
            addOutput('[SYSTEM]: Por favor, tente contatá-lo por outro meio.', 'system');
            terminalInput.disabled = false; 
        }
    }

    // ===========================================
    // --- 5. EVENT LISTENERS ---
    // ===========================================
    openTerminalBtns.forEach(btn => {
        btn.addEventListener('click', openTerminal);
    });
    
    closeTerminalBtn.addEventListener('click', closeTerminal);
    terminalInput.addEventListener('keydown', handleInput);

    terminalModal.addEventListener('click', (e) => {
        if (e.target === terminalModal) {
            closeTerminal();
        }
    });

}); // Fim do DOMContentLoaded