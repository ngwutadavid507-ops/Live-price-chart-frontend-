registerPage('journal',  ()  =>  {  
    
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
 
class="card"><div
 
class="card-title">Historical
 
Performance
 
Ledger</div><div
 
id="journalDetail"
 
class="w-full"></div></div>
 
        
<div
 
class="grid-2">
 
            
<div
 
class="card"><div
 
class="card-title">Tag
 
Performance
 
Analytics</div><div
 
id="tagAnalytics"></div></div>
 
            
<div
 
class="card"><div
 
class="card-title">Reflective
 
Trading
 
Notes</div><div
 
id="tradeNotes"></div></div>
 
        
</div>
 
    
`;
 
    
return
 
view;
 
});
 
 
📄