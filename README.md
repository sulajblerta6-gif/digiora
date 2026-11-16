# DIGIORA – AI starter

Ky është kodi fillestar për ta kthyer prototipin në aplikacion web me gjenerim përmes Gemini API.

## Çfarë përmban
- `public/index.html` – ndërfaqja responsive në shqip.
- `src/worker.js` – backend Cloudflare Worker; çelësi API mbahet në server, jo në shfletues.
- `wrangler.toml` – konfigurimi bazë i Cloudflare.

## Konfigurimi
1. Krijo një projekt në Google AI Studio dhe gjenero një Gemini API key.
2. Krijo një llogari Cloudflare dhe instalo Wrangler.
3. Vendos çelësin si sekret, jo në HTML:
   `npx wrangler secret put GEMINI_API_KEY`
4. Publiko Worker-in dhe aktivizo static assets për `public/` sipas dokumentacionit aktual të Cloudflare.
5. Testo `/api/lesson` me një temë shembull.

## Siguria dhe privatësia
- Mos vendos çelësin API në kodin e frontend-it.
- Mos dërgo emra, foto, diagnoza, PI/PEI apo të dhëna identifikuese të nxënësve në modelin publik.
- Plani falas i Gemini API mund të ketë kufij përdorimi dhe Google deklaron se përmbajtja në planin falas mund të përdoret për përmirësimin e produkteve. Kontrollo kushtet para përdorimit me të dhëna reale.
- Ky starter nuk ka ende regjistrim, ruajtje projektesh, role përdoruesish, kufizim kërkesash apo kontroll administratori.
- Nuk është publikuar. Duhet konfiguruar dhe testuar para se të përdoret nga mësuesit.

## Shënim
Emri i modelit dhe endpoint-i mund të ndryshojnë. Verifiko modelin aktiv dhe kushtet në dokumentacionin zyrtar të Gemini API para publikimit.
