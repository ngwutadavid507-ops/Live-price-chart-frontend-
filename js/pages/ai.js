registerPage('ai',  ()  =>  {  
    
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
 
id="aiPredictions"></div>
 
        
<div
 
class="card"
 
id="modelPerformance"></div>
 
    
`;
 
    
return
 
view;
 
});
 
 
📄