from django.shortcuts import render
from .models import *
from servicos.models import *
import random

def home(request):
    # pega models do banco
    frases_cima = FrasesCima.objects.all()
    frases_inicio = FrasesInicio.objects.all()
    Config = Configuracoe.objects.all()
    # Busca todas as frases FrasesInicio no banco e escolhe uma aleatoriamente
    frases= FrasesInicio.objects.all()
    # escolher uma aleatoria 
    projetos = Projeto.objects.all()
    frase= random.choice(frases)
    context = {
        'frases_cima': frases_cima,
        'frases_inicio': frases_inicio,
        'Config': Config,
        'frase': frase,
        'projetos': projetos,
    }
    return render(request, 'home.html', context)

# Em seu_app/views.py
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json
from .models import ContatoTerminal 

@require_POST
def receber_contato_terminal(request):
    try:
        data = json.loads(request.body)
        
        nome = data.get('name')
        email = data.get('email')
        
        # --- CAMPO ADICIONADO ---
        telefone = data.get('telefone') # Vai ser string vazia '' se pulado, ou None
        
        mensagem = data.get('message')

        # Validação (telefone não é obrigatório)
        if not nome or not email or not mensagem:
            return JsonResponse({'status': 'erro', 'mensagem': 'Dados incompletos'}, status=400)

        # Salva no banco de dados
        ContatoTerminal.objects.create(
            nome=nome,
            email=email,
            telefone=telefone, # --- CAMPO ADICIONADO ---
            mensagem=mensagem
        )
        
        return JsonResponse({'status': 'sucesso', 'mensagem': 'Mensagem recebida!'})

    except json.JSONDecodeError:
        return JsonResponse({'status': 'erro', 'mensagem': 'Formato de JSON inválido'}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'erro', 'mensagem': str(e)}, status=500)
    
