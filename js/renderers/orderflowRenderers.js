function  renderOrderBook()  {  
    
const
 
container
 
=
 
document.getElementById('orderBook');
 
    
if
 
(!container)
 
return;
 
    
const
 
assets
 
=
 
globalStore.getState('assets');
 
    
const
 
btcPrice
 
=
 
assets[0]?.price
 
||
 
67000;
 
    
let
 
html
 
=
 
`<div
 
class="card-title">Real-Time
 
Depth
 
Matrix
 
(BTC/USDT)</div><div
 
style="display:grid;
 
grid-template-columns:1fr
 
1fr;
 
gap:10px;"><table
 
class="data-table"><thead><tr><th
 
style="color:var(--danger)">Ask
 
Price</th><th>Size</th></tr></thead><tbody>`;
 
    
for(let
 
i=0;
 
i<5;
 
i++)
 
{
 
        
html
 
+=
 
`<tr><td
 
class="font-mono"
 
style="color:var(--danger);">${formatters.price(btcPrice
 
+
 
(i*5))}</td><td
 
class="font-mono">${(Math.random()
 
*
 
2).toFixed(3)}</td></tr>`;
 
    
}
 
    
html
 
+=
 
`</tbody></table><table
 
class="data-table"><thead><tr><th
 
style="color:var(--success)">Bid
 
Price</th><th>Size</th></tr></thead><tbody>`;
 
    
for(let
 
i=0;
 
i<5;
 
i++)
 
{
 
        html  +=  `<tr><td  class="font-mono"  
style="color:var(--success);">${formatters.price(btcPrice
 
-
 
(i*5))}</td><td
 
class="font-mono">${(Math.random()
 
*
 
2).toFixed(3)}</td></tr>`;
 
    
}
 
    
html
 
+=
 
`</tbody></table></div>`;
 
    
container.innerHTML
 
=
 
html;
 
}
 
function
 
renderWhaleAlerts()
 
{
 
    
const
 
container
 
=
 
document.getElementById('whaleAlerts');
 
    
if
 
(!container)
 
return;
 
    
let
 
html
 
=
 
`<div
 
class="card-title">On-Chain
 
Whale
 
Footprint
 
Log</div><div
 
style="display:flex;
 
flex-direction:column;
 
gap:8px;">`;
 
    
for(let
 
i=0;
 
i<4;
 
i++)
 
{
 
        
html
 
+=
 
`<div
 
class="whale-alert-row"><span>
🐳
 
Transferred
 
<strong>${(150
 
+
 
(i*40))}
 
BTC</strong>
 
to
 
Unknown
 
Wallet</span><span
 
class="font-mono"
 
style="color:var(--accent)">$${(10
 
+
 
i)}M</span></div>`;
 
    
}
 
    
html
 
+=
 
`</div>`;
 
    
container.innerHTML
 
=
 
html;
 
}
 
 
📄