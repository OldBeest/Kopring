# 데이터를 전처리 해서 단어사전을 생성하고, 학습용 데이터셋까지 제작하는 모듈

import pandas as pd
import numpy as np
from mecab import MeCab
import re
import pickle
import torch
import time

FILE_PATH = './dementia_fix.csv'
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
class TextPreprocessing:
    
    def __init__(self):
        self.korean_pattern = r'[^ ?,.!A-Za-z0-9가-힣+]'
        self.normalizer = re.compile(self.korean_pattern)
        self.mecab = MeCab()

    # 한국어로 정규화 : 한글, 영어, 숫자, 공백, ?!.,을 제외한 나머지 문자 제거
    def clean_text(self, sentence):        
        
        return self.normalizer.sub("", sentence)
    
    # 형태소 추출
    def extract_morphs(self, sentence):
        sentence = self.clean_text(sentence)
        sentence = sentence.lower()
        
        return self.mecab.morphs(sentence)

    # 데이터 불러오기
    def read_data(self, filePath):
        return pd.read_csv(filePath, sep=',', encoding='utf-8', index_col=0)
class WordDictionary:
    
    def __init__(self, df):
        self.word_to_idx = {
            '<PAD>': 0,
            '<SOS>': 1,
            '<EOS>': 2,
            '<UNK>': 3,
        }
        self.idx_to_word = {}
        self.text_preprocesser = TextPreprocessing()
        self.dict_list = []
        self.df = df
    
    # 단어사전 만들기
    def add_word(self, dataframe):
        # 데이터 프레임에서 각 컬럼별로 작업
        q_data = dataframe['question']
        a_data = dataframe['answer']
        
        word_list = []
        
        for question in q_data:
            word_morphs = self.text_preprocesser.extract_morphs(question)
            for word in word_morphs:
                word_list.append(word)
        
        for question in a_data:
            word_morphs = self.text_preprocesser.extract_morphs(question)
            for word in word_morphs:
                word_list.append(word)
                
        word_list1 = sorted(set(word_list), key=word_list.index)
        self.word_to_idx.update({word : idx + 4 for idx, word in enumerate(word_list1)})        
        self.idx_to_word.update({idx : word for word, idx in self.word_to_idx.items()})
    
    # 단어사전 저장
    def save_dict(self, word_to_idx_dict, idx_to_word_dict):
        with open('word_to_idx.pkl', 'wb') as f:
            pickle.dump(word_to_idx_dict, f)
        with open('idx_to_word.pkl', 'wb') as f:
            pickle.dump(idx_to_word_dict, f)            
    
    # 단어사전 불러오기
    def load_dict(self):
        try:
            with open('word_to_idx.pkl', 'rb') as f:
                self.word_to_idx = pickle.load(f)
            with open('idx_to_word.pkl', 'rb') as f:
                self.idx_to_word = pickle.load(f)
            print("단어사전을 찾았습니다.")
            self.dict_list = [self.word_to_idx, self.idx_to_word]
        except:
            print("단어사전을 찾지 못했습니다. 단어 사전을 제작합니다.")
            self.add_word(self.df)
            self.save_dict(self.word_to_idx, self.idx_to_word)
            self.dict_list = [self.word_to_idx, self.idx_to_word]
    
    # 학습 시 변환을 위해 단어사전 가져오기
    def get_dict_list(self):
        return self.dict_list

class ChatbotDataset:
    def __init__(self, dict_list):
        self.QUESTION_LENGTH = 30 # 질문 길이
        self.ANSWER_LENGTH = 300 # 답변 길이
        self.PAD_TOKEN = 0
        self.SOS_TOKEN = 1
        self.EOS_TOKEN = 2
        self.UNK_TOKEN = 3
        self.text_processer = TextPreprocessing() # 형태소 분석 모듈
        self.word_to_idx = dict_list[0]
        self.idx_to_word = dict_list[1]
    
    # 인코더에서 문장을 숫자 배열로 변환
    def sentence_to_index(self, sentence, category):
        # 질문 및 답변에 따라 토큰 크기를 다르게 설정
        if (category == 'question'):
            length = self.QUESTION_LENGTH
        elif(category == 'answer'):
            length = self.ANSWER_LENGTH
        
        # 형태소 분석한 단어를 index로 변환 후 빈 곳은 패딩            
        indexing_list = [self.word_to_idx.get(word, self.word_to_idx['<UNK>']) for word in self.text_processer.extract_morphs(sentence)]
        indexing_list.append(self.EOS_TOKEN)
        for _ in range(length - 1 - len(self.text_processer.extract_morphs(sentence))):
            indexing_list.append(self.PAD_TOKEN) 
              
        return indexing_list
    
    # 디코더에서 문장으로 복원    
    def index_to_sentence(self, index_list):
        sentence_list = [self.idx_to_word.get(index, self.idx_to_word[self.UNK_TOKEN]) for index in index_list]
        
        return sentence_list
    
    # 학습용 텐서로 변환
    def convert_to_tensor(self, indice):        
        return torch.tensor(indice, dtype=torch.long, device=DEVICE).view(-1, 1)
    
    # 훈련용 데이터셋으로 조작 8:1:1 로 분리
    def extract_dataset(self, dataframe):
        q_df = dataframe['question']
        a_df = dataframe['answer']
        q1 = q_df.apply(lambda sentence : self.convert_to_tensor(self.sentence_to_index(sentence, 'question')))
        a1 = a_df.apply(lambda sentence : self.convert_to_tensor(self.sentence_to_index(sentence, 'answer')))
        d_set = pd.concat([q1, a1], axis=1)
        trainset = d_set.sample(frac=0.8, random_state=42)
        validset = d_set.drop(trainset.index).sample(frac=0.5, random_state=42)
        testset = d_set.drop(trainset.index).drop(validset.index)
        
        return trainset, validset, testset
    