function  renderOpenPositions()  {  
    
const
 
container
 
=
 
document.getElementById('openPositions');
 
    
if
 
(!container)
 
return;
 
    
let
 
html
 
=
 
`<div
 
class="card-title">Active
 
High-Leverage
 
Positions
 
Matrix</div><table
 
class="data-table"><thead><tr><th>Contract
 
Token
 
Pair</th><th>Size
 
Asset</th><th>PnL
 
Capitalization</th></tr></thead><tbody>`;
 
    
globalStore.getState('paperPortfolio').positions.forEach(p
 
=>
 
{
 
        
html
 
+=
 
`<tr><td><strong>${p.symbol}/USDT</strong></td><td
 
class="font-mono">${p.amount}</td><td
 
class="font-mono"
 
style="color:var(--success)">+$${p.pnl}</td></tr>`;
 
    
});
 
    
html
 
+=
 
`</tbody></table>`;
 
    
container.innerHTML
 
=
 
html;
 
}
 
function
 
renderWatchlist()
 
{
 
    
const
 
container
 
=
 
document.getElementById('watchlist');
 
    
if
 
(!container)
 
return;
 
    
let
 
html
 
=
 
`<div
 
class="card-title">Monitored
 
Watchlist
 
Tracks</div><table
 
class="data-table"><thead><tr><th>Token</th><th>Ticker
 
Price</th></tr></thead><tbody>`;  
    
globalStore.getState('assets').forEach(a
 
=>
 
{
 
        
if
 
(globalStore.getState('watchlist').includes(a.symbol))
 
{
 
            
html
 
+=
 
`<tr><td><strong>${a.symbol.replace('USDT','')}</strong></td><td
 
class="font-mono"
 
style="color:var(--accent);">${formatters.price(a.price)}</td></tr>`;
 
        
}
 
    
});
 
    
html
 
+=
 
`</tbody></table>`;
 
    
container.innerHTML
 
=
 
html;
 
}
 
 
📄