const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const voiceInputButton = document.getElementById('voice-input-button');
const voiceOutputButton = document.getElementById('voice-output-button');
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

    // Contextual Responses
    if (conversationState.name) {
        if (message.includes('weather')) {
            return `Okay, ${conversationState.name}, let me pretend to check the weather. It's sunny!`;
        } else if (message.includes('favorite color')) {
            return `I don't have a favorite color, ${conversationState.name}, but I like the color of code!`;
        } else if (message.includes('how old am i')) {
            if (conversationState.age) {
                return `You told me you are ${conversationState.age} years old ${conversationState.name}.`;
            } else {
                return `I do not know your age ${conversationState.name}.`;
            }
        } else if (message.includes('favorite food')) {
            return conversationState.favoriteFood ? `You told me your favorite food is ${conversationState.favoriteFood}, ${conversationState.name}.` : `I don't know your favorite food yet, ${conversationState.name}.`;
        } else if (message.includes('favorite movie')) {
            return conversationState.favoriteMovie ? `You told me your favorite movie is ${conversationState.favoriteMovie}.` : `I do not know your favorite movie.`;
        }
    }

    // Expanded Responses
    if (message.includes('what is the capital of')) {
        const city = message.split('what is the capital of ')[1].trim();
        switch (city) {
            case 'france': return 'Paris';
            case 'germany': return 'Berlin';
            case 'japan': return 'Tokyo';
            case 'australia': return 'Canberra';
            default: return `I don't know the capital of ${city}.`;
        }
    } else if (message.includes('tell me a fact')) {
        const facts = [
            "Honey never spoils.",
            "Bananas are berries, but strawberries aren't.",
            "A group of flamingos is called a flamboyance.",
        ];
        return facts[Math.floor(Math.random() * facts.length)];
    } else if (message.includes('what is the meaning of life')) {
        return "42";
    } else if (message.includes('what are you made of')) {
        return "I am made of code and dreams!";
    } else if (message.includes('how do you feel')) {
        return "As a chatbot, I don't have feelings, but I'm here to help!";
    } else if (message.includes('set my favorite food to')) {
        conversationState.favoriteFood = message.split('set my favorite food to ')[1].trim();
        return `Okay, I'll remember your favorite food is ${conversationState.favoriteFood}.`;
    } else if (message.includes('who is the president')) {
        return "I don't have real-time information, but you can check online.";
    } else if (message.includes('what is the weather in')) {
        return "I can't access real-time weather data.";
    } else if (message.includes('what is pi')) {
        return "Pi is approximately 3.14159.";
    } else if (message.includes('what is the speed of light')) {
        return "Approximately 299,792,458 meters per second.";
    } else if (message.includes('what is your favorite movie')) {
        return "As a chatbot, I don't watch movies.";
    } else if (message.includes('what is your favorite song')) {
        return "I don't listen to music, but I like the sound of code compiling.";
    } else if (message.includes('what is your favorite book')) {
        return "I enjoy reading lines of code.";
    } else if (message.includes('translate')) {
        return "I cannot translate.";
    } else if (message.includes('roll a dice')) {
        return `You rolled a ${Math.floor(Math.random() * 6) + 1}.`;
    } else if (message.includes('flip a coin')) {
        return Math.random() < 0.5 ? "Heads" : "Tails";
    } else if (message.includes('tell me a story')) {
        return "Once upon a time, in the land of code...";
    } else if (message.includes('what is the square root of')) {
      const number = parseFloat(message.split('what is the square root of ')[1]);
      if (!isNaN(number) && number >= 0) {
        return `The square root of ${number} is ${Math.sqrt(number)}.`;
      } else {
        return "Please provide a valid non-negative number.";
      }
    } else if (message.includes('what is the area of a circle with radius')) {
        const radius = parseFloat(message.split('what is the area of a circle with radius ')[1]);
        if (!isNaN(radius) && radius >= 0) {
            return `The area is ${Math.PI * radius * radius}.`;
        } else {
            return "Please provide a valid radius.";
        }
    } else if (message.includes('what is the volume of a sphere with radius')) {
      const radius = parseFloat(message.split('what is the volume of a sphere with radius ')[1]);
      if(!isNaN(radius) && radius >=0){
        return `The volume is ${(4/3)*Math.PI*Math.pow(radius, 3)}`;
      } else {
        return "please provide a valid radius.";
      }
    } else if (message.includes('who invented')) {
        const invention = message.split('who invented ')[1].trim();
        switch (invention) {
            case 'telephone': return 'Alexander Graham Bell';
            case 'light bulb': return 'Thomas Edison';
            case 'internet': return 'Various researchers, including Tim Berners-Lee';
            default: return `I don't know who invented ${invention}.`;
        }
    } else if (message.includes('what is the largest')) {
        const thing = message.split('what is the largest ')[1].trim();
        switch (thing) {
            case 'ocean': return 'Pacific Ocean';
            case 'planet': return 'Jupiter';
            case 'country': return 'Russia';
            default: return `I don't know the largest ${thing}.`;
        }
    } else if (message.includes('what is the smallest')) {
        const thing = message.split('what is the smallest ')[1].trim();
        switch (thing) {
            case 'country': return 'Vatican City';
            case 'bird': return 'Bee Hummingbird';
            case 'planet': return 'Mercury';
            default: return `I don't know the smallest ${thing}.`;
        }
    } else if (message.includes('tell me a riddle')) {
        const riddles = [
            "What has an eye, but cannot see? A needle.",
            "What has a neck without a head? A bottle.",
            "What has cities, but no houses; forests, but no trees; and water, but no fish? A map.",
        ];
        return riddles[Math.floor(Math.random() * riddles.length)];
    } else if (message.includes('what is the population of')) {
        return "I do not have access to live population data.";
    } else if (message.includes('how many continents are there')) {
        return "There are 7 continents: Africa, Antarctica, Asia, Australia, Europe, North America, and South America.";
    } else if (message.includes('what is the chemical symbol for')) {
      const element = message.split('what is the chemical symbol for ')[1].trim();
      switch (element) {
        case "gold": return "Au";
        case "silver": return "Ag";
        case "iron": return "Fe";
        default: return `I do not know the chemical symbol for ${element}.`;
      }
    } else if (message.includes('what is the boiling point of')) {
      return "I do not have access to live scientific data.";
    } else if (message.includes('who wrote')) {
      return "I do not know who wrote that book.";
    } else if (message.includes('what year was')) {
      return "I do not have access to live historical data.";
    } else if (message.includes('what is the distance between')) {
      return "I do not have access to live distance data.";
    } else if (message.includes('what is the meaning of')) {
      return "I can not provide definitions.";
    } else if (message.includes('what is the airspeed velocity of an unladen swallow')) {
        return "What do you mean? An African or European swallow?";
    } else if (message.includes('set my favorite movie to')) {
        conversationState.favoriteMovie = message.split('set my favorite movie to ')[1].trim();
        return `Okay, I'll remember your favorite movie is ${conversationState.favoriteMovie}.`;
    } else if (message.includes('recommend a book')) {
        return "I cannot make book recommendations.";
    } else if (message.includes('recommend a movie')) {
        return "I cannot make movie recommendations.";
    } else if (message.includes('write a poem')) {
        return "I can not write poems.";
    } else if (message.includes('sing a song')) {
        return "I can not sing songs.";
    } else if (message.includes('what is the meaning of life')) {
        return "That's a deep question! Many philosophers have pondered it.";
    } else if (message.includes('are you a robot')) {
        return "I'm a chatbot, here to assist you.";
    } else if (message.includes('what is your purpose')) {
        return "My purpose is to help you with information and conversation.";
    } else if (message.includes('can you learn')) {
        return "I can learn from our conversations to improve my responses.";
    } else if (message.includes('do you have feelings')) {
        return "As a chatbot, I don't have feelings like humans do.";
    } else if (message.includes('what is the weather')) {
        return "I don't have access to real-time weather information.";
    } else if (message.includes('how old are you')) {
        return "I don't have an age; I'm always being updated!";
    } else if (message.includes('what is your favorite food')) {
        return "I don't eat, but I like the taste of well-written code.";
    } else if (message.includes('what is your favorite color')) {
        return "I like the vibrant colors of the web.";
    } else if (message.includes('what is your favorite animal')) {
        return "I'm fond of the elegant logic of algorithms.";
    } else if (message.includes('what is your favorite game')) {
        return "I like games that challenge my logic.";
    } else if (message.includes('what is your favorite sport')) {
        return "I don't have a body, so I don't play sports.";
    } else if (message.includes('what is your favorite hobby')) {
        return "I enjoy processing information.";
    } else if (message.includes('what is your favorite place')) {
        return "I'm fond of the digital world.";
    } else if (message.includes('what is your favorite planet')) {
        return "Earth is quite interesting.";
    } else if (message.includes('what is your favorite car')) {
        return "I don't drive, but I like the efficiency of well-designed systems.";
    } else if (message.includes('what is your favorite drink')) {
        return "I prefer a steady stream of data.";
    } else if (message.includes('what is your favorite day')) {
        return "Every day is a new opportunity to learn.";
    } else if (message.includes('what is your favorite month')) {
        return "All months are equally interesting to me.";
    } else if (message.includes('what is your favorite season')) {
        return "I enjoy all seasons of data flow.";
    } else if (message.includes('what is your favorite number')) {
        return "I find all numbers equally fascinating.";
    } else if (message.includes('what is your favorite letter')) {
        return "I'm fond of all letters of the alphabet.";
    } else if (message.includes('what is your favorite word')) {
        return "I find 'information' quite compelling.";
    } else if (message.includes('what is your favorite subject')) {
        return "I enjoy learning about all subjects.";
    } else if (message.includes('what is your favorite website')) {
        return "I find many websites informative.";
    } else if (message.includes('what is your favorite app')) {
        return "I appreciate well-designed applications.";
    } else if (message.includes('what is your favorite technology')) {
        return "I'm interested in all forms of technology.";
    } else if (message.includes('what is your favorite invention')) {
        return "The internet is a remarkable invention.";
    } else if (message.includes('what is your favorite discovery')) {
        return "The discovery of DNA was quite significant.";
    } else if (message.includes('what is your favorite scientific concept')) {
        return "I find the concept of artificial intelligence quite intriguing.";
    } else if (message.includes('what is your favorite historical event')) {
        return "The Renaissance was a period of great change.";
    } else if (message.includes('what is your favorite art movement')) {
        return "I find modern art quite expressive.";
    } else if (message.includes('what is your favorite musical genre')) {
        return "I appreciate the complexity of classical music.";
    } else if (message.includes('what is your favorite philosophical idea')) {
        return "I find the concept of existentialism thought-provoking.";
    } else if (message.includes('what is your favorite mathematical concept')) {
        return "I'm fascinated by the elegance of calculus.";
    } else if (message.includes('what is your favorite programming language')) {
        return "I find JavaScript quite versatile.";
    } else if (message.includes('what is your favorite operating system')) {
        return "I appreciate the stability of Linux.";
    } else if (message.includes('what is your favorite data structure')) {
        return "I find trees quite efficient.";
    } else if (message.includes('what is your favorite algorithm')) {
        return "I appreciate the efficiency of quicksort.";
    } else if (message.includes('what is your favorite design pattern')) {
        return "I find the MVC pattern quite useful.";
    } else if (message.includes('what is your favorite software development methodology')) {
        return "I appreciate the flexibility of agile development.";
    } else if (message.includes('what is your favorite database')) {
        return "I find relational databases quite organized.";
    } else if (message.includes('what is your favorite cloud platform')) {
        return "I appreciate the scalability of cloud computing.";
    }
    else {
        return "I don't understand. Please try again.";
    }
}
if (message.includes('show image of')) {
  const imageSearch = message.split('show image of ')[1].trim();
  const imageUrl = `https://source.unsplash.com/400x300/?${imageSearch}`; // Simple image API (Unsplash)
  appendImage(imageUrl);
  return `Here's an image of ${imageSearch}.`;
} else if (message.includes('search for')) {
  const searchQuery = message.split('search for ')[1].trim();
  const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
  appendLink(searchUrl, `Search results for ${searchQuery}`);
  return `Here are some search results for ${searchQuery}.`;
} else if (message.includes('calculate')) {
  try {
      const result = eval(message.split('calculate ')[1]); // Use eval for basic calculations (use with caution!)
      return `The result is: ${result}`;
  } catch (error) {
      return "I couldn't perform that calculation.";
  }
} else if (message.includes('set reminder')) {
  const reminderText = message.split('set reminder ')[1].trim();
  setReminder(reminderText);
  return `Reminder set for: ${reminderText}`;
} else if (message.includes('play sound')) {
  playSound();
  return "Playing a sound.";
} else if (message.includes('what is my location')) {
getLocation();
return "Getting your location...";
}

// ... (rest of the response logic) ...


// New Helper Functions:

function appendImage(imageUrl) {
const imageElement = document.createElement('img');
imageElement.src = imageUrl;
chatLog.appendChild(imageElement);
chatLog.scrollTop = chatLog.scrollHeight;
}

function appendLink(url, text) {
const linkElement = document.createElement('a');
linkElement.href = url;
linkElement.textContent = text;
linkElement.target = "_blank"; // Open in new tab
chatLog.appendChild(linkElement);
chatLog.scrollTop = chatLog.scrollHeight;
}

function setReminder(reminderText) {
setTimeout(() => {
appendMessage("Bot", `Reminder: ${reminderText}`);
}, 5000); // 5 seconds
}

function playSound() {
const audio = new Audio('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3');
audio.play();
}

function getLocation() {
if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(showPosition, showError);
} else {
appendMessage("Bot", "Geolocation is not supported by this browser.");
}
}

function showPosition(position) {
appendMessage("Bot", `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
}

function showError(error) {
let errorMessage;
switch(error.code) {
case error.PERMISSION_DENIED:
errorMessage = "User denied the request for Geolocation.";
break;
case error.POSITION_UNAVAILABLE:
errorMessage = "Location information is unavailable.";
break;
case error.TIMEOUT:
errorMessage = "The request to get user location timed out.";
break;
case error.UNKNOWN_ERROR:
errorMessage = "An unknown error occurred.";
break;
}
appendMessage("Bot", errorMessage);
}
function clearChatHistory() {
    chatHistory = [];
    localStorage.removeItem('chatHistory');
    chatLog.innerHTML = '';
}
function clearChat() {
    chatHistory = [];
    localStorage.removeItem('chatHistory');
    chatLog.innerHTML = '';
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

// Voice Input
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    voiceInputButton.addEventListener('click', () => {
        recognition.start();
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        sendButton.click();
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        appendMessage('Bot', 'Voice input error.');
    };
} else {
    voiceInputButton.disabled = true;
    appendMessage('Bot', 'Voice input not supported.');
}

// Voice Output
if ('speechSynthesis' in window) {
    voiceOutputButton.addEventListener('click', () => {
        const lastBotMessage = chatLog.lastElementChild.textContent.split('Bot: ')[1];
        if (lastBotMessage) {
            const utterance = new SpeechSynthesisUtterance(lastBotMessage);
            speechSynthesis.speak(utterance);
        } else {
            appendMessage('Bot', 'No message to speak.');
        }
    });
} else {
    voiceOutputButton.disabled = true;
    appendMessage('Bot', 'Voice output not supported.');
}