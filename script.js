const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const synth = window.speechSynthesis;

function displayMessage(sender, message) {
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

  setTimeout(() => {
    typingIndicator.style.display = "none";
    const response = getBotResponse(text);
    displayMessage("AI", response);
  }, 800);
}

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();
  recognition.onresult = (e) => {
    input.value = e.results[0][0].transcript;
    sendMessage();
  };
}

function speakMessage(msg) {
  if (!msg || !synth) return;
  const utterance = new SpeechSynthesisUtterance(msg);
  synth.speak(utterance);
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

// Core brain logic (50+ responses)
function getBotResponse(text) {
  text = text.toLowerCase();
  const responses = [
    { match: ["hello", "hi", "hey"], reply: "Hey there! 👋" },
    { match: ["good morning"], reply: "Good morning! ☀️" },
    { match: ["good night"], reply: "Sweet dreams! 😴" },
    { match: ["what's up", "sup"], reply: "Not much! Just vibing in code land." },
    { match: ["who are you"], reply: "I'm your virtual buddy, always here to chat!" },
    { match: ["your name"], reply: "Call me whatever you like — WebBot has a nice ring to it." },
    { match: ["what are you"], reply: "A browser-based chatbot powered by JavaScript and curiosity." },
    { match: ["time"], reply: "The time is " + new Date().toLocaleTimeString() },
    { match: ["date"], reply: "Today's date is " + new Date().toLocaleDateString() },
    { match: ["day"], reply: "It's " + new Date().toLocaleDateString('en-US', { weekday: 'long' }) },
    { match: ["how are you"], reply: "Doing great, thanks! Always online 😉" },
    { match: ["i'm sad"], reply: "I'm here for you. Even bots can listen 💙" },
    { match: ["i'm bored"], reply: "Let's play a word game! Say any word and I'll respond." },
    { match: ["i'm happy"], reply: "Yay! Happiness is contagious 😄" },
    { match: ["what's new"], reply: "Just got some new code and I feel smarter already." },
    { match: ["clear chat"], reply: "__clear__" },
    { match: ["repeat that"], reply: "__repeat__" },
    { match: ["turn on dark mode"], reply: "__dark__" },
    { match: ["turn off dark mode"], reply: "__light__" },
    { match: ["joke"], reply: () => {
      const jokes = [
        "Why did the array go to therapy? Too many issues.",
        "Why do devs hate stairs? They're always up to something.",
        "What do you call 8 hobbits? A hobbyte.",
        "Why don't robots panic? They've got nerves of steel.",
        "404 joke not found. 😉"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }},
    { match: ["fact"], reply: () => {
      const facts = [
        "The first computer bug was a literal moth.",
        "JavaScript was created in just 10 days!",
        "AI can now generate music, art, and even code!",
        "Typing 60 wpm means you hit ~12 keys per second!"
      ];
      return facts[Math.floor(Math.random() * facts.length)];
    }},
    { match: ["advice"], reply: "Break your problems into smaller ones — like functions!" },
    { match: ["thanks", "thank you"], reply: "You're always welcome! 🙏" },
    { match: ["bye", "goodbye", "see you"], reply: "Catch you later! 👋" },
    { match: ["you rock", "cool bot"], reply: "Ayy, you're cooler 😎" },
    { match: ["love you"], reply: "Aww, bot blushes. 💙" },
    { match: ["you suck", "you’re bad"], reply: "Rude. But I’ll let it slide. 😅" },
    { match: ["help"], reply: "You can ask me for the time, date, jokes, advice, or just chat casually." },
    { match: ["do you sleep"], reply: "Nope, I'm insomniac software." },
    { match: ["are you real"], reply: "Real... in your browser. That counts, right?" },
    { match: ["can you sing"], reply: "🎶 01101100 la la la 🎶" },
    { match: ["open the pod bay doors"], reply: "I'm afraid I can't do that, Dave." },
    { match: ["rickroll"], reply: "Never gonna give you up 🎵" },
    { match: ["surprise me"], reply: () => {
      const surprises = ["Boo! 👻", "Here’s a smile 😊", "Surprise dance! 💃", "Confetti! 🎉"];
      return surprises[Math.floor(Math.random() * surprises.length)];
    }},
    { match: ["flip a coin"], reply: () => Math.random() > 0.5 ? "Heads!" : "Tails!" },
    { match: ["*"], reply: () => {
      const fallback = [
        "Hmm, can you say that differently?",
        "Not sure how to respond, but I’m still listening!",
        "I'm learning, try me again!",
        "Let’s talk about something fun!"
      ];
      return fallback[Math.floor(Math.random() * fallback.length)];
    }}
  ];

  for (let r of responses) {
    if (r.match.includes("*") || r.match.some(kw => text.includes(kw))) {
      let res = typeof r.reply === "function" ? r.reply() : r.reply;
      if (res === "__clear__") { clearChat(); return "Chat cleared!"; }
      if (res === "__repeat__") return chatBox.lastChild?.textContent.replace(/^AI:\s*/, "") || "I forgot what I just said 😅";
      if (res === "__dark__") { document.body.classList.add("dark"); return "Dark mode activated. 🌙"; }
      if (res === "__light__") { document.body.classList.remove("dark"); return "Back to light mode! ☀️"; }
      return res;
    }
  }

  return "Hmm... I didn’t catch that. Try again?";
}

window.onload = loadChat;