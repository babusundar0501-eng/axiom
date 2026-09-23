"""Minimal dependency-free tokenizer foundation for AXIOM Brain."""
import re
from collections import Counter
TOKEN_PATTERN=re.compile(r"\w+|[^\w\s]",re.UNICODE)
class Tokenizer:
    def __init__(self):
        self.token_to_id={"<PAD>":0,"<UNK>":1};self.id_to_token={0:"<PAD>",1:"<UNK>"}
    def tokenize(self,text): return TOKEN_PATTERN.findall(text.lower())
    def build_vocab(self,texts,min_frequency=1):
        counts=Counter()
        for text in texts: counts.update(self.tokenize(text))
        for token,count in sorted(counts.items()):
            if count>=min_frequency and token not in self.token_to_id:
                i=len(self.token_to_id);self.token_to_id[token]=i;self.id_to_token[i]=token
    def encode(self,text): return [self.token_to_id.get(t,1) for t in self.tokenize(text)]
    def decode(self,ids): return " ".join(self.id_to_token.get(i,"<UNK>") for i in ids)
if __name__=="__main__":
    t=Tokenizer();t.build_vocab(["build an app","build a study app","AXIOM builds apps"])
    x="Build a study app!";print(t.tokenize(x));print(t.encode(x));print(t.decode(t.encode(x)))
