(function (global) {
    function Chatbot(options) {
        this.options = options || {};
        this.chatbotContainer = null;
        this.toggleButton = null;
        this.init();
    }

    Chatbot.prototype.init = function () {
        this.createChatbotElements();
        this.bindEvents();
        this.displayInitialMessage();
        this.applyCustomStyles();
    };

    Chatbot.prototype.createChatbotElements = function () {
        this.chatbotContainer = document.createElement('div');
        this.chatbotContainer.id = 'chatbot';
        this.chatbotContainer.innerHTML = `
            <div id="chatbot-header">
                <span id="chatbot-title">${this.options.title || 'Chatbot'}</span>
                <div>
                    <button id="restart-btn" class="text-white mr-2 bg-green-600">🔄</button>
                    <button id="clear-btn" class="text-white">🗑</button>
                    <button id="close-btn" class="text-white ml-2">✖</button>
                </div>
            </div>
            <div id="chatbot-messages"></div>
            <div id="suggested-messages" class="suggested-messages-container"></div>
            <div id="chatbot-input">
                <input type="text" id="user-input" placeholder="Type your message...">
                <button id="send-btn">Send</button>
            </div>
        `;
        document.body.appendChild(this.chatbotContainer);

        this.toggleButton = document.createElement('button');
        this.toggleButton.id = 'chatbot-toggle';
        this.toggleButton.textContent = '💬';
        document.body.appendChild(this.toggleButton);
    };

    Chatbot.prototype.bindEvents = function () {
        const chatbot = this;
        const closeBtn = this.chatbotContainer.querySelector('#close-btn');
        const sendBtn = this.chatbotContainer.querySelector('#send-btn');
        const userInput = this.chatbotContainer.querySelector('#user-input');
        const chatbotMessages = this.chatbotContainer.querySelector('#chatbot-messages');
        const restartBtn = this.chatbotContainer.querySelector('#restart-btn');
        const clearBtn = this.chatbotContainer.querySelector('#clear-btn');

        this.toggleButton.addEventListener('click', function () {
            chatbot.chatbotContainer.style.display = 'flex';
            chatbot.toggleButton.style.display = 'none';
        });

        closeBtn.addEventListener('click', function () {
            chatbot.chatbotContainer.style.display = 'none';
            chatbot.toggleButton.style.display = 'flex';
        });

        sendBtn.addEventListener('click', function () {
            chatbot.sendMessage(userInput, chatbotMessages);
        });

        userInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                chatbot.sendMessage(userInput, chatbotMessages);
            }
        });

        restartBtn.addEventListener('click', function () {
            chatbot.restartChat();
        });

        clearBtn.addEventListener('click', function () {
            chatbot.clearChat();
        });
    };

    Chatbot.prototype.displayInitialMessage = function () {
        if (this.options.initialMessage) {
            const chatbotMessages = this.chatbotContainer.querySelector('#chatbot-messages');
            this.addMessage('bot', this.options.initialMessage, chatbotMessages);
        }
        this.displaySuggestions();
    };

    Chatbot.prototype.sendMessage = function (userInput, chatbotMessages) {
        const message = userInput.value.trim();
        if (message) {
            this.addMessage('user', message, chatbotMessages);
            userInput.value = '';
            setTimeout(() => {
                this.addMessage('bot', this.getBotResponse(message), chatbotMessages);
            }, 500);
        }
    };

    Chatbot.prototype.addMessage = function (sender, message, chatbotMessages) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        const textElement = document.createElement('div');
        textElement.classList.add('text');
        textElement.textContent = message;
        messageElement.appendChild(textElement);
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    Chatbot.prototype.getBotResponse = function (message) {
        const responses = this.options.botResponses || {};
        return responses[message.toLowerCase()] || "Sorry, I didn't understand that.";
    };

    Chatbot.prototype.applyCustomStyles = function () {
        if (this.options.themeColor) {
            const header = this.chatbotContainer.querySelector('#chatbot-header');
            const sendBtn = this.chatbotContainer.querySelector('#send-btn');
            const toggleBtn = this.toggleButton;
            
            header.style.backgroundColor = this.options.themeColor;
            sendBtn.style.backgroundColor = this.options.themeColor;
            toggleBtn.style.backgroundColor = this.options.themeColor;
            this.chatbotContainer.querySelector('#chatbot-title').style.color = this.options.titleColor || 'white';
        }
    };

    Chatbot.prototype.displaySuggestions = function () {
        const suggestedMessages = this.chatbotContainer.querySelector('#suggested-messages');
        suggestedMessages.innerHTML = '';
        suggestedMessages.classList.add('suggested-messages-container');
    
        (this.options.suggestedMessages || []).forEach(msg => {
            const button = document.createElement('button');
            button.textContent = msg;
            button.classList.add('suggestion-btn');
            button.addEventListener('click', () => {
                this.sendMessage({ value: msg }, this.chatbotContainer.querySelector('#chatbot-messages'));
            });
            suggestedMessages.appendChild(button);
        });
        
        // Smooth horizontal scrolling for overflow
        suggestedMessages.addEventListener('wheel', (event) => {
            if (event.deltaX !== 0) {
                event.preventDefault();
                suggestedMessages.scrollBy({
                    left: event.deltaX,
                    behavior: 'smooth'
                });
            }
        });
    };

    Chatbot.prototype.restartChat = function () {
        const chatbotMessages = this.chatbotContainer.querySelector('#chatbot-messages');
        chatbotMessages.innerHTML = '';
        this.displayInitialMessage();
    };

    Chatbot.prototype.clearChat = function () {
        const chatbotMessages = this.chatbotContainer.querySelector('#chatbot-messages');
        chatbotMessages.innerHTML = '';
    };

    global.Chatbot = Chatbot;
})(window);

