import { getAIResponse, classifyIntent } from './ai.js';
import { getWeatherForUserLocation } from './weather.js';
import { addTodo, renderTodos } from './todos.js';

const chat = document.getElementById('chat');
const input = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const todoInput = document.getElementById('todoInput');
const todoDate = document.getElementById('todoDate');
const addTodoBtn = document.getElementById('addTodoBtn');

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

async function handleSend() {
  const text = input.value.trim();
  if (!text) return;
  appendMessage('You', text);
  input.value = '';

  const intent = await classifyIntent(text);
  if (intent === 'weather') {
    const reply = await getWeatherForUserLocation();
    appendMessage('Assistant', reply);
    speak(reply);
  } else if (intent === 'todo') {
    addTodo(text, null);
    appendMessage('Assistant', 'Added to your to-do list.');
    speak('Added to your to-do list.');
  } else {
    const reply = await getAIResponse(text);
    appendMessage('Assistant', reply);
    speak(reply);
  }
}

function startVoiceInput() {
  const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  rec.lang = 'en-US';
  rec.start();
  rec.onresult = (e) => {
    input.value = e.results[0][0].transcript;
    handleSend();
  };
}

sendBtn.addEventListener('click', handleSend);
voiceBtn.addEventListener('click', startVoiceInput);
addTodoBtn.addEventListener('click', () => {
  if (!todoInput.value) return;
  addTodo(todoInput.value, todoDate.value);
  todoInput.value = '';
  todoDate.value = '';
});

window.onload = renderTodos;
