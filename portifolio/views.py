from django.shortcuts import render
from .models import *

def home(request):
    # pega models do banco
    frases_cima = FrasesCima.objects.all()
    frases_inicio = FrasesInicio.objects.all()
    subfrases_inicio = SubFrasesInicio.objects.all()
    Config = Configuracoe.objects.all()

    context = {
        'frases_cima': frases_cima,
        'frases_inicio': frases_inicio,
        'subfrases_inicio': subfrases_inicio,
        'Config': Config
    }
    return render(request, 'home.html')