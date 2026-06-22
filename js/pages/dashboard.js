registerPage('dashboard',  ()  =>  {  
    
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
 
class="card
 
grid-1"
 
style="grid-column:
 
span
 
2;">
 
            
<div
 
class="card-title">Market
 
Macro
 
View
 
Structure</div>
 
            
<div
 
class="chart-container"><canvas
 
id="marketOverviewChart"></canvas></div>
 
        
</div>
 
        
<div
 
class="card"
 
id="marketLeaders"></div>
 
        
<div
 
class="card"
 
id="topMovers"></div>
 
        
<div
 
class="card"
 
id="recentSignals"
 
style="grid-column:
 
span
 
2;"></div>
 
    
`;
 
    
return
 
view;
 
});
 
 
📄