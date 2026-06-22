const  IndicatorLibrary  =  {  
    
calculateEMA:
 
(prices,
 
period)
 
=>
 
{
 
        
if
 
(prices.length
 
<
 
period)
 
return
 
prices[prices.length
 
-
 
1]
 
||
 
0;
 
        
const
 
k
 
=
 
2
 
/
 
(period
 
+
 
1);
 
        
let
 
ema
 
=
 
prices[0];
 
        
for
 
(let
 
i
 
=
 
1;
 
i
 
<
 
prices.length;
 
i++)
 
{
 
            
ema
 
=
 
prices[i]
 
*
 
k
 
+
 
ema
 
*
 
(1
 
-
 
k);
 
        
}
 
        
return
 
ema;
 
    
},
 
    
calculateBollingerBands:
 
(prices,
 
period,
 
multiplier
 
=
 
2)
 
=>
 
{
 
        
if
 
(prices.length
 
<
 
period)
 
return
 
{
 
middle:
 
0,
 
upper:
 
0,
 
lower:
 
0
 
};
 
        
const
 
slice
 
=
 
prices.slice(-period);
 
        
const
 
middle
 
=
 
slice.reduce((a,
 
b)
 
=>
 
a
 
+
 
b,
 
0)
 
/
 
period;
 
        
const
 
variance
 
=
 
slice.reduce((a,
 
b)
 
=>
 
a
 
+
 
Math.pow(b
 
-
 
middle,
 
2),
 
0)
 
/
 
period;
 
        
const
 
stdDev
 
=
 
Math.sqrt(variance);
 
        
return
 
{
 
middle,
 
upper:
 
middle
 
+
 
multiplier
 
*
 
stdDev,
 
lower:
 
middle
 
-
 
multiplier
 
*
 
stdDev
 
};
 
    
}
 
};
 
 
📄