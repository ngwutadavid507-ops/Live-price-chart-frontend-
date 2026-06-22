registerPage('analysis',  ()  =>  {  
    
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
 
class="card-title">Indicator
 
Signal
 
Matrix</div><div
 
id="indicatorPanel"></div></div>
 
        
<div
 
class="card"><div
 
class="card-title">Support
 
&
 
Resistance
 
Zones</div><div
 
id="supportResistance"></div></div>
 
        
<div
 
class="card"
 
style="grid-column:
 
span
 
2;"><div
 
class="card-title">Automated
 
Chart
 
Pattern
 
Diagnostics</div><div
 
id="patternDetection"></div></div>
 
    
`;
 
    
return
 
view;
 
});
 
 
📄