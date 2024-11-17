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
text_preprocesser = TextPreprocessing()
df = text_preprocesser.read_data(FILE_PATH)
word_dictionary = WordDictionary(df)
word_dictionary.load_dict()
dict_list = word_dictionary.get_dict_list()
dataset = ChatbotDataset(dict_list)

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
    def __init__(self, hidden_size, output_size):
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
class AttentionDecoderLSTM(nn.Module):
    def __init__(self, hidden_size, output_size):
        super(AttentionDecoderLSTM, self).__init__()
        self.hidden_size = hidden_size
        self.embedding = nn.Embedding(output_size, self.hidden_size)
        self.drop_out = nn.Dropout(0.2)
        self.lstm = nn.LSTM(hidden_size, hidden_size, num_layers=2) # hidden state, cell state
        self.out = nn.Linear(hidden_size, output_size)
        
    def forward(self, input, hidden, encoder_outputs):
        
        embedded = self.embedding(input).view(1, 1, -1)
        embedded = self.drop_out(embedded)
        attention_weights = F.softmax(torch.bmm(encoder_outputs.unsqueeze(0), hidden[0][0].unsqueeze(2)).squeeze(2), dim=1) # batch matrix multiplication, dot product
        attention_applied = torch.bmm(attention_weights.unsqueeze(0), encoder_outputs.unsqueeze(0))
                
        new_hidden = (torch.vstack([attention_applied, attention_applied]), hidden[1])
        output, hidden = self.lstm(embedded[0].unsqueeze(0), new_hidden)
        output = self.out(output[0])
        return output, hidden, attention_weights
    
    def initHidden(self):
        return(torch.zeros(2, 1, self.hidden_size, device=device), torch.zeros(2, 1, self.hidden_size, device=device))
    
# ver 0.1 : seq to seq 모델 teacher forcing 적용(랜덤 50%)
class Seq2Seq(nn.Module):  
    def __init__(self, encoder, decoder):
        super(Seq2Seq, self).__init__()
        self.encoder = encoder
        self.decoder = decoder

# ver 0.2 : seq to seq with attention 모델 teacher forcing 적용(0.5)
class Seq2SeqWithAttention(nn.Module):
    def __init__(self, encoder, decoder):
        super(Seq2SeqWithAttention, self).__init__()
        self.encoder = encoder
        self.decoder = decoder

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
        self.encoder_scheduler = torch.optim.lr_scheduler.LambdaLR(self.encoder_optim, lr_lambda)
        self.decoder_scheduler = torch.optim.lr_scheduler.LambdaLR(self.decoder_optim, lr_lambda)
        self.criterion = nn.CrossEntropyLoss()

def extractModel(ver: str, input_size, hidden_size, output_size):
    
    if(ver == "0.1"):
        encoder = EncoderLSTM(input_size, hidden_size).to(device)
        decoder = DecoderLSTM(hidden_size, output_size).to(device)
        model = Seq2Seq(encoder, decoder).to(device)        
    elif(ver == "0.2"):
        encoder = EncoderLSTM(input_size, hidden_size).to(device)
        decoder = AttentionDecoderLSTM(hidden_size, output_size).to(device)
        model = Seq2SeqWithAttention(encoder, decoder)
    elif(ver == "0.3"):
        model = Transformer()
    elif(ver == "0.4"):
        model = FinetuningModel()
    else:
        model = None
        print("잘못된 버전을 입력했습니다.")
        print(model)
    
    return model

def lr_lambda(epoch=0):
    if epoch < 6:
        return 1.0
    elif epoch < 11:
        return 0.1
    else:
        return 1.0

def train(model, input_tensor, target_tensor, hyper_parameters, epoch):
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
    
    if(isinstance(model, Seq2Seq)):
        with torch.no_grad():
            indexing_list = [word_dictionary.word_to_idx.get(word, word_dictionary.word_to_idx['<UNK>']) for word in text_preprocesser.extract_morphs(sentence)]
            indexing_list.append(2) # SOS TOKEN
            input_tensor = dataset.convert_to_tensor(indexing_list)
            
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
            return ' '.join(decoded_words)
        
    elif(isinstance(model, Seq2SeqWithAttention)):
        with torch.no_grad():
            SOS_TOKEN = 1 
            EOS_TOKEN = 2
            max_length = 300
             
            indexing_list = [word_dictionary.word_to_idx.get(word, word_dictionary.word_to_idx['<UNK>']) for word in text_preprocesser.extract_morphs(sentence)]
            indexing_list.append(2) # SOS TOKEN
            input_tensor = dataset.convert_to_tensor(indexing_list)
            # input_tensor = tensorFromSentence(word_dictionary.word_to_idx, sentence).to(device)
            input_length = input_tensor.size(0)
            encoder_hidden = model.encoder.initHidden()
            encoder_outputs = torch.zeros(max_length, model.encoder.hidden_size, device=device)
            
            for ei in range(input_length):
                encoder_output, encoder_hidden = model.encoder(input_tensor[ei], encoder_hidden)
                encoder_outputs[ei] += encoder_output[0, 0]
                
            decoder_input = torch.tensor([[SOS_TOKEN]], device=device)
            decoder_hidden = encoder_hidden
            decoded_words = [] # output sentence
            
            decoder_attentions = torch.zeros(max_length, max_length)
            
            for di in range(max_length):
                decoder_output, decoder_hidden, decoder_attention = model.decoder(decoder_input, decoder_hidden, encoder_outputs)
                decoder_attentions[di] = decoder_attention.data
                topv, topi = decoder_output.data.topk(1)
                if topi.item() == EOS_TOKEN:
                    decoded_words.append('<EOS>')
                    break
                else:
                    decoded_words.append(word_dictionary.idx_to_word[topi.item()]) # 최종 아웃풋의 index
                
                decoder_input = topi.squeeze().detach()
            
            meaningful_words = [word for word in decoded_words if word not in ('<EOS>', '<UNK>')]
            final_output = ' '.join(meaningful_words)
            return final_output
        

def save_model():
    pass

def load_model(dict_list, ver):
    if(ver == "0.1"):
        model = extractModel("0.1", len(dict_list[0]), 512, len(dict_list[1]))
        model.load_state_dict(torch.load('./model/seq2seq-chatbot-ver1-kor.pt'))
    elif(ver == "0.2"):
        model = extractModel("0.2", len(dict_list[0]), 512, len(dict_list[1]))
        model.load_state_dict(torch.load('./model/attention-chatbot-epoch-3.pt'))
    return model
    
    
    
    