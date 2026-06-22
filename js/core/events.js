document.addEventListener('keydown',  (e)  =>  {  
    
if
 
(e.target.tagName
 
===
 
'INPUT'
 
||
 
e.target.tagName
 
===
 
'TEXTAREA')
 
return;
 
    
const
 
shortcutMap
 
=
 
{
 
        
'd':
 
'dashboard',
 
'm':
 
'markets',
 
'a':
 
'analysis',
 
'o':
 
'orderflow',
 
        
's':
 
'signals',
 
'p':
 
'portfolio',
 
'i':
 
'ai',
 
'c':
 
'aichat',
 
        
'b':
 
'beginner',
 
't':
 
'protools',
 
'j':
 
'journal',
 
'h':
 
'shortcuts'
 
    
};
 
    
const
 
targetPage
 
=
 
shortcutMap[e.key.toLowerCase()];
 
    
if
 
(targetPage)
 
{
 
        
e.preventDefault();
 
        navigateTo(targetPage);  
    
}
 
    
if
 
(e.key
 
===
 
'/')
 
{
 
        
e.preventDefault();
 
        
const
 
chatInput
 
=
 
document.getElementById('chatInput');
 
        
if
 
(chatInput)
 
chatInput.focus();
 
    
}
 
});
 
 
window.addEventListener('scroll',
 
()
 
=>
 
{
 
    
const
 
scrollTop
 
=
 
document.documentElement.scrollTop
 
||
 
document.body.scrollTop;
 
    
const
 
scrollHeight
 
=
 
document.documentElement.scrollHeight
 
-
 
document.documentElement.clientHeight;
 
    
const
 
progress
 
=
 
scrollHeight
 
>
 
0
 
?
 
(scrollTop
 
/
 
scrollHeight)
 
*
 
100
 
:
 
0;
 
    
const
 
progressNode
 
=
 
document.getElementById('scrollProgress');
 
    
if
 
(progressNode)
 
progressNode.style.width
 
=
 
`${progress}%`;
 
});
 
 
📄