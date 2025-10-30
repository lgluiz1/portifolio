from django.db import models

class Biblioteca(models.Model):
    incone = models.CharField(max_length=255, blank=True, null=True)
    nome = models.CharField(max_length=100)
    descricao = models.TextField( blank=True, null=True)
    
    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name = 'Biblioteca'
        verbose_name_plural = 'Bibliotecas'

class TipoProjeto(models.Model):
    nome = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nome   
    
    class Meta:
        verbose_name = 'Tipo de Projeto'
        verbose_name_plural = 'Tipos de Projetos'

# -----------------------------------------------
# --- MODELO PROJETO ATUALIZADO ---
# -----------------------------------------------
class Projeto(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField()
    status = models.CharField(max_length=20)
    preview_url = models.URLField()
    ano = models.PositiveIntegerField()
    foto_principal = models.ImageField(upload_to='fotos_projetos')

    # --- MUDANÇA AQUI ---
    # Trocado de ForeignKey para ManyToManyField para permitir vários
    bibliotecas = models.ManyToManyField(
        Biblioteca, 
        related_name='projetos', 
        blank=True  # blank=True é suficiente para M2M
    )
    
    # --- MUDANÇA AQUI ---
    # Trocado de ForeignKey para ManyToManyField para permitir vários
    tipos = models.ManyToManyField(
        TipoProjeto, 
        related_name='projetos', 
        blank=True
    )
    # -------------------------------

    def __str__(self):
        return self.nome

# --- NOVO MODELO PARA A GALERIA ---

class FotoProjeto(models.Model):
    # 1. O Link para o "Projeto" pai
    projeto = models.ForeignKey(
        Projeto, 
        on_delete=models.CASCADE, 
        related_name='fotos'  # Como você acessará as fotos: ex: meu_projeto.fotos.all()
    )
    
    # 2. O campo para a foto
    foto = models.ImageField(upload_to='fotos_projetos/galeria/')
    
    # 3. (Opcional, mas recomendado) Uma legenda para a foto
    legenda = models.CharField(max_length=255, blank=True, null=True)
    
    # 4. (Opcional, mas recomendado) Um campo para ordenar as fotos
    ordem = models.PositiveIntegerField(default=0)

    class Meta:
        # Garante que as fotos sejam ordenadas pela ordem que você definir
        ordering = ['ordem']

    def __str__(self):
        # Mostra um nome útil no admin
        return f"Foto de {self.projeto.nome} ({self.id})"