window.activePageCharts  =  [];  
 
function
 
initPageCharts(pageId)
 
{
 
    
if
 
(pageId
 
===
 
'dashboard')
 
{
 
        
const
 
ctx
 
=
 
document.getElementById('marketOverviewChart');
 
        if  (!ctx)  return;  
        
const
 
chart
 
=
 
new
 
Chart(ctx,
 
{
 
            
type:
 
'line',
 
            
data:
 
{
 
                
labels:
 
['1H',
 
'2H',
 
'3H',
 
'4H',
 
'5H',
 
'6H'],
 
                
datasets:
 
[{
 
label:
 
'BTC
 
Trend
 
Line',
 
data:
 
[66200,
 
66400,
 
66100,
 
66900,
 
67200,
 
67432],
 
borderColor:
 
'#f59e0b',
 
tension:
 
0.4,
 
borderWidth:
 
2,
 
pointRadius:
 
0
 
}]
 
            
},
 
            
options:
 
{
 
responsive:
 
true,
 
maintainAspectRatio:
 
false,
 
plugins:
 
{
 
legend:
 
{
 
display:
 
false
 
}
 
},
 
scales:
 
{
 
x:
 
{
 
grid:
 
{
 
display:
 
false
 
}
 
},
 
y:
 
{
 
grid:
 
{
 
color:
 
'#1f2937'
 
}
 
}
 
}
 
}
 
        
});
 
        
window.activePageCharts.push(chart);
 
    
}
 
    
if
 
(pageId
 
===
 
'portfolio')
 
{
 
        
const
 
ctx
 
=
 
document.getElementById('allocationChart');
 
        
if
 
(!ctx)
 
return;
 
        
const
 
chart
 
=
 
new
 
Chart(ctx,
 
{
 
            
type:
 
'doughnut',
 
            
data:
 
{
 
                
labels:
 
['BTC',
 
'ETH',
 
'SOL'],
 
                
datasets:
 
[{
 
data:
 
[55,
 
30,
 
15],
 
backgroundColor:
 
['#f59e0b',
 
'#3b82f6',
 
'#10b981'],
 
borderStrokeColor:
 
'transparent'
 
}]
 
            
},
 
            
options:
 
{
 
responsive:
 
true,
 
maintainAspectRatio:
 
false
 
}
 
        
});
 
        
window.activePageCharts.push(chart);
 
    
}
 
}
 
 
🗺  SINGLE  PAGE  APPLICATION  ROUTES  (js/pages/)  
📄