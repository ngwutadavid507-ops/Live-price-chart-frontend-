document.addEventListener('DOMContentLoaded',  ()  =>  {  
    
globalStore.setState('parentTrackAssets',
 
globalStore.getState('assets'));
 
    
wsService.connect();
 
    
navigateTo('dashboard');
 
    
showToast('Phoenix
 
Engine
 
Activated',
 
'System
 
architecture
 
fully
 
initialized.',
 
'success');
 
});