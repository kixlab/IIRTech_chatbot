from django.contrib import admin
from .models import Dialog, Node, Intent, Entity, chatbot_utterance
# Register your models here.

admin.site.register(Intent)
admin.site.register(Dialog)
admin.site.register(Node)
admin.site.register(Entity)
admin.site.register(chatbot_utterance)
