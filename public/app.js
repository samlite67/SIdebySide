// Simple JS for demo web app
const btn = document.getElementById('go');
const out = document.getElementById('result');
btn.onclick = async () => {
  const prompt = document.getElementById('prompt').value.trim();
  if (!prompt) return;
  out.textContent = '⏳ …waiting';
  try {
    const response = await fetch('/api/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });
    const data = await response.json();
    out.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    out.textContent = '❌ Error: ' + e;
  }
};
