const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
let recognition;

async function displayMessage(sender, message) {
  const div = document.createElement("div");
  div.className = "message";
  div.textContent = `${sender}: ${message}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  speakMessage(sender === "AI" ? message : null);
  saveChat();
}

function sendMessage() {
  const text = input.value.trim();
  if (text === "") return;
  displayMessage("You", text);
  input.value = "";

  const typingIndicator = document.getElementById("typing-indicator");
  typingIndicator.style.display = "block";

  setTimeout(async () => {
    typingIndicator.style.display = "none";
    try {
      const response = await getBotResponse(text);
      displayMessage("AI", response);
    } catch (error) {
      displayMessage("AI", `Oops, something went wrong. Error: ${error.message}`);
    }
  }, 800);
}

function startListening() {
  if (!recognition) {
    recognition = new webkitSpeechRecognition();
    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      console.log("Transcript:", transcript);  // Log the transcript
      input.value = transcript;
      sendMessage();
    };
    recognition.onerror = event => {
      console.error("Speech recognition error detected: " + event.error);
    };
  }
  recognition.start();
}

function saveChat() {
  localStorage.setItem("chat", chatBox.innerHTML);
}

function loadChat() {
  const saved = localStorage.getItem("chat");
  if (saved) chatBox.innerHTML = saved;
}

function clearChat() {
  localStorage.removeItem("chat");
  chatBox.innerHTML = "";
}

function speakMessage(message) {
  if (message && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  }
}

async function getBotResponse(text) {
  text = text.toLowerCase();
  const requestPayload = {
    model: "mistral-7b",  // Ensure you're using the correct model
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: text }
    ]
  };

  try {
    const response = await fetch('https://api.openrouter.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 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`, // Replace with your key
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestPayload)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API Response:", data);  // Log the API response for debugging

    if (data && data.choices && data.choices.length > 0) {
      const randomChoice = data.choices[Math.floor(Math.random() * data.choices.length)];
      return randomChoice.message.content.trim();
    } else {
      throw new Error('No valid response from the API');
    }
  } catch (error) {
    console.error("Error fetching API response:", error);
    throw error;  // Rethrow the error to be caught in the sendMessage function
  }
}

// Helper function to determine the season
function getSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  if (month >= 8 && month <= 10) return "Autumn";
  return "Winter";
}

window.onload = loadChat;

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


