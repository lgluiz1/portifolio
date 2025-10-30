from django.contrib import admin
from .models import *

# Isto define como as fotos extras serão mostradas na página do Projeto
class FotoProjetoInline(admin.TabularInline): # Ou admin.StackedInline
    model = FotoProjeto
    extra = 1 # Mostra 1 slot de upload vazio por padrão
    fields = ('foto', 'legenda', 'ordem') # Campos que aparecem

# Isto registra o modelo Projeto principal
@admin.register(Projeto)
class ProjetoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'status')
    # Esta linha "encaixa" o editor de fotos dentro do editor do projeto
    inlines = [FotoProjetoInline]

@admin.register(TipoProjeto)
class TipoProjetoAdmin(admin.ModelAdmin):
    list_display = ('nome',)  # <-- Adicione a vírgula
    

@admin.register(Biblioteca)
class BibliotecaAdmin(admin.ModelAdmin):
    list_display = ('nome',)  # <-- Adicione a vírgula
    pass