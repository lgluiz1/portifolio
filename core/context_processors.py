from portifolio.models import Configuracoe # Ou o nome real do seu modelo

def global_settings(request):
    """
    Este processador injeta a configuração global do site em todos os templates.
    """
    
    # Pega a *primeira* configuração do banco.
    # Usamos .first() para não dar erro se o banco estiver vazio.
    config_obj = Configuracoe.objects.first() 
    
    # O nome da chave ('config_global') será o nome da variável no template
    return {'config_global': config_obj}