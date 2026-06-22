registerPage('beginner',  ()  =>  {  
    
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
 
class="card"><div
 
class="card-title">Academy
 
Flight
 
Academy</div><div
 
id="beginnerLessons"
 
class="grid-1"></div></div>
 
        
<div
 
class="card"><div
 
class="card-title">Risk
 
Size
 
Optimizer
 
Matrix</div><div
 
id="riskCalculator"></div></div>
 
        
<div
 
class="card"><div
 
class="card-title">Simulated
 
Sandbox
 
Portfolio
 
Balance</div><div
 
id="paperPortfolio"></div></div>
 
        
<div
 
class="card"><div
 
class="card-title">Simplified
 
Educational
 
Signals</div><div
 
id="simpleSignals"></div></div>
 
        
<div
 
class="card"
 
style="grid-column:
 
span
 
2;"><div
 
class="card-title">Glossary
 
Data
 
Banks</div><div
 
id="tradingGlossary"
 
class="grid-2"></div></div>
 
    
`;
 
    
return
 
view;
 
});
 
 
📄