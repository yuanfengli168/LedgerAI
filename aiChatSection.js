
// --- AI Chatbox Implementation ---
const aiChatSection = document.querySelector('.AI-chat-section');
let aiChatMessages = [];

// Call this function to initialize the AI chatbox
function renderAIChat() {
    aiChatSection.classList.remove('hidden');
    aiChatSection.innerHTML = `
        <div class="ai-chatbox-container">
            <div class="ai-chatbox-messages" id="aiChatMessages"></div>
            <form class="ai-chatbox-input-row" id="aiChatInputForm" autocomplete="off">
                <input class="ai-chatbox-input" id="aiChatInput" type="text" placeholder="Type your question..." autocomplete="off" required />
                <button class="ai-chatbox-submit" type="submit">Send</button>
            </form>
        </div>
    `;
    renderAIChatMessages();
    setupAIChatInput();
}

// Render all messages in the chatbox
function renderAIChatMessages() {
    const messagesDiv = document.getElementById('aiChatMessages');
    if (!messagesDiv) return;
    messagesDiv.innerHTML = '';
    aiChatMessages.forEach(msg => {
        const div = document.createElement('div');
        div.className = `ai-message ${msg.role}`;
        // Support rendering HTML content safely
        div.innerHTML = msg.content;
        messagesDiv.appendChild(div);
        
    });
    // Auto-scroll to bottom
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function setupAIChatInput() {
    const form = document.getElementById('aiChatInputForm');
    const input = document.getElementById('aiChatInput');
    if (!form || !input) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const userText = input.value.trim();
        if (!userText) return;
        // Add user message
        aiChatMessages.push({ role: 'user', content: escapeHTML(userText) });
        renderAIChatMessages();
        input.value = '';
        // Add placeholder for AI message with blinking cursor
        const aiMsgIndex = aiChatMessages.length;
        aiChatMessages.push({ role: 'ai', content: '<span class="ai-chatbox-blinker">|</span>' });
        renderAIChatMessages();
        // Call backend for AI streaming response
        await fetchAIChatResponseStream(userText, aiMsgIndex);
    };
}

function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function(tag) {
        const charsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return charsToReplace[tag] || tag;
    });
}


// Streaming fetch for AI chat
async function fetchAIChatResponseStream(userText, msgIndex) {
    try {
        const res = await fetch('http://127.0.0.1:8000/api/submit-reviewed-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_message: userText })
        });
        if (!res.body) throw new Error('No response body');
        const reader = res.body.getReader();
        let decoder = new TextDecoder();
        // let buffer = '';
        let html = '';
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            html += escapeHTML(chunk);
            aiChatMessages[msgIndex] = { role: 'ai', content: html + '<span class="ai-chatbox-blinker">|</span>' };
            renderAIChatMessages();
        }
        // Render final message
        aiChatMessages[msgIndex] = { role: 'ai', content: html };
        renderAIChatMessages();
    } catch (e) {
        aiChatMessages[msgIndex] = { role: 'ai', content: 'Error: Unable to get AI response.' };
        renderAIChatMessages();
    }
}