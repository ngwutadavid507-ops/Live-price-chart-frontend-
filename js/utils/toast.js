function  showToast(title,  text,  type  =  'info')  {  
    
const
 
container
 
=
 
document.getElementById('toastContainer');
 
    
if
 
(!container)
 
return;
 
    
const
 
toast
 
=
 
document.createElement('div');
 
    
toast.style.cssText
 
=
 
`background:var(--bg-secondary);border-left:4px
 
solid
 
var(--${type
 
===
 
'success'
 
?
 
'success'
 
:
 
type
 
===
 
'danger'
 
?
 
'danger'
 
:
 
'accent'});padding:12px;margin-bottom:8px;border-radius:var(--radius-s
m);box-shadow:0
 
4px
 
12px
 
rgba(0,0,0,0.5);transition:opacity
 
0.3s;`;
 
    
toast.innerHTML
 
=
 
`<div
 
style="font-weight:700;font-size:12px;margin-bottom:2px;">${title}</di
v><div
 
style="font-size:11px;color:var(--text-secondary);">${text}</div>`;  
    
container.appendChild(toast);
 
    
setTimeout(()
 
=>
 
{
 
toast.style.opacity
 
=
 
'0';
 
setTimeout(()
 
=>
 
toast.remove(),
 
300);
 
},
 
4000);
 
}
 
 
📄