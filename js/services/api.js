const  apiService  =  {  
    
async
 
fetchHistoricalData(symbol)
 
{
 
        
try
 
{
 
            
const
 
res
 
=
 
await
 
fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval
=1h&limit=24`);  
            
if
 
(!res.ok)
 
throw
 
new
 
Error();
 
            
const
 
data
 
=
 
await
 
res.json();
 
            
return
 
data.map(k
 
=>
 
parseFloat(k[4]));
 
        
}
 
catch
 
(e)
 
{
 
            
return
 
[65000,
 
65400,
 
65200,
 
66100,
 
65900,
 
66400,
 
67432.50];
 
        
}
 
    
}
 
};
 
 
📄