function  showModal(title,  contentElement)  {  
    
const
 
backdrop
 
=
 
document.createElement('div');
 
    
backdrop.id
 
=
 
'modalBackdrop';
 
    
backdrop.style.cssText
 
=
 
'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(
0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-in
dex:9999;';
 
    
const
 
modal
 
=
 
document.createElement('div');
 
    
modal.style.cssText
 
=
 
'background:var(--bg-secondary);border:1px
 
solid
 
var(--border);border-radius:var(--radius-md);width:90%;max-width:500px
;padding:20px;display:flex;flex-direction:column;gap:16px;';
 
    
modal.innerHTML
 
=
 
`<div
 
style="display:flex;justify-content:space-between;align-items:center;b
order-bottom:1px
 
solid
 
var(--border);padding-bottom:8px;"><h3
 
style="font-size:15px;">${title}</h3><span
 
id="closeModalBtn"
 
style="cursor:pointer;color:var(--text-muted);">
✕
</span></div>`;
 
    
const
 
body
 
=
 
document.createElement('div');
 
    
body.appendChild(contentElement);
 
    
modal.appendChild(body);
 
    
backdrop.appendChild(modal);
 
    
document.body.appendChild(backdrop);
 
    
document.getElementById('closeModalBtn').onclick
 
=
 
closeModal;
 
    
backdrop.onclick
 
=
 
(e)
 
=>
 
{
 
if
 
(e.target
 
===
 
backdrop)
 
closeModal();
 
};
 
}
 
function
 
closeModal()
 
{
 
    
const
 
backdrop
 
=
 
document.getElementById('modalBackdrop');
 
    
if
 
(backdrop)
 
backdrop.remove();
 
}
 
 
📄