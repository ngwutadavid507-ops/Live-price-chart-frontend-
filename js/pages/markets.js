registerPage('markets',  ()  =>  {  
    
const
 
view
 
=
 
document.createElement('div');
 
    
view.className
 
=
 
'grid-1';
 
    view.innerHTML  =  `  
        
<div
 
class="card"
 
id="allMarkets"></div>
 
        
<div
 
class="card"
 
id="exchangeRankings"></div>
 
    
`;
 
    
return
 
view;
 
});
 
 
📄