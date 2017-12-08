from django.conf.urls import url
from . import views

urlpatterns = [
    #url(r'^curriculum_retrieval', views.curriculum_retrieval, name='curriculum_retrieval'),
    url(r'^$', views.index, name='index'),
    url(r'^initialize', views.initialize, name='initialize'),
    url(r'^retrieve_text', views.retrieve_text, name='retrieve_text'),
    url(r'^wrong_and_return', views.wrong_and_return, name='wrong_and_return'),
]
