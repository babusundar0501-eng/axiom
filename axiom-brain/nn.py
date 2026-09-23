"""Tiny neural-network primitives for learning AXIOM Brain training."""
import math,random
def relu(x): return max(0.0,x)
def relu_grad(x): return 1.0 if x>0 else 0.0
class Dense:
    def __init__(self,inputs,outputs,seed=1):
        r=random.Random(seed); scale=math.sqrt(2/inputs)
        self.w=[[r.uniform(-scale,scale) for _ in range(inputs)] for _ in range(outputs)]
        self.b=[0.0]*outputs
    def forward(self,x):
        self.last_x=x
        self.last_z=[sum(a*b for a,b in zip(row,x))+bias for row,bias in zip(self.w,self.b)]
        return [relu(z) for z in self.last_z]
if __name__=="__main__":
    print(Dense(3,4).forward([1.0,0.5,-0.2]))
