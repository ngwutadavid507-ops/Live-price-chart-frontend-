function  renderMarketLeaders()  {  
    
const
 
container
 
=
 
document.getElementById('marketLeaders');
 
    
if
 
(!container)
 
return;
 
    
let
 
html
 
=
 
`<div
 
class="card-title">Market
 
Capitalization
 
Leaders</div><table
 
class="data-table"><thead><tr><th>Asset</th><th>Price</th><th>24h
 
Vol</th></tr></thead><tbody>`;
 
    
globalStore.getState('assets').slice(0,3).forEach(a
 
=>
 
{
 
        
html
 
+=
 
`<tr><td><strong>${a.symbol.replace('USDT','')}</strong></td><td
 
class="font-mono">${formatters.price(a.price)}</td><td
 
class="font-mono">${a.volume}</td></tr>`;
 
    
});
 
    
html
 
+=
 
`</tbody></table>`;
 
    
container.innerHTML
 
=
 
html;
 
}
 
function
 
renderTopMovers()
 
{
 
    
const
 
container
 
=
 
document.getElementById('topMovers');
 
    
if
 
(!container)
 
return;
 
    
let
 
html
 
=
 
`<div
 
class="card-title">Top
 
24h
 
Volatility
 
Shifts</div><table
 
class="data-table"><thead><tr><th>Asset</th><th>Delta</th></tr></thead
><tbody>`;
 
    
[...globalStore.getState('assets')].sort((a,b)
 
=>
 
b.change24h
 
-
 
a.change24h).forEach(a
 
=>
 
{
 
        
html
 
+=
 
`<tr><td><strong>${a.symbol.replace('USDT','')}</strong></td><td
 
class="font-mono
 
${a.change24h
 
>=
 
0
 
?
 
'badge-success'
 
:
 
'badge-danger'}"
 
style="padding:4px;
 
border-radius:3px;">${formatters.pct(a.change24h)}</td></tr>`;
 
    
});
 
    
html
 
+=
 
`</tbody></table>`;
 
    
container.innerHTML
 
=
 
html;
 
}
 
function
 
renderAllMarkets()
 
{
 
    
const
 
container
 
=
 
document.getElementById('allMarkets');
 
    
if
 
(!container)
 
return;
 
    
let
 
html
 
=
 
`<div
 
class="card-title">All
 
Cryptographic
 
Trade
 
Pairs</div><table
 
class="data-table"><thead><tr><th>Symbol</th><th>Mark
 
Price</th><th>24h
 
Change</th><th>Session
 
High</th><th>Session
 
Low</th></tr></thead><tbody>`;
 
    
globalStore.getState('assets').forEach(a
 
=>
 
{
 
        
html
 
+=
 
`<tr><td><strong>${a.symbol}</strong></td><td
 
class="font-mono">${formatters.price(a.price)}</td><td
 
class="font-mono  ${a.change24h  >=  0  ?  'badge-success'  :  
'badge-danger'}"
 
style="padding:4px;
 
border-radius:3px;">${formatters.pct(a.change24h)}</td><td
 
class="font-mono">${formatters.price(a.high)}</td><td
 
class="font-mono">${formatters.price(a.low)}</td></tr>`;
 
    
});
 
    
html
 
+=
 
`</tbody></table>`;
 
    
container.innerHTML
 
=
 
html;
 
}
 
function
 
renderExchangeRankings()
 
{
 
    
const
 
container
 
=
 
document.getElementById('exchangeRankings');
 
    
if
 
(!container)
 
return;
 
    
container.innerHTML
 
=
 
`<div
 
class="card-title">Global
 
Liquidity
 
Pool
 
Index</div><table
 
class="data-table"><thead><tr><th>Rank</th><th>Exchange</th><th>24h
 
Volume
 
Adjusted</th><th>Score</th></tr></thead><tbody><tr><td>1</td><td>Binan
ce</td><td>$42.8B</td><td
 
style="color:var(--success)">9.8</td></tr><tr><td>2</td><td>Coinbase</
td><td>$11.2B</td><td
 
style="color:var(--success)">8.9</td></tr><tr><td>3</td><td>Bybit</td>
<td>$9.4B</td><td
 
style="color:var(--accent)">8.4</td></tr></tbody></table>`;
 
}
 
 
📄