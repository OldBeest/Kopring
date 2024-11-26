
# FASTAPI를 이용해 API 통신을 통해 질문을 입력받으면 모델에서 답변을 해 응답하는 구조


import model # 훈련모델 관련
import preprocessing # 전처리 관련
import util # 분석 및 튜닝 그리고 시각화 관련

from typing import Union
from fastapi import FastAPI
from fastapi import Body, Path, Query
from pydantic import BaseModel
import torch

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:8080"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None

@app.get("/")
def read_root():

    return {"hello" : "World!"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id" : item_id, "q" : q}

@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name" : item.name, "item_id": item_id}

@app.get("/ask")
async def answer(question: str, ver: str):
    if (ver == "0.1"):
        bot = model.load_model(model.dict_list, ver)
        answer = model.predict(bot, question).split('<EOS>')[0]
    if (ver == "0.2"):
        bot = model.load_model(model.dict_list, ver)
        answer = model.predict(bot, question).split('<EOS>')[0]
    if (ver == "0.3"):
        bot = model.load_model(model.dict_list, ver)
        answer = model.predict(bot, question).split('<EOS>')[0]
    if (ver == "0.4"):
        bot = model.load_model(model.dict_list, ver)
        answer = model.predict(bot, question)
    return {"answer" : answer}

FILE_PATH = preprocessing.FILE_PATH
if __name__ == "__main__":
    pass
    
