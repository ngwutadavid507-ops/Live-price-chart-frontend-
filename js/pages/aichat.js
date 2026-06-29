/**
 * AI Chat Page — market assistant powered by Groq
 */

function renderAIChat() {
  const container = document.getElementById('pageContent');
  if (!container) return;

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Phoenix AI Chat</h1>
      <p class="page-subtitle">Real-time market intelligence assistant</p>
    </div>

    <div class="card" style="margin-bottom:16px">
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <span style="font-size:12px;color:var(--text-muted)">Context Symbol:</span>
        <input type="text" id="chatSymbolContext"
          placeholder="e.g. BTCUSDT"
          style="background:var(--bg-primary);border:1px solid var(--border);
                 padding:6px 10px;border-radius:var(--radius-sm);
                 color:#fff;width:120px;font-size:12px">
        <button class="btn btn-sm" onclick="_clearChatHistory()">Clear Chat</button>
        <div style="margin-left:auto;font-size:11px;color:var(--text-muted)">
          Powered by Groq llama-3.3-70b
        </div>
      </div>
    </div>

    <!-- Chat Window -->
    <div class="card" style="margin-bottom:16px">
      <div id="chatMessages"
        style="height:400px;overflow-y:auto;display:flex;
               flex-direction:column;gap:12px;padding:4px">
      </div>
    </div>

    <!-- Input -->
    <div class="card">
      <div style="display:flex;gap:8px">
        <input type="text" id="chatInput"
          placeholder="Ask about any market, signal, or trade setup..."
          style="flex:1;background:var(--bg-primary);border:1px solid var(--border);
                 padding:8px 12px;border-radius:var(--radius-sm);
                 color:#fff;font-size:13px"
          onkeydown="if(event.key==='Enter') sendChatMessage()">
        <button class="btn btn-primary" onclick="sendChatMessage()">Send</button>
      </div>

      <!-- Quick prompts -->
      <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">
        <button class="btn btn-sm" onclick="_quickPrompt('What is the current BTC market structure?')">
          BTC Structure
        </button>
        <button class="btn btn-sm" onclick="_quickPrompt('Which altcoins show bullish confluence right now?')">
          Bullish Alts
        </button>
        <button class="btn btn-sm" onclick="_quickPrompt('Explain CVD and how to use it for entries')">
          CVD Explained
        </button>
        <button class="btn btn-sm" onclick="_quickPrompt('What are the key support and resistance levels for ETH?')">
          ETH Levels
        </button>
      </div>
    </div>
  `;

  renderChatContainerMessages();
}


function _quickPrompt(text) {
  const input = document.getElementById('chatInput');
  if (input) {
    input.value = text;
    sendChatMessage();
  }
}


function _clearChatHistory() {
  globalStore.setState('chatHistory', [
    {
      text:   "Chat cleared. I'm Phoenix AI — ask me anything about the markets.",
      sender: 'ai',
    }
  ]);
  renderChatContainerMessages();
}
