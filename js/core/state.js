class  TerminalStore  {  
    
constructor()
 
{
 
        
this.listeners
 
=
 
new
 
Map();
 
        
 
        const  savedJournal  =  localStorage.getItem('phoenix_journal');  
        
const
 
savedPortfolio
 
=
 
localStorage.getItem('phoenix_portfolio');
 
        
const
 
savedIndicators
 
=
 
localStorage.getItem('phoenix_indicators');
 
 
        
this.state
 
=
 
{
 
            
currentPage:
 
'dashboard',
 
            
wsConnected:
 
false,
 
            
latency:
 
0,
 
            
assets:
 
[
 
                
{
 
symbol:
 
'BTCUSDT',
 
name:
 
'Bitcoin',
 
price:
 
67432.50,
 
change24h:
 
2.34,
 
volume:
 
'32.1B',
 
high:
 
68100,
 
low:
 
65400,
 
sparkline:
 
[66000,
 
66400,
 
65900,
 
67100,
 
67432.50]
 
},
 
                
{
 
symbol:
 
'ETHUSDT',
 
name:
 
'Ethereum',
 
price:
 
3542.10,
 
change24h:
 
-1.12,
 
volume:
 
'18.4B',
 
high:
 
36200,
 
low:
 
34900,
 
sparkline:
 
[3580,
 
3560,
 
3510,
 
3530,
 
3542.10]
 
},
 
                
{
 
symbol:
 
'SOLUSDT',
 
name:
 
'Solana',
 
price:
 
142.75,
 
change24h:
 
5.67,
 
volume:
 
'4.8B',
 
high:
 
145,
 
low:
 
132,
 
sparkline:
 
[134,
 
136,
 
139,
 
141,
 
142.75]
 
},
 
                
{
 
symbol:
 
'LINKUSDT',
 
name:
 
'Chainlink',
 
price:
 
15.35,
 
change24h:
 
0.45,
 
volume:
 
'1.2B',
 
high:
 
15.8,
 
low:
 
15.1,
 
sparkline:
 
[15.2,
 
15.4,
 
15.1,
 
15.3,
 
15.35]
 
}
 
            
],
 
            
watchlist:
 
['BTCUSDT',
 
'ETHUSDT',
 
'SOLUSDT'],
 
            
journal:
 
savedJournal
 
?
 
JSON.parse(savedJournal)
 
:
 
[
 
                
{
 
id:
 
1,
 
date:
 
'Jun
 
21',
 
pair:
 
'BTC/USDT',
 
side:
 
'Long',
 
entry:
 
'$65,800',
 
exit:
 
'—',
 
pnl:
 
816,
 
status:
 
'success',
 
tags:
 
['Trend',
 
'MA'],
 
note:
 
'Support
 
bounce,
 
volume
 
confirmed'
 
},
 
                
{
 
id:
 
2,
 
date:
 
'Jun
 
19',
 
pair:
 
'SOL/USDT',
 
side:
 
'Long',
 
entry:
 
'$135',
 
exit:
 
'—',
 
pnl:
 
660,
 
status:
 
'success',
 
tags:
 
['Volume',
 
'Momentum'],
 
note:
 
'3x
 
volume
 
spike
 
on
 
breakout'
 
}
 
            
],
 
            
paperPortfolio:
 
savedPortfolio
 
?
 
JSON.parse(savedPortfolio)
 
:
 
{
 
                
balance:
 
12847.32,
 
                
pnl24h:
 
284.32,
 
                
pct24h:
 
2.26,
 
                
positions:
 
[
 
                    
{
 
symbol:
 
'BTC',
 
amount:
 
0.061,
 
pnl:
 
156
 
},
 
                    
{
 
symbol:
 
'ETH',
 
amount:
 
4.0,
 
pnl:
 
84
 
},
 
                    
{
 
symbol:
 
'SOL',
 
amount:
 
50,
 
pnl:
 
44
 
}
 
                
]
 
            
},
 
            
customIndicators:
 
savedIndicators
 
?
 
JSON.parse(savedIndicators)
 
:
 
[
 
                
{
 
name:
 
'Custom
 
EMA
 
(21)',
 
base:
 
'Moving
 
Average',
 
period:
 
21
 
},
 
                {  name:  'Volume-Weighted  RSI',  base:  'RSI',  period:  14  
}
 
            
],
 
            
chatHistory:
 
[
 
                
{
 
text:
 
"Hello!
 
I'm
 
your
 
Phoenix
 
AI
 
crypto
 
assistant.
 
What
 
would
 
you
 
like
 
to
 
explore
 
today?",
 
sender:
 
'ai'
 
}
 
            
],
 
            
orderBook:
 
{
 
bids:
 
[],
 
asks:
 
[]
 
}
 
        
};
 
    
}
 
 
    
subscribe(key,
 
callback)
 
{
 
        
if
 
(!this.listeners.has(key))
 
this.listeners.set(key,
 
[]);
 
        
this.listeners.get(key).push(callback);
 
    
}
 
 
    
setState(key,
 
newValue)
 
{
 
        
this.state[key]
 
=
 
newValue;
 
        
if
 
(this.listeners.has(key))
 
{
 
            
this.listeners.get(key).forEach(cb
 
=>
 
cb(newValue));
 
        
}
 
    
}
 
 
    
getState(key)
 
{
 
return
 
this.state[key];
 
}
 
 
    
saveToStorage(key,
 
storageKey)
 
{
 
        
localStorage.setItem(storageKey,
 
JSON.stringify(this.state[key]));
 
    
}
 
}
 
const
 
globalStore
 
=
 
new
 
TerminalStore();
 
 
📄