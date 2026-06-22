function  triggerPageRenderers(pageId)  {  
    
if
 
(pageId
 
===
 
'dashboard')
 
{
 
        
renderMarketLeaders();
 
renderTopMovers();
 
renderRecentSignals();
 
    
}
 
else
 
if
 
(pageId
 
===
 
'markets')
 
{
 
        
renderAllMarkets();
 
renderExchangeRankings();
 
    
}
 
else
 
if
 
(pageId
 
===
 
'orderflow')
 
{
 
        
renderOrderBook();
 
renderWhaleAlerts();
 
    
}
 
else
 
if
 
(pageId
 
===
 
'signals')
 
{
 
        
renderSignalFeed();
 
renderBacktestResults();
 
    
}
 
else
 
if
 
(pageId
 
===
 
'portfolio')
 
{
 
        renderOpenPositions();  renderWatchlist();  
renderRiskDashboard();
 
    
}
 
else
 
if
 
(pageId
 
===
 
'ai')
 
{
 
        
renderAIPredictions();
 
renderModelPerformance();
 
    
}
 
else
 
if
 
(pageId
 
===
 
'aichat')
 
{
 
        
renderChatContainerMessages();
 
    
}
 
else
 
if
 
(pageId
 
===
 
'beginner')
 
{
 
        
renderBeginnerLessons();
 
renderRiskCalculator();
 
renderPaperPortfolio();
 
renderTradingGlossary();
 
renderSimpleSignals();
 
    
}
 
else
 
if
 
(pageId
 
===
 
'protools')
 
{
 
        
renderOrderSimulator();
 
renderQuickTrade();
 
renderCustomIndicators();
 
renderAdvancedAlerts();
 
renderExportReports();
 
    
}
 
else
 
if
 
(pageId
 
===
 
'journal')
 
{
 
        
renderJournalDetail();
 
renderTagAnalytics();
 
renderTradeNotes();
 
    
}
 
else
 
if
 
(pageId
 
===
 
'shortcuts')
 
{
 
        
renderShortcutsHelp();
 
    
}
 
}
 
 
📄