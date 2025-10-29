#urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('api/receber-contato/', views.receber_contato_terminal, name='api-receber-contato'),
]