const HF_API_KEY = "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";

export async function getAIResponse(prompt) {
  const res = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1", {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ inputs: prompt })
  });
  const data = await res.json();
  return data[0]?.generated_text?.slice(prompt.length).trim() || "Sorry, I couldn't understand that.";
}

export async function classifyIntent(text) {
  const keywords = {
    weather: ['weather', 'forecast', 'temperature'],
    todo: ['remind me', 'add task', 'to-do']
  };
  const lower = text.toLowerCase();
  for (const [intent, keys] of Object.entries(keywords)) {
    if (keys.some(k => lower.includes(k))) return intent;
  }
  return 'general';
}
