#-*- coding: utf-8 -*-
import luis
from django.db.models import Count
from .models import Node, Intent, Entity, chatbot_utterance
class cognizer:
    def __init__(self):
        self.l = luis.Luis(url='https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/f7f7ceeb-0aec-4dff-ab2f-261e7f06b6f6?subscription-key=df6f7ef91b6b4783860fee3d0dc465e8&verbose=true&timezoneOffset=0&q=')

    def cog(self, user_input, node):
        r = self.l.analyze(user_input)
        print(r)
        intents = r.intents
        return_node=None
        for intent in intents:
            intent_obj = Intent.objects.get(intent=intent.intent)
            possible_nodes=node.next_nodes.filter(allowed_intents__in=[intent_obj])
            if possible_nodes.count() is not 0:
                return_node = possible_nodes[0]
                break
        if return_node==None:
            return_node = node.next_nodes.all()[0]
        entities = r.entities
        entity_list=[]
        for entity in entities:
            entity_list.append(entity.type)
        entity_in_list = []
        entity_ex_list = []
        all_entity_obj = Entity.objects.all()
        for entity_obj in all_entity_obj:
            if entity_obj.entity in entity_list:
                entity_in_list.append(entity_obj)
            else:
                entity_ex_list.append(entity_obj)
        candidate_utterances = return_node.chatbot_utterance.all().annotate(entity_num = Count('entities'))
        filtered_utterances = candidate_utterances.filter(entities__in=entity_in_list).exclude(entities__in=entity_ex_list).order_by('-entity_num')
        if filtered_utterances.count() ==0:
            return_utt = candidate_utterances.get(entity_num=0).chatbot_template
        else:
            return_utt_obj  = filtered_utterances[0]
            return_utt = return_utt_obj.chatbot_template
            for entity in entities:
                if entity.type in return_utt:
                    return_utt = return_utt.replace("{"+entity.type+"}", entity.entity.replace(" ",""))
        dic={'quiz':return_node.quiz,'next_node_id' : return_node.node_id, 'next_node_text': return_utt, 'next_node_nn': return_node.next_nodes, 'filtered' : filtered_utterances, 'entity_in_list':entity_in_list, 'entity_out_list':entity_ex_list, 'candi' : candidate_utterances}
        return dic

    def quiz(self, user_input, node):
        return_node = node.next_nodes.all()[0]
        dic={'quiz':return_node.quiz, 'next_node_id' : return_node.node_id, 'next_node_text': return_node.chatbot_utterance.all()[0].chatbot_template, 'next_node_nn': return_node.next_nodes}#, 'filtered' : filtered_utterances, 'entity_in_list':entity_in_list, 'entity_out_list':entity_ex_list, 'candi' : candidate_utterances}
        return dic
