const  routerRegistry  =  {};  
 
function
 
navigateTo(pageId)
 
{
 
    
if
 
(window.activePageCharts
 
&&
 
window.activePageCharts.length
 
>
 
0)
 
{
 
        
window.activePageCharts.forEach(chart
 
=>
 
{
 
            
if
 
(chart
 
&&
 
typeof
 
chart.destroy
 
===
 
'function')
 
chart.destroy();
 
        
});
 
        
window.activePageCharts
 
=
 
[];
 
    
}
 
 
    
globalStore.setState('currentPage',
 
pageId);
 
     
    
document.querySelectorAll('.nav-links
 
li').forEach(item
 
=>
 
{
 
        
if
 
(item.getAttribute('data-page')
 
===
 
pageId)
 
item.classList.add('active');
 
        
else
 
item.classList.remove('active');
 
    
});
 
 
    
const
 
pageTitleNode
 
=
 
document.getElementById('pageTitle');
 
    
if
 
(pageTitleNode)
 
pageTitleNode.textContent
 
=
 
pageId.toUpperCase();
 
 
    
const
 
workspace
 
=
 
document.getElementById('pageContent');
 
    
if
 
(workspace
 
&&
 
routerRegistry[pageId])
 
{
 
        
workspace.innerHTML
 
=
 
'';
 
        
workspace.appendChild(routerRegistry[pageId]());
 
        
 
        
initPageCharts(pageId);
 
        
triggerPageRenderers(pageId);
 
    
}
 
}
 
 
function
 
registerPage(pageId,
 
builderFn)
 
{
 
    
routerRegistry[pageId]
 
=
 
builderFn;
 
}
 
 
document.addEventListener('DOMContentLoaded',
 
()
 
=>
 
{
 
    
document.querySelectorAll('.nav-links
 
li').forEach(item
 
=>
 
{
 
        
item.addEventListener('click',
 
()
 
=>
 
navigateTo(item.getAttribute('data-page')));
 
    
});
 
});
 
 
📄