registerPage('orderflow',  ()  =>  {  
    
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
 
id="orderBook"></div>
 
        
<div
 
class="card"
 
id="whaleAlerts"></div>
 
    
`;
 
    
return
 
view;
 
});
 
 
📄