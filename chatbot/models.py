from django.db import models

# Create your models here.
class Intent(models.Model):
    intent = models.TextField(default = "")
    def __str__(self):
        return self.intent

class Entity(models.Model):
    entity = models.TextField(default = "")
    def __str__(self):
        return self.entity
class chatbot_utterance(models.Model):
    entities = models.ManyToManyField(Entity, blank=True)
    chatbot_template = models.TextField(default="")
    def __str__(self):
        return self.chatbot_template

class Quiz(models.Model):
    hint = models.TextField(default="")
    answer = models.TextField(default="")
    feedback = models.TextField(default="")
    def __str__(self):
        return self.answer

class Node(models.Model):
    node_id = models.TextField(default = "")
    chatbot_utterance = models.ManyToManyField(chatbot_utterance)
    allowed_intents = models.ManyToManyField(Intent, blank=True)
    quiz = models.ForeignKey(Quiz, blank=True, null = True)
    next_nodes = models.ManyToManyField('self', blank=True, symmetrical = False)
    def __str__(self):
        return self.node_id

class Dialog(models.Model):
    dialog_id = models.TextField(default="")
    head_node = models.ForeignKey(Node, related_name='head')
    convergence_node = models.ManyToManyField(Node, related_name='convergence')
    practice_node = models.ForeignKey(Node, related_name='end')
    back_up_utterance = models.TextField(default = "")
    end_utterance= models.TextField(default = "")
    def __str__(self):
        return self.head_node.node_id
