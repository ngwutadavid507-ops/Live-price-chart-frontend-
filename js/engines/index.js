class  QuantitativeEngine  {  
    
constructor()
 
{
 
        const  workerCode  =  `  
            
self.onmessage
 
=
 
function(e)
 
{
 
                
const
 
{
 
symbol,
 
price,
 
history
 
}
 
=
 
e.data;
 
                
if
 
(!history
 
||
 
history.length
 
<
 
2)
 
return;
 
                
 
                
let
 
sum
 
=
 
0;
 
                
history.forEach(p
 
=>
 
sum
 
+=
 
p);
 
                
const
 
sma
 
=
 
sum
 
/
 
history.length;
 
 
                
let
 
gains
 
=
 
0,
 
losses
 
=
 
0;
 
                
for(let
 
i=1;
 
i<history.length;
 
i++)
 
{
 
                    
const
 
diff
 
=
 
history[i]
 
-
 
history[i-1];
 
                    
if(diff
 
>
 
0)
 
gains
 
+=
 
diff;
 
else
 
losses
 
-=
 
diff;
 
                
}
 
                
const
 
rsi
 
=
 
gains
 
===
 
0
 
?
 
0
 
:
 
losses
 
===
 
0
 
?
 
100
 
:
 
100
 
-
 
(100
 
/
 
(1
 
+
 
(gains
 
/
 
history.length)
 
/
 
(losses
 
/
 
history.length)));
 
 
                
self.postMessage({
 
symbol,
 
sma,
 
rsi,
 
timestamp:
 
Date.now()
 
});
 
            
};
 
        
`;
 
        
const
 
blob
 
=
 
new
 
Blob([workerCode],
 
{
 
type:
 
'application/javascript'
 
});
 
        
this.worker
 
=
 
new
 
Worker(URL.createObjectURL(blob));
 
        
this.historicalCache
 
=
 
new
 
Map();
 
 
        
this.worker.onmessage
 
=
 
(e)
 
=>
 
{
 
            
this.updateIndicators(e.data);
 
        
};
 
    
}
 
 
    
processTick(symbol,
 
currentPrice)
 
{
 
        
if
 
(!this.historicalCache.has(symbol))
 
{
 
            
this.historicalCache.set(symbol,
 
[currentPrice]);
 
        
}
 
        
const
 
stream
 
=
 
this.historicalCache.get(symbol);
 
        
stream.push(currentPrice);
 
        
if
 
(stream.length
 
>
 
24)
 
stream.shift();
 
 
        
this.worker.postMessage({
 
symbol,
 
price:
 
currentPrice,
 
history:
 
stream
 
});
 
    
}
 
 
    
updateIndicators(metrics)
 
{
 
        
const
 
labelNode
 
=
 
document.getElementById('lastUpdateLabel');
 
        
if
 
(labelNode)
 
labelNode.textContent
 
=
 
formatters.time(new
 
Date());
 
        
 
        const  currentPage  =  globalStore.getState('currentPage');  
        
if
 
(currentPage
 
===
 
'dashboard')
 
{
 
            
renderMarketLeaders();
 
            
renderTopMovers();
 
            
renderRecentSignals();
 
        
}
 
else
 
if
 
(currentPage
 
===
 
'markets')
 
{
 
            
renderAllMarkets();
 
        
}
 
        
renderTicker();
 
    
}
 
}
 
const
 
quantEngine
 
=
 
new
 
QuantitativeEngine();
 
 
📄