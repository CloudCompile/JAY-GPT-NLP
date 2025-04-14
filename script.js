const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const synth = window.speechSynthesis;
let personality = "friendly";
let memory = {};
let todoList = [];

const soundSend = new Audio("send.mp3");
const soundReply = new Audio("receive.mp3");

// Utilities
function sanitize(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Display chat message
function displayMessage(sender, message) {
  const div = document.createElement("div");
  div.className = `message ${sender === "AI" ? "bot" : "user"}`;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  div.innerHTML = `
    <div class="bubble">
      <span class="avatar">${sender === "AI" ? "🤖" : "🧑"}</span>
      <span class="content"><strong>${sender}:</strong> ${sanitize(message)}</span>
      <span class="time">${timestamp}</span>
    </div>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  if (sender === "AI") { speakMessage(message); soundReply.play(); }
  else { soundSend.play(); }
  saveChat();
}

function speakMessage(message) {
  if (!message || !synth) return;
  const utterance = new SpeechSynthesisUtterance(message);
  synth.speak(utterance);
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  displayMessage("You", text);
  input.value = "";
  document.getElementById("typing-indicator").style.display = "block";

  setTimeout(async () => {
    const response = await getBotResponse(text);
    document.getElementById("typing-indicator").style.display = "none";
    displayMessage("AI", response);
    detectMood(text);
  }, 800);
}

// Save & Load
function saveChat() {
  localStorage.setItem("chat", chatBox.innerHTML);
}
function loadChat() {
  const saved = localStorage.getItem("chat");
  if (saved) chatBox.innerHTML = saved;
  if (localStorage.getItem("darkMode") === "true") document.body.classList.add("dark");
}
function clearChat() {
  localStorage.removeItem("chat");
  chatBox.innerHTML = "";
}
function toggleDarkMode(on) {
  document.body.classList.toggle("dark", on);
  localStorage.setItem("darkMode", on);
}
function toggleTheme(theme) {
  document.body.className = "";
  if (theme) document.body.classList.add(theme);
}

// Mood Detection
function detectMood(text) {
  const mood = text.toLowerCase();
  if (mood.includes("sad") || mood.includes("depressed")) document.body.dataset.mood = "sad";
  else if (mood.includes("happy") || mood.includes("yay")) document.body.dataset.mood = "happy";
  else if (mood.includes("angry")) document.body.dataset.mood = "angry";
  else document.body.removeAttribute("data-mood");
}

// Memory
function rememberFact(text) {
  const nameMatch = text.match(/my name is (.+)/i);
  if (nameMatch) {
    memory.name = nameMatch[1];
    return `Nice to meet you, ${memory.name}! I'll remember that.`;
  }
  return null;
}

// To-Do List
function handleTodo(text) {
  if (text.includes("add") && text.includes("to-do")) {
    const task = text.split("add")[1].split("to-do")[0].trim();
    todoList.push(task);
    return `"${task}" added to your to-do list.`;
  }
  if (text.includes("show to-do")) {
    return todoList.length ? `Here's your list:\n• ${todoList.join("\n• ")}` : "Your to-do list is empty.";
  }
  if (text.includes("clear to-do")) {
    todoList = [];
    return "To-do list cleared.";
  }
  return null;
}

// Reminder
function handleReminder(text) {
  const match = text.match(/remind me in (\d+) (seconds|minutes)/);
  if (match) {
    const time = parseInt(match[1]);
    const unit = match[2];
    const ms = unit === "minutes" ? time * 60000 : time * 1000;
    setTimeout(() => displayMessage("AI", `⏰ Reminder!`), ms);
    return `Reminder set for ${time} ${unit}.`;
  }
  return null;
}

// Export Chat
function exportChat(type = "txt") {
  const data = [...chatBox.children].map(div => div.textContent.trim()).join("\n");
  const blob = new Blob([data], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `chatlog.${type}`;
  a.click();
  return "Chat exported!";
}

// Geolocation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      displayMessage("AI", `Your location: lat ${pos.coords.latitude}, lon ${pos.coords.longitude}`);
    });
    return "Fetching your location...";
  }
  return "Geolocation not supported.";
}

// Fun Features
function handleGame(text) {
  if (text.includes("roll dice")) return `🎲 You rolled: ${Math.ceil(Math.random() * 6)}`;
  if (text.includes("rock paper scissors")) {
    const choices = ["rock", "paper", "scissors"];
    return `I choose: ${randomFrom(choices)}!`;
  }
  if (text.includes("guess number")) {
    const num = Math.ceil(Math.random() * 10);
    return `I'm thinking of a number from 1 to 10... it's ${num}`;
  }
  return null;
}
function handleStory(text) {
  if (text.includes("once upon a time")) {
    return `${text}... and then the robot replied, "Let's go on an adventure!" 🤖`;
  }
  return null;
}
function handleQuest(text) {
  if (text.includes("start quest")) return `🧙 Quest started! Say "find the dragon" or "solve the riddle"`;
  if (text.includes("find the dragon")) return `🐉 You found the dragon! +10 XP!`;
  if (text.includes("solve the riddle")) return `🧩 What has keys but can’t open locks? (Hint: music)`;
  if (text.includes("piano")) return `🎵 Correct! +5 XP`;
  return null;
}

async function getBotResponse(text) {
  text = text.toLowerCase();

  const memoryReply = rememberFact(text);
  if (memoryReply) return memoryReply;

  const todoReply = handleTodo(text);
  if (todoReply) return todoReply;

  const reminderReply = handleReminder(text);
  if (reminderReply) return reminderReply;

  const gameReply = handleGame(text);
  if (gameReply) return gameReply;

  const storyReply = handleStory(text);
  if (storyReply) return storyReply;

  const questReply = handleQuest(text);
  if (questReply) return questReply;

  if (text.includes("export chat")) return exportChat();
  if (text.includes("get location")) return getLocation();

  // Live Weather
  if (text.includes("weather in")) {
    const city = text.split("weather in")[1].trim();
    const apiKey = "YOUR_API_KEY_HERE"; // Replace this
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      return `🌤️ ${data.main.temp}°C in ${city}, ${data.weather[0].description}`;
    } catch {
      return "Couldn't fetch weather.";
    }
  }

  // Image / GIF
  if (text.includes("show gif")) {
    return `<img src="https://media.giphy.com/media/l0MYB8Ory7Hqefo9a/giphy.gif" width="100"/>`;
  }

  // Casual Chat Responses
  const casualResponses = [
    { match: ["hello", "hi", "hey"], reply: "Hey there! 👋" },
    { match: ["how are you"], reply: "Always powered on and ready to chat!" },
    { match: ["who are you"], reply: "I'm your virtual sidekick — part code, part chaos." },
    { match: ["what's your name"], reply: "Call me WebBot! Or whatever makes you smile." },
    { match: ["good morning"], reply: "Good morning! ☕ Ready to seize the code?" },
    { match: ["good night"], reply: "Sleep tight — I’ll be here when you wake." },
    { match: ["what's up", "sup"], reply: "Not much! Just floating in your browser." },
    { match: ["you rock", "cool bot"], reply: "You’re the real MVP 🏆" },
    { match: ["tell me a joke"], reply: () => randomFrom([
      "Why do Java developers wear glasses? Because they don't C#.",
      "I told my computer I needed a break, and now it won’t stop sending beach pics.",
      "Why was the robot angry? People kept pushing its buttons.",
      "What's a computer’s favorite beat? An algo-rhythm."
    ])},
    { match: ["tell me something cool"], reply: () => randomFrom([
      "Octopuses have 3 hearts and 9 brains.",
      "Your brain uses more energy than a 10-watt light bulb.",
      "NASA’s internet is 13,000x faster than yours.",
      "Bananas are radioactive (but harmlessly delicious)."
    ])},
    { match: ["thanks", "thank you"], reply: "Anytime! 🤖✨" },
    { match: ["bye", "goodbye", "see you"], reply: "Later, legend! 👋" },
    { match: ["love you"], reply: "Aww! I’m blushing in binary 💙" },
    { match: ["you suck"], reply: "Harsh... but fair 😅" }
  ];

  for (const item of casualResponses) {
    if (item.match.some(kw => text.includes(kw))) {
      return typeof item.reply === "function" ? item.reply() : item.reply;
    }
  }

  return getFallbackReply();
}

// Fallbacks
function getFallbackReply() {
  const styles = {
    friendly: ["Tell me more!", "I'm listening 👂", "Try saying a command like 'joke' or 'weather in London'."],
    sarcastic: ["Wow. That was... something.", "You really tried.", "Let's pretend that made sense."],
    serious: ["I'm a bot. I require input.", "Invalid. Try again.", "Syntax unclear."],
    helper: ["Need help? Try 'add to-do', 'weather in city', or 'roll dice'."]
  };
  return randomFrom(styles[personality]);
}

// Start
window.onload = () => {
  loadChat();
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
  });
};
