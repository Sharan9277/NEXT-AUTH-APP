// app/api/translate/route.js
export async function POST(request) {
    const { text, targetLang } = await request.json();
  
    const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, target: targetLang, format: 'text' }),
    });
  
    const data = await res.json();
    return new Response(JSON.stringify({ translation: data.data.translations[0].translatedText }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  