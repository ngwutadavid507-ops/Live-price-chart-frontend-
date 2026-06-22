const  formatters  =  {  
    
price:
 
(val)
 
=>
 
new
 
Intl.NumberFormat('en-US',
 
{
 
style:
 
'currency',
 
currency:
 
'USD',
 
minimumFractionDigits:
 
2
 
}).format(val),
 
    
pct:
 
(val)
 
=>
 
`${val
 
>=
 
0
 
?
 
'+'
 
:
 
''}${val.toFixed(2)}%`,
 
    
compact:
 
(val)
 
=>
 
new
 
Intl.NumberFormat('en-US',
 
{
 
notation:
 
'compact',
 
compactDisplay:
 
'short'
 
}).format(val),
 
    
time:
 
(dateObj)
 
=>
 
dateObj.toLocaleTimeString('en-US',
 
{
 
hour12:
 
false
 
})
 
};
 
 
📄