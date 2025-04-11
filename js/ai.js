const HF_API_KEY = "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";

export async function getAIResponse(prompt) {
  try {
    const res = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1", {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!res.ok) {
      throw new Error("Error with the Hugging Face API: " + res.statusText);
    }

    const data = await res.json();

    // Check if the response structure is correct
    if (data && data[0] && data[0].generated_text) {
      return data[0].generated_text.slice(prompt.length).trim();
    } else {
      throw new Error("Invalid response structure from Hugging Face API");
    }
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Sorry, something went wrong. Please try again.";
  }
}
