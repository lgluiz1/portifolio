from django.db import models

class FrasesInicio(models.Model):
    icon = models.CharField(max_length=255)
    frase_pt = models.CharField(max_length=255)
    frase_en = models.CharField(max_length=255)
    frase_es = models.CharField(max_length=255)    

    def __str__(self):
        return self.icon , self.frase_pt
    
    class Meta:
        verbose_name = 'Frase de inicio'
        verbose_name_plural = 'Frases de inicio'
    
class SubFrasesInicio(models.Model):
    frase_pt = models.CharField(max_length=255)
    frase_en = models.CharField(max_length=255)
    frase_es = models.CharField(max_length=255)    

    def __str__(self):
        return self.frase_pt
    
    class Meta:
        verbose_name = 'Subfrase de inicio'
        verbose_name_plural = 'Subfrases de inicio'

class FrasesCima(models.Model):
    icon = models.CharField(max_length=255)
    frase_pt = models.CharField(max_length=255)
    frase_en = models.CharField(max_length=255)
    frase_es = models.CharField(max_length=255)   

    def __str__(self):
        return self.icon , self.frase_pt
    
    class Meta:
        verbose_name = 'Frase cima'
        verbose_name_plural = 'Frases cima'

class Configuracoe(models.Model):
    logo = models.ImageField(upload_to='logo', blank=True, null=True)
    nome_site = models.CharField(max_length=255, blank=True, null=True)
    telefone = models.CharField(max_length=255, blank=True, null=True)
    facebook = models.CharField(max_length=255, blank=True, null=True)
    instagram = models.CharField(max_length=255, blank=True, null=True)
    linkedin = models.CharField(max_length=255, blank=True, null=True)
    github = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField( blank=True, null=True)

    def __str__(self):
        return self.nome_site