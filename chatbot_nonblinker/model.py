'''
치매박사 안깜빡이 ver 0.2 named by 🌱HP
Dementia Docter Nonblinker

Started at 2024. 10. 31

Data Source from aihub.or.kr
'''

# 모델을 생성하고 반환해주는 모듈

import torch
from torch import nn
import torch.nn.functional as F
import numpy as np
import preprocessing
import time
from preprocessing import TextPreprocessing, ChatbotDataset, WordDictionary
import random

FILE_PATH = preprocessing.FILE_PATH
device = preprocessing.DEVICE

class EncoderLSTM(nn.Module):
    def __init__(self, input_size, hidden_size):
        super(EncoderLSTM, self).__init__()
        self.hidden_size = hidden_size
        self.embedding = nn.Embedding(input_size, hidden_size)
        self.lstm = nn.LSTM(hidden_size, hidden_size, num_layers=2)
        
    def forward(self, input, hidden):
        embedded = self.embedding(input).view(1, 1, -1)
        output, hidden = self.lstm(embedded, hidden)
        return output, hidden
    
    def initHidden(self):
        return(torch.zeros(2, 1, self.hidden_size, device=device), torch.zeros(2, 1, self.hidden_size, device=device))


class DecoderLSTM(nn.Module):
    def __init__(self, hidden_size, output_size, ):
        super(DecoderLSTM, self).__init__()
        self.hidden_size = hidden_size
        self.embedding = nn.Embedding(output_size, hidden_size)
        self.dropout = nn.Dropout(0.2)
        self.lstm = nn.LSTM(hidden_size, hidden_size, num_layers=2)
        self.out = nn.Linear(hidden_size, output_size)
    
    # 순전파    
    def forward(self, input, hidden):
        output = self.embedding(input).view(1, 1, -1)
        output = self.dropout(output)
        output = F.relu(output)
        output, hidden = self.lstm(output, hidden)
        output = self.out(output[0])
        return output, hidden
    
    def initHidden(self):
        return(torch.zeros(2, 1, self.hidden_size, device=device), torch.zeros(2, 1, self.hidden_size, device=device))

# ver 0.1 : seq to seq 모델
class Seq2Seq(nn.Module):  
    def __init__(self, encoder, decoder):
        super(Seq2Seq, self).__init__()
        self.encoder = encoder
        self.decoder = decoder
    
        

# ver 0.2 : seq to seq with attention 모델
class Seq2SeqWithAttention:
    pass

# ver 0.3 : Transformer 모델
class Transformer:
    pass

# ver 0.4 : LLM 모델을 불러와서 Fine-tuning한 모델
class FinetuningModel:
    pass

class HyperParameter:
    def __init__(self, model):
        self.learing_rate = 0.001
        self.encoder_optim = torch.optim.Adam(model.encoder.parameters(), lr=self.learing_rate)
        self.decoder_optim = torch.optim.Adam(model.decoder.parameters(), lr=self.learing_rate)
        self.criterion = nn.CrossEntropyLoss()

def extractModel(ver: str, input_size, hidden_size, output_size):
    
    if(ver == "0.1"):
        encoder = EncoderLSTM(input_size, hidden_size).to(device)
        decoder = DecoderLSTM(hidden_size, output_size).to(device)
        model = Seq2Seq(encoder, decoder).to(device)
    elif(ver == "0.2"):
        model = Seq2SeqWithAttention()
    elif(ver == "0.3"):
        model = Transformer()
    elif(ver == "0.4"):
        model = FinetuningModel()
    else:
        model = None
        print("잘못된 버전을 입력했습니다.")
    
    return model

def train(model, input_tensor, target_tensor, hyper_parameters):
    encoder_hidden = model.encoder.initHidden()
    
    hyper_parameters.encoder_optim.zero_grad()
    hyper_parameters.decoder_optim.zero_grad()
    
    input_length = input_tensor.size(0)
    target_length = target_tensor.size(0)
    
    loss = 0
    
    for ei in range(input_length):
        encoder_output, encoder_hidden = model.encoder(input_tensor[ei], encoder_hidden)
    
    SOS_TOKEN = 1    
    EOS_TOKEN = 2    
    
    decoder_input = torch.tensor([[SOS_TOKEN]], device=device)
    decoder_hidden = encoder_hidden
    decoded_words = []
    
    
    teaching_ratio = 0.5
    for di in range(target_length):
        decoder_output, decoder_hidden = model.decoder(decoder_input, decoder_hidden)
        if random.random() < teaching_ratio:
            topv, topi = decoder_output.topk(1)
        else:
            topi = decoder_input = target_tensor[di]
        
        decoder_input = topi.squeeze().detach()
        loss += hyper_parameters.criterion(decoder_output, target_tensor[di])
        
        if decoder_input.item() == EOS_TOKEN:
            break
        
    loss.backward() # 역전파 
    
    hyper_parameters.encoder_optim.step()
    hyper_parameters.decoder_optim.step()
    
    return loss.item() / target_length

def evaluate():
    pass

def predict(model, sentence):
    
    with torch.no_grad():
        indexing_list = [word_dictionary.word_to_idx.get(word, word_dictionary.word_to_idx['<UNK>']) for word in text_preprocesser.extract_morphs(sentence)]
        indexing_list.append(2)
        input_tensor = dataset.convert_to_tensor(indexing_list)
        print(input_tensor)
        
        encoder_hidden = model.encoder.initHidden()
        encoder_hidden = tuple([e.to(device) for e in encoder_hidden])
        
        for ei in range(input_tensor.size(0)):
            encoder_output, encoder_hidden = model.encoder(input_tensor[ei], encoder_hidden)
            
        decoder_input = torch.tensor([[1]], device=device)
        decoder_hidden = encoder_hidden
        decoded_words = [] # output sentence
        
        for di in range(300):
            decoder_output, decoder_hidden = model.decoder(decoder_input, decoder_hidden)
            topv, topi = decoder_output.data.topk(1)

            if topi.item() == 2:
                decoded_words.append('<EOS>')
                break
            else:
                decoded_words.append(word_dictionary.idx_to_word[topi.item()]) # 최종 아웃풋의 index
            
            decoder_input = topi.squeeze().detach()
        print(decoded_words)
        return ' '.join(decoded_words)
        

def save_model():
    pass

def load_model():
    pass

if __name__ == '__main__':
    start = time.time()
    
    text_preprocesser = TextPreprocessing()
    df = text_preprocesser.read_data(FILE_PATH)
    word_dictionary = WordDictionary(df)
    word_dictionary.load_dict()
    dict_list = word_dictionary.get_dict_list()
    dataset = ChatbotDataset(dict_list)
    
    import pickle
    with open('trainset.pkl', 'rb') as f:
        trainset = pickle.load(f)
    with open('validset.pkl', 'rb') as f:
        validset = pickle.load(f)
    with open('testset.pkl', 'rb') as f:
        testset = pickle.load(f)
    

    model = extractModel("0.1", len(dict_list[0]), 512, len(dict_list[1]))
    hyper_parameters = HyperParameter(model)
    
    epochs = 5
    for epoch in range(epochs):
        loss_total = 0
        for i in range(len(trainset)):
            loss_total += train(model, trainset.iloc[i]['question'], trainset.iloc[i]['answer'], hyper_parameters)
            if(i % 1000 == 0):
                if(i == 0):
                    continue
                print_lost_avg = loss_total / 1000
                print(f'Iteration : {i}, Loss : {print_lost_avg: .4f}')
                loss_total = 0
        STATEDICT_PATH = 'seq2seq-chatbot-kor.pt'
        model.state_dict(torch.load(f=STATEDICT_PATH))
        torch.save(model.state_dict(), f'{STATEDICT_PATH}')    
    
    end = time.time()
    print(f"process time: {end - start}s")
    
    model.eval()
    predict(model, "알츠하이머 발병의 원인에 대해 알려주세요.")
    
    
    