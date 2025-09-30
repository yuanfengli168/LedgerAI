
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
        console.log('Rendering message: ', msg);
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
        // Call backend for AI response
        const aiText = await fetchAIChatResponse(userText);
        // Animate streaming effect
        await streamAIMessage(aiText, aiMsgIndex);
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

async function fetchAIChatResponse(userText) {
    // You may need to adjust the API endpoint and payload as per your backend
    try {
        const res = await fetch('http://127.0.0.1:8000/api/submit-reviewed-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_message: userText })
        });
        const data = await res.json();
        console.log('AI response data: ', data);
        return data.ai_answer.gpt_answer || 'No answer from AI.';
    } catch (e) {
        return 'Error: Unable to get AI response.';
    }
}

async function streamAIMessage(text, msgIndex) {
    const messagesDiv = document.getElementById('aiChatMessages');
    let i = 0;
    let html = '';
    while (i < text.length) {
        html += escapeHTML(text[i]);
        aiChatMessages[msgIndex] = { role: 'ai', content: html + '<span class="ai-chatbox-blinker">|</span>' };
        renderAIChatMessages();
        await new Promise(r => setTimeout(r, 18 + Math.random() * 30));
        i++;
    }
    // Remove blinker at end
    aiChatMessages[msgIndex] = { role: 'ai', content: html };
    renderAIChatMessages();
}