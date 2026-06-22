function  renderOrderSimulator()  {  
    
const
 
container
 
=
 
document.getElementById('orderSimulator');
 
    
if
 
(!container)
 
return;
 
    
container.innerHTML
 
=
 
`
 
        
<div
 
style="display:flex;
 
gap:4px;
 
margin-bottom:12px;"><button
 
class="order-type-btn
 
active">Market</button><button
 
class="order-type-btn">Limit</button></div>
 
        
<div
 
class="order-sim-row"><span>Contract
 
Size</span><input
 
type="text"
 
class="order-sim-input"
 
value="0.05"></div>
 
        
<button
 
class="btn
 
btn-primary
 
w-full"
 
onclick="executeSimulatedTrade()">Dispatch
 
Routing
 
Payload</button>
 
    
`;
 
}
 
function
 
executeSimulatedTrade()
 
{
 
    
showToast('Order
 
Router',
 
'Synthetic
 
trading
 
instruction
 
filled
 
successfully.',
 
'success');
 
}
 
function
 
renderQuickTrade()
 
{
 
    
const
 
container
 
=
 
document.getElementById('quickTrade');
 
    
if
 
(!container)
 
return;
 
    
container.innerHTML
 
=
 
`<div
 
style="display:grid;
 
grid-template-columns:1fr
 
1fr;
 
gap:8px;"><button
 
class="btn
 
btn-primary"
 
style="padding:16px;"
 
onclick="executeSimulatedTrade()">INSTANT
 
LONG</button><button
 
class="btn
 
btn-danger"
 
style="padding:16px;"
 
onclick="executeSimulatedTrade()">INSTANT
 
SHORT</button></div>`;
 
}
 
function
 
renderCustomIndicators()
 
{
 
    
const
 
container
 
=
 
document.getElementById('customIndicators');
 
    
if
 
(!container)
 
return;
 
    
let
 
html
 
=
 
`<div
 
style="display:flex;
 
flex-direction:column;
 
gap:4px;
 
margin-bottom:8px;">`;
 
    
globalStore.getState('customIndicators').forEach(ind
 
=>
 
{
 
        
html
 
+=
 
`<div
 
class="risk-calc-row"><span>${ind.name}</span><span  class="badge  
badge-info">P:
 
${ind.period}</span></div>`;
 
    
});
 
    
html
 
+=
 
`</div>`;
 
    
container.innerHTML
 
=
 
html;
 
}
 
function
 
renderAdvancedAlerts()
 
{
 
    
const
 
container
 
=
 
document.getElementById('advancedAlerts');
 
    
if
 
(!container)
 
return;
 
    
container.innerHTML
 
=
 
`<div
 
class="alert-rule"><div
 
class="alert-rule-status"></div><div><strong>BTC
 
Threshold
 
Breakout</strong><br><small>>
 
$70k
 
Trigger
 
Payload</small></div></div>`;
 
}
 
function
 
renderExportReports()
 
{
 
    
const
 
container
 
=
 
document.getElementById('exportReports');
 
    
if
 
(!container)
 
return;
 
    
container.innerHTML
 
=
 
`<div
 
class="export-card"><div
 
class="export-icon">
📊
</div><div
 
class="export-info"><strong>System
 
Audit
 
Performance
 
Ledger</strong></div><button
 
class="export-btn"
 
onclick="showToast('Export
 
Module','CSV
 
data
 
compilation
 
tracking
 
complete.','success')">CSV</button></div>`;
 
}
 
 
📄