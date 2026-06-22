registerPage('signals',  ()  =>  {  
    
const
 
view
 
=
 
document.createElement('div');
 
    
view.className
 
=
 
'grid-1';
 
    
view.innerHTML
 
=
 
`
 
        
<div
 
class="card"
 
id="signalFeed"></div>
 
        
<div
 
class="card"
 
id="backtestResults"></div>
 
    
`;
 
    return  view;  
});
 
 
📄