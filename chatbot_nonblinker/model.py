'''
치매박사 안깜빡이 ver 0.2 named by 🌱HP
Dementia Docter Nonblinker

Started at 2024. 10. 31

Data Source from aihub.or.kr
'''

# 모델을 생성하고 반환해주는 모듈

import torch
from torch import nn
import numpy as np

class Encoder(nn.Module):
    pass

class Decoder(nn.Module):
    pass

class Seq2Seq():
    pass

class Seq2SeqWithAttention():
    pass

class Transformer():
    pass

class Finetuning():
    pass

def extractModel(ver: str):
    
    if(ver == "0.1"):
        model = Seq2Seq()
    elif(ver == "0.2"):
        model = Seq2SeqWithAttention()
    elif(ver == "0.3"):
        model = Transformer()
    elif(ver == "0.4"):
        model = Finetuning()
    else:
        model = None
        print("잘못된 버전을 입력했습니다.")
    
    return model

def train():
    pass

def eval():
    pass

def predict():
    pass


def save_model():
    pass

def load_model():
    pass

