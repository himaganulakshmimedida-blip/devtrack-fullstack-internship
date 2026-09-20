async function generateAI(prompt) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3.2:3b',
      prompt: prompt,
      stream: false,
    }),
  })

  if (!response.ok) {
    throw new Error('Ollama request failed')
  }

  const data = await response.json()

  return data.response
}

module.exports = {
  generateAI,
}