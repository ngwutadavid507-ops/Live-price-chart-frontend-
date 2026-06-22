registerPage('aichat',  ()  =>  {  
    
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
 
class="chat-window">
 
            
<div
 
class="chat-messages"
 
id="chatMessages"></div>
 
            
<div
 
class="chat-input-area">
 
                
<input
 
type="text"
 
id="chatInput"
 
class="chat-input"
 
placeholder="Ask
 
Phoenix
 
AI
 
Quantum
 
Analytics
 
node...">
 
                
<button
 
class="btn
 
btn-primary"
 
id="sendChatBtn">Query
 
Engine</button>  
            
</div>
 
        
</div>
 
    
`;
 
    
setTimeout(()
 
=>
 
{
 
        
const
 
btn
 
=
 
document.getElementById('sendChatBtn');
 
        
const
 
input
 
=
 
document.getElementById('chatInput');
 
        
if
 
(btn
 
&&
 
input)
 
{
 
            
btn.onclick
 
=
 
()
 
=>
 
sendChatMessage();
 
            
input.onkeydown
 
=
 
(e)
 
=>
 
{
 
if
 
(e.key
 
===
 
'Enter')
 
sendChatMessage();
 
};
 
        
}
 
    
},
 
50);
 
    
return
 
view;
 
});
 
 
📄