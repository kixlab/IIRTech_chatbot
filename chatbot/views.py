#-*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from .models import Dialog, Node
from .luis_cognition import cognizer
# Create your views here.

cognizer = cognizer()

def index(request):

    return render(request, 'chatbot/chatbot.html', {})

def initialize(request):
    dialog_id = request.GET.get('dialog_id')
    dialog = Dialog.objects.get(dialog_id = dialog_id)
    head_node = dialog.head_node

    data={
        'first_text': head_node.chatbot_utterance.all()[0].chatbot_template,
        'first_node': head_node.node_id,
    }
    return JsonResponse(data)

def retrieve_text(request):
    dialog_id= request.GET.get('dialog_id')
    dialog = Dialog.objects.get(dialog_id = dialog_id)
    user_input = request.GET.get("input")
    cur_node_id= request.GET.get("cur_node")
    cur_node = Node.objects.get(node_id = cur_node_id)

    next_node = cognizer.cog(user_input, cur_node)
    #see whether the chat session ends or not
    if next_node['next_node_nn'].all().count()==0 :
        end=True
    else:
        end=False
    #see whether the chat is in ~~ state
    if dialog.practice_node.node_id == next_node['next_node_id']:
        practice = True
    else:
        practice = False
    #
    #next_node = Node.objects.get(node_id = next_node_id)

    print(next_node['filtered'])
    print(next_node['entity_in_list'])
    print(next_node['entity_out_list'])
    print(next_node['candi'])
    data={
        'next_node_id' : next_node['next_node_id'],
        'next_node_text' : next_node['next_node_text'],
        'end':end,
        'practice': practice,
    }
    return JsonResponse(data)

#when the user specifies that the chatbot is wrong, return one of converging node
def wrong_and_return(request):
    dialog_id = request.GET.get("dialog_id")
    dialog = Dialog.objects.get(dialog_id = dialog_id)

    cur_node = request.GET.get("cur_node")
    CN = Node.objects.get(node_id = cur_node)
    print(cur_node)
    if CN in dialog.convergence_node.all():
        additive_utt = dialog.end_utterance
        next_node_id = dialog.practice_node.node_id
        practice= True
    else:
        additive_utt = dialog.back_up_utterance
        next_node_id = dialog.convergence_node.all()[0].node_id
        practice = False
    data={
        'next_node_id' : next_node_id,
        'additive_utt' : additive_utt,
        'practice' : practice,
    }
    return JsonResponse(data)


def step_returner(node_id):
    if node_id == "S020":
        return "S030"
    elif node_id == "S030":
        return "T000"
    elif node_id == "T000":
        return "S040"
    elif node_id == "T010":
        return "S040"
