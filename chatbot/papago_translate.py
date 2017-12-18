import os
import sys
import urllib.request
import json
from google.cloud import translate

class translator:
    def __init__(self):
        self.translate_client = translate.Client()
        self.target="en"
        """self.client_id = "8r09btg7TDeaV7g67oLo"
        self.client_secret = "Oz3OtVOwDf"
        self.url = "https://openapi.naver.com/v1/papago/n2mt"
        self.request = urllib.request.Request(self.url)
        self.request.add_header("X-Naver-Client-Id",self.client_id)
        self.request.add_header("X-Naver-Client-Secret",self.client_secret)"""
    def translate(self,sentence):
        translation = self.translate_client.translate(sentence, target_language=self.target)
        return translation['translatedText']
        """encText = urllib.parse.quote(sentence)
        data = "source=ko&target=en&text=" + encText
        response = urllib.request.urlopen(self.request, data=data.encode("utf-8"))
        rescode = response.getcode()
        if(rescode==200):
            response_body = response.read()
            translated = json.loads(response_body.decode('utf-8'))
            #print(translated)
            return translated
        else:
            print("Error Code:" + rescode)
            return ""
        """
