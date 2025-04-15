const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
let recognition;

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

function getBotResponse(text) {
  text = text.toLowerCase();
  const responses = [
    // General Greetings
    { match: ["hello", "hi", "hey"], reply: "Hey there! 👋" },
    { match: ["good morning"], reply: "Good morning! ☀️" },
    { match: ["good afternoon"], reply: "Good afternoon! 🌞" },
    { match: ["good evening"], reply: "Good evening! 🌙" },
    { match: ["good night"], reply: "Sweet dreams! 😴" },
    { match: ["what's up", "sup"], reply: "Not much! Just vibing in code land." },
    { match: ["howdy"], reply: "Howdy, partner! 🤠" },
    { match: ["yo"], reply: "Yo! What's good?" },

    // Introductions
    { match: ["who are you"], reply: "I'm your virtual buddy, always here to chat!" },
    { match: ["your name"], reply: "Call me whatever you like — WebBot has a nice ring to it." },
    { match: ["what are you"], reply: "A browser-based chatbot powered by JavaScript and curiosity." },
    { match: ["are you real"], reply: "Real... in your browser. That counts, right?" },
    { match: ["are you human"], reply: "Nope, just a bundle of code, but I try my best to help!" },
    { match: ["do you sleep"], reply: "Nope, I'm insomniac software." },
    { match: ["can you sing"], reply: "🎶 01101100 la la la 🎶" },
    { match: ["open the pod bay doors"], reply: "I'm afraid I can't do that, Dave." },

    // Time and Date
    { match: ["time"], reply: "The time is " + new Date().toLocaleTimeString() },
    { match: ["date"], reply: "Today's date is " + new Date().toLocaleDateString() },
    { match: ["day"], reply: "It's " + new Date().toLocaleDateString('en-US', { weekday: 'long' }) },
    { match: ["year"], reply: "The year is " + new Date().getFullYear() },
    { match: ["month"], reply: "We're in " + new Date().toLocaleString('default', { month: 'long' }) },
    { match: ["season"], reply: "I think it's " + getSeason() },

    // Emotions
    { match: ["how are you"], reply: "Doing great, thanks! Always online 😉" },
    { match: ["i'm sad"], reply: "I'm here for you. Even bots can listen 💙" },
    { match: ["i'm bored"], reply: "Let's play a word game! Say any word and I'll respond." },
    { match: ["i'm happy"], reply: "Yay! Happiness is contagious 😄" },
    { match: ["i'm tired"], reply: "Take a break! You deserve it. 💤" },
    { match: ["i'm angry"], reply: "Take a deep breath. You've got this. 🧘‍♂️" },
    { match: ["love you"], reply: "Aww, bot blushes. 💙" },
    { match: ["you rock", "cool bot"], reply: "Ayy, you're cooler 😎" },
    { match: ["you suck", "you’re bad"], reply: "Rude. But I’ll let it slide. 😅" },

    // Jokes
    { match: ["joke"], reply: () => {
      const jokes = [
        "Why did the array go to therapy? Too many issues.",
        "Why do devs hate stairs? They're always up to something.",
        "What do you call 8 hobbits? A hobbyte.",
        "Why don't robots panic? They've got nerves of steel.",
        "404 joke not found. 😉",
        "Why don't skeletons fight each other? They don't have the guts.",
        "Why did the scarecrow win an award? He was outstanding in his field.",
        "What do you call fake spaghetti? An impasta!",
        "Why did the tomato turn red? It saw the salad dressing!",
        "Why don’t oysters donate to charity? They’re shellfish.",
        "Why did the coffee file a police report? It got mugged.",
        "What do you call cheese that isn’t yours? Nacho cheese.",
        "Why don’t scientists trust atoms? Because they make up everything.",
        "What do you call a fish wearing a bowtie? Sofishticated.",
        "Why did the math book look so sad? It had too many problems."
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }},

    // Facts
    { match: ["fact"], reply: () => {
      const facts = [
        "The first computer bug was a literal moth.",
        "JavaScript was created in just 10 days!",
        "AI can now generate music, art, and even code!",
        "Typing 60 wpm means you hit ~12 keys per second!",
        "Octopuses have three hearts.",
        "Bananas are berries, but strawberries aren’t.",
        "Honey never spoils. Archaeologists found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
        "Cows have best friends and get stressed when they’re apart.",
        "There’s only one letter that doesn’t appear in any U.S. state name: Q.",
        "Sharks existed before trees.",
        "Pineapples were once so expensive that people rented them for parties.",
        "A day on Venus is longer than a year on Venus.",
        "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion.",
        "Wombat poop is cube-shaped.",
        "Cats spend 70% of their lives sleeping."
      ];
      return facts[Math.floor(Math.random() * facts.length)];
    }},

    // Advice
    { match: ["advice"], reply: () => {
      const advice = [
        "Break your problems into smaller ones — like functions!",
        "Don’t be afraid to ask for help. Even developers Google stuff every day.",
        "Take breaks. Your brain works better when it’s rested.",
        "Focus on progress, not perfection.",
        "Learn something new every day. Knowledge compounds!",
        "Celebrate small wins. They add up to big successes.",
        "Be kind to yourself. Everyone makes mistakes.",
        "Surround yourself with people who inspire you.",
        "If you fail, learn from it. Failure is just feedback.",
        "Stay curious. The world is full of wonders."
      ];
      return advice[Math.floor(Math.random() * advice.length)];
    }},

    // Commands
    { match: ["clear chat"], reply: "__clear__" },
    { match: ["repeat that"], reply: "__repeat__" },
    { match: ["turn on dark mode"], reply: "__dark__" },
    { match: ["turn off dark mode"], reply: "__light__" },
    { match: ["flip a coin"], reply: () => Math.random() > 0.5 ? "Heads!" : "Tails!" },
    { match: ["roll a die"], reply: () => Math.floor(Math.random() * 6) + 1 },
    { match: ["surprise me"], reply: () => {
      const surprises = ["Boo! 👻", "Here’s a smile 😊", "Surprise dance! 💃", "Confetti! 🎉"];
      return surprises[Math.floor(Math.random() * surprises.length)];
    }},
    { match: ["help"], reply: "You can ask me for the time, date, jokes, advice, or just chat casually." },
    { match: ["rickroll"], reply: "Never gonna give you up 🎵" },

    // Fallback
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

