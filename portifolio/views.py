from django.shortcuts import render
from .models import *
import random

def home(request):
    # pega models do banco
    frases_cima = FrasesCima.objects.all()
    frases_inicio = FrasesInicio.objects.all()
    Config = Configuracoe.objects.all()
    # Busca todas as frases FrasesInicio no banco e escolhe uma aleatoriamente
    frases= FrasesInicio.objects.all()
    # escolher uma aleatoria 
    frase= random.choice(frases)
    context = {
        'frases_cima': frases_cima,
        'frases_inicio': frases_inicio,
        'Config': Config,
        'frase': frase
    }
    return render(request, 'home.html', context)

# Em seu_app/views.py
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json
from .models import ContatoTerminal # Importe seu modelo

@require_POST # Garante que esta view só aceita requisições POST
def receber_contato_terminal(request):
    try:
        # O JS está enviando JSON, então precisamos ler o 'body'
        data = json.loads(request.body)
        
        nome = data.get('name')
        email = data.get('email')
        mensagem = data.get('message')

        # Validação simples
        if not nome or not email or not mensagem:
            return JsonResponse({'status': 'erro', 'mensagem': 'Dados incompletos'}, status=400)

        # Salva no banco de dados
        ContatoTerminal.objects.create(
            nome=nome,
            email=email,
            mensagem=mensagem
        )
        
        # Retorna uma resposta de sucesso para o JS
        return JsonResponse({'status': 'sucesso', 'mensagem': 'Mensagem recebida!'})

    except json.JSONDecodeError:
        return JsonResponse({'status': 'erro', 'mensagem': 'Formato de JSON inválido'}, status=400)
    except Exception as e:
        # Pega qualquer outro erro
        return JsonResponse({'status': 'erro', 'mensagem': str(e)}, status=500)