'''
치매박사 안깜빡이 ver 0.2 named by 🌱HP
Dementia Doctor Nonblinker

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
import math

from transformers import AutoTokenizer
from transformers import AutoModelForCausalLM
from transformers import pipeline

from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments,
    pipeline,
    logging,
)
from peft import LoraConfig, PeftModel, PeftConfig


FILE_PATH = preprocessing.FILE_PATH
device = preprocessing.DEVICE
text_preprocesser = TextPreprocessing()
df = text_preprocesser.read_data(FILE_PATH)
word_dictionary = WordDictionary(df)
word_dictionary.load_dict()
dict_list = word_dictionary.get_dict_list()
dataset = ChatbotDataset(dict_list)

t_dict_list = word_dictionary.load_dict_transformer()
VOCAB = t_dict_list[0]
RVOCAB = t_dict_list[1]
VOCAB_SIZE = len(dict_list[0])
TARGET_SEQ_LEN = 274

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

"""
    transformer 모델에 필요한 요소
    1. 포지션 임베딩
    2. 멀티헤드 어텐션
    3. 트랜스포머 블럭
"""
# 단어 및 위치 임베딩 레이어
class WordPositionEmbedding(nn.Module):
    def __init__(self, vocab_size, max_seq_len, emb_size, device):
        super(WordPositionEmbedding, self).__init__()
        self.device = device
        self.word_embedding = nn.Embedding(vocab_size, emb_size, device=device)

        position = torch.arange(max_seq_len).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, emb_size, 2).float() * 
                             (-math.log(10000.0) / emb_size))
        pos_emb = torch.zeros(max_seq_len, emb_size)
        pos_emb[:, 0::2] = torch.sin(position * div_term)
        pos_emb[:, 1::2] = torch.cos(position * div_term)
        self.register_buffer('position_embedding', pos_emb)

    def forward(self, x):
        word_embeddings = self.word_embedding(x)
        pos_embeddings = self.position_embedding[:x.size(1), :]

        # 단어 임베딩과 위치 임베딩을 결합합니다.
        embeddings = word_embeddings + pos_embeddings
        return embeddings

# 멀티-헤드 어텐션 메커니즘 클래스
class MultiHeadAttention(nn.Module):
    def __init__(self, emb_size, heads):
        super(MultiHeadAttention, self).__init__()
        self.emb_size = emb_size
        self.heads = heads
        self.head_dim = emb_size // heads

        assert self.head_dim * heads == emb_size, "임베딩 크기는 헤드 수로 나누어 떨어져야 합니다."

        self.values = nn.Linear(self.head_dim, self.head_dim, bias=False)
        self.keys = nn.Linear(self.head_dim, self.head_dim, bias=False)
        self.queries = nn.Linear(self.head_dim, self.head_dim, bias=False)
        self.fc_out = nn.Linear(heads * self.head_dim, emb_size)

    def forward(self, values, keys, queries, mask=None):
        batch_size = queries.shape[0]
        value_len, key_len, query_len = values.shape[1], keys.shape[1], queries.shape[1]

        # 임베딩을 self.heads 개의 조각으로 나눕니다.
        values = values.reshape(batch_size, self.heads, value_len, self.head_dim)
        keys = keys.reshape(batch_size, self.heads, key_len, self.head_dim)
        queries = queries.reshape(batch_size, self.heads, query_len, self.head_dim)

        # 선형 변환을 수행합니다.
        values = self.values(values)
        keys = self.keys(keys)
        queries = self.queries(queries)

        # 행렬 곱셈을 위해 전치합니다.
        keys_transposed = keys.transpose(2, 3)

        # 각 헤드에 대해 쿼리와 키의 내적을 계산합니다.
        energy = torch.matmul(queries, keys_transposed)

        if mask is not None:
            energy = energy.masked_fill(mask == 0, float("-1e20"))

        # 에너지를 키의 차원의 제곱근으로 스케일링하고 소프트맥스를 적용합니다.
        scale = self.head_dim ** 0.5
        attention = torch.softmax(energy / scale, dim=-1)

        # 어텐션 가중치를 값에 곱합니다.
        out = torch.matmul(attention, values)

        # 모든 헤드를 하나로 연결합니다.
        out = out.reshape(batch_size, query_len, self.heads * self.head_dim)

        # 최종 선형 레이어를 적용합니다.
        out = self.fc_out(out)
        return out

# 트랜스포머 블록, 멀티-헤드 어텐션과 피드포워드 네트워크로 구성됩니다.
class TransformerBlock(nn.Module):
    def __init__(self, emb_size, heads, forward_expansion, dropout_rate):
        super(TransformerBlock, self).__init__()
        self.attention = MultiHeadAttention(emb_size, heads)
        self.norm1 = nn.LayerNorm(emb_size)
        self.norm2 = nn.LayerNorm(emb_size)
        self.feed_forward = nn.Sequential(
            nn.Linear(emb_size, forward_expansion * emb_size),
            nn.ReLU(),
            nn.Linear(forward_expansion * emb_size, emb_size),
        )
        self.dropout = nn.Dropout(dropout_rate)

    def forward(self, value, key, query, mask):
        # 어텐션과 skip connection 연결
        attention = self.attention(value, key, query, mask)
        x = self.dropout(self.norm1(attention + query))

        # 피드포워드와 skip connection 연결
        forward = self.feed_forward(x)
        out = self.norm2(self.dropout(forward + x))
        return out
    
# 다중 트랜스포머 블록으로 구성된 인코더
class TransformerEncoder(nn.Module):
    def __init__(self, vocab_size, seq_len, emb_size, n_layers, heads, forward_expansion, 
                 drop_out, device):
        super(TransformerEncoder, self).__init__()
        self.emb_size = emb_size
        self.device = device
        self.embedding = WordPositionEmbedding(vocab_size, seq_len, emb_size, device)
        self.layers = nn.ModuleList([
            TransformerBlock(emb_size, heads, forward_expansion, drop_out) for _ in range(n_layers)
        ])
        self.dropout = nn.Dropout(drop_out)

    def forward(self, X, mask):
        out = self.dropout(self.embedding(X))

        # 각 트랜스포머 블록을 순차적으로 적용합니다.
        for layer in self.layers:
            out = layer(out, out, out, mask)

        return out

# 디코더 블록, 셀프 어텐션과 크로스 어텐션을 포함합니다.
class DecoderBlock(nn.Module):
    def __init__(self, emb_size, heads, forward_expansion, drop_out):
        super(DecoderBlock, self).__init__()
        self.attention = MultiHeadAttention(emb_size, heads)
        self.norm = nn.LayerNorm(emb_size)
        self.transformer_block = TransformerBlock(emb_size, heads, forward_expansion, drop_out)
        self.dropout = nn.Dropout(drop_out)

    def forward(self, X, value, key, src_mask, trg_mask):
        # 셀프 어텐션
        attention = self.attention(X, X, X, trg_mask)
        query = self.dropout(self.norm(attention + X))
        # 인코더 출력과의 크로스 어텐션
        out = self.transformer_block(value, key, query, src_mask)
        return out

# 다중 디코더 블록으로 구성된 디코더
class TransformerDecoder(nn.Module):
    def __init__(self, vocab_size, seq_len, emb_size, n_layers, heads, forward_expansion, 
                 drop_out, device):
        super(TransformerDecoder, self).__init__()
        self.device = device
        self.embedding = WordPositionEmbedding(vocab_size, seq_len, emb_size, device)
        self.layers = nn.ModuleList([
            DecoderBlock(emb_size, heads, forward_expansion, drop_out) for _ in range(n_layers)
        ])
        self.fc_out = nn.Linear(emb_size, vocab_size)
        self.dropout = nn.Dropout(drop_out)

    def forward(self, X, enc_out, src_mask, trg_mask):
        out = self.dropout(self.embedding(X))

        # 각 디코더 블록을 처리합니다.
        for layer in self.layers:
            out = layer(out, enc_out, enc_out, src_mask, trg_mask)

        # 어휘 사전으로 매핑하는 출력 레이어
        out = self.fc_out(out)
        return out
    
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
# 인코더와 디코더를 결합한 전체 트랜스포머 모델
class TransformerScratch(nn.Module):
    def __init__(self, inp_vocab_size, trg_vocab_size, src_pad_idx, trg_pad_idx, emb_size, 
                 n_layers=1, heads=1, forward_expansion=1, drop_out=0.2, max_seq_len=100, 
                 device=torch.device('cuda')):
        super(TransformerScratch, self).__init__()

        self.src_pad_idx = src_pad_idx
        self.trg_pad_idx = trg_pad_idx
        self.device = device

        self.encoder = TransformerEncoder(inp_vocab_size, max_seq_len, emb_size, n_layers, heads, 
                               forward_expansion, drop_out, device).to(device)
        self.decoder = TransformerDecoder(trg_vocab_size, max_seq_len, emb_size, n_layers, heads, 
                               forward_expansion, drop_out, device).to(device)

    def make_src_mask(self, src):
        src_mask = (src != self.src_pad_idx).unsqueeze(1).unsqueeze(2)
        return src_mask.to(self.device)

    def make_trg_mask(self, trg):
        batch_size, trg_seq_len = trg.shape
        trg_mask = torch.tril(torch.ones((trg_seq_len, trg_seq_len))).expand(
            batch_size, 1, trg_seq_len, trg_seq_len)
        return trg_mask.to(self.device)

    def forward(self, src, trg):
        src_mask = self.make_src_mask(src)
        trg_mask = self.make_trg_mask(trg)
        enc_out = self.encoder(src, src_mask)
        out = self.decoder(trg, enc_out, src_mask, trg_mask)
        return out

# ver 0.4 : LLM 모델을 불러와서 Fine-tuning한 모델
class FinetuningModel:
    def __init__(self):
        #torch_dtype = torch.float16
        self.peft_model_id = "C:/Users/Harvey/Downloads/model-save"
        self.config = PeftConfig.from_pretrained(self.peft_model_id)
        self.bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.bfloat16
        )
        self.model = AutoModelForCausalLM.from_pretrained(self.config.base_model_name_or_path, quantization_config=self.bnb_config, device_map={"":0})
        self.model = PeftModel.from_pretrained(self.model, self.peft_model_id)
        self.tokenizer = AutoTokenizer.from_pretrained(self.config.base_model_name_or_path)
        self.model.config.use_cache = False
        self.model.config.pretraining_tp = 1
        self.tokenizer.pad_token = self.tokenizer.eos_token
        self.tokenizer.padding_side = "right"        
        

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
        model = TransformerScratch(
        inp_vocab_size=VOCAB_SIZE,
        trg_vocab_size=VOCAB_SIZE,
        src_pad_idx=VOCAB['<PAD>'],
        trg_pad_idx=VOCAB['<PAD>'],
        emb_size=256,
        n_layers=2,
        heads=4,
        forward_expansion=4,
        drop_out=0.05,
        max_seq_len=TARGET_SEQ_LEN,
        device=device
        ).to(device)
    elif(ver == "0.4"):
        llama2 = FinetuningModel()
        return llama2
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
            indexing_list.append(2) # EOS TOKEN
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
        
    elif(isinstance(model, TransformerScratch)):
        max_length = 50
        temperature = 1.5
        generated_answer = []
        indexing_list = [VOCAB.get(word, VOCAB['<UNK>']) for word in text_preprocesser.extract_morphs(sentence)]
        indexing_list.append(2) # EOS TOKEN
        enc_src = indexing_list[:max_length]  # 시퀀스를 최대 길이로 자름
        padded_enc_src = F.pad(torch.LongTensor(enc_src), (0, max_length - len(enc_src)), mode='constant',
                            value=VOCAB['<PAD>']).unsqueeze(0).to(device)  # 패딩 및 디바이스로 이동
        # 디코더 입력을 <SOS> 토큰으로 시작하는 자리 표시자를 준비
        dec_src = torch.LongTensor([VOCAB['<SOS>']]).unsqueeze(0).to(device)
        with torch.no_grad():
            for _ in range(max_length):
                logits = model(padded_enc_src, dec_src)
                # 마지막 토큰만 고려하도록 조정
                predictions = F.softmax(logits[:, -1, :] / temperature, dim=1)  
                predicted_token = torch.multinomial(predictions, num_samples=1).squeeze(1)
#                 predicted_token = torch.argmax(predictions, dim=1)

                if predicted_token.item() == VOCAB['<EOS>']:
                    break  # EOS 토큰이 예측되면 토큰 생성을 중지
                # 디코더 입력을 업데이트
                dec_src = torch.cat([dec_src, predicted_token.unsqueeze(-1)], dim=1)  
                generated_answer.append(predicted_token.item())
                
            answer = [RVOCAB.get(idx, RVOCAB[3]) for idx in generated_answer]
            return ' '.join(answer)
    elif(isinstance(model, FinetuningModel)):        
        prompt = sentence
        # prompt = "알츠하이머병 진단 방법에 대해 알려주세요"
        pipe = pipeline(task="text-generation", model=model.model, tokenizer=model.tokenizer, max_length=200, truncation=True)
        result = pipe(f"<s>[INST] {prompt} [/INST]")
        return result[0]['generated_text'].split('[/INST]')[1]
            
def save_model():
    pass

def load_model(dict_list, ver):
    if(ver == "0.1"):
        model = extractModel("0.1", len(dict_list[0]), 512, len(dict_list[1]))
        model.load_state_dict(torch.load('./model/seq2seq-chatbot-ver1-kor.pt'))
    elif(ver == "0.2"):
        model = extractModel("0.2", len(dict_list[0]), 512, len(dict_list[1]))
        model.load_state_dict(torch.load('./model/attention-chatbot-epoch-3.pt'))
    elif(ver == "0.3"):
        model = extractModel("0.3", len(dict_list[0]), 512, len(dict_list[1])) # 가운데 숫자는 필요없음
        model.load_state_dict(torch.load('./model/transformer-chatbot-300.pt')) 
    elif(ver == "0.4"):
        model = extractModel("0.4", len(dict_list[0]), 512, len(dict_list[1])) # 가운데 숫자는 필요없음
    return model
    
    
    
    