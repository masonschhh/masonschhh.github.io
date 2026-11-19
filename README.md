# Mason Schindler

Persönliches Portfolio & CV: Design, Fotografie, Film und Podcast.

Website: https://masonschindler.ch/

## Aufbau

Statische Seite ohne Build – einfach die Dateien bearbeiten und pushen.

- `index.html` – alle Inhalte (Texte, Projekte, Fotos mit Aufnahmedaten, Filme, Podcast, Lebenslauf)
- `style.css` – Design (Farben und Abstände oben als Variablen)
- `app.js` – Animationen und Interaktionen; Projekttexte für die Detailansicht stehen oben in `cases`
- `vendor/` – GSAP + ScrollTrigger (Scroll-Animationen) und Lenis (Smooth Scroll), lokal eingebunden
- `fonts/` – Geist, Geist Mono, Instrument Serif (lokal)
- `thumbs/` – kleine Vorschaubilder für den Bild-Trail im Einstieg
- Medien (Bilder, Videos, Podcast) liegen im Hauptordner

`CNAME` nicht löschen.

## Animationen

Preloader mit Zähler · Bild-Trail hinter dem Namen (Maus bzw. automatisch auf dem Handy) · Name fliegt beim Scrollen auseinander · scroll-reaktive Laufbänder · Text, der sich Wort für Wort beim Scrollen füllt · gestapelte Projekt-Karten · gepinnte, seitliche Fotostrecke · Film-Fenster, das beim Scrollen aufgeht · Podcast-Player mit Live-Visualizer · Farbwechsel der Seite je Abschnitt · Custom Cursor und magnetische Buttons (nur mit Maus).

Bei «Bewegung reduzieren» im Betriebssystem entfallen Animationen und Smooth Scroll; alle Inhalte bleiben sichtbar. Ohne JavaScript ist die Seite ebenfalls vollständig lesbar.

## Easter Egg

Das letzte «R» in «SCHINDLER» öffnet Snake.
