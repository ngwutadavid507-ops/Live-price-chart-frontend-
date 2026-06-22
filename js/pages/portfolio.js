registerPage('portfolio',  ()  =>  {  
    
const
 
view
 
=
 
document.createElement('div');
 
    
view.className
 
=
 
'grid-2';
 
    
view.innerHTML
 
=
 
`
 
        
<div
 
class="card"
 
style="grid-column:
 
span
 
2;"
 
id="openPositions"></div>
 
        
<div
 
class="card"
 
id="watchlist"></div>
 
        
<div
 
class="card"><div
 
class="card-title">Allocation
 
Optimization</div><div
 
class="chart-container"><canvas
 
id="allocationChart"></canvas></div></div>
 
        
<div
 
class="card"
 
style="grid-column:
 
span
 
2;"
 
id="riskDashboard"></div>
 
    
`;
 
    
return
 
view;
 
});
 
 
📄