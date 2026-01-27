document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const chatContainer = document.getElementById('chatContainer');
    const sendBtn = document.getElementById('sendBtn');
    const clearChatBtn = document.getElementById('clearChat');

    // Auto-resize textarea
    userInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value === '') this.style.height = 'auto';
    });

    // Handle Submit
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;

        // Add User Message
        addMessage(message, 'user');
        userInput.value = '';
        userInput.style.height = 'auto';

        // Disable input while loading
        setInputState(false);

        // Show Loading
        const loadingId = addLoadingIndicator();

        try {
            // Send to Backend
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            // Remove Loading
            removeMessage(loadingId);

            if (response.ok) {
                addMessage(data.response, 'ai');
            } else {
                addMessage(`Error: ${data.error || 'Something went wrong.'}`, 'ai');
            }

        } catch (error) {
            removeMessage(loadingId);
            addMessage('Error: Could not connect to the server. Is the backend running?', 'ai');
            console.error(error);
        } finally {
            setInputState(true);
            userInput.focus();
        }
    });

    // Handle Enter Key (Submit) / Shift+Enter (NewLine)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });

    // Clear Chat
    clearChatBtn.addEventListener('click', () => {
        if (confirm('Clear conversation history?')) {
            chatContainer.innerHTML = `
                <div class="message ai-message">
                    <div class="message-content">
                        <p>Chat cleared. Ready for new ideas!</p>
                    </div>
                </div>`;
        }
    });

    // Functions
    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender}-message`;

        // Basic Markdown Parser (Bold, Code)
        const formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');

        div.innerHTML = `
            <div class="message-content">
                <p>${formattedText}</p>
            </div>
            <div class="message-meta">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        `;

        chatContainer.appendChild(div);
        scrollToBottom();
    }

    function addLoadingIndicator() {
        const id = 'loading-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'typing-indicator';
        div.innerHTML = `
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        `;
        chatContainer.appendChild(div);
        scrollToBottom();
        return id;
    }

    function removeMessage(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function setInputState(enabled) {
        userInput.disabled = !enabled;
        sendBtn.disabled = !enabled;
        if (enabled) {
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        } else {
            sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
});
