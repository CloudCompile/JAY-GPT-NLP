const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
let chatHistory = [];
let conversationState = {};

if (localStorage.getItem('chatHistory')) {
    chatHistory = JSON.parse(localStorage.getItem('chatHistory'));
    chatHistory.forEach(message => appendMessage(message.sender, message.text, false));
}

function appendMessage(sender, text, save = true) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${sender}: ${text}`;
    chatLog.appendChild(messageDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
    if (save) {
        chatHistory.push({ sender, text });
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
}

function getBotResponse(message) {
    message = message.toLowerCase();

    // Contextual responses
    if (conversationState.name) {
        if (message.includes('weather')) {
            return `Okay, ${conversationState.name}, let me pretend to check the weather. It's sunny!`;
        } else if (message.includes('favorite color')) {
            return `I don't have a favorite color, ${conversationState.name}, but I like the color of code!`;
        } else if (message.includes('how old am i')) {
            if(conversationState.age) {
                return `You told me you are ${conversationState.age} years old ${conversationState.name}.`;
            } else {
                return `I do not know your age ${conversationState.name}.`;
            }
        }
    }

    // More responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return 'Hello there! How can I help you?';
    } else if (message.includes('how are you') || message.includes('how are you doing')) {
        return "I'm doing well, thank you!";
    } else if (message.includes('your name') || message.includes('who are you')) {
        return "I'm a simple chatbot created with HTML, CSS, and JavaScript.";
    } else if (message.includes('what is the time')) {
        return `The current time is ${new Date().toLocaleTimeString()}.`;
    } else if (message.includes('what is the date')) {
        return `The current date is ${new Date().toLocaleDateString()}.`;
    } else if (message.includes('my name is')) {
        conversationState.name = message.split('my name is ')[1].trim();
        return `Nice to meet you, ${conversationState.name}!`;
    } else if (message.includes('clear history')) {
        localStorage.removeItem('chatHistory');
        chatHistory = [];
        chatLog.innerHTML = "";
        return "Chat history cleared.";
    } else if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
        return 'Goodbye! Have a great day.';
    } else if (message.includes('what is') && message.includes('plus')) {
        let numbers = message.match(/(\d+)/g);
        if (numbers && numbers.length === 2) {
            return `${numbers[0]} plus ${numbers[1]} equals ${parseInt(numbers[0]) + parseInt(numbers[1])}`;
        } else {
            return "Please provide two numbers to add.";
        }
    } else if (message.includes('what is') && message.includes('minus')) {
        let numbers = message.match(/(\d+)/g);
        if (numbers && numbers.length === 2) {
            return `${numbers[0]} minus ${numbers[1]} equals ${parseInt(numbers[0]) - parseInt(numbers[1])}`;
        } else {
            return "Please provide two numbers to subtract.";
        }
    } else if (message.includes('what is') && message.includes('multiplied by')) {
        let numbers = message.match(/(\d+)/g);
        if (numbers && numbers.length === 2) {
            return `${numbers[0]} multiplied by ${numbers[1]} equals ${parseInt(numbers[0]) * parseInt(numbers[1])}`;
        } else {
            return "Please provide two numbers to multiply.";
        }
    } else if (message.includes('what is') && message.includes('divided by')) {
        let numbers = message.match(/(\d+)/g);
        if (numbers && numbers.length === 2) {
            return `${numbers[0]} divided by ${numbers[1]} equals ${parseInt(numbers[0]) / parseInt(numbers[1])}`;
        } else {
            return "Please provide two numbers to divide.";
        }
    } else if (message.includes('tell me a joke')) {
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "What do you call a fish with no eyes? Fsh!",
            "Why did the scarecrow win an award? Because he was outstanding in his field!",
            "What do you call a lazy kangaroo? A pouch potato.",
            "I'm reading a book on anti-gravity. It's impossible to put down!"
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    } else if (message.includes('how to')) {
        return "I can't provide detailed instructions, but you can find many tutorials online.";
    } else if (message.includes('my age is')) {
        conversationState.age = message.split('my age is ')[1].trim();
        return `Okay, I'll remember you are ${conversationState.age}.`;
    } else if (message.includes('what is my favorite')) {
        return "I do not know your favorite things.";
    } else if (message.includes('repeat after me')) {
        return message.replace("repeat after me", "");
    } else {
        return "I don't understand. Please try again.";
    }
}

sendButton.addEventListener('click', () => {
    const message = userInput.value;
    if (message.trim() !== '') {
        appendMessage('You', message);
        userInput.value = '';
        const response = getBotResponse(message);
        setTimeout(() => appendMessage('Bot', response), 500);
    }
});

userInput.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        sendButton.click();
    }
});