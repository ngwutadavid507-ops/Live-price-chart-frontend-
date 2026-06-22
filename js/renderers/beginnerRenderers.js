function  renderBeginnerLessons()  {  
    
const
 
container
 
=
 
document.getElementById('beginnerLessons');
 
    
if
 
(!container)
 
return;
 
    
const
 
lessons
 
=
 
[
 
        
{
 
num:
 
1,
 
title:
 
'What
 
is
 
Cryptocurrency?',
 
desc:
 
'Understanding  blockchain  structure  and  logic  networks',  completed:  
true
 
},
 
        
{
 
num:
 
2,
 
title:
 
'Reading
 
Price
 
Charts',
 
desc:
 
'Candlesticks,
 
timeframe
 
horizons,
 
and
 
base
 
price
 
setups',
 
completed:
 
true
 
},
 
        
{
 
num:
 
3,
 
title:
 
'Risk
 
Management
 
Architecture',
 
desc:
 
'Position
 
sizing
 
configurations
 
and
 
protective
 
stop
 
targets',
 
completed:
 
false
 
}
 
    
];
 
    
let
 
html
 
=
 
'';
 
    
lessons.forEach(l
 
=>
 
{
 
        
html
 
+=
 
`<div
 
class="lesson-card
 
${l.completed
 
?
 
'completed'
 
:
 
''}"><div
 
style="display:flex;align-items:center;gap:12px"><div
 
class="lesson-number">${l.num}</div><div
 
style="flex:1"><div
 
class="lesson-title">${l.title}</div><div
 
class="lesson-desc">${l.desc}</div></div><span>${l.completed
 
?
 
'
✓
'
 
:
 
'
🔒
'}</span></div></div>`;
 
    
});
 
    
container.innerHTML
 
=
 
html;
 
}
 
function
 
renderRiskCalculator()
 
{
 
    
const
 
container
 
=
 
document.getElementById('riskCalculator');
 
    
if
 
(!container)
 
return;
 
    
container.innerHTML
 
=
 
`<div
 
class="risk-calc-row"><span>Account
 
Base
 
Balance</span><input
 
type="text"
 
class="risk-calc-input"
 
value="$10,000"></div><div
 
class="risk-calc-row"><span>Risk
 
Threshold
 
Percent</span><input
 
type="text"
 
class="risk-calc-input"
 
value="1%"></div><div
 
class="risk-calc-result"><div
 
class="risk-calc-result-label">Max
 
Risk
 
Allocation
 
Limit</div><div
 
class="risk-calc-result-value">$100.00</div></div>`;
 
}
 
function
 
renderPaperPortfolio()
 
{
 
    
const
 
container
 
=
 
document.getElementById('paperPortfolio');
 
    
if
 
(!container)
 
return;
 
    
const
 
p
 
=
 
globalStore.getState('paperPortfolio');
 
    
container.innerHTML
 
=
 
`<div
 
style="text-align:center;"><div
 
class="paper-balance">${formatters.price(p.balance)}</div><div
 
class="badge
 
badge-success">${formatters.pct(p.pct24h)}</div></div>`;
 
}
 
function
 
renderTradingGlossary()
 
{
 
    
const
 
container
 
=
 
document.getElementById('tradingGlossary');
 
    
if
 
(!container)
 
return;
 
    
container.innerHTML
 
=
 
`<div
 
class="glossary-item"><div
 
class="glossary-term">HODL</div><div
 
class="glossary-def">Persistent
 
accumulation
 
approach
 
ignoring
 
short
 
term
 
price
 
data.</div></div><div
 
class="glossary-item"><div
 
class="glossary-term">DCA</div><div
 
class="glossary-def">Dollar-Cost
 
Averaging
 
across
 
fixed
 
structural
 
intervals.</div></div>`;
 
}
 
function  renderSimpleSignals()  {  
    
const
 
container
 
=
 
document.getElementById('simpleSignals');
 
    
if
 
(!container)
 
return;
 
    
container.innerHTML
 
=
 
`<div
 
class="signal-item"
 
style="border-left:4px
 
solid
 
var(--success);"><div><strong>BTC
 
Safe
 
Zone</strong><br><small>Favorable
 
long-term
 
risk
 
parameters
 
detected</small></div><span
 
class="badge
 
badge-success">BUY</span></div>`;
 
}
 
 
📄