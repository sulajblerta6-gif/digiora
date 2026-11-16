export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/lesson" && request.method === "POST") {
      if (!env.GEMINI_API_KEY) return json({error:"Mungon çelësi GEMINI_API_KEY në konfigurimin sekret të serverit."}, 500);
      let input;
      try { input = await request.json(); } catch { return json({error:"Kërkesë jo e vlefshme."}, 400); }
      const required = ["grade","subject","topic","type","duration","level"];
      if (required.some(k => !input[k] || typeof input[k] !== "string")) return json({error:"Plotëso klasën, lëndën dhe temën."}, 400);

      const prompt = `Je një ekspert i kurrikulës dhe metodologjisë së arsimit parauniversitar në Shqipëri. Përgatit një paketë të plotë mësimore në gjuhën shqipe.
Të dhënat:
Klasa: ${input.grade}
Lënda: ${input.subject}
Tema: ${input.topic}
Lloji: ${input.type}
Kohëzgjatja: ${input.duration}
Niveli: ${input.level}
Kërkesa shtesë: ${input.notes || "Asnjë"}

Kthe VETËM JSON të vlefshëm, pa markdown, me fushat:
learning_outcomes: array me 3-5 rezultate të matshme;
key_words: array me 4-8 fjalë kyçe;
resources_cross_curricular: string me burimet dhe lidhjet ndërkurrikulare;
lesson_flow: array me 5-7 hapa të orës, me udhëzime konkrete për mësuesin dhe nxënësit;
quiz: array me 5 pyetje, secila objekt {question, options: array me 4 alternativa, correct_answer, explanation};
worksheet: array me 5 ushtrime të përshtatshme për klasën;
homework: array me dy objekte {level, tasks}, niveli 1 bazë dhe niveli 2 sfidues;
assessment: array me kritere dhe tregues të vëzhgueshëm;
presentation_outline: array me 5-7 slajde, secili objekt {slide_title, slide_content};
digital_tools: array me 3-5 ide konkrete për Canva, Wordwall, Kahoot/Wayground, iSLCollective ose YouTube. Mos pretendo se ke krijuar apo publikuar materiale në këto platforma; jep përmbajtjen dhe udhëzimet që mësuesi mund t'i transferojë.
Mos shpik standarde zyrtare apo citime. Përshtat gjuhën dhe vështirësinë me klasën. Mos kërko dhe mos përfshi të dhëna personale të nxënësve.`;

      const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent";
      const response = await fetch(endpoint, {
        method:"POST",
        headers:{"Content-Type":"application/json","x-goog-api-key":env.GEMINI_API_KEY},
        body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:"application/json",temperature:0.65}})
      });
      const result = await response.json();
      if (!response.ok) return json({error:result.error?.message || "Shërbimi IA nuk u përgjigj."}, response.status);
      const text = result.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("") || "";
      try { return json(JSON.parse(text)); }
      catch { return json({error:"Përgjigjja e IA-së nuk ishte JSON i vlefshëm. Provo përsëri."}, 502); }
    }
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response("DIGIORA API is running.", {headers:{"Content-Type":"text/plain; charset=utf-8"}});
  }
};
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*","Cache-Control":"no-store"}});}
