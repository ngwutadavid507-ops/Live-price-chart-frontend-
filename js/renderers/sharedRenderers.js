function  renderTicker()  {  
    
const
 
container
 
=
 
document.getElementById('tickerFeed');
 
    
if
 
(!container)
 
return;
 
    
let
 
html
 
=
 
'';
 
    
globalStore.getState('parentTrackAssets').forEach(a
 
=>
 
{
 
        
html
 
+=
 
`<span
 
style="font-size:12px;
 
font-weight:700;
 
font-family:var(--font-mono)">${a.symbol.replace('USDT','')}:
 
${formatters.price(a.price)}
 
<span
 
style="color:var(--${a.change24h
 
>=
 
0
 
?
 
'success'
 
:
 
'danger'})">${formatters.pct(a.change24h)}</span></span>`;
 
    
});
 
    
container.innerHTML
 
=
 
html
 
+
 
html;
 
}
 
function
 
renderJournalDetail()
 
{
 
    
const
 
container
 
=
 
document.getElementById('journalDetail');
 
    
if
 
(!container)
 
return;
 
    
let
 
html
 
=
 
`<table
 
class="data-table"><thead><tr><th>Date</th><th>Pair</th><th>Side</th><
th>PnL</th></tr></thead><tbody>`;
 
    
globalStore.getState('journal').forEach(j
 
=>
 
{
 
        
html
 
+=
 
`<tr><td>${j.date}</td><td><strong>${j.pair}</strong></td><td><span  
class="badge
 
${j.side==='Long'?'badge-success':'badge-danger'}">${j.side}</span></t
d><td
 
class="font-mono"
 
style="color:var(--success)">+$${j.pnl}</td></tr>`;
 
    
});
 
    
html
 
+=
 
`</tbody></table>`;
 
    
container.innerHTML
 
=
 
html;
 
}
 
function
 
renderTagAnalytics()
 
{
 
    
const
 
container
 
=
 
document.getElementById('tagAnalytics');
 
    
if
 
(!container)
 
return;
 
    
container.innerHTML
 
=
 
`<div
 
style="margin-bottom:8px;"><div
 
style="display:flex;
 
justify-content:space-between;
 
font-size:12px;
 
margin-bottom:4px;"><span>Trend
 
Navigation</span><strong>+72%</strong></div><div
 
class="risk-bar"><div
 
class="risk-fill"
 
style="width:72%;
 
background:var(--success)"></div></div></div>`;
 
}
 
function
 
renderTradeNotes()
 
{
 
    
const
 
container
 
=
 
document.getElementById('tradeNotes');
 
    
if
 
(!container)
 
return;
 
    
container.innerHTML
 
=
 
`<div
 
style="background:var(--bg-primary);
 
border:1px
 
solid
 
var(--border);
 
padding:10px;
 
border-radius:var(--radius-sm);
 
font-size:12px;
 
font-style:italic;">"Standard
 
operating
 
rules
 
followed
 
on
 
entry
 
models."</div>`;
 
}
 
function
 
renderShortcutsHelp()
 
{
 
    
const
 
container
 
=
 
document.getElementById('shortcutsHelp');
 
    
if
 
(!container)
 
return;
 
    
container.innerHTML
 
=
 
`<div
 
class="shortcut-row"><span
 
class="badge
 
badge-warning">D</span>
 
<span>Go
 
Dashboard</span></div><div
 
class="shortcut-row"><span
 
class="badge
 
badge-warning">C</span>
 
<span>Go
 
Chat
 
Matrix</span></div><div
 
class="shortcut-row"><span
 
class="badge
 
badge-warning">/</span>
 
<span>Focus
 
Search
 
Inputs</span></div>`;
 
}
 
function
 
renderChatContainerMessages()
 
{
 
    
const
 
container
 
=
 
document.getElementById('chatMessages');
 
    
if
 
(!container)
 
return;
 
    
let
 
html
 
=
 
'';
 
    
globalStore.getState('chatHistory').forEach(msg
 
=>
 
{
 
        
html
 
+=
 
`<div
 
class="chat-message
 
${msg.sender}"><div
 
class="chat-avatar
 
${msg.sender}">${msg.sender==='ai'?'
🤖
':'PT'}</div><div
 
class="chat-bubble">${msg.text}</div></div>`;
 
    
});
 
    container.innerHTML  =  html;  
    
container.scrollTop
 
=
 
container.scrollHeight;
 
}
 
function
 
sendChatMessage()
 
{
 
    
const
 
input
 
=
 
document.getElementById('chatInput');
 
    
if
 
(!input
 
||
 
!input.value.trim())
 
return;
 
    
const
 
userText
 
=
 
input.value.trim();
 
    
const
 
history
 
=
 
globalStore.getState('chatHistory');
 
    
history.push({
 
text:
 
userText,
 
sender:
 
'user'
 
});
 
    
globalStore.setState('chatHistory',
 
history);
 
    
renderChatContainerMessages();
 
    
input.value
 
=
 
'';
 
    
 
    
setTimeout(()
 
=>
 
{
 
        
history.push({
 
text:
 
"Phoenix
 
Predictive
 
Node
 
confirmation:
 
Order
 
block
 
concentration
 
calculations
 
parsed
 
successfully.",
 
sender:
 
'ai'
 
});
 
        
globalStore.setState('chatHistory',
 
history);
 
        
renderChatContainerMessages();
 
    
},
 
1000);
 
}
 
 
📄