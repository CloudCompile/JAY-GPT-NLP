const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
let recognition;
const apiKey = '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'; // Your OpenRouter API key

// Function to display messages in the chatbox
function displayMessage(sender, message) {
  const div = document.createElement("div");
  div.className = "message";
  div.textContent = `${sender}: ${message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  speakMessage(sender === "AI" ? message : null);
  saveChat();
}

// Send user input to the OpenRouter API
async function sendMessage() {
  const text = input.value.trim();
  if (text === "") return;
  displayMessage("You", text);
  input.value = "";

  const typingIndicator = document.getElementById("typing-indicator");
  typingIndicator.style.display = "block";

  // Wait for the response from the API
  try {
    const response = await getBotResponse(text);
    typingIndicator.style.display = "none";
    displayMessage("AI", response);
  } catch (error) {
    typingIndicator.style.display = "none";
    displayMessage("AI", "Oops, something went wrong. Please try again.");
    console.error("Error:", error);
  }
}

// Function to start listening for speech input
function startListening() {
  if (!recognition) {
    recognition = new webkitSpeechRecognition();
    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      input.value = transcript;
      sendMessage();
    };
    recognition.onerror = event => {
      console.error("Speech recognition error detected: " + event.error);
    };
  }
  recognition.start();
}

// Save chat to localStorage
function saveChat() {
  localStorage.setItem("chat", chatBox.innerHTML);
}

// Load chat from localStorage
function loadChat() {
  const saved = localStorage.getItem("chat");
  if (saved) chatBox.innerHTML = saved;
}

// Clear the chat
function clearChat() {
  localStorage.removeItem("chat");
  chatBox.innerHTML = "";
}

// Function to convert message to speech
function speakMessage(message) {
  if (message && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  }
}

// API call to OpenRouter for generating responses
async function getBotResponse(userMessage) {
  const apiUrl = 'https://api.openrouter.ai/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
  
  const body = JSON.stringify({
    model: 'mistral-7b',
    messages: [{ role: 'user', content: userMessage }],
  });

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: headers,
    body: body
  });

  const data = await response.json();
  if (data && data.choices && data.choices[0]) {
    return data.choices[0].message.content.trim();
  } else {
    throw new Error('Failed to get a response from the API');
  }
}

window.onload = loadChat;

// Register the service worker for offline use
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}


